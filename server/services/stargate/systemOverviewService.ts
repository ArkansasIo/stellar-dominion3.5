import { getStargateModuleSummary } from "./moduleRegistry";

export function getStargateSystemsOverview() {
  return {
    ...getStargateModuleSummary(),
    generatedAt: Date.now(),
    message: "This overview reports the actual delivery state of each StargateWars system module. Foundation modules provide stable files and API contracts; their high-impact transactions remain unavailable until persistence and protection dependencies are complete.",
  };
}
