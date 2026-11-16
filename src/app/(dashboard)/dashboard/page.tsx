import type { Metadata } from "next";
import { Suspense } from "react";
import {
  DraftsToFinish,
  Greeting,
  OverviewStats,
  QuickActions,
  SectionsStatus,
} from "@/components/dashboard/overview";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Overview" };

// Each block loads on its own, so the page appears right away and fills in.
export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <Suspense fallback={<Skeleton className="h-14 w-64 rounded-lg" />}>
        <Greeting />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-9 w-full max-w-xl rounded-lg" />}>
        <QuickActions />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <OverviewStats />
      </Suspense>

      <div className="grid gap-4 @4xl/main:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
          <DraftsToFinish />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
          <SectionsStatus />
        </Suspense>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}
