/**
 * Spore Drive FTL System
 * Based on Star Trek Discovery's mycelial-based faster-than-light travel
 * Uses mycelial spores from specific moons to enable instantaneous interstellar travel
 */

export type SporeDriveState = 
  | 'offline'
  | 'standby'
  | 'charging'
  | 'ready'
  | 'engaged'
  | 'navigating'
  | 'cooldown'
  | 'malfunction'
  | 'overload';

export type SporeDriveMode = 
  | 'standard'
  | 'precision'
  | 'long-range'
  | 'stealth'
  | 'emergency'
  | 'experimental';

export type NavigationTarget = 
  | 'planet'
  | 'moon'
  | 'station'
  | 'anomaly'
  | 'custom-coordinates';

export interface SporeDriveStats {
  // Core performance
  chargeRate: number; // Mycelial units per minute
  maxCharge: number; // Maximum mycelial units
  currentCharge: number; // Current mycelial units stored
  efficiency: number; // 0-100, affects fuel consumption
  
  // Navigation
  accuracy: number; // 0-100, affects arrival precision
  range: number; // Maximum light-years per jump
  jumpCooldown: number; // Minutes between jumps
  currentCooldown: number; // Remaining cooldown time
  
  // Safety
  stability: number; // 0-100, affects malfunction chance
  safetyRating: number; // 0-100, crew safety during jumps
  structuralIntegrity: number; // 0-100, ship integrity
  
  // Special capabilities
  dimensionalAnchorStrength: number; // 0-100, prevents drift
  mycelialNetworkTaps: number; // Number of network access points
  sporePurity: number; // 0-100, affects all performance metrics
}

export interface SporeDriveSubStats {
  // Performance bonuses
  chargeRateBonus: number; // Percentage
  efficiencyBonus: number; // Percentage
  accuracyBonus: number; // Percentage
  rangeBonus: number; // Percentage
  
  // Safety bonuses
  stabilityBonus: number; // Percentage
  safetyBonus: number; // Percentage
  integrityBonus: number; // Percentage
  
  // Special modifiers
  cooldownReduction: number; // Percentage
  fuelEfficiency: number; // Percentage
  navigationSpeed: number; // Percentage
  dimensionalStability: number; // Percentage
  
  // Mycelial properties
  sporeQuality: number; // 0-100
  networkLatency: number; // Milliseconds
  contaminationResistance: number; // 0-100
}

export interface SporeDriveAttributes {
  // Physical properties
  coreDiameter: number; // meters
  coreMass: number; // tons
  powerConsumption: number; // MW
  crewRequired: number;
  
  // Technical specifications
  mycelialType: string; // Type of spores used
  networkNodes: number; // Connection points to mycelial network
  dimensionalFrequency: number; // Hz
  quantumTunnelingRate: number; // Probability per attempt
  
  // Resource requirements
  sporeConsumption: number; // Units per light-year
  energyPerJump: number; // MW per jump
  maintenanceCost: number; // Credits per jump
  
  // Limitations
  maxCrewCapacity: number; // Maximum safe crew size
  maxCargoMass: number; // Maximum cargo mass (tons)
  restrictedZones: string[]; // Areas where spore drive cannot function
}

export interface SporeDriveDetails {
  // Installation info
  installationDate: string;
  installedBy: string;
  lastMaintenance: string;
  maintenanceHistory: Array<{
    date: string;
    type: string;
    performedBy: string;
    notes: string;
  }>;
  
  // Current status
  totalJumps: number;
  totalDistanceTraveled: number; // Light-years
  successfulJumps: number;
  failedJumps: number;
  emergencyDisengagements: number;
  
  // Performance metrics
  averageJumpTime: number; // Seconds
  longestJump: number; // Light-years
  shortestJump: number; // Light-years
  mostDistantDestination: string;
  
  // Incidents
  incidents: Array<{
    date: string;
    type: string;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    description: string;
    resolution: string;
  }>;
  
  // Upgrades
  upgradesInstalled: string[];
  upgradeLevel: number; // 1-999
  
