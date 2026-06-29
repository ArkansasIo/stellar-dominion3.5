export type BuildingType =
  | 'solarPlant'
  | 'fusionReactor'
  | 'miningPlant'
  | 'crystalExtractor'
  | 'deuteriumSynthesizer'
  | 'researchLab'
  | 'shipyard'
  | 'roboticsFactory'
  | 'habitat'
  | 'defenseGrid';

export type ResourceType = 'energy' | 'minerals' | 'crystals' | 'darkMatter' | 'food';

export type TargetingMode = 'default' | 'smart' | 'focus_fire' | 'spread';

export type TerrainType = 'space' | 'asteroid_field' | 'nebula' | 'planet_orbit';

export type FormationType =
  | 'balanced'
  | 'aggressive'
  | 'defensive'
  | 'flanking'
  | 'pincer'
  | 'wedge'
  | 'circle';

export type VictoryType = 'domination' | 'technology' | 'economic' | 'diplomatic' | 'score';

export interface Coordinates {
  galaxy: number;
  sector: number;
  system: number;
  x: number;
  y: number;
  z: number;
}

export interface ProductionModifiers {
  raceBonus: number;
  researchBonus: number;
  governorBonus: number;
  allianceBonus: number;
  seasonBonus: number;
  energyModifier: number;
  governmentMultiplier: number;
}

export interface ProductionResult {
  output: number;
  efficiency: number;
  netAfterConsumption: number;
}

export interface EnergyBalanceResult {
  totalProduced: number;
  totalConsumed: number;
  balance: number;
  isPositive: boolean;
  penaltyApplied: boolean;
}

export interface DamageModifiers {
  attackModifier: number;
  defenseModifier: number;
  researchBonus: number;
  commanderBonus: number;
  formationBonus: number;
  terrainBonus: number;
}

export interface DamageResult {
  rawDamage: number;
  mitigatedDamage: number;
  finalDamage: number;
  isCritical: boolean;
  critMultiplier: number;
  shieldDamage: number;
  hullDamage: number;
}

export interface ShipCount {
  class: string;
  count: number;
  attack: number;
  defense: number;
  shield: number;
  hull: number;
  speed: number;
}

export interface UnitState {
  id: string;
  class: string;
  attack: number;
  defense: number;
  shield: number;
  hull: number;
  maxHull: number;
  speed: number;
  count: number;
}

export interface ForceState {
  ships: UnitState[];
  totalPower: number;
  remainingPower: number;
  formation: FormationType;
}

export interface BattleResult {
  outcome: 'attacker_victory' | 'defender_victory' | 'draw';
  attackerLosses: number;
  defenderLosses: number;
  attackerPowerRemaining: number;
  defenderPowerRemaining: number;
  rounds: number;
  plunder: PlunderResult | null;
}

export interface PlunderResult {
  metal: number;
  crystal: number;
  deuterium: number;
  totalValue: number;
}

export interface Hyperlane {
  from: string;
  to: string;
  distance: number;
  fuelCost: number;
}

export interface FleetInTransit {
  fleetId: string;
  origin: string;
  destination: string;
  departureTime: number;
  arrivalTime: number;
  ships: ShipCount[];
  fuelConsumed: number;
}

export interface FleetArrivalResult {
  arrived: boolean;
  fleet: FleetInTransit | null;
  events: string[];
}

export interface TechNode {
  id: string;
  name: string;
  level: number;
  prerequisites: Prerequisite[];
  category: string;
}

export interface Prerequisite {
  techId: string;
  level: number;
}

export interface ProgressResult {
  progress: number;
  isComplete: boolean;
  turnsRemaining: number;
}

export interface GalaxyGraph {
  nodes: string[];
  edges: Map<string, { to: string; distance: number }[]>;
}

export interface PathResult {
  path: string[];
  totalDistance: number;
  reachable: boolean;
}

export interface RouteResult {
  valid: boolean;
  path: string[];
  totalDistance: number;
  estimatedFuel: number;
  estimatedTime: number;
}

export interface TargetResult {
  targetId: string;
  targetClass: string;
  weight: number;
}

export interface ScoreBreakdown {
  militaryScore: number;
  economicScore: number;
  researchScore: number;
  diplomaticScore: number;
  territoryScore: number;
  totalScore: number;
}

export interface VictoryProgress {
  type: VictoryType;
  progress: number;
  isComplete: boolean;
  requirements: string[];
  completedRequirements: string[];
}

export interface GameEvent {
  id: string;
  type: string;
  name: string;
  description: string;
  probability: number;
  effects: EventEffect[];
  duration: number;
  startTime: number;
}

export interface EventEffect {
  type: string;
  target: string;
  value: number;
  isPercentage: boolean;
}

export interface BuildingState {
  type: BuildingType;
  level: number;
  isOnline: boolean;
  energyConsumption: number;
}

