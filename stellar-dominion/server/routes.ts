import { Router, Request, Response } from "express";
import { eq, desc, and, or, like, asc, sql } from "drizzle-orm";
import { createHash } from "crypto";
import { db } from "./db";
import {
  users,
  playerStates,
  missions,
  messages,
  alliances,
  allianceMembers,
  marketOrders,
  auctionListings,
  auctionBids,
  playerCurrency,
  currencyTransactions,
  bankAccounts,
  bankTransactions,
  empireValues,
  playerItems,
} from "@shared/schema";
import { storage } from "./storage";

// Augment express-session types
declare module "express-session" {
  interface Session {
    userId?: string;
  }
}

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const getUserId = (req: Request): string => req.session.userId || "";

export function registerRoutes(app: any) {
  // ==== AUTHENTICATION ====

  app.post("/api/auth/register", async (req: Request, res: any) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Missing credentials" });
      }

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      if (existing.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hash = createHash("sha256")
        .update(password)
        .digest("hex");
      const [user] = await db
        .insert(users)
        .values({ username, passwordHash: hash })
        .returning();

      req.session.userId = user.id;
      res.json({ userId: user.id, username });
    } catch (error: any) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: any) => {
    try {
      const { username, password } = req.body;
      const hash = createHash("sha256")
        .update(password)
        .digest("hex");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      if (!user || user.passwordHash !== hash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ userId: user.id, username });
    } catch (error: any) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: any) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // ==== PLAYER STATE ====

  app.get("/api/player/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      res.json(state || {});
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch player state" });
    }
  });

  // Backward-compatible game state routes used by the client game context.
  app.get("/api/game/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      res.json(state || {});
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch game state" });
    }
  });

  app.patch("/api/game/state", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const updates = req.body || {};
      const updated = await storage.updatePlayerState(userId, updates);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update game state" });
    }
  });

  // ==== PROGRESSION ====

  app.get("/api/progression/tier", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      res.json({ tier: state?.tier || 1, tierExperience: state?.tierExperience || 0 });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch tier" });
    }
  });

  app.post("/api/progression/tier/add-xp", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      const updated = await storage.addTierExperience(userId, amount || 0);
      res.json({ tier: updated.tier, tierExperience: updated.tierExperience });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to add tier XP" });
    }
  });

  app.get("/api/progression/empire", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      res.json({ empireLevel: state?.empireLevel || 1, empireExperience: state?.empireExperience || 0 });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch empire level" });
    }
  });

  app.post("/api/progression/empire/add-xp", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      const updated = await storage.addEmpireExperience(userId, amount || 0);
      res.json({ empireLevel: updated.empireLevel, empireExperience: updated.empireExperience });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to add empire XP" });
    }
  });

  // ==== CURRENCY ====

  app.get("/api/currency/balance", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const currency = await storage.getPlayerCurrency(userId);
      res.json(currency);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch currency" });
    }
  });

  app.post("/api/currency/add", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { silver = 0, gold = 0, platinum = 0, reason = "unknown" } = req.body;
      const updated = await storage.addCurrency(userId, silver, gold, platinum, reason);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to add currency" });
    }
  });

  app.get("/api/currency/transactions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const transactions = await db
        .select()
        .from(currencyTransactions)
        .where(eq(currencyTransactions.userId, userId))
        .orderBy(desc(currencyTransactions.createdAt))
        .limit(50);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ==== BANK ====

  app.get("/api/bank/account", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const account = await storage.getBankAccount(userId);
      res.json(account);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch bank account" });
    }
  });

  app.post("/api/bank/deposit", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
      const updated = await storage.depositToBankAccount(userId, amount);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to deposit" });
    }
  });

  app.post("/api/bank/withdraw", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const { amount } = req.body;
      if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
      const updated = await storage.withdrawFromBankAccount(userId, amount);
      res.json(updated);
    } catch (error: any) {
      if ((error?.message || "").includes("Insufficient")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message || "Failed to withdraw" });
    }
  });

  app.get("/api/bank/transactions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const transactions = await db
        .select()
        .from(bankTransactions)
        .where(eq(bankTransactions.userId, userId))
        .orderBy(desc(bankTransactions.createdAt))
        .limit(50);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ==== EMPIRE VALUE ====

  app.get("/api/empire/value", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const value = await storage.calculateEmpireValue(userId);
      res.json(value);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to calculate empire value" });
    }
  });

  app.get("/api/empire/rankings", async (req: Request, res: any) => {
    try {
      const rankings = await storage.getEmpireRankings();
      res.json(rankings);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch rankings" });
    }
  });

  // ==== INVENTORY ====

  app.get("/api/inventory", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const items = await db
        .select()
        .from(playerItems)
        .where(eq(playerItems.playerId, userId));
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // ==== FACILITIES ====

  app.get("/api/facilities/types", async (req: Request, res: any) => {
    const types = ["resource", "energy", "storage", "military", "research", "civilian", "special"];
    res.json({ types, totalFacilities: 120 });
  });

  // ==== COMBAT ====

  app.get("/api/combat/formations", async (req: Request, res: any) => {
    const formations = [
      { name: "Balanced", bonus: 1.0, offense: 1.0, defense: 1.0 },
      { name: "Aggressive", bonus: 1.5, offense: 1.4, defense: 0.8 },
      { name: "Defensive", bonus: 0.7, offense: 0.7, defense: 1.5 },
      { name: "Flanking", bonus: 1.8, offense: 1.8, defense: 0.6 },
      { name: "Pincer", bonus: 2.0, offense: 2.0, defense: 0.7 },
    ];
    res.json(formations);
  });

  // ==== KNOWLEDGE ====

  app.get("/api/knowledge/types", async (req: Request, res: any) => {
    const types = ["Military", "Engineering", "Science", "Agriculture", "Commerce", "Diplomacy", "Exploration", "Arcane", "Medicine", "Espionage"];
    res.json({ types, total: types.length });
  });

  app.get("/api/knowledge/progress/:type", isAuthenticated, async (req: Request, res: any) => {
    res.json({ type: req.params.type, level: 1, progress: 0, mastery: 0 });
  });

  // ==== RAID BOSSES ====

  app.get("/api/bosses", isAuthenticated, async (req: Request, res: any) => {
    try {
      const rarity = typeof req.query.rarity === "string" ? req.query.rarity : null;
      const bosses = rarity
        ? await storage.getBossesByRarity(rarity)
        : await storage.getAllBosses();
      res.json(bosses);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to fetch bosses" });
    }
  });

  app.post("/api/bosses/:bossId/challenge", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const bossId = req.params.bossId;
      const boss = await storage.getBossById(bossId);
      if (!boss) return res.status(404).json({ message: "Boss not found" });

      const player = await storage.getPlayerState(userId);
      if (!player) return res.status(404).json({ message: "Player state not found" });

      const currentResources = (player.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
      const challengeCost = 500;
      if (Number(currentResources.deuterium || 0) < challengeCost) {
        return res.status(400).json({ message: "Insufficient deuterium to launch raid" });
      }

      const updatedResources = {
        ...currentResources,
        deuterium: Number(currentResources.deuterium || 0) - challengeCost,
      };

      await storage.updatePlayerState(userId, { resources: updatedResources } as any);

      res.json({
        success: true,
        bossId,
        bossName: boss.name,
        challengeCost,
        message: `Fleet dispatched against ${boss.name}`,
      });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to challenge boss" });
    }
  });

  // ==== AUCTION HOUSE ====

  app.get("/api/auctions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const itemType = typeof req.query.itemType === "string" ? req.query.itemType : "all";
      const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
      const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "newest";

      const now = new Date();

      await db
        .update(auctionListings)
        .set({ status: "expired" })
        .where(and(eq(auctionListings.status, "active"), sql`${auctionListings.expiresAt} <= ${now}`));

      const filters: any[] = [eq(auctionListings.status, "active")];
      if (itemType !== "all") {
        filters.push(eq(auctionListings.itemType, itemType));
      }
      if (search) {
        filters.push(
          or(
            like(auctionListings.itemName, `%${search}%`),
            like(auctionListings.itemDescription, `%${search}%`),
            like(auctionListings.sellerName, `%${search}%`),
          ),
        );
      }

      let sortClause: any = desc(auctionListings.createdAt);
      if (sortBy === "ending_soon") sortClause = asc(auctionListings.expiresAt);
      if (sortBy === "price_low") sortClause = asc(sql`COALESCE(${auctionListings.currentBid}, ${auctionListings.startingPrice})`);
      if (sortBy === "price_high") sortClause = desc(sql`COALESCE(${auctionListings.currentBid}, ${auctionListings.startingPrice})`);

      const listings = await db
        .select()
        .from(auctionListings)
        .where(and(...filters))
        .orderBy(sortClause)
        .limit(200);

      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load auctions" });
    }
  });

  app.post("/api/auctions", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return res.status(404).json({ message: "User not found" });

      const {
        itemType,
        itemId,
        itemName,
        itemDescription,
        itemRarity,
        quantity,
        startingPrice,
        buyoutPrice,
        bidIncrement,
        duration,
      } = req.body || {};

      if (!itemType || !itemName || Number(startingPrice) <= 0) {
        return res.status(400).json({ message: "Invalid auction payload" });
      }

      const safeDuration = Math.max(1, Math.min(72, Number(duration) || 24));
      const expiresAt = new Date(Date.now() + safeDuration * 60 * 60 * 1000);

      const [created] = await db
        .insert(auctionListings)
        .values({
          sellerId: userId,
          sellerName: user.username || "Unknown Trader",
          itemType: String(itemType),
          itemId: String(itemId || itemName).toLowerCase().replace(/\s+/g, "_"),
          itemName: String(itemName),
          itemDescription: itemDescription ? String(itemDescription) : null,
          itemRarity: String(itemRarity || "common"),
          itemData: {},
          quantity: Math.max(1, Number(quantity) || 1),
          startingPrice: Math.max(1, Number(startingPrice) || 1),
          buyoutPrice: Number(buyoutPrice) > 0 ? Number(buyoutPrice) : null,
          currentBid: 0,
          bidIncrement: Math.max(1, Number(bidIncrement) || 10),
          duration: safeDuration,
          expiresAt,
          status: "active",
        })
        .returning();

      res.json(created);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to create auction" });
    }
  });

  app.get("/api/auctions/user/listings", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const listings = await db
        .select()
        .from(auctionListings)
        .where(eq(auctionListings.sellerId, userId))
        .orderBy(desc(auctionListings.createdAt))
        .limit(200);

      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load user listings" });
    }
  });

  app.get("/api/auctions/user/bids", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const bids = await db
        .select()
        .from(auctionBids)
        .where(eq(auctionBids.bidderId, userId))
        .orderBy(desc(auctionBids.createdAt))
        .limit(300);

      const uniqueAuctionIds = Array.from(new Set(bids.map((bid) => bid.auctionId)));
      if (uniqueAuctionIds.length === 0) {
        return res.json([]);
      }

      const listings = await db
        .select()
        .from(auctionListings)
        .where(or(...uniqueAuctionIds.map((id) => eq(auctionListings.id, id))))
        .orderBy(desc(auctionListings.createdAt));

      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load user bids" });
    }
  });

  app.post("/api/auctions/:auctionId/bid", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const auctionId = req.params.auctionId;
      const bidAmount = Number(req.body?.bidAmount || 0);

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return res.status(404).json({ message: "User not found" });

      const [listing] = await db.select().from(auctionListings).where(eq(auctionListings.id, auctionId));
      if (!listing) return res.status(404).json({ message: "Auction not found" });
      if (listing.status !== "active") return res.status(400).json({ message: "Auction is not active" });
      if (listing.sellerId === userId) return res.status(400).json({ message: "Cannot bid on your own listing" });
      if (new Date(listing.expiresAt).getTime() <= Date.now()) {
        await db.update(auctionListings).set({ status: "expired" }).where(eq(auctionListings.id, auctionId));
        return res.status(400).json({ message: "Auction has expired" });
      }

      const minimumBid = Math.max(
        listing.startingPrice,
        (listing.currentBid || 0) + Math.max(1, listing.bidIncrement || 1),
      );
      if (bidAmount < minimumBid) {
        return res.status(400).json({ message: `Bid must be at least ${minimumBid}` });
      }

      await db.insert(auctionBids).values({
        auctionId,
        bidderId: userId,
        bidderName: user.username || "Unknown Bidder",
        bidAmount,
      });

      const [updated] = await db
        .update(auctionListings)
        .set({
          currentBid: bidAmount,
          currentBidderId: userId,
          currentBidderName: user.username || "Unknown Bidder",
          bidCount: (listing.bidCount || 0) + 1,
        })
        .where(eq(auctionListings.id, auctionId))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to place bid" });
    }
  });

  app.post("/api/auctions/:auctionId/buyout", isAuthenticated, async (req: Request, res: any) => {
    try {
      const userId = getUserId(req);
      const auctionId = req.params.auctionId;

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return res.status(404).json({ message: "User not found" });

      const [listing] = await db.select().from(auctionListings).where(eq(auctionListings.id, auctionId));
      if (!listing) return res.status(404).json({ message: "Auction not found" });
      if (listing.status !== "active") return res.status(400).json({ message: "Auction is not active" });
      if (listing.sellerId === userId) return res.status(400).json({ message: "Cannot buyout your own listing" });
      if (!listing.buyoutPrice || listing.buyoutPrice <= 0) return res.status(400).json({ message: "Buyout not available" });

      const [updated] = await db
        .update(auctionListings)
        .set({
          status: "sold",
          completedAt: new Date(),
          currentBid: listing.buyoutPrice,
          currentBidderId: userId,
          currentBidderName: user.username || "Unknown Buyer",
          bidCount: Math.max(1, listing.bidCount || 0),
        })
        .where(eq(auctionListings.id, auctionId))
        .returning();

      await db.insert(auctionBids).values({
        auctionId,
        bidderId: userId,
        bidderName: user.username || "Unknown Buyer",
        bidAmount: listing.buyoutPrice,
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed buyout" });
    }
  });
}

export default registerRoutes;
