export type StarTypeId =
  | 'red-dwarf'
  | 'orange-dwarf'
  | 'yellow-star'
  | 'blue-giant'
  | 'red-giant'
  | 'white-dwarf'
  | 'neutron-star'
  | 'binary-system'
  | 'trinary-system'
  | 'pulsar';

export type PlanetTypeId =
  | 'terrestrial'
  | 'ocean'
  | 'desert'
  | 'arctic'
  | 'tropical'
  | 'gas-giant'
  | 'ice-giant'
  | 'rocky'
  | 'volcanic'
  | 'toxic'
  | 'barren'
  | 'crystalline'
  | 'gas-resource'
  | 'asteroid-belt'
  | 'megastructure';

export type MoonTypeId =
  | 'large-terrestrial'
  | 'small-terrestrial'
  | 'ice-moon'
  | 'volcanic-moon'
  | 'gas-moon'
  | 'asteroid'
  | 'captured'
  | 'artificial';

export type ResourceCategoryId =
  | 'mineral'
  | 'energy'
  | 'crystal'
  | 'strategic'
  | 'precursor';

export type ResourceRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export type ConnectionType =
  | 'hyperlane'
  | 'gateway'
  | 'l-gate'
  | 'wormhole';

export type GalaxyShape =
  | 'spiral'
  | 'elliptical'
  | 'ring'
  | 'cluster';

export type GalaxySize =
  | 'small'
  | 'medium'
  | 'large'
  | 'huge';

export type AnomalyDifficulty =
  | 'trivial'
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'extreme'
  | 'legendary';

export interface StarType {
  readonly id: StarTypeId;
  readonly name: string;
  readonly color: string;
  readonly size: string;
  readonly temperature: string;
  readonly luminosity: string;
  readonly habitableZoneRange: readonly [number, number];
  readonly planetSlots: readonly [number, number];
  readonly resourceModifier: number;
  readonly dangerLevel: number;
}

export interface PlanetType {
  readonly id: PlanetTypeId;
  readonly name: string;
  readonly description: string;
  readonly habitability: number;
  readonly resourceSlots: number;
  readonly maxMoons: number;
  readonly basePopulation: number;
  readonly atmosphere: string;
  readonly specialFeatures: readonly string[];
  readonly compatibleBiomes: readonly string[];
}

export interface MoonType {
  readonly id: MoonTypeId;
  readonly name: string;
  readonly habitability: number;
  readonly resourceSlots: number;
  readonly specialFeatures: readonly string[];
  readonly compatibleBiomes: readonly string[];
}

export interface ResourceDeposit {
  readonly id: string;
  readonly name: string;
  readonly category: ResourceCategoryId;
  readonly baseYield: number;
  readonly rarity: ResourceRarity;
  readonly distributionWeights: Readonly<Record<StarTypeId, number>>;
}

export interface AnomalyType {
  readonly id: string;
  readonly name: string;
  readonly difficulty: AnomalyDifficulty;
  readonly rewards: Readonly<Record<string, number>>;
  readonly dangerLevel: number;
  readonly description: string;
}

export interface SystemConnection {
  readonly from: string;
  readonly to: string;
  readonly type: ConnectionType;
  readonly distance: number;
  readonly travelTime: number;
}

export interface GalaxyGenerationPreset {
  readonly size: GalaxySize;
  readonly totalSystems: number;
  readonly spiralArms: number;
  readonly description: string;
}

export interface SystemEventChoice {
  readonly id: string;
  readonly label: string;
  readonly outcome: string;
  readonly resourceChanges: Readonly<Record<string, number>>;
  readonly chanceModifier: number;
}

export interface SystemEvent {
  readonly id: string;
  readonly name: string;
  readonly trigger: string;
  readonly effects: Readonly<Record<string, number>>;
  readonly choices: readonly SystemEventChoice[];
}

export const STAR_TYPES: readonly StarType[] = [
  {
    id: 'red-dwarf',
    name: 'Red Dwarf',
    color: '#cc4444',
    size: '0.1-0.5 R☉',
    temperature: '2400-3700 K',
    luminosity: '0.0001-0.05 L☉',
    habitableZoneRange: [0.05, 0.2],
    planetSlots: [1, 5],
    resourceModifier: 0.8,
    dangerLevel: 2,
  },
  {
    id: 'orange-dwarf',
    name: 'Orange Dwarf',
    color: '#dd8833',
    size: '0.6-0.9 R☉',
    temperature: '3700-5200 K',
    luminosity: '0.05-0.6 L☉',
    habitableZoneRange: [0.2, 0.7],
    planetSlots: [2, 7],
    resourceModifier: 1.0,
    dangerLevel: 1,
  },
  {
    id: 'yellow-star',
    name: 'Yellow Star',
    color: '#ffdd44',
    size: '0.9-1.1 R☉',
    temperature: '5200-6000 K',
    luminosity: '0.6-1.5 L☉',
    habitableZoneRange: [0.7, 1.5],
    planetSlots: [3, 9],
    resourceModifier: 1.2,
    dangerLevel: 1,
  },
  {
    id: 'blue-giant',
    name: 'Blue Giant',
    color: '#4488ff',
    size: '5-25 R☉',
    temperature: '10000-50000 K',
    luminosity: '1000-100000 L☉',
    habitableZoneRange: [3, 20],
    planetSlots: [4, 12],
    resourceModifier: 2.0,
    dangerLevel: 5,
  },
  {
    id: 'red-giant',
    name: 'Red Giant',
    color: '#ff4422',
    size: '10-200 R☉',
    temperature: '3000-5000 K',
    luminosity: '1000-10000 L☉',
    habitableZoneRange: [5, 50],
    planetSlots: [2, 6],
    resourceModifier: 1.5,
    dangerLevel: 4,
  },
  {
    id: 'white-dwarf',
    name: 'White Dwarf',
    color: '#eeeeff',
    size: '0.008-0.02 R☉',
    temperature: '8000-40000 K',
    luminosity: '0.0001-0.01 L☉',
    habitableZoneRange: [0.02, 0.1],
    planetSlots: [0, 3],
    resourceModifier: 0.5,
    dangerLevel: 3,
  },
  {
    id: 'neutron-star',
    name: 'Neutron Star',
    color: '#8888cc',
    size: '~0.00002 R☉',
    temperature: '1000000+ K',
    luminosity: 'Variable',
    habitableZoneRange: [0.01, 0.05],
    planetSlots: [0, 2],
    resourceModifier: 3.0,
    dangerLevel: 8,
  },
  {
    id: 'binary-system',
    name: 'Binary System',
    color: '#ffcc00',
    size: 'Variable',
    temperature: 'Variable',
    luminosity: 'Variable',
    habitableZoneRange: [0.5, 3],
    planetSlots: [2, 8],
    resourceModifier: 1.8,
    dangerLevel: 3,
  },
  {
    id: 'trinary-system',
    name: 'Trinary System',
    color: '#ff8800',
    size: 'Variable',
    temperature: 'Variable',
    luminosity: 'Variable',
    habitableZoneRange: [0.3, 5],
    planetSlots: [3, 10],
    resourceModifier: 2.5,
    dangerLevel: 4,
  },
  {
    id: 'pulsar',
    name: 'Pulsar',
    color: '#6666ff',
    size: '~0.00002 R☉',
    temperature: '1000000+ K',
    luminosity: 'Radio pulsing',
    habitableZoneRange: [0.01, 0.03],
    planetSlots: [0, 1],
    resourceModifier: 4.0,
    dangerLevel: 10,
  },
] as const;