  // Crew training
  trainedCrew: number;
  chiefEngineer: string | null;
  navigationSpecialist: string | null;
}

export interface SporeDriveStatus {
  // Operational state
  state: SporeDriveState;
  mode: SporeDriveMode;
  isOperational: boolean;
  isEngaged: boolean;
  
  // Current operation
  currentJump: {
    active: boolean;
    origin: string | null;
    destination: string | null;
    progress: number; // 0-100
    estimatedArrival: number | null; // Timestamp
  };
  
  // Health indicators
  health: number; // 0-100
  coreTemperature: number; // Celsius
  radiationLevel: number; // 0-100
  contaminationLevel: number; // 0-100
  
  // Alerts and warnings
  alerts: Array<{
    level: 'info' | 'warning' | 'danger' | 'critical';
    message: string;
    timestamp: number;
    autoResolve: boolean;
  }>;
  
  // System status
  systems: {
    core: boolean;
    navigation: boolean;
    safety: boolean;
    containment: boolean;
    network: boolean;
  };
  
  // Resource status
  sporeReserves: number; // Current spore units
  sporeCapacity: number; // Maximum spore units
  powerLevel: number; // 0-100
  currentCooldown: number; // Remaining cooldown in minutes
}

export interface SporeDriveJump {
  // Jump identification
  id: string;
  shipId: string;
  jumpNumber: number;
  
  // Navigation
  origin: {
    coordinates: string;
    system: string;
    planet: string | null;
  };
  destination: {
    coordinates: string;
    system: string;
    planet: string | null;
    type: NavigationTarget;
  };
  
  // Timing
  initiatedAt: number; // Timestamp
  completedAt: number | null; // Timestamp
  duration: number; // Seconds
  cooldownEnd: number; // Timestamp
  
  // Performance
  distance: number; // Light-years
  accuracy: number; // 0-100
  efficiency: number; // 0-100
  
  // Status
  status: 'preparing' | 'in-progress' | 'completed' | 'failed' | 'aborted';
  failureReason: string | null;
  
  // Effects
  crewEffects: Array<{
    crewId: string;
    effect: string;
    severity: 'minor' | 'moderate' | 'severe';
  }>;
  shipEffects: Array<{
    system: string;
    effect: string;
    duration: number; // Minutes
  }>;
  
  // Resources consumed
  sporesUsed: number;
  energyUsed: number;
}

export interface SporeDriveJumpInProgress extends Omit<SporeDriveJump, 'status' | 'completedAt'> {
  status: 'in-progress';
  completedAt: null;
}

export interface SporeDrive {
  // Core identity
  id: string;
  name: string;
  shipId: string;
  shipName: string;
  
  // Classification
  tier: number; // 1-99
  level: number; // 1-999
  class: 'prototype' | 'standard' | 'advanced' | 'experimental' | 'ascended';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'ascended';
  
  // Comprehensive stats
  stats: SporeDriveStats;
  subStats: SporeDriveSubStats;
  attributes: SporeDriveAttributes;
  details: SporeDriveDetails;
  status: SporeDriveStatus;
  
  // Jump history
  jumpHistory: SporeDriveJump[];
  totalJumps: number;
  
  // Resources
  sporeReserves: Record<string, number>; // Different spore types
  sporeCapacity: Record<string, number>;
  
  // Mycelial network
  networkNodes: Array<{
    id: string;
    location: string;
    coordinates: string;
    signalStrength: number; // 0-100
    lastContact: number; // Timestamp
    status: 'active' | 'degraded' | 'offline';
  }>;
  
  // Visual
  icon: string;
  color: string;
  description: string;
  lore: string;
  
  // Metadata
  isActive: boolean;
  installedAt: number;
  lastUsed: number | null;
}

export interface SporeDriveTypeConfig {
  name: string;
  description: string;
  lore: string;
  baseChargeRate: number;
  baseMaxCharge: number;
  baseEfficiency: number;
  baseAccuracy: number;
  baseRange: number;
  baseCooldown: number;
  color: string;
  specialProperties: string[];
  baseSubStats: Partial<SporeDriveSubStats>;
  baseAttributes: Partial<SporeDriveAttributes>;
}

export const SPORE_DRIVE_TYPES: Record<string, SporeDriveTypeConfig> = {
  'prototype': {
    name: 'Prototype Spore Drive',
    description: 'First generation spore drive, experimental and unreliable',
    lore: 'The Glenn\'s prototype spore drive proved the concept but was dangerously unstable.',
    baseChargeRate: 10,
    baseMaxCharge: 100,
    baseEfficiency: 60,
    baseAccuracy: 70,
    baseRange: 5,
    baseCooldown: 60,
    color: '#FF6B6B',
    specialProperties: ['experimental', 'unstable', 'high-risk'],
    baseSubStats: {
      chargeRateBonus: 0,
      efficiencyBonus: 0,
      accuracyBonus: 0,
      rangeBonus: 0,
      stabilityBonus: 0,
      safetyBonus: -20,
      integrityBonus: 0,
      cooldownReduction: 0,
      fuelEfficiency: 0,
      navigationSpeed: 0,
      dimensionalStability: 50,
      sporeQuality: 60,
      networkLatency: 150,
      contaminationResistance: 40,
    },
    baseAttributes: {
      coreDiameter: 15,
      coreMass: 500,
      powerConsumption: 5000,
      crewRequired: 12,
      mycelialType: 'prototype-strain',
      networkNodes: 3,
      dimensionalFrequency: 7.83,
      quantumTunnelingRate: 0.85,
      sporeConsumption: 2.5,
      energyPerJump: 10000,
      maintenanceCost: 50000,
      maxCrewCapacity: 150,
      maxCargoMass: 10000,
      restrictedZones: ['quantum-void', 'nebula-core'],
    },
  },

  'standard': {
    name: 'Standard Spore Drive',
    description: 'Production model spore drive with balanced performance',
    lore: 'The standard spore drive became the backbone of Federation deep-space exploration.',
    baseChargeRate: 15,
    baseMaxCharge: 150,
    baseEfficiency: 75,
    baseAccuracy: 85,
    baseRange: 10,
    baseCooldown: 45,
    color: '#4ECDC4',
    specialProperties: ['reliable', 'balanced', 'production-ready'],
    baseSubStats: {
      chargeRateBonus: 10,
      efficiencyBonus: 10,
      accuracyBonus: 10,
      rangeBonus: 10,
      stabilityBonus: 15,
      safetyBonus: 10,
      integrityBonus: 10,
      cooldownReduction: 10,
      fuelEfficiency: 15,
      navigationSpeed: 10,
      dimensionalStability: 75,
      sporeQuality: 75,
      networkLatency: 100,
      contaminationResistance: 65,
    },
    baseAttributes: {
      coreDiameter: 12,
      coreMass: 350,
      powerConsumption: 3500,
      crewRequired: 8,
      mycelialType: 'standard-strain',
      networkNodes: 5,
      dimensionalFrequency: 7.83,
      quantumTunnelingRate: 0.92,
      sporeConsumption: 1.8,
      energyPerJump: 7500,
      maintenanceCost: 35000,
      maxCrewCapacity: 200,
      maxCargoMass: 15000,
      restrictedZones: ['quantum-void'],
    },
  },

  'advanced': {
    name: 'Advanced Spore Drive',
    description: 'Enhanced spore drive with improved efficiency and range',
    lore: 'Advanced models feature refined mycelial strains and improved navigation systems.',
    baseChargeRate: 20,
    baseMaxCharge: 200,
    baseEfficiency: 85,
    baseAccuracy: 92,
    baseRange: 15,
    baseCooldown: 30,
    color: '#45B7D1',
    specialProperties: ['enhanced', 'efficient', 'long-range'],
    baseSubStats: {
      chargeRateBonus: 25,
      efficiencyBonus: 20,
      accuracyBonus: 20,
      rangeBonus: 25,
      stabilityBonus: 25,
      safetyBonus: 20,
      integrityBonus: 20,
      cooldownReduction: 20,
      fuelEfficiency: 25,
      navigationSpeed: 20,
      dimensionalStability: 85,
      sporeQuality: 85,
      networkLatency: 75,
      contaminationResistance: 75,
    },
    baseAttributes: {
      coreDiameter: 10,
      coreMass: 280,
      powerConsumption: 2800,
      crewRequired: 6,
      mycelialType: 'enhanced-strain',
      networkNodes: 7,
      dimensionalFrequency: 7.83,
      quantumTunnelingRate: 0.95,
      sporeConsumption: 1.4,
      energyPerJump: 6000,
      maintenanceCost: 25000,
      maxCrewCapacity: 250,
      maxCargoMass: 20000,
      restrictedZones: [],
    },
  },

  'experimental': {
    name: 'Experimental Spore Drive',
    description: 'Cutting-edge spore drive with experimental features',
    lore: 'Pushing the boundaries of mycelial physics, these drives can achieve unprecedented ranges.',
    baseChargeRate: 25,
    baseMaxCharge: 300,
    baseEfficiency: 90,
    baseAccuracy: 95,
    baseRange: 25,
    baseCooldown: 20,
    color: '#9B59B6',
    specialProperties: ['experimental', 'high-performance', 'unstable'],
    baseSubStats: {
      chargeRateBonus: 40,
      efficiencyBonus: 30,
      accuracyBonus: 30,
      rangeBonus: 50,
      stabilityBonus: 10,
      safetyBonus: 5,
      integrityBonus: 5,
      cooldownReduction: 33,
      fuelEfficiency: 35,
      navigationSpeed: 35,
      dimensionalStability: 70,
      sporeQuality: 90,
      networkLatency: 50,
      contaminationResistance: 60,
    },
    baseAttributes: {
      coreDiameter: 8,
      coreMass: 200,
      powerConsumption: 2000,
      crewRequired: 4,
      mycelialType: 'experimental-strain',
      networkNodes: 10,
      dimensionalFrequency: 9.5,
      quantumTunnelingRate: 0.97,
      sporeConsumption: 1.0,
      energyPerJump: 5000,
      maintenanceCost: 50000,
      maxCrewCapacity: 300,
      maxCargoMass: 25000,
      restrictedZones: [],
    },
  },

  'ascended': {
    name: 'Ascended Spore Drive',
    description: 'Perfect spore drive with transcendent capabilities',
    lore: 'The pinnacle of mycelial engineering, these drives transcend conventional limitations.',
    baseChargeRate: 50,
    baseMaxCharge: 500,
    baseEfficiency: 100,
    baseAccuracy: 100,
    baseRange: 50,
    baseCooldown: 10,
    color: '#FFD700',
    specialProperties: ['ascended', 'perfect', 'transcendent', 'unlimited'],
    baseSubStats: {
      chargeRateBonus: 100,
      efficiencyBonus: 50,
      accuracyBonus: 50,
      rangeBonus: 100,
      stabilityBonus: 50,
      safetyBonus: 50,
      integrityBonus: 50,
      cooldownReduction: 50,
      fuelEfficiency: 50,
      navigationSpeed: 50,
      dimensionalStability: 100,
      sporeQuality: 100,
      networkLatency: 10,
      contaminationResistance: 100,
    },
    baseAttributes: {
      coreDiameter: 5,
      coreMass: 100,
      powerConsumption: 1000,
      crewRequired: 2,
      mycelialType: 'ascended-strain',
      networkNodes: 15,
      dimensionalFrequency: 13.0,
      quantumTunnelingRate: 1.0,
      sporeConsumption: 0.5,
      energyPerJump: 2500,
      maintenanceCost: 10000,
      maxCrewCapacity: 500,
      maxCargoMass: 50000,
      restrictedZones: [],
    },
  },
};

/**
 * Calculate spore drive stats based on tier and level
 */
export function calculateSporeDriveStats(
  baseStats: Partial<SporeDriveStats>,
  tier: number,
  level: number
): SporeDriveStats {
  const tierMultiplier = 1 + (tier - 1) * 0.12;
  const levelMultiplier = 1 + (level - 1) * 0.06;

  return {
    chargeRate: Math.floor((baseStats.chargeRate || 10) * tierMultiplier * levelMultiplier),
    maxCharge: Math.floor((baseStats.maxCharge || 100) * tierMultiplier * levelMultiplier),
    currentCharge: baseStats.currentCharge || 0,
    efficiency: Math.min(100, (baseStats.efficiency || 60) * tierMultiplier * levelMultiplier),
    accuracy: Math.min(100, (baseStats.accuracy || 70) * tierMultiplier * levelMultiplier),
    range: Math.floor((baseStats.range || 5) * tierMultiplier * levelMultiplier),
    jumpCooldown: Math.max(5, Math.floor((baseStats.jumpCooldown || 60) / tierMultiplier)),
    currentCooldown: 0,
    stability: Math.min(100, (baseStats.stability || 70) * tierMultiplier),
    safetyRating: Math.min(100, (baseStats.safetyRating || 70) * tierMultiplier * levelMultiplier),
    structuralIntegrity: Math.min(100, (baseStats.structuralIntegrity || 90) + (level - 1) * 0.1),
    dimensionalAnchorStrength: Math.min(100, 50 + tier * 2 + level * 0.5),
    mycelialNetworkTaps: Math.min(20, Math.floor((baseStats.mycelialNetworkTaps || 3) * tierMultiplier)),
    sporePurity: Math.min(100, (baseStats.sporePurity || 70) * tierMultiplier * levelMultiplier),
  };
}

/**
 * Calculate spore drive sub-stats based on tier and level
 */
export function calculateSporeDriveSubStats(
  baseSubStats: Partial<SporeDriveSubStats>,
  tier: number,
  level: number
): SporeDriveSubStats {
  const tierMultiplier = 1 + (tier - 1) * 0.1;
  const levelMultiplier = 1 + (level - 1) * 0.05;

  return {
    chargeRateBonus: Math.min(100, (baseSubStats.chargeRateBonus || 0) * tierMultiplier * levelMultiplier),
    efficiencyBonus: Math.min(100, (baseSubStats.efficiencyBonus || 0) * tierMultiplier * levelMultiplier),
    accuracyBonus: Math.min(100, (baseSubStats.accuracyBonus || 0) * tierMultiplier * levelMultiplier),
    rangeBonus: Math.min(100, (baseSubStats.rangeBonus || 0) * tierMultiplier * levelMultiplier),
    stabilityBonus: Math.min(100, (baseSubStats.stabilityBonus || 0) * tierMultiplier * levelMultiplier),
    safetyBonus: Math.min(100, (baseSubStats.safetyBonus || 0) * tierMultiplier * levelMultiplier),
    integrityBonus: Math.min(100, (baseSubStats.integrityBonus || 0) * tierMultiplier * levelMultiplier),
    cooldownReduction: Math.min(50, (baseSubStats.cooldownReduction || 0) * tierMultiplier),
    fuelEfficiency: Math.min(50, (baseSubStats.fuelEfficiency || 0) * tierMultiplier * levelMultiplier),
    navigationSpeed: Math.min(50, (baseSubStats.navigationSpeed || 0) * tierMultiplier * levelMultiplier),
    dimensionalStability: Math.min(100, (baseSubStats.dimensionalStability || 70) * tierMultiplier),
    sporeQuality: Math.min(100, (baseSubStats.sporeQuality || 70) * tierMultiplier * levelMultiplier),
    networkLatency: Math.max(10, (baseSubStats.networkLatency || 100) / tierMultiplier),
    contaminationResistance: Math.min(100, (baseSubStats.contaminationResistance || 60) * tierMultiplier * levelMultiplier),
  };
}

/**
 * Calculate spore drive attributes based on tier and level
 */
export function calculateSporeDriveAttributes(
  baseAttributes: Partial<SporeDriveAttributes>,
  tier: number,
  level: number
): SporeDriveAttributes {
  const tierMultiplier = 1 + (tier - 1) * 0.08;
  const levelMultiplier = 1 + (level - 1) * 0.04;

  return {
    coreDiameter: Math.floor((baseAttributes.coreDiameter || 12) / tierMultiplier),
    coreMass: Math.floor((baseAttributes.coreMass || 350) / tierMultiplier),
    powerConsumption: Math.floor((baseAttributes.powerConsumption || 3500) / tierMultiplier),
    crewRequired: Math.max(2, Math.floor((baseAttributes.crewRequired || 8) / tierMultiplier)),
    mycelialType: baseAttributes.mycelialType || 'standard-strain',
    networkNodes: Math.min(20, Math.floor((baseAttributes.networkNodes || 5) * tierMultiplier)),
    dimensionalFrequency: baseAttributes.dimensionalFrequency || 7.83,
    quantumTunnelingRate: Math.min(1.0, (baseAttributes.quantumTunnelingRate || 0.92) * tierMultiplier * levelMultiplier),
    sporeConsumption: Math.max(0.1, (baseAttributes.sporeConsumption || 1.8) / tierMultiplier),
    energyPerJump: Math.floor((baseAttributes.energyPerJump || 7500) / tierMultiplier),
    maintenanceCost: Math.floor((baseAttributes.maintenanceCost || 35000) / tierMultiplier),
    maxCrewCapacity: Math.floor((baseAttributes.maxCrewCapacity || 200) * tierMultiplier),
    maxCargoMass: Math.floor((baseAttributes.maxCargoMass || 15000) * tierMultiplier),
    restrictedZones: baseAttributes.restrictedZones || [],
  };
}

/**
 * Generate spore drive details
 */
export function generateSporeDriveDetails(
  driveName: string,
  tier: number,
  level: number
): SporeDriveDetails {
  const totalJumps = Math.floor(Math.random() * 1000 * tier * level * 0.1);
  const successfulJumps = Math.floor(totalJumps * (0.85 + Math.random() * 0.14));
  const failedJumps = totalJumps - successfulJumps;

  return {
    installationDate: new Date(Date.now() - Math.random() * 315360000000).toISOString(),
    installedBy: 'Starfleet Engineering Corps',
    lastMaintenance: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
    maintenanceHistory: [
      {
        date: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
        type: 'Routine maintenance',
        performedBy: 'Engineering team',
        notes: 'All systems nominal',
      },
    ],
    totalJumps,
    totalDistanceTraveled: Math.floor(totalJumps * (5 + Math.random() * 20)),
    successfulJumps,
    failedJumps,
    emergencyDisengagements: Math.floor(Math.random() * 5),
    averageJumpTime: Math.floor(3 + Math.random() * 5),
    longestJump: Math.floor(20 + Math.random() * 30),
    shortestJump: Math.floor(0.1 + Math.random() * 2),
    mostDistantDestination: 'Andromeda Galaxy',
    incidents: [],
    upgradesInstalled: level > 10 ? ['enhanced-core'] : [],
    upgradeLevel: level,
    trainedCrew: Math.floor(level * 2),
    chiefEngineer: level > 20 ? 'Engineering Officer' : null,
    navigationSpecialist: level > 30 ? 'Navigation Officer' : null,
  };
}

/**
 * Generate spore drive status
 */
export function generateSporeDriveStatus(tier: number, level: number): SporeDriveStatus {
  const health = Math.min(100, 70 + tier * 0.5 + level * 0.1);
  const state = health > 90 ? 'ready' : 
                health > 75 ? 'standby' :
                health > 50 ? 'cooldown' :
                'malfunction';

  return {
    state: state as SporeDriveState,
    mode: 'standard',
    isOperational: health > 50,
    isEngaged: false,
    currentJump: {
      active: false,
      origin: null,
      destination: null,
      progress: 0,
      estimatedArrival: null,
    },
    health: Math.floor(health),
    coreTemperature: Math.floor(200 + Math.random() * 100),
    radiationLevel: Math.floor(Math.random() * 20),
    contaminationLevel: Math.floor(Math.random() * 10),
    alerts: [],
    systems: {
      core: health > 60,
      navigation: health > 50,
      safety: health > 70,
      containment: health > 55,
      network: health > 65,
    },
    sporeReserves: Math.floor(100 * tier * level * 0.1),
    sporeCapacity: Math.floor(200 * tier * level * 0.1),
    powerLevel: Math.floor(80 + Math.random() * 20),
    currentCooldown: 0,
  };
}

/**
 * Calculate spore drive experience required for next level
 */
export function calculateSporeDriveExperienceRequired(currentLevel: number): number {
  return Math.floor(2000 * Math.pow(1.18, currentLevel - 1));
}

/**
 * Calculate spore drive rarity based on tier and special properties
 */
export function calculateSporeDriveRarity(
  type: string,
  tier: number,
  specialProperties: string[]
): SporeDrive['rarity'] {
  const typeConfig = SPORE_DRIVE_TYPES[type];
  if (!typeConfig) return 'common';

  let rarityScore = tier;

  // Bonus for special properties
  if (specialProperties.includes('ascended')) rarityScore += 20;
  if (specialProperties.includes('transcendent')) rarityScore += 15;
  if (specialProperties.includes('unlimited')) rarityScore += 10;
  if (specialProperties.includes('experimental')) rarityScore += 5;

  if (rarityScore >= 90) return 'ascended';
  if (rarityScore >= 75) return 'mythic';
  if (rarityScore >= 60) return 'legendary';
  if (rarityScore >= 45) return 'epic';
  if (rarityScore >= 30) return 'rare';
  if (rarityScore >= 15) return 'uncommon';
  return 'common';
}

/**
 * Calculate jump distance and time
 */
export function calculateJumpMetrics(
  origin: { x: number; y: number; z: number },
  destination: { x: number; y: number; z: number },
  driveStats: SporeDriveStats,
  driveSubStats: SporeDriveSubStats
): { distance: number; duration: number; accuracy: number } {
  const dx = destination.x - origin.x;
  const dy = destination.y - origin.y;
  const dz = destination.z - origin.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Base duration is 1 second per light-year, modified by stats
  const baseDuration = distance;
  const duration = baseDuration / (1 + driveSubStats.navigationSpeed / 100);

  // Accuracy affected by drive accuracy and stability
  const accuracy = Math.min(100, 
    (driveStats.accuracy + driveSubStats.accuracyBonus) * 
    (driveStats.stability / 100) * 
    (driveSubStats.dimensionalStability / 100)
  );

  return {
    distance: Math.round(distance * 100) / 100,
    duration: Math.round(duration * 100) / 100,
    accuracy: Math.round(accuracy * 100) / 100,
  };
}

/**
 * Calculate spore consumption for a jump
 */
export function calculateSporeConsumption(
  distance: number,
  driveStats: SporeDriveStats,
  driveSubStats: SporeDriveSubStats,
  driveAttributes: SporeDriveAttributes
): number {
  const baseConsumption = distance * driveAttributes.sporeConsumption;
  const efficiencyModifier = 1 - (driveSubStats.fuelEfficiency / 100);
  const purityModifier = 1 - (driveStats.sporePurity / 200); // 0-0.5 reduction

  return Math.ceil(baseConsumption * efficiencyModifier * purityModifier);
}

/**
 * Generate mycelial network nodes
 */
export function generateMycelialNetworkNodes(tier: number, level: number): SporeDrive['networkNodes'] {
  const nodeCount = Math.min(20, 3 + Math.floor(tier / 2) + Math.floor(level / 50));
  const nodes: SporeDrive['networkNodes'] = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: `node-${i + 1}`,
      location: `Mycelial Nexus ${String.fromCharCode(65 + i)}`,
      coordinates: `${Math.floor(Math.random() * 100)}:${Math.floor(Math.random() * 100)}:${Math.floor(Math.random() * 100)}`,
      signalStrength: Math.floor(70 + Math.random() * 30),
      lastContact: Date.now() - Math.floor(Math.random() * 3600000),
      status: Math.random() > 0.1 ? 'active' : Math.random() > 0.5 ? 'degraded' : 'offline',
    });
  }

  return nodes;
}