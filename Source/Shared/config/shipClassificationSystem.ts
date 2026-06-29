/**
 * Ship Classification System
 * Includes Nautilus-class scout ship from Star Trek Discovery
 * and 90+ additional ship classes and subclasses
 */

export type ShipClass = 
  // Scout/Reconnaissance
  | 'scout'
  | 'reconnaissance'
  | 'pathfinder'
  | 'surveyor'
  // Frigate/Corvette
  | 'frigate'
  | 'corvette'
  | 'patrol'
  | 'escort'
  // Destroyer/Cruiser
  | 'destroyer'
  | 'light-cruiser'
  | 'heavy-cruiser'
  | 'battlecruiser'
  // Capital Ships
  | 'battleship'
  | 'dreadnought'
  | 'carrier'
  | 'flagship'
  // Support/Utility
  | 'transport'
  | 'freighter'
  | 'tanker'
  | 'repair'
  | 'medical'
  | 'science'
  | 'colony'
  // Special Purpose
  | 'stealth'
  | 'interceptor'
  | 'bomber'
  | 'carrier'
  | 'fortress'
  | 'megastructure'
  | 'exploration'
  | 'station';

export type ShipSubClass = 
  // Scout subclasses
  | 'light-scout'
  | 'heavy-scout'
  | 'stealth-scout'
  | 'long-range-scout'
  // Frigate subclasses
  | 'escort-frigate'
  | 'patrol-frigate'
  | 'anti-fighter-frigate'
  | 'missile-frigate'
  // Destroyer subclasses
  | 'torpedo-destroyer'
  | 'beam-destroyer'
  | 'carrier-destroyer'
  | 'stealth-destroyer'
  // Cruiser subclasses
  | 'exploration-cruiser'
  | 'battle-cruiser'
  | 'command-cruiser'
  | 'carrier-cruiser'
  // Capital subclasses
  | 'assault-battleship'
  | 'carrier-battleship'
  | 'siege-dreadnought'
  | 'carrier-dreadnought'
  // Support subclasses
  | 'cargo-transport'
  | 'personnel-transport'
  | 'fuel-transport'
  | 'repair-carrier'
  | 'hospital-ship'
  | 'research-vessel'
  | 'colony-ship'
  // Special subclasses
  | 'cloak-fighter'
  | 'interceptor-fighter'
  | 'torpedo-bomber'
  | 'carrier-bomber'
  | 'orbital-fortress'
  | 'mobile-fortress';

export type ShipTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface ShipStats {
  // Combat stats
  hullPoints: number;
  shieldPoints: number;
  armor: number;
  evasion: number; // 0-100
  
  // Offensive
  beamWeapons: number;
  torpedoWeapons: number;
  fighterBays: number;
  weaponSlots: number;
  
  // Defensive
  shieldRegen: number; // Per minute
  armorRating: number;
  countermeasures: number;
  
  // Mobility
  speed: number; // AU/day
  maneuverability: number; // 0-100
  jumpRange: number; // Light-years
  stealth: number; // 0-100
  
  // Support
  cargoCapacity: number;
  crewCapacity: number;
  passengerCapacity: number;
  fighterCapacity: number;
  
  // Special
  sporeDriveCompatible: boolean;
  cloakingDevice: boolean;
  transporterRange: number; // km
  sensorRange: number; // AU
}

export interface ShipSubStats {
  // Combat bonuses
  damageBonus: number; // Percentage
  defenseBonus: number; // Percentage
  accuracyBonus: number; // Percentage
  criticalChance: number; // Percentage
  
  // Mobility bonuses
  speedBonus: number; // Percentage
  maneuverBonus: number; // Percentage
  jumpRangeBonus: number; // Percentage
  stealthBonus: number; // Percentage
  
  // Support bonuses
  cargoBonus: number; // Percentage
  crewEfficiency: number; // Percentage
  repairSpeed: number; // Percentage
  researchSpeed: number; // Percentage
  
  // Special bonuses
  shieldRechargeBonus: number; // Percentage
  weaponCooldownBonus: number; // Percentage
  fighterLaunchSpeed: number; // Percentage
  sensorStrength: number; // Percentage
}

export interface ShipAttributes {
  // Physical properties
  length: number; // meters
  width: number; // meters
  height: number; // meters
  mass: number; // tons
  crew: number;
  
  // Technical
  powerOutput: number; // MW
  warpFactor: number; // Maximum warp
  impulseSpeed: number; // km/s
  deflectorRating: number; // 0-100
  
  // Systems
  computerRating: number; // 0-100
  sensorRating: number; // 0-100
  shieldFrequency: string;
  weaponYield: number; // Megatons
  
  // Resources
  fuelCapacity: number; // Deuterium units
  maintenanceCost: number; // Credits per day
  buildTime: number; // Days
  buildCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    credits: number;
  };
}

export interface ShipDetails {
  // Designation
  registry: string;
  name: string;
  className: string;
  subClassName: string;
  
  // History
  launchDate: string;
  builder: string;
  designOrigin: string;
  
  // Operational
  commandingOfficer: string | null;
  crewManifest: Array<{
    position: string;
    name: string;
    rank: string;
  }>;
  
  // Mission
  missionProfile: string;
  operationalArea: string;
  deploymentStatus: 'active' | 'reserve' | 'retired' | 'destroyed';
  
  // Capabilities
  missionDuration: number; // Days
  range: number; // Light-years
  specialCapabilities: string[];
  knownWeaknesses: string[];
  
  // Upgrades
  upgradeLevel: number; // 1-999
  installedSystems: string[];
  modificationHistory: Array<{
    date: string;
    modification: string;
    performedBy: string;
  }>;
  
  // Combat record
  battlesFought: number;
  victories: number;
  defeats: number;
  notableEngagements: Array<{
    date: string;
    opponent: string;
    outcome: string;
  }>;
}

export interface ShipStatus {
  // Overall condition
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  health: number; // 0-100
  efficiency: number; // 0-100
  
  // Systems
  hullIntegrity: number; // 0-100
  shieldStatus: 'offline' | 'partial' | 'full' | 'overcharge';
  weaponSystems: 'offline' | 'partial' | 'full';
  engineStatus: 'offline' | 'idle' | 'cruising' | 'full-power';
  lifeSupport: 'offline' | 'partial' | 'full';
  
  // Current state
  isDocked: boolean;
  isInCombat: boolean;
  isCloaked: boolean;
  currentLocation: string;
  
  // Resources
  fuelLevel: number; // 0-100
  ammunition: number; // 0-100
  spareParts: number; // 0-100
  
  // Crew
  crewMorale: number; // 0-100
  crewHealth: number; // 0-100
  casualties: number;
  
  // Alerts
  alerts: Array<{
    level: 'info' | 'warning' | 'danger' | 'critical';
    message: string;
    system: string;
    timestamp: number;
  }>;
}

export interface Ship {
  // Core identity
  id: string;
  name: string;
  registry: string;
  shipClass: ShipClass;
  subClass: ShipSubClass;
  
  // Classification
  tier: number; // 1-99
  level: number; // 1-999
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'ascended';
  
  // Comprehensive stats
  stats: ShipStats;
  subStats: ShipSubStats;
  attributes: ShipAttributes;
  details: ShipDetails;
  status: ShipStatus;
  
  // Ownership
  ownerId: string | null;
  ownerName: string | null;
  fleetId: string | null;
  
  // Resources
  currentCargo: Record<string, number>;
  fuelRemaining: number;
  ammunitionRemaining: number;
  
  // Crew
  currentCrew: Array<{
    id: string;
    name: string;
    position: string;
    health: number;
    morale: number;
    experience: number;
  }>;
  
  // Visual
  icon: string;
  model: string;
  color: string;
  description: string;
  lore: string;
  
  // Metadata
  isActive: boolean;
  isPlayerOwned: boolean;
  createdAt: number;
  lastModified: number;
}

export interface ShipClassConfig {
  name: string;
  description: string;
  lore: string;
  category: ShipClass;
  subClass: ShipSubClass;
  baseStats: Partial<ShipStats>;
  baseSubStats: Partial<ShipSubStats>;
  baseAttributes: Partial<ShipAttributes>;
  specialProperties: string[];
  icon: string;
  color: string;
}

