import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

/**
 * "Forgot password" requests always take at least this long, whether the email
 * belongs to an account or not. Better Auth already answers the same message and
 * sends the email in the background; this removes the last small time difference
 * (creating a token vs. a dummy lookup), so nobody can guess which emails have an
 * account by measuring response times.
 */
const RESET_REQUEST_MIN_MS = 1200;

export async function POST(request: Request) {
  if (!new URL(request.url).pathname.endsWith("/request-password-reset")) {
    return handlers.POST(request);
  }

  const started = performance.now();
  try {
    return await handlers.POST(request);
  } finally {
    const wait = RESET_REQUEST_MIN_MS - (performance.now() - started);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  }
}
