import { z } from "zod";
import { home, site, departmentContacts, locations } from "@/content/site";

/**
 * Editable website sections: shape of the content saved in `site_sections.data`.
 * Shared by the dashboard editors (client) and the Server Actions / website (server).
 * Every section has a default (the original content from src/content/site.ts), shown until
 * it is edited, restored by "Restore original", and used as a safety net if saved content
 * is ever invalid.
 */

// ── Building blocks ──────────────────────────────────────────────

/** A photo: a file of /public (/images/…) or one from the media library (mediaId). */
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

const id = z.string().min(1).max(64);
const text = (label: string, max: number, min = 0) => {
  const base = z
    .string()
    .trim()
    .max(max, `${label} is too long (${max} characters max)`);
  return min > 0 ? base.min(min, `${label} can't be empty`) : base;
};
const img = (url: string, alt: string): SectionImage => ({ url, alt });

// ── Home: hero slides ────────────────────────────────────────────
export const HERO_MAX_SLIDES = 8;
export const heroSlideSchema = z.object({
  id,
  title: text("Slide title", 120, 1),
  text: text("Slide text", 600),
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
    image: s.image ? img(s.image, s.alt) : null,
  })),
};

// ── Home: Présentation ───────────────────────────────────────────
export const presentationSchema = z.object({
  eyebrow: text("Small label", 80, 1),
  title: text("Title", 200, 1),
  paragraphs: z
    .array(text("Paragraph", 1500, 1))
    .min(1, "Keep at least one paragraph")
    .max(8, "8 paragraphs maximum"),
  image: sectionImageSchema.nullable(),
  missionTitle: text("Mission title", 80, 1),
  missionSubtitle: text("Mission subtitle", 160),
  missionText: text("Mission text", 2000, 1),
});
export type PresentationContent = z.infer<typeof presentationSchema>;
export const presentationDefault: PresentationContent = {
  eyebrow: home.presentation.eyebrow,
  title: home.presentation.title,
  paragraphs: [...home.presentation.paragraphs],
  image: img(
    "/images/site/presentation-equipe.jpg",
    "Équipe de l'ENSP sur un site d'intervention",
  ),
  missionTitle: home.presentation.mission.title,
  missionSubtitle: "Ce qui guide chacune de nos interventions.",
  missionText: home.presentation.mission.text,
};

// ── Home: Notre Vision ───────────────────────────────────────────
export const visionStepSchema = z.object({
  id,
  heading: text("Step title", 120, 1),
  text: text("Step text", 1500),
  list: z.array(text("List item", 400, 1)).max(10, "10 list items maximum"),
  image: sectionImageSchema.nullable(),
});
export type VisionStep = z.infer<typeof visionStepSchema>;
export const visionSchema = z.object({
  eyebrow: text("Small label", 80, 1),
  steps: z
    .array(visionStepSchema)
    .min(1, "Keep at least one step")
    .max(8, "8 steps maximum"),
});
export type VisionContent = z.infer<typeof visionSchema>;
const v = home.vision;
const c = v.commitments;
export const visionDefault: VisionContent = {
  eyebrow: v.eyebrow,
  steps: [
    {
      id: "default-1",
      heading: "Notre ambition",
      text: v.statement,
      list: [],
      image: img(
        "/images/site/vision-1-equipe.jpg",
        "Équipe de l'ENSP sur un chantier de forage",
      ),
    },
    {
      id: "default-2",
      heading: "Une vision stratégique",
      text: v.text,
      list: [],
      image: img(
        "/images/site/vision-2-atelier.jpg",
        "Opérateur de l'ENSP au poste de commande d'un atelier",
      ),
    },
    {
      id: "default-3",
      heading: "Qualité, sécurité & partenaires",
      text: v.commitmentsLead,
      list: [c[0], c[1], c[2]],
      image: img(
        "/images/site/vision-3-securite.jpg",
        "Opérateur de l'ENSP équipé de ses protections individuelles",
      ),
    },
    {
      id: "default-4",
      heading: "Moyens & capital humain",
      text: v.commitmentsLead,
      list: [c[3], c[4], c[9]],
      image: img(
        "/images/site/vision-4-equipe-nuit.jpg",
        "Équipe de l'ENSP sur site de nuit",
      ),
    },
    {
      id: "default-5",
      heading: "Innovation & durabilité",
      text: v.commitmentsLead,
      list: [c[5], c[6], c[7], c[8]],
      image: img(
        "/images/site/vision-5-innovation.jpg",
        "Opérateurs de l'ENSP en salle de contrôle",
      ),
    },
  ],
};

// ── Home: Nos atouts clés ────────────────────────────────────────
export const strengthItemSchema = z.object({
  id,
  title: text("Strength title", 120, 1),
  text: text("Strength text", 400),
});
export type StrengthItem = z.infer<typeof strengthItemSchema>;
export const strengthsSchema = z.object({
  eyebrow: text("Small label", 80, 1),
  title: text("Title", 120, 1),
  periodLabel: text("Label under the title", 60),
  image: sectionImageSchema.nullable(),
  items: z
    .array(strengthItemSchema)
    .min(1, "Keep at least one strength")
    .max(10, "10 strengths maximum"),
});
export type StrengthsContent = z.infer<typeof strengthsSchema>;
export const strengthsDefault: StrengthsContent = {
  eyebrow: home.strengths.eyebrow,
  title: home.strengths.title,
  periodLabel: "Depuis 1981",
  image: img(
    "/images/site/atouts-operateur.jpg",
    "Opérateur de l'ENSP sur une installation",
  ),
  items: home.strengths.items.map((s, i) => ({
    id: `default-${i + 1}`,
    title: s.title,
    text: s.text,
  })),
};

