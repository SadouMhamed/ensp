"use server";

import { headers } from "next/headers";
import { refresh } from "next/cache";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/dal";
import {
  changePasswordSchema,
  updateNameSchema,
  type ChangePasswordInput,
  type UpdateNameInput,
} from "@/lib/validations/account";

/** `field` says which input the error belongs to, so the form can highlight it. */
export type AccountActionResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

function errorMessage(err: unknown): string {
  if (isAPIError(err)) return err.body?.message ?? err.message;
  console.error(err);
  return "Something went wrong. Please try again.";
}

/**
 * Settings page actions. Each user may only change THEIR OWN account:
 * requireUser() checks the login, and Better Auth applies the change to the
 * session's user (there is no user id in the request to tamper with).
 */

export async function updateNameAction(
  input: UpdateNameInput,
): Promise<AccountActionResult> {
  await requireUser();
  const parsed = updateNameSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: String(issue.path[0]) };
  }

  try {
    await auth.api.updateUser({
      body: { name: parsed.data.name },
      headers: await headers(),
    });
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }

  refresh(); // the sidebar shows the new name right away
  return { ok: true };
}

export async function changePasswordAction(
  input: ChangePasswordInput,
): Promise<AccountActionResult> {
  await requireUser();
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: String(issue.path[0]) };
  }
  const { currentPassword, newPassword, revokeOtherSessions } = parsed.data;

  try {
    await auth.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions },
      headers: await headers(),
    });
  } catch (err) {
    if (isAPIError(err) && err.body?.code === "INVALID_PASSWORD") {
      return {
        ok: false,
        error: "Your current password is not correct",
        field: "currentPassword",
      };
    }
    return { ok: false, error: errorMessage(err) };
  }

  refresh();
  return { ok: true };
}
