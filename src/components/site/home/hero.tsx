import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { home } from "@/content/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "../section";

/** Hero (shadcn style): badge, bold headline, description, buttons, key-figure cards. */
export function Hero() {
  const { hero, presentation } = home;
  return (
    <section className="relative isolate overflow-hidden border-b">
      {/* soft brand glow + dotted grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <Container className="flex flex-col items-center gap-8 py-20 text-center md:py-28">
        <Badge
          variant="outline"
          className="gap-2 bg-background px-3 py-1 text-sm"
        >
          <span className="size-2 rounded-full bg-primary" aria-hidden />
          {hero.eyebrow}
        </Badge>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          {hero.title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {hero.description}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
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
              "h-11 px-6",
            )}
          >
            {hero.secondaryCta.label}
          </Link>
        </div>

        <div className="mt-6 grid w-full gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {presentation.figures.map((f) => (
            <Card key={f.label} className="bg-background/80 backdrop-blur">
              <CardHeader>
                <CardDescription>{f.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
                  {f.value}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
