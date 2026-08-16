export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "reference";
}

export function safeFilename(value: string) {
  const normalized = value.normalize("NFKC").replace(/[/\\\0]/g, "-");
  return normalized.replace(/[^\p{L}\p{N}._ -]/gu, "-").slice(-120) || "image";
}
