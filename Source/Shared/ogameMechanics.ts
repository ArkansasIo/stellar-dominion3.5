// ─── Game Object IDs (OGame v0.84) ───────────────────────────────────────────
export const GID = {
  // Buildings
  B_METAL_MINE: 1,
  B_CRYSTAL_MINE: 2,
  B_DEUT_SYNTH: 3,
  B_SOLAR_PLANT: 4,
  B_FUSION: 12,
  B_ROBOTS: 14,
  B_NANITES: 15,
  B_SHIPYARD: 21,
  B_METAL_STOR: 22,
  B_CRYSTAL_STOR: 23,
  B_DEUT_STOR: 24,
  B_RES_LAB: 31,
  B_TERRAFORMER: 33,
  B_ALLY_DEPOT: 34,
  B_LUNAR_BASE: 41,
  B_PHALANX: 42,
  B_JUMP_GATE: 43,
  B_MISS_SILO: 44,

  // Research
  R_ESPIONAGE: 106,
  R_COMPUTER: 108,
  R_WEAPON: 109,
  R_SHIELD: 110,
  R_ARMOUR: 111,
  R_ENERGY: 113,
  R_HYPERSPACE: 114,
  R_COMBUST_DRIVE: 115,
  R_IMPULSE_DRIVE: 117,
  R_HYPER_DRIVE: 118,
  R_LASER: 120,
  R_ION: 121,
  R_PLASMA: 122,
  R_IGN: 123,
  R_EXPEDITION: 124,
  R_GRAVITON: 199,

  // Fleet
  F_SC: 202,
  F_LC: 203,
  F_LF: 204,
  F_HF: 205,
  F_CRUISER: 206,
  F_BATTLESHIP: 207,
  F_COLON: 208,
  F_RECYCLER: 209,
  F_PROBE: 210,
  F_BOMBER: 211,
  F_SAT: 212,
  F_DESTRO: 213,
  F_DEATHSTAR: 214,
  F_BATTLECRUISER: 215,

  // Defense
  D_RL: 401,
  D_LL: 402,
  D_HL: 403,
  D_GAUSS: 404,
  D_ION: 405,
  D_PLASMA: 406,
  D_SDOME: 407,
  D_LDOME: 408,
  D_ABM: 502,
  D_IPM: 503,

  // Resources
  RC_METAL: 700,
  RC_CRYSTAL: 701,
  RC_DEUTERIUM: 702,
  RC_ENERGY: 703,
  RC_DM: 704,
} as const;

// ─── Object type arrays ──────────────────────────────────────────────────────
export const BUILDMAP: readonly number[] = [
  GID.B_METAL_MINE, GID.B_CRYSTAL_MINE, GID.B_DEUT_SYNTH, GID.B_SOLAR_PLANT,
  GID.B_FUSION, GID.B_ROBOTS, GID.B_NANITES, GID.B_SHIPYARD,
  GID.B_METAL_STOR, GID.B_CRYSTAL_STOR, GID.B_DEUT_STOR, GID.B_RES_LAB,
  GID.B_TERRAFORMER, GID.B_ALLY_DEPOT,
  GID.B_LUNAR_BASE, GID.B_PHALANX, GID.B_JUMP_GATE, GID.B_MISS_SILO,
];

export const RESMAP: readonly number[] = [
  GID.B_METAL_MINE, GID.B_CRYSTAL_MINE, GID.B_DEUT_SYNTH, GID.B_SOLAR_PLANT,
  GID.B_FUSION,
];

export const FLEETMAP: readonly number[] = [
  GID.F_SC, GID.F_LC, GID.F_LF, GID.F_HF, GID.F_CRUISER, GID.F_BATTLESHIP,
  GID.F_COLON, GID.F_RECYCLER, GID.F_PROBE, GID.F_BOMBER, GID.F_SAT,
  GID.F_DESTRO, GID.F_DEATHSTAR, GID.F_BATTLECRUISER,
];

export const DEFMAP: readonly number[] = [
  GID.D_RL, GID.D_LL, GID.D_HL, GID.D_GAUSS, GID.D_ION, GID.D_PLASMA,
  GID.D_SDOME, GID.D_LDOME, GID.D_ABM, GID.D_IPM,
];

