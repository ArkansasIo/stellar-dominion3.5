/**
 * EQUIPMENT TEMPERING & MASTERWORKING STATION
 * ============================================================================
 * Full tempering and masterworking system for equipment enhancement.
 *
 * Systems:
 *   1. Tempering Tiers (Basic → Advanced → Elite → Legendary → Mythic)
 *   2. Stat Locking (lock sub-stats to preserve during rerolls)
 *   3. Tempering Recipes (material-based with success rates)
 *   4. Masterworking Progression (+1 → +10 with tier bonuses)
 *   5. Tempering Station Levels (unlock higher tiers)
 *   6. Tempering Currencies (credits, materials, tempering tokens)
 *   7. Tempering History & Stats
 *   8. Equipment Reforging (reset and re-enhance)
 *   9. Tempering Synergies (bonus for full-masterwork sets)
 *  10. Tempering Achievements
 */

// ============================================================================
// STAT TYPES
// ============================================================================

export type EquipmentSlot =
  | 'primaryWeapon' | 'secondaryWeapon' | 'armorCore'
  | 'shieldModule' | 'engineCore' | 'commandModule'
  | 'utilityBay' | 'sensorArray' | 'capacitorBank' | 'reactorCore';

export type StatRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface SubStat {
  id: string;
  name: string;
  statType: string;
  value: number;
  isPercent: boolean;
  rarity: StatRarity;
  rollQuality: number;
  isLocked: boolean;
  lockedAtTier?: TemperingTier;
}

export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  level: number;
  rarity: StatRarity;
  baseStats: { statType: string; value: number; isPercent: boolean }[];
  subStats: SubStat[];
  masterworkTier: number;
  temperCount: number;
  isMasterworked: boolean;
  setId?: string;
  unique?: boolean;
  enchants?: string[];
  temperTier: TemperingTier;
  totalTemperValue: number;
}

// ============================================================================
// TEMPERING TIERS
// ============================================================================

export type TemperingTier = 'untouched' | 'basic' | 'advanced' | 'elite' | 'legendary' | 'mythic';

export interface TemperingTierConfig {
  id: TemperingTier;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredSmithyLevel: number;
  maxSubStats: number;
  rollQualityFloor: number;
  maxLocks: number;
  successRate: number;
  statBoostPercent: number;
  materials: { material: string; amount: number }[];
}

export const TEMPERING_TIERS: Record<TemperingTier, TemperingTierConfig> = {
  untouched: {
    id: 'untouched', name: 'Untouched', description: 'Raw, unprocessed equipment.', icon: '⬜',
    color: '#6b7280', requiredSmithyLevel: 1, maxSubStats: 2, rollQualityFloor: 0.0, maxLocks: 0,
    successRate: 1.0, statBoostPercent: 0, materials: [],
  },
  basic: {
    id: 'basic', name: 'Basic Tempered', description: 'First stage of tempering. Unlocks sub-stat rerolling.', icon: '🟩',
    color: '#22c55e', requiredSmithyLevel: 1, maxSubStats: 3, rollQualityFloor: 0.1, maxLocks: 0,
    successRate: 1.0, statBoostPercent: 5, materials: [{ material: 'titanium_alloy', amount: 10 }, { material: 'crystal_matrix', amount: 5 }],
  },
  advanced: {
    id: 'advanced', name: 'Advanced Tempered', description: 'Refined tempering. Higher stat rolls and 1 lock slot.', icon: '🟦',
    color: '#3b82f6', requiredSmithyLevel: 3, maxSubStats: 3, rollQualityFloor: 0.2, maxLocks: 1,
    successRate: 0.95, statBoostPercent: 10, materials: [{ material: 'titanium_alloy', amount: 25 }, { material: 'crystal_matrix', amount: 15 }, { material: 'plasma_core', amount: 5 }],
  },
  elite: {
    id: 'elite', name: 'Elite Tempered', description: 'Superior tempering. 2 lock slots and higher quality.', icon: '🟪',
    color: '#a855f7', requiredSmithyLevel: 5, maxSubStats: 4, rollQualityFloor: 0.35, maxLocks: 2,
    successRate: 0.85, statBoostPercent: 15, materials: [{ material: 'titanium_alloy', amount: 50 }, { material: 'crystal_matrix', amount: 30 }, { material: 'dark_matter', amount: 5 }, { material: 'neutronium_plate', amount: 10 }],
  },
  legendary: {
    id: 'legendary', name: 'Legendary Tempered', description: 'Master tempering. 3 lock slots, guaranteed rare+.', icon: '🟧',
    color: '#f59e0b', requiredSmithyLevel: 7, maxSubStats: 4, rollQualityFloor: 0.5, maxLocks: 3,
    successRate: 0.7, statBoostPercent: 20, materials: [{ material: 'titanium_alloy', amount: 100 }, { material: 'crystal_matrix', amount: 60 }, { material: 'dark_matter', amount: 15 }, { material: 'void_crystal', amount: 5 }],
  },
  mythic: {
    id: 'mythic', name: 'Mythic Tempered', description: 'Supreme tempering. 4 lock slots, guaranteed epic+.', icon: '🟥',
    color: '#ef4444', requiredSmithyLevel: 10, maxSubStats: 5, rollQualityFloor: 0.7, maxLocks: 4,
    successRate: 0.5, statBoostPercent: 30, materials: [{ material: 'titanium_alloy', amount: 200 }, { material: 'crystal_matrix', amount: 100 }, { material: 'dark_matter', amount: 30 }, { material: 'void_crystal', amount: 15 }, { material: 'stellar_essence', amount: 10 }],
  },
};

