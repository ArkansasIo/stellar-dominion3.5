import { GOVERNMENTS, POLICIES, type GovernmentId } from "./governmentData";

export type GovernmentSystemId =
  | "executive"
  | "legislative"
  | "judicial"
  | "civil"
  | "security"
  | "economic"
  | "scientific"
  | "diplomatic";

export interface GovernmentMechanicDefinition {
  id: string;
  name: string;
  effect: string;
  playerImpact: string;
  risk: string;
}

export interface GovernmentSubsystemDefinition {
  id: string;
  name: string;
  summary: string;
  className: string;
  subClassName: string;
  typeName: string;
  subTypeName: string;
  mechanicIds: string[];
  responsibilities: string[];
}

export interface GovernmentSystemDefinition {
  id: GovernmentSystemId;
  name: string;
  summary: string;
  menuLabel: string;
  pageLabel: string;
  governanceAxis: string;
  subsystems: GovernmentSubsystemDefinition[];
}

export interface GovernmentMenuNode {
  id: string;
  label: string;
  pageTitle: string;
  description: string;
  subPages: string[];
}

export interface GovernmentRegimeProfile {
  governmentId: GovernmentId;
  flavor: string;
  doctrineTitle: string;
  pressureProfile: {
    support: number;
    control: number;
    commerce: number;
    research: number;
  };
  favoredPolicies: string[];
  systemPriorities: GovernmentSystemId[];
}

export interface GovernmentSystemsState {
  directives: {
    executiveStyle: string;
    legislativeAgenda: string;
    judicialDoctrine: string;
    securityPosture: string;
    economicModel: string;
    scienceMandate: string;
  };
  allocations: {
    civilBudget: number;
    defenseBudget: number;
    tradeBudget: number;
    researchBudget: number;
    oversightBudget: number;
  };
}

export const DEFAULT_GOVERNMENT_SYSTEMS_STATE: GovernmentSystemsState = {
  directives: {
    executiveStyle: "delegated",
    legislativeAgenda: "charter",
    judicialDoctrine: "balanced",
    securityPosture: "measured",
    economicModel: "mixed",
    scienceMandate: "applied",
  },
  allocations: {
    civilBudget: 52,
    defenseBudget: 48,
    tradeBudget: 61,
    researchBudget: 56,
    oversightBudget: 50,
  },
};

export const GOVERNMENT_SYSTEM_DIRECTIVE_OPTIONS = {
  executiveStyle: ["delegated", "centralized", "emergency"],
  legislativeAgenda: ["charter", "expansion", "compliance"],
  judicialDoctrine: ["balanced", "strict", "restorative"],
  securityPosture: ["measured", "fortified", "covert"],
  economicModel: ["mixed", "market", "planned"],
  scienceMandate: ["applied", "frontier", "regulated"],
} as const;

