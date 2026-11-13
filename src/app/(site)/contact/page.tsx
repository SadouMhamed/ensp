import type { Metadata } from "next";
import {
  Building2Icon,
  ClockIcon,
  ExternalLinkIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
} from "lucide-react";
import { departmentContacts, locations, site, telHref } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHero } from "@/components/site/page-hero";
import { Container, SectionHeader } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Coordonnées du siège social de l'ENSP à Hassi Messaoud, de l'antenne d'Alger et des directions régionales.",
};

const kindLabel: Record<(typeof locations)[number]["kind"], string> = {
  siege: "Siège",
  antenne: "Antenne",
  operations: "Direction opérationnelle",
  region: "Direction régionale",
  district: "District",
};

export default function ContactPage() {
  const c = site.contact;
  const headOffice = [
    { icon: MapPinIcon, label: "Adresse", value: c.address },
    {
      icon: PhoneIcon,
      label: "Téléphone",
      value: c.phone,
      href: telHref(c.phone),
    },
    { icon: PrinterIcon, label: "Fax", value: c.fax },
    {
      icon: MailIcon,
      label: "E-mail",
      value: c.email,
      href: `mailto:${c.email}`,
    },
    { icon: ClockIcon, label: "Horaires", value: c.hours },
    {
      icon: GlobeIcon,
      label: "Site web",
      value: site.website.replace("https://", ""),
      href: site.website,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contactez nos équipes"
        description="Pour une demande de prestation, un partenariat ou une question, contactez le siège social ou l'implantation la plus proche."
      />

      <section className="py-16 md:py-24">
        <Container className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardHeader>
              <Building2Icon className="size-6 text-primary" aria-hidden />
              <CardTitle className="text-xl">
                Siège social · Direction Générale
              </CardTitle>
              <CardDescription>Hassi Messaoud, Ouargla</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                {headOffice.map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <item.icon
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    <div className="flex flex-col gap-0.5 text-sm">
                      <dt className="font-medium">{item.label}</dt>
                      <dd className="text-muted-foreground">
                        {item.href ? (
                          <a href={item.href} className="hover:underline">
                            {item.value}
                          </a>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              <a
                href={c.mapUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ className: "w-fit" })}
              >
                Voir sur la carte
                <ExternalLinkIcon data-icon="inline-end" aria-hidden />
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MailIcon className="size-6 text-primary" aria-hidden />
              <CardTitle className="text-xl">Contacts par service</CardTitle>
              <CardDescription>
                Écrivez directement au service concerné.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col divide-y">
                {departmentContacts.map((d) => (
                  <li
                    key={d.email}
                    className="flex flex-col gap-0.5 py-3 text-sm first:pt-0 last:pb-0"
                  >
                    <span className="font-medium">{d.title}</span>
                    <a
                      href={`mailto:${d.email}`}
                      className="break-all text-muted-foreground hover:underline"
                    >
                      {d.email}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section className="border-t bg-muted/40 py-16 md:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            badge="Implantations"
            title="Nos implantations"
            description="L'ENSP est présente sur les principaux champs pétroliers et gaziers du pays."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((l) => (
              <Card key={l.title} size="sm">
                <CardHeader className="gap-2">
                  <Badge variant="secondary" className="w-fit">
                    {kindLabel[l.kind]}
                  </Badge>
                  <CardTitle>{l.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <p className="flex gap-2">
                    <MapPinIcon
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    {l.address}
                  </p>
                  {l.phone ? (
                    <p className="flex gap-2">
                      <PhoneIcon
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <a href={telHref(l.phone)} className="hover:underline">
                        {l.phone}
                      </a>
                    </p>
                  ) : null}
                  {l.fax ? (
                    <p className="flex gap-2">
                      <PrinterIcon
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      Fax {l.fax}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
