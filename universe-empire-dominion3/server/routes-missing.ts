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

function castRaid(dbRaid: any): SampleRaidRecord {
  return {
    id: dbRaid.id,
    attackingTeamName: dbRaid.attackingTeamName || "",
    defendingTeamName: dbRaid.defendingTeamName || "",
    raidType: (dbRaid.raidType || "guild_war") as SampleRaidRecord["raidType"],
    status: (dbRaid.status || "preparing") as SampleRaidRecord["status"],
    attackerLosses: dbRaid.attackerLosses || { units: 0 },
    defenderLosses: dbRaid.defenderLosses || { units: 0 },
    result: dbRaid.result || null,
    startedAt: dbRaid.startedAt instanceof Date ? dbRaid.startedAt.toISOString() : (dbRaid.startedAt || new Date().toISOString()),
    completedAt: dbRaid.completedAt instanceof Date ? dbRaid.completedAt.toISOString() : dbRaid.completedAt || undefined,
    minimumCommanders: dbRaid.minimumCommanders || 2,
    maxCommanders: dbRaid.maxCommanders || 6,
    powerRequirement: dbRaid.powerRequirement || 0,
    rewards: dbRaid.rewards || { credits: 0, metal: 0, crystal: 0 },
    participants: (dbRaid.participants as SampleRaidParticipant[]) || [],
  };
}

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
  app.get("/api/raids", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const allRaids = await storage.getAllRaids();
      res.json(
        allRaids.map((dbRaid) => {
          const raid = castRaid(dbRaid);
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
    } catch {
      res.json([]);
    }
  });

  // ─── Raid Finder ──────────────────────────────────────────────────────────

  app.post("/api/raids/:raidId/join", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const role = (String(req.body?.role || "dps").trim().toLowerCase() || "dps") as RaidRole;

    if (!["tank", "dps", "healer", "support"].includes(role)) {
      return res.status(400).json({ error: "Invalid raid role" });
    }

    try {
      const dbRaid = await storage.getRaidById(req.params.raidId);
      if (!dbRaid) return res.status(404).json({ error: "Raid not found" });

      const raid = castRaid(dbRaid);
      if (raid.status !== "preparing") {
        return res.status(400).json({ error: "Only preparing raids can accept new commanders" });
      }

      const existing = raid.participants.find((participant) => participant.playerId === userId);
      if (existing) {
        existing.role = role;
        await storage.updateRaid(raid.id, { participants: raid.participants } as any);
        return res.json({ success: true, raid: { ...raid, participants: raid.participants }, joined: true, updatedRole: true });
      }

      if (raid.participants.length >= raid.maxCommanders) {
        return res.status(400).json({ error: "Raid roster is full" });
      }

      const updatedParticipants = [
        ...raid.participants,
        { playerId: userId, role, joinedAt: new Date().toISOString() },
      ];
      await storage.updateRaid(raid.id, { participants: updatedParticipants } as any);

      const updatedRaid = { ...raid, participants: updatedParticipants };
      res.json({ success: true, raid: updatedRaid, joined: true });
    } catch {
      res.status(500).json({ error: "Failed to join raid" });
    }
  });

  app.post("/api/raids/:raidId/leave", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);

    try {
      const dbRaid = await storage.getRaidById(req.params.raidId);
      if (!dbRaid) return res.status(404).json({ error: "Raid not found" });

      const raid = castRaid(dbRaid);
      if (raid.status !== "preparing") {
        return res.status(400).json({ error: "Only preparing raids can remove commanders" });
      }

      const updatedParticipants = raid.participants.filter((participant) => participant.playerId !== userId);
      await storage.updateRaid(raid.id, { participants: updatedParticipants } as any);

      res.json({ success: true, raid: { ...raid, participants: updatedParticipants }, joined: false });
    } catch {
      res.status(500).json({ error: "Failed to leave raid" });
    }
  });

  app.post("/api/raids/:raidId/launch", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);

    try {
      const dbRaid = await storage.getRaidById(req.params.raidId);
      if (!dbRaid) return res.status(404).json({ error: "Raid not found" });

      const raid = castRaid(dbRaid);
      if (raid.status !== "preparing") {
        return res.status(400).json({ error: "Raid is not in preparation" });
      }
      if (!raid.participants.some((participant) => participant.playerId === userId)) {
        return res.status(403).json({ error: "Join the raid before launching it" });
      }
      if (raid.participants.length < raid.minimumCommanders) {
        return res.status(400).json({ error: "Not enough commanders to launch this raid" });
      }

      await storage.updateRaid(raid.id, {
        status: "active",
        startedAt: new Date(),
        result: null,
      } as any);

      const updatedRaid = { ...raid, status: "active" as const, startedAt: new Date().toISOString(), result: null };
      res.json({ success: true, raid: updatedRaid, message: "Raid launched successfully" });
    } catch {
      res.status(500).json({ error: "Failed to launch raid" });
    }
  });

  app.post("/api/raids/:raidId/resolve", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);

    try {
      const dbRaid = await storage.getRaidById(req.params.raidId);
      if (!dbRaid) return res.status(404).json({ error: "Raid not found" });

      const raid = castRaid(dbRaid);
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

      const updatedRaid: SampleRaidRecord = {
        ...raid,
        status: "completed",
        result: attackerVictory ? "attacker_victory" : "defender_victory",
        completedAt: new Date().toISOString(),
        attackerLosses: { units: Math.max(12, 22 * raid.participants.length - roleCount * 5) },
        defenderLosses: {
          units: attackerVictory
            ? Math.max(30, 44 * raid.participants.length + roleCount * 8)
            : Math.max(18, 16 * raid.participants.length),
        },
      };

      await storage.updateRaid(raid.id, {
        status: "completed",
        result: attackerVictory ? "attacker_victory" : "defender_victory",
        completedAt: new Date(),
        attackerLosses: updatedRaid.attackerLosses,
        defenderLosses: updatedRaid.defenderLosses,
      } as any);

      const playerState = await requirePlayerState(userId);
      const progression = resolveCommanderRaidCareer(playerState.raidCareer, {
        raidId: raid.id,
        raidType: raid.raidType,
        role: participant.role,
        victory: attackerVictory,
        participantCount: raid.participants.length,
        roleDiversity: roleCount,
        attackerLosses: updatedRaid.attackerLosses.units,
        defenderLosses: updatedRaid.defenderLosses.units,
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
        raid: updatedRaid,
        rewards: progression.rewards,
        raidCareer: progression.career,
        resources,
        message: attackerVictory ? "Raid resolved in the attackers' favor" : "Defenders held the line",
      });
    } catch {
      res.status(500).json({ error: "Raid resolved but commander rewards could not be recorded" });
    }
  });

  app.get("/api/raid-finder/queue", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const queueEntries = await storage.getRaidFinderQueue();
      const roles = ["tank", "dps", "healer", "support"];
      const summary = roles.map(role => ({
        role,
        queued: queueEntries.filter(e => (e.preferredRole || "dps") === role).length,
        avgWait: Math.max(1, Math.ceil(queueEntries.filter(e => (e.preferredRole || "dps") === role).length / 2)),
      }));
      const myEntry = queueEntries.find((entry) => entry.playerId === userId) || null;
      const position = myEntry ? queueEntries.findIndex((entry) => entry.playerId === userId) + 1 : null;
      res.json({
        queue: queueEntries.map(e => ({ userId: e.playerId, preferredRole: e.preferredRole || "dps", joinedAt: e.queuedAt?.toISOString?.() || e.createdAt?.toISOString?.() || "" })),
        roleSummary: summary,
        queued: Boolean(myEntry),
        position,
        myEntry: myEntry ? { userId: myEntry.playerId, preferredRole: myEntry.preferredRole || "dps", joinedAt: myEntry.queuedAt?.toISOString?.() || myEntry.createdAt?.toISOString?.() || "" } : null,
      });
    } catch {
      res.json({ queue: [], roleSummary: [], queued: false, position: null, myEntry: null });
    }
  });

  app.post("/api/raid-finder/queue", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { preferredRole = "dps" } = req.body as { preferredRole?: string };
    if (!["tank", "dps", "healer", "support"].includes(preferredRole)) {
      return res.status(400).json({ error: "Invalid preferred raid role" });
    }
    try {
      const existing = await storage.getRaidFinderEntryByPlayerId(userId);
      if (existing) {
        await storage.updateRaidFinderEntry(existing.id, { preferredRole } as any);
        const queueEntries = await storage.getRaidFinderQueue();
        const position = queueEntries.findIndex(e => e.playerId === userId) + 1;
        return res.json({ queued: true, position, preferredRole });
      }
      await storage.joinRaidFinder({
        playerId: userId,
        preferredRole,
        status: "queued",
      });
      const queueEntries = await storage.getRaidFinderQueue();
      const position = queueEntries.findIndex(e => e.playerId === userId) + 1;
      res.json({ queued: true, position: position || queueEntries.length, preferredRole });
    } catch {
      res.status(500).json({ error: "Failed to join raid finder queue" });
    }
  });

  app.delete("/api/raid-finder/queue", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      await storage.leaveRaidFinderByPlayerId(userId);
    } catch { }
    res.json({ queued: false });
  });

  app.post("/api/raid-finder/match", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const ownEntry = await storage.getRaidFinderEntryByPlayerId(userId);
      if (!ownEntry) return res.status(400).json({ error: "Join the queue before requesting a match" });

      const allRaids = await storage.getAllRaids();
      const candidateDbRaid = allRaids.find((dbRaid) => {
        const raid = castRaid(dbRaid);
        return (
          raid.status === "preparing" &&
          raid.participants.length < raid.maxCommanders &&
          !raid.participants.some((participant) => participant.playerId === userId)
        );
      });
      if (!candidateDbRaid) return res.status(404).json({ error: "No compatible preparing raid is available" });

      const candidateRaid = castRaid(candidateDbRaid);
      const playerState = await requirePlayerState(userId);
      const power = calculateCommanderRaidPower(playerState.commander, playerState.raidCareer, ownEntry.preferredRole || "dps");
      if (power < candidateRaid.powerRequirement) {
        return res.status(400).json({
          error: `Commander raid power ${power.toLocaleString()} is below the ${candidateRaid.powerRequirement.toLocaleString()} requirement`,
        });
      }

      const updatedParticipants = [
        ...candidateRaid.participants,
        {
          playerId: userId,
          role: ownEntry.preferredRole || "dps",
          joinedAt: new Date().toISOString(),
        },
      ];
      await storage.updateRaid(candidateRaid.id, { participants: updatedParticipants } as any);
      await storage.leaveRaidFinderByPlayerId(userId);

      res.json({
        success: true,
        matched: true,
        raidId: candidateRaid.id,
        raidName: `${candidateRaid.attackingTeamName} vs ${candidateRaid.defendingTeamName}`,
        role: ownEntry.preferredRole || "dps",
        commanderPower: power,
      });
    } catch {
      res.status(500).json({ error: "Failed to complete raid matchmaking" });
    }
  });

  // ─── Relics ───────────────────────────────────────────────────────────────

  app.get("/api/relics", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const catalog = await storage.getRelicsCatalog();
      res.json(catalog);
    } catch {
      res.json([]);
    }
  });

  app.get("/api/relics/inventory", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const inventory = await storage.getPlayerRelicInventoryFull(userId);
      if (inventory.length === 0) {
        const starterCatalogRelic = await storage.getRelicByCatalogId("relic-3");
        if (starterCatalogRelic) {
          await storage.acquireRelic(userId, starterCatalogRelic.id);
          const enriched = await storage.getPlayerRelicInventoryFull(userId);
          return res.json(enriched);
        }
      }
      res.json(inventory);
    } catch {
      res.json([]);
    }
  });

  app.post("/api/relics/:relicId/equip", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { relicId } = req.params;

    try {
      const catalogRelic = await storage.getRelicByCatalogId(relicId);
      if (!catalogRelic) {
        return res.status(404).json({ error: "Relic not found in catalog" });
      }

      const inventory = await storage.getPlayerRelicInventory(userId);
      const owned = inventory.find((entry) => entry.relicId === catalogRelic.id);
      if (!owned) {
        return res.status(404).json({ error: "Relic not found in inventory" });
      }

      for (const entry of inventory) {
        if (entry.isEquipped) {
          await storage.unequipRelic(userId, entry.relicId);
        }
      }
      await storage.equipRelic(userId, catalogRelic.id, "main");
      const updatedInventory = await storage.getPlayerRelicInventoryFull(userId);
      const equipped = updatedInventory.find((entry) => entry.relicId === relicId);

      res.json({ success: true, relic: equipped, relicsInventory: updatedInventory });
    } catch {
      res.status(500).json({ error: "Failed to equip relic" });
    }
  });

  app.post("/api/relics/:relicId/unequip", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { relicId } = req.params;

    try {
      const catalogRelic = await storage.getRelicByCatalogId(relicId);
      if (!catalogRelic) {
        return res.status(404).json({ error: "Relic not found in catalog" });
      }

      const inventory = await storage.getPlayerRelicInventory(userId);
      const owned = inventory.find((entry) => entry.relicId === catalogRelic.id);
      if (!owned) {
        return res.status(404).json({ error: "Relic not found in inventory" });
      }

      await storage.unequipRelic(userId, catalogRelic.id);
      const updatedInventory = await storage.getPlayerRelicInventoryFull(userId);
      const unequipped = updatedInventory.find((entry) => entry.relicId === relicId);

      res.json({ success: true, relic: unequipped, relicsInventory: updatedInventory });
    } catch {
      res.status(500).json({ error: "Failed to unequip relic" });
    }
  });

  // ─── Universe Events ──────────────────────────────────────────────────────

  app.get("/api/events", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const events = await storage.getAllUniverseEvents(userId);
      res.json(events);
    } catch {
      res.json([]);
    }
  });

  app.post("/api/events/:eventId/join", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    try {
      const event = await storage.getUniverseEvent(req.params.eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const result = await storage.joinEvent(req.params.eventId, userId);
      res.json({
        success: true,
        eventId: req.params.eventId,
        joined: true,
        participantCount: result.participantCount,
      });
    } catch {
      res.status(500).json({ error: "Failed to join event" });
    }
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
