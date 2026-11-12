/**
 * Creates the first admin account.
 *   npm run db:seed
 * Reads SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD / SEED_ADMIN_NAME from .env
 */
import "dotenv/config";

process.env.ALLOW_SIGNUP = "true"; // sign-up is disabled everywhere else

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? "Admin";
  if (!email || !password) throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env");

  // Imported after ALLOW_SIGNUP is set, because auth reads it at load time.
  const { auth } = await import("../src/lib/auth");
  const { db, pool } = await import("../src/db");
  const { user } = await import("../src/db/schema");
  const { eq } = await import("drizzle-orm");

  const existing = await db.query.user.findFirst({ where: eq(user.email, email) });
  if (!existing) {
    await auth.api.signUpEmail({ body: { email, password, name } });
    console.log(`Created user ${email}`);
  } else {
    console.log(`User ${email} already exists`);
  }

  await db.update(user).set({ role: "admin" }).where(eq(user.email, email));
  console.log(`${email} is now an admin ✔`);
  await pool.end(); // let the script exit
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