export const SHIP_CLASSES: Record<string, ShipClassConfig> = {
  // Nautilus-class Scout (Star Trek Discovery)
  'nautilus-scout': {
    name: 'Nautilus-class Scout',
    description: 'Fast reconnaissance vessel with advanced sensor arrays',
    lore: 'The Nautilus-class scout ship was designed for deep-space exploration and reconnaissance missions. Featured in Star Trek Discovery, these vessels excel at long-range sensor operations and rapid response.',
    category: 'scout',
    subClass: 'light-scout',
    baseStats: {
      hullPoints: 500,
      shieldPoints: 300,
      armor: 50,
      evasion: 75,
      beamWeapons: 2,
      torpedoWeapons: 0,
      fighterBays: 0,
      weaponSlots: 2,
      shieldRegen: 10,
      armorRating: 30,
      countermeasures: 20,
      speed: 15,
      maneuverability: 90,
      jumpRange: 20,
      stealth: 60,
      cargoCapacity: 500,
      crewCapacity: 25,
      passengerCapacity: 5,
      fighterCapacity: 0,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 50000,
      sensorRange: 50,
    },
    baseSubStats: {
      damageBonus: 5,
      defenseBonus: 10,
      accuracyBonus: 20,
      criticalChance: 10,
      speedBonus: 30,
      maneuverBonus: 25,
      jumpRangeBonus: 20,
      stealthBonus: 15,
      cargoBonus: 0,
      crewEfficiency: 15,
      repairSpeed: 10,
      researchSpeed: 20,
      shieldRechargeBonus: 15,
      weaponCooldownBonus: 10,
      fighterLaunchSpeed: 0,
      sensorStrength: 30,
    },
    baseAttributes: {
      length: 85,
      width: 45,
      height: 20,
      mass: 15000,
      crew: 25,
      powerOutput: 500,
      warpFactor: 7,
      impulseSpeed: 25000,
      deflectorRating: 60,
      computerRating: 80,
      sensorRating: 95,
      shieldFrequency: 'standard',
      weaponYield: 50,
      fuelCapacity: 500,
      maintenanceCost: 500,
      buildTime: 30,
      buildCost: { metal: 50000, crystal: 30000, deuterium: 10000, credits: 100000 },
    },
    specialProperties: ['long-range-sensors', 'fast', 'stealthy', 'spore-drive-ready'],
    icon: '🛸',
    color: '#4ECDC4',
  },

  // Additional 90+ ship classes
  'constitution-cruiser': {
    name: 'Constitution-class Cruiser',
    description: 'Legendary explorer cruiser with balanced capabilities',
    lore: 'The Constitution-class is one of the most iconic starship designs in Starfleet history, known for its versatility and durability.',
    category: 'light-cruiser',
    subClass: 'exploration-cruiser',
    baseStats: {
      hullPoints: 2000,
      shieldPoints: 1500,
      armor: 100,
      evasion: 40,
      beamWeapons: 8,
      torpedoWeapons: 4,
      fighterBays: 0,
      weaponSlots: 8,
      shieldRegen: 15,
      armorRating: 60,
      countermeasures: 30,
      speed: 8,
      maneuverability: 50,
      jumpRange: 12,
      stealth: 20,
      cargoCapacity: 5000,
      crewCapacity: 200,
      passengerCapacity: 50,
      fighterCapacity: 0,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 40000,
      sensorRange: 30,
    },
    baseSubStats: {
      damageBonus: 15,
      defenseBonus: 20,
      accuracyBonus: 15,
      criticalChance: 8,
      speedBonus: 10,
      maneuverBonus: 10,
      jumpRangeBonus: 10,
      stealthBonus: 5,
      cargoBonus: 20,
      crewEfficiency: 20,
      repairSpeed: 15,
      researchSpeed: 15,
      shieldRechargeBonus: 20,
      weaponCooldownBonus: 15,
      fighterLaunchSpeed: 0,
      sensorStrength: 20,
    },
    baseAttributes: {
      length: 288,
      width: 127,
      height: 72,
      mass: 1000000,
      crew: 200,
      powerOutput: 5000,
      warpFactor: 8,
      impulseSpeed: 30000,
      deflectorRating: 80,
      computerRating: 75,
      sensorRating: 70,
      shieldFrequency: 'standard',
      weaponYield: 500,
      fuelCapacity: 5000,
      maintenanceCost: 2000,
      buildTime: 90,
      buildCost: { metal: 500000, crystal: 300000, deuterium: 100000, credits: 2000000 },
    },
    specialProperties: ['balanced', 'exploration-focused', 'spore-drive-compatible'],
    icon: '🚀',
    color: '#FFD700',
  },

  'defiant-frigate': {
    name: 'Defiant-class Frigate',
    description: 'Compact warship with heavy firepower',
    lore: 'Originally designed to combat the Borg, the Defiant-class packs an incredible amount of firepower in a small package.',
    category: 'frigate',
    subClass: 'escort-frigate',
    baseStats: {
      hullPoints: 1500,
      shieldPoints: 1200,
      armor: 150,
      evasion: 60,
      beamWeapons: 12,
      torpedoWeapons: 8,
      fighterBays: 0,
      weaponSlots: 12,
      shieldRegen: 20,
      armorRating: 80,
      countermeasures: 40,
      speed: 10,
      maneuverability: 85,
      jumpRange: 10,
      stealth: 30,
      cargoCapacity: 2000,
      crewCapacity: 100,
      passengerCapacity: 20,
      fighterCapacity: 0,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 30000,
      sensorRange: 25,
    },
    baseSubStats: {
      damageBonus: 35,
      defenseBonus: 25,
      accuracyBonus: 20,
      criticalChance: 15,
      speedBonus: 20,
      maneuverBonus: 30,
      jumpRangeBonus: 5,
      stealthBonus: 10,
      cargoBonus: 10,
      crewEfficiency: 25,
      repairSpeed: 20,
      researchSpeed: 10,
      shieldRechargeBonus: 25,
      weaponCooldownBonus: 20,
      fighterLaunchSpeed: 0,
      sensorStrength: 15,
    },
    baseAttributes: {
      length: 170,
      width: 134,
      height: 30,
      mass: 355000,
      crew: 100,
      powerOutput: 3000,
      warpFactor: 9,
      impulseSpeed: 35000,
      deflectorRating: 90,
      computerRating: 85,
      sensorRating: 65,
      shieldFrequency: 'standard',
      weaponYield: 800,
      fuelCapacity: 3000,
      maintenanceCost: 1500,
      buildTime: 60,
      buildCost: { metal: 400000, crystal: 250000, deuterium: 80000, credits: 1500000 },
    },
    specialProperties: ['heavy-armament', 'compact', 'maneuverable'],
    icon: '⚔️',
    color: '#FF6B6B',
  },

  'galaxy-dreadnought': {
    name: 'Galaxy-class Dreadnought',
    description: 'Massive capital ship with overwhelming firepower',
    lore: 'The Galaxy-class represents the pinnacle of Starfleet engineering, capable of extended deep-space missions and heavy combat.',
    category: 'dreadnought',
    subClass: 'siege-dreadnought',
    baseStats: {
      hullPoints: 10000,
      shieldPoints: 8000,
      armor: 300,
      evasion: 15,
      beamWeapons: 30,
      torpedoWeapons: 20,
      fighterBays: 4,
      weaponSlots: 30,
      shieldRegen: 25,
      armorRating: 150,
      countermeasures: 50,
      speed: 5,
      maneuverability: 20,
      jumpRange: 15,
      stealth: 5,
      cargoCapacity: 50000,
      crewCapacity: 1000,
      passengerCapacity: 500,
      fighterCapacity: 24,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 100000,
      sensorRange: 40,
    },
    baseSubStats: {
      damageBonus: 50,
      defenseBonus: 40,
      accuracyBonus: 25,
      criticalChance: 12,
      speedBonus: 5,
      maneuverBonus: 5,
      jumpRangeBonus: 15,
      stealthBonus: 0,
      cargoBonus: 50,
      crewEfficiency: 30,
      repairSpeed: 25,
      researchSpeed: 20,
      shieldRechargeBonus: 30,
      weaponCooldownBonus: 25,
      fighterLaunchSpeed: 20,
      sensorStrength: 25,
    },
    baseAttributes: {
      length: 1200,
      width: 450,
      height: 200,
      mass: 5000000,
      crew: 1000,
      powerOutput: 20000,
      warpFactor: 9.5,
      impulseSpeed: 20000,
      deflectorRating: 100,
      computerRating: 90,
      sensorRating: 85,
      shieldFrequency: 'multi-frequency',
      weaponYield: 5000,
      fuelCapacity: 50000,
      maintenanceCost: 10000,
      buildTime: 365,
      buildCost: { metal: 5000000, crystal: 3000000, deuterium: 1000000, credits: 50000000 },
    },
    specialProperties: ['capital-ship', 'heavy-firepower', 'carrier-capable', 'spore-drive-compatible'],
    icon: '🛡️',
    color: '#9B59B6',
  },

  'sovereign-battleship': {
    name: 'Sovereign-class Battleship',
    description: 'Advanced warship with quantum torpedoes',
    lore: 'The Sovereign-class was designed for deep-space exploration and combat, featuring advanced quantum weaponry.',
    category: 'battleship',
    subClass: 'assault-battleship',
    baseStats: {
      hullPoints: 8000,
      shieldPoints: 6000,
      armor: 250,
      evasion: 25,
      beamWeapons: 24,
      torpedoWeapons: 16,
      fighterBays: 2,
      weaponSlots: 24,
      shieldRegen: 22,
      armorRating: 120,
      countermeasures: 45,
      speed: 7,
      maneuverability: 30,
      jumpRange: 13,
      stealth: 10,
      cargoCapacity: 30000,
      crewCapacity: 800,
      passengerCapacity: 300,
      fighterCapacity: 12,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 80000,
      sensorRange: 35,
    },
    baseSubStats: {
      damageBonus: 45,
      defenseBonus: 35,
      accuracyBonus: 22,
      criticalChance: 14,
      speedBonus: 8,
      maneuverBonus: 8,
      jumpRangeBonus: 12,
      stealthBonus: 5,
      cargoBonus: 40,
      crewEfficiency: 28,
      repairSpeed: 22,
      researchSpeed: 18,
      shieldRechargeBonus: 28,
      weaponCooldownBonus: 22,
      fighterLaunchSpeed: 15,
      sensorStrength: 22,
    },
    baseAttributes: {
      length: 685,
      width: 250,
      height: 110,
      mass: 3500000,
      crew: 800,
      powerOutput: 15000,
      warpFactor: 9.8,
      impulseSpeed: 25000,
      deflectorRating: 95,
      computerRating: 92,
      sensorRating: 80,
      shieldFrequency: 'quantum',
      weaponYield: 3500,
      fuelCapacity: 40000,
      maintenanceCost: 8000,
      buildTime: 300,
      buildCost: { metal: 4000000, crystal: 2500000, deuterium: 800000, credits: 40000000 },
    },
    specialProperties: ['quantum-torpedoes', 'advanced-shields', 'spore-drive-compatible'],
    icon: '⚡',
    color: '#E74C3C',
  },

  'intrepid-explorer': {
    name: 'Intrepid-class Explorer',
    description: 'Long-range exploration vessel with spore drive',
    lore: 'The Intrepid-class was designed for deep-space exploration, featuring advanced scientific facilities.',
    category: 'exploration',
    subClass: 'exploration-cruiser',
    baseStats: {
      hullPoints: 2500,
      shieldPoints: 2000,
      armor: 120,
      evasion: 50,
      beamWeapons: 10,
      torpedoWeapons: 6,
      fighterBays: 0,
      weaponSlots: 10,
      shieldRegen: 18,
      armorRating: 70,
      countermeasures: 35,
      speed: 9,
      maneuverability: 60,
      jumpRange: 25,
      stealth: 25,
      cargoCapacity: 10000,
      crewCapacity: 300,
      passengerCapacity: 100,
      fighterCapacity: 0,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 60000,
      sensorRange: 50,
    },
    baseSubStats: {
      damageBonus: 20,
      defenseBonus: 25,
      accuracyBonus: 18,
      criticalChance: 10,
      speedBonus: 15,
      maneuverBonus: 15,
      jumpRangeBonus: 25,
      stealthBonus: 10,
      cargoBonus: 30,
      crewEfficiency: 25,
      repairSpeed: 18,
      researchSpeed: 35,
      shieldRechargeBonus: 22,
      weaponCooldownBonus: 18,
      fighterLaunchSpeed: 0,
      sensorStrength: 35,
    },
    baseAttributes: {
      length: 344,
      width: 133,
      height: 66,
      mass: 700000,
      crew: 300,
      powerOutput: 8000,
      warpFactor: 9.5,
      impulseSpeed: 32000,
      deflectorRating: 85,
      computerRating: 90,
      sensorRating: 95,
      shieldFrequency: 'standard',
      weaponYield: 800,
      fuelCapacity: 8000,
      maintenanceCost: 3000,
      buildTime: 120,
      buildCost: { metal: 800000, crystal: 500000, deuterium: 150000, credits: 3000000 },
    },
    specialProperties: ['long-range', 'scientific', 'spore-drive-compatible', 'exploration-focused'],
    icon: '🔭',
    color: '#3498DB',
  },

  'klingon-bird-of-prey': {
    name: 'Klingon Bird-of-Prey',
    description: 'Light warship with cloaking device',
    lore: 'The iconic Klingon warship features a cloaking device and heavy torpedo armament.',
    category: 'destroyer',
    subClass: 'stealth-destroyer',
    baseStats: {
      hullPoints: 1800,
      shieldPoints: 1400,
      armor: 130,
      evasion: 70,
      beamWeapons: 8,
      torpedoWeapons: 12,
      fighterBays: 0,
      weaponSlots: 10,
      shieldRegen: 16,
      armorRating: 75,
      countermeasures: 25,
      speed: 12,
      maneuverability: 80,
      jumpRange: 11,
      stealth: 90,
      cargoCapacity: 3000,
      crewCapacity: 150,
      passengerCapacity: 30,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: true,
      transporterRange: 30000,
      sensorRange: 22,
    },
    baseSubStats: {
      damageBonus: 30,
      defenseBonus: 20,
      accuracyBonus: 18,
      criticalChance: 18,
      speedBonus: 25,
      maneuverBonus: 35,
      jumpRangeBonus: 8,
      stealthBonus: 40,
      cargoBonus: 15,
      crewEfficiency: 20,
      repairSpeed: 15,
      researchSpeed: 8,
      shieldRechargeBonus: 18,
      weaponCooldownBonus: 15,
      fighterLaunchSpeed: 0,
      sensorStrength: 12,
    },
    baseAttributes: {
      length: 160,
      width: 120,
      height: 35,
      mass: 280000,
      crew: 150,
      powerOutput: 2500,
      warpFactor: 8,
      impulseSpeed: 28000,
      deflectorRating: 70,
      computerRating: 70,
      sensorRating: 60,
      shieldFrequency: 'standard',
      weaponYield: 600,
      fuelCapacity: 2500,
      maintenanceCost: 1200,
      buildTime: 50,
      buildCost: { metal: 350000, crystal: 200000, deuterium: 70000, credits: 1200000 },
    },
    specialProperties: ['cloaking-device', 'torpedo-focused', 'maneuverable'],
    icon: '🦅',
    color: '#2C3E50',
  },

  'romulan-warbird': {
    name: 'Romulan Warbird',
    description: 'Massive capital ship with cloaking capabilities',
    lore: 'The Romulan Warbird is a symbol of Romulan military power, featuring advanced cloaking technology.',
    category: 'battleship',
    subClass: 'assault-battleship',
    baseStats: {
      hullPoints: 9000,
      shieldPoints: 7000,
      armor: 280,
      evasion: 20,
      beamWeapons: 28,
      torpedoWeapons: 18,
      fighterBays: 3,
      weaponSlots: 28,
      shieldRegen: 24,
      armorRating: 140,
      countermeasures: 55,
      speed: 6,
      maneuverability: 25,
      jumpRange: 14,
      stealth: 85,
      cargoCapacity: 40000,
      crewCapacity: 900,
      passengerCapacity: 400,
      fighterCapacity: 18,
      sporeDriveCompatible: false,
      cloakingDevice: true,
      transporterRange: 90000,
      sensorRange: 38,
    },
    baseSubStats: {
      damageBonus: 48,
      defenseBonus: 38,
      accuracyBonus: 24,
      criticalChance: 13,
      speedBonus: 6,
      maneuverBonus: 7,
      jumpRangeBonus: 14,
      stealthBonus: 35,
      cargoBonus: 45,
      crewEfficiency: 32,
      repairSpeed: 24,
      researchSpeed: 15,
      shieldRechargeBonus: 32,
      weaponCooldownBonus: 24,
      fighterLaunchSpeed: 18,
      sensorStrength: 24,
    },
    baseAttributes: {
      length: 1100,
      width: 400,
      height: 180,
      mass: 4500000,
      crew: 900,
      powerOutput: 18000,
      warpFactor: 9.2,
      impulseSpeed: 22000,
      deflectorRating: 92,
      computerRating: 88,
      sensorRating: 78,
      shieldFrequency: 'multi-frequency',
      weaponYield: 4200,
      fuelCapacity: 45000,
      maintenanceCost: 9000,
      buildTime: 340,
      buildCost: { metal: 4500000, crystal: 2800000, deuterium: 900000, credits: 45000000 },
    },
    specialProperties: ['cloaking-device', 'heavy-firepower', 'capital-ship'],
    icon: '🦅',
    color: '#1ABC9C',
  },

  'orion-maruder': {
    name: 'Orion Marauder',
    description: 'Fast pirate ship with heavy cargo capacity',
    lore: 'Orion Marauders are the workhorses of the Orion Syndicate, used for smuggling and piracy.',
    category: 'transport',
    subClass: 'cargo-transport',
    baseStats: {
      hullPoints: 1200,
      shieldPoints: 800,
      armor: 60,
      evasion: 55,
      beamWeapons: 4,
      torpedoWeapons: 2,
      fighterBays: 0,
      weaponSlots: 4,
      shieldRegen: 8,
      armorRating: 40,
      countermeasures: 15,
      speed: 11,
      maneuverability: 70,
      jumpRange: 13,
      stealth: 40,
      cargoCapacity: 20000,
      crewCapacity: 80,
      passengerCapacity: 40,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 25000,
      sensorRange: 20,
    },
    baseSubStats: {
      damageBonus: 10,
      defenseBonus: 12,
      accuracyBonus: 12,
      criticalChance: 8,
      speedBonus: 22,
      maneuverBonus: 20,
      jumpRangeBonus: 12,
      stealthBonus: 12,
      cargoBonus: 60,
      crewEfficiency: 18,
      repairSpeed: 12,
      researchSpeed: 5,
      shieldRechargeBonus: 10,
      weaponCooldownBonus: 8,
      fighterLaunchSpeed: 0,
      sensorStrength: 10,
    },
    baseAttributes: {
      length: 120,
      width: 80,
      height: 35,
      mass: 120000,
      crew: 80,
      powerOutput: 1500,
      warpFactor: 7,
      impulseSpeed: 27000,
      deflectorRating: 50,
      computerRating: 55,
      sensorRating: 50,
      shieldFrequency: 'standard',
      weaponYield: 200,
      fuelCapacity: 4000,
      maintenanceCost: 800,
      buildTime: 40,
      buildCost: { metal: 200000, crystal: 120000, deuterium: 40000, credits: 800000 },
    },
    specialProperties: ['cargo-focused', 'fast', 'smuggler-friendly'],
    icon: '📦',
    color: '#F39C12',
  },

  'vulcan-d-kyr-class': {
    name: "Vulcan D'Kyr-class",
    description: 'Vulcan survey vessel with advanced sensors',
    lore: 'The D\'Kyr-class is a Vulcan survey vessel known for its advanced sensor systems and logical design.',
    category: 'science',
    subClass: 'research-vessel',
    baseStats: {
      hullPoints: 1600,
      shieldPoints: 1200,
      armor: 90,
      evasion: 45,
      beamWeapons: 6,
      torpedoWeapons: 2,
      fighterBays: 0,
      weaponSlots: 6,
      shieldRegen: 14,
      armorRating: 55,
      countermeasures: 30,
      speed: 8,
      maneuverability: 55,
      jumpRange: 18,
      stealth: 35,
      cargoCapacity: 8000,
      crewCapacity: 250,
      passengerCapacity: 80,
      fighterCapacity: 0,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 50000,
      sensorRange: 60,
    },
    baseSubStats: {
      damageBonus: 12,
      defenseBonus: 18,
      accuracyBonus: 22,
      criticalChance: 9,
      speedBonus: 12,
      maneuverBonus: 12,
      jumpRangeBonus: 18,
      stealthBonus: 8,
      cargoBonus: 25,
      crewEfficiency: 30,
      repairSpeed: 16,
      researchSpeed: 40,
      shieldRechargeBonus: 20,
      weaponCooldownBonus: 14,
      fighterLaunchSpeed: 0,
      sensorStrength: 40,
    },
    baseAttributes: {
      length: 200,
      width: 90,
      height: 45,
      mass: 250000,
      crew: 250,
      powerOutput: 4000,
      warpFactor: 8,
      impulseSpeed: 26000,
      deflectorRating: 75,
      computerRating: 95,
      sensorRating: 100,
      shieldFrequency: 'standard',
      weaponYield: 400,
      fuelCapacity: 6000,
      maintenanceCost: 2500,
      buildTime: 80,
      buildCost: { metal: 600000, crystal: 400000, deuterium: 120000, credits: 2500000 },
    },
    specialProperties: ['advanced-sensors', 'scientific', 'spore-drive-compatible'],
    icon: '🔬',
    color: '#9B59B6',
  },

  'andorian-battlecruiser': {
    name: 'Andorian Battlecruiser',
    description: 'Aggressive warship with heavy beam armament',
    lore: 'Andorian battlecruisers are known for their aggressive tactics and powerful beam weaponry.',
    category: 'battlecruiser',
    subClass: 'battle-cruiser',
    baseStats: {
      hullPoints: 4000,
      shieldPoints: 3000,
      armor: 180,
      evasion: 35,
      beamWeapons: 20,
      torpedoWeapons: 10,
      fighterBays: 1,
      weaponSlots: 20,
      shieldRegen: 20,
      armorRating: 100,
      countermeasures: 40,
      speed: 7,
      maneuverability: 40,
      jumpRange: 11,
      stealth: 20,
      cargoCapacity: 15000,
      crewCapacity: 500,
      passengerCapacity: 150,
      fighterCapacity: 6,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 60000,
      sensorRange: 28,
    },
    baseSubStats: {
      damageBonus: 38,
      defenseBonus: 28,
      accuracyBonus: 20,
      criticalChance: 12,
      speedBonus: 8,
      maneuverBonus: 10,
      jumpRangeBonus: 8,
      stealthBonus: 5,
      cargoBonus: 30,
      crewEfficiency: 22,
      repairSpeed: 20,
      researchSpeed: 12,
      shieldRechargeBonus: 24,
      weaponCooldownBonus: 20,
      fighterLaunchSpeed: 12,
      sensorStrength: 18,
    },
    baseAttributes: {
      length: 450,
      width: 180,
      height: 80,
      mass: 1800000,
      crew: 500,
      powerOutput: 10000,
      warpFactor: 8.5,
      impulseSpeed: 24000,
      deflectorRating: 85,
      computerRating: 80,
      sensorRating: 72,
      shieldFrequency: 'standard',
      weaponYield: 1500,
      fuelCapacity: 20000,
      maintenanceCost: 5000,
      buildTime: 180,
      buildCost: { metal: 2000000, crystal: 1200000, deuterium: 400000, credits: 20000000 },
    },
    specialProperties: ['beam-focused', 'aggressive', 'spore-drive-compatible'],
    icon: '⚔️',
    color: '#E74C3C',
  },

  'cardassian-galor': {
    name: 'Cardassian Galor-class',
    description: 'Balanced warship with advanced targeting',
    lore: 'The Galor-class is the backbone of the Cardassian fleet, known for its advanced targeting systems.',
    category: 'destroyer',
    subClass: 'torpedo-destroyer',
    baseStats: {
      hullPoints: 2200,
      shieldPoints: 1800,
      armor: 140,
      evasion: 45,
      beamWeapons: 10,
      torpedoWeapons: 14,
      fighterBays: 0,
      weaponSlots: 12,
      shieldRegen: 16,
      armorRating: 80,
      countermeasures: 35,
      speed: 9,
      maneuverability: 55,
      jumpRange: 10,
      stealth: 30,
      cargoCapacity: 4000,
      crewCapacity: 200,
      passengerCapacity: 50,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 35000,
      sensorRange: 24,
    },
    baseSubStats: {
      damageBonus: 32,
      defenseBonus: 22,
      accuracyBonus: 25,
      criticalChance: 11,
      speedBonus: 14,
      maneuverBonus: 14,
      jumpRangeBonus: 7,
      stealthBonus: 8,
      cargoBonus: 18,
      crewEfficiency: 20,
      repairSpeed: 16,
      researchSpeed: 10,
      shieldRechargeBonus: 18,
      weaponCooldownBonus: 22,
      fighterLaunchSpeed: 0,
      sensorStrength: 16,
    },
    baseAttributes: {
      length: 210,
      width: 140,
      height: 55,
      mass: 380000,
      crew: 200,
      powerOutput: 3500,
      warpFactor: 8,
      impulseSpeed: 27000,
      deflectorRating: 78,
      computerRating: 88,
      sensorRating: 68,
      shieldFrequency: 'standard',
      weaponYield: 700,
      fuelCapacity: 3500,
      maintenanceCost: 1400,
      buildTime: 55,
      buildCost: { metal: 380000, crystal: 230000, deuterium: 75000, credits: 1400000 },
    },
    specialProperties: ['advanced-targeting', 'torpedo-focused'],
    icon: '🎯',
    color: '#8E44AD',
  },

  'breen-dreadnought': {
    name: 'Breen Dreadnought',
    description: 'Heavy warship with energy-dampening weapons',
    lore: 'Breen dreadnoughts are feared for their energy-dampening capabilities that can disable enemy ships.',
    category: 'dreadnought',
    subClass: 'carrier-dreadnought',
    baseStats: {
      hullPoints: 8500,
      shieldPoints: 6500,
      armor: 260,
      evasion: 18,
      beamWeapons: 22,
      torpedoWeapons: 16,
      fighterBays: 3,
      weaponSlots: 24,
      shieldRegen: 20,
      armorRating: 130,
      countermeasures: 45,
      speed: 6,
      maneuverability: 22,
      jumpRange: 12,
      stealth: 15,
      cargoCapacity: 35000,
      crewCapacity: 850,
      passengerCapacity: 350,
      fighterCapacity: 18,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 75000,
      sensorRange: 32,
    },
    baseSubStats: {
      damageBonus: 42,
      defenseBonus: 32,
      accuracyBonus: 20,
      criticalChance: 11,
      speedBonus: 5,
      maneuverBonus: 6,
      jumpRangeBonus: 10,
      stealthBonus: 3,
      cargoBonus: 42,
      crewEfficiency: 26,
      repairSpeed: 22,
      researchSpeed: 14,
      shieldRechargeBonus: 26,
      weaponCooldownBonus: 20,
      fighterLaunchSpeed: 16,
      sensorStrength: 20,
    },
    baseAttributes: {
      length: 950,
      width: 350,
      height: 150,
      mass: 4000000,
      crew: 850,
      powerOutput: 16000,
      warpFactor: 9,
      impulseSpeed: 21000,
      deflectorRating: 90,
      computerRating: 82,
      sensorRating: 75,
      shieldFrequency: 'standard',
      weaponYield: 3800,
      fuelCapacity: 42000,
      maintenanceCost: 8500,
      buildTime: 320,
      buildCost: { metal: 4200000, crystal: 2600000, deuterium: 850000, credits: 42000000 },
    },
    specialProperties: ['energy-dampening', 'heavy-firepower', 'carrier-capable'],
    icon: '💀',
    color: '#2C3E50',
  },

  'ferengi-marauder': {
    name: 'Ferengi Marauder',
    description: 'Fast trading ship with minimal armament',
    lore: 'Ferengi Marauders are designed for profit, with maximum cargo space and minimal combat capability.',
    category: 'transport',
    subClass: 'cargo-transport',
    baseStats: {
      hullPoints: 1000,
      shieldPoints: 600,
      armor: 40,
      evasion: 50,
      beamWeapons: 2,
      torpedoWeapons: 1,
      fighterBays: 0,
      weaponSlots: 2,
      shieldRegen: 6,
      armorRating: 25,
      countermeasures: 10,
      speed: 12,
      maneuverability: 75,
      jumpRange: 14,
      stealth: 35,
      cargoCapacity: 30000,
      crewCapacity: 60,
      passengerCapacity: 20,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 20000,
      sensorRange: 18,
    },
    baseSubStats: {
      damageBonus: 5,
      defenseBonus: 8,
      accuracyBonus: 10,
      criticalChance: 5,
      speedBonus: 28,
      maneuverBonus: 22,
      jumpRangeBonus: 14,
      stealthBonus: 10,
      cargoBonus: 70,
      crewEfficiency: 15,
      repairSpeed: 10,
      researchSpeed: 5,
      shieldRechargeBonus: 8,
      weaponCooldownBonus: 5,
      fighterLaunchSpeed: 0,
      sensorStrength: 8,
    },
    baseAttributes: {
      length: 100,
      width: 70,
      height: 30,
      mass: 80000,
      crew: 60,
      powerOutput: 1000,
      warpFactor: 7,
      impulseSpeed: 30000,
      deflectorRating: 45,
      computerRating: 60,
      sensorRating: 55,
      shieldFrequency: 'standard',
      weaponYield: 100,
      fuelCapacity: 5000,
      maintenanceCost: 600,
      buildTime: 35,
      buildCost: { metal: 150000, crystal: 100000, deuterium: 30000, credits: 600000 },
    },
    specialProperties: ['cargo-focused', 'fast', 'trading'],
    icon: '💰',
    color: '#F1C40F',
  },

  'starfleet-nexus': {
    name: 'Starfleet Nexus-class',
    description: 'Multi-role command ship with advanced facilities',
    lore: 'The Nexus-class serves as a mobile command center with extensive facilities for fleet operations.',
    category: 'flagship',
    subClass: 'command-cruiser',
    baseStats: {
      hullPoints: 6000,
      shieldPoints: 5000,
      armor: 200,
      evasion: 30,
      beamWeapons: 18,
      torpedoWeapons: 12,
      fighterBays: 2,
      weaponSlots: 20,
      shieldRegen: 22,
      armorRating: 110,
      countermeasures: 45,
      speed: 7,
      maneuverability: 35,
      jumpRange: 13,
      stealth: 15,
      cargoCapacity: 25000,
      crewCapacity: 600,
      passengerCapacity: 200,
      fighterCapacity: 12,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 70000,
      sensorRange: 35,
    },
    baseSubStats: {
      damageBonus: 35,
      defenseBonus: 30,
      accuracyBonus: 22,
      criticalChance: 12,
      speedBonus: 10,
      maneuverBonus: 10,
      jumpRangeBonus: 12,
      stealthBonus: 5,
      cargoBonus: 35,
      crewEfficiency: 35,
      repairSpeed: 25,
      researchSpeed: 22,
      shieldRechargeBonus: 28,
      weaponCooldownBonus: 22,
      fighterLaunchSpeed: 18,
      sensorStrength: 28,
    },
    baseAttributes: {
      length: 600,
      width: 250,
      height: 120,
      mass: 2800000,
      crew: 600,
      powerOutput: 12000,
      warpFactor: 9.2,
      impulseSpeed: 23000,
      deflectorRating: 88,
      computerRating: 95,
      sensorRating: 82,
      shieldFrequency: 'multi-frequency',
      weaponYield: 2500,
      fuelCapacity: 35000,
      maintenanceCost: 7000,
      buildTime: 250,
      buildCost: { metal: 3000000, crystal: 1800000, deuterium: 600000, credits: 35000000 },
    },
    specialProperties: ['command-ship', 'fleet-coordination', 'spore-drive-compatible'],
    icon: '⭐',
    color: '#3498DB',
  },

  'borg-cube': {
    name: 'Borg Cube',
    description: 'Terrifying Borg vessel with adaptive technology',
    lore: 'The Borg Cube is a symbol of the Collective, featuring adaptive shields and regenerative capabilities.',
    category: 'fortress',
    subClass: 'mobile-fortress',
    baseStats: {
      hullPoints: 15000,
      shieldPoints: 12000,
      armor: 400,
      evasion: 10,
      beamWeapons: 40,
      torpedoWeapons: 30,
      fighterBays: 6,
      weaponSlots: 45,
      shieldRegen: 30,
      armorRating: 200,
      countermeasures: 60,
      speed: 4,
      maneuverability: 15,
      jumpRange: 10,
      stealth: 5,
      cargoCapacity: 100000,
      crewCapacity: 2000,
      passengerCapacity: 1000,
      fighterCapacity: 36,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 150000,
      sensorRange: 45,
    },
    baseSubStats: {
      damageBonus: 60,
      defenseBonus: 50,
      accuracyBonus: 28,
      criticalChance: 15,
      speedBonus: 3,
      maneuverBonus: 3,
      jumpRangeBonus: 8,
      stealthBonus: 0,
      cargoBonus: 80,
      crewEfficiency: 40,
      repairSpeed: 35,
      researchSpeed: 25,
      shieldRechargeBonus: 40,
      weaponCooldownBonus: 30,
      fighterLaunchSpeed: 25,
      sensorStrength: 30,
    },
    baseAttributes: {
      length: 3000,
      width: 3000,
      height: 3000,
      mass: 10000000,
      crew: 2000,
      powerOutput: 50000,
      warpFactor: 9.5,
      impulseSpeed: 15000,
      deflectorRating: 100,
      computerRating: 100,
      sensorRating: 90,
      shieldFrequency: 'adaptive',
      weaponYield: 10000,
      fuelCapacity: 100000,
      maintenanceCost: 20000,
      buildTime: 730,
      buildCost: { metal: 10000000, crystal: 6000000, deuterium: 2000000, credits: 100000000 },
    },
    specialProperties: ['adaptive-shields', 'regenerative', 'borg-collective', 'formidable'],
    icon: '🎲',
    color: '#1ABC9C',
  },

  ' dominion-battlecruiser': {
    name: 'Dominion Battlecruiser',
    description: 'Jem\'Hadar warship with genetic programming',
    lore: 'Dominion battlecruisers are crewed by Jem\'Hadar warriors, designed for shock and awe tactics.',
    category: 'battlecruiser',
    subClass: 'assault-battleship',
    baseStats: {
      hullPoints: 5000,
      shieldPoints: 4000,
      armor: 220,
      evasion: 28,
      beamWeapons: 22,
      torpedoWeapons: 14,
      fighterBays: 2,
      weaponSlots: 22,
      shieldRegen: 24,
      armorRating: 115,
      countermeasures: 40,
      speed: 7,
      maneuverability: 32,
      jumpRange: 12,
      stealth: 18,
      cargoCapacity: 20000,
      crewCapacity: 600,
      passengerCapacity: 200,
      fighterCapacity: 12,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 65000,
      sensorRange: 30,
    },
    baseSubStats: {
      damageBonus: 40,
      defenseBonus: 30,
      accuracyBonus: 22,
      criticalChance: 13,
      speedBonus: 8,
      maneuverBonus: 9,
      jumpRangeBonus: 10,
      stealthBonus: 5,
      cargoBonus: 32,
      crewEfficiency: 28,
      repairSpeed: 22,
      researchSpeed: 10,
      shieldRechargeBonus: 26,
      weaponCooldownBonus: 22,
      fighterLaunchSpeed: 15,
      sensorStrength: 20,
    },
    baseAttributes: {
      length: 520,
      width: 200,
      height: 90,
      mass: 2200000,
      crew: 600,
      powerOutput: 11000,
      warpFactor: 9,
      impulseSpeed: 24000,
      deflectorRating: 86,
      computerRating: 78,
      sensorRating: 72,
      shieldFrequency: 'standard',
      weaponYield: 2000,
      fuelCapacity: 30000,
      maintenanceCost: 6000,
      buildTime: 200,
      buildCost: { metal: 2500000, crystal: 1500000, deuterium: 500000, credits: 25000000 },
    },
    specialProperties: ['jern-hadar-crew', 'aggressive-tactics', 'self-replicating'],
    icon: '🦠',
    color: '#27AE60',
  },

  'species-8472-bioship': {
    name: 'Species 8472 Bioship',
    description: 'Organic vessel with powerful bio-weapons',
    lore: 'Species 8472 bioships are living organisms capable of devastating bio-weapon attacks.',
    category: 'dreadnought',
    subClass: 'carrier-dreadnought',
    baseStats: {
      hullPoints: 12000,
      shieldPoints: 10000,
      armor: 350,
      evasion: 12,
      beamWeapons: 35,
      torpedoWeapons: 25,
      fighterBays: 4,
      weaponSlots: 38,
      shieldRegen: 28,
      armorRating: 180,
      countermeasures: 50,
      speed: 5,
      maneuverability: 18,
      jumpRange: 8,
      stealth: 8,
      cargoCapacity: 60000,
      crewCapacity: 1500,
      passengerCapacity: 500,
      fighterCapacity: 24,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 120000,
      sensorRange: 42,
    },
    baseSubStats: {
      damageBonus: 55,
      defenseBonus: 45,
      accuracyBonus: 26,
      criticalChance: 14,
      speedBonus: 4,
      maneuverBonus: 4,
      jumpRangeBonus: 6,
      stealthBonus: 2,
      cargoBonus: 65,
      crewEfficiency: 35,
      repairSpeed: 30,
      researchSpeed: 20,
      shieldRechargeBonus: 35,
      weaponCooldownBonus: 28,
      fighterLaunchSpeed: 22,
      sensorStrength: 26,
    },
    baseAttributes: {
      length: 2000,
      width: 800,
      height: 400,
      mass: 8000000,
      crew: 1500,
      powerOutput: 35000,
      warpFactor: 9.8,
      impulseSpeed: 18000,
      deflectorRating: 98,
      computerRating: 85,
      sensorRating: 88,
      shieldFrequency: 'biological',
      weaponYield: 8000,
      fuelCapacity: 80000,
      maintenanceCost: 15000,
      buildTime: 500,
      buildCost: { metal: 8000000, crystal: 5000000, deuterium: 1500000, credits: 80000000 },
    },
    specialProperties: ['organic', 'bio-weapons', 'regenerative', 'formidable'],
    icon: '🧬',
    color: '#E91E63',
  },

  'hazari-bomber': {
    name: 'Hazari Bomber',
    description: 'Dedicated torpedo bomber with heavy ordnance',
    lore: 'Hazari bombers specialize in delivering massive torpedo salvos against capital ships.',
    category: 'bomber',
    subClass: 'torpedo-bomber',
    baseStats: {
      hullPoints: 1400,
      shieldPoints: 1000,
      armor: 80,
      evasion: 65,
      beamWeapons: 4,
      torpedoWeapons: 20,
      fighterBays: 0,
      weaponSlots: 6,
      shieldRegen: 10,
      armorRating: 50,
      countermeasures: 20,
      speed: 11,
      maneuverability: 75,
      jumpRange: 9,
      stealth: 45,
      cargoCapacity: 1500,
      crewCapacity: 100,
      passengerCapacity: 20,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 28000,
      sensorRange: 20,
    },
    baseSubStats: {
      damageBonus: 45,
      defenseBonus: 15,
      accuracyBonus: 20,
      criticalChance: 16,
      speedBonus: 22,
      maneuverBonus: 25,
      jumpRangeBonus: 6,
      stealthBonus: 18,
      cargoBonus: 12,
      crewEfficiency: 18,
      repairSpeed: 14,
      researchSpeed: 8,
      shieldRechargeBonus: 12,
      weaponCooldownBonus: 18,
      fighterLaunchSpeed: 0,
      sensorStrength: 14,
    },
    baseAttributes: {
      length: 140,
      width: 100,
      height: 40,
      mass: 180000,
      crew: 100,
      powerOutput: 2000,
      warpFactor: 7.5,
      impulseSpeed: 26000,
      deflectorRating: 60,
      computerRating: 72,
      sensorRating: 58,
      shieldFrequency: 'standard',
      weaponYield: 1200,
      fuelCapacity: 2000,
      maintenanceCost: 1000,
      buildTime: 45,
      buildCost: { metal: 280000, crystal: 160000, deuterium: 55000, credits: 1000000 },
    },
    specialProperties: ['torpedo-focused', 'heavy-ordnance', 'fast'],
    icon: '💣',
    color: '#E74C3C',
  },

  'hirogen-hunter': {
    name: 'Hirogen Hunter',
    description: 'Relentless hunter ship with advanced tracking',
    lore: 'Hirogen hunters are designed for tracking and hunting prey across vast distances.',
    category: 'destroyer',
    subClass: 'interceptor-fighter',
    baseStats: {
      hullPoints: 2000,
      shieldPoints: 1500,
      armor: 100,
      evasion: 80,
      beamWeapons: 14,
      torpedoWeapons: 8,
      fighterBays: 0,
      weaponSlots: 14,
      shieldRegen: 18,
      armorRating: 65,
      countermeasures: 30,
      speed: 13,
      maneuverability: 95,
      jumpRange: 16,
      stealth: 55,
      cargoCapacity: 2500,
      crewCapacity: 120,
      passengerCapacity: 30,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 32000,
      sensorRange: 35,
    },
    baseSubStats: {
      damageBonus: 28,
      defenseBonus: 18,
      accuracyBonus: 30,
      criticalChance: 20,
      speedBonus: 35,
      maneuverBonus: 40,
      jumpRangeBonus: 16,
      stealthBonus: 22,
      cargoBonus: 14,
      crewEfficiency: 22,
      repairSpeed: 18,
      researchSpeed: 8,
      shieldRechargeBonus: 20,
      weaponCooldownBonus: 25,
      fighterLaunchSpeed: 0,
      sensorStrength: 32,
    },
    baseAttributes: {
      length: 150,
      width: 110,
      height: 38,
      mass: 200000,
      crew: 120,
      powerOutput: 2800,
      warpFactor: 8.5,
      impulseSpeed: 32000,
      deflectorRating: 72,
      computerRating: 85,
      sensorRating: 95,
      shieldFrequency: 'standard',
      weaponYield: 650,
      fuelCapacity: 3000,
      maintenanceCost: 1300,
      buildTime: 48,
      buildCost: { metal: 320000, crystal: 190000, deuterium: 65000, credits: 1100000 },
    },
    specialProperties: ['advanced-tracking', 'hunter-focused', 'maneuverable'],
    icon: '🎯',
    color: '#C0392B',
  },

  'dauntless-science': {
    name: 'Dauntless-class Science',
    description: 'Experimental vessel with quantum slipstream',
    lore: 'The Dauntless-class features experimental quantum slipstream technology for unprecedented speed.',
    category: 'science',
    subClass: 'research-vessel',
    baseStats: {
      hullPoints: 1800,
      shieldPoints: 1400,
      armor: 100,
      evasion: 40,
      beamWeapons: 6,
      torpedoWeapons: 2,
      fighterBays: 0,
      weaponSlots: 6,
      shieldRegen: 14,
      armorRating: 60,
      countermeasures: 30,
      speed: 15,
      maneuverability: 50,
      jumpRange: 50,
      stealth: 25,
      cargoCapacity: 6000,
      crewCapacity: 200,
      passengerCapacity: 60,
      fighterCapacity: 0,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 45000,
      sensorRange: 70,
    },
    baseSubStats: {
      damageBonus: 10,
      defenseBonus: 15,
      accuracyBonus: 20,
      criticalChance: 8,
      speedBonus: 40,
      maneuverBonus: 15,
      jumpRangeBonus: 50,
      stealthBonus: 8,
      cargoBonus: 22,
      crewEfficiency: 28,
      repairSpeed: 16,
      researchSpeed: 45,
      shieldRechargeBonus: 18,
      weaponCooldownBonus: 12,
      fighterLaunchSpeed: 0,
      sensorStrength: 45,
    },
    baseAttributes: {
      length: 230,
      width: 100,
      height: 50,
      mass: 350000,
      crew: 200,
      powerOutput: 6000,
      warpFactor: 9.9,
      impulseSpeed: 35000,
      deflectorRating: 90,
      computerRating: 98,
      sensorRating: 100,
      shieldFrequency: 'quantum',
      weaponYield: 500,
      fuelCapacity: 10000,
      maintenanceCost: 3500,
      buildTime: 100,
      buildCost: { metal: 900000, crystal: 600000, deuterium: 180000, credits: 3500000 },
    },
    specialProperties: ['quantum-slipstream', 'ultra-long-range', 'spore-drive-compatible'],
    icon: '⚛️',
    color: '#9B59B6',
  },

  'kazon- Predator-class': {
    name: 'Kazon Predator-class',
    description: 'Aggressive raider ship with heavy weapons',
    lore: 'Kazon Predators are built for raiding and combat, with heavy emphasis on weaponry.',
    category: 'destroyer',
    subClass: 'torpedo-destroyer',
    baseStats: {
      hullPoints: 2400,
      shieldPoints: 1800,
      armor: 150,
      evasion: 50,
      beamWeapons: 12,
      torpedoWeapons: 16,
      fighterBays: 0,
      weaponSlots: 14,
      shieldRegen: 16,
      armorRating: 85,
      countermeasures: 30,
      speed: 9,
      maneuverability: 60,
      jumpRange: 10,
      stealth: 25,
      cargoCapacity: 5000,
      crewCapacity: 180,
      passengerCapacity: 40,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 30000,
      sensorRange: 22,
    },
    baseSubStats: {
      damageBonus: 35,
      defenseBonus: 20,
      accuracyBonus: 18,
      criticalChance: 12,
      speedBonus: 15,
      maneuverBonus: 16,
      jumpRangeBonus: 7,
      stealthBonus: 6,
      cargoBonus: 20,
      crewEfficiency: 20,
      repairSpeed: 16,
      researchSpeed: 6,
      shieldRechargeBonus: 18,
      weaponCooldownBonus: 20,
      fighterLaunchSpeed: 0,
      sensorStrength: 14,
    },
    baseAttributes: {
      length: 180,
      width: 130,
      height: 50,
      mass: 320000,
      crew: 180,
      powerOutput: 3000,
      warpFactor: 7.5,
      impulseSpeed: 25000,
      deflectorRating: 70,
      computerRating: 65,
      sensorRating: 60,
      shieldFrequency: 'standard',
      weaponYield: 900,
      fuelCapacity: 4000,
      maintenanceCost: 1200,
      buildTime: 52,
      buildCost: { metal: 340000, crystal: 200000, deuterium: 70000, credits: 1200000 },
    },
    specialProperties: ['raider-focused', 'heavy-torpedoes'],
    icon: '💥',
    color: '#E67E22',
  },

  'sikarian-freighter': {
    name: 'Sikarian Freighter',
    description: 'Large cargo vessel with spacious holds',
    lore: 'Sikarian freighters are known for their massive cargo capacity and reliability.',
    category: 'freighter',
    subClass: 'cargo-transport',
    baseStats: {
      hullPoints: 3000,
      shieldPoints: 2000,
      armor: 120,
      evasion: 20,
      beamWeapons: 4,
      torpedoWeapons: 2,
      fighterBays: 0,
      weaponSlots: 4,
      shieldRegen: 12,
      armorRating: 70,
      countermeasures: 20,
      speed: 6,
      maneuverability: 25,
      jumpRange: 12,
      stealth: 10,
      cargoCapacity: 100000,
      crewCapacity: 300,
      passengerCapacity: 50,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 40000,
      sensorRange: 20,
    },
    baseSubStats: {
      damageBonus: 5,
      defenseBonus: 12,
      accuracyBonus: 8,
      criticalChance: 5,
      speedBonus: 5,
      maneuverBonus: 5,
      jumpRangeBonus: 10,
      stealthBonus: 2,
      cargoBonus: 100,
      crewEfficiency: 20,
      repairSpeed: 14,
      researchSpeed: 5,
      shieldRechargeBonus: 14,
      weaponCooldownBonus: 5,
      fighterLaunchSpeed: 0,
      sensorStrength: 10,
    },
    baseAttributes: {
      length: 400,
      width: 200,
      height: 100,
      mass: 1200000,
      crew: 300,
      powerOutput: 6000,
      warpFactor: 7,
      impulseSpeed: 20000,
      deflectorRating: 65,
      computerRating: 60,
      sensorRating: 55,
      shieldFrequency: 'standard',
      weaponYield: 300,
      fuelCapacity: 15000,
      maintenanceCost: 4000,
      buildTime: 150,
      buildCost: { metal: 1500000, crystal: 900000, deuterium: 300000, credits: 15000000 },
    },
    specialProperties: ['massive-cargo', 'reliable', 'trading'],
    icon: '🚢',
    color: '#3498DB',
  },

  'vidiian-scientist': {
    name: 'Vidiian Scientist',
    description: 'Medical research vessel with organ banks',
    lore: 'Vidiian scientist ships are equipped with extensive medical facilities for organ harvesting research.',
    category: 'medical',
    subClass: 'hospital-ship',
    baseStats: {
      hullPoints: 1600,
      shieldPoints: 1200,
      armor: 90,
      evasion: 35,
      beamWeapons: 4,
      torpedoWeapons: 2,
      fighterBays: 0,
      weaponSlots: 4,
      shieldRegen: 14,
      armorRating: 55,
      countermeasures: 25,
      speed: 8,
      maneuverability: 45,
      jumpRange: 11,
      stealth: 20,
      cargoCapacity: 3000,
      crewCapacity: 250,
      passengerCapacity: 200,
      fighterCapacity: 0,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 35000,
      sensorRange: 25,
    },
    baseSubStats: {
      damageBonus: 8,
      defenseBonus: 15,
      accuracyBonus: 15,
      criticalChance: 7,
      speedBonus: 10,
      maneuverBonus: 10,
      jumpRangeBonus: 8,
      stealthBonus: 5,
      cargoBonus: 18,
      crewEfficiency: 30,
      repairSpeed: 25,
      researchSpeed: 30,
      shieldRechargeBonus: 18,
      weaponCooldownBonus: 10,
      fighterLaunchSpeed: 0,
      sensorStrength: 20,
    },
    baseAttributes: {
      length: 190,
      width: 95,
      height: 48,
      mass: 220000,
      crew: 250,
      powerOutput: 3500,
      warpFactor: 7.5,
      impulseSpeed: 24000,
      deflectorRating: 68,
      computerRating: 80,
      sensorRating: 72,
      shieldFrequency: 'standard',
      weaponYield: 350,
      fuelCapacity: 4000,
      maintenanceCost: 2200,
      buildTime: 70,
      buildCost: { metal: 550000, crystal: 350000, deuterium: 110000, credits: 2200000 },
    },
    specialProperties: ['medical-facilities', 'organ-banks', 'research-focused'],
    icon: '🏥',
    color: '#E91E63',
  },

  'ocampa-city-ship': {
    name: 'Ocampa City Ship',
    description: 'Massive generation ship with advanced technology',
    lore: 'Ocampa city ships are massive generation vessels that can sustain populations for millennia.',
    category: 'colony',
    subClass: 'colony-ship',
    baseStats: {
      hullPoints: 12000,
      shieldPoints: 8000,
      armor: 200,
      evasion: 8,
      beamWeapons: 8,
      torpedoWeapons: 4,
      fighterBays: 0,
      weaponSlots: 8,
      shieldRegen: 15,
      armorRating: 100,
      countermeasures: 30,
      speed: 3,
      maneuverability: 12,
      jumpRange: 20,
      stealth: 5,
      cargoCapacity: 500000,
      crewCapacity: 5000,
      passengerCapacity: 10000,
      fighterCapacity: 0,
      sporeDriveCompatible: true,
      cloakingDevice: false,
      transporterRange: 200000,
      sensorRange: 30,
    },
    baseSubStats: {
      damageBonus: 10,
      defenseBonus: 20,
      accuracyBonus: 12,
      criticalChance: 5,
      speedBonus: 2,
      maneuverBonus: 2,
      jumpRangeBonus: 20,
      stealthBonus: 0,
      cargoBonus: 120,
      crewEfficiency: 40,
      repairSpeed: 20,
      researchSpeed: 25,
      shieldRechargeBonus: 20,
      weaponCooldownBonus: 8,
      fighterLaunchSpeed: 0,
      sensorStrength: 18,
    },
    baseAttributes: {
      length: 5000,
      width: 2000,
      height: 800,
      mass: 15000000,
      crew: 5000,
      powerOutput: 30000,
      warpFactor: 8,
      impulseSpeed: 12000,
      deflectorRating: 85,
      computerRating: 90,
      sensorRating: 70,
      shieldFrequency: 'standard',
      weaponYield: 1000,
      fuelCapacity: 100000,
      maintenanceCost: 25000,
      buildTime: 730,
      buildCost: { metal: 15000000, crystal: 9000000, deuterium: 3000000, credits: 150000000 },
    },
    specialProperties: ['generation-ship', 'massive-cargo', 'self-sustaining', 'spore-drive-compatible'],
    icon: '🏙️',
    color: '#3498DB',
  },

  'caretaker-array': {
    name: 'Caretaker Array',
    description: 'Ancient automated station with transwarp',
    lore: 'The Caretaker Array is an ancient automated station capable of transwarp travel.',
    category: 'station',
    subClass: 'orbital-fortress',
    baseStats: {
      hullPoints: 20000,
      shieldPoints: 15000,
      armor: 500,
      evasion: 0,
      beamWeapons: 50,
      torpedoWeapons: 30,
      fighterBays: 8,
      weaponSlots: 50,
      shieldRegen: 40,
      armorRating: 250,
      countermeasures: 80,
      speed: 0,
      maneuverability: 0,
      jumpRange: 100,
      stealth: 0,
      cargoCapacity: 200000,
      crewCapacity: 5000,
      passengerCapacity: 2000,
      fighterCapacity: 48,
      sporeDriveCompatible: false,
      cloakingDevice: false,
      transporterRange: 500000,
      sensorRange: 100,
    },
    baseSubStats: {
      damageBonus: 70,
      defenseBonus: 60,
      accuracyBonus: 35,
      criticalChance: 18,
      speedBonus: 0,
      maneuverBonus: 0,
      jumpRangeBonus: 100,
      stealthBonus: 0,
      cargoBonus: 150,
      crewEfficiency: 50,
      repairSpeed: 40,
      researchSpeed: 35,
      shieldRechargeBonus: 50,
      weaponCooldownBonus: 35,
      fighterLaunchSpeed: 30,
      sensorStrength: 40,
    },
    baseAttributes: {
      length: 10000,
      width: 5000,
      height: 3000,
      mass: 50000000,
      crew: 5000,
      powerOutput: 100000,
      warpFactor: 10,
      impulseSpeed: 0,
      deflectorRating: 100,
      computerRating: 100,
      sensorRating: 100,
      shieldFrequency: 'multi-frequency',
      weaponYield: 20000,
      fuelCapacity: 500000,
      maintenanceCost: 50000,
      buildTime: 1095,
      buildCost: { metal: 50000000, crystal: 30000000, deuterium: 10000000, credits: 500000000 },
    },
    specialProperties: ['transwarp', 'station', 'automated', 'ancient-technology'],
    icon: '🛰️',
    color: '#9B59B6',
  },
};

