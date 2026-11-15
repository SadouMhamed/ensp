import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { requirePermission } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { getAllMedia } from "@/server/queries/media";
import { MediaLibraryProvider } from "@/components/dashboard/media/media-library-context";
import { getPostForEdit } from "@/server/queries/posts";
import { PostForm } from "@/components/dashboard/posts/post-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Edit article" };

export default function EditPostPage({
  params,
}: PageProps<"/dashboard/posts/[id]">) {
  return (
    <div className="px-4 lg:px-6">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
        <EditPost params={params} />
      </Suspense>
    </div>
  );
}

async function EditPost({
  params,
}: {
  params: PageProps<"/dashboard/posts/[id]">["params"];
}) {
  const user = await requirePermission("posts"); // server-side access check
  const { id } = await params;
  const [post, media] = await Promise.all([getPostForEdit(id), getAllMedia()]);
  if (!post) notFound();

  return (
    <MediaLibraryProvider initial={media} canUpload={can(user, "media")}>
      <PostForm
        key={post.id}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: (post.content as JSONContent | null) ?? null,
          status: post.status,
          cover: post.cover,
        }}
      />
    </MediaLibraryProvider>
  );
}
