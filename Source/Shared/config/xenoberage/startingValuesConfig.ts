/**
 * Starting Values Configuration
 * ============================================================================
 * Ported from Xenobe Rage PHP config.php — values a new player starts with.
 * ============================================================================
 */

export interface StartingValuesConfig {
  /** Starting fighters — $start_fighters */
  readonly FIGHTERS: 10;
  /** Starting armor — $start_armor */
  readonly ARMOR: 10;
  /** Starting credits — $start_credits */
  readonly CREDITS: 1000;
  /** Starting energy — $start_energy */
  readonly ENERGY: 100;
  /** Starting turns — $start_turns */
  readonly TURNS: 1200;
  /** Start with LSSD — $start_lssd ('N' → false) */
  readonly LSSD: false;
  /** Starting warp editors — $start_editors */
  readonly WARP_EDITORS: 0;
  /** Starting mine deflectors — $start_minedeflectors */
  readonly MINE_DEFLECTORS: 0;
  /** Starting emergency warp units — $start_emerwarp */
  readonly EMERGENCY_WARP: 0;
  /** Starting beacons — $start_beacon */
  readonly BEACONS: 0;
  /** Starting genesis torps — $start_genesis */
  readonly GENESIS: 1;
  /** Start with escape pod — $escape ('N' → false) */
  readonly ESCAPE_POD: false;
  /** Start with fuel scoop — $scoop ('N' → false) */
  readonly FUEL_SCOOP: false;
}

export const STARTING_VALUES = {
  FIGHTERS: 10,
  ARMOR: 10,
  CREDITS: 1000,
  ENERGY: 100,
  TURNS: 1200,
  LSSD: false,
  WARP_EDITORS: 0,
  MINE_DEFLECTORS: 0,
  EMERGENCY_WARP: 0,
  BEACONS: 0,
  GENESIS: 1,
  ESCAPE_POD: false,
  FUEL_SCOOP: false,
} as const satisfies StartingValuesConfig;
