import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Role } from "@/lib/auth";

/**
 * Data Access Layer: the ONLY place that reads the session.
 * Call these at the top of every dashboard page AND every Server Action —
 * the proxy redirect is just a fast, optimistic check, not real security.
 *
 * With Cache Components, anything that calls these must render inside <Suspense>.
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const { id, name, email, image } = session.user;
  return { id, name, email, image, role: (session.user.role ?? "editor") as Role };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
