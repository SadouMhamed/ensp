import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { ac, adminRole, editorRole } from "@/lib/auth-roles";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),

  emailAndPassword: {
    enabled: true,
    // Private company dashboard: nobody can register from the website.
    // Accounts are created by admins (dashboard → Users) or by `npm run db:seed`.
    disableSignUp: true,
  },

  plugins: [
    // Admin API: create / delete users and change roles. Only "admin" users may call it.
    // "editor" has no rights on the admin API; what editors may manage in the dashboard
    // is decided by their `permissions` column (see src/lib/permissions.ts).
    admin({
      ac,
      roles: { admin: adminRole, editor: editorRole },
      defaultRole: "editor",
      adminRoles: ["admin"],
    }),
    // Must stay the last plugin: lets Server Actions set auth cookies.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type { Role } from "@/lib/permissions";