export const PLANET_TYPES: readonly PlanetType[] = [
  {
    id: 'terrestrial',
    name: 'Terrestrial',
    description: 'Rocky world with balanced atmosphere and liquid water',
    habitability: 85,
    resourceSlots: 4,
    maxMoons: 3,
    basePopulation: 5000000000,
    atmosphere: 'nitrogen-oxygen',
    specialFeatures: ['continents', 'oceans', 'temperate_climate', 'native_biome'],
    compatibleBiomes: ['Aegis Arbor World', 'Borealis Basin Planet', 'Verdant Crown World', 'Gaia Trench Planet', 'Zenith Haven World'] as const,
  },
  {
    id: 'ocean',
    name: 'Ocean World',
    description: 'Water-covered planet with vast deep oceans',
    habitability: 60,
    resourceSlots: 3,
    maxMoons: 2,
    basePopulation: 2000000000,
    atmosphere: 'nitrogen-oxygen',
    specialFeatures: ['deep_ocean', 'thermal_vents', 'aqua_resources'],
    compatibleBiomes: ['Nimbus Reef World', 'Luminous Marsh Sphere', 'Radiant Fjord World'] as const,
  },
  {
    id: 'desert',
    name: 'Desert World',
    description: 'Arid planet with sparse water and harsh sunlight',
    habitability: 35,
    resourceSlots: 5,
    maxMoons: 2,
    basePopulation: 500000000,
    atmosphere: 'thin-carbon-dioxide',
    specialFeatures: ['sand_dunes', 'rare_minerals', 'solar_reserves'],
    compatibleBiomes: ['Cryon Dune Sphere', 'Mirage Canyon Planet', 'Pioneer Mesa Sphere', 'Quantum Prairie Planet'] as const,
  },
  {
    id: 'arctic',
    name: 'Arctic World',
    description: 'Frozen planet with ice-covered surface and frigid winds',
    habitability: 25,
    resourceSlots: 4,
    maxMoons: 1,
    basePopulation: 100000000,
    atmosphere: 'thin-nitrogen',
    specialFeatures: ['ice_cap', 'cryogenic_deposits', 'frozen_gas'],
    compatibleBiomes: ['Jade Tundra World', 'Frostfall Basin Moon', 'Crescent Ice Moon'] as const,
  },
  {
    id: 'tropical',
    name: 'Tropical World',
    description: 'Lush humid world with dense vegetation and warm seas',
    habitability: 75,
    resourceSlots: 3,
    maxMoons: 2,
    basePopulation: 4000000000,
    atmosphere: 'nitrogen-oxygen',
    specialFeatures: ['dense_jungle', 'biodiversity', 'rare_flora'],
    compatibleBiomes: ['Frontier Grove World', 'Ion Forest Planet', 'Tempest Garden Sphere'] as const,
  },
  {
    id: 'gas-giant',
    name: 'Gas Giant',
    description: 'Massive planet composed primarily of hydrogen and helium',
    habitability: 0,
    resourceSlots: 6,
    maxMoons: 12,
    basePopulation: 0,
    atmosphere: 'hydrogen-helium',
    specialFeatures: ['storm_systems', 'ring_system', 'moon_nursery', 'gas_mining'],
    compatibleBiomes: [] as const,
  },
  {
    id: 'ice-giant',
    name: 'Ice Giant',
    description: 'Massive planet with heavy-element-rich icy mantle',
    habitability: 0,
    resourceSlots: 5,
    maxMoons: 8,
    basePopulation: 0,
    atmosphere: 'hydrogen-helium-methane',
    specialFeatures: ['ice_mantle', 'diamond_rain', 'exotic_materials'],
    compatibleBiomes: ['Frostfall Basin Moon', 'Crescent Ice Moon', 'Whisper Moon'] as const,
  },
  {
    id: 'rocky',
    name: 'Rocky World',
    description: 'Barren rocky planet with minimal atmosphere',
    habitability: 10,
    resourceSlots: 6,
    maxMoons: 1,
    basePopulation: 0,
    atmosphere: 'trace',
    specialFeatures: ['mineral_rich', 'tectonic_shards', 'heavy_metals'],
    compatibleBiomes: ['Obsidian Vale Planet', 'Warden Hollow Planet', 'Monolith Moon'] as const,
  },
  {
    id: 'volcanic',
    name: 'Volcanic World',
    description: 'Tectonically active planet with extreme heat and lava flows',
    habitability: 5,
    resourceSlots: 7,
    maxMoons: 1,
    basePopulation: 0,
    atmosphere: 'toxic-sulfur',
    specialFeatures: ['lava_flows', 'geothermal_vents', 'rare_minerals', 'extreme_heat'],
    compatibleBiomes: ['Ember Rift Planet', 'Umbral Basin Planet', 'Drift Ash Moon'] as const,
  },
  {
    id: 'toxic',
    name: 'Toxic World',
    description: 'Planet with corrosive atmosphere and hostile surface conditions',
    habitability: 0,
    resourceSlots: 5,
    maxMoons: 0,
    basePopulation: 0,
    atmosphere: 'corrosive-mixed',
    specialFeatures: ['acid_rain', 'toxic_clouds', 'corrosive_minerals', 'hostile_terrain'],
    compatibleBiomes: ['Umbral Basin Planet', 'Drift Ash Moon'] as const,
  },
  {
    id: 'barren',
    name: 'Barren World',
    description: 'Dead planet with no atmosphere and cratered surface',
    habitability: 0,
    resourceSlots: 3,
    maxMoons: 0,
    basePopulation: 0,
    atmosphere: 'none',
    specialFeatures: ['cratered_surface', 'impact_glass', 'stripped_crust'],
    compatibleBiomes: ['Monolith Moon', 'Quarry Moon'] as const,
  },
  {
    id: 'crystalline',
    name: 'Crystalline World',
    description: 'Rare planet with vast crystalline formations across the surface',
    habitability: 5,
    resourceSlots: 8,
    maxMoons: 1,
    basePopulation: 0,
    atmosphere: 'trace-inert',
    specialFeatures: ['crystal_fields', 'energy_refraction', 'exotic_resonance', 'rare_crystals'],
    compatibleBiomes: ['Yonder Spire Planet', 'Helios Plateau Sphere', 'Xenon Shelf Sphere'] as const,
  },
  {
    id: 'gas-resource',
    name: 'Gas Harvesting',
    description: 'Gas-rich planet ideal for atmospheric resource extraction',
    habitability: 0,
    resourceSlots: 6,
    maxMoons: 4,
    basePopulation: 0,
    atmosphere: 'hydrogen-helium-rich',
    specialFeatures: ['atmospheric_harvesting', 'volatile_motes', 'rare_gas_deposits'],
    compatibleBiomes: [] as const,
  },
  {
    id: 'asteroid-belt',
    name: 'Asteroid Belt',
    description: 'Dense field of orbiting rocky bodies rich in minerals',
    habitability: 0,
    resourceSlots: 8,
    maxMoons: 0,
    basePopulation: 0,
    atmosphere: 'none',
    specialFeatures: ['mineral_asteroids', 'scattered_debris', 'mining_opportunities', 'navigation_hazard'],
    compatibleBiomes: ['Quarry Moon', 'Rimevault Moon'] as const,
  },
  {
    id: 'megastructure',
    name: 'Megastructure',
    description: 'Artificial or alien-built orbital megastructure',
    habitability: 50,
    resourceSlots: 10,
    maxMoons: 0,
    basePopulation: 100000000,
    atmosphere: 'artificial',
    specialFeatures: ['alien_tech', 'vast_resources', 'ancient_systems', 'unknown_purpose'],
    compatibleBiomes: ['Gateway Space Station Nexus', 'Dockline Space Station Yards', 'Bulwark Starbase Ring'] as const,
  },
] as const;

