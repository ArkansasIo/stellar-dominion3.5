export type FacilityOperationsDomain = "planet" | "moon" | "station";
export type FacilityCatalogType = "core" | "infrastructure" | "technology";

export interface FacilityCategory {
  id: string;
  label: string;
  summary: string;
}

export interface FacilitySelection {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  description: string;
  doctrine: string;
  emphasis: string;
  linkedAsset?: string;
}

const DOMAIN_META = {
  planet: {
    prefix: "Planetary",
    noun: "surface",
    command: "colony",
  },
  moon: {
    prefix: "Lunar",
    noun: "lunar",
    command: "moonbase",
  },
  station: {
    prefix: "Orbital",
    noun: "orbital",
    command: "station",
  },
} as const;

export const CORE_FACILITY_CATEGORIES: FacilityCategory[] = [
  { id: "command", label: "Command Spine", summary: "Bridge systems, command decks, and oversight relays." },
  { id: "fabrication", label: "Fabrication Wing", summary: "Foundries, machine shops, and assembly control." },
  { id: "research", label: "Research Wing", summary: "Labs, analytics chambers, and prototype control." },
  { id: "logistics", label: "Logistics Ring", summary: "Freight routing, depot planning, and queue control." },
  { id: "power", label: "Power Core", summary: "Grid regulation, backup reactors, and distribution buffers." },
  { id: "defense", label: "Defense Net", summary: "Shield, security, garrison, and hardpoint support." },
  { id: "habitat", label: "Habitat Layer", summary: "Crew space, welfare, life support, and housing control." },
  { id: "trade", label: "Trade Exchange", summary: "Market routing, customs, and contract arbitration." },
  { id: "support", label: "Support Nexus", summary: "Maintenance, medbay, emergency, and service systems." },
];

const CORE_COUNTS_PER_CATEGORY = [5, 5, 5, 5, 5, 5, 5, 4, 4];

