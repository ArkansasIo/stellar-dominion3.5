import type { Express, Request, Response } from "express";
import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

// Middleware to check authentication
function isAuthenticated(req: Request, res: Response, next: Function) {
  if ((req as any).session?.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export const RESOURCE_TRADING_CONFIG = {
  // Tax rate on each trade (5%)
  TRADE_TAX_RATE: 0.05,

  // Order limits
  MIN_TRADE_AMOUNT: 10,
  MAX_TRADE_AMOUNT: 100000,

  // Tradeable resources
  RESOURCES: ["metal", "crystal", "deuterium"],

  // Statuses
  ORDER_STATUS: {
    OPEN: "open",
    FILLED: "filled",
    CANCELLED: "cancelled",
    PARTIAL: "partial",
  },
};

/**
 * Calculate trade tax
 * @param amount Resource amount being traded
 * @returns Tax amount to be deducted
 */
export function calculateResourceTradeTax(amount: number): number {
  return Math.ceil(amount * RESOURCE_TRADING_CONFIG.TRADE_TAX_RATE);
}

/**
 * Match buy and sell orders
 * @param orders All open orders
 * @param newOrder The new order being placed
 * @returns Matches and remaining quantity
 */
export function matchResourceOrders(orders: any[], newOrder: any) {
  const matches = [];
  let remainingQuantity = newOrder.quantity;

  for (const order of orders) {
    if (remainingQuantity === 0) break;

    // Check if order can match
    if (
      order.status === RESOURCE_TRADING_CONFIG.ORDER_STATUS.OPEN &&
      order.resource === newOrder.resource &&
      ((newOrder.type === "buy" && order.type === "sell" && order.pricePerUnit <= newOrder.pricePerUnit) ||
        (newOrder.type === "sell" && order.type === "buy" && order.pricePerUnit >= newOrder.pricePerUnit))
    ) {
      const matchedQuantity = Math.min(remainingQuantity, order.quantity);
      const matchedValue = matchedQuantity * order.pricePerUnit;

      matches.push({
        orderId: order.id,
        quantity: matchedQuantity,
        pricePerUnit: order.pricePerUnit,
        totalValue: matchedValue,
      });

      remainingQuantity -= matchedQuantity;
    }
  }

  return { matches, remainingQuantity };
}

export function registerResourceTradingRoutes(app: Express) {
  
  // Get current market data
  app.get("/api/resource-trading/market", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const travelState = (playerState.travelState as any) || { resourceOrders: [] };

      // Calculate market prices based on recent trades and orders
      const allOrders = travelState.resourceOrders || [];
      
      // Group by resource
      const marketData: any = {};
      for (const resource of RESOURCE_TRADING_CONFIG.RESOURCES) {
        const buyOrders = allOrders.filter((o: any) => o.resource === resource && o.type === "buy" && o.status === "open");
        const sellOrders = allOrders.filter((o: any) => o.resource === resource && o.type === "sell" && o.status === "open");

        const buyPrices = buyOrders.map((o: any) => o.pricePerUnit);
        const sellPrices = sellOrders.map((o: any) => o.pricePerUnit);

        const avgBuy = buyPrices.length > 0 ? buyPrices.reduce((a: number, b: number) => a + b) / buyPrices.length : 100;
        const avgSell = sellPrices.length > 0 ? sellPrices.reduce((a: number, b: number) => a + b) / sellPrices.length : 100;

        marketData[resource] = {
          lastPrice: avgSell,
          buyOrders: buyOrders.length,
          sellOrders: sellOrders.length,
          highestBid: Math.max(...buyPrices, 0),
          lowestAsk: Math.min(...sellPrices, Infinity),
          volume24h: (allOrders.filter((o: any) => o.resource === resource && o.status === "filled").reduce((sum: number, o: any) => sum + (o.filledQuantity || 0), 0)),
          spreadPercentage: sellPrices.length > 0 && buyPrices.length > 0
            ? ((avgSell - avgBuy) / avgBuy * 100).toFixed(2)
            : 0,
        };
      }

      res.json({ market: marketData });
    } catch (error) {
      console.error("Error getting resource market data:", error);
      res.status(500).json({ error: "Failed to get market data" });
    }
  });

  // Place a buy/sell order
  app.post("/api/resource-trading/place-order", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { type, resource, quantity, pricePerUnit } = req.body;

      if (!["buy", "sell"].includes(type) || !RESOURCE_TRADING_CONFIG.RESOURCES.includes(resource) || quantity < RESOURCE_TRADING_CONFIG.MIN_TRADE_AMOUNT || quantity > RESOURCE_TRADING_CONFIG.MAX_TRADE_AMOUNT || pricePerUnit < 1) {
        return res.status(400).json({ 
          error: "Invalid order parameters",
          constraints: {
            type: "buy or sell",
            resource: RESOURCE_TRADING_CONFIG.RESOURCES.join(", "),
            quantity: `${RESOURCE_TRADING_CONFIG.MIN_TRADE_AMOUNT} - ${RESOURCE_TRADING_CONFIG.MAX_TRADE_AMOUNT}`,
            pricePerUnit: ">= 1",
          },
        });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const resources = playerState.resources as any || {};

      // Validate resources for sell orders
      if (type === "sell") {
        if ((resources[resource] || 0) < quantity) {
          return res.status(400).json({ 
            error: `Insufficient ${resource} to sell`,
            available: resources[resource] || 0,
            requested: quantity,
          });
        }
      }

      // Create the order
      const order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        resource,
        quantity,
        pricePerUnit,
        totalValue: quantity * pricePerUnit,
        status: RESOURCE_TRADING_CONFIG.ORDER_STATUS.OPEN,
        createdAt: Date.now(),
        filledQuantity: 0,
      };

      const travelState = (playerState.travelState as any) || { resourceOrders: [] };
      if (!travelState.resourceOrders) {
        travelState.resourceOrders = [];
      }

      // For sell orders, reserve the resources
      let updatedResources = { ...resources };
      if (type === "sell") {
        updatedResources[resource] = (updatedResources[resource] || 0) - quantity;
      }

      // Try to match the order with existing orders
      const matchResult = matchResourceOrders(travelState.resourceOrders, order);
      
      if (matchResult.matches.length > 0) {
        // Process matches
        for (const match of matchResult.matches) {
          const matchedOrder = travelState.resourceOrders.find((o: any) => o.id === match.orderId);
          if (matchedOrder) {
            matchedOrder.filledQuantity = (matchedOrder.filledQuantity || 0) + match.quantity;
            matchedOrder.quantity -= match.quantity;
            
            if (matchedOrder.quantity <= 0) {
              matchedOrder.status = RESOURCE_TRADING_CONFIG.ORDER_STATUS.FILLED;
            } else {
              matchedOrder.status = RESOURCE_TRADING_CONFIG.ORDER_STATUS.PARTIAL;
            }
          }
        }

        order.filledQuantity = matchResult.matches.reduce((sum: number, m: any) => sum + m.quantity, 0);
        
        if (order.filledQuantity > 0) {
          if (order.filledQuantity >= order.quantity) {
            order.status = RESOURCE_TRADING_CONFIG.ORDER_STATUS.FILLED;
          } else {
            order.status = RESOURCE_TRADING_CONFIG.ORDER_STATUS.PARTIAL;
          }
        }
      }

      // Add order to registry
      travelState.resourceOrders.push(order);

      await db.update(playerStates)
        .set({
          resources: updatedResources,
          travelState: travelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      res.json({
        message: "Order placed successfully",
        order: {
          id: order.id,
          type: order.type,
          resource: order.resource,
          quantity: order.quantity - (matchResult.remainingQuantity || 0),
          pricePerUnit: order.pricePerUnit,
          status: order.status,
          filledQuantity: order.filledQuantity,
          matches: matchResult.matches,
        },
      });
    } catch (error) {
      console.error("Error placing resource order:", error);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  // Cancel an order
  app.post("/api/resource-trading/cancel-order", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const travelState = (playerState.travelState as any) || { resourceOrders: [] };
      const order = travelState.resourceOrders?.find((o: any) => o.id === orderId);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to cancel this order" });
      }

      if (order.status === RESOURCE_TRADING_CONFIG.ORDER_STATUS.CANCELLED || order.status === RESOURCE_TRADING_CONFIG.ORDER_STATUS.FILLED) {
        return res.status(400).json({ error: "Cannot cancel this order" });
      }

      // Refund resources if it was a sell order
      let resources = playerState.resources as any || {};
      if (order.type === "sell") {
        const unfilled = order.quantity - (order.filledQuantity || 0);
        resources[order.resource] = (resources[order.resource] || 0) + unfilled;
      }

      order.status = RESOURCE_TRADING_CONFIG.ORDER_STATUS.CANCELLED;

      await db.update(playerStates)
        .set({
          resources,
          travelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      res.json({
        message: "Order cancelled successfully",
        order,
      });
    } catch (error) {
      console.error("Error cancelling resource order:", error);
      res.status(500).json({ error: "Failed to cancel order" });
    }
  });

  // Get player's orders
  app.get("/api/resource-trading/my-orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const travelState = (playerState.travelState as any) || { resourceOrders: [] };
      const myOrders = (travelState.resourceOrders || []).filter((o: any) => o.userId === userId);

      res.json({
        orders: myOrders,
        count: myOrders.length,
      });
    } catch (error) {
      console.error("Error getting resource orders:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  // Get all open market orders
  app.get("/api/resource-trading/open-orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { resource, type } = req.query;

      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Collect all open orders from all players
      const allPlayers = await db.query.playerStates.findMany();
      let allOrders: any[] = [];

      for (const player of allPlayers) {
        const travelState = (player.travelState as any) || { resourceOrders: [] };
        const playerOrders = (travelState.resourceOrders || [])
          .filter((o: any) => o.status === RESOURCE_TRADING_CONFIG.ORDER_STATUS.OPEN && o.userId !== userId);
        allOrders.push(...playerOrders);
      }

      let filteredOrders = allOrders;
      if (resource) {
        filteredOrders = filteredOrders.filter((o: any) => o.resource === resource);
      }
      if (type) {
        filteredOrders = filteredOrders.filter((o: any) => o.type === type);
      }

      // Sort by price (best rates first)
      filteredOrders.sort((a: any, b: any) => {
        if (a.type === "buy") {
          return b.pricePerUnit - a.pricePerUnit; // Highest buy orders first
        } else {
          return a.pricePerUnit - b.pricePerUnit; // Lowest sell orders first
        }
      });

      res.json({
        orders: filteredOrders.slice(0, 100), // Top 100 orders
        count: filteredOrders.length,
      });
    } catch (error) {
      console.error("Error getting open resource orders:", error);
      res.status(500).json({ error: "Failed to get open orders" });
    }
  });

  // Get trade history
  app.get("/api/resource-trading/history", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const travelState = (playerState.travelState as any) || { resourceOrders: [] };
      
      // Get filled orders (trade history)
      const history = (travelState.resourceOrders || [])
        .filter((o: any) => o.status === RESOURCE_TRADING_CONFIG.ORDER_STATUS.FILLED && o.userId === userId)
        .sort((a: any, b: any) => b.createdAt - a.createdAt)
        .slice(0, 50); // Last 50 trades

      res.json({
        history,
        count: history.length,
      });
    } catch (error) {
      console.error("Error getting resource trade history:", error);
      res.status(500).json({ error: "Failed to get trade history" });
    }
  });
}