export const MOON_TYPES: readonly MoonType[] = [
  {
    id: 'large-terrestrial',
    name: 'Large Terrestrial',
    habitability: 70,
    resourceSlots: 3,
    specialFeatures: ['atmosphere', 'liquid_water', 'native_biome'],
    compatibleBiomes: ['Aster Lunar Reach', 'Glimmer Ridge Moon', 'Harbor Dust Moon'] as const,
  },
  {
    id: 'small-terrestrial',
    name: 'Small Terrestrial',
    habitability: 40,
    resourceSlots: 2,
    specialFeatures: ['thin_atmosphere', 'mineral_deposits'],
    compatibleBiomes: ['Bastion Crater Moon', 'Ivory Crag Moon', 'Nadir Dust Moon'] as const,
  },
  {
    id: 'ice-moon',
    name: 'Ice Moon',
    habitability: 15,
    resourceSlots: 3,
    specialFeatures: ['subsurface_ocean', 'cryogenic_materials', 'geysers'],
    compatibleBiomes: ['Crescent Ice Moon', 'Frostfall Basin Moon', 'Yardlight Moon'] as const,
  },
  {
    id: 'volcanic-moon',
    name: 'Volcanic Moon',
    habitability: 0,
    resourceSlots: 4,
    specialFeatures: ['active_volcanism', 'lava_flows', 'sulfur_deposits'],
    compatibleBiomes: ['Drift Ash Moon', 'Talon Moon'] as const,
  },
  {
    id: 'gas-moon',
    name: 'Gas Moon',
    habitability: 0,
    resourceSlots: 5,
    specialFeatures: ['atmospheric_harvesting', 'volatile_compounds'],
    compatibleBiomes: ['Vanguard Moon', 'Zephyr Moon'] as const,
  },
  {
    id: 'asteroid',
    name: 'Asteroid',
    habitability: 0,
    resourceSlots: 2,
    specialFeatures: ['raw_minerals', 'metallic_composition'],
    compatibleBiomes: ['Quarry Moon', 'Rimevault Moon', 'Kiteglass Moon'] as const,
  },
  {
    id: 'captured',
    name: 'Captured',
    habitability: 5,
    resourceSlots: 3,
    specialFeatures: ['irregular_orbit', 'exotic_composition', 'instability'],
    compatibleBiomes: ['Junction Orbital Moon', 'Lattice Scar Moon', 'Oracle Tide Moon'] as const,
  },
  {
    id: 'artificial',
    name: 'Artificial',
    habitability: 60,
    resourceSlots: 6,
    specialFeatures: ['advanced_tech', 'self_sustaining', 'unknown_origin'],
    compatibleBiomes: ['Palisade Moon', 'Sentinel Moon', 'Umbra Moon'] as const,
  },
] as const;

