import { PROGRESSION_CONFIG, ShipEquipment, DeviceInventory } from "../../shared/config/xenoberage/progressionConfig";
import { DEVICE_CONFIG, DeviceType } from "../../shared/config/xenoberage/deviceConfig";
import { COLONIZATION_CONFIG } from "../../shared/config/xenoberage/colonizationConfig";
import { db } from "../db";
import { eq, and } from "drizzle-orm";

/**
 * Calculate upgrade cost with exponential scaling.
 * Formula: upgradeCost * (upgradeFactor ^ (targetLevel - currentLevel))
 */
export function calculateUpgradeCost(
  currentLevel: number,
  targetLevel: number,
  baseCost: number = PROGRESSION_CONFIG.upgradeCost,
  upgradeFactor: number = PROGRESSION_CONFIG.upgradeFactor
): number {
  const levelDiff = targetLevel - currentLevel;
  if (levelDiff <= 0) return 0;
  return Math.floor(baseCost * Math.pow(upgradeFactor, levelDiff));
}

/**
 * Calculate effective item level from base level and level factor.
 * Formula: levelFactor ^ itemLevel
 */
export function calculateItemLevel(
  currentLevel: number,
  levelFactor: number = PROGRESSION_CONFIG.levelFactor
): number {
  return Math.pow(levelFactor, currentLevel);
}

/**
 * Upgrade ship equipment to next level.
 */
export async function upgradeShipEquipment(
  userId: string,
  equipmentType: keyof ShipEquipment,
  currentLevel: number
): Promise<{ success: boolean; newLevel: number; cost: number }> {
  const newLevel = currentLevel + 1;
  const cost = calculateUpgradeCost(currentLevel, newLevel);

  // TODO: Deduct resources and update database

  return {
    success: true,
    newLevel,
    cost,
  };
}

/**
 * Calculate device purchase price from config.
 */
export function calculateDevicePrice(
  deviceType: DeviceType,
  config: { price: number } = DEVICE_CONFIG[deviceType]
): number {
  return config.price;
}

/**
 * Check if player can afford an upgrade.
 */
export function canAffordUpgrade(
  resources: { credits: number; ore?: number; goods?: number; organics?: number },
  cost: number
): boolean {
  return resources.credits >= cost;
}

/**
 * Calculate base strength bonus from base level.
 * Formula: baseLevel * baseDefense factor
 */
export function calculateBaseStrength(
  baseLevel: number,
  baseDefense: number = COLONIZATION_CONFIG.basedefense
): number {
  return baseLevel * baseDefense;
}
