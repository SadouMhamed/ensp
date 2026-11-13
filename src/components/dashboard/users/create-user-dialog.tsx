"use client";

import { useState, useTransition } from "react";
import { EyeIcon, EyeOffIcon, UserPlusIcon, WandSparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { createUserAction } from "@/server/actions/users";
import { createUserSchema } from "@/lib/validations/user";
import type { Permission, Role } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AccessFields } from "./access-fields";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint32Array(14));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

const empty = {
  name: "",
  email: "",
  password: "",
  role: "editor" as Role,
  permissions: ["posts"] as Permission[],
};

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(empty);
      setError(null);
      setShowPassword(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = createUserSchema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    if (parsed.data.role === "editor" && parsed.data.permissions.length === 0) {
      return setError("Give the editor at least one privilege, or make them an admin.");
    }
    setError(null);
    startTransition(async () => {
      const result = await createUserAction(parsed.data);
      if (!result.ok) return setError(result.error);
      toast.success(`Account created for ${parsed.data.email}`, {
        description: "Share the email and password with them so they can log in.",
      });
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button />}>
        <UserPlusIcon />
        Add user
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={onSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
            <DialogDescription>
              Create an account and choose what this person can manage.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="new-name">Full name</FieldLabel>
              <Input
                id="new-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="off"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-email">Email</FieldLabel>
              <Input
                id="new-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="off"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">Temporary password</FieldLabel>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="new-password"
                    className="pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm({ ...form, password: generatePassword() });
                    setShowPassword(true);
                  }}
                >
                  <WandSparklesIcon />
                  Generate
                </Button>
              </div>
              <FieldDescription>At least 8 characters. Share it with the person privately.</FieldDescription>
            </Field>

            <AccessFields
              idPrefix="new"
              role={form.role}
              permissions={form.permissions}
              onRoleChange={(role) => setForm({ ...form, role })}
              onPermissionsChange={(permissions) => setForm({ ...form, permissions })}
            />

            {error ? <FieldError>{error}</FieldError> : null}
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
