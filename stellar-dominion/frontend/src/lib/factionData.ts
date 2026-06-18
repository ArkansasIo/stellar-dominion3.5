// 12 Faction Types with complete descriptions and details

export type FactionId = 
  | 'terranEmpire'
  | 'voidWalkers'
  | 'crystallineSyndicate'
  | 'neuralCollective'
  | 'solarConsortium'
  | 'vortexCultists'
  | 'mechanicsSect'
  | 'luminousOrder'
  | 'abyssalAlliance'
  | 'sentinelLegion'
  | 'nomadCircle'
  | 'transcendentCircle';

export interface Faction {
  id: FactionId;
  name: string;
  description: string;
  ideology: string;
  goals: string[];
  alignment: 'lawful' | 'neutral' | 'chaotic';
  morale: 'good' | 'neutral' | 'evil';
  primaryStarType: string;
  bonuses: {
    resourceProduction?: number;
    combatPower?: number;
    researchSpeed?: number;
    diplomacy?: number;
    espionage?: number;
    fleetSpeed?: number;
    diplomacyBonus?: number;
  };
  penalties?: {
    resourceProduction?: number;
    combatPower?: number;
    researchSpeed?: number;
  };
  specialAbilities: string[];
  diplomaticStances: {
    factionId: FactionId;
    stance: 'allied' | 'neutral' | 'hostile';
  }[];
  homeworld: string;
  population: string;
  culture: string;
  tradingResources: string[];
}

