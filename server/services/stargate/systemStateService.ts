import { eq } from "drizzle-orm";
import { db } from "../../db";
import { playerStates } from "../../../shared/schema";

type RecordValue = Record<string, unknown>;
const asRecord = (value: unknown): RecordValue => value && typeof value === "object" && !Array.isArray(value) ? { ...(value as RecordValue) } : {};
const numberValue = (value: unknown, fallback = 0) => Math.max(0, Math.floor(Number.isFinite(Number(value)) ? Number(value) : fallback));
const stringValue = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;

export interface MarketOffer {
  id: string;
  sellerId: string;
  item: "untrained" | "attackTroop" | "defenseTroop";
  quantity: number;
  pricePerUnit: number;
  createdAt: number;
  expiresAt: number;
}

export interface MothershipState {
  owned: boolean;
  name: string;
  capacity: number;
  usedCapacity: number;
  weapons: number;
  shields: number;
  hangars: number;
  hull: number;
  fuel: number;
  maxFuel: number;
  explorationReadyAt: number | null;
  missionType: "exploration" | "survey" | "salvage" | "rescue" | null;
  discoveries: number;
  missionsCompleted: number;
  missionsFailed: number;
  lastMissionAt: number;
}

export interface StrategicWorld {
  id: string;
  name: string;
  ownerId: string;
  worldType: "homeworld" | "frontier" | "mining" | "agri" | "military";
  condition: number;
  defenses: number;
  developmentLevel: number;
  population: number;
  maxPopulation: number;
  stability: number;
  lastYieldAt: number;
  bonuses: { attack: number; defense: number; covert: number; unitProduction: number; income: number };
  discoveredAt: number;
}

export interface CommanderState {
  name: string;
  incomeShare: number;
  officers: Array<{ id: string; role: "income" | "offense" | "defense" | "covert"; level: number }>;
}

export interface AllianceState {
  id: string | null;
  name: string | null;
  tag: string | null;
  role: "leader" | "member" | null;
  applications: Array<{ userId: string; createdAt: number }>;
  notice: string;
}

export interface ProtectionState {
  vacationMode: boolean;
  pptUntil: number;
  lastRaidAt: number;
  covertAttempts: Array<number>;
}

export interface SystemEvent {
  id: string;
  type: string;
  createdAt: number;
  summary: string;
  details?: RecordValue;
}

export interface StargateSystemsState {
  market: { offers: MarketOffer[]; completedTrades: number };
  mothership: MothershipState;
  worlds: StrategicWorld[];
  commander: CommanderState;
  alliance: AllianceState;
  protection: ProtectionState;
  events: SystemEvent[];
  ascensionHistory: Array<{ level: number; ascendedAt: number; race: string }>;
}

const defaultSystemsState = (userId: string): StargateSystemsState => ({
  market: { offers: [], completedTrades: 0 },
  mothership: { owned: false, name: "Uncommissioned Mothership", capacity: 0, usedCapacity: 0, weapons: 0, shields: 0, hangars: 0, hull: 0, fuel: 0, maxFuel: 0, explorationReadyAt: null, missionType: null, discoveries: 0, missionsCompleted: 0, missionsFailed: 0, lastMissionAt: 0 },
  worlds: [{ id: `home-${userId}`, name: "Homeworld", ownerId: userId, worldType: "homeworld", condition: 100, defenses: 0, developmentLevel: 1, population: 5_800, maxPopulation: 10_000, stability: 80, lastYieldAt: Date.now(), bonuses: { attack: 0, defense: 0, covert: 0, unitProduction: 0, income: 0 }, discoveredAt: Date.now() }],
  commander: { name: "Realm Commander", incomeShare: 0.1, officers: [] },
  alliance: { id: null, name: null, tag: null, role: null, applications: [], notice: "" },
  protection: { vacationMode: false, pptUntil: 0, lastRaidAt: 0, covertAttempts: [] },
  events: [],
  ascensionHistory: [],
});

