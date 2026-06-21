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
import {
  applyResourceDelta,
  buildExplorationState,
  createExpeditionRecord,
  createStarterRelic,
  normalizeResources,
  resolveExpeditionRecord,
} from "./services/missingFeatureService";
import {
  buildRaidReadiness,
  calculateCommanderRaidPower,
  normalizeRaidCareer,
  resolveCommanderRaidCareer,
  setRaidSpecialization,
  type RaidRole,
} from "./services/raidOperationsService";

// ─── helpers ─────────────────────────────────────────────────────────────────

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

// ─── static catalog seed data ────────────────────────────────────────────────

const SAMPLE_RELICS = [
  { id: "relic-1", name: "Void Crystal", description: "A shard of crystallised dark matter from the edge of the universe.", rarity: "epic", bonuses: { researchSpeed: 10 }, effects: ["Unlocks Dark Matter research"], lore: "Found only at the collapse of ancient stars." },
  { id: "relic-2", name: "Ancient Core", description: "The pulsing core of an extinct war machine.", rarity: "legendary", bonuses: { fleetAttack: 15 }, effects: ["Fleet attack +15%"], lore: "Looted from the ruins of Fortress Zynara." },
  { id: "relic-3", name: "Stellar Shard", description: "A fragment of a neutron star.", rarity: "rare", bonuses: { energyOutput: 8 }, effects: ["Energy production +8%"], lore: "Thrums with residual pulsar energy." },
  { id: "relic-4", name: "Titan Rune", description: "Inscribed by the Titan builders in an age before memory.", rarity: "mythic", bonuses: { allStats: 5 }, effects: ["All stats +5%", "Unlocks Titan Codex"], lore: "Its glyphs shift when no one is watching." },
  { id: "relic-5", name: "Ore Compass", description: "Always points to the richest mineral vein nearby.", rarity: "common", bonuses: { miningYield: 5 }, effects: ["Mining yield +5%"], lore: "Standard issue for frontier prospectors." },
];

type SampleRaidParticipant = {
  playerId: string;
  role: RaidRole;
  joinedAt: string;
};

type SampleRaidRecord = {
  id: string;
  attackingTeamName: string;
  defendingTeamName: string;
  raidType: "guild_war" | "pvp_team" | "boss_raid" | "stronghold_attack";
  status: "preparing" | "active" | "completed";
  attackerLosses: { units: number };
  defenderLosses: { units: number };
  result: "attacker_victory" | "defender_victory" | "tie" | null;
  startedAt: string;
  completedAt?: string;
  minimumCommanders: number;
  maxCommanders: number;
  powerRequirement: number;
  rewards: { credits: number; metal: number; crystal: number };
  participants: SampleRaidParticipant[];
};

const raidState: SampleRaidRecord[] = [
  {
    id: "raid-1",
    attackingTeamName: "Iron Vanguard",
    defendingTeamName: "Nebula Hold",
    raidType: "guild_war",
    status: "active",
    attackerLosses: { units: 120 },
    defenderLosses: { units: 89 },
    result: null,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    minimumCommanders: 3,
    maxCommanders: 6,
    powerRequirement: 2200,
    rewards: { credits: 1400, metal: 5000, crystal: 2200 },
    participants: [
      { playerId: "iron-lead", role: "tank", joinedAt: new Date(Date.now() - 5400000).toISOString() },
      { playerId: "iron-wing", role: "dps", joinedAt: new Date(Date.now() - 5100000).toISOString() },
      { playerId: "iron-med", role: "healer", joinedAt: new Date(Date.now() - 5000000).toISOString() },
    ],
  },
  {
    id: "raid-2",
    attackingTeamName: "Dark Rift",
    defendingTeamName: "Starfall Base",
    raidType: "stronghold_attack",
    status: "completed",
    attackerLosses: { units: 45 },
    defenderLosses: { units: 210 },
    result: "attacker_victory",
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 82800000).toISOString(),
    minimumCommanders: 4,
    maxCommanders: 8,
    powerRequirement: 3400,
    rewards: { credits: 3000, metal: 12000, crystal: 5000 },
    participants: [
      { playerId: "dark-lead", role: "tank", joinedAt: new Date(Date.now() - 90000000).toISOString() },
      { playerId: "dark-ace", role: "dps", joinedAt: new Date(Date.now() - 89900000).toISOString() },
      { playerId: "dark-spark", role: "support", joinedAt: new Date(Date.now() - 89800000).toISOString() },
      { playerId: "dark-heal", role: "healer", joinedAt: new Date(Date.now() - 89700000).toISOString() },
    ],
  },
  {
    id: "raid-3",
    attackingTeamName: "Alpha Squad",
    defendingTeamName: "Beta Crew",
    raidType: "pvp_team",
    status: "preparing",
    attackerLosses: { units: 0 },
    defenderLosses: { units: 0 },
    result: null,
    startedAt: new Date(Date.now() - 600000).toISOString(),
    minimumCommanders: 2,
    maxCommanders: 6,
    powerRequirement: 1600,
    rewards: { credits: 900, metal: 2200, crystal: 900 },
    participants: [],
  },
];

