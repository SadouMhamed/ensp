import Image from "next/image";
import {
  Building2Icon,
  BriefcaseIcon,
  CircleDotIcon,
  MapPinIcon,
  NetworkIcon,
  UserRoundIcon,
  UsersIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";
import { home } from "@/content/site";
import { cn } from "@/lib/utils";
import { getSection } from "@/server/queries/sections";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Group = { title: string; icon: LucideIcon; items: string[] };

type Branch = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  content: React.ReactNode;
};

/**
 * Organigramme de l'ENSP (d'après le schéma officiel), en arbre :
 * - ordinateur : le PDG en haut, ses services rattachés sur une branche, puis 3 colonnes
 *   reliées par des traits (Fonctionnelles, Opérationnelles, Filiales) ;
 * - téléphone : les 3 branches deviennent un accordéon (ouvrir / fermer).
 * Photo et nom du PDG : ceux de la section « Mot du PDG » du tableau de bord.
 */
export async function OrgChart() {
  const { chart } = home.organisation;
  const { content: ceo } = await getSection("home_ceo");

  const ops = (kind: string) =>
    chart.operational.filter((o) => o.kind === kind).map((o) => o.name);
  const operational: Group[] = [
    { title: "Métiers", icon: BriefcaseIcon, items: ops("business") },
    { title: "Soutien opérationnel", icon: WrenchIcon, items: ops("support") },
    { title: "Directions régionales", icon: MapPinIcon, items: ops("region") },
  ];
  const active = chart.subsidiaries.filter((s) => !s.liquidation);
  const inLiquidation = chart.subsidiaries.filter((s) => s.liquidation);

  const branches: Branch[] = [
    {
      id: "fonctionnelles",
      title: "Structures fonctionnelles",
      description: "Pilotage, support et expertise",
      icon: Building2Icon,
      count: chart.functional.length,
      content: <EntityList items={chart.functional} />,
    },
    {
      id: "operationnelles",
      title: "Structures opérationnelles",
      description: "Métiers, soutien et régions",
      icon: NetworkIcon,
      count: chart.operational.length,
      content: (
        <div className="flex flex-col gap-4">
          {operational.map((g, i) => (
            <div key={g.title} className="flex flex-col gap-2">
              {i > 0 ? <Separator className="mb-2" /> : null}
              <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <g.icon className="size-3.5 text-primary" aria-hidden />
                {g.title}
                <Badge variant="outline" className="h-4 px-1 text-[10px]">
                  {g.items.length}
                </Badge>
              </div>
              <EntityList items={g.items} />
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "filiales",
      title: "Filiales",
      description: "Sociétés du groupe ENSP",
      icon: CircleDotIcon,
      count: chart.subsidiaries.length,
      content: (
        <div className="flex flex-col gap-3">
          {active.map((s) => (
            <div
              key={s.name}
              className="flex flex-col gap-1 rounded-lg border p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold tracking-wide">{s.name}</span>
                <Badge>Active</Badge>
              </div>
              {"text" in s && s.text ? (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              ) : null}
              {"website" in s && s.website ? (
                <a
                  href={s.website}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit text-xs font-medium text-primary hover:underline"
                >
                  {s.website.replace("https://", "")}
                </a>
              ) : null}
            </div>
          ))}
          {inLiquidation.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>En liquidation :</span>
              {inLiquidation.map((s) => (
                <Badge key={s.name} variant="outline" className="opacity-70">
                  {s.name}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-xl">Schéma organisationnel</CardTitle>
        <CardDescription>
          Structure de l&apos;ENSP, d&apos;après l&apos;organigramme officiel.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        {/* 1. PDG */}
        <div className="flex w-full max-w-sm items-center gap-4 rounded-xl bg-primary p-4 text-primary-foreground shadow-md">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-primary-foreground/20 ring-2 ring-primary-foreground/40">
            {ceo.photo ? (
              <Image
                src={ceo.photo.url}
                alt={ceo.photo.alt}
                fill
                sizes="56px"
                className="object-cover object-top"
              />
            ) : (
              <UserRoundIcon className="m-auto size-full p-3" aria-hidden />
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold">{chart.head}</span>
            <span className="text-sm opacity-85">{ceo.name}</span>
          </div>
        </div>

        <Connector />

        {/* 2. Rattachés au PDG (état-major) */}
        <div className="flex w-full max-w-3xl flex-col items-center gap-3 rounded-xl border border-dashed bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <UsersIcon className="size-4 text-primary" aria-hidden />
            Rattachés au PDG
          </div>
          <ul className="flex flex-wrap justify-center gap-2">
            {chart.staff.map((name) => (
              <li key={name}>
                <Badge
                  variant="secondary"
                  className="h-auto py-1 whitespace-normal"
                >
                  {name}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <Connector />

        {/* 3a. Ordinateur : 3 colonnes reliées par un trait horizontal */}
        <div className="hidden w-full lg:block">
          <div aria-hidden className="relative h-6">
            {/* horizontal line between the centres of the first and last columns */}
            <span
              className="absolute top-0 h-px bg-border"
              style={{
                left: "calc((100% - 3rem) / 6)",
                right: "calc((100% - 3rem) / 6)",
              }}
            />
            {[
              "calc((100% - 3rem) / 6)",
              "50%",
              "calc(100% - (100% - 3rem) / 6)",
            ].map((left) => (
              <span
                key={left}
                className="absolute top-0 h-6 w-px -translate-x-1/2 bg-border"
                style={{ left }}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 items-start gap-6">
            {branches.map((b) => (
              <Card key={b.id} size="sm" className="h-full">
                <CardHeader>
                  <BranchTitle branch={b} />
                </CardHeader>
                <CardContent>{b.content}</CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 3b. Téléphone / tablette : accordéon */}
        <Accordion
          multiple
          defaultValue={["operationnelles"]}
          className="w-full rounded-xl border bg-background lg:hidden"
        >
          {branches.map((b) => (
            <AccordionItem key={b.id} value={b.id}>
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <BranchTitle branch={b} />
              </AccordionTrigger>
              <AccordionContent className="pb-4">{b.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function Connector() {
  return <div aria-hidden className="h-6 w-px bg-border" />;
}

function BranchTitle({ branch }: { branch: Branch }) {
  return (
    <div className="flex w-full items-center gap-3 text-left">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <branch.icon className="size-4" aria-hidden />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="font-medium">{branch.title}</span>
        <span className="text-xs font-normal text-muted-foreground">
          {branch.description}
        </span>
      </span>
      <Badge variant="secondary">{branch.count}</Badge>
    </div>
  );
}

function EntityList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {items.map((name) => (
        <li
          key={name}
          className="flex items-start gap-2 border-b border-dashed py-1.5 text-sm last:border-b-0"
        >
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
            aria-hidden
          />
          {name}
        </li>
      ))}
    </ul>
  );
}
