"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateUserAccessAction } from "@/server/actions/users";
import { cleanPermissions, type Permission, type Role } from "@/lib/permissions";
import type { AdminUserRow } from "@/server/queries/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { AccessFields } from "./access-fields";

export function EditAccessDialog({
  user,
  isSelf,
  open,
  onOpenChange,
}: {
  user: AdminUserRow;
  isSelf: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [role, setRole] = useState<Role>(user.role);
  const [permissions, setPermissions] = useState<Permission[]>(
    cleanPermissions("editor", user.permissions),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "editor" && permissions.length === 0) {
      return setError("Give the editor at least one privilege, or make them an admin.");
    }
    setError(null);
    startTransition(async () => {
      const result = await updateUserAccessAction({ userId: user.id, role, permissions });
      if (!result.ok) return setError(result.error);
      toast.success(`Access updated for ${user.name}`);
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={onSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Edit access</DialogTitle>
            <DialogDescription>
              {user.name} · {user.email}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <AccessFields
              idPrefix={`edit-${user.id}`}
              role={role}
              permissions={permissions}
              onRoleChange={setRole}
              onPermissionsChange={setPermissions}
              roleLocked={isSelf}
            />
            {error ? <FieldError>{error}</FieldError> : null}
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
