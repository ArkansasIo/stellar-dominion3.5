/**
 * Star & Rank Integration System
 * 
 * Provides a unified star-rating and rank system for all game entities:
 * - Starships, Builds (Buildings), Planets, Moons, Space Stations,
 *   Starbases, Moon Bases, Commanders
 * 
 * Star Rating: 1-10 stars representing quality/power tier
 * Rank System: Integrates with existing S/SS/SSS rank system
 */

import {
  SRankTier,
  SRankLevel,
  SRankable,
  createDefaultSRankable,
  getSRankMultiplier,
  getSRankDisplayName,
  calculateSRankBonuses,
  SRankEntityBonuses,
  getSRankCombatEffects,
  SRankCombatEffects,
  getSRankVisualEffects,
  SRankVisualEffect,
  getQualifiedSRank,
  calculateNextSRank,
  getSRankProgress,
  getSRankXPRequired,
} from './rankSystemConfig';

// ============================================================
// STAR RATING SYSTEM
// ============================================================

export type StarRating = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface StarRatingInfo {
  rating: StarRating;
  name: string;
  multiplier: number;
  color: string;
  glowColor: string;
  particleCount: number;
  description: string;
  unlockRequirement: {
    tier: number;
    level: number;
  };
}

export const STAR_RATING_CONFIG: Record<StarRating, StarRatingInfo> = {
  0: { rating: 0, name: 'Unrated', multiplier: 1, color: '#666666', glowColor: '#000000', particleCount: 0, description: 'No star rating', unlockRequirement: { tier: 0, level: 0 } },
  1: { rating: 1, name: '★ Common', multiplier: 1.2, color: '#8B8B8B', glowColor: '#8B8B8B', particleCount: 2, description: 'Basic quality', unlockRequirement: { tier: 1, level: 1 } },
  2: { rating: 2, name: '★★ Uncommon', multiplier: 1.5, color: '#2ECC71', glowColor: '#2ECC71', particleCount: 4, description: 'Improved quality', unlockRequirement: { tier: 3, level: 10 } },
  3: { rating: 3, name: '★★★ Rare', multiplier: 2.0, color: '#3498DB', glowColor: '#3498DB', particleCount: 6, description: 'Notable quality', unlockRequirement: { tier: 5, level: 25 } },
  4: { rating: 4, name: '★★★★ Epic', multiplier: 3.0, color: '#9B59B6', glowColor: '#9B59B6', particleCount: 8, description: 'Exceptional quality', unlockRequirement: { tier: 10, level: 50 } },
  5: { rating: 5, name: '★★★★★ Legendary', multiplier: 5.0, color: '#F39C12', glowColor: '#F39C12', particleCount: 12, description: 'Legendary quality', unlockRequirement: { tier: 15, level: 100 } },
  6: { rating: 6, name: '★★★★★★ Mythic', multiplier: 8.0, color: '#E74C3C', glowColor: '#E74C3C', particleCount: 16, description: 'Mythical quality', unlockRequirement: { tier: 20, level: 150 } },
  7: { rating: 7, name: '★★★★★★★ Divine', multiplier: 12.0, color: '#FFD700', glowColor: '#FFD700', particleCount: 20, description: 'Divine quality', unlockRequirement: { tier: 30, level: 200 } },
  8: { rating: 8, name: '★★★★★★★★ Celestial', multiplier: 18.0, color: '#C0C0C0', glowColor: '#FFFFFF', particleCount: 24, description: 'Celestial quality', unlockRequirement: { tier: 40, level: 300 } },
  9: { rating: 9, name: '★★★★★★★★★ Transcendent', multiplier: 25.0, color: '#FF6B6B', glowColor: '#FF6B6B', particleCount: 30, description: 'Transcendent quality', unlockRequirement: { tier: 50, level: 400 } },
  10: { rating: 10, name: '★★★★★★★★★★ Godlike', multiplier: 40.0, color: '#FF1493', glowColor: '#FF1493', particleCount: 40, description: 'Godlike quality', unlockRequirement: { tier: 60, level: 500 } },
};

