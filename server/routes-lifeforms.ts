import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";
import { LIFEFORM_DEFINITIONS, LIFEFORM_MAP, DEFAULT_LIFEFORM } from "../shared/config/lifeformConfig";

export function registerLifeformRoutes(app: Router) {
  app.get("/api/lifeforms", isAuthenticated as any, async (_req: any, res: any) => {
    try {
      res.json({ success: true, lifeforms: LIFEFORM_DEFINITIONS });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/lifeforms/mine", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db
        .select({ lifeform: playerStates.lifeform })
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Player state not found" });

      const lifeformId = (state as any).lifeform || DEFAULT_LIFEFORM;
      const def = LIFEFORM_MAP[lifeformId] || LIFEFORM_MAP[DEFAULT_LIFEFORM];

      res.json({ success: true, lifeform: lifeformId, definition: def });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put("/api/lifeforms/select", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const lifeformId = String(req.body?.lifeformId || "").trim();
      if (!LIFEFORM_MAP[lifeformId]) {
        return res.status(400).json({ error: "Invalid lifeform ID" });
      }

      await db
        .update(playerStates)
        .set({ lifeform: lifeformId as any, updatedAt: new Date() })
        .where(eq(playerStates.userId, userId));

      res.json({ success: true, lifeform: lifeformId, definition: LIFEFORM_MAP[lifeformId] });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
