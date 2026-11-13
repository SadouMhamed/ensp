import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { JSONContent } from "@tiptap/react";
import { articleExtensions } from "@/lib/editor/extensions";
import { dateLong as dateFormat } from "@/content/site";
import { getPostBySlug } from "@/server/queries/posts";
import { Skeleton } from "@/components/ui/skeleton";
import { Container, Eyebrow } from "@/components/site/section";

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article introuvable" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <Article params={params} />
    </Suspense>
  );
}

async function Article({
  params,
}: {
  params: PageProps<"/blog/[slug]">["params"];
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug); // cached; refreshed when the article is saved
  if (!post) notFound();

  return (
    <article>
      <header className="bg-foreground py-16 text-background md:py-24">
        <Container className="flex max-w-3xl flex-col gap-6">
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-2 text-sm text-background/70 hover:text-background"
          >
            <ArrowLeftIcon className="size-4" aria-hidden />
            Toutes les actualités
          </Link>
          <Eyebrow>Actualité</Eyebrow>
          <h1 className="text-4xl leading-tight font-extralight tracking-tight text-balance md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="text-lg text-background/75">{post.excerpt}</p>
          ) : null}
          <p className="text-sm text-background/60">
            {post.publishedAt ? (
              <time dateTime={post.publishedAt.toISOString()}>
                {dateFormat.format(post.publishedAt)}
              </time>
            ) : null}
            {post.author?.name ? ` · ${post.author.name}` : null}
          </p>
        </Container>
      </header>
      <Container className="max-w-3xl py-12 md:py-16">
        {/* Tiptap JSON → HTML on the server, with the same extensions as the editor */}
        <div className="prose prose-neutral max-w-none prose-headings:font-light prose-a:text-primary prose-img:w-full">
          {post.content
            ? renderToReactElement({
                content: post.content as JSONContent,
                extensions: articleExtensions,
              })
            : null}
        </div>
      </Container>
    </article>
  );
}

function ArticleSkeleton() {
  return (
    <Container className="flex max-w-3xl flex-col gap-4 py-16">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="mt-8 h-64 w-full" />
    </Container>
  );
}
