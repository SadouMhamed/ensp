import {
  CogIcon,
  LandmarkIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react";
import { home } from "@/content/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, SectionHeader } from "../section";
import { OrgChart } from "./org-chart";

const icons: Record<string, LucideIcon> = {
  governance: LandmarkIcon,
  operations: CogIcon,
  functions: UsersRoundIcon,
};

/** 2. Organisation : introduction, 3 piliers, puis l'organigramme (onglets). */
export function Organisation() {
  const { organisation: o } = home;
  return (
    <section
      id="organisation"
      className="scroll-mt-28 border-y bg-muted/40 py-20 md:py-24"
    >
      <Container className="flex flex-col gap-12">
        <SectionHeader
          align="center"
          badge={o.eyebrow}
          title={o.title}
          description={o.paragraphs[0]}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {o.pillars.map((pillar) => {
            const Icon = icons[pillar.icon] ?? CogIcon;
            return (
              <Card key={pillar.title}>
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <CardTitle className="text-lg">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {pillar.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 text-sm leading-relaxed text-muted-foreground md:grid-cols-3">
          {o.paragraphs.slice(1).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <OrgChart />
      </Container>
    </section>
  );
}
