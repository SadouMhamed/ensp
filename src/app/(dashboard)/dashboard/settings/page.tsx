import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/dal";
import { ROLE_INFO } from "@/lib/permissions";
import { getMySessionsAction } from "@/server/actions/sessions";
import { SettingsTabs } from "@/components/dashboard/settings/settings-tabs";
import { toSettingsTab } from "@/components/dashboard/settings/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage({
  searchParams,
}: PageProps<"/dashboard/settings">) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 lg:px-6">
      {/* Session read streams in behind Suspense (page shell appears instantly). */}
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SettingsContent({
  searchParams,
}: {
  searchParams: PageProps<"/dashboard/settings">["searchParams"];
}) {
  const user = await requireUser();
  const { tab } = await searchParams;
  const initialTab = toSettingsTab(tab);

  // Not awaited: the Sessions tab shows skeletons until this resolves.
  const sessionsPromise = getMySessionsAction();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Your name, your password and the devices you are signed in on.
          </p>
        </div>
        <Badge variant="outline">{ROLE_INFO[user.role].label}</Badge>
      </div>
      <SettingsTabs
        initialTab={initialTab}
        user={{ name: user.name, email: user.email }}
        sessionsPromise={sessionsPromise}
      />
    </>
  );
}

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-8 w-64 rounded-2xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}
