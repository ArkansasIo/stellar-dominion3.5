import crypto from "crypto";
import type { Express, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { storage } from "./storage";
import { users } from "../shared/schema";

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function getOptionalPlayerState(userId: string) {
  try {
    return await storage.getPlayerState(userId);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("does not exist")) {
      return undefined;
    }
    throw error;
  }
}

async function tryUpdateCommanderState(userId: string, updater: (commander: any) => any) {
  const playerState = await getOptionalPlayerState(userId);
  if (!playerState) {
    return false;
  }

  const commander = { ...((playerState.commander as any) || {}) };

  await storage.updatePlayerState(userId, {
    commander: updater(commander) as any,
  });

  return true;
}

export function registerAccountRoutes(app: Express) {
  app.get("/api/account/settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const playerState = await getOptionalPlayerState(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const commander = (playerState?.commander as any) || {};
      const profile = commander.profile || {};
      const security = commander.security || {};

      res.json({
        id: user.id,
        username: user.username || "",
        email: user.email || "",
        displayName: user.firstName || user.username || "Commander",
        profileImageUrl: user.profileImageUrl || "",
        commanderTitle: commander.title || "commander",
        bioMessage: profile.bioMessage || "",
        twoFactorEnabled: Boolean(security.twoFactorEnabled),
      });
    } catch (error) {
      console.error("Failed to load account settings:", error);
      res.status(500).json({ message: "Failed to load account settings" });
    }
  });

  app.patch("/api/account/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const displayName = String(req.body?.displayName || "").trim();
      const commanderTitle = String(req.body?.commanderTitle || "commander").trim();
      const bioMessage = String(req.body?.bioMessage || "").trim();
      const profileImageUrl = String(req.body?.profileImageUrl || "").trim();

      if (displayName.length < 2) {
        return res.status(400).json({ message: "Display name must be at least 2 characters" });
      }

      const user = await storage.updateUser(userId, {
        firstName: displayName,
        profileImageUrl: profileImageUrl || null,
        updatedAt: new Date(),
      });

      await tryUpdateCommanderState(userId, (commander) => ({
        ...commander,
        title: commanderTitle || commander.title || "Commander",
        profile: {
          ...(commander.profile || {}),
          bioMessage,
        },
      }));

      res.json({
        id: user.id,
        displayName: user.firstName || user.username || "Commander",
        profileImageUrl: user.profileImageUrl || "",
        commanderTitle: commanderTitle || "Commander",
        bioMessage,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post("/api/account/email", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const email = String(req.body?.email || "").trim();

      if (!email.includes("@")) {
        return res.status(400).json({ message: "Valid email address required" });
      }

      const user = await storage.updateUser(userId, {
        email,
        updatedAt: new Date(),
      });

      res.json({ email: user.email || "" });
    } catch (error) {
      console.error("Failed to update email:", error);
      res.status(500).json({ message: "Failed to update email" });
    }
  });

  app.post("/api/account/password", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const currentPassword = String(req.body?.currentPassword || "");
      const newPassword = String(req.body?.newPassword || "");

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const user = await storage.getUser(userId);
      if (!user || !user.passwordHash) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.passwordHash !== hashPassword(currentPassword)) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      await storage.updateUser(userId, {
        passwordHash: hashPassword(newPassword),
        updatedAt: new Date(),
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Failed to update password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  app.post("/api/account/2fa/enable", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      await tryUpdateCommanderState(userId, (commander) => ({
        ...commander,
        security: {
          ...(commander.security || {}),
          twoFactorEnabled: true,
          twoFactorActivatedAt: new Date().toISOString(),
        },
      }));

      res.json({ enabled: true });
    } catch (error) {
      console.error("Failed to enable 2FA:", error);
      res.status(500).json({ message: "Failed to enable 2FA" });
    }
  });

  app.get("/api/account/export", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const playerState = await getOptionalPlayerState(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        exportedAt: new Date().toISOString(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          profileImageUrl: user.profileImageUrl,
          createdAt: user.createdAt,
        },
        playerState,
      });
    } catch (error) {
      console.error("Failed to export account:", error);
      res.status(500).json({ message: "Failed to export account" });
    }
  });

  app.delete("/api/account", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const currentPassword = String(req.body?.currentPassword || "");
      const confirmText = String(req.body?.confirmText || "");
      const user = await storage.getUser(userId);

      if (!user || !user.passwordHash) {
        return res.status(404).json({ message: "User not found" });
      }

      if (confirmText !== "DELETE") {
        return res.status(400).json({ message: "Type DELETE to confirm account deletion" });
      }

      if (user.passwordHash !== hashPassword(currentPassword)) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      await db.delete(users).where(eq(users.id, userId));

      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ deleted: true });
      });
    } catch (error) {
      console.error("Failed to delete account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });
}