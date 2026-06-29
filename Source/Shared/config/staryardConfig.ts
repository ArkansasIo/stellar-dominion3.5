/**
 * Staryard Configuration
 * 18 categories, 32 sub-categories, 1-99 tiers
 * Full hierarchy: classes, sub-classes, types, sub-types
 * Names, ranks, titles, stats, sub-stats
 * Descriptions, sub-descriptions, details information
 * Attributes, sub-attributes
 * Subjects with detailed information
 * Linked to 1-999 level system (see progressionSystem.ts)
 */

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface StaryardStats {
  hull: number;
  shields: number;
  firepower: number;
  speed: number;
  range: number;
  cargo: number;
}

export interface StaryardSubStats {
  hullRegen: number;
  shieldRegen: number;
  critChance: number;
  evasion: number;
  accuracy: number;
  fuelEfficiency: number;
}

export interface StaryardAttributes {
  tier: number;
  levelMin: number;
  levelMax: number;
  rank: string;
  title: string;
  class: string;
  subClass: string;
}

export interface StaryardSubAttributes {
  faction: string;
  doctrine: string;
  specialization: string;
  formation: string;
}

export interface StaryardSubject {
  name: string;
  description: string;
  detail: string;
  category: string;
}

export interface StaryardTierEntry {
  id: string;
  tier: number;
  name: string;
  rank: string;
  title: string;
  category: string;
  subCategory: string;
  class: string;
  subClass: string;
  type: string;
  subType: string;
  description: string;
  subDescription: string;
  stats: StaryardStats;
  subStats: StaryardSubStats;
  attributes: StaryardAttributes;
  subAttributes: StaryardSubAttributes;
  subjects: StaryardSubject[];
  levelRange: { min: number; max: number };
}

export interface StaryardCategory {
  id: string;
  name: string;
  description: string;
  subCategoryIds: string[];
  primaryClass: string;
  primaryType: string;
}

export interface StaryardSubCategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  tierModifier: number;
  subType: string;
}

// ─── 18 Categories ───────────────────────────────────────────────────────────

const CATEGORY_DEFS: Array<{
  name: string;
  desc: string;
  class: string;
  type: string;
}> = [
  { name: 'Alpha Strike Corps',        desc: 'Fast-attack and assault strike operations',                  class: 'Assault',       type: 'Strike'    },
  { name: 'Vanguard Assault Division', desc: 'Front-line breakthrough and anti-capital operations',        class: 'Vanguard',      type: 'Assault'   },
  { name: 'Shield Wall Garrison',      desc: 'Defensive perimeter and point-defense operations',           class: 'Defense',       type: 'Shield'    },
  { name: 'Fortress Bastion Order',    desc: 'Hardened core defense and siege resistance',                 class: 'Fortress',      type: 'Bastion'   },
  { name: 'Fleet Command Bridge',      desc: 'Strategic command, control, and coordination',               class: 'Command',       type: 'Fleet'     },
  { name: 'Carrier Battle Group',      desc: 'Multi-role and assault carrier operations',                  class: 'Carrier',       type: 'Battle'    },
  { name: 'Rapid Strike Wing',         desc: 'High-speed rapid deployment and forward scouting',           class: 'Rapid',         type: 'Strike'    },
  { name: 'Deep Space Escort Fleet',   desc: 'Convoy protection and deep space patrol operations',         class: 'Escort',        type: 'Patrol'    },
  { name: 'Electronic Warfare Division', desc: 'ECM, SIGINT, and electronic countermeasure operations',   class: 'Electronic',    type: 'Warfare'   },
  { name: 'Sensor Intelligence Network', desc: 'Long-range scanning, ELINT, and intelligence gathering',  class: 'Sensor',        type: 'Intel'     },
  { name: 'Celestial Mining Guild',    desc: 'Mineral survey and heavy resource extraction operations',    class: 'Industrial',    type: 'Mining'    },
  { name: 'Supply Chain Logistics',    desc: 'Fuel depots, cargo transport, and fleet sustainment',        class: 'Logistics',     type: 'Supply'    },
  { name: 'Colonial Vanguard Corps',   desc: 'Advance colonization scouting and settlement operations',    class: 'Civilian',      type: 'Colonial'  },
  { name: 'Research & Science Division', desc: 'Deep space research, science platforms, and astrometry', class: 'Science',       type: 'Research'  },
  { name: 'Siege Engine Battalion',    desc: 'Orbital bombardment and planetary surface assault',          class: 'Siege',         type: 'Bombardment'},
  { name: 'Medical Corps Division',    desc: 'Mobile trauma bays and fleet medical recovery operations',   class: 'Medical',       type: 'Support'   },
  { name: 'Special Operations Force',  desc: 'Black ops, infiltration, and covert strike missions',        class: 'SpecOps',       type: 'Covert'    },
  { name: 'Titan Ascendant Order',     desc: 'Supreme tier command and titan-class vanguard operations',   class: 'Titan',         type: 'Ascendant' },
];

