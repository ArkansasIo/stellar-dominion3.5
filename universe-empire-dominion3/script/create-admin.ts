/**
 * Standalone admin account creation script.
 * Run with: npx tsx script/create-admin.ts
 *
 * Reads credentials from env (or uses defaults):
 *   ADMIN_BOOTSTRAP_USERNAME  (default: admin)
 *   ADMIN_BOOTSTRAP_EMAIL     (default: admin@universee.game)
 *   ADMIN_BOOTSTRAP_PASSWORD  (default: Admin@12345)
 *   ADMIN_BOOTSTRAP_ROLE      (default: founder)
 */

import "dotenv/config";
import crypto from "node:crypto";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../shared/schema";

const { users, adminUsers } = schema;

if (!process.env.DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
const db = drizzle({ client: pool, schema });

function hash(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  const username = (process.env.ADMIN_BOOTSTRAP_USERNAME || "admin").trim();
  const email    = (process.env.ADMIN_BOOTSTRAP_EMAIL    || "admin@universee.game").trim();
  const password =  process.env.ADMIN_BOOTSTRAP_PASSWORD || "Admin@12345";
  const role     = (process.env.ADMIN_BOOTSTRAP_ROLE     || "founder").trim();

  console.log(`\n🔑  Creating admin account for "${username}" (${email}) with role "${role}" …\n`);

  // ── 1. Find or create user ──────────────────────────────────────────────────
  let [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!existingUser) {
    [existingUser] = await db
      .insert(users)
      .values({
        username,
        email,
        firstName: "Admin",
        passwordHash: hash(password),
      })
      .returning();

    console.log(`✅  User created  → id: ${existingUser.id}`);
  } else {
    console.log(`ℹ️   User already exists → id: ${existingUser.id}`);
  }

  // ── 2. Find or create adminUsers row ───────────────────────────────────────
  const [existingAdmin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, existingUser.id))
    .limit(1);

  if (!existingAdmin) {
    await db.insert(adminUsers).values({
      userId: existingUser.id,
      role,
      permissions: ["all_access", "administrate", "manage", "moderate", "view_only"],
    });
    console.log(`✅  Admin role granted → role: ${role}`);
  } else {
    console.log(`ℹ️   Admin role already set → role: ${existingAdmin.role}`);
  }

  console.log("\n📋  Admin credentials:");
  console.log(`   Username : ${username}`);
  console.log(`   Email    : ${email}`);
  console.log(`   Password : ${password}`);
  console.log(`   Role     : ${role}\n`);

  await pool.end();
}

main().catch(err => {
  console.error("❌  Failed:", err);
  pool.end().finally(() => process.exit(1));
});
