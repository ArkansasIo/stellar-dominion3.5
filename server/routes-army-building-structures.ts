/**
 * Army Building Structures API Routes
 * Endpoints for browsing the catalog, constructing, upgrading, and demolishing
 * army building structures (18 categories, 32 subcategories, tiers 1-99, levels 1-999).
 * @tag #api #military #army #structures #buildings #rest #routes
 */

import type { Express } from 'express';
import { isAuthenticated } from './basicAuth';
import { ArmyBuildingStructuresService } from './services/armyBuildingStructuresService';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: coerce a query/body value to a bounded integer
// ─────────────────────────────────────────────────────────────────────────────

function boundedInt(raw: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

// ─────────────────────────────────────────────────────────────────────────────
// Route registration
// ─────────────────────────────────────────────────────────────────────────────

export function registerArmyBuildingStructuresRoutes(app: Express): void {
  // ──────────────────────────────────────────────────────────────────────────
  // CATALOG  (public – no auth required)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * GET /api/army/building-structures
   * List all army building structure archetypes from the catalog.
   */
  app.get('/api/army/building-structures', (_req, res) => {
    try {
      const archetypes = ArmyBuildingStructuresService.getAllArchetypes();
      res.json({
        success: true,
        data: archetypes,
        count: archetypes.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/meta
   * Return catalog metadata: category counts, tier/level ranges, class lists, etc.
   */
  app.get('/api/army/building-structures/meta', (_req, res) => {
    try {
      const meta = ArmyBuildingStructuresService.getMeta();
      res.json({ success: true, data: meta });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/tier-classes
   * Return the tier class / subclass / rank / title system (tiers 1-99).
   */
  app.get('/api/army/building-structures/tier-classes', (_req, res) => {
    try {
      const tierClasses = ArmyBuildingStructuresService.getTierClasses();
      res.json({ success: true, data: tierClasses, count: tierClasses.length });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/level-config
   * Return the level progression configuration (min/max levels, scale factors).
   */
  app.get('/api/army/building-structures/level-config', (_req, res) => {
    try {
      const config = ArmyBuildingStructuresService.getLevelConfig();
      res.json({ success: true, data: config });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/categories
   * Return all archetypes grouped by the 18 categories.
   */
  app.get('/api/army/building-structures/categories', (_req, res) => {
    try {
      const grouped = ArmyBuildingStructuresService.getArchetypesByCategory();
      const categories = Object.keys(grouped);
      res.json({
        success: true,
        data: grouped,
        categories,
        count: categories.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/subcategories
   * Return all archetypes grouped by the 32 subcategories.
   */
  app.get('/api/army/building-structures/subcategories', (_req, res) => {
    try {
      const grouped = ArmyBuildingStructuresService.getArchetypesBySubCategory();
      const subCategories = Object.keys(grouped);
      res.json({
        success: true,
        data: grouped,
        subCategories,
        count: subCategories.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/available?level=<1-999>
   * Get archetypes whose unlockLevel is ≤ the given player level.
   */
  app.get('/api/army/building-structures/available', (req, res) => {
    try {
      const playerLevel = boundedInt(req.query.level, 1, 999, 1);
      const archetypes = ArmyBuildingStructuresService.getAvailableArchetypes(playerLevel);
      res.json({
        success: true,
        data: archetypes,
        count: archetypes.length,
        playerLevel,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/preview-stats?archetypeId=<id>&tier=<1-99>&level=<1-999>
   * Preview computed stats for a given archetype at a specific tier and level.
   */
  app.get('/api/army/building-structures/preview-stats', (req, res) => {
    try {
      const { archetypeId } = req.query;
      if (!archetypeId || typeof archetypeId !== 'string') {
        return res.status(400).json({ success: false, error: 'Missing archetypeId' });
      }
      const tier = boundedInt(req.query.tier, 1, 99, 1);
      const level = boundedInt(req.query.level, 1, 999, 1);
      const result = ArmyBuildingStructuresService.previewStats(archetypeId, tier, level);
      if (!result.success) {
        return res.status(404).json(result);
      }
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/:archetypeId
   * Get a single archetype by ID.
   */
  app.get('/api/army/building-structures/:archetypeId', (req, res) => {
    try {
      const { archetypeId } = req.params;
      const archetype = ArmyBuildingStructuresService.getArchetypeById(archetypeId);
      if (!archetype) {
        return res.status(404).json({
          success: false,
          error: `Archetype '${archetypeId}' not found`,
        });
      }
      res.json({ success: true, data: archetype });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // PLAYER STRUCTURES  (authenticated)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * GET /api/army/building-structures/my/summary
   * Get a summary of the authenticated player's entire building infrastructure.
   */
  app.get('/api/army/building-structures/my/summary', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const summary = ArmyBuildingStructuresService.getStructureSummary(playerId);
      res.json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/my/structures
   * List all structures owned by the authenticated player.
   */
  app.get('/api/army/building-structures/my/structures', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const structures = ArmyBuildingStructuresService.getPlayerStructures(playerId);
      res.json({ success: true, data: structures, count: structures.length });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * GET /api/army/building-structures/my/structures/by-category?category=<name>
   * Filter the authenticated player's structures by category.
   */
  app.get(
    '/api/army/building-structures/my/structures/by-category',
    isAuthenticated,
    (req, res) => {
      try {
        const playerId = (req as any).user?.id || 'anonymous';
        const { category } = req.query;
        if (!category || typeof category !== 'string') {
          return res.status(400).json({ success: false, error: 'Missing category' });
        }
        const structures = ArmyBuildingStructuresService.getPlayerStructuresByCategory(
          playerId,
          category,
        );
        res.json({ success: true, data: structures, count: structures.length, category });
      } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
      }
    },
  );

  /**
   * GET /api/army/building-structures/my/structures/by-subcategory?subCategory=<name>
   * Filter the authenticated player's structures by subcategory.
   */
  app.get(
    '/api/army/building-structures/my/structures/by-subcategory',
    isAuthenticated,
    (req, res) => {
      try {
        const playerId = (req as any).user?.id || 'anonymous';
        const { subCategory } = req.query;
        if (!subCategory || typeof subCategory !== 'string') {
          return res.status(400).json({ success: false, error: 'Missing subCategory' });
        }
        const structures = ArmyBuildingStructuresService.getPlayerStructuresBySubCategory(
          playerId,
          subCategory,
        );
        res.json({
          success: true,
          data: structures,
          count: structures.length,
          subCategory,
        });
      } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
      }
    },
  );

  /**
   * GET /api/army/building-structures/my/structures/:structureId
   * Get a single player-owned structure by instance ID.
   */
  app.get(
    '/api/army/building-structures/my/structures/:structureId',
    isAuthenticated,
    (req, res) => {
      try {
        const playerId = (req as any).user?.id || 'anonymous';
        const { structureId } = req.params;
        const structure = ArmyBuildingStructuresService.getPlayerStructureById(
          playerId,
          structureId,
        );
        if (!structure) {
          return res.status(404).json({
            success: false,
            error: `Structure '${structureId}' not found`,
          });
        }
        res.json({ success: true, data: structure });
      } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
      }
    },
  );

  /**
   * POST /api/army/building-structures/construct
   * Construct a new army building structure.
   *
   * Body: { archetypeId: string, tier?: number, level?: number }
   */
  app.post('/api/army/building-structures/construct', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { archetypeId, tier, level } = req.body;

      if (!archetypeId) {
        return res.status(400).json({ success: false, error: 'Missing archetypeId' });
      }

      const startTier = boundedInt(tier, 1, 99, 1);
      const startLevel = boundedInt(level, 1, 999, 1);

      const result = ArmyBuildingStructuresService.constructStructure(
        playerId,
        archetypeId,
        startTier,
        startLevel,
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json({
        success: true,
        message: result.message,
        structure: result.structure,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  /**
   * PUT /api/army/building-structures/my/structures/:structureId/upgrade/level
   * Upgrade a structure's level.
   *
   * Body: { targetLevel: number }
   */
  app.put(
    '/api/army/building-structures/my/structures/:structureId/upgrade/level',
    isAuthenticated,
    (req, res) => {
      try {
        const playerId = (req as any).user?.id || 'anonymous';
        const { structureId } = req.params;
        const { targetLevel } = req.body;

        if (targetLevel === undefined) {
          return res.status(400).json({ success: false, error: 'Missing targetLevel' });
        }

        const result = ArmyBuildingStructuresService.upgradeStructureLevel(
          playerId,
          structureId,
          boundedInt(targetLevel, 1, 999, 1),
        );

        if (!result.success) {
          return res.status(400).json(result);
        }

        res.json({ success: true, message: result.message, structure: result.structure });
      } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
      }
    },
  );

  /**
   * PUT /api/army/building-structures/my/structures/:structureId/upgrade/tier
   * Upgrade a structure's tier.
   *
   * Body: { targetTier: number }
   */
  app.put(
    '/api/army/building-structures/my/structures/:structureId/upgrade/tier',
    isAuthenticated,
    (req, res) => {
      try {
        const playerId = (req as any).user?.id || 'anonymous';
        const { structureId } = req.params;
        const { targetTier } = req.body;

        if (targetTier === undefined) {
          return res.status(400).json({ success: false, error: 'Missing targetTier' });
        }

        const result = ArmyBuildingStructuresService.upgradeStructureTier(
          playerId,
          structureId,
          boundedInt(targetTier, 1, 99, 1),
        );

        if (!result.success) {
          return res.status(400).json(result);
        }

        res.json({
          success: true,
          message: result.message,
          structure: result.structure,
          tierClass: result.tierClass,
        });
      } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
      }
    },
  );

  /**
   * PUT /api/army/building-structures/my/structures/:structureId/operational
   * Toggle operational status of a structure.
   *
   * Body: { operational: boolean }
   */
  app.put(
    '/api/army/building-structures/my/structures/:structureId/operational',
    isAuthenticated,
    (req, res) => {
      try {
        const playerId = (req as any).user?.id || 'anonymous';
        const { structureId } = req.params;
        const { operational } = req.body;

        if (typeof operational !== 'boolean') {
          return res.status(400).json({
            success: false,
            error: 'Missing or invalid operational flag (must be boolean)',
          });
        }

        const result = ArmyBuildingStructuresService.setOperational(
          playerId,
          structureId,
          operational,
        );

        if (!result.success) {
          return res.status(404).json(result);
        }

        res.json({ success: true, message: result.message, structure: result.structure });
      } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
      }
    },
  );

  /**
   * DELETE /api/army/building-structures/my/structures/:structureId
   * Demolish (permanently remove) a structure.
   */
  app.delete(
    '/api/army/building-structures/my/structures/:structureId',
    isAuthenticated,
    (req, res) => {
      try {
        const playerId = (req as any).user?.id || 'anonymous';
        const { structureId } = req.params;

        const result = ArmyBuildingStructuresService.demolishStructure(
          playerId,
          structureId,
        );

        if (!result.success) {
          return res.status(404).json(result);
        }

        res.json({ success: true, message: result.message });
      } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
      }
    },
  );
}
