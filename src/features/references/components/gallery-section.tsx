/* eslint-disable @next/next/no-img-element */
import type { ScreenshotRecord } from "../types/reference";
import { ViewIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export function GallerySection({ title, description, screenshots, mobile = false }: { title: string; description: string; screenshots: ScreenshotRecord[]; mobile?: boolean }) {
  if (!screenshots.length) return null;
  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-xl font-medium tracking-[-0.03em]">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
      <div className={mobile ? "grid grid-cols-2 items-start gap-3 md:grid-cols-3 xl:grid-cols-4" : "grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-6"}>
        {screenshots.map((image) => <a key={image.id} href={image.path} target="_blank" rel="noreferrer" aria-label={`Ver ${title} ${image.position + 1} en tamaño completo`} className="group relative block overflow-hidden rounded-[24px] bg-card outline-none focus-visible:ring-2 focus-visible:ring-primary/50"><img src={image.path} alt={`${title} ${image.position + 1}`} loading="lazy" className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.01]" /><span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-black/75 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm"><HugeiconsIcon icon={ViewIcon} size={15} strokeWidth={1.7} />Ver imagen</span></a>)}
      </div>
    </section>
  );
}
