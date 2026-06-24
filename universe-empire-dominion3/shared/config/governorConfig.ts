export type GovernorTrait =
  | "aggressive"
  | "economic"
  | "scientific"
  | "diplomatic"
  | "balanced"
  | "defensive"
  | "explorer";

export type GovernorAction =
  | "upgrade_mines"
  | "upgrade_energy"
  | "build_defenses"
  | "construct_ships"
  | "research_tech"
  | "trade_surplus"
  | "explore_nearby"
  | "fortify_planet"
  | "optimize_production"
  | "manage_colony";

export interface GovernorConfig {
  enabled: boolean;
  traits: GovernorTrait[];
  priorities: GovernorPriority[];
  restrictions: GovernorRestrictions;
  schedule: GovernorSchedule;
}

export interface GovernorPriority {
  category: string;
  weight: number;
  condition?: string;
}

export interface GovernorRestrictions {
  maxSpendPerTick: { metal: number; crystal: number; deuterium: number };
  neverAttack: boolean;
  neverTrade: boolean;
  keepReserve: { metal: number; crystal: number; deuterium: number; credits: number };
  maxShipBuildPerCycle: number;
  minDefenseLevel: number;
}

export interface GovernorSchedule {
  checkIntervalMs: number;
  activeHours?: { start: number; end: number };
  pauseOnLowResources: boolean;
  lowResourceThreshold: number;
}

export interface GovernorDecision {
  timestamp: number;
  action: GovernorAction;
  reason: string;
  cost: { metal: number; crystal: number; deuterium: number };
  target?: string;
  expectedBenefit: string;
  confidence: number;
}

export interface GovernorState {
  userId: string;
  planetId: string;
  active: boolean;
  traits: GovernorTrait[];
  priorities: GovernorPriority[];
  restrictions: GovernorRestrictions;
  schedule: GovernorSchedule;
  decisionLog: GovernorDecision[];
  stats: GovernorStats;
  autoMode: boolean;
}

export interface GovernorStats {
  totalDecisions: number;
  actionsPerformed: number;
  resourcesSaved: number;
  buildingsUpgraded: number;
  shipsBuilt: number;
  researchCompleted: number;
  tradesExecuted: number;
  defensesBuilt: number;
  totalValueGenerated: number;
  uptime: number;
  lastDecisionAt?: number;
}

const TRAIT_MODIFIERS: Record<GovernorTrait, Record<string, number>> = {
  aggressive: { build_defenses: 1.5, construct_ships: 1.8, research_tech: 0.7, trade_surplus: 0.5, explore_nearby: 0.8 },
  economic: { upgrade_mines: 1.8, upgrade_energy: 1.5, trade_surplus: 2.0, optimize_production: 2.0, research_tech: 0.8 },
  scientific: { research_tech: 2.5, upgrade_mines: 0.7, construct_ships: 0.6, trade_surplus: 0.8, explore_nearby: 1.2 },
  diplomatic: { trade_surplus: 2.0, explore_nearby: 1.5, research_tech: 1.0, build_defenses: 0.8, construct_ships: 0.7 },
  balanced: { upgrade_mines: 1.0, upgrade_energy: 1.0, build_defenses: 1.0, construct_ships: 1.0, research_tech: 1.0 },
  defensive: { build_defenses: 2.5, fortify_planet: 2.0, construct_ships: 1.2, upgrade_mines: 0.8, explore_nearby: 0.5 },
  explorer: { explore_nearby: 2.5, research_tech: 1.5, trade_surplus: 1.2, upgrade_mines: 0.7, build_defenses: 0.6 },
};

const BUILDING_PRIORITY: Record<string, number> = {
  metalMine: 10,
  crystalMine: 9,
  deuteriumSynthesizer: 8,
  solarPlant: 10,
  researchLab: 7,
  shipyard: 6,
  navalAcademy: 5,
  supplyDepot: 8,
  orbitalDock: 4,
  terraformingStation: 3,
  tradeCenter: 6,
  militaryAcademy: 5,
  warpGate: 2,
  roboticsFactory: 7,
};

export function createDefaultGovernor(userId: string, planetId: string): GovernorState {
  return {
    userId,
    planetId,
    active: false,
    traits: ["balanced"],
    priorities: [
      { category: "economy", weight: 3 },
      { category: "military", weight: 2 },
      { category: "research", weight: 2 },
      { category: "defense", weight: 1 },
      { category: "exploration", weight: 1 },
    ],
    restrictions: {
      maxSpendPerTick: { metal: 100000, crystal: 50000, deuterium: 20000 },
      neverAttack: false,
      neverTrade: false,
      keepReserve: { metal: 10000, crystal: 5000, deuterium: 2000, credits: 5000 },
      maxShipBuildPerCycle: 10,
      minDefenseLevel: 5,
    },
    schedule: {
      checkIntervalMs: 60000,
      pauseOnLowResources: true,
      lowResourceThreshold: 1000,
    },
    decisionLog: [],
    stats: {
      totalDecisions: 0,
      actionsPerformed: 0,
      resourcesSaved: 0,
      buildingsUpgraded: 0,
      shipsBuilt: 0,
      researchCompleted: 0,
      tradesExecuted: 0,
      defensesBuilt: 0,
      totalValueGenerated: 0,
      uptime: 0,
    },
    autoMode: true,
  };
}

export function evaluateGovernorDecision(
  state: GovernorState,
  resources: Record<string, number>,
  buildings: Record<string, number>,
  research: Record<string, number>,
  units: Record<string, number>,
  queue: any[]
): GovernorDecision | null {
  if (!state.active || !state.autoMode) return null;

  const reserved = state.restrictions.keepReserve;
  const available = {
    metal: Math.max(0, (resources.metal || 0) - reserved.metal),
    crystal: Math.max(0, (resources.crystal || 0) - reserved.crystal),
    deuterium: Math.max(0, (resources.deuterium || 0) - reserved.deuterium),
    credits: Math.max(0, (resources.credits || 0) - reserved.credits),
  };

  if (state.schedule.pauseOnLowResources) {
    const minAvail = Math.min(available.metal, available.crystal, available.deuterium);
    if (minAvail < state.schedule.lowResourceThreshold) return null;
  }

  if (queue.length > 0) return null;

  const candidates: { action: GovernorAction; score: number; reason: string; cost: { metal: number; crystal: number; deuterium: number }; target?: string; benefit: string }[] = [];

  for (const [building, currentLevel] of Object.entries(buildings)) {
    const basePriority = BUILDING_PRIORITY[building] || 5;
    const traitMod = state.traits.reduce((mod, trait) => {
      const traitMap = TRAIT_MODIFIERS[trait];
      return mod * (traitMap.upgrade_mines || 1);
    }, 1);
    const priorityMod = state.priorities.find(p => p.category === "economy")?.weight || 1;

    const cost = calculateBuildingGovernorCost(building, currentLevel);
    if (cost.metal <= available.metal && cost.crystal <= available.crystal && cost.deuterium <= available.deuterium) {
      candidates.push({
        action: "upgrade_mines",
        score: basePriority * traitMod * priorityMod,
        reason: `Upgrade ${building} to level ${currentLevel + 1}`,
        cost,
        target: building,
        benefit: `Increased production from ${building}`,
      });
    }
  }

  const totalShips = Object.values(units).reduce((sum: number, count) => sum + (count as number), 0);
  if (totalShips < 50) {
    const shipTypes = ["lightFighter", "heavyFighter", "cruiser"];
    for (const shipType of shipTypes) {
      const cost = { metal: 3000, crystal: 1000, deuterium: 200 };
      if (cost.metal <= available.metal && cost.crystal <= available.crystal && cost.deuterium <= available.deuterium) {
        candidates.push({
          action: "construct_ships",
          score: 8 * state.traits.reduce((m, t) => m * (TRAIT_MODIFIERS[t].construct_ships || 1), 1),
          reason: `Build ${shipType} — fleet too small`,
          cost,
          target: shipType,
          benefit: `Stronger fleet`,
        });
        break;
      }
    }
  }

  if (Object.keys(research).length < 10) {
    const cost = { metal: 5000, crystal: 2500, deuterium: 1000 };
    if (cost.metal <= available.metal && cost.crystal <= available.crystal && cost.deuterium <= available.deuterium) {
      candidates.push({
        action: "research_tech",
        score: 7 * state.traits.reduce((m, t) => m * (TRAIT_MODIFIERS[t].research_tech || 1), 1),
        reason: "Research next available technology",
        cost,
        benefit: "Unlock new capabilities",
      });
    }
  }

  const defenseLevel = (buildings.orbitalDock || 0) + (buildings.militaryAcademy || 0);
  if (defenseLevel < state.restrictions.minDefenseLevel) {
    const cost = { metal: 8000, crystal: 4000, deuterium: 2000 };
    if (cost.metal <= available.metal && cost.crystal <= available.crystal && cost.deuterium <= available.deuterium) {
      candidates.push({
        action: "build_defenses",
        score: 9 * state.traits.reduce((m, t) => m * (TRAIT_MODIFIERS[t].build_defenses || 1), 1),
        reason: "Build defensive structures — below minimum defense level",
        cost,
        benefit: "Improved planetary defense",
      });
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  return {
    timestamp: Date.now(),
    action: best.action,
    reason: best.reason,
    cost: best.cost,
    target: best.target,
    expectedBenefit: best.benefit,
    confidence: Math.min(0.95, best.score / 20),
  };
}

function calculateBuildingGovernorCost(buildingType: string, currentLevel: number): { metal: number; crystal: number; deuterium: number } {
  const baseCosts: Record<string, { metal: number; crystal: number; deuterium: number }> = {
    metalMine: { metal: 60, crystal: 15, deuterium: 0 },
    crystalMine: { metal: 48, crystal: 24, deuterium: 0 },
    deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0 },
    solarPlant: { metal: 75, crystal: 30, deuterium: 0 },
    roboticsFactory: { metal: 400, crystal: 120, deuterium: 200 },
    shipyard: { metal: 400, crystal: 200, deuterium: 100 },
    researchLab: { metal: 200, crystal: 400, deuterium: 200 },
    navalAcademy: { metal: 300, crystal: 150, deuterium: 80 },
    supplyDepot: { metal: 150, crystal: 75, deuterium: 0 },
    orbitalDock: { metal: 500, crystal: 250, deuterium: 150 },
    terraformingStation: { metal: 800, crystal: 400, deuterium: 300 },
    tradeCenter: { metal: 200, crystal: 100, deuterium: 50 },
    militaryAcademy: { metal: 350, crystal: 175, deuterium: 100 },
    warpGate: { metal: 1000, crystal: 500, deuterium: 250 },
  };

  const base = baseCosts[buildingType] || { metal: 100, crystal: 50, deuterium: 0 };
  const factor = Math.pow(1.15, currentLevel);
  return {
    metal: Math.floor(base.metal * factor),
    crystal: Math.floor(base.crystal * factor),
    deuterium: Math.floor(base.deuterium * factor),
  };
}

export function getGovernorRecommendations(
  state: GovernorState,
  resources: Record<string, number>,
  buildings: Record<string, number>
): string[] {
  const recommendations: string[] = [];

  if (!state.active) {
    recommendations.push("Activate your Planetary Governor to automate colony management.");
  }

  const metalRate = resources.metal || 0;
  const crystalRate = resources.crystal || 0;
  if (metalRate < crystalRate * 0.5) {
    recommendations.push("Metal production is low relative to crystal. Upgrade Metal Mines.");
  }

  const energyProd = (buildings.solarPlant || 0) * 20;
  const energyCons = (buildings.metalMine || 0) * 10 + (buildings.crystalMine || 0) * 10;
  if (energyProd < energyCons) {
    recommendations.push("Energy deficit detected. Build more Solar Plants.");
  }

  if ((buildings.shipyard || 0) < 3) {
    recommendations.push("Shipyard level is low. Upgrade to unlock advanced ships.");
  }

  if ((buildings.researchLab || 0) < 2) {
    recommendations.push("Research Lab level is low. Upgrade to unlock more technologies.");
  }

  const totalUnits = Object.values(resources).reduce((s: number, v) => s + (typeof v === "number" ? v : 0), 0);
  if (totalUnits < 10000) {
    recommendations.push("Resource reserves are building up. Consider upgrading mines or building ships.");
  }

  return recommendations;
}