export const TECHLIST: readonly number[] = [
  GID.R_ESPIONAGE, GID.R_COMPUTER, GID.R_WEAPON, GID.R_SHIELD,
  GID.R_ARMOUR, GID.R_ENERGY, GID.R_HYPERSPACE,
  GID.R_COMBUST_DRIVE, GID.R_IMPULSE_DRIVE, GID.R_HYPER_DRIVE,
  GID.R_LASER, GID.R_ION, GID.R_PLASMA, GID.R_IGN, GID.R_EXPEDITION,
  GID.R_GRAVITON,
];

const BUILDSET = new Set(BUILDMAP);
const RESOURCESET = new Set(RESMAP);
const FLEETSET = new Set(FLEETMAP);
const DEFSET = new Set(DEFMAP);
const TECHSET = new Set(TECHLIST);

// ─── Type checkers ──────────────────────────────────────────────────────────
export function isBuilding(id: number): boolean { return BUILDSET.has(id); }
export function isResource(id: number): boolean { return RESOURCESET.has(id); }
export function isFleet(id: number): boolean { return FLEETSET.has(id); }
export function isDefense(id: number): boolean { return DEFSET.has(id); }
export function isResearch(id: number): boolean { return TECHSET.has(id); }
export function isMissile(id: number): boolean { return id === GID.D_ABM || id === GID.D_IPM; }

// ─── Level 1 costs with growth factor ───────────────────────────────────────
export interface CostEntry {
  costs: Partial<Record<number, number>>;
  factor: number;
}

