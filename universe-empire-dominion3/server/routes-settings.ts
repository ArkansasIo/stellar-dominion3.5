import type { Express, Request } from "express";
import { storage } from "./storage";
import { isAuthenticated, isAdmin } from "./basicAuth";

const PLAYER_OPTIONS_PREFIX = "player_options";
const PLAYER_GAMEPLAY_PREFIX = "player_gameplay";
const PLAYER_ACCESSIBILITY_PREFIX = "player_accessibility";
const PLAYER_DATA_PREFIX = "player_data";

const DEFAULT_PLAYER_OPTIONS = {
  notifications: {
    attackAlerts: true,
    buildComplete: true,
    researchComplete: true,
    fleetArrival: true,
    messages: true,
    allianceActivity: false,
    browserNotifications: true,
    emailNotifications: false,
    expeditionAlerts: true,
    raidAlerts: true,
    tradeAlerts: true,
    guildAlerts: true,
    bossAlerts: true,
    weeklyMissionAlerts: true,
    durabilityWarnings: true,
  },
  display: {
    darkMode: true,
    themePreset: "black-style",
    compactView: false,
    showAnimations: true,
    showResourceRates: true,
    language: "en",
    timeFormat: "24h",
    numberFormat: "comma",
    deviceProfile: "auto",
    mobileOptimized: true,
    touchControls: true,
    touchTargetSize: "comfortable",
    browserWidth: "standard",
    stickyMobileBars: true,
    fontSize: "medium",
    colorBlindMode: "none",
    reduceMotion: false,
    highContrast: false,
    sidebarPosition: "left",
    showTooltips: true,
    dashboardLayout: "default",
  },
  sound: {
    enabled: true,
    volume: 50,
    alertSounds: true,
    ambientSounds: false,
    musicVolume: 40,
    sfxVolume: 60,
    voiceVolume: 70,
    muteOnBlur: true,
  },
  gameplay: {
    autoUseTurns: false,
    turnsPerAction: 1,
    autoCollectResources: true,
    confirmFleetSend: true,
    confirmAttack: true,
    defaultFleetSpeed: "fast",
    autoRepairEquipment: false,
    autoRepairThreshold: 50,
    showDamageNumbers: true,
    showResourcePopups: true,
    combatLogVerbosity: "detailed",
    galaxyMapStyle: "standard",
    defaultGalaxyView: "system",
    showPlayerCoordinates: true,
    autoExpireOrders: true,
    orderExpiryDays: 7,
    preferredTradeResource: "metal",
    showMarketGraphs: true,
    defaultSortOrder: "power",
    enableQuickActions: true,
    enableSwipeActions: true,
    autoBookmarkPlanets: false,
    showFlightTimes: true,
    showResourceRatesOnPlanet: true,
    enableFleetPresets: true,
  },
  privacy: {
    hideOnlineStatus: false,
    blockStrangers: false,
    showLastOnline: true,
    showEmpireLevel: true,
    showAllianceTag: true,
    allowSpectators: true,
    hideFromLeaderboard: false,
    showBattleReports: "everyone",
    profileVisibility: "alliance",
    showPlayTime: true,
    showAchievementProgress: false,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium",
    colorBlindMode: "none",
    screenReaderMode: false,
    keyboardNavigation: true,
    focusIndicators: true,
    announceNotifications: true,
    pauseAnimationsOnHover: false,
    simplifyTransitions: false,
  },
  data: {
    autoSaveInterval: 30,
    enableCloudSync: true,
    exportFormat: "json",
    compressionEnabled: true,
    lastExportDate: null,
    storageUsed: 0,
  },
};

function getPlayerOptionsKey(userId: string) {
  return `${PLAYER_OPTIONS_PREFIX}:${userId}`;
}

function getPlayerGameplayKey(userId: string) {
  return `${PLAYER_GAMEPLAY_PREFIX}:${userId}`;
}

function getPlayerAccessibilityKey(userId: string) {
  return `${PLAYER_ACCESSIBILITY_PREFIX}:${userId}`;
}

function getPlayerDataKey(userId: string) {
  return `${PLAYER_DATA_PREFIX}:${userId}`;
}

