import { BlobReader, BlobWriter, ZipReader, type FileEntry } from "@zip.js/zip.js";
import type { UploadAsset } from "../types/reference";
import { isImageName, mimeFromName } from "./file-helpers";
import { naturalSort } from "./natural-sort";

export async function* extractZipImages(file: File): AsyncGenerator<UploadAsset> {
  const reader = new ZipReader(new BlobReader(file));
  try {
    const entries = naturalSort(
      (await reader.getEntries()).filter((entry) => !entry.directory && isImageName(entry.filename)),
      (entry) => entry.filename,
    ) as FileEntry[];
    for (const entry of entries) {
      const blob = await entry.getData?.(new BlobWriter(mimeFromName(entry.filename)));
      if (blob) yield { blob, filename: entry.filename.split("/").pop() ?? entry.filename };
    }
  } finally {
    await reader.close();
  }
}
