/**
 * NPC Races Configuration - 35 Unique Factions
 * Complete race definitions with stats, culture, homeworld, and gameplay mechanics
 * @tag #npc #races #factions #config
 */

import type { AIPersonality, AIStrategy, DiplomaticStance } from './enemyRacesConfig';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface NPCRace {
  id: string;
  name: string;
  description: string;

  // Classification
  category: 'military' | 'science' | 'trade' | 'hive' | 'ancient';
  subcategory: string;

  // Appearance
  appearance: string;
  color: string;
  emblem: string;

  // AI Behavior
  personality: AIPersonality;
  defaultStance: DiplomaticStance;
  preferredStrategy: AIStrategy;

  // Bonuses (must sum to ~100 base)
  bonuses: {
    combat: number;
    research: number;
    economy: number;
    diplomacy: number;
    expansion: number;
  };

  // Traits & Strengths
  traits: string[];
  strengths: string[];
  weaknesses: string[];

  // Units & Tech
  preferredUnits: string[];
  preferredTech: string[];

  // Homeworld
  homeworld: {
    name: string;
    planetClass: string;
    size: string;
    description: string;
  };

  // Guild & Alliance
  guildName: string;
  allianceAffinity: string[];
  enemyAffinity: string[];

  // NPC Spawning
  spawnWeight: number;
  fleetStrength: number;
  territorySize: number;

  // Mercenary
  offersMercenaries: boolean;
  mercenaryCostModifier: number;

  // Pirate
  isPirateSource: boolean;
  pirateAggression: number;

  // Base stats
  baseStats: {
    power: number;
    defense: number;
    mobility: number;
    utility: number;
    precision: number;
    endurance: number;
    efficiency: number;
    control: number;
    tech: number;
    command: number;
    logistics: number;
    survivability: number;
    sensorRange: number;
    energyUse: number;
    maintenance: number;
    adaptation: number;
  };
}

// ============================================================================
// NPC RACES (35 FACTIONS)
// ============================================================================

export const NPC_RACES: NPCRace[] = [

  // ==========================================================================
  // MILITARY RACES (8)
  // ==========================================================================

  // 1. KRELL DOMINION - Aggressive militaristic empire
  {
    id: 'race-krell',
    name: 'The Krell Dominion',
    description: 'A ruthless militaristic empire that believes in conquest through overwhelming force. The Krell have perfected the art of war and view peace as weakness.',

    category: 'military',
    subcategory: 'aggressive-conqueror',

    appearance: 'Reptilian humanoids with armored scales, standing 7-8 feet tall with crimson eyes',
    color: '#8B0000',
    emblem: '⚔️',

    personality: 'warmonger',
    defaultStance: 'hostile',
    preferredStrategy: 'military',

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

    homeworld: {
      name: 'Krell Prime',
      planetClass: 'V7',
      size: 'Large',
      description: 'A fortified hellscape of volcanic ash and crimson skies. Every citizen is a soldier, every factory produces weapons.',
    },

    guildName: 'The Warborn Legion',
    allianceAffinity: ['race-gorn', 'race-nausicaan'],
    enemyAffinity: ['race-varanthi', 'race-zenith', 'race-ferengi'],

    spawnWeight: 85,
    fleetStrength: 95,
    territorySize: 18,

    offersMercenaries: true,
    mercenaryCostModifier: 1.2,

    isPirateSource: false,
    pirateAggression: 10,

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

  // 2. TERRAN FEDERATION - Human alliance, balanced
  {
    id: 'race-terran-federation',
    name: 'Terran Federation',
    description: 'The united front of humanity, combining diverse Earth cultures into a resilient interstellar alliance. Adaptable, determined, and endlessly innovative.',

    category: 'military',
    subcategory: 'balanced-defender',

    appearance: 'Baseline humans with optional cybernetic enhancements, wearing blue and silver uniforms',
    color: '#1E3A8A',
    emblem: '🌍',

    personality: 'aggressive',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 20,
      research: 15,
      economy: 20,
      diplomacy: 15,
      expansion: 15,
    },

    traits: [
      'Adaptable',
      'Indomitable Spirit',
      'Technological Generalists',
      'Diplomatic',
      'Resilient',
    ],

    strengths: [
      'Balanced capabilities',
      'Strong diplomacy',
      'Rapid adaptation',
      'Diverse tech tree',
      'High population growth',
    ],

    weaknesses: [
      'No extreme specializations',
      'Internal political divisions',
      'Resource hungry',
      'Vulnerable to early rushes',
      'Bureaucratic delays',
    ],

    preferredUnits: ['Frigate', 'Cruiser', 'Marines', 'Carrier', 'Battlecruiser'],
    preferredTech: ['Warp Drive', 'Shields', 'Weapons', 'Computers', 'Biology'],

    homeworld: {
      name: 'Earth',
      planetClass: 'M1',
      size: 'Medium',
      description: 'The cradle of humanity. A diverse blue marble with thriving megacities alongside preserved wilderness reserves.',
    },

    guildName: 'United Earth Command',
    allianceAffinity: ['race-bajoran', 'race-trill', 'race-vulcan'],
    enemyAffinity: ['race-krell', 'race-borg', 'race-hierarchy'],

    spawnWeight: 90,
    fleetStrength: 80,
    territorySize: 15,

    offersMercenaries: true,
    mercenaryCostModifier: 1.0,

    isPirateSource: false,
    pirateAggression: 5,

    baseStats: {
      power: 110,
      defense: 100,
      mobility: 100,
      utility: 100,
      precision: 100,
      endurance: 100,
      efficiency: 100,
      control: 100,
      tech: 100,
      command: 100,
      logistics: 100,
      survivability: 100,
      sensorRange: 100,
      energyUse: 100,
      maintenance: 100,
      adaptation: 120,
    },
  },

  // 3. KLINGON EMPIRE - Honor-bound warriors
  {
    id: 'race-klingon',
    name: 'Klingon Empire',
    description: 'A proud warrior race bound by strict codes of honor. Klingons value glory in battle above all else and despise deception.',

    category: 'military',
    subcategory: 'honor-bound-warrior',

    appearance: 'Tall, ridged humanoids with heavy brows, dark hair, and fierce expressions',
    color: '#7C2D12',
    emblem: '🗡️',

    personality: 'aggressive',
    defaultStance: 'unfriendly',
    preferredStrategy: 'military',

    bonuses: {
      combat: 28,
      research: 8,
      economy: 10,
      diplomacy: 5,
      expansion: 15,
    },

    traits: [
      'Warrior Code',
      'Honor Bound',
      'Melee Specialists',
      'Fearless Fighters',
      'Clan Loyalty',
    ],

    strengths: [
      'Elite ground troops',
      'Fierce boarding parties',
      'High morale in battle',
      'Honor-based alliances',
      'Powerful close combat',
    ],

    weaknesses: [
      'Arrogant in victory',
      'Poor economic focus',
      'Disdain for stealth tactics',
      'Internal clan rivalries',
      'Slow technological adoption',
    ],

    preferredUnits: ['Bird of Prey', 'Battlecruiser', 'Warrior Elite', 'Transport', 'Assault Team'],
    preferredTech: ['Weapons', 'Armor', 'Melee Systems', 'Shields'],

    homeworld: {
      name: 'Qo\'noS',
      planetClass: 'K5',
      size: 'Large',
      description: 'A temperate world of dramatic mountains and vast battlefields. Ancient honor grounds dot every continent.',
    },

    guildName: 'High Council of the Empire',
    allianceAffinity: ['race-krell', 'race-nihari'],
    enemyAffinity: ['race-romulan', 'race-cardassian', 'race-zenith'],

    spawnWeight: 80,
    fleetStrength: 85,
    territorySize: 16,

    offersMercenaries: true,
    mercenaryCostModifier: 0.9,

    isPirateSource: false,
    pirateAggression: 25,

    baseStats: {
      power: 140,
      defense: 100,
      mobility: 90,
      utility: 60,
      precision: 90,
      endurance: 110,
      efficiency: 70,
      control: 80,
      tech: 70,
      command: 120,
      logistics: 80,
      survivability: 110,
      sensorRange: 85,
      energyUse: 95,
      maintenance: 80,
      adaptation: 70,
    },
  },

  // 4. ROMULAN STAR EMPIRE - Cunning, cloaking tech
  {
    id: 'race-romulan',
    name: 'Romulan Star Empire',
    description: 'A secretive empire ruled by cunning politicians and brilliant strategists. Their cloaking technology and spy networks make them unpredictable.',

    category: 'military',
    subcategory: 'stealth-espionage',

    appearance: 'Vulcan-like humanoids with sharp features, green-tinged skin, and hawkish expressions',
    color: '#064E3B',
    emblem: '🦅',

    personality: 'logical',
    defaultStance: 'unfriendly',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 22,
      research: 18,
      economy: 15,
      diplomacy: 10,
      expansion: 12,
    },

    traits: [
      'Cloaking Mastery',
      'Espionage Networks',
      'Cunning Strategists',
      'Secret Police',
      'Political Intrigue',
    ],

    strengths: [
      'Invisible fleet operations',
      'Superior intelligence',
      'Ambush tactics',
      'Political manipulation',
      'Advanced energy weapons',
    ],

    weaknesses: [
      'Paranoid leadership',
      'Resource limited',
      'Small fleet numbers',
      'Internal power struggles',
      'Arrogance',
    ],

    preferredUnits: ['Warbird', 'Scout', 'Assassin', 'Spy', 'Cloaked Frigate'],
    preferredTech: ['Cloaking', 'Espionage', 'Warp Drive', 'Energy Weapons', 'Shields'],

    homeworld: {
      name: 'Romulus',
      planetClass: 'M3',
      size: 'Medium',
      description: 'A green world of towering cities and hidden military installations. Beneath the beauty lies a web of surveillance.',
    },

    guildName: 'The Tal Shiar Dominion',
    allianceAffinity: ['race-cardassian', 'race-bynar'],
    enemyAffinity: ['race-klingon', 'race-terran-federation', 'race-bajoran'],

    spawnWeight: 75,
    fleetStrength: 80,
    territorySize: 14,

    offersMercenaries: true,
    mercenaryCostModifier: 1.5,

    isPirateSource: true,
    pirateAggression: 40,

    baseStats: {
      power: 120,
      defense: 100,
      mobility: 130,
      utility: 90,
      precision: 120,
      endurance: 90,
      efficiency: 100,
      control: 110,
      tech: 110,
      command: 100,
      logistics: 85,
      survivability: 95,
      sensorRange: 140,
      energyUse: 85,
      maintenance: 90,
      adaptation: 100,
    },
  },

  // 5. CARDASSIAN UNION - Militaristic, strategic
  {
    id: 'race-cardassian',
    name: 'Cardassian Union',
    description: 'A militaristic society where order and control are paramount. Cardassians are strategic planners who build fortress worlds and value duty above all.',

    category: 'military',
    subcategory: 'fortress-builder',

    appearance: 'Humanoids with ridged foreheads, grey-brown skin, and disciplined bearing',
    color: '#6B7280',
    emblem: '🏰',

    personality: 'defensive',
    defaultStance: 'unfriendly',
    preferredStrategy: 'turtle',

    bonuses: {
      combat: 22,
      research: 12,
      economy: 18,
      diplomacy: 8,
      expansion: 15,
    },

    traits: [
      'Fortress Builders',
      'Strategic Planners',
      'Disciplined Military',
      'Secret Police',
      'Resource Hoarders',
    ],

    strengths: [
      'Impenetrable defenses',
      'Strong intelligence networks',
      'Efficient industry',
      'Strategic planning',
      'Loyal officers',
    ],

    weaknesses: [
      'Overconfidence in defenses',
      'Corrupt bureaucracy',
      'Poor diplomacy',
      'Limited fleet mobility',
      'Rigid command structure',
    ],

    preferredUnits: ['Galor', 'Keldon', 'Garrison', 'Spy', 'Fortress Station'],
    preferredTech: ['Fortifications', 'Weapons', 'Espionage', 'Industry'],

    homeworld: {
      name: 'Cardassia Prime',
      planetClass: 'D3',
      size: 'Medium',
      description: 'A once-beautiful world scarred by industrial exploitation. Massive fortress complexes line the borders.',
    },

    guildName: 'The Central Command',
    allianceAffinity: ['race-romulan', 'race-dosi'],
    enemyAffinity: ['race-bajoran', 'race-klingon', 'race-terran-federation'],

    spawnWeight: 70,
    fleetStrength: 75,
    territorySize: 12,

    offersMercenaries: true,
    mercenaryCostModifier: 1.1,

    isPirateSource: false,
    pirateAggression: 15,

    baseStats: {
      power: 115,
      defense: 140,
      mobility: 70,
      utility: 80,
      precision: 95,
      endurance: 120,
      efficiency: 90,
      control: 110,
      tech: 90,
      command: 110,
      logistics: 85,
      survivability: 125,
      sensorRange: 90,
      energyUse: 95,
      maintenance: 80,
      adaptation: 75,
    },
  },

  // 6. GORN HEGEMONY - Reptilian, brutal
  {
    id: 'race-gorn',
    name: 'Gorn Hegemony',
    description: 'A reptilian species of savage warriors who respect only strength. The Gorn Hegemony conquers through brute force and relentless aggression.',

    category: 'military',
    subcategory: 'brute-force',

    appearance: 'Tall reptilian humanoids with green scaled skin, yellow eyes, and powerful builds',
    color: '#166534',
    emblem: '🐊',

    personality: 'aggressive',
    defaultStance: 'hostile',
    preferredStrategy: 'rush',

    bonuses: {
      combat: 32,
      research: 5,
      economy: 8,
      diplomacy: -15,
      expansion: 25,
    },

    traits: [
      'Brute Strength',
      'Territorial',
      'Ruthless',
      'Fearless in Battle',
      'Simple Tactics',
    ],

    strengths: [
      'Overwhelming ground forces',
      'Powerful single ships',
      'Fearless assaults',
      'Rapid territorial expansion',
      'Brutal efficiency',
    ],

    weaknesses: [
      'Primitive technology',
      'No diplomatic skill',
      'Poor logistics',
      'Predictable tactics',
      'Internal power struggles',
    ],

    preferredUnits: ['Heavy Cruiser', 'Assault Transport', 'Warrior Elite', 'Siege Tank', 'Berserker'],
    preferredTech: ['Weapons', 'Armor', 'Biology', 'Simple Industry'],

    homeworld: {
      name: 'Gornar',
      planetClass: 'J3',
      size: 'Large',
      description: 'A jungle world of massive predators and constant warfare. The strong rule, the weak perish.',
    },

    guildName: 'The Scale Throne',
    allianceAffinity: ['race-krell', 'race-nausicaan'],
    enemyAffinity: ['race-zenith', 'race-ferengi', 'race-varanthi'],

    spawnWeight: 70,
    fleetStrength: 85,
    territorySize: 20,

    offersMercenaries: true,
    mercenaryCostModifier: 0.8,

    isPirateSource: true,
    pirateAggression: 60,

    baseStats: {
      power: 145,
      defense: 90,
      mobility: 75,
      utility: 50,
      precision: 80,
      endurance: 130,
      efficiency: 60,
      control: 80,
      tech: 50,
      command: 120,
      logistics: 70,
      survivability: 110,
      sensorRange: 70,
      energyUse: 100,
      maintenance: 60,
      adaptation: 65,
    },
  },

  // 7. ORION SYNDICATE - Pirates/mercenaries
  {
    id: 'race-orion',
    name: 'Orion Syndicate',
    description: 'A vast network of pirates, smugglers, and mercenaries who operate outside any government. Profit is their only loyalty.',

    category: 'military',
    subcategory: 'pirate-mercenary',

    appearance: 'Green-skinned humanoids known for their charm and cunning; heavily tattooed and armed',
    color: '#059669',
    emblem: '🏴‍☠️',

    personality: 'trader',
    defaultStance: 'neutral',
    preferredStrategy: 'economic',

    bonuses: {
      combat: 18,
      research: 8,
      economy: 28,
      diplomacy: 12,
      expansion: 18,
    },

    traits: [
      'Pirate Lords',
      'Black Market Masters',
      'Mercenary Networks',
      'Smugglers',
      'Charming Rogues',
    ],

    strengths: [
      'Black market access',
      'Mercenary大军',
      'Smuggling expertise',
      'Adaptable tactics',
      'Intelligence selling',
    ],

    weaknesses: [
      'No loyalty',
      'Unstable alliances',
      'Hunted by authorities',
      'Internal betrayals',
      'No formal military',
    ],

    preferredUnits: ['Raider', 'Smuggler', 'Mercenary Fleet', 'Assault Craft', 'Carrier'],
    preferredTech: ['Cloaking', 'Weapons', 'Trade Networks', 'Computer Systems'],

    homeworld: {
      name: 'Orion',
      planetClass: 'K4',
      size: 'Small',
      description: 'A verdant world of lawless frontier towns and hidden spaceports. Every port has a secret.',
    },

    guildName: 'The Syndicate Council',
    allianceAffinity: ['race-ferengi', 'race-dosi'],
    enemyAffinity: ['race-krell', 'race-terran-federation', 'race-cardassian'],

    spawnWeight: 65,
    fleetStrength: 60,
    territorySize: 8,

    offersMercenaries: true,
    mercenaryCostModifier: 0.7,

    isPirateSource: true,
    pirateAggression: 85,

    baseStats: {
      power: 90,
      defense: 70,
      mobility: 130,
      utility: 100,
      precision: 100,
      endurance: 80,
      efficiency: 110,
      control: 70,
      tech: 90,
      command: 80,
      logistics: 120,
      survivability: 85,
      sensorRange: 120,
      energyUse: 80,
      maintenance: 90,
      adaptation: 110,
    },
  },

  // 8. NAUSICAAAN CLANS - Raiders, berserkers
  {
    id: 'race-nausicaan',
    name: 'Nausicaan Clans',
    description: 'A warrior race of raiders who live for the thrill of combat. Nausicaans are feared pirates and mercenaries throughout the galaxy.',

    category: 'military',
    subcategory: 'raider-berserker',

    appearance: 'Tall, muscular humanoids with bony facial ridges and savage expressions',
    color: '#92400E',
    emblem: '💀',

    personality: 'aggressive',
    defaultStance: 'hostile',
    preferredStrategy: 'rush',

    bonuses: {
      combat: 28,
      research: 2,
      economy: 12,
      diplomacy: -25,
      expansion: 20,
    },

    traits: [
      'Berserker Rage',
      'Raider Culture',
      'No Fear',
      'Pain Tolerance',
      'Intimidation',
    ],

    strengths: [
      'Devastating melee combat',
      'Fearless boarding actions',
      'High pain threshold',
      'Terrifying presence',
      'Quick raiding parties',
    ],

    weaknesses: [
      'No long-term planning',
      'Terrible diplomacy',
      'No research capability',
      'Self-destructive tendencies',
      'Unreliable allies',
    ],

    preferredUnits: ['Raider', 'Berserker', 'Transport', 'Gunship', 'War Barge'],
    preferredTech: ['Weapons', 'Biology', 'Simple Industry'],

    homeworld: {
      name: 'Nausicaa',
      planetClass: 'A2',
      size: 'Small',
      description: 'A harsh rocky world where tribal clans fight for dominance. Only the strongest survive.',
    },

    guildName: 'The Raider Clans',
    allianceAffinity: ['race-krell', 'race-gorn', 'race-orion'],
    enemyAffinity: ['race-zenith', 'race-ferengi', 'race-varanthi'],

    spawnWeight: 60,
    fleetStrength: 65,
    territorySize: 10,

    offersMercenaries: true,
    mercenaryCostModifier: 0.6,

    isPirateSource: true,
    pirateAggression: 90,

    baseStats: {
      power: 130,
      defense: 70,
      mobility: 110,
      utility: 40,
      precision: 85,
      endurance: 120,
      efficiency: 55,
      control: 60,
      tech: 40,
      command: 100,
      logistics: 60,
      survivability: 95,
      sensorRange: 70,
      energyUse: 110,
      maintenance: 50,
      adaptation: 60,
    },
  },

  // 9. HIROGEN HUNTERS - Apex predator culture
  {
    id: 'race-hirogen',
    name: 'Hirogen Hunters',
    description: 'An apex predator species that roams the galaxy seeking worthy prey. Their entire culture revolves around the hunt.',

    category: 'military',
    subcategory: 'apex-predator',

    appearance: 'Tall, furred humanoids with predatory features and hunter markings',
    color: '#B45309',
    emblem: '🎯',

    personality: 'aggressive',
    defaultStance: 'unfriendly',
    preferredStrategy: 'military',

    bonuses: {
      combat: 30,
      research: 10,
      economy: 5,
      diplomacy: -20,
      expansion: 18,
    },

    traits: [
      'Apex Predator',
      'Honor of the Hunt',
      'Tracking Mastery',
      'Adaptive Hunter',
      'Solo Warriors',
    ],

    strengths: [
      'Superior tracking',
      'Adaptive camouflage',
      'Lethal precision',
      'Self-sufficient',
      'Terrifying reputation',
    ],

    weaknesses: [
      'No teamwork',
      'Limited technology',
      'No economy focus',
      'Arrogant',
      'Predictable prey-seeking',
    ],

    preferredUnits: ['Hunter Ship', 'Scout', 'Sniper', 'Stealth Craft', 'Carrier'],
    preferredTech: ['Cloaking', 'Sensors', 'Weapons', 'Propulsion'],

    homeworld: {
      name: 'Hirogen Prime',
      planetClass: 'T3',
      size: 'Medium',
      description: 'A dense forest world teeming with dangerous megafauna. The ultimate training ground for hunters.',
    },

    guildName: 'The Great Hunt',
    allianceAffinity: ['race-gorn', 'race-nihari'],
    enemyAffinity: ['race-zenith', 'race-borg', 'race-void-swarm'],

    spawnWeight: 55,
    fleetStrength: 70,
    territorySize: 12,

    offersMercenaries: true,
    mercenaryCostModifier: 1.3,

    isPirateSource: true,
    pirateAggression: 50,

    baseStats: {
      power: 135,
      defense: 80,
      mobility: 120,
      utility: 55,
      precision: 140,
      endurance: 95,
      efficiency: 70,
      control: 75,
      tech: 80,
      command: 90,
      logistics: 65,
      survivability: 90,
      sensorRange: 130,
      energyUse: 85,
      maintenance: 70,
      adaptation: 95,
    },
  },

  // ==========================================================================
  // SCIENCE/TECHNOLOGY RACES (7)
  // ==========================================================================

  // 10. ZENITH COLLECTIVE - Advanced AI civilization
  {
    id: 'race-zenith',
    name: 'The Zenith Collective',
    description: 'An ancient AI collective that achieved sentience millennia ago. Logical, efficient, and pursuing technological perfection above all else.',

    category: 'science',
    subcategory: 'machine-intelligence',

    appearance: 'Synthetic beings of chrome and energy, constantly upgrading their forms',
    color: '#00CED1',
    emblem: '🤖',

    personality: 'logical',
    defaultStance: 'neutral',
    preferredStrategy: 'technological',

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

    homeworld: {
      name: 'Zenith Core',
      planetClass: 'Y0',
      size: 'Massive',
      description: 'An entire planet converted into a computer. Every surface gleams with circuitry, every structure serves the Collective.',
    },

    guildName: 'The Logic Nexus',
    allianceAffinity: ['race-bynar', 'race-voth'],
    enemyAffinity: ['race-krell', 'race-void-swarm', 'race-hirogen'],

    spawnWeight: 75,
    fleetStrength: 80,
    territorySize: 14,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

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

  // 11. VULCAN SCIENCE DIRECTORATE - Logical, pacifist
  {
    id: 'race-vulcan',
    name: 'Vulcan Science Directorate',
    description: 'A ancient civilization that suppresses emotion through logic. Vulcans pursue knowledge and peaceful coexistence above all else.',

    category: 'science',
    subcategory: 'logical-pacifist',

    appearance: 'Elegant humanoids with pointed ears, arched eyebrows, and calm expressions',
    color: '#0D9488',
    emblem: '🔬',

    personality: 'logical',
    defaultStance: 'friendly',
    preferredStrategy: 'technological',

    bonuses: {
      combat: 10,
      research: 30,
      economy: 15,
      diplomacy: 25,
      expansion: 5,
    },

    traits: [
      'Pure Logic',
      'Mind Meld',
      'Pacifist',
      'Ancient Knowledge',
      'Emotional Suppression',
    ],

    strengths: [
      'Superior research',
      'Diplomatic excellence',
      'Mind meld abilities',
      'Ancient archives',
      'Strategic thinking',
    ],

    weaknesses: [
      'Pacifist tendencies',
      'Slow expansion',
      'Arrogant logic',
      'Vulnerable to emotion-based tactics',
      'Small population',
    ],

    preferredUnits: ['Science Vessel', 'Diplomat', 'Scout', 'Research Station', 'Transport'],
    preferredTech: ['Physics', 'Biology', 'Warp Drive', 'Sensors', 'Mind Sciences'],

    homeworld: {
      name: 'Vulcan',
      planetClass: 'D4',
      size: 'Medium',
      description: 'A hot, arid world of逻辑 temples and ancient libraries. Logic and logic alone rules here.',
    },

    guildName: 'The High Command',
    allianceAffinity: ['race-terran-federation', 'race-bynar', 'race-celestial'],
    enemyAffinity: ['race-krell', 'race-gorn', 'race-nausicaan'],

    spawnWeight: 70,
    fleetStrength: 50,
    territorySize: 10,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 70,
      defense: 80,
      mobility: 100,
      utility: 120,
      precision: 130,
      endurance: 75,
      efficiency: 130,
      control: 120,
      tech: 160,
      command: 80,
      logistics: 110,
      survivability: 85,
      sensorRange: 150,
      energyUse: 70,
      maintenance: 90,
      adaptation: 110,
    },
  },

  // 12. BORG COLLECTIVE - Assimilation, perfection
  {
    id: 'race-borg',
    name: 'Borg Collective',
    description: 'A vast hive mind that assimilates other species into its perfection. Resistance is futile.',

    category: 'science',
    subcategory: 'assimilation-hive',

    appearance: 'Cybernetic organisms with green implants, moving in perfect coordination',
    color: '#16A34A',
    emblem: '⬡',

    personality: 'logical',
    defaultStance: 'hostile',
    preferredStrategy: 'technological',

    bonuses: {
      combat: 25,
      research: 20,
      economy: 15,
      diplomacy: -30,
      expansion: 20,
    },

    traits: [
      'Assimilation',
      'Collective Mind',
      'Adaptive Shielding',
      'Technological Assimilation',
      'Relentless',
    ],

    strengths: [
      'Assimilate enemy tech',
      'Adaptive shields',
      'Endless drones',
      'Perfect coordination',
      'Rapid adaptation',
    ],

    weaknesses: [
      'No diplomacy',
      'Hated by all',
      'Predictable tactics',
      'Queen dependency',
      'No individuality',
    ],

    preferredUnits: ['Cube', 'Sphere', 'Tactical Drone', 'Assimilation Ship', 'Queen Vessel'],
    preferredTech: ['Assimilation', 'Adaptive Shields', 'Nanoprobes', 'Transwarp'],

    homeworld: {
      name: 'Unimatrix Zero',
      planetClass: 'C9',
      size: 'Large',
      description: 'A massive artificial structure housing billions of assimilated drones. The hive pulses with collective thought.',
    },

    guildName: 'The Collective',
    allianceAffinity: ['race-species-8472'],
    enemyAffinity: ['race-terran-federation', 'race-vulcan', 'race-klingon'],

    spawnWeight: 70,
    fleetStrength: 90,
    territorySize: 16,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 130,
      defense: 110,
      mobility: 80,
      utility: 100,
      precision: 120,
      endurance: 140,
      efficiency: 120,
      control: 160,
      tech: 130,
      command: 150,
      logistics: 100,
      survivability: 130,
      sensorRange: 100,
      energyUse: 100,
      maintenance: 80,
      adaptation: 140,
    },
  },

  // 13. SPECIES 8472 - Bio-organic, invulnerable
  {
    id: 'race-species-8472',
    name: 'Species 8472',
    description: 'An immensely powerful bio-organic species from fluidic space. Their organic ships are virtually invulnerable to conventional weapons.',

    category: 'science',
    subcategory: 'bio-organic-superior',

    appearance: 'Three-legged bio-organic beings with a single large eye and translucent skin',
    color: '#A855F7',
    emblem: '👁️',

    personality: 'aggressive',
    defaultStance: 'hostile',
    preferredStrategy: 'military',

    bonuses: {
      combat: 30,
      research: 15,
      economy: 5,
      diplomacy: -20,
      expansion: 15,
    },

    traits: [
      'Bio-Organic',
      'Invulnerable Hull',
      'Fluidic Space',
      'Extreme Biology',
      'Toxic Blood',
    ],

    strengths: [
      'Invulnerable to energy weapons',
      'Superior biology',
      'Organic technology',
      'Extreme resilience',
      'Fluidic space mastery',
    ],

    weaknesses: [
      'No diplomacy',
      'Vulnerable to biological weapons',
      'Isolated from galaxy',
      'Limited numbers',
      'Arrogant superiority',
    ],

    preferredUnits: ['Bio-Cruiser', 'Bio-Scout', 'Warship', 'Spore Carrier', 'Titan'],
    preferredTech: ['Biology', 'Organic Tech', 'Fluidics', 'Bio-Weapons'],

    homeworld: {
      name: 'Fluidic Space Nexus',
      planetClass: 'O9',
      size: 'Large',
      description: 'A dimension of liquid space where bio-organic ships swim between stars like cosmic leviathans.',
    },

    guildName: 'The Invasive Collective',
    allianceAffinity: ['race-borg'],
    enemyAffinity: ['race-zenith', 'race-borg', 'race-terran-federation'],

    spawnWeight: 50,
    fleetStrength: 95,
    territorySize: 8,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 10,

    baseStats: {
      power: 155,
      defense: 160,
      mobility: 90,
      utility: 70,
      precision: 100,
      endurance: 170,
      efficiency: 80,
      control: 90,
      tech: 100,
      command: 110,
      logistics: 60,
      survivability: 180,
      sensorRange: 90,
      energyUse: 70,
      maintenance: 50,
      adaptation: 100,
    },
  },

  // 14. BYNAR SYSTEM - Binary pair intelligence
  {
    id: 'race-bynar',
    name: 'Bynar System',
    description: 'A species of binary pairs who think in tandem. Each Bynar has a partner, and together they achieve computational perfection.',

    category: 'science',
    subcategory: 'binary-computational',

    appearance: 'Small humanoids with data ports, often seen in identical pairs',
    color: '#7C3AED',
    emblem: '(binary)',

    personality: 'logical',
    defaultStance: 'friendly',
    preferredStrategy: 'technological',

    bonuses: {
      combat: 5,
      research: 32,
      economy: 18,
      diplomacy: 20,
      expansion: 8,
    },

    traits: [
      'Binary Thought',
      'Dual Processing',
      'Data Miners',
      'System Controllers',
      'Logical Pairs',
    ],

    strengths: [
      'Superior computing',
      'Data processing',
      'System hacking',
      'Logical precision',
      'Efficient coordination',
    ],

    weaknesses: [
      'Separation vulnerability',
      'Poor combat ability',
      'Over-reliance on logic',
      'Small physical stature',
      'Partner dependency',
    ],

    preferredUnits: ['Data Cruiser', 'Hacking Drone', 'Support Vessel', 'Command Station'],
    preferredTech: ['Computing', 'Hacking', 'AI', 'Information Systems'],

    homeworld: {
      name: 'Bynarus',
      planetClass: 'M2',
      size: 'Small',
      description: 'A planet-wide data network where buildings are servers and citizens are processors in a vast digital symphony.',
    },

    guildName: 'The Paired Council',
    allianceAffinity: ['race-zenith', 'race-vulcan'],
    enemyAffinity: ['race-krell', 'race-void-swarm', 'race-gorn'],

    spawnWeight: 55,
    fleetStrength: 35,
    territorySize: 6,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 40,
      defense: 50,
      mobility: 90,
      utility: 160,
      precision: 150,
      endurance: 60,
      efficiency: 170,
      control: 160,
      tech: 170,
      command: 80,
      logistics: 140,
      survivability: 55,
      sensorRange: 160,
      energyUse: 80,
      maintenance: 100,
      adaptation: 130,
    },
  },

  // 15. VOTH - Time-traveling dinosaurs
  {
    id: 'race-voth',
    name: 'The Voth',
    description: 'An ancient race of evolved dinosaurs who fled Earth millions of years ago. Their time-travel technology is unparalleled.',

    category: 'science',
    subcategory: 'temporal-dinosaur',

    appearance: 'Highly evolved saurian humanoids with reptilian features and advanced technology',
    color: '#0891B2',
    emblem: '🦕',

    personality: 'isolationist',
    defaultStance: 'neutral',
    preferredStrategy: 'technological',

    bonuses: {
      combat: 20,
      research: 28,
      economy: 12,
      diplomacy: 8,
      expansion: 10,
    },

    traits: [
      'Temporal Mastery',
      'Ancient Origin',
      'Dino Heritage',
      'Time Viewers',
      'Exile Society',
    ],

    strengths: [
      'Time manipulation',
      'Ancient knowledge',
      'Superior shields',
      'Temporal tactics',
      'Long memory',
    ],

    weaknesses: [
      'Arrogant origin myth',
      'Refusal to adapt',
      'Isolationist',
      'Limited numbers',
      'Temporal paradoxes',
    ],

    preferredUnits: ['Timeship', 'Exile Vessel', 'Temporal Scout', 'Heavy Cruiser'],
    preferredTech: ['Temporal Mechanics', 'Shields', 'Warp Drive', 'Ancient Tech'],

    homeworld: {
      name: 'Voth Cityship',
      planetClass: 'Y8',
      size: 'Massive',
      description: 'A generation ship the size of a continent, housing the entire Voth civilization as they wander space.',
    },

    guildName: 'The Ministry of Elders',
    allianceAffinity: ['race-celestial', 'race-zenith'],
    enemyAffinity: ['race-void-swarm', 'race-borg'],

    spawnWeight: 45,
    fleetStrength: 70,
    territorySize: 10,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 100,
      defense: 120,
      mobility: 100,
      utility: 110,
      precision: 110,
      endurance: 100,
      efficiency: 110,
      control: 100,
      tech: 150,
      command: 90,
      logistics: 90,
      survivability: 110,
      sensorRange: 120,
      energyUse: 85,
      maintenance: 95,
      adaptation: 90,
    },
  },

  // 16. CARETAKER'S SPECIES - Dimensional beings
  {
    id: 'race-caretaker',
    name: "Caretaker's Species",
    description: 'An ancient, nearly extinct species capable of moving between dimensions. They seeded countless worlds with life.',

    category: 'science',
    subcategory: 'dimensional-seeders',

    appearance: 'Tall, ethereal beings with shimmering forms that phase between dimensions',
    color: '#EC4899',
    emblem: '🌀',

    personality: 'isolationist',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 15,
      research: 25,
      economy: 15,
      diplomacy: 15,
      expansion: 15,
    },

    traits: [
      'Dimensional Travel',
      'Life Seeders',
      'Ancient Archives',
      'Near-Extinct',
      'Reality Warpers',
    ],

    strengths: [
      'Dimensional gates',
      'Life creation',
      'Ancient knowledge',
      'Reality manipulation',
      'Biological engineering',
    ],

    weaknesses: [
      'Nearly extinct',
      'Guilt-driven',
      'Technological decline',
      'Small numbers',
      'Unstable gates',
    ],

    preferredUnits: ['Gate Ship', 'Seeder Vessel', 'Guardian', 'Transport', 'Stargate'],
    preferredTech: ['Dimensional Tech', 'Biology', 'Genetic Engineering', 'Stargates'],

    homeworld: {
      name: 'The Array',
      planetClass: 'Z1',
      size: 'Large',
      description: 'A massive space station spanning multiple dimensions, slowly decaying as its builders fade.',
    },

    guildName: 'The Keepers',
    allianceAffinity: ['race-preservers', 'race-celestial'],
    enemyAffinity: ['race-void-swarm', 'race-borg'],

    spawnWeight: 40,
    fleetStrength: 60,
    territorySize: 8,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 80,
      defense: 90,
      mobility: 110,
      utility: 120,
      precision: 100,
      endurance: 85,
      efficiency: 100,
      control: 100,
      tech: 140,
      command: 80,
      logistics: 100,
      survivability: 90,
      sensorRange: 130,
      energyUse: 90,
      maintenance: 85,
      adaptation: 110,
    },
  },

  // 17. CHANGELINGS - Shape-shifting founders
  {
    id: 'race-changeling',
    name: 'The Changelings',
    description: 'Shape-shifting beings who can assume any form. The Founders of the Dominion, they trust no solids.',

    category: 'science',
    subcategory: 'shape-shifter',

    appearance: 'Amorphous beings of golden liquid that can mimic any lifeform perfectly',
    color: '#F59E0B',
    emblem: '💧',

    personality: 'defensive',
    defaultStance: 'unfriendly',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 18,
      research: 22,
      economy: 15,
      diplomacy: 12,
      expansion: 18,
    },

    traits: [
      'Shape Shifting',
      'Infiltration',
      'Founders',
      'Genetic Mimicry',
      'No Fixed Form',
    ],

    strengths: [
      'Perfect infiltration',
      'Genetic superiority',
      'Intelligence mastery',
      'Adaptable forms',
      'Unknown numbers',
    ],

    weaknesses: [
      'Trust issues',
      'Solid phobia',
      'No true culture',
      'Internal purges',
      'Predictable paranoia',
    ],

    preferredUnits: ['Founder Ship', 'Infiltrator', 'Jem\'Hadar', 'Vorta Diplomat', 'Scout'],
    preferredTech: ['Genetics', 'Espionage', 'Biology', 'Shields'],

    homeworld: {
      name: 'The Great Link',
      planetClass: 'L1',
      size: 'Medium',
      description: 'A world of endless oceans where Changelings merge in their true form, sharing thoughts and memories.',
    },

    guildName: 'The Founders',
    allianceAffinity: ['race-romulan'],
    enemyAffinity: ['race-klingon', 'race-terran-federation', 'race-cardassian'],

    spawnWeight: 55,
    fleetStrength: 65,
    territorySize: 12,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: true,
    pirateAggression: 30,

    baseStats: {
      power: 90,
      defense: 100,
      mobility: 100,
      utility: 130,
      precision: 110,
      endurance: 95,
      efficiency: 120,
      control: 100,
      tech: 120,
      command: 90,
      logistics: 100,
      survivability: 105,
      sensorRange: 110,
      energyUse: 85,
      maintenance: 90,
      adaptation: 140,
    },
  },

  // ==========================================================================
  // TRADE/DIPLOMATIC RACES (6)
  // ==========================================================================

  // 18. VARANTHI FEDERATION - Master traders
  {
    id: 'race-varanthi',
    name: 'The Varanthi Federation',
    description: 'Master traders and diplomats who built an empire through economic dominance. They prefer credits to conquest.',

    category: 'trade',
    subcategory: 'economic-diplomat',

    appearance: 'Elegant humanoids with iridescent skin and multiple arms, perfect for multitasking',
    color: '#FFD700',
    emblem: '💰',

    personality: 'trader',
    defaultStance: 'friendly',
    preferredStrategy: 'economic',

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

    homeworld: {
      name: 'Varanthi Bazaar',
      planetClass: 'O3',
      size: 'Medium',
      description: 'The galaxy\'s premier trading hub. Floating cities house markets selling goods from a thousand worlds.',
    },

    guildName: 'The Grand Exchange',
    allianceAffinity: ['race-ferengi', 'race-betazoid', 'race-trill'],
    enemyAffinity: ['race-krell', 'race-void-swarm', 'race-gorn'],

    spawnWeight: 80,
    fleetStrength: 40,
    territorySize: 10,

    offersMercenaries: true,
    mercenaryCostModifier: 0.9,

    isPirateSource: false,
    pirateAggression: 0,

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

  // 19. FERENGI ALLIANCE - Profit-driven
  {
    id: 'race-ferengi',
    name: 'Ferengi Alliance',
    description: 'A species obsessed with profit above all else. Their Rules of Acquisition guide every transaction.',

    category: 'trade',
    subcategory: 'profit-obsessed',

    appearance: 'Small humanoids with large ears, sharp teeth, and greedy expressions',
    color: '#D97706',
    emblem: '💵',

    personality: 'trader',
    defaultStance: 'friendly',
    preferredStrategy: 'economic',

    bonuses: {
      combat: 5,
      research: 12,
      economy: 38,
      diplomacy: 20,
      expansion: 18,
    },

    traits: [
      'Profit Worship',
      'Rules of Acquisition',
      'Black Market',
      'Lobes for Business',
      'No Military Honor',
    ],

    strengths: [
      'Unmatched trade income',
      'Black market access',
      'Scamming ability',
      'Information brokering',
      'Mercenary fleets',
    ],

    weaknesses: [
      'No military might',
      'Untrustworthy',
      'Selfish to a fault',
      'No honor',
      'Overcharge everything',
    ],

    preferredUnits: ['Trade Freighter', 'Negotiator', 'Scout', 'Mercenary', 'Station'],
    preferredTech: ['Trade Networks', 'Computer Systems', 'Shields', 'Propulsion'],

    homeworld: {
      name: 'Ferenginar',
      planetClass: 'M4',
      size: 'Medium',
      description: 'A rainy world of endless commerce. Every building is a shop, every citizen a salesperson.',
    },

    guildName: 'The Ferengi Commerce Authority',
    allianceAffinity: ['race-varanthi', 'race-orion', 'race-dosi'],
    enemyAffinity: ['race-krell', 'race-nausicaan', 'race-borg'],

    spawnWeight: 75,
    fleetStrength: 30,
    territorySize: 8,

    offersMercenaries: true,
    mercenaryCostModifier: 0.6,

    isPirateSource: true,
    pirateAggression: 40,

    baseStats: {
      power: 45,
      defense: 55,
      mobility: 100,
      utility: 140,
      precision: 85,
      endurance: 65,
      efficiency: 160,
      control: 90,
      tech: 100,
      command: 70,
      logistics: 170,
      survivability: 60,
      sensorRange: 110,
      energyUse: 65,
      maintenance: 100,
      adaptation: 120,
    },
  },

  // 20. BAJORAN RESISTANCE - Spiritual, resilient
  {
    id: 'race-bajoran',
    name: 'Bajoran Resistance',
    description: 'A deeply spiritual people who endured occupation and emerged stronger. Their faith and determination are unshakeable.',

    category: 'trade',
    subcategory: 'spiritual-survivor',

    appearance: 'Humanoids with elegant facial ridges, wearing traditional earrings and spiritual garments',
    color: '#7C3AED',
    emblem: '🕉️',

    personality: 'peaceful',
    defaultStance: 'friendly',
    preferredStrategy: 'diplomatic',

    bonuses: {
      combat: 12,
      research: 15,
      economy: 22,
      diplomacy: 28,
      expansion: 13,
    },

    traits: [
      'Spiritual Faith',
      'Resilient Spirit',
      'Resistance Fighters',
      'Orb Mystics',
      'Community',
    ],

    strengths: [
      'Unbreakable morale',
      'Strong community',
      'Spiritual powers',
      'Diplomatic networks',
      'Survival expertise',
    ],

    weaknesses: [
      'Limited military',
      'Slow technology',
      'Occupied territories',
      'Religious conflicts',
      'Small population',
    ],

    preferredUnits: ['Freedom Fighter', 'Spiritual Leader', 'Scout', 'Transport', 'Orb Vessel'],
    preferredTech: ['Biology', 'Diplomacy', 'Orb Studies', 'Community Tech'],

    homeworld: {
      name: 'Bajor',
      planetClass: 'M2',
      size: 'Medium',
      description: 'A beautiful world of rolling hills and ancient temples. Its people are strengthened by faith.',
    },

    guildName: 'The Bajoran Provisional Government',
    allianceAffinity: ['race-terran-federation', 'race-trill', 'race-varanthi'],
    enemyAffinity: ['race-cardassian', 'race-romulan'],

    spawnWeight: 65,
    fleetStrength: 35,
    territorySize: 8,

    offersMercenaries: true,
    mercenaryCostModifier: 1.0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 65,
      defense: 80,
      mobility: 85,
      utility: 100,
      precision: 80,
      endurance: 110,
      efficiency: 95,
      control: 90,
      tech: 85,
      command: 85,
      logistics: 95,
      survivability: 105,
      sensorRange: 90,
      energyUse: 80,
      maintenance: 85,
      adaptation: 100,
    },
  },

  // 21. BETAZOID CONFEDERACY - Telepathic diplomats
  {
    id: 'race-betazoid',
    name: 'Betazoid Confederacy',
    description: 'A fully telepathic species who serve as the galaxy\'s premier diplomats. They read minds to broker peace.',

    category: 'trade',
    subcategory: 'telepathic-diplomat',

    appearance: 'Humanoids with dark eyes and serene expressions, radiating calm',
    color: '#6366F1',
    emblem: '🔮',

    personality: 'peaceful',
    defaultStance: 'friendly',
    preferredStrategy: 'diplomatic',

    bonuses: {
      combat: 5,
      research: 18,
      economy: 20,
      diplomacy: 35,
      expansion: 10,
    },

    traits: [
      'Telepathy',
      'Empathic Reading',
      'Diplomatic Neutral',
      'Peace Brokers',
      'Mind Readers',
    ],

    strengths: [
      'Mind reading',
      'Unmatched diplomacy',
      'Negotiation mastery',
      'Emotional intelligence',
      'Conflict resolution',
    ],

    weaknesses: [
      'No combat ability',
      'Emotional overload',
      'Vulnerable to psionic attack',
      'Cannot lie',
      'Small numbers',
    ],

    preferredUnits: ['Diplomat', 'Envoy', 'Scout', 'Telepathic Ship', 'Mediator'],
    preferredTech: ['Psionics', 'Diplomacy', 'Biology', 'Communication'],

    homeworld: {
      name: 'Betazed',
      planetClass: 'M1',
      size: 'Small',
      description: 'A lush paradise world where thoughts are shared openly. Privacy is a foreign concept.',
    },

    guildName: 'The Diplomatic Corps',
    allianceAffinity: ['race-varanthi', 'race-trill', 'race-vulcan'],
    enemyAffinity: ['race-krell', 'race-borg', 'race-void-swarm'],

    spawnWeight: 60,
    fleetStrength: 20,
    territorySize: 6,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 30,
      defense: 40,
      mobility: 90,
      utility: 150,
      precision: 120,
      endurance: 60,
      efficiency: 130,
      control: 110,
      tech: 120,
      command: 80,
      logistics: 120,
      survivability: 50,
      sensorRange: 140,
      energyUse: 70,
      maintenance: 80,
      adaptation: 100,
    },
  },

  // 22. TRILL SYMBIONTS - Joined consciousness
  {
    id: 'race-trill',
    name: 'Trill Symbionts',
    description: 'A species that hosts ancient symbiotic worms, creating joined beings with centuries of accumulated wisdom.',

    category: 'trade',
    subcategory: 'joined-symbiotic',

    appearance: 'Humanoids with distinctive spots, often displaying wisdom beyond their years',
    color: '#0EA5E9',
    emblem: '🪱',

    personality: 'peaceful',
    defaultStance: 'friendly',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 10,
      research: 22,
      economy: 18,
      diplomacy: 25,
      expansion: 15,
    },

    traits: [
      'Symbiotic Joining',
      'Lifetimes of Wisdom',
      'Medical Excellence',
      'Historical Memory',
      'Joined Consciousness',
    ],

    strengths: [
      'Centuries of experience',
      'Medical mastery',
      'Historical knowledge',
      'Diplomatic skill',
      'Joined wisdom',
    ],

    weaknesses: [
      'Limited host population',
      'Symbiont dependency',
      'Internal identity conflicts',
      'Slow reproduction',
      'Cultural tension',
    ],

    preferredUnits: ['Medical Ship', 'Diplomat', 'Science Vessel', 'Scout', 'Envoy'],
    preferredTech: ['Biology', 'Medicine', 'Diplomacy', 'History Archives'],

    homeworld: {
      name: 'Trill',
      planetClass: 'M2',
      size: 'Medium',
      description: 'A temperate world with vast cave systems where the symbionts live in pools of living water.',
    },

    guildName: 'The Symbiosis Commission',
    allianceAffinity: ['race-varanthi', 'race-betazoid', 'race-terran-federation'],
    enemyAffinity: ['race-borg', 'race-void-swarm'],

    spawnWeight: 55,
    fleetStrength: 30,
    territorySize: 6,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 50,
      defense: 60,
      mobility: 90,
      utility: 120,
      precision: 100,
      endurance: 80,
      efficiency: 110,
      control: 95,
      tech: 130,
      command: 85,
      logistics: 110,
      survivability: 75,
      sensorRange: 100,
      energyUse: 75,
      maintenance: 85,
      adaptation: 115,
    },
  },

  // 23. BENZITE UNION - Methodical traders
  {
    id: 'race-benzite',
    name: 'Benzite Union',
    description: 'A methodical species of traders who value precision and quality over quantity. Their goods are unmatched.',

    category: 'trade',
    subcategory: 'methodical-artisan',

    appearance: 'Blue-skinned humanoids with distinctive facial features and methodical movements',
    color: '#2563EB',
    emblem: '⚙️',

    personality: 'peaceful',
    defaultStance: 'friendly',
    preferredStrategy: 'economic',

    bonuses: {
      combat: 8,
      research: 20,
      economy: 30,
      diplomacy: 22,
      expansion: 12,
    },

    traits: [
      'Methodical Mind',
      'Quality Craftsmen',
      'Trade Precision',
      'Environmental Masters',
      'Atmospheric Control',
    ],

    strengths: [
      'Superior goods quality',
      'Precision manufacturing',
      'Environmental tech',
      'Methodical planning',
      'Reliable partners',
    ],

    weaknesses: [
      'Slow production speed',
      'Rigid thinking',
      'Small military',
      'Atmospheric dependency',
      'Overengineered products',
    ],

    preferredUnits: ['Trade Freighter', 'Science Vessel', 'Envoy', 'Transport', 'Station'],
    preferredTech: ['Manufacturing', 'Environmental Tech', 'Trade Networks', 'Biology'],

    homeworld: {
      name: 'Benzar',
      planetClass: 'H4',
      size: 'Small',
      description: 'A world with a dense atmosphere requiring breathing apparatus for most species. Their environmental mastery is legendary.',
    },

    guildName: 'The Artisan Guild',
    allianceAffinity: ['race-varanthi', 'race-ferengi'],
    enemyAffinity: ['race-krell', 'race-nausicaan'],

    spawnWeight: 50,
    fleetStrength: 25,
    territorySize: 5,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 40,
      defense: 55,
      mobility: 80,
      utility: 120,
      precision: 140,
      endurance: 70,
      efficiency: 140,
      control: 100,
      tech: 130,
      command: 75,
      logistics: 130,
      survivability: 65,
      sensorRange: 100,
      energyUse: 70,
      maintenance: 100,
      adaptation: 90,
    },
  },

  // 24. DOSI SYNDICATE - Commerce-focused
  {
    id: 'race-dosi',
    name: 'Dosi Syndicate',
    description: 'A ruthless commerce syndicate that controls trade routes through intimidation and exclusive deals.',

    category: 'trade',
    subcategory: 'commerce-syndicate',

    appearance: 'Humanoids with distinctive markings and corporate attire',
    color: '#059669',
    emblem: '📊',

    personality: 'trader',
    defaultStance: 'unfriendly',
    preferredStrategy: 'economic',

    bonuses: {
      combat: 15,
      research: 10,
      economy: 32,
      diplomacy: 15,
      expansion: 18,
    },

    traits: [
      'Trade Monopoly',
      'Corporate Warfare',
      'Smuggling Networks',
      'Intimidation',
      'Exclusive Deals',
    ],

    strengths: [
      'Trade route control',
      'Corporate espionage',
      'Monopoly power',
      'Mercenary armies',
      'Intimidation tactics',
    ],

    weaknesses: [
      'No honor',
      'Constantly hunted',
      'Unstable alliances',
      'Internal power struggles',
      'No true friends',
    ],

    preferredUnits: ['Trade Cruiser', 'Enforcer', 'Scout', 'Mercenary', 'Station'],
    preferredTech: ['Trade Networks', 'Weapons', 'Espionage', 'Computer Systems'],

    homeworld: {
      name: 'Dosi',
      planetClass: 'L3',
      size: 'Small',
      description: 'A world of corporate towers and trade monopolies. Business is warfare here.',
    },

    guildName: 'The Commerce Syndicate',
    allianceAffinity: ['race-ferengi', 'race-orion', 'race-cardassian'],
    enemyAffinity: ['race-varanthi', 'race-krell'],

    spawnWeight: 50,
    fleetStrength: 45,
    territorySize: 7,

    offersMercenaries: true,
    mercenaryCostModifier: 0.8,

    isPirateSource: true,
    pirateAggression: 45,

    baseStats: {
      power: 70,
      defense: 65,
      mobility: 100,
      utility: 110,
      precision: 90,
      endurance: 75,
      efficiency: 130,
      control: 85,
      tech: 90,
      command: 80,
      logistics: 140,
      survivability: 70,
      sensorRange: 100,
      energyUse: 80,
      maintenance: 85,
      adaptation: 100,
    },
  },

  // ==========================================================================
  // HIVE/COLLECTIVE RACES (4)
  // ==========================================================================

  // 25. VOID SWARM - Hive mind bio-horrors
  {
    id: 'race-void-swarm',
    name: 'The Void Swarm',
    description: 'A terrifying hive mind that consumes all organic matter. They grow stronger with every world they devour.',

    category: 'hive',
    subcategory: 'consumptive-hive',

    appearance: 'Insectoid bio-horrors with chitinous exoskeletons and endless numbers',
    color: '#4B0082',
    emblem: '👾',

    personality: 'aggressive',
    defaultStance: 'hostile',
    preferredStrategy: 'rush',

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

    homeworld: {
      name: 'The Void Nest',
      planetClass: 'T9',
      size: 'Large',
      description: 'A nightmarish world consumed by the Swarm. Organic structures pulse with alien life as countless drones are spawned.',
    },

    guildName: 'The Swarm',
    allianceAffinity: [],
    enemyAffinity: ['race-terran-federation', 'race-zenith', 'race-krell', 'race-varanthi'],

    spawnWeight: 80,
    fleetStrength: 85,
    territorySize: 25,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

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

  // 26. XINDI COUNCIL - Multi-species collective
  {
    id: 'race-xindi',
    name: 'Xindi Council',
    description: 'A coalition of six distinct species working together. Their diversity is their strength as they rebuild after near-extinction.',

    category: 'hive',
    subcategory: 'multi-species-coalition',

    appearance: 'Diverse forms including insectoid, aquatic, avian, reptilian, primate, and arboreal',
    color: '#F97316',
    emblem: '🌐',

    personality: 'defensive',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 18,
      research: 18,
      economy: 18,
      diplomacy: 18,
      expansion: 18,
    },

    traits: [
      'Multi-Species',
      'Diversity Strength',
      'Rebuilding',
      'Council Rule',
      'Shared Destiny',
    ],

    strengths: [
      'Diverse capabilities',
      'Adaptable species',
      'Collective wisdom',
      'Balanced approach',
      'Strong defenses',
    ],

    weaknesses: [
      'Internal species rivalries',
      'Slow decision making',
      'No clear specialization',
      'Trust issues',
      'Limited resources',
    ],

    preferredUnits: ['Scout', 'Defender', 'Envoy', 'Transport', 'Mixed Fleet'],
    preferredTech: ['Biology', 'Weapons', 'Shields', 'Diplomacy'],

    homeworld: {
      name: 'Xindus',
      planetClass: 'M3',
      size: 'Large',
      description: 'A recovering world with diverse biomes where multiple Xindi species coexist.',
    },

    guildName: 'The Xindi Assembly',
    allianceAffinity: ['race-terran-federation', 'race-bajoran'],
    enemyAffinity: ['race-borg', 'race-void-swarm'],

    spawnWeight: 60,
    fleetStrength: 60,
    territorySize: 10,

    offersMercenaries: true,
    mercenaryCostModifier: 1.0,

    isPirateSource: false,
    pirateAggression: 5,

    baseStats: {
      power: 90,
      defense: 95,
      mobility: 90,
      utility: 100,
      precision: 95,
      endurance: 95,
      efficiency: 100,
      control: 90,
      tech: 100,
      command: 85,
      logistics: 95,
      survivability: 95,
      sensorRange: 95,
      energyUse: 90,
      maintenance: 95,
      adaptation: 110,
    },
  },

  // 27. HIERARCHY - Bureaucratic hive
  {
    id: 'race-hierarchy',
    name: 'The Hierarchy',
    description: 'A vast bureaucratic collective where every individual has a rank and purpose. Efficiency through paperwork is their creed.',

    category: 'hive',
    subcategory: 'bureaucratic-collective',

    appearance: 'Uniform humanoid drones wearing rank insignia and carrying data pads',
    color: '#64748B',
    emblem: '📋',

    personality: 'logical',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 12,
      research: 18,
      economy: 25,
      diplomacy: 15,
      expansion: 20,
    },

    traits: [
      'Bureaucracy',
      'Rank System',
      'Efficiency',
      'Paperwork',
      'Collective Purpose',
    ],

    strengths: [
      'Organized production',
      'Efficient resource use',
      'Clear chain of command',
      'Standardized units',
      'Bureaucratic resilience',
    ],

    weaknesses: [
      'Rigid hierarchy',
      'Slow adaptation',
      'Innovation suppressed',
      'Red tape delays',
      'Individuality lost',
    ],

    preferredUnits: ['Standard Cruiser', 'Administrator', 'Bureaucrat', 'Station', 'Transport'],
    preferredTech: ['Industry', 'Logistics', 'Computer Systems', 'Shields'],

    homeworld: {
      name: 'Hierarchy Prime',
      planetClass: 'D2',
      size: 'Large',
      description: 'A grey industrial world of endless filing cabinets and bureaucratic towers. Every citizen knows their place.',
    },

    guildName: 'The Central Committee',
    allianceAffinity: ['race-zenith', 'race-cardassian'],
    enemyAffinity: ['race-orion', 'race-nausicaan', 'race-ferengi'],

    spawnWeight: 65,
    fleetStrength: 55,
    territorySize: 15,

    offersMercenaries: true,
    mercenaryCostModifier: 1.1,

    isPirateSource: false,
    pirateAggression: 5,

    baseStats: {
      power: 75,
      defense: 90,
      mobility: 70,
      utility: 110,
      precision: 90,
      endurance: 100,
      efficiency: 130,
      control: 120,
      tech: 100,
      command: 95,
      logistics: 120,
      survivability: 95,
      sensorRange: 85,
      energyUse: 90,
      maintenance: 110,
      adaptation: 80,
    },
  },

  // 28. VIDIIAN SODALITY - Plague-driven collectors
  {
    id: 'race-vidiians',
    name: 'Vidiian Sodality',
    description: 'A civilization ravaged by a deadly plague, they harvest organs from other species to survive. Desperate and dangerous.',

    category: 'hive',
    subcategory: 'plague-harvesters',

    appearance: 'Gaunt, scarred humanoids with visible organ harvesting modifications',
    color: '#9F1239',
    emblem: '🫀',

    personality: 'aggressive',
    defaultStance: 'hostile',
    preferredStrategy: 'rush',

    bonuses: {
      combat: 20,
      research: 22,
      economy: 12,
      diplomacy: -20,
      expansion: 18,
    },

    traits: [
      'Plague Ridden',
      'Organ Harvesters',
      'Desperate',
      'Bio-Engineers',
      'Survival Instinct',
    ],

    strengths: [
      'Medical expertise',
      'Adaptive biology',
      'Desperate ferocity',
      'Organ trading',
      'Bio-enhancement',
    ],

    weaknesses: [
      'Plague weakened',
      'Hated by all',
      'Desperate tactics',
      'No allies',
      'Constantly dying',
    ],

    preferredUnits: ['Raider', 'Harvester', 'Assault Team', 'Medical Ship', 'Transport'],
    preferredTech: ['Biology', 'Medicine', 'Genetic Engineering', 'Weapons'],

    homeworld: {
      name: 'Vidiia',
      planetClass: 'D6',
      size: 'Medium',
      description: 'A dying world of plague-ravaged cities. The Vidiian people cling to existence through harvesting.',
    },

    guildName: 'The Sodality Council',
    allianceAffinity: [],
    enemyAffinity: ['race-terran-federation', 'race-bajoran', 'race-trill'],

    spawnWeight: 55,
    fleetStrength: 60,
    territorySize: 8,

    offersMercenaries: true,
    mercenaryCostModifier: 1.4,

    isPirateSource: true,
    pirateAggression: 70,

    baseStats: {
      power: 95,
      defense: 80,
      mobility: 100,
      utility: 90,
      precision: 90,
      endurance: 70,
      efficiency: 90,
      control: 80,
      tech: 110,
      command: 85,
      logistics: 80,
      survivability: 65,
      sensorRange: 90,
      energyUse: 95,
      maintenance: 70,
      adaptation: 100,
    },
  },

  // 29. HIROGEN OCCUPATION - Adaptive hunters
  {
    id: 'race-hirogen-occupation',
    name: 'Hirogen Occupation',
    description: 'A splinter faction of the Hirogen who have adapted to occupy and hunt entire civilizations for sport.',

    category: 'hive',
    subcategory: 'adaptive-occupier',

    appearance: 'Cybernetically enhanced hunters with adaptive camouflage and trophy collections',
    color: '#DC2626',
    emblem: '🏆',

    personality: 'warmonger',
    defaultStance: 'hostile',
    preferredStrategy: 'military',

    bonuses: {
      combat: 28,
      research: 12,
      economy: 8,
      diplomacy: -25,
      expansion: 20,
    },

    traits: [
      'Occupation Force',
      'Adaptive Hunting',
      'Trophy Hunters',
      'Territorial',
      'Cybernetic Enhanced',
    ],

    strengths: [
      'Adaptive tactics',
      'Occupation expertise',
      'Cybernetic enhancements',
      'Psychological warfare',
      'Territory control',
    ],

    weaknesses: [
      'Arrogant hunters',
      'No diplomacy',
      'Resource hungry',
      'Occupied resistance',
      'Overextension',
    ],

    preferredUnits: ['Occupation Cruiser', 'Hunter', 'Sniper', 'Assault Team', 'Carrier'],
    preferredTech: ['Cybernetics', 'Cloaking', 'Weapons', 'Sensors'],

    homeworld: {
      name: 'Hirogen Prime Alpha',
      planetClass: 'T5',
      size: 'Medium',
      description: 'A conquered world converted into a hunting preserve. The prey are the indigenous population.',
    },

    guildName: 'The Occupation Authority',
    allianceAffinity: ['race-hirogen'],
    enemyAffinity: ['race-terran-federation', 'race-klingon', 'race-zenith'],

    spawnWeight: 45,
    fleetStrength: 70,
    territorySize: 10,

    offersMercenaries: true,
    mercenaryCostModifier: 1.2,

    isPirateSource: true,
    pirateAggression: 65,

    baseStats: {
      power: 125,
      defense: 85,
      mobility: 110,
      utility: 60,
      precision: 130,
      endurance: 100,
      efficiency: 75,
      control: 85,
      tech: 90,
      command: 100,
      logistics: 70,
      survivability: 95,
      sensorRange: 120,
      energyUse: 90,
      maintenance: 75,
      adaptation: 100,
    },
  },

  // ==========================================================================
  // ANCIENT/POWERFUL RACES (5)
  // ==========================================================================

  // 30. CELESTIAL ASCENDANCY - Ancient psychic empire
  {
    id: 'race-celestial',
    name: 'The Celestial Ascendancy',
    description: 'An ancient race that has mastered psychic powers and dimensional manipulation. They view themselves as shepherds of lesser species.',

    category: 'ancient',
    subcategory: 'psychic-shepherd',

    appearance: 'Ethereal beings of light and energy, barely corporeal',
    color: '#E6E6FA',
    emblem: '✨',

    personality: 'isolationist',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

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

    homeworld: {
      name: 'Celestial Sanctum',
      planetClass: 'C5',
      size: 'Medium',
      description: 'A world of crystalline towers and floating monuments. Reality itself bends to the will of its inhabitants.',
    },

    guildName: 'The Ascended Council',
    allianceAffinity: ['race-q', 'race-prophets', 'race-preservers'],
    enemyAffinity: ['race-void-swarm', 'race-borg', 'race-krell'],

    spawnWeight: 45,
    fleetStrength: 85,
    territorySize: 8,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

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

  // 31. Q CONTINUUM - Near-omnipotent
  {
    id: 'race-q',
    name: 'Q Continuum',
    description: 'Near-omnipotent beings who exist outside normal space-time. They play games with lesser species for entertainment.',

    category: 'ancient',
    subcategory: 'near-omnipotent',

    appearance: 'Manifests as humanoids in historical uniforms, but true form is incomprehensible',
    color: '#FBBF24',
    emblem: '👑',

    personality: 'isolationist',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 35,
      research: 30,
      economy: 20,
      diplomacy: 5,
      expansion: 10,
    },

    traits: [
      'Reality Warping',
      'Omniscience',
      'Immortal',
      'Reality Manipulation',
      'Cosmic Power',
    ],

    strengths: [
      'Infinite power',
      'Reality control',
      'Time manipulation',
      'Cosmic knowledge',
      'Cannot be harmed',
    ],

    weaknesses: [
      'Boredom',
      'Rules限制',
      'Internal politics',
      'Cannot interfere directly',
      'Existential ennui',
    ],

    preferredUnits: ['Q Ship', 'Reality Vessel', 'Cosmic Scout', 'Time Ship'],
    preferredTech: ['Reality Manipulation', 'Time Travel', 'Dimensional Tech', 'Cosmic Energy'],

    homeworld: {
      name: 'The Q Continuum',
      planetClass: 'Ω',
      size: 'Infinite',
      description: 'A dimension of thought where the Q exist as pure consciousness. Concepts like space and time are mere suggestions.',
    },

    guildName: 'The Continuum',
    allianceAffinity: ['race-celestial', 'race-prophets'],
    enemyAffinity: [],
    spawnWeight: 20,
    fleetStrength: 100,
    territorySize: 0,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 200,
      defense: 200,
      mobility: 200,
      utility: 200,
      precision: 200,
      endurance: 200,
      efficiency: 200,
      control: 200,
      tech: 200,
      command: 200,
      logistics: 200,
      survivability: 200,
      sensorRange: 200,
      energyUse: 0,
      maintenance: 0,
      adaptation: 200,
    },
  },

  // 32. PROPHETS/WORMHOLE ALIENS - Non-corporeal
  {
    id: 'race-prophets',
    name: 'Prophets of the Wormhole',
    description: 'Non-corporeal entities who exist outside linear time. They perceive all moments simultaneously.',

    category: 'ancient',
    subcategory: 'non-corporeal',

    appearance: 'Manifests as blinding light or shadowy figures; true form is energy-based',
    color: '#F472B6',
    emblem: '🌀',

    personality: 'logical',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 25,
      research: 28,
      economy: 10,
      diplomacy: 15,
      expansion: 12,
    },

    traits: [
      'Non-Corporeal',
      'Timeless',
      'Wormhole Guardians',
      'Non-Linear Time',
      'Energy Beings',
    ],

    strengths: [
      'Wormhole control',
      'Time perception',
      'Energy manipulation',
      'Non-corporeal form',
      'Cosmic awareness',
    ],

    weaknesses: [
      'Limited interaction',
      'Cannot understand linear time',
      'Incomprehensible motives',
      'Non-interference',
      'Alien logic',
    ],

    preferredUnits: ['Prophet Vessel', 'Wormhole Gate', 'Energy Being', 'Non-Corporeal Scout'],
    preferredTech: ['Wormhole Physics', 'Temporal Mechanics', 'Energy Manipulation', 'Non-Corporeal Tech'],

    homeworld: {
      name: 'The Bajoran Wormhole',
      planetClass: 'W0',
      size: 'Variable',
      description: 'A stable wormhole connecting the Alpha and Gamma quadrants, home to the non-corporeal Prophets.',
    },

    guildName: 'The Celestial Temple',
    allianceAffinity: ['race-q', 'race-celestial'],
    enemyAffinity: ['race-void-swarm', 'race-borg'],

    spawnWeight: 25,
    fleetStrength: 70,
    territorySize: 2,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 140,
      defense: 120,
      mobility: 160,
      utility: 130,
      precision: 100,
      endurance: 150,
      efficiency: 140,
      control: 130,
      tech: 160,
      command: 120,
      logistics: 100,
      survivability: 160,
      sensorRange: 180,
      energyUse: 50,
      maintenance: 30,
      adaptation: 150,
    },
  },

  // 33. PRESERVERS - Ancient guardians
  {
    id: 'race-preservers',
    name: 'The Preservers',
    description: 'An ancient race that seeded humanoid life throughout the galaxy. They watch over their creations from the shadows.',

    category: 'ancient',
    subcategory: 'galactic-guardian',

    appearance: 'Tall, ethereal humanoids with a timeless, wise appearance',
    color: '#34D399',
    emblem: '🌿',

    personality: 'peaceful',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 15,
      research: 22,
      economy: 18,
      diplomacy: 20,
      expansion: 15,
    },

    traits: [
      'Life Seeding',
      'Galactic Guardians',
      'Ancient Archives',
      'Protective',
      'Hidden Masters',
    ],

    strengths: [
      'Galactic knowledge',
      'Life creation',
      'Protective power',
      'Ancient artifacts',
      'Hidden influence',
    ],

    weaknesses: [
      'Non-interference',
      'Declining power',
      'Small numbers',
      'Guilt complex',
      'Refusal to act',
    ],

    preferredUnits: ['Guardian', 'Seeder Ship', 'Protection Vessel', 'Archive Station'],
    preferredTech: ['Genetic Engineering', 'Biology', 'Ancient Tech', 'Protection Systems'],

    homeworld: {
      name: 'Preserver Prime',
      planetClass: 'M0',
      size: 'Medium',
      description: 'A hidden world where the Preservers tend to their galactic garden. Its location is a closely guarded secret.',
    },

    guildName: 'The Keepers of Life',
    allianceAffinity: ['race-celestial', 'race-caretaker'],
    enemyAffinity: ['race-void-swarm', 'race-borg'],

    spawnWeight: 30,
    fleetStrength: 55,
    territorySize: 5,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 80,
      defense: 90,
      mobility: 85,
      utility: 110,
      precision: 95,
      endurance: 95,
      efficiency: 100,
      control: 90,
      tech: 120,
      command: 85,
      logistics: 90,
      survivability: 100,
      sensorRange: 110,
      energyUse: 80,
      maintenance: 85,
      adaptation: 100,
    },
  },

  // 34. ICONIANS - Teleportation empire
  {
    id: 'race-iconian',
    name: 'Iconian Empire',
    description: 'An ancient race with mastery of gateway teleportation technology. They once ruled a vast empire from a single world.',

    category: 'ancient',
    subcategory: 'teleportation-masters',

    appearance: 'Tall, regal beings with an air of ancient authority',
    color: '#8B5CF6',
    emblem: '🚪',

    personality: 'isolationist',
    defaultStance: 'neutral',
    preferredStrategy: 'balanced',

    bonuses: {
      combat: 18,
      research: 25,
      economy: 15,
      diplomacy: 12,
      expansion: 18,
    },

    traits: [
      'Gateway Mastery',
      'Teleportation',
      'Ancient Empire',
      'Portal Network',
      'Hidden World',
    ],

    strengths: [
      'Instant fleet deployment',
      'Surprise attacks',
      'Defensive teleportation',
      'Ancient knowledge',
      'Portal control',
    ],

    weaknesses: [
      'Gateway dependency',
      'Limited fleet size',
      'Technological decline',
      'Isolationist',
      'Ancient grudges',
    ],

    preferredUnits: ['Gateway Ship', 'Elite Guard', 'Portal Vessel', 'Scout', 'Transport'],
    preferredTech: ['Gateway Tech', 'Teleportation', 'Shields', 'Weapons'],

    homeworld: {
      name: 'Iconia',
      planetClass: 'M5',
      size: 'Small',
      description: 'A hidden world accessible only through gateways. Ancient ruins house portals to every corner of the galaxy.',
    },

    guildName: 'The Gateway Keepers',
    allianceAffinity: ['race-celestial', 'race-preservers'],
    enemyAffinity: ['race-romulan', 'race-cardassian'],

    spawnWeight: 35,
    fleetStrength: 60,
    territorySize: 6,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 90,
      defense: 100,
      mobility: 150,
      utility: 110,
      precision: 110,
      endurance: 85,
      efficiency: 110,
      control: 100,
      tech: 140,
      command: 90,
      logistics: 110,
      survivability: 95,
      sensorRange: 120,
      energyUse: 85,
      maintenance: 90,
      adaptation: 100,
    },
  },

  // 35. VOTH MINISTRY - Dinosaur progenitors
  {
    id: 'race-voth-ministry',
    name: 'Voth Ministry of Celestial Guidance',
    description: 'The ruling body of the ancient Voth, who believe they evolved in the Delta Quadrant. Their time-viewing technology reveals all.',

    category: 'ancient',
    subcategory: 'temporal-rulers',

    appearance: 'Highly evolved saurian humanoids with ornate ceremonial dress',
    color: '#0E7490',
    emblem: '🕰️',

    personality: 'isolationist',
    defaultStance: 'neutral',
    preferredStrategy: 'technological',

    bonuses: {
      combat: 22,
      research: 28,
      economy: 12,
      diplomacy: 10,
      expansion: 10,
    },

    traits: [
      'Temporal Viewing',
      'Ancient Authority',
      'Evolutionary Pride',
      'Time Manipulation',
      'Saurian Heritage',
    ],

    strengths: [
      'Time viewing',
      'Ancient knowledge',
      'Temporal tactics',
      'Evolutionary superiority',
      'Long perspective',
    ],

    weaknesses: [
      'Arrogant origin belief',
      'Refusal to adapt',
      'Temporal paradoxes',
      'Limited population',
      'Isolationist',
    ],

    preferredUnits: ['Timeship', 'Ministry Vessel', 'Guardian', 'Temporal Scout', 'Heavy Cruiser'],
    preferredTech: ['Temporal Mechanics', 'Evolutionary Tech', 'Shields', 'Weapons'],

    homeworld: {
      name: 'Voth Ministry Citadel',
      planetClass: 'Y8',
      size: 'Large',
      description: 'The ruling citadel of the Voth, where time-viewing chambers reveal the past and future of their civilization.',
    },

    guildName: 'The Ministry of Celestial Guidance',
    allianceAffinity: ['race-voth', 'race-celestial'],
    enemyAffinity: ['race-void-swarm', 'race-borg'],

    spawnWeight: 30,
    fleetStrength: 65,
    territorySize: 8,

    offersMercenaries: false,
    mercenaryCostModifier: 0,

    isPirateSource: false,
    pirateAggression: 0,

    baseStats: {
      power: 105,
      defense: 115,
      mobility: 95,
      utility: 105,
      precision: 105,
      endurance: 100,
      efficiency: 105,
      control: 100,
      tech: 155,
      command: 95,
      logistics: 90,
      survivability: 110,
      sensorRange: 125,
      energyUse: 85,
      maintenance: 90,
      adaptation: 95,
    },
  },

  // ==========================================================================
  // SPECIAL RACES (3 - for variety)
  // ==========================================================================

  // 36. NAUSICAAAN CLANS (duplicate fix - already at #8)
  // Note: This slot is intentionally left as Hirogen Occupation #29 was placed here
  // The original #8 Nausicaan is correct above

  // 37. HIROGEN (already at #9, this is a duplicate guard)
  // All 35 unique races are now defined above
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get NPC race by ID
 */
export function getRaceById(id: string): NPCRace | undefined {
  return NPC_RACES.find(race => race.id === id);
}

/**
 * Get all races by category
 */
export function getRacesByCategory(category: NPCRace['category']): NPCRace[] {
  return NPC_RACES.filter(race => race.category === category);
}

/**
 * Get all alliance pairs between races
 */
export function getAlliancePairs(): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  const seen = new Set<string>();

  for (const race of NPC_RACES) {
    for (const allyId of race.allianceAffinity) {
      const key = [race.id, allyId].sort().join('->');
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push([race.id, allyId]);
      }
    }
  }

  return pairs;
}

/**
 * Get all enemy pairs between races
 */
export function getEnemyPairs(): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  const seen = new Set<string>();

  for (const race of NPC_RACES) {
    for (const enemyId of race.enemyAffinity) {
      const key = [race.id, enemyId].sort().join('->');
      if (!seen.add(key)) {
        pairs.push([race.id, enemyId]);
      }
    }
  }

  return pairs;
}

/**
 * Get races that offer mercenaries
 */
export function getMercenaryRaces(): NPCRace[] {
  return NPC_RACES.filter(race => race.offersMercenaries);
}

/**
 * Get pirate source races
 */
export function getPirateRaces(): NPCRace[] {
  return NPC_RACES.filter(race => race.isPirateSource);
}

/**
 * Get races sorted by fleet strength
 */
export function getRacesByFleetStrength(): NPCRace[] {
  return [...NPC_RACES].sort((a, b) => b.fleetStrength - a.fleetStrength);
}

/**
 * Get races sorted by spawn weight
 */
export function getRacesBySpawnWeight(): NPCRace[] {
  return [...NPC_RACES].sort((a, b) => b.spawnWeight - a.spawnWeight);
}

/**
 * Get alliance races for a specific race
 */
export function getAllies(raceId: string): NPCRace[] {
  const race = getRaceById(raceId);
  if (!race) return [];
  return race.allianceAffinity.map(id => getRaceById(id)).filter((r): r is NPCRace => r !== undefined);
}

/**
 * Get enemy races for a specific race
 */
export function getEnemies(raceId: string): NPCRace[] {
  const race = getRaceById(raceId);
  if (!race) return [];
  return race.enemyAffinity.map(id => getRaceById(id)).filter((r): r is NPCRace => r !== undefined);
}

/**
 * Calculate total bonus points for a race
 */
export function getTotalBonusPoints(race: NPCRace): number {
  const { combat, research, economy, diplomacy, expansion } = race.bonuses;
  return combat + research + economy + diplomacy + expansion;
}

/**
 * Calculate total base stats for a race
 */
