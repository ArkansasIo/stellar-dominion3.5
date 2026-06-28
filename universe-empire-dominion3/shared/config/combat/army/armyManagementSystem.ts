/**
 * ARMY MANAGEMENT & TRAINING CENTER SYSTEM
 * ============================================================================
 * Ground combat, army units, training, and planetary invasion.
 */

export type UnitType = 'infantry' | 'mech' | 'armor' | 'artillery' | 'air' | 'special' | 'siege' | 'recon';

export type UnitRole = 'assault' | 'defense' | 'support' | 'recon' | 'siege' | 'command';

export interface UnitDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: UnitType;
  role: UnitRole;
  tier: number;
  requiredLevel: number;
  requiredResearch: string[];
  stats: {
    attack: number;
    defense: number;
    hp: number;
    speed: number;
    range: number;
    accuracy: number;
    evasion: number;
    morale: number;
  };
  abilities: string[];
  buildCost: { metal: number; crystal: number; deuterium: number; credits: number };
  trainTime: number;
  upkeepCost: { credits: number; food: number };
  maxCount: number;
  weaknesses: string[];
  strengths: string[];
}

export const ARMY_UNITS: UnitDefinition[] = [
  // ── INFANTRY ──
  { id: 'unit_militia', name: 'Militia', description: 'Basic ground troops.', icon: '🔫', type: 'infantry', role: 'assault', tier: 1, requiredLevel: 1, requiredResearch: [],
    stats: { attack: 10, defense: 5, hp: 50, speed: 3, range: 1, accuracy: 60, evasion: 20, morale: 50 },
    abilities: ['rally'], buildCost: { metal: 10, crystal: 5, deuterium: 2, credits: 100 }, trainTime: 5, upkeepCost: { credits: 2, food: 1 }, maxCount: 1000, weaknesses: ['mech', 'armor'], strengths: ['infantry'] },
  { id: 'unit_marines', name: 'Marines', description: 'Trained ground soldiers.', icon: '🎖️', type: 'infantry', role: 'assault', tier: 2, requiredLevel: 10, requiredResearch: ['tech_marine_training'],
    stats: { attack: 20, defense: 12, hp: 80, speed: 4, range: 2, accuracy: 70, evasion: 25, morale: 60 },
    abilities: ['rally', 'fortify'], buildCost: { metal: 25, crystal: 10, deuterium: 5, credits: 250 }, trainTime: 10, upkeepCost: { credits: 5, food: 2 }, maxCount: 500, weaknesses: ['artillery', 'siege'], strengths: ['infantry', 'recon'] },
  { id: 'unit_shock_troopers', name: 'Shock Troopers', description: 'Elite assault troops.', icon: '⚡', type: 'infantry', role: 'assault', tier: 3, requiredLevel: 25, requiredResearch: ['tech_shock_assault'],
    stats: { attack: 35, defense: 18, hp: 100, speed: 5, range: 2, accuracy: 75, evasion: 30, morale: 70 },
    abilities: ['rally', 'fortify', 'assault_wave'], buildCost: { metal: 50, crystal: 25, deuterium: 10, credits: 500 }, trainTime: 20, upkeepCost: { credits: 10, food: 4 }, maxCount: 200, weaknesses: ['siege'], strengths: ['infantry', 'mech', 'armor'] },
  { id: 'unit_spec_ops', name: 'Special Operations', description: 'Covert ground team.', icon: '🕵️', type: 'infantry', role: 'recon', tier: 3, requiredLevel: 30, requiredResearch: ['tech_special_forces'],
    stats: { attack: 30, defense: 15, hp: 70, speed: 6, range: 3, accuracy: 85, evasion: 45, morale: 75 },
    abilities: ['stealth', 'sabotage'], buildCost: { metal: 40, crystal: 30, deuterium: 15, credits: 600 }, trainTime: 25, upkeepCost: { credits: 15, food: 3 }, maxCount: 100, weaknesses: ['siege'], strengths: ['recon', 'infantry'] },

  // ── MECH ──
  { id: 'unit_light_mech', name: 'Light Mech', description: 'Small bipedal combat unit.', icon: '🤖', type: 'mech', role: 'assault', tier: 2, requiredLevel: 15, requiredResearch: ['tech_mech_design'],
    stats: { attack: 25, defense: 20, hp: 120, speed: 5, range: 3, accuracy: 65, evasion: 15, morale: 55 },
    abilities: ['mech_charge'], buildCost: { metal: 60, crystal: 40, deuterium: 15, credits: 600 }, trainTime: 15, upkeepCost: { credits: 8, food: 3 }, maxCount: 200, weaknesses: ['armor'], strengths: ['infantry', 'recon'] },
  { id: 'unit_heavy_mech', name: 'Heavy Mech', description: 'Heavy combat walker.', icon: '🦾', type: 'mech', role: 'assault', tier: 3, requiredLevel: 30, requiredResearch: ['tech_heavy_mech'],
    stats: { attack: 45, defense: 35, hp: 200, speed: 3, range: 4, accuracy: 70, evasion: 10, morale: 65 },
    abilities: ['mech_charge', 'area_denial'], buildCost: { metal: 120, crystal: 80, deuterium: 30, credits: 1200 }, trainTime: 30, upkeepCost: { credits: 15, food: 5 }, maxCount: 100, weaknesses: ['artillery'], strengths: ['infantry', 'mech', 'armor'] },
  { id: 'unit_assault_mech', name: 'Assault Mech', description: 'Anti-armor specialist.', icon: '⚔️', type: 'mech', role: 'assault', tier: 4, requiredLevel: 45, requiredResearch: ['tech_assault_mech'],
    stats: { attack: 60, defense: 30, hp: 180, speed: 4, range: 5, accuracy: 75, evasion: 12, morale: 70 },
    abilities: ['mech_charge', 'armor_piercing'], buildCost: { metal: 150, crystal: 100, deuterium: 40, credits: 1500 }, trainTime: 40, upkeepCost: { credits: 20, food: 6 }, maxCount: 50, weaknesses: ['artillery', 'siege'], strengths: ['armor', 'mech'] },

  // ── ARMOR ──
  { id: 'unit_light_tank', name: 'Light Tank', description: 'Fast armored vehicle.', icon: '🔫', type: 'armor', role: 'assault', tier: 1, requiredLevel: 5, requiredResearch: [],
    stats: { attack: 15, defense: 25, hp: 150, speed: 6, range: 3, accuracy: 55, evasion: 10, morale: 50 },
    abilities: ['armor_charge'], buildCost: { metal: 80, crystal: 30, deuterium: 20, credits: 800 }, trainTime: 12, upkeepCost: { credits: 8, food: 4 }, maxCount: 200, weaknesses: ['mech', 'artillery'], strengths: ['infantry', 'recon'] },
  { id: 'unit_main_battle_tank', name: 'Main Battle Tank', description: 'Standard combat tank.', icon: '🛡️', type: 'armor', role: 'assault', tier: 2, requiredLevel: 20, requiredResearch: ['tech_mbt_design'],
    stats: { attack: 30, defense: 40, hp: 250, speed: 4, range: 4, accuracy: 65, evasion: 8, morale: 60 },
    abilities: ['armor_charge', 'fortify'], buildCost: { metal: 150, crystal: 60, deuterium: 30, credits: 1500 }, trainTime: 25, upkeepCost: { credits: 12, food: 6 }, maxCount: 100, weaknesses: ['siege'], strengths: ['infantry', 'armor', 'mech'] },
  { id: 'unit_siege_tank', name: 'Siege Tank', description: 'Heavy bombardment platform.', icon: '💣', type: 'armor', role: 'siege', tier: 3, requiredLevel: 35, requiredResearch: ['tech_siege_tank'],
    stats: { attack: 50, defense: 50, hp: 300, speed: 2, range: 8, accuracy: 70, evasion: 5, morale: 55 },
    abilities: ['siege_mode', 'area_bombardment'], buildCost: { metal: 200, crystal: 100, deuterium: 50, credits: 2000 }, trainTime: 40, upkeepCost: { credits: 18, food: 8 }, maxCount: 50, weaknesses: ['recon', 'air'], strengths: ['infantry', 'armor', 'siege'] },

  // ── ARTILLERY ──
  { id: 'unit_howitzer', name: 'Howitzer', description: 'Indirect fire support.', icon: '💥', type: 'artillery', role: 'support', tier: 1, requiredLevel: 5, requiredResearch: [],
    stats: { attack: 20, defense: 5, hp: 60, speed: 2, range: 10, accuracy: 50, evasion: 5, morale: 45 },
    abilities: ['bombardment'], buildCost: { metal: 50, crystal: 20, deuterium: 10, credits: 500 }, trainTime: 10, upkeepCost: { credits: 5, food: 3 }, maxCount: 100, weaknesses: ['recon', 'air'], strengths: ['infantry', 'mech', 'armor'] },
  { id: 'unit_rocket_battery', name: 'Rocket Battery', description: 'Area saturation weapon.', icon: '🚀', type: 'artillery', role: 'support', tier: 2, requiredLevel: 20, requiredResearch: ['tech_rocket_systems'],
    stats: { attack: 35, defense: 3, hp: 50, speed: 2, range: 12, accuracy: 45, evasion: 3, morale: 40 },
    abilities: ['area_bombardment', 'saturation'], buildCost: { metal: 80, crystal: 40, deuterium: 20, credits: 800 }, trainTime: 15, upkeepCost: { credits: 8, food: 4 }, maxCount: 50, weaknesses: ['recon', 'air', 'mech'], strengths: ['infantry', 'armor'] },
  { id: 'unit_plasma_cannon', name: 'Plasma Cannon', description: 'Anti-structure weapon.', icon: '🔥', type: 'artillery', role: 'siege', tier: 3, requiredLevel: 35, requiredResearch: ['tech_plasma_weapons'],
    stats: { attack: 60, defense: 5, hp: 80, speed: 1, range: 15, accuracy: 60, evasion: 2, morale: 50 },
    abilities: ['siege_mode', 'structure_damage'], buildCost: { metal: 150, crystal: 80, deuterium: 40, credits: 1500 }, trainTime: 30, upkeepCost: { credits: 12, food: 5 }, maxCount: 30, weaknesses: ['recon', 'air'], strengths: ['armor', 'siege'] },

  // ── AIR ──
  { id: 'unit_fighter', name: 'Attack Fighter', description: 'Close air support.', icon: '✈️', type: 'air', role: 'assault', tier: 2, requiredLevel: 15, requiredResearch: ['tech_air_support'],
    stats: { attack: 30, defense: 10, hp: 80, speed: 10, range: 6, accuracy: 75, evasion: 40, morale: 65 },
    abilities: ['strafing_run'], buildCost: { metal: 100, crystal: 60, deuterium: 30, credits: 1000 }, trainTime: 20, upkeepCost: { credits: 10, food: 3 }, maxCount: 100, weaknesses: ['artillery'], strengths: ['infantry', 'mech', 'armor'] },
  { id: 'unit_bomber', name: 'Bomber', description: 'Heavy air support.', icon: '💣', type: 'air', role: 'siege', tier: 3, requiredLevel: 30, requiredResearch: ['tech_bomber_design'],
    stats: { attack: 50, defense: 8, hp: 100, speed: 7, range: 10, accuracy: 65, evasion: 30, morale: 60 },
    abilities: ['carpet_bombing', 'structure_damage'], buildCost: { metal: 150, crystal: 100, deuterium: 50, credits: 1500 }, trainTime: 30, upkeepCost: { credits: 15, food: 5 }, maxCount: 50, weaknesses: ['air', 'artillery'], strengths: ['infantry', 'armor', 'siege'] },
  { id: 'unit_helicopter', name: 'Attack Helicopter', description: 'Versatile air unit.', icon: '🚁', type: 'air', role: 'support', tier: 2, requiredLevel: 20, requiredResearch: ['tech_helicopter'],
    stats: { attack: 25, defense: 15, hp: 90, speed: 8, range: 5, accuracy: 70, evasion: 35, morale: 60 },
    abilities: ['air_support', 'recon'], buildCost: { metal: 80, crystal: 50, deuterium: 25, credits: 800 }, trainTime: 15, upkeepCost: { credits: 8, food: 3 }, maxCount: 80, weaknesses: ['fighter'], strengths: ['infantry', 'recon'] },

  // ── SPECIAL ──
  { id: 'unit_engineer', name: 'Combat Engineer', description: 'Builds and repairs structures.', icon: '🔧', type: 'special', role: 'support', tier: 1, requiredLevel: 5, requiredResearch: [],
    stats: { attack: 5, defense: 8, hp: 40, speed: 3, range: 1, accuracy: 50, evasion: 15, morale: 55 },
    abilities: ['build', 'repair', 'demolish'], buildCost: { metal: 20, crystal: 10, deuterium: 5, credits: 200 }, trainTime: 8, upkeepCost: { credits: 3, food: 2 }, maxCount: 200, weaknesses: ['infantry', 'mech'], strengths: ['structures'] },
  { id: 'unit_medic', name: 'Field Medic', description: 'Heals nearby units.', icon: '💊', type: 'special', role: 'support', tier: 2, requiredLevel: 15, requiredResearch: ['tech_field_medicine'],
    stats: { attack: 2, defense: 5, hp: 35, speed: 4, range: 3, accuracy: 40, evasion: 20, morale: 70 },
    abilities: ['heal', 'revive'], buildCost: { metal: 15, crystal: 15, deuterium: 5, credits: 250 }, trainTime: 10, upkeepCost: { credits: 4, food: 2 }, maxCount: 100, weaknesses: ['infantry', 'mech'], strengths: ['support'] },
  { id: 'unit_cyber_ops', name: 'Cyber Operations', description: 'Electronic warfare unit.', icon: '💻', type: 'special', role: 'support', tier: 3, requiredLevel: 30, requiredResearch: ['tech_cyber_warfare'],
    stats: { attack: 15, defense: 10, hp: 45, speed: 3, range: 8, accuracy: 80, evasion: 25, morale: 65 },
    abilities: ['hack', 'disrupt', 'jam'], buildCost: { metal: 30, crystal: 40, deuterium: 15, credits: 500 }, trainTime: 20, upkeepCost: { credits: 8, food: 2 }, maxCount: 50, weaknesses: ['infantry'], strengths: ['mech', 'armor'] },

  // ── SIEGE ──
  { id: 'unit_battering_ram', name: 'Battering Ram', description: 'Fortification breaker.', icon: '🔨', type: 'siege', role: 'siege', tier: 1, requiredLevel: 10, requiredResearch: ['tech_siege_engines'],
    stats: { attack: 10, defense: 30, hp: 200, speed: 1, range: 1, accuracy: 40, evasion: 2, morale: 50 },
    abilities: ['breach'], buildCost: { metal: 100, crystal: 20, deuterium: 15, credits: 1000 }, trainTime: 15, upkeepCost: { credits: 5, food: 5 }, maxCount: 50, weaknesses: ['infantry', 'mech', 'air'], strengths: ['siege', 'structures'] },
  { id: 'unit_siege_tower', name: 'Siege Tower', description: 'Assault platform.', icon: '🏰', type: 'siege', role: 'siege', tier: 2, requiredLevel: 25, requiredResearch: ['tech_siege_towers'],
    stats: { attack: 20, defense: 40, hp: 300, speed: 1, range: 2, accuracy: 45, evasion: 1, morale: 55 },
    abilities: ['assault_deploy', 'breach'], buildCost: { metal: 150, crystal: 30, deuterium: 20, credits: 1500 }, trainTime: 25, upkeepCost: { credits: 8, food: 6 }, maxCount: 30, weaknesses: ['artillery', 'air'], strengths: ['siege', 'structures'] },
  { id: 'unit_warmachine', name: 'War Machine', description: 'Ultimate siege unit.', icon: '💀', type: 'siege', role: 'siege', tier: 4, requiredLevel: 50, requiredResearch: ['tech_warmachine'],
    stats: { attack: 80, defense: 60, hp: 500, speed: 1, range: 5, accuracy: 55, evasion: 0, morale: 60 },
    abilities: ['devastation', 'breach', 'area_damage'], buildCost: { metal: 300, crystal: 150, deuterium: 80, credits: 3000 }, trainTime: 60, upkeepCost: { credits: 25, food: 10 }, maxCount: 10, weaknesses: ['air', 'recon'], strengths: ['siege', 'structures', 'infantry', 'armor'] },

  // ── RECON ──
  { id: 'unit_scout', name: 'Scout', description: 'Fast recon unit.', icon: '🔭', type: 'recon', role: 'recon', tier: 1, requiredLevel: 1, requiredResearch: [],
    stats: { attack: 5, defense: 3, hp: 30, speed: 8, range: 6, accuracy: 60, evasion: 50, morale: 55 },
    abilities: ['recon', 'stealth'], buildCost: { metal: 10, crystal: 5, deuterium: 2, credits: 100 }, trainTime: 3, upkeepCost: { credits: 1, food: 1 }, maxCount: 300, weaknesses: ['infantry', 'mech'], strengths: ['recon'] },
  { id: 'unit_recon_vehicle', name: 'Recon Vehicle', description: 'Armored scout.', icon: '🚗', type: 'recon', role: 'recon', tier: 2, requiredLevel: 15, requiredResearch: ['tech_recon_vehicle'],
    stats: { attack: 10, defense: 12, hp: 60, speed: 10, range: 8, accuracy: 65, evasion: 45, morale: 60 },
    abilities: ['recon', 'jam'], buildCost: { metal: 30, crystal: 15, deuterium: 8, credits: 300 }, trainTime: 8, upkeepCost: { credits: 3, food: 2 }, maxCount: 100, weaknesses: ['armor'], strengths: ['recon', 'infantry'] },
];

// ============================================================================
// TRAINING CENTER
// ============================================================================

export interface TrainingCenterState {
  level: number;
  experience: number;
  maxTrainingSlots: number;
  trainingSpeedBonus: number;
  activeTraining: TrainingJob[];
  completedTraining: { unitId: string; count: number; completedAt: number }[];
  totalUnitsTrained: number;
}

export interface TrainingJob {
  id: string;
  unitId: string;
  count: number;
  startedAt: number;
  completesAt: number;
  status: 'training' | 'completed' | 'cancelled';
}

export function createDefaultTrainingCenterState(): TrainingCenterState {
  return {
    level: 1, experience: 0, maxTrainingSlots: 2, trainingSpeedBonus: 0,
    activeTraining: [], completedTraining: [], totalUnitsTrained: 0,
  };
}

export function getTrainingTime(unit: UnitDefinition, centerLevel: number, speedBonus: number): number {
  const baseTime = unit.trainTime;
  const centerReduction = Math.floor(baseTime * 0.03 * centerLevel);
  const totalReduction = Math.floor((baseTime - centerReduction) * (1 - speedBonus / 100));
  return Math.max(2, totalReduction);
}

export function getTrainingCost(unit: UnitDefinition, count: number): { metal: number; crystal: number; deuterium: number; credits: number } {
  return {
    metal: unit.buildCost.metal * count,
    crystal: unit.buildCost.crystal * count,
    deuterium: unit.buildCost.deuterium * count,
    credits: unit.buildCost.credits * count,
  };
}

export function calculateArmyPower(units: { unitId: string; count: number }[]): number {
  let power = 0;
  for (const entry of units) {
    const unit = ARMY_UNITS.find(u => u.id === entry.unitId);
    if (unit) {
      const unitPower = (unit.stats.attack + unit.stats.defense + unit.stats.hp / 10) * (unit.tier + 1);
      power += unitPower * entry.count;
    }
  }
  return Math.round(power);
}

export function getUnitsByType(type: UnitType): UnitDefinition[] {
  return ARMY_UNITS.filter(u => u.type === type);
}

export function getUnitsByRole(role: UnitRole): UnitDefinition[] {
  return ARMY_UNITS.filter(u => u.role === role);
}

export function getUnit(id: string): UnitDefinition | undefined {
  return ARMY_UNITS.find(u => u.id === id);
}

// ============================================================================
// ARMY MANAGEMENT
// ============================================================================

export interface ArmyUnit {
  id: string;
  unitId: string;
  count: number;
  level: number;
  experience: number;
  status: 'idle' | 'inCombat' | 'training' | 'rebuilding';
  location: string;
  morale: number;
}

export interface Army {
  id: string;
  name: string;
  description: string;
  icon: string;
  units: ArmyUnit[];
  commanderId?: string;
  location: string;
  status: 'idle' | 'inCombat' | 'marching' | 'garrison';
  totalPower: number;
  supplyLines: boolean;
}

export interface ArmyState {
  armies: Army[];
  reserves: ArmyUnit[];
  maxArmies: number;
  totalUnits: number;
  totalPower: number;
}

export function createDefaultArmyState(): ArmyState {
  const firstArmy: Army = {
    id: 'army_1', name: 'First Army', description: 'Main fighting force.', icon: '⚔️',
    units: [], location: 'homeworld', status: 'idle', totalPower: 0, supplyLines: true,
  };
  return {
    armies: [firstArmy],
    reserves: [], maxArmies: 3, totalUnits: 0, totalPower: 0,
  };
}

export function calculateArmyTotalPower(army: Army): number {
  return calculateArmyPower(army.units);
}

export function addUnitsToArmy(army: Army, unitId: string, count: number): Army {
  const existing = army.units.find(u => u.unitId === unitId);
  let newUnits;
  if (existing) {
    newUnits = army.units.map(u => u.unitId === unitId ? { ...u, count: u.count + count } : u);
  } else {
    newUnits = [...army.units, { id: `au_${Date.now()}`, unitId, count, level: 1, experience: 0, status: 'idle' as const, location: army.location, morale: 80 }];
  }
  const newArmy: Army = { ...army, units: newUnits as ArmyUnit[] };
  newArmy.totalPower = calculateArmyTotalPower(newArmy);
  return newArmy;
}

export function removeUnitsFromArmy(army: Army, unitId: string, count: number): Army {
  const existing = army.units.find(u => u.unitId === unitId);
  if (!existing || existing.count < count) return army;

  let newUnits;
  if (existing.count === count) {
    newUnits = army.units.filter(u => u.unitId !== unitId);
  } else {
    newUnits = army.units.map(u => u.unitId === unitId ? { ...u, count: u.count - count } : u);
  }

  const newArmy: Army = { ...army, units: newUnits as ArmyUnit[] };
  newArmy.totalPower = calculateArmyTotalPower(newArmy);
  return newArmy;
}
