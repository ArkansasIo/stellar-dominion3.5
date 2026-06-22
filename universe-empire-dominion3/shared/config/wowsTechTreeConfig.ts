/**
 * World of Warships-Style Technology Tree System
 * ============================================================================
 * Branching progression system with fork points, side branches, and
 * cross-dependencies. Each race has a unique tech tree with 5 main branches
 * and 10 tiers of progression.
 *
 * @tag #tech-tree #progression #wows #branching #race-specific
 */

import { RaceId } from '../../client/src/lib/commanderTypes';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TechBranch = 'hull' | 'weapons' | 'propulsion' | 'systems' | 'special';

export type NodeType = 'trunk' | 'fork' | 'side' | 'shared' | 'capstone' | 'apex';

export type ForkType = 'binary' | 'trinary' | 'mutually_exclusive' | 'soft' | 'hard';

export interface ResourceCost {
  metal?: number;
  crystal?: number;
  deuterium?: number;
  credits?: number;
}

export interface TechBonus {
  stat: string;
  value: number;
  isPercent: boolean;
}

export interface ForkOption {
  id: string;
  name: string;
  branchPath: string[];
  description: string;
  playstyle: string;
  tradeoffs: {
    bonus: string;
    penalty: string;
  };
}

export interface ForkPoint {
  id: string;
  tier: number;
  type: ForkType;
  options: ForkOption[];
  unlockedBy: string[];
}

export interface WoWsTechNode {
  id: string;
  name: string;
  tier: number;
  branch: TechBranch;
  type: NodeType;
  race: RaceId | 'universal';

  // Prerequisites
  prerequisiteTechs: string[];
  unlockRequirements: {
    empireLevel?: number;
    turnCount?: number;
    forkCompleted?: string[];
    prestigeLevel?: number;
    resourceStockpile?: ResourceCost;
  };

  // Fork data (only for fork nodes)
  fork?: ForkPoint;

  // Research data
  researchCost: ResourceCost;
  researchTime: number;
  researchXP: number;

  // Effects
  bonuses: TechBonus[];
  unlocks: string[];
  flavorText: string;
  raceNames?: Partial<Record<RaceId, { displayName: string; flavorText: string }>>;
}

export interface SharedModule {
  id: string;
  name: string;
  tier: number;
  category: 'weapon' | 'engine' | 'shield';
  stats: {
    dps?: number;
    range?: number;
    speed?: number;
    fuel?: string;
    hp?: number;
    regen?: number;
  };
  compatibleHulls: string[];
  description: string;
}

export interface TierGate {
  tier: number;
  name: string;
  unlockRequirement: string;
  researchCostMultiplier: number;
  timeMultiplier: number;
}

// ============================================================================
// TIER GATES
// ============================================================================

export const TIER_GATES: TierGate[] = [
  { tier: 1, name: 'Starter', unlockRequirement: 'Account creation', researchCostMultiplier: 1, timeMultiplier: 1 },
  { tier: 2, name: 'Developing', unlockRequirement: 'Tier I capstone', researchCostMultiplier: 2, timeMultiplier: 2 },
  { tier: 3, name: 'Established', unlockRequirement: 'Tier II capstone + 1000 turns', researchCostMultiplier: 4, timeMultiplier: 3 },
  { tier: 4, name: 'Advanced', unlockRequirement: 'Tier III fork completion', researchCostMultiplier: 8, timeMultiplier: 5 },
  { tier: 5, name: 'Elite', unlockRequirement: 'Tier IV capstone + empire level 100', researchCostMultiplier: 16, timeMultiplier: 8 },
  { tier: 6, name: 'Master', unlockRequirement: 'Tier V capstone + empire level 200', researchCostMultiplier: 32, timeMultiplier: 12 },
  { tier: 7, name: 'Legendary', unlockRequirement: 'Tier VI fork + alliance rank 5', researchCostMultiplier: 64, timeMultiplier: 20 },
  { tier: 8, name: 'Mythical', unlockRequirement: 'Tier VII capstone + empire level 500', researchCostMultiplier: 128, timeMultiplier: 30 },
  { tier: 9, name: 'Transcendent', unlockRequirement: 'Tier VIII fork + prestige 1', researchCostMultiplier: 256, timeMultiplier: 50 },
  { tier: 10, name: 'Apex', unlockRequirement: 'Tier IX capstone + all branches forked', researchCostMultiplier: 512, timeMultiplier: 80 },
];

// ============================================================================
// SHARED MODULES
// ============================================================================

