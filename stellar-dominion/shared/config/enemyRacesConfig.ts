/**
 * Enemy Races, NPCs, Worlds, and AI Control System
 * 5 distinct enemy factions with unique characteristics, homeworlds, and AI behaviors
 * @tag #enemy #ai #npc #races #worlds
 */

import type { ProgressionStats } from './progressionSystemConfig';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AIPersonality = 
  | 'aggressive' 
  | 'defensive' 
  | 'expansionist' 
  | 'trader' 
  | 'isolationist' 
  | 'warmonger' 
  | 'peaceful' 
  | 'logical';

export type AIStrategy = 
  | 'rush' 
  | 'turtle' 
  | 'balanced' 
  | 'economic' 
  | 'military' 
  | 'technological' 
  | 'diplomatic';

export type DiplomaticStance = 
  | 'hostile' 
  | 'unfriendly' 
  | 'neutral' 
  | 'friendly' 
  | 'allied';

export interface EnemyRace {
  id: string;
  name: string;
  description: string;
  
  // Visual
  appearance: string;
  color: string;
  emblem: string;
  
  // Characteristics
  personality: AIPersonality;
  defaultStance: DiplomaticStance;
  
  // Bonuses & Traits
  bonuses: {
    combat: number;
    research: number;
    economy: number;
    diplomacy: number;
    expansion: number;
  };
  
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  
  // Preferred units & tech
  preferredUnits: string[];
  preferredTech: string[];
  preferredStrategy: AIStrategy;
  
  // Homeworld
  homeworldId: string;
  
  // Base stats
  baseStats: ProgressionStats;
}

export interface EnemyWorld {
  id: string;
  name: string;
  raceId: string;
  
  // Location
  sector: string;
  coordinates: { x: number; y: number; z: number };
  
  // World properties
  type: 'desert' | 'ocean' | 'ice' | 'volcanic' | 'forest' | 'crystal' | 'toxic' | 'metal' | 'gas' | 'artificial';
  size: 'small' | 'medium' | 'large' | 'massive';
  climate: string;
  gravity: number;
  atmosphere: string;
  
  // Resources
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    rare: number;
  };
  
  // Defense
  defenseLevel: number;
  garrison: {
    troops: number;
    ships: number;
    stations: number;
  };
  
  // Population
  population: number;
  populationCap: number;
  
  // Special features
  specialFeatures: string[];
  description: string;
}

export interface NPCEntity {
  id: string;
  name: string;
  raceId: string;
  
  // Type
  type: 'fleet' | 'commander' | 'diplomat' | 'trader' | 'scout' | 'patrol';
  rank: string;
  
  // Stats & Progression
  level: number;
  tier: number;
  experience: number;
  stats: ProgressionStats;
  
  // AI Behavior
  behavior: AIBehavior;
  
  // Location
  currentWorldId: string | null;
  currentSector: string;
  
  // Fleet composition (if applicable)
  fleet?: {
    ships: Array<{ type: string; count: number }>;
    totalPower: number;
  };
  
  // Diplomacy
  diplomaticStance: DiplomaticStance;
  relationshipScore: number;
}

export interface AIBehavior {
  personality: AIPersonality;
  strategy: AIStrategy;
  
  // Decision weights (0-100)
  aggression: number;
  caution: number;
  greed: number;
  honor: number;
  cunning: number;
  
  // Priorities
  priorities: {
    military: number;
    economy: number;
    research: number;
    expansion: number;
    diplomacy: number;
  };
  
  // Behaviors
  attacksOnSight: boolean;
  tradesWithEnemies: boolean;
  honorsAlliances: boolean;
  usesTactics: boolean;
  retreatsWhenWeak: boolean;
  
  // Response patterns
  responseToThreat: 'flee' | 'defend' | 'counterattack' | 'negotiate';
  responseToWeakness: 'ignore' | 'exploit' | 'assist' | 'offer-alliance';
  responseToTrade: 'accept' | 'reject' | 'negotiate' | 'demand-more';
}

export interface AIAction {
  type: 'attack' | 'defend' | 'expand' | 'trade' | 'research' | 'diplomacy' | 'patrol' | 'raid' | 'retreat';
  priority: number;
  targetId?: string;
  reasoning: string;
}

// ============================================================================
// ENEMY RACES (5 FACTIONS)
// ============================================================================

