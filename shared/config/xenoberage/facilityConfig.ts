/**
 * Facility Configuration
 * ============================================================================
 * Ported from Xenobe Rage PHP config.php — planetary facility production
 * rates and construction requirements.
 * ============================================================================
 */

export interface FacilityRequirements {
  readonly CREDITS?: number;
  readonly ORGANICS?: number;
  readonly GOODS?: number;
  readonly ORE?: number;
  readonly COLONISTS?: number;
  readonly TORPEDOES?: number;
  readonly FIGHTERS?: number;
}

export interface FacilityEntry {
  /** Per-tick production rate — $facility_*_rate */
  readonly FOOD_RATE?: number;
  readonly PARTS_RATE?: number;
  readonly ENERGY_RATE?: number;
  readonly POINTS_RATE?: number;
  readonly ORE_RATE?: number;
  /** Construction requirements — $requirement_* */
  readonly REQUIREMENTS: FacilityRequirements;
}

export interface FacilityConfig {
  readonly HYDROPONICS: FacilityEntry;
  readonly SHIPYARD: FacilityEntry;
  readonly SOLAR_PLANT: FacilityEntry;
  readonly RESEARCH_LAB: FacilityEntry;
  readonly MINING: FacilityEntry;
  readonly MEDICAL: FacilityEntry;
  readonly MILITARY: FacilityEntry;
  readonly BANKING: FacilityEntry;
}

export const FACILITIES = {
  HYDROPONICS: {
    FOOD_RATE: 1,
    REQUIREMENTS: { CREDITS: 1000000000, ORGANICS: 500000000, GOODS: 100000000 },
  },
  SHIPYARD: {
    PARTS_RATE: 1,
    REQUIREMENTS: { CREDITS: 10000000000, GOODS: 500000000, ORE: 500000000 },
  },
  SOLAR_PLANT: {
    ENERGY_RATE: 1,
    REQUIREMENTS: { CREDITS: 500000000, GOODS: 100000000, ORE: 100000000 },
  },
  RESEARCH_LAB: {
    POINTS_RATE: 1,
    REQUIREMENTS: { CREDITS: 5000000000, COLONISTS: 666666667 },
  },
  MINING: {
    ORE_RATE: 1,
    REQUIREMENTS: {},
  },
  MEDICAL: {
    REQUIREMENTS: { CREDITS: 5000000000, GOODS: 500000000, COLONISTS: 400000000 },
  },
  MILITARY: {
    REQUIREMENTS: { CREDITS: 5000000000, COLONISTS: 666666667, TORPEDOES: 75000000, FIGHTERS: 75000000 },
  },
  BANKING: {
    REQUIREMENTS: { CREDITS: 10000000000 },
  },
} as const satisfies FacilityConfig;