export const STARYARD_CATEGORIES: StaryardCategory[] = CATEGORY_DEFS.map((def, idx) => ({
  id: `staryard-cat-${String(idx + 1).padStart(2, '0')}`,
  name: def.name,
  description: def.desc,
  subCategoryIds: [],   // populated after sub-categories are created
  primaryClass: def.class,
  primaryType: def.type,
}));

// ─── 32 Sub-Categories ───────────────────────────────────────────────────────

// (catIndex is 0-based index into STARYARD_CATEGORIES)
const SUB_CATEGORY_DEFS: Array<{
  name: string;
  desc: string;
  catIndex: number;
  subType: string;
  tierModifier: number;
}> = [
  { name: 'Interceptor Squadron',      desc: 'High-speed anti-fighter interdiction',          catIndex: 0,  subType: 'Interceptor',        tierModifier: 1.05 },
  { name: 'Bomber Wing',               desc: 'Heavy assault bombing runs against capital ships', catIndex: 0, subType: 'Bomber',             tierModifier: 1.08 },
  { name: 'Strike Package Unit',       desc: 'Coordinated breakthrough assault packages',     catIndex: 1,  subType: 'Strike Package',      tierModifier: 1.06 },
  { name: 'Anti-Capital Team',         desc: 'Specialized anti-capital ship kill teams',      catIndex: 1,  subType: 'Anti-Capital',        tierModifier: 1.10 },
  { name: 'Point Defense Battery',     desc: 'Close-range missile and fighter interception',  catIndex: 2,  subType: 'Point Defense',       tierModifier: 1.04 },
  { name: 'Perimeter Guard Screen',    desc: 'Outer perimeter patrol and threat screening',   catIndex: 2,  subType: 'Perimeter Guard',     tierModifier: 1.03 },
  { name: 'Hardened Core Unit',        desc: 'Fortified core defense with reinforced armor',  catIndex: 3,  subType: 'Hardened Core',       tierModifier: 1.07 },
  { name: 'Siege Resistance Force',    desc: 'Counter-siege and breach resistance operations', catIndex: 3, subType: 'Siege Resistance',    tierModifier: 1.06 },
  { name: 'Task Force HQ',             desc: 'Tactical task force command and coordination',  catIndex: 4,  subType: 'Task Force',          tierModifier: 1.08 },
  { name: 'Strategic C2 Bridge',       desc: 'Strategic command and control bridge ops',      catIndex: 4,  subType: 'Strategic C2',        tierModifier: 1.10 },
  { name: 'Black Ops Command Cell',    desc: 'Fleet admiral covert command cell operations',  catIndex: 16, subType: 'Black Ops',            tierModifier: 1.12 },
  { name: 'Multi-Role Carrier Wing',   desc: 'Flexible multi-mission carrier wing operations', catIndex: 5, subType: 'Multi-Role Carrier',  tierModifier: 1.07 },
  { name: 'Assault Carrier Group',     desc: 'Offensive assault carrier group operations',    catIndex: 5,  subType: 'Assault Carrier',     tierModifier: 1.09 },
  { name: 'Rapid Deployment Strike',   desc: 'Fast-response rapid deployment strike units',   catIndex: 6,  subType: 'Rapid Deployment',    tierModifier: 1.06 },
  { name: 'Forward Scout Unit',        desc: 'Advance forward reconnaissance scouting',       catIndex: 6,  subType: 'Forward Scout',       tierModifier: 1.04 },
  { name: 'Convoy Defense Screen',     desc: 'Escort and defense of supply convoys',          catIndex: 7,  subType: 'Convoy Defense',      tierModifier: 1.03 },
  { name: 'Patrol Escort Unit',        desc: 'Regular patrol and escort operations',          catIndex: 7,  subType: 'Patrol Escort',       tierModifier: 1.02 },
  { name: 'ECM Battery Group',         desc: 'Electronic countermeasure battery operations',  catIndex: 8,  subType: 'ECM Battery',         tierModifier: 1.05 },
  { name: 'SIGINT Collection Node',    desc: 'Signals intelligence collection network',       catIndex: 8,  subType: 'SIGINT Node',         tierModifier: 1.06 },
  { name: 'Deep Scan Array',           desc: 'Long-range deep space scanning array',          catIndex: 9,  subType: 'Deep Scan',           tierModifier: 1.04 },
  { name: 'ELINT Network Hub',         desc: 'Electronic intelligence network hub',           catIndex: 9,  subType: 'ELINT Hub',           tierModifier: 1.05 },
  { name: 'Mineral Survey Team',       desc: 'Systematic mineral deposit survey operations',  catIndex: 10, subType: 'Mineral Survey',      tierModifier: 1.03 },
  { name: 'Heavy Extraction Rig',      desc: 'Large-scale resource extraction platform',      catIndex: 10, subType: 'Heavy Extraction',    tierModifier: 1.04 },
  { name: 'Fuel Depot Station',        desc: 'Mobile refueling and fuel depot operations',    catIndex: 11, subType: 'Fuel Depot',          tierModifier: 1.02 },
  { name: 'Cargo Transport Unit',      desc: 'Bulk cargo transport and logistics fleet',      catIndex: 11, subType: 'Cargo Transport',     tierModifier: 1.02 },
  { name: 'Advance Scout Force',       desc: 'Colonial advance scouting and survey force',    catIndex: 12, subType: 'Advance Scout',       tierModifier: 1.03 },
  { name: 'Settlement Ship Unit',      desc: 'Colonization and settlement ship operations',   catIndex: 12, subType: 'Settlement Ship',     tierModifier: 1.04 },
  { name: 'Science Platform Array',    desc: 'Deep space science platform research ops',      catIndex: 13, subType: 'Science Platform',    tierModifier: 1.05 },
  { name: 'Astrometry Station Hub',    desc: 'Stellar cartography and astrometry station',    catIndex: 13, subType: 'Astrometry Station',  tierModifier: 1.04 },
  { name: 'Orbital Bombardment Group', desc: 'Precision orbital bombardment operations',      catIndex: 14, subType: 'Orbital Bombardment', tierModifier: 1.11 },
  { name: 'Trauma Bay Unit',           desc: 'Mobile trauma bay and emergency medical ops',   catIndex: 15, subType: 'Trauma Bay',          tierModifier: 1.02 },
  { name: 'Titan Vanguard Order',      desc: 'Titan-class supreme vanguard command order',    catIndex: 17, subType: 'Titan Vanguard',      tierModifier: 1.20 },
];