export const SHARED_MODULES: SharedModule[] = [
  // Weapon Modules
  { id: 'mod_light_laser', name: 'Light Laser', tier: 1, category: 'weapon', stats: { dps: 50, range: 5 }, compatibleHulls: ['all'], description: 'Standard energy weapon for all ship classes' },
  { id: 'mod_plasma_torch', name: 'Plasma Torch', tier: 3, category: 'weapon', stats: { dps: 120, range: 3 }, compatibleHulls: ['frigate', 'destroyer'], description: 'Short-range plasma weapon for light ships' },
  { id: 'mod_kinetic_battery', name: 'Kinetic Battery', tier: 5, category: 'weapon', stats: { dps: 200, range: 8 }, compatibleHulls: ['cruiser', 'battleship'], description: 'Heavy kinetic weapon for capital ships' },
  { id: 'mod_antimatter_lance', name: 'Antimatter Lance', tier: 7, category: 'weapon', stats: { dps: 500, range: 10 }, compatibleHulls: ['battleship', 'dreadnought'], description: 'Devastating antimatter weapon' },
  { id: 'mod_singularity_beam', name: 'Singularity Beam', tier: 9, category: 'weapon', stats: { dps: 1000, range: 12 }, compatibleHulls: ['dreadnought'], description: 'Ultimate weapon of mass destruction' },

  // Engine Modules
  { id: 'mod_ion_thruster', name: 'Ion Thruster', tier: 1, category: 'engine', stats: { speed: 20 }, compatibleHulls: ['all'], description: 'Standard propulsion system' },
  { id: 'mod_fusion_drive', name: 'Fusion Drive', tier: 3, category: 'engine', stats: { speed: 40, fuel: 'deuterium' }, compatibleHulls: ['all'], description: 'Efficient fusion-powered engines' },
  { id: 'mod_warp_nacelle', name: 'Warp Nacelle', tier: 5, category: 'engine', stats: { speed: 60, fuel: 'crystal' }, compatibleHulls: ['cruiser+'], description: 'Advanced warp propulsion' },
  { id: 'mod_fold_drive', name: 'Fold Drive', tier: 7, category: 'engine', stats: { speed: 80, fuel: 'exotic' }, compatibleHulls: ['battleship+'], description: 'Space-folding technology' },

  // Shield Modules
  { id: 'mod_basic_shield', name: 'Basic Shield', tier: 1, category: 'shield', stats: { hp: 100, regen: 1 }, compatibleHulls: ['all'], description: 'Standard energy shielding' },
  { id: 'mod_deflector', name: 'Deflector', tier: 3, category: 'shield', stats: { hp: 250, regen: 3 }, compatibleHulls: ['all'], description: 'Enhanced defensive barrier' },
  { id: 'mod_barrier', name: 'Barrier', tier: 5, category: 'shield', stats: { hp: 500, regen: 5 }, compatibleHulls: ['cruiser+'], description: 'Heavy capital ship shielding' },
  { id: 'mod_null_field', name: 'Null Field', tier: 7, category: 'shield', stats: { hp: 1000, regen: 10 }, compatibleHulls: ['battleship+'], description: 'Advanced energy nullification' },
];

// ============================================================================
// TERRAN TECH TREE
// ============================================================================

