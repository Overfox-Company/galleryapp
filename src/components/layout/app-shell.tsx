import type { ReactNode } from "react";
import { AppNavigation } from "./app-navigation";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppNavigation />
      <main className="mx-auto min-h-screen max-w-[1600px] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
