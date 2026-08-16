import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Gallery";

export const metadata: Metadata = {
  title: { default: appName, template: `%s · ${appName}` },
  description: "Galería privada de referencias de producto.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} dark antialiased`}>
      <body>
        <AppShell>{children}</AppShell>
        <Toaster theme="dark" richColors position="bottom-right" />
      </body>
    </html>
  );
}