export const INITIAL_COSTS: Record<number, CostEntry> = {
  // Buildings
  [GID.B_METAL_MINE]:    { costs: { [GID.RC_METAL]: 60, [GID.RC_CRYSTAL]: 15 }, factor: 1.5 },
  [GID.B_CRYSTAL_MINE]:  { costs: { [GID.RC_METAL]: 48, [GID.RC_CRYSTAL]: 24 }, factor: 1.6 },
  [GID.B_DEUT_SYNTH]:    { costs: { [GID.RC_METAL]: 225, [GID.RC_CRYSTAL]: 75 }, factor: 1.5 },
  [GID.B_SOLAR_PLANT]:   { costs: { [GID.RC_METAL]: 75, [GID.RC_CRYSTAL]: 30 }, factor: 1.5 },
  [GID.B_FUSION]:        { costs: { [GID.RC_METAL]: 900, [GID.RC_CRYSTAL]: 360, [GID.RC_DEUTERIUM]: 180 }, factor: 1.8 },
  [GID.B_ROBOTS]:        { costs: { [GID.RC_METAL]: 400, [GID.RC_CRYSTAL]: 120, [GID.RC_DEUTERIUM]: 200 }, factor: 2 },
  [GID.B_NANITES]:       { costs: { [GID.RC_METAL]: 1_000_000, [GID.RC_CRYSTAL]: 500_000, [GID.RC_DEUTERIUM]: 100_000 }, factor: 2 },
  [GID.B_SHIPYARD]:      { costs: { [GID.RC_METAL]: 400, [GID.RC_CRYSTAL]: 200, [GID.RC_DEUTERIUM]: 100 }, factor: 2 },
  [GID.B_METAL_STOR]:    { costs: { [GID.RC_METAL]: 1000 }, factor: 2 },
  [GID.B_CRYSTAL_STOR]:  { costs: { [GID.RC_METAL]: 1000, [GID.RC_CRYSTAL]: 500 }, factor: 2 },
  [GID.B_DEUT_STOR]:     { costs: { [GID.RC_METAL]: 1000, [GID.RC_CRYSTAL]: 1000 }, factor: 2 },
  [GID.B_RES_LAB]:       { costs: { [GID.RC_METAL]: 200, [GID.RC_CRYSTAL]: 400, [GID.RC_DEUTERIUM]: 200 }, factor: 2 },
  [GID.B_TERRAFORMER]:   { costs: { [GID.RC_CRYSTAL]: 50_000, [GID.RC_DEUTERIUM]: 100_000, [GID.RC_ENERGY]: 1000 }, factor: 2 },
  [GID.B_ALLY_DEPOT]:    { costs: { [GID.RC_METAL]: 20_000, [GID.RC_CRYSTAL]: 40_000 }, factor: 2 },
  [GID.B_LUNAR_BASE]:    { costs: { [GID.RC_METAL]: 20_000, [GID.RC_CRYSTAL]: 40_000, [GID.RC_DEUTERIUM]: 20_000 }, factor: 2 },
  [GID.B_PHALANX]:       { costs: { [GID.RC_METAL]: 20_000, [GID.RC_CRYSTAL]: 40_000, [GID.RC_DEUTERIUM]: 20_000 }, factor: 2 },
  [GID.B_JUMP_GATE]:     { costs: { [GID.RC_METAL]: 2_000_000, [GID.RC_CRYSTAL]: 4_000_000, [GID.RC_DEUTERIUM]: 2_000_000 }, factor: 2 },
  [GID.B_MISS_SILO]:     { costs: { [GID.RC_METAL]: 20_000, [GID.RC_CRYSTAL]: 20_000, [GID.RC_DEUTERIUM]: 1000 }, factor: 2 },

  // Research
  [GID.R_ESPIONAGE]:     { costs: { [GID.RC_METAL]: 200, [GID.RC_CRYSTAL]: 1000, [GID.RC_DEUTERIUM]: 200 }, factor: 2 },
  [GID.R_COMPUTER]:      { costs: { [GID.RC_CRYSTAL]: 400, [GID.RC_DEUTERIUM]: 600 }, factor: 2 },
  [GID.R_WEAPON]:        { costs: { [GID.RC_METAL]: 800, [GID.RC_CRYSTAL]: 200 }, factor: 2 },
  [GID.R_SHIELD]:        { costs: { [GID.RC_METAL]: 200, [GID.RC_CRYSTAL]: 600 }, factor: 2 },
  [GID.R_ARMOUR]:        { costs: { [GID.RC_METAL]: 1000 }, factor: 2 },
  [GID.R_ENERGY]:        { costs: { [GID.RC_CRYSTAL]: 800, [GID.RC_DEUTERIUM]: 400 }, factor: 2 },
  [GID.R_HYPERSPACE]:    { costs: { [GID.RC_CRYSTAL]: 4000, [GID.RC_DEUTERIUM]: 2000 }, factor: 2 },
  [GID.R_COMBUST_DRIVE]: { costs: { [GID.RC_METAL]: 400, [GID.RC_DEUTERIUM]: 600 }, factor: 2 },
  [GID.R_IMPULSE_DRIVE]: { costs: { [GID.RC_METAL]: 2000, [GID.RC_CRYSTAL]: 4000, [GID.RC_DEUTERIUM]: 600 }, factor: 2 },
  [GID.R_HYPER_DRIVE]:   { costs: { [GID.RC_METAL]: 10_000, [GID.RC_CRYSTAL]: 20_000, [GID.RC_DEUTERIUM]: 6000 }, factor: 2 },
  [GID.R_LASER]:         { costs: { [GID.RC_METAL]: 200, [GID.RC_CRYSTAL]: 100 }, factor: 2 },
  [GID.R_ION]:           { costs: { [GID.RC_METAL]: 1000, [GID.RC_CRYSTAL]: 300, [GID.RC_DEUTERIUM]: 100 }, factor: 2 },
  [GID.R_PLASMA]:        { costs: { [GID.RC_METAL]: 2000, [GID.RC_CRYSTAL]: 4000, [GID.RC_DEUTERIUM]: 1000 }, factor: 2 },
  [GID.R_IGN]:           { costs: { [GID.RC_METAL]: 240_000, [GID.RC_CRYSTAL]: 400_000, [GID.RC_DEUTERIUM]: 160_000 }, factor: 2 },
  [GID.R_EXPEDITION]:    { costs: { [GID.RC_METAL]: 4000, [GID.RC_CRYSTAL]: 8000, [GID.RC_DEUTERIUM]: 4000 }, factor: 2 },
  [GID.R_GRAVITON]:      { costs: { [GID.RC_ENERGY]: 300_000 }, factor: 3 },
};