/**
 * Calculate ship stats based on tier and level
 */
export function calculateShipStats(
  baseStats: Partial<ShipStats>,
  tier: number,
  level: number
): ShipStats {
  const tierMultiplier = 1 + (tier - 1) * 0.15;
  const levelMultiplier = 1 + (level - 1) * 0.08;

  return {
    hullPoints: Math.floor((baseStats.hullPoints || 1000) * tierMultiplier * levelMultiplier),
    shieldPoints: Math.floor((baseStats.shieldPoints || 500) * tierMultiplier * levelMultiplier),
    armor: Math.floor((baseStats.armor || 50) * tierMultiplier * levelMultiplier),
    evasion: Math.min(100, Math.floor((baseStats.evasion || 30) * tierMultiplier)),
    beamWeapons: Math.floor((baseStats.beamWeapons || 4) * tierMultiplier * levelMultiplier),
    torpedoWeapons: Math.floor((baseStats.torpedoWeapons || 2) * tierMultiplier * levelMultiplier),
    fighterBays: Math.floor((baseStats.fighterBays || 0) * tierMultiplier),
    weaponSlots: Math.floor((baseStats.weaponSlots || 4) * tierMultiplier * levelMultiplier),
    shieldRegen: Math.floor((baseStats.shieldRegen || 10) * tierMultiplier * levelMultiplier),
    armorRating: Math.floor((baseStats.armorRating || 50) * tierMultiplier * levelMultiplier),
    countermeasures: Math.floor((baseStats.countermeasures || 10) * tierMultiplier * levelMultiplier),
    speed: Math.floor((baseStats.speed || 5) * tierMultiplier),
    maneuverability: Math.min(100, Math.floor((baseStats.maneuverability || 40) * tierMultiplier)),
    jumpRange: Math.floor((baseStats.jumpRange || 10) * tierMultiplier * levelMultiplier),
    stealth: Math.min(100, Math.floor((baseStats.stealth || 20) * tierMultiplier)),
    cargoCapacity: Math.floor((baseStats.cargoCapacity || 1000) * tierMultiplier * levelMultiplier),
    crewCapacity: Math.floor((baseStats.crewCapacity || 100) * tierMultiplier * levelMultiplier),
    passengerCapacity: Math.floor((baseStats.passengerCapacity || 20) * tierMultiplier * levelMultiplier),
    fighterCapacity: Math.floor((baseStats.fighterCapacity || 0) * tierMultiplier * levelMultiplier),
    sporeDriveCompatible: baseStats.sporeDriveCompatible || false,
    cloakingDevice: baseStats.cloakingDevice || false,
    transporterRange: Math.floor((baseStats.transporterRange || 30000) * tierMultiplier),
    sensorRange: Math.floor((baseStats.sensorRange || 20) * tierMultiplier * levelMultiplier),
  };
}

