import type { Express, Request, Response } from "express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, runTransaction } from "./db";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { appendAudit, requireAdminPermission } from "./routes-admin";
import {
  adminUsers,
  alliances,
  battles,
  guildMembers,
  guilds,
  marketOrders,
  missions,
  playerStates,
  users,
} from "../shared/schema";
import { ADMIN_RESOURCE_KEYS, type AdminResourceKey } from "../shared/config/adminConsole";

type ModerationStatus = "active" | "muted" | "banned";

type ModerationMap = Record<string, ModerationStatus>;

const MODERATION_KEY = "admin_user_moderation";
const DEFAULT_RESOURCES: Record<string, number> = {
  metal: 1000,
  crystal: 500,
  deuterium: 200,
  energy: 100,
  naquadah: 25000,
  food: 500,
  water: 500,
  credits: 0,
  darkMatter: 0,
};

function finiteNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function numberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, raw]) => [key, finiteNumber(raw)]),
  );
}

function clampOperationAmount(value: unknown) {
  const amount = Math.trunc(finiteNumber(value, NaN));
  return Number.isFinite(amount) ? Math.max(-1_000_000_000, Math.min(1_000_000_000, amount)) : null;
}

async function loadModerationMap(): Promise<ModerationMap> {
  const setting = await storage.getSetting(MODERATION_KEY);
  if (!setting || !setting.value || typeof setting.value !== "object" || Array.isArray(setting.value)) {
    return {};
  }
  return setting.value as ModerationMap;
}

async function resolveUser(identifier: string) {
  const normalized = identifier.trim();
  if (!normalized) return null;
  const [row] = await db.select({ id: users.id, username: users.username, email: users.email, createdAt: users.createdAt, updatedAt: users.updatedAt })
    .from(users)
    .where(or(eq(users.id, normalized), eq(users.username, normalized), eq(users.email, normalized)))
    .limit(1);
  return row || null;
}

function safeResourceDelta(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const candidate = (body as { resources?: unknown }).resources;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
  const delta: Partial<Record<AdminResourceKey, number>> = {};
  for (const key of ADMIN_RESOURCE_KEYS) {
    const raw = (candidate as Record<string, unknown>)[key];
    if (raw === undefined || raw === "") continue;
    const amount = clampOperationAmount(raw);
    if (amount === null) return null;
    if (amount !== 0) delta[key] = amount;
  }
  return Object.keys(delta).length ? delta : null;
}

function makeSummary(
  user: { id: string; username: string | null; email: string | null; createdAt: Date | null; updatedAt: Date | null },
  state: {
    setupComplete: boolean;
    planetName: string;
    coordinates: string;
    empireLevel: number;
    tier: number;
  } | null,
  moderationStatus: ModerationStatus,
) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null,
    hasPlayerState: Boolean(state),
    setupComplete: Boolean(state?.setupComplete),
    planetName: state?.planetName || null,
    coordinates: state?.coordinates || null,
    empireLevel: Number(state?.empireLevel || 0),
    tier: Number(state?.tier || 0),
    moderationStatus,
  };
}