export const STARYARD_SUB_CATEGORIES: StaryardSubCategory[] = SUB_CATEGORY_DEFS.map((def, idx) => ({
  id: `staryard-sub-${String(idx + 1).padStart(2, '0')}`,
  categoryId: STARYARD_CATEGORIES[def.catIndex].id,
  name: def.name,
  description: def.desc,
  tierModifier: def.tierModifier,
  subType: def.subType,
}));

// Populate subCategoryIds on each category after sub-categories are defined
STARYARD_SUB_CATEGORIES.forEach((sub) => {
  const cat = STARYARD_CATEGORIES.find((c) => c.id === sub.categoryId);
  if (cat) cat.subCategoryIds.push(sub.id);
});

// ─── Tier Rank & Title Tables ─────────────────────────────────────────────────

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const;

const RANK_GROUPS = [
  'Novice', 'Apprentice', 'Journeyman', 'Veteran',
  'Expert', 'Master', 'Grandmaster', 'Champion',
  'Legend', 'Ascendant',
] as const;

// Tiers 1-9 → Novice I-IX; Tiers 10-99 → each of the remaining 9 groups for 10 tiers
function getTierRank(tier: number): string {
  if (tier <= 9) return `${RANK_GROUPS[0]} ${ROMAN[tier - 1]}`;
  const groupIdx = 1 + Math.floor((tier - 10) / 10);   // 1..9
  const romanIdx = (tier - 10) % 10;                    // 0..9
  const safeGroup = RANK_GROUPS[Math.min(groupIdx, RANK_GROUPS.length - 1)];
  return `${safeGroup} ${ROMAN[romanIdx]}`;
}

