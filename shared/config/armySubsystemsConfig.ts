/**
 * Army Subsystems Configuration
 * Military units, formations, and combat capabilities
 * @tag #military #army #units #combat #subsystems
 *
 * For the expanded 18-category / 32-subcategory army classification system
 * (with tiers 1-99, levels 1-999, types/sub-types, ranks, titles, stats,
 * sub-stats, attributes, sub-attributes, subjects, descriptions, and more),
 * see:
 *   shared/config/armyCategoriesConfig.ts
 *   shared/types/armyUnitTypes.ts
 */

export type { ArmySubsystem } from '../types/civilization';
import type { ArmySubsystem } from '../types/civilization';

// Re-export the expanded army classification system for convenience
export {
  getAllCategories,
  getAllSubCategories,
  getSubCategoriesForCategory,
  getCategoryById,
  getSubCategoryById,
  getUnitsByCategory,
  getUnitsBySubCategory,
  getUnitsAvailableAtLevel,
  isValidClassTier,
  isValidUnitLevel,
  UNIT_CATEGORY_META,
  UNIT_SUB_CATEGORY_META,
  ARMY_UNIT_CATALOG,
} from './armyCategoriesConfig';
export type {
  UnitCategory,
  UnitSubCategory,
  UnitCategoryMeta,
  UnitSubCategoryMeta,
  ArmyUnitDefinition,
  UnitClass,
  UnitSubClass,
  ClassTier,
  SubClassTier,
  UnitType as ArmyUnitType,
  UnitSubType,
  UnitRank,
  UnitTitle,
  UnitStats,
  UnitSubStats,
  UnitAttributes,
  UnitSubAttributes,
  UnitSubject,
  SubjectDetail,
  UnitDescriptions,
  UnitLevel,
  LevelTier,
} from '../types/armyUnitTypes';
export { getLevelTier, getClassTierLabel } from '../types/armyUnitTypes';

// ============================================================================
// GROUND FORCES (Tier 1-3)
// ============================================================================

export const GROUND_FORCES: ArmySubsystem[] = [
  {
    id: 'army-infantry-squad-1',
    name: 'Infantry Squad',
    role: 'specialist',
    type: 'soldier',
    tier: 1,
    rarity: 'common',
    combat: {
      attack: 5,
      defense: 5,
      health: 20,
      speed: 8,
      accuracy: 75,
      dodge: 10,
    },
    cost: { credits: 50, materials: 30, time: 1 },
    crew: 8,
    minCrewRequired: 6,
    specialAbilities: [
      {
        name: 'Volley Fire',
        effect: 'Focused attack dealing 150% damage',
        cooldown: 2,
      },
    ],
    moraleMultiplier: 1.0,
    description: 'Basic infantry unit suitable for ground combat and garrison duty.',
    flavorText: 'The backbone of any military force.',
    prerequisiteTechs: [],
    minimumLevel: 1,
  },
  {
    id: 'army-heavy-infantry-1',
    name: 'Heavy Infantry',
    role: 'specialist',
    type: 'soldier',
    tier: 2,
    rarity: 'uncommon',
    combat: {
      attack: 8,
      defense: 12,
      health: 35,
      speed: 5,
      accuracy: 70,
      dodge: 5,
    },
    cost: { credits: 100, materials: 75, time: 2 },
    crew: 6,
    minCrewRequired: 5,
    specialAbilities: [
      {
        name: 'Shield Wall',
        effect: 'Reduce all damage by 50% for 1 turn',
        cooldown: 3,
      },
      {
        name: 'Tremendous Strike',
        effect: 'Deal 200% damage to a single target',
        cooldown: 2,
      },
    ],
    moraleMultiplier: 1.1,
    formationBonus: 15,
    description: 'Heavily armored infantry designed for front-line combat and defense.',
    flavorText: 'When the wall must hold.',
    prerequisiteTechs: ['armor-light-basic-composite-1'],
    minimumLevel: 5,
  },
  {
    id: 'army-commando-unit-1',
    name: 'Commando Unit',
    role: 'specialist',
    type: 'soldier',
    tier: 2,
    rarity: 'rare',
    combat: {
      attack: 12,
      defense: 8,
      health: 25,
      speed: 14,
      accuracy: 90,
      dodge: 20,
    },
    cost: { credits: 150, materials: 100, time: 3 },
    crew: 5,
    minCrewRequired: 4,
    specialAbilities: [
      {
        name: 'Stealth Strike',
        effect: 'Attack with 300% damage from stealth',
        cooldown: 4,
      },
      {
        name: 'Tactical Repositioning',
        effect: 'Move twice in one turn',
        cooldown: 2,
      },
    ],
    moraleMultiplier: 1.2,
    description: 'Elite special forces trained for infiltration, ambush, and precision strikes.',
    flavorText: 'In the shadows, we strike.',
    prerequisiteTechs: ['weapons-advanced-precision-1'],
    minimumLevel: 15,
  },
];

