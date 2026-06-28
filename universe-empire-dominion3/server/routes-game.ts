
import { type Express, type Request, type Response } from "express";
import { gameEngine } from "./gameEngine";
import { isAuthenticated } from "./basicAuth";

export function registerGameRoutes(app: Express) {
  app.get("/api/game/resources", isAuthenticated, (req: Request, res: Response) => {
    res.json(gameEngine.getResources());
  });

  app.get("/api/game/fleet", isAuthenticated, (req: Request, res: Response) => {
    res.json(gameEngine.getFleet());
  });

  app.get("/api/game/technology", isAuthenticated, (req: Request, res: Response) => {
    res.json(gameEngine.getTechnologyTree());
  });
}
