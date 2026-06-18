/**
 * Civilization Subsystems Configuration
 * Governance, Commerce, Education, and Culture systems with progression
 * @tag #civilization #subsystems #governance #commerce #education #culture
 */

export type { CivilizationSubsystem } from '../types/civilization';
import type { CivilizationSubsystem } from '../types/civilization';

// ============================================================================
// GOVERNANCE SUBSYSTEMS (Administrative)
// ============================================================================

export const GOVERNANCE_SUBSYSTEMS: CivilizationSubsystem[] = [
  {
    id: 'governance-senate-1',
    name: 'Planetary Senate',
    systemType: 'governance',
    level: 1,
    maxLevel: 5,
    efficiency: 80,
    prerequisiteSystems: [],
    buildingsRequired: { 'government_center': 1 },
    populationRequired: 100000,
    productionPerTurn: 50,
    costPerTurn: { credits: 100 },
    bonuses: {
      research: 5,
      production: 5,
      morale: 10,
    },
    isActive: true,
    description: 'Democratic governance body that improves morale and research efficiency through collaborative decision-making.',
    turnsActive: 0,
  },
  {
    id: 'governance-military-tribunal-1',
    name: 'Military Tribunal',
    systemType: 'governance',
    level: 1,
    maxLevel: 5,
    efficiency: 85,
    prerequisiteSystems: ['governance-senate-1'],
    buildingsRequired: { 'military_headquarters': 2 },
    populationRequired: 250000,
    productionPerTurn: 75,
    costPerTurn: { credits: 250, water: 50 },
    bonuses: {
      production: 15,
      morale: 5,
    },
    isActive: true,
    description: 'Military chain of command that organizes military production and increases troop effectiveness.',
    turnsActive: 0,
  },
  {
    id: 'governance-trade-council-1',
    name: 'Trade Council',
    systemType: 'governance',
    level: 1,
    maxLevel: 5,
    efficiency: 75,
    prerequisiteSystems: ['governance-senate-1'],
    buildingsRequired: { 'trading_post': 2 },
    populationRequired: 150000,
    productionPerTurn: 60,
    costPerTurn: { credits: 200, food: 25 },
    bonuses: {
      production: 10,
    },
    isActive: true,
    description: 'Commercial oversight body that increases profit from trade routes and negotiation efficiency.',
    turnsActive: 0,
  },
  {
    id: 'governance-ministry-science-1',
    name: 'Ministry of Science',
    systemType: 'governance',
    level: 1,
    maxLevel: 5,
    efficiency: 90,
    prerequisiteSystems: ['governance-senate-1'],
    buildingsRequired: { 'research_lab': 3 },
    populationRequired: 200000,
    productionPerTurn: 100,
    costPerTurn: { credits: 300, water: 100 },
    bonuses: {
      research: 25,
    },
    isActive: true,
    description: 'Scientific authority that dramatically accelerates technology research and innovation.',
    turnsActive: 0,
  },
];

// ============================================================================
// COMMERCE SUBSYSTEMS (Trade & Economy)
// ============================================================================

export const COMMERCE_SUBSYSTEMS: CivilizationSubsystem[] = [
  {
    id: 'commerce-market-district-1',
    name: 'Market District',
    systemType: 'commerce',
    level: 1,
    maxLevel: 5,
    efficiency: 80,
    prerequisiteSystems: [],
    buildingsRequired: { 'market': 2 },
    populationRequired: 50000,
    productionPerTurn: 40,
    costPerTurn: { credits: 50 },
    bonuses: {
      production: 5,
    },
    isActive: true,
    description: 'Local trading hub that increases resource availability and merchant activity.',
    turnsActive: 0,
  },
  {
    id: 'commerce-spaceport-1',
    name: 'Spaceport Authority',
    systemType: 'commerce',
    level: 1,
    maxLevel: 5,
    efficiency: 85,
    prerequisiteSystems: ['commerce-market-district-1'],
    buildingsRequired: { 'spaceport': 2 },
    populationRequired: 100000,
    productionPerTurn: 80,
    costPerTurn: { credits: 150, water: 50 },
    bonuses: {
      production: 15,
    },
    isActive: true,
    description: 'Interstellar commerce hub enabling trade with distant systems and negotiating better rates.',
    turnsActive: 0,
  },
  {
    id: 'commerce-bank-system-1',
    name: 'Banking System',
    systemType: 'commerce',
    level: 1,
    maxLevel: 5,
    efficiency: 90,
    prerequisiteSystems: ['commerce-market-district-1'],
    buildingsRequired: { 'bank': 1 },
    populationRequired: 75000,
    productionPerTurn: 60,
    costPerTurn: { credits: 200 },
    bonuses: {
      production: 10,
    },
    isActive: true,
    description: 'Financial infrastructure that increases credit generation and investment opportunities.',
    turnsActive: 0,
  },
  {
    id: 'commerce-mining-consortium-1',
    name: 'Mining Consortium',
    systemType: 'commerce',
    level: 1,
    maxLevel: 5,
    efficiency: 75,
    prerequisiteSystems: ['commerce-market-district-1'],
    buildingsRequired: { 'mining_facility': 3 },
    populationRequired: 150000,
    productionPerTurn: 120,
    costPerTurn: { credits: 250, food: 50 },
    bonuses: {
      production: 20,
    },
    isActive: true,
    description: 'Resource extraction cooperative that improves mining output and material quality.',
    turnsActive: 0,
  },
];

