/**
 * Army Unit Classification System
 * Comprehensive type definitions for the 18-category, 32-subcategory army unit hierarchy.
 * Supports tiers 1-99, levels 1-999, types/sub-types, ranks, titles,
 * stats/sub-stats, descriptions/sub-descriptions, attributes/sub-attributes,
 * and subjects/subject-details.
 *
 * @tag #army #units #categories #tiers #levels #classification
 */

// ============================================================================
// UNIT CATEGORIES (18 total)
// ============================================================================

export type UnitCategory =
  | 'infantry_corps'
  | 'heavy_infantry'
  | 'armored_forces'
  | 'artillery_corps'
  | 'air_forces'
  | 'naval_forces'
  | 'mech_exoskeleton'
  | 'special_operations'
  | 'support_logistics'
  | 'engineering_corps'
  | 'intelligence_recon'
  | 'electronic_warfare'
  | 'space_combat'
  | 'cyber_drone'
  | 'chemical_defense'
  | 'psionic_forces'
  | 'mercenary_contractors'
  | 'command_hq';

// ============================================================================
// UNIT SUB-CATEGORIES (32 total)
// ============================================================================

export type UnitSubCategory =
  // infantry_corps (3)
  | 'light_infantry'
  | 'rifle_squad'
  | 'assault_squad'
  // heavy_infantry (2)
  | 'power_armor_unit'
  | 'siege_breakers'
  // armored_forces (3)
  | 'light_armor'
  | 'main_battle_tank'
  | 'armored_personnel_carrier'
  // artillery_corps (2)
  | 'field_artillery'
  | 'siege_weapons'
  // air_forces (3)
  | 'fighter_squadron'
  | 'bomber_wing'
  | 'air_cavalry'
  // naval_forces (2)
  | 'destroyer_class'
  | 'carrier_strike'
  // mech_exoskeleton (2)
  | 'battle_mech'
  | 'command_mech'
  // special_operations (2)
  | 'commando_unit'
  | 'stealth_operative'
  // support_logistics (2)
  | 'medic_corps'
  | 'supply_train'
  // engineering_corps (2)
  | 'combat_engineers'
  | 'siege_engineers'
  // intelligence_recon (2)
  | 'scout_unit'
  | 'signal_corps'
  // electronic_warfare (1)
  | 'ew_squadron'
  // space_combat (1)
  | 'orbital_strike'
  // cyber_drone (1)
  | 'drone_swarm'
  // chemical_defense (1)
  | 'hazmat_unit'
  // psionic_forces (1)
  | 'psionic_operative'
  // mercenary_contractors (1)
  | 'hired_guns'
  // command_hq (1)
  | 'field_hq';

// ============================================================================
// CLASS & SUB-CLASS TIERS (1–99)
// ============================================================================

/**
 * Tier value bounded between 1 and 99.
 * Tier 1–10  : Standard
 * Tier 11–30 : Advanced
 * Tier 31–60 : Elite
 * Tier 61–80 : Veteran
 * Tier 81–99 : Legendary
 */
export type ClassTier = number; // 1–99
export type SubClassTier = number; // 1–99

export type UnitClassRank =
  | 'standard'
  | 'advanced'
  | 'elite'
  | 'veteran'
  | 'legendary';

export interface UnitClass {
  name: string;
  tier: ClassTier;
  rank: UnitClassRank;
  description: string;
}

export interface UnitSubClass {
  name: string;
  tier: SubClassTier;
  parentClass: string;
  specialization: string;
  description: string;
}

// ============================================================================
// UNIT TYPE & SUB-TYPE
// ============================================================================

export type UnitType =
  | 'soldier'
  | 'weapon'
  | 'armor'
  | 'vehicle'
  | 'mech'
  | 'commander'
  | 'support'
  | 'aerial'
  | 'naval'
  | 'orbital'
  | 'cyber'
  | 'psionic';

export type UnitSubType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'elite'
  | 'assault'
  | 'stealth'
  | 'recon'
  | 'siege'
  | 'rapid_deployment'
  | 'garrison'
  | 'shock_trooper'
  | 'fire_support'
  | 'electronic'
  | 'hazmat'
  | 'mercenary'
  | 'drone'
  | 'orbital_drop'
  | 'command';

// ============================================================================
// RANKS & TITLES
// ============================================================================

export type UnitRank =
  | 'private'
  | 'private_first_class'
  | 'corporal'
  | 'sergeant'
  | 'staff_sergeant'
  | 'sergeant_major'
  | 'warrant_officer'
  | 'second_lieutenant'
  | 'first_lieutenant'
  | 'captain'
  | 'major'
  | 'lieutenant_colonel'
  | 'colonel'
  | 'brigadier_general'
  | 'major_general'
  | 'lieutenant_general'
  | 'general'
  | 'field_marshal';

