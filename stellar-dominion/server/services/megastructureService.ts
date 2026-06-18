import {
  MEGASTRUCTURES,
  createMegastructure,
  calculateMegastructureConstructionCost,
  calculateMegastructureUpgradeCost,
  getMegastructureCatalogByCategory,
  getMegastructureTierFromLevel,
  type MegastructureCost,
} from "@shared/config/megastructuresConfig";
import type { MegaStructure } from "@shared/schema";
import { storage } from "../storage";

type ResourcePool = {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
};

type ConstructMegastructureInput = {
  templateId: string;
  name?: string;
  level?: number;
  tier?: number;
  coordinates?: string;
};

const KIND_BY_CLASS: Record<string, string> = {
  superweapon: "weapon",
  infrastructure: "habitation",
  research: "research",
  production: "industrial",
  defense: "defense",
  mobility: "interstellar",
  exotic: "experimental",
};

function toNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeResources(resources: any): ResourcePool {
  return {
    metal: toNumber(resources?.metal),
    crystal: toNumber(resources?.crystal),
    deuterium: toNumber(resources?.deuterium),
    energy: toNumber(resources?.energy),
  };
}

function hasEnoughResources(resources: ResourcePool, cost: MegastructureCost): boolean {
  return (
    resources.metal >= cost.metal &&
    resources.crystal >= cost.crystal &&
    resources.deuterium >= cost.deuterium &&
    resources.energy >= cost.energy
  );
}

function deductResources(resources: ResourcePool, cost: MegastructureCost): ResourcePool {
  return {
    metal: Math.max(0, resources.metal - cost.metal),
    crystal: Math.max(0, resources.crystal - cost.crystal),
    deuterium: Math.max(0, resources.deuterium - cost.deuterium),
    energy: Math.max(0, resources.energy - cost.energy),
  };
}

function getTemplateById(templateId: string) {
  return MEGASTRUCTURES.find(template => template.id === templateId);
}

function resolveTemplateFromStructure(structure: MegaStructure) {
  const details = (structure.details as any) || {};
  const templateId = typeof details.templateId === "string" ? details.templateId : undefined;

  if (templateId) {
    const byTemplate = getTemplateById(templateId);
    if (byTemplate) return byTemplate;
  }

  return MEGASTRUCTURES.find(template => template.type === structure.structureType);
}

function getStructureTier(structure: MegaStructure): number {
  const details = (structure.details as any) || {};
  const explicitTier = toNumber(details.tier, 0);
  if (explicitTier >= 1) return explicitTier;
  return getMegastructureTierFromLevel(toNumber(structure.level, 1));
}

function estimateResourceProduction(modelClass: string, output: number, power: number) {
  const base = Math.max(100, Math.floor(output * 10));

  switch (modelClass) {
    case "production":
      return { metal: base * 3, crystal: base * 2, deuterium: base, energy: Math.floor(power * 4) };
    case "research":
      return { metal: base, crystal: Math.floor(base * 1.5), deuterium: base, energy: Math.floor(power * 5) };
    case "defense":
      return { metal: Math.floor(base * 2), crystal: base, deuterium: Math.floor(base * 0.8), energy: Math.floor(power * 3) };
    case "mobility":
      return { metal: Math.floor(base * 1.8), crystal: Math.floor(base * 1.8), deuterium: Math.floor(base * 2.2), energy: Math.floor(power * 3.2) };
    case "exotic":
      return { metal: Math.floor(base * 1.2), crystal: Math.floor(base * 2.8), deuterium: Math.floor(base * 1.6), energy: Math.floor(power * 6) };
    case "superweapon":
      return { metal: Math.floor(base * 2.5), crystal: Math.floor(base * 2.2), deuterium: Math.floor(base * 2), energy: Math.floor(power * 2) };
    default:
      return { metal: base * 2, crystal: Math.floor(base * 1.4), deuterium: Math.floor(base * 1.1), energy: Math.floor(power * 4.5) };
  }
}

function buildStructurePatch(constructed: NonNullable<ReturnType<typeof createMegastructure>>, templateId: string, tier: number) {
  const production = estimateResourceProduction(constructed.class, constructed.currentStats.output, constructed.currentStats.power);

  return {
    name: constructed.name,
    structureType: constructed.type,
    structureClass: constructed.class,
    kind: KIND_BY_CLASS[constructed.class] || "industrial",
    category: constructed.class,
    subCategory: constructed.subClass,
    level: constructed.level,
    completionPercent: constructed.completionPercentage || 100,
    isOperational: constructed.isActive,
    health: Math.max(1000, Math.floor(constructed.currentStats.resilience * 1000)),
    maxHealth: Math.max(1000, Math.floor(constructed.currentStats.resilience * 1000)),
    power: constructed.currentStats.power,
    efficiency: constructed.currentStats.efficiency / 100,
    substats: {
      productionRate: production.metal,
      researchMultiplier: Math.max(1, Number((constructed.currentStats.tech / 100).toFixed(2))),
      defenseMultiplier: Math.max(1, Number((constructed.currentStats.defense.damageReduction / 50).toFixed(2))),
      capacityMultiplier: Math.max(1, Number((constructed.currentStats.capacity / 1000).toFixed(2))),
      efficiencyRating: constructed.currentStats.efficiency,
    },
    attributes: {
      durability: Math.min(9999, constructed.currentStats.resilience),
      reliability: Math.min(9999, constructed.currentStats.endurance),
      adaptability: Math.min(9999, constructed.currentStats.control),
      scalability: Math.min(9999, constructed.currentStats.output),
      sustainability: Math.min(9999, constructed.currentStats.survivability),
    },
    subAttributes: {
      maintenanceCost: constructed.maintenanceCost,
      powerConsumption: Math.floor(constructed.currentStats.power * 0.35),
      productionCapacity: Math.max(1000, Math.floor(constructed.currentStats.output * 1000)),
      storageCapacity: Math.max(1000, Math.floor(constructed.currentStats.capacity * 1000)),
      repairRate: Math.max(1, constructed.currentStats.defense.repairRate),
    },
    resourceProduction: production,
    resourceStorage: {
      metal: Math.max(100000, Math.floor(constructed.currentStats.capacity * 5000)),
      crystal: Math.max(100000, Math.floor(constructed.currentStats.capacity * 3000)),
      deuterium: Math.max(100000, Math.floor(constructed.currentStats.capacity * 2000)),
      energy: Math.max(100000, Math.floor(constructed.currentStats.power * 2000)),
    },
    currentResources: {
      metal: 0,
      crystal: 0,
      deuterium: 0,
      energy: 0,
    },
    attack: constructed.currentStats.offense.firepower,
    defense: constructed.currentStats.defense.armorStrength,
    damageOutput: constructed.currentStats.offense.firepower,
    details: {
      templateId,
      tier,
      level: constructed.level,
      multiplier: constructed.totalMultiplier,
      constructionTime: constructed.constructionTime,
      estimatedCompletion: null,
      workforce: Math.max(1000, Math.floor(constructed.currentStats.capacity / 2)),
      researchTeams: Math.max(100, Math.floor(constructed.currentStats.tech / 2)),
    },
  };
}

export async function getMegastructureTemplateCatalog() {
  return getMegastructureCatalogByCategory().map(group => ({
    category: group.category,
    label: group.meta.label,
    description: group.meta.description,
    templates: group.templates.map(template => ({
      ...template,
      previewCost: calculateMegastructureConstructionCost(template, 1, 1),
      maxLevel: template.progressionConfig.levels.max,
      maxTier: template.progressionConfig.tiers.max,
    })),
  }));
}

export async function constructMegastructureForPlayer(userId: string, input: ConstructMegastructureInput) {
  const playerState = await storage.getPlayerState(userId);
  if (!playerState) {
    throw new Error("Player state not found");
  }

  const template = getTemplateById(input.templateId);
  if (!template) {
    throw new Error("Megastructure template not found");
  }

  const targetLevel = Math.max(1, Math.min(toNumber(input.level, 1), template.progressionConfig.levels.max));
  const targetTier = Math.max(1, Math.min(toNumber(input.tier, 1), template.progressionConfig.tiers.max));
  const constructionCost = calculateMegastructureConstructionCost(template, targetLevel, targetTier);

  const currentResources = normalizeResources(playerState.resources);
  if (!hasEnoughResources(currentResources, constructionCost)) {
    return {
      success: false,
      reason: "INSUFFICIENT_RESOURCES",
      required: constructionCost,
      available: currentResources,
    };
  }

  const updatedResources = deductResources(currentResources, constructionCost);
  await storage.updatePlayerState(userId, { resources: updatedResources });

  const coordinates = input.coordinates || String(playerState.coordinates || "[1:1:1]");
  const newStructure = createMegastructure(
    template.id,
    `mega-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    targetLevel,
    targetTier,
    0,
    0,
    0,
    coordinates,
  );

  if (!newStructure) {
    throw new Error("Failed to create megastructure instance");
  }

  newStructure.name = input.name?.trim() || template.name;
  newStructure.orbitalBody = String(playerState.planetName || "Unknown World");
  newStructure.isActive = true;
  newStructure.completionPercentage = 100;

  const patch = buildStructurePatch(newStructure, template.id, targetTier);

  const created = await storage.createMegaStructure({
    playerId: userId,
    name: newStructure.name,
    structureType: patch.structureType,
    structureClass: patch.structureClass,
    kind: patch.kind,
    category: patch.category,
    subCategory: patch.subCategory,
    level: patch.level,
    completionPercent: patch.completionPercent,
    isOperational: patch.isOperational,
    coordinates,
    health: patch.health,
    maxHealth: patch.maxHealth,
    power: patch.power,
    efficiency: patch.efficiency,
    substats: patch.substats,
    attributes: patch.attributes,
    subAttributes: patch.subAttributes,
    resourceProduction: patch.resourceProduction,
    resourceStorage: patch.resourceStorage,
    currentResources: patch.currentResources,
    modules: [],
    systems: [],
    weapons: [],
    defenses: [],
    description: newStructure.description,
    about: newStructure.lore,
    details: patch.details,
    menus: {
      construction: { status: "complete", progress: 100 },
      production: { enabled: true, rates: {} },
      research: { projects: [], completed: [] },
      defense: { shields: true, weapons: true },
      management: { staffing: 100, efficiency: patch.substats.efficiencyRating },
    },
    gameMechanics: {
      captureable: false,
      destroyable: true,
      transferable: false,
      scalable: true,
      networked: true,
      effects: [newStructure.primaryFunction],
    },
    population: Math.max(0, Math.floor(newStructure.currentStats.capacity * 10)),
    scientists: Math.max(0, Math.floor(newStructure.currentStats.tech * 3)),
    engineers: Math.max(0, Math.floor(newStructure.currentStats.logistics * 5)),
    workers: Math.max(0, Math.floor(newStructure.currentStats.capacity * 8)),
    soldiers: Math.max(0, Math.floor(newStructure.currentStats.command * 6)),
    attack: patch.attack,
    defense: patch.defense,
    damageOutput: patch.damageOutput,
    constructedAt: new Date(),
    lastOperationalAt: new Date(),
  });

  return {
    success: true,
    cost: constructionCost,
    resources: updatedResources,
    structure: created,
  };
}

async function chargeUpgradeCost(userId: string, cost: MegastructureCost) {
  const playerState = await storage.getPlayerState(userId);
  if (!playerState) {
    throw new Error("Player state not found");
  }

  const currentResources = normalizeResources(playerState.resources);
  if (!hasEnoughResources(currentResources, cost)) {
    return {
      charged: false,
      required: cost,
      available: currentResources,
    };
  }

  const updatedResources = deductResources(currentResources, cost);
  await storage.updatePlayerState(userId, { resources: updatedResources });

  return {
    charged: true,
    resources: updatedResources,
  };
}

export async function upgradeMegastructureLevelForPlayer(userId: string, structureId: string, levelsToAdd: number = 1) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    throw new Error("Megastructure not found");
  }

  const template = resolveTemplateFromStructure(structure);
  if (!template) {
    throw new Error("Megastructure template resolution failed");
  }

  const currentLevel = Math.max(1, toNumber(structure.level, 1));
  const currentTier = getStructureTier(structure);
  const targetLevel = Math.min(template.progressionConfig.levels.max, currentLevel + Math.max(1, levelsToAdd));

  if (targetLevel === currentLevel) {
    return { success: false, reason: "MAX_LEVEL_REACHED", structure };
  }

  const cost = calculateMegastructureUpgradeCost(template, currentLevel, currentTier, targetLevel, currentTier);
  const charged = await chargeUpgradeCost(userId, cost);

  if (!charged.charged) {
    return {
      success: false,
      reason: "INSUFFICIENT_RESOURCES",
      required: charged.required,
      available: charged.available,
    };
  }

  const rebuilt = createMegastructure(template.id, structure.id, targetLevel, currentTier);
  if (!rebuilt) {
    throw new Error("Failed to rebuild upgraded megastructure");
  }

  rebuilt.name = structure.name;
  rebuilt.description = structure.description || rebuilt.description;
  rebuilt.lore = structure.about || rebuilt.lore;
  rebuilt.isActive = Boolean(structure.isOperational);

  const patch = buildStructurePatch(rebuilt, template.id, currentTier);

  const updated = await storage.updateMegaStructure(structureId, {
    level: targetLevel,
    health: patch.health,
    maxHealth: patch.maxHealth,
    power: patch.power,
    efficiency: patch.efficiency,
    substats: patch.substats,
    attributes: patch.attributes,
    subAttributes: patch.subAttributes,
    resourceProduction: patch.resourceProduction,
    resourceStorage: patch.resourceStorage,
    attack: patch.attack,
    defense: patch.defense,
    damageOutput: patch.damageOutput,
    details: {
      ...(structure.details as any),
      ...patch.details,
      lastLevelUpgradeAt: new Date().toISOString(),
    },
  });

  return {
    success: true,
    cost,
    resources: charged.resources,
    structure: updated,
  };
}

export async function upgradeMegastructureTierForPlayer(userId: string, structureId: string, tiersToAdd: number = 1) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    throw new Error("Megastructure not found");
  }

  const template = resolveTemplateFromStructure(structure);
  if (!template) {
    throw new Error("Megastructure template resolution failed");
  }

  const currentLevel = Math.max(1, toNumber(structure.level, 1));
  const currentTier = getStructureTier(structure);
  const targetTier = Math.min(template.progressionConfig.tiers.max, currentTier + Math.max(1, tiersToAdd));

  if (targetTier === currentTier) {
    return { success: false, reason: "MAX_TIER_REACHED", structure };
  }

  const cost = calculateMegastructureUpgradeCost(template, currentLevel, currentTier, currentLevel, targetTier);
  const charged = await chargeUpgradeCost(userId, cost);

  if (!charged.charged) {
    return {
      success: false,
      reason: "INSUFFICIENT_RESOURCES",
      required: charged.required,
      available: charged.available,
    };
  }

  const rebuilt = createMegastructure(template.id, structure.id, currentLevel, targetTier);
  if (!rebuilt) {
    throw new Error("Failed to rebuild upgraded megastructure");
  }

  rebuilt.name = structure.name;
  rebuilt.description = structure.description || rebuilt.description;
  rebuilt.lore = structure.about || rebuilt.lore;
  rebuilt.isActive = Boolean(structure.isOperational);

  const patch = buildStructurePatch(rebuilt, template.id, targetTier);

  const updated = await storage.updateMegaStructure(structureId, {
    health: patch.health,
    maxHealth: patch.maxHealth,
    power: patch.power,
    efficiency: patch.efficiency,
    substats: patch.substats,
    attributes: patch.attributes,
    subAttributes: patch.subAttributes,
    resourceProduction: patch.resourceProduction,
    resourceStorage: patch.resourceStorage,
    attack: patch.attack,
    defense: patch.defense,
    damageOutput: patch.damageOutput,
    details: {
      ...(structure.details as any),
      ...patch.details,
      lastTierUpgradeAt: new Date().toISOString(),
    },
  });

  return {
    success: true,
    cost,
    resources: charged.resources,
    structure: updated,
  };
}

export async function setMegastructureOperationalState(userId: string, structureId: string, isOperational: boolean) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    throw new Error("Megastructure not found");
  }

  const updated = await storage.updateMegaStructure(structureId, {
    isOperational,
    lastOperationalAt: isOperational ? new Date() : structure.lastOperationalAt,
    details: {
      ...(structure.details as any),
      operational: isOperational,
    },
  });

  return updated;
}