// ============================================================
// ENTITY-SPECIFIC STAR & RANK INTERFACES
// ============================================================

export interface StarRankableEntity {
  starRating: StarRating;
  starExperience: number;
  starMaxExperience: number;
  starProgress: number;
  sRank: SRankable;
}

export interface StarShipStarRank extends StarRankableEntity {
  hullClass: string;
  shipRole: string;
  basePower: number;
}

export interface BuildingStarRank extends StarRankableEntity {
  buildingId: string;
  buildingType: string;
  baseProduction: number;
  baseDefense: number;
}

export interface PlanetStarRank extends StarRankableEntity {
  planetType: string;
  habitability: number;
  resourceMultiplier: number;
}

export interface MoonStarRank extends StarRankableEntity {
  moonType: string;
  mineralWealth: number;
  energyOutput: number;
}

export interface SpaceStationStarRank extends StarRankableEntity {
  stationType: string;
  stationClass: string;
  baseDefense: number;
  baseProduction: number;
}

export interface StarbaseStarRank extends StarRankableEntity {
  starbaseType: string;
  starbaseClass: string;
  baseDefense: number;
  fleetCapacity: number;
}

export interface MoonBaseStarRank extends StarRankableEntity {
  baseType: string;
  baseClass: string;
  baseDefense: number;
  resourceExtraction: number;
}

export interface CommanderStarRank extends StarRankableEntity {
  commanderClass: string;
  commanderSubClass: string;
  baseStats: {
    warfare: number;
    logistics: number;
    science: number;
    engineering: number;
  };
}

// ============================================================
// STAR RATING CALCULATION
// ============================================================

export function calculateStarRating(tier: number, level: number): StarRating {
  const ratings: StarRating[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  for (const rating of ratings) {
    const req = STAR_RATING_CONFIG[rating].unlockRequirement;
    if (tier >= req.tier && level >= req.level) return rating;
  }
  return 0;
}

export function getStarRatingInfo(rating: StarRating): StarRatingInfo {
  return STAR_RATING_CONFIG[rating];
}

export function getStarRatingMultiplier(rating: StarRating): number {
  return STAR_RATING_CONFIG[rating].multiplier;
}

export function getStarRatingColor(rating: StarRating): string {
  return STAR_RATING_CONFIG[rating].color;
}

export function getStarRatingGlow(rating: StarRating): string {
  return STAR_RATING_CONFIG[rating].glowColor;
}

export function getStarRatingVisualEffects(rating: StarRating): {
  particleColor: string;
  particleCount: number;
  glowIntensity: number;
  animationSpeed: number;
} {
  const info = STAR_RATING_CONFIG[rating];
  return {
    particleColor: info.glowColor,
    particleCount: info.particleCount,
    glowIntensity: rating * 0.1,
    animationSpeed: 1 + rating * 0.2,
  };
}

export function getStarRatingDisplayName(rating: StarRating): string {
  if (rating === 0) return 'No Stars';
  return '★'.repeat(rating);
}

// ============================================================
// COMBINED STAR + RANK BONUSES
// ============================================================

export interface CombinedStarRankBonuses {
  starMultiplier: number;
  sRankMultiplier: number;
  combinedMultiplier: number;
  damageBonus: number;
  defenseBonus: number;
  healthBonus: number;
  shieldBonus: number;
  speedBonus: number;
  productionBonus: number;
  resourceBonus: number;
  tradeBonus: number;
  researchSpeedBonus: number;
  researchCostReduction: number;
  buildSpeedBonus: number;
  buildCostReduction: number;
  criticalChanceBonus: number;
  criticalDamageBonus: number;
  evasionBonus: number;
  accuracyBonus: number;
  lootBonus: number;
  experienceBonus: number;
}

export function calculateCombinedBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel
): CombinedStarRankBonuses {
  const starMultiplier = getStarRatingMultiplier(starRating);
  const sRankMultiplier = getSRankMultiplier(sRankTier, sRankLevel);
  const combinedMultiplier = starMultiplier * sRankMultiplier;
  
  const sRankBonuses = calculateSRankBonuses(sRankTier, sRankLevel);
  
  return {
    starMultiplier,
    sRankMultiplier,
    combinedMultiplier,
    damageBonus: sRankBonuses.damageMultiplier * starMultiplier,
    defenseBonus: sRankBonuses.defenseMultiplier * starMultiplier,
    healthBonus: sRankBonuses.healthMultiplier * starMultiplier,
    shieldBonus: sRankBonuses.shieldMultiplier * starMultiplier,
    speedBonus: sRankBonuses.speedMultiplier * Math.sqrt(starMultiplier),
    productionBonus: sRankBonuses.productionMultiplier * starMultiplier,
    resourceBonus: sRankBonuses.resourceMultiplier * starMultiplier,
    tradeBonus: sRankBonuses.tradeMultiplier * starMultiplier,
    researchSpeedBonus: sRankBonuses.researchSpeedMultiplier * starMultiplier,
    researchCostReduction: Math.min(0.95, sRankBonuses.researchCostReduction + (starRating * 0.02)),
    buildSpeedBonus: sRankBonuses.buildSpeedMultiplier * starMultiplier,
    buildCostReduction: Math.min(0.95, sRankBonuses.buildCostReduction + (starRating * 0.02)),
    criticalChanceBonus: sRankBonuses.criticalChanceBonus + (starRating * 2),
    criticalDamageBonus: sRankBonuses.criticalDamageBonus + (starRating * 25),
    evasionBonus: sRankBonuses.evasionBonus + (starRating * 3),
    accuracyBonus: sRankBonuses.accuracyBonus + (starRating * 5),
    lootBonus: sRankBonuses.lootMultiplier * starMultiplier,
    experienceBonus: sRankBonuses.experienceMultiplier * starMultiplier,
  };
}

