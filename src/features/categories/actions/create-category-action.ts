"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ActionResult } from "@/types/action-result";
import { categorySchema } from "../validators/category-schema";

export async function createCategoryAction(formData: FormData): Promise<ActionResult> {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  try {
    await db.category.create({ data: parsed.data });
    revalidatePath("/settings");
    revalidatePath("/references/new");
    revalidatePath("/");
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Ya existe una categoría con ese nombre." };
  }
}
