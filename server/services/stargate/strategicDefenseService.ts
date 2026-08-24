import type { StrategicMoon, StrategicWorld } from "./systemStateService";

export interface StrategicDefenseCombatReport {
  worldId: string;
  worldName: string;
  interception: {
    triggered: boolean;
    chance: number;
    incomingPower: number;
    interceptedPower: number;
    attackerLosses: Record<string, number>;
  };
  orbitalNetwork: {
    activeMoons: number;
    level: number;
    defensePower: number;
    antiShipPower: number;
    interceptChance: number;
    networkFireUnits: number;
  };
  planetaryShield: {
    activeMoons: number;
    level: number;
    strength: number;
    absorbedDamage: number;
    currentBefore: number;
    currentAfter: number;
    capacity: number;
    coverage: number;
    status: "offline" | "charging" | "online" | "breached";
  };
  defenderShieldMultiplier: number;
  attackerPowerAfterDefense: number;
}

export interface StrategicDefenseResolution {
  attackerUnits: Record<string, number>;
  attackerLosses: Record<string, number>;
  attackerPowerBefore: number;
  attackerPowerAfterDefense: number;
  defenderAttackMultiplier: number;
  networkFirePower: number;
  networkFireUnits: number;
  report: StrategicDefenseCombatReport;
}

interface ResolveStrategicDefenseInput {
  world: StrategicWorld;
  attackerUnits: Record<string, number>;
  unitAttackPower: Record<string, number>;
  random?: () => number;
}

function positive(value: unknown) {
  return Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
}

function sumUnits(units: Record<string, number>) {
  return Object.values(units).reduce((total, value) => total + Math.max(0, Math.floor(Number(value) || 0)), 0);
}

function getNetworkState(world: StrategicWorld) {
  const active = world.moons.filter((moon) => moon.defenseNetwork.level > 0 && moon.defenseNetwork.operational);
  return {
    active,
    level: active.reduce((total, moon) => total + moon.defenseNetwork.level, 0),
    defensePower: active.reduce((total, moon) => total + positive(moon.defenseNetwork.defensePower), 0),
    antiShipPower: active.reduce((total, moon) => total + positive(moon.defenseNetwork.antiShipPower), 0),
    interceptChance: Math.min(0.85, active.reduce((total, moon) => total + positive(moon.defenseNetwork.interceptChance), 0)),
  };
}

function getShieldState(world: StrategicWorld) {
  const shields = world.moons.filter((moon) => moon.planetaryShield.level > 0 && (moon.planetaryShield.status === "online" || moon.planetaryShield.status === "charging") && moon.planetaryShield.current > 0);
  const capacity = shields.reduce((total, moon) => total + positive(moon.planetaryShield.capacity), 0);
  const current = shields.reduce((total, moon) => total + positive(moon.planetaryShield.current), 0);
  const coverage = shields.length ? Math.min(100, shields.reduce((total, moon) => total + positive(moon.planetaryShield.coverage), 0)) : 0;
  const level = shields.reduce((total, moon) => total + moon.planetaryShield.level, 0);
  const strength = capacity > 0 ? Math.min(0.65, (current / capacity) * (coverage / 100) * 0.8) : 0;
  return { shields, capacity, current, coverage, level, strength };
}

function applyShieldDamage(shields: StrategicMoon[], absorbedDamage: number) {
  let remainingDamage = Math.max(0, Math.floor(absorbedDamage));
  for (const moon of shields) {
    if (remainingDamage <= 0) break;
    const share = Math.max(1, Math.floor(moon.planetaryShield.current / Math.max(1, shields.reduce((total, entry) => total + entry.planetaryShield.current, 0)) * absorbedDamage));
    const damage = Math.min(moon.planetaryShield.current, Math.max(1, share));
    moon.planetaryShield.current = Math.max(0, moon.planetaryShield.current - damage);
    remainingDamage -= damage;
    if (moon.planetaryShield.current <= 0) moon.planetaryShield.status = "breached";
    else if (moon.planetaryShield.current < moon.planetaryShield.capacity) moon.planetaryShield.status = "charging";
  }
}

export function resolveStrategicDefense({ world, attackerUnits, unitAttackPower, random = Math.random }: ResolveStrategicDefenseInput): StrategicDefenseResolution {
  const network = getNetworkState(world);
  const shield = getShieldState(world);
  const attackerPowerBefore = Object.entries(attackerUnits).reduce((total, [unitType, count]) => total + Math.max(0, Number(count) || 0) * positive(unitAttackPower[unitType]), 0);
  const triggered = network.interceptChance > 0 && random() < network.interceptChance;
  const interceptedPower = triggered ? Math.min(attackerPowerBefore, network.antiShipPower * 1.25) : 0;
  const interceptionRatio = attackerPowerBefore > 0 ? Math.min(0.7, interceptedPower / attackerPowerBefore * 0.25) : 0;
  const attackerLosses: Record<string, number> = {};
  const postInterceptionUnits: Record<string, number> = { ...attackerUnits };
  let removed = 0;
  for (const [unitType, countValue] of Object.entries(attackerUnits)) {
    const count = Math.max(0, Math.floor(Number(countValue) || 0));
    const loss = Math.min(count, Math.floor(count * interceptionRatio));
    if (loss > 0) {
      attackerLosses[unitType] = loss;
      postInterceptionUnits[unitType] = count - loss;
      removed += loss;
    }
  }
  if (triggered && removed === 0) {
    const fallback = Object.entries(attackerUnits).find(([, count]) => Number(count) > 0);
    if (fallback) {
      attackerLosses[fallback[0]] = 1;
      postInterceptionUnits[fallback[0]] = Math.max(0, Math.floor(Number(fallback[1])) - 1);
      removed = 1;
    }
  }
  const postInterceptionPower = Object.entries(postInterceptionUnits).reduce((total, [unitType, count]) => total + Math.max(0, Number(count) || 0) * positive(unitAttackPower[unitType]), 0);
  const absorbedDamage = Math.min(shield.current, Math.floor(postInterceptionPower * shield.strength));
  if (absorbedDamage > 0) applyShieldDamage(shield.shields, absorbedDamage);
  const shieldStatus = shield.shields.length === 0 ? "offline" : shield.shields.every((moon) => moon.planetaryShield.current <= 0) ? "breached" : shield.shields.some((moon) => moon.planetaryShield.status === "charging") ? "charging" : "online";
  const networkFireUnits = network.defensePower > 0 ? Math.max(1, Math.ceil(network.defensePower / 2_500)) : 0;
  const attackerPowerAfterDefense = Math.max(0, Math.floor(postInterceptionPower - absorbedDamage));
  return {
    attackerUnits: postInterceptionUnits,
    attackerLosses,
    attackerPowerBefore,
    attackerPowerAfterDefense,
    defenderAttackMultiplier: Number((1 + shield.strength).toFixed(3)),
    networkFirePower: network.defensePower,
    networkFireUnits,
    report: {
      worldId: world.id,
      worldName: world.name,
      interception: { triggered, chance: Number(network.interceptChance.toFixed(3)), incomingPower: Math.floor(attackerPowerBefore), interceptedPower: Math.floor(interceptedPower), attackerLosses },
      orbitalNetwork: { activeMoons: network.active.length, level: network.level, defensePower: Math.floor(network.defensePower), antiShipPower: Math.floor(network.antiShipPower), interceptChance: Number(network.interceptChance.toFixed(3)), networkFireUnits },
      planetaryShield: { activeMoons: shield.shields.length, level: shield.level, strength: Number(shield.strength.toFixed(3)), absorbedDamage, currentBefore: Math.floor(shield.current), currentAfter: Math.floor(Math.max(0, shield.current - absorbedDamage)), capacity: Math.floor(shield.capacity), coverage: Math.floor(shield.coverage), status: shieldStatus },
      defenderShieldMultiplier: Number((1 + shield.strength).toFixed(3)),
      attackerPowerAfterDefense,
    },
  };
}

export function applyNetworkFireCasualties(units: Record<string, number>, unitAttackPower: Record<string, number>, networkFirePower: number) {
  const adjustedUnits: Record<string, number> = { ...units };
  const losses: Record<string, number> = {};
  let remainingLossBudget = networkFirePower > 0 ? Math.max(1, Math.ceil(networkFirePower / 7_500)) : 0;
  const candidates = Object.entries(adjustedUnits)
    .filter(([, count]) => Number(count) > 0)
    .sort((a, b) => (unitAttackPower[a[0]] || 0) - (unitAttackPower[b[0]] || 0));
  for (const [unitType, countValue] of candidates) {
    if (remainingLossBudget <= 0) break;
    const count = Math.max(0, Math.floor(Number(countValue) || 0));
    const loss = Math.min(count, remainingLossBudget);
    if (loss > 0) {
      adjustedUnits[unitType] = count - loss;
      losses[unitType] = loss;
      remainingLossBudget -= loss;
    }
  }
  return { units: adjustedUnits, losses };
}

export function countStrategicDefenseUnits(world: StrategicWorld) {
  return sumUnits(world.moons.reduce<Record<string, number>>((counts, moon) => {
    if (moon.defenseNetwork.level > 0 && moon.defenseNetwork.operational) counts.orbitalDefenseNetwork = (counts.orbitalDefenseNetwork || 0) + Math.max(1, Math.ceil(moon.defenseNetwork.defensePower / 2_500));
    return counts;
  }, {}));
}
