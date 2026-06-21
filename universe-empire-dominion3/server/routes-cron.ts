import type { Express, Request, Response } from "express";
import {
  getCronJobs,
  getCronLogs,
  toggleCronJob,
  executeJob,
  getGameTicks,
  getTimers,
  createTimer,
  deleteTimer,
} from "./services/cronService";
import { isAuthenticated, isAdmin } from "./basicAuth";

export function registerCronRoutes(app: Express) {
  app.get("/api/cron/jobs", isAuthenticated, isAdmin, async (_req: Request, res: Response) => {
    try {
      const jobs = await getCronJobs();
      res.json({ success: true, jobs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cron/jobs/:jobId/toggle", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const { enabled } = req.body;
      await toggleCronJob(jobId, enabled);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cron/jobs/:jobId/run", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const result = await executeJob(jobId);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/cron/logs", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const jobId = req.query.jobId as string | undefined;
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await getCronLogs(jobId, limit);
      res.json({ success: true, logs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/cron/ticks", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const tickType = req.query.type as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const ticks = await getGameTicks(tickType, limit);
      res.json({ success: true, ticks });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/cron/timers", isAuthenticated, isAdmin, async (_req: Request, res: Response) => {
    try {
      const timers = await getTimers();
      res.json({ success: true, timers });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cron/timers", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { id, name, timerType, endTime, intervalMs, maxRepeats, params } = req.body;
      await createTimer(id, name, timerType, new Date(endTime), intervalMs, maxRepeats, params);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cron/timers/:timerId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      await deleteTimer(req.params.timerId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
