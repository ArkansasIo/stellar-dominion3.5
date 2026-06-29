/**
 * EVE-Style Government Progression Tree
 * Unlock governance nodes in sequence to strengthen Stability, Law, and Economic Doctrine
 * 
 * Three Primary Pillars:
 * - Stability (Authority, Control, Security)
 * - Law (Rules, Justice, Legitimacy)
 * - Economic Doctrine (Trade, Commerce, Prosperity)
 */

export const GOVERNMENT_MAX_LEVEL = 100;
export const GOVERNMENT_MAX_TIER = 10;
export const LEVELS_PER_TIER = GOVERNMENT_MAX_LEVEL / GOVERNMENT_MAX_TIER;

export type GovernmentPillar = 'stability' | 'law' | 'economic';

export interface GovernmentNodeEffect {
  pillarBonus: number; // Bonus percentage towards the pillar
  infrastructureModifier: number; // Affects building production/speed
  resourceModifier: number; // Resource generation bonus
  populationMorale: number; // Population happiness modifier
  tradingBenefit: number; // Trade route efficiency
  militaryPower: number; // Combat effectiveness
  scienceBonus: number; // Research speed
  stabilityGeneration: number; // Passive stability gain per turn
  lawEnforcement: number; // Crime prevention/espionage defense
  economicGrowth: number; // Economic output bonus
}