export const GOVERNMENT_MECHANICS: Record<string, GovernmentMechanicDefinition> = {
  policy: {
    id: "policy",
    name: "Policy Throughput",
    effect: "Improves how quickly reforms and empire directives take effect.",
    playerImpact: "Higher throughput sharpens strategic pivots after tax or doctrine changes.",
    risk: "Low oversight causes bureaucratic drift.",
  },
  legitimacy: {
    id: "legitimacy",
    name: "Legitimacy",
    effect: "Stabilizes public support, loyalty, and civic compliance.",
    playerImpact: "Boosts passive stability and reduces unrest spikes.",
    risk: "Harsh policies can hollow legitimacy out over time.",
  },
  compliance: {
    id: "compliance",
    name: "Compliance Pressure",
    effect: "Raises internal order and lowers resistance events.",
    playerImpact: "Useful for occupation, labor control, and high-tax empires.",
    risk: "Too much pressure cuts morale and growth.",
  },
  intelligence: {
    id: "intelligence",
    name: "Counter-Intel",
    effect: "Hardens the empire against espionage, sabotage, and corruption.",
    playerImpact: "Protects long projects and strategic buildings.",
    risk: "Heavy counter-intel increases administrative cost.",
  },
  commerce: {
    id: "commerce",
    name: "Trade Mediation",
    effect: "Improves trade flow, tariff efficiency, and market liquidity.",
    playerImpact: "Supports resource velocity and credit generation.",
    risk: "Weak regulation raises black-market bleed.",
  },
  innovation: {
    id: "innovation",
    name: "Innovation Cadence",
    effect: "Accelerates research, prototypes, and technical adaptation.",
    playerImpact: "Best for tech-heavy expansion or efficiency-focused governments.",
    risk: "Rapid innovation can lower social cohesion in rigid regimes.",
  },
  justice: {
    id: "justice",
    name: "Judicial Integrity",
    effect: "Reduces corruption and improves rule compliance.",
    playerImpact: "Smooths tax collection and protects civic systems.",
    risk: "Rigid legalism can slow emergency action.",
  },
  diplomacy: {
    id: "diplomacy",
    name: "Diplomatic Reach",
    effect: "Enhances treaty leverage, alliance cohesion, and foreign reputation.",
    playerImpact: "Improves federation and faction-facing play.",
    risk: "Diplomatic overextension drains civil focus.",
  },
};