const TITLE_LIST = [
  'Cadet', 'Ensign', 'Ensign First Class', 'Junior Lieutenant', 'Lieutenant',
  'Senior Lieutenant', 'Lieutenant Commander', 'Commander', 'Senior Commander',
  'Captain', 'Fleet Captain', 'Commodore', 'Rear Admiral', 'Vice Admiral',
  'Admiral', 'Fleet Admiral', 'Grand Admiral', 'Supreme Commander',
] as const;

function getTierTitle(tier: number): string {
  const titlesPerGroup = Math.floor(99 / TITLE_LIST.length);
  return TITLE_LIST[Math.floor((tier - 1) / Math.max(titlesPerGroup, 1)) % TITLE_LIST.length];
}

// ─── Class/SubClass tables ────────────────────────────────────────────────────

const TIER_CLASSES = [
  'Recruit', 'Scout', 'Warrior', 'Guard', 'Sentinel',
  'Paladin', 'Champion', 'Titan', 'Ascendant', 'Sovereign',
] as const;

const TIER_SUBCLASSES = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
  'Sigma', 'Omega', 'Apex', 'Prime', 'Ultra',
] as const;

function getTierClass(tier: number): string {
  return TIER_CLASSES[Math.floor((tier - 1) / 10) % TIER_CLASSES.length];
}

function getTierSubClass(tier: number): string {
  return TIER_SUBCLASSES[(tier - 1) % TIER_SUBCLASSES.length];
}

// ─── Faction / Doctrine / Formation tables ────────────────────────────────────

const FACTIONS = [
  'Star Republic', 'Iron Dominion', 'Void Collective', 'Solar Covenant',
  'Nebula Confederation', 'Aether League', 'Quantum Union', 'Nova Alliance',
  'Deep Space Authority', 'Eclipse Order',
] as const;

const DOCTRINES = [
  'Blitzkrieg Assault', 'Fortress Defense', 'Electronic Supremacy', 'Resource Dominance',
  'Colonial Expansion', 'Scientific Advancement', 'Covert Operations', 'Carrier Strike',
  'Heavy Siege', 'Rapid Maneuver',
] as const;

const SPECIALIZATIONS = [
  'Anti-Fighter', 'Anti-Capital', 'Point Defense', 'Long-Range Strike',
  'Electronic Warfare', 'Resource Extraction', 'Colonization', 'Research',
  'Medical Support', 'Covert Ops',
] as const;

const FORMATIONS = [
  'Arrow Formation', 'Shield Wall', 'Dispersed Screen', 'Globe Formation',
  'Line Abreast', 'Column Formation', 'Diamond Pattern', 'Hammer & Anvil',
  'Pincer Maneuver', 'Orbital Ring',
] as const;

// ─── Stats Generator ─────────────────────────────────────────────────────────