export interface GovernmentProgressionNode {
  id: string;
  name: string;
  description: string;
  pillar: GovernmentPillar;
  tier: number;
  requiredLevel: number;
  requiredPillarPoints: number; // Points needed in this pillar to unlock
  maxRank: number;
  icon: string;
  color: string;
  prerequisiteNodeIds: string[];
  effects: GovernmentNodeEffect;
  unlockTime: number; // Time to unlock in seconds
  costResources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

export interface GovernmentTreeDefinition {
  maxLevel: number;
  maxTier: number;
  levelsPerTier: number;
  pillars: GovernmentPillar[];
  nodes: GovernmentProgressionNode[];
}

const DEFAULT_EFFECTS: GovernmentNodeEffect = {
  pillarBonus: 0,
  infrastructureModifier: 0,
  resourceModifier: 0,
  populationMorale: 0,
  tradingBenefit: 0,
  militaryPower: 0,
  scienceBonus: 0,
  stabilityGeneration: 0,
  lawEnforcement: 0,
  economicGrowth: 0,
};

// STABILITY PILLAR - Authority, Control, Security
const STABILITY_NODES: GovernmentProgressionNode[] = [
  {
    id: 'gov-stability-t1-n1',
    name: 'Martial Authority',
    description: 'Establish basic military control and security infrastructure.',
    pillar: 'stability',
    tier: 1,
    requiredLevel: 5,
    requiredPillarPoints: 0,
    maxRank: 5,
    icon: '🛡️',
    color: '#FF4444',
    prerequisiteNodeIds: [],
    effects: {
      ...DEFAULT_EFFECTS,
      militaryPower: 1.05,
      populationMorale: -0.02,
      stabilityGeneration: 0.1,
    },
    unlockTime: 3600,
    costResources: { metal: 5000, crystal: 3000, deuterium: 1000 },
  },
  {
    id: 'gov-stability-t1-n2',
    name: 'Provincial Control',
    description: 'Strengthen control over planetary provinces and territories.',
    pillar: 'stability',
    tier: 1,
    requiredLevel: 10,
    requiredPillarPoints: 20,
    maxRank: 5,
    icon: '🗺️',
    color: '#FF6644',
    prerequisiteNodeIds: ['gov-stability-t1-n1'],
    effects: {
      ...DEFAULT_EFFECTS,
      infrastructureModifier: 0.08,
      populationMorale: 0.01,
      stabilityGeneration: 0.15,
    },
    unlockTime: 7200,
    costResources: { metal: 8000, crystal: 5000, deuterium: 2000 },
  },
  {
    id: 'gov-stability-t2-n1',
    name: 'Absolute Authority',
    description: 'Expand centralized control across the empire.',
    pillar: 'stability',
    tier: 2,
    requiredLevel: 15,
    requiredPillarPoints: 50,
    maxRank: 5,
    icon: '👑',
    color: '#FF8844',
    prerequisiteNodeIds: ['gov-stability-t1-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      militaryPower: 1.12,
      stabilityGeneration: 0.25,
      lawEnforcement: 0.1,
    },
    unlockTime: 14400,
    costResources: { metal: 15000, crystal: 10000, deuterium: 5000 },
  },
  {
    id: 'gov-stability-t2-n2',
    name: 'Security Apparatus',
    description: 'Build extensive security and surveillance networks.',
    pillar: 'stability',
    tier: 2,
    requiredLevel: 20,
    requiredPillarPoints: 70,
    maxRank: 5,
    icon: '📡',
    color: '#FF6666',
    prerequisiteNodeIds: ['gov-stability-t1-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      lawEnforcement: 0.25,
      stabilityGeneration: 0.2,
      populationMorale: -0.05,
    },
    unlockTime: 10800,
    costResources: { metal: 12000, crystal: 8000, deuterium: 4000 },
  },
  {
    id: 'gov-stability-t3-n1',
    name: 'Iron Fist Doctrine',
    description: 'Implement total state control and standardization.',
    pillar: 'stability',
    tier: 3,
    requiredLevel: 30,
    requiredPillarPoints: 120,
    maxRank: 5,
    icon: '⚔️',
    color: '#DD4444',
    prerequisiteNodeIds: ['gov-stability-t2-n1', 'gov-stability-t2-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      militaryPower: 1.25,
      stabilityGeneration: 0.4,
      populationMorale: -0.1,
    },
    unlockTime: 21600,
    costResources: { metal: 30000, crystal: 20000, deuterium: 10000 },
  },
];

// LAW PILLAR - Rules, Justice, Legitimacy
const LAW_NODES: GovernmentProgressionNode[] = [
  {
    id: 'gov-law-t1-n1',
    name: 'Legal Foundation',
    description: 'Establish basic legal codes and justice systems.',
    pillar: 'law',
    tier: 1,
    requiredLevel: 5,
    requiredPillarPoints: 0,
    maxRank: 5,
    icon: '⚖️',
    color: '#4444FF',
    prerequisiteNodeIds: [],
    effects: {
      ...DEFAULT_EFFECTS,
      lawEnforcement: 0.1,
      populationMorale: 0.05,
      tradingBenefit: 0.03,
    },
    unlockTime: 3600,
    costResources: { metal: 4000, crystal: 4000, deuterium: 2000 },
  },
  {
    id: 'gov-law-t1-n2',
    name: 'Civic Rights',
    description: 'Grant citizens fundamental rights and protections.',
    pillar: 'law',
    tier: 1,
    requiredLevel: 10,
    requiredPillarPoints: 20,
    maxRank: 5,
    icon: '📜',
    color: '#6666FF',
    prerequisiteNodeIds: ['gov-law-t1-n1'],
    effects: {
      ...DEFAULT_EFFECTS,
      populationMorale: 0.12,
      resourceModifier: 0.05,
      stabilityGeneration: 0.1,
    },
    unlockTime: 7200,
    costResources: { metal: 6000, crystal: 6000, deuterium: 3000 },
  },
  {
    id: 'gov-law-t2-n1',
    name: 'Democratic Assembly',
    description: 'Establish representative governance structures.',
    pillar: 'law',
    tier: 2,
    requiredLevel: 15,
    requiredPillarPoints: 50,
    maxRank: 5,
    icon: '🏛️',
    color: '#5555DD',
    prerequisiteNodeIds: ['gov-law-t1-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      populationMorale: 0.2,
      tradingBenefit: 0.1,
      scienceBonus: 0.08,
    },
    unlockTime: 14400,
    costResources: { metal: 10000, crystal: 12000, deuterium: 6000 },
  },
  {
    id: 'gov-law-t2-n2',
    name: 'Commercial Law',
    description: 'Establish trade regulations and commercial treaties.',
    pillar: 'law',
    tier: 2,
    requiredLevel: 20,
    requiredPillarPoints: 70,
    maxRank: 5,
    icon: '📋',
    color: '#6666CC',
    prerequisiteNodeIds: ['gov-law-t1-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      tradingBenefit: 0.25,
      economicGrowth: 0.15,
      populationMorale: 0.08,
    },
    unlockTime: 10800,
    costResources: { metal: 8000, crystal: 10000, deuterium: 5000 },
  },
  {
    id: 'gov-law-t3-n1',
    name: 'Justice Perfect',
    description: 'Create an immaculate system of laws and enforcement.',
    pillar: 'law',
    tier: 3,
    requiredLevel: 30,
    requiredPillarPoints: 120,
    maxRank: 5,
    icon: '⚜️',
    color: '#4444CC',
    prerequisiteNodeIds: ['gov-law-t2-n1', 'gov-law-t2-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      lawEnforcement: 0.4,
      populationMorale: 0.25,
      tradingBenefit: 0.15,
    },
    unlockTime: 21600,
    costResources: { metal: 20000, crystal: 25000, deuterium: 12000 },
  },
];

// ECONOMIC PILLAR - Trade, Commerce, Prosperity
const ECONOMIC_NODES: GovernmentProgressionNode[] = [
  {
    id: 'gov-economic-t1-n1',
    name: 'Free Market Initiative',
    description: 'Promote basic trade and commercial activity.',
    pillar: 'economic',
    tier: 1,
    requiredLevel: 5,
    requiredPillarPoints: 0,
    maxRank: 5,
    icon: '💰',
    color: '#44DD44',
    prerequisiteNodeIds: [],
    effects: {
      ...DEFAULT_EFFECTS,
      tradingBenefit: 0.08,
      resourceModifier: 0.05,
      economicGrowth: 0.1,
    },
    unlockTime: 3600,
    costResources: { metal: 3000, crystal: 5000, deuterium: 2000 },
  },
  {
    id: 'gov-economic-t1-n2',
    name: 'Commercial Networks',
    description: 'Develop trading routes and merchant guilds.',
    pillar: 'economic',
    tier: 1,
    requiredLevel: 10,
    requiredPillarPoints: 20,
    maxRank: 5,
    icon: '🚀',
    color: '#66DD66',
    prerequisiteNodeIds: ['gov-economic-t1-n1'],
    effects: {
      ...DEFAULT_EFFECTS,
      tradingBenefit: 0.15,
      resourceModifier: 0.1,
      economicGrowth: 0.18,
    },
    unlockTime: 7200,
    costResources: { metal: 5000, crystal: 8000, deuterium: 3000 },
  },
  {
    id: 'gov-economic-t2-n1',
    name: 'Capitalist Expansion',
    description: 'Scale up commercial enterprises and investments.',
    pillar: 'economic',
    tier: 2,
    requiredLevel: 15,
    requiredPillarPoints: 50,
    maxRank: 5,
    icon: '📈',
    color: '#55DD55',
    prerequisiteNodeIds: ['gov-economic-t1-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      economicGrowth: 0.3,
      resourceModifier: 0.2,
      tradingBenefit: 0.2,
    },
    unlockTime: 14400,
    costResources: { metal: 12000, crystal: 16000, deuterium: 8000 },
  },
  {
    id: 'gov-economic-t2-n2',
    name: 'Production Optimization',
    description: 'Streamline industrial production and efficiency.',
    pillar: 'economic',
    tier: 2,
    requiredLevel: 20,
    requiredPillarPoints: 70,
    maxRank: 5,
    icon: '⚙️',
    color: '#66CC66',
    prerequisiteNodeIds: ['gov-economic-t1-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      infrastructureModifier: 0.15,
      resourceModifier: 0.15,
      economicGrowth: 0.2,
    },
    unlockTime: 10800,
    costResources: { metal: 10000, crystal: 14000, deuterium: 7000 },
  },
  {
    id: 'gov-economic-t3-n1',
    name: 'Economic Dominance',
    description: 'Achieve total economic supremacy and wealth.',
    pillar: 'economic',
    tier: 3,
    requiredLevel: 30,
    requiredPillarPoints: 120,
    maxRank: 5,
    icon: '👸',
    color: '#44DD44',
    prerequisiteNodeIds: ['gov-economic-t2-n1', 'gov-economic-t2-n2'],
    effects: {
      ...DEFAULT_EFFECTS,
      economicGrowth: 0.5,
      resourceModifier: 0.35,
      tradingBenefit: 0.3,
    },
    unlockTime: 21600,
    costResources: { metal: 25000, crystal: 30000, deuterium: 15000 },
  },
];

function generateFullGovernmentTree(): GovernmentProgressionNode[] {
  return [
    ...STABILITY_NODES,
    ...LAW_NODES,
    ...ECONOMIC_NODES,
  ];
}

export const GOVERNMENT_PROGRESSION_TREE_DEFINITION: GovernmentTreeDefinition = {
  maxLevel: GOVERNMENT_MAX_LEVEL,
  maxTier: GOVERNMENT_MAX_TIER,
  levelsPerTier: LEVELS_PER_TIER,
  pillars: ['stability', 'law', 'economic'],
  nodes: generateFullGovernmentTree(),
};

// Helper functions
export function getGovernmentNodeById(nodeId: string): GovernmentProgressionNode | undefined {
  return GOVERNMENT_PROGRESSION_TREE_DEFINITION.nodes.find(n => n.id === nodeId);
}

export function getNodesByPillar(pillar: GovernmentPillar): GovernmentProgressionNode[] {
  return GOVERNMENT_PROGRESSION_TREE_DEFINITION.nodes.filter(n => n.pillar === pillar);
}

export function getNodesByTier(tier: number): GovernmentProgressionNode[] {
  return GOVERNMENT_PROGRESSION_TREE_DEFINITION.nodes.filter(n => n.tier === tier);
}

export function getNodesRequiringNode(nodeId: string): GovernmentProgressionNode[] {
  return GOVERNMENT_PROGRESSION_TREE_DEFINITION.nodes.filter(
    n => n.prerequisiteNodeIds.includes(nodeId)
  );
}

export function canUnlockNode(
  node: GovernmentProgressionNode,
  unlockedNodeIds: string[],
  pillarPoints: Record<GovernmentPillar, number>,
  currentLevel: number
): boolean {
  // Check level requirement
  if (currentLevel < node.requiredLevel) return false;

  // Check pillar points requirement
  if (pillarPoints[node.pillar] < node.requiredPillarPoints) return false;

  // Check prerequisites
  return node.prerequisiteNodeIds.every(preqId => unlockedNodeIds.includes(preqId));
}

export function calculateNodeCost(node: GovernmentProgressionNode, rank: number): {
  metal: number;
  crystal: number;
  deuterium: number;
} {
  const rankMultiplier = Math.pow(1.1, rank - 1); // 10% increase per rank
  return {
    metal: Math.floor(node.costResources.metal * rankMultiplier),
    crystal: Math.floor(node.costResources.crystal * rankMultiplier),
    deuterium: Math.floor(node.costResources.deuterium * rankMultiplier),
  };
}

export function calculateUnlockTime(node: GovernmentProgressionNode, rank: number): number {
  const rankMultiplier = Math.pow(1.08, rank - 1); // 8% increase per rank
  return Math.floor(node.unlockTime * rankMultiplier);
}
