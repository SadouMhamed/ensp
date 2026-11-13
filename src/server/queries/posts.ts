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

/** Home page "Latest news": only what the cards show (no article body). */
export async function getLatestPosts(limit = 3) {
  "use cache";
  cacheTag("posts");
  cacheLife("days");
  return db.query.posts.findMany({
    where: eq(posts.status, "published"),
    orderBy: desc(posts.publishedAt),
    limit,
    columns: { id: true, title: true, slug: true, excerpt: true, publishedAt: true },
    with: { cover: { columns: { url: true, altText: true } } },
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

/** Dashboard edit page: one article with its content. Call only after requirePermission("posts"). */
export async function getPostForEdit(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined; // not a UUID → not found
  return db.query.posts.findFirst({
    where: eq(posts.id, id),
    columns: { id: true, title: true, slug: true, excerpt: true, content: true, status: true, publishedAt: true },
  });
}

/** Dashboard: always fresh, includes drafts. Call only after requireUser(). */
export async function getAllPostsForDashboard() {
  return db.query.posts.findMany({
    orderBy: desc(posts.updatedAt),
    columns: { content: false },
  });
}
