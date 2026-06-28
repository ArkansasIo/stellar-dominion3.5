import { Router, type Request, type Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { requireAdminPermission } from "./routes-admin";
import { ModManager } from "./systems/modSystem";

export function registerAdminModRoutes(app: Router): void {
  const modManager = ModManager.getInstance();

  app.get("/api/admin/mods", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;

      const modList = await modManager.listMods();
      res.json({ mods: modList });
    } catch (error) {
      console.error("Failed to list mods:", error);
      res.status(500).json({ message: "Failed to list mods" });
    }
  });

  app.post("/api/admin/mods/:name/install", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;

      const { name } = req.params;
      const success = await modManager.installMod(name);

      if (!success) {
        return res.status(400).json({ message: "Failed to install mod. Check that the mod folder exists and exports a valid GameMod class." });
      }

      res.json({ success: true, message: `Mod ${name} installed successfully` });
    } catch (error) {
      console.error("Failed to install mod:", error);
      res.status(500).json({ message: "Failed to install mod" });
    }
  });

  app.post("/api/admin/mods/:name/uninstall", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;

      const { name } = req.params;
      const success = await modManager.uninstallMod(name);

      if (!success) {
        return res.status(400).json({ message: "Mod is not installed or could not be uninstalled" });
      }

      res.json({ success: true, message: `Mod ${name} uninstalled successfully` });
    } catch (error) {
      console.error("Failed to uninstall mod:", error);
      res.status(500).json({ message: "Failed to uninstall mod" });
    }
  });

  app.post("/api/admin/mods/:name/move-up", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;

      const { name } = req.params;
      modManager.moveUp(name);

      res.json({ success: true, message: `Mod ${name} moved up` });
    } catch (error) {
      console.error("Failed to move mod up:", error);
      res.status(500).json({ message: "Failed to move mod up" });
    }
  });

  app.post("/api/admin/mods/:name/move-down", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;

      const { name } = req.params;
      modManager.moveDown(name);

      res.json({ success: true, message: `Mod ${name} moved down` });
    } catch (error) {
      console.error("Failed to move mod down:", error);
      res.status(500).json({ message: "Failed to move mod down" });
    }
  });

  app.get("/api/admin/mods/:name/info", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, "manage");
      if (!access) return;

      const { name } = req.params;
      const info = await modManager.getModInfo(name);

      if (!info) {
        return res.status(404).json({ message: "Mod manifest not found" });
      }

      res.json({ mod: info });
    } catch (error) {
      console.error("Failed to get mod info:", error);
      res.status(500).json({ message: "Failed to get mod info" });
    }
  });
}