export const RESOURCE_DEPOSITS: readonly ResourceDeposit[] = [
  {
    id: 'iron',
    name: 'Iron',
    category: 'mineral',
    baseYield: 100,
    rarity: 'common',
    distributionWeights: {
      'red-dwarf': 1.0, 'orange-dwarf': 1.2, 'yellow-star': 1.1, 'blue-giant': 0.8,
      'red-giant': 0.9, 'white-dwarf': 0.5, 'neutron-star': 0.3, 'binary-system': 1.3,
      'trinary-system': 1.4, 'pulsar': 0.2,
    },
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'mineral',
    baseYield: 80,
    rarity: 'common',
    distributionWeights: {
      'red-dwarf': 1.1, 'orange-dwarf': 1.0, 'yellow-star': 1.0, 'blue-giant': 0.9,
      'red-giant': 1.0, 'white-dwarf': 0.4, 'neutron-star': 0.2, 'binary-system': 1.2,
      'trinary-system': 1.1, 'pulsar': 0.1,
    },
  },
  {
    id: 'titanium',
    name: 'Titanium',
    category: 'mineral',
    baseYield: 60,
    rarity: 'uncommon',
    distributionWeights: {
      'red-dwarf': 0.9, 'orange-dwarf': 1.0, 'yellow-star': 1.1, 'blue-giant': 1.5,
      'red-giant': 1.2, 'white-dwarf': 0.8, 'neutron-star': 0.6, 'binary-system': 1.3,
      'trinary-system': 1.5, 'pulsar': 0.4,
    },
  },
  {
    id: 'uranium',
    name: 'Uranium',
    category: 'mineral',
    baseYield: 40,
    rarity: 'rare',
    distributionWeights: {
      'red-dwarf': 0.5, 'orange-dwarf': 0.8, 'yellow-star': 1.0, 'blue-giant': 1.8,
      'red-giant': 1.5, 'white-dwarf': 1.0, 'neutron-star': 2.0, 'binary-system': 1.4,
      'trinary-system': 1.6, 'pulsar': 2.5,
    },
  },
  {
    id: 'plutonium',
    name: 'Plutonium',
    category: 'mineral',
    baseYield: 30,
    rarity: 'epic',
    distributionWeights: {
      'red-dwarf': 0.3, 'orange-dwarf': 0.5, 'yellow-star': 0.8, 'blue-giant': 2.0,
      'red-giant': 1.8, 'white-dwarf': 1.2, 'neutron-star': 2.5, 'binary-system': 1.5,
      'trinary-system': 1.8, 'pulsar': 3.0,
    },
  },
  {
    id: 'solar-reserves',
    name: 'Solar Reserves',
    category: 'energy',
    baseYield: 150,
    rarity: 'common',
    distributionWeights: {
      'red-dwarf': 0.6, 'orange-dwarf': 1.0, 'yellow-star': 1.5, 'blue-giant': 3.0,
      'red-giant': 2.0, 'white-dwarf': 0.3, 'neutron-star': 0.1, 'binary-system': 1.8,
      'trinary-system': 2.2, 'pulsar': 0.1,
    },
  },
  {
    id: 'geothermal-vents',
    name: 'Geothermal Vents',
    category: 'energy',
    baseYield: 120,
    rarity: 'uncommon',
    distributionWeights: {
      'red-dwarf': 1.2, 'orange-dwarf': 1.0, 'yellow-star': 1.0, 'blue-giant': 0.5,
      'red-giant': 1.5, 'white-dwarf': 0.3, 'neutron-star': 0.2, 'binary-system': 1.1,
      'trinary-system': 1.2, 'pulsar': 0.1,
    },
  },
  {
    id: 'antimatter-pockets',
    name: 'Antimatter Pockets',
    category: 'energy',
    baseYield: 50,
    rarity: 'epic',
    distributionWeights: {
      'red-dwarf': 0.2, 'orange-dwarf': 0.3, 'yellow-star': 0.5, 'blue-giant': 1.5,
      'red-giant': 1.0, 'white-dwarf': 2.0, 'neutron-star': 3.0, 'binary-system': 1.0,
      'trinary-system': 1.5, 'pulsar': 4.0,
    },
  },
  {
    id: 'common-crystal',
    name: 'Common Crystal',
    category: 'crystal',
    baseYield: 70,
    rarity: 'common',
    distributionWeights: {
      'red-dwarf': 1.0, 'orange-dwarf': 1.1, 'yellow-star': 1.0, 'blue-giant': 1.2,
      'red-giant': 0.9, 'white-dwarf': 1.5, 'neutron-star': 0.8, 'binary-system': 1.1,
      'trinary-system': 1.2, 'pulsar': 0.6,
    },
  },
  {
    id: 'rare-crystal',
    name: 'Rare Crystal',
    category: 'crystal',
    baseYield: 40,
    rarity: 'rare',
    distributionWeights: {
      'red-dwarf': 0.6, 'orange-dwarf': 0.8, 'yellow-star': 1.0, 'blue-giant': 1.5,
      'red-giant': 1.2, 'white-dwarf': 1.8, 'neutron-star': 1.0, 'binary-system': 1.3,
      'trinary-system': 1.4, 'pulsar': 1.2,
    },
  },
  {
    id: 'exotic-crystal',
    name: 'Exotic Crystal',
    category: 'crystal',
    baseYield: 25,
    rarity: 'epic',
    distributionWeights: {
      'red-dwarf': 0.3, 'orange-dwarf': 0.4, 'yellow-star': 0.6, 'blue-giant': 2.0,
      'red-giant': 1.0, 'white-dwarf': 2.5, 'neutron-star': 1.5, 'binary-system': 1.2,
      'trinary-system': 1.8, 'pulsar': 2.0,
    },
  },
  {
    id: 'living-crystal',
    name: 'Living Crystal',
    category: 'crystal',
    baseYield: 15,
    rarity: 'mythic',
    distributionWeights: {
      'red-dwarf': 0.1, 'orange-dwarf': 0.2, 'yellow-star': 0.3, 'blue-giant': 1.0,
      'red-giant': 0.5, 'white-dwarf': 1.0, 'neutron-star': 2.0, 'binary-system': 0.8,
      'trinary-system': 1.0, 'pulsar': 3.0,
    },
  },
  {
    id: 'dark-matter',
    name: 'Dark Matter',
    category: 'strategic',
    baseYield: 20,
    rarity: 'legendary',
    distributionWeights: {
      'red-dwarf': 0.2, 'orange-dwarf': 0.3, 'yellow-star': 0.5, 'blue-giant': 1.5,
      'red-giant': 1.0, 'white-dwarf': 2.0, 'neutron-star': 3.0, 'binary-system': 1.0,
      'trinary-system': 1.5, 'pulsar': 4.0,
    },
  },
  {
    id: 'volatile-motes',
    name: 'Volatile Motes',
    category: 'strategic',
    baseYield: 35,
    rarity: 'rare',
    distributionWeights: {
      'red-dwarf': 0.8, 'orange-dwarf': 0.9, 'yellow-star': 1.0, 'blue-giant': 1.8,
      'red-giant': 1.5, 'white-dwarf': 0.5, 'neutron-star': 0.3, 'binary-system': 1.2,
      'trinary-system': 1.3, 'pulsar': 0.2,
    },
  },
  {
    id: 'rare-crystals-strategic',
    name: 'Rare Crystals',
    category: 'strategic',
    baseYield: 30,
    rarity: 'epic',
    distributionWeights: {
      'red-dwarf': 0.4, 'orange-dwarf': 0.6, 'yellow-star': 0.8, 'blue-giant': 1.5,
      'red-giant': 1.0, 'white-dwarf': 2.0, 'neutron-star': 1.2, 'binary-system': 1.1,
      'trinary-system': 1.3, 'pulsar': 1.5,
    },
  },
  {
    id: 'living-metal',
    name: 'Living Metal',
    category: 'strategic',
    baseYield: 15,
    rarity: 'mythic',
    distributionWeights: {
      'red-dwarf': 0.1, 'orange-dwarf': 0.2, 'yellow-star': 0.3, 'blue-giant': 1.0,
      'red-giant': 0.5, 'white-dwarf': 1.5, 'neutron-star': 2.5, 'binary-system': 0.8,
      'trinary-system': 1.0, 'pulsar': 3.0,
    },
  },
  {
    id: 'relics',
    name: 'Relics',
    category: 'precursor',
    baseYield: 10,
    rarity: 'legendary',
    distributionWeights: {
      'red-dwarf': 0.5, 'orange-dwarf': 0.8, 'yellow-star': 1.0, 'blue-giant': 1.0,
      'red-giant': 1.5, 'white-dwarf': 2.0, 'neutron-star': 1.0, 'binary-system': 1.2,
      'trinary-system': 1.5, 'pulsar': 1.0,
    },
  },
  {
    id: 'ancient-tech',
    name: 'Ancient Tech',
    category: 'precursor',
    baseYield: 5,
    rarity: 'mythic',
    distributionWeights: {
      'red-dwarf': 0.2, 'orange-dwarf': 0.4, 'yellow-star': 0.6, 'blue-giant': 0.8,
      'red-giant': 1.5, 'white-dwarf': 2.5, 'neutron-star': 2.0, 'binary-system': 1.0,
      'trinary-system': 1.5, 'pulsar': 2.0,
    },
  },
  {
    id: 'lost-artifacts',
    name: 'Lost Artifacts',
    category: 'precursor',
    baseYield: 3,
    rarity: 'mythic',
    distributionWeights: {
      'red-dwarf': 0.1, 'orange-dwarf': 0.2, 'yellow-star': 0.3, 'blue-giant': 0.5,
      'red-giant': 1.0, 'white-dwarf': 3.0, 'neutron-star': 2.0, 'binary-system': 0.8,
      'trinary-system': 1.0, 'pulsar': 2.5,
    },
  },
] as const;

export const ANOMALY_TYPES: readonly AnomalyType[] = [
  {
    id: 'derelict-ship',
    name: 'Derelict Ship',
    difficulty: 'moderate',
    rewards: { metal: 5000, crystal: 2000, credits: 10000 },
    dangerLevel: 4,
    description: 'An abandoned vessel drifting through the system',
  },
  {
    id: 'ancient-ruins',
    name: 'Ancient Ruins',
    difficulty: 'hard',
    rewards: { metal: 3000, crystal: 8000, credits: 25000, researchPoints: 5000 },
    dangerLevel: 5,
    description: 'Remnants of a long-dead alien civilization',
  },
  {
    id: 'space-creature',
    name: 'Space Creature',
    difficulty: 'hard',
    rewards: { metal: 2000, crystal: 3000, credits: 15000 },
    dangerLevel: 7,
    description: 'A massive creature that has adapted to space travel',
  },
  {
    id: 'asteroid-field',
    name: 'Asteroid Field',
    difficulty: 'easy',
    rewards: { metal: 15000, crystal: 5000, credits: 8000 },
    dangerLevel: 3,
    description: 'Dense field of mineral-rich asteroids',
  },
  {
    id: 'nebula-distortion',
    name: 'Nebula Distortion',
    difficulty: 'moderate',
    rewards: { crystal: 12000, credits: 12000, researchPoints: 3000 },
    dangerLevel: 5,
    description: 'A nebula with unusual energy signatures',
  },
  {
    id: 'wormhole',
    name: 'Wormhole',
    difficulty: 'extreme',
    rewards: { credits: 50000, researchPoints: 10000 },
    dangerLevel: 9,
    description: 'A spatial anomaly connecting distant parts of the galaxy',
  },
  {
    id: 'black-hole',
    name: 'Black Hole',
    difficulty: 'legendary',
    rewards: { researchPoints: 20000 },
    dangerLevel: 10,
    description: 'A gravitational singularity warping spacetime around it',
  },
  {
    id: 'signal-source',
    name: 'Signal Source',
    difficulty: 'moderate',
    rewards: { credits: 8000, researchPoints: 4000 },
    dangerLevel: 3,
    description: 'An unexplained signal emanating from the system',
  },
  {
    id: 'crashed-colony-ship',
    name: 'Crashed Colony Ship',
    difficulty: 'easy',
    rewards: { metal: 8000, crystal: 4000, credits: 6000 },
    dangerLevel: 2,
    description: 'A colony ship that crash-landed on a nearby body',
  },
  {
    id: 'pirate-hideout',
    name: 'Pirate Hideout',
    difficulty: 'hard',
    rewards: { metal: 6000, crystal: 6000, credits: 30000 },
    dangerLevel: 6,
    description: 'A hidden base used by space pirates',
  },
  {
    id: 'abandoned-station',
    name: 'Abandoned Station',
    difficulty: 'moderate',
    rewards: { metal: 10000, crystal: 5000, credits: 15000, researchPoints: 2000 },
    dangerLevel: 4,
    description: 'A space station left derelict after its crew vanished',
  },
  {
    id: 'strange-signal',
    name: 'Strange Signal',
    difficulty: 'extreme',
    rewards: { credits: 20000, researchPoints: 15000 },
    dangerLevel: 7,
    description: 'A repeating signal with an unknown origin',
  },
  {
    id: 'cosmic-storm',
    name: 'Cosmic Storm',
    difficulty: 'moderate',
    rewards: { crystal: 10000, credits: 5000 },
    dangerLevel: 5,
    description: 'A powerful electromagnetic storm sweeping the system',
  },
  {
    id: 'dimensional-rift',
    name: 'Dimensional Rift',
    difficulty: 'legendary',
    rewards: { researchPoints: 25000, credits: 30000 },
    dangerLevel: 10,
    description: 'A tear in the fabric of spacetime leading to another dimension',
  },
  {
    id: 'precursor-vault',
    name: 'Precursor Vault',
    difficulty: 'legendary',
    rewards: { metal: 20000, crystal: 20000, credits: 100000, researchPoints: 30000 },
    dangerLevel: 8,
    description: 'A heavily fortified vault left by an ancient precursor civilization',
  },
] as const;