// ─── Unit parameters (structure/hull, shield, attack, cargo, speed, consumption) ──
export interface UnitParams {
  structure: number;
  shield: number;
  attack: number;
  cargo: number;
  speed: number;
  consumption: number;
}

export const UNIT_PARAMS: Record<number, UnitParams> = {
  // Ships
  [GID.F_SC]:        { structure: 400,   shield: 10,    attack: 5,     cargo: 5000,    speed: 5000,     consumption: 10 },
  [GID.F_LC]:        { structure: 1_200, shield: 25,    attack: 5,     cargo: 25_000,  speed: 7500,     consumption: 50 },
  [GID.F_LF]:        { structure: 400,   shield: 10,    attack: 50,    cargo: 50,      speed: 12_500,   consumption: 20 },
  [GID.F_HF]:        { structure: 1_000, shield: 25,    attack: 150,   cargo: 100,     speed: 10_000,   consumption: 75 },
  [GID.F_CRUISER]:   { structure: 2_700, shield: 50,    attack: 400,   cargo: 800,     speed: 15_000,   consumption: 300 },
  [GID.F_BATTLESHIP]:{ structure: 6_000, shield: 200,   attack: 1_000, cargo: 1_500,   speed: 10_000,   consumption: 500 },
  [GID.F_COLON]:     { structure: 30_000,shield: 100,   attack: 50,    cargo: 7_500,   speed: 2_500,    consumption: 1_000 },
  [GID.F_RECYCLER]:  { structure: 1_600, shield: 10,    attack: 1,     cargo: 20_000,  speed: 2_000,    consumption: 300 },
  [GID.F_PROBE]:     { structure: 1_000, shield: 0,     attack: 0,     cargo: 0,       speed: 100_000_000, consumption: 1 },
  [GID.F_BOMBER]:    { structure: 7_500, shield: 500,   attack: 1_000, cargo: 500,     speed: 7_000,    consumption: 1_000 },
  [GID.F_SAT]:       { structure: 2_000, shield: 1,     attack: 1,     cargo: 0,       speed: 0,        consumption: 0 },
  [GID.F_DESTRO]:    { structure: 11_000,shield: 500,   attack: 2_000, cargo: 2_000,   speed: 5_000,    consumption: 1_000 },
  [GID.F_DEATHSTAR]: { structure: 9_000_000, shield: 50_000, attack: 200_000, cargo: 1_000_000, speed: 100, consumption: 1 },
  [GID.F_BATTLECRUISER]:{ structure: 7_000, shield: 400, attack: 700,  cargo: 750,     speed: 15_000,   consumption: 250 },

  // Defense
  [GID.D_RL]:       { structure: 200,    shield: 20,    attack: 80,    cargo: 0, speed: 0, consumption: 0 },
  [GID.D_LL]:       { structure: 200,    shield: 25,    attack: 100,   cargo: 0, speed: 0, consumption: 0 },
  [GID.D_HL]:       { structure: 800,    shield: 100,   attack: 250,   cargo: 0, speed: 0, consumption: 0 },
  [GID.D_GAUSS]:    { structure: 3_500,  shield: 200,   attack: 1_100, cargo: 0, speed: 0, consumption: 0 },
  [GID.D_ION]:      { structure: 800,    shield: 500,   attack: 150,   cargo: 0, speed: 0, consumption: 0 },
  [GID.D_PLASMA]:   { structure: 10_000, shield: 300,   attack: 3_000, cargo: 0, speed: 0, consumption: 0 },
  [GID.D_SDOME]:    { structure: 2_000,  shield: 2_000, attack: 1,     cargo: 0, speed: 0, consumption: 0 },
  [GID.D_LDOME]:    { structure: 10_000, shield: 10_000,attack: 1,     cargo: 0, speed: 0, consumption: 0 },
  [GID.D_ABM]:      { structure: 8_000,  shield: 1,     attack: 1,     cargo: 0, speed: 0, consumption: 0 },
  [GID.D_IPM]:      { structure: 15_000, shield: 1,     attack: 12_000,cargo: 0, speed: 0, consumption: 0 },
};

