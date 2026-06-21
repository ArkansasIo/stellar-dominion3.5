/**
 * Multiplayer Research Bonuses Configuration
 * Defines alliance, faction, and cooperative research bonuses
 */

export const MULTIPLAYER_BONUS_CONFIG = {
  // Alliance-based bonuses
  ALLIANCE_BONUSES: {
    SMALL: {
      memberCount: { min: 2, max: 4 },
      researchSpeedBonus: 0.05, // 5% bonus
      discoveryChanceBonus: 0.02, // 2% bonus
      xpMultiplier: 1.05,
      maxMembers: 4,
    },
    MEDIUM: {
      memberCount: { min: 5, max: 10 },
      researchSpeedBonus: 0.10, // 10% bonus
      discoveryChanceBonus: 0.05, // 5% bonus
      xpMultiplier: 1.10,
      maxMembers: 10,
    },
    LARGE: {
      memberCount: { min: 11, max: 25 },
      researchSpeedBonus: 0.15, // 15% bonus
      discoveryChanceBonus: 0.08, // 8% bonus
      xpMultiplier: 1.15,
      maxMembers: 25,
    },
    MASSIVE: {
      memberCount: { min: 26, max: 100 },
      researchSpeedBonus: 0.20, // 20% bonus
      discoveryChanceBonus: 0.12, // 12% bonus
      xpMultiplier: 1.20,
      maxMembers: 100,
    },
  },

  // Faction-based bonuses
  FACTION_BONUSES: {
    RESEARCH_FOCUSED: {
      researchSpeedBonus: 0.10,
      discoveryChanceBonus: 0.08,
      techTreeExpansion: 1.05, // 5% more tech choices
      costReduction: 0,
    },
    BALANCE: {
      researchSpeedBonus: 0.05,
      discoveryChanceBonus: 0.03,
      techTreeExpansion: 1.02,
      costReduction: 0.05,
    },
    ECONOMIC: {
      researchSpeedBonus: 0.03,
      discoveryChanceBonus: 0.02,
      techTreeExpansion: 1.01,
      costReduction: 0.15,
    },
    MILITARY: {
      researchSpeedBonus: 0.08,
      discoveryChanceBonus: 0.05,
      techTreeExpansion: 1.03,
      costReduction: 0.05,
    },
  },

  // Cooperative research bonuses (shared research projects)
  COOPERATIVE_BONUSES: {
    PARTICIPANTS_BASE_BONUS: 0.05, // 5% per participant
    MAX_BONUS_MULTIPLE: 2.0, // 2x research speed cap
    SHARED_XP_SPLIT: 0.3, // 30% XP goes to all participants
    DISCOVERY_SHARED: true,
    TECH_UNLOCK_ALL: true,
  },

  // Daily alliance activity bonuses
  ACTIVITY_BONUSES: {
    MEMBER_ACTIVITY_THRESHOLD: 5, // Members active daily
    WEEKLY_BONUS_PERCENT: 0.25, // 25% bonus if threshold met
    MONTHLY_BONUS_PERCENT: 0.50, // 50% bonus if active all month
    CUMULATIVE_CAP: 1.75, // 75% max cumulative bonus
  },

  // Research specialization synergies
  SPECIALIZATION_SYNERGY: {
    SAME_PATH: 0.10, // 10% bonus if researching same path
    COMPLEMENTARY_PATH: 0.07, // 7% bonus if paths complement each other
    DIFFERENT_PATH: 0, // No bonus if completely different research
    SYNERGY_CACHE_DURATION: 3600000, // 1 hour cache
  },

  // Alliance resource pooling
  RESOURCE_POOLING: {
    ENABLED: true,
    SHARE_PERCENT: 0.20, // Members can pool 20% of resources
    DRAW_LIMIT_PERCENT: 0.15, // Can withdraw max 15% of pool per day
    POOL_UPDATE_INTERVAL: 300000, // Update pool every 5 minutes
  },
};

