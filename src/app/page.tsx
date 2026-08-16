import Link from "next/link";
import { Add01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { listCategories } from "@/features/categories/functions/list-categories";
import { GalleryBrowser } from "@/features/references/components/gallery-browser";
import { listReferences } from "@/features/references/functions/list-references";

export default async function HomePage() {
  const [references, categories] = await Promise.all([listReferences(), listCategories()]);
  const action = <Button nativeButton={false} render={<Link href="/references/new" />}><HugeiconsIcon icon={Add01Icon} size={18} strokeWidth={1.5} />Nueva referencia</Button>;
  return (
    <div>
      <PageHeading title="Referencias" description="Tu biblioteca visual de productos, sitios y aplicaciones." action={action} />
      <GalleryBrowser references={references} categories={categories} />
    </div>
  );
}
