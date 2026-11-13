"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteUserAction } from "@/server/actions/users";
import type { AdminUserRow } from "@/server/queries/users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AdminUserRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await deleteUserAction(user.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`${user.name}'s account was deleted`);
      onOpenChange(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {user.name}&apos;s account?</AlertDialogTitle>
          <AlertDialogDescription>
            {user.email} will be signed out and won&apos;t be able to log in again. Articles and
            media they added stay on the website. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending ? "Deleting…" : "Delete account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
