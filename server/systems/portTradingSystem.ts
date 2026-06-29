import { RESOURCE_CONFIG } from "../../Source/Shared/config/xenoberage/resourceConfig";
import { db } from "../db";
import { playerStates } from "../../Source/Shared/schema";
import { eq } from "drizzle-orm";

export const PORT_REGEN_RATE = RESOURCE_CONFIG.portRegenRate;

/**
 * Calculate dynamic port price based on supply/demand delta.
 * Formula: basePrice + delta * (supply - demand) / (supply + demand)
 * Price is clamped to at least 1.
 */
export function calculatePortPrice(
  basePrice: number,
  delta: number,
  supply: number,
  demand: number
): number {
  const total = supply + demand;
  if (total === 0) return basePrice;
  const price = basePrice + delta * ((supply - demand) / total);
  return Math.max(1, Math.round(price * 100) / 100);
}

/**
 * Buy resources from a port.
 * Deducts credits from player and adds resources.
 */
export async function buyFromPort(
  userId: string,
  resource: string,
  amount: number
): Promise<{ success: boolean; message: string; cost?: number }> {
  if (amount <= 0) {
    return { success: false, message: "Invalid amount" };
  }

  const priceConfig = getResourcePriceConfig(resource);
  if (!priceConfig) {
    return { success: false, message: "Invalid resource type" };
  }

  const totalCost = amount * priceConfig.price;

  const playerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
  });

  if (!playerState) {
    return { success: false, message: "Player not found" };
  }

  const resources = (playerState.resources as any) || {};
  const credits = resources.credits || 0;

  if (credits < totalCost) {
    return { success: false, message: "Insufficient credits" };
  }

  const resourceKey = resource === "ore" ? "metal" : resource === "organics" ? "crystal" : "deuterium";

  await db.update(playerStates).set({
    resources: {
      ...resources,
      credits: credits - totalCost,
      [resourceKey]: (resources[resourceKey] || 0) + amount,
    },
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, userId));

  return {
    success: true,
    message: `Bought ${amount} ${resource} from port`,
    cost: totalCost,
  };
}

/**
 * Sell resources to a port.
 * Adds credits to player and removes resources.
 */
export async function sellToPort(
  userId: string,
  resource: string,
  amount: number
): Promise<{ success: boolean; message: string; profit?: number }> {
  if (amount <= 0) {
    return { success: false, message: "Invalid amount" };
  }

  const priceConfig = getResourcePriceConfig(resource);
  if (!priceConfig) {
    return { success: false, message: "Invalid resource type" };
  }

  const totalProfit = amount * priceConfig.price;

  const playerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
  });

  if (!playerState) {
    return { success: false, message: "Player not found" };
  }

  const resources = (playerState.resources as any) || {};
  const resourceKey = resource === "ore" ? "metal" : resource === "organics" ? "crystal" : "deuterium";
  const currentAmount = resources[resourceKey] || 0;

  if (currentAmount < amount) {
    return { success: false, message: "Insufficient resources" };
  }

  await db.update(playerStates).set({
    resources: {
      ...resources,
      credits: (resources.credits || 0) + totalProfit,
      [resourceKey]: currentAmount - amount,
    },
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, userId));

  return {
    success: true,
    message: `Sold ${amount} ${resource} to port`,
    profit: totalProfit,
  };
}

/**
 * Regenerate port resources per tick.
 * Adds regenRate * portRegenRate to each resource up to the limit.
 */
export function regeneratePortResources(
  currentResources: {
    ore: number;
    organics: number;
    goods: number;
    energy: number;
  },
  regenRate: number = PORT_REGEN_RATE
): { ore: number; organics: number; goods: number; energy: number } {
  return {
    ore: Math.min(
      currentResources.ore + RESOURCE_CONFIG.ore.rate * regenRate,
      RESOURCE_CONFIG.ore.limit
    ),
    organics: Math.min(
      currentResources.organics + RESOURCE_CONFIG.organics.rate * regenRate,
      RESOURCE_CONFIG.organics.limit
    ),
    goods: Math.min(
      currentResources.goods + RESOURCE_CONFIG.goods.rate * regenRate,
      RESOURCE_CONFIG.goods.limit
    ),
    energy: Math.min(
      currentResources.energy + RESOURCE_CONFIG.energy.rate * regenRate,
      RESOURCE_CONFIG.energy.limit
    ),
  };
}

/**
 * Get current port inventory from the database.
 */
export async function getPortInventory(portId: string) {
  const playerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, portId),
  });

  if (!playerState) {
    return { portId, ore: 0, organics: 0, goods: 0, energy: 0 };
  }

  const resources = (playerState.resources as any) || {};
  return {
    portId,
    ore: resources.metal || 0,
    organics: resources.crystal || 0,
    goods: resources.deuterium || 0,
    energy: resources.energy || 0,
  };
}

/**
 * Calculate profit from a trade (buy low, sell high).
 */
export function calculateTradeProfit(
  buyPrice: number,
  sellPrice: number,
  amount: number
): number {
  return (sellPrice - buyPrice) * amount;
}

function getResourcePriceConfig(resource: string) {
  const configs: Record<string, { price: number; delta: number }> = {
    ore: { price: RESOURCE_CONFIG.ore.price, delta: RESOURCE_CONFIG.ore.delta },
    organics: { price: RESOURCE_CONFIG.organics.price, delta: RESOURCE_CONFIG.organics.delta },
    goods: { price: RESOURCE_CONFIG.goods.price, delta: RESOURCE_CONFIG.goods.delta },
    energy: { price: RESOURCE_CONFIG.energy.price, delta: RESOURCE_CONFIG.energy.delta },
  };
  return configs[resource] || null;
}
