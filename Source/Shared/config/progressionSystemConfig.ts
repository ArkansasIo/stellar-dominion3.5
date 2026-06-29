/**
 * Comprehensive Level & Tier Progression System
 * Supports 1-999 levels and 1-99 tiers across all game entities
 * @tag #progression #level #tier #stats #attributes
 */

// ============================================================================
// CONSTANTS
// ============================================================================

export const PROGRESSION_CONSTANTS = {
  MAX_LEVEL: 999,
  MIN_LEVEL: 1,
  MAX_TIER: 99,
  MIN_TIER: 1,
  
  // Experience scaling
  BASE_EXP_REQUIREMENT: 100,
  EXP_SCALING_FACTOR: 1.15,
  
  // Tier scaling
  BASE_TIER_REQUIREMENT: 1000,
  TIER_SCALING_FACTOR: 1.25,
  
  // Stat scaling
  BASE_STAT_VALUE: 10,
  STAT_GROWTH_PER_LEVEL: 5,
  STAT_GROWTH_PER_TIER: 50,
  
  // Multipliers
  TIER_MULTIPLIER_BASE: 1.0,
  TIER_MULTIPLIER_INCREMENT: 0.05,
  LEVEL_MULTIPLIER_BASE: 1.0,
  LEVEL_MULTIPLIER_INCREMENT: 0.01,
} as const;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LevelData {
  level: number;
  expRequired: number;
  expTotal: number;
  statBonus: number;
  multiplier: number;
  tier: number;
}

export interface TierData {
  tier: number;
  minLevel: number;
  pointsRequired: number;
  statBonus: number;
  multiplier: number;
  unlocks: string[];
}

export interface ProgressionStats {
  // Base Stats
  power: number;
  defense: number;
  mobility: number;
  utility: number;
  
  // Sub Stats
  precision: number;
  endurance: number;
  efficiency: number;
  control: number;
  
  // Attributes
  tech: number;
  command: number;
  logistics: number;
  survivability: number;
  
  // Sub Attributes
  sensorRange: number;
  energyUse: number;
  maintenance: number;
  adaptation: number;
}

export interface EntityProgression {
  id: string;
  entityType: string;
  entitySubType: string;
  entityClass: string;
  entitySubClass: string;
  
  level: number;
  tier: number;
  experience: number;
  tierPoints: number;
  
  stats: ProgressionStats;
  baseStats: ProgressionStats;
  
  levelMultiplier: number;
  tierMultiplier: number;
  totalMultiplier: number;
}

// ============================================================================
// LEVEL SYSTEM (1-999)
// ============================================================================

/**
 * Calculate experience required for a specific level
 */
export function calculateExpForLevel(level: number): number {
  if (level <= 1) return 0;
  const { BASE_EXP_REQUIREMENT, EXP_SCALING_FACTOR } = PROGRESSION_CONSTANTS;
  return Math.floor(BASE_EXP_REQUIREMENT * Math.pow(EXP_SCALING_FACTOR, level - 1));
}

/**
 * Calculate total experience required to reach a level
 */
export function calculateTotalExpForLevel(level: number): number {
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += calculateExpForLevel(i);
  }
  return total;
}

/**
 * Generate complete level table (1-999)
 */
export function generateLevelTable(): Map<number, LevelData> {
  const table = new Map<number, LevelData>();
  
  for (let level = 1; level <= PROGRESSION_CONSTANTS.MAX_LEVEL; level++) {
    const expRequired = calculateExpForLevel(level);
    const expTotal = calculateTotalExpForLevel(level);
    const tier = calculateTierForLevel(level);
    const statBonus = calculateStatBonusForLevel(level);
    const multiplier = calculateLevelMultiplier(level);
    
    table.set(level, {
      level,
      expRequired,
      expTotal,
      tier,
      statBonus,
      multiplier,
    });
  }
  
  return table;
}

/**
 * Calculate stat bonus for a level
 */
export function calculateStatBonusForLevel(level: number): number {
  return PROGRESSION_CONSTANTS.STAT_GROWTH_PER_LEVEL * (level - 1);
}

