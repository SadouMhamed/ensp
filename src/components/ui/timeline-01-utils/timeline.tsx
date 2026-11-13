import Image from "next/image";
import { cn } from "@/lib/utils";

export type TimelineItem = {
  title: string;
  description: string;
  /** Marker shown next to the dot: a year, a step number ("01")… */
  date: string;
  /** Optional image (local path or an allowed remote URL). */
  image?: string;
  /** Optional icon shown in the dot. */
  icon?: React.ReactNode;
};

/**
 * Vertical timeline (companion of timeline-01.tsx, written for this project because the
 * original "timeline-01-utils/timeline" file wasn't provided).
 * - Phones: one column, line on the left.
 * - md+: marker column (big date/number, sticky) | line with dot | content.
 */
export default function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((item, i) => (
        <li
          key={`${item.date}-${item.title}`}
          className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-border last:border-b-0 md:grid-cols-[10rem_3rem_1fr] md:gap-x-0"
        >
          {/* Marker (md+) */}
          <div className="hidden px-6 py-10 md:block md:py-14">
            <span className="sticky top-28 block text-4xl font-semibold tracking-tight text-primary tabular-nums lg:text-5xl">
              {item.date}
            </span>
          </div>

          {/* Line + dot */}
          <div className="relative flex justify-center">
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border",
                i === 0 && "top-12 md:top-16",
                i === items.length - 1 && "bottom-auto h-12 md:h-16",
              )}
            />
            <span
              aria-hidden
              className="relative mt-9 flex size-7 items-center justify-center rounded-full border-2 border-primary bg-background text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground md:mt-13 [&_svg]:size-3.5"
            >
              {item.icon ?? <span className="size-2 rounded-full bg-current" />}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 py-8 pr-6 md:px-8 md:py-14 lg:px-12">
            <span className="text-sm font-semibold text-primary md:hidden">
              {item.date}
            </span>
            <h3 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
              {item.title}
            </h3>
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            {item.image ? (
              <div className="relative mt-3 aspect-video w-full max-w-xl overflow-hidden rounded-xl border bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 36rem, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
