import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BRAND_NAME, Logo } from "@/components/brand/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Login" };

// Layout: shadcn login-02 block (form on the left, visual panel on the right on large screens).
export default function LoginPage() {
  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo size={28} priority />
            {BRAND_NAME}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* useSearchParams (for ?next=) needs a Suspense boundary */}
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
      {/* Brand panel. Can later become a company photo: <Image fill className="object-cover" … /> */}
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/70 to-primary/40" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]"
        />
        <div className="relative flex h-full flex-col justify-end p-10 text-primary-foreground">
          <div className="mb-8 w-fit bg-white p-4 shadow-lg ring-1 ring-black/5">
            <Logo variant="full" size={160} priority />
          </div>
          <p className="max-w-md text-2xl font-semibold leading-snug"></p>
          <p className="mt-3 text-sm opacity-80">{BRAND_NAME} dashboard</p>
        </div>
      </div>
    </div>
  );
}
