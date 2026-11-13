import { home } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import StickyContentWrapper, {
  type StickyContentItem,
} from "@/components/ui/sticky-content-wrapper";
import { Media } from "@/components/site/media";

/**
 * 3. Notre Vision : récit au défilement (texte à gauche, visuel à droite).
 * Étapes : l'ambition, la vision stratégique, puis les 10 engagements regroupés en 3 thèmes.
 * Visuels : à remplacer par de vraies photos → <Media src="/images/…" alt="…" />.
 */
export function Vision() {
  const { vision: v } = home;
  const c = v.commitments;

  const steps: Omit<StickyContentItem, "eyebrow">[] = [
    {
      heading: "Notre ambition",
      paragraphs: [v.statement],
      media: <Media label="Ambition de l'ENSP" className="size-full" />,
    },
    {
      heading: "Une vision stratégique",
      paragraphs: [v.text],
      media: <Media label="Transformation du secteur" className="size-full" />,
    },
    {
      heading: "Qualité, sécurité & partenaires",
      paragraphs: [v.commitmentsLead],
      list: [c[0], c[1], c[2]],
      media: <Media label="Sécurité sur chantier" className="size-full" />,
    },
    {
      heading: "Moyens & capital humain",
      paragraphs: [v.commitmentsLead],
      list: [c[3], c[4], c[9]],
      media: <Media label="Équipes et équipements" className="size-full" />,
    },
    {
      heading: "Innovation & durabilité",
      paragraphs: [v.commitmentsLead],
      list: [c[5], c[6], c[7], c[8]],
      media: (
        <Media label="Innovation et environnement" className="size-full" />
      ),
    },
  ];

  const items = steps.map((step, i) => ({
    ...step,
    eyebrow: `${String(i + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`,
  }));

  return (
    <StickyContentWrapper
      id="vision"
      className="border-y"
      header={
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
          {v.eyebrow}
        </Badge>
      }
      items={items}
    />
  );
}
