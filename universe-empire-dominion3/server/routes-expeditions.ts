/**
 * Expedition Catalog & Enhanced Expedition Routes
 *
 * Exposes:
 *  GET  /api/expeditions/catalog  – full category/type/tier/level data
 *  GET  /api/expeditions/tiers    – all 99 tiers (optionally filtered)
 *  GET  /api/expeditions/levels   – paginated level progression (1-999)
 */

import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import {
  EXPEDITION_CATEGORIES,
  EXPEDITION_TYPES,
  EXPEDITION_TIERS,
  EXPEDITION_LEVELS,
  TIER_MAP,
  LEVEL_MAP,
} from "../shared/expeditionData";

export function registerExpeditionRoutes(app: Express) {
  const expeditionReadLimiter = (_req: Request, _res: Response, next: () => void) => next();

  // ─── Catalog ─────────────────────────────────────────────────────────────

  /**
   * GET /api/expeditions/catalog
   * Returns all 18 categories (with their 32 sub-categories) and all 7
   * expedition types (with their 5 sub-types each), plus summary counts.
   */
  app.get("/api/expeditions/catalog", expeditionReadLimiter, isAuthenticated, (_req: Request, res: Response) => {
    const subCategoryCount = EXPEDITION_CATEGORIES.reduce(
      (sum, c) => sum + c.subCategories.length, 0
    );
    res.json({
      categories: EXPEDITION_CATEGORIES,
      types: EXPEDITION_TYPES,
      tierCount: EXPEDITION_TIERS.length,
      levelCount: EXPEDITION_LEVELS.length,
      categoryCount: EXPEDITION_CATEGORIES.length,
      subCategoryCount,
    });
  });

  // ─── Tiers ────────────────────────────────────────────────────────────────

  /**
   * GET /api/expeditions/tiers
   * Returns all 99 tiers.  Supports optional query params:
   *   ?tierClass=Master    – filter by tier class
   *   ?minTier=1           – minimum tier number
   *   ?maxTier=99          – maximum tier number
   */
  app.get("/api/expeditions/tiers", expeditionReadLimiter, isAuthenticated, (req: Request, res: Response) => {
    const { tierClass, minTier, maxTier } = req.query as {
      tierClass?: string;
      minTier?: string;
      maxTier?: string;
    };

    let tiers = EXPEDITION_TIERS;

    if (tierClass) {
      tiers = tiers.filter(t => t.tierClass.toLowerCase() === tierClass.toLowerCase());
    }
    if (minTier) {
      const min = parseInt(minTier, 10);
      if (!isNaN(min)) tiers = tiers.filter(t => t.tier >= min);
    }
    if (maxTier) {
      const max = parseInt(maxTier, 10);
      if (!isNaN(max)) tiers = tiers.filter(t => t.tier <= max);
    }

    res.json({ tiers, count: tiers.length });
  });

  /**
   * GET /api/expeditions/tiers/:tier
   * Returns a single tier by number (1-99).
   */
  app.get("/api/expeditions/tiers/:tier", expeditionReadLimiter, isAuthenticated, (req: Request, res: Response) => {
    const tierNum = parseInt(req.params.tier, 10);
    if (isNaN(tierNum) || tierNum < 1 || tierNum > 99) {
      return res.status(400).json({ error: "Tier must be a number between 1 and 99" });
    }
    const tier = TIER_MAP.get(tierNum);
    if (!tier) return res.status(404).json({ error: "Tier not found" });
    res.json(tier);
  });

  // ─── Levels ───────────────────────────────────────────────────────────────

  /**
   * GET /api/expeditions/levels
   * Returns paginated level data.
   *   ?page=1   (default 1)
   *   ?limit=50 (default 50, max 100)
   */
  app.get("/api/expeditions/levels", expeditionReadLimiter, isAuthenticated, (req: Request, res: Response) => {
    const page  = Math.max(1, parseInt((req.query.page  as string) || "1",  10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || "50", 10)));
    const start = (page - 1) * limit;
    const end   = start + limit;

    const slice = EXPEDITION_LEVELS.slice(start, end);
    res.json({
      levels:      slice,
      page,
      limit,
      totalLevels: EXPEDITION_LEVELS.length,
      totalPages:  Math.ceil(EXPEDITION_LEVELS.length / limit),
    });
  });

  /**
   * GET /api/expeditions/levels/:level
   * Returns a single level entry (1-999).
   */
  app.get("/api/expeditions/levels/:level", expeditionReadLimiter, isAuthenticated, (req: Request, res: Response) => {
    const lvl = parseInt(req.params.level, 10);
    if (isNaN(lvl) || lvl < 1 || lvl > 999) {
      return res.status(400).json({ error: "Level must be a number between 1 and 999" });
    }
    const entry = LEVEL_MAP.get(lvl);
    if (!entry) return res.status(404).json({ error: "Level not found" });
    res.json(entry);
  });
}