// ============================================================
// ENTITY-SPECIFIC BONUS CALCULATIONS
// ============================================================

export function calculateStarShipBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel,
  hullClass: string
): CombinedStarRankBonuses {
  const base = calculateCombinedBonuses(starRating, sRankTier, sRankLevel);
  
  const classMultipliers: Record<string, Partial<CombinedStarRankBonuses>> = {
    'Corvette': { speedBonus: 1.2, evasionBonus: 1.3, damageBonus: 0.9 },
    'Frigate': { speedBonus: 1.1, defenseBonus: 1.1, damageBonus: 1.0 },
    'Destroyer': { damageBonus: 1.2, defenseBonus: 1.0, shieldBonus: 0.9 },
    'Cruiser': { defenseBonus: 1.2, healthBonus: 1.1, productionBonus: 1.05 },
    'Battleship': { defenseBonus: 1.3, healthBonus: 1.3, damageBonus: 1.1, speedBonus: 0.8 },
    'Carrier': { productionBonus: 1.2, tradeBonus: 1.1, healthBonus: 1.0 },
    'Industrial': { productionBonus: 1.3, resourceBonus: 1.2, tradeBonus: 1.1 },
  };
  
  const classBonus = classMultipliers[hullClass] || {};
  return { ...base, ...classBonus };
}

export function calculateBuildingBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel,
  buildingType: string
): CombinedStarRankBonuses {
  const base = calculateCombinedBonuses(starRating, sRankTier, sRankLevel);
  
  const typeMultipliers: Record<string, Partial<CombinedStarRankBonuses>> = {
    'mine': { productionBonus: 1.3, resourceBonus: 1.2 },
    'factory': { productionBonus: 1.2, buildSpeedBonus: 1.1 },
    'laboratory': { researchSpeedBonus: 1.3, researchCostReduction: 0.05 },
    'defense': { defenseBonus: 1.3, healthBonus: 1.2 },
    'orbital': { productionBonus: 1.1, tradeBonus: 1.1, defenseBonus: 1.05 },
    'power': { productionBonus: 1.2, resourceBonus: 1.1 },
    'storage': { resourceBonus: 1.3, tradeBonus: 1.1 },
  };
  
  const typeBonus = typeMultipliers[buildingType] || {};
  return { ...base, ...typeBonus };
}

