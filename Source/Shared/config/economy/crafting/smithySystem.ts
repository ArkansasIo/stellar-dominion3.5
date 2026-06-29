/**
 * SMITHY SYSTEM – Tempering, Masterworking, Crafting, Enchanting, Salvaging
 * ============================================================================
 */

import type { EquipmentSlot, StatRarity, EquipmentItem, SubStat, TemperingTier, TemperRecipe } from './equipmentTemperingSystem';
import {
  TEMPERING_TIERS, TEMPERING_TIER_ORDER, MASTERWORK_TIERS, MASTERWORK_MAX_TIER,
  TEMPER_RECIPES, rollSubStat, temperItem, masterworkItem, advanceTemperTier,
  reforgeItem, toggleSubStatLock, calculatePowerScore, canTemper, canMasterwork,
  getTemperCost, getMasterworkCost,
} from './equipmentTemperingSystem';

// ============================================================================
// TYPES
// ============================================================================

export type MaterialType =
  | 'titanium_alloy' | 'crystal_matrix' | 'plasma_core' | 'dark_matter'
  | 'quantum_fiber' | 'neutronium_plate' | 'antimatter_cell' | 'void_crystal'
  | 'stellar_essence' | 'cosmic_dust' | 'photon_fiber' | 'graviton_lens'
  | 'neutrino_shard' | 'plasma_essence' | 'void_essence' | 'stellar_alloy'
  | 'cosmic_alloy' | 'quantum_alloy' | 'dark_alloy' | 'neutronium_alloy';

export type EnchantmentType =
  | 'fire_damage' | 'ice_damage' | 'lightning_damage' | 'void_damage'
  | 'hull_repair' | 'shield_boost' | 'speed_boost' | 'crit_enhance'
  | 'damage_reduction' | 'resource_bonus' | 'research_bonus' | 'build_speed'
  | 'mining_bonus' | 'cargo_bonus' | 'warp_bonus' | 'sensor_boost'
  | 'electronic_warfare' | 'crew_efficiency' | 'capacitor_boost' | 'armor_enhance';

export type CraftingTier = 'basic' | 'advanced' | 'elite' | 'legendary' | 'mythic';

// ============================================================================
// MATERIALS
// ============================================================================

export interface MaterialConfig {
  id: MaterialType;
  name: string;
  description: string;
  icon: string;
  rarity: StatRarity;
  baseValue: number;
  stackLimit: number;
}

export const MATERIALS: MaterialConfig[] = [
  { id: 'titanium_alloy', name: 'Titanium Alloy', description: 'Common structural material.', icon: '🔩', rarity: 'common', baseValue: 10, stackLimit: 9999 },
  { id: 'crystal_matrix', name: 'Crystal Matrix', description: 'Crystalline energy conductor.', icon: '💎', rarity: 'common', baseValue: 15, stackLimit: 9999 },
  { id: 'plasma_core', name: 'Plasma Core', description: 'Concentrated plasma energy.', icon: '🔥', rarity: 'uncommon', baseValue: 25, stackLimit: 9999 },
  { id: 'dark_matter', name: 'Dark Matter', description: 'Exotic matter with unique properties.', icon: '🌑', rarity: 'rare', baseValue: 100, stackLimit: 9999 },
  { id: 'quantum_fiber', name: 'Quantum Fiber', description: 'Ultra-lightweight quantum material.', icon: '🧵', rarity: 'uncommon', baseValue: 30, stackLimit: 9999 },
  { id: 'neutronium_plate', name: 'Neutronium Plate', description: 'Extremely dense armor plating.', icon: '🛡️', rarity: 'rare', baseValue: 150, stackLimit: 9999 },
  { id: 'antimatter_cell', name: 'Antimatter Cell', description: 'High-energy antimatter containment.', icon: '⚡', rarity: 'rare', baseValue: 200, stackLimit: 9999 },
  { id: 'void_crystal', name: 'Void Crystal', description: 'Crystallized void energy.', icon: '🔮', rarity: 'epic', baseValue: 500, stackLimit: 9999 },
  { id: 'stellar_essence', name: 'Stellar Essence', description: 'Essence of a dying star.', icon: '⭐', rarity: 'epic', baseValue: 600, stackLimit: 9999 },
  { id: 'cosmic_dust', name: 'Cosmic Dust', description: 'Fine particles from cosmic events.', icon: '✨', rarity: 'uncommon', baseValue: 20, stackLimit: 9999 },
  { id: 'photon_fiber', name: 'Photon Fiber', description: 'Light-based structural material.', icon: '💡', rarity: 'uncommon', baseValue: 35, stackLimit: 9999 },
  { id: 'graviton_lens', name: 'Graviton Lens', description: 'Gravitational field manipulator.', icon: '🔍', rarity: 'rare', baseValue: 180, stackLimit: 9999 },
  { id: 'neutrino_shard', name: 'Neutrino Shard', description: 'Fragment of neutrino radiation.', icon: '💠', rarity: 'rare', baseValue: 120, stackLimit: 9999 },
  { id: 'plasma_essence', name: 'Plasma Essence', description: 'Concentrated plasma energy.', icon: '🌋', rarity: 'uncommon', baseValue: 40, stackLimit: 9999 },
  { id: 'void_essence', name: 'Void Essence', description: 'Pure void energy.', icon: '🌀', rarity: 'epic', baseValue: 700, stackLimit: 9999 },
  { id: 'stellar_alloy', name: 'Stellar Alloy', description: 'Alloy forged from stellar materials.', icon: '🌟', rarity: 'rare', baseValue: 250, stackLimit: 9999 },
  { id: 'cosmic_alloy', name: 'Cosmic Alloy', description: 'Alloy from cosmic events.', icon: '🌌', rarity: 'epic', baseValue: 800, stackLimit: 9999 },
  { id: 'quantum_alloy', name: 'Quantum Alloy', description: 'Quantum-enhanced alloy.', icon: '⚛️', rarity: 'epic', baseValue: 900, stackLimit: 9999 },
  { id: 'dark_alloy', name: 'Dark Alloy', description: 'Dark matter infused alloy.', icon: '🖤', rarity: 'legendary', baseValue: 2000, stackLimit: 9999 },
  { id: 'neutronium_alloy', name: 'Neutronium Alloy', description: 'Ultra-dense neutronium alloy.', icon: '💎', rarity: 'legendary', baseValue: 2500, stackLimit: 9999 },
];