export const TEMPERING_TIER_ORDER: TemperingTier[] = ['untouched', 'basic', 'advanced', 'elite', 'legendary', 'mythic'];

// ============================================================================
// STAT POOLS (possible sub-stats by slot)
// ============================================================================

export const STAT_POOLS: Record<EquipmentSlot, { statType: string; name: string; min: number; max: number; isPercent: boolean }[]> = {
  primaryWeapon: [
    { statType: 'weaponDamage', name: 'Weapon Damage', min: 5, max: 50, isPercent: true },
    { statType: 'weaponSpeed', name: 'Fire Rate', min: 3, max: 30, isPercent: true },
    { statType: 'weaponCritChance', name: 'Crit Chance', min: 2, max: 20, isPercent: true },
    { statType: 'weaponCritDamage', name: 'Crit Damage', min: 5, max: 40, isPercent: true },
    { statType: 'energyWeapons', name: 'Energy Damage', min: 5, max: 35, isPercent: true },
    { statType: 'kineticWeapons', name: 'Kinetic Damage', min: 5, max: 35, isPercent: true },
    { statType: 'weaponRange', name: 'Weapon Range', min: 3, max: 25, isPercent: true },
  ],
  secondaryWeapon: [
    { statType: 'weaponDamage', name: 'Weapon Damage', min: 3, max: 35, isPercent: true },
    { statType: 'explosiveWeapons', name: 'Explosive Damage', min: 5, max: 30, isPercent: true },
    { statType: 'beamWeapons', name: 'Beam Damage', min: 5, max: 30, isPercent: true },
    { statType: 'weaponCritChance', name: 'Crit Chance', min: 2, max: 15, isPercent: true },
    { statType: 'weaponSpeed', name: 'Fire Rate', min: 3, max: 25, isPercent: true },
  ],
  armorCore: [
    { statType: 'armorValue', name: 'Armor Value', min: 5, max: 50, isPercent: true },
    { statType: 'hullHp', name: 'Hull HP', min: 3, max: 30, isPercent: true },
    { statType: 'damageReduction', name: 'Damage Reduction', min: 2, max: 15, isPercent: true },
    { statType: 'healthRegen', name: 'Health Regen', min: 2, max: 20, isPercent: true },
    { statType: 'capacitorCapacity', name: 'Capacitor', min: 3, max: 20, isPercent: true },
  ],
  shieldModule: [
    { statType: 'shieldHp', name: 'Shield HP', min: 5, max: 50, isPercent: true },
    { statType: 'shieldRecharge', name: 'Shield Recharge', min: 3, max: 30, isPercent: true },
    { statType: 'capacitorCapacity', name: 'Capacitor', min: 3, max: 25, isPercent: true },
    { statType: 'capacitorRecharge', name: 'Cap Recharge', min: 3, max: 25, isPercent: true },
    { statType: 'damageReduction', name: 'Damage Reduction', min: 2, max: 12, isPercent: true },
  ],
  engineCore: [
    { statType: 'flightVelocity', name: 'Flight Speed', min: 5, max: 40, isPercent: true },
    { statType: 'warpSpeed', name: 'Warp Speed', min: 3, max: 30, isPercent: true },
    { statType: 'agility', name: 'Agility', min: 3, max: 25, isPercent: true },
    { statType: 'avoidance', name: 'Avoidance', min: 2, max: 20, isPercent: true },
    { statType: 'signatureRadius', name: 'Signature Reduction', min: 3, max: 25, isPercent: true },
  ],
  commandModule: [
    { statType: 'crewEfficiency', name: 'Crew Efficiency', min: 5, max: 40, isPercent: true },
    { statType: 'fleetCommandRange', name: 'Command Range', min: 3, max: 25, isPercent: true },
    { statType: 'electronicWarfare', name: 'EW Strength', min: 3, max: 25, isPercent: true },
    { statType: 'targetingSpeed', name: 'Targeting Speed', min: 3, max: 20, isPercent: true },
    { statType: 'crowdControl', name: 'Crowd Control', min: 2, max: 15, isPercent: true },
  ],
  utilityBay: [
    { statType: 'miningYield', name: 'Mining Yield', min: 5, max: 35, isPercent: true },
    { statType: 'processingSpeed', name: 'Processing', min: 3, max: 25, isPercent: true },
    { statType: 'cargoCapacity', name: 'Cargo', min: 5, max: 40, isPercent: true },
    { statType: 'repairAmount', name: 'Repair Amount', min: 3, max: 25, isPercent: true },
    { statType: 'logisticsBandwidth', name: 'Logistics', min: 3, max: 20, isPercent: true },
  ],
  sensorArray: [
    { statType: 'sensorStrength', name: 'Sensor Strength', min: 5, max: 40, isPercent: true },
    { statType: 'scanResolution', name: 'Scan Resolution', min: 3, max: 30, isPercent: true },
    { statType: 'targetingSpeed', name: 'Targeting Speed', min: 3, max: 25, isPercent: true },
    { statType: 'electronicWarfare', name: 'EW Strength', min: 3, max: 25, isPercent: true },
    { statType: 'avoidance', name: 'Avoidance', min: 2, max: 20, isPercent: true },
  ],
  capacitorBank: [
    { statType: 'capacitorCapacity', name: 'Capacitor', min: 8, max: 60, isPercent: true },
    { statType: 'capacitorRecharge', name: 'Cap Recharge', min: 5, max: 40, isPercent: true },
    { statType: 'shieldRecharge', name: 'Shield Recharge', min: 3, max: 25, isPercent: true },
    { statType: 'energyWeapons', name: 'Energy Damage', min: 3, max: 20, isPercent: true },
  ],
  reactorCore: [
    { statType: 'modulePowergrid', name: 'Powergrid', min: 5, max: 40, isPercent: true },
    { statType: 'moduleCpu', name: 'CPU', min: 5, max: 40, isPercent: true },
    { statType: 'buildSpeedBonus', name: 'Build Speed', min: 3, max: 25, isPercent: true },
    { statType: 'researchSpeed', name: 'Research Speed', min: 3, max: 20, isPercent: true },
    { statType: 'xpBonus', name: 'XP Bonus', min: 2, max: 15, isPercent: true },
  ],
};

