/**
 * Custom Technology Tree Extensions
 * 
 * This file is for adding custom, specialized technologies that extend the base
 * technology tree. Use this to define faction-specific, experimental, or limited-edition
 * technologies that don't fit into the standard 11 branches.
 * 
 * @tag #technology #research #custom #extensions
 */

import type { TechnologyNode } from './technologyTreeConfig';
import { TECH_PROGRESSION } from './technologyTreeConfig';

/**
 * Experimental Technologies
 * High-risk, high-reward techs that push boundaries
 */
const EXPERIMENTAL_TECHS: TechnologyNode[] = [
  {
    id: 'experimental-plasma-matrix-1',
    name: 'Plasma Matrix Crystallization',
    branch: 'power',
    class: 'experimental',
    type: 'active',
    category: 'Exotic Power Generation',
    subcategory: 'Plasma Systems',
    classification: 'Experimental Grade',
    level: 50,
    tier: 5,
    researchCost: TECH_PROGRESSION.researchCostForTech('power', 50, 5),
    progressionConfig: {
      tiers: { max: 12 },
      levels: { max: 100 },
    },
    prerequisiteTechs: ['power-fusion-advanced-mk3', 'hyperspace-dimensional-anchoring-1'],
    minimumLevel: 75,
    minimumTechLevel: 45,
    industrialCost: 5000,
    energyCost: 500,
    materialsNeeded: {
      exotic_matter: 100,
      darksteel: 250,
      crystalline_substrate: 500,
      quantum_processors: 50,
    },
    researchTime: TECH_PROGRESSION.researchTimeForTech(50, 5),
    stats: {
      primary: [
        {
          name: 'Power Output',
          value: 10000,
          modifier: 500,
          subStats: { peak_output: 15000, sustained_output: 10000 },
        },
        {
          name: 'Efficiency',
          value: 98,
          modifier: 10,
          subStats: { heat_management: 95, waste_conversion: 90 },
        },
      ],
      secondary: [
        {
          name: 'System Stability',
          value: 85,
          modifier: 5,
          subStats: { meltdown_resistance: 90, fluctuation_dampening: 80 },
        },
      ],
      resistance: { plasma: 100, thermal: 150, electromagnetic: 50 },
      efficiency: 98,
      reliability: 75,
    },
    bonuses: {
      power_output_multiplier: 5,
      energy_storage_increase: 200,
      heat_dissipation: 50,
    },
    penalties: {
      system_failure_risk: 0.15,
      maintenance_cost: 500,
      crew_radiation_exposure: 25,
    },
    description:
      'Revolutionary power generation technology using exotic matter crystallization. Produces massive energy output but requires careful management due to instability risks.',
    flavorText:
      "The pinnacle of conventional power generation—or the brink of catastrophe, depending on your crew's expertise.",
    manufacturer: 'Axiom Technologies (Clandestine Division)',
    unlocksUpgrades: ['experimental-plasma-matrix-2', 'hyperspace-zero-point-tap-1'],
    maxUpgradeLevel: 12,
    upgradeSlots: 8,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'epic',
    discoveryBonus: 25,
    passiveEffect: false,
    stackable: false,
    factionLocked: undefined,
  },
  {
    id: 'experimental-temporal-distortion-1',
    name: 'Temporal Distortion Field',
    branch: 'hyperspace',
    class: 'experimental',
    type: 'active',
    category: 'Time Manipulation',
    subcategory: 'Localized Temporal',
    classification: 'Experimental Grade',
    level: 75,
    tier: 8,
    researchCost: TECH_PROGRESSION.researchCostForTech('hyperspace', 75, 8),
    progressionConfig: {
      tiers: { max: 15 },
      levels: { max: 150 },
    },
    prerequisiteTechs: [
      'hyperspace-dimensional-anchoring-5',
      'hyperspace-multi-dimensional-nav-3',
      'computing-quantum-processing-5',
    ],
    minimumLevel: 100,
    minimumTechLevel: 70,
    industrialCost: 10000,
    energyCost: 2000,
    materialsNeeded: {
      temporal_crystals: 500,
      exotic_matter: 250,
      dimensional_flux_stabilizers: 1000,
      void_titanium: 500,
    },
    researchTime: TECH_PROGRESSION.researchTimeForTech(75, 8),
    stats: {
      primary: [
        {
          name: 'Time Distortion Radius',
          value: 50,
          modifier: 200,
          subStats: { min_radius: 10, max_radius: 100 },
        },
        {
          name: 'Temporal Acceleration Factor',
          value: 3,
          modifier: 100,
          subStats: { internal_time_multiplier: 2, external_perception: 0.3 },
        },
      ],
      secondary: [
        {
          name: 'Causality Preservation',
          value: 60,
          modifier: 10,
          subStats: { paradox_prevention: 85, timeline_stability: 45 },
        },
      ],
      resistance: { temporal: 100, dimensional: 150 },
      efficiency: 45,
      reliability: 40,
    },
    bonuses: {
      reaction_time_multiplier: 3,
      dodge_probability: 30,
      shield_recharge_speed: 200,
    },
    penalties: {
      causality_violation_risk: 0.5,
      crew_disorientation: 75,
      energy_consumption: 1000,
      temporal_headaches: 100,
    },
    description:
      'Generates a localized temporal distortion field that accelerates internal time relative to external observers. Permits faster reaction times and recovery, but poses severe risks to causality and crew psychology.',
    flavorText:
      'Playing with time itself. What could possibly go wrong? (Please update your will before use.)',
    manufacturer: 'Unknown Origin (likely precursor tech)',
    unlocksUpgrades: ['experimental-temporal-distortion-2'],
    maxUpgradeLevel: 15,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: false,
    rarity: 'legendary',
    discoveryBonus: 50,
    passiveEffect: false,
    stackable: false,
    factionLocked: undefined,
  },
];