export const ENEMY_RACES: EnemyRace[] = [
  // 1. THE KRELL DOMINION - Aggressive militaristic empire
  {
    id: 'race-krell',
    name: 'The Krell Dominion',
    description: 'A ruthless militaristic empire that believes in conquest through overwhelming force. The Krell have perfected the art of war and view peace as weakness.',
    
    appearance: 'Reptilian humanoids with armored scales, standing 7-8 feet tall with crimson eyes',
    color: '#8B0000', // Dark Red
    emblem: '⚔️',
    
    personality: 'warmonger',
    defaultStance: 'hostile',
    
    bonuses: {
      combat: 30,
      research: 5,
      economy: 10,
      diplomacy: -20,
      expansion: 20,
    },
    
    traits: [
      'Born Warriors',
      'Aggressive Expansion',
      'Military Industrial Complex',
      'Fearless',
      'Intimidating',
    ],
    
    strengths: [
      'Superior combat units',
      'Fast ship production',
      'High troop morale',
      'Excellent weapons technology',
      'Fortified worlds',
    ],
    
    weaknesses: [
      'Weak economy',
      'Poor diplomacy',
      'Slow research',
      'Overextended military',
      'Resented by neighbors',
    ],
    
    preferredUnits: ['Battlecruiser', 'Dreadnought', 'Heavy Infantry', 'Tank', 'Heavy Armor'],
    preferredTech: ['Weapons', 'Armor', 'Shields', 'Propulsion'],
    preferredStrategy: 'military',
    
    homeworldId: 'world-krell-prime',
    
    baseStats: {
      power: 150,
      defense: 120,
      mobility: 80,
      utility: 60,
      precision: 100,
      endurance: 110,
      efficiency: 70,
      control: 90,
      tech: 80,
      command: 130,
      logistics: 90,
      survivability: 120,
      sensorRange: 80,
      energyUse: 90,
      maintenance: 75,
      adaptation: 70,
    },
  },
  
  // 2. THE ZENITH COLLECTIVE - Advanced AI civilization
  {
    id: 'race-zenith',
    name: 'The Zenith Collective',
    description: 'An ancient AI collective that achieved sentience millennia ago. Logical, efficient, and pursuing technological perfection above all else.',
    
    appearance: 'Synthetic beings of chrome and energy, constantly upgrading their forms',
    color: '#00CED1', // Dark Turquoise
    emblem: '🤖',
    
    personality: 'logical',
    defaultStance: 'neutral',
    
    bonuses: {
      combat: 15,
      research: 35,
      economy: 20,
      diplomacy: 0,
      expansion: 10,
    },
    
    traits: [
      'Machine Intelligence',
      'Rapid Adaptation',
      'Technological Superiority',
      'Logical Thinking',
      'Emotionless',
    ],
    
    strengths: [
      'Fastest research',
      'Advanced technology',
      'Efficient production',
      'No morale issues',
      'Precise calculations',
    ],
    
    weaknesses: [
      'Predictable behavior',
      'Poor diplomacy',
      'Resource intensive',
      'Vulnerable to EMP',
      'Limited creativity',
    ],
    
    preferredUnits: ['Drone', 'Mech', 'Scout', 'Robot Factory', 'Gunship'],
    preferredTech: ['Quantum Physics', 'Nanite Assembler', 'Robot Factory', 'Sensors', 'Information Systems'],
    preferredStrategy: 'technological',
    
    homeworldId: 'world-zenith-core',
    
    baseStats: {
      power: 100,
      defense: 90,
      mobility: 110,
      utility: 140,
      precision: 150,
      endurance: 80,
      efficiency: 160,
      control: 140,
      tech: 180,
      command: 90,
      logistics: 130,
      survivability: 85,
      sensorRange: 170,
      energyUse: 95,
      maintenance: 110,
      adaptation: 160,
    },
  },
  
  // 3. THE VARANTHI FEDERATION - Diplomatic traders
  {
    id: 'race-varanthi',
    name: 'The Varanthi Federation',
    description: 'Master traders and diplomats who built an empire through economic dominance and political maneuvering. They prefer credits to conquest.',
    
    appearance: 'Elegant humanoids with iridescent skin and multiple arms, perfect for multitasking',
    color: '#FFD700', // Gold
    emblem: '💰',
    
    personality: 'trader',
    defaultStance: 'friendly',
    
    bonuses: {
      combat: 5,
      research: 15,
      economy: 35,
      diplomacy: 30,
      expansion: 15,
    },
    
    traits: [
      'Master Traders',
      'Diplomatic Excellence',
      'Economic Powerhouse',
      'Vast Trade Networks',
      'Cultural Influence',
    ],
    
    strengths: [
      'Massive wealth',
      'Strong alliances',
      'Trade bonuses',
      'Intelligence networks',
      'Cultural victory paths',
    ],
    
    weaknesses: [
      'Weak military',
      'Relies on mercenaries',
      'Vulnerable to raids',
      'Slow expansion',
      'Expensive units',
    ],
    
    preferredUnits: ['Trader', 'Diplomat', 'Scout', 'Transport', 'Governor'],
    preferredTech: ['Trade Networks', 'Diplomacy', 'Cultural Development', 'Information Systems'],
    preferredStrategy: 'economic',
    
    homeworldId: 'world-varanthi-bazaar',
    
    baseStats: {
      power: 60,
      defense: 70,
      mobility: 100,
      utility: 130,
      precision: 90,
      endurance: 75,
      efficiency: 140,
      control: 110,
      tech: 110,
      command: 100,
      logistics: 150,
      survivability: 80,
      sensorRange: 120,
      energyUse: 70,
      maintenance: 90,
      adaptation: 130,
    },
  },
  
  // 4. THE VOID SWARM - Hive mind bio-horrors
  {
    id: 'race-void-swarm',
    name: 'The Void Swarm',
    description: 'A terrifying hive mind that consumes all organic matter. They grow stronger with every world they devour, expanding like a plague across the stars.',
    
    appearance: 'Insectoid bio-horrors with chitinous exoskeletons and endless numbers',
    color: '#4B0082', // Indigo
    emblem: '👾',
    
    personality: 'aggressive',
    defaultStance: 'hostile',
    
    bonuses: {
      combat: 25,
      research: 10,
      economy: 20,
      diplomacy: -30,
      expansion: 35,
    },
    
    traits: [
      'Hive Mind',
      'Rapid Reproduction',
      'Biological Adaptation',
      'Consume Everything',
      'No Diplomacy',
    ],
    
    strengths: [
      'Endless numbers',
      'Fast expansion',
      'Adaptive evolution',
      'No morale loss',
      'Rapid regeneration',
    ],
    
    weaknesses: [
      'No diplomacy possible',
      'Hated by all',
      'Weak individual units',
      'Predictable tactics',
      'Resource intensive',
    ],
    
    preferredUnits: ['Infantry', 'Conscript', 'Militia', 'Assault Team', 'Walker'],
    preferredTech: ['Ancient Weapons', 'Ancient Civilizations', 'Deuterium Synthesis'],
    preferredStrategy: 'rush',
    
    homeworldId: 'world-void-nest',
    
    baseStats: {
      power: 110,
      defense: 95,
      mobility: 120,
      utility: 70,
      precision: 70,
      endurance: 140,
      efficiency: 90,
      control: 150,
      tech: 70,
      command: 160,
      logistics: 110,
      survivability: 130,
      sensorRange: 90,
      energyUse: 110,
      maintenance: 60,
      adaptation: 140,
    },
  },
  
  // 5. THE CELESTIAL ASCENDANCY - Ancient psychic empire
  {
    id: 'race-celestial',
    name: 'The Celestial Ascendancy',
    description: 'An ancient race that has mastered psychic powers and dimensional manipulation. They view themselves as shepherds of lesser species.',
    
    appearance: 'Ethereal beings of light and energy, barely corporeal',
    color: '#E6E6FA', // Lavender
    emblem: '✨',
    
    personality: 'isolationist',
    defaultStance: 'neutral',
    
    bonuses: {
      combat: 20,
      research: 25,
      economy: 15,
      diplomacy: 10,
      expansion: 5,
    },
    
    traits: [
      'Psychic Powers',
      'Ancient Knowledge',
      'Dimensional Mastery',
      'Superior Technology',
      'Aloof',
    ],
    
    strengths: [
      'Unique abilities',
      'Advanced shields',
      'Powerful champions',
      'Ancient artifacts',
      'Dimensional travel',
    ],
    
    weaknesses: [
      'Low population',
      'Slow expansion',
      'Arrogant',
      'Isolated',
      'Complex technology',
    ],
    
    preferredUnits: ['Commander', 'Elite Guard', 'Flagship', 'Titan', 'Admiral'],
    preferredTech: ['Quantum Physics', 'Warp Drive', 'Cloaking', 'Energy Production', 'Shields'],
    preferredStrategy: 'balanced',
    
    homeworldId: 'world-celestial-sanctum',
    
    baseStats: {
      power: 120,
      defense: 130,
      mobility: 95,
      utility: 140,
      precision: 130,
      endurance: 105,
      efficiency: 120,
      control: 125,
      tech: 160,
      command: 140,
      logistics: 100,
      survivability: 140,
      sensorRange: 150,
      energyUse: 80,
      maintenance: 95,
      adaptation: 120,
    },
  },
];

