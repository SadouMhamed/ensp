import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRightIcon } from "lucide-react";
import { requirePermission } from "@/lib/dal";
import { EDITABLE_SECTIONS } from "@/lib/validations/sections";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Website sections" };

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
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {EDITABLE_SECTIONS.map((section) => (
        <Card key={section.key}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
            <CardAction>
              {section.ready ? (
                <Link
                  href={section.href}
                  className={buttonVariants({ size: "sm" })}
                >
                  Edit
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              ) : (
                <Badge variant="secondary">Coming soon</Badge>
              )}
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
