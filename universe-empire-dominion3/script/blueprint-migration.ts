import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrations = [
  `CREATE TABLE IF NOT EXISTS blueprint_instances (
    id varchar(64) PRIMARY KEY,
    user_id varchar(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blueprint_definition_id varchar(64) NOT NULL,
    name varchar(128) NOT NULL,
    category varchar(64) NOT NULL,
    rarity varchar(32) NOT NULL DEFAULT 'common',
    level integer NOT NULL DEFAULT 1,
    max_charges integer NOT NULL DEFAULT 12,
    current_charges integer NOT NULL DEFAULT 12,
    status varchar(16) NOT NULL DEFAULT 'active',
    quality real NOT NULL DEFAULT 0.7,
    material_efficiency real NOT NULL DEFAULT 0.8,
    time_efficiency real NOT NULL DEFAULT 0.9,
    total_uses integer NOT NULL DEFAULT 0,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
  );`,
  `CREATE INDEX IF NOT EXISTS idx_bp_instances_user ON blueprint_instances(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_bp_instances_status ON blueprint_instances(status);`,

  `CREATE TABLE IF NOT EXISTS blueprint_printer_jobs (
    id varchar(64) PRIMARY KEY,
    user_id varchar(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blueprint_definition_id varchar(64) NOT NULL,
    status varchar(16) NOT NULL DEFAULT 'queued',
    started_at timestamp,
    complete_at timestamp,
    progress integer NOT NULL DEFAULT 0,
    quality real NOT NULL DEFAULT 0.7,
    created_at timestamp DEFAULT now()
  );`,
  `CREATE INDEX IF NOT EXISTS idx_bp_printer_user ON blueprint_printer_jobs(user_id);`,

  `CREATE TABLE IF NOT EXISTS blueprint_printer_levels (
    user_id varchar(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    printer_level integer NOT NULL DEFAULT 1,
    printer_xp integer NOT NULL DEFAULT 0,
    total_printed integer NOT NULL DEFAULT 0,
    total_repaired integer NOT NULL DEFAULT 0,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
  );`,
];

async function run() {
  console.log("Running blueprint charge/printer migration...");
  for (let i = 0; i < migrations.length; i++) {
    try {
      await pool.query(migrations[i]);
      console.log(`  [${i + 1}/${migrations.length}] OK`);
    } catch (e: any) {
      console.log(`  [${i + 1}/${migrations.length}] ${e.message.includes("already exists") ? "Skip" : e.message}`);
    }
  }
  console.log("Done.");
  await pool.end();
}

run();
