import { eq } from "drizzle-orm";
import { db } from "../db";
import { playerStates } from "../../shared/schema";
import { enforceStrategicOperation, recordStrategicOperation } from "./stargate/protectionService";

export const TURN_INTERVAL_MS = 30 * 60 * 1000;
export const TURN_GENERATION_THRESHOLD = 4_000;
export const TURN_STORAGE_CAP = 10_000;
export const MAX_OPERATION_TURNS = 15;
export const MAX_LOG_ENTRIES = 30;

export const RACES = ["asgard", "goauld", "replicator", "tauri"] as const;
export type StargateRace = (typeof RACES)[number];

export const DEFCON_LEVELS = ["none", "low", "medium", "high", "critical"] as const;
export type DefConLevel = (typeof DEFCON_LEVELS)[number];

export const TRAINING_TYPES = [
  "miner",
  "lifer",
  "attackTroop",
  "superAttackTroop",
  "defenseTroop",
  "superDefenseTroop",
  "covertAgent",
  "antiIntelAgent",
  "attackWeapon",
  "defenseWeapon",
] as const;
export type TrainingType = (typeof TRAINING_TYPES)[number];

export const TECHNOLOGY_TYPES = ["offense", "defense", "covert", "antiCovert", "unique", "mercenary"] as const;
export type TechnologyType = (typeof TECHNOLOGY_TYPES)[number];

export type WeaponCategory = "attack" | "defense" | "covert";
export interface WeaponDefinition {
  id: string;
  name: string;
  race: StargateRace | "any";
  category: WeaponCategory;
  strength: number;
  purchaseCost: number;
  sellValue: number;
  durabilityMax: number;
  repairCost: number;
  requiredTechnology?: TechnologyType;
  requiredLevel?: number;
}

export interface ArmoryItem {
  owned: number;
  equipped: number;
  condition: number;
}

export interface ArmoryState {
  inventory: Record<string, ArmoryItem>;
}

export const WEAPON_CATALOG: WeaponDefinition[] = [
  { id: "tau-railgun", name: "Tau'ri Railgun", race: "tauri", category: "attack", strength: 24, purchaseCost: 1_600, sellValue: 800, durabilityMax: 100, repairCost: 240, requiredTechnology: "offense", requiredLevel: 1 },
  { id: "asgard-shield", name: "Asgard Shield Array", race: "asgard", category: "defense", strength: 24, purchaseCost: 1_600, sellValue: 800, durabilityMax: 100, repairCost: 240, requiredTechnology: "defense", requiredLevel: 1 },
  { id: "goauld-staff", name: "Goa'uld Staff Cannon", race: "goauld", category: "attack", strength: 18, purchaseCost: 1_150, sellValue: 575, durabilityMax: 100, repairCost: 180 },
  { id: "replicator-probe", name: "Replicator Probe Swarm", race: "replicator", category: "covert", strength: 16, purchaseCost: 1_250, sellValue: 625, durabilityMax: 100, repairCost: 195, requiredTechnology: "covert", requiredLevel: 1 },
  { id: "naquadah-bulwark", name: "Naquadah Bulwark", race: "any", category: "defense", strength: 14, purchaseCost: 950, sellValue: 475, durabilityMax: 100, repairCost: 140 },
];

export const ASCENSION_RULES = {
  requiredGlory: 100,
  requiredReputation: 30,
  requiredNaquadah: 250_000,
  maximumAscensionLevel: 5,
} as const;

type RecordValue = Record<string, unknown>;
type NumericRecord = Record<string, number>;

export interface StargateLogEntry {
  id: string;
  createdAt: number;
  kind: "turn" | "training" | "bank" | "defcon" | "research" | "battle" | "intelligence" | "armory" | "ascension" | "system";
  title: string;
  summary: string;
  details?: RecordValue;
}

export interface StargateWarsState {
  race: StargateRace;
  defcon: DefConLevel;
  attackTurns: number;
  marketTurns: number;
  unitProduction: number;
  spyLevel: number;
  antiSpyLevel: number;
  technologies: Record<TechnologyType, number>;
  glory: number;
  reputation: number;
  ascensionPoints: number;
  ascensionLevel: number;
  armory: ArmoryState;
  lastTurnAt: number;
  logs: StargateLogEntry[];
}

export interface StargateResources {
  naquadah: number;
  bankedNaquadah: number;
}

export interface StargatePersonnel {
  untrained: number;
  miners: number;
  lifers: number;
  attackTroops: number;
  superAttackTroops: number;
  defenseTroops: number;
  superDefenseTroops: number;
  covertAgents: number;
  antiIntelAgents: number;
  attackWeapons: number;
  defenseWeapons: number;
}

const DEFCON_INCOME_MULTIPLIER: Record<DefConLevel, number> = {
  none: 1,
  low: 0.9,
  medium: 0.8,
  high: 0.6,
  critical: 0.3,
};

const DEFCON_COUNTER_INTELLIGENCE_MULTIPLIER: Record<DefConLevel, number> = {
  none: 1,
  low: 1.1,
  medium: 1.2,
  high: 1.4,
  critical: 1.7,
};

const TRAINING_COSTS: Record<TrainingType, { untrained?: number; naquadah?: number; source?: keyof StargatePersonnel }> = {
  miner: { untrained: 1 },
  lifer: { untrained: 10, source: "miners" },
  attackTroop: { untrained: 1 },
  superAttackTroop: { untrained: 5, source: "attackTroops" },
  defenseTroop: { untrained: 1 },
  superDefenseTroop: { untrained: 5, source: "defenseTroops" },
  covertAgent: { untrained: 2 },
  antiIntelAgent: { untrained: 2 },
  attackWeapon: { naquadah: 250 },
  defenseWeapon: { naquadah: 250 },
};