export function calculatePlanetBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel,
  habitability: number
): CombinedStarRankBonuses {
  const base = calculateCombinedBonuses(starRating, sRankTier, sRankLevel);
  const habitabilityBonus = habitability / 100;
  
  return {
    ...base,
    productionBonus: base.productionBonus * (1 + habitabilityBonus * 0.3),
    resourceBonus: base.resourceBonus * (1 + habitabilityBonus * 0.2),
    healthBonus: base.healthBonus * (1 + habitabilityBonus * 0.1),
  };
}

export function calculateMoonBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel,
  mineralWealth: number
): CombinedStarRankBonuses {
  const base = calculateCombinedBonuses(starRating, sRankTier, sRankLevel);
  const mineralBonus = mineralWealth / 100;
  
  return {
    ...base,
    productionBonus: base.productionBonus * (1 + mineralBonus * 0.4),
    resourceBonus: base.resourceBonus * (1 + mineralBonus * 0.3),
  };
}

export function calculateStationBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel,
  stationClass: string
): CombinedStarRankBonuses {
  const base = calculateCombinedBonuses(starRating, sRankTier, sRankLevel);
  
  const classMultipliers: Record<string, Partial<CombinedStarRankBonuses>> = {
    'Civilian': { tradeBonus: 1.3, productionBonus: 1.1 },
    'Military': { defenseBonus: 1.3, damageBonus: 1.2 },
    'Industrial': { productionBonus: 1.3, resourceBonus: 1.2 },
    'Scientific': { researchSpeedBonus: 1.3, researchCostReduction: 0.05 },
  };
  
  const classBonus = classMultipliers[stationClass] || {};
  return { ...base, ...classBonus };
}

export function calculateStarbaseBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel,
  starbaseClass: string
): CombinedStarRankBonuses {
  const base = calculateCombinedBonuses(starRating, sRankTier, sRankLevel);
  
  const classMultipliers: Record<string, Partial<CombinedStarRankBonuses>> = {
    'Defense Hub': { defenseBonus: 1.3, healthBonus: 1.2, shieldBonus: 1.1 },
    'Resource Hub': { productionBonus: 1.3, resourceBonus: 1.2, tradeBonus: 1.1 },
    'Command Hub': { damageBonus: 1.2, speedBonus: 1.1, accuracyBonus: 1.1 },
    'Trade Hub': { tradeBonus: 1.3, productionBonus: 1.1, resourceBonus: 1.1 },
  };
  
  const classBonus = classMultipliers[starbaseClass] || {};
  return { ...base, ...classBonus };
}

export function calculateMoonBaseBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel,
  baseClass: string
): CombinedStarRankBonuses {
  const base = calculateCombinedBonuses(starRating, sRankTier, sRankLevel);
  
  const classMultipliers: Record<string, Partial<CombinedStarRankBonuses>> = {
    'small': { productionBonus: 1.0, defenseBonus: 1.0 },
    'medium': { productionBonus: 1.1, defenseBonus: 1.1 },
    'large': { productionBonus: 1.2, defenseBonus: 1.2, resourceBonus: 1.1 },
    'capital': { productionBonus: 1.3, defenseBonus: 1.3, resourceBonus: 1.2 },
    'ancient': { productionBonus: 1.5, defenseBonus: 1.5, researchSpeedBonus: 1.2 },
    'ascended': { productionBonus: 2.0, defenseBonus: 2.0, researchSpeedBonus: 1.5 },
  };
  
  const classBonus = classMultipliers[baseClass] || {};
  return { ...base, ...classBonus };
}

