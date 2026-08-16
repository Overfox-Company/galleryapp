"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FileDropzone } from "./file-dropzone";

type Props = {
  title: string;
  description: string;
  enabled: boolean;
  files: File[];
  onEnabled: (value: boolean) => void;
  onFiles: (files: File[]) => void;
};

export function PlatformSection(props: Props) {
  return (
    <section className="rounded-3xl bg-card p-5 sm:p-6">
      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox checked={props.enabled} onCheckedChange={(checked) => props.onEnabled(checked === true)} className="mt-0.5" />
        <span><span className="block font-medium">{props.title}</span><span className="mt-1 block text-sm text-muted-foreground">{props.description}</span></span>
      </label>
      {props.enabled && <div className="mt-5"><FileDropzone label="Arrastra imágenes, ZIP o RAR" hint="El archivo se descomprime aquí y las imágenes viajan ordenadas por nombre." files={props.files} onFiles={props.onFiles} archives /></div>}
    </section>
  );
}
