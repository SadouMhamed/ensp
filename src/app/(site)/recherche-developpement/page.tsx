import type { Metadata } from "next";
import { rdPage } from "@/content/site";
import { TopicPage } from "@/components/site/topic-page";

export const metadata: Metadata = { title: "Recherche & développement" };

// Rubrique « R&D » : Présentation · Projets développés · Conventions & partenariats.
export default function ResearchPage() {
  return <TopicPage page={rdPage} />;
}
