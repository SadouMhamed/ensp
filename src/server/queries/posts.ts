import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";

/** Public site: cached, refreshed when the dashboard calls updateTag("posts"). */
export async function getPublishedPosts() {
  "use cache";
  cacheTag("posts");
  cacheLife("days");
  return db.query.posts.findMany({
    where: eq(posts.status, "published"),
    orderBy: desc(posts.publishedAt),
    with: { cover: true },
  });
}

export async function getPostBySlug(slug: string) {
  "use cache";
  cacheTag("posts", `post:${slug}`);
  cacheLife("days");
  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), eq(posts.status, "published")),
    with: { cover: true, author: { columns: { name: true } } },
  });
}

/** Dashboard: always fresh, includes drafts. Call only after requireUser(). */
export async function getAllPostsForDashboard() {
  return db.query.posts.findMany({
    orderBy: desc(posts.updatedAt),
    columns: { content: false },
  });
}
