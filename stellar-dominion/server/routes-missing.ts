/**
 * Routes for features that had no backend handlers, causing 404s:
 *   /api/raids
 *   /api/raid-finder/*
 *   /api/relics + /api/relics/inventory
 *   /api/events
 *   /api/expeditions
 *   /api/exploration/*
 *   /api/missions/:id
 */

import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

// ─── helpers ─────────────────────────────────────────────────────────────────

function uid(userId: string) {
  return (req: Request) => (req.session as any)?.userId ?? userId;
}

function getUserId(req: Request): string {
  return (req.session as any)?.userId as string;
}

// ─── static catalog seed data ────────────────────────────────────────────────

const SAMPLE_RELICS = [
  { id: "relic-1", name: "Void Crystal", description: "A shard of crystallised dark matter from the edge of the universe.", rarity: "epic", bonuses: { researchSpeed: 10 }, effects: ["Unlocks Dark Matter research"], lore: "Found only at the collapse of ancient stars." },
  { id: "relic-2", name: "Ancient Core", description: "The pulsing core of an extinct war machine.", rarity: "legendary", bonuses: { fleetAttack: 15 }, effects: ["Fleet attack +15%"], lore: "Looted from the ruins of Fortress Zynara." },
  { id: "relic-3", name: "Stellar Shard", description: "A fragment of a neutron star.", rarity: "rare", bonuses: { energyOutput: 8 }, effects: ["Energy production +8%"], lore: "Thrums with residual pulsar energy." },
  { id: "relic-4", name: "Titan Rune", description: "Inscribed by the Titan builders in an age before memory.", rarity: "mythic", bonuses: { allStats: 5 }, effects: ["All stats +5%", "Unlocks Titan Codex"], lore: "Its glyphs shift when no one is watching." },
  { id: "relic-5", name: "Ore Compass", description: "Always points to the richest mineral vein nearby.", rarity: "common", bonuses: { miningYield: 5 }, effects: ["Mining yield +5%"], lore: "Standard issue for frontier prospectors." },
];

const SAMPLE_RAIDS = [
  { id: "raid-1", attackingTeamName: "Iron Vanguard", defendingTeamName: "Nebula Hold", raidType: "guild_war", status: "active", attackerLosses: { units: 120 }, defenderLosses: { units: 89 }, result: null, startedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "raid-2", attackingTeamName: "Dark Rift", defendingTeamName: "Starfall Base", raidType: "stronghold_attack", status: "completed", attackerLosses: { units: 45 }, defenderLosses: { units: 210 }, result: "attacker_victory", startedAt: new Date(Date.now() - 86400000).toISOString(), completedAt: new Date(Date.now() - 82800000).toISOString() },
  { id: "raid-3", attackingTeamName: "Alpha Squad", defendingTeamName: "Beta Crew", raidType: "pvp_team", status: "preparing", attackerLosses: { units: 0 }, defenderLosses: { units: 0 }, result: null, startedAt: new Date(Date.now() - 600000).toISOString() },
];

const SAMPLE_EVENTS = [
  { id: "evt-1", name: "Meteor Storm", description: "A dense cloud of asteroids is crossing the sector. Mining yields doubled.", eventClass: "rare", status: "active", participants: 142, rewards: { metal: 5000, crystal: 2000 }, endsAt: new Date(Date.now() + 7200000).toISOString() },
  { id: "evt-2", name: "Solar Flare Warning", description: "Intense solar activity. All energy production boosted by 30%.", eventClass: "common", status: "active", participants: 511, rewards: { energy: 10000 }, endsAt: new Date(Date.now() + 3600000).toISOString() },
  { id: "evt-3", name: "Warp Anomaly", description: "A rift in space-time has been detected. Exploration rewards tripled.", eventClass: "epic", status: "upcoming", participants: 0, rewards: { xp: 500, crystal: 10000 }, startsAt: new Date(Date.now() + 1800000).toISOString() },
  { id: "evt-4", name: "Ancient Titan Resurgence", description: "Titan constructs have been reactivated deep in sector 9. All commanders get +25% XP.", eventClass: "legendary", status: "completed", participants: 892, rewards: {}, endsAt: new Date(Date.now() - 3600000).toISOString() },
];

// ─── Raids ────────────────────────────────────────────────────────────────────

