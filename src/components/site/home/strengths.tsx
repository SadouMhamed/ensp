import { Badge } from "@/components/ui/badge";
import Timeline from "@/components/ui/timeline";
import { Media } from "@/components/site/media";
import { getSection } from "@/server/queries/sections";

/**
 * 4. Nos Atouts Clés : timeline horizontale animée au défilement (GSAP).
 * Les atouts sont numérotés 01 → 06 et alternent en haut / en bas de la ligne.
 * Contenu modifiable dans le tableau de bord (Website sections → Home: Nos atouts clés).
 */
export async function Strengths() {
  const { visible, content: s } = await getSection("home_strengths");
  if (!visible) return null;
  const items = s.items.map((item, i) => ({
    id: item.id,
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
      periodLabel={s.periodLabel || undefined}
      media={
        s.image ? (
          <Media
            src={s.image.url}
            alt={s.image.alt}
            sizes="(min-width: 640px) 30vw, 85vw"
            className="size-full"
          />
        ) : undefined
      }
      items={items}
      duration={1.4}
    />
  );
}