function normalizeWorld(value: unknown, userId: string, index: number): StrategicWorld {
  const raw = asRecord(value);
  const bonuses = asRecord(raw.bonuses);
  const type = stringValue(raw.worldType, index === 0 ? "homeworld" : "frontier");
  return {
    id: stringValue(raw.id, `world-${userId}-${index}`),
    name: stringValue(raw.name, `Strategic World ${index + 1}`),
    ownerId: stringValue(raw.ownerId, userId),
    worldType: ["homeworld", "frontier", "mining", "agri", "military"].includes(type) ? type as StrategicWorld["worldType"] : "frontier",
    condition: Math.min(100, numberValue(raw.condition, 100)),
    defenses: numberValue(raw.defenses),
    developmentLevel: Math.min(20, Math.max(1, numberValue(raw.developmentLevel, index === 0 ? 1 : 1))),
    population: numberValue(raw.population, index === 0 ? 5_800 : 1_000),
    maxPopulation: Math.max(1_000, numberValue(raw.maxPopulation, index === 0 ? 10_000 : 5_000)),
    stability: Math.min(100, Math.max(0, numberValue(raw.stability, 75))),
    lastYieldAt: numberValue(raw.lastYieldAt, Date.now()),
    bonuses: { attack: numberValue(bonuses.attack), defense: numberValue(bonuses.defense), covert: numberValue(bonuses.covert), unitProduction: numberValue(bonuses.unitProduction), income: numberValue(bonuses.income) },
    discoveredAt: numberValue(raw.discoveredAt, Date.now()),
  };
}

export function normalizeSystemsState(value: unknown, userId: string): StargateSystemsState {
  const base = defaultSystemsState(userId);
  const raw = asRecord(value);
  const market = asRecord(raw.market);
  const mothership = asRecord(raw.mothership);
  const commander = asRecord(raw.commander);
  const alliance = asRecord(raw.alliance);
  const protection = asRecord(raw.protection);
  const rawWorlds = Array.isArray(raw.worlds) ? raw.worlds : base.worlds;
  const rawEvents = Array.isArray(raw.events) ? raw.events : [];
  const rawHistory = Array.isArray(raw.ascensionHistory) ? raw.ascensionHistory : [];
  const rawOffers = Array.isArray(market.offers) ? market.offers : [];
  const rawOfficers = Array.isArray(commander.officers) ? commander.officers : [];
  const rawApplications = Array.isArray(alliance.applications) ? alliance.applications : [];
  const rawAttempts = Array.isArray(protection.covertAttempts) ? protection.covertAttempts : [];

  return {
    market: { offers: rawOffers.map((offer) => { const item = asRecord(offer); return { id: stringValue(item.id), sellerId: stringValue(item.sellerId), item: ["untrained", "attackTroop", "defenseTroop"].includes(stringValue(item.item)) ? stringValue(item.item) as MarketOffer["item"] : "untrained", quantity: numberValue(item.quantity), pricePerUnit: numberValue(item.pricePerUnit), createdAt: numberValue(item.createdAt), expiresAt: numberValue(item.expiresAt) }; }).filter((offer) => offer.id && offer.quantity > 0), completedTrades: numberValue(market.completedTrades) },
    mothership: { owned: Boolean(mothership.owned), name: stringValue(mothership.name, base.mothership.name), capacity: numberValue(mothership.capacity), usedCapacity: numberValue(mothership.usedCapacity), weapons: numberValue(mothership.weapons), shields: numberValue(mothership.shields), hangars: numberValue(mothership.hangars), hull: Math.min(100, numberValue(mothership.hull, mothership.owned ? 100 : 0)), fuel: Math.min(numberValue(mothership.maxFuel, mothership.owned ? 100 : 0), numberValue(mothership.fuel, mothership.owned ? 100 : 0)), maxFuel: numberValue(mothership.maxFuel, mothership.owned ? 100 : 0), explorationReadyAt: mothership.explorationReadyAt === null ? null : numberValue(mothership.explorationReadyAt) || null, missionType: ["exploration", "survey", "salvage", "rescue"].includes(stringValue(mothership.missionType)) ? stringValue(mothership.missionType) as MothershipState["missionType"] : null, discoveries: numberValue(mothership.discoveries), missionsCompleted: numberValue(mothership.missionsCompleted), missionsFailed: numberValue(mothership.missionsFailed), lastMissionAt: numberValue(mothership.lastMissionAt) },
    worlds: rawWorlds.map((world, index) => normalizeWorld(world, userId, index)).slice(0, 10),
    commander: { name: stringValue(commander.name, base.commander.name), incomeShare: Math.min(0.3, Math.max(0.1, Number(commander.incomeShare) || 0.1)), officers: rawOfficers.map((officer) => { const item = asRecord(officer); const role = stringValue(item.role); return { id: stringValue(item.id), role: ["income", "offense", "defense", "covert"].includes(role) ? role as CommanderState["officers"][number]["role"] : "income", level: Math.max(1, numberValue(item.level, 1)) }; }).filter((officer) => officer.id).slice(0, 25) },
    alliance: { id: alliance.id === null ? null : stringValue(alliance.id) || null, name: alliance.name === null ? null : stringValue(alliance.name) || null, tag: alliance.tag === null ? null : stringValue(alliance.tag) || null, role: alliance.role === "leader" || alliance.role === "member" ? alliance.role : null, applications: rawApplications.map((application) => { const item = asRecord(application); return { userId: stringValue(item.userId), createdAt: numberValue(item.createdAt) }; }).filter((application) => application.userId), notice: stringValue(alliance.notice) },
    protection: { vacationMode: Boolean(protection.vacationMode), pptUntil: numberValue(protection.pptUntil), lastRaidAt: numberValue(protection.lastRaidAt), covertAttempts: rawAttempts.map((attempt) => numberValue(attempt)).filter((attempt) => attempt > Date.now() - 60 * 60 * 1000).slice(-10) },
    events: rawEvents.map((event) => { const item = asRecord(event); return { id: stringValue(item.id), type: stringValue(item.type), createdAt: numberValue(item.createdAt), summary: stringValue(item.summary), details: asRecord(item.details) }; }).filter((event) => event.id).slice(0, 120),
    ascensionHistory: rawHistory.map((entry) => { const item = asRecord(entry); return { level: numberValue(item.level), ascendedAt: numberValue(item.ascendedAt), race: stringValue(item.race) }; }).slice(0, 10),
  };
}

