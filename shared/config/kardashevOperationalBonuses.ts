export type KardashevLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

export interface KardashevSystemsState {
  [systemId: string]: number;
}

export interface KardashevOperationalBonuses {
  level: KardashevLevel;
  tierName: string;
  fleetPowerPercent: number;
  fleetPowerMultiplier: number;
  defensePowerPercent: number;
  defensePowerMultiplier: number;
  maxPlanets: number;
  maxFleets: number;
  expansionCapacityRemaining: number;
  summary: string;
}

interface OperationalTier {
  name: string;
  fleetPower: number;
  defensePower: number;
  maxPlanets: number;
  maxFleets: number;
}

// Keep these operational values in a shared, dependency-free table. The full
// narrative Kardashev catalogue remains in client/src/lib/kardashevScale.ts.
const KARDASHEV_OPERATIONAL_TABLE: Record<KardashevLevel, OperationalTier> = {
  1: { name: "Planetary Settler", fleetPower: 0, defensePower: 0, maxPlanets: 1, maxFleets: 1 },
  2: { name: "Local Planetary Control", fleetPower: 5, defensePower: 5, maxPlanets: 1, maxFleets: 2 },
  3: { name: "System Control", fleetPower: 15, defensePower: 15, maxPlanets: 3, maxFleets: 5 },
  4: { name: "Sector Dominance", fleetPower: 30, defensePower: 30, maxPlanets: 8, maxFleets: 15 },
  5: { name: "Galactic Frontier", fleetPower: 50, defensePower: 50, maxPlanets: 20, maxFleets: 40 },
  6: { name: "Regional Power", fleetPower: 80, defensePower: 80, maxPlanets: 50, maxFleets: 100 },
  7: { name: "Galactic Hegemon", fleetPower: 120, defensePower: 120, maxPlanets: 150, maxFleets: 300 },
  8: { name: "Multi-Galactic Empire", fleetPower: 180, defensePower: 180, maxPlanets: 300, maxFleets: 600 },
  9: { name: "Local Universe Presence", fleetPower: 250, defensePower: 250, maxPlanets: 500, maxFleets: 1000 },
  10: { name: "Observable Universe Control", fleetPower: 350, defensePower: 350, maxPlanets: 1000, maxFleets: 2000 },
  11: { name: "Multiverse Entity", fleetPower: 500, defensePower: 500, maxPlanets: 2000, maxFleets: 5000 },
  12: { name: "Cosmic Ascendant", fleetPower: 700, defensePower: 700, maxPlanets: 5000, maxFleets: 10000 },
  13: { name: "Supracosmic Force", fleetPower: 1000, defensePower: 1000, maxPlanets: 10000, maxFleets: 20000 },
  14: { name: "Meta-Universal Collective", fleetPower: 1250, defensePower: 1250, maxPlanets: 20000, maxFleets: 50000 },
  15: { name: "Transcendental Being", fleetPower: 1500, defensePower: 1500, maxPlanets: 50000, maxFleets: 100000 },
  16: { name: "Universal Architect", fleetPower: 2000, defensePower: 2000, maxPlanets: 100000, maxFleets: 200000 },
  17: { name: "Godlike Entity", fleetPower: 2500, defensePower: 2500, maxPlanets: 200000, maxFleets: 500000 },
  18: { name: "Supreme Omnipotent", fleetPower: 3000, defensePower: 3000, maxPlanets: 999999, maxFleets: 999999 },
};

function asFiniteLevel(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(1, Math.min(18, Math.floor(value)));
}

/**
 * Kardashev upgrades are stored as contiguous auxiliary-system levels. A gap
 * intentionally stops progression so a partially saved client state cannot
 * grant a higher tier than the one it has actually unlocked.
 */
export function getKardashevLevelFromSystems(input: unknown): KardashevLevel {
  const systems = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const explicitLevel = asFiniteLevel(systems.currentLevel ?? systems.level);
  if (explicitLevel !== null) return explicitLevel as KardashevLevel;

  let currentLevel: KardashevLevel = 1;
  for (let level = 2; level <= 18; level += 1) {
    const raw = systems[`kardashev-tier-${level}`];
    const unlocked = typeof raw === "number" ? raw > 0 : Boolean(raw);
    if (!unlocked) break;
    currentLevel = level as KardashevLevel;
  }
  return currentLevel;
}

export function getKardashevOperationalBonuses(levelOrSystems: number | unknown): KardashevOperationalBonuses {
  const level = typeof levelOrSystems === "number"
    ? (asFiniteLevel(levelOrSystems) || 1) as KardashevLevel
    : getKardashevLevelFromSystems(levelOrSystems);
  const tier = KARDASHEV_OPERATIONAL_TABLE[level];
  const fleetPowerPercent = tier.fleetPower;
  const defensePowerPercent = tier.defensePower;

  return {
    level,
    tierName: tier.name,
    fleetPowerPercent,
    fleetPowerMultiplier: 1 + fleetPowerPercent / 100,
    defensePowerPercent,
    defensePowerMultiplier: 1 + defensePowerPercent / 100,
    maxPlanets: tier.maxPlanets,
    maxFleets: tier.maxFleets,
    expansionCapacityRemaining: tier.maxPlanets,
    summary: `Tier ${level} ${tier.name}: +${fleetPowerPercent}% fleet power, +${defensePowerPercent}% defense, ${tier.maxPlanets} planet cap`,
  };
}

export function getKardashevOperationalBonusesForPlayer(playerState: {
  kardashevSystems?: unknown;
  tierBonuses?: unknown;
} | null | undefined): KardashevOperationalBonuses {
  const systems = playerState?.kardashevSystems;
  if (systems && typeof systems === "object" && Object.keys(systems as object).length > 0) {
    return getKardashevOperationalBonuses(systems);
  }

  // Legacy saves may only have a numeric value in tierBonuses. This fallback
  // keeps old accounts deterministic while new saves use kardashevSystems.
  const tierBonuses = playerState?.tierBonuses;
  const legacyLevel = tierBonuses && typeof tierBonuses === "object"
    ? (tierBonuses as Record<string, unknown>).kardashevLevel
    : undefined;
  return getKardashevOperationalBonuses(legacyLevel ?? 1);
}

export function countOwnedPlanets(
  knownPlanets: unknown,
  ownerId?: string,
  ownerName?: string,
): number {
  if (!Array.isArray(knownPlanets)) return 1;

  const ownedColonies = knownPlanets.filter((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const planet = entry as Record<string, unknown>;
    const hasExplicitOwner = "ownerId" in planet || "claimedBy" in planet || "claimedByName" in planet;
    if (ownerId || ownerName) {
      return (ownerId && (planet.ownerId === ownerId || planet.claimedBy === ownerId))
        || (ownerName && (planet.owner === ownerName || planet.claimedByName === ownerName))
        || (planet.owned === true && !hasExplicitOwner);
    }
    return planet.owned === true;
  }).length;

  return Math.max(1, ownedColonies + 1);
}
