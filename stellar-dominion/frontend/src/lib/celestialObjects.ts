// Celestial Object Types and Classifications

// PLANET TYPES
export type PlanetSize = "tiny" | "small" | "medium" | "large" | "massive" | "super-earth" | "neptune" | "jovian";
export type PlanetClass = 
  | "terrestrial" // Rocky planets
  | "oceanic" // Water-covered
  | "desert" | "jungle" | "tundra" | "volcanic" | "toxic"
  | "artificial" // Man-made structures
  | "rogue"; // Wandering planets

export type PlanetType = 
  | "barren" | "temperate" | "tropical" | "arctic" | "molten" | "frozen"
  | "toxic-gas" | "irradiated" | "high-gravity" | "low-gravity"
  | "paradisial" | "hellish" | "sentient";

export interface Planet {
  id: string; // Unique identifier e.g., "PLANET-001" or UUID
  name: string;
  size: PlanetSize;
  class: PlanetClass;
  type: PlanetType;
  coordinates: string; // Galaxy:Sector:Position
  diameter: number; // km
  mass: number; // Earth masses
  gravity: number; // Earth gravity (1.0 = 1G)
  temperature: number; // Kelvin
  atmosphereComposition: string[]; // ["N2", "O2", "Ar", etc.]
  waterPercentage: number; // 0-100
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  habitability: number; // 0-100
  colonized: boolean;
  owner?: string; // Player username
}

// MOON TYPES
export type MoonSize = "tiny" | "small" | "medium" | "large";
export type MoonType = "barren" | "icy" | "rocky" | "volcanic" | "metallic" | "crystalline";
export type MoonClass = "satellite" | "captured-asteroid" | "artificial" | "binary-satellite" | "irregular";

export interface Moon {
  id: string;
  name: string;
  size: MoonSize;
  type: MoonType;
  class: MoonClass;
  coordinates: string; // Same as parent planet
  parentPlanetId: string; // Reference to orbiting planet
  diameter: number; // km
  orbitalPeriod: number; // Earth days
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  colonized: boolean;
  owner?: string;
}

// STAR TYPES
export type StarClass = "O" | "B" | "A" | "F" | "G" | "K" | "M" | "N" | "H"; // Spectral classification
export type StarType = 
  | "main-sequence" | "giant" | "supergiant" | "dwarf" | "white-dwarf" | "neutron-star" | "black-hole"
  | "red-giant" | "blue-supergiant" | "red-supergiant";

export interface Star {
  id: string;
  name: string;
  class: StarClass;
  type: StarType;
  coordinates: string; // Galaxy:Sector:Position
  luminosity: number; // Solar luminosities
  mass: number; // Solar masses
  temperature: number; // Kelvin
  age: number; // Million years
  radius: number; // Solar radii
  habitableZoneMin: number; // AU
  habitableZoneMax: number; // AU
  planetsCount: number;
}

// OTHER INTERSTELLAR OBJECTS
export type AsteroidSize = "tiny" | "small" | "medium" | "large";
export type AsteroidClass = "metallic" | "silicate" | "carbonaceous" | "icy" | "rare-earth" | "hybrid";

export interface Asteroid {
  id: string;
  name: string;
  size: AsteroidSize;
  class: AsteroidClass;
  coordinates: string;
  diameter: number; // km
  mass: number; // Earth masses
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
    rareEarth?: number;
  };
  orbitalPeriod?: number; // For asteroid belt members
  mined: boolean;
}

export type CometType = "short-period" | "long-period" | "hyperbolic" | "extinct";

export interface Comet {
  id: string;
  name: string;
  type: CometType;
  coordinates: string;
  coreSize: number; // km
  tailLength: number; // AU
  orbitalPeriod?: number; // Years
  nextApproach?: Date;
  resources: {
    ice: number;
    organics: number;
    dust: number;
  };
}

export type NebulaType = "emission" | "reflection" | "dark" | "planetary" | "supernova-remnant";

export interface Nebula {
  id: string;
  name: string;
  type: NebulaType;
  coordinates: string;
  diameter: number; // Light years
  brightness: number; // 0-100
  composition: string[]; // ["H-alpha", "O-III", "S-II", etc.]
  scientificValue: number; // Research potential 0-100
}

export interface BlackHole {
  id: string;
  name: string;
  coordinates: string;
  mass: number; // Solar masses
  schwarzschildRadius: number; // km
  accretionDiskTemperature: number; // Kelvin
  hawkingRadiation: boolean;
  danger: "extreme" | "critical" | "hazardous";
}

export interface Wormhole {
  id: string;
  name: string;
  startCoordinates: string;
  endCoordinates: string; // Can be far away in galaxy
  stability: number; // 0-100 (stability for transit)
  diameter: number; // km
  discovered: boolean;
  traversable: boolean;
  explorationValue: number; // 0-100
}

export interface AnomalyZone {
  id: string;
  name: string;
  type: string; // "sensor-blind", "radiation-field", "temporal-distortion", "dimensional-rift", "gravitational-anomaly"
  coordinates: string;
  radius: number; // AU
  danger: "low" | "medium" | "high" | "extreme";
  scientificValue: number;
  effects: string[]; // Effects on ships/sensors
}

export type SpaceObject = Planet | Moon | Star | Asteroid | Comet | Nebula | BlackHole | Wormhole | AnomalyZone;

// Helper interface for space coordinates
export interface Coordinates {
  galaxy: number;
  sector: number;
  position: number;
  toString(): string;
  fromString(coord: string): void;
}

