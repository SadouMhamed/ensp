import type { Metadata } from "next";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";
import { getDashboardStats } from "@/server/queries/dashboard";
import sampleData from "@/components/dashboard/sample-data.json";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const stats = await getDashboardStats(); // real numbers from Neon

  return (
    <>
      <SectionCards stats={stats} />
      {/* Sample data from the shadcn block, until analytics and the articles table are built. */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={sampleData} />
    </>
  );
}
