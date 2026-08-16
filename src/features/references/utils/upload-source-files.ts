import type { UploadKind } from "../types/reference";
import { iterateSourceFiles } from "./iterate-source-files";
import { uploadFileInChunks } from "./upload-file-in-chunks";

export async function uploadSourceFiles(
  files: File[],
  sessionId: string,
  kind: UploadKind,
  onFile: (message: string) => void,
) {
  let index = 0;
  for await (const asset of iterateSourceFiles(files)) {
    onFile(`Subiendo ${asset.filename}`);
    await uploadFileInChunks(asset, sessionId, kind, index++);
  }
  return index;
}
