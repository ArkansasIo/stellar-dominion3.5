import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  CommanderState,
  Item,
  RaceId,
  ClassId,
  SubClassId,
  LoadoutPreset,
  createEmptyLoadoutPreset,
  RACES,
  CLASSES,
  SUBCLASSES,
  createDefaultCommanderEquipment,
  COMMANDER_EQUIPMENT_SLOT_DEFINITIONS,
  type CommanderEquipmentSlotId,
  TECHNOLOGY_RACE_NAMES,
  BUILDING_RACE_NAMES,
  SHIP_RACE_NAMES,
  RESOURCE_RACE_NAMES,
  RESEARCH_CATEGORY_RACE_NAMES,
  RACE_WELCOME_MESSAGES,
  type RaceNameMap,
} from './commanderTypes';
import {
  TERRAN_TECH_TREE,
  SHARED_MODULES,
  TIER_GATES,
  CONVERGENCE_REQUIREMENTS,
  type WoWsTechNode,
  type TechBranch,
  type ForkOption,
  type SharedModule,
} from '@shared/config/wowsTechTreeConfig';
import { GovernmentState, GOVERNMENTS, GovernmentId, POLICIES } from './governmentData';
import { Alliance, AllianceMember, MOCK_ALLIANCES } from './allianceData';
import { Artifact, ARTIFACTS } from './artifactData';
import { simulateCombat, simulateEspionage, simulateSabotage, BattleReport, EspionageReport } from './gameLogic';
import { CronJob, DEFAULT_CRON_JOBS, fetchCronJobs } from './cronData';
import { calculateConstructionCost, getMegaStructureTemplateById } from './megaStructures';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Megastructure, createMegastructure } from '@shared/config/megastructuresConfig';
import { blink } from './blink';
import { calculateResourceProduction } from './resourceMath';
import { ORBITAL_BUILDINGS } from './stationData';

async function apiRequest(method: string, url: string, data?: any) {
  const headers: Record<string, string> = data ? { 'Content-Type': 'application/json' } : {};
  
  const storedUser = localStorage.getItem('stellar_username');
  const storedPass = localStorage.getItem('stellar_password');
  if (storedUser && storedPass) {
    const encoded = btoa(`${storedUser}:${storedPass}`);
    headers['Authorization'] = `Basic ${encoded}`;
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include'
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json();
}

// ============================================================================
// RACE-SPECIFIC NAMING HELPERS
// ============================================================================

export function getRaceName(
  configKey: string,
  raceId: RaceId,
  nameMap: RaceNameMap,
  defaultName?: string
): string {
  const raceOverrides = nameMap[configKey];
  if (raceOverrides && raceOverrides[raceId]) {
    return raceOverrides[raceId].displayName;
  }
  return defaultName || configKey;
}

export function getRaceResourceName(
  resourceType: 'metal' | 'crystal' | 'deuterium' | 'energy',
  raceId: RaceId
): string {
  return RESOURCE_RACE_NAMES[raceId][resourceType];
}

export function getRaceResearchCategoryName(
  category: 'weapons' | 'shields' | 'propulsion' | 'economy' | 'computing',
  raceId: RaceId
): string {
  return RESEARCH_CATEGORY_RACE_NAMES[raceId][category];
}

export function getRaceWelcomeMessage(raceId: RaceId): string {
  return RACE_WELCOME_MESSAGES[raceId];
}

// ============================================================================
// WOWS TECH TREE HELPERS
// ============================================================================

export function getWoWsTechNodes(raceId: RaceId): WoWsTechNode[] {
  if (raceId === 'terran') return TERRAN_TECH_TREE;
  return TERRAN_TECH_TREE;
}

export function getWoWsTechNodeById(nodeId: string, raceId: RaceId): WoWsTechNode | undefined {
  return getWoWsTechNodes(raceId).find(node => node.id === nodeId);
}

export function getWoWsNodesByBranch(branch: TechBranch, raceId: RaceId): WoWsTechNode[] {
  return getWoWsTechNodes(raceId).filter(node => node.branch === branch);
}

export function getWoWsNodesByTier(tier: number, raceId: RaceId): WoWsTechNode[] {
  return getWoWsTechNodes(raceId).filter(node => node.tier === tier);
}

export function canResearchWoWsNode(nodeId: string, researchedTechs: string[], raceId: RaceId): boolean {
  const node = getWoWsTechNodeById(nodeId, raceId);
  if (!node) return false;
  return node.prerequisiteTechs.every(prereq => researchedTechs.includes(prereq));
}

export function getSharedModulesForHull(hullType: string, category: 'weapon' | 'engine' | 'shield'): SharedModule[] {
  return SHARED_MODULES.filter(mod => 
    mod.category === category && 
    (mod.compatibleHulls.includes('all') || mod.compatibleHulls.includes(hullType))
  );
}


interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  credits: number;
  food: number;
  water: number;
  darkmatter: number; // Paid resource
}

const DEFAULT_RESOURCES: Resources = {
  metal: 50000,
  crystal: 50000,
  deuterium: 20000,
  energy: 5000,
  credits: 10000,
  food: 5000,
  water: 5000,
  darkmatter: 0,
};

const MAX_RESOURCE_VALUE = 1_000_000_000_000_000;

function parseFiniteNumber(value: unknown, fallback: number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (!normalized) return fallback;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeResourceValue(value: unknown, fallback: number, allowNegative: boolean = false): number {
  const numericValue = parseFiniteNumber(value, fallback);
  const boundedValue = allowNegative
    ? Math.max(-MAX_RESOURCE_VALUE, Math.min(MAX_RESOURCE_VALUE, numericValue))
    : Math.max(0, Math.min(MAX_RESOURCE_VALUE, numericValue));
  return boundedValue;
}

function normalizeResources(raw: any, fallback: Resources = DEFAULT_RESOURCES): Resources {
  return {
    metal: normalizeResourceValue(raw?.metal, fallback.metal),
    crystal: normalizeResourceValue(raw?.crystal, fallback.crystal),
    deuterium: normalizeResourceValue(raw?.deuterium, fallback.deuterium),
    energy: normalizeResourceValue(raw?.energy, fallback.energy, true),
    credits: normalizeResourceValue(raw?.credits, fallback.credits),
    food: normalizeResourceValue(raw?.food, fallback.food),
    water: normalizeResourceValue(raw?.water, fallback.water),
    darkmatter: normalizeResourceValue(raw?.darkmatter, fallback.darkmatter),
  };
}

function normalizeCommanderEquipment(raw: any) {
  const defaults = createDefaultCommanderEquipment();
  if (!raw || typeof raw !== "object") {
    return defaults;
  }

  const legacy = raw as Record<string, Item | null | undefined>;
  const normalized = { ...defaults };

  for (const slot of COMMANDER_EQUIPMENT_SLOT_DEFINITIONS) {
    if (slot.id in legacy) {
      normalized[slot.id] = legacy[slot.id] || null;
    }
  }

  if ("weapon" in legacy && !normalized.primaryWeapon) normalized.primaryWeapon = legacy.weapon || null;
  if ("armor" in legacy && !normalized.armorCore) normalized.armorCore = legacy.armor || null;
  if ("module" in legacy && !normalized.commandModule) normalized.commandModule = legacy.module || null;

  return normalized;
}

interface Buildings {
  metalMine: number;
  crystalMine: number;
  deuteriumSynthesizer: number;
  solarPlant: number;
  roboticsFactory: number;
  shipyard: number;
  researchLab: number;
}

interface OrbitalBuildings {
  [key: string]: number;
}

interface AuxiliarySystems {
  [key: string]: number;
}

// Define Research interface locally if not exported, or match the structure
export interface Research {
  energyTech: number;
  laserTech: number;
  ionTech: number;
  hyperspaceTech: number;
  plasmaTech: number;
  combustionDrive: number;
  impulseDrive: number;
  hyperspaceDrive: number;
  espionageTech: number;
  computerTech: number;
  astrophysics: number;
  intergalacticResearchNetwork: number;
  gravitonTech: number;
  weaponsTech: number;
  shieldingTech: number;
  armourTech: number;
  aiTech: number;
  quantumTech: number;
  [key: string]: number; 
}

// Dynamic unit storage
type Units = {
  [key: string]: number;
};

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "danger" | "success";
  timestamp: number;
}

export interface QueueItem {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  type: "building" | "research" | "unit" | "megastructure";
  amount?: number;
  itemId?: string;
}

export interface Mission {
  id: string;
  type: "attack" | "transport" | "espionage" | "colonize" | "deploy" | "sabotage";
  target: string; // Coordinates e.g. "1:102:8"
  units: Units;
  arrivalTime: number;
  returnTime: number;
  status: "outbound" | "holding" | "return";
  processed?: boolean; // To prevent double processing
}

export interface GameConfig {
  universeName: string;
  gameSpeed: number; // 1x, 2x, 5x
  resourceRate: number; // 1x, 2x...
  fleetSpeed: number; // 1x...
  peaceMode: boolean;
  serverTimezone: string;
  version: string;
  maintenanceMode: boolean;
}

export interface RealmServer {
  id: string;
  name: string;
  region: "NA" | "EU" | "APAC";
  status: "online" | "maintenance" | "degraded";
  playersOnline: number;
  maxPlayers: number;
  tickRateMs: number;
  uptimePercent: number;
  universes: string[];
}