// ============================================================================
// EDUCATION SUBSYSTEMS (Research & Innovation)
// ============================================================================

export const EDUCATION_SUBSYSTEMS: CivilizationSubsystem[] = [
  {
    id: 'education-university-1',
    name: 'University',
    systemType: 'education',
    level: 1,
    maxLevel: 5,
    efficiency: 85,
    prerequisiteSystems: [],
    buildingsRequired: { 'university': 1 },
    populationRequired: 50000,
    productionPerTurn: 50,
    costPerTurn: { credits: 100, food: 25 },
    bonuses: {
      research: 15,
    },
    isActive: true,
    description: 'Higher learning institution that trains scholars and accelerates research projects.',
    turnsActive: 0,
  },
  {
    id: 'education-research-institute-1',
    name: 'Research Institute',
    systemType: 'education',
    level: 1,
    maxLevel: 5,
    efficiency: 90,
    prerequisiteSystems: ['education-university-1'],
    buildingsRequired: { 'research_center': 2 },
    populationRequired: 100000,
    productionPerTurn: 100,
    costPerTurn: { credits: 300, water: 100 },
    bonuses: {
      research: 30,
    },
    isActive: true,
    description: 'Advanced research facility focused on cutting-edge discoveries and breakthroughs.',
    turnsActive: 0,
  },
  {
    id: 'education-academy-military-1',
    name: 'Military Academy',
    systemType: 'education',
    level: 1,
    maxLevel: 5,
    efficiency: 80,
    prerequisiteSystems: ['education-university-1'],
    buildingsRequired: { 'military_academy': 1 },
    populationRequired: 80000,
    productionPerTurn: 70,
    costPerTurn: { credits: 150, water: 50 },
    bonuses: {
      production: 10,
    },
    isActive: true,
    description: 'Officer training facility that improves military unit quality and strategic capabilities.',
    turnsActive: 0,
  },
  {
    id: 'education-think-tank-1',
    name: 'Think Tank',
    systemType: 'education',
    level: 1,
    maxLevel: 5,
    efficiency: 95,
    prerequisiteSystems: ['education-research-institute-1'],
    buildingsRequired: { 'think_tank': 1 },
    populationRequired: 120000,
    productionPerTurn: 150,
    costPerTurn: { credits: 500, water: 200 },
    bonuses: {
      research: 50,
    },
    isActive: false,
    description: 'Elite research organization generating revolutionary ideas and technological innovations.',
    turnsActive: 0,
  },
];

// ============================================================================
// CULTURE SUBSYSTEMS (Morale & Identity)
// ============================================================================

