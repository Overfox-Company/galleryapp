"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/action-result";
import { createReferenceRecord } from "../functions/create-reference-record";
import { getStagedUpload } from "../functions/get-staged-upload";
import { resolveUniqueSlug } from "../functions/resolve-unique-slug";
import { referenceInputSchema, type ReferenceInput } from "../validators/reference-schema";

export async function finalizeReferenceAction(raw: ReferenceInput): Promise<ActionResult<{ slug: string }>> {
  const parsed = referenceInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  try {
    const assets = await getStagedUpload(parsed.data.sessionId);
    if (assets.logo.length !== 1) throw new Error("Selecciona un solo logo.");
    if (parsed.data.hasWeb && !assets.web.length) throw new Error("Agrega capturas web.");
    if (parsed.data.hasMobile && !assets.mobile.length) throw new Error("Agrega capturas mobile.");
    const slug = await resolveUniqueSlug(parsed.data.name);
    await createReferenceRecord(parsed.data, slug, assets);
    revalidatePath("/");
    return { ok: true, data: { slug } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar la referencia.";
    return { ok: false, error: message };
  }
}
