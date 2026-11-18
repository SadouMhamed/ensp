import Link from "next/link";
import { FileTextIcon } from "lucide-react";
import type { TopicPage as TopicPageData } from "@/content/site";
import { cn } from "@/lib/utils";
import { PageHero } from "./page-hero";
import { Container } from "./section";

/**
 * Page de rubrique (« Nos valeurs », « R&D »…) :
 * bandeau titre → liens rapides vers chaque partie → une section par partie.
 * Chaque section a son ancre (ex. #politique-qhse) pour les liens du menu déroulant.
 * Partie sans texte → encadré « Contenu à venir ».
 */
export function TopicPage({ page }: { page: TopicPageData }) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.intro}
      />

      {/* Quick links to each part of the page */}
      <nav aria-label={`Sommaire : ${page.title}`} className="border-b">
        <Container className="flex flex-wrap gap-2 py-4">
          {page.sections.map((s) => (
            <Link
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {s.title}
            </Link>
          ))}
        </Container>
      </nav>

      {page.sections.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={cn(
            "scroll-mt-28 border-b py-16 md:py-20",
            i % 2 === 1 && "bg-muted/40",
          )}
        >
          <Container className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-primary tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {s.title}
              </h2>
              {s.subtitle ? (
                <p className="text-muted-foreground">{s.subtitle}</p>
              ) : null}
            </div>

            {s.paragraphs.length > 0 ? (
              <div className="flex flex-col gap-4 leading-relaxed text-muted-foreground">
                {s.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-dashed bg-background p-6 text-sm text-muted-foreground">
                <FileTextIcon
                  className="size-5 shrink-0 text-primary"
                  aria-hidden
                />
                Contenu à venir : le texte de cette rubrique sera publié
                prochainement.
              </div>
            )}
          </Container>
        </section>
      ))}
    </>
  );
}
