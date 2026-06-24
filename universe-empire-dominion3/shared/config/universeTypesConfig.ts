export type UniverseType = "seasonal" | "permanent" | "speed" | "tournament";

export interface UniverseDefinition {
  id: string;
  name: string;
  type: UniverseType;
  description: string;
  region: "NA" | "EU" | "APAC" | "Global";
  maxPlayers: number;
  currentPlayers: number;
  status: "active" | "starting" | "ending" | "migrating" | "closed";
  speed: { economy: number; fleet: number; research: number };
  features: UniverseFeatures;
  startDate: string;
  endDate?: string;
  migrationTarget?: string;
  seasonId?: string;
  color: string;
  bonus: string;
}

export interface UniverseFeatures {
  pvp: boolean;
  pve: boolean;
  trading: boolean;
  alliances: boolean;
  expeditions: boolean;
  megastructures: boolean;
  seasonalTech: boolean;
  seasonPass: boolean;
  championships: boolean;
  offlineAccrual: boolean;
  newbieProtection: boolean;
  newbieProtectionDays: number;
  fleetSave: boolean;
  ipm: boolean;
  rip: boolean;
}

export interface MigrationPlan {
  sourceUniverseId: string;
  targetUniverseId: string;
  migrationWindow: { start: string; end: string };
  keepsPlanets: boolean;
  keepsResources: boolean;
  keepsResearch: boolean;
  keepsShips: boolean;
  keepsDefenses: boolean;
  keepsItems: boolean;
  keepsAlliance: boolean;
  losesSeasonalTech: boolean;
  losesSeasonalCurrency: boolean;
  losesTemporaryBuffs: boolean;
  levelCompression: boolean;
  compressionRatio: number;
}

export interface PermanentUniverseExtra {
  megaProjects: MegaProject[];
  sovereignty: SovereigntySystem;
  galacticHistory: GalacticHistoryEntry[];
}

export interface MegaProject {
  id: string;
  name: string;
  description: string;
  type: "stargate" | "dyson_swarm" | "galactic_senate" | "wormhole_network";
  requiredResources: { metal: number; crystal: number; deuterium: number };
  contributionPlayers: number;
  constructionTime: number;
  effect: { type: string; value: number; description: string };
  completedBy?: string;
  completedAt?: string;
}

export interface SovereigntySystem {
  enabled: boolean;
  sectorClaimCost: { credits: number };
  taxRate: number;
  maxSectorsPerAlliance: number;
  warDeclarationCost: number;
}

export interface GalacticHistoryEntry {
  id: string;
  eventType: string;
  description: string;
  playerId?: string;
  playerName?: string;
  allianceId?: string;
  allianceName?: string;
  timestamp: string;
  data?: Record<string, any>;
}

export const UNIVERSE_LIST: UniverseDefinition[] = [
  {
    id: "nexus-alpha",
    name: "Nexus Alpha",
    type: "permanent",
    description: "The flagship permanent universe. Largest player base, most active economy, lasting alliances.",
    region: "NA",
    maxPlayers: 12000,
    currentPlayers: 8432,
    status: "active",
    speed: { economy: 1, fleet: 1, research: 1 },
    features: {
      pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
      megastructures: true, seasonalTech: false, seasonPass: false, championships: false,
      offlineAccrual: true, newbieProtection: true, newbieProtectionDays: 7,
      fleetSave: true, ipm: true, rip: true,
    },
    startDate: "2025-01-01T00:00:00Z",
    color: "#6366f1",
    bonus: "Legacy universe with mega-projects and sovereignty",
  },
  {
    id: "cygnus-eu",
    name: "Cygnus EU",
    type: "permanent",
    description: "European permanent universe. Balanced gameplay and strong alliance scene.",
    region: "EU",
    maxPlayers: 10000,
    currentPlayers: 6128,
    status: "active",
    speed: { economy: 1, fleet: 1, research: 1 },
    features: {
      pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
      megastructures: true, seasonalTech: false, seasonPass: false, championships: false,
      offlineAccrual: true, newbieProtection: true, newbieProtectionDays: 7,
      fleetSave: true, ipm: true, rip: true,
    },
    startDate: "2025-01-01T00:00:00Z",
    color: "#22c55e",
    bonus: "Strong alliance diplomacy and trade",
  },
  {
    id: "season-1-exploration",
    name: "S1: Age of Exploration",
    type: "seasonal",
    description: "Season 1 — Discover what lies beyond. Expedition-focused with seasonal tech tree and 100-tier season pass.",
    region: "Global",
    maxPlayers: 15000,
    currentPlayers: 11247,
    status: "active",
    speed: { economy: 2, fleet: 1, research: 2 },
    features: {
      pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
      megastructures: false, seasonalTech: true, seasonPass: true, championships: true,
      offlineAccrual: true, newbieProtection: true, newbieProtectionDays: 3,
      fleetSave: true, ipm: false, rip: false,
    },
    startDate: "2026-01-15T00:00:00Z",
    endDate: "2026-04-09T00:00:00Z",
    migrationTarget: "nexus-alpha",
    seasonId: "season_1_age_of_exploration",
    color: "#8b5cf6",
    bonus: "+100% econ/research speed, season pass & tech",
  },
  {
    id: "season-2-war",
    name: "S2: Galactic War",
    type: "seasonal",
    description: "Season 2 — All-out PvP warfare. Fleet speed 4x, combat-focused season.",
    region: "Global",
    maxPlayers: 15000,
    currentPlayers: 0,
    status: "starting",
    speed: { economy: 1, fleet: 4, research: 1 },
    features: {
      pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
      megastructures: false, seasonalTech: true, seasonPass: true, championships: true,
      offlineAccrual: true, newbieProtection: true, newbieProtectionDays: 3,
      fleetSave: true, ipm: false, rip: false,
    },
    startDate: "2026-04-10T00:00:00Z",
    endDate: "2026-07-03T00:00:00Z",
    migrationTarget: "nexus-alpha",
    seasonId: "season_2_galactic_war",
    color: "#ef4444",
    bonus: "+300% fleet speed, war-focused events",
  },
  {
    id: "speed-1",
    name: "Speed Server",
    type: "speed",
    description: "Fast-paced universe with 5x all speeds. For experienced players who want rapid progression.",
    region: "Global",
    maxPlayers: 8000,
    currentPlayers: 3219,
    status: "active",
    speed: { economy: 5, fleet: 5, research: 5 },
    features: {
      pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
      megastructures: true, seasonalTech: false, seasonPass: false, championships: false,
      offlineAccrual: true, newbieProtection: false, newbieProtectionDays: 0,
      fleetSave: true, ipm: true, rip: true,
    },
    startDate: "2025-06-01T00:00:00Z",
    color: "#f59e0b",
    bonus: "5x all speeds, rapid progression",
  },
];

