import "server-only";
import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { media, posts, user } from "@/db/schema";

export type DashboardStats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  publishedThisMonth: number;
  mediaFiles: number;
  users: number;
};

/** Dashboard overview numbers. Call only after requireUser(). */
export async function getDashboardStats(): Promise<DashboardStats> {
  // The three counts are independent: run them at the same time.
  const [[postRow], [mediaRow], [userRow]] = await Promise.all([
    db
      .select({
        total: count(),
        published: count(sql`case when ${posts.status} = 'published' then 1 end`),
        publishedThisMonth: count(
          sql`case when ${posts.status} = 'published' and ${posts.publishedAt} >= date_trunc('month', now()) then 1 end`,
        ),
      })
      .from(posts),
    db.select({ total: count() }).from(media),
    db.select({ total: count() }).from(user),
  ]);

  return {
    totalPosts: postRow.total,
    publishedPosts: postRow.published,
    draftPosts: postRow.total - postRow.published, // status is only draft | published
    publishedThisMonth: postRow.publishedThisMonth,
    mediaFiles: mediaRow.total,
    users: userRow.total,
  };
}

/** Overview "Drafts to finish": newest-edited drafts first. Call only after requirePermission("posts"). */
export async function getDraftsToFinish(limit = 5) {
  return db
    .select({ id: posts.id, title: posts.title, updatedAt: posts.updatedAt })
    .from(posts)
    .where(eq(posts.status, "draft"))
    .orderBy(desc(posts.updatedAt))
    .limit(limit);
}
