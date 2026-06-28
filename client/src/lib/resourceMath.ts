type BuildingLevels = {
  metalMine?: number;
  crystalMine?: number;
  deuteriumSynthesizer?: number;
  solarPlant?: number;
};

function normalizeLevel(value: unknown): number {
  const level = Math.floor(Number(value) || 0);
  if (!Number.isFinite(level) || level < 0) {
    return 0;
  }
  return level;
}

export function calculateMineProductionPerHour(
  level: unknown,
  baseRate: number,
  scalingDivisor: number,
  bonusMultiplier: number = 1,
): number {
  const safeLevel = normalizeLevel(level);
  return Math.floor(baseRate * safeLevel * (1 + safeLevel / scalingDivisor) * bonusMultiplier);
}

export function calculateSolarEnergyPerHour(level: unknown): number {
  const safeLevel = normalizeLevel(level);
  return Math.floor(20 * safeLevel * (1 + safeLevel / 10));
}

export function calculateResourceEnergyUse(level: unknown, baseCost: number): number {
  return Math.floor(baseCost * normalizeLevel(level));
}

export function calculateResourceProduction(buildings: BuildingLevels, bonusMultiplier: number = 1) {
  const metalMineLevel = normalizeLevel(buildings.metalMine);
  const crystalMineLevel = normalizeLevel(buildings.crystalMine);
  const deuteriumLevel = normalizeLevel(buildings.deuteriumSynthesizer);
  const solarPlantLevel = normalizeLevel(buildings.solarPlant);

  const metal = calculateMineProductionPerHour(metalMineLevel, 30, 10, bonusMultiplier);
  const crystal = calculateMineProductionPerHour(crystalMineLevel, 20, 10, bonusMultiplier);
  const deuterium = calculateMineProductionPerHour(deuteriumLevel, 10, 12, bonusMultiplier);
  const energyProduction = calculateSolarEnergyPerHour(solarPlantLevel);
  const energyConsumption =
    calculateResourceEnergyUse(metalMineLevel, 10) +
    calculateResourceEnergyUse(crystalMineLevel, 10) +
    calculateResourceEnergyUse(deuteriumLevel, 20);

  return {
    metal,
    crystal,
    deuterium,
    energy: energyProduction - energyConsumption,
  };
}

export function calculateStorageCapacity(baseCapacity: number, level: unknown): number {
  const safeLevel = Math.min(normalizeLevel(level), 50);
  return Math.floor(baseCapacity * Math.pow(1.5, safeLevel));
}
