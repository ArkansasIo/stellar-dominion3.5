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
      { username: "player1", password: "password123", email: "player1@stellardominion.game" },
      { username: "player2", password: "password123", email: "player2@stellardominion.game" },
      { username: "player3", password: "password123", email: "player3@stellardominion.game" },
    ];

    for (const account of testAccounts) {
      // Check if user exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, account.username));

      if (existing.length === 0) {
        await db.insert(users).values({
          username: account.username,
          passwordHash: hashPassword(account.password),
          email: account.email,
          createdAt: new Date(),
        });
        console.log(`✅ Created user: ${account.username}`);
      } else {
        console.log(`⏭️  User already exists: ${account.username}`);
      }
    }

    console.log("\n✅ Test users seeded successfully!");
    console.log("\nYou can now log in with:");
    console.log("  Username: player1, player2, or player3");
    console.log("  Password: password123\n");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding test users:", error);
    process.exit(1);
  }
}

seedTestUsers();
