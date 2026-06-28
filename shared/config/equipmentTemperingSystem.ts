/**
 * EQUIPMENT TEMPERING & MASTERWORKING SYSTEM
 * ============================================================================
 * Enhance equipment through tempering (stat rerolling) and masterworking
 * (tier advancement). Stats and sub-stats with rarity-weighted rolls.
 * 
 * Temper: Spend resources to reroll sub-stats on equipment
 * Masterwork: Advance equipment tier, gaining +1 to all stats per tier
 * Maximum masterwork tier: +10
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
  rollQuality: number; // 0.0 - 1.0, how close to max roll
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
  masterworkTier: number; // 0-10
  temperCount: number;   // number of times tempered
  isMasterworked: boolean;
  setId?: string;
  unique?: boolean;
}

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
  subStatCount: [number, number]; // [min, max]
}> = {
  common:    { color: '#9ca3af', maxSubStats: 2, temperCostMultiplier: 1,   masterworkBonus: 1,   rollQualityFloor: 0.0, subStatCount: [1, 2] },
  uncommon:  { color: '#22c55e', maxSubStats: 3, temperCostMultiplier: 1.5, masterworkBonus: 2,   rollQualityFloor: 0.2, subStatCount: [2, 3] },
  rare:      { color: '#3b82f6', maxSubStats: 3, temperCostMultiplier: 2,   masterworkBonus: 3,   rollQualityFloor: 0.3, subStatCount: [2, 3] },
  epic:      { color: '#a855f7', maxSubStats: 4, temperCostMultiplier: 3,   masterworkBonus: 4,   rollQualityFloor: 0.4, subStatCount: [3, 4] },
  legendary: { color: '#f59e0b', maxSubStats: 4, temperCostMultiplier: 5,   masterworkBonus: 5,   rollQualityFloor: 0.5, subStatCount: [3, 4] },
  mythic:    { color: '#ef4444', maxSubStats: 5, temperCostMultiplier: 8,   masterworkBonus: 8,   rollQualityFloor: 0.6, subStatCount: [4, 5] },
};

// ============================================================================
// TEMPERING COSTS
// ============================================================================

export interface TemperCost {
  metal: number;
  crystal: number;
  deuterium: number;
  darkmatter: number;
}

export function getTemperCost(item: EquipmentItem): TemperCost {
  const rarityConfig = RARITY_CONFIG[item.rarity];
  const baseCost = {
    metal: 5000 * item.level,
    crystal: 3000 * item.level,
    deuterium: 1000 * item.level,
    darkmatter: 50 * item.temperCount,
  };
  return {
    metal: Math.round(baseCost.metal * rarityConfig.temperCostMultiplier),
    crystal: Math.round(baseCost.crystal * rarityConfig.temperCostMultiplier),
    deuterium: Math.round(baseCost.deuterium * rarityConfig.temperCostMultiplier),
    darkmatter: Math.round(baseCost.darkmatter * rarityConfig.temperCostMultiplier),
  };
}

// ============================================================================
// MASTERWORKING COSTS
// ============================================================================

export function getMasterworkCost(item: EquipmentItem, targetTier: number): TemperCost {
  const rarityConfig = RARITY_CONFIG[item.rarity];
  const tierMultiplier = Math.pow(1.5, targetTier);
  return {
    metal: Math.round(20000 * item.level * tierMultiplier * rarityConfig.temperCostMultiplier),
    crystal: Math.round(15000 * item.level * tierMultiplier * rarityConfig.temperCostMultiplier),
    deuterium: Math.round(8000 * item.level * tierMultiplier * rarityConfig.temperCostMultiplier),
    darkmatter: Math.round(200 * targetTier * rarityConfig.temperCostMultiplier),
  };
}

// ============================================================================
// ROLLING FUNCTIONS
// ============================================================================

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getRarityForRoll(): StatRarity {
  const roll = Math.random() * 100;
  if (roll < 40) return 'common';
  if (roll < 65) return 'uncommon';
  if (roll < 82) return 'rare';
  if (roll < 93) return 'epic';
  if (roll < 99) return 'legendary';
  return 'mythic';
}

/** Generate a random sub-stat for a given slot */
export function rollSubStat(slot: EquipmentSlot): SubStat {
  const pool = STAT_POOLS[slot];
  const statDef = pool[Math.floor(Math.random() * pool.length)];
  const rarity = getRarityForRoll();
  const rarityConfig = RARITY_CONFIG[rarity];
  const quality = Math.max(rarityConfig.rollQualityFloor, Math.random());
  const value = Math.round(statDef.min + (statDef.max - statDef.min) * quality);
  
  return {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: statDef.name,
    statType: statDef.statType,
    value,
    isPercent: statDef.isPercent,
    rarity,
    rollQuality: quality,
  };
}

/** Temper an item: reroll one or all sub-stats */
export function temperItem(
  item: EquipmentItem,
  rerollAll: boolean = false,
  lockedSubStatIds: string[] = []
): EquipmentItem {
  const rarityConfig = RARITY_CONFIG[item.rarity];
  const targetCount = Math.min(
    item.subStats.length || rarityConfig.subStatCount[0],
    rarityConfig.maxSubStats
  );
  
  let newSubStats: SubStat[];
  
  if (rerollAll) {
    // Reroll all sub-stats (keeping locked ones)
    newSubStats = [];
    for (let i = 0; i < targetCount; i++) {
      const existing = item.subStats[i];
      if (existing && lockedSubStatIds.includes(existing.id)) {
        newSubStats.push(existing);
      } else {
        newSubStats.push(rollSubStat(item.slot));
      }
    }
  } else {
    // Reroll a random unlocked sub-stat
    const unlockedIndices = item.subStats
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => !lockedSubStatIds.includes(s.id))
      .map(({ i }) => i);
    
    if (unlockedIndices.length === 0) {
      // All locked or no sub-stats, add a new one
      if (item.subStats.length < rarityConfig.maxSubStats) {
        newSubStats = [...item.subStats, rollSubStat(item.slot)];
      } else {
        newSubStats = [...item.subStats];
      }
    } else {
      const targetIndex = unlockedIndices[Math.floor(Math.random() * unlockedIndices.length)];
      newSubStats = [...item.subStats];
      newSubStats[targetIndex] = rollSubStat(item.slot);
    }
  }
  
  return {
    ...item,
    subStats: newSubStats,
    temperCount: item.temperCount + 1,
  };
}

/** Masterwork an item: advance tier, boosting all stats */
export function masterworkItem(item: EquipmentItem): EquipmentItem {
  const rarityConfig = RARITY_CONFIG[item.rarity];
  const newTier = Math.min(item.masterworkTier + 1, 10);
  
  // Boost all base stats by masterwork bonus
  const newBaseStats = item.baseStats.map(stat => ({
    ...stat,
    value: stat.value + rarityConfig.masterworkBonus,
  }));
  
  // Boost all sub-stats by a smaller amount
  const newSubStats = item.subStats.map(sub => ({
    ...sub,
    value: sub.value + Math.max(1, Math.floor(rarityConfig.masterworkBonus * 0.5)),
    rollQuality: Math.min(1.0, sub.rollQuality + 0.05),
  }));
  
  return {
    ...item,
    baseStats: newBaseStats,
    subStats: newSubStats,
    masterworkTier: newTier,
    isMasterworked: newTier >= 10,
  };
}

/** Calculate total stats from an equipment item (base + sub + masterwork) */
export function calculateEquipmentStats(item: EquipmentItem): { statType: string; value: number; isPercent: boolean }[] {
  const stats: Record<string, { value: number; isPercent: boolean }> = {};
  
  // Add base stats
  for (const base of item.baseStats) {
    const key = base.statType;
    if (!stats[key]) stats[key] = { value: 0, isPercent: base.isPercent };
    stats[key].value += base.value;
  }
  
  // Add sub-stats
  for (const sub of item.subStats) {
    const key = sub.statType;
    if (!stats[key]) stats[key] = { value: 0, isPercent: sub.isPercent };
    stats[key].value += sub.value;
  }
  
  return Object.entries(stats).map(([statType, { value, isPercent }]) => ({
    statType,
    value,
    isPercent,
  }));
}

// ============================================================================
// MASTERWORK TIER BONUSES
// ============================================================================

export const MASTERWORK_TIER_NAMES: Record<number, string> = {
  0: 'Untempered',
  1: 'Tempered',
  2: 'Forged',
  3: 'Hardened',
  4: 'Enchanted',
  5: 'Empowered',
  6: 'Transcendent',
  7: 'Mythic Forged',
  8: 'Celestial',
  9: 'Divine',
  10: 'Perfect',
};

export const MASTERWORK_TIER_COLORS: Record<number, string> = {
  0: '#9ca3af',
  1: '#6b7280',
  2: '#22c55e',
  3: '#3b82f6',
  4: '#a855f7',
  5: '#f59e0b',
  6: '#ef4444',
  7: '#ec4899',
  8: '#06b6d4',
  9: '#f97316',
  10: '#fbbf24',
};