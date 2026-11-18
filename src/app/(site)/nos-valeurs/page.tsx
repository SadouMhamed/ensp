import type { Metadata } from "next";
import { valuesPage } from "@/content/site";
import { TopicPage } from "@/components/site/topic-page";

export const metadata: Metadata = { title: "Nos valeurs" };

// Rubrique « Nos valeurs » : Code d'éthique · SMI · Politique QHSE · Contenu local.
export default function ValuesPage() {
  return <TopicPage page={valuesPage} />;
}
