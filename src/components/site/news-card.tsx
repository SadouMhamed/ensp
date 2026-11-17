import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { dateLong as dateFormat } from "@/content/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Media } from "./media";

export type NewsCardPost = {
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt: Date | null;
  cover: { url: string; altText: string | null } | null;
};

/**
 * Article teaser as a shadcn Card: cover photo, title + date with an "Actualité" badge,
 * summary, and a "Lire l'article" button. Used on the home page and /blog.
 */
export function NewsCard({ post }: { post: NewsCardPost }) {
  const href = `/blog/${post.slug}`;

  return (
    <Card className="group h-full gap-4 overflow-hidden pt-0">
      {/* Photo: same link as the title, hidden from keyboard / screen readers to avoid a duplicate */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="block overflow-hidden"
      >
        <Media
          src={post.cover?.url}
          alt={post.cover?.altText ?? ""}
          tone="light"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="aspect-video w-full transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <CardHeader>
        <CardTitle className="text-lg leading-snug">
          <Link href={href} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        {post.publishedAt ? (
          <CardDescription>
            <time dateTime={post.publishedAt.toISOString()}>
              {dateFormat.format(post.publishedAt)}
            </time>
          </CardDescription>
        ) : null}
        <CardAction>
          <Badge variant="secondary">Actualité</Badge>
        </CardAction>
      </CardHeader>

      {post.excerpt ? (
        <CardContent className="flex-1">
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </CardContent>
      ) : (
        <div className="flex-1" />
      )}

      <CardFooter>
        <Link
          href={href}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Lire l&apos;article
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </CardFooter>
    </Card>
  );
}
