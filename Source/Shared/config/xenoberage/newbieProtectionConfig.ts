/**
 * Newbie Protection Configuration
 * ============================================================================
 * Ported from Xenobe Rage PHP config.php — newbie regeneration thresholds.
 * If a ship is destroyed without an EWD and all stats are below these
 * thresholds, the player is regenerated to play more.
 * ============================================================================
 */

export interface NewbieThreshold {
  /** Regeneration enabled — $newbie_nice */
  readonly ENABLED: true;
  /** Hull threshold — $newbie_hull */
  readonly HULL: 8;
  /** Engines threshold — $newbie_engines */
  readonly ENGINES: 8;
  /** Power threshold — $newbie_power */
  readonly POWER: 8;
  /** Computer threshold — $newbie_computer */
  readonly COMPUTER: 8;
  /** Sensors threshold — $newbie_sensors */
  readonly SENSORS: 8;
  /** Armor threshold — $newbie_armor */
  readonly ARMOR: 8;
  /** Shields threshold — $newbie_shields */
  readonly SHIELDS: 8;
  /** Beams threshold — $newbie_beams */
  readonly BEAMS: 8;
  /** Torp launchers threshold — $newbie_torp_launchers */
  readonly TORP_LAUNCHERS: 8;
  /** Cloak threshold — $newbie_cloak */
  readonly CLOAK: 8;
}

export const NEWBIE_PROTECTION = {
  ENABLED: true,
  HULL: 8,
  ENGINES: 8,
  POWER: 8,
  COMPUTER: 8,
  SENSORS: 8,
  ARMOR: 8,
  SHIELDS: 8,
  BEAMS: 8,
  TORP_LAUNCHERS: 8,
  CLOAK: 8,
} as const satisfies NewbieThreshold;
