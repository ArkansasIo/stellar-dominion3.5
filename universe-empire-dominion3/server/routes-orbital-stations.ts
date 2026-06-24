/**
 * ORBITAL STATIONS SERVER ROUTES
 * ============================================================================
 */
import { type Express } from "express";
import {
  ORBITAL_PLATFORMS, SATELLITES, DEFENSE_SYSTEMS, OFFENSE_SYSTEMS, SHIELD_SYSTEMS,
  getDefaultOrbitalStationsState,
  calculateStationUpgradeCost, calculateStationBuildTime,
  calculateStationDefenseScore, calculateStationOffenseScore,
  calculateStationProduction, calculateGlobalOrbitalBonuses, processStationTick,
} from "../shared/config/orbitalStationsSystem";
import type { OrbitalStationsState, OrbitalStation, OrbitalPlatformType, SatelliteType, DefenseSystemType, OffenseSystemType, ShieldSystemType, InfrastructureDeployment } from "../shared/config/orbitalStationsSystem";

import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

async function getState(userId: string): Promise<OrbitalStationsState> {
  const row = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
    columns: { orbitalStations: true },
  });
  let state = row?.orbitalStations as OrbitalStationsState | null;
  if (!state) {
    state = getDefaultOrbitalStationsState();
    await setState(userId, state);
  }
  return state;
}

async function setState(userId: string, state: OrbitalStationsState) {
  await db
    .update(playerStates)
    .set({ orbitalStations: state as any, updatedAt: new Date() })
    .where(eq(playerStates.userId, userId));
}

