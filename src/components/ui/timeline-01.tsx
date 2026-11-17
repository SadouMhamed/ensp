import Timeline, {
  type TimelineItem,
} from "@/components/ui/timeline-01-utils/timeline";
import { Badge } from "@/components/ui/badge";

/**
 * Timeline block (adapted from the "timeline-01" block): bordered header with badge,
 * title and description, then the timeline. Content comes from props instead of the
 * hard-coded demo data, so it can be reused (e.g. "Nos atouts clés").
 */
export default function TimelineBlock01({
  badge,
  title,
  description,
  items,
  id,
}: {
  badge: string;
  title: string;
  description?: string;
  items: TimelineItem[];
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="border-x border-b border-border px-6 py-10 md:px-10 md:py-16 lg:px-16 lg:py-20">
          <div className="flex max-w-2xl flex-col gap-4">
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 font-normal"
            >
              {badge}
            </Badge>
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {title}
              </h2>
              {description ? (
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="border-x border-border">
          <Timeline items={items} />
        </div>
        <div className="h-16 border-x border-t border-border md:h-24" />
      </div>
    </section>
  );
}