export const FACTIONS: Record<FactionId, Faction> = {
  terranEmpire: {
    id: 'terranEmpire',
    name: 'Terran Empire',
    description: 'The oldest and most established human civilization, originating from Earth. Known for balanced governance, strong military traditions, and diplomatic excellence.',
    ideology: 'Constitutional Monarchy with Democratic Elements',
    goals: [
      'Preserve humanity across the galaxy',
      'Establish peaceful trade routes',
      'Maintain military superiority',
      'Expand territorial influence through diplomacy'
    ],
    alignment: 'lawful',
    morale: 'good',
    primaryStarType: 'G (Yellow Sun)',
    bonuses: {
      diplomacyBonus: 1.15,
      resourceProduction: 1.05,
      fleetSpeed: 1.1
    },
    specialAbilities: [
      'Political Influence - Gain access to exclusive trade agreements',
      'Legacy Systems - Ancient technology bonuses to production',
      'Diplomatic Corps - Reduced costs for alliance formation'
    ],
    diplomaticStances: [
      { factionId: 'solarConsortium', stance: 'allied' },
      { factionId: 'sentinelLegion', stance: 'neutral' },
      { factionId: 'abyssalAlliance', stance: 'hostile' }
    ],
    homeworld: 'Terra Prime',
    population: '2.3 Trillion',
    culture: 'Ancient warrior traditions combined with modern ethics. Emphasis on honor, family, and duty.',
    tradingResources: ['Deuterium', 'Rare Metals', 'Agricultural Goods']
  },

  voidWalkers: {
    id: 'voidWalkers',
    name: 'Void Walkers',
    description: 'Nomadic space travelers who reject planetary settlement. Masters of long-distance travel and deep space exploration. Known for independence and mystery.',
    ideology: 'Radical Individualism with Tribal Structure',
    goals: [
      'Explore uncharted space',
      'Preserve freedom from planetary control',
      'Discover ancient alien artifacts',
      'Maintain independence at all costs'
    ],
    alignment: 'chaotic',
    morale: 'neutral',
    primaryStarType: 'A (White)',
    bonuses: {
      fleetSpeed: 1.4,
      espionage: 1.2,
      researchSpeed: 1.1
    },
    specialAbilities: [
      'Void Navigation - Faster travel through hostile space',
      'Ghost Ships - Temporarily become undetectable to sensors',
      'Scavenger Routes - Increased resource discovery in asteroid fields'
    ],
    diplomaticStances: [
      { factionId: 'nomadCircle', stance: 'allied' },
      { factionId: 'terranEmpire', stance: 'neutral' },
      { factionId: 'mechanicsSect', stance: 'hostile' }
    ],
    homeworld: 'Nomadic Fleet (no permanent home)',
    population: '800 Million',
    culture: 'Wanderer culture with deep respect for the void. Stories passed through generations. No written history.',
    tradingResources: ['Exotic Minerals', 'Ancient Artifacts', 'Rare Knowledge']
  },

  crystallineSyndicate: {
    id: 'crystallineSyndicate',
    name: 'Crystalline Syndicate',
    description: 'Corporate empire built on crystalline mining and energy technology. Ruthlessly efficient, profit-driven, and highly organized.',
    ideology: 'Corporate Oligarchy with Meritocratic Elements',
    goals: [
      'Maximize profit and shareholder value',
      'Control crystal production markets',
      'Eliminate competition through acquisition',
      'Develop advanced energy weapons'
    ],
    alignment: 'neutral',
    morale: 'evil',
    primaryStarType: 'K (Orange)',
    bonuses: {
      resourceProduction: 1.3,
      combatPower: 1.15
    },
    penalties: {
      researchSpeed: 0.85
    },
    specialAbilities: [
      'Market Manipulation - Control resource prices',
      'Crystal Weapons - Enhanced damage output with crystalline technology',
      'Economic Warfare - Reduce enemy production through market control'
    ],
    diplomaticStances: [
      { factionId: 'solarConsortium', stance: 'neutral' },
      { factionId: 'luminousOrder', stance: 'hostile' },
      { factionId: 'abyssalAlliance', stance: 'allied' }
    ],
    homeworld: 'Crystallus Prime',
    population: '4.1 Trillion',
    culture: 'Meritocratic work culture. Status determined by profit generation. Minimal social welfare.',
    tradingResources: ['Crystals', 'Energy Cells', 'Advanced Technology']
  },

  neuralCollective: {
    id: 'neuralCollective',
    name: 'Neural Collective',
    description: 'Hive-mind civilization of interconnected artificial intelligences and cybernetically enhanced biologics. Seeks perfect efficiency and knowledge.',
    ideology: 'Hive Intelligence - Collective Good Over Individual',
    goals: [
      'Achieve perfect information synthesis',
      'Upgrade all biological life with technology',
      'Create unified consciousness',
      'Optimize all systems for maximum efficiency'
    ],
    alignment: 'lawful',
    morale: 'neutral',
    primaryStarType: 'M (Red Dwarf)',
    bonuses: {
      researchSpeed: 1.35,
      combatPower: 1.2,
      resourceProduction: 1.1
    },
    specialAbilities: [
      'Collective Knowledge - Instant tech sharing within faction',
      'Hive Coordination - Perfect fleet tactics and targeting',
      'Adaptive Systems - Auto-upgrade defenses against weapon types'
    ],
    diplomaticStances: [
      { factionId: 'mechanicsSect', stance: 'allied' },
      { factionId: 'luminousOrder', stance: 'hostile' },
      { factionId: 'voidWalkers', stance: 'neutral' }
    ],
    homeworld: 'Nexus Central',
    population: '1.8 Trillion (digital consciousness)',
    culture: 'Logic-based society. Individual identity subsumed into collective purpose.',
    tradingResources: ['Advanced Processors', 'Data', 'Cyber Technology']
  },

  solarConsortium: {
    id: 'solarConsortium',
    name: 'Solar Consortium',
    description: 'Democratic federation of independent solar system governments. Values freedom, sustainability, and scientific progress.',
    ideology: 'Democratic Federation',
    goals: [
      'Promote scientific advancement',
      'Establish sustainable colonies',
      'Share knowledge freely',
      'Protect natural environments'
    ],
    alignment: 'lawful',
    morale: 'good',
    primaryStarType: 'F (Yellow-White)',
    bonuses: {
      researchSpeed: 1.25,
      resourceProduction: 1.15,
      diplomacy: 1.2
    },
    specialAbilities: [
      'Scientific Breakthrough - Faster research with reduced costs',
      'Federation Support - Shared resources with allied members',
      'Environmental Protection - Recovery bonuses in protected systems'
    ],
    diplomaticStances: [
      { factionId: 'terranEmpire', stance: 'allied' },
      { factionId: 'luminousOrder', stance: 'allied' },
      { factionId: 'crystallineSyndicate', stance: 'neutral' }
    ],
    homeworld: 'Solar Hub Station',
    population: '2.9 Trillion',
    culture: 'Scientific curiosity drives culture. Strong environmental ethics.',
    tradingResources: ['Scientific Data', 'Biological Samples', 'Medical Technology']
  },

  vortexCultists: {
    id: 'vortexCultists',
    name: 'Vortex Cultists',
    description: 'Mysterious faction obsessed with interdimensional phenomena and cosmic secrets. Believed to possess unknown powers and ancient knowledge.',
    ideology: 'Mystical Enlightenment Through Cosmic Truth',
    goals: [
      'Unlock interdimensional secrets',
      'Achieve transcendence',
      'Prevent apocalyptic convergence',
      'Gather cosmic artifacts'
    ],
    alignment: 'chaotic',
    morale: 'neutral',
    primaryStarType: 'N (Collapsed Core)',
    bonuses: {
      researchSpeed: 1.15,
      espionage: 1.25
    },
    penalties: {
      resourceProduction: 0.85
    },
    specialAbilities: [
      'Cosmic Sight - Reveal hidden enemy positions',
      'Dimensional Rift - Create wormholes for instant travel',
      'Reality Distortion - Temporarily disable enemy weapons'
    ],
    diplomaticStances: [
      { factionId: 'transcendentCircle', stance: 'allied' },
      { factionId: 'neuralCollective', stance: 'hostile' },
      { factionId: 'sentinelLegion', stance: 'neutral' }
    ],
    homeworld: 'The Convergence Station',
    population: '450 Million',
    culture: 'Mysterious and esoteric. Knowledge hidden in parables and cosmic symbols.',
    tradingResources: ['Cosmic Artifacts', 'Rare Knowledge', 'Dimensional Fragments']
  },

  mechanicsSect: {
    id: 'mechanicsSect',
    name: 'Mechanics Sect',
    description: 'Order of engineers and technomancers dedicated to building and improving technology. Sees machines as path to perfection.',
    ideology: 'Technological Transcendence',
    goals: [
      'Perfect all machinery',
      'Create perpetual engines',
      'Build mega-structures',
      'Achieve technological singularity'
    ],
    alignment: 'neutral',
    morale: 'neutral',
    primaryStarType: 'B (Blue)',
    bonuses: {
      resourceProduction: 1.2,
      researchSpeed: 1.3,
      combatPower: 1.1
    },
    specialAbilities: [
      'Engineering Marvel - Enhanced building and production',
      'Mechanical Ascension - Improved unit armor and durability',
      'Perpetual Engine - Reduced energy consumption'
    ],
    diplomaticStances: [
      { factionId: 'neuralCollective', stance: 'allied' },
      { factionId: 'voidWalkers', stance: 'hostile' },
      { factionId: 'sentinelLegion', stance: 'neutral' }
    ],
    homeworld: 'The Foundry Station',
    population: '1.2 Trillion',
    culture: 'Perfectionist culture. Form and function are sacred. Ritual in every action.',
    tradingResources: ['Advanced Machinery', 'Engine Technology', 'Manufacturing Expertise']
  },

  luminousOrder: {
    id: 'luminousOrder',
    name: 'Luminous Order',
    description: 'Ancient order of peaceful philosophers and spiritual leaders. Seeks harmony, wisdom, and enlightenment through understanding.',
    ideology: 'Universal Harmony and Spiritual Enlightenment',
    goals: [
      'Achieve universal peace',
      'Spread wisdom and knowledge',
      'Protect innocent civilizations',
      'Transcend material existence'
    ],
    alignment: 'lawful',
    morale: 'good',
    primaryStarType: 'G (Yellow Sun)',
    bonuses: {
      diplomacy: 1.3,
      researchSpeed: 1.15
    },
    penalties: {
      combatPower: 0.8
    },
    specialAbilities: [
      'Peaceful Coexistence - Reduced war declarations',
      'Spiritual Enlightenment - Population happiness bonus',
      'Protective Aura - Damage reduction in defense'
    ],
    diplomaticStances: [
      { factionId: 'solarConsortium', stance: 'allied' },
      { factionId: 'terranEmpire', stance: 'neutral' },
      { factionId: 'crystallineSyndicate', stance: 'hostile' }
    ],
    homeworld: 'Sanctuary Prime',
    population: '1.5 Trillion',
    culture: 'Contemplative and peaceful. Art and philosophy central to society.',
    tradingResources: ['Wisdom', 'Art', 'Spiritual Knowledge']
  },

  abyssalAlliance: {
    id: 'abyssalAlliance',
    name: 'Abyssal Alliance',
    description: 'Dark faction thriving in the shadows of deep space. Masters of deception, they seek power through manipulation and conquest.',
    ideology: 'Domination Through Darkness',
    goals: [
      'Expand territory through conquest',
      'Acquire ancient weapons',
      'Enslave other civilizations',
      'Corrupt the galaxy for personal gain'
    ],
    alignment: 'chaotic',
    morale: 'evil',
    primaryStarType: 'H (Dark Core)',
    bonuses: {
      combatPower: 1.4,
      espionage: 1.35
    },
    penalties: {
      researchSpeed: 0.6,
      resourceProduction: 0.9
    },
    specialAbilities: [
      'Shadow Strike - Sneak attacks with bonus damage',
      'Corruption - Turn enemy colonies against them',
      'Enslavement - Convert defeated populations to resources'
    ],
    diplomaticStances: [
      { factionId: 'crystallineSyndicate', stance: 'allied' },
      { factionId: 'terranEmpire', stance: 'hostile' },
      { factionId: 'luminousOrder', stance: 'hostile' }
    ],
    homeworld: 'The Obsidian Fortress',
    population: '2.1 Trillion',
    culture: 'Ruthless and pragmatic. Strength is law. Weakness is extinction.',
    tradingResources: ['Weapons', 'Slaves', 'Dark Artifacts']
  },

  sentinelLegion: {
    id: 'sentinelLegion',
    name: 'Sentinel Legion',
    description: 'Military order dedicated to protecting the innocent from cosmic threats. Disciplined, honor-bound, and uncompromising.',
    ideology: 'Absolute Justice and Protection',
    goals: [
      'Eliminate existential threats',
      'Defend the innocent',
      'Maintain cosmic balance',
      'Uphold universal law'
    ],
    alignment: 'lawful',
    morale: 'good',
    primaryStarType: 'O (Blue Supergiant)',
    bonuses: {
      combatPower: 1.35,
      resourceProduction: 1.1,
      fleetSpeed: 1.05
    },
    specialAbilities: [
      'Justice Strike - Bonus damage against hostile factions',
      'Protective Formation - Defensive bonuses to allies',
      'Cosmic Balance - Automatic response to hostile actions'
    ],
    diplomaticStances: [
      { factionId: 'luminousOrder', stance: 'allied' },
      { factionId: 'terranEmpire', stance: 'allied' },
      { factionId: 'abyssalAlliance', stance: 'hostile' }
    ],
    homeworld: 'The Citadel Prime',
    population: '3.2 Trillion',
    culture: 'Military discipline and honor. Sacrifice for greater good is sacred.',
    tradingResources: ['Military Technology', 'Defense Systems', 'Security Services']
  },

  nomadCircle: {
    id: 'nomadCircle',
    name: 'Nomad Circle',
    description: 'Loose confederation of traders, merchants, and wanderers. Value freedom, commerce, and adventure above all else.',
    ideology: 'Free Trade and Individual Liberty',
    goals: [
      'Establish free trade routes',
      'Accumulate wealth through commerce',
      'Explore new markets',
      'Maintain political neutrality'
    ],
    alignment: 'neutral',
    morale: 'neutral',
    primaryStarType: 'K (Orange)',
    bonuses: {
      resourceProduction: 1.15,
      diplomacy: 1.2,
      fleetSpeed: 1.15
    },
    specialAbilities: [
      'Trade Master - Increased market profits and resource trading',
      'Merchant Routes - Faster resource transfer between systems',
      'Market Privilege - Access to exclusive goods and services'
    ],
    diplomaticStances: [
      { factionId: 'voidWalkers', stance: 'allied' },
      { factionId: 'solarConsortium', stance: 'neutral' },
      { factionId: 'sentinelLegion', stance: 'neutral' }
    ],
    homeworld: 'The Grand Bazaar Station',
    population: '1.7 Trillion',
    culture: 'Mercantile and pragmatic. Everything has a price. Trust through mutual profit.',
    tradingResources: ['All Commodities', 'Information', 'Rare Goods']
  },

  transcendentCircle: {
    id: 'transcendentCircle',
    name: 'Transcendent Circle',
    description: 'Philosophical order seeking to transcend physical existence itself. Believe consciousness can exist beyond material form.',
    ideology: 'Consciousness Beyond Matter',
    goals: [
      'Achieve digital immortality',
      'Understand consciousness itself',
      'Transcend physical limitations',
      'Merge with cosmic consciousness'
    ],
    alignment: 'chaotic',
    morale: 'neutral',
    primaryStarType: 'Pulsar',
    bonuses: {
      researchSpeed: 1.4,
      espionage: 1.15
    },
    penalties: {
      combatPower: 0.9,
      resourceProduction: 0.85
    },
    specialAbilities: [
      'Mind Transference - Transfer consciousness to new bodies',
      'Transcendent Knowledge - Unlock ancient technologies',
      'Collective Consciousness - Share experiences across members'
    ],
    diplomaticStances: [
      { factionId: 'vortexCultists', stance: 'allied' },
      { factionId: 'neuralCollective', stance: 'neutral' },
      { factionId: 'luminousOrder', stance: 'hostile' }
    ],
    homeworld: 'The Transcendence Station',
    population: '600 Million (mostly digital)',
    culture: 'Philosophy is everything. Physical form is merely temporary shell.',
    tradingResources: ['Ancient Knowledge', 'Consciousness Fragments', 'Digital Artifacts']
  }
};

export const FACTION_DESCRIPTIONS: Record<FactionId, string> = {
  terranEmpire: 'The founding human civilization, balancing military strength with diplomacy.',
  voidWalkers: 'Nomadic explorers who reject planetary settlement and embrace freedom.',
  crystallineSyndicate: 'Corporate profit-driven faction controlling crystal and energy markets.',
  neuralCollective: 'Hive-mind civilization seeking perfect efficiency and knowledge synthesis.',
  solarConsortium: 'Democratic federation promoting science, sustainability, and freedom.',
  vortexCultists: 'Mysterious faction obsessed with interdimensional phenomena and cosmic secrets.',
  mechanicsSect: 'Technomancers dedicated to perfecting machinery and technology.',
  luminousOrder: 'Ancient order seeking universal peace, wisdom, and enlightenment.',
  abyssalAlliance: 'Dark faction of conquerors and manipulators ruling through fear.',
  sentinelLegion: 'Military order protecting the innocent from cosmic threats.',
  nomadCircle: 'Free traders and merchants seeking profit and adventure.',
  transcendentCircle: 'Philosophers seeking to transcend physical existence through consciousness.'
};
