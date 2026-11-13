import { Media } from "./media";
import { Container, Eyebrow } from "./section";

/** Dark title band at the top of inner pages (About, Services, Careers…). */
export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Media alt="" className="absolute inset-0 -z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-foreground/80" />
      <Container className="flex flex-col gap-5 py-20 text-background md:py-28">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="max-w-4xl text-4xl leading-[1.05] font-extralight tracking-tight text-balance md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-lg text-background/75">{description}</p>
        ) : null}
      </Container>
    </section>
  );
}
