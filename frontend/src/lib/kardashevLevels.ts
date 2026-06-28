// Kardashev Levels System - 1 to 999
// Each level maps to a tier (1-99) and provides specific progression data within that tier.
// Tiers 1-90 contain 10 levels each; tiers 91-99 contain 11 levels each = 999 total.

import {
  getTierForLevel,
  getLevelProgressWithinTier,
  getExtendedTier,
  KARDASHEV_TIERS_EXTENDED,
  type KardashevTierExtended,
} from "./kardashevExtended";

export interface KardashevLevelData {
  level: number;
  tier: number;
  levelInTier: number;
  totalLevelsInTier: number;
  tierName: string;
  category: string;
  subCategory: string;
  rank: string;
  title: string;
  name: string;
  description: string;
  xpRequired: number;
  xpCumulative: number;
  bonusMultiplier: number;
  productionBonus: number;
  researchBonus: number;
  combatBonus: number;
  energyBonus: number;
  milestoneReward: string | null;
  isPrestigeTier: boolean;
}

// Level name suffixes that refine the tier name per level within a tier
const LEVEL_SUFFIXES = [
  "Aspirant", "Initiate", "Apprentice", "Journeyman", "Adept",
  "Practitioner", "Expert", "Master", "Grand Master", "Paragon", "Transcendent",
];

function getLevelName(tier: KardashevTierExtended, levelInTier: number): string {
  const suffix = LEVEL_SUFFIXES[Math.min(levelInTier - 1, LEVEL_SUFFIXES.length - 1)];
  return `${tier.name} ${suffix}`;
}

function getLevelRank(tier: KardashevTierExtended, levelInTier: number, totalInTier: number): string {
  const progress = levelInTier / totalInTier;
  if (progress < 0.33) return `${tier.rank} I`;
  if (progress < 0.67) return `${tier.rank} II`;
  return `${tier.rank} III`;
}

function calculateXpRequired(level: number): number {
  // Exponential XP scaling using exponent 2.8: gives ~100 XP at level 1 and
  // ~1 billion XP at level 999, producing a steep but not insurmountable curve.
  return Math.round(100 * Math.pow(level, 2.8));
}

function calculateBonusMultiplier(level: number): number {
  // Linear multiplier: starts at 1.0x (level 1) and reaches 10.0x (level 999).
  // Formula: 1 + (level-1) * (10-1) / (999-1)  →  range [1.0, 10.0] over 999 levels.
  return Math.round((1 + (level - 1) * 9 / 998) * 100) / 100;
}

function getMilestoneReward(level: number): string | null {
  const milestones: Record<number, string> = {
    1: "Starting Resources Package",
    10: "Basic Fleet Unlocked",
    25: "Research Accelerator I",
    50: "Resource Doubler I",
    75: "Fleet Expansion Pack I",
    100: "Tier Milestone: First Century",
    150: "Research Accelerator II",
    200: "Resource Doubler II",
    250: "Fleet Expansion Pack II",
    300: "Tier Milestone: Third Century",
    400: "Research Accelerator III",
    500: "Resource Doubler III - Half Way!",
    600: "Fleet Expansion Pack III",
    700: "Research Accelerator IV",
    750: "Grand Milestone: Three Quarters",
    800: "Resource Doubler IV",
    900: "Fleet Expansion Pack IV",
    950: "Penultimate Milestone",
    990: "Final Approach",
    999: "Supreme Omnipotent Achievement - Final Level Reached!",
  };
  return milestones[level] ?? null;
}

function isPrestigeTier(tier: number): boolean {
  // Every 11th tier is a prestige milestone
  return tier % 11 === 0;
}

// Build a single level entry
function buildLevel(level: number): KardashevLevelData {
  const tier = getTierForLevel(level);
  const { levelInTier, totalInTier, percentage: _pct } = getLevelProgressWithinTier(level);
  const tierData = getExtendedTier(tier);

  const xpRequired = calculateXpRequired(level);
  // Cumulative XP approximation (sum of all levels 1 to level-1)
  // Using integral approximation: ∫₁ˡ 100 * x^2.8 dx ≈ (100 / 3.8) * (l^3.8 - 1)
  const xpCumulative = level <= 1 ? 0 : Math.round((100 / 3.8) * (Math.pow(level, 3.8) - 1));

  const bonusMultiplier = calculateBonusMultiplier(level);
  const tierProgress = (tier - 1) / 98;
  const levelProgressFraction = (level - 1) / 998;

  return {
    level,
    tier,
    levelInTier,
    totalLevelsInTier: totalInTier,
    tierName: tierData.name,
    category: tierData.category,
    subCategory: tierData.subCategory,
    rank: getLevelRank(tierData, levelInTier, totalInTier),
    title: tierData.title,
    name: getLevelName(tierData, levelInTier),
    description: `${tierData.subDescription} (Level ${level} of 999 — Tier ${tier} of 99)`,
    xpRequired,
    xpCumulative,
    bonusMultiplier,
    productionBonus: Math.round(tierProgress * 5000 + levelProgressFraction * 200),
    researchBonus: Math.round(tierProgress * 5000 + levelProgressFraction * 200),
    combatBonus: Math.round(tierProgress * 8000 + levelProgressFraction * 300),
    energyBonus: Math.round(tierProgress * 5000 + levelProgressFraction * 200),
    milestoneReward: getMilestoneReward(level),
    isPrestigeTier: isPrestigeTier(tier),
  };
}

// Generate all 999 levels lazily via a cache to avoid massive startup cost
const levelCache = new Map<number, KardashevLevelData>();

export function getKardashevLevel(level: number): KardashevLevelData {
  const clamped = Math.max(1, Math.min(999, Math.round(level)));
  if (!levelCache.has(clamped)) {
    levelCache.set(clamped, buildLevel(clamped));
  }
  return levelCache.get(clamped)!;
}

/** Return an array of KardashevLevelData for levels [start, end] (inclusive). */
export function getKardashevLevelRange(start: number, end: number): KardashevLevelData[] {
  const result: KardashevLevelData[] = [];
  for (let l = Math.max(1, start); l <= Math.min(999, end); l++) {
    result.push(getKardashevLevel(l));
  }
  return result;
}

/** Return all milestone levels. */
export function getMilestoneLevels(): KardashevLevelData[] {
  const milestonesSet = new Set([
    1, 10, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 750, 800, 900, 950, 990, 999,
  ]);
  return [...milestonesSet].map(l => getKardashevLevel(l));
}

/** Return all levels for a given tier (1-99). */
export function getLevelsForTier(tier: number): KardashevLevelData[] {
  const tierData = KARDASHEV_TIERS_EXTENDED[Math.max(1, Math.min(99, tier))];
  if (!tierData) return [];
  const [start, end] = tierData.levelRange;
  return getKardashevLevelRange(start, end);
}

/** Calculate the level a player would be at given total accumulated XP. */
export function getLevelFromXp(totalXp: number): { level: number; xpIntoLevel: number; xpRequiredForNext: number } {
  let cumulative = 0;
  for (let l = 1; l <= 999; l++) {
    const required = calculateXpRequired(l);
    if (totalXp < cumulative + required) {
      return { level: l, xpIntoLevel: totalXp - cumulative, xpRequiredForNext: required };
    }
    cumulative += required;
  }
  return { level: 999, xpIntoLevel: 0, xpRequiredForNext: 0 };
}

export const TOTAL_LEVELS = 999;
export const MAX_BONUS_MULTIPLIER = calculateBonusMultiplier(999);
