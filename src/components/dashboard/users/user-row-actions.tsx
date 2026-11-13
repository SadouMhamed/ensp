"use client";

import { useState } from "react";
import { EllipsisVerticalIcon, ShieldCheckIcon, Trash2Icon } from "lucide-react";
import type { AdminUserRow } from "@/server/queries/users";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditAccessDialog } from "./edit-access-dialog";

export function UserRowActions({ user, isSelf }: { user: AdminUserRow; isSelf: boolean }) {
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);
  const close = (open: boolean) => !open && setDialog(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="size-8 text-muted-foreground" />}
        >
          <EllipsisVerticalIcon />
          <span className="sr-only">Actions for {user.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onClick={() => setDialog("edit")}>
            <ShieldCheckIcon />
            Edit access
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isSelf}
            onClick={() => setDialog("delete")}
          >
            <Trash2Icon />
            {isSelf ? "Can't delete yourself" : "Delete account"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mounted only while open, so each opening starts from the latest saved values. */}
      {dialog === "edit" ? (
        <EditAccessDialog user={user} isSelf={isSelf} open onOpenChange={close} />
      ) : null}
      {dialog === "delete" ? <DeleteUserDialog user={user} open onOpenChange={close} /> : null}
    </>
  );
}
