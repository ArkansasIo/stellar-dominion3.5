/**
 * Research & Technology Tree API Routes
 * Handles all technology research queries and player research progress
 */

import { Request, Response } from "express";
import {
  techTreeManager,
  getAllTechnologies,
  getTechsByBranch,
  getTechById,
  TECH_PROGRESSION,
  type TechBranch,
} from "@shared/config";
import { storage } from "./storage";

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const getUserId = (req: Request): string => req.session.userId || "";

const getAvailableTechsByLevel = (playerLevel: number) =>
  getAllTechnologies().filter(tech => tech.minimumLevel <= playerLevel);

const getTechsByRarityLocal = (rarity: string) =>
  getAllTechnologies().filter(tech => tech.rarity === rarity);

/**
 * Register all research & technology routes
 */
export function registerResearchRoutes(app: any) {
  // ==== TECH TREE QUERIES ====

  /**
   * GET /api/research/tree/stats
   * Get overall technology tree statistics
   */
  app.get("/api/research/tree/stats", (req: Request, res: Response) => {
    try {
      const stats = techTreeManager.getTreeStatistics();
      res.json({
        totalTechnologies: stats.totalTechs,
        branchBreakdown: stats.byBranch,
        classBreakdown: stats.byClass,
        averageLevelByBranch: stats.averageLevelByBranch,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch tree statistics" });
    }
  });

  /**
   * GET /api/research/tree/branches
   * Get all available research branches
   */
  app.get("/api/research/tree/branches", (req: Request, res: Response) => {
    try {
      const branches: TechBranch[] = [
        "armor",
        "shields",
        "weapons",
        "propulsion",
        "sensors",
        "power",
        "computing",
        "engineering",
        "resources",
        "medical",
        "hyperspace",
      ];

      const branchData = branches.map(branch => {
        const techs = getTechsByBranch(branch);
        return {
          id: branch,
          name: branch.charAt(0).toUpperCase() + branch.slice(1),
          description: getBranchDescription(branch),
          count: techs.length,
          averageLevel: techs.length > 0
            ? Math.round(
              techs.reduce((sum, t) => sum + t.level, 0) / techs.length * 10
            ) / 10
            : 0,
        };
      });

      res.json({ branches: branchData });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });

  /**
   * GET /api/research/tree/branch/:branchId
   * Get all technologies in a specific branch
   */
  app.get(
    "/api/research/tree/branch/:branchId",
    (req: Request, res: Response) => {
      try {
        const { branchId } = req.params;
        const techs = getTechsByBranch(branchId as TechBranch);

        if (techs.length === 0) {
          return res.status(404).json({ message: "Branch not found" });
        }

        // Group by class
        const grouped = groupTechsByClass(techs);

        res.json({
          branch: branchId,
          count: techs.length,
          byClass: grouped,
          techs: techs.map(tech => serializeTech(tech)),
        });
      } catch (error: any) {
        res.status(500).json({ message: "Failed to fetch branch technologies" });
      }
    }
  );

  /**
   * GET /api/research/tech/:techId
   * Get detailed information about a specific technology
   */
  app.get("/api/research/tech/:techId", (req: Request, res: Response) => {
    try {
      const { techId } = req.params;
      const tech = getTechById(techId);

      if (!tech) {
        return res.status(404).json({ message: "Technology not found" });
      }

      const prerequisites = techTreeManager.getPrerequisites(techId);
      const unlocks = techTreeManager.getTechThatUnlock(techId);
      const upgrades = techTreeManager.getAvailableUpgrades(techId);

      res.json({
        ...serializeTech(tech),
        prerequisites: prerequisites.map(t => ({
          id: t.id,
          name: t.name,
          researchCost: t.researchCost,
        })),
        unlocks: unlocks.map(t => ({
          id: t.id,
          name: t.name,
          branch: t.branch,
        })),
        upgrades: upgrades.map(t => ({
          id: t.id,
          name: t.name,
          level: t.level,
          tier: t.tier,
        })),
        totalResearchCostIncludingPrerequisites: techTreeManager.calculateTotalResearchCost(
          techId
        ),
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch technology details" });
    }
  });

  /**
   * GET /api/research/tech/path/:fromId/:toId
   * Get research path between two technologies
   */
  app.get(
    "/api/research/tech/path/:fromId/:toId",
    (req: Request, res: Response) => {
      try {
        const { fromId, toId } = req.params;
        const path = techTreeManager.getResearchPath(fromId, toId);

        if (path.length === 0) {
          return res
            .status(404)
            .json({ message: "No research path found between technologies" });
        }

        const totalCost = techTreeManager.calculateTotalResearchCost(toId);

        res.json({
          from: fromId,
          to: toId,
          pathLength: path.length,
          totalResearchCost: totalCost,
          techs: path.map(tech => ({
            id: tech.id,
            name: tech.name,
            level: tech.level,
            tier: tech.tier,
            researchCost: tech.researchCost,
          })),
        });
      } catch (error: any) {
        res.status(500).json({ message: "Failed to calculate research path" });
      }
    }
  );

  // ==== SEARCH & FILTER ====

  /**
   * GET /api/research/search
   * Search technologies by name or description
   * Query params: q=query, rarity=common|uncommon|rare|epic|legendary
   */
  app.get("/api/research/search", (req: Request, res: Response) => {
    try {
      const { q, rarity } = req.query;

      let results = getAllTechnologies();

      if (q) {
        results = results.filter(
          tech =>
            tech.name.toLowerCase().includes(String(q).toLowerCase()) ||
            tech.description.toLowerCase().includes(String(q).toLowerCase())
        );
      }

      if (rarity) {
        results = results.filter(tech => tech.rarity === rarity);
      }

      res.json({
        query: q || "",
        results: results.slice(0, 50).map(tech => ({
          id: tech.id,
          name: tech.name,
          branch: tech.branch,
          class: tech.class,
          level: tech.level,
          tier: tech.tier,
          rarity: tech.rarity,
        })),
        total: results.length,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to search technologies" });
    }
  });

  /**
   * GET /api/research/available
   * Get technologies available to player at their current level
   * Query params: playerLevel=X
   */
  app.get("/api/research/available", (req: Request, res: Response) => {
    try {
      const playerLevel = Math.max(1, parseInt(req.query.playerLevel as string) || 1);
      const available = getAvailableTechsByLevel(playerLevel);

      res.json({
        playerLevel,
        availableCount: available.length,
        techs: available.slice(0, 100).map(tech => ({
          id: tech.id,
          name: tech.name,
          branch: tech.branch,
          class: tech.class,
          level: tech.level,
          minimumLevel: tech.minimumLevel,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch available technologies" });
    }
  });

  /**
   * GET /api/research/rarity/:rarity
   * Get all technologies of a specific rarity
   */
  app.get(
    "/api/research/rarity/:rarity",
    (req: Request, res: Response) => {
      try {
        const { rarity } = req.params;
        const validRarities = [
          "common",
          "uncommon",
          "rare",
          "epic",
          "legendary",
          "mythic",
        ];

        if (!validRarities.includes(rarity)) {
          return res.status(400).json({ message: "Invalid rarity" });
        }

        const techs = getTechsByRarityLocal(
          rarity as
            | "common"
            | "uncommon"
            | "rare"
            | "epic"
            | "legendary"
            | "mythic"
        );

        res.json({
          rarity,
          count: techs.length,
          techs: techs.map(tech => ({
            id: tech.id,
            name: tech.name,
            branch: tech.branch,
            class: tech.class,
            level: tech.level,
            researchCost: tech.researchCost,
          })),
        });
      } catch (error: any) {
        res.status(500).json({ message: "Failed to fetch technologies by rarity" });
      }
    }
  );

  // ==== PROGRESSION CALCULATIONS ====

  /**
   * POST /api/research/calculate-cost
   * Calculate research cost with level and tier modifiers
   * Body: { level: number, tier: number, branchName: string }
   */
  app.post("/api/research/calculate-cost", (req: Request, res: Response) => {
    try {
      const { level, tier, branchName } = req.body;

      if (!level || !tier || !branchName) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const baseCost = TECH_PROGRESSION.researchCostForTech(
        branchName,
        level,
        tier
      );
      const timeRequired = TECH_PROGRESSION.researchTimeForTech(level, tier);
      const levelMult = TECH_PROGRESSION.levelBonus(level, 1);
      const tierMult = TECH_PROGRESSION.tierBonus(tier, 1);

      res.json({
        level,
        tier,
        baseCost,
        timeRequired,
        levelMultiplier: levelMult,
        tierMultiplier: tierMult,
        combinedMultiplier: levelMult * tierMult,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to calculate cost" });
    }
  });

  /**
   * GET /api/research/starter-techs
   * Get all starting technologies (no prerequisites)
   */
  app.get("/api/research/starter-techs", (req: Request, res: Response) => {
    try {
      const starters = techTreeManager.getStartingTechs();

      res.json({
        count: starters.length,
        techs: starters.map(tech => ({
          id: tech.id,
          name: tech.name,
          branch: tech.branch,
          description: tech.description,
          researchCost: tech.researchCost,
          researchTime: tech.researchTime,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch starter technologies" });
    }
  });

  // ==== PLAYER RESEARCH PROGRESS ====

  /**
   * GET /api/research/player/progress
   * Get player's research progress (requires authentication)
   */
  app.get(
    "/api/research/player/progress",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const state = (await storage.getPlayerState(userId)) as any;

        const researchedTechs = state?.researchedTechnologies || [];
        const currentResearch = state?.currentResearch || null;

        res.json({
          researchedCount: researchedTechs.length,
          currentResearch,
          researchedTechs: researchedTechs.slice(0, 50),
        });
      } catch (error: any) {
        res
          .status(500)
          .json({ message: "Failed to fetch research progress" });
      }
    }
  );

  /**
   * POST /api/research/player/start
   * Start researching a technology
   * Body: { techId: string }
   */
  app.post(
    "/api/research/player/start",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const { techId } = req.body;

        if (!techId) {
          return res.status(400).json({ message: "Missing techId" });
        }

        const tech = getTechById(techId);
        if (!tech) {
          return res.status(404).json({ message: "Technology not found" });
        }

        const state = (await storage.getPlayerState(userId)) as any;
        const researchedTechs = state?.researchedTechnologies || [];

        // Check prerequisites
        const prerequisites = techTreeManager.getPrerequisites(techId);
        const hasAllPrereqs = prerequisites.every(pre =>
          researchedTechs.includes(pre.id)
        );

        if (!hasAllPrereqs) {
          return res.status(400).json({
            message: "Missing prerequisites",
            missingPrerequisites: prerequisites
              .filter(pre => !researchedTechs.includes(pre.id))
              .map(t => t.id),
          });
        }

        const updated = (await storage.updatePlayerState(userId, {
          currentResearch: {
            techId,
            startTurn: state?.currentTurns || 0,
            completionTurn: (state?.currentTurns || 0) + tech.researchTime,
            progress: 0,
          },
        } as any)) as any;

        res.json({
          success: true,
          currentResearch: updated.currentResearch,
          message: `Research started: ${tech.name}`,
        });
      } catch (error: any) {
        res.status(500).json({ message: "Failed to start research" });
      }
    }
  );

  /**
   * POST /api/research/player/complete
   * Complete current research and unlock technology
   * (Typically called when game updates suggest research is complete)
   */
  app.post(
    "/api/research/player/complete",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const state = (await storage.getPlayerState(userId)) as any;

        if (!state?.currentResearch) {
          return res.status(400).json({ message: "No active research" });
        }

        const { techId } = state.currentResearch;
        const researchedTechs = state.researchedTechnologies || [];

        if (researchedTechs.includes(techId)) {
          return res
            .status(400)
            .json({ message: "Technology already researched" });
        }

        const updated = (await storage.updatePlayerState(userId, {
          researchedTechnologies: [...researchedTechs, techId],
          currentResearch: null,
        } as any)) as any;

        const tech = getTechById(techId);
        res.json({
          success: true,
          completedTech: tech?.name,
          researchedCount: updated.researchedTechnologies?.length || 0,
        });
      } catch (error: any) {
        res.status(500).json({ message: "Failed to complete research" });
      }
    }
  );

  /**
   * GET /api/research/player/recommended
   * Get recommended technologies based on player level and researched techs
   */
  app.get(
    "/api/research/player/recommended",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const state = (await storage.getPlayerState(userId)) as any;

        const playerLevel = state?.level || 1;
        const researchedTechs = state?.researchedTechnologies || [];

        // Get available techs not yet researched
        const available = getAvailableTechsByLevel(playerLevel).filter(
          tech => !researchedTechs.includes(tech.id)
        );

        // Filter for those without unsatisfied prerequisites
        const recommended = available.filter(tech => {
          const prereqs = techTreeManager.getPrerequisites(tech.id);
          return prereqs.every(pre => researchedTechs.includes(pre.id));
        });

        res.json({
          playerLevel,
          researchedCount: researchedTechs.length,
          recommendedCount: recommended.length,
          recommendations: recommended.slice(0, 20).map(tech => ({
            id: tech.id,
            name: tech.name,
            branch: tech.branch,
            class: tech.class,
            level: tech.level,
            rarity: tech.rarity,
            researchCost: tech.researchCost,
            researchTime: tech.researchTime,
          })),
        });
      } catch (error: any) {
        res
          .status(500)
          .json({ message: "Failed to fetch recommendations" });
      }
    }
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getBranchDescription(branch: TechBranch): string {
  const descriptions: Record<TechBranch, string> = {
    armor: "Defensive plating and hull reinforcement technologies",
    shields: "Energy shield generation and modulation systems",
    weapons: "Combat offensive systems and weapon technologies",
    propulsion: "Engine and drive system technologies",
    sensors: "Detection and scanning technologies",
    power: "Energy generation and management systems",
    computing: "Computing and AI system technologies",
    engineering: "Structural and mechanical engineering",
    resources: "Resource extraction and processing",
    medical: "Medical and life support systems",
    hyperspace: "FTL and interdimensional travel technologies",
  };

  return descriptions[branch] || "Unknown branch";
}

function groupTechsByClass(techs: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};

  techs.forEach(tech => {
    if (!grouped[tech.class]) {
      grouped[tech.class] = [];
    }
    grouped[tech.class].push(serializeTech(tech));
  });

  return grouped;
}

function serializeTech(tech: any) {
  return {
    id: tech.id,
    name: tech.name,
    branch: tech.branch,
    class: tech.class,
    type: tech.type,
    level: tech.level,
    tier: tech.tier,
    rarity: tech.rarity,
    description: tech.description,
    researchCost: tech.researchCost,
    researchTime: tech.researchTime,
    industrialCost: tech.industrialCost,
    energyCost: tech.energyCost,
    stats: tech.stats,
    bonuses: tech.bonuses,
    penalties: tech.penalties,
    isResearchable: tech.isResearchable,
    minimumLevel: tech.minimumLevel,
  };
}
