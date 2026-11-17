import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/** Page-width container used by every site section. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}
      {...props}
    />
  );
}

/** Small label above a heading, as a shadcn Badge. */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Badge variant="secondary" className={cn("w-fit", className)}>
      {children}
    </Badge>
  );
}

/** Section title (shadcn-style: semibold, tight). */
export function DisplayHeading({
  as: Tag = "h2",
  className,
  ...props
}: React.ComponentProps<"h2"> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Tag
      className={cn(
        "text-3xl font-semibold tracking-tight text-balance md:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

/** Badge + title + description, left or centered. */
export function SectionHeader({
  badge,
  title,
  description,
  align = "left",
  className,
}: {
  badge: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <Eyebrow>{badge}</Eyebrow>
      <DisplayHeading>{title}</DisplayHeading>
      {description ? (
        <p className="text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** "Voir →" style text link. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
      <ArrowRightIcon
        className="size-4 transition-transform group-hover:translate-x-1"
        aria-hidden
      />
    </Link>
  );
}
