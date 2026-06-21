import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const envUrl = process.env.DATABASE_URL || "";
// Auto-fallback to local PostgreSQL if Neon URL is broken (contains neon.tech)
const databaseUrl = envUrl.includes("neon.tech") || !envUrl
  ? "postgresql://postgres:postgres@localhost:5432/stellar_dominion"
  : envUrl;

console.log('🔌 Connecting to database...');

export const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000,
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
