import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    // useSearchParams (for ?next=) needs a Suspense boundary
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
