import type { Express, Request } from "express";
import { storage } from "./storage";
import { isAuthenticated } from "./basicAuth";

const PLAYER_OPTIONS_PREFIX = "player_options";

const DEFAULT_PLAYER_OPTIONS = {
  notifications: {
    attackAlerts: true,
    buildComplete: true,
    researchComplete: true,
    fleetArrival: true,
    messages: true,
    allianceActivity: false,
  },
  display: {
    darkMode: false,
    compactView: false,
    showAnimations: true,
    showResourceRates: true,
    language: "en",
    timeFormat: "24h",
    numberFormat: "comma",
  },
  sound: {
    enabled: true,
    volume: 50,
    alertSounds: true,
    ambientSounds: false,
  },
  privacy: {
    hideOnlineStatus: false,
    blockStrangers: false,
  },
};

function getPlayerOptionsKey(userId: string) {
  return `${PLAYER_OPTIONS_PREFIX}:${userId}`;
}

function mergePlayerOptions(value: any) {
  const incomingPrivacy = value?.privacy || {};
  const normalizedPrivacy = {
    hideOnlineStatus: Boolean(incomingPrivacy.hideOnlineStatus),
    blockStrangers: Boolean(incomingPrivacy.blockStrangers ?? incomingPrivacy.blockStrangerMessages),
  };

  return {
    notifications: { ...DEFAULT_PLAYER_OPTIONS.notifications, ...(value?.notifications || {}) },
    display: { ...DEFAULT_PLAYER_OPTIONS.display, ...(value?.display || {}) },
    sound: { ...DEFAULT_PLAYER_OPTIONS.sound, ...(value?.sound || {}) },
    privacy: { ...DEFAULT_PLAYER_OPTIONS.privacy, ...normalizedPrivacy },
  };
}

function getUserId(req: Request) {
  return (req.session as any)?.userId || "";
}

export function registerSettingsRoutes(app: Express) {
  app.get("/api/settings/player/options", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const setting = await storage.getSetting(getPlayerOptionsKey(userId));
      res.json(mergePlayerOptions(setting?.value));
    } catch (error: any) {
      console.error("Error fetching player options:", error);
      res.status(500).json({ message: "Failed to fetch player options" });
    }
  });

  app.put("/api/settings/player/options", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const existing = await storage.getSetting(getPlayerOptionsKey(userId));
      const merged = mergePlayerOptions({ ...(existing?.value || {}), ...(req.body || {}) });
      const setting = await storage.setSetting(
        getPlayerOptionsKey(userId),
        merged,
        "Per-player options menu preferences",
        "player-state"
      );
      res.json(mergePlayerOptions(setting.value));
    } catch (error: any) {
      console.error("Error saving player options:", error);
      res.status(500).json({ message: "Failed to save player options" });
    }
  });

  // Get all system settings
  app.get("/api/settings", isAuthenticated, async (req: Request, res: any) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Get specific setting
  app.get("/api/settings/:key", isAuthenticated, async (req: Request, res: any) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error: any) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  // Update setting (admin only)
  app.post("/api/settings/:key", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if user is admin (basic check - you might want to add proper admin role checking)
      if (user.username !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { value, description, category } = req.body;
      const setting = await storage.setSetting(req.params.key, value, description, category);
      res.json(setting);
    } catch (error: any) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Seed default settings (admin only, run once on startup)
  app.post("/api/settings/seed/defaults", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user || user.username !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.seedDefaultSettings();
      res.json({ message: "Default settings seeded successfully" });
    } catch (error: any) {
      console.error("Error seeding settings:", error);
      res.status(500).json({ message: "Failed to seed settings" });
    }
  });
}