export function registerOrbitalStationRoutes(app: Express) {
  // Get full orbital stations state
  app.get("/api/orbital-stations/status", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getState(userId);
    const globalBonuses = calculateGlobalOrbitalBonuses(state.stations);
    res.json({
      success: true,
      stationCount: state.stations.length,
      maxStations: state.maxStations,
      totalStationLevels: state.totalStationLevels,
      globalBonuses,
      satellitesDeployed: state.satellitesDeployed,
      totalDefenseScore: state.totalDefenseScore,
      totalOffenseScore: state.totalOffenseScore,
      stations: state.stations,
    });
  });

  // Get all platform types
  app.get("/api/orbital-stations/platforms", (_req, res) => {
    res.json({ success: true, platforms: ORBITAL_PLATFORMS });
  });

  // Get all satellite types
  app.get("/api/orbital-stations/satellites", (_req, res) => {
    res.json({ success: true, satellites: SATELLITES });
  });

  // Get all defense systems
  app.get("/api/orbital-stations/defense-systems", (_req, res) => {
    res.json({ success: true, defenseSystems: DEFENSE_SYSTEMS });
  });

  // Get all offense systems
  app.get("/api/orbital-stations/offense-systems", (_req, res) => {
    res.json({ success: true, offenseSystems: OFFENSE_SYSTEMS });
  });

  // Get all shield systems
  app.get("/api/orbital-stations/shield-systems", (_req, res) => {
    res.json({ success: true, shieldSystems: SHIELD_SYSTEMS });
  });

  // Build a new station
  app.post("/api/orbital-stations/build", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { platformType, name, x, y, planetId } = req.body;
    if (!platformType) return res.status(400).json({ message: "Missing platformType" });
    const state = await getState(userId);
    if (state.stations.length >= state.maxStations) {
      return res.status(400).json({ message: "Max stations reached" });
    }
    const config = ORBITAL_PLATFORMS.find(p => p.type === platformType);
    if (!config) return res.status(400).json({ message: "Invalid platform type" });
    const cost = calculateStationUpgradeCost(platformType, 0, 0);
    const buildTime = calculateStationBuildTime(platformType, 0);
    const station: OrbitalStation = {
      id: `station-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name || config.name,
      platformType: platformType as OrbitalPlatformType,
      tier: 0,
      level: 0,
      experience: 0,
      x: x || 0,
      y: y || 0,
      planetId: planetId || null,
      modules: [],
      satellites: [],
      shields: [],
      defenses: [],
      offenses: [],
      resourceStorage: { metal: 0, crystal: 0, deuterium: 0, credits: 0 },
      maxStorage: { metal: 10000, crystal: 5000, deuterium: 2500, credits: 50000 },
      productionRate: { metal: 0, crystal: 0, deuterium: 0 },
      isOnline: true,
      createdAt: Date.now(),
      lastTick: Date.now(),
      stats: { totalDamageDealt: 0, totalDamageReceived: 0, totalShipsBuilt: 0, totalResourcesMined: 0, totalResearchCompleted: 0, defenseScore: 0, offenseScore: 0, utilityScore: 0 },
    };
    state.stations.push(station);
    await setState(userId, state);
    res.json({ success: true, station, cost, buildTime });
  });

  // Upgrade station tier
  app.post("/api/orbital-stations/upgrade", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId } = req.body;
    if (!stationId) return res.status(400).json({ message: "Missing stationId" });
    const state = await getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const config = ORBITAL_PLATFORMS.find(p => p.type === station.platformType);
    if (!config) return res.status(400).json({ message: "Invalid platform" });
    if (station.tier >= config.maxTier) return res.status(400).json({ message: "Max tier reached" });
    const cost = calculateStationUpgradeCost(station.platformType, station.tier, station.level);
    station.tier += 1;
    station.experience += 100;
    state.totalStationLevels += 1;
    await setState(userId, state);
    res.json({ success: true, station, cost });
  });

  // Deploy satellite
  app.post("/api/orbital-stations/deploy-satellite", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, satelliteType } = req.body;
    if (!stationId || !satelliteType) return res.status(400).json({ message: "Missing stationId or satelliteType" });
    const state = await getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const satConfig = SATELLITES.find(s => s.type === satelliteType);
    if (!satConfig) return res.status(400).json({ message: "Invalid satellite type" });
    const existingCount = station.satellites.filter(s => s.type === satelliteType).length;
    if (existingCount >= satConfig.maxPerSystem) return res.status(400).json({ message: "Max satellites of this type reached" });
    station.satellites.push({ type: satelliteType as SatelliteType, tier: 1, deployedAt: Date.now() });
    state.satellitesDeployed += 1;
    await setState(userId, state);
    res.json({ success: true, station });
  });

  // Install defense system
  app.post("/api/orbital-stations/install-defense", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, defenseType } = req.body;
    if (!stationId || !defenseType) return res.status(400).json({ message: "Missing stationId or defenseType" });
    const state = await getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const defConfig = DEFENSE_SYSTEMS.find(d => d.type === defenseType);
    if (!defConfig) return res.status(400).json({ message: "Invalid defense type" });
    station.defenses.push({ type: defenseType as DefenseSystemType, tier: 1, level: 0 });
    await setState(userId, state);
    res.json({ success: true, station });
  });

  // Install offense system
  app.post("/api/orbital-stations/install-offense", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, offenseType } = req.body;
    if (!stationId || !offenseType) return res.status(400).json({ message: "Missing stationId or offenseType" });
    const state = await getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const offConfig = OFFENSE_SYSTEMS.find(o => o.type === offenseType);
    if (!offConfig) return res.status(400).json({ message: "Invalid offense type" });
    station.offenses.push({ type: offenseType as OffenseSystemType, tier: 1, level: 0, cooldownEnd: 0 });
    await setState(userId, state);
    res.json({ success: true, station });
  });

  // Install shield system
  app.post("/api/orbital-stations/install-shield", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, shieldType } = req.body;
    if (!stationId || !shieldType) return res.status(400).json({ message: "Missing stationId or shieldType" });
    const state = await getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const shieldConfig = SHIELD_SYSTEMS.find(s => s.type === shieldType);
    if (!shieldConfig) return res.status(400).json({ message: "Invalid shield type" });
    const maxHp = shieldConfig.effects.find(e => e.statType === 'shieldHp')?.value || 100;
    station.shields.push({ type: shieldType as ShieldSystemType, tier: 1, level: 0, currentHp: maxHp, maxHp });
    await setState(userId, state);
    res.json({ success: true, station });
  });

  // Process station tick
  app.post("/api/orbital-stations/tick", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId } = req.body;
    const state = await getState(userId);
    if (stationId) {
      const station = state.stations.find(s => s.id === stationId);
      if (!station) return res.status(404).json({ message: "Station not found" });
      const updated = processStationTick(station);
      const idx = state.stations.findIndex(s => s.id === stationId);
      state.stations[idx] = updated;
    } else {
      state.stations = state.stations.map(s => processStationTick(s));
    }
    await setState(userId, state);
    res.json({ success: true, stations: state.stations });
  });

  // Get infrastructure deployments
  app.get("/api/orbital-stations/infrastructure", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getState(userId);
    const infrastructure = state.infrastructure || [];
    const summary = infrastructure.reduce((acc, dep) => {
      acc.totalDeployed += dep.count;
      if (!acc.byCategory[dep.category]) acc.byCategory[dep.category] = 0;
      acc.byCategory[dep.category] += dep.count;
      return acc;
    }, { totalDeployed: 0, byCategory: {} as Record<string, number> });
    res.json({ success: true, infrastructure, summary });
  });

  // Deploy infrastructure station
  app.post("/api/orbital-stations/infrastructure/deploy", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, name, category, subCategory, stationClass } = req.body;
    if (!stationId || !category) return res.status(400).json({ message: "Missing stationId or category" });
    const state = await getState(userId);
    if (!state.infrastructure) state.infrastructure = [];
    const existing = state.infrastructure.find(d => d.stationId === stationId);
    if (existing) {
      existing.count += 1;
      existing.level = Math.min(999, existing.level + 1);
    } else {
      state.infrastructure.push({
        id: `infra-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        stationId,
        name: name || stationId,
        category,
        subCategory: subCategory || "",
        tier: 1,
        level: 1,
        class: stationClass || "common",
        count: 1,
        deployedAt: Date.now(),
        isOnline: true,
      });
    }
    await setState(userId, state);
    const infra = state.infrastructure.find(d => d.stationId === stationId);
    res.json({ success: true, deployment: infra });
  });

  // Upgrade infrastructure station
  app.post("/api/orbital-stations/infrastructure/upgrade", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId } = req.body;
    if (!stationId) return res.status(400).json({ message: "Missing stationId" });
    const state = await getState(userId);
    if (!state.infrastructure) state.infrastructure = [];
    const deployment = state.infrastructure.find(d => d.stationId === stationId);
    if (!deployment) return res.status(404).json({ message: "Infrastructure not found" });
    if (deployment.tier >= 99) return res.status(400).json({ message: "Max tier reached" });
    deployment.tier += 1;
    deployment.level += 1;
    await setState(userId, state);
    res.json({ success: true, deployment });
  });

  // Get station scores
  app.get("/api/orbital-stations/scores", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getState(userId);
    const scores = state.stations.map(s => ({
      id: s.id,
      name: s.name,
      defenseScore: calculateStationDefenseScore(s),
      offenseScore: calculateStationOffenseScore(s),
      production: calculateStationProduction(s),
    }));
    res.json({ success: true, scores });
  });

  // Rename orbital station
  app.patch("/api/orbital-stations/:stationId/rename", async (req: any, res) => {
    try {
      const userId = req.user?.id || "dev-user";
      const { stationId } = req.params;
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required" });
      }
      const trimmed = name.trim().slice(0, 64);
      const state = await getState(userId);
      const idx = state.stations.findIndex((s: any) => s.id === stationId);
      if (idx === -1) return res.status(404).json({ error: "Station not found" });
      state.stations[idx].name = trimmed;
      await setState(userId, state);
      res.json({ success: true, name: trimmed });
    } catch (error) {
      console.error("Error renaming orbital station:", error);
      res.status(500).json({ error: "Failed to rename station" });
    }
  });
}