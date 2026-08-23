import type { Express, Request, Response } from "express";
import { dismissOfficer, getCommanderState, recruitOfficer, updateCommanderProfile, type OfficerRole } from "./services/stargate/commanderService";
import { applyToAlliance, approveAllianceApplication, createAlliance, getAllianceState, leaveAlliance, setAllianceNotice } from "./services/stargate/allianceService";

function isAuthenticated(req: Request, res: Response, next: () => void) { if (!req.session?.userId) return res.status(401).json({ error: "Authentication required" }); next(); }
function currentUserId(req: Request) { if (!req.session?.userId) throw new Error("Authentication required"); return req.session.userId; }
function respondError(res: Response, error: unknown) { return res.status(error instanceof Error && error.message === "Authentication required" ? 401 : 400).json({ error: error instanceof Error ? error.message : "Social action failed" }); }
const isRole = (value: unknown): value is OfficerRole => value === "income" || value === "offense" || value === "defense" || value === "covert";

export function registerStargateSocialRoutes(app: Express) {
  app.get("/api/stargate/commander", isAuthenticated, async (req, res) => { try { res.json(await getCommanderState(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/commander/profile", isAuthenticated, async (req, res) => { try { res.json(await updateCommanderProfile(currentUserId(req), String(req.body?.name || ""), Number(req.body?.incomeShare))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/commander/officers", isAuthenticated, async (req, res) => { try { if (!isRole(req.body?.role)) return res.status(400).json({ error: "Choose a supported officer role" }); res.json(await recruitOfficer(currentUserId(req), req.body.role)); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/commander/officers/dismiss", isAuthenticated, async (req, res) => { try { res.json(await dismissOfficer(currentUserId(req), String(req.body?.officerId || ""))); } catch (error) { respondError(res, error); } });
  app.get("/api/stargate/alliances", isAuthenticated, async (req, res) => { try { res.json(await getAllianceState(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/alliances", isAuthenticated, async (req, res) => { try { res.json(await createAlliance(currentUserId(req), String(req.body?.name || ""), String(req.body?.tag || ""))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/alliances/apply", isAuthenticated, async (req, res) => { try { res.json(await applyToAlliance(currentUserId(req), String(req.body?.leaderId || ""))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/alliances/approve", isAuthenticated, async (req, res) => { try { res.json(await approveAllianceApplication(currentUserId(req), String(req.body?.applicantId || ""))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/alliances/leave", isAuthenticated, async (req, res) => { try { res.json(await leaveAlliance(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/alliances/notice", isAuthenticated, async (req, res) => { try { res.json(await setAllianceNotice(currentUserId(req), String(req.body?.notice || ""))); } catch (error) { respondError(res, error); } });
}
