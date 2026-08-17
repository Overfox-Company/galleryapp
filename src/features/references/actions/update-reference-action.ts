"use server";

import { rm } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/action-result";
import { getStagedUpload } from "../functions/get-staged-upload";
import { updateReferenceRecord } from "../functions/update-reference-record";
import { getStagingPath } from "../utils/upload-paths";
import { referenceUpdateInputSchema, type ReferenceUpdateInput } from "../validators/reference-schema";

export async function updateReferenceAction(raw: ReferenceUpdateInput): Promise<ActionResult<{ slug: string }>> {
  const parsed = referenceUpdateInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  try {
    const assets = await getStagedUpload(parsed.data.sessionId);
    const slug = await updateReferenceRecord(parsed.data, assets);
    revalidatePath("/");
    revalidatePath(`/references/${slug}`);
    return { ok: true, data: { slug } };
  } catch (error) {
    await rm(getStagingPath(parsed.data.sessionId), { recursive: true, force: true }).catch(() => undefined);
    return { ok: false, error: error instanceof Error ? error.message : "No se pudo actualizar la referencia." };
  }
}
