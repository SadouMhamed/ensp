"use client";

import Image from "next/image";
import {
  Building2Icon,
  BriefcaseIcon,
  MapPinIcon,
  NetworkIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { home } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Organigramme de l'ENSP (d'après le schéma officiel), en composants shadcn :
 * carte du PDG, puis un onglet par groupe d'entités.
 */
export function OrgChart() {
  const { chart } = home.organisation;
  const { ceo } = home;
  const ops = (kind: string) =>
    chart.operational.filter((o) => o.kind === kind).map((o) => o.name);

  const tabs = [
    {
      value: "operationnelles",
      label: "Opérationnelles",
      count: chart.operational.length,
    },
    {
      value: "fonctionnelles",
      label: "Fonctionnelles",
      count: chart.functional.length,
    },
    { value: "staff", label: "Rattachés au PDG", count: chart.staff.length },
    { value: "filiales", label: "Filiales", count: chart.subsidiaries.length },
  ];

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <CardTitle className="text-xl">Schéma organisationnel</CardTitle>
        <CardDescription>
          Structure de l&apos;ENSP, d&apos;après l&apos;organigramme officiel.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* PDG */}
        <div className="flex w-full max-w-sm items-center gap-4 rounded-xl border bg-primary p-4 text-primary-foreground shadow-sm">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg ring-2 ring-primary-foreground/40">
            <Image
              src={ceo.photo}
              alt={ceo.name}
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold">{chart.head}</span>
            <span className="text-sm opacity-85">{ceo.name}</span>
          </div>
        </div>
        <div aria-hidden className="-my-3 h-6 w-px bg-border" />

        <Tabs
          defaultValue="operationnelles"
          className="w-full items-center gap-6"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 group-data-horizontal/tabs:h-auto md:inline-flex md:w-fit">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="h-auto gap-2 px-3 py-1.5"
              >
                {t.label}
                <Badge variant="secondary" className="h-5 px-1.5 text-[11px]">
                  {t.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="operationnelles" className="w-full">
            <div className="grid gap-4 md:grid-cols-3">
              <GroupCard
                icon={BriefcaseIcon}
                title="Métiers"
                items={ops("business")}
              />
              <GroupCard
                icon={NetworkIcon}
                title="Soutien opérationnel"
                items={ops("support")}
              />
              <GroupCard
                icon={MapPinIcon}
                title="Directions régionales"
                items={ops("region")}
              />
            </div>
          </TabsContent>

          <TabsContent value="fonctionnelles" className="w-full">
            <EntityGrid items={chart.functional} icon={Building2Icon} />
          </TabsContent>

          <TabsContent value="staff" className="w-full">
            <EntityGrid items={chart.staff} icon={UsersIcon} />
          </TabsContent>

          <TabsContent value="filiales" className="w-full">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {chart.subsidiaries.map((s) => (
                <Card key={s.name} size="sm">
                  <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <CardTitle className="tracking-wide">{s.name}</CardTitle>
                    <Badge variant={s.liquidation ? "outline" : "default"}>
                      {s.liquidation ? "En liquidation" : "Active"}
                    </Badge>
                  </CardHeader>
                  {"text" in s && s.text ? (
                    <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <p>{s.text}</p>
                      {"website" in s && s.website ? (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noreferrer"
                          className="w-fit font-medium text-primary hover:underline"
                        >
                          {s.website.replace("https://", "")}
                        </a>
                      ) : null}
                    </CardContent>
                  ) : null}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function GroupCard({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <Card size="sm" className="bg-muted/30">
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((name) => (
            <li
              key={name}
              className="rounded-md border bg-background px-3 py-2"
            >
              {name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function EntityGrid({
  items,
  icon: Icon,
}: {
  items: string[];
  icon: LucideIcon;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((name) => (
        <li
          key={name}
          className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden />
          </span>
          {name}
        </li>
      ))}
    </ul>
  );
}
