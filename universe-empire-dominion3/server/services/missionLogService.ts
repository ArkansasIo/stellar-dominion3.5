/**
 * Mission Log Service
 * OGame-style mission logging with detailed fleet information and status tracking
 */

import { db } from "../db";
import { missions, playerStates, users } from "@shared/schema";
import { eq, and, desc, inArray, or, sql } from "drizzle-orm";

export interface MissionLog {
  missionId: string;
  userId: string;
  username: string;
  
  missionType: string;
  status: "outbound" | "return" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  
  fleet: FleetInformation;
  
  origin: string;
  target: string;
  cargo: CargoInformation;
  
  departureTime: Date;
  arrivalTime: Date;
  returnTime?: Date;
  duration: number;
  remainingTime: number;
  
  progress: number;
  currentPhase: "preparing" | "traveling" | "executing" | "returning" | "completed";
  
  events: MissionEvent[];
  logs: string[];
  
  createdAt: Date;
}

export interface FleetInformation {
  totalShips: number;
  totalCapacity: number;
  usedCapacity: number;
  fleetPower: number;
  fleetSpeed: number;
  fuelConsumption: number;
  fuelRemaining: number;
  
  ships: ShipDetail[];
  
  status: "idle" | "traveling" | "combat" | "loading" | "unloading";
  condition: "excellent" | "good" | "damaged" | "critical";
  morale: number;
}

export interface ShipDetail {
  type: string;
  count: number;
  maxHealth: number;
  currentHealth: number;
  healthPercent: number;
  cargoCapacity: number;
  weaponPower: number;
  shieldPower: number;
  speed: number;
  experience: number;
}

export interface CargoInformation {
  metal: number;
  crystal: number;
  deuterium: number;
  fuel: number;
  resources: number;
  capacity: number;
  utilizationPercent: number;
}

export interface MissionEvent {
  timestamp: Date;
  type: "departure" | "arrival" | "combat" | "discovery" | "resource" | "warning" | "error";
  severity: "info" | "warning" | "error" | "success";
  message: string;
  details?: any;
}

export class MissionLogService {
  private static calculateFuelConsumption(shipType: string, count: number): number {
    const FUEL_RATES: Record<string, number> = {
      lightFighter: 10,
      heavyFighter: 20,
      smallCargo: 10,
      largeCargo: 50,
      espionageProbe: 1,
      battleship: 100,
      cruiser: 75,
      destroyer: 50,
      dreadnought: 200,
      colonist: 5,
    };
    return (FUEL_RATES[shipType] || 10) * count;
  }

  private static buildCargoInformation(mission: any): CargoInformation {
    const cargo = mission.cargo as any || {};
    const metal = cargo.metal || 0;
    const crystal = cargo.crystal || 0;
    const deuterium = cargo.deuterium || 0;
    const fuel = cargo.fuel || 0;
    const resources = metal + crystal + deuterium;
    const capacity = 10000;

    return {
      metal,
      crystal,
      deuterium,
      fuel,
      resources,
      capacity,
      utilizationPercent: capacity > 0 ? (resources / capacity) * 100 : 0,
    };
  }

  private static generateMissionEvents(mission: any): MissionEvent[] {
    const events: MissionEvent[] = [];

    events.push({
      timestamp: mission.departureTime,
      type: "departure",
      severity: "info",
      message: `Fleet departed from ${mission.origin}`,
      details: { destination: mission.target },
    });

    if (mission.type === "attack" || mission.type === "espionage") {
      events.push({
        timestamp: new Date(mission.departureTime.getTime() + 60000),
        type: "combat",
        severity: "warning",
        message: "Hostile forces detected in target sector",
        details: { threatLevel: "medium" },
      });
    }

    if (mission.type === "explore" || mission.type === "expedition") {
      events.push({
        timestamp: new Date(mission.departureTime.getTime() + 120000),
        type: "discovery",
        severity: "success",
        message: "Anomaly detected - investigating",
        details: { anomalyType: "resource" },
      });
    }

    return events;
  }

