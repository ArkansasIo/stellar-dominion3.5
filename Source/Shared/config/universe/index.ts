// Universe configuration exports
export const UNIVERSE_SETTINGS = {
  galaxies: 9,
  quadrantsPerGalaxy: 4,
  sectorsPerQuadrant: 100,
  systemsPerSector: 5,
  planetsPerSystem: 8,
  maxLinksPerSector: 10,
  universeSize: 500,
  wormholeChance: 0.02,
  nebulaChance: 0.05,
  asteroidBeltChance: 0.08,
  blackHoleChance: 0.01,
} as const;

export type UniverseSettings = typeof UNIVERSE_SETTINGS;