// ─── Rapid Fire Table ──────────────────────────────────────────────────────
// Map: attacker ID → { target ID → rapid fire value }
export const RAPID_FIRE: Record<number, Partial<Record<number, number>>> = {
  [GID.F_SC]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_LC]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_LF]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_HF]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_CRUISER]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5, [GID.F_LF]: 6, [GID.D_RL]: 10,
  },
  [GID.F_BATTLESHIP]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_COLON]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_RECYCLER]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_PROBE]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_BOMBER]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5, [GID.D_RL]: 20, [GID.D_LL]: 20,
    [GID.D_HL]: 10, [GID.D_GAUSS]: 10, [GID.D_ION]: 10,
  },
  [GID.F_SAT]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5,
  },
  [GID.F_DESTRO]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5, [GID.F_BATTLECRUISER]: 2, [GID.D_LL]: 10,
  },
  [GID.F_DEATHSTAR]: {
    [GID.F_SC]: 250, [GID.F_LC]: 250, [GID.F_LF]: 200, [GID.F_HF]: 100,
    [GID.F_CRUISER]: 33, [GID.F_BATTLESHIP]: 30, [GID.F_COLON]: 250,
    [GID.F_RECYCLER]: 250, [GID.F_PROBE]: 1250, [GID.F_SAT]: 1250,
    [GID.F_BOMBER]: 25, [GID.F_DESTRO]: 5, [GID.F_BATTLECRUISER]: 15,
    [GID.D_RL]: 200, [GID.D_LL]: 200, [GID.D_HL]: 100,
    [GID.D_GAUSS]: 50, [GID.D_ION]: 100, [GID.D_PLASMA]: 50,
    [GID.D_SDOME]: 200, [GID.D_LDOME]: 200,
  },
  [GID.F_BATTLECRUISER]: {
    [GID.F_PROBE]: 5, [GID.F_SAT]: 5, [GID.F_SC]: 3, [GID.F_LC]: 3,
    [GID.F_HF]: 4, [GID.F_CRUISER]: 4, [GID.F_BATTLESHIP]: 7,
  },
};

// ─── Requirements (technology tree prerequisites) ──────────────────────────
// Map: tech ID → { required tech ID → minimum level }
// planet type: 1 = planet, 3 = moon (buildings requiring moonlight)
const MOON_REQUIRED_BUILDINGS: Set<number> = new Set([GID.B_LUNAR_BASE, GID.B_PHALANX, GID.B_JUMP_GATE]);

