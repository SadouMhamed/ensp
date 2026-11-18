import { ArrowUpRightIcon, Building2Icon } from "lucide-react";
import { group } from "@/content/site";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "../section";

/**
 * Page « Notre Groupe » : une carte par filiale (ALSCIF, DFSP, HESP).
 * Chaque carte a son ancre (#alscif, #dfsp, #hesp) pour les liens du menu déroulant.
 */
export function Subsidiaries() {
  return (
    <section id="filiales" className="scroll-mt-28 py-20 md:py-24">
      <Container className="grid gap-4 md:grid-cols-3">
        {group.subsidiaries.map((s) => (
          <Card key={s.id} id={s.id} className="scroll-mt-28">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2Icon className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-xl tracking-wide">{s.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 text-sm leading-relaxed text-muted-foreground">
              {s.text}
            </CardContent>
            {s.website ? (
              <CardFooter>
                <a
                  href={s.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {s.website.replace("https://", "")}
                  <ArrowUpRightIcon className="size-4" aria-hidden />
                </a>
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </Container>
    </section>
  );
}
