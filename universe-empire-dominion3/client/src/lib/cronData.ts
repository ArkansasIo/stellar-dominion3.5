export interface CronJob {
  id: string;
  name: string;
  interval: number;
  lastRun: number;
  enabled: boolean;
  type: "system" | "user" | "maintenance";
  description: string;
}

export async function fetchCronJobs(): Promise<CronJob[]> {
  try {
    const res = await fetch("/api/cron/jobs", { credentials: "include" });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.success || !data.jobs) return [];

    return data.jobs.map((job: any) => ({
      id: job.id,
      name: job.name,
      interval: job.interval_ms || 60000,
      lastRun: job.last_run_at ? new Date(job.last_run_at).getTime() : Date.now(),
      enabled: job.enabled,
      type: mapJobType(job.job_type),
      description: job.description || "",
    }));
  } catch {
    return [];
  }
}

function mapJobType(jobType: string): "system" | "user" | "maintenance" {
  if (jobType === "daily" || jobType === "weekly") return "maintenance";
  return "system";
}

export const DEFAULT_CRON_JOBS: CronJob[] = [];