export const REQUIREMENTS: Record<number, Partial<Record<number, number>>> = {
  // Buildings
  [GID.B_FUSION]:    { [GID.B_DEUT_SYNTH]: 5, [GID.R_ENERGY]: 3 },
  [GID.B_NANITES]:   { [GID.B_ROBOTS]: 10, [GID.R_COMPUTER]: 10 },
  [GID.B_SHIPYARD]:  { [GID.B_ROBOTS]: 2 },
  [GID.B_TERRAFORMER]:{ [GID.B_NANITES]: 1, [GID.R_ENERGY]: 12 },
  [GID.B_ALLY_DEPOT]:{ [GID.B_SHIPYARD]: 4 },
  [GID.B_PHALANX]:   { [GID.B_LUNAR_BASE]: 1 },
  [GID.B_JUMP_GATE]: { [GID.B_LUNAR_BASE]: 1, [GID.R_HYPERSPACE]: 7 },
  [GID.B_MISS_SILO]: { [GID.B_SHIPYARD]: 1 },

  // Research
  [GID.R_ESPIONAGE]:     { [GID.B_RES_LAB]: 3 },
  [GID.R_COMPUTER]:      { [GID.B_RES_LAB]: 1 },
  [GID.R_WEAPON]:        { [GID.B_RES_LAB]: 4 },
  [GID.R_SHIELD]:        { [GID.B_RES_LAB]: 6, [GID.R_ENERGY]: 3 },
  [GID.R_ARMOUR]:        { [GID.B_RES_LAB]: 2 },
  [GID.R_ENERGY]:        { [GID.B_RES_LAB]: 1 },
  [GID.R_HYPERSPACE]:    { [GID.B_RES_LAB]: 7, [GID.R_ENERGY]: 5, [GID.R_SHIELD]: 5 },
  [GID.R_COMBUST_DRIVE]: { [GID.B_RES_LAB]: 1, [GID.R_ENERGY]: 1 },
  [GID.R_IMPULSE_DRIVE]: { [GID.B_RES_LAB]: 2, [GID.R_ENERGY]: 1, [GID.R_COMBUST_DRIVE]: 5 },
  [GID.R_HYPER_DRIVE]:   { [GID.B_RES_LAB]: 7, [GID.R_HYPERSPACE]: 3, [GID.R_IMPULSE_DRIVE]: 5 },
  [GID.R_LASER]:         { [GID.B_RES_LAB]: 1, [GID.R_ENERGY]: 2 },
  [GID.R_ION]:           { [GID.B_RES_LAB]: 4, [GID.R_ENERGY]: 4, [GID.R_LASER]: 5 },
  [GID.R_PLASMA]:        { [GID.B_RES_LAB]: 4, [GID.R_ENERGY]: 8, [GID.R_LASER]: 10, [GID.R_ION]: 5 },
  [GID.R_IGN]:           { [GID.B_RES_LAB]: 10, [GID.R_COMPUTER]: 8, [GID.R_HYPERSPACE]: 8 },
  [GID.R_EXPEDITION]:    { [GID.B_RES_LAB]: 3, [GID.R_ESPIONAGE]: 4, [GID.R_IMPULSE_DRIVE]: 3 },
  [GID.R_GRAVITON]:      { [GID.B_RES_LAB]: 12, [GID.R_HYPERSPACE]: 12 },

  // Fleet
  [GID.F_SC]:        { [GID.B_SHIPYARD]: 2, [GID.R_COMBUST_DRIVE]: 2 },
  [GID.F_LC]:        { [GID.B_SHIPYARD]: 4, [GID.R_COMBUST_DRIVE]: 6 },
  [GID.F_LF]:        { [GID.B_SHIPYARD]: 1, [GID.R_COMBUST_DRIVE]: 1 },
  [GID.F_HF]:        { [GID.B_SHIPYARD]: 3, [GID.R_ARMOUR]: 2, [GID.R_IMPULSE_DRIVE]: 2 },
  [GID.F_CRUISER]:   { [GID.B_SHIPYARD]: 5, [GID.R_IMPULSE_DRIVE]: 4, [GID.R_ION]: 2 },
  [GID.F_BATTLESHIP]:{ [GID.B_SHIPYARD]: 7, [GID.R_HYPER_DRIVE]: 4 },
  [GID.F_COLON]:     { [GID.B_SHIPYARD]: 4, [GID.R_IMPULSE_DRIVE]: 3 },
  [GID.F_RECYCLER]:  { [GID.B_SHIPYARD]: 4, [GID.R_COMBUST_DRIVE]: 6, [GID.R_SHIELD]: 2 },
  [GID.F_PROBE]:     { [GID.B_SHIPYARD]: 3, [GID.R_ESPIONAGE]: 2 },
  [GID.F_BOMBER]:    { [GID.B_SHIPYARD]: 8, [GID.R_IMPULSE_DRIVE]: 6, [GID.R_PLASMA]: 5 },
  [GID.F_SAT]:       { [GID.B_SHIPYARD]: 1 },
  [GID.F_DESTRO]:    { [GID.B_SHIPYARD]: 9, [GID.R_HYPER_DRIVE]: 6, [GID.R_HYPERSPACE]: 5 },
  [GID.F_DEATHSTAR]: { [GID.B_SHIPYARD]: 12, [GID.R_HYPERSPACE]: 6, [GID.R_GRAVITON]: 1 },
  [GID.F_BATTLECRUISER]:{ [GID.B_SHIPYARD]: 8, [GID.R_HYPER_DRIVE]: 5, [GID.R_LASER]: 12 },

  // Defense
  [GID.D_RL]:    { [GID.B_SHIPYARD]: 1 },
  [GID.D_LL]:    { [GID.B_SHIPYARD]: 2, [GID.R_LASER]: 3 },
  [GID.D_HL]:    { [GID.B_SHIPYARD]: 4, [GID.R_LASER]: 6, [GID.R_ENERGY]: 3 },
  [GID.D_GAUSS]: { [GID.B_SHIPYARD]: 6, [GID.R_WEAPON]: 3, [GID.R_SHIELD]: 1 },
  [GID.D_ION]:   { [GID.B_SHIPYARD]: 4, [GID.R_ION]: 4 },
  [GID.D_PLASMA]:{ [GID.B_SHIPYARD]: 8, [GID.R_PLASMA]: 7 },
  [GID.D_SDOME]: { [GID.B_SHIPYARD]: 1, [GID.R_SHIELD]: 2 },
  [GID.D_LDOME]: { [GID.B_SHIPYARD]: 6, [GID.R_SHIELD]: 6 },
  [GID.D_ABM]:   { [GID.B_MISS_SILO]: 2 },
  [GID.D_IPM]:   { [GID.B_MISS_SILO]: 4, [GID.R_IMPULSE_DRIVE]: 1 },
};

