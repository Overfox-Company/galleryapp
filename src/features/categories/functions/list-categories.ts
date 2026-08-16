import "server-only";
import { db } from "@/lib/db";
import type { CategoryRecord } from "../types/category";

export async function listCategories(): Promise<CategoryRecord[]> {
  const categories = await db.category.findMany({
    include: { _count: { select: { references: true } } },
    orderBy: { name: "asc" },
  });

  return categories.map(({ _count, ...category }) => ({
    ...category,
    referenceCount: _count.references,
  }));
}