  private static generateMissionLogs(mission: any, events: MissionEvent[]): string[] {
    const logs: string[] = [];

    logs.push(`[${mission.departureTime.toISOString()}] Mission ${mission.type.toUpperCase()} initiated`);
    logs.push(`[${mission.departureTime.toISOString()}] Fleet assembled and ready for departure`);
    logs.push(`[${mission.departureTime.toISOString()}] Target coordinates: ${mission.target}`);

    for (const event of events) {
      logs.push(`[${event.timestamp.toISOString()}] [${event.severity.toUpperCase()}] ${event.message}`);
    }

    if (mission.status === "completed" && mission.returnTime) {
      logs.push(`[${mission.returnTime.toISOString()}] Mission completed successfully`);
      logs.push(`[${mission.returnTime.toISOString()}] Fleet returned to ${mission.origin}`);
    }

    return logs;
  }

  private static calculateRemainingTime(mission: any): number {
    if (mission.status === "completed") return 0;
    if (mission.status === "return" && mission.returnTime) {
      const remaining = mission.returnTime.getTime() - Date.now();
      return Math.max(0, remaining);
    }
    const remaining = mission.arrivalTime.getTime() - Date.now();
    return Math.max(0, remaining);
  }

  private static calculateDuration(mission: any): number {
    if (mission.returnTime) {
      return mission.returnTime.getTime() - mission.departureTime.getTime();
    }
    return mission.arrivalTime.getTime() - mission.departureTime.getTime();
  }

  private static calculateProgress(mission: any): number {
    if (mission.status === "completed") return 100;
    if (mission.status === "return") {
      const totalDuration = this.calculateDuration(mission);
      const elapsed = Date.now() - mission.departureTime.getTime();
      return Math.min(100, Math.floor((elapsed / totalDuration) * 100));
    }
    const totalDuration = mission.arrivalTime.getTime() - mission.departureTime.getTime();
    const elapsed = Date.now() - mission.departureTime.getTime();
    return Math.min(100, Math.floor((elapsed / totalDuration) * 100));
  }

  private static determinePhase(mission: any): MissionLog["currentPhase"] {
    if (mission.status === "completed") return "completed";
    if (mission.status === "return") return "returning";
    const now = Date.now();
    if (now < mission.departureTime.getTime()) return "preparing";
    if (now < mission.arrivalTime.getTime()) return "traveling";
    return "executing";
  }

  private static determinePriority(mission: any): MissionLog["priority"] {
    const typePriority: Record<string, MissionLog["priority"]> = {
      attack: "critical",
      espionage: "high",
      colonize: "high",
      transport: "medium",
      explore: "medium",
      expedition: "low",
    };
    return typePriority[mission.type] || "medium";
  }

  private static buildFleetInformation(mission: any, playerState: any): FleetInformation {
    const units = mission.units as any || {};
    const UNIT_STATS: Record<string, any> = {
      lightFighter: { capacity: 50, speed: 12, weapon: 50, shield: 20, health: 100 },
      heavyFighter: { capacity: 100, speed: 10, weapon: 80, shield: 40, health: 150 },
      smallCargo: { capacity: 5000, speed: 8, weapon: 10, shield: 15, health: 400 },
      largeCargo: { capacity: 25000, speed: 5, weapon: 5, shield: 10, health: 800 },
      espionageProbe: { capacity: 0, speed: 20, weapon: 1, shield: 5, health: 50 },
      battleship: { capacity: 500, speed: 6, weapon: 200, shield: 100, health: 600 },
      cruiser: { capacity: 800, speed: 8, weapon: 120, shield: 60, health: 400 },
      destroyer: { capacity: 1000, speed: 10, weapon: 90, shield: 50, health: 300 },
      dreadnought: { capacity: 2000, speed: 4, weapon: 300, shield: 150, health: 1000 },
      colonist: { capacity: 0, speed: 3, weapon: 5, shield: 5, health: 50 },
    };

    const ships: ShipDetail[] = [];
    let totalShips = 0;
    let totalCapacity = 0;
    let totalPower = 0;
    let fleetSpeed = Infinity;
    let fuelConsumption = 0;

    for (const [shipType, count] of Object.entries(units)) {
      const shipCount = count as number;
      if (shipCount === 0) continue;

      const stats = UNIT_STATS[shipType] || { capacity: 100, speed: 5, weapon: 50, shield: 25, health: 100 };
      
      ships.push({
        type: shipType,
        count: shipCount,
        maxHealth: stats.health,
        currentHealth: stats.health,
        healthPercent: 100,
        cargoCapacity: stats.capacity,
        weaponPower: stats.weapon,
        shieldPower: stats.shield,
        speed: stats.speed,
        experience: 0,
      });

      totalShips += shipCount;
      totalCapacity += stats.capacity * shipCount;
      totalPower += stats.weapon * shipCount;
      fleetSpeed = Math.min(fleetSpeed, stats.speed);
      fuelConsumption += MissionLogService.calculateFuelConsumption(shipType, shipCount);
    }

    return {
      totalShips,
      totalCapacity,
      usedCapacity: 0,
      fleetPower: totalPower,
      fleetSpeed: fleetSpeed === Infinity ? 0 : fleetSpeed,
      fuelConsumption,
      fuelRemaining: 10000,
      ships,
      status: mission.status === "outbound" ? "traveling" : mission.status === "return" ? "traveling" : "idle",
      condition: "excellent",
      morale: 100,
    };
  }

