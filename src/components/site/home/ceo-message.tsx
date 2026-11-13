"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon, QuoteIcon } from "lucide-react";
import { home } from "@/content/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Container, SectionHeader } from "../section";

/**
 * 5. Mot du PDG : carte avec portrait, message (extrait + « Lire la suite ») et signature.
 * `full` (page À propos) affiche tout le message.
 */
export function CeoMessage({ full = false }: { full?: boolean }) {
  const { ceo } = home;
  const [open, setOpen] = useState(full);
  const intro = ceo.message.slice(0, 2);
  const rest = ceo.message.slice(2);

  return (
    <section id="mot-du-pdg" className="scroll-mt-28 py-20 md:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeader align="center" badge="Mot du PDG" title={ceo.eyebrow} />

        <Card className="overflow-hidden p-0 md:flex-row md:items-start">
          {/* Portrait: fixed 3:4 size at the top, so it doesn't stretch to the card's
              full height when the message is expanded. */}
          <div className="relative aspect-[3/4] w-full shrink-0 bg-muted md:w-72 md:rounded-br-xl">
            <Image
              src={ceo.photo}
              alt={`${ceo.name}, ${ceo.role} de l'ENSP`}
              fill
              sizes="(min-width: 768px) 20rem, 100vw"
              className="object-cover object-top"
            />
          </div>

          <div className="flex flex-1 flex-col gap-0 py-6">
            <CardContent className="flex flex-col gap-4">
              <QuoteIcon className="size-8 text-primary" aria-hidden />
              <p className="text-lg font-medium">{ceo.salutation}</p>
              <Collapsible
                open={open}
                onOpenChange={setOpen}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {intro.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
                <CollapsibleContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {rest.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </CollapsibleContent>
                {!full ? (
                  <CollapsibleTrigger
                    render={
                      <Button variant="outline" size="sm" className="w-fit" />
                    }
                  >
                    {open ? "Réduire le message" : "Lire le message complet"}
                    <ChevronDownIcon
                      data-icon="inline-end"
                      className={cn(
                        "transition-transform",
                        open && "rotate-180",
                      )}
                    />
                  </CollapsibleTrigger>
                ) : null}
              </Collapsible>
            </CardContent>
            <Separator className="my-6" />
            <CardFooter className="flex-col items-start gap-0.5">
              <span className="font-semibold">{ceo.name}</span>
              <span className="text-sm text-muted-foreground">{ceo.role}</span>
            </CardFooter>
          </div>
        </Card>
      </Container>
    </section>
  );
}
