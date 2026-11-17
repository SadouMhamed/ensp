import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { requirePermission } from "@/lib/dal";
import { can } from "@/lib/permissions";
import {
  SECTIONS,
  sectionKeyFromSlug,
  type SectionKey,
} from "@/lib/validations/sections";
import { getAllMedia } from "@/server/queries/media";
import { getSectionForEdit } from "@/server/queries/sections";
import { MediaLibraryProvider } from "@/components/dashboard/sections/editor-kit";
import { HeroEditor } from "@/components/dashboard/sections/hero-editor";
import { PresentationEditor } from "@/components/dashboard/sections/presentation-editor";
import { VisionEditor } from "@/components/dashboard/sections/vision-editor";
import { StrengthsEditor } from "@/components/dashboard/sections/strengths-editor";
import { CeoEditor } from "@/components/dashboard/sections/ceo-editor";
import { ContactEditor } from "@/components/dashboard/sections/contact-editor";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/sections/[slug]">): Promise<Metadata> {
  const key = sectionKeyFromSlug((await params).slug);
  return { title: key ? SECTIONS[key].title : "Website section" };
}

export default function SectionEditorPage({
  params,
}: PageProps<"/dashboard/sections/[slug]">) {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <Link
        href="/dashboard/sections"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "-ml-2 w-fit",
        })}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        All sections
      </Link>
      {/* Access check + database reads stream in behind Suspense. */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <SectionEditorContent params={params} />
      </Suspense>
    </div>
  );
}

async function SectionEditorContent({
  params,
}: {
  params: PageProps<"/dashboard/sections/[slug]">["params"];
}) {
  const user = await requirePermission("sections"); // server-side access check
  const key = sectionKeyFromSlug((await params).slug);
  if (!key) notFound();

  const def = SECTIONS[key];
  const [section, media] = await Promise.all([
    getSectionForEdit(key),
    getAllMedia(),
  ]);
  const props = {
    initial: section.content,
    initialVisible: section.visible,
    isCustomized: section.saved,
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">{def.title}</h2>
        <p className="text-sm text-muted-foreground">
          {def.description} Changes appear on the website as soon as you save.
        </p>
      </div>
      <MediaLibraryProvider initial={media} canUpload={can(user, "media")}>
        {renderEditor(key, props)}
      </MediaLibraryProvider>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each branch gets its own typed content
function renderEditor(key: SectionKey, props: any) {
  switch (key) {
    case "home_hero":
      return <HeroEditor {...props} />;
    case "home_presentation":
      return <PresentationEditor {...props} />;
    case "home_vision":
      return <VisionEditor {...props} />;
    case "home_strengths":
      return <StrengthsEditor {...props} />;
    case "home_ceo":
      return <CeoEditor {...props} />;
    case "contact":
      return <ContactEditor {...props} />;
  }
}