const defaultTechnologies = (): Record<TechnologyType, number> => ({
  offense: 0,
  defense: 0,
  covert: 0,
  antiCovert: 0,
  unique: 0,
  mercenary: 0,
});

const defaultArmory = (): ArmoryState => ({ inventory: {} });

const defaultStrategicState = (now = Date.now()): StargateWarsState => ({
  race: "tauri",
  defcon: "none",
  attackTurns: 20,
  marketTurns: 3,
  unitProduction: 10,
  spyLevel: 1,
  antiSpyLevel: 1,
  technologies: defaultTechnologies(),
  glory: 0,
  reputation: 0,
  ascensionPoints: 0,
  ascensionLevel: 0,
  armory: defaultArmory(),
  lastTurnAt: now,
  logs: [
    {
      id: `system-${now}`,
      createdAt: now,
      kind: "system",
      title: "Strategic command initialized",
      summary: "Your realm is ready for 30-minute strategic turns.",
    },
  ],
});

const defaultPersonnel = (): StargatePersonnel => ({
  untrained: 100,
  miners: 0,
  lifers: 0,
  attackTroops: 0,
  superAttackTroops: 0,
  defenseTroops: 0,
  superDefenseTroops: 0,
  covertAgents: 0,
  antiIntelAgents: 0,
  attackWeapons: 0,
  defenseWeapons: 0,
});

const asRecord = (value: unknown): RecordValue => (value && typeof value === "object" && !Array.isArray(value) ? { ...(value as RecordValue) } : {});
const whole = (value: unknown, fallback = 0): number => Math.max(0, Math.floor(Number.isFinite(Number(value)) ? Number(value) : fallback));
const bounded = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const normalizeRace = (value: unknown): StargateRace => (RACES.includes(value as StargateRace) ? (value as StargateRace) : "tauri");
const normalizeDefcon = (value: unknown): DefConLevel => (DEFCON_LEVELS.includes(value as DefConLevel) ? (value as DefConLevel) : "none");

function normalizeStrategicState(value: unknown, now = Date.now()): StargateWarsState {
  const raw = asRecord(value);
  const rawTechnologies = asRecord(raw.technologies);
  const rawLogs = Array.isArray(raw.logs) ? raw.logs : [];

  return {
    race: normalizeRace(raw.race),
    defcon: normalizeDefcon(raw.defcon),
    attackTurns: bounded(whole(raw.attackTurns, 20), 0, TURN_STORAGE_CAP),
    marketTurns: whole(raw.marketTurns, 3),
    unitProduction: Math.max(1, whole(raw.unitProduction, 10)),
    spyLevel: Math.max(1, whole(raw.spyLevel, 1)),
    antiSpyLevel: Math.max(1, whole(raw.antiSpyLevel, 1)),
    technologies: {
      offense: whole(rawTechnologies.offense),
      defense: whole(rawTechnologies.defense),
      covert: whole(rawTechnologies.covert),
      antiCovert: whole(rawTechnologies.antiCovert),
      unique: whole(rawTechnologies.unique),
      mercenary: whole(rawTechnologies.mercenary),
    },
    glory: whole(raw.glory),
    reputation: whole(raw.reputation),
    ascensionPoints: whole(raw.ascensionPoints),
    ascensionLevel: whole(raw.ascensionLevel),
    armory: normalizeArmory(raw.armory),
    lastTurnAt: Math.max(0, Number(raw.lastTurnAt) || now),
    logs: rawLogs.filter((entry): entry is StargateLogEntry => Boolean(entry && typeof entry === "object")).slice(0, MAX_LOG_ENTRIES),
  };
}

function normalizeArmory(value: unknown): ArmoryState {
  const raw = asRecord(value);
  const rawInventory = asRecord(raw.inventory);
  const inventory = Object.fromEntries(
    WEAPON_CATALOG.map((weapon) => {
      const item = asRecord(rawInventory[weapon.id]);
      const owned = whole(item.owned);
      return [weapon.id, {
        owned,
        equipped: bounded(whole(item.equipped), 0, owned),
        condition: bounded(whole(item.condition, weapon.durabilityMax), 0, weapon.durabilityMax),
      }];
    }),
  ) as Record<string, ArmoryItem>;
  return { inventory };
}

function normalizePersonnel(value: unknown): StargatePersonnel {
  const raw = asRecord(value);
  const defaults = defaultPersonnel();
  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [key, whole(raw[key], fallback)]),
  ) as unknown as StargatePersonnel;
}

function normalizeResources(value: unknown): RecordValue & StargateResources {
  const raw = asRecord(value);
  return {
    ...raw,
    naquadah: whole(raw.naquadah, 0),
    bankedNaquadah: whole(raw.bankedNaquadah, 0),
  };
}

