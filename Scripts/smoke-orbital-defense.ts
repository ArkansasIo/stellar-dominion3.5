import {
  advanceOrbitalCycle,
  assignOrbitalZone,
  constructOrbitalPlatform,
  createOrbitalDefenseState,
  decommissionOrbitalPlatform,
  getFleetSummary,
  installOrbitalModule,
  launchOrbitalMission,
  queueOrbitalOrder,
  removeOrbitalModule,
  renameOrbitalPlatform,
  researchOrbitalTechnology,
  setOrbitalDoctrine,
  simulateOrbitalBattle,
  upgradeOrbitalPlatform,
} from "../client/src/lib/orbitalDefenseSystem";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let state = createOrbitalDefenseState();
const initialFleet = getFleetSummary(state);
assert(initialFleet.platforms === 3, "Expected three starting orbital assets.");
assert(initialFleet.combatPower > 0, "Starting fleet must have combat power.");

state = researchOrbitalTechnology(state, "combat-ai");
assert(state.unlockedTech.includes("combat-ai"), "Combat AI research failed.");

const selectedId = state.platforms[0].id;
state = installOrbitalModule(state, selectedId, "fire-control");
assert(state.platforms[0].modules.includes("fire-control"), "Module installation failed.");
const moduleCount = state.platforms[0].modules.length;
state = removeOrbitalModule(state, selectedId, moduleCount - 1);
assert(state.platforms[0].modules.length === moduleCount - 1, "Module removal failed.");
assert((state.inventory["fire-control"] ?? 0) === 1, "Removed module was not added to inventory.");

state = renameOrbitalPlatform(state, selectedId, "Argus Prime");
state = assignOrbitalZone(state, selectedId, "outer-intercept");
assert(state.platforms[0].name === "Argus Prime", "Platform rename failed.");
assert(state.platforms[0].orbit === "outer-intercept", "Orbit reassignment failed.");

const initialLevel = state.platforms[0].level;
state = upgradeOrbitalPlatform(state, selectedId);
assert(state.platforms[0].level === initialLevel + 1, "Platform level upgrade failed.");

state = setOrbitalDoctrine(state, "interdiction");
assert(state.platforms.every((platform) => platform.doctrine === "interdiction"), "Doctrine propagation failed.");

const initialCount = state.platforms.length;
state = constructOrbitalPlatform(state, "javelin-platform");
assert(state.platforms.length === initialCount + 1, "Platform construction failed.");

state = queueOrbitalOrder(state, "construct", "lancer-sat");
assert(state.orders.length === 1, "Construction order was not queued.");
for (let cycle = 0; cycle < 3; cycle += 1) state = advanceOrbitalCycle(state);
assert(state.platforms.length >= initialCount + 2, "Queued construction did not complete.");

state = launchOrbitalMission(state, "patrol", [selectedId], "outer-intercept");
assert(state.missions.some((mission) => mission.status === "active"), "Orbital mission did not launch.");
state = advanceOrbitalCycle(state);
state = advanceOrbitalCycle(state);
assert(state.missions.some((mission) => mission.status !== "active"), "Orbital mission did not resolve.");

state = simulateOrbitalBattle(state, "pirate-swarm");
assert(state.reports.length === 1, "Battle report was not generated.");
assert(state.reports[0].rounds.length > 0, "Battle did not resolve any rounds.");
assert(state.reports[0].totalDamageDealt > 0, "Defense network dealt no damage.");
assert(state.cycle > 1, "Orbital cycle did not advance.");

const beforeDecommission = state.platforms.length;
const decommissionTarget = state.platforms[state.platforms.length - 1].id;
state = decommissionOrbitalPlatform(state, decommissionTarget);
assert(state.platforms.length === beforeDecommission - 1, "Platform decommission failed.");

console.log(`Orbital-defense smoke test passed with ${state.platforms.length} surviving platforms.`);
