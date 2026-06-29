export type LogEntryType =
  | "round_start"
  | "round_end"
  | "ship_attack"
  | "ship_evade"
  | "ship_critical_hit"
  | "ship_destroyed"
  | "shield_absorb"
  | "shield_break"
  | "shield_regen"
  | "hull_damage"
  | "hull_destroyed"
  | "target_selection"
  | "formation_applied"
  | "terrain_effect"
  | "commander_ability"
  | "retreat_attempt"
  | "retreat_success"
  | "retreat_failed"
  | "plunder_start"
  | "plunder_complete"
  | "battle_victory"
  | "battle_defeat"
  | "battle_draw"
  | "xp_gained"
  | "loot_received";

export type BattleRating = "S" | "A" | "B" | "C" | "D" | "F";

export type BattleActor = "attacker" | "defender";

export interface BattleLogEntry {
  round: number;
  timestamp: number;
  type: LogEntryType;
  actor: BattleActor;
  unitType: string;
  unitId: string;
  targetUnit: string;
  damage: number;
  shieldDamage: number;
  hullDamage: number;
  isCritical: boolean;
  isEvaded: boolean;
  message: string;
  details: Record<string, unknown>;
}

export interface FleetSnapshot {
  initial: Record<string, number>;
  surviving: Record<string, number>;
  lost: Record<string, number>;
}

export interface BattleSummary {
  attackerFleet: FleetSnapshot;
  defenderFleet: FleetSnapshot;
  totalRounds: number;
  duration: number;
  terrain: string;
  formationsUsed: {
    attacker: string;
    defender: string;
  };
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  attackerShieldAbsorbed: number;
  defenderShieldAbsorbed: number;
  attackerXpGained: number;
  defenderXpGained: number;
  plundered: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  battleRating: BattleRating;
}

export interface BattleLogConfig {
  entryTypes: LogEntryType[];
  ratingThresholds: {
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
  };
  maxLogEntries: number;
  includeDetails: boolean;
  timestampFormat: "unix" | "iso";
}

export const BATTLE_LOG_CONFIG: BattleLogConfig = {
  entryTypes: [
    "round_start",
    "round_end",
    "ship_attack",
    "ship_evade",
    "ship_critical_hit",
    "ship_destroyed",
    "shield_absorb",
    "shield_break",
    "shield_regen",
    "hull_damage",
    "hull_destroyed",
    "target_selection",
    "formation_applied",
    "terrain_effect",
    "commander_ability",
    "retreat_attempt",
    "retreat_success",
    "retreat_failed",
    "plunder_start",
    "plunder_complete",
    "battle_victory",
    "battle_defeat",
    "battle_draw",
    "xp_gained",
    "loot_received",
  ],
  ratingThresholds: {
    S: 0.10,
    A: 0.25,
    B: 0.50,
    C: 0.75,
    D: 1.0,
  },
  maxLogEntries: 10000,
  includeDetails: true,
  timestampFormat: "unix",
};

export function createLogEntry(
  round: number,
  type: LogEntryType,
  actor: BattleActor,
  unitType: string,
  unitId: string,
  message: string,
  details: Record<string, unknown> = {}
): BattleLogEntry {
  return {
    round,
    timestamp: Date.now(),
    type,
    actor,
    unitType,
    unitId,
    targetUnit: (details.targetUnit as string) || "",
    damage: (details.damage as number) || 0,
    shieldDamage: (details.shieldDamage as number) || 0,
    hullDamage: (details.hullDamage as number) || 0,
    isCritical: (details.isCritical as boolean) || false,
    isEvaded: (details.isEvaded as boolean) || false,
    message,
    details,
  };
}

export function calculateBattleRating(
  winner: BattleActor | "draw",
  attackerLossRate: number,
  defenderLossRate: number
): BattleRating {
  if (winner === "draw") {
    return "D";
  }
  const loserLossRate = winner === "attacker" ? defenderLossRate : attackerLossRate;
  const winnerLossRate = winner === "attacker" ? attackerLossRate : defenderLossRate;
  if (winnerLossRate <= BATTLE_LOG_CONFIG.ratingThresholds.S && loserLossRate >= 0.9) {
    return "S";
  }
  if (winnerLossRate <= BATTLE_LOG_CONFIG.ratingThresholds.A) {
    return "A";
  }
  if (winnerLossRate <= BATTLE_LOG_CONFIG.ratingThresholds.B) {
    return "B";
  }
  if (winnerLossRate <= BATTLE_LOG_CONFIG.ratingThresholds.C) {
    return "C";
  }
  if (winnerLossRate <= BATTLE_LOG_CONFIG.ratingThresholds.D) {
    return "D";
  }
  return "F";
}

