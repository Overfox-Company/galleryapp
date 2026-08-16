import "server-only";
import { mkdir, rename } from "node:fs/promises";
import { db } from "@/lib/db";
import type { ReferenceInput } from "../validators/reference-schema";
import type { StagedAsset } from "./get-staged-upload";
import { getReferencePath, getStagingPath } from "../utils/upload-paths";

type Assets = { logo: StagedAsset[]; web: StagedAsset[]; mobile: StagedAsset[] };

export async function createReferenceRecord(input: ReferenceInput, slug: string, assets: Assets) {
  const source = getStagingPath(input.sessionId);
  const destination = getReferencePath(slug);
  await mkdir(getReferencePath(""), { recursive: true });
  await rename(source, destination);

  try {
    return await db.reference.create({
      data: {
        name: input.name,
        slug,
        logoPath: `/media/${slug}/logo/${assets.logo[0].filename}`,
        hasWeb: input.hasWeb,
        hasMobile: input.hasMobile,
        categoryId: input.categoryId,
        screenshots: {
          create: [
            ...assets.web.map((asset, position) => ({
              platform: "WEB" as const,
              path: `/media/${slug}/web/${asset.filename}`,
              filename: asset.filename,
              mimeType: asset.mimeType,
              sizeBytes: asset.sizeBytes,
              position,
            })),
            ...assets.mobile.map((asset, position) => ({
              platform: "MOBILE" as const,
              path: `/media/${slug}/mobile/${asset.filename}`,
              filename: asset.filename,
              mimeType: asset.mimeType,
              sizeBytes: asset.sizeBytes,
              position,
            })),
          ],
        },
      },
    });
  } catch (error) {
    await rename(destination, source).catch(() => undefined);
    throw error;
  }
}
