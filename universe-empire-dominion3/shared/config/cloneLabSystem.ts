/**
 * Clone Lab System — Research, Upgrade, Equipment & Vault for Operators/Units
 *
 * Subsystems:
 *   1. Clone Lab Facility — tiers, slots, capacity
 *   2. Clone Research Tree — research branches for cloning
 *   3. Clone Subject Catalog — what can be cloned (operators + unit families)
 *   4. Stat Progression — levels, XP, main-stats, sub-stats
 *   5. Equipment — slots, item definitions, set bonuses
 *   6. Inventory & Vault — material storage, gear vault, bank
 *
 * @tag #clone #lab #research #operators #units #equipment #vault #bank
 */

// ============================================================================
// 1. CLONE LAB FACILITY
// ============================================================================

export type CloneLabTier = 'basic' | 'advanced' | 'superior' | 'elite' | 'prime' | 'apex';
export type CloneSpecialization = 'operator' | 'infantry' | 'vehicle' | 'starship' | 'hybrid';

export interface CloneLabConfig {
  id: string;
  name: string;
  tier: CloneLabTier;
  level: number;
  specialization: CloneSpecialization;

  // Capacity
  maxCloneSlots: number;
  activeResearchSlots: number;
  parallelProjects: number;

  // Research Performance
  researchSpeed: number;
  successRate: number;
  materialEfficiency: number;
  qualityBonus: number;

  // Cost
  upgradeCost: { metal: number; crystal: number; deuterium: number; energy: number };
  maintenancePerTurn: number;

  // Special
  unlockClonedAbilities: boolean;
  unlockSetEquipment: boolean;
  unlockVaultIntegration: boolean;
  canDualSpecialize: boolean;
}

export const CLONE_LAB_TIERS: Record<CloneLabTier, CloneLabConfig> = {
  basic: {
    id: 'clone-lab-basic',
    name: 'Basic Cloning Facility',
    tier: 'basic',
    level: 1,
    specialization: 'operator',
    maxCloneSlots: 2,
    activeResearchSlots: 1,
    parallelProjects: 1,
    researchSpeed: 1.0,
    successRate: 0.8,
    materialEfficiency: 1.0,
    qualityBonus: 0,
    upgradeCost: { metal: 5000, crystal: 3000, deuterium: 1000, energy: 100 },
    maintenancePerTurn: 10,
    unlockClonedAbilities: false,
    unlockSetEquipment: false,
    unlockVaultIntegration: false,
    canDualSpecialize: false,
  },
  advanced: {
    id: 'clone-lab-advanced',
    name: 'Advanced Cloning Facility',
    tier: 'advanced',
    level: 2,
    specialization: 'operator',
    maxCloneSlots: 4,
    activeResearchSlots: 2,
    parallelProjects: 1,
    researchSpeed: 1.25,
    successRate: 0.85,
    materialEfficiency: 1.1,
    qualityBonus: 0.05,
    upgradeCost: { metal: 25000, crystal: 15000, deuterium: 5000, energy: 250 },
    maintenancePerTurn: 25,
    unlockClonedAbilities: true,
    unlockSetEquipment: false,
    unlockVaultIntegration: false,
    canDualSpecialize: false,
  },
  superior: {
    id: 'clone-lab-superior',
    name: 'Superior Cloning Facility',
    tier: 'superior',
    level: 3,
    specialization: 'operator',
    maxCloneSlots: 6,
    activeResearchSlots: 3,
    parallelProjects: 2,
    researchSpeed: 1.5,
    successRate: 0.9,
    materialEfficiency: 1.2,
    qualityBonus: 0.1,
    upgradeCost: { metal: 100000, crystal: 60000, deuterium: 20000, energy: 500 },
    maintenancePerTurn: 50,
    unlockClonedAbilities: true,
    unlockSetEquipment: true,
    unlockVaultIntegration: false,
    canDualSpecialize: false,
  },
  elite: {
    id: 'clone-lab-elite',
    name: 'Elite Cloning Facility',
    tier: 'elite',
    level: 4,
    specialization: 'hybrid',
    maxCloneSlots: 8,
    activeResearchSlots: 4,
    parallelProjects: 2,
    researchSpeed: 1.75,
    successRate: 0.93,
    materialEfficiency: 1.35,
    qualityBonus: 0.15,
    upgradeCost: { metal: 500000, crystal: 300000, deuterium: 100000, energy: 1000 },
    maintenancePerTurn: 100,
    unlockClonedAbilities: true,
    unlockSetEquipment: true,
    unlockVaultIntegration: true,
    canDualSpecialize: false,
  },
  prime: {
    id: 'clone-lab-prime',
    name: 'Prime Cloning Facility',
    tier: 'prime',
    level: 5,
    specialization: 'hybrid',
    maxCloneSlots: 12,
    activeResearchSlots: 5,
    parallelProjects: 3,
    researchSpeed: 2.0,
    successRate: 0.96,
    materialEfficiency: 1.5,
    qualityBonus: 0.2,
    upgradeCost: { metal: 2000000, crystal: 1200000, deuterium: 400000, energy: 2500 },
    maintenancePerTurn: 250,
    unlockClonedAbilities: true,
    unlockSetEquipment: true,
    unlockVaultIntegration: true,
    canDualSpecialize: true,
  },
  apex: {
    id: 'clone-lab-apex',
    name: 'Apex Cloning Facility',
    tier: 'apex',
    level: 6,
    specialization: 'hybrid',
    maxCloneSlots: 20,
    activeResearchSlots: 6,
    parallelProjects: 4,
    researchSpeed: 2.5,
    successRate: 0.99,
    materialEfficiency: 2.0,
    qualityBonus: 0.3,
    upgradeCost: { metal: 10000000, crystal: 6000000, deuterium: 2000000, energy: 10000 },
    maintenancePerTurn: 500,
    unlockClonedAbilities: true,
    unlockSetEquipment: true,
    unlockVaultIntegration: true,
    canDualSpecialize: true,
  },
};

// ============================================================================
// 2. CLONE RESEARCH TREE
// ============================================================================

export type CloneResearchBranch =
  | 'genetic_stability'   // Success rate, quality
  | 'growth_acceleration' // Speed, efficiency
  | 'stat_optimization'   // Stat cap, sub-stat rolls
  | 'equipment_integration' // Gear slots, set bonuses
  | 'vault_sync'          // Storage, transfer rates
  | 'specialization'      // Unlock new clone types
  | 'hybrid_engineering'; // Cross-breeding, dual-spec

