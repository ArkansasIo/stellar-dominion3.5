/**
 * Star Rarity System - 12 Star Levels with 9 Rarity Tiers
 * 
 * Integrates with the S/SS/SSS Rank System to provide a visual
 * star-rarity progression. Each entity displays its star count (★1-★12)
 * combined with a rarity color and its S-rank designation.
 * 
 * Progression Flow:
 *   ★1-★4  → Common to Rare       → No S-Rank
 *   ★5-★7  → Epic to Mythic       → S-Rank (S1-S10)
 *   ★8-★10 → Transcendent/Ascended → SS-Rank (SS1-SS10)  
 *   ★11-★12→ Godlike/Divine        → SSS-Rank (SSS1-SSS10)
 * 
 * 9 Rarity Tiers with Colors:
 *   1. Common      (#A0A0A0) - Grey/Silver
 *   2. Uncommon    (#4CAF50) - Green
 *   3. Rare        (#2196F3) - Blue
 *   4. Epic        (#9C27B0) - Purple
 *   5. Legendary   (#FF9800) - Orange
 *   6. Mythic      (#F44336) - Red
 *   7. Transcendent(#FFD700) - Gold (S-Rank)
 *   8. Ascended    (#E0E0E0) - Silver/White (SS-Rank)
 *   9. Godlike     (#FF6B6B) - Crimson (SSS-Rank)
 */

// ============================================================
// STAR LEVEL & RARITY DEFINITIONS
// ============================================================

export type StarLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type RarityTier =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'
  | 'transcendent'
  | 'ascended'
  | 'godlike';

export interface RarityDefinition {
  tier: RarityTier;
  name: string;
  color: string;
  colorHex: string;
  gradient: string;
  glowColor: string;
  textShadow: string;
  borderColor: string;
  backgroundColor: string;
  starColor: string;
  order: number; // 1-9 for sorting
}

export interface StarLevelDefinition {
  stars: StarLevel;
  displayName: string;    // e.g., "★★★★★★"
  shortName: string;      // e.g., "★6"
  rarity: RarityTier;
  minEntityTier: number;  // Minimum entity tier required
  minEntityLevel: number; // Minimum entity level required
  statMultiplier: number; // Overall stat multiplier
  requiredSRankTier: string; // 'none' | 'S' | 'SS' | 'SSS'
  requiredSRankLevel: number; // Minimum S-rank level needed
  bonusPerk: string;      // Special perk unlocked at this star level
}

// ============================================================
// 9 RARITY TIERS WITH COLORS
// ============================================================

