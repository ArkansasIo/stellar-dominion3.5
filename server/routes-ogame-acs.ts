import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { acsService } from "./services/acsService";
import { db } from "./db";
import { users, alliances, allianceMembers } from "../Source/Shared/schema";
import { eq, and } from "drizzle-orm";

export function registerOGameACSRoutes(app: Router) {
  app.post("/api/ogame/acs/create", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetCoordinates, targetType, missionType } = req.body;
      if (!targetCoordinates || !missionType) {
        return res.status(400).json({ error: "targetCoordinates and missionType required" });
      }

      const group = acsService.createGroup(userId, targetCoordinates, targetType || "planet", missionType);
      res.json({ success: true, group });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/acs/join/:groupId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { groupId } = req.params;
      const { units } = req.body;
      if (!units || Object.keys(units).length === 0) {
        return res.status(400).json({ error: "Units required" });
      }

      const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId)).limit(1);

      const group = acsService.joinGroup(groupId, userId, user?.username || "Unknown", units);
      res.json({ success: true, group });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/acs/leave/:groupId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const group = acsService.leaveGroup(req.params.groupId, userId);
      res.json({ success: true, group });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/acs/cancel/:groupId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      acsService.cancelGroup(req.params.groupId, userId);
      res.json({ success: true, message: "ACS group cancelled" });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/acs/launch/:groupId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const group = acsService.launchGroup(req.params.groupId, userId);
      res.json({ success: true, group });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/acs/group/:groupId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const group = acsService.getGroup(req.params.groupId);
      if (!group) return res.status(404).json({ error: "ACS group not found" });
      res.json({ success: true, group });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/acs/my-groups", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const groups = await acsService.getPlayerACSGroups(userId);
      res.json({ success: true, groups });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/acs/alliance-groups", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [member] = await db
        .select({ allianceId: allianceMembers.allianceId })
        .from(allianceMembers)
        .where(eq(allianceMembers.userId, userId))
        .limit(1);

      if (!member) return res.status(404).json({ error: "Not in an alliance" });

      const groups = await acsService.getAllianceACSGroups(member.allianceId);
      res.json({ success: true, groups });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