function createLog(kind: StargateLogEntry["kind"], title: string, summary: string, details?: RecordValue): StargateLogEntry {
  const now = Date.now();
  return {
    id: `${kind}-${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    kind,
    title,
    summary,
    details,
  };
}

function addLog(state: StargateWarsState, entry: StargateLogEntry): StargateWarsState {
  return { ...state, logs: [entry, ...state.logs].slice(0, MAX_LOG_ENTRIES) };
}

function raceIncomeMultiplier(race: StargateRace): number {
  return race === "goauld" ? 1.25 : 1;
}

function raceOffenseMultiplier(race: StargateRace): number {
  return race === "tauri" ? 1.25 : 1;
}

function raceDefenseMultiplier(race: StargateRace): number {
  return race === "asgard" ? 1.25 : 1;
}

function raceCovertMultiplier(race: StargateRace): number {
  return race === "replicator" ? 1.25 : 1;
}

function technologyMultiplier(level: number): number {
  return 1 + Math.max(0, level) * 0.1;
}

function getWeaponDefinition(weaponId: string): WeaponDefinition {
  const weapon = WEAPON_CATALOG.find((entry) => entry.id === weaponId);
  if (!weapon) throw new Error("Unknown armory item");
  return weapon;
}

function isWeaponAvailable(weapon: WeaponDefinition, strategic: StargateWarsState): boolean {
  const technologySatisfied = !weapon.requiredTechnology || strategic.technologies[weapon.requiredTechnology] >= (weapon.requiredLevel ?? 0);
  return technologySatisfied && (weapon.race === "any" || weapon.race === strategic.race);
}

function calculateArmoryStrength(strategic: StargateWarsState, category: WeaponCategory): number {
  return WEAPON_CATALOG.filter((weapon) => weapon.category === category).reduce((total, weapon) => {
    const item = strategic.armory.inventory[weapon.id];
    if (!item || item.equipped <= 0 || item.condition <= 0) return total;
    return total + Math.floor(item.equipped * weapon.strength * (item.condition / weapon.durabilityMax));
  }, 0);
}

export function calculateNaturalIncome(personnel: StargatePersonnel, state: StargateWarsState): number {
  // A Lifer is a permanent cadre created from ten Miners. It preserves the same
  // economic contribution through Ascension instead of becoming a losing conversion.
  const baseIncome = personnel.untrained * 20 + personnel.miners * 80 + personnel.lifers * 800;
  return Math.floor(baseIncome * raceIncomeMultiplier(state.race) * DEFCON_INCOME_MULTIPLIER[state.defcon]);
}

export function calculateBankCapacity(personnel: StargatePersonnel, state: StargateWarsState): number {
  return Math.floor(calculateNaturalIncome(personnel, { ...state, defcon: "none" }) * 48 * 1.5);
}

export function calculateStrikeAction(personnel: StargatePersonnel, state: StargateWarsState): number {
  const normalWeapons = Math.min(personnel.attackTroops, personnel.attackWeapons);
  const eliteWeapons = Math.min(personnel.superAttackTroops, Math.max(0, personnel.attackWeapons - normalWeapons));
  const legacyStrength = normalWeapons * 5 + eliteWeapons * 10;
  return Math.floor((legacyStrength + calculateArmoryStrength(state, "attack")) * technologyMultiplier(state.technologies.offense) * raceOffenseMultiplier(state.race));
}

export function calculateDefenseAction(personnel: StargatePersonnel, state: StargateWarsState): number {
  const normalWeapons = Math.min(personnel.defenseTroops, personnel.defenseWeapons);
  const eliteWeapons = Math.min(personnel.superDefenseTroops, Math.max(0, personnel.defenseWeapons - normalWeapons));
  const legacyStrength = normalWeapons * 5 + eliteWeapons * 10;
  return Math.floor((legacyStrength + calculateArmoryStrength(state, "defense")) * technologyMultiplier(state.technologies.defense) * raceDefenseMultiplier(state.race));
}

export function calculateCovertAction(personnel: StargatePersonnel, state: StargateWarsState): number {
  const base = Math.sqrt(2 ** state.spyLevel) * personnel.covertAgents * technologyMultiplier(state.technologies.covert) * raceCovertMultiplier(state.race) + personnel.covertAgents + calculateArmoryStrength(state, "covert");
  return Math.floor(base * 10);
}

export function calculateAntiCovertAction(personnel: StargatePersonnel, state: StargateWarsState): number {
  const base = Math.sqrt(2 ** (state.antiSpyLevel + 2)) * personnel.antiIntelAgents * technologyMultiplier(state.technologies.antiCovert) + personnel.antiIntelAgents;
  return Math.floor(base * 10 * DEFCON_COUNTER_INTELLIGENCE_MULTIPLIER[state.defcon]);
}

export function calculateOverallRank(personnel: StargatePersonnel, state: StargateWarsState): number {
  return Math.floor((calculateStrikeAction(personnel, state) + calculateDefenseAction(personnel, state) + calculateCovertAction(personnel, state) + calculateAntiCovertAction(personnel, state)) / 4 + state.glory + state.reputation);
}

function deterministicPercent(seed: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return ((hash >>> 0) % 10_000) / 10_000;
}

async function requirePlayerState(userId: string) {
  const playerState = await db.query.playerStates.findFirst({ where: eq(playerStates.userId, userId) });
  if (!playerState) {
    throw new Error("Player state not found. Complete account setup before using strategic command.");
  }
  return playerState;
}

function hydrateState(playerState: Awaited<ReturnType<typeof requirePlayerState>>) {
  const resources = normalizeResources(playerState.resources);
  const personnel = normalizePersonnel(playerState.units);
  const government = asRecord(playerState.government);
  const existingState = government.stargateWars;
  const needsInitialization = !existingState;
  const strategic = existingState ? normalizeStrategicState(existingState) : defaultStrategicState();
  const initializedResources = needsInitialization && resources.naquadah === 0 && resources.bankedNaquadah === 0
    ? { ...resources, naquadah: 25_000 }
    : resources;
  return { resources: initializedResources, personnel, government, strategic, needsInitialization };
}

async function persistState(
  userId: string,
  payload: { resources?: RecordValue; personnel?: StargatePersonnel; government?: RecordValue },
): Promise<void> {
  // Stargate personnel and legacy fleets share `player_states.units`; merge rather than replace.
  const currentUnits = payload.personnel ? asRecord((await requirePlayerState(userId)).units) : undefined;
  await db.update(playerStates).set({
    ...(payload.resources ? { resources: payload.resources } : {}),
    ...(payload.personnel ? { units: { ...currentUnits, ...payload.personnel } } : {}),
    ...(payload.government ? { government: payload.government } : {}),
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, userId));
}

function stateToGovernment(government: RecordValue, strategic: StargateWarsState): RecordValue {
  return { ...government, stargateWars: strategic };
}

function buildSnapshot(resources: StargateResources, personnel: StargatePersonnel, strategic: StargateWarsState) {
  const naturalIncome = calculateNaturalIncome(personnel, strategic);
  return {
    strategic,
    resources: { naquadah: resources.naquadah, bankedNaquadah: resources.bankedNaquadah },
    personnel,
    metrics: {
      naturalIncome,
      bankCapacity: calculateBankCapacity(personnel, strategic),
      strikeAction: calculateStrikeAction(personnel, strategic),
      defenseAction: calculateDefenseAction(personnel, strategic),
      covertAction: calculateCovertAction(personnel, strategic),
      antiCovertAction: calculateAntiCovertAction(personnel, strategic),
      overallRank: calculateOverallRank(personnel, strategic),
      nextUnitProductionCost: strategic.unitProduction * 5_000 + 10_000,
      turnIntervalMinutes: TURN_INTERVAL_MS / 60_000,
      turnGenerationThreshold: TURN_GENERATION_THRESHOLD,
      turnStorageCap: TURN_STORAGE_CAP,
    },
  };
}

export async function getStargateState(userId: string) {
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic, needsInitialization } = hydrateState(playerState);
  if (needsInitialization) {
    await persistState(userId, { resources, personnel, government: stateToGovernment(government, strategic) });
  }
  return buildSnapshot(resources, personnel, strategic);
}

export async function processStrategicTurns(userId: string, now = Date.now()) {
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const elapsedTurns = Math.floor(Math.max(0, now - strategic.lastTurnAt) / TURN_INTERVAL_MS);

  if (elapsedTurns <= 0) {
    return { ...buildSnapshot(resources, personnel, strategic), processedTurns: 0, nextTurnAt: strategic.lastTurnAt + TURN_INTERVAL_MS };
  }

  const generatedTurns = strategic.attackTurns < TURN_GENERATION_THRESHOLD
    ? Math.min(elapsedTurns, TURN_GENERATION_THRESHOLD - strategic.attackTurns, TURN_STORAGE_CAP - strategic.attackTurns)
    : 0;
  const generatedPersonnel = strategic.unitProduction * elapsedTurns;
  const incomePerTurn = calculateNaturalIncome(personnel, strategic);
  const generatedIncome = incomePerTurn * elapsedTurns;
  const nextPersonnel = { ...personnel, untrained: personnel.untrained + generatedPersonnel };
  const nextStrategic = {
    ...strategic,
    attackTurns: bounded(strategic.attackTurns + generatedTurns, 0, TURN_STORAGE_CAP),
    lastTurnAt: strategic.lastTurnAt + elapsedTurns * TURN_INTERVAL_MS,
  };
  const nextResources = { ...resources, naquadah: resources.naquadah + generatedIncome };
  const loggedStrategic = addLog(nextStrategic, createLog(
    "turn",
    `${elapsedTurns} strategic turn${elapsedTurns === 1 ? "" : "s"} processed`,
    `Generated ${generatedIncome.toLocaleString()} Naquadah, ${generatedPersonnel.toLocaleString()} untrained personnel, and ${generatedTurns} attack turns.`,
    { elapsedTurns, generatedIncome, generatedPersonnel, generatedTurns },
  ));

  await persistState(userId, {
    resources: nextResources,
    personnel: nextPersonnel,
    government: stateToGovernment(government, loggedStrategic),
  });

  return { ...buildSnapshot(nextResources, nextPersonnel, loggedStrategic), processedTurns: elapsedTurns, nextTurnAt: loggedStrategic.lastTurnAt + TURN_INTERVAL_MS };
}

export async function selectRace(userId: string, race: StargateRace) {
  if (!RACES.includes(race)) throw new Error("Unsupported strategic race");
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const hasCommittedProgress = strategic.logs.some((entry) => entry.kind !== "system") || strategic.unitProduction > 10;
  if (hasCommittedProgress && strategic.race !== race) {
    throw new Error("Race selection is locked after strategic progression begins.");
  }
  const nextStrategic = addLog({ ...strategic, race }, createLog("system", "Strategic doctrine selected", `${race.toUpperCase()} doctrine is now active.`));
  await persistState(userId, { resources, personnel, government: stateToGovernment(government, nextStrategic) });
  return buildSnapshot(resources, personnel, nextStrategic);
}

export async function trainPersonnel(userId: string, type: TrainingType, quantity: number) {
  if (!TRAINING_TYPES.includes(type)) throw new Error("Unsupported training order");
  const count = bounded(Math.floor(quantity), 1, 100_000);
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const rule = TRAINING_COSTS[type];
  const source = rule.source;
  const sourceRequired = (rule.source ? rule.untrained : undefined) ?? 0;
  const untrainedRequired = rule.untrained && !source ? rule.untrained * count : 0;
  const naquadahRequired = (rule.naquadah ?? 0) * count;

  if (source && personnel[source] < sourceRequired * count) throw new Error(`Insufficient ${source} for this elite training order`);
  if (untrainedRequired > 0 && personnel.untrained < untrainedRequired) throw new Error("Insufficient untrained personnel");
  if (resources.naquadah < naquadahRequired) throw new Error("Insufficient Naquadah");

  const nextPersonnel = { ...personnel };
  const targetKey = type === "miner" ? "miners" : type === "lifer" ? "lifers" : type === "attackTroop" ? "attackTroops" : type === "superAttackTroop" ? "superAttackTroops" : type === "defenseTroop" ? "defenseTroops" : type === "superDefenseTroop" ? "superDefenseTroops" : type === "covertAgent" ? "covertAgents" : type === "antiIntelAgent" ? "antiIntelAgents" : type === "attackWeapon" ? "attackWeapons" : "defenseWeapons";
  nextPersonnel[targetKey] += count;
  if (source) nextPersonnel[source] -= sourceRequired * count;
  if (untrainedRequired > 0) nextPersonnel.untrained -= untrainedRequired;

  const nextResources = { ...resources, naquadah: resources.naquadah - naquadahRequired };
  const nextStrategic = addLog(strategic, createLog("training", "Training order completed", `${count.toLocaleString()} ${targetKey} added to strategic forces.`, { type, quantity: count, naquadahRequired }));
  await persistState(userId, { resources: nextResources, personnel: nextPersonnel, government: stateToGovernment(government, nextStrategic) });
  return buildSnapshot(nextResources, nextPersonnel, nextStrategic);
}

export async function upgradeUnitProduction(userId: string) {
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const cost = strategic.unitProduction * 5_000 + 10_000;
  if (resources.naquadah < cost) throw new Error("Insufficient Naquadah for Unit Production upgrade");
  const nextResources = { ...resources, naquadah: resources.naquadah - cost };
  const nextStrategic = addLog({ ...strategic, unitProduction: strategic.unitProduction + 1 }, createLog("research", "Unit Production upgraded", `Unit Production increased to ${strategic.unitProduction + 1}.`, { cost }));
  await persistState(userId, { resources: nextResources, personnel, government: stateToGovernment(government, nextStrategic) });
  return buildSnapshot(nextResources, personnel, nextStrategic);
}

export async function upgradeTechnology(userId: string, technology: TechnologyType) {
  if (!TECHNOLOGY_TYPES.includes(technology)) throw new Error("Unsupported technology track");
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const level = strategic.technologies[technology];
  const cost = 5_000 + (level + 1) * 4_000;
  if (resources.naquadah < cost) throw new Error("Insufficient Naquadah for technology upgrade");
  const technologies = { ...strategic.technologies, [technology]: level + 1 };
  const nextResources = { ...resources, naquadah: resources.naquadah - cost };
  const nextStrategic = addLog({ ...strategic, technologies }, createLog("research", "Technology upgraded", `${technology} technology advanced to level ${level + 1}.`, { technology, cost }));
  await persistState(userId, { resources: nextResources, personnel, government: stateToGovernment(government, nextStrategic) });
  return buildSnapshot(nextResources, personnel, nextStrategic);
}

export async function setDefcon(userId: string, defcon: DefConLevel) {
  if (!DEFCON_LEVELS.includes(defcon)) throw new Error("Unsupported DefCon level");
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const nextStrategic = addLog({ ...strategic, defcon }, createLog("defcon", "DefCon updated", `Realm alert is now ${defcon.toUpperCase()}.`));
  await persistState(userId, { resources, personnel, government: stateToGovernment(government, nextStrategic) });
  return buildSnapshot(resources, personnel, nextStrategic);
}

export async function transferBank(userId: string, direction: "deposit" | "withdraw", amount: number) {
  const quantity = Math.max(1, Math.floor(amount));
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const capacity = calculateBankCapacity(personnel, strategic);
  let nextResources = { ...resources };

  if (direction === "deposit") {
    if (resources.naquadah < quantity) throw new Error("Insufficient available Naquadah");
    if (resources.bankedNaquadah + quantity > capacity) throw new Error("Vault capacity would be exceeded");
    nextResources = { ...resources, naquadah: resources.naquadah - quantity, bankedNaquadah: resources.bankedNaquadah + quantity };
  } else {
    if (resources.bankedNaquadah < quantity) throw new Error("Insufficient Naquadah in vault");
    nextResources = { ...resources, naquadah: resources.naquadah + quantity, bankedNaquadah: resources.bankedNaquadah - quantity };
  }

  const nextStrategic = addLog(strategic, createLog("bank", `Vault ${direction}`, `${quantity.toLocaleString()} Naquadah ${direction === "deposit" ? "secured" : "released"}.`, { direction, amount: quantity }));
  await persistState(userId, { resources: nextResources, personnel, government: stateToGovernment(government, nextStrategic) });
  return buildSnapshot(nextResources, personnel, nextStrategic);
}

export async function getArmory(userId: string) {
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic, needsInitialization } = hydrateState(playerState);
  if (needsInitialization) await persistState(userId, { resources, personnel, government: stateToGovernment(government, strategic) });
  return {
    catalog: WEAPON_CATALOG.map((weapon) => ({
      ...weapon,
      available: isWeaponAvailable(weapon, strategic),
      item: strategic.armory.inventory[weapon.id] || { owned: 0, equipped: 0, condition: weapon.durabilityMax },
    })),
    state: buildSnapshot(resources, personnel, strategic),
  };
}

export async function manageArmory(userId: string, action: "buy" | "sell" | "equip" | "unequip" | "repair" | "scrap", weaponId: string, quantity: number) {
  const count = bounded(Math.floor(quantity), 1, 10_000);
  const weapon = getWeaponDefinition(weaponId);
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const currentItem = strategic.armory.inventory[weapon.id] || { owned: 0, equipped: 0, condition: weapon.durabilityMax };
  const inventory = { ...strategic.armory.inventory, [weapon.id]: { ...currentItem } };
  const item = inventory[weapon.id];
  let nextResources = { ...resources };

  if (action === "buy") {
    if (!isWeaponAvailable(weapon, strategic)) throw new Error("This weapon is unavailable to the current doctrine or technology level");
    const cost = weapon.purchaseCost * count;
    if (resources.naquadah < cost) throw new Error("Insufficient Naquadah for this armory order");
    nextResources.naquadah -= cost;
    item.owned += count;
    if (item.owned === count) item.condition = weapon.durabilityMax;
  } else if (action === "sell" || action === "scrap") {
    if (item.owned - item.equipped < count) throw new Error("Unequip enough units before selling or scrapping this weapon");
    item.owned -= count;
    nextResources.naquadah += (action === "sell" ? weapon.sellValue : Math.floor(weapon.sellValue * 0.35)) * count;
    if (item.owned === 0) item.condition = weapon.durabilityMax;
  } else if (action === "equip") {
    if (!isWeaponAvailable(weapon, strategic)) throw new Error("This weapon is unavailable to the current doctrine or technology level");
    if (item.condition <= 0) throw new Error("Repair this weapon before equipping it");
    if (item.owned - item.equipped < count) throw new Error("Insufficient unequipped weapon inventory");
    item.equipped += count;
  } else if (action === "unequip") {
    if (item.equipped < count) throw new Error("Insufficient equipped weapons");
    item.equipped -= count;
  } else {
    if (item.owned < count) throw new Error("Insufficient owned weapon inventory");
    const missingRatio = 1 - item.condition / weapon.durabilityMax;
    const cost = Math.ceil(weapon.repairCost * missingRatio * count);
    if (cost <= 0) throw new Error("Selected weapons are already fully serviced");
    if (resources.naquadah < cost) throw new Error("Insufficient Naquadah for this repair order");
    nextResources.naquadah -= cost;
    item.condition = weapon.durabilityMax;
  }

  const nextStrategic = addLog({ ...strategic, armory: { inventory } }, createLog(
    "armory",
    `Armory ${action} order completed`,
    `${count.toLocaleString()} ${weapon.name} unit(s) processed.`,
    { action, weaponId: weapon.id, quantity: count, item: inventory[weapon.id] },
  ));
  await persistState(userId, { resources: nextResources, personnel, government: stateToGovernment(government, nextStrategic) });
  return buildSnapshot(nextResources, personnel, nextStrategic);
}

export async function upgradeCovertLevel(userId: string, type: "spy" | "antiSpy") {
  const playerState = await requirePlayerState(userId);
  const { resources, personnel, government, strategic } = hydrateState(playerState);
  const level = type === "spy" ? strategic.spyLevel : strategic.antiSpyLevel;
  const cost = 4_000 + level * 3_500;
  if (resources.naquadah < cost) throw new Error("Insufficient Naquadah for this intelligence upgrade");
  const nextResources = { ...resources, naquadah: resources.naquadah - cost };
  const nextStrategic = addLog(
    { ...strategic, [type === "spy" ? "spyLevel" : "antiSpyLevel"]: level + 1 },
    createLog("research", `${type === "spy" ? "Spy" : "Anti-Spy"} Level upgraded`, `${type === "spy" ? "Spy" : "Anti-Spy"} Level advanced to ${level + 1}.`, { type, cost }),
  );
  await persistState(userId, { resources: nextResources, personnel, government: stateToGovernment(government, nextStrategic) });
  return buildSnapshot(nextResources, personnel, nextStrategic);
}

export async function executeSabotage(attackerId: string, defenderId: string) {
  if (!defenderId || attackerId === defenderId) throw new Error("Select another realm for sabotage");
  await enforceStrategicOperation(attackerId, defenderId, "covert");
  const attackerRecord = await requirePlayerState(attackerId);
  const defenderRecord = await requirePlayerState(defenderId);
  const attacker = hydrateState(attackerRecord);
  const defender = hydrateState(defenderRecord);
  if (attacker.strategic.attackTurns < 1) throw new Error("At least one attack turn is required for sabotage");
  if (attacker.personnel.covertAgents < 1) throw new Error("Train at least one covert agent before conducting sabotage");

  const covertPower = calculateCovertAction(attacker.personnel, attacker.strategic);
  const antiCovertPower = calculateAntiCovertAction(defender.personnel, defender.strategic);
  const seed = `sabotage:${attackerId}:${defenderId}:${Date.now()}`;
  const roll = deterministicPercent(seed);
  const chance = bounded(0.35 + (covertPower - antiCovertPower) / Math.max(500, covertPower + antiCovertPower), 0.06, 0.88);
  const eligibleItems = WEAPON_CATALOG.filter((weapon) => (defender.strategic.armory.inventory[weapon.id]?.equipped || 0) > 0);
  const success = roll < chance && eligibleItems.length > 0;
  const detected = !success || roll > chance * 0.75;
  const agentLosses = detected ? Math.min(attacker.personnel.covertAgents, Math.max(1, Math.ceil(attacker.personnel.covertAgents * (1 - chance) * 0.12))) : 0;
  const target = eligibleItems.length ? eligibleItems[Math.floor(deterministicPercent(`${seed}:target`) * eligibleItems.length)] : undefined;
  const inventory = { ...defender.strategic.armory.inventory };
  const targetItem = target ? { ...inventory[target.id] } : undefined;
  const damage = success && target && targetItem ? bounded(8 + Math.floor(deterministicPercent(`${seed}:damage`) * 23), 8, 30) : 0;
  if (target && targetItem) inventory[target.id] = { ...targetItem, condition: success ? Math.max(0, targetItem.condition - damage) : targetItem.condition };

  const attackerPersonnel = { ...attacker.personnel, covertAgents: attacker.personnel.covertAgents - agentLosses };
  const attackerStrategic = addLog(
    { ...attacker.strategic, attackTurns: attacker.strategic.attackTurns - 1, reputation: attacker.strategic.reputation + (success ? 2 : 0) },
    createLog("intelligence", success ? "Sabotage successful" : "Sabotage disrupted", success ? `${target?.name} condition reduced by ${damage}%.` : eligibleItems.length ? "Target counter-intelligence blocked the operation." : "Target has no equipped armory to disrupt.", { defenderId, seed, roll, chance, detected, agentLosses, target: target?.id, damage }),
  );
  const defenderStrategic = addLog(
    { ...defender.strategic, armory: { inventory } },
    createLog("intelligence", detected ? "Hostile sabotage detected" : "Armory alert", success ? `${target?.name || "Armory equipment"} was disrupted by a covert operation.` : "A hostile covert operation was resolved against your realm.", { attackerId, seed, detected, success, target: target?.id, damage }),
  );
  await Promise.all([
    persistState(attackerId, { resources: attacker.resources, personnel: attackerPersonnel, government: stateToGovernment(attacker.government, attackerStrategic) }),
    persistState(defenderId, { resources: defender.resources, personnel: defender.personnel, government: stateToGovernment(defender.government, defenderStrategic) }),
  ]);
  await recordStrategicOperation(attackerId, "covert");
  return { success, detected, agentLosses, damage, target: target?.id || null, chance: Number(chance.toFixed(3)), state: buildSnapshot(attacker.resources, attackerPersonnel, attackerStrategic) };
}

export async function getAscensionStatus(userId: string) {
  const snapshot = await getStargateState(userId);
  const { strategic, resources } = snapshot;
  const unmet = [
    ...(strategic.glory < ASCENSION_RULES.requiredGlory ? [`${ASCENSION_RULES.requiredGlory - strategic.glory} Glory`] : []),
    ...(strategic.reputation < ASCENSION_RULES.requiredReputation ? [`${ASCENSION_RULES.requiredReputation - strategic.reputation} Reputation`] : []),
    ...(resources.naquadah < ASCENSION_RULES.requiredNaquadah ? [`${ASCENSION_RULES.requiredNaquadah - resources.naquadah} Naquadah`] : []),
    ...(strategic.ascensionLevel >= ASCENSION_RULES.maximumAscensionLevel ? ["maximum Ascension Level reached"] : []),
  ];
  return { rules: ASCENSION_RULES, eligible: unmet.length === 0, unmet, state: snapshot };
}

export async function executeRaid(attackerId: string, defenderId: string, requestedTurns: number) {
  if (!defenderId || attackerId === defenderId) throw new Error("Select another realm as the raid target");
  await enforceStrategicOperation(attackerId, defenderId, "raid");
  const turnsSpent = bounded(Math.floor(requestedTurns), 1, MAX_OPERATION_TURNS);
  const attackerRecord = await requirePlayerState(attackerId);
  const defenderRecord = await requirePlayerState(defenderId);
  const attacker = hydrateState(attackerRecord);
  const defender = hydrateState(defenderRecord);

  if (attacker.strategic.attackTurns < turnsSpent) throw new Error("Insufficient attack turns");
  const attackPower = calculateStrikeAction(attacker.personnel, attacker.strategic) * (1 + turnsSpent * 0.06);
  const defensePower = calculateDefenseAction(defender.personnel, defender.strategic) + calculateAntiCovertAction(defender.personnel, defender.strategic) * 0.05;
  const seed = `${attackerId}:${defenderId}:${turnsSpent}:${Date.now()}`;
  const roll = deterministicPercent(seed);
  const chance = bounded(0.5 + (attackPower - defensePower) / Math.max(500, attackPower + defensePower), 0.08, 0.92);
  const victory = roll < chance;
  const attackerLossRate = victory ? 0.03 + (1 - chance) * 0.08 : 0.12 + chance * 0.12;
  const defenderLossRate = victory ? 0.08 + chance * 0.18 : 0.02 + chance * 0.06;
  const attackerLosses = Math.min(attacker.personnel.attackTroops, Math.floor(attacker.personnel.attackTroops * attackerLossRate));
  const defenderLosses = Math.min(defender.personnel.defenseTroops, Math.floor(defender.personnel.defenseTroops * defenderLossRate));
  const lootFactor = victory ? Math.min(0.35, 0.03 * turnsSpent + chance * 0.08) : 0;
  const loot = Math.min(defender.resources.naquadah, Math.floor(defender.resources.naquadah * lootFactor));

  const attackerPersonnel = { ...attacker.personnel, attackTroops: attacker.personnel.attackTroops - attackerLosses };
  const defenderPersonnel = { ...defender.personnel, defenseTroops: defender.personnel.defenseTroops - defenderLosses };
  const attackerResources = { ...attacker.resources, naquadah: attacker.resources.naquadah + loot };
  const defenderResources = { ...defender.resources, naquadah: defender.resources.naquadah - loot };
  const attackerStrategic = addLog({ ...attacker.strategic, attackTurns: attacker.strategic.attackTurns - turnsSpent, glory: attacker.strategic.glory + (victory ? 10 : 1), reputation: attacker.strategic.reputation + (victory ? 3 : 0) }, createLog("battle", victory ? "Raid victory" : "Raid repelled", victory ? `Recovered ${loot.toLocaleString()} unbanked Naquadah.` : "Defender held the line.", { defenderId, turnsSpent, seed, roll, chance, attackPower, defensePower, loot, attackerLosses, defenderLosses }));
  const defenderStrategic = addLog({ ...defender.strategic, glory: defender.strategic.glory + (victory ? 0 : 5), reputation: defender.strategic.reputation + (victory ? 0 : 2) }, createLog("battle", victory ? "Raid breach detected" : "Raid defense successful", victory ? `${loot.toLocaleString()} Naquadah was lost from exposed reserves.` : "Your defenses repelled the hostile operation.", { attackerId, turnsSpent, seed, roll, chance, attackPower, defensePower, loot, attackerLosses, defenderLosses }));

  await Promise.all([
    persistState(attackerId, { resources: attackerResources, personnel: attackerPersonnel, government: stateToGovernment(attacker.government, attackerStrategic) }),
    persistState(defenderId, { resources: defenderResources, personnel: defenderPersonnel, government: stateToGovernment(defender.government, defenderStrategic) }),
  ]);
  await recordStrategicOperation(attackerId, "raid");

  return {
    victory,
    turnsSpent,
    loot,
    attackerLosses,
    defenderLosses,
    chance: Number(chance.toFixed(3)),
    report: { seed, roll: Number(roll.toFixed(4)), attackPower, defensePower },
    state: buildSnapshot(attackerResources, attackerPersonnel, attackerStrategic),
  };
}

export async function executeRecon(attackerId: string, defenderId: string) {
  if (!defenderId || attackerId === defenderId) throw new Error("Select another realm for reconnaissance");
  const attackerRecord = await requirePlayerState(attackerId);
  const defenderRecord = await requirePlayerState(defenderId);
  const attacker = hydrateState(attackerRecord);
  const defender = hydrateState(defenderRecord);
  if (attacker.strategic.attackTurns < 1) throw new Error("At least one attack turn is required for reconnaissance");
  if (attacker.personnel.covertAgents < 1) throw new Error("Train at least one covert agent before conducting reconnaissance");

  const covertPower = calculateCovertAction(attacker.personnel, attacker.strategic);
  const antiCovertPower = calculateAntiCovertAction(defender.personnel, defender.strategic);
  const seed = `recon:${attackerId}:${defenderId}:${Date.now()}`;
  const roll = deterministicPercent(seed);
  const chance = bounded(0.45 + (covertPower - antiCovertPower) / Math.max(400, covertPower + antiCovertPower), 0.08, 0.95);
  const success = roll < chance;
  const detected = !success || roll > chance * 0.85;
  const agentLosses = detected ? Math.min(attacker.personnel.covertAgents, Math.max(1, Math.ceil(attacker.personnel.covertAgents * (1 - chance) * 0.1))) : 0;
  const visibility = success ? (chance > 0.72 ? "full" : chance > 0.45 ? "partial" : "limited") : "none";
  const intelligence = success ? {
    visibility,
    race: defender.strategic.race,
    defcon: defender.strategic.defcon,
    overallRank: calculateOverallRank(defender.personnel, defender.strategic),
    ...(visibility !== "limited" ? { personnel: defender.personnel } : {}),
    ...(visibility === "full" ? { resources: defender.resources, technologies: defender.strategic.technologies } : {}),
  } : null;

  const attackerPersonnel = { ...attacker.personnel, covertAgents: attacker.personnel.covertAgents - agentLosses };
  const attackerStrategic = addLog({ ...attacker.strategic, attackTurns: attacker.strategic.attackTurns - 1, reputation: attacker.strategic.reputation + (success ? 1 : 0) }, createLog("intelligence", success ? "Reconnaissance successful" : "Reconnaissance disrupted", success ? `Intelligence visibility: ${visibility}.` : "Target counter-intelligence blocked the operation.", { defenderId, seed, roll, chance, detected, agentLosses, visibility }));
  const defenderStrategic = addLog(defender.strategic, createLog("intelligence", detected ? "Hostile reconnaissance detected" : "Counter-intelligence alert", detected ? "Your counter-intelligence network observed an intrusion attempt." : "An intelligence operation was resolved against your realm.", { attackerId, seed, detected, success }));

  await Promise.all([
    persistState(attackerId, { resources: attacker.resources, personnel: attackerPersonnel, government: stateToGovernment(attacker.government, attackerStrategic) }),
    persistState(defenderId, { resources: defender.resources, personnel: defender.personnel, government: stateToGovernment(defender.government, defenderStrategic) }),
  ]);

  return {
    success,
    detected,
    agentLosses,
    chance: Number(chance.toFixed(3)),
    intelligence,
    state: buildSnapshot(attacker.resources, attackerPersonnel, attackerStrategic),
  };
}

export const stargateWarsService = {
  getState: getStargateState,
  processTurns: processStrategicTurns,
  selectRace,
  trainPersonnel,
  upgradeUnitProduction,
  upgradeTechnology,
  setDefcon,
  transferBank,
  getArmory,
  manageArmory,
  upgradeCovertLevel,
  executeSabotage,
  getAscensionStatus,
  executeRaid,
  executeRecon,
};
