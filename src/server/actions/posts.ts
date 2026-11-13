"use server";

import { and, eq, ne } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requirePermission } from "@/lib/dal";
import { postSchema, type PostInput } from "@/lib/validations/post";

export type SavePostResult =
  { ok: true; id: string; slug: string } | { ok: false; error: string };

/**
 * Create (no id) or update (with id) an article. Requires the "Articles" privilege.
 * Refreshes the public blog cache so changes appear on the website right away.
 */
export async function savePost(
  input: PostInput & { id?: string },
): Promise<SavePostResult> {
  const user = await requirePermission("posts"); // ALWAYS check access inside actions
  const parsed = postSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  // The web address (slug) must be unique.
  const clash = await db.query.posts.findFirst({
    where: input.id
      ? and(eq(posts.slug, data.slug), ne(posts.id, input.id))
      : eq(posts.slug, data.slug),
    columns: { id: true },
  });
  if (clash)
    return {
      ok: false,
      error: `Another article already uses the address "/blog/${data.slug}".`,
    };

  const values = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || null,
    content: data.content ?? null,
    status: data.status,
  };

  let id = input.id;
  let previousSlug: string | undefined;

  if (id) {
    const existing = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      columns: { slug: true, publishedAt: true },
    });
    if (!existing)
      return { ok: false, error: "This article no longer exists." };
    previousSlug = existing.slug;
    await db
      .update(posts)
      .set({
        ...values,
        // first publish sets the date; going back to draft clears it
        publishedAt:
          data.status === "published"
            ? (existing.publishedAt ?? new Date())
            : null,
      })
      .where(eq(posts.id, id));
  } else {
    const [created] = await db
      .insert(posts)
      .values({
        ...values,
        authorId: user.id,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning({ id: posts.id });
    id = created.id;
  }

  updateTag("posts"); // home page "Latest news" + /blog list
  updateTag(`post:${data.slug}`);
  if (previousSlug && previousSlug !== data.slug)
    updateTag(`post:${previousSlug}`);

  return { ok: true, id, slug: data.slug };
}

export async function deletePost(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requirePermission("posts");
  const [deleted] = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning({ slug: posts.slug });
  if (!deleted) return { ok: false, error: "This article no longer exists." };
  updateTag("posts");
  updateTag(`post:${deleted.slug}`);
  return { ok: true };
}
