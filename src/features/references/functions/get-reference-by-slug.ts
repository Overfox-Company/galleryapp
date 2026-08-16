import "server-only";
import { db } from "@/lib/db";
import type { ReferenceDetail } from "../types/reference";

export async function getReferenceBySlug(slug: string): Promise<ReferenceDetail | null> {
  const reference = await db.reference.findUnique({
    where: { slug },
    include: { category: true, screenshots: { orderBy: [{ platform: "asc" }, { position: "asc" }] } },
  });
  if (!reference) return null;
  return {
    id: reference.id,
    name: reference.name,
    slug: reference.slug,
    logoPath: reference.logoPath,
    previewPath: reference.screenshots[0]?.path ?? null,
    hasWeb: reference.hasWeb,
    hasMobile: reference.hasMobile,
    category: reference.category,
    createdAt: reference.createdAt.toISOString(),
    screenshots: reference.screenshots.map(({ id, platform, path, filename, position }) => ({
      id,
      platform,
      path,
      filename,
      position,
    })),
  };
}
