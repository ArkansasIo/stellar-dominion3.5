import { KARDASHEV_SCALE, type KardashevLevel } from "@/lib/kardashevScale";

export interface KardashevUpgradeRequirements {
  previousLevel?: KardashevLevel;
  totalResearch: number;
  totalInfrastructure: number;
  totalTechnologyDivisions: number;
  totalMegastructures: number;
}

export interface KardashevUpgradeSystem {
  id: string;
  level: KardashevLevel;
  title: string;
  focus: string;
  doctrine: string;
  description: string;
  requirements: KardashevUpgradeRequirements;
}

export interface KardashevUpgradeSnapshot {
  maxLevel: number;
  buildTimeSeconds: number;
  cost: { metal: number; crystal: number; deuterium: number };
  readinessBonus: number;
}

const KARDASHEV_FOCUS: Record<KardashevLevel, { title: string; focus: string; doctrine: string }> = {
  1: { title: "Settler Foundation", focus: "Colony survival and local extraction", doctrine: "Secure atmosphere, utilities, and first-wave industrial output." },
  2: { title: "Planetary Integration", focus: "Unify planetary industry and logistics", doctrine: "Link colony districts into a stable planetary command lattice." },
  3: { title: "System Sovereignty", focus: "Dominate the home star system", doctrine: "Project control across moons, stations, and resource nodes." },
  4: { title: "Cluster Consolidation", focus: "Expand beyond a single system", doctrine: "Standardize fleets and transit lanes between neighboring stars." },
  5: { title: "Sector Industrialization", focus: "Scale multi-system production", doctrine: "Convert regional supply chains into synchronized heavy industry." },
  6: { title: "Regional Hegemony", focus: "Secure diplomacy and deterrence", doctrine: "Use science, fleets, and commerce to anchor a regional sphere." },
  7: { title: "Galactic Logistics", focus: "Support large-scale imperial mobility", doctrine: "Maintain empire throughput while pressure rises across sectors." },
  8: { title: "Galactic Command", focus: "Coordinate vast interstellar domains", doctrine: "Turn distributed colonies into one responsive strategic organism." },
  9: { title: "Trans-Galactic Reach", focus: "Sustain operations across multiple galaxies", doctrine: "Elevate transit, communication, and planning to cosmic scale." },
  10: { title: "Universal Energy", focus: "Harvest stellar-class energy at scale", doctrine: "Fuse megastructure output with advanced theory and logistics." },
  11: { title: "Reality Systems", focus: "Manipulate high-order physical frameworks", doctrine: "Treat field control and dimensional engineering as civic utilities." },
  12: { title: "Cosmic Civilization", focus: "Balance population, war, and science", doctrine: "Operate a civilization whose footprint reshapes cosmic structures." },
  13: { title: "Existence Shaping", focus: "Engineer matter and causality", doctrine: "Use breakthrough systems to alter the environment of existence itself." },
  14: { title: "Hyperdimensional Command", focus: "Master cross-dimensional operations", doctrine: "Align strategic doctrine across parallel and nested realities." },
  15: { title: "Ascendant Intelligence", focus: "Merge cognition and empire systems", doctrine: "Embed intelligence layers into every industrial and strategic process." },
  16: { title: "Omniversal Reach", focus: "Operate across layered universes", doctrine: "Expand sovereignty into alternate continua without losing control." },
  17: { title: "Supreme Dominion", focus: "Consolidate total cosmic supremacy", doctrine: "Convert every unlocked system into an irreversible advantage." },
  18: { title: "Omnipotent Apex", focus: "Complete transcendence", doctrine: "Move from governing civilization to defining the rules of reality." },
};

export const KARDASHEV_UPGRADE_SYSTEMS: KardashevUpgradeSystem[] = (Object.values(KARDASHEV_SCALE) as Array<(typeof KARDASHEV_SCALE)[KardashevLevel]>).map((tier) => {
  const level = tier.level as KardashevLevel;
  const baseRequirements = Math.max(0, level - 1);

  return {
    id: `kardashev-tier-${level}`,
    level,
    title: KARDASHEV_FOCUS[level].title,
    focus: KARDASHEV_FOCUS[level].focus,
    doctrine: KARDASHEV_FOCUS[level].doctrine,
    description: tier.description,
    requirements: {
      previousLevel: level > 1 ? ((level - 1) as KardashevLevel) : undefined,
      totalResearch: level === 1 ? 0 : baseRequirements * 3,
      totalInfrastructure: level === 1 ? 0 : baseRequirements * 4,
      totalTechnologyDivisions: level === 1 ? 0 : Math.max(0, Math.floor((level - 1) * 1.5)),
      totalMegastructures: level <= 3 ? 0 : Math.floor((level - 2) / 2),
    },
  };
});

export function getKardashevUpgradeSnapshot(system: KardashevUpgradeSystem, currentLevel: number): KardashevUpgradeSnapshot {
  const safeLevel = Math.max(0, Math.floor(currentLevel || 0));
  const tierWeight = Math.max(0, system.level - 1);

  return {
    maxLevel: system.level === 1 ? 0 : 1,
    buildTimeSeconds: Math.floor(45 + tierWeight * 18),
    cost: {
      metal: Math.floor(900 * Math.pow(1.86, tierWeight)),
      crystal: Math.floor(700 * Math.pow(1.82, tierWeight)),
      deuterium: Math.floor(420 * Math.pow(1.78, tierWeight)),
    },
    readinessBonus: safeLevel > 0 ? 100 : Math.min(100, 18 + tierWeight * 4),
  };
}

export function getCurrentKardashevUpgradeLevel(levels: Record<string, number>): KardashevLevel {
  let currentLevel: KardashevLevel = 1;

  for (let level = 2; level <= 18; level += 1) {
    if ((levels[`kardashev-tier-${level}`] || 0) > 0) {
      currentLevel = level as KardashevLevel;
      continue;
    }
    break;
  }

  return currentLevel;
}
