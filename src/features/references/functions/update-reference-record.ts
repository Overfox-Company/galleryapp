import "server-only";

import { randomUUID } from "node:crypto";
import path from "node:path";
import { mkdir, rename, rm } from "node:fs/promises";
import { db } from "@/lib/db";
import { safeFilename } from "../utils/storage-names";
import { getReferencePath, getStagingPath } from "../utils/upload-paths";
import type { ReferenceUpdateInput } from "../validators/reference-schema";
import type { StagedAsset } from "./get-staged-upload";

type Assets = { logo: StagedAsset[]; web: StagedAsset[]; mobile: StagedAsset[] };
type Move = { from: string; to: string };

function originalName(filename: string) {
  return filename.replace(/^\d{6}-/, "");
}

export async function updateReferenceRecord(input: ReferenceUpdateInput, assets: Assets) {
  const reference = await db.reference.findUnique({
    where: { id: input.referenceId },
    include: { screenshots: { orderBy: [{ platform: "asc" }, { position: "asc" }] } },
  });
  if (!reference) throw new Error("La referencia ya no existe.");
  if (assets.logo.length > 1) throw new Error("Selecciona un solo logo.");
  if (!input.hasWeb && assets.web.length) throw new Error("Activa la versión web antes de subir capturas.");
  if (!input.hasMobile && assets.mobile.length) throw new Error("Activa la versión mobile antes de subir capturas.");

  const requestedDeletes = new Set(input.deletedScreenshotIds);
  const deleted = reference.screenshots.filter((image) =>
    requestedDeletes.has(image.id) || (image.platform === "WEB" ? !input.hasWeb : !input.hasMobile),
  );
  const deletedIds = new Set(deleted.map((image) => image.id));
  const remainingWeb = reference.screenshots.filter((image) => image.platform === "WEB" && !deletedIds.has(image.id));
  const remainingMobile = reference.screenshots.filter((image) => image.platform === "MOBILE" && !deletedIds.has(image.id));

  if (input.hasWeb && remainingWeb.length + assets.web.length === 0) throw new Error("Agrega capturas web.");
  if (input.hasMobile && remainingMobile.length + assets.mobile.length === 0) throw new Error("Agrega capturas mobile.");

  const stagingRoot = getStagingPath(input.sessionId);
  const backupRoot = getStagingPath(input.sessionId, ".removed");
  const completedMoves: Move[] = [];

  const move = async (from: string, to: string) => {
    await mkdir(path.dirname(to), { recursive: true });
    await rename(from, to);
    completedMoves.push({ from, to });
  };

  const moveIfPresent = async (from: string, to: string) => {
    try {
      await move(from, to);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  };

  try {
    for (const image of deleted) {
      const folder = image.platform.toLowerCase();
      await moveIfPresent(
        getReferencePath(reference.slug, folder, image.filename),
        path.join(backupRoot, folder, `${image.id}-${image.filename}`),
      );
    }

    let logoPath = reference.logoPath;
    if (assets.logo[0]) {
      const oldLogoName = path.basename(reference.logoPath);
      await moveIfPresent(getReferencePath(reference.slug, "logo", oldLogoName), path.join(backupRoot, "logo", oldLogoName));
      const logoName = `${randomUUID()}-${safeFilename(originalName(assets.logo[0].filename))}`;
      await move(assets.logo[0].absolutePath, getReferencePath(reference.slug, "logo", logoName));
      logoPath = `/media/${reference.slug}/logo/${logoName}`;
    }

    const newScreenshots: {
      platform: "WEB" | "MOBILE";
      path: string;
      filename: string;
      mimeType: string;
      sizeBytes: number;
      position: number;
    }[] = [];

    for (const [platform, staged, offset] of [
      ["WEB", assets.web, remainingWeb.length],
      ["MOBILE", assets.mobile, remainingMobile.length],
    ] as const) {
      const folder = platform.toLowerCase();
      for (const [index, asset] of staged.entries()) {
        const filename = `${randomUUID()}-${safeFilename(originalName(asset.filename))}`;
        await move(asset.absolutePath, getReferencePath(reference.slug, folder, filename));
        newScreenshots.push({
          platform,
          path: `/media/${reference.slug}/${folder}/${filename}`,
          filename,
          mimeType: asset.mimeType,
          sizeBytes: asset.sizeBytes,
          position: offset + index,
        });
      }
    }

    await db.$transaction(async (transaction) => {
      await transaction.reference.update({
        where: { id: reference.id },
        data: {
          name: input.name,
          categoryId: input.categoryId,
          hasWeb: input.hasWeb,
          hasMobile: input.hasMobile,
          logoPath,
        },
      });
      if (deletedIds.size) await transaction.screenshot.deleteMany({ where: { id: { in: [...deletedIds] } } });
      if (remainingWeb.length) {
        await transaction.screenshot.updateMany({
          where: { id: { in: remainingWeb.map((image) => image.id) } },
          data: { position: { increment: 1_000_000 } },
        });
      }
      if (remainingMobile.length) {
        await transaction.screenshot.updateMany({
          where: { id: { in: remainingMobile.map((image) => image.id) } },
          data: { position: { increment: 1_000_000 } },
        });
      }
      for (const [position, image] of remainingWeb.entries()) {
        await transaction.screenshot.update({ where: { id: image.id }, data: { position } });
      }
      for (const [position, image] of remainingMobile.entries()) {
        await transaction.screenshot.update({ where: { id: image.id }, data: { position } });
      }
      if (newScreenshots.length) {
        await transaction.screenshot.createMany({
          data: newScreenshots.map((image) => ({ ...image, referenceId: reference.id })),
        });
      }
    });
  } catch (error) {
    for (const { from, to } of completedMoves.reverse()) {
      await mkdir(path.dirname(from), { recursive: true });
      await rename(to, from).catch(() => undefined);
    }
    throw error;
  }

  await rm(stagingRoot, { recursive: true, force: true }).catch(() => undefined);
  return reference.slug;
}
