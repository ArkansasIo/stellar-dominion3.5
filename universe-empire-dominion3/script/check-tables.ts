import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const r = await pool.query(
  "SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'server_%' OR table_name LIKE 'blueprint_%' ORDER BY table_name"
);
console.log("Tables found:", r.rows.map((x) => x.table_name));
await pool.end();
