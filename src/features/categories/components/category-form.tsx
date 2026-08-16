"use client";

import { useRef, useState, useTransition } from "react";
import { Add01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "../actions/create-category-action";
import { CATEGORY_ICON_OPTIONS } from "../constants/category-icons";
import { CategoryIcon } from "./category-icon";

export function CategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [icon, setIcon] = useState("design");
  const [pending, startTransition] = useTransition();
  return (
    <form ref={formRef} className="rounded-3xl bg-card p-5 sm:p-6" action={(formData) => startTransition(async () => {
      const result = await createCategoryAction(formData);
      if (!result.ok) { toast.error(result.error); return; }
      formRef.current?.reset();
      setIcon("design");
      toast.success("Categoría creada");
    })}>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><CategoryIcon name={icon} /></span>
        <div><h2 className="font-medium">Nueva categoría</h2><p className="text-sm text-muted-foreground">Nombre e icono para organizar la biblioteca.</p></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
        <label className="grid gap-2 text-sm"><span>Nombre</span><Input name="name" placeholder="Ej. Fintech" required /></label>
        <label className="grid gap-2 text-sm"><span>Icono</span><select name="icon" value={icon} onChange={(event) => setIcon(event.target.value)} className="h-11 rounded-xl border-0 bg-secondary px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50">{CATEGORY_ICON_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <Button type="submit" disabled={pending}><HugeiconsIcon icon={Add01Icon} size={18} strokeWidth={1.5} />{pending ? "Creando" : "Crear"}</Button>
      </div>
    </form>
  );
}
