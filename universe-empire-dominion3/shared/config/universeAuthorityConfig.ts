/**
 * Universe Authority Tier System
 * 9-tier authority level for the universe affecting NPC, player enemies,
 * and player empire difficulty scaling
 * @tag #authority #tier #difficulty #npc #enemy
 */

// ============================================================================
// TYPES
// ============================================================================

export type UniverseAuthorityTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type AuthorityTierName =
  | 'nascent'
  | 'emerging'
  | 'established'
  | 'regional'
  | 'dominant'
  | 'sovereign'
  | 'galactic'
  | 'imperial'
  | 'transcendent';

export interface AuthorityNpcDifficulty {
  enemyStrengthMultiplier: number;
  aggressionModifier: number;
  fleetPowerMultiplier: number;
  spawnRateMultiplier: number;
  behaviorComplexity: 'basic' | 'advanced' | 'expert' | 'elite' | 'legendary';
  diplomacyHostility: number;
  aiResponseSpeed: number;
  reinforcementDelay: number;
}

export interface AuthorityPlayerEnemyDifficulty {
  combatPowerMultiplier: number;
  defenseMultiplier: number;
  attackFrequency: number;
  stealthCapability: number;
  counterIntelligence: number;
  retaliationStrength: number;
  territoryAggression: number;
}

export interface AuthorityPlayerEmpireDifficulty {
  resourceMultiplier: number;
  researchMultiplier: number;
  combatMultiplier: number;
  buildSpeedMultiplier: number;
  moraleEffect: number;
  expansionCostModifier: number;
  diplomaticInfluenceModifier: number;
  reputationGainMultiplier: number;
}

export interface AuthorityTierEntry {
  readonly tier: UniverseAuthorityTier;
  readonly name: AuthorityTierName;
  readonly title: string;
  readonly description: string;
  readonly color: string;
  readonly icon: string;
  readonly requirements: {
    readonly minEmpireLevel: number;
    readonly minGalaxyControl: number;
    readonly requiredPrestige: number;
    readonly requiredVictories: number;
  };
  readonly npcDifficulty: AuthorityNpcDifficulty;
  readonly playerEnemyDifficulty: AuthorityPlayerEnemyDifficulty;
  readonly playerEmpireDifficulty: AuthorityPlayerEmpireDifficulty;
  readonly unlocks: readonly string[];
}

// ============================================================================
// AUTHORITY TIERS 1-9
// ============================================================================

