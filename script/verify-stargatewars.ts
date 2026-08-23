import assert from "node:assert/strict";
import {
  calculateAntiCovertAction,
  calculateBankCapacity,
  calculateCovertAction,
  calculateDefenseAction,
  calculateNaturalIncome,
  calculateStrikeAction,
  type StargatePersonnel,
  type StargateWarsState,
} from "../server/services/stargateWarsService";

const baseState: StargateWarsState = {
  race: "tauri",
  defcon: "none",
  attackTurns: 20,
  marketTurns: 3,
  unitProduction: 10,
  spyLevel: 2,
  antiSpyLevel: 2,
  technologies: { offense: 0, defense: 0, covert: 0, antiCovert: 0, unique: 0, mercenary: 0 },
  glory: 0,
  reputation: 0,
  ascensionPoints: 0,
  ascensionLevel: 0,
  armory: { inventory: {} },
  lastTurnAt: Date.now(),
  logs: [],
};

const personnel: StargatePersonnel = {
  untrained: 100,
  miners: 10,
  lifers: 2,
  attackTroops: 20,
  superAttackTroops: 2,
  defenseTroops: 18,
  superDefenseTroops: 1,
  covertAgents: 12,
  antiIntelAgents: 9,
  attackWeapons: 22,
  defenseWeapons: 19,
};

const tauriIncome = calculateNaturalIncome(personnel, baseState);
assert.equal(tauriIncome, 2960, "natural income must use untrained, miner, and lifer contribution");
assert.equal(calculateNaturalIncome(personnel, { ...baseState, race: "goauld" }), 3700, "Goa'uld income doctrine must add 25%");
assert.equal(calculateNaturalIncome(personnel, { ...baseState, defcon: "high" }), 1776, "high DefCon must apply a 40% income reduction");
assert.equal(calculateBankCapacity(personnel, baseState), 213120, "vault capacity must equal baseline natural income × 72");

const tauriStrike = calculateStrikeAction(personnel, baseState);
const neutralStrike = calculateStrikeAction(personnel, { ...baseState, race: "goauld" });
assert.equal(tauriStrike, Math.floor(neutralStrike * 1.25), "Tau'ri doctrine must add 25% strike action");
assert.ok(calculateDefenseAction(personnel, { ...baseState, race: "asgard" }) > calculateDefenseAction(personnel, baseState), "Asgard doctrine must improve defense action");
assert.ok(calculateCovertAction(personnel, { ...baseState, race: "replicator" }) > calculateCovertAction(personnel, baseState), "Replicator doctrine must improve covert action");
assert.ok(calculateAntiCovertAction(personnel, { ...baseState, defcon: "critical" }) > calculateAntiCovertAction(personnel, baseState), "Critical DefCon must improve anti-covert action");

console.log("StargateWars strategic formula checks passed.");