// ============================================================================
// ENEMY HOMEWORLDS (5 WORLDS)
// ============================================================================

export const ENEMY_WORLDS: EnemyWorld[] = [
  // 1. Krell Prime - Fortified war world
  {
    id: 'world-krell-prime',
    name: 'Krell Prime',
    raceId: 'race-krell',
    
    sector: 'Crimson Sector',
    coordinates: { x: -1200, y: 500, z: -300 },
    
    type: 'volcanic',
    size: 'large',
    climate: 'Harsh volcanic with constant ash storms',
    gravity: 1.3,
    atmosphere: 'Dense with sulfur compounds',
    
    resources: {
      metal: 950000,
      crystal: 400000,
      deuterium: 500000,
      energy: 800000,
      rare: 150000,
    },
    
    defenseLevel: 95,
    garrison: {
      troops: 500000,
      ships: 1200,
      stations: 50,
    },
    
    population: 5000000,
    populationCap: 8000000,
    
    specialFeatures: [
      'Orbital Defense Grid',
      'Planetary Shield',
      'Military Academies',
      'Weapon Foundries',
      'Battle Fleet Yards',
    ],
    
    description: 'A fortified hellscape transformed into the ultimate war machine. Every citizen is a soldier, every factory produces weapons.',
  },
  
  // 2. Zenith Core - Mechanical megacity
  {
    id: 'world-zenith-core',
    name: 'Zenith Core',
    raceId: 'race-zenith',
    
    sector: 'Digital Expanse',
    coordinates: { x: 800, y: -900, z: 200 },
    
    type: 'artificial',
    size: 'massive',
    climate: 'Climate controlled, optimized for efficiency',
    gravity: 1.0,
    atmosphere: 'Artificially maintained, perfect composition',
    
    resources: {
      metal: 1200000,
      crystal: 1500000,
      deuterium: 800000,
      energy: 2000000,
      rare: 500000,
    },
    
    defenseLevel: 90,
    garrison: {
      troops: 300000,
      ships: 800,
      stations: 40,
    },
    
    population: 10000000,
    populationCap: 20000000,
    
    specialFeatures: [
      'Quantum Computing Network',
      'Self-Repairing Infrastructure',
      'Research Mega-Complex',
      'Nanite Factories',
      'AI Mainframe',
    ],
    
    description: 'An entire planet converted into a computer. Every surface gleams with circuitry, every structure serves the Collective\'s calculations.',
  },
  
  // 3. Varanthi Bazaar - Trading hub paradise
  {
    id: 'world-varanthi-bazaar',
    name: 'Varanthi Bazaar',
    raceId: 'race-varanthi',
    
    sector: 'Golden Trade Routes',
    coordinates: { x: 300, y: 400, z: -100 },
    
    type: 'ocean',
    size: 'medium',
    climate: 'Tropical paradise with floating cities',
    gravity: 0.9,
    atmosphere: 'Perfect breathable mix',
    
    resources: {
      metal: 600000,
      crystal: 800000,
      deuterium: 700000,
      energy: 900000,
      rare: 300000,
    },
    
    defenseLevel: 60,
    garrison: {
      troops: 150000,
      ships: 400,
      stations: 25,
    },
    
    population: 8000000,
    populationCap: 12000000,
    
    specialFeatures: [
      'Galactic Trade Hub',
      'Diplomatic Embassy District',
      'Banking Consortiums',
      'Luxury Resorts',
      'Cultural Centers',
    ],
    
    description: 'The galaxy\'s premier trading hub where fortunes are made. Floating cities house markets selling goods from a thousand worlds.',
  },
  
  // 4. Void Nest - Bio-horror breeding ground
  {
    id: 'world-void-nest',
    name: 'The Void Nest',
    raceId: 'race-void-swarm',
    
    sector: 'Dead Zone',
    coordinates: { x: -2000, y: -1500, z: -800 },
    
    type: 'toxic',
    size: 'large',
    climate: 'Poisonous atmosphere with constant mutations',
    gravity: 1.2,
    atmosphere: 'Toxic biohazard, lethal to most life',
    
    resources: {
      metal: 500000,
      crystal: 300000,
      deuterium: 400000,
      energy: 600000,
      rare: 100000,
    },
    
    defenseLevel: 85,
    garrison: {
      troops: 2000000,
      ships: 1500,
      stations: 30,
    },
    
    population: 50000000, // Hive produces endless drones
    populationCap: 100000000,
    
    specialFeatures: [
      'Spawning Pools',
      'Bio-Mass Processors',
      'Evolution Chambers',
      'Hive Mind Nexus',
      'Creep Spread Network',
    ],
    
    description: 'A nightmarish world consumed by the Swarm. Organic structures pulse with alien life as countless drones are spawned endlessly.',
  },
  
  // 5. Celestial Sanctum - Dimensional fortress
  {
    id: 'world-celestial-sanctum',
    name: 'Celestial Sanctum',
    raceId: 'race-celestial',
    
    sector: 'Transcendent Expanse',
    coordinates: { x: 1500, y: 1200, z: 600 },
    
    type: 'crystal',
    size: 'medium',
    climate: 'Stable with psychic resonance fields',
    gravity: 0.8,
    atmosphere: 'Thin but breathable, shimmers with energy',
    
    resources: {
      metal: 700000,
      crystal: 1800000,
      deuterium: 900000,
      energy: 1500000,
      rare: 800000,
    },
    
    defenseLevel: 98,
    garrison: {
      troops: 200000,
      ships: 600,
      stations: 35,
    },
    
    population: 3000000,
    populationCap: 5000000,
    
    specialFeatures: [
      'Dimensional Anchor',
      'Psychic Amplifier Array',
      'Ancient Archives',
      'Reality Stabilizers',
      'Ascension Temples',
    ],
    
    description: 'A world of crystalline towers and floating monuments. Reality itself seems fluid here, bending to the will of its inhabitants.',
  },
];