export const RARITY_DEFINITIONS: Record<RarityTier, RarityDefinition> = {
  common: {
    tier: 'common',
    name: 'Common',
    color: '#A0A0A0',
    colorHex: '#A0A0A0',
    gradient: 'linear-gradient(135deg, #A0A0A0 0%, #707070 100%)',
    glowColor: 'rgba(160,160,160,0.3)',
    textShadow: '0 0 5px rgba(160,160,160,0.3)',
    borderColor: '#707070',
    backgroundColor: 'rgba(160,160,160,0.1)',
    starColor: '#A0A0A0',
    order: 1,
  },
  uncommon: {
    tier: 'uncommon',
    name: 'Uncommon',
    color: '#4CAF50',
    colorHex: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    glowColor: 'rgba(76,175,80,0.3)',
    textShadow: '0 0 5px rgba(76,175,80,0.3)',
    borderColor: '#2E7D32',
    backgroundColor: 'rgba(76,175,80,0.1)',
    starColor: '#66BB6A',
    order: 2,
  },
  rare: {
    tier: 'rare',
    name: 'Rare',
    color: '#2196F3',
    colorHex: '#2196F3',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
    glowColor: 'rgba(33,150,243,0.3)',
    textShadow: '0 0 5px rgba(33,150,243,0.3)',
    borderColor: '#1565C0',
    backgroundColor: 'rgba(33,150,243,0.1)',
    starColor: '#42A5F5',
    order: 3,
  },
  epic: {
    tier: 'epic',
    name: 'Epic',
    color: '#9C27B0',
    colorHex: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)',
    glowColor: 'rgba(156,39,176,0.35)',
    textShadow: '0 0 8px rgba(156,39,176,0.4)',
    borderColor: '#6A1B9A',
    backgroundColor: 'rgba(156,39,176,0.1)',
    starColor: '#AB47BC',
    order: 4,
  },
  legendary: {
    tier: 'legendary',
    name: 'Legendary',
    color: '#FF9800',
    colorHex: '#FF9800',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
    glowColor: 'rgba(255,152,0,0.4)',
    textShadow: '0 0 10px rgba(255,152,0,0.5)',
    borderColor: '#E65100',
    backgroundColor: 'rgba(255,152,0,0.1)',
    starColor: '#FFA726',
    order: 5,
  },
  mythic: {
    tier: 'mythic',
    name: 'Mythic',
    color: '#F44336',
    colorHex: '#F44336',
    gradient: 'linear-gradient(135deg, #F44336 0%, #B71C1C 100%)',
    glowColor: 'rgba(244,67,54,0.4)',
    textShadow: '0 0 12px rgba(244,67,54,0.5)',
    borderColor: '#B71C1C',
    backgroundColor: 'rgba(244,67,54,0.1)',
    starColor: '#EF5350',
    order: 6,
  },
  transcendent: {
    tier: 'transcendent',
    name: 'Transcendent',
    color: '#FFD700',
    colorHex: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FF8F00 100%)',
    glowColor: 'rgba(255,215,0,0.5)',
    textShadow: '0 0 15px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.3)',
    borderColor: '#FF8F00',
    backgroundColor: 'rgba(255,215,0,0.1)',
    starColor: '#FFD700',
    order: 7,
  },
  ascended: {
    tier: 'ascended',
    name: 'Ascended',
    color: '#E0E0E0',
    colorHex: '#E0E0E0',
    gradient: 'linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)',
    glowColor: 'rgba(224,224,224,0.5)',
    textShadow: '0 0 15px rgba(224,224,224,0.6), 0 0 30px rgba(224,224,224,0.3)',
    borderColor: '#9E9E9E',
    backgroundColor: 'rgba(224,224,224,0.1)',
    starColor: '#F5F5F5',
    order: 8,
  },
  godlike: {
    tier: 'godlike',
    name: 'Godlike',
    color: '#FF6B6B',
    colorHex: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C62828 100%)',
    glowColor: 'rgba(255,107,107,0.6)',
    textShadow: '0 0 20px rgba(255,107,107,0.7), 0 0 40px rgba(255,107,107,0.4), 0 0 60px rgba(255,107,107,0.2)',
    borderColor: '#C62828',
    backgroundColor: 'rgba(255,107,107,0.1)',
    starColor: '#FF8A80',
    order: 9,
  },
};

// ============================================================
// 12 STAR LEVEL DEFINITIONS
// ============================================================

