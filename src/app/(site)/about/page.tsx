import type { Metadata } from "next";
import { home } from "@/content/site";
import { PageHero } from "@/components/site/page-hero";
import { Organisation } from "@/components/site/home/organisation";
import { Strengths } from "@/components/site/home/strengths";
import { Vision } from "@/components/site/home/vision";
import { CeoMessage } from "@/components/site/home/ceo-message";

export const metadata: Metadata = { title: "À propos" };

// Page « À propos » : reprend les sections institutionnelles de l'accueil.
export default function AboutPage() {
  const { presentation } = home;
  return (
    <>
      <PageHero
        eyebrow={presentation.eyebrow}
        title={presentation.title}
        description={presentation.paragraphs[0]}
      />
      <Organisation />
      <Vision />
      <Strengths />
      <CeoMessage full />
    </>
  );
}
