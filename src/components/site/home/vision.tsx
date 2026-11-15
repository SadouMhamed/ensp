import { Badge } from "@/components/ui/badge";
import StickyContentWrapper from "@/components/ui/sticky-content-wrapper";
import { Media } from "@/components/site/media";
import { getSection } from "@/server/queries/sections";

/**
 * 3. Notre Vision : récit au défilement (texte à gauche, visuel à droite).
 * Étapes, textes et photos : modifiables dans le tableau de bord
 * (Website sections → Home: Notre Vision).
 */
export async function Vision() {
  const { visible, content: v } = await getSection("home_vision");
  if (!visible) return null;
  const total = String(v.steps.length).padStart(2, "0");

  const items = v.steps.map((step, i) => ({
    eyebrow: `${String(i + 1).padStart(2, "0")} / ${total}`,
    heading: step.heading,
    paragraphs: step.text ? [step.text] : [],
    list: step.list,
    media: (
      <Media
        src={step.image?.url}
        alt={step.image?.alt}
        label={step.image ? undefined : step.heading}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="size-full"
      />
    ),
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