export const UNIVERSE_AUTHORITY_TIERS: readonly AuthorityTierEntry[] = [
  {
    tier: 1,
    name: 'nascent',
    title: 'Nascent Authority',
    description: 'A fledgling presence in the galaxy. Basic infrastructure with minimal influence over local space.',
    color: '#6b7280',
    icon: '○',
    requirements: {
      minEmpireLevel: 1,
      minGalaxyControl: 0,
      requiredPrestige: 0,
      requiredVictories: 0,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 0.4,
      aggressionModifier: 0.2,
      fleetPowerMultiplier: 0.3,
      spawnRateMultiplier: 0.5,
      behaviorComplexity: 'basic',
      diplomacyHostility: 0.1,
      aiResponseSpeed: 1.0,
      reinforcementDelay: 1.0,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 0.3,
      defenseMultiplier: 0.3,
      attackFrequency: 0.1,
      stealthCapability: 0.0,
      counterIntelligence: 0.0,
      retaliationStrength: 0.2,
      territoryAggression: 0.1,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 1.5,
      researchMultiplier: 1.5,
      combatMultiplier: 1.3,
      buildSpeedMultiplier: 1.5,
      moraleEffect: 1.2,
      expansionCostModifier: 0.6,
      diplomaticInfluenceModifier: 1.5,
      reputationGainMultiplier: 1.5,
    },
    unlocks: ['basic_colonization', 'scout_ships', 'resource_extraction_i'],
  },
  {
    tier: 2,
    name: 'emerging',
    title: 'Emerging Authority',
    description: 'Growing influence across multiple systems. Established trade routes and defensive networks.',
    color: '#737373',
    icon: '◔',
    requirements: {
      minEmpireLevel: 10,
      minGalaxyControl: 5,
      requiredPrestige: 100,
      requiredVictories: 1,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 0.55,
      aggressionModifier: 0.3,
      fleetPowerMultiplier: 0.45,
      spawnRateMultiplier: 0.65,
      behaviorComplexity: 'basic',
      diplomacyHostility: 0.2,
      aiResponseSpeed: 0.95,
      reinforcementDelay: 0.95,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 0.45,
      defenseMultiplier: 0.45,
      attackFrequency: 0.2,
      stealthCapability: 0.1,
      counterIntelligence: 0.1,
      retaliationStrength: 0.35,
      territoryAggression: 0.2,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 1.4,
      researchMultiplier: 1.4,
      combatMultiplier: 1.2,
      buildSpeedMultiplier: 1.4,
      moraleEffect: 1.15,
      expansionCostModifier: 0.65,
      diplomaticInfluenceModifier: 1.4,
      reputationGainMultiplier: 1.4,
    },
    unlocks: ['basic_trade', 'defense_platforms', 'resource_extraction_ii', 'scout_expansion'],
  },
  {
    tier: 3,
    name: 'established',
    title: 'Established Authority',
    description: 'A recognized power in the sector. Stable economy with growing military capacity.',
    color: '#a3a3a3',
    icon: '◕',
    requirements: {
      minEmpireLevel: 25,
      minGalaxyControl: 15,
      requiredPrestige: 500,
      requiredVictories: 3,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 0.7,
      aggressionModifier: 0.4,
      fleetPowerMultiplier: 0.6,
      spawnRateMultiplier: 0.8,
      behaviorComplexity: 'advanced',
      diplomacyHostility: 0.3,
      aiResponseSpeed: 0.9,
      reinforcementDelay: 0.9,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 0.6,
      defenseMultiplier: 0.6,
      attackFrequency: 0.35,
      stealthCapability: 0.15,
      counterIntelligence: 0.2,
      retaliationStrength: 0.5,
      territoryAggression: 0.35,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 1.3,
      researchMultiplier: 1.3,
      combatMultiplier: 1.15,
      buildSpeedMultiplier: 1.3,
      moraleEffect: 1.1,
      expansionCostModifier: 0.7,
      diplomaticInfluenceModifier: 1.3,
      reputationGainMultiplier: 1.3,
    },
    unlocks: ['cruiser_fleet', 'research_network', 'diplomatic_corps', 'trade_hubs'],
  },
  {
    tier: 4,
    name: 'regional',
    title: 'Regional Authority',
    description: 'Dominance over a cluster of sectors. Advanced infrastructure and formidable fleet presence.',
    color: '#d4d4d4',
    icon: '◉',
    requirements: {
      minEmpireLevel: 50,
      minGalaxyControl: 35,
      requiredPrestige: 2000,
      requiredVictories: 5,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 0.85,
      aggressionModifier: 0.5,
      fleetPowerMultiplier: 0.75,
      spawnRateMultiplier: 0.9,
      behaviorComplexity: 'advanced',
      diplomacyHostility: 0.4,
      aiResponseSpeed: 0.85,
      reinforcementDelay: 0.85,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 0.75,
      defenseMultiplier: 0.75,
      attackFrequency: 0.5,
      stealthCapability: 0.25,
      counterIntelligence: 0.3,
      retaliationStrength: 0.65,
      territoryAggression: 0.5,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 1.2,
      researchMultiplier: 1.2,
      combatMultiplier: 1.1,
      buildSpeedMultiplier: 1.2,
      moraleEffect: 1.05,
      expansionCostModifier: 0.75,
      diplomaticInfluenceModifier: 1.2,
      reputationGainMultiplier: 1.2,
    },
    unlocks: ['battleship_fleet', 'starbase_network', 'alliance_system', 'advanced_research'],
  },
  {
    tier: 5,
    name: 'dominant',
    title: 'Dominant Authority',
    description: 'A major power with influence spanning multiple clusters. Cutting-edge technology and elite forces.',
    color: '#f5f5f5',
    icon: '⬟',
    requirements: {
      minEmpireLevel: 100,
      minGalaxyControl: 75,
      requiredPrestige: 5000,
      requiredVictories: 10,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 1.0,
      aggressionModifier: 0.6,
      fleetPowerMultiplier: 1.0,
      spawnRateMultiplier: 1.0,
      behaviorComplexity: 'expert',
      diplomacyHostility: 0.5,
      aiResponseSpeed: 0.8,
      reinforcementDelay: 0.8,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 1.0,
      defenseMultiplier: 1.0,
      attackFrequency: 0.65,
      stealthCapability: 0.35,
      counterIntelligence: 0.4,
      retaliationStrength: 0.8,
      territoryAggression: 0.65,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 1.1,
      researchMultiplier: 1.1,
      combatMultiplier: 1.05,
      buildSpeedMultiplier: 1.1,
      moraleEffect: 1.0,
      expansionCostModifier: 0.8,
      diplomaticInfluenceModifier: 1.1,
      reputationGainMultiplier: 1.1,
    },
    unlocks: ['dreadnought_fleet', 'megastructure_access', 'galactic_trade', 'elite_divisions'],
  },
  {
    tier: 6,
    name: 'sovereign',
    title: 'Sovereign Authority',
    description: 'Unquestioned ruler over vast territories. Self-sufficient empire with galaxy-spanning logistics.',
    color: '#fbbf24',
    icon: '⬡',
    requirements: {
      minEmpireLevel: 200,
      minGalaxyControl: 150,
      requiredPrestige: 15000,
      requiredVictories: 20,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 1.2,
      aggressionModifier: 0.7,
      fleetPowerMultiplier: 1.25,
      spawnRateMultiplier: 1.15,
      behaviorComplexity: 'expert',
      diplomacyHostility: 0.6,
      aiResponseSpeed: 0.75,
      reinforcementDelay: 0.75,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 1.25,
      defenseMultiplier: 1.2,
      attackFrequency: 0.75,
      stealthCapability: 0.45,
      counterIntelligence: 0.5,
      retaliationStrength: 0.9,
      territoryAggression: 0.75,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 1.0,
      researchMultiplier: 1.0,
      combatMultiplier: 1.0,
      buildSpeedMultiplier: 1.0,
      moraleEffect: 0.95,
      expansionCostModifier: 0.85,
      diplomaticInfluenceModifier: 1.0,
      reputationGainMultiplier: 1.0,
    },
    unlocks: ['titan_fleet', 'megastructure_construction', 'sovereign_decrees', 'galactic_network'],
  },
  {
    tier: 7,
    name: 'galactic',
    title: 'Galactic Authority',
    description: 'A galactic superpower. Your word shapes the destiny of entire sectors and civilizations.',
    color: '#f97316',
    icon: '◆',
    requirements: {
      minEmpireLevel: 400,
      minGalaxyControl: 300,
      requiredPrestige: 50000,
      requiredVictories: 35,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 1.5,
      aggressionModifier: 0.8,
      fleetPowerMultiplier: 1.5,
      spawnRateMultiplier: 1.3,
      behaviorComplexity: 'elite',
      diplomacyHostility: 0.7,
      aiResponseSpeed: 0.7,
      reinforcementDelay: 0.7,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 1.5,
      defenseMultiplier: 1.5,
      attackFrequency: 0.85,
      stealthCapability: 0.55,
      counterIntelligence: 0.6,
      retaliationStrength: 1.0,
      territoryAggression: 0.85,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 0.9,
      researchMultiplier: 0.9,
      combatMultiplier: 0.95,
      buildSpeedMultiplier: 0.9,
      moraleEffect: 0.9,
      expansionCostModifier: 0.9,
      diplomaticInfluenceModifier: 0.9,
      reputationGainMultiplier: 0.9,
    },
    unlocks: ['ascended_ships', 'galactic_megastructures', 'reality_manipulation', 'wormhole_network'],
  },
  {
    tier: 8,
    name: 'imperial',
    title: 'Imperial Authority',
    description: 'An empire that rivals ancient civilizations. Your dominion approaches the scale of known space.',
    color: '#ef4444',
    icon: '⬥',
    requirements: {
      minEmpireLevel: 700,
      minGalaxyControl: 500,
      requiredPrestige: 150000,
      requiredVictories: 50,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 2.0,
      aggressionModifier: 0.9,
      fleetPowerMultiplier: 2.0,
      spawnRateMultiplier: 1.5,
      behaviorComplexity: 'elite',
      diplomacyHostility: 0.8,
      aiResponseSpeed: 0.65,
      reinforcementDelay: 0.65,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 2.0,
      defenseMultiplier: 2.0,
      attackFrequency: 0.95,
      stealthCapability: 0.7,
      counterIntelligence: 0.75,
      retaliationStrength: 1.2,
      territoryAggression: 0.95,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 0.8,
      researchMultiplier: 0.8,
      combatMultiplier: 0.9,
      buildSpeedMultiplier: 0.8,
      moraleEffect: 0.85,
      expansionCostModifier: 0.95,
      diplomaticInfluenceModifier: 0.8,
      reputationGainMultiplier: 0.8,
    },
    unlocks: ['stellar_ascension', 'imperial_edicts', 'quantum_network', 'dyson_synthesis'],
  },
  {
    tier: 9,
    name: 'transcendent',
    title: 'Transcendent Authority',
    description: 'Beyond mortal governance. Your consciousness permeates the fabric of spacetime itself.',
    color: '#dc2626',
    icon: '✦',
    requirements: {
      minEmpireLevel: 1000,
      minGalaxyControl: 750,
      requiredPrestige: 500000,
      requiredVictories: 100,
    },
    npcDifficulty: {
      enemyStrengthMultiplier: 3.0,
      aggressionModifier: 1.0,
      fleetPowerMultiplier: 3.0,
      spawnRateMultiplier: 2.0,
      behaviorComplexity: 'legendary',
      diplomacyHostility: 1.0,
      aiResponseSpeed: 0.5,
      reinforcementDelay: 0.5,
    },
    playerEnemyDifficulty: {
      combatPowerMultiplier: 3.0,
      defenseMultiplier: 3.0,
      attackFrequency: 1.0,
      stealthCapability: 0.9,
      counterIntelligence: 0.9,
      retaliationStrength: 1.5,
      territoryAggression: 1.0,
    },
    playerEmpireDifficulty: {
      resourceMultiplier: 0.7,
      researchMultiplier: 0.7,
      combatMultiplier: 0.85,
      buildSpeedMultiplier: 0.7,
      moraleEffect: 0.8,
      expansionCostModifier: 1.0,
      diplomaticInfluenceModifier: 0.7,
      reputationGainMultiplier: 0.7,
    },
    unlocks: ['transcendence_project', 'divine_intervention', 'universal_law', 'creation_engine'],
  },
];

