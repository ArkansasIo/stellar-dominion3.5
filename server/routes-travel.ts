import { Request, Response } from "express";
import {
  STARGATES,
  WORMHOLES,
  FTL_DRIVES,
  calculateDistance,
  calculateTravelCost,
  calculateTravelTime,
  buildTravelRoute,
  getNearbyWormholes,
  getPlanetType,
  getPlanetsByClass,
  getPlanetsByFamily,
  getPlanetsByRarity,
  getHabitablePlanets,
  getResourceRichPlanets,
  ALL_PLANET_TYPES,
  PLANET_STATISTICS,
  STARFLEET_BIOME_CATALOG_90,
  STARFLEET_BIOME_CATALOG_META,
  getBiomeById,
  getBiomesByEnvironment,
  getBiomesByLetter,
  getBiomesByRarity,
  type Coordinates,
  type BiomeEnvironmentType,
  type BiomeRarity,
} from "@shared/config";
import { storage } from "./storage";

declare module "express-session" {
  interface Session {
    userId?: string;
  }
}

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const getUserId = (req: Request): string => req.session.userId || "";

function parseCoordinates(raw: any): Coordinates | null {
  if (!raw || typeof raw !== "object") return null;

  const candidate = {
    galaxy: Number(raw.galaxy),
    sector: Number(raw.sector),
    system: Number(raw.system),
    x: Number(raw.x),
    y: Number(raw.y),
    z: Number(raw.z),
  };

  const hasInvalid = Object.values(candidate).some(v => Number.isNaN(v));
  if (hasInvalid) return null;

  return candidate;
}

