import path from "node:path";

const STAGING_ROOT = path.join(process.cwd(), ".uploads", "staging");
const REFERENCE_ROOT = path.join(process.cwd(), "storage", "references");

export function getStagingPath(sessionId: string, ...parts: string[]) {
  return path.join(STAGING_ROOT, sessionId, ...parts);
}

export function getReferencePath(slug: string, ...parts: string[]) {
  return path.join(REFERENCE_ROOT, slug, ...parts);
}