export function registerAdminHubRoutes(app: Express) {
  app.get("/api/admin/hub/overview", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "view_only");
      if (!access) return;

      const [playerCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
      const [activePlayers] = await db.select({ count: sql<number>`count(*)::int` }).from(users)
        .where(sql`${users.updatedAt} > now() - interval '5 minutes'`);
      const [adminCount] = await db.select({ count: sql<number>`count(*)::int` }).from(adminUsers);
      const [guildCount] = await db.select({ count: sql<number>`count(*)::int` }).from(guilds);
      const [allianceCount] = await db.select({ count: sql<number>`count(*)::int` }).from(alliances);
      const [marketCount] = await db.select({ count: sql<number>`count(*)::int` }).from(marketOrders)
        .where(eq(marketOrders.status, "active"));
      const [missionCount] = await db.select({ count: sql<number>`count(*)::int` }).from(missions)
        .where(or(eq(missions.status, "outbound"), eq(missions.status, "return")));
      const [battleCount] = await db.select({ count: sql<number>`count(*)::int` }).from(battles)
        .where(sql`${battles.createdAt} > now() - interval '24 hours'`);

      let database: "connected" | "degraded" = "connected";
      try {
        await db.execute(sql`select 1`);
      } catch {
        database = "degraded";
      }

      res.json({
        metrics: {
          players: Number(playerCount?.count || 0),
          activePlayers: Number(activePlayers?.count || 0),
          adminAccounts: Number(adminCount?.count || 0),
          guilds: Number(guildCount?.count || 0),
          alliances: Number(allianceCount?.count || 0),
          activeMarketOrders: Number(marketCount?.count || 0),
          activeMissions: Number(missionCount?.count || 0),
          battlesLast24Hours: Number(battleCount?.count || 0),
          uptimeSeconds: Math.floor(process.uptime()),
          memoryMb: Math.floor(process.memoryUsage().rss / 1024 / 1024),
          database,
          generatedAt: new Date().toISOString(),
        },
        actor: { id: access.actorId, role: access.role, permissions: access.permissions },
      });
    } catch (error) {
      console.error("Failed to load admin hub overview:", error);
      res.status(500).json({ message: "Failed to load admin overview" });
    }
  });

  app.get("/api/admin/hub/players", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "view_only");
      if (!access) return;
      const query = String(req.query.q || "").trim();
      const limit = Math.max(1, Math.min(100, Math.floor(finiteNumber(req.query.limit, 50))));
      const offset = Math.max(0, Math.floor(finiteNumber(req.query.offset, 0)));
      const moderationMap = await loadModerationMap();
      const baseQuery = db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        setupComplete: playerStates.setupComplete,
        planetName: playerStates.planetName,
        coordinates: playerStates.coordinates,
        empireLevel: playerStates.empireLevel,
        tier: playerStates.tier,
      }).from(users).leftJoin(playerStates, eq(playerStates.userId, users.id));
      const rows = query
        ? await baseQuery.where(or(ilike(users.id, `%${query}%`), ilike(users.username, `%${query}%`), ilike(users.email, `%${query}%`))).orderBy(desc(users.updatedAt)).limit(limit).offset(offset)
        : await baseQuery.orderBy(desc(users.updatedAt)).limit(limit).offset(offset);
      const [countRow] = query
        ? await db.select({ count: sql<number>`count(*)::int` }).from(users).where(or(ilike(users.id, `%${query}%`), ilike(users.username, `%${query}%`), ilike(users.email, `%${query}%`)))
        : await db.select({ count: sql<number>`count(*)::int` }).from(users);
      const players = rows.map((row) => makeSummary(row, row.setupComplete === null ? null : {
        setupComplete: Boolean(row.setupComplete),
        planetName: row.planetName || "",
        coordinates: row.coordinates || "",
        empireLevel: Number(row.empireLevel || 0),
        tier: Number(row.tier || 0),
      }, moderationMap[row.id] || "active"));
      res.json({ players, total: Number(countRow?.count || 0), limit, offset });
    } catch (error) {
      console.error("Failed to list admin hub players:", error);
      res.status(500).json({ message: "Failed to list players" });
    }
  });

  app.get("/api/admin/hub/players/:identifier", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "view_only");
      if (!access) return;
      const user = await resolveUser(req.params.identifier);
      if (!user) return res.status(404).json({ message: "Player not found" });
      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, user.id)).limit(1);
      const moderationMap = await loadModerationMap();
      const summary = makeSummary(user, state ? {
        setupComplete: Boolean(state.setupComplete),
        planetName: state.planetName || "",
        coordinates: state.coordinates || "",
        empireLevel: Number(state.empireLevel || 0),
        tier: Number(state.tier || 0),
      } : null, moderationMap[user.id] || "active");
      const [membership] = await db.select({ id: guilds.id, name: guilds.name, role: guildMembers.role })
        .from(guildMembers).innerJoin(guilds, eq(guilds.id, guildMembers.guildId))
        .where(eq(guildMembers.playerId, user.id)).limit(1);
      const detail = {
        ...summary,
        resources: numberRecord(state?.resources),
        storage: numberRecord((state as any)?.resourceStorage),
        buildings: numberRecord(state?.buildings),
        research: numberRecord(state?.research),
        units: numberRecord(state?.units),
        guild: membership ? { id: membership.id, name: membership.name, role: membership.role } : null,
        lastResourceUpdate: state?.lastResourceUpdate ? new Date(state.lastResourceUpdate).toISOString() : null,
      };
      res.json({ player: detail, actor: { id: access.actorId, role: access.role } });
    } catch (error) {
      console.error("Failed to load admin hub player:", error);
      res.status(500).json({ message: "Failed to load player detail" });
    }
  });

  app.post("/api/admin/hub/players/:identifier/grant-resources", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;
      const user = await resolveUser(req.params.identifier);
      if (!user) return res.status(404).json({ message: "Player not found" });
      const delta = safeResourceDelta(req.body);
      if (!delta) return res.status(400).json({ message: "Provide at least one valid non-zero resource delta" });

      const changed = await runTransaction(async (tx) => {
        const [state] = await tx.select({ id: playerStates.id, resources: playerStates.resources })
          .from(playerStates).where(eq(playerStates.userId, user.id)).limit(1);
        if (!state) return null;
        const current = numberRecord(state.resources);
        const next = { ...current };
        const applied: Record<string, number> = {};
        for (const [key, amount] of Object.entries(delta)) {
          const before = Math.max(0, finiteNumber(current[key]));
          const after = Math.max(0, before + amount);
          next[key] = after;
          applied[key] = after - before;
        }
        await tx.update(playerStates).set({ resources: next, updatedAt: new Date() }).where(eq(playerStates.id, state.id));
        return applied;
      });
      if (!changed) return res.status(404).json({ message: "Player state not found" });
      const auditId = await appendAudit({ actorId: access.actorId, action: "admin_hub_grant_resources", targetUserId: user.id, details: JSON.stringify(changed) });
      res.json({ success: true, action: "grant_resources", targetUserId: user.id, changed, auditId });
    } catch (error) {
      console.error("Failed to grant admin resources:", error);
      res.status(500).json({ message: "Failed to grant resources" });
    }
  });

  app.post("/api/admin/hub/players/:identifier/reset", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "developer_tools");
      if (!access) return;
      const user = await resolveUser(req.params.identifier);
      if (!user) return res.status(404).json({ message: "Player not found" });
      const scope = String(req.body?.scope || "resources");
      if (!["resources", "progress"].includes(scope)) {
        return res.status(400).json({ message: "Reset scope must be resources or progress" });
      }
      const [state] = await db.select({ id: playerStates.id }).from(playerStates).where(eq(playerStates.userId, user.id)).limit(1);
      if (!state) return res.status(404).json({ message: "Player state not found" });
      const patch: Record<string, unknown> = {
        resources: { ...DEFAULT_RESOURCES },
        updatedAt: new Date(),
      };
      if (scope === "progress") {
        patch.buildings = {};
        patch.research = {};
        patch.units = {};
        patch.empireLevel = 1;
        patch.empireExperience = 0;
        patch.tier = 1;
        patch.tierExperience = 0;
      }
      await db.update(playerStates).set(patch as any).where(eq(playerStates.id, state.id));
      const auditId = await appendAudit({ actorId: access.actorId, action: "admin_hub_reset_player", targetUserId: user.id, details: `scope=${scope}` });
      res.json({ success: true, action: "reset_player", targetUserId: user.id, changed: { scope }, auditId });
    } catch (error) {
      console.error("Failed to reset admin player state:", error);
      res.status(500).json({ message: "Failed to reset player state" });
    }
  });

  app.post("/api/admin/hub/players/:identifier/progression", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "developer_tools");
      if (!access) return;
      const user = await resolveUser(req.params.identifier);
      if (!user) return res.status(404).json({ message: "Player not found" });
      const empireLevel = Math.max(1, Math.min(999, Math.trunc(finiteNumber(req.body?.empireLevel, NaN))));
      const tier = Math.max(1, Math.min(21, Math.trunc(finiteNumber(req.body?.tier, NaN))));
      if (!Number.isFinite(empireLevel) || !Number.isFinite(tier)) {
        return res.status(400).json({ message: "empireLevel and tier must be finite numbers" });
      }
      const result = await db.update(playerStates).set({ empireLevel, tier, updatedAt: new Date() })
        .where(eq(playerStates.userId, user.id)).returning({ id: playerStates.id });
      if (!result.length) return res.status(404).json({ message: "Player state not found" });
      const auditId = await appendAudit({ actorId: access.actorId, action: "admin_hub_set_progression", targetUserId: user.id, details: `empireLevel=${empireLevel};tier=${tier}` });
      res.json({ success: true, action: "set_progression", targetUserId: user.id, changed: { empireLevel, tier }, auditId });
    } catch (error) {
      console.error("Failed to set admin player progression:", error);
      res.status(500).json({ message: "Failed to set player progression" });
    }
  });
}
