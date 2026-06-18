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
import type { OrbitalStationsState, OrbitalStation, OrbitalPlatformType, SatelliteType, DefenseSystemType, OffenseSystemType, ShieldSystemType } from "../shared/config/orbitalStationsSystem";

const stationStates: Record<string, OrbitalStationsState> = {};

function getState(userId: string): OrbitalStationsState {
  if (!stationStates[userId]) stationStates[userId] = getDefaultOrbitalStationsState();
  return stationStates[userId];
}

function setState(userId: string, state: OrbitalStationsState) {
  stationStates[userId] = state;
}

export function registerOrbitalStationRoutes(app: Express) {
  // Get full orbital stations state
  app.get("/api/orbital-stations/status", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = getState(userId);
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
  app.post("/api/orbital-stations/build", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { platformType, name, x, y, planetId } = req.body;
    if (!platformType) return res.status(400).json({ message: "Missing platformType" });
    const state = getState(userId);
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
    setState(userId, state);
    res.json({ success: true, station, cost, buildTime });
  });

  // Upgrade station tier
  app.post("/api/orbital-stations/upgrade", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId } = req.body;
    if (!stationId) return res.status(400).json({ message: "Missing stationId" });
    const state = getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const config = ORBITAL_PLATFORMS.find(p => p.type === station.platformType);
    if (!config) return res.status(400).json({ message: "Invalid platform" });
    if (station.tier >= config.maxTier) return res.status(400).json({ message: "Max tier reached" });
    const cost = calculateStationUpgradeCost(station.platformType, station.tier, station.level);
    station.tier += 1;
    station.experience += 100;
    state.totalStationLevels += 1;
    setState(userId, state);
    res.json({ success: true, station, cost });
  });

  // Deploy satellite
  app.post("/api/orbital-stations/deploy-satellite", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, satelliteType } = req.body;
    if (!stationId || !satelliteType) return res.status(400).json({ message: "Missing stationId or satelliteType" });
    const state = getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const satConfig = SATELLITES.find(s => s.type === satelliteType);
    if (!satConfig) return res.status(400).json({ message: "Invalid satellite type" });
    const existingCount = station.satellites.filter(s => s.type === satelliteType).length;
    if (existingCount >= satConfig.maxPerSystem) return res.status(400).json({ message: "Max satellites of this type reached" });
    station.satellites.push({ type: satelliteType as SatelliteType, tier: 1, deployedAt: Date.now() });
    state.satellitesDeployed += 1;
    setState(userId, state);
    res.json({ success: true, station });
  });

  // Install defense system
  app.post("/api/orbital-stations/install-defense", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, defenseType } = req.body;
    if (!stationId || !defenseType) return res.status(400).json({ message: "Missing stationId or defenseType" });
    const state = getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const defConfig = DEFENSE_SYSTEMS.find(d => d.type === defenseType);
    if (!defConfig) return res.status(400).json({ message: "Invalid defense type" });
    station.defenses.push({ type: defenseType as DefenseSystemType, tier: 1, level: 0 });
    setState(userId, state);
    res.json({ success: true, station });
  });

  // Install offense system
  app.post("/api/orbital-stations/install-offense", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, offenseType } = req.body;
    if (!stationId || !offenseType) return res.status(400).json({ message: "Missing stationId or offenseType" });
    const state = getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const offConfig = OFFENSE_SYSTEMS.find(o => o.type === offenseType);
    if (!offConfig) return res.status(400).json({ message: "Invalid offense type" });
    station.offenses.push({ type: offenseType as OffenseSystemType, tier: 1, level: 0, cooldownEnd: 0 });
    setState(userId, state);
    res.json({ success: true, station });
  });

  // Install shield system
  app.post("/api/orbital-stations/install-shield", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId, shieldType } = req.body;
    if (!stationId || !shieldType) return res.status(400).json({ message: "Missing stationId or shieldType" });
    const state = getState(userId);
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const shieldConfig = SHIELD_SYSTEMS.find(s => s.type === shieldType);
    if (!shieldConfig) return res.status(400).json({ message: "Invalid shield type" });
    const maxHp = shieldConfig.effects.find(e => e.statType === 'shieldHp')?.value || 100;
    station.shields.push({ type: shieldType as ShieldSystemType, tier: 1, level: 0, currentHp: maxHp, maxHp });
    setState(userId, state);
    res.json({ success: true, station });
  });

  // Process station tick
  app.post("/api/orbital-stations/tick", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { stationId } = req.body;
    const state = getState(userId);
    if (stationId) {
      const station = state.stations.find(s => s.id === stationId);
      if (!station) return res.status(404).json({ message: "Station not found" });
      const updated = processStationTick(station);
      const idx = state.stations.findIndex(s => s.id === stationId);
      state.stations[idx] = updated;
    } else {
      state.stations = state.stations.map(s => processStationTick(s));
    }
    setState(userId, state);
    res.json({ success: true, stations: state.stations });
  });

  // Get station scores
  app.get("/api/orbital-stations/scores", (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = getState(userId);
    const scores = state.stations.map(s => ({
      id: s.id,
      name: s.name,
      defenseScore: calculateStationDefenseScore(s),
      offenseScore: calculateStationOffenseScore(s),
      production: calculateStationProduction(s),
    }));
    res.json({ success: true, scores });
  });
}