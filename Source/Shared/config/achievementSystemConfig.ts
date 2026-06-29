/**
 * Research Achievement System Configuration
 * Defines achievements, badges, and milestone rewards
 */

export const ACHIEVEMENT_CONFIG = {
  // Research milestones
  RESEARCH_MILESTONES: {
    FIRST_TECH: {
      name: 'Novice Researcher',
      description: 'Complete your first technology',
      requirement: 1,
      reward: { xp: 500, credits: 1000, badge: 'novice_researcher' },
      tier: 'bronze',
    },
    TECH_ADDICT: {
      name: 'Tech Addict',
      description: 'Complete 25 technologies',
      requirement: 25,
      reward: { xp: 5000, credits: 10000, badge: 'tech_addict' },
      tier: 'silver',
    },
    RESEARCHER_ELITE: {
      name: 'Researcher Elite',
      description: 'Complete 100 technologies',
      requirement: 100,
      reward: { xp: 25000, credits: 50000, badge: 'researcher_elite' },
      tier: 'gold',
    },
    TECH_MASTER: {
      name: 'Tech Master',
      description: 'Complete 250 technologies',
      requirement: 250,
      reward: { xp: 100000, credits: 250000, badge: 'tech_master' },
      tier: 'platinum',
    },
    LEGENDARY_SCHOLAR: {
      name: 'Legendary Scholar',
      description: 'Complete 500 technologies',
      requirement: 500,
      reward: { xp: 500000, credits: 1000000, badge: 'legendary_scholar' },
      tier: 'diamond',
    },
  },

  // Discovery achievements
  DISCOVERY_ACHIEVEMENTS: {
    FIRST_DISCOVERY: {
      name: 'Explorer',
      description: 'Make your first technology discovery',
      requirement: 1,
      reward: { xp: 1000, credits: 2000, badge: 'explorer' },
      tier: 'bronze',
    },
    DISCOVERY_SPREE: {
      name: 'Lucky Scientist',
      description: 'Have 10 discoveries',
      requirement: 10,
      reward: { xp: 10000, credits: 20000, badge: 'lucky_scientist' },
      tier: 'silver',
    },
    DISCOVERY_LEGEND: {
      name: 'Discovery Legend',
      description: 'Have 50 discoveries',
      requirement: 50,
      reward: { xp: 50000, credits: 100000, badge: 'discovery_legend' },
      tier: 'gold',
    },
    DISCOVERY_GOD: {
      name: 'Discovery God',
      description: 'Have 100 discoveries',
      requirement: 100,
      reward: { xp: 250000, credits: 500000, badge: 'discovery_god' },
      tier: 'platinum',
    },
  },

  // Speed achievements
  SPEED_ACHIEVEMENTS: {
    SPEED_RUNNER: {
      name: 'Speed Runner',
      description: 'Complete a technology in under 1 hour',
      requirement: { type: 'time_based', value: 3600 },
      reward: { xp: 2000, credits: 5000, badge: 'speed_runner' },
      tier: 'silver',
    },
    BLITZ_RESEARCHER: {
      name: 'Blitz Researcher',
      description: 'Complete 5 technologies in one day',
      requirement: { type: 'daily_count', value: 5 },
      reward: { xp: 10000, credits: 25000, badge: 'blitz_researcher' },
      tier: 'gold',
    },
    TURBO_SCIENTIST: {
      name: 'Turbo Scientist',
      description: 'Have a 7-day research streak',
      requirement: { type: 'streak', value: 7 },
      reward: { xp: 50000, credits: 100000, badge: 'turbo_scientist' },
      tier: 'platinum',
    },
  },

  // Specialization achievements
  SPECIALIZATION_ACHIEVEMENTS: {
    MILITARY_SPECIALIST: {
      name: 'War Machine',
      description: 'Complete 20 military technologies',
      requirement: { category: 'military', count: 20 },
      reward: { xp: 10000, credits: 25000, badge: 'war_machine' },
      tier: 'gold',
    },
    ECONOMY_EXPERT: {
      name: 'Merchant Prince',
      description: 'Complete 20 economy technologies',
      requirement: { category: 'economy', count: 20 },
      reward: { xp: 10000, credits: 100000, badge: 'merchant_prince' },
      tier: 'gold',
    },
    SCIENCE_VISIONARY: {
      name: 'Science Visionary',
      description: 'Complete 20 science technologies',
      requirement: { category: 'science', count: 20 },
      reward: { xp: 50000, credits: 25000, badge: 'science_visionary' },
      tier: 'gold',
    },
    RENAISSANCE_MASTER: {
      name: 'Renaissance Master',
      description: 'Complete 20 technologies in 4 different categories',
      requirement: { type: 'multi_category', categoryCount: 4, minPerCategory: 20 },
      reward: { xp: 100000, credits: 250000, badge: 'renaissance_master' },
      tier: 'platinum',
    },
  },

  // Level achievements
  LEVEL_ACHIEVEMENTS: {
    LEVEL_10: {
      name: 'Rising Scholar',
      description: 'Reach level 10 in research XP',
      requirement: 10,
      reward: { xp: 5000, credits: 10000, badge: 'rising_scholar' },
      tier: 'bronze',
    },
    LEVEL_25: {
      name: 'Distinguished Researcher',
      description: 'Reach level 25 in research XP',
      requirement: 25,
      reward: { xp: 15000, credits: 30000, badge: 'distinguished_researcher' },
      tier: 'silver',
    },
    LEVEL_50: {
      name: 'Master Scientist',
      description: 'Reach level 50 in research XP',
      requirement: 50,
      reward: { xp: 50000, credits: 100000, badge: 'master_scientist' },
      tier: 'gold',
    },
    LEVEL_100: {
      name: 'Eternal Genius',
      description: 'Reach level 100 in research XP',
      requirement: 100,
      reward: { xp: 500000, credits: 1000000, badge: 'eternal_genius' },
      tier: 'diamond',
    },
  },

  // Challenge achievements
  CHALLENGE_ACHIEVEMENTS: {
    CHALLENGE_ACCEPTED: {
      name: 'Challenge Accepted',
      description: 'Complete a research challenge',
      requirement: { type: 'challenge_completion', count: 1 },
      reward: { xp: 5000, credits: 10000, badge: 'challenge_accepted' },
      tier: 'silver',
    },
    CHALLENGE_MASTER: {
      name: 'Challenge Master',
      description: 'Complete 10 research challenges',
      requirement: { type: 'challenge_completion', count: 10 },
      reward: { xp: 50000, credits: 100000, badge: 'challenge_master' },
      tier: 'gold',
    },
    NO_SWEAT: {
      name: 'No Sweat',
      description: 'Complete 5 challenges in a row with perfect score',
      requirement: { type: 'perfect_challenges', count: 5 },
      reward: { xp: 100000, credits: 250000, badge: 'no_sweat' },
      tier: 'platinum',
    },
  },

  // Badge tiers
  BADGE_TIERS: {
    bronze: { displayPriority: 1, colorCode: '#CD7F32', multiplier: 1.0 },
    silver: { displayPriority: 2, colorCode: '#C0C0C0', multiplier: 1.2 },
    gold: { displayPriority: 3, colorCode: '#FFD700', multiplier: 1.5 },
    platinum: { displayPriority: 4, colorCode: '#E5E4E2', multiplier: 2.0 },
    diamond: { displayPriority: 5, colorCode: '#B9F2FF', multiplier: 3.0 },
  },

  // Special achievements (hidden until unlocked)
  HIDDEN_ACHIEVEMENTS: {
    EASTER_EGG: {
      name: 'Easter Egg Hunter',
      description: 'Find a hidden technology',
      reward: { xp: 100000, credits: 500000, badge: 'easter_egg_hunter' },
      tier: 'platinum',
      hidden: true,
    },
    SPEED_DEMON: {
      name: 'Speed Demon',
      description: 'Complete 100 technologies in 24 hours (total playtime)',
      reward: { xp: 500000, credits: 2000000, badge: 'speed_demon' },
      tier: 'diamond',
      hidden: true,
    },
  },
};

