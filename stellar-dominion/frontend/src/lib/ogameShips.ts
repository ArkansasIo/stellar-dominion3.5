import { OGAME_CATALOG_ENTRIES } from "@shared/config/ogameCatalogConfig";

export type ShipClass = "fighter" | "cargo" | "support" | "capital" | "probe" | "special";

export interface Ship {
  id: string;
  name: string;
  description: string;
  type: ShipClass;
  class: ShipClass;
  cost: { metal: number; crystal: number; deuterium: number };
  capacity?: number;
  speed: number;
  attack: number;
  defense: number;
  shield: number;
  hull: number;
  consumption: number;
  requirements?: { [key: string]: number };
}

const SHIP_CLASS_BY_ID: Record<string, ShipClass> = {
  lightFighter: "fighter",
  heavyFighter: "fighter",
  smallCargo: "cargo",
  largeCargo: "cargo",
  recycler: "support",
  colonyShip: "support",
  battleship: "capital",
  battlecruiser: "capital",
  cruiser: "capital",
  destroyer: "capital",
  deathstar: "capital",
  espionageProbe: "probe",
  bomber: "special",
  solarSatellite: "special",
  pathfinder: "special",
};

const asNumber = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const getConsumption = (deuteriumCost: number, speed: number): number => {
  if (deuteriumCost <= 0 && speed <= 0) return 1;
  if (deuteriumCost <= 0) return Math.max(1, Math.round(speed / 1000));
  return Math.max(1, Math.round(deuteriumCost / 20));
};

export const OGAME_SHIPS: Ship[] = OGAME_CATALOG_ENTRIES
  .filter((entry) => entry.entryType === "ship")
  .map((entry) => {
    const speed = asNumber(entry.stats.speed);
    const shield = asNumber(entry.stats.shield);
    const hull = asNumber(entry.stats.hull);
    const capacity = asNumber(entry.stats.cargo);
    const shipClass = SHIP_CLASS_BY_ID[entry.id] || "special";

    return {
      id: entry.id,
      name: entry.name,
      description: entry.description,
      type: shipClass,
      class: shipClass,
      cost: {
        metal: entry.baseCost.metal,
        crystal: entry.baseCost.crystal,
        deuterium: entry.baseCost.deuterium,
      },
      capacity: capacity > 0 ? capacity : undefined,
      speed: Math.max(1, Math.round(speed)),
      attack: Math.max(0, Math.round(asNumber(entry.stats.attack))),
      defense: Math.max(0, Math.round(shield)),
      shield: Math.max(0, Math.round(shield)),
      hull: Math.max(1, Math.round(hull)),
      consumption: getConsumption(entry.baseCost.deuterium, speed),
      requirements: entry.prerequisites,
    };
  });

export const getShipCost = (ship: Ship, quantity: number = 1) => {
  return {
    metal: ship.cost.metal * quantity,
    crystal: ship.cost.crystal * quantity,
    deuterium: ship.cost.deuterium * quantity,
  };
};

export const getShipBuildTime = (ship: Ship, quantity: number = 1, shipyardLevel: number = 1) => {
  const baseTime = (ship.cost.metal + ship.cost.crystal) / 2500;
  const buildTime = Math.ceil(baseTime * quantity / (shipyardLevel * 2));
  return Math.max(60, buildTime);
};
