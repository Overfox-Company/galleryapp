import type { UploadAsset, UploadKind } from "../types/reference";
import { UPLOAD_CHUNK_SIZE } from "../constants/upload";

export async function uploadFileInChunks(
  asset: UploadAsset,
  sessionId: string,
  kind: UploadKind,
  index: number,
) {
  for (let offset = 0; offset < asset.blob.size; offset += UPLOAD_CHUNK_SIZE) {
    const end = Math.min(offset + UPLOAD_CHUNK_SIZE, asset.blob.size);
    const response = await fetch("/api/uploads/chunk", {
      method: "POST",
      headers: {
        "x-upload-session": sessionId,
        "x-upload-kind": kind,
        "x-file-name": encodeURIComponent(asset.filename),
        "x-file-index": String(index),
        "x-byte-offset": String(offset),
        "x-is-last": String(end === asset.blob.size),
      },
      body: asset.blob.slice(offset, end),
    });
    if (!response.ok) throw new Error(`No se pudo subir ${asset.filename}.`);
  }
}