// ============================================================================
// RARITY CONFIGURATION
// ============================================================================

export const RARITY_CONFIG: Record<StatRarity, {
  color: string;
  maxSubStats: number;
  temperCostMultiplier: number;
  masterworkBonus: number;
  rollQualityFloor: number;
  subStatCount: [number, number];
  displayName: string;
  powerScoreMultiplier: number;
}> = {
  common:    { color: '#9ca3af', maxSubStats: 2, temperCostMultiplier: 1,   masterworkBonus: 1,   rollQualityFloor: 0.0, subStatCount: [1, 2], displayName: 'Common',    powerScoreMultiplier: 1 },
  uncommon:  { color: '#22c55e', maxSubStats: 3, temperCostMultiplier: 1.5, masterworkBonus: 2,   rollQualityFloor: 0.2, subStatCount: [2, 3], displayName: 'Uncommon',  powerScoreMultiplier: 2 },
  rare:      { color: '#3b82f6', maxSubStats: 3, temperCostMultiplier: 2,   masterworkBonus: 3,   rollQualityFloor: 0.3, subStatCount: [2, 3], displayName: 'Rare',      powerScoreMultiplier: 4 },
  epic:      { color: '#a855f7', maxSubStats: 4, temperCostMultiplier: 3,   masterworkBonus: 4,   rollQualityFloor: 0.4, subStatCount: [3, 4], displayName: 'Epic',      powerScoreMultiplier: 8 },
  legendary: { color: '#f59e0b', maxSubStats: 4, temperCostMultiplier: 5,   masterworkBonus: 5,   rollQualityFloor: 0.5, subStatCount: [3, 4], displayName: 'Legendary', powerScoreMultiplier: 16 },
  mythic:    { color: '#ef4444', maxSubStats: 5, temperCostMultiplier: 8,   masterworkBonus: 8,   rollQualityFloor: 0.6, subStatCount: [4, 5], displayName: 'Mythic',    powerScoreMultiplier: 32 },
};

// ============================================================================
// TEMPERING RECIPES
// ============================================================================

export interface TemperRecipe {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetTier: TemperingTier;
  materials: { material: string; amount: number }[];
  creditsCost: number;
  successRateBonus: number;
  guaranteedMinRarity?: StatRarity;
  extraSubStatChance: number;
}