// ============================================================================
// ENCHANTMENTS
// ============================================================================

export interface EnchantmentConfig {
  id: EnchantmentType;
  name: string;
  description: string;
  icon: string;
  rarity: StatRarity;
  statType: string;
  value: number;
  isPercent: boolean;
  maxStacks: number;
  requiredLevel: number;
  materialCost: { material: MaterialType; amount: number }[];
}

export const ENCHANTMENTS: EnchantmentConfig[] = [
  { id: 'fire_damage', name: 'Fire Damage', description: 'Adds fire damage to weapons.', icon: '🔥', rarity: 'uncommon', statType: 'weaponDamage', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'plasma_core', amount: 5 }] },
  { id: 'ice_damage', name: 'Ice Damage', description: 'Adds ice damage to weapons.', icon: '❄️', rarity: 'uncommon', statType: 'weaponDamage', value: 8, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'crystal_matrix', amount: 5 }] },
  { id: 'lightning_damage', name: 'Lightning Damage', description: 'Adds lightning damage.', icon: '⚡', rarity: 'uncommon', statType: 'weaponDamage', value: 12, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'plasma_core', amount: 5 }] },
  { id: 'void_damage', name: 'Void Damage', description: 'Adds void damage.', icon: '🌑', rarity: 'rare', statType: 'weaponDamage', value: 15, isPercent: true, maxStacks: 3, requiredLevel: 25, materialCost: [{ material: 'void_crystal', amount: 3 }] },
  { id: 'hull_repair', name: 'Hull Repair', description: 'Regenerates hull over time.', icon: '💚', rarity: 'uncommon', statType: 'healthRegen', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'titanium_alloy', amount: 10 }] },
  { id: 'shield_boost', name: 'Shield Boost', description: 'Increases shield capacity.', icon: '🛡️', rarity: 'uncommon', statType: 'shieldHp', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'crystal_matrix', amount: 10 }] },
  { id: 'speed_boost', name: 'Speed Boost', description: 'Increases flight speed.', icon: '🚀', rarity: 'uncommon', statType: 'flightVelocity', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'quantum_fiber', amount: 5 }] },
  { id: 'crit_enhance', name: 'Critical Enhancement', description: 'Increases crit chance.', icon: '🎯', rarity: 'rare', statType: 'weaponCritChance', value: 8, isPercent: true, maxStacks: 3, requiredLevel: 20, materialCost: [{ material: 'dark_matter', amount: 2 }] },
  { id: 'damage_reduction', name: 'Damage Reduction', description: 'Reduces incoming damage.', icon: '🛡️', rarity: 'rare', statType: 'damageReduction', value: 8, isPercent: true, maxStacks: 3, requiredLevel: 20, materialCost: [{ material: 'neutronium_plate', amount: 3 }] },
  { id: 'resource_bonus', name: 'Resource Bonus', description: 'Increases resource yield.', icon: '💰', rarity: 'uncommon', statType: 'resourceBonus', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'cosmic_dust', amount: 10 }] },
  { id: 'research_bonus', name: 'Research Bonus', description: 'Accelerates research speed.', icon: '🔬', rarity: 'uncommon', statType: 'researchSpeed', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'quantum_fiber', amount: 5 }] },
  { id: 'build_speed', name: 'Build Speed', description: 'Increases construction speed.', icon: '🔧', rarity: 'uncommon', statType: 'buildSpeedBonus', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'titanium_alloy', amount: 10 }] },
  { id: 'mining_bonus', name: 'Mining Bonus', description: 'Increases mining yield.', icon: '⛏️', rarity: 'uncommon', statType: 'miningYield', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'cosmic_dust', amount: 10 }] },
  { id: 'cargo_bonus', name: 'Cargo Bonus', description: 'Increases cargo capacity.', icon: '📦', rarity: 'uncommon', statType: 'cargoCapacity', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'titanium_alloy', amount: 10 }] },
  { id: 'warp_bonus', name: 'Warp Bonus', description: 'Increases warp speed.', icon: '🌀', rarity: 'uncommon', statType: 'warpSpeed', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'quantum_fiber', amount: 5 }] },
  { id: 'sensor_boost', name: 'Sensor Boost', description: 'Increases sensor strength.', icon: '📡', rarity: 'uncommon', statType: 'sensorStrength', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'photon_fiber', amount: 5 }] },
  { id: 'electronic_warfare', name: 'Electronic Warfare', description: 'Increases EW strength.', icon: '📻', rarity: 'rare', statType: 'electronicWarfare', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 20, materialCost: [{ material: 'dark_matter', amount: 2 }] },
  { id: 'crew_efficiency', name: 'Crew Efficiency', description: 'Increases crew efficiency.', icon: '👥', rarity: 'uncommon', statType: 'crewEfficiency', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'titanium_alloy', amount: 10 }] },
  { id: 'capacitor_boost', name: 'Capacitor Boost', description: 'Increases capacitor.', icon: '🔋', rarity: 'uncommon', statType: 'capacitorCapacity', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'plasma_core', amount: 5 }] },
  { id: 'armor_enhance', name: 'Armor Enhancement', description: 'Increases armor value.', icon: '🛡️', rarity: 'uncommon', statType: 'armorValue', value: 10, isPercent: true, maxStacks: 3, requiredLevel: 10, materialCost: [{ material: 'titanium_alloy', amount: 10 }] },
];

