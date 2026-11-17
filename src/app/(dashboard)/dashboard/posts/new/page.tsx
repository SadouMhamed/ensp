import type { Metadata } from "next";
import { Suspense } from "react";
import { requirePermission } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { getAllMedia } from "@/server/queries/media";
import { MediaLibraryProvider } from "@/components/dashboard/media/media-library-context";
import { PostForm } from "@/components/dashboard/posts/post-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "New article" };

export default function NewPostPage() {
  return (
    <div className="px-4 lg:px-6">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
        <Guarded />
      </Suspense>
    </div>
  );
}

async function Guarded() {
  const user = await requirePermission("posts"); // server-side access check
  const media = await getAllMedia();
  return (
    <MediaLibraryProvider initial={media} canUpload={can(user, "media")}>
      <PostForm />
    </MediaLibraryProvider>
  );
}
