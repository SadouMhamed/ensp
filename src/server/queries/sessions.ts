import "server-only";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { session } from "@/db/schema";

/**
 * One user's sessions that have not expired yet, most recently active first.
 * Callers must check access first (admin, or the user asking for their own).
 * The session `token` is NEVER selected: it is the login secret and must not reach the browser.
 */
export async function getUserSessions(userId: string) {
  return db
    .select({
      id: session.id,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      expiresAt: session.expiresAt,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      impersonatedBy: session.impersonatedBy,
    })
    .from(session)
    .where(and(eq(session.userId, userId), gt(session.expiresAt, new Date())))
    .orderBy(desc(session.updatedAt));
}

/** Server-side only: the token Better Auth needs to revoke one session. */
export async function getSessionTokenById(sessionId: string) {
  const [row] = await db
    .select({ token: session.token, userId: session.userId })
    .from(session)
    .where(eq(session.id, sessionId));
  return row ?? null;
}
