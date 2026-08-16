"use client";

import { useState } from "react";
import { Upload04Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CategoryOption } from "@/features/categories/types/category";
import { submitReference, type ReferenceDraft } from "../functions/submit-reference";
import { FileDropzone } from "./file-dropzone";
import { PlatformSection } from "./platform-section";
import { ReferenceBasicFields } from "./reference-basic-fields";
import { UploadStatus } from "./upload-status";

const emptyDraft: ReferenceDraft = { name: "", categoryId: "", hasWeb: true, hasMobile: false, logo: [], web: [], mobile: [] };

export function ReferenceUploadForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState({ ...emptyDraft, categoryId: categories[0]?.id ?? "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const update = <K extends keyof ReferenceDraft>(key: K, value: ReferenceDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <form className="space-y-5" onSubmit={async (event) => {
      event.preventDefault();
      if (!draft.logo.length) return toast.error("Selecciona el logo del producto.");
      if (!draft.hasWeb && !draft.hasMobile) return toast.error("Activa al menos una plataforma.");
      if (draft.hasWeb && !draft.web.length) return toast.error("Agrega capturas web.");
      if (draft.hasMobile && !draft.mobile.length) return toast.error("Agrega capturas mobile.");
      setBusy(true);
      try {
        const slug = await submitReference(draft, setMessage);
        toast.success("Referencia guardada");
        router.push(`/references/${slug}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo completar la carga.");
        setBusy(false);
      }
    }}>
      <ReferenceBasicFields name={draft.name} categoryId={draft.categoryId} categories={categories} onName={(value) => update("name", value)} onCategory={(value) => update("categoryId", value)} />
      <section className="rounded-3xl bg-card p-5 sm:p-6"><h2 className="mb-1 font-medium">Logo del producto</h2><p className="mb-5 text-sm text-muted-foreground">Será el único elemento visible en la vista general.</p><FileDropzone label="Selecciona el logo" hint="JPG, PNG, WebP, GIF o AVIF. Puede pesar más de 20 MB." files={draft.logo} onFiles={(files) => update("logo", files.slice(0, 1))} multiple={false} /></section>
      <div className="grid gap-5 xl:grid-cols-2"><PlatformSection title="Versión web" description="Capturas de escritorio o navegador." enabled={draft.hasWeb} files={draft.web} onEnabled={(value) => update("hasWeb", value)} onFiles={(files) => update("web", files)} /><PlatformSection title="Versión mobile" description="Capturas de aplicaciones móviles." enabled={draft.hasMobile} files={draft.mobile} onEnabled={(value) => update("hasMobile", value)} onFiles={(files) => update("mobile", files)} /></div>
      {busy && <UploadStatus message={message} />}
      <div className="flex justify-end"><Button type="submit" size="lg" disabled={busy || !categories.length}><HugeiconsIcon icon={Upload04Icon} size={19} strokeWidth={1.5} />{busy ? "Procesando" : "Guardar referencia"}</Button></div>
    </form>
  );
}
