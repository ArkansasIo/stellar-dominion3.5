import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { db } from "./db";
import { empireProfiles } from "../Source/Shared/schema";
import { eq } from "drizzle-orm";
import {
  EMPIRE_ATTRIBUTES,
  getAttributeById,
  calculateAttributeCost,
  getDefaultEmpireAttributes,
  getEmpireOverallLevel,
  getEmpirePowerRating,
} from "../Source/Shared/config/empireProfileConfig";
import { isAuthenticated } from "./basicAuth";

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

export function registerEmpireProfileRoutes(app: Express) {
  // GET /api/empire-profile/config - Attribute definitions
  app.get("/api/empire-profile/config", (_req: Request, res: Response) => {
    res.json({
      success: true,
      attributes: EMPIRE_ATTRIBUTES,
      maxLevel: 100,
    });
  });

  // GET /api/empire-profile - Get player's empire profile
  app.get("/api/empire-profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const [profile] = await db
        .select()
        .from(empireProfiles)
        .where(eq(empireProfiles.userId, userId));

      if (!profile) {
        // Auto-create with defaults
        const defaults = getDefaultEmpireAttributes();
        const [newProfile] = await db
          .insert(empireProfiles)
          .values({
            userId,
            ...defaults,
            availablePoints: 0,
            totalPointsEarned: 0,
            powerRating: getEmpirePowerRating(defaults),
          })
          .returning();
        return res.json({ success: true, profile: newProfile });
      }

      res.json({ success: true, profile });
    } catch (error) {
      console.error("Failed to get empire profile:", error);
      res.status(500).json({ message: "Failed to get empire profile" });
    }
  });

  // PUT /api/empire-profile/allocate - Allocate points to an attribute
  app.put("/api/empire-profile/allocate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { attribute, points } = req.body;

      if (!attribute || typeof points !== "number" || points < 1) {
        return res.status(400).json({ message: "Invalid attribute or points" });
      }

      const attrDef = getAttributeById(attribute);
      if (!attrDef) {
        return res.status(400).json({ message: "Unknown attribute: " + attribute });
      }

      const [profile] = await db
        .select()
        .from(empireProfiles)
        .where(eq(empireProfiles.userId, userId));

      if (!profile) {
        return res.status(404).json({ message: "Empire profile not found" });
      }

      const currentLevel = (profile as any)[attribute] as number;
      if (currentLevel + points > attrDef.maxLevel) {
        return res.status(400).json({ message: "Would exceed max level" });
      }

      // Calculate total cost for the points
      let totalCost = 0;
      for (let i = 0; i < points; i++) {
        totalCost += calculateAttributeCost(
          currentLevel + i,
          attrDef.baseCost,
          attrDef.costMultiplier
        );
      }

      if ((profile.availablePoints ?? 0) < totalCost) {
        return res.status(400).json({
          message: "Insufficient points",
          required: totalCost,
          available: profile.availablePoints,
        });
      }

      // Update the attribute and spend points
      const newLevel = currentLevel + points;
      const pointsSpent = (profile.attributePoints as any)[attribute] + totalCost;
      const newAttributes = { ...(profile.attributePoints as any), [attribute]: pointsSpent };

      const allAttrs: Record<string, number> = {
        military: profile.military ?? 0,
        economy: profile.economy ?? 0,
        research: profile.research ?? 0,
        industry: profile.industry ?? 0,
        diplomacy: profile.diplomacy ?? 0,
        espionage: profile.espionage ?? 0,
        exploration: profile.exploration ?? 0,
        governance: profile.governance ?? 0,
        innovation: profile.innovation ?? 0,
        [attribute]: newLevel,
      };

      const [updated] = await db
        .update(empireProfiles)
        .set({
          [attribute]: newLevel,
          attributePoints: newAttributes,
          availablePoints: (profile.availablePoints ?? 0) - totalCost,
          powerRating: getEmpirePowerRating(allAttrs),
          updatedAt: new Date(),
        })
        .where(eq(empireProfiles.userId, userId))
        .returning();

      res.json({ success: true, profile: updated });
    } catch (error) {
      console.error("Failed to allocate points:", error);
      res.status(500).json({ message: "Failed to allocate points" });
    }
  });

  // POST /api/empire-profile/grant-points - Grant points (from gameplay)
  app.post("/api/empire-profile/grant-points", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { amount, reason } = req.body;

      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const [profile] = await db
        .select()
        .from(empireProfiles)
        .where(eq(empireProfiles.userId, userId));

      if (!profile) {
        return res.status(404).json({ message: "Empire profile not found" });
      }

      const [updated] = await db
        .update(empireProfiles)
        .set({
          availablePoints: profile.availablePoints + amount,
          totalPointsEarned: profile.totalPointsEarned + amount,
          updatedAt: new Date(),
        })
        .where(eq(empireProfiles.userId, userId))
        .returning();

      res.json({
        success: true,
        profile: updated,
        granted: amount,
        reason: reason || "gameplay",
      });
    } catch (error) {
      console.error("Failed to grant points:", error);
      res.status(500).json({ message: "Failed to grant points" });
    }
  });

  // PUT /api/empire-profile/name - Update empire name/title
  app.put("/api/empire-profile/name", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { empireName, empireTitle } = req.body;

      const updates: any = { updatedAt: new Date() };
      if (empireName !== undefined) updates.empireName = empireName;
      if (empireTitle !== undefined) updates.empireTitle = empireTitle;

      const [updated] = await db
        .update(empireProfiles)
        .set(updates)
        .where(eq(empireProfiles.userId, userId))
        .returning();

      res.json({ success: true, profile: updated });
    } catch (error) {
      console.error("Failed to update empire name:", error);
      res.status(500).json({ message: "Failed to update empire name" });
    }
  });

  // GET /api/empire-profile/cost - Calculate cost for attribute upgrade
  app.get("/api/empire-profile/cost", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { attribute, levels } = req.query;

      if (!attribute || typeof attribute !== "string") {
        return res.status(400).json({ message: "Missing attribute parameter" });
      }

      const attrDef = getAttributeById(attribute);
      if (!attrDef) {
        return res.status(400).json({ message: "Unknown attribute" });
      }

      const [profile] = await db
        .select()
        .from(empireProfiles)
        .where(eq(empireProfiles.userId, userId));

      const currentLevel = profile ? (profile as any)[attribute] as number : 1;
      const numLevels = Math.max(1, parseInt(levels as string) || 1);

      let totalCost = 0;
      const breakdown: Array<{ level: number; cost: number }> = [];

      for (let i = 0; i < numLevels; i++) {
        const cost = calculateAttributeCost(
          currentLevel + i,
          attrDef.baseCost,
          attrDef.costMultiplier
        );
        totalCost += cost;
        breakdown.push({ level: currentLevel + i + 1, cost });
      }

      res.json({
        success: true,
        attribute,
        currentLevel,
        requestedLevels: numLevels,
        totalCost,
        breakdown,
        canAfford: profile ? (profile.availablePoints ?? 0) >= totalCost : false,
      });
    } catch (error) {
      console.error("Failed to calculate cost:", error);
      res.status(500).json({ message: "Failed to calculate cost" });
    }
  });
}
