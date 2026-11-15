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

/** Where a photo is used: website sections and article covers (human-readable labels). */
export async function getMediaUsage(mediaId: string) {
  const [sectionRows, postRows] = await Promise.all([
    db
      .select({ key: siteSections.key })
      .from(siteSections)
      .where(sql`${siteSections.data}::text like ${`%${mediaId}%`}`),
    db
      .select({ title: posts.title })
      .from(posts)
      .where(eq(posts.coverMediaId, mediaId)),
  ]);
  return {
    sections: sectionRows.map((r) =>
      isSectionKey(r.key) ? SECTIONS[r.key].title : r.key,
    ),
    posts: postRows.map((p) => p.title),
  };
}