export const CULTURE_SUBSYSTEMS: CivilizationSubsystem[] = [
  {
    id: 'culture-festival-grounds-1',
    name: 'Festival Grounds',
    systemType: 'culture',
    level: 1,
    maxLevel: 5,
    efficiency: 80,
    prerequisiteSystems: [],
    buildingsRequired: { 'amphitheater': 1 },
    populationRequired: 30000,
    productionPerTurn: 40,
    costPerTurn: { food: 50 },
    bonuses: {
      morale: 20,
    },
    isActive: true,
    description: 'Entertainment venue hosting festivals and celebrations that boost citizen morale.',
    turnsActive: 0,
  },
  {
    id: 'culture-museum-1',
    name: 'Museum of History',
    systemType: 'culture',
    level: 1,
    maxLevel: 5,
    efficiency: 85,
    prerequisiteSystems: ['culture-festival-grounds-1'],
    buildingsRequired: { 'museum': 1 },
    populationRequired: 50000,
    productionPerTurn: 60,
    costPerTurn: { credits: 100 },
    bonuses: {
      morale: 15,
      research: 5,
    },
    isActive: true,
    description: 'Cultural center preserving civilization history and inspiring research through exhibits.',
    turnsActive: 0,
  },
  {
    id: 'culture-sports-complex-1',
    name: 'Sports Complex',
    systemType: 'culture',
    level: 1,
    maxLevel: 5,
    efficiency: 75,
    prerequisiteSystems: ['culture-festival-grounds-1'],
    buildingsRequired: { 'sports_arena': 1 },
    populationRequired: 40000,
    productionPerTurn: 50,
    costPerTurn: { food: 75 },
    bonuses: {
      morale: 25,
    },
    isActive: true,
    description: 'Athletic venue hosting competitions that unite citizens and boost overall morale.',
    turnsActive: 0,
  },
  {
    id: 'culture-grand-monument-1',
    name: 'Grand Monument',
    systemType: 'culture',
    level: 1,
    maxLevel: 5,
    efficiency: 90,
    prerequisiteSystems: ['culture-museum-1', 'culture-sports-complex-1'],
    buildingsRequired: { 'monument': 1 },
    populationRequired: 100000,
    productionPerTurn: 150,
    costPerTurn: { credits: 250, water: 100 },
    bonuses: {
      morale: 40,
      research: 10,
    },
    isActive: false,
    description: 'Iconic structure representing civilization pride, significantly boosting morale and prestige.',
    turnsActive: 0,
  },
];

// ============================================================================
// SUBSYSTEM UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all available subsystems
 */
export function getAllSubsystems(): CivilizationSubsystem[] {
  return [
    ...GOVERNANCE_SUBSYSTEMS,
    ...COMMERCE_SUBSYSTEMS,
    ...EDUCATION_SUBSYSTEMS,
    ...CULTURE_SUBSYSTEMS,
  ];
}

/**
 * Get subsystems by type
 */
export function getSubsystemsByType(
  systemType: 'governance' | 'commerce' | 'education' | 'culture'
): CivilizationSubsystem[] {
  return getAllSubsystems().filter((sys) => sys.systemType === systemType);
}

/**
 * Get subsystem by ID
 */
export function getSubsystemById(id: string): CivilizationSubsystem | undefined {
  return getAllSubsystems().find((sys) => sys.id === id);
}

/**
 * Get subsystems available at a given level
 */
export function getAvailableSubsystems(
  playerLevel: number
): CivilizationSubsystem[] {
  return getAllSubsystems().filter(
    (sys) =>
      !sys.prerequisiteSystems ||
      sys.prerequisiteSystems.length === 0 ||
      playerLevel >= Math.floor(getAllSubsystems().indexOf(sys) / 4 + 1)
  );
}

/**
 * Calculate total bonuses from active subsystems
 */
export function calculateSubsystemBonuses(
  activeSystems: CivilizationSubsystem[]
): Record<string, number> {
  const bonuses: Record<string, number> = {
    research: 0,
    production: 0,
    morale: 0,
    culture: 0,
  };

  activeSystems.forEach((system) => {
    if (system.isActive && system.bonuses) {
      Object.entries(system.bonuses).forEach(([key, value]) => {
        bonuses[key] = (bonuses[key] || 0) + value;
      });
    }
  });

  return bonuses;
}

/**
 * Get prerequisite chain for a subsystem
 */
export function getPrerequisiteChain(
  systemId: string,
  allSystems: CivilizationSubsystem[] = getAllSubsystems()
): string[] {
  const system = allSystems.find((s) => s.id === systemId);
  if (!system || !system.prerequisiteSystems) return [];

  const chain: string[] = [];
  const queue = [...(system.prerequisiteSystems || [])];

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (!chain.includes(id)) {
      chain.push(id);
      const preq = allSystems.find((s) => s.id === id);
      if (preq?.prerequisiteSystems) {
        queue.push(...preq.prerequisiteSystems);
      }
    }
  }

  return chain;
}

/**
 * Calculate upgrade cost in resources
 */
export function calculateUpgradeCost(
  system: CivilizationSubsystem,
  targetLevel: number
): Record<string, number> {
  const cost: Record<string, number> = {
    credits: 100 * targetLevel * targetLevel,
    water: 50 * targetLevel,
    food: 25 * targetLevel,
  };
  return cost;
}

/**
 * Get total efficiency rating for a subsystem
 */
export function getSubsystemEfficiency(system: CivilizationSubsystem): number {
  return Math.min(100, system.efficiency) * (system.level / system.maxLevel);
}
