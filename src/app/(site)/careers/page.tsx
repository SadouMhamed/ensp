import type { Metadata } from "next";
import { MailIcon } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Media } from "@/components/site/media";
import { PageHero } from "@/components/site/page-hero";
import { Container, DisplayHeading, Eyebrow } from "@/components/site/section";

export const metadata: Metadata = { title: "Carrières" };

// ⚠️ Textes provisoires : à remplacer par les informations de recrutement de l'ENSP.
export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Carrières"
        title="Construisez votre carrière sur le terrain"
        description="Rejoignez les ingénieurs, techniciens et spécialistes qui assurent chaque jour le bon fonctionnement des puits."
      />
      <section className="py-16 md:py-24">
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Eyebrow>Nous rejoindre</Eyebrow>
            <DisplayHeading>
              Ingénieurs, techniciens et spécialistes
            </DisplayHeading>
            <p className="text-muted-foreground">
              Envoyez votre candidature et votre CV à notre service recrutement.
              Nous vous contacterons dès qu&apos;un poste correspondant à votre
              profil sera ouvert.
            </p>
            <a
              href={`mailto:${site.contact.email}?subject=Candidature`}
              className={cn(buttonVariants({ size: "lg" }), "h-12 w-fit px-6")}
            >
              <MailIcon data-icon="inline-start" />
              Envoyer ma candidature
            </a>
          </div>
          <Media
            label="Équipe sur le terrain"
            className="aspect-[4/3] w-full"
          />
        </Container>
      </section>
    </>
  );
}
