/**
 * Research Lab Management API Routes
 * REST endpoints for research queuing, lab management, and research acceleration
 * @tag #api #research #lab #queue #endpoints
 */

import { Request, Response } from "express";
import { ResearchLabService } from "./services/researchLabService";
import { storage } from "./storage";

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const getUserId = (req: Request): string => req.session.userId || "";

/**
 * Register all research lab routes
 */
export function registerResearchLabRoutes(app: any) {
  
  // ==== LAB MANAGEMENT ====
  
  /**
   * GET /api/research/labs
   * Get all available labs for player
   */
  app.get("/api/research/labs", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const labs = await ResearchLabService.getAvailableLabs(userId);

      res.json({
        success: true,
        count: labs.length,
        labs: labs,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch labs",
        error: error.message,
      });
    }
  });

  /**
   * GET /api/research/labs/active
   * Get currently active research lab
   */
  app.get("/api/research/labs/active", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const lab = await ResearchLabService.getActiveLab(userId);

      res.json({
        success: true,
        lab: lab,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch active lab",
        error: error.message,
      });
    }
  });

  /**
   * POST /api/research/labs/switch
   * Switch to a different lab
   * Body: { labId: string }
   */
  app.post("/api/research/labs/switch", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { labId } = req.body;

      if (!labId) {
        return res.status(400).json({ message: "labId required" });
      }

      const success = await ResearchLabService.switchLab(userId, labId);

      res.json({
        success: success,
        message: success ? "Lab switched successfully" : "Failed to switch lab",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to switch lab",
        error: error.message,
      });
    }
  });

  // ==== RESEARCH QUEUE ====

  /**
   * GET /api/research/queue
   * Get current research queue
   */
  app.get("/api/research/queue", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const queue = await ResearchLabService.getResearchQueue(userId);

      res.json({
        success: true,
        count: queue.length,
        queue: queue,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch queue",
        error: error.message,
      });
    }
  });

  /**
   * POST /api/research/queue/add
   * Add technology to research queue
   * Body: { techId: string, priority?: "low" | "normal" | "high" | "critical" }
   */
  app.post("/api/research/queue/add", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { techId, priority = "normal" } = req.body;

      if (!techId) {
        return res.status(400).json({ message: "techId required" });
      }

      const queueItem = await ResearchLabService.queueResearch(userId, techId, priority);

      if (!queueItem) {
        return res.status(400).json({ message: "Failed to queue research" });
      }

      res.json({
        success: true,
        message: "Research added to queue",
        queueItem: queueItem,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to queue research",
        error: error.message,
      });
    }
  });

  /**
   * POST /api/research/queue/remove
   * Remove item from queue
   * Body: { queueItemId: string }
   */
  app.post("/api/research/queue/remove", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { queueItemId } = req.body;

      if (!queueItemId) {
        return res.status(400).json({ message: "queueItemId required" });
      }

      const success = await ResearchLabService.removeFromQueue(userId, queueItemId);

      res.json({
        success: success,
        message: success ? "Item removed from queue" : "Failed to remove item",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to remove from queue",
        error: error.message,
      });
    }
  });

  /**
   * POST /api/research/queue/reorder
   * Reorder queue items
   * Body: { queueItemId: string, newPosition: number }
   */
  app.post("/api/research/queue/reorder", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { queueItemId, newPosition } = req.body;

      if (!queueItemId || newPosition === undefined) {
        return res.status(400).json({ message: "queueItemId and newPosition required" });
      }

      const success = await ResearchLabService.reorderQueue(userId, queueItemId, newPosition);

      res.json({
        success: success,
        message: success ? "Queue reordered" : "Failed to reorder queue",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to reorder queue",
        error: error.message,
      });
    }
  });

  // ==== RESEARCH ACCELERATION ====

  /**
   * POST /api/research/accelerate
   * Speed up active research
   * Body: { queueItemId: string, speedupPercent: 25 | 50 | 75 | 100 }
   */
  app.post("/api/research/accelerate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { queueItemId, speedupPercent } = req.body;

      if (!queueItemId || ![25, 50, 75, 100].includes(speedupPercent)) {
        return res.status(400).json({
          message: "queueItemId and valid speedupPercent (25, 50, 75, 100) required",
        });
      }

      const result = await ResearchLabService.accelerateResearch(
        userId,
        queueItemId,
        speedupPercent
      );

      res.json({
        success: result.success,
        message: result.success
          ? `Research accelerated by ${speedupPercent}%`
          : "Insufficient resources for acceleration",
        totalCost: result.totalCost,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to accelerate research",
        error: error.message,
      });
    }
  });

  // ==== BONUSES & MODIFIERS ====

  /**
   * GET /api/research/bonuses/active
   * Get active research bonuses
   */
  app.get("/api/research/bonuses/active", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const bonuses = await ResearchLabService.getActiveBonuses(userId);

      res.json({
        success: true,
        count: bonuses.length,
        bonuses: bonuses,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch active bonuses",
        error: error.message,
      });
    }
  });

  /**
   * POST /api/research/bonuses/apply
   * Apply a research bonus
   * Body: { bonusId: string }
   */
  app.post("/api/research/bonuses/apply", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { bonusId } = req.body;

      if (!bonusId) {
        return res.status(400).json({ message: "bonusId required" });
      }

      const success = await ResearchLabService.applyBonus(userId, bonusId);

      res.json({
        success: success,
        message: success ? "Bonus applied" : "Failed to apply bonus",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to apply bonus",
        error: error.message,
      });
    }
  });

  // ==== DIAGNOSTICS & STATS ====

  /**
   * GET /api/research/diagnostics
   * Get research lab diagnostics and statistics
   */
  app.get("/api/research/diagnostics", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const diagnostics = await ResearchLabService.getLabDiagnostics(userId);

      if (!diagnostics) {
        return res.status(404).json({ message: "Lab diagnostics not found" });
      }

      res.json({
        success: true,
        diagnostics: diagnostics,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch diagnostics",
        error: error.message,
      });
    }
  });

  /**
   * GET /api/research/speed-multiplier
   * Get current research speed multiplier with all bonuses
   */
  app.get("/api/research/speed-multiplier", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const multiplier = await ResearchLabService.calculateSpeedMultiplier(userId);

      res.json({
        success: true,
        multiplier: multiplier.toFixed(2),
        baseMultiplier: 1.0,
        bonus: (multiplier - 1).toFixed(2),
        percentBonus: ((multiplier - 1) * 100).toFixed(1),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to calculate speed multiplier",
        error: error.message,
      });
    }
  });
}
