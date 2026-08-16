import type { UploadAsset } from "../types/reference";
import { extractRarImages } from "./extract-rar-images";
import { extractZipImages } from "./extract-zip-images";
import { isImageName } from "./file-helpers";
import { naturalSort } from "./natural-sort";

export async function* iterateSourceFiles(files: File[]): AsyncGenerator<UploadAsset> {
  const ordered = naturalSort(files, (file) => file.name);
  for (const file of ordered) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "zip") yield* extractZipImages(file);
    else if (extension === "rar") yield* extractRarImages(file);
    else if (isImageName(file.name)) yield { blob: file, filename: file.name };
  }
}