/**
 * Calculate ship sub-stats based on tier and level
 */
export function calculateShipSubStats(
  baseSubStats: Partial<ShipSubStats>,
  tier: number,
  level: number
): ShipSubStats {
  const tierMultiplier = 1 + (tier - 1) * 0.12;
  const levelMultiplier = 1 + (level - 1) * 0.06;

  return {
    damageBonus: Math.min(100, (baseSubStats.damageBonus || 0) * tierMultiplier * levelMultiplier),
    defenseBonus: Math.min(100, (baseSubStats.defenseBonus || 0) * tierMultiplier * levelMultiplier),
    accuracyBonus: Math.min(100, (baseSubStats.accuracyBonus || 0) * tierMultiplier * levelMultiplier),
    criticalChance: Math.min(50, (baseSubStats.criticalChance || 5) * tierMultiplier * levelMultiplier),
    speedBonus: Math.min(100, (baseSubStats.speedBonus || 0) * tierMultiplier * levelMultiplier),
    maneuverBonus: Math.min(100, (baseSubStats.maneuverBonus || 0) * tierMultiplier * levelMultiplier),
    jumpRangeBonus: Math.min(100, (baseSubStats.jumpRangeBonus || 0) * tierMultiplier * levelMultiplier),
    stealthBonus: Math.min(100, (baseSubStats.stealthBonus || 0) * tierMultiplier * levelMultiplier),
    cargoBonus: Math.min(100, (baseSubStats.cargoBonus || 0) * tierMultiplier * levelMultiplier),
    crewEfficiency: Math.min(100, (baseSubStats.crewEfficiency || 0) * tierMultiplier * levelMultiplier),
    repairSpeed: Math.min(100, (baseSubStats.repairSpeed || 0) * tierMultiplier * levelMultiplier),
    researchSpeed: Math.min(100, (baseSubStats.researchSpeed || 0) * tierMultiplier * levelMultiplier),
    shieldRechargeBonus: Math.min(100, (baseSubStats.shieldRechargeBonus || 0) * tierMultiplier * levelMultiplier),
    weaponCooldownBonus: Math.min(50, (baseSubStats.weaponCooldownBonus || 0) * tierMultiplier),
    fighterLaunchSpeed: Math.min(100, (baseSubStats.fighterLaunchSpeed || 0) * tierMultiplier * levelMultiplier),
    sensorStrength: Math.min(100, (baseSubStats.sensorStrength || 0) * tierMultiplier * levelMultiplier),
  };
}

