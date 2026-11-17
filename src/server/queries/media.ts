import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { media, posts, siteSections } from "@/db/schema";
import { SECTIONS, isSectionKey } from "@/lib/validations/sections";

/** Dashboard media library: newest first. */
export async function getAllMedia() {
  return db.query.media.findMany({ orderBy: desc(media.createdAt) });
}

export type MediaItem = Awaited<ReturnType<typeof getAllMedia>>[number];

/**
 * Where a photo is used, as readable labels:
 * - sections: website sections (deleting is refused)
 * - articleTexts: inside the text of an article (deleting is refused)
 * - covers: article covers (removed automatically when the photo is deleted)
 */
export async function getMediaUsage(mediaId: string) {
  const item = await db.query.media.findFirst({
    where: eq(media.id, mediaId),
    columns: { url: true },
  });
  const [sectionRows, coverRows, textRows] = await Promise.all([
    db
      .select({ key: siteSections.key })
      .from(siteSections)
      .where(sql`${siteSections.data}::text like ${`%${mediaId}%`}`),
    db
      .select({ title: posts.title })
      .from(posts)
      .where(eq(posts.coverMediaId, mediaId)),
    item
      ? db
          .select({ title: posts.title })
          .from(posts)
          .where(sql`${posts.content}::text like ${`%${item.url}%`}`)
      : Promise.resolve([]),
  ]);
  return {
    sections: sectionRows.map((r) =>
      isSectionKey(r.key) ? SECTIONS[r.key].title : r.key,
    ),
    articleTexts: textRows.map((p) => `article "${p.title}"`),
    covers: coverRows.map((p) => p.title),
  };
}
