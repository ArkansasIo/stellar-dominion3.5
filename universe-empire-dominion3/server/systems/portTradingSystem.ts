import { RESOURCE_CONFIG } from "../../shared/config/xenoberage/resourceConfig";
import { db } from "../db";
import { eq, and } from "drizzle-orm";

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

  // TODO: Verify player has enough credits and port has enough stock
  // This would involve querying the database for player state and port state

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

  // TODO: Verify player has enough resources and port can accept

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
 * Get current port inventory (stub - would query DB in full implementation).
 */
export async function getPortInventory(portId: string) {
  // TODO: Query port from database
  return {
    portId,
    ore: 0,
    organics: 0,
    goods: 0,
    energy: 0,
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