const SAMPLE_EVENTS = [
  { id: "evt-1", name: "Meteor Storm", description: "A dense cloud of asteroids is crossing the sector. Mining yields doubled.", eventClass: "rare", status: "active", participants: 142, rewards: { metal: 5000, crystal: 2000 }, endsAt: new Date(Date.now() + 7200000).toISOString() },
  { id: "evt-2", name: "Solar Flare Warning", description: "Intense solar activity. All energy production boosted by 30%.", eventClass: "common", status: "active", participants: 511, rewards: { energy: 10000 }, endsAt: new Date(Date.now() + 3600000).toISOString() },
  { id: "evt-3", name: "Warp Anomaly", description: "A rift in space-time has been detected. Exploration rewards tripled.", eventClass: "epic", status: "upcoming", participants: 0, rewards: { xp: 500, crystal: 10000 }, startsAt: new Date(Date.now() + 1800000).toISOString() },
  { id: "evt-4", name: "Ancient Titan Resurgence", description: "Titan constructs have been reactivated deep in sector 9. All commanders get +25% XP.", eventClass: "legendary", status: "completed", participants: 892, rewards: {}, endsAt: new Date(Date.now() - 3600000).toISOString() },
];

const eventParticipants = new Map<string, Set<string>>();

async function requirePlayerState(userId: string) {
  const playerState = await storage.getPlayerState(userId);
  if (!playerState) {
    throw new Error("Player state not found");
  }
  return playerState as any;
}

// ─── Raids ────────────────────────────────────────────────────────────────────

