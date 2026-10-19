import { config } from "dotenv";
import { db, pool } from "./server/db";
import { users } from "./shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

config();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function seedTestUsers() {
  try {
    console.log("🌱 Seeding test user accounts...");

    const testAccounts = [
      { username: "player1", password: "password123", email: "player1@universe-empire-domions.game" },
      { username: "player2", password: "password123", email: "player2@universe-empire-domions.game" },
      { username: "player3", password: "password123", email: "player3@universe-empire-domions.game" },
    ];

    for (const account of testAccounts) {
      const passwordHash = hashPassword(account.password);
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, account.username));

      if (existing.length === 0) {
        await db.insert(users).values({
          username: account.username,
          passwordHash,
          email: account.email,
          createdAt: new Date(),
        });
        console.log(`✅ Created demo user: ${account.username}`);
      } else {
        // Repair an existing demo account so the documented demo password works.
        await db
          .update(users)
          .set({
            passwordHash,
            email: account.email,
          })
          .where(eq(users.id, existing[0].id));
        console.log(`🔧 Reset demo password: ${account.username}`);
      }
    }

    console.log("\n✅ Demo users are ready!");
    console.log("\nLogin with any of:");
    console.log("  Username: player1, player2, or player3");
    console.log("  Password: password123\n");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding demo users:", error);
    await pool.end().catch(() => undefined);
    process.exit(1);
  }
}

seedTestUsers();
