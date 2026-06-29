export type BuildingCategory = 'economy' | 'military' | 'research' | 'infrastructure' | 'orbital';
export type GovernmentType = 'democracy' | 'oligarchy' | 'dictatorship' | 'theocracy' | 'anarchy';
export type ResourceType = 'energy' | 'minerals' | 'crystals' | 'darkMatter' | 'food';
export type SeasonTier = 'free' | 'premium';

export interface ResourceCost {
  readonly energy: number;
  readonly minerals: number;
  readonly crystals: number;
  readonly darkMatter: number;
  readonly food: number;
}

export interface BuildingEffect {
  readonly type: string;
  readonly value: number;
  readonly perLevel: number;
}

export interface BuildingConfig {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: BuildingCategory;
  readonly baseCost: ResourceCost;
  readonly costMultiplier: number;
  readonly buildTime: number;
  readonly prerequisites: readonly string[];
  readonly maxLevel: number;
  readonly energyConsumption: number;
  readonly effects: readonly BuildingEffect[];
  readonly adjacencyBonus: readonly string[];
}

export interface ShipStats {
  readonly attack: number;
  readonly defense: number;
  readonly shield: number;
  readonly hull: number;
  readonly speed: number;
  readonly cargo: number;
}

export interface ShipConfig {
  readonly id: string;
  readonly name: string;
  readonly tier: number;
  readonly stats: ShipStats;
  readonly fuelCost: number;
  readonly buildTime: number;
  readonly buildCost: ResourceCost;
  readonly counterType: string;
  readonly specialAbility: string | null;
  readonly supplyCost: number;
}

export interface ResearchLevel {
  readonly cost: ResourceCost;
  readonly time: number;
  readonly effects: readonly BuildingEffect[];
}

export interface ResearchConfig {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly baseCost: ResourceCost;
  readonly baseTime: number;
  readonly costMultiplier: number;
  readonly timeMultiplier: number;
  readonly maxLevel: number;
  readonly prerequisites: readonly { readonly techId: string; readonly level: number }[];
  readonly levels: readonly ResearchLevel[];
}

export interface SeasonReward {
  readonly tier: number;
  readonly type: SeasonTier;
  readonly reward: string;
  readonly value: number;
}

export interface SeasonConfig {
  readonly id: string;
  readonly name: string;
  readonly durationWeeks: number;
  readonly currency: string;
  readonly maxTiers: number;
  readonly rewards: readonly SeasonReward[];
  readonly techTree: readonly string[];
}

export interface PrestigeLevel {
  readonly level: number;
  readonly requirement: number;
  readonly unlock: string;
  readonly cosmeticId: string;
}

export interface CombatConfig {
  readonly baseCritChance: number;
  readonly critDamageMin: number;
  readonly critDamageMax: number;
  readonly evasionBase: number;
  readonly evasionPerSpeed: number;
  readonly shieldRegenRate: number;
  readonly maxRounds: number;
  readonly retreatChanceBase: number;
}

export interface MarketConfig {
  readonly transactionFee: number;
  readonly priceUpdateInterval: number;
  readonly demandMultiplier: number;
  readonly supplyMultiplier: number;
  readonly inflationBase: number;
  readonly inflationPerTrade: number;
}

export interface AllianceConfig {
  readonly maxMembers: number;
  readonly techShareBonus: number;
  readonly bankTaxRate: number;
  readonly warCooldown: number;
  readonly warDuration: number;
}

export interface TurnConfig {
  readonly turnsPerMinute: number;
  readonly maxStoredTurns: number;
  readonly offlineAccrualHours: number;
  readonly baseCost: number;
  readonly buildQueueMax: number;
  readonly darkMatterSpeedUpMultiplier: number;
}

export const RESOURCE_PRODUCTION = {
  BASE_PRODUCTION: {
    energy: 10,
    minerals: 8,
    crystals: 5,
    darkMatter: 1,
    food: 12,
  },
  SYNERGY_BONUS: 0.1,
  EMPIRE_LEVEL_MULTIPLIER: 0.05,
  GOVERNMENT_MULTIPLIERS: {
    democracy: 1.0,
    oligarchy: 1.15,
    dictatorship: 0.9,
    theocracy: 0.85,
    anarchy: 0.7,
  },
  RACE_BONUS_DEFAULT: 1.0,
  ENERGY_PENALTY_THRESHOLD: 0,
  ENERGY_PENALTY_MULTIPLIER: 0.5,
  COLONY_DISTANCE_FACTOR: 0.02,
  COLONY_MIN_EFFICIENCY: 0.3,
  STORAGE_OVERFLOW_PENALTY: 0.7,
} as const;

