/**
 * Research XP/Discovery Configuration
 * Manages research experience points and tech discovery mechanics
 * @tag #research-xp #discovery #progression
 */

export const RESEARCH_XP_CONFIG = {
  // XP generation per research item
  BASE_XP_PER_RESEARCH: 100,           // Base XP earned on research completion
  XP_PER_TURN: 5,                       // XP earned per turn spent on research
  
  // Tech tier XP multipliers
  TIER_XP_MULTIPLIERS: {
    basic: 1.0,
    standard: 1.2,
    advanced: 1.5,
    military: 1.8,
    experimental: 2.2,
    ancient: 2.8,
    exotic: 3.5,
  },
  
  // Tech class XP multipliers
  CLASS_XP_MULTIPLIERS: {
    armor: 1.0,
    shields: 1.0,
    weapons: 1.1,
    propulsion: 1.2,
    sensors: 0.95,
    power: 1.0,
    computing: 1.15,
    engineering: 1.1,
    resources: 0.9,
    medical: 1.15,
    hyperspace: 1.5,
  },
  
  // Discovery mechanics
  DISCOVERY_CHANCE_BASE: 0.15,          // 15% base chance to discover tech
  DISCOVERY_BONUS_PER_XP_LEVEL: 0.02,  // +2% per XP level
  DISCOVERY_STREAK_BONUS: 1.15,         // +15% per discovery streak
  MAX_DISCOVERY_STREAK: 5,              // Max streak bonus stack
};

export const DISCOVERY_MECHANICS = {
  // Discovery probability calculations
  BASE_DISCOVERY_RATE: 0.15,
  
  // Unlock conditions
  MINIMUM_XP_FOR_DISCOVERY: 1000,      // Must have 1000 XP total
  MINIMUM_RESEARCH_COUNT: 5,            // Must complete 5 researches
  MINIMUM_LAB_LEVEL: 1,                 // Lab must be level 1+
  
  // Discovery types
  DISCOVERY_TYPES: {
    tech_unlock: {
      name: 'Technology Unlock',
      xpReward: 500,
      rarity: 'common',
    },
    
    resource_bonus: {
      name: 'Resource Production Bonus',
      xpReward: 250,
      rarity: 'uncommon',
    },
    
    speed_boost: {
      name: 'Research Speed Boost',
      xpReward: 350,
      rarity: 'uncommon',
      speedBoost: 1.15,
      duration: 3600000, // 1 hour
    },
    
    tech_advancement: {
      name: 'Technology Advancement',
      xpReward: 400,
      rarity: 'rare',
      progressBonus: 0.2, // 20% progress to next research
    },
    
    breakthrough: {
      name: 'Scientific Breakthrough',
      xpReward: 1000,
      rarity: 'epic',
      progressBonus: 0.5, // 50% progress to next research
      speedBoost: 1.25,
      duration: 7200000, // 2 hours
    },
    
    ancient_knowledge: {
      name: 'Ancient Knowledge',
      xpReward: 2000,
      rarity: 'legendary',
      unlocksNewBranch: true,
      speedBoost: 1.5,
      duration: 3600000,
    },
  },
};

export const XP_LEVEL_CONFIG = {
  // XP levels (like prestige)
  BASE_XP_FOR_LEVEL: 5000,
  XP_MULTIPLIER_PER_LEVEL: 1.2,
  
  // Level caps
  MIN_LEVEL: 1,
  MAX_LEVEL: 100,
  
  // Rewards per level
  LEVEL_UP_REWARDS: {
    discovery_chance: 0.025,             // +2.5% discovery chance per level
    lab_unlock: 5,                       // Unlock new lab every X levels
    speed_multiplier: 1.02,              // +2% speed per level
    xp_gain: 1.05,                       // +5% XP gain per level
  },
};

/**
 * Research discovery event
 */
export interface ResearchDiscovery {
  id: string;
  discoveredAt: number;
  techId?: string;
  discoveryType: keyof typeof DISCOVERY_MECHANICS['DISCOVERY_TYPES'];
  xpGained: number;
  bonusApplied?: {
    type: string;
    multiplier?: number;
    duration?: number;
  };
}

/**
 * Player research XP state
 */