// ============================================================================
// LOOKUP HELPERS
// ============================================================================

export function getAuthorityTier(tier: UniverseAuthorityTier): AuthorityTierEntry | undefined {
  return UNIVERSE_AUTHORITY_TIERS.find(t => t.tier === tier);
}

export function getAuthorityTierByName(name: AuthorityTierName): AuthorityTierEntry | undefined {
  return UNIVERSE_AUTHORITY_TIERS.find(t => t.name === name);
}

export function getNextAuthorityTier(currentTier: UniverseAuthorityTier): AuthorityTierEntry | undefined {
  return UNIVERSE_AUTHORITY_TIERS.find(t => t.tier === currentTier + 1 as UniverseAuthorityTier);
}

export function getAuthorityTierForEmpire(empireLevel: number, galaxyControl: number, prestige: number): AuthorityTierEntry {
  let highestTier = UNIVERSE_AUTHORITY_TIERS[0];
  for (const tier of UNIVERSE_AUTHORITY_TIERS) {
    if (
      empireLevel >= tier.requirements.minEmpireLevel &&
      galaxyControl >= tier.requirements.minGalaxyControl &&
      prestige >= tier.requirements.requiredPrestige
    ) {
      highestTier = tier;
    }
  }
  return highestTier;
}

export function getAuthorityTierForLevel(empireLevel: number): UniverseAuthorityTier {
  let tier: UniverseAuthorityTier = 1;
  for (const entry of UNIVERSE_AUTHORITY_TIERS) {
    if (empireLevel >= entry.requirements.minEmpireLevel) {
      tier = entry.tier;
    }
  }
  return tier;
}

