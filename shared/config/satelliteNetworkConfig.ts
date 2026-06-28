/**
 * SATELLITE NETWORK SYSTEM
 * =============================================================================
 * Comprehensive satellite infrastructure for moons and planets
 * 
 * 90+ Classes | 45 Sub-Classes | 18 Types | 36 Sub-Types
 * Offense Systems | Defense Systems | Shield Matrix | Upgrade Tree
 * Detailed Stats | Sub-Stats | Progression | Specializations
 * 
 * Class Categories:
 *   1. Reconnaissance   (1-15)
 *   2. Communication    (16-30)
 *   3. Defense          (31-45)
 *   4. Offense          (46-60)
 *   5. Resource         (61-75)
 *   6. Specialized      (76-90)
 */

import { ProgressionSystem } from './progressionSystem';

// =============================================================================
// ENUMS & TYPES
// =============================================================================

export type SatelliteClass =
  | 'reconnaissance' | 'communication' | 'defense' | 'offense' | 'resource' | 'specialized';

export type SatelliteSubClass =
  // Reconnaissance (1-3)
  | 'optical-scout' | 'thermal-scanner' | 'deep-space-radar'
  // Communication (4-6)
  | 'relay-transmitter' | 'quantum-entangler' | 'nexus-hub'
  // Defense (7-10)
  | 'point-defense' | 'shield-projector' | 'counter-measure' | 'fortress-grid'
  // Offense (11-14)
  | 'beam-weapon' | 'missile-platform' | 'kinetic-strike' | 'drone-swarm'
  // Resource (15-17)
  | 'mining-drone' | 'refinery-station' | 'harvest-array'
  // Specialized (18-24)
  | 'warp-relay' | 'cloaking-field' | 'repair-bay' | 'gravity-manipulator'
  | 'reality-anchor' | 'life-support' | 'dimensional-gate';

export type SatelliteType =
  | 'nano' | 'micro' | 'standard' | 'heavy' | 'fortress' | 'elite' 
  | 'ancient' | 'experimental' | 'advanced' | 'stealth' | 'command' 
  | 'support' | 'battle-station' | 'orbital-platform' | 'mobile' 
  | 'stationary' | 'auto-constructing' | 'quantum-linked';

export type SatelliteSubType =
  | 'mark-i' | 'mark-ii' | 'mark-iii' | 'mark-iv' | 'mark-v'
  | 'alpha' | 'beta' | 'gamma' | 'delta' | 'epsilon'
  | 'prototype' | 'production' | 'enhanced' | 'superior' | 'ultimate'
  | 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e'
  | 'v1' | 'v2' | 'v3' | 'v4' | 'v5'
  | 'light' | 'medium' | 'heavy' | 'assault' | 'scout' | 'guardian';

export type OrbitalLayer = 'low-orbit' | 'mid-orbit' | 'high-orbit' | 'geosync' | 'deep-space';

export type DeploymentZone = 
  | 'moon-pole' | 'moon-equator' | 'moon-crater'
  | 'planet-pole' | 'planet-equator' | 'planet-lagrange'
  | 'asteroid-belt' | 'interplanetary' | 'orbital-ring';

export type WeaponCategory = 
  | 'laser' | 'plasma' | 'kinetic' | 'explosive' | 'ion' | 'emp' 
  | 'graviton' | 'quantum' | 'disruptor' | 'tachyon' | 'phase' | 'void'
  | 'psionic' | 'composite';

export type ShieldCategory = 
  | 'energy-barrier' | 'deflector' | 'phase-shift' | 'absorbing' 
  | 'reflective' | 'regenerative' | 'adaptive' | 'quantum-lock'
  | 'composite';

export type UpgradePath = 
  | 'power-core' | 'targeting-system' | 'cooling-matrix' | 'armor-plating'
  | 'sensor-array' | 'propulsion' | 'stealth-coating' | 'energy-conduit'
  | 'computing-core' | 'shield-capacitor' | 'weapon-sync' | 'self-repair';

// =============================================================================
// STAT DEFINITIONS
// =============================================================================

export interface SatelliteStats {
  hull: number;
  shield: number;
  armor: number;
  speed: number;
  maneuverability: number;
  sensorRange: number;
  powerOutput: number;
  energyConsumption: number;
  heatDissipation: number;
  signalStrength: number;
  orbitalStability: number;
  durability: number;
}

export interface SatelliteSubStats {
  criticalHitChance: number;
  evasionRating: number;
  targetingAccuracy: number;
  scanResolution: number;
  dataThroughput: number;
  jamResistance: number;
  repairRate: number;
  salvageEfficiency: number;
  warpCooldown: number;
  stealthRating: number;
  radiationHardening: number;
  emShielding: number;
}

export interface OffenseStats {
  baseDamage: number;
  rateOfFire: number;
  damageType: WeaponCategory;
  penetration: number;
  splashRadius: number;
  shieldDamageMultiplier: number;
  armorDamageMultiplier: number;
  criticalMultiplier: number;
  accuracy: number;
  range: number;
  targetingSpeed: number;
  ammoCapacity: number;
  reloadTime: number;
  overheatThreshold: number;
  powerPerShot: number;
}

export interface DefenseStats {
  shieldCapacity: number;
  shieldRecharge: number;
  shieldType: ShieldCategory;
  armorHardness: number;
  damageReduction: number;
  regenerationRate: number;
  resistanceMatrix: Partial<Record<WeaponCategory, number>>;
  vulnerabilityMatrix: Partial<Record<WeaponCategory, number>>;
  absorbtionRate: number;
  reflectionChance: number;
  adaptiveResistance: number;
  emergencyRecharge: number;
}

// =============================================================================
// SATELLITE CLASS DEFINITIONS (90 Classes across 6 Categories)
// =============================================================================

export interface SatelliteClassConfig {
  id: string;
  classNumber: number;
  name: string;
  description: string;
  category: SatelliteClass;
  subClass: SatelliteSubClass;
  type: SatelliteType;
  subType: SatelliteSubType;
  orbitalLayers: OrbitalLayer[];
  deploymentZones: DeploymentZone[];
  
  // Core Stats
  baseStats: SatelliteStats;
  subStats: SatelliteSubStats;
  
  // Combat
  offenseStats: OffenseStats;
  defenseStats: DefenseStats;
  
  // Upgrade paths available
  upgradeSlots: number;
  availableUpgrades: UpgradePath[];
  
  // Build requirements
  buildCost: { metal: number; crystal: number; deuterium: number; energy: number };
  buildTime: number;
  tierRequirement: number;
  tierMax: number;
  levelMax: number;
  
  // Special properties
  specialAbilities: string[];
  synergies: string[];
  
  // Visual
  icon: string;
  color: string;
  size: 'nano' | 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'colossal';
}

// =============================================================================
// 90 SATELLITE CLASSES
// =============================================================================

export const SATELLITE_CLASSES: SatelliteClassConfig[] = [
  // ===========================================================================
  // RECONNAISSANCE CLASS (1-15)
  // ===========================================================================
  {
    id: 'sat-recon-optical-1',
    classNumber: 1,
    name: 'Optical Scout MK-I',
    description: 'Basic optical reconnaissance satellite. Equipped with high-resolution cameras for surface mapping and fleet detection in low orbit.',
    category: 'reconnaissance',
    subClass: 'optical-scout',
    type: 'nano',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-pole', 'planet-pole', 'planet-equator'],
    baseStats: {
      hull: 50, shield: 10, armor: 5, speed: 100, maneuverability: 80,
      sensorRange: 500, powerOutput: 20, energyConsumption: 5,
      heatDissipation: 30, signalStrength: 40, orbitalStability: 85, durability: 30
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 60, targetingAccuracy: 95,
      scanResolution: 80, dataThroughput: 20, jamResistance: 10,
      repairRate: 2, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 40, radiationHardening: 30, emShielding: 20
    },
    offenseStats: {
      baseDamage: 5, rateOfFire: 1, damageType: 'laser', penetration: 0,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.05,
      criticalMultiplier: 1.5, accuracy: 50, range: 10, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 10, shieldRecharge: 1, shieldType: 'energy-barrier',
      armorHardness: 5, damageReduction: 0.05, regenerationRate: 0.5,
      resistanceMatrix: { laser: 0.1, kinetic: -0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 2
    },
    upgradeSlots: 1, availableUpgrades: ['sensor-array', 'stealth-coating', 'power-core'],
    buildCost: { metal: 500, crystal: 300, deuterium: 100, energy: 50 },
    buildTime: 30, tierRequirement: 1, tierMax: 99, levelMax: 999,
    specialAbilities: ['surface-mapping', 'fleet-detection'],
    synergies: ['sat-recon-thermal-2', 'sat-comm-relay-16'],
    icon: '🔭', color: '#87CEEB', size: 'nano'
  },
  {
    id: 'sat-recon-thermal-2',
    classNumber: 2,
    name: 'Thermal Scanner MK-II',
    description: 'Advanced thermal imaging satellite. Detects heat signatures of fleets, planetary activity, and hidden installations through cloud cover and camouflage.',
    category: 'reconnaissance',
    subClass: 'thermal-scanner',
    type: 'micro',
    subType: 'mark-ii',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'asteroid-belt'],
    baseStats: {
      hull: 80, shield: 20, armor: 10, speed: 80, maneuverability: 65,
      sensorRange: 800, powerOutput: 35, energyConsumption: 10,
      heatDissipation: 50, signalStrength: 55, orbitalStability: 80, durability: 45
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 50, targetingAccuracy: 90,
      scanResolution: 85, dataThroughput: 35, jamResistance: 15,
      repairRate: 3, salvageEfficiency: 8, warpCooldown: 0,
      stealthRating: 35, radiationHardening: 45, emShielding: 30
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 1, damageType: 'laser', penetration: 0.1,
      splashRadius: 0, shieldDamageMultiplier: 0.15, armorDamageMultiplier: 0.1,
      criticalMultiplier: 1.5, accuracy: 55, range: 15, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 3
    },
    defenseStats: {
      shieldCapacity: 20, shieldRecharge: 2, shieldType: 'energy-barrier',
      armorHardness: 10, damageReduction: 0.08, regenerationRate: 0.8,
      resistanceMatrix: { laser: 0.15, ion: 0.1 },
      vulnerabilityMatrix: { emp: 0.25, graviton: 0.15 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 3
    },
    upgradeSlots: 1, availableUpgrades: ['sensor-array', 'cooling-matrix', 'power-core'],
    buildCost: { metal: 1000, crystal: 600, deuterium: 200, energy: 80 },
    buildTime: 45, tierRequirement: 2, tierMax: 99, levelMax: 999,
    specialAbilities: ['heat-signature-detection', 'cloak-penetration'],
    synergies: ['sat-recon-optical-1', 'sat-recon-deepspace-3'],
    icon: '🌡️', color: '#FF6347', size: 'tiny'
  },
  {
    id: 'sat-recon-deepspace-3',
    classNumber: 3,
    name: 'Deep Space Radar Array',
    description: 'Long-range deep space radar platform. Scans entire star systems, detects incoming fleets from 3 sectors away, and provides early warning of hostile movements.',
    category: 'reconnaissance',
    subClass: 'deep-space-radar',
    type: 'standard',
    subType: 'mark-iii',
    orbitalLayers: ['high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary', 'orbital-ring'],
    baseStats: {
      hull: 200, shield: 50, armor: 30, speed: 40, maneuverability: 25,
      sensorRange: 5000, powerOutput: 100, energyConsumption: 40,
      heatDissipation: 80, signalStrength: 90, orbitalStability: 75, durability: 120
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 25, targetingAccuracy: 85,
      scanResolution: 95, dataThroughput: 80, jamResistance: 40,
      repairRate: 5, salvageEfficiency: 10, warpCooldown: 0,
      stealthRating: 15, radiationHardening: 60, emShielding: 55
    },
    offenseStats: {
      baseDamage: 12, rateOfFire: 1, damageType: 'laser', penetration: 0.05,
      splashRadius: 0, shieldDamageMultiplier: 0.2, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.5, accuracy: 60, range: 20, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 50, shieldRecharge: 5, shieldType: 'deflector',
      armorHardness: 30, damageReduction: 0.12, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.15 },
      vulnerabilityMatrix: { emp: 0.35, ion: 0.25 },
      absorbtionRate: 0, reflectionChance: 0.05, adaptiveResistance: 0.05, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['sensor-array', 'computing-core', 'power-core', 'cooling-matrix'],
    buildCost: { metal: 5000, crystal: 3000, deuterium: 1000, energy: 300 },
    buildTime: 120, tierRequirement: 5, tierMax: 99, levelMax: 999,
    specialAbilities: ['sector-wide-scan', 'early-warning', 'fleet-trajectory-analysis'],
    synergies: ['sat-recon-optical-1', 'sat-recon-thermal-2', 'sat-comm-nexus-18'],
    icon: '📡', color: '#00CED1', size: 'small'
  },
  {
    id: 'sat-recon-stealth-4',
    classNumber: 4,
    name: 'Shadow Probe',
    description: 'Stealth reconnaissance satellite with cloaking technology. Can infiltrate enemy territory undetected to gather intelligence on fleet compositions and defenses.',
    category: 'reconnaissance',
    subClass: 'optical-scout',
    type: 'stealth',
    subType: 'alpha',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-crater', 'planet-pole', 'asteroid-belt'],
    baseStats: {
      hull: 60, shield: 15, armor: 8, speed: 150, maneuverability: 90,
      sensorRange: 600, powerOutput: 25, energyConsumption: 15,
      heatDissipation: 40, signalStrength: 20, orbitalStability: 70, durability: 35
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 75, targetingAccuracy: 70,
      scanResolution: 75, dataThroughput: 30, jamResistance: 50,
      repairRate: 2, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 95, radiationHardening: 40, emShielding: 60
    },
    offenseStats: {
      baseDamage: 10, rateOfFire: 2, damageType: 'laser', penetration: 0.15,
      splashRadius: 0, shieldDamageMultiplier: 0.2, armorDamageMultiplier: 0.15,
      criticalMultiplier: 2.0, accuracy: 65, range: 12, targetingSpeed: 6,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 80, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 15, shieldRecharge: 2, shieldType: 'phase-shift',
      armorHardness: 8, damageReduction: 0.06, regenerationRate: 0.5,
      resistanceMatrix: { emp: 0.3, ion: 0.2 },
      vulnerabilityMatrix: { graviton: 0.3, kinetic: 0.2 },
      absorbtionRate: 0.05, reflectionChance: 0.02, adaptiveResistance: 0.05, emergencyRecharge: 2
    },
    upgradeSlots: 2, availableUpgrades: ['stealth-coating', 'sensor-array', 'propulsion', 'computing-core'],
    buildCost: { metal: 3000, crystal: 4000, deuterium: 1500, energy: 200 },
    buildTime: 90, tierRequirement: 4, tierMax: 99, levelMax: 999,
    specialAbilities: ['active-cloak', 'emission-nullification', 'enemy-intel-gathering'],
    synergies: ['sat-recon-optical-1', 'sat-specialized-cloak-78'],
    icon: '👻', color: '#2F4F4F', size: 'tiny'
  },
  {
    id: 'sat-recon-quantum-5',
    classNumber: 5,
    name: 'Quantum Observer',
    description: 'Experimental quantum-entangled observation satellite. Provides instant data transmission across any distance and can perceive through most forms of interference.',
    category: 'reconnaissance',
    subClass: 'deep-space-radar',
    type: 'experimental',
    subType: 'prototype',
    orbitalLayers: ['geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary', 'orbital-ring'],
    baseStats: {
      hull: 150, shield: 40, armor: 20, speed: 60, maneuverability: 40,
      sensorRange: 10000, powerOutput: 150, energyConsumption: 60,
      heatDissipation: 70, signalStrength: 100, orbitalStability: 65, durability: 100
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 35, targetingAccuracy: 90,
      scanResolution: 100, dataThroughput: 200, jamResistance: 80,
      repairRate: 4, salvageEfficiency: 12, warpCooldown: 0,
      stealthRating: 25, radiationHardening: 70, emShielding: 75
    },
    offenseStats: {
      baseDamage: 20, rateOfFire: 2, damageType: 'quantum', penetration: 0.4,
      splashRadius: 0, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.3,
      criticalMultiplier: 2.5, accuracy: 75, range: 30, targetingSpeed: 8,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 60, powerPerShot: 10
    },
    defenseStats: {
      shieldCapacity: 40, shieldRecharge: 4, shieldType: 'quantum-lock',
      armorHardness: 20, damageReduction: 0.15, regenerationRate: 2,
      resistanceMatrix: { emp: 0.5, ion: 0.4, graviton: 0.3 },
      vulnerabilityMatrix: { void: 0.4, tachyon: 0.3 },
      absorbtionRate: 0.1, reflectionChance: 0.08, adaptiveResistance: 0.1, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['computing-core', 'sensor-array', 'energy-conduit', 'cooling-matrix', 'power-core'],
    buildCost: { metal: 15000, crystal: 20000, deuterium: 8000, energy: 1000 },
    buildTime: 300, tierRequirement: 15, tierMax: 99, levelMax: 999,
    specialAbilities: ['quantum-entanglement-comm', 'instant-data-relay', 'interdimensional-scan'],
    synergies: ['sat-comm-quantum-20', 'sat-specialized-dimensional-85'],
    icon: '🌀', color: '#8A2BE2', size: 'small'
  },
  {
    id: 'sat-recon-survey-6',
    classNumber: 6,
    name: 'Planetary Surveyor',
    description: 'Specialized geological and atmospheric survey satellite. Maps planetary resources, identifies mineral deposits, and assesses terraforming potential.',
    category: 'reconnaissance',
    subClass: 'optical-scout',
    type: 'advanced',
    subType: 'beta',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-pole'],
    baseStats: {
      hull: 100, shield: 25, armor: 15, speed: 70, maneuverability: 55,
      sensorRange: 400, powerOutput: 40, energyConsumption: 12,
      heatDissipation: 45, signalStrength: 50, orbitalStability: 90, durability: 60
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 40, targetingAccuracy: 75,
      scanResolution: 90, dataThroughput: 45, jamResistance: 20,
      repairRate: 4, salvageEfficiency: 15, warpCooldown: 0,
      stealthRating: 20, radiationHardening: 50, emShielding: 35
    },
    offenseStats: {
      baseDamage: 6, rateOfFire: 1, damageType: 'laser', penetration: 0.05,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.5, accuracy: 70, range: 8, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 25, shieldRecharge: 3, shieldType: 'deflector',
      armorHardness: 15, damageReduction: 0.1, regenerationRate: 1,
      resistanceMatrix: { kinetic: 0.15, explosive: 0.1 },
      vulnerabilityMatrix: { emp: 0.2, ion: 0.15 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 3
    },
    upgradeSlots: 2, availableUpgrades: ['sensor-array', 'computing-core', 'power-core'],
    buildCost: { metal: 2000, crystal: 1500, deuterium: 500, energy: 150 },
    buildTime: 60, tierRequirement: 3, tierMax: 99, levelMax: 999,
    specialAbilities: ['resource-mapping', 'mineral-detection', 'terraform-assessment'],
    synergies: ['sat-resource-mining-61', 'sat-resource-harvest-63'],
    icon: '🗺️', color: '#32CD32', size: 'tiny'
  },
  {
    id: 'sat-recon-holographic-7',
    classNumber: 7,
    name: 'Holographic Observer MK-IV',
    description: 'Advanced holographic reconnaissance satellite. Creates detailed 3D holographic maps of entire planetary surfaces and can detect structural weaknesses.',
    category: 'reconnaissance',
    subClass: 'optical-scout',
    type: 'advanced',
    subType: 'mark-iv',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange'],
    baseStats: {
      hull: 120, shield: 30, armor: 18, speed: 65, maneuverability: 50,
      sensorRange: 1200, powerOutput: 55, energyConsumption: 18,
      heatDissipation: 55, signalStrength: 65, orbitalStability: 82, durability: 70
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 45, targetingAccuracy: 88,
      scanResolution: 92, dataThroughput: 60, jamResistance: 25,
      repairRate: 3, salvageEfficiency: 8, warpCooldown: 0,
      stealthRating: 30, radiationHardening: 45, emShielding: 40
    },
    offenseStats: {
      baseDamage: 9, rateOfFire: 2, damageType: 'laser', penetration: 0.08,
      splashRadius: 0, shieldDamageMultiplier: 0.18, armorDamageMultiplier: 0.12,
      criticalMultiplier: 1.8, accuracy: 72, range: 14, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 90, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 30, shieldRecharge: 3, shieldType: 'phase-shift',
      armorHardness: 18, damageReduction: 0.12, regenerationRate: 1.2,
      resistanceMatrix: { laser: 0.2, ion: 0.15 },
      vulnerabilityMatrix: { emp: 0.2, graviton: 0.15 },
      absorbtionRate: 0.02, reflectionChance: 0.03, adaptiveResistance: 0.02, emergencyRecharge: 4
    },
    upgradeSlots: 2, availableUpgrades: ['sensor-array', 'computing-core', 'energy-conduit'],
    buildCost: { metal: 4000, crystal: 3000, deuterium: 1000, energy: 250 },
    buildTime: 90, tierRequirement: 6, tierMax: 99, levelMax: 999,
    specialAbilities: ['holographic-mapping', 'structural-analysis', 'terrain-simulation'],
    synergies: ['sat-recon-survey-6', 'sat-comm-relay-16'],
    icon: '🔄', color: '#FF69B4', size: 'small'
  },
  {
    id: 'sat-recon-nanite-8',
    classNumber: 8,
    name: 'Nanite Swarm Probe',
    description: 'Revolutionary satellite composed of billions of nanites that disperse across the target area. Each nanite acts as an individual sensor, providing unprecedented detail.',
    category: 'reconnaissance',
    subClass: 'optical-scout',
    type: 'auto-constructing',
    subType: 'prototype',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-crater', 'asteroid-belt', 'planet-pole'],
    baseStats: {
      hull: 40, shield: 5, armor: 2, speed: 200, maneuverability: 95,
      sensorRange: 300, powerOutput: 10, energyConsumption: 8,
      heatDissipation: 20, signalStrength: 15, orbitalStability: 50, durability: 15
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 85, targetingAccuracy: 60,
      scanResolution: 98, dataThroughput: 100, jamResistance: 60,
      repairRate: 25, salvageEfficiency: 40, warpCooldown: 0,
      stealthRating: 80, radiationHardening: 25, emShielding: 50
    },
    offenseStats: {
      baseDamage: 3, rateOfFire: 5, damageType: 'kinetic', penetration: 0.02,
      splashRadius: 0, shieldDamageMultiplier: 0.05, armorDamageMultiplier: 0.03,
      criticalMultiplier: 1.2, accuracy: 45, range: 5, targetingSpeed: 10,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 120, powerPerShot: 1
    },
    defenseStats: {
      shieldCapacity: 5, shieldRecharge: 1, shieldType: 'adaptive',
      armorHardness: 2, damageReduction: 0.02, regenerationRate: 3,
      resistanceMatrix: { kinetic: 0.3, laser: 0.2 },
      vulnerabilityMatrix: { emp: 0.5, plasma: 0.4 },
      absorbtionRate: 0.2, reflectionChance: 0.01, adaptiveResistance: 0.15, emergencyRecharge: 1
    },
    upgradeSlots: 1, availableUpgrades: ['self-repair', 'sensor-array', 'stealth-coating'],
    buildCost: { metal: 6000, crystal: 8000, deuterium: 3000, energy: 500 },
    buildTime: 180, tierRequirement: 10, tierMax: 99, levelMax: 999,
    specialAbilities: ['self-replication', 'area-denial-survey', 'micro-sensor-grid'],
    synergies: ['sat-specialized-repair-80', 'sat-recon-survey-6'],
    icon: '🦠', color: '#00FA9A', size: 'nano'
  },
  {
    id: 'sat-recon-warp-9',
    classNumber: 9,
    name: 'Warp Scout Explorer',
    description: 'Exploration satellite with experimental micro-warp drive. Can rapidly traverse star systems and report on uncharted territories with real-time data.',
    category: 'reconnaissance',
    subClass: 'deep-space-radar',
    type: 'mobile',
    subType: 'gamma',
    orbitalLayers: ['deep-space'],
    deploymentZones: ['interplanetary', 'asteroid-belt'],
    baseStats: {
      hull: 180, shield: 35, armor: 25, speed: 500, maneuverability: 60,
      sensorRange: 3000, powerOutput: 80, energyConsumption: 50,
      heatDissipation: 65, signalStrength: 70, orbitalStability: 55, durability: 85
    },
    subStats: {
      criticalHitChance: 6, evasionRating: 55, targetingAccuracy: 80,
      scanResolution: 88, dataThroughput: 70, jamResistance: 35,
      repairRate: 3, salvageEfficiency: 20, warpCooldown: 60,
      stealthRating: 50, radiationHardening: 55, emShielding: 45
    },
    offenseStats: {
      baseDamage: 15, rateOfFire: 2, damageType: 'kinetic', penetration: 0.12,
      splashRadius: 5, shieldDamageMultiplier: 0.25, armorDamageMultiplier: 0.18,
      criticalMultiplier: 2.0, accuracy: 68, range: 25, targetingSpeed: 6,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 70, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 35, shieldRecharge: 4, shieldType: 'absorbing',
      armorHardness: 25, damageReduction: 0.14, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.2 },
      vulnerabilityMatrix: { graviton: 0.3, tachyon: 0.25 },
      absorbtionRate: 0.08, reflectionChance: 0.04, adaptiveResistance: 0.05, emergencyRecharge: 5
    },
    upgradeSlots: 3, availableUpgrades: ['propulsion', 'sensor-array', 'power-core', 'energy-conduit'],
    buildCost: { metal: 8000, crystal: 6000, deuterium: 4000, energy: 600 },
    buildTime: 200, tierRequirement: 8, tierMax: 99, levelMax: 999,
    specialAbilities: ['micro-warp-drive', 'system-survey', 'auto-navigation'],
    synergies: ['sat-specialized-warp-76', 'sat-comm-nexus-18'],
    icon: '🚀', color: '#FF4500', size: 'small'
  },
  {
    id: 'sat-recon-biometric-10',
    classNumber: 10,
    name: 'Biometric Scanner',
    description: 'Specialized biological reconnaissance satellite. Detects life signs, population density, and biological threats on planetary surfaces.',
    category: 'reconnaissance',
    subClass: 'thermal-scanner',
    type: 'advanced',
    subType: 'delta',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-pole'],
    baseStats: {
      hull: 90, shield: 22, armor: 12, speed: 75, maneuverability: 58,
      sensorRange: 350, powerOutput: 30, energyConsumption: 10,
      heatDissipation: 42, signalStrength: 48, orbitalStability: 88, durability: 55
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 42, targetingAccuracy: 82,
      scanResolution: 86, dataThroughput: 35, jamResistance: 18,
      repairRate: 3, salvageEfficiency: 6, warpCooldown: 0,
      stealthRating: 25, radiationHardening: 42, emShielding: 32
    },
    offenseStats: {
      baseDamage: 7, rateOfFire: 1, damageType: 'ion', penetration: 0.06,
      splashRadius: 0, shieldDamageMultiplier: 0.12, armorDamageMultiplier: 0.06,
      criticalMultiplier: 1.5, accuracy: 58, range: 11, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 3
    },
    defenseStats: {
      shieldCapacity: 22, shieldRecharge: 2, shieldType: 'energy-barrier',
      armorHardness: 12, damageReduction: 0.09, regenerationRate: 0.8,
      resistanceMatrix: { ion: 0.15, laser: 0.1 },
      vulnerabilityMatrix: { emp: 0.22, plasma: 0.18 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 3
    },
    upgradeSlots: 2, availableUpgrades: ['sensor-array', 'computing-core', 'power-core'],
    buildCost: { metal: 2500, crystal: 2000, deuterium: 600, energy: 120 },
    buildTime: 55, tierRequirement: 4, tierMax: 99, levelMax: 999,
    specialAbilities: ['life-sign-detection', 'population-scan', 'bio-hazard-alert'],
    synergies: ['sat-recon-thermal-2', 'sat-recon-survey-6'],
    icon: '🧬', color: '#FF1493', size: 'tiny'
  },
  {
    id: 'sat-recon-gravity-11',
    classNumber: 11,
    name: 'Gravity Wave Detector',
    description: 'Ultra-sensitive gravitational observatory. Detects gravitational anomalies, hidden masses, and wormhole signatures. Also provides navigation corrections.',
    category: 'reconnaissance',
    subClass: 'deep-space-radar',
    type: 'heavy',
    subType: 'epsilon',
    orbitalLayers: ['high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary', 'orbital-ring'],
    baseStats: {
      hull: 350, shield: 80, armor: 50, speed: 20, maneuverability: 15,
      sensorRange: 20000, powerOutput: 200, energyConsumption: 80,
      heatDissipation: 100, signalStrength: 95, orbitalStability: 92, durability: 200
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 10, targetingAccuracy: 92,
      scanResolution: 96, dataThroughput: 90, jamResistance: 70,
      repairRate: 2, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 80, emShielding: 85
    },
    offenseStats: {
      baseDamage: 5, rateOfFire: 1, damageType: 'graviton', penetration: 0.5,
      splashRadius: 0, shieldDamageMultiplier: 1.0, armorDamageMultiplier: 0.5,
      criticalMultiplier: 1.0, accuracy: 90, range: 50, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 40, powerPerShot: 20
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 8, shieldType: 'deflector',
      armorHardness: 50, damageReduction: 0.2, regenerationRate: 2,
      resistanceMatrix: { graviton: 0.5, kinetic: 0.3 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0.05, reflectionChance: 0.02, adaptiveResistance: 0.05, emergencyRecharge: 10
    },
    upgradeSlots: 3, availableUpgrades: ['sensor-array', 'computing-core', 'power-core', 'cooling-matrix'],
    buildCost: { metal: 20000, crystal: 15000, deuterium: 8000, energy: 1500 },
    buildTime: 360, tierRequirement: 12, tierMax: 99, levelMax: 999,
    specialAbilities: ['gravity-anomaly-detection', 'wormhole-detection', 'navigation-correction'],
    synergies: ['sat-specialized-gravity-82', 'sat-comm-navigation-22'],
    icon: '🌊', color: '#4B0082', size: 'medium'
  },
  {
    id: 'sat-recon-tachyon-12',
    classNumber: 12,
    name: 'Tachyon Beacon Tracker',
    description: 'Detects tachyon emissions from faster-than-light communications and drives. Can pinpoint the location of FTL activations across multiple sectors.',
    category: 'reconnaissance',
    subClass: 'deep-space-radar',
    type: 'elite',
    subType: 'superior',
    orbitalLayers: ['geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary'],
    baseStats: {
      hull: 250, shield: 60, armor: 35, speed: 35, maneuverability: 25,
      sensorRange: 15000, powerOutput: 130, energyConsumption: 55,
      heatDissipation: 85, signalStrength: 92, orbitalStability: 78, durability: 140
    },
    subStats: {
      criticalHitChance: 7, evasionRating: 20, targetingAccuracy: 88,
      scanResolution: 94, dataThroughput: 110, jamResistance: 55,
      repairRate: 3, salvageEfficiency: 8, warpCooldown: 0,
      stealthRating: 10, radiationHardening: 65, emShielding: 70
    },
    offenseStats: {
      baseDamage: 18, rateOfFire: 2, damageType: 'tachyon', penetration: 0.45,
      splashRadius: 0, shieldDamageMultiplier: 0.6, armorDamageMultiplier: 0.4,
      criticalMultiplier: 2.2, accuracy: 78, range: 35, targetingSpeed: 7,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 55, powerPerShot: 12
    },
    defenseStats: {
      shieldCapacity: 60, shieldRecharge: 6, shieldType: 'phase-shift',
      armorHardness: 35, damageReduction: 0.18, regenerationRate: 2,
      resistanceMatrix: { tachyon: 0.4, quantum: 0.3, graviton: 0.2 },
      vulnerabilityMatrix: { void: 0.35, disruptor: 0.25 },
      absorbtionRate: 0.06, reflectionChance: 0.05, adaptiveResistance: 0.08, emergencyRecharge: 7
    },
    upgradeSlots: 3, availableUpgrades: ['sensor-array', 'computing-core', 'energy-conduit', 'targeting-system'],
    buildCost: { metal: 12000, crystal: 16000, deuterium: 6000, energy: 900 },
    buildTime: 280, tierRequirement: 14, tierMax: 99, levelMax: 999,
    specialAbilities: ['ftl-emission-detection', 'sector-traffic-monitoring', 'wake-trail-analysis'],
    synergies: ['sat-comm-quantum-20', 'sat-specialized-warp-76'],
    icon: '⚡', color: '#FFD700', size: 'small'
  },
  {
    id: 'sat-recon-vision-13',
    classNumber: 13,
    name: 'Multi-Spectral Eye',
    description: 'Combines optical, thermal, radar, gravity, tachyon, and quantum sensors into a single platform. The ultimate surveillance satellite covering all detection spectra.',
    category: 'reconnaissance',
    subClass: 'optical-scout',
    type: 'command',
    subType: 'ultimate',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 400, shield: 100, armor: 60, speed: 50, maneuverability: 35,
      sensorRange: 25000, powerOutput: 300, energyConsumption: 120,
      heatDissipation: 150, signalStrength: 98, orbitalStability: 85, durability: 250
    },
    subStats: {
      criticalHitChance: 10, evasionRating: 30, targetingAccuracy: 95,
      scanResolution: 99, dataThroughput: 250, jamResistance: 85,
      repairRate: 5, salvageEfficiency: 15, warpCooldown: 0,
      stealthRating: 20, radiationHardening: 85, emShielding: 90
    },
    offenseStats: {
      baseDamage: 25, rateOfFire: 3, damageType: 'phase', penetration: 0.35,
      splashRadius: 3, shieldDamageMultiplier: 0.4, armorDamageMultiplier: 0.3,
      criticalMultiplier: 2.5, accuracy: 85, range: 40, targetingSpeed: 9,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 50, powerPerShot: 15
    },
    defenseStats: {
      shieldCapacity: 100, shieldRecharge: 10, shieldType: 'adaptive',
      armorHardness: 60, damageReduction: 0.25, regenerationRate: 3,
      resistanceMatrix: { laser: 0.3, kinetic: 0.3, ion: 0.3, emp: 0.3 },
      vulnerabilityMatrix: { void: 0.3, graviton: 0.2 },
      absorbtionRate: 0.1, reflectionChance: 0.08, adaptiveResistance: 0.12, emergencyRecharge: 15
    },
    upgradeSlots: 4, availableUpgrades: ['sensor-array', 'computing-core', 'power-core', 'cooling-matrix', 'energy-conduit'],
    buildCost: { metal: 35000, crystal: 30000, deuterium: 15000, energy: 2500 },
    buildTime: 600, tierRequirement: 20, tierMax: 99, levelMax: 999,
    specialAbilities: ['full-spectrum-analysis', 'real-time-intel-feed', 'multi-target-tracking', 'predictive-mapping'],
    synergies: ['sat-comm-nexus-18', 'sat-defense-fortress-37'],
    icon: '👁️', color: '#00BFFF', size: 'medium'
  },
  {
    id: 'sat-recon-psi-14',
    classNumber: 14,
    name: 'Psionic Observer',
    description: 'Rare alien-derived satellite using psychic resonance technology. Detects sentient thought patterns, hostile intent, and psionic disturbances across vast distances.',
    category: 'reconnaissance',
    subClass: 'thermal-scanner',
    type: 'ancient',
    subType: 'alpha',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 280, shield: 70, armor: 40, speed: 30, maneuverability: 20,
      sensorRange: 8000, powerOutput: 160, energyConsumption: 70,
      heatDissipation: 90, signalStrength: 85, orbitalStability: 72, durability: 160
    },
    subStats: {
      criticalHitChance: 12, evasionRating: 15, targetingAccuracy: 85,
      scanResolution: 93, dataThroughput: 80, jamResistance: 75,
      repairRate: 4, salvageEfficiency: 10, warpCooldown: 0,
      stealthRating: 60, radiationHardening: 60, emShielding: 65
    },
    offenseStats: {
      baseDamage: 30, rateOfFire: 1, damageType: 'disruptor', penetration: 0.55,
      splashRadius: 2, shieldDamageMultiplier: 0.7, armorDamageMultiplier: 0.35,
      criticalMultiplier: 3.0, accuracy: 82, range: 28, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 45, powerPerShot: 18
    },
    defenseStats: {
      shieldCapacity: 70, shieldRecharge: 7, shieldType: 'phase-shift',
      armorHardness: 40, damageReduction: 0.22, regenerationRate: 2.5,
      resistanceMatrix: { disruptor: 0.5, psionic: 0.6, emp: 0.4 },
      vulnerabilityMatrix: { kinetic: 0.2, plasma: 0.25 },
      absorbtionRate: 0.12, reflectionChance: 0.06, adaptiveResistance: 0.15, emergencyRecharge: 9
    },
    upgradeSlots: 3, availableUpgrades: ['sensor-array', 'computing-core', 'stealth-coating', 'energy-conduit'],
    buildCost: { metal: 25000, crystal: 35000, deuterium: 10000, energy: 2000 },
    buildTime: 500, tierRequirement: 18, tierMax: 99, levelMax: 999,
    specialAbilities: ['thought-pattern-detection', 'intent-scanning', 'psionic-interference'],
    synergies: ['sat-recon-quantum-5', 'sat-specialized-reality-84'],
    icon: '🧠', color: '#9932CC', size: 'small'
  },
  {
    id: 'sat-recon-timeline-15',
    classNumber: 15,
    name: 'Timeline Observer',
    description: 'Mythical satellite that peers into possible futures. Uses probability-wave analysis to predict enemy movements and outcomes of fleet engagements.',
    category: 'reconnaissance',
    subClass: 'deep-space-radar',
    type: 'ancient',
    subType: 'ultimate',
    orbitalLayers: ['deep-space'],
    deploymentZones: ['interplanetary'],
    baseStats: {
      hull: 500, shield: 150, armor: 80, speed: 10, maneuverability: 10,
      sensorRange: 50000, powerOutput: 500, energyConsumption: 200,
      heatDissipation: 200, signalStrength: 100, orbitalStability: 95, durability: 350
    },
    subStats: {
      criticalHitChance: 15, evasionRating: 5, targetingAccuracy: 98,
      scanResolution: 100, dataThroughput: 500, jamResistance: 95,
      repairRate: 8, salvageEfficiency: 25, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 90, emShielding: 95
    },
    offenseStats: {
      baseDamage: 50, rateOfFire: 1, damageType: 'tachyon', penetration: 0.8,
      splashRadius: 0, shieldDamageMultiplier: 1.0, armorDamageMultiplier: 0.8,
      criticalMultiplier: 4.0, accuracy: 95, range: 60, targetingSpeed: 10,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 30, powerPerShot: 30
    },
    defenseStats: {
      shieldCapacity: 150, shieldRecharge: 15, shieldType: 'quantum-lock',
      armorHardness: 80, damageReduction: 0.35, regenerationRate: 4,
      resistanceMatrix: { laser: 0.4, kinetic: 0.4, explosive: 0.4, ion: 0.4, graviton: 0.4 },
      vulnerabilityMatrix: { void: 0.2, tachyon: 0.15 },
      absorbtionRate: 0.15, reflectionChance: 0.12, adaptiveResistance: 0.2, emergencyRecharge: 20
    },
    upgradeSlots: 5, availableUpgrades: ['sensor-array', 'computing-core', 'power-core', 'energy-conduit', 'targeting-system', 'self-repair'],
    buildCost: { metal: 100000, crystal: 80000, deuterium: 40000, energy: 10000 },
    buildTime: 1800, tierRequirement: 50, tierMax: 99, levelMax: 999,
    specialAbilities: ['probability-scanning', 'future-sight', 'timeline-analysis', 'predictive-combat-modeling'],
    synergies: ['sat-recon-quantum-5', 'sat-comm-nexus-18', 'sat-specialized-dimensional-85'],
    icon: '⏳', color: '#C0C0C0', size: 'medium'
  },

  // ===========================================================================
  // COMMUNICATION CLASS (16-30)
  // ===========================================================================
  {
    id: 'sat-comm-relay-16',
    classNumber: 16,
    name: 'Relay Transmitter MK-I',
    description: 'Standard communication relay satellite. Boosts signal strength across the system, enabling faster fleet command and data transmission.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-pole', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 80, shield: 20, armor: 10, speed: 60, maneuverability: 45,
      sensorRange: 200, powerOutput: 50, energyConsumption: 15,
      heatDissipation: 35, signalStrength: 60, orbitalStability: 85, durability: 50
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 35, targetingAccuracy: 60,
      scanResolution: 30, dataThroughput: 50, jamResistance: 20,
      repairRate: 3, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 10, radiationHardening: 35, emShielding: 40
    },
    offenseStats: {
      baseDamage: 4, rateOfFire: 1, damageType: 'laser', penetration: 0.02,
      splashRadius: 0, shieldDamageMultiplier: 0.08, armorDamageMultiplier: 0.04,
      criticalMultiplier: 1.2, accuracy: 45, range: 8, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 20, shieldRecharge: 2, shieldType: 'energy-barrier',
      armorHardness: 10, damageReduction: 0.06, regenerationRate: 0.8,
      resistanceMatrix: { laser: 0.1, kinetic: 0.05 },
      vulnerabilityMatrix: { emp: 0.4, ion: 0.3 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 2
    },
    upgradeSlots: 1, availableUpgrades: ['power-core', 'cooling-matrix', 'energy-conduit'],
    buildCost: { metal: 800, crystal: 500, deuterium: 200, energy: 80 },
    buildTime: 40, tierRequirement: 1, tierMax: 99, levelMax: 999,
    specialAbilities: ['signal-boost', 'fleet-command-relay'],
    synergies: ['sat-comm-quantum-20', 'sat-comm-nexus-18'],
    icon: '📶', color: '#4682B4', size: 'tiny'
  },
  {
    id: 'sat-comm-encryption-17',
    classNumber: 17,
    name: 'Encryption Relay MK-II',
    description: 'Secure communication satellite with advanced quantum encryption. Protects fleet communications from interception and decryption.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'advanced',
    subType: 'mark-ii',
    orbitalLayers: ['mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 100, shield: 30, armor: 15, speed: 50, maneuverability: 40,
      sensorRange: 300, powerOutput: 70, energyConsumption: 22,
      heatDissipation: 40, signalStrength: 70, orbitalStability: 82, durability: 65
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 30, targetingAccuracy: 65,
      scanResolution: 40, dataThroughput: 80, jamResistance: 60,
      repairRate: 4, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 15, radiationHardening: 40, emShielding: 60
    },
    offenseStats: {
      baseDamage: 6, rateOfFire: 1, damageType: 'laser', penetration: 0.04,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.06,
      criticalMultiplier: 1.3, accuracy: 50, range: 10, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 3
    },
    defenseStats: {
      shieldCapacity: 30, shieldRecharge: 3, shieldType: 'energy-barrier',
      armorHardness: 15, damageReduction: 0.08, regenerationRate: 1,
      resistanceMatrix: { emp: 0.3, ion: 0.2, laser: 0.1 },
      vulnerabilityMatrix: { graviton: 0.2, kinetic: 0.1 },
      absorbtionRate: 0, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 3
    },
    upgradeSlots: 2, availableUpgrades: ['computing-core', 'energy-conduit', 'power-core'],
    buildCost: { metal: 2500, crystal: 2000, deuterium: 800, energy: 150 },
    buildTime: 70, tierRequirement: 3, tierMax: 99, levelMax: 999,
    specialAbilities: ['quantum-encryption', 'secure-channel', 'anti-spoofing'],
    synergies: ['sat-comm-relay-16', 'sat-comm-nexus-18'],
    icon: '🔐', color: '#4169E1', size: 'tiny'
  },
  {
    id: 'sat-comm-nexus-18',
    classNumber: 18,
    name: 'Nexus Command Hub',
    description: 'Central command and control satellite. Acts as a network hub for all satellites in the system, providing command bonuses and coordinated targeting.',
    category: 'communication',
    subClass: 'nexus-hub',
    type: 'command',
    subType: 'mark-iii',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 500, shield: 150, armor: 80, speed: 15, maneuverability: 10,
      sensorRange: 1000, powerOutput: 250, energyConsumption: 80,
      heatDissipation: 120, signalStrength: 95, orbitalStability: 90, durability: 300
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 10, targetingAccuracy: 95,
      scanResolution: 70, dataThroughput: 500, jamResistance: 80,
      repairRate: 6, salvageEfficiency: 10, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 75, emShielding: 80
    },
    offenseStats: {
      baseDamage: 15, rateOfFire: 2, damageType: 'phase', penetration: 0.2,
      splashRadius: 5, shieldDamageMultiplier: 0.3, armorDamageMultiplier: 0.2,
      criticalMultiplier: 2.0, accuracy: 75, range: 20, targetingSpeed: 8,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 60, powerPerShot: 10
    },
    defenseStats: {
      shieldCapacity: 150, shieldRecharge: 12, shieldType: 'adaptive',
      armorHardness: 80, damageReduction: 0.25, regenerationRate: 3,
      resistanceMatrix: { laser: 0.25, kinetic: 0.25, explosive: 0.25, ion: 0.25 },
      vulnerabilityMatrix: { graviton: 0.3, void: 0.25 },
      absorbtionRate: 0.08, reflectionChance: 0.05, adaptiveResistance: 0.1, emergencyRecharge: 15
    },
    upgradeSlots: 4, availableUpgrades: ['computing-core', 'energy-conduit', 'power-core', 'targeting-system', 'shield-capacitor'],
    buildCost: { metal: 20000, crystal: 15000, deuterium: 8000, energy: 2000 },
    buildTime: 450, tierRequirement: 10, tierMax: 99, levelMax: 999,
    specialAbilities: ['network-coordination', 'targeting-sync', 'command-bonus', 'emergency-relay'],
    synergies: ['sat-comm-relay-16', 'sat-comm-encryption-17', 'sat-comm-quantum-20'],
    icon: '🎯', color: '#FFD700', size: 'medium'
  },
  {
    id: 'sat-comm-booster-19',
    classNumber: 19,
    name: 'Signal Booster Array',
    description: 'High-gain signal amplification satellite. Extends communication range across interstellar distances and penetrates interference zones.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'heavy',
    subType: 'type-a',
    orbitalLayers: ['high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary', 'orbital-ring'],
    baseStats: {
      hull: 200, shield: 50, armor: 30, speed: 30, maneuverability: 20,
      sensorRange: 500, powerOutput: 150, energyConsumption: 45,
      heatDissipation: 70, signalStrength: 90, orbitalStability: 80, durability: 120
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 20, targetingAccuracy: 70,
      scanResolution: 45, dataThroughput: 150, jamResistance: 45,
      repairRate: 4, salvageEfficiency: 6, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 55, emShielding: 50
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 1, damageType: 'laser', penetration: 0.05,
      splashRadius: 0, shieldDamageMultiplier: 0.12, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.4, accuracy: 55, range: 12, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 85, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 50, shieldRecharge: 5, shieldType: 'deflector',
      armorHardness: 30, damageReduction: 0.12, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.15, laser: 0.1 },
      vulnerabilityMatrix: { emp: 0.35, ion: 0.25 },
      absorbtionRate: 0.03, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['power-core', 'cooling-matrix', 'energy-conduit'],
    buildCost: { metal: 6000, crystal: 4000, deuterium: 2000, energy: 400 },
    buildTime: 120, tierRequirement: 6, tierMax: 99, levelMax: 999,
    specialAbilities: ['long-range-boost', 'interference-penetration', 'sector-broadcast'],
    synergies: ['sat-comm-relay-16', 'sat-comm-nexus-18'],
    icon: '📢', color: '#FFA500', size: 'small'
  },
  {
    id: 'sat-comm-quantum-20',
    classNumber: 20,
    name: 'Quantum Entangler',
    description: 'Uses quantum entanglement for instantaneous communication across any distance. Immune to conventional jamming and interception.',
    category: 'communication',
    subClass: 'quantum-entangler',
    type: 'experimental',
    subType: 'alpha',
    orbitalLayers: ['geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary'],
    baseStats: {
      hull: 150, shield: 40, armor: 20, speed: 40, maneuverability: 30,
      sensorRange: 400, powerOutput: 120, energyConsumption: 50,
      heatDissipation: 55, signalStrength: 100, orbitalStability: 75, durability: 90
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 25, targetingAccuracy: 75,
      scanResolution: 50, dataThroughput: 300, jamResistance: 90,
      repairRate: 3, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 12, radiationHardening: 50, emShielding: 70
    },
    offenseStats: {
      baseDamage: 12, rateOfFire: 1, damageType: 'quantum', penetration: 0.5,
      splashRadius: 0, shieldDamageMultiplier: 0.6, armorDamageMultiplier: 0.3,
      criticalMultiplier: 2.5, accuracy: 70, range: 15, targetingSpeed: 6,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 50, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 40, shieldRecharge: 4, shieldType: 'quantum-lock',
      armorHardness: 20, damageReduction: 0.15, regenerationRate: 1.5,
      resistanceMatrix: { emp: 0.5, ion: 0.4, disruptor: 0.3 },
      vulnerabilityMatrix: { graviton: 0.3, void: 0.25 },
      absorbtionRate: 0.05, reflectionChance: 0.04, adaptiveResistance: 0.08, emergencyRecharge: 6
    },
    upgradeSlots: 3, availableUpgrades: ['computing-core', 'power-core', 'energy-conduit', 'cooling-matrix'],
    buildCost: { metal: 10000, crystal: 12000, deuterium: 5000, energy: 800 },
    buildTime: 240, tierRequirement: 12, tierMax: 99, levelMax: 999,
    specialAbilities: ['instant-communication', 'jamming-immunity', 'quantum-key-distribution'],
    synergies: ['sat-comm-relay-16', 'sat-comm-nexus-18', 'sat-recon-quantum-5'],
    icon: '🔮', color: '#00CED1', size: 'small'
  },
  {
    id: 'sat-comm-holo-21',
    classNumber: 21,
    name: 'Holographic Projector',
    description: 'Creates realistic holographic projections across the battlefield. Can create decoys, relay holographic commanders, or display tactical data in real-time.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'advanced',
    subType: 'gamma',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 120, shield: 35, armor: 18, speed: 55, maneuverability: 45,
      sensorRange: 250, powerOutput: 80, energyConsumption: 30,
      heatDissipation: 50, signalStrength: 65, orbitalStability: 80, durability: 70
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 35, targetingAccuracy: 72,
      scanResolution: 55, dataThroughput: 100, jamResistance: 30,
      repairRate: 3, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 20, radiationHardening: 40, emShielding: 45
    },
    offenseStats: {
      baseDamage: 7, rateOfFire: 2, damageType: 'laser', penetration: 0.06,
      splashRadius: 0, shieldDamageMultiplier: 0.15, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.5, accuracy: 60, range: 10, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 80, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 35, shieldRecharge: 3, shieldType: 'phase-shift',
      armorHardness: 18, damageReduction: 0.1, regenerationRate: 1.2,
      resistanceMatrix: { laser: 0.2, kinetic: 0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0.04, reflectionChance: 0.03, adaptiveResistance: 0.03, emergencyRecharge: 4
    },
    upgradeSlots: 2, availableUpgrades: ['computing-core', 'energy-conduit', 'power-core'],
    buildCost: { metal: 3500, crystal: 4000, deuterium: 1500, energy: 300 },
    buildTime: 100, tierRequirement: 7, tierMax: 99, levelMax: 999,
    specialAbilities: ['holographic-decoy', 'tactical-display', 'commander-projection'],
    synergies: ['sat-comm-relay-16', 'sat-comm-nexus-18'],
    icon: '💫', color: '#FF69B4', size: 'small'
  },
  {
    id: 'sat-comm-navigation-22',
    classNumber: 22,
    name: 'Navigation Beacon Array',
    description: 'Advanced navigation satellite network node. Provides precision positioning data for fleet movements, warp calculations, and auto-docking procedures.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'standard',
    subType: 'mark-iv',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['moon-pole', 'planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 90, shield: 25, armor: 12, speed: 45, maneuverability: 35,
      sensorRange: 150, powerOutput: 40, energyConsumption: 12,
      heatDissipation: 32, signalStrength: 75, orbitalStability: 95, durability: 55
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 25, targetingAccuracy: 85,
      scanResolution: 60, dataThroughput: 40, jamResistance: 25,
      repairRate: 3, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 45, emShielding: 35
    },
    offenseStats: {
      baseDamage: 3, rateOfFire: 1, damageType: 'laser', penetration: 0.02,
      splashRadius: 0, shieldDamageMultiplier: 0.05, armorDamageMultiplier: 0.03,
      criticalMultiplier: 1.2, accuracy: 40, range: 6, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 1
    },
    defenseStats: {
      shieldCapacity: 25, shieldRecharge: 2, shieldType: 'energy-barrier',
      armorHardness: 12, damageReduction: 0.06, regenerationRate: 0.8,
      resistanceMatrix: { kinetic: 0.1, explosive: 0.08 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 2
    },
    upgradeSlots: 1, availableUpgrades: ['power-core', 'computing-core'],
    buildCost: { metal: 1500, crystal: 1000, deuterium: 400, energy: 100 },
    buildTime: 50, tierRequirement: 2, tierMax: 99, levelMax: 999,
    specialAbilities: ['precision-navigation', 'warp-calculation', 'auto-docking'],
    synergies: ['sat-comm-relay-16', 'sat-comm-booster-19'],
    icon: '🧭', color: '#00FF7F', size: 'tiny'
  },
  {
    id: 'sat-comm-jammer-23',
    classNumber: 23,
    name: 'Comm Jammer',
    description: 'Electronic warfare satellite that disrupts enemy communications. Reduces enemy coordination and prevents them from receiving fleet commands.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'stealth',
    subType: 'assault',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-crater', 'asteroid-belt', 'planet-pole'],
    baseStats: {
      hull: 130, shield: 30, armor: 15, speed: 70, maneuverability: 55,
      sensorRange: 200, powerOutput: 90, energyConsumption: 35,
      heatDissipation: 45, signalStrength: 80, orbitalStability: 70, durability: 60
    },
    subStats: {
      criticalHitChance: 6, evasionRating: 50, targetingAccuracy: 68,
      scanResolution: 35, dataThroughput: 50, jamResistance: 70,
      repairRate: 3, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 70, radiationHardening: 35, emShielding: 65
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 2, damageType: 'emp', penetration: 0.1,
      splashRadius: 8, shieldDamageMultiplier: 0.3, armorDamageMultiplier: 0.05,
      criticalMultiplier: 1.5, accuracy: 65, range: 15, targetingSpeed: 6,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 60, powerPerShot: 6
    },
    defenseStats: {
      shieldCapacity: 30, shieldRecharge: 3, shieldType: 'phase-shift',
      armorHardness: 15, damageReduction: 0.09, regenerationRate: 1,
      resistanceMatrix: { emp: 0.4, ion: 0.3, disruptor: 0.2 },
      vulnerabilityMatrix: { kinetic: 0.2, graviton: 0.25 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.05, emergencyRecharge: 4
    },
    upgradeSlots: 2, availableUpgrades: ['power-core', 'stealth-coating', 'energy-conduit', 'cooling-matrix'],
    buildCost: { metal: 5000, crystal: 6000, deuterium: 2000, energy: 400 },
    buildTime: 150, tierRequirement: 8, tierMax: 99, levelMax: 999,
    specialAbilities: ['frequency-jamming', 'enemy-disruption', 'communication-blackout'],
    synergies: ['sat-comm-encryption-17', 'sat-defense-counter-39'],
    icon: '📵', color: '#8B0000', size: 'small'
  },
  {
    id: 'sat-comm-data-24',
    classNumber: 24,
    name: 'Data Storage Nexus',
    description: 'Massive data storage and processing satellite. Acts as a backup server for critical data, running AI analysis and pattern recognition algorithms.',
    category: 'communication',
    subClass: 'nexus-hub',
    type: 'fortress',
    subType: 'production',
    orbitalLayers: ['geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 400, shield: 100, armor: 60, speed: 10, maneuverability: 8,
      sensorRange: 300, powerOutput: 300, energyConsumption: 100,
      heatDissipation: 150, signalStrength: 88, orbitalStability: 88, durability: 250
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 5, targetingAccuracy: 80,
      scanResolution: 65, dataThroughput: 1000, jamResistance: 75,
      repairRate: 5, salvageEfficiency: 8, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 70, emShielding: 80
    },
    offenseStats: {
      baseDamage: 10, rateOfFire: 2, damageType: 'laser', penetration: 0.08,
      splashRadius: 2, shieldDamageMultiplier: 0.15, armorDamageMultiplier: 0.1,
      criticalMultiplier: 1.6, accuracy: 65, range: 14, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 70, powerPerShot: 6
    },
    defenseStats: {
      shieldCapacity: 100, shieldRecharge: 8, shieldType: 'deflector',
      armorHardness: 60, damageReduction: 0.2, regenerationRate: 2,
      resistanceMatrix: { kinetic: 0.3, explosive: 0.25, laser: 0.2 },
      vulnerabilityMatrix: { emp: 0.35, ion: 0.25 },
      absorbtionRate: 0.06, reflectionChance: 0.04, adaptiveResistance: 0.05, emergencyRecharge: 10
    },
    upgradeSlots: 3, availableUpgrades: ['computing-core', 'power-core', 'energy-conduit', 'cooling-matrix', 'armor-plating'],
    buildCost: { metal: 15000, crystal: 10000, deuterium: 5000, energy: 1200 },
    buildTime: 300, tierRequirement: 12, tierMax: 99, levelMax: 999,
    specialAbilities: ['data-backup', 'ai-analysis', 'pattern-recognition', 'redundant-storage'],
    synergies: ['sat-comm-nexus-18', 'sat-comm-quantum-20'],
    icon: '💾', color: '#1E90FF', size: 'medium'
  },
  {
    id: 'sat-comm-freq-25',
    classNumber: 25,
    name: 'Frequency Hopper',
    description: 'Adaptive communication satellite that constantly changes frequencies to avoid jamming and interception. Ensures reliable battlefield communications.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'advanced',
    subType: 'enhanced',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['planet-equator', 'planet-pole', 'orbital-ring'],
    baseStats: {
      hull: 110, shield: 28, armor: 14, speed: 65, maneuverability: 50,
      sensorRange: 280, powerOutput: 60, energyConsumption: 18,
      heatDissipation: 38, signalStrength: 72, orbitalStability: 78, durability: 58
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 45, targetingAccuracy: 68,
      scanResolution: 42, dataThroughput: 65, jamResistance: 65,
      repairRate: 4, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 25, radiationHardening: 38, emShielding: 55
    },
    offenseStats: {
      baseDamage: 6, rateOfFire: 2, damageType: 'emp', penetration: 0.05,
      splashRadius: 3, shieldDamageMultiplier: 0.12, armorDamageMultiplier: 0.04,
      criticalMultiplier: 1.4, accuracy: 58, range: 11, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 75, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 28, shieldRecharge: 3, shieldType: 'adaptive',
      armorHardness: 14, damageReduction: 0.09, regenerationRate: 1,
      resistanceMatrix: { emp: 0.35, ion: 0.25, disruptor: 0.2 },
      vulnerabilityMatrix: { kinetic: 0.15, graviton: 0.2 },
      absorbtionRate: 0.03, reflectionChance: 0.02, adaptiveResistance: 0.08, emergencyRecharge: 4
    },
    upgradeSlots: 2, availableUpgrades: ['energy-conduit', 'computing-core', 'power-core', 'cooling-matrix'],
    buildCost: { metal: 3000, crystal: 2500, deuterium: 1000, energy: 200 },
    buildTime: 80, tierRequirement: 5, tierMax: 99, levelMax: 999,
    specialAbilities: ['frequency-hopping', 'jam-avoidance', 'adaptive-transmission'],
    synergies: ['sat-comm-relay-16', 'sat-comm-encryption-17'],
    icon: '🎵', color: '#7B68EE', size: 'tiny'
  },
  {
    id: 'sat-comm-emergency-26',
    classNumber: 26,
    name: 'Emergency Beacon MK-I',
    description: 'Emergency broadcast satellite. Activates during catastrophic events to broadcast distress signals, coordinate evacuation, and request reinforcements.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'standard',
    subType: 'v1',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['moon-pole', 'planet-equator', 'planet-pole', 'orbital-ring'],
    baseStats: {
      hull: 70, shield: 15, armor: 8, speed: 40, maneuverability: 30,
      sensorRange: 100, powerOutput: 30, energyConsumption: 8,
      heatDissipation: 25, signalStrength: 85, orbitalStability: 92, durability: 40
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 20, targetingAccuracy: 55,
      scanResolution: 25, dataThroughput: 25, jamResistance: 15,
      repairRate: 2, salvageEfficiency: 3, warpCooldown: 0,
      stealthRating: 10, radiationHardening: 55, emShielding: 50
    },
    offenseStats: {
      baseDamage: 2, rateOfFire: 1, damageType: 'laser', penetration: 0.01,
      splashRadius: 0, shieldDamageMultiplier: 0.05, armorDamageMultiplier: 0.02,
      criticalMultiplier: 1.1, accuracy: 35, range: 5, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 1
    },
    defenseStats: {
      shieldCapacity: 15, shieldRecharge: 1, shieldType: 'energy-barrier',
      armorHardness: 8, damageReduction: 0.04, regenerationRate: 0.5,
      resistanceMatrix: {},
      vulnerabilityMatrix: { emp: 0.45, ion: 0.35 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 1
    },
    upgradeSlots: 1, availableUpgrades: ['power-core', 'energy-conduit'],
    buildCost: { metal: 500, crystal: 300, deuterium: 100, energy: 40 },
    buildTime: 25, tierRequirement: 1, tierMax: 99, levelMax: 999,
    specialAbilities: ['distress-broadcast', 'evacuation-coordination', 'reinforcement-request'],
    synergies: ['sat-comm-relay-16', 'sat-comm-nexus-18'],
    icon: '🆘', color: '#FF0000', size: 'nano'
  },
  {
    id: 'sat-comm-hyperlane-27',
    classNumber: 27,
    name: 'Hyperlane Beacon',
    description: 'Creates and maintains stable hyperlane connections between star systems. Reduces travel time and fuel costs for fleet movements.',
    category: 'communication',
    subClass: 'quantum-entangler',
    type: 'heavy',
    subType: 'type-c',
    orbitalLayers: ['deep-space'],
    deploymentZones: ['interplanetary', 'planet-lagrange'],
    baseStats: {
      hull: 300, shield: 80, armor: 50, speed: 15, maneuverability: 10,
      sensorRange: 600, powerOutput: 200, energyConsumption: 100,
      heatDissipation: 90, signalStrength: 82, orbitalStability: 70, durability: 180
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 10, targetingAccuracy: 72,
      scanResolution: 55, dataThroughput: 80, jamResistance: 50,
      repairRate: 3, salvageEfficiency: 5, warpCooldown: 120,
      stealthRating: 5, radiationHardening: 65, emShielding: 60
    },
    offenseStats: {
      baseDamage: 14, rateOfFire: 1, damageType: 'graviton', penetration: 0.3,
      splashRadius: 0, shieldDamageMultiplier: 0.4, armorDamageMultiplier: 0.3,
      criticalMultiplier: 2.0, accuracy: 68, range: 18, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 45, powerPerShot: 12
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 8, shieldType: 'deflector',
      armorHardness: 50, damageReduction: 0.2, regenerationRate: 2,
      resistanceMatrix: { kinetic: 0.25, explosive: 0.2, graviton: 0.3 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.25, tachyon: 0.2 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.05, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['power-core', 'energy-conduit', 'propulsion', 'computing-core'],
    buildCost: { metal: 18000, crystal: 12000, deuterium: 10000, energy: 1500 },
    buildTime: 400, tierRequirement: 15, tierMax: 99, levelMax: 999,
    specialAbilities: ['hyperlane-creation', 'travel-time-reduction', 'fuel-efficiency-boost'],
    synergies: ['sat-specialized-warp-76', 'sat-comm-navigation-22'],
    icon: '🛣️', color: '#9370DB', size: 'small'
  },
  {
    id: 'sat-comm-network-28',
    classNumber: 28,
    name: 'Mesh Network Node',
    description: 'Creates a distributed mesh network with other satellites. Redundant paths ensure communication even if multiple satellites are destroyed.',
    category: 'communication',
    subClass: 'nexus-hub',
    type: 'support',
    subType: 'medium',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 160, shield: 45, armor: 25, speed: 35, maneuverability: 25,
      sensorRange: 350, powerOutput: 100, energyConsumption: 35,
      heatDissipation: 60, signalStrength: 85, orbitalStability: 82, durability: 90
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 20, targetingAccuracy: 70,
      scanResolution: 45, dataThroughput: 120, jamResistance: 55,
      repairRate: 4, salvageEfficiency: 6, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 50, emShielding: 55
    },
    offenseStats: {
      baseDamage: 7, rateOfFire: 1, damageType: 'laser', penetration: 0.05,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.06,
      criticalMultiplier: 1.4, accuracy: 52, range: 10, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 85, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 45, shieldRecharge: 4, shieldType: 'adaptive',
      armorHardness: 25, damageReduction: 0.12, regenerationRate: 1.2,
      resistanceMatrix: { kinetic: 0.15, explosive: 0.15, laser: 0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0.04, reflectionChance: 0.02, adaptiveResistance: 0.05, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['computing-core', 'power-core', 'energy-conduit'],
    buildCost: { metal: 4500, crystal: 3500, deuterium: 1500, energy: 350 },
    buildTime: 110, tierRequirement: 7, tierMax: 99, levelMax: 999,
    specialAbilities: ['mesh-networking', 'redundant-path', 'self-healing-network'],
    synergies: ['sat-comm-relay-16', 'sat-comm-nexus-18', 'sat-comm-booster-19'],
    icon: '🔗', color: '#48D1CC', size: 'small'
  },
  {
    id: 'sat-comm-trade-29',
    classNumber: 29,
    name: 'Trade Relay Station',
    description: 'Commercial communication satellite for market data, trade route management, and economic coordination. Provides real-time market prices and trade opportunities.',
    category: 'communication',
    subClass: 'relay-transmitter',
    type: 'standard',
    subType: 'mark-v',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 100, shield: 25, armor: 15, speed: 50, maneuverability: 35,
      sensorRange: 150, powerOutput: 45, energyConsumption: 14,
      heatDissipation: 30, signalStrength: 70, orbitalStability: 88, durability: 55
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 30, targetingAccuracy: 60,
      scanResolution: 35, dataThroughput: 60, jamResistance: 25,
      repairRate: 3, salvageEfficiency: 10, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 35, emShielding: 35
    },
    offenseStats: {
      baseDamage: 4, rateOfFire: 1, damageType: 'laser', penetration: 0.02,
      splashRadius: 0, shieldDamageMultiplier: 0.08, armorDamageMultiplier: 0.04,
      criticalMultiplier: 1.2, accuracy: 45, range: 8, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 25, shieldRecharge: 2, shieldType: 'energy-barrier',
      armorHardness: 15, damageReduction: 0.07, regenerationRate: 0.8,
      resistanceMatrix: { kinetic: 0.1, explosive: 0.08 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 2
    },
    upgradeSlots: 1, availableUpgrades: ['computing-core', 'power-core'],
    buildCost: { metal: 2000, crystal: 1500, deuterium: 500, energy: 120 },
    buildTime: 55, tierRequirement: 3, tierMax: 99, levelMax: 999,
    specialAbilities: ['market-data-relay', 'trade-route-optimization', 'economic-coordination'],
    synergies: ['sat-comm-relay-16', 'sat-resource-refinery-62'],
    icon: '💰', color: '#32CD32', size: 'tiny'
  },
  {
    id: 'sat-comm-deepspace-30',
    classNumber: 30,
    name: 'Deep Space Array',
    description: 'Ultra-long-range communication array designed to maintain contact with fleets operating in deep space or in nebula interference zones.',
    category: 'communication',
    subClass: 'quantum-entangler',
    type: 'fortress',
    subType: 'heavy',
    orbitalLayers: ['geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary'],
    baseStats: {
      hull: 450, shield: 120, armor: 70, speed: 10, maneuverability: 5,
      sensorRange: 2000, powerOutput: 400, energyConsumption: 150,
      heatDissipation: 180, signalStrength: 98, orbitalStability: 85, durability: 280
    },
    subStats: {
      criticalHitChance: 6, evasionRating: 5, targetingAccuracy: 82,
      scanResolution: 60, dataThroughput: 400, jamResistance: 85,
      repairRate: 5, salvageEfficiency: 8, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 80, emShielding: 85
    },
    offenseStats: {
      baseDamage: 12, rateOfFire: 2, damageType: 'phase', penetration: 0.15,
      splashRadius: 4, shieldDamageMultiplier: 0.2, armorDamageMultiplier: 0.15,
      criticalMultiplier: 1.8, accuracy: 72, range: 22, targetingSpeed: 6,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 55, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 120, shieldRecharge: 10, shieldType: 'deflector',
      armorHardness: 70, damageReduction: 0.22, regenerationRate: 2.5,
      resistanceMatrix: { kinetic: 0.3, explosive: 0.25, laser: 0.2, ion: 0.2 },
      vulnerabilityMatrix: { graviton: 0.3, void: 0.2 },
      absorbtionRate: 0.06, reflectionChance: 0.05, adaptiveResistance: 0.06, emergencyRecharge: 12
    },
    upgradeSlots: 3, availableUpgrades: ['power-core', 'computing-core', 'energy-conduit', 'cooling-matrix', 'shield-capacitor'],
    buildCost: { metal: 25000, crystal: 20000, deuterium: 12000, energy: 2000 },
    buildTime: 550, tierRequirement: 16, tierMax: 99, levelMax: 999,
    specialAbilities: ['deep-space-relay', 'nebula-penetration', 'interstellar-broadcast'],
    synergies: ['sat-comm-nexus-18', 'sat-comm-quantum-20', 'sat-recon-deepspace-3'],
    icon: '📡', color: '#191970', size: 'medium'
  },

  // ===========================================================================
  // DEFENSE CLASS (31-45)
  // ===========================================================================
  {
    id: 'sat-defense-point-31',
    classNumber: 31,
    name: 'Point Defense Turret Satellite MK-I',
    description: 'Basic point defense satellite. Equipped with rapid-fire laser turrets to intercept incoming missiles, fighters, and projectiles.',
    category: 'defense',
    subClass: 'point-defense',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 200, shield: 50, armor: 40, speed: 25, maneuverability: 15,
      sensorRange: 100, powerOutput: 40, energyConsumption: 20,
      heatDissipation: 60, signalStrength: 30, orbitalStability: 80, durability: 150
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 20, targetingAccuracy: 90,
      scanResolution: 60, dataThroughput: 15, jamResistance: 20,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 40, emShielding: 30
    },
    offenseStats: {
      baseDamage: 25, rateOfFire: 6, damageType: 'kinetic', penetration: 0.15,
      splashRadius: 2, shieldDamageMultiplier: 0.3, armorDamageMultiplier: 0.2,
      criticalMultiplier: 1.8, accuracy: 88, range: 15, targetingSpeed: 10,
      ammoCapacity: 1000, reloadTime: 5, overheatThreshold: 80, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 50, shieldRecharge: 5, shieldType: 'energy-barrier',
      armorHardness: 40, damageReduction: 0.12, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.3, explosive: 0.25 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, plasma: 0.25 },
      absorbtionRate: 0.03, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['targeting-system', 'cooling-matrix', 'power-core', 'armor-plating'],
    buildCost: { metal: 3000, crystal: 1500, deuterium: 500, energy: 200 },
    buildTime: 80, tierRequirement: 3, tierMax: 99, levelMax: 999,
    specialAbilities: ['missile-intercept', 'rapid-fire', 'target-priority'],
    synergies: ['sat-defense-shield-34', 'sat-defense-fortress-37'],
    icon: '🔫', color: '#DC143C', size: 'tiny'
  },
  {
    id: 'sat-defense-point-32',
    classNumber: 32,
    name: 'Flak Battery Satellite MK-II',
    description: 'Advanced flak artillery satellite. Fires explosive fragmentation shells that create kill zones against swarms of fighters and missiles.',
    category: 'defense',
    subClass: 'point-defense',
    type: 'heavy',
    subType: 'mark-ii',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-pole', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 350, shield: 80, armor: 70, speed: 15, maneuverability: 10,
      sensorRange: 150, powerOutput: 70, energyConsumption: 35,
      heatDissipation: 100, signalStrength: 35, orbitalStability: 78, durability: 250
    },
    subStats: {
      criticalHitChance: 12, evasionRating: 10, targetingAccuracy: 85,
      scanResolution: 65, dataThroughput: 20, jamResistance: 25,
      repairRate: 6, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 50, emShielding: 40
    },
    offenseStats: {
      baseDamage: 40, rateOfFire: 4, damageType: 'explosive', penetration: 0.2,
      splashRadius: 15, shieldDamageMultiplier: 0.4, armorDamageMultiplier: 0.3,
      criticalMultiplier: 2.0, accuracy: 82, range: 20, targetingSpeed: 8,
      ammoCapacity: 800, reloadTime: 8, overheatThreshold: 65, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 6, shieldType: 'deflector',
      armorHardness: 70, damageReduction: 0.18, regenerationRate: 2,
      resistanceMatrix: { explosive: 0.35, kinetic: 0.3 },
      vulnerabilityMatrix: { emp: 0.25, ion: 0.2, laser: 0.2 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.03, emergencyRecharge: 6
    },
    upgradeSlots: 2, availableUpgrades: ['targeting-system', 'cooling-matrix', 'armor-plating', 'power-core'],
    buildCost: { metal: 8000, crystal: 4000, deuterium: 2000, energy: 500 },
    buildTime: 150, tierRequirement: 5, tierMax: 99, levelMax: 999,
    specialAbilities: ['area-denial', 'swarm-intercept', 'flak-burst'],
    synergies: ['sat-defense-point-31', 'sat-defense-fortress-37'],
    icon: '💥', color: '#FF4500', size: 'small'
  },
  {
    id: 'sat-defense-point-33',
    classNumber: 33,
    name: 'Laser Point Defense Net MK-III',
    description: 'Directed energy point defense satellite. Uses high-speed turrets with pinpoint accuracy to track and destroy incoming threats.',
    category: 'defense',
    subClass: 'point-defense',
    type: 'advanced',
    subType: 'mark-iii',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange'],
    baseStats: {
      hull: 250, shield: 70, armor: 50, speed: 20, maneuverability: 20,
      sensorRange: 120, powerOutput: 80, energyConsumption: 40,
      heatDissipation: 80, signalStrength: 40, orbitalStability: 76, durability: 180
    },
    subStats: {
      criticalHitChance: 15, evasionRating: 15, targetingAccuracy: 95,
      scanResolution: 75, dataThroughput: 30, jamResistance: 35,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 45, emShielding: 50
    },
    offenseStats: {
      baseDamage: 35, rateOfFire: 8, damageType: 'laser', penetration: 0.25,
      splashRadius: 1, shieldDamageMultiplier: 0.35, armorDamageMultiplier: 0.15,
      criticalMultiplier: 2.2, accuracy: 95, range: 18, targetingSpeed: 12,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 70, powerPerShot: 3
    },
    defenseStats: {
      shieldCapacity: 70, shieldRecharge: 7, shieldType: 'energy-barrier',
      armorHardness: 50, damageReduction: 0.15, regenerationRate: 2,
      resistanceMatrix: { laser: 0.3, kinetic: 0.2, ion: 0.15 },
      vulnerabilityMatrix: { emp: 0.3, graviton: 0.2 },
      absorbtionRate: 0.04, reflectionChance: 0.03, adaptiveResistance: 0.04, emergencyRecharge: 7
    },
    upgradeSlots: 3, availableUpgrades: ['targeting-system', 'cooling-matrix', 'power-core', 'energy-conduit', 'weapon-sync'],
    buildCost: { metal: 6000, crystal: 5000, deuterium: 2000, energy: 400 },
    buildTime: 120, tierRequirement: 6, tierMax: 99, levelMax: 999,
    specialAbilities: ['pinpoint-accuracy', 'rapid-target-switch', 'continuous-fire'],
    synergies: ['sat-defense-point-31', 'sat-defense-shield-35'],
    icon: '🔦', color: '#00FF00', size: 'small'
  },
  {
    id: 'sat-defense-shield-34',
    classNumber: 34,
    name: 'Energy Shield Projector MK-I',
    description: 'Basic energy shield generator satellite. Projects a protective energy barrier around nearby structures and ships.',
    category: 'defense',
    subClass: 'shield-projector',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-pole'],
    baseStats: {
      hull: 300, shield: 200, armor: 30, speed: 10, maneuverability: 5,
      sensorRange: 50, powerOutput: 150, energyConsumption: 80,
      heatDissipation: 120, signalStrength: 20, orbitalStability: 85, durability: 200
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 5, targetingAccuracy: 50,
      scanResolution: 20, dataThroughput: 10, jamResistance: 15,
      repairRate: 4, salvageEfficiency: 3, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 30, emShielding: 60
    },
    offenseStats: {
      baseDamage: 5, rateOfFire: 1, damageType: 'ion', penetration: 0.1,
      splashRadius: 0, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.05,
      criticalMultiplier: 1.2, accuracy: 60, range: 5, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 40, powerPerShot: 10
    },
    defenseStats: {
      shieldCapacity: 200, shieldRecharge: 20, shieldType: 'energy-barrier',
      armorHardness: 30, damageReduction: 0.08, regenerationRate: 5,
      resistanceMatrix: { laser: 0.3, kinetic: 0.2, explosive: 0.2 },
      vulnerabilityMatrix: { ion: 0.4, graviton: 0.5 },
      absorbtionRate: 0.3, reflectionChance: 0.05, adaptiveResistance: 0.05, emergencyRecharge: 20
    },
    upgradeSlots: 2, availableUpgrades: ['shield-capacitor', 'power-core', 'cooling-matrix', 'energy-conduit'],
    buildCost: { metal: 5000, crystal: 4000, deuterium: 1000, energy: 500 },
    buildTime: 120, tierRequirement: 4, tierMax: 99, levelMax: 999,
    specialAbilities: ['area-shield', 'damage-absorbtion', 'shield-regeneration'],
    synergies: ['sat-defense-shield-35', 'sat-defense-fortress-37'],
    icon: '🛡️', color: '#1E90FF', size: 'small'
  },
  {
    id: 'sat-defense-shield-35',
    classNumber: 35,
    name: 'Phase Shield Projector MK-II',
    description: 'Advanced phase-shifting shield satellite. Creates a multi-layered barrier that adapts to incoming fire for optimal protection.',
    category: 'defense',
    subClass: 'shield-projector',
    type: 'advanced',
    subType: 'mark-ii',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange'],
    baseStats: {
      hull: 400, shield: 350, armor: 50, speed: 8, maneuverability: 4,
      sensorRange: 60, powerOutput: 250, energyConsumption: 130,
      heatDissipation: 160, signalStrength: 25, orbitalStability: 82, durability: 280
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 4, targetingAccuracy: 55,
      scanResolution: 25, dataThroughput: 15, jamResistance: 25,
      repairRate: 5, salvageEfficiency: 3, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 40, emShielding: 70
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 2, damageType: 'phase', penetration: 0.15,
      splashRadius: 0, shieldDamageMultiplier: 0.4, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.5, accuracy: 65, range: 8, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 35, powerPerShot: 12
    },
    defenseStats: {
      shieldCapacity: 350, shieldRecharge: 30, shieldType: 'phase-shift',
      armorHardness: 50, damageReduction: 0.15, regenerationRate: 8,
      resistanceMatrix: { laser: 0.4, kinetic: 0.3, explosive: 0.35, ion: 0.25 },
      vulnerabilityMatrix: { graviton: 0.4, void: 0.3 },
      absorbtionRate: 0.35, reflectionChance: 0.08, adaptiveResistance: 0.12, emergencyRecharge: 30
    },
    upgradeSlots: 3, availableUpgrades: ['shield-capacitor', 'power-core', 'cooling-matrix', 'energy-conduit', 'computing-core'],
    buildCost: { metal: 12000, crystal: 10000, deuterium: 3000, energy: 1200 },
    buildTime: 250, tierRequirement: 8, tierMax: 99, levelMax: 999,
    specialAbilities: ['adaptive-barrier', 'phase-refraction', 'multi-layer-protection'],
    synergies: ['sat-defense-shield-34', 'sat-defense-shield-36', 'sat-defense-fortress-37'],
    icon: '🔰', color: '#00FA9A', size: 'small'
  },
  {
    id: 'sat-defense-shield-36',
    classNumber: 36,
    name: 'Quantum Lock Shield Generator MK-III',
    description: 'Experimental quantum-locked shield satellite. Creates virtually impenetrable barriers by locking shield molecules in a quantum state.',
    category: 'defense',
    subClass: 'shield-projector',
    type: 'experimental',
    subType: 'mark-iii',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 500, shield: 800, armor: 80, speed: 5, maneuverability: 2,
      sensorRange: 80, powerOutput: 500, energyConsumption: 250,
      heatDissipation: 250, signalStrength: 30, orbitalStability: 78, durability: 400
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 2, targetingAccuracy: 60,
      scanResolution: 30, dataThroughput: 20, jamResistance: 40,
      repairRate: 6, salvageEfficiency: 4, warpCooldown: 0,
      stealthRating: 1, radiationHardening: 60, emShielding: 85
    },
    offenseStats: {
      baseDamage: 15, rateOfFire: 2, damageType: 'quantum', penetration: 0.4,
      splashRadius: 0, shieldDamageMultiplier: 0.6, armorDamageMultiplier: 0.2,
      criticalMultiplier: 2.0, accuracy: 70, range: 10, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 25, powerPerShot: 20
    },
    defenseStats: {
      shieldCapacity: 800, shieldRecharge: 50, shieldType: 'quantum-lock',
      armorHardness: 80, damageReduction: 0.25, regenerationRate: 12,
      resistanceMatrix: { laser: 0.5, kinetic: 0.5, explosive: 0.5, ion: 0.5, emp: 0.4 },
      vulnerabilityMatrix: { void: 0.3, graviton: 0.35 },
      absorbtionRate: 0.4, reflectionChance: 0.12, adaptiveResistance: 0.18, emergencyRecharge: 50
    },
    upgradeSlots: 4, availableUpgrades: ['shield-capacitor', 'power-core', 'cooling-matrix', 'energy-conduit', 'computing-core', 'armor-plating'],
    buildCost: { metal: 30000, crystal: 25000, deuterium: 8000, energy: 3000 },
    buildTime: 500, tierRequirement: 15, tierMax: 99, levelMax: 999,
    specialAbilities: ['quantum-lock-barrier', 'near-impenetrable', 'emergency-max-shield'],
    synergies: ['sat-defense-shield-34', 'sat-defense-shield-35', 'sat-defense-fortress-38'],
    icon: '💎', color: '#7B68EE', size: 'medium'
  },
  {
    id: 'sat-defense-fortress-37',
    classNumber: 37,
    name: 'Fortress Grid Node MK-I',
    description: 'Heavily armored defensive platform with integrated weapon and shield systems. Forms the backbone of orbital defense networks.',
    category: 'defense',
    subClass: 'fortress-grid',
    type: 'fortress',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 1000, shield: 300, armor: 200, speed: 5, maneuverability: 2,
      sensorRange: 200, powerOutput: 200, energyConsumption: 100,
      heatDissipation: 150, signalStrength: 60, orbitalStability: 90, durability: 700
    },
    subStats: {
      criticalHitChance: 10, evasionRating: 3, targetingAccuracy: 82,
      scanResolution: 55, dataThroughput: 40, jamResistance: 40,
      repairRate: 10, salvageEfficiency: 8, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 70, emShielding: 65
    },
    offenseStats: {
      baseDamage: 60, rateOfFire: 3, damageType: 'kinetic', penetration: 0.3,
      splashRadius: 10, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.35,
      criticalMultiplier: 2.0, accuracy: 78, range: 25, targetingSpeed: 6,
      ammoCapacity: 2000, reloadTime: 10, overheatThreshold: 60, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 300, shieldRecharge: 15, shieldType: 'composite',
      armorHardness: 200, damageReduction: 0.3, regenerationRate: 4,
      resistanceMatrix: { kinetic: 0.4, explosive: 0.35, laser: 0.3 },
      vulnerabilityMatrix: { graviton: 0.3, void: 0.2, ion: 0.25 },
      absorbtionRate: 0.08, reflectionChance: 0.05, adaptiveResistance: 0.06, emergencyRecharge: 15
    },
    upgradeSlots: 4, availableUpgrades: ['armor-plating', 'targeting-system', 'power-core', 'shield-capacitor', 'weapon-sync', 'self-repair'],
    buildCost: { metal: 15000, crystal: 8000, deuterium: 4000, energy: 1000 },
    buildTime: 300, tierRequirement: 7, tierMax: 99, levelMax: 999,
    specialAbilities: ['fortified-hull', 'integrated-defense', 'network-node'],
    synergies: ['sat-defense-point-31', 'sat-defense-shield-34', 'sat-defense-fortress-38'],
    icon: '🏰', color: '#808080', size: 'medium'
  },
  {
    id: 'sat-defense-fortress-38',
    classNumber: 38,
    name: 'Orbital Bastion MK-II',
    description: 'Colossal orbital fortress platform. Carries heavy weapon batteries, multiple shield layers, and can withstand sustained siege.',
    category: 'defense',
    subClass: 'fortress-grid',
    type: 'fortress',
    subType: 'mark-ii',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 3000, shield: 1000, armor: 600, speed: 2, maneuverability: 1,
      sensorRange: 400, powerOutput: 600, energyConsumption: 300,
      heatDissipation: 300, signalStrength: 80, orbitalStability: 92, durability: 2000
    },
    subStats: {
      criticalHitChance: 15, evasionRating: 2, targetingAccuracy: 88,
      scanResolution: 65, dataThroughput: 80, jamResistance: 60,
      repairRate: 20, salvageEfficiency: 12, warpCooldown: 0,
      stealthRating: 1, radiationHardening: 80, emShielding: 80
    },
    offenseStats: {
      baseDamage: 120, rateOfFire: 4, damageType: 'plasma', penetration: 0.4,
      splashRadius: 20, shieldDamageMultiplier: 0.6, armorDamageMultiplier: 0.45,
      criticalMultiplier: 2.5, accuracy: 82, range: 35, targetingSpeed: 7,
      ammoCapacity: 5000, reloadTime: 8, overheatThreshold: 50, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 1000, shieldRecharge: 40, shieldType: 'composite',
      armorHardness: 600, damageReduction: 0.35, regenerationRate: 8,
      resistanceMatrix: { kinetic: 0.5, explosive: 0.45, laser: 0.4, ion: 0.35, plasma: 0.3 },
      vulnerabilityMatrix: { graviton: 0.3, void: 0.25 },
      absorbtionRate: 0.12, reflectionChance: 0.08, adaptiveResistance: 0.1, emergencyRecharge: 40
    },
    upgradeSlots: 5, availableUpgrades: ['armor-plating', 'targeting-system', 'power-core', 'shield-capacitor', 'weapon-sync', 'self-repair', 'computing-core'],
    buildCost: { metal: 50000, crystal: 30000, deuterium: 15000, energy: 3000 },
    buildTime: 800, tierRequirement: 12, tierMax: 99, levelMax: 999,
    specialAbilities: ['siege-resistant', 'heavy-bombardment', 'multi-shield-layers', 'self-sustaining'],
    synergies: ['sat-defense-fortress-37', 'sat-defense-fortress-40', 'sat-offense-beam-46'],
    icon: '🏯', color: '#696969', size: 'huge'
  },
  {
    id: 'sat-defense-counter-39',
    classNumber: 39,
    name: 'Counter-Measure Satellite',
    description: 'Electronic warfare defense satellite. Deploys chaff, flares, ECM jamming, and decoys to confuse incoming projectiles and missiles.',
    category: 'defense',
    subClass: 'counter-measure',
    type: 'advanced',
    subType: 'alpha',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange'],
    baseStats: {
      hull: 150, shield: 40, armor: 20, speed: 65, maneuverability: 55,
      sensorRange: 150, powerOutput: 60, energyConsumption: 25,
      heatDissipation: 45, signalStrength: 50, orbitalStability: 72, durability: 80
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 65, targetingAccuracy: 60,
      scanResolution: 45, dataThroughput: 35, jamResistance: 70,
      repairRate: 4, salvageEfficiency: 4, warpCooldown: 0,
      stealthRating: 60, radiationHardening: 35, emShielding: 70
    },
    offenseStats: {
      baseDamage: 10, rateOfFire: 2, damageType: 'emp', penetration: 0.1,
      splashRadius: 5, shieldDamageMultiplier: 0.2, armorDamageMultiplier: 0.05,
      criticalMultiplier: 1.5, accuracy: 55, range: 12, targetingSpeed: 6,
      ammoCapacity: 500, reloadTime: 3, overheatThreshold: 60, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 40, shieldRecharge: 4, shieldType: 'adaptive',
      armorHardness: 20, damageReduction: 0.08, regenerationRate: 1,
      resistanceMatrix: { emp: 0.5, ion: 0.4, disruptor: 0.3 },
      vulnerabilityMatrix: { kinetic: 0.25, plasma: 0.2 },
      absorbtionRate: 0.05, reflectionChance: 0.04, adaptiveResistance: 0.1, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['stealth-coating', 'power-core', 'cooling-matrix', 'computing-core'],
    buildCost: { metal: 4000, crystal: 5000, deuterium: 2000, energy: 350 },
    buildTime: 100, tierRequirement: 6, tierMax: 99, levelMax: 999,
    specialAbilities: ['ecm-jamming', 'chaff-deployment', 'decoy-launch', 'flare-countermeasure'],
    synergies: ['sat-defense-shield-34', 'sat-comm-jammer-23'],
    icon: '🎭', color: '#556B2F', size: 'tiny'
  },
  {
    id: 'sat-defense-fortress-40',
    classNumber: 40,
    name: 'Planetary Defense Ring MK-III',
    description: 'Ultra-heavy orbital ring segment. Forms part of a planetary defense network with 360-degree coverage and redundant systems.',
    category: 'defense',
    subClass: 'fortress-grid',
    type: 'fortress',
    subType: 'mark-iii',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 5000, shield: 1500, armor: 1000, speed: 1, maneuverability: 0,
      sensorRange: 500, powerOutput: 1000, energyConsumption: 500,
      heatDissipation: 500, signalStrength: 90, orbitalStability: 95, durability: 3500
    },
    subStats: {
      criticalHitChance: 18, evasionRating: 1, targetingAccuracy: 90,
      scanResolution: 75, dataThroughput: 150, jamResistance: 75,
      repairRate: 30, salvageEfficiency: 20, warpCooldown: 0,
      stealthRating: 0, radiationHardening: 90, emShielding: 90
    },
    offenseStats: {
      baseDamage: 200, rateOfFire: 5, damageType: 'plasma', penetration: 0.5,
      splashRadius: 30, shieldDamageMultiplier: 0.7, armorDamageMultiplier: 0.5,
      criticalMultiplier: 3.0, accuracy: 85, range: 45, targetingSpeed: 8,
      ammoCapacity: 10000, reloadTime: 15, overheatThreshold: 40, powerPerShot: 12
    },
    defenseStats: {
      shieldCapacity: 1500, shieldRecharge: 60, shieldType: 'composite',
      armorHardness: 1000, damageReduction: 0.4, regenerationRate: 10,
      resistanceMatrix: { kinetic: 0.55, explosive: 0.5, laser: 0.45, ion: 0.4, plasma: 0.35, emp: 0.3 },
      vulnerabilityMatrix: { graviton: 0.35, void: 0.3 },
      absorbtionRate: 0.15, reflectionChance: 0.1, adaptiveResistance: 0.12, emergencyRecharge: 60
    },
    upgradeSlots: 5, availableUpgrades: ['armor-plating', 'targeting-system', 'power-core', 'shield-capacitor', 'weapon-sync', 'self-repair', 'computing-core', 'cooling-matrix'],
    buildCost: { metal: 100000, crystal: 60000, deuterium: 30000, energy: 6000 },
    buildTime: 1500, tierRequirement: 18, tierMax: 99, levelMax: 999,
    specialAbilities: ['full-coverage', 'redundant-systems', 'sustained-fire', 'planetary-defense'],
    synergies: ['sat-defense-fortress-37', 'sat-defense-fortress-38', 'sat-defense-shield-36'],
    icon: '⚙️', color: '#2F4F4F', size: 'colossal'
  },
  {
    id: 'sat-defense-point-41',
    classNumber: 41,
    name: 'Ion Disruptor Point Defense',
    description: 'Specialized point defense satellite using ion cannons to disable enemy electronics. Effective against drones and guided munitions.',
    category: 'defense',
    subClass: 'point-defense',
    type: 'advanced',
    subType: 'type-d',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'asteroid-belt'],
    baseStats: {
      hull: 220, shield: 60, armor: 40, speed: 22, maneuverability: 18,
      sensorRange: 110, powerOutput: 70, energyConsumption: 32,
      heatDissipation: 65, signalStrength: 35, orbitalStability: 75, durability: 140
    },
    subStats: {
      criticalHitChance: 10, evasionRating: 18, targetingAccuracy: 88,
      scanResolution: 58, dataThroughput: 22, jamResistance: 30,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 45, emShielding: 55
    },
    offenseStats: {
      baseDamage: 30, rateOfFire: 5, damageType: 'ion', penetration: 0.2,
      splashRadius: 4, shieldDamageMultiplier: 0.6, armorDamageMultiplier: 0.1,
      criticalMultiplier: 1.8, accuracy: 84, range: 16, targetingSpeed: 9,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 65, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 60, shieldRecharge: 6, shieldType: 'deflector',
      armorHardness: 40, damageReduction: 0.14, regenerationRate: 1.8,
      resistanceMatrix: { ion: 0.4, emp: 0.3, kinetic: 0.2 },
      vulnerabilityMatrix: { graviton: 0.3, plasma: 0.25 },
      absorbtionRate: 0.04, reflectionChance: 0.03, adaptiveResistance: 0.04, emergencyRecharge: 6
    },
    upgradeSlots: 2, availableUpgrades: ['targeting-system', 'cooling-matrix', 'power-core', 'energy-conduit'],
    buildCost: { metal: 7000, crystal: 6000, deuterium: 2500, energy: 450 },
    buildTime: 140, tierRequirement: 7, tierMax: 99, levelMax: 999,
    specialAbilities: ['drone-disruption', 'electronic-disabling', 'guided-munition-intercept'],
    synergies: ['sat-defense-point-31', 'sat-defense-counter-39'],
    icon: '⚡', color: '#9400D3', size: 'small'
  },
  {
    id: 'sat-defense-regenerative-42',
    classNumber: 42,
    name: 'Regenerative Armor Platform',
    description: 'Self-repairing armor satellite. Uses nanite technology to regenerate hull damage and adapt armor composition to incoming fire.',
    category: 'defense',
    subClass: 'fortress-grid',
    type: 'advanced',
    subType: 'enhanced',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 800, shield: 200, armor: 150, speed: 12, maneuverability: 8,
      sensorRange: 100, powerOutput: 150, energyConsumption: 70,
      heatDissipation: 110, signalStrength: 40, orbitalStability: 84, durability: 550
    },
    subStats: {
      criticalHitChance: 6, evasionRating: 8, targetingAccuracy: 72,
      scanResolution: 40, dataThroughput: 25, jamResistance: 35,
      repairRate: 25, salvageEfficiency: 30, warpCooldown: 0,
      stealthRating: 4, radiationHardening: 60, emShielding: 55
    },
    offenseStats: {
      baseDamage: 40, rateOfFire: 2, damageType: 'kinetic', penetration: 0.25,
      splashRadius: 8, shieldDamageMultiplier: 0.35, armorDamageMultiplier: 0.25,
      criticalMultiplier: 1.8, accuracy: 72, range: 20, targetingSpeed: 5,
      ammoCapacity: 1500, reloadTime: 7, overheatThreshold: 70, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 200, shieldRecharge: 10, shieldType: 'regenerative',
      armorHardness: 150, damageReduction: 0.25, regenerationRate: 15,
      resistanceMatrix: { kinetic: 0.35, explosive: 0.3, laser: 0.2 },
      vulnerabilityMatrix: { graviton: 0.3, ion: 0.2 },
      absorbtionRate: 0.1, reflectionChance: 0.06, adaptiveResistance: 0.15, emergencyRecharge: 10
    },
    upgradeSlots: 3, availableUpgrades: ['self-repair', 'armor-plating', 'power-core', 'cooling-matrix', 'shield-capacitor'],
    buildCost: { metal: 12000, crystal: 10000, deuterium: 5000, energy: 800 },
    buildTime: 250, tierRequirement: 9, tierMax: 99, levelMax: 999,
    specialAbilities: ['nanite-regeneration', 'adaptive-armor', 'self-repair', 'damage-adaptation'],
    synergies: ['sat-defense-fortress-37', 'sat-specialized-repair-80'],
    icon: '🔄', color: '#2E8B57', size: 'small'
  },
  {
    id: 'sat-defense-anti-43',
    classNumber: 43,
    name: 'Anti-Fighter Platform MK-I',
    description: 'Dedicated anti-fighter satellite. Equipped with tracking turrets optimized for engaging small, fast-moving targets.',
    category: 'defense',
    subClass: 'point-defense',
    type: 'heavy',
    subType: 'assault',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 280, shield: 70, armor: 50, speed: 18, maneuverability: 14,
      sensorRange: 130, powerOutput: 65, energyConsumption: 30,
      heatDissipation: 85, signalStrength: 32, orbitalStability: 78, durability: 180
    },
    subStats: {
      criticalHitChance: 12, evasionRating: 14, targetingAccuracy: 92,
      scanResolution: 70, dataThroughput: 25, jamResistance: 25,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 45, emShielding: 35
    },
    offenseStats: {
      baseDamage: 22, rateOfFire: 7, damageType: 'kinetic', penetration: 0.1,
      splashRadius: 3, shieldDamageMultiplier: 0.25, armorDamageMultiplier: 0.15,
      criticalMultiplier: 2.0, accuracy: 90, range: 14, targetingSpeed: 12,
      ammoCapacity: 1500, reloadTime: 4, overheatThreshold: 75, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 70, shieldRecharge: 6, shieldType: 'energy-barrier',
      armorHardness: 50, damageReduction: 0.12, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.25, explosive: 0.2, laser: 0.15 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, plasma: 0.2 },
      absorbtionRate: 0.03, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 6
    },
    upgradeSlots: 2, availableUpgrades: ['targeting-system', 'cooling-matrix', 'power-core', 'weapon-sync'],
    buildCost: { metal: 6000, crystal: 3500, deuterium: 1500, energy: 350 },
    buildTime: 110, tierRequirement: 5, tierMax: 99, levelMax: 999,
    specialAbilities: ['fighter-priority', 'tracking-turrets', 'rapid-target-acquisition'],
    synergies: ['sat-defense-point-31', 'sat-defense-point-33'],
    icon: '🎯', color: '#CD853F', size: 'small'
  },
  {
    id: 'sat-defense-anti-44',
    classNumber: 44,
    name: 'Anti-Capital Ship Platform MK-II',
    description: 'Heavy anti-capital ship defense satellite. Equipped with spinal-mounted railguns designed to penetrate battleship-grade armor.',
    category: 'defense',
    subClass: 'fortress-grid',
    type: 'fortress',
    subType: 'assault',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 1500, shield: 400, armor: 300, speed: 3, maneuverability: 2,
      sensorRange: 350, powerOutput: 350, energyConsumption: 180,
      heatDissipation: 200, signalStrength: 55, orbitalStability: 88, durability: 1000
    },
    subStats: {
      criticalHitChance: 15, evasionRating: 2, targetingAccuracy: 85,
      scanResolution: 62, dataThroughput: 35, jamResistance: 45,
      repairRate: 8, salvageEfficiency: 10, warpCooldown: 0,
      stealthRating: 1, radiationHardening: 65, emShielding: 60
    },
    offenseStats: {
      baseDamage: 250, rateOfFire: 2, damageType: 'kinetic', penetration: 0.6,
      splashRadius: 5, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.7,
      criticalMultiplier: 3.0, accuracy: 80, range: 40, targetingSpeed: 5,
      ammoCapacity: 500, reloadTime: 15, overheatThreshold: 30, powerPerShot: 20
    },
    defenseStats: {
      shieldCapacity: 400, shieldRecharge: 15, shieldType: 'deflector',
      armorHardness: 300, damageReduction: 0.3, regenerationRate: 3,
      resistanceMatrix: { kinetic: 0.4, explosive: 0.35, laser: 0.3, plasma: 0.25 },
      vulnerabilityMatrix: { graviton: 0.35, void: 0.25 },
      absorbtionRate: 0.08, reflectionChance: 0.05, adaptiveResistance: 0.06, emergencyRecharge: 15
    },
    upgradeSlots: 4, availableUpgrades: ['armor-plating', 'targeting-system', 'power-core', 'shield-capacitor', 'weapon-sync', 'cooling-matrix'],
    buildCost: { metal: 30000, crystal: 15000, deuterium: 8000, energy: 2000 },
    buildTime: 600, tierRequirement: 12, tierMax: 99, levelMax: 999,
    specialAbilities: ['armor-piercing', 'capital-ship-priority', 'precision-strike'],
    synergies: ['sat-defense-fortress-37', 'sat-defense-fortress-38', 'sat-offense-rail-50'],
    icon: '🗡️', color: '#B22222', size: 'medium'
  },
  {
    id: 'sat-defense-bubble-45',
    classNumber: 45,
    name: 'Mobile Shield Bubble',
    description: 'Mobile shield generation satellite. Can reposition to protect priority targets and provides cover for allied ships and structures.',
    category: 'defense',
    subClass: 'shield-projector',
    type: 'mobile',
    subType: 'guardian',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange'],
    baseStats: {
      hull: 350, shield: 500, armor: 60, speed: 45, maneuverability: 35,
      sensorRange: 80, powerOutput: 200, energyConsumption: 100,
      heatDissipation: 140, signalStrength: 35, orbitalStability: 70, durability: 200
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 30, targetingAccuracy: 55,
      scanResolution: 28, dataThroughput: 18, jamResistance: 30,
      repairRate: 4, salvageEfficiency: 4, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 45, emShielding: 65
    },
    offenseStats: {
      baseDamage: 6, rateOfFire: 1, damageType: 'ion', penetration: 0.1,
      splashRadius: 0, shieldDamageMultiplier: 0.4, armorDamageMultiplier: 0.05,
      criticalMultiplier: 1.3, accuracy: 55, range: 6, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 45, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 500, shieldRecharge: 35, shieldType: 'regenerative',
      armorHardness: 60, damageReduction: 0.18, regenerationRate: 10,
      resistanceMatrix: { laser: 0.35, kinetic: 0.3, explosive: 0.3, ion: 0.2 },
      vulnerabilityMatrix: { graviton: 0.4, void: 0.3 },
      absorbtionRate: 0.35, reflectionChance: 0.08, adaptiveResistance: 0.15, emergencyRecharge: 35
    },
    upgradeSlots: 3, availableUpgrades: ['shield-capacitor', 'power-core', 'propulsion', 'energy-conduit', 'computing-core'],
    buildCost: { metal: 10000, crystal: 12000, deuterium: 4000, energy: 1000 },
    buildTime: 200, tierRequirement: 8, tierMax: 99, levelMax: 999,
    specialAbilities: ['mobile-shield', 'priority-protection', 'shield-overcharge', 'emergency-rescue'],
    synergies: ['sat-defense-shield-34', 'sat-defense-shield-35'],
    icon: '🛡️', color: '#87CEEB', size: 'small'
  },

  // ===========================================================================
  // OFFENSE CLASS (46-60) - Continuing in next section
  // ===========================================================================
  {
    id: 'sat-offense-beam-46',
    classNumber: 46,
    name: 'Beam Weapon Platform MK-I',
    description: 'Basic offensive laser platform. Fires sustained beam weapons at enemy ships and structures providing consistent damage output.',
    category: 'offense',
    subClass: 'beam-weapon',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 250, shield: 60, armor: 40, speed: 15, maneuverability: 10,
      sensorRange: 200, powerOutput: 80, energyConsumption: 40,
      heatDissipation: 70, signalStrength: 25, orbitalStability: 80, durability: 160
    },
    subStats: {
      criticalHitChance: 10, evasionRating: 12, targetingAccuracy: 82,
      scanResolution: 50, dataThroughput: 15, jamResistance: 20,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 40, emShielding: 25
    },
    offenseStats: {
      baseDamage: 50, rateOfFire: 3, damageType: 'laser', penetration: 0.2,
      splashRadius: 2, shieldDamageMultiplier: 0.4, armorDamageMultiplier: 0.15,
      criticalMultiplier: 1.8, accuracy: 80, range: 20, targetingSpeed: 6,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 60, powerPerShot: 6
    },
    defenseStats: {
      shieldCapacity: 60, shieldRecharge: 5, shieldType: 'energy-barrier',
      armorHardness: 40, damageReduction: 0.12, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.15 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.25, graviton: 0.2 },
      absorbtionRate: 0.03, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'targeting-system'],
    buildCost: { metal: 5000, crystal: 3000, deuterium: 1000, energy: 300 },
    buildTime: 100, tierRequirement: 4, tierMax: 99, levelMax: 999,
    specialAbilities: ['sustained-beam', 'consistent-damage', 'precision-fire'],
    synergies: ['sat-offense-beam-47', 'sat-offense-beam-48'],
    icon: '🔴', color: '#FF0000', size: 'small'
  },
  {
    id: 'sat-offense-beam-47',
    classNumber: 47,
    name: 'Plasma Beam Platform MK-II',
    description: 'Advanced plasma beam satellite. Fires superheated plasma bolts that penetrate armor and cause catastrophic damage to hull structures.',
    category: 'offense',
    subClass: 'beam-weapon',
    type: 'heavy',
    subType: 'mark-ii',
    orbitalLayers: ['mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange'],
    baseStats: {
      hull: 400, shield: 100, armor: 70, speed: 10, maneuverability: 6,
      sensorRange: 300, powerOutput: 150, energyConsumption: 80,
      heatDissipation: 120, signalStrength: 30, orbitalStability: 78, durability: 280
    },
    subStats: {
      criticalHitChance: 15, evasionRating: 8, targetingAccuracy: 85,
      scanResolution: 55, dataThroughput: 20, jamResistance: 25,
      repairRate: 6, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 50, emShielding: 35
    },
    offenseStats: {
      baseDamage: 100, rateOfFire: 2, damageType: 'plasma', penetration: 0.4,
      splashRadius: 6, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.5,
      criticalMultiplier: 2.5, accuracy: 82, range: 25, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 45, powerPerShot: 12
    },
    defenseStats: {
      shieldCapacity: 100, shieldRecharge: 8, shieldType: 'deflector',
      armorHardness: 70, damageReduction: 0.18, regenerationRate: 2,
      resistanceMatrix: { kinetic: 0.25, explosive: 0.2, laser: 0.2 },
      vulnerabilityMatrix: { emp: 0.25, ion: 0.2, graviton: 0.25 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.03, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'targeting-system', 'energy-conduit'],
    buildCost: { metal: 12000, crystal: 8000, deuterium: 3000, energy: 700 },
    buildTime: 200, tierRequirement: 7, tierMax: 99, levelMax: 999,
    specialAbilities: ['themal-melt', 'armor-ignition', 'critical-melting'],
    synergies: ['sat-offense-beam-46', 'sat-offense-beam-48', 'sat-offense-beam-49'],
    icon: '🔥', color: '#FF4500', size: 'small'
  },
  {
    id: 'sat-offense-beam-48',
    classNumber: 48,
    name: 'Tachyon Lance Platform MK-III',
    description: 'Ultra-high-energy tachyon beam satellite. Fires faster-than-light particles that ignore shields and directly damage hull.',
    category: 'offense',
    subClass: 'beam-weapon',
    type: 'elite',
    subType: 'mark-iii',
    orbitalLayers: ['high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'orbital-ring', 'interplanetary'],
    baseStats: {
      hull: 300, shield: 80, armor: 50, speed: 8, maneuverability: 8,
      sensorRange: 400, powerOutput: 200, energyConsumption: 120,
      heatDissipation: 100, signalStrength: 40, orbitalStability: 72, durability: 200
    },
    subStats: {
      criticalHitChance: 20, evasionRating: 10, targetingAccuracy: 90,
      scanResolution: 60, dataThroughput: 25, jamResistance: 35,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 55, emShielding: 45
    },
    offenseStats: {
      baseDamage: 180, rateOfFire: 1, damageType: 'tachyon', penetration: 0.7,
      splashRadius: 0, shieldDamageMultiplier: 1.0, armorDamageMultiplier: 0.6,
      criticalMultiplier: 3.5, accuracy: 88, range: 35, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 25, powerPerShot: 25
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 6, shieldType: 'phase-shift',
      armorHardness: 50, damageReduction: 0.15, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.15, laser: 0.2 },
      vulnerabilityMatrix: { graviton: 0.3, void: 0.25, tachyon: 0.2 },
      absorbtionRate: 0.04, reflectionChance: 0.03, adaptiveResistance: 0.04, emergencyRecharge: 6
    },
    upgradeSlots: 3, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'targeting-system', 'energy-conduit'],
    buildCost: { metal: 20000, crystal: 18000, deuterium: 8000, energy: 1500 },
    buildTime: 400, tierRequirement: 14, tierMax: 99, levelMax: 999,
    specialAbilities: ['shield-ignoring', 'precision-strike', 'critical-chain'],
    synergies: ['sat-offense-beam-46', 'sat-offense-beam-47', 'sat-recon-tachyon-12'],
    icon: '⚡', color: '#00BFFF', size: 'small'
  },
  {
    id: 'sat-offense-beam-49',
    classNumber: 49,
    name: 'Phased Array Cannon MK-IV',
    description: 'Multi-phase beam weapon satellite. Alternates between damage types to exploit weaknesses in enemy defenses.',
    category: 'offense',
    subClass: 'beam-weapon',
    type: 'advanced',
    subType: 'mark-iv',
    orbitalLayers: ['mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange'],
    baseStats: {
      hull: 350, shield: 90, armor: 55, speed: 12, maneuverability: 10,
      sensorRange: 250, powerOutput: 130, energyConsumption: 65,
      heatDissipation: 95, signalStrength: 35, orbitalStability: 76, durability: 220
    },
    subStats: {
      criticalHitChance: 14, evasionRating: 12, targetingAccuracy: 86,
      scanResolution: 52, dataThroughput: 30, jamResistance: 30,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 4, radiationHardening: 48, emShielding: 40
    },
    offenseStats: {
      baseDamage: 75, rateOfFire: 3, damageType: 'phase', penetration: 0.35,
      splashRadius: 4, shieldDamageMultiplier: 0.45, armorDamageMultiplier: 0.35,
      criticalMultiplier: 2.2, accuracy: 84, range: 22, targetingSpeed: 7,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 50, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 90, shieldRecharge: 7, shieldType: 'adaptive',
      armorHardness: 55, damageReduction: 0.16, regenerationRate: 1.8,
      resistanceMatrix: { kinetic: 0.22, explosive: 0.18, laser: 0.2 },
      vulnerabilityMatrix: { graviton: 0.28, void: 0.22 },
      absorbtionRate: 0.05, reflectionChance: 0.04, adaptiveResistance: 0.05, emergencyRecharge: 7
    },
    upgradeSlots: 3, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'targeting-system', 'energy-conduit'],
    buildCost: { metal: 15000, crystal: 12000, deuterium: 5000, energy: 1000 },
    buildTime: 300, tierRequirement: 10, tierMax: 99, levelMax: 999,
    specialAbilities: ['phase-alternation', 'weakness-exploitation', 'adaptive-fire'],
    synergies: ['sat-offense-beam-46', 'sat-offense-beam-47', 'sat-offense-beam-48'],
    icon: '🌈', color: '#FF00FF', size: 'small'
  },
  {
    id: 'sat-offense-rail-50',
    classNumber: 50,
    name: 'Railgun Satellite MK-I',
    description: 'Kinetic bombardment railgun satellite. Fires hyper-velocity metal projectiles that penetrate deep into enemy hulls.',
    category: 'offense',
    subClass: 'kinetic-strike',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 380, shield: 80, armor: 90, speed: 8, maneuverability: 5,
      sensorRange: 250, powerOutput: 100, energyConsumption: 50,
      heatDissipation: 80, signalStrength: 28, orbitalStability: 82, durability: 260
    },
    subStats: {
      criticalHitChance: 12, evasionRating: 6, targetingAccuracy: 80,
      scanResolution: 48, dataThroughput: 12, jamResistance: 18,
      repairRate: 6, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 45, emShielding: 30
    },
    offenseStats: {
      baseDamage: 80, rateOfFire: 2, damageType: 'kinetic', penetration: 0.45,
      splashRadius: 3, shieldDamageMultiplier: 0.3, armorDamageMultiplier: 0.6,
      criticalMultiplier: 2.2, accuracy: 78, range: 30, targetingSpeed: 4,
      ammoCapacity: 200, reloadTime: 10, overheatThreshold: 40, powerPerShot: 10
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 5, shieldType: 'deflector',
      armorHardness: 90, damageReduction: 0.2, regenerationRate: 1.2,
      resistanceMatrix: { kinetic: 0.35, explosive: 0.25 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, graviton: 0.25 },
      absorbtionRate: 0.04, reflectionChance: 0.03, adaptiveResistance: 0.02, emergencyRecharge: 4
    },
    upgradeSlots: 2, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'targeting-system'],
    buildCost: { metal: 8000, crystal: 4000, deuterium: 2000, energy: 400 },
    buildTime: 150, tierRequirement: 5, tierMax: 99, levelMax: 999,
    specialAbilities: ['armor-piercing', 'precision-kinetic', 'structural-damage'],
    synergies: ['sat-offense-rail-51', 'sat-offense-rail-52'],
    icon: '➡️', color: '#A0522D', size: 'small'
  },
  {
    id: 'sat-offense-rail-51',
    classNumber: 51,
    name: 'Mass Driver Platform MK-II',
    description: 'Heavy kinetic bombardment platform. Fires massive projectiles capable of striking planetary surfaces and causing devastating impact damage.',
    category: 'offense',
    subClass: 'kinetic-strike',
    type: 'heavy',
    subType: 'mark-ii',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 600, shield: 150, armor: 200, speed: 4, maneuverability: 2,
      sensorRange: 500, powerOutput: 250, energyConsumption: 130,
      heatDissipation: 160, signalStrength: 35, orbitalStability: 85, durability: 450
    },
    subStats: {
      criticalHitChance: 18, evasionRating: 3, targetingAccuracy: 82,
      scanResolution: 52, dataThroughput: 15, jamResistance: 22,
      repairRate: 8, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 1, radiationHardening: 55, emShielding: 35
    },
    offenseStats: {
      baseDamage: 200, rateOfFire: 2, damageType: 'kinetic', penetration: 0.55,
      splashRadius: 15, shieldDamageMultiplier: 0.4, armorDamageMultiplier: 0.65,
      criticalMultiplier: 2.8, accuracy: 76, range: 45, targetingSpeed: 3,
      ammoCapacity: 100, reloadTime: 15, overheatThreshold: 30, powerPerShot: 18
    },
    defenseStats: {
      shieldCapacity: 150, shieldRecharge: 8, shieldType: 'deflector',
      armorHardness: 200, damageReduction: 0.28, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.4, explosive: 0.35, laser: 0.2, plasma: 0.2 },
      vulnerabilityMatrix: { emp: 0.25, ion: 0.2, graviton: 0.3 },
      absorbtionRate: 0.06, reflectionChance: 0.04, adaptiveResistance: 0.03, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'targeting-system', 'armor-plating'],
    buildCost: { metal: 20000, crystal: 10000, deuterium: 5000, energy: 1200 },
    buildTime: 400, tierRequirement: 9, tierMax: 99, levelMax: 999,
    specialAbilities: ['planetary-bombardment', 'seismic-shock', 'crater-impact'],
    synergies: ['sat-offense-rail-50', 'sat-offense-rail-52', 'sat-offense-mass-53'],
    icon: '💣', color: '#8B4513', size: 'medium'
  },
  {
    id: 'sat-offense-rail-52',
    classNumber: 52,
    name: 'Kinetic Lance MK-III',
    description: 'Ultra-precision kinetic accelerator. Fires depleted uranium sabots at extreme velocities for maximum armor penetration.',
    category: 'offense',
    subClass: 'kinetic-strike',
    type: 'elite',
    subType: 'mark-iii',
    orbitalLayers: ['mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 450, shield: 120, armor: 150, speed: 6, maneuverability: 4,
      sensorRange: 350, powerOutput: 180, energyConsumption: 90,
      heatDissipation: 110, signalStrength: 32, orbitalStability: 80, durability: 320
    },
    subStats: {
      criticalHitChance: 22, evasionRating: 5, targetingAccuracy: 90,
      scanResolution: 58, dataThroughput: 18, jamResistance: 28,
      repairRate: 7, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 50, emShielding: 38
    },
    offenseStats: {
      baseDamage: 150, rateOfFire: 3, damageType: 'kinetic', penetration: 0.65,
      splashRadius: 4, shieldDamageMultiplier: 0.35, armorDamageMultiplier: 0.7,
      criticalMultiplier: 3.0, accuracy: 86, range: 35, targetingSpeed: 6,
      ammoCapacity: 300, reloadTime: 8, overheatThreshold: 35, powerPerShot: 14
    },
    defenseStats: {
      shieldCapacity: 120, shieldRecharge: 8, shieldType: 'deflector',
      armorHardness: 150, damageReduction: 0.22, regenerationRate: 1.8,
      resistanceMatrix: { kinetic: 0.38, explosive: 0.3, laser: 0.2 },
      vulnerabilityMatrix: { emp: 0.28, graviton: 0.28, void: 0.2 },
      absorbtionRate: 0.05, reflectionChance: 0.04, adaptiveResistance: 0.03, emergencyRecharge: 7
    },
    upgradeSlots: 3, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'targeting-system', 'armor-plating'],
    buildCost: { metal: 25000, crystal: 15000, deuterium: 6000, energy: 1500 },
    buildTime: 500, tierRequirement: 12, tierMax: 99, levelMax: 999,
    specialAbilities: ['ultra-penetration', 'precision-sniper', 'structural-weakening'],
    synergies: ['sat-offense-rail-50', 'sat-offense-rail-51'],
    icon: '🗡️', color: '#C0C0C0', size: 'small'
  },
  {
    id: 'sat-offense-mass-53',
    classNumber: 53,
    name: 'Missile Battery Platform MK-I',
    description: 'Standard missile battery satellite. Fires volleys of guided missiles for sustained damage and area saturation.',
    category: 'offense',
    subClass: 'missile-platform',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-pole'],
    baseStats: {
      hull: 200, shield: 50, armor: 30, speed: 12, maneuverability: 10,
      sensorRange: 300, powerOutput: 60, energyConsumption: 25,
      heatDissipation: 50, signalStrength: 30, orbitalStability: 78, durability: 130
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 10, targetingAccuracy: 75,
      scanResolution: 45, dataThroughput: 20, jamResistance: 15,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 35, emShielding: 25
    },
    offenseStats: {
      baseDamage: 60, rateOfFire: 4, damageType: 'explosive', penetration: 0.25,
      splashRadius: 12, shieldDamageMultiplier: 0.35, armorDamageMultiplier: 0.3,
      criticalMultiplier: 1.8, accuracy: 72, range: 40, targetingSpeed: 5,
      ammoCapacity: 500, reloadTime: 6, overheatThreshold: 50, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 50, shieldRecharge: 4, shieldType: 'energy-barrier',
      armorHardness: 30, damageReduction: 0.1, regenerationRate: 1.2,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.2 },
      vulnerabilityMatrix: { emp: 0.35, ion: 0.25, laser: 0.2 },
      absorbtionRate: 0.03, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 4
    },
    upgradeSlots: 2, availableUpgrades: ['weapon-sync', 'targeting-system', 'power-core', 'cooling-matrix'],
    buildCost: { metal: 6000, crystal: 4000, deuterium: 3000, energy: 350 },
    buildTime: 120, tierRequirement: 4, tierMax: 99, levelMax: 999,
    specialAbilities: ['guided-missile', 'volley-fire', 'saturation-attack'],
    synergies: ['sat-offense-mass-54', 'sat-offense-mass-55'],
    icon: '🚀', color: '#DEB887', size: 'small'
  },
  {
    id: 'sat-offense-mass-54',
    classNumber: 54,
    name: 'Torpedo Platform MK-II',
    description: 'Heavy torpedo platform. Fires ship-killer torpedoes with advanced guidance systems for devastating strikes against capital ships.',
    category: 'offense',
    subClass: 'missile-platform',
    type: 'heavy',
    subType: 'mark-ii',
    orbitalLayers: ['mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 400, shield: 100, armor: 80, speed: 6, maneuverability: 4,
      sensorRange: 400, powerOutput: 120, energyConsumption: 60,
      heatDissipation: 100, signalStrength: 35, orbitalStability: 80, durability: 280
    },
    subStats: {
      criticalHitChance: 16, evasionRating: 4, targetingAccuracy: 78,
      scanResolution: 50, dataThroughput: 25, jamResistance: 25,
      repairRate: 6, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 45, emShielding: 35
    },
    offenseStats: {
      baseDamage: 200, rateOfFire: 2, damageType: 'explosive', penetration: 0.4,
      splashRadius: 25, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.45,
      criticalMultiplier: 2.5, accuracy: 75, range: 50, targetingSpeed: 4,
      ammoCapacity: 100, reloadTime: 12, overheatThreshold: 35, powerPerShot: 15
    },
    defenseStats: {
      shieldCapacity: 100, shieldRecharge: 6, shieldType: 'deflector',
      armorHardness: 80, damageReduction: 0.2, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.3, explosive: 0.3, laser: 0.2 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, graviton: 0.25 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.03, emergencyRecharge: 6
    },
    upgradeSlots: 3, availableUpgrades: ['weapon-sync', 'targeting-system', 'power-core', 'cooling-matrix', 'armor-plating'],
    buildCost: { metal: 15000, crystal: 8000, deuterium: 6000, energy: 800 },
    buildTime: 300, tierRequirement: 8, tierMax: 99, levelMax: 999,
    specialAbilities: ['heavy-torpedo', 'capital-ship-killer', 'guided-penetration'],
    synergies: ['sat-offense-mass-53', 'sat-offense-mass-55', 'sat-offense-mass-57'],
    icon: '🎯', color: '#B8860B', size: 'small'
  },
  {
    id: 'sat-offense-mass-55',
    classNumber: 55,
    name: 'Nuclear Warhead Platform MK-III',
    description: 'Strategic nuclear missile platform. Fires tactical nuclear warheads for massive area of effect damage.',
    category: 'offense',
    subClass: 'missile-platform',
    type: 'fortress',
    subType: 'mark-iii',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring', 'interplanetary'],
    baseStats: {
      hull: 500, shield: 180, armor: 120, speed: 3, maneuverability: 2,
      sensorRange: 600, powerOutput: 300, energyConsumption: 150,
      heatDissipation: 200, signalStrength: 45, orbitalStability: 82, durability: 380
    },
    subStats: {
      criticalHitChance: 20, evasionRating: 2, targetingAccuracy: 80,
      scanResolution: 55, dataThroughput: 30, jamResistance: 35,
      repairRate: 8, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 1, radiationHardening: 70, emShielding: 50
    },
    offenseStats: {
      baseDamage: 500, rateOfFire: 1, damageType: 'explosive', penetration: 0.5,
      splashRadius: 50, shieldDamageMultiplier: 0.6, armorDamageMultiplier: 0.55,
      criticalMultiplier: 3.5, accuracy: 72, range: 60, targetingSpeed: 3,
      ammoCapacity: 20, reloadTime: 25, overheatThreshold: 20, powerPerShot: 30
    },
    defenseStats: {
      shieldCapacity: 180, shieldRecharge: 10, shieldType: 'deflector',
      armorHardness: 120, damageReduction: 0.25, regenerationRate: 2,
      resistanceMatrix: { kinetic: 0.35, explosive: 0.4, laser: 0.25, plasma: 0.25 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.25, graviton: 0.3 },
      absorbtionRate: 0.06, reflectionChance: 0.04, adaptiveResistance: 0.04, emergencyRecharge: 10
    },
    upgradeSlots: 4, availableUpgrades: ['weapon-sync', 'targeting-system', 'power-core', 'cooling-matrix', 'armor-plating', 'shield-capacitor'],
    buildCost: { metal: 40000, crystal: 20000, deuterium: 15000, energy: 2500 },
    buildTime: 800, tierRequirement: 13, tierMax: 99, levelMax: 999,
    specialAbilities: ['nuclear-detonation', 'area-denial', 'radiation-contamination', 'shockwave'],
    synergies: ['sat-offense-mass-53', 'sat-offense-mass-54', 'sat-offense-mass-57'],
    icon: '☢️', color: '#FFD700', size: 'medium'
  },
  {
    id: 'sat-offense-drone-56',
    classNumber: 56,
    name: 'Drone Bay Launcher MK-I',
    description: 'Combat drone deployment satellite. Launches swarms of autonomous attack drones that overwhelm enemy point defenses.',
    category: 'offense',
    subClass: 'drone-swarm',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 180, shield: 40, armor: 25, speed: 20, maneuverability: 15,
      sensorRange: 150, powerOutput: 50, energyConsumption: 25,
      heatDissipation: 45, signalStrength: 25, orbitalStability: 74, durability: 100
    },
    subStats: {
      criticalHitChance: 6, evasionRating: 15, targetingAccuracy: 72,
      scanResolution: 40, dataThroughput: 30, jamResistance: 20,
      repairRate: 4, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 30, emShielding: 20
    },
    offenseStats: {
      baseDamage: 15, rateOfFire: 8, damageType: 'kinetic', penetration: 0.08,
      splashRadius: 1, shieldDamageMultiplier: 0.15, armorDamageMultiplier: 0.1,
      criticalMultiplier: 1.5, accuracy: 68, range: 12, targetingSpeed: 8,
      ammoCapacity: 100, reloadTime: 5, overheatThreshold: 60, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 40, shieldRecharge: 3, shieldType: 'energy-barrier',
      armorHardness: 25, damageReduction: 0.08, regenerationRate: 1,
      resistanceMatrix: { kinetic: 0.15, explosive: 0.1 },
      vulnerabilityMatrix: { emp: 0.35, ion: 0.3, laser: 0.2 },
      absorbtionRate: 0.02, reflectionChance: 0.01, adaptiveResistance: 0.02, emergencyRecharge: 3
    },
    upgradeSlots: 2, availableUpgrades: ['weapon-sync', 'computing-core', 'power-core', 'cooling-matrix'],
    buildCost: { metal: 4000, crystal: 3000, deuterium: 1500, energy: 250 },
    buildTime: 90, tierRequirement: 4, tierMax: 99, levelMax: 999,
    specialAbilities: ['drone-swarm-launch', 'auto-targeting-drones', 'swarm-coordination'],
    synergies: ['sat-offense-drone-57', 'sat-offense-drone-58'],
    icon: '🐝', color: '#DAA520', size: 'small'
  },
  {
    id: 'sat-offense-drone-57',
    classNumber: 57,
    name: 'Assault Drone Carrier MK-II',
    description: 'Advanced drone carrier satellite. Deploys specialized assault drones equipped with plasma cutters for hull breaching.',
    category: 'offense',
    subClass: 'drone-swarm',
    type: 'heavy',
    subType: 'mark-ii',
    orbitalLayers: ['mid-orbit', 'high-orbit'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 350, shield: 80, armor: 60, speed: 14, maneuverability: 10,
      sensorRange: 200, powerOutput: 100, energyConsumption: 50,
      heatDissipation: 80, signalStrength: 30, orbitalStability: 76, durability: 220
    },
    subStats: {
      criticalHitChance: 10, evasionRating: 10, targetingAccuracy: 76,
      scanResolution: 45, dataThroughput: 45, jamResistance: 28,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 40, emShielding: 30
    },
    offenseStats: {
      baseDamage: 30, rateOfFire: 6, damageType: 'plasma', penetration: 0.25,
      splashRadius: 3, shieldDamageMultiplier: 0.35, armorDamageMultiplier: 0.3,
      criticalMultiplier: 2.0, accuracy: 72, range: 15, targetingSpeed: 7,
      ammoCapacity: 150, reloadTime: 6, overheatThreshold: 50, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 5, shieldType: 'deflector',
      armorHardness: 60, damageReduction: 0.15, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.15, laser: 0.15 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.25, graviton: 0.2 },
      absorbtionRate: 0.04, reflectionChance: 0.02, adaptiveResistance: 0.03, emergencyRecharge: 5
    },
    upgradeSlots: 3, availableUpgrades: ['weapon-sync', 'computing-core', 'power-core', 'cooling-matrix', 'armor-plating'],
    buildCost: { metal: 10000, crystal: 7000, deuterium: 3000, energy: 600 },
    buildTime: 200, tierRequirement: 7, tierMax: 99, levelMax: 999,
    specialAbilities: ['assault-drones', 'hull-breaching', 'coordinated-strike'],
    synergies: ['sat-offense-drone-56', 'sat-offense-drone-58'],
    icon: '🐞', color: '#8FBC8F', size: 'small'
  },
  {
    id: 'sat-offense-drone-58',
    classNumber: 58,
    name: 'Swarm Mother MK-III',
    description: 'Flagship drone carrier satellite. Houses hundreds of drones and provides real-time coordination for maximum combat efficiency.',
    category: 'offense',
    subClass: 'drone-swarm',
    type: 'command',
    subType: 'mark-iii',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 600, shield: 200, armor: 100, speed: 8, maneuverability: 6,
      sensorRange: 400, powerOutput: 250, energyConsumption: 120,
      heatDissipation: 150, signalStrength: 60, orbitalStability: 80, durability: 380
    },
    subStats: {
      criticalHitChance: 14, evasionRating: 8, targetingAccuracy: 82,
      scanResolution: 55, dataThroughput: 100, jamResistance: 40,
      repairRate: 8, salvageEfficiency: 6, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 55, emShielding: 45
    },
    offenseStats: {
      baseDamage: 45, rateOfFire: 10, damageType: 'kinetic', penetration: 0.18,
      splashRadius: 2, shieldDamageMultiplier: 0.25, armorDamageMultiplier: 0.18,
      criticalMultiplier: 2.2, accuracy: 78, range: 18, targetingSpeed: 10,
      ammoCapacity: 500, reloadTime: 8, overheatThreshold: 45, powerPerShot: 3
    },
    defenseStats: {
      shieldCapacity: 200, shieldRecharge: 12, shieldType: 'adaptive',
      armorHardness: 100, damageReduction: 0.2, regenerationRate: 2.5,
      resistanceMatrix: { kinetic: 0.25, explosive: 0.2, laser: 0.2, plasma: 0.15 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.25, graviton: 0.25 },
      absorbtionRate: 0.06, reflectionChance: 0.04, adaptiveResistance: 0.05, emergencyRecharge: 12
    },
    upgradeSlots: 4, availableUpgrades: ['weapon-sync', 'computing-core', 'power-core', 'cooling-matrix', 'armor-plating', 'shield-capacitor'],
    buildCost: { metal: 25000, crystal: 18000, deuterium: 8000, energy: 1500 },
    buildTime: 500, tierRequirement: 11, tierMax: 99, levelMax: 999,
    specialAbilities: ['mass-drone-launch', 'swarm-coordination', 'adaptive-tactics', 'recovery-drones'],
    synergies: ['sat-offense-drone-56', 'sat-offense-drone-57'],
    icon: '🐝', color: '#FFD700', size: 'medium'
  },
  {
    id: 'sat-offense-emp-59',
    classNumber: 59,
    name: 'EMP Cannon Platform',
    description: 'Electromagnetic pulse cannon satellite. Disables enemy electronics, shields, and weapons systems in a wide area.',
    category: 'offense',
    subClass: 'beam-weapon',
    type: 'experimental',
    subType: 'assault',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 250, shield: 60, armor: 35, speed: 15, maneuverability: 12,
      sensorRange: 180, powerOutput: 120, energyConsumption: 70,
      heatDissipation: 75, signalStrength: 35, orbitalStability: 72, durability: 140
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 12, targetingAccuracy: 78,
      scanResolution: 42, dataThroughput: 20, jamResistance: 60,
      repairRate: 4, salvageEfficiency: 4, warpCooldown: 0,
      stealthRating: 10, radiationHardening: 45, emShielding: 70
    },
    offenseStats: {
      baseDamage: 40, rateOfFire: 2, damageType: 'emp', penetration: 0.3,
      splashRadius: 20, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.05,
      criticalMultiplier: 1.5, accuracy: 75, range: 22, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 40, powerPerShot: 15
    },
    defenseStats: {
      shieldCapacity: 60, shieldRecharge: 5, shieldType: 'phase-shift',
      armorHardness: 35, damageReduction: 0.12, regenerationRate: 1.2,
      resistanceMatrix: { emp: 0.5, ion: 0.3, disruptor: 0.25 },
      vulnerabilityMatrix: { kinetic: 0.2, graviton: 0.3 },
      absorbtionRate: 0.04, reflectionChance: 0.03, adaptiveResistance: 0.05, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'energy-conduit'],
    buildCost: { metal: 8000, crystal: 7000, deuterium: 3000, energy: 600 },
    buildTime: 180, tierRequirement: 8, tierMax: 99, levelMax: 999,
    specialAbilities: ['electromagnetic-pulse', 'system-disabling', 'area-suppression'],
    synergies: ['sat-defense-counter-39', 'sat-offense-beam-46'],
    icon: '⚡', color: '#FFFF00', size: 'small'
  },
  {
    id: 'sat-offense-graviton-60',
    classNumber: 60,
    name: 'Graviton Cannon Platform',
    description: 'Experimental graviton weapon satellite. Warps spacetime to crush enemy ships from the inside out.',
    category: 'offense',
    subClass: 'beam-weapon',
    type: 'experimental',
    subType: 'ultimate',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 400, shield: 150, armor: 80, speed: 5, maneuverability: 4,
      sensorRange: 300, powerOutput: 400, energyConsumption: 200,
      heatDissipation: 180, signalStrength: 50, orbitalStability: 68, durability: 280
    },
    subStats: {
      criticalHitChance: 25, evasionRating: 5, targetingAccuracy: 84,
      scanResolution: 50, dataThroughput: 25, jamResistance: 40,
      repairRate: 6, salvageEfficiency: 5, warpCooldown: 60,
      stealthRating: 2, radiationHardening: 60, emShielding: 55
    },
    offenseStats: {
      baseDamage: 350, rateOfFire: 1, damageType: 'graviton', penetration: 0.8,
      splashRadius: 8, shieldDamageMultiplier: 1.0, armorDamageMultiplier: 0.8,
      criticalMultiplier: 4.0, accuracy: 85, range: 30, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 15, powerPerShot: 50
    },
    defenseStats: {
      shieldCapacity: 150, shieldRecharge: 10, shieldType: 'phase-shift',
      armorHardness: 80, damageReduction: 0.22, regenerationRate: 2,
      resistanceMatrix: { kinetic: 0.3, explosive: 0.25, laser: 0.25, plasma: 0.2 },
      vulnerabilityMatrix: { void: 0.35, tachyon: 0.3 },
      absorbtionRate: 0.06, reflectionChance: 0.05, adaptiveResistance: 0.06, emergencyRecharge: 10
    },
    upgradeSlots: 4, availableUpgrades: ['weapon-sync', 'cooling-matrix', 'power-core', 'targeting-system', 'energy-conduit', 'shield-capacitor'],
    buildCost: { metal: 50000, crystal: 30000, deuterium: 15000, energy: 4000 },
    buildTime: 1000, tierRequirement: 18, tierMax: 99, levelMax: 999,
    specialAbilities: ['spacetime-crush', 'shield-bypass', 'critical-structure-damage', 'internal-destruction'],
    synergies: ['sat-offense-beam-46', 'sat-offense-beam-48', 'sat-recon-gravity-11'],
    icon: '🌀', color: '#4B0082', size: 'medium'
  },

  // ===========================================================================
  // RESOURCE CLASS (61-75)
  // ===========================================================================
  {
    id: 'sat-resource-mining-61',
    classNumber: 61,
    name: 'Mining Drone Satellite MK-I',
    description: 'Automated mining satellite. Extracts raw resources from asteroid fields and planetary surfaces for processing.',
    category: 'resource',
    subClass: 'mining-drone',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'asteroid-belt', 'planet-equator'],
    baseStats: {
      hull: 100, shield: 20, armor: 15, speed: 30, maneuverability: 25,
      sensorRange: 80, powerOutput: 30, energyConsumption: 15,
      heatDissipation: 25, signalStrength: 15, orbitalStability: 85, durability: 60
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 25, targetingAccuracy: 45,
      scanResolution: 35, dataThroughput: 15, jamResistance: 10,
      repairRate: 3, salvageEfficiency: 25, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 35, emShielding: 15
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 1, damageType: 'kinetic', penetration: 0.05,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.3, accuracy: 40, range: 6, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 3
    },
    defenseStats: {
      shieldCapacity: 20, shieldRecharge: 2, shieldType: 'energy-barrier',
      armorHardness: 15, damageReduction: 0.05, regenerationRate: 0.5,
      resistanceMatrix: { kinetic: 0.1, explosive: 0.08 },
      vulnerabilityMatrix: { emp: 0.35, ion: 0.25 },
      absorbtionRate: 0, reflectionChance: 0, adaptiveResistance: 0, emergencyRecharge: 2
    },
    upgradeSlots: 1, availableUpgrades: ['power-core', 'armor-plating'],
    buildCost: { metal: 2000, crystal: 1000, deuterium: 300, energy: 100 },
    buildTime: 50, tierRequirement: 2, tierMax: 99, levelMax: 999,
    specialAbilities: ['automated-mining', 'resource-extraction', 'cargo-storage'],
    synergies: ['sat-resource-refinery-62', 'sat-resource-harvest-63'],
    icon: '⛏️', color: '#8B7355', size: 'tiny'
  },
  {
    id: 'sat-resource-refinery-62',
    classNumber: 62,
    name: 'Refinery Station MK-II',
    description: 'On-orbit resource processing facility. Refines raw ore into usable materials with high efficiency and minimal waste.',
    category: 'resource',
    subClass: 'refinery-station',
    type: 'heavy',
    subType: 'mark-ii',
    orbitalLayers: ['mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 500, shield: 100, armor: 80, speed: 5, maneuverability: 3,
      sensorRange: 100, powerOutput: 200, energyConsumption: 100,
      heatDissipation: 120, signalStrength: 40, orbitalStability: 90, durability: 300
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 3, targetingAccuracy: 50,
      scanResolution: 30, dataThroughput: 40, jamResistance: 20,
      repairRate: 6, salvageEfficiency: 50, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 50, emShielding: 25
    },
    offenseStats: {
      baseDamage: 12, rateOfFire: 1, damageType: 'laser', penetration: 0.06,
      splashRadius: 0, shieldDamageMultiplier: 0.12, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.4, accuracy: 45, range: 8, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 100, shieldRecharge: 6, shieldType: 'deflector',
      armorHardness: 80, damageReduction: 0.15, regenerationRate: 1.2,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.18 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, graviton: 0.2 },
      absorbtionRate: 0.04, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['power-core', 'computing-core', 'armor-plating', 'self-repair'],
    buildCost: { metal: 8000, crystal: 6000, deuterium: 3000, energy: 500 },
    buildTime: 200, tierRequirement: 5, tierMax: 99, levelMax: 999,
    specialAbilities: ['ore-refinement', 'efficiency-processing', 'waste-minimization'],
    synergies: ['sat-resource-mining-61', 'sat-resource-harvest-63', 'sat-resource-storage-64'],
    icon: '🏭', color: '#A9A9A9', size: 'medium'
  },
  {
    id: 'sat-resource-harvest-63',
    classNumber: 63,
    name: 'Solar Harvest Array MK-I',
    description: 'Solar energy collection satellite. Harvests stellar energy and converts it to usable power for planetary and orbital infrastructure.',
    category: 'resource',
    subClass: 'harvest-array',
    type: 'standard',
    subType: 'mark-i',
    orbitalLayers: ['high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 120, shield: 30, armor: 15, speed: 10, maneuverability: 8,
      sensorRange: 50, powerOutput: 500, energyConsumption: -200,
      heatDissipation: 80, signalStrength: 20, orbitalStability: 92, durability: 80
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 8, targetingAccuracy: 40,
      scanResolution: 20, dataThroughput: 10, jamResistance: 5,
      repairRate: 3, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 80, emShielding: 20
    },
    offenseStats: {
      baseDamage: 5, rateOfFire: 1, damageType: 'laser', penetration: 0.02,
      splashRadius: 0, shieldDamageMultiplier: 0.08, armorDamageMultiplier: 0.04,
      criticalMultiplier: 1.2, accuracy: 35, range: 5, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 1
    },
    defenseStats: {
      shieldCapacity: 30, shieldRecharge: 2, shieldType: 'energy-barrier',
      armorHardness: 15, damageReduction: 0.05, regenerationRate: 0.5,
      resistanceMatrix: { laser: 0.2, plasma: 0.15 },
      vulnerabilityMatrix: { kinetic: 0.15, emp: 0.3 },
      absorbtionRate: 0.3, reflectionChance: 0.1, adaptiveResistance: 0.02, emergencyRecharge: 2
    },
    upgradeSlots: 1, availableUpgrades: ['power-core', 'energy-conduit', 'cooling-matrix'],
    buildCost: { metal: 3000, crystal: 4000, deuterium: 500, energy: 50 },
    buildTime: 80, tierRequirement: 3, tierMax: 99, levelMax: 999,
    specialAbilities: ['solar-energy-harvest', 'power-generation', 'net-energy-positive'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62'],
    icon: '☀️', color: '#FFD700', size: 'tiny'
  },
  {
    id: 'sat-resource-storage-64',
    classNumber: 64,
    name: 'Resource Storage Depot MK-I',
    description: 'Orbital resource storage facility. Provides massive secure storage for mined resources and processed materials.',
    category: 'resource',
    subClass: 'refinery-station',
    type: 'fortress',
    subType: 'v1',
    orbitalLayers: ['mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 800, shield: 150, armor: 120, speed: 2, maneuverability: 1,
      sensorRange: 80, powerOutput: 80, energyConsumption: 40,
      heatDissipation: 60, signalStrength: 25, orbitalStability: 95, durability: 500
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 1, targetingAccuracy: 40,
      scanResolution: 20, dataThroughput: 25, jamResistance: 10,
      repairRate: 8, salvageEfficiency: 10, warpCooldown: 0,
      stealthRating: 1, radiationHardening: 60, emShielding: 30
    },
    offenseStats: {
      baseDamage: 10, rateOfFire: 1, damageType: 'kinetic', penetration: 0.05,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.06,
      criticalMultiplier: 1.3, accuracy: 40, range: 6, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 150, shieldRecharge: 8, shieldType: 'deflector',
      armorHardness: 120, damageReduction: 0.2, regenerationRate: 1,
      resistanceMatrix: { kinetic: 0.3, explosive: 0.25, laser: 0.15 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, graviton: 0.25 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.02, emergencyRecharge: 6
    },
    upgradeSlots: 2, availableUpgrades: ['armor-plating', 'power-core', 'self-repair', 'computing-core'],
    buildCost: { metal: 10000, crystal: 5000, deuterium: 2000, energy: 300 },
    buildTime: 180, tierRequirement: 5, tierMax: 99, levelMax: 999,
    specialAbilities: ['secure-storage', 'cargo-management', 'resource-protection'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62', 'sat-resource-harvest-63'],
    icon: '📦', color: '#BDB76B', size: 'medium'
  },
  {
    id: 'sat-resource-advanced-65',
    classNumber: 65,
    name: 'Advanced Materials Forge',
    description: 'Heavy industrial satellite for processing advanced alloys, crystals, and exotic materials. Requires significant power.',
    category: 'resource',
    subClass: 'refinery-station',
    type: 'fortress',
    subType: 'enhanced',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 600, shield: 120, armor: 100, speed: 3, maneuverability: 2,
      sensorRange: 120, powerOutput: 400, energyConsumption: 250,
      heatDissipation: 200, signalStrength: 45, orbitalStability: 88, durability: 400
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 2, targetingAccuracy: 55,
      scanResolution: 35, dataThroughput: 50, jamResistance: 25,
      repairRate: 6, salvageEfficiency: 60, warpCooldown: 0,
      stealthRating: 1, radiationHardening: 65, emShielding: 35
    },
    offenseStats: {
      baseDamage: 18, rateOfFire: 2, damageType: 'plasma', penetration: 0.12,
      splashRadius: 2, shieldDamageMultiplier: 0.2, armorDamageMultiplier: 0.15,
      criticalMultiplier: 1.6, accuracy: 55, range: 10, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 70, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 120, shieldRecharge: 8, shieldType: 'deflector',
      armorHardness: 100, damageReduction: 0.2, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.25, explosive: 0.22, laser: 0.2 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, graviton: 0.25 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.03, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['power-core', 'computing-core', 'armor-plating', 'energy-conduit', 'cooling-matrix'],
    buildCost: { metal: 20000, crystal: 15000, deuterium: 8000, energy: 1500 },
    buildTime: 400, tierRequirement: 9, tierMax: 99, levelMax: 999,
    specialAbilities: ['advanced-forging', 'alloy-processing', 'crystal-synthesis', 'exotic-material-crafting'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62', 'sat-resource-harvest-63'],
    icon: '🔥', color: '#CD5C5C', size: 'medium'
  },
  {
    id: 'sat-resource-gas-66',
    classNumber: 66,
    name: 'Gas Giant Extractor',
    description: 'Specialized extraction platform for harvesting deuterium and other gases from gas giant atmospheres.',
    category: 'resource',
    subClass: 'mining-drone',
    type: 'heavy',
    subType: 'type-b',
    orbitalLayers: ['low-orbit'],
    deploymentZones: ['planet-equator'],
    baseStats: {
      hull: 300, shield: 60, armor: 40, speed: 8, maneuverability: 5,
      sensorRange: 60, powerOutput: 80, energyConsumption: 50,
      heatDissipation: 60, signalStrength: 20, orbitalStability: 82, durability: 180
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 5, targetingAccuracy: 40,
      scanResolution: 25, dataThroughput: 20, jamResistance: 15,
      repairRate: 4, salvageEfficiency: 35, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 70, emShielding: 50
    },
    offenseStats: {
      baseDamage: 10, rateOfFire: 1, damageType: 'laser', penetration: 0.04,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.06,
      criticalMultiplier: 1.3, accuracy: 38, range: 7, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 60, shieldRecharge: 4, shieldType: 'energy-barrier',
      armorHardness: 40, damageReduction: 0.1, regenerationRate: 0.8,
      resistanceMatrix: { kinetic: 0.15, explosive: 0.1 },
      vulnerabilityMatrix: { emp: 0.35, ion: 0.25, laser: 0.15 },
      absorbtionRate: 0.02, reflectionChance: 0.01, adaptiveResistance: 0.02, emergencyRecharge: 3
    },
    upgradeSlots: 2, availableUpgrades: ['power-core', 'armor-plating', 'computing-core'],
    buildCost: { metal: 12000, crystal: 8000, deuterium: 6000, energy: 600 },
    buildTime: 250, tierRequirement: 7, tierMax: 99, levelMax: 999,
    specialAbilities: ['atmospheric-extraction', 'gas-harvesting', 'deuterium-collection'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62'],
    icon: '🌬️', color: '#7FFF00', size: 'small'
  },
  {
    id: 'sat-resource-crystal-67',
    classNumber: 67,
    name: 'Crystal Mining Array',
    description: 'Specialized crystal mining satellite. Extracts rare crystals from asteroid fields and crystalline planetary surfaces.',
    category: 'resource',
    subClass: 'mining-drone',
    type: 'advanced',
    subType: 'type-c',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-crater', 'asteroid-belt', 'planet-equator'],
    baseStats: {
      hull: 150, shield: 35, armor: 20, speed: 22, maneuverability: 18,
      sensorRange: 100, powerOutput: 45, energyConsumption: 20,
      heatDissipation: 35, signalStrength: 18, orbitalStability: 80, durability: 90
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 18, targetingAccuracy: 48,
      scanResolution: 40, dataThroughput: 22, jamResistance: 12,
      repairRate: 3, salvageEfficiency: 30, warpCooldown: 0,
      stealthRating: 6, radiationHardening: 40, emShielding: 20
    },
    offenseStats: {
      baseDamage: 9, rateOfFire: 2, damageType: 'laser', penetration: 0.06,
      splashRadius: 0, shieldDamageMultiplier: 0.12, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.4, accuracy: 45, range: 8, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 90, powerPerShot: 3
    },
    defenseStats: {
      shieldCapacity: 35, shieldRecharge: 3, shieldType: 'energy-barrier',
      armorHardness: 20, damageReduction: 0.07, regenerationRate: 0.6,
      resistanceMatrix: { kinetic: 0.12, explosive: 0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.22, plasma: 0.15 },
      absorbtionRate: 0.02, reflectionChance: 0.01, adaptiveResistance: 0.01, emergencyRecharge: 2
    },
    upgradeSlots: 2, availableUpgrades: ['power-core', 'armor-plating', 'cooling-matrix'],
    buildCost: { metal: 3000, crystal: 5000, deuterium: 1000, energy: 200 },
    buildTime: 70, tierRequirement: 4, tierMax: 99, levelMax: 999,
    specialAbilities: ['crystal-extraction', 'rare-mining', 'precision-harvest'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62'],
    icon: '💎', color: '#00CED1', size: 'tiny'
  },
  {
    id: 'sat-resource-antimatter-68',
    classNumber: 68,
    name: 'Antimatter Collector',
    description: 'Advanced antimatter collection satellite. Harnesses antimatter from exotic sources for use in high-energy applications.',
    category: 'resource',
    subClass: 'harvest-array',
    type: 'experimental',
    subType: 'prototype',
    orbitalLayers: ['high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary'],
    baseStats: {
      hull: 250, shield: 80, armor: 40, speed: 12, maneuverability: 10,
      sensorRange: 200, powerOutput: 600, energyConsumption: 400,
      heatDissipation: 150, signalStrength: 55, orbitalStability: 70, durability: 160
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 10, targetingAccuracy: 60,
      scanResolution: 45, dataThroughput: 30, jamResistance: 35,
      repairRate: 4, salvageEfficiency: 20, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 85, emShielding: 65
    },
    offenseStats: {
      baseDamage: 15, rateOfFire: 2, damageType: 'plasma', penetration: 0.1,
      splashRadius: 3, shieldDamageMultiplier: 0.2, armorDamageMultiplier: 0.12,
      criticalMultiplier: 1.6, accuracy: 55, range: 10, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 60, powerPerShot: 10
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 8, shieldType: 'phase-shift',
      armorHardness: 40, damageReduction: 0.15, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.2, laser: 0.15 },
      vulnerabilityMatrix: { graviton: 0.3, void: 0.25 },
      absorbtionRate: 0.08, reflectionChance: 0.04, adaptiveResistance: 0.05, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['power-core', 'energy-conduit', 'cooling-matrix', 'computing-core', 'shield-capacitor'],
    buildCost: { metal: 25000, crystal: 30000, deuterium: 10000, energy: 3000 },
    buildTime: 600, tierRequirement: 15, tierMax: 99, levelMax: 999,
    specialAbilities: ['antimatter-harvest', 'exotic-collection', 'high-energy-storage'],
    synergies: ['sat-resource-harvest-63', 'sat-resource-advanced-65', 'sat-specialized-warp-76'],
    icon: '⚛️', color: '#FF00FF', size: 'small'
  },
  {
    id: 'sat-resource-dark-69',
    classNumber: 69,
    name: 'Dark Matter Extractor',
    description: 'Experimental dark matter collection satellite. Extracts and processes dark matter from gravitational anomalies.',
    category: 'resource',
    subClass: 'harvest-array',
    type: 'experimental',
    subType: 'prototype',
    orbitalLayers: ['deep-space'],
    deploymentZones: ['interplanetary', 'planet-lagrange'],
    baseStats: {
      hull: 300, shield: 100, armor: 50, speed: 8, maneuverability: 6,
      sensorRange: 300, powerOutput: 800, energyConsumption: 600,
      heatDissipation: 200, signalStrength: 65, orbitalStability: 60, durability: 200
    },
    subStats: {
      criticalHitChance: 10, evasionRating: 8, targetingAccuracy: 65,
      scanResolution: 50, dataThroughput: 40, jamResistance: 40,
      repairRate: 5, salvageEfficiency: 25, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 90, emShielding: 70
    },
    offenseStats: {
      baseDamage: 20, rateOfFire: 2, damageType: 'graviton', penetration: 0.2,
      splashRadius: 4, shieldDamageMultiplier: 0.3, armorDamageMultiplier: 0.2,
      criticalMultiplier: 2.0, accuracy: 60, range: 12, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 45, powerPerShot: 15
    },
    defenseStats: {
      shieldCapacity: 100, shieldRecharge: 10, shieldType: 'phase-shift',
      armorHardness: 50, damageReduction: 0.18, regenerationRate: 2,
      resistanceMatrix: { graviton: 0.3, kinetic: 0.2, laser: 0.15 },
      vulnerabilityMatrix: { void: 0.3, tachyon: 0.25 },
      absorbtionRate: 0.08, reflectionChance: 0.05, adaptiveResistance: 0.06, emergencyRecharge: 10
    },
    upgradeSlots: 3, availableUpgrades: ['power-core', 'energy-conduit', 'cooling-matrix', 'computing-core', 'shield-capacitor'],
    buildCost: { metal: 50000, crystal: 40000, deuterium: 20000, energy: 5000 },
    buildTime: 1200, tierRequirement: 20, tierMax: 99, levelMax: 999,
    specialAbilities: ['dark-matter-harvest', 'gravity-anomaly-extraction', 'exotic-matter-processing'],
    synergies: ['sat-resource-antimatter-68', 'sat-specialized-gravity-82', 'sat-recon-gravity-11'],
    icon: '🕳️', color: '#2F2F4F', size: 'medium'
  },
  {
    id: 'sat-resource-scrap-70',
    classNumber: 70,
    name: 'Scrap Recovery Satellite',
    description: 'Salvage and recovery satellite. Collects scrap from destroyed ships and structures for recycling into raw materials.',
    category: 'resource',
    subClass: 'mining-drone',
    type: 'support',
    subType: 'type-d',
    orbitalLayers: ['low-orbit', 'mid-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'asteroid-belt'],
    baseStats: {
      hull: 120, shield: 25, armor: 15, speed: 35, maneuverability: 30,
      sensorRange: 90, powerOutput: 25, energyConsumption: 10,
      heatDissipation: 28, signalStrength: 20, orbitalStability: 80, durability: 70
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 30, targetingAccuracy: 50,
      scanResolution: 30, dataThroughput: 25, jamResistance: 15,
      repairRate: 4, salvageEfficiency: 45, warpCooldown: 0,
      stealthRating: 10, radiationHardening: 30, emShielding: 18
    },
    offenseStats: {
      baseDamage: 6, rateOfFire: 2, damageType: 'kinetic', penetration: 0.04,
      splashRadius: 0, shieldDamageMultiplier: 0.08, armorDamageMultiplier: 0.05,
      criticalMultiplier: 1.3, accuracy: 42, range: 7, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 25, shieldRecharge: 2, shieldType: 'energy-barrier',
      armorHardness: 15, damageReduction: 0.06, regenerationRate: 0.5,
      resistanceMatrix: { kinetic: 0.12, explosive: 0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.22 },
      absorbtionRate: 0.02, reflectionChance: 0.01, adaptiveResistance: 0.01, emergencyRecharge: 2
    },
    upgradeSlots: 1, availableUpgrades: ['power-core', 'computing-core', 'self-repair'],
    buildCost: { metal: 1500, crystal: 800, deuterium: 200, energy: 80 },
    buildTime: 40, tierRequirement: 2, tierMax: 99, levelMax: 999,
    specialAbilities: ['debris-collection', 'scrap-salvage', 'resource-recycling'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62'],
    icon: '♻️', color: '#808080', size: 'tiny'
  },
  {
    id: 'sat-resource-construction-71',
    classNumber: 71,
    name: 'Orbital Construction Yard',
    description: 'Automated construction facility satellite. Builds and repairs ships, stations, and other satellites in orbit.',
    category: 'resource',
    subClass: 'refinery-station',
    type: 'fortress',
    subType: 'enhanced',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 1000, shield: 200, armor: 150, speed: 2, maneuverability: 1,
      sensorRange: 150, powerOutput: 500, energyConsumption: 300,
      heatDissipation: 250, signalStrength: 50, orbitalStability: 90, durability: 600
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 1, targetingAccuracy: 50,
      scanResolution: 30, dataThroughput: 60, jamResistance: 30,
      repairRate: 20, salvageEfficiency: 30, warpCooldown: 0,
      stealthRating: 1, radiationHardening: 60, emShielding: 40
    },
    offenseStats: {
      baseDamage: 15, rateOfFire: 2, damageType: 'laser', penetration: 0.08,
      splashRadius: 2, shieldDamageMultiplier: 0.15, armorDamageMultiplier: 0.1,
      criticalMultiplier: 1.5, accuracy: 50, range: 10, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 80, powerPerShot: 6
    },
    defenseStats: {
      shieldCapacity: 200, shieldRecharge: 10, shieldType: 'deflector',
      armorHardness: 150, damageReduction: 0.22, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.3, explosive: 0.25, laser: 0.2 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, graviton: 0.25 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.03, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['power-core', 'armor-plating', 'self-repair', 'computing-core', 'energy-conduit'],
    buildCost: { metal: 30000, crystal: 20000, deuterium: 10000, energy: 2000 },
    buildTime: 500, tierRequirement: 10, tierMax: 99, levelMax: 999,
    specialAbilities: ['ship-construction', 'satellite-assembly', 'repair-services', 'upgrade-facility'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62', 'sat-resource-storage-64'],
    icon: '🏗️', color: '#DEB887', size: 'huge'
  },
  {
    id: 'sat-resource-asteroid-72',
    classNumber: 72,
    name: 'Asteroid Mining Platform',
    description: 'Mobile asteroid mining platform. Captures and processes entire asteroids for maximum resource extraction.',
    category: 'resource',
    subClass: 'mining-drone',
    type: 'mobile',
    subType: 'type-e',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit', 'deep-space'],
    deploymentZones: ['asteroid-belt', 'interplanetary', 'moon-equator'],
    baseStats: {
      hull: 500, shield: 100, armor: 80, speed: 25, maneuverability: 12,
      sensorRange: 150, powerOutput: 120, energyConsumption: 70,
      heatDissipation: 90, signalStrength: 30, orbitalStability: 72, durability: 300
    },
    subStats: {
      criticalHitChance: 6, evasionRating: 12, targetingAccuracy: 55,
      scanResolution: 38, dataThroughput: 35, jamResistance: 20,
      repairRate: 6, salvageEfficiency: 55, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 65, emShielding: 30
    },
    offenseStats: {
      baseDamage: 20, rateOfFire: 2, damageType: 'kinetic', penetration: 0.1,
      splashRadius: 2, shieldDamageMultiplier: 0.18, armorDamageMultiplier: 0.12,
      criticalMultiplier: 1.5, accuracy: 50, range: 10, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 75, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 100, shieldRecharge: 6, shieldType: 'deflector',
      armorHardness: 80, damageReduction: 0.16, regenerationRate: 1.2,
      resistanceMatrix: { kinetic: 0.25, explosive: 0.2, laser: 0.12 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, graviton: 0.22 },
      absorbtionRate: 0.04, reflectionChance: 0.02, adaptiveResistance: 0.03, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['power-core', 'armor-plating', 'computing-core', 'propulsion'],
    buildCost: { metal: 15000, crystal: 10000, deuterium: 5000, energy: 800 },
    buildTime: 300, tierRequirement: 8, tierMax: 99, levelMax: 999,
    specialAbilities: ['asteroid-capture', 'mobile-mining', 'in-situ-processing'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62', 'sat-resource-storage-64'],
    icon: '🪨', color: '#708090', size: 'medium'
  },
  {
    id: 'sat-resource-power-73',
    classNumber: 73,
    name: 'Fusion Power Satellite',
    description: 'Orbital fusion reactor satellite. Provides massive amounts of clean energy to planetary and orbital infrastructure.',
    category: 'resource',
    subClass: 'harvest-array',
    type: 'fortress',
    subType: 'enhanced',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 400, shield: 150, armor: 80, speed: 3, maneuverability: 2,
      sensorRange: 60, powerOutput: 2000, energyConsumption: -500,
      heatDissipation: 300, signalStrength: 35, orbitalStability: 88, durability: 300
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 2, targetingAccuracy: 45,
      scanResolution: 20, dataThroughput: 15, jamResistance: 15,
      repairRate: 4, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 80, emShielding: 50
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 1, damageType: 'plasma', penetration: 0.08,
      splashRadius: 0, shieldDamageMultiplier: 0.2, armorDamageMultiplier: 0.1,
      criticalMultiplier: 1.4, accuracy: 40, range: 6, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 50, powerPerShot: 15
    },
    defenseStats: {
      shieldCapacity: 150, shieldRecharge: 10, shieldType: 'deflector',
      armorHardness: 80, damageReduction: 0.18, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.2, plasma: 0.3 },
      vulnerabilityMatrix: { emp: 0.35, ion: 0.3, graviton: 0.3 },
      absorbtionRate: 0.05, reflectionChance: 0.03, adaptiveResistance: 0.03, emergencyRecharge: 8
    },
    upgradeSlots: 2, availableUpgrades: ['power-core', 'cooling-matrix', 'energy-conduit', 'shield-capacitor'],
    buildCost: { metal: 20000, crystal: 25000, deuterium: 10000, energy: 200 },
    buildTime: 450, tierRequirement: 12, tierMax: 99, levelMax: 999,
    specialAbilities: ['fusion-power', 'clean-energy', 'grid-stabilization', 'overcharge'],
    synergies: ['sat-resource-harvest-63', 'sat-defense-shield-34', 'sat-comm-nexus-18'],
    icon: '⚡', color: '#FF6347', size: 'medium'
  },
  {
    id: 'sat-resource-research-74',
    classNumber: 74,
    name: 'Orbital Research Lab',
    description: 'Orbital research laboratory satellite. Conducts experiments in microgravity and provides research bonuses to all technologies.',
    category: 'resource',
    subClass: 'refinery-station',
    type: 'advanced',
    subType: 'enhanced',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 250, shield: 60, armor: 30, speed: 8, maneuverability: 5,
      sensorRange: 200, powerOutput: 100, energyConsumption: 60,
      heatDissipation: 70, signalStrength: 60, orbitalStability: 88, durability: 150
    },
    subStats: {
      criticalHitChance: 6, evasionRating: 5, targetingAccuracy: 60,
      scanResolution: 60, dataThroughput: 80, jamResistance: 40,
      repairRate: 4, salvageEfficiency: 8, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 50, emShielding: 45
    },
    offenseStats: {
      baseDamage: 6, rateOfFire: 1, damageType: 'laser', penetration: 0.04,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.06,
      criticalMultiplier: 1.3, accuracy: 45, range: 8, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 3
    },
    defenseStats: {
      shieldCapacity: 60, shieldRecharge: 5, shieldType: 'energy-barrier',
      armorHardness: 30, damageReduction: 0.1, regenerationRate: 1,
      resistanceMatrix: { kinetic: 0.15, explosive: 0.1, laser: 0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0.02, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 4
    },
    upgradeSlots: 3, availableUpgrades: ['computing-core', 'power-core', 'energy-conduit', 'cooling-matrix'],
    buildCost: { metal: 8000, crystal: 12000, deuterium: 4000, energy: 600 },
    buildTime: 200, tierRequirement: 6, tierMax: 99, levelMax: 999,
    specialAbilities: ['microgravity-research', 'tech-boost', 'experiment-conducting'],
    synergies: ['sat-recon-survey-6', 'sat-comm-data-24'],
    icon: '🔬', color: '#98FB98', size: 'small'
  },
  {
    id: 'sat-resource-logistics-75',
    classNumber: 75,
    name: 'Logistics Coordination Hub',
    description: 'Resource logistics coordination satellite. Manages resource allocation, transport routing, and supply chain optimization.',
    category: 'resource',
    subClass: 'refinery-station',
    type: 'command',
    subType: 'enhanced',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 350, shield: 80, armor: 50, speed: 10, maneuverability: 8,
      sensorRange: 250, powerOutput: 150, energyConsumption: 70,
      heatDissipation: 80, signalStrength: 75, orbitalStability: 86, durability: 200
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 8, targetingAccuracy: 60,
      scanResolution: 45, dataThroughput: 120, jamResistance: 35,
      repairRate: 5, salvageEfficiency: 15, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 50, emShielding: 40
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 1, damageType: 'laser', penetration: 0.05,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.06,
      criticalMultiplier: 1.4, accuracy: 48, range: 9, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 6, shieldType: 'deflector',
      armorHardness: 50, damageReduction: 0.12, regenerationRate: 1.2,
      resistanceMatrix: { kinetic: 0.18, explosive: 0.15, laser: 0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.22 },
      absorbtionRate: 0.03, reflectionChance: 0.02, adaptiveResistance: 0.02, emergencyRecharge: 5
    },
    upgradeSlots: 2, availableUpgrades: ['computing-core', 'power-core', 'energy-conduit'],
    buildCost: { metal: 10000, crystal: 8000, deuterium: 4000, energy: 500 },
    buildTime: 220, tierRequirement: 7, tierMax: 99, levelMax: 999,
    specialAbilities: ['supply-chain-optimization', 'resource-allocation', 'transport-routing'],
    synergies: ['sat-resource-mining-61', 'sat-resource-refinery-62', 'sat-resource-storage-64'],
    icon: '📋', color: '#20B2AA', size: 'small'
  },

  // ===========================================================================
  // SPECIALIZED CLASS (76-90)
  // ===========================================================================
  {
    id: 'sat-specialized-warp-76',
    classNumber: 76,
    name: 'Warp Relay Beacon',
    description: 'Warp navigation satellite that stabilizes warp routes and reduces FTL transit times for friendly fleets.',
    category: 'specialized',
    subClass: 'warp-relay',
    type: 'advanced',
    subType: 'type-a',
    orbitalLayers: ['high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary'],
    baseStats: {
      hull: 200, shield: 60, armor: 30, speed: 20, maneuverability: 15,
      sensorRange: 500, powerOutput: 150, energyConsumption: 80,
      heatDissipation: 80, signalStrength: 70, orbitalStability: 72, durability: 120
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 15, targetingAccuracy: 65,
      scanResolution: 50, dataThroughput: 40, jamResistance: 30,
      repairRate: 4, salvageEfficiency: 5, warpCooldown: 30,
      stealthRating: 10, radiationHardening: 60, emShielding: 45
    },
    offenseStats: {
      baseDamage: 10, rateOfFire: 1, damageType: 'graviton', penetration: 0.15,
      splashRadius: 0, shieldDamageMultiplier: 0.3, armorDamageMultiplier: 0.15,
      criticalMultiplier: 1.5, accuracy: 60, range: 15, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 50, powerPerShot: 10
    },
    defenseStats: {
      shieldCapacity: 60, shieldRecharge: 6, shieldType: 'phase-shift',
      armorHardness: 30, damageReduction: 0.12, regenerationRate: 1.5,
      resistanceMatrix: { graviton: 0.3, tachyon: 0.2, kinetic: 0.15 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.25, plasma: 0.2 },
      absorbtionRate: 0.04, reflectionChance: 0.03, adaptiveResistance: 0.04, emergencyRecharge: 6
    },
    upgradeSlots: 2, availableUpgrades: ['power-core', 'energy-conduit', 'computing-core', 'cooling-matrix'],
    buildCost: { metal: 10000, crystal: 8000, deuterium: 6000, energy: 800 },
    buildTime: 250, tierRequirement: 9, tierMax: 99, levelMax: 999,
    specialAbilities: ['warp-stabilization', 'ftl-assist', 'route-calculation'],
    synergies: ['sat-recon-warp-9', 'sat-comm-hyperlane-27'],
    icon: '🌀', color: '#483D8B', size: 'small'
  },
  {
    id: 'sat-specialized-warp-77',
    classNumber: 77,
    name: 'Quantum Gate Controller',
    description: 'Quantum gate network satellite. Controls quantum gate connections for instant travel between paired gates.',
    category: 'specialized',
    subClass: 'warp-relay',
    type: 'experimental',
    subType: 'ultimate',
    orbitalLayers: ['geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary'],
    baseStats: {
      hull: 400, shield: 150, armor: 60, speed: 8, maneuverability: 5,
      sensorRange: 1000, powerOutput: 500, energyConsumption: 300,
      heatDissipation: 200, signalStrength: 85, orbitalStability: 65, durability: 250
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 5, targetingAccuracy: 72,
      scanResolution: 55, dataThroughput: 100, jamResistance: 55,
      repairRate: 5, salvageEfficiency: 8, warpCooldown: 10,
      stealthRating: 4, radiationHardening: 70, emShielding: 65
    },
    offenseStats: {
      baseDamage: 25, rateOfFire: 1, damageType: 'quantum', penetration: 0.5,
      splashRadius: 0, shieldDamageMultiplier: 0.7, armorDamageMultiplier: 0.4,
      criticalMultiplier: 2.5, accuracy: 72, range: 20, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 30, powerPerShot: 25
    },
    defenseStats: {
      shieldCapacity: 150, shieldRecharge: 12, shieldType: 'quantum-lock',
      armorHardness: 60, damageReduction: 0.2, regenerationRate: 2.5,
      resistanceMatrix: { quantum: 0.4, graviton: 0.3, tachyon: 0.25 },
      vulnerabilityMatrix: { void: 0.35, disruptor: 0.3 },
      absorbtionRate: 0.08, reflectionChance: 0.05, adaptiveResistance: 0.08, emergencyRecharge: 15
    },
    upgradeSlots: 4, availableUpgrades: ['power-core', 'energy-conduit', 'computing-core', 'cooling-matrix', 'shield-capacitor'],
    buildCost: { metal: 40000, crystal: 30000, deuterium: 20000, energy: 4000 },
    buildTime: 900, tierRequirement: 20, tierMax: 99, levelMax: 999,
    specialAbilities: ['quantum-gate-control', 'instant-travel', 'gate-network', 'dimensional-linking'],
    synergies: ['sat-specialized-warp-76', 'sat-specialized-dimensional-85', 'sat-comm-quantum-20'],
    icon: '🌀', color: '#191970', size: 'medium'
  },
  {
    id: 'sat-specialized-cloak-78',
    classNumber: 78,
    name: 'Cloaking Field Generator MK-I',
    description: 'Stealth field generator satellite. Projects a cloaking field that hides nearby satellites and structures from enemy sensors.',
    category: 'specialized',
    subClass: 'cloaking-field',
    type: 'stealth',
    subType: 'mark-i',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-pole', 'planet-pole', 'planet-lagrange'],
    baseStats: {
      hull: 180, shield: 40, armor: 20, speed: 25, maneuverability: 20,
      sensorRange: 100, powerOutput: 100, energyConsumption: 60,
      heatDissipation: 40, signalStrength: 10, orbitalStability: 70, durability: 90
    },
    subStats: {
      criticalHitChance: 4, evasionRating: 20, targetingAccuracy: 55,
      scanResolution: 25, dataThroughput: 20, jamResistance: 60,
      repairRate: 3, salvageEfficiency: 4, warpCooldown: 0,
      stealthRating: 95, radiationHardening: 35, emShielding: 75
    },
    offenseStats: {
      baseDamage: 5, rateOfFire: 1, damageType: 'emp', penetration: 0.05,
      splashRadius: 0, shieldDamageMultiplier: 0.1, armorDamageMultiplier: 0.03,
      criticalMultiplier: 1.2, accuracy: 35, range: 5, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 60, powerPerShot: 5
    },
    defenseStats: {
      shieldCapacity: 40, shieldRecharge: 4, shieldType: 'phase-shift',
      armorHardness: 20, damageReduction: 0.08, regenerationRate: 0.8,
      resistanceMatrix: { emp: 0.4, ion: 0.3, disruptor: 0.2 },
      vulnerabilityMatrix: { kinetic: 0.2, graviton: 0.3 },
      absorbtionRate: 0.05, reflectionChance: 0.04, adaptiveResistance: 0.08, emergencyRecharge: 4
    },
    upgradeSlots: 2, availableUpgrades: ['stealth-coating', 'power-core', 'energy-conduit', 'cooling-matrix'],
    buildCost: { metal: 8000, crystal: 12000, deuterium: 4000, energy: 600 },
    buildTime: 200, tierRequirement: 8, tierMax: 99, levelMax: 999,
    specialAbilities: ['cloaking-field', 'sensor-evasion', 'emission-suppression'],
    synergies: ['sat-recon-stealth-4', 'sat-specialized-cloak-79'],
    icon: '👁️‍🗨️', color: '#708090', size: 'small'
  },
  {
    id: 'sat-specialized-cloak-79',
    classNumber: 79,
    name: 'Advanced Phase Cloak MK-II',
    description: 'Advanced phase-shift cloaking satellite. Makes satellites and structures partially intangible to avoid incoming fire.',
    category: 'specialized',
    subClass: 'cloaking-field',
    type: 'experimental',
    subType: 'mark-ii',
    orbitalLayers: ['mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 250, shield: 80, armor: 35, speed: 15, maneuverability: 12,
      sensorRange: 120, powerOutput: 200, energyConsumption: 120,
      heatDissipation: 60, signalStrength: 8, orbitalStability: 65, durability: 140
    },
    subStats: {
      criticalHitChance: 6, evasionRating: 15, targetingAccuracy: 58,
      scanResolution: 30, dataThroughput: 25, jamResistance: 70,
      repairRate: 4, salvageEfficiency: 4, warpCooldown: 0,
      stealthRating: 98, radiationHardening: 45, emShielding: 80
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 1, damageType: 'phase', penetration: 0.15,
      splashRadius: 0, shieldDamageMultiplier: 0.2, armorDamageMultiplier: 0.08,
      criticalMultiplier: 1.5, accuracy: 45, range: 8, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 45, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 8, shieldType: 'phase-shift',
      armorHardness: 35, damageReduction: 0.12, regenerationRate: 1.5,
      resistanceMatrix: { emp: 0.5, ion: 0.4, disruptor: 0.35, kinetic: 0.25 },
      vulnerabilityMatrix: { graviton: 0.35, void: 0.3, tachyon: 0.25 },
      absorbtionRate: 0.1, reflectionChance: 0.08, adaptiveResistance: 0.15, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['stealth-coating', 'power-core', 'energy-conduit', 'cooling-matrix', 'computing-core'],
    buildCost: { metal: 20000, crystal: 25000, deuterium: 8000, energy: 1500 },
    buildTime: 450, tierRequirement: 14, tierMax: 99, levelMax: 999,
    specialAbilities: ['phase-cloak', 'intangibility', 'complete-stealth', 'damage-avoidance'],
    synergies: ['sat-specialized-cloak-78', 'sat-recon-stealth-4'],
    icon: '👻', color: '#483D8B', size: 'small'
  },
  {
    id: 'sat-specialized-repair-80',
    classNumber: 80,
    name: 'Auto-Repair Drone Satellite',
    description: 'Automated repair satellite. Deploys repair drones to fix damage on nearby satellites, structures, and ships.',
    category: 'specialized',
    subClass: 'repair-bay',
    type: 'support',
    subType: 'guardian',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 180, shield: 50, armor: 30, speed: 30, maneuverability: 25,
      sensorRange: 120, powerOutput: 60, energyConsumption: 30,
      heatDissipation: 40, signalStrength: 25, orbitalStability: 80, durability: 100
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 25, targetingAccuracy: 60,
      scanResolution: 35, dataThroughput: 30, jamResistance: 20,
      repairRate: 30, salvageEfficiency: 20, warpCooldown: 0,
      stealthRating: 10, radiationHardening: 40, emShielding: 30
    },
    offenseStats: {
      baseDamage: 4, rateOfFire: 1, damageType: 'kinetic', penetration: 0.02,
      splashRadius: 0, shieldDamageMultiplier: 0.05, armorDamageMultiplier: 0.03,
      criticalMultiplier: 1.2, accuracy: 40, range: 5, targetingSpeed: 3,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 50, shieldRecharge: 4, shieldType: 'energy-barrier',
      armorHardness: 30, damageReduction: 0.08, regenerationRate: 1,
      resistanceMatrix: { kinetic: 0.15, explosive: 0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2, plasma: 0.15 },
      absorbtionRate: 0.02, reflectionChance: 0.01, adaptiveResistance: 0.02, emergencyRecharge: 3
    },
    upgradeSlots: 2, availableUpgrades: ['self-repair', 'power-core', 'energy-conduit', 'armor-plating'],
    buildCost: { metal: 5000, crystal: 4000, deuterium: 2000, energy: 300 },
    buildTime: 120, tierRequirement: 5, tierMax: 99, levelMax: 999,
    specialAbilities: ['repair-drone-launch', 'auto-maintenance', 'emergency-repair'],
    synergies: ['sat-defense-regenerative-42', 'sat-resource-construction-71'],
    icon: '🔧', color: '#7FFF00', size: 'small'
  },
  {
    id: 'sat-specialized-repair-81',
    classNumber: 81,
    name: 'Nanite Fabrication Bay MK-II',
    description: 'Advanced nanite fabrication satellite. Uses nanites to rapidly rebuild damaged structures and construct new components.',
    category: 'specialized',
    subClass: 'repair-bay',
    type: 'advanced',
    subType: 'mark-ii',
    orbitalLayers: ['mid-orbit', 'high-orbit', 'geosync'],
    deploymentZones: ['planet-equator', 'planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 300, shield: 80, armor: 50, speed: 15, maneuverability: 12,
      sensorRange: 150, powerOutput: 200, energyConsumption: 100,
      heatDissipation: 100, signalStrength: 30, orbitalStability: 78, durability: 180
    },
    subStats: {
      criticalHitChance: 5, evasionRating: 12, targetingAccuracy: 62,
      scanResolution: 40, dataThroughput: 50, jamResistance: 30,
      repairRate: 50, salvageEfficiency: 35, warpCooldown: 0,
      stealthRating: 6, radiationHardening: 50, emShielding: 40
    },
    offenseStats: {
      baseDamage: 8, rateOfFire: 2, damageType: 'kinetic', penetration: 0.04,
      splashRadius: 0, shieldDamageMultiplier: 0.08, armorDamageMultiplier: 0.05,
      criticalMultiplier: 1.3, accuracy: 48, range: 8, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 80, powerPerShot: 4
    },
    defenseStats: {
      shieldCapacity: 80, shieldRecharge: 6, shieldType: 'deflector',
      armorHardness: 50, damageReduction: 0.14, regenerationRate: 1.5,
      resistanceMatrix: { kinetic: 0.2, explosive: 0.15, laser: 0.12 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.22, graviton: 0.2 },
      absorbtionRate: 0.04, reflectionChance: 0.02, adaptiveResistance: 0.03, emergencyRecharge: 6
    },
    upgradeSlots: 3, availableUpgrades: ['self-repair', 'power-core', 'energy-conduit', 'cooling-matrix', 'computing-core'],
    buildCost: { metal: 15000, crystal: 12000, deuterium: 5000, energy: 800 },
    buildTime: 300, tierRequirement: 10, tierMax: 99, levelMax: 999,
    specialAbilities: ['nanite-fabrication', 'rapid-rebuild', 'component-assembly', 'self-replicating-repair'],
    synergies: ['sat-specialized-repair-80', 'sat-resource-construction-71', 'sat-recon-nanite-8'],
    icon: '🛠️', color: '#00FA9A', size: 'small'
  },
  {
    id: 'sat-specialized-gravity-82',
    classNumber: 82,
    name: 'Gravity Manipulator MK-I',
    description: 'Gravity control satellite. Manipulates local gravity to alter enemy trajectory, protect structures, or assist in resource collection.',
    category: 'specialized',
    subClass: 'gravity-manipulator',
    type: 'experimental',
    subType: 'mark-i',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 350, shield: 120, armor: 60, speed: 8, maneuverability: 6,
      sensorRange: 300, powerOutput: 300, energyConsumption: 180,
      heatDissipation: 150, signalStrength: 45, orbitalStability: 68, durability: 220
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 6, targetingAccuracy: 68,
      scanResolution: 55, dataThroughput: 35, jamResistance: 35,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 4, radiationHardening: 65, emShielding: 55
    },
    offenseStats: {
      baseDamage: 30, rateOfFire: 1, damageType: 'graviton', penetration: 0.4,
      splashRadius: 10, shieldDamageMultiplier: 0.6, armorDamageMultiplier: 0.35,
      criticalMultiplier: 2.2, accuracy: 72, range: 22, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 35, powerPerShot: 20
    },
    defenseStats: {
      shieldCapacity: 120, shieldRecharge: 8, shieldType: 'phase-shift',
      armorHardness: 60, damageReduction: 0.18, regenerationRate: 2,
      resistanceMatrix: { graviton: 0.4, kinetic: 0.25, explosive: 0.2 },
      vulnerabilityMatrix: { void: 0.3, tachyon: 0.25, emp: 0.2 },
      absorbtionRate: 0.06, reflectionChance: 0.04, adaptiveResistance: 0.05, emergencyRecharge: 8
    },
    upgradeSlots: 3, availableUpgrades: ['power-core', 'energy-conduit', 'computing-core', 'cooling-matrix', 'shield-capacitor'],
    buildCost: { metal: 20000, crystal: 15000, deuterium: 8000, energy: 1500 },
    buildTime: 400, tierRequirement: 13, tierMax: 99, levelMax: 999,
    specialAbilities: ['gravity-manipulation', 'trajectory-alteration', 'gravity-protection', 'mass-reduction'],
    synergies: ['sat-recon-gravity-11', 'sat-offense-graviton-60', 'sat-resource-dark-69'],
    icon: '🌌', color: '#9370DB', size: 'small'
  },
  {
    id: 'sat-specialized-gravity-83',
    classNumber: 83,
    name: 'Spacetime Anchoring Module MK-II',
    description: 'Advanced spacetime manipulation satellite. Creates stable spatial anchors to prevent dimensional rifts and stabilize wormholes.',
    category: 'specialized',
    subClass: 'gravity-manipulator',
    type: 'experimental',
    subType: 'mark-ii',
    orbitalLayers: ['geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary'],
    baseStats: {
      hull: 500, shield: 200, armor: 80, speed: 4, maneuverability: 3,
      sensorRange: 500, powerOutput: 600, energyConsumption: 350,
      heatDissipation: 250, signalStrength: 60, orbitalStability: 62, durability: 320
    },
    subStats: {
      criticalHitChance: 10, evasionRating: 3, targetingAccuracy: 72,
      scanResolution: 60, dataThroughput: 50, jamResistance: 50,
      repairRate: 6, salvageEfficiency: 6, warpCooldown: 0,
      stealthRating: 3, radiationHardening: 75, emShielding: 65
    },
    offenseStats: {
      baseDamage: 50, rateOfFire: 1, damageType: 'graviton', penetration: 0.55,
      splashRadius: 15, shieldDamageMultiplier: 0.7, armorDamageMultiplier: 0.45,
      criticalMultiplier: 2.8, accuracy: 75, range: 28, targetingSpeed: 5,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 25, powerPerShot: 30
    },
    defenseStats: {
      shieldCapacity: 200, shieldRecharge: 15, shieldType: 'quantum-lock',
      armorHardness: 80, damageReduction: 0.22, regenerationRate: 3,
      resistanceMatrix: { graviton: 0.5, void: 0.4, tachyon: 0.35, quantum: 0.3 },
      vulnerabilityMatrix: { disruptor: 0.3, plasma: 0.2 },
      absorbtionRate: 0.1, reflectionChance: 0.06, adaptiveResistance: 0.08, emergencyRecharge: 15
    },
    upgradeSlots: 4, availableUpgrades: ['power-core', 'energy-conduit', 'computing-core', 'cooling-matrix', 'shield-capacitor', 'armor-plating'],
    buildCost: { metal: 40000, crystal: 30000, deuterium: 15000, energy: 3000 },
    buildTime: 800, tierRequirement: 18, tierMax: 99, levelMax: 999,
    specialAbilities: ['spacetime-anchor', 'dimensional-stabilization', 'wormhole-control', 'reality-hardening'],
    synergies: ['sat-specialized-gravity-82', 'sat-specialized-reality-84', 'sat-specialized-dimensional-85'],
    icon: '🔗', color: '#6A5ACD', size: 'medium'
  },
  {
    id: 'sat-specialized-reality-84',
    classNumber: 84,
    name: 'Reality Anchor',
    description: 'Reality stabilization satellite. Anchors local reality to prevent unauthorized space-time manipulation and exotic threats.',
    category: 'specialized',
    subClass: 'reality-anchor',
    type: 'ancient',
    subType: 'alpha',
    orbitalLayers: ['geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'interplanetary'],
    baseStats: {
      hull: 600, shield: 200, armor: 100, speed: 3, maneuverability: 2,
      sensorRange: 800, powerOutput: 400, energyConsumption: 250,
      heatDissipation: 200, signalStrength: 70, orbitalStability: 75, durability: 400
    },
    subStats: {
      criticalHitChance: 8, evasionRating: 2, targetingAccuracy: 75,
      scanResolution: 65, dataThroughput: 60, jamResistance: 80,
      repairRate: 6, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 80, emShielding: 80
    },
    offenseStats: {
      baseDamage: 40, rateOfFire: 1, damageType: 'quantum', penetration: 0.4,
      splashRadius: 8, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.35,
      criticalMultiplier: 2.5, accuracy: 78, range: 25, targetingSpeed: 4,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 30, powerPerShot: 22
    },
    defenseStats: {
      shieldCapacity: 200, shieldRecharge: 15, shieldType: 'quantum-lock',
      armorHardness: 100, damageReduction: 0.25, regenerationRate: 3,
      resistanceMatrix: { graviton: 0.5, void: 0.5, quantum: 0.4, disruptor: 0.35, tachyon: 0.3 },
      vulnerabilityMatrix: { kinetic: 0.15, laser: 0.15 },
      absorbtionRate: 0.12, reflectionChance: 0.08, adaptiveResistance: 0.1, emergencyRecharge: 20
    },
    upgradeSlots: 4, availableUpgrades: ['power-core', 'energy-conduit', 'computing-core', 'cooling-matrix', 'shield-capacitor', 'armor-plating'],
    buildCost: { metal: 50000, crystal: 40000, deuterium: 20000, energy: 4000 },
    buildTime: 1000, tierRequirement: 22, tierMax: 99, levelMax: 999,
    specialAbilities: ['reality-anchoring', 'exotic-threat-nullification', 'dimensional-barrier', 'laws-of-physics-enforcement'],
    synergies: ['sat-specialized-gravity-82', 'sat-specialized-gravity-83', 'sat-specialized-dimensional-85'],
    icon: '⚓', color: '#2F4F4F', size: 'medium'
  },
  {
    id: 'sat-specialized-dimensional-85',
    classNumber: 85,
    name: 'Dimensional Gate Link',
    description: 'Dimensional gateway satellite. Interfaces with dimensional gates for interdimensional travel and exploration.',
    category: 'specialized',
    subClass: 'dimensional-gate',
    type: 'ancient',
    subType: 'ultimate',
    orbitalLayers: ['deep-space'],
    deploymentZones: ['interplanetary', 'planet-lagrange'],
    baseStats: {
      hull: 800, shield: 300, armor: 150, speed: 2, maneuverability: 1,
      sensorRange: 2000, powerOutput: 800, energyConsumption: 500,
      heatDissipation: 400, signalStrength: 90, orbitalStability: 60, durability: 500
    },
    subStats: {
      criticalHitChance: 12, evasionRating: 1, targetingAccuracy: 80,
      scanResolution: 70, dataThroughput: 200, jamResistance: 70,
      repairRate: 8, salvageEfficiency: 10, warpCooldown: 5,
      stealthRating: 2, radiationHardening: 85, emShielding: 80
    },
    offenseStats: {
      baseDamage: 60, rateOfFire: 2, damageType: 'void', penetration: 0.6,
      splashRadius: 12, shieldDamageMultiplier: 0.8, armorDamageMultiplier: 0.5,
      criticalMultiplier: 3.0, accuracy: 80, range: 35, targetingSpeed: 6,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 20, powerPerShot: 35
    },
    defenseStats: {
      shieldCapacity: 300, shieldRecharge: 25, shieldType: 'quantum-lock',
      armorHardness: 150, damageReduction: 0.3, regenerationRate: 4,
      resistanceMatrix: { void: 0.5, quantum: 0.5, graviton: 0.4, tachyon: 0.4, disruptor: 0.35 },
      vulnerabilityMatrix: { kinetic: 0.15, laser: 0.15, plasma: 0.15 },
      absorbtionRate: 0.15, reflectionChance: 0.1, adaptiveResistance: 0.12, emergencyRecharge: 25
    },
    upgradeSlots: 5, availableUpgrades: ['power-core', 'energy-conduit', 'computing-core', 'cooling-matrix', 'shield-capacitor', 'armor-plating', 'self-repair'],
    buildCost: { metal: 100000, crystal: 80000, deuterium: 40000, energy: 10000 },
    buildTime: 2000, tierRequirement: 30, tierMax: 99, levelMax: 999,
    specialAbilities: ['dimensional-travel', 'gate-linking', 'interdimensional-exploration', 'reality-crossing'],
    synergies: ['sat-specialized-gravity-83', 'sat-specialized-reality-84', 'sat-recon-timeline-15'],
    icon: '🌀', color: '#800080', size: 'huge'
  },
  {
    id: 'sat-specialized-life-86',
    classNumber: 86,
    name: 'Life Support Relay Satellite',
    description: 'Life support satellite. Provides emergency life support, atmospheric processing, and medical assistance to orbital installations.',
    category: 'specialized',
    subClass: 'life-support',
    type: 'support',
    subType: 'guardian',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 150, shield: 40, armor: 20, speed: 20, maneuverability: 15,
      sensorRange: 80, powerOutput: 40, energyConsumption: 20,
      heatDissipation: 30, signalStrength: 35, orbitalStability: 88, durability: 80
    },
    subStats: {
      criticalHitChance: 2, evasionRating: 15, targetingAccuracy: 45,
      scanResolution: 25, dataThroughput: 25, jamResistance: 15,
      repairRate: 5, salvageEfficiency: 5, warpCooldown: 0,
      stealthRating: 8, radiationHardening: 45, emShielding: 35
    },
    offenseStats: {
      baseDamage: 3, rateOfFire: 1, damageType: 'laser', penetration: 0.02,
      splashRadius: 0, shieldDamageMultiplier: 0.05, armorDamageMultiplier: 0.03,
      criticalMultiplier: 1.1, accuracy: 35, range: 5, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 1
    },
    defenseStats: {
      shieldCapacity: 40, shieldRecharge: 3, shieldType: 'energy-barrier',
      armorHardness: 20, damageReduction: 0.06, regenerationRate: 0.8,
      resistanceMatrix: { kinetic: 0.1, explosive: 0.08 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0.02, reflectionChance: 0.01, adaptiveResistance: 0.01, emergencyRecharge: 2
    },
    upgradeSlots: 1, availableUpgrades: ['power-core', 'self-repair'],
    buildCost: { metal: 2000, crystal: 1500, deuterium: 500, energy: 100 },
    buildTime: 50, tierRequirement: 2, tierMax: 99, levelMax: 999,
    specialAbilities: ['life-support', 'atmospheric-processing', 'medical-assistance'],
    synergies: ['sat-resource-harvest-63', 'sat-comm-emergency-26'],
    icon: '❤️', color: '#FF69B4', size: 'tiny'
  },
  {
    id: 'sat-specialized-life-87',
    classNumber: 87,
    name: 'Colony Support Platform',
    description: 'Colony management satellite. Provides administrative support, resource coordination, and growth bonuses to planetary colonies.',
    category: 'specialized',
    subClass: 'life-support',
    type: 'command',
    subType: 'enhanced',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit'],
    deploymentZones: ['moon-equator', 'planet-equator', 'orbital-ring'],
    baseStats: {
      hull: 200, shield: 50, armor: 30, speed: 15, maneuverability: 10,
      sensorRange: 100, powerOutput: 80, energyConsumption: 40,
      heatDissipation: 45, signalStrength: 50, orbitalStability: 85, durability: 120
    },
    subStats: {
      criticalHitChance: 3, evasionRating: 10, targetingAccuracy: 50,
      scanResolution: 35, dataThroughput: 60, jamResistance: 25,
      repairRate: 4, salvageEfficiency: 8, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 45, emShielding: 35
    },
    offenseStats: {
      baseDamage: 5, rateOfFire: 1, damageType: 'kinetic', penetration: 0.03,
      splashRadius: 0, shieldDamageMultiplier: 0.08, armorDamageMultiplier: 0.04,
      criticalMultiplier: 1.2, accuracy: 40, range: 6, targetingSpeed: 2,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 100, powerPerShot: 2
    },
    defenseStats: {
      shieldCapacity: 50, shieldRecharge: 4, shieldType: 'energy-barrier',
      armorHardness: 30, damageReduction: 0.08, regenerationRate: 0.8,
      resistanceMatrix: { kinetic: 0.12, explosive: 0.1 },
      vulnerabilityMatrix: { emp: 0.3, ion: 0.2 },
      absorbtionRate: 0.02, reflectionChance: 0.01, adaptiveResistance: 0.01, emergencyRecharge: 3
    },
    upgradeSlots: 2, availableUpgrades: ['computing-core', 'power-core', 'energy-conduit'],
    buildCost: { metal: 4000, crystal: 3000, deuterium: 1000, energy: 200 },
    buildTime: 80, tierRequirement: 4, tierMax: 99, levelMax: 999,
    specialAbilities: ['colony-management', 'population-bonus', 'resource-coordination'],
    synergies: ['sat-resource-logistics-75', 'sat-comm-data-24'],
    icon: '🏛️', color: '#F0E68C', size: 'small'
  },
  {
    id: 'sat-specialized-warfare-88',
    classNumber: 88,
    name: 'Tactical Warfare Coordinator',
    description: 'Battle coordination satellite. Analyzes battlefield data and provides tactical bonuses to friendly forces in the sector.',
    category: 'specialized',
    subClass: 'repair-bay',
    type: 'command',
    subType: 'ultimate',
    orbitalLayers: ['high-orbit', 'geosync'],
    deploymentZones: ['planet-lagrange', 'orbital-ring'],
    baseStats: {
      hull: 400, shield: 120, armor: 80, speed: 10, maneuverability: 8,
      sensorRange: 400, powerOutput: 250, energyConsumption: 130,
      heatDissipation: 120, signalStrength: 80, orbitalStability: 80, durability: 250
    },
    subStats: {
      criticalHitChance: 10, evasionRating: 8, targetingAccuracy: 88,
      scanResolution: 70, dataThroughput: 150, jamResistance: 65,
      repairRate: 6, salvageEfficiency: 10, warpCooldown: 0,
      stealthRating: 5, radiationHardening: 60, emShielding: 60
    },
    offenseStats: {
      baseDamage: 20, rateOfFire: 2, damageType: 'phase', penetration: 0.2,
      splashRadius: 5, shieldDamageMultiplier: 0.3, armorDamageMultiplier: 0.2,
      criticalMultiplier: 2.0, accuracy: 72, range: 18, targetingSpeed: 6,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 55, powerPerShot: 8
    },
    defenseStats: {
      shieldCapacity: 120, shieldRecharge: 10, shieldType: 'adaptive',
      armorHardness: 80, damageReduction: 0.2, regenerationRate: 2,
      resistanceMatrix: { kinetic: 0.25, explosive: 0.2, laser: 0.2, ion: 0.15 },
      vulnerabilityMatrix: { graviton: 0.28, void: 0.22 },
      absorbtionRate: 0.06, reflectionChance: 0.04, adaptiveResistance: 0.06, emergencyRecharge: 10
    },
    upgradeSlots: 4, availableUpgrades: ['computing-core', 'targeting-system', 'power-core', 'energy-conduit', 'cooling-matrix', 'shield-capacitor'],
    buildCost: { metal: 25000, crystal: 20000, deuterium: 10000, energy: 2000 },
    buildTime: 500, tierRequirement: 14, tierMax: 99, levelMax: 999,
    specialAbilities: ['battle-coordination', 'tactical-analysis', 'fleet-bonus', 'targeting-assist'],
    synergies: ['sat-comm-nexus-18', 'sat-defense-fortress-38', 'sat-offense-beam-48'],
    icon: '⚔️', color: '#B22222', size: 'medium'
  },
  {
    id: 'sat-specialized-sensor-89',
    classNumber: 89,
    name: 'Quantum Sensor Array MK-V',
    description: 'Ultimate sensor platform. Combines all known sensor technologies into a single satellite for maximum detection capability.',
    category: 'specialized',
    subClass: 'warp-relay',
    type: 'elite',
    subType: 'mark-v',
    orbitalLayers: ['low-orbit', 'mid-orbit', 'high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['moon-equator', 'planet-equator', 'planet-lagrange', 'orbital-ring', 'interplanetary'],
    baseStats: {
      hull: 350, shield: 120, armor: 60, speed: 25, maneuverability: 20,
      sensorRange: 40000, powerOutput: 500, energyConsumption: 200,
      heatDissipation: 180, signalStrength: 100, orbitalStability: 75, durability: 250
    },
    subStats: {
      criticalHitChance: 12, evasionRating: 20, targetingAccuracy: 95,
      scanResolution: 100, dataThroughput: 500, jamResistance: 85,
      repairRate: 6, salvageEfficiency: 10, warpCooldown: 0,
      stealthRating: 15, radiationHardening: 80, emShielding: 85
    },
    offenseStats: {
      baseDamage: 25, rateOfFire: 3, damageType: 'phase', penetration: 0.3,
      splashRadius: 4, shieldDamageMultiplier: 0.35, armorDamageMultiplier: 0.25,
      criticalMultiplier: 2.2, accuracy: 88, range: 30, targetingSpeed: 8,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 45, powerPerShot: 12
    },
    defenseStats: {
      shieldCapacity: 120, shieldRecharge: 10, shieldType: 'adaptive',
      armorHardness: 60, damageReduction: 0.2, regenerationRate: 2.5,
      resistanceMatrix: { laser: 0.3, kinetic: 0.3, ion: 0.3, emp: 0.3, explosive: 0.25 },
      vulnerabilityMatrix: { graviton: 0.25, void: 0.2 },
      absorbtionRate: 0.08, reflectionChance: 0.05, adaptiveResistance: 0.08, emergencyRecharge: 12
    },
    upgradeSlots: 4, availableUpgrades: ['sensor-array', 'computing-core', 'power-core', 'cooling-matrix', 'energy-conduit', 'targeting-system'],
    buildCost: { metal: 30000, crystal: 25000, deuterium: 12000, energy: 2500 },
    buildTime: 600, tierRequirement: 16, tierMax: 99, levelMax: 999,
    specialAbilities: ['omni-scanning', 'ultra-detection', 'counter-stealth', 'real-time-tracking'],
    synergies: ['sat-recon-vision-13', 'sat-recon-quantum-5', 'sat-recon-deepspace-3'],
    icon: '📡', color: '#00FFFF', size: 'small'
  },
  {
    id: 'sat-specialized-command-90',
    classNumber: 90,
    name: 'Overlord Command Nexus MK-IX',
    description: 'THE ULTIMATE COMMAND SATELLITE. Coordinates all satellite networks across the entire empire, providing maximum bonuses and enabling special network-wide abilities.',
    category: 'specialized',
    subClass: 'dimensional-gate',
    type: 'command',
    subType: 'ultimate',
    orbitalLayers: ['high-orbit', 'geosync', 'deep-space'],
    deploymentZones: ['planet-lagrange', 'orbital-ring', 'interplanetary'],
    baseStats: {
      hull: 2000, shield: 500, armor: 300, speed: 5, maneuverability: 3,
      sensorRange: 5000, powerOutput: 1000, energyConsumption: 400,
      heatDissipation: 500, signalStrength: 100, orbitalStability: 88, durability: 1200
    },
    subStats: {
      criticalHitChance: 20, evasionRating: 2, targetingAccuracy: 96,
      scanResolution: 85, dataThroughput: 1000, jamResistance: 90,
      repairRate: 15, salvageEfficiency: 20, warpCooldown: 0,
      stealthRating: 2, radiationHardening: 90, emShielding: 92
    },
    offenseStats: {
      baseDamage: 50, rateOfFire: 4, damageType: 'phase', penetration: 0.4,
      splashRadius: 10, shieldDamageMultiplier: 0.5, armorDamageMultiplier: 0.35,
      criticalMultiplier: 3.0, accuracy: 88, range: 30, targetingSpeed: 9,
      ammoCapacity: 0, reloadTime: 0, overheatThreshold: 40, powerPerShot: 15
    },
    defenseStats: {
      shieldCapacity: 500, shieldRecharge: 30, shieldType: 'adaptive',
      armorHardness: 300, damageReduction: 0.3, regenerationRate: 5,
      resistanceMatrix: { laser: 0.4, kinetic: 0.4, explosive: 0.4, ion: 0.4, plasma: 0.35, emp: 0.35 },
      vulnerabilityMatrix: { graviton: 0.25, void: 0.2 },
      absorbtionRate: 0.12, reflectionChance: 0.08, adaptiveResistance: 0.15, emergencyRecharge: 30
    },
    upgradeSlots: 6, availableUpgrades: ['computing-core', 'targeting-system', 'power-core', 'energy-conduit', 'cooling-matrix', 'shield-capacitor', 'sensor-array', 'weapon-sync'],
    buildCost: { metal: 100000, crystal: 80000, deuterium: 40000, energy: 10000 },
    buildTime: 2000, tierRequirement: 25, tierMax: 99, levelMax: 999,
    specialAbilities: ['total-network-control', 'global-bonuses', 'satellite-override', 'network-wide-abilities', 'command-authority'],
    synergies: ['sat-comm-nexus-18', 'sat-defense-fortress-38', 'sat-offense-beam-48', 'sat-specialized-warfare-88'],
    icon: '👑', color: '#FFD700', size: 'huge'
  }
];

// =============================================================================
// SATELLITE NETWORK FUNCTIONS
// =============================================================================

/**
 * Get satellite by ID
 */
export function getSatelliteById(id: string): SatelliteClassConfig | undefined {
  return SATELLITE_CLASSES.find(s => s.id === id);
}

/**
 * Get satellites by category
 */
export function getSatellitesByCategory(category: SatelliteClass): SatelliteClassConfig[] {
  return SATELLITE_CLASSES.filter(s => s.category === category);
}

/**
 * Get satellites by sub class
 */
export function getSatellitesBySubClass(subClass: SatelliteSubClass): SatelliteClassConfig[] {
  return SATELLITE_CLASSES.filter(s => s.subClass === subClass);
}

/**
 * Get satellites by tier requirement range
 */
export function getSatellitesByTierRange(minTier: number, maxTier: number = 99): SatelliteClassConfig[] {
  return SATELLITE_CLASSES.filter(s => s.tierRequirement >= minTier && s.tierRequirement <= maxTier);
}

/**
 * Calculate scaled stats for a satellite at given level and tier
 */
export function calcSatelliteScaledStats(
  config: SatelliteClassConfig, 
  level: number, 
  tier: number
): { stats: SatelliteStats; subStats: SatelliteSubStats; offenseStats: OffenseStats; defenseStats: DefenseStats } {
  const multiplier = ProgressionSystem.getTotalMultiplier(level, tier);
  
  return {
    stats: {
      hull: Math.floor(config.baseStats.hull * multiplier),
      shield: Math.floor(config.baseStats.shield * multiplier),
      armor: Math.floor(config.baseStats.armor * multiplier),
      speed: Math.floor(config.baseStats.speed * (1 + (tier - 1) * 0.05)),
      maneuverability: Math.floor(config.baseStats.maneuverability * (1 + (level - 1) * 0.005)),
      sensorRange: Math.floor(config.baseStats.sensorRange * multiplier),
      powerOutput: Math.floor(config.baseStats.powerOutput * multiplier),
      energyConsumption: Math.floor(config.baseStats.energyConsumption * (1 + (level - 1) * 0.08)),
      heatDissipation: Math.floor(config.baseStats.heatDissipation * (1 + (tier - 1) * 0.1)),
      signalStrength: Math.floor(config.baseStats.signalStrength * (1 + (level - 1) * 0.01)),
      orbitalStability: Math.min(100, config.baseStats.orbitalStability + (tier - 1) * 0.5),
      durability: Math.floor(config.baseStats.durability * multiplier),
    },
    subStats: {
      criticalHitChance: config.subStats.criticalHitChance + tier,
      evasionRating: Math.min(100, config.subStats.evasionRating + level * 0.1),
      targetingAccuracy: Math.min(100, config.subStats.targetingAccuracy + level * 0.05),
      scanResolution: Math.min(100, config.subStats.scanResolution + tier * 0.5),
      dataThroughput: Math.floor(config.subStats.dataThroughput * multiplier),
      jamResistance: Math.min(100, config.subStats.jamResistance + tier * 1),
      repairRate: config.subStats.repairRate * (1 + (level - 1) * 0.02),
      salvageEfficiency: config.subStats.salvageEfficiency * (1 + (tier - 1) * 0.05),
      warpCooldown: config.subStats.warpCooldown,
      stealthRating: Math.min(100, config.subStats.stealthRating + tier * 0.3),
      radiationHardening: Math.min(100, config.subStats.radiationHardening + tier * 0.5),
      emShielding: Math.min(100, config.subStats.emShielding + tier * 0.5),
    },
    offenseStats: {
      baseDamage: Math.floor(config.offenseStats.baseDamage * multiplier),
      rateOfFire: config.offenseStats.rateOfFire,
      damageType: config.offenseStats.damageType,
      penetration: Math.min(1, config.offenseStats.penetration + tier * 0.01),
      splashRadius: config.offenseStats.splashRadius + tier,
      shieldDamageMultiplier: Math.min(2, config.offenseStats.shieldDamageMultiplier + tier * 0.01),
      armorDamageMultiplier: Math.min(2, config.offenseStats.armorDamageMultiplier + tier * 0.01),
      criticalMultiplier: config.offenseStats.criticalMultiplier + tier * 0.02,
      accuracy: Math.min(100, config.offenseStats.accuracy + level * 0.02),
      range: config.offenseStats.range + tier,
      targetingSpeed: config.offenseStats.targetingSpeed + Math.floor(tier * 0.1),
      ammoCapacity: Math.floor(config.offenseStats.ammoCapacity * multiplier),
      reloadTime: Math.max(1, config.offenseStats.reloadTime - Math.floor(tier * 0.3)),
      overheatThreshold: config.offenseStats.overheatThreshold + tier * 2,
      powerPerShot: Math.floor(config.offenseStats.powerPerShot * multiplier),
    },
    defenseStats: {
      shieldCapacity: Math.floor(config.defenseStats.shieldCapacity * multiplier),
      shieldRecharge: config.defenseStats.shieldRecharge + tier,
      shieldType: config.defenseStats.shieldType,
      armorHardness: Math.floor(config.defenseStats.armorHardness * multiplier),
      damageReduction: Math.min(0.95, config.defenseStats.damageReduction + tier * 0.005),
      regenerationRate: config.defenseStats.regenerationRate + tier * 0.5,
      resistanceMatrix: config.defenseStats.resistanceMatrix,
      vulnerabilityMatrix: config.defenseStats.vulnerabilityMatrix,
      absorbtionRate: Math.min(1, config.defenseStats.absorbtionRate + tier * 0.005),
      reflectionChance: Math.min(0.5, config.defenseStats.reflectionChance + tier * 0.002),
      adaptiveResistance: Math.min(1, config.defenseStats.adaptiveResistance + tier * 0.005),
      emergencyRecharge: config.defenseStats.emergencyRecharge + tier * 2,
    },
  };
}

/**
 * Calculate upgrade cost for a satellite upgrade path
 */
export function calcSatelliteUpgradeCost(
  currentLevel: number, 
  targetLevel: number, 
  upgradePath: UpgradePath
): { metal: number; crystal: number; deuterium: number; energy: number; time: number } {
  const levels = targetLevel - currentLevel;
  if (levels <= 0) return { metal: 0, crystal: 0, deuterium: 0, energy: 0, time: 0 };
  
  const baseCosts: Record<UpgradePath, { metal: number; crystal: number; deuterium: number; energy: number; time: number }> = {
    'power-core': { metal: 2000, crystal: 1500, deuterium: 500, energy: 100, time: 60 },
    'targeting-system': { metal: 1500, crystal: 2000, deuterium: 800, energy: 150, time: 45 },
    'cooling-matrix': { metal: 1000, crystal: 2500, deuterium: 1000, energy: 200, time: 50 },
    'armor-plating': { metal: 3000, crystal: 1000, deuterium: 300, energy: 80, time: 40 },
    'sensor-array': { metal: 2000, crystal: 3000, deuterium: 1500, energy: 120, time: 55 },
    'propulsion': { metal: 2500, crystal: 1000, deuterium: 2000, energy: 180, time: 35 },
    'stealth-coating': { metal: 1000, crystal: 4000, deuterium: 2000, energy: 250, time: 70 },
    'energy-conduit': { metal: 1500, crystal: 2000, deuterium: 1000, energy: 50, time: 40 },
    'computing-core': { metal: 2000, crystal: 3000, deuterium: 1500, energy: 200, time: 65 },
    'shield-capacitor': { metal: 2500, crystal: 3500, deuterium: 1200, energy: 300, time: 60 },
    'weapon-sync': { metal: 3000, crystal: 2500, deuterium: 2000, energy: 250, time: 50 },
    'self-repair': { metal: 2000, crystal: 3000, deuterium: 1500, energy: 180, time: 75 },
  };
  
  const base = baseCosts[upgradePath];
  const totalMultiplier = Math.pow(1.15, currentLevel) * levels;
  
  return {
    metal: Math.floor(base.metal * totalMultiplier),
    crystal: Math.floor(base.crystal * totalMultiplier),
    deuterium: Math.floor(base.deuterium * totalMultiplier),
    energy: Math.floor(base.energy * totalMultiplier),
    time: Math.floor(base.time * totalMultiplier),
  };
}

/**
 * Check if a deployment zone is valid for a given orbital layer
 */
export function isValidDeployment(zone: DeploymentZone, layer: OrbitalLayer): boolean {
  const validPairs: Record<DeploymentZone, OrbitalLayer[]> = {
    'moon-pole': ['low-orbit', 'mid-orbit'],
    'moon-equator': ['low-orbit', 'mid-orbit'],
    'moon-crater': ['low-orbit', 'mid-orbit'],
    'planet-pole': ['low-orbit', 'mid-orbit', 'high-orbit'],
    'planet-equator': ['low-orbit', 'mid-orbit', 'high-orbit'],
    'planet-lagrange': ['high-orbit', 'geosync'],
    'asteroid-belt': ['low-orbit', 'mid-orbit'],
    'interplanetary': ['geosync', 'deep-space'],
    'orbital-ring': ['low-orbit', 'mid-orbit', 'high-orbit'],
  };
  
  return validPairs[zone]?.includes(layer) ?? false;
}

/**
 * Get synergy bonus between two satellites
 */
export function getSynergyBonus(sat1Id: string, sat2Id: string): number {
  const sat1 = getSatelliteById(sat1Id);
  const sat2 = getSatelliteById(sat2Id);
  
  if (!sat1 || !sat2) return 0;
  
  if (sat1.synergies.includes(sat2Id) || sat2.synergies.includes(sat1Id)) {
    return 0.15; // 15% bonus for synergies
  }
  
  if (sat1.category === sat2.category) {
    return 0.05; // 5% bonus for same category
  }
  
  return 0;
}

export default SATELLITE_CLASSES;