export type UnitTitle =
  | 'veteran'
  | 'sharpshooter'
  | 'defender'
  | 'berserker'
  | 'ghost'
  | 'titan'
  | 'warlord'
  | 'champion'
  | 'sentinel'
  | 'vanguard'
  | 'arbiter'
  | 'paragon'
  | 'juggernaut'
  | 'phantom'
  | 'overlord'
  | 'enforcer'
  | 'guardian'
  | 'ravager'
  | 'tactician'
  | 'ironclad';

// ============================================================================
// STATS & SUB-STATS
// ============================================================================

/** Primary combat stats */
export interface UnitStats {
  attack: number;
  defense: number;
  health: number;
  speed: number;
  accuracy: number;
  dodge: number;
}

/** Secondary / derived combat sub-stats */
export interface UnitSubStats {
  criticalHitChance: number;          // 0–100 %
  criticalDamageMultiplier: number;   // e.g. 1.5 = 150 %
  armorPenetration: number;           // flat armor reduction on hit
  shieldBreakPower: number;           // bonus damage to shielded targets
  flankingBonus: number;              // damage bonus when attacking from flank
  moraleDamage: number;               // reduces enemy morale per hit
  suppressionResistance: number;      // resistance to suppression effects
  supplyConsumption: number;          // supply units consumed per turn
  recruitmentTime: number;            // turns to recruit
  maintenanceCost: number;            // credits per turn upkeep
  counterattackChance: number;        // % chance to counter on defense
  leadershipBonus: number;            // bonus provided to allies in range
  ambushBonus: number;                // damage bonus on first round
  fortificationBonus: number;         // defense bonus in fortified position
  healingReceived: number;            // multiplier for incoming healing
  sightRange: number;                 // tiles / units of vision
  communicationsRange: number;        // command order effective range
  electronicResistance: number;       // resistance to EW effects
  psionicResistance: number;          // resistance to psionic effects
  terrainAdaptation: number;          // penalty reduction in adverse terrain
}

// ============================================================================
// ATTRIBUTES & SUB-ATTRIBUTES
// ============================================================================

export type AttributeKey =
  | 'strength'
  | 'agility'
  | 'intelligence'
  | 'endurance'
  | 'leadership'
  | 'adaptability'
  | 'resilience'
  | 'precision';

export interface UnitAttributes {
  strength: number;       // 1–100
  agility: number;        // 1–100
  intelligence: number;   // 1–100
  endurance: number;      // 1–100
  leadership: number;     // 1–100
  adaptability: number;   // 1–100
  resilience: number;     // 1–100
  precision: number;      // 1–100
}

export interface StrengthSubAttributes {
  physicalPower: number;
  loadCapacity: number;
  meleeDamage: number;
  heavyWeaponProficiency: number;
}

export interface AgilitySubAttributes {
  movementSpeed: number;
  evasionRating: number;
  reactionTime: number;
  stealthCapability: number;
}

export interface IntelligenceSubAttributes {
  tacticalAwareness: number;
  techProficiency: number;
  targetPriority: number;
  countermeasures: number;
}

export interface EnduranceSubAttributes {
  staminaPool: number;
  damageThreshold: number;
  recoveryRate: number;
  terrainAdaptation: number;
}

export interface LeadershipSubAttributes {
  squadMorale: number;
  commandRadius: number;
  inspirationBonus: number;
  orderEfficiency: number;
}

export interface AdaptabilitySubAttributes {
  environmentalTolerance: number;
  weaponVersatility: number;
  trainingSpeed: number;
  missionFlexibility: number;
}

export interface ResilienceSubAttributes {
  statusResistance: number;
  moraleSuppression: number;
  fearImmunity: number;
  recoveryBonus: number;
}

export interface PrecisionSubAttributes {
  aimRating: number;
  rangeExtension: number;
  weakspotDetection: number;
  minimumCollateral: number;
}

export interface UnitSubAttributes {
  strength: StrengthSubAttributes;
  agility: AgilitySubAttributes;
  intelligence: IntelligenceSubAttributes;
  endurance: EnduranceSubAttributes;
  leadership: LeadershipSubAttributes;
  adaptability: AdaptabilitySubAttributes;
  resilience: ResilienceSubAttributes;
  precision: PrecisionSubAttributes;
}

// ============================================================================
// SUBJECTS & SUBJECT DETAILS
// ============================================================================

