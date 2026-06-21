import type { Express, Request, Response } from "express";
import { db } from "./db";
import { messages, playerStates, users } from "../shared/schema";
import { eq } from "drizzle-orm";

// Middleware to check authentication
function isAuthenticated(req: Request, res: Response, next: Function) {
  if ((req as any).session?.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// Espionage configuration
export const ESPIONAGE_CONFIG = {
  // Base success rates
  BASE_SUCCESS_RATE: 0.65,
  
  // Cost per spy mission
  COST_PER_SPY: {
    metal: 100,
    crystal: 100,
    deuterium: 50,
  },

  // Research bonuses
  RESEARCH_BONUSES: {
    espionageTech: 0.05,
  },

  // Defense penalties
  DEFENSE_MULTIPLIERS: {
    perDefenseLevel: 0.01,
  },

  // Intel value (what gets revealed on success)
  INTEL_CATEGORIES: {
    RESOURCES: "resources",
    FLEET: "fleet",
    BUILDINGS: "buildings",
    MISSIONS: "missions",
    RESEARCH: "research",
  },

  // Risk of detection and counter-measures
  DETECTION_MULTIPLIERS: {
    perSpyMission: 0.1,
    baseCatchChance: 0.3,
  },
};

/**
 * Calculate espionage success rate
 * @param attacker Intelligence/Espionage research level
 * @param defender Defense/Counter-espionage research level
 * @param numSpies Number of spies sent
 * @returns Success probability 0-1
 */
export function calculateEspionageSuccessRate(
  attackerEspionage: number = 1,
  defenderIntelligence: number = 1,
  numSpies: number = 1
): number {
  const baseRate = ESPIONAGE_CONFIG.BASE_SUCCESS_RATE;
  
  // Attacker bonus: +5% per espionage tech level
  const attackerBonus = attackerEspionage * 0.05;
  
  // Defender penalty: -1% per intelligence level
  const defenderPenalty = defenderIntelligence * 0.01;
  
  // Scale with number of spies (more spies = higher success, but higher risk)
  const spyScaling = Math.min(0.2, numSpies * 0.05);
  
  // Calculate final rate
  let rate = baseRate + attackerBonus - defenderPenalty + spyScaling;
  
  // Clamp between 0.1 and 0.95
  return Math.max(0.1, Math.min(0.95, rate));
}

/**
 * Calculate detection chance (counter-espionage response)
 * @param successful Whether the initial spy mission succeeded
 * @param defenderSecurityLevel Defense system level
 * @returns Detection probability 0-1
 */
export function calculateDetectionRate(
  successful: boolean,
  defenderSecurityLevel: number = 1
): number {
  if (successful && Math.random() > 0.3) {
    // Successful spies are harder to catch
    return defenderSecurityLevel * 0.02;
  }
  
  // Failed espionage more likely to be detected
  const baseDetection = 0.25 + (defenderSecurityLevel * 0.05);
  return Math.min(0.8, baseDetection);
}

/**
 * Generate intelligence report
 * @param targetState The target player's state
 * @param successRate How successful the spy mission was
 * @param categories Which intelligence categories were accessed
 */
export function generateIntelReport(
  targetState: any,
  successRate: number,
  categories: string[]
): any {
  const report: any = {
    timestamp: Date.now(),
    quality: successRate,
    intel: {},
  };

  if (categories.includes(ESPIONAGE_CONFIG.INTEL_CATEGORIES.RESOURCES)) {
    // Reveal resources with some inaccuracy based on success rate
    const resources = targetState.resources || {};
    report.intel.resources = Object.fromEntries(
      Object.entries(resources).map(([key, value]: [string, any]) => [
        key,
        Math.round(value * (0.8 + successRate * 0.2) + Math.random() * 100 - 50),
      ])
    );
  }

  if (categories.includes(ESPIONAGE_CONFIG.INTEL_CATEGORIES.FLEET)) {
    // Reveal fleet composition
    const units = targetState.units || {};
    report.intel.fleet = Object.fromEntries(
      Object.entries(units).map(([key, value]: [string, any]) => [
        key,
        Math.round(value * (0.8 + successRate * 0.2)),
      ])
    );
  }

  if (categories.includes(ESPIONAGE_CONFIG.INTEL_CATEGORIES.BUILDINGS)) {
    // Reveal building levels
    const buildings = targetState.buildings || {};
    report.intel.buildings = buildings;
  }

  if (categories.includes(ESPIONAGE_CONFIG.INTEL_CATEGORIES.MISSIONS)) {
    // Reveal active missions (if successful enough)
    if (successRate > 0.6) {
      const travelState = targetState.travelState || {};
      report.intel.activeMissions = (travelState.activeMissions || []).length;
    }
  }

  if (categories.includes(ESPIONAGE_CONFIG.INTEL_CATEGORIES.RESEARCH)) {
    // Reveal research progress
    if (successRate > 0.7) {
      const research = targetState.research || {};
      report.intel.research = research;
    }
  }

  return report;
}

export function registerEspionageRoutes(app: Express) {
  
  // Get espionage stats for current player
  app.get("/api/espionage/stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });
      
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }
      
      const research = playerState.research as any || {};
      const travelState = playerState.travelState as any || {};
      
      res.json({
        espionageTech: research.espionageTech || 1,
        counterIntelligence: research.counterIntelligence || 1,
        activeSpyMissions: (travelState.activeSpyMissions || []).length,
        successRate: calculateEspionageSuccessRate(
          research.espionageTech || 1,
          research.counterIntelligence || 1,
          1
        ),
      });
    } catch (error) {
      console.error("Error getting espionage stats:", error);
      res.status(500).json({ error: "Failed to get espionage stats" });
    }
  });

  // Send spy mission
  app.post("/api/espionage/send-spy", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { targetUserId, numSpies, categories } = req.body;

      if (!targetUserId || !numSpies || !categories || !Array.isArray(categories)) {
        return res.status(400).json({ 
          error: "Target user ID, number of spies, and categories array are required" 
        });
      }

      if (numSpies < 1 || numSpies > 50) {
        return res.status(400).json({ error: "Number of spies must be between 1 and 50" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const targetState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, targetUserId),
      });

      if (!targetState) {
        return res.status(404).json({ error: "Target player not found" });
      }

      // Calculate cost
      const totalCost = {
        metal: ESPIONAGE_CONFIG.COST_PER_SPY.metal * numSpies,
        crystal: ESPIONAGE_CONFIG.COST_PER_SPY.crystal * numSpies,
        deuterium: ESPIONAGE_CONFIG.COST_PER_SPY.deuterium * numSpies,
      };

      const resources = playerState.resources as any || {};

      // Check if player has enough resources
      if (
        (resources.metal || 0) < totalCost.metal ||
        (resources.crystal || 0) < totalCost.crystal ||
        (resources.deuterium || 0) < totalCost.deuterium
      ) {
        return res.status(400).json({ 
          error: "Insufficient resources for spy mission",
          required: totalCost,
          available: resources,
        });
      }

      // Deduct resources
      const newResources = {
        ...resources,
        metal: resources.metal - totalCost.metal,
        crystal: resources.crystal - totalCost.crystal,
        deuterium: resources.deuterium - totalCost.deuterium,
      };

      // Calculate success rate
      const research = playerState.research as any || {};
      const targetResearch = targetState.research as any || {};
      const successRate = calculateEspionageSuccessRate(
        research.espionageTech || 1,
        targetResearch.counterIntelligence || 1,
        numSpies
      );

      // Determine if mission succeeds
      const missionSucceeds = Math.random() < successRate;

      // Generate intel report
      const intelReport = missionSucceeds
        ? generateIntelReport(targetState, successRate, categories)
        : { timestamp: Date.now(), success: false, reason: "Mission failed" };

      // Check for detection/counter-espionage
      const detectionRate = calculateDetectionRate(
        missionSucceeds,
        targetResearch.counterIntelligence || 1
      );
      const detected = Math.random() < detectionRate;

      // Store spy mission in travelState
      const travelState = (playerState.travelState as any) || { 
        activeRoute: null, 
        discoveredWormholes: [],
        activeMissions: [],
        activeSpyMissions: [],
      };
      
      if (!travelState.activeSpyMissions) {
        travelState.activeSpyMissions = [];
      }

      const spyMission = {
        id: `spy_${Date.now()}`,
        targetUserId,
        numSpies,
        categories,
        departureTime: Date.now(),
        missionDuration: 5 * 60 * 1000, // 5 minutes
        status: missionSucceeds ? "success" : "failed",
        detected,
        intelReport: missionSucceeds ? intelReport : null,
        successRate,
      };

      travelState.activeSpyMissions.push(spyMission);

      // Save updated state
      await db.update(playerStates)
        .set({
          resources: newResources,
          travelState: travelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // If detected, notify target player (in production, add to notification system)
      if (detected) {
        console.log(`[ESPIONAGE] Spy mission detected! ${userId} -> ${targetUserId}`);

        const targetTravelLog = Array.isArray(targetState.travelLog) ? [...(targetState.travelLog as any[])] : [];
        const [attackerUser] = await db
          .select({ username: users.username })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
        const [targetUser] = await db
          .select({ username: users.username })
          .from(users)
          .where(eq(users.id, targetUserId))
          .limit(1);

        targetTravelLog.unshift({
          id: `counterintel_${Date.now()}`,
          type: "counter-intelligence",
          createdAt: new Date().toISOString(),
          attackerUserId: userId,
          attackerName: attackerUser?.username || "Unknown Commander",
          detected: true,
          numSpies,
          categories,
          success: missionSucceeds,
          summary: `Detected espionage probes from ${attackerUser?.username || "an unknown commander"}.`,
        });

        await db.update(playerStates)
          .set({
            travelLog: targetTravelLog.slice(0, 50),
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, targetUserId));

        await db.insert(messages).values({
          fromUserId: userId,
          toUserId: targetUserId,
          from: "Counter-Intelligence Network",
          to: targetUser?.username || "Commander",
          subject: "Espionage Attempt Detected",
          body: `${attackerUser?.username || "An unknown commander"} attempted to spy on your empire using ${numSpies} probes. Counter-intelligence systems detected the mission.${missionSucceeds ? " Some intelligence may still have been gathered." : " The mission failed before gathering useful intelligence."}`,
          type: "espionage",
          espionageReport: {
            attackerUserId: userId,
            attackerName: attackerUser?.username || "Unknown Commander",
            detected: true,
            numSpies,
            categories,
            missionSucceeded: missionSucceeds,
            timestamp: new Date().toISOString(),
          },
        });
      }

      res.json({
        message: "Spy mission launched",
        missionId: spyMission.id,
        success: missionSucceeds,
        detected,
        costDeducted: totalCost,
        intelGathered: missionSucceeds ? intelReport : null,
      });
    } catch (error) {
      console.error("Error sending spy mission:", error);
      res.status(500).json({ error: "Failed to send spy mission" });
    }
  });

  // Get spy mission results
  app.get("/api/espionage/missions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const travelState = (playerState.travelState as any) || { activeSpyMissions: [] };
      const spyMissions = travelState.activeSpyMissions || [];

      res.json({
        missions: spyMissions,
        count: spyMissions.length,
      });
    } catch (error) {
      console.error("Error getting spy missions:", error);
      res.status(500).json({ error: "Failed to get spy missions" });
    }
  });

  // Get intelligence report for a specific mission
  app.get("/api/espionage/report/:missionId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      const { missionId } = req.params;

      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const travelState = (playerState.travelState as any) || { activeSpyMissions: [] };
      const spyMissions = travelState.activeSpyMissions || [];

      const mission = spyMissions.find((m: any) => m.id === missionId);

      if (!mission) {
        return res.status(404).json({ error: "Mission not found" });
      }

      if (!mission.intelReport) {
        return res.status(400).json({ error: "No intelligence report available" });
      }

      res.json({
        missionId,
        status: mission.status,
        detected: mission.detected,
        timestamp: mission.intelReport.timestamp,
        intel: mission.intelReport.intel,
      });
    } catch (error) {
      console.error("Error getting intelligence report:", error);
      res.status(500).json({ error: "Failed to get intelligence report" });
    }
  });

  // Activate counter-intelligence (defensive measure)
  app.post("/api/espionage/activate-defense", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const research = (playerState.research as any) || {};
      
      // Deduct resources for counter-intelligence defense (scaling with tech level)
      const defenseCost = {
        metal: 500 * (research.counterIntelligence || 1),
        crystal: 300 * (research.counterIntelligence || 1),
        deuterium: 200 * (research.counterIntelligence || 1),
      };

      const resources = playerState.resources as any || {};

      if (
        (resources.metal || 0) < defenseCost.metal ||
        (resources.crystal || 0) < defenseCost.crystal ||
        (resources.deuterium || 0) < defenseCost.deuterium
      ) {
        return res.status(400).json({ 
          error: "Insufficient resources for counter-intelligence",
          required: defenseCost,
          available: resources,
        });
      }

      const newResources = {
        ...resources,
        metal: resources.metal - defenseCost.metal,
        crystal: resources.crystal - defenseCost.crystal,
        deuterium: resources.deuterium - defenseCost.deuterium,
      };

      // Boost counter-intelligence effectiveness for next 10 minutes
      const defenseBoost = {
        active: true,
        activatedAt: Date.now(),
        durationMs: 10 * 60 * 1000,
        multiplier: 1 + (research.counterIntelligence || 1) * 0.1,
      };

      const travelState = (playerState.travelState as any) || {};
      travelState.counterIntelligenceDefense = defenseBoost;

      await db.update(playerStates)
        .set({
          resources: newResources,
          travelState: travelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      res.json({
        message: "Counter-intelligence defense activated",
        costDeducted: defenseCost,
        defense: defenseBoost,
      });
    } catch (error) {
      console.error("Error activating counter-intelligence:", error);
      res.status(500).json({ error: "Failed to activate counter-intelligence" });
    }
  });
}