// ============================================================================
// ARMOR & VEHICLES (Tier 2-4)
// ============================================================================

export const ARMOR_VEHICLES: ArmySubsystem[] = [
  {
    id: 'army-light-tank-1',
    name: 'Light Tank',
    role: 'operator',
    type: 'vehicle',
    tier: 2,
    rarity: 'uncommon',
    combat: {
      attack: 10,
      defense: 15,
      health: 50,
      speed: 10,
      accuracy: 80,
      dodge: 8,
    },
    cost: { credits: 200, materials: 150, time: 5 },
    crew: 4,
    minCrewRequired: 3,
    specialAbilities: [
      {
        name: 'Cannon Barrage',
        effect: 'Deal 250% damage to all nearby enemies',
        cooldown: 3,
      },
    ],
    moraleMultiplier: 1.15,
    formationBonus: 20,
    description: 'Mobile armored unit with mounted weaponry for tactical superiority.',
    flavorText: 'Built for speed and firepower.',
    prerequisiteTechs: ['armor-advanced-composite-1', 'weapons-tank-cannons-1'],
    minimumLevel: 10,
  },
  {
    id: 'army-main-battle-tank-1',
    name: 'Main Battle Tank',
    role: 'operator',
    type: 'vehicle',
    tier: 3,
    rarity: 'rare',
    combat: {
      attack: 16,
      defense: 22,
      health: 80,
      speed: 7,
      accuracy: 75,
      dodge: 5,
    },
    cost: { credits: 400, materials: 300, time: 8 },
    crew: 5,
    minCrewRequired: 4,
    specialAbilities: [
      {
        name: 'Armor Plating Boost',
        effect: 'Increase defense by 100% for 2 turns',
        cooldown: 4,
      },
      {
        name: 'Devastating Volley',
        effect: 'Deal 300% damage to up to 3 targets',
        cooldown: 3,
      },
    ],
    moraleMultiplier: 1.2,
    formationBonus: 30,
    description: 'Heavily armored frontline tank with advanced weaponry and defensive systems.',
    flavorText: 'When you need to break through.',
    prerequisiteTechs: ['armor-military-advanced-alloy-1', 'weapons-tank-advanced-systems-1'],
    minimumLevel: 20,
  },
  {
    id: 'army-mobile-artillery-1',
    name: 'Mobile Artillery',
    role: 'operator',
    type: 'vehicle',
    tier: 3,
    rarity: 'rare',
    combat: {
      attack: 18,
      defense: 10,
      health: 40,
      speed: 8,
      accuracy: 85,
      dodge: 6,
    },
    cost: { credits: 350, materials: 250, time: 7 },
    crew: 4,
    minCrewRequired: 3,
    specialAbilities: [
      {
        name: 'Artillery Strike',
        effect: 'Deal 400% damage to a distant target',
        cooldown: 2,
      },
    ],
    moraleMultiplier: 1.15,
    description: 'Long-range firepower platform for indirect support and area denial.',
    flavorText: 'Rain from the heavens.',
    prerequisiteTechs: ['weapons-artillery-systems-1'],
    minimumLevel: 18,
  },
];

