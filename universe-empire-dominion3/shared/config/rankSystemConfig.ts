/**
 * S/SS/SSS Rank System - Transcendent Ranking for All Game Features
 * 
 * This system adds an S-rank progression layer on top of the existing
 * tier (1-99) and level (1-999) systems. S-ranks provide massive
 * multiplicative bonuses and unlock transcendent capabilities.
 * 
 * Rank Hierarchy:
 *   S  (S-Rank)    - 1st transcendence tier (10x base multiplier)
 *   SS (SS-Rank)   - 2nd transcendence tier (100x base multiplier)  
 *   SSS (SSS-Rank) - 3rd transcendence tier (1000x base multiplier)
 * 
 * Each S-rank has 10 sub-levels (S1-S10, SS1-SS10, SSS1-SSS10)
 * for granular progression within each rank.
 */

// ============================================================
// RANK DEFINITIONS
// ============================================================

export type SRankTier = 'none' | 'S' | 'SS' | 'SSS';
export type SRankLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface SRankInfo {
  tier: SRankTier;
  level: SRankLevel;
  displayName: string;
  multiplier: number;
  color: string;
  requiresTier: number;
  requiresLevel: number;
}

export interface SRankable {
  sRankTier: SRankTier;
  sRankLevel: SRankLevel;
  sRankProgress: number;
  sRankExperience: number;
  sRankMaxExperience: number;
}

// ============================================================
// RANK CONFIGURATION
// ============================================================

export const S_RANK_CONFIG = {
  MAX_S_RANK_TIER: 'SSS' as SRankTier,
  MAX_S_RANK_LEVEL: 10 as SRankLevel,

  UNLOCK_REQUIREMENTS: {
    S:   { tier: 10,  level: 100  },
    SS:  { tier: 30,  level: 300  },
    SSS: { tier: 60,  level: 600  },
  } as Record<Exclude<SRankTier, 'none'>, { tier: number; level: number }>,

  BASE_MULTIPLIERS: {
    S:   10,
    SS:  100,
    SSS: 1000,
  } as Record<Exclude<SRankTier, 'none'>, number>,

  LEVEL_MULTIPLIER_INCREMENT: 0.5,

  XP_BASE: 1000000,
  XP_MULTIPLIER: 2.0,
  XP_TIER_MULTIPLIER: {
    S:   1.0,
    SS:  5.0,
    SSS: 25.0,
  } as Record<Exclude<SRankTier, 'none'>, number>,

  COLORS: {
    S:   '#FFD700',
    SS:  '#C0C0C0',
    SSS: '#FF6B6B',
  } as Record<Exclude<SRankTier, 'none'>, string>,

  DISPLAY_NAMES: {
    S:   'S-Rank',
    SS:  'SS-Rank',
    SSS: 'SSS-Rank',
  } as Record<Exclude<SRankTier, 'none'>, string>,

  TITLE_SUFFIXES: {
    S:   'Transcendent',
    SS:  'Ascended',
    SSS: 'Godlike',
  } as Record<Exclude<SRankTier, 'none'>, string>,

  STAT_SCALING_PER_LEVEL: 0.25,

  SPECIAL_ABILITIES: {
    S: {
      name: 'Transcendence',
      description: 'All stats increased by 10x. Unlocks S-rank abilities.',
      effects: { damageMultiplier: 10, defenseMultiplier: 10, productionMultiplier: 10, researchMultiplier: 10, speedMultiplier: 5 },
    },
    SS: {
      name: 'Ascension',
      description: 'All stats increased by 100x. Unlocks SS-rank abilities.',
      effects: { damageMultiplier: 100, defenseMultiplier: 100, productionMultiplier: 100, researchMultiplier: 100, speedMultiplier: 25 },
    },
    SSS: {
      name: 'Apotheosis',
      description: 'All stats increased by 1000x. Unlocks SSS-rank abilities.',
      effects: { damageMultiplier: 1000, defenseMultiplier: 1000, productionMultiplier: 1000, researchMultiplier: 1000, speedMultiplier: 100 },
    },
  } as Record<Exclude<SRankTier, 'none'>, { name: string; description: string; effects: Record<string, number> }>,
} as const;

// ============================================================
// RANK DEFINITIONS - All 30 S-rank levels
// ============================================================

