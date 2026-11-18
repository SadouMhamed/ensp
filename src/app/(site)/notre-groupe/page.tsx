import type { Metadata } from "next";
import { group } from "@/content/site";
import { PageHero } from "@/components/site/page-hero";
import { Subsidiaries } from "@/components/site/group/subsidiaries";

export const metadata: Metadata = { title: "Notre Groupe" };

// Rubrique « Notre Groupe » : Filiales du Groupe ENSP · ALSCIF · DFSP · HESP.
export default function GroupPage() {
  return (
    <>
      <PageHero
        eyebrow={group.eyebrow}
        title={group.title}
        description={group.intro}
      />
      <Subsidiaries />
    </>
  );
}
