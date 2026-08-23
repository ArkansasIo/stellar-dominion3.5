import type { Express, Request, Response } from "express";
import { executeAscension, getAscensionLifecycle, previewAscension } from "./services/stargate/ascensionService";
import { getRankings, type RankingCategory } from "./services/stargate/rankingService";

function isAuthenticated(req: Request, res: Response, next: () => void) { if (!req.session?.userId) return res.status(401).json({ error: "Authentication required" }); next(); }
function currentUserId(req: Request) { if (!req.session?.userId) throw new Error("Authentication required"); return req.session.userId; }
function respondError(res: Response, error: unknown) { return res.status(error instanceof Error && error.message === "Authentication required" ? 401 : 400).json({ error: error instanceof Error ? error.message : "Progression action failed" }); }
const isCategory = (value: unknown): value is RankingCategory => ["attack", "defense", "covert", "mothership", "overall", "race", "alliance", "glory", "reputation"].includes(String(value));

export function registerStargateProgressionRoutes(app: Express) {
  app.get("/api/stargate/rankings", isAuthenticated, async (req, res) => { try { const category = isCategory(req.query.category) ? req.query.category : "overall"; res.json(await getRankings(currentUserId(req), category)); } catch (error) { respondError(res, error); } });
  app.get("/api/stargate/ascension/lifecycle", isAuthenticated, async (req, res) => { try { res.json(await getAscensionLifecycle(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/ascension/preview", isAuthenticated, async (req, res) => { try { res.json(await previewAscension(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/ascension/execute", isAuthenticated, async (req, res) => { try { res.json(await executeAscension(currentUserId(req))); } catch (error) { respondError(res, error); } });
}
