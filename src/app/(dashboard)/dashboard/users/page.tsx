import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/dal";
import { getUsersForAdmin } from "@/server/queries/users";
import { CreateUserDialog } from "@/components/dashboard/users/create-user-dialog";
import { UsersTable } from "@/components/dashboard/users/users-table";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Admin check + database read stream in behind Suspense (page shell appears instantly). */}
      <Suspense fallback={<UsersSkeleton />}>
        <UsersContent />
      </Suspense>
    </div>
  );
}

async function UsersContent() {
  const me = await requireAdmin(); // admins only: others are redirected
  const users = await getUsersForAdmin();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">
            Create accounts for your team, choose their privileges, or remove access.
          </p>
        </div>
        <CreateUserDialog />
      </div>
      <UsersTable users={users} currentUserId={me.id} />
    </>
  );
}

function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