interface RealmResponse {
  realms: RealmServer[];
  selectedRealmId: string;
  selectedRealm: RealmServer;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: "player" | "system" | "alliance" | "combat" | "espionage";
  battleReport?: BattleReport; // Optional attachment
  espionageReport?: EspionageReport;
}

interface GameState {
  resources: Resources;
  buildings: Buildings;
  orbitalBuildings: OrbitalBuildings;
  refinerySystems: AuxiliarySystems;
  infrastructureSystems: AuxiliarySystems;
  technologySystems: AuxiliarySystems;
  kardashevSystems: AuxiliarySystems;
  megastructureSystems: AuxiliarySystems;
  technologyDivisionSystems: AuxiliarySystems;
  researchTreeSystems: AuxiliarySystems;
  shipyardCategorySystems: AuxiliarySystems;
  starshipLineSystems: AuxiliarySystems;
  activeBase: "planet" | "moon" | "station";
  setActiveBase: (base: "planet" | "moon" | "station") => void;
  research: {[key: string]: number};
  units: Units;
  megastructures: Megastructure[];
  commander: CommanderState;
  empireName: string;
  government: GovernmentState;
  planetName: string;
  events: GameEvent[];
  queue: QueueItem[];
  activeMissions: Mission[];
  config: GameConfig;
  messages: Message[];
  alliance: Alliance | null;
  artifacts: Artifact[];
  cronJobs: CronJob[];
  coordinates: string;
  isAdmin: boolean;
  isActualAdmin: boolean;
  adminRole: string | null;
  isLoggedIn: boolean;
  needsSetup: boolean;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  username: string;
  totalTurns: number;
  currentTurns: number;
  realmServers: RealmServer[];
  selectedRealmId: string;
  selectedRealm: RealmServer | null;
  spendTurns: (amount: number) => Promise<boolean>;
  switchRealm: (realmId: string) => Promise<void>;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  toggleAdmin: () => void;
  updateBuilding: (building: keyof Buildings | string, name: string, time?: number) => Promise<void>;
  upgradeRefinerySystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  upgradeInfrastructureSystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  upgradeTechnologySystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  upgradeKardashevSystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  upgradeMegastructureSystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  upgradeTechnologyDivisionSystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  upgradeResearchTreeSystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  upgradeShipyardCategorySystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  upgradeStarshipLineSystem: (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time?: number) => Promise<boolean>;
  updateResearch: (tech: string, name: string, time: number) => void;
  buildUnit: (unitId: string, amount: number, name: string, time: number) => void;
  constructMegastructure: (templateId: string, name: string, time: number) => void;
  addEvent: (title: string, description: string, type: GameEvent["type"]) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: CommanderEquipmentSlotId) => void;
  equipSlot: (slot: CommanderEquipmentSlotId, item: Item) => void;
  unequipAll: () => void;
  equipAll: () => void;
  autoOptimize: () => void;
  loadoutPresets: LoadoutPreset[];
  saveLoadout: (name: string) => void;
  loadLoadout: (id: string) => void;
  deleteLoadout: (id: string) => void;
  renameLoadout: (id: string, name: string) => void;
  craftItem: (item: Item, cost: {metal: number, crystal: number, deuterium?: number}) => void;
  temperItem: (itemId: string) => void;
  setCommanderName: (name: string) => void;
  setEmpireName: (name: string) => void;
  setHomeWorldName: (name: string) => void;
  setCommanderIdentity: (race: RaceId, cls: ClassId, subClass: SubClassId | null) => void;
  upgradeCommanderSkill: (skill: "warfare" | "logistics" | "science" | "engineering") => boolean;
  setGovernmentType: (type: GovernmentId) => void;
  completeSetup: (
    commander: CommanderState & { empireSlot?: number },
    government: GovernmentState,
    options?: { homeWorldName?: string },
  ) => Promise<void>;
  togglePolicy: (policyId: string) => void;
  setTaxRate: (rate: number) => void;
  dispatchFleet: (mission: Omit<Mission, "id" | "status" | "returnTime">) => void;
  updateConfig: (newConfig: Partial<GameConfig>) => void;
  sendMessage: (to: string, subject: string, body: string) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  createAlliance: (name: string, tag: string) => void;
  joinAlliance: (id: string) => void;
  leaveAlliance: () => void;
  activateArtifact: (id: string) => void;
  toggleCronJob: (id: string) => void;
  runCronJob: (id: string) => void;
  travelTo: (destinationName: string, coords: string, cost: { deuterium: number }) => void;
  inventory: {[key: string]: number};
  buyItem: (itemId: string, cost: {metal: number, crystal: number, deuterium: number}) => void;
  sellItem: (itemId: string, value: {metal: number, crystal: number, deuterium: number}) => void;
  processMissions: () => void;
  completeResearch: () => void;
  processQueue: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [resources, setResources] = useState<Resources>(DEFAULT_RESOURCES);

  const [buildings, setBuildings] = useState<Buildings>({
    metalMine: 10,
    crystalMine: 8,
    deuteriumSynthesizer: 5,
    solarPlant: 12,
    roboticsFactory: 2,
    shipyard: 2,
    researchLab: 1,
  });

  const [orbitalBuildings, setOrbitalBuildings] = useState<OrbitalBuildings>({
    lunarBase: 0,
    sensorPhalanx: 0,
    jumpGate: 0,
    starbaseHub: 0,
    orbitalShipyard: 0,
    tradeDock: 0,
    defenseGrid: 0
  });
  const [refinerySystems, setRefinerySystems] = useState<AuxiliarySystems>({});
  const [infrastructureSystems, setInfrastructureSystems] = useState<AuxiliarySystems>({});
  const [technologySystems, setTechnologySystems] = useState<AuxiliarySystems>({});
  const [kardashevSystems, setKardashevSystems] = useState<AuxiliarySystems>({});
  const [megastructureSystems, setMegastructureSystems] = useState<AuxiliarySystems>({});
  const [technologyDivisionSystems, setTechnologyDivisionSystems] = useState<AuxiliarySystems>({});
  const [researchTreeSystems, setResearchTreeSystems] = useState<AuxiliarySystems>({});
  const [shipyardCategorySystems, setShipyardCategorySystems] = useState<AuxiliarySystems>({});
  const [starshipLineSystems, setStarshipLineSystems] = useState<AuxiliarySystems>({});

  const [activeBase, setActiveBase] = useState<"planet" | "moon" | "station">("planet");

  const [research, setResearch] = useState<{[key: string]: number}>({
    energyTech: 0,
    laserTech: 0,
    ionTech: 0,
    hyperspaceTech: 0,
    plasmaTech: 0,
    combustionDrive: 0,
    impulseDrive: 0,
    hyperspaceDrive: 0,
    espionageTech: 0,
    computerTech: 0,
    astrophysics: 0,
    intergalacticResearchNetwork: 0,
    gravitonTech: 0,
    weaponsTech: 0,
    shieldingTech: 0,
    armourTech: 0,
    aiTech: 0,
    quantumTech: 0
  });

  const [units, setUnits] = useState<Units>({
    lightFighter: 5,
    smallCargo: 2,
    espionageProbe: 10,
    marine: 50,
    colonist: 100
  });

  const [megastructures, setMegastructures] = useState<Megastructure[]>([]);

  // Items Inventory
  const [inventory, setInventory] = useState<{[key: string]: number}>({
    plasteel: 10,
    circuit_board: 5
  });

  const buyItem = (itemId: string, cost: {metal: number, crystal: number, deuterium: number}) => {
    if (
      resources.metal >= cost.metal && 
      resources.crystal >= cost.crystal && 
      resources.deuterium >= cost.deuterium
    ) {
      setResources(prev => ({
        ...prev,
        metal: prev.metal - cost.metal,
        crystal: prev.crystal - cost.crystal,
        deuterium: prev.deuterium - cost.deuterium
      }));
      setInventory(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1
      }));
      addEvent("Purchase Successful", `Bought item ${itemId}`, "success");
    } else {
      addEvent("Purchase Failed", "Insufficient funds.", "danger");
    }
  };

  const sellItem = (itemId: string, value: {metal: number, crystal: number, deuterium: number}) => {
    if ((inventory[itemId] || 0) > 0) {
       setInventory(prev => ({
         ...prev,
         [itemId]: prev[itemId] - 1
       }));
       setResources(prev => ({
         ...prev,
         metal: prev.metal + value.metal,
         crystal: prev.crystal + value.crystal,
         deuterium: prev.deuterium + value.deuterium
       }));
       addEvent("Sale Successful", `Sold item ${itemId}`, "success");
    }
  };

  const [totalTurns, setTotalTurns] = useState(0);
  const [currentTurns, setCurrentTurns] = useState(0);
  const lastTurnUpdateRef = useRef(Date.now());

  const [commander, setCommander] = useState<CommanderState & { empireSlot?: number }>({
    name: "Commander",
    empireName: "Stellar Dominion",
    race: "terran",
    class: "admiral",
    subClass: null,
    stats: { level: 1, xp: 0, warfare: 1, logistics: 1, science: 1, engineering: 1 },
    equipment: createDefaultCommanderEquipment(),
    inventory: [
      { id: "bp_plasmaRifle", name: "Plasma Rifle Blueprint", description: "Blueprint for a standard plasma rifle.", type: "blueprint", rarity: "common", level: 1 },
      { id: "raw_metal", name: "Refined Metal", description: "High quality crafting material.", type: "material", rarity: "common", level: 1 }
    ],
    empireSlot: 1,
    starRating: 0,
    starExperience: 0,
    starMaxExperience: 1000,
    starProgress: 0,
    sRankTier: 'none',
    sRankLevel: 0,
    sRankExperience: 0,
    sRankMaxExperience: 1000000,
    sRankProgress: 0,
  });

  const [government, setGovernment] = useState<GovernmentState>({
    type: "democracy",
    policies: [],
    stats: {
      stability: 60,
      publicSupport: 50,
      efficiency: 50,
      militaryReadiness: 40,
      corruption: 10
    },
    taxRate: 20
  });

  const [config, setConfig] = useState<GameConfig>({
    universeName: "Nexus-Alpha",
    gameSpeed: 1,
    resourceRate: 1,
    fleetSpeed: 1,
    peaceMode: false,
    serverTimezone: "UTC",
    version: "v0.8.2-beta",
    maintenanceMode: false
  });

  const [messages, setMessages] = useState<Message[]>([
     { id: "1", from: "High Command", to: "Commander", subject: "Welcome to Nexus-Alpha", body: "Greetings Commander. Establish your base and prepare for expansion.", timestamp: Date.now(), read: false, type: "system" },
     { id: "2", from: "Pirate King", to: "Commander", subject: "Surrender or Die", body: "This sector belongs to the Red Skull gang. Pay tribute or face destruction.", timestamp: Date.now() - 86400000, read: true, type: "player" }
  ]);

  const [alliance, setAlliance] = useState<Alliance | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([
    ARTIFACTS[0], ARTIFACTS[3] // Start with Star Map and Banner
  ]);

  const [cronJobs, setCronJobs] = useState<CronJob[]>(DEFAULT_CRON_JOBS);

  const [events, setEvents] = useState<GameEvent[]>([
    { id: "1", title: "Welcome Commander", description: "Colony established on Homeworld.", type: "success", timestamp: Date.now() }
  ]);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);

  const [planetName, setPlanetName] = useState("Earth");
  const [coordinates, setCoordinates] = useState("1:1:100:3");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isActualAdmin, setIsActualAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [username, setUsername] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAutosaveKeyRef = useRef("");
  const channelRef = useRef<any>(null);
  const pendingRealmAttemptRef = useRef("");

  const { data: authUser, isLoading: authLoading, error: authError, isSuccess: authSuccess } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      
      // Add basic auth if credentials are stored
      const storedUsername = localStorage.getItem('stellar_username');
      const storedPassword = localStorage.getItem('stellar_password');
      if (storedUsername && storedPassword) {
        const encoded = btoa(`${storedUsername}:${storedPassword}`);
        headers['Authorization'] = `Basic ${encoded}`;
      }
      
      const res = await fetch('/api/auth/user', { 
        credentials: 'include',
        headers 
      });
      
      if (!res.ok) {
        // Return null for auth failures instead of throwing
        return null;
      }
      return res.json();
    },
    staleTime: 60000
  });

  const { data: serverGameState, isLoading: gameStateLoading, refetch: refetchGameState } = useQuery({
    queryKey: ['/api/game/state'],
    queryFn: () => apiRequest('GET', '/api/game/state'),
    enabled: !!authUser,
    staleTime: 30000
  });

  const { data: turnData, refetch: refetchTurns } = useQuery({
    queryKey: ['/api/turns'],
    queryFn: () => apiRequest('GET', '/api/turns'),
    enabled: !!authUser,
    refetchInterval: 15000 // Sync turns every 15s
  });

  const { data: realmData } = useQuery<RealmResponse>({
    queryKey: ["/api/universe/realms"],
    queryFn: () => apiRequest("GET", "/api/universe/realms") as Promise<RealmResponse>,
    enabled: !!authUser,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!authUser?.id) return;
    if (!blink) {
      console.warn('[REALTIME] Blink is not configured; skipping realtime subscription.');
      return;
    }
    const blinkClient = blink as any;

    let mounted = true;
    let channel: any = null;

    const setupRealtime = async () => {
      try {
        const channelName = `user_${authUser.id}`;
        channel = blinkClient.realtime.channel(channelName);
        channelRef.current = channel;

        await channel.subscribe({
          userId: authUser.id,
          metadata: { status: 'online' }
        });

        if (!mounted) return;

        channel.onMessage((msg: any) => {
          if (!mounted) return;
          
          if (msg.type === "game_tick") {
            // Server-side tick received, refresh state
            queryClient.invalidateQueries({ queryKey: ['/api/game/state'] });
            queryClient.invalidateQueries({ queryKey: ['/api/game/missions'] });
            
            if (msg.data.resources) {
              setResources(prev => normalizeResources(msg.data.resources, prev));
            }
            
            if (msg.data.turnsAvailable !== undefined) {
              setCurrentTurns(msg.data.turnsAvailable);
            }
            
            if (msg.data.completedBuildings?.length > 0) {
              addEvent("Infrastructure Update", "Buildings updated via central command.", "success");
            }
          } else if (msg.type === "queue_completed") {
            refetchGameState();
            addEvent("Infrastructure Update", "A construction project has been finalized.", "success");
          } else if (msg.type === "turn_accrued") {
            refetchTurns();
          }
        });

      } catch (err) {
        console.error("[REALTIME] Subscription error:", err);
      }
    };

    setupRealtime();

    return () => {
      mounted = false;
      channel?.unsubscribe();
      channelRef.current = null;
    };
  }, [authUser?.id, queryClient]);


  const { data: serverMissions, refetch: refetchMissions } = useQuery({
    queryKey: ['/api/game/missions'],
    queryFn: () => apiRequest('GET', '/api/game/missions'),
    enabled: !!authUser,
    staleTime: 5000
  });

  const startResearchMutation = useMutation({
    mutationFn: (techId: string) => apiRequest('POST', '/api/research/player/start', { techId }),
    onSuccess: () => {
      refetchGameState();
      addEvent("Research Started", "Technological initiative confirmed.", "info");
    },
    onError: (error: any) => {
      addEvent("Research Error", error.message || "Failed to start research", "danger");
    }
  });

  const completeResearchMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/research/player/complete', {}),
    onSuccess: () => refetchGameState()
  });

  const processQueueMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/game/process-queue', {}),
    onSuccess: (data) => {
      refetchGameState();
      if (data.completed && data.completed.length > 0) {
        data.completed.forEach((item: any) => {
          if (item.type === "building") {
            addEvent("Construction Complete", `${item.buildingType} upgrade finished on server.`, "success");
          } else if (item.type === "unit") {
            addEvent("Shipyard Order", `${item.amount}x ${item.unitType} constructed on server.`, "success");
          }
        });
      }
    }
  });

  const syncTickMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/game/sync-tick', {}),
    onSuccess: (data) => {
      // Sync resources if backend is more authoritative
      if (data.resourceTick?.resources) {
        setResources(normalizeResources(data.resourceTick.resources, resources));
      }
      if (data.queueTick?.completed && data.queueTick.completed.length > 0) {
        refetchGameState();
      }
    }
  });

  const createMissionMutation = useMutation({
    mutationFn: (mission: any) => apiRequest('POST', '/api/game/send-fleet', {
      missionType: mission.type,
      destination: mission.target,
      ships: mission.units
    }),
    onSuccess: () => refetchMissions()
  });

  const processMissionsMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/game/process-missions', {}),
    onSuccess: () => {
      refetchMissions();
      refetchGameState();
    }
  });

  const updateMissionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => apiRequest('PATCH', `/api/missions/${id}`, updates)
  });

  const { data: serverMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/messages'],
    queryFn: () => apiRequest('GET', '/api/messages?limit=50'),
    enabled: !!authUser,
    staleTime: 10000
  });

  const collectResourcesMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/game/collect-resources'),
    onSuccess: (data) => {
      setResources(normalizeResources(data.resources, resources));
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: (msg: any) => apiRequest('POST', '/api/messages', msg),
    onSuccess: () => refetchMessages()
  });

  const markMessageReadMutation = useMutation({
    mutationFn: (id: string) => apiRequest('PATCH', `/api/messages/${id}/read`, {})
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/messages/${id}`)
  });

  const { data: serverAlliance, refetch: refetchAlliance } = useQuery({
    queryKey: ['/api/alliances/mine'],
    queryFn: () => apiRequest('GET', '/api/alliances/mine'),
    enabled: !!authUser,
    staleTime: 30000
  });

  const createAllianceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/alliances', data),
    onSuccess: () => {
      refetchAlliance();
      addEvent("Alliance Formed", "Your alliance was created successfully.", "success");
    },
    onError: (error: any) => {
      addEvent("Alliance Creation Failed", error?.message || "Unable to create alliance.", "danger");
    }
  });

  const switchRealmMutation = useMutation({
    mutationFn: (realmId: string) => apiRequest("POST", "/api/universe/realms/select", { realmId }) as Promise<RealmResponse>,
    onSuccess: (data: RealmResponse) => {
      queryClient.setQueryData<RealmResponse>(["/api/universe/realms"], (current) => ({
        realms: current?.realms || data.realms || [],
        selectedRealmId: data.selectedRealmId,
        selectedRealm: data.selectedRealm,
      }));
      localStorage.removeItem("stellar_pending_realm");
      const realmName = data?.selectedRealm?.name;
      if (realmName) {
        setConfig((prev) => ({ ...prev, universeName: realmName }));
      }
      addEvent("Realm Switched", `Command routing updated to ${realmName || "selected realm"}.`, "info");
      toast({ title: "Realm switched", description: "In-game realm updated successfully." });
    },
    onError: (error: any) => {
      toast({
        title: "Realm switch failed",
        description: error?.message || "Unable to change realms right now.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authUser || !realmData?.realms?.length) return;
    const pendingRealmId = localStorage.getItem("stellar_pending_realm") || "";
    if (!pendingRealmId || pendingRealmAttemptRef.current === pendingRealmId) return;

    if (!realmData.realms.some((realm) => realm.id === pendingRealmId)) {
      localStorage.removeItem("stellar_pending_realm");
      return;
    }

    if (pendingRealmId === realmData.selectedRealmId) {
      localStorage.removeItem("stellar_pending_realm");
      return;
    }

    pendingRealmAttemptRef.current = pendingRealmId;
    switchRealmMutation.mutate(pendingRealmId);
  }, [authUser, realmData?.realms, realmData?.selectedRealmId]);

  const joinAllianceMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/alliances/${id}/join`, {}),
    onSuccess: () => {
      refetchAlliance();
      addEvent("Alliance Joined", "You have joined the alliance.", "success");
    },
    onError: (error: any) => {
      addEvent("Alliance Join Failed", error?.message || "Unable to join alliance.", "danger");
    }
  });

  const leaveAllianceMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/alliances/${id}/leave`, {}),
    onSuccess: () => {
      refetchAlliance();
      setAlliance(null);
      addEvent("Alliance Left", "You have left your alliance.", "warning");
    },
    onError: (error: any) => {
      addEvent("Alliance Leave Failed", error?.message || "Unable to leave alliance.", "danger");
    }
  });

  const saveGameStateMutation = useMutation({
    mutationFn: (updates: any) => apiRequest('PATCH', '/api/game/state', updates)
  });

  const debouncedSave = useCallback((updates: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveGameStateMutation.mutate(updates);
    }, 2000);
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!authUser) {
      setIsLoggedIn(false);
      setNeedsSetup(false);
      setIsInitialized(false);
      setUsername("");
      setIsAdmin(false);
      setIsActualAdmin(false);
      setAdminRole(null);
      return;
    }

    setIsLoggedIn(true);
    setUsername(authUser.firstName || authUser.email?.split('@')[0] || authUser.username || 'Commander');
    setIsActualAdmin(authUser.isAdmin || false);
    if (!authUser.isAdmin) {
      setIsAdmin(false);
    }
    setAdminRole(authUser.adminRole || null);
  }, [authUser, authLoading]);

  useEffect(() => {
    if (!authUser || isInitialized || gameStateLoading) {
      return;
    }

    const state = (serverGameState && typeof serverGameState === "object") ? serverGameState : {};
    const normalizedResources = normalizeResources((state as any).resources, DEFAULT_RESOURCES);
    const normalizedBuildings = {
      metalMine: (state as any).buildings?.metalMine || 1,
      crystalMine: (state as any).buildings?.crystalMine || 1,
      deuteriumSynthesizer: (state as any).buildings?.deuteriumSynthesizer || 0,
      solarPlant: (state as any).buildings?.solarPlant || 1,
      roboticsFactory: (state as any).buildings?.roboticsFactory || 0,
      shipyard: (state as any).buildings?.shipyard || 0,
      researchLab: (state as any).buildings?.researchLab || 0,
    };
    const normalizedOrbitalBuildings = (state as any).orbitalBuildings || {};
    const normalizedRefinerySystems = (state as any).refinerySystems || {};
    const normalizedInfrastructureSystems = (state as any).infrastructureSystems || {};
    const normalizedTechnologySystems = (state as any).technologySystems || {};
    const normalizedKardashevSystems = (state as any).kardashevSystems || {};
    const normalizedMegastructureSystems = (state as any).megastructureSystems || {};
    const normalizedTechnologyDivisionSystems = (state as any).technologyDivisionSystems || {};
    const normalizedResearchTreeSystems = (state as any).researchTreeSystems || {};
    const normalizedShipyardCategorySystems = (state as any).shipyardCategorySystems || {};
    const normalizedStarshipLineSystems = (state as any).starshipLineSystems || {};
    const normalizedResearch = (state as any).research || {};
    const normalizedUnits = (state as any).units || {};
    const normalizedMegastructures = (state as any).megastructures || [];
    const normalizedCommander = (state as any).commander
      ? {
          ...(state as any).commander,
          empireName: (state as any).commander.empireName || (state as any).commander.name || "Stellar Dominion",
          equipment: normalizeCommanderEquipment((state as any).commander.equipment),
          inventory: Array.isArray((state as any).commander.inventory) ? (state as any).commander.inventory : [],
        }
      : null;
    const normalizedGovernment = (state as any).government || null;
    const normalizedArtifacts = (state as any).artifacts || artifacts;
    const normalizedCronJobs = (state as any).cronJobs || cronJobs;
    const normalizedPlanetName = (state as any).planetName || "Earth";
    const normalizedCoordinates = (state as any).coordinates || "1:1:100:3";

    lastAutosaveKeyRef.current = JSON.stringify({
      resources: normalizedResources,
      buildings: normalizedBuildings,
      orbitalBuildings: normalizedOrbitalBuildings,
      refinerySystems: normalizedRefinerySystems,
      infrastructureSystems: normalizedInfrastructureSystems,
      technologySystems: normalizedTechnologySystems,
      kardashevSystems: normalizedKardashevSystems,
      megastructureSystems: normalizedMegastructureSystems,
      technologyDivisionSystems: normalizedTechnologyDivisionSystems,
      researchTreeSystems: normalizedResearchTreeSystems,
      shipyardCategorySystems: normalizedShipyardCategorySystems,
      starshipLineSystems: normalizedStarshipLineSystems,
      research: normalizedResearch,
      units: normalizedUnits,
      megastructures: normalizedMegastructures,
      commander: normalizedCommander,
      government: normalizedGovernment,
      artifacts: normalizedArtifacts,
      cronJobs: normalizedCronJobs,
      planetName: normalizedPlanetName,
      coordinates: normalizedCoordinates,
    });

    setResources(normalizedResources);
    setBuildings(normalizedBuildings);
    setOrbitalBuildings(normalizedOrbitalBuildings);
    setRefinerySystems(normalizedRefinerySystems);
    setInfrastructureSystems(normalizedInfrastructureSystems);
    setTechnologySystems(normalizedTechnologySystems);
    setKardashevSystems(normalizedKardashevSystems);
    setMegastructureSystems(normalizedMegastructureSystems);
    setTechnologyDivisionSystems(normalizedTechnologyDivisionSystems);
    setResearchTreeSystems(normalizedResearchTreeSystems);
    setShipyardCategorySystems(normalizedShipyardCategorySystems);
    setStarshipLineSystems(normalizedStarshipLineSystems);
    setResearch(normalizedResearch);
    setUnits(normalizedUnits);
    setMegastructures(normalizedMegastructures);
    if (normalizedCommander) setCommander(normalizedCommander);
    if (normalizedGovernment) setGovernment(normalizedGovernment);
    if ((state as any).artifacts) setArtifacts(normalizedArtifacts);
    if ((state as any).cronJobs) setCronJobs(normalizedCronJobs);
    setPlanetName(normalizedPlanetName);
    setCoordinates(normalizedCoordinates);
    
    // Sync turns from server
    if (turnData) {
      setTotalTurns(turnData.totalTurns || 0);
      setCurrentTurns(turnData.currentTurns || 0);
    } else {
      setTotalTurns((state as any).totalTurns || 0);
      setCurrentTurns((state as any).currentTurns || 0);
    }
    
    if ((state as any).setupComplete === false) {
      setNeedsSetup(true);
      setOnboardingStep(3);
    }
    setIsInitialized(true);
  }, [authUser, serverGameState, gameStateLoading, isInitialized, turnData]);

  useEffect(() => {
    if (!realmData?.selectedRealm?.name) {
      return;
    }

    setConfig((prev) =>
      prev.universeName === realmData.selectedRealm.name
        ? prev
        : { ...prev, universeName: realmData.selectedRealm.name }
    );
  }, [realmData?.selectedRealm?.name]);

  useEffect(() => {
    const missionPayload = Array.isArray(serverMissions)
      ? serverMissions
      : Array.isArray((serverMissions as any)?.missions)
        ? (serverMissions as any).missions
        : [];

    if (missionPayload.length > 0) {
      const formattedMissions = missionPayload.map((m: any) => ({
        id: m.id,
        type: m.type,
        target: m.target || m.destination,
        units: m.units || m.ships || {},
        arrivalTime: new Date(m.arrivalTime).getTime(),
        returnTime: m.returnTime ? new Date(m.returnTime).getTime() : 0,
        status: m.status === "in-transit" ? "outbound" : m.status,
        processed: m.processed
      }));
      setActiveMissions(formattedMissions);
      return;
    }

    setActiveMissions([]);
  }, [serverMissions]);

  useEffect(() => {
    if (serverMessages && Array.isArray(serverMessages)) {
      const formattedMessages = serverMessages.map((m: any) => ({
        id: m.id,
        from: m.from,
        to: m.to,
        subject: m.subject,
        body: m.body,
        timestamp: new Date(m.timestamp).getTime(),
        read: m.read,
        type: m.type,
        battleReport: m.battleReport,
        espionageReport: m.espionageReport
      }));
      setMessages(formattedMessages);
    }
  }, [serverMessages]);

  useEffect(() => {
    if (serverAlliance === null) {
      setAlliance(null);
      return;
    }

    if (!serverAlliance) return;

    const allianceData = serverAlliance as any;
    setAlliance({
      id: allianceData.id,
      name: allianceData.name,
      tag: allianceData.tag,
      description: allianceData.description || "A new alliance rises.",
      announcement: allianceData.announcement || "Welcome to the alliance.",
      members: Array.isArray(allianceData.members)
        ? allianceData.members.map((member: any) => ({
            id: member.id,
            name: member.name || "Commander",
            rank: member.rank,
            points: member.points || 0,
            status: member.status || "offline",
            lastActive: Date.now(),
          }))
        : [],
      applications: [],
      resources: allianceData.resources || { metal: 0, crystal: 0, deuterium: 0 }
    });
  }, [serverAlliance]);

  useEffect(() => {
    if (isInitialized && isLoggedIn && isActualAdmin) {
      fetchCronJobs().then((jobs) => {
        if (jobs.length > 0) setCronJobs(jobs);
      });
    }
  }, [isInitialized, isLoggedIn, isActualAdmin]);

  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      const autosavePayload = {
        resources,
        buildings,
        orbitalBuildings,
        refinerySystems,
        infrastructureSystems,
        technologySystems,
        kardashevSystems,
        megastructureSystems,
        technologyDivisionSystems,
        researchTreeSystems,
        shipyardCategorySystems,
        starshipLineSystems,
        research,
        units,
        megastructures,
        commander,
        government,
        artifacts,
        cronJobs,
        planetName,
        coordinates
      };
      const autosaveKey = JSON.stringify(autosavePayload);
      if (lastAutosaveKeyRef.current === autosaveKey) {
        return;
      }
      lastAutosaveKeyRef.current = autosaveKey;
      debouncedSave(autosavePayload);
    }
  }, [buildings, orbitalBuildings, refinerySystems, infrastructureSystems, technologySystems, kardashevSystems, megastructureSystems, technologyDivisionSystems, researchTreeSystems, shipyardCategorySystems, starshipLineSystems, research, units, megastructures, commander, government, artifacts, cronJobs, planetName, coordinates, isInitialized, isLoggedIn, debouncedSave]);

  // Calculate production
  const getProduction = () => {
    // Add Commander Logistics Bonus (with defensive checks)
    const commanderStats = commander?.stats || { logistics: 1, warfare: 1, science: 1, engineering: 1 };
    let logisticsBonus = 1 + ((commanderStats.logistics || 1) * 0.05); // 5% per level

    // Add Race/Class Bonuses
    if (commander?.race === "terran") logisticsBonus += 0.05;
    if (commander?.race === "lithoid") logisticsBonus += 0.10; // Mock
    if (commander?.class === "industrialist") logisticsBonus += 0.15;

    // Add Government Bonuses (Stability & Corruption) - with defensive checks
    const govStats = government?.stats || { stability: 50, corruption: 10 };
    const stabilityFactor = (govStats.stability || 50) / 100; // 0.0 - 1.0
    const corruptionFactor = (govStats.corruption || 10) / 100; // 0.0 - 1.0
    const govBonus = 1 + (stabilityFactor * 0.2) - (corruptionFactor * 0.5); // Up to +20%, down to -50%

    // Add Config Multiplier
    const configBonus = config?.resourceRate || 1;

    const totalBonus = logisticsBonus * govBonus * configBonus;

    const production = calculateResourceProduction(buildings, totalBonus);

    return {
      metal: production.metal / 3600,
      crystal: production.crystal / 3600,
      deuterium: production.deuterium / 3600,
      energy: production.energy
    };
  };

  // Main Game Loop (Visual interpolation between server ticks)
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      const now = Date.now();
      const production = getProduction();
      const speedMult = config?.gameSpeed || 1;
      tickCount++;

      // 1. Resource Production (Visual interpolation only)
      setResources(prev => ({
        ...prev,
        metal: prev.metal + (production.metal * speedMult),
        crystal: prev.crystal + (production.crystal * speedMult),
        deuterium: prev.deuterium + (production.deuterium * speedMult),
        energy: production.energy
      }));

      // 2. Refresh state every 30 seconds as fallback
      if (tickCount >= 30) {
        syncTickMutation.mutate();
        tickCount = 0;
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [buildings, commander, government, config, research]);

  const addEvent = (title: string, description: string, type: GameEvent["type"]) => {
    setEvents(prev => [{
      id: Math.random().toString(36).substring(2, 11),
      title,
      description,
      type,
      timestamp: Date.now()
    }, ...prev].slice(0, 10));
  };

  const updateBuilding = async (building: keyof Buildings | string, name: string, time: number = 5000) => {
    const turnCost = 2; // 2 turns per building

    if (!await spendTurns(turnCost)) return;

    const orbitalDefinition = ORBITAL_BUILDINGS.find((entry) => entry.id === building);
    if (orbitalDefinition) {
      const currentLevel = orbitalBuildings[building] || 0;

      if (orbitalDefinition.type === "moon" && building !== "lunarBase" && (orbitalBuildings.lunarBase || 0) < 1) {
        setCurrentTurns((prev) => prev + turnCost);
        addEvent("Build Blocked", `${name} requires Lunar Base level 1.`, "warning");
        return;
      }

      if (orbitalDefinition.type === "station" && building !== "starbaseHub" && (orbitalBuildings.starbaseHub || 0) < 1) {
        setCurrentTurns((prev) => prev + turnCost);
        addEvent("Build Blocked", `${name} requires Starbase Command Hub level 1.`, "warning");
        return;
      }

      const costMultiplier = Math.pow(orbitalDefinition.costFactor, currentLevel);
      const upgradeCost = {
        metal: Math.round(orbitalDefinition.baseCost.metal * costMultiplier),
        crystal: Math.round(orbitalDefinition.baseCost.crystal * costMultiplier),
        deuterium: Math.round(orbitalDefinition.baseCost.deuterium * costMultiplier),
      };

      if (
        resources.metal < upgradeCost.metal ||
        resources.crystal < upgradeCost.crystal ||
        resources.deuterium < upgradeCost.deuterium
      ) {
        setCurrentTurns((prev) => prev + turnCost);
        toast({
          title: "Insufficient Resources",
          description: `Not enough resources to upgrade ${name}.`,
          variant: "destructive",
        });
        return;
      }

      const adjustedTime = (time * Math.pow(1.12, currentLevel)) / (config?.gameSpeed || 1);
      const now = Date.now();

      setResources((prev) => ({
        ...prev,
        metal: prev.metal - upgradeCost.metal,
        crystal: prev.crystal - upgradeCost.crystal,
        deuterium: prev.deuterium - upgradeCost.deuterium,
      }));
      setOrbitalBuildings((prev) => ({
        ...prev,
        [building]: currentLevel + 1,
      }));
      setQueue((prev) => [
        ...prev,
        {
          id: building,
          name,
          startTime: now,
          endTime: now + adjustedTime,
          type: "building",
          itemId: building,
        },
      ]);
      addEvent(
        currentLevel === 0 ? "Orbital Construction Started" : "Orbital Upgrade Started",
        `${name} is now queued for level ${currentLevel + 1}.`,
        "success",
      );
      return;
    }

    try {
      const surfaceBuilding = building as keyof Buildings;
      // Call backend API to build
      const response = await apiRequest("POST", "/api/game/build", {
        building: surfaceBuilding,
        level: (buildings[surfaceBuilding] || 0) + 1
      });
      
      if (response.success) {
        // Update local state based on response
        setResources(normalizeResources(response.resources, resources));
        setBuildings(response.buildings || buildings);
        
        const adjustedTime = (time * Math.pow(1.15, buildings[surfaceBuilding] || 0)) / (config?.gameSpeed || 1);
        const now = Date.now();
        setQueue(prev => [...prev, {
          id: building,
          name: name,
          startTime: now,
          endTime: now + adjustedTime,
          type: "building",
          itemId: building
        }]);
        
        addEvent("Build Started", `Construction of ${name} started`, "success");
      } else {
        setCurrentTurns(prev => prev + turnCost);
        addEvent("Build Failed", response.error || "Failed to start construction", "danger");
      }
    } catch (error) {
      setCurrentTurns(prev => prev + turnCost);
      addEvent("Build Error", "Server error occurred", "danger");
    }
  };

  const updateResearch = async (tech: string, name: string, time: number = 5000) => {
     const turnCost = 3; // 3 turns per research
     if (!await spendTurns(turnCost)) return;
     
     const currentLevel = research[tech] || 0;
     const adjustedTime = (time * Math.pow(1.2, currentLevel)) / (config?.gameSpeed || 1);
     const now = Date.now();

     startResearchMutation.mutate(tech);

     setQueue(prev => [...prev, {
        id: tech,
        name: name,
        startTime: now,
        endTime: now + adjustedTime,
        type: "research",
        itemId: tech
      }]);
  };

  const buildUnit = async (unitId: string, amount: number, name: string, time: number = 2000) => {
    const turnCost = amount; // 1 turn per unit
    if (!await spendTurns(turnCost)) return;
    
    try {
      // Call backend API to build ships
      const response = await apiRequest("POST", "/api/game/build-ships", {
        shipType: unitId,
        quantity: amount
      });
      
      if (response.success) {
        // Update local state based on response
        setResources(normalizeResources(response.resources, resources));
        setUnits(response.units || units);
        
        const adjustedTime = (time * amount) / (config?.gameSpeed || 1);
        const now = Date.now();
        setQueue(prev => [...prev, {
          id: unitId,
          name: name,
          startTime: now,
          endTime: now + adjustedTime,
          type: "unit",
          amount,
          itemId: unitId
        }]);
        
        addEvent("Ships Constructed", `${amount}x ${name} built successfully`, "success");
      } else {
        setCurrentTurns(prev => prev + turnCost);
        addEvent("Build Failed", response.error || "Failed to build ships", "danger");
      }
    } catch (error) {
      setCurrentTurns(prev => prev + turnCost);
      addEvent("Build Error", "Server error occurred", "danger");
    }
  };

  const constructMegastructure = async (templateId: string, name: string, time: number = 3600000) => {
    const turnCost = 100;
    if (!await spendTurns(turnCost)) return;

    const template = getMegaStructureTemplateById(templateId);
    if (!template) {
      setCurrentTurns(prev => prev + turnCost);
      addEvent("Construction Failed", "Megastructure template not found.", "danger");
      return;
    }

    const cost = calculateConstructionCost(template, template.level, template.tier);

    if (
      resources.metal >= cost.metal &&
      resources.crystal >= cost.crystal &&
      resources.deuterium >= cost.deuterium &&
      resources.energy >= cost.energy
    ) {
      setResources(prev => ({
        ...prev,
        metal: prev.metal - cost.metal,
        crystal: prev.crystal - cost.crystal,
        deuterium: prev.deuterium - cost.deuterium,
        energy: prev.energy - cost.energy,
      }));

      const adjustedTime = time / (config?.gameSpeed || 1);
      const now = Date.now();
      setQueue(prev => [...prev, {
        id: templateId,
        name: name,
        startTime: now,
        endTime: now + adjustedTime,
        type: "megastructure",
        itemId: templateId
      }]);
      addEvent("Mega-Project Started", `Construction of the ${name} has begun.`, "success");
    } else {
      setCurrentTurns(prev => prev + turnCost);
      addEvent("Construction Failed", "Insufficient resources to start the megastructure.", "danger");
    }
  };

  const [loadoutPresets, setLoadoutPresets] = useState<LoadoutPreset[]>(() => {
    try {
      const saved = localStorage.getItem("stellar_loadout_presets");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("stellar_loadout_presets", JSON.stringify(loadoutPresets));
  }, [loadoutPresets]);

  const saveLoadout = (name: string) => {
    setCommander(prev => {
      const preset = createEmptyLoadoutPreset(name);
      const equipmentRefs: Record<CommanderEquipmentSlotId, string | null> = {} as any;
      for (const slot of COMMANDER_EQUIPMENT_SLOT_DEFINITIONS) {
        const item = prev.equipment[slot.id];
        equipmentRefs[slot.id] = item ? item.id : null;
      }
      preset.equipment = equipmentRefs;
      preset.description = `Save from ${new Date().toLocaleString()}`;
      setLoadoutPresets(existing => {
        const updated = existing.filter(p => p.name !== name);
        return [...updated, preset].sort((a, b) => b.updatedAt - a.updatedAt);
      });
      return prev;
    });
    toast({ title: "Loadout Saved", description: `"${name}" has been saved.` });
  };

  const loadLoadout = (id: string) => {
    const preset = loadoutPresets.find(p => p.id === id);
    if (!preset) { toast({ title: "Loadout not found", variant: "destructive" }); return; }
    setCommander(prev => {
      const newEquipment = { ...prev.equipment };
      const swapToInventory: Item[] = [];
      const refs = preset.equipment;
      for (const slot of COMMANDER_EQUIPMENT_SLOT_DEFINITIONS) {
        const itemId = refs[slot.id];
        if (itemId) {
          const item = prev.inventory.find(i => i.id === itemId);
          if (item) {
            const current = newEquipment[slot.id];
            if (current) swapToInventory.push(current);
            newEquipment[slot.id] = item;
          }
        } else {
          const current = newEquipment[slot.id];
          if (current) { swapToInventory.push(current); newEquipment[slot.id] = null; }
        }
      }
      const usedIds = new Set(Object.values(newEquipment).filter(Boolean).map(i => (i as Item).id));
      const remainingInventory = prev.inventory.filter(i => !usedIds.has(i.id));
      return {
        ...prev,
        equipment: newEquipment,
        inventory: [...remainingInventory, ...swapToInventory],
      };
    });
    toast({ title: "Loadout Applied", description: `"${preset.name}" equipped.` });
  };

  const deleteLoadout = (id: string) => {
    setLoadoutPresets(prev => prev.filter(p => p.id !== id));
    toast({ title: "Loadout Deleted" });
  };

  const renameLoadout = (id: string, name: string) => {
    setLoadoutPresets(prev => prev.map(p => p.id === id ? { ...p, name, updatedAt: Date.now() } : p));
    toast({ title: "Loadout Renamed", description: `Renamed to "${name}".` });
  };

  const unequipAll = () => {
    setCommander(prev => {
      const equipped = Object.values(prev.equipment).filter(Boolean) as Item[];
      return {
        ...prev,
        equipment: createDefaultCommanderEquipment(),
        inventory: [...prev.inventory, ...equipped],
      };
    });
    addEvent("Loadout Cleared", "All equipment slots have been unequipped.", "info");
  };

  const equipSlot = (slot: CommanderEquipmentSlotId, item: Item) => {
    if (item.type === "blueprint" || item.type === "material") return;
    setCommander(prev => {
      const current = prev.equipment[slot];
      const newInventory = prev.inventory.filter(i => i.id !== item.id);
      if (current) newInventory.push(current);
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: item },
        inventory: newInventory,
      };
    });
  };

  const equipAll = () => {
    setCommander(prev => {
      const newEquipment = { ...prev.equipment };
      const remaining: Item[] = [];
      const sorted = [...prev.inventory]
        .filter(i => i.type !== "blueprint" && i.type !== "material")
        .sort((a, b) => {
          const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
          return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        });
      for (const item of sorted) {
        const compatibleSlots = COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.filter(s => s.type === item.type);
        const openSlot = compatibleSlots.find(s => !newEquipment[s.id]);
        if (openSlot) {
          newEquipment[openSlot.id] = item;
        } else {
          remaining.push(item);
        }
      }
      return { ...prev, equipment: newEquipment, inventory: remaining };
    });
    addEvent("Auto-Equipped", "Best items equipped to open slots.", "success");
  };

  const autoOptimize = () => {
    setCommander(prev => {
      const newEquipment = { ...prev.equipment };
      const remaining: Item[] = [];
      const scored = [...prev.inventory]
        .filter(i => i.type !== "blueprint" && i.type !== "material")
        .map(item => {
          const rarityScore = { legendary: 44, epic: 30, rare: 20, uncommon: 12, common: 8 }[item.rarity] || 6;
          const statSum = Object.values(item.stats || {}).reduce((a, b) => a + Number(b || 0), 0);
          const temperScore = Number(item.tempering || 0) * 6;
          const masteryScore = item.masterwork ? 14 : 0;
          return { item, score: rarityScore + statSum * 5 + temperScore + masteryScore + Math.max(0, item.level - 1) };
        })
        .sort((a, b) => b.score - a.score);
      for (const { item } of scored) {
        const compatibleSlots = COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.filter(s => s.type === item.type);
        const openSlot = compatibleSlots.find(s => !newEquipment[s.id]);
        if (openSlot) {
          newEquipment[openSlot.id] = item;
        } else {
          const worstSlot = compatibleSlots
            .map(s => ({ slot: s, current: newEquipment[s.id] ? (() => {
              const cs = newEquipment[s.id]!;
              const rs = { legendary: 44, epic: 30, rare: 20, uncommon: 12, common: 8 }[cs.rarity] || 6;
              const ss = Object.values(cs.stats || {}).reduce((a, b) => a + Number(b || 0), 0);
              return rs + ss * 5 + Number(cs.tempering || 0) * 6 + (cs.masterwork ? 14 : 0) + Math.max(0, cs.level - 1);
            })() : 0 }))
            .sort((a, b) => a.current - b.current);
          const worst = worstSlot[0];
          if (worst && worst.current < scored[0].score) {
            remaining.push(newEquipment[worst.slot.id]!);
            newEquipment[worst.slot.id] = item;
          } else {
            remaining.push(item);
          }
        }
      }
      return { ...prev, equipment: newEquipment, inventory: remaining };
    });
    addEvent("Optimized", "Loadout optimized for best stat allocation.", "success");
  };

  const equipItem = (item: Item) => {
    if (item.type === "blueprint" || item.type === "material") return;
    
    setCommander(prev => {
      const compatibleSlots = COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.filter((slot) => slot.type === item.type);
      const openSlot = compatibleSlots.find((slot) => !prev.equipment[slot.id]);
      const fallbackSlot = compatibleSlots[0];
      if (!fallbackSlot) return prev;

      const slot = (openSlot || fallbackSlot).id;
      const currentEquip = prev.equipment[slot];
      const newInventory = prev.inventory.filter(i => i.id !== item.id);
      if (currentEquip) newInventory.push(currentEquip);
      
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: item },
        inventory: newInventory
      };
    });
  };

  const upgradeAuxiliarySystem = async (
    systemBucket: "refinerySystems" | "infrastructureSystems" | "technologySystems" | "kardashevSystems" | "megastructureSystems" | "technologyDivisionSystems" | "researchTreeSystems" | "shipyardCategorySystems" | "starshipLineSystems",
    setLevels: React.Dispatch<React.SetStateAction<AuxiliarySystems>>,
    systemId: string,
    name: string,
    cost: { metal: number; crystal: number; deuterium: number },
    time: number = 12000,
  ): Promise<boolean> => {
    const turnCost = 1;
    if (!await spendTurns(turnCost)) {
      return false;
    }

    const canAfford =
      resources.metal >= cost.metal &&
      resources.crystal >= cost.crystal &&
      resources.deuterium >= cost.deuterium;

    if (!canAfford) {
      setCurrentTurns((prev) => prev + turnCost);
      addEvent("Upgrade Failed", `Insufficient resources for ${name}.`, "danger");
      return false;
    }

    const nextResources = {
      ...resources,
      metal: resources.metal - cost.metal,
      crystal: resources.crystal - cost.crystal,
      deuterium: resources.deuterium - cost.deuterium,
    };

    setResources(nextResources);

    let nextLevels: AuxiliarySystems = {};
    setLevels((current) => {
      nextLevels = {
        ...current,
        [systemId]: (current[systemId] || 0) + 1,
      };
      return nextLevels;
    });

    debouncedSave({
      resources: nextResources,
      [systemBucket]: nextLevels,
    });

    const now = Date.now();
    const queueId = `${systemBucket}:${systemId}:${now}`;
    setQueue((prev) => [
      ...prev,
      {
        id: queueId,
        name,
        startTime: now,
        endTime: now + time,
        type: "building",
        itemId: systemId,
      },
    ]);

    addEvent("Upgrade Started", `${name} upgrade sequence initiated.`, "success");

    setTimeout(() => {
      setQueue((prev) => prev.filter((item) => item.id !== queueId));
      addEvent("Upgrade Complete", `${name} is now online at the next level.`, "success");
    }, time);

    return true;
  };

  const upgradeRefinerySystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("refinerySystems", setRefinerySystems, systemId, name, cost, time);

  const upgradeInfrastructureSystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("infrastructureSystems", setInfrastructureSystems, systemId, name, cost, time);

  const upgradeTechnologySystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("technologySystems", setTechnologySystems, systemId, name, cost, time);

  const upgradeKardashevSystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("kardashevSystems", setKardashevSystems, systemId, name, cost, time);

  const upgradeMegastructureSystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("megastructureSystems", setMegastructureSystems, systemId, name, cost, time);

  const upgradeTechnologyDivisionSystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("technologyDivisionSystems", setTechnologyDivisionSystems, systemId, name, cost, time);

  const upgradeResearchTreeSystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("researchTreeSystems", setResearchTreeSystems, systemId, name, cost, time);

  const upgradeShipyardCategorySystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("shipyardCategorySystems", setShipyardCategorySystems, systemId, name, cost, time);

  const upgradeStarshipLineSystem = (systemId: string, name: string, cost: { metal: number; crystal: number; deuterium: number }, time: number = 12000) =>
    upgradeAuxiliarySystem("starshipLineSystems", setStarshipLineSystems, systemId, name, cost, time);

  const unequipItem = (slot: CommanderEquipmentSlotId) => {
    setCommander(prev => {
      const item = prev.equipment[slot];
      if (!item) return prev;
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: null },
        inventory: [...prev.inventory, item]
      };
    });
  };

  const craftItem = (item: Item, cost: {metal: number, crystal: number, deuterium?: number}) => {
     if (resources.metal >= cost.metal && resources.crystal >= cost.crystal && (!cost.deuterium || resources.deuterium >= cost.deuterium)) {
        setResources(prev => ({
           ...prev,
           metal: prev.metal - cost.metal,
           crystal: prev.crystal - cost.crystal,
           deuterium: prev.deuterium - (cost.deuterium || 0)
        }));
        setCommander(prev => ({
           ...prev,
           inventory: [...prev.inventory, item]
        }));
        addEvent("Crafting Complete", `Created ${item.name}`, "success");
     } else {
        toast({ title: "Insufficient Resources", description: "Not enough materials to craft this item.", variant: "destructive" });
     }
  };

  const temperItem = (itemId: string) => {
     if (resources.metal >= 1000) {
        setResources(prev => ({ ...prev, metal: prev.metal - 1000 }));
        setCommander(prev => ({
           ...prev,
           inventory: prev.inventory.map(i => i.id === itemId ? { ...i, tempering: (i.tempering || 0) + 1 } : i),
           equipment: Object.fromEntries(
             Object.entries(prev.equipment).map(([slotId, item]) => [
               slotId,
               item?.id === itemId ? { ...item, tempering: (item.tempering || 0) + 1 } : item,
             ]),
           ) as CommanderState["equipment"],
        }));
        addEvent("Tempering Success", "Item improved successfully.", "success");
     }
  };

  const setCommanderName = (name: string) => {
    const normalized = (name || "").trim().slice(0, 48);
    if (!normalized) {
      toast({ title: "Invalid name", description: "Commander name cannot be empty.", variant: "destructive" });
      return;
    }

    setCommander(prev => ({ ...prev, name: normalized }));
    addEvent("Commander Renamed", `High command now recognizes ${normalized}.`, "info");
  };

  const setEmpireName = (name: string) => {
    const normalized = (name || "").trim().slice(0, 64);
    if (!normalized) {
      toast({ title: "Invalid empire name", description: "Empire name cannot be empty.", variant: "destructive" });
      return;
    }

    setCommander((prev) => ({ ...prev, empireName: normalized }));
    addEvent("Empire Renamed", `${normalized} is now the active imperial designation.`, "info");
  };

  const setHomeWorldName = (name: string) => {
    const normalized = (name || "").trim().slice(0, 64);
    if (!normalized) {
      toast({ title: "Invalid home world name", description: "Home world name cannot be empty.", variant: "destructive" });
      return;
    }

    setPlanetName(normalized);
    addEvent("Home World Renamed", `${normalized} is now your registered capital world.`, "info");
  };

  const setCommanderIdentity = (race: RaceId, cls: ClassId, subClass: SubClassId | null) => {
    setCommander(prev => ({ ...prev, race, class: cls, subClass }));
    addEvent("Identity Updated", `Commander identity re-sequenced to ${RACES[race].name} ${CLASSES[cls].name}.`, "info");
  };

  const upgradeCommanderSkill = (skill: "warfare" | "logistics" | "science" | "engineering") => {
    const level = commander?.stats?.level || 1;
    const current = commander?.stats?.[skill] || 1;
    const allocated = Math.max(0, (commander?.stats?.warfare || 1) - 1)
      + Math.max(0, (commander?.stats?.logistics || 1) - 1)
      + Math.max(0, (commander?.stats?.science || 1) - 1)
      + Math.max(0, (commander?.stats?.engineering || 1) - 1);
    const totalPoints = Math.max(0, (level - 1) * 2);
    const availablePoints = Math.max(0, totalPoints - allocated);

    if (current >= 10) {
      toast({ title: "Skill maxed", description: "This skill is already at maximum level.", variant: "destructive" });
      return false;
    }

    if (availablePoints <= 0) {
      toast({ title: "No skill points", description: "Gain commander levels to unlock more skill points.", variant: "destructive" });
      return false;
    }

    setCommander((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [skill]: (prev.stats[skill] || 1) + 1,
      },
    }));

    addEvent("Skill Upgraded", `${skill[0].toUpperCase()}${skill.slice(1)} increased to ${current + 1}.`, "success");
    return true;
  };

  const setGovernmentType = (type: GovernmentId) => {
     setGovernment(prev => {
        const newBase = GOVERNMENTS[type].baseStats;
        return {
           ...prev,
           type,
           stats: {
              ...prev.stats,
              stability: newBase.stability,
              efficiency: newBase.efficiency,
              militaryReadiness: newBase.military
           }
        };
     });
     addEvent("Revolution", `Government reformed into ${GOVERNMENTS[type].name}.`, "warning");
  };

  const completeSetup = async (newCommander: CommanderState & { empireSlot?: number }, newGovernment: GovernmentState, options?: { homeWorldName?: string }) => {
    try {
      const nextHomeWorldName = (options?.homeWorldName || planetName || "Earth").trim().slice(0, 64) || "Earth";
      await saveGameStateMutation.mutateAsync({ 
        commander: newCommander, 
        government: newGovernment,
        planetName: nextHomeWorldName,
        empireSlot: newCommander.empireSlot || 1,
        setupComplete: true 
      });
      setCommander(newCommander);
      setGovernment(newGovernment);
      setPlanetName(nextHomeWorldName);
      setNeedsSetup(false);
    } catch (error) {
      console.error("Failed to complete setup:", error);
      throw error;
    }
  };

  const togglePolicy = (policyId: string) => {
     setGovernment(prev => {
        const isActive = prev.policies.includes(policyId);
        return {
           ...prev,
           policies: isActive ? prev.policies.filter(p => p !== policyId) : [...prev.policies, policyId]
        };
     });
  };

  const setTaxRate = (rate: number) => {
     setGovernment(prev => ({ ...prev, taxRate: rate }));
  };

  const spendTurns = async (amount: number): Promise<boolean> => {
    if (currentTurns < amount) {
      addEvent("Insufficient Turns", `Need ${amount} turn(s), have ${currentTurns}`, "warning");
      return false;
    }

    try {
      const response = await apiRequest("POST", "/api/turns/spend", { amount });
      if (response.success) {
        setCurrentTurns(response.currentTurns);
        addEvent("Turns Spent", `Used ${amount} turn(s) for action`, "info");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to spend turns:", error);
      return false;
    }
  };

  const dispatchFleet = (missionData: Omit<Mission, "id" | "status" | "returnTime">) => {
     const flightTime = missionData.arrivalTime / (config?.fleetSpeed || 1);
     const now = Date.now();
     
     const arrivalTime = new Date(now + flightTime);
     const returnTime = new Date(now + (flightTime * 2));
     
     const backendMission = {
        type: missionData.type,
        target: missionData.target,
        origin: coordinates,
        units: missionData.units,
        departureTime: new Date(now),
        arrivalTime: arrivalTime,
        returnTime: returnTime,
        status: "outbound"
     };

     createMissionMutation.mutate(backendMission);
     
     setUnits(prev => {
        const newUnits = {...prev};
        Object.entries(missionData.units).forEach(([id, count]) => {
           newUnits[id] = Math.max(0, (newUnits[id] || 0) - count);
        });
        return newUnits;
     });

     addEvent("Fleet Dispatched", `Fleet sent to ${missionData.target} on ${missionData.type} mission.`, "info");
  };

  const processMissions = () => {
    processMissionsMutation.mutate(undefined, {
      onSuccess: (data: any) => {
        if (data.completedCount > 0) {
          addEvent("Missions Completed", `${data.completedCount} mission(s) completed. Resources gained!`, "success");
        }
      },
      onError: (error: any) => {
        addEvent("Mission Processing Error", `Failed to process missions: ${error.message}`, "danger");
      }
    });
  };

  const updateConfig = (newConfig: Partial<GameConfig>) => {
     setConfig(prev => ({ ...prev, ...newConfig }));
     addEvent("System Update", "Server configuration parameters updated.", "warning");
  };

  const sendMessage = (to: string, subject: string, body: string) => {
     sendMessageMutation.mutate({
       toUserId: to,
       to: to,
       subject,
       body,
       type: "player"
     });
     addEvent("Message Sent", `Communique dispatched to ${to}.`, "success");
  };

  const markMessageRead = (id: string) => {
     markMessageReadMutation.mutate(id);
     setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = (id: string) => {
     deleteMessageMutation.mutate(id);
     setMessages(prev => prev.filter(m => m.id !== id));
  };

  const createAlliance = (name: string, tag: string) => {
     createAllianceMutation.mutate({ name, tag, description: "A new power rises." });
  };

  const switchRealm = async (realmId: string): Promise<void> => {
    const normalizedRealmId = String(realmId || "").trim();
    if (!normalizedRealmId || normalizedRealmId === realmData?.selectedRealmId) {
      return;
    }

    if (!authUser) {
      localStorage.setItem("stellar_pending_realm", normalizedRealmId);
      return;
    }

    if (realmData?.realms?.length && !realmData.realms.some((realm) => realm.id === normalizedRealmId)) {
      throw new Error("The selected realm is not available on this server.");
    }

    await switchRealmMutation.mutateAsync(normalizedRealmId);
  };

  const joinAlliance = (id: string) => {
     joinAllianceMutation.mutate(id);
  };

  const leaveAlliance = () => {
     if (alliance?.id) {
       leaveAllianceMutation.mutate(alliance.id);
     }
  };

  const activateArtifact = (id: string) => {
     const artifact = artifacts.find(a => a.id === id);
     if (artifact && artifact.type === "active") {
        // Check cooldown
        const now = Date.now();
        if (artifact.lastUsed && now - artifact.lastUsed < (artifact.cooldown || 0)) {
           toast({ title: "Artifact on Cooldown", description: `${artifact.name} is not ready yet.`, variant: "destructive" });
           return;
        }
        
        // Apply effect
        setArtifacts(prev => prev.map(a => a.id === id ? { ...a, lastUsed: now } : a));
        addEvent("Artifact Activated", `${artifact.name} activated.`, "success");
        
        // Mock effect implementation (e.g. chronos device)
        if (id === "chronos_device") {
           setQueue(prev => {
              // Finish all construction immediately
              const finished = prev.map(q => ({ ...q, endTime: now }));
              // Effect will happen in next tick
              return finished;
           });
        }
     }
  };

  const toggleCronJob = (id: string) => {
    const job = cronJobs.find(j => j.id === id);
    if (!job) return;
    const newEnabled = !job.enabled;
    setCronJobs(prev => prev.map(j => j.id === id ? { ...j, enabled: newEnabled } : j));
    fetch(`/api/cron/jobs/${id}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ enabled: newEnabled }),
    }).catch(() => {
      setCronJobs(prev => prev.map(j => j.id === id ? { ...j, enabled: !newEnabled } : j));
    });
  };

  const login = async () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error("Logout API failed", e);
    }
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsActualAdmin(false);
    setAdminRole(null);
    setUsername("");
    setIsInitialized(false);
    localStorage.removeItem('stellar_username');
    localStorage.removeItem('stellar_password');
    window.location.href = '/';
  };

  const toggleAdmin = () => {
    if (!isActualAdmin) {
       addEvent("Access Denied", "You do not have administrator privileges.", "danger");
       return;
    }
    setIsAdmin(prev => !prev);
    if (!isAdmin) {
       addEvent("System Access", "Administrator mode activated.", "warning");
    } else {
       addEvent("System Access", "Switched to user view mode.", "info");
    }
  };

  const runCronJob = (id: string) => {
    const job = cronJobs.find(j => j.id === id);
    if (job) {
       addEvent("Manual Job Trigger", `Manually triggered ${job.name}`, "info");
       setCronJobs(prev => prev.map(j => j.id === id ? { ...j, lastRun: Date.now() } : j));
       fetch(`/api/cron/jobs/${id}/run`, { method: "POST", credentials: "include" }).catch((err) => console.warn("Failed to trigger cron job:", err));
    }
  };

  const travelTo = (destinationName: string, coords: string, cost: { deuterium: number }) => {
    if (resources.deuterium >= cost.deuterium) {
       setResources(prev => ({ ...prev, deuterium: prev.deuterium - cost.deuterium }));
       setPlanetName(destinationName);
       setCoordinates(coords);
       addEvent("Hyperspace Jump", `Fleet successfully jumped to ${destinationName} [${coords}].`, "success");
    } else {
       toast({ title: "Insufficient Deuterium", description: "Not enough deuterium for this hyperspace jump.", variant: "destructive" });
    }
  };

  // Simple loading state: only show loading during initial auth check and game-state bootstrap.
  const isLoading = authLoading || (Boolean(authUser) && gameStateLoading && !isInitialized);

  return (
    <GameContext.Provider value={{ 
       resources, 
       buildings, 
       orbitalBuildings,
       refinerySystems,
       infrastructureSystems,
       technologySystems,
       kardashevSystems,
       megastructureSystems,
       technologyDivisionSystems,
       researchTreeSystems,
       shipyardCategorySystems,
       starshipLineSystems,
       activeBase,
       setActiveBase,
       research,
       units,
       megastructures,
       commander,
       empireName: commander?.empireName || "Stellar Dominion",
       government,
       planetName,
       coordinates, 
       events,
       queue,
       activeMissions,
       config,
       messages,
       alliance,
       artifacts,
       cronJobs,
       isAdmin,
       isActualAdmin,
       adminRole,
       isLoggedIn,
       needsSetup,
       onboardingStep,
       setOnboardingStep,
       isLoading,
       username,
       login,
       logout,
       toggleAdmin,
       updateBuilding,
       upgradeRefinerySystem,
       upgradeInfrastructureSystem,
       upgradeTechnologySystem,
       upgradeKardashevSystem,
       upgradeMegastructureSystem,
       upgradeTechnologyDivisionSystem,
       upgradeResearchTreeSystem,
       upgradeShipyardCategorySystem,
       upgradeStarshipLineSystem,
       updateResearch,
       buildUnit,
       constructMegastructure,
       addEvent,
        equipItem,
        unequipItem,
        equipSlot,
        unequipAll,
        equipAll,
        autoOptimize,
        loadoutPresets,
        saveLoadout,
        loadLoadout,
        deleteLoadout,
        renameLoadout,
       craftItem,
       temperItem,
      setCommanderName,
      setEmpireName,
      setHomeWorldName,
      setCommanderIdentity,
      upgradeCommanderSkill,
       setGovernmentType,
       completeSetup,
       togglePolicy,
       setTaxRate,
       dispatchFleet,
       updateConfig,
       sendMessage,
       markMessageRead,
       deleteMessage,
       createAlliance,
       joinAlliance,
       leaveAlliance,
       activateArtifact,
       toggleCronJob,
       runCronJob,
       travelTo,
       inventory,
       buyItem,
       sellItem,
       totalTurns,
       currentTurns,
       realmServers: realmData?.realms || [],
       selectedRealmId: realmData?.selectedRealmId || "",
       selectedRealm: realmData?.selectedRealm || null,
       spendTurns,
       switchRealm,
       processMissions,
       completeResearch: completeResearchMutation.mutate,
       processQueue: processQueueMutation.mutate
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