// ── Home: Mot du PDG ─────────────────────────────────────────────
export const ceoSchema = z.object({
  eyebrow: text("Small label", 80, 1),
  title: text("Title", 160, 1),
  photo: sectionImageSchema.nullable(),
  salutation: text("Greeting", 200),
  message: z
    .array(text("Paragraph", 2500, 1))
    .min(1, "Keep at least one paragraph")
    .max(25, "25 paragraphs maximum"),
  name: text("Name", 120, 1),
  role: text("Role", 120, 1),
});
export type CeoContent = z.infer<typeof ceoSchema>;
export const ceoDefault: CeoContent = {
  eyebrow: "Mot du PDG",
  title: home.ceo.eyebrow,
  photo: img(home.ceo.photo, `${home.ceo.name}, ${home.ceo.role} de l'ENSP`),
  salutation: home.ceo.salutation,
  message: [...home.ceo.message],
  name: home.ceo.name,
  role: home.ceo.role,
};

// ── Contact (page + footer) ──────────────────────────────────────
export const LOCATION_KINDS = [
  "antenne",
  "operations",
  "region",
  "district",
] as const;
export const LOCATION_KIND_LABELS: Record<
  (typeof LOCATION_KINDS)[number],
  string
> = {
  antenne: "Antenne",
  operations: "Direction opérationnelle",
  region: "Direction régionale",
  district: "District",
};
const email = z.email("Invalid e-mail address").max(200);
export const contactSchema = z.object({
  address: text("Address", 300, 1),
  phone: text("Phone", 80, 1),
  fax: text("Fax", 80),
  email,
  hours: text("Opening hours", 120),
  mapUrl: z.url("Invalid map link").max(500).or(z.literal("")),
  departments: z
    .array(z.object({ id, title: text("Department name", 120, 1), email }))
    .max(12, "12 departments maximum"),
  locations: z
    .array(
      z.object({
        id,
        title: text("Location name", 160, 1),
        kind: z.enum(LOCATION_KINDS),
        address: text("Location address", 300, 1),
        phone: text("Location phone", 120),
        fax: text("Location fax", 120),
      }),
    )
    .max(30, "30 locations maximum"),
});
export type ContactContent = z.infer<typeof contactSchema>;
export const contactDefault: ContactContent = {
  address: site.contact.address,
  phone: site.contact.phone,
  fax: site.contact.fax,
  email: site.contact.email,
  hours: site.contact.hours,
  mapUrl: site.contact.mapUrl,
  departments: departmentContacts.map((d, i) => ({
    id: `default-${i + 1}`,
    title: d.title,
    email: d.email,
  })),
  locations: locations
    .filter((l) => l.kind !== "siege")
    .map((l, i) => ({
      id: `default-${i + 1}`,
      title: l.title,
      kind: l.kind as (typeof LOCATION_KINDS)[number],
      address: l.address,
      phone: l.phone ?? "",
      fax: l.fax ?? "",
    })),
};

// ── Registry ─────────────────────────────────────────────────────

/** Every editable section: database key, dashboard address, rules and original content. */
export const SECTIONS = {
  home_hero: {
    slug: "hero",
    title: "Home: hero slides",
    description:
      "Full-screen photos at the top of the home page, with their title and text.",
    hideable: true,
    schema: heroSchema,
    defaults: heroDefault,
  },
  home_presentation: {
    slug: "presentation",
    title: "Home: Présentation",
    description: "Company presentation, photo and mission.",
    hideable: true,
    schema: presentationSchema,
    defaults: presentationDefault,
  },
  home_vision: {
    slug: "vision",
    title: "Home: Notre Vision",
    description: "The vision steps (title, text, list, photo).",
    hideable: true,
    schema: visionSchema,
    defaults: visionDefault,
  },
  home_strengths: {
    slug: "strengths",
    title: "Home: Nos atouts clés",
    description: "The strengths timeline, its title and photo.",
    hideable: true,
    schema: strengthsSchema,
    defaults: strengthsDefault,
  },
  home_ceo: {
    slug: "ceo",
    title: "Home: Mot du PDG",
    description: "CEO message, photo, name and role.",
    hideable: true,
    schema: ceoSchema,
    defaults: ceoDefault,
  },
  contact: {
    slug: "contact",
    title: "Contact",
    description:
      "Phones, e-mails, opening hours, addresses and locations (contact page and footer).",
    hideable: false,
    schema: contactSchema,
    defaults: contactDefault,
  },
} as const;

export type SectionKey = keyof typeof SECTIONS;
export type SectionContentMap = {
  home_hero: HeroContent;
  home_presentation: PresentationContent;
  home_vision: VisionContent;
  home_strengths: StrengthsContent;
  home_ceo: CeoContent;
  contact: ContactContent;
};
export type SectionContent<K extends SectionKey> = SectionContentMap[K];

export const SECTION_KEYS = Object.keys(SECTIONS) as SectionKey[];

export function isSectionKey(value: string): value is SectionKey {
  return value in SECTIONS;
}

export function sectionKeyFromSlug(slug: string): SectionKey | null {
  return SECTION_KEYS.find((k) => SECTIONS[k].slug === slug) ?? null;
}

/** Find every photo object inside a section's content (to check / resolve library photos). */
export function collectImages(
  value: unknown,
  out: SectionImage[] = [],
): SectionImage[] {
  if (Array.isArray(value)) {
    for (const item of value) collectImages(item, out);
  } else if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.url === "string" && typeof obj.alt === "string") {
      out.push(obj as SectionImage);
    } else {
      for (const item of Object.values(obj)) collectImages(item, out);
    }
  }
  return out;
}
