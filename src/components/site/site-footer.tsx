import Link from "next/link";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { BRAND_NAME, Logo } from "@/components/brand/logo";
import { footerColumns, site, telHref } from "@/content/site";
import { StickyFooter } from "@/components/ui/sticky-footer";

/** Website footer: the sticky "reveal" footer, filled with ENSP's content. */
export function SiteFooter() {
  return (
    <StickyFooter
      brand={
        <Link href="/" className="flex w-fit items-center gap-3">
          <Logo size={44} />
          <span className="text-xl font-semibold tracking-wide">
            {BRAND_NAME}
          </span>
        </Link>
      }
      description={site.tagline}
      extra={
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <MapPinIcon
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden
            />
            {site.contact.address}
          </li>
          <li className="flex items-center gap-2">
            <PhoneIcon className="size-4 shrink-0 text-primary" aria-hidden />
            <a
              href={telHref(site.contact.phone)}
              className="hover:text-foreground"
            >
              {site.contact.phone}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <MailIcon className="size-4 shrink-0 text-primary" aria-hidden />
            <a
              href={`mailto:${site.contact.email}`}
              className="hover:text-foreground"
            >
              {site.contact.email}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ClockIcon className="size-4 shrink-0 text-primary" aria-hidden />
            {site.contact.hours}
          </li>
        </ul>
      }
      groups={footerColumns.map((col) => ({
        label: col.title,
        links: col.links,
      }))}
      bottomLeft={<p>© {BRAND_NAME}. Tous droits réservés.</p>}
      bottomRight={<p>Entreprise Nationale de Services aux Puits</p>}
    />
  );
}
