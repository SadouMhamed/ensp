"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { changePasswordAction } from "@/server/actions/account";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/account";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

const EMPTY: ChangePasswordInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  revokeOtherSessions: true,
};

const FIELDS: {
  key: PasswordField;
  label: string;
  autoComplete: string;
  description?: string;
}[] = [
  {
    key: "currentPassword",
    label: "Current password",
    autoComplete: "current-password",
  },
  {
    key: "newPassword",
    label: "New password",
    autoComplete: "new-password",
    description: "At least 8 characters.",
  },
  {
    key: "confirmPassword",
    label: "Confirm new password",
    autoComplete: "new-password",
  },
];

export function PasswordForm() {
  const [form, setForm] = useState<ChangePasswordInput>(EMPTY);
  const [error, setError] = useState<{ message: string; field?: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();
  const incomplete =
    !form.currentPassword || !form.newPassword || !form.confirmPassword;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    // Same rules as the server, checked here first for an instant message.
    const parsed = changePasswordSchema.safeParse(form);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return setError({ message: issue.message, field: String(issue.path[0]) });
    }

    startTransition(async () => {
      const result = await changePasswordAction(parsed.data);
      if (!result.ok) {
        return setError({ message: result.error, field: result.field });
      }
      setForm(EMPTY);
      toast.success(
        parsed.data.revokeOtherSessions
          ? "Password changed. Your other devices were signed out."
          : "Password changed",
      );
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Use a strong password that you don&apos;t use on other websites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="password-form" onSubmit={onSubmit} noValidate>
          <FieldGroup>
            {FIELDS.map((f) => {
              const invalid = error?.field === f.key;
              return (
                <Field key={f.key} data-invalid={invalid || undefined}>
                  <FieldLabel htmlFor={`settings-${f.key}`}>{f.label}</FieldLabel>
                  <Input
                    id={`settings-${f.key}`}
                    type="password"
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    autoComplete={f.autoComplete}
                    aria-invalid={invalid || undefined}
                    maxLength={128}
                    required
                  />
                  {f.description && !invalid ? (
                    <FieldDescription>{f.description}</FieldDescription>
                  ) : null}
                  {invalid ? <FieldError>{error.message}</FieldError> : null}
                </Field>
              );
            })}

            <Field orientation="horizontal">
              <Checkbox
                id="settings-revoke-others"
                checked={form.revokeOtherSessions}
                onCheckedChange={(checked) =>
                  setForm({ ...form, revokeOtherSessions: checked === true })
                }
              />
              <FieldContent>
                <FieldLabel htmlFor="settings-revoke-others">
                  Sign out of my other devices
                </FieldLabel>
                <FieldDescription>
                  Recommended if you think someone else knows your password.
                </FieldDescription>
              </FieldContent>
            </Field>

            {/* Errors not tied to one input (e.g. network problem). */}
            {error && !FIELDS.some((f) => f.key === error.field) ? (
              <FieldError>{error.message}</FieldError>
            ) : null}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          type="submit"
          form="password-form"
          disabled={pending || incomplete}
        >
          {pending ? "Changing…" : "Change password"}
        </Button>
      </CardFooter>
    </Card>
  );
}