function generateStats(tier: number): StaryardStats {
  const m = Math.pow(1.08, tier - 1);
  return {
    hull:      Math.floor(1_000  * m),
    shields:   Math.floor(800    * m),
    firepower: Math.floor(500    * m),
    speed:     Math.floor(100    * Math.pow(1.04, tier - 1)),
    range:     Math.floor(150    * Math.pow(1.03, tier - 1)),
    cargo:     Math.floor(5_000  * Math.pow(1.06, tier - 1)),
  };
}

function generateSubStats(tier: number): StaryardSubStats {
  const m = Math.pow(1.04, tier - 1);
  return {
    hullRegen:      Math.floor(10  * m * 100) / 100,
    shieldRegen:    Math.floor(8   * m * 100) / 100,
    critChance:     Math.min(Math.floor((0.5 + tier * 0.05) * 100) / 100, 50),
    evasion:        Math.min(Math.floor((1.0 + tier * 0.08) * 100) / 100, 60),
    accuracy:       Math.min(Math.floor((70  + tier * 0.25) * 100) / 100, 99),
    fuelEfficiency: Math.min(Math.floor((50  + tier * 0.3 ) * 100) / 100, 99),
  };
}

// ─── Subjects Generator ───────────────────────────────────────────────────────

const SUBJECT_TEMPLATES: Array<{
  name: string;
  descFn: (tier: number, cat: string) => string;
  detailFn: (tier: number, rank: string) => string;
  category: string;
}> = [
  {
    name: 'Combat Doctrine',
    descFn: (tier, cat) => `${cat} combat doctrine for tier ${tier} engagement rules.`,
    detailFn: (tier, rank) => `${rank} units follow strict engagement protocols scaled to threat level.`,
    category: 'Operations',
  },
  {
    name: 'Fleet Composition',
    descFn: (tier, cat) => `Standard ${cat} fleet composition at tier ${tier}.`,
    detailFn: (tier, rank) => `Fleet composed of ${tier * 2} vessels led by a ${rank} commander.`,
    category: 'Fleet',
  },
  {
    name: 'Technology Level',
    descFn: (tier, cat) => `${cat} tier ${tier} technology classification and access rights.`,
    detailFn: (tier, rank) => `Access to tier-${tier} weapons, armor, and systems. Requires ${rank} clearance.`,
    category: 'Technology',
  },
  {
    name: 'Resource Requirements',
    descFn: (tier, cat) => `Resource and maintenance requirements for tier ${tier} ${cat} operations.`,
    detailFn: (tier, rank) => `Requires ${tier * 1000} units of metal, ${tier * 800} crystal per cycle.`,
    category: 'Logistics',
  },
  {
    name: 'Training Standard',
    descFn: (tier, cat) => `Training requirements and standards for ${cat} tier ${tier} personnel.`,
    detailFn: (tier, rank) => `Personnel must achieve ${rank} certification before deployment.`,
    category: 'Personnel',
  },
];

function generateSubjects(tier: number, categoryName: string, rank: string): StaryardSubject[] {
  return SUBJECT_TEMPLATES.map((tpl) => ({
    name: tpl.name,
    description: tpl.descFn(tier, categoryName),
    detail: tpl.detailFn(tier, rank),
    category: tpl.category,
  }));
}

// ─── Level Range Computation ──────────────────────────────────────────────────
// Mirrors progressionSystem.ts: LEVELS_PER_TIER = 10, MAX_LEVEL = 999

const LEVELS_PER_TIER = 10;
const MAX_LEVEL = 999;

function getLevelRange(tier: number): { min: number; max: number } {
  const min = (tier - 1) * LEVELS_PER_TIER + 1;
  const max = Math.min(tier * LEVELS_PER_TIER, MAX_LEVEL);
  return { min, max };
}

// ─── Tier Entry Generator ─────────────────────────────────────────────────────