export function calculateCommanderBonuses(
  starRating: StarRating,
  sRankTier: SRankTier,
  sRankLevel: SRankLevel,
  commanderClass: string
): CombinedStarRankBonuses {
  const base = calculateCombinedBonuses(starRating, sRankTier, sRankLevel);
  
  const classMultipliers: Record<string, Partial<CombinedStarRankBonuses>> = {
    'admiral': { damageBonus: 1.3, speedBonus: 1.1, evasionBonus: 1.1 },
    'industrialist': { productionBonus: 1.3, resourceBonus: 1.2, buildSpeedBonus: 1.1 },
    'scientist': { researchSpeedBonus: 1.3, researchCostReduction: 0.05 },
    'diplomat': { tradeBonus: 1.3, experienceBonus: 1.1 },
    'explorer': { speedBonus: 1.2, evasionBonus: 1.2, lootBonus: 1.1 },
    'merchant': { tradeBonus: 1.4, resourceBonus: 1.2, lootBonus: 1.1 },
  };
  
  const classBonus = classMultipliers[commanderClass] || {};
  return { ...base, ...classBonus };
}

// ============================================================
// STAR & RANK STATE MANAGER
// ============================================================

export class StarRankManager {
  static createDefault(): StarRankableEntity {
    return {
      starRating: 0,
      starExperience: 0,
      starMaxExperience: 1000,
      starProgress: 0,
      sRank: createDefaultSRankable(),
    };
  }

  static calculateStarRating(entity: { tier: number; level: number }): StarRating {
    return calculateStarRating(entity.tier, entity.level);
  }

  static addStarExperience(
    entity: StarRankableEntity,
    xpAmount: number,
    tier: number,
    level: number
  ): { entity: StarRankableEntity; leveledUp: boolean; newRating: StarRating } {
    const requiredXP = getStarRatingXPRequired(entity.starRating);
    let newXP = entity.starExperience + xpAmount;
    let newRating = entity.starRating;
    let leveledUp = false;

    while (newXP >= getStarRatingXPRequired(newRating) && newRating < 10) {
      newXP -= getStarRatingXPRequired(newRating);
      newRating = (newRating + 1) as StarRating;
      leveledUp = true;
    }

    const maxXP = getStarRatingXPRequired(newRating);
    const progress = getSRankProgress(newXP, maxXP);

    return {
      entity: {
        ...entity,
        starRating: newRating,
        starExperience: newXP,
        starMaxExperience: maxXP,
        starProgress: progress,
      },
      leveledUp,
      newRating,
    };
  }

  static addSRankExperience(
    entity: StarRankableEntity,
    xpAmount: number
  ): { entity: StarRankableEntity; leveledUp: boolean; newTier: SRankTier; newLevel: SRankLevel } {
    const result = calculateNextSRank(
      entity.sRank.sRankTier,
      entity.sRank.sRankLevel,
      xpAmount,
      entity.sRank.sRankExperience
    );

    return {
      entity: {
        ...entity,
        sRank: {
          ...entity.sRank,
          sRankTier: result.tier,
          sRankLevel: result.level,
          sRankExperience: result.xp,
          sRankMaxExperience: result.maxXP,
          sRankProgress: getSRankProgress(result.xp, result.maxXP),
        },
      },
      leveledUp: result.leveledUp,
      newTier: result.tier,
      newLevel: result.level,
    };
  }

  static getDisplayName(entity: StarRankableEntity): string {
    const starDisplay = getStarRatingDisplayName(entity.starRating);
    const rankDisplay = getSRankDisplayName(entity.sRank.sRankTier, entity.sRank.sRankLevel);
    return `${starDisplay} ${rankDisplay}`.trim();
  }

  static getSummary(entity: StarRankableEntity): {
    stars: StarRating;
    starName: string;
    starMultiplier: number;
    rank: string;
    rankLevel: number;
    rankMultiplier: number;
    combinedMultiplier: number;
    starProgress: number;
    rankProgress: number;
  } {
    const starInfo = getStarRatingInfo(entity.starRating);
    const rankMultiplier = getSRankMultiplier(entity.sRank.sRankTier, entity.sRank.sRankLevel);
    
    return {
      stars: entity.starRating,
      starName: starInfo.name,
      starMultiplier: starInfo.multiplier,
      rank: getSRankDisplayName(entity.sRank.sRankTier, entity.sRank.sRankLevel) || 'None',
      rankLevel: entity.sRank.sRankLevel,
      rankMultiplier,
      combinedMultiplier: starInfo.multiplier * rankMultiplier,
      starProgress: entity.starProgress,
      rankProgress: entity.sRank.sRankProgress,
    };
  }