export const SYSTEM_CONNECTIONS: readonly SystemConnection[] = [
  { from: 'sol', to: 'alpha-centauri', type: 'hyperlane', distance: 4.37, travelTime: 2 },
  { from: 'alpha-centauri', to: 'proxima', type: 'hyperlane', distance: 0.24, travelTime: 1 },
  { from: 'sol', to: 'barnards-star', type: 'hyperlane', distance: 5.96, travelTime: 3 },
  { from: 'alpha-centauri', to: 'wolf-359', type: 'hyperlane', distance: 7.86, travelTime: 3 },
  { from: 'barnards-star', to: 'ross-154', type: 'hyperlane', distance: 3.85, travelTime: 2 },
  { from: 'wolf-359', to: 'ross-128', type: 'hyperlane', distance: 4.22, travelTime: 2 },
  { from: 'ross-154', to: 'luytens-star', type: 'hyperlane', distance: 5.03, travelTime: 2 },
  { from: 'ross-128', to: 'kruger-60', type: 'hyperlane', distance: 6.12, travelTime: 3 },
  { from: 'luytens-star', to: 'van-maanens-star', type: 'hyperlane', distance: 4.31, travelTime: 2 },
  { from: 'kruger-60', to: ' Kapteyns-star', type: 'hyperlane', distance: 5.74, travelTime: 3 },
  { from: 'sol', to: 'gateway-nexus', type: 'gateway', distance: 100, travelTime: 1 },
  { from: 'gateway-nexus', to: 'andromeda-gate', type: 'gateway', distance: 2500000, travelTime: 1 },
  { from: 'sol', to: 'l-gate-prime', type: 'l-gate', distance: 50, travelTime: 3 },
  { from: 'l-gate-prime', to: 'l-cluster-nexus', type: 'l-gate', distance: 0, travelTime: 5 },
  { from: 'sol', to: 'wormhole-alpha', type: 'wormhole', distance: 15, travelTime: 1 },
  { from: 'wormhole-alpha', to: 'wormhole-beta', type: 'wormhole', distance: 200, travelTime: 1 },
] as const;

export const GALAXY_GENERATION_PRESETS: readonly GalaxyGenerationPreset[] = [
  { size: 'small', totalSystems: 200, spiralArms: 4, description: 'Compact galaxy ideal for quick matches' },
  { size: 'medium', totalSystems: 500, spiralArms: 6, description: 'Standard galaxy for balanced gameplay' },
  { size: 'large', totalSystems: 1000, spiralArms: 8, description: 'Expansive galaxy for long-term strategy' },
  { size: 'huge', totalSystems: 2000, spiralArms: 10, description: 'Massive galaxy for epic campaigns' },
] as const;

export const GALAXY_SHAPES: readonly { readonly id: GalaxyShape; readonly name: string; readonly description: string }[] = [
  { id: 'spiral', name: 'Spiral', description: 'Classic spiral arms radiating from a central core' },
  { id: 'elliptical', name: 'Elliptical', description: 'Smooth oval shape with dense core and sparse outer regions' },
  { id: 'ring', name: 'Ring', description: 'Circular formation with a void center and dense outer ring' },
  { id: 'cluster', name: 'Cluster', description: 'Irregular shape with tightly packed systems in multiple clusters' },
] as const;

