import { getLatestPosts } from "@/server/queries/posts";
import { NewsCard } from "../news-card";
import { NoNews } from "../no-news";
import { ArrowLink, Container, DisplayHeading } from "../section";

/** The 3 newest published articles (cached; refreshed when an article is published). */
export async function LatestNews() {
  const posts = await getLatestPosts(3);

  return (
    <section className="py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <DisplayHeading>Dernières actualités</DisplayHeading>
          <ArrowLink href="/blog">Toutes les actualités</ArrowLink>
        </div>
        {posts.length === 0 ? (
          <NoNews />
        ) : (
          <div className="grid gap-10 md:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
