import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/page-heading";
import { CategoryForm } from "@/features/categories/components/category-form";
import { CategoryList } from "@/features/categories/components/category-list";
import { listCategories } from "@/features/categories/functions/list-categories";

export const metadata: Metadata = { title: "Configuración" };

export default async function SettingsPage() {
  const categories = await listCategories();
  return (
    <div>
      <PageHeading title="Configuración" description="Crea las categorías que usarás para clasificar tus referencias." />
      <div className="space-y-8"><CategoryForm /><section><h2 className="mb-4 text-lg font-medium">Categorías</h2><CategoryList categories={categories} /></section></div>
    </div>
  );
}