/**
 * Faction-Specific Technologies
 * Unique techs tied to specific civilizations or factions
 */
const FACTION_TECHS: TechnologyNode[] = [
  {
    id: 'faction-voth-phase-shift-1',
    name: 'Voth Phase-Shift Matrices',
    branch: 'shields',
    class: 'advanced',
    type: 'passive',
    category: 'Defensive Phasing',
    subcategory: 'Multidimensional',
    classification: 'Faction-Exclusive',
    level: 40,
    tier: 6,
    researchCost: 3000,
    progressionConfig: {
      tiers: { max: 10 },
      levels: { max: 80 },
    },
    prerequisiteTechs: ['shields-advanced-quantum-1', 'hyperspace-dimensional-anchoring-2'],
    minimumLevel: 60,
    minimumTechLevel: 35,
    industrialCost: 2000,
    energyCost: 300,
    materialsNeeded: {
      phase_crystals: 300,
      exotic_matter: 100,
      voth_alloy: 500,
    },
    researchTime: 35,
    stats: {
      primary: [
        {
          name: 'Phase Evasion',
          value: 40,
          modifier: 100,
          subStats: { phasing_duration: 5, phasing_cooldown: 10 },
        },
      ],
      secondary: [
        {
          name: 'Dimensional Stability',
          value: 70,
          modifier: 15,
        },
      ],
      resistance: { dimensional: 200, exotic: 100 },
      efficiency: 85,
      reliability: 80,
    },
    bonuses: {
      phase_evasion_chance: 25,
      dimensional_awareness: 50,
    },
    description: 'Ancient Voth technology permitting brief phases through dimensions to evade attacks. Incredibly effective but only available to those who can replicate Voth engineering.',
    manufacturer: 'Voth Collective (Reverse-Engineered)',
    unlocksUpgrades: ['faction-voth-phase-shift-2'],
    maxUpgradeLevel: 10,
    upgradeSlots: 5,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'rare',
    discoveryBonus: 15,
    passiveEffect: true,
    stackable: false,
    factionLocked: 'Voth',
  },
];

/**
 * Ancient/Precursor Technologies
 * Ultra-rare techs from extinct civilizations
 */
const ANCIENT_TECHS: TechnologyNode[] = [
  {
    id: 'ancient-precursor-fabrication-1',
    name: 'Precursor Matter Assembler',
    branch: 'engineering',
    class: 'ancient',
    type: 'active',
    category: 'Megastructure Engineering',
    subcategory: 'Matter Construction',
    classification: 'Ancient Grade',
    level: 100,
    tier: 12,
    researchCost: 50000,
    progressionConfig: {
      tiers: { max: 20 },
      levels: { max: 200 },
    },
    prerequisiteTechs: [
      'engineering-megastructure-assembly-5',
      'computing-advanced-ai-5',
      'hyperspace-zero-point-tap-1',
    ],
    minimumLevel: 150,
    minimumTechLevel: 90,
    industrialCost: 50000,
    energyCost: 5000,
    materialsNeeded: {
      precursor_metal: 5000,
      exotic_matter: 2000,
      dimensional_stabilizers: 1000,
      void_titanium: 2000,
    },
    researchTime: 500,
    stats: {
      primary: [
        {
          name: 'Construction Speed',
          value: 10000,
          modifier: 1000,
          subStats: { structure_assembly: 15000, resource_efficiency: 99 },
        },
      ],
      secondary: [
        {
          name: 'Material Conversion Efficiency',
          value: 99,
          modifier: 50,
        },
      ],
      resistance: { all: 500 },
      efficiency: 99,
      reliability: 95,
    },
    bonuses: {
      megastructure_build_time: -90,
      resource_efficiency: 250,
      construction_scalability: 1000,
    },
    description:
      'Ancient precursor technology that assembles matter at the atomic level. Can construct megastructures in fractions of normal time. Mechanism of operation remains partly mysterious.',
    flavorText: 'They built wonders. We merely reverse-engineer the ruins they left behind.',
    manufacturer: 'Unknown Precursor Civilization',
    unlocksUpgrades: [],
    maxUpgradeLevel: 20,
    upgradeSlots: 10,
    isResearchable: true,
    isAvailableInMultiplayer: false,
    rarity: 'mythic',
    discoveryBonus: 100,
    passiveEffect: true,
    stackable: false,
  },
];

