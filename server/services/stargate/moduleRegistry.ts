export type StargateModuleStatus = "implemented" | "foundation" | "planned";

export interface StargateModuleDefinition {
  id: string;
  name: string;
  domain: "economy" | "world" | "social" | "progression" | "operations" | "governance";
  status: StargateModuleStatus;
  description: string;
  routes: string[];
  dependencies: string[];
}

export const STARGATE_MODULES: StargateModuleDefinition[] = [
  { id: "turn-engine", name: "Turn Engine", domain: "economy", status: "implemented", description: "Authoritative thirty-minute economy, personnel, and attack-turn processing.", routes: ["GET /api/stargate/state", "POST /api/stargate/tick"], dependencies: [] },
  { id: "personnel", name: "Personnel & Training", domain: "economy", status: "implemented", description: "Personnel conversion, weapons-as-counts, unit production, and strategic technology.", routes: ["POST /api/stargate/train", "POST /api/stargate/technology"], dependencies: ["turn-engine"] },
  { id: "armory", name: "Armory", domain: "operations", status: "implemented", description: "Configurable equipment catalog, maintenance, deployment, durability, and sabotage exposure.", routes: ["GET /api/stargate/armory", "POST /api/stargate/armory"], dependencies: ["personnel"] },
  { id: "intelligence", name: "Intelligence", domain: "operations", status: "implemented", description: "Reconnaissance, covert skill levels, sabotage, detection, losses, and reports.", routes: ["POST /api/stargate/recon", "POST /api/stargate/sabotage", "POST /api/stargate/intelligence-level"], dependencies: ["turn-engine", "armory"] },
  { id: "combat", name: "Combat & Raids", domain: "operations", status: "implemented", description: "Deterministic raid resolution with turn costs, casualty accounting, loot, and logs.", routes: ["POST /api/stargate/raid"], dependencies: ["personnel", "armory"] },
  { id: "market", name: "Strategic Market", domain: "economy", status: "foundation", description: "Market turns, exchange quotes, private-trade escrow, mercenary capacity, and black-market extensions.", routes: ["GET /api/stargate/market", "POST /api/stargate/market/exchange", "POST /api/stargate/market/trade"], dependencies: ["turn-engine", "protection"] },
  { id: "mothership", name: "Mothership", domain: "world", status: "foundation", description: "Single-mothership acquisition, module capacity, combat support, and timed exploration state.", routes: ["GET /api/stargate/mothership", "POST /api/stargate/mothership/buy", "POST /api/stargate/mothership/explore"], dependencies: ["market", "worlds"] },
  { id: "worlds", name: "Strategic Planets", domain: "world", status: "foundation", description: "Planet discovery, bonus configuration, defenses, damage, ownership, and conquest hooks.", routes: ["GET /api/stargate/worlds", "POST /api/stargate/worlds/explore", "POST /api/stargate/worlds/conquer"], dependencies: ["mothership", "protection"] },
  { id: "commander", name: "Commander & Officers", domain: "social", status: "foundation", description: "Commander membership, officer slots, income sharing, and production modifiers.", routes: ["GET /api/stargate/commander", "POST /api/stargate/commander/officers"], dependencies: ["turn-engine"] },
  { id: "alliances", name: "Alliances", domain: "social", status: "foundation", description: "Alliance identity, membership applications, diplomacy, messages, recruitment, and shared logs.", routes: ["GET /api/stargate/alliances", "POST /api/stargate/alliances", "POST /api/stargate/alliances/apply"], dependencies: ["commander", "protection"] },
  { id: "rankings", name: "Rankings", domain: "progression", status: "foundation", description: "Attack, defense, covert, mothership, race, alliance, glory, reputation, and overall snapshots.", routes: ["GET /api/stargate/rankings"], dependencies: ["combat", "worlds", "alliances"] },
  { id: "ascension", name: "Ascension", domain: "progression", status: "implemented", description: "Readiness assessment for configurable Glory, Reputation, Naquadah, and Ascension-level requirements.", routes: ["GET /api/stargate/ascension"], dependencies: ["rankings"] },
  { id: "protection", name: "Protection & Anti-Farming", domain: "governance", status: "foundation", description: "PPT, vacation, operation cooldowns, rank-range checks, same-IP checks, and covert saturation.", routes: ["GET /api/stargate/protection", "POST /api/stargate/protection/vacation"], dependencies: [] },
  { id: "events", name: "Events & Audit", domain: "governance", status: "foundation", description: "Immutable domain-event envelopes, administrative traces, scheduled events, and report references.", routes: ["GET /api/stargate/events"], dependencies: ["combat", "market", "worlds"] },
];

export function getStargateModule(id: string): StargateModuleDefinition {
  const module = STARGATE_MODULES.find((entry) => entry.id === id);
  if (!module) throw new Error("Unknown Stargate system module");
  return module;
}

export function getStargateModuleSummary() {
  return {
    modules: STARGATE_MODULES,
    totals: {
      implemented: STARGATE_MODULES.filter((entry) => entry.status === "implemented").length,
      foundation: STARGATE_MODULES.filter((entry) => entry.status === "foundation").length,
      planned: STARGATE_MODULES.filter((entry) => entry.status === "planned").length,
    },
  };
}