// Star system (collection of objects orbiting a star)
export interface StarSystem {
  id: string;
  name: string;
  coordinates: string;
  primaryStar: Star;
  planets: Planet[];
  asteroids: Asteroid[];
  nebulas: Nebula[];
  wormholes: Wormhole[];
  anomalies: AnomalyZone[];
  explored: boolean;
  discoverer?: string;
  discoveryDate?: Date;
}

// Utility functions
export const PLANET_SIZES: PlanetSize[] = ["tiny", "small", "medium", "large", "massive", "super-earth", "neptune", "jovian"];
export const PLANET_CLASSES: PlanetClass[] = [
  "terrestrial", "oceanic", "desert", "jungle", "tundra", "volcanic", "toxic", "artificial", "rogue"
];
export const PLANET_TYPES: PlanetType[] = [
  "barren", "temperate", "tropical", "arctic", "molten", "frozen", "toxic-gas", "irradiated", 
  "high-gravity", "low-gravity", "paradisial", "hellish", "sentient"
];

export const MOON_SIZES: MoonSize[] = ["tiny", "small", "medium", "large"];
export const MOON_TYPES: MoonType[] = ["barren", "icy", "rocky", "volcanic", "metallic", "crystalline"];
export const MOON_CLASSES: MoonClass[] = ["satellite", "captured-asteroid", "artificial", "binary-satellite", "irregular"];

export const STAR_CLASSES: StarClass[] = ["O", "B", "A", "F", "G", "K", "M", "N", "H"];
export const STAR_TYPES: StarType[] = [
  "main-sequence", "giant", "supergiant", "dwarf", "white-dwarf", "neutron-star", "black-hole",
  "red-giant", "blue-supergiant", "red-supergiant"
];

export const ASTEROID_SIZES: AsteroidSize[] = ["tiny", "small", "medium", "large"];
export const ASTEROID_CLASSES: AsteroidClass[] = ["metallic", "silicate", "carbonaceous", "icy", "rare-earth", "hybrid"];

export const COMET_TYPES: CometType[] = ["short-period", "long-period", "hyperbolic", "extinct"];

export const NEBULA_TYPES: NebulaType[] = ["emission", "reflection", "dark", "planetary", "supernova-remnant"];

// Sample celestial objects for universe generation
export const CELESTIAL_NAMES = {
  planets: [
    "Kepler", "Proxima", "Tau Ceti", "Sirius", "Vega", "Rigel", "Aldebaran", "Polaris",
    "Deneb", "Altair", "Betelgeuse", "Antares", "Spica", "Arcturus", "Capella", "Pollux",
    "Canopus", "Achernar", "Wezen", "Adara", "Castor", "Shaula", "Bellatrix", "Alnitak",
    "Alnilam", "Mintaka", "Albireo", "Tarazed", "Rasalhague", "Enif", "Scheat", "Alpheratz"
  ],
  moons: [
    "Luna", "Titan", "Europa", "Ganymede", "Callisto", "Mimas", "Enceladus", "Miranda",
    "Ariel", "Triton", "Charon", "Hyperion", "Iapetus", "Tethys", "Dione", "Rhea",
    "Oberon", "Umbriel", "Proteus", "Phobos", "Deimos", "Io", "Amalthea", "Themis"
  ],
  stars: [
    "Alpha Centauri", "Sirius Prime", "Betelgeuse Major", "Vega Station", "Altair Hub",
    "Rigel Gate", "Deneb Point", "Polaris Gate", "Arcturus Core", "Canopus Nexus",
    "Spica Outpost", "Capella Station", "Antares Ring", "Aldebaran Sector", "Castor Node"
  ],
  asteroids: [
    "Ceres Prime", "Vesta", "Juno", "Pallas", "Astraea", "Hebe", "Iris", "Flora",
    "Metis", "Hygeia", "Parthenope", "Victoria", "Egeria", "Eunomia", "Themidia",
    "Koronis", "Themis", "Phocaea", "Maria", "Nemausa"
  ],
  comets: [
    "Halley", "Hale-Bopp", "Hyakutake", "Leonids", "Perseids", "Geminids", "Draconids",
    "Eta Aquarids", "Lyrids", "Quadrantids", "Ursids", "Taurids", "Andromedids"
  ],
  nebulas: [
    "Orion", "Crab", "Eagle", "Lagoon", "Trifid", "Horsehead", "Helix", "Pillars",
    "Veil", "Witch Head", "Rosette", "Cone", "Bubble", "North America", "Pelican",
    "Elephant Trunk", "Eta Carinae", "Ring", "Saturn", "Dumbbell"
  ],
  wormholes: [
    "Einstein Gate", "Schwarzschild Passage", "Quantum Bridge", "Fold Point Alpha",
    "Nexus Corridor", "Bridge of Light", "Cosmic Tunnel", "Void Gateway"
  ]
};

// ID generation helper
export function generateCelestialId(type: string, index: number): string {
  const typeCode = type.substring(0, 3).toUpperCase();
  return `${typeCode}-${String(index).padStart(6, '0')}`;
}

// Coordinate string helpers
export function formatCoordinates(galaxy: number, sector: number, position: number): string {
  return `${galaxy}:${sector}:${position}`;
}

export function parseCoordinates(coordString: string): { galaxy: number; sector: number; position: number } | null {
  const parts = coordString.split(":");
  if (parts.length !== 3) return null;
  return {
    galaxy: parseInt(parts[0]),
    sector: parseInt(parts[1]),
    position: parseInt(parts[2])
  };
}
