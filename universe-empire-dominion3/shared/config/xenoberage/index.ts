/**
 * Xenobe Rage Configuration — Barrel Export
 * ============================================================================
 * Re-exports all Xenobe Rage–ported config modules for convenient importing.
 * ============================================================================
 */

export { SCHEDULER_CONFIG, type SchedulerConfig } from './schedulerConfig';
export {
  UNIVERSE,
  RATING,
  SERVER,
  type UniverseDimensions,
  type RatingConfig,
  type ServerFlags,
} from './universeConfig';
export { NEWBIE_PROTECTION, type NewbieThreshold } from './newbieProtectionConfig';
export { FEATURES, type FeatureFlags } from './featureFlagsConfig';
export {
  RESOURCES,
  type ResourceEntry,
  type CreditsResource,
  type DefaultProduction,
  type PortConfig,
  type ResourceConfig,
} from './resourceConfig';
export { DEVICES, type DevicePrice, type DeviceConfig } from './deviceConfig';
export { COMBAT, type FighterConfig, type TorpedoConfig, type CombatConfig } from './combatConfig';
export {
  COLONIZATION,
  type ColonistConfig,
  type BaseCost,
  type ColonizationConfig,
} from './colonizationConfig';
export { IGB_BANK, type IGBBankConfig } from './bankConfig';
export { STARTING_VALUES, type StartingValuesConfig } from './startingValuesConfig';
export { PROGRESSION, type ProgressionConfig } from './progressionConfig';
export { BOUNTY, type BountyConfig } from './bountyConfig';
export {
  FACILITIES,
  type FacilityRequirements,
  type FacilityEntry,
  type FacilityConfig,
} from './facilityConfig';
export { XEN_OBE, type XenobeConfig } from './xenobeConfig';
export { LOCALIZATION, type LocalizationConfig } from './localizationConfig';
