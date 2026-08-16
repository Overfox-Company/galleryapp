import "server-only";
import { db } from "@/lib/db";
import type { ReferenceSummary } from "../types/reference";

export async function listReferences(): Promise<ReferenceSummary[]> {
  const references = await db.reference.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      logoPath: true,
      screenshots: { select: { path: true }, orderBy: { createdAt: "asc" }, take: 1 },
      hasWeb: true,
      hasMobile: true,
      category: { select: { id: true, name: true, icon: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return references.map(({ screenshots, ...reference }) => ({ ...reference, previewPath: screenshots[0]?.path ?? null }));
}
