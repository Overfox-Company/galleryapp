import type { CategoryRecord } from "../types/category";
import { CategoryIcon } from "./category-icon";

export function CategoryList({ categories }: { categories: CategoryRecord[] }) {
  if (!categories.length) return <div className="rounded-3xl bg-card p-10 text-center text-muted-foreground">Aún no hay categorías.</div>;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <article key={category.id} className="flex items-center gap-4 rounded-2xl bg-card p-4">
          <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><CategoryIcon name={category.icon} /></span>
          <div><h3 className="font-medium">{category.name}</h3><p className="text-sm text-muted-foreground">{category.referenceCount} referencias</p></div>
        </article>
      ))}
    </div>
  );
}