// ============================================================================
// MECHS & EXOSKELETONS (Tier 3-4)
// ============================================================================

export const MECH_UNITS: ArmySubsystem[] = [
  {
    id: 'army-medium-mech-1',
    name: 'Medium Mech',
    role: 'captain',
    type: 'mech',
    tier: 3,
    rarity: 'rare',
    combat: {
      attack: 14,
      defense: 14,
      health: 60,
      speed: 9,
      accuracy: 80,
      dodge: 12,
    },
    cost: { credits: 500, materials: 400, time: 10 },
    crew: 2,
    minCrewRequired: 2,
    specialAbilities: [
      {
        name: 'Beam Cannon',
        effect: 'Deal 300% energy damage to single target',
        cooldown: 2,
      },
      {
        name: 'Evasion Protocol',
        effect: 'Dodge next 2 attacks automatically',
        cooldown: 3,
      },
    ],
    moraleMultiplier: 1.25,
    formationBonus: 25,
    description: 'Piloted exoskeleton combining individual skill with mechanical advantage.',
    flavorText: 'One pilot, a thousand hands of war.',
    prerequisiteTechs: ['mech-frame-basic-1', 'weapons-beam-cannons-1'],
    minimumLevel: 25,
  },
  {
    id: 'army-assault-mech-1',
    name: 'Assault Mech',
    role: 'captain',
    type: 'mech',
    tier: 4,
    rarity: 'epic',
    combat: {
      attack: 20,
      defense: 18,
      health: 100,
      speed: 7,
      accuracy: 75,
      dodge: 8,
    },
    cost: { credits: 800, materials: 600, time: 15 },
    crew: 2,
    minCrewRequired: 2,
    specialAbilities: [
      {
        name: 'Plasma Blade',
        effect: 'Melee attack dealing 400% damage',
        cooldown: 1,
      },
      {
        name: 'Overdrive Mode',
        effect: 'Increase all combat stats by 50% for 3 turns',
        cooldown: 5,
      },
      {
        name: 'Missile Barrage',
        effect: 'Deal 250% damage to all enemies in area',
        cooldown: 4,
      },
    ],
    moraleMultiplier: 1.35,
    formationBonus: 40,
    description: 'Heavy assault mech with overwhelming firepower and armor for breaking enemy lines.',
    flavorText: 'Unstoppable force meets immovable object.',
    prerequisiteTechs: ['mech-frame-advanced-1', 'weapons-mech-systems-advanced-1'],
    minimumLevel: 35,
  },
  {
    id: 'army-commander-mech-1',
    name: 'Commander Mech',
    role: 'commander',
    type: 'mech',
    tier: 4,
    rarity: 'legendary',
    combat: {
      attack: 18,
      defense: 16,
      health: 85,
      speed: 10,
      accuracy: 90,
      dodge: 15,
    },
    cost: { credits: 1000, materials: 800, time: 20 },
    crew: 1,
    minCrewRequired: 1,
    specialAbilities: [
      {
        name: 'Supreme Command',
        effect: 'All allies gain +30% to all stats for 4 turns',
        cooldown: 5,
      },
      {
        name: 'Adaptive Defense',
        effect: 'Reduce damage by percentage equal to mech armor',
        cooldown: 2,
      },
      {
        name: 'Strategic Strike',
        effect: 'Deal 500% damage to priority target',
        cooldown: 3,
      },
    ],
    moraleMultiplier: 1.5,
    formationBonus: 60,
    description: 'Elite command mech designed for leaders who inspire armies through sheer presence and power.',
    flavorText: 'Where this machine walks, victory follows.',
    prerequisiteTechs: ['mech-frame-elite-1', 'weapons-mech-systems-elite-1', 'computing-command-ai-5'],
    minimumLevel: 50,
  },
];

// ============================================================================
// SUPPORT UNITS (Tier 1-3)
// ============================================================================

