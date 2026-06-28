/**
 * COMMANDER TECH TREE & SKILL TREE SYSTEM
 * =============================================================================
 * EVE Online-inspired character progression system for commanders
 * 
 * Systems:
 *   1. Primary Attributes (Intelligence, Perception, Willpower, Memory, Charisma)
 *   2. Skill Groups & Categories  
 *   3. Skill Levels (1-5 per skill)
 *   4. Skill Queue & Training
 *   5. Prerequisites & Skill Trees
 *   6. Implants & Boosters
 *   7. Skill Remaps & Specialization
 *   8. Commander Ranks & Titles
 */

import { ProgressionSystem } from './progressionSystem';

// =============================================================================
// ATTRIBUTES
// =============================================================================

export type PrimaryAttribute = 'intelligence' | 'perception' | 'willpower' | 'memory' | 'charisma';

export interface AttributeConfig {
  id: PrimaryAttribute;
  name: string;
  description: string;
  icon: string;
  baseValue: number;
  maxValue: number;
}

export const ATTRIBUTES: Record<PrimaryAttribute, AttributeConfig> = {
  intelligence: {
    id: 'intelligence',
    name: 'Intelligence',
    description: 'Governs scientific, engineering, and electronic skills. Determines neural mapping efficiency.',
    icon: '🧠',
    baseValue: 17,
    maxValue: 80,
  },
  perception: {
    id: 'perception',
    name: 'Perception',
    description: 'Governs weapons, piloting, and targeting skills. Determines reaction time and spatial awareness.',
    icon: '👁️',
    baseValue: 17,
    maxValue: 80,
  },
  willpower: {
    id: 'willpower',
    name: 'Willpower',
    description: 'Governs leadership, command, and social skills. Determines resistance to electronic warfare.',
    icon: '💪',
    baseValue: 17,
    maxValue: 80,
  },
  memory: {
    id: 'memory',
    name: 'Memory',
    description: 'Governs industry, trade, and production skills. Determines information retention.',
    icon: '📝',
    baseValue: 17,
    maxValue: 80,
  },
  charisma: {
    id: 'charisma',
    name: 'Charisma',
    description: 'Governs social, diplomatic, and trade skills. Determines negotiation effectiveness.',
    icon: '💬',
    baseValue: 17,
    maxValue: 80,
  },
};

// =============================================================================
// SKILL GROUPS
// =============================================================================

export type SkillGroup =
  | 'command' | 'tactical' | 'engineering' | 'electronics' | 'navigation'
  | 'science' | 'industry' | 'social' | 'trade' | 'production'
  | 'shield' | 'armor' | 'weapons' | 'mining' | 'exploration'
  | 'drones' | 'targeting' | 'corporation' | 'subsystems' | 'special';

export type SkillCategory = 
  | 'learning' | 'spaceship-command' | 'gunnery' | 'missiles' | 'drones'
  | 'electronic-systems' | 'engineering' | 'navigation' | 'shields'
  | 'armor' | 'science' | 'industry' | 'trade' | 'social'
  | 'corporation' | 'production' | 'exploration' | 'subsystems'
  | 'scanning' | 'leadership';

export interface SkillGroupConfig {
  id: SkillGroup;
  name: string;
  description: string;
  icon: string;
  primaryAttribute: PrimaryAttribute;
  secondaryAttribute: PrimaryAttribute;
}

export const SKILL_GROUPS: Record<SkillGroup, SkillGroupConfig> = {
  command: {
    id: 'command',
    name: 'Command',
    description: 'Leadership and fleet command abilities.',
    icon: '⚔️',
    primaryAttribute: 'willpower',
    secondaryAttribute: 'charisma',
  },
  tactical: {
    id: 'tactical',
    name: 'Tactical',
    description: 'Combat strategy and tactical operations.',
    icon: '🎯',
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
  },
  engineering: {
    id: 'engineering',
    name: 'Engineering',
    description: 'Ship systems, power grids, and capacitor management.',
    icon: '⚡',
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
  },
  electronics: {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic systems, sensors, and targeting.',
    icon: '🔌',
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
  },
  navigation: {
    id: 'navigation',
    name: 'Navigation',
    description: 'Ship handling, warp drives, and piloting.',
    icon: '🧭',
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
  },
  science: {
    id: 'science',
    name: 'Science',
    description: 'Research, technology, and discovery.',
    icon: '🔬',
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
  },
  industry: {
    id: 'industry',
    name: 'Industry',
    description: 'Manufacturing, refining, and resource processing.',
    icon: '🏭',
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
  },
  social: {
    id: 'social',
    name: 'Social',
    description: 'Interpersonal skills and diplomacy.',
    icon: '🤝',
    primaryAttribute: 'charisma',
    secondaryAttribute: 'intelligence',
  },
  trade: {
    id: 'trade',
    name: 'Trade',
    description: 'Market trading and economic skills.',
    icon: '💰',
    primaryAttribute: 'charisma',
    secondaryAttribute: 'memory',
  },
  production: {
    id: 'production',
    name: 'Production',
    description: 'Blueprint manufacturing and material efficiency.',
    icon: '🛠️',
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
  },
  shield: {
    id: 'shield',
    name: 'Shield Systems',
    description: 'Shield operation, boosters, and resistance management.',
    icon: '🛡️',
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
  },
  armor: {
    id: 'armor',
    name: 'Armor Systems',
    description: 'Armor plating, repair, and hardening.',
    icon: '🧱',
    primaryAttribute: 'willpower',
    secondaryAttribute: 'memory',
  },
  weapons: {
    id: 'weapons',
    name: 'Weapons Technology',
    description: 'Weapon systems, gunnery, and damage application.',
    icon: '🔫',
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
  },
  mining: {
    id: 'mining',
    name: 'Mining',
    description: 'Asteroid mining and gas harvesting.',
    icon: '⛏️',
    primaryAttribute: 'memory',
    secondaryAttribute: 'perception',
  },
  exploration: {
    id: 'exploration',
    name: 'Exploration',
    description: 'Scanning, hacking, and relic recovery.',
    icon: '🗺️',
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
  },
  drones: {
    id: 'drones',
    name: 'Drones',
    description: 'Drone operation, control, and combat.',
    icon: '🐝',
    primaryAttribute: 'memory',
    secondaryAttribute: 'perception',
  },
  targeting: {
    id: 'targeting',
    name: 'Targeting',
    description: 'Target acquisition, tracking, and electronic warfare.',
    icon: '🎯',
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
  },
  corporation: {
    id: 'corporation',
    name: 'Corporation',
    description: 'Alliance and corporation management.',
    icon: '🏛️',
    primaryAttribute: 'charisma',
    secondaryAttribute: 'memory',
  },
  subsystems: {
    id: 'subsystems',
    name: 'Subsystems',
    description: 'Tech-3 ship subsystem technology.',
    icon: '🔧',
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
  },
  special: {
    id: 'special',
    name: 'Special',
    description: 'Unique and rare specialist skills.',
    icon: '⭐',
    primaryAttribute: 'willpower',
    secondaryAttribute: 'charisma',
  },
};

