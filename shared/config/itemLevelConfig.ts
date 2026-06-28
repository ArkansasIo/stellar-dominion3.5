// Item Level System
// Defines item levels, scaling, and progression for equipment

export interface ItemLevelConfig {
  level: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  statMultiplier: number;
  upgradeCost: ItemUpgradeCost;
  successRate: number;
  failurePenalty: "none" | "downgrade" | "destroy";
}

export interface ItemUpgradeCost {
  credits: number;
  metal: number;
  crystal: number;
  deuterium: number;
  upgradeTokens: number;
}

export interface ItemWithLevel {
  id: string;
  baseItem: any;
  level: number;
  experience: number;
  experienceToNext: number;
  stats: Record<string, number>;
  upgradeHistory: UpgradeAttempt[];
}

export interface UpgradeAttempt {
  timestamp: string;
  fromLevel: number;
  toLevel: number;
  success: boolean;
  cost: ItemUpgradeCost;
}

// Item level tiers
export const ITEM_LEVEL_TIERS: ItemLevelConfig[] = [
  { level: 1, name: "Common", description: "Basic item", icon: "⚪", color: "text-gray-400", statMultiplier: 1.0, upgradeCost: { credits: 1000, metal: 500, crystal: 200, deuterium: 100, upgradeTokens: 10 }, successRate: 1.0, failurePenalty: "none" },
  { level: 5, name: "Uncommon", description: "Slightly improved", icon: "🟢", color: "text-green-400", statMultiplier: 1.2, upgradeCost: { credits: 5000, metal: 2000, crystal: 800, deuterium: 400, upgradeTokens: 25 }, successRate: 0.95, failurePenalty: "none" },
  { level: 10, name: "Refined", description: "Well-crafted", icon: "🔵", color: "text-blue-400", statMultiplier: 1.5, upgradeCost: { credits: 15000, metal: 6000, crystal: 2500, deuterium: 1200, upgradeTokens: 50 }, successRate: 0.9, failurePenalty: "none" },
  { level: 15, name: "Superior", description: "High quality", icon: "🟣", color: "text-purple-400", statMultiplier: 1.8, upgradeCost: { credits: 40000, metal: 15000, crystal: 6000, deuterium: 3000, upgradeTokens: 100 }, successRate: 0.85, failurePenalty: "downgrade" },
  { level: 20, name: "Exceptional", description: "Exceptional craftsmanship", icon: "🟡", color: "text-yellow-400", statMultiplier: 2.2, upgradeCost: { credits: 100000, metal: 40000, crystal: 15000, deuterium: 7500, upgradeTokens: 200 }, successRate: 0.75, failurePenalty: "downgrade" },
  { level: 25, name: "Masterwork", description: "Master-level quality", icon: "🟠", color: "text-orange-400", statMultiplier: 2.8, upgradeCost: { credits: 250000, metal: 100000, crystal: 40000, deuterium: 20000, upgradeTokens: 400 }, successRate: 0.65, failurePenalty: "downgrade" },
  { level: 30, name: "Legendary", description: "Legendary tier", icon: "🔴", color: "text-red-400", statMultiplier: 3.5, upgradeCost: { credits: 500000, metal: 200000, crystal: 80000, deuterium: 40000, upgradeTokens: 800 }, successRate: 0.5, failurePenalty: "downgrade" },
  { level: 35, name: "Mythic", description: "Mythic tier", icon: "⭐", color: "text-yellow-500", statMultiplier: 4.5, upgradeCost: { credits: 1000000, metal: 400000, crystal: 160000, deuterium: 80000, upgradeTokens: 1500 }, successRate: 0.35, failurePenalty: "destroy" },
  { level: 40, name: "Transcendent", description: "Beyond mortal limits", icon: "💫", color: "text-cyan-400", statMultiplier: 6.0, upgradeCost: { credits: 2500000, metal: 1000000, crystal: 400000, deuterium: 200000, upgradeTokens: 3000 }, successRate: 0.2, failurePenalty: "destroy" },
  { level: 50, name: "Eternal", description: "Eternal artifact", icon: "♾️", color: "text-pink-500", statMultiplier: 10.0, upgradeCost: { credits: 10000000, metal: 5000000, crystal: 2000000, deuterium: 1000000, upgradeTokens: 10000 }, successRate: 0.1, failurePenalty: "destroy" },
];

