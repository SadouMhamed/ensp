import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Toaster } from "@/components/ui/sonner";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {/* data-site-theme: ENSP website look (orange, square corners).
          data-force-light: the website stays light even if the dashboard is set to dark. See globals.css */}
      <div data-site-theme data-force-light className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <Toaster richColors theme="light" />
    </>
  );
}