export const SYSTEM_EVENTS: readonly SystemEvent[] = [
  {
    id: 'pirate-raid',
    name: 'Pirate Raid',
    trigger: 'pirate-faction-present',
    effects: { fleetDamage: -500, credits: -2000 },
    choices: [
      { id: 'defend', label: 'Defend the system', outcome: 'minimal-losses', resourceChanges: { fleetDamage: -200 }, chanceModifier: 0.8 },
      { id: 'negotiate', label: 'Negotiate with pirates', outcome: 'tribute-paid', resourceChanges: { credits: -5000 }, chanceModifier: 1.0 },
      { id: 'retreat', label: 'Evacuate civilians', outcome: 'civilians-saved', resourceChanges: { population: -100000 }, chanceModifier: 1.2 },
    ],
  },
  {
    id: 'resource-discovery',
    name: 'Resource Discovery',
    trigger: 'exploration-scan',
    effects: { credits: 5000 },
    choices: [
      { id: 'mine', label: 'Begin mining operations', outcome: 'resource-income', resourceChanges: { credits: 3000 }, chanceModifier: 1.0 },
      { id: 'research', label: 'Study the deposits', outcome: 'research-boost', resourceChanges: { researchPoints: 2000 }, chanceModifier: 1.0 },
      { id: 'trade', label: 'Sell mining rights', outcome: 'immediate-profit', resourceChanges: { credits: 8000 }, chanceModifier: 0.9 },
    ],
  },
  {
    id: 'alien-encounter',
    name: 'Alien Encounter',
    trigger: 'exploration-deep-scan',
    effects: { diplomacyPoints: 500 },
    choices: [
      { id: 'peaceful', label: 'Initiate peaceful contact', outcome: 'alliance-potential', resourceChanges: { diplomacyPoints: 1000 }, chanceModifier: 1.0 },
      { id: 'trade', label: 'Propose trade agreement', outcome: 'trade-routes', resourceChanges: { credits: 4000 }, chanceModifier: 1.0 },
      { id: 'hostile', label: 'Show of force', outcome: 'territorial-warning', resourceChanges: { fleetDamage: -300 }, chanceModifier: 0.7 },
    ],
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    trigger: 'star-instability',
    effects: { energy: -1000 },
    choices: [
      { id: 'shield', label: 'Raise planetary shields', outcome: 'shields-absorbed', resourceChanges: { energy: -500 }, chanceModifier: 0.9 },
      { id: 'evacuate', label: 'Evacuate orbital stations', outcome: 'stations-saved', resourceChanges: { credits: -2000 }, chanceModifier: 1.0 },
      { id: 'endure', label: 'Weather the storm', outcome: 'random-damage', resourceChanges: { fleetDamage: -800 }, chanceModifier: 0.6 },
    ],
  },
  {
    id: 'colonization-wave',
    name: 'Colonization Wave',
    trigger: 'colony-expansion',
    effects: { population: 1000000 },
    choices: [
      { id: 'expand', label: 'Support colonization', outcome: 'new-colony', resourceChanges: { credits: -10000, population: 500000 }, chanceModifier: 1.0 },
      { id: 'restrain', label: 'Limit expansion', outcome: 'controlled-growth', resourceChanges: { credits: 2000 }, chanceModifier: 1.0 },
      { id: 'exploit', label: 'Exploit colonists', outcome: 'forced-labor', resourceChanges: { credits: 15000, population: -200000 }, chanceModifier: 0.8 },
    ],
  },
  {
    id: 'ancient-technology',
    name: 'Ancient Technology',
    trigger: 'precursor-scan',
    effects: { researchPoints: 5000 },
    choices: [
      { id: 'reverse-engineer', label: 'Reverse-engineer technology', outcome: 'tech-advancement', resourceChanges: { researchPoints: 10000 }, chanceModifier: 0.7 },
      { id: 'preserve', label: 'Preserve for study', outcome: 'future-benefits', resourceChanges: { researchPoints: 3000 }, chanceModifier: 1.0 },
      { id: 'auction', label: 'Auction to highest bidder', outcome: 'immediate-profit', resourceChanges: { credits: 20000 }, chanceModifier: 0.9 },
    ],
  },
  {
    id: 'meteor-storm',
    name: 'Meteor Storm',
    trigger: 'asteroid-destabilization',
    effects: { shields: -200 },
    choices: [
      { id: 'deflect', label: 'Deploy deflector array', outcome: 'storm-deflected', resourceChanges: { energy: -300 }, chanceModifier: 1.0 },
      { id: 'harvest', label: 'Harvest meteor resources', outcome: 'mineral-gain', resourceChanges: { metal: 5000, crystal: 2000 }, chanceModifier: 0.8 },
      { id: 'absorb', label: 'Absorb impact', outcome: 'structure-damage', resourceChanges: { metal: -3000 }, chanceModifier: 0.6 },
    ],
  },
  {
    id: 'diplomatic-crisis',
    name: 'Diplomatic Crisis',
    trigger: 'empire-contact',
    effects: { diplomacyPoints: -200 },
    choices: [
      { id: 'mediate', label: 'Offer mediation', outcome: 'peace-restored', resourceChanges: { diplomacyPoints: 500 }, chanceModifier: 0.9 },
      { id: 'choose-side', label: 'Choose a side', outcome: 'alliance-formed', resourceChanges: { diplomacyPoints: -100, fleetStrength: 500 }, chanceModifier: 0.7 },
      { id: 'isolate', label: 'Isolate from conflict', outcome: 'neutral-stance', resourceChanges: { diplomacyPoints: 200 }, chanceModifier: 1.0 },
    ],
  },
  {
    id: 'trade-route-opening',
    name: 'Trade Route Opening',
    trigger: 'galactic-commerce',
    effects: { credits: 3000 },
    choices: [
      { id: 'invest', label: 'Invest in infrastructure', outcome: 'increased-trade', resourceChanges: { credits: -5000, creditsPerTurn: 500 }, chanceModifier: 1.0 },
      { id: 'tax', label: 'Impose trade taxes', outcome: 'immediate-revenue', resourceChanges: { credits: 8000 }, chanceModifier: 0.9 },
      { id: 'regulate', label: 'Regulate trade', outcome: 'stable-market', resourceChanges: { credits: 2000 }, chanceModifier: 1.0 },
    ],
  },
  {
    id: 'stellar-anomaly',
    name: 'Stellar Anomaly',
    trigger: 'stellar-analysis',
    effects: { researchPoints: 3000 },
    choices: [
      { id: 'study', label: 'Dispatch research fleet', outcome: 'knowledge-gained', resourceChanges: { researchPoints: 8000 }, chanceModifier: 0.8 },
      { id: 'exploit', label: 'Harness the anomaly', outcome: 'energy-surge', resourceChanges: { energy: 10000 }, chanceModifier: 0.6 },
      { id: 'contain', label: 'Contain the anomaly', outcome: 'safety-assured', resourceChanges: { credits: -3000 }, chanceModifier: 1.0 },
    ],
  },
  {
    id: 'refugee-crisis',
    name: 'Refugee Crisis',
    trigger: 'nearby-conflict',
    effects: { population: 500000 },
    choices: [
      { id: 'accept', label: 'Accept refugees', outcome: 'population-boost', resourceChanges: { population: 300000, food: -2000 }, chanceModifier: 1.0 },
      { id: 'deny', label: 'Turn refugees away', outcome: 'morale-drop', resourceChanges: { morale: -20 }, chanceModifier: 1.0 },
      { id: 'relocate', label: 'Relocate to colonies', outcome: 'distributed-settlement', resourceChanges: { credits: -5000, population: 200000 }, chanceModifier: 0.9 },
    ],
  },
  {
    id: 'technological-breakthrough',
    name: 'Technological Breakthrough',
    trigger: 'research-milestone',
    effects: { researchPoints: 10000 },
    choices: [
      { id: 'patent', label: 'Patent the technology', outcome: 'licensing-revenue', resourceChanges: { credits: 20000 }, chanceModifier: 1.0 },
      { id: 'share', label: 'Share with allies', outcome: 'alliance-strengthened', resourceChanges: { diplomacyPoints: 1000 }, chanceModifier: 1.0 },
      { id: 'weaponize', label: 'Develop into weapon system', outcome: 'military-advantage', resourceChanges: { fleetStrength: 2000 }, chanceModifier: 0.8 },
    ],
  },
  {
    id: 'supply-shortage',
    name: 'Supply Shortage',
    trigger: 'resource-depletion',
    effects: { metal: -5000 },
    choices: [
      { id: 'ration', label: 'Implement rationing', outcome: 'slow-down', resourceChanges: { metal: 2000 }, chanceModifier: 1.0 },
      { id: 'trade', label: 'Purchase from market', outcome: 'immediate-relief', resourceChanges: { credits: -10000, metal: 5000 }, chanceModifier: 1.0 },
      { id: 'raid', label: 'Raid neighboring systems', outcome: 'aggressive-acquisition', resourceChanges: { metal: 8000, diplomacyPoints: -500 }, chanceModifier: 0.7 },
    ],
  },
  {
    id: 'celestial-event',
    name: 'Celestial Event',
    trigger: 'astronomical-phenomenon',
    effects: { researchPoints: 2000 },
    choices: [
      { id: 'observe', label: 'Observe and record', outcome: 'data-collected', resourceChanges: { researchPoints: 5000 }, chanceModifier: 1.0 },
      { id: 'harvest', label: 'Harvest cosmic energy', outcome: 'energy-surge', resourceChanges: { energy: 8000 }, chanceModifier: 0.7 },
      { id: 'ignore', label: 'Ignore the event', outcome: 'no-impact', resourceChanges: {}, chanceModifier: 1.0 },
    ],
  },
  {
    id: 'space-battle',
    name: 'Space Battle',
    trigger: 'enemy-fleet-detected',
    effects: { fleetDamage: -1000 },
    choices: [
      { id: 'engage', label: 'Engage the enemy', outcome: 'battle-victory', resourceChanges: { fleetDamage: -500, credits: 5000 }, chanceModifier: 0.6 },
      { id: 'ambush', label: 'Set up ambush', outcome: 'tactical-advantage', resourceChanges: { fleetDamage: -200, credits: 8000 }, chanceModifier: 0.8 },
      { id: 'flee', label: 'Retreat to safety', outcome: 'fleet-saved', resourceChanges: { fleetDamage: 0, credits: -2000 }, chanceModifier: 1.0 },
    ],
  },
  {
    id: 'pollution-crisis',
    name: 'Pollution Crisis',
    trigger: 'industrial-overexpansion',
    effects: { morale: -15, population: -50000 },
    choices: [
      { id: 'clean', label: 'Launch cleanup operation', outcome: 'environment-restored', resourceChanges: { credits: -8000, morale: 10 }, chanceModifier: 1.0 },
      { id: 'regulate', label: 'Enforce environmental regulations', outcome: 'slow-recovery', resourceChanges: { credits: -3000, morale: 5 }, chanceModifier: 1.0 },
      { id: 'relocate', label: 'Relocate population', outcome: 'population-saved', resourceChanges: { credits: -5000, population: -20000 }, chanceModifier: 0.9 },
    ],
  },
  {
    id: 'mining-accident',
    name: 'Mining Accident',
    trigger: 'mining-operations',
    effects: { metal: -3000, population: -10000 },
    choices: [
      { id: 'rescue', label: 'Launch rescue mission', outcome: 'miners-saved', resourceChanges: { metal: 1000, population: 5000, credits: -4000 }, chanceModifier: 0.8 },
      { id: 'salvage', label: 'Salvage equipment', outcome: 'partial-recovery', resourceChanges: { metal: 2000 }, chanceModifier: 1.0 },
      { id: 'seal', label: 'Seal the mine', outcome: 'site-abandoned', resourceChanges: { metal: 500 }, chanceModifier: 1.0 },
    ],
  },
  {
    id: 'population-boom',
    name: 'Population Boom',
    trigger: 'high-morale',
    effects: { population: 2000000 },
    choices: [
      { id: 'house', label: 'Build new housing', outcome: 'expansion', resourceChanges: { credits: -10000, population: 1000000 }, chanceModifier: 1.0 },
      { id: 'educate', label: 'Invest in education', outcome: 'research-boost', resourceChanges: { researchPoints: 5000 }, chanceModifier: 1.0 },
      { id: 'conscript', label: 'Expand military recruitment', outcome: 'fleet-growth', resourceChanges: { fleetStrength: 1000 }, chanceModifier: 0.9 },
    ],
  },
  {
    id: 'quantum-fluctuation',
    name: 'Quantum Fluctuation',
    trigger: 'physics-anomaly',
    effects: { researchPoints: 4000 },
    choices: [
      { id: 'contain', label: 'Contain the fluctuation', outcome: 'stability-restored', resourceChanges: { credits: -5000 }, chanceModifier: 1.0 },
      { id: 'study', label: 'Study the phenomenon', outcome: 'quantum-insights', resourceChanges: { researchPoints: 12000 }, chanceModifier: 0.7 },
      { id: 'exploit', label: 'Harness quantum energy', outcome: 'energy-harvest', resourceChanges: { energy: 15000 }, chanceModifier: 0.5 },
    ],
  },
  {
    id: 'galactic-market-crash',
    name: 'Galactic Market Crash',
    trigger: 'economic-instability',
    effects: { credits: -10000 },
    choices: [
      { id: 'stabilize', label: 'Inject credits to stabilize', outcome: 'market-recovered', resourceChanges: { credits: -15000, creditsPerTurn: 200 }, chanceModifier: 0.8 },
      { id: 'bargain', label: 'Buy undervalued assets', outcome: 'future-profits', resourceChanges: { credits: -20000, creditsPerTurn: 500 }, chanceModifier: 0.7 },
      { id: 'endure', label: 'Wait for recovery', outcome: 'slow-recovery', resourceChanges: {}, chanceModifier: 1.0 },
    ],
  },
  {
    id: 'precursor-awakening',
    name: 'Precursor Awakening',
    trigger: 'ancient-signal-detected',
    effects: { researchPoints: 15000, diplomacyPoints: 1000 },
    choices: [
      { id: 'communicate', label: 'Attempt communication', outcome: 'first-contact', resourceChanges: { researchPoints: 20000, diplomacyPoints: 2000 }, chanceModifier: 0.5 },
      { id: 'defend', label: 'Prepare defenses', outcome: 'fortified-position', resourceChanges: { fleetStrength: 3000 }, chanceModifier: 0.9 },
      { id: 'retreat', label: 'Withdraw to safe distance', outcome: 'observation-mode', resourceChanges: { researchPoints: 5000 }, chanceModifier: 1.0 },
    ],
  },
] as const;

export const STAR_SYSTEM_CONFIG = {
  starTypes: STAR_TYPES,
  planetTypes: PLANET_TYPES,
  moonTypes: MOON_TYPES,
  resourceDeposits: RESOURCE_DEPOSITS,
  anomalyTypes: ANOMALY_TYPES,
  systemConnections: SYSTEM_CONNECTIONS,
  galaxyPresets: GALAXY_GENERATION_PRESETS,
  galaxyShapes: GALAXY_SHAPES,
  systemEvents: SYSTEM_EVENTS,
} as const;

export type StarSystemConfig = typeof STAR_SYSTEM_CONFIG;
