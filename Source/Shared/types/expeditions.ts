/**
 * Expedition System Type Definitions
 *
 * Covers:
 *  – 18 categories / 32 sub-categories
 *  – Tiers 1-99 with tierClass, tierSubClass, rank, title, stats, subStats,
 *    descriptions, subDescriptions, attributes, subAttributes, subjects
 *  – Types / sub-types
 *  – Level progression 1-999
 */

// ─── Category & Sub-Category ─────────────────────────────────────────────────

export interface ExpeditionSubCategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  subDescription: string;
  availableTypes: string[];
}

export interface ExpeditionCategory {
  id: string;
  name: string;
  description: string;
  subDescription: string;
  icon: string;
  subCategories: ExpeditionSubCategory[];
}

// ─── Types & Sub-types ───────────────────────────────────────────────────────

export interface ExpeditionSubType {
  id: string;
  typeId: string;
  name: string;
  description: string;
  subDescription: string;
  bonusMultiplier: number;
}

export interface ExpeditionType {
  id: string;
  name: string;
  description: string;
  subDescription: string;
  icon: string;
  subTypes: ExpeditionSubType[];
}

// ─── Stats & Sub-stats ───────────────────────────────────────────────────────

export interface ExpeditionSubStats {
  powerRegen: number;
  speedBoost: number;
  rangeExtension: number;
  stealthBonus: number;
  resilienceBonus: number;
}

export interface ExpeditionStats {
  power: number;
  speed: number;
  range: number;
  stealth: number;
  resilience: number;
  subStats: ExpeditionSubStats;
}

// ─── Attributes & Sub-attributes ─────────────────────────────────────────────

export interface ExpeditionSubAttributes {
  hazardTolerance: number;
  crewMorale: number;
  logisticsEfficiency: number;
  intelligenceGain: number;
  diplomaticInfluence: number;
}

export interface ExpeditionAttributes {
  fleetStrength: number;
  troopCapacity: number;
  cargoCapacity: number;
  scanRadius: number;
  combatRating: number;
  subAttributes: ExpeditionSubAttributes;
}

// ─── Subjects ────────────────────────────────────────────────────────────────

export interface ExpeditionSubjectDetail {
  key: string;
  label: string;
  description: string;
}

export interface ExpeditionSubject {
  id: string;
  name: string;
  description: string;
  subDescription: string;
  details: ExpeditionSubjectDetail[];
}

// ─── Tier ────────────────────────────────────────────────────────────────────

/** Tier classes grouping tiers 1-99 into 10 named brackets */
export type TierClass =
  | "Initiate"
  | "Apprentice"
  | "Scout"
  | "Journeyman"
  | "Adept"
  | "Expert"
  | "Master"
  | "Grandmaster"
  | "Elite"
  | "Legendary";

export interface ExpeditionTier {
  tier: number;             // 1-99
  tierClass: TierClass;
  tierSubClass: string;     // Roman numeral I–X within the class
  name: string;
  rank: string;
  title: string;
  description: string;
  subDescription: string;
  stats: ExpeditionStats;
  attributes: ExpeditionAttributes;
  subjects: ExpeditionSubject[];
  minPlayerLevel: number;   // Minimum player level to access this tier
}

// ─── Level ───────────────────────────────────────────────────────────────────

export interface LevelRewards {
  metal: number;
  crystal: number;
  deuterium: number;
  xp: number;
  tierUnlock?: number;      // tier unlocked at this level (if any)
  specialTitle?: string;
}

export interface ExpeditionLevel {
  level: number;            // 1-999
  name: string;
  xpRequired: number;
  cumulativeXp: number;
  tierUnlocked: number;     // highest tier accessible at this level
  rewards: LevelRewards;
  description: string;
}

// ─── Full Expedition Record (extended) ───────────────────────────────────────

export interface ExpeditionRecord {
  id: string;
  userId: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  typeId: string;
  subTypeId: string;
  tier: number;
  level: number;
  targetCoords: string;
  rank: string;
  title: string;
  status: "preparing" | "in_progress" | "completed" | "failed";
  fleetComposition: Record<string, number>;
  troopComposition: Record<string, number>;
  stats: Partial<ExpeditionStats>;
  attributes: Partial<ExpeditionAttributes>;
  discoveries: string[];
  casualties: Record<string, number>;
  resources: Record<string, number>;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

// ─── API response shapes ─────────────────────────────────────────────────────

export interface ExpeditionCatalogResponse {
  categories: ExpeditionCategory[];
  types: ExpeditionType[];
  tierCount: number;
  levelCount: number;
  categoryCount: number;
  subCategoryCount: number;
}

export interface ExpeditionTiersResponse {
  tiers: ExpeditionTier[];
}

export interface ExpeditionLevelsResponse {
  levels: ExpeditionLevel[];
  totalLevels: number;
}
