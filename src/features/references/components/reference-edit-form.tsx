"use client";

import { useState } from "react";
import { Delete02Icon, FloppyDiskIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CategoryOption } from "@/features/categories/types/category";
import { deleteReferenceAction } from "../actions/delete-reference-action";
import { submitReferenceUpdate, type ReferenceUpdateDraft } from "../functions/submit-reference-update";
import type { ReferenceDetail } from "../types/reference";
import { FileDropzone } from "./file-dropzone";
import { PlatformSection } from "./platform-section";
import { ReferenceBasicFields } from "./reference-basic-fields";
import { UploadStatus } from "./upload-status";

export function ReferenceEditForm({ reference, categories }: { reference: ReferenceDetail; categories: CategoryOption[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<ReferenceUpdateDraft>({
    referenceId: reference.id,
    name: reference.name,
    categoryId: reference.category.id,
    hasWeb: reference.hasWeb,
    hasMobile: reference.hasMobile,
    logo: [],
    web: [],
    mobile: [],
    deletedScreenshotIds: [],
  });
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const deletedIds = new Set(draft.deletedScreenshotIds);
  const update = <K extends keyof ReferenceUpdateDraft>(key: K, value: ReferenceUpdateDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleDeleted = (id: string, deleted: boolean) => update("deletedScreenshotIds", deleted
    ? [...draft.deletedScreenshotIds, id]
    : draft.deletedScreenshotIds.filter((currentId) => currentId !== id));

  return <form className="space-y-5" onSubmit={async (event) => {
    event.preventDefault();
    if (!draft.hasWeb && !draft.hasMobile) return toast.error("Activa al menos una plataforma.");
    const webRemaining = reference.screenshots.filter((image) => image.platform === "WEB" && !deletedIds.has(image.id)).length;
    const mobileRemaining = reference.screenshots.filter((image) => image.platform === "MOBILE" && !deletedIds.has(image.id)).length;
    if (draft.hasWeb && !webRemaining && !draft.web.length) return toast.error("Agrega capturas web.");
    if (draft.hasMobile && !mobileRemaining && !draft.mobile.length) return toast.error("Agrega capturas mobile.");
    setBusy(true);
    try {
      const slug = await submitReferenceUpdate(draft, setMessage);
      toast.success("Referencia actualizada");
      router.push(`/references/${slug}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la referencia.");
      setBusy(false);
    }
  }}>
    <ReferenceBasicFields name={draft.name} categoryId={draft.categoryId} categories={categories} onName={(value) => update("name", value)} onCategory={(value) => update("categoryId", value)} />
    <section className="rounded-3xl bg-card p-5 sm:p-6">
      <h2 className="mb-1 font-medium">Logo del producto</h2>
      <p className="mb-5 text-sm text-muted-foreground">Déjalo vacío para conservar el logo actual.</p>
      <div className="grid gap-5 md:grid-cols-[8rem_1fr] md:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={reference.logoPath} alt={`Logo actual de ${reference.name}`} className="size-28 rounded-2xl object-contain" />
        <FileDropzone label="Seleccionar un logo nuevo" hint="JPG, PNG, WebP, GIF o AVIF." files={draft.logo} onFiles={(files) => update("logo", files.slice(0, 1))} multiple={false} />
      </div>
    </section>
    <div className="grid gap-5 xl:grid-cols-2">
      <PlatformSection title="Versión web" description="Capturas de escritorio o navegador." enabled={draft.hasWeb} files={draft.web} onEnabled={(value) => update("hasWeb", value)} onFiles={(files) => update("web", files)} existing={reference.screenshots.filter((image) => image.platform === "WEB")} deletedIds={deletedIds} onDeleted={toggleDeleted} />
      <PlatformSection title="Versión mobile" description="Capturas de aplicaciones móviles." enabled={draft.hasMobile} files={draft.mobile} onEnabled={(value) => update("hasMobile", value)} onFiles={(files) => update("mobile", files)} existing={reference.screenshots.filter((image) => image.platform === "MOBILE")} deletedIds={deletedIds} onDeleted={toggleDeleted} />
    </div>
    {busy && <UploadStatus message={message} />}
    <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
      <Button type="button" variant="destructive" size="lg" disabled={busy || deleting} onClick={async () => {
        if (!window.confirm(`¿Eliminar ${reference.name} por completo? Se borrarán todas sus imágenes y esta acción no se puede deshacer.`)) return;
        setDeleting(true);
        const result = await deleteReferenceAction({ referenceId: reference.id });
        if (!result.ok) {
          toast.error(result.error);
          setDeleting(false);
          return;
        }
        toast.success("Referencia eliminada");
        router.push("/");
        router.refresh();
      }}><HugeiconsIcon icon={Delete02Icon} size={19} strokeWidth={1.5} />{deleting ? "Eliminando" : "Eliminar app completa"}</Button>
      <Button type="submit" size="lg" disabled={busy || deleting}><HugeiconsIcon icon={FloppyDiskIcon} size={19} strokeWidth={1.5} />{busy ? "Guardando" : "Guardar cambios"}</Button>
    </div>
  </form>;
}