// ─── Cost formula: base * factor^(level-1) ─────────────────────────────────
export function techPrice(id: number, level: number): Record<number, number> {
  const entry = INITIAL_COSTS[id];
  if (!entry) return {};

  const result: Record<number, number> = {};
  const multiplier = Math.pow(entry.factor, level - 1);

  for (const [resId, base] of Object.entries(entry.costs)) {
    const rid = Number(resId);
    const cost = (base ?? 0) * multiplier;
    result[rid] = Math.floor(cost) >= 1 ? Math.floor(cost) : 1;
  }

  return result;
}

// ─── Points from resources (1 point = 1000 resources) ────────────────────────
export function techPriceInPoints(cost: Record<number, number>): number {
  const metal = cost[GID.RC_METAL] || 0;
  const crystal = cost[GID.RC_CRYSTAL] || 0;
  const deuterium = cost[GID.RC_DEUTERIUM] || 0;
  return Math.floor((metal + crystal + deuterium) / 1000);
}

// ─── Build/research duration in seconds ─────────────────────────────────────
// b1 = relevant building level (robotics / shipyard / reslab)
// b2 = nanite level (0 for research)
// constFactor = universe game speed (e.g. 1, 2, 5, 8)
// speed = additional multiplier (premium bonuses, etc.)
export function techDuration(
  id: number,
  level: number,
  constFactor: number,
  b1: number,
  b2: number,
  speed: number,
): number {
  const cost = techPrice(id, level);
  const metal = cost[GID.RC_METAL] || 0;
  const crystal = cost[GID.RC_CRYSTAL] || 0;

  const divisor = isResearch(id) ? 1000 : 2500;
  const baseTime = ((metal + crystal) / (divisor * (1 + b1))) * Math.pow(0.5, b2) * 3600;
  const effectiveSpeed = Math.max(1, constFactor * speed);
  return Math.max(1, Math.ceil(baseTime / effectiveSpeed));
}

// ─── Storage capacity ────────────────────────────────────────────────────────
export function storageCapacity(level: number): number {
  return 100_000 + 50_000 * Math.ceil(Math.pow(1.6, level) - 1);
}

// ─── Intergalactic Research Network ─────────────────────────────────────────
// Sums the top N other lab levels and adds the researching planet's lab
export function researchNetwork(
  _planetId: string,
  playerLabs: number[],
  ignLevel: number,
  reslabLevel: number,
): number {
  const sorted = [...playerLabs].sort((a, b) => b - a);
  const count = Math.min(ignLevel, sorted.length);
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += sorted[i];
  }
  return reslabLevel + sum;
}

// ─── Production calculations ────────────────────────────────────────────────
export interface PlanetEnv {
  temp: number;
  factor: number;
  speed: number;
}

export interface ProductionResult {
  metalPerHour: number;
  crystalPerHour: number;
  deuteriumPerHour: number;
  energyProduced: number;
  energyConsumed: number;
  netEnergy: number;
}