export const GOVERNMENT_SYSTEMS: Record<GovernmentSystemId, GovernmentSystemDefinition> = {
  executive: {
    id: "executive",
    name: "Executive Command",
    summary: "Central authority, succession, emergency response, and direct imperial mandate.",
    menuLabel: "Executive",
    pageLabel: "Executive Office",
    governanceAxis: "Control and pace",
    subsystems: [
      {
        id: "state-core",
        name: "State Core",
        summary: "Defines how the regime issues top-level orders and escalates crises.",
        className: "State Core",
        subClassName: "Central Authority",
        typeName: "Command Office",
        subTypeName: "Prime",
        mechanicIds: ["policy", "legitimacy"],
        responsibilities: ["Issue executive directives", "Coordinate cabinet priorities", "Control reform tempo"],
      },
      {
        id: "emergency-council",
        name: "Emergency Council",
        summary: "Handles rapid response mandates and wartime continuity.",
        className: "Emergency Council",
        subClassName: "Rapid Response",
        typeName: "Council",
        subTypeName: "Bulwark",
        mechanicIds: ["policy", "compliance"],
        responsibilities: ["Trigger emergency laws", "Stabilize crises", "Accelerate command loops"],
      },
    ],
  },
  legislative: {
    id: "legislative",
    name: "Legislative Assembly",
    summary: "Charters, senate blocs, councils, and lawmaking institutions that define empire-wide rules.",
    menuLabel: "Legislative",
    pageLabel: "Assembly Chamber",
    governanceAxis: "Representation and charter law",
    subsystems: [
      {
        id: "assembly-hall",
        name: "Assembly Hall",
        summary: "Builds consensus, ratifies statutes, and balances long-term policy packages.",
        className: "Legislative Chamber",
        subClassName: "Consensus Building",
        typeName: "Assembly",
        subTypeName: "Orbit",
        mechanicIds: ["legitimacy", "justice"],
        responsibilities: ["Pass laws", "Ratify budgets", "Review executive overreach"],
      },
      {
        id: "colonial-charter",
        name: "Colonial Charter Board",
        summary: "Defines autonomy, rights, and obligations for distant worlds.",
        className: "Colonial Office",
        subClassName: "Frontier Administration",
        typeName: "Board",
        subTypeName: "Pioneer",
        mechanicIds: ["legitimacy", "commerce"],
        responsibilities: ["Set colonial privileges", "Standardize provincial rights", "Prevent frontier drift"],
      },
    ],
  },
  judicial: {
    id: "judicial",
    name: "Judicial Authority",
    summary: "Courts, arbiters, enforcement codes, and legitimacy systems that turn doctrine into rule of law.",
    menuLabel: "Judicial",
    pageLabel: "Justice Hall",
    governanceAxis: "Law and enforcement",
    subsystems: [
      {
        id: "supreme-arbiter",
        name: "Supreme Arbiter",
        summary: "Interprets charters and resolves system-wide disputes.",
        className: "Justice Hall",
        subClassName: "Legal Oversight",
        typeName: "Tribunal",
        subTypeName: "Equity",
        mechanicIds: ["justice", "legitimacy"],
        responsibilities: ["Interpret law", "Resolve high disputes", "Reduce corruption"],
      },
      {
        id: "civic-guard-code",
        name: "Civic Guard Code",
        summary: "Connects civil enforcement to acceptable legal process.",
        className: "Civic Guard",
        subClassName: "Enforcement Command",
        typeName: "Code Office",
        subTypeName: "Iron",
        mechanicIds: ["justice", "compliance"],
        responsibilities: ["Set enforcement standards", "Define penalties", "Protect order"],
      },
    ],
  },
  civil: {
    id: "civil",
    name: "Civil Administration",
    summary: "Population, welfare, public messaging, and social cohesion layers that keep the empire habitable.",
    menuLabel: "Civil",
    pageLabel: "Civil Mandate",
    governanceAxis: "Support and cohesion",
    subsystems: [
      {
        id: "population-office",
        name: "Population Office",
        summary: "Manages habitats, migration pressure, and public morale baselines.",
        className: "Population Office",
        subClassName: "Habitat Management",
        typeName: "Civil Bureau",
        subTypeName: "Haven",
        mechanicIds: ["legitimacy", "commerce"],
        responsibilities: ["Manage welfare capacity", "Stabilize workforce flows", "Track civilian needs"],
      },
      {
        id: "narrative-bureau",
        name: "Narrative Bureau",
        summary: "Shapes civic messaging, patriotic culture, and empire identity.",
        className: "Narrative Bureau",
        subClassName: "Public Cohesion",
        typeName: "Influence Office",
        subTypeName: "Echo",
        mechanicIds: ["legitimacy", "compliance"],
        responsibilities: ["Run state messaging", "Buffer unrest", "Amplify political identity"],
      },
    ],
  },
  security: {
    id: "security",
    name: "Security Apparatus",
    summary: "Counter-espionage, internal defense, surveillance, and response capacity.",
    menuLabel: "Security",
    pageLabel: "Internal Order",
    governanceAxis: "Control and resilience",
    subsystems: [
      {
        id: "civil-defense",
        name: "Civil Defense",
        summary: "Protects infrastructure, populations, and orbital corridors from internal threats.",
        className: "Internal Order",
        subClassName: "Civil Defense",
        typeName: "Security Office",
        subTypeName: "Sentinel",
        mechanicIds: ["compliance", "intelligence"],
        responsibilities: ["Suppress unrest", "Protect strategic nodes", "Raise emergency readiness"],
      },
      {
        id: "counter-operations",
        name: "Counter-Operations",
        summary: "Detects covert threats and secures cabinet-level decision networks.",
        className: "Intelligence Office",
        subClassName: "Counter-Operations",
        typeName: "Intel Directorate",
        subTypeName: "Shadow",
        mechanicIds: ["intelligence", "justice"],
        responsibilities: ["Track infiltrators", "Harden command relays", "Reduce sabotage risk"],
      },
    ],
  },
  economic: {
    id: "economic",
    name: "Economic Directorate",
    summary: "Treasury, trade law, tax pressure, and industrial planning across the empire economy.",
    menuLabel: "Economic",
    pageLabel: "Treasury Floor",
    governanceAxis: "Growth and extraction",
    subsystems: [
      {
        id: "trade-bureau",
        name: "Trade Bureau",
        summary: "Coordinates tariffs, merchant protection, and interstellar trade standards.",
        className: "Commerce Bureau",
        subClassName: "Interstellar Market",
        typeName: "Market Bureau",
        subTypeName: "Market",
        mechanicIds: ["commerce", "diplomacy"],
        responsibilities: ["Set tariff posture", "Support merchants", "Increase market throughput"],
      },
      {
        id: "resource-directorate",
        name: "Resource Directorate",
        summary: "Allocates extraction quotas and industrial priority flows.",
        className: "Resource Directorate",
        subClassName: "Extraction Command",
        typeName: "Industrial Directorate",
        subTypeName: "Forge",
        mechanicIds: ["commerce", "compliance"],
        responsibilities: ["Raise production", "Protect supply chains", "Control strategic reserves"],
      },
    ],
  },
  scientific: {
    id: "scientific",
    name: "Scientific Oversight",
    summary: "Research doctrine, automation policy, and long-horizon technical transformation.",
    menuLabel: "Scientific",
    pageLabel: "Science Directorate",
    governanceAxis: "Innovation and adaptation",
    subsystems: [
      {
        id: "innovation-board",
        name: "Innovation Board",
        summary: "Determines whether science serves frontier discovery or applied state goals.",
        className: "Research Authority",
        subClassName: "Innovation Board",
        typeName: "Science Office",
        subTypeName: "Lumen",
        mechanicIds: ["innovation", "policy"],
        responsibilities: ["Fund research tracks", "Shift science priorities", "Accelerate breakthrough rate"],
      },
      {
        id: "automation-policy",
        name: "Automation Policy",
        summary: "Balances synthetic governance, labor substitution, and machine planning.",
        className: "Synthetic Bureau",
        subClassName: "Automation Policy",
        typeName: "Cyber Office",
        subTypeName: "Neural",
        mechanicIds: ["innovation", "compliance"],
        responsibilities: ["Scale automation", "Control AI mandates", "Raise system efficiency"],
      },
    ],
  },
  diplomatic: {
    id: "diplomatic",
    name: "Diplomatic Corps",
    summary: "Foreign policy, alliance posture, faction handling, and treaty leverage.",
    menuLabel: "Diplomatic",
    pageLabel: "Embassy Wing",
    governanceAxis: "Influence and federation",
    subsystems: [
      {
        id: "alliance-office",
        name: "Alliance Office",
        summary: "Maintains alliances, charters, and diplomatic continuity.",
        className: "Embassy Corps",
        subClassName: "Alliance Office",
        typeName: "Embassy",
        subTypeName: "Celestial",
        mechanicIds: ["diplomacy", "legitimacy"],
        responsibilities: ["Maintain pacts", "Raise federation cohesion", "Manage envoys"],
      },
      {
        id: "parliamentary-liaison",
        name: "Parliamentary Liaison",
        summary: "Bridges domestic politics with foreign commitments and trade compacts.",
        className: "Legislative Chamber",
        subClassName: "Consensus Building",
        typeName: "Liaison Office",
        subTypeName: "Orbit",
        mechanicIds: ["diplomacy", "commerce"],
        responsibilities: ["Coordinate treaty ratification", "Manage foreign agendas", "Reduce diplomatic friction"],
      },
    ],
  },
};

