"use client";

import { Delete02Icon, Undo02Icon, ViewIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScreenshotRecord } from "../types/reference";
import { FileDropzone } from "./file-dropzone";

type Props = {
  title: string;
  description: string;
  enabled: boolean;
  files: File[];
  onEnabled: (value: boolean) => void;
  onFiles: (files: File[]) => void;
  existing?: ScreenshotRecord[];
  deletedIds?: Set<string>;
  onDeleted?: (id: string, deleted: boolean) => void;
};

export function PlatformSection(props: Props) {
  return (
    <section className="rounded-3xl bg-card p-5 sm:p-6">
      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox checked={props.enabled} onCheckedChange={(checked) => props.onEnabled(checked === true)} className="mt-0.5" />
        <span><span className="block font-medium">{props.title}</span><span className="mt-1 block text-sm text-muted-foreground">{props.description}</span></span>
      </label>
      {!props.enabled && !!props.existing?.length && <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-xs leading-5 text-destructive">Al guardar, se eliminarán las {props.existing.length} capturas actuales de esta plataforma.</p>}
      {props.enabled && <div className="mt-5 space-y-5">
        {!!props.existing?.length && <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Capturas actuales</p>
            <p className="text-xs text-muted-foreground">Marca las que deseas eliminar</p>
          </div>
          <div className="grid max-h-[42rem] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
            {props.existing.map((image) => {
              const deleted = props.deletedIds?.has(image.id) ?? false;
              return <div key={image.id} className={cn("relative overflow-hidden rounded-xl bg-secondary transition-opacity", deleted && "opacity-40")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.path} alt={`Captura ${image.position + 1}`} loading="lazy" className="h-32 w-full object-cover object-top" />
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button nativeButton={false} render={<a href={image.path} target="_blank" rel="noreferrer" />} variant="secondary" size="icon-sm" aria-label="Ver imagen completa">
                    <HugeiconsIcon icon={ViewIcon} size={16} strokeWidth={1.7} />
                  </Button>
                  <Button type="button" variant={deleted ? "secondary" : "destructive"} size="icon-sm" aria-label={deleted ? "Conservar captura" : "Eliminar captura"} onClick={() => props.onDeleted?.(image.id, !deleted)}>
                    <HugeiconsIcon icon={deleted ? Undo02Icon : Delete02Icon} size={16} strokeWidth={1.7} />
                  </Button>
                </div>
              </div>;
            })}
          </div>
        </div>}
        <FileDropzone label="Agregar imágenes, ZIP o RAR" hint="Se cargan 10 archivos a la vez y se agregan al final en orden natural." files={props.files} onFiles={props.onFiles} archives />
      </div>}
    </section>
  );
}
