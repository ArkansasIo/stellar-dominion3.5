import { Router, type Request, type Response, type NextFunction } from "express";
import { storage } from "../storage";
import { logger } from "../logger";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export enum ModHooks {
  ROUTE = 'route',
  ROUTE_ADMIN = 'route_admin',
  QUEUE = 'queue',
  RESOURCES = 'resources',
  BONUSES = 'bonuses',
  MENU_ITEMS = 'menu_items',
  PRODUCTION = 'production',
  CONSUMPTION = 'consumption',
  BATTLE_POST = 'battle_post',
  BUILD_VALIDATE = 'build_validate',
  RESEARCH_VALIDATE = 'research_validate',
  FLEET_MISSIONS = 'fleet_missions',
  FLEET_HANDLER = 'fleet_handler',
  EXPLORATION = 'exploration',
  PRODUCTION_POST = 'production_post',
  PLANET_IMAGE = 'planet_image',
  OBJECT_IMAGE = 'object_image',
}

export abstract class GameMod {
  abstract readonly name: string;
  abstract readonly version: string;
  abstract readonly author: string;
  abstract readonly description: string;

  abstract onInstall(): Promise<void>;
  abstract onUninstall(): Promise<void>;
  abstract onInit(): Promise<void>;

  hooks: Map<ModHooks, Function[]> = new Map();

  protected registerHook(hook: ModHooks, fn: Function): void {
    if (!this.hooks.has(hook)) this.hooks.set(hook, []);
    this.hooks.get(hook)!.push(fn);
  }
}

export interface ModManifest {
  name: string;
  version: string;
  author: string;
  description: string;
  website?: string;
  folder: string;
  bg_image?: string;
}

const MODS_SETTINGS_KEY = "mod_system_installed_mods";
const MODS_DIR = path.join(import.meta.dirname, "..", "mods");

export class ModManager {
  private static instance: ModManager;
  private mods: Map<string, GameMod> = new Map();
  private modOrder: string[] = [];

  private constructor() {}

  static getInstance(): ModManager {
    if (!ModManager.instance) {
      ModManager.instance = new ModManager();
    }
    return ModManager.instance;
  }

  async loadMods(): Promise<void> {
    this.mods.clear();
    this.modOrder = [];

    if (!existsSync(MODS_DIR)) {
      logger.info("SYSTEM", "Mods directory does not exist, skipping mod loading");
      return;
    }

    const installedNames = await this.getInstalledModList();

    for (const name of installedNames) {
      try {
        const modPath = path.join(MODS_DIR, name);
        const indexPath = path.join(modPath, "index.ts");

        if (!existsSync(indexPath)) {
          logger.warn("SYSTEM", `Mod ${name} missing index.ts, skipping`);
          continue;
        }

        const modModule = await import(indexPath);
        const ModClass = modModule.default || Object.values(modModule)[0];

        if (!ModClass || typeof ModClass !== "function") {
          logger.warn("SYSTEM", `Mod ${name} does not export a valid mod class`);
          continue;
        }

        const modInstance: GameMod = new ModClass();

        if (!modInstance.name || !modInstance.version || !modInstance.author || !modInstance.description) {
          logger.warn("SYSTEM", `Mod ${name} missing required fields, skipping`);
          continue;
        }

        this.mods.set(modInstance.name, modInstance);
        this.modOrder.push(modInstance.name);

        await modInstance.onInit();
        logger.info("SYSTEM", `Mod loaded: ${modInstance.name} v${modInstance.version}`);
      } catch (err) {
        logger.error("SYSTEM", `Failed to load mod: ${name}`, err);
      }
    }

    logger.info("SYSTEM", `Loaded ${this.mods.size} mod(s)`);
  }

  async installMod(name: string): Promise<boolean> {
    if (this.mods.has(name)) return false;

    const modPath = path.join(MODS_DIR, name);
    const indexPath = path.join(modPath, "index.ts");

    if (!existsSync(indexPath)) return false;

    try {
      const modModule = await import(indexPath);
      const ModClass = modModule.default || Object.values(modModule)[0];
      if (!ModClass || typeof ModClass !== "function") return false;

      const modInstance: GameMod = new ModClass();
      if (!modInstance.name || !modInstance.version || !modInstance.author || !modInstance.description) return false;

      await modInstance.onInstall();
      await modInstance.onInit();

      this.mods.set(modInstance.name, modInstance);
      this.modOrder.push(modInstance.name);

      await this.saveInstalledModList();
      logger.info("SYSTEM", `Mod installed: ${modInstance.name} v${modInstance.version}`);
      return true;
    } catch (err) {
      logger.error("SYSTEM", `Failed to install mod: ${name}`, err);
      return false;
    }
  }

