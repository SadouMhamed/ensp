import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),

  emailAndPassword: {
    enabled: true,
    // This is a private company dashboard: nobody can register from the website.
    // The first admin is created with `npm run db:seed` (which sets ALLOW_SIGNUP=true).
    disableSignUp: process.env.ALLOW_SIGNUP !== "true",
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "editor", // "admin" | "editor"
        input: false, // can't be set by the client during sign-up
      },
    },
  },

  // Must stay the last plugin: lets Server Actions set auth cookies.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type Role = "admin" | "editor";
