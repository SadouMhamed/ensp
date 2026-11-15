import { z } from "zod";
import { home } from "@/content/site";

/**
 * Editable website sections: shape of the content saved in `site_sections.data`.
 * Shared by the dashboard forms (client) and the Server Actions / website (server).
 * Each section has a default taken from src/content/site.ts, used until it is edited
 * (and as a safety net if the saved content is ever invalid).
 */

/** A photo used in a section: a file of /public (/images/…) or one from the media library. */
export const sectionImageSchema = z.object({
  url: z
    .string()
    .max(1000)
    .refine((u) => u.startsWith("/images/") || u.startsWith("https://"), {
      message: "Invalid image address",
    }),
  alt: z.string().trim().max(300),
  /** Set when the photo comes from the media library (used to warn before deleting it). */
  mediaId: z.uuid().optional(),
});
export type SectionImage = z.infer<typeof sectionImageSchema>;

// ── Home: hero slides ────────────────────────────────────────────
export const HERO_KEY = "home_hero";
export const HERO_MAX_SLIDES = 8;

export const heroSlideSchema = z.object({
  id: z.string().min(1).max(64),
  title: z
    .string()
    .trim()
    .min(1, "Each slide needs a title")
    .max(120, "Title is too long (120 characters max)"),
  text: z.string().trim().max(600, "Text is too long (600 characters max)"),
  image: sectionImageSchema.nullable(),
});
export type HeroSlide = z.infer<typeof heroSlideSchema>;

export const heroSchema = z.object({
  slides: z
    .array(heroSlideSchema)
    .min(1, "Keep at least one slide")
    .max(HERO_MAX_SLIDES, `${HERO_MAX_SLIDES} slides maximum`),
});
export type HeroContent = z.infer<typeof heroSchema>;

export const heroDefault: HeroContent = {
  slides: home.hero.slides.map((s, i) => ({
    id: `default-${i + 1}`,
    title: s.title,
    text: s.text,
    image: s.image ? { url: s.image, alt: s.alt } : null,
  })),
};

/** Sections listed in the dashboard. `ready: false` = editor coming later. */
export const EDITABLE_SECTIONS = [
  {
    key: HERO_KEY,
    href: "/dashboard/sections/hero",
    title: "Home: hero slides",
    description:
      "Full-screen photos at the top of the home page, with their title and text.",
    ready: true,
  },
  {
    key: "home_presentation",
    title: "Home: Présentation",
    description: "Company presentation, mission and key figures.",
    ready: false,
  },
  {
    key: "home_vision",
    title: "Home: Notre Vision",
    description: "The 5 vision steps with their photos.",
    ready: false,
  },
  {
    key: "home_strengths",
    title: "Home: Nos atouts clés",
    description: "The strengths timeline and its photo.",
    ready: false,
  },
  {
    key: "home_ceo",
    title: "Home: Mot du PDG",
    description: "CEO message and photo.",
    ready: false,
  },
  {
    key: "contact",
    title: "Contact",
    description: "Phones, e-mails, addresses and locations.",
    ready: false,
  },
] as const;
