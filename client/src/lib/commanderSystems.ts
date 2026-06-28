import {
  CommanderState,
  Item,
  COMMANDER_EQUIPMENT_SLOT_DEFINITIONS,
  type CommanderEquipmentSlotId,
} from "./commanderTypes";

export type CommanderAttributeKey =
  | "combat"
  | "strategy"
  | "resilience"
  | "leadership"
  | "logistics"
  | "innovation"
  | "governance"
  | "adaptability";

export interface CommanderLoadoutSummary {
  slots: Record<CommanderEquipmentSlotId, Item | null>;
  inventoryByType: {
    weapon: number;
    armor: number;
    module: number;
    blueprint: number;
    material: number;
  };
  coreStats: {
    level: number;
    xp: number;
    warfare: number;
    logistics: number;
    science: number;
    engineering: number;
  };
  subStats: {
    commandPower: number;
    tacticalAgility: number;
    sustainment: number;
    civicControl: number;
    researchCadence: number;
    constructionTempo: number;
  };
  attributes: Record<CommanderAttributeKey, number>;
  subAttributes: {
    equipmentScore: number;
    inventoryLoad: number;
    upgradeReadiness: number;
    specializationDepth: number;
    activeSlots: number;
  };
}

function toBonusValue(item: Item | null, key: "warfare" | "logistics" | "science" | "engineering") {
  if (!item?.stats) return 0;
  return Number(item.stats[key] || 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function calculateEquipmentScore(item: Item | null) {
  if (!item) return 0;
  const rarityScore = {
    common: 8,
    uncommon: 12,
    rare: 20,
    epic: 30,
    legendary: 44,
  }[item.rarity] || 6;

  const statScore = Object.values(item.stats || {}).reduce((sum, value) => sum + Number(value || 0), 0) * 5;
  const temperingScore = Number(item.tempering || 0) * 6;
  const masterworkScore = item.masterwork ? 14 : 0;

  return rarityScore + statScore + temperingScore + masterworkScore + Math.max(0, item.level - 1);
}

export function buildCommanderLoadoutSummary(commander: CommanderState): CommanderLoadoutSummary {
  const equippedItems = COMMANDER_EQUIPMENT_SLOT_DEFINITIONS
    .map((slot) => commander.equipment[slot.id])
    .filter(Boolean) as Item[];

  const totalBonus = (key: "warfare" | "logistics" | "science" | "engineering") =>
    equippedItems.reduce((sum, item) => sum + toBonusValue(item, key), 0);

  const weaponBonus = totalBonus("warfare");
  const armorBonus = totalBonus("engineering") + totalBonus("logistics");
  const moduleScience = totalBonus("science");
  const moduleLogistics = totalBonus("logistics");

  const coreStats = {
    level: commander.stats.level || 1,
    xp: commander.stats.xp || 0,
    warfare: (commander.stats.warfare || 1) + weaponBonus,
    logistics: (commander.stats.logistics || 1) + moduleLogistics,
    science: (commander.stats.science || 1) + moduleScience,
    engineering: (commander.stats.engineering || 1) + totalBonus("engineering"),
  };

  const equipmentScore = equippedItems.reduce((sum, item) => sum + calculateEquipmentScore(item), 0);

  const inventoryByType = commander.inventory.reduce(
    (accumulator, item) => {
      accumulator[item.type] += 1;
      return accumulator;
    },
    { weapon: 0, armor: 0, module: 0, blueprint: 0, material: 0 },
  );

  const subStats = {
    commandPower: Math.round(coreStats.warfare * 8 + coreStats.level * 6 + weaponBonus * 12),
    tacticalAgility: Math.round(coreStats.warfare * 4 + coreStats.science * 3 + coreStats.engineering * 2),
    sustainment: Math.round(coreStats.logistics * 7 + coreStats.engineering * 4 + armorBonus * 5),
    civicControl: Math.round(coreStats.logistics * 3 + coreStats.science * 2 + coreStats.level * 5),
    researchCadence: Math.round(coreStats.science * 9 + moduleScience * 8 + coreStats.level * 2),
    constructionTempo: Math.round(coreStats.engineering * 8 + coreStats.logistics * 2 + armorBonus * 4),
  };

  const attributes: Record<CommanderAttributeKey, number> = {
    combat: clamp(Math.round((subStats.commandPower + subStats.tacticalAgility) / 12), 1, 999),
    strategy: clamp(Math.round((coreStats.science * 7 + coreStats.level * 5 + moduleScience * 9) / 6), 1, 999),
    resilience: clamp(Math.round((subStats.sustainment + armorBonus * 12) / 9), 1, 999),
    leadership: clamp(Math.round((coreStats.level * 10 + subStats.civicControl) / 11), 1, 999),
    logistics: clamp(Math.round((subStats.sustainment + coreStats.logistics * 12) / 10), 1, 999),
    innovation: clamp(Math.round((subStats.researchCadence + coreStats.science * 10) / 11), 1, 999),
    governance: clamp(Math.round((subStats.civicControl + coreStats.logistics * 8) / 10), 1, 999),
    adaptability: clamp(Math.round((coreStats.level * 6 + coreStats.engineering * 7 + coreStats.science * 5) / 7), 1, 999),
  };

  const subAttributes = {
    equipmentScore,
    inventoryLoad: commander.inventory.length,
    upgradeReadiness: clamp(Math.round((equipmentScore + coreStats.level * 12 + coreStats.engineering * 9) / 10), 0, 999),
    specializationDepth: clamp(Math.round((coreStats.warfare + coreStats.logistics + coreStats.science + coreStats.engineering) / 2), 0, 999),
    activeSlots: equippedItems.length,
  };

  return {
    slots: commander.equipment,
    inventoryByType,
    coreStats,
    subStats,
    attributes,
    subAttributes,
  };
}

export function buildRosterCommanderScores(
  commanders: Array<{ instanceId: string; name: string; rarity: string; type: string }>,
) {
  const rarityWeight: Record<string, number> = {
    common: 1,
    uncommon: 2,
    rare: 4,
    epic: 7,
    legendary: 11,
  };

  return commanders.map((commander, index) => {
    const weight = rarityWeight[commander.rarity] || 1;
    const role = index % 4 === 0 ? "Fleet" : index % 4 === 1 ? "Research" : index % 4 === 2 ? "Governance" : "Industry";
    const commandScore = weight * 24 + (index % 6) * 7;
    const supportScore = weight * 18 + (index % 5) * 6;
    const synergy = commandScore + supportScore + (role === "Fleet" ? 20 : role === "Research" ? 18 : role === "Governance" ? 16 : 14);

    return {
      instanceId: commander.instanceId,
      name: commander.name,
      rarity: commander.rarity,
      type: commander.type,
      role,
      commandScore,
      supportScore,
      synergy,
    };
  });
}
