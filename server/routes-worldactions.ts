import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { storage } from "./storage";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

function getExchangeRate(from: string, to: string): number {
  const rates: Record<string, number> = {
    "metal:crystal": 0.67,
    "metal:deuterium": 0.33,
    "crystal:metal": 1.5,
    "crystal:deuterium": 0.5,
    "deuterium:metal": 3,
    "deuterium:crystal": 2,
  };

  return rates[`${from}:${to}`] ?? 0;
}

function getMarketHistoryKey(userId: string) {
  return `market_exchange_history:${userId}`;
}

function getMarketPriceTrendKey() {
  return "market_price_trends";
}

function getExplorationQuestClaimsKey(userId: string) {
  return `exploration_quest_claims:${userId}`;
}

function getExplorationDebrisHarvestsKey(userId: string) {
  return `exploration_debris_harvests:${userId}`;
}

async function getExplorationQuestClaims(userId: string) {
  const setting = await storage.getSetting(getExplorationQuestClaimsKey(userId));
  return Array.isArray(setting?.value) ? (setting!.value as string[]) : [];
}

async function setExplorationQuestClaims(userId: string, claimedQuestIds: string[]) {
  await storage.setSetting(
    getExplorationQuestClaimsKey(userId),
    claimedQuestIds.slice(0, 200),
    "Claimed exploration quest rewards",
    "exploration",
  );
}

async function getExplorationDebrisHarvests(userId: string) {
  const setting = await storage.getSetting(getExplorationDebrisHarvestsKey(userId));
  return Array.isArray(setting?.value) ? (setting!.value as string[]) : [];
}

async function setExplorationDebrisHarvests(userId: string, harvestedDebrisIds: string[]) {
  await storage.setSetting(
    getExplorationDebrisHarvestsKey(userId),
    harvestedDebrisIds.slice(0, 200),
    "Harvested exploration debris fields",
    "exploration",
  );
}

async function getMarketHistory(userId: string) {
  const setting = await storage.getSetting(getMarketHistoryKey(userId));
  return Array.isArray(setting?.value) ? (setting!.value as any[]) : [];
}

async function appendMarketHistory(userId: string, entry: any) {
  const history = await getMarketHistory(userId);
  await storage.setSetting(getMarketHistoryKey(userId), [entry, ...history].slice(0, 50), "Market exchange history", "economy");
}

async function getMarketTrends() {
  const setting = await storage.getSetting(getMarketPriceTrendKey());
  return Array.isArray(setting?.value) ? (setting!.value as any[]) : [];
}

async function upsertMarketTrend(item: string, change: number) {
  const trends = await getMarketTrends();
  const nextEntry = {
    item,
    change,
    direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
    updatedAt: Date.now(),
  };
  const withoutCurrent = trends.filter((trend) => trend.item !== item);
  await storage.setSetting(getMarketPriceTrendKey(), [nextEntry, ...withoutCurrent].slice(0, 20), "Market price trends", "economy");
}

