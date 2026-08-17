import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/layout/page-heading";
import { listCategories } from "@/features/categories/functions/list-categories";
import { ReferenceEditForm } from "@/features/references/components/reference-edit-form";
import { getReferenceBySlug } from "@/features/references/functions/get-reference-by-slug";

export const metadata: Metadata = { title: "Editar referencia" };

export default async function EditReferencePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const [reference, categories] = await Promise.all([getReferenceBySlug(slug), listCategories()]);
  if (!reference) notFound();
  return <div>
    <PageHeading title={`Editar ${reference.name}`} description="Actualiza los datos, elimina capturas o agrega nuevas versiones web y mobile." />
    <ReferenceEditForm reference={reference} categories={categories} />
  </div>;
}
