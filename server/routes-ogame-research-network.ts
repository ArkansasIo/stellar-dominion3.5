import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { playerStates } from "../shared/schema";
import type { Express } from "express";

export function registerOGameResearchNetworkRoutes(app: Express) {
  app.get("/api/ogame/research-network/status", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const research = (state.research as any) ?? {};
      const buildings = (state.buildings as any) ?? {};
      const irnLevel = research.intergalacticResearchNetwork ?? 0;

      const linkedLabsPerLevel = 1;
      const maxLinkedLabs = irnLevel * linkedLabsPerLevel;

      const labLevels = Object.entries(buildings)
        .filter(([key]) => key.startsWith("researchLab") || key === "researchLab")
        .map(([_, level]) => level as number);

      const totalLabLevel = labLevels.reduce((sum, l) => sum + l, 0);
      const effectiveLabLevel = irnLevel > 0 && labLevels.length > 0
        ? Math.max(...labLevels) + Math.min(irnLevel, labLevels.length - 1) * Math.min(...labLevels)
        : Math.max(...labLevels, 0);

      const sortedLabLevels = [...labLevels].sort((a, b) => b - a);
      let linkedTotal = 0;
      if (irnLevel > 0 && sortedLabLevels.length > 0) {
        const topLabs = sortedLabLevels.slice(0, Math.min(maxLinkedLabs, sortedLabLevels.length));
        linkedTotal = topLabs.reduce((sum, l) => sum + l, 0);
      }

      const bonusLevels = linkedTotal > 0 ? linkedTotal : 0;

      res.json({
        irnLevel,
        maxLinkedLabs,
        planetCount: labLevels.length,
        labLevels: sortedLabLevels,
        topLabLevel: sortedLabLevels[0] ?? 0,
        linkedTotal,
        bonusLevels,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
