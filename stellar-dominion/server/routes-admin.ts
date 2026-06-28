import type { Express, Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { adminUsers, users, playerStates } from "../shared/schema";

type ModerationStatus = "active" | "muted" | "banned";

type ModerationMap = Record<string, ModerationStatus>;

type AuditEntry = {
  id: string;
  timestamp: number;
  actorId: string;
  action: string;
  targetUserId?: string;
  details?: string;
};

type AdminOperation = {
  id: string;
  type: "backup_snapshot" | "reset_universe" | "restart_server";
  status: "queued" | "completed";
  requestedBy: string;
  requestedAt: number;
  completedAt?: number;
  notes?: string;
};

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

async function isAdminUser(userId: string): Promise<boolean> {
  if (!userId) return false;

  const [adminRecord] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);

  return Boolean(adminRecord);
}

async function getAdminRole(userId: string): Promise<string | null> {
  if (!userId) return null;

  const [adminRecord] = await db
    .select({ role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);

  return adminRecord?.role || null;
}

function getAdminSettingsKey(): string {
  return "admin_panel_settings";
}

async function loadAdminSettings() {
  const setting = await storage.getSetting(getAdminSettingsKey());
  const defaults = {
    maintenanceMode: false,
    peaceMode: false,
    resourceRate: 1,
    gameSpeed: 1,
    fleetSpeed: 1,
    allowNewRegistrations: true,
    adminBroadcastEnabled: true,
  };

  if (!setting || !setting.value || typeof setting.value !== "object") {
    return defaults;
  }

  return {
    ...defaults,
    ...(setting.value as Record<string, unknown>),
  };
}

async function saveAdminSettings(nextSettings: Record<string, unknown>) {
  await storage.setSetting(
    getAdminSettingsKey(),
    nextSettings,
    "Admin panel configuration and live server options",
    "admin",
  );
}

function getModerationKey(): string {
  return "admin_user_moderation";
}

function getAuditKey(): string {
  return "admin_audit_log";
}

function getOperationsKey(): string {
  return "admin_operations";
}

async function loadModerationMap(): Promise<ModerationMap> {
  const setting = await storage.getSetting(getModerationKey());
  if (!setting || !setting.value || typeof setting.value !== "object") {
    return {};
  }

  return setting.value as ModerationMap;
}

async function saveModerationMap(value: ModerationMap): Promise<void> {
  await storage.setSetting(
    getModerationKey(),
    value,
    "Per-user moderation status for admin panel",
    "admin"
  );
}

async function loadAuditLog(): Promise<AuditEntry[]> {
  const setting = await storage.getSetting(getAuditKey());
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }
  return (setting.value as AuditEntry[]).slice(-200);
}

async function appendAudit(entry: Omit<AuditEntry, "id" | "timestamp">): Promise<void> {
  const audit = await loadAuditLog();
  const nextEntry: AuditEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    ...entry,
  };

  await storage.setSetting(
    getAuditKey(),
    [...audit, nextEntry].slice(-200),
    "Admin panel audit trail",
    "admin"
  );
}

async function loadOperations(): Promise<AdminOperation[]> {
  const setting = await storage.getSetting(getOperationsKey());
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }

  return (setting.value as AdminOperation[]).slice(-200);
}

async function appendOperation(operation: Omit<AdminOperation, "id" | "requestedAt">): Promise<AdminOperation> {
  const operations = await loadOperations();
  const nextOperation: AdminOperation = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    requestedAt: Date.now(),
    ...operation,
  };

  await storage.setSetting(
    getOperationsKey(),
    [...operations, nextOperation].slice(-200),
    "Admin operation queue and history",
    "admin"
  );

  return nextOperation;
}

