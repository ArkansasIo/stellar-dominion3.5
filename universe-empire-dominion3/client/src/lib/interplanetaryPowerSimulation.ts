import {
  AiDoctrine,
  DOCTRINES,
  GRID_NODES,
  GridPriority,
  POWER_TECHNOLOGIES,
  PowerResource,
  ResourceCost,
} from "@/lib/interplanetaryPowerGrid";

export type NodeCondition = "nominal" | "strained" | "brownout" | "blackout" | "isolated";
export type IncidentSeverity = "advisory" | "warning" | "critical";
export type ProjectCategory = "generation" | "transmission" | "storage" | "extraction" | "defense" | "ai";

export interface StrategicStockpile extends Record<Exclude<PowerResource, "energy">, number> {
  credits: number;
  data: number;
}

export interface RuntimeGridNode {
  id: string;
  enabled: boolean;
  condition: NodeCondition;
  integrity: number;
  wear: number;
  generationMultiplier: number;
  demandMultiplier: number;
  storageLevel: number;
  storageCapacity: number;
  deliveredPower: number;
  unmetDemand: number;
  extractionRate: number;
  populationStability: number;
  threat: number;
  maintenanceDebt: number;
}

export interface PowerLink {
  id: string;
  from: string;
  to: string;
  type: "microwave" | "laser" | "relay" | "quantum" | "wormhole";
  enabled: boolean;
  efficiency: number;
  capacity: number;
  integrity: number;
  flow: number;
  threat: number;
  maintenance: number;
}

export interface GridProjectDefinition {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  effect: string;
  duration: number;
  cost: ResourceCost & { credits?: number };
  requiredTechnology?: string;
  targetNodeId?: string;
  repeatable?: boolean;
}

export interface ActiveGridProject {
  id: string;
  definitionId: string;
  progress: number;
  duration: number;
  startedCycle: number;
}

export interface GridIncident {
  id: string;
  templateId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  nodeId?: string;
  linkId?: string;
  remainingCycles: number;
  resolved: boolean;
  resolutionCost: ResourceCost & { credits?: number };
}

export interface GridLogEntry {
  id: string;
  cycle: number;
  category: "dispatch" | "economy" | "research" | "project" | "incident" | "security";
  title: string;
  detail: string;
}

export interface GridMetrics {
  generation: number;
  delivered: number;
  demand: number;
  reserve: number;
  storageStored: number;
  storageCapacity: number;
  coverage: number;
  efficiency: number;
  integrity: number;
  extraction: number;
  researchPerCycle: number;
  maintenanceCost: number;
  emissions: number;
}

export interface InterplanetaryGridState {
  version: 2;
  cycle: number;
  doctrine: AiDoctrine;
  priorities: Record<GridPriority, number>;
  reserveTarget: number;
  automationEnabled: boolean;
  paused: boolean;
  researchPoints: number;
  unlockedTechnologies: string[];
  stockpile: StrategicStockpile;
  nodes: RuntimeGridNode[];
  links: PowerLink[];
  activeProjects: ActiveGridProject[];
  completedProjects: string[];
  incidents: GridIncident[];
  log: GridLogEntry[];
  lifetimeEnergy: number;
  lifetimeResearch: number;
  metrics: GridMetrics;
}

