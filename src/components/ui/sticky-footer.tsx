import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Sticky "reveal" footer (adapted from the sticky-footer block):
 * the footer stays fixed under the page and is uncovered as you scroll to the bottom.
 * Content comes from props (brand, description, link groups, bottom line) instead of
 * hard-coded demo data. The original blur/fade-in of the columns was removed: it started
 * the content invisible in the HTML (blank for search engines / if JS is slow).
 * Social links are optional: the original brand icons were removed from lucide-react,
 * so pass your own icons if you add them.
 */

export interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}
export interface FooterLinkGroup {
  label: string;
  links: FooterLink[];
}
export interface SocialLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

type StickyFooterProps = Omit<React.ComponentProps<"footer">, "children"> & {
  brand: React.ReactNode;
  description?: React.ReactNode;
  /** Extra content under the description (e.g. contact details). */
  extra?: React.ReactNode;
  groups: FooterLinkGroup[];
  socialLinks?: SocialLink[];
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
};

export function StickyFooter({
  className,
  brand,
  description,
  extra,
  groups,
  socialLinks = [],
  bottomLeft,
  bottomRight,
  ...props
}: StickyFooterProps) {
  return (
    <footer
      // Reveal effect from md up (fixed 480px). On phones the stacked columns are taller than
      // the screen, so the footer is shown normally instead.
      className={cn(
        "relative w-full md:h-(--footer-h) md:[--footer-h:480px]",
        className,
      )}
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      {...props}
    >
      <div className="w-full md:fixed md:bottom-0 md:h-(--footer-h)">
        <div className="md:sticky md:top-[calc(100vh-var(--footer-h))] md:h-full md:overflow-y-auto">
          <div className="relative flex size-full flex-col justify-between gap-5 border-t bg-background px-4 py-8 md:px-12">
            {/* soft light beams */}
            <div
              aria-hidden
              className="absolute inset-0 isolate z-0 overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,color-mix(in_oklab,var(--primary)_10%,transparent)_0,transparent_50%,transparent_80%)]" />
              <div className="absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,color-mix(in_oklab,var(--foreground)_4%,transparent)_0,color-mix(in_oklab,var(--foreground)_1%,transparent)_80%,transparent_100%)]" />
              <div className="absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,color-mix(in_oklab,var(--foreground)_4%,transparent)_0,color-mix(in_oklab,var(--foreground)_1%,transparent)_80%,transparent_100%)]" />
            </div>

            <div className="relative z-10 mx-auto mt-6 flex w-full max-w-6xl flex-col gap-8 md:flex-row xl:mt-0">
              <div className="flex w-full max-w-sm flex-col gap-4">
                {brand}
                {description ? (
                  <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
                {extra}
                {socialLinks.length > 0 ? (
                  <div className="flex gap-2">
                    {socialLinks.map((link) => (
                      <a
                        key={link.title}
                        href={link.href}
                        aria-label={link.title}
                        target="_blank"
                        rel="noreferrer"
                        className="flex size-8 items-center justify-center rounded-md border bg-background hover:bg-muted"
                      >
                        <link.icon className="size-4" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              {groups.map((group) => (
                <div key={group.label} className="w-full">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-sm font-medium uppercase tracking-wide">
                      {group.label}
                    </h3>
                    <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                      {group.links.map((link) => (
                        <li key={link.title}>
                          <Link
                            href={link.href}
                            className="inline-flex items-center transition-colors duration-300 hover:text-foreground"
                          >
                            {link.icon ? (
                              <link.icon className="me-1 size-4" />
                            ) : null}
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t pt-3 text-sm text-muted-foreground md:flex-row">
              <div>{bottomLeft}</div>
              <div>{bottomRight}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