export const TEMPER_RECIPES: TemperRecipe[] = [
  {
    id: 'recipe_basic_heat', name: 'Basic Heat Treatment', description: 'Apply controlled heat to strengthen the equipment.',
    icon: '🔥', targetTier: 'basic', materials: [{ material: 'titanium_alloy', amount: 10 }, { material: 'crystal_matrix', amount: 5 }],
    creditsCost: 500, successRateBonus: 0, extraSubStatChance: 0.1,
  },
  {
    id: 'recipe_cryo_forge', name: 'Cryo Forge', description: 'Freeze and reforge the material lattice at molecular level.',
    icon: '❄️', targetTier: 'basic', materials: [{ material: 'titanium_alloy', amount: 12 }, { material: 'crystal_matrix', amount: 8 }],
    creditsCost: 600, successRateBonus: 0.05, extraSubStatChance: 0.15,
  },
  {
    id: 'recipe_plasma_wash', name: 'Plasma Wash', description: 'Bathe equipment in superheated plasma to purge impurities.',
    icon: '⚡', targetTier: 'advanced', materials: [{ material: 'titanium_alloy', amount: 25 }, { material: 'crystal_matrix', amount: 15 }, { material: 'plasma_core', amount: 5 }],
    creditsCost: 1500, successRateBonus: 0.05, guaranteedMinRarity: 'uncommon', extraSubStatChance: 0.2,
  },
  {
    id: 'recipe_quantum_align', name: 'Quantum Alignment', description: 'Align quantum states of all atoms for optimal structure.',
    icon: '⚛️', targetTier: 'advanced', materials: [{ material: 'titanium_alloy', amount: 30 }, { material: 'crystal_matrix', amount: 20 }, { material: 'quantum_fiber', amount: 10 }],
    creditsCost: 2000, successRateBonus: 0.1, guaranteedMinRarity: 'uncommon', extraSubStatChance: 0.25,
  },
  {
    id: 'recipe_dark_infusion', name: 'Dark Matter Infusion', description: 'Infuse with dark matter to unlock hidden potential.',
    icon: '🌑', targetTier: 'elite', materials: [{ material: 'titanium_alloy', amount: 50 }, { material: 'crystal_matrix', amount: 30 }, { material: 'dark_matter', amount: 5 }, { material: 'neutronium_plate', amount: 10 }],
    creditsCost: 5000, successRateBonus: 0.05, guaranteedMinRarity: 'rare', extraSubStatChance: 0.3,
  },
  {
    id: 'recipe_void_channel', name: 'Void Channeling', description: 'Channel void energy through the equipment matrix.',
    icon: '🌀', targetTier: 'elite', materials: [{ material: 'titanium_alloy', amount: 60 }, { material: 'crystal_matrix', amount: 40 }, { material: 'void_crystal', amount: 5 }, { material: 'dark_matter', amount: 10 }],
    creditsCost: 6000, successRateBonus: 0.1, guaranteedMinRarity: 'rare', extraSubStatChance: 0.35,
  },
  {
    id: 'recipe_stellar_bless', name: 'Stellar Blessing', description: 'Bathe in the light of a dying star to achieve legendary status.',
    icon: '⭐', targetTier: 'legendary', materials: [{ material: 'titanium_alloy', amount: 100 }, { material: 'crystal_matrix', amount: 60 }, { material: 'dark_matter', amount: 15 }, { material: 'void_crystal', amount: 5 }, { material: 'stellar_essence', amount: 5 }],
    creditsCost: 15000, successRateBonus: 0.05, guaranteedMinRarity: 'epic', extraSubStatChance: 0.4,
  },
  {
    id: 'recipe_cosmic_transcend', name: 'Cosmic Transcendence', description: 'Transcend mortal limits through cosmic energy infusion.',
    icon: '🌌', targetTier: 'mythic', materials: [{ material: 'titanium_alloy', amount: 200 }, { material: 'crystal_matrix', amount: 100 }, { material: 'dark_matter', amount: 30 }, { material: 'void_crystal', amount: 15 }, { material: 'stellar_essence', amount: 10 }, { material: 'cosmic_dust', amount: 20 }],
    creditsCost: 50000, successRateBonus: 0, guaranteedMinRarity: 'legendary', extraSubStatChance: 0.5,
  },
];

// ============================================================================
// MASTERWORK CONFIGURATION
// ============================================================================

export const MASTERWORK_MAX_TIER = 10;

export interface MasterworkTierConfig {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  statBoost: number;
  subStatBoost: number;
  successRate: number;
  requiredLevel: number;
  materials: { material: string; amount: number }[];
  creditsCost: number;
  bonusEffect?: string;
}