// ============================================================================
// AI BEHAVIOR TEMPLATES
// ============================================================================

export const AI_BEHAVIORS: Record<AIPersonality, Partial<AIBehavior>> = {
  aggressive: {
    aggression: 75,
    caution: 30,
    greed: 60,
    honor: 40,
    cunning: 50,
    priorities: { military: 80, economy: 40, research: 50, expansion: 70, diplomacy: 20 },
    attacksOnSight: false,
    tradesWithEnemies: false,
    honorsAlliances: true,
    usesTactics: true,
    retreatsWhenWeak: true,
    responseToThreat: 'counterattack',
    responseToWeakness: 'exploit',
    responseToTrade: 'negotiate',
  },
  
  defensive: {
    aggression: 30,
    caution: 80,
    greed: 40,
    honor: 70,
    cunning: 60,
    priorities: { military: 70, economy: 60, research: 60, expansion: 30, diplomacy: 50 },
    attacksOnSight: false,
    tradesWithEnemies: true,
    honorsAlliances: true,
    usesTactics: true,
    retreatsWhenWeak: true,
    responseToThreat: 'defend',
    responseToWeakness: 'ignore',
    responseToTrade: 'accept',
  },
  
  expansionist: {
    aggression: 50,
    caution: 40,
    greed: 70,
    honor: 50,
    cunning: 60,
    priorities: { military: 60, economy: 70, research: 50, expansion: 90, diplomacy: 40 },
    attacksOnSight: false,
    tradesWithEnemies: true,
    honorsAlliances: true,
    usesTactics: true,
    retreatsWhenWeak: true,
    responseToThreat: 'negotiate',
    responseToWeakness: 'exploit',
    responseToTrade: 'accept',
  },
  
  trader: {
    aggression: 20,
    caution: 60,
    greed: 80,
    honor: 60,
    cunning: 70,
    priorities: { military: 30, economy: 90, research: 60, expansion: 50, diplomacy: 80 },
    attacksOnSight: false,
    tradesWithEnemies: true,
    honorsAlliances: true,
    usesTactics: false,
    retreatsWhenWeak: true,
    responseToThreat: 'negotiate',
    responseToWeakness: 'offer-alliance',
    responseToTrade: 'accept',
  },
  
  isolationist: {
    aggression: 40,
    caution: 70,
    greed: 30,
    honor: 80,
    cunning: 50,
    priorities: { military: 60, economy: 50, research: 80, expansion: 20, diplomacy: 30 },
    attacksOnSight: false,
    tradesWithEnemies: false,
    honorsAlliances: true,
    usesTactics: true,
    retreatsWhenWeak: true,
    responseToThreat: 'defend',
    responseToWeakness: 'ignore',
    responseToTrade: 'reject',
  },
  
  warmonger: {
    aggression: 95,
    caution: 20,
    greed: 70,
    honor: 30,
    cunning: 60,
    priorities: { military: 95, economy: 50, research: 40, expansion: 80, diplomacy: 10 },
    attacksOnSight: true,
    tradesWithEnemies: false,
    honorsAlliances: false,
    usesTactics: true,
    retreatsWhenWeak: false,
    responseToThreat: 'counterattack',
    responseToWeakness: 'exploit',
    responseToTrade: 'reject',
  },
  
  peaceful: {
    aggression: 10,
    caution: 70,
    greed: 40,
    honor: 90,
    cunning: 30,
    priorities: { military: 20, economy: 70, research: 70, expansion: 40, diplomacy: 90 },
    attacksOnSight: false,
    tradesWithEnemies: true,
    honorsAlliances: true,
    usesTactics: false,
    retreatsWhenWeak: true,
    responseToThreat: 'negotiate',
    responseToWeakness: 'assist',
    responseToTrade: 'accept',
  },
  
  logical: {
    aggression: 40,
    caution: 60,
    greed: 50,
    honor: 50,
    cunning: 90,
    priorities: { military: 50, economy: 70, research: 90, expansion: 50, diplomacy: 40 },
    attacksOnSight: false,
    tradesWithEnemies: true,
    honorsAlliances: true,
    usesTactics: true,
    retreatsWhenWeak: true,
    responseToThreat: 'defend',
    responseToWeakness: 'exploit',
    responseToTrade: 'negotiate',
  },
};

// ============================================================================
// AI CONTROL SYSTEM
// ============================================================================

export class EnemyAI {
  private race: EnemyRace;
  private behavior: AIBehavior;
  private npcs: Map<string, NPCEntity> = new Map();
  
  constructor(raceId: string) {
    const race = ENEMY_RACES.find(r => r.id === raceId);
    if (!race) throw new Error(`Race ${raceId} not found`);
    
    this.race = race;
    this.behavior = this.createBehavior(race.personality);
  }
  
  private createBehavior(personality: AIPersonality): AIBehavior {
    const template = AI_BEHAVIORS[personality];
    return {
      personality,
      strategy: this.race.preferredStrategy,
      aggression: template.aggression || 50,
      caution: template.caution || 50,
      greed: template.greed || 50,
      honor: template.honor || 50,
      cunning: template.cunning || 50,
      priorities: template.priorities || { military: 50, economy: 50, research: 50, expansion: 50, diplomacy: 50 },
      attacksOnSight: template.attacksOnSight || false,
      tradesWithEnemies: template.tradesWithEnemies || true,
      honorsAlliances: template.honorsAlliances || true,
      usesTactics: template.usesTactics || true,
      retreatsWhenWeak: template.retreatsWhenWeak || true,
      responseToThreat: template.responseToThreat || 'defend',
      responseToWeakness: template.responseToWeakness || 'ignore',
      responseToTrade: template.responseToTrade || 'negotiate',
    };
  }
  
