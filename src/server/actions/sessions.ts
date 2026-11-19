"use server";

import { headers } from "next/headers";
import { isAPIError } from "better-auth/api";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { requireAdmin, requireUser } from "@/lib/dal";
import {
  getSessionTokenById,
  getUserSessions,
} from "@/server/queries/sessions";

export type SessionActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type UserSessionRow = Awaited<
  ReturnType<typeof getUserSessions>
>[number] & {
  /** The session of the browser making the request. */
  isCurrent: boolean;
};

export type UserSessionsResult =
  | { ok: true; sessions: UserSessionRow[] }
  | { ok: false; error: string };

const idSchema = z.string().trim().min(1).max(200);

const CURRENT_SESSION_ERROR =
  "This is your current session. Use “Log out” in your menu instead.";

function errorMessage(err: unknown): string {
  if (isAPIError(err)) return err.body?.message ?? err.message;
  console.error(err);
  return "Something went wrong. Please try again.";
}

async function loadSessions(
  userId: string,
  currentSessionId: string,
): Promise<UserSessionsResult> {
  try {
    const rows = await getUserSessions(userId);
    return {
      ok: true,
      sessions: rows.map((s) => ({ ...s, isCurrent: s.id === currentSessionId })),
    };
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }
}

/* ───────────── Admin: any user's sessions (Users page) ─────────────
 * Every action re-checks that the caller is an admin (requireAdmin), and Better Auth's
 * admin API checks the "session: revoke" permission again. */

/** Loads one user's active sessions. */
export async function getUserSessionsAction(
  userId: string,
): Promise<UserSessionsResult> {
  const me = await requireAdmin();
  const parsed = idSchema.safeParse(userId);
  if (!parsed.success) return { ok: false, error: "Invalid user." };
  return loadSessions(parsed.data, me.sessionId);
}

/** Sign out one device of any user. */
export async function revokeSessionAction(
  sessionId: string,
): Promise<SessionActionResult> {
  const me = await requireAdmin();
  const parsed = idSchema.safeParse(sessionId);
  if (!parsed.success) return { ok: false, error: "Invalid session." };
  if (parsed.data === me.sessionId) return { ok: false, error: CURRENT_SESSION_ERROR };

  const found = await getSessionTokenById(parsed.data);
  if (!found) return { ok: false, error: "This session has already ended." };

  try {
    await auth.api.revokeUserSession({
      body: { sessionToken: found.token },
      headers: await headers(),
    });
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }
  return { ok: true };
}

/** Sign out every device of one user (for the admin themself: every device except this one). */
export async function revokeUserSessionsAction(
  userId: string,
): Promise<SessionActionResult> {
  const me = await requireAdmin();
  const parsed = idSchema.safeParse(userId);
  if (!parsed.success) return { ok: false, error: "Invalid user." };

  try {
    if (parsed.data === me.id) {
      await auth.api.revokeOtherSessions({ headers: await headers() });
    } else {
      await auth.api.revokeUserSessions({
        body: { userId: parsed.data },
        headers: await headers(),
      });
    }
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }
  return { ok: true };
}

/* ───────────── Everyone: my own sessions (user menu → My sessions) ─────────────
 * Any signed-in user (admin or editor) may see and revoke ONLY their own sessions.
 * Better Auth's revokeSession also refuses a token that belongs to someone else. */

/** Loads the signed-in user's active sessions. */
export async function getMySessionsAction(): Promise<UserSessionsResult> {
  const me = await requireUser();
  return loadSessions(me.id, me.sessionId);
}

/** Sign out one of my other devices. */
export async function revokeMySessionAction(
  sessionId: string,
): Promise<SessionActionResult> {
  const me = await requireUser();
  const parsed = idSchema.safeParse(sessionId);
  if (!parsed.success) return { ok: false, error: "Invalid session." };
  if (parsed.data === me.sessionId) return { ok: false, error: CURRENT_SESSION_ERROR };

  const found = await getSessionTokenById(parsed.data);
  // Same message whether it ended or belongs to someone else: reveals nothing.
  if (!found || found.userId !== me.id) {
    return { ok: false, error: "This session has already ended." };
  }

  try {
    await auth.api.revokeSession({
      body: { token: found.token },
      headers: await headers(),
    });
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }
  return { ok: true };
}

/** Sign out all my devices except this one. */
export async function revokeMyOtherSessionsAction(): Promise<SessionActionResult> {
  await requireUser();
  try {
    await auth.api.revokeOtherSessions({ headers: await headers() });
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }
  return { ok: true };
}