export const MASTERWORK_TIERS: MasterworkTierConfig[] = [
  { tier: 0, name: 'Untempered', description: 'No masterwork enhancement.', icon: '⬜', color: '#6b7280', statBoost: 0, subStatBoost: 0, successRate: 1.0, requiredLevel: 1, materials: [], creditsCost: 0 },
  { tier: 1, name: 'Tempered', description: 'Basic tempering applied.', icon: '🟩', color: '#22c55e', statBoost: 2, subStatBoost: 1, successRate: 0.95, requiredLevel: 5, materials: [{ material: 'titanium_alloy', amount: 20 }], creditsCost: 500 },
  { tier: 2, name: 'Forged', description: 'Refined through fire.', icon: '🟦', color: '#3b82f6', statBoost: 4, subStatBoost: 2, successRate: 0.9, requiredLevel: 15, materials: [{ material: 'titanium_alloy', amount: 40 }, { material: 'crystal_matrix', amount: 20 }], creditsCost: 1500 },
  { tier: 3, name: 'Hardened', description: 'Molecularly strengthened.', icon: '🟪', color: '#a855f7', statBoost: 6, subStatBoost: 3, successRate: 0.85, requiredLevel: 30, materials: [{ material: 'titanium_alloy', amount: 60 }, { material: 'crystal_matrix', amount: 30 }, { material: 'plasma_core', amount: 10 }], creditsCost: 4000, bonusEffect: '+2% All Resistances' },
  { tier: 4, name: 'Enchanted', description: 'Imbued with energy.', icon: '🟨', color: '#eab308', statBoost: 8, subStatBoost: 4, successRate: 0.8, requiredLevel: 50, materials: [{ material: 'titanium_alloy', amount: 80 }, { material: 'crystal_matrix', amount: 40 }, { material: 'dark_matter', amount: 5 }], creditsCost: 8000, bonusEffect: '+3% XP Bonus' },
  { tier: 5, name: 'Empowered', description: 'Power surges through.', icon: '🟧', color: '#f97316', statBoost: 10, subStatBoost: 5, successRate: 0.7, requiredLevel: 75, materials: [{ material: 'titanium_alloy', amount: 100 }, { material: 'crystal_matrix', amount: 50 }, { material: 'dark_matter', amount: 10 }, { material: 'neutronium_plate', amount: 5 }], creditsCost: 15000, bonusEffect: '+5% All Stats' },
  { tier: 6, name: 'Transcendent', description: 'Beyond mortal limits.', icon: '🟥', color: '#ef4444', statBoost: 13, subStatBoost: 7, successRate: 0.6, requiredLevel: 100, materials: [{ material: 'titanium_alloy', amount: 150 }, { material: 'crystal_matrix', amount: 75 }, { material: 'dark_matter', amount: 15 }, { material: 'void_crystal', amount: 5 }], creditsCost: 25000, bonusEffect: '+8% Combat Stats' },
  { tier: 7, name: 'Mythic Forged', description: 'Forged in mythic fire.', icon: '🩷', color: '#ec4899', statBoost: 16, subStatBoost: 9, successRate: 0.5, requiredLevel: 150, materials: [{ material: 'titanium_alloy', amount: 200 }, { material: 'crystal_matrix', amount: 100 }, { material: 'dark_matter', amount: 20 }, { material: 'void_crystal', amount: 10 }, { material: 'stellar_essence', amount: 5 }], creditsCost: 40000, bonusEffect: '+10% All Stats, +5% Crit' },
  { tier: 8, name: 'Celestial', description: 'Touched by the cosmos.', icon: '🩵', color: '#06b6d4', statBoost: 20, subStatBoost: 12, successRate: 0.4, requiredLevel: 200, materials: [{ material: 'titanium_alloy', amount: 300 }, { material: 'crystal_matrix', amount: 150 }, { material: 'dark_matter', amount: 30 }, { material: 'void_crystal', amount: 15 }, { material: 'stellar_essence', amount: 10 }], creditsCost: 75000, bonusEffect: '+15% All Stats, +8% Crit, +5% Dodge' },
  { tier: 9, name: 'Divine', description: 'Blessed by cosmic forces.', icon: '🟠', color: '#f97316', statBoost: 25, subStatBoost: 15, successRate: 0.3, requiredLevel: 300, materials: [{ material: 'titanium_alloy', amount: 400 }, { material: 'crystal_matrix', amount: 200 }, { material: 'dark_matter', amount: 40 }, { material: 'void_crystal', amount: 20 }, { material: 'stellar_essence', amount: 15 }, { material: 'cosmic_dust', amount: 10 }], creditsCost: 150000, bonusEffect: '+20% All Stats, +10% Crit, +8% Dodge, +5% HP Regen' },
  { tier: 10, name: 'Perfect', description: 'Absolute perfection achieved.', icon: '💎', color: '#fbbf24', statBoost: 30, subStatBoost: 20, successRate: 0.2, requiredLevel: 500, materials: [{ material: 'titanium_alloy', amount: 500 }, { material: 'crystal_matrix', amount: 250 }, { material: 'dark_matter', amount: 50 }, { material: 'void_crystal', amount: 25 }, { material: 'stellar_essence', amount: 20 }, { material: 'cosmic_dust', amount: 15 }, { material: 'neutronium_plate', amount: 10 }], creditsCost: 300000, bonusEffect: '+30% All Stats, +15% Crit, +10% Dodge, +8% HP Regen, +5% Resource Bonus' },
];

