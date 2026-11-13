import type { Metadata } from "next";
import { Suspense } from "react";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/server/queries/dashboard";
import sampleData from "@/components/dashboard/sample-data.json";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <>
      {/* Stats come from the database: stream them in so the page itself appears instantly. */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      {/* Sample data from the shadcn block, until analytics and the articles table are built. */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={sampleData} />
    </>
  );
}

async function Stats() {
  const stats = await getDashboardStats(); // real numbers from Neon
  return <SectionCards stats={stats} />;
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-36 rounded-xl" />
      ))}
    </div>
  );
}
