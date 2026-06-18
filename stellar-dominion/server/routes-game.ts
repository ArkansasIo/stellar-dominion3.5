
import { type Express, type Request, type Response } from "express";
import { gameEngine } from "./gameEngine";

export function registerGameRoutes(app: Express) {
  app.get("/api/game/resources", (req: Request, res: Response) => {
    res.json(gameEngine.getResources());
  });

  app.get("/api/game/fleet", (req: Request, res: Response) => {
    res.json(gameEngine.getFleet());
  });

  app.get("/api/game/technology", (req: Request, res: Response) => {
    res.json(gameEngine.getTechnologyTree());
  });
}
