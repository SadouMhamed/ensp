import { CheckCircle2Icon, TargetIcon } from "lucide-react";
import { home } from "@/content/site";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Media } from "../media";
import { Container, SectionHeader } from "../section";

/** 1. Présentation : texte + photo + carte « Notre mission ». */
export function Presentation() {
  const { presentation: p } = home;

  return (
    <section id="presentation" className="scroll-mt-28 py-20 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <SectionHeader badge={p.eyebrow} title={p.title} />
          <div className="flex flex-col gap-4 text-muted-foreground">
            {p.paragraphs.map((text) => (
              <p key={text} className="flex gap-3">
                <CheckCircle2Icon
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden
                />
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden p-0">
            <Media
              label="ENSP sur le terrain"
              className="aspect-video w-full"
            />
          </Card>
          <Card>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TargetIcon className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">{p.mission.title}</CardTitle>
              <CardDescription>
                Ce qui guide chacune de nos interventions.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {p.mission.text}
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
