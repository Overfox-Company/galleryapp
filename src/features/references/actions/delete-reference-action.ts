"use server";

import { randomUUID } from "node:crypto";
import path from "node:path";
import { mkdir, rename, rm } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ActionResult } from "@/types/action-result";
import { getReferencePath, getStagingPath } from "../utils/upload-paths";

const inputSchema = z.object({ referenceId: z.string().min(1) });

export async function deleteReferenceAction(raw: { referenceId: string }): Promise<ActionResult<null>> {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Referencia inválida." };

  const reference = await db.reference.findUnique({ where: { id: parsed.data.referenceId } });
  if (!reference) return { ok: false, error: "La referencia ya no existe." };

  const source = getReferencePath(reference.slug);
  const trash = getStagingPath(`deleted-${randomUUID()}`, reference.slug);
  let moved = false;
  try {
    await mkdir(path.dirname(trash), { recursive: true });
    await rename(source, trash).then(() => { moved = true; }).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
    await db.reference.delete({ where: { id: reference.id } });
  } catch (error) {
    if (moved) {
      await mkdir(path.dirname(source), { recursive: true });
      await rename(trash, source).catch(() => undefined);
    }
    return { ok: false, error: error instanceof Error ? error.message : "No se pudo eliminar la referencia." };
  }

  await rm(path.dirname(trash), { recursive: true, force: true }).catch(() => undefined);
  revalidatePath("/");
  return { ok: true, data: null };
}
