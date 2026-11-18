import { CeoMessage } from "@/components/site/home/ceo-message";
import { Gallery } from "@/components/site/home/gallery";
import { Hero } from "@/components/site/home/hero";
import { LatestNews } from "@/components/site/home/latest-news";
import { Organisation } from "@/components/site/home/organisation";
import { Presentation } from "@/components/site/home/presentation";
import { Strengths } from "@/components/site/home/strengths";
import { Vision } from "@/components/site/home/vision";

// Page d'accueil (structure validée par le client) : héro → Présentation →
// Organisation → Notre vision → Nos atouts clés → Mot du PDG → L'ENSP en images → Actualités.
// Textes dans src/content/site.ts.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Presentation />
      <Organisation />
      <Vision />
      <Strengths />
      <CeoMessage />
      <Gallery />
      <LatestNews />
    </>
  );
}
