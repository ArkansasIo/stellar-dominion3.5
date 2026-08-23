import assert from "node:assert/strict";
import { calculateProduction } from "../server/gameEngine";
import { calculateNaturalIncome } from "../server/services/stargateWarsService";

const mineLevels = {
  metalMine: 10,
  crystalMine: 10,
  deuteriumSynthesizer: 10,
  solarPlant: 10,
};

const conventional = calculateProduction(mineLevels, {});
assert.deepEqual(
  conventional,
  { metal: 600, crystal: 400, deuterium: 183, energy: 20 },
  "Conventional hourly production must use the canonical mine formula",
);

const baseStrategicState = {
  race: "tauri",
  defcon: "none",
} as any;
const strategicPersonnel = {
  untrained: 5,
  miners: 3,
  lifers: 2,
} as any;
const naquadahPerTurn = calculateNaturalIncome(strategicPersonnel, baseStrategicState);
assert.equal(naquadahPerTurn, 1_940, "Naquadah income must value each permanent Lifer as the ten-Miner workforce it replaces");

const goauldIncome = calculateNaturalIncome(strategicPersonnel, { ...baseStrategicState, race: "goauld" });
assert.equal(goauldIncome, 2_425, "Goa'uld doctrine must apply its 25% Naquadah income modifier to permanent workforce output");

console.log(JSON.stringify({
  conventionalPerHour: conventional,
  naquadahPerStrategicTurn: naquadahPerTurn,
  goauldNaquadahPerStrategicTurn: goauldIncome,
}, null, 2));
