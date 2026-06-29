import { db } from "../db";
import { storage } from "../storage";
import {
  SPORE_DRIVE_TYPES,
  calculateSporeDriveStats,
  calculateSporeDriveSubStats,
  calculateSporeDriveAttributes,
  generateSporeDriveDetails,
  generateSporeDriveStatus,
  calculateSporeDriveRarity,
  calculateJumpMetrics,
  calculateSporeConsumption,
  generateMycelialNetworkNodes,
  type SporeDrive,
  type SporeDriveStats,
  type SporeDriveSubStats,
  type SporeDriveAttributes,
  type SporeDriveTypeConfig,
  type SporeDriveJump,
} from "../../Source/Shared/config/sporeDriveSystem";

export const SPORE_CONFIG = {
  baseSporeCostPerLightYear: 1.8,
  jumpCooldownBaseMinutes: 30,
  maxDrivesPerShip: 3,
  sporeRefineryRate: 5,
  mycelialNetworkNodeCap: 20,
  rarityChances: {
    common: { base: 0.40, perLevel: 0.002 },
    uncommon: { base: 0.30, perLevel: 0.003 },
    rare: { base: 0.18, perLevel: 0.002 },
    epic: { base: 0.08, perLevel: 0.001 },
    legendary: { base: 0.03, perLevel: 0.0005 },
    mythic: { base: 0.008, perLevel: 0.0002 },
    ascended: { base: 0.002, perLevel: 0.0001 },
  },
  fuelTypes: ["standard-spore", "refined-spore", "pure-spore", "ascended-spore"] as const,
};

type SporeDriveRarity = SporeDrive["rarity"];
type SporeDriveClass = SporeDrive["class"];

function toNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function generateDriveId(): string {
  return `spd-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function classifyDrive(tier: number): SporeDriveClass {
  if (tier >= 80) return "ascended";
  if (tier >= 60) return "experimental";
  if (tier >= 30) return "advanced";
  if (tier >= 10) return "standard";
  return "prototype";
}

function parseDrives(raw: any): SporeDrive[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((d: any) => ({
    id: d.id || generateDriveId(),
    name: d.name || "Unknown Drive",
    shipId: d.shipId || "",
    shipName: d.shipName || "Unknown Ship",
    tier: toNumber(d.tier, 1),
    level: toNumber(d.level, 1),
    class: d.class || "prototype",
    rarity: d.rarity || "common",
    stats: d.stats || {},
    subStats: d.subStats || {},
    attributes: d.attributes || {},
    details: d.details || {},
    status: d.status || {},
    jumpHistory: d.jumpHistory || [],
    totalJumps: toNumber(d.totalJumps, 0),
    sporeReserves: d.sporeReserves || {},
    sporeCapacity: d.sporeCapacity || {},
    networkNodes: d.networkNodes || [],
    icon: d.icon || "",
    color: d.color || "#4ECDC4",
    description: d.description || "",
    lore: d.lore || "",
    isActive: d.isActive !== false,
    installedAt: d.installedAt || Date.now(),
    lastUsed: d.lastUsed || null,
  }));
}

function serializeDrives(drives: SporeDrive[]): any[] {
  return drives.map(d => ({
    ...d,
    installedAt: d.installedAt,
    lastUsed: d.lastUsed,
  }));
}

function parseCoordinates(coordStr: string): { x: number; y: number; z: number } {
  const cleaned = coordStr.replace(/[\[\]]/g, "");
  const parts = cleaned.split(":").map(Number);
  return {
    x: parts[0] || 0,
    y: parts[1] || 0,
    z: parts[2] || 0,
  };
}

export class SporeDriveService {
  static async getDrivesForShip(userId: string, shipId: string): Promise<SporeDrive[]> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const sporeData = (playerState as any).sporeDriveData || {};
    const allDrives = parseDrives(sporeData.drives || []);
    return allDrives.filter(d => d.shipId === shipId);
  }

  static async getDriveDetails(userId: string, driveId: string): Promise<SporeDrive | null> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const sporeData = (playerState as any).sporeDriveData || {};
    const allDrives = parseDrives(sporeData.drives || []);
    return allDrives.find(d => d.id === driveId) || null;
  }

  static async generateDrive(
    userId: string,
    rarity: SporeDriveRarity
  ): Promise<{ success: boolean; drive?: SporeDrive; error?: string }> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) return { success: false, error: "Player state not found" };

    const typeKeys = Object.keys(SPORE_DRIVE_TYPES);
    const typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    const typeConfig = SPORE_DRIVE_TYPES[typeKey];
    if (!typeConfig) return { success: false, error: "Drive type configuration not found" };

    const tier = SporeDriveService.calculateRarityTier(rarity);
    const level = 1;

    const stats = calculateSporeDriveStats(
      {
        chargeRate: typeConfig.baseChargeRate,
        maxCharge: typeConfig.baseMaxCharge,
        efficiency: typeConfig.baseEfficiency,
        accuracy: typeConfig.baseAccuracy,
        range: typeConfig.baseRange,
        jumpCooldown: typeConfig.baseCooldown,
        stability: 70,
        safetyRating: 70,
        structuralIntegrity: 90,
        dimensionalAnchorStrength: 50,
        mycelialNetworkTaps: 3,
        sporePurity: 70,
      },
      tier,
      level
    );

    const subStats = calculateSporeDriveSubStats(typeConfig.baseSubStats, tier, level);
    const attributes = calculateSporeDriveAttributes(typeConfig.baseAttributes, tier, level);
    const details = generateSporeDriveDetails(typeConfig.name, tier, level);
    const status = generateSporeDriveStatus(tier, level);
    const networkNodes = generateMycelialNetworkNodes(tier, level);

    const driveClass = classifyDrive(tier);
    const finalRarity = calculateSporeDriveRarity(typeKey, tier, typeConfig.specialProperties);

    const drive: SporeDrive = {
      id: generateDriveId(),
      name: `${typeConfig.name} [${rarity.charAt(0).toUpperCase() + rarity.slice(1)}]`,
      shipId: "",
      shipName: "",
      tier,
      level,
      class: driveClass,
      rarity: finalRarity,
      stats,
      subStats,
      attributes,
      details,
      status,
      jumpHistory: [],
      totalJumps: 0,
      sporeReserves: { "standard-spore": Math.floor(stats.maxCharge * 0.5) },
      sporeCapacity: { "standard-spore": stats.maxCharge },
      networkNodes,
      icon: "",
      color: typeConfig.color,
      description: typeConfig.description,
      lore: typeConfig.lore,
      isActive: true,
      installedAt: Date.now(),
      lastUsed: null,
    };

    const sporeData = (playerState as any).sporeDriveData || {};
    const drives = parseDrives(sporeData.drives || []);
    drives.push(drive);

    await storage.updatePlayerState(userId, {
      sporeDriveData: {
        ...sporeData,
        drives: serializeDrives(drives),
      },
    } as any);

    return { success: true, drive };
  }

  static async executeJump(
    userId: string,
    driveId: string,
    targetCoords: string
  ): Promise<{
    success: boolean;
    jump?: SporeDriveJump;
    error?: string;
    sporesConsumed?: number;
  }> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) return { success: false, error: "Player state not found" };

    const sporeData = (playerState as any).sporeDriveData || {};
    const drives = parseDrives(sporeData.drives || []);
    const driveIdx = drives.findIndex(d => d.id === driveId);

    if (driveIdx < 0) return { success: false, error: "Spore drive not found" };

    const drive = drives[driveIdx];

    if (!drive.isActive) return { success: false, error: "Drive is not active" };
    if (drive.status.state === "cooldown" || drive.status.state === "malfunction") {
      return { success: false, error: `Drive is in ${drive.status.state} state` };
    }

    const currentCoords = playerState.coordinates || "[1:1:1]";
    const origin = parseCoordinates(currentCoords);
    const destination = parseCoordinates(targetCoords);

    const metrics = calculateJumpMetrics(origin, destination, drive.stats, drive.subStats);

    if (metrics.distance > drive.stats.range) {
      return { success: false, error: `Target is ${metrics.distance} LY away, beyond drive range of ${drive.stats.range} LY` };
    }

    const sporesNeeded = calculateSporeConsumption(metrics.distance, drive.stats, drive.subStats, drive.attributes);
    const currentSpores = toNumber(drive.sporeReserves?.["standard-spore"]);

    if (currentSpores < sporesNeeded) {
      return { success: false, error: `Insufficient spores: need ${sporesNeeded}, have ${currentSpores}` };
    }

    const successChance = (drive.stats.stability / 100) * (drive.stats.safetyRating / 100);
    const jumpSucceeded = Math.random() < successChance;

    const jumpId = `jmp-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const jump: SporeDriveJump = {
      id: jumpId,
      shipId: drive.shipId,
      jumpNumber: drive.totalJumps + 1,
      origin: {
        coordinates: currentCoords,
        system: "Origin System",
        planet: null,
      },
      destination: {
        coordinates: targetCoords,
        system: "Target System",
        planet: null,
        type: "custom-coordinates",
      },
      initiatedAt: Date.now(),
      completedAt: jumpSucceeded ? Date.now() + Math.floor(metrics.duration * 1000) : null,
      duration: Math.floor(metrics.duration),
      cooldownEnd: Date.now() + (drive.stats.jumpCooldown * 60 * 1000),
      distance: metrics.distance,
      accuracy: metrics.accuracy,
      efficiency: drive.stats.efficiency,
      status: jumpSucceeded ? "completed" : "failed",
      failureReason: jumpSucceeded ? null : "Mycelial network instability",
      crewEffects: [],
      shipEffects: [],
      sporesUsed: sporesNeeded,
      energyUsed: drive.attributes.energyPerJump,
    };

    drive.totalJumps += 1;
    drive.lastUsed = Date.now();
    drive.jumpHistory.push(jump);
    if (drive.jumpHistory.length > 100) {
      drive.jumpHistory = drive.jumpHistory.slice(-100);
    }

    if (drive.sporeReserves) {
      drive.sporeReserves["standard-spore"] = Math.max(0, currentSpores - sporesNeeded);
    }

    drive.status.state = jumpSucceeded ? "cooldown" : "standby";
    drive.status.currentCooldown = drive.stats.jumpCooldown;

    drives[driveIdx] = drive;

    await storage.updatePlayerState(userId, {
      sporeDriveData: {
        ...sporeData,
        drives: serializeDrives(drives),
      },
      coordinates: jumpSucceeded ? targetCoords : currentCoords,
    } as any);

    return { success: jumpSucceeded, jump, sporesConsumed: sporesNeeded };
  }

  static async consumeSpores(
    userId: string,
    driveId: string,
    amount: number
  ): Promise<{ success: boolean; remaining?: number; error?: string }> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) return { success: false, error: "Player state not found" };

    const sporeData = (playerState as any).sporeDriveData || {};
    const drives = parseDrives(sporeData.drives || []);
    const driveIdx = drives.findIndex(d => d.id === driveId);

    if (driveIdx < 0) return { success: false, error: "Spore drive not found" };

    const drive = drives[driveIdx];
    const currentSpores = toNumber(drive.sporeReserves?.["standard-spore"]);
    const consumed = Math.min(amount, currentSpores);

    if (drive.sporeReserves) {
      drive.sporeReserves["standard-spore"] = currentSpores - consumed;
    }

    drives[driveIdx] = drive;

    await storage.updatePlayerState(userId, {
      sporeDriveData: {
        ...sporeData,
        drives: serializeDrives(drives),
      },
    } as any);

    return { success: true, remaining: toNumber(drive.sporeReserves?.["standard-spore"]) };
  }

  static async getMycelialNetwork(userId: string): Promise<{
    totalNodes: number;
    activeNodes: number;
    degradedNodes: number;
    offlineNodes: number;
    averageSignalStrength: number;
    nodes: SporeDrive["networkNodes"];
  }> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const sporeData = (playerState as any).sporeDriveData || {};
    const drives = parseDrives(sporeData.drives || []);

    const allNodes: SporeDrive["networkNodes"] = [];
    for (const drive of drives) {
      if (drive.networkNodes) {
        allNodes.push(...drive.networkNodes);
      }
    }

    const activeNodes = allNodes.filter(n => n.status === "active").length;
    const degradedNodes = allNodes.filter(n => n.status === "degraded").length;
    const offlineNodes = allNodes.filter(n => n.status === "offline").length;
    const avgStrength = allNodes.length > 0
      ? Math.round(allNodes.reduce((s, n) => s + n.signalStrength, 0) / allNodes.length)
      : 0;

    return {
      totalNodes: allNodes.length,
      activeNodes,
      degradedNodes,
      offlineNodes,
      averageSignalStrength: avgStrength,
      nodes: allNodes,
    };
  }

  static getDriveTypes(): Array<{
    key: string;
    name: string;
    description: string;
    baseRange: number;
    baseCooldown: number;
    color: string;
    specialProperties: string[];
  }> {
    return Object.entries(SPORE_DRIVE_TYPES).map(([key, config]) => ({
      key,
      name: config.name,
      description: config.description,
      baseRange: config.baseRange,
      baseCooldown: config.baseCooldown,
      color: config.color,
      specialProperties: config.specialProperties,
    }));
  }

  static calculateRarityChance(playerLevel: number): Record<SporeDriveRarity, number> {
    const chances: Record<string, number> = {};
    let remaining = 1.0;

    const rarities: SporeDriveRarity[] = ["ascended", "mythic", "legendary", "epic", "rare", "uncommon", "common"];
    for (const rarity of rarities) {
      const config = SPORE_CONFIG.rarityChances[rarity];
      if (!config) {
        chances[rarity] = 0;
        continue;
      }
      const chance = Math.min(remaining, config.base + config.perLevel * playerLevel);
      chances[rarity] = Math.round(chance * 10000) / 10000;
      remaining -= chance;
    }

    if (remaining > 0) {
      chances.common = (chances.common || 0) + remaining;
    }

    return chances as Record<SporeDriveRarity, number>;
  }

  private static calculateRarityTier(rarity: SporeDriveRarity): number {
    const tierMap: Record<string, number> = {
      common: 1,
      uncommon: 5,
      rare: 15,
      epic: 30,
      legendary: 50,
      mythic: 70,
      ascended: 90,
    };
    return tierMap[rarity] || 1;
  }
}

export default SporeDriveService;
