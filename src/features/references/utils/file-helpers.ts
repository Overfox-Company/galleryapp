import { IMAGE_EXTENSIONS } from "../constants/upload";

export function isImageName(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTENSIONS.includes(extension);
}

export function mimeFromName(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "svg") return "image/svg+xml";
  return `image/${extension === "avif" ? "avif" : extension || "png"}`;
}