export const GRID_PROJECTS: GridProjectDefinition[] = [
  { id: "helios-collector-ring", name: "Helios Collector Ring", category: "generation", description: "Add a coordinated inner-orbit collector band around Helios Prime.", effect: "+900 PW stellar generation.", duration: 6, cost: { metal: 7200, crystal: 4600, helium3: 240, credits: 18000 }, targetNodeId: "helios", requiredTechnology: "swarm-ops" },
  { id: "aurelia-black-start", name: "Aurelia Black-Start Reserve", category: "storage", description: "Harden the capital against complete network collapse.", effect: "+700 PWh storage and improved blackout survival.", duration: 4, cost: { metal: 2600, crystal: 1800, deuterium: 900, credits: 7200 }, targetNodeId: "aurelia", requiredTechnology: "flux-storage" },
  { id: "vulcan-industrial-loop", name: "Vulcan Industrial Heat Loop", category: "generation", description: "Recycle forge-world waste heat into dispatchable power.", effect: "+360 PW generation and -8% industrial demand.", duration: 5, cost: { metal: 5200, crystal: 1200, credits: 9600 }, targetNodeId: "vulcan" },
  { id: "selene-containment", name: "Selene Containment Citadel", category: "defense", description: "Encapsulate antimatter reserves in redundant magnetic vaults.", effect: "+15 integrity, -20 threat, and safer peak generation.", duration: 5, cost: { metal: 4400, crystal: 3200, antimatter: 40, credits: 12000 }, targetNodeId: "selene", requiredTechnology: "antimatter-grid" },
  { id: "khepri-drone-cloud", name: "Khepri Autonomous Drone Cloud", category: "extraction", description: "Deploy self-repairing miners, haulers, and refinery tenders.", effect: "+55% field extraction and lower local demand.", duration: 4, cost: { metal: 3000, crystal: 1500, quantumCores: 4, credits: 8000 }, targetNodeId: "khepri", requiredTechnology: "autonomous-mines" },
  { id: "nexus-ai-expansion", name: "Lagrange AIC Expansion", category: "ai", description: "Install redundant forecast clusters and cyber-defense enclaves.", effect: "+4% grid efficiency and lower incident probability.", duration: 5, cost: { crystal: 5400, quantumCores: 12, credits: 15000 }, targetNodeId: "nexus", requiredTechnology: "q-command" },
  { id: "relay-redundancy", name: "System Relay Redundancy", category: "transmission", description: "Add alternate beam paths and automatic route bypasses.", effect: "+6% link integrity and transmission efficiency.", duration: 6, cost: { metal: 6800, crystal: 5200, deuterium: 1800, credits: 16500 }, requiredTechnology: "beam-forming" },
  { id: "wormhole-exchange", name: "Interstellar Energy Exchange", category: "transmission", description: "Commission a metered wormhole conduit for foreign-system power trading.", effect: "Activates the dormant wormhole link and earns surplus credits.", duration: 10, cost: { metal: 16000, crystal: 14000, antimatter: 180, exoticMatter: 100, credits: 42000 }, requiredTechnology: "wormhole-conduit" },
];

const INCIDENT_TEMPLATES = [
  { id: "solar-storm", title: "Coronal Mass Ejection", description: "Charged particles blind collectors and induce dangerous currents.", severity: "warning" as const, duration: 3, cost: { crystal: 700, credits: 2200 } },
  { id: "relay-sabotage", title: "Relay Sabotage", description: "Coordinated infiltrators damage a high-flow transmission relay.", severity: "critical" as const, duration: 4, cost: { metal: 1100, crystal: 500, credits: 3600 } },
  { id: "containment-drift", title: "Containment Field Drift", description: "Antimatter bottle harmonics have moved outside safe tolerances.", severity: "critical" as const, duration: 2, cost: { deuterium: 800, quantumCores: 2, credits: 4200 } },
  { id: "thermal-load", title: "Thermal Saturation", description: "Waste-heat rejection capacity is throttling an industrial node.", severity: "warning" as const, duration: 3, cost: { metal: 650, credits: 1800 } },
  { id: "false-telemetry", title: "False Telemetry Injection", description: "A hostile signal is manipulating demand and reserve forecasts.", severity: "warning" as const, duration: 3, cost: { crystal: 500, quantumCores: 1, credits: 2600 } },
  { id: "collector-drift", title: "Collector Orbital Drift", description: "Several solar collectors require immediate station keeping.", severity: "advisory" as const, duration: 2, cost: { deuterium: 450, credits: 1200 } },
];

const INITIAL_LINKS: PowerLink[] = [
  { id: "helios-aurelia", from: "helios", to: "aurelia", type: "laser", enabled: true, efficiency: 88, capacity: 1900, integrity: 94, flow: 0, threat: 12, maintenance: 180 },
  { id: "helios-vulcan", from: "helios", to: "vulcan", type: "laser", enabled: true, efficiency: 85, capacity: 2200, integrity: 89, flow: 0, threat: 18, maintenance: 210 },
  { id: "aurelia-nexus", from: "aurelia", to: "nexus", type: "microwave", enabled: true, efficiency: 94, capacity: 900, integrity: 96, flow: 0, threat: 6, maintenance: 80 },
  { id: "nexus-selene", from: "nexus", to: "selene", type: "relay", enabled: true, efficiency: 93, capacity: 1800, integrity: 92, flow: 0, threat: 14, maintenance: 140 },
  { id: "vulcan-khepri", from: "vulcan", to: "khepri", type: "relay", enabled: true, efficiency: 89, capacity: 1100, integrity: 81, flow: 0, threat: 29, maintenance: 130 },
  { id: "selene-khepri", from: "selene", to: "khepri", type: "microwave", enabled: true, efficiency: 87, capacity: 800, integrity: 86, flow: 0, threat: 24, maintenance: 100 },
  { id: "quantum-command", from: "nexus", to: "helios", type: "quantum", enabled: true, efficiency: 100, capacity: 0, integrity: 98, flow: 0, threat: 10, maintenance: 90 },
  { id: "interstellar-conduit", from: "helios", to: "nexus", type: "wormhole", enabled: false, efficiency: 79, capacity: 7200, integrity: 76, flow: 0, threat: 45, maintenance: 520 },
];

