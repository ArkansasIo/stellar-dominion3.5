import type { Express, Request, Response } from "express";
import { buyMothership, claimExploration, getMothershipState, startExploration, startStrategicMission, upgradeMothership, type MothershipModule } from "./services/stargate/mothershipService";
import { collectWorldYields, fortifyWorld, getWorldState, renameWorld, repairWorld, specializeWorld, upgradeWorldBonus, upgradeWorldDevelopment, upgradeWorldMoon, type WorldBonus, type WorldSpecialization } from "./services/stargate/planetService";
import { isMissionType, type MissionType } from "./services/stargate/worldOperationsService";

function isAuthenticated(req: Request, res: Response, next: () => void) {
  if (!req.session?.userId) return res.status(401).json({ error: "Authentication required" });
  next();
}
function currentUserId(req: Request) {
  if (!req.session?.userId) throw new Error("Authentication required");
  return req.session.userId;
}
function respondError(res: Response, error: unknown) {
  return res.status(error instanceof Error && error.message === "Authentication required" ? 401 : 400).json({ error: error instanceof Error ? error.message : "World action failed" });
}
const isModule = (value: unknown): value is MothershipModule => value === "capacity" || value === "weapons" || value === "shields" || value === "hangars";
const isBonus = (value: unknown): value is WorldBonus => value === "attack" || value === "defense" || value === "covert" || value === "unitProduction" || value === "income";
const isSpecialization = (value: unknown): value is WorldSpecialization => value === "frontier" || value === "mining" || value === "agri" || value === "military";

export function registerStargateWorldRoutes(app: Express) {
  app.get("/api/stargate/mothership", isAuthenticated, async (req, res) => { try { res.json(await getMothershipState(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/buy", isAuthenticated, async (req, res) => { try { res.json(await buyMothership(currentUserId(req), typeof req.body?.name === "string" ? req.body.name : undefined)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/upgrade", isAuthenticated, async (req, res) => { try { if (!isModule(req.body?.module)) return res.status(400).json({ error: "Choose a supported mothership module" }); res.json(await upgradeMothership(currentUserId(req), req.body.module)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/explore", isAuthenticated, async (req, res) => { try { res.json(await startExploration(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/mission", isAuthenticated, async (req, res) => { try { const missionType = req.body?.missionType; if (!isMissionType(missionType)) return res.status(400).json({ error: "Choose a supported strategic mission" }); res.json(await startStrategicMission(currentUserId(req), missionType as MissionType)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/mothership/claim", isAuthenticated, async (req, res) => { try { res.json(await claimExploration(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.get("/api/stargate/worlds", isAuthenticated, async (req, res) => { try { res.json(await getWorldState(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/collect", isAuthenticated, async (req, res) => { try { res.json(await collectWorldYields(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/bonus", isAuthenticated, async (req, res) => { try { if (!isBonus(req.body?.bonus)) return res.status(400).json({ error: "Choose a supported world bonus" }); res.json(await upgradeWorldBonus(currentUserId(req), String(req.body?.worldId || ""), req.body.bonus)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/develop", isAuthenticated, async (req, res) => { try { res.json(await upgradeWorldDevelopment(currentUserId(req), String(req.body?.worldId || ""))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/moons/develop", isAuthenticated, async (req, res) => { try { res.json(await upgradeWorldMoon(currentUserId(req), String(req.body?.worldId || ""), String(req.body?.moonId || ""))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/specialize", isAuthenticated, async (req, res) => { try { if (!isSpecialization(req.body?.specialization)) return res.status(400).json({ error: "Choose a supported world specialization" }); res.json(await specializeWorld(currentUserId(req), String(req.body?.worldId || ""), req.body.specialization)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/fortify", isAuthenticated, async (req, res) => { try { res.json(await fortifyWorld(currentUserId(req), String(req.body?.worldId || ""), Number(req.body?.quantity))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/repair", isAuthenticated, async (req, res) => { try { res.json(await repairWorld(currentUserId(req), String(req.body?.worldId || ""))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/worlds/rename", isAuthenticated, async (req, res) => { try { res.json(await renameWorld(currentUserId(req), String(req.body?.worldId || ""), String(req.body?.name || ""))); } catch (error) { respondError(res, error); } });
}
