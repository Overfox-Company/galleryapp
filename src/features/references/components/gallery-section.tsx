/* eslint-disable @next/next/no-img-element */
import type { ScreenshotRecord } from "../types/reference";

export function GallerySection({ title, description, screenshots, mobile = false }: { title: string; description: string; screenshots: ScreenshotRecord[]; mobile?: boolean }) {
  if (!screenshots.length) return null;
  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-xl font-medium tracking-[-0.03em]">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
      <div className={mobile ? "columns-2 gap-3 md:columns-3 xl:columns-4" : "columns-1 gap-3 lg:columns-6"}>
        {screenshots.map((image) => <a key={image.id} href={image.path} target="_blank" rel="noreferrer" className="mb-3 block break-inside-avoid overflow-hidden rounded-[24px] bg-card outline-none focus-visible:ring-2 focus-visible:ring-primary/50"><img src={image.path} alt={`${title} ${image.position + 1}`} loading="lazy" className="h-auto w-full transition-transform duration-300 hover:scale-[1.01]" /></a>)}
      </div>
    </section>
  );
}
