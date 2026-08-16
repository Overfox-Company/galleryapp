"use client";

import { Home01Icon, Search01Icon, Settings01Icon, Upload04Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Biblioteca", icon: Home01Icon },
  { href: "/references/new", label: "Nueva referencia", icon: Upload04Icon },
  { href: "/settings", label: "Configuración", icon: Settings01Icon },
];

export function AppNavigation() {
  const pathname = usePathname();
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Gallery";
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[var(--canvas)]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label={`${appName}, ir a la biblioteca`}>
          <span className="grid size-10 place-items-center rounded-[14px] bg-primary text-lg font-bold tracking-[-0.08em] text-primary-foreground transition-transform duration-200 group-hover:rotate-[-6deg]">G</span>
          <span className="hidden text-lg font-semibold tracking-[-0.04em] sm:inline">{appName}</span>
        </Link>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto" aria-label="Navegación principal">
          {items.map((item) => <NavigationItem key={item.href} item={item} active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))} />)}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href="/#explore" aria-label="Buscar en la biblioteca" title="Buscar" className="grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <HugeiconsIcon icon={Search01Icon} size={19} strokeWidth={1.5} />
          </Link>
          <Link href="/references/new" className="hidden h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 sm:inline-flex">
            <HugeiconsIcon icon={Upload04Icon} size={17} strokeWidth={1.5} />
            <span>Nueva</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavigationItem({ item, active }: { item: (typeof items)[number]; active: boolean }) {
  return (
    <Link href={item.href} className={cn("flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground", active && "bg-secondary text-foreground")}>
      <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.5} className={active ? "text-primary" : ""} />
      <span className="hidden md:inline">{item.label}</span>
    </Link>
  );
}
