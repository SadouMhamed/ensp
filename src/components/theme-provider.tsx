"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

/**
 * Dark mode is a dashboard feature:
 * - the dashboard layout uses <ThemeProvider> (light / dark / system, saved in localStorage)
 * - the public site and login use <ThemeProvider forcedTheme="light">
 * Each layout mounts its own provider, so moving between them re-applies the right theme.
 */
export function ThemeProvider({
  children,
  forcedTheme,
}: {
  children: React.ReactNode;
  forcedTheme?: "light" | "dark";
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="dashboard-theme"
      forcedTheme={forcedTheme}
    >
      {children}
      <Toaster richColors />
    </NextThemesProvider>
  );
}