function mergePlayerOptions(value: any) {
  const incomingPrivacy = value?.privacy || {};
  const incomingDisplay = value?.display || {};
  const normalizedThemePreset =
    incomingDisplay?.themePreset === "og-white" ||
    incomingDisplay?.themePreset === "black-style" ||
    incomingDisplay?.themePreset === "imperial-gold"
      ? incomingDisplay.themePreset
      : "black-style";
  const normalizedPrivacy = {
    hideOnlineStatus: Boolean(incomingPrivacy.hideOnlineStatus),
    blockStrangers: Boolean(incomingPrivacy.blockStrangers ?? incomingPrivacy.blockStrangerMessages),
    showLastOnline: incomingPrivacy.showLastOnline !== undefined ? Boolean(incomingPrivacy.showLastOnline) : true,
    showEmpireLevel: incomingPrivacy.showEmpireLevel !== undefined ? Boolean(incomingPrivacy.showEmpireLevel) : true,
    showAllianceTag: incomingPrivacy.showAllianceTag !== undefined ? Boolean(incomingPrivacy.showAllianceTag) : true,
    allowSpectators: incomingPrivacy.allowSpectators !== undefined ? Boolean(incomingPrivacy.allowSpectators) : true,
    hideFromLeaderboard: Boolean(incomingPrivacy.hideFromLeaderboard),
    showBattleReports: incomingPrivacy.showBattleReports || "everyone",
    profileVisibility: incomingPrivacy.profileVisibility || "alliance",
    showPlayTime: incomingPrivacy.showPlayTime !== undefined ? Boolean(incomingPrivacy.showPlayTime) : true,
    showAchievementProgress: Boolean(incomingPrivacy.showAchievementProgress),
  };

  return {
    notifications: { ...DEFAULT_PLAYER_OPTIONS.notifications, ...(value?.notifications || {}) },
    display: {
      ...DEFAULT_PLAYER_OPTIONS.display,
      ...incomingDisplay,
      darkMode: normalizedThemePreset !== "og-white",
      themePreset: normalizedThemePreset,
    },
    sound: { ...DEFAULT_PLAYER_OPTIONS.sound, ...(value?.sound || {}) },
    gameplay: { ...DEFAULT_PLAYER_OPTIONS.gameplay, ...(value?.gameplay || {}) },
    privacy: normalizedPrivacy,
    accessibility: { ...DEFAULT_PLAYER_OPTIONS.accessibility, ...(value?.accessibility || {}) },
    data: {
      ...DEFAULT_PLAYER_OPTIONS.data,
      ...(value?.data || {}),
      lastExportDate: value?.data?.lastExportDate || DEFAULT_PLAYER_OPTIONS.data.lastExportDate,
      storageUsed: value?.data?.storageUsed || DEFAULT_PLAYER_OPTIONS.data.storageUsed,
    },
  };
}