export function calculateNpcDifficultyMultipliers(authorityTier: UniverseAuthorityTier): {
  strengthMultiplier: number;
  aggressionModifier: number;
  fleetPowerMultiplier: number;
} {
  const entry = getAuthorityTier(authorityTier);
  if (!entry) return { strengthMultiplier: 1.0, aggressionModifier: 0.5, fleetPowerMultiplier: 1.0 };
  return {
    strengthMultiplier: entry.npcDifficulty.enemyStrengthMultiplier,
    aggressionModifier: entry.npcDifficulty.aggressionModifier,
    fleetPowerMultiplier: entry.npcDifficulty.fleetPowerMultiplier,
  };
}

export function calculatePlayerEnemyDifficultyMultipliers(authorityTier: UniverseAuthorityTier): {
  combatPowerMultiplier: number;
  defenseMultiplier: number;
  attackFrequency: number;
} {
  const entry = getAuthorityTier(authorityTier);
  if (!entry) return { combatPowerMultiplier: 1.0, defenseMultiplier: 1.0, attackFrequency: 0.5 };
  return {
    combatPowerMultiplier: entry.playerEnemyDifficulty.combatPowerMultiplier,
    defenseMultiplier: entry.playerEnemyDifficulty.defenseMultiplier,
    attackFrequency: entry.playerEnemyDifficulty.attackFrequency,
  };
}

export function calculatePlayerEmpireDifficultyMultipliers(authorityTier: UniverseAuthorityTier): {
  resourceMultiplier: number;
  researchMultiplier: number;
  combatMultiplier: number;
} {
  const entry = getAuthorityTier(authorityTier);
  if (!entry) return { resourceMultiplier: 1.0, researchMultiplier: 1.0, combatMultiplier: 1.0 };
  return {
    resourceMultiplier: entry.playerEmpireDifficulty.resourceMultiplier,
    researchMultiplier: entry.playerEmpireDifficulty.researchMultiplier,
    combatMultiplier: entry.playerEmpireDifficulty.combatMultiplier,
  };
}
