"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Au moins 8 caractères")
      .max(128, "Mot de passe trop long"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Les deux mots de passe ne correspondent pas",
    path: ["confirm"],
  });

/**
 * Step 2 of "forgot password": the link in the email lands here with ?token=…
 * (Better Auth checks the token first and sends ?error=INVALID_TOKEN if it is
 * wrong or expired). The token is single-use and valid 30 minutes; after the
 * change, every device is signed out (revokeSessionsOnPasswordReset).
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Read once, then removed from the address bar (keeps the secret out of history).
  const [token] = useState(() => searchParams.get("token"));
  const [invalid, setInvalid] = useState(
    () => !token || searchParams.get("error") === "INVALID_TOKEN",
  );
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState<{ message: string; field?: string } | null>(
    null,
  );
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return setError({ message: issue.message, field: String(issue.path[0]) });
    }
    if (!token) return setInvalid(true);

    setPending(true);
    try {
      const { error: apiError } = await authClient.resetPassword({
        newPassword: parsed.data.password,
        token,
      });
      if (apiError) {
        if (apiError.code === "INVALID_TOKEN") return setInvalid(true);
        return setError({
          message: apiError.message ?? "Une erreur est survenue. Réessayez.",
        });
      }
      toast.success("Mot de passe modifié. Connectez-vous avec le nouveau.");
      router.push("/login");
    } catch {
      setError({
        message:
          "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      });
    } finally {
      setPending(false);
    }
  }

  if (invalid) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <LinkIcon />
        </span>
        <h1 className="text-2xl font-bold">Lien invalide ou expiré</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Ce lien a déjà été utilisé ou n&apos;est plus valable (30 minutes).
          Demandez-en un nouveau.
        </p>
        <Button
          className="w-full"
          nativeButton={false}
          render={<Link href="/forgot-password" />}
        >
          Demander un nouveau lien
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Choisissez un nouveau mot de passe. Vous serez déconnecté de tous vos
            appareils.
          </p>
        </div>
        <Field data-invalid={error?.field === "password" || undefined}>
          <FieldLabel htmlFor="password">Nouveau mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            aria-invalid={error?.field === "password" || undefined}
            maxLength={128}
            required
          />
          {error?.field === "password" ? (
            <FieldError>{error.message}</FieldError>
          ) : (
            <FieldDescription>Au moins 8 caractères.</FieldDescription>
          )}
        </Field>
        <Field data-invalid={error?.field === "confirm" || undefined}>
          <FieldLabel htmlFor="confirm">Confirmer le mot de passe</FieldLabel>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            aria-invalid={error?.field === "confirm" || undefined}
            maxLength={128}
            required
          />
          {error?.field === "confirm" ? (
            <FieldError>{error.message}</FieldError>
          ) : null}
        </Field>
        {error && !error.field ? <FieldError>{error.message}</FieldError> : null}
        <Field>
          <Button
            type="submit"
            disabled={pending || !form.password || !form.confirm}
          >
            {pending ? "Enregistrement…" : "Enregistrer le mot de passe"}
          </Button>
          <FieldDescription className="text-center">
            <Link href="/login">Retour à la connexion</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
