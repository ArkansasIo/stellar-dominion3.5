import type { Express, Request, Response } from "express";
import { db } from "./db";
import { playerStates, users, marketOrders } from "../shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";

export function registerMissingApiRoutes(app: Express) {
  // GET /api/market/orders - List market orders
  app.get("/api/market/orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      const { resource, type, limit: queryLimit } = req.query;
      const limitNum = parseInt(queryLimit as string) || 50;

      const conditions = [eq(marketOrders.status, "active")];
      if (resource) conditions.push(eq(marketOrders.resource, resource as string));
      if (type) conditions.push(eq(marketOrders.type, type as string));

      const orders = await db
        .select()
        .from(marketOrders)
        .where(and(...conditions))
        .orderBy(desc(marketOrders.createdAt))
        .limit(limitNum);

      res.json({ success: true, orders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/market/order - Create a market order
  app.post("/api/market/order", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { type, resource, amount, pricePerUnit } = req.body;
      if (!type || !resource || !amount || !pricePerUnit) {
        return res.status(400).json({ error: "Missing required fields: type, resource, amount, pricePerUnit" });
      }

      if (!["buy", "sell"].includes(type)) {
        return res.status(400).json({ error: "Type must be 'buy' or 'sell'" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const resources = (playerState.resources as any) || {};

      if (type === "sell") {
        const resourceKey = resource === "metal" ? "metal" : resource === "crystal" ? "crystal" : "deuterium";
        if ((resources[resourceKey] || 0) < amount) {
          return res.status(400).json({ error: "Insufficient resources" });
        }
        await db.update(playerStates).set({
          resources: { ...resources, [resourceKey]: resources[resourceKey] - amount },
          updatedAt: new Date(),
        }).where(eq(playerStates.userId, userId));
      }

      const [order] = await db.insert(marketOrders).values({
        userId,
        type,
        resource,
        amount,
        pricePerUnit,
        status: "active",
      }).returning();

      res.json({ success: true, order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/market/buy - Buy from market
  app.post("/api/market/buy", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { orderId, amount } = req.body;
      if (!orderId || !amount) {
        return res.status(400).json({ error: "Missing orderId or amount" });
      }

      const order = await db.query.marketOrders.findFirst({
        where: eq(marketOrders.id, orderId),
      });

      if (!order || order.status !== "active") {
        return res.status(404).json({ error: "Order not found or inactive" });
      }

      if (order.userId === userId) {
        return res.status(400).json({ error: "Cannot buy your own order" });
      }

      const totalCost = Math.floor(amount * order.pricePerUnit);
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const resources = (playerState.resources as any) || {};
      if ((resources.metal || 0) < totalCost) {
        return res.status(400).json({ error: "Insufficient credits", required: totalCost });
      }

      const resourceKey = order.resource === "metal" ? "metal" : order.resource === "crystal" ? "crystal" : "deuterium";

      await db.update(playerStates).set({
        resources: { ...resources, metal: (resources.metal || 0) - totalCost, [resourceKey]: (resources[resourceKey] || 0) + amount },
        updatedAt: new Date(),
      }).where(eq(playerStates.userId, userId));

      const remaining = order.amount - amount;
      if (remaining <= 0) {
        await db.update(marketOrders).set({ status: "completed", completedAt: new Date() }).where(eq(marketOrders.id, orderId));
      } else {
        await db.update(marketOrders).set({ amount: remaining }).where(eq(marketOrders.id, orderId));
      }

      res.json({ success: true, cost: totalCost, resource: order.resource, amount });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/espionage/scan - Scan a target
  app.post("/api/espionage/scan", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetUserId, scanType } = req.body;
      if (!targetUserId) return res.status(400).json({ error: "targetUserId is required" });

      const targetState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, targetUserId),
      });

      if (!targetState) return res.status(404).json({ error: "Target not found" });

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const research = (playerState.research as any) || {};
      const scanLevel = research.espionageTech || 1;

      const targetResources = (targetState.resources as any) || {};
      const scanResult: any = {
        scanType: scanType || "basic",
        success: Math.random() < 0.65 + scanLevel * 0.05,
      };

      if (scanResult.success) {
        scanResult.resources = {
          metal: Math.round(targetResources.metal * (0.8 + Math.random() * 0.2)),
          crystal: Math.round(targetResources.crystal * (0.8 + Math.random() * 0.2)),
          deuterium: Math.round(targetResources.deuterium * (0.8 + Math.random() * 0.2)),
        };
        if (scanType === "full") {
          scanResult.buildings = targetState.buildings;
          scanResult.units = targetState.units;
        }
      }

      res.json({ success: true, scan: scanResult });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/planets/colonize - Colonize a planet
  app.post("/api/planets/colonize", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { planetId, sectorId } = req.body;
      if (!planetId) return res.status(400).json({ error: "planetId is required" });

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const resources = (playerState.resources as any) || {};
      const colonizeCost = { metal: 5000, crystal: 2000, deuterium: 1000 };

      if ((resources.metal || 0) < colonizeCost.metal || (resources.crystal || 0) < colonizeCost.crystal) {
        return res.status(400).json({ error: "Insufficient resources for colonization", required: colonizeCost });
      }

      await db.update(playerStates).set({
        resources: {
          ...resources,
          metal: (resources.metal || 0) - colonizeCost.metal,
          crystal: (resources.crystal || 0) - colonizeCost.crystal,
          deuterium: (resources.deuterium || 0) - colonizeCost.deuterium,
        },
        updatedAt: new Date(),
      }).where(eq(playerStates.userId, userId));

      res.json({ success: true, message: `Planet ${planetId} colonized`, cost: colonizeCost });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/planets/extract - Extract resources from a planet
  app.post("/api/planets/extract", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { planetId, resource, amount } = req.body;
      if (!planetId || !resource || !amount) {
        return res.status(400).json({ error: "planetId, resource, and amount are required" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const resources = (playerState.resources as any) || {};
      const resourceKey = resource === "metal" ? "metal" : resource === "crystal" ? "crystal" : "deuterium";
      const extracted = Math.min(amount, 1000);

      await db.update(playerStates).set({
        resources: { ...resources, [resourceKey]: (resources[resourceKey] || 0) + extracted },
        updatedAt: new Date(),
      }).where(eq(playerStates.userId, userId));

      res.json({ success: true, extracted, resource });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/players - List players
  app.get("/api/players", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const players = await db
        .select({
          id: users.id,
          username: users.username,
          empireLevel: playerStates.empireLevel,
          tier: playerStates.tier,
          createdAt: playerStates.createdAt,
        })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .orderBy(desc(playerStates.empireLevel))
        .limit(limit)
        .offset(offset);

      res.json({ success: true, players });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/ships - Get player ships/fleet
  app.get("/api/ships", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const units = (playerState.units as any) || {};
      const buildings = (playerState.buildings as any) || {};

      res.json({
        success: true,
        ships: units,
        shipyard: { level: buildings.shipyard || 0, active: buildings.shipyard > 0 },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/logs - Server logs (alias for admin logs)
  app.get("/api/logs", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const type = req.query.type as string || "access";
      const limit = parseInt(req.query.limit as string) || 100;

      res.json({
        success: true,
        logs: [],
        type,
        message: "Log endpoint available - connect to admin for log access",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/tech-tree - Get technology tree
  app.get("/api/tech-tree", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const research = (playerState.research as any) || {};

      res.json({
        success: true,
        tree: research,
        totalTechs: Object.keys(research).length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