export function calculateProduction(
  building: Record<number, number>,
  research: Record<number, number>,
  planet: PlanetEnv,
): ProductionResult {
  const { temp, factor, speed } = planet;
  const energyTech = research[GID.R_ENERGY] || 0;
  const fusionTech = research[GID.R_PLASMA] || 0; // plasma tech boosts fusion

  // Helper: base production * factor * speed
  const applyBonuses = (base: number): number => base * factor * speed;

  // Helper: mine production = 30 * level * 1.1^level
  const mineProd = (level: number, baseRate: number): number => baseRate * level * Math.pow(1.1, level);

  // Helper: mine energy consumption = baseRate * level * 1.1^level
  const mineEnergy = (level: number, baseRate: number): number => baseRate * level * Math.pow(1.1, level);

  // Metal mine: 30 * level * 1.1^level
  const metalProd = applyBonuses(mineProd(building[GID.B_METAL_MINE] || 0, 30));
  const metalEnergy = mineEnergy(building[GID.B_METAL_MINE] || 0, 10);

  // Crystal mine: 20 * level * 1.1^level
  const crystalProd = applyBonuses(mineProd(building[GID.B_CRYSTAL_MINE] || 0, 20));
  const crystalEnergy = mineEnergy(building[GID.B_CRYSTAL_MINE] || 0, 10);

  // Deuterium synth: 10 * level * 1.1^level * (1.28 - 0.002 * (temp + 40))
  const deutLevel = building[GID.B_DEUT_SYNTH] || 0;
  const deutTempFactor = Math.max(0, 1.28 - 0.002 * (temp + 40));
  const deutProd = applyBonuses(mineProd(deutLevel, 10) * deutTempFactor);
  const deutEnergy = mineEnergy(deutLevel, 20);

  // Solar plant: 20 * level * 1.1^level
  const solarLevel = building[GID.B_SOLAR_PLANT] || 0;
  const solarProd = applyBonuses(20 * solarLevel * Math.pow(1.1, solarLevel));

  // Fusion reactor: 30 * level * (1.05 + energyTech * 0.01)^level
  const fusionLevel = building[GID.B_FUSION] || 0;
  const fusionFactor = 1.05 + energyTech * 0.01 + fusionTech * 0.01; // plasma tech boosts
  const fusionProd = applyBonuses(30 * fusionLevel * Math.pow(fusionFactor, fusionLevel));
  const fusionDeutConsumption = 10 * fusionLevel * Math.pow(fusionFactor, fusionLevel) * factor * speed;

  // Solar satellites: ((temp + 40) / 4 + 20) * count
  const satCount = building[GID.F_SAT] || 0;
  const satEnergy = Math.max(0, (temp + 40) / 4 + 20) * satCount * factor * speed;

  const energyProduced = solarProd + fusionProd + satEnergy;
  const energyConsumed = metalEnergy + crystalEnergy + deutEnergy;
  const netEnergy = energyProduced - energyConsumed;
  const netDeuterium = applyBonuses(mineProd(deutLevel, 10) * deutTempFactor) - fusionDeutConsumption;

  return {
    metalPerHour: Math.round(metalProd),
    crystalPerHour: Math.round(crystalProd),
    deuteriumPerHour: Math.round(netDeuterium),
    energyProduced: Math.round(energyProduced),
    energyConsumed: Math.round(energyConsumed),
    netEnergy: Math.round(netEnergy),
  };
}

// ─── Requirements check ─────────────────────────────────────────────────────
export function techMeetsRequirements(
  userTechs: Record<number, number>,
  planetBuildings: Record<number, number>,
  planetType: number,
  techId: number,
): boolean {
  // Planet type check (moon-only buildings)
  if (MOON_REQUIRED_BUILDINGS.has(techId) && planetType !== 3) {
    return false;
  }

  const reqs = REQUIREMENTS[techId];
  if (!reqs) return true;

  for (const [requiredId, requiredLevel] of Object.entries(reqs)) {
    const rid = Number(requiredId);
    const currentLevel = userTechs[rid] ?? planetBuildings[rid] ?? 0;
    if ((requiredLevel ?? 0) > 0 && currentLevel < (requiredLevel ?? 0)) return false;
  }

  return true;
}

// ─── Resource check ─────────────────────────────────────────────────────────
export function isEnoughResources(
  available: Record<number, number>,
  cost: Record<number, number>,
): boolean {
  const check = (resId: number): boolean =>
    (cost[resId] || 0) <= (available[resId] || 0);
  return check(GID.RC_METAL) && check(GID.RC_CRYSTAL) && check(GID.RC_DEUTERIUM) && check(GID.RC_ENERGY);
}
