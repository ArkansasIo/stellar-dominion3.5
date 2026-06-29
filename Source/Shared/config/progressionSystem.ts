/**
 * Unified Game Progression System
 * Supports 1-99 Tiers and 1-999 Levels for all game entities
 * Handles cost scaling, time scaling, and stat scaling
 */

export interface ProgressionStats {
  level: number;
  tier: number;
  totalExperience: number;
  levelProgress: number;
}

export interface ScalingConfig {
  baseCost: { metal: number; crystal: number; deuterium: number };
  baseTime: number; // in seconds
  baseStats: Record<string, number>;
  levelMultiplier: number; // exponential multiplier per level
  tierMultiplier: number; // exponential multiplier per tier
  tierCostIncrease: number; // cost increase when advancing tier
  tierTimeIncrease: number; // time increase when advancing tier
}

export interface ProgressedEntity {
  id: string;
  name: string;
  level: number;
  tier: number;
  experience: number;
  maxExperience: number;
  stats: Record<string, number>;
  currentCost: { metal: number; crystal: number; deuterium: number };
  currentBuildTime: number;
}

export class ProgressionSystem {
  // Maximum tiers and levels
  static readonly MAX_TIER = 99;
  static readonly MAX_LEVEL = 999;
  static readonly LEVELS_PER_TIER = 10; // Tiers increment every 10 levels
  
  /**
   * Calculate level multiplier (exponential scaling)
   * 1.015 per level = ~15.98x at level 999
   */
  static getLevelMultiplier(level: number): number {
    if (level < 1) return 1.0;
    if (level > this.MAX_LEVEL) level = this.MAX_LEVEL;
    return Math.pow(1.015, level - 1);
  }

  /**
   * Calculate tier multiplier (exponential scaling)
   * 1.08 per tier = ~8.84x at tier 99
   */
  static getTierMultiplier(tier: number): number {
    if (tier < 1) return 1.0;
    if (tier > this.MAX_TIER) tier = this.MAX_TIER;
    return Math.pow(1.08, tier - 1);
  }

  /**
   * Calculate total progression multiplier (level * tier)
   */
  static getTotalMultiplier(level: number, tier: number): number {
    return this.getLevelMultiplier(level) * this.getTierMultiplier(tier);
  }

  /**
   * Determine tier from level
   * Tier increases every LEVELS_PER_TIER levels
   */
  static getTierFromLevel(level: number): number {
    const tier = Math.floor((level - 1) / this.LEVELS_PER_TIER) + 1;
    return Math.min(tier, this.MAX_TIER);
  }

  /**
   * Get level range for a specific tier
   */
  static getLevelRangeForTier(tier: number): { min: number; max: number } {
    const min = (tier - 1) * this.LEVELS_PER_TIER + 1;
    const max = Math.min(tier * this.LEVELS_PER_TIER, this.MAX_LEVEL);
    return { min, max };
  }

  /**
   * Calculate scaled cost for a progressed entity
   */
  static calculateScaledCost(
    baseConfig: ScalingConfig,
    level: number,
    tier: number
  ): { metal: number; crystal: number; deuterium: number } {
    const totalMultiplier = this.getTotalMultiplier(level, tier);
    
    return {
      metal: Math.floor(baseConfig.baseCost.metal * totalMultiplier),
      crystal: Math.floor(baseConfig.baseCost.crystal * totalMultiplier),
      deuterium: Math.floor(baseConfig.baseCost.deuterium * totalMultiplier),
    };
  }

  /**
   * Calculate scaled build time
   */
  static calculateScaledBuildTime(
    baseConfig: ScalingConfig,
    level: number,
    tier: number
  ): number {
    const levelMultiplier = this.getLevelMultiplier(level);
    const tierMultiplier = Math.pow(baseConfig.tierTimeIncrease, tier - 1);
    
    return Math.floor(baseConfig.baseTime * levelMultiplier * tierMultiplier);
  }

  /**
   * Calculate scaled stats for an entity
   */
  static calculateScaledStats(
    baseConfig: ScalingConfig,
    level: number,
    tier: number
  ): Record<string, number> {
    const totalMultiplier = this.getTotalMultiplier(level, tier);
    const scaledStats: Record<string, number> = {};

    for (const [key, value] of Object.entries(baseConfig.baseStats)) {
      scaledStats[key] = Math.floor(value * totalMultiplier);
    }

    return scaledStats;
  }

  /**
   * Calculate experience required for next level
   * Increases with level: base * (1 + level/100)
   */
  static getExperienceForLevel(level: number, baseXP: number = 1000): number {
    if (level >= this.MAX_LEVEL) return 0;
    return Math.floor(baseXP * (1 + level / 100));
  }

