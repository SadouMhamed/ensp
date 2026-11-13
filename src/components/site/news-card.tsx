import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Media } from "./media";
import { dateLong as dateFormat } from "@/content/site";

export type NewsCardPost = {
  title: string;
  slug: string;
  publishedAt: Date | null;
  cover: { url: string; altText: string | null } | null;
};

/** Article teaser: image, title, date | type. Used on the home page and /blog. */
export function NewsCard({ post }: { post: NewsCardPost }) {
  return (
    <article className="group flex flex-col gap-4">
      <Link href={`/blog/${post.slug}`} className="flex flex-col gap-4">
        <Media
          src={post.cover?.url}
          alt={post.cover?.altText ?? ""}
          tone="light"
          className="aspect-[4/3] w-full"
        />
        <h3 className="text-xl leading-snug font-light group-hover:underline">
          {post.title}
        </h3>
      </Link>
      <p className="flex items-center gap-3 text-sm text-muted-foreground">
        {post.publishedAt ? (
          <time dateTime={post.publishedAt.toISOString()}>
            {dateFormat.format(post.publishedAt)}
          </time>
        ) : null}
        <Separator orientation="vertical" className="h-4" />
        Actualité
      </p>
    </article>
  );
}
