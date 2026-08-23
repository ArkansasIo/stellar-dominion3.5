import type { Express, Request, Response } from "express";
import { getStargateModule } from "./services/stargate/moduleRegistry";
import { getStargateSystemsOverview } from "./services/stargate/systemOverviewService";

function isAuthenticated(req: Request, res: Response, next: () => void) {
  if (!req.session?.userId) return res.status(401).json({ error: "Authentication required" });
  next();
}

export function registerStargateSystemsRoutes(app: Express) {
  app.get("/api/stargate/systems", isAuthenticated, (_req, res) => {
    res.json(getStargateSystemsOverview());
  });

  app.get("/api/stargate/systems/:moduleId", isAuthenticated, (req, res) => {
    try {
      res.json({ module: getStargateModule(req.params.moduleId) });
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : "System module not found" });
    }
  });
}
