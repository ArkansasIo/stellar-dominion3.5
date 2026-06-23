import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const envUrl = process.env.DATABASE_URL || "";
const databaseUrl = envUrl || "postgresql://postgres:postgres@localhost:5432/stellar_dominion";

console.log('🔌 Connecting to database...');

export const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000,
  max: parseInt(process.env.DB_POOL_MAX || "20"),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000"),
});

// Test connection and log status
pool.connect()
  .then(client => {
    console.log('✅ Database connection established');
    client.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    console.error('⚠️  Server will start but database operations will fail');
    console.error('💡 Make sure PostgreSQL is running or update DATABASE_URL');
  });

export const db = drizzle({ client: pool, schema });

export async function runTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
  return db.transaction(fn);
}

export async function shutdownDb(): Promise<void> {
  try {
    await pool.end();
    console.log('🔌 Database connections closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
}