export const STAR_LEVEL_DEFINITIONS: StarLevelDefinition[] = [
  // ★1 - Common - No S-Rank required
  {
    stars: 1,
    displayName: '★',
    shortName: '★1',
    rarity: 'common',
    minEntityTier: 1,
    minEntityLevel: 1,
    statMultiplier: 1.0,
    requiredSRankTier: 'none',
    requiredSRankLevel: 0,
    bonusPerk: 'No special perks',
  },
  // ★2 - Common - No S-Rank required
  {
    stars: 2,
    displayName: '★★',
    shortName: '★2',
    rarity: 'common',
    minEntityTier: 2,
    minEntityLevel: 10,
    statMultiplier: 1.5,
    requiredSRankTier: 'none',
    requiredSRankLevel: 0,
    bonusPerk: '+5% resource production',
  },
  // ★3 - Uncommon - No S-Rank required
  {
    stars: 3,
    displayName: '★★★',
    shortName: '★3',
    rarity: 'uncommon',
    minEntityTier: 5,
    minEntityLevel: 25,
    statMultiplier: 2.5,
    requiredSRankTier: 'none',
    requiredSRankLevel: 0,
    bonusPerk: '+10% resource production, +5% combat damage',
  },
  // ★4 - Rare - No S-Rank required
  {
    stars: 4,
    displayName: '★★★★',
    shortName: '★4',
    rarity: 'rare',
    minEntityTier: 8,
    minEntityLevel: 60,
    statMultiplier: 4.0,
    requiredSRankTier: 'none',
    requiredSRankLevel: 0,
    bonusPerk: '+15% production, +10% damage, +5% defense',
  },
  // ★5 - Epic - No S-Rank required (gateway to S-Rank)
  {
    stars: 5,
    displayName: '★★★★★',
    shortName: '★5',
    rarity: 'epic',
    minEntityTier: 10,
    minEntityLevel: 100,
    statMultiplier: 6.0,
    requiredSRankTier: 'none',
    requiredSRankLevel: 0,
    bonusPerk: '+20% all stats. Unlocks S-Rank qualification.',
  },
  // ★6 - Legendary - S-Rank (S1-S3)
  {
    stars: 6,
    displayName: '★★★★★★',
    shortName: '★6',
    rarity: 'legendary',
    minEntityTier: 15,
    minEntityLevel: 150,
    statMultiplier: 10.0,
    requiredSRankTier: 'S',
    requiredSRankLevel: 1,
    bonusPerk: '+50% all stats. Transcendence Strike unlocked.',
  },
  // ★7 - Mythic - S-Rank (S4-S10)
  {
    stars: 7,
    displayName: '★★★★★★★',
    shortName: '★7',
    rarity: 'mythic',
    minEntityTier: 25,
    minEntityLevel: 250,
    statMultiplier: 18.0,
    requiredSRankTier: 'S',
    requiredSRankLevel: 4,
    bonusPerk: '+100% all stats. Rank Aura unlocked.',
  },
  // ★8 - Transcendent - SS-Rank (SS1-SS5)
  {
    stars: 8,
    displayName: '★★★★★★★★',
    shortName: '★8',
    rarity: 'transcendent',
    minEntityTier: 35,
    minEntityLevel: 350,
    statMultiplier: 35.0,
    requiredSRankTier: 'SS',
    requiredSRankLevel: 1,
    bonusPerk: '+200% all stats. Ascension abilities unlocked.',
  },
  // ★9 - Transcendent - SS-Rank (SS6-SS10)
  {
    stars: 9,
    displayName: '★★★★★★★★★',
    shortName: '★9',
    rarity: 'transcendent',
    minEntityTier: 50,
    minEntityLevel: 500,
    statMultiplier: 60.0,
    requiredSRankTier: 'SS',
    requiredSRankLevel: 6,
    bonusPerk: '+350% all stats. Rank Suppression unlocked.',
  },
  // ★10 - Ascended - SS-Rank max
  {
    stars: 10,
    displayName: '★★★★★★★★★★',
    shortName: '★10',
    rarity: 'ascended',
    minEntityTier: 60,
    minEntityLevel: 600,
    statMultiplier: 100.0,
    requiredSRankTier: 'SS',
    requiredSRankLevel: 10,
    bonusPerk: '+500% all stats. Unlocks SSS-Rank qualification. Ascended Aura.',
  },
  // ★11 - Godlike - SSS-Rank (SSS1-SSS5)
  {
    stars: 11,
    displayName: '★★★★★★★★★★★',
    shortName: '★11',
    rarity: 'godlike',
    minEntityTier: 75,
    minEntityLevel: 750,
    statMultiplier: 200.0,
    requiredSRankTier: 'SSS',
    requiredSRankLevel: 1,
    bonusPerk: '+1000% all stats. Godlike abilities. Apotheosis Strike.',
  },
  // ★12 - Godlike - SSS-Rank (SSS6-SSS10) - MAXIMUM
  {
    stars: 12,
    displayName: '★★★★★★★★★★★★',
    shortName: '★12',
    rarity: 'godlike',
    minEntityTier: 90,
    minEntityLevel: 900,
    statMultiplier: 500.0,
    requiredSRankTier: 'SSS',
    requiredSRankLevel: 6,
    bonusPerk: '+2500% all stats. Divine God-Emperor status. Universal Dominion.',
  },
];

// ============================================================
// RARITY TO S-RANK MAPPING
// ============================================================

export const RARITY_SRANK_MAP: Record<RarityTier, { sRankTier: string; minLevel: number; maxLevel: number }> = {
  common:       { sRankTier: 'none', minLevel: 0, maxLevel: 0 },
  uncommon:     { sRankTier: 'none', minLevel: 0, maxLevel: 0 },
  rare:         { sRankTier: 'none', minLevel: 0, maxLevel: 0 },
  epic:         { sRankTier: 'none', minLevel: 0, maxLevel: 0 },
  legendary:    { sRankTier: 'S',    minLevel: 1,  maxLevel: 3  },
  mythic:       { sRankTier: 'S',    minLevel: 4,  maxLevel: 10 },
  transcendent: { sRankTier: 'SS',   minLevel: 1,  maxLevel: 10 },
  ascended:     { sRankTier: 'SS',   minLevel: 10, maxLevel: 10 },
  godlike:      { sRankTier: 'SSS',  minLevel: 1,  maxLevel: 10 },
};

