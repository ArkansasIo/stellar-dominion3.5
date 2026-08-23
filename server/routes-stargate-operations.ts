import type { Express, Request, Response } from "express";
import { getEventState } from "./services/stargate/eventService";
import { getProtectionState, setVacationMode } from "./services/stargate/protectionService";

function isAuthenticated(req: Request, res: Response, next: () => void) { if (!req.session?.userId) return res.status(401).json({ error: "Authentication required" }); next(); }
function currentUserId(req: Request) { if (!req.session?.userId) throw new Error("Authentication required"); return req.session.userId; }
function respondError(res: Response, error: unknown) { return res.status(error instanceof Error && error.message === "Authentication required" ? 401 : 400).json({ error: error instanceof Error ? error.message : "Operations action failed" }); }

export function registerStargateOperationsRoutes(app: Express) {
  app.get("/api/stargate/operations", isAuthenticated, async (req, res) => { try { res.json({ protection: await getProtectionState(currentUserId(req)), events: await getEventState(currentUserId(req)) }); } catch (error) { respondError(res, error); } });
  app.get("/api/stargate/protection", isAuthenticated, async (req, res) => { try { res.json(await getProtectionState(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/protection/vacation", isAuthenticated, async (req, res) => { try { res.json(await setVacationMode(currentUserId(req), Boolean(req.body?.enabled))); } catch (error) { respondError(res, error); } });
  app.get("/api/stargate/events", isAuthenticated, async (req, res) => { try { res.json(await getEventState(currentUserId(req))); } catch (error) { respondError(res, error); } });
}
