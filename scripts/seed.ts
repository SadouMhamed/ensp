/**
 * Creates the first admin account (or promotes an existing one).
 *   npm run db:seed
 * Reads SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD / SEED_ADMIN_NAME from .env
 * Other accounts are created from the dashboard: Users → Add user.
 */
import "dotenv/config";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? "Admin";
  if (!email || !password) throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env");

  const { auth } = await import("../src/lib/auth");
  const { db, pool } = await import("../src/db");
  const { user } = await import("../src/db/schema");
  const { eq } = await import("drizzle-orm");

  const existing = await db.query.user.findFirst({ where: eq(user.email, email) });
  if (!existing) {
    // Server-side call without headers: allowed by the admin plugin (no session needed).
    await auth.api.createUser({ body: { email, password, name, role: "admin" } });
    console.log(`Created admin ${email} ✔`);
  } else {
    await db.update(user).set({ role: "admin" }).where(eq(user.email, email));
    console.log(`${email} already exists, made admin ✔`);
  }
  await pool.end(); // let the script exit
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