// ============================================================
// STAR LEVEL UTILITY FUNCTIONS
// ============================================================

/**
 * Get the star level definition for a given star count
 */
export function getStarLevelDefinition(stars: StarLevel): StarLevelDefinition | null {
  return STAR_LEVEL_DEFINITIONS.find(s => s.stars === stars) || null;
}

/**
 * Get the rarity definition for a given rarity tier
 */
export function getRarityDefinition(rarity: RarityTier): RarityDefinition {
  return RARITY_DEFINITIONS[rarity];
}

/**
 * Calculate star level from entity tier and level
 */
export function calculateStarLevel(entityTier: number, entityLevel: number): StarLevel {
  let bestStars: StarLevel = 0;
  for (const def of STAR_LEVEL_DEFINITIONS) {
    if (entityTier >= def.minEntityTier && entityLevel >= def.minEntityLevel) {
      bestStars = def.stars;
    }
  }
  return bestStars;
}

/**
 * Calculate star level from S-rank tier and level + entity tier/level
 */
export function calculateStarLevelFromSRank(
  sRankTier: string,
  sRankLevel: number,
  entityTier: number,
  entityLevel: number
): StarLevel {
  let bestStars: StarLevel = 0;
  
  for (const def of STAR_LEVEL_DEFINITIONS) {
    // Check entity requirements
    const entityMet = entityTier >= def.minEntityTier && entityLevel >= def.minEntityLevel;
    
    // Check S-rank requirements
    let sRankMet = false;
    if (def.requiredSRankTier === 'none') {
      sRankMet = sRankTier === 'none';
    } else if (def.requiredSRankTier === 'S') {
      sRankMet = (sRankTier === 'S' && sRankLevel >= def.requiredSRankLevel) ||
                 (sRankTier === 'SS' || sRankTier === 'SSS'); // Higher ranks also qualify
    } else if (def.requiredSRankTier === 'SS') {
      sRankMet = (sRankTier === 'SS' && sRankLevel >= def.requiredSRankLevel) ||
                 (sRankTier === 'SSS');
    } else if (def.requiredSRankTier === 'SSS') {
      sRankMet = (sRankTier === 'SSS' && sRankLevel >= def.requiredSRankLevel);
    }
    
    if (entityMet && sRankMet) {
      bestStars = def.stars;
    }
  }
  
  return bestStars;
}

/**
 * Get the rarity tier for a given star level
 */
export function getRarityForStarLevel(stars: StarLevel): RarityTier {
  const def = getStarLevelDefinition(stars);
  return def ? def.rarity : 'common';
}

/**
 * Get the color for a given star level
 */
export function getColorForStarLevel(stars: StarLevel): string {
  const rarity = getRarityForStarLevel(stars);
  return RARITY_DEFINITIONS[rarity].color;
}

/**
 * Get the CSS gradient for a given star level
 */
export function getGradientForStarLevel(stars: StarLevel): string {
  const rarity = getRarityForStarLevel(stars);
  return RARITY_DEFINITIONS[rarity].gradient;
}

/**
 * Generate display string for stars (e.g., "★★★")
 */
export function getStarDisplay(stars: StarLevel): string {
  const def = getStarLevelDefinition(stars);
  return def ? def.displayName : '';
}

/**
 * Generate compact display (e.g., "★6")
 */
export function getStarShortDisplay(stars: StarLevel): string {
  const def = getStarLevelDefinition(stars);
  return def ? def.shortName : '';
}

/**
 * Generate full rank display combining stars + S-rank
 * e.g., "★★★★★★ [S3 Transcendent]" or "★★ [None]"
 */
export function getFullRankDisplay(
  stars: StarLevel,
  sRankTier: string,
  sRankLevel: number
): string {
  const starStr = getStarDisplay(stars);
  const sRankStr = sRankTier !== 'none' ? `${sRankTier}${sRankLevel}` : 'None';
  const rarity = getRarityForStarLevel(stars);
  const rarityName = RARITY_DEFINITIONS[rarity].name;
  return `${starStr} [${sRankStr} ${rarityName}]`;
}

