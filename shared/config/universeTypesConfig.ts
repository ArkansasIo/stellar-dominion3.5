export interface UniverseDef {
  id: string;
  name: string;
  number: number;
  realmSystem: string;
  realmSystemId: string;
  description: string;
  galaxyCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Veteran";
  speedMultiplier: number;
  isSeasonal: boolean;
  isActive: boolean;
  seasonNumber?: number;
  startDate?: string;
  endDate?: string;
}

const REALM_SYSTEMS = [
  {
    id: "nexus-crown",
    name: "Nexus Crown",
    description: "The apex cluster of the known galaxy",
    universes: 10,
    start: 1,
  },
  {
    id: "aurora-reach",
    name: "Aurora Reach",
    description: "A luminous region of scientific discovery",
    universes: 10,
    start: 11,
  },
  {
    id: "verdant-expanse",
    name: "Verdant Expanse",
    description: "A lush region of abundant natural resources",
    universes: 10,
    start: 21,
  },
  {
    id: "crimson-verge",
    name: "Crimson Verge",
    description: "A volatile frontier of constant conflict",
    universes: 10,
    start: 31,
  },
  {
    id: "oblivion-gate",
    name: "Oblivion Gate",
    description: "The bleeding edge of galactic collapse",
    universes: 10,
    start: 41,
  },
  {
    id: "celestial-arc",
    name: "Celestial Arc",
    description: "An ancient realm of precursor mysteries",
    universes: 10,
    start: 51,
  },
  {
    id: "void-walker",
    name: "Void Walker",
    description: "The dark spaces between galaxies",
    universes: 10,
    start: 61,
  },
  {
    id: "iron-dominion",
    name: "Iron Dominion",
    description: "A militarized corridor of fortress worlds",
    universes: 10,
    start: 71,
  },
  {
    id: "eternal-edge",
    name: "Eternal Edge",
    description: "The farthest frontier of known space",
    universes: 10,
    start: 81,
  },
];

const UNIVERSE_SUFFIXES = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa",
];

const DIFFICULTY_MAP: Record<string, "Beginner" | "Intermediate" | "Advanced" | "Veteran"> = {
  "nexus-crown": "Advanced",
  "aurora-reach": "Intermediate",
  "verdant-expanse": "Beginner",
  "crimson-verge": "Advanced",
  "oblivion-gate": "Veteran",
  "celestial-arc": "Intermediate",
  "void-walker": "Advanced",
  "iron-dominion": "Intermediate",
  "eternal-edge": "Beginner",
};

function buildUniverses(): UniverseDef[] {
  const universes: UniverseDef[] = [];
  let idCounter = 1;

  for (const system of REALM_SYSTEMS) {
    for (let i = 0; i < system.universes; i++) {
      const suffix = UNIVERSE_SUFFIXES[i] || `S${i + 1}`;
      const universeNum = system.start + i;
      const isSeasonal = i >= 8;

      universes.push({
        id: `uni-${String(universeNum).padStart(3, "0")}`,
        name: `${system.name} ${suffix}`,
        number: universeNum,
        realmSystem: system.name,
        realmSystemId: system.id,
        description: `${system.description} — Universe ${suffix}`,
        galaxyCount: Math.floor(Math.random() * 8) + 3,
        difficulty: DIFFICULTY_MAP[system.id] || "Intermediate",
        speedMultiplier: 0.8 + Math.random() * 0.7,
        isSeasonal,
        isActive: true,
        ...(isSeasonal ? {
          seasonNumber: Math.floor(universeNum / 10) + 1,
          startDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        } : {}),
      });

      idCounter++;
    }
  }

  return universes;
}

export const UNIVERSE_LIST: UniverseDef[] = buildUniverses();

export function getUniverseById(id: string): UniverseDef | undefined {
  return UNIVERSE_LIST.find((u) => u.id === id);
}

export function getUniversesByRealmSystem(realmSystemId: string): UniverseDef[] {
  return UNIVERSE_LIST.filter((u) => u.realmSystemId === realmSystemId);
}

export function getUniversesByDifficulty(difficulty: UniverseDef["difficulty"]): UniverseDef[] {
  return UNIVERSE_LIST.filter((u) => u.difficulty === difficulty);
}

export function getActiveUniverses(): UniverseDef[] {
  return UNIVERSE_LIST.filter((u) => u.isActive);
}

export function getSeasonalUniverses(): UniverseDef[] {
  return UNIVERSE_LIST.filter((u) => u.isSeasonal);
}

export function getPermanentUniverses(): UniverseDef[] {
  return UNIVERSE_LIST.filter((u) => !u.isSeasonal);
}

export function getMigrationPlan(universeId: string): { canMigrate: boolean; targetUniverse?: string; cost?: number } {
  const universe = getUniverseById(universeId);
  if (!universe) return { canMigrate: false };

  const sameSystem = getUniversesByRealmSystem(universe.realmSystemId)
    .filter((u) => u.id !== universeId && u.isActive);

  if (sameSystem.length === 0) return { canMigrate: false };

  return {
    canMigrate: true,
    targetUniverse: sameSystem[0].id,
    cost: 5000,
  };
}

export function getRealmSystems(): { id: string; name: string; description: string; universeCount: number }[] {
  return REALM_SYSTEMS.map((rs) => ({
    id: rs.id,
    name: rs.name,
    description: rs.description,
    universeCount: rs.universes,
  }));
}