export interface ColonyState {
  id: string;
  name: string;
  population: number;
  maxPopulation: number;
  happiness: number;
  housing: number;
  amenities: number;
  crime: number;
  stability: number;
  food: number;
  foodConsumption: number;
  growthRate: number;
  buildings: BuildingState[];
  resources: ResourceState;
  terraformingLevel: number;
  planetType: string;
  distanceFromCapital: number;
}

export interface ResourceState {
  energy: number;
  minerals: number;
  crystals: number;
  darkMatter: number;
  food: number;
  deuterium?: number;
}

export interface GameState {
  empireId: string;
  colonies: ColonyState[];
  research: Record<string, number>;
  completedTechs: string[];
  resources: ResourceState;
  fleets: ForceState[];
  militaryPower: number;
  economicPower: number;
  researchPower: number;
  territoryCount: number;
  allianceId: string | null;
  season: number;
  turn: number;
}

export interface EventError {
  code: string;
  message: string;
}

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

function randomRange(min: number, max: number, seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  const rng = x - Math.floor(x);
  return min + rng * (max - min);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function buildingProduction(
  buildingType: BuildingType,
  level: number,
  modifiers: ProductionModifiers
): ProductionResult {
  const baseOutputs: Record<BuildingType, number> = {
    solarPlant: 10,
    fusionReactor: 25,
    miningPlant: 8,
    crystalExtractor: 5,
    deuteriumSynthesizer: 3,
    researchLab: 0,
    shipyard: 0,
    roboticsFactory: 0,
    habitat: 0,
    defenseGrid: 0,
  };

  const baseConsumption: Record<BuildingType, number> = {
    solarPlant: 0,
    fusionReactor: 0,
    miningPlant: 5,
    crystalExtractor: 4,
    deuteriumSynthesizer: 6,
    researchLab: 15,
    shipyard: 20,
    roboticsFactory: 10,
    habitat: 8,
    defenseGrid: 12,
  };

  const baseOutput = baseOutputs[buildingType] ?? 0;
  const baseConsume = baseConsumption[buildingType] ?? 0;

  const levelMultiplier = 1 + (level - 1) * 0.15;
  const raceMod = 1 + modifiers.raceBonus;
  const researchMod = 1 + modifiers.researchBonus;
  const govMod = modifiers.governmentMultiplier;
  const allianceMod = 1 + modifiers.allianceBonus;
  const seasonMod = 1 + modifiers.seasonBonus;
  const governorMod = 1 + modifiers.governorBonus;
  const energyMod = modifiers.energyModifier;

  const rawOutput = baseOutput * levelMultiplier;
  const modifiedOutput = rawOutput * raceMod * researchMod * govMod * allianceMod * seasonMod * governorMod * energyMod;
  const consumption = baseConsume * levelMultiplier;
  const netAfterConsumption = modifiedOutput - consumption;
  const efficiency = baseOutput > 0 ? clamp(netAfterConsumption / rawOutput, 0, 1) : 1;

  return {
    output: Math.max(0, modifiedOutput),
    efficiency,
    netAfterConsumption,
  };
}

export function energyBalance(
  buildings: BuildingState[],
  solarLevel: number,
  modifier: number
): EnergyBalanceResult {
  let totalProduced = 0;
  let totalConsumed = 0;

  for (const building of buildings) {
    if (!building.isOnline) continue;
    if (building.type === 'solarPlant' || building.type === 'fusionReactor') {
      const base = building.type === 'solarPlant' ? 10 : 25;
      totalProduced += base * building.level * modifier;
    } else {
      totalConsumed += building.energyConsumption;
    }
  }

  totalProduced += solarLevel * 5 * modifier;
  const balance = totalProduced - totalConsumed;
  const isPositive = balance >= 0;
  const penaltyApplied = !isPositive;

  return {
    totalProduced,
    totalConsumed,
    balance,
    isPositive,
    penaltyApplied,
  };
}

export function storagePenalty(current: number, max: number, threshold: number): number {
  if (max <= 0) return 0;
  const ratio = current / max;
  if (ratio <= threshold) return 1;
  const overThreshold = (ratio - threshold) / (1 - threshold);
  return clamp(1 - overThreshold * 0.7, 0.3, 1);
}

export function marketRate(
  resource: ResourceType,
  supply: number,
  demand: number,
  baseRate: number
): number {
  const supplyFactor = supply > 0 ? 1 / Math.sqrt(supply / 1000) : 10;
  const demandFactor = demand > 0 ? Math.sqrt(demand / 1000) : 0.1;
  const resourceWeights: Record<ResourceType, number> = {
    energy: 1.0,
    minerals: 1.2,
    crystals: 2.0,
    darkMatter: 5.0,
    food: 0.8,
  };
  const resourceWeight = resourceWeights[resource] ?? 1.0;
  const rawRate = baseRate * supplyFactor * demandFactor * resourceWeight;
  return clamp(rawRate, baseRate * 0.1, baseRate * 10);
}

export function tradeRouteIncome(
  distance: number,
  level: number,
  cargoCapacity: number
): number {
  const distanceFactor = Math.max(0.1, 1 - distance * 0.01);
  const levelBonus = 1 + (level - 1) * 0.12;
  const baseIncome = cargoCapacity * 0.5;
  return baseIncome * distanceFactor * levelBonus;
}

export function evasionChance(
  shipSpeed: number,
  targetSize: number,
  modifier: number
): number {
  const baseEvasion = 5;
  const speedFactor = shipSpeed * 0.05;
  const sizePenalty = targetSize > 500 ? (targetSize - 500) * 0.005 : 0;
  const rawEvasion = baseEvasion + speedFactor - sizePenalty + modifier;
  return clamp(rawEvasion, 0, 75);
}

export function criticalHit(
  baseChance: number,
  researchBonus: number,
  commanderBonus: number
): { isCritical: boolean; multiplier: number } {
  const totalChance = clamp(baseChance + researchBonus + commanderBonus, 0, 80);
  const roll = Math.random() * 100;
  const isCritical = roll < totalChance;
  const minMult = 1.5;
  const maxMult = 3.0;
  const multiplier = isCritical ? lerp(minMult, maxMult, seededRandom(roll)) : 1;
  return { isCritical, multiplier };
}

export function calculateDamage(
  attack: number,
  defense: number,
  modifiers: DamageModifiers
): DamageResult {
  const modifiedAttack = attack * (1 + modifiers.attackModifier + modifiers.researchBonus + modifiers.commanderBonus + modifiers.formationBonus);
  const modifiedDefense = defense * (1 + modifiers.defenseModifier + modifiers.terrainBonus);
  const defenseConstant = 100;
  const rawDamage = (modifiedAttack * modifiedAttack) / (modifiedAttack + modifiedDefense + defenseConstant);
  const randomFactor = 0.85 + Math.random() * 0.3;
  const mitigatedDamage = rawDamage * randomFactor;

  const critResult = criticalHit(5, modifiers.researchBonus * 10, modifiers.commanderBonus * 10);
  const finalDamage = mitigatedDamage * critResult.multiplier;

  return {
    rawDamage,
    mitigatedDamage,
    finalDamage: Math.max(0, finalDamage),
    isCritical: critResult.isCritical,
    critMultiplier: critResult.multiplier,
    shieldDamage: 0,
    hullDamage: 0,
  };
}

export function shieldAbsorption(
  incomingDamage: number,
  shieldStrength: number,
  penetration: number
): { shieldDamage: number; hullDamage: number } {
  if (shieldStrength <= 0) {
    return { shieldDamage: 0, hullDamage: incomingDamage };
  }
  const effectivePenetration = clamp(penetration, 0, 1);
  const absorbFraction = 0.7 * (1 - effectivePenetration);
  const shieldDamage = Math.min(incomingDamage * absorbFraction, shieldStrength);
  const hullDamage = incomingDamage - shieldDamage;
  return { shieldDamage, hullDamage: Math.max(0, hullDamage) };
}

export function selectTarget(
  attacker: UnitState[],
  defender: UnitState[],
  targetingMode: TargetingMode
): TargetResult {
  if (defender.length === 0) {
    return { targetId: '', targetClass: '', weight: 0 };
  }

  const weights = defender.map((unit) => {
    let weight = 1;

    switch (targetingMode) {
      case 'focus_fire':
        weight = unit.count * (unit.hull + unit.shield);
        break;
      case 'smart':
        weight = unit.attack * unit.count + (unit.shield > 0 ? 2 : 1);
        break;
      case 'spread':
        weight = 1 / (unit.count + 1);
        break;
      default:
        weight = unit.hull + unit.shield + unit.attack;
    }

    return { unit, weight: Math.max(0.01, weight) };
  });

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const w of weights) {
    roll -= w.weight;
    if (roll <= 0) {
      return { targetId: w.unit.id, targetClass: w.unit.class, weight: w.weight / totalWeight };
    }
  }

  const last = weights[weights.length - 1];
  return { targetId: last.unit.id, targetClass: last.unit.class, weight: last.weight / totalWeight };
}

