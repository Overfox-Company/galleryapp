/* eslint-disable @next/next/no-img-element */
import { ViewTransition } from "react";
import Link from "next/link";
import type { ReferenceSummary } from "../types/reference";

export function ReferenceCard({ reference }: { reference: ReferenceSummary }) {
  return (
    <Link href={`/references/${reference.slug}`} transitionTypes={["nav-forward"]} aria-label={`Abrir ${reference.name}`} title={reference.name} className="group block overflow-hidden rounded-3xl bg-card outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary/60">
      <div className="relative aspect-[1.35] overflow-hidden bg-[var(--surface-elevated)]">
        {reference.previewPath ? <img src={reference.previewPath} alt={`Vista previa de ${reference.name}`} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" /> : <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--brand)_22%,transparent),transparent_45%),var(--surface-elevated)] p-[20%]"><img src={reference.logoPath} alt="" className="size-full object-contain opacity-90 transition-transform duration-500 group-hover:scale-105" /></div>}
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs text-white backdrop-blur-md">{reference.category.name}</span>
      </div>
      <div className="flex items-center gap-3 p-4">
        <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-secondary p-2.5"><ViewTransition name={`reference-logo-${reference.slug}`} share="reference-morph" default="none"><img src={reference.logoPath} alt="" className="size-full object-contain" /></ViewTransition></span>
        <span className="min-w-0"><span className="block truncate font-medium tracking-[-0.02em]">{reference.name}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{reference.hasWeb && reference.hasMobile ? "Web · Mobile" : reference.hasWeb ? "Web" : "Mobile"}</span></span>
      </div>
    </Link>
  );
}