  async uninstallMod(name: string): Promise<boolean> {
    const mod = this.mods.get(name);
    if (!mod) return false;

    try {
      await mod.onUninstall();
      this.mods.delete(name);
      this.modOrder = this.modOrder.filter((n) => n !== name);
      await this.saveInstalledModList();
      logger.info("SYSTEM", `Mod uninstalled: ${name}`);
      return true;
    } catch (err) {
      logger.error("SYSTEM", `Failed to uninstall mod: ${name}`, err);
      return false;
    }
  }

  moveUp(name: string): void {
    const idx = this.modOrder.indexOf(name);
    if (idx <= 0) return;
    [this.modOrder[idx - 1], this.modOrder[idx]] = [this.modOrder[idx], this.modOrder[idx - 1]];
  }

  moveDown(name: string): void {
    const idx = this.modOrder.indexOf(name);
    if (idx === -1 || idx >= this.modOrder.length - 1) return;
    [this.modOrder[idx], this.modOrder[idx + 1]] = [this.modOrder[idx + 1], this.modOrder[idx]];
  }

  executeHook(hook: ModHooks, ...args: any[]): boolean {
    for (const name of this.modOrder) {
      const mod = this.mods.get(name);
      if (!mod) continue;
      const fns = mod.hooks.get(hook);
      if (!fns) continue;
      for (const fn of fns) {
        try {
          const result = fn(...args);
          if (result === true) return true;
        } catch (err) {
          logger.error("SYSTEM", `Error in mod ${name} hook ${hook}`, err);
        }
      }
    }
    return false;
  }

  executeHookWithReturn(hook: ModHooks, args: any[], ref: any): boolean {
    for (const name of this.modOrder) {
      const mod = this.mods.get(name);
      if (!mod) continue;
      const fns = mod.hooks.get(hook);
      if (!fns) continue;
      for (const fn of fns) {
        try {
          const result = fn(...args, ref);
          if (result === true) return true;
        } catch (err) {
          logger.error("SYSTEM", `Error in mod ${name} hook ${hook}`, err);
        }
      }
    }
    return false;
  }

  async getModInfo(name: string, modsPath?: string): Promise<ModManifest | null> {
    const basePath = modsPath || MODS_DIR;
    const manifestPath = path.join(basePath, name, "mod.json");

    if (!existsSync(manifestPath)) return null;

    try {
      const raw = await fs.readFile(manifestPath, "utf-8");
      const data = JSON.parse(raw);
      return {
        name: data.name || name,
        version: data.version || "0.0.0",
        author: data.author || "unknown",
        description: data.description || "",
        website: data.website,
        folder: name,
        bg_image: data.bg_image,
      };
    } catch {
      return null;
    }
  }

  async listMods(): Promise<{ available: string[]; installed: string[] }> {
    const available: string[] = [];

    if (existsSync(MODS_DIR)) {
      const entries = await fs.readdir(MODS_DIR, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          available.push(entry.name);
        }
      }
    }

    return {
      available,
      installed: [...this.modOrder],
    };
  }

  getMods(): Map<string, GameMod> {
    return new Map(this.mods);
  }

  private async getInstalledModList(): Promise<string[]> {
    try {
      const setting = await storage.getSetting(MODS_SETTINGS_KEY);
      if (setting && Array.isArray(setting.value)) {
        return setting.value as string[];
      }
    } catch (err) {
      logger.error("SYSTEM", "Failed to load installed mod list", err);
    }
    return [];
  }

  private async saveInstalledModList(): Promise<void> {
    try {
      await storage.setSetting(MODS_SETTINGS_KEY, this.modOrder, "Installed mods list", "system");
    } catch (err) {
      logger.error("SYSTEM", "Failed to save installed mod list", err);
    }
  }
}

export function modRouter(): Router {
  const router = Router();
  const modManager = ModManager.getInstance();

  router.use((req: Request, res: Response, next: NextFunction) => {
    const handled = modManager.executeHook(ModHooks.ROUTE, req, res);
    if (handled) return;
    next();
  });

  return router;
}

export function modAdminRouter(): Router {
  const router = Router();
  const modManager = ModManager.getInstance();

  router.use((req: Request, res: Response, next: NextFunction) => {
    const handled = modManager.executeHook(ModHooks.ROUTE_ADMIN, req, res);
    if (handled) return;
    next();
  });

  return router;
}
