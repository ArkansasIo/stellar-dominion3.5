import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { playerStates } from "../Source/Shared/schema";
import { eq } from "drizzle-orm";
import { OGAME_CATALOG_ENTRY_MAP } from "../Source/Shared/config/ogameCatalogConfig";

const MOON_FACILITY_IDS = ["lunarBase", "sensorPhalanx", "jumpGate", "lunarShipyard"];

interface MoonFacilityState {
  [facilityId: string]: number;
}

interface MoonsData {
  [moonId: string]: {
    facilities?: MoonFacilityState;
    name?: string;
    diameter?: number;
  };
}

export function registerOGameMoonFacilityRoutes(app: Router) {
  app.get("/api/ogame/moon/facilities/:moonId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { moonId } = req.params;

      const [state] = await db
        .select({ moonsData: playerStates.moonsData })
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Player state not found" });

      const moonsData = (state.moonsData as MoonsData) || {};
      const moon = moonsData[moonId];
      if (!moon) return res.status(404).json({ error: "Moon not found" });

      const facilities = moon.facilities || {};

      const availableFacilities = MOON_FACILITY_IDS.map((id) => {
        const def = OGAME_CATALOG_ENTRY_MAP[id];
        const level = facilities[id] || 0;
        return {
          id,
          name: def?.name || id,
          description: def?.description || "",
          level,
          baseCost: def?.baseCost || {},
          growthFactor: def?.growthFactor || 2,
          nextCost: def?.baseCost
            ? Object.fromEntries(
                Object.entries(def.baseCost).map(([key, val]) => [key, Math.floor((val as number) * Math.pow(def.growthFactor || 2, level))])
              )
            : {},
          baseTimeSeconds: def?.baseTimeSeconds || 600,
          buildTime: Math.floor((def?.baseTimeSeconds || 600) * Math.pow(def?.growthFactor || 2, level)),
          prerequisites: def?.prerequisites || {},
          stats: def?.stats || {},
          isMoonOnly: def?.isMoonOnly || false,
        };
      });

      res.json({ success: true, moonId, facilities: availableFacilities });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/moon/build/:moonId/:facilityId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { moonId, facilityId } = req.params;
      if (!MOON_FACILITY_IDS.includes(facilityId)) {
        return res.status(400).json({ error: "Invalid facility ID" });
      }

      const def = OGAME_CATALOG_ENTRY_MAP[facilityId];
      if (!def) return res.status(404).json({ error: "Facility definition not found" });

      const [state] = await db
        .select({ moonsData: playerStates.moonsData, resources: playerStates.resources, buildings: playerStates.buildings })
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Player state not found" });

      const moonsData = (state.moonsData as MoonsData) || {};
      const moon = moonsData[moonId];
      if (!moon) return res.status(404).json({ error: "Moon not found" });

      const facilities = moon.facilities || {};
      const currentLevel = facilities[facilityId] || 0;

      // Check prerequisites
      const prereqs = def.prerequisites || {};
      const buildings = (state.buildings as Record<string, number>) || {};
      for (const [reqId, reqLevel] of Object.entries(prereqs)) {
        const buildingLevel = buildings[reqId] ?? 0;
        const moonFacLevel = facilities[reqId] ?? 0;
        if (Math.max(buildingLevel, moonFacLevel) < (reqLevel as number)) {
          return res.status(400).json({
            error: `Prerequisite not met: ${reqId} level ${reqLevel} required (current: ${Math.max(buildingLevel, moonFacLevel)})`,
          });
        }
      }

      // Calculate cost
      const costMultiplier = Math.pow(def.growthFactor || 2, currentLevel);
      const costs: Record<string, number> = {};
      const resourceTypes = ["metal", "crystal", "deuterium"];
      for (const rt of resourceTypes) {
        const base = (def.baseCost as any)?.[rt] || 0;
        if (base > 0) costs[rt] = Math.floor(base * costMultiplier);
      }

      // Deduct resources
      const resources = (state.resources as Record<string, number>) || {};
      for (const [rt, cost] of Object.entries(costs)) {
        if ((resources[rt] || 0) < cost) {
          return res.status(400).json({ error: `Not enough ${rt}. Need ${cost}, have ${resources[rt] || 0}` });
        }
        resources[rt] = (resources[rt] || 0) - cost;
      }

      // Build
      facilities[facilityId] = currentLevel + 1;
      moon.facilities = facilities;
      moonsData[moonId] = moon;

      await db
        .update(playerStates)
        .set({
          moonsData: moonsData as any,
          resources: resources as any,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      res.json({
        success: true,
        message: `${def.name} upgraded to level ${currentLevel + 1}`,
        facilityId,
        level: currentLevel + 1,
        costs,
        nextCost: def.baseCost
          ? Object.fromEntries(
              Object.entries(def.baseCost).map(([key, val]) => [
                key,
                Math.floor((val as number) * Math.pow(def.growthFactor || 2, currentLevel + 1)),
              ])
            )
          : {},
        buildTime: Math.floor((def.baseTimeSeconds || 600) * Math.pow(def.growthFactor || 2, currentLevel + 1)),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
