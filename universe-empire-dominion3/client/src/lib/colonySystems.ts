import { EmpireColony, SOL_SYSTEM_COLONIES } from "@/lib/empireManager";

export const COLONIES_PER_PAGE = 15;
export const TOTAL_COLONY_RECORDS = 1_000_000;
export const TOTAL_COLONY_PAGES = Math.ceil(TOTAL_COLONY_RECORDS / COLONIES_PER_PAGE);

export type ColonyManagementProfile = "balanced" | "industry" | "defense" | "science";

export interface ColonyPlanetStatus {
  stability: number;
  security: number;
  infrastructure: number;
  logistics: number;
  energyGrid: number;
  morale: number;
  threatLevel: "low" | "medium" | "high";
  condition: "excellent" | "stable" | "strained" | "critical";
}

export interface ColonySubStats {
  miningRate: number;
  researchOutput: number;
  shipyardEfficiency: number;
  foodOutput: number;
  waterOutput: number;
  tradeIndex: number;
  droneAutomation: number;
}

export interface ColonySolarOverview {
  galaxy: number;
  sector: number;
  system: number;
  orbit: number;
  starClass: "G" | "K" | "M" | "F";
}

export interface ColonySystemRecord extends EmpireColony {
  planetStatus: ColonyPlanetStatus;
  subStats: ColonySubStats;
  solarOverview: ColonySolarOverview;
  moonCount: number;
  parentPlanetCoordinates?: string;
}

export interface SystemBodySlot {
  orbit: number;
  type: "planet" | "moon";
  name: string;
  class: string;
  owner: boolean;
  status: EmpireColony["status"];
  population: number;
  coordinates: string;
}

function seeded(index: number, salt = 0): number {
  const value = Math.sin((index + 1) * 12.9898 + (salt + 1) * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function classFor(index: number): string {
  const classes = ["M", "D", "V", "R", "G", "I", "A", "P"];
  return classes[index % classes.length];
}

function systemNameFor(galaxy: number, sector: number, system: number): string {
  if (galaxy === 1 && sector === 1 && system === 100) {
    return "Sol";
  }
  return `Sector-${galaxy}-${sector}-System-${system}`;
}

function parseCoordinates(coordinates: string) {
  const [galaxy, sector, system, orbit, moonOrbit] = coordinates.split(":").map((v) => Number.parseInt(v, 10));
  return {
    galaxy: Number.isFinite(galaxy) ? galaxy : 1,
    sector: Number.isFinite(sector) ? sector : 1,
    system: Number.isFinite(system) ? system : 1,
    orbit: Number.isFinite(orbit) ? orbit : 1,
    moonOrbit: Number.isFinite(moonOrbit) ? moonOrbit : undefined,
  };
}

function buildStatus(index: number): ColonyPlanetStatus {
  const stability = 55 + Math.floor(seeded(index, 1) * 45);
  const security = 50 + Math.floor(seeded(index, 2) * 50);
  const infrastructure = 45 + Math.floor(seeded(index, 3) * 55);
  const logistics = 40 + Math.floor(seeded(index, 4) * 60);
  const energyGrid = 35 + Math.floor(seeded(index, 5) * 65);
  const morale = 45 + Math.floor(seeded(index, 6) * 55);

  const average = (stability + security + infrastructure + logistics + energyGrid + morale) / 6;

  let condition: ColonyPlanetStatus["condition"] = "stable";
  if (average >= 80) condition = "excellent";
  else if (average < 40) condition = "critical";
  else if (average < 60) condition = "strained";

  let threatLevel: ColonyPlanetStatus["threatLevel"] = "medium";
  if (security >= 80) threatLevel = "low";
  if (security < 45) threatLevel = "high";

  return {
    stability,
    security,
    infrastructure,
    logistics,
    energyGrid,
    morale,
    threatLevel,
    condition,
  };
}

function buildSubStats(index: number): ColonySubStats {
  return {
    miningRate: 80 + Math.floor(seeded(index, 7) * 520),
    researchOutput: 25 + Math.floor(seeded(index, 8) * 140),
    shipyardEfficiency: 35 + Math.floor(seeded(index, 9) * 65),
    foodOutput: 50 + Math.floor(seeded(index, 10) * 280),
    waterOutput: 45 + Math.floor(seeded(index, 11) * 250),
    tradeIndex: 20 + Math.floor(seeded(index, 12) * 80),
    droneAutomation: 10 + Math.floor(seeded(index, 13) * 90),
  };
}

function buildSolarOverview(index: number, isMoon: boolean): ColonySolarOverview {
  const galaxy = 1 + (Math.floor(index / 120000) % 9);
  const sector = 1 + (Math.floor(index / 1200) % 100);
  const system = 1 + (Math.floor(index / 12) % 1000);
  const orbit = 1 + (index % 12);
  const starClassPool: ColonySolarOverview["starClass"][] = ["G", "K", "M", "F"];

  return {
    galaxy,
    sector,
    system,
    orbit: isMoon ? Math.max(1, orbit - 1) : orbit,
    starClass: starClassPool[index % starClassPool.length],
  };
}

function ownerFor(index: number): boolean {
  if (index < SOL_SYSTEM_COLONIES.length) {
    return SOL_SYSTEM_COLONIES[index].owner;
  }
  return index % 19 === 0 || index % 41 === 0;
}

function typeFor(index: number): EmpireColony["type"] {
  if (index < SOL_SYSTEM_COLONIES.length) {
    return SOL_SYSTEM_COLONIES[index].type;
  }
  return index % 5 === 0 ? "moon" : "planet";
}

function statusFor(index: number, owner: boolean): EmpireColony["status"] {
  if (index < SOL_SYSTEM_COLONIES.length) {
    return SOL_SYSTEM_COLONIES[index].status;
  }
  if (owner) {
    return index % 17 === 0 ? "colonizing" : "active";
  }
  return index % 23 === 0 ? "abandoned" : "empty";
}

export function buildColonyRecord(index: number): ColonySystemRecord {
  if (index < SOL_SYSTEM_COLONIES.length) {
    const base = SOL_SYSTEM_COLONIES[index];
    const parsed = parseCoordinates(base.coordinates);
    return {
      ...base,
      moonCount: base.type === "planet" ? Math.max(1, (index % 4) + 1) : 0,
      parentPlanetCoordinates:
        base.type === "moon"
          ? `${parsed.galaxy}:${parsed.sector}:${parsed.system}:${parsed.orbit}`
          : undefined,
      planetStatus: buildStatus(index),
      subStats: buildSubStats(index),
      solarOverview: {
        galaxy: parsed.galaxy,
        sector: parsed.sector,
        system: parsed.system,
        orbit: parsed.orbit,
        starClass: "G",
      },
    };
  }

  const owner = ownerFor(index);
  const type = typeFor(index);
  const status = statusFor(index, owner);
  const solarOverview = buildSolarOverview(index, type === "moon");
  const orbit = solarOverview.orbit;
  const moonSuffix = type === "moon" ? `:${(index % 4) + 1}` : "";
  const coordinates = `${solarOverview.galaxy}:${solarOverview.sector}:${solarOverview.system}:${orbit}${moonSuffix}`;
  const populationBase = owner ? 40_000 + Math.floor(seeded(index, 14) * 1_600_000) : 0;

  return {
    id: `colony-${index + 1}`,
    name: `${type === "moon" ? "Moon" : "Planet"}-${index + 1}`,
    type,
    coordinates,
    systemName: systemNameFor(solarOverview.galaxy, solarOverview.sector, solarOverview.system),
    class: classFor(index),
    status,
    owner,
    buildings: owner
      ? {
          metalMine: 1 + (index % 15),
          crystalMine: 1 + (index % 12),
          deuteriumSynthesizer: 1 + (index % 10),
          solarPlant: 1 + (index % 14),
          roboticsFactory: 1 + (index % 6),
          shipyard: 1 + (index % 6),
          researchLab: 1 + (index % 8),
        }
      : {},
    resources: {
      metal: owner ? 20_000 + Math.floor(seeded(index, 15) * 600_000) : 0,
      crystal: owner ? 10_000 + Math.floor(seeded(index, 16) * 400_000) : 0,
      deuterium: owner ? 5_000 + Math.floor(seeded(index, 17) * 250_000) : 0,
    },
    population: status === "abandoned" ? Math.floor(populationBase * 0.08) : populationBase,
    defenses: owner ? 10 + Math.floor(seeded(index, 18) * 240) : 0,
    unitCount: owner ? 20 + Math.floor(seeded(index, 19) * 520) : 0,
    moonCount: type === "planet" ? (index % 4) + 1 : 0,
    parentPlanetCoordinates:
      type === "moon"
        ? `${solarOverview.galaxy}:${solarOverview.sector}:${solarOverview.system}:${orbit}`
        : undefined,
    planetStatus: buildStatus(index),
    subStats: buildSubStats(index),
    solarOverview,
  };
}

export function getEmpireColoniesPage(page: number, pageSize = COLONIES_PER_PAGE) {
  const safePage = Math.max(1, Math.min(TOTAL_COLONY_PAGES, page));
  const safePageSize = Math.max(1, pageSize);
  const startIndex = (safePage - 1) * safePageSize;
  const endExclusive = Math.min(startIndex + safePageSize, TOTAL_COLONY_RECORDS);

  const items: ColonySystemRecord[] = [];
  for (let index = startIndex; index < endExclusive; index += 1) {
    items.push(buildColonyRecord(index));
  }

  return {
    page: safePage,
    pageSize: safePageSize,
    totalItems: TOTAL_COLONY_RECORDS,
    totalPages: Math.ceil(TOTAL_COLONY_RECORDS / safePageSize),
    startIndex,
    endIndex: endExclusive - 1,
    items,
  };
}

export function getEmpireOverview() {
  const guaranteedOwned = Math.min(SOL_SYSTEM_COLONIES.length, TOTAL_COLONY_RECORDS);
  const generatedCount = Math.max(0, TOTAL_COLONY_RECORDS - SOL_SYSTEM_COLONIES.length);
  const periodicOwned = Math.floor(generatedCount / 19) + Math.floor(generatedCount / 41) - Math.floor(generatedCount / (19 * 41));
  const ownedColonies = guaranteedOwned + periodicOwned;

  return {
    totalColonies: TOTAL_COLONY_RECORDS,
    totalPages: TOTAL_COLONY_PAGES,
    ownedColonies,
    availableColonies: Math.max(0, TOTAL_COLONY_RECORDS - ownedColonies),
    totalMoonBodies: Math.floor(TOTAL_COLONY_RECORDS / 5),
  };
}

const PROFILE_MULTIPLIERS: Record<ColonyManagementProfile, {
  miningRate: number;
  researchOutput: number;
  defense: number;
  security: number;
  logistics: number;
  morale: number;
}> = {
  balanced: {
    miningRate: 1,
    researchOutput: 1,
    defense: 1,
    security: 1,
    logistics: 1,
    morale: 1,
  },
  industry: {
    miningRate: 1.25,
    researchOutput: 0.9,
    defense: 0.95,
    security: 0.95,
    logistics: 1.2,
    morale: 0.95,
  },
  defense: {
    miningRate: 0.95,
    researchOutput: 0.9,
    defense: 1.35,
    security: 1.25,
    logistics: 1,
    morale: 1.05,
  },
  science: {
    miningRate: 0.9,
    researchOutput: 1.35,
    defense: 0.95,
    security: 1,
    logistics: 1,
    morale: 1.02,
  },
};

export function applyManagementProfile(colony: ColonySystemRecord, profile: ColonyManagementProfile): ColonySystemRecord {
  const multipliers = PROFILE_MULTIPLIERS[profile];

  const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

  return {
    ...colony,
    defenses: Math.max(0, Math.round(colony.defenses * multipliers.defense)),
    resources: {
      metal: Math.max(0, Math.round(colony.resources.metal * multipliers.miningRate)),
      crystal: Math.max(0, Math.round(colony.resources.crystal * (0.9 + multipliers.researchOutput * 0.1))),
      deuterium: Math.max(0, Math.round(colony.resources.deuterium * (0.9 + multipliers.logistics * 0.1))),
    },
    planetStatus: {
      ...colony.planetStatus,
      security: clamp(colony.planetStatus.security * multipliers.security),
      logistics: clamp(colony.planetStatus.logistics * multipliers.logistics),
      morale: clamp(colony.planetStatus.morale * multipliers.morale),
    },
    subStats: {
      ...colony.subStats,
      miningRate: Math.max(0, Math.round(colony.subStats.miningRate * multipliers.miningRate)),
      researchOutput: Math.max(0, Math.round(colony.subStats.researchOutput * multipliers.researchOutput)),
      shipyardEfficiency: Math.max(0, Math.round(colony.subStats.shipyardEfficiency * multipliers.defense)),
      tradeIndex: Math.max(0, Math.round(colony.subStats.tradeIndex * multipliers.logistics)),
    },
  };
}

export function getSystemOverview(colony: ColonySystemRecord): SystemBodySlot[] {
  const { galaxy, sector, system } = colony.solarOverview;

  const slots: SystemBodySlot[] = [];
  for (let orbit = 1; orbit <= 12; orbit += 1) {
    const index = ((galaxy * 10_000_000) + (sector * 100_000) + (system * 100) + orbit) % TOTAL_COLONY_RECORDS;
    const base = buildColonyRecord(index);
    const coordinates = `${galaxy}:${sector}:${system}:${orbit}`;

    slots.push({
      orbit,
      type: "planet",
      name: `Orbital Body ${orbit}`,
      class: base.class,
      owner: base.owner,
      status: base.status,
      population: base.population,
      coordinates,
    });

    if (orbit % 3 === 0 || orbit === colony.solarOverview.orbit) {
      const moonIndex = (index + 7) % TOTAL_COLONY_RECORDS;
      const moonBase = buildColonyRecord(moonIndex);
      slots.push({
        orbit,
        type: "moon",
        name: `Moon ${orbit}-A`,
        class: moonBase.class,
        owner: moonBase.owner,
        status: moonBase.status,
        population: Math.max(0, Math.floor(moonBase.population * 0.18)),
        coordinates: `${galaxy}:${sector}:${system}:${orbit}:1`,
      });
    }
  }

  return slots;
}

export function getSameSystemKey(colony: ColonySystemRecord): string {
  return `${colony.solarOverview.galaxy}:${colony.solarOverview.sector}:${colony.solarOverview.system}`;
}
