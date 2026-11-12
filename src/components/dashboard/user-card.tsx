import { requireUser } from "@/lib/dal";
import { SignOutButton } from "./sign-out-button";

export async function UserCard() {
  const user = await requireUser();
  return (
    <div className="flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
      <div className="px-2 text-sm">
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">
          {user.email} · {user.role}
        </p>
      </div>
      <SignOutButton />
    </div>
  );
}