export interface CloneResearchNode {
  id: string;
  name: string;
  description: string;
  branch: CloneResearchBranch;
  level: number;
  maxLevel: number;
  costPerLevel: { credits: number; cloneMaterial: string; amount: number };
  effectPerLevel: Record<string, number>;
  prerequisites: string[];
  unlocksTier?: CloneLabTier;
}

export const CLONE_RESEARCH_TREE: CloneResearchNode[] = [
  // ── Genetic Stability ──────────────────────────────────────────────────────
  {
    id: 'clone-gen-stab-1',
    name: 'Genetic Template Stabilization',
    description: 'Improves clone genetic fidelity, increasing success rate and base quality.',
    branch: 'genetic_stability',
    level: 0,
    maxLevel: 10,
    costPerLevel: { credits: 5000, cloneMaterial: 'genetic_sample', amount: 2 },
    effectPerLevel: { successRate: 0.02, qualityBonus: 0.01 },
    prerequisites: [],
  },
  {
    id: 'clone-gen-stab-2',
    name: 'Advanced Gene Sequencing',
    description: 'Enables precise gene editing for superior clone stat rolls.',
    branch: 'genetic_stability',
    level: 0,
    maxLevel: 8,
    costPerLevel: { credits: 15000, cloneMaterial: 'genetic_sample', amount: 5 },
    effectPerLevel: { minStatRoll: 0.03, maxStatRoll: 0.02 },
    prerequisites: ['clone-gen-stab-1'],
  },
  {
    id: 'clone-gen-stab-3',
    name: 'Quantum Gene Encoding',
    description: 'Quantum-level genetic encoding eliminates degradation across generations.',
    branch: 'genetic_stability',
    level: 0,
    maxLevel: 5,
    costPerLevel: { credits: 75000, cloneMaterial: 'quantum_gene', amount: 3 },
    effectPerLevel: { degradationResist: 0.1, maxSubStats: 1 },
    prerequisites: ['clone-gen-stab-2'],
  },

  // ── Growth Acceleration ────────────────────────────────────────────────────
  {
    id: 'clone-growth-1',
    name: 'Accelerated Cell Division',
    description: 'Speeds up clone maturation, reducing research and training time.',
    branch: 'growth_acceleration',
    level: 0,
    maxLevel: 10,
    costPerLevel: { credits: 3000, cloneMaterial: 'growth_hormone', amount: 3 },
    effectPerLevel: { researchSpeed: 0.05, trainingTime: -0.05 },
    prerequisites: [],
  },
  {
    id: 'clone-growth-2',
    name: 'Nutrient Bath Optimization',
    description: 'Optimized growth medium reduces material costs for all cloning.',
    branch: 'growth_acceleration',
    level: 0,
    maxLevel: 8,
    costPerLevel: { credits: 10000, cloneMaterial: 'growth_hormone', amount: 5 },
    effectPerLevel: { materialCost: -0.03, energyCost: -0.03 },
    prerequisites: ['clone-growth-1'],
  },
  {
    id: 'clone-growth-3',
    name: 'Temporal Acceleration Chamber',
    description: 'Time-dilated growth chambers enable near-instant clone maturation.',
    branch: 'growth_acceleration',
    level: 0,
    maxLevel: 3,
    costPerLevel: { credits: 200000, cloneMaterial: 'temporal_catalyst', amount: 2 },
    effectPerLevel: { researchSpeed: 0.25, parallelProjects: 1 },
    prerequisites: ['clone-growth-2'],
  },

  // ── Stat Optimization ──────────────────────────────────────────────────────
  {
    id: 'clone-stat-1',
    name: 'Stat Cap Enhancement',
    description: 'Increases maximum achievable stats for cloned operators and units.',
    branch: 'stat_optimization',
    level: 0,
    maxLevel: 10,
    costPerLevel: { credits: 8000, cloneMaterial: 'neural_pattern', amount: 2 },
    effectPerLevel: { statCapBonus: 2, subStatCapBonus: 1 },
    prerequisites: [],
  },
  {
    id: 'clone-stat-2',
    name: 'Sub-Stat Roll Optimization',
    description: 'Improves sub-stat roll quality, guaranteeing minimum thresholds.',
    branch: 'stat_optimization',
    level: 0,
    maxLevel: 8,
    costPerLevel: { credits: 20000, cloneMaterial: 'neural_pattern', amount: 4 },
    effectPerLevel: { subStatFloor: 0.04, subStatCeiling: 0.03 },
    prerequisites: ['clone-stat-1'],
  },
  {
    id: 'clone-stat-3',
    name: 'Omega Stat Integration',
    description: 'Unlocks omega-tier sub-stats with unique bonus effects.',
    branch: 'stat_optimization',
    level: 0,
    maxLevel: 5,
    costPerLevel: { credits: 100000, cloneMaterial: 'omega_pattern', amount: 2 },
    effectPerLevel: { omegaSubStats: 1, uniqueBonusChance: 0.02 },
    prerequisites: ['clone-stat-2'],
  },

  // ── Equipment Integration ──────────────────────────────────────────────────
  {
    id: 'clone-equip-1',
    name: 'Implant Interface Ports',
    description: 'Enables cloned operators to use equipment implants and gear.',
    branch: 'equipment_integration',
    level: 0,
    maxLevel: 1,
    costPerLevel: { credits: 15000, cloneMaterial: 'cybernetic_parts', amount: 10 },
    effectPerLevel: { equipmentSlots: 2 },
    prerequisites: [],
  },
  {
    id: 'clone-equip-2',
    name: 'Expanded Equipment Slots',
    description: 'Increases the number of equipment slots available to clones.',
    branch: 'equipment_integration',
    level: 0,
    maxLevel: 5,
    costPerLevel: { credits: 25000, cloneMaterial: 'cybernetic_parts', amount: 5 },
    effectPerLevel: { equipmentSlots: 1 },
    prerequisites: ['clone-equip-1'],
  },
  {
    id: 'clone-equip-3',
    name: 'Set Equipment Synergy',
    description: 'Unlocks set bonuses when clones wear matching equipment sets.',
    branch: 'equipment_integration',
    level: 0,
    maxLevel: 5,
    costPerLevel: { credits: 50000, cloneMaterial: 'cybernetic_parts', amount: 8 },
    effectPerLevel: { setBonusEffectiveness: 0.1, setBonusPieces: -1 },
    prerequisites: ['clone-equip-2'],
  },

  // ── Vault Sync ─────────────────────────────────────────────────────────────
  {
    id: 'clone-vault-1',
    name: 'Material Vault Link',
    description: 'Links clone lab to empire vault for streamlined material access.',
    branch: 'vault_sync',
    level: 0,
    maxLevel: 1,
    costPerLevel: { credits: 10000, cloneMaterial: 'data_core', amount: 5 },
    effectPerLevel: { vaultAccess: 1 },
    prerequisites: [],
  },
  {
    id: 'clone-vault-2',
    name: 'Automated Material Transfer',
    description: 'Enables automatic material transfers between vault and clone lab.',
    branch: 'vault_sync',
    level: 0,
    maxLevel: 3,
    costPerLevel: { credits: 30000, cloneMaterial: 'data_core', amount: 8 },
    effectPerLevel: { transferSpeed: 0.25, transferCost: -0.1 },
    prerequisites: ['clone-vault-1'],
  },
  {
    id: 'clone-vault-3',
    name: 'Distributed Clone Storage',
    description: 'Allows storing excess clones and equipment in vault securely.',
    branch: 'vault_sync',
    level: 0,
    maxLevel: 5,
    costPerLevel: { credits: 60000, cloneMaterial: 'data_core', amount: 10 },
    effectPerLevel: { vaultCloneSlots: 2, vaultEquipSlots: 3 },
    prerequisites: ['clone-vault-2'],
  },

  // ── Specialization ─────────────────────────────────────────────────────────
  {
    id: 'clone-spec-1',
    name: 'Unit Cloning Protocols',
    description: 'Extends cloning capabilities to infantry-class units.',
    branch: 'specialization',
    level: 0,
    maxLevel: 1,
    costPerLevel: { credits: 20000, cloneMaterial: 'military_protocol', amount: 5 },
    effectPerLevel: { unlockUnitType: 1 },
    prerequisites: [],
  },
  {
    id: 'clone-spec-2',
    name: 'Vehicle Cloning Matrix',
    description: 'Extends cloning capabilities to vehicle-class units.',
    branch: 'specialization',
    level: 0,
    maxLevel: 1,
    costPerLevel: { credits: 40000, cloneMaterial: 'military_protocol', amount: 8 },
    effectPerLevel: { unlockUnitType: 1 },
    prerequisites: ['clone-spec-1'],
  },
  {
    id: 'clone-spec-3',
    name: 'Starship Cloning Bay',
    description: 'Massive cloning bays capable of producing starship crew clones.',
    branch: 'specialization',
    level: 0,
    maxLevel: 1,
    costPerLevel: { credits: 80000, cloneMaterial: 'military_protocol', amount: 12 },
    effectPerLevel: { unlockUnitType: 1 },
    prerequisites: ['clone-spec-2'],
  },
  {
    id: 'clone-spec-4',
    name: 'Hybrid Clone Engineering',
    description: 'Enables cross-specialization cloning — operator-infantry hybrids.',
    branch: 'specialization',
    level: 0,
    maxLevel: 3,
    costPerLevel: { credits: 150000, cloneMaterial: 'hybrid_serum', amount: 5 },
    effectPerLevel: { hybridSlots: 1, crossSpecBonus: 0.05 },
    prerequisites: ['clone-spec-3'],
  },

  // ── Hybrid Engineering ─────────────────────────────────────────────────────
  {
    id: 'clone-hybrid-1',
    name: 'Gene Splicing Protocols',
    description: 'Allows combining traits from multiple templates into hybrid clones.',
    branch: 'hybrid_engineering',
    level: 0,
    maxLevel: 5,
    costPerLevel: { credits: 50000, cloneMaterial: 'hybrid_serum', amount: 3 },
    effectPerLevel: { traitCapacity: 1, hybridQuality: 0.04 },
    prerequisites: ['clone-spec-4'],
  },
  {
    id: 'clone-hybrid-2',
    name: 'Quantum Trait Resonance',
    description: 'Hybrid clones gain resonance bonuses when traits synergize.',
    branch: 'hybrid_engineering',
    level: 0,
    maxLevel: 3,
    costPerLevel: { credits: 120000, cloneMaterial: 'quantum_gene', amount: 4 },
    effectPerLevel: { resonanceChance: 0.05, resonanceMultiplier: 0.1 },
    prerequisites: ['clone-hybrid-1'],
  },
  {
    id: 'clone-hybrid-3',
    name: 'Perfect Hybrid Formula',
    description: 'Eliminates degradation in hybrid clones, making them permanent.',
    branch: 'hybrid_engineering',
    level: 0,
    maxLevel: 1,
    costPerLevel: { credits: 500000, cloneMaterial: 'omega_pattern', amount: 10 },
    effectPerLevel: { permanentHybrid: 1 },
    prerequisites: ['clone-hybrid-2'],
  },
];