const CORE_SELECTION_SEEDS = [
  ["Command Bastion", "High command coordination for {command} operations.", "Tightens decision loops across the {noun} command layer."],
  ["Strategic Concourse", "Cross-discipline planning bay for logistics and security.", "Keeps strategic handoff clean between command and production."],
  ["Operations Vault", "Protected oversight suite for priority construction and crisis control.", "Stabilizes top-priority response chains."],
  ["Directive Exchange", "Administrative deck routing executive directives through the {command}.", "Speeds coordination between leadership and infrastructure."],
  ["Command Synchronizer", "Unified timing rail for fleet, industry, and science queues.", "Reduces conflict between simultaneous commands."],
  ["Fabrication Forge", "Primary production hall for major industrial output.", "Improves baseline fabrication resilience."],
  ["Assembly Corridor", "Sequenced routing line for modular component handoff.", "Cuts waste between linked workshops and bays."],
  ["Machine Control Lattice", "Industrial automation spine for heavy equipment control.", "Keeps machine uptime steady during peak demand."],
  ["Materials Staging Yard", "Buffers raw materials before full production cycles.", "Smooths supply volatility during upgrades."],
  ["Precision Tool Dock", "Calibrates advanced toolchains for high-spec builds.", "Raises consistency on technical construction."],
  ["Research Annex", "Specialized laboratory extension tied to core operations.", "Broadens science support without disrupting production."],
  ["Theory Chamber", "Simulation suite for controlled study and doctrine testing.", "Turns lab insight into usable operational bonuses."],
  ["Prototype Gallery", "Evaluation floor for experimental subsystems and field models.", "Accelerates prototype iteration for the {command}."],
  ["Data Review Vault", "Stores and audits research outcomes across facility layers.", "Improves cross-team knowledge retention."],
  ["Analytics Theatre", "Live analysis room for empire-scale operational review.", "Links metrics to direct construction and science choices."],
  ["Transit Coordinator", "Schedules movement through the {noun} logistics shell.", "Reduces congestion during expansion cycles."],
  ["Freight Registry", "Tracks materials, queues, and routing commitments.", "Improves confidence in supply chain planning."],
  ["Queue Dispatch Cell", "Pushes jobs to the highest-value available capacity.", "Keeps construction cycles active and balanced."],
  ["Depot Relay", "Intermediate storage relay for flow-controlled distribution.", "Stabilizes mid-cycle delivery and resupply."],
  ["Cargo Harmonizer", "Balances throughput across multiple storage and dispatch nodes.", "Prevents bottlenecks in the logistics ring."],
  ["Grid Control Chamber", "Monitors core generation and distribution stability.", "Protects output when demand spikes suddenly."],
  ["Reserve Reactor Stack", "Backup power mass for emergency and surge operation.", "Keeps strategic systems online through stress cycles."],
  ["Thermal Recovery Deck", "Reclaims excess waste heat into usable output.", "Improves efficiency without adding extra strain."],
  ["Conduit Balancer", "Equalizes distribution load across key power trunks.", "Limits infrastructure loss from uneven draw."],
  ["Shielded Substation", "Protected switching yard for sensitive power flows.", "Hardens critical systems against failure."],
  ["Security Bastion", "Hardened security node for defense oversight.", "Improves response time against threats and sabotage."],
  ["Shield Relay", "Feeds layered protection through the outer facility shell.", "Increases survivability for key modules."],
  ["Watch Network", "Distributed surveillance routing throughout the {command}.", "Expands visibility and defensive warning time."],
  ["Response Locker", "Rapid-deployment reserve for defense incidents.", "Shortens reaction time in emergencies."],
  ["Hardpoint Controller", "Coordinates point-defense and intercept routines.", "Improves defensive consistency under pressure."],
  ["Habitat Arc", "Primary living layer for specialists and support staff.", "Raises retention across the {noun} core."],
  ["Life Support Spine", "Maintains atmosphere, climate, and circulation quality.", "Protects long-term operating stability."],
  ["Crew Commons", "Shared service layer for morale, rest, and scheduling.", "Improves workforce continuity for large build cycles."],
  ["Recovery Ward", "Medical and recovery services for core personnel.", "Cuts downtime after accidents or combat stress."],
  ["Habitation Registry", "Tracks quarters, occupancy, and mission-critical staffing.", "Aligns staffing with operational need."],
  ["Brokerage Desk", "Commercial routing desk for external and internal trade.", "Improves price clarity and exchange tempo."],
  ["Customs Rail", "Screens incoming cargo and outbound transfers.", "Stabilizes trade compliance and throughput."],
  ["Contract Exchange", "Clears obligations between industry, science, and command.", "Keeps trade-linked upgrades moving cleanly."],
  ["Dock Clearance Office", "Schedules docking windows and transfer permissions.", "Improves loading efficiency for transport traffic."],
  ["Maintenance Nexus", "Coordinates upkeep across all major facility branches.", "Reduces compounding wear over long sessions."],
  ["Emergency Control", "Central crisis desk for hazard response and recovery.", "Improves resilience when multiple failures hit at once."],
  ["Service Works", "General repair, sanitation, and support utility layer.", "Keeps secondary systems from degrading into blockers."],
  ["Operations Medbay", "Embedded treatment and stabilization wing.", "Protects continuity for critical teams."],
];

export const INFRASTRUCTURE_CATEGORY_SPLIT: FacilityCategory[] = [
  { id: "infra-automation", label: "Automation Grid", summary: "Fabrication control, repair swarms, and routing cores." },
  { id: "infra-power", label: "Power and Transit", summary: "Distribution spines, transport lanes, and lift systems." },
  { id: "infra-colony", label: "Colony Operations", summary: "Civil stability, utilities, and district services." },
  { id: "infra-defense", label: "Defense and Security", summary: "Perimeter coordination, bunkers, and strike logistics." },
  { id: "infra-trade", label: "Economy and Trade", summary: "Commercial routing, storage flow, and convoy planning." },
  { id: "infra-space", label: "Space Support", summary: "Orbital traffic, relays, and expedition launch support." },
  { id: "infra-civil", label: "Civil Utility", summary: "Support shells for administration and public systems." },
  { id: "infra-industrial", label: "Industrial Frame", summary: "Heavy-production support and deployment corridors." },
  { id: "infra-frontier", label: "Frontier Expansion", summary: "Long-range growth, orbital bridgework, and support chains." },
];

