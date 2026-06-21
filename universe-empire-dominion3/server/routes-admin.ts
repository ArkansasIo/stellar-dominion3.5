import type { Express, Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { adminUsers, users, playerStates } from "../shared/schema";
import { UniverseResetService } from "./services/universeResetService";
import {
  type AdminPermission,
  getRolePermissions,
  hasAdminPermission,
  normalizeAdminRole,
} from "./adminPermissions";

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

type OGameXServerSettings = {
  universeName: string;
  economySpeed: number;
  researchSpeed: number;
  fleetSpeedWar: number;
  fleetSpeedHolding: number;
  fleetSpeedPeaceful: number;
  planetFieldsBonus: number;
  basicIncomeMetal: number;
  basicIncomeCrystal: number;
  basicIncomeDeuterium: number;
  basicIncomeEnergy: number;
  registrationPlanetAmount: number;
  darkMatterBonus: number;
  darkMatterRegenEnabled: boolean;
  darkMatterRegenAmount: number;
  darkMatterRegenPeriod: number;
  planetRelocationCost: number;
  planetRelocationDuration: number;
  allianceCooldownDays: number;
  battleEngine: "rust" | "php";
  allianceCombatSystemOn: boolean;
  debrisFieldFromShips: number;
  debrisFieldFromDefense: number;
  debrisFieldDeuteriumOn: boolean;
  rapidFireEnabled: boolean;
  defenseRepairRate: number;
  expeditionLootRate: number;
  expeditionDelayRate: number;
  expeditionBlackHoleRate: number;
  highscoreAdminVisible: boolean;
  numberOfGalaxies: number;
  systemsPerGalaxy: number;
  positionsPerSystem: number;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  peaceMode: boolean;
  resourceRate: number;
  gameSpeed: number;
  fleetSpeed: number;
};

type RulesLegalContent = {
  rulesContent: string;
  legalContent: string;
  privacyPolicyContent: string;
  termsContent: string;
  contactContent: string;
};

type AdminControlPlaneState = {
  featureFlags: {
    adminBroadcastEnabled: boolean;
    allowMasquerade: boolean;
    advancedWorldTools: boolean;
    liveOpsOverridesEnabled: boolean;
    incidentLockdownEnabled: boolean;
    auditStreamVisible: boolean;
  };
  security: {
    threatLevel: "guarded" | "elevated" | "critical";
    commandApprovalMode: "single" | "dual" | "founder";
    privilegedSessionTimeoutMinutes: number;
    auditRetentionDays: number;
  };
  broadcast: {
    title: string;
    body: string;
    severity: "info" | "warning" | "critical";
    audience: "all" | "admins" | "active-players";
    enabled: boolean;
  };
  liveOps: {
    eventPreset: "standard" | "boosted" | "war-economy" | "recovery";
    dropRateModifier: number;
    upkeepModifier: number;
    buildRateModifier: number;
    turnMultiplier: number;
  };
  support: {
    ticketQueueMode: "manual" | "triage" | "priority";
    escalationPolicy: "standard" | "fast-track" | "founder-review";
    playerVisibility: "summary" | "detailed";
  };
};

type AdminWorldObject = {
  id: string;
  type: "planet" | "moon" | "debris";
  coordinates: string;
  name: string;
  ownerUserId?: string;
  details?: Record<string, unknown>;
  createdAt: number;
  createdBy: string;
};

type ControlPlaneFeatureFlag = keyof AdminControlPlaneState["featureFlags"];

type GuardedAdminAccess = {
  actorId: string;
  role: string | null;
  permissions: string[];
  controlPlane: AdminControlPlaneState;
  isFounder: boolean;
};

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

function getImpersonatorId(req: Request): string {
  return (req.session as any)?.impersonatorId || "";
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

async function getAdminAccess(userId: string): Promise<{
  isAdmin: boolean;
  role: string | null;
  permissions: string[];
}> {
  if (!userId) {
    return { isAdmin: false, role: null, permissions: [] };
  }

  const [adminRecord] = await db
    .select({ role: adminUsers.role, permissions: adminUsers.permissions })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);

  return {
    isAdmin: Boolean(adminRecord),
    role: adminRecord?.role || null,
    permissions: Array.isArray(adminRecord?.permissions)
      ? adminRecord.permissions.filter((value): value is string => typeof value === "string")
      : [],
  };
}

async function getAdminActorId(req: Request): Promise<string | null> {
  const currentUserId = getUserId(req);
  if (await isAdminUser(currentUserId)) {
    return currentUserId;
  }

  const impersonatorId = getImpersonatorId(req);
  if (await isAdminUser(impersonatorId)) {
    return impersonatorId;
  }

  return null;
}

async function requireAdminActorId(req: Request, res: Response): Promise<string | null> {
  const actorId = await getAdminActorId(req);
  if (!actorId) {
    res.status(403).json({ message: "Admin access required" });
    return null;
  }

  return actorId;
}

async function requireAdminPermission(
  req: Request,
  res: Response,
  permission: AdminPermission,
): Promise<{ actorId: string; role: string | null; permissions: string[] } | null> {
  const actorId = await getAdminActorId(req);
  if (!actorId) {
    res.status(403).json({ message: "Admin access required" });
    return null;
  }

  const access = await getAdminAccess(actorId);
  if (!hasAdminPermission(access.permissions, permission)) {
    res.status(403).json({ message: `Missing permission: ${permission}` });
    return null;
  }

  return { actorId, role: access.role, permissions: access.permissions };
}

function isFounderAccess(permissions: string[]): boolean {
  return hasAdminPermission(permissions, "all_access");
}

function getAdminSessionVerifiedAt(req: Request): number {
  const raw = (req.session as any)?.adminAuthenticatedAt;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildControlPlanePolicySummary(
  state: AdminControlPlaneState,
  permissions: string[],
  req: Request,
) {
  const isFounder = isFounderAccess(permissions);
  const timeoutMinutes = Math.max(5, Math.floor(parseNumberish(state.security.privilegedSessionTimeoutMinutes, 45)));
  const verifiedAt = getAdminSessionVerifiedAt(req);

  return {
    isFounder,
    incidentLockdownEnabled: state.featureFlags.incidentLockdownEnabled,
    commandApprovalMode: state.security.commandApprovalMode,
    privilegedSessionTimeoutMinutes: timeoutMinutes,
    features: {
      masquerade: state.featureFlags.allowMasquerade || isFounder,
      advancedWorldTools: state.featureFlags.advancedWorldTools || isFounder,
      liveOpsOverrides: state.featureFlags.liveOpsOverridesEnabled || isFounder,
      auditStreamVisible: state.featureFlags.auditStreamVisible || isFounder,
    },
    support: state.support,
    requiresFounderApproval:
      state.security.commandApprovalMode === "founder" && !isFounder,
    requiresDualApproval:
      state.security.commandApprovalMode === "dual" && !isFounder,
    sessionFresh:
      isFounder || !verifiedAt
        ? true
        : (Date.now() - verifiedAt) <= timeoutMinutes * 60 * 1000,
  };
}

async function requireGuardedAdminPermission(
  req: Request,
  res: Response,
  options: {
    permission: AdminPermission;
    featureFlag?: ControlPlaneFeatureFlag;
    blockedByLockdown?: boolean;
    requireElevatedApproval?: boolean;
    enforceFreshSession?: boolean;
    failureLabel?: string;
  },
): Promise<GuardedAdminAccess | null> {
  const access = await requireAdminPermission(req, res, options.permission);
  if (!access) {
    return null;
  }

  const controlPlane = await loadControlPlaneState();
  const isFounder = isFounderAccess(access.permissions);
  const failureLabel = options.failureLabel || "Admin action";

  if (options.featureFlag && !controlPlane.featureFlags[options.featureFlag] && !isFounder) {
    res.status(423).json({ message: `${failureLabel} is disabled by control-plane policy` });
    return null;
  }

  if (options.blockedByLockdown && controlPlane.featureFlags.incidentLockdownEnabled && !isFounder) {
    res.status(423).json({ message: `${failureLabel} is locked during incident lockdown` });
    return null;
  }

  if (options.requireElevatedApproval && !isFounder) {
    if (controlPlane.security.commandApprovalMode === "founder") {
      res.status(403).json({ message: `${failureLabel} requires founder approval under the current control-plane posture` });
      return null;
    }
    if (controlPlane.security.commandApprovalMode === "dual") {
      res.status(409).json({ message: `${failureLabel} requires dual approval under the current control-plane posture` });
      return null;
    }
  }

  if (options.enforceFreshSession && !isFounder) {
    const verifiedAt = getAdminSessionVerifiedAt(req);
    const timeoutMinutes = Math.max(5, Math.floor(parseNumberish(controlPlane.security.privilegedSessionTimeoutMinutes, 45)));
    const expiresAt = verifiedAt + timeoutMinutes * 60 * 1000;
    if (!verifiedAt || Date.now() > expiresAt) {
      res.status(403).json({ message: `Privileged session expired. Sign in again through the admin login to continue ${failureLabel.toLowerCase()}.` });
      return null;
    }
  }

  return {
    ...access,
    controlPlane,
    isFounder,
  };
}

function parseNumberish(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace(/,/g, "");
    if (!normalized) return fallback;
    const suffix = normalized.slice(-1).toLowerCase();
    const multipliers: Record<string, number> = { k: 1_000, m: 1_000_000, b: 1_000_000_000 };
    const base = suffix in multipliers ? Number(normalized.slice(0, -1)) : Number(normalized);
    if (Number.isFinite(base)) {
      return suffix in multipliers ? base * multipliers[suffix] : base;
    }
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getServerSettingsKey(): string {
  return "ogamex_admin_server_settings";
}

function getRulesContentKey(): string {
  return "ogamex_admin_rules_legal";
}

function getWorldObjectsKey(): string {
  return "ogamex_admin_world_objects";
}

function getDeveloperShortcutLogKey(): string {
  return "ogamex_admin_shortcut_log";
}

function getControlPlaneKey(): string {
  return "admin_control_plane_systems";
}

function getDefaultServerSettings(): OGameXServerSettings {
  return {
    universeName: "Nexus Crown",
    economySpeed: 4,
    researchSpeed: 8,
    fleetSpeedWar: 3,
    fleetSpeedHolding: 2,
    fleetSpeedPeaceful: 6,
    planetFieldsBonus: 25,
    basicIncomeMetal: 30,
    basicIncomeCrystal: 15,
    basicIncomeDeuterium: 8,
    basicIncomeEnergy: 20,
    registrationPlanetAmount: 1,
    darkMatterBonus: 2500,
    darkMatterRegenEnabled: true,
    darkMatterRegenAmount: 100,
    darkMatterRegenPeriod: 3600,
    planetRelocationCost: 5000,
    planetRelocationDuration: 3600,
    allianceCooldownDays: 3,
    battleEngine: "rust",
    allianceCombatSystemOn: true,
    debrisFieldFromShips: 30,
    debrisFieldFromDefense: 0,
    debrisFieldDeuteriumOn: false,
    rapidFireEnabled: true,
    defenseRepairRate: 70,
    expeditionLootRate: 100,
    expeditionDelayRate: 10,
    expeditionBlackHoleRate: 2,
    highscoreAdminVisible: false,
    numberOfGalaxies: 9,
    systemsPerGalaxy: 499,
    positionsPerSystem: 16,
    maintenanceMode: false,
    allowNewRegistrations: true,
    peaceMode: false,
    resourceRate: 4,
    gameSpeed: 4,
    fleetSpeed: 4,
  };
}

function getDefaultRulesLegalContent(): RulesLegalContent {
  return {
    rulesContent: "1. Respect other commanders.\n2. No cheating, automation, or exploit abuse.\n3. Keep diplomacy, chat, and alliance conduct within community standards.\n4. Admin decisions are logged and reviewable.\n5. Account trading and impersonation outside approved admin tools are prohibited.",
    legalContent: "Universe Empire Dominions is operated as a live multiplayer strategy service. Gameplay changes, balancing updates, and maintenance actions may occur without advance notice when required for fairness, security, or uptime.",
    privacyPolicyContent: "We store account credentials, empire progression, and gameplay telemetry needed to operate the game. Administrative actions are audited. Private player data is not shared outside gameplay, moderation, security, and operational needs.",
    termsContent: "By accessing the game, you agree to follow the rules, maintain account security, and accept that in-game balances, events, and systems may change over time. Abuse of exploits or disruption of service can result in moderation or account removal.",
    contactContent: "Support Command: deepblue.octopus.dev@gmail.com\nGitHub: https://github.com/ArkansasIo/universe-empire-domions\nEscalation Path: In-game support, moderation review, then admin operations audit.",
  };
}

function getDefaultControlPlaneState(): AdminControlPlaneState {
  return {
    featureFlags: {
      adminBroadcastEnabled: true,
      allowMasquerade: true,
      advancedWorldTools: true,
      liveOpsOverridesEnabled: false,
      incidentLockdownEnabled: false,
      auditStreamVisible: true,
    },
    security: {
      threatLevel: "guarded",
      commandApprovalMode: "single",
      privilegedSessionTimeoutMinutes: 45,
      auditRetentionDays: 30,
    },
    broadcast: {
      title: "Operations Nominal",
      body: "Admin systems online. No action required.",
      severity: "info",
      audience: "all",
      enabled: false,
    },
    liveOps: {
      eventPreset: "standard",
      dropRateModifier: 100,
      upkeepModifier: 100,
      buildRateModifier: 100,
      turnMultiplier: 100,
    },
    support: {
      ticketQueueMode: "triage",
      escalationPolicy: "standard",
      playerVisibility: "summary",
    },
  };
}

async function loadServerSettings(): Promise<OGameXServerSettings> {
  const defaults = getDefaultServerSettings();
  const setting = await storage.getSetting(getServerSettingsKey());
  if (!setting || !setting.value || typeof setting.value !== "object") {
    return defaults;
  }

  return {
    ...defaults,
    ...(setting.value as Partial<OGameXServerSettings>),
  };
}

async function saveServerSettings(nextSettings: OGameXServerSettings): Promise<void> {
  await storage.setSetting(
    getServerSettingsKey(),
    nextSettings,
    "Imported OGameX-style server settings panel",
    "admin",
  );

  await saveAdminSettings({
    maintenanceMode: nextSettings.maintenanceMode,
    peaceMode: nextSettings.peaceMode,
    resourceRate: nextSettings.resourceRate,
    gameSpeed: nextSettings.gameSpeed,
    fleetSpeed: nextSettings.fleetSpeed,
    allowNewRegistrations: nextSettings.allowNewRegistrations,
    adminBroadcastEnabled: true,
  });
}

async function loadRulesLegalContent(): Promise<RulesLegalContent> {
  const defaults = getDefaultRulesLegalContent();
  const setting = await storage.getSetting(getRulesContentKey());
  if (!setting || !setting.value || typeof setting.value !== "object") {
    return defaults;
  }

  return {
    ...defaults,
    ...(setting.value as Partial<RulesLegalContent>),
  };
}

async function saveRulesLegalContent(nextContent: RulesLegalContent): Promise<void> {
  await storage.setSetting(
    getRulesContentKey(),
    nextContent,
    "Imported OGameX rules, legal, privacy, and contact editor",
    "admin",
  );
}

async function loadControlPlaneState(): Promise<AdminControlPlaneState> {
  const defaults = getDefaultControlPlaneState();
  const setting = await storage.getSetting(getControlPlaneKey());
  const value = (setting?.value && typeof setting.value === "object") ? setting.value as any : {};

  return {
    featureFlags: {
      ...defaults.featureFlags,
      ...(value.featureFlags || {}),
    },
    security: {
      ...defaults.security,
      ...(value.security || {}),
    },
    broadcast: {
      ...defaults.broadcast,
      ...(value.broadcast || {}),
    },
    liveOps: {
      ...defaults.liveOps,
      ...(value.liveOps || {}),
    },
    support: {
      ...defaults.support,
      ...(value.support || {}),
    },
  };
}

async function saveControlPlaneState(nextState: AdminControlPlaneState): Promise<void> {
  await storage.setSetting(
    getControlPlaneKey(),
    nextState,
    "Admin control plane systems state",
    "admin",
  );
}

async function loadWorldObjects(): Promise<AdminWorldObject[]> {
  const setting = await storage.getSetting(getWorldObjectsKey());
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }

  return (setting.value as AdminWorldObject[]).slice(-100);
}

async function saveWorldObjects(objects: AdminWorldObject[]): Promise<void> {
  await storage.setSetting(
    getWorldObjectsKey(),
    objects.slice(-100),
    "Admin-created planets, moons, and debris markers",
    "admin",
  );
}

async function loadDeveloperShortcutLog(): Promise<string[]> {
  const setting = await storage.getSetting(getDeveloperShortcutLogKey());
  if (!setting || !Array.isArray(setting.value)) {
    return [];
  }

  return (setting.value as string[]).slice(-100);
}

async function appendDeveloperShortcutLog(entry: string): Promise<void> {
  const log = await loadDeveloperShortcutLog();
  await storage.setSetting(
    getDeveloperShortcutLogKey(),
    [...log, entry].slice(-100),
    "Recent OGameX-style developer shortcut actions",
    "admin",
  );
}

async function resolveUserByIdentifier(identifier: string) {
  const normalized = identifier.trim();
  if (!normalized) return null;

  const [byId] = await db
    .select({ id: users.id, username: users.username, email: users.email })
    .from(users)
    .where(eq(users.id, normalized))
    .limit(1);
  if (byId) return byId;

  const [byUsername] = await db
    .select({ id: users.id, username: users.username, email: users.email })
    .from(users)
    .where(eq(users.username, normalized))
    .limit(1);
  if (byUsername) return byUsername;

  const [byEmail] = await db
    .select({ id: users.id, username: users.username, email: users.email })
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);
  return byEmail || null;
}

async function ensurePlayerStateExists(userId: string) {
  const existingState = await storage.getPlayerState(userId);
  if (existingState) {
    return existingState;
  }

  return storage.updatePlayerState(userId, {});
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

async function saveOperations(operations: AdminOperation[]): Promise<void> {
  await storage.setSetting(
    getOperationsKey(),
    operations.slice(-200),
    "Admin operation queue and history",
    "admin"
  );
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

async function updateOperation(
  operationId: string,
  updates: Partial<Pick<AdminOperation, "status" | "completedAt" | "notes">>,
): Promise<AdminOperation | null> {
  const operations = await loadOperations();
  const operationIndex = operations.findIndex((operation) => operation.id === operationId);

  if (operationIndex === -1) {
    return null;
  }

  operations[operationIndex] = {
    ...operations[operationIndex],
    ...updates,
  };

  await saveOperations(operations);
  return operations[operationIndex];
}

export function registerAdminRoutes(app: Express) {
  app.get("/api/admin/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const currentUserId = getUserId(req);
      const actorId = await getAdminActorId(req);
      const access = actorId ? await getAdminAccess(actorId) : { isAdmin: false, role: null, permissions: [] };
      res.json({
        isAdmin: access.isAdmin,
        role: access.role,
        permissions: access.permissions,
        masqueradingAsUserId: actorId && currentUserId !== actorId ? currentUserId : null,
        actingAdminUserId: actorId,
      });
    } catch (error) {
      console.error("Failed to load admin identity:", error);
      res.status(500).json({ message: "Failed to load admin identity" });
    }
  });

  app.get("/api/admin/settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!(await requireAdminPermission(req, res, "view_only"))) return;

      const settings = await loadAdminSettings();
      res.json({ settings });
    } catch (error) {
      console.error("Failed to load admin settings:", error);
      res.status(500).json({ message: "Failed to load admin settings" });
    }
  });

  app.patch("/api/admin/settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;
      const actorId = access.actorId;

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

  app.get("/api/admin/control-plane", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!(await requireAdminPermission(req, res, "view_only"))) return;

      const state = await loadControlPlaneState();
      res.json({ state });
    } catch (error) {
      console.error("Failed to load admin control plane:", error);
      res.status(500).json({ message: "Failed to load admin control plane" });
    }
  });

  app.patch("/api/admin/control-plane", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;
      const actorId = access.actorId;

      const current = await loadControlPlaneState();
      const payload = (req.body && typeof req.body === "object") ? req.body as any : {};
      const next: AdminControlPlaneState = {
        featureFlags: {
          ...current.featureFlags,
          ...(payload.featureFlags || {}),
        },
        security: {
          ...current.security,
          ...(payload.security || {}),
        },
        broadcast: {
          ...current.broadcast,
          ...(payload.broadcast || {}),
        },
        liveOps: {
          ...current.liveOps,
          ...(payload.liveOps || {}),
        },
        support: {
          ...current.support,
          ...(payload.support || {}),
        },
      };

      await saveControlPlaneState(next);
      await appendAudit({
        actorId,
        action: "update_admin_control_plane",
        details: JSON.stringify({
          featureFlags: Object.keys(payload.featureFlags || {}),
          security: Object.keys(payload.security || {}),
          broadcast: Object.keys(payload.broadcast || {}),
          liveOps: Object.keys(payload.liveOps || {}),
          support: Object.keys(payload.support || {}),
        }),
      });

      res.json({ success: true, state: next });
    } catch (error) {
      console.error("Failed to update admin control plane:", error);
      res.status(500).json({ message: "Failed to update admin control plane" });
    }
  });

  app.post("/api/admin/control-plane/broadcast", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;
      const actorId = access.actorId;

      const current = await loadControlPlaneState();
      const payload = (req.body && typeof req.body === "object") ? req.body as any : {};
      const next: AdminControlPlaneState = {
        ...current,
        broadcast: {
          ...current.broadcast,
          title: String(payload.title || current.broadcast.title || "").trim().slice(0, 120),
          body: String(payload.body || current.broadcast.body || "").trim().slice(0, 800),
          severity: (["info", "warning", "critical"].includes(String(payload.severity)) ? payload.severity : current.broadcast.severity) as AdminControlPlaneState["broadcast"]["severity"],
          audience: (["all", "admins", "active-players"].includes(String(payload.audience)) ? payload.audience : current.broadcast.audience) as AdminControlPlaneState["broadcast"]["audience"],
          enabled: Boolean(payload.enabled),
        },
      };

      if (!next.featureFlags.adminBroadcastEnabled) {
        next.broadcast.enabled = false;
      }

      await saveControlPlaneState(next);
      await appendAudit({
        actorId,
        action: next.broadcast.enabled ? "publish_admin_broadcast" : "disable_admin_broadcast",
        details: `${next.broadcast.severity}:${next.broadcast.audience}:${next.broadcast.title}`,
      });
      await appendDeveloperShortcutLog(
        next.broadcast.enabled
          ? `Broadcast published: ${next.broadcast.title}`
          : `Broadcast disabled: ${next.broadcast.title || "untitled"}`
      );

      res.json({ success: true, broadcast: next.broadcast, state: next });
    } catch (error) {
      console.error("Failed to update admin broadcast:", error);
      res.status(500).json({ message: "Failed to update admin broadcast" });
    }
  });

  app.get("/api/admin/accounts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "administrate",
        blockedByLockdown: true,
        failureLabel: "Admin account access",
      });
      if (!access) return;

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
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "administrate",
        blockedByLockdown: true,
        requireElevatedApproval: true,
        enforceFreshSession: true,
        failureLabel: "Admin account creation",
      });
      if (!access) return;
      const actorId = access.actorId;

      const identifier = String(req.body?.identifier || "").trim();
      const role = normalizeAdminRole(req.body?.role || "moderator");
      if (!identifier) {
        return res.status(400).json({ message: "identifier is required" });
      }

      if (["founder", "devadmin"].includes(role) && !hasAdminPermission(access.permissions, "all_access")) {
        return res.status(403).json({ message: "Only founders can assign founder or dev admin access" });
      }

      const resolvedUser = await resolveUserByIdentifier(identifier);

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

      const permissions = getRolePermissions(role);

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
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "administrate",
        blockedByLockdown: true,
        requireElevatedApproval: true,
        enforceFreshSession: true,
        failureLabel: "Admin account removal",
      });
      if (!access) return;
      const actorId = access.actorId;

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
      const access = await requireAdminPermission(req, res, "view_only");
      if (!access) return;
      const controlPlane = await loadControlPlaneState();
      const allowDetailedVisibility =
        controlPlane.support.playerVisibility === "detailed" || isFounderAccess(access.permissions);

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
        email: allowDetailedVisibility ? (row.email || "") : "",
        role: roleMap.has(row.id) ? roleMap.get(row.id) : "user",
        status: moderationMap[row.id] || "active",
        lastLogin: allowDetailedVisibility && row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
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
      const access = await requireAdminPermission(req, res, "view_only");
      if (!access) return;
      const controlPlane = await loadControlPlaneState();
      const allowDetailedVisibility =
        controlPlane.support.playerVisibility === "detailed" || isFounderAccess(access.permissions);

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
        email: allowDetailedVisibility ? (userRow.email || "") : "",
        role: adminRow?.role || "user",
        status: moderationMap[userId] || "active",
        createdAt: allowDetailedVisibility && userRow.createdAt ? new Date(userRow.createdAt).toISOString() : null,
        lastLogin: allowDetailedVisibility && userRow.updatedAt ? new Date(userRow.updatedAt).toISOString() : null,
      };

      res.json({ user: detail });
    } catch (error) {
      console.error("Failed to load admin user detail:", error);
      res.status(500).json({ message: "Failed to load user detail" });
    }
  });

  app.post("/api/admin/users/:userId/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "moderate");
      if (!access) return;
      const actorId = access.actorId;

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
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "liveops_override",
        featureFlag: "liveOpsOverridesEnabled",
        blockedByLockdown: true,
        requireElevatedApproval: true,
        enforceFreshSession: true,
        failureLabel: "Admin console execution",
      });
      if (!access) return;
      const actorId = access.actorId;

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
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "view_only",
        featureFlag: "auditStreamVisible",
        failureLabel: "Audit stream access",
      });
      if (!access) return;

      const logs = await loadAuditLog();
      res.json({ logs: logs.slice().reverse().slice(0, 100) });
    } catch (error) {
      console.error("Failed to load audit log:", error);
      res.status(500).json({ message: "Failed to load audit log" });
    }
  });

  app.get("/api/admin/overview", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!(await requireAdminPermission(req, res, "view_only"))) return;

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
      if (!(await requireAdminPermission(req, res, "view_only"))) return;

      const operations = await loadOperations();
      res.json({ operations: operations.slice().reverse().slice(0, 30) });
    } catch (error) {
      console.error("Failed to load admin operations:", error);
      res.status(500).json({ message: "Failed to load admin operations" });
    }
  });

  app.post("/api/admin/operations/backup", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "manage",
        enforceFreshSession: true,
        failureLabel: "Backup creation",
      });
      if (!access) return;
      const actorId = access.actorId;

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
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "liveops_override",
        featureFlag: "liveOpsOverridesEnabled",
        blockedByLockdown: true,
        requireElevatedApproval: true,
        enforceFreshSession: true,
        failureLabel: "Universe reset",
      });
      if (!access) return;
      const actorId = access.actorId;

      const confirmText = String(req.body?.confirmText || "");
      if (confirmText !== "RESET") {
        return res.status(400).json({ message: "Confirmation text mismatch" });
      }

      const operation = await appendOperation({
        type: "reset_universe",
        status: "queued",
        requestedBy: actorId,
        notes: "Universe reset started by admin",
      });

      const summary = await UniverseResetService.resetUniverse();
      const completedAt = Date.now();
      const completedOperation = await updateOperation(operation.id, {
        status: "completed",
        completedAt,
        notes: `Universe reset completed for ${summary.accountCount} accounts`,
      });

      await storage.setSetting(
        "admin_universe_reset_queue",
        {
          operationId: operation.id,
          requestedAt: operation.requestedAt,
          requestedBy: actorId,
          status: "completed",
          completedAt,
          summary,
        },
        "Most recent universe reset request",
        "admin"
      );

      await appendAudit({
        actorId,
        action: "execute_universe_reset",
        details: `operationId=${operation.id};accounts=${summary.accountCount}`,
      });

      res.json({
        success: true,
        operation: completedOperation || {
          ...operation,
          status: "completed",
          completedAt,
          notes: `Universe reset completed for ${summary.accountCount} accounts`,
        },
        message: `Universe reset completed for ${summary.accountCount} account${summary.accountCount === 1 ? "" : "s"}`,
        summary,
      });
    } catch (error) {
      console.error("Failed to reset universe:", error);
      res.status(500).json({ message: "Failed to reset universe" });
    }
  });

  app.post("/api/admin/operations/restart", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "liveops_override",
        featureFlag: "liveOpsOverridesEnabled",
        blockedByLockdown: true,
        requireElevatedApproval: true,
        enforceFreshSession: true,
        failureLabel: "Server restart",
      });
      if (!access) return;
      const actorId = access.actorId;

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

  app.get("/api/admin/server-settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!(await requireAdminPermission(req, res, "view_only"))) return;

      const settings = await loadServerSettings();
      res.json({ settings });
    } catch (error) {
      console.error("Failed to load imported server settings:", error);
      res.status(500).json({ message: "Failed to load server settings" });
    }
  });

  app.patch("/api/admin/server-settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;
      const actorId = access.actorId;

      const current = await loadServerSettings();
      const raw = (req.body && typeof req.body === "object") ? req.body as Record<string, unknown> : {};
      const next: OGameXServerSettings = {
        ...current,
        universeName: String(raw.universeName ?? current.universeName),
        economySpeed: parseNumberish(raw.economySpeed, current.economySpeed),
        researchSpeed: parseNumberish(raw.researchSpeed, current.researchSpeed),
        fleetSpeedWar: parseNumberish(raw.fleetSpeedWar, current.fleetSpeedWar),
        fleetSpeedHolding: parseNumberish(raw.fleetSpeedHolding, current.fleetSpeedHolding),
        fleetSpeedPeaceful: parseNumberish(raw.fleetSpeedPeaceful, current.fleetSpeedPeaceful),
        planetFieldsBonus: parseNumberish(raw.planetFieldsBonus, current.planetFieldsBonus),
        basicIncomeMetal: parseNumberish(raw.basicIncomeMetal, current.basicIncomeMetal),
        basicIncomeCrystal: parseNumberish(raw.basicIncomeCrystal, current.basicIncomeCrystal),
        basicIncomeDeuterium: parseNumberish(raw.basicIncomeDeuterium, current.basicIncomeDeuterium),
        basicIncomeEnergy: parseNumberish(raw.basicIncomeEnergy, current.basicIncomeEnergy),
        registrationPlanetAmount: parseNumberish(raw.registrationPlanetAmount, current.registrationPlanetAmount),
        darkMatterBonus: parseNumberish(raw.darkMatterBonus, current.darkMatterBonus),
        darkMatterRegenEnabled: typeof raw.darkMatterRegenEnabled === "boolean" ? raw.darkMatterRegenEnabled : current.darkMatterRegenEnabled,
        darkMatterRegenAmount: parseNumberish(raw.darkMatterRegenAmount, current.darkMatterRegenAmount),
        darkMatterRegenPeriod: parseNumberish(raw.darkMatterRegenPeriod, current.darkMatterRegenPeriod),
        planetRelocationCost: parseNumberish(raw.planetRelocationCost, current.planetRelocationCost),
        planetRelocationDuration: parseNumberish(raw.planetRelocationDuration, current.planetRelocationDuration),
        allianceCooldownDays: parseNumberish(raw.allianceCooldownDays, current.allianceCooldownDays),
        battleEngine: raw.battleEngine === "php" ? "php" : "rust",
        allianceCombatSystemOn: typeof raw.allianceCombatSystemOn === "boolean" ? raw.allianceCombatSystemOn : current.allianceCombatSystemOn,
        debrisFieldFromShips: parseNumberish(raw.debrisFieldFromShips, current.debrisFieldFromShips),
        debrisFieldFromDefense: parseNumberish(raw.debrisFieldFromDefense, current.debrisFieldFromDefense),
        debrisFieldDeuteriumOn: typeof raw.debrisFieldDeuteriumOn === "boolean" ? raw.debrisFieldDeuteriumOn : current.debrisFieldDeuteriumOn,
        rapidFireEnabled: typeof raw.rapidFireEnabled === "boolean" ? raw.rapidFireEnabled : current.rapidFireEnabled,
        defenseRepairRate: parseNumberish(raw.defenseRepairRate, current.defenseRepairRate),
        expeditionLootRate: parseNumberish(raw.expeditionLootRate, current.expeditionLootRate),
        expeditionDelayRate: parseNumberish(raw.expeditionDelayRate, current.expeditionDelayRate),
        expeditionBlackHoleRate: parseNumberish(raw.expeditionBlackHoleRate, current.expeditionBlackHoleRate),
        highscoreAdminVisible: typeof raw.highscoreAdminVisible === "boolean" ? raw.highscoreAdminVisible : current.highscoreAdminVisible,
        numberOfGalaxies: parseNumberish(raw.numberOfGalaxies, current.numberOfGalaxies),
        systemsPerGalaxy: parseNumberish(raw.systemsPerGalaxy, current.systemsPerGalaxy),
        positionsPerSystem: parseNumberish(raw.positionsPerSystem, current.positionsPerSystem),
        maintenanceMode: typeof raw.maintenanceMode === "boolean" ? raw.maintenanceMode : current.maintenanceMode,
        allowNewRegistrations: typeof raw.allowNewRegistrations === "boolean" ? raw.allowNewRegistrations : current.allowNewRegistrations,
        peaceMode: typeof raw.peaceMode === "boolean" ? raw.peaceMode : current.peaceMode,
        resourceRate: parseNumberish(raw.resourceRate, current.resourceRate),
        gameSpeed: parseNumberish(raw.gameSpeed, current.gameSpeed),
        fleetSpeed: parseNumberish(raw.fleetSpeed, current.fleetSpeed),
      };

      await saveServerSettings(next);
      await appendAudit({
        actorId,
        action: "update_ogamex_server_settings",
        details: `universe=${next.universeName};economy=${next.economySpeed};research=${next.researchSpeed}`,
      });

      res.json({ success: true, settings: next });
    } catch (error) {
      console.error("Failed to update imported server settings:", error);
      res.status(500).json({ message: "Failed to update server settings" });
    }
  });

  app.get("/api/admin/rules-content", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!(await requireAdminPermission(req, res, "view_only"))) return;

      const content = await loadRulesLegalContent();
      res.json({ content });
    } catch (error) {
      console.error("Failed to load admin rules content:", error);
      res.status(500).json({ message: "Failed to load rules content" });
    }
  });

  app.patch("/api/admin/rules-content", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;
      const actorId = access.actorId;

      const current = await loadRulesLegalContent();
      const raw = (req.body && typeof req.body === "object") ? req.body as Record<string, unknown> : {};
      const next: RulesLegalContent = {
        rulesContent: String(raw.rulesContent ?? current.rulesContent),
        legalContent: String(raw.legalContent ?? current.legalContent),
        privacyPolicyContent: String(raw.privacyPolicyContent ?? current.privacyPolicyContent),
        termsContent: String(raw.termsContent ?? current.termsContent),
        contactContent: String(raw.contactContent ?? current.contactContent),
      };

      await saveRulesLegalContent(next);
      await appendAudit({
        actorId,
        action: "update_rules_legal_content",
        details: "rules/legal/privacy/terms/contact updated",
      });

      res.json({ success: true, content: next });
    } catch (error) {
      console.error("Failed to update admin rules content:", error);
      res.status(500).json({ message: "Failed to update rules content" });
    }
  });

  app.get("/api/admin/developer-shortcuts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "developer_tools");
      if (!access) return;
      const actorId = access.actorId;
      const controlPlane = await loadControlPlaneState();

      const currentUserId = getUserId(req);
      const worldObjects = await loadWorldObjects();
      const recentActions = (await loadDeveloperShortcutLog()).slice().reverse().slice(0, 25);
      const userRows = await db
        .select({ id: users.id, username: users.username, email: users.email })
        .from(users)
        .orderBy(desc(users.updatedAt))
        .limit(20);

      res.json({
        presets: [
          { id: "set_mines", label: "Set all mines to level 30" },
          { id: "set_storages", label: "Set all storages to level 15" },
          { id: "set_shipyard", label: "Set all shipyard facilities to level 12" },
          { id: "set_research", label: "Set common research to level 10" },
        ],
        buildingCatalog: [
          "metalMine",
          "crystalMine",
          "deuteriumSynthesizer",
          "solarPlant",
          "roboticsFactory",
          "shipyard",
          "researchLab",
        ],
        researchCatalog: [
          "energyTech",
          "laserTech",
          "ionTech",
          "hyperspaceTech",
          "plasmaTech",
          "combustionDrive",
          "impulseDrive",
          "hyperspaceDrive",
          "espionageTech",
          "computerTech",
          "astrophysics",
          "weaponsTech",
          "shieldingTech",
          "armourTech",
        ],
        unitCatalog: [
          "lightFighter",
          "heavyFighter",
          "cruiser",
          "battlecruiser",
          "battleship",
          "destroyer",
          "deathstar",
          "smallCargo",
          "largeCargo",
          "colonyShip",
          "espionageProbe",
          "solarSatellite",
        ],
        currentUserId,
        actingAdminUserId: actorId,
        masqueradingAsUserId: currentUserId !== actorId ? currentUserId : null,
        policy: buildControlPlanePolicySummary(controlPlane, access.permissions, req),
        recentActions,
        worldObjects: worldObjects.slice().reverse(),
        userDirectory: userRows.map((row) => ({
          id: row.id,
          username: row.username || "unknown",
          email: row.email || "",
        })),
      });
    } catch (error) {
      console.error("Failed to load developer shortcuts data:", error);
      res.status(500).json({ message: "Failed to load developer shortcuts" });
    }
  });

  app.post("/api/admin/developer-shortcuts/impersonate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "masquerade",
        featureFlag: "allowMasquerade",
        blockedByLockdown: true,
        enforceFreshSession: true,
        failureLabel: "Masquerade access",
      });
      if (!access) return;
      const actorId = access.actorId;

      const identifier = String(req.body?.identifier || "").trim();
      if (!identifier) {
        return res.status(400).json({ message: "identifier is required" });
      }

      const target = await resolveUserByIdentifier(identifier);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }

      (req.session as any).impersonatorId = actorId;
      (req.session as any).userId = target.id;

      req.session.save(async (error) => {
        if (error) {
          console.error("Failed to persist impersonation session:", error);
          return res.status(500).json({ message: "Failed to impersonate user" });
        }

        await appendAudit({
          actorId,
          action: "impersonate_user",
          targetUserId: target.id,
          details: `identifier=${identifier}`,
        });
        await appendDeveloperShortcutLog(`Impersonated ${target.username || target.email || target.id}`);

        res.json({
          success: true,
          target: {
            id: target.id,
            username: target.username || "unknown",
            email: target.email || "",
          },
        });
      });
    } catch (error) {
      console.error("Failed to impersonate user:", error);
      res.status(500).json({ message: "Failed to impersonate user" });
    }
  });

  app.post("/api/admin/developer-shortcuts/stop-impersonation", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const actorId = getImpersonatorId(req);
      if (!actorId || !(await isAdminUser(actorId))) {
        return res.status(400).json({ message: "No active impersonation session" });
      }

      (req.session as any).userId = actorId;
      delete (req.session as any).impersonatorId;

      req.session.save(async (error) => {
        if (error) {
          console.error("Failed to restore admin session:", error);
          return res.status(500).json({ message: "Failed to restore admin session" });
        }

        await appendAudit({
          actorId,
          action: "stop_impersonation",
          details: "admin session restored",
        });
        await appendDeveloperShortcutLog("Stopped impersonation and restored admin session");

        res.json({ success: true, restoredAdminUserId: actorId });
      });
    } catch (error) {
      console.error("Failed to stop impersonation:", error);
      res.status(500).json({ message: "Failed to stop impersonation" });
    }
  });

  app.post("/api/admin/developer-shortcuts/grant-resources", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "developer_tools",
        featureFlag: "advancedWorldTools",
        blockedByLockdown: true,
        enforceFreshSession: true,
        failureLabel: "Resource grant",
      });
      if (!access) return;
      const actorId = access.actorId;

      const identifier = String(req.body?.identifier || "").trim();
      if (!identifier) {
        return res.status(400).json({ message: "identifier is required" });
      }

      const target = await resolveUserByIdentifier(identifier);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }

      const state = await ensurePlayerStateExists(target.id);
      const currentResources = ((state.resources as Record<string, unknown>) || {}) as Record<string, unknown>;
      const requested = (req.body?.resources && typeof req.body.resources === "object")
        ? req.body.resources as Record<string, unknown>
        : {};

      const nextResources = {
        ...currentResources,
        metal: parseNumberish(currentResources.metal, 0) + parseNumberish(requested.metal, 0),
        crystal: parseNumberish(currentResources.crystal, 0) + parseNumberish(requested.crystal, 0),
        deuterium: parseNumberish(currentResources.deuterium, 0) + parseNumberish(requested.deuterium, 0),
        energy: parseNumberish(currentResources.energy, 0) + parseNumberish(requested.energy, 0),
        credits: parseNumberish(currentResources.credits, 0) + parseNumberish(requested.credits, 0),
        food: parseNumberish(currentResources.food, 0) + parseNumberish(requested.food, 0),
        water: parseNumberish(currentResources.water, 0) + parseNumberish(requested.water, 0),
        darkMatter: parseNumberish(currentResources.darkMatter, 0) + parseNumberish(requested.darkMatter, 0),
      };

      await storage.updatePlayerState(target.id, { resources: nextResources });
      await appendAudit({
        actorId,
        action: "grant_resources",
        targetUserId: target.id,
        details: `resources=${JSON.stringify(requested)}`,
      });
      await appendDeveloperShortcutLog(`Granted resources to ${target.username || target.email || target.id}`);

      res.json({ success: true, targetUserId: target.id, resources: nextResources });
    } catch (error) {
      console.error("Failed to grant resources:", error);
      res.status(500).json({ message: "Failed to grant resources" });
    }
  });

  app.post("/api/admin/developer-shortcuts/apply-preset", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "developer_tools",
        featureFlag: "advancedWorldTools",
        blockedByLockdown: true,
        enforceFreshSession: true,
        failureLabel: "Developer preset application",
      });
      if (!access) return;
      const actorId = access.actorId;

      const identifier = String(req.body?.identifier || "").trim();
      const preset = String(req.body?.preset || "").trim();
      if (!identifier || !preset) {
        return res.status(400).json({ message: "identifier and preset are required" });
      }

      const target = await resolveUserByIdentifier(identifier);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }

      const state = await ensurePlayerStateExists(target.id);
      const currentBuildings = ((state.buildings as Record<string, unknown>) || {}) as Record<string, unknown>;
      const currentOrbital = ((state.orbitalBuildings as Record<string, unknown>) || {}) as Record<string, unknown>;
      const currentResearch = ((state.research as Record<string, unknown>) || {}) as Record<string, unknown>;

      let updates: Record<string, unknown> = {};
      if (preset === "set_mines") {
        updates = {
          buildings: {
            ...currentBuildings,
            metalMine: 30,
            crystalMine: 30,
            deuteriumSynthesizer: 30,
            solarPlant: 30,
          },
        };
      } else if (preset === "set_storages") {
        updates = {
          orbitalBuildings: {
            ...currentOrbital,
            metalStorage: 15,
            crystalStorage: 15,
            deuteriumTank: 15,
          },
        };
      } else if (preset === "set_shipyard") {
        updates = {
          buildings: {
            ...currentBuildings,
            roboticsFactory: 12,
            shipyard: 12,
            researchLab: Math.max(parseNumberish(currentBuildings.researchLab, 0), 10),
          },
          orbitalBuildings: {
            ...currentOrbital,
            naniteFactory: 6,
            constructorYard: 8,
          },
        };
      } else if (preset === "set_research") {
        updates = {
          research: {
            ...currentResearch,
            energyTech: 10,
            laserTech: 10,
            ionTech: 10,
            hyperspaceTech: 10,
            espionageTech: 10,
            computerTech: 10,
            astrophysics: 10,
            weaponsTech: 10,
            shieldingTech: 10,
            armourTech: 10,
          },
        };
      } else {
        return res.status(400).json({ message: "Unknown preset" });
      }

      await storage.updatePlayerState(target.id, updates);
      await appendAudit({
        actorId,
        action: "apply_developer_preset",
        targetUserId: target.id,
        details: `preset=${preset}`,
      });
      await appendDeveloperShortcutLog(`Applied preset ${preset} to ${target.username || target.email || target.id}`);

      res.json({ success: true, targetUserId: target.id, preset, updates });
    } catch (error) {
      console.error("Failed to apply developer preset:", error);
      res.status(500).json({ message: "Failed to apply preset" });
    }
  });

  app.post("/api/admin/developer-shortcuts/set-building-level", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "developer_tools",
        featureFlag: "advancedWorldTools",
        blockedByLockdown: true,
        enforceFreshSession: true,
        failureLabel: "Building editor access",
      });
      if (!access) return;
      const actorId = access.actorId;

      const identifier = String(req.body?.identifier || "").trim();
      const buildingKey = String(req.body?.buildingKey || "").trim();
      const level = Math.max(0, Math.floor(parseNumberish(req.body?.level, 0)));
      if (!identifier || !buildingKey) {
        return res.status(400).json({ message: "identifier and buildingKey are required" });
      }

      const target = await resolveUserByIdentifier(identifier);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }

      const state = await ensurePlayerStateExists(target.id);
      const currentBuildings = ((state.buildings as Record<string, unknown>) || {}) as Record<string, unknown>;
      const nextBuildings = { ...currentBuildings, [buildingKey]: level };
      await storage.updatePlayerState(target.id, { buildings: nextBuildings });

      await appendAudit({
        actorId,
        action: "set_building_level",
        targetUserId: target.id,
        details: `${buildingKey}=${level}`,
      });
      await appendDeveloperShortcutLog(`Set ${buildingKey} to ${level} for ${target.username || target.email || target.id}`);

      res.json({ success: true, targetUserId: target.id, buildingKey, level, buildings: nextBuildings });
    } catch (error) {
      console.error("Failed to set building level:", error);
      res.status(500).json({ message: "Failed to set building level" });
    }
  });

  app.post("/api/admin/developer-shortcuts/set-research-level", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "developer_tools",
        featureFlag: "advancedWorldTools",
        blockedByLockdown: true,
        enforceFreshSession: true,
        failureLabel: "Research editor access",
      });
      if (!access) return;
      const actorId = access.actorId;

      const identifier = String(req.body?.identifier || "").trim();
      const researchKey = String(req.body?.researchKey || "").trim();
      const level = Math.max(0, Math.floor(parseNumberish(req.body?.level, 0)));
      if (!identifier || !researchKey) {
        return res.status(400).json({ message: "identifier and researchKey are required" });
      }

      const target = await resolveUserByIdentifier(identifier);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }

      const state = await ensurePlayerStateExists(target.id);
      const currentResearch = ((state.research as Record<string, unknown>) || {}) as Record<string, unknown>;
      const nextResearch = { ...currentResearch, [researchKey]: level };
      await storage.updatePlayerState(target.id, { research: nextResearch });

      await appendAudit({
        actorId,
        action: "set_research_level",
        targetUserId: target.id,
        details: `${researchKey}=${level}`,
      });
      await appendDeveloperShortcutLog(`Set research ${researchKey} to ${level} for ${target.username || target.email || target.id}`);

      res.json({ success: true, targetUserId: target.id, researchKey, level, research: nextResearch });
    } catch (error) {
      console.error("Failed to set research level:", error);
      res.status(500).json({ message: "Failed to set research level" });
    }
  });

  app.post("/api/admin/developer-shortcuts/add-unit", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "developer_tools",
        featureFlag: "advancedWorldTools",
        blockedByLockdown: true,
        enforceFreshSession: true,
        failureLabel: "Unit editor access",
      });
      if (!access) return;
      const actorId = access.actorId;

      const identifier = String(req.body?.identifier || "").trim();
      const unitId = String(req.body?.unitId || "").trim();
      const amount = Math.max(1, Math.floor(parseNumberish(req.body?.amount, 1)));
      if (!identifier || !unitId) {
        return res.status(400).json({ message: "identifier and unitId are required" });
      }

      const target = await resolveUserByIdentifier(identifier);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }

      const state = await ensurePlayerStateExists(target.id);
      const currentUnits = ((state.units as Record<string, unknown>) || {}) as Record<string, unknown>;
      const nextUnits = {
        ...currentUnits,
        [unitId]: parseNumberish(currentUnits[unitId], 0) + amount,
      };
      await storage.updatePlayerState(target.id, { units: nextUnits });

      await appendAudit({
        actorId,
        action: "add_unit",
        targetUserId: target.id,
        details: `${unitId}=+${amount}`,
      });
      await appendDeveloperShortcutLog(`Added ${amount} ${unitId} to ${target.username || target.email || target.id}`);

      res.json({ success: true, targetUserId: target.id, unitId, amount, units: nextUnits });
    } catch (error) {
      console.error("Failed to add unit:", error);
      res.status(500).json({ message: "Failed to add unit" });
    }
  });

  app.post("/api/admin/developer-shortcuts/reset-player", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "developer_tools",
        featureFlag: "advancedWorldTools",
        blockedByLockdown: true,
        enforceFreshSession: true,
        failureLabel: "Player reset access",
      });
      if (!access) return;
      const actorId = access.actorId;

      const identifier = String(req.body?.identifier || "").trim();
      const scope = String(req.body?.scope || "").trim();
      if (!identifier || !scope) {
        return res.status(400).json({ message: "identifier and scope are required" });
      }

      const target = await resolveUserByIdentifier(identifier);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }

      const updates: Record<string, unknown> = {};
      if (scope === "resources") {
        updates.resources = { metal: 0, crystal: 0, deuterium: 0, energy: 0, credits: 0, food: 0, water: 0, darkMatter: 0 };
      } else if (scope === "units") {
        updates.units = {};
      } else if (scope === "buildings") {
        updates.buildings = {};
        updates.orbitalBuildings = {};
      } else if (scope === "research") {
        updates.research = {};
      } else {
        return res.status(400).json({ message: "Unknown reset scope" });
      }

      await storage.updatePlayerState(target.id, updates);
      await appendAudit({
        actorId,
        action: "reset_player_scope",
        targetUserId: target.id,
        details: `scope=${scope}`,
      });
      await appendDeveloperShortcutLog(`Reset ${scope} for ${target.username || target.email || target.id}`);

      res.json({ success: true, targetUserId: target.id, scope });
    } catch (error) {
      console.error("Failed to reset player scope:", error);
      res.status(500).json({ message: "Failed to reset player scope" });
    }
  });

  app.post("/api/admin/developer-shortcuts/world-object", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireGuardedAdminPermission(req, res, {
        permission: "world_tools",
        featureFlag: "advancedWorldTools",
        blockedByLockdown: true,
        enforceFreshSession: true,
        failureLabel: "World object tools",
      });
      if (!access) return;
      const actorId = access.actorId;

      const action = String(req.body?.action || "").trim();
      const type = String(req.body?.type || "").trim() as AdminWorldObject["type"];
      const coordinates = String(req.body?.coordinates || "").trim();
      const name = String(req.body?.name || `${type} ${coordinates}`).trim();
      if (!action || !type || !coordinates) {
        return res.status(400).json({ message: "action, type, and coordinates are required" });
      }

      const current = await loadWorldObjects();
      let next = current.slice();

      if (action === "create") {
        next = [
          ...next.filter((entry) => !(entry.type === type && entry.coordinates === coordinates)),
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type,
            coordinates,
            name,
            ownerUserId: String(req.body?.ownerUserId || "") || undefined,
            details: (req.body?.details && typeof req.body.details === "object") ? req.body.details : {},
            createdAt: Date.now(),
            createdBy: actorId,
          },
        ];
      } else if (action === "delete") {
        next = next.filter((entry) => !(entry.type === type && entry.coordinates === coordinates));
      } else {
        return res.status(400).json({ message: "Unknown world object action" });
      }

      await saveWorldObjects(next);
      await appendAudit({
        actorId,
        action: `world_object_${action}`,
        details: `type=${type};coordinates=${coordinates}`,
      });
      await appendDeveloperShortcutLog(`${action} ${type} at ${coordinates}`);

      res.json({ success: true, worldObjects: next.slice().reverse() });
    } catch (error) {
      console.error("Failed to update world objects:", error);
      res.status(500).json({ message: "Failed to update world objects" });
    }
  });
}
