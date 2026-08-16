import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { listCategories } from "@/features/categories/functions/list-categories";
import { ReferenceUploadForm } from "@/features/references/components/reference-upload-form";

export const metadata: Metadata = { title: "Nueva carga" };

export default async function NewReferencePage() {
  const categories = await listCategories();
  return (
    <div>
      <PageHeading title="Nueva referencia" description="Carga imágenes sueltas o descomprime ZIP y RAR localmente antes de enviarlas en orden." />
      {!categories.length ? <div className="rounded-3xl bg-card p-8 text-center"><h2 className="text-lg font-medium">Primero crea una categoría</h2><p className="mt-2 text-sm text-muted-foreground">La referencia necesita una categoría para poder filtrarse.</p><Button nativeButton={false} render={<Link href="/settings" />} className="mt-5">Ir a configuración</Button></div> : <ReferenceUploadForm categories={categories} />}
    </div>
  );
}