// ============================================================================
// 3. CLONE SUBJECT CATALOG
// ============================================================================

export type CloneSubjectType =
  | 'operator'        // From empireOperatorsConfig
  | 'infantry_unit'
  | 'vehicle_unit'
  | 'starship_crew'
  | 'hybrid';
export type CloneRank = 'alpha' | 'beta' | 'gamma' | 'delta' | 'omega';
export type CloneQuality = 'flawed' | 'standard' | 'superior' | 'prime' | 'perfect';

export interface CloneSubject {
  id: string;
  sourceId: string;               // Reference to operator/unit ID
  name: string;
  subjectType: CloneSubjectType;

  // Clone identity
  cloneGeneration: number;
  rank: CloneRank;
  quality: CloneQuality;

  // Level & XP
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;

  // Stats
  baseStats: Record<string, number>;
  bonusStats: Record<string, number>;
  subStats: CloneSubStat[];

  // Progression
  evolutionRank: number;
  maxEvolution: number;
  totalClonesMerged: number;

  // Equipment
  equipmentSlots: number;
  equippedItems: string[];

  // Flags
  isActive: boolean;
  isDeployed: boolean;
  isInVault: boolean;
  deployedLocation?: string;
}

export interface CloneSubStat {
  id: string;
  name: string;
  statType: string;
  value: number;
  isPercent: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'omega';
  rollQuality: number;
  isLocked: boolean;
  source: 'innate' | 'level_up' | 'equipment' | 'research' | 'evolution';
}

export interface CloneTemplate {
  id: string;
  name: string;
  subjectType: CloneSubjectType;
  baseStats: Record<string, number>;
  possibleSubStats: string[];
  maxLevel: number;
  maxEvolution: number;
  equipmentCap: number;
  materialsRequired: { material: string; amount: number }[];
  buildTime: number;
  unlockResearchId: string;
}