/**
 * Get the stat multiplier for a given star level
 */
export function getStarStatMultiplier(stars: StarLevel): number {
  const def = getStarLevelDefinition(stars);
  return def ? def.statMultiplier : 1.0;
}

/**
 * Apply star level multiplier to a stat
 */
export function applyStarMultiplier(baseValue: number, stars: StarLevel): number {
  const multiplier = getStarStatMultiplier(stars);
  return Math.floor(baseValue * multiplier);
}

/**
 * Get the bonus perk description for a star level
 */
export function getStarBonusPerk(stars: StarLevel): string {
  const def = getStarLevelDefinition(stars);
  return def ? def.bonusPerk : 'No perks';
}

/**
 * Calculate the next star level requirements
 */
export function getNextStarLevel(stars: StarLevel): StarLevelDefinition | null {
  const nextStar = (stars + 1) as StarLevel;
  return getStarLevelDefinition(nextStar);
}

/**
 * Get all star levels for a specific rarity
 */
export function getStarLevelsByRarity(rarity: RarityTier): StarLevelDefinition[] {
  return STAR_LEVEL_DEFINITIONS.filter(s => s.rarity === rarity);
}

/**
 * Get all star levels for a specific S-rank tier
 */
export function getStarLevelsBySRankTier(sRankTier: string): StarLevelDefinition[] {
  return STAR_LEVEL_DEFINITIONS.filter(s => s.requiredSRankTier === sRankTier);
}

/**
 * Get star level progression from entity data
 */
export function getStarLevelProgression(
  entityTier: number,
  entityLevel: number,
  sRankTier: string,
  sRankLevel: number
): {
  currentStars: StarLevel;
  currentRarity: RarityTier;
  nextStars: StarLevelDefinition | null;
  progressPercent: number;
  display: string;
} {
  const currentStars = calculateStarLevelFromSRank(sRankTier, sRankLevel, entityTier, entityLevel);
  const currentRarity = getRarityForStarLevel(currentStars);
  const next = getNextStarLevel(currentStars);
  
  // Calculate progress to next star level
  let progressPercent = 0;
  if (next) {
    const tierProgress = entityTier >= next.minEntityTier ? 1 : entityTier / next.minEntityTier;
    const levelProgress = entityLevel >= next.minEntityLevel ? 1 : entityLevel / next.minEntityLevel;
    const sRankProgress = next.requiredSRankTier === 'none' ? 1 :
      (sRankTier === next.requiredSRankTier && sRankLevel >= next.requiredSRankLevel) ? 1 :
      sRankTier === 'none' ? 0 :
      sRankTier === next.requiredSRankTier ? sRankLevel / (next.requiredSRankLevel || 1) :
      // Higher rank qualifies
      (sRankTier === 'SS' && next.requiredSRankTier === 'S') ? 1 :
      (sRankTier === 'SSS' && (next.requiredSRankTier === 'S' || next.requiredSRankTier === 'SS')) ? 1 : 0;
    
    progressPercent = Math.min(100, Math.floor(((tierProgress + levelProgress + sRankProgress) / 3) * 100));
  } else {
    progressPercent = 100; // Max stars
  }
  
  return {
    currentStars,
    currentRarity,
    nextStars: next,
    progressPercent,
    display: getFullRankDisplay(currentStars, sRankTier, sRankLevel),
  };
}

/**
 * Get the ordered list of all rarity tiers
 */
export function getRarityOrder(): RarityTier[] {
  return ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'transcendent', 'ascended', 'godlike'];
}

/**
 * Get the numeric order of a rarity (1-9)
 */
export function getRarityOrderNumber(rarity: RarityTier): number {
  return RARITY_DEFINITIONS[rarity].order;
}

/**
 * Check if one rarity is higher than another
 */
export function isRarityHigherOrEqual(rarity1: RarityTier, rarity2: RarityTier): boolean {
  return RARITY_DEFINITIONS[rarity1].order >= RARITY_DEFINITIONS[rarity2].order;
}

// ============================================================
// STAR RARITY VISUAL EFFECTS
// ============================================================