export function registerTravelRoutes(app: any) {
  // Travel network catalog
  app.get("/api/travel/stargates", (_req: Request, res: Response) => {
    res.json({ count: STARGATES.length, stargates: STARGATES });
  });

  app.get("/api/travel/wormholes", (req: Request, res: Response) => {
    const { galaxy, sector, system, x, y, z, radius } = req.query;

    if (galaxy !== undefined) {
      const coords = parseCoordinates({ galaxy, sector, system, x, y, z });
      if (!coords) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }

      const nearby = getNearbyWormholes(coords, Number(radius) || 250);
      return res.json({ count: nearby.length, wormholes: nearby });
    }

    res.json({ count: WORMHOLES.length, wormholes: WORMHOLES });
  });

  app.get("/api/travel/ftl-drives", (req: Request, res: Response) => {
    const { driveClass, techLevel } = req.query;

    let drives = [...FTL_DRIVES];

    if (driveClass) {
      drives = drives.filter(d => d.class === String(driveClass));
    }

    if (techLevel) {
      const minTech = Number(techLevel);
      if (!Number.isNaN(minTech)) {
        drives = drives.filter(d => d.techLevelRequired <= minTech);
      }
    }

    res.json({ count: drives.length, drives });
  });

  app.post("/api/travel/route/calculate", (req: Request, res: Response) => {
    const { from, to, method, ftlDriveId } = req.body || {};

    const fromCoords = parseCoordinates(from);
    const toCoords = parseCoordinates(to);

    if (!fromCoords || !toCoords) {
      return res.status(400).json({ message: "Invalid coordinates payload" });
    }

    const distance = calculateDistance(fromCoords, toCoords);
    const drive = ftlDriveId ? FTL_DRIVES.find(d => d.id === ftlDriveId) ?? null : null;

    const route = buildTravelRoute(
      `Calculated-${Date.now()}`,
      fromCoords,
      toCoords,
      method === "gate" || method === "wormhole" ? method : "warp",
      drive || undefined,
    );

    res.json({
      distance,
      travelTime: calculateTravelTime(distance, drive, null),
      travelCost: calculateTravelCost(distance, drive),
      route,
    });
  });

  // Planet type viewer data
  app.get("/api/planets/types", (req: Request, res: Response) => {
    const { family, className, rarity, habitableOnly, resourceRichOnly } = req.query;

    let planets = [...ALL_PLANET_TYPES];

    if (family) planets = getPlanetsByFamily(String(family));
    if (className) planets = planets.filter(p => p.class === String(className));
    if (rarity) planets = planets.filter(p => p.rarity === String(rarity));
    if (habitableOnly === "true") planets = planets.filter(p => p.stats.habitabilityIndex >= 30);
    if (resourceRichOnly === "true") {
      planets = planets.filter(
        p => p.stats.metalRichness >= 50 || p.stats.crystalRichness >= 50 || p.stats.deuteriumRichness >= 50,
      );
    }

    res.json({ count: planets.length, statistics: PLANET_STATISTICS, planets });
  });

  app.get("/api/planets/types/:id", (req: Request, res: Response) => {
    const planet = getPlanetType(req.params.id);
    if (!planet) return res.status(404).json({ message: "Planet type not found" });

    res.json({ planet });
  });

  // Starfleet-inspired biome catalog
  app.get('/api/biomes/catalog', (_req: Request, res: Response) => {
    res.json({
      meta: STARFLEET_BIOME_CATALOG_META,
      biomes: STARFLEET_BIOME_CATALOG_90,
    });
  });

  app.get('/api/biomes/catalog/:id', (req: Request, res: Response) => {
    const biome = getBiomeById(req.params.id);
    if (!biome) {
      return res.status(404).json({ message: 'Biome not found' });
    }

    res.json({ biome });
  });

  app.get('/api/biomes/environment/:environment', (req: Request, res: Response) => {
    const environment = req.params.environment as BiomeEnvironmentType;
    const allowed: BiomeEnvironmentType[] = ['planet', 'moon', 'colony', 'space-station', 'starbase', 'moon-base'];

    if (!allowed.includes(environment)) {
      return res.status(400).json({ message: 'Invalid biome environment type' });
    }

    res.json({
      environment,
      count: getBiomesByEnvironment(environment).length,
      biomes: getBiomesByEnvironment(environment),
    });
  });

  app.get('/api/biomes/letter/:letter', (req: Request, res: Response) => {
    const letter = String(req.params.letter || '').toUpperCase();
    if (!/^[A-Z]$/.test(letter)) {
      return res.status(400).json({ message: 'Letter must be A-Z' });
    }

    res.json({
      letter,
      count: getBiomesByLetter(letter).length,
      biomes: getBiomesByLetter(letter),
    });
  });

  app.get('/api/biomes/rarity/:rarity', (req: Request, res: Response) => {
    const rarity = req.params.rarity as BiomeRarity;
    const allowed: BiomeRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

    if (!allowed.includes(rarity)) {
      return res.status(400).json({ message: 'Invalid rarity. Use common|uncommon|rare|epic|legendary' });
    }

    res.json({
      rarity,
      count: getBiomesByRarity(rarity).length,
      biomes: getBiomesByRarity(rarity),
    });
  });

  // Player travel profile
  app.get("/api/travel/player/state", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const state = (await storage.getPlayerState(userId)) as any;

    res.json({
      travelState: state?.travelState || { activeRoute: null, discoveredWormholes: [] },
      travelLog: state?.travelLog || [],
      knownPlanets: state?.knownPlanets || [],
    });
  });

  app.post("/api/travel/player/route", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { from, to, method, ftlDriveId, routeName } = req.body || {};

    const fromCoords = parseCoordinates(from);
    const toCoords = parseCoordinates(to);
    if (!fromCoords || !toCoords) {
      return res.status(400).json({ message: "Invalid coordinates payload" });
    }

    const drive = ftlDriveId ? FTL_DRIVES.find(d => d.id === ftlDriveId) ?? null : null;
    const route = buildTravelRoute(
      routeName || `PlayerRoute-${Date.now()}`,
      fromCoords,
      toCoords,
      method === "gate" || method === "wormhole" ? method : "warp",
      drive || undefined,
    );

    const state = (await storage.getPlayerState(userId)) as any;
    const existingLog = Array.isArray(state?.travelLog) ? state.travelLog : [];

    const updated = await storage.updatePlayerState(userId, {
      travelState: {
        activeRoute: route,
        startedAt: new Date().toISOString(),
      },
      travelLog: [
        {
          id: `travel-${Date.now()}`,
          createdAt: new Date().toISOString(),
          route,
        },
        ...existingLog,
      ].slice(0, 50),
    } as any);

    res.json({ success: true, activeRoute: (updated as any).travelState?.activeRoute || route });
  });
}
