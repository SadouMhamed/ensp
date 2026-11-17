import { CeoMessage } from "@/components/site/home/ceo-message";
import { Hero } from "@/components/site/home/hero";
import { LatestNews } from "@/components/site/home/latest-news";
import { Organisation } from "@/components/site/home/organisation";
import { Presentation } from "@/components/site/home/presentation";
import { Strengths } from "@/components/site/home/strengths";
import { Vision } from "@/components/site/home/vision";

// Page d'accueil : héro → Présentation → Organisation → Notre Vision →
// Nos Atouts Clés → Mot du PDG → Actualités. Textes dans src/content/site.ts.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Presentation />
      <Organisation />
      <Vision />
      <Strengths />
      <CeoMessage />
      <LatestNews />
    </>
  );
}
