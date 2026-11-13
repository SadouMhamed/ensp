import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ThemeProvider } from "@/components/theme-provider";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <ThemeProvider forcedTheme="light">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </ThemeProvider>
  );
}
