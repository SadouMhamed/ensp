"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Design: shadcn login-02 block. GitHub login, "Sign up" and "Forgot password" removed
// (accounts are created by an admin; no password-reset email is set up yet).
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    let error: { message?: string } | null = null;
    try {
      ({ error } = await signIn.email({
        email: String(form.get("email")),
        password: String(form.get("password")),
      }));
    } catch {
      // network / server unreachable: don't leave the button stuck on "Logging in…"
      error = {
        message:
          "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      };
    }
    if (error) {
      setPending(false);
      toast.error(error.message ?? "E-mail ou mot de passe incorrect");
      return;
    }
    const next = searchParams.get("next");
    router.push(next?.startsWith("/dashboard") ? next : "/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Connexion à votre compte</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Saisissez votre e-mail pour accéder au tableau de bord
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Connexion…" : "Se connecter"}
          </Button>
          <FieldDescription className="text-center">
            Les comptes sont créés par un administrateur.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
