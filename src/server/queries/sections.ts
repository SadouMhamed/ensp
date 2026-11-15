import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSections } from "@/db/schema";
import {
  HERO_KEY,
  heroDefault,
  heroSchema,
  type HeroContent,
} from "@/lib/validations/sections";

export type SectionState<T> = {
  visible: boolean;
  content: T;
  /** false = never edited, the default content from site.ts is shown */
  saved: boolean;
  updatedAt: Date | null;
};

async function readHero(): Promise<SectionState<HeroContent>> {
  const row = await db.query.siteSections.findFirst({
    where: eq(siteSections.key, HERO_KEY),
  });
  if (!row) {
    return {
      visible: true,
      content: heroDefault,
      saved: false,
      updatedAt: null,
    };
  }
  const parsed = heroSchema.safeParse(row.data);
  return {
    visible: row.visible,
    // Invalid or empty saved content → fall back to the default so the site never breaks.
    content: parsed.success ? parsed.data : heroDefault,
    saved: parsed.success,
    updatedAt: row.updatedAt,
  };
}

/** Website: cached, refreshed when the dashboard saves (updateTag("section:home_hero")). */
export async function getHeroSection() {
  "use cache";
  cacheTag(`section:${HERO_KEY}`);
  cacheLife("days");
  return readHero();
}

/** Dashboard editor: always fresh. */
export async function getHeroSectionForEdit() {
  return readHero();
}
