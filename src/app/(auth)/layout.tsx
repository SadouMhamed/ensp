import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, Logo } from "@/components/brand/logo";
import { Toaster } from "@/components/ui/sonner";

/**
 * Shared by /login, /forgot-password and /reset-password.
 * Layout: shadcn login-02 block (form on the left, visual panel on the right on large screens).
 * Stays light even when the dashboard is set to dark (see data-force-light in globals.css).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div data-force-light className="flex flex-1 flex-col">
        <div className="grid min-h-svh w-full lg:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
              <Link href="/" className="flex items-center gap-2 font-medium">
                <Logo size={28} priority />
                {BRAND_NAME}
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-xs">{children}</div>
            </div>
          </div>
          {/* Brand panel: ENSP photo with an orange overlay (large screens only) */}
          <div className="relative hidden overflow-hidden bg-muted lg:block">
            <Image
              src="/images/site/hero-2-appareil-forage.jpg"
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/65 to-primary/25" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]"
            />
            <div className="relative flex h-full flex-col justify-end p-10 text-primary-foreground">
              <div className="mb-8 w-fit bg-white p-4 shadow-lg ring-1 ring-black/5">
                <Logo variant="full" size={160} priority />
              </div>
              <p className="mt-3 text-sm opacity-80">
                Tableau de bord {BRAND_NAME}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors theme="light" />
    </>
  );
}