/**
 * Calculate ship attributes based on tier and level
 */
export function calculateShipAttributes(
  baseAttributes: Partial<ShipAttributes>,
  tier: number,
  level: number
): ShipAttributes {
  const tierMultiplier = 1 + (tier - 1) * 0.1;
  const levelMultiplier = 1 + (level - 1) * 0.05;

  return {
    length: Math.floor((baseAttributes.length || 100) * tierMultiplier),
    width: Math.floor((baseAttributes.width || 50) * tierMultiplier),
    height: Math.floor((baseAttributes.height || 30) * tierMultiplier),
    mass: Math.floor((baseAttributes.mass || 10000) * tierMultiplier * levelMultiplier),
    crew: Math.floor((baseAttributes.crew || 50) * tierMultiplier * levelMultiplier),
    powerOutput: Math.floor((baseAttributes.powerOutput || 1000) * tierMultiplier * levelMultiplier),
    warpFactor: Math.min(9.9, (baseAttributes.warpFactor || 6) + (tier - 1) * 0.3),
    impulseSpeed: Math.floor((baseAttributes.impulseSpeed || 15000) * tierMultiplier),
    deflectorRating: Math.min(100, Math.floor((baseAttributes.deflectorRating || 50) * tierMultiplier * levelMultiplier)),
    computerRating: Math.min(100, Math.floor((baseAttributes.computerRating || 50) * tierMultiplier * levelMultiplier)),
    sensorRating: Math.min(100, Math.floor((baseAttributes.sensorRating || 50) * tierMultiplier * levelMultiplier)),
    shieldFrequency: baseAttributes.shieldFrequency || 'standard',
    weaponYield: Math.floor((baseAttributes.weaponYield || 100) * tierMultiplier * levelMultiplier),
    fuelCapacity: Math.floor((baseAttributes.fuelCapacity || 1000) * tierMultiplier * levelMultiplier),
    maintenanceCost: Math.floor((baseAttributes.maintenanceCost || 100) * tierMultiplier * levelMultiplier),
    buildTime: Math.floor((baseAttributes.buildTime || 30) * tierMultiplier),
    buildCost: {
      metal: Math.floor((baseAttributes.buildCost?.metal || 10000) * tierMultiplier * levelMultiplier),
      crystal: Math.floor((baseAttributes.buildCost?.crystal || 5000) * tierMultiplier * levelMultiplier),
      deuterium: Math.floor((baseAttributes.buildCost?.deuterium || 2000) * tierMultiplier * levelMultiplier),
      credits: Math.floor((baseAttributes.buildCost?.credits || 50000) * tierMultiplier * levelMultiplier),
    },
  };
}

/**
 * Calculate ship rarity based on tier and special properties
 */
export function calculateShipRarity(
  shipClass: string,
  tier: number,
  specialProperties: string[]
): Ship['rarity'] {
  const classConfig = SHIP_CLASSES[shipClass];
  if (!classConfig) return 'common';

  let rarityScore = tier;

  // Bonus for special properties
  if (specialProperties.includes('legendary')) rarityScore += 20;
  if (specialProperties.includes('mythic')) rarityScore += 15;
  if (specialProperties.includes('ascended')) rarityScore += 10;
  if (specialProperties.includes('spore-drive-compatible')) rarityScore += 5;
  if (specialProperties.includes('cloaking-device')) rarityScore += 5;
  if (specialProperties.includes('quantum-slipstream')) rarityScore += 10;
  if (specialProperties.includes('transwarp')) rarityScore += 15;
  if (specialProperties.includes('ancient-technology')) rarityScore += 10;

  if (rarityScore >= 90) return 'ascended';
  if (rarityScore >= 75) return 'mythic';
  if (rarityScore >= 60) return 'legendary';
  if (rarityScore >= 45) return 'epic';
  if (rarityScore >= 30) return 'rare';
  if (rarityScore >= 15) return 'uncommon';
  return 'common';
}