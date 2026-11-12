import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Run `neon env pull` (or copy .env.example to .env).");
}

/**
 * node-postgres pool over Neon's POOLED connection string (`-pooler` host, PgBouncer).
 * Recommended by Neon for Next.js on Vercel (Fluid compute): warm instances reuse TCP connections.
 * `attachDatabasePool` closes idle clients before a Vercel instance suspends; it is a no-op locally.
 *
 * In dev, the pool is cached on globalThis so hot reloads don't open a new pool each time.
 */
const globalForDb = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForDb.pgPool ??
  new Pool({
    // pg already treats sslmode=require as verify-full; say so explicitly to keep that
    // strict behavior when pg v9 changes the meaning of "require".
    connectionString: process.env.DATABASE_URL.replace("sslmode=require", "sslmode=verify-full"),
  });

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;

attachDatabasePool(pool);

export const db = drizzle({ client: pool, schema });

export type DB = typeof db;
