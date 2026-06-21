import { pool } from "../db";
export function cronLog(message: string, source = "cron", level: "info" | "success" | "error" | "warn" = "info") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export type CronJobType = "recurring" | "one-shot" | "daily" | "weekly";
export type ScheduleType = "interval" | "cron" | "daily" | "weekly";

export interface CronJobConfig {
  id: string;
  name: string;
  description?: string;
  jobType: CronJobType;
  scheduleType: ScheduleType;
  intervalMs: number;
  cronExpression?: string;
  enabled: boolean;
  params?: Record<string, any>;
  handler: (job: CronJobRecord, params: Record<string, any>) => Promise<CronJobResult>;
}

export interface CronJobResult {
  success: boolean;
  recordsProcessed?: number;
  recordsAffected?: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface CronJobRecord {
  id: string;
  name: string;
  description: string | null;
  jobType: string;
  scheduleType: string;
  intervalMs: number;
  cronExpression: string | null;
  enabled: boolean;
  lastRunAt: Date | null;
  lastRunDurationMs: number;
  lastRunStatus: string;
  lastRunError: string | null;
  runCount: number;
  consecutiveFailures: number;
  maxFailures: number;
  params: Record<string, any>;
}

const activeTimers: Map<string, NodeJS.Timeout> = new Map();
const jobHandlers: Map<string, (job: CronJobRecord, params: Record<string, any>) => Promise<CronJobResult>> = new Map();

export async function registerCronJob(config: CronJobConfig): Promise<void> {
  jobHandlers.set(config.id, config.handler);

  const existing = await pool.query("SELECT id FROM server_cron_jobs WHERE id = $1", [config.id]);
  if (existing.rows.length === 0) {
    await pool.query(
      `INSERT INTO server_cron_jobs (id, name, description, job_type, schedule_type, interval_ms, cron_expression, enabled, params)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [config.id, config.name, config.description || "", config.jobType, config.scheduleType, config.intervalMs, config.cronExpression || null, config.enabled, JSON.stringify(config.params || {})]
    );
    cronLog(`Registered cron job: ${config.name} (${config.id})`, "cron", "success");
  } else {
    await pool.query(
      `UPDATE server_cron_jobs SET name = $2, description = $3, interval_ms = $4, params = $5, updated_at = now() WHERE id = $1`,
      [config.id, config.name, config.description || "", config.intervalMs, JSON.stringify(config.params || {})]
    );
  }

  if (config.enabled) {
    startCronJob(config.id);
  }
}

export function startCronJob(jobId: string): void {
  if (activeTimers.has(jobId)) {
    clearInterval(activeTimers.get(jobId)!);
  }

  pool.query("SELECT * FROM server_cron_jobs WHERE id = $1 AND enabled = true", [jobId])
    .then(async (result) => {
      if (result.rows.length === 0) return;
      const job = result.rows[0] as CronJobRecord;
      const intervalMs = job.intervalMs || 60000;

      cronLog(`Starting cron job: ${job.name} (every ${Math.round(intervalMs / 1000)}s)`, "cron");

      const timer = setInterval(async () => {
        await executeJob(job.id);
      }, intervalMs);

      activeTimers.set(jobId, timer);

      setTimeout(() => executeJob(jobId), 5000);
    });
}

export function stopCronJob(jobId: string): void {
  const timer = activeTimers.get(jobId);
  if (timer) {
    clearInterval(timer);
    activeTimers.delete(jobId);
    log(`Stopped cron job: ${jobId}`, "cron", "warn");
  }
}

export async function executeJob(jobId: string): Promise<CronJobResult | null> {
  const handler = jobHandlers.get(jobId);
  if (!handler) {
    cronLog(`No handler for cron job: ${jobId}`, "cron", "error");
    return null;
  }

  const result = await pool.query("SELECT * FROM server_cron_jobs WHERE id = $1", [jobId]);
  if (result.rows.length === 0) return null;
  const job = result.rows[0] as CronJobRecord;

  if (!job.enabled) return null;

  const startedAt = new Date();
  const startTime = Date.now();

  try {
    const result = await handler(job, job.params);
    const durationMs = Date.now() - startTime;

    await pool.query(
      `UPDATE server_cron_jobs SET last_run_at = $2, last_run_duration_ms = $3, last_run_status = $4, run_count = run_count + 1, consecutive_failures = 0, updated_at = now() WHERE id = $1`,
      [jobId, startedAt, durationMs, "success"]
    );

    await pool.query(
      `INSERT INTO server_cron_logs (job_id, started_at, finished_at, duration_ms, status, records_processed, records_affected, metadata)
       VALUES ($1, $2, $3, $4, 'success', $5, $6, $7)`,
      [jobId, startedAt, new Date(), durationMs, result.recordsProcessed || 0, result.recordsAffected || 0, JSON.stringify(result.metadata || {})]
    );

    return result;
  } catch (error: any) {
    const durationMs = Date.now() - startTime;

    await pool.query(
      `UPDATE server_cron_jobs SET last_run_at = $2, last_run_duration_ms = $3, last_run_status = 'error', last_run_error = $4, run_count = run_count + 1, consecutive_failures = consecutive_failures + 1, updated_at = now() WHERE id = $1`,
      [jobId, startedAt, durationMs, error.message]
    );

    await pool.query(
      `INSERT INTO server_cron_logs (job_id, started_at, finished_at, duration_ms, status, error_message)
       VALUES ($1, $2, $3, $4, 'error', $5)`,
      [jobId, startedAt, new Date(), durationMs, error.message]
    );

    const updatedJob = await pool.query("SELECT consecutive_failures, max_failures FROM server_cron_jobs WHERE id = $1", [jobId]);
    if (updatedJob.rows[0]?.consecutive_failures >= updatedJob.rows[0]?.max_failures) {
      stopCronJob(jobId);
      await pool.query("UPDATE server_cron_jobs SET enabled = false, updated_at = now() WHERE id = $1", [jobId]);
      cronLog(`Cron job ${jobId} disabled after ${updatedJob.rows[0].consecutive_failures} consecutive failures`, "cron", "error");
    }

    return { success: false, message: error.message };
  }
}

export async function getCronJobs(): Promise<CronJobRecord[]> {
  const result = await pool.query("SELECT * FROM server_cron_jobs ORDER BY name");
  return result.rows as CronJobRecord[];
}

export async function getCronLogs(jobId?: string, limit = 50): Promise<any[]> {
  if (jobId) {
    const result = await pool.query("SELECT * FROM server_cron_logs WHERE job_id = $1 ORDER BY started_at DESC LIMIT $2", [jobId, limit]);
    return result.rows;
  }
  const result = await pool.query("SELECT * FROM server_cron_logs ORDER BY started_at DESC LIMIT $1", [limit]);
  return result.rows;
}

export async function toggleCronJob(jobId: string, enabled: boolean): Promise<boolean> {
  await pool.query("UPDATE server_cron_jobs SET enabled = $2, updated_at = now() WHERE id = $1", [jobId, enabled]);
  if (enabled) {
    startCronJob(jobId);
  } else {
    stopCronJob(jobId);
  }
  return true;
}

export async function recordGameTick(tickType: string, metadata: Record<string, any>): Promise<void> {
  await pool.query(
    `INSERT INTO server_game_ticks (tick_type, started_at, finished_at, duration_ms, players_processed, resources_updated, constructions_completed, turns_generated, errors, metadata)
     VALUES ($1, $2, now(), $3, $4, $5, $6, $7, $8, $9)`,
    [tickType, new Date(), metadata.durationMs || 0, metadata.playersProcessed || 0, metadata.resourcesUpdated || 0, metadata.constructionsCompleted || 0, metadata.turnsGenerated || 0, metadata.errors || 0, JSON.stringify(metadata)]
  );
}

export async function getGameTicks(tickType?: string, limit = 20): Promise<any[]> {
  if (tickType) {
    const result = await pool.query("SELECT * FROM server_game_ticks WHERE tick_type = $1 ORDER BY started_at DESC LIMIT $2", [tickType, limit]);
    return result.rows;
  }
  const result = await pool.query("SELECT * FROM server_game_ticks ORDER BY started_at DESC LIMIT $1", [limit]);
  return result.rows;
}

export async function getTimers(): Promise<any[]> {
  const result = await pool.query("SELECT * FROM server_timers WHERE enabled = true ORDER BY end_time");
  return result.rows;
}

export async function createTimer(id: string, name: string, timerType: string, endTime: Date, intervalMs?: number, maxRepeats?: number, params?: Record<string, any>): Promise<void> {
  await pool.query(
    `INSERT INTO server_timers (id, name, timer_type, end_time, interval_ms, max_repeats, params)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET end_time = $4, params = $7`,
    [id, name, timerType, endTime, intervalMs || 0, maxRepeats || -1, JSON.stringify(params || {})]
  );
}

export async function deleteTimer(id: string): Promise<void> {
  await pool.query("DELETE FROM server_timers WHERE id = $1", [id]);
}

export function shutdownAllCronJobs(): void {
  for (const [jobId, timer] of activeTimers) {
    clearInterval(timer);
  }
  activeTimers.clear();
  cronLog("All cron jobs stopped", "cron", "warn");
}
