import type { UploadAsset, UploadKind } from "../types/reference";
import { UPLOAD_FILE_BATCH_SIZE } from "../constants/upload";
import { iterateSourceFiles } from "./iterate-source-files";
import { uploadFileInChunks } from "./upload-file-in-chunks";

export async function uploadSourceFiles(
  files: File[],
  sessionId: string,
  kind: UploadKind,
  onFile: (message: string) => void,
) {
  let index = 0;
  let batch: { asset: UploadAsset; index: number }[] = [];

  async function uploadBatch() {
    if (!batch.length) return;
    const first = batch[0].index + 1;
    const last = batch.at(-1)!.index + 1;
    onFile(first === last ? `Subiendo archivo ${first}` : `Subiendo archivos ${first}–${last}`);
    await Promise.all(batch.map(({ asset, index: assetIndex }) => uploadFileInChunks(asset, sessionId, kind, assetIndex)));
    batch = [];
  }

  for await (const asset of iterateSourceFiles(files)) {
    batch.push({ asset, index: index++ });
    if (batch.length === UPLOAD_FILE_BATCH_SIZE) await uploadBatch();
  }
  await uploadBatch();
  return index;
}
