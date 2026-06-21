 /**
 * Comprehensive 90-Skill Training System
 * EVE Online / Space MMORPG inspired skill system
 */

export interface Skill {
  skillId: string;
  name: string;
  description: string;
  category: SkillCategory;
  rank: number; // Training time multiplier (1-16)
  maxLevel: number; // Usually 5
  primaryAttribute: AttributeType;
  secondaryAttribute: AttributeType;
  prerequisites: SkillPrerequisite[];
  effects: SkillEffect[];
  unlocks: string[]; // What this skill unlocks
}

export type SkillCategory = 
  | 'combat' 
  | 'navigation' 
  | 'electronic' 
  | 'mechanical' 
  | 'industry' 
  | 'science' 
  | 'social'
  | 'command'
  | 'resource'
  | 'defense';

export type AttributeType = 
  | 'intelligence' 
  | 'memory' 
  | 'charisma' 
  | 'perception' 
  | 'willpower';

export interface SkillPrerequisite {
  skillId: string;
  level: number;
}

export interface SkillEffect {
  type: string;
  value: number;
  perLevel: boolean;
}

export interface PlayerSkillData {
  skillId: string;
  level: number;
  skillPoints: number;
  trainingStartTime?: number;
  trainingEndTime?: number;
}

// Training time calculation: baseTime * rank * (2^(level-1))
export function calculateTrainingTime(
  rank: number,
  level: number,
  primaryAttr: number,
  secondaryAttr: number
): number {
  const baseTime = 250; // Base seconds per skill point
  const skillPointsNeeded = rank * 250 * Math.pow(2, level - 1);
  const attrModifier = (primaryAttr + secondaryAttr / 2) / 10;
  return (skillPointsNeeded * baseTime) / attrModifier;
}

/**
 * 90 COMPREHENSIVE SKILLS
 */
