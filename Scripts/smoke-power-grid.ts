import {
  advanceGridCycle,
  createInitialGridState,
  researchGridTechnology,
  startGridProject,
  toggleGridLink,
  triggerGridIncident,
} from "../client/src/lib/interplanetaryPowerSimulation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let state = createInitialGridState();
assert(state.nodes.length === 6, "Expected six initial strategic nodes.");
assert(state.links.length === 8, "Expected eight initial transmission and control links.");
assert(state.metrics.generation > state.metrics.demand, "Initial grid should have positive raw generation headroom.");

const initialCycle = state.cycle;
const initialResearch = state.researchPoints;
state = advanceGridCycle(state);
assert(state.cycle === initialCycle + 1, "Grid cycle did not advance.");
assert(state.researchPoints > initialResearch, "Research output was not settled.");
assert(state.lifetimeEnergy > 0, "Delivered energy was not recorded.");

state = toggleGridLink(state, "helios-aurelia");
assert(state.links.find((link) => link.id === "helios-aurelia")?.enabled === false, "Link isolation failed.");

state = triggerGridIncident(state, 0);
assert(state.incidents.some((incident) => !incident.resolved), "Incident generation failed.");

state = researchGridTechnology(state, "beam-forming");
assert(state.unlockedTechnologies.includes("beam-forming"), "Eligible technology research failed.");

state = researchGridTechnology(state, "flux-storage");
state = startGridProject(state, "aurelia-black-start");
assert(state.activeProjects.some((project) => project.definitionId === "aurelia-black-start"), "Project commissioning failed.");

for (let cycle = 0; cycle < 8; cycle += 1) state = advanceGridCycle(state);
assert(state.completedProjects.includes("aurelia-black-start"), "Project did not complete after sufficient cycles.");
assert((state.nodes.find((node) => node.id === "aurelia")?.storageCapacity ?? 0) > 1300, "Completed project effect was not applied.");

console.log(`Power-grid smoke test passed at cycle ${state.cycle}.`);
