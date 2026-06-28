export type ResourcePool = {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  credits: number;
  food: number;
  water: number;
};

type ExpeditionPayload = {
  id: string;
  name: string;
  type: string;
  subType?: string | null;
  categoryId?: string | null;
  subCategoryId?: string | null;
  tier?: number;
  level?: number;
  rank?: string | null;
  title?: string | null;
  targetCoordinates?: string;
  fleetComposition?: Record<string, number>;
  troopComposition?: Record<string, number>;
};

function toFiniteNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeResources(raw: any): ResourcePool {
  return {
    metal: Math.max(0, toFiniteNumber(raw?.metal)),
    crystal: Math.max(0, toFiniteNumber(raw?.crystal)),
    deuterium: Math.max(0, toFiniteNumber(raw?.deuterium)),
    energy: toFiniteNumber(raw?.energy),
    credits: Math.max(0, toFiniteNumber(raw?.credits)),
    food: Math.max(0, toFiniteNumber(raw?.food)),
    water: Math.max(0, toFiniteNumber(raw?.water)),
  };
}

export function applyResourceDelta(resources: ResourcePool, delta: Partial<ResourcePool>): ResourcePool {
  return {
    ...resources,
    metal: Math.max(0, resources.metal + toFiniteNumber(delta.metal)),
    crystal: Math.max(0, resources.crystal + toFiniteNumber(delta.crystal)),
    deuterium: Math.max(0, resources.deuterium + toFiniteNumber(delta.deuterium)),
    energy: resources.energy + toFiniteNumber(delta.energy),
    credits: Math.max(0, resources.credits + toFiniteNumber(delta.credits)),
    food: Math.max(0, resources.food + toFiniteNumber(delta.food)),
    water: Math.max(0, resources.water + toFiniteNumber(delta.water)),
  };
}

export function buildExplorationState(raw: any): { claimedQuestIds: string[]; harvestedDebrisIds: string[] } {
  return {
    claimedQuestIds: Array.isArray(raw?.claimedQuestIds) ? raw.claimedQuestIds.slice(0, 500) : [],
    harvestedDebrisIds: Array.isArray(raw?.harvestedDebrisIds) ? raw.harvestedDebrisIds.slice(0, 500) : [],
  };
}

export function normalizeUnitMap(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const entries = Object.entries(raw as Record<string, unknown>)
    .map(([key, value]): [string, number] => [key, Math.max(0, Math.floor(toFiniteNumber(value)))])
    .filter(([, value]) => value > 0);

  return Object.fromEntries(entries);
}

function totalUnits(units: Record<string, number>): number {
  return Object.values(units).reduce((sum, value) => sum + value, 0);
}

export function createStarterRelic(userId: string) {
  return {
    id: `owned-${userId}-starter`,
    relicId: "relic-3",
    name: "Stellar Shard",
    condition: 90,
    isEquipped: false,
    acquiredAt: new Date().toISOString(),
  };
}

export function createExpeditionRecord(payload: ExpeditionPayload) {
  return {
    id: payload.id,
    name: payload.name,
    type: payload.type,
    subType: payload.subType ?? null,
    categoryId: payload.categoryId ?? null,
    subCategoryId: payload.subCategoryId ?? null,
    tier: Math.max(1, Math.min(99, Math.floor(toFiniteNumber(payload.tier, 1)))),
    level: Math.max(1, Math.min(999, Math.floor(toFiniteNumber(payload.level, 1)))),
    rank: payload.rank ?? null,
    title: payload.title ?? null,
    targetCoordinates: payload.targetCoordinates || "0:0:0",
    status: "preparing",
    fleetComposition: normalizeUnitMap(payload.fleetComposition),
    troopComposition: normalizeUnitMap(payload.troopComposition),
    discoveries: [] as string[],
    casualties: {} as Record<string, number>,
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    rewards: { xp: 0, credits: 0 },
    startedAt: new Date().toISOString(),
    launchedAt: null as string | null,
    completedAt: null as string | null,
  };
}

export function resolveExpeditionRecord(expedition: any) {
  const tier = Math.max(1, Math.min(99, Math.floor(toFiniteNumber(expedition?.tier, 1))));
  const level = Math.max(1, Math.min(999, Math.floor(toFiniteNumber(expedition?.level, 1))));
  const fleetComposition = normalizeUnitMap(expedition?.fleetComposition);
  const troopComposition = normalizeUnitMap(expedition?.troopComposition);
  const fleetPower = totalUnits(fleetComposition);
  const troopPower = totalUnits(troopComposition);
  const strength = fleetPower * 3 + troopPower * 2 + tier * 12 + level;
  const successThreshold = tier * 18 + level * 2;
  const success = strength >= successThreshold;

  const resources = {
    metal: Math.max(100, tier * 180 + level * 10 + fleetPower * 8),
    crystal: Math.max(80, tier * 130 + level * 7 + troopPower * 6),
    deuterium: Math.max(40, tier * 90 + level * 5 + Math.floor((fleetPower + troopPower) * 3)),
  };

  const rewards = {
    xp: tier * 25 + Math.floor(level / 2) + fleetPower * 4 + troopPower * 3,
    credits: tier * 40 + level * 2,
  };

  const casualties: Record<string, number> = {};
  const casualtyRatio = success ? 0.04 : 0.12;

  for (const [unitId, quantity] of Object.entries({ ...fleetComposition, ...troopComposition })) {
    casualties[unitId] = Math.min(quantity, Math.floor(quantity * casualtyRatio));
  }

  const discoveryPool = [
    "Ancient star charts",
    "Derelict supply cache",
    "Encrypted alien telemetry",
    "Rare crystalline vein",
    "Prototype warp lattice",
  ];

  const discoveries = discoveryPool.slice(0, Math.min(3, 1 + Math.floor(tier / 25)));

  return {
    ...expedition,
    status: success ? "completed" : "failed",
    discoveries,
    casualties,
    resources,
    rewards,
    completedAt: new Date().toISOString(),
  };
}
