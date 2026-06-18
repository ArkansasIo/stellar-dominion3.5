import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { UniverseSeedService } from "./services/universeSeedService";

function readUserId(req: Request) {
  const userId = (req as any)?.user?.id || (req.session as any)?.userId;
  return String(userId || "").trim();
}

function parsePositiveInt(raw: unknown, fallback: number) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(1, Math.floor(parsed));
}

export function registerUniverseSeedRoutes(app: Express) {
  app.get("/api/universe/seed/config", isAuthenticated, async (req: Request, res: Response) => {
    const userId = readUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const config = await UniverseSeedService.getConfigForUser(userId);
    return res.json({
      success: true,
      ...config,
    });
  });

  app.post("/api/universe/seed/select", isAuthenticated, async (req: Request, res: Response) => {
    const userId = readUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const seed = String(req.body?.seed || "").trim();
    if (!seed) {
      return res.status(400).json({ message: "seed is required" });
    }

    const selected = await UniverseSeedService.setSeedForUser(userId, seed);
    return res.json({
      success: true,
      selected,
    });
  });

  app.post("/api/universe/seed/reset", isAuthenticated, async (req: Request, res: Response) => {
    const userId = readUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const selected = await UniverseSeedService.resetSeedForUser(userId);
    return res.json({
      success: true,
      selected,
    });
  });

  app.get("/api/universe/seed/system/:galaxy/:sector/:system", isAuthenticated, async (req: Request, res: Response) => {
    const userId = readUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { seed } = await UniverseSeedService.getSeedForUser(userId);
    const galaxy = parsePositiveInt(req.params.galaxy, 1);
    const sector = parsePositiveInt(req.params.sector, 1);
    const system = parsePositiveInt(req.params.system, 1);

    const generated = UniverseSeedService.generateSystem(seed, galaxy, sector, system);
    return res.json({
      success: true,
      seed,
      generated,
    });
  });

  app.get("/api/universe/seed/sector/:galaxy/:sector", isAuthenticated, async (req: Request, res: Response) => {
    const userId = readUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { seed } = await UniverseSeedService.getSeedForUser(userId);
    const galaxy = parsePositiveInt(req.params.galaxy, 1);
    const sector = parsePositiveInt(req.params.sector, 1);
    const limit = parsePositiveInt(req.query.limit, 12);

    const preview = UniverseSeedService.generateSectorPreview(seed, galaxy, sector, limit);
    return res.json({
      success: true,
      seed,
      preview,
    });
  });

  app.get("/api/universe/seed/galaxy/:galaxy/summary", isAuthenticated, async (req: Request, res: Response) => {
    const userId = readUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { seed } = await UniverseSeedService.getSeedForUser(userId);
    const galaxy = parsePositiveInt(req.params.galaxy, 1);
    const sectorCount = parsePositiveInt(req.query.sectorCount, 5);
    const systemsPerSector = parsePositiveInt(req.query.systemsPerSector, 10);

    const summary = UniverseSeedService.generateGalaxySummary(seed, galaxy, sectorCount, systemsPerSector);
    return res.json({
      success: true,
      seed,
      summary,
    });
  });
}
