/**
 * OGame Formulas — ported from ogame-opensource (PHP)
 * All core game formulas: fleet, combat, production, expedition, planet, queue
 */

// ─── Constants ───────────────────────────────────────────────────────────────

export const PROD_BUILDING_DURATION_FACTOR = 2500;
export const PROD_SHIPYARD_DURATION_FACTOR = 2500;
export const PROD_RESEARCH_DURATION_FACTOR = 1000;
export const RF_DICE = 100000;
export const BATTLE_MAX_ROUND = 6;
export const MAX_PLANETS = 9;
export const MAX_BUILDING_LEVEL = 99;

// ─── Fleet Formulas ──────────────────────────────────────────────────────────

/** OGame distance between two coordinate sets (galaxy, system, position) */
export function fleetDistance(
  from: { galaxy: number; system: number; position: number },
  to: { galaxy: number; system: number; position: number },
): number {
  const dg = Math.abs(from.galaxy - to.galaxy);
  const ds = Math.abs(from.system - to.system);
  const dp = Math.abs(from.position - to.position);

  if (dg !== 0) return dg * 20000;
  if (ds !== 0) return ds * 95 + 2700;
  if (dp !== 0) return dp * 5 + 1000;
  return 5;
}

/** Ship speed based on drive technology levels */
export function shipSpeed(
  baseSpeed: number,
  driveLevel: number,
): number {
  return baseSpeed + (baseSpeed * driveLevel) / 10;
}

/**
 * Flight duration in seconds (OGame formula)
 * duration = round((35000 / (speedPercent * 10) * sqrt(dist * 10 / speed) + 10) / speedFactor)
 */
export function flightDuration(
  distance: number,
  shipSpeed: number,
  speedPercent: number, // 1–10 (10 = 100%)
  speedFactor: number,  // game speed
): number {
  return Math.round(
    (35000 / (speedPercent * 10) * Math.sqrt(distance * 10 / shipSpeed) + 10) / speedFactor,
  );
}

/** Deuterium consumption for a fleet mission */
export function deuteriumConsumption(
  baseConsumption: number,
  distance: number,
  shipBaseSpeed: number,
  shipLevelSpeed: number,
): number {
  return Math.round(
    baseConsumption * distance / 35000 * ((shipLevelSpeed / shipBaseSpeed) + 1) ** 2,
  );
}

/** Plunderable resources per ship type (capital class cargo capacity) */
export function cargoCapacity(baseCargo: number): number {
  return baseCargo;
}

/** Plunder distribution: 50% max, metal:crystal:deuterium = 1:1:1 ratio */
export function plunderResources(
  metal: number, crystal: number, deuterium: number, capacity: number,
): { metal: number; crystal: number; deuterium: number } {
  const total = metal + crystal + deuterium;
  if (total <= capacity) return { metal, crystal, deuterium };

  const half = Math.floor(capacity / 2);
  const third = Math.floor(capacity / 3);

  if (metal >= third && crystal >= third && deuterium >= third) {
    return { metal: third, crystal: third, deuterium: capacity - 2 * third };
  }
  const remaining = capacity;
  const m = Math.min(metal, Math.floor(remaining / 2));
  const c = Math.min(crystal, remaining - m);
  const d = remaining - m - c;
  return { metal: m, crystal: c, deuterium: d };
}

// ─── Combat Formulas ─────────────────────────────────────────────────────────

/** Effective weapon power */
export function weaponPower(baseAttack: number, weaponTech: number): number {
  return baseAttack * (10 + weaponTech) / 10;
}

/** Effective shield strength */
export function shieldPower(baseShield: number, shieldTech: number): number {
  return baseShield * (10 + shieldTech) / 10;
}

/** Effective hull plating */
export function hullPlating(baseStructure: number, armourTech: number): number {
  return baseStructure * (10 + armourTech) / 10;
}

/** Hull HP after structure + armour */
export function hullHp(baseStructure: number, armourTech: number): number {
  return Math.floor(baseStructure * 0.1 * (10 + armourTech) / 10);
}

/** Damage application to shields (1% steps) */
export function shieldDamageAfterAbsorption(
  shieldPower: number, weaponPower: number,
): { shieldRemaining: number; overflow: number } {
  const shieldAfter = Math.max(0, shieldPower - weaponPower);
  const overflow = Math.max(0, weaponPower - shieldPower);
  return { shieldRemaining: shieldAfter, overflow };
}

/** Explosion chance at ≤70% hull */
export function explosionChance(hullPercent: number): number {
  return hullPercent <= 70 ? 1 - hullPercent / 100 : 0;
}

/** Rapid fire check: returns true if ship fires again */
export function rapidFireCheck(rfValue: number): boolean {
  return Math.random() * RF_DICE < RF_DICE / rfValue;
}

/** Debris generated from a destroyed ship */
export function debrisFromShip(
  metalCost: number, crystalCost: number, count: number, factor: number,
): { metal: number; crystal: number } {
  return {
    metal: Math.ceil(metalCost * count * factor / 100),
    crystal: Math.ceil(crystalCost * count * factor / 100),
  };
}

/** Moon creation chance from debris field (0–20%) */
export function moonChance(debrisMetal: number, debrisCrystal: number): number {
  const totalDebris = debrisMetal + debrisCrystal;
  return Math.min(Math.floor(totalDebris / 100000), 20);
}

/** Moon diameter from creation chance */
export function moonDiameter(chance: number): number {
  return Math.floor(1000 * Math.sqrt(10 + Math.random() * 3 + 3 * chance));
}

/** Defense repair chance after battle (for surviving defenders) */
export function defenseRepairChance(): boolean {
  return Math.random() < 0.7; // 70% chance in OGame
}

// ─── Production Formulas ─────────────────────────────────────────────────────

/** Metal mine production per hour */
export function metalMineProduction(level: number): number {
  return 30 * level * Math.pow(1.1, level);
}

/** Crystal mine production per hour */
export function crystalMineProduction(level: number): number {
  return 20 * level * Math.pow(1.1, level);
}

/** Deuterium synthesizer production per hour (temperature-dependent) */
export function deuteriumProduction(level: number, maxTemp: number): number {
  return Math.floor(10 * level * Math.pow(1.1, level) * (1.28 - 0.002 * (maxTemp + 40)));
}

/** Solar plant energy production per hour */
export function solarPlantProduction(level: number): number {
  return 20 * level * Math.pow(1.1, level);
}

/** Fusion plant energy production per hour */
export function fusionPlantProduction(level: number, energyTech: number): number {
  return Math.floor(30 * level * Math.pow(1.05 + energyTech * 0.01, level));
}

/** Solar satellite energy production (temperature-dependent) */
export function solarSatelliteProduction(maxTemp: number): number {
  return Math.max(1, Math.floor((maxTemp + 40) / 4 + 20));
}

/** Storage capacity for metal/crystal/deuterium */
export function storageCapacity(level: number): number {
  return 100000 + 50000 * Math.ceil(Math.pow(1.6, level) - 1);
}

/** Energy consumption for mines */
export function mineEnergyConsumption(level: number, mineType: 'metal' | 'crystal' | 'deuterium'): number {
  const multiplier = mineType === 'metal' ? 10 : mineType === 'crystal' ? 10 : 20;
  return Math.floor(multiplier * level * Math.pow(1.1, level));
}

// ─── Build / Research / Shipyard Time Formulas ───────────────────────────────

/** Building construction time in seconds */
export function buildingTime(
  metalCost: number, crystalCost: number,
  robotLevel: number, naniteLevel: number, speedFactor: number,
): number {
  return Math.round(
    (metalCost + crystalCost) / (PROD_BUILDING_DURATION_FACTOR * (1 + robotLevel))
    * Math.pow(0.5, naniteLevel) * 3600 / speedFactor,
  );
}

/** Research time in seconds */
export function researchTime(
  metalCost: number, crystalCost: number,
  labLevel: number, speedFactor: number, technocratBonus: number = 1,
): number {
  return Math.round(
    (metalCost + crystalCost) / (PROD_RESEARCH_DURATION_FACTOR * (1 + labLevel))
    * 3600 / speedFactor * technocratBonus,
  );
}

/** Ship/defense build time in seconds */
export function shipyardTime(
  metalCost: number, crystalCost: number,
  shipyardLevel: number, naniteLevel: number, speedFactor: number,
): number {
  return Math.round(
    (metalCost + crystalCost) / (PROD_SHIPYARD_DURATION_FACTOR * (1 + shipyardLevel))
    * Math.pow(0.5, naniteLevel) * 3600 / speedFactor,
  );
}

// ─── Expedition Formulas ─────────────────────────────────────────────────────

/** Expedition points = (metal + crystal) * count / 1000 */
export function expeditionPoints(
  metalCost: number, crystalCost: number, shipCount: number,
): number {
  return (metalCost + crystalCost) * shipCount / 1000;
}

/** Resource reward range from expedition */
export function expeditionResourceReward(
  points: number, limit: number,
): number {
  const base = Math.random() * Math.min(Math.max(200, points), limit);
  return Math.floor(base);
}

/** Dark matter reward from expedition (100–2076 * factor) */
export function expeditionDarkMatter(factor: number): number {
  return Math.floor((100 + Math.random() * 1976) * factor);
}

/** Expedition fleet acquisition chance (simplified) */
export function expeditionFleetChance(): boolean {
  return Math.random() < 0.05; // ~5% base
}

// ─── Planet Formulas ─────────────────────────────────────────────────────────

/** Colony diameter based on position (1–15) */
export function colonyDiameter(position: number): number {
  const tiers = [
    [15000, 13000], // pos 1
    [14800, 12800], // pos 2
    [14500, 12500], // pos 3
    [14300, 12300], // pos 4
    [14000, 12000], // pos 5 (sweet spot)
    [13700, 11700], // pos 6
    [13300, 11300], // pos 7
    [12800, 10800], // pos 8
    [12500, 10500], // pos 9
    [12000, 10000], // pos 10
    [11500, 9500],  // pos 11
    [10800, 8800],  // pos 12
    [10000, 8000],  // pos 13
    [9000, 7000],   // pos 14
    [8000, 6000],   // pos 15
  ];
  const idx = Math.min(Math.max(position - 1, 0), 14);
  const [maxD, minD] = tiers[idx];
  return Math.floor(minD + Math.random() * (maxD - minD));
}

/** Planet fields = floor((diameter / 1000)²) */
export function planetFields(diameter: number): number {
  return Math.floor(Math.pow(diameter / 1000, 2));
}

/** Temperature range for a planet position (1–15) */
export function planetTemperature(position: number): { min: number; max: number } {
  const baseTemp = 220 - position * 10;
  return {
    min: baseTemp - 20,
    max: baseTemp + 20,
  };
}

/** Harvest from debris field (50% metal first, then crystal) */
export function harvestDebris(
  capacity: number, debrisMetal: number, debrisCrystal: number,
): { metal: number; crystal: number; remainingMetal: number; remainingCrystal: number } {
  const metal = Math.min(debrisMetal, Math.floor(capacity / 2));
  const remainingAfterMetal = capacity - metal;
  const crystal = Math.min(debrisCrystal, remainingAfterMetal);
  return {
    metal,
    crystal,
    remainingMetal: debrisMetal - metal,
    remainingCrystal: debrisCrystal - crystal,
  };
}

// ─── Missile Formulas ────────────────────────────────────────────────────────

/** IPM damage = 12000 * (1 + weaponTech / 10) */
export function ipmDamage(weaponTech: number): number {
  return Math.floor(12000 * (1 + weaponTech / 10));
}

/** Silo capacity = level * 10 */
export function siloCapacity(level: number): number {
  return level * 10;
}

/** ABM intercept chance (simplified: 1 ABM per IPM at same tech level) */
export function abmInterceptSuccess(abmCount: number, ipmCount: number): number {
  return Math.min(abmCount, ipmCount);
}

// ─── Graviton / Moon Destruction Formulas ────────────────────────────────────

/** Moon destruction probability based on RIP count and moon diameter */
export function moonDestructionChance(ripCount: number, moonDiameter: number): number {
  return Math.min(99.9, (100 - Math.sqrt(moonDiameter)) * Math.sqrt(ripCount));
}

/** RIP loss probability during moon destruction */
export function ripLossChance(moonDiameter: number): number {
  return Math.sqrt(moonDiameter) / 2;
}

// ─── Phalanx / Sensor Formulas ───────────────────────────────────────────────

/** Sensor phalanx range = level² - 1 (in systems) */
export function phalanxRange(level: number): number {
  return level * level - 1;
}