export function buildFleetSnapshot(
  initial: Record<string, number>,
  surviving: Record<string, number>
): FleetSnapshot {
  const lost: Record<string, number> = {};
  const allKeys = Object.keys({ ...initial, ...surviving });
  for (const shipType of allKeys) {
    lost[shipType] = (initial[shipType] || 0) - (surviving[shipType] || 0);
  }
  return { initial, surviving, lost };
}

export function calculateLossRate(snapshot: FleetSnapshot): number {
  let totalInitial = 0;
  let totalLost = 0;
  for (const shipType of Object.keys(snapshot.initial)) {
    totalInitial += snapshot.initial[shipType];
    totalLost += snapshot.lost[shipType] || 0;
  }
  return totalInitial > 0 ? totalLost / totalInitial : 0;
}

export function buildBattleSummary(options: {
  attackerFleet: FleetSnapshot;
  defenderFleet: FleetSnapshot;
  totalRounds: number;
  duration: number;
  terrain: string;
  attackerFormation: string;
  defenderFormation: string;
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  attackerShieldAbsorbed: number;
  defenderShieldAbsorbed: number;
  attackerXpGained: number;
  defenderXpGained: number;
  plundered: { metal: number; crystal: number; deuterium: number };
  winner: BattleActor | "draw";
}): BattleSummary {
  const attackerLossRate = calculateLossRate(options.attackerFleet);
  const defenderLossRate = calculateLossRate(options.defenderFleet);
  const battleRating = calculateBattleRating(options.winner, attackerLossRate, defenderLossRate);
  return {
    attackerFleet: options.attackerFleet,
    defenderFleet: options.defenderFleet,
    totalRounds: options.totalRounds,
    duration: options.duration,
    terrain: options.terrain,
    formationsUsed: {
      attacker: options.attackerFormation,
      defender: options.defenderFormation,
    },
    attackerDamageDealt: options.attackerDamageDealt,
    defenderDamageDealt: options.defenderDamageDealt,
    attackerShieldAbsorbed: options.attackerShieldAbsorbed,
    defenderShieldAbsorbed: options.defenderShieldAbsorbed,
    attackerXpGained: options.attackerXpGained,
    defenderXpGained: options.defenderXpGained,
    plundered: options.plundered,
    battleRating,
  };
}

export function formatLogEntry(entry: BattleLogEntry): string {
  return `[R${entry.round}] ${entry.actor.toUpperCase()} ${entry.unitType} (${entry.unitId}): ${entry.message}`;
}

export function getLogEntriesByType(
  logs: BattleLogEntry[],
  type: LogEntryType
): BattleLogEntry[] {
  return logs.filter((entry) => entry.type === type);
}

export function getLogEntriesByRound(
  logs: BattleLogEntry[],
  round: number
): BattleLogEntry[] {
  return logs.filter((entry) => entry.round === round);
}

export function getTotalDamage(logs: BattleLogEntry[], actor: BattleActor): number {
  return logs
    .filter((entry) => entry.actor === actor && entry.type === "ship_attack")
    .reduce((sum, entry) => sum + entry.damage, 0);
}

export function getTotalShieldAbsorbed(logs: BattleLogEntry[], actor: BattleActor): number {
  return logs
    .filter((entry) => entry.actor === actor && entry.type === "shield_absorb")
    .reduce((sum, entry) => sum + entry.shieldDamage, 0);
}

export function getShipsDestroyed(
  logs: BattleLogEntry[],
  actor: BattleActor
): Record<string, number> {
  const destroyed: Record<string, number> = {};
  const entries = logs.filter(
    (entry) => entry.actor === actor && entry.type === "ship_destroyed"
  );
  for (const entry of entries) {
    destroyed[entry.unitType] = (destroyed[entry.unitType] || 0) + 1;
  }
  return destroyed;
}

export function wasRetreatAttempted(logs: BattleLogEntry[]): boolean {
  return logs.some(
    (entry) =>
      entry.type === "retreat_attempt" ||
      entry.type === "retreat_success" ||
      entry.type === "retreat_failed"
  );
}

export function wasRetreatSuccessful(logs: BattleLogEntry[]): boolean {
  return logs.some((entry) => entry.type === "retreat_success");
}

export function getPlunderAmount(logs: BattleLogEntry[]): {
  metal: number;
  crystal: number;
  deuterium: number;
} {
  const completeEntry = logs.find((entry) => entry.type === "plunder_complete");
  if (!completeEntry) {
    return { metal: 0, crystal: 0, deuterium: 0 };
  }
  return {
    metal: (completeEntry.details.metal as number) || 0,
    crystal: (completeEntry.details.crystal as number) || 0,
    deuterium: (completeEntry.details.deuterium as number) || 0,
  };
}
