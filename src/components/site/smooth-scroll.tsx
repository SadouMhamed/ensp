"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const QUERY = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(QUERY);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Smooth scrolling (Lenis) for the public website, driven by GSAP's clock so the GSAP
 * scroll animations ("Notre Vision", "Nos atouts clés") stay in sync with it.
 * Rendered next to the page (no children), so turning it off never re-mounts the site.
 * Off when the visitor asked their device to reduce motion.
 * To let an element scroll natively (e.g. a scrollable panel), add `data-lenis-prevent`.
 */
export function SmoothScroll() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;
  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} />
      <GsapSync />
    </>
  );
}

function GsapSync() {
  // Tell ScrollTrigger about every smoothed scroll position.
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (!lenis) return;
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}