export interface StarRarityVisualEffect {
  particleColor: string;
  particleCount: number;
  glowIntensity: number;
  starPulse: boolean;
  starRotation: boolean;
  rarityLabel: string;
  borderGlow: string;
  backgroundColor: string;
}

export function getStarRarityVisualEffects(stars: StarLevel): StarRarityVisualEffect {
  const rarity = getRarityForStarLevel(stars);
  const def = RARITY_DEFINITIONS[rarity];
  
  return {
    particleColor: def.starColor,
    particleCount: stars * 8,
    glowIntensity: 0.1 + (stars * 0.06),
    starPulse: stars >= 4,
    starRotation: stars >= 7,
    rarityLabel: def.name,
    borderGlow: def.glowColor,
    backgroundColor: def.backgroundColor,
  };
}

// ============================================================
// STAR RARITY API FOR INTEGRATION
// ============================================================

export interface StarRarityIntegration {
  calculateStars: (entityTier: number, entityLevel: number, sRankTier: string, sRankLevel: number) => StarLevel;
  getRarity: (stars: StarLevel) => RarityTier;
  getColor: (stars: StarLevel) => string;
  getMultiplier: (stars: StarLevel) => number;
  getDisplay: (stars: StarLevel) => string;
  getFullDisplay: (stars: StarLevel, sRankTier: string, sRankLevel: number) => string;
  getProgression: (entityTier: number, entityLevel: number, sRankTier: string, sRankLevel: number) => {
    currentStars: StarLevel;
    currentRarity: RarityTier;
    nextStars: StarLevelDefinition | null;
    progressPercent: number;
    display: string;
  };
  getVisualEffects: (stars: StarLevel) => StarRarityVisualEffect;
  applyMultiplier: (baseValue: number, stars: StarLevel) => number;
}

export function createStarRarityIntegration(): StarRarityIntegration {
  return {
    calculateStars: (tier, level, sTier, sLevel) => calculateStarLevelFromSRank(sTier, sLevel, tier, level),
    getRarity: (stars) => getRarityForStarLevel(stars),
    getColor: (stars) => getColorForStarLevel(stars),
    getMultiplier: (stars) => getStarStatMultiplier(stars),
    getDisplay: (stars) => getStarShortDisplay(stars),
    getFullDisplay: (stars, sTier, sLevel) => getFullRankDisplay(stars, sTier, sLevel),
    getProgression: (tier, level, sTier, sLevel) => getStarLevelProgression(tier, level, sTier, sLevel),
    getVisualEffects: (stars) => getStarRarityVisualEffects(stars),
    applyMultiplier: (value, stars) => applyStarMultiplier(value, stars),
  };
}

// ============================================================
// CSS GENERATION FOR STAR RARITY
// ============================================================

/**
 * Generate CSS for star rarity display
 */
export function generateStarRarityCSS(stars: StarLevel): string {
  const def = getStarLevelDefinition(stars);
  if (!def) return '';
  
  const rarity = RARITY_DEFINITIONS[def.rarity];
  const visual = getStarRarityVisualEffects(stars);
  
  return `
/* Star Level ${stars} - ${rarity.name} */
.star-level-${stars} {
  --star-color: ${rarity.starColor};
  --star-rarity-color: ${rarity.color};
  --star-rarity-gradient: ${rarity.gradient};
  --star-glow: ${rarity.glowColor};
  --star-text-shadow: ${rarity.textShadow};
  --star-border: ${rarity.borderColor};
  --star-bg: ${rarity.backgroundColor};
  --star-particle-color: ${visual.particleColor};
  --star-particle-count: ${visual.particleCount};
  --star-glow-intensity: ${visual.glowIntensity};
}`;
}

/**
 * Get all CSS variables for star rarity system
 */
export function getAllStarRarityCSS(): string {
  let css = '/* Star Rarity System CSS Variables */\n';
  for (const def of STAR_LEVEL_DEFINITIONS) {
    css += generateStarRarityCSS(def.stars) + '\n';
  }
  return css;
}

// Default export
export default {
  STAR_LEVEL_DEFINITIONS,
  RARITY_DEFINITIONS,
  getStarLevelDefinition,
  getRarityDefinition,
  calculateStarLevel,
  calculateStarLevelFromSRank,
  getStarDisplay,
  getFullRankDisplay,
};