/**
 * Starfleet-Inspired Biome Catalog (90 entries)
 * A-Z biome matrix for planets, moons, colonies, space stations, starbases, and moon bases.
 */

export type BiomeEnvironmentType =
  | 'planet'
  | 'moon'
  | 'colony'
  | 'space-station'
  | 'starbase'
  | 'moon-base';

export type BiomeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface StarfleetBiomeEntry {
  id: string;
  code: string;
  letter: string;
  name: string;
  environmentType: BiomeEnvironmentType;
  biomeType: string;
  biomeSubType: string;
  class: string;
  subClass: string;
  size: 'micro' | 'small' | 'medium' | 'large' | 'massive' | 'mega';
  rank: number;
  title: string;
  rarity: BiomeRarity;
  colonyCapacity: number;
  description: string;
  hazards: string[];
  strategicUses: string[];
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const PLANET_NAMES_AZ = [
  'Aegis Arbor World', 'Borealis Basin Planet', 'Cryon Dune Sphere', 'Delta Rain Expanse',
  'Ember Rift Planet', 'Frontier Grove World', 'Gaia Trench Planet', 'Helios Plateau Sphere',
  'Ion Forest Planet', 'Jade Tundra World', 'Kepler Veld Planet', 'Luminous Marsh Sphere',
  'Mirage Canyon Planet', 'Nimbus Reef World', 'Obsidian Vale Planet', 'Pioneer Mesa Sphere',
  'Quantum Prairie Planet', 'Radiant Fjord World', 'Solstice Delta Planet', 'Tempest Garden Sphere',
  'Umbral Basin Planet', 'Verdant Crown World', 'Warden Hollow Planet', 'Xenon Shelf Sphere',
  'Yonder Spire Planet', 'Zenith Haven World',
];

const MOON_NAMES_AZ = [
  'Aster Lunar Reach', 'Bastion Crater Moon', 'Crescent Ice Moon', 'Drift Ash Moon',
  'Eclipse Ring Moon', 'Frostfall Basin Moon', 'Glimmer Ridge Moon', 'Harbor Dust Moon',
  'Ivory Crag Moon', 'Junction Orbital Moon', 'Kiteglass Moon', 'Lattice Scar Moon',
  'Monolith Moon', 'Nadir Dust Moon', 'Oracle Tide Moon', 'Palisade Moon',
  'Quarry Moon', 'Rimevault Moon', 'Sentinel Moon', 'Talon Moon',
  'Umbra Moon', 'Vanguard Moon', 'Whisper Moon', 'Xylo Moon',
  'Yardlight Moon', 'Zephyr Moon',
];

const COLONY_NAMES_AZ = [
  'Aurora Colony Arc', 'Beacon Colony Belt', 'Citadel Colony Verge', 'Dominion Colony Reach',
  'Eden Colony Terrace', 'Foundry Colony Frontier', 'Garrison Colony Delta', 'Harvester Colony Ring',
  'Ingot Colony Shelf', 'Jubilee Colony Port', 'Keystone Colony Point', 'Lifeline Colony Fold',
  'Meridian Colony Span', 'Nexus Colony Path', 'Outrider Colony Field', 'Prosper Colony Zone',
  'Quorum Colony Hub', 'Relay Colony Bastion', 'Summit Colony Step', 'Transit Colony Arch',
  'Unity Colony Mesh', 'Venture Colony Rise', 'Waypoint Colony Chain', 'Xeno Colony Axis',
  'Yard Colony Terrace', 'Zen Colony Anchor',
];

const BIOME_TYPES = [
  'temperate', 'arid', 'cryogenic', 'storm', 'volcanic', 'oceanic',
  'jungle', 'mountain', 'industrial', 'research', 'frontier', 'orbital',
];

const SUB_TYPES = [
  'garden-core', 'dust-sea', 'ice-ridge', 'thunder-belt', 'magma-fold', 'reefband',
  'canopy-lattice', 'highland-step', 'forge-grid', 'sensor-web', 'expedition-port', 'trade-spine',
];

const CLASSES = ['civilian', 'command', 'science', 'defense', 'industrial', 'expedition'];
const SUB_CLASSES = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'sigma'];
const TITLES = ['Cadet', 'Ensign', 'Lieutenant', 'Commander', 'Captain', 'Fleet Admiral'];
const SIZES: StarfleetBiomeEntry['size'][] = ['micro', 'small', 'medium', 'large', 'massive', 'mega'];

function rarityForRank(rank: number): BiomeRarity {
  if (rank >= 85) return 'legendary';
  if (rank >= 70) return 'epic';
  if (rank >= 50) return 'rare';
  if (rank >= 30) return 'uncommon';
  return 'common';
}