export interface AchievementProgress {
  achievementId: string;
  category: string;
  progress: number;
  requirement: number;
  completed: boolean;
  unlockedAt?: number;
  tier: string;
}

export interface PlayerAchievements {
  userId: string;
  totalPoints: number;
  achievements: { [key: string]: AchievementProgress };
  badges: string[];
  unlockedTier?: string;
}

/**
 * Get achievement by ID
 */
export function getAchievementById(
  achievementId: string
): {
  name: string;
  description: string;
  requirement: any;
  reward: any;
  tier: string;
} | null {
  const allCategories = Object.values(ACHIEVEMENT_CONFIG);
  for (const category of allCategories) {
    if (typeof category === 'object' && achievementId in category) {
      return (category as any)[achievementId];
    }
  }
  return null;
}

/**
 * Check if achievement is unlocked
 */
export function isAchievementUnlocked(
  progress: AchievementProgress
): boolean {
  return progress.completed && progress.unlockedAt !== undefined;
}

/**
 * Calculate achievement reward
 */
export function calculateAchievementReward(achievement: any): {
  totalXP: number;
  totalCredits: number;
} {
  const tierMultiplier = ACHIEVEMENT_CONFIG.BADGE_TIERS[achievement.tier as keyof typeof ACHIEVEMENT_CONFIG.BADGE_TIERS]?.multiplier || 1.0;
  return {
    totalXP: (achievement.reward.xp || 0) * tierMultiplier,
    totalCredits: (achievement.reward.credits || 0) * tierMultiplier,
  };
}

export type AchievementCategory = keyof typeof ACHIEVEMENT_CONFIG;
export type BadgeTier = keyof typeof ACHIEVEMENT_CONFIG['BADGE_TIERS'];
