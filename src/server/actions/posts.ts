"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requirePermission } from "@/lib/dal";
import { postSchema, type PostInput } from "@/lib/validations/post";

export async function createPost(input: PostInput) {
  const user = await requirePermission("posts"); // ALWAYS check access inside actions
  const data = postSchema.parse(input);

  const [post] = await db
    .insert(posts)
    .values({
      ...data,
      authorId: user.id,
      publishedAt: data.status === "published" ? new Date() : null,
    })
    .returning({ id: posts.id });

  updateTag("posts"); // public blog shows the change immediately
  redirect(`/dashboard/posts/${post.id}`);
}

export async function deletePost(id: string) {
  await requirePermission("posts");
  await db.delete(posts).where(eq(posts.id, id));
  updateTag("posts");
}
