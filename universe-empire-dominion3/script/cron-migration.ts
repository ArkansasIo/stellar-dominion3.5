import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrations = [
  // Core cron jobs table with full tracking
  `CREATE TABLE IF NOT EXISTS server_cron_jobs (
    id varchar(64) PRIMARY KEY,
    name varchar(128) NOT NULL,
    description text,
    job_type varchar(32) NOT NULL DEFAULT 'recurring',
    schedule_type varchar(32) NOT NULL DEFAULT 'interval',
    interval_ms integer NOT NULL DEFAULT 60000,
    cron_expression varchar(64),
    enabled boolean NOT NULL DEFAULT true,
    last_run_at timestamp,
    last_run_duration_ms integer DEFAULT 0,
    last_run_status varchar(16) DEFAULT 'success',
    last_run_error text,
    run_count integer NOT NULL DEFAULT 0,
    consecutive_failures integer NOT NULL DEFAULT 0,
    max_failures integer NOT NULL DEFAULT 5,
    params jsonb NOT NULL DEFAULT '{}',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
  );`,

  // Cron execution logs
  `CREATE TABLE IF NOT EXISTS server_cron_logs (
    id serial PRIMARY KEY,
    job_id varchar(64) NOT NULL REFERENCES server_cron_jobs(id),
    job_name varchar(128),
    started_at timestamp NOT NULL DEFAULT now(),
    finished_at timestamp,
    completed_at timestamp,
    duration_ms integer,
    status varchar(16) NOT NULL DEFAULT 'running',
    records_processed integer DEFAULT 0,
    records_affected integer DEFAULT 0,
    error_message text,
    error text,
    output jsonb DEFAULT '{}',
    metadata jsonb DEFAULT '{}'
  );`,

  // Cron logs indices
  `CREATE INDEX IF NOT EXISTS idx_cron_logs_job_id ON server_cron_logs(job_id);`,
  `CREATE INDEX IF NOT EXISTS idx_cron_logs_started_at ON server_cron_logs(started_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_cron_logs_status ON server_cron_logs(status);`,

  // Game tick history for performance tracking
  `CREATE TABLE IF NOT EXISTS server_game_ticks (
    id serial PRIMARY KEY,
    tick_type varchar(32) NOT NULL,
    tick_number bigint NOT NULL DEFAULT 0,
    started_at timestamp NOT NULL DEFAULT now(),
    finished_at timestamp,
    completed_at timestamp,
    duration_ms integer,
    players_processed integer DEFAULT 0,
    resources_updated integer DEFAULT 0,
    constructions_completed integer DEFAULT 0,
    turns_generated integer DEFAULT 0,
    expeditions_processed integer DEFAULT 0,
    missions_processed integer DEFAULT 0,
    raids_processed integer DEFAULT 0,
    trades_settled integer DEFAULT 0,
    errors integer DEFAULT 0,
    metadata jsonb DEFAULT '{}'
  );`,

  // Game ticks indices
  `CREATE INDEX IF NOT EXISTS idx_game_ticks_type ON server_game_ticks(tick_type);`,
  `CREATE INDEX IF NOT EXISTS idx_game_ticks_started_at ON server_game_ticks(started_at DESC);`,

  // Timer management for delayed jobs
  `CREATE TABLE IF NOT EXISTS server_timers (
    id varchar(64) PRIMARY KEY,
    job_id varchar(64) REFERENCES server_cron_jobs(id),
    name varchar(128) NOT NULL,
    timer_type varchar(32) NOT NULL DEFAULT 'countdown',
    start_time timestamp NOT NULL DEFAULT now(),
    end_time timestamp NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    expires_at timestamp,
    interval_ms integer,
    repeat_count integer DEFAULT 0,
    max_repeats integer DEFAULT -1,
    current_repeat integer DEFAULT 0,
    enabled boolean NOT NULL DEFAULT true,
    last_fired_at timestamp,
    params jsonb NOT NULL DEFAULT '{}',
    metadata jsonb DEFAULT '{}'
  );`,

  // Timer indices
  `CREATE INDEX IF NOT EXISTS idx_timers_expires_at ON server_timers(expires_at);`,
  `CREATE INDEX IF NOT EXISTS idx_timers_enabled ON server_timers(enabled);`,
  `CREATE INDEX IF NOT EXISTS idx_timers_job_id ON server_timers(job_id);`,

  // Cron job execution statistics for monitoring
  `CREATE TABLE IF NOT EXISTS server_cron_stats (
    id serial PRIMARY KEY,
    job_id varchar(64) NOT NULL REFERENCES server_cron_jobs(id),
    total_runs integer DEFAULT 0,
    successful_runs integer DEFAULT 0,
    failed_runs integer DEFAULT 0,
    total_duration_ms bigint DEFAULT 0,
    avg_duration_ms integer DEFAULT 0,
    max_duration_ms integer DEFAULT 0,
    min_duration_ms integer DEFAULT 0,
    last_30_day_runs integer DEFAULT 0,
    last_updated timestamp DEFAULT now()
  );`,

  `CREATE INDEX IF NOT EXISTS idx_cron_stats_job_id ON server_cron_stats(job_id);`,

  // Job categories for organization
  `CREATE TABLE IF NOT EXISTS server_cron_categories (
    id serial PRIMARY KEY,
    job_id varchar(64) NOT NULL REFERENCES server_cron_jobs(id),
    category varchar(32) NOT NULL,
    subcategory varchar(64),
    priority integer DEFAULT 100,
    created_at timestamp DEFAULT now()
  );`,

  `CREATE INDEX IF NOT EXISTS idx_cron_categories_job_id ON server_cron_categories(job_id);`,
  `CREATE INDEX IF NOT EXISTS idx_cron_categories_category ON server_cron_categories(category);`,
];

async function run() {
  console.log("Running cron/timer migration...");
  for (let i = 0; i < migrations.length; i++) {
    const sql = migrations[i];
    try {
      await pool.query(sql);
      console.log(`  [${i + 1}/${migrations.length}] OK`);
    } catch (e: any) {
      if (e.message.includes("already exists")) {
        console.log(`  [${i + 1}/${migrations.length}] Skip (exists)`);
      } else {
        console.error(`  [${i + 1}/${migrations.length}] Error: ${e.message}`);
      }
    }
  }
  console.log("Migration complete.");
  await pool.end();
}

run();
