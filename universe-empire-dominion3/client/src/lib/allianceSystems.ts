export const MAX_ALLIANCE_MEMBERS = 150;

type ResourceCost = {
  metal: number;
  crystal: number;
  deuterium: number;
  credits: number;
};

export type AllianceBonusProfile = {
  economyBoost: number;
  researchSpeed: number;
  fleetCoordination: number;
  defenseMatrix: number;
  diplomacyStrength: number;
  expeditionIntel: number;
};

export type AllianceUpgradeDefinition = {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  baseCost: ResourceCost;
  costScale: number;
  bonusesPerLevel: Partial<AllianceBonusProfile>;
};

export type AllianceResearchDefinition = {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  baseCost: ResourceCost;
  costScale: number;
  bonusesPerLevel: Partial<AllianceBonusProfile>;
};

export type AllianceTechnologyDefinition = {
  id: string;
  name: string;
  description: string;
  baseCost: ResourceCost;
  bonusUnlock: Partial<AllianceBonusProfile>;
};

export type AllianceSystemsState = {
  treasury: ResourceCost;
  upgrades: Record<string, number>;
  research: Record<string, number>;
  technologies: Record<string, boolean>;
  lastUpdatedAt: number;
};

export type AllianceSystemsSnapshot = {
  treasury: ResourceCost;
  upgrades: Array<AllianceUpgradeDefinition & { level: number; nextCost: ResourceCost | null }>;
  research: Array<AllianceResearchDefinition & { level: number; nextCost: ResourceCost | null }>;
  technologies: Array<AllianceTechnologyDefinition & { unlocked: boolean }>;
  bonuses: AllianceBonusProfile;
  memberCap: number;
};

const STORAGE_PREFIX = "stellar_alliance_systems";

const DEFAULT_TREASURY: ResourceCost = {
  metal: 350000,
  crystal: 280000,
  deuterium: 220000,
  credits: 180000,
};

const BASE_BONUSES: AllianceBonusProfile = {
  economyBoost: 0,
  researchSpeed: 0,
  fleetCoordination: 0,
  defenseMatrix: 0,
  diplomacyStrength: 0,
  expeditionIntel: 0,
};

const upgradeDefinitions: AllianceUpgradeDefinition[] = [
  {
    id: "command_nexus",
    name: "Command Nexus",
    description: "Synchronizes alliance command chains for stronger cross-system output.",
    maxLevel: 12,
    baseCost: { metal: 18000, crystal: 12000, deuterium: 9000, credits: 6000 },
    costScale: 1.32,
    bonusesPerLevel: { economyBoost: 0.8, diplomacyStrength: 0.4 },
  },
  {
    id: "fortress_grid",
    name: "Fortress Grid",
    description: "Connects planetary fortifications into a single defensive matrix.",
    maxLevel: 10,
    baseCost: { metal: 22000, crystal: 15000, deuterium: 14000, credits: 5000 },
    costScale: 1.35,
    bonusesPerLevel: { defenseMatrix: 1.0, fleetCoordination: 0.3 },
  },
  {
    id: "logistics_web",
    name: "Logistics Web",
    description: "Optimizes fleet refuel and transfer lanes across alliance territory.",
    maxLevel: 10,
    baseCost: { metal: 15000, crystal: 18000, deuterium: 13000, credits: 7000 },
    costScale: 1.34,
    bonusesPerLevel: { fleetCoordination: 0.9, expeditionIntel: 0.4 },
  },
];

const researchDefinitions: AllianceResearchDefinition[] = [
  {
    id: "collective_ai",
    name: "Collective AI Models",
    description: "Federated intelligence models that accelerate alliance breakthroughs.",
    maxLevel: 15,
    baseCost: { metal: 11000, crystal: 24000, deuterium: 16000, credits: 10000 },
    costScale: 1.3,
    bonusesPerLevel: { researchSpeed: 1.2, expeditionIntel: 0.3 },
  },
  {
    id: "quantum_treaties",
    name: "Quantum Treaty Simulation",
    description: "Predicts diplomatic responses and improves treaty outcomes.",
    maxLevel: 10,
    baseCost: { metal: 10000, crystal: 14000, deuterium: 12000, credits: 9000 },
    costScale: 1.28,
    bonusesPerLevel: { diplomacyStrength: 1.0, economyBoost: 0.5 },
  },
  {
    id: "deep_range_cartography",
    name: "Deep-Range Cartography",
    description: "Alliance-wide maps for expedition route safety and target quality.",
    maxLevel: 12,
    baseCost: { metal: 13000, crystal: 17000, deuterium: 18000, credits: 8000 },
    costScale: 1.31,
    bonusesPerLevel: { expeditionIntel: 1.1, fleetCoordination: 0.4 },
  },
];

const technologyDefinitions: AllianceTechnologyDefinition[] = [
  {
    id: "stellar_trade_web",
    name: "Stellar Trade Web",
    description: "Unlocks synchronized trade convoys across member empires.",
    baseCost: { metal: 70000, crystal: 52000, deuterium: 28000, credits: 42000 },
    bonusUnlock: { economyBoost: 6 },
  },
  {
    id: "phalanx_harmonics",
    name: "Phalanx Harmonics",
    description: "Enables precision fleet harmonics during alliance engagements.",
    baseCost: { metal: 64000, crystal: 58000, deuterium: 36000, credits: 30000 },
    bonusUnlock: { fleetCoordination: 5, defenseMatrix: 4 },
  },
  {
    id: "diplomatic_entanglement",
    name: "Diplomatic Entanglement",
    description: "Instant treaty relays improve alliance diplomatic leverage.",
    baseCost: { metal: 46000, crystal: 62000, deuterium: 32000, credits: 48000 },
    bonusUnlock: { diplomacyStrength: 8, researchSpeed: 2 },
  },
];

function getStorageKey(allianceId: string): string {
  return `${STORAGE_PREFIX}:${allianceId}`;
}

function multiplyCost(baseCost: ResourceCost, level: number, scale: number): ResourceCost {
  const multiplier = Math.pow(scale, level);
  return {
    metal: Math.round(baseCost.metal * multiplier),
    crystal: Math.round(baseCost.crystal * multiplier),
    deuterium: Math.round(baseCost.deuterium * multiplier),
    credits: Math.round(baseCost.credits * multiplier),
  };
}

function canAfford(treasury: ResourceCost, cost: ResourceCost): boolean {
  return (
    treasury.metal >= cost.metal &&
    treasury.crystal >= cost.crystal &&
    treasury.deuterium >= cost.deuterium &&
    treasury.credits >= cost.credits
  );
}

function subtractCost(treasury: ResourceCost, cost: ResourceCost): ResourceCost {
  return {
    metal: treasury.metal - cost.metal,
    crystal: treasury.crystal - cost.crystal,
    deuterium: treasury.deuterium - cost.deuterium,
    credits: treasury.credits - cost.credits,
  };
}

function buildDefaultState(): AllianceSystemsState {
  return {
    treasury: { ...DEFAULT_TREASURY },
    upgrades: Object.fromEntries(upgradeDefinitions.map((item) => [item.id, 0])),
    research: Object.fromEntries(researchDefinitions.map((item) => [item.id, 0])),
    technologies: Object.fromEntries(technologyDefinitions.map((item) => [item.id, false])),
    lastUpdatedAt: Date.now(),
  };
}

function readState(allianceId: string): AllianceSystemsState {
  if (typeof window === "undefined") {
    return buildDefaultState();
  }

  const raw = localStorage.getItem(getStorageKey(allianceId));
  if (!raw) {
    return buildDefaultState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AllianceSystemsState>;
    const baseline = buildDefaultState();
    return {
      treasury: {
        metal: Number(parsed.treasury?.metal ?? baseline.treasury.metal),
        crystal: Number(parsed.treasury?.crystal ?? baseline.treasury.crystal),
        deuterium: Number(parsed.treasury?.deuterium ?? baseline.treasury.deuterium),
        credits: Number(parsed.treasury?.credits ?? baseline.treasury.credits),
      },
      upgrades: {
        ...baseline.upgrades,
        ...(parsed.upgrades || {}),
      },
      research: {
        ...baseline.research,
        ...(parsed.research || {}),
      },
      technologies: {
        ...baseline.technologies,
        ...(parsed.technologies || {}),
      },
      lastUpdatedAt: Number(parsed.lastUpdatedAt ?? Date.now()),
    };
  } catch {
    return buildDefaultState();
  }
}

function writeState(allianceId: string, state: AllianceSystemsState): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(getStorageKey(allianceId), JSON.stringify(state));
}

function withUpdate(allianceId: string, updater: (state: AllianceSystemsState) => AllianceSystemsState): AllianceSystemsState {
  const current = readState(allianceId);
  const next = updater(current);
  next.lastUpdatedAt = Date.now();
  writeState(allianceId, next);
  return next;
}

export function getAllianceSystemsSnapshot(allianceId: string): AllianceSystemsSnapshot {
  const state = readState(allianceId);
  const bonuses: AllianceBonusProfile = { ...BASE_BONUSES };

  const upgrades = upgradeDefinitions.map((definition) => {
    const level = Math.max(0, Math.min(definition.maxLevel, Number(state.upgrades[definition.id] || 0)));
    Object.entries(definition.bonusesPerLevel).forEach(([key, bonus]) => {
      bonuses[key as keyof AllianceBonusProfile] += Number(bonus || 0) * level;
    });

    return {
      ...definition,
      level,
      nextCost: level >= definition.maxLevel ? null : multiplyCost(definition.baseCost, level, definition.costScale),
    };
  });

  const research = researchDefinitions.map((definition) => {
    const level = Math.max(0, Math.min(definition.maxLevel, Number(state.research[definition.id] || 0)));
    Object.entries(definition.bonusesPerLevel).forEach(([key, bonus]) => {
      bonuses[key as keyof AllianceBonusProfile] += Number(bonus || 0) * level;
    });

    return {
      ...definition,
      level,
      nextCost: level >= definition.maxLevel ? null : multiplyCost(definition.baseCost, level, definition.costScale),
    };
  });

  const technologies = technologyDefinitions.map((definition) => {
    const unlocked = !!state.technologies[definition.id];
    if (unlocked) {
      Object.entries(definition.bonusUnlock).forEach(([key, bonus]) => {
        bonuses[key as keyof AllianceBonusProfile] += Number(bonus || 0);
      });
    }

    return {
      ...definition,
      unlocked,
    };
  });

  return {
    treasury: state.treasury,
    upgrades,
    research,
    technologies,
    bonuses,
    memberCap: MAX_ALLIANCE_MEMBERS,
  };
}

export function fundAllianceTreasury(allianceId: string, contribution: Partial<ResourceCost>): AllianceSystemsSnapshot {
  withUpdate(allianceId, (state) => ({
    ...state,
    treasury: {
      metal: state.treasury.metal + Math.max(0, Number(contribution.metal || 0)),
      crystal: state.treasury.crystal + Math.max(0, Number(contribution.crystal || 0)),
      deuterium: state.treasury.deuterium + Math.max(0, Number(contribution.deuterium || 0)),
      credits: state.treasury.credits + Math.max(0, Number(contribution.credits || 0)),
    },
  }));

  return getAllianceSystemsSnapshot(allianceId);
}

export function upgradeAllianceSystem(allianceId: string, upgradeId: string): AllianceSystemsSnapshot {
  withUpdate(allianceId, (state) => {
    const definition = upgradeDefinitions.find((entry) => entry.id === upgradeId);
    if (!definition) {
      throw new Error("Upgrade not found");
    }

    const currentLevel = Math.max(0, Math.min(definition.maxLevel, Number(state.upgrades[upgradeId] || 0)));
    if (currentLevel >= definition.maxLevel) {
      throw new Error("Upgrade is already at max level");
    }

    const cost = multiplyCost(definition.baseCost, currentLevel, definition.costScale);
    if (!canAfford(state.treasury, cost)) {
      throw new Error("Alliance treasury lacks required resources");
    }

    return {
      ...state,
      treasury: subtractCost(state.treasury, cost),
      upgrades: {
        ...state.upgrades,
        [upgradeId]: currentLevel + 1,
      },
    };
  });

  return getAllianceSystemsSnapshot(allianceId);
}

export function researchAllianceSystem(allianceId: string, researchId: string): AllianceSystemsSnapshot {
  withUpdate(allianceId, (state) => {
    const definition = researchDefinitions.find((entry) => entry.id === researchId);
    if (!definition) {
      throw new Error("Research track not found");
    }

    const currentLevel = Math.max(0, Math.min(definition.maxLevel, Number(state.research[researchId] || 0)));
    if (currentLevel >= definition.maxLevel) {
      throw new Error("Research is already maxed");
    }

    const cost = multiplyCost(definition.baseCost, currentLevel, definition.costScale);
    if (!canAfford(state.treasury, cost)) {
      throw new Error("Alliance treasury lacks required resources");
    }

    return {
      ...state,
      treasury: subtractCost(state.treasury, cost),
      research: {
        ...state.research,
        [researchId]: currentLevel + 1,
      },
    };
  });

  return getAllianceSystemsSnapshot(allianceId);
}

export function unlockAllianceTechnology(allianceId: string, technologyId: string): AllianceSystemsSnapshot {
  withUpdate(allianceId, (state) => {
    const definition = technologyDefinitions.find((entry) => entry.id === technologyId);
    if (!definition) {
      throw new Error("Technology not found");
    }

    if (state.technologies[technologyId]) {
      throw new Error("Technology already unlocked");
    }

    if (!canAfford(state.treasury, definition.baseCost)) {
      throw new Error("Alliance treasury lacks required resources");
    }

    return {
      ...state,
      treasury: subtractCost(state.treasury, definition.baseCost),
      technologies: {
        ...state.technologies,
        [technologyId]: true,
      },
    };
  });

  return getAllianceSystemsSnapshot(allianceId);
}
