import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import { ResearchXPService } from "./services/researchXPService";

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

export function registerArtifactRoutes(app: Express) {
  app.get("/api/artifacts/summary", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const artifacts = Array.isArray(playerState?.artifacts) ? (playerState.artifacts as any[]) : [];
      const discoveries = await ResearchXPService.getDiscoveries(userId, 50);

      const expeditionCount = Math.max(artifacts.length * 2, discoveries.length);
      const successRate = expeditionCount === 0 ? 0 : Math.min(97, 55 + artifacts.length * 6 + discoveries.length);
      const legendaryCount = artifacts.filter((artifact) => ["legendary", "ancient"].includes(String(artifact?.rarity || ""))).length;

      res.json({
        totalExpeditions: expeditionCount,
        successRate,
        artifactsFound: artifacts.length,
        legendaryCount,
      });
    } catch (error) {
      console.error("Failed to load artifact summary:", error);
      res.status(500).json({ message: "Failed to load artifact summary" });
    }
  });

  app.get("/api/artifacts/discovery-log", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const artifacts = Array.isArray(playerState?.artifacts) ? (playerState.artifacts as any[]) : [];
      const discoveries = await ResearchXPService.getDiscoveries(userId, 20);

      const discoveryLog = discoveries.map((discovery, index) => {
        const linkedArtifact = artifacts[index % Math.max(artifacts.length, 1)] || null;
        const readableLocation = linkedArtifact
          ? `Recovered alongside ${linkedArtifact.name}`
          : `Research chain ${discovery.techId}`;

        return {
          id: discovery.id,
          name: linkedArtifact?.name || `Discovery from ${discovery.techId}`,
          location: readableLocation,
          date: new Date(discovery.discoveredAt).toISOString(),
          rarity: linkedArtifact?.rarity || (discovery.discoveryType === "ancient_knowledge" ? "legendary" : "rare"),
          discoveryType: discovery.discoveryType,
          techId: discovery.techId,
          xpGained: discovery.xpGained,
        };
      });

      res.json({ discoveries: discoveryLog });
    } catch (error) {
      console.error("Failed to load artifact discovery log:", error);
      res.status(500).json({ message: "Failed to load artifact discovery log" });
    }
  });
}
