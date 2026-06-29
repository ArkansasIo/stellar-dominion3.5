import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { playerStates } from "../Source/Shared/schema";
import { eq } from "drizzle-orm";
import { OGAME_CATALOG_ENTRY_MAP } from "../Source/Shared/config/ogameCatalogConfig";

const OFFICER_IDS = ["commanderOfficer", "admiralOfficer", "engineerOfficer", "geologistOfficer", "technocratOfficer"];

const OFFICER_DURATION_DAYS = 30;

export function registerOGameOfficerRoutes(app: Router) {
  app.get("/api/ogame/officers", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db
        .select({ activeOfficers: playerStates.activeOfficers, resources: playerStates.resources })
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Player state not found" });

      const activeOfficers = (state.activeOfficers as Record<string, any>) || {};
      const now = Date.now();

      // Clean expired officers
      for (const [id, data] of Object.entries(activeOfficers)) {
        if (data.expiresAt && data.expiresAt < now) {
          delete activeOfficers[id];
        }
      }

      const officers = OFFICER_IDS.map((id) => {
        const def = OGAME_CATALOG_ENTRY_MAP[id];
        const active = activeOfficers[id];
        return {
          id,
          name: def?.name || id,
          description: def?.description || "",
          cost: def?.baseCost || { darkMatter: 500 },
          stats: def?.stats || {},
          active: !!active,
          expiresAt: active?.expiresAt || null,
          remainingDays: active ? Math.max(0, Math.floor((active.expiresAt - now) / 86400000)) : 0,
        };
      });

      res.json({ success: true, officers, darkMatter: (state.resources as any)?.darkMatter || 0 });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/officers/purchase/:officerId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { officerId } = req.params;
      if (!OFFICER_IDS.includes(officerId)) {
        return res.status(400).json({ error: "Invalid officer ID" });
      }

      const def = OGAME_CATALOG_ENTRY_MAP[officerId];
      if (!def) return res.status(404).json({ error: "Officer definition not found" });

      const cost = def.baseCost?.darkMatter || 500;

      const [state] = await db
        .select({ activeOfficers: playerStates.activeOfficers, resources: playerStates.resources })
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Player state not found" });

      const resources = (state.resources as any) || {};
      const currentDM = resources.darkMatter || 0;

      if (currentDM < cost) {
        return res.status(400).json({ error: `Not enough dark matter. Need ${cost}, have ${currentDM}` });
      }

      const activeOfficers = (state.activeOfficers as Record<string, any>) || {};
      const now = Date.now();

      // Extend if already active, otherwise activate
      if (activeOfficers[officerId]) {
        activeOfficers[officerId].expiresAt += OFFICER_DURATION_DAYS * 86400000;
      } else {
        activeOfficers[officerId] = {
          activatedAt: now,
          expiresAt: now + OFFICER_DURATION_DAYS * 86400000,
        };
      }

      resources.darkMatter = currentDM - cost;

      await db
        .update(playerStates)
        .set({
          activeOfficers: activeOfficers as any,
          resources: resources as any,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      res.json({
        success: true,
        message: `${def.name} activated for ${OFFICER_DURATION_DAYS} days`,
        officer: {
          id: officerId,
          name: def.name,
          active: true,
          expiresAt: activeOfficers[officerId].expiresAt,
          remainingDays: OFFICER_DURATION_DAYS,
        },
        darkMatter: resources.darkMatter,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
