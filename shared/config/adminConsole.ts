export type AdminSubsystemId =
  | "command"
  | "players"
  | "economy"
  | "universe"
  | "moderation"
  | "security"
  | "liveops"
  | "content"
  | "developer"
  | "audit";

export type AdminCapability =
  | "view_only"
  | "moderate"
  | "manage"
  | "administrate"
  | "developer_tools"
  | "world_tools"
  | "liveops_override"
  | "masquerade"
  | "all_access";

export type AdminControlTone = "blue" | "amber" | "red" | "violet" | "cyan";

export interface AdminSubMenuDefinition {
  id: string;
  label: string;
  description: string;
  capability: AdminCapability;
}

export interface AdminMenuDefinition {
  id: AdminSubsystemId;
  label: string;
  description: string;
  tone: AdminControlTone;
  capability: AdminCapability;
  subMenus: AdminSubMenuDefinition[];
}

export const ADMIN_CONSOLE_MENUS: AdminMenuDefinition[] = [
  {
    id: "command",
    label: "Command Center",
    description: "Live control-plane posture and system health.",
    tone: "blue",
    capability: "view_only",
    subMenus: [
      { id: "overview", label: "Overview", description: "System posture and live metrics.", capability: "view_only" },
      { id: "health", label: "Health", description: "Runtime and service diagnostics.", capability: "view_only" },
    ],
  },
  {
    id: "players",
    label: "Players",
    description: "Search, inspect, and operate on player accounts.",
    tone: "cyan",
    capability: "view_only",
    subMenus: [
      { id: "directory", label: "Directory", description: "Player search and account summaries.", capability: "view_only" },
      { id: "operations", label: "Player Operations", description: "Resources, reset, and state actions.", capability: "manage" },
    ],
  },
  {
    id: "economy",
    label: "Economy",
    description: "Resource rates, storage, market, and live economy controls.",
    tone: "amber",
    capability: "view_only",
    subMenus: [
      { id: "rates", label: "Rates", description: "Baseline resource and game speed settings.", capability: "manage" },
      { id: "market", label: "Market", description: "Market order volume and cleanup tools.", capability: "manage" },
    ],
  },
  {
    id: "universe",
    label: "Universe",
    description: "World objects, guilds, alliances, and spatial controls.",
    tone: "violet",
    capability: "view_only",
    subMenus: [
      { id: "world", label: "World Objects", description: "Planets, moons, and debris tools.", capability: "world_tools" },
      { id: "organizations", label: "Organizations", description: "Guild and alliance oversight.", capability: "manage" },
    ],
  },
  {
    id: "moderation",
    label: "Moderation",
    description: "Player safety, account access, and administrator roles.",
    tone: "red",
    capability: "moderate",
    subMenus: [
      { id: "status", label: "Player Status", description: "Mute, ban, and restore player access.", capability: "moderate" },
      { id: "admins", label: "Admin Accounts", description: "Grant and revoke administrative roles.", capability: "administrate" },
    ],
  },
  {
    id: "security",
    label: "Security",
    description: "Threat posture, approvals, and privileged tool guardrails.",
    tone: "red",
    capability: "view_only",
    subMenus: [
      { id: "posture", label: "Posture", description: "Threat level and approval mode.", capability: "manage" },
      { id: "guardrails", label: "Guardrails", description: "Masquerade, world tools, and audit flags.", capability: "manage" },
    ],
  },
  {
    id: "liveops",
    label: "LiveOps",
    description: "Events, announcements, and temporary overrides.",
    tone: "amber",
    capability: "view_only",
    subMenus: [
      { id: "events", label: "Events", description: "Presets and event posture.", capability: "liveops_override" },
      { id: "broadcast", label: "Broadcast", description: "Admin announcements and player messaging.", capability: "manage" },
    ],
  },
  {
    id: "content",
    label: "Content",
    description: "Rules, legal text, localization, and operational copy.",
    tone: "blue",
    capability: "view_only",
    subMenus: [
      { id: "rules", label: "Rules & Legal", description: "Rules, privacy, terms, and contact copy.", capability: "manage" },
      { id: "localization", label: "Localization", description: "Language and translation management.", capability: "manage" },
    ],
  },
  {
    id: "developer",
    label: "Developer",
    description: "Controlled shortcuts, world tools, and diagnostics.",
    tone: "violet",
    capability: "developer_tools",
    subMenus: [
      { id: "shortcuts", label: "Shortcuts", description: "Safe developer state operations.", capability: "developer_tools" },
      { id: "database", label: "Database", description: "Read-only schema and query tools.", capability: "developer_tools" },
    ],
  },
  {
    id: "audit",
    label: "Audit",
    description: "Administrative actions, operation history, and accountability.",
    tone: "cyan",
    capability: "view_only",
    subMenus: [
      { id: "history", label: "History", description: "Chronological admin action review.", capability: "view_only" },
      { id: "operations", label: "Operations", description: "Backup, restart, and reset history.", capability: "view_only" },
    ],
  },
];

export interface AdminHubMetrics {
  players: number;
  activePlayers: number;
  adminAccounts: number;
  guilds: number;
  alliances: number;
  activeMarketOrders: number;
  activeMissions: number;
  battlesLast24Hours: number;
  uptimeSeconds: number;
  memoryMb: number;
  database: "connected" | "degraded" | "unavailable";
  generatedAt: string;
}

export interface AdminHubPlayerSummary {
  id: string;
  username: string | null;
  email: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  hasPlayerState: boolean;
  setupComplete: boolean;
  planetName: string | null;
  coordinates: string | null;
  empireLevel: number;
  tier: number;
  moderationStatus: "active" | "muted" | "banned";
}

export interface AdminHubPlayerDetail extends AdminHubPlayerSummary {
  resources: Record<string, number>;
  storage: Record<string, number>;
  buildings: Record<string, number>;
  research: Record<string, number>;
  units: Record<string, number>;
  guild: { id: string; name: string; role: string } | null;
  lastResourceUpdate: string | null;
}

export interface AdminHubOperationResult {
  success: true;
  action: string;
  targetUserId?: string;
  changed: Record<string, number | string | boolean>;
  auditId: string;
}

export const ADMIN_RESOURCE_KEYS = [
  "metal",
  "crystal",
  "deuterium",
  "energy",
  "naquadah",
  "food",
  "water",
  "credits",
  "darkMatter",
] as const;

export type AdminResourceKey = (typeof ADMIN_RESOURCE_KEYS)[number];

export function hasAdminCapability(permissions: string[] | undefined, capability: AdminCapability) {
  if (!permissions?.length) return false;
  return permissions.includes("all_access") || permissions.includes(capability);
}

export function normalizeAdminResourceDelta(input: unknown): Partial<Record<AdminResourceKey, number>> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const delta: Partial<Record<AdminResourceKey, number>> = {};
  for (const key of ADMIN_RESOURCE_KEYS) {
    const raw = (input as Record<string, unknown>)[key];
    if (raw === undefined || raw === "") continue;
    const parsed = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(parsed)) return null;
    const amount = Math.max(-1_000_000_000, Math.min(1_000_000_000, Math.trunc(parsed)));
    if (amount !== 0) delta[key] = amount;
  }
  return Object.keys(delta).length ? delta : null;
}

export function formatAdminUptime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}
