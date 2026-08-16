import "server-only";
import path from "node:path";
import { readdir, stat } from "node:fs/promises";
import { naturalSort } from "../utils/natural-sort";
import { readImageMime } from "../utils/image-mime";
import { getStagingPath } from "../utils/upload-paths";

export type StagedAsset = {
  absolutePath: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
};

export async function readStagedKind(sessionId: string, kind: string) {
  const directory = getStagingPath(sessionId, kind);
  const names = await readdir(directory).catch(() => [] as string[]);
  const ordered = naturalSort(names.filter((name) => !name.endsWith(".part")), (name) => name);

  return Promise.all(
    ordered.map(async (filename): Promise<StagedAsset> => {
      const absolutePath = path.join(directory, filename);
      const [metadata, mimeType] = await Promise.all([stat(absolutePath), readImageMime(absolutePath)]);
      if (!mimeType) throw new Error(`Archivo inválido: ${filename}`);
      return { absolutePath, filename, mimeType, sizeBytes: metadata.size };
    }),
  );
}

export async function getStagedUpload(sessionId: string) {
  const [logo, web, mobile] = await Promise.all([
    readStagedKind(sessionId, "logo"),
    readStagedKind(sessionId, "web"),
    readStagedKind(sessionId, "mobile"),
  ]);
  return { logo, web, mobile };
}
