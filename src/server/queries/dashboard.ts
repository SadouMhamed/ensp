import "server-only";
import { count, sql } from "drizzle-orm";
import { db } from "@/db";
import { media, posts } from "@/db/schema";

export type DashboardStats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  publishedThisMonth: number;
  mediaFiles: number;
};

/** Dashboard overview numbers. Call only after requireUser(). */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [postRow] = await db
    .select({
      total: count(),
      published: count(sql`case when ${posts.status} = 'published' then 1 end`),
      publishedThisMonth: count(
        sql`case when ${posts.status} = 'published' and ${posts.publishedAt} >= date_trunc('month', now()) then 1 end`,
      ),
    })
    .from(posts);

  const [mediaRow] = await db.select({ total: count() }).from(media);

  return {
    totalPosts: postRow.total,
    publishedPosts: postRow.published,
    draftPosts: postRow.total - postRow.published, // status is only draft | published
    publishedThisMonth: postRow.publishedThisMonth,
    mediaFiles: mediaRow.total,
  };
}
