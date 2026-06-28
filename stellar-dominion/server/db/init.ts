import { db, pool } from '.';
import { users, adminUsers, playerStates } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Test database connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0]);

    // Create default admin user if it doesn't exist
    await ensureAdminUser();

    // Create test player accounts
    await ensureTestAccounts();

    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function ensureAdminUser() {
  const adminUsername = 'admin';
  
  try {
    // Check if admin exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, adminUsername));

    if (existing.length > 0) {
      console.log('✅ Admin user already exists');
      
      // Ensure admin has superAdmin role
      const adminUser = existing[0];
      const isAdmin = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.userId, adminUser.id));
      
      if (isAdmin.length === 0) {
        await db.insert(adminUsers).values({
          userId: adminUser.id,
          role: 'superAdmin',
          permissions: ['all'],
          createdAt: new Date(),
        });
        console.log('✅ Added superAdmin role to admin user');
      }
      return;
    }

    // Create admin user
    const adminUser = await db
      .insert(users)
      .values({
        username: adminUsername,
        passwordHash: hashPassword('admin123'),
        email: 'admin@stellardominion.game',
        createdAt: new Date(),
      })
      .returning();

    // Add admin role
    await db.insert(adminUsers).values({
      userId: adminUser[0].id,
      role: 'superAdmin',
      permissions: ['all'],
      createdAt: new Date(),
    });

    console.log('✅ Created default admin user (username: admin, password: admin123)');
  } catch (error) {
    console.warn('⚠️ Could not ensure admin user:', error);
  }
}

async function ensureTestAccounts() {
  const testAccounts = [
    { username: 'player1', password: 'password123' },
    { username: 'player2', password: 'password123' },
    { username: 'player3', password: 'password123' },
  ];

  try {
    for (const account of testAccounts) {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, account.username));

      if (existing.length === 0) {
        await db.insert(users).values({
          username: account.username,
          passwordHash: hashPassword(account.password),
          email: `${account.username}@stellardominion.game`,
          createdAt: new Date(),
        });
        console.log(`✅ Created test account: ${account.username}`);
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not ensure test accounts:', error);
  }
}

// Simple password hashing (use crypto for production)
function hashPassword(password: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function closeDatabase() {
  try {
    await pool.end();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
}
