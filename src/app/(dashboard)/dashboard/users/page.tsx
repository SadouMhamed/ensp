import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal";
import { getUsersForAdmin } from "@/server/queries/users";
import { CreateUserDialog } from "@/components/dashboard/users/create-user-dialog";
import { UsersTable } from "@/components/dashboard/users/users-table";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireAdmin(); // admins only
  const users = await getUsersForAdmin();

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
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
    </div>
  );
}
