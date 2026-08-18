"use client";

import { useState } from "react";
import type { ReferenceDetail } from "../types/reference";
import { GallerySection } from "./gallery-section";

export function ReferenceDetailGallery({ reference }: { reference: ReferenceDetail }) {
  const web = reference.screenshots.filter((image) => image.platform === "WEB");
  const mobile = reference.screenshots.filter((image) => image.platform === "MOBILE");
  const [activePlatform, setActivePlatform] = useState<"WEB" | "MOBILE">(web.length ? "WEB" : "MOBILE");
  const hasBothPlatforms = web.length > 0 && mobile.length > 0;

  if (!hasBothPlatforms) {
    return <div>
      <GallerySection title="Web" description={`${web.length} capturas ordenadas por nombre de archivo.`} screenshots={web} />
      <GallerySection title="Mobile" description={`${mobile.length} capturas ordenadas por nombre de archivo.`} screenshots={mobile} mobile />
    </div>;
  }

  const activeScreenshots = activePlatform === "WEB" ? web : mobile;
  const activeTitle = activePlatform === "WEB" ? "Web" : "Mobile";

  return (
    <div>
      <div role="tablist" aria-label="Seleccionar plataforma" className="mb-6 inline-flex rounded-2xl bg-card p-1.5">
        <PlatformTab platform="WEB" label="Web" count={web.length} active={activePlatform === "WEB"} onSelect={setActivePlatform} />
        <PlatformTab platform="MOBILE" label="Mobile" count={mobile.length} active={activePlatform === "MOBILE"} onSelect={setActivePlatform} />
      </div>
      <div role="tabpanel" id={`gallery-panel-${activePlatform.toLowerCase()}`} aria-labelledby={`gallery-tab-${activePlatform.toLowerCase()}`}>
        <GallerySection title={activeTitle} description={`${activeScreenshots.length} capturas ordenadas por nombre de archivo.`} screenshots={activeScreenshots} mobile={activePlatform === "MOBILE"} />
      </div>
    </div>
  );
}

function PlatformTab({ platform, label, count, active, onSelect }: { platform: "WEB" | "MOBILE"; label: string; count: number; active: boolean; onSelect: (platform: "WEB" | "MOBILE") => void }) {
  return <button
    type="button"
    role="tab"
    id={`gallery-tab-${platform.toLowerCase()}`}
    aria-controls={`gallery-panel-${platform.toLowerCase()}`}
    aria-selected={active}
    tabIndex={active ? 0 : -1}
    onClick={() => onSelect(platform)}
    onKeyDown={(event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const nextPlatform = platform === "WEB" ? "MOBILE" : "WEB";
      onSelect(nextPlatform);
      document.getElementById(`gallery-tab-${nextPlatform.toLowerCase()}`)?.focus();
    }}
    className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 aria-selected:bg-secondary aria-selected:text-foreground"
  >{label}<span className="ml-2 text-xs opacity-70">{count}</span></button>;
}