export const SUPPORT_UNITS: ArmySubsystem[] = [
  {
    id: 'army-medic-squad-1',
    name: 'Medic Squad',
    role: 'support',
    type: 'soldier',
    tier: 1,
    rarity: 'uncommon',
    combat: {
      attack: 3,
      defense: 4,
      health: 15,
      speed: 10,
      accuracy: 60,
      dodge: 15,
    },
    cost: { credits: 75, materials: 40, time: 2 },
    crew: 4,
    minCrewRequired: 3,
    specialAbilities: [
      {
        name: 'Combat Medicine',
        effect: 'Heal allied unit for 40% of their max health',
        cooldown: 2,
      },
    ],
    moraleMultiplier: 1.1,
    description: 'Medical support personnel providing critical care during combat.',
    flavorText: 'Heal first, ask questions later.',
    prerequisiteTechs: [],
    minimumLevel: 5,
  },
  {
    id: 'army-engineering-corps-1',
    name: 'Engineering Corps',
    role: 'support',
    type: 'soldier',
    tier: 2,
    rarity: 'uncommon',
    combat: {
      attack: 4,
      defense: 6,
      health: 18,
      speed: 8,
      accuracy: 65,
      dodge: 10,
    },
    cost: { credits: 100, materials: 60, time: 3 },
    crew: 5,
    minCrewRequired: 4,
    specialAbilities: [
      {
        name: 'Fortifications',
        effect: 'Increase defense of position by 50% for 3 turns',
        cooldown: 3,
      },
      {
        name: 'Repair Systems',
        effect: 'Repair allied vehicle for 50% of its max health',
        cooldown: 2,
      },
    ],
    moraleMultiplier: 1.15,
    description: 'Combat engineers specializing in fortifications and equipment repairs.',
    flavorText: 'Build it, break it, fix it, repeat.',
    prerequisiteTechs: ['engineering-construction-advanced-1'],
    minimumLevel: 10,
  },
  {
    id: 'army-supply-convoy-1',
    name: 'Supply Convoy',
    role: 'support',
    type: 'vehicle',
    tier: 2,
    rarity: 'common',
    combat: {
      attack: 2,
      defense: 5,
      health: 25,
      speed: 12,
      accuracy: 40,
      dodge: 8,
    },
    cost: { credits: 120, materials: 80, time: 2 },
    crew: 3,
    minCrewRequired: 2,
    specialAbilities: [
      {
        name: 'Resupply',
        effect: 'Restore 30% health to all allies in range',
        cooldown: 1,
      },
    ],
    moraleMultiplier: 1.05,
    description: 'Logistics vehicle providing ammunition, fuel, and supplies to combat forces.',
    flavorText: 'An army marches on its stomach.',
    prerequisiteTechs: [],
    minimumLevel: 8,
  },
];

// ============================================================================
// AIR & ADVANCED UNITS (Tier 3-4)
// ============================================================================

export const AIR_UNITS: ArmySubsystem[] = [
  {
    id: 'army-fighter-squadron-1',
    name: 'Fighter Squadron',
    role: 'operator',
    type: 'vehicle',
    tier: 3,
    rarity: 'rare',
    combat: {
      attack: 12,
      defense: 8,
      health: 30,
      speed: 18,
      accuracy: 85,
      dodge: 20,
    },
    cost: { credits: 300, materials: 200, time: 6 },
    crew: 2,
    minCrewRequired: 2,
    specialAbilities: [
      {
        name: 'Aerial Strike',
        effect: 'Attack with advantage from height, +50% damage',
        cooldown: 2,
      },
      {
        name: 'Dogfight Maneuver',
        effect: 'Evade until next turn and counterattack',
        cooldown: 3,
      },
    ],
    moraleMultiplier: 1.2,
    formationBonus: 35,
    description: 'Fast attack aircraft for air superiority and tactical strikes.',
    flavorText: 'Masters of the skies.',
    prerequisiteTechs: ['propulsion-fighter-jets-1', 'weapons-aircraft-systems-1'],
    minimumLevel: 22,
  },
  {
    id: 'army-bomber-wing-1',
    name: 'Bomber Wing',
    role: 'operator',
    type: 'vehicle',
    tier: 4,
    rarity: 'epic',
    combat: {
      attack: 16,
      defense: 6,
      health: 35,
      speed: 12,
      accuracy: 90,
      dodge: 5,
    },
    cost: { credits: 450, materials: 350, time: 8 },
    crew: 4,
    minCrewRequired: 3,
    specialAbilities: [
      {
        name: 'Carpet Bombing',
        effect: 'Deal 350% damage to all enemies in large area',
        cooldown: 3,
      },
      {
        name: 'Run & Gun',
        effect: 'Attack and move in one action',
        cooldown: 2,
      },
    ],
    moraleMultiplier: 1.25,
    description: 'Heavy bombers for strategic bombing campaigns and area devastation.',
    flavorText: 'Deliver thunder from above.',
    prerequisiteTechs: ['propulsion-bombers-1', 'weapons-bomber-systems-1'],
    minimumLevel: 30,
  },
];

