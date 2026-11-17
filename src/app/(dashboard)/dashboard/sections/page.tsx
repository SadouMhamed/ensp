import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRightIcon } from "lucide-react";
import { requirePermission } from "@/lib/dal";
import { SECTIONS, SECTION_KEYS } from "@/lib/validations/sections";
import { getSectionStatuses } from "@/server/queries/sections";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Website sections" };

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function SectionsPage() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-semibold">Website sections</h2>
        <p className="text-sm text-muted-foreground">
          Change the photos, titles and texts of the website. Changes appear on
          the site as soon as you save.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <SectionList />
      </Suspense>
    </div>
  );
}

async function SectionList() {
  await requirePermission("sections"); // server-side access check
  const statuses = await getSectionStatuses();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SECTION_KEYS.map((key) => {
        const def = SECTIONS[key];
        const status = statuses.get(key);
        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{def.title}</CardTitle>
              <CardDescription>{def.description}</CardDescription>
              <CardAction>
                <Link
                  href={`/dashboard/sections/${def.slug}`}
                  className={buttonVariants({ size: "sm" })}
                >
                  Edit
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {status ? (
                <>
                  <Badge variant="secondary">Edited</Badge>
                  {!status.visible ? (
                    <Badge variant="outline">Hidden</Badge>
                  ) : null}
                  <span>Last saved {dateFormat.format(status.updatedAt)}</span>
                </>
              ) : (
                <Badge variant="outline">Original content</Badge>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
