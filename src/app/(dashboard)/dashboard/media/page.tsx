import type { Metadata } from "next";
import { Suspense } from "react";
import { requirePermission } from "@/lib/dal";
import { getAllMedia } from "@/server/queries/media";
import { MediaGrid } from "@/components/dashboard/media/media-grid";
import { UploadDropzone } from "@/components/dashboard/media/upload-dropzone";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Media library" };

export default function MediaPage() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-semibold">Media library</h2>
        <p className="text-sm text-muted-foreground">
          Upload the photos of the website, describe them, and delete the ones
          you no longer need.
        </p>
      </div>
      {/* Access check + database read stream in behind Suspense. */}
      <Suspense fallback={<MediaSkeleton />}>
        <MediaContent />
      </Suspense>
    </div>
  );
}

async function MediaContent() {
  await requirePermission("media"); // server-side access check
  const items = await getAllMedia();
  return (
    <>
      <UploadDropzone />
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium">All photos</h3>
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "photo" : "photos"}
        </p>
      </div>
      <MediaGrid items={items} />
    </>
  );
}

function MediaSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
