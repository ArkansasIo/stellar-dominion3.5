import {
  MEGASTRUCTURE_CATEGORY_METADATA,
  type MegastructureClass,
} from "@shared/config/megastructuresConfig";

export interface MegastructureCategoryRequirements {
  kardashevLevel: number;
  totalResearch: number;
  totalTechnologyDivisions: number;
}

export interface MegastructureCategorySystem {
  id: string;
  category: MegastructureClass;
  label: string;
  description: string;
  doctrine: string;
  icon: string;
  order: number;
  requirements: MegastructureCategoryRequirements;
}

export interface MegastructureUpgradeSnapshot {
  maxLevel: number;
  buildTimeSeconds: number;
  cost: { metal: number; crystal: number; deuterium: number };
  currentBonus: number;
  nextBonus: number;
}

const CATEGORY_DOCTRINES: Record<MegastructureClass, { doctrine: string; icon: string }> = {
  infrastructure: { doctrine: "Build the backbone that keeps star-spanning industry online.", icon: "network" },
  production: { doctrine: "Convert mass, energy, and logistics into overwhelming output.", icon: "factory" },
  research: { doctrine: "Feed every megaproject with relentless scientific acceleration.", icon: "flask" },
  defense: { doctrine: "Harden the empire against siege, collapse, and attrition.", icon: "shield" },
  mobility: { doctrine: "Shrink distance so empire response stays faster than threat growth.", icon: "rocket" },
  exotic: { doctrine: "Operationalize unstable physics into repeatable strategic tools.", icon: "sparkles" },
  superweapon: { doctrine: "Make deterrence visible at interstellar scale.", icon: "crosshair" },
  civilization: { doctrine: "Scale population, culture, and governance into megastructure doctrine.", icon: "users" },
  economic: { doctrine: "Turn megastructures into engines of galactic wealth circulation.", icon: "coins" },
  diplomatic: { doctrine: "Bind influence and legitimacy to visible cosmic architecture.", icon: "handshake" },
  exploration: { doctrine: "Push the frontier outward with survey-grade mega-assets.", icon: "compass" },
  colonization: { doctrine: "Industrialize settlement and rapid planetary development.", icon: "globe" },
  communication: { doctrine: "Keep command fidelity intact across impossible distances.", icon: "radio" },
  surveillance: { doctrine: "See deep enough to act before rivals can pivot.", icon: "scan-search" },
  terraforming: { doctrine: "Reshape hostile worlds into loyal productive domains.", icon: "leaf" },
  ecological: { doctrine: "Preserve biospheres while scaling civilization throughput.", icon: "sprout" },
  temporal: { doctrine: "Use time-domain leverage to compress imperial response cycles.", icon: "clock-3" },
  "dimensional-forge": { doctrine: "Forge matter and structure across dimensional layers.", icon: "hexagon" },
};

export const MEGASTRUCTURE_CATEGORY_SYSTEMS: MegastructureCategorySystem[] = (
  Object.entries(MEGASTRUCTURE_CATEGORY_METADATA) as Array<
    [MegastructureClass, (typeof MEGASTRUCTURE_CATEGORY_METADATA)[MegastructureClass]]
  >
)
  .sort((left, right) => left[1].order - right[1].order)
  .map(([category, metadata]) => ({
    id: `megastructure-category-${category}`,
    category,
    label: metadata.label,
    description: metadata.description,
    doctrine: CATEGORY_DOCTRINES[category].doctrine,
    icon: CATEGORY_DOCTRINES[category].icon,
    order: metadata.order,
    requirements: {
      kardashevLevel: Math.max(1, Math.ceil(metadata.order / 2)),
      totalResearch: Math.max(0, metadata.order * 2 - 2),
      totalTechnologyDivisions: Math.max(0, metadata.order - 1),
    },
  }));

export function getMegastructureUpgradeSnapshot(system: MegastructureCategorySystem, level: number): MegastructureUpgradeSnapshot {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  const orderWeight = Math.max(1, system.order);

  return {
    maxLevel: 12,
    buildTimeSeconds: Math.floor((70 + orderWeight * 9) * (1 + safeLevel * 0.18)),
    cost: {
      metal: Math.floor(650 * orderWeight * Math.pow(1.58, safeLevel)),
      crystal: Math.floor(460 * orderWeight * Math.pow(1.54, safeLevel)),
      deuterium: Math.floor(320 * orderWeight * Math.pow(1.5, safeLevel)),
    },
    currentBonus: safeLevel * (2 + Math.floor(orderWeight / 3)),
    nextBonus: (safeLevel + 1) * (2 + Math.floor(orderWeight / 3)),
  };
}