  static async getMissionLog(missionId: string): Promise<MissionLog | null> {
    const mission = await db.select().from(missions).where(eq(missions.id, missionId)).limit(1);
    if (!mission.length) return null;

    const missionData = mission[0];
    const [user, playerState] = await Promise.all([
      db.select().from(users).where(eq(users.id, missionData.userId)).limit(1),
      db.select().from(playerStates).where(eq(playerStates.userId, missionData.userId)).limit(1),
    ]);

    if (!user.length || !playerState.length) return null;

    const fleet = this.buildFleetInformation(missionData, playerState[0]);
    const cargo = this.buildCargoInformation(missionData);
    const events = this.generateMissionEvents(missionData);
    const logs = this.generateMissionLogs(missionData, events);
    const remainingTime = this.calculateRemainingTime(missionData);

    return {
      missionId: missionData.id,
      userId: missionData.userId,
      username: user[0].username || "Unknown",
      missionType: missionData.type,
      status: missionData.status as any,
      priority: this.determinePriority(missionData),
      fleet,
      origin: missionData.origin,
      target: missionData.target,
      cargo,
      departureTime: missionData.departureTime,
      arrivalTime: missionData.arrivalTime,
      returnTime: missionData.returnTime || undefined,
      duration: this.calculateDuration(missionData),
      remainingTime,
      progress: this.calculateProgress(missionData),
      currentPhase: this.determinePhase(missionData),
      events,
      logs,
      createdAt: missionData.createdAt || new Date(),
    };
  }

  static async getPlayerMissionLogs(userId: string, limit: number = 50): Promise<MissionLog[]> {
    const playerMissions = await db
      .select()
      .from(missions)
      .where(eq(missions.userId, userId))
      .orderBy(desc(missions.createdAt))
      .limit(limit);

    const missionLogs: MissionLog[] = [];
    for (const mission of playerMissions) {
      const log = await this.getMissionLog(mission.id);
      if (log) missionLogs.push(log);
    }

    return missionLogs;
  }

  static async getActiveMissions(userId: string): Promise<MissionLog[]> {
    const activeMissions = await db
      .select()
      .from(missions)
      .where(and(eq(missions.userId, userId), or(eq(missions.status, "outbound"), eq(missions.status, "return"))))
      .orderBy(desc(missions.departureTime));

    const missionLogs: MissionLog[] = [];
    for (const mission of activeMissions) {
      const log = await this.getMissionLog(mission.id);
      if (log) missionLogs.push(log);
    }

    return missionLogs;
  }

  static async getMissionStatistics(userId: string): Promise<any> {
    const allMissions = await db
      .select()
      .from(missions)
      .where(eq(missions.userId, userId));

    const stats = {
      total: allMissions.length,
      completed: allMissions.filter(m => m.status === "completed").length,
      active: allMissions.filter(m => m.status === "outbound" || m.status === "return").length,
      failed: allMissions.filter(m => m.status === "failed").length,
      byType: {} as Record<string, number>,
      totalDistance: 0,
      totalResourcesTransported: 0,
      totalCombatRounds: 0,
    };

    for (const mission of allMissions) {
      stats.byType[mission.type] = (stats.byType[mission.type] || 0) + 1;
      stats.totalDistance += mission.arrivalTime.getTime() - mission.departureTime.getTime();
      
      const cargo = mission.cargo as any || {};
      stats.totalResourcesTransported += (cargo.metal || 0) + (cargo.crystal || 0) + (cargo.deuterium || 0);
      
      stats.totalCombatRounds += (mission as any).rounds || 0;
    }

    return stats;
  }
}