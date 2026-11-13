"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { refresh } from "next/cache";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireAdmin } from "@/lib/dal";
import { cleanPermissions } from "@/lib/permissions";
import {
  createUserSchema,
  updateAccessSchema,
  type CreateUserInput,
  type UpdateAccessInput,
} from "@/lib/validations/user";

export type ActionResult = { ok: true } | { ok: false; error: string };

function errorMessage(err: unknown): string {
  if (isAPIError(err)) return err.body?.message ?? err.message;
  console.error(err);
  return "Something went wrong. Please try again.";
}

/**
 * Every action re-checks that the caller is an admin (requireAdmin) — the UI hiding
 * buttons is not security. Better Auth's admin API checks the admin session again.
 */
export async function createUserAction(input: CreateUserInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { name, email, password, role, permissions } = parsed.data;

  try {
    const created = await auth.api.createUser({
      body: { name, email, password, role },
      headers: await headers(),
    });
    await db
      .update(user)
      .set({ permissions: cleanPermissions(role, permissions) })
      .where(eq(user.id, created.user.id));
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }

  refresh();
  return { ok: true };
}

export async function updateUserAccessAction(input: UpdateAccessInput): Promise<ActionResult> {
  const me = await requireAdmin();
  const parsed = updateAccessSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { userId, role, permissions } = parsed.data;

  // Keeps at least one admin: you can't lock yourself out.
  if (userId === me.id && role !== "admin") {
    return { ok: false, error: "You can't remove your own admin role." };
  }

  try {
    await auth.api.setRole({ body: { userId, role }, headers: await headers() });
    await db
      .update(user)
      .set({ permissions: cleanPermissions(role, permissions) })
      .where(eq(user.id, userId));
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }

  refresh();
  return { ok: true };
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  const me = await requireAdmin();
  if (userId === me.id) return { ok: false, error: "You can't delete your own account." };

  try {
    // Deletes the user, their sessions and login. Their articles/media stay (author set to empty).
    await auth.api.removeUser({ body: { userId }, headers: await headers() });
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }

  refresh();
  return { ok: true };
}