export type UnitSubject =
  | 'ballistics'
  | 'explosives'
  | 'medical'
  | 'stealth'
  | 'tactics'
  | 'engineering'
  | 'electronics'
  | 'psionics'
  | 'command'
  | 'logistics'
  | 'intelligence'
  | 'cyber'
  | 'space_combat'
  | 'chemical_defense'
  | 'mercenary_skills'
  | 'drone_operation'
  | 'air_operations'
  | 'naval_operations';

export interface SubjectDetail {
  subject: UnitSubject;
  proficiencyLevel: number;     // 1–100
  specializations: string[];    // specific skills within the subject
  description: string;          // what this unit knows in this subject
  subDescription: string;       // deep technical/lore notes
}

// ============================================================================
// DESCRIPTIONS
// ============================================================================

export interface UnitDescriptions {
  /** Short combat overview shown in tooltips */
  description: string;
  /** Extended tactical / lore detail shown in unit dossier */
  subDescription: string;
  /** In-universe flavor quote */
  flavorText?: string;
  /** Historical / world-building context */
  loreText?: string;
}

// ============================================================================
// LEVEL SYSTEM (1–999)
// ============================================================================

export type UnitLevel = number; // 1–999

export type LevelTier =
  | 'recruit'      // 1–99
  | 'veteran'      // 100–299
  | 'elite'        // 300–599
  | 'legendary'    // 600–799
  | 'mythic';      // 800–999

export function getLevelTier(level: UnitLevel): LevelTier {
  if (level <= 99) return 'recruit';
  if (level <= 299) return 'veteran';
  if (level <= 599) return 'elite';
  if (level <= 799) return 'legendary';
  return 'mythic';
}

export function getClassTierLabel(tier: ClassTier): UnitClassRank {
  if (tier <= 10) return 'standard';
  if (tier <= 30) return 'advanced';
  if (tier <= 60) return 'elite';
  if (tier <= 80) return 'veteran';
  return 'legendary';
}

// ============================================================================
// FULL ARMY UNIT DEFINITION
// ============================================================================

/**
 * Comprehensive army unit *definition* (template) encompassing all classification
 * dimensions: category, sub-category, class/sub-class tiers (1–99), type/sub-type,
 * rank, title, stats/sub-stats, attributes/sub-attributes,
 * descriptions/sub-descriptions, subjects, and level (1–999).
 *
 * Note: `ArmyUnit` in `civilization.ts` is the *instance* of a deployed unit
 * belonging to a player. This type is the static template / catalog entry.
 */
export interface ArmyUnitDefinition {
  // --- Identity ---
  id: string;
  name: string;

  // --- Classification ---
  category: UnitCategory;
  subCategory: UnitSubCategory;
  unitClass: UnitClass;
  unitSubClass: UnitSubClass;
  unitType: UnitType;
  unitSubType: UnitSubType;

  // --- Rank & Title ---
  rank: UnitRank;
  title?: UnitTitle;

  // --- Progression ---
  /** Minimum player level required to unlock this unit (1–999) */
  minimumLevel: UnitLevel;
  /** Maximum unit level achievable (1–999) */
  maximumLevel: UnitLevel;

  // --- Combat Statistics ---
  stats: UnitStats;
  subStats: UnitSubStats;

  // --- Attributes ---
  attributes: UnitAttributes;
  subAttributes: UnitSubAttributes;

  // --- Lore & Documentation ---
  descriptions: UnitDescriptions;

  // --- Subjects ---
  subjects: SubjectDetail[];

  // --- Special Abilities ---
  specialAbilities?: {
    name: string;
    effect: string;
    cooldown?: number;
  }[];

  // --- Resource Cost ---
  cost: {
    credits: number;
    materials?: number;
    time?: number;
  };

  // --- Legacy compat fields ---
  tier: number;           // primary rarity/power tier (used in legacy system)
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  crew: number;
  minCrewRequired: number;
  moraleMultiplier: number;
  formationBonus?: number;
  prerequisiteTechs?: string[];
}

// ============================================================================
// CATEGORY METADATA
// ============================================================================

export interface UnitCategoryMeta {
  id: UnitCategory;
  name: string;
  description: string;
  subDescription: string;
  subCategories: UnitSubCategory[];
  primaryType: UnitType;
  loreText?: string;
}

export interface UnitSubCategoryMeta {
  id: UnitSubCategory;
  parentCategory: UnitCategory;
  name: string;
  description: string;
  subDescription: string;
  primarySubType: UnitSubType;
  defaultRank: UnitRank;
  classTierRange: { min: ClassTier; max: ClassTier };
  subClassTierRange: { min: SubClassTier; max: SubClassTier };
  subjects: UnitSubject[];
  loreText?: string;
}