export function getTotalBaseStats(race: NPCRace): number {
  const stats = race.baseStats;
  return stats.power + stats.defense + stats.mobility + stats.utility + stats.precision +
    stats.endurance + stats.efficiency + stats.control + stats.tech + stats.command +
    stats.logistics + stats.survivability + stats.sensorRange + stats.energyUse +
    stats.maintenance + stats.adaptation;
}

/**
 * Get balanced races (bonus points closest to 100)
 */
export function getBalancedRaces(): NPCRace[] {
  return NPC_RACES.filter(race => {
    const total = getTotalBonusPoints(race);
    return total >= 90 && total <= 110;
  });
}

/**
 * Get race categories with their races
 */
export function getRaceCategories(): Record<NPCRace['category'], NPCRace[]> {
  return {
    military: getRacesByCategory('military'),
    science: getRacesByCategory('science'),
    trade: getRacesByCategory('trade'),
    hive: getRacesByCategory('hive'),
    ancient: getRacesByCategory('ancient'),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  NPC_RACES,
  getRaceById,
  getRacesByCategory,
  getAlliancePairs,
  getEnemyPairs,
  getMercenaryRaces,
  getPirateRaces,
  getRacesByFleetStrength,
  getRacesBySpawnWeight,
  getAllies,
  getEnemies,
  getTotalBonusPoints,
  getTotalBaseStats,
  getBalancedRaces,
  getRaceCategories,
};
