"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * One theme provider for the whole app (mounted once in the root layout).
 * - The dashboard follows the user's choice (light / dark / system, saved in localStorage).
 * - The public site and login stay light: their layouts add `data-force-light`, and
 *   globals.css ignores the dark theme while such an element is on the page.
 * Mounting it once avoids React's "script tag" dev error that appeared when each
 * layout mounted its own provider during client-side navigation.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="dashboard-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