  static getVisualEffects(entity: StarRankableEntity): {
    star: { particleColor: string; particleCount: number; glowIntensity: number; animationSpeed: number };
    rank: SRankVisualEffect;
  } {
    return {
      star: getStarRatingVisualEffects(entity.starRating),
      rank: getSRankVisualEffects(entity.sRank.sRankTier, entity.sRank.sRankLevel),
    };
  }

  static getCombatEffects(entity: StarRankableEntity): SRankCombatEffects {
    return getSRankCombatEffects(entity.sRank.sRankTier, entity.sRank.sRankLevel);
  }

  static checkRankUp(
    entity: StarRankableEntity,
    tier: number,
    level: number
  ): { starChanged: boolean; rankChanged: boolean; newStar: StarRating; newTier: SRankTier; newLevel: SRankLevel } {
    const newStar = calculateStarRating(tier, level);
    const rankCheck = getQualifiedSRank(tier, level);
    
    return {
      starChanged: newStar !== entity.starRating,
      rankChanged: rankCheck.tier !== entity.sRank.sRankTier || rankCheck.level !== entity.sRank.sRankLevel,
      newStar,
      newTier: rankCheck.tier,
      newLevel: rankCheck.level,
    };
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getStarRatingXPRequired(currentRating: StarRating): number {
  if (currentRating >= 10) return Infinity;
  return Math.floor(1000 * Math.pow(1.5, currentRating));
}

// ============================================================
// DEFAULT ENTITIES WITH STAR & RANK
// ============================================================

export function createDefaultStarShipStarRank(): StarShipStarRank {
  return {
    ...StarRankManager.createDefault(),
    hullClass: 'Corvette',
    shipRole: 'Patrol',
    basePower: 100,
  };
}

export function createDefaultBuildingStarRank(): BuildingStarRank {
  return {
    ...StarRankManager.createDefault(),
    buildingId: 'metal-mine',
    buildingType: 'mine',
    baseProduction: 30,
    baseDefense: 0,
  };
}

export function createDefaultPlanetStarRank(): PlanetStarRank {
  return {
    ...StarRankManager.createDefault(),
    planetType: 'terrestrial',
    habitability: 80,
    resourceMultiplier: 1.0,
  };
}

export function createDefaultMoonStarRank(): MoonStarRank {
  return {
    ...StarRankManager.createDefault(),
    moonType: 'rocky',
    mineralWealth: 60,
    energyOutput: 600,
  };
}

export function createDefaultSpaceStationStarRank(): SpaceStationStarRank {
  return {
    ...StarRankManager.createDefault(),
    stationType: 'Civilian',
    stationClass: 'Dockyard',
    baseDefense: 500,
    baseProduction: 100,
  };
}

export function createDefaultStarbaseStarRank(): StarbaseStarRank {
  return {
    ...StarRankManager.createDefault(),
    starbaseType: 'Defense Hub',
    starbaseClass: 'Perimeter',
    baseDefense: 1000,
    fleetCapacity: 5000,
  };
}

export function createDefaultMoonBaseStarRank(): MoonBaseStarRank {
  return {
    ...StarRankManager.createDefault(),
    baseType: 'outpost',
    baseClass: 'small',
    baseDefense: 20,
    resourceExtraction: 100,
  };
}

export function createDefaultCommanderStarRank(): CommanderStarRank {
  return {
    ...StarRankManager.createDefault(),
    commanderClass: 'admiral',
    commanderSubClass: 'tactician',
    baseStats: {
      warfare: 10,
      logistics: 5,
      science: 5,
      engineering: 5,
    },
  };
}
