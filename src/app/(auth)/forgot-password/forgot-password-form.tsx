"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, MailCheckIcon } from "lucide-react";
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

const emailSchema = z.email("Saisissez une adresse e-mail valide").trim().toLowerCase();

/**
 * Step 1 of "forgot password": ask for the email.
 * Account privacy: the page ALWAYS shows the same "check your inbox" screen,
 * whether an account exists for this email or not (and the server takes the same
 * time either way). Only a typo in the address or "too many tries" are reported.
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setPending(true);
    try {
      const { error: apiError } = await authClient.requestPasswordReset({
        email: parsed.data,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (apiError?.status === 429) {
        setError("Trop de demandes. Patientez une minute puis réessayez.");
        return;
      }
      // Any other answer: same screen, so it never tells whether the account exists.
      setSentTo(parsed.data);
    } catch {
      setError(
        "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setPending(false);
    }
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-primary">
          <MailCheckIcon />
        </span>
        <h1 className="text-2xl font-bold">Vérifiez votre boîte mail</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Si un compte existe pour <strong>{sentTo}</strong>, vous allez recevoir
          un e-mail avec un lien pour choisir un nouveau mot de passe. Le lien
          est valable 30 minutes.
        </p>
        <p className="text-sm text-balance text-muted-foreground">
          Rien reçu après quelques minutes&nbsp;? Regardez dans les indésirables.
        </p>
        <Button
          variant="outline"
          className="w-full"
          nativeButton={false}
          render={<Link href="/login" />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Retour à la connexion
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Saisissez l&apos;e-mail de votre compte. Nous vous enverrons un lien
            pour choisir un nouveau mot de passe.
          </p>
        </div>
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            required
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Field>
          <Button type="submit" disabled={pending || !email}>
            {pending ? "Envoi…" : "Envoyer le lien"}
          </Button>
          <FieldDescription className="text-center">
            <Link href="/login">Retour à la connexion</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