export const MIGRATION_PLANS: MigrationPlan[] = [
  {
    sourceUniverseId: "season-1-exploration",
    targetUniverseId: "nexus-alpha",
    migrationWindow: { start: "2026-04-09T00:00:00Z", end: "2026-04-16T00:00:00Z" },
    keepsPlanets: true,
    keepsResources: true,
    keepsResearch: true,
    keepsShips: true,
    keepsDefenses: true,
    keepsItems: true,
    keepsAlliance: false,
    losesSeasonalTech: true,
    losesSeasonalCurrency: true,
    losesTemporaryBuffs: true,
    levelCompression: true,
    compressionRatio: 0.7,
  },
  {
    sourceUniverseId: "season-2-war",
    targetUniverseId: "nexus-alpha",
    migrationWindow: { start: "2026-07-03T00:00:00Z", end: "2026-07-10T00:00:00Z" },
    keepsPlanets: true,
    keepsResources: true,
    keepsResearch: true,
    keepsShips: true,
    keepsDefenses: true,
    keepsItems: true,
    keepsAlliance: false,
    losesSeasonalTech: true,
    losesSeasonalCurrency: true,
    losesTemporaryBuffs: true,
    levelCompression: true,
    compressionRatio: 0.7,
  },
];

export const PERMANENT_UNIVERSE_EXTRAS: Record<string, PermanentUniverseExtra> = {
  "nexus-alpha": {
    megaProjects: [
      { id: "mp_stargate", name: "Galactic Stargate", description: "A massive stargate connecting distant parts of the galaxy. All alliance members gain instant fleet travel.", type: "stargate", requiredResources: { metal: 500000000, crystal: 250000000, deuterium: 100000000 }, contributionPlayers: 200, constructionTime: 2592000000, effect: { type: "instant_travel", value: 1, description: "Instant fleet travel for alliance members" } },
      { id: "mp_dyson", name: "Dyson Swarm", description: "Harness the full power of a star. Unlimited energy for all players in the universe.", type: "dyson_swarm", requiredResources: { metal: 1000000000, crystal: 500000000, deuterium: 200000000 }, contributionPlayers: 500, constructionTime: 5184000000, effect: { type: "unlimited_energy", value: 1, description: "Unlimited energy for all players" } },
      { id: "mp_senate", name: "Galactic Senate", description: "Establish a galactic senate. Universe-wide bonuses based on alliance cooperation.", type: "galactic_senate", requiredResources: { metal: 300000000, crystal: 300000000, deuterium: 50000000 }, contributionPlayers: 100, constructionTime: 1728000000, effect: { type: "universe_bonus", value: 0.05, description: "+5% all production universe-wide" } },
      { id: "mp_wormhole", name: "Wormhole Network", description: "Create stable wormholes. Fleet travel time reduced by 50% for all.", type: "wormhole_network", requiredResources: { metal: 750000000, crystal: 400000000, deuterium: 150000000 }, contributionPlayers: 300, constructionTime: 3456000000, effect: { type: "fleet_speed", value: 0.50, description: "-50% fleet travel time universe-wide" } },
    ],
    sovereignty: {
      enabled: true,
      sectorClaimCost: { credits: 100000 },
      taxRate: 0.10,
      maxSectorsPerAlliance: 20,
      warDeclarationCost: 50000,
    },
    galacticHistory: [],
  },
  "cygnus-eu": {
    megaProjects: [
      { id: "mp_stargate", name: "Galactic Stargate", description: "A massive stargate connecting distant parts of the galaxy.", type: "stargate", requiredResources: { metal: 500000000, crystal: 250000000, deuterium: 100000000 }, contributionPlayers: 200, constructionTime: 2592000000, effect: { type: "instant_travel", value: 1, description: "Instant fleet travel" } },
    ],
    sovereignty: {
      enabled: true,
      sectorClaimCost: { credits: 100000 },
      taxRate: 0.10,
      maxSectorsPerAlliance: 20,
      warDeclarationCost: 50000,
    },
    galacticHistory: [],
  },
};

export function getSeasonalUniverses(): UniverseDefinition[] {
  return UNIVERSE_LIST.filter(u => u.type === "seasonal");
}

export function getPermanentUniverses(): UniverseDefinition[] {
  return UNIVERSE_LIST.filter(u => u.type === "permanent");
}

export function getActiveSeasonalUniverse(): UniverseDefinition | undefined {
  return UNIVERSE_LIST.find(u => u.type === "seasonal" && u.status === "active");
}

export function getMigrationPlan(sourceId: string): MigrationPlan | undefined {
  return MIGRATION_PLANS.find(p => p.sourceUniverseId === sourceId);
}
