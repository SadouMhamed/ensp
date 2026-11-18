import { SqueezeCarousel } from "@/components/ui/carousel-squeeze";
import { home } from "@/content/site";
import { Container, SectionHeader } from "../section";

/**
 * 6. L'ENSP en images : galerie photo en carrousel « squeeze » (une grande photo
 * ouverte, les suivantes en colonnes de plus en plus fines).
 * Photos et légendes dans src/content/site.ts → home.gallery.
 */
export function Gallery() {
  const g = home.gallery;

  return (
    <section id="galerie" className="scroll-mt-28 py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          badge={g.eyebrow}
          title={g.title}
          description={g.description}
        />
        <SqueezeCarousel
          label={g.title}
          previousLabel="Photo précédente"
          nextLabel="Photo suivante"
          height="clamp(200px, 40cqi, 420px)"
          gap="clamp(8px, 2cqi, 16px)"
          slides={g.slides.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            image: s.image,
            imageAlt: s.imageAlt,
            overlay: (
              <span className="text-sm font-medium tracking-tight text-white">
                {s.tag}
              </span>
            ),
          }))}
        />
      </Container>
    </section>
  );
}