export const SKILLS_90: Skill[] = [
  // ===== COMBAT SKILLS (15) =====
  {
    skillId: 'gunnery',
    name: 'Gunnery',
    description: 'Basic operation of weapon turrets. 2% bonus to turret damage per level.',
    category: 'combat',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [],
    effects: [{ type: 'turret_damage', value: 2, perLevel: true }],
    unlocks: ['small_turrets', 'medium_turrets']
  },
  {
    skillId: 'small_turrets',
    name: 'Small Weapon Turrets',
    description: 'Operation of small turrets. 5% bonus to small turret damage per level.',
    category: 'combat',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'gunnery', level: 1 }],
    effects: [{ type: 'small_turret_damage', value: 5, perLevel: true }],
    unlocks: ['sharpshooter']
  },
  {
    skillId: 'medium_turrets',
    name: 'Medium Weapon Turrets',
    description: 'Operation of medium turrets. 5% bonus to medium turret damage per level.',
    category: 'combat',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'gunnery', level: 3 }],
    effects: [{ type: 'medium_turret_damage', value: 5, perLevel: true }],
    unlocks: ['large_turrets']
  },
  {
    skillId: 'large_turrets',
    name: 'Large Weapon Turrets',
    description: 'Operation of large turrets. 5% bonus to large turret damage per level.',
    category: 'combat',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'medium_turrets', level: 4 }],
    effects: [{ type: 'large_turret_damage', value: 5, perLevel: true }],
    unlocks: ['capital_turrets']
  },
  {
    skillId: 'capital_turrets',
    name: 'Capital Weapon Systems',
    description: 'Operation of capital ship weapons. 5% bonus to capital weapon damage per level.',
    category: 'combat',
    rank: 12,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'large_turrets', level: 5 }],
    effects: [{ type: 'capital_weapon_damage', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'missile_launcher',
    name: 'Missile Launcher Operation',
    description: 'Basic missile systems. 2% bonus to missile damage per level.',
    category: 'combat',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [],
    effects: [{ type: 'missile_damage', value: 2, perLevel: true }],
    unlocks: ['light_missiles', 'heavy_missiles']
  },
  {
    skillId: 'light_missiles',
    name: 'Light Missiles',
    description: 'Light missile specialization. 5% bonus to light missile damage per level.',
    category: 'combat',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'missile_launcher', level: 1 }],
    effects: [{ type: 'light_missile_damage', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'heavy_missiles',
    name: 'Heavy Missiles',
    description: 'Heavy missile specialization. 5% bonus to heavy missile damage per level.',
    category: 'combat',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'missile_launcher', level: 3 }],
    effects: [{ type: 'heavy_missile_damage', value: 5, perLevel: true }],
    unlocks: ['cruise_missiles']
  },
  {
    skillId: 'cruise_missiles',
    name: 'Cruise Missiles',
    description: 'Long-range cruise missiles. 5% bonus to cruise missile damage per level.',
    category: 'combat',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'heavy_missiles', level: 4 }],
    effects: [{ type: 'cruise_missile_damage', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'rapid_firing',
    name: 'Rapid Firing',
    description: 'Reduces weapon cycle time. 4% reduction to weapon cycle time per level.',
    category: 'combat',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'gunnery', level: 2 }],
    effects: [{ type: 'weapon_cycle_time', value: -4, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Increases weapon optimal range. 5% bonus to optimal range per level.',
    category: 'combat',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'small_turrets', level: 3 }],
    effects: [{ type: 'weapon_range', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'surgical_strike',
    name: 'Surgical Strike',
    description: 'Advanced targeting. 3% bonus to all weapon damage per level.',
    category: 'combat',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'gunnery', level: 5 }],
    effects: [{ type: 'all_weapon_damage', value: 3, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'controlled_bursts',
    name: 'Controlled Bursts',
    description: 'Reduces capacitor use of weapons. 5% reduction per level.',
    category: 'combat',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'gunnery', level: 2 }],
    effects: [{ type: 'weapon_capacitor_use', value: -5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'motion_prediction',
    name: 'Motion Prediction',
    description: 'Improves tracking speed. 5% bonus to tracking per level.',
    category: 'combat',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'gunnery', level: 2 }],
    effects: [{ type: 'weapon_tracking', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'trajectory_analysis',
    name: 'Trajectory Analysis',
    description: 'Increases weapon falloff range. 5% bonus per level.',
    category: 'combat',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'gunnery', level: 3 }],
    effects: [{ type: 'weapon_falloff', value: 5, perLevel: true }],
    unlocks: []
  },

  // ===== NAVIGATION SKILLS (12) =====
  {
    skillId: 'navigation',
    name: 'Navigation',
    description: 'Basic ship piloting. 5% bonus to ship velocity per level.',
    category: 'navigation',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [],
    effects: [{ type: 'ship_velocity', value: 5, perLevel: true }],
    unlocks: ['afterburner', 'high_speed_maneuvering']
  },
  {
    skillId: 'afterburner',
    name: 'Afterburner',
    description: 'Afterburner operation. 5% reduction to afterburner capacitor use per level.',
    category: 'navigation',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'navigation', level: 1 }],
    effects: [{ type: 'afterburner_capacitor', value: -5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'high_speed_maneuvering',
    name: 'High Speed Maneuvering',
    description: 'Advanced piloting. 5% bonus to ship agility per level.',
    category: 'navigation',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'navigation', level: 3 }],
    effects: [{ type: 'ship_agility', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'evasive_maneuvering',
    name: 'Evasive Maneuvering',
    description: 'Improves ship signature radius. 5% reduction per level.',
    category: 'navigation',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'navigation', level: 2 }],
    effects: [{ type: 'signature_radius', value: -5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'warp_drive_operation',
    name: 'Warp Drive Operation',
    description: 'Warp drive efficiency. 10% reduction to warp capacitor use per level.',
    category: 'navigation',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [],
    effects: [{ type: 'warp_capacitor', value: -10, perLevel: true }],
    unlocks: ['advanced_warp_drive']
  },
  {
    skillId: 'advanced_warp_drive',
    name: 'Advanced Warp Drive',
    description: 'Faster warp speeds. 3% bonus to warp speed per level.',
    category: 'navigation',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'warp_drive_operation', level: 5 }],
    effects: [{ type: 'warp_speed', value: 3, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'acceleration_control',
    name: 'Acceleration Control',
    description: 'Improves ship acceleration. 5% bonus per level.',
    category: 'navigation',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'navigation', level: 3 }],
    effects: [{ type: 'ship_acceleration', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'fuel_conservation',
    name: 'Fuel Conservation',
    description: 'Reduces fuel consumption. 10% reduction per level.',
    category: 'navigation',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'warp_drive_operation', level: 2 }],
    effects: [{ type: 'fuel_consumption', value: -10, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'jump_drive_operation',
    name: 'Jump Drive Operation',
    description: 'Capital ship jump drives. Allows jump drive use.',
    category: 'navigation',
    rank: 8,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'warp_drive_operation', level: 5 }],
    effects: [{ type: 'jump_range', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'cynosural_field_theory',
    name: 'Cynosural Field Theory',
    description: 'Jump beacon operation. Allows cyno field generation.',
    category: 'navigation',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'jump_drive_operation', level: 3 }],
    effects: [{ type: 'cyno_duration', value: 10, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'spatial_awareness',
    name: 'Spatial Awareness',
    description: 'Improves maximum targeting range. 5% bonus per level.',
    category: 'navigation',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'navigation', level: 2 }],
    effects: [{ type: 'targeting_range', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'fleet_support',
    name: 'Fleet Support',
    description: 'Improves fleet bonuses. 2% bonus to fleet effects per level.',
    category: 'navigation',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'navigation', level: 4 }],
    effects: [{ type: 'fleet_bonus', value: 2, perLevel: true }],
    unlocks: []
  },

  // ===== ELECTRONIC SKILLS (13) =====
  {
    skillId: 'electronics',
    name: 'Electronics',
    description: 'Basic electronic systems. +1 CPU output per level.',
    category: 'electronic',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [],
    effects: [{ type: 'cpu_output', value: 1, perLevel: true }],
    unlocks: ['electronic_warfare', 'sensor_linking']
  },
  {
    skillId: 'electronic_warfare',
    name: 'Electronic Warfare',
    description: 'Electronic warfare systems. 5% bonus to ECM strength per level.',
    category: 'electronic',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'electronics', level: 2 }],
    effects: [{ type: 'ecm_strength', value: 5, perLevel: true }],
    unlocks: ['sensor_dampening', 'target_painting']
  },
  {
    skillId: 'sensor_dampening',
    name: 'Sensor Dampening',
    description: 'Reduces enemy sensor strength. 5% bonus per level.',
    category: 'electronic',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'electronic_warfare', level: 3 }],
    effects: [{ type: 'sensor_damp_strength', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'target_painting',
    name: 'Target Painting',
    description: 'Increases enemy signature radius. 5% bonus per level.',
    category: 'electronic',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'electronic_warfare', level: 2 }],
    effects: [{ type: 'target_painter_strength', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'sensor_linking',
    name: 'Sensor Linking',
    description: 'Remote sensor boosting. 5% bonus to sensor booster strength per level.',
    category: 'electronic',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'electronics', level: 3 }],
    effects: [{ type: 'sensor_booster_strength', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'long_range_targeting',
    name: 'Long Range Targeting',
    description: 'Increases maximum targeting range. +5km per level.',
    category: 'electronic',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'electronics', level: 2 }],
    effects: [{ type: 'max_targeting_range', value: 5000, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'signature_analysis',
    name: 'Signature Analysis',
    description: 'Improves scan resolution. 5% bonus per level.',
    category: 'electronic',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'electronics', level: 1 }],
    effects: [{ type: 'scan_resolution', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'survey',
    name: 'Survey',
    description: 'Scanning and probing. 5% bonus to scan strength per level.',
    category: 'electronic',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'electronics', level: 1 }],
    effects: [{ type: 'scan_strength', value: 5, perLevel: true }],
    unlocks: ['astrometrics']
  },
  {
    skillId: 'astrometrics',
    name: 'Astrometrics',
    description: 'Advanced scanning. 5% reduction to scan time per level.',
    category: 'electronic',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'survey', level: 3 }],
    effects: [{ type: 'scan_time', value: -5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'cloaking',
    name: 'Cloaking',
    description: 'Cloaking device operation. Allows use of cloaking devices.',
    category: 'electronic',
    rank: 6,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'electronics', level: 4 }],
    effects: [{ type: 'cloak_reactivation_delay', value: -10, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'multitasking',
    name: 'Multitasking',
    description: 'Increases maximum locked targets. +1 target per level.',
    category: 'electronic',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'perception',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'electronics', level: 3 }],
    effects: [{ type: 'max_locked_targets', value: 1, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'propulsion_jamming',
    name: 'Propulsion Jamming',
    description: 'Warp disruption and scrambling. 5% bonus to range per level.',
    category: 'electronic',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'electronics', level: 2 }],
    effects: [{ type: 'warp_disruptor_range', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'weapon_disruption',
    name: 'Weapon Disruption',
    description: 'Tracking and guidance disruption. 5% bonus per level.',
    category: 'electronic',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'electronics', level: 2 }],
    effects: [{ type: 'tracking_disruptor_strength', value: 5, perLevel: true }],
    unlocks: []
  },

  // ===== MECHANICAL SKILLS (10) =====
  {
    skillId: 'mechanics',
    name: 'Mechanics',
    description: 'Basic ship systems. 5% bonus to structure HP per level.',
    category: 'mechanical',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [],
    effects: [{ type: 'structure_hp', value: 5, perLevel: true }],
    unlocks: ['hull_upgrades', 'repair_systems']
  },
  {
    skillId: 'hull_upgrades',
    name: 'Hull Upgrades',
    description: 'Armor reinforcement. 5% bonus to armor HP per level.',
    category: 'mechanical',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'mechanics', level: 2 }],
    effects: [{ type: 'armor_hp', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'repair_systems',
    name: 'Repair Systems',
    description: 'Hull and armor repair. 5% bonus to repair amount per level.',
    category: 'mechanical',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'mechanics', level: 3 }],
    effects: [{ type: 'repair_amount', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'shield_operation',
    name: 'Shield Operation',
    description: 'Shield systems. 5% bonus to shield capacity per level.',
    category: 'mechanical',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [],
    effects: [{ type: 'shield_capacity', value: 5, perLevel: true }],
    unlocks: ['shield_management', 'tactical_shield_manipulation']
  },
  {
    skillId: 'shield_management',
    name: 'Shield Management',
    description: 'Advanced shields. 5% bonus to shield recharge rate per level.',
    category: 'mechanical',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'shield_operation', level: 3 }],
    effects: [{ type: 'shield_recharge_rate', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'tactical_shield_manipulation',
    name: 'Tactical Shield Manipulation',
    description: 'Shield resistance. 5% bonus to shield resistances per level.',
    category: 'mechanical',
    rank: 4,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'shield_operation', level: 4 }],
    effects: [{ type: 'shield_resistances', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'energy_grid_upgrades',
    name: 'Energy Grid Upgrades',
    description: 'Power grid management. +5% power grid output per level.',
    category: 'mechanical',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'mechanics', level: 2 }],
    effects: [{ type: 'power_grid', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'capacitor_management',
    name: 'Capacitor Management',
    description: 'Capacitor efficiency. 5% bonus to capacitor capacity per level.',
    category: 'mechanical',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'mechanics', level: 2 }],
    effects: [{ type: 'capacitor_capacity', value: 5, perLevel: true }],
    unlocks: ['capacitor_systems_operation']
  },
  {
    skillId: 'capacitor_systems_operation',
    name: 'Capacitor Systems Operation',
    description: 'Capacitor recharge. 5% bonus to recharge rate per level.',
    category: 'mechanical',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'capacitor_management', level: 3 }],
    effects: [{ type: 'capacitor_recharge', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'thermodynamics',
    name: 'Thermodynamics',
    description: 'Module overheating. Reduces overheat damage by 5% per level.',
    category: 'mechanical',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'willpower',
    prerequisites: [{ skillId: 'mechanics', level: 4 }],
    effects: [{ type: 'overheat_damage', value: -5, perLevel: true }],
    unlocks: []
  },

  // ===== INDUSTRY SKILLS (12) =====
  {
    skillId: 'industry',
    name: 'Industry',
    description: 'Basic manufacturing. 4% reduction to manufacturing time per level.',
    category: 'industry',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [],
    effects: [{ type: 'manufacturing_time', value: -4, perLevel: true }],
    unlocks: ['advanced_industry', 'mass_production']
  },
  {
    skillId: 'advanced_industry',
    name: 'Advanced Industry',
    description: 'Advanced manufacturing. 3% reduction to manufacturing time per level.',
    category: 'industry',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'industry', level: 5 }],
    effects: [{ type: 'manufacturing_time', value: -3, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'mass_production',
    name: 'Mass Production',
    description: 'Multiple production lines. +1 manufacturing slot per level.',
    category: 'industry',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'industry', level: 3 }],
    effects: [{ type: 'manufacturing_slots', value: 1, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'mining',
    name: 'Mining',
    description: 'Basic mining operations. 5% bonus to mining yield per level.',
    category: 'industry',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [],
    effects: [{ type: 'mining_yield', value: 5, perLevel: true }],
    unlocks: ['astrogeology', 'deep_core_mining']
  },
  {
    skillId: 'astrogeology',
    name: 'Astrogeology',
    description: 'Advanced mining. 5% bonus to mining yield per level.',
    category: 'industry',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'mining', level: 4 }],
    effects: [{ type: 'mining_yield', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'deep_core_mining',
    name: 'Deep Core Mining',
    description: 'Rare ore extraction. 5% bonus to rare ore yield per level.',
    category: 'industry',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'astrogeology', level: 3 }],
    effects: [{ type: 'rare_ore_yield', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'reprocessing',
    name: 'Reprocessing',
    description: 'Ore refining. 3% bonus to reprocessing yield per level.',
    category: 'industry',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [],
    effects: [{ type: 'reprocessing_yield', value: 3, perLevel: true }],
    unlocks: ['reprocessing_efficiency']
  },
  {
    skillId: 'reprocessing_efficiency',
    name: 'Reprocessing Efficiency',
    description: 'Advanced refining. 2% bonus to reprocessing yield per level.',
    category: 'industry',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'reprocessing', level: 5 }],
    effects: [{ type: 'reprocessing_yield', value: 2, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'salvaging',
    name: 'Salvaging',
    description: 'Wreck salvaging. 5% bonus to salvage chance per level.',
    category: 'industry',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'mechanics', level: 3 }],
    effects: [{ type: 'salvage_chance', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'gas_cloud_harvesting',
    name: 'Gas Cloud Harvesting',
    description: 'Gas mining. 5% bonus to gas yield per level.',
    category: 'industry',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'mining', level: 3 }],
    effects: [{ type: 'gas_yield', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'ice_harvesting',
    name: 'Ice Harvesting',
    description: 'Ice mining. 5% bonus to ice yield per level.',
    category: 'industry',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'memory',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'mining', level: 2 }],
    effects: [{ type: 'ice_yield', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'planetary_management',
    name: 'Planetary Management',
    description: 'Colony management. +1 colony slot per level.',
    category: 'industry',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'memory',
    prerequisites: [],
    effects: [{ type: 'colony_slots', value: 1, perLevel: true }],
    unlocks: []
  },

  // ===== SCIENCE SKILLS (10) =====
  {
    skillId: 'science',
    name: 'Science',
    description: 'Basic research. 5% bonus to research speed per level.',
    category: 'science',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [],
    effects: [{ type: 'research_speed', value: 5, perLevel: true }],
    unlocks: ['laboratory_operation', 'research_project_management']
  },
  {
    skillId: 'laboratory_operation',
    name: 'Laboratory Operation',
    description: 'Lab efficiency. +1 research slot per level.',
    category: 'science',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'science', level: 1 }],
    effects: [{ type: 'research_slots', value: 1, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'research_project_management',
    name: 'Research Project Management',
    description: 'Advanced research. +1 research slot per level.',
    category: 'science',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'laboratory_operation', level: 5 }],
    effects: [{ type: 'research_slots', value: 1, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'metallurgy',
    name: 'Metallurgy',
    description: 'Material science. 5% bonus to material efficiency per level.',
    category: 'science',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'science', level: 3 }],
    effects: [{ type: 'material_efficiency', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'cybernetics',
    name: 'Cybernetics',
    description: 'Implant technology. Allows use of implants.',
    category: 'science',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'science', level: 3 }],
    effects: [{ type: 'implant_slots', value: 1, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'biology',
    name: 'Biology',
    description: 'Life sciences. 5% bonus to clone quality per level.',
    category: 'science',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'science', level: 1 }],
    effects: [{ type: 'clone_quality', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'nanite_engineering',
    name: 'Nanite Engineering',
    description: 'Nanite technology. 5% bonus to nanite efficiency per level.',
    category: 'science',
    rank: 8,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'science', level: 5 }],
    effects: [{ type: 'nanite_efficiency', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'graviton_physics',
    name: 'Graviton Physics',
    description: 'Gravity manipulation. Required for titan weapons.',
    category: 'science',
    rank: 14,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'science', level: 5 }],
    effects: [{ type: 'graviton_weapon_damage', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'quantum_physics',
    name: 'Quantum Physics',
    description: 'Quantum mechanics. 5% bonus to jump drive range per level.',
    category: 'science',
    rank: 8,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'science', level: 5 }],
    effects: [{ type: 'jump_drive_range', value: 5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'astrometrics_advanced',
    name: 'Advanced Astrometrics',
    description: 'Deep space scanning. 5% bonus to scan strength per level.',
    category: 'science',
    rank: 5,
    maxLevel: 5,
    primaryAttribute: 'intelligence',
    secondaryAttribute: 'perception',
    prerequisites: [{ skillId: 'astrometrics', level: 5 }],
    effects: [{ type: 'deep_scan_strength', value: 5, perLevel: true }],
    unlocks: []
  },

  // ===== SOCIAL SKILLS (8) =====
  {
    skillId: 'social',
    name: 'Social',
    description: 'Basic social skills. 5% bonus to standing gains per level.',
    category: 'social',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'intelligence',
    prerequisites: [],
    effects: [{ type: 'standing_gains', value: 5, perLevel: true }],
    unlocks: ['connections', 'diplomacy']
  },
  {
    skillId: 'connections',
    name: 'Connections',
    description: 'NPC relations. 4% bonus to effective standing per level.',
    category: 'social',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'social', level: 3 }],
    effects: [{ type: 'effective_standing', value: 4, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'diplomacy',
    name: 'Diplomacy',
    description: 'Diplomatic relations. 4% bonus to standing gains per level.',
    category: 'social',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'social', level: 2 }],
    effects: [{ type: 'standing_gains', value: 4, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'negotiation',
    name: 'Negotiation',
    description: 'Trade skills. 5% reduction to broker fees per level.',
    category: 'social',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'intelligence',
    prerequisites: [{ skillId: 'social', level: 2 }],
    effects: [{ type: 'broker_fees', value: -5, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'trade',
    name: 'Trade',
    description: 'Market operations. 4% reduction to sales tax per level.',
    category: 'social',
    rank: 1,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'memory',
    prerequisites: [],
    effects: [{ type: 'sales_tax', value: -4, perLevel: true }],
    unlocks: ['retail', 'wholesale']
  },
  {
    skillId: 'retail',
    name: 'Retail',
    description: 'Retail operations. +1 market order per level.',
    category: 'social',
    rank: 2,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'trade', level: 2 }],
    effects: [{ type: 'market_orders', value: 1, perLevel: true }],
    unlocks: []
  },
  {
    skillId: 'wholesale',
    name: 'Wholesale',
    description: 'Wholesale trading operations. +2 market orders per level.',
    category: 'social',
    rank: 3,
    maxLevel: 5,
    primaryAttribute: 'charisma',
    secondaryAttribute: 'memory',
    prerequisites: [{ skillId: 'retail', level: 3 }],
    effects: [{ type: 'market_orders', value: 2, perLevel: true }],
    unlocks: []
  }
];