// =============================================================================
// SKILL DEFINITIONS
// =============================================================================

export interface SkillPrerequisite {
  skillId: string;
  level: number;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  group: SkillGroup;
  category: SkillCategory;
  maxLevel: number; // 1-5
  trainingTimeMultiplier: number;
  prerequisites: SkillPrerequisite[];
  bonusesPerLevel: string[];
  isLearning: boolean;
  isHidden: boolean;
  requiredAttribute: PrimaryAttribute;
  rank: number; // 1-15, affects training time
}

// =============================================================================
// COMPLETE SKILL TREE (100+ skills across all groups)
// =============================================================================

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  // ---- LEARNING GROUP ----
  {
    id: 'skl-analytical-mind',
    name: 'Analytical Mind',
    description: 'Increases intelligence attribute by 10% per level.',
    group: 'science',
    category: 'learning',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+10% Intelligence', '+2% Memory'],
    isLearning: true,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 1,
  },
  {
    id: 'skl-spatial-awareness',
    name: 'Spatial Awareness',
    description: 'Increases perception attribute by 10% per level.',
    group: 'navigation',
    category: 'learning',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+10% Perception', '+2% Willpower'],
    isLearning: true,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 1,
  },
  {
    id: 'skl-iron-will',
    name: 'Iron Will',
    description: 'Increases willpower attribute by 10% per level.',
    group: 'command',
    category: 'learning',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+10% Willpower', '+2% Charisma'],
    isLearning: true,
    isHidden: false,
    requiredAttribute: 'willpower',
    rank: 1,
  },
  {
    id: 'skl-eidetic-memory',
    name: 'Eidetic Memory',
    description: 'Increases memory attribute by 10% per level.',
    group: 'science',
    category: 'learning',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+10% Memory', '+2% Intelligence'],
    isLearning: true,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 1,
  },
  {
    id: 'skl-empathic-resonance',
    name: 'Empathic Resonance',
    description: 'Increases charisma attribute by 10% per level.',
    group: 'social',
    category: 'learning',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+10% Charisma', '+2% Willpower'],
    isLearning: true,
    isHidden: false,
    requiredAttribute: 'charisma',
    rank: 1,
  },
  {
    id: 'skl-advanced-mapping',
    name: 'Advanced Neural Mapping',
    description: 'Reduces all skill training time by 5% per level.',
    group: 'science',
    category: 'learning',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-analytical-mind', level: 4 },
      { skillId: 'skl-spatial-awareness', level: 4 },
      { skillId: 'skl-iron-will', level: 4 },
      { skillId: 'skl-eidetic-memory', level: 4 },
      { skillId: 'skl-empathic-resonance', level: 4 },
    ],
    bonusesPerLevel: ['-5% Training Time', '+1 Attribute Points'],
    isLearning: true,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 3,
  },
  {
    id: 'skl-accelerated-learning',
    name: 'Accelerated Learning',
    description: 'Further reduces skill training time by 3% per level. Requires Advanced Neural Mapping.',
    group: 'science',
    category: 'learning',
    maxLevel: 3,
    trainingTimeMultiplier: 8.0,
    prerequisites: [
      { skillId: 'skl-advanced-mapping', level: 5 },
    ],
    bonusesPerLevel: ['-3% Training Time', 'Unlocks elite skills'],
    isLearning: true,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 5,
  },

  // ---- SPACESHIP COMMAND ----
  {
    id: 'skl-frigate-command',
    name: 'Frigate Command',
    description: 'Allows operation of frigate-class vessels. 10% improved agility per level.',
    group: 'navigation',
    category: 'spaceship-command',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [],
    bonusesPerLevel: ['+10% Agility', '+5% Speed', 'Unlocks T2 Frigates at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 2,
  },
  {
    id: 'skl-cruiser-command',
    name: 'Cruiser Command',
    description: 'Allows operation of cruiser-class vessels. 10% improved agility per level.',
    group: 'navigation',
    category: 'spaceship-command',
    maxLevel: 5,
    trainingTimeMultiplier: 5.0,
    prerequisites: [
      { skillId: 'skl-frigate-command', level: 3 },
    ],
    bonusesPerLevel: ['+10% Agility', '+5% HP', 'Unlocks T2 Cruisers at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 5,
  },
  {
    id: 'skl-battleship-command',
    name: 'Battleship Command',
    description: 'Allows operation of battleship-class vessels. 10% improved agility per level.',
    group: 'navigation',
    category: 'spaceship-command',
    maxLevel: 5,
    trainingTimeMultiplier: 10.0,
    prerequisites: [
      { skillId: 'skl-cruiser-command', level: 4 },
    ],
    bonusesPerLevel: ['+10% Agility', '+5% Turret Damage', 'Unlocks T2 Battleships at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 8,
  },
  {
    id: 'skl-capital-ship-command',
    name: 'Capital Ship Command',
    description: 'Allows operation of dreadnoughts, carriers, and other capital vessels.',
    group: 'navigation',
    category: 'spaceship-command',
    maxLevel: 5,
    trainingTimeMultiplier: 16.0,
    prerequisites: [
      { skillId: 'skl-battleship-command', level: 5 },
    ],
    bonusesPerLevel: ['+10% Capital Agility', '-5% Capital Build Time'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 12,
  },
  {
    id: 'skl-titan-command',
    name: 'Titan Command',
    description: 'Allows operation of titan-class supercapital vessels.',
    group: 'navigation',
    category: 'spaceship-command',
    maxLevel: 5,
    trainingTimeMultiplier: 24.0,
    prerequisites: [
      { skillId: 'skl-capital-ship-command', level: 5 },
    ],
    bonusesPerLevel: ['+10% Titan Agility', 'Doomsday Device Control'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 15,
  },
  {
    id: 'skl-industrial-command',
    name: 'Industrial Command',
    description: 'Allows operation of industrial and mining vessels.',
    group: 'navigation',
    category: 'spaceship-command',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-frigate-command', level: 2 },
    ],
    bonusesPerLevel: ['+10% Cargo Capacity', '+5% Mining Yield'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 3,
  },
  {
    id: 'skl-transport-ship-command',
    name: 'Transport Ship Command',
    description: 'Allows operation of specialized transport and freighter vessels.',
    group: 'navigation',
    category: 'spaceship-command',
    maxLevel: 5,
    trainingTimeMultiplier: 6.0,
    prerequisites: [
      { skillId: 'skl-industrial-command', level: 4 },
    ],
    bonusesPerLevel: ['+15% Cargo Capacity', '+10% Shield HP'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 6,
  },

  // ---- GUNNERY ----
  {
    id: 'skl-gunnery',
    name: 'Gunnery',
    description: 'Base gunnery skill. 2% reduction in weapon cycle time per level.',
    group: 'weapons',
    category: 'gunnery',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['-2% Weapon Cycle Time', '+2% Accuracy'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 1,
  },
  {
    id: 'skl-motion-prediction',
    name: 'Motion Prediction',
    description: 'Improves tracking speed by 5% per level for all weapons.',
    group: 'weapons',
    category: 'gunnery',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-gunnery', level: 2 },
    ],
    bonusesPerLevel: ['+5% Tracking Speed', '+2% Hit Chance vs Fast Targets'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 2,
  },
  {
    id: 'skl-rapid-firing',
    name: 'Rapid Firing',
    description: 'Reduces weapon rate of fire delay by 2% per level.',
    group: 'weapons',
    category: 'gunnery',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-gunnery', level: 3 },
    ],
    bonusesPerLevel: ['-2% Rate of Fire', '+3% DPS'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 2,
  },
  {
    id: 'skl-surgical-strike',
    name: 'Surgical Strike',
    description: 'Increases damage by 3% per level for all weapon systems.',
    group: 'weapons',
    category: 'gunnery',
    maxLevel: 5,
    trainingTimeMultiplier: 4.0,
    prerequisites: [
      { skillId: 'skl-gunnery', level: 5 },
      { skillId: 'skl-motion-prediction', level: 3 },
    ],
    bonusesPerLevel: ['+3% All Weapon Damage', '+2% Critical Chance'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 6,
  },
  {
    id: 'skl-trajectory-analysis',
    name: 'Trajectory Analysis',
    description: 'Reduces weapon falloff penalty by 3% per level.',
    group: 'weapons',
    category: 'gunnery',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-gunnery', level: 4 },
    ],
    bonusesPerLevel: ['-3% Falloff Penalty', '+2% Optimal Range'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 4,
  },
  {
    id: 'skl-weapon-upgrades',
    name: 'Weapon Upgrades',
    description: 'Reduces weapon power grid requirements by 5% per level.',
    group: 'weapons',
    category: 'gunnery',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-gunnery', level: 2 },
    ],
    bonusesPerLevel: ['-5% Power Grid Need', 'Unlocks T2 Upgrades at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 2,
  },
  {
    id: 'skl-advanced-weapon-upgrades',
    name: 'Advanced Weapon Upgrades',
    description: 'Further reduces weapon power grid requirements by 2% per level.',
    group: 'weapons',
    category: 'gunnery',
    maxLevel: 5,
    trainingTimeMultiplier: 5.0,
    prerequisites: [
      { skillId: 'skl-weapon-upgrades', level: 5 },
    ],
    bonusesPerLevel: ['-2% Power Grid Need', 'Unlocks T2 Advanced Weapons'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 7,
  },

  // ---- MISSILES ----
  {
    id: 'skl-missile-launcher',
    name: 'Missile Launcher Operation',
    description: 'Basic missile operation. 2% reduction in missile flight time per level.',
    group: 'weapons',
    category: 'missiles',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [
      { skillId: 'skl-gunnery', level: 1 },
    ],
    bonusesPerLevel: ['-2% Flight Time', '+2% Missile Velocity'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 1,
  },
  {
    id: 'skl-warhead-upgrades',
    name: 'Warhead Upgrades',
    description: 'Increases missile damage by 3% per level.',
    group: 'weapons',
    category: 'missiles',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-missile-launcher', level: 4 },
    ],
    bonusesPerLevel: ['+3% Missile Damage', '+2% Explosion Radius'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 4,
  },
  {
    id: 'skl-target-navigation',
    name: 'Target Navigation Prediction',
    description: 'Improves missile tracking speed by 7% per level.',
    group: 'weapons',
    category: 'missiles',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-missile-launcher', level: 2 },
    ],
    bonusesPerLevel: ['+7% Explosion Velocity', '+3% Damage vs Fast Targets'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 2,
  },

  // ---- DRONES ----
  {
    id: 'skl-drone-control',
    name: 'Drone Control',
    description: 'Allows control of one additional drone per level.',
    group: 'drones',
    category: 'drones',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [],
    bonusesPerLevel: ['+1 Drone Control', '+2% Drone Damage'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 2,
  },
  {
    id: 'skl-heavy-drone',
    name: 'Heavy Drone Operation',
    description: 'Allows use of heavy combat drones. 2% damage per level.',
    group: 'drones',
    category: 'drones',
    maxLevel: 5,
    trainingTimeMultiplier: 4.0,
    prerequisites: [
      { skillId: 'skl-drone-control', level: 5 },
    ],
    bonusesPerLevel: ['+2% Heavy Drone Damage', 'Unlocks Sentry Drones at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 5,
  },
  {
    id: 'skl-drone-interfacing',
    name: 'Drone Interfacing',
    description: 'Increases drone damage and HP by 10% per level.',
    group: 'drones',
    category: 'drones',
    maxLevel: 5,
    trainingTimeMultiplier: 5.0,
    prerequisites: [
      { skillId: 'skl-drone-control', level: 4 },
    ],
    bonusesPerLevel: ['+10% Drone Damage', '+10% Drone HP', 'Unlocks T2 Drones at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 6,
  },
  {
    id: 'skl-drone-durability',
    name: 'Drone Durability',
    description: 'Increases drone hull hitpoints by 10% per level.',
    group: 'drones',
    category: 'drones',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-drone-control', level: 2 },
    ],
    bonusesPerLevel: ['+10% Drone HP', '+5% Drone Shield'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 3,
  },
  {
    id: 'skl-drone-navigation',
    name: 'Drone Navigation',
    description: 'Increases drone movement speed by 10% per level.',
    group: 'drones',
    category: 'drones',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-drone-control', level: 3 },
    ],
    bonusesPerLevel: ['+10% Drone Speed', '+5% Drone Range'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 3,
  },

  // ---- ELECTRONIC SYSTEMS ----
  {
    id: 'skl-electronic-warfare',
    name: 'Electronic Warfare',
    description: 'Improves electronic warfare module effectiveness by 5% per level.',
    group: 'electronics',
    category: 'electronic-systems',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [],
    bonusesPerLevel: ['+5% EW Effectiveness', '+2% Jam Strength'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 3,
  },
  {
    id: 'skl-targeting-system',
    name: 'Targeting System Optimization',
    description: 'Increases targeting range by 10% per level.',
    group: 'targeting',
    category: 'electronic-systems',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [],
    bonusesPerLevel: ['+10% Targeting Range', '+1 Max Locked Targets per 2 levels'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 2,
  },
  {
    id: 'skl-long-range-targeting',
    name: 'Long Range Targeting',
    description: 'Further increases targeting range by 15% per level.',
    group: 'targeting',
    category: 'electronic-systems',
    maxLevel: 5,
    trainingTimeMultiplier: 4.0,
    prerequisites: [
      { skillId: 'skl-targeting-system', level: 5 },
    ],
    bonusesPerLevel: ['+15% Targeting Range', '+1 Max Locked Targets'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 5,
  },
  {
    id: 'skl-signature-analysis',
    name: 'Signature Analysis',
    description: 'Reduces target lock time by 5% per level.',
    group: 'targeting',
    category: 'electronic-systems',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-targeting-system', level: 2 },
    ],
    bonusesPerLevel: ['-5% Lock Time', '+2% Scan Resolution'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 2,
  },
  {
    id: 'skl-sensor-linking',
    name: 'Sensor Linking',
    description: 'Enhances remote sensor booster effectiveness by 10% per level.',
    group: 'electronics',
    category: 'electronic-systems',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-signature-analysis', level: 3 },
    ],
    bonusesPerLevel: ['+10% Sensor Boost', '+5% Targeting Range Bonus'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 4,
  },
  {
    id: 'skl-cloaking',
    name: 'Cloaking Operation',
    description: 'Reduces cloaking module capacitor drain by 10% per level.',
    group: 'electronics',
    category: 'electronic-systems',
    maxLevel: 5,
    trainingTimeMultiplier: 6.0,
    prerequisites: [
      { skillId: 'skl-electronic-warfare', level: 4 },
    ],
    bonusesPerLevel: ['-10% Cloak Cap Drain', '-2s Cloak Delay', 'Unlocks Covert Ops at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 8,
  },

  // ---- ENGINEERING ----
  {
    id: 'skl-power-grid-command',
    name: 'Power Grid Command',
    description: 'Increases ship power grid output by 5% per level.',
    group: 'engineering',
    category: 'engineering',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+5% Power Grid', '+2% Capacitor Capacity'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 1,
  },
  {
    id: 'skl-capacitor-command',
    name: 'Capacitor Command',
    description: 'Increases capacitor capacity by 5% per level.',
    group: 'engineering',
    category: 'engineering',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+5% Capacitor', '+2% Cap Recharge'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 1,
  },
  {
    id: 'skl-capacitor-recharge',
    name: 'Capacitor Recharge',
    description: 'Improves capacitor recharge rate by 5% per level.',
    group: 'engineering',
    category: 'engineering',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-capacitor-command', level: 3 },
    ],
    bonusesPerLevel: ['+5% Cap Recharge Rate', '+2% Capacitor'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 3,
  },
  {
    id: 'skl-engineering-command',
    name: 'Engineering Command',
    description: 'Comprehensive engineering skill. 5% bonus to hull HP per level.',
    group: 'engineering',
    category: 'engineering',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-power-grid-command', level: 4 },
      { skillId: 'skl-capacitor-command', level: 4 },
    ],
    bonusesPerLevel: ['+5% Hull HP', '+3% All Resistances'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 4,
  },
  {
    id: 'skl-capacitor-emission',
    name: 'Capacitor Emission Systems',
    description: 'Improves capacitor transfer and neutralizer effectiveness by 10% per level.',
    group: 'engineering',
    category: 'engineering',
    maxLevel: 5,
    trainingTimeMultiplier: 4.0,
    prerequisites: [
      { skillId: 'skl-capacitor-recharge', level: 4 },
    ],
    bonusesPerLevel: ['+10% Cap Transfer', '+10% Neutralizer', 'Unlocks T2 Cap Modules'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 6,
  },

  // ---- NAVIGATION ----
  {
    id: 'skl-navigation',
    name: 'Navigation',
    description: 'Increases ship velocity by 5% per level.',
    group: 'navigation',
    category: 'navigation',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+5% Velocity', '+2% Agility'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 1,
  },
  {
    id: 'skl-accelerated-navigation',
    name: 'Accelerated Navigation',
    description: 'Further increases velocity by 5% per level.',
    group: 'navigation',
    category: 'navigation',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-navigation', level: 4 },
    ],
    bonusesPerLevel: ['+5% Velocity', 'Unlocks Afterburners at L3'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 3,
  },
  {
    id: 'skl-warp-drive',
    name: 'Warp Drive Operation',
    description: 'Reduces warp capacitor cost by 10% per level.',
    group: 'navigation',
    category: 'navigation',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [
      { skillId: 'skl-navigation', level: 2 },
    ],
    bonusesPerLevel: ['-10% Warp Cap Cost', '-5% Warp Cooldown'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 1,
  },
  {
    id: 'skl-evasion',
    name: 'Tactical Evasion',
    description: 'Increases ship agility and signature radius reduction by 3% per level.',
    group: 'navigation',
    category: 'navigation',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-navigation', level: 5 },
    ],
    bonusesPerLevel: ['+3% Agility', '-3% Signature Radius'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'perception',
    rank: 4,
  },

  // ---- SHIELDS ----
  {
    id: 'skl-shield-operation',
    name: 'Shield Operation',
    description: 'Increases shield HP by 5% per level.',
    group: 'shield',
    category: 'shields',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+5% Shield HP', '+2% Shield Recharge'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 1,
  },
  {
    id: 'skl-shield-management',
    name: 'Shield Management',
    description: 'Increases shield capacity by 5% per level.',
    group: 'shield',
    category: 'shields',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-shield-operation', level: 4 },
    ],
    bonusesPerLevel: ['+5% Shield Capacity', '+3% Shield HP'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 4,
  },
  {
    id: 'skl-shield-compensation',
    name: 'Shield Compensation',
    description: 'Improves shield resistance modules by 5% per level.',
    group: 'shield',
    category: 'shields',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-shield-operation', level: 3 },
    ],
    bonusesPerLevel: ['+5% Shield Resist Bonus', 'Unlocks T2 Hardeners at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 3,
  },
  {
    id: 'skl-tactical-shield',
    name: 'Tactical Shield Manipulation',
    description: 'Reduces shield recharge delay by 10% per level.',
    group: 'shield',
    category: 'shields',
    maxLevel: 5,
    trainingTimeMultiplier: 4.0,
    prerequisites: [
      { skillId: 'skl-shield-management', level: 5 },
    ],
    bonusesPerLevel: ['-10% Recharge Delay', '+5% Shield Boost'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 6,
  },

  // ---- ARMOR ----
  {
    id: 'skl-armor-operation',
    name: 'Armor Operation',
    description: 'Reduces armor repair cycle time by 5% per level.',
    group: 'armor',
    category: 'armor',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['-5% Repair Cycle', '+2% Armor HP'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'willpower',
    rank: 1,
  },
  {
    id: 'skl-armor-management',
    name: 'Armor Management',
    description: 'Increases armor HP by 5% per level.',
    group: 'armor',
    category: 'armor',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-armor-operation', level: 4 },
    ],
    bonusesPerLevel: ['+5% Armor HP', '+3% Armor Resist'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'willpower',
    rank: 3,
  },
  {
    id: 'skl-hull-upgrades',
    name: 'Hull Upgrades',
    description: 'Increases hull hitpoints by 5% per level.',
    group: 'armor',
    category: 'armor',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-armor-operation', level: 2 },
    ],
    bonusesPerLevel: ['+5% Hull HP', '+2% Armor'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'willpower',
    rank: 2,
  },
  {
    id: 'skl-remote-armor',
    name: 'Remote Armor Repair',
    description: 'Improves remote armor repair systems by 5% per level.',
    group: 'armor',
    category: 'armor',
    maxLevel: 5,
    trainingTimeMultiplier: 4.0,
    prerequisites: [
      { skillId: 'skl-armor-management', level: 4 },
    ],
    bonusesPerLevel: ['+5% Remote Repair', '+10% Range'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'willpower',
    rank: 5,
  },

  // ---- SCIENCE ----
  {
    id: 'skl-science',
    name: 'Science',
    description: 'Base research skill. 1x for datacore production at L5.',
    group: 'science',
    category: 'science',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+1 Datacore Efficiency', 'Unlocks Research at L5'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 1,
  },
  {
    id: 'skl-research',
    name: 'Research',
    description: 'Improves blueprint research time by 10% per level.',
    group: 'science',
    category: 'science',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-science', level: 5 },
    ],
    bonusesPerLevel: ['-10% Research Time', '+1 ME Research Slot'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 4,
  },
  {
    id: 'skl-metallurgy',
    name: 'Metallurgy',
    description: 'Improves material efficiency research speed by 10% per level.',
    group: 'science',
    category: 'science',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-science', level: 4 },
    ],
    bonusesPerLevel: ['-10% ME Research', 'Unlocks ME Research at L1'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 4,
  },
  {
    id: 'skl-laboratory-operation',
    name: 'Laboratory Operation',
    description: 'Allows operation of an additional research lab per level.',
    group: 'science',
    category: 'science',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-science', level: 3 },
    ],
    bonusesPerLevel: ['+1 Research Slot', '-5% Research Time'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 2,
  },
  {
    id: 'skl-advanced-laboratory',
    name: 'Advanced Laboratory Operation',
    description: 'Allows advanced research activities. +1 additional slot per level.',
    group: 'science',
    category: 'science',
    maxLevel: 5,
    trainingTimeMultiplier: 5.0,
    prerequisites: [
      { skillId: 'skl-laboratory-operation', level: 5 },
    ],
    bonusesPerLevel: ['+1 Advanced Slot', '-8% Research Time'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 7,
  },
  {
    id: 'skl-invention',
    name: 'Invention',
    description: 'Improves invention success chance by 10% per level.',
    group: 'science',
    category: 'science',
    maxLevel: 5,
    trainingTimeMultiplier: 8.0,
    prerequisites: [
      { skillId: 'skl-advanced-laboratory', level: 3 },
      { skillId: 'skl-research', level: 5 },
    ],
    bonusesPerLevel: ['+10% Invention Chance', '-5% Invention Time'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 10,
  },

  // ---- INDUSTRY ----
  {
    id: 'skl-industry',
    name: 'Industry',
    description: 'Base industry skill. 3% improvement in manufacturing speed per level.',
    group: 'industry',
    category: 'industry',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+3% Manufacturing Speed', '-2% Material Waste'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 1,
  },
  {
    id: 'skl-mass-production',
    name: 'Mass Production',
    description: 'Allows one additional manufacturing line per level.',
    group: 'industry',
    category: 'industry',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-industry', level: 4 },
    ],
    bonusesPerLevel: ['+1 Manufacturing Line', '-3% Manufacturing Time'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 3,
  },
  {
    id: 'skl-advanced-industry',
    name: 'Advanced Industry',
    description: 'Allows advanced manufacturing. +1 line per level.',
    group: 'industry',
    category: 'industry',
    maxLevel: 5,
    trainingTimeMultiplier: 5.0,
    prerequisites: [
      { skillId: 'skl-mass-production', level: 5 },
    ],
    bonusesPerLevel: ['+1 Advanced Line', '-5% Manufacturing Time', 'Unlocks T2 Production'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 7,
  },
  {
    id: 'skl-supply-chain',
    name: 'Supply Chain Management',
    description: 'Reduces material requirements by 2% per level for manufacturing.',
    group: 'industry',
    category: 'industry',
    maxLevel: 5,
    trainingTimeMultiplier: 4.0,
    prerequisites: [
      { skillId: 'skl-industry', level: 5 },
    ],
    bonusesPerLevel: ['-2% Material Requirements', '+1 ME Level on Manufacture'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'memory',
    rank: 5,
  },

  // ---- TRADE ----
  {
    id: 'skl-trade',
    name: 'Trade',
    description: 'Reduces market transaction tax by 5% per level.',
    group: 'trade',
    category: 'trade',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['-5% Tax', '+2 Trade Slots'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'charisma',
    rank: 1,
  },
  {
    id: 'skl-wholesale',
    name: 'Wholesale Trading',
    description: 'Increases maximum order volume by 50% per level.',
    group: 'trade',
    category: 'trade',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-trade', level: 4 },
    ],
    bonusesPerLevel: ['+50% Order Volume', '+1 Trade Slot'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'charisma',
    rank: 3,
  },
  {
    id: 'skl-black-market-trading',
    name: 'Black Market Trading',
    description: 'ILLEGAL: Allows trading in contraband goods. Reduces scan risk by 10% per level.',
    group: 'trade',
    category: 'trade',
    maxLevel: 5,
    trainingTimeMultiplier: 8.0,
    prerequisites: [
      { skillId: 'skl-trade', level: 5 },
      { skillId: 'skl-wholesale', level: 3 },
    ],
    bonusesPerLevel: ['-10% Scan Risk', '+20% Black Market Profit', 'Unlocks Smuggling Networks'],
    isLearning: false,
    isHidden: true,
    requiredAttribute: 'charisma',
    rank: 10,
  },
  {
    id: 'skl-contraband-navigation',
    name: 'Contraband Navigation',
    description: 'ILLEGAL: Reduces contraband scan detection chance by 15% per level.',
    group: 'trade',
    category: 'trade',
    maxLevel: 5,
    trainingTimeMultiplier: 6.0,
    prerequisites: [
      { skillId: 'skl-black-market-trading', level: 3 },
    ],
    bonusesPerLevel: ['-15% Detection Chance', '+10% Smuggling Speed'],
    isLearning: false,
    isHidden: true,
    requiredAttribute: 'charisma',
    rank: 8,
  },

  // ---- SOCIAL ----
  {
    id: 'skl-social',
    name: 'Social',
    description: 'Improves faction standing gain by 5% per level.',
    group: 'social',
    category: 'social',
    maxLevel: 5,
    trainingTimeMultiplier: 1.0,
    prerequisites: [],
    bonusesPerLevel: ['+5% Standing Gain', '-3% Broker Fees'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'charisma',
    rank: 1,
  },
  {
    id: 'skl-diplomacy',
    name: 'Diplomacy',
    description: 'Improves base standing with hostile factions by 0.4 per level.',
    group: 'social',
    category: 'social',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-social', level: 3 },
    ],
    bonusesPerLevel: ['+0.4 Standing', '+1 Diplomatic Slot'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'charisma',
    rank: 2,
  },
  {
    id: 'skl-negotiation',
    name: 'Negotiation',
    description: 'Improves mission reward by 5% per level.',
    group: 'social',
    category: 'social',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-social', level: 4 },
    ],
    bonusesPerLevel: ['+5% Mission Rewards', '+3% Bonus Loot'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'charisma',
    rank: 4,
  },
  {
    id: 'skl-connections',
    name: 'Connections',
    description: 'Improves standing with faction corporations by 0.4 per level.',
    group: 'social',
    category: 'social',
    maxLevel: 5,
    trainingTimeMultiplier: 2.0,
    prerequisites: [
      { skillId: 'skl-social', level: 3 },
    ],
    bonusesPerLevel: ['+0.4 Corp Standing', 'Unlocks Faction Modules'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'charisma',
    rank: 2,
  },

  // ---- CORPORATION ----
  {
    id: 'skl-corporation-management',
    name: 'Corporation Management',
    description: 'Allows management of corporation divisions and roles.',
    group: 'corporation',
    category: 'corporation',
    maxLevel: 5,
    trainingTimeMultiplier: 4.0,
    prerequisites: [
      { skillId: 'skl-social', level: 4 },
    ],
    bonusesPerLevel: ['+1 Corp Division', '+10% Corp Efficiency'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'charisma',
    rank: 5,
  },
  {
    id: 'skl-cybernetics',
    name: 'Cybernetics',
    description: 'Allows installation of implants. Higher levels allow better implants.',
    group: 'science',
    category: 'science',
    maxLevel: 5,
    trainingTimeMultiplier: 3.0,
    prerequisites: [
      { skillId: 'skl-science', level: 5 },
    ],
    bonusesPerLevel: ['+1 Implant Slot', 'Unlocks higher grade implants'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 5,
  },
  {
    id: 'skl-advanced-cybernetics',
    name: 'Advanced Cybernetics',
    description: 'Allows installation of advanced implant sets and hardwiring.',
    group: 'science',
    category: 'science',
    maxLevel: 5,
    trainingTimeMultiplier: 8.0,
    prerequisites: [
      { skillId: 'skl-cybernetics', level: 5 },
    ],
    bonusesPerLevel: ['+1 High-Grade Slot', 'Unlocks Omega Implants'],
    isLearning: false,
    isHidden: false,
    requiredAttribute: 'intelligence',
    rank: 10,
  },

  // ---- SPECIAL/UNIQUE ----
  {
    id: 'skl-jove-technology',
    name: 'Jovian Technology Analysis',
    description: 'RARE: Allows understanding and reproduction of ancient Jovian technology.',
    group: 'special',
    category: 'science',
    maxLevel: 3,
    trainingTimeMultiplier: 15.0,
    prerequisites: [
      { skillId: 'skl-invention', level: 5 },
      { skillId: 'skl-advanced-cybernetics', level: 3 },
    ],
    bonusesPerLevel: ['Unlocks Jovian Tech', '+10% Ancient Relic Analysis'],
    isLearning: false,
    isHidden: true,
    requiredAttribute: 'intelligence',
    rank: 15,
  },
  {
    id: 'skl-neural-acceleration',
    name: 'Neural Acceleration',
    description: 'LEGENDARY: Permanent 5% increase to all attributes per level.',
    group: 'special',
    category: 'learning',
    maxLevel: 3,
    trainingTimeMultiplier: 20.0,
    prerequisites: [
      { skillId: 'skl-accelerated-learning', level: 3 },
      { skillId: 'skl-advanced-cybernetics', level: 5 },
    ],
    bonusesPerLevel: ['+5% All Attributes', '+10% Neural Mapping'],
    isLearning: true,
    isHidden: true,
    requiredAttribute: 'intelligence',
    rank: 15,
  },
];

// =============================================================================
// SKILL TRAINING
// =============================================================================

export interface SkillLevel {
  skillId: string;
  level: number;
  trainedAt: number; // timestamp
  trainingQueue: 'primary' | 'secondary' | 'none';
}

export interface TrainingQueueItem {
  skillId: string;
  targetLevel: number;
  remainingTime: number;
  totalTime: number;
  startTime: number;
  endTime: number;
}

/**
 * Calculate training time for a skill level
 */
export function calcSkillTrainingTime(
  skill: SkillDefinition,
  targetLevel: number,
  attributes: Record<PrimaryAttribute, number>,
  learningBonuses: number = 0
): number {
  const baseTime = skill.trainingTimeMultiplier * 60; // minutes base
  const levelMultiplier = Math.pow(2, targetLevel - 1);
  const primaryAttr = attributes[skill.requiredAttribute];
  const secondaryAttr = attributes[SKILL_GROUPS[skill.group].secondaryAttribute];
  const attrMultiplier = 1 + ((primaryAttr + secondaryAttr / 2) / 100);
  const learningMultiplier = Math.max(0.2, 1.0 - (learningBonuses / 100));
  
  return Math.floor(baseTime * levelMultiplier * 60 / attrMultiplier * learningMultiplier);
}

/**
 * Check if player meets skill prerequisites
 */
export function checkSkillPrerequisites(
  skill: SkillDefinition,
  currentSkills: SkillLevel[]
): { met: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const prereq of skill.prerequisites) {
    const current = currentSkills.find(s => s.skillId === prereq.skillId);
    if (!current || current.level < prereq.level) {
      const prereqSkill = SKILL_DEFINITIONS.find(s => s.id === prereq.skillId);
      missing.push(`${prereqSkill?.name || prereq.skillId} Level ${prereq.level}`);
    }
  }
  
  return {
    met: missing.length === 0,
    missing,
  };
}

/**
 * Get total skill points for a commander
 */
export function calcTotalSkillPoints(skills: SkillLevel[]): number {
  return skills.reduce((total, s) => {
    const skill = SKILL_DEFINITIONS.find(sk => sk.id === s.skillId);
    if (!skill) return total;
    let points = 0;
    for (let i = 1; i <= s.level; i++) {
      points += Math.pow(2, i - 1) * skill.rank * 250;
    }
    return total + points;
  }, 0);
}

/**
 * Get skill point requirements for a specific level
 */
export function getSkillPointsForLevel(skill: SkillDefinition, level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += Math.pow(2, i - 1) * skill.rank * 250;
  }
  return total;
}

// =============================================================================
// IMPLANTS
// =============================================================================

export interface ImplantConfig {
  id: string;
  name: string;
  description: string;
  slot: number; // 1-10
  attribute?: PrimaryAttribute;
  attributeBonus?: number;
  skillBonus?: string;
  skillBonusLevel?: number;
  requiresCybernetics: number;
  grade: 'standard' | 'improved' | 'high-grade' | 'omega' | 'hardwiring';
  cost: number;
  isContraband: boolean;
}

export const IMPLANTS: ImplantConfig[] = [
  // Slot 1: Intelligence
  { id: 'impl-int-plus1', name: 'Improved Intelligence Augmentation', description: 'Boosts intelligence by 1 point.', slot: 1, attribute: 'intelligence', attributeBonus: 1, requiresCybernetics: 1, grade: 'standard', cost: 50000, isContraband: false },
  { id: 'impl-int-plus3', name: 'Advanced Intelligence Augmentation', description: 'Boosts intelligence by 3 points.', slot: 1, attribute: 'intelligence', attributeBonus: 3, requiresCybernetics: 3, grade: 'improved', cost: 500000, isContraband: false },
  { id: 'impl-int-plus5', name: 'High-Grade Intelligence Aug.', description: 'Boosts intelligence by 5 points.', slot: 1, attribute: 'intelligence', attributeBonus: 5, requiresCybernetics: 5, grade: 'high-grade', cost: 5000000, isContraband: false },
  
  // Slot 2: Perception
  { id: 'impl-per-plus1', name: 'Improved Perception Augmentation', description: 'Boosts perception by 1 point.', slot: 2, attribute: 'perception', attributeBonus: 1, requiresCybernetics: 1, grade: 'standard', cost: 50000, isContraband: false },
  { id: 'impl-per-plus3', name: 'Advanced Perception Augmentation', description: 'Boosts perception by 3 points.', slot: 2, attribute: 'perception', attributeBonus: 3, requiresCybernetics: 3, grade: 'improved', cost: 500000, isContraband: false },
  { id: 'impl-per-plus5', name: 'High-Grade Perception Aug.', description: 'Boosts perception by 5 points.', slot: 2, attribute: 'perception', attributeBonus: 5, requiresCybernetics: 5, grade: 'high-grade', cost: 5000000, isContraband: false },
  
  // Slot 3: Willpower
  { id: 'impl-wil-plus1', name: 'Improved Willpower Augmentation', description: 'Boosts willpower by 1 point.', slot: 3, attribute: 'willpower', attributeBonus: 1, requiresCybernetics: 1, grade: 'standard', cost: 50000, isContraband: false },
  { id: 'impl-wil-plus3', name: 'Advanced Willpower Augmentation', description: 'Boosts willpower by 3 points.', slot: 3, attribute: 'willpower', attributeBonus: 3, requiresCybernetics: 3, grade: 'improved', cost: 500000, isContraband: false },
  { id: 'impl-wil-plus5', name: 'High-Grade Willpower Aug.', description: 'Boosts willpower by 5 points.', slot: 3, attribute: 'willpower', attributeBonus: 5, requiresCybernetics: 5, grade: 'high-grade', cost: 5000000, isContraband: false },
  
  // Slot 4: Memory
  { id: 'impl-mem-plus1', name: 'Improved Memory Augmentation', description: 'Boosts memory by 1 point.', slot: 4, attribute: 'memory', attributeBonus: 1, requiresCybernetics: 1, grade: 'standard', cost: 50000, isContraband: false },
  { id: 'impl-mem-plus3', name: 'Advanced Memory Augmentation', description: 'Boosts memory by 3 points.', slot: 4, attribute: 'memory', attributeBonus: 3, requiresCybernetics: 3, grade: 'improved', cost: 500000, isContraband: false },
  { id: 'impl-mem-plus5', name: 'High-Grade Memory Aug.', description: 'Boosts memory by 5 points.', slot: 4, attribute: 'memory', attributeBonus: 5, requiresCybernetics: 5, grade: 'high-grade', cost: 5000000, isContraband: false },
  
  // Slot 5: Charisma
  { id: 'impl-cha-plus1', name: 'Improved Charisma Augmentation', description: 'Boosts charisma by 1 point.', slot: 5, attribute: 'charisma', attributeBonus: 1, requiresCybernetics: 1, grade: 'standard', cost: 50000, isContraband: false },
  { id: 'impl-cha-plus3', name: 'Advanced Charisma Augmentation', description: 'Boosts charisma by 3 points.', slot: 5, attribute: 'charisma', attributeBonus: 3, requiresCybernetics: 3, grade: 'improved', cost: 500000, isContraband: false },
  { id: 'impl-cha-plus5', name: 'High-Grade Charisma Aug.', description: 'Boosts charisma by 5 points.', slot: 5, attribute: 'charisma', attributeBonus: 5, requiresCybernetics: 5, grade: 'high-grade', cost: 5000000, isContraband: false },
  
  // Omega Implant (Slot 10)
  { id: 'impl-omega-knowledge', name: 'Omega Knowledge Core', description: 'LEGENDARY: +5 all attributes. Requires Advanced Cybernetics 5.', slot: 10, requiresCybernetics: 5, grade: 'omega', cost: 100000000, isContraband: false, attributeBonus: 5 },
  
  // Contraband Implants
  { id: 'impl-black-neural', name: 'Black Market Neural Accelerator', description: 'ILLEGAL: +5 all attributes, -20% skill time but increases clone vulnerability.', slot: 10, requiresCybernetics: 3, grade: 'hardwiring', cost: 25000000, isContraband: true, attributeBonus: 5 },
];

// =============================================================================
// COMMANDER RANKS
// =============================================================================

export interface CommanderRank {
  id: number;
  name: string;
  title: string;
  requiredSkillPoints: number;
  requiredSkills: { skillId: string; level: number }[];
  bonuses: string[];
}

export const COMMANDER_RANKS: CommanderRank[] = [
  { id: 1, name: 'Recruit', title: 'Rookie Commander', requiredSkillPoints: 0, requiredSkills: [], bonuses: [] },
  { id: 2, name: 'Junior Officer', title: 'Junior Commander', requiredSkillPoints: 50000, requiredSkills: [{ skillId: 'skl-gunnery', level: 2 }], bonuses: ['+1% All Damage'] },
  { id: 3, name: 'Officer', title: 'Commander', requiredSkillPoints: 200000, requiredSkills: [{ skillId: 'skl-navigation', level: 3 }], bonuses: ['+2% All Damage', '+2% Shield'] },
  { id: 4, name: 'Senior Officer', title: 'Senior Commander', requiredSkillPoints: 500000, requiredSkills: [{ skillId: 'skl-engineering-command', level: 2 }], bonuses: ['+3% All Damage', '+3% Shield', '+3% Armor'] },
  { id: 5, name: 'Commander', title: 'Fleet Commander', requiredSkillPoints: 1000000, requiredSkills: [{ skillId: 'skl-frigate-command', level: 5 }], bonuses: ['+5% All Stats', '+1% All Resistances'] },
  { id: 6, name: 'Captain', title: 'Fleet Captain', requiredSkillPoints: 2000000, requiredSkills: [{ skillId: 'skl-cruiser-command', level: 4 }], bonuses: ['+6% All Stats', '+2% All Resistances'] },
  { id: 7, name: 'Fleet Captain', title: 'Squadron Commander', requiredSkillPoints: 5000000, requiredSkills: [{ skillId: 'skl-battleship-command', level: 3 }], bonuses: ['+7% All Stats', '+3% All Resistances', 'Fleet Bonus Module'] },
  { id: 8, name: 'Commodore', title: 'Task Force Commander', requiredSkillPoints: 10000000, requiredSkills: [{ skillId: 'skl-battleship-command', level: 5 }], bonuses: ['+8% All Stats', '+4% All Resistances', '+1 Fleet Size'] },
  { id: 9, name: 'Rear Admiral', title: 'Rear Admiral', requiredSkillPoints: 25000000, requiredSkills: [{ skillId: 'skl-capital-ship-command', level: 3 }], bonuses: ['+9% All Stats', '+5% All Resistances', '+2 Fleet Size'] },
  { id: 10, name: 'Vice Admiral', title: 'Vice Admiral', requiredSkillPoints: 50000000, requiredSkills: [{ skillId: 'skl-capital-ship-command', level: 5 }], bonuses: ['+10% All Stats', '+6% All Resistances', '+3 Fleet Size'] },
  { id: 11, name: 'Admiral', title: 'Admiral of the Fleet', requiredSkillPoints: 80000000, requiredSkills: [{ skillId: 'skl-titan-command', level: 2 }], bonuses: ['+12% All Stats', '+8% All Resistances', '+5 Fleet Size'] },
  { id: 12, name: 'Fleet Admiral', title: 'Supreme Fleet Admiral', requiredSkillPoints: 150000000, requiredSkills: [{ skillId: 'skl-titan-command', level: 5 }], bonuses: ['+15% All Stats', '+10% All Resistances', 'Titan Access'] },
];

/** Get commander rank from skill points */
export function getCommanderRank(skillPoints: number): CommanderRank {
  let currentRank = COMMANDER_RANKS[0];
  for (const rank of COMMANDER_RANKS) {
    if (skillPoints >= rank.requiredSkillPoints) currentRank = rank;
    else break;
  }
  return currentRank;
}

export default SKILL_DEFINITIONS;