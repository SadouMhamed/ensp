import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  // The address contains the secret reset token: never send it to other sites.
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    // useSearchParams (for ?token=) needs a Suspense boundary
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
