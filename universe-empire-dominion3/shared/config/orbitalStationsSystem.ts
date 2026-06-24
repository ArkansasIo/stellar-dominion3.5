/**
 * ORBITAL STATIONS SYSTEM
 * ============================================================================
 * Construct and manage moon bases, space stations, satellites, and defense networks.
 * Progression from Tiers 1-99 and Levels 1-999.
 *
 * Components:
 *   1. Orbital Platforms – Build and upgrade stations with tier/level progression
 *   2. Satellite Network – Deploy satellites for empire-wide bonuses
 *   3. Defense Systems – Turrets, shields, mines, and point defense
 *   4. Offense Systems – Orbital bombardment, missile batteries, laser arrays
 *   5. Shield Systems – Station shielding with recharge and overload mechanics
 *   6. Resource Processing – Refinery and storage modules
 *   7. Research Labs – Orbital research facilities
 *   8. Shipyard Modules – Construct ships at orbital facilities
 */

// ============================================================================
// TYPES
// ============================================================================

export type OrbitalPlatformType =
  | 'moon_base'
  | 'space_station'
  | 'orbital_fortress'
  | 'shipyard_platform'
  | 'research_station'
  | 'mining_platform'
  | 'fuel_depot'
  | 'sensor_array'
  | 'communication_hub'
  | 'trade_post';

export type SatelliteType =
  | 'recon_satellite'
  | 'comms_satellite'
  | 'navigation_satellite'
  | 'mining_satellite'
  | 'defense_satellite'
  | 'science_satellite'
  | 'jamming_satellite'
  | 'energy_satellite'
  | 'weather_satellite'
  | 'quantum_relay';

export type DefenseSystemType =
  | 'laser_turret'
  | 'missile_battery'
  | 'railgun_platform'
  | 'point_defense'
  | 'mine_field'
  | 'energy_shield'
  | 'kinetic_barrier'
  | 'emp_disruptor'
  | 'tractor_beam'
  | 'fortress_shield';

export type OffenseSystemType =
  | 'orbital_bombardment'
  | 'mass_driver'
  | 'kinetic_impactor'
  | 'plasma_storm'
  | 'antimatter_cannon'
  | 'quantum_torpedo'
  | 'graviton_bomb'
  | 'void_cannon'
  | 'solar_flare_launcher'
  | 'nicol_durden_ray';

export type ShieldSystemType =
  | 'basic_shield'
  | 'reinforced_shield'
  | 'adaptive_shield'
  | 'void_shield'
  | 'quantum_shield'
  | 'overload_barrier'
  | 'regenerative_shield'
  | 'absorption_shield'
  | 'phase_shield'
  | 'fortress_barrier';

export type ModuleSlotType = 'weapon' | 'defense' | 'utility' | 'special';

// ============================================================================
// ORBITAL PLATFORMS
// ============================================================================

export interface OrbitalPlatformConfig {
  type: OrbitalPlatformType;
  name: string;
  description: string;
  icon: string;
  maxTier: number;
  maxLevel: number;
  baseCost: { metal: number; crystal: number; deuterium: number; credits: number };
  tierMultiplier: number;
  buildTimeBase: number; // seconds
  buildTimePerTier: number;
  moduleSlots: Record<ModuleSlotType, number>;
  baseEffects: { statType: string; value: number; isPercent: boolean }[];
  tierBonusPerLevel: { statType: string; value: number; isPercent: boolean }[];
  requiredPlayerLevel: number;
  prerequisites: string[];
}

export const ORBITAL_PLATFORMS: OrbitalPlatformConfig[] = [
  {
    type: 'moon_base', name: 'Moon Base', description: 'A basic lunar installation for resource extraction and habitation.',
    icon: '🌙', maxTier: 99, maxLevel: 999, baseCost: { metal: 5000, crystal: 2500, deuterium: 1000, credits: 10000 },
    tierMultiplier: 1.15, buildTimeBase: 3600, buildTimePerTier: 1800,
    moduleSlots: { weapon: 2, defense: 2, utility: 3, special: 1 },
    baseEffects: [{ statType: 'miningYield', value: 10, isPercent: true }, { statType: 'resourceBonus', value: 5, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'miningYield', value: 0.5, isPercent: true }],
    requiredPlayerLevel: 1, prerequisites: [],
  },
  {
    type: 'space_station', name: 'Space Station', description: 'A versatile orbital facility for multiple purposes.',
    icon: '🛸', maxTier: 99, maxLevel: 999, baseCost: { metal: 10000, crystal: 5000, deuterium: 2500, credits: 25000 },
    tierMultiplier: 1.2, buildTimeBase: 7200, buildTimePerTier: 3600,
    moduleSlots: { weapon: 3, defense: 3, utility: 4, special: 2 },
    baseEffects: [{ statType: 'crewEfficiency', value: 15, isPercent: true }, { statType: 'buildSpeedBonus', value: 10, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'crewEfficiency', value: 0.5, isPercent: true }],
    requiredPlayerLevel: 10, prerequisites: ['moon_base'],
  },
  {
    type: 'orbital_fortress', name: 'Orbital Fortress', description: 'A heavily armed and armored defensive station.',
    icon: '🏰', maxTier: 99, maxLevel: 999, baseCost: { metal: 25000, crystal: 12500, deuterium: 5000, credits: 50000 },
    tierMultiplier: 1.25, buildTimeBase: 14400, buildTimePerTier: 7200,
    moduleSlots: { weapon: 5, defense: 5, utility: 2, special: 3 },
    baseEffects: [{ statType: 'weaponDamage', value: 20, isPercent: true }, { statType: 'armorValue', value: 25, isPercent: true }, { statType: 'shieldHp', value: 20, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'weaponDamage', value: 0.5, isPercent: true }, { statType: 'armorValue', value: 0.5, isPercent: true }],
    requiredPlayerLevel: 50, prerequisites: ['space_station'],
  },
  {
    type: 'shipyard_platform', name: 'Shipyard Platform', description: 'Orbital facility for rapid ship construction.',
    icon: '🚀', maxTier: 99, maxLevel: 999, baseCost: { metal: 20000, crystal: 10000, deuterium: 5000, credits: 40000 },
    tierMultiplier: 1.2, buildTimeBase: 10800, buildTimePerTier: 5400,
    moduleSlots: { weapon: 1, defense: 2, utility: 5, special: 2 },
    baseEffects: [{ statType: 'buildSpeedBonus', value: 30, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'buildSpeedBonus', value: 1, isPercent: true }],
    requiredPlayerLevel: 30, prerequisites: ['space_station'],
  },
  {
    type: 'research_station', name: 'Research Station', description: 'Orbital laboratory for advanced research.',
    icon: '🔬', maxTier: 99, maxLevel: 999, baseCost: { metal: 15000, crystal: 7500, deuterium: 3000, credits: 30000 },
    tierMultiplier: 1.18, buildTimeBase: 9000, buildTimePerTier: 4500,
    moduleSlots: { weapon: 0, defense: 1, utility: 6, special: 3 },
    baseEffects: [{ statType: 'researchSpeed', value: 25, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'researchSpeed', value: 0.8, isPercent: true }],
    requiredPlayerLevel: 20, prerequisites: ['space_station'],
  },
  {
    type: 'mining_platform', name: 'Mining Platform', description: 'Specialized orbital mining facility.',
    icon: '⛏️', maxTier: 99, maxLevel: 999, baseCost: { metal: 8000, crystal: 4000, deuterium: 2000, credits: 15000 },
    tierMultiplier: 1.15, buildTimeBase: 5400, buildTimePerTier: 2700,
    moduleSlots: { weapon: 1, defense: 1, utility: 6, special: 2 },
    baseEffects: [{ statType: 'miningYield', value: 40, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'miningYield', value: 1.5, isPercent: true }],
    requiredPlayerLevel: 5, prerequisites: ['moon_base'],
  },
  {
    type: 'fuel_depot', name: 'Fuel Depot', description: 'Orbital fuel storage and distribution center.',
    icon: '⛽', maxTier: 99, maxLevel: 999, baseCost: { metal: 6000, crystal: 3000, deuterium: 4000, credits: 12000 },
    tierMultiplier: 1.12, buildTimeBase: 4200, buildTimePerTier: 2100,
    moduleSlots: { weapon: 0, defense: 2, utility: 5, special: 1 },
    baseEffects: [{ statType: 'cargoCapacity', value: 30, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'cargoCapacity', value: 1, isPercent: true }],
    requiredPlayerLevel: 8, prerequisites: ['moon_base'],
  },
  {
    type: 'sensor_array', name: 'Sensor Array', description: 'Long-range detection and surveillance facility.',
    icon: '📡', maxTier: 99, maxLevel: 999, baseCost: { metal: 7000, crystal: 6000, deuterium: 2000, credits: 14000 },
    tierMultiplier: 1.15, buildTimeBase: 4800, buildTimePerTier: 2400,
    moduleSlots: { weapon: 0, defense: 1, utility: 4, special: 4 },
    baseEffects: [{ statType: 'sensorStrength', value: 35, isPercent: true }, { statType: 'scanResolution', value: 25, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'sensorStrength', value: 1, isPercent: true }],
    requiredPlayerLevel: 15, prerequisites: ['space_station'],
  },
  {
    type: 'communication_hub', name: 'Communication Hub', description: 'Central relay for empire communications.',
    icon: '📻', maxTier: 99, maxLevel: 999, baseCost: { metal: 5000, crystal: 5000, deuterium: 1500, credits: 10000 },
    tierMultiplier: 1.12, buildTimeBase: 3600, buildTimePerTier: 1800,
    moduleSlots: { weapon: 0, defense: 1, utility: 5, special: 3 },
    baseEffects: [{ statType: 'electronicWarfare', value: 20, isPercent: true }, { statType: 'diplomacyBonus', value: 10, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'electronicWarfare', value: 0.5, isPercent: true }],
    requiredPlayerLevel: 12, prerequisites: ['space_station'],
  },
  {
    type: 'trade_post', name: 'Trade Post', description: 'Orbital marketplace for resource trading.',
    icon: '🏪', maxTier: 99, maxLevel: 999, baseCost: { metal: 8000, crystal: 4000, deuterium: 2000, credits: 20000 },
    tierMultiplier: 1.15, buildTimeBase: 5400, buildTimePerTier: 2700,
    moduleSlots: { weapon: 0, defense: 2, utility: 4, special: 2 },
    baseEffects: [{ statType: 'resourceBonus', value: 25, isPercent: true }],
    tierBonusPerLevel: [{ statType: 'resourceBonus', value: 0.8, isPercent: true }],
    requiredPlayerLevel: 18, prerequisites: ['space_station'],
  },
];

// ============================================================================
// SATELLITES
// ============================================================================

export interface SatelliteConfig {
  type: SatelliteType;
  name: string;
  description: string;
  icon: string;
  maxTier: number;
  cost: { metal: number; crystal: number; credits: number };
  deployTime: number;
  effects: { statType: string; value: number; isPercent: boolean }[];
  tierBonus: { statType: string; value: number; isPercent: boolean }[];
  maxPerSystem: number;
  requiredPlatform: OrbitalPlatformType | null;
}

export const SATELLITES: SatelliteConfig[] = [
  { type: 'recon_satellite', name: 'Recon Satellite', description: 'Provides long-range reconnaissance.', icon: '🛰️', maxTier: 50, cost: { metal: 500, crystal: 300, credits: 2000 }, deployTime: 300, effects: [{ statType: 'sensorStrength', value: 15, isPercent: true }], tierBonus: [{ statType: 'sensorStrength', value: 0.5, isPercent: true }], maxPerSystem: 5, requiredPlatform: 'sensor_array' },
  { type: 'comms_satellite', name: 'Comms Satellite', description: 'Enhances communication range.', icon: '📡', maxTier: 50, cost: { metal: 400, crystal: 400, credits: 1500 }, deployTime: 240, effects: [{ statType: 'electronicWarfare', value: 10, isPercent: true }, { statType: 'diplomacyBonus', value: 5, isPercent: true }], tierBonus: [{ statType: 'electronicWarfare', value: 0.3, isPercent: true }], maxPerSystem: 3, requiredPlatform: 'communication_hub' },
  { type: 'navigation_satellite', name: 'Navigation Satellite', description: 'Improves fleet navigation.', icon: '🧭', maxTier: 50, cost: { metal: 300, crystal: 200, credits: 1000 }, deployTime: 180, effects: [{ statType: 'warpSpeed', value: 10, isPercent: true }, { statType: 'flightVelocity', value: 8, isPercent: true }], tierBonus: [{ statType: 'warpSpeed', value: 0.3, isPercent: true }], maxPerSystem: 3, requiredPlatform: null },
  { type: 'mining_satellite', name: 'Mining Satellite', description: 'Automated mining drone.', icon: '⛏️', maxTier: 50, cost: { metal: 600, crystal: 200, credits: 2000 }, deployTime: 360, effects: [{ statType: 'miningYield', value: 20, isPercent: true }], tierBonus: [{ statType: 'miningYield', value: 0.8, isPercent: true }], maxPerSystem: 5, requiredPlatform: 'mining_platform' },
  { type: 'defense_satellite', name: 'Defense Satellite', description: 'Armed orbital defense.', icon: '🛡️', maxTier: 50, cost: { metal: 800, crystal: 400, credits: 3000 }, deployTime: 480, effects: [{ statType: 'weaponDamage', value: 10, isPercent: true }, { statType: 'armorValue', value: 8, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 0.4, isPercent: true }], maxPerSystem: 4, requiredPlatform: 'orbital_fortress' },
  { type: 'science_satellite', name: 'Science Satellite', description: 'Orbital research platform.', icon: '🔬', maxTier: 50, cost: { metal: 400, crystal: 500, credits: 2500 }, deployTime: 420, effects: [{ statType: 'researchSpeed', value: 15, isPercent: true }], tierBonus: [{ statType: 'researchSpeed', value: 0.5, isPercent: true }], maxPerSystem: 3, requiredPlatform: 'research_station' },
  { type: 'jamming_satellite', name: 'Jamming Satellite', description: 'Electronic warfare platform.', icon: '📻', maxTier: 50, cost: { metal: 500, crystal: 600, credits: 3000 }, deployTime: 360, effects: [{ statType: 'electronicWarfare', value: 20, isPercent: true }, { statType: 'sensorStrength', value: -10, isPercent: true }], tierBonus: [{ statType: 'electronicWarfare', value: 0.6, isPercent: true }], maxPerSystem: 2, requiredPlatform: 'communication_hub' },
  { type: 'energy_satellite', name: 'Energy Satellite', description: 'Power generation satellite.', icon: '⚡', maxTier: 50, cost: { metal: 600, crystal: 300, credits: 2000 }, deployTime: 300, effects: [{ statType: 'capacitorCapacity', value: 15, isPercent: true }, { statType: 'capacitorRecharge', value: 10, isPercent: true }], tierBonus: [{ statType: 'capacitorCapacity', value: 0.5, isPercent: true }], maxPerSystem: 3, requiredPlatform: null },
  { type: 'weather_satellite', name: 'Weather Satellite', description: 'Planetary weather monitoring.', icon: '🌪️', maxTier: 50, cost: { metal: 300, crystal: 300, credits: 1200 }, deployTime: 240, effects: [{ statType: 'scanResolution', value: 20, isPercent: true }], tierBonus: [{ statType: 'scanResolution', value: 0.6, isPercent: true }], maxPerSystem: 2, requiredPlatform: 'sensor_array' },
  { type: 'quantum_relay', name: 'Quantum Relay', description: 'Quantum-encrypted communication node.', icon: '⚛️', maxTier: 50, cost: { metal: 700, crystal: 700, credits: 4000 }, deployTime: 600, effects: [{ statType: 'warpStability', value: 20, isPercent: true }, { statType: 'electronicWarfare', value: 15, isPercent: true }], tierBonus: [{ statType: 'warpStability', value: 0.5, isPercent: true }], maxPerSystem: 2, requiredPlatform: 'communication_hub' },
];

// ============================================================================
// DEFENSE SYSTEMS
// ============================================================================

export interface DefenseSystemConfig {
  type: DefenseSystemType;
  name: string;
  description: string;
  icon: string;
  maxTier: number;
  cost: { metal: number; crystal: number; deuterium: number };
  buildTime: number;
  effects: { statType: string; value: number; isPercent: boolean }[];
  tierBonus: { statType: string; value: number; isPercent: boolean }[];
  slotType: ModuleSlotType;
}

export const DEFENSE_SYSTEMS: DefenseSystemConfig[] = [
  { type: 'laser_turret', name: 'Laser Turret', description: 'Rapid-fire laser defense.', icon: '🔫', maxTier: 99, cost: { metal: 200, crystal: 100, deuterium: 50 }, buildTime: 120, effects: [{ statType: 'weaponDamage', value: 8, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 0.3, isPercent: true }], slotType: 'weapon' },
  { type: 'missile_battery', name: 'Missile Battery', description: 'Long-range missile defense.', icon: '🚀', maxTier: 99, cost: { metal: 300, crystal: 150, deuterium: 75 }, buildTime: 180, effects: [{ statType: 'weaponDamage', value: 12, isPercent: true }, { statType: 'weaponRange', value: 10, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 0.4, isPercent: true }], slotType: 'weapon' },
  { type: 'railgun_platform', name: 'Railgun Platform', description: 'High-velocity kinetic defense.', icon: '⚡', maxTier: 99, cost: { metal: 400, crystal: 200, deuterium: 100 }, buildTime: 240, effects: [{ statType: 'weaponDamage', value: 18, isPercent: true }, { statType: 'weaponCritChance', value: 5, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 0.5, isPercent: true }], slotType: 'weapon' },
  { type: 'point_defense', name: 'Point Defense', description: 'Close-range anti-missile system.', icon: '🎯', maxTier: 99, cost: { metal: 150, crystal: 100, deuterium: 30 }, buildTime: 90, effects: [{ statType: 'weaponSpeed', value: 15, isPercent: true }, { statType: 'avoidance', value: 10, isPercent: true }], tierBonus: [{ statType: 'avoidance', value: 0.3, isPercent: true }], slotType: 'defense' },
  { type: 'mine_field', name: 'Mine Field', description: 'Area denial mines.', icon: '💣', maxTier: 99, cost: { metal: 250, crystal: 100, deuterium: 80 }, buildTime: 150, effects: [{ statType: 'weaponDamage', value: 25, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 0.8, isPercent: true }], slotType: 'defense' },
  { type: 'energy_shield', name: 'Energy Shield', description: 'Energy-based station shielding.', icon: '🛡️', maxTier: 99, cost: { metal: 200, crystal: 200, deuterium: 100 }, buildTime: 120, effects: [{ statType: 'shieldHp', value: 20, isPercent: true }, { statType: 'shieldRecharge', value: 10, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 0.5, isPercent: true }], slotType: 'defense' },
  { type: 'kinetic_barrier', name: 'Kinetic Barrier', description: 'Physical armor plating.', icon: '🛡️', maxTier: 99, cost: { metal: 300, crystal: 50, deuterium: 30 }, buildTime: 100, effects: [{ statType: 'armorValue', value: 25, isPercent: true }, { statType: 'hullHp', value: 15, isPercent: true }], tierBonus: [{ statType: 'armorValue', value: 0.6, isPercent: true }], slotType: 'defense' },
  { type: 'emp_disruptor', name: 'EMP Disruptor', description: 'Electromagnetic pulse weapon.', icon: '⚡', maxTier: 99, cost: { metal: 350, crystal: 300, deuterium: 120 }, buildTime: 200, effects: [{ statType: 'electronicWarfare', value: 20, isPercent: true }], tierBonus: [{ statType: 'electronicWarfare', value: 0.7, isPercent: true }], slotType: 'special' },
  { type: 'tractor_beam', name: 'Tractor Beam', description: 'Gravitational manipulation beam.', icon: '🌀', maxTier: 99, cost: { metal: 400, crystal: 250, deuterium: 100 }, buildTime: 180, effects: [{ statType: 'targetingSpeed', value: 20, isPercent: true }], tierBonus: [{ statType: 'targetingSpeed', value: 0.6, isPercent: true }], slotType: 'special' },
  { type: 'fortress_shield', name: 'Fortress Shield', description: 'Massive defensive barrier.', icon: '🏰', maxTier: 99, cost: { metal: 800, crystal: 600, deuterium: 300 }, buildTime: 600, effects: [{ statType: 'shieldHp', value: 50, isPercent: true }, { statType: 'hullHp', value: 30, isPercent: true }, { statType: 'armorValue', value: 20, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 1, isPercent: true }, { statType: 'hullHp', value: 0.5, isPercent: true }], slotType: 'special' },
];

// ============================================================================
// OFFENSE SYSTEMS
// ============================================================================

export interface OffenseSystemConfig {
  type: OffenseSystemType;
  name: string;
  description: string;
  icon: string;
  maxTier: number;
  cost: { metal: number; crystal: number; deuterium: number };
  buildTime: number;
  effects: { statType: string; value: number; isPercent: boolean }[];
  tierBonus: { statType: string; value: number; isPercent: boolean }[];
  slotType: ModuleSlotType;
  cooldown: number; // seconds between uses
}

export const OFFENSE_SYSTEMS: OffenseSystemConfig[] = [
  { type: 'orbital_bombardment', name: 'Orbital Bombardment', description: 'Rain destruction from orbit.', icon: '☄️', maxTier: 99, cost: { metal: 500, crystal: 300, deuterium: 200 }, buildTime: 300, effects: [{ statType: 'weaponDamage', value: 30, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 1, isPercent: true }], slotType: 'weapon', cooldown: 300 },
  { type: 'mass_driver', name: 'Mass Driver', description: 'Electromagnetic kinetic weapon.', icon: '⚡', maxTier: 99, cost: { metal: 400, crystal: 200, deuterium: 150 }, buildTime: 240, effects: [{ statType: 'weaponDamage', value: 25, isPercent: true }, { statType: 'weaponCritChance', value: 8, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 0.8, isPercent: true }], slotType: 'weapon', cooldown: 180 },
  { type: 'kinetic_impactor', name: 'Kinetic Impactor', description: 'High-speed projectile weapon.', icon: '💫', maxTier: 99, cost: { metal: 350, crystal: 150, deuterium: 100 }, buildTime: 200, effects: [{ statType: 'weaponDamage', value: 20, isPercent: true }, { statType: 'weaponSpeed', value: 15, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 0.6, isPercent: true }], slotType: 'weapon', cooldown: 120 },
  { type: 'plasma_storm', name: 'Plasma Storm', description: 'Area-of-effect plasma attack.', icon: '🌋', maxTier: 99, cost: { metal: 450, crystal: 350, deuterium: 200 }, buildTime: 360, effects: [{ statType: 'weaponDamage', value: 35, isPercent: true }, { statType: 'energyWeapons', value: 20, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 1.2, isPercent: true }], slotType: 'weapon', cooldown: 240 },
  { type: 'antimatter_cannon', name: 'Antimatter Cannon', description: 'Devastating antimatter beam.', icon: '💥', maxTier: 99, cost: { metal: 600, crystal: 500, deuterium: 300 }, buildTime: 480, effects: [{ statType: 'weaponDamage', value: 50, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 1.5, isPercent: true }], slotType: 'weapon', cooldown: 360 },
  { type: 'quantum_torpedo', name: 'Quantum Torpedo', description: 'Quantum-state warhead.', icon: '🔮', maxTier: 99, cost: { metal: 700, crystal: 600, deuterium: 400 }, buildTime: 600, effects: [{ statType: 'weaponDamage', value: 60, isPercent: true }, { statType: 'weaponCritDamage', value: 25, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 2, isPercent: true }], slotType: 'weapon', cooldown: 480 },
  { type: 'graviton_bomb', name: 'Graviton Bomb', description: 'Gravitational singularity weapon.', icon: '🕳️', maxTier: 99, cost: { metal: 800, crystal: 700, deuterium: 500 }, buildTime: 720, effects: [{ statType: 'weaponDamage', value: 75, isPercent: true }, { statType: 'crowdControl', value: 30, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 2.5, isPercent: true }], slotType: 'weapon', cooldown: 600 },
  { type: 'void_cannon', name: 'Void Cannon', description: 'Opens micro-rifts in reality.', icon: '🌑', maxTier: 99, cost: { metal: 900, crystal: 800, deuterium: 600 }, buildTime: 900, effects: [{ statType: 'weaponDamage', value: 90, isPercent: true }, { statType: 'explosiveWeapons', value: 30, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 3, isPercent: true }], slotType: 'weapon', cooldown: 720 },
  { type: 'solar_flare_launcher', name: 'Solar Flare Launcher', description: 'Channels stellar energy.', icon: '☀️', maxTier: 99, cost: { metal: 500, crystal: 400, deuterium: 250 }, buildTime: 420, effects: [{ statType: 'weaponDamage', value: 40, isPercent: true }, { statType: 'beamWeapons', value: 25, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 1.3, isPercent: true }], slotType: 'weapon', cooldown: 300 },
  { type: 'nicol_durden_ray', name: 'Nicol-Durden Ray', description: 'Reality-warping energy beam.', icon: '🌈', maxTier: 99, cost: { metal: 1000, crystal: 900, deuterium: 700 }, buildTime: 1200, effects: [{ statType: 'weaponDamage', value: 100, isPercent: true }, { statType: 'weaponCritChance', value: 15, isPercent: true }, { statType: 'weaponCritDamage', value: 40, isPercent: true }], tierBonus: [{ statType: 'weaponDamage', value: 3.5, isPercent: true }], slotType: 'weapon', cooldown: 900 },
];

// ============================================================================
// SHIELD SYSTEMS
// ============================================================================

export interface ShieldSystemConfig {
  type: ShieldSystemType;
  name: string;
  description: string;
  icon: string;
  maxTier: number;
  cost: { metal: number; crystal: number; deuterium: number };
  buildTime: number;
  effects: { statType: string; value: number; isPercent: boolean }[];
  tierBonus: { statType: string; value: number; isPercent: boolean }[];
  slotType: ModuleSlotType;
}

export const SHIELD_SYSTEMS: ShieldSystemConfig[] = [
  { type: 'basic_shield', name: 'Basic Shield', description: 'Standard energy shielding.', icon: '🛡️', maxTier: 99, cost: { metal: 100, crystal: 100, deuterium: 50 }, buildTime: 60, effects: [{ statType: 'shieldHp', value: 10, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 0.3, isPercent: true }], slotType: 'defense' },
  { type: 'reinforced_shield', name: 'Reinforced Shield', description: 'Enhanced shielding with armor integration.', icon: '🛡️', maxTier: 99, cost: { metal: 200, crystal: 150, deuterium: 75 }, buildTime: 120, effects: [{ statType: 'shieldHp', value: 20, isPercent: true }, { statType: 'armorValue', value: 10, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 0.5, isPercent: true }], slotType: 'defense' },
  { type: 'adaptive_shield', name: 'Adaptive Shield', description: 'Adjusts to incoming damage type.', icon: '🛡️', maxTier: 99, cost: { metal: 300, crystal: 250, deuterium: 120 }, buildTime: 180, effects: [{ statType: 'shieldHp', value: 25, isPercent: true }, { statType: 'shieldRecharge', value: 15, isPercent: true }, { statType: 'damageReduction', value: 5, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 0.7, isPercent: true }], slotType: 'defense' },
  { type: 'void_shield', name: 'Void Shield', description: 'Channels void energy for protection.', icon: '🌑', maxTier: 99, cost: { metal: 500, crystal: 400, deuterium: 200 }, buildTime: 300, effects: [{ statType: 'shieldHp', value: 40, isPercent: true }, { statType: 'shieldRecharge', value: 20, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 1, isPercent: true }], slotType: 'defense' },
  { type: 'quantum_shield', name: 'Quantum Shield', description: 'Quantum-state probability shielding.', icon: '⚛️', maxTier: 99, cost: { metal: 600, crystal: 500, deuterium: 250 }, buildTime: 360, effects: [{ statType: 'shieldHp', value: 50, isPercent: true }, { statType: 'avoidance', value: 15, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 1.2, isPercent: true }], slotType: 'defense' },
  { type: 'overload_barrier', name: 'Overload Barrier', description: 'Emergency high-power shield burst.', icon: '⚡', maxTier: 99, cost: { metal: 400, crystal: 350, deuterium: 200 }, buildTime: 240, effects: [{ statType: 'shieldHp', value: 80, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 2, isPercent: true }], slotType: 'special' },
  { type: 'regenerative_shield', name: 'Regenerative Shield', description: 'Self-repairing shield matrix.', icon: '🔄', maxTier: 99, cost: { metal: 350, crystal: 300, deuterium: 150 }, buildTime: 200, effects: [{ statType: 'shieldHp', value: 30, isPercent: true }, { statType: 'shieldRecharge', value: 25, isPercent: true }, { statType: 'healthRegen', value: 10, isPercent: true }], tierBonus: [{ statType: 'shieldRecharge', value: 0.5, isPercent: true }], slotType: 'defense' },
  { type: 'absorption_shield', name: 'Absorption Shield', description: 'Converts damage to energy.', icon: '🔋', maxTier: 99, cost: { metal: 400, crystal: 400, deuterium: 200 }, buildTime: 280, effects: [{ statType: 'shieldHp', value: 35, isPercent: true }, { statType: 'capacitorCapacity', value: 20, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 0.8, isPercent: true }], slotType: 'defense' },
  { type: 'phase_shield', name: 'Phase Shield', description: 'Phases between dimensions to avoid damage.', icon: '🌀', maxTier: 99, cost: { metal: 500, crystal: 500, deuterium: 300 }, buildTime: 400, effects: [{ statType: 'shieldHp', value: 45, isPercent: true }, { statType: 'avoidance', value: 25, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 1, isPercent: true }, { statType: 'avoidance', value: 0.3, isPercent: true }], slotType: 'defense' },
  { type: 'fortress_barrier', name: 'Fortress Barrier', description: 'Ultimate defensive shield.', icon: '🏰', maxTier: 99, cost: { metal: 1000, crystal: 800, deuterium: 500 }, buildTime: 900, effects: [{ statType: 'shieldHp', value: 100, isPercent: true }, { statType: 'armorValue', value: 50, isPercent: true }, { statType: 'hullHp', value: 50, isPercent: true }, { statType: 'damageReduction', value: 20, isPercent: true }], tierBonus: [{ statType: 'shieldHp', value: 2, isPercent: true }, { statType: 'armorValue', value: 1, isPercent: true }], slotType: 'special' },
];

// ============================================================================
// ORBITAL STATION STATE
// ============================================================================

export interface OrbitalStationModule {
  type: string;
  tier: number;
  level: number;
  installedAt: number;
}

export interface OrbitalStation {
  id: string;
  name: string;
  platformType: OrbitalPlatformType;
  tier: number;
  level: number;
  experience: number;
  x: number;
  y: number;
  planetId: string | null;
  modules: OrbitalStationModule[];
  satellites: { type: SatelliteType; tier: number; deployedAt: number }[];
  shields: { type: ShieldSystemType; tier: number; level: number; currentHp: number; maxHp: number }[];
  defenses: { type: DefenseSystemType; tier: number; level: number }[];
  offenses: { type: OffenseSystemType; tier: number; level: number; cooldownEnd: number }[];
  resourceStorage: { metal: number; crystal: number; deuterium: number; credits: number };
  maxStorage: { metal: number; crystal: number; deuterium: number; credits: number };
  productionRate: { metal: number; crystal: number; deuterium: number };
  isOnline: boolean;
  createdAt: number;
  lastTick: number;
  stats: {
    totalDamageDealt: number;
    totalDamageReceived: number;
    totalShipsBuilt: number;
    totalResourcesMined: number;
    totalResearchCompleted: number;
    defenseScore: number;
    offenseScore: number;
    utilityScore: number;
  };
}

export interface InfrastructureDeployment {
  id: string;
  stationId: string;
  name: string;
  category: string;
  subCategory: string;
  tier: number;
  level: number;
  class: string;
  count: number;
  deployedAt: number;
  isOnline: boolean;
}

export interface OrbitalStationsState {
  stations: OrbitalStation[];
  infrastructure: InfrastructureDeployment[];
  maxStations: number;
  totalStationLevels: number;
  globalBonuses: { statType: string; value: number; isPercent: boolean }[];
  satellitesDeployed: number;
  totalDefenseScore: number;
  totalOffenseScore: number;
}

// ============================================================================
// DEFAULT STATE
// ============================================================================

export function getDefaultOrbitalStationsState(): OrbitalStationsState {
  return {
    stations: [],
    infrastructure: [],
    maxStations: 3,
    totalStationLevels: 0,
    globalBonuses: [],
    satellitesDeployed: 0,
    totalDefenseScore: 0,
    totalOffenseScore: 0,
  };
}

// ============================================================================
// GAME LOGIC
// ============================================================================

/**
 * Calculate upgrade cost for a station tier/level.
 */
export function calculateStationUpgradeCost(
  platformType: OrbitalPlatformType,
  currentTier: number,
  currentLevel: number
): { metal: number; crystal: number; deuterium: number; credits: number } {
  const config = ORBITAL_PLATFORMS.find(p => p.type === platformType);
  if (!config) return { metal: 0, crystal: 0, deuterium: 0, credits: 0 };
  const tierMult = Math.pow(config.tierMultiplier, currentTier);
  const levelMult = 1 + currentLevel * 0.05;
  const totalMult = tierMult * levelMult;
  return {
    metal: Math.floor(config.baseCost.metal * totalMult),
    crystal: Math.floor(config.baseCost.crystal * totalMult),
    deuterium: Math.floor(config.baseCost.deuterium * totalMult),
    credits: Math.floor(config.baseCost.credits * totalMult),
  };
}

/**
 * Calculate build time for a station upgrade.
 */
export function calculateStationBuildTime(
  platformType: OrbitalPlatformType,
  targetTier: number
): number {
  const config = ORBITAL_PLATFORMS.find(p => p.type === platformType);
  if (!config) return 0;
  return config.buildTimeBase + config.buildTimePerTier * targetTier;
}

/**
 * Calculate total defense score for a station.
 */
export function calculateStationDefenseScore(station: OrbitalStation): number {
  let score = 0;
  // Shield HP contribution
  for (const shield of station.shields) {
    const config = SHIELD_SYSTEMS.find(s => s.type === shield.type);
    if (config) {
      for (const eff of config.effects) {
        if (eff.statType === 'shieldHp') score += eff.value * shield.tier;
      }
    }
  }
  // Defense module contribution
  for (const def of station.defenses) {
    const config = DEFENSE_SYSTEMS.find(d => d.type === def.type);
    if (config) {
      for (const eff of config.effects) {
        score += eff.value * def.tier;
      }
    }
  }
  return Math.floor(score);
}

/**
 * Calculate total offense score for a station.
 */
export function calculateStationOffenseScore(station: OrbitalStation): number {
  let score = 0;
  for (const off of station.offenses) {
    const config = OFFENSE_SYSTEMS.find(o => o.type === off.type);
    if (config) {
      for (const eff of config.effects) {
        score += eff.value * off.tier;
      }
    }
  }
  // Weapon defense modules
  for (const def of station.defenses) {
    const config = DEFENSE_SYSTEMS.find(d => d.type === def.type);
    if (config && config.slotType === 'weapon') {
      for (const eff of config.effects) {
        score += eff.value * def.tier;
      }
    }
  }
  return Math.floor(score);
}

/**
 * Calculate station production per tick.
 */
export function calculateStationProduction(station: OrbitalStation): { metal: number; crystal: number; deuterium: number } {
  const config = ORBITAL_PLATFORMS.find(p => p.type === station.platformType);
  if (!config) return { metal: 0, crystal: 0, deuterium: 0 };
  const baseMult = 1 + station.tier * 0.1 + station.level * 0.02;
  let miningBonus = 1;
  for (const sat of station.satellites) {
    if (sat.type === 'mining_satellite') {
      const satConfig = SATELLITES.find(s => s.type === sat.type);
      if (satConfig) {
        for (const eff of satConfig.effects) {
          if (eff.statType === 'miningYield') miningBonus += eff.value / 100 * sat.tier;
        }
      }
    }
  }
  return {
    metal: Math.floor(100 * baseMult * miningBonus),
    crystal: Math.floor(50 * baseMult * miningBonus),
    deuterium: Math.floor(25 * baseMult * miningBonus),
  };
}

/**
 * Process shield damage.
 */
export function processShieldDamage(
  shield: OrbitalStation['shields'][0],
  incomingDamage: number
): { shield: OrbitalStation['shields'][0]; overflowDamage: number } {
  const remaining = shield.currentHp - incomingDamage;
  if (remaining >= 0) {
    return { shield: { ...shield, currentHp: remaining }, overflowDamage: 0 };
  }
  return { shield: { ...shield, currentHp: 0 }, overflowDamage: Math.abs(remaining) };
}

/**
 * Process shield recharge.
 */
export function processShieldRecharge(
  shield: OrbitalStation['shields'][0],
  rechargeRate: number
): OrbitalStation['shields'][0] {
  const newHp = Math.min(shield.maxHp, shield.currentHp + rechargeRate);
  return { ...shield, currentHp: newHp };
}

/**
 * Calculate global bonuses from all stations.
 */
export function calculateGlobalOrbitalBonuses(stations: OrbitalStation[]): { statType: string; value: number; isPercent: boolean }[] {
  const bonuses: Record<string, { value: number; isPercent: boolean }> = {};
  for (const station of stations) {
    if (!station.isOnline) continue;
    const config = ORBITAL_PLATFORMS.find(p => p.type === station.platformType);
    if (config) {
      for (const eff of config.baseEffects) {
        const key = eff.statType;
        if (!bonuses[key]) bonuses[key] = { value: 0, isPercent: eff.isPercent };
        bonuses[key].value += eff.value * (1 + station.tier * 0.05);
      }
      for (const eff of config.tierBonusPerLevel) {
        const key = eff.statType;
        if (!bonuses[key]) bonuses[key] = { value: 0, isPercent: eff.isPercent };
        bonuses[key].value += eff.value * station.level;
      }
    }
    // Satellite bonuses
    for (const sat of station.satellites) {
      const satConfig = SATELLITES.find(s => s.type === sat.type);
      if (satConfig) {
        for (const eff of satConfig.effects) {
          const key = eff.statType;
          if (!bonuses[key]) bonuses[key] = { value: 0, isPercent: eff.isPercent };
          bonuses[key].value += eff.value * sat.tier;
        }
      }
    }
  }
  return Object.entries(bonuses).map(([statType, { value, isPercent }]) => ({ statType, value: Math.round(value * 100) / 100, isPercent }));
}

/**
 * Process station tick (production, shield recharge, cooldowns).
 */
export function processStationTick(station: OrbitalStation): OrbitalStation {
  const now = Date.now();
  const tickDelta = (now - station.lastTick) / 1000;
  // Production
  const production = calculateStationProduction(station);
  const newStorage = {
    metal: Math.min(station.maxStorage.metal, station.resourceStorage.metal + production.metal * tickDelta / 60),
    crystal: Math.min(station.maxStorage.crystal, station.resourceStorage.crystal + production.crystal * tickDelta / 60),
    deuterium: Math.min(station.maxStorage.deuterium, station.resourceStorage.deuterium + production.deuterium * tickDelta / 60),
    credits: station.resourceStorage.credits,
  };
  // Shield recharge
  const newShields = station.shields.map(shield => {
    const config = SHIELD_SYSTEMS.find(s => s.type === shield.type);
    if (!config) return shield;
    const rechargeBonus = config.effects.find(e => e.statType === 'shieldRecharge');
    const rechargeRate = rechargeBonus ? (rechargeBonus.value / 100) * shield.maxHp * tickDelta / 60 : 0;
    return processShieldRecharge(shield, rechargeRate);
  });
  // Cooldowns
  const newOffenses = station.offenses.map(off => ({
    ...off,
    cooldownEnd: Math.max(0, off.cooldownEnd - tickDelta * 1000),
  }));
  return { ...station, resourceStorage: newStorage, shields: newShields, offenses: newOffenses, lastTick: now };
}