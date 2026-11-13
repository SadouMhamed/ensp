import "server-only";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";

/** Users page. Call only after requireAdmin(). Admins first, then newest. */
export async function getUsersForAdmin() {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(asc(user.role), desc(user.createdAt));

  return rows.map((r) => ({ ...r, role: r.role === "admin" ? ("admin" as const) : ("editor" as const) }));
}

export type AdminUserRow = Awaited<ReturnType<typeof getUsersForAdmin>>[number];
