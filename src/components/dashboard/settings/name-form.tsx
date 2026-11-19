"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateNameAction } from "@/server/actions/account";
import { updateNameSchema } from "@/lib/validations/account";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function NameForm({
  currentName,
  email,
}: {
  currentName: string;
  email: string;
}) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const unchanged = name.trim() === currentName;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    // Same rules as the server, checked here first for an instant message.
    const parsed = updateNameSchema.safeParse({ name });
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    startTransition(async () => {
      const result = await updateNameAction(parsed.data);
      if (!result.ok) return setError(result.error);
      setName(parsed.data.name);
      toast.success("Your name was updated");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Name</CardTitle>
        <CardDescription>
          The name shown in the dashboard and on the articles you write.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="name-form" onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="settings-name">Full name</FieldLabel>
              <Input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-invalid={error ? true : undefined}
                maxLength={100}
                required
              />
              {error ? <FieldError>{error}</FieldError> : null}
            </Field>
            <Field data-disabled>
              <FieldLabel htmlFor="settings-email">Email</FieldLabel>
              <Input id="settings-email" value={email} disabled readOnly />
              <FieldDescription>
                Used to log in. Ask an admin if it needs to change.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          type="submit"
          form="name-form"
          disabled={pending || unchanged}
        >
          {pending ? "Saving…" : "Save name"}
        </Button>
      </CardFooter>
    </Card>
  );
}