function createBiomeEntry(
  index: number,
  name: string,
  environmentType: BiomeEnvironmentType,
): StarfleetBiomeEntry {
  const letter = ALPHABET[index % ALPHABET.length];
  const rank = 10 + index;
  const biomeType = BIOME_TYPES[index % BIOME_TYPES.length];
  const biomeSubType = SUB_TYPES[index % SUB_TYPES.length];
  const cls = CLASSES[index % CLASSES.length];
  const subClass = SUB_CLASSES[index % SUB_CLASSES.length];
  const size = SIZES[index % SIZES.length];
  const title = TITLES[Math.min(TITLES.length - 1, Math.floor(rank / 18))];

  return {
    id: `${environmentType}-${letter.toLowerCase()}-${(index + 1).toString().padStart(2, '0')}`,
    code: `${letter}-${environmentType.substring(0, 3).toUpperCase()}-${(index + 1).toString().padStart(2, '0')}`,
    letter,
    name,
    environmentType,
    biomeType,
    biomeSubType,
    class: cls,
    subClass,
    size,
    rank,
    title,
    rarity: rarityForRank(rank),
    colonyCapacity: Math.max(1, Math.floor(rank / 8)),
    description: `${name} is a ${biomeType} ${environmentType} biome with ${biomeSubType} behavior and ${cls}-${subClass} doctrine.`,
    hazards: [
      `${biomeType} instability`,
      `${biomeSubType} disruption`,
      `${environmentType} logistics strain`,
    ],
    strategicUses: [
      `${cls} operations`,
      `${subClass} fleet staging`,
      `rare resource routing`,
    ],
  };
}

const PLANET_BIOMES = PLANET_NAMES_AZ.map((name, idx) => createBiomeEntry(idx, name, 'planet'));
const MOON_BIOMES = MOON_NAMES_AZ.map((name, idx) => createBiomeEntry(idx + 26, name, 'moon'));
const COLONY_BIOMES = COLONY_NAMES_AZ.map((name, idx) => createBiomeEntry(idx + 52, name, 'colony'));

const INSTALLATION_BIOME_NAMES = [
  'Aegis Spacedock Array',
  'Bulwark Starbase Ring',
  'Citadel Moon Base Vault',
  'Dockline Space Station Yards',
  'Ember Starbase Relay',
  'Fortress Moon Base Grid',
  'Gateway Space Station Nexus',
  'Harbor Starbase Command',
  'Ironhold Moon Base Forge',
  'Junction Space Station Core',
  'Keystone Starbase Bastion',
  'Lattice Moon Base Anchor',
];

const INSTALLATION_TYPES: BiomeEnvironmentType[] = [
  'space-station', 'starbase', 'moon-base',
  'space-station', 'starbase', 'moon-base',
  'space-station', 'starbase', 'moon-base',
  'space-station', 'starbase', 'moon-base',
];

const INSTALLATION_BIOMES = INSTALLATION_BIOME_NAMES.map((name, idx) =>
  createBiomeEntry(idx + 78, name, INSTALLATION_TYPES[idx]),
);

export const STARFLEET_BIOME_CATALOG_90: StarfleetBiomeEntry[] = [
  ...PLANET_BIOMES,
  ...MOON_BIOMES,
  ...COLONY_BIOMES,
  ...INSTALLATION_BIOMES,
];

export const STARFLEET_BIOME_CATALOG_META = {
  total: STARFLEET_BIOME_CATALOG_90.length,
  lettersCovered: ALPHABET,
  byEnvironment: {
    planet: STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.environmentType === 'planet').length,
    moon: STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.environmentType === 'moon').length,
    colony: STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.environmentType === 'colony').length,
    spaceStation: STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.environmentType === 'space-station').length,
    starbase: STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.environmentType === 'starbase').length,
    moonBase: STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.environmentType === 'moon-base').length,
  },
};

export function getBiomeById(id: string): StarfleetBiomeEntry | undefined {
  return STARFLEET_BIOME_CATALOG_90.find((entry) => entry.id === id);
}

export function getBiomesByEnvironment(environmentType: BiomeEnvironmentType): StarfleetBiomeEntry[] {
  return STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.environmentType === environmentType);
}

export function getBiomesByLetter(letter: string): StarfleetBiomeEntry[] {
  const normalized = letter.trim().toUpperCase();
  return STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.letter === normalized);
}

export function getBiomesByRarity(rarity: BiomeRarity): StarfleetBiomeEntry[] {
  return STARFLEET_BIOME_CATALOG_90.filter((entry) => entry.rarity === rarity);
}