export const ALLIANCE_TIER_REQUIREMENTS = {
  SMALL: { minMembers: 2, maxMembers: 4, prestige: 0 },
  MEDIUM: { minMembers: 5, maxMembers: 10, prestige: 100 },
  LARGE: { minMembers: 11, maxMembers: 25, prestige: 500 },
  MASSIVE: { minMembers: 26, maxMembers: 100, prestige: 2000 },
};

export interface AllianceMember {
  userId: string;
  joinedAt: number;
  role: 'leader' | 'officer' | 'member';
  contributions: number;
  currentResearch?: string;
}

export interface Alliance {
  id: string;
  name: string;
  leader: string;
  members: AllianceMember[];
  faction?: string;
  tier: keyof typeof ALLIANCE_TIER_REQUIREMENTS;
  createdAt: number;
  description: string;
  joinPolicy: 'open' | 'invite' | 'application';
  prestige: number;
  resourcePool: {
    metals: number;
    credits: number;
    lastUpdated: number;
  };
}

/**
 * Calculate alliance tier based on member count
 */
export function getAllianceTier(
  memberCount: number
): 'SMALL' | 'MEDIUM' | 'LARGE' | 'MASSIVE' {
  if (memberCount <= 4) return 'SMALL';
  if (memberCount <= 10) return 'MEDIUM';
  if (memberCount <= 25) return 'LARGE';
  return 'MASSIVE';
}

/**
 * Calculate combined multipliers for alliance member
 */
export function calculateCombinedBonuses(
  allianceTier: keyof typeof ALLIANCE_BONUS_CONFIG,
  factionType?: keyof typeof MULTIPLAYER_BONUS_CONFIG['FACTION_BONUSES'],
  activityMultiplier: number = 1.0,
  specializationBonus: number = 0
): {
  researchSpeed: number;
  discoveryChance: number;
  xpMultiplier: number;
  costReduction: number;
} {
  const allianceBonus = MULTIPLAYER_BONUS_CONFIG.ALLIANCE_BONUSES[allianceTier];
  const factionBonus = factionType
    ? MULTIPLAYER_BONUS_CONFIG.FACTION_BONUSES[factionType]
    : MULTIPLAYER_BONUS_CONFIG.FACTION_BONUSES.BALANCE;

  // Stack bonuses (multiplicative for multipliers, additive for percentages)
  const researchSpeed =
    1 +
    allianceBonus.researchSpeedBonus +
    factionBonus.researchSpeedBonus +
    specializationBonus;
  const discoveryChance =
    allianceBonus.discoveryChanceBonus + factionBonus.discoveryChanceBonus;
  const xpMultiplier = allianceBonus.xpMultiplier * factionBonus.costReduction;
  const costReduction = factionBonus.costReduction;

  return {
    researchSpeed: Math.min(researchSpeed * activityMultiplier, 2.0), // Cap at 2x
    discoveryChance: Math.min(discoveryChance, 0.5), // Cap at 50%
    xpMultiplier: Math.min(xpMultiplier, 1.5), // Cap at 1.5x
    costReduction: Math.min(costReduction, 0.3), // Cap at 30%
  };
}

/**
 * Calculate cooperative research bonus
 */
export function calculateCooperativeBonus(
  participantCount: number
): { speedBonus: number; xpSharePercent: number } {
  const config = MULTIPLAYER_BONUS_CONFIG.COOPERATIVE_BONUSES;
  const baseBonus = Math.min(
    (participantCount - 1) * config.PARTICIPANTS_BASE_BONUS,
    config.MAX_BONUS_MULTIPLE - 1
  );

  return {
    speedBonus: baseBonus,
    xpSharePercent: config.SHARED_XP_SPLIT,
  };
}

const ALLIANCE_BONUS_CONFIG = MULTIPLAYER_BONUS_CONFIG.ALLIANCE_BONUSES;

export type AllianceTierType = keyof typeof ALLIANCE_BONUS_CONFIG;
export type FactionType = keyof typeof MULTIPLAYER_BONUS_CONFIG['FACTION_BONUSES'];
