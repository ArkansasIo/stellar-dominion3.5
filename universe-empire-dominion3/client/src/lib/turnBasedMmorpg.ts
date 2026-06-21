// Turn-Based Realtime MMORPG Algorithm System
// Manages game ticks, mission processing, resource production, and progression

import { KardashevLevel, KARDASHEV_SCALE, getKardashevTier } from "./kardashevScale";

export interface GameTick {
  tickNumber: number;
  timestamp: number;
  deltaTime: number; // milliseconds
  tick: "second" | "minute" | "hour" | "day"; // Tick type
}

export interface QueueItem {
  id: string;
  type: "building" | "research" | "ship";
  itemId: string;
  level: number;
  startTime: number;
  completionTime: number;
  status: "queued" | "active" | "completed";
}

export interface MissionProgress {
  id: string;
  type: "harvest" | "colonize" | "scout" | "attack" | "trade" | "defend" | "explore";
  status: "traveling" | "active" | "returning" | "completed";
  startedAt: number;
  arrivalAt?: number;
  completionAt?: number;
  progress: number; // 0-100%
}

export interface PlayerTick {
  userId: string;
  tickData: {
    resourcesProduced: Record<string, number>;
    buildingsCompleted: string[];
    researchCompleted: string[];
    missionsCompleted: MissionProgress[];
    unitsConstructed: Record<string, number>;
  };
}

// ============================================================================
// TICK SYSTEM
// ============================================================================

const TICK_INTERVALS = {
  second: 1000,
  minute: 60 * 1000,
  hour: 3600 * 1000,
  day: 86400 * 1000
};

export class TickSystem {
  private lastTickTime: number = Date.now();
  private tickCount: number = 0;

  getTicksSinceLastUpdate(): GameTick[] {
    const currentTime = Date.now();
    const elapsed = currentTime - this.lastTickTime;
    const ticks: GameTick[] = [];

    let tickType: "second" | "minute" | "hour" | "day" = "second";
    if (elapsed >= TICK_INTERVALS.day) {
      tickType = "day";
    } else if (elapsed >= TICK_INTERVALS.hour) {
      tickType = "hour";
    } else if (elapsed >= TICK_INTERVALS.minute) {
      tickType = "minute";
    }

    const tickInterval = TICK_INTERVALS[tickType];
    const ticksToProcess = Math.floor(elapsed / tickInterval);

    for (let i = 0; i < ticksToProcess; i++) {
      this.tickCount++;
      ticks.push({
        tickNumber: this.tickCount,
        timestamp: this.lastTickTime + tickInterval * (i + 1),
        deltaTime: tickInterval,
        tick: tickType
      });
    }

    this.lastTickTime = currentTime;
    return ticks;
  }

  reset(): void {
    this.lastTickTime = Date.now();
    this.tickCount = 0;
  }
}

// ============================================================================
// RESOURCE PRODUCTION PROCESSOR
// ============================================================================

export interface ResourceProduction {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

export function calculateResourceProductionPerTick(
  buildings: Record<string, number>,
  kardashevLevel: KardashevLevel,
  tick: GameTick
): ResourceProduction {
  const tier = KARDASHEV_SCALE[kardashevLevel];
  const productionBonus = 1 + tier.bonuses.resourceProduction / 100;

  // Base production values per second
  const baseMetalRate = (buildings.metalMine || 0) * 30;
  const baseCrystalRate = (buildings.crystalMine || 0) * 20;
  const baseDeuteriumRate = (buildings.deuteriumSynthesizer || 0) * 15;
  const baseEnergyRate = (buildings.energyPlant || 0) * 50;

  // Convert to tick duration
  const tickMultiplier = tick.deltaTime / 1000;

  return {
    metal: Math.round(baseMetalRate * productionBonus * tickMultiplier),
    crystal: Math.round(baseCrystalRate * productionBonus * tickMultiplier),
    deuterium: Math.round(baseDeuteriumRate * productionBonus * tickMultiplier),
    energy: Math.round(baseEnergyRate * productionBonus * tickMultiplier)
  };
}

// ============================================================================
// QUEUE PROCESSOR
// ============================================================================

export class QueueProcessor {
  processQueueItems(
    queueItems: QueueItem[],
    tick: GameTick
  ): { completed: QueueItem[]; active: QueueItem[] } {
    const currentTime = tick.timestamp;
    const completed: QueueItem[] = [];
    const active: QueueItem[] = [];

    for (const item of queueItems) {
      if (item.status === "completed") {
        completed.push(item);
      } else if (currentTime >= item.completionTime) {
        completed.push({ ...item, status: "completed" });
      } else {
        active.push(item);
      }
    }

    return { completed, active };
  }

