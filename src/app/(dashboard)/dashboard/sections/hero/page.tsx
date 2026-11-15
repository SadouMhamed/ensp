import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { requirePermission } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { getAllMedia } from "@/server/queries/media";
import { getHeroSectionForEdit } from "@/server/queries/sections";
import { HeroEditor } from "@/components/dashboard/sections/hero-editor";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Hero slides" };

export default function HeroSectionPage() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/sections"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "w-fit -ml-2",
          })}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          All sections
        </Link>
        <h2 className="text-2xl font-semibold">Home: hero slides</h2>
        <p className="text-sm text-muted-foreground">
          The full-screen photos at the top of the home page. Add, remove or
          reorder slides, change their photo, title and text, then save.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <HeroContent />
      </Suspense>
    </div>
  );
}

async function HeroContent() {
  const user = await requirePermission("sections"); // server-side access check
  const [section, media] = await Promise.all([
    getHeroSectionForEdit(),
    getAllMedia(),
  ]);
  return (
    <HeroEditor
      initial={section.content}
      initialVisible={section.visible}
      isCustomized={section.saved}
      media={media}
      canUpload={can(user, "media")}
    />
  );
}
