export interface BuildingCostFormula {
  baseMetal: number;
  baseCrystal: number;
  baseDeuterium: number;
  growthRate: number;
}

export interface ProductionFormula {
  baseProduction: number;
  productionFactor: number;
}

export const OGame_BUILDING_FORMULAS: Record<string, BuildingCostFormula> = {
  'metal-mine': { baseMetal: 60, baseCrystal: 15, baseDeuterium: 0, growthRate: 1.5 },
  'crystal-mine': { baseMetal: 48, baseCrystal: 24, baseDeuterium: 0, growthRate: 1.6 },
  'deuterium-synthesizer': { baseMetal: 225, baseCrystal: 75, baseDeuterium: 0, growthRate: 1.5 },
  'solar-plant': { baseMetal: 75, baseCrystal: 30, baseDeuterium: 0, growthRate: 1.5 },
  'fusion-reactor': { baseMetal: 900, baseCrystal: 360, baseDeuterium: 180, growthRate: 1.8 },
  'robotics-factory': { baseMetal: 400, baseCrystal: 120, baseDeuterium: 200, growthRate: 2.0 },
  'shipyard': { baseMetal: 400, baseCrystal: 200, baseDeuterium: 100, growthRate: 2.0 },
  'research-lab': { baseMetal: 200, baseCrystal: 400, baseDeuterium: 200, growthRate: 2.0 },
  'alliance-depot': { baseMetal: 20000, baseCrystal: 40000, baseDeuterium: 0, growthRate: 2.0 },
  'missile-silo': { baseMetal: 20000, baseCrystal: 20000, baseDeuterium: 1000, growthRate: 2.0 },
  'nanite-factory': { baseMetal: 1000000, baseCrystal: 500000, baseDeuterium: 100000, growthRate: 2.0 },
  'terraformer': { baseMetal: 0, baseCrystal: 50000, baseDeuterium: 100000, growthRate: 2.0 },
  'space-dock': { baseMetal: 200, baseCrystal: 0, baseDeuterium: 50, growthRate: 1.5 },
};

export const OGame_PRODUCTION_FORMULAS: Record<string, ProductionFormula> = {
  'metal-mine': { baseProduction: 30, productionFactor: 1.1 },
  'crystal-mine': { baseProduction: 20, productionFactor: 1.1 },
  'deuterium-synthesizer': { baseProduction: 10, productionFactor: 1.1 },
  'solar-plant': { baseProduction: 20, productionFactor: 1.1 },
  'fusion-reactor': { baseProduction: 50, productionFactor: 1.2 },
};

export function calculateBuildingCost(
  buildingId: string,
  level: number
): { metal: number; crystal: number; deuterium: number } {
  const formula = OGame_BUILDING_FORMULAS[buildingId];
  if (!formula) return { metal: 0, crystal: 0, deuterium: 0 };

  const multiplier = Math.pow(formula.growthRate, level - 1);
  return {
    metal: Math.floor(formula.baseMetal * multiplier),
    crystal: Math.floor(formula.baseCrystal * multiplier),
    deuterium: Math.floor(formula.baseDeuterium * multiplier),
  };
}

export function calculateBuildingProduction(
  buildingId: string,
  level: number,
  energyFactor: number = 1
): number {
  const formula = OGame_PRODUCTION_FORMULAS[buildingId];
  if (!formula) return 0;
  return Math.floor(formula.baseProduction * level * Math.pow(formula.productionFactor, level - 1) * energyFactor);
}

export function calculateBuildingCumulativeCost(
  buildingId: string,
  fromLevel: number,
  toLevel: number
): { metal: number; crystal: number; deuterium: number } {
  let total = { metal: 0, crystal: 0, deuterium: 0 };
  for (let lvl = fromLevel + 1; lvl <= toLevel; lvl++) {
    const cost = calculateBuildingCost(buildingId, lvl);
    total.metal += cost.metal;
    total.crystal += cost.crystal;
    total.deuterium += cost.deuterium;
  }
  return total;
}

export function calculateBuildingTime(
  costMetal: number,
  costCrystal: number,
  roboticsLevel: number,
  naniteLevel: number
): number {
  const totalCost = costMetal + costCrystal;
  const roboticsFactor = 1 + roboticsLevel;
  const naniteFactor = Math.pow(2, naniteLevel);
  return Math.floor((totalCost) / (roboticsFactor * naniteFactor * 2500));
}

export function calculateResearchTime(
  costMetal: number,
  costCrystal: number,
  researchLabLevel: number
): number {
  return Math.floor((costMetal + costCrystal) / (researchLabLevel * 1000));
}

export function calculateFleetScore(
  ships: Record<string, number>,
  shipCosts: Record<string, { metal: number; crystal: number }>
): number {
  let score = 0;
  for (const [shipId, count] of Object.entries(ships)) {
    const cost = shipCosts[shipId];
    if (cost) {
      score += (cost.metal + cost.crystal) * count;
    }
  }
  return Math.floor(score / 1000);
}

export function calculateDefenseScore(
  defenses: Record<string, number>,
  defenseCosts: Record<string, { metal: number; crystal: number }>
): number {
  let score = 0;
  for (const [defId, count] of Object.entries(defenses)) {
    const cost = defenseCosts[defId];
    if (cost) {
      score += (cost.metal + cost.crystal) * count;
    }
  }
  return Math.floor(score / 1000);
}

export function calculateResearchScore(
  researchLevels: Record<string, number>,
  researchCosts: Record<string, { metal: number; crystal: number }>
): number {
  let score = 0;
  for (const [techId, level] of Object.entries(researchLevels)) {
    const cost = researchCosts[techId];
    if (cost) {
      score += (cost.metal + cost.crystal) * level;
    }
  }
  return Math.floor(score / 1000);
}

export function calculateTotalEmpireScore(
  fleetScore: number,
  defenseScore: number,
  researchScore: number,
  buildingScore: number
): number {
  return fleetScore + defenseScore + researchScore + buildingScore;
}

export function calculateEnergyConsumption(
  buildingId: string,
  level: number
): number {
  const consumption: Record<string, number> = {
    'metal-mine': 10,
    'crystal-mine': 10,
    'deuterium-synthesizer': 20,
    'fusion-reactor': -50,
  };
  const base = consumption[buildingId];
  if (!base) return 0;
  return Math.floor(base * level * Math.pow(1.1, level - 1));
}

export function calculateAvailableEnergy(
  solarPlantLevel: number,
  fusionReactorLevel: number,
  solarSatelliteCount: number
): number {
  const solarProduction = solarPlantLevel > 0
    ? Math.floor(20 * solarPlantLevel * Math.pow(1.1, solarPlantLevel - 1))
    : 0;
  const fusionProduction = fusionReactorLevel > 0
    ? Math.floor(50 * fusionReactorLevel * Math.pow(1.2, fusionReactorLevel - 1))
    : 0;
  const satelliteProduction = solarSatelliteCount * 5;
  return solarProduction + fusionProduction + satelliteProduction;
}

export function calculateCargoCapacity(
  smallCargoCount: number,
  largeCargoCount: number
): number {
  return smallCargoCount * 5000 + largeCargoCount * 25000;
}

export function calculateFleetSpeed(
  baseSpeed: number,
  driveLevel: number,
  driveType: 'combustion' | 'impulse' | 'hyperspace'
): number {
  const driveBonuses: Record<string, number> = {
    combustion: 1 + driveLevel * 0.1,
    impulse: 1 + driveLevel * 0.2,
    hyperspace: 1 + driveLevel * 0.3,
  };
  return Math.floor(baseSpeed * (driveBonuses[driveType] || 1));
}

export function calculatePlanetFields(
  terraformerLevel: number,
  baseFields: number
): number {
  return baseFields + terraformerLevel * 5;
}
