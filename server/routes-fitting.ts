import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import type { ShipModule } from "../shared/config/shipFittingConfig";

let SHIP_FITTING_MODULES: Record<string, ShipModule> = {};

async function ensureModulesLoaded() {
  if (Object.keys(SHIP_FITTING_MODULES).length > 0) return;
  try {
    const mod = await import("../client/src/lib/shipFittingModules");
    SHIP_FITTING_MODULES = mod.SHIP_FITTING_MODULES || {};
  } catch {
    console.warn("Ship fitting modules not available from client lib, using fallback data");
    SHIP_FITTING_MODULES = getFallbackModules();
  }
}

function getModuleById(id: string): ShipModule | undefined {
  return SHIP_FITTING_MODULES[id];
}

export function registerFittingRoutes(app: Express) {

  app.get("/api/fitting/modules", async (_req: Request, res: Response) => {
    try {
      await ensureModulesLoaded();
      res.json(SHIP_FITTING_MODULES);
    } catch (error) {
      console.error("Error fetching fitting modules:", error);
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });

  app.get("/api/fitting/ship/:shipId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const shipId = req.params.shipId;

      const playerState = await storage.getPlayerState(userId);
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const shipFittings = (playerState.shipFittings as Record<string, any>) || {};
      const fitting = shipFittings[shipId] || null;

      const shipData = getShipHullData(shipId);
      if (!shipData && !fitting) {
        return res.status(404).json({ error: "Ship not found" });
      }

      const slots = shipData?.slots || { high: 0, mid: 0, low: 0, rig: 0 };
      const cpu = { total: shipData?.cpu || 0, used: 0 };
      const powergrid = { total: shipData?.powergrid || 0, used: 0 };
      const calibration = { total: shipData?.calibration || 0, used: 0 };
      const fittedModules: Record<string, Record<string, string>> = fitting?.modules || {};

      for (const slotType of Object.keys(fittedModules)) {
        for (const slotIndex of Object.keys(fittedModules[slotType])) {
          const moduleId = fittedModules[slotType][slotIndex];
          const mod = getModuleById(moduleId);
          if (mod) {
            cpu.used += mod.cpu || 0;
            powergrid.used += mod.powergrid || 0;
            if (slotType === "rig") {
              calibration.used += mod.calibration || 0;
            }
          }
        }
      }

      res.json({
        shipId,
        name: shipData?.name || fitting?.name || shipId,
        size: shipData?.size || "medium",
        slots,
        cpu,
        powergrid,
        calibration,
        fitted_modules: fittedModules,
      });
    } catch (error) {
      console.error("Error fetching ship fitting:", error);
      res.status(500).json({ error: "Failed to fetch ship fitting" });
    }
  });

  app.post("/api/fitting/fit", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { shipId, modules } = req.body;
      if (!shipId || !modules) {
        return res.status(400).json({ error: "Missing required fields: shipId, modules" });
      }

      const playerState = await storage.getPlayerState(userId);
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const shipFittings = (playerState.shipFittings as Record<string, any>) || {};
      const shipData = getShipHullData(shipId);

      shipFittings[shipId] = {
        name: shipData?.name || shipId,
        modules,
        updatedAt: new Date().toISOString(),
      };

      await storage.updatePlayerState(userId, {
        shipFittings: shipFittings as any,
      });

      res.json({ success: true, shipId });
    } catch (error) {
      console.error("Error saving fitting:", error);
      res.status(500).json({ error: "Failed to save fitting" });
    }
  });
}

function getShipHullData(shipId: string): {
  name: string;
  size: string;
  slots: { high: number; mid: number; low: number; rig: number };
  cpu: number;
  powergrid: number;
  calibration: number;
} | null {
  const hulls: Record<string, any> = {
    "sf_002": {
      name: "Hornet Strike Fighter",
      size: "small",
      slots: { high: 3, mid: 2, low: 2, rig: 2 },
      cpu: 150,
      powergrid: 40,
      calibration: 100,
    },
    "cr_001": {
      name: "Viper Cruiser",
      size: "medium",
      slots: { high: 5, mid: 4, low: 4, rig: 3 },
      cpu: 350,
      powergrid: 200,
      calibration: 200,
    },
    "bs_001": {
      name: "Titan Battleship",
      size: "large",
      slots: { high: 8, mid: 6, low: 6, rig: 4 },
      cpu: 700,
      powergrid: 800,
      calibration: 400,
    },
  };

  return hulls[shipId] || null;
}

function getFallbackModules(): Record<string, ShipModule> {
  return {};
}
