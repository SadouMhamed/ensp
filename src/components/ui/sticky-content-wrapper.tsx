"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronsDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sticky scroll story (adapted from a "sticky content wrapper" block).
 * The section sticks under the header; while you scroll, the text on the left changes step
 * by step and the visual on the right wipes away to reveal the next one.
 *
 * Changes from the original block:
 * - Content comes from props (no demo real-estate texts / base64 photos); each step has its
 *   own `media` slot (a photo or the site's placeholder).
 * - The first step is visible in the server HTML (the original started everything at
 *   opacity 0, so nothing showed until JavaScript ran).
 * - The "scroll" hint is inside the section (it was `position: fixed`, so it stayed on
 *   screen over the whole page) and uses a lucide icon.
 * - Leaves room for the sticky site header; theme colors instead of inline colors;
 *   `w-full` instead of `w-screen` (no sideways scrollbar).
 * - Reduced motion: steps cross-fade, with no wipe or zoom.
 */

export type StickyContentItem = {
  /** Small label above the heading, e.g. "01 / 05". */
  eyebrow?: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  link?: { href: string; text: string };
  /** Visual on the right (photo, placeholder…). */
  media: ReactNode;
};

type StickyContentWrapperProps = {
  items: StickyContentItem[];
  /** Shown above the step content, on every step (e.g. the section badge). */
  header?: ReactNode;
  id?: string;
  className?: string;
  /** Scroll length per step, in viewport heights. */
  stepHeight?: number;
  contentEnterYPercent?: number;
  contentExitYPercent?: number;
  contentTransitionDuration?: number;
  contentDelay?: number;
  initialImageScale?: number;
  activeImageScale?: number;
  exitImageScale?: number;
};

const STEP_GAP = 2;

export default function StickyContentWrapper({
  items,
  header,
  id,
  className,
  stepHeight = 100,
  contentEnterYPercent = 4,
  contentExitYPercent = -4,
  contentTransitionDuration = 0.9,
  contentDelay = 0.35,
  initialImageScale = 1.5,
  activeImageScale = 1.2,
  exitImageScale = 1,
}: StickyContentWrapperProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || items.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const contents = contentRefs.current;
      const images = imageRefs.current;

      contents.forEach((content, i) => {
        gsap.set(content, {
          autoAlpha: i === 0 ? 1 : 0,
          yPercent: i === 0 ? 0 : contentEnterYPercent,
          zIndex: items.length - i,
        });
      });

      images.forEach((image, i) => {
        gsap.set(image, {
          autoAlpha: reducedMotion ? (i === 0 ? 1 : 0) : 1,
          zIndex: items.length - i,
          clipPath: "inset(0% 0% 0% 0%)",
          scale: reducedMotion
            ? 1
            : i === 0
              ? activeImageScale
              : initialImageScale,
          transformOrigin: "center center",
        });
      });

      if (items.length < 2) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          snap: {
            snapTo: items.map((_, i) => i / (items.length - 1)),
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
            delay: 0,
            inertia: false,
          },
        },
      });

      items.forEach((_, i) => {
        if (i === items.length - 1) return;
        const stepStart = i * STEP_GAP;

        timeline
          .to(
            contents[i],
            {
              autoAlpha: 0,
              yPercent: contentExitYPercent,
              duration: contentTransitionDuration,
              ease: "power2.inOut",
            },
            stepStart,
          )
          .fromTo(
            contents[i + 1],
            { autoAlpha: 0, yPercent: contentEnterYPercent },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: contentTransitionDuration,
              ease: "power2.inOut",
            },
            stepStart + contentTransitionDuration + contentDelay,
          )
          .to(
            images[i],
            reducedMotion
              ? { autoAlpha: 0, duration: STEP_GAP, ease: "none" }
              : {
                  clipPath: "inset(0% 0% 100% 0%)",
                  scale: exitImageScale,
                  duration: STEP_GAP,
                  ease: "none",
                },
            stepStart,
          )
          .to(
            images[i + 1],
            reducedMotion
              ? { autoAlpha: 1, duration: STEP_GAP, ease: "none" }
              : { scale: activeImageScale, duration: STEP_GAP, ease: "none" },
            stepStart,
          );
      });

      timeline.duration(Math.max(1, (items.length - 1) * STEP_GAP));
      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [
    items,
    contentEnterYPercent,
    contentExitYPercent,
    contentTransitionDuration,
    contentDelay,
    initialImageScale,
    activeImageScale,
    exitImageScale,
  ]);

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative w-full bg-background", className)}
      style={{ height: `${items.length * stepHeight}svh` }}
    >
      {/* pt leaves room for the sticky site header */}
      <div className="sticky top-0 flex h-svh w-full flex-col-reverse justify-end gap-6 px-[6vw] pt-20 pb-6 md:pt-28 lg:flex-row lg:justify-between lg:gap-0 lg:p-0 lg:pt-[92px]">
        {/* Text */}
        <div className="relative flex-1 lg:w-[42%] lg:flex-none">
          {items.map((item, i) => (
            <div
              key={item.heading}
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              className={cn(
                "absolute inset-0 flex flex-col justify-start gap-4 overflow-hidden lg:justify-center lg:gap-6 lg:pr-[4vw] lg:pl-[5vw]",
                i > 0 && "invisible opacity-0",
              )}
            >
              {header}
              {item.eyebrow ? (
                <span className="text-sm font-semibold text-primary tabular-nums">
                  {item.eyebrow}
                </span>
              ) : null}
              <h3 className="text-[7vw] leading-[1.05] font-medium tracking-tight text-foreground sm:text-[5vw] lg:text-[3.2vw]">
                {item.heading}
              </h3>
              {item.paragraphs?.map((p) => (
                <p
                  key={p}
                  className="text-[4vw] leading-relaxed text-muted-foreground sm:text-[2.4vw] lg:text-[1.15vw]"
                >
                  {p}
                </p>
              ))}
              {item.list && item.list.length > 0 ? (
                <ul className="flex flex-col gap-2 lg:gap-[0.6vw]">
                  {item.list.map((li) => (
                    <li
                      key={li}
                      className="flex gap-3 text-[3.6vw] leading-snug text-muted-foreground sm:text-[2.2vw] lg:text-[1.05vw]"
                    >
                      <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-primary" />
                      {li}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.link ? (
                <a
                  href={item.link.href}
                  className="group inline-flex w-fit items-center gap-2 font-medium text-foreground"
                >
                  <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 group-hover:after:origin-left group-hover:after:scale-x-100">
                    {item.link.text}
                  </span>
                </a>
              ) : null}
            </div>
          ))}
        </div>

        {/* Visuals */}
        <div className="relative h-[34%] w-full shrink-0 overflow-hidden rounded-2xl lg:h-full lg:w-1/2 lg:rounded-none">
          {items.map((item, i) => (
            <div
              key={item.heading}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className="absolute inset-0 size-full"
              style={{ zIndex: items.length - i }}
            >
              {item.media}
            </div>
          ))}
        </div>

        {items.length > 1 ? (
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-8 left-[21%] hidden -translate-x-1/2 flex-col items-center gap-1 text-sm text-muted-foreground lg:flex"
          >
            Défiler
            <ChevronsDownIcon className="size-5 animate-bounce" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