// ============================================================================
// CRAFTING BLUEPRINTS
// ============================================================================

export interface CraftingBlueprint {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: CraftingTier;
  slot: EquipmentSlot;
  rarity: StatRarity;
  requiredLevel: number;
  requiredSmithyLevel: number;
  materials: { material: MaterialType; amount: number }[];
  craftTime: number;
  successRate: number;
  bonusEffects: { statType: string; value: number; isPercent: boolean }[];
}

export const CRAFTING_BLUEPRINTS: CraftingBlueprint[] = [
  { id: 'bp_basic_laser', name: 'Basic Laser Cannon', description: 'A simple laser weapon.', icon: '🔫', tier: 'basic', slot: 'primaryWeapon', rarity: 'common', requiredLevel: 1, requiredSmithyLevel: 1, materials: [{ material: 'titanium_alloy', amount: 10 }, { material: 'crystal_matrix', amount: 5 }], craftTime: 30, successRate: 1.0, bonusEffects: [{ statType: 'weaponDamage', value: 5, isPercent: true }] },
  { id: 'bp_basic_shield', name: 'Basic Shield Module', description: 'A simple shield generator.', icon: '🛡️', tier: 'basic', slot: 'shieldModule', rarity: 'common', requiredLevel: 1, requiredSmithyLevel: 1, materials: [{ material: 'titanium_alloy', amount: 10 }, { material: 'crystal_matrix', amount: 5 }], craftTime: 30, successRate: 1.0, bonusEffects: [{ statType: 'shieldHp', value: 5, isPercent: true }] },
  { id: 'bp_basic_armor', name: 'Basic Armor Plating', description: 'Simple armor.', icon: '🛡️', tier: 'basic', slot: 'armorCore', rarity: 'common', requiredLevel: 1, requiredSmithyLevel: 1, materials: [{ material: 'titanium_alloy', amount: 15 }], craftTime: 30, successRate: 1.0, bonusEffects: [{ statType: 'armorValue', value: 5, isPercent: true }] },
  { id: 'bp_basic_engine', name: 'Basic Engine', description: 'A simple engine.', icon: '🚀', tier: 'basic', slot: 'engineCore', rarity: 'common', requiredLevel: 1, requiredSmithyLevel: 1, materials: [{ material: 'titanium_alloy', amount: 10 }, { material: 'plasma_core', amount: 3 }], craftTime: 30, successRate: 1.0, bonusEffects: [{ statType: 'flightVelocity', value: 5, isPercent: true }] },
  { id: 'bp_adv_laser', name: 'Advanced Laser Cannon', description: 'Powerful laser weapon.', icon: '🔫', tier: 'advanced', slot: 'primaryWeapon', rarity: 'uncommon', requiredLevel: 25, requiredSmithyLevel: 3, materials: [{ material: 'titanium_alloy', amount: 25 }, { material: 'crystal_matrix', amount: 15 }, { material: 'plasma_core', amount: 5 }], craftTime: 120, successRate: 0.9, bonusEffects: [{ statType: 'weaponDamage', value: 15, isPercent: true }, { statType: 'weaponCritChance', value: 5, isPercent: true }] },
  { id: 'bp_adv_shield', name: 'Advanced Shield Module', description: 'Powerful shield generator.', icon: '🛡️', tier: 'advanced', slot: 'shieldModule', rarity: 'uncommon', requiredLevel: 25, requiredSmithyLevel: 3, materials: [{ material: 'titanium_alloy', amount: 25 }, { material: 'crystal_matrix', amount: 15 }, { material: 'quantum_fiber', amount: 5 }], craftTime: 120, successRate: 0.9, bonusEffects: [{ statType: 'shieldHp', value: 15, isPercent: true }, { statType: 'shieldRecharge', value: 10, isPercent: true }] },
  { id: 'bp_adv_armor', name: 'Advanced Armor Plating', description: 'Powerful armor.', icon: '🛡️', tier: 'advanced', slot: 'armorCore', rarity: 'uncommon', requiredLevel: 25, requiredSmithyLevel: 3, materials: [{ material: 'titanium_alloy', amount: 30 }, { material: 'neutronium_plate', amount: 5 }], craftTime: 120, successRate: 0.9, bonusEffects: [{ statType: 'armorValue', value: 15, isPercent: true }, { statType: 'hullHp', value: 10, isPercent: true }] },
  { id: 'bp_adv_engine', name: 'Advanced Engine', description: 'Powerful engine.', icon: '🚀', tier: 'advanced', slot: 'engineCore', rarity: 'uncommon', requiredLevel: 25, requiredSmithyLevel: 3, materials: [{ material: 'titanium_alloy', amount: 25 }, { material: 'plasma_core', amount: 10 }, { material: 'quantum_fiber', amount: 5 }], craftTime: 120, successRate: 0.9, bonusEffects: [{ statType: 'flightVelocity', value: 15, isPercent: true }, { statType: 'warpSpeed', value: 10, isPercent: true }] },
  { id: 'bp_elite_laser', name: 'Elite Laser Cannon', description: 'Elite laser weapon.', icon: '🔫', tier: 'elite', slot: 'primaryWeapon', rarity: 'rare', requiredLevel: 50, requiredSmithyLevel: 5, materials: [{ material: 'titanium_alloy', amount: 50 }, { material: 'crystal_matrix', amount: 30 }, { material: 'plasma_core', amount: 15 }, { material: 'dark_matter', amount: 5 }], craftTime: 300, successRate: 0.75, bonusEffects: [{ statType: 'weaponDamage', value: 25, isPercent: true }, { statType: 'weaponCritChance', value: 10, isPercent: true }] },
  { id: 'bp_elite_shield', name: 'Elite Shield Module', description: 'Elite shield generator.', icon: '🛡️', tier: 'elite', slot: 'shieldModule', rarity: 'rare', requiredLevel: 50, requiredSmithyLevel: 5, materials: [{ material: 'titanium_alloy', amount: 50 }, { material: 'crystal_matrix', amount: 30 }, { material: 'quantum_fiber', amount: 15 }, { material: 'dark_matter', amount: 5 }], craftTime: 300, successRate: 0.75, bonusEffects: [{ statType: 'shieldHp', value: 25, isPercent: true }, { statType: 'shieldRecharge', value: 20, isPercent: true }] },
  { id: 'bp_legend_laser', name: 'Legendary Laser Cannon', description: 'Legendary laser weapon.', icon: '🔫', tier: 'legendary', slot: 'primaryWeapon', rarity: 'epic', requiredLevel: 100, requiredSmithyLevel: 7, materials: [{ material: 'titanium_alloy', amount: 100 }, { material: 'crystal_matrix', amount: 60 }, { material: 'plasma_core', amount: 30 }, { material: 'dark_matter', amount: 15 }, { material: 'void_crystal', amount: 5 }], craftTime: 600, successRate: 0.5, bonusEffects: [{ statType: 'weaponDamage', value: 40, isPercent: true }, { statType: 'weaponCritChance', value: 15, isPercent: true }, { statType: 'weaponCritDamage', value: 25, isPercent: true }] },
  { id: 'bp_mythic_laser', name: 'Mythic Laser Cannon', description: 'Mythic laser weapon.', icon: '🔫', tier: 'mythic', slot: 'primaryWeapon', rarity: 'mythic', requiredLevel: 200, requiredSmithyLevel: 10, materials: [{ material: 'titanium_alloy', amount: 200 }, { material: 'crystal_matrix', amount: 100 }, { material: 'plasma_core', amount: 50 }, { material: 'dark_matter', amount: 30 }, { material: 'void_crystal', amount: 15 }, { material: 'stellar_essence', amount: 10 }], craftTime: 1200, successRate: 0.25, bonusEffects: [{ statType: 'weaponDamage', value: 60, isPercent: true }, { statType: 'weaponCritChance', value: 20, isPercent: true }, { statType: 'weaponCritDamage', value: 40, isPercent: true }] },
];