export const CLONE_TEMPLATES: CloneTemplate[] = [
  {
    id: 'template-op-general',
    name: 'General Operator Clone',
    subjectType: 'operator',
    baseStats: { command: 3, tactics: 3, engineering: 3, science: 3, diplomacy: 3, logistics: 3, stealth: 3, combat: 3, production: 3 },
    possibleSubStats: ['command_boost', 'tactics_boost', 'engineering_boost', 'science_boost', 'diplomacy_boost', 'logistics_boost', 'stealth_boost', 'combat_boost', 'production_boost'],
    maxLevel: 50,
    maxEvolution: 5,
    equipmentCap: 2,
    materialsRequired: [{ material: 'genetic_sample', amount: 10 }, { material: 'neural_pattern', amount: 5 }],
    buildTime: 6,
    unlockResearchId: '',
  },
  {
    id: 'template-op-combat',
    name: 'Combat Operator Clone',
    subjectType: 'operator',
    baseStats: { command: 6, tactics: 5, engineering: 2, science: 1, diplomacy: 1, logistics: 3, stealth: 4, combat: 7, production: 2 },
    possibleSubStats: ['attack_power', 'crit_chance', 'crit_damage', 'armor_pen', 'combat_speed', 'command_aura_bonus', 'tactical_mastery'],
    maxLevel: 60,
    maxEvolution: 6,
    equipmentCap: 3,
    materialsRequired: [{ material: 'genetic_sample', amount: 15 }, { material: 'neural_pattern', amount: 8 }, { material: 'military_protocol', amount: 3 }],
    buildTime: 8,
    unlockResearchId: 'clone-spec-1',
  },
  {
    id: 'template-op-science',
    name: 'Science Operator Clone',
    subjectType: 'operator',
    baseStats: { command: 2, tactics: 2, engineering: 5, science: 8, diplomacy: 3, logistics: 4, stealth: 1, combat: 1, production: 5 },
    possibleSubStats: ['research_speed', 'discovery_chance', 'tech_analysis', 'experimental_success', 'data_processing', 'innovation_bonus'],
    maxLevel: 55,
    maxEvolution: 5,
    equipmentCap: 2,
    materialsRequired: [{ material: 'genetic_sample', amount: 12 }, { material: 'neural_pattern', amount: 10 }, { material: 'data_core', amount: 5 }],
    buildTime: 7,
    unlockResearchId: 'clone-spec-1',
  },
  {
    id: 'template-op-logistics',
    name: 'Logistics Operator Clone',
    subjectType: 'operator',
    baseStats: { command: 3, tactics: 2, engineering: 4, science: 2, diplomacy: 4, logistics: 8, stealth: 2, combat: 2, production: 6 },
    possibleSubStats: ['resource_efficiency', 'transport_capacity', 'supply_range', 'trade_bonus', 'production_speed', 'maintenance_reduction'],
    maxLevel: 50,
    maxEvolution: 5,
    equipmentCap: 2,
    materialsRequired: [{ material: 'genetic_sample', amount: 10 }, { material: 'neural_pattern', amount: 5 }, { material: 'data_core', amount: 3 }],
    buildTime: 6,
    unlockResearchId: 'clone-spec-1',
  },
  {
    id: 'template-op-diplomacy',
    name: 'Diplomacy Operator Clone',
    subjectType: 'operator',
    baseStats: { command: 2, tactics: 3, engineering: 1, science: 3, diplomacy: 8, logistics: 5, stealth: 3, combat: 1, production: 3 },
    possibleSubStats: ['diplomacy_bonus', 'trade_route_efficiency', 'faction_standing', 'alliance_bonus', 'bargain_power', 'intel_gathering'],
    maxLevel: 45,
    maxEvolution: 4,
    equipmentCap: 2,
    materialsRequired: [{ material: 'genetic_sample', amount: 8 }, { material: 'neural_pattern', amount: 5 }],
    buildTime: 5,
    unlockResearchId: 'clone-spec-1',
  },
  {
    id: 'template-infantry',
    name: 'Infantry Clone',
    subjectType: 'infantry_unit',
    baseStats: { attack: 5, defense: 4, speed: 3, morale: 3, endurance: 4 },
    possibleSubStats: ['bonus_damage', 'damage_reduction', 'move_speed', 'armor_value', 'crit_defense', 'heal_rate'],
    maxLevel: 30,
    maxEvolution: 3,
    equipmentCap: 1,
    materialsRequired: [{ material: 'genetic_sample', amount: 5 }, { material: 'military_protocol', amount: 2 }],
    buildTime: 3,
    unlockResearchId: 'clone-spec-1',
  },
  {
    id: 'template-vehicle',
    name: 'Vehicle Crew Clone',
    subjectType: 'vehicle_unit',
    baseStats: { piloting: 5, gunnery: 4, repair: 3, coordination: 4, survival: 3 },
    possibleSubStats: ['accuracy_bonus', 'evasion', 'repair_speed', 'coordinated_strike', 'damage_control', 'fuel_efficiency'],
    maxLevel: 35,
    maxEvolution: 4,
    equipmentCap: 2,
    materialsRequired: [{ material: 'genetic_sample', amount: 8 }, { material: 'military_protocol', amount: 4 }, { material: 'cybernetic_parts', amount: 2 }],
    buildTime: 4,
    unlockResearchId: 'clone-spec-2',
  },
  {
    id: 'template-starship',
    name: 'Starship Crew Clone',
    subjectType: 'starship_crew',
    baseStats: { navigation: 5, weapons: 4, shields: 4, engineering: 4, command: 3 },
    possibleSubStats: ['warp_efficiency', 'weapon_damage', 'shield_capacity', 'system_redundancy', 'crew_morale', 'emergency_protocols'],
    maxLevel: 40,
    maxEvolution: 5,
    equipmentCap: 3,
    materialsRequired: [{ material: 'genetic_sample', amount: 12 }, { material: 'military_protocol', amount: 6 }, { material: 'cybernetic_parts', amount: 5 }, { material: 'data_core', amount: 3 }],
    buildTime: 6,
    unlockResearchId: 'clone-spec-3',
  },
];

// ============================================================================
// 4. STAT PROGRESSION — Level Up, XP, Evolution
// ============================================================================

export interface LevelUpTable {
  level: number;
  xpRequired: number;
  statPointsAwarded: number;
  subStatRolls: number;
  bonusEffect: string;
}

/**
 * Generate XP curve for given max level.
 * Formula grows exponentially: ~base * 1.12^(level-1)
 */
