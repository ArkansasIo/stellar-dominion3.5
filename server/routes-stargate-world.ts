import type { Express, Request, Response } from "express";
import { buyMothership, claimExploration, getMothershipState, startExploration, upgradeMothership, type MothershipModule } from "./services/stargate/mothershipService";
import { fortifyWorld, getWorldState, renameWorld, repairWorld, upgradeWorldBonus, type WorldBonus } from "./services/stargate/planetService";

function isAuthenticated(req: Request, res: Response, next: () => void) { if (!req.session?.userId) return res.status(401).json({ error: "Authentication required" }); next(); }
function currentUserId(req: Request) { if (!req.session?.userId) throw new Error("Authentication required"); return req.session.userId; }
function respondError(res: Response, error: unknown) { return res.status(error instanceof Error && error.message === "Authentication required" ? 401 : 400).json({ error: error instanceof Error ? error.message : "World action failed" }); }
const isModule = (value: unknown): value is MothershipModule => value === "capacity" || value === "weapons" || value === "shields" || value === "hangars";
const isBonus = (value: unknown): value is WorldBonus => value === "attack" || value === "defense" || value === "covert" || value === "unitProduction" || value === "income";

export function registerStargateWorldRoutes(app: Express) {
  app.get("/api/stargate/mothership", isAuthenticated, async (req, res) => { try { res.json(await getMothershipState(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/buy", isAuthenticated, async (req, res) => { try { res.json(await buyMothership(currentUserId(req), typeof req.body?.name === "string" ? req.body.name : undefined)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/upgrade", isAuthenticated, async (req, res) => { try { if (!isModule(req.body?.module)) return res.status(400).json({ error: "Choose a supported mothership module" }); res.json(await upgradeMothership(currentUserId(req), req.body.module)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/explore", isAuthenticated, async (req, res) => { try { res.json(await startExploration(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/claim", isAuthenticated, async (req, res) => { try { res.json(await claimExploration(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.get("/api/stargate/worlds", isAuthenticated, async (req, res) => { try { res.json(await getWorldState(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/bonus", isAuthenticated, async (req, res) => { try { if (!isBonus(req.body?.bonus)) return res.status(400).json({ error: "Choose a supported world bonus" }); res.json(await upgradeWorldBonus(currentUserId(req), String(req.body?.worldId || ""), req.body.bonus)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/fortify", isAuthenticated, async (req, res) => { try { res.json(await fortifyWorld(currentUserId(req), String(req.body?.worldId || ""), Number(req.body?.quantity))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/repair", isAuthenticated, async (req, res) => { try { res.json(await repairWorld(currentUserId(req), String(req.body?.worldId || ""))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/rename", isAuthenticated, async (req, res) => { try { res.json(await renameWorld(currentUserId(req), String(req.body?.worldId || ""), String(req.body?.name || ""))); } catch (error) { respondError(res, error); } });
}