export const GOVERNMENT_MENU_TREE: GovernmentMenuNode[] = [
  {
    id: "cabinet",
    label: "Cabinet",
    pageTitle: "Cabinet Appointments",
    description: "Assign state leaders by type, class, subclass, and subtype.",
    subPages: ["Leader roster", "Cabinet seats", "Appointment sync"],
  },
  {
    id: "field",
    label: "Doctrine",
    pageTitle: "Doctrine and Field Posture",
    description: "Set civic, field, and civil mandates that shape live government behavior.",
    subPages: ["Civic focus", "Field posture", "Civil mandate"],
  },
  {
    id: "systems",
    label: "Systems",
    pageTitle: "Government Systems",
    description: "Inspect executive, legislative, judicial, civil, security, economic, scientific, and diplomatic systems.",
    subPages: ["Directive controls", "Budget allocations", "Mechanics map"],
  },
  {
    id: "structures",
    label: "Structures",
    pageTitle: "Government Structures",
    description: "Browse building classes, subclasses, types, subtypes, tiers, levels, and derived stat mechanics.",
    subPages: ["Category browser", "Sub-category details", "Stat scaling preview"],
  },
  {
    id: "policies",
    label: "Policies",
    pageTitle: "Policy Board",
    description: "Enact social, labor, economic, and security laws with explicit risk and upkeep.",
    subPages: ["Policy categories", "Active pressure", "Subsystem effects"],
  },
  {
    id: "tree",
    label: "Gov Tree",
    pageTitle: "Government Progression Tree",
    description: "Unlock long-term stability, law, and economic doctrine nodes.",
    subPages: ["Available nodes", "Pillar status", "Unlock effects"],
  },
];