export const TERRAN_TECH_TREE: WoWsTechNode[] = [
  // ── HULL BRANCH ──
  { id: 'terran_hull_t1', name: 'Colony Foundation', tier: 1, branch: 'hull', type: 'trunk', race: 'terran', prerequisiteTechs: [], unlockRequirements: {}, researchCost: { metal: 100, crystal: 50 }, researchTime: 5, researchXP: 10, bonuses: [{ stat: 'empire_capacity', value: 10, isPercent: false }], unlocks: ['terran_hull_t2'], flavorText: 'The foundation of your empire begins here.' },
  { id: 'terran_hull_t2', name: 'Planetary Government', tier: 2, branch: 'hull', type: 'fork', race: 'terran', prerequisiteTechs: ['terran_hull_t1'], unlockRequirements: { empireLevel: 10 }, researchCost: { metal: 250, crystal: 125 }, researchTime: 15, researchXP: 25, bonuses: [{ stat: 'empire_capacity', value: 20, isPercent: false }], unlocks: ['terran_hull_t3'], flavorText: 'Establish order among the colonies.', fork: { id: 'terran_hull_fork_t2', tier: 2, type: 'binary', options: [{ id: 'terran_hull_military', name: 'Military Academy', branchPath: ['terran_hull_t3a'], description: 'Focus on military infrastructure', playstyle: 'Aggressive expansion', tradeoffs: { bonus: '+15% fleet capacity', penalty: '-10% research speed' } }, { id: 'terran_hull_trade', name: 'Trade Hub', branchPath: ['terran_hull_t3b'], description: 'Focus on economic infrastructure', playstyle: 'Economic dominance', tradeoffs: { bonus: '+20% trade income', penalty: '-10% fleet capacity' } }], unlockedBy: ['terran_hull_t2'] } },
  { id: 'terran_hull_t3a', name: 'Orbital Network', tier: 3, branch: 'hull', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_hull_t2'], unlockRequirements: { empireLevel: 25 }, researchCost: { metal: 500, crystal: 250 }, researchTime: 30, researchXP: 50, bonuses: [{ stat: 'orbital_capacity', value: 30, isPercent: false }], unlocks: ['terran_hull_t4'], flavorText: 'A network of orbital stations extends your reach.' },
  { id: 'terran_hull_t3b', name: 'Trade Network', tier: 3, branch: 'hull', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_hull_t2'], unlockRequirements: { empireLevel: 25 }, researchCost: { metal: 400, crystal: 300 }, researchTime: 30, researchXP: 50, bonuses: [{ stat: 'trade_income', value: 25, isPercent: false }], unlocks: ['terran_hull_t4'], flavorText: 'Commerce flows through your Trade Network.' },
  { id: 'terran_hull_t4', name: 'Deep Space Hub', tier: 4, branch: 'hull', type: 'fork', race: 'terran', prerequisiteTechs: ['terran_hull_t3a'], unlockRequirements: { empireLevel: 50 }, researchCost: { metal: 1000, crystal: 500 }, researchTime: 60, researchXP: 100, bonuses: [{ stat: 'expansion_speed', value: 20, isPercent: false }], unlocks: ['terran_hull_t5'], flavorText: 'Extend your influence into the deep void.', fork: { id: 'terran_hull_fork_t4', tier: 4, type: 'binary', options: [{ id: 'terran_hull_fortress', name: 'Fortress World', branchPath: ['terran_hull_t5a'], description: 'Defensive stronghold specialization', playstyle: 'Defensive powerhouse', tradeoffs: { bonus: '+30% defensive structures', penalty: '-15% fleet speed' } }, { id: 'terran_hull_nomad', name: 'Nomad Fleet', branchPath: ['terran_hull_t5b'], description: 'Mobile fleet specialization', playstyle: 'Hit-and-run tactics', tradeoffs: { bonus: '+25% fleet speed', penalty: '-20% defensive structures' } }], unlockedBy: ['terran_hull_t4'] } },
  { id: 'terran_hull_t5a', name: 'Stellar Citadel', tier: 5, branch: 'hull', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_hull_t4'], unlockRequirements: { empireLevel: 100 }, researchCost: { metal: 2000, crystal: 1000 }, researchTime: 120, researchXP: 200, bonuses: [{ stat: 'defense_strength', value: 35, isPercent: false }], unlocks: ['terran_hull_t6'], flavorText: 'The Citadel stands as a beacon of Terran strength.' },
  { id: 'terran_hull_t5b', name: 'Fleet Command Center', tier: 5, branch: 'hull', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_hull_t4'], unlockRequirements: { empireLevel: 100 }, researchCost: { metal: 1800, crystal: 1200 }, researchTime: 120, researchXP: 200, bonuses: [{ stat: 'fleet_speed', value: 30, isPercent: false }], unlocks: ['terran_hull_t6'], flavorText: 'Command the void with unmatched mobility.' },
  { id: 'terran_hull_t6', name: 'Galactic Core', tier: 6, branch: 'hull', type: 'capstone', race: 'terran', prerequisiteTechs: ['terran_hull_t5a'], unlockRequirements: { empireLevel: 200 }, researchCost: { metal: 5000, crystal: 2500 }, researchTime: 240, researchXP: 500, bonuses: [{ stat: 'empire_capacity', value: 50, isPercent: false }], unlocks: ['terran_hull_t7'], flavorText: 'The heart of the Terran Empire beats at the galactic core.' },

  // ── WEAPONS BRANCH ──
  { id: 'terran_weapons_t1', name: 'Kinetic Projectiles', tier: 1, branch: 'weapons', type: 'trunk', race: 'terran', prerequisiteTechs: [], unlockRequirements: {}, researchCost: { metal: 80, crystal: 40 }, researchTime: 4, researchXP: 8, bonuses: [{ stat: 'weapon_damage', value: 10, isPercent: false }], unlocks: ['terran_weapons_t2'], flavorText: 'The first shot fired in the name of humanity.' },
  { id: 'terran_weapons_t2', name: 'Energy Beams', tier: 2, branch: 'weapons', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_weapons_t1'], unlockRequirements: { empireLevel: 10 }, researchCost: { metal: 200, crystal: 100 }, researchTime: 12, researchXP: 20, bonuses: [{ stat: 'weapon_damage', value: 20, isPercent: false }], unlocks: ['terran_weapons_t3'], flavorText: 'Harness the power of focused energy.' },
  { id: 'terran_weapons_t3', name: 'Directed Plasma', tier: 3, branch: 'weapons', type: 'fork', race: 'terran', prerequisiteTechs: ['terran_weapons_t2'], unlockRequirements: { empireLevel: 25 }, researchCost: { metal: 400, crystal: 200 }, researchTime: 25, researchXP: 40, bonuses: [{ stat: 'weapon_damage', value: 35, isPercent: false }], unlocks: ['terran_weapons_t4'], flavorText: 'Superheated plasma tears through enemy hulls.', fork: { id: 'terran_weapons_fork_t3', tier: 3, type: 'binary', options: [{ id: 'terran_weapons_range', name: 'Long-Range Battery', branchPath: ['terran_weapons_t4a'], description: 'Extended range weapons', playstyle: 'Sniper tactics', tradeoffs: { bonus: '+40% weapon range', penalty: '-15% damage' } }, { id: 'terran_weapons_burst', name: 'Close-Range Burst', branchPath: ['terran_weapons_t4b'], description: 'High damage at close range', playstyle: 'Aggressive brawler', tradeoffs: { bonus: '+30% damage', penalty: '-25% range' } }], unlockedBy: ['terran_weapons_t3'] } },
  { id: 'terran_weapons_t4a', name: 'Antimatter Weapons', tier: 4, branch: 'weapons', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_weapons_t3'], unlockRequirements: { empireLevel: 50 }, researchCost: { metal: 800, crystal: 400 }, researchTime: 50, researchXP: 80, bonuses: [{ stat: 'weapon_damage', value: 50, isPercent: false }], unlocks: ['terran_weapons_t5'], flavorText: 'Matter and antimatter collide in devastating annihilation.' },
  { id: 'terran_weapons_t4b', name: 'Plasma Torpedoes', tier: 4, branch: 'weapons', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_weapons_t3'], unlockRequirements: { empireLevel: 50 }, researchCost: { metal: 900, crystal: 350 }, researchTime: 50, researchXP: 80, bonuses: [{ stat: 'weapon_damage', value: 60, isPercent: false }], unlocks: ['terran_weapons_t5'], flavorText: 'Plasma warheads deliver catastrophic impact.' },
  { id: 'terran_weapons_t5', name: 'Singularity Weapons', tier: 5, branch: 'weapons', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_weapons_t4a'], unlockRequirements: { empireLevel: 100 }, researchCost: { metal: 1600, crystal: 800 }, researchTime: 100, researchXP: 160, bonuses: [{ stat: 'weapon_damage', value: 75, isPercent: false }], unlocks: ['terran_weapons_t6'], flavorText: 'Weaponized singularities bend spacetime itself.' },
  { id: 'terran_weapons_t6', name: 'Exotic Matter', tier: 6, branch: 'weapons', type: 'capstone', race: 'terran', prerequisiteTechs: ['terran_weapons_t5'], unlockRequirements: { empireLevel: 200 }, researchCost: { metal: 4000, crystal: 2000 }, researchTime: 200, researchXP: 400, bonuses: [{ stat: 'weapon_damage', value: 100, isPercent: false }], unlocks: ['terran_weapons_t7'], flavorText: 'Exotic matter defies the laws of physics.' },

  // ── PROPULSION BRANCH ──
  { id: 'terran_propulsion_t1', name: 'Ion Thrusters', tier: 1, branch: 'propulsion', type: 'trunk', race: 'terran', prerequisiteTechs: [], unlockRequirements: {}, researchCost: { metal: 60, crystal: 30 }, researchTime: 3, researchXP: 6, bonuses: [{ stat: 'fleet_speed', value: 10, isPercent: false }], unlocks: ['terran_propulsion_t2'], flavorText: 'Ion particles propel your ships through the void.' },
  { id: 'terran_propulsion_t2', name: 'Fusion Drive', tier: 2, branch: 'propulsion', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_propulsion_t1'], unlockRequirements: { empireLevel: 10 }, researchCost: { metal: 150, crystal: 75 }, researchTime: 10, researchXP: 15, bonuses: [{ stat: 'fleet_speed', value: 20, isPercent: false }], unlocks: ['terran_propulsion_t3'], flavorText: 'Fusion reactions generate tremendous thrust.' },
  { id: 'terran_propulsion_t3', name: 'Ion Pulse', tier: 3, branch: 'propulsion', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_propulsion_t2'], unlockRequirements: { empireLevel: 25 }, researchCost: { metal: 300, crystal: 150 }, researchTime: 20, researchXP: 30, bonuses: [{ stat: 'fleet_speed', value: 35, isPercent: false }], unlocks: ['terran_propulsion_t4'], flavorText: 'Pulsed ion drives for sustained acceleration.' },
  { id: 'terran_propulsion_t4', name: 'Warp Drive', tier: 4, branch: 'propulsion', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_propulsion_t3'], unlockRequirements: { empireLevel: 50 }, researchCost: { metal: 600, crystal: 300 }, researchTime: 40, researchXP: 60, bonuses: [{ stat: 'fleet_speed', value: 50, isPercent: false }], unlocks: ['terran_propulsion_t5'], flavorText: 'Warp through the fabric of spacetime.' },
  { id: 'terran_propulsion_t5', name: 'Fold Drive', tier: 5, branch: 'propulsion', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_propulsion_t4'], unlockRequirements: { empireLevel: 100 }, researchCost: { metal: 1200, crystal: 600 }, researchTime: 80, researchXP: 120, bonuses: [{ stat: 'fleet_speed', value: 75, isPercent: false }], unlocks: ['terran_propulsion_t6'], flavorText: 'Fold space to traverse impossible distances.' },
  { id: 'terran_propulsion_t6', name: 'Transcendence', tier: 6, branch: 'propulsion', type: 'capstone', race: 'terran', prerequisiteTechs: ['terran_propulsion_t5'], unlockRequirements: { empireLevel: 200 }, researchCost: { metal: 3000, crystal: 1500 }, researchTime: 160, researchXP: 320, bonuses: [{ stat: 'fleet_speed', value: 100, isPercent: false }], unlocks: ['terran_propulsion_t7'], flavorText: 'Transcend the limits of physical travel.' },

  // ── SYSTEMS BRANCH ──
  { id: 'terran_systems_t1', name: 'Basic Sensors', tier: 1, branch: 'systems', type: 'trunk', race: 'terran', prerequisiteTechs: [], unlockRequirements: {}, researchCost: { metal: 50, crystal: 50 }, researchTime: 3, researchXP: 5, bonuses: [{ stat: 'sensor_range', value: 10, isPercent: false }], unlocks: ['terran_systems_t2'], flavorText: 'See beyond the visible spectrum.' },
  { id: 'terran_systems_t2', name: 'Radar Grid', tier: 2, branch: 'systems', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_systems_t1'], unlockRequirements: { empireLevel: 10 }, researchCost: { metal: 120, crystal: 120 }, researchTime: 8, researchXP: 12, bonuses: [{ stat: 'sensor_range', value: 20, isPercent: false }], unlocks: ['terran_systems_t3'], flavorText: 'A network of radar stations covers your territory.' },
  { id: 'terran_systems_t3', name: 'Quantum Scanners', tier: 3, branch: 'systems', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_systems_t2'], unlockRequirements: { empireLevel: 25 }, researchCost: { metal: 250, crystal: 250 }, researchTime: 18, researchXP: 25, bonuses: [{ stat: 'sensor_range', value: 35, isPercent: false }], unlocks: ['terran_systems_t4'], flavorText: 'Quantum entanglement enables instant scanning.' },
  { id: 'terran_systems_t4', name: 'AI Network', tier: 4, branch: 'systems', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_systems_t3'], unlockRequirements: { empireLevel: 50 }, researchCost: { metal: 500, crystal: 500 }, researchTime: 35, researchXP: 50, bonuses: [{ stat: 'research_speed', value: 20, isPercent: false }], unlocks: ['terran_systems_t5'], flavorText: 'Artificial intelligence coordinates your empire.' },
  { id: 'terran_systems_t5', name: 'Hive Intelligence', tier: 5, branch: 'systems', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_systems_t4'], unlockRequirements: { empireLevel: 100 }, researchCost: { metal: 1000, crystal: 1000 }, researchTime: 70, researchXP: 100, bonuses: [{ stat: 'research_speed', value: 40, isPercent: false }], unlocks: ['terran_systems_t6'], flavorText: 'A collective mind guides your civilization.' },
  { id: 'terran_systems_t6', name: 'Singularity Mind', tier: 6, branch: 'systems', type: 'capstone', race: 'terran', prerequisiteTechs: ['terran_systems_t5'], unlockRequirements: { empireLevel: 200 }, researchCost: { metal: 2500, crystal: 2500 }, researchTime: 140, researchXP: 280, bonuses: [{ stat: 'research_speed', value: 60, isPercent: false }], unlocks: ['terran_systems_t7'], flavorText: 'A singular consciousness encompasses all knowledge.' },

  // ── SPECIAL BRANCH (TERRAN) ──
  { id: 'terran_special_t1', name: 'Adaptability Core', tier: 1, branch: 'special', type: 'trunk', race: 'terran', prerequisiteTechs: [], unlockRequirements: {}, researchCost: { metal: 40, crystal: 40 }, researchTime: 4, researchXP: 8, bonuses: [{ stat: 'respec_speed', value: 15, isPercent: false }], unlocks: ['terran_special_t2'], flavorText: 'The Terran gift of adaptation.' },
  { id: 'terran_special_t2', name: 'Versatile Framework', tier: 2, branch: 'special', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_special_t1'], unlockRequirements: { empireLevel: 10 }, researchCost: { metal: 100, crystal: 100 }, researchTime: 8, researchXP: 15, bonuses: [{ stat: 'respec_speed', value: 25, isPercent: false }], unlocks: ['terran_special_t3'], flavorText: 'Flexible systems that adapt to any situation.' },
  { id: 'terran_special_t3', name: 'Hybrid Hull', tier: 3, branch: 'special', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_special_t2'], unlockRequirements: { empireLevel: 25 }, researchCost: { metal: 200, crystal: 200 }, researchTime: 16, researchXP: 25, bonuses: [{ stat: 'respec_speed', value: 35, isPercent: false }], unlocks: ['terran_special_t4'], flavorText: 'Combine the best of all technologies.' },
  { id: 'terran_special_t4', name: 'Adaptive AI', tier: 4, branch: 'special', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_special_t3'], unlockRequirements: { empireLevel: 50 }, researchCost: { metal: 400, crystal: 400 }, researchTime: 30, researchXP: 45, bonuses: [{ stat: 'respec_speed', value: 45, isPercent: false }], unlocks: ['terran_special_t5'], flavorText: 'AI that evolves to meet new challenges.' },
  { id: 'terran_special_t5', name: 'Rapid Adaptation', tier: 5, branch: 'special', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_special_t4'], unlockRequirements: { empireLevel: 100 }, researchCost: { metal: 800, crystal: 800 }, researchTime: 60, researchXP: 80, bonuses: [{ stat: 'respec_speed', value: 60, isPercent: false }], unlocks: ['terran_special_t6'], flavorText: 'Instantly adapt to any technological paradigm.' },
  { id: 'terran_special_t6', name: 'Universal Adaptability', tier: 6, branch: 'special', type: 'capstone', race: 'terran', prerequisiteTechs: ['terran_special_t5'], unlockRequirements: { empireLevel: 200 }, researchCost: { metal: 2000, crystal: 2000 }, researchTime: 120, researchXP: 240, bonuses: [{ stat: 'respec_speed', value: 80, isPercent: false }], unlocks: ['terran_special_t7'], flavorText: 'Master of all technological disciplines.' },

  // ── TIER 7+ (CONVERGENCE) ──
  { id: 'terran_hull_t7', name: 'Terran Ascendancy', tier: 7, branch: 'hull', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_hull_t6'], unlockRequirements: { empireLevel: 300 }, researchCost: { metal: 10000, crystal: 5000 }, researchTime: 400, researchXP: 800, bonuses: [{ stat: 'empire_capacity', value: 100, isPercent: false }], unlocks: ['terran_hull_t8'], flavorText: 'The Terran Empire rises to legend.' },
  { id: 'terran_weapons_t7', name: 'Nova Weaponry', tier: 7, branch: 'weapons', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_weapons_t6'], unlockRequirements: { empireLevel: 300 }, researchCost: { metal: 8000, crystal: 4000 }, researchTime: 350, researchXP: 700, bonuses: [{ stat: 'weapon_damage', value: 150, isPercent: false }], unlocks: ['terran_weapons_t8'], flavorText: 'Weapons that can shatter stars.' },
  { id: 'terran_propulsion_t7', name: 'Void Walking', tier: 7, branch: 'propulsion', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_propulsion_t6'], unlockRequirements: { empireLevel: 300 }, researchCost: { metal: 6000, crystal: 3000 }, researchTime: 300, researchXP: 600, bonuses: [{ stat: 'fleet_speed', value: 150, isPercent: false }], unlocks: ['terran_propulsion_t8'], flavorText: 'Walk between the stars.' },
  { id: 'terran_systems_t7', name: 'Omniscience', tier: 7, branch: 'systems', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_systems_t6'], unlockRequirements: { empireLevel: 300 }, researchCost: { metal: 5000, crystal: 5000 }, researchTime: 280, researchXP: 560, bonuses: [{ stat: 'research_speed', value: 100, isPercent: false }], unlocks: ['terran_systems_t8'], flavorText: 'Know everything. See everything.' },
  { id: 'terran_special_t7', name: 'Terran Legacy', tier: 7, branch: 'special', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_special_t6'], unlockRequirements: { empireLevel: 300 }, researchCost: { metal: 4000, crystal: 4000 }, researchTime: 240, researchXP: 480, bonuses: [{ stat: 'respec_speed', value: 100, isPercent: false }], unlocks: ['terran_special_t8'], flavorText: 'The legacy of humanity endures.' },

  // ── TIER 8 ──
  { id: 'terran_hull_t8', name: 'Empire Eternal', tier: 8, branch: 'hull', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_hull_t7'], unlockRequirements: { empireLevel: 500 }, researchCost: { metal: 20000, crystal: 10000 }, researchTime: 600, researchXP: 1200, bonuses: [{ stat: 'empire_capacity', value: 200, isPercent: false }], unlocks: ['terran_hull_t9'], flavorText: 'An empire that transcends time.' },
  { id: 'terran_weapons_t8', name: 'Star Buster', tier: 8, branch: 'weapons', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_weapons_t7'], unlockRequirements: { empireLevel: 500 }, researchCost: { metal: 16000, crystal: 8000 }, researchTime: 500, researchXP: 1000, bonuses: [{ stat: 'weapon_damage', value: 300, isPercent: false }], unlocks: ['terran_weapons_t9'], flavorText: 'Weapons that can destroy stars.' },
  { id: 'terran_propulsion_t8', name: 'Dimensional Shift', tier: 8, branch: 'propulsion', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_propulsion_t7'], unlockRequirements: { empireLevel: 500 }, researchCost: { metal: 12000, crystal: 6000 }, researchTime: 450, researchXP: 900, bonuses: [{ stat: 'fleet_speed', value: 300, isPercent: false }], unlocks: ['terran_propulsion_t9'], flavorText: 'Shift between dimensions.' },
  { id: 'terran_systems_t8', name: 'Hive God', tier: 8, branch: 'systems', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_systems_t7'], unlockRequirements: { empireLevel: 500 }, researchCost: { metal: 10000, crystal: 10000 }, researchTime: 400, researchXP: 800, bonuses: [{ stat: 'research_speed', value: 200, isPercent: false }], unlocks: ['terran_systems_t9'], flavorText: 'A godlike intelligence.' },
  { id: 'terran_special_t8', name: 'Species Perfection', tier: 8, branch: 'special', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_special_t7'], unlockRequirements: { empireLevel: 500 }, researchCost: { metal: 8000, crystal: 8000 }, researchTime: 360, researchXP: 720, bonuses: [{ stat: 'respec_speed', value: 200, isPercent: false }], unlocks: ['terran_special_t9'], flavorText: 'The pinnacle of Terran evolution.' },

  // ── TIER 9 ──
  { id: 'terran_hull_t9', name: 'Transcendent Core', tier: 9, branch: 'hull', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_hull_t8'], unlockRequirements: { empireLevel: 750, prestigeLevel: 1 }, researchCost: { metal: 40000, crystal: 20000 }, researchTime: 1000, researchXP: 2000, bonuses: [{ stat: 'empire_capacity', value: 400, isPercent: false }], unlocks: ['terran_hull_apex'], flavorText: 'The core of a transcendent empire.' },
  { id: 'terran_weapons_t9', name: 'Reality Cutter', tier: 9, branch: 'weapons', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_weapons_t8'], unlockRequirements: { empireLevel: 750, prestigeLevel: 1 }, researchCost: { metal: 32000, crystal: 16000 }, researchTime: 800, researchXP: 1600, bonuses: [{ stat: 'weapon_damage', value: 600, isPercent: false }], unlocks: ['terran_weapons_apex'], flavorText: 'Cut through the fabric of reality.' },
  { id: 'terran_propulsion_t9', name: 'Phase Shift', tier: 9, branch: 'propulsion', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_propulsion_t8'], unlockRequirements: { empireLevel: 750, prestigeLevel: 1 }, researchCost: { metal: 24000, crystal: 12000 }, researchTime: 700, researchXP: 1400, bonuses: [{ stat: 'fleet_speed', value: 600, isPercent: false }], unlocks: ['terran_propulsion_apex'], flavorText: 'Phase through spacetime at will.' },
  { id: 'terran_systems_t9', name: 'Cosmic Mind', tier: 9, branch: 'systems', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_systems_t8'], unlockRequirements: { empireLevel: 750, prestigeLevel: 1 }, researchCost: { metal: 20000, crystal: 20000 }, researchTime: 600, researchXP: 1200, bonuses: [{ stat: 'research_speed', value: 400, isPercent: false }], unlocks: ['terran_systems_apex'], flavorText: 'A mind that encompasses the cosmos.' },
  { id: 'terran_special_t9', name: 'Transcendence', tier: 9, branch: 'special', type: 'trunk', race: 'terran', prerequisiteTechs: ['terran_special_t8'], unlockRequirements: { empireLevel: 750, prestigeLevel: 1 }, researchCost: { metal: 16000, crystal: 16000 }, researchTime: 500, researchXP: 1000, bonuses: [{ stat: 'respec_speed', value: 400, isPercent: false }], unlocks: ['terran_special_apex'], flavorText: 'Transcend mortal limitations.' },

  // ── TIER 10 (APEX) ──
  { id: 'terran_hull_apex', name: 'The Inevitable', tier: 10, branch: 'hull', type: 'apex', race: 'terran', prerequisiteTechs: ['terran_hull_t9'], unlockRequirements: { empireLevel: 1000 }, researchCost: { metal: 100000, crystal: 50000 }, researchTime: 2000, researchXP: 4000, bonuses: [{ stat: 'empire_capacity', value: 1000, isPercent: false }], unlocks: [], flavorText: 'Your empire becomes the standard by which all others are measured.' },
  { id: 'terran_weapons_apex', name: 'Oblivion', tier: 10, branch: 'weapons', type: 'apex', race: 'terran', prerequisiteTechs: ['terran_weapons_t9'], unlockRequirements: { empireLevel: 1000 }, researchCost: { metal: 80000, crystal: 40000 }, researchTime: 1600, researchXP: 3200, bonuses: [{ stat: 'weapon_damage', value: 2000, isPercent: false }], unlocks: [], flavorText: 'The power to unmake reality.' },
  { id: 'terran_propulsion_apex', name: 'Infinity Drive', tier: 10, branch: 'propulsion', type: 'apex', race: 'terran', prerequisiteTechs: ['terran_propulsion_t9'], unlockRequirements: { empireLevel: 1000 }, researchCost: { metal: 60000, crystal: 30000 }, researchTime: 1400, researchXP: 2800, bonuses: [{ stat: 'fleet_speed', value: 2000, isPercent: false }], unlocks: [], flavorText: 'Travel beyond the boundaries of space.' },
  { id: 'terran_systems_apex', name: 'Godmind', tier: 10, branch: 'systems', type: 'apex', race: 'terran', prerequisiteTechs: ['terran_systems_t9'], unlockRequirements: { empireLevel: 1000 }, researchCost: { metal: 50000, crystal: 50000 }, researchTime: 1200, researchXP: 2400, bonuses: [{ stat: 'research_speed', value: 1000, isPercent: false }], unlocks: [], flavorText: 'A consciousness that spans the universe.' },
  { id: 'terran_special_apex', name: 'The Terran Apex', tier: 10, branch: 'special', type: 'apex', race: 'terran', prerequisiteTechs: ['terran_special_t9'], unlockRequirements: { empireLevel: 1000 }, researchCost: { metal: 40000, crystal: 40000 }, researchTime: 1000, researchXP: 2000, bonuses: [{ stat: 'respec_speed', value: 1000, isPercent: false }], unlocks: [], flavorText: 'The pinnacle of Terran achievement.' },
];

// ============================================================================
// CONVERGENCE REQUIREMENTS
// ============================================================================

export const CONVERGENCE_REQUIREMENTS: Record<number, string[]> = {
  6: ['hull', 'weapons'],
  7: ['hull', 'weapons', 'propulsion'],
  8: ['hull', 'weapons', 'propulsion', 'systems', 'special'],
  9: ['hull', 'weapons', 'propulsion', 'systems', 'special'],
  10: ['hull', 'weapons', 'propulsion', 'systems', 'special'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTechNodesForRace(raceId: RaceId): WoWsTechNode[] {
  if (raceId === 'terran') return TERRAN_TECH_TREE;
  // Other races would be added here
  return TERRAN_TECH_TREE;
}

export function getTechNodeById(nodeId: string, raceId: RaceId): WoWsTechNode | undefined {
  return getTechNodesForRace(raceId).find(node => node.id === nodeId);
}

export function getNodesByBranch(branch: TechBranch, raceId: RaceId): WoWsTechNode[] {
  return getTechNodesForRace(raceId).filter(node => node.branch === branch);
}

export function getNodesByTier(tier: number, raceId: RaceId): WoWsTechNode[] {
  return getTechNodesForRace(raceId).filter(node => node.tier === tier);
}

export function canResearchNode(nodeId: string, researchedTechs: string[], raceId: RaceId): boolean {
  const node = getTechNodeById(nodeId, raceId);
  if (!node) return false;
  return node.prerequisiteTechs.every(prereq => researchedTechs.includes(prereq));
}

export function getForkOptions(forkId: string, raceId: RaceId): ForkOption[] {
  const node = getTechNodesForRace(raceId).find(n => n.fork?.id === forkId);
  return node?.fork?.options || [];
}

export function getModuleForHull(hullType: string, category: 'weapon' | 'engine' | 'shield'): SharedModule[] {
  return SHARED_MODULES.filter(mod => 
    mod.category === category && 
    (mod.compatibleHulls.includes('all') || mod.compatibleHulls.includes(hullType))
  );
}

export function calculateResearchCost(baseCost: ResourceCost, tier: number, raceModifier: number = 1, governmentModifier: number = 1): ResourceCost {
  const multiplier = TIER_GATES[tier - 1]?.researchCostMultiplier || 1;
  return {
    metal: Math.floor((baseCost.metal || 0) * multiplier * raceModifier * governmentModifier),
    crystal: Math.floor((baseCost.crystal || 0) * multiplier * raceModifier * governmentModifier),
    deuterium: Math.floor((baseCost.deuterium || 0) * multiplier * raceModifier * governmentModifier),
    credits: Math.floor((baseCost.credits || 0) * multiplier * raceModifier * governmentModifier),
  };
}

export function calculateResearchTime(baseTime: number, tier: number, speedModifiers: { labLevel?: number; governmentBonus?: number; raceBonus?: number } = {}): number {
  const timeMultiplier = TIER_GATES[tier - 1]?.timeMultiplier || 1;
  let speed = 1;
  if (speedModifiers.labLevel) speed += speedModifiers.labLevel * 0.1;
  if (speedModifiers.governmentBonus) speed += speedModifiers.governmentBonus;
  if (speedModifiers.raceBonus) speed += speedModifiers.raceBonus;
  return Math.ceil((baseTime * timeMultiplier) / speed);
}
