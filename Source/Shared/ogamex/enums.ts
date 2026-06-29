export const fleetMissionStatuses = ["friendly", "neutral", "hostile"] as const;
export type FleetMissionStatus = (typeof fleetMissionStatuses)[number];

export const fleetSpeedTypes = {
  war: 1,
  holding: 2,
  peaceful: 3,
} as const;
export type FleetSpeedType = keyof typeof fleetSpeedTypes;

export const highscoreTypes = {
  general: 0,
  economy: 1,
  research: 2,
  military: 3,
} as const;
export type HighscoreType = keyof typeof highscoreTypes;

export type CharacterClassId = "collector" | "general" | "discoverer";

export interface CharacterClassDefinition {
  id: CharacterClassId;
  value: number;
  name: string;
  machineName: string;
  classShipId: number;
  classShipName: string;
  changeCost: number;
  bonuses: string[];
  shipDescription: string;
}

export const characterClasses: Record<CharacterClassId, CharacterClassDefinition> = {
  collector: {
    id: "collector",
    value: 1,
    name: "Collector",
    machineName: "miner",
    classShipId: 217,
    classShipName: "Crawler",
    changeCost: 500000,
    bonuses: [
      "+25% mine production",
      "+10% energy production",
      "+100% speed for Transporters",
      "+25% cargo bay for Transporters",
      "+50% Crawler bonus",
      "+10% more usable Crawlers with Geologist",
      "Overload the Crawlers up to 150%",
      "+10% discount on acceleration (building)",
    ],
    shipDescription:
      "The Crawler is a large trench vehicle that increases the production of mines and synthesizers. It is more agile than it looks but it is not particularly robust. Each Crawler increases metal production by 0.02%, crystal production by 0.02% and Deuterium production by 0.02%. As a collector, production also increases. The maximum total bonus depends on the overall level of your mines.",
  },
  general: {
    id: "general",
    value: 2,
    name: "General",
    machineName: "warrior",
    classShipId: 218,
    classShipName: "Reaper",
    changeCost: 500000,
    bonuses: [
      "+100% speed for combat ships",
      "+100% speed for Recyclers",
      "-50% deuterium consumption for all ships",
      "+20% cargo bay for Recyclers and Pathfinders",
      "A small chance to immediately destroy a Deathstar once in a battle using a light fighter.",
      "Wreckage at attack (transport to starting planet)",
      "+2 combat research levels",
      "+2 fleet slots",
      "+5 additional Moon Fields",
      "Detailed fleet speed settings",
      "+10% discount on acceleration (shipyard)",
    ],
    shipDescription:
      "There's hardly anything more destructive than a ship of the Reaper class. These vessels combine fire power, strong shields, speed and capacity along with the unique ability to mine a portion of the created debris field directly after a battle. However this ability doesn't apply to combat against pirates or aliens.",
  },
  discoverer: {
    id: "discoverer",
    value: 3,
    name: "Discoverer",
    machineName: "explorer",
    classShipId: 219,
    classShipName: "Pathfinder",
    changeCost: 500000,
    bonuses: [
      "-25% research time",
      "Increased gain on successful expeditions",
      "+10% larger planets on colonisation",
      "Debris fields created on expeditions will be visible in the Galaxy view.",
      "+2 expeditions",
      "-50% chance of expedition enemies",
      "+20% phalanx range",
      "75% loot from inactive players",
      "+10% discount on acceleration (research)",
    ],
    shipDescription:
      "Pathfinders are fast and spacious. Their construction method is optimised for pushing into unknown territory. They are capable of discovering and mining debris fields during expeditions. Additionally they can find items out on expeditions. Total yield also increases.",
  },
};
