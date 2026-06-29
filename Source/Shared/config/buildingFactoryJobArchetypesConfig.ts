export interface BuildingArchetypeStats {
  production: number;
  efficiency: number;
  capacity: number;
  speed: number;
}

export interface BuildingArchetypeSubStats {
  maintenance: number;
  durability: number;
  resilience: number;
  upkeep: number;
}

export interface BuildingArchetypeAttributes {
  powerDraw: number;
  crewRequired: number;
  automationLevel: number;
  constructionCost: number;
}

export interface BuildingArchetypeSubAttributes {
  synergyBonus: number;
  expansionSlots: number;
  overrideCapable: boolean;
  environmentalResistance: number;
}

export interface BuildingArchetype {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  subType: string;
  class: string;
  subClass: string;
  /** Base tier of this building type (1-99) */
  tier: number;
  rank: string;
  title: string;
  description: string;
  subDescription: string;
  details: string;
  stats: BuildingArchetypeStats;
  subStats: BuildingArchetypeSubStats;
  attributes: BuildingArchetypeAttributes;
  subAttributes: BuildingArchetypeSubAttributes;
  subjects: string[];
  subjectDetails: Record<string, string>;
}

export interface FactoryJobArchetypeStats {
  productivity: number;
  efficiency: number;
  throughput: number;
  reliability: number;
}

export interface FactoryJobArchetypeSubStats {
  fatigue: number;
  morale: number;
  trainingTime: number;
  errorRate: number;
}

export interface FactoryJobArchetypeAttributes {
  skillLevel: number;
  clearanceLevel: number;
  shiftDuration: number;
  crewSize: number;
}

export interface FactoryJobArchetypeSubAttributes {
  specializationBonus: number;
  crossTrainingSlots: number;
  automationCompatible: boolean;
  hazardRating: number;
}

export interface FactoryJobArchetype {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  subType: string;
  class: string;
  subClass: string;
  jobCategory: string;
  subJobCategory: string;
  /** Base tier of this job type (1-99) */
  tier: number;
  rank: string;
  title: string;
  description: string;
  subDescription: string;
  details: string;
  stats: FactoryJobArchetypeStats;
  subStats: FactoryJobArchetypeSubStats;
  attributes: FactoryJobArchetypeAttributes;
  subAttributes: FactoryJobArchetypeSubAttributes;
  subjects: string[];
  subjectDetails: Record<string, string>;
}

type BuildingSeedFamily = {
  category: string;
  subCategory: string;
  type: string;
  class: string;
  subClass: string;
  /** Base tier for all buildings in this family (1-99) */
  tier: number;
  description: string;
  subDescription: string;
  details: string;
  subjects: string[];
  subTypes: string[];
};

type FactoryJobSeedFamily = {
  category: string;
  subCategory: string;
  type: string;
  class: string;
  subClass: string;
  jobCategory: string;
  subJobCategory: string;
  /** Base tier for all jobs in this family (1-99) */
  tier: number;
  description: string;
  subDescription: string;
  details: string;
  subjects: string[];
  subTypes: string[];
};

// ---------------------------------------------------------------------------
// Helper: derive rank/title from tier
// ---------------------------------------------------------------------------
function rankForTier(tier: number): string {
  const ranks = ['Initiate', 'Apprentice', 'Journeyman', 'Expert', 'Master', 'Champion', 'Legend', 'Transcendent', 'Cosmic'];
  return ranks[Math.min(8, Math.floor((tier - 1) / 11))];
}

function titleForTier(tier: number, typeName: string): string {
  const classes = ['Foundational', 'Structural', 'Advanced', 'Elite', 'Masterwork', 'Legendary', 'Mythic', 'Transcendent', 'Cosmic'];
  const cls = classes[Math.min(8, Math.floor((tier - 1) / 11))];
  return `${cls} ${typeName} [Tier ${tier}]`;
}

function buildingStatsForTier(tier: number): BuildingArchetypeStats {
  return {
    production: 10 + tier * 8,
    efficiency: parseFloat((0.5 + tier * 0.005).toFixed(3)),
    capacity: 1000 + tier * 500,
    speed: parseFloat((1.0 + tier * 0.02).toFixed(2)),
  };
}

function buildingSubStatsForTier(tier: number): BuildingArchetypeSubStats {
  return {
    maintenance: parseFloat((0.1 + tier * 0.003).toFixed(3)),
    durability: 100 + tier * 10,
    resilience: 50 + tier * 5,
    upkeep: parseFloat((0.05 + tier * 0.002).toFixed(3)),
  };
}

function buildingAttributesForTier(tier: number): BuildingArchetypeAttributes {
  return {
    powerDraw: 10 + tier * 3,
    crewRequired: Math.max(1, Math.floor(5 + tier * 0.5)),
    automationLevel: Math.min(10, Math.floor(tier / 10) + 1),
    constructionCost: 100 + tier * 50,
  };
}

function buildingSubAttributesForTier(tier: number): BuildingArchetypeSubAttributes {
  return {
    synergyBonus: parseFloat((0.01 + tier * 0.005).toFixed(3)),
    expansionSlots: Math.min(20, Math.floor(tier / 5) + 1),
    overrideCapable: tier >= 10,
    environmentalResistance: Math.min(100, tier * 2),
  };
}

function jobStatsForTier(tier: number): FactoryJobArchetypeStats {
  return {
    productivity: 10 + tier * 6,
    efficiency: parseFloat((0.5 + tier * 0.005).toFixed(3)),
    throughput: 5 + tier * 4,
    reliability: parseFloat((0.6 + tier * 0.004).toFixed(3)),
  };
}