const EMPTY_METRICS: GridMetrics = {
  generation: 0,
  delivered: 0,
  demand: 0,
  reserve: 0,
  storageStored: 0,
  storageCapacity: 0,
  coverage: 100,
  efficiency: 91,
  integrity: 100,
  extraction: 0,
  researchPerCycle: 0,
  maintenanceCost: 0,
  emissions: 0,
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function hasResources(stockpile: StrategicStockpile, cost: ResourceCost & { credits?: number }) {
  return Object.entries(cost).every(([key, amount]) => (stockpile[key as keyof StrategicStockpile] ?? 0) >= (amount ?? 0));
}

function spendResources(stockpile: StrategicStockpile, cost: ResourceCost & { credits?: number }): StrategicStockpile {
  const next = { ...stockpile };
  Object.entries(cost).forEach(([key, amount]) => {
    const resource = key as keyof StrategicStockpile;
    next[resource] = Math.max(0, next[resource] - (amount ?? 0));
  });
  return next;
}

function addLog(state: InterplanetaryGridState, entry: Omit<GridLogEntry, "id" | "cycle">): GridLogEntry[] {
  return [
    { ...entry, id: `${state.cycle}-${entry.category}-${state.log.length}`, cycle: state.cycle },
    ...state.log,
  ].slice(0, 60);
}

function technologyBonus(state: InterplanetaryGridState, id: string) {
  return state.unlockedTechnologies.includes(id);
}

function projectCompleted(state: InterplanetaryGridState, id: string) {
  return state.completedProjects.includes(id);
}

function computeMetrics(state: InterplanetaryGridState): GridMetrics {
  const activeLinks = state.links.filter((link) => link.enabled && link.integrity > 15 && link.type !== "quantum");
  const linkEfficiency = activeLinks.length
    ? activeLinks.reduce((sum, link) => sum + link.efficiency * (link.integrity / 100), 0) / activeLinks.length
    : 58;
  const techEfficiency =
    (technologyBonus(state, "superconductors") ? 4 : 0) +
    (technologyBonus(state, "beam-forming") ? 5 : 0) +
    (technologyBonus(state, "sentient-dispatch") ? 8 : 0) +
    (projectCompleted(state, "nexus-ai-expansion") ? 4 : 0) +
    (projectCompleted(state, "relay-redundancy") ? 6 : 0);
  const doctrineEfficiency = state.doctrine === "balanced" ? 3 : state.doctrine === "survival" ? -2 : 0;
  const efficiency = clamp(linkEfficiency + techEfficiency + doctrineEfficiency, 45, 99);

  let generation = 0;
  let demand = 0;
  let storageStored = 0;
  let storageCapacity = 0;
  let extraction = 0;
  let integrity = 0;

  state.nodes.forEach((runtime) => {
    const base = GRID_NODES.find((node) => node.id === runtime.id);
    if (!base) return;
    const incidentPenalty = state.incidents.some((incident) => !incident.resolved && incident.nodeId === runtime.id) ? 0.78 : 1;
    const fusionBonus = technologyBonus(state, "he3-cycle") && runtime.id !== "helios" ? 1.12 : 1;
    const stellarBonus = technologyBonus(state, "swarm-ops") && runtime.id === "helios" ? 1.18 : 1;
    const projectGeneration =
      runtime.id === "helios" && projectCompleted(state, "helios-collector-ring") ? 900 :
      runtime.id === "vulcan" && projectCompleted(state, "vulcan-industrial-loop") ? 360 : 0;
    const nodeGeneration = runtime.enabled
      ? (base.generation * runtime.generationMultiplier * (runtime.integrity / 100) * incidentPenalty * fusionBonus * stellarBonus) + projectGeneration
      : 0;
    const demandReduction =
      runtime.id === "khepri" && technologyBonus(state, "autonomous-mines") ? 0.92 :
      runtime.id === "vulcan" && projectCompleted(state, "vulcan-industrial-loop") ? 0.92 : 1;
    generation += nodeGeneration;
    demand += base.demand * runtime.demandMultiplier * demandReduction;
    storageStored += runtime.storageLevel;
    storageCapacity += runtime.storageCapacity;
    extraction += runtime.extractionRate * (runtime.deliveredPower > 0 ? clamp(runtime.deliveredPower / Math.max(1, base.demand), 0.2, 1.2) : 0.1);
    integrity += runtime.integrity;
  });

  const delivered = generation * (efficiency / 100);
  const reserve = delivered - demand;
  const coverage = demand ? clamp((delivered / demand) * 100, 0, 140) : 100;
  const researchBase = 85 + (state.priorities.research * 2.4);
  const researchPerCycle = researchBase * (coverage / 100) * (state.doctrine === "science" ? 1.12 : 1);
  const maintenanceCost = state.links.filter((link) => link.enabled).reduce((sum, link) => sum + link.maintenance, 0)
    + state.nodes.reduce((sum, node) => sum + node.maintenanceDebt * 3, 0);
  const emissions = Math.max(0, generation * 0.018 - (technologyBonus(state, "stellar-economy") ? generation * 0.012 : 0));

  return {
    generation: round(generation),
    delivered: round(delivered),
    demand: round(demand),
    reserve: round(reserve),
    storageStored: round(storageStored),
    storageCapacity: round(storageCapacity),
    coverage: round(coverage),
    efficiency: round(efficiency),
    integrity: round(integrity / Math.max(1, state.nodes.length)),
    extraction: round(extraction),
    researchPerCycle: round(researchPerCycle),
    maintenanceCost: round(maintenanceCost),
    emissions: round(emissions),
  };
}

export function createInitialGridState(): InterplanetaryGridState {
  const state: InterplanetaryGridState = {
    version: 2,
    cycle: 1,
    doctrine: "balanced",
    priorities: { ...DOCTRINES.balanced.priorities },
    reserveTarget: 18,
    automationEnabled: true,
    paused: false,
    researchPoints: 12800,
    unlockedTechnologies: ["smart-grid", "superconductors", "he3-cycle"],
    stockpile: {
      metal: 28000,
      crystal: 22000,
      deuterium: 14500,
      helium3: 1800,
      antimatter: 420,
      exoticMatter: 160,
      quantumCores: 75,
      credits: 92000,
      data: 6800,
    },
    nodes: GRID_NODES.map((node) => ({
      id: node.id,
      enabled: true,
      condition: "nominal",
      integrity: node.integrity,
      wear: Math.max(0, 100 - node.integrity),
      generationMultiplier: 1,
      demandMultiplier: 1,
      storageLevel: Math.round(node.storage * 0.62),
      storageCapacity: node.storage,
      deliveredPower: node.demand,
      unmetDemand: 0,
      extractionRate: node.bodyType === "field" ? 185 : node.bodyType === "moon" ? 48 : 24,
      populationStability: node.bodyType === "field" || node.bodyType === "star" ? 100 : 92,
      threat: node.bodyType === "field" ? 34 : node.bodyType === "station" ? 18 : 12,
      maintenanceDebt: Math.max(0, 92 - node.integrity),
    })),
    links: INITIAL_LINKS.map((link) => ({ ...link })),
    activeProjects: [],
    completedProjects: [],
    incidents: [],
    log: [{
      id: "1-dispatch-0",
      cycle: 1,
      category: "dispatch",
      title: "AIC grid initialized",
      detail: "Six strategic nodes synchronized under Balanced Steward doctrine.",
    }],
    lifetimeEnergy: 0,
    lifetimeResearch: 0,
    metrics: EMPTY_METRICS,
  };
  return { ...state, metrics: computeMetrics(state) };
}

export function hydrateGridState(raw: unknown): InterplanetaryGridState {
  if (!raw || typeof raw !== "object") return createInitialGridState();
  const candidate = raw as Partial<InterplanetaryGridState>;
  if (candidate.version !== 2 || !Array.isArray(candidate.nodes) || !Array.isArray(candidate.links)) return createInitialGridState();
  const fallback = createInitialGridState();
  const hydrated: InterplanetaryGridState = {
    ...fallback,
    ...candidate,
    stockpile: { ...fallback.stockpile, ...candidate.stockpile },
    priorities: { ...fallback.priorities, ...candidate.priorities },
    nodes: fallback.nodes.map((node) => ({ ...node, ...(candidate.nodes?.find((entry) => entry.id === node.id) ?? {}) })),
    links: fallback.links.map((link) => ({ ...link, ...(candidate.links?.find((entry) => entry.id === link.id) ?? {}) })),
    activeProjects: candidate.activeProjects ?? [],
    completedProjects: candidate.completedProjects ?? [],
    incidents: candidate.incidents ?? [],
    log: candidate.log ?? fallback.log,
    unlockedTechnologies: candidate.unlockedTechnologies ?? fallback.unlockedTechnologies,
  };
  return { ...hydrated, metrics: computeMetrics(hydrated) };
}

export function setGridDoctrine(state: InterplanetaryGridState, doctrine: AiDoctrine): InterplanetaryGridState {
  const next = {
    ...state,
    doctrine,
    priorities: { ...DOCTRINES[doctrine].priorities },
  };
  next.log = addLog(next, { category: "dispatch", title: `${DOCTRINES[doctrine].label} activated`, detail: DOCTRINES[doctrine].description });
  return { ...next, metrics: computeMetrics(next) };
}

export function setGridPriority(state: InterplanetaryGridState, priority: GridPriority, value: number): InterplanetaryGridState {
  const nextPriorities = { ...state.priorities, [priority]: clamp(value, 5, 60) };
  const total = Object.values(nextPriorities).reduce((sum, current) => sum + current, 0);
  const normalized = Object.fromEntries(
    Object.entries(nextPriorities).map(([key, current]) => [key, Math.round((current / total) * 100)]),
  ) as Record<GridPriority, number>;
  const drift = 100 - Object.values(normalized).reduce((sum, current) => sum + current, 0);
  normalized[priority] += drift;
  const next = { ...state, priorities: normalized };
  return { ...next, metrics: computeMetrics(next) };
}

export function toggleGridLink(state: InterplanetaryGridState, linkId: string): InterplanetaryGridState {
  const links = state.links.map((link) => link.id === linkId ? { ...link, enabled: !link.enabled } : link);
  const changed = links.find((link) => link.id === linkId);
  const next = { ...state, links };
  next.log = addLog(next, {
    category: "dispatch",
    title: changed?.enabled ? "Transmission lane activated" : "Transmission lane isolated",
    detail: changed ? `${changed.from} to ${changed.to} ${changed.type} link changed state.` : "Link state changed.",
  });
  return { ...next, metrics: computeMetrics(next) };
}

export function toggleGridNode(state: InterplanetaryGridState, nodeId: string): InterplanetaryGridState {
  const nodes = state.nodes.map((node) => node.id === nodeId ? { ...node, enabled: !node.enabled, condition: !node.enabled ? "nominal" as const : "isolated" as const } : node);
  const next = { ...state, nodes };
  next.log = addLog(next, { category: "dispatch", title: "Node operating state changed", detail: `${GRID_NODES.find((node) => node.id === nodeId)?.name ?? nodeId} was ${nodes.find((node) => node.id === nodeId)?.enabled ? "reconnected" : "isolated"}.` });
  return { ...next, metrics: computeMetrics(next) };
}

export function repairGridNode(state: InterplanetaryGridState, nodeId: string): InterplanetaryGridState {
  const node = state.nodes.find((entry) => entry.id === nodeId);
  if (!node) return state;
  const cost = { metal: Math.ceil((100 - node.integrity) * 18), credits: Math.ceil((100 - node.integrity) * 42) };
  if (!hasResources(state.stockpile, cost)) return state;
  const nodes = state.nodes.map((entry) => entry.id === nodeId ? {
    ...entry,
    integrity: clamp(entry.integrity + 20),
    wear: clamp(entry.wear - 18),
    maintenanceDebt: Math.max(0, entry.maintenanceDebt - 12),
    condition: "nominal" as const,
  } : entry);
  const next = { ...state, nodes, stockpile: spendResources(state.stockpile, cost) };
  next.log = addLog(next, { category: "project", title: "Emergency node repair completed", detail: `${GRID_NODES.find((entry) => entry.id === nodeId)?.name ?? nodeId} restored by 20 integrity.` });
  return { ...next, metrics: computeMetrics(next) };
}

export function repairGridLink(state: InterplanetaryGridState, linkId: string): InterplanetaryGridState {
  const link = state.links.find((entry) => entry.id === linkId);
  if (!link) return state;
  const cost = { metal: Math.ceil((100 - link.integrity) * 14), crystal: Math.ceil((100 - link.integrity) * 8), credits: Math.ceil((100 - link.integrity) * 30) };
  if (!hasResources(state.stockpile, cost)) return state;
  const links = state.links.map((entry) => entry.id === linkId ? { ...entry, integrity: clamp(entry.integrity + 22), threat: clamp(entry.threat - 6) } : entry);
  const next = { ...state, links, stockpile: spendResources(state.stockpile, cost) };
  next.log = addLog(next, { category: "project", title: "Transmission repair completed", detail: `${link.from} to ${link.to} restored and recalibrated.` });
  return { ...next, metrics: computeMetrics(next) };
}

export function startGridProject(state: InterplanetaryGridState, definitionId: string): InterplanetaryGridState {
  const definition = GRID_PROJECTS.find((project) => project.id === definitionId);
  if (!definition) return state;
  if (definition.requiredTechnology && !state.unlockedTechnologies.includes(definition.requiredTechnology)) return state;
  if (!definition.repeatable && (state.completedProjects.includes(definitionId) || state.activeProjects.some((project) => project.definitionId === definitionId))) return state;
  if (!hasResources(state.stockpile, definition.cost)) return state;
  const project: ActiveGridProject = {
    id: `${definitionId}-${state.cycle}`,
    definitionId,
    progress: 0,
    duration: definition.duration,
    startedCycle: state.cycle,
  };
  const next = {
    ...state,
    stockpile: spendResources(state.stockpile, definition.cost),
    activeProjects: [...state.activeProjects, project],
  };
  next.log = addLog(next, { category: "project", title: `${definition.name} commissioned`, detail: `${definition.duration}-cycle project entered the industrial queue.` });
  return next;
}

export function researchGridTechnology(state: InterplanetaryGridState, technologyId: string): InterplanetaryGridState {
  const technology = POWER_TECHNOLOGIES.find((entry) => entry.id === technologyId);
  if (!technology || state.unlockedTechnologies.includes(technologyId)) return state;
  if (!technology.prerequisites.every((id) => state.unlockedTechnologies.includes(id))) return state;
  if (state.researchPoints < technology.researchCost || !hasResources(state.stockpile, technology.resourceCost)) return state;
  const next = {
    ...state,
    researchPoints: state.researchPoints - technology.researchCost,
    stockpile: spendResources(state.stockpile, technology.resourceCost),
    unlockedTechnologies: [...state.unlockedTechnologies, technologyId],
  };
  next.log = addLog(next, { category: "research", title: `${technology.name} completed`, detail: technology.effect });
  return { ...next, metrics: computeMetrics(next) };
}

export function resolveGridIncident(state: InterplanetaryGridState, incidentId: string): InterplanetaryGridState {
  const incident = state.incidents.find((entry) => entry.id === incidentId);
  if (!incident || incident.resolved || !hasResources(state.stockpile, incident.resolutionCost)) return state;
  const incidents = state.incidents.map((entry) => entry.id === incidentId ? { ...entry, resolved: true, remainingCycles: 0 } : entry);
  const nodes = incident.nodeId ? state.nodes.map((node) => node.id === incident.nodeId ? { ...node, integrity: clamp(node.integrity + 8), threat: clamp(node.threat - 8) } : node) : state.nodes;
  const links = incident.linkId ? state.links.map((link) => link.id === incident.linkId ? { ...link, integrity: clamp(link.integrity + 10), threat: clamp(link.threat - 8) } : link) : state.links;
  const next = { ...state, incidents, nodes, links, stockpile: spendResources(state.stockpile, incident.resolutionCost) };
  next.log = addLog(next, { category: "incident", title: `${incident.title} resolved`, detail: "Response teams restored safe operating tolerances." });
  return { ...next, metrics: computeMetrics(next) };
}

export function triggerGridIncident(state: InterplanetaryGridState, templateIndex = state.cycle % INCIDENT_TEMPLATES.length): InterplanetaryGridState {
  const template = INCIDENT_TEMPLATES[templateIndex % INCIDENT_TEMPLATES.length];
  const targetNode = state.nodes[(state.cycle + templateIndex) % state.nodes.length];
  const targetLink = state.links[(state.cycle + templateIndex) % state.links.length];
  const targetsLink = template.id === "relay-sabotage" || template.id === "false-telemetry";
  const incident: GridIncident = {
    id: `${template.id}-${state.cycle}-${state.incidents.length}`,
    templateId: template.id,
    title: template.title,
    description: template.description,
    severity: template.severity,
    nodeId: targetsLink ? undefined : targetNode.id,
    linkId: targetsLink ? targetLink.id : undefined,
    remainingCycles: template.duration,
    resolved: false,
    resolutionCost: template.cost,
  };
  const nodes = !targetsLink ? state.nodes.map((node) => node.id === targetNode.id ? { ...node, integrity: clamp(node.integrity - (template.severity === "critical" ? 12 : 6)), condition: "strained" as const } : node) : state.nodes;
  const links = targetsLink ? state.links.map((link) => link.id === targetLink.id ? { ...link, integrity: clamp(link.integrity - (template.severity === "critical" ? 16 : 8)), threat: clamp(link.threat + 10) } : link) : state.links;
  const next = { ...state, nodes, links, incidents: [incident, ...state.incidents].slice(0, 20) };
  next.log = addLog(next, { category: "incident", title: template.title, detail: template.description });
  return { ...next, metrics: computeMetrics(next) };
}

function completeProjectEffects(state: InterplanetaryGridState, definitionId: string): InterplanetaryGridState {
  let nodes = state.nodes;
  let links = state.links;
  if (definitionId === "aurelia-black-start") nodes = nodes.map((node) => node.id === "aurelia" ? { ...node, storageCapacity: node.storageCapacity + 700, storageLevel: node.storageLevel + 350 } : node);
  if (definitionId === "selene-containment") nodes = nodes.map((node) => node.id === "selene" ? { ...node, integrity: clamp(node.integrity + 15), threat: clamp(node.threat - 20) } : node);
  if (definitionId === "khepri-drone-cloud") nodes = nodes.map((node) => node.id === "khepri" ? { ...node, extractionRate: node.extractionRate * 1.55, demandMultiplier: node.demandMultiplier * 0.9 } : node);
  if (definitionId === "relay-redundancy") links = links.map((link) => ({ ...link, integrity: clamp(link.integrity + 6), efficiency: clamp(link.efficiency + 3) }));
  if (definitionId === "wormhole-exchange") links = links.map((link) => link.id === "interstellar-conduit" ? { ...link, enabled: true, integrity: 92 } : link);
  return { ...state, nodes, links };
}

export function advanceGridCycle(state: InterplanetaryGridState, forceIncident = false): InterplanetaryGridState {
  if (state.paused) return state;
  let next: InterplanetaryGridState = { ...state, cycle: state.cycle + 1 };
  let metrics = computeMetrics(next);
  const shortageRatio = metrics.coverage < 100 ? (100 - metrics.coverage) / 100 : 0;
  const surplus = Math.max(0, metrics.reserve);
  const storageDeficit = Math.max(0, -metrics.reserve);
  const totalStorage = next.nodes.reduce((sum, node) => sum + node.storageLevel, 0);
  const storageDischarge = Math.min(totalStorage, storageDeficit);
  const chargePool = surplus * 0.42;

  const priorityDemand = Object.values(next.priorities).reduce((sum, value) => sum + value, 0);
  next.nodes = next.nodes.map((runtime) => {
    const base = GRID_NODES.find((node) => node.id === runtime.id);
    if (!base) return runtime;
    const localNeed = base.demand * runtime.demandMultiplier;
    const localShare = metrics.demand ? localNeed / metrics.demand : 0;
    const dischargeShare = storageDischarge * localShare;
    const chargeShare = chargePool * localShare;
    const available = metrics.delivered * localShare + dischargeShare;
    const unmetDemand = Math.max(0, localNeed - available);
    const condition: NodeCondition = !runtime.enabled ? "isolated" : unmetDemand > localNeed * 0.75 ? "blackout" : unmetDemand > localNeed * 0.15 ? "brownout" : runtime.integrity < 65 ? "strained" : "nominal";
    const wearGain = 0.35 + runtime.threat * 0.008 + (condition === "brownout" ? 1.2 : condition === "blackout" ? 3.5 : 0);
    const selfRepair = technologyBonus(next, "self-healing") ? 0.8 : 0;
    const integrity = clamp(runtime.integrity - wearGain + selfRepair);
    const storageLevel = clamp(runtime.storageLevel - dischargeShare + chargeShare, 0, runtime.storageCapacity);
    const populationStability = clamp(runtime.populationStability - (condition === "blackout" ? 6 : condition === "brownout" ? 2 : -0.4));
    return {
      ...runtime,
      condition,
      integrity,
      wear: clamp(runtime.wear + wearGain - selfRepair),
      storageLevel,
      deliveredPower: round(available),
      unmetDemand: round(unmetDemand),
      populationStability,
      maintenanceDebt: Math.max(0, runtime.maintenanceDebt + wearGain - selfRepair),
    };
  });

  const activeLinkCount = next.links.filter((link) => link.enabled && link.type !== "quantum").length;
  next.links = next.links.map((link) => {
    const flow = link.enabled && link.type !== "quantum" ? Math.min(link.capacity, Math.max(0, metrics.delivered / Math.max(1, activeLinkCount))) : 0;
    const load = link.capacity ? flow / link.capacity : 0;
    const degradation = link.enabled ? 0.18 + load * 0.45 + link.threat * 0.004 : 0.04;
    return { ...link, flow: round(flow), integrity: clamp(link.integrity - degradation) };
  });

  const industryRate = next.priorities.industry / priorityDemand;
  const finished: ActiveGridProject[] = [];
  next.activeProjects = next.activeProjects
    .map((project) => {
      const progress = project.progress + Math.max(0.35, industryRate * 2.7) * (next.doctrine === "growth" ? 1.1 : 1);
      const updated = { ...project, progress: round(progress) };
      if (updated.progress >= updated.duration) finished.push(updated);
      return updated;
    })
    .filter((project) => project.progress < project.duration);

  finished.forEach((project) => {
    next = completeProjectEffects(next, project.definitionId);
    next.completedProjects = [...next.completedProjects, project.definitionId];
    const definition = GRID_PROJECTS.find((entry) => entry.id === project.definitionId);
    next.log = addLog(next, { category: "project", title: `${definition?.name ?? project.definitionId} completed`, detail: definition?.effect ?? "Infrastructure project entered service." });
  });

  const extractionFactor = metrics.coverage / 100;
  const stockpileGain = metrics.extraction * extractionFactor;
  const creditGain = Math.max(0, surplus * 1.6) + (projectCompleted(next, "wormhole-exchange") ? surplus * 0.8 : 0);
  const researchGain = metrics.researchPerCycle;
  next.stockpile = {
    ...next.stockpile,
    metal: next.stockpile.metal + stockpileGain * 0.45,
    crystal: next.stockpile.crystal + stockpileGain * 0.25,
    deuterium: next.stockpile.deuterium + stockpileGain * 0.18,
    helium3: next.stockpile.helium3 + stockpileGain * 0.07,
    antimatter: next.stockpile.antimatter + stockpileGain * 0.012,
    exoticMatter: next.stockpile.exoticMatter + stockpileGain * 0.004,
    quantumCores: next.stockpile.quantumCores + stockpileGain * 0.002,
    credits: Math.max(0, next.stockpile.credits + creditGain - metrics.maintenanceCost),
    data: next.stockpile.data + researchGain * 0.42,
  };
  next.researchPoints += researchGain;
  next.lifetimeEnergy += metrics.delivered;
  next.lifetimeResearch += researchGain;

  next.incidents = next.incidents.map((incident) => incident.resolved ? incident : {
    ...incident,
    remainingCycles: Math.max(0, incident.remainingCycles - 1),
  });
  const expiredCritical = next.incidents.filter((incident) => !incident.resolved && incident.remainingCycles === 0 && incident.severity === "critical");
  expiredCritical.forEach((incident) => {
    if (incident.nodeId) next.nodes = next.nodes.map((node) => node.id === incident.nodeId ? { ...node, integrity: clamp(node.integrity - 15), condition: "blackout" as const } : node);
    if (incident.linkId) next.links = next.links.map((link) => link.id === incident.linkId ? { ...link, integrity: clamp(link.integrity - 20), enabled: false } : link);
  });

  const incidentChance = next.automationEnabled
    ? 0.12 + shortageRatio * 0.35 - (technologyBonus(next, "q-command") ? 0.03 : 0) - (projectCompleted(next, "nexus-ai-expansion") ? 0.03 : 0)
    : 0.2 + shortageRatio * 0.4;
  if (forceIncident || ((next.cycle * 37) % 100) / 100 < incidentChance) {
    next = triggerGridIncident(next);
  }

  metrics = computeMetrics(next);
  next.metrics = metrics;
  next.log = addLog(next, {
    category: "economy",
    title: `Cycle ${next.cycle} settled`,
    detail: `${Math.round(metrics.coverage)}% demand coverage, ${Math.round(metrics.extraction)} extraction yield, ${Math.round(researchGain)} research gained.`,
  });
  return next;
}

export function getProjectAvailability(state: InterplanetaryGridState, project: GridProjectDefinition) {
  const technologyMet = !project.requiredTechnology || state.unlockedTechnologies.includes(project.requiredTechnology);
  const alreadyBuilt = !project.repeatable && state.completedProjects.includes(project.id);
  const active = state.activeProjects.some((entry) => entry.definitionId === project.id);
  const affordable = hasResources(state.stockpile, project.cost);
  return { technologyMet, alreadyBuilt, active, affordable, available: technologyMet && !alreadyBuilt && !active && affordable };
}

export function getTechnologyAvailability(state: InterplanetaryGridState, technologyId: string) {
  const technology = POWER_TECHNOLOGIES.find((entry) => entry.id === technologyId);
  if (!technology) return { prerequisitesMet: false, affordable: false, researched: false, available: false };
  const researched = state.unlockedTechnologies.includes(technologyId);
  const prerequisitesMet = technology.prerequisites.every((id) => state.unlockedTechnologies.includes(id));
  const affordable = state.researchPoints >= technology.researchCost && hasResources(state.stockpile, technology.resourceCost);
  return { prerequisitesMet, affordable, researched, available: !researched && prerequisitesMet && affordable };
}