export const GOVERNMENT_REGIME_PROFILES: Record<GovernmentId, GovernmentRegimeProfile> = {
  democracy: {
    governmentId: "democracy",
    flavor: "A high-legitimacy republic that wins through negotiation and civic resilience.",
    doctrineTitle: "Representative Balance",
    pressureProfile: { support: 82, control: 48, commerce: 65, research: 72 },
    favoredPolicies: ["free_trade", "universal_care"],
    systemPriorities: ["legislative", "judicial", "civil", "diplomatic", "scientific"],
  },
  monarchy: {
    governmentId: "monarchy",
    flavor: "A tradition-heavy regime built around dynastic continuity and loyal provincial order.",
    doctrineTitle: "Dynastic Continuity",
    pressureProfile: { support: 63, control: 74, commerce: 58, research: 42 },
    favoredPolicies: ["propaganda", "universal_care"],
    systemPriorities: ["executive", "civil", "security", "diplomatic"],
  },
  technocracy: {
    governmentId: "technocracy",
    flavor: "An expert state optimized for science, automation, and predictive management.",
    doctrineTitle: "Analytical Planning",
    pressureProfile: { support: 44, control: 61, commerce: 67, research: 92 },
    favoredPolicies: ["free_trade", "austerity"],
    systemPriorities: ["scientific", "economic", "executive", "civil"],
  },
  junta: {
    governmentId: "junta",
    flavor: "A fast-acting war cabinet where command clarity outranks civic latitude.",
    doctrineTitle: "Command Security",
    pressureProfile: { support: 32, control: 91, commerce: 39, research: 34 },
    favoredPolicies: ["martial_law", "forced_labor"],
    systemPriorities: ["security", "executive", "economic", "civil"],
  },
  corporate: {
    governmentId: "corporate",
    flavor: "A profit-first regime that treats policy as portfolio optimization.",
    doctrineTitle: "Shareholder Expansion",
    pressureProfile: { support: 41, control: 56, commerce: 94, research: 63 },
    favoredPolicies: ["free_trade", "austerity"],
    systemPriorities: ["economic", "executive", "diplomatic", "scientific"],
  },
  theocracy: {
    governmentId: "theocracy",
    flavor: "A faith-centered order that converts belief into stability and obedience.",
    doctrineTitle: "Sacred Order",
    pressureProfile: { support: 69, control: 77, commerce: 37, research: 24 },
    favoredPolicies: ["propaganda", "martial_law"],
    systemPriorities: ["civil", "judicial", "security", "diplomatic"],
  },
  anarchy: {
    governmentId: "anarchy",
    flavor: "A decentralized collective with strong autonomy but weak top-down coherence.",
    doctrineTitle: "Distributed Autonomy",
    pressureProfile: { support: 55, control: 18, commerce: 52, research: 58 },
    favoredPolicies: ["free_trade"],
    systemPriorities: ["civil", "economic", "scientific", "diplomatic"],
  },
  oligarchy: {
    governmentId: "oligarchy",
    flavor: "An elite-managed state that trades broad legitimacy for tightly coordinated influence.",
    doctrineTitle: "Patronage Control",
    pressureProfile: { support: 39, control: 73, commerce: 79, research: 46 },
    favoredPolicies: ["austerity", "propaganda"],
    systemPriorities: ["economic", "executive", "judicial", "diplomatic"],
  },
  federation: {
    governmentId: "federation",
    flavor: "A treaty-driven alliance state that excels when diplomacy and trade stay aligned.",
    doctrineTitle: "Shared Sovereignty",
    pressureProfile: { support: 71, control: 46, commerce: 78, research: 61 },
    favoredPolicies: ["free_trade", "universal_care"],
    systemPriorities: ["diplomatic", "legislative", "economic", "civil"],
  },
  dictatorship: {
    governmentId: "dictatorship",
    flavor: "A direct-command regime built around fear, speed, and personal authority.",
    doctrineTitle: "Absolute Mandate",
    pressureProfile: { support: 24, control: 95, commerce: 54, research: 28 },
    favoredPolicies: ["martial_law", "propaganda", "forced_labor"],
    systemPriorities: ["executive", "security", "civil", "economic"],
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function getGovernmentRegimeProfile(governmentId: GovernmentId): GovernmentRegimeProfile {
  return GOVERNMENT_REGIME_PROFILES[governmentId];
}

export function getGovernmentSystemsForGovernment(governmentId: GovernmentId): GovernmentSystemDefinition[] {
  const preferred = new Set(GOVERNMENTS[governmentId].preferredSystems);
  return Object.values(GOVERNMENT_SYSTEMS).sort((left, right) => {
    const leftScore = preferred.has(left.id) ? 1 : 0;
    const rightScore = preferred.has(right.id) ? 1 : 0;
    return rightScore - leftScore || left.name.localeCompare(right.name);
  });
}

export function getMechanicsForSystem(system: GovernmentSystemDefinition): GovernmentMechanicDefinition[] {
  const mechanicIds = new Set(system.subsystems.flatMap((subsystem) => subsystem.mechanicIds));
  return [...mechanicIds].map((id) => GOVERNMENT_MECHANICS[id]).filter(Boolean);
}

export function getPolicyCategoryCount(policyIds: string[]) {
  return POLICIES.reduce<Record<string, number>>((acc, policy) => {
    if (!policyIds.includes(policy.id)) return acc;
    acc[policy.category] = (acc[policy.category] || 0) + 1;
    return acc;
  }, {});
}

export function calculateGovernmentPressure(
  governmentId: GovernmentId,
  taxRate: number,
  activePolicyIds: string[],
  systemsState: GovernmentSystemsState = DEFAULT_GOVERNMENT_SYSTEMS_STATE,
) {
  const regime = getGovernmentRegimeProfile(governmentId);
  const activePolicyCount = activePolicyIds.length;
  const budget = systemsState.allocations;
  const taxPressure = clamp(taxRate, 0, 100);

  return {
    legitimacy: clamp(
      regime.pressureProfile.support + budget.civilBudget * 0.18 - taxPressure * 0.42 - activePolicyCount * 4,
      0,
      100,
    ),
    control: clamp(
      regime.pressureProfile.control + budget.defenseBudget * 0.2 + budget.oversightBudget * 0.14 + activePolicyCount * 2,
      0,
      100,
    ),
    growth: clamp(
      regime.pressureProfile.commerce + budget.tradeBudget * 0.18 + budget.researchBudget * 0.08 - taxPressure * 0.16,
      0,
      100,
    ),
    innovation: clamp(
      regime.pressureProfile.research + budget.researchBudget * 0.2 - budget.defenseBudget * 0.08 - activePolicyCount * 1.5,
      0,
      100,
    ),
    bureaucracy: clamp(
      28 + activePolicyCount * 11 + budget.oversightBudget * 0.16 + Math.max(0, taxPressure - 35) * 0.55,
      0,
      100,
    ),
  };
}
