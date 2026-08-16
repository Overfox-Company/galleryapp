"use server";

import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import type { ActionResult } from "@/types/action-result";
import { getStagingPath } from "../utils/upload-paths";

export async function createUploadSessionAction(): Promise<ActionResult<{ sessionId: string }>> {
  const sessionId = randomUUID();
  try {
    await mkdir(getStagingPath(sessionId), { recursive: true });
    return { ok: true, data: { sessionId } };
  } catch {
    return { ok: false, error: "No se pudo preparar la carpeta de carga." };
  }
}
