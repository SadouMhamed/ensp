import type { Metadata } from "next";
import { pillars, services } from "@/content/site";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Media } from "@/components/site/media";
import { PageHero } from "@/components/site/page-hero";
import {
  ArrowLink,
  Container,
  DisplayHeading,
} from "@/components/site/section";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Des services aux puits sur tout leur cycle de vie"
        description="Découvrez nos métiers, assurés par des équipes de terrain expérimentées, avec la sécurité comme priorité."
      />
      {pillars.map((pillar, i) => (
        <section
          key={pillar.id}
          id={pillar.id}
          className={cn(
            "scroll-mt-28 py-16 md:py-24",
            i % 2 === 1 && "bg-muted",
          )}
        >
          <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-5">
              <DisplayHeading>{pillar.title}</DisplayHeading>
              <p className="text-muted-foreground">{pillar.lead}</p>
              <Media label={pillar.title} className="aspect-video w-full" />
            </div>
            <div className="grid content-start gap-4 sm:grid-cols-2">
              {services
                .filter((s) => s.pillar === pillar.id)
                .map((s) => (
                  <Card key={s.id} id={s.id} className="scroll-mt-28">
                    <CardHeader>
                      <CardTitle className="text-xl font-light">
                        {s.title}
                      </CardTitle>
                      <CardDescription>{s.summary}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </Container>
        </section>
      ))}
      <section className="bg-foreground py-16 text-background">
        <Container className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-2xl font-light">
            Besoin de l&apos;un de ces services ?
          </p>
          <ArrowLink href="/contact" className="text-primary">
            Contactez notre équipe
          </ArrowLink>
        </Container>
      </section>
    </>
  );
}
