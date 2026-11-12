import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold">Blog</h1>
      {/* TODO: list getPublishedPosts() from src/server/queries/posts.ts */}
      <p className="mt-4 text-muted-foreground">Articles will appear here.</p>
    </section>
  );
}
