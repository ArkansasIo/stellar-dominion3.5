import { isAuthenticated } from "./basicAuth";
import { CelestialService } from "./services/celestialService";
import type { Express } from "express";

export function registerCelestialRoutes(app: Express) {
  app.post("/api/celestial/search", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { bodyType, coordinates } = req.body;
      if (!bodyType || !coordinates) {
        return res.status(400).json({ error: "bodyType (planet|moon) and coordinates required" });
      }
      if (!["planet", "moon"].includes(bodyType)) {
        return res.status(400).json({ error: "bodyType must be 'planet' or 'moon'" });
      }

      const result = await CelestialService.searchCelestial(userId, bodyType, coordinates);
      if (!result.success) {
        if (result.onCooldown) return res.status(429).json({ error: result.error, cooldownUntil: result.cooldownUntil });
        return res.status(400).json({ error: result.error });
      }

      res.json({ success: true, result: result.result });
    } catch (error) {
      console.error("Celestial search error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/celestial/discovered", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const discovered = await CelestialService.getDiscovered(userId);
      res.json({ success: true, discovered });
    } catch (error) {
      console.error("Get discovered error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/celestial/cooldowns", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const cooldowns = await CelestialService.getSearchCooldowns(userId);
      res.json({ success: true, cooldowns });
    } catch (error) {
      console.error("Get cooldowns error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/celestial/claim", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { bodyId, bodyType, coordinates } = req.body;
      if (!bodyId || !bodyType || !coordinates) {
        return res.status(400).json({ error: "bodyId, bodyType, and coordinates required" });
      }

      const result = await CelestialService.claimCelestial(userId, bodyId, bodyType, coordinates, req.session?.username ?? "Unknown");
      if (!result.success) return res.status(400).json({ error: result.error });

      res.json({ success: true, message: `${bodyType} claimed successfully` });
    } catch (error) {
      console.error("Claim celestial error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/celestial/takeover", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { bodyId, coordinates } = req.body;
      if (!bodyId) return res.status(400).json({ error: "bodyId required" });

      const result = await CelestialService.takeoverCelestial(userId, req.session?.username ?? "Unknown", bodyId, coordinates);
      if (!result.success) return res.status(400).json({ error: result.error });

      res.json({ success: true, message: "Takeover successful!" });
    } catch (error) {
      console.error("Takeover error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Marketplace
  app.get("/api/celestial/marketplace", async (_req: any, res: any) => {
    try {
      const bodyType = _req.query.bodyType as string | undefined;
      const listings = await CelestialService.getMarketListings(bodyType ? { bodyType } : undefined);
      res.json({ success: true, listings });
    } catch (error) {
      console.error("Marketplace listings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/celestial/marketplace/list", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { bodyType, bodyId, coordinates, price, currency } = req.body;
      if (!bodyType || !bodyId || !coordinates || !price) {
        return res.status(400).json({ error: "bodyType, bodyId, coordinates, and price required" });
      }

      const result = await CelestialService.listCelestial(userId, bodyType, bodyId, coordinates, price, currency ?? "credits");
      if (!result.success) return res.status(400).json({ error: result.error });

      res.json({ success: true, message: "Listed on marketplace" });
    } catch (error) {
      console.error("List celestial error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/celestial/marketplace/buy", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { listingId } = req.body;
      if (!listingId) return res.status(400).json({ error: "listingId required" });

      const result = await CelestialService.buyCelestial(userId, req.session?.username ?? "Unknown", listingId);
      if (!result.success) return res.status(400).json({ error: result.error });

      res.json({ success: true, message: "Purchase successful!" });
    } catch (error) {
      console.error("Buy celestial error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/celestial/marketplace/cancel", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { listingId } = req.body;
      if (!listingId) return res.status(400).json({ error: "listingId required" });

      const result = await CelestialService.cancelListing(userId, listingId);
      if (!result.success) return res.status(400).json({ error: result.error });

      res.json({ success: true, message: "Listing cancelled" });
    } catch (error) {
      console.error("Cancel listing error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/celestial/marketplace/my-listings", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const listings = await CelestialService.getMarketListings({ sellerId: userId });
      res.json({ success: true, listings });
    } catch (error) {
      console.error("My listings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
