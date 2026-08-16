import { Archive } from "libarchive.js";
import type { UploadAsset } from "../types/reference";
import { isImageName, mimeFromName } from "./file-helpers";
import { naturalSort } from "./natural-sort";

type ArchiveEntry = { file: { extract(): Promise<File> }; path: string };

export async function* extractRarImages(file: File): AsyncGenerator<UploadAsset> {
  Archive.init({ workerUrl: "/libarchive/worker-bundle.js" });
  const archive = await Archive.open(file);
  try {
    const entries = naturalSort(
      (await archive.getFilesArray()).filter((entry: ArchiveEntry) => entry.file && isImageName(entry.path)),
      (entry: ArchiveEntry) => entry.path,
    ) as ArchiveEntry[];
    for (const entry of entries) {
      const extracted = await entry.file.extract();
      const filename = entry.path.split("/").pop() ?? extracted.name;
      yield { blob: new Blob([extracted], { type: mimeFromName(filename) }), filename };
    }
  } finally {
    await archive.close();
  }
}
