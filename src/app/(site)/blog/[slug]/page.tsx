import { Suspense } from "react";

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <PostContent params={params} />
      </Suspense>
    </article>
  );
}

async function PostContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  // TODO: const post = await getPostBySlug(slug); if (!post) notFound();
  return <h1 className="text-3xl font-bold">{slug}</h1>;
}