// Calculate item stats based on level
export function calculateItemStats(baseItem: any, level: number): Record<string, number> {
  const baseStats = baseItem.stats || {};
  const levelConfig = getLevelConfig(level);
  const multiplier = levelConfig?.statMultiplier || 1.0;
  
  const scaledStats: Record<string, number> = {};
  for (const [stat, value] of Object.entries(baseStats)) {
    scaledStats[stat] = Math.floor((value as number) * multiplier);
  }
  
  // Add level-based bonuses
  scaledStats["itemLevel"] = level;
  scaledStats["itemPower"] = Math.floor(level * level * multiplier * 10);
  
  return scaledStats;
}

// Get level config for a given level
export function getLevelConfig(level: number): ItemLevelConfig | undefined {
  // Find the highest tier that the level qualifies for
  return [...ITEM_LEVEL_TIERS].reverse().find(t => level >= t.level);
}

// Calculate upgrade cost for next level
export function calculateUpgradeCost(currentLevel: number): ItemUpgradeCost {
  const nextConfig = getLevelConfig(currentLevel + 1);
  if (!nextConfig) {
    // Max level reached
    return { credits: 0, metal: 0, crystal: 0, deuterium: 0, upgradeTokens: 0 };
  }
  
  const baseCost = nextConfig.upgradeCost;
  const levelMultiplier = 1 + (currentLevel * 0.1);
  
  return {
    credits: Math.floor(baseCost.credits * levelMultiplier),
    metal: Math.floor(baseCost.metal * levelMultiplier),
    crystal: Math.floor(baseCost.crystal * levelMultiplier),
    deuterium: Math.floor(baseCost.deuterium * levelMultiplier),
    upgradeTokens: Math.floor(baseCost.upgradeTokens * levelMultiplier),
  };
}

// Attempt to upgrade an item
export function attemptItemUpgrade(
  currentLevel: number,
  luckBonus: number = 0
): { success: boolean; newLevel: number; penalty: string } {
  const config = getLevelConfig(currentLevel + 1);
  if (!config) {
    return { success: false, newLevel: currentLevel, penalty: "max_level" };
  }
  
  const successChance = Math.min(0.95, config.successRate + luckBonus);
  const roll = Math.random();
  
  if (roll < successChance) {
    return { success: true, newLevel: currentLevel + 1, penalty: "none" };
  }
  
  // Failure
  let penalty = config.failurePenalty;
  let newLevel = currentLevel;
  
  if (penalty === "downgrade") {
    newLevel = Math.max(1, currentLevel - 1);
  } else if (penalty === "destroy") {
    newLevel = 0; // Item destroyed
  }
  
  return { success: false, newLevel, penalty };
}

// Calculate experience needed for next level
export function calculateExperienceToNextLevel(currentLevel: number): number {
  return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
}

// Add experience to an item
export function addItemExperience(
  currentLevel: number,
  currentExp: number,
  expToAdd: number
): { newLevel: number; newExp: number; leveledUp: boolean } {
  let totalExp = currentExp + expToAdd;
  let level = currentLevel;
  let leveledUp = false;
  
  while (totalExp >= calculateExperienceToNextLevel(level)) {
    totalExp -= calculateExperienceToNextLevel(level);
    level++;
    leveledUp = true;
  }
  
  return { newLevel: level, newExp: totalExp, leveledUp };
}

// Get item level tier name
export function getItemLevelTierName(level: number): string {
  const config = getLevelConfig(level);
  return config?.name || "Unknown";
}

// Get item level tier color
export function getItemLevelTierColor(level: number): string {
  const config = getLevelConfig(level);
  return config?.color || "text-gray-400";
}

// Get item level tier icon
export function getItemLevelTierIcon(level: number): string {
  const config = getLevelConfig(level);
  return config?.icon || "⚪";
}
