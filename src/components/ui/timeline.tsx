// Adapted from a Hyperiux Vault component (https://vault.hyperiux.com).
"use client";

import {
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Horizontal scroll timeline.
 * The section pins under the header, the track slides sideways as you scroll, and each
 * item draws its stem and reveals its text as it reaches the middle of the screen.
 *
 * Changes from the original block:
 * - Items come from props (no hard-coded journey data); they alternate top / bottom.
 * - Track width and scroll length are measured, so any number of items works
 *   (the original was tuned for exactly 7).
 * - Item reveals use ScrollTrigger `containerAnimation` (triggered by each item's real
 *   position) instead of hand-written scroll percentages.
 * - Colors use the theme (primary, foreground, muted-foreground) instead of inline styles.
 * - With "reduce motion" turned on, texts are shown at once (only the sideways scroll stays).
 */

export type TimelineEntry = {
  id: string;
  /** Small marker above the title, e.g. "01" or a year. */
  marker: string;
  title: string;
  description: string;
};

export type TimelineProps = {
  items: TimelineEntry[];
  /** Big heading shown at the start of the track. */
  title: string;
  /** Small badge above the title. */
  eyebrow?: ReactNode;
  /** Label shown under the title (e.g. a period). */
  periodLabel?: string;
  /** Visual at the start of the track (e.g. a photo). */
  media?: ReactNode;
  /** Reveal animation duration, in seconds (relative, since reveals follow the scroll). */
  duration?: number;
  id?: string;
  className?: string;
};

/* Inline stand-in for @gsap/react's useGSAP: one gsap.context for the component's
   lifetime; the callback is re-added when dependencies change; reverted on unmount. */
function useGSAP(
  callback: () => void | (() => void),
  options: {
    dependencies?: unknown[];
    scope: { current: Element | null };
  },
) {
  const deps = options.dependencies ?? [];
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const scope = options.scope;

  useLayoutEffect(() => {
    ctxRef.current = gsap.context(() => {}, scope.current ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [scope]);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    ctxRef.current.revert();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export default function Timeline({
  items,
  title,
  eyebrow,
  periodLabel,
  media,
  duration = 1.2,
  id,
  className,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const d = Math.max(0.2, duration);

  const top = items.filter((_, i) => i % 2 === 0);
  const bottom = items.filter((_, i) => i % 2 === 1);

  useGSAP(
    () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;

      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);

      // 1. Pin the section and slide the track sideways while scrolling.
      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // 2. The main line grows with the scroll.
      gsap.fromTo(
        "[data-journey-line]",
        { scaleX: reducedMotion ? 1 : 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: reducedMotion
            ? undefined
            : {
                trigger: pin,
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
        },
      );

      if (reducedMotion) return;

      // 3. Each item: stem + dot grow, then title and text slide up line by line.
      const splits: SplitText[] = [];
      gsap.utils.toArray<HTMLElement>("[data-item]").forEach((item) => {
        const stem = item.querySelector("[data-stem]");
        const dot = item.querySelector("[data-dot]");
        const titleSplit = SplitText.create(
          item.querySelector("[data-title]"),
          {
            type: "lines",
            mask: "lines",
          },
        );
        const textSplit = SplitText.create(item.querySelector("[data-text]"), {
          type: "lines",
          mask: "lines",
        });
        splits.push(titleSplit, textSplit);

        gsap
          .timeline({
            scrollTrigger: {
              trigger: item,
              containerAnimation: slide,
              start: "left 85%",
              end: "left 50%",
              scrub: true,
            },
          })
          .fromTo(stem, { scaleY: 0 }, { scaleY: 1, duration: d * 0.4 })
          .fromTo(dot, { scale: 0 }, { scale: 1, duration: d * 0.4 }, "<")
          .fromTo(
            titleSplit.lines,
            { yPercent: 100 },
            { yPercent: 0, duration: d, stagger: 0.02, ease: "power2.out" },
            "-=0.1",
          )
          .fromTo(
            textSplit.lines,
            { yPercent: 100 },
            { yPercent: 0, duration: d, stagger: 0.02, ease: "power2.out" },
            "<",
          );
      });

      return () => splits.forEach((s) => s.revert());
    },
    { dependencies: [reducedMotion, d, items], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative w-full overflow-hidden bg-background", className)}
    >
      <div
        ref={pinRef}
        className="flex h-svh w-full items-center overflow-hidden pt-16 md:pt-24"
      >
        <div
          ref={trackRef}
          className="flex h-[30vw] w-max items-center gap-[5vw] pr-[25vw] pl-[5vw] max-sm:h-[80svh] max-sm:pr-[30vw] max-sm:pl-[7vw]"
        >
          {media ? (
            <div className="relative h-full w-[30vw] shrink-0 overflow-hidden rounded-[1vw] border max-sm:h-[65vw] max-sm:w-[85vw] max-sm:rounded-[5vw]">
              {media}
            </div>
          ) : null}

          <div className="relative flex h-full w-max flex-col">
            {/* Main line */}
            <div
              aria-hidden
              className="absolute top-1/2 left-0 flex w-full -translate-y-1/2 items-center"
            >
              <span className="size-[.8vw] shrink-0 rounded-full bg-primary max-sm:size-[2vw]" />
              <span
                data-journey-line
                className="h-px flex-1 origin-left bg-primary"
              />
              <span className="size-[.8vw] shrink-0 rounded-full bg-primary max-sm:size-[2vw]" />
            </div>

            {/* Top half: title + even items */}
            <div className="flex h-1/2">
              <div className="flex w-[22vw] shrink-0 flex-col gap-[1vw] pt-[1vw] pr-[3vw] max-sm:w-[60vw] max-sm:gap-[3vw] max-sm:pt-[3vw]">
                {eyebrow}
                <h2 className="text-[3vw] leading-[0.95] font-medium tracking-tight text-foreground max-sm:text-[8.5vw]">
                  {title}
                </h2>
              </div>
              <ol className="flex gap-x-[15vw] max-sm:gap-x-[40vw]">
                {top.map((item) => (
                  <TimelineItemView key={item.id} item={item} position="top" />
                ))}
              </ol>
            </div>

            {/* Bottom half: period label + odd items, offset between the top ones */}
            <div className="flex h-1/2">
              <div className="flex w-[22vw] shrink-0 items-end pb-[1vw] max-sm:w-[60vw] max-sm:pb-[3vw]">
                {periodLabel ? (
                  <p className="text-[1.65vw] leading-none text-muted-foreground max-sm:text-[4.2vw]">
                    {periodLabel}
                  </p>
                ) : null}
              </div>
              <ol className="flex gap-x-[15vw] pl-[22.5vw] max-sm:gap-x-[40vw] max-sm:pl-[55vw]">
                {bottom.map((item) => (
                  <TimelineItemView
                    key={item.id}
                    item={item}
                    position="bottom"
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItemView({
  item,
  position,
}: {
  item: TimelineEntry;
  position: "top" | "bottom";
}) {
  const isTop = position === "top";
  return (
    <li
      data-item
      className="relative h-full w-[30vw] shrink-0 px-[3vw] max-sm:w-[70vw] max-sm:px-[7vw]"
    >
      {/* Stem + dot, joining the item to the main line */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 flex flex-col",
          !isTop && "flex-col-reverse",
        )}
      >
        <span
          data-dot
          className="size-[1vw] shrink-0 -translate-x-1/2 rounded-full bg-primary max-sm:size-[2.5vw]"
        />
        <span
          data-stem
          className={cn(
            "w-px flex-1 bg-primary",
            isTop ? "origin-bottom" : "origin-top",
          )}
        />
      </div>

      <div
        className={cn(
          "flex h-full flex-col gap-[1vw] max-sm:gap-[3vw]",
          isTop ? "-mt-[0.4vw]" : "justify-end pb-[0.2vw]",
        )}
      >
        <span className="text-[1.1vw] font-semibold text-primary tabular-nums max-sm:text-[3.6vw]">
          {item.marker}
        </span>
        <h3
          data-title
          className="text-[2.2vw] leading-none font-medium tracking-tight text-foreground max-sm:text-[6.4vw]"
        >
          {item.title}
        </h3>
        <p
          data-text
          className="w-[90%] text-[1.3vw] leading-[1.25] text-muted-foreground max-sm:text-[4.4vw]"
        >
          {item.description}
        </p>
      </div>
    </li>
  );
}