export function registerMissingRoutes(app: Express) {
  // GET /api/raids  – list of current and recent raids
  app.get("/api/raids", isAuthenticated, (_req: Request, res: Response) => {
    res.json(SAMPLE_RAIDS);
  });

  // ─── Raid Finder ──────────────────────────────────────────────────────────

  const raidFinderQueue: any[] = [];

  app.get("/api/raid-finder/queue", isAuthenticated, (_req: Request, res: Response) => {
    // Return current queue with player counts per role
    const roles = ["tank", "dps", "healer", "support"];
    const summary = roles.map(role => ({
      role,
      queued: raidFinderQueue.filter(e => e.preferredRole === role).length,
      avgWait: Math.floor(Math.random() * 5) + 1,
    }));
    res.json({ queue: raidFinderQueue, roleSummary: summary });
  });

  app.post("/api/raid-finder/queue", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { preferredRole = "dps" } = req.body as { preferredRole?: string };
    const existing = raidFinderQueue.findIndex(e => e.userId === userId);
    if (existing >= 0) {
      raidFinderQueue[existing].preferredRole = preferredRole;
      return res.json({ queued: true, position: existing + 1, preferredRole });
    }
    raidFinderQueue.push({ userId, preferredRole, joinedAt: new Date().toISOString() });
    res.json({ queued: true, position: raidFinderQueue.length, preferredRole });
  });

  app.delete("/api/raid-finder/queue", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const idx = raidFinderQueue.findIndex(e => e.userId === userId);
    if (idx >= 0) raidFinderQueue.splice(idx, 1);
    res.json({ queued: false });
  });

  // ─── Relics ───────────────────────────────────────────────────────────────

  app.get("/api/relics", isAuthenticated, (_req: Request, res: Response) => {
    res.json(SAMPLE_RELICS);
  });

  app.get("/api/relics/inventory", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await storage.getPlayerState(userId);
      const relicsOwned: any[] = (playerState as any)?.relicsInventory || [];
      if (relicsOwned.length === 0) {
        // Seed a starting relic so the inventory is not empty
        const starter = { id: `owned-${userId}-1`, relicId: "relic-3", name: "Stellar Shard", condition: 90, isEquipped: false, acquiredAt: new Date().toISOString() };
        return res.json([starter]);
      }
      res.json(relicsOwned);
    } catch {
      res.json([]);
    }
  });

  // ─── Universe Events ──────────────────────────────────────────────────────

  app.get("/api/events", isAuthenticated, (_req: Request, res: Response) => {
    res.json(SAMPLE_EVENTS);
  });

  // ─── Expeditions ─────────────────────────────────────────────────────────

  app.get("/api/expeditions", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await storage.getPlayerState(userId);
      const expeditions: any[] = (playerState as any)?.expeditions || [];
      res.json({ expeditions, count: expeditions.length });
    } catch {
      res.json({ expeditions: [], count: 0 });
    }
  });

  app.post("/api/expeditions", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { name, type = "exploration", targetCoordinates = "0:0:0" } = req.body as { name?: string; type?: string; targetCoordinates?: string };
    if (!name) return res.status(400).json({ error: "Expedition name is required" });
    try {
      const playerState = await storage.getPlayerState(userId);
      const expeditions: any[] = (playerState as any)?.expeditions || [];
      const newExp = {
        id: `exp-${Date.now()}`,
        name,
        type,
        targetCoordinates,
        status: "preparing",
        fleetComposition: {},
        troopComposition: {},
        discoveries: [],
        casualties: {},
        resources: {},
        startedAt: new Date().toISOString(),
      };
      expeditions.push(newExp);
      await storage.updatePlayerState(userId, { expeditions } as any);
      res.status(201).json(newExp);
    } catch (err) {
      res.status(500).json({ error: "Failed to create expedition" });
    }
  });

  // ─── Exploration ──────────────────────────────────────────────────────────

  app.get("/api/exploration/state", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await storage.getPlayerState(userId);
      const explorationState = (playerState as any)?.explorationState || { claimedQuestIds: [], harvestedDebrisIds: [] };
      res.json(explorationState);
    } catch {
      res.json({ claimedQuestIds: [], harvestedDebrisIds: [] });
    }
  });

  app.post("/api/exploration/scan", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { anomalyId, anomalyName, hazardLevel = 1, rewards } = req.body as {
      anomalyId: string;
      anomalyName: string;
      hazardLevel?: number;
      rewards?: { metal?: number; crystal?: number; deuterium?: number };
    };
    if (!anomalyId) return res.status(400).json({ error: "anomalyId is required" });

    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ error: "Player state not found" });

      const baseReward = rewards || {};
      const multiplier = Math.max(1, hazardLevel);
      const gained = {
        metal:    Math.floor((baseReward.metal    || 200) * multiplier),
        crystal:  Math.floor((baseReward.crystal  || 100) * multiplier),
        deuterium:Math.floor((baseReward.deuterium || 50) * multiplier),
      };

      const current = playerState as any;
      await storage.updatePlayerState(userId, {
        metal:     (Number(current.metal)     || 0) + gained.metal,
        crystal:   (Number(current.crystal)   || 0) + gained.crystal,
        deuterium: (Number(current.deuterium) || 0) + gained.deuterium,
      } as any);

      res.json({ success: true, anomalyId, anomalyName, gained });
    } catch (err) {
      res.status(500).json({ error: "Failed to process scan" });
    }
  });

  app.post("/api/exploration/warp-action", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { gateId, gateName, action, energyCost = 0 } = req.body as {
      gateId: string;
      gateName: string;
      action: "jump" | "capture";
      energyCost?: number;
    };
    if (!gateId || !action) return res.status(400).json({ error: "gateId and action are required" });

    try {
      const playerState = await storage.getPlayerState(userId);
      const current = playerState as any;
      if (energyCost > 0) {
        const newEnergy = Math.max(0, (Number(current.energy) || 0) - energyCost);
        await storage.updatePlayerState(userId, { energy: newEnergy } as any);
      }

      res.json({ success: true, gateId, gateName, action, message: action === "jump" ? "Warp jump completed" : "Gate captured" });
    } catch {
      res.status(500).json({ error: "Failed to process warp action" });
    }
  });

  app.post("/api/exploration/quest-claim", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { questId, rewards } = req.body as {
      questId: string;
      rewards?: { metal?: number; crystal?: number; deuterium?: number; xp?: number };
    };
    if (!questId) return res.status(400).json({ error: "questId is required" });

    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const current = playerState as any;
      const explState = current.explorationState || { claimedQuestIds: [], harvestedDebrisIds: [] };

      if (explState.claimedQuestIds.includes(questId)) {
        return res.status(409).json({ error: "Quest already claimed" });
      }

      const gain = {
        metal:    rewards?.metal    || 300,
        crystal:  rewards?.crystal  || 150,
        deuterium:rewards?.deuterium|| 75,
        xp:       rewards?.xp      || 50,
      };

      explState.claimedQuestIds.push(questId);

      await storage.updatePlayerState(userId, {
        metal:     (Number(current.metal)     || 0) + gain.metal,
        crystal:   (Number(current.crystal)   || 0) + gain.crystal,
        deuterium: (Number(current.deuterium) || 0) + gain.deuterium,
        explorationState: explState,
      } as any);

      res.json({ success: true, questId, gain });
    } catch {
      res.status(500).json({ error: "Failed to claim quest reward" });
    }
  });

  app.post("/api/exploration/debris-harvest", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { debrisId, debrisName, resources, harvestProgress = 100 } = req.body as {
      debrisId: string;
      debrisName: string;
      resources?: { metal?: number; crystal?: number; deuterium?: number };
      harvestProgress?: number;
    };
    if (!debrisId) return res.status(400).json({ error: "debrisId is required" });

    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const current = playerState as any;
      const explState = current.explorationState || { claimedQuestIds: [], harvestedDebrisIds: [] };

      if (explState.harvestedDebrisIds.includes(debrisId)) {
        return res.status(409).json({ error: "Debris already harvested" });
      }

      const ratio = Math.min(1, harvestProgress / 100);
      const gain = {
        metal:    Math.floor((resources?.metal    || 500) * ratio),
        crystal:  Math.floor((resources?.crystal  || 200) * ratio),
        deuterium:Math.floor((resources?.deuterium|| 100) * ratio),
      };

      explState.harvestedDebrisIds.push(debrisId);

      await storage.updatePlayerState(userId, {
        metal:     (Number(current.metal)     || 0) + gain.metal,
        crystal:   (Number(current.crystal)   || 0) + gain.crystal,
        deuterium: (Number(current.deuterium) || 0) + gain.deuterium,
        explorationState: explState,
      } as any);

      res.json({ success: true, debrisId, debrisName, gain });
    } catch {
      res.status(500).json({ error: "Failed to harvest debris" });
    }
  });

  // ─── Missions ─────────────────────────────────────────────────────────────

  app.get("/api/missions/:id", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params;
    try {
      const playerState = await storage.getPlayerState(userId);
      const travelState = (playerState as any)?.travelState || {};
      const activeMissions: any[] = travelState.activeMissions || [];
      const mission = activeMissions.find((m: any) => m.id === id);
      if (!mission) return res.status(404).json({ error: "Mission not found" });
      res.json(mission);
    } catch {
      res.status(500).json({ error: "Failed to load mission" });
    }
  });
}
