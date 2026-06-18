import { Request, Response } from "express";
import { storage } from "./storage";
import {
  getMegastructureTemplateCatalog,
  constructMegastructureForPlayer,
  upgradeMegastructureLevelForPlayer,
  upgradeMegastructureTierForPlayer,
  setMegastructureOperationalState,
} from "./services/megastructureService";

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const getUserId = (req: Request): string => req.session.userId || "";

export function registerMegastructureRoutes(app: any) {
  app.get("/api/megastructures/templates", async (_req: Request, res: Response) => {
    try {
      const catalog = await getMegastructureTemplateCatalog();
      res.json({ categories: catalog });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load megastructure templates" });
    }
  });

  app.get("/api/megastructures/player", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const structures = await storage.getPlayerMegaStructures(userId);
      res.json({ structures });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load player megastructures" });
    }
  });

  app.post("/api/megastructures/construct", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { templateId, name, level, tier, coordinates } = req.body || {};

      if (!templateId || typeof templateId !== "string") {
        return res.status(400).json({ message: "templateId is required" });
      }

      const result = await constructMegastructureForPlayer(userId, {
        templateId,
        name,
        level,
        tier,
        coordinates,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to construct megastructure" });
    }
  });

  app.post("/api/megastructures/:id/upgrade-level", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const structureId = req.params.id;
      const levels = Number(req.body?.levels ?? 1);

      const result = await upgradeMegastructureLevelForPlayer(userId, structureId, levels);
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to upgrade megastructure level" });
    }
  });

  app.post("/api/megastructures/:id/upgrade-tier", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const structureId = req.params.id;
      const tiers = Number(req.body?.tiers ?? 1);

      const result = await upgradeMegastructureTierForPlayer(userId, structureId, tiers);
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to upgrade megastructure tier" });
    }
  });

  app.post("/api/megastructures/:id/operational", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const structureId = req.params.id;
      const isOperational = Boolean(req.body?.isOperational);

      const updated = await setMegastructureOperationalState(userId, structureId, isOperational);
      res.json({ success: true, structure: updated });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to update operational state" });
    }
  });
}
