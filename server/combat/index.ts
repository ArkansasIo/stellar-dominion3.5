export { BattleUnit, type BattleUnitConfig } from "./BattleUnit";
export { simulateBattle, type BattleInput } from "./PhpBattleEngine";
export { OGameShipDatabase, type OGameShipStats } from "./BattleEngine";
export { calculateLoot, distributeLoot } from "./services/LootService";
export { calculateRepairedDefenses } from "./services/DefenseRepairService";
export type { BattleResultData, BattleResultRound, AttackerFleetResult, DefenderFleetResult } from "./BattleResult";
export type { AttackerFleetData, DefenderFleetData, FleetUnit } from "./fleets";
