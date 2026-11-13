import type { Metadata } from "next";
import { getLatestPosts } from "@/server/queries/posts";
import { NewsCard } from "@/components/site/news-card";
import { NoNews } from "@/components/site/no-news";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/section";

export const metadata: Metadata = { title: "Actualités" };

export default async function BlogPage() {
  const posts = await getLatestPosts(24);

  return (
    <>
      <PageHero
        eyebrow="Actualités"
        title="Les dernières nouvelles de l'ENSP"
      />
      <Container className="py-16 md:py-24">
        {posts.length === 0 ? (
          <NoNews />
        ) : (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
