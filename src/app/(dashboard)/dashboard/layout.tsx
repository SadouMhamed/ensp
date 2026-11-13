import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/dal";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { CurrentUserMenu } from "@/components/dashboard/current-user-menu";
import { CurrentUserNav } from "@/components/dashboard/current-user-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <ThemeProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          variant="inset"
          nav={
            <Suspense fallback={<NavSkeleton />}>
              <CurrentUserNav />
            </Suspense>
          }
          user={
            <Suspense
              fallback={<Skeleton className="h-12 w-full rounded-lg" />}
            >
              <CurrentUserMenu />
            </Suspense>
          }
        />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Session read happens inside Suspense (required by Cache Components). */}
              <Suspense fallback={<DashboardSkeleton />}>
                <AuthGate>{children}</AuthGate>
              </Suspense>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  await requireUser(); // redirects to /login when the session is missing/invalid
  return <>{children}</>;
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}

function NavSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full rounded-md" />
      ))}
    </div>
  );
}