export interface PlayerResearchXP {
  totalXP: number;                      // Lifetime XP accumulated
  currentLevelXP: number;               // XP towards next level
  currentLevel: number;                 // Current XP level
  researchesCompleted: number;          // Total researches finished
  discoveredTechs: string[];            // Array of discovered tech IDs
  discoveries: ResearchDiscovery[];      // Discovery history
  discoveryStreak: number;              // Current discovery streak
  lastDiscoveryTime: number;            // Timestamp of last discovery
  discoveryMultiplier: number;          // Current discovery rate multiplier
}

/**
 * Calculate XP earned from research completion
 */
export function calculateResearchXP(
  baseTurns: number,
  techTier: string,
  techClass: string
): number {
  const tierMult = RESEARCH_XP_CONFIG.TIER_XP_MULTIPLIERS[techTier as keyof typeof RESEARCH_XP_CONFIG.TIER_XP_MULTIPLIERS] || 1.0;
  const classMult = RESEARCH_XP_CONFIG.CLASS_XP_MULTIPLIERS[techClass as keyof typeof RESEARCH_XP_CONFIG.CLASS_XP_MULTIPLIERS] || 1.0;
  
  return Math.round(
    RESEARCH_XP_CONFIG.BASE_XP_PER_RESEARCH * 
    (1 + baseTurns / 1000) * 
    tierMult * 
    classMult
  );
}

/**
 * Calculate XP needed for next level
 */
export function calculateXPForLevel(level: number): number {
  return Math.round(
    XP_LEVEL_CONFIG.BASE_XP_FOR_LEVEL * 
    Math.pow(XP_LEVEL_CONFIG.XP_MULTIPLIER_PER_LEVEL, level - 1)
  );
}

/**
 * Calculate discovery chance
 */
export function calculateDiscoveryChance(
  playerXPLevel: number,
  discoveryStreak: number,
  researchCount: number
): number {
  let chance = RESEARCH_XP_CONFIG.DISCOVERY_CHANCE_BASE;
  
  // Add bonus per level
  chance += playerXPLevel * RESEARCH_XP_CONFIG.DISCOVERY_BONUS_PER_XP_LEVEL;
  
  // Add streak bonus
  const activeStreaks = Math.min(discoveryStreak, RESEARCH_XP_CONFIG.MAX_DISCOVERY_STREAK);
  chance *= Math.pow(RESEARCH_XP_CONFIG.DISCOVERY_STREAK_BONUS, activeStreaks);
  
  // Cap at 100%
  return Math.min(chance, 1.0);
}

/**
 * Get discovery rarity weights for randomness
 */
export function getDiscoveryRarityWeights(): { [key: string]: number } {
  return {
    common: 0.50,
    uncommon: 0.25,
    rare: 0.15,
    epic: 0.08,
    legendary: 0.02,
  };
}

/**
 * Roll for discovery type based on rarity
 */
export function rollDiscoveryType(): keyof typeof DISCOVERY_MECHANICS['DISCOVERY_TYPES'] {
  const types = Object.keys(DISCOVERY_MECHANICS.DISCOVERY_TYPES) as Array<keyof typeof DISCOVERY_MECHANICS['DISCOVERY_TYPES']>;
  const rarities: { [key: string]: (keyof typeof DISCOVERY_MECHANICS['DISCOVERY_TYPES'])[] } = {
    common: ['tech_unlock'],
    uncommon: ['resource_bonus', 'speed_boost'],
    rare: ['tech_advancement'],
    epic: ['breakthrough'],
    legendary: ['ancient_knowledge'],
  };
  
  const weights = getDiscoveryRarityWeights();
  let rand = Math.random();
  
  for (const [rarity, typeList] of Object.entries(rarities)) {
    rand -= weights[rarity];
    if (rand <= 0) {
      const selected = typeList[Math.floor(Math.random() * typeList.length)] as keyof typeof DISCOVERY_MECHANICS['DISCOVERY_TYPES'];
      return selected;
    }
  }
  
  return 'tech_unlock';
}

export default {
  RESEARCH_XP_CONFIG,
  DISCOVERY_MECHANICS,
  XP_LEVEL_CONFIG,
  calculateResearchXP,
  calculateXPForLevel,
  calculateDiscoveryChance,
  getDiscoveryRarityWeights,
  rollDiscoveryType,
};