function jobSubStatsForTier(tier: number): FactoryJobArchetypeSubStats {
  return {
    fatigue: parseFloat((1.0 - tier * 0.008).toFixed(3)),
    morale: parseFloat((0.5 + tier * 0.005).toFixed(3)),
    trainingTime: Math.max(1, 100 - tier),
    errorRate: parseFloat((0.1 - tier * 0.001).toFixed(3)),
  };
}

function jobAttributesForTier(tier: number): FactoryJobArchetypeAttributes {
  return {
    skillLevel: Math.min(10, Math.floor(tier / 10) + 1),
    clearanceLevel: Math.min(10, Math.floor(tier / 10) + 1),
    shiftDuration: 8,
    crewSize: Math.max(1, Math.floor(2 + tier * 0.3)),
  };
}

function jobSubAttributesForTier(tier: number): FactoryJobArchetypeSubAttributes {
  return {
    specializationBonus: parseFloat((0.01 + tier * 0.005).toFixed(3)),
    crossTrainingSlots: Math.min(5, Math.floor(tier / 20) + 1),
    automationCompatible: tier >= 5,
    hazardRating: Math.max(0, Math.min(10, Math.floor(tier / 10))),
  };
}

function buildSubjectDetails(subjects: string[], tier: number): Record<string, string> {
  return Object.fromEntries(
    subjects.map((s, i) => [
      s,
      `${s} at tier ${tier}: ${['base capacity', 'efficiency', 'output bonus', 'productivity'][i % 4]} = ${tier * (i + 1) * 3}.`,
    ])
  );
}