function generateTierEntry(tier: number): StaryardTierEntry {
  const catIdx     = (tier - 1) % STARYARD_CATEGORIES.length;      // 0-17
  const subCatIdx  = (tier - 1) % STARYARD_SUB_CATEGORIES.length;  // 0-31

  const cat    = STARYARD_CATEGORIES[catIdx];
  const subCat = STARYARD_SUB_CATEGORIES[subCatIdx];

  const rank     = getTierRank(tier);
  const title    = getTierTitle(tier);
  const cls      = getTierClass(tier);
  const subClass = getTierSubClass(tier);

  const facIdx   = (tier - 1) % FACTIONS.length;
  const docIdx   = (tier - 1) % DOCTRINES.length;
  const specIdx  = (tier - 1) % SPECIALIZATIONS.length;
  const formIdx  = (tier - 1) % FORMATIONS.length;

  const levelRange = getLevelRange(tier);

  return {
    id:           `staryard-tier-${String(tier).padStart(2, '0')}`,
    tier,
    name:         `${rank} ${cat.primaryType}`,
    rank,
    title,
    category:     cat.name,
    subCategory:  subCat.name,
    class:        cls,
    subClass,
    type:         cat.primaryType,
    subType:      subCat.subType,
    description:  `Tier ${tier} ${cat.name} unit. ${cat.description}.`,
    subDescription: `${subCat.name} sub-division specializing in ${subCat.description.toLowerCase()}.`,
    stats:        generateStats(tier),
    subStats:     generateSubStats(tier),
    attributes: {
      tier,
      levelMin:  levelRange.min,
      levelMax:  levelRange.max,
      rank,
      title,
      class:     cls,
      subClass,
    },
    subAttributes: {
      faction:        FACTIONS[facIdx],
      doctrine:       DOCTRINES[docIdx],
      specialization: SPECIALIZATIONS[specIdx],
      formation:      FORMATIONS[formIdx],
    },
    subjects:  generateSubjects(tier, cat.name, rank),
    levelRange,
  };
}

// ─── Full Tier Catalog (1-99) ─────────────────────────────────────────────────

export const STARYARD_TIER_CATALOG: StaryardTierEntry[] =
  Array.from({ length: 99 }, (_, i) => generateTierEntry(i + 1));

// ─── Lookup Helpers ───────────────────────────────────────────────────────────

export function getStaryardTierEntry(tier: number): StaryardTierEntry | undefined {
  if (tier < 1 || tier > 99) return undefined;
  return STARYARD_TIER_CATALOG[tier - 1];
}

export function getStaryardTiersByCategory(categoryName: string): StaryardTierEntry[] {
  return STARYARD_TIER_CATALOG.filter((e) => e.category === categoryName);
}

export function getStaryardTiersBySubCategory(subCategoryName: string): StaryardTierEntry[] {
  return STARYARD_TIER_CATALOG.filter((e) => e.subCategory === subCategoryName);
}

export function getStaryardTiersByClass(cls: string): StaryardTierEntry[] {
  return STARYARD_TIER_CATALOG.filter((e) => e.class === cls);
}

export function getStaryardCategoryById(id: string): StaryardCategory | undefined {
  return STARYARD_CATEGORIES.find((c) => c.id === id);
}

export function getStaryardSubCategoryById(id: string): StaryardSubCategory | undefined {
  return STARYARD_SUB_CATEGORIES.find((s) => s.id === id);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const STARYARD_META = {
  totalTiers:         STARYARD_TIER_CATALOG.length,
  totalCategories:    STARYARD_CATEGORIES.length,
  totalSubCategories: STARYARD_SUB_CATEGORIES.length,
  maxTier:            99,
  minTier:            1,
  maxLevel:           MAX_LEVEL,
  minLevel:           1,
  levelsPerTier:      LEVELS_PER_TIER,
  rankGroups:         [...RANK_GROUPS],
  titleList:          [...TITLE_LIST],
  tierClasses:        [...TIER_CLASSES],
  tierSubClasses:     [...TIER_SUBCLASSES],
  factions:           [...FACTIONS],
  doctrines:          [...DOCTRINES],
  specializations:    [...SPECIALIZATIONS],
  formations:         [...FORMATIONS],
};
