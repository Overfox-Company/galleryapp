import { Input } from "@/components/ui/input";
import type { CategoryOption } from "@/features/categories/types/category";

type Props = {
  name: string;
  categoryId: string;
  categories: CategoryOption[];
  onName: (value: string) => void;
  onCategory: (value: string) => void;
};

export function ReferenceBasicFields({ name, categoryId, categories, onName, onCategory }: Props) {
  return (
    <section className="grid gap-5 rounded-3xl bg-card p-5 sm:grid-cols-2 sm:p-6">
      <label className="grid gap-2 text-sm"><span>Nombre del producto</span><Input value={name} onChange={(event) => onName(event.target.value)} placeholder="Ej. Linear" required /></label>
      <label className="grid gap-2 text-sm"><span>Categoría</span><select value={categoryId} onChange={(event) => onCategory(event.target.value)} required className="h-11 rounded-xl border-0 bg-secondary px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"><option value="">Selecciona una categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    </section>
  );
}
