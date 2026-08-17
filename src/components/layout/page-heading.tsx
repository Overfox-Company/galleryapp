import type { ReactNode } from "react";

export function PageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-primary">Gallery / espacio visual</p>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}
