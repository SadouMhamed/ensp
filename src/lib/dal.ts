import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { can, type Permission, type Role } from "@/lib/permissions";

/**
 * Data Access Layer: the ONLY place that reads the session.
 * Call these at the top of every dashboard page AND every Server Action —
 * the proxy redirect is just a fast, optimistic check, not real security.
 *
 * With Cache Components, anything that calls these must render inside <Suspense>.
 * Wrapped in React `cache` so the layout, menu and page share one lookup per request.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  // Permissions live in our own column (not part of Better Auth's session object).
  const [row] = await db
    .select({ permissions: userTable.permissions })
    .from(userTable)
    .where(eq(userTable.id, session.user.id));

  const { id, name, email, image } = session.user;
  return {
    id,
    name,
    email,
    image,
    role: (session.user.role === "admin" ? "admin" : "editor") as Role,
    permissions: row?.permissions ?? [],
  };
});

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

/** For pages: send users without this permission back to the overview. */
export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!can(user, permission)) redirect("/dashboard");
  return user;
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
