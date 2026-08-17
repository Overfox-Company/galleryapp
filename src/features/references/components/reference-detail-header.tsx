/* eslint-disable @next/next/no-img-element */
import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowLeft01Icon, Edit02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReferenceDetail } from "../types/reference";

export function ReferenceDetailHeader({ reference }: { reference: ReferenceDetail }) {
  return (
    <header className="mb-8 rounded-3xl ">
      <Link href="/" transitionTypes={["nav-back"]} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={17} strokeWidth={1.5} />Volver a referencias</Link>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid size-28 shrink-0 place-items-center rounded-3xl ">
          <ViewTransition name={`reference-logo-${reference.slug}`} share="reference-morph" default="none">
            <img src={reference.logoPath} alt={reference.name} className="size-full object-contain rounded-[14px]" /></ViewTransition>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{reference.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2"><Badge variant="secondary">{reference.category.name}</Badge>
            {reference.hasWeb && <Badge variant="secondary">Web</Badge>}{reference.hasMobile && <Badge variant="secondary">Mobile</Badge>}</div>
        </div>
        <Button nativeButton={false} render={<Link href={`/references/${reference.slug}/edit`} />} variant="secondary" className="sm:self-start"><HugeiconsIcon icon={Edit02Icon} size={18} strokeWidth={1.5} />Editar referencia</Button>
      </div>
    </header>
  );
}
