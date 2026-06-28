import type { AdminControlPlaneState } from "@/lib/adminControlSystems";

export type AdminMeResponse = {
  isAdmin: boolean;
  role: string | null;
  permissions?: string[];
  masqueradingAsUserId?: string | null;
  actingAdminUserId?: string | null;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: "active" | "muted" | "banned";
  role: string;
  lastLogin: string | null;
  ip: string;
};

export type AdminUsersResponse = { users: AdminUser[] };

export type AdminOverviewResponse = {
  totalUsers: number;
  bannedUsers: number;
  mutedUsers: number;
  activeUsersEstimate: number;
};

export type AdminAuditResponse = {
  logs: Array<{
    id: string;
    timestamp: number;
    actorId: string;
    action: string;
    targetUserId?: string;
    details?: string;
  }>;
};

export type AdminAccountsResponse = {
  accounts: Array<{
    id: string;
    userId: string;
    role: string;
    username: string;
    email: string;
    permissions?: string[];
    createdAt?: string | number | null;
  }>;
};

export type AdminOperationsResponse = {
  operations: Array<{
    id: string;
    type: string;
    status: string;
    requestedBy: string;
    requestedAt: number;
    completedAt?: number;
    notes?: string;
  }>;
};

export type ServerSettings = {
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

export type RulesContent = {
  rulesContent: string;
  legalContent: string;
  privacyPolicyContent: string;
  termsContent: string;
  contactContent: string;
};

export type DeveloperShortcutsResponse = {
  presets: Array<{ id: string; label: string }>;
  buildingCatalog: string[];
  researchCatalog: string[];
  unitCatalog: string[];
  currentUserId: string;
  actingAdminUserId: string | null;
  masqueradingAsUserId: string | null;
  policy: {
    isFounder: boolean;
    incidentLockdownEnabled: boolean;
    commandApprovalMode: "single" | "dual" | "founder";
    privilegedSessionTimeoutMinutes: number;
    features: {
      masquerade: boolean;
      advancedWorldTools: boolean;
      liveOpsOverrides: boolean;
      auditStreamVisible: boolean;
    };
    support: AdminControlPlaneState["support"];
    requiresFounderApproval: boolean;
    requiresDualApproval: boolean;
    sessionFresh: boolean;
  };
  recentActions: string[];
  worldObjects: Array<{
    id: string;
    type: "planet" | "moon" | "debris";
    coordinates: string;
    name: string;
    ownerUserId?: string;
    createdAt: number;
  }>;
  userDirectory: Array<{
    id: string;
    username: string;
    email: string;
  }>;
};

export type AdminControlPlaneResponse = {
  state: AdminControlPlaneState;
};

export function formatAdminUptime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || "Request failed");
  return payload as T;
}

export const DEFAULT_SERVER_SETTINGS: ServerSettings = {
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

export const DEFAULT_RULES: RulesContent = {
  rulesContent: "",
  legalContent: "",
  privacyPolicyContent: "",
  termsContent: "",
  contactContent: "",
};
