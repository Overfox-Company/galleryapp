import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReferenceDetailGallery } from "@/features/references/components/reference-detail-gallery";
import { ReferenceDetailHeader } from "@/features/references/components/reference-detail-header";
import { getReferenceBySlug } from "@/features/references/functions/get-reference-by-slug";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const reference = await getReferenceBySlug((await params).slug);
  return { title: reference?.name ?? "Referencia" };
}

export default async function ReferencePage({ params }: { params: Promise<{ slug: string }> }) {
  const reference = await getReferenceBySlug((await params).slug);
  if (!reference) notFound();
  return <div>
    <ReferenceDetailHeader reference={reference} />
    <ReferenceDetailGallery reference={reference} />
  </div>;
}
