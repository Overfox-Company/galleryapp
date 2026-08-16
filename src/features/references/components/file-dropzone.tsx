"use client";

import { Cancel01Icon, ImageUpload01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  hint: string;
  files: File[];
  onFiles: (files: File[]) => void;
  archives?: boolean;
  multiple?: boolean;
};

export function FileDropzone({ label, hint, files, onFiles, archives = false, multiple = true }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    accept: archives
      ? { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"], "application/zip": [".zip"], "application/vnd.rar": [".rar"] }
      : { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"] },
    onDrop: onFiles,
  });

  return (
    <div className="rounded-2xl bg-secondary p-3">
      <div {...getRootProps()} className={cn("flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl bg-card px-5 py-8 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50", isDragActive && "bg-primary/10")}>
        <input {...getInputProps()} />
        <span className="mb-4 grid size-12 place-items-center rounded-xl bg-secondary text-primary"><HugeiconsIcon icon={ImageUpload01Icon} size={24} strokeWidth={1.5} /></span>
        <p className="text-sm font-medium">{files.length ? `${files.length} archivo${files.length === 1 ? "" : "s"} seleccionado${files.length === 1 ? "" : "s"}` : label}</p>
        <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">{files.length ? files.slice(0, 3).map((file) => file.name).join(" · ") : hint}</p>
      </div>
      {files.length > 0 && <Button type="button" variant="ghost" size="sm" className="mt-2 w-full" onClick={() => onFiles([])}><HugeiconsIcon icon={Cancel01Icon} size={16} />Limpiar selección</Button>}
    </div>
  );
}