export interface SystemContext {
  userId: string;
  resources: RecordValue & { naquadah: number; bankedNaquadah: number };
  units: RecordValue & { untrained: number; attackTroops: number; defenseTroops: number; lifers: number };
  government: RecordValue;
  strategic: RecordValue;
  systems: StargateSystemsState;
}

export async function loadSystemContext(userId: string): Promise<SystemContext> {
  const row = await db.query.playerStates.findFirst({ where: eq(playerStates.userId, userId) });
  if (!row) throw new Error("Player state not found. Complete account setup first.");
  const resources = asRecord(row.resources);
  const units = asRecord(row.units);
  const government = asRecord(row.government);
  return {
    userId,
    resources: { ...resources, naquadah: numberValue(resources.naquadah), bankedNaquadah: numberValue(resources.bankedNaquadah) },
    units: { ...units, untrained: numberValue(units.untrained, 100), attackTroops: numberValue(units.attackTroops), defenseTroops: numberValue(units.defenseTroops), lifers: numberValue(units.lifers) },
    government,
    strategic: asRecord(government.stargateWars),
    systems: normalizeSystemsState(government.stargateSystems, userId),
  };
}

export async function saveSystemContext(context: SystemContext): Promise<void> {
  await db.update(playerStates).set({
    resources: context.resources,
    units: context.units,
    government: { ...context.government, stargateWars: context.strategic, stargateSystems: context.systems },
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, context.userId));
}

export function appendSystemEvent(systems: StargateSystemsState, type: string, summary: string, details?: RecordValue): StargateSystemsState {
  const createdAt = Date.now();
  const event: SystemEvent = { id: `event-${createdAt}-${Math.random().toString(36).slice(2, 8)}`, type, summary, createdAt, details };
  return { ...systems, events: [event, ...systems.events].slice(0, 120) };
}

export function getStrategicNumber(context: SystemContext, key: string, fallback = 0) {
  return numberValue(context.strategic[key], fallback);
}

export function setStrategicNumber(context: SystemContext, key: string, value: number) {
  context.strategic = { ...context.strategic, [key]: Math.max(0, Math.floor(value)) };
}

export function buildSystemSnapshot(context: SystemContext) {
  return { resources: { naquadah: context.resources.naquadah, bankedNaquadah: context.resources.bankedNaquadah }, units: context.units, strategic: context.strategic, systems: context.systems };
}
