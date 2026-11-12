import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/dal";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { UserCard } from "@/components/dashboard/user-card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <SidebarProvider>
      <AppSidebar
        footer={
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <UserCard />
          </Suspense>
        }
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-6">
          {/* Session read happens inside Suspense (required by Cache Components). */}
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <AuthGate>{children}</AuthGate>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  await requireUser(); // redirects to /login when the session is missing/invalid
  return <>{children}</>;
}
