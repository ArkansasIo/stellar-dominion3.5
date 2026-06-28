/**
 * Starship Systems & Structures Taxonomy (240 entries)
 *
 * Covers:
 * - Starship Weapons
 * - Starship Shields
 * - Starship Armors
 * - Mothership Systems
 * - Starbase Systems
 * - Moon Base Systems
 * - Space Station Systems
 * - Planet Systems
 * - Moon Systems
 */

export type TaxonomyRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type TaxonomyCategory =
  | 'starship-weapon'
  | 'starship-shield'
  | 'starship-armor'
  | 'mothership'
  | 'starbase'
  | 'moon-base'
  | 'space-station'
  | 'planet'
  | 'moon';

export interface TaxonomyProfile {
  classes: string[];
  subClasses: string[];
  types: string[];
  subTypes: string[];
}

export interface StarshipStructureTaxonomyEntry {
  id: string;
  code: string;
  category: TaxonomyCategory;
  name: string;
  class: string;
  subClass: string;
  type: string;
  subType: string;
  tier: number;
  rank: number;
  rarity: TaxonomyRarity;
  description: string;
  tags: string[];
}

const COUNTS_BY_CATEGORY: Record<TaxonomyCategory, number> = {
  'starship-weapon': 30,
  'starship-shield': 30,
  'starship-armor': 30,
  mothership: 25,
  starbase: 25,
  'moon-base': 25,
  'space-station': 25,
  planet: 25,
  moon: 25,
};

const CATEGORY_LABELS: Record<TaxonomyCategory, string> = {
  'starship-weapon': 'Starship Weapon',
  'starship-shield': 'Starship Shield',
  'starship-armor': 'Starship Armor',
  mothership: 'Mothership',
  starbase: 'Starbase',
  'moon-base': 'Moon Base',
  'space-station': 'Space Station',
  planet: 'Planet',
  moon: 'Moon',
};

const PROFILES_BY_CATEGORY: Record<TaxonomyCategory, TaxonomyProfile> = {
  'starship-weapon': {
    classes: ['Projectile', 'Energy', 'Missile', 'Exotic'],
    subClasses: ['Light Battery', 'Line Battery', 'Heavy Battery', 'Siege Battery', 'Precision Battery'],
    types: ['Kinetic', 'Laser', 'Plasma', 'Rail', 'Fusion', 'Disruptor'],
    subTypes: ['Burst', 'Sustained', 'Penetrator', 'Scatter', 'Overcharged'],
  },
  'starship-shield': {
    classes: ['Deflection', 'Absorption', 'Adaptive', 'Flux'],
    subClasses: ['Escort Shield', 'Cruiser Shield', 'Battleship Shield', 'Fortress Shield', 'Aegis Shield'],
    types: ['Particle', 'Phase', 'Harmonic', 'Quantum', 'Reflective', 'Resonant'],
    subTypes: ['Pulse', 'Constant', 'Reactive', 'Regenerative', 'Barrier'],
  },
  'starship-armor': {
    classes: ['Composite', 'Reactive', 'Nanoforge', 'Ablative'],
    subClasses: ['Skirmish Plating', 'Line Plating', 'Siege Plating', 'Command Plating', 'Titan Plating'],
    types: ['Ceramic', 'Carbide', 'Titanium', 'Graphene', 'Voidsteel', 'Neutronium'],
    subTypes: ['Layered', 'Segmented', 'Interlocked', 'Adaptive', 'Shock-Damped'],
  },
  mothership: {
    classes: ['Command Core', 'Support Matrix', 'Carrier Frame', 'Strategic Relay'],
    subClasses: ['Flagship', 'War Carrier', 'Logistics Carrier', 'Research Carrier', 'Diplomatic Carrier'],
    types: ['Orbital', 'Deep Space', 'Assault', 'Recon', 'Terraforming'],
    subTypes: ['Prime', 'Vanguard', 'Sentinel', 'Bastion', 'Ascendant'],
  },
  starbase: {
    classes: ['Defense Hub', 'Resource Hub', 'Command Hub', 'Trade Hub'],
    subClasses: ['Perimeter', 'Citadel', 'Bastion', 'Anchor', 'Bulwark'],
    types: ['Orbital Grid', 'Missile Net', 'Hangar Cluster', 'Sensor Ring', 'Jammer Web'],
    subTypes: ['Forward', 'Central', 'Outer', 'Deep', 'High-Orbit'],
  },
  'moon-base': {
    classes: ['Excavation', 'Fortification', 'Observation', 'Refinery'],
    subClasses: ['Crater Outpost', 'Lava Tube Hub', 'Polar Station', 'Darkside Relay', 'Vault Complex'],
    types: ['Helium-3', 'Rare Earths', 'Cryo Labs', 'Shield Dome', 'Launch Array'],
    subTypes: ['Delta', 'Epsilon', 'Sigma', 'Omega', 'Tau'],
  },
  'space-station': {
    classes: ['Civilian', 'Military', 'Industrial', 'Scientific'],
    subClasses: ['Dockyard', 'Trade Nexus', 'Hospital Ring', 'Command Spire', 'Research Arcology'],
    types: ['Transit', 'Manufacturing', 'Defense', 'Diplomatic', 'Survey'],
    subTypes: ['Ring', 'Spire', 'Lattice', 'Cluster', 'Node'],
  },
  planet: {
    classes: ['Terrestrial', 'Gas Giant', 'Frozen', 'Exotic'],
    subClasses: ['Core World', 'Frontier World', 'Industrial World', 'Agri World', 'Research World'],
    types: ['Habitable', 'Arid', 'Oceanic', 'Volcanic', 'Stormbound'],
    subTypes: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Prime'],
  },
  moon: {
    classes: ['Rocky', 'Icy', 'Metallic', 'Fractured'],
    subClasses: ['Inner Moon', 'Outer Moon', 'Captured Moon', 'Resonant Moon', 'Tidal Moon'],
    types: ['Mining', 'Scientific', 'Military', 'Relay', 'Colony'],
    subTypes: ['Shard', 'Halo', 'Ridge', 'Veil', 'Echo'],
  },
};

