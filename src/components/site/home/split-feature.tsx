import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Media } from "../media";
import { DisplayHeading, Eyebrow } from "../section";

/** Half image / half text band (SLB "Careers" / "Sustainability report" pattern). */
export function SplitFeature({
  eyebrow,
  title,
  body,
  cta,
  imageLabel,
  imageSrc,
  reverse,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  imageLabel: string;
  imageSrc?: string | null;
  reverse?: boolean;
}) {
  return (
    <section className="grid md:grid-cols-2">
      <Media
        src={imageSrc}
        label={imageLabel}
        className={cn("min-h-72 md:min-h-[28rem]", reverse && "md:order-2")}
      />
      <div className="flex flex-col justify-center gap-6 bg-muted px-6 py-14 md:px-16">
        <Eyebrow>{eyebrow}</Eyebrow>
        <DisplayHeading>{title}</DisplayHeading>
        <p className="max-w-md text-muted-foreground">{body}</p>
        <Link
          href={cta.href}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 w-fit px-6",
          )}
        >
          {cta.label}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>
    </section>
  );
}