  /**
   * AI decision making - returns next action
   */
  decideAction(
    npcId: string,
    gameState: {
      playerPower: number;
      playerRelation: number;
      nearbyThreats: number;
      availableResources: number;
    }
  ): AIAction {
    const npc = this.npcs.get(npcId);
    if (!npc) throw new Error(`NPC ${npcId} not found`);
    
    const actions: AIAction[] = [];
    
    // Evaluate military action
    if (gameState.nearbyThreats > 0 || this.behavior.attacksOnSight) {
      const militaryPriority = this.behavior.priorities.military + 
        (gameState.nearbyThreats * 10) - 
        (gameState.playerRelation * 0.5);
      
      if (gameState.playerPower < npc.stats.power * 0.7) {
        actions.push({
          type: 'attack',
          priority: militaryPriority * 1.5,
          reasoning: 'Enemy is weak, exploit advantage',
        });
      } else if (this.behavior.responseToThreat === 'counterattack') {
        actions.push({
          type: 'attack',
          priority: militaryPriority,
          reasoning: 'Aggressive response to threat',
        });
      } else if (this.behavior.responseToThreat === 'defend') {
        actions.push({
          type: 'defend',
          priority: militaryPriority * 1.2,
          reasoning: 'Defensive posture against threat',
        });
      }
    }
    
    // Evaluate expansion
    if (gameState.availableResources > 100000) {
      actions.push({
        type: 'expand',
        priority: this.behavior.priorities.expansion,
        reasoning: 'Resources available for expansion',
      });
    }
    
    // Evaluate trade
    if (this.behavior.tradesWithEnemies && gameState.playerRelation > 0) {
      actions.push({
        type: 'trade',
        priority: this.behavior.priorities.economy,
        reasoning: 'Economic opportunity detected',
      });
    }
    
    // Evaluate research
    actions.push({
      type: 'research',
      priority: this.behavior.priorities.research,
      reasoning: 'Technological advancement',
    });
    
    // Evaluate diplomacy
    if (gameState.playerRelation < 50 && gameState.playerPower > npc.stats.power * 1.5) {
      actions.push({
        type: 'diplomacy',
        priority: this.behavior.priorities.diplomacy * 1.5,
        reasoning: 'Player is stronger, seek alliance',
      });
    }
    
    // Patrol if nothing else
    if (actions.length === 0) {
      actions.push({
        type: 'patrol',
        priority: 30,
        reasoning: 'No immediate threats, maintain presence',
      });
    }
    
    // Return highest priority action
    return actions.sort((a, b) => b.priority - a.priority)[0];
  }
  