export const TECHNOLOGY_CATEGORY_SPLIT: FacilityCategory[] = [
  { id: "tech-power", label: "Power Sciences", summary: "Energy theory, plasma behavior, and stellar observation." },
  { id: "tech-compute", label: "Computing and Intelligence", summary: "Analysis, AI, and strategic cognition systems." },
  { id: "tech-propulsion", label: "Propulsion and Field Theory", summary: "Drive systems, warp corridors, and gravitic modeling." },
  { id: "tech-engineering", label: "Applied Engineering", summary: "Hull, shield, weapons, and practical systems design." },
  { id: "tech-control", label: "Control Systems", summary: "Operational control loops and decision support logic." },
  { id: "tech-discovery", label: "Exploration Science", summary: "Route confidence, anomaly study, and survey analysis." },
  { id: "tech-fleet", label: "Fleet Integration", summary: "Shipyard-linked science and combat system refinement." },
  { id: "tech-expansion", label: "Expansion Research", summary: "Colonization, deployment, and growth planning." },
  { id: "tech-breakthrough", label: "Breakthrough Labs", summary: "Late-stage exotic, singularity, and apex prototypes." },
];

const INFRA_COUNTS_PER_CATEGORY = [5, 5, 5, 5, 5, 5, 4, 4, 4];
const TECH_COUNTS_PER_CATEGORY = [4, 3, 3, 3, 3, 3, 3, 3, 3];

export function getCoreFacilitySelections(domain: FacilityOperationsDomain): FacilitySelection[] {
  const meta = DOMAIN_META[domain];
  let seedIndex = 0;

  return CORE_FACILITY_CATEGORIES.flatMap((category, categoryIndex) => {
    const targetCount = CORE_COUNTS_PER_CATEGORY[categoryIndex];
    return Array.from({ length: targetCount }, (_, entryIndex) => {
      const [titleSeed, descriptionSeed, doctrineSeed] = CORE_SELECTION_SEEDS[seedIndex % CORE_SELECTION_SEEDS.length];
      seedIndex += 1;

      const title = `${meta.prefix} ${titleSeed}`;
      return {
        id: `${domain}-${category.id}-${entryIndex + 1}`,
        categoryId: category.id,
        title,
        subtitle: `${category.label} Selection ${entryIndex + 1}`,
        description: descriptionSeed
          .replaceAll("{noun}", meta.noun)
          .replaceAll("{command}", meta.command),
        doctrine: doctrineSeed
          .replaceAll("{noun}", meta.noun)
          .replaceAll("{command}", meta.command),
        emphasis: `${meta.prefix} core operations`,
      };
    });
  });
}

function bucketSelections<T extends { id: string; name: string; description: string; effect: string; cluster?: string }>(
  items: T[],
  categories: FacilityCategory[],
  counts: number[],
  domain: FacilityOperationsDomain,
): FacilitySelection[] {
  let itemIndex = 0;
  return categories.flatMap((category, categoryIndex) => {
    const categoryItems = items.slice(itemIndex, itemIndex + counts[categoryIndex]);
    itemIndex += counts[categoryIndex];

    return categoryItems.map((item, selectionIndex) => ({
      id: `${domain}-${category.id}-${item.id}`,
      categoryId: category.id,
      title: item.name,
      subtitle: `${category.label} Selection ${selectionIndex + 1}`,
      description: item.description,
      doctrine: item.effect,
      emphasis: item.cluster || category.label,
      linkedAsset: item.id,
    }));
  });
}

export function getInfrastructureSelections<T extends { id: string; name: string; description: string; effect: string; cluster?: string }>(
  domain: FacilityOperationsDomain,
  systems: T[],
): FacilitySelection[] {
  return bucketSelections(systems, INFRASTRUCTURE_CATEGORY_SPLIT, INFRA_COUNTS_PER_CATEGORY, domain);
}

export function getTechnologySelections<T extends { id: string; name: string; description: string; effect: string; cluster?: string }>(
  domain: FacilityOperationsDomain,
  systems: T[],
): FacilitySelection[] {
  return bucketSelections(systems, TECHNOLOGY_CATEGORY_SPLIT, TECH_COUNTS_PER_CATEGORY, domain);
}

export const FACILITY_OPERATIONS_COUNTS = {
  coreCategories: CORE_FACILITY_CATEGORIES.length,
  coreSelections: CORE_COUNTS_PER_CATEGORY.reduce((sum, count) => sum + count, 0),
  infrastructureCategories: INFRASTRUCTURE_CATEGORY_SPLIT.length,
  infrastructureSelections: INFRA_COUNTS_PER_CATEGORY.reduce((sum, count) => sum + count, 0),
  technologyCategories: TECHNOLOGY_CATEGORY_SPLIT.length,
  technologySelections: TECH_COUNTS_PER_CATEGORY.reduce((sum, count) => sum + count, 0),
};