  calculateProgress(item: QueueItem, currentTime: number): number {
    if (item.status === "completed") return 100;
    if (item.startTime > currentTime) return 0;

    const elapsed = currentTime - item.startTime;
    const total = item.completionTime - item.startTime;
    return Math.min(100, Math.round((elapsed / total) * 100));
  }
}

// ============================================================================
// MISSION PROCESSOR
// ============================================================================

export class MissionProcessor {
  processMissions(
    missions: MissionProgress[],
    tick: GameTick
  ): { active: MissionProgress[]; completed: MissionProgress[] } {
    const currentTime = tick.timestamp;
    const active: MissionProgress[] = [];
    const completed: MissionProgress[] = [];

    for (const mission of missions) {
      if (mission.status === "completed") {
        completed.push(mission);
        continue;
      }

      // Update progress
      const updatedMission = { ...mission };

      if (mission.status === "traveling") {
        if (mission.arrivalAt && currentTime >= mission.arrivalAt) {
          updatedMission.status = "active";
          updatedMission.progress = 50;
        } else if (mission.arrivalAt) {
          updatedMission.progress = Math.round(
            ((currentTime - mission.startedAt) / (mission.arrivalAt - mission.startedAt)) * 50
          );
        }
      } else if (mission.status === "active") {
        if (mission.completionAt && currentTime >= mission.completionAt) {
          updatedMission.status = "returning";
          updatedMission.progress = 75;
        } else if (mission.completionAt) {
          updatedMission.progress = Math.round(
            50 + ((currentTime - mission.arrivalAt!) / (mission.completionAt - mission.arrivalAt!)) * 25
          );
        }
      } else if (mission.status === "returning") {
        if (mission.completionAt && currentTime >= mission.completionAt + 3600000) {
          // Add 1 hour return time
          updatedMission.status = "completed";
          updatedMission.progress = 100;
          completed.push(updatedMission);
        } else {
          updatedMission.progress = Math.round(
            75 + ((currentTime - mission.completionAt!) / 3600000) * 25
          );
          active.push(updatedMission);
        }
      } else {
        active.push(updatedMission);
      }

      if (updatedMission.status !== "completed") {
        active.push(updatedMission);
      }
    }

    return { active, completed };
  }
}

// ============================================================================
// GAME STATE PROCESSOR
// ============================================================================

export interface GameStateSnapshot {
  tickNumber: number;
  resources: ResourceProduction;
  buildings: Record<string, number>;
  research: Record<string, number>;
  fleets: Record<string, number>;
  kardashevLevel: KardashevLevel;
  kardashevProgress: number;
}

export class GameStateProcessor {
  processGameTick(
    currentState: any,
    tick: GameTick,
    kardashevLevel: KardashevLevel
  ): Partial<GameStateSnapshot> {
    // Calculate resource production
    const resourcesProduced = calculateResourceProductionPerTick(
      currentState.buildings || {},
      kardashevLevel,
      tick
    );

    // Process queues
    const queueProcessor = new QueueProcessor();
    const { completed: completedQueue, active: activeQueue } = queueProcessor.processQueueItems(
      currentState.queueItems || [],
      tick
    );

    // Process missions
    const missionProcessor = new MissionProcessor();
    const { completed: completedMissions, active: activeMissions } = missionProcessor.processMissions(
      currentState.missions || [],
      tick
    );

    // Aggregate building completions
    const buildingsCompleted = completedQueue
      .filter(q => q.type === "building")
      .map(q => q.itemId);

    const researchCompleted = completedQueue
      .filter(q => q.type === "research")
      .map(q => q.itemId);

    return {
      tickNumber: tick.tickNumber,
      resources: resourcesProduced,
      buildings: currentState.buildings,
      research: currentState.research,
      fleets: currentState.fleets,
      kardashevLevel,
      kardashevProgress: calculateKardashevProgress(
        currentState.resources?.metal || 0,
        currentState.resources?.crystal || 0,
        currentState.resources?.deuterium || 0,
        kardashevLevel
      )
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function calculateKardashevProgress(
  metal: number,
  crystal: number,
  deuterium: number,
  currentLevel: KardashevLevel
): number {
  const nextLevel = Math.min(currentLevel + 1, 18) as KardashevLevel;
  const requirements = getKardashevTier(nextLevel);

  const metalPercent = (metal / requirements.requirementsMetal) * 100;
  const crystalPercent = (crystal / requirements.requirementsCrystal) * 100;
  const deuteriumPercent = (deuterium / requirements.requirementsDeuterium) * 100;

  return Math.min(100, Math.round((metalPercent + crystalPercent + deuteriumPercent) / 3));
}

export function estimateQueueCompletionTime(
  items: QueueItem[],
  currentTime: number
): Map<string, number> {
  const completionTimes = new Map<string, number>();

  for (const item of items) {
    if (item.status === "completed") {
      completionTimes.set(item.id, currentTime);
    } else {
      completionTimes.set(item.id, item.completionTime);
    }
  }

  return completionTimes;
}

export function calculateETA(
  startTime: number,
  completionTime: number,
  currentTime: number
): { seconds: number; formatted: string } {
  const remaining = Math.max(0, completionTime - currentTime);
  const seconds = Math.floor(remaining / 1000);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let formatted = "";
  if (hours > 0) formatted += `${hours}h `;
  if (minutes > 0) formatted += `${minutes}m `;
  formatted += `${secs}s`;

  return { seconds, formatted };
}
