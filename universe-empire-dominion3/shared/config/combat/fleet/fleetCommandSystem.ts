/**
 * FLEET COMMAND & ORBITAL DEFENSE SYSTEM
 * ============================================================================
 * Fleet management, formations, and orbital defense grids.
 */

export type FleetFormation = 'line' | 'arrow' | 'sphere' | 'spread' | 'clamp' | 'wall' | 'delta' | 'vanguard';

export type MissionType = 'patrol' | 'attack' | 'defend' | 'escort' | 'scout' | 'bombard' | 'blockade' | 'intercept' | 'recon';

export type StanceType = 'aggressive' | 'defensive' | 'balanced' | 'retreat' | 'hold';

export interface FleetFormationConfig {
  id: FleetFormation;
  name: string;
  description: string;
  icon: string;
  bonuses: { stat: string; value: number; isPercent: boolean }[];
  requirements: { minShips: number; maxSize: ShipSize };
}

import type { ShipSize } from '../../ships/shipyard/shipyardSystem';

export const FLEET_FORMATIONS: FleetFormationConfig[] = [
  { id: 'line', name: 'Line Formation', description: 'Classic broadside formation.', icon: '━━━', bonuses: [{ stat: 'weaponDamage', value: 10, isPercent: true }], requirements: { minShips: 3, maxSize: 'battleship' } },
  { id: 'arrow', name: 'Arrow Formation', description: 'V-shaped assault formation.', icon: '→', bonuses: [{ stat: 'weaponDamage', value: 15, isPercent: true }, { stat: 'flightVelocity', value: 5, isPercent: true }], requirements: { minShips: 5, maxSize: 'cruiser' } },
  { id: 'sphere', name: 'Sphere Formation', description: 'Defensive all-around formation.', icon: '●', bonuses: [{ stat: 'damageReduction', value: 15, isPercent: true }, { stat: 'sensorStrength', value: 10, isPercent: true }], requirements: { minShips: 4, maxSize: 'battleship' } },
  { id: 'spread', name: 'Spread Formation', description: 'Wide formation for area control.', icon: '· · ·', bonuses: [{ stat: 'sensorStrength', value: 20, isPercent: true }, { stat: 'weaponRange', value: 10, isPercent: true }], requirements: { minShips: 6, maxSize: 'cruiser' } },
  { id: 'clamp', name: 'Clamp Formation', description: 'Surround and destroy.', icon: '⊗', bonuses: [{ stat: 'weaponDamage', value: 20, isPercent: true }, { stat: 'crowdControl', value: 15, isPercent: true }], requirements: { minShips: 8, maxSize: 'cruiser' } },
  { id: 'wall', name: 'Wall Formation', description: 'Maximum defense wall.', icon: '▓▓▓', bonuses: [{ stat: 'damageReduction', value: 25, isPercent: true }, { stat: 'hullHp', value: 10, isPercent: true }], requirements: { minShips: 5, maxSize: 'battleship' } },
  { id: 'delta', name: 'Delta Formation', description: 'Fast strike formation.', icon: 'Δ', bonuses: [{ stat: 'flightVelocity', value: 20, isPercent: true }, { stat: 'avoidance', value: 15, isPercent: true }], requirements: { minShips: 4, maxSize: 'cruiser' } },
  { id: 'vanguard', name: 'Vanguard Formation', description: 'Heavy ships lead, light ships flank.', icon: '▼', bonuses: [{ stat: 'weaponDamage', value: 12, isPercent: true }, { stat: 'armorValue', value: 15, isPercent: true }], requirements: { minShips: 6, maxSize: 'battleship' } },
];

// ============================================================================
// FLEET COMMAND
// ============================================================================

export interface FleetShipAssignment {
  shipId: string;
  slot: 'lead' | 'wing1' | 'wing2' | 'wing3' | 'reserve';
  status: 'active' | 'damaged' | 'repairing' | 'destroyed';
}

export interface FleetCommand {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: number;
  requiredLevel: number;
  effects: { stat: string; value: number; isPercent: boolean }[];
  auraRange: number;
  cooldown: number;
  duration: number;
}

export const FLEET_COMMANDS: FleetCommand[] = [
  { id: 'cmd_focus_fire', name: 'Focus Fire', description: 'All ships target one enemy.', icon: '🎯', tier: 1, requiredLevel: 1, effects: [{ stat: 'weaponDamage', value: 20, isPercent: true }], auraRange: 50, cooldown: 30, duration: 15 },
  { id: 'cmd_evasive', name: 'Evasive Maneuvers', description: 'Fleet dodges incoming fire.', icon: '💨', tier: 1, requiredLevel: 5, effects: [{ stat: 'avoidance', value: 25, isPercent: true }], auraRange: 50, cooldown: 45, duration: 20 },
  { id: 'cmd_repair', name: 'Emergency Repairs', description: 'Fleet repairs during combat.', icon: '🔧', tier: 2, requiredLevel: 15, effects: [{ stat: 'repairAmount', value: 30, isPercent: true }], auraRange: 40, cooldown: 60, duration: 25 },
  { id: 'cmd_overcharge', name: 'Overcharge', description: 'Boost all weapon systems.', icon: '⚡', tier: 2, requiredLevel: 20, effects: [{ stat: 'weaponDamage', value: 35, isPercent: true }, { stat: 'weaponSpeed', value: 15, isPercent: true }], auraRange: 50, cooldown: 90, duration: 15 },
  { id: 'cmd_shield_wall', name: 'Shield Wall', description: 'Fleet forms defensive shield.', icon: '🛡️', tier: 3, requiredLevel: 30, effects: [{ stat: 'damageReduction', value: 30, isPercent: true }, { stat: 'shieldHp', value: 25, isPercent: true }], auraRange: 50, cooldown: 120, duration: 30 },
  { id: 'cmd_blitz', name: 'Blitz Attack', description: 'Full speed assault.', icon: '🚀', tier: 3, requiredLevel: 35, effects: [{ stat: 'weaponDamage', value: 40, isPercent: true }, { stat: 'flightVelocity', value: 30, isPercent: true }], auraRange: 60, cooldown: 120, duration: 20 },
  { id: 'cmd_fortress', name: 'Fortress Mode', description: 'Maximum defense, reduced speed.', icon: '🏰', tier: 4, requiredLevel: 50, effects: [{ stat: 'damageReduction', value: 50, isPercent: true }, { stat: 'hullHp', value: 30, isPercent: true }, { stat: 'flightVelocity', value: -30, isPercent: true }], auraRange: 40, cooldown: 180, duration: 45 },
  { id: 'cmd_doomsday', name: 'Doomsday Protocol', description: 'Ultimate fleet assault.', icon: '💀', tier: 5, requiredLevel: 80, effects: [{ stat: 'weaponDamage', value: 60, isPercent: true }, { stat: 'weaponCritChance', value: 25, isPercent: true }], auraRange: 80, cooldown: 300, duration: 30 },
];

// ============================================================================
// FLEET STATE
// ============================================================================

export interface Fleet {
  id: string;
  name: string;
  description: string;
  icon: string;
  commanderId?: string;
  ships: FleetShipAssignment[];
  formation: FleetFormation;
  stance: StanceType;
  currentMission?: FleetMission;
  location: string;
  status: 'idle' | 'inTransit' | 'inCombat' | 'repairing';
  morale: number;
  experience: number;
  level: number;
}

export interface FleetMission {
  id: string;
  type: MissionType;
  targetId?: string;
  targetLocation?: string;
  startedAt: number;
  estimatedArrival: number;
  status: 'assigned' | 'inTransit' | 'arrived' | 'completed' | 'failed';
  reward?: { credits: number; experience: number; loot: string[] };
}

// ============================================================================
// ORBITAL DEFENSE
// ============================================================================

export type DefensePlatformType = 'missile_battlestation' | 'laser_grid' | 'shield_network' | 'mine_field' | 'fighter_bay' | 'sensor_array' | 'repair_station' | 'command_center';

export interface DefensePlatform {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: DefensePlatformType;
  tier: number;
  requiredLevel: number;
  hp: number;
  armor: number;
  shield: number;
  damage: number;
  range: number;
  fireRate: number;
  buildCost: { metal: number; crystal: number; deuterium: number; credits: number };
  buildTime: number;
  effects: { stat: string; value: number; isPercent: boolean }[];
  specialAbility?: string;
  specialDescription?: string;
}

export const DEFENSE_PLATFORMS: DefensePlatform[] = [
  { id: 'dp_missile_battlestation', name: 'Missile Battlestation', description: 'Heavy missile platform.', icon: '🚀', type: 'missile_battlestation', tier: 1, requiredLevel: 10, hp: 5000, armor: 3000, shield: 2000, damage: 200, range: 100, fireRate: 2, buildCost: { metal: 5000, crystal: 2000, deuterium: 1000, credits: 50000 }, buildTime: 120, effects: [{ stat: 'weaponDamage', value: 15, isPercent: true }] },
  { id: 'dp_laser_grid', name: 'Laser Defense Grid', description: 'Area denial laser network.', icon: '⚡', type: 'laser_grid', tier: 1, requiredLevel: 15, hp: 4000, armor: 2500, shield: 3000, damage: 150, range: 80, fireRate: 3, buildCost: { metal: 4000, crystal: 3000, deuterium: 800, credits: 45000 }, buildTime: 100, effects: [{ stat: 'weaponSpeed', value: 20, isPercent: true }] },
  { id: 'dp_shield_network', name: 'Shield Projection Network', description: 'Protects nearby structures.', icon: '🛡️', type: 'shield_network', tier: 2, requiredLevel: 25, hp: 3000, armor: 2000, shield: 5000, damage: 0, range: 150, fireRate: 0, buildCost: { metal: 6000, crystal: 4000, deuterium: 1500, credits: 60000 }, buildTime: 150, effects: [{ stat: 'shieldHp', value: 30, isPercent: true }, { stat: 'damageReduction', value: 15, isPercent: true }] },
  { id: 'dp_mine_field', name: 'Defensive Mine Field', description: 'Hidden explosive minefield.', icon: '💣', type: 'mine_field', tier: 1, requiredLevel: 10, hp: 1000, armor: 500, shield: 0, damage: 500, range: 30, fireRate: 0, buildCost: { metal: 2000, crystal: 1000, deuterium: 500, credits: 20000 }, buildTime: 60, effects: [{ stat: 'weaponDamage', value: 10, isPercent: true }], specialAbility: 'Proximity Detonation', specialDescription: 'Deals massive damage on contact' },
  { id: 'dp_fighter_bay', name: 'Orbital Fighter Bay', description: 'Launches fighter squadrons.', icon: '✈️', type: 'fighter_bay', tier: 2, requiredLevel: 30, hp: 6000, armor: 3500, shield: 2500, damage: 100, range: 120, fireRate: 1, buildCost: { metal: 8000, crystal: 5000, deuterium: 2000, credits: 80000 }, buildTime: 180, effects: [{ stat: 'summonPower', value: 25, isPercent: true }], specialAbility: 'Fighter Launch', specialDescription: 'Deploy 4 fighter squadrons' },
  { id: 'dp_sensor_array', name: 'Orbital Sensor Array', description: 'Long-range detection.', icon: '📡', type: 'sensor_array', tier: 1, requiredLevel: 5, hp: 2000, armor: 1000, shield: 1500, damage: 0, range: 200, fireRate: 0, buildCost: { metal: 3000, crystal: 2500, deuterium: 500, credits: 30000 }, buildTime: 80, effects: [{ stat: 'sensorStrength', value: 40, isPercent: true }, { stat: 'targetingRange', value: 30, isPercent: true }] },
  { id: 'dp_repair_station', name: 'Orbital Repair Station', description: 'Repairs nearby ships.', icon: '🔧', type: 'repair_station', tier: 2, requiredLevel: 20, hp: 4500, armor: 2500, shield: 3000, damage: 0, range: 100, fireRate: 0, buildCost: { metal: 5000, crystal: 3500, deuterium: 1200, credits: 55000 }, buildTime: 130, effects: [{ stat: 'repairAmount', value: 35, isPercent: true }], specialAbility: 'Emergency Dock', specialDescription: 'Instantly repair docked ship to 50%' },
  { id: 'dp_command_center', name: 'Orbital Command Center', description: 'Fleet command hub.', icon: '👑', type: 'command_center', tier: 3, requiredLevel: 40, hp: 8000, armor: 5000, shield: 4000, damage: 50, range: 200, fireRate: 0, buildCost: { metal: 12000, crystal: 8000, deuterium: 3000, credits: 120000 }, buildTime: 240, effects: [{ stat: 'crewEfficiency', value: 30, isPercent: true }, { stat: 'fleetCommandRange', value: 40, isPercent: true }], specialAbility: 'Fleet Rally', specialDescription: 'Recall all fleet ships to this station' },
];

export interface OrbitalDefenseGrid {
  id: string;
  planetId: string;
  platforms: { platformId: string; level: number; hp: number; status: 'active' | 'damaged' | 'destroyed' }[];
  totalDefenseScore: number;
  shieldCoverage: number;
  sensorRange: number;
  lastUpdated: number;
}

export function createOrbitalDefenseGrid(planetId: string): OrbitalDefenseGrid {
  return {
    id: `odg_${planetId}`,
    planetId,
    platforms: [],
    totalDefenseScore: 0,
    shieldCoverage: 0,
    sensorRange: 0,
    lastUpdated: Date.now(),
  };
}

export function addPlatformToGrid(grid: OrbitalDefenseGrid, platformId: string): OrbitalDefenseGrid {
  const platform = DEFENSE_PLATFORMS.find(p => p.id === platformId);
  if (!platform) return grid;

  const newPlatform = {
    platformId,
    level: 1,
    hp: platform.hp,
    status: 'active' as const,
  };

  const newGrid = { ...grid, platforms: [...grid.platforms, newPlatform] };
  newGrid.totalDefenseScore = calculateDefenseScore(newGrid);
  newGrid.shieldCoverage = calculateShieldCoverage(newGrid);
  newGrid.sensorRange = calculateSensorRange(newGrid);
  return newGrid;
}

export function upgradePlatform(grid: OrbitalDefenseGrid, platformIndex: number): OrbitalDefenseGrid {
  const platform = grid.platforms[platformIndex];
  if (!platform) return grid;

  const newPlatforms = [...grid.platforms];
  newPlatforms[platformIndex] = {
    ...platform,
    level: platform.level + 1,
    hp: platform.hp + 500,
  };

  const newGrid = { ...grid, platforms: newPlatforms };
  newGrid.totalDefenseScore = calculateDefenseScore(newGrid);
  return newGrid;
}

export function calculateDefenseScore(grid: OrbitalDefenseGrid): number {
  let score = 0;
  for (const p of grid.platforms) {
    if (p.status === 'destroyed') continue;
    const platform = DEFENSE_PLATFORMS.find(dp => dp.id === p.platformId);
    if (platform) {
      score += (platform.damage + platform.hp / 10) * p.level;
    }
  }
  return Math.round(score);
}

export function calculateShieldCoverage(grid: OrbitalDefenseGrid): number {
  for (const p of grid.platforms) {
    const platform = DEFENSE_PLATFORMS.find(dp => dp.id === p.platformId);
    if (platform?.type === 'shield_network' && p.status !== 'destroyed') {
      return 100;
    }
  }
  return 0;
}

export function calculateSensorRange(grid: OrbitalDefenseGrid): number {
  let maxRange = 0;
  for (const p of grid.platforms) {
    const platform = DEFENSE_PLATFORMS.find(dp => dp.id === p.platformId);
    if (platform?.type === 'sensor_array' && p.status !== 'destroyed') {
      maxRange = Math.max(maxRange, platform.range * p.level);
    }
  }
  return maxRange;
}