function getTerrainModifiers(terrain: TerrainType): { attackMod: number; defenseMod: number; evasionMod: number } {
  const modifiers: Record<TerrainType, { attackMod: number; defenseMod: number; evasionMod: number }> = {
    space: { attackMod: 1.0, defenseMod: 1.0, evasionMod: 0 },
    asteroid_field: { attackMod: 0.9, defenseMod: 1.15, evasionMod: 10 },
    nebula: { attackMod: 0.85, defenseMod: 1.1, evasionMod: 15 },
    planet_orbit: { attackMod: 1.0, defenseMod: 1.2, evasionMod: 5 },
  };
  return modifiers[terrain];
}

function getFormationModifiers(formation: FormationType): { attackMult: number; defenseMult: number } {
  const modifiers: Record<FormationType, { attackMult: number; defenseMult: number }> = {
    balanced: { attackMult: 1.0, defenseMult: 1.0 },
    aggressive: { attackMult: 1.3, defenseMult: 0.8 },
    defensive: { attackMult: 0.8, defenseMult: 1.3 },
    flanking: { attackMult: 1.2, defenseMult: 0.9 },
    pincer: { attackMult: 1.15, defenseMult: 1.0 },
    wedge: { attackMult: 1.25, defenseMult: 0.85 },
    circle: { attackMult: 0.95, defenseMult: 1.2 },
  };
  const m = modifiers[formation] ?? modifiers.balanced;
  return { attackMult: m.attackMult, defenseMult: m.defenseMult };
}

function calculateForcePower(ships: UnitState[]): number {
  return ships.reduce((total, ship) => {
    const shipPower = (ship.attack + ship.defense + ship.shield + ship.hull) * ship.count;
    return total + shipPower;
  }, 0);
}

export function calculateBattleResult(
  attackerForce: ForceState,
  defenderForce: ForceState,
  terrain: TerrainType,
  formation: FormationType,
  rounds: number
): BattleResult {
  const terrainMod = getTerrainModifiers(terrain);
  const formMod = getFormationModifiers(formation);
  const maxRounds = Math.min(rounds, 100);

  let attackerPower = attackerForce.totalPower;
  let defenderPower = defenderForce.totalPower;
  const startAttackerPower = attackerPower;
  const startDefenderPower = defenderPower;
  let completedRounds = 0;

  for (let i = 0; i < maxRounds; i++) {
    if (attackerPower <= 0 || defenderPower <= 0) break;

    const attackDamage = attackerPower * 0.1 * formMod.attackMult * terrainMod.attackMod;
    const defenseDamage = defenderPower * 0.1 * terrainMod.defenseMod;

    const defenderMitigation = 1 - (defenderPower / (defenderPower + 100));
    const attackerMitigation = 1 - (attackerPower / (attackerPower + 100));

    defenderPower -= attackDamage * (1 - defenderMitigation * 0.5);
    attackerPower -= defenseDamage * (1 - attackerMitigation * 0.5);

    completedRounds = i + 1;

    if (defenderPower <= attackerPower * 0.2 && i > 5) {
      const retreatRoll = Math.random();
      if (retreatRoll < 0.4) break;
    }

    if (attackerPower <= defenderPower * 0.2 && i > 5) {
      const retreatRoll = Math.random();
      if (retreatRoll < 0.5) break;
    }
  }

  attackerPower = Math.max(0, attackerPower);
  defenderPower = Math.max(0, defenderPower);

  let outcome: BattleResult['outcome'];
  if (attackerPower > defenderPower) {
    outcome = 'attacker_victory';
  } else if (defenderPower > attackerPower) {
    outcome = 'defender_victory';
  } else {
    outcome = 'draw';
  }

  const attackerLosses = startAttackerPower > 0 ? 1 - attackerPower / startAttackerPower : 0;
  const defenderLosses = startDefenderPower > 0 ? 1 - defenderPower / startDefenderPower : 0;

  const plunder = outcome === 'attacker_victory'
    ? plunderAmount(3, 5000, { energy: 10000, minerals: 8000, crystals: 4000, darkMatter: 500, food: 6000 })
    : null;

  return {
    outcome,
    attackerLosses: clamp(attackerLosses, 0, 1),
    defenderLosses: clamp(defenderLosses, 0, 1),
    attackerPowerRemaining: attackerPower,
    defenderPowerRemaining: defenderPower,
    rounds: completedRounds,
    plunder,
  };
}

export function fleetPower(ships: ShipCount[]): number {
  return ships.reduce((total, ship) => {
    const power = (ship.attack * 2 + ship.defense + ship.shield + ship.hull) * ship.count;
    return total + power;
  }, 0);
}

export function retreatChance(
  remainingPower: number,
  startingPower: number
): number {
  if (startingPower <= 0) return 0;
  const ratio = remainingPower / startingPower;
  const baseChance = 10;
  const powerPenalty = (1 - ratio) * 40;
  return clamp(baseChance + powerPenalty, 0, 85);
}

export function plunderAmount(
  survivingCargoShips: number,
  cargoCapacity: number,
  defenderResources: ResourceState
): PlunderResult {
  const maxCargo = survivingCargoShips * cargoCapacity;
  const totalDefenderResources = (defenderResources.minerals || 0) + (defenderResources.crystals || 0) + (defenderResources.deuterium || 0);

  if (totalDefenderResources <= 0 || maxCargo <= 0) {
    return { metal: 0, crystal: 0, deuterium: 0, totalValue: 0 };
  }

  const plunderFraction = Math.min(maxCargo / totalDefenderResources, 0.3);
  const metal = Math.floor((defenderResources.minerals || 0) * plunderFraction);
  const crystal = Math.floor((defenderResources.crystals || 0) * plunderFraction);
  const deuterium = Math.floor((defenderResources.deuterium || 0) * plunderFraction);

  return {
    metal,
    crystal,
    deuterium,
    totalValue: metal + crystal * 2 + deuterium * 3,
  };
}

export function galaxyDistance(from: Coordinates, to: Coordinates): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function travelTime(
  distance: number,
  fleetSpeed: number,
  speedModifier: number
): number {
  if (fleetSpeed <= 0) return Infinity;
  const effectiveSpeed = fleetSpeed * (1 + speedModifier);
  const baseTime = distance / effectiveSpeed;
  return Math.ceil(baseTime * 100);
}

export function fuelConsumption(
  distance: number,
  fleetSize: number,
  fuelEfficiency: number
): number {
  const baseConsumption = 0.1;
  const sizeFactor = Math.log2(fleetSize + 1);
  const efficiencyFactor = 1 / Math.max(0.1, fuelEfficiency);
  return distance * baseConsumption * sizeFactor * efficiencyFactor;
}

export function validateRoute(
  origin: Coordinates,
  destination: Coordinates,
  hyperlanes: Hyperlane[]
): RouteResult {
  const originKey = `${origin.galaxy}-${origin.sector}-${origin.system}`;
  const destKey = `${destination.galaxy}-${destination.sector}-${destination.system}`;

  const directLane = hyperlanes.find(
    (h) => (h.from === originKey && h.to === destKey) || (h.from === destKey && h.to === originKey)
  );

  if (directLane) {
    return {
      valid: true,
      path: [originKey, destKey],
      totalDistance: directLane.distance,
      estimatedFuel: directLane.fuelCost,
      estimatedTime: directLane.distance * 10,
    };
  }

  const visited = new Set<string>();
  const queue: { node: string; path: string[]; distance: number; fuel: number }[] = [
    { node: originKey, path: [originKey], distance: 0, fuel: 0 },
  ];
  visited.add(originKey);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = hyperlanes.filter(
      (h) => h.from === current.node || h.to === current.node
    );

    for (const lane of neighbors) {
      const nextNode = lane.from === current.node ? lane.to : lane.from;
      if (visited.has(nextNode)) continue;
      visited.add(nextNode);

      const newPath = [...current.path, nextNode];
      const newDist = current.distance + lane.distance;
      const newFuel = current.fuel + lane.fuelCost;

      if (nextNode === destKey) {
        return {
          valid: true,
          path: newPath,
          totalDistance: newDist,
          estimatedFuel: newFuel,
          estimatedTime: newDist * 10,
        };
      }

      queue.push({ node: nextNode, path: newPath, distance: newDist, fuel: newFuel });
    }
  }

  return { valid: false, path: [], totalDistance: 0, estimatedFuel: 0, estimatedTime: 0 };
}

export function processFleetArrival(
  fleet: FleetInTransit,
  currentTime: number
): FleetArrivalResult {
  if (currentTime < fleet.arrivalTime) {
    return { arrived: false, fleet, events: [] };
  }

  const events: string[] = [];
  events.push(`Fleet ${fleet.fleetId} arrived at ${fleet.destination}`);

  return { arrived: true, fleet, events };
}

export function researchCost(baseCost: number, level: number, multiplier: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, level - 1));
}

export function researchTime(
  baseTime: number,
  level: number,
  multiplier: number,
  speedBonus: number
): number {
  const rawTime = baseTime * Math.pow(multiplier, level - 1);
  return Math.ceil(rawTime / (1 + speedBonus));
}

export function researchProgress(
  currentPoints: number,
  totalCost: number,
  researchSpeed: number
): ProgressResult {
  if (totalCost <= 0) return { progress: 1, isComplete: true, turnsRemaining: 0 };
  const progress = clamp(currentPoints / totalCost, 0, 1);
  const isComplete = currentPoints >= totalCost;
  const remaining = totalCost - currentPoints;
  const turnsRemaining = researchSpeed > 0 ? Math.ceil(remaining / researchSpeed) : Infinity;
  return { progress, isComplete, turnsRemaining };
}

export function validatePrerequisites(
  techId: string,
  completedTechs: string[],
  prerequisites: Prerequisite[]
): boolean {
  return prerequisites.every((prereq) => {
    return completedTechs.includes(prereq.techId);
  });
}

export function getAvailableTechs(
  completedTechs: string[],
  techTree: TechNode[]
): string[] {
  return techTree
    .filter((tech) => {
      if (completedTechs.includes(tech.id)) return false;
      return validatePrerequisites(tech.id, completedTechs, tech.prerequisites);
    })
    .map((tech) => tech.id);
}

export function populationGrowth(
  currentPop: number,
  maxPop: number,
  happiness: number,
  foodSupply: number,
  growthRate: number
): number {
  if (currentPop >= maxPop) return 0;
  const capacityFactor = 1 - currentPop / maxPop;
  const happinessFactor = clamp(happiness / 100, 0.2, 1.5);
  const foodFactor = foodSupply > 0 ? clamp(foodSupply / (currentPop * 0.1), 0.1, 2) : 0;
  const growth = currentPop * growthRate * capacityFactor * happinessFactor * foodFactor;
  return Math.max(0, Math.floor(growth));
}

export function happiness(
  amenities: number,
  crime: number,
  stability: number,
  population: number,
  housing: number
): number {
  const amenityScore = clamp((amenities / Math.max(1, population)) * 100, 0, 50);
  const crimePenalty = crime * 0.5;
  const stabilityBonus = stability * 0.3;
  const housingFactor = population > 0 ? clamp(housing / population, 0, 1) * 20 : 10;
  const raw = amenityScore - crimePenalty + stabilityBonus + housingFactor;
  return clamp(raw, 0, 100);
}

export function colonyValue(colony: ColonyState): number {
  const popValue = colony.population * 10;
  const resourceValue = colony.resources.minerals + colony.resources.crystals * 2 + colony.resources.darkMatter * 10;
  const happinessValue = colony.happiness * colony.population * 0.5;
  const buildingValue = colony.buildings.reduce((sum, b) => sum + b.level * 100, 0);
  const stabilityValue = colony.stability * colony.population * 0.3;
  return popValue + resourceValue + happinessValue + buildingValue + stabilityValue;
}

export function habitability(
  planetType: string,
  terraformingLevel: number,
  raceModifier: number
): number {
  const baseHabitability: Record<string, number> = {
    terrestrial: 90,
    ocean: 80,
    desert: 40,
    tundra: 35,
    gas_giant: 5,
    volcanic: 20,
    toxic: 10,
    frozen: 25,
    arid: 45,
    lush: 95,
  };

  const base = baseHabitability[planetType] ?? 50;
  const terraformBonus = terraformingLevel * 5;
  const final = (base + terraformBonus) * raceModifier;
  return clamp(final, 0, 100);
}

export function findRoute(
  start: Coordinates,
  end: number,
  hyperlanes: Hyperlane[],
  fleetSpeed: number
): RouteResult {
  const startKey = `${start.galaxy}-${start.sector}-${start.system}`;
  const goalKey = String(end);

  const visited = new Map<string, { dist: number; path: string[] }>();
  visited.set(startKey, { dist: 0, path: [startKey] });

  const queue: { node: string; dist: number; path: string[] }[] = [
    { node: startKey, dist: 0, path: [startKey] },
  ];

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift()!;

    if (current.node === goalKey) {
      const estimatedFuel = fuelConsumption(current.dist, 1, 1);
      const estimatedTime = travelTime(current.dist, fleetSpeed, 0);
      return {
        valid: true,
        path: current.path,
        totalDistance: current.dist,
        estimatedFuel,
        estimatedTime,
      };
    }

    const existing = visited.get(current.node);
    if (existing && existing.dist < current.dist) continue;

    const neighbors = hyperlanes.filter(
      (h) => h.from === current.node || h.to === current.node
    );

    for (const lane of neighbors) {
      const nextNode = lane.from === current.node ? lane.to : lane.from;
      const newDist = current.dist + lane.distance;
      const prev = visited.get(nextNode);

      if (!prev || newDist < prev.dist) {
        visited.set(nextNode, { dist: newDist, path: [...current.path, nextNode] });
        queue.push({ node: nextNode, dist: newDist, path: [...current.path, nextNode] });
      }
    }
  }

  return { valid: false, path: [], totalDistance: 0, estimatedFuel: 0, estimatedTime: 0 };
}

export function shortestPath(
  graph: GalaxyGraph,
  start: string,
  end: string
): PathResult {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const node of graph.nodes) {
    dist.set(node, Infinity);
    prev.set(node, null);
  }
  dist.set(start, 0);

  const queue = [...graph.nodes];

  while (queue.length > 0) {
    queue.sort((a, b) => (dist.get(a) ?? Infinity) - (dist.get(b) ?? Infinity));
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    if (current === end) break;

    const edges = graph.edges.get(current) ?? [];
    for (const edge of edges) {
      const alt = (dist.get(current) ?? Infinity) + edge.distance;
      if (alt < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, alt);
        prev.set(edge.to, current);
      }
    }
  }

  const totalDistance = dist.get(end) ?? Infinity;
  if (totalDistance === Infinity) {
    return { path: [], totalDistance: Infinity, reachable: false };
  }

  const path: string[] = [];
  let current: string | null = end;
  while (current !== null) {
    path.unshift(current);
    current = prev.get(current) ?? null;
  }

  return { path, totalDistance, reachable: true };
}

export function reachableSystems(
  start: string,
  graph: GalaxyGraph,
  maxRange: number
): string[] {
  const visited = new Set<string>();
  const queue: { node: string; dist: number }[] = [{ node: start, dist: 0 }];
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const edges = graph.edges.get(current.node) ?? [];

    for (const edge of edges) {
      if (visited.has(edge.to)) continue;
      const newDist = current.dist + edge.distance;
      if (newDist <= maxRange) {
        visited.add(edge.to);
        queue.push({ node: edge.to, dist: newDist });
      }
    }
  }

  return Array.from(visited);
}

export function empireScore(state: GameState): ScoreBreakdown {
  const militaryScore = state.militaryPower * 1.0;
  const economicScore = state.economicPower * 1.2;
  const researchScore = state.researchPower * 1.5;
  const diplomaticScore = state.allianceId ? 500 : 0;
  const territoryScore = state.territoryCount * 200;
  const totalScore = militaryScore + economicScore + researchScore + diplomaticScore + territoryScore;

  return {
    militaryScore,
    economicScore,
    researchScore,
    diplomaticScore,
    territoryScore,
    totalScore,
  };
}

export function victoryProgress(
  state: GameState,
  victoryType: VictoryType
): VictoryProgress {
  const score = empireScore(state);

  switch (victoryType) {
    case 'domination': {
      const requirement = 'Control 75% of all systems';
      const progress = clamp(state.territoryCount / 100 * 100 / 75, 0, 100);
      return {
        type: victoryType,
        progress,
        isComplete: progress >= 100,
        requirements: [requirement],
        completedRequirements: progress >= 100 ? [requirement] : [],
      };
    }
    case 'technology': {
      const requirement = 'Complete all tier 5 technologies';
      const techProgress = Object.values(state.research).reduce((sum, level) => sum + level, 0);
      const maxTech = Object.keys(state.research).length * 5 || 1;
      const progress = clamp((techProgress / maxTech) * 100, 0, 100);
      return {
        type: victoryType,
        progress,
        isComplete: progress >= 100,
        requirements: [requirement],
        completedRequirements: progress >= 100 ? [requirement] : [],
      };
    }
    case 'economic': {
      const requirement = 'Accumulate 10 million total resource value';
      const totalResources = state.resources.minerals + state.resources.crystals * 2 + state.resources.darkMatter * 10;
      const progress = clamp((totalResources / 10000000) * 100, 0, 100);
      return {
        type: victoryType,
        progress,
        isComplete: progress >= 100,
        requirements: [requirement],
        completedRequirements: progress >= 100 ? [requirement] : [],
      };
    }
    case 'diplomatic': {
      const requirement = 'Form alliance with 5 empires and achieve peace';
      const progress = state.allianceId ? 50 : 0;
      return {
        type: victoryType,
        progress,
        isComplete: false,
        requirements: [requirement],
        completedRequirements: [],
      };
    }
    case 'score':
    default: {
      const requirement = 'Achieve highest score';
      const progress = clamp(score.totalScore / 50000 * 100, 0, 100);
      return {
        type: victoryType,
        progress,
        isComplete: progress >= 100,
        requirements: [requirement],
        completedRequirements: progress >= 100 ? [requirement] : [],
      };
    }
  }
}

export function rankingScore(
  empireScore: number,
  allianceBonus: number,
  seasonMultiplier: number
): number {
  const baseScore = empireScore * (1 + allianceBonus);
  return Math.floor(baseScore * seasonMultiplier);
}

export function generateEvent(gameState: GameState, seed: number): GameEvent {
  const eventTypes = [
    'asteroid_mining_opportunity',
    'pirate_raid',
    'stellar风暴',
    'ancient_artifact_discovery',
    'trade_agreement',
    'research_breakthrough',
    'population_surge',
    'resource_shortage',
    'alliance_offer',
    'cosmic_anomaly',
  ];

  const typeIndex = Math.floor(seededRandom(seed) * eventTypes.length);
  const eventType = eventTypes[typeIndex];

  const events: Record<string, Omit<GameEvent, 'id' | 'probability' | 'startTime'>> = {
    asteroid_mining_opportunity: {
      type: 'resource_bonus',
      name: 'Asteroid Mining Opportunity',
      description: 'A rich asteroid field has been discovered nearby.',
      effects: [{ type: 'resources', target: 'minerals', value: 5000, isPercentage: false }],
      duration: 10,
    },
    pirate_raid: {
      type: 'negative',
      name: 'Pirate Raid',
      description: 'Pirates are attacking your trade routes.',
      effects: [{ type: 'resources', target: 'minerals', value: -2000, isPercentage: false }],
      duration: 5,
    },
    stellar风暴: {
      type: 'negative',
      name: 'Stellar Storm',
      description: 'A massive stellar storm disrupts operations.',
      effects: [
        { type: 'production', target: 'energy', value: -0.3, isPercentage: true },
        { type: 'production', target: 'minerals', value: -0.2, isPercentage: true },
      ],
      duration: 8,
    },
    ancient_artifact_discovery: {
      type: 'positive',
      name: 'Ancient Artifact Discovery',
      description: 'Your scientists have uncovered ancient technology.',
      effects: [{ type: 'research', target: 'all', value: 1000, isPercentage: false }],
      duration: 15,
    },
    trade_agreement: {
      type: 'positive',
      name: 'Trade Agreement',
      description: 'A neighboring empire proposes a trade deal.',
      effects: [{ type: 'resources', target: 'crystals', value: 3000, isPercentage: false }],
      duration: 20,
    },
    research_breakthrough: {
      type: 'positive',
      name: 'Research Breakthrough',
      description: 'A major breakthrough accelerates all research.',
      effects: [{ type: 'research_speed', target: 'all', value: 0.5, isPercentage: true }],
      duration: 12,
    },
    population_surge: {
      type: 'positive',
      name: 'Population Surge',
      description: 'Immigration increases your population significantly.',
      effects: [{ type: 'population', target: 'all', value: 0.1, isPercentage: true }],
      duration: 10,
    },
    resource_shortage: {
      type: 'negative',
      name: 'Resource Shortage',
      description: 'Supply chain disruptions cause resource shortages.',
      effects: [
        { type: 'resources', target: 'food', value: -1500, isPercentage: false },
        { type: 'resources', target: 'energy', value: -1000, isPercentage: false },
      ],
      duration: 7,
    },
    alliance_offer: {
      type: 'diplomatic',
      name: 'Alliance Offer',
      description: 'A powerful empire seeks to form an alliance.',
      effects: [{ type: 'diplomacy', target: 'alliance', value: 1, isPercentage: false }],
      duration: 30,
    },
    cosmic_anomaly: {
      type: 'neutral',
      name: 'Cosmic Anomaly',
      description: 'A strange cosmic phenomenon has been detected.',
      effects: [{ type: 'exploration', target: 'range', value: 5, isPercentage: false }],
      duration: 25,
    },
  };

  const event = events[eventType] ?? events.asteroid_mining_opportunity;
  const probability = 0.1 + seededRandom(seed + 1) * 0.3;

  return {
    id: `event-${seed}-${Date.now()}`,
    ...event,
    probability,
    startTime: gameState.turn,
  };
}

export function eventProbability(
  eventType: string,
  gameState: GameState,
  lastEventTime: number
): number {
  const timeSinceLastEvent = gameState.turn - lastEventTime;
  const baseProbability: Record<string, number> = {
    asteroid_mining_opportunity: 0.15,
    pirate_raid: 0.1,
    stellar风暴: 0.05,
    ancient_artifact_discovery: 0.03,
    trade_agreement: 0.12,
    research_breakthrough: 0.04,
    population_surge: 0.08,
    resource_shortage: 0.1,
    alliance_offer: 0.06,
    cosmic_anomaly: 0.02,
  };

  const base = baseProbability[eventType] ?? 0.05;
  const timeFactor = Math.min(timeSinceLastEvent / 100, 1);
  const stabilityFactor = gameState.colonies.length > 0
    ? gameState.colonies.reduce((sum, c) => sum + c.stability, 0) / gameState.colonies.length / 100
    : 0.5;

  return clamp(base * (0.5 + timeFactor * 0.5) * stabilityFactor, 0, 1);
}

export function applyEventEffect(
  event: GameEvent,
  state: GameState
): Result<GameState, EventError> {
  if (!event.effects || event.effects.length === 0) {
    return ok(state);
  }

  const newState = { ...state };
  newState.resources = { ...state.resources };
  newState.research = { ...state.research };

  for (const effect of event.effects) {
    switch (effect.type) {
      case 'resources': {
        const target = effect.target as keyof ResourceState;
        if (target in newState.resources) {
          const current = newState.resources[target] || 0;
          if (effect.isPercentage) {
            newState.resources[target] = current * (1 + effect.value);
          } else {
            newState.resources[target] = Math.max(0, current + effect.value);
          }
        }
        break;
      }
      case 'production': {
        break;
      }
      case 'research': {
        if (effect.target === 'all') {
          for (const tech of Object.keys(newState.research)) {
            newState.research[tech] += Math.floor(effect.value);
          }
        } else if (effect.target in newState.research) {
          newState.research[effect.target] += Math.floor(effect.value);
        }
        break;
      }
      case 'research_speed':
        break;
      case 'population': {
        for (const colony of newState.colonies) {
          if (effect.isPercentage) {
            colony.population = Math.floor(colony.population * (1 + effect.value));
          } else {
            colony.population = Math.floor(colony.population + effect.value);
          }
          colony.population = Math.min(colony.population, colony.maxPopulation);
        }
        break;
      }
      case 'diplomacy':
        break;
      case 'exploration':
        break;
      default:
        break;
    }
  }

  return ok(newState);
}
