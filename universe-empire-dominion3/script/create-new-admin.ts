import { db } from '../server/db';
import { users, adminUsers } from '../shared/schema';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const username = process.argv[2] || 'testadmin';
  const password = process.argv[3] || 'Admin@12345';
  const role = process.argv[4] || 'administrator';

  try {
    console.log(`Creating admin account: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${role}\n`);

    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existing.length) {
      console.log(`User "${username}" already exists`);
      const existingAdmin = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.userId, existing[0].id))
        .limit(1);

      if (existingAdmin.length) {
        console.log(`✓ User "${username}" is already an admin with role: ${existingAdmin[0].role}`);
      } else {
        // Grant admin role to existing user
        await db.insert(adminUsers).values({
          userId: existing[0].id,
          role,
          permissions: [],
        });
        console.log(`✓ Granted admin role "${role}" to existing user "${username}"`);
      }
      process.exit(0);
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        username,
        passwordHash: hashPassword(password),
        email: `${username}@universe-empire-domions.game`,
      })
      .returning();

    if (!newUser.length) {
      throw new Error('Failed to create user');
    }

    const userId = newUser[0].id;

    // Grant admin role
    await db.insert(adminUsers).values({
      userId,
      role,
      permissions: [],
    });

    console.log(`✓ Created new admin account!\n`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${role}`);
    console.log(`Email: ${username}@universe-empire-domions.game\n`);
    console.log('You can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

main();
