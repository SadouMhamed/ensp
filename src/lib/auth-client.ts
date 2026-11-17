import { createAuthClient } from "better-auth/react";

// No baseURL: the client talks to the same address the page was loaded from
// (localhost:3000, another port, or the live domain), so login works everywhere.
export const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;
