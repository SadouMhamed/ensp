"use server";

import { eq, inArray } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { media, siteSections } from "@/db/schema";
import { requirePermission } from "@/lib/dal";
import {
  SECTIONS,
  collectImages,
  isSectionKey,
  type SectionContent,
  type SectionKey,
} from "@/lib/validations/sections";

export type SaveSectionResult = { ok: true } | { ok: false; error: string };

/**
 * Save a website section (content + visible). Requires the "Website sections" privilege.
 * The content is checked with the section's rules, library photos get their address from
 * the database, and the website is refreshed right away (updateTag).
 */
export async function saveSection<K extends SectionKey>(
  key: K,
  input: SectionContent<K>,
  visible: boolean,
): Promise<SaveSectionResult> {
  await requirePermission("sections"); // ALWAYS check access inside actions
  if (!isSectionKey(key)) return { ok: false, error: "Unknown section." };
  const def = SECTIONS[key];

  const parsed = def.schema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message };
  const content = parsed.data;

  // Photos: library photos take their address from the database (never trust the browser);
  // other photos must be files of the website (/images/…).
  const images = collectImages(content);
  const ids = [
    ...new Set(images.flatMap((i) => (i.mediaId ? [i.mediaId] : []))),
  ];
  const rows = ids.length
    ? await db
        .select({ id: media.id, url: media.url })
        .from(media)
        .where(inArray(media.id, ids))
    : [];
  for (const image of images) {
    if (image.mediaId) {
      const row = rows.find((r) => r.id === image.mediaId);
      if (!row)
        return {
          ok: false,
          error:
            "A photo of this section no longer exists in the media library.",
        };
      image.url = row.url;
    } else if (!image.url.startsWith("/images/")) {
      return { ok: false, error: "Invalid photo address." };
    }
  }

  const isVisible = def.hideable ? visible : true;
  await db
    .insert(siteSections)
    .values({ key, data: content, visible: isVisible })
    .onConflictDoUpdate({
      target: siteSections.key,
      set: { data: content, visible: isVisible, updatedAt: new Date() },
    });

  updateTag(`section:${key}`);
  return { ok: true };
}

/** Go back to the original content of a section (site.ts): removes the saved version. */
export async function resetSection(
  key: SectionKey,
): Promise<SaveSectionResult> {
  await requirePermission("sections");
  if (!isSectionKey(key)) return { ok: false, error: "Unknown section." };
  await db.delete(siteSections).where(eq(siteSections.key, key));
  updateTag(`section:${key}`);
  return { ok: true };
}