export function generateLevelUpTable(maxLevel: number, baseXp: number = 100): LevelUpTable[] {
  const table: LevelUpTable[] = [];
  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    table.push({
      level: lvl,
      xpRequired: Math.floor(baseXp * Math.pow(1.12, lvl - 1)),
      statPointsAwarded: lvl % 10 === 0 ? 5 : lvl % 5 === 0 ? 3 : 1,
      subStatRolls: lvl % 10 === 0 ? 1 : 0,
      bonusEffect: lvl % 20 === 0 ? `Unlocks ability upgrade tier ${lvl / 20}` : '',
    });
  }
  return table;
}

export type EvolutionTier = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface EvolutionConfig {
  tier: EvolutionTier;
  name: string;
  statMultiplier: number;
  additionalSubStats: number;
  unlockAbilityUpgrade: boolean;
  requiredLevel: number;
  requiredClones: number;
  materials: { material: string; amount: number }[];
}

export const EVOLUTION_TIERS: Record<EvolutionTier, EvolutionConfig> = {
  0: {
    tier: 0,
    name: 'Base Template',
    statMultiplier: 1.0,
    additionalSubStats: 0,
    unlockAbilityUpgrade: false,
    requiredLevel: 1,
    requiredClones: 0,
    materials: [],
  },
  1: {
    tier: 1,
    name: 'Enhanced Clone',
    statMultiplier: 1.1,
    additionalSubStats: 1,
    unlockAbilityUpgrade: false,
    requiredLevel: 10,
    requiredClones: 2,
    materials: [{ material: 'genetic_sample', amount: 10 }],
  },
  2: {
    tier: 2,
    name: 'Superior Clone',
    statMultiplier: 1.25,
    additionalSubStats: 2,
    unlockAbilityUpgrade: true,
    requiredLevel: 20,
    requiredClones: 4,
    materials: [{ material: 'genetic_sample', amount: 20 }, { material: 'neural_pattern', amount: 5 }],
  },
  3: {
    tier: 3,
    name: 'Elite Clone',
    statMultiplier: 1.45,
    additionalSubStats: 3,
    unlockAbilityUpgrade: true,
    requiredLevel: 30,
    requiredClones: 8,
    materials: [{ material: 'genetic_sample', amount: 30 }, { material: 'neural_pattern', amount: 10 }, { material: 'growth_hormone', amount: 5 }],
  },
  4: {
    tier: 4,
    name: 'Prime Clone',
    statMultiplier: 1.7,
    additionalSubStats: 4,
    unlockAbilityUpgrade: true,
    requiredLevel: 40,
    requiredClones: 16,
    materials: [{ material: 'genetic_sample', amount: 40 }, { material: 'neural_pattern', amount: 15 }, { material: 'hybrid_serum', amount: 5 }, { material: 'cybernetic_parts', amount: 10 }],
  },
  5: {
    tier: 5,
    name: 'Omega Clone',
    statMultiplier: 2.0,
    additionalSubStats: 5,
    unlockAbilityUpgrade: true,
    requiredLevel: 50,
    requiredClones: 32,
    materials: [{ material: 'neural_pattern', amount: 25 }, { material: 'omega_pattern', amount: 5 }, { material: 'quantum_gene', amount: 3 }, { material: 'hybrid_serum', amount: 10 }],
  },
  6: {
    tier: 6,
    name: 'Perfect Clone',
    statMultiplier: 2.5,
    additionalSubStats: 6,
    unlockAbilityUpgrade: true,
    requiredLevel: 60,
    requiredClones: 64,
    materials: [{ material: 'omega_pattern', amount: 10 }, { material: 'quantum_gene', amount: 8 }, { material: 'temporal_catalyst', amount: 3 }, { material: 'hybrid_serum', amount: 15 }],
  },
};

// ============================================================================
// 5. EQUIPMENT — Gear Slots, Items, Set Bonuses
// ============================================================================

export type EquipmentRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'omega';
export type EquipmentSlot = 'implant_cortex' | 'neural_link' | 'genetic_mod' | 'cybernetic_limb' | 'combat_visor' | 'shield_generator' | 'power_core' | 'skill_chip';
export type EquipmentType = 'implant' | 'weapon' | 'armor' | 'accessory' | 'utility';

export const EQUIPMENT_SLOT_ORDER: EquipmentSlot[] = [
  'implant_cortex',
  'neural_link',
  'genetic_mod',
  'cybernetic_limb',
  'combat_visor',
  'shield_generator',
  'power_core',
  'skill_chip',
];

export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  type: EquipmentType;
  rarity: EquipmentRarity;
  level: number;
  maxLevel: number;
  mainStat: { statType: string; value: number; isPercent: boolean };
  subStats: EquipmentSubStat[];
  setId?: string;
  setBonusCount?: number;
  unique: boolean;
  isEquipped: boolean;
  equippedBy?: string;
  durability: number;
  maxDurability: number;
  tradeable: boolean;
  materials: { material: string; amount: number }[];
  craftTime: number;
}

export interface EquipmentSubStat {
  statType: string;
  value: number;
  isPercent: boolean;
  rarity: EquipmentRarity;
  rollQuality: number;
}

export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  pieces: string[];
  bonuses: {
    piecesRequired: number;
    bonusType: string;
    bonusValue: number;
    description: string;
  }[];
}

export const EQUIPMENT_SETS: EquipmentSet[] = [
  {
    id: 'set-command-alpha',
    name: 'Command Alpha Set',
    description: 'Standard command enhancement set for cloned operators.',
    pieces: ['implant_cortex', 'neural_link', 'skill_chip'],
    bonuses: [
      { piecesRequired: 2, bonusType: 'command', bonusValue: 3, description: '+3 Command stat' },
      { piecesRequired: 3, bonusType: 'command_aura', bonusValue: 0.1, description: '10% command aura range increase' },
    ],
  },
  {
    id: 'set-ghost-squad',
    name: 'Ghost Squad Set',
    description: 'Stealth and infiltration enhancement for covert operator clones.',
    pieces: ['combat_visor', 'cybernetic_limb', 'genetic_mod'],
    bonuses: [
      { piecesRequired: 2, bonusType: 'stealth', bonusValue: 5, description: '+5 Stealth stat' },
      { piecesRequired: 3, bonusType: 'stealth_penetration', bonusValue: 0.25, description: '25% stealth mission penetration' },
    ],
  },
  {
    id: 'set-battle-prime',
    name: 'Battle Prime Set',
    description: 'Combat-focused set for frontline operator clones.',
    pieces: ['combat_visor', 'shield_generator', 'cybernetic_limb', 'power_core'],
    bonuses: [
      { piecesRequired: 2, bonusType: 'combat', bonusValue: 4, description: '+4 Combat stat' },
      { piecesRequired: 3, bonusType: 'damage_reduction', bonusValue: 0.15, description: '15% damage reduction' },
      { piecesRequired: 4, bonusType: 'berserker_mode', bonusValue: 0.2, description: '20% chance to enter berserker mode on low HP' },
    ],
  },
  {
    id: 'set-genius-lab',
    name: 'Genius Lab Set',
    description: 'Research and science enhancement for science operator clones.',
    pieces: ['implant_cortex', 'neural_link', 'genetic_mod', 'skill_chip'],
    bonuses: [
      { piecesRequired: 2, bonusType: 'science', bonusValue: 5, description: '+5 Science stat' },
      { piecesRequired: 3, bonusType: 'research_speed', bonusValue: 0.2, description: '20% research speed increase' },
      { piecesRequired: 4, bonusType: 'discovery_chance', bonusValue: 0.1, description: '10% experimental discovery chance' },
    ],
  },
  {
    id: 'set-void-walker',
    name: 'Void Walker Set',
    description: 'Legendary set for omega-tier clones, harnessing void energy.',
    pieces: ['implant_cortex', 'neural_link', 'genetic_mod', 'cybernetic_limb', 'combat_visor', 'shield_generator', 'power_core', 'skill_chip'],
    bonuses: [
      { piecesRequired: 3, bonusType: 'all_stats', bonusValue: 3, description: '+3 to all stats' },
      { piecesRequired: 5, bonusType: 'void_energy', bonusValue: 0.15, description: '15% void energy damage' },
      { piecesRequired: 8, bonusType: 'omega_transcendence', bonusValue: 1.0, description: 'Unlock Omega Transcendence form' },
    ],
  },
];