export const S_RANK_DEFINITIONS: SRankInfo[] = [
  { tier: 'S', level: 1, displayName: 'S1', multiplier: 10, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 2, displayName: 'S2', multiplier: 15, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 3, displayName: 'S3', multiplier: 22.5, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 4, displayName: 'S4', multiplier: 33.75, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 5, displayName: 'S5', multiplier: 50.63, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 6, displayName: 'S6', multiplier: 75.94, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 7, displayName: 'S7', multiplier: 113.9, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 8, displayName: 'S8', multiplier: 170.9, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 9, displayName: 'S9', multiplier: 256.3, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'S', level: 10, displayName: 'S10', multiplier: 384.4, color: '#FFD700', requiresTier: 10, requiresLevel: 100 },
  { tier: 'SS', level: 1, displayName: 'SS1', multiplier: 100, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 2, displayName: 'SS2', multiplier: 150, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 3, displayName: 'SS3', multiplier: 225, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 4, displayName: 'SS4', multiplier: 337.5, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 5, displayName: 'SS5', multiplier: 506.25, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 6, displayName: 'SS6', multiplier: 759.38, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 7, displayName: 'SS7', multiplier: 1139, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 8, displayName: 'SS8', multiplier: 1709, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 9, displayName: 'SS9', multiplier: 2563, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SS', level: 10, displayName: 'SS10', multiplier: 3844, color: '#C0C0C0', requiresTier: 30, requiresLevel: 300 },
  { tier: 'SSS', level: 1, displayName: 'SSS1', multiplier: 1000, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 2, displayName: 'SSS2', multiplier: 1500, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 3, displayName: 'SSS3', multiplier: 2250, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 4, displayName: 'SSS4', multiplier: 3375, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 5, displayName: 'SSS5', multiplier: 5062.5, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 6, displayName: 'SSS6', multiplier: 7593.75, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 7, displayName: 'SSS7', multiplier: 11390, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 8, displayName: 'SSS8', multiplier: 17085, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 9, displayName: 'SSS9', multiplier: 25628, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
  { tier: 'SSS', level: 10, displayName: 'SSS10', multiplier: 38442, color: '#FF6B6B', requiresTier: 60, requiresLevel: 600 },
];

// ============================================================
// RANK UTILITY FUNCTIONS
// ============================================================

export function getSRankInfo(sRankTier: SRankTier, sRankLevel: SRankLevel): SRankInfo | null {
  if (sRankTier === 'none' || sRankLevel === 0) return null;
  return S_RANK_DEFINITIONS.find(r => r.tier === sRankTier && r.level === sRankLevel) || null;
}

export function getSRankMultiplier(sRankTier: SRankTier, sRankLevel: SRankLevel): number {
  if (sRankTier === 'none' || sRankLevel === 0) return 1;
  const info = getSRankInfo(sRankTier, sRankLevel);
  return info ? info.multiplier : 1;
}

export function getQualifiedSRank(entityTier: number, entityLevel: number): { tier: SRankTier; level: SRankLevel } {
  const req = S_RANK_CONFIG.UNLOCK_REQUIREMENTS;
  if (entityTier >= req.SSS.tier && entityLevel >= req.SSS.level) return { tier: 'SSS', level: 1 };
  if (entityTier >= req.SS.tier && entityLevel >= req.SS.level) return { tier: 'SS', level: 1 };
  if (entityTier >= req.S.tier && entityLevel >= req.S.level) return { tier: 'S', level: 1 };
  return { tier: 'none', level: 0 };
}

export function getSRankXPRequired(currentTier: SRankTier, currentLevel: SRankLevel): number {
  if (currentTier === 'none') return S_RANK_CONFIG.XP_BASE;
  const tierMultiplier = S_RANK_CONFIG.XP_TIER_MULTIPLIER[currentTier as Exclude<SRankTier, 'none'>] || 1;
  const levelMultiplier = Math.pow(S_RANK_CONFIG.XP_MULTIPLIER, currentLevel);
  return Math.floor(S_RANK_CONFIG.XP_BASE * tierMultiplier * levelMultiplier);
}

export function calculateNextSRank(
  currentTier: SRankTier,
  currentLevel: SRankLevel,
  xpGained: number,
  currentXP: number = 0
): { tier: SRankTier; level: SRankLevel; xp: number; maxXP: number; leveledUp: boolean } {
  let newTier = currentTier;
  let newLevel = currentLevel;
  let newXP = currentXP + xpGained;
  let leveledUp = false;
  const maxLevel = S_RANK_CONFIG.MAX_S_RANK_LEVEL;
  while (true) {
    const required = getSRankXPRequired(newTier, newLevel);
    if (newXP >= required) {
      newXP -= required;
      leveledUp = true;
      if (newLevel < maxLevel) {
        newLevel = (newLevel + 1) as SRankLevel;
      } else {
        if (newTier === 'S') { newTier = 'SS'; newLevel = 1; }
        else if (newTier === 'SS') { newTier = 'SSS'; newLevel = 1; }
        else { newXP = 0; break; }
      }
    } else break;
  }
  const maxXP = getSRankXPRequired(newTier, newLevel);
  return { tier: newTier, level: newLevel, xp: newXP, maxXP, leveledUp };
}

export function getSRankDisplayName(sRankTier: SRankTier, sRankLevel: SRankLevel): string {
  if (sRankTier === 'none' || sRankLevel === 0) return '';
  return `${sRankTier}${sRankLevel}`;
}

export function getSRankTitle(sRankTier: SRankTier, sRankLevel: SRankLevel, entityName: string = ''): string {
  if (sRankTier === 'none' || sRankLevel === 0) return entityName;
  const suffix = S_RANK_CONFIG.TITLE_SUFFIXES[sRankTier as Exclude<SRankTier, 'none'>];
  const rankDisplay = getSRankDisplayName(sRankTier, sRankLevel);
  return entityName ? `${rankDisplay} ${suffix} ${entityName}` : `${rankDisplay} ${suffix}`;
}

export function getSRankColor(sRankTier: SRankTier): string {
  if (sRankTier === 'none') return '#FFFFFF';
  return S_RANK_CONFIG.COLORS[sRankTier as Exclude<SRankTier, 'none'>] || '#FFFFFF';
}

export function getSRankAbilities(sRankTier: SRankTier) {
  if (sRankTier === 'none') return null;
  return S_RANK_CONFIG.SPECIAL_ABILITIES[sRankTier as Exclude<SRankTier, 'none'>] || null;
}

export function applySRankMultiplier(baseValue: number, sRankTier: SRankTier, sRankLevel: SRankLevel): number {
  const multiplier = getSRankMultiplier(sRankTier, sRankLevel);
  return Math.floor(baseValue * multiplier);
}

export function applySRankStatScaling(baseValue: number, sRankTier: SRankTier, sRankLevel: SRankLevel): number {
  if (sRankTier === 'none' || sRankLevel === 0) return baseValue;
  const tierMultiplier = S_RANK_CONFIG.BASE_MULTIPLIERS[sRankTier as Exclude<SRankTier, 'none'>];
  const levelBonus = 1 + (sRankLevel - 1) * S_RANK_CONFIG.STAT_SCALING_PER_LEVEL;
  return Math.floor(baseValue * tierMultiplier * levelBonus);
}

export function createDefaultSRankable(): SRankable {
  return { sRankTier: 'none', sRankLevel: 0, sRankProgress: 0, sRankExperience: 0, sRankMaxExperience: S_RANK_CONFIG.XP_BASE };
}

export function canUnlockSRank(entityTier: number, entityLevel: number, targetTier: Exclude<SRankTier, 'none'>): boolean {
  const req = S_RANK_CONFIG.UNLOCK_REQUIREMENTS[targetTier];
  return entityTier >= req.tier && entityLevel >= req.level;
}

export function getSRankDefinitionsForTier(tier: SRankTier): SRankInfo[] {
  return S_RANK_DEFINITIONS.filter(r => r.tier === tier);
}

export function getNextSRankLevel(currentTier: SRankTier, currentLevel: SRankLevel): SRankInfo | null {
  if (currentTier === 'none') return S_RANK_DEFINITIONS[0];
  if (currentLevel < S_RANK_CONFIG.MAX_S_RANK_LEVEL) return getSRankInfo(currentTier, (currentLevel + 1) as SRankLevel);
  const nextTier = currentTier === 'S' ? 'SS' as const : currentTier === 'SS' ? 'SSS' as const : null;
  if (nextTier) return getSRankInfo(nextTier, 1);
  return null;
}

export function getSRankProgress(currentXP: number, requiredXP: number): number {
  if (requiredXP <= 0) return 100;
  return Math.min(100, Math.floor((currentXP / requiredXP) * 100));
}

// ============================================================
// ENTITY-SPECIFIC S-RANK BONUSES
// ============================================================

export interface SRankEntityBonuses {
  damageMultiplier: number;
  defenseMultiplier: number;
  healthMultiplier: number;
  shieldMultiplier: number;
  speedMultiplier: number;
  productionMultiplier: number;
  resourceMultiplier: number;
  tradeMultiplier: number;
  researchSpeedMultiplier: number;
  researchCostReduction: number;
  buildSpeedMultiplier: number;
  buildCostReduction: number;
  criticalChanceBonus: number;
  criticalDamageBonus: number;
  evasionBonus: number;
  accuracyBonus: number;
  lootMultiplier: number;
  experienceMultiplier: number;
}

export function calculateSRankBonuses(sRankTier: SRankTier, sRankLevel: SRankLevel): SRankEntityBonuses {
  const multiplier = getSRankMultiplier(sRankTier, sRankLevel);
  return {
    damageMultiplier: multiplier,
    defenseMultiplier: multiplier,
    healthMultiplier: multiplier,
    shieldMultiplier: multiplier,
    speedMultiplier: Math.max(1, Math.sqrt(multiplier)),
    productionMultiplier: multiplier,
    resourceMultiplier: multiplier,
    tradeMultiplier: multiplier,
    researchSpeedMultiplier: multiplier,
    researchCostReduction: Math.min(0.9, 1 - (1 / multiplier)),
    buildSpeedMultiplier: multiplier,
    buildCostReduction: Math.min(0.9, 1 - (1 / multiplier)),
    criticalChanceBonus: Math.min(50, sRankLevel * 5),
    criticalDamageBonus: Math.min(500, sRankLevel * 50),
    evasionBonus: Math.min(75, sRankLevel * 7.5),
    accuracyBonus: Math.min(100, sRankLevel * 10),
    lootMultiplier: multiplier,
    experienceMultiplier: multiplier,
  };
}

// ============================================================
// S-RANK COMBAT INTEGRATION
// ============================================================

export interface SRankCombatEffects {
  transcendenceStrike: { chance: number; damageMultiplier: number; description: string };
  rankSuppression: { damageReduction: number; description: string };
  rankAura: { allyBuff: number; enemyDebuff: number; radius: string; description: string };
}

const EMPTY_COMBAT_EFFECTS: SRankCombatEffects = {
  transcendenceStrike: { chance: 0, damageMultiplier: 1, description: 'No transcendence' },
  rankSuppression: { damageReduction: 0, description: 'No rank suppression' },
  rankAura: { allyBuff: 0, enemyDebuff: 0, radius: 'None', description: 'No aura' },
};

const S_COMBAT_EFFECTS = (level: SRankLevel): SRankCombatEffects => ({
  transcendenceStrike: { chance: Math.min(30, level * 2), damageMultiplier: getSRankMultiplier('S', level), description: `S-Rank Transcendence Strike: ${Math.min(30, level * 2)}% chance for ${getSRankMultiplier('S', level)}x damage` },
  rankSuppression: { damageReduction: Math.min(0.5, 0.1 + level * 0.04), description: `S-Rank Suppression: Reduces damage from lower-rank enemies by ${Math.min(50, 10 + level * 4)}%` },
  rankAura: { allyBuff: 1 + (level * 0.1), enemyDebuff: 1 - (level * 0.05), radius: 'Sector', description: `S-Rank Aura: Allies +${level * 10}% stats, Enemies -${level * 5}% stats` },
});

const SS_COMBAT_EFFECTS = (level: SRankLevel): SRankCombatEffects => ({
  transcendenceStrike: { chance: Math.min(50, level * 2), damageMultiplier: getSRankMultiplier('SS', level), description: `SS-Rank Transcendence Strike: ${Math.min(50, level * 2)}% chance for ${getSRankMultiplier('SS', level)}x damage` },
  rankSuppression: { damageReduction: Math.min(0.75, 0.2 + level * 0.05), description: `SS-Rank Suppression: Reduces damage from lower-rank enemies by ${Math.min(75, 20 + level * 5)}%` },
  rankAura: { allyBuff: 1 + (level * 0.2), enemyDebuff: 1 - (level * 0.08), radius: 'System', description: `SS-Rank Aura: Allies +${level * 20}% stats, Enemies -${level * 8}% stats` },
});

const SSS_COMBAT_EFFECTS = (level: SRankLevel): SRankCombatEffects => ({
  transcendenceStrike: { chance: Math.min(75, level * 2), damageMultiplier: getSRankMultiplier('SSS', level), description: `SSS-Rank Transcendence Strike: ${Math.min(75, level * 2)}% chance for ${getSRankMultiplier('SSS', level)}x damage` },
  rankSuppression: { damageReduction: Math.min(0.95, 0.3 + level * 0.06), description: `SSS-Rank Suppression: Reduces damage from lower-rank enemies by ${Math.min(95, 30 + level * 6)}%` },
  rankAura: { allyBuff: 1 + (level * 0.35), enemyDebuff: 1 - (level * 0.12), radius: 'Galaxy', description: `SSS-Rank Aura: Allies +${level * 35}% stats, Enemies -${level * 12}% stats` },
});

export function getSRankCombatEffects(sRankTier: SRankTier, sRankLevel: SRankLevel): SRankCombatEffects {
  if (sRankTier === 'none' || sRankLevel === 0) return EMPTY_COMBAT_EFFECTS;
  if (sRankTier === 'S') return S_COMBAT_EFFECTS(sRankLevel);
  if (sRankTier === 'SS') return SS_COMBAT_EFFECTS(sRankLevel);
  return SSS_COMBAT_EFFECTS(sRankLevel);
}

// ============================================================
// S-RANK VISUAL EFFECTS
// ============================================================

export interface SRankVisualEffect {
  particleColor: string;
  particleCount: number;
  glowIntensity: number;
  auraEffect: string;
  titleColor: string;
  borderEffect: string;
  animationSpeed: number;
}

export function getSRankVisualEffects(sRankTier: SRankTier, sRankLevel: SRankLevel): SRankVisualEffect {
  const base: Record<string, SRankVisualEffect> = {
    none: { particleColor: '#FFFFFF', particleCount: 0, glowIntensity: 0, auraEffect: 'None', titleColor: '#FFFFFF', borderEffect: 'None', animationSpeed: 0 },
    S: { particleColor: '#FFD700', particleCount: 10 + sRankLevel * 2, glowIntensity: 0.3 + sRankLevel * 0.05, auraEffect: 'Golden Aura', titleColor: '#FFD700', borderEffect: 'Gold Border', animationSpeed: 1.0 },
    SS: { particleColor: '#C0C0C0', particleCount: 20 + sRankLevel * 3, glowIntensity: 0.5 + sRankLevel * 0.05, auraEffect: 'Silver Radiance', titleColor: '#C0C0C0', borderEffect: 'Silver Border', animationSpeed: 1.5 },
    SSS: { particleColor: '#FF6B6B', particleCount: 35 + sRankLevel * 5, glowIntensity: 0.7 + sRankLevel * 0.05, auraEffect: 'Crimson Inferno', titleColor: '#FF6B6B', borderEffect: 'Crimson Flame Border', animationSpeed: 2.0 },
  };
  return base[sRankTier] || base.none;
}

// ============================================================
// S-RANK ACHIEVEMENTS & MILESTONES
// ============================================================

export const S_RANK_ACHIEVEMENTS = {
  firstTranscendence: { id: 's_rank_first', name: 'First Transcendence', description: 'Reach S-Rank for the first time', requirement: { tier: 'S' as SRankTier, level: 1 as SRankLevel }, reward: { title: 'The Transcendent', multiplierBonus: 1.5 } },
  masterTranscendence: { id: 's_rank_master', name: 'Master of S-Rank', description: 'Reach S10 in any entity', requirement: { tier: 'S' as SRankTier, level: 10 as SRankLevel }, reward: { title: 'S-Rank Master', multiplierBonus: 2.0 } },
  firstAscension: { id: 'ss_rank_first', name: 'First Ascension', description: 'Reach SS-Rank for the first time', requirement: { tier: 'SS' as SRankTier, level: 1 as SRankLevel }, reward: { title: 'The Ascended', multiplierBonus: 5.0 } },
  masterAscension: { id: 'ss_rank_master', name: 'Master of SS-Rank', description: 'Reach SS10 in any entity', requirement: { tier: 'SS' as SRankTier, level: 10 as SRankLevel }, reward: { title: 'SS-Rank Master', multiplierBonus: 10.0 } },
  firstApotheosis: { id: 'sss_rank_first', name: 'First Apotheosis', description: 'Reach SSS-Rank for the first time', requirement: { tier: 'SSS' as SRankTier, level: 1 as SRankLevel }, reward: { title: 'The Godlike', multiplierBonus: 25.0 } },
  masterApotheosis: { id: 'sss_rank_master', name: 'Master of SSS-Rank', description: 'Reach SSS10 in any entity', requirement: { tier: 'SSS' as SRankTier, level: 10 as SRankLevel }, reward: { title: 'SSS-Rank Master', multiplierBonus: 100.0 } },
  universalTranscendence: { id: 'universal_transcendence', name: 'Universal Transcendence', description: 'Have all entity types at S-Rank or higher', requirement: { tier: 'S' as SRankTier, level: 1 as SRankLevel }, reward: { title: 'Universal Transcendent', multiplierBonus: 10.0 } },
  cosmicAscension: { id: 'cosmic_ascension', name: 'Cosmic Ascension', description: 'Have all entity types at SS-Rank or higher', requirement: { tier: 'SS' as SRankTier, level: 1 as SRankLevel }, reward: { title: 'Cosmic Ascendant', multiplierBonus: 50.0 } },
  divineApotheosis: { id: 'divine_apotheosis', name: 'Divine Apotheosis', description: 'Have all entity types at SSS-Rank', requirement: { tier: 'SSS' as SRankTier, level: 1 as SRankLevel }, reward: { title: 'Divine God-Emperor', multiplierBonus: 500.0 } },
};

// ============================================================
// S-RANK INTEGRATION WITH EXISTING SYSTEMS
// ============================================================

export function applySRankToCombat(
  baseDamage: number, baseDefense: number,
  attackerSRank: SRankTier, attackerSRankLevel: SRankLevel,
  defenderSRank: SRankTier, defenderSRankLevel: SRankLevel
): { damage: number; defense: number; rankAdvantage: number } {
  const attackerBonuses = calculateSRankBonuses(attackerSRank, attackerSRankLevel);
  const defenderBonuses = calculateSRankBonuses(defenderSRank, defenderSRankLevel);
  const rankOrder: SRankTier[] = ['none', 'S', 'SS', 'SSS'];
  const rankDifference = rankOrder.indexOf(attackerSRank) - rankOrder.indexOf(defenderSRank);
  const rankAdvantage = rankDifference > 0 ? 1 + (rankDifference * 0.5) : rankDifference < 0 ? 1 / (1 + Math.abs(rankDifference) * 0.5) : 1;
  return {
    damage: Math.floor(baseDamage * attackerBonuses.damageMultiplier * rankAdvantage),
    defense: Math.floor(baseDefense * defenderBonuses.defenseMultiplier),
    rankAdvantage,
  };
}

export function applySRankToProduction(baseProduction: number, sRankTier: SRankTier, sRankLevel: SRankLevel): number {
  const bonuses = calculateSRankBonuses(sRankTier, sRankLevel);
  return Math.floor(baseProduction * bonuses.productionMultiplier);
}

export function applySRankToResearch(baseResearchSpeed: number, baseResearchCost: number, sRankTier: SRankTier, sRankLevel: SRankLevel): { speed: number; cost: number } {
  const bonuses = calculateSRankBonuses(sRankTier, sRankLevel);
  return { speed: Math.floor(baseResearchSpeed * bonuses.researchSpeedMultiplier), cost: Math.floor(baseResearchCost * (1 - bonuses.researchCostReduction)) };
}

export function applySRankToBuilding(baseBuildSpeed: number, baseBuildCost: number, sRankTier: SRankTier, sRankLevel: SRankLevel): { speed: number; cost: number } {
  const bonuses = calculateSRankBonuses(sRankTier, sRankLevel);
  return { speed: Math.floor(baseBuildSpeed * bonuses.buildSpeedMultiplier), cost: Math.floor(baseBuildCost * (1 - bonuses.buildCostReduction)) };
}

export function applySRankToRewards(baseLoot: number, baseXP: number, sRankTier: SRankTier, sRankLevel: SRankLevel): { loot: number; xp: number } {
  const bonuses = calculateSRankBonuses(sRankTier, sRankLevel);
  return { loot: Math.floor(baseLoot * bonuses.lootMultiplier), xp: Math.floor(baseXP * bonuses.experienceMultiplier) };
}

// ============================================================
// S-RANK ENTITY STATE MANAGER
// ============================================================

export class SRankManager {
  static initialize(): SRankable { return createDefaultSRankable(); }

  static checkRankUp(entity: SRankable, entityTier: number, entityLevel: number): { rankChanged: boolean; newRank: SRankTier; newLevel: SRankLevel } {
    const qualified = getQualifiedSRank(entityTier, entityLevel);
    if (qualified.tier === 'none') return { rankChanged: false, newRank: entity.sRankTier, newLevel: entity.sRankLevel };
    const rankOrder: SRankTier[] = ['none', 'S', 'SS', 'SSS'];
    if (rankOrder.indexOf(entity.sRankTier) >= rankOrder.indexOf(qualified.tier) && entity.sRankLevel > 0) return { rankChanged: false, newRank: entity.sRankTier, newLevel: entity.sRankLevel };
    return { rankChanged: true, newRank: qualified.tier, newLevel: qualified.level };
  }

  static addExperience(entity: SRankable, xpAmount: number): { entity: SRankable; leveledUp: boolean; newRank: SRankTier; newLevel: SRankLevel } {
    const result = calculateNextSRank(entity.sRankTier, entity.sRankLevel, xpAmount, entity.sRankExperience);
    return {
      entity: { ...entity, sRankTier: result.tier, sRankLevel: result.level, sRankExperience: result.xp, sRankMaxExperience: result.maxXP, sRankProgress: getSRankProgress(result.xp, result.maxXP) },
      leveledUp: result.leveledUp, newRank: result.tier, newLevel: result.level,
    };
  }

  static getProgressionDisplay(entity: SRankable): string {
    return `${getSRankDisplayName(entity.sRankTier, entity.sRankLevel)} [${entity.sRankProgress}%]`;
  }

  static getSummary(entity: SRankable): { rank: string; level: number; multiplier: number; progress: number; nextRank: string | null } {
    const next = getNextSRankLevel(entity.sRankTier, entity.sRankLevel);
    return { rank: getSRankDisplayName(entity.sRankTier, entity.sRankLevel) || 'None', level: entity.sRankLevel, multiplier: getSRankMultiplier(entity.sRankTier, entity.sRankLevel), progress: entity.sRankProgress, nextRank: next ? next.displayName : 'MAX' };
  }
}

// ============================================================
// S-RANK INTEGRATION POINTS FOR ALL GAME SYSTEMS
// ============================================================

export interface SRankSystemIntegration {
  combatDamageMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  combatDefenseMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  combatHealthMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  combatShieldMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  combatSpeedMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  productionMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  resourceMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  tradeMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  researchSpeedMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  researchCostReduction: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  buildSpeedMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  buildCostReduction: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  unitTrainingSpeedMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  unitMaintenanceReduction: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  fleetSpeedMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  fleetCargoMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  commanderSkillMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  commanderTalentMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  megastructureEfficiencyMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  megastructureBuildSpeedMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  allianceBonusMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  expeditionRewardMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  expeditionSuccessRateBonus: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  pvpRatingMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
  pvpRewardMultiplier: (sRankTier: SRankTier, sRankLevel: SRankLevel) => number;
}

export function createSRankSystemIntegration(): SRankSystemIntegration {
  const m = (t: SRankTier, l: SRankLevel) => getSRankMultiplier(t, l);
  const sqrt = (t: SRankTier, l: SRankLevel) => Math.max(1, Math.sqrt(m(t, l)));
  const red = (t: SRankTier, l: SRankLevel) => Math.min(0.9, 1 - (1 / Math.max(1, m(t, l))));
  return {
    combatDamageMultiplier: m, combatDefenseMultiplier: m, combatHealthMultiplier: m, combatShieldMultiplier: m, combatSpeedMultiplier: sqrt,
    productionMultiplier: m, resourceMultiplier: m, tradeMultiplier: m,
    researchSpeedMultiplier: m, researchCostReduction: red,
    buildSpeedMultiplier: m, buildCostReduction: red,
    unitTrainingSpeedMultiplier: m, unitMaintenanceReduction: red,
    fleetSpeedMultiplier: sqrt, fleetCargoMultiplier: m,
    commanderSkillMultiplier: m, commanderTalentMultiplier: m,
    megastructureEfficiencyMultiplier: m, megastructureBuildSpeedMultiplier: m,
    allianceBonusMultiplier: m,
    expeditionRewardMultiplier: m, expeditionSuccessRateBonus: (t, l) => Math.min(50, l * 3),
    pvpRatingMultiplier: m, pvpRewardMultiplier: m,
  };
}