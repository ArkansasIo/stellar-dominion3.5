export interface RefinerySystemDefinition {
  id: string;
  name: string;
  linkedBuilding: "metalMine" | "crystalMine" | "deuteriumSynthesizer";
  linkedLabel: string;
  imagePath: string;
  outputLabel: string;
  description: string;
  throughputFactor: number;
  baseEfficiency: number;
  stabilizationFactor: number;
  tone: {
    shell: string;
    badge: string;
    rate: string;
    accent: string;
  };
}

export interface RefineryUpgradeSnapshot {
  maxLevel: number;
  buildTimeSeconds: number;
  cost: { metal: number; crystal: number; deuterium: number };
  throughput: number;
  nextThroughput: number;
  efficiency: number;
  nextEfficiency: number;
  stabilization: number;
  nextStabilization: number;
}

export function getRefineryStage(level: number): string {
  if (level >= 12) return "Hyper-Refined";
  if (level >= 8) return "Deep Core";
  if (level >= 4) return "Industrial";
  if (level >= 1) return "Operational";
  return "Foundational";
}

export function getRefineryUpgradeSnapshot(
  system: RefinerySystemDefinition,
  level: number,
  linkedProduction: number,
): RefineryUpgradeSnapshot {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  const throughputMultiplier = 1 + safeLevel * 0.18;
  const nextMultiplier = 1 + (safeLevel + 1) * 0.18;

  return {
    maxLevel: 12,
    buildTimeSeconds: Math.floor((40 + safeLevel * 8) * (1 + safeLevel * 0.12)),
    cost: {
      metal: Math.floor(180 * Math.pow(1.65, safeLevel)),
      crystal: Math.floor(120 * Math.pow(1.6, safeLevel)),
      deuterium: Math.floor(80 * Math.pow(1.58, safeLevel)),
    },
    throughput: Math.floor(linkedProduction * system.throughputFactor * throughputMultiplier),
    nextThroughput: Math.floor(linkedProduction * system.throughputFactor * nextMultiplier),
    efficiency: Math.min(99, system.baseEfficiency + safeLevel * 4),
    nextEfficiency: Math.min(99, system.baseEfficiency + (safeLevel + 1) * 4),
    stabilization: Math.floor(linkedProduction * system.stabilizationFactor * throughputMultiplier),
    nextStabilization: Math.floor(linkedProduction * system.stabilizationFactor * nextMultiplier),
  };
}