export function registerMissingRoutes(app: Express) {
  app.get("/api/raids/commander-profile", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await requirePlayerState(userId);
      res.json(buildRaidReadiness(playerState.commander, playerState.raidCareer));
    } catch {
      res.status(500).json({ error: "Failed to load commander raid profile" });
    }
  });

  app.post("/api/raids/commander-profile/specialization", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const specialization = String(req.body?.specialization || "") as RaidRole;
    if (!["tank", "dps", "healer", "support"].includes(specialization)) {
      return res.status(400).json({ error: "Invalid raid specialization" });
    }
    try {
      const playerState = await requirePlayerState(userId);
      const raidCareer = setRaidSpecialization(playerState.raidCareer, specialization);
      await storage.updatePlayerState(userId, { raidCareer } as any);
      res.json(buildRaidReadiness(playerState.commander, raidCareer));
    } catch {
      res.status(500).json({ error: "Failed to update raid specialization" });
    }
  });

  // GET /api/raids  – list of current and recent raids
  app.get("/api/raids", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    res.json(
      raidState.map((raid) => {
        const joinedPlayers = raid.participants.length;
        const joined = raid.participants.some((participant) => participant.playerId === userId);
        return {
          ...raid,
          joined,
          joinedPlayers,
          canLaunch: raid.status === "preparing" && joinedPlayers >= raid.minimumCommanders,
        };
      })
    );
  });

  // ─── Raid Finder ──────────────────────────────────────────────────────────

  app.post("/api/raids/:raidId/join", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const raid = raidState.find((entry) => entry.id === req.params.raidId);
    const role = (String(req.body?.role || "dps").trim().toLowerCase() || "dps") as RaidRole;

    if (!raid) return res.status(404).json({ error: "Raid not found" });
    if (raid.status !== "preparing") {
      return res.status(400).json({ error: "Only preparing raids can accept new commanders" });
    }
    if (!["tank", "dps", "healer", "support"].includes(role)) {
      return res.status(400).json({ error: "Invalid raid role" });
    }

    const existing = raid.participants.find((participant) => participant.playerId === userId);
    if (existing) {
      existing.role = role;
      return res.json({ success: true, raid, joined: true, updatedRole: true });
    }

    if (raid.participants.length >= raid.maxCommanders) {
      return res.status(400).json({ error: "Raid roster is full" });
    }

    raid.participants.push({
      playerId: userId,
      role,
      joinedAt: new Date().toISOString(),
    });

    res.json({ success: true, raid, joined: true });
  });

  app.post("/api/raids/:raidId/leave", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const raid = raidState.find((entry) => entry.id === req.params.raidId);

    if (!raid) return res.status(404).json({ error: "Raid not found" });
    if (raid.status !== "preparing") {
      return res.status(400).json({ error: "Only preparing raids can remove commanders" });
    }

    raid.participants = raid.participants.filter((participant) => participant.playerId !== userId);
    res.json({ success: true, raid, joined: false });
  });

  app.post("/api/raids/:raidId/launch", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const raid = raidState.find((entry) => entry.id === req.params.raidId);

    if (!raid) return res.status(404).json({ error: "Raid not found" });
    if (raid.status !== "preparing") {
      return res.status(400).json({ error: "Raid is not in preparation" });
    }
    if (!raid.participants.some((participant) => participant.playerId === userId)) {
      return res.status(403).json({ error: "Join the raid before launching it" });
    }
    if (raid.participants.length < raid.minimumCommanders) {
      return res.status(400).json({ error: "Not enough commanders to launch this raid" });
    }

    raid.status = "active";
    raid.startedAt = new Date().toISOString();
    raid.result = null;

    res.json({ success: true, raid, message: "Raid launched successfully" });
  });

  app.post("/api/raids/:raidId/resolve", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const raid = raidState.find((entry) => entry.id === req.params.raidId);

    if (!raid) return res.status(404).json({ error: "Raid not found" });
    if (raid.status !== "active") {
      return res.status(400).json({ error: "Only active raids can be resolved" });
    }
    const participant = raid.participants.find((entry) => entry.playerId === userId);
    if (!participant) {
      return res.status(403).json({ error: "Only participating commanders can resolve this raid" });
    }

    const roleCount = new Set(raid.participants.map((participant) => participant.role)).size;
    const cohesionScore = raid.participants.length + roleCount;
    const attackerVictory = cohesionScore >= raid.minimumCommanders + 2;

    raid.status = "completed";
    raid.result = attackerVictory ? "attacker_victory" : "defender_victory";
    raid.completedAt = new Date().toISOString();
    raid.attackerLosses = { units: Math.max(12, 22 * raid.participants.length - roleCount * 5) };
    raid.defenderLosses = {
      units: attackerVictory
        ? Math.max(30, 44 * raid.participants.length + roleCount * 8)
        : Math.max(18, 16 * raid.participants.length),
    };

    try {
      const playerState = await requirePlayerState(userId);
      const progression = resolveCommanderRaidCareer(playerState.raidCareer, {
        raidId: raid.id,
        raidType: raid.raidType,
        role: participant.role,
        victory: attackerVictory,
        participantCount: raid.participants.length,
        roleDiversity: roleCount,
        attackerLosses: raid.attackerLosses.units,
        defenderLosses: raid.defenderLosses.units,
        baseRewards: raid.rewards,
      });
      const resources = applyResourceDelta(normalizeResources(playerState.resources), progression.rewards);
      const commander = {
        ...(playerState.commander || {}),
        stats: {
          ...((playerState.commander as any)?.stats || {}),
          xp: Number((playerState.commander as any)?.stats?.xp || 0) + progression.rewards.experience,
        },
      };
      await storage.updatePlayerState(userId, {
        resources,
        commander,
        raidCareer: progression.career,
      } as any);

      res.json({
        success: true,
        raid,
        rewards: progression.rewards,
        raidCareer: progression.career,
        resources,
        message: attackerVictory ? "Raid resolved in the attackers' favor" : "Defenders held the line",
      });
    } catch {
      res.status(500).json({ error: "Raid resolved but commander rewards could not be recorded" });
    }
  });

  const raidFinderQueue: any[] = [];

  app.get("/api/raid-finder/queue", isAuthenticated, (req: Request, res: Response) => {
    // Return current queue with player counts per role
    const userId = getUserId(req);
    const roles = ["tank", "dps", "healer", "support"];
    const summary = roles.map(role => ({
      role,
      queued: raidFinderQueue.filter(e => e.preferredRole === role).length,
      avgWait: Math.max(1, Math.ceil(raidFinderQueue.filter(e => e.preferredRole === role).length / 2)),
    }));
    const myEntry = raidFinderQueue.find((entry) => entry.userId === userId) || null;
    const position = myEntry ? raidFinderQueue.findIndex((entry) => entry.userId === userId) + 1 : null;
    res.json({
      queue: raidFinderQueue,
      roleSummary: summary,
      queued: Boolean(myEntry),
      position,
      myEntry,
    });
  });

  app.post("/api/raid-finder/queue", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { preferredRole = "dps" } = req.body as { preferredRole?: string };
    if (!["tank", "dps", "healer", "support"].includes(preferredRole)) {
      return res.status(400).json({ error: "Invalid preferred raid role" });
    }
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

  app.post("/api/raid-finder/match", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const ownEntry = raidFinderQueue.find((entry) => entry.userId === userId);
    if (!ownEntry) return res.status(400).json({ error: "Join the queue before requesting a match" });

    const candidateRaid = raidState.find((raid) =>
      raid.status === "preparing" &&
      raid.participants.length < raid.maxCommanders &&
      !raid.participants.some((participant) => participant.playerId === userId),
    );
    if (!candidateRaid) return res.status(404).json({ error: "No compatible preparing raid is available" });

    try {
      const playerState = await requirePlayerState(userId);
      const power = calculateCommanderRaidPower(playerState.commander, playerState.raidCareer, ownEntry.preferredRole);
      if (power < candidateRaid.powerRequirement) {
        return res.status(400).json({
          error: `Commander raid power ${power.toLocaleString()} is below the ${candidateRaid.powerRequirement.toLocaleString()} requirement`,
        });
      }

      candidateRaid.participants.push({
        playerId: userId,
        role: ownEntry.preferredRole,
        joinedAt: new Date().toISOString(),
      });
      raidFinderQueue.splice(raidFinderQueue.indexOf(ownEntry), 1);
      res.json({
        success: true,
        matched: true,
        raidId: candidateRaid.id,
        raidName: `${candidateRaid.attackingTeamName} vs ${candidateRaid.defendingTeamName}`,
        role: ownEntry.preferredRole,
        commanderPower: power,
      });
    } catch {
      res.status(500).json({ error: "Failed to complete raid matchmaking" });
    }
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
        const starter = createStarterRelic(userId);
        await storage.updatePlayerState(userId, { relicsInventory: [starter] } as any);
        return res.json([starter]);
      }
      res.json(relicsOwned);
    } catch {
      res.json([]);
    }
  });

  app.post("/api/relics/:relicId/equip", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { relicId } = req.params;

    try {
      const playerState = await requirePlayerState(userId);
      const relicsOwned: any[] = Array.isArray(playerState.relicsInventory) ? [...playerState.relicsInventory] : [];
      const relic = relicsOwned.find((entry) => entry.id === relicId || entry.relicId === relicId);

      if (!relic) {
        return res.status(404).json({ error: "Relic not found in inventory" });
      }

      for (const entry of relicsOwned) {
        entry.isEquipped = false;
      }
      relic.isEquipped = true;

      await storage.updatePlayerState(userId, { relicsInventory: relicsOwned } as any);
      res.json({ success: true, relic, relicsInventory: relicsOwned });
    } catch {
      res.status(500).json({ error: "Failed to equip relic" });
    }
  });

  app.post("/api/relics/:relicId/unequip", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { relicId } = req.params;

    try {
      const playerState = await requirePlayerState(userId);
      const relicsOwned: any[] = Array.isArray(playerState.relicsInventory) ? [...playerState.relicsInventory] : [];
      const relic = relicsOwned.find((entry) => entry.id === relicId || entry.relicId === relicId);

      if (!relic) {
        return res.status(404).json({ error: "Relic not found in inventory" });
      }

      relic.isEquipped = false;
      await storage.updatePlayerState(userId, { relicsInventory: relicsOwned } as any);
      res.json({ success: true, relic, relicsInventory: relicsOwned });
    } catch {
      res.status(500).json({ error: "Failed to unequip relic" });
    }
  });

  // ─── Universe Events ──────────────────────────────────────────────────────

  app.get("/api/events", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    res.json(
      SAMPLE_EVENTS.map((event) => ({
        ...event,
        joined: eventParticipants.get(event.id)?.has(userId) ?? false,
        participantLimit: event.eventClass === "legendary" ? 16 : event.eventClass === "epic" ? 12 : 8,
      }))
    );
  });

  app.post("/api/events/:eventId/join", isAuthenticated, (req: Request, res: Response) => {
    const userId = getUserId(req);
    const event = SAMPLE_EVENTS.find((entry) => entry.id === req.params.eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const participants = eventParticipants.get(event.id) ?? new Set<string>();
    participants.add(userId);
    eventParticipants.set(event.id, participants);

    res.json({
      success: true,
      eventId: event.id,
      joined: true,
      participantCount: participants.size,
    });
  });

  // ─── Expeditions ─────────────────────────────────────────────────────────

  app.get("/api/expeditions", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await storage.getPlayerState(userId);
      const expeditions: any[] = (playerState as any)?.expeditions || [];
      res.json({
        expeditions: expeditions.sort((a, b) => String(b.startedAt || "").localeCompare(String(a.startedAt || ""))),
        count: expeditions.length,
      });
    } catch {
      res.json({ expeditions: [], count: 0 });
    }
  });

  app.post("/api/expeditions", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const {
      name,
      type = "exploration",
      subType,
      categoryId,
      subCategoryId,
      tier = 1,
      level = 1,
      rank,
      title,
      targetCoordinates = "0:0:0",
      fleetComposition = {},
      troopComposition = {},
    } = req.body as {
      name?: string;
      type?: string;
      subType?: string;
      categoryId?: string;
      subCategoryId?: string;
      tier?: number;
      level?: number;
      rank?: string;
      title?: string;
      targetCoordinates?: string;
      fleetComposition?: Record<string, number>;
      troopComposition?: Record<string, number>;
    };
    if (!name) return res.status(400).json({ error: "Expedition name is required" });
    const tierNum = Number(tier);
    const levelNum = Number(level);
    if (!Number.isInteger(tierNum) || tierNum < 1 || tierNum > 99) {
      return res.status(400).json({ error: "tier must be an integer between 1 and 99" });
    }
    if (!Number.isInteger(levelNum) || levelNum < 1 || levelNum > 999) {
      return res.status(400).json({ error: "level must be an integer between 1 and 999" });
    }
    try {
      const playerState = await requirePlayerState(userId);
      const expeditions: any[] = Array.isArray(playerState.expeditions) ? [...playerState.expeditions] : [];
      const newExp = createExpeditionRecord({
        id: `exp-${Date.now()}`,
        name,
        type,
        subType,
        categoryId,
        subCategoryId,
        tier: tierNum,
        level: levelNum,
        rank,
        title,
        targetCoordinates,
        fleetComposition,
        troopComposition,
      });
      expeditions.push(newExp);
      await storage.updatePlayerState(userId, { expeditions } as any);
      res.status(201).json(newExp);
    } catch (err) {
      res.status(500).json({ error: "Failed to create expedition" });
    }
  });

  app.get("/api/expeditions/instance/:id", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await requirePlayerState(userId);
      const expeditions: any[] = Array.isArray(playerState.expeditions) ? playerState.expeditions : [];
      const expedition = expeditions.find((entry) => entry.id === req.params.id);
      if (!expedition) {
        return res.status(404).json({ error: "Expedition not found" });
      }
      res.json(expedition);
    } catch {
      res.status(500).json({ error: "Failed to load expedition" });
    }
  });

  app.post("/api/expeditions/:id/launch", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await requirePlayerState(userId);
      const expeditions: any[] = Array.isArray(playerState.expeditions) ? [...playerState.expeditions] : [];
      const expedition = expeditions.find((entry) => entry.id === req.params.id);
      if (!expedition) {
        return res.status(404).json({ error: "Expedition not found" });
      }
      if (expedition.status !== "preparing") {
        return res.status(400).json({ error: "Only preparing expeditions can launch" });
      }

      expedition.status = "in_progress";
      expedition.launchedAt = new Date().toISOString();
      await storage.updatePlayerState(userId, { expeditions } as any);
      res.json({ success: true, expedition });
    } catch {
      res.status(500).json({ error: "Failed to launch expedition" });
    }
  });

  app.post("/api/expeditions/:id/resolve", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await requirePlayerState(userId);
      const expeditions: any[] = Array.isArray(playerState.expeditions) ? [...playerState.expeditions] : [];
      const expeditionIndex = expeditions.findIndex((entry) => entry.id === req.params.id);
      if (expeditionIndex === -1) {
        return res.status(404).json({ error: "Expedition not found" });
      }

      const expedition = expeditions[expeditionIndex];
      if (!["preparing", "in_progress"].includes(String(expedition.status))) {
        return res.status(400).json({ error: "Expedition is already resolved" });
      }

      const resolved = resolveExpeditionRecord(expedition);
      expeditions[expeditionIndex] = resolved;

      const currentResources = normalizeResources(playerState.resources);
      const updatedResources = applyResourceDelta(currentResources, {
        metal: resolved.resources?.metal ?? 0,
        crystal: resolved.resources?.crystal ?? 0,
        deuterium: resolved.resources?.deuterium ?? 0,
        credits: resolved.rewards?.credits ?? 0,
      });

      const commander = (playerState.commander as any) || {};
      const commanderStats = commander.stats || { xp: 0 };
      const updatedCommander = {
        ...commander,
        stats: {
          ...commanderStats,
          xp: Number(commanderStats.xp || 0) + Number(resolved.rewards?.xp || 0),
        },
      };

      await storage.updatePlayerState(userId, {
        expeditions,
        resources: updatedResources,
        commander: updatedCommander,
      } as any);

      res.json({
        success: true,
        expedition: resolved,
        resources: updatedResources,
        commander: updatedCommander,
      });
    } catch {
      res.status(500).json({ error: "Failed to resolve expedition" });
    }
  });

  // ─── Exploration ──────────────────────────────────────────────────────────

  app.get("/api/exploration/state", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const playerState = await storage.getPlayerState(userId);
      const explorationState = buildExplorationState((playerState as any)?.explorationState);
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
      const currentResources = normalizeResources(current.resources);
      await storage.updatePlayerState(userId, {
        resources: applyResourceDelta(currentResources, gained),
      } as any);

      res.json({
        success: true,
        anomalyId,
        anomalyName,
        gained,
        resources: applyResourceDelta(currentResources, gained),
      });
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
      const playerState = await requirePlayerState(userId);
      const currentResources = normalizeResources(playerState.resources);
      if (energyCost > 0 && currentResources.deuterium < energyCost) {
        return res.status(400).json({ error: "Insufficient deuterium" });
      }

      const updatedResources = applyResourceDelta(currentResources, { deuterium: -energyCost });
      if (energyCost > 0) {
        await storage.updatePlayerState(userId, { resources: updatedResources } as any);
      }

      res.json({
        success: true,
        gateId,
        gateName,
        action,
        resources: updatedResources,
        message: action === "jump" ? "Warp jump completed" : "Gate captured",
      });
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
      const explState = buildExplorationState(current.explorationState);

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
      const currentResources = normalizeResources(current.resources);
      const updatedResources = applyResourceDelta(currentResources, gain);
      const commander = current.commander || {};
      const commanderStats = commander.stats || { xp: 0 };
      const updatedCommander = {
        ...commander,
        stats: {
          ...commanderStats,
          xp: Number(commanderStats.xp || 0) + gain.xp,
        },
      };

      await storage.updatePlayerState(userId, {
        resources: updatedResources,
        commander: updatedCommander,
        explorationState: explState,
      } as any);

      res.json({ success: true, questId, gain, resources: updatedResources, commander: updatedCommander });
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
      const explState = buildExplorationState(current.explorationState);

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
      const currentResources = normalizeResources(current.resources);
      const updatedResources = applyResourceDelta(currentResources, gain);

      await storage.updatePlayerState(userId, {
        resources: updatedResources,
        explorationState: explState,
      } as any);

      res.json({ success: true, debrisId, debrisName, gain, resources: updatedResources });
    } catch {
      res.status(500).json({ error: "Failed to harvest debris" });
    }
  });

  // ─── Missions ─────────────────────────────────────────────────────────────

  app.get("/api/missions/:id", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params;
    try {
      const playerState = await requirePlayerState(userId);
      const travelState = (playerState as any)?.travelState || {};
      const activeMissions: any[] = travelState.activeMissions || [];
      const mission = activeMissions.find((m: any) => m.id === id);
      if (!mission) return res.status(404).json({ error: "Mission not found" });
      res.json(mission);
    } catch {
      res.status(500).json({ error: "Failed to load mission" });
    }
  });

  app.patch("/api/missions/:id", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params;

    try {
      const playerState = await requirePlayerState(userId);
      const travelState = (playerState as any)?.travelState || { activeRoute: null, discoveredWormholes: [], activeMissions: [] };
      const activeMissions: any[] = Array.isArray(travelState.activeMissions) ? [...travelState.activeMissions] : [];
      const missionIndex = activeMissions.findIndex((mission) => mission?.id === id);

      if (missionIndex === -1) {
        return res.status(404).json({ error: "Mission not found" });
      }

      const updates = req.body || {};
      const allowedStatus = new Set(["outbound", "holding", "return", "completed", "cancelled"]);
      const nextMission = { ...activeMissions[missionIndex] };

      if (typeof updates.target === "string" && updates.target.trim()) {
        nextMission.target = updates.target.trim();
      }
      if (typeof updates.destination === "string" && updates.destination.trim()) {
        nextMission.destination = updates.destination.trim();
      }
      if (typeof updates.processed === "boolean") {
        nextMission.processed = updates.processed;
      }
      if (typeof updates.status === "string" && allowedStatus.has(updates.status)) {
        nextMission.status = updates.status;
      }

      for (const field of ["arrivalTime", "returnTime", "departureTime"] as const) {
        if (updates[field] !== undefined) {
          const nextValue = Number(updates[field]);
          if (!Number.isFinite(nextValue) || nextValue <= 0) {
            return res.status(400).json({ error: `Invalid ${field}` });
          }
          nextMission[field] = nextValue;
        }
      }

      activeMissions[missionIndex] = nextMission;
      travelState.activeMissions = activeMissions;

      await storage.updatePlayerState(userId, { travelState } as any);
      res.json({ success: true, mission: nextMission });
    } catch {
      res.status(500).json({ error: "Failed to update mission" });
    }
  });
}