// ============================================================================
// SMITHY STATE
// ============================================================================

export interface CraftingJob {
  id: string;
  blueprintId: string;
  startedAt: number;
  completesAt: number;
  status: 'queued' | 'crafting' | 'completed' | 'failed';
  result?: EquipmentItem;
}

export interface SmithyState {
  level: number;
  experience: number;
  materials: Record<MaterialType, number>;
  blueprints: string[];
  craftingQueue: CraftingJob[];
  enchantments: Record<string, EnchantmentType[]>;
  temperHistory: { equipmentId: string; timestamp: number; result: string }[];
  masterworkHistory: { equipmentId: string; timestamp: number; tier: number }[];
  totalCrafted: number;
  totalTempered: number;
  totalMasterworked: number;
  totalSalvaged: number;
  totalReforged: number;
  smithyStats: { craftingSuccess: number; craftingFail: number; temperSuccess: number; masterworkSuccess: number; salvageTotal: number };
}

export function getDefaultSmithyState(): SmithyState {
  const materials: Record<MaterialType, number> = {} as any;
  for (const m of MATERIALS) materials[m.id] = 0;
  return {
    level: 1, experience: 0, materials,
    blueprints: ['bp_basic_laser', 'bp_basic_shield', 'bp_basic_armor', 'bp_basic_engine'],
    craftingQueue: [], enchantments: {}, temperHistory: [], masterworkHistory: [],
    totalCrafted: 0, totalTempered: 0, totalMasterworked: 0, totalSalvaged: 0, totalReforged: 0,
    smithyStats: { craftingSuccess: 0, craftingFail: 0, temperSuccess: 0, masterworkSuccess: 0, salvageTotal: 0 },
  };
}

