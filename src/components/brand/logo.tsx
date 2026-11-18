import Image from "next/image";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "ENSP";
/** Official spelling used in ENSP institutional documents (not all caps). */
export const BRAND_FULL_NAME = "Entreprise Nationale de Services aux Puits";

/**
 * ENSP brand images (public/brand):
 * - "mark": the square orange symbol, for small spots (sidebar, header, icons)
 * - "full": the complete logo with the Arabic and "ENSP" bands, where there is room
 * Official logo sent by the client (175×178 PNG): keep it at or under ~175px wide to stay sharp.
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
  const height = variant === "mark" ? size : Math.round((size * 178) / 175);

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
