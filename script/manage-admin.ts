import { db } from '../server/db';
import { adminUsers, users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const command = process.argv[2];
  const username = process.argv[3];
  const role = process.argv[4];

  if (!command) {
    console.log('Usage:');
    console.log('  npm run admin:manage -- grant <username> <role>');
    console.log('  npm run admin:manage -- revoke <username>');
    console.log('  npm run admin:manage -- list');
    console.log('');
    console.log('Roles: founder, devadmin, administrator, suadmin, moderator, viewer');
    process.exit(1);
  }

  if ((command === 'grant' || command === 'revoke') && !username) {
    console.log('Usage:');
    console.log('  npm run admin:manage -- grant <username> <role>');
    console.log('  npm run admin:manage -- revoke <username>');
    console.log('  npm run admin:manage -- list');
    console.log('');
    console.log('Roles: founder, devadmin, administrator, suadmin, moderator, viewer');
    process.exit(1);
  }

  try {
    if (command === 'grant') {
      if (!role) {
        console.error('Role is required for grant command');
        process.exit(1);
      }

      const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (!user.length) {
        console.error(`User "${username}" not found`);
        process.exit(1);
      }

      const userId = user[0].id;
      const existing = await db.select().from(adminUsers).where(eq(adminUsers.userId, userId)).limit(1);

      if (existing.length) {
        await db.update(adminUsers)
          .set({ role })
          .where(eq(adminUsers.userId, userId));
        console.log(`✓ Updated admin role for "${username}" to "${role}"`);
      } else {
        await db.insert(adminUsers).values({
          userId,
          role,
          permissions: [],
        });
        console.log(`✓ Granted admin role "${role}" to "${username}"`);
      }
    } else if (command === 'revoke') {
      const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (!user.length) {
        console.error(`User "${username}" not found`);
        process.exit(1);
      }

      const userId = user[0].id;
      const result = await db.delete(adminUsers).where(eq(adminUsers.userId, userId));
      console.log(`✓ Removed admin permissions from "${username}"`);
    } else if (command === 'list') {
      const adminList = await db
        .select({
          username: users.username,
          role: adminUsers.role,
          permissions: adminUsers.permissions,
        })
        .from(adminUsers)
        .innerJoin(users, eq(adminUsers.userId, users.id));

      if (!adminList.length) {
        console.log('No admin users found');
      } else {
        console.log('\nAdmin Users:');
        adminList.forEach((admin) => {
          console.log(`  ${admin.username}: ${admin.role}`);
        });
      }
    } else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
