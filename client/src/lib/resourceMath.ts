import {
  calculateManagedStorageCapacities,
  calculateResourceEconomy,
  calculateManagedStorageCapacity,
  type ManagedResourceId,
} from "@shared/config/resourceManagement";

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

export function calculateResourceProduction(buildings: BuildingLevels | object, bonusMultiplier: number = 1) {
  return calculateResourceEconomy(buildings as Record<string, unknown>, {}, bonusMultiplier);
}

export function calculateStorageCapacity(baseCapacity: number, level: unknown): number {
  const safeLevel = Math.min(normalizeLevel(level), 50);
  return Math.floor(baseCapacity * Math.pow(1.5, safeLevel));
}

export function calculateManagedCapacities(buildings: BuildingLevels | object): Record<ManagedResourceId, number> {
  return calculateManagedStorageCapacities(buildings as Record<string, unknown>);
}

export function calculateManagedCapacity(resourceId: ManagedResourceId, buildings: BuildingLevels | object): number {
  return calculateManagedStorageCapacity(resourceId, buildings as Record<string, unknown>);
}
