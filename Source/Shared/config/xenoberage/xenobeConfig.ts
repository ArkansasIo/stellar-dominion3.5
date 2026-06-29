/**
 * Xenobe (AI NPC) Configuration
 * ============================================================================
 * Ported from Xenobe Rage PHP config.php — xenobe spawn, behavior, and
 * economy parameters.
 * ============================================================================
 */

export interface XenobeConfig {
  /** Maximum xenobe count — $xenobe_max */
  readonly MAX_COUNT: 10;
  /** Starting credits — $xen_start_credits */
  readonly START_CREDITS: 1000000;
  /** Credits per tick (unemployment benefit) — $xen_unemployment */
  readonly UNEMPLOYMENT: 100000;
  /** Percent of xenobe that are aggressive — $xen_aggression */
  readonly AGGRESSION: 100;
  /** Percent of created xenobe that own planets — $xen_planets */
  readonly PLANETS_PERCENT: 5;
  /** Max starting size — $xenstartsize */
  readonly START_SIZE: 15;
}

export const XEN_OBE = {
  MAX_COUNT: 10,
  START_CREDITS: 1000000,
  UNEMPLOYMENT: 100000,
  AGGRESSION: 100,
  PLANETS_PERCENT: 5,
  START_SIZE: 15,
} as const satisfies XenobeConfig;