const BUILDING_SEED_FAMILIES: BuildingSeedFamily[] = [
  // ── CATEGORY 1 ── Resource Infrastructure (1 sub-category: Extraction Sector)
  {
    category: 'Resource Infrastructure',
    subCategory: 'Extraction Sector',
    type: 'Building',
    class: 'Resource',
    subClass: 'Extraction',
    tier: 1,
    description: 'Extracts raw materials from planetary surfaces and subsurface deposits.',
    subDescription: 'Core extraction operations supporting all resource pipelines.',
    details: 'Includes mining, drilling, and refining structures for metals, crystals, deuterium, and exotic matter.',
    subjects: ['Mining', 'Raw Materials', 'Resource Extraction', 'Ore Processing'],
    subTypes: [
      'Metal Mine', 'Crystal Mine', 'Deuterium Synthesizer', 'Gas Harvester',
      'Ice Extractor', 'Ore Refinery', 'Plasma Extractor', 'Rare Earth Drill',
      'Dark Matter Tap', 'Salvage Processor',
    ],
  },
  // ── CATEGORY 2 ── Energy Infrastructure (1 sub-category: Power Grid)
  {
    category: 'Energy Infrastructure',
    subCategory: 'Power Grid',
    type: 'Building',
    class: 'Energy',
    subClass: 'Generation',
    tier: 1,
    description: 'Generates and distributes energy across all planetary installations.',
    subDescription: 'Stable power supply enabling all industrial and civil operations.',
    details: 'Covers solar, fusion, antimatter, and zero-point energy generation facilities.',
    subjects: ['Energy', 'Power Generation', 'Electricity', 'Fuel Conversion'],
    subTypes: [
      'Solar Plant', 'Fusion Reactor', 'Antimatter Core', 'Geothermal Station',
      'Orbital Solar Relay', 'Hydrogen Cell Farm', 'Quantum Battery Bank',
      'Photon Converter', 'Stellar Collector', 'Zero Point Plant',
    ],
  },
  // ── CATEGORY 3 ── Production Infrastructure (1 sub-category: Manufacturing Sector)
  {
    category: 'Production Infrastructure',
    subCategory: 'Manufacturing Sector',
    type: 'Building',
    class: 'Industrial',
    subClass: 'Fabrication',
    tier: 2,
    description: 'Manufactures ships, units, components, and military hardware.',
    subDescription: 'Industrial output forming the backbone of the war and trade economy.',
    details: 'Includes shipyards, robotics plants, weapon forges, and vehicle assembly lines.',
    subjects: ['Manufacturing', 'Shipbuilding', 'Weapons Production', 'Industrial Output'],
    subTypes: [
      'Robotics Factory', 'Shipyard', 'Nanite Factory', 'Drone Foundry',
      'Armor Plant', 'Weapons Forge', 'Ammunition Foundry', 'Vehicle Assembly',
      'Component Factory', 'Tool Forge',
    ],
  },
  // ── CATEGORY 4 ── Research Infrastructure (1 sub-category: Science Sector)
  {
    category: 'Research Infrastructure',
    subCategory: 'Science Sector',
    type: 'Building',
    class: 'Research',
    subClass: 'Development',
    tier: 2,
    description: 'Conducts scientific research to unlock new technologies and capabilities.',
    subDescription: 'Research facilities accelerate technological progression across all domains.',
    details: 'Hosts research labs, AI hubs, quantum facilities, and simulation cores.',
    subjects: ['Research', 'Science', 'Technology Development', 'Innovation'],
    subTypes: [
      'Research Lab', 'Mega Research Lab', 'AI Analytics Hub', 'Quantum Lab',
      'Xeno Biology Lab', 'Materials Lab', 'Propulsion Lab', 'Signal Lab',
      'Weapon Test Chamber', 'Simulation Core',
    ],
  },
  // ── CATEGORY 5 ── Storage Infrastructure (1 sub-category: Stockpile Sector)
  {
    category: 'Storage Infrastructure',
    subCategory: 'Stockpile Sector',
    type: 'Building',
    class: 'Logistics',
    subClass: 'Storage',
    tier: 1,
    description: 'Stores resources, ammunition, data, and strategic reserves.',
    subDescription: 'Maintains stockpiles supporting sustained production and military readiness.',
    details: 'Includes metal, crystal, deuterium, food, and ammunition storage facilities.',
    subjects: ['Storage', 'Resource Management', 'Stockpile', 'Logistics'],
    subTypes: [
      'Metal Storage', 'Crystal Storage', 'Deuterium Tank', 'Food Vault',
      'Ammunition Depot', 'Cold Storage', 'Archive Vault', 'Data Warehouse',
      'Fuel Reserve', 'Secure Cache',
    ],
  },
  // ── CATEGORY 6 ── Defense Infrastructure (1 sub-category: Fortification Sector)
  {
    category: 'Defense Infrastructure',
    subCategory: 'Fortification Sector',
    type: 'Building',
    class: 'Defense',
    subClass: 'Fortification',
    tier: 3,
    description: 'Defends the planet against orbital bombardment and ground assault.',
    subDescription: 'Planetary defense grid covering shields, turrets, and bunkers.',
    details: 'Includes shield generators, missile silos, turret grids, and command bastions.',
    subjects: ['Defense', 'Planetary Security', 'Fortification', 'Anti-Air'],
    subTypes: [
      'Shield Generator', 'Missile Silo', 'Defense Turret Grid', 'Bunker Complex',
      'Point Defense Node', 'Orbital Cannon Control', 'Anti Air Net',
      'Counter Battery Hub', 'Security Barracks', 'Command Bastion',
    ],
  },
  // ── CATEGORY 7 ── Civil Infrastructure (1 sub-category: Population Sector)
  {
    category: 'Civil Infrastructure',
    subCategory: 'Population Sector',
    type: 'Building',
    class: 'Civilian',
    subClass: 'Population',
    tier: 1,
    description: 'Supports the civilian population with housing, services, and governance.',
    subDescription: 'Civil buildings sustain population growth, morale, and administration.',
    details: 'Covers habitats, medical centers, education hubs, and diplomatic embassies.',
    subjects: ['Population', 'Civilian Services', 'Governance', 'Social Welfare'],
    subTypes: [
      'Habitat Complex', 'Medical Center', 'Education Hub', 'Civil Administration',
      'Trade Center', 'Transit Hub', 'Cultural Forum', 'Law Complex',
      'Worker Quarters', 'Diplomatic Embassy',
    ],
  },
  // ── CATEGORY 8 ── Orbital Infrastructure (1 sub-category: Space Sector)
  {
    category: 'Orbital Infrastructure',
    subCategory: 'Space Sector',
    type: 'Building',
    class: 'Orbital',
    subClass: 'Space Operations',
    tier: 5,
    description: 'Manages orbital assets including docks, habitats, and jump relays.',
    subDescription: 'Orbital facilities extend planetary operations into space.',
    details: 'Contains orbital docks, sensor arrays, jump relays, and cargo rings.',
    subjects: ['Orbital Operations', 'Space Logistics', 'Fleet Support', 'Jump Networks'],
    subTypes: [
      'Orbital Dock', 'Station Anchor', 'Sensor Array', 'Jump Relay',
      'Cargo Ring', 'Repair Dock', 'Fleet Beacon', 'Traffic Control Node',
      'Orbital Habitat', 'Customs Port',
    ],
  },
  // ── CATEGORY 9 ── Strategic Infrastructure (1 sub-category: Empire Core)
  {
    category: 'Strategic Infrastructure',
    subCategory: 'Empire Core',
    type: 'Building',
    class: 'Strategic',
    subClass: 'Command',
    tier: 10,
    description: 'Houses the command centres and strategic assets of the empire.',
    subDescription: 'High-value structures shaping empire-wide policy and military direction.',
    details: 'Planetary capitals, war councils, intelligence nexuses, and victory monuments.',
    subjects: ['Empire Command', 'Strategic Planning', 'Intelligence', 'Policy'],
    subTypes: [
      'Planetary Capital', 'Grand Archive', 'War Council Chamber', 'Intel Nexus',
      'Policy Engine', 'Treaty Hall', 'Supreme Court', 'Empire Treasury',
      'Strategic Simulator', 'Victory Monument',
    ],
  },
  // ── CATEGORY 10 ── Communication Infrastructure (2 sub-categories)
  {
    category: 'Communication Infrastructure',
    subCategory: 'Signal Network',
    type: 'Building',
    class: 'Communication',
    subClass: 'Transmission',
    tier: 3,
    description: 'Transmits signals, data, and orders across interstellar distances.',
    subDescription: 'Signal networks maintain real-time connectivity for military and trade.',
    details: 'Comm arrays, relay stations, quantum transmitters, and deep space beacons.',
    subjects: ['Signal Transmission', 'Communications', 'Data Networks', 'Relay Systems'],
    subTypes: [
      'Comm Array', 'Relay Station', 'Quantum Transmitter',
      'Deep Space Beacon', 'Neural Net Hub',
    ],
  },
  {
    category: 'Communication Infrastructure',
    subCategory: 'Broadcast Division',
    type: 'Building',
    class: 'Communication',
    subClass: 'Broadcast',
    tier: 3,
    description: 'Manages media, public information, and encrypted command broadcasts.',
    subDescription: 'Broadcast division structures control information flow and morale.',
    details: 'Propaganda towers, media centers, encryption vaults, and network command posts.',
    subjects: ['Media', 'Information Control', 'Encryption', 'Public Affairs'],
    subTypes: [
      'Propaganda Tower', 'Media Center', 'Public Address System',
      'Encryption Vault', 'Network Command Post',
    ],
  },
  // ── CATEGORY 11 ── Medical Infrastructure (2 sub-categories)
  {
    category: 'Medical Infrastructure',
    subCategory: 'Treatment Sector',
    type: 'Building',
    class: 'Medical',
    subClass: 'Treatment',
    tier: 2,
    description: 'Provides medical care and recovery services to the population and military.',
    subDescription: 'Treatment facilities reduce casualties and maintain workforce health.',
    details: 'Medical bays, trauma centers, surgical suites, nano-med labs, and field hospitals.',
    subjects: ['Healthcare', 'Trauma Care', 'Surgery', 'Recovery'],
    subTypes: [
      'Medical Bay', 'Trauma Center', 'Surgical Suite',
      'Nano-Med Lab', 'Field Hospital',
    ],
  },
  {
    category: 'Medical Infrastructure',
    subCategory: 'Medical Research',
    type: 'Building',
    class: 'Medical',
    subClass: 'Biotech',
    tier: 4,
    description: 'Researches cures, enhancements, and biological warfare countermeasures.',
    subDescription: 'Medical research facilities develop next-generation treatments and biotech.',
    details: 'Pathogen labs, biotech facilities, genomics labs, pharmaceutical plants, and wellness institutes.',
    subjects: ['Biotech', 'Genomics', 'Pharmaceuticals', 'Biological Research'],
    subTypes: [
      'Pathogen Lab', 'Biotech Facility', 'Genomics Lab',
      'Pharmaceutical Plant', 'Wellness Institute',
    ],
  },
  // ── CATEGORY 12 ── Environmental Infrastructure (3 sub-categories)
  {
    category: 'Environmental Infrastructure',
    subCategory: 'Terraforming Division',
    type: 'Building',
    class: 'Environmental',
    subClass: 'Terraforming',
    tier: 6,
    description: 'Transforms planetary surfaces to support colonization and agriculture.',
    subDescription: 'Terraforming operations reshape hostile worlds into habitable biomes.',
    details: 'Atmosphere processors, soil activators, biome seeders, and geoengineering hubs.',
    subjects: ['Terraforming', 'Planetary Engineering', 'Atmosphere', 'Soil Science'],
    subTypes: [
      'Atmosphere Processor', 'Soil Activator',
      'Biome Seeder', 'Geoengineering Hub',
    ],
  },
  {
    category: 'Environmental Infrastructure',
    subCategory: 'Biosphere Control',
    type: 'Building',
    class: 'Environmental',
    subClass: 'Ecology',
    tier: 5,
    description: 'Maintains and monitors planetary ecosystems and biodiversity.',
    subDescription: 'Biosphere control structures preserve ecological stability.',
    details: 'Biodomes, ecosystem monitors, and coral reef simulators.',
    subjects: ['Ecology', 'Biodiversity', 'Biosphere', 'Ecosystem Management'],
    subTypes: ['Biodome', 'Ecosystem Monitor', 'Coral Reef Simulator'],
  },
  {
    category: 'Environmental Infrastructure',
    subCategory: 'Atmospheric Lab',
    type: 'Building',
    class: 'Environmental',
    subClass: 'Climate',
    tier: 5,
    description: 'Controls atmospheric conditions and mitigates climate change.',
    subDescription: 'Atmospheric labs provide climate stability for productive worlds.',
    details: 'Climate control nodes, carbon sequestration vaults, and weather stations.',
    subjects: ['Climate Control', 'Atmosphere', 'Carbon Sequestration', 'Weather'],
    subTypes: ['Climate Control Node', 'Carbon Sequestration Vault', 'Weather Station'],
  },
  // ── CATEGORY 13 ── Intelligence Infrastructure (3 sub-categories)
  {
    category: 'Intelligence Infrastructure',
    subCategory: 'Surveillance Network',
    type: 'Building',
    class: 'Intelligence',
    subClass: 'Surveillance',
    tier: 4,
    description: 'Collects intelligence on enemy movements and planetary activity.',
    subDescription: 'Surveillance networks provide real-time threat assessment.',
    details: 'Spy satellites, perimeter scanners, recon hubs, and signal interceptors.',
    subjects: ['Surveillance', 'Reconnaissance', 'Signal Intelligence', 'Threat Assessment'],
    subTypes: [
      'Spy Satellite', 'Perimeter Scanners',
      'Recon Hub', 'Signal Interceptor',
    ],
  },
  {
    category: 'Intelligence Infrastructure',
    subCategory: 'Analysis Bureau',
    type: 'Building',
    class: 'Intelligence',
    subClass: 'Analysis',
    tier: 5,
    description: 'Processes and analyses collected intelligence data.',
    subDescription: 'Analysis bureaus convert raw data into actionable intelligence.',
    details: 'Intelligence centers, code-breaking labs, and data fusion hubs.',
    subjects: ['Data Analysis', 'Code Breaking', 'Intelligence Fusion', 'Cryptography'],
    subTypes: ['Intelligence Center', 'Code-Breaking Lab', 'Data Fusion Hub'],
  },
  {
    category: 'Intelligence Infrastructure',
    subCategory: 'Counterintel Hub',
    type: 'Building',
    class: 'Intelligence',
    subClass: 'Counterintelligence',
    tier: 5,
    description: 'Protects against enemy espionage and information warfare.',
    subDescription: 'Counterintelligence hubs neutralise threats from infiltration.',
    details: 'Counter-spy agencies, deception matrices, and misinformation centers.',
    subjects: ['Counterintelligence', 'Deception', 'Information Security', 'Espionage Defence'],
    subTypes: ['Counter-Spy Agency', 'Deception Matrix', 'Misinformation Center'],
  },
  // ── CATEGORY 14 ── Trade Infrastructure (3 sub-categories)
  {
    category: 'Trade Infrastructure',
    subCategory: 'Commerce Hub',
    type: 'Building',
    class: 'Commerce',
    subClass: 'Trade',
    tier: 3,
    description: 'Facilitates interstellar trade, commerce, and merchant activity.',
    subDescription: 'Commerce hubs drive economic growth through organised trade networks.',
    details: 'Trade ports, market exchanges, commodity warehouses, and merchant guilds.',
    subjects: ['Trade', 'Commerce', 'Commodity Markets', 'Merchants'],
    subTypes: [
      'Trade Port', 'Market Exchange',
      'Commodity Warehouse', 'Merchant Guild',
    ],
  },
  {
    category: 'Trade Infrastructure',
    subCategory: 'Exchange Market',
    type: 'Building',
    class: 'Commerce',
    subClass: 'Finance',
    tier: 4,
    description: 'Manages financial markets, currencies, and investment instruments.',
    subDescription: 'Exchange markets regulate the flow of credits and futures contracts.',
    details: 'Stock exchanges, futures markets, and currency mints.',
    subjects: ['Finance', 'Currency', 'Markets', 'Investment'],
    subTypes: ['Stock Exchange', 'Futures Market', 'Currency Mint'],
  },
  {
    category: 'Trade Infrastructure',
    subCategory: 'Trade Registry',
    type: 'Building',
    class: 'Commerce',
    subClass: 'Regulation',
    tier: 3,
    description: 'Regulates trade licences, contracts, and dispute resolution.',
    subDescription: 'Trade registries ensure fair commerce and legal compliance.',
    details: 'Licensing bureaus, contract vaults, and trade tribunals.',
    subjects: ['Trade Regulation', 'Contracts', 'Licensing', 'Dispute Resolution'],
    subTypes: ['Licensing Bureau', 'Contract Vault', 'Trade Tribunal'],
  },
  // ── CATEGORY 15 ── Cultural Infrastructure (3 sub-categories)
  {
    category: 'Cultural Infrastructure',
    subCategory: 'Arts District',
    type: 'Building',
    class: 'Cultural',
    subClass: 'Arts',
    tier: 2,
    description: 'Promotes galactic art, culture, and creative expression.',
    subDescription: 'Arts districts inspire innovation and boost population morale.',
    details: 'Galactic museums, sculpture gardens, theater complexes, and holographic galleries.',
    subjects: ['Art', 'Culture', 'Museums', 'Creative Expression'],
    subTypes: [
      'Galactic Museum', 'Sculpture Garden',
      'Theater Complex', 'Holographic Gallery',
    ],
  },
  {
    category: 'Cultural Infrastructure',
    subCategory: 'Recreation Complex',
    type: 'Building',
    class: 'Cultural',
    subClass: 'Recreation',
    tier: 2,
    description: 'Provides leisure, entertainment, and recreational facilities.',
    subDescription: 'Recreation complexes sustain population wellbeing and cohesion.',
    details: 'Sports arenas, entertainment domes, and pleasure gardens.',
    subjects: ['Recreation', 'Entertainment', 'Sports', 'Leisure'],
    subTypes: ['Sports Arena', 'Entertainment Dome', 'Pleasure Gardens'],
  },
  {
    category: 'Cultural Infrastructure',
    subCategory: 'Heritage Center',
    type: 'Building',
    class: 'Cultural',
    subClass: 'Heritage',
    tier: 3,
    description: 'Preserves cultural history, artefacts, and civilisation records.',
    subDescription: 'Heritage centers build collective identity and inter-species relations.',
    details: 'Archive monuments, cultural libraries, and living history institutes.',
    subjects: ['Heritage', 'History', 'Archives', 'Cultural Preservation'],
    subTypes: ['Archive Monument', 'Cultural Library', 'Living History Institute'],
  },
  // ── CATEGORY 16 ── Agricultural Infrastructure (3 sub-categories)
  {
    category: 'Agricultural Infrastructure',
    subCategory: 'Farming Operations',
    type: 'Building',
    class: 'Agricultural',
    subClass: 'Cultivation',
    tier: 1,
    description: 'Grows and harvests food crops to feed the planetary population.',
    subDescription: 'Farming operations form the foundation of food security.',
    details: 'Hydroponic farms, vertical gardens, livestock stations, and crop harvesters.',
    subjects: ['Farming', 'Crop Production', 'Livestock', 'Food Security'],
    subTypes: [
      'Hydroponic Farm', 'Vertical Garden',
      'Livestock Station', 'Crop Harvester',
    ],
  },
  {
    category: 'Agricultural Infrastructure',
    subCategory: 'Food Processing',
    type: 'Building',
    class: 'Agricultural',
    subClass: 'Processing',
    tier: 2,
    description: 'Processes raw agricultural yields into consumable food products.',
    subDescription: 'Food processing plants convert raw crops into nutritional supplies.',
    details: 'Food processing plants, protein synthesizers, and nutrition labs.',
    subjects: ['Food Processing', 'Protein Synthesis', 'Nutrition', 'Supply Chain'],
    subTypes: ['Food Processing Plant', 'Protein Synthesizer', 'Nutrition Lab'],
  },
  {
    category: 'Agricultural Infrastructure',
    subCategory: 'Agri-Science Lab',
    type: 'Building',
    class: 'Agricultural',
    subClass: 'Research',
    tier: 3,
    description: 'Researches improved crop strains, soil chemistry, and drought resistance.',
    subDescription: 'Agri-science labs accelerate agricultural development and yield optimisation.',
    details: 'Genome farms, drought resistance centers, and soil science labs.',
    subjects: ['Agricultural Science', 'Genomics', 'Drought Resistance', 'Soil Chemistry'],
    subTypes: ['Genome Farm', 'Drought Resistance Center', 'Soil Science Lab'],
  },
  // ── CATEGORY 17 ── Transportation Infrastructure (2 sub-categories)
  {
    category: 'Transportation Infrastructure',
    subCategory: 'Transit Network',
    type: 'Building',
    class: 'Transportation',
    subClass: 'Transit',
    tier: 2,
    description: 'Moves people and personnel rapidly across planetary surfaces.',
    subDescription: 'Transit networks improve workforce mobility and response times.',
    details: 'Maglev hubs, hyperloop stations, traffic control centers, and fuel depots.',
    subjects: ['Transit', 'Passenger Transport', 'Surface Mobility', 'Traffic Management'],
    subTypes: [
      'Maglev Hub', 'Ground Transport Terminal',
      'Hyperloop Station', 'Traffic Control Center', 'Fuel Depot',
    ],
  },
  {
    category: 'Transportation Infrastructure',
    subCategory: 'Cargo System',
    type: 'Building',
    class: 'Transportation',
    subClass: 'Freight',
    tier: 2,
    description: 'Manages the movement and distribution of cargo across the planet.',
    subDescription: 'Cargo systems ensure timely delivery of resources and goods.',
    details: 'Cargo terminals, distribution warehouses, freight dispatchers, and automated sorters.',
    subjects: ['Cargo Logistics', 'Freight', 'Distribution', 'Warehousing'],
    subTypes: [
      'Cargo Terminal', 'Distribution Warehouse',
      'Freight Dispatcher', 'Logistics Base', 'Automated Sorter',
    ],
  },
  // ── CATEGORY 18 ── Advanced Technology Infrastructure (2 sub-categories)
  {
    category: 'Advanced Technology Infrastructure',
    subCategory: 'Quantum Computing Center',
    type: 'Building',
    class: 'AdvancedTech',
    subClass: 'QuantumComputing',
    tier: 8,
    description: 'Houses quantum computing hardware enabling planet-scale computation.',
    subDescription: 'Quantum computing centers unlock AI, simulation, and decryption at scale.',
    details: 'Quantum processor arrays, qubit stabilizers, entanglement engines, and quantum memory banks.',
    subjects: ['Quantum Computing', 'Cryptography', 'Simulation', 'Data Processing'],
    subTypes: [
      'Quantum Processor Array', 'Qubit Stabilizer',
      'Entanglement Engine', 'Computation Nexus', 'Quantum Memory Bank',
    ],
  },
  {
    category: 'Advanced Technology Infrastructure',
    subCategory: 'AI Command Hub',
    type: 'Building',
    class: 'AdvancedTech',
    subClass: 'ArtificialIntelligence',
    tier: 9,
    description: 'Operates autonomous AI systems for strategic planning and logistics.',
    subDescription: 'AI command hubs provide predictive analysis and self-optimising production.',
    details: 'AI cores, neural processing units, machine learning labs, and predictive analysis engines.',
    subjects: ['Artificial Intelligence', 'Machine Learning', 'Autonomous Systems', 'Predictive Analysis'],
    subTypes: [
      'AI Core', 'Neural Processing Unit',
      'Machine Learning Lab', 'Autonomous Command Node', 'Predictive Analysis Engine',
    ],
  },
];

