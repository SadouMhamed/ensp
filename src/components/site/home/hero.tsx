import Link from "next/link";
import { ArrowRightIcon, ChevronsDownIcon } from "lucide-react";
import { home } from "@/content/site";
import { cn } from "@/lib/utils";
import { getSection } from "@/server/queries/sections";
import { buttonVariants } from "@/components/ui/button";
import { Media } from "@/components/site/media";
import { Container } from "../section";

/**
 * Hero : photos plein écran empilées au défilement (inspiré du bloc "smooth-scroll").
 * Chaque diapositive reste collée sous l'en-tête (`sticky`) et la suivante glisse par-dessus.
 * L'en-tête du site reste toujours visible. Défilement doux : voir SmoothScroll (Lenis).
 * Contenu (diapositives, photos, textes) : modifiable dans le tableau de bord
 * (Website sections → Home: hero slides). Boutons et nom de l'entreprise : site.ts.
 */
export async function Hero() {
  const { hero } = home;
  const { visible, content } = await getSection("home_hero");
  if (!visible) return null;
  const slides = content.slides;
  const total = String(slides.length).padStart(2, "0");

  return (
    <section aria-label="Présentation de l'ENSP" className="relative">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "sticky top-(--site-header-h) h-[calc(100svh-var(--site-header-h))] overflow-hidden bg-foreground",
            i > 0 &&
              "rounded-t-2xl shadow-[0_-12px_40px_rgb(0_0_0/0.35)] md:rounded-t-3xl",
          )}
        >
          <Media
            src={slide.image?.url}
            alt={slide.image?.alt}
            label={slide.image ? undefined : `hero ${i + 1}`}
            priority={i === 0}
            className="absolute inset-0 size-full"
          />
          {/* Dark overlay so the white text stays readable on any photo */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/10"
          />

          <Container className="relative flex h-full flex-col justify-end gap-5 pb-14 text-white md:pb-20">
            {i === 0 ? (
              <h1 className="flex items-center gap-2 text-sm font-medium tracking-wide text-white/85">
                <span className="size-2 rounded-full bg-primary" aria-hidden />
                {hero.title}
              </h1>
            ) : null}
            <span className="text-sm font-semibold text-primary tabular-nums">
              {String(i + 1).padStart(2, "0")} / {total}
            </span>
            <h2 className="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-6xl">
              {slide.title}
            </h2>
            {slide.text ? (
              <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                {slide.text}
              </p>
            ) : null}

            {i === 0 ? (
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={hero.primaryCta.href}
                  className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
                >
                  {hero.primaryCta.label}
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
                <Link
                  href={hero.secondaryCta.href}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-11 border-white/40 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white",
                  )}
                >
                  {hero.secondaryCta.label}
                </Link>
              </div>
            ) : null}
          </Container>

          {i === 0 ? (
            <div
              aria-hidden
              className="absolute right-6 bottom-6 hidden flex-col items-center gap-1 text-xs text-white/70 md:flex"
            >
              Défiler
              <ChevronsDownIcon className="size-5 animate-bounce" />
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
}