  /**
   * Calculate total experience required to reach level
   */
  static getTotalExperienceForLevel(level: number, baseXP: number = 1000): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += this.getExperienceForLevel(i, baseXP);
    }
    return total;
  }

  /**
   * Advance entity to next level
   */
  static advanceLevel(
    entity: ProgressedEntity,
    baseConfig: ScalingConfig
  ): ProgressedEntity {
    if (entity.level >= this.MAX_LEVEL) return entity;

    const newLevel = entity.level + 1;
    const newTier = this.getTierFromLevel(newLevel);

    return {
      ...entity,
      level: newLevel,
      tier: newTier,
      experience: 0,
      maxExperience: this.getExperienceForLevel(newLevel, baseConfig.baseCost.metal),
      stats: this.calculateScaledStats(baseConfig, newLevel, newTier),
      currentCost: this.calculateScaledCost(baseConfig, newLevel, newTier),
      currentBuildTime: this.calculateScaledBuildTime(baseConfig, newLevel, newTier),
    };
  }

  /**
   * Advance entity to next tier
   */
  static advanceTier(
    entity: ProgressedEntity,
    baseConfig: ScalingConfig
  ): ProgressedEntity {
    if (entity.tier >= this.MAX_TIER) return entity;

    const newTier = entity.tier + 1;
    const newLevel = entity.level;

    return {
      ...entity,
      tier: newTier,
      stats: this.calculateScaledStats(baseConfig, newLevel, newTier),
      currentCost: this.calculateScaledCost(baseConfig, newLevel, newTier),
      currentBuildTime: this.calculateScaledBuildTime(baseConfig, newLevel, newTier),
    };
  }

  /**
   * Add experience to entity
   */
  static addExperience(
    entity: ProgressedEntity,
    amount: number,
    baseConfig: ScalingConfig
  ): ProgressedEntity {
    let newEntity = { ...entity };
    let remainingXP = newEntity.experience + amount;

    // Level up until XP is exhausted
    while (
      remainingXP >= newEntity.maxExperience &&
      newEntity.level < this.MAX_LEVEL
    ) {
      remainingXP -= newEntity.maxExperience;
      newEntity = this.advanceLevel(newEntity, baseConfig);
    }

    newEntity.experience = remainingXP;
    return newEntity;
  }

  /**
   * Check if entity qualifies for tier upgrade
   * Requires reaching maximum level of current tier
   */
  static canAdvanceTier(entity: ProgressedEntity): boolean {
    if (entity.tier >= this.MAX_TIER) return false;
    const nextTierMin = entity.tier * this.LEVELS_PER_TIER;
    return entity.level >= nextTierMin;
  }

  /**
   * Get progression summary
   */
  static getProgressionSummary(entity: ProgressedEntity): {
    progressPercent: number;
    nextLevelAt: number;
    nextTierAt: number;
    canAdvanceTier: boolean;
  } {
    const progressPercent = (entity.experience / entity.maxExperience) * 100;
    const { max } = this.getLevelRangeForTier(entity.tier);
    const nextTierAt = (entity.tier < this.MAX_TIER) 
      ? (entity.tier + 1) * this.LEVELS_PER_TIER 
      : this.MAX_LEVEL;

    return {
      progressPercent: Math.min(progressPercent, 100),
      nextLevelAt: entity.level + 1,
      nextTierAt,
      canAdvanceTier: this.canAdvanceTier(entity),
    };
  }
}

/**
 * Predefined scaling profiles for different entity types
 */
export const SCALING_PROFILES = {
  // Buildings: Moderate scaling
  building: {
    levelMultiplier: 1.12,
    tierMultiplier: 1.25,
    tierCostIncrease: 1.5,
    tierTimeIncrease: 1.3,
  } as const,

  // Units/Ships: Faster scaling for combat effectiveness
  unit: {
    levelMultiplier: 1.18,
    tierMultiplier: 1.35,
    tierCostIncrease: 2.0,
    tierTimeIncrease: 1.5,
  } as const,

  // Research: Slower scaling, more expensive
  research: {
    levelMultiplier: 1.25,
    tierMultiplier: 1.4,
    tierCostIncrease: 2.5,
    tierTimeIncrease: 2.0,
  } as const,

  // Megastructures: Extreme scaling
  megastructure: {
    levelMultiplier: 1.015,
    tierMultiplier: 1.08,
    tierCostIncrease: 3.0,
    tierTimeIncrease: 2.5,
  } as const,

  // Defense: Between building and unit
  defense: {
    levelMultiplier: 1.15,
    tierMultiplier: 1.3,
    tierCostIncrease: 1.8,
    tierTimeIncrease: 1.6,
  } as const,
};

/**
 * Rewards granted when advancing tiers
 */
export interface TierReward {
  type: 'resource' | 'bonus' | 'unlock' | 'item';
  value: number | string;
  description: string;
}

export const TIER_REWARDS: Record<number, TierReward[]> = {
  1: [{ type: 'unlock', value: 'Basic Construction', description: 'Unlock tier 1 buildings' }],
  5: [{ type: 'bonus', value: 'production', description: '+5% Production Bonus' }],
  10: [{ type: 'resource', value: 10000, description: '+10,000 Credits' }],
  15: [{ type: 'bonus', value: 'research', description: '+10% Research Speed' }],
  20: [{ type: 'unlock', value: 'Advanced Technology', description: 'Unlock tier 2 research' }],
  25: [{ type: 'bonus', value: 'defense', description: '+15% Defense' }],
  30: [{ type: 'resource', value: 50000, description: '+50,000 Credits' }],
  50: [{ type: 'unlock', value: 'Megastructures', description: 'Unlock megastructure construction' }],
  75: [{ type: 'bonus', value: 'all_stats', description: '+20% All Stats' }],
  99: [{ type: 'unlock', value: 'Ascension', description: 'Unlock ascension mechanics' }],
};

/**
 * Get milestone messages for progression
 */
export function getProgressionMilestone(level: number, tier: number): string | null {
  if (level % 50 === 0) return `Reached level ${level}! Major milestone!`;
  if (tier % 5 === 0) return `Tier ${tier} achieved! Massive power increase!`;
  if (level === ProgressionSystem.MAX_LEVEL) return 'MAXIMUM LEVEL REACHED! Godhood achieved!';
  if (tier === ProgressionSystem.MAX_TIER) return 'MAXIMUM TIER! Ultimate power unlocked!';
  return null;
}