router.post("/api/army/deploy", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const troopId = String(req.body?.troopId || "");
    const troopName = String(req.body?.troopName || "Unknown Troop");
    const deploymentType = String(req.body?.deploymentType || "field");

    if (!troopId) {
      return res.status(400).json({ error: "Troop ID is required" });
    }

    const missionId = `army_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    res.json({
      success: true,
      missionId,
      userId,
      troopId,
      troopName,
      deploymentType,
      status: "deployed",
      deployedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[army/deploy]", error);
    res.status(500).json({ error: "Failed to deploy troop" });
  }
});

router.post("/api/army/manage", isAuthenticated, async (req, res) => {
  try {
    const troopId = String(req.body?.troopId || "");
    const troopName = String(req.body?.troopName || "Unknown Troop");
    const action = String(req.body?.action || "equip");

    if (!troopId) {
      return res.status(400).json({ error: "Troop ID is required" });
    }

    res.json({
      success: true,
      troopId,
      troopName,
      action,
      message: `Management action '${action}' prepared for ${troopName}`,
    });
  } catch (error) {
    console.error("[army/manage]", error);
    res.status(500).json({ error: "Failed to manage troop" });
  }
});

router.post("/api/exploration/scan", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const anomalyId = String(req.body?.anomalyId || "");
    const anomalyName = String(req.body?.anomalyName || "Unknown Anomaly");
    const hazardLevel = Number(req.body?.hazardLevel ?? 0);
    const rewards = req.body?.rewards || { metal: 0, crystal: 0, deuterium: 0 };

    if (!anomalyId) {
      return res.status(400).json({ error: "Anomaly ID is required" });
    }

    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return res.status(404).json({ error: "Player state not found" });
    }

    const currentResources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    const rewardScale = Math.max(0.2, 1 - hazardLevel * 0.04);
    const gained = {
      metal: Math.floor(Number(rewards.metal || 0) * rewardScale),
      crystal: Math.floor(Number(rewards.crystal || 0) * rewardScale),
      deuterium: Math.floor(Number(rewards.deuterium || 0) * rewardScale),
    };

    const updatedResources = {
      ...currentResources,
      metal: Number(currentResources.metal || 0) + gained.metal,
      crystal: Number(currentResources.crystal || 0) + gained.crystal,
      deuterium: Number(currentResources.deuterium || 0) + gained.deuterium,
      energy: Number(currentResources.energy || 0),
    };

    await db
      .update(playerStates)
      .set({ resources: updatedResources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    res.json({
      success: true,
      anomalyId,
      anomalyName,
      gained,
      resources: updatedResources,
    });
  } catch (error) {
    console.error("[exploration/scan]", error);
    res.status(500).json({ error: "Failed to scan anomaly" });
  }
});

router.post("/api/exploration/warp-action", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const gateId = String(req.body?.gateId || "");
    const gateName = String(req.body?.gateName || "Unknown Gate");
    const action = String(req.body?.action || "jump");
    const energyCost = Math.max(0, Number(req.body?.energyCost || 0));

    if (!gateId) {
      return res.status(400).json({ error: "Gate ID is required" });
    }

    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return res.status(404).json({ error: "Player state not found" });
    }

    const currentResources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    if (Number(currentResources.deuterium || 0) < energyCost) {
      return res.status(400).json({ error: "Insufficient deuterium" });
    }

    const updatedResources = {
      ...currentResources,
      deuterium: Number(currentResources.deuterium || 0) - energyCost,
    };

    await db
      .update(playerStates)
      .set({ resources: updatedResources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    res.json({
      success: true,
      gateId,
      gateName,
      action,
      energyCost,
      resources: updatedResources,
    });
  } catch (error) {
    console.error("[exploration/warp-action]", error);
    res.status(500).json({ error: "Failed warp action" });
  }
});

router.get("/api/exploration/state", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const [claimedQuestIds, harvestedDebrisIds] = await Promise.all([
      getExplorationQuestClaims(userId),
      getExplorationDebrisHarvests(userId),
    ]);

    res.json({
      claimedQuestIds,
      harvestedDebrisIds,
    });
  } catch (error) {
    console.error("[exploration/state]", error);
    res.status(500).json({ error: "Failed to load exploration state" });
  }
});

router.post("/api/exploration/quest-claim", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const questId = String(req.body?.questId || "");
    const rewards = req.body?.rewards || {};

    if (!questId) {
      return res.status(400).json({ error: "Quest ID is required" });
    }

    const claimedQuestIds = await getExplorationQuestClaims(userId);
    if (claimedQuestIds.includes(questId)) {
      return res.status(400).json({ error: "Quest reward already claimed" });
    }

    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return res.status(404).json({ error: "Player state not found" });
    }

    const currentResources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    const currentCommander = (playerState.commander as any) || {};
    const currentStats = currentCommander.stats || { level: 1, xp: 0, warfare: 1, logistics: 1, science: 1, engineering: 1 };

    const gain = {
      metal: Math.max(0, Number(rewards.metal || 0)),
      crystal: Math.max(0, Number(rewards.crystal || 0)),
      deuterium: Math.max(0, Number(rewards.deuterium || 0)),
      xp: Math.max(0, Number(rewards.xp || 0)),
    };

    const updatedResources = {
      ...currentResources,
      metal: Number(currentResources.metal || 0) + gain.metal,
      crystal: Number(currentResources.crystal || 0) + gain.crystal,
      deuterium: Number(currentResources.deuterium || 0) + gain.deuterium,
      energy: Number(currentResources.energy || 0),
    };

    const updatedCommander = {
      ...currentCommander,
      stats: {
        ...currentStats,
        xp: Number(currentStats.xp || 0) + gain.xp,
      },
    };

    await db
      .update(playerStates)
      .set({ resources: updatedResources, commander: updatedCommander, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    await setExplorationQuestClaims(userId, [questId, ...claimedQuestIds]);

    res.json({
      success: true,
      questId,
      gain,
      resources: updatedResources,
      commander: updatedCommander,
    });
  } catch (error) {
    console.error("[exploration/quest-claim]", error);
    res.status(500).json({ error: "Failed to claim quest reward" });
  }
});

router.post("/api/exploration/debris-harvest", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const debrisId = String(req.body?.debrisId || "");
    const debrisName = String(req.body?.debrisName || "Unknown Debris Field");
    const resources = req.body?.resources || {};
    const harvestProgress = Math.max(0, Math.min(100, Number(req.body?.harvestProgress || 0)));

    if (!debrisId) {
      return res.status(400).json({ error: "Debris ID is required" });
    }

    const harvestedDebrisIds = await getExplorationDebrisHarvests(userId);
    if (harvestedDebrisIds.includes(debrisId)) {
      return res.status(400).json({ error: "Debris field already harvested" });
    }

    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return res.status(404).json({ error: "Player state not found" });
    }

    const currentResources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    const harvestFactor = Math.max(0.1, 1 - harvestProgress / 100);
    const gain = {
      metal: Math.floor(Math.max(0, Number(resources.metal || 0)) * harvestFactor),
      crystal: Math.floor(Math.max(0, Number(resources.crystal || 0)) * harvestFactor),
      deuterium: Math.floor(Math.max(0, Number(resources.deuterium || 0)) * harvestFactor),
    };

    const updatedResources = {
      ...currentResources,
      metal: Number(currentResources.metal || 0) + gain.metal,
      crystal: Number(currentResources.crystal || 0) + gain.crystal,
      deuterium: Number(currentResources.deuterium || 0) + gain.deuterium,
      energy: Number(currentResources.energy || 0),
    };

    await db
      .update(playerStates)
      .set({ resources: updatedResources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    await setExplorationDebrisHarvests(userId, [debrisId, ...harvestedDebrisIds]);

    res.json({
      success: true,
      debrisId,
      debrisName,
      gain,
      resources: updatedResources,
    });
  } catch (error) {
    console.error("[exploration/debris-harvest]", error);
    res.status(500).json({ error: "Failed to harvest debris" });
  }
});

router.post("/api/market/exchange", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const from = String(req.body?.from || "");
    const to = String(req.body?.to || "");
    const amount = Math.floor(Number(req.body?.amount || 0));

    if (!from || !to || from === to) {
      return res.status(400).json({ error: "Invalid exchange pair" });
    }

    if (!["metal", "crystal", "deuterium"].includes(from) || !["metal", "crystal", "deuterium"].includes(to)) {
      return res.status(400).json({ error: "Invalid resource type" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" });
    }

    const rate = getExchangeRate(from, to);
    if (rate <= 0) {
      return res.status(400).json({ error: "Unsupported exchange route" });
    }

    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return res.status(404).json({ error: "Player state not found" });
    }

    const currentResources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    if (Number(currentResources[from] || 0) < amount) {
      return res.status(400).json({ error: `Insufficient ${from}` });
    }

    const fee = Math.floor(amount * 0.1);
    const converted = Math.floor((amount - fee) * rate);

    const updatedResources = {
      ...currentResources,
      [from]: Number(currentResources[from] || 0) - amount,
      [to]: Number(currentResources[to] || 0) + converted,
    };

    await db
      .update(playerStates)
      .set({ resources: updatedResources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    await appendMarketHistory(userId, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: "exchange",
      item: `${from} -> ${to}`,
      amount,
      cost: { [from]: amount },
      received: { [to]: converted },
      date: new Date().toISOString(),
    });

    await upsertMarketTrend(`${from} -> ${to}`, Number(((rate - 1) * 100).toFixed(1)));

    res.json({
      success: true,
      from,
      to,
      amount,
      fee,
      rate,
      converted,
      resources: updatedResources,
    });
  } catch (error) {
    console.error("[market/exchange]", error);
    res.status(500).json({ error: "Failed resource exchange" });
  }
});

router.get("/api/market/history", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId as string;
    const history = await getMarketHistory(userId);
    res.json({ history, count: history.length });
  } catch (error) {
    console.error("[market/history]", error);
    res.status(500).json({ error: "Failed to load market history" });
  }
});

router.get("/api/market/price-trends", isAuthenticated, async (_req, res) => {
  try {
    const trends = await getMarketTrends();
    res.json({ trends, count: trends.length });
  } catch (error) {
    console.error("[market/price-trends]", error);
    res.status(500).json({ error: "Failed to load market price trends" });
  }
});

export default router;