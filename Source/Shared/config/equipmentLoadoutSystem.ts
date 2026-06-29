/**
 * EQUIPMENT LOADOUT SYSTEM
 * ============================================================================
 * Manage equipment loadouts for commanders. Each loadout defines a complete
 * set of gear across all slots. Players can save, switch, and compare loadouts.
 * 
 * Features:
 *   - 6 preset loadout slots (expandable)
 *   - Auto-equip best gear
 *   - Loadout sharing
 *   - Set bonuses for matching equipment sets
 *   - Quick-swap between loadouts
 */

import {
  EquipmentItem,
  EquipmentSlot,
  StatRarity,
  calculateEquipmentStats,
  rollSubStat,
  RARITY_CONFIG,
} from './equipmentTemperingSystem';

// ============================================================================
// LOADOUT TYPES
// ============================================================================

export interface EquipmentLoadout {
  id: string;
  name: string;
  description: string;
  icon: string;
  slots: Partial<Record<EquipmentSlot, EquipmentItem | null>>;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  powerScore: number;
}

export interface LoadoutState {
  loadouts: EquipmentLoadout[];
  activeLoadoutId: string | null;
  maxLoadouts: number;
}

// ============================================================================
// EQUIPMENT SETS (Bonus for wearing multiple pieces)
// ============================================================================

export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bonuses: {
    pieces: number;
    description: string;
    modifiers: { statType: string; value: number; isPercent: boolean }[];
  }[];
}

export const EQUIPMENT_SETS: EquipmentSet[] = [
  {
    id: 'set_voidborne',
    name: 'Voidborne',
    description: 'Ancient armor forged in the depths of space.',
    icon: '🌌',
    color: '#7c3aed',
    bonuses: [
      { pieces: 2, description: '+10% Shield HP, +5% Hull HP', modifiers: [{ statType: 'shieldHp', value: 10, isPercent: true }, { statType: 'hullHp', value: 5, isPercent: true }] },
      { pieces: 4, description: '+15% Shield Recharge, +10% Damage Reduction', modifiers: [{ statType: 'shieldRecharge', value: 15, isPercent: true }, { statType: 'damageReduction', value: 10, isPercent: true }] },
      { pieces: 6, description: '+25% All Defenses, Shields absorb 15% hull damage', modifiers: [{ statType: 'shieldHp', value: 25, isPercent: true }, { statType: 'armorValue', value: 25, isPercent: true }] },
    ],
  },
  {
    id: 'set_reapers_wrath',
    name: "Reaper's Wrath",
    description: 'Offensive gear that grows more deadly with each kill.',
    icon: '💀',
    color: '#dc2626',
    bonuses: [
      { pieces: 2, description: '+8% Weapon Damage, +5% Crit Chance', modifiers: [{ statType: 'weaponDamage', value: 8, isPercent: true }, { statType: 'weaponCritChance', value: 5, isPercent: true }] },
      { pieces: 4, description: '+15% Weapon Speed, +10% Crit Damage', modifiers: [{ statType: 'weaponSpeed', value: 15, isPercent: true }, { statType: 'weaponCritDamage', value: 10, isPercent: true }] },
      { pieces: 6, description: '+20% All Damage, +15% Crit Chance, Kill grants +20% speed for 5s', modifiers: [{ statType: 'weaponDamage', value: 20, isPercent: true }, { statType: 'weaponCritChance', value: 15, isPercent: true }] },
    ],
  },
  {
    id: 'set_stellar_wanderer',
    name: 'Stellar Wanderer',
    description: 'Exploration-focused gear for deep space travel.',
    icon: '🔭',
    color: '#059669',
    bonuses: [
      { pieces: 2, description: '+10% Warp Speed, +8% Flight Speed', modifiers: [{ statType: 'warpSpeed', value: 10, isPercent: true }, { statType: 'flightVelocity', value: 8, isPercent: true }] },
      { pieces: 4, description: '+15% Mining Yield, +10% Cargo', modifiers: [{ statType: 'miningYield', value: 15, isPercent: true }, { statType: 'cargoCapacity', value: 10, isPercent: true }] },
      { pieces: 6, description: '+25% All Speed, +20% Sensor Strength, +15% Avoidance', modifiers: [{ statType: 'warpSpeed', value: 25, isPercent: true }, { statType: 'sensorStrength', value: 20, isPercent: true }] },
    ],
  },
  {
    id: 'set_shadow_covenant',
    name: 'Shadow Covenant',
    description: 'Espionage and electronic warfare specialization.',
    icon: '🕵️',
    color: '#6d28d9',
    bonuses: [
      { pieces: 2, description: '+10% EW Strength, -8% Signature', modifiers: [{ statType: 'electronicWarfare', value: 10, isPercent: true }, { statType: 'signatureRadius', value: 8, isPercent: true }] },
      { pieces: 4, description: '+15% Targeting Speed, +10% Crowd Control', modifiers: [{ statType: 'targetingSpeed', value: 15, isPercent: true }, { statType: 'crowdControl', value: 10, isPercent: true }] },
      { pieces: 6, description: '+25% EW, +20% Avoidance, Enemies have -15% accuracy', modifiers: [{ statType: 'electronicWarfare', value: 25, isPercent: true }, { statType: 'avoidance', value: 20, isPercent: true }] },
    ],
  },
  {
    id: 'set_fleet_sovereign',
    name: 'Fleet Sovereign',
    description: 'Command-focused gear for fleet commanders.',
    icon: '👑',
    color: '#d97706',
    bonuses: [
      { pieces: 2, description: '+10% Crew Efficiency, +8% Command Range', modifiers: [{ statType: 'crewEfficiency', value: 10, isPercent: true }, { statType: 'fleetCommandRange', value: 8, isPercent: true }] },
      { pieces: 4, description: '+15% Repair Amount, +10% Logistics', modifiers: [{ statType: 'repairAmount', value: 15, isPercent: true }, { statType: 'logisticsBandwidth', value: 10, isPercent: true }] },
      { pieces: 6, description: '+25% Crew Efficiency, +20% Command Range, Fleet gains +10% all stats', modifiers: [{ statType: 'crewEfficiency', value: 25, isPercent: true }, { statType: 'fleetCommandRange', value: 20, isPercent: true }] },
    ],
  },
  {
    id: 'set_quantum_forge',
    name: 'Quantum Forge',
    description: 'Technology and construction specialization.',
    icon: '⚛️',
    color: '#0891b2',
    bonuses: [
      { pieces: 2, description: '+10% Research Speed, +8% Build Speed', modifiers: [{ statType: 'researchSpeed', value: 10, isPercent: true }, { statType: 'buildSpeedBonus', value: 8, isPercent: true }] },
      { pieces: 4, description: '+15% XP Bonus, +10% Resource Bonus', modifiers: [{ statType: 'xpBonus', value: 15, isPercent: true }, { statType: 'resourceBonus', value: 10, isPercent: true }] },
      { pieces: 6, description: '+25% Research Speed, +20% Build Speed, +15% Turn Efficiency', modifiers: [{ statType: 'researchSpeed', value: 25, isPercent: true }, { statType: 'buildSpeedBonus', value: 20, isPercent: true }] },
    ],
  },
];

// ============================================================================
// DEFAULT LOADOUT STATE
// ============================================================================

export function createDefaultLoadoutState(): LoadoutState {
  return {
    loadouts: [
      createEmptyLoadout('loadout_1', 'Combat Loadout', 'Optimized for fleet battles', '⚔️'),
      createEmptyLoadout('loadout_2', 'Exploration Loadout', 'Maximized for deep space travel', '🔭'),
      createEmptyLoadout('loadout_3', 'Industry Loadout', 'Built for resource production', '🏗️'),
      createEmptyLoadout('loadout_4', 'Espionage Loadout', 'Stealth and sabotage focused', '🕵️'),
      createEmptyLoadout('loadout_5', 'Support Loadout', 'Repair and logistics specialist', '💚'),
      createEmptyLoadout('loadout_6', 'Balanced Loadout', 'Well-rounded configuration', '⚖️'),
    ],
    activeLoadoutId: 'loadout_1',
    maxLoadouts: 6,
  };
}

export function createEmptyLoadout(id: string, name: string, description: string, icon: string): EquipmentLoadout {
  return {
    id,
    name,
    description,
    icon,
    slots: {
      primaryWeapon: null,
      secondaryWeapon: null,
      armorCore: null,
      shieldModule: null,
      engineCore: null,
      commandModule: null,
      utilityBay: null,
      sensorArray: null,
      capacitorBank: null,
      reactorCore: null,
    },
    isActive: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    powerScore: 0,
  };
}

// ============================================================================
// LOADOUT MANAGEMENT
// ============================================================================

/** Calculate total power score for a loadout */
export function calculateLoadoutPowerScore(loadout: EquipmentLoadout): number {
  let totalScore = 0;
  const rarityPower: Record<StatRarity, number> = {
    common: 10,
    uncommon: 25,
    rare: 50,
    epic: 100,
    legendary: 200,
    mythic: 400,
  };

  for (const slot of Object.values(loadout.slots)) {
    if (slot) {
      totalScore += rarityPower[slot.rarity] * slot.level;
      totalScore += slot.masterworkTier * 50;
      totalScore += slot.subStats.length * 15;
      totalScore += slot.temperCount * 2;
    }
  }
  
  // Set bonus score
  const setId = detectSetBonus(loadout);
  if (setId) {
    const set = EQUIPMENT_SETS.find(s => s.id === setId);
    if (set) {
      const pieceCount = countSetPieces(loadout, setId);
      for (const bonus of set.bonuses) {
        if (pieceCount >= bonus.pieces) {
          totalScore += bonus.pieces * 50;
        }
      }
    }
  }
  
  return totalScore;
}

/** Count how many pieces of a set are equipped */
export function countSetPieces(loadout: EquipmentLoadout, setId: string): number {
  let count = 0;
  for (const item of Object.values(loadout.slots)) {
    if (item && item.setId === setId) {
      count++;
    }
  }
  return count;
}

/** Detect which set bonus is active (most pieces) */
export function detectSetBonus(loadout: EquipmentLoadout): string | null {
  const setCounts: Record<string, number> = {};
  
  for (const item of Object.values(loadout.slots)) {
    if (item && item.setId) {
      setCounts[item.setId] = (setCounts[item.setId] || 0) + 1;
    }
  }
  
  let bestSet: string | null = null;
  let bestCount = 0;
  for (const [setId, count] of Object.entries(setCounts)) {
    if (count >= 2 && count > bestCount) {
      bestSet = setId;
      bestCount = count;
    }
  }
  
  return bestSet;
}

/** Get active set bonuses for a loadout */
export function getActiveSetBonuses(loadout: EquipmentLoadout): {
  set: EquipmentSet;
  activeBonuses: typeof EQUIPMENT_SETS[0]['bonuses'];
  pieceCount: number;
}[] {
  const results: {
    set: EquipmentSet;
    activeBonuses: typeof EQUIPMENT_SETS[0]['bonuses'];
    pieceCount: number;
  }[] = [];
  
  const setCounts: Record<string, number> = {};
  for (const item of Object.values(loadout.slots)) {
    if (item && item.setId) {
      setCounts[item.setId] = (setCounts[item.setId] || 0) + 1;
    }
  }
  
  for (const [setId, pieceCount] of Object.entries(setCounts)) {
    if (pieceCount >= 2) {
      const set = EQUIPMENT_SETS.find(s => s.id === setId);
      if (set) {
        const activeBonuses = set.bonuses.filter(b => pieceCount >= b.pieces);
        if (activeBonuses.length > 0) {
          results.push({ set, activeBonuses, pieceCount });
        }
      }
    }
  }
  
  return results;
}

/** Calculate total stats from all equipped items in a loadout */
export function calculateLoadoutStats(loadout: EquipmentLoadout): { statType: string; value: number; isPercent: boolean }[] {
  const stats: Record<string, { value: number; isPercent: boolean }> = {};
  
  for (const item of Object.values(loadout.slots)) {
    if (item) {
      const itemStats = calculateEquipmentStats(item);
      for (const stat of itemStats) {
        if (!stats[stat.statType]) {
          stats[stat.statType] = { value: 0, isPercent: stat.isPercent };
        }
        stats[stat.statType].value += stat.value;
      }
    }
  }
  
  // Add set bonuses
  const setBonuses = getActiveSetBonuses(loadout);
  for (const { activeBonuses } of setBonuses) {
    for (const bonus of activeBonuses) {
      for (const mod of bonus.modifiers) {
        if (!stats[mod.statType]) {
          stats[mod.statType] = { value: 0, isPercent: mod.isPercent };
        }
        stats[mod.statType].value += mod.value;
      }
    }
  }
  
  return Object.entries(stats).map(([statType, { value, isPercent }]) => ({
    statType,
    value,
    isPercent,
  }));
}

/** Switch active loadout */
export function switchLoadout(state: LoadoutState, loadoutId: string): LoadoutState {
  return {
    ...state,
    activeLoadoutId: loadoutId,
    loadouts: state.loadouts.map(l => ({
      ...l,
      isActive: l.id === loadoutId,
    })),
  };
}

/** Equip an item to a loadout */
export function equipItemToLoadout(
  state: LoadoutState,
  loadoutId: string,
  item: EquipmentItem
): LoadoutState {
  return {
    ...state,
    loadouts: state.loadouts.map(l => {
      if (l.id !== loadoutId) return l;
      const newSlots = { ...l.slots, [item.slot]: item };
      const newLoadout = { ...l, slots: newSlots, updatedAt: Date.now() };
      newLoadout.powerScore = calculateLoadoutPowerScore(newLoadout);
      return newLoadout;
    }),
  };
}

/** Unequip an item from a slot */
export function unequipItemFromLoadout(
  state: LoadoutState,
  loadoutId: string,
  slot: EquipmentSlot
): { state: LoadoutState; removedItem: EquipmentItem | null } {
  let removedItem: EquipmentItem | null = null;
  
  const newState = {
    ...state,
    loadouts: state.loadouts.map(l => {
      if (l.id !== loadoutId) return l;
      removedItem = l.slots[slot] || null;
      const newSlots = { ...l.slots, [slot]: null };
      const newLoadout = { ...l, slots: newSlots, updatedAt: Date.now() };
      newLoadout.powerScore = calculateLoadoutPowerScore(newLoadout);
      return newLoadout;
    }),
  };
  
  return { state: newState, removedItem };
}

/** Auto-equip best items from inventory */
export function autoEquipBestItems(
  state: LoadoutState,
  loadoutId: string,
  inventory: EquipmentItem[]
): LoadoutState {
  let currentState = state;
  
  for (const item of inventory) {
    currentState = equipItemToLoadout(currentState, loadoutId, item);
  }
  
  return currentState;
}

/** Create a new loadout */
export function createLoadout(
  state: LoadoutState,
  name: string,
  description: string,
  icon: string
): { state: LoadoutState; loadout: EquipmentLoadout } | null {
  if (state.loadouts.length >= state.maxLoadouts) {
    return null;
  }
  
  const id = `loadout_${Date.now()}`;
  const loadout = createEmptyLoadout(id, name, description, icon);
  
  return {
    state: {
      ...state,
      loadouts: [...state.loadouts, loadout],
    },
    loadout,
  };
}

/** Delete a loadout */
export function deleteLoadout(state: LoadoutState, loadoutId: string): LoadoutState {
  return {
    ...state,
    loadouts: state.loadouts.filter(l => l.id !== loadoutId),
    activeLoadoutId: state.activeLoadoutId === loadoutId
      ? state.loadouts.find(l => l.id !== loadoutId)?.id || null
      : state.activeLoadoutId,
  };
}

/** Duplicate a loadout */
export function duplicateLoadout(
  state: LoadoutState,
  sourceLoadoutId: string,
  newName: string
): { state: LoadoutState; loadout: EquipmentLoadout } | null {
  if (state.loadouts.length >= state.maxLoadouts) return null;
  
  const source = state.loadouts.find(l => l.id === sourceLoadoutId);
  if (!source) return null;
  
  const id = `loadout_${Date.now()}`;
  const newLoadout: EquipmentLoadout = {
    ...JSON.parse(JSON.stringify(source)),
    id,
    name: newName,
    isActive: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  return {
    state: {
      ...state,
      loadouts: [...state.loadouts, newLoadout],
    },
    loadout: newLoadout,
  };
}

/** Compare two loadouts stat by stat */
export function compareLoadouts(
  loadoutA: EquipmentLoadout,
  loadoutB: EquipmentLoadout
): { statType: string; valueA: number; valueB: number; isPercent: boolean; winner: 'A' | 'B' | 'tie' }[] {
  const statsA = calculateLoadoutStats(loadoutA);
  const statsB = calculateLoadoutStats(loadoutB);
  
  const allStatTypes = new Set([
    ...statsA.map(s => s.statType),
    ...statsB.map(s => s.statType),
  ]);
  
  const result: { statType: string; valueA: number; valueB: number; isPercent: boolean; winner: 'A' | 'B' | 'tie' }[] = [];
  
  for (const statType of allStatTypes) {
    const a = statsA.find(s => s.statType === statType);
    const b = statsB.find(s => s.statType === statType);
    const valueA = a?.value || 0;
    const valueB = b?.value || 0;
    const isPercent = a?.isPercent || b?.isPercent || false;
    
    result.push({
      statType,
      valueA,
      valueB,
      isPercent,
      winner: valueA > valueB ? 'A' : valueB > valueA ? 'B' : 'tie',
    });
  }
  
  return result;
}

/** Get empty slots in a loadout */
export function getEmptySlots(loadout: EquipmentLoadout): EquipmentSlot[] {
  const allSlots: EquipmentSlot[] = [
    'primaryWeapon', 'secondaryWeapon', 'armorCore',
    'shieldModule', 'engineCore', 'commandModule',
    'utilityBay', 'sensorArray', 'capacitorBank', 'reactorCore',
  ];
  
  return allSlots.filter(slot => !loadout.slots[slot]);
}

/** Get equipped items count */
export function getEquippedCount(loadout: EquipmentLoadout): number {
  return Object.values(loadout.slots).filter(item => item !== null && item !== undefined).length;
}