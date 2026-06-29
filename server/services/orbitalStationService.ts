import { db } from "../db";
import { storage } from "../storage";
import {
  ALL_ORBITAL_STATIONS,
  ORBITAL_STATION_CATEGORIES,
  type OrbitalStation,
  type OrbitalStationCategory,
  type OrbitalStationClass,
  type OrbitalStationStats,
  type OrbitalStationSubStats,
} from "../../Source/Shared/config/orbitalStationsConfig";

export const STATION_CONFIG = {
  maxStationsPerPlayer: 20,
  baseUpgradeCostMultiplier: 1.25,
  maxModuleSlots: 5,
  moduleSlotUnlockLevels: [1, 10, 25, 50, 100],
  stationClassBonuses: {
    common: 1.0,
    uncommon: 1.1,
    rare: 1.25,
    epic: 1.5,
    legendary: 2.0,
    mythic: 3.0,
    transcendent: 5.0,
  } as const,
};

interface StationModule {
  moduleId: string;
  moduleName: string;
  moduleType: "defense" | "offense" | "shield" | "utility" | "research";
  level: number;
  stats: Partial<OrbitalStationStats>;
  installedAt: Date;
}

interface StationInstance {
  id: string;
  playerId: string;
  templateId: string;
  stationType: string;
  category: OrbitalStationCategory;
  stationClass: OrbitalStationClass;
  name: string;
  level: number;
  tier: number;
  positionId: string;
  stats: OrbitalStationStats;
  subStats: OrbitalStationSubStats;
  modules: StationModule[];
  isActive: boolean;
  lastResourceUpdate: Date;
  createdAt: Date;
}

function toNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function findTemplate(templateId: string): OrbitalStation | undefined {
  return ALL_ORBITAL_STATIONS.find(s => s.id === templateId);
}

function scaleStats(base: Partial<OrbitalStationStats>, level: number, tier: number): OrbitalStationStats {
  const levelMult = 1 + (level - 1) * 0.05;
  const tierMult = 1 + (tier - 1) * 0.08;
  return {
    attack: Math.floor(toNumber(base.attack) * levelMult * tierMult),
    defense: Math.floor(toNumber(base.defense) * levelMult * tierMult),
    hp: Math.floor(toNumber(base.hp) * levelMult * tierMult),
    energy: Math.floor(toNumber(base.energy) * levelMult * tierMult),
    production: Math.floor(toNumber(base.production) * levelMult * tierMult),
    range: Math.floor(toNumber(base.range) * levelMult * tierMult),
    speed: Math.floor(toNumber(base.speed) * levelMult * tierMult),
    capacity: Math.floor(toNumber(base.capacity) * levelMult * tierMult),
    crewCapacity: Math.floor(toNumber(base.crewCapacity) * levelMult * tierMult),
    powerOutput: Math.floor(toNumber(base.powerOutput) * levelMult * tierMult),
  };
}

function scaleSubStats(base: Partial<OrbitalStationSubStats>, level: number, tier: number): OrbitalStationSubStats {
  const levelMult = 1 + (level - 1) * 0.03;
  const tierMult = 1 + (tier - 1) * 0.05;
  return {
    critChance: Math.min(0.5, toNumber(base.critChance) * tierMult),
    critMultiplier: Math.min(5, toNumber(base.critMultiplier) * tierMult),
    armorPenetration: Math.min(1, toNumber(base.armorPenetration) * tierMult),
    shieldRecharge: Math.floor(toNumber(base.shieldRecharge) * levelMult * tierMult),
    energyEfficiency: Math.min(0.95, toNumber(base.energyEfficiency) * tierMult),
    researchBonus: toNumber(base.researchBonus) * levelMult,
    tradeBonus: toNumber(base.tradeBonus) * levelMult,
    buildSpeedBonus: toNumber(base.buildSpeedBonus) * levelMult,
    scanRange: Math.floor(toNumber(base.scanRange) * levelMult * tierMult),
    diplomaticInfluence: Math.floor(toNumber(base.diplomaticInfluence) * levelMult),
  };
}

function createStationFromTemplate(
  template: OrbitalStation,
  userId: string,
  name: string,
  positionId: string,
  level: number = 1,
  tier: number = 1
): StationInstance {
  const stats = scaleStats(template.stats, level, tier);
  const subStats = scaleSubStats(template.subStats, level, tier);

  return {
    id: `stn-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    playerId: userId,
    templateId: template.id,
    stationType: template.type,
    category: template.category,
    stationClass: template.class,
    name: name || template.name,
    level,
    tier,
    positionId,
    stats,
    subStats,
    modules: [],
    isActive: true,
    lastResourceUpdate: new Date(),
    createdAt: new Date(),
  };
}

export class OrbitalStationService {
  private static stationsCache = new Map<string, StationInstance[]>();

  static async getStationStatus(userId: string): Promise<{
    stations: StationInstance[];
    totalBonus: { attack: number; defense: number; production: number; research: number; trade: number };
    stationCount: number;
    maxStations: number;
  }> {
    const cached = this.stationsCache.get(userId);
    if (cached) {
      return {
        stations: cached,
        totalBonus: OrbitalStationService.calculateStationBonuses(cached),
        stationCount: cached.length,
        maxStations: STATION_CONFIG.maxStationsPerPlayer,
      };
    }

    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const orbitalBuildings = (playerState.orbitalBuildings as any) || {};
    const storedStations = orbitalBuildings.stations || [];

    const stations: StationInstance[] = storedStations.map((s: any) => ({
      id: s.id || `stn-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      playerId: userId,
      templateId: s.templateId || s.id,
      stationType: s.stationType || "orbital",
      category: s.category || "command_control",
      stationClass: s.stationClass || "common",
      name: s.name || "Unknown Station",
      level: toNumber(s.level, 1),
      tier: toNumber(s.tier, 1),
      positionId: s.positionId || "default",
      stats: s.stats || { hp: 5000 },
      subStats: s.subStats || {},
      modules: s.modules || [],
      isActive: s.isActive !== false,
      lastResourceUpdate: s.lastResourceUpdate ? new Date(s.lastResourceUpdate) : new Date(),
      createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
    }));

    this.stationsCache.set(userId, stations);

    return {
      stations,
      totalBonus: OrbitalStationService.calculateStationBonuses(stations),
      stationCount: stations.length,
      maxStations: STATION_CONFIG.maxStationsPerPlayer,
    };
  }

  static getStationCatalog(): Array<{
    category: OrbitalStationCategory;
    label: string;
    description: string;
    stations: OrbitalStation[];
  }> {
    return ORBITAL_STATION_CATEGORIES.map(cat => ({
      category: cat.id,
      label: cat.label,
      description: cat.description,
      stations: ALL_ORBITAL_STATIONS.filter(s => s.category === cat.id),
    }));
  }

  static async buildStation(
    userId: string,
    stationType: string,
    positionId: string
  ): Promise<{ success: boolean; station?: StationInstance; error?: string; cost?: any }> {
    const template = findTemplate(stationType);
    if (!template) {
      return { success: false, error: "Station template not found" };
    }

    const playerState = await storage.getPlayerState(userId);
    if (!playerState) return { success: false, error: "Player state not found" };

    const status = await OrbitalStationService.getStationStatus(userId);
    if (status.stationCount >= STATION_CONFIG.maxStationsPerPlayer) {
      return { success: false, error: "Maximum station limit reached" };
    }

    const cost = OrbitalStationService.calculateStationCost(stationType, 1);
    const resources = (playerState.resources as any) || {};
    const available = {
      metal: toNumber(resources.metal),
      crystal: toNumber(resources.crystal),
      deuterium: toNumber(resources.deuterium),
    };

    if (available.metal < cost.metal || available.crystal < cost.crystal || available.deuterium < cost.deuterium) {
      return { success: false, error: "Insufficient resources", cost };
    }

    const updatedResources = {
      metal: available.metal - cost.metal,
      crystal: available.crystal - cost.crystal,
      deuterium: available.deuterium - cost.deuterium,
    };

    await storage.updatePlayerState(userId, { resources: updatedResources } as any);

    const station = createStationFromTemplate(template, userId, template.name, positionId, 1, 1);

    const orbitalBuildings = (playerState.orbitalBuildings as any) || {};
    const stations = orbitalBuildings.stations || [];
    stations.push({
      id: station.id,
      templateId: station.templateId,
      stationType: station.stationType,
      category: station.category,
      stationClass: station.stationClass,
      name: station.name,
      level: station.level,
      tier: station.tier,
      positionId: station.positionId,
      stats: station.stats,
      subStats: station.subStats,
      modules: station.modules,
      isActive: station.isActive,
      lastResourceUpdate: station.lastResourceUpdate.toISOString(),
      createdAt: station.createdAt.toISOString(),
    });

    await storage.updatePlayerState(userId, {
      orbitalBuildings: { ...orbitalBuildings, stations },
    } as any);

    this.stationsCache.delete(userId);

    return { success: true, station, cost };
  }

  static async upgradeStation(
    userId: string,
    stationId: string
  ): Promise<{ success: boolean; station?: StationInstance; error?: string; cost?: any }> {
    const status = await OrbitalStationService.getStationStatus(userId);
    const station = status.stations.find(s => s.id === stationId);
    if (!station) return { success: false, error: "Station not found" };

    const template = findTemplate(station.templateId);
    if (!template) return { success: false, error: "Station template not found" };

    const newLevel = station.level + 1;
    const cost = OrbitalStationService.calculateStationCost(station.templateId, newLevel);

    const playerState = await storage.getPlayerState(userId);
    if (!playerState) return { success: false, error: "Player state not found" };

    const resources = (playerState.resources as any) || {};
    const available = {
      metal: toNumber(resources.metal),
      crystal: toNumber(resources.crystal),
      deuterium: toNumber(resources.deuterium),
    };

    if (available.metal < cost.metal || available.crystal < cost.crystal || available.deuterium < cost.deuterium) {
      return { success: false, error: "Insufficient resources", cost };
    }

    const updatedResources = {
      metal: available.metal - cost.metal,
      crystal: available.crystal - cost.crystal,
      deuterium: available.deuterium - cost.deuterium,
    };

    await storage.updatePlayerState(userId, { resources: updatedResources } as any);

    const newStats = scaleStats(template.stats, newLevel, station.tier);
    const newSubStats = scaleSubStats(template.subStats, newLevel, station.tier);

    const orbitalBuildings = (playerState.orbitalBuildings as any) || {};
    const stations = orbitalBuildings.stations || [];
    const idx = stations.findIndex((s: any) => s.id === stationId);
    if (idx >= 0) {
      stations[idx] = {
        ...stations[idx],
        level: newLevel,
        stats: newStats,
        subStats: newSubStats,
        lastResourceUpdate: new Date().toISOString(),
      };
    }

    await storage.updatePlayerState(userId, {
      orbitalBuildings: { ...orbitalBuildings, stations },
    } as any);

    this.stationsCache.delete(userId);

    const updatedStation: StationInstance = { ...station, level: newLevel, stats: newStats, subStats: newSubStats };
    return { success: true, station: updatedStation, cost };
  }

  static async addModule(
    userId: string,
    stationId: string,
    moduleId: string
  ): Promise<{ success: boolean; station?: StationInstance; error?: string }> {
    const status = await OrbitalStationService.getStationStatus(userId);
    const station = status.stations.find(s => s.id === stationId);
    if (!station) return { success: false, error: "Station not found" };

    const moduleSlotCount = STATION_CONFIG.moduleSlotUnlockLevels.filter(l => station.level >= l).length;
    if (station.modules.length >= moduleSlotCount) {
      return { success: false, error: "No module slots available. Upgrade station to unlock more." };
    }

    if (station.modules.some(m => m.moduleId === moduleId)) {
      return { success: false, error: "Module already installed" };
    }

    const moduleName = moduleId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const moduleType: StationModule["moduleType"] =
      moduleId.includes("defense") ? "defense" :
      moduleId.includes("offense") || moduleId.includes("attack") ? "offense" :
      moduleId.includes("shield") ? "shield" :
      moduleId.includes("research") ? "research" : "utility";

    const newModule: StationModule = {
      moduleId,
      moduleName,
      moduleType,
      level: 1,
      stats: {},
      installedAt: new Date(),
    };

    const orbitalBuildings = ((await storage.getPlayerState(userId))?.orbitalBuildings as any) || {};
    const stations = orbitalBuildings.stations || [];
    const idx = stations.findIndex((s: any) => s.id === stationId);
    if (idx >= 0) {
      const existingModules = stations[idx].modules || [];
      existingModules.push({
        moduleId: newModule.moduleId,
        moduleName: newModule.moduleName,
        moduleType: newModule.moduleType,
        level: newModule.level,
        stats: newModule.stats,
        installedAt: newModule.installedAt.toISOString(),
      });
      stations[idx].modules = existingModules;

      await storage.updatePlayerState(userId, {
        orbitalBuildings: { ...orbitalBuildings, stations },
      } as any);
    }

    this.stationsCache.delete(userId);

    const updatedStation: StationInstance = {
      ...station,
      modules: [...station.modules, newModule],
    };
    return { success: true, station: updatedStation };
  }

  static getStationBonuses(userId: string): Promise<{
    attack: number;
    defense: number;
    production: number;
    research: number;
    trade: number;
    buildSpeed: number;
    scanRange: number;
    diplomaticInfluence: number;
  }> {
    return OrbitalStationService.getStationStatus(userId).then(status => {
      const base = status.totalBonus;
      let buildSpeed = 0;
      let scanRange = 0;
      let diplomaticInfluence = 0;
      for (const station of status.stations) {
        if (!station.isActive) continue;
        buildSpeed += station.subStats.buildSpeedBonus || 0;
        scanRange += station.subStats.scanRange || 0;
        diplomaticInfluence += station.subStats.diplomaticInfluence || 0;
      }
      return { ...base, buildSpeed, scanRange, diplomaticInfluence };
    });
  }

  static calculateStationCost(
    stationType: string,
    level: number
  ): { metal: number; crystal: number; deuterium: number } {
    const template = findTemplate(stationType);
    if (!template) return { metal: 0, crystal: 0, deuterium: 0 };

    const levelMult = Math.pow(STATION_CONFIG.baseUpgradeCostMultiplier, level - 1);
    const classBonus = (STATION_CONFIG.stationClassBonuses as any)[template.class] || 1.0;

    return {
      metal: Math.floor(template.cost.metal * levelMult * classBonus),
      crystal: Math.floor(template.cost.crystal * levelMult * classBonus),
      deuterium: Math.floor(template.cost.deuterium * levelMult * classBonus),
    };
  }

  private static calculateStationBonuses(stations: StationInstance[]): {
    attack: number;
    defense: number;
    production: number;
    research: number;
    trade: number;
  } {
    let attack = 0;
    let defense = 0;
    let production = 0;
    let research = 0;
    let trade = 0;

    for (const station of stations) {
      if (!station.isActive) continue;
      attack += station.stats.attack || 0;
      defense += station.stats.defense || 0;
      production += station.stats.production || 0;
      research += station.subStats.researchBonus || 0;
      trade += station.subStats.tradeBonus || 0;

      for (const module of station.modules) {
        attack += module.stats.attack || 0;
        defense += module.stats.defense || 0;
        production += module.stats.production || 0;
      }
    }

    return {
      attack: Math.floor(attack),
      defense: Math.floor(defense),
      production: Math.floor(production),
      research: Math.round(research * 100) / 100,
      trade: Math.round(trade * 100) / 100,
    };
  }
}

export default OrbitalStationService;