function rarityForRank(rank: number): TaxonomyRarity {
  if (rank >= 210) return 'legendary';
  if (rank >= 160) return 'epic';
  if (rank >= 110) return 'rare';
  if (rank >= 60) return 'uncommon';
  return 'common';
}

function normalizeSegment(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function buildEntry(
  category: TaxonomyCategory,
  indexWithinCategory: number,
  globalRank: number,
  profile: TaxonomyProfile,
): StarshipStructureTaxonomyEntry {
  const cls = profile.classes[indexWithinCategory % profile.classes.length];
  const subClass = profile.subClasses[indexWithinCategory % profile.subClasses.length];
  const type = profile.types[indexWithinCategory % profile.types.length];
  const subType = profile.subTypes[indexWithinCategory % profile.subTypes.length];
  const tier = Math.min(12, Math.floor(indexWithinCategory / 2) + 1);

  const label = CATEGORY_LABELS[category];
  const serial = String(indexWithinCategory + 1).padStart(2, '0');
  const name = `${label} ${serial} ${type}`;
  const code = `${normalizeSegment(category).toUpperCase()}-${serial}`;

  return {
    id: `${normalizeSegment(category)}-${serial}`,
    code,
    category,
    name,
    class: cls,
    subClass,
    type,
    subType,
    tier,
    rank: globalRank,
    rarity: rarityForRank(globalRank),
    description: `${name} is a ${cls} / ${subClass} platform configured as ${type} (${subType}) for ${label.toLowerCase()} operations.`,
    tags: [category, normalizeSegment(cls), normalizeSegment(subClass), normalizeSegment(type), normalizeSegment(subType)],
  };
}

function generateCategoryEntries(
  category: TaxonomyCategory,
  startRank: number,
): StarshipStructureTaxonomyEntry[] {
  const count = COUNTS_BY_CATEGORY[category];
  const profile = PROFILES_BY_CATEGORY[category];

  return Array.from({ length: count }, (_, index) =>
    buildEntry(category, index, startRank + index, profile),
  );
}

function generateAllEntries240(): StarshipStructureTaxonomyEntry[] {
  const categories: TaxonomyCategory[] = [
    'starship-weapon',
    'starship-shield',
    'starship-armor',
    'mothership',
    'starbase',
    'moon-base',
    'space-station',
    'planet',
    'moon',
  ];

  let rankCursor = 1;
  const result: StarshipStructureTaxonomyEntry[] = [];

  for (const category of categories) {
    const entries = generateCategoryEntries(category, rankCursor);
    result.push(...entries);
    rankCursor += entries.length;
  }

  return result;
}

export const STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240: StarshipStructureTaxonomyEntry[] =
  generateAllEntries240();

export const STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_META = {
  total: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.length,
  countsByCategory: {
    starshipWeapon: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'starship-weapon').length,
    starshipShield: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'starship-shield').length,
    starshipArmor: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'starship-armor').length,
    mothership: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'mothership').length,
    starbase: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'starbase').length,
    moonBase: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'moon-base').length,
    spaceStation: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'space-station').length,
    planet: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'planet').length,
    moon: STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((e) => e.category === 'moon').length,
  },
};

export function getTaxonomyEntryById(id: string): StarshipStructureTaxonomyEntry | undefined {
  return STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.find((entry) => entry.id === id);
}

export function getTaxonomyEntriesByCategory(category: TaxonomyCategory): StarshipStructureTaxonomyEntry[] {
  return STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((entry) => entry.category === category);
}

export function getTaxonomyEntriesByClass(cls: string): StarshipStructureTaxonomyEntry[] {
  const normalized = cls.trim().toLowerCase();
  return STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((entry) => entry.class.toLowerCase() === normalized);
}

export function getTaxonomyEntriesBySubClass(subClass: string): StarshipStructureTaxonomyEntry[] {
  const normalized = subClass.trim().toLowerCase();
  return STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((entry) => entry.subClass.toLowerCase() === normalized);
}

export function getTaxonomyEntriesByType(type: string): StarshipStructureTaxonomyEntry[] {
  const normalized = type.trim().toLowerCase();
  return STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((entry) => entry.type.toLowerCase() === normalized);
}

export function getTaxonomyEntriesBySubType(subType: string): StarshipStructureTaxonomyEntry[] {
  const normalized = subType.trim().toLowerCase();
  return STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((entry) => entry.subType.toLowerCase() === normalized);
}

export function getTaxonomyEntriesByRarity(rarity: TaxonomyRarity): StarshipStructureTaxonomyEntry[] {
  return STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240.filter((entry) => entry.rarity === rarity);
}