export const BUILDINGS: readonly BuildingConfig[] = [
  {
    id: 'solarPlant',
    name: 'Solar Plant',
    description: 'Generates energy for your colony',
    category: 'economy',
    baseCost: { energy: 0, minerals: 200, crystals: 50, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 300,
    prerequisites: [],
    maxLevel: 30,
    energyConsumption: 0,
    effects: [{ type: 'energyProduction', value: 10, perLevel: 5 }],
    adjacencyBonus: ['fusionReactor'],
  },
  {
    id: 'fusionReactor',
    name: 'Fusion Reactor',
    description: 'Advanced energy production',
    category: 'economy',
    baseCost: { energy: 0, minerals: 500, crystals: 200, darkMatter: 10, food: 0 },
    costMultiplier: 1.15,
    buildTime: 600,
    prerequisites: ['solarPlant'],
    maxLevel: 25,
    energyConsumption: 0,
    effects: [{ type: 'energyProduction', value: 25, perLevel: 12 }],
    adjacencyBonus: ['solarPlant', 'miningPlant'],
  },
  {
    id: 'miningPlant',
    name: 'Mining Plant',
    description: 'Extracts minerals from planetary crust',
    category: 'economy',
    baseCost: { energy: 100, minerals: 100, crystals: 20, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 250,
    prerequisites: [],
    maxLevel: 30,
    energyConsumption: 5,
    effects: [{ type: 'mineralProduction', value: 8, perLevel: 4 }],
    adjacencyBonus: ['solarPlant', 'crystalMine'],
  },
  {
    id: 'crystalMine',
    name: 'Crystal Mine',
    description: 'Harvests rare crystals',
    category: 'economy',
    baseCost: { energy: 150, minerals: 200, crystals: 0, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 350,
    prerequisites: ['miningPlant'],
    maxLevel: 25,
    energyConsumption: 8,
    effects: [{ type: 'crystalProduction', value: 5, perLevel: 3 }],
    adjacencyBonus: ['miningPlant', 'darkMatterLab'],
  },
  {
    id: 'darkMatterLab',
    name: 'Dark Matter Lab',
    description: 'Extracts dark matter from space anomalies',
    category: 'research',
    baseCost: { energy: 300, minerals: 400, crystals: 100, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 900,
    prerequisites: ['crystalMine'],
    maxLevel: 20,
    energyConsumption: 15,
    effects: [{ type: 'darkMatterProduction', value: 1, perLevel: 0.5 }],
    adjacencyBonus: ['crystalMine', 'researchLab'],
  },
  {
    id: 'hydroponicsFarm',
    name: 'Hydroponics Farm',
    description: 'Grows food for colonists',
    category: 'economy',
    baseCost: { energy: 50, minerals: 80, crystals: 10, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 200,
    prerequisites: [],
    maxLevel: 30,
    energyConsumption: 3,
    effects: [{ type: 'foodProduction', value: 12, perLevel: 6 }],
    adjacencyBonus: ['solarPlant'],
  },
  {
    id: 'shipyard',
    name: 'Shipyard',
    description: 'Constructs fleet vessels',
    category: 'military',
    baseCost: { energy: 200, minerals: 500, crystals: 100, darkMatter: 5, food: 0 },
    costMultiplier: 1.15,
    buildTime: 600,
    prerequisites: ['miningPlant'],
    maxLevel: 25,
    energyConsumption: 20,
    effects: [
      { type: 'fleetSupply', value: 10, perLevel: 5 },
      { type: 'buildSpeed', value: 0.05, perLevel: 0.02 },
    ],
    adjacencyBonus: ['militaryBase'],
  },
  {
    id: 'militaryBase',
    name: 'Military Base',
    description: 'Trains ground troops and defenses',
    category: 'military',
    baseCost: { energy: 250, minerals: 400, crystals: 80, darkMatter: 0, food: 50 },
    costMultiplier: 1.15,
    buildTime: 500,
    prerequisites: ['miningPlant'],
    maxLevel: 25,
    energyConsumption: 15,
    effects: [
      { type: 'defenseBonus', value: 0.05, perLevel: 0.03 },
      { type: 'troopCapacity', value: 5, perLevel: 3 },
    ],
    adjacencyBonus: ['shipyard'],
  },
  {
    id: 'researchLab',
    name: 'Research Lab',
    description: 'Conducts scientific research',
    category: 'research',
    baseCost: { energy: 200, minerals: 300, crystals: 150, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 450,
    prerequisites: ['crystalMine'],
    maxLevel: 25,
    energyConsumption: 12,
    effects: [{ type: 'researchSpeed', value: 0.1, perLevel: 0.05 }],
    adjacencyBonus: ['darkMatterLab', 'university'],
  },
  {
    id: 'university',
    name: 'University',
    description: 'Trains scientists for faster research',
    category: 'research',
    baseCost: { energy: 150, minerals: 200, crystals: 200, darkMatter: 10, food: 100 },
    costMultiplier: 1.15,
    buildTime: 700,
    prerequisites: ['researchLab'],
    maxLevel: 20,
    energyConsumption: 10,
    effects: [
      { type: 'researchSpeed', value: 0.08, perLevel: 0.04 },
      { type: 'scientistCapacity', value: 2, perLevel: 1 },
    ],
    adjacencyBonus: ['researchLab'],
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'Increases resource storage capacity',
    category: 'infrastructure',
    baseCost: { energy: 50, minerals: 150, crystals: 30, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 200,
    prerequisites: [],
    maxLevel: 30,
    energyConsumption: 2,
    effects: [{ type: 'storageCapacity', value: 5000, perLevel: 2500 }],
    adjacencyBonus: [],
  },
  {
    id: 'spaceport',
    name: 'Spaceport',
    description: 'Hub for trade and fleet operations',
    category: 'infrastructure',
    baseCost: { energy: 300, minerals: 600, crystals: 150, darkMatter: 10, food: 0 },
    costMultiplier: 1.15,
    buildTime: 800,
    prerequisites: ['shipyard'],
    maxLevel: 20,
    energyConsumption: 25,
    effects: [
      { type: 'tradeIncome', value: 0.1, perLevel: 0.05 },
      { type: 'fleetSupply', value: 15, perLevel: 8 },
    ],
    adjacencyBonus: ['shipyard', 'market'],
  },
  {
    id: 'market',
    name: 'Market',
    description: 'Trade resources with other players',
    category: 'economy',
    baseCost: { energy: 100, minerals: 200, crystals: 100, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 400,
    prerequisites: ['spaceport'],
    maxLevel: 20,
    energyConsumption: 8,
    effects: [
      { type: 'tradeFeeReduction', value: 0.02, perLevel: 0.01 },
      { type: 'marketSlots', value: 3, perLevel: 1 },
    ],
    adjacencyBonus: ['spaceport'],
  },
  {
    id: 'shieldGenerator',
    name: 'Shield Generator',
    description: 'Protects colony from orbital bombardment',
    category: 'military',
    baseCost: { energy: 400, minerals: 300, crystals: 300, darkMatter: 20, food: 0 },
    costMultiplier: 1.15,
    buildTime: 1000,
    prerequisites: ['militaryBase', 'researchLab'],
    maxLevel: 20,
    energyConsumption: 30,
    effects: [{ type: 'planetaryShield', value: 100, perLevel: 50 }],
    adjacencyBonus: ['militaryBase'],
  },
  {
    id: 'missileBattery',
    name: 'Missile Battery',
    description: 'Ground-based anti-orbital defense',
    category: 'military',
    baseCost: { energy: 200, minerals: 350, crystals: 50, darkMatter: 0, food: 0 },
    costMultiplier: 1.15,
    buildTime: 500,
    prerequisites: ['militaryBase'],
    maxLevel: 25,
    energyConsumption: 10,
    effects: [{ type: 'groundDefense', value: 20, perLevel: 12 }],
    adjacencyBonus: ['militaryBase', 'shieldGenerator'],
  },
  {
    id: 'espionageCenter',
    name: 'Espionage Center',
    description: 'Conducts spy operations',
    category: 'military',
    baseCost: { energy: 250, minerals: 200, crystals: 200, darkMatter: 30, food: 0 },
    costMultiplier: 1.15,
    buildTime: 700,
    prerequisites: ['researchLab'],
    maxLevel: 20,
    energyConsumption: 15,
    effects: [
      { type: 'spyCapacity', value: 2, perLevel: 1 },
      { type: 'defenseBonus', value: 0.03, perLevel: 0.02 },
    ],
    adjacencyBonus: ['researchLab'],
  },
  {
    id: 'orbitalDock',
    name: 'Orbital Dock',
    description: 'Repairs and upgrades ships in orbit',
    category: 'orbital',
    baseCost: { energy: 500, minerals: 800, crystals: 200, darkMatter: 15, food: 0 },
    costMultiplier: 1.15,
    buildTime: 1200,
    prerequisites: ['shipyard', 'spaceport'],
    maxLevel: 15,
    energyConsumption: 35,
    effects: [
      { type: 'repairSpeed', value: 0.1, perLevel: 0.05 },
      { type: 'shipUpgradeSpeed', value: 0.08, perLevel: 0.04 },
    ],
    adjacencyBonus: ['shipyard'],
  },
  {
    id: 'sensorArray',
    name: 'Sensor Array',
    description: 'Detects incoming fleets and threats',
    category: 'orbital',
    baseCost: { energy: 300, minerals: 250, crystals: 250, darkMatter: 10, food: 0 },
    costMultiplier: 1.15,
    buildTime: 600,
    prerequisites: ['researchLab'],
    maxLevel: 20,
    energyConsumption: 12,
    effects: [
      { type: 'detectionRange', value: 100, perLevel: 50 },
      { type: 'warningTime', value: 60, perLevel: 30 },
    ],
    adjacencyBonus: ['espionageCenter'],
  },
  {
    id: 'stargate',
    name: 'Stargate',
    description: 'Enables instant fleet travel',
    category: 'orbital',
    baseCost: { energy: 1000, minerals: 1500, crystals: 800, darkMatter: 100, food: 0 },
    costMultiplier: 1.15,
    buildTime: 2400,
    prerequisites: ['orbitalDock', 'sensorArray'],
    maxLevel: 10,
    energyConsumption: 50,
    effects: [
      { type: 'travelSpeedMultiplier', value: 0.2, perLevel: 0.1 },
      { type: 'rangeBonus', value: 500, perLevel: 250 },
    ],
    adjacencyBonus: ['orbitalDock'],
  },
  {
    id: 'galacticExchange',
    name: 'Galactic Exchange',
    description: 'Advanced interstellar trade hub',
    category: 'economy',
    baseCost: { energy: 400, minerals: 600, crystals: 300, darkMatter: 25, food: 0 },
    costMultiplier: 1.15,
    buildTime: 900,
    prerequisites: ['market', 'spaceport'],
    maxLevel: 15,
    energyConsumption: 20,
    effects: [
      { type: 'tradeIncome', value: 0.15, perLevel: 0.08 },
      { type: 'tradeFeeReduction', value: 0.03, perLevel: 0.015 },
    ],
    adjacencyBonus: ['market', 'spaceport'],
  },
] as const;

export const SHIPS: readonly ShipConfig[] = [
  {
    id: 'lightFighter',
    name: 'Light Fighter',
    tier: 1,
    stats: { attack: 10, defense: 5, shield: 2, hull: 20, speed: 8, cargo: 0 },
    fuelCost: 5,
    buildTime: 100,
    buildCost: { energy: 20, minerals: 50, crystals: 10, darkMatter: 0, food: 0 },
    counterType: 'cruiser',
    specialAbility: null,
    supplyCost: 1,
  },
  {
    id: 'heavyFighter',
    name: 'Heavy Fighter',
    tier: 1,
    stats: { attack: 18, defense: 10, shield: 5, hull: 40, speed: 6, cargo: 0 },
    fuelCost: 10,
    buildTime: 180,
    buildCost: { energy: 40, minerals: 100, crystals: 25, darkMatter: 0, food: 0 },
    counterType: 'lightCruiser',
    specialAbility: null,
    supplyCost: 2,
  },
  {
    id: 'cruiser',
    name: 'Cruiser',
    tier: 2,
    stats: { attack: 40, defense: 25, shield: 15, hull: 80, speed: 5, cargo: 0 },
    fuelCost: 25,
    buildTime: 400,
    buildCost: { energy: 100, minerals: 250, crystals: 80, darkMatter: 5, food: 0 },
    counterType: 'battleship',
    specialAbility: 'intercept',
    supplyCost: 4,
  },
  {
    id: 'lightCruiser',
    name: 'Light Cruiser',
    tier: 2,
    stats: { attack: 25, defense: 15, shield: 10, hull: 55, speed: 7, cargo: 0 },
    fuelCost: 15,
    buildTime: 280,
    buildCost: { energy: 60, minerals: 150, crystals: 50, darkMatter: 0, food: 0 },
    counterType: 'heavyFighter',
    specialAbility: null,
    supplyCost: 3,
  },
  {
    id: 'battleship',
    name: 'Battleship',
    tier: 3,
    stats: { attack: 80, defense: 50, shield: 40, hull: 150, speed: 3, cargo: 0 },
    fuelCost: 60,
    buildTime: 800,
    buildCost: { energy: 250, minerals: 600, crystals: 200, darkMatter: 20, food: 0 },
    counterType: 'lightFighter',
    specialAbility: 'bombardment',
    supplyCost: 8,
  },
  {
    id: 'battleCruiser',
    name: 'Battle Cruiser',
    tier: 3,
    stats: { attack: 65, defense: 40, shield: 35, hull: 120, speed: 4, cargo: 0 },
    fuelCost: 45,
    buildTime: 650,
    buildCost: { energy: 200, minerals: 450, crystals: 150, darkMatter: 15, food: 0 },
    counterType: 'dreadnought',
    specialAbility: 'energyDrain',
    supplyCost: 6,
  },
  {
    id: 'dreadnought',
    name: 'Dreadnought',
    tier: 4,
    stats: { attack: 150, defense: 100, shield: 80, hull: 300, speed: 2, cargo: 0 },
    fuelCost: 150,
    buildTime: 1600,
    buildCost: { energy: 600, minerals: 1500, crystals: 500, darkMatter: 80, food: 0 },
    counterType: 'battleCruiser',
    specialAbility: 'massiveBarrage',
    supplyCost: 15,
  },
  {
    id: 'carrier',
    name: 'Carrier',
    tier: 4,
    stats: { attack: 40, defense: 60, shield: 50, hull: 250, speed: 2, cargo: 0 },
    fuelCost: 120,
    buildTime: 1400,
    buildCost: { energy: 500, minerals: 1200, crystals: 400, darkMatter: 60, food: 0 },
    counterType: 'stealthBomber',
    specialAbility: 'launchFighters',
    supplyCost: 12,
  },
  {
    id: 'stealthBomber',
    name: 'Stealth Bomber',
    tier: 4,
    stats: { attack: 120, defense: 30, shield: 20, hull: 80, speed: 6, cargo: 0 },
    fuelCost: 80,
    buildTime: 1000,
    buildCost: { energy: 350, minerals: 800, crystals: 300, darkMatter: 50, food: 0 },
    counterType: 'destroyer',
    specialAbility: 'stealth',
    supplyCost: 8,
  },
  {
    id: 'destroyer',
    name: 'Destroyer',
    tier: 3,
    stats: { attack: 55, defense: 35, shield: 25, hull: 90, speed: 5, cargo: 0 },
    fuelCost: 35,
    buildTime: 500,
    buildCost: { energy: 150, minerals: 350, crystals: 100, darkMatter: 10, food: 0 },
    counterType: 'cruiser',
    specialAbility: 'antiMissile',
    supplyCost: 5,
  },
  {
    id: 'frigate',
    name: 'Frigate',
    tier: 2,
    stats: { attack: 30, defense: 20, shield: 12, hull: 60, speed: 6, cargo: 0 },
    fuelCost: 20,
    buildTime: 300,
    buildCost: { energy: 80, minerals: 180, crystals: 60, darkMatter: 0, food: 0 },
    counterType: 'lightCruiser',
    specialAbility: 'patrol',
    supplyCost: 3,
  },
  {
    id: 'corvette',
    name: 'Corvette',
    tier: 1,
    stats: { attack: 8, defense: 4, shield: 1, hull: 15, speed: 9, cargo: 0 },
    fuelCost: 3,
    buildTime: 80,
    buildCost: { energy: 15, minerals: 35, crystals: 5, darkMatter: 0, food: 0 },
    counterType: 'lightFighter',
    specialAbility: 'scout',
    supplyCost: 1,
  },
  {
    id: 'troopTransport',
    name: 'Troop Transport',
    tier: 2,
    stats: { attack: 5, defense: 10, shield: 5, hull: 40, speed: 4, cargo: 0 },
    fuelCost: 30,
    buildTime: 350,
    buildCost: { energy: 70, minerals: 200, crystals: 30, darkMatter: 0, food: 50 },
    counterType: 'cruiser',
    specialAbility: 'transportTroops',
    supplyCost: 4,
  },
  {
    id: 'recycler',
    name: 'Recycler',
    tier: 1,
    stats: { attack: 2, defense: 8, shield: 3, hull: 30, speed: 3, cargo: 0 },
    fuelCost: 15,
    buildTime: 250,
    buildCost: { energy: 30, minerals: 120, crystals: 20, darkMatter: 0, food: 0 },
    counterType: 'none',
    specialAbility: 'salvage',
    supplyCost: 2,
  },
  {
    id: 'espionageProbe',
    name: 'Espionage Probe',
    tier: 1,
    stats: { attack: 0, defense: 1, shield: 0, hull: 5, speed: 12, cargo: 0 },
    fuelCost: 2,
    buildTime: 50,
    buildCost: { energy: 10, minerals: 20, crystals: 15, darkMatter: 0, food: 0 },
    counterType: 'none',
    specialAbility: 'spy',
    supplyCost: 0,
  },
  {
    id: 'colonyShip',
    name: 'Colony Ship',
    tier: 3,
    stats: { attack: 0, defense: 5, shield: 5, hull: 50, speed: 2, cargo: 0 },
    fuelCost: 200,
    buildTime: 2000,
    buildCost: { energy: 500, minerals: 1000, crystals: 300, darkMatter: 50, food: 200 },
    counterType: 'none',
    specialAbility: 'colonize',
    supplyCost: 0,
  },
  {
    id: 'terraformer',
    name: 'Terraformer',
    tier: 4,
    stats: { attack: 0, defense: 10, shield: 10, hull: 80, speed: 1, cargo: 0 },
    fuelCost: 300,
    buildTime: 3000,
    buildCost: { energy: 800, minerals: 1500, crystals: 600, darkMatter: 100, food: 300 },
    counterType: 'none',
    specialAbility: 'terraform',
    supplyCost: 0,
  },
  {
    id: 'starfighter',
    name: 'Starfighter',
    tier: 2,
    stats: { attack: 35, defense: 18, shield: 14, hull: 50, speed: 8, cargo: 0 },
    fuelCost: 18,
    buildTime: 320,
    buildCost: { energy: 75, minerals: 200, crystals: 70, darkMatter: 5, food: 0 },
    counterType: 'battleCruiser',
    specialAbility: 'strafe',
    supplyCost: 3,
  },
  {
    id: 'interceptor',
    name: 'Interceptor',
    tier: 1,
    stats: { attack: 12, defense: 6, shield: 3, hull: 25, speed: 10, cargo: 0 },
    fuelCost: 7,
    buildTime: 120,
    buildCost: { energy: 25, minerals: 60, crystals: 15, darkMatter: 0, food: 0 },
    counterType: 'frigate',
    specialAbility: 'intercept',
    supplyCost: 1,
  },
  {
    id: 'commandShip',
    name: 'Command Ship',
    tier: 5,
    stats: { attack: 200, defense: 150, shield: 120, hull: 500, speed: 3, cargo: 0 },
    fuelCost: 250,
    buildTime: 3600,
    buildCost: { energy: 1500, minerals: 3000, crystals: 1200, darkMatter: 200, food: 0 },
    counterType: 'none',
    specialAbility: 'fleetCommand',
    supplyCost: 25,
  },
  {
    id: 'superDreadnought',
    name: 'Super Dreadnought',
    tier: 5,
    stats: { attack: 350, defense: 200, shield: 160, hull: 700, speed: 1, cargo: 0 },
    fuelCost: 400,
    buildTime: 5400,
    buildCost: { energy: 3000, minerals: 6000, crystals: 2500, darkMatter: 400, food: 0 },
    counterType: 'commandShip',
    specialAbility: 'devastation',
    supplyCost: 40,
  },
  {
    id: 'quantumDestroyer',
    name: 'Quantum Destroyer',
    tier: 5,
    stats: { attack: 280, defense: 120, shield: 100, hull: 400, speed: 4, cargo: 0 },
    fuelCost: 200,
    buildTime: 4200,
    buildCost: { energy: 2200, minerals: 4500, crystals: 1800, darkMatter: 300, food: 0 },
    counterType: 'superDreadnought',
    specialAbility: 'quantumStrike',
    supplyCost: 30,
  },
  {
    id: 'plasmaFrigate',
    name: 'Plasma Frigate',
    tier: 3,
    stats: { attack: 70, defense: 30, shield: 28, hull: 70, speed: 6, cargo: 0 },
    fuelCost: 30,
    buildTime: 450,
    buildCost: { energy: 130, minerals: 300, crystals: 120, darkMatter: 8, food: 0 },
    counterType: 'carrier',
    specialAbility: 'plasmaBurn',
    supplyCost: 5,
  },
  {
    id: 'ionCruiser',
    name: 'Ion Cruiser',
    tier: 2,
    stats: { attack: 28, defense: 22, shield: 18, hull: 65, speed: 5, cargo: 0 },
    fuelCost: 22,
    buildTime: 350,
    buildCost: { energy: 90, minerals: 220, crystals: 90, darkMatter: 5, food: 0 },
    counterType: 'stealthBomber',
    specialAbility: 'ionDisable',
    supplyCost: 3,
  },
  {
    id: 'warpBomber',
    name: 'Warp Bomber',
    tier: 4,
    stats: { attack: 140, defense: 45, shield: 30, hull: 100, speed: 5, cargo: 0 },
    fuelCost: 90,
    buildTime: 1200,
    buildCost: { energy: 400, minerals: 900, crystals: 350, darkMatter: 55, food: 0 },
    counterType: 'quantumDestroyer',
    specialAbility: 'warpStrike',
    supplyCost: 10,
  },
] as const;

export const RESEARCH: readonly ResearchConfig[] = [
  {
    id: 'energyTech',
    name: 'Energy Technology',
    description: 'Improves energy production efficiency',
    category: 'energy',
    baseCost: { energy: 0, minerals: 200, crystals: 100, darkMatter: 0, food: 0 },
    baseTime: 300,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: 0,
        minerals: Math.floor(200 * Math.pow(1.3, i)),
        crystals: Math.floor(100 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(300 * Math.pow(1.5, i)),
      effects: [{ type: 'energyProductionBonus', value: 0.05 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'miningTech',
    name: 'Mining Technology',
    description: 'Improves mineral extraction rates',
    category: 'minerals',
    baseCost: { energy: 100, minerals: 0, crystals: 80, darkMatter: 0, food: 0 },
    baseTime: 350,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(100 * Math.pow(1.3, i)),
        minerals: 0,
        crystals: Math.floor(80 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(350 * Math.pow(1.5, i)),
      effects: [{ type: 'mineralProductionBonus', value: 0.05 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'crystalTech',
    name: 'Crystal Processing',
    description: 'Enhances crystal harvesting technology',
    category: 'crystals',
    baseCost: { energy: 150, minerals: 100, crystals: 0, darkMatter: 0, food: 0 },
    baseTime: 400,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(150 * Math.pow(1.3, i)),
        minerals: Math.floor(100 * Math.pow(1.3, i)),
        crystals: 0,
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(400 * Math.pow(1.5, i)),
      effects: [{ type: 'crystalProductionBonus', value: 0.05 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'darkMatterTech',
    name: 'Dark Matter Research',
    description: 'Unlocks advanced dark matter manipulation',
    category: 'darkMatter',
    baseCost: { energy: 300, minerals: 200, crystals: 200, darkMatter: 0, food: 0 },
    baseTime: 800,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [{ techId: 'energyTech', level: 3 }],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(300 * Math.pow(1.3, i)),
        minerals: Math.floor(200 * Math.pow(1.3, i)),
        crystals: Math.floor(200 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(800 * Math.pow(1.5, i)),
      effects: [{ type: 'darkMatterProductionBonus', value: 0.08 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'hullTech',
    name: 'Hull Technology',
    description: 'Increases ship hull strength',
    category: 'military',
    baseCost: { energy: 200, minerals: 300, crystals: 50, darkMatter: 0, food: 0 },
    baseTime: 500,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(200 * Math.pow(1.3, i)),
        minerals: Math.floor(300 * Math.pow(1.3, i)),
        crystals: Math.floor(50 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(500 * Math.pow(1.5, i)),
      effects: [{ type: 'hullBonus', value: 0.05 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'shieldTech',
    name: 'Shield Technology',
    description: 'Improves ship shield effectiveness',
    category: 'military',
    baseCost: { energy: 250, minerals: 200, crystals: 150, darkMatter: 0, food: 0 },
    baseTime: 600,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [{ techId: 'hullTech', level: 2 }],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(250 * Math.pow(1.3, i)),
        minerals: Math.floor(200 * Math.pow(1.3, i)),
        crystals: Math.floor(150 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(600 * Math.pow(1.5, i)),
      effects: [{ type: 'shieldBonus', value: 0.06 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'weaponTech',
    name: 'Weapon Technology',
    description: 'Increases ship attack power',
    category: 'military',
    baseCost: { energy: 200, minerals: 250, crystals: 100, darkMatter: 0, food: 0 },
    baseTime: 550,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(200 * Math.pow(1.3, i)),
        minerals: Math.floor(250 * Math.pow(1.3, i)),
        crystals: Math.floor(100 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(550 * Math.pow(1.5, i)),
      effects: [{ type: 'attackBonus', value: 0.05 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'driveTech',
    name: 'Drive Technology',
    description: 'Improves fleet speed and fuel efficiency',
    category: 'mobility',
    baseCost: { energy: 180, minerals: 150, crystals: 120, darkMatter: 0, food: 0 },
    baseTime: 450,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(180 * Math.pow(1.3, i)),
        minerals: Math.floor(150 * Math.pow(1.3, i)),
        crystals: Math.floor(120 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(450 * Math.pow(1.5, i)),
      effects: [
        { type: 'speedBonus', value: 0.04 * (i + 1), perLevel: 0 },
        { type: 'fuelEfficiency', value: 0.03 * (i + 1), perLevel: 0 },
      ],
    })),
  },
  {
    id: 'espionageTech',
    name: 'Espionage Technology',
    description: 'Enhances spy capabilities and detection',
    category: 'espionage',
    baseCost: { energy: 200, minerals: 100, crystals: 200, darkMatter: 10, food: 0 },
    baseTime: 700,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [{ techId: 'energyTech', level: 2 }],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(200 * Math.pow(1.3, i)),
        minerals: Math.floor(100 * Math.pow(1.3, i)),
        crystals: Math.floor(200 * Math.pow(1.3, i)),
        darkMatter: Math.floor(10 * Math.pow(1.3, i)),
        food: 0,
      },
      time: Math.floor(700 * Math.pow(1.5, i)),
      effects: [
        { type: 'spySuccessChance', value: 0.05 * (i + 1), perLevel: 0 },
        { type: 'detectionBonus', value: 0.04 * (i + 1), perLevel: 0 },
      ],
    })),
  },
  {
    id: 'tradeTech',
    name: 'Trade Technology',
    description: 'Reduces market fees and increases trade income',
    category: 'economy',
    baseCost: { energy: 150, minerals: 200, crystals: 150, darkMatter: 0, food: 0 },
    baseTime: 400,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(150 * Math.pow(1.3, i)),
        minerals: Math.floor(200 * Math.pow(1.3, i)),
        crystals: Math.floor(150 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(400 * Math.pow(1.5, i)),
      effects: [
        { type: 'tradeFeeReduction', value: 0.02 * (i + 1), perLevel: 0 },
        { type: 'tradeIncomeBonus', value: 0.03 * (i + 1), perLevel: 0 },
      ],
    })),
  },
  {
    id: 'agricultureTech',
    name: 'Agriculture Technology',
    description: 'Boosts food production and colony growth',
    category: 'economy',
    baseCost: { energy: 100, minerals: 150, crystals: 50, darkMatter: 0, food: 0 },
    baseTime: 300,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(100 * Math.pow(1.3, i)),
        minerals: Math.floor(150 * Math.pow(1.3, i)),
        crystals: Math.floor(50 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(300 * Math.pow(1.5, i)),
      effects: [{ type: 'foodProductionBonus', value: 0.06 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'astroArchitecture',
    name: 'Astro-Architecture',
    description: 'Reduces building costs and construction time',
    category: 'infrastructure',
    baseCost: { energy: 200, minerals: 300, crystals: 100, darkMatter: 0, food: 0 },
    baseTime: 600,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [{ techId: 'miningTech', level: 2 }],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(200 * Math.pow(1.3, i)),
        minerals: Math.floor(300 * Math.pow(1.3, i)),
        crystals: Math.floor(100 * Math.pow(1.3, i)),
        darkMatter: 0,
        food: 0,
      },
      time: Math.floor(600 * Math.pow(1.5, i)),
      effects: [
        { type: 'buildingCostReduction', value: 0.03 * (i + 1), perLevel: 0 },
        { type: 'buildSpeedBonus', value: 0.04 * (i + 1), perLevel: 0 },
      ],
    })),
  },
  {
    id: 'quantumPhysics',
    name: 'Quantum Physics',
    description: 'Unlocks advanced ship technologies',
    category: 'advanced',
    baseCost: { energy: 400, minerals: 300, crystals: 400, darkMatter: 30, food: 0 },
    baseTime: 1200,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [
      { techId: 'weaponTech', level: 5 },
      { techId: 'shieldTech', level: 5 },
    ],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(400 * Math.pow(1.3, i)),
        minerals: Math.floor(300 * Math.pow(1.3, i)),
        crystals: Math.floor(400 * Math.pow(1.3, i)),
        darkMatter: Math.floor(30 * Math.pow(1.3, i)),
        food: 0,
      },
      time: Math.floor(1200 * Math.pow(1.5, i)),
      effects: [{ type: 'advancedShipUnlock', value: 1, perLevel: 0 }],
    })),
  },
  {
    id: 'wormholeTech',
    name: 'Wormhole Technology',
    description: 'Enables instant fleet travel across the galaxy',
    category: 'advanced',
    baseCost: { energy: 800, minerals: 500, crystals: 600, darkMatter: 100, food: 0 },
    baseTime: 2400,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 5,
    prerequisites: [
      { techId: 'quantumPhysics', level: 5 },
      { techId: 'darkMatterTech', level: 5 },
    ],
    levels: Array.from({ length: 5 }, (_, i) => ({
      cost: {
        energy: Math.floor(800 * Math.pow(1.3, i)),
        minerals: Math.floor(500 * Math.pow(1.3, i)),
        crystals: Math.floor(600 * Math.pow(1.3, i)),
        darkMatter: Math.floor(100 * Math.pow(1.3, i)),
        food: 0,
      },
      time: Math.floor(2400 * Math.pow(1.5, i)),
      effects: [{ type: 'wormholeRange', value: 1000 * (i + 1), perLevel: 0 }],
    })),
  },
  {
    id: 'fleetCommandTech',
    name: 'Fleet Command',
    description: 'Increases maximum fleet supply and coordination',
    category: 'military',
    baseCost: { energy: 300, minerals: 400, crystals: 200, darkMatter: 20, food: 0 },
    baseTime: 800,
    costMultiplier: 1.3,
    timeMultiplier: 1.5,
    maxLevel: 10,
    prerequisites: [{ techId: 'weaponTech', level: 3 }],
    levels: Array.from({ length: 10 }, (_, i) => ({
      cost: {
        energy: Math.floor(300 * Math.pow(1.3, i)),
        minerals: Math.floor(400 * Math.pow(1.3, i)),
        crystals: Math.floor(200 * Math.pow(1.3, i)),
        darkMatter: Math.floor(20 * Math.pow(1.3, i)),
        food: 0,
      },
      time: Math.floor(800 * Math.pow(1.5, i)),
      effects: [{ type: 'fleetSupplyBonus', value: 0.08 * (i + 1), perLevel: 0 }],
    })),
  },
] as const;

export const COMBAT: CombatConfig = {
  baseCritChance: 0.05,
  critDamageMin: 1.5,
  critDamageMax: 2.5,
  evasionBase: 0.05,
  evasionPerSpeed: 0.005,
  shieldRegenRate: 0.1,
  maxRounds: 10,
  retreatChanceBase: 0.1,
} as const;

export const MARKET: MarketConfig = {
  transactionFee: 0.02,
  priceUpdateInterval: 60,
  demandMultiplier: 1.5,
  supplyMultiplier: 0.7,
  inflationBase: 1.0,
  inflationPerTrade: 0.001,
} as const;

export const ALLIANCE: AllianceConfig = {
  maxMembers: 50,
  techShareBonus: 0.1,
  bankTaxRate: 0.05,
  warCooldown: 86400,
  warDuration: 604800,
} as const;

export const TURNS: TurnConfig = {
  turnsPerMinute: 6,
  maxStoredTurns: 1000,
  offlineAccrualHours: 24,
  baseCost: 1,
  buildQueueMax: 5,
  darkMatterSpeedUpMultiplier: 2.0,
} as const;

export const SEASONS: readonly SeasonConfig[] = [
  {
    id: 'season1',
    name: 'Rise of the Empire',
    durationWeeks: 10,
    currency: 'Galactic Tokens',
    maxTiers: 100,
    techTree: ['quantumBattleship', 'darkEnergyShield', 'plasmaCannon', 'warpDrive'],
    rewards: Array.from({ length: 100 }, (_, i) => ({
      tier: i + 1,
      type: (i % 3 === 0 ? 'premium' : 'free') as SeasonTier,
      reward: i % 10 === 0 ? 'skin' : i % 5 === 0 ? 'title' : 'resource',
      value: i % 10 === 0 ? Math.floor(i / 10) + 1 : (i + 1) * 100,
    })),
  },
  {
    id: 'season2',
    name: 'Galactic Conquest',
    durationWeeks: 12,
    currency: 'Galactic Tokens',
    maxTiers: 100,
    techTree: ['stellarCannon', 'nanoRepair', 'gravitonField', 'hyperlasers'],
    rewards: Array.from({ length: 100 }, (_, i) => ({
      tier: i + 1,
      type: (i % 3 === 0 ? 'premium' : 'free') as SeasonTier,
      reward: i % 10 === 0 ? 'border' : i % 5 === 0 ? 'emote' : 'resource',
      value: i % 10 === 0 ? Math.floor(i / 10) + 1 : (i + 1) * 150,
    })),
  },
] as const;

export const PRESTIGE: readonly PrestigeLevel[] = [
  { level: 1, requirement: 3, unlock: "Prestige 1 Bonus", cosmeticId: "prestige_cosmetic_1" },
  { level: 2, requirement: 6, unlock: "Prestige 2 Bonus", cosmeticId: "prestige_cosmetic_2" },
  { level: 3, requirement: 9, unlock: "Prestige 3 Bonus", cosmeticId: "prestige_cosmetic_3" },
  { level: 4, requirement: 12, unlock: "Prestige 4 Bonus", cosmeticId: "prestige_cosmetic_4" },
  { level: 5, requirement: 15, unlock: "Prestige 5 Bonus", cosmeticId: "prestige_cosmetic_5" },
  { level: 6, requirement: 18, unlock: "Prestige 6 Bonus", cosmeticId: "prestige_cosmetic_6" },
  { level: 7, requirement: 21, unlock: "Prestige 7 Bonus", cosmeticId: "prestige_cosmetic_7" },
  { level: 8, requirement: 24, unlock: "Prestige 8 Bonus", cosmeticId: "prestige_cosmetic_8" },
  { level: 9, requirement: 27, unlock: "Prestige 9 Bonus", cosmeticId: "prestige_cosmetic_9" },
  { level: 10, requirement: 30, unlock: "Prestige 10 Bonus", cosmeticId: "prestige_cosmetic_10" },
];

export const BUILD_QUEUE = {
  MAX_PARALLEL: TURNS.buildQueueMax,
  SPEED_UP_COST: 5,
  SPEED_UP_MULTIPLIER: TURNS.darkMatterSpeedUpMultiplier,
} as const;

export const COMBAT_FORMULAS = {
  DAMAGE: (attack: number, defense: number) =>
    attack * (1 - defense / (defense + 200)) * (0.85 + Math.random() * 0.3),
  SHIELD_ABSORPTION: (shield: number, penetration: number) =>
    shield * (1 - penetration),
  EVASION_CHANCE: (speed: number) =>
    COMBAT.evasionBase + speed * COMBAT.evasionPerSpeed,
  CRIT_CHANCE: (bonusCrit: number) =>
    COMBAT.baseCritChance + bonusCrit,
  CRIT_MULTIPLIER: () =>
    COMBAT.critDamageMin + Math.random() * (COMBAT.critDamageMax - COMBAT.critDamageMin),
} as const;

export const GOVERNMENT_BONUSES: Record<GovernmentType, Record<string, number>> = {
  democracy: { researchSpeed: 0.1, tradeIncome: 0.05, happiness: 0.1 },
  oligarchy: { energyProduction: 0.15, mineralProduction: 0.1, tradeIncome: 0.1 },
  dictatorship: { buildSpeed: 0.1, militaryPower: 0.15, happiness: -0.05 },
  theocracy: { darkMatterProduction: 0.2, researchSpeed: 0.05, happiness: 0.05 },
  anarchy: { allProduction: -0.3, buildSpeed: -0.2, militaryPower: -0.1 },
} as const;

export const ADJACENCY_BONUS_MULTIPLIER = 0.1;

export const FLEET_SUPPLY_PER_SHIPYARD_LEVEL = 10;
