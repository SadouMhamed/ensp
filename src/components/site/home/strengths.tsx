import { home } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import Timeline from "@/components/ui/timeline";
import { Media } from "@/components/site/media";

/**
 * 4. Nos Atouts Clés : timeline horizontale animée au défilement (GSAP).
 * Les atouts sont numérotés 01 → 06 et alternent en haut / en bas de la ligne.
 */
export function Strengths() {
  const { strengths: s } = home;
  const items = s.items.map((item, i) => ({
    id: item.icon,
    marker: String(i + 1).padStart(2, "0"),
    title: item.title,
    description: item.text,
  }));

  return (
    <Timeline
      id="atouts"
      className="scroll-mt-28"
      eyebrow={
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
          {s.eyebrow}
        </Badge>
      }
      title={s.title}
      periodLabel="Depuis 1981"
      // Remplacer par une vraie photo de chantier : <Media src="/images/…" alt="…" />
      media={
        <Media
          label="Équipes ENSP sur chantier"
          className="size-full"
        />
      }
      items={items}
      duration={1.4}
    />
  );
}
