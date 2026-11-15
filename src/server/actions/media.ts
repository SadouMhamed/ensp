"use server";

import { eq } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { media } from "@/db/schema";
import { requirePermission } from "@/lib/dal";
import { deleteObject } from "@/lib/storage";
import { getMediaUsage } from "@/server/queries/media";

type Result = { ok: true } | { ok: false; error: string };

/** Change the description (alt text) of a photo. Requires the "Media library" privilege. */
export async function updateMediaAlt(
  id: string,
  altText: string,
): Promise<Result> {
  await requirePermission("media");
  const parsed = z
    .object({ id: z.uuid(), altText: z.string().trim().max(300) })
    .safeParse({ id, altText });
  if (!parsed.success) return { ok: false, error: "Invalid description." };

  await db
    .update(media)
    .set({ altText: parsed.data.altText || null })
    .where(eq(media.id, parsed.data.id));
  refresh();
  return { ok: true };
}

/**
 * Delete a photo (database row + file in the bucket).
 * Refused while a website section or an article's text uses it, so the site never shows a
 * broken image: remove it there first. Article covers are simply removed.
 */
export async function deleteMedia(id: string): Promise<Result> {
  await requirePermission("media");
  if (!z.uuid().safeParse(id).success)
    return { ok: false, error: "Invalid photo." };

  const usage = await getMediaUsage(id);
  const blocking = [...usage.sections, ...usage.articleTexts];
  if (blocking.length > 0) {
    return {
      ok: false,
      error: `This photo is used in: ${blocking.join(", ")}. Remove it there first, then delete it.`,
    };
  }

  const [row] = await db.delete(media).where(eq(media.id, id)).returning();
  if (!row) return { ok: false, error: "This photo no longer exists." };

  try {
    await deleteObject(row.storageKey);
  } catch (error) {
    // The row is gone; a leftover file in the bucket is harmless.
    console.error("Could not delete file from object storage", error);
  }

  if (usage.covers.length > 0) updateTag("posts");
  refresh();
  return { ok: true };
}