// ── Equipment Crafting Recipes ───────────────────────────────────────────────

export const EQUIPMENT_RECIPES: EquipmentItem[] = [
  {
    id: 'eq-cortex-basic',
    name: 'Basic Cortex Implant',
    description: 'Standard neural interface for basic stat enhancement.',
    slot: 'implant_cortex',
    type: 'implant',
    rarity: 'common',
    level: 1,
    maxLevel: 10,
    mainStat: { statType: 'command', value: 2, isPercent: false },
    subStats: [
      { statType: 'tactics', value: 1, isPercent: false, rarity: 'common', rollQuality: 0.5 },
    ],
    setId: 'set-command-alpha',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 100,
    maxDurability: 100,
    tradeable: true,
    materials: [{ material: 'cybernetic_parts', amount: 5 }, { material: 'data_core', amount: 2 }],
    craftTime: 2,
  },
  {
    id: 'eq-cortex-advanced',
    name: 'Advanced Cortex Implant',
    description: 'Enhanced neural interface with superior stat allocation.',
    slot: 'implant_cortex',
    type: 'implant',
    rarity: 'rare',
    level: 10,
    maxLevel: 20,
    mainStat: { statType: 'command', value: 5, isPercent: false },
    subStats: [
      { statType: 'tactics', value: 3, isPercent: false, rarity: 'uncommon', rollQuality: 0.6 },
      { statType: 'science', value: 2, isPercent: false, rarity: 'uncommon', rollQuality: 0.5 },
    ],
    setId: 'set-command-alpha',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 150,
    maxDurability: 150,
    tradeable: true,
    materials: [{ material: 'cybernetic_parts', amount: 15 }, { material: 'data_core', amount: 8 }, { material: 'neural_pattern', amount: 5 }],
    craftTime: 4,
  },
  {
    id: 'eq-visor-tactical',
    name: 'Tactical Combat Visor',
    description: 'Advanced targeting and threat assessment visor.',
    slot: 'combat_visor',
    type: 'armor',
    rarity: 'uncommon',
    level: 5,
    maxLevel: 15,
    mainStat: { statType: 'combat', value: 4, isPercent: false },
    subStats: [
      { statType: 'tactics', value: 2, isPercent: false, rarity: 'common', rollQuality: 0.5 },
    ],
    setId: 'set-battle-prime',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 80,
    maxDurability: 80,
    tradeable: true,
    materials: [{ material: 'cybernetic_parts', amount: 8 }, { material: 'military_protocol', amount: 3 }],
    craftTime: 3,
  },
  {
    id: 'eq-shield-deflection',
    name: 'Deflection Shield Generator',
    description: 'Personal energy shield for damage mitigation.',
    slot: 'shield_generator',
    type: 'armor',
    rarity: 'rare',
    level: 8,
    maxLevel: 20,
    mainStat: { statType: 'defense', value: 10, isPercent: false },
    subStats: [
      { statType: 'damage_reduction', value: 5, isPercent: true, rarity: 'uncommon', rollQuality: 0.6 },
    ],
    setId: 'set-battle-prime',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 200,
    maxDurability: 200,
    tradeable: true,
    materials: [{ material: 'cybernetic_parts', amount: 12 }, { material: 'military_protocol', amount: 5 }, { material: 'quantum_gene', amount: 2 }],
    craftTime: 5,
  },
  {
    id: 'eq-neural-link-basic',
    name: 'Neural Link Interface',
    description: 'Direct neural connection for enhanced operator control.',
    slot: 'neural_link',
    type: 'implant',
    rarity: 'common',
    level: 1,
    maxLevel: 10,
    mainStat: { statType: 'logistics', value: 2, isPercent: false },
    subStats: [
      { statType: 'engineering', value: 1, isPercent: false, rarity: 'common', rollQuality: 0.5 },
    ],
    setId: 'set-command-alpha',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 100,
    maxDurability: 100,
    tradeable: true,
    materials: [{ material: 'cybernetic_parts', amount: 3 }, { material: 'data_core', amount: 1 }],
    craftTime: 1,
  },
  {
    id: 'eq-genetic-mod-endurance',
    name: 'Endurance Genetic Mod',
    description: 'Genetic modification enhancing physical endurance.',
    slot: 'genetic_mod',
    type: 'implant',
    rarity: 'uncommon',
    level: 3,
    maxLevel: 15,
    mainStat: { statType: 'endurance', value: 8, isPercent: false },
    subStats: [
      { statType: 'health_regen', value: 2, isPercent: true, rarity: 'common', rollQuality: 0.4 },
    ],
    setId: 'set-ghost-squad',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 120,
    maxDurability: 120,
    tradeable: true,
    materials: [{ material: 'genetic_sample', amount: 10 }, { material: 'growth_hormone', amount: 3 }],
    craftTime: 3,
  },
  {
    id: 'eq-cyberlimb-assault',
    name: 'Assault Cybernetic Limb',
    description: 'Reinforced cybernetic limb with weapon integration.',
    slot: 'cybernetic_limb',
    type: 'weapon',
    rarity: 'rare',
    level: 10,
    maxLevel: 25,
    mainStat: { statType: 'attack_power', value: 15, isPercent: false },
    subStats: [
      { statType: 'crit_chance', value: 3, isPercent: true, rarity: 'uncommon', rollQuality: 0.6 },
      { statType: 'attack_speed', value: 5, isPercent: true, rarity: 'rare', rollQuality: 0.7 },
    ],
    setId: 'set-battle-prime',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 180,
    maxDurability: 180,
    tradeable: true,
    materials: [{ material: 'cybernetic_parts', amount: 20 }, { material: 'military_protocol', amount: 8 }, { material: 'hybrid_serum', amount: 3 }],
    craftTime: 6,
  },
  {
    id: 'eq-power-core-fusion',
    name: 'Fusion Power Core',
    description: 'Compact fusion reactor for sustained combat operations.',
    slot: 'power_core',
    type: 'utility',
    rarity: 'epic',
    level: 15,
    maxLevel: 30,
    mainStat: { statType: 'energy_regen', value: 10, isPercent: true },
    subStats: [
      { statType: 'ability_power', value: 8, isPercent: true, rarity: 'rare', rollQuality: 0.7 },
      { statType: 'cooldown_reduction', value: 5, isPercent: true, rarity: 'uncommon', rollQuality: 0.5 },
    ],
    setId: 'set-void-walker',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 250,
    maxDurability: 250,
    tradeable: false,
    materials: [{ material: 'cybernetic_parts', amount: 25 }, { material: 'quantum_gene', amount: 5 }, { material: 'omega_pattern', amount: 2 }],
    craftTime: 8,
  },
  {
    id: 'eq-skill-chip-tactics',
    name: 'Tactical Skill Chip',
    description: 'Pre-loaded tactical knowledge for instant battlefield analysis.',
    slot: 'skill_chip',
    type: 'accessory',
    rarity: 'uncommon',
    level: 5,
    maxLevel: 15,
    mainStat: { statType: 'tactics', value: 4, isPercent: false },
    subStats: [
      { statType: 'command', value: 2, isPercent: false, rarity: 'common', rollQuality: 0.5 },
    ],
    setId: 'set-genius-lab',
    setBonusCount: 1,
    unique: false,
    isEquipped: false,
    durability: 80,
    maxDurability: 80,
    tradeable: true,
    materials: [{ material: 'data_core', amount: 5 }, { material: 'neural_pattern', amount: 3 }],
    craftTime: 2,
  },
];