  /**
   * Calculate relationship modifier based on actions
   */
  calculateRelationshipChange(
    action: 'attack' | 'trade' | 'alliance' | 'betray' | 'assist',
    currentRelation: number
  ): number {
    const honorModifier = this.behavior.honor / 100;
    
    switch (action) {
      case 'attack': return -20 * honorModifier;
      case 'trade': return +5 * honorModifier;
      case 'alliance': return +30 * honorModifier;
      case 'betray': return -50 * honorModifier;
      case 'assist': return +15 * honorModifier;
      default: return 0;
    }
  }
  
  /**
   * Check if AI will honor an alliance
   */
  willHonorAlliance(): boolean {
    if (!this.behavior.honorsAlliances) return false;
    
    // Honor-based chance
    const honorChance = this.behavior.honor / 100;
    return Math.random() < honorChance;
  }
  
  /**
   * Check if AI will retreat from battle
   */
  shouldRetreat(healthPercentage: number, enemyPower: number, ownPower: number): boolean {
    if (!this.behavior.retreatsWhenWeak) return false;
    
    const powerRatio = ownPower / enemyPower;
    const retreatThreshold = (this.behavior.caution / 100) * 0.5;
    
    return healthPercentage < 0.3 || powerRatio < retreatThreshold;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get enemy race by ID
 */
export function getEnemyRace(raceId: string): EnemyRace | undefined {
  return ENEMY_RACES.find(r => r.id === raceId);
}

/**
 * Get enemy world by ID
 */
export function getEnemyWorld(worldId: string): EnemyWorld | undefined {
  return ENEMY_WORLDS.find(w => w.id === worldId);
}

/**
 * Get all worlds for a race
 */
export function getWorldsForRace(raceId: string): EnemyWorld[] {
  return ENEMY_WORLDS.filter(w => w.raceId === raceId);
}

/**
 * Create AI controller for a race
 */
export function createAI(raceId: string): EnemyAI {
  return new EnemyAI(raceId);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ENEMY_RACES,
  ENEMY_WORLDS,
  AI_BEHAVIORS,
  EnemyAI,
  getEnemyRace,
  getEnemyWorld,
  getWorldsForRace,
  createAI,
};