/**
 * Limited Edition / Event Technologies
 * Special techs available during specific events or seasons
 */
const EVENT_TECHS: TechnologyNode[] = [
  {
    id: 'event-festival-celebration-array-2024',
    name: 'Festival Celebration Array (2024)',
    branch: 'computing',
    class: 'exotic',
    type: 'utility',
    category: 'Entertainment Systems',
    subcategory: 'Celebration Tech',
    classification: 'Event-Limited',
    level: 10,
    tier: 1,
    researchCost: 100,
    progressionConfig: {
      tiers: { max: 5 },
      levels: { max: 20 },
    },
    prerequisiteTechs: [],
    minimumLevel: 5,
    minimumTechLevel: 1,
    industrialCost: 50,
    energyCost: 10,
    materialsNeeded: {
      party_lights: 100,
      celebration_crystals: 50,
    },
    researchTime: 5,
    stats: {
      primary: [
        {
          name: 'Morale Boost',
          value: 50,
          modifier: 100,
          subStats: { crew_happiness: 75, productivity: 25 },
        },
      ],
      secondary: [],
      resistance: {},
      efficiency: 100,
      reliability: 100,
    },
    bonuses: {
      crew_happiness: 50,
      event_point_multiplier: 2,
    },
    description: 'Limited-edition celebration technology available during seasonal events. Boosts crew morale and unlocks special event activities.',
    flavorText: '🎉 Celebrate in style! Available only during festival season. 🎉',
    manufacturer: 'Galactic Entertainment Corp',
    unlocksUpgrades: [],
    maxUpgradeLevel: 5,
    upgradeSlots: 3,
    isResearchable: true,
    isAvailableInMultiplayer: true,
    rarity: 'special',
    discoveryBonus: 0,
    passiveEffect: true,
    stackable: true,
  },
];

/**
 * Combine all custom tech arrays into master export
 */
export const CUSTOM_TECHS: TechnologyNode[] = [
  ...EXPERIMENTAL_TECHS,
  ...FACTION_TECHS,
  ...ANCIENT_TECHS,
  ...EVENT_TECHS,
];

/**
 * Utility functions for working with custom techs
 */

/**
 * Get custom techs by class
 */
export function getCustomTechsByClass(
  techClass: string
): TechnologyNode[] {
  return CUSTOM_TECHS.filter((tech) => tech.class === techClass);
}

/**
 * Get custom techs by rarity
 */
export function getCustomTechsByRarity(
  rarity: string
): TechnologyNode[] {
  return CUSTOM_TECHS.filter((tech) => tech.rarity === rarity);
}

/**
 * Get techs available for a player level
 */
export function getAvailableCustomTechs(
  playerLevel: number
): TechnologyNode[] {
  return CUSTOM_TECHS.filter((tech) => tech.minimumLevel <= playerLevel);
}

/**
 * Get faction-exclusive techs
 */
export function getFactionTechs(factionName?: string): TechnologyNode[] {
  return CUSTOM_TECHS.filter(
    (tech) =>
      tech.factionLocked &&
      (!factionName || tech.factionLocked === factionName)
  );
}

/**
 * Get experimental techs
 */
export function getExperimentalTechs(): TechnologyNode[] {
  return CUSTOM_TECHS.filter((tech) => tech.class === 'experimental');
}

/**
 * Get event-active techs (stub - implement event system integration)
 */
export function getActiveEventTechs(): TechnologyNode[] {
  // TODO: Integrate with event system to check active events
  // For now, return all event techs
  return EVENT_TECHS;
}

/**
 * Calculate total research cost for custom tech
 */
export function calculateCustomTechResearchCost(
  tech: TechnologyNode,
  playerTechLevel: number
): number {
  const baseCost = tech.researchCost;
  const levelAdjustment = TECH_PROGRESSION.levelMultiplier(
    playerTechLevel - tech.minimumTechLevel + 1
  );
  return Math.ceil(baseCost * levelAdjustment);
}

/**
 * Export individual tech category arrays for more granular control
 */
export { EXPERIMENTAL_TECHS, FACTION_TECHS, ANCIENT_TECHS, EVENT_TECHS };