/**
 * Calculate level multiplier
 */
export function calculateLevelMultiplier(level: number): number {
  const { LEVEL_MULTIPLIER_BASE, LEVEL_MULTIPLIER_INCREMENT } = PROGRESSION_CONSTANTS;
  return LEVEL_MULTIPLIER_BASE + (LEVEL_MULTIPLIER_INCREMENT * (level - 1));
}

/**
 * Get level from experience
 */
export function getLevelFromExperience(exp: number): number {
  for (let level = PROGRESSION_CONSTANTS.MAX_LEVEL; level >= 1; level--) {
    if (exp >= calculateTotalExpForLevel(level)) {
      return level;
    }
  }
  return 1;
}

// ============================================================================
// TIER SYSTEM (1-99)
// ============================================================================

/**
 * Calculate tier from level
 */
export function calculateTierForLevel(level: number): number {
  // Every 10 levels = 1 tier, with tier 1 at levels 1-10
  return Math.min(Math.ceil(level / 10), PROGRESSION_CONSTANTS.MAX_TIER);
}

/**
 * Calculate points required for a tier
 */
export function calculatePointsForTier(tier: number): number {
  if (tier <= 1) return 0;
  const { BASE_TIER_REQUIREMENT, TIER_SCALING_FACTOR } = PROGRESSION_CONSTANTS;
  return Math.floor(BASE_TIER_REQUIREMENT * Math.pow(TIER_SCALING_FACTOR, tier - 1));
}

/**
 * Calculate stat bonus for a tier
 */
export function calculateStatBonusForTier(tier: number): number {
  return PROGRESSION_CONSTANTS.STAT_GROWTH_PER_TIER * (tier - 1);
}

/**
 * Calculate tier multiplier
 */
export function calculateTierMultiplier(tier: number): number {
  const { TIER_MULTIPLIER_BASE, TIER_MULTIPLIER_INCREMENT } = PROGRESSION_CONSTANTS;
  return TIER_MULTIPLIER_BASE + (TIER_MULTIPLIER_INCREMENT * (tier - 1));
}

/**
 * Generate complete tier table (1-99)
 */
export function generateTierTable(): Map<number, TierData> {
  const table = new Map<number, TierData>();
  
  for (let tier = 1; tier <= PROGRESSION_CONSTANTS.MAX_TIER; tier++) {
    const minLevel = (tier - 1) * 10 + 1;
    const pointsRequired = calculatePointsForTier(tier);
    const statBonus = calculateStatBonusForTier(tier);
    const multiplier = calculateTierMultiplier(tier);
    const unlocks = getTierUnlocks(tier);
    
    table.set(tier, {
      tier,
      minLevel,
      pointsRequired,
      statBonus,
      multiplier,
      unlocks,
    });
  }
  
  return table;
}

/**
 * Get unlocks for a specific tier
 */
export function getTierUnlocks(tier: number): string[] {
  const unlocks: string[] = [];
  
  // Major unlocks at tier milestones
  if (tier === 1) unlocks.push('Basic Training');
  if (tier === 5) unlocks.push('Advanced Capabilities');
  if (tier === 10) unlocks.push('Elite Status', 'Special Abilities');
  if (tier === 20) unlocks.push('Legendary Tier', 'Ultimate Weapons');
  if (tier === 30) unlocks.push('Mythic Powers');
  if (tier === 40) unlocks.push('Transcendent Form');
  if (tier === 50) unlocks.push('Cosmic Ascension');
  if (tier === 60) unlocks.push('Dimensional Mastery');
  if (tier === 70) unlocks.push('Reality Warping');
  if (tier === 80) unlocks.push('Universal Entity');
  if (tier === 90) unlocks.push('Omnipotent Being');
  if (tier === 99) unlocks.push('MAX TIER - Absolute Power');
  
  // Every 10 tiers unlock new features
  if (tier % 10 === 0) unlocks.push(`Tier ${tier} Specialization`);
  
  return unlocks;
}