function getUserId(req: Request) {
  return req.session?.userId || "";
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
  app.post("/api/settings/:key", isAuthenticated, isAdmin, async (req: Request, res: any) => {
    try {
      const { value, description, category } = req.body;
      const setting = await storage.setSetting(req.params.key, value, description, category);
      res.json(setting);
    } catch (error: any) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Seed default settings (admin only, run once on startup)
  app.post("/api/settings/seed/defaults", isAuthenticated, isAdmin, async (req: Request, res: any) => {
    try {
      await storage.seedDefaultSettings();
      res.json({ message: "Default settings seeded successfully" });
    } catch (error: any) {
      console.error("Error seeding settings:", error);
      res.status(500).json({ message: "Failed to seed settings" });
    }
  });

  // ── Gameplay Settings ────────────────────────────────────────────
  app.get("/api/settings/player/gameplay", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const setting = await storage.getSetting(getPlayerGameplayKey(userId));
      res.json({ ...DEFAULT_PLAYER_OPTIONS.gameplay, ...(setting?.value || {}) });
    } catch (error: any) {
      console.error("Error fetching gameplay settings:", error);
      res.status(500).json({ message: "Failed to fetch gameplay settings" });
    }
  });

  app.put("/api/settings/player/gameplay", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const existing = await storage.getSetting(getPlayerGameplayKey(userId));
      const merged = { ...DEFAULT_PLAYER_OPTIONS.gameplay, ...(existing?.value || {}), ...(req.body || {}) };
      const setting = await storage.setSetting(getPlayerGameplayKey(userId), merged, "Per-player gameplay preferences", "player-state");
      res.json(setting.value);
    } catch (error: any) {
      console.error("Error saving gameplay settings:", error);
      res.status(500).json({ message: "Failed to save gameplay settings" });
    }
  });

  // ── Accessibility Settings ────────────────────────────────────────
  app.get("/api/settings/player/accessibility", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const setting = await storage.getSetting(getPlayerAccessibilityKey(userId));
      res.json({ ...DEFAULT_PLAYER_OPTIONS.accessibility, ...(setting?.value || {}) });
    } catch (error: any) {
      console.error("Error fetching accessibility settings:", error);
      res.status(500).json({ message: "Failed to fetch accessibility settings" });
    }
  });

  app.put("/api/settings/player/accessibility", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const existing = await storage.getSetting(getPlayerAccessibilityKey(userId));
      const merged = { ...DEFAULT_PLAYER_OPTIONS.accessibility, ...(existing?.value || {}), ...(req.body || {}) };
      const setting = await storage.setSetting(getPlayerAccessibilityKey(userId), merged, "Per-player accessibility preferences", "player-state");
      res.json(setting.value);
    } catch (error: any) {
      console.error("Error saving accessibility settings:", error);
      res.status(500).json({ message: "Failed to save accessibility settings" });
    }
  });

  // ── Data Management Settings ──────────────────────────────────────
  app.get("/api/settings/player/data", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const setting = await storage.getSetting(getPlayerDataKey(userId));
      res.json({ ...DEFAULT_PLAYER_OPTIONS.data, ...(setting?.value || {}) });
    } catch (error: any) {
      console.error("Error fetching data settings:", error);
      res.status(500).json({ message: "Failed to fetch data settings" });
    }
  });

  app.put("/api/settings/player/data", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const existing = await storage.getSetting(getPlayerDataKey(userId));
      const merged = { ...DEFAULT_PLAYER_OPTIONS.data, ...(existing?.value || {}), ...(req.body || {}) };
      const setting = await storage.setSetting(getPlayerDataKey(userId), merged, "Per-player data management preferences", "player-state");
      res.json(setting.value);
    } catch (error: any) {
      console.error("Error saving data settings:", error);
      res.status(500).json({ message: "Failed to save data settings" });
    }
  });

  app.post("/api/settings/player/export", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const setting = await storage.getSetting(getPlayerOptionsKey(userId));
      const gameplaySetting = await storage.getSetting(getPlayerGameplayKey(userId));
      const accessibilitySetting = await storage.getSetting(getPlayerAccessibilityKey(userId));
      const dataSetting = await storage.getSetting(getPlayerDataKey(userId));

      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        notifications: setting?.value?.notifications || DEFAULT_PLAYER_OPTIONS.notifications,
        display: setting?.value?.display || DEFAULT_PLAYER_OPTIONS.display,
        sound: setting?.value?.sound || DEFAULT_PLAYER_OPTIONS.sound,
        privacy: setting?.value?.privacy || DEFAULT_PLAYER_OPTIONS.privacy,
        gameplay: gameplaySetting?.value || DEFAULT_PLAYER_OPTIONS.gameplay,
        accessibility: accessibilitySetting?.value || DEFAULT_PLAYER_OPTIONS.accessibility,
        data: dataSetting?.value || DEFAULT_PLAYER_OPTIONS.data,
      };

      await storage.setSetting(getPlayerDataKey(userId), {
        ...DEFAULT_PLAYER_OPTIONS.data,
        ...(dataSetting?.value || {}),
        lastExportDate: new Date().toISOString(),
      }, "Player data export metadata", "player-state");

      res.json(exportData);
    } catch (error: any) {
      console.error("Error exporting settings:", error);
      res.status(500).json({ message: "Failed to export settings" });
    }
  });

  app.post("/api/settings/player/import", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const importData = req.body;
      if (!importData || typeof importData !== "object") {
        return res.status(400).json({ message: "Invalid import data" });
      }

      if (importData.notifications || importData.display || importData.sound || importData.privacy) {
        const existing = await storage.getSetting(getPlayerOptionsKey(userId));
        const merged = mergePlayerOptions({ ...(existing?.value || {}), ...importData });
        await storage.setSetting(getPlayerOptionsKey(userId), merged, "Imported player options", "player-state");
      }

      if (importData.gameplay) {
        const existing = await storage.getSetting(getPlayerGameplayKey(userId));
        await storage.setSetting(getPlayerGameplayKey(userId), { ...DEFAULT_PLAYER_OPTIONS.gameplay, ...(existing?.value || {}), ...importData.gameplay }, "Imported gameplay settings", "player-state");
      }

      if (importData.accessibility) {
        const existing = await storage.getSetting(getPlayerAccessibilityKey(userId));
        await storage.setSetting(getPlayerAccessibilityKey(userId), { ...DEFAULT_PLAYER_OPTIONS.accessibility, ...(existing?.value || {}), ...importData.accessibility }, "Imported accessibility settings", "player-state");
      }

      res.json({ success: true, message: "Settings imported successfully" });
    } catch (error: any) {
      console.error("Error importing settings:", error);
      res.status(500).json({ message: "Failed to import settings" });
    }
  });
}
