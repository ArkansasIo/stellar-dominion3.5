import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as NodePgPool } from 'pg';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

console.log('🔌 Connecting to database...');

const databaseUrl = process.env.DATABASE_URL;
const isNeonUrl = databaseUrl.includes('neon.tech') || databaseUrl.includes('neon.database');

// Neon serverless URLs require websocket transport, while local/standard Postgres should use node-postgres.
const neonPool = new NeonPool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000,
});

const nodePool = new NodePgPool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000,
});

const activePool = isNeonUrl ? neonPool : nodePool;

// Expose a stable pool surface for existing code that uses `pool.query(...)`.
export const pool = activePool as unknown as NodePgPool;

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

export const db = isNeonUrl
  ? drizzleNeon({ client: neonPool, schema })
  : drizzleNode({ client: nodePool, schema });