// ============================================================================
// STAT CALCULATIONS
// ============================================================================

/**
 * Calculate stat value based on level and tier
 */
export function calculateStatValue(
  baseStat: number,
  level: number,
  tier: number,
  statType: keyof ProgressionStats
): number {
  const levelBonus = calculateStatBonusForLevel(level);
  const tierBonus = calculateStatBonusForTier(tier);
  const levelMult = calculateLevelMultiplier(level);
  const tierMult = calculateTierMultiplier(tier);
  
  // Total stat = base * levelMult * tierMult + levelBonus + tierBonus
  return Math.floor((baseStat * levelMult * tierMult) + levelBonus + tierBonus);
}

/**
 * Calculate all stats for an entity at a given level and tier
 */
export function calculateAllStats(
  baseStats: ProgressionStats,
  level: number,
  tier: number
): ProgressionStats {
  const result = {} as ProgressionStats;
  
  for (const key in baseStats) {
    const statKey = key as keyof ProgressionStats;
    result[statKey] = calculateStatValue(baseStats[statKey], level, tier, statKey);
  }
  
  return result;
}

// ============================================================================
// ENTITY PROGRESSION
// ============================================================================

/**
 * Create a new entity progression instance
 */
export function createEntityProgression(
  id: string,
  entityType: string,
  entitySubType: string,
  entityClass: string,
  entitySubClass: string,
  baseStats: ProgressionStats,
  startLevel: number = 1,
  startTier: number = 1
): EntityProgression {
  const level = Math.max(1, Math.min(startLevel, PROGRESSION_CONSTANTS.MAX_LEVEL));
  const tier = Math.max(1, Math.min(startTier, PROGRESSION_CONSTANTS.MAX_TIER));
  
  const levelMultiplier = calculateLevelMultiplier(level);
  const tierMultiplier = calculateTierMultiplier(tier);
  const totalMultiplier = levelMultiplier * tierMultiplier;
  
  const stats = calculateAllStats(baseStats, level, tier);
  
  return {
    id,
    entityType,
    entitySubType,
    entityClass,
    entitySubClass,
    level,
    tier,
    experience: calculateTotalExpForLevel(level),
    tierPoints: 0,
    stats,
    baseStats: { ...baseStats },
    levelMultiplier,
    tierMultiplier,
    totalMultiplier,
  };
}

/**
 * Add experience to an entity and level up if threshold reached
 */
export function addExperience(
  entity: EntityProgression,
  expGain: number
): EntityProgression {
  const newExp = entity.experience + expGain;
  const newLevel = getLevelFromExperience(newExp);
  const newTier = calculateTierForLevel(newLevel);
  
  if (newLevel !== entity.level || newTier !== entity.tier) {
    // Level or tier changed, recalculate stats
    const levelMultiplier = calculateLevelMultiplier(newLevel);
    const tierMultiplier = calculateTierMultiplier(newTier);
    const totalMultiplier = levelMultiplier * tierMultiplier;
    const stats = calculateAllStats(entity.baseStats, newLevel, newTier);
    
    return {
      ...entity,
      level: newLevel,
      tier: newTier,
      experience: newExp,
      stats,
      levelMultiplier,
      tierMultiplier,
      totalMultiplier,
    };
  }
  
  return {
    ...entity,
    experience: newExp,
  };
}

/**
 * Manually set level and tier
 */