// ============================================================================
// 6. CLONE MATERIALS — Resources for Cloning & Upgrading
// ============================================================================

export type CloneMaterialType =
  | 'genetic_sample'
  | 'neural_pattern'
  | 'growth_hormone'
  | 'military_protocol'
  | 'cybernetic_parts'
  | 'data_core'
  | 'hybrid_serum'
  | 'quantum_gene'
  | 'omega_pattern'
  | 'temporal_catalyst';

export interface CloneMaterial {
  id: CloneMaterialType;
  name: string;
  description: string;
  rarity: EquipmentRarity;
  source: string;
  maxStack: number;
  baseValue: number;
}

export const CLONE_MATERIALS: Record<CloneMaterialType, CloneMaterial> = {
  genetic_sample: {
    id: 'genetic_sample',
    name: 'Genetic Sample',
    description: 'Raw genetic material for base template cloning.',
    rarity: 'common',
    source: 'missions, expeditions, recycling',
    maxStack: 9999,
    baseValue: 10,
  },
  neural_pattern: {
    id: 'neural_pattern',
    name: 'Neural Pattern',
    description: 'Recorded neural maps for skill and knowledge transfer.',
    rarity: 'uncommon',
    source: 'boss defeats, research, special ops',
    maxStack: 9999,
    baseValue: 25,
  },
  growth_hormone: {
    id: 'growth_hormone',
    name: 'Growth Hormone',
    description: 'Synthetic hormones that accelerate clone maturation.',
    rarity: 'uncommon',
    source: 'laboratory production, trading',
    maxStack: 9999,
    baseValue: 15,
  },
  military_protocol: {
    id: 'military_protocol',
    name: 'Military Protocol',
    description: 'Tactical and combat data for military-grade clones.',
    rarity: 'rare',
    source: 'combat missions, war zones, raids',
    maxStack: 9999,
    baseValue: 40,
  },
  cybernetic_parts: {
    id: 'cybernetic_parts',
    name: 'Cybernetic Parts',
    description: 'Mechanical and electronic components for clone enhancement.',
    rarity: 'uncommon',
    source: 'crafting, salvage, market',
    maxStack: 9999,
    baseValue: 20,
  },
  data_core: {
    id: 'data_core',
    name: 'Data Core',
    description: 'High-density storage cores containing knowledge and protocols.',
    rarity: 'rare',
    source: 'research, exploration, data mining',
    maxStack: 9999,
    baseValue: 35,
  },
  hybrid_serum: {
    id: 'hybrid_serum',
    name: 'Hybrid Serum',
    description: 'Experimental serum enabling cross-template genetic fusion.',
    rarity: 'epic',
    source: 'special events, epic bosses, hybrid research',
    maxStack: 999,
    baseValue: 100,
  },
  quantum_gene: {
    id: 'quantum_gene',
    name: 'Quantum Gene',
    description: 'Quantum-stabilized genes for perfect clone fidelity.',
    rarity: 'epic',
    source: 'quantum research, ancient ruins, void rifts',
    maxStack: 999,
    baseValue: 150,
  },
  omega_pattern: {
    id: 'omega_pattern',
    name: 'Omega Pattern',
    description: 'The ultimate genetic template — peak clone potential.',
    rarity: 'legendary',
    source: 'omega bosses, apex missions, endgame content',
    maxStack: 99,
    baseValue: 500,
  },
  temporal_catalyst: {
    id: 'temporal_catalyst',
    name: 'Temporal Catalyst',
    description: 'Time-distorting catalyst for temporal acceleration chambers.',
    rarity: 'legendary',
    source: 'temporal anomalies, time rifts, ancient vaults',
    maxStack: 99,
    baseValue: 1000,
  },
};

// ============================================================================
// 7. VAULT & BANK INTEGRATION
// ============================================================================

export type VaultTabType = 'clone_materials' | 'clone_storage' | 'equipment_vault' | 'blueprint_vault';

export interface VaultTabConfig {
  id: VaultTabType;
  name: string;
  description: string;
  icon: string;
  color: string;
  baseCapacity: number;
  maxUpgradeLevel: number;
  upgradeCostMultiplier: number;
}

