import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Image area for the public site. Pass `src` for a real photo (e.g. from the media
 * library); without it, a branded placeholder is drawn so the layout reads correctly.
 */
export function Media({
  src,
  alt = "",
  label,
  tone = "dark",
  priority,
  className,
}: {
  src?: string | null;
  alt?: string;
  /** Shown on the placeholder so editors know which photo goes here. */
  label?: string;
  tone?: "dark" | "light";
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt || label || "Image provisoire"}
      className={cn(
        "relative overflow-hidden",
        tone === "dark"
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {/* warm glow from the brand color */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,color-mix(in_oklab,var(--primary)_45%,transparent),transparent_60%)]"
      />
      {/* fine technical grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-15 [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <DerrickArt className="absolute right-[6%] bottom-0 h-[85%] text-primary opacity-70" />
      {label ? (
        <span className="absolute bottom-3 left-3 bg-background/80 px-2 py-1 text-xs text-foreground">
          Photo : {label}
        </span>
      ) : null}
    </div>
  );
}

/** Simple line drawing of a drilling derrick (decorative). */
function DerrickArt({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M100 10 L40 310 M100 10 L160 310" />
      <path d="M88 70 H112 M76 130 H124 M64 190 H136 M52 250 H148 M40 310 H160" />
      <path d="M88 70 L124 130 M112 70 L76 130 M76 130 L136 190 M124 130 L64 190 M64 190 L148 250 M136 190 L52 250 M52 250 L160 310 M148 250 L40 310" />
      <path d="M92 10 H108 V22 H92 Z" />
      <path d="M100 22 V96" strokeDasharray="4 4" />
    </svg>
  );
}