export function setLevelAndTier(
  entity: EntityProgression,
  level: number,
  tier: number
): EntityProgression {
  const clampedLevel = Math.max(1, Math.min(level, PROGRESSION_CONSTANTS.MAX_LEVEL));
  const clampedTier = Math.max(1, Math.min(tier, PROGRESSION_CONSTANTS.MAX_TIER));
  
  const levelMultiplier = calculateLevelMultiplier(clampedLevel);
  const tierMultiplier = calculateTierMultiplier(clampedTier);
  const totalMultiplier = levelMultiplier * tierMultiplier;
  const stats = calculateAllStats(entity.baseStats, clampedLevel, clampedTier);
  const experience = calculateTotalExpForLevel(clampedLevel);
  
  return {
    ...entity,
    level: clampedLevel,
    tier: clampedTier,
    experience,
    stats,
    levelMultiplier,
    tierMultiplier,
    totalMultiplier,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get progression summary for display
 */
export function getProgressionSummary(entity: EntityProgression): {
  level: number;
  tier: number;
  expCurrent: number;
  expNext: number;
  expProgress: number;
  tierProgress: number;
  powerLevel: number;
} {
  const expNext = calculateExpForLevel(entity.level + 1);
  const expCurrent = entity.experience - calculateTotalExpForLevel(entity.level);
  const expProgress = expNext > 0 ? (expCurrent / expNext) * 100 : 100;
  
  const tierProgress = ((entity.level % 10) / 10) * 100;
  
  // Power level = rough estimation of total power
  const powerLevel = Math.floor(
    (entity.level * 100) + 
    (entity.tier * 1000) + 
    (Object.values(entity.stats).reduce((sum, val) => sum + val, 0) / 16)
  );
  
  return {
    level: entity.level,
    tier: entity.tier,
    expCurrent,
    expNext,
    expProgress,
    tierProgress,
    powerLevel,
  };
}

/**
 * Get tier name based on tier number
 */
export function getTierName(tier: number): string {
  if (tier >= 90) return 'Godlike';
  if (tier >= 80) return 'Universal';
  if (tier >= 70) return 'Reality Bender';
  if (tier >= 60) return 'Dimensional';
  if (tier >= 50) return 'Cosmic';
  if (tier >= 40) return 'Transcendent';
  if (tier >= 30) return 'Mythic';
  if (tier >= 20) return 'Legendary';
  if (tier >= 10) return 'Elite';
  if (tier >= 5) return 'Advanced';
  return 'Basic';
}

/**
 * Get level tier color for UI
 */
export function getTierColor(tier: number): string {
  if (tier >= 90) return '#FF00FF'; // Magenta
  if (tier >= 80) return '#00FFFF'; // Cyan
  if (tier >= 70) return '#FF0000'; // Red
  if (tier >= 60) return '#FFA500'; // Orange
  if (tier >= 50) return '#FFFF00'; // Yellow
  if (tier >= 40) return '#00FF00'; // Green
  if (tier >= 30) return '#0000FF'; // Blue
  if (tier >= 20) return '#800080'; // Purple
  if (tier >= 10) return '#C0C0C0'; // Silver
  if (tier >= 5) return '#CD7F32'; // Bronze
  return '#808080'; // Gray
}

// ============================================================================
// PREGENERATED TABLES
// ============================================================================

/**
 * Generate and cache level/tier tables for performance
 */
export class ProgressionTables {
  private static levelTable: Map<number, LevelData> | null = null;
  private static tierTable: Map<number, TierData> | null = null;
  
  static getLevelTable(): Map<number, LevelData> {
    if (!this.levelTable) {
      this.levelTable = generateLevelTable();
    }
    return this.levelTable;
  }
  
  static getTierTable(): Map<number, TierData> {
    if (!this.tierTable) {
      this.tierTable = generateTierTable();
    }
    return this.tierTable;
  }
  
  static getLevelData(level: number): LevelData | undefined {
    return this.getLevelTable().get(level);
  }
  
  static getTierData(tier: number): TierData | undefined {
    return this.getTierTable().get(tier);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  PROGRESSION_CONSTANTS,
  calculateExpForLevel,
  calculateTotalExpForLevel,
  generateLevelTable,
  calculateStatBonusForLevel,
  calculateLevelMultiplier,
  getLevelFromExperience,
  calculateTierForLevel,
  calculatePointsForTier,
  calculateStatBonusForTier,
  calculateTierMultiplier,
  generateTierTable,
  getTierUnlocks,
  calculateStatValue,
  calculateAllStats,
  createEntityProgression,
  addExperience,
  setLevelAndTier,
  getProgressionSummary,
  getTierName,
  getTierColor,
  ProgressionTables,
};