export const VAULT_TABS: VaultTabConfig[] = [
  {
    id: 'clone_materials',
    name: 'Clone Material Storage',
    description: 'Store genetic samples, neural patterns, and cloning materials.',
    icon: '🧬',
    color: '#22c55e',
    baseCapacity: 100,
    maxUpgradeLevel: 30,
    upgradeCostMultiplier: 1.5,
  },
  {
    id: 'clone_storage',
    name: 'Clone Cryo-Storage',
    description: 'Store inactive clones in cryogenic suspension.',
    icon: '❄️',
    color: '#06b6d4',
    baseCapacity: 10,
    maxUpgradeLevel: 20,
    upgradeCostMultiplier: 2.0,
  },
  {
    id: 'equipment_vault',
    name: 'Equipment Vault',
    description: 'Securely store equipment items, implants, and gear.',
    icon: '⚔️',
    color: '#ef4444',
    baseCapacity: 50,
    maxUpgradeLevel: 25,
    upgradeCostMultiplier: 2.2,
  },
  {
    id: 'blueprint_vault',
    name: 'Blueprint Archive',
    description: 'Archive clone templates, equipment blueprints, and research data.',
    icon: '📜',
    color: '#a855f7',
    baseCapacity: 30,
    maxUpgradeLevel: 15,
    upgradeCostMultiplier: 2.5,
  },
];

export interface CloneVaultState {
  materials: Record<CloneMaterialType, number>;
  storedClones: StoredCloneEntry[];
  storedEquipment: string[];
  storedBlueprints: StoredBlueprint[];
  tabLevels: Record<VaultTabType, number>;
  totalItems: number;
}

export interface StoredCloneEntry {
  cloneId: string;
  templateId: string;
  name: string;
  level: number;
  evolutionRank: EvolutionTier;
  quality: CloneQuality;
  storedAt: number;
  storageCost: number;
}

export interface StoredBlueprint {
  id: string;
  name: string;
  type: 'clone_template' | 'equipment' | 'research';
  referenceId: string;
  rarity: EquipmentRarity;
  researchLevel: number;
  unlockedAt: number;
}

// ── Bank Integration ─────────────────────────────────────────────────────────

export type BankTransactionType = 'deposit' | 'withdraw' | 'transfer' | 'craft' | 'research' | 'upgrade';

export interface BankTransaction {
  id: string;
  type: BankTransactionType;
  materialType?: CloneMaterialType;
  equipmentId?: string;
  cloneId?: string;
  amount: number;
  timestamp: number;
  source: string;
  destination: string;
}

// ============================================================================
// 8. CLONE LAB STATE (Full runtime state)
// ============================================================================

export interface CloneLabState {
  // Facility
  labTier: CloneLabTier;
  labLevel: number;
  specialization: CloneSpecialization;

  // Research
  completedResearch: string[];
  activeResearch: string[];
  researchProgress: Record<string, number>;

  // Active clones
  activeClones: CloneSubject[];
  totalClonesCreated: number;

  // Vault
  vault: CloneVaultState;

  // Bank
  bankBalance: number;
  bankTransactions: BankTransaction[];

  // Stats
  totalResearchSpent: number;
  totalMaterialsUsed: number;
  totalEquipmentCrafted: number;
  totalEvolutionsPerformed: number;
}

export function createDefaultCloneLabState(): CloneLabState {
  return {
    labTier: 'basic',
    labLevel: 1,
    specialization: 'operator',
    completedResearch: [],
    activeResearch: [],
    researchProgress: {},
    activeClones: [],
    totalClonesCreated: 0,
    vault: {
      materials: {
        genetic_sample: 0,
        neural_pattern: 0,
        growth_hormone: 0,
        military_protocol: 0,
        cybernetic_parts: 0,
        data_core: 0,
        hybrid_serum: 0,
        quantum_gene: 0,
        omega_pattern: 0,
        temporal_catalyst: 0,
      },
      storedClones: [],
      storedEquipment: [],
      storedBlueprints: [],
      tabLevels: {
        clone_materials: 1,
        clone_storage: 1,
        equipment_vault: 1,
        blueprint_vault: 1,
      },
      totalItems: 0,
    },
    bankBalance: 0,
    bankTransactions: [],
    totalResearchSpent: 0,
    totalMaterialsUsed: 0,
    totalEquipmentCrafted: 0,
    totalEvolutionsPerformed: 0,
  };
}

// ============================================================================
// 9. HELPER FUNCTIONS
// ============================================================================

export function getVaultTabCapacity(tab: VaultTabType, level: number): number {
  const config = VAULT_TABS.find(t => t.id === tab);
  if (!config) return 0;
  return Math.floor(config.baseCapacity * Math.pow(1.4, level - 1));
}

export function getVaultUpgradeCost(tab: VaultTabType, currentLevel: number): { credits: number; materials: { material: CloneMaterialType; amount: number }[] } {
  const config = VAULT_TABS.find(t => t.id === tab);
  if (!config) return { credits: 0, materials: [] };
  const multiplier = Math.pow(config.upgradeCostMultiplier, currentLevel);
  return {
    credits: Math.floor(5000 * multiplier),
    materials: [{ material: 'data_core', amount: Math.floor(2 * currentLevel) }],
  };
}

export function getLabUpgradeCost(currentTier: CloneLabTier): CloneLabConfig | null {
  const tiers: CloneLabTier[] = ['basic', 'advanced', 'superior', 'elite', 'prime', 'apex'];
  const idx = tiers.indexOf(currentTier);
  if (idx < 0 || idx >= tiers.length - 1) return null;
  const nextTier = tiers[idx + 1];
  return CLONE_LAB_TIERS[nextTier];
}

export function calculateCloneStatTotal(clone: CloneSubject): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key of Object.keys(clone.baseStats)) {
    result[key] = (clone.baseStats[key] || 0) + (clone.bonusStats[key] || 0);
    const evoMultiplier = EVOLUTION_TIERS[clone.evolutionRank as EvolutionTier]?.statMultiplier ?? 1;
    result[key] = Math.floor(result[key] * evoMultiplier);
  }
  for (const sub of clone.subStats) {
    if (sub.isPercent) continue;
    result[sub.statType] = (result[sub.statType] || 0) + sub.value;
  }
  return result;
}

export function getXpForLevel(level: number, baseXp: number = 100): number {
  return Math.floor(baseXp * Math.pow(1.12, level - 1));
}

export function getRequiredClonesForEvolution(currentTier: EvolutionTier): number {
  const nextTier = (currentTier + 1) as EvolutionTier;
  return EVOLUTION_TIERS[nextTier]?.requiredClones ?? Infinity;
}
