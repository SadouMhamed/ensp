"use client";

import type React from "react";
import { useId, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { MapIcon, MapPinIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Animated location card (adapted from a "location-map" block).
 * Small card with the place name; click (or Enter / Space) to expand it into an
 * illustrated map with a pin and the coordinates. It is an illustration, not a real map:
 * pair it with a link to Google Maps for directions.
 *
 * Changes from the original block: theme primary color instead of emerald, lucide icons,
 * keyboard accessible (role="button", aria-expanded), unique SVG pattern id,
 * width capped to the container (phones), respects "reduce motion", labels in French.
 */

interface LocationMapProps {
  location?: string;
  coordinates?: string;
  /** Small label in the top-right corner. */
  badge?: string;
  className?: string;
}

export function LocationMap({
  location = "Hassi Messaoud, Algérie",
  coordinates = "31.7043° N, 6.0557° E",
  badge = "Siège",
  className,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const patternId = useId();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-50, 50], [8, -8]);
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const toggle = () => setIsExpanded((v) => !v);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={containerRef}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${location} : ${isExpanded ? "réduire" : "agrandir"} la carte`}
        className={cn(
          "relative w-fit max-w-full cursor-pointer rounded-2xl outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
        style={{ perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <motion.div
          className="relative max-w-full overflow-hidden rounded-2xl border border-border bg-background"
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            width: isExpanded ? 360 : 240,
            height: isExpanded ? 280 : 140,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-muted/20 via-transparent to-muted/40" />

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-muted" />

                <svg
                  aria-hidden
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  {/* Main roads */}
                  {[35, 65].map((y, i) => (
                    <motion.line
                      key={`main-h-${y}`}
                      x1="0%"
                      y1={`${y}%`}
                      x2="100%"
                      y2={`${y}%`}
                      className="stroke-foreground/25"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    />
                  ))}
                  {[30, 70].map((x, i) => (
                    <motion.line
                      key={`main-v-${x}`}
                      x1={`${x}%`}
                      y1="0%"
                      x2={`${x}%`}
                      y2="100%"
                      className="stroke-foreground/20"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                    />
                  ))}
                  {/* Secondary streets */}
                  {[20, 50, 80].map((y, i) => (
                    <motion.line
                      key={`h-${y}`}
                      x1="0%"
                      y1={`${y}%`}
                      x2="100%"
                      y2={`${y}%`}
                      className="stroke-foreground/10"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                    />
                  ))}
                  {[15, 45, 55, 85].map((x, i) => (
                    <motion.line
                      key={`v-${x}`}
                      x1={`${x}%`}
                      y1="0%"
                      x2={`${x}%`}
                      y2="100%"
                      className="stroke-foreground/10"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                    />
                  ))}
                </svg>

                {/* Buildings */}
                {[
                  "top-[40%] left-[10%] h-[20%] w-[15%]",
                  "top-[15%] left-[35%] h-[15%] w-[12%]",
                  "top-[70%] left-[75%] h-[18%] w-[18%]",
                  "top-[20%] right-[10%] h-[25%] w-[10%]",
                  "top-[55%] left-[5%] h-[12%] w-[8%]",
                  "top-[8%] left-[75%] h-[10%] w-[14%]",
                ].map((pos, i) => (
                  <motion.div
                    key={pos}
                    className={cn(
                      "absolute rounded-sm border border-muted-foreground/15 bg-muted-foreground/25",
                      pos,
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                  />
                ))}

                {/* Pin */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 0.3,
                  }}
                >
                  <MapPinIcon
                    aria-hidden
                    className="size-9 fill-primary stroke-background drop-shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                  />
                </motion.div>

                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid pattern (collapsed only) */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isExpanded ? 0 : 0.05 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern
                  id={patternId}
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    className="stroke-foreground"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>
          </motion.div>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <motion.div
                animate={{ opacity: isExpanded ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <MapIcon
                  aria-hidden
                  className={cn(
                    "size-[18px] text-primary transition-[filter] duration-300",
                    isHovered
                      ? "drop-shadow-[0_0_8px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                      : "drop-shadow-[0_0_4px_color-mix(in_oklab,var(--primary)_30%,transparent)]",
                  )}
                />
              </motion.div>

              <motion.div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2 py-1 backdrop-blur-sm transition-colors",
                  isHovered ? "bg-foreground/10" : "bg-foreground/5",
                )}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  {badge}
                </span>
              </motion.div>
            </div>

            <div className="space-y-1">
              <motion.p
                className="text-sm font-medium tracking-tight text-foreground"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {location}
              </motion.p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.p
                    className="font-mono text-xs text-muted-foreground"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {coordinates}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div
                className="h-px origin-left bg-linear-to-r from-primary/60 via-primary/30 to-transparent"
                initial={{ scaleX: 0.3 }}
                animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Click hint */}
        <motion.p
          aria-hidden
          className="absolute -bottom-6 left-1/2 text-[10px] whitespace-nowrap text-muted-foreground"
          style={{ x: "-50%" }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered && !isExpanded ? 1 : 0,
            y: isHovered ? 0 : 4,
          }}
          transition={{ duration: 0.2 }}
        >
          Cliquer pour agrandir
        </motion.p>
      </motion.div>
    </MotionConfig>
  );
}
