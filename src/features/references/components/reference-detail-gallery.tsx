import type { ReferenceDetail } from "../types/reference";
import { GallerySection } from "./gallery-section";

export function ReferenceDetailGallery({ reference }: { reference: ReferenceDetail }) {
  const web = reference.screenshots.filter((image) => image.platform === "WEB");
  const mobile = reference.screenshots.filter((image) => image.platform === "MOBILE");
  return (
    <div>
      <GallerySection title="Web" description={`${web.length} capturas ordenadas por nombre de archivo.`} screenshots={web} />
      <GallerySection title="Mobile" description={`${mobile.length} capturas ordenadas por nombre de archivo.`} screenshots={mobile} mobile />
    </div>
  );
}