// ============================================================================
// ARMY UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all available army subsystems
 */
export function getAllArmySubsystems(): ArmySubsystem[] {
  return [
    ...GROUND_FORCES,
    ...ARMOR_VEHICLES,
    ...MECH_UNITS,
    ...SUPPORT_UNITS,
    ...AIR_UNITS,
  ];
}

/**
 * Get army subsystems by type
 */
export function getArmySubsystemsByType(
  type: 'soldier' | 'weapon' | 'armor' | 'vehicle' | 'mech' | 'commander'
): ArmySubsystem[] {
  return getAllArmySubsystems().filter((unit) => unit.type === type);
}

/**
 * Get army subsystems by role
 */
export function getArmySubsystemsByRole(
  role: 'commander' | 'captain' | 'sergeant' | 'specialist' | 'operator' | 'support'
): ArmySubsystem[] {
  return getAllArmySubsystems().filter((unit) => unit.role === role);
}

/**
 * Get army subsystem by ID
 */
export function getArmySubsystemById(id: string): ArmySubsystem | undefined {
  return getAllArmySubsystems().find((unit) => unit.id === id);
}

/**
 * Get available units for player level
 */
export function getAvailableArmyUnits(playerLevel: number): ArmySubsystem[] {
  return getAllArmySubsystems().filter(
    (unit) => !unit.minimumLevel || unit.minimumLevel <= playerLevel
  );
}

/**
 * Calculate squad total combat power
 */
export function calculateSquadCombatPower(units: ArmySubsystem[]): number {
  const avgAttack =
    units.reduce((sum, u) => sum + u.combat.attack, 0) / Math.max(units.length, 1);
  const avgDefense =
    units.reduce((sum, u) => sum + u.combat.defense, 0) / Math.max(units.length, 1);
  const avgHealth =
    units.reduce((sum, u) => sum + u.combat.health, 0) / Math.max(units.length, 1);

  return Math.round((avgAttack + avgDefense + avgHealth) * units.length);
}

/**
 * Calculate formation bonus for a squad composition
 */
export function calculateFormationBonus(units: ArmySubsystem[]): number {
  let bonus = 0;

  units.forEach((unit) => {
    if (unit.formationBonus) {
      bonus += unit.formationBonus;
    }
  });

  return Math.min(bonus, 200); // Cap at 200%
}

/**
 * Calculate total crew required
 */
export function calculateTotalCrewRequired(units: ArmySubsystem[]): number {
  return units.reduce((sum, u) => sum + u.minCrewRequired, 0);
}

/**
 * Get unit cost breakdown
 */
export function calculateTotalCost(
  units: ArmySubsystem[],
  quantity: number = 1
): Record<string, number> {
  const totalCost: Record<string, number> = {
    credits: 0,
    materials: 0,
    time: 0,
  };

  units.forEach((unit) => {
    totalCost.credits += (unit.cost.credits || 0) * quantity;
    totalCost.materials += (unit.cost.materials || 0) * quantity;
    totalCost.time += (unit.cost.time || 0) * quantity;
  });

  return totalCost;
}
