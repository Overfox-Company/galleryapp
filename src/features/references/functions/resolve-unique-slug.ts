import "server-only";
import { db } from "@/lib/db";
import { slugify } from "../utils/storage-names";

export async function resolveUniqueSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;
  while (await db.reference.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}