const FACTORY_JOB_SEED_FAMILIES: FactoryJobSeedFamily[] = [
  {
    category: 'Factory Workforce',
    subCategory: 'Extraction Operations',
    type: 'FactoryJob',
    class: 'Operations',
    subClass: 'Extraction',
    jobCategory: 'Resource Jobs',
    subJobCategory: 'Mining Crew',
    tier: 1,
    description: 'Operates drilling, cutting, and extraction equipment in mines and refineries.',
    subDescription: 'Extraction crews form the first link in the resource supply chain.',
    details: 'Ore cutters, crystal extractors, fuel pump operators, and blast planners.',
    subjects: ['Extraction', 'Mining', 'Drilling', 'Ore Processing'],
    subTypes: ['Ore Cutter', 'Crystal Extractor', 'Fuel Pump Operator', 'Core Drill Tech', 'Excavation Supervisor', 'Pit Surveyor', 'Refinery Loader', 'Conveyor Specialist', 'Blast Planner', 'Recovery Handler'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Assembly Operations',
    type: 'FactoryJob',
    class: 'Operations',
    subClass: 'Assembly',
    jobCategory: 'Manufacturing Jobs',
    subJobCategory: 'Assembly Crew',
    tier: 2,
    description: 'Assembles hulls, chassis, modules, and components on factory lines.',
    subDescription: 'Assembly crews maintain production velocity across all manufacturing sectors.',
    details: 'Hull assemblers, chassis welders, module installers, and line calibrators.',
    subjects: ['Assembly', 'Manufacturing', 'Fabrication', 'Quality Control'],
    subTypes: ['Hull Assembler', 'Chassis Welder', 'Module Installer', 'Line Calibrator', 'Precision Fitter', 'Fabrication Operator', 'Tool Setter', 'Batch Controller', 'Output Inspector', 'Packaging Specialist'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Engineering Operations',
    type: 'FactoryJob',
    class: 'Engineering',
    subClass: 'Maintenance',
    jobCategory: 'Technical Jobs',
    subJobCategory: 'Engineering Crew',
    tier: 2,
    description: 'Maintains, repairs, and upgrades factory equipment and systems.',
    subDescription: 'Engineering crews prevent downtime and optimise machinery performance.',
    details: 'Systems engineers, maintenance mechanics, robotics mechanics, and automation engineers.',
    subjects: ['Engineering', 'Maintenance', 'Robotics', 'Automation'],
    subTypes: ['Systems Engineer', 'Power Engineer', 'Maintenance Mechanic', 'Control Technician', 'Robotics Mechanic', 'Nanite Tech', 'Calibration Engineer', 'Hydraulics Specialist', 'Automation Engineer', 'Thermal Engineer'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Research Operations',
    type: 'FactoryJob',
    class: 'Research',
    subClass: 'Innovation',
    jobCategory: 'Science Jobs',
    subJobCategory: 'Lab Crew',
    tier: 3,
    description: 'Conducts process research, material science, and production optimisation.',
    subDescription: 'Research crews advance factory capabilities through continuous innovation.',
    details: 'Process researchers, materials scientists, AI analysts, and quantum researchers.',
    subjects: ['Research', 'Innovation', 'Materials Science', 'Process Optimisation'],
    subTypes: ['Process Researcher', 'Materials Scientist', 'AI Analyst', 'Optimization Scientist', 'Quantum Researcher', 'Prototype Architect', 'Test Engineer', 'Data Research Lead', 'R&D Coordinator', 'Simulation Specialist'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Logistics Operations',
    type: 'FactoryJob',
    class: 'Logistics',
    subClass: 'Supply Chain',
    jobCategory: 'Supply Jobs',
    subJobCategory: 'Logistics Crew',
    tier: 2,
    description: 'Manages inventory, freight, and supply chain flows across the factory.',
    subDescription: 'Logistics crews ensure smooth material flow from intake to dispatch.',
    details: 'Inventory clerks, supply dispatchers, freight planners, and route optimizers.',
    subjects: ['Logistics', 'Supply Chain', 'Inventory', 'Freight Management'],
    subTypes: ['Inventory Clerk', 'Supply Dispatcher', 'Freight Planner', 'Warehouse Controller', 'Dock Scheduler', 'Route Optimizer', 'Asset Tracker', 'Customs Liaison', 'Cargo Marshal', 'Reserve Coordinator'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Quality Operations',
    type: 'FactoryJob',
    class: 'Quality',
    subClass: 'Assurance',
    jobCategory: 'Quality Jobs',
    subJobCategory: 'Inspection Crew',
    tier: 3,
    description: 'Inspects output quality, enforces safety standards, and manages compliance.',
    subDescription: 'Quality crews safeguard product integrity and regulatory adherence.',
    details: 'Quality inspectors, failure analysts, safety auditors, and process auditors.',
    subjects: ['Quality Assurance', 'Safety', 'Compliance', 'Defect Analysis'],
    subTypes: ['Quality Inspector', 'Failure Analyst', 'Safety Auditor', 'Compliance Officer', 'Standards Reviewer', 'Defect Tracker', 'Reliability Tester', 'Certification Specialist', 'Risk Examiner', 'Process Auditor'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Command Operations',
    type: 'FactoryJob',
    class: 'Command',
    subClass: 'Management',
    jobCategory: 'Leadership Jobs',
    subJobCategory: 'Command Crew',
    tier: 4,
    description: 'Directs factory strategy, workforce allocation, and production targets.',
    subDescription: 'Command crews set performance goals and resolve operational bottlenecks.',
    details: 'Shift supervisors, factory managers, production directors, and operations commanders.',
    subjects: ['Leadership', 'Management', 'Production Planning', 'Workforce Strategy'],
    subTypes: ['Shift Supervisor', 'Factory Manager', 'Production Director', 'Workforce Coordinator', 'Policy Controller', 'Operations Commander', 'Resource Governor', 'Throughput Strategist', 'Plant Administrator', 'Executive Foreman'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Defense Operations',
    type: 'FactoryJob',
    class: 'Security',
    subClass: 'Protection',
    jobCategory: 'Defense Jobs',
    subJobCategory: 'Security Crew',
    tier: 3,
    description: 'Secures factory premises against sabotage, espionage, and physical threats.',
    subDescription: 'Defense crews protect strategic industrial assets from hostile action.',
    details: 'Facility guards, perimeter commanders, drone security pilots, and hazmat wardens.',
    subjects: ['Security', 'Facility Protection', 'Cyber Defence', 'Emergency Response'],
    subTypes: ['Facility Guard', 'Perimeter Commander', 'Drone Security Pilot', 'Cyber Defense Operator', 'Emergency Marshal', 'Threat Analyst', 'Response Team Lead', 'Checkpoint Officer', 'Counterintel Agent', 'Hazmat Warden'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Support Operations',
    type: 'FactoryJob',
    class: 'Support',
    subClass: 'Services',
    jobCategory: 'Support Jobs',
    subJobCategory: 'Support Crew',
    tier: 1,
    description: 'Provides medical, welfare, training, and administrative support to factory workers.',
    subDescription: 'Support crews sustain morale, health, and productivity across the workforce.',
    details: 'Medical technicians, training instructors, comms specialists, and welfare coordinators.',
    subjects: ['Support Services', 'Welfare', 'Training', 'Administration'],
    subTypes: ['Medical Technician', 'Training Instructor', 'Comms Specialist', 'Welfare Coordinator', 'Civil Liaison', 'Morale Officer', 'Food Services Lead', 'Transit Coordinator', 'Records Clerk', 'Legal Administrator'],
  },
];

// ---------------------------------------------------------------------------
// Building archetype generator – produces full rich archetypes from seed data
// ---------------------------------------------------------------------------
let _buildingGlobalId = 0;

export const BUILDING_ARCHETYPES: BuildingArchetype[] = BUILDING_SEED_FAMILIES.flatMap((family) =>
  family.subTypes.map((subType) => {
    _buildingGlobalId += 1;
    const tier = family.tier;
    return {
      id: `building-${String(_buildingGlobalId).padStart(3, '0')}`,
      name: subType,
      category: family.category,
      subCategory: family.subCategory,
      type: family.type,
      subType,
      class: family.class,
      subClass: family.subClass,
      tier,
      rank: rankForTier(tier),
      title: titleForTier(tier, subType),
      description: family.description,
      subDescription: family.subDescription,
      details: family.details,
      stats: buildingStatsForTier(tier),
      subStats: buildingSubStatsForTier(tier),
      attributes: buildingAttributesForTier(tier),
      subAttributes: buildingSubAttributesForTier(tier),
      subjects: family.subjects,
      subjectDetails: buildSubjectDetails(family.subjects, tier),
    };
  })
);

/** @deprecated Use BUILDING_ARCHETYPES – kept for backward compatibility */
export const BUILDING_ARCHETYPES_90: BuildingArchetype[] = BUILDING_ARCHETYPES.slice(0, 90);

// ---------------------------------------------------------------------------
// Factory job archetype generator
// ---------------------------------------------------------------------------
let _jobGlobalId = 0;

export const FACTORY_JOB_ARCHETYPES: FactoryJobArchetype[] = FACTORY_JOB_SEED_FAMILIES.flatMap((family) =>
  family.subTypes.map((subType) => {
    _jobGlobalId += 1;
    const tier = family.tier;
    return {
      id: `factory-job-${String(_jobGlobalId).padStart(3, '0')}`,
      name: subType,
      category: family.category,
      subCategory: family.subCategory,
      type: family.type,
      subType,
      class: family.class,
      subClass: family.subClass,
      jobCategory: family.jobCategory,
      subJobCategory: family.subJobCategory,
      tier,
      rank: rankForTier(tier),
      title: titleForTier(tier, subType),
      description: family.description,
      subDescription: family.subDescription,
      details: family.details,
      stats: jobStatsForTier(tier),
      subStats: jobSubStatsForTier(tier),
      attributes: jobAttributesForTier(tier),
      subAttributes: jobSubAttributesForTier(tier),
      subjects: family.subjects,
      subjectDetails: buildSubjectDetails(family.subjects, tier),
    };
  })
);

/** @deprecated Use FACTORY_JOB_ARCHETYPES – kept for backward compatibility */
export const FACTORY_JOB_ARCHETYPES_90: FactoryJobArchetype[] = FACTORY_JOB_ARCHETYPES.slice(0, 90);

export const BUILDING_ARCHETYPES_GROUPED_BY_CATEGORY = BUILDING_ARCHETYPES.reduce<Record<string, BuildingArchetype[]>>((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});

export const BUILDING_ARCHETYPES_GROUPED_BY_SUBCATEGORY = BUILDING_ARCHETYPES.reduce<Record<string, BuildingArchetype[]>>((acc, item) => {
  if (!acc[item.subCategory]) {
    acc[item.subCategory] = [];
  }
  acc[item.subCategory].push(item);
  return acc;
}, {});

export const FACTORY_JOB_ARCHETYPES_GROUPED_BY_JOB_CATEGORY = FACTORY_JOB_ARCHETYPES.reduce<Record<string, FactoryJobArchetype[]>>((acc, item) => {
  if (!acc[item.jobCategory]) {
    acc[item.jobCategory] = [];
  }
  acc[item.jobCategory].push(item);
  return acc;
}, {});

export const BUILDING_FACTORY_JOB_META = {
  buildings: {
    total: BUILDING_ARCHETYPES.length,
    categoryCount: new Set(BUILDING_ARCHETYPES.map(item => item.category)).size,
    subCategoryCount: new Set(BUILDING_ARCHETYPES.map(item => item.subCategory)).size,
    categories: Array.from(new Set(BUILDING_ARCHETYPES.map(item => item.category))),
    subCategories: Array.from(new Set(BUILDING_ARCHETYPES.map(item => item.subCategory))),
    types: Array.from(new Set(BUILDING_ARCHETYPES.map(item => item.type))),
    subTypes: Array.from(new Set(BUILDING_ARCHETYPES.map(item => item.subType))),
    classes: Array.from(new Set(BUILDING_ARCHETYPES.map(item => item.class))),
    subClasses: Array.from(new Set(BUILDING_ARCHETYPES.map(item => item.subClass))),
    tiers: Array.from(new Set(BUILDING_ARCHETYPES.map(item => item.tier))).sort((a, b) => a - b),
    ranks: Array.from(new Set(BUILDING_ARCHETYPES.map(item => item.rank))),
  },
  factoryJobs: {
    total: FACTORY_JOB_ARCHETYPES.length,
    categoryCount: new Set(FACTORY_JOB_ARCHETYPES.map(item => item.category)).size,
    subCategoryCount: new Set(FACTORY_JOB_ARCHETYPES.map(item => item.subCategory)).size,
    categories: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.category))),
    subCategories: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.subCategory))),
    types: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.type))),
    subTypes: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.subType))),
    classes: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.class))),
    subClasses: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.subClass))),
    jobCategories: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.jobCategory))),
    subJobCategories: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.subJobCategory))),
    tiers: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.tier))).sort((a, b) => a - b),
    ranks: Array.from(new Set(FACTORY_JOB_ARCHETYPES.map(item => item.rank))),
  },
};
