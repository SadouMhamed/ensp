import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FileTextIcon, PlusIcon } from "lucide-react";
import { requirePermission } from "@/lib/dal";
import { getAllPostsForDashboard } from "@/server/queries/posts";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Articles" };

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function PostsPage() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Articles</h2>
          <p className="text-sm text-muted-foreground">
            Write news and articles for the website.
          </p>
        </div>
        <Link href="/dashboard/posts/new" className={buttonVariants()}>
          <PlusIcon data-icon="inline-start" />
          New article
        </Link>
      </div>
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
        <PostsTable />
      </Suspense>
    </div>
  );
}

async function PostsTable() {
  await requirePermission("posts"); // server-side access check
  const posts = await getAllPostsForDashboard();

  if (posts.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>No articles yet</EmptyTitle>
          <EmptyDescription>
            Write your first article; publish it when it&apos;s ready.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/dashboard/posts/new" className={buttonVariants()}>
            <PlusIcon data-icon="inline-start" />
            New article
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="pl-4">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Published</TableHead>
            <TableHead className="hidden md:table-cell">Last edited</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="max-w-md pl-4">
                <Link
                  href={`/dashboard/posts/${post.id}`}
                  className="font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  /blog/{post.slug}
                </p>
              </TableCell>
              <TableCell>
                <Badge
                  variant={post.status === "published" ? "default" : "outline"}
                >
                  {post.status === "published" ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {post.publishedAt ? dateFormat.format(post.publishedAt) : "—"}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {dateFormat.format(post.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
