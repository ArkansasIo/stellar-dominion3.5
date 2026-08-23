import type { Express, Request, Response } from "express";
import { cancelMarketOffer, createMarketOffer, exchangeMarketUnits, getMarketState, purchaseMarketOffer, recruitMercenaries, type StrategicMarketItem } from "./services/stargate/marketService";

function isAuthenticated(req: Request, res: Response, next: () => void) { if (!req.session?.userId) return res.status(401).json({ error: "Authentication required" }); next(); }
function currentUserId(req: Request) { if (!req.session?.userId) throw new Error("Authentication required"); return req.session.userId; }
function respondError(res: Response, error: unknown) { return res.status(error instanceof Error && error.message === "Authentication required" ? 401 : 400).json({ error: error instanceof Error ? error.message : "Market action failed" }); }
const isItem = (value: unknown): value is StrategicMarketItem => value === "untrained" || value === "attackTroop" || value === "defenseTroop";

export function registerStargateMarketRoutes(app: Express) {
  app.get("/api/stargate/market", isAuthenticated, async (req, res) => { try { res.json(await getMarketState(currentUserId(req))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/market/exchange", isAuthenticated, async (req, res) => { try { if (!isItem(req.body?.item)) return res.status(400).json({ error: "Choose a supported exchange item" }); res.json(await exchangeMarketUnits(currentUserId(req), req.body.item, Number(req.body?.quantity))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/market/offer", isAuthenticated, async (req, res) => { try { if (!isItem(req.body?.item)) return res.status(400).json({ error: "Choose a supported market item" }); res.json(await createMarketOffer(currentUserId(req), req.body.item, Number(req.body?.quantity), Number(req.body?.pricePerUnit))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/market/cancel", isAuthenticated, async (req, res) => { try { res.json(await cancelMarketOffer(currentUserId(req), String(req.body?.offerId || ""))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/market/purchase", isAuthenticated, async (req, res) => { try { res.json(await purchaseMarketOffer(currentUserId(req), String(req.body?.offerId || ""), Number(req.body?.quantity))); } catch (error) { respondError(res, error); } });
  app.post("/api/stargate/market/mercenaries", isAuthenticated, async (req, res) => { try { const type = req.body?.type; if (type !== "attackTroop" && type !== "defenseTroop") return res.status(400).json({ error: "Choose attackTroop or defenseTroop" }); res.json(await recruitMercenaries(currentUserId(req), type, Number(req.body?.quantity))); } catch (error) { respondError(res, error); } });
}
