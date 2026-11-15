import { home } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import StickyContentWrapper, {
  type StickyContentItem,
} from "@/components/ui/sticky-content-wrapper";
import { Media } from "@/components/site/media";

/**
 * 3. Notre Vision : récit au défilement (texte à gauche, visuel à droite).
 * Étapes : l'ambition, la vision stratégique, puis les 10 engagements regroupés en 3 thèmes.
 * Photos : /public/images/site (fournies par l'ENSP).
 */
export function Vision() {
  const { vision: v } = home;
  const c = v.commitments;

  const steps: Omit<StickyContentItem, "eyebrow">[] = [
    {
      heading: "Notre ambition",
      paragraphs: [v.statement],
      media: (
        <Media
          src="/images/site/vision-1-equipe.jpg"
          alt="Équipe de l'ENSP sur un chantier de forage"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="size-full"
        />
      ),
    },
    {
      heading: "Une vision stratégique",
      paragraphs: [v.text],
      media: (
        <Media
          src="/images/site/vision-2-atelier.jpg"
          alt="Opérateur de l'ENSP au poste de commande d'un atelier"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="size-full"
        />
      ),
    },
    {
      heading: "Qualité, sécurité & partenaires",
      paragraphs: [v.commitmentsLead],
      list: [c[0], c[1], c[2]],
      media: (
        <Media
          src="/images/site/vision-3-securite.jpg"
          alt="Opérateur de l'ENSP équipé de ses protections individuelles"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="size-full"
        />
      ),
    },
    {
      heading: "Moyens & capital humain",
      paragraphs: [v.commitmentsLead],
      list: [c[3], c[4], c[9]],
      media: (
        <Media
          src="/images/site/vision-4-equipe-nuit.jpg"
          alt="Équipe de l'ENSP sur site de nuit"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="size-full"
        />
      ),
    },
    {
      heading: "Innovation & durabilité",
      paragraphs: [v.commitmentsLead],
      list: [c[5], c[6], c[7], c[8]],
      media: (
        <Media
          src="/images/site/vision-5-innovation.jpg"
          alt="Opérateurs de l'ENSP en salle de contrôle"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="size-full"
        />
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
