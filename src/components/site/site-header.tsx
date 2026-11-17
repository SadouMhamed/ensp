import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { BRAND_NAME, Logo } from "@/components/brand/logo";
import { topLinks } from "@/content/site";
import { Container } from "./section";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

/**
 * Two-row corporate header (inspired by slb.com):
 * row 1 = small utility links, row 2 = main navigation with a Services mega menu.
 * The logo spans both rows. On small screens: logo + menu button (slide-in sheet).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <Container className="flex items-stretch">
        <Link
          href="/"
          className="flex items-center gap-3 py-3 pr-6 lg:border-r"
          aria-label={`${BRAND_NAME} – accueil`}
        >
          <Logo size={44} priority />
          <span className="text-lg font-semibold tracking-wide">
            {BRAND_NAME}
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden flex-1 flex-col lg:flex">
          <div className="flex h-9 items-center justify-end gap-6 border-b pl-6 text-xs text-muted-foreground">
            {topLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-foreground"
              >
                {l.title}
              </Link>
            ))}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <LogInIcon className="size-3.5" aria-hidden />
              Espace personnel
            </Link>
          </div>
          <div className="flex h-14 items-center pl-4">
            <DesktopNav />
          </div>
        </div>

        {/* Mobile */}
        <div className="ml-auto flex items-center lg:hidden">
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
