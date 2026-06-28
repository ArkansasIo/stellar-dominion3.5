import type { Express, Request, Response } from "express";
import {
  ALL_CIVILIZATION_JOBS,
  getJobsByDomain,
  getJobsByClass,
  getJobsByRarity,
  getUniqueClasses,
  getUniqueSubClasses,
  getUniqueJobTypes,
  getUniqueSubTypes,
  getUniqueUnitTypes,
  calculateWorkforceProjection,
} from "@shared/config/civilizationJobsConfig";

export function registerCivilizationRoutes(app: Express) {
  // ─── Civilization Jobs Catalog ─────────────────────────────────────────────

  /**
   * GET /api/config/civilization-jobs
   * Returns the complete catalog of civilization jobs
   */
  app.get("/api/config/civilization-jobs", (_req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        total: ALL_CIVILIZATION_JOBS.length,
        items: ALL_CIVILIZATION_JOBS,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch civilization jobs" });
    }
  });

  /**
   * GET /api/config/civilization-jobs/meta
   * Returns metadata about civilization jobs
   */
  app.get("/api/config/civilization-jobs/meta", (_req: Request, res: Response) => {
    try {
      const civilJobs = ALL_CIVILIZATION_JOBS.filter((j) => j.domain === "civilization");
      const militaryJobs = ALL_CIVILIZATION_JOBS.filter((j) => j.domain === "military");

      res.json({
        success: true,
        meta: {
          total: ALL_CIVILIZATION_JOBS.length,
          domains: {
            civilization: civilJobs.length,
            military: militaryJobs.length,
          },
          classes: getUniqueClasses(),
          subClasses: getUniqueSubClasses(),
          jobTypes: getUniqueJobTypes(),
          subTypes: getUniqueSubTypes(),
          unitTypes: getUniqueUnitTypes(),
          rarities: ["common", "uncommon", "rare", "epic", "legendary"],
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch civilization jobs metadata" });
    }
  });

  /**
   * GET /api/config/civilization-jobs/by-domain/:domain
   * Returns jobs filtered by domain (civilization or military)
   */
  app.get("/api/config/civilization-jobs/by-domain/:domain", (req: Request, res: Response) => {
    try {
      const { domain } = req.params;

      if (domain !== "civilization" && domain !== "military") {
        return res.status(400).json({ success: false, message: "Invalid domain" });
      }

      const jobs = getJobsByDomain(domain as "civilization" | "military");
      res.json({
        success: true,
        domain,
        total: jobs.length,
        items: jobs,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch jobs by domain" });
    }
  });

  /**
   * GET /api/config/civilization-jobs/by-class/:className
   * Returns jobs filtered by class (Administration, Manufacturing, etc.)
   */
  app.get("/api/config/civilization-jobs/by-class/:className", (req: Request, res: Response) => {
    try {
      const { className } = req.params;
      const jobs = getJobsByClass(decodeURIComponent(className));

      res.json({
        success: true,
        class: className,
        total: jobs.length,
        items: jobs,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch jobs by class" });
    }
  });

  /**
   * GET /api/config/civilization-jobs/by-rarity/:rarity
   * Returns jobs filtered by rarity
   */
  app.get("/api/config/civilization-jobs/by-rarity/:rarity", (req: Request, res: Response) => {
    try {
      const { rarity } = req.params;
      const rarities = ["common", "uncommon", "rare", "epic", "legendary"];

      if (!rarities.includes(rarity)) {
        return res.status(400).json({ success: false, message: "Invalid rarity" });
      }

      const jobs = getJobsByRarity(rarity as "common" | "uncommon" | "rare" | "epic" | "legendary");
      res.json({
        success: true,
        rarity,
        total: jobs.length,
        items: jobs,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch jobs by rarity" });
    }
  });

  /**
   * POST /api/config/civilization-jobs/projection
   * Calculates workforce projections for a given assignment
   */
  app.post("/api/config/civilization-jobs/projection", (req: Request, res: Response) => {
    try {
      const { assignments } = req.body;

      if (!Array.isArray(assignments)) {
        return res.status(400).json({ success: false, message: "Assignments must be an array" });
      }

      const projection = calculateWorkforceProjection(assignments);

      res.json({
        success: true,
        projection,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to calculate projection" });
    }
  });

  /**
   * GET /api/config/civilization-jobs/:jobId
   * Returns a specific job by ID
   */
  app.get("/api/config/civilization-jobs/:jobId", (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const job = ALL_CIVILIZATION_JOBS.find((j) => j.id === jobId);

      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      res.json({
        success: true,
        job,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch job" });
    }
  });

  /**
   * GET /api/config/civilization-jobs/search?q=query
   * Searches jobs by name or description
   */
  app.get("/api/config/civilization-jobs/search", (req: Request, res: Response) => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        return res.status(400).json({ success: false, message: "Query parameter required" });
      }

      const query = q.toLowerCase();
      const results = ALL_CIVILIZATION_JOBS.filter(
        (job) =>
          job.name.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.class.toLowerCase().includes(query) ||
          job.jobType.toLowerCase().includes(query),
      );

      res.json({
        success: true,
        query: q,
        total: results.length,
        items: results,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to search jobs" });
    }
  });
}