// ============================================================================
// TEMPERING STATION STATE
// ============================================================================

export interface TemperingStationState {
  level: number;
  experience: number;
  totalTempered: number;
  totalMasterworked: number;
  totalReforged: number;
  temperHistory: TemperingRecord[];
  achievements: string[];
  tokens: number;
}

export interface TemperingRecord {
  equipmentId: string;
  equipmentName: string;
  timestamp: number;
  action: 'temper' | 'masterwork' | 'reforge' | 'lock';
  details: string;
  success: boolean;
}

export function getDefaultTemperingStationState(): TemperingStationState {
  return {
    level: 1,
    experience: 0,
    totalTempered: 0,
    totalMasterworked: 0,
    totalReforged: 0,
    temperHistory: [],
    achievements: [],
    tokens: 0,
  };
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getRarityForRoll(minRarity?: StatRarity): StatRarity {
  const rarityOrder: StatRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  const minIndex = minRarity ? rarityOrder.indexOf(minRarity) : 0;
  const roll = Math.random() * 100;
  let rarity: StatRarity = 'common';
  if (roll < 40) rarity = 'common';
  else if (roll < 65) rarity = 'uncommon';
  else if (roll < 82) rarity = 'rare';
  else if (roll < 93) rarity = 'epic';
  else if (roll < 99) rarity = 'legendary';
  else rarity = 'mythic';

  const idx = rarityOrder.indexOf(rarity);
  return rarityOrder[Math.max(idx, minIndex)];
}

/** Generate a random sub-stat for a given slot */
export function rollSubStat(slot: EquipmentSlot, minRarity?: StatRarity, qualityFloor?: number): SubStat {
  const pool = STAT_POOLS[slot];
  const statDef = pool[Math.floor(Math.random() * pool.length)];
  const rarity = getRarityForRoll(minRarity);
  const rarityConfig = RARITY_CONFIG[rarity];
  const floor = qualityFloor ?? rarityConfig.rollQualityFloor;
  const quality = Math.max(floor, Math.random());
  const value = Math.round(statDef.min + (statDef.max - statDef.min) * quality);

  return {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: statDef.name,
    statType: statDef.statType,
    value,
    isPercent: statDef.isPercent,
    rarity,
    rollQuality: quality,
    isLocked: false,
  };
}

/** Toggle lock on a sub-stat */
export function toggleSubStatLock(item: EquipmentItem, subStatIndex: number): EquipmentItem {
  const tierConfig = TEMPERING_TIERS[item.temperTier];
  const lockedCount = item.subStats.filter(s => s.isLocked).length;
  const sub = item.subStats[subStatIndex];

  if (!sub) return item;

  if (sub.isLocked) {
    const newSubStats = item.subStats.map((s, i) =>
      i === subStatIndex ? { ...s, isLocked: false, lockedAtTier: undefined } : s
    );
    return { ...item, subStats: newSubStats };
  }

  if (lockedCount >= tierConfig.maxLocks) return item;

  const newSubStats = item.subStats.map((s, i) =>
    i === subStatIndex ? { ...s, isLocked: true, lockedAtTier: item.temperTier } : s
  );
  return { ...item, subStats: newSubStats };
}

/** Temper an item: reroll one or all sub-stats */
export function temperItem(
  item: EquipmentItem,
  rerollAll: boolean = false,
  lockedSubStatIds: string[] = [],
  recipe?: TemperRecipe
): EquipmentItem {
  const tierConfig = TEMPERING_TIERS[item.temperTier];
  const targetCount = Math.min(
    item.subStats.length || tierConfig.maxSubStats,
    tierConfig.maxSubStats
  );

  const minRarity = recipe?.guaranteedMinRarity;
  const qualityFloor = tierConfig.rollQualityFloor;

  let newSubStats: SubStat[];

  if (rerollAll) {
    newSubStats = [];
    for (let i = 0; i < targetCount; i++) {
      const existing = item.subStats[i];
      if (existing && (lockedSubStatIds.includes(existing.id) || existing.isLocked)) {
        newSubStats.push(existing);
      } else {
        newSubStats.push(rollSubStat(item.slot, minRarity, qualityFloor));
      }
    }
  } else {
    const unlockedIndices = item.subStats
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => !lockedSubStatIds.includes(s.id) && !s.isLocked)
      .map(({ i }) => i);

    if (unlockedIndices.length === 0) {
      if (item.subStats.length < tierConfig.maxSubStats) {
        newSubStats = [...item.subStats, rollSubStat(item.slot, minRarity, qualityFloor)];
      } else {
        newSubStats = [...item.subStats];
      }
    } else {
      const targetIndex = unlockedIndices[Math.floor(Math.random() * unlockedIndices.length)];
      newSubStats = [...item.subStats];
      newSubStats[targetIndex] = rollSubStat(item.slot, minRarity, qualityFloor);
    }
  }

  const newTotalTemperValue = newSubStats.reduce((sum, s) => sum + s.value, 0);

  return {
    ...item,
    subStats: newSubStats,
    temperCount: item.temperCount + 1,
    totalTemperValue: newTotalTemperValue,
  };
}

/** Advance tempering tier */
export function advanceTemperTier(item: EquipmentItem): EquipmentItem {
  const currentIndex = TEMPERING_TIER_ORDER.indexOf(item.temperTier);
  if (currentIndex >= TEMPERING_TIER_ORDER.length - 1) return item;

  const newTier = TEMPERING_TIER_ORDER[currentIndex + 1];
  const tierConfig = TEMPERING_TIERS[newTier];

  const newBaseStats = item.baseStats.map(stat => ({
    ...stat,
    value: Math.round(stat.value * (1 + tierConfig.statBoostPercent / 100)),
  }));

  return {
    ...item,
    temperTier: newTier,
    baseStats: newBaseStats,
    maxLocks: tierConfig.maxLocks,
  } as any;
}

/** Masterwork an item: advance tier, boosting all stats */
export function masterworkItem(item: EquipmentItem): EquipmentItem {
  const tierConfig = MASTERWORK_TIERS[item.masterworkTier];
  const newTier = Math.min(item.masterworkTier + 1, MASTERWORK_MAX_TIER);
  const newTierConfig = MASTERWORK_TIERS[newTier];

  const boost = newTierConfig.statBoost - tierConfig.statBoost;
  const subBoost = newTierConfig.subStatBoost - tierConfig.subStatBoost;

  const newBaseStats = item.baseStats.map(stat => ({
    ...stat,
    value: stat.value + boost,
  }));

  const newSubStats = item.subStats.map(sub => ({
    ...sub,
    value: sub.value + subBoost,
    rollQuality: Math.min(1.0, sub.rollQuality + 0.03),
  }));

  return {
    ...item,
    baseStats: newBaseStats,
    subStats: newSubStats,
    masterworkTier: newTier,
    isMasterworked: newTier >= MASTERWORK_MAX_TIER,
  };
}

/** Reforge: reset equipment to base state */
export function reforgeItem(item: EquipmentItem): EquipmentItem {
  return {
    ...item,
    subStats: [],
    masterworkTier: 0,
    temperCount: 0,
    isMasterworked: false,
    temperTier: 'untouched',
    totalTemperValue: 0,
  };
}

/** Calculate total stats from an equipment item */
export function calculateEquipmentStats(item: EquipmentItem): { statType: string; value: number; isPercent: boolean }[] {
  const stats: Record<string, { value: number; isPercent: boolean }> = {};

  for (const base of item.baseStats) {
    if (!stats[base.statType]) stats[base.statType] = { value: 0, isPercent: base.isPercent };
    stats[base.statType].value += base.value;
  }

  for (const sub of item.subStats) {
    if (!stats[sub.statType]) stats[sub.statType] = { value: 0, isPercent: sub.isPercent };
    stats[sub.statType].value += sub.value;
  }

  const mwConfig = MASTERWORK_TIERS[item.masterworkTier];
  const tierConfig = TEMPERING_TIERS[item.temperTier];

  for (const key of Object.keys(stats)) {
    stats[key].value += mwConfig.statBoost;
    stats[key].value = Math.round(stats[key].value * (1 + tierConfig.statBoostPercent / 100));
  }

  return Object.entries(stats).map(([statType, { value, isPercent }]) => ({ statType, value, isPercent }));
}

/** Calculate power score */
export function calculatePowerScore(item: EquipmentItem): number {
  const rarityMult = RARITY_CONFIG[item.rarity].powerScoreMultiplier;
  const mwBonus = item.masterworkTier * 50;
  const temperBonus = item.totalTemperValue * 0.5;
  const subStatBonus = item.subStats.length * 20;
  const lockedBonus = item.subStats.filter(s => s.isLocked).length * 10;
  return Math.round((item.level * rarityMult) + mwBonus + temperBonus + subStatBonus + lockedBonus);
}