export function registerAdminRoutes(app: Express) {
  app.get("/api/admin/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      const role = await getAdminRole(actorId);
      res.json({
        isAdmin: Boolean(role),
        role,
      });
    } catch (error) {
      console.error("Failed to load admin identity:", error);
      res.status(500).json({ message: "Failed to load admin identity" });
    }
  });

  app.get("/api/admin/settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const settings = await loadAdminSettings();
      res.json({ settings });
    } catch (error) {
      console.error("Failed to load admin settings:", error);
      res.status(500).json({ message: "Failed to load admin settings" });
    }
  });

  app.patch("/api/admin/settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const current = await loadAdminSettings();
      const next = {
        ...current,
        ...((req.body && typeof req.body === "object") ? req.body : {}),
      };

      await saveAdminSettings(next);
      await appendAudit({
        actorId,
        action: "update_admin_settings",
        details: "settings patched",
      });

      res.json({ success: true, settings: next });
    } catch (error) {
      console.error("Failed to update admin settings:", error);
      res.status(500).json({ message: "Failed to update admin settings" });
    }
  });

  app.get("/api/admin/accounts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const rows = await db
        .select({
          id: adminUsers.id,
          userId: adminUsers.userId,
          role: adminUsers.role,
          permissions: adminUsers.permissions,
          createdAt: adminUsers.createdAt,
          username: users.username,
          email: users.email,
        })
        .from(adminUsers)
        .leftJoin(users, eq(users.id, adminUsers.userId))
        .orderBy(desc(adminUsers.createdAt));

      res.json({
        accounts: rows.map((row) => ({
          id: row.id,
          userId: row.userId,
          role: row.role,
          permissions: row.permissions || [],
          createdAt: row.createdAt,
          username: row.username || "unknown",
          email: row.email || "",
        })),
      });
    } catch (error) {
      console.error("Failed to load admin accounts:", error);
      res.status(500).json({ message: "Failed to load admin accounts" });
    }
  });

  app.post("/api/admin/accounts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const identifier = String(req.body?.identifier || "").trim();
      const role = String(req.body?.role || "moderator").trim();
      if (!identifier) {
        return res.status(400).json({ message: "identifier is required" });
      }

      const [userRow] = await db
        .select({ id: users.id, username: users.username, email: users.email })
        .from(users)
        .where(eq(users.username, identifier))
        .limit(1);

      const resolvedUser = userRow || (await db
        .select({ id: users.id, username: users.username, email: users.email })
        .from(users)
        .where(eq(users.email, identifier))
        .limit(1))[0];

      if (!resolvedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const [existingAdmin] = await db
        .select({ id: adminUsers.id })
        .from(adminUsers)
        .where(eq(adminUsers.userId, resolvedUser.id))
        .limit(1);

      if (existingAdmin) {
        return res.status(400).json({ message: "User is already an admin" });
      }

      const permissions =
        role === "founder"
          ? ["all_access", "administrate", "manage", "moderate", "view_only"]
          : role === "administrator"
            ? ["administrate", "manage", "moderate", "view_only"]
            : role === "suadmin"
              ? ["manage", "moderate", "view_only"]
              : role === "moderator"
                ? ["moderate", "view_only"]
                : ["view_only"];

      await db.insert(adminUsers).values({
        userId: resolvedUser.id,
        role,
        permissions,
      });

      await appendAudit({
        actorId,
        action: "create_admin_account",
        targetUserId: resolvedUser.id,
        details: `role=${role}`,
      });

      res.json({
        success: true,
        user: {
          id: resolvedUser.id,
          username: resolvedUser.username,
          email: resolvedUser.email,
          role,
        },
      });
    } catch (error) {
      console.error("Failed to create admin account:", error);
      res.status(500).json({ message: "Failed to create admin account" });
    }
  });

  app.delete("/api/admin/accounts/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;
      if (actorId === userId) {
        return res.status(400).json({ message: "You cannot remove your own admin role" });
      }

      const [existing] = await db
        .select({ id: adminUsers.id })
        .from(adminUsers)
        .where(eq(adminUsers.userId, userId))
        .limit(1);

      if (!existing) {
        return res.status(404).json({ message: "Admin account not found" });
      }

      await db.delete(adminUsers).where(eq(adminUsers.userId, userId));

      await appendAudit({
        actorId,
        action: "remove_admin_account",
        targetUserId: userId,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Failed to remove admin account:", error);
      res.status(500).json({ message: "Failed to remove admin account" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const moderationMap = await loadModerationMap();

      const rows = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .orderBy(desc(users.updatedAt));

      const adminRows = await db
        .select({ userId: adminUsers.userId, role: adminUsers.role })
        .from(adminUsers);

      const roleMap = new Map(adminRows.map((row) => [row.userId, row.role]));

      const formatted = rows.map((row) => ({
        id: row.id,
        name: row.username || "Unknown",
        email: row.email || "",
        role: roleMap.has(row.id) ? roleMap.get(row.id) : "user",
        status: moderationMap[row.id] || "active",
        lastLogin: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
        ip: "n/a",
      }));

      res.json({ users: formatted });
    } catch (error) {
      console.error("Failed to load admin users:", error);
      res.status(500).json({ message: "Failed to load users" });
    }
  });

  app.get("/api/admin/users/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;
      const moderationMap = await loadModerationMap();

      const [userRow] = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!userRow) {
        return res.status(404).json({ message: "User not found" });
      }

      const [adminRow] = await db
        .select({ role: adminUsers.role })
        .from(adminUsers)
        .where(eq(adminUsers.userId, userId))
        .limit(1);

      const detail = {
        id: userRow.id,
        name: userRow.username || "Unknown",
        email: userRow.email || "",
        role: adminRow?.role || "user",
        status: moderationMap[userId] || "active",
        createdAt: userRow.createdAt ? new Date(userRow.createdAt).toISOString() : null,
        lastLogin: userRow.updatedAt ? new Date(userRow.updatedAt).toISOString() : null,
      };

      res.json({ user: detail });
    } catch (error) {
      console.error("Failed to load admin user detail:", error);
      res.status(500).json({ message: "Failed to load user detail" });
    }
  });

  app.post("/api/admin/users/:userId/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;
      const nextStatus = String(req.body?.status || "").toLowerCase() as ModerationStatus;
      if (!["active", "muted", "banned"].includes(nextStatus)) {
        return res.status(400).json({ message: "Invalid moderation status" });
      }

      const moderationMap = await loadModerationMap();
      moderationMap[userId] = nextStatus;
      await saveModerationMap(moderationMap);

      await appendAudit({
        actorId,
        action: "set_user_status",
        targetUserId: userId,
        details: `status=${nextStatus}`,
      });

      res.json({ success: true, userId, status: nextStatus });
    } catch (error) {
      console.error("Failed to update moderation status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.post("/api/admin/console/execute", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const rawCommand = String(req.body?.command || "").trim();
      if (!rawCommand) {
        return res.status(400).json({ message: "Command is required" });
      }

      const command = rawCommand.toLowerCase();
      let output = "";

      if (command === "help") {
        output = "Available commands: help, status, clear, give_res [amount], kick_all";
      } else if (command === "status") {
        const moderationMap = await loadModerationMap();
        const usersRows = await db.select({ id: users.id }).from(users);
        const totalUsers = usersRows.length;
        const bannedUsers = Object.values(moderationMap).filter((status) => status === "banned").length;
        const mutedUsers = Object.values(moderationMap).filter((status) => status === "muted").length;
        output = `Server Status: ONLINE | Users: ${totalUsers} | Banned: ${bannedUsers} | Muted: ${mutedUsers}`;
      } else if (command.startsWith("give_res")) {
        const amountPart = rawCommand.split(/\s+/)[1];
        const amount = Number.parseInt(amountPart || "10000", 10);
        if (!Number.isFinite(amount) || amount <= 0) {
          return res.status(400).json({ message: "Amount must be a positive integer" });
        }

        const [existingState] = await db
          .select({ id: playerStates.id, resources: playerStates.resources })
          .from(playerStates)
          .where(eq(playerStates.userId, actorId))
          .limit(1);

        if (!existingState) {
          await db.insert(playerStates).values({
            userId: actorId,
            commander: {
              race: "human",
              class: "warrior",
              stats: { level: 1, xp: 0, warfare: 0, logistics: 0, engineering: 0 },
              equipment: {},
              inventory: [],
              title: "Commander",
            },
            government: {
              type: "democracy",
              taxRate: 10,
              policies: [],
              stats: { stability: 50, efficiency: 70, publicSupport: 60, militaryReadiness: 50 },
            },
            resources: { metal: amount, crystal: amount, deuterium: Math.floor(amount / 2), energy: 0 },
          });
        } else {
          const resources = (existingState.resources as any) || {};
          const nextResources = {
            ...resources,
            metal: Number(resources.metal || 0) + amount,
            crystal: Number(resources.crystal || 0) + amount,
            deuterium: Number(resources.deuterium || 0) + Math.floor(amount / 2),
            energy: Number(resources.energy || 0),
          };

          await db
            .update(playerStates)
            .set({ resources: nextResources, updatedAt: new Date() })
            .where(eq(playerStates.userId, actorId));
        }

        output = `Resources granted: +${amount.toLocaleString()} metal, +${amount.toLocaleString()} crystal, +${Math.floor(amount / 2).toLocaleString()} deuterium`;
      } else if (command === "kick_all") {
        await storage.setSetting(
          "maintenance_mode",
          true,
          "Emergency maintenance lock enabled via admin console",
          "server",
        );
        output = "Maintenance mode enabled. Non-admin sessions should reconnect when maintenance is disabled.";
      } else if (command === "clear") {
        output = "Console cleared.";
      } else {
        output = `Unknown command: ${rawCommand}`;
      }

      await appendAudit({
        actorId,
        action: "admin_console_execute",
        details: `command=${rawCommand}`,
      });

      return res.json({ success: true, output });
    } catch (error) {
      console.error("Failed to execute admin console command:", error);
      return res.status(500).json({ message: "Failed to execute command" });
    }
  });

  app.get("/api/admin/audit", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const logs = await loadAuditLog();
      res.json({ logs: logs.slice().reverse().slice(0, 100) });
    } catch (error) {
      console.error("Failed to load audit log:", error);
      res.status(500).json({ message: "Failed to load audit log" });
    }
  });

  app.get("/api/admin/overview", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const moderationMap = await loadModerationMap();
      const usersRows = await db.select({ id: users.id }).from(users);
      const totalUsers = usersRows.length;
      const bannedUsers = Object.values(moderationMap).filter((status) => status === "banned").length;
      const mutedUsers = Object.values(moderationMap).filter((status) => status === "muted").length;

      res.json({
        totalUsers,
        bannedUsers,
        mutedUsers,
        activeUsersEstimate: Math.max(0, totalUsers - bannedUsers),
      });
    } catch (error) {
      console.error("Failed to load admin overview:", error);
      res.status(500).json({ message: "Failed to load admin overview" });
    }
  });

  app.get("/api/admin/operations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const operations = await loadOperations();
      res.json({ operations: operations.slice().reverse().slice(0, 30) });
    } catch (error) {
      console.error("Failed to load admin operations:", error);
      res.status(500).json({ message: "Failed to load admin operations" });
    }
  });

  app.post("/api/admin/operations/backup", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const operation = await appendOperation({
        type: "backup_snapshot",
        status: "completed",
        requestedBy: actorId,
        completedAt: Date.now(),
        notes: "Settings and state snapshot persisted",
      });

      await storage.setSetting(
        "admin_last_backup_snapshot",
        {
          operationId: operation.id,
          createdAt: operation.completedAt,
          createdBy: actorId,
        },
        "Most recent admin backup snapshot metadata",
        "admin"
      );

      await appendAudit({
        actorId,
        action: "create_backup_snapshot",
        details: `operationId=${operation.id}`,
      });

      res.json({
        success: true,
        operation,
        message: "Backup snapshot created successfully",
      });
    } catch (error) {
      console.error("Failed to create backup snapshot:", error);
      res.status(500).json({ message: "Failed to create backup snapshot" });
    }
  });

  app.post("/api/admin/operations/reset-universe", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const confirmText = String(req.body?.confirmText || "");
      if (confirmText !== "RESET") {
        return res.status(400).json({ message: "Confirmation text mismatch" });
      }

      const operation = await appendOperation({
        type: "reset_universe",
        status: "queued",
        requestedBy: actorId,
        notes: "Universe reset queued by admin",
      });

      await storage.setSetting(
        "admin_universe_reset_queue",
        {
          operationId: operation.id,
          requestedAt: operation.requestedAt,
          requestedBy: actorId,
          status: "queued",
        },
        "Queued universe reset request",
        "admin"
      );

      await appendAudit({
        actorId,
        action: "queue_universe_reset",
        details: `operationId=${operation.id}`,
      });

      res.json({
        success: true,
        operation,
        message: "Universe reset has been queued",
      });
    } catch (error) {
      console.error("Failed to queue universe reset:", error);
      res.status(500).json({ message: "Failed to queue universe reset" });
    }
  });

  app.post("/api/admin/operations/restart", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getUserId(req);
      if (!(await isAdminUser(actorId))) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const operation = await appendOperation({
        type: "restart_server",
        status: "queued",
        requestedBy: actorId,
        notes: "Server restart requested by admin",
      });

      await storage.setSetting(
        "admin_restart_queue",
        {
          operationId: operation.id,
          requestedAt: operation.requestedAt,
          requestedBy: actorId,
          status: "queued",
        },
        "Queued server restart request",
        "admin"
      );

      await appendAudit({
        actorId,
        action: "queue_server_restart",
        details: `operationId=${operation.id}`,
      });

      res.json({
        success: true,
        operation,
        message: "Server restart request has been queued",
      });
    } catch (error) {
      console.error("Failed to queue server restart:", error);
      res.status(500).json({ message: "Failed to queue server restart" });
    }
  });
}
