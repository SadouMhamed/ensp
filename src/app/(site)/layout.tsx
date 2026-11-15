import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/site/smooth-scroll";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {/* data-site-theme: ENSP website look (orange, square corners).
          data-force-light: the website stays light even if the dashboard is set to dark. See globals.css
          --site-header-h: height of the sticky header, so full-screen blocks can sit right under it */}
      <div
        data-site-theme
        data-force-light
        className="flex flex-1 flex-col [--site-header-h:69px] lg:[--site-header-h:93px]"
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <Toaster richColors theme="light" />
      <SmoothScroll />
    </>
  );
}
