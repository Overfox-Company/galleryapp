"use client";

import { useMemo, useState } from "react";
import { FilterHorizontalIcon, Search01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import type { CategoryOption } from "@/features/categories/types/category";
import type { ReferenceSummary } from "../types/reference";
import { ReferenceCard } from "./reference-card";

export function GalleryBrowser({ references, categories }: { references: ReferenceSummary[]; categories: CategoryOption[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const filtered = useMemo(() => references.filter((reference) => {
    const matchesName = reference.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    const matchesCategory = category === "all" || reference.category.id === category;
    const matchesType = type === "all" || (type === "web" ? reference.hasWeb : reference.hasMobile);
    return matchesName && matchesCategory && matchesType;
  }), [references, query, category, type]);
  const platformCount = [references.some((reference) => reference.hasWeb), references.some((reference) => reference.hasMobile)].filter(Boolean).length;

  return (
    <div id="explore">


      <div className="mb-7 flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.035em]">Últimas referencias</h2>
          </div>
          <label className="relative w-full sm:max-w-xs"><span className="sr-only">Buscar por nombre</span><HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.5} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="gallery-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar referencias" className="bg-secondary/80 pl-11" /></label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-2xl bg-[var(--surface-content)] p-1" aria-label="Filtrar por plataforma">
            <HugeiconsIcon icon={FilterHorizontalIcon} size={16} strokeWidth={1.5} className="ml-2 text-muted-foreground" />
            <FilterTab active={type === "all"} onClick={() => setType("all")}>Todas</FilterTab>
            <FilterTab active={type === "web"} onClick={() => setType("web")}>Web</FilterTab>
            <FilterTab active={type === "mobile"} onClick={() => setType("mobile")}>Mobile</FilterTab>
          </div>
          <select aria-label="Filtrar por categoría" value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-xl border-0 bg-[var(--surface-content)] px-3 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus:ring-2 focus:ring-primary/50"><option value="all">Todas las categorías</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</span>
        </div>
      </div>
      {filtered.length ? <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((reference) => <ReferenceCard key={reference.id} reference={reference} />)}</div> : <div className="rounded-3xl bg-card px-6 py-20 text-center"><h2 className="font-medium">No encontramos referencias</h2><p className="mt-2 text-sm text-muted-foreground">Prueba con otro nombre o cambia los filtros.</p></div>}
    </div>
  );
}

function FilterTab({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`h-8 rounded-xl px-3 text-xs font-medium transition-colors ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{children}</button>;
}

function Metric({ value, label, className = "" }: { value: number; label: string; className?: string }) {
  return <div className={`rounded-2xl bg-[var(--surface-elevated)] px-4 py-3 ${className}`}><p className="text-2xl font-semibold tracking-[-0.05em]">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>;
}