// ============================================================================
// GAME LOGIC
// ============================================================================

export function calculateSmithyLevel(experience: number): number {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

export function experienceForNextLevel(level: number): number {
  return (level * level) * 100;
}

export function calculateTemperCost(rarity: StatRarity, temperCount: number) {
  const base: Record<StatRarity, number> = { common: 100, uncommon: 250, rare: 500, epic: 1000, legendary: 2500, mythic: 5000 };
  const mult = 1 + temperCount * 0.2;
  const v = Math.floor(base[rarity] * mult);
  return { metal: v, crystal: Math.floor(v * 0.5), deuterium: Math.floor(v * 0.25) };
}

export function calculateMasterworkCost(currentTier: number, rarity: StatRarity) {
  const base: Record<StatRarity, number> = { common: 200, uncommon: 500, rare: 1000, epic: 2500, legendary: 5000, mythic: 10000 };
  const mult = 1 + currentTier * 0.5;
  const v = Math.floor(base[rarity] * mult);
  return { metal: v, crystal: Math.floor(v * 0.5), deuterium: Math.floor(v * 0.25), special: 'dark_matter' as MaterialType, specialAmount: Math.floor(3 * mult) };
}

export function calculateSalvageYield(equipment: EquipmentItem) {
  const mult: Record<StatRarity, number> = { common: 1, uncommon: 2, rare: 4, epic: 8, legendary: 16, mythic: 32 };
  const m = mult[equipment.rarity];
  const materials: { material: MaterialType; amount: number }[] = [
    { material: 'titanium_alloy', amount: Math.floor(5 * m) },
    { material: 'crystal_matrix', amount: Math.floor(5 * m) },
  ];
  if (['rare', 'epic', 'legendary', 'mythic'].includes(equipment.rarity)) materials.push({ material: 'dark_matter', amount: Math.floor(2 * m) });
  if (['epic', 'legendary', 'mythic'].includes(equipment.rarity)) materials.push({ material: 'void_crystal', amount: Math.floor(1 * m) });
  return { materials, credits: Math.floor(100 * m * (1 + equipment.masterworkTier * 0.1)) };
}

export function processTemper(
  state: SmithyState,
  equipment: EquipmentItem,
  selectedSubStatIndex: number,
  recipeId?: string
): { success: boolean; newState: SmithyState; newEquipment?: EquipmentItem; message: string } {
  const recipe = recipeId ? TEMPER_RECIPES.find(r => r.id === recipeId) : undefined;
  const cost = recipe
    ? { metal: recipe.materials.find(m => m.material === 'titanium_alloy')?.amount || 0,
        crystal: recipe.materials.find(m => m.material === 'crystal_matrix')?.amount || 0,
        deuterium: recipe.materials.find(m => m.material === 'plasma_core')?.amount || 0 }
    : calculateTemperCost(equipment.rarity, equipment.temperCount);

  if (state.materials.titanium_alloy < cost.metal) return { success: false, newState: state, message: 'Insufficient titanium alloy' };
  if (state.materials.crystal_matrix < cost.crystal) return { success: false, newState: state, message: 'Insufficient crystal matrix' };

  const newState = { ...state, materials: { ...state.materials } };
  newState.materials.titanium_alloy -= cost.metal;
  newState.materials.crystal_matrix -= cost.crystal;
  newState.materials.plasma_core -= cost.deuterium;

  const tierConfig = TEMPERING_TIERS[equipment.temperTier];
  const successRoll = Math.random();
  const successChance = tierConfig.successRate + (recipe?.successRateBonus || 0);

  if (successRoll > successChance) {
    newState.experience += 5;
    return { success: false, newState, message: 'Tempering attempt failed! Equipment unchanged.' };
  }

  const lockedIds = equipment.subStats.filter(s => s.isLocked).map(s => s.id);
  const newEquipment = temperItem(equipment, selectedSubStatIndex < 0, lockedIds, recipe);

  newState.totalTempered += 1;
  newState.experience += 10;
  newState.temperHistory = [...state.temperHistory, {
    equipmentId: equipment.id, timestamp: Date.now(), result: recipe ? `tempered (${recipe.name})` : 'tempered',
  }];
  return { success: true, newState, newEquipment, message: 'Equipment tempered successfully' };
}

export function processMasterwork(state: SmithyState, equipment: EquipmentItem): { success: boolean; newState: SmithyState; newEquipment?: EquipmentItem; message: string } {
  if (equipment.masterworkTier >= MASTERWORK_MAX_TIER) return { success: false, newState: state, message: 'Maximum masterwork tier reached' };

  const nextTierConfig = MASTERWORK_TIERS[equipment.masterworkTier + 1];
  const cost = calculateMasterworkCost(equipment.masterworkTier, equipment.rarity);

  if (state.materials.titanium_alloy < cost.metal) return { success: false, newState: state, message: 'Insufficient materials' };

  const newState = { ...state, materials: { ...state.materials } };
  newState.materials.titanium_alloy -= cost.metal;
  newState.materials.crystal_matrix -= cost.crystal;
  newState.materials.plasma_core -= cost.deuterium;
  newState.materials.dark_matter = (newState.materials.dark_matter || 0) - cost.specialAmount;

  const successRoll = Math.random();
  if (successRoll < nextTierConfig.successRate) {
    const newEquipment = masterworkItem(equipment);
    newState.totalMasterworked += 1;
    newState.experience += 50 + equipment.masterworkTier * 10;
    newState.masterworkHistory = [...state.masterworkHistory, {
      equipmentId: equipment.id, timestamp: Date.now(), tier: newEquipment.masterworkTier,
    }];
    const bonusText = nextTierConfig.bonusEffect ? ` — ${nextTierConfig.bonusEffect}` : '';
    return { success: true, newState, newEquipment, message: `Masterwork: ${nextTierConfig.name} (+${newEquipment.masterworkTier})${bonusText}` };
  }

  newState.experience += 15;
  return { success: false, newState, message: `Masterwork attempt to +${equipment.masterworkTier + 1} failed! Materials consumed.` };
}

export function processSalvage(state: SmithyState, equipment: EquipmentItem): { success: boolean; newState: SmithyState; credits: number; materials: { material: MaterialType; amount: number }[] } {
  const yield_ = calculateSalvageYield(equipment);
  const newState = { ...state, materials: { ...state.materials } };
  for (const m of yield_.materials) {
    newState.materials[m.material] = (newState.materials[m.material] || 0) + m.amount;
  }
  newState.totalSalvaged += 1;
  newState.experience += 5;
  return { success: true, newState, credits: yield_.credits, materials: yield_.materials };
}

export function processEnchant(state: SmithyState, equipmentId: string, enchantmentId: EnchantmentType): { success: boolean; newState: SmithyState; message: string } {
  const enchConfig = ENCHANTMENTS.find(e => e.id === enchantmentId);
  if (!enchConfig) return { success: false, newState: state, message: 'Invalid enchantment' };
  const currentEnchs = state.enchantments[equipmentId] || [];
  if (currentEnchs.filter(e => e === enchantmentId).length >= enchConfig.maxStacks) return { success: false, newState: state, message: 'Max stacks reached' };
  const newState = { ...state, materials: { ...state.materials } };
  for (const cost of enchConfig.materialCost) {
    if ((newState.materials[cost.material] || 0) < cost.amount) return { success: false, newState, message: `Insufficient ${cost.material}` };
    newState.materials[cost.material] -= cost.amount;
  }
  newState.enchantments = { ...state.enchantments, [equipmentId]: [...currentEnchs, enchantmentId] };
  newState.experience += 15;
  return { success: true, newState, message: `Enchantment ${enchConfig.name} applied` };
}

export function processLearnBlueprint(state: SmithyState, blueprintId: string, costCredits: number): { success: boolean; newState: SmithyState; message: string } {
  if (state.blueprints.includes(blueprintId)) return { success: false, newState: state, message: 'Blueprint already learned' };
  const bp = CRAFTING_BLUEPRINTS.find(b => b.id === blueprintId);
  if (!bp) return { success: false, newState: state, message: 'Invalid blueprint' };
  if (state.level < bp.requiredSmithyLevel) return { success: false, newState: state, message: `Requires smithy level ${bp.requiredSmithyLevel}` };
  const newState = { ...state, blueprints: [...state.blueprints, blueprintId] };
  return { success: true, newState, message: `Blueprint ${bp.name} learned` };
}

// ============================================================================
// ENHANCED TEMPERING FUNCTIONS
// ============================================================================

/** Advance tempering tier */
export function processAdvanceTemperTier(
  state: SmithyState,
  equipment: EquipmentItem,
  recipeId?: string
): { success: boolean; newState: SmithyState; newEquipment?: EquipmentItem; message: string } {
  const check = canTemper(state.level, equipment);
  if (!check.canTemper) return { success: false, newState: state, message: check.reason! };

  const recipe = recipeId ? TEMPER_RECIPES.find(r => r.id === recipeId) : undefined;
  const tierConfig = TEMPERING_TIERS[equipment.temperTier];
  const nextTierIndex = TEMPERING_TIER_ORDER.indexOf(equipment.temperTier) + 1;
  const nextTier = TEMPERING_TIER_ORDER[nextTierIndex];
  const nextTierConfig = TEMPERING_TIERS[nextTier];

  if (recipe && recipe.targetTier !== nextTier) {
    return { success: false, newState: state, message: `Recipe is for ${recipe.targetTier}, not ${nextTier}` };
  }

  const cost = recipe
    ? recipe.materials.reduce((acc, m) => {
        if (m.material === 'titanium_alloy') acc.metal = m.amount;
        if (m.material === 'crystal_matrix') acc.crystal = m.amount;
        if (m.material === 'plasma_core') acc.deuterium = m.amount;
        return acc;
      }, { metal: 0, crystal: 0, deuterium: 0 })
    : nextTierConfig.materials.reduce((acc, m) => {
        if (m.material === 'titanium_alloy') acc.metal = m.amount;
        if (m.material === 'crystal_matrix') acc.crystal = m.amount;
        if (m.material === 'plasma_core') acc.deuterium = m.amount;
        return acc;
      }, { metal: 0, crystal: 0, deuterium: 0 });

  if (state.materials.titanium_alloy < cost.metal) return { success: false, newState: state, message: 'Insufficient titanium alloy' };
  if (state.materials.crystal_matrix < cost.crystal) return { success: false, newState: state, message: 'Insufficient crystal matrix' };

  const newState = { ...state, materials: { ...state.materials } };
  newState.materials.titanium_alloy -= cost.metal;
  newState.materials.crystal_matrix -= cost.crystal;
  newState.materials.plasma_core -= cost.deuterium;

  const successRoll = Math.random();
  const successChance = nextTierConfig.successRate + (recipe?.successRateBonus || 0);

  if (successRoll > successChance) {
    newState.experience += 10;
    return { success: false, newState, message: `Tempering advancement to ${nextTierConfig.name} failed! Materials consumed.` };
  }

  const newEquipment = advanceTemperTier(equipment);
  newState.totalTempered += 1;
  newState.experience += 30;
  newState.temperHistory = [...state.temperHistory, {
    equipmentId: equipment.id, timestamp: Date.now(),
    result: `advanced to ${nextTierConfig.name}`,
  }];
  return { success: true, newState, newEquipment, message: `Equipment tempered to ${nextTierConfig.name}!` };
}

/** Reforge equipment to base state */
export function processReforge(
  state: SmithyState,
  equipment: EquipmentItem
): { success: boolean; newState: SmithyState; newEquipment?: EquipmentItem; message: string } {
  const darkMatterCost = equipment.rarity === 'mythic' ? 20 : equipment.rarity === 'legendary' ? 10 : 5;
  if ((state.materials.dark_matter || 0) < darkMatterCost) {
    return { success: false, newState: state, message: `Requires ${darkMatterCost} Dark Matter to reforge` };
  }

  const newState = { ...state, materials: { ...state.materials } };
  newState.materials.dark_matter -= darkMatterCost;

  const newEquipment = reforgeItem(equipment);
  newState.totalReforged += 1;
  newState.experience += 25;
  newState.temperHistory = [...state.temperHistory, {
    equipmentId: equipment.id, timestamp: Date.now(), result: 'reforged',
  }];
  return { success: true, newState, newEquipment, message: 'Equipment reforged to base state!' };
}

/** Toggle sub-stat lock */
export function processToggleLock(
  state: SmithyState,
  equipment: EquipmentItem,
  subStatIndex: number
): { success: boolean; newState: SmithyState; newEquipment?: EquipmentItem; message: string } {
  const tierConfig = TEMPERING_TIERS[equipment.temperTier];
  const sub = equipment.subStats[subStatIndex];
  if (!sub) return { success: false, newState: state, message: 'Invalid sub-stat index' };

  if (!sub.isLocked) {
    const lockedCount = equipment.subStats.filter(s => s.isLocked).length;
    if (lockedCount >= tierConfig.maxLocks) {
      return { success: false, newState: state, message: `Maximum ${tierConfig.maxLocks} locks at ${tierConfig.name} tier` };
    }

    const lockCost = 200 * equipment.level;
    if (state.materials.dark_matter < 1) {
      return { success: false, newState: state, message: 'Requires 1 Dark Matter to lock a sub-stat' };
    }
    const newState = { ...state, materials: { ...state.materials } };
    newState.materials.dark_matter -= 1;
    const newEquipment = toggleSubStatLock(equipment, subStatIndex);
    return { success: true, newState, newEquipment, message: `Locked ${sub.name}` };
  }

  const newEquipment = toggleSubStatLock(equipment, subStatIndex);
  return { success: true, newState: state, newEquipment, message: `Unlocked ${sub.name}` };
}