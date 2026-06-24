import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { playerStates, users, expeditions } from "../shared/schema";
import { eq, sql } from "drizzle-orm";

const RESOURCE_CLASS_MULTIPLIERS = {
  collector: 1.5,
  general: 1.0,
  discoverer: 2.0,
};

const EXPEDITION_EVENT_WEIGHTS = {
  resourceFound: 35,
  fleetFound: 15,
  alienEncounter: 15,
  blackHole: 5,
  pirateAmbush: 10,
  ancientRuins: 10,
  trader: 5,
  stellarPhenomenon: 5,
};

function rollEvent(): string {
  const total = Object.values(EXPEDITION_EVENT_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const [event, weight] of Object.entries(EXPEDITION_EVENT_WEIGHTS)) {
    roll -= weight;
    if (roll <= 0) return event;
  }
  return "resourceFound";
}

function generateScanResult(baseValue: number, expeditionCount: number, techLevel: number): number {
  const variance = 0.5 + Math.random();
  const countBonus = 1 + Math.min(expeditionCount * 0.01, 0.5);
  const techBonus = 1 + techLevel * 0.02;
  return Math.floor(baseValue * variance * countBonus * techBonus);
}

export function registerOGameExpeditionRoutes(app: Router) {
  app.post("/api/ogame/expedition/launch", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { coordinates, ships, duration } = req.body;
      if (!coordinates || !ships) {
        return res.status(400).json({ error: "coordinates and ships required" });
      }

      const [state] = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const currentFleet = (state.units as Record<string, number>) || {};
      for (const [shipType, count] of Object.entries(ships)) {
        const available = currentFleet[shipType] || 0;
        if (count > available) {
          return res.status(400).json({ error: `Not enough ${shipType}. Available: ${available}` });
        }
        currentFleet[shipType] = available - count;
      }

      await db
        .update(playerStates)
        .set({ units: currentFleet, updatedAt: new Date() })
        .where(eq(playerStates.userId, userId));

      const expeditionHours = Math.max(1, Math.min(8, duration || 1));
      const departureTime = new Date();
      const arrivalTime = new Date(departureTime.getTime() + expeditionHours * 3600 * 1000);

      const [usersRow] = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const research = (state.research as any) || {};
      const expeditionTech = research.expeditionTech || research.astrophysics || 0;
      const targetClass = (state as any).resourceClass || "general";
      const multiplier = RESOURCE_CLASS_MULTIPLIERS[targetClass as keyof typeof RESOURCE_CLASS_MULTIPLIERS] || 1;

      const existingExpeditions = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(expeditions)
        .where(eq(expeditions.userId, userId));

      const expeditionCount = Number(existingExpeditions[0]?.count || 0);

      const eventType = rollEvent();
      const baseValue = 5000 + expeditionCount * 100;
      let result: Record<string, any> = { event: eventType };

      switch (eventType) {
        case "resourceFound": {
          const metal = generateScanResult(baseValue, expeditionCount, expeditionTech);
          const crystal = generateScanResult(Math.floor(baseValue * 0.6), expeditionCount, expeditionTech);
          const deuterium = generateScanResult(Math.floor(baseValue * 0.3), expeditionCount, expeditionTech);
          result.resources = { metal, crystal, deuterium };
          result.message = `Found ${metal.toLocaleString()} metal, ${crystal.toLocaleString()} crystal, and ${deuterium.toLocaleString()} deuterium`;
          break;
        }
        case "fleetFound": {
          const shipTypes = ["smallCargo", "largeCargo", "lightFighter", "cruiser"];
          const foundShips: Record<string, number> = {};
          const numTypes = 1 + Math.floor(Math.random() * 3);
          for (let i = 0; i < numTypes; i++) {
            const type = shipTypes[Math.floor(Math.random() * shipTypes.length)];
            foundShips[type] = Math.floor(Math.random() * 10 * multiplier) + 1;
          }
          result.foundShips = foundShips;
          result.message = `Discovered derelict fleet: ${Object.entries(foundShips).map(([k, v]) => `${v} ${k}`).join(", ")}`;
          break;
        }
        case "alienEncounter": {
          const damage = Math.floor(Math.random() * 0.3 * Object.entries(ships).reduce((s, [, c]) => s + c, 0));
          result.damage = damage;
          result.lostShips = Math.max(1, Math.floor(damage / 10));
          result.message = `Alien encounter! Lost ${result.lostShips} ships`;
          break;
        }
        case "blackHole": {
          const lossRate = 0.3 + Math.random() * 0.5;
          const lostShips: Record<string, number> = {};
          for (const [type, count] of Object.entries(ships)) {
            lostShips[type] = Math.floor((count as number) * lossRate);
          }
          result.lostShips = lostShips;
          result.message = `Black hole! Lost significant fleet portion`;
          break;
        }
        case "pirateAmbush": {
          const combatResult = Math.random() > 0.4 ? "victory" : "defeat";
          result.combatResult = combatResult;
          result.lostShips = combatResult === "defeat" ? Math.floor(Object.entries(ships).reduce((s, [, c]) => s + c, 0) * 0.5) : Math.floor(Object.entries(ships).reduce((s, [, c]) => s + c, 0) * 0.1);
          result.message = `Pirate ambush! ${combatResult === "victory" ? "Defeated pirates" : "Barely escaped"}`;
          break;
        }
        case "ancientRuins": {
          const bonusTech = Math.floor(1 + Math.random() * 5 * multiplier);
          result.technologyPoints = bonusTech;
          result.message = `Found ancient ruins! Gained ${bonusTech} technology points`;
          break;
        }
        case "trader": {
          const tradeAmount = Math.floor(baseValue * 1.5 * multiplier);
          result.tradeOffer = { deuterium: tradeAmount };
          result.message = `Encountered trader offering ${tradeAmount.toLocaleString()} deuterium`;
          break;
        }
        case "stellarPhenomenon": {
          const darkMatter = Math.floor(50 + Math.random() * 200 * multiplier);
          result.darkMatter = darkMatter;
          result.message = `Stellar phenomenon! Collected ${darkMatter} dark matter`;
          break;
        }
      }

      await db.insert(expeditions).values({
        userId,
        name: `Expedition: ${coordinates}`,
        type: "ogame_expedition",
        targetCoords: coordinates,
        status: "completed",
        stats: result,
        attributes: { shipsSent: ships, eventType, expeditionHours, coordinates },
      } as any);

      const survivingShips: Record<string, number> = { ...ships };
      if (result.lostShips) {
        if (typeof result.lostShips === "object") {
          for (const [type, count] of Object.entries(result.lostShips as Record<string, number>)) {
            survivingShips[type] = (survivingShips[type] || 0) - count;
          }
        }
      }

      const finalFleet = (await db
        .select({ units: playerStates.units })
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1)) as any;

      if (finalFleet?.length) {
        const units = (finalFleet[0].units as Record<string, number>) || {};
        for (const [type, count] of Object.entries(survivingShips)) {
          units[type] = (units[type] || 0) + Math.max(0, count);
        }
        if (result.foundShips) {
          for (const [type, count] of Object.entries(result.foundShips as Record<string, number>)) {
            units[type] = (units[type] || 0) + count;
          }
        }
        await db
          .update(playerStates)
          .set({ units, updatedAt: new Date() })
          .where(eq(playerStates.userId, userId));
      }

      res.json({
        success: true,
        result: {
          event: eventType,
          message: result.message,
          details: result,
          expeditionHours,
          coordinates,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/expedition/history", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

      const history = await db
        .select()
        .from(expeditions)
        .where(eq(expeditions.userId, userId))
        .orderBy(sql`${expeditions.createdAt} DESC`)
        .limit(limit);

      res.json({ success: true, history });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/expedition/event-weights", isAuthenticated as any, async (_req: any, res: any) => {
    try {
      res.json({ success: true, weights: EXPEDITION_EVENT_WEIGHTS });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