/** Get tempering cost for recipe */
export function getTemperCost(item: EquipmentItem, recipe?: TemperRecipe): { metal: number; crystal: number; deuterium: number; credits: number } {
  const tierConfig = TEMPERING_TIERS[item.temperTier];
  const baseCost = {
    metal: Math.round(500 * item.level * RARITY_CONFIG[item.rarity].temperCostMultiplier),
    crystal: Math.round(300 * item.level * RARITY_CONFIG[item.rarity].temperCostMultiplier),
    deuterium: Math.round(100 * item.level * RARITY_CONFIG[item.rarity].temperCostMultiplier),
    credits: Math.round(200 * item.level * RARITY_CONFIG[item.rarity].temperCostMultiplier),
  };

  if (recipe) {
    return {
      metal: recipe.materials.find(m => m.material === 'titanium_alloy')?.amount || baseCost.metal,
      crystal: recipe.materials.find(m => m.material === 'crystal_matrix')?.amount || baseCost.crystal,
      deuterium: recipe.materials.find(m => m.material === 'plasma_core')?.amount || baseCost.deuterium,
      credits: recipe.creditsCost,
    };
  }

  return baseCost;
}

/** Get masterwork cost */
export function getMasterworkCost(item: EquipmentItem): { metal: number; crystal: number; deuterium: number; darkmatter: number; credits: number } {
  const nextTier = Math.min(item.masterworkTier + 1, MASTERWORK_MAX_TIER);
  const tierConfig = MASTERWORK_TIERS[nextTier];
  return {
    metal: tierConfig.materials.find(m => m.material === 'titanium_alloy')?.amount || 0,
    crystal: tierConfig.materials.find(m => m.material === 'crystal_matrix')?.amount || 0,
    deuterium: tierConfig.materials.find(m => m.material === 'plasma_core')?.amount || 0,
    darkmatter: tierConfig.materials.find(m => m.material === 'dark_matter')?.amount || 0,
    credits: tierConfig.creditsCost,
  };
}

/** Check if station can temper */
export function canTemper(stationLevel: number, item: EquipmentItem): { canTemper: boolean; reason?: string } {
  if (item.temperTier === 'mythic') return { canTemper: false, reason: 'Maximum tempering tier reached' };
  const nextTierIndex = TEMPERING_TIER_ORDER.indexOf(item.temperTier) + 1;
  const nextTier = TEMPERING_TIER_ORDER[nextTierIndex];
  const tierConfig = TEMPERING_TIERS[nextTier];
  if (stationLevel < tierConfig.requiredSmithyLevel) return { canTemper: false, reason: `Requires station level ${tierConfig.requiredSmithyLevel}` };
  return { canTemper: true };
}

/** Check if station can masterwork */
export function canMasterwork(stationLevel: number, item: EquipmentItem): { canMasterwork: boolean; reason?: string } {
  if (item.masterworkTier >= MASTERWORK_MAX_TIER) return { canMasterwork: false, reason: 'Maximum masterwork tier reached' };
  const nextTier = MASTERWORK_TIERS[item.masterworkTier + 1];
  if (stationLevel < nextTier.requiredLevel / 5) return { canMasterwork: false, reason: `Requires station level ${Math.ceil(nextTier.requiredLevel / 5)}` };
  return { canMasterwork: true };
}

/** Get tempering station XP for next level */
export function getStationXPForLevel(level: number): number {
  return level * level * 500;
}

/** Calculate tempering synergies for full masterwork sets */
export function getTemperingSynergies(items: EquipmentItem[]): { name: string; bonus: string; active: boolean }[] {
  const synergies: { name: string; bonus: string; active: boolean }[] = [];

  const allMasterwork = items.every(i => i.masterworkTier >= 5);
  synergies.push({ name: 'Half Forged', bonus: '+5% All Stats', active: allMasterwork });

  const allMythic = items.every(i => i.masterworkTier >= 10);
  synergies.push({ name: 'Perfect Harmony', bonus: '+15% All Stats, +10% Crit', active: allMythic });

  const allTempered = items.every(i => TEMPERING_TIER_ORDER.indexOf(i.temperTier) >= TEMPERING_TIER_ORDER.indexOf('advanced'));
  synergies.push({ name: 'Tempered Resilience', bonus: '+8% Damage Reduction', active: allTempered });

  const allLegendary = items.every(i => TEMPERING_TIER_ORDER.indexOf(i.temperTier) >= TEMPERING_TIER_ORDER.indexOf('legendary'));
  synergies.push({ name: 'Legendary Aura', bonus: '+10% All Stats, +5% XP Bonus', active: allLegendary });

  return synergies;
}

// ============================================================================
// MASTERWORK TIER DISPLAY
// ============================================================================

export const MASTERWORK_TIER_NAMES: Record<number, string> = Object.fromEntries(
  MASTERWORK_TIERS.map(t => [t.tier, t.name])
);

export const MASTERWORK_TIER_COLORS: Record<number, string> = Object.fromEntries(
  MASTERWORK_TIERS.map(t => [t.tier, t.color])
);
