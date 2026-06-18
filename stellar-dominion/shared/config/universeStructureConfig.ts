export type CelestialFamily =
  | "galaxy"
  | "star"
  | "planet"
  | "moon"
  | "asteroid"
  | "meteoroid"
  | "comet"
  | "nebula"
  | "wormhole"
  | "black-hole"
  | "biome";

export interface CelestialObject {
  id: string;
  name: string;
  family: CelestialFamily;
  type: string;
  subType: string;
  class: string;
  subClass: string;
  description: string;
  characteristics: {
    [key: string]: any;
  };
}

// ===========================================================================
// GALAXIES
// ===========================================================================

const GALAXIES: CelestialObject[] = [
  // A
  {
    id: "galaxy-001",
    name: "Andromeda",
    family: "galaxy",
    type: "spiral",
    subType: "barred",
    class: "SA(s)b",
    subClass: "grand-design",
    description: "A majestic spiral galaxy, the closest major galaxy to the Milky Way.",
    characteristics: { age: "10 billion years", stars: "1 trillion" },
  },
  // B
  {
    id: "galaxy-002",
    name: "Bode's Galaxy",
    family: "galaxy",
    type: "spiral",
    subType: "unbarred",
    class: "SA(s)ab",
    subClass: "starburst",
    description: "Known for its bright, active star-forming regions.",
    characteristics: { age: "13.3 billion years", stars: "250 billion" },
  },
  // C
  {
    id: "galaxy-003",
    name: "Cartwheel Galaxy",
    family: "galaxy",
    type: "lenticular",
    subType: "ring",
    class: "S0-a",
    subClass: "collisional",
    description: "A rare ring galaxy formed from a collision with a smaller galaxy.",
    characteristics: { age: "200-300 million years (post-collision)", stars: "100 billion" },
  },
  // ... (and so on for all 26 letters)
];

// ===========================================================================
// STARS
// ===========================================================================

const STARS: CelestialObject[] = [
  // A
  {
    id: "star-001",
    name: "Alpha Centauri",
    family: "star",
    type: "G-type",
    subType: "main-sequence",
    class: "G2V",
    subClass: "yellow-dwarf",
    description: "The closest star system to the Sun.",
    characteristics: { mass: "1.1 M☉", temperature: "5790K" },
  },
  // B
  {
    id: "star-002",
    name: "Betelgeuse",
    family: "star",
    type: "M-type",
    subType: "red-supergiant",
    class: "M1-2Ia-Iab",
    subClass: "variable",
    description: "A massive, pulsating red supergiant, nearing the end of its life.",
    characteristics: { mass: "16.5–19 M☉", temperature: "3600K" },
  },
  // ... (and so on for all 26 letters)
];

// ===========================================================================
// PLANETS
// ===========================================================================

const PLANETS: CelestialObject[] = [
  // A
  {
    id: "planet-001",
    name: "Arrakis",
    family: "planet",
    type: "terrestrial",
    subType: "desert",
    class: "D",
    subClass: "arid",
    description: "A harsh desert world, the sole source of the valuable spice Melange.",
    characteristics: { gravity: "1.1g", atmosphere: "thin, breathable" },
  },
  // ... (and so on for all 26 letters)
];

// ===========================================================================
// MOONS
// ===========================================================================

const MOONS: CelestialObject[] = [
  // A
  {
    id: "moon-001",
    name: "Ariel",
    family: "moon",
    type: "icy",
    subType: "geologically-active",
    class: "uranian",
    subClass: "inner",
    description: "A moon of Uranus with a complex, cratered surface.",
    characteristics: { diameter: "1,157 km", orbit: "Uranus" },
  },
  // ... (and so on for all 26 letters)
];

// ===========================================================================
// ASTEROIDS
// ===========================================================================

const ASTEROIDS: CelestialObject[] = [
    // A
    {
      id: "asteroid-001",
      name: "Astraea",
      family: "asteroid",
      type: "S-type",
      subType: "stony",
      class: "main-belt",
      subClass: "Flora-family",
      description: "A large, stony asteroid in the main asteroid belt.",
      characteristics: { diameter: "119 km", composition: "silicates, nickel-iron" },
    },
    // B
    {
      id: "asteroid-002",
      name: "Bennu",
      family: "asteroid",
      type: "B-type",
      subType: "carbonaceous",
      class: "near-earth",
      subClass: "apollo-group",
      description: "A carbonaceous near-Earth asteroid, a target for sample return missions.",
      characteristics: { diameter: "490 m", composition: "carbon, organic molecules" },
    },
    // ... (and so on for all 26 letters)
];

// ===========================================================================
// BIOMES
// ===========================================================================

const BIOMES: CelestialObject[] = [
    // A
    {
        id: "biome-001",
        name: "Aquatic",
        family: "biome",
        type: "water-based",
        subType: "oceanic",
        class: "marine",
        subClass: "deep-sea",
        description: "A biome characterized by vast, deep oceans and a rich diversity of marine life.",
        characteristics: { flora: ["kelp-forests", "coral-reefs"], fauna: ["leviathans", "bio-luminescent-fish"] }
    },
    // B
    {
        id: "biome-002",
        name: "Boreal",
        family: "biome",
        type: "forest",
        subType: "taiga",
        class: "coniferous",
        subClass: "cold-climate",
        description: "A cold, northern forest biome dominated by coniferous trees.",
        characteristics: { flora: ["pine", "spruce"], fauna: ["bears", "wolves"] }
    },
    // ... (and so on for all 26 letters)
];

export const CELESTIAL_OBJECTS = {
  galaxies: GALAXIES,
  stars: STARS,
  planets: PLANETS,
  moons: MOONS,
  asteroids: ASTEROIDS,
  biomes: BIOMES,
};
