import type { Express, Request, Response } from "express";
import {
  DEFCON_LEVELS,
  RACES,
  TECHNOLOGY_TYPES,
  TRAINING_TYPES,
  executeRaid,
  executeRecon,
  executeSabotage,
  getArmory,
  getAscensionStatus,
  manageArmory,
  getStargateState,
  processStrategicTurns,
  selectRace,
  setDefcon,
  trainPersonnel,
  transferBank,
  upgradeCovertLevel,
  upgradeTechnology,
  upgradeUnitProduction,
  type DefConLevel,
  type StargateRace,
  type TechnologyType,
  type TrainingType,
} from "./services/stargateWarsService";

const ARMORY_ACTIONS = ["buy", "sell", "equip", "unequip", "repair", "scrap"] as const;
type ArmoryAction = (typeof ARMORY_ACTIONS)[number];

function isAuthenticated(req: Request, res: Response, next: () => void) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

function currentUserId(req: Request): string {
  const userId = req.session?.userId;
  if (!userId) throw new Error("Authentication required");
  return userId;
}

function requestError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "Strategic action failed";
  return res.status(message === "Authentication required" ? 401 : 400).json({ error: message });
}

export function registerStargateWarsRoutes(app: Express) {
  app.get("/api/stargate/state", isAuthenticated, async (req, res) => {
    try {
      return res.json(await getStargateState(currentUserId(req)));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/tick", isAuthenticated, async (req, res) => {
    try {
      return res.json(await processStrategicTurns(currentUserId(req)));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/race", isAuthenticated, async (req, res) => {
    try {
      const race = String(req.body?.race || "").toLowerCase();
      if (!RACES.includes(race as StargateRace)) return res.status(400).json({ error: "Choose Asgard, Goa'uld, Replicator, or Tau'ri." });
      return res.json(await selectRace(currentUserId(req), race as StargateRace));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/train", isAuthenticated, async (req, res) => {
    try {
      const type = String(req.body?.type || "");
      const quantity = Number(req.body?.quantity);
      if (!TRAINING_TYPES.includes(type as TrainingType)) return res.status(400).json({ error: "Unsupported training type" });
      if (!Number.isFinite(quantity) || quantity < 1) return res.status(400).json({ error: "Quantity must be at least one" });
      return res.json(await trainPersonnel(currentUserId(req), type as TrainingType, quantity));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/unit-production", isAuthenticated, async (req, res) => {
    try {
      return res.json(await upgradeUnitProduction(currentUserId(req)));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/technology", isAuthenticated, async (req, res) => {
    try {
      const technology = String(req.body?.technology || "");
      if (!TECHNOLOGY_TYPES.includes(technology as TechnologyType)) return res.status(400).json({ error: "Unsupported technology track" });
      return res.json(await upgradeTechnology(currentUserId(req), technology as TechnologyType));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/defcon", isAuthenticated, async (req, res) => {
    try {
      const defcon = String(req.body?.defcon || "").toLowerCase();
      if (!DEFCON_LEVELS.includes(defcon as DefConLevel)) return res.status(400).json({ error: "Unsupported DefCon level" });
      return res.json(await setDefcon(currentUserId(req), defcon as DefConLevel));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/bank", isAuthenticated, async (req, res) => {
    try {
      const direction = req.body?.direction;
      const amount = Number(req.body?.amount);
      if (direction !== "deposit" && direction !== "withdraw") return res.status(400).json({ error: "Bank direction must be deposit or withdraw" });
      if (!Number.isFinite(amount) || amount < 1) return res.status(400).json({ error: "Amount must be at least one" });
      return res.json(await transferBank(currentUserId(req), direction, amount));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.get("/api/stargate/armory", isAuthenticated, async (req, res) => {
    try {
      return res.json(await getArmory(currentUserId(req)));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/armory", isAuthenticated, async (req, res) => {
    try {
      const action = String(req.body?.action || "");
      const weaponId = String(req.body?.weaponId || "");
      const quantity = Number(req.body?.quantity);
      if (!ARMORY_ACTIONS.includes(action as ArmoryAction)) return res.status(400).json({ error: "Unsupported armory action" });
      if (!weaponId) return res.status(400).json({ error: "An armory item is required" });
      if (!Number.isFinite(quantity) || quantity < 1) return res.status(400).json({ error: "Quantity must be at least one" });
      return res.json(await manageArmory(currentUserId(req), action as ArmoryAction, weaponId, quantity));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/intelligence-level", isAuthenticated, async (req, res) => {
    try {
      const type = req.body?.type;
      if (type !== "spy" && type !== "antiSpy") return res.status(400).json({ error: "Choose spy or antiSpy" });
      return res.json(await upgradeCovertLevel(currentUserId(req), type));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/sabotage", isAuthenticated, async (req, res) => {
    try {
      const targetUserId = String(req.body?.targetUserId || "");
      if (!targetUserId) return res.status(400).json({ error: "A target realm is required" });
      return res.json(await executeSabotage(currentUserId(req), targetUserId));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.get("/api/stargate/ascension", isAuthenticated, async (req, res) => {
    try {
      return res.json(await getAscensionStatus(currentUserId(req)));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/raid", isAuthenticated, async (req, res) => {
    try {
      const targetUserId = String(req.body?.targetUserId || "");
      const turns = Number(req.body?.turns);
      if (!targetUserId) return res.status(400).json({ error: "A target realm is required" });
      if (!Number.isFinite(turns) || turns < 1) return res.status(400).json({ error: "Spend at least one attack turn" });
      return res.json(await executeRaid(currentUserId(req), targetUserId, turns));
    } catch (error) {
      return requestError(res, error);
    }
  });

  app.post("/api/stargate/recon", isAuthenticated, async (req, res) => {
    try {
      const targetUserId = String(req.body?.targetUserId || "");
      if (!targetUserId) return res.status(400).json({ error: "A target realm is required" });
      return res.json(await executeRecon(currentUserId(req), targetUserId));
    } catch (error) {
      return requestError(res, error);
    }
  });
}
