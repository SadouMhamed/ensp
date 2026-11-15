"use server";

import { eq, inArray } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { media, siteSections } from "@/db/schema";
import { requirePermission } from "@/lib/dal";
import {
  HERO_KEY,
  heroSchema,
  type HeroContent,
} from "@/lib/validations/sections";

export type SaveSectionResult = { ok: true } | { ok: false; error: string };

/**
 * Save the home page hero (slides + visible). Requires the "Website sections" privilege.
 * The website is refreshed right away (updateTag).
 */
export async function saveHeroSection(
  input: HeroContent,
  visible: boolean,
): Promise<SaveSectionResult> {
  await requirePermission("sections"); // ALWAYS check access inside actions
  const parsed = heroSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message };
  const content = parsed.data;

  // Library photos: take the address from the database (never trust the browser),
  // and refuse outside addresses.
  const ids = content.slides.flatMap((s) =>
    s.image?.mediaId ? [s.image.mediaId] : [],
  );
  const rows = ids.length
    ? await db
        .select({ id: media.id, url: media.url })
        .from(media)
        .where(inArray(media.id, ids))
    : [];
  for (const slide of content.slides) {
    if (!slide.image) continue;
    if (slide.image.mediaId) {
      const row = rows.find((r) => r.id === slide.image!.mediaId);
      if (!row)
        return {
          ok: false,
          error: `The photo of "${slide.title}" no longer exists in the media library.`,
        };
      slide.image.url = row.url;
    } else if (!slide.image.url.startsWith("/images/")) {
      return { ok: false, error: `Invalid photo for "${slide.title}".` };
    }
  }

  await db
    .insert(siteSections)
    .values({ key: HERO_KEY, data: content, visible })
    .onConflictDoUpdate({
      target: siteSections.key,
      set: { data: content, visible, updatedAt: new Date() },
    });

  updateTag(`section:${HERO_KEY}`);
  return { ok: true };
}

/** Go back to the original hero (texts and photos from site.ts): removes the saved version. */
export async function resetHeroSection(): Promise<SaveSectionResult> {
  await requirePermission("sections");
  await db.delete(siteSections).where(eq(siteSections.key, HERO_KEY));
  updateTag(`section:${HERO_KEY}`);
  return { ok: true };
}
