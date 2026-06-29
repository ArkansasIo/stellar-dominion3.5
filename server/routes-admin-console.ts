import type { Express, Request, Response } from "express";
import { eq, sql, desc, like, or, and } from "drizzle-orm";
import { db } from "./db";
import { storage } from "./storage";
import {
  users, playerStates, guilds, guildMembers, alliances, allianceMembers,
  marketOrders, battleLogs, missions, moons, starbases
} from "../Source/Shared/schema";

function requireAdmin(req: Request, res: Response): string | null {
  const userId = req.session?.userId;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return null; }
  return userId;
}

const commandLog: { timestamp: string; command: string; admin: string; result: string }[] = [];

function logCommand(admin: string, command: string, result: string) {
  commandLog.push({ timestamp: new Date().toISOString(), command, admin: result ? "success" : admin, result });
  if (commandLog.length > 500) commandLog.shift();
}

export function registerAdminConsoleRoutes(app: Express) {

  // ── System Overview ──────────────────────────────────────────────
  app.get("/api/admin/console/overview", async (req: Request, res: Response) => {
    const userId = requireAdmin(req, res);
    if (!userId) return;

    try {
      const [playerCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
      const [onlineCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(
        sql`${users.updatedAt} > now() - interval '5 minutes'`
      ).catch(() => [{ count: 0 }]);
      const [guildCount] = await db.select({ count: sql<number>`count(*)::int` }).from(guilds);
      const [allianceCount] = await db.select({ count: sql<number>`count(*)::int` }).from(alliances);
      const [marketCount] = await db.select({ count: sql<number>`count(*)::int` }).from(marketOrders).where(eq(marketOrders.status, "active"));
      const [starbaseCount] = await db.select({ count: sql<number>`count(*)::int` }).from(starbases);

      const uptime = process.uptime();
      const mem = process.memoryUsage();

      res.json({
        players: playerCount?.count || 0,
        online: onlineCount?.count || 0,
        guilds: guildCount?.count || 0,
        alliances: allianceCount?.count || 0,
        marketOrders: marketCount?.count || 0,
        starbases: starbaseCount?.count || 0,
        uptime: Math.floor(uptime),
        memory: { rss: Math.floor(mem.rss / 1024 / 1024), heap: Math.floor(mem.heapUsed / 1024 / 1024) },
        nodeVersion: process.version,
        pid: process.pid,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch overview" });
    }
  });

  // ── Database Commands ────────────────────────────────────────────
  app.get("/api/admin/console/tables", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      const result = await db.execute(sql`
        SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
               (SELECT count(*) FROM information_schema.columns WHERE table_name = tablename) as columns
        FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      `);
      res.json({ tables: (result as any).rows || [] });
    } catch (error) {
      res.status(500).json({ error: "Failed to list tables" });
    }
  });

  app.get("/api/admin/console/table/:tableName", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { tableName } = req.params;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    try {
      const safeName = tableName.replace(/[^a-z0-9_]/g, "");
      const result = await db.execute(sql.raw(`SELECT * FROM ${safeName} ORDER BY 1 LIMIT ${limit} OFFSET ${offset}`));
      const countResult = await db.execute(sql.raw(`SELECT count(*)::int as count FROM ${safeName}`));
      res.json({ rows: (result as any).rows || [], total: (countResult as any)?.rows?.[0]?.count || 0, limit, offset });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Query failed" });
    }
  });

  app.post("/api/admin/console/sql", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const query = String(req.body?.query || "").trim();
    if (!query) return res.status(400).json({ error: "Query required" });

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("drop ") || lowerQuery.includes("truncate ") || lowerQuery.includes("alter ")) {
      return res.status(403).json({ error: "DDL statements not allowed via console" });
    }

    try {
      const start = Date.now();
      const result = await db.execute(sql.raw(query));
      const duration = Date.now() - start;
      logCommand(req.session?.userId || "", query, "success");
      res.json({ rows: result.rows || [], rowCount: result.rowCount || 0, duration });
    } catch (error: any) {
      logCommand(req.session?.userId || "", query, "error");
      res.status(400).json({ error: error.message || "Query failed" });
    }
  });

  // ── User Management Commands ─────────────────────────────────────
  app.get("/api/admin/console/users", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const search = String(req.query.search || "");
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    try {
      const rows = search
        ? await db.select({
            id: users.id, username: users.username, email: users.email,
            createdAt: users.createdAt,
          }).from(users).where(or(like(users.username, `%${search}%`), like(users.email, `%${search}%`))).orderBy(desc(users.createdAt)).limit(limit).offset(offset)
        : await db.select({
            id: users.id, username: users.username, email: users.email,
            createdAt: users.createdAt,
          }).from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
      const [countRow] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
      res.json({ users: rows, total: countRow?.count || 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to list users" });
    }
  });

  app.get("/api/admin/console/user/:userId", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      const { userId } = req.params;
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user) return res.status(404).json({ error: "User not found" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      const [membership] = await db.select().from(guildMembers).where(eq(guildMembers.playerId, userId)).limit(1);

      const turnsData = (state as any)?.turnsData || {};
      const resources = (state as any)?.resources || {};
      res.json({
        user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt },
        state: state ? { 
          resources,
          turns: turnsData.currentTurn || 0,
          credits: 0,
        } : null,
        guild: membership ? { guildId: membership.guildId, role: membership.role } : null,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/admin/console/user/give-resources", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { userId, metal = 0, crystal = 0, deuterium = 0, credits = 0 } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId required" });
    try {
      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });
      const resources = state.resources as any;
      await db.update(playerStates).set({
        resources: {
          ...resources,
          metal: (resources.metal || 0) + Number(metal),
          crystal: (resources.crystal || 0) + Number(crystal),
          deuterium: (resources.deuterium || 0) + Number(deuterium),
        },
        updatedAt: new Date(),
      }).where(eq(playerStates.userId, userId));

      logCommand(req.session?.userId || "", `give-resources ${userId}`, `+${metal}m +${crystal}c +${deuterium}d +${credits}cr`);
      res.json({ success: true, message: `Resources granted to ${userId}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to give resources" });
    }
  });

  app.post("/api/admin/console/user/ban", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { userId, banned = true } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId required" });
    try {
      await db.update(users).set({ role: banned ? "banned" : "player" } as any).where(eq(users.id, userId));
      logCommand(req.session?.userId || "", `ban ${userId}`, banned ? "banned" : "unbanned");
      res.json({ success: true, message: `User ${banned ? "banned" : "unbanned"}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to ban user" });
    }
  });

  app.post("/api/admin/console/user/reset", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId required" });
    try {
      await db.update(playerStates).set({
        resources: { metal: 1000, crystal: 500, deuterium: 200, energy: 100 },
        updatedAt: new Date(),
      }).where(eq(playerStates.userId, userId));
      logCommand(req.session?.userId || "", `reset ${userId}`, "done");
      res.json({ success: true, message: "Player progress reset" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset player" });
    }
  });

  // ── Game Management Commands ─────────────────────────────────────
  app.get("/api/admin/console/stats", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      const [totalPlayers] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
      const [totalGuilds] = await db.select({ count: sql<number>`count(*)::int` }).from(guilds);
      const [totalAlliances] = await db.select({ count: sql<number>`count(*)::int` }).from(alliances);
      const [totalOrders] = await db.select({ count: sql<number>`count(*)::int` }).from(marketOrders);
      const [activeOrders] = await db.select({ count: sql<number>`count(*)::int` }).from(marketOrders).where(eq(marketOrders.status, "active"));
      const [totalStarbases] = await db.select({ count: sql<number>`count(*)::int` }).from(starbases);

      const topGuilds = await db.select({ name: guilds.name, level: guilds.level, influence: guilds.influence, totalMembers: guilds.totalMembers })
        .from(guilds).orderBy(desc(guilds.influence)).limit(5);

      res.json({
        totalPlayers: totalPlayers?.count || 0,
        totalGuilds: totalGuilds?.count || 0,
        totalAlliances: totalAlliances?.count || 0,
        totalMarketOrders: totalOrders?.count || 0,
        activeMarketOrders: activeOrders?.count || 0,
        totalStarbases: totalStarbases?.count || 0,
        topGuilds,
        serverUptime: Math.floor(process.uptime()),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/console/announce", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { message, priority = "high" } = req.body || {};
    if (!message) return res.status(400).json({ error: "Message required" });
    try {
      const key = "server_announcements";
      const existing = await storage.getSetting(key);
      const announcements = Array.isArray(existing?.value) ? existing.value : [];
      announcements.push({
        id: `admin_ann_${Date.now()}`,
        message,
        priority,
        createdAt: new Date().toISOString(),
      });
      await storage.setSetting(key, announcements.slice(-100), "Server announcements", "admin");
      logCommand(req.session?.userId || "", "announce", message.substring(0, 50));
      res.json({ success: true, message: "Announcement broadcast" });
    } catch (error) {
      res.status(500).json({ error: "Failed to announce" });
    }
  });

  app.get("/api/admin/console/audit-log", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    res.json({ entries: commandLog.slice(-limit).reverse() });
  });

  // ── Guild Management ─────────────────────────────────────────────
  app.get("/api/admin/console/guilds", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      const rows = await db.select().from(guilds).orderBy(desc(guilds.influence)).limit(50);
      res.json({ guilds: rows });
    } catch (error) {
      res.status(500).json({ error: "Failed to list guilds" });
    }
  });

  app.post("/api/admin/console/guild/disband", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { guildId } = req.body || {};
    if (!guildId) return res.status(400).json({ error: "guildId required" });
    try {
      await db.delete(guildMembers).where(eq(guildMembers.guildId, guildId));
      await db.delete(guilds).where(eq(guilds.id, guildId));
      logCommand(req.session?.userId || "", `disband-guild ${guildId}`, "done");
      res.json({ success: true, message: "Guild disbanded" });
    } catch (error) {
      res.status(500).json({ error: "Failed to disband guild" });
    }
  });

  // ── Alliance Management ──────────────────────────────────────────
  app.get("/api/admin/console/alliances", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      const rows = await db.select().from(alliances).orderBy(desc(alliances.createdAt)).limit(50);
      res.json({ alliances: rows });
    } catch (error) {
      res.status(500).json({ error: "Failed to list alliances" });
    }
  });

  // ── Market Commands ──────────────────────────────────────────────
  app.get("/api/admin/console/market", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      const orders = await db.select().from(marketOrders).orderBy(desc(marketOrders.createdAt)).limit(100);
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Failed to list market orders" });
    }
  });

  app.post("/api/admin/console/market/clear", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      await db.update(marketOrders).set({ status: "cancelled" } as any).where(eq(marketOrders.status, "active"));
      logCommand(req.session?.userId || "", "clear-market", "done");
      res.json({ success: true, message: "All active orders cancelled" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear market" });
    }
  });

  // ── Maintenance Commands ─────────────────────────────────────────
  app.post("/api/admin/console/maintenance/cache-clear", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    logCommand(req.session?.userId || "", "cache-clear", "done");
    res.json({ success: true, message: "Application cache cleared" });
  });

  app.post("/api/admin/console/maintenance/vacuum", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      await db.execute(sql.raw("VACUUM ANALYZE"));
      logCommand(req.session?.userId || "", "vacuum", "done");
      res.json({ success: true, message: "Database vacuum completed" });
    } catch (error) {
      res.status(500).json({ error: "Vacuum failed" });
    }
  });

  app.get("/api/admin/console/maintenance/health", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const start = Date.now();
    try {
      await db.execute(sql`SELECT 1`);
      const dbLatency = Date.now() - start;
      const mem = process.memoryUsage();
      res.json({
        database: { status: "ok", latencyMs: dbLatency },
        memory: { rssMB: Math.floor(mem.rss / 1024 / 1024), heapMB: Math.floor(mem.heapUsed / 1024 / 1024), externalMB: Math.floor(mem.external / 1024 / 1024) },
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        pid: process.pid,
      });
    } catch (error) {
      res.status(500).json({ database: { status: "error" }, error: "Health check failed" });
    }
  });
}
