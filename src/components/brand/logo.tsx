import Image from "next/image";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "ENSP";

/**
 * ENSP brand images (public/brand):
 * - "mark": the square orange symbol, for small spots (sidebar, header, icons)
 * - "full": the complete logo with the Arabic and "ENSP" bands, where there is room
 * Source is a 175px PNG: keep the full logo at or under ~165px wide to stay sharp.
 * Replace the files with an SVG / larger PNG when available.
 */
export function Logo({
  variant = "mark",
  size = 32,
  className,
  priority,
}: {
  variant?: "mark" | "full";
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "mark" ? "/brand/ensp-mark.png" : "/brand/ensp-logo.png";
  const height = variant === "mark" ? size : Math.round((size * 165) / 163);

  return (
    <Image
      src={src}
      alt={`${BRAND_NAME} logo`}
      width={size}
      height={height}
      priority={priority}
      // Square, sharp corners: keep the logo's original shape (no rounding).
      className={cn("shrink-0 rounded-none", className)}
    />
  );
}
