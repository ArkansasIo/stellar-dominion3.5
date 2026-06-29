import {
  RESEARCH_TECH_CATEGORIES,
  RESEARCH_TECH_SUBCATEGORIES,
  RESEARCH_TECH_SUBTYPES,
  RESEARCH_TECH_TYPES,
  type ResearchTechCategory,
  type ResearchTechClass,
  type ResearchTechSubCategory,
  type ResearchTechSubClass,
  type ResearchTechSubType,
  type ResearchTechType,
} from "./researchTechnologyLibraryConfig";

export type KnowledgeDomain = "research" | "technology";

export type KnowledgeJobCategory =
  | "analysis"
  | "lab-operations"
  | "field-science"
  | "prototype-fabrication"
  | "systems-integration"
  | "security-governance";

export type KnowledgeJobSubCategory =
  | "theory-synthesis"
  | "simulation-control"
  | "discovery-audit"
  | "specimen-handling"
  | "reactor-testing"
  | "fabrication-pipeline"
  | "expedition-support"
  | "data-curation"
  | "doctrine-review"
  | "facility-security"
  | "deployment-readiness"
  | "compliance-oversight";

export type KnowledgeJobClass =
  | "Cadet"
  | "Operator"
  | "Specialist"
  | "Director"
  | "Architect"
  | "Paragon";

export type KnowledgeUnitCategory =
  | "civilian"
  | "science"
  | "industrial"
  | "security"
  | "fleet-support"
  | "expeditionary";

export type KnowledgeUnitClass =
  | "Support"
  | "Technical"
  | "Strategic"
  | "Command"
  | "Expeditionary";

export interface KnowledgeYieldProfile {
  throughput: number;
  discoveryRate: number;
  deploymentReadiness: number;
  logisticsLoad: number;
  securityDemand: number;
  upkeep: number;
}

export interface KnowledgeMechanicBundle {
  primaryLoop: string;
  activeFunction: string;
  passiveFunction: string;
  triggerCondition: string;
  gameplayEffect: string;
}

export interface KnowledgeCatalogEntry {
  id: string;
  domain: KnowledgeDomain;
  libraryCode: string;
  name: string;
  category: ResearchTechCategory;
  subCategory: ResearchTechSubCategory;
  type: ResearchTechType;
  subType: ResearchTechSubType;
  class: ResearchTechClass;
  subClass: ResearchTechSubClass;
  tier: number;
  minLevel: number;
  maxLevel: number;
  jobCapacity: number;
  unitCapacity: number;
  focusScore: number;
  complexityScore: number;
  riskScore: number;
  readinessScore: number;
  summary: string;
  detail: string;
  functions: string[];
  features: string[];
  effects: string[];
  tags: string[];
  linkedJobIds: string[];
  linkedUnitIds: string[];
  yieldProfile: KnowledgeYieldProfile;
  mechanics: KnowledgeMechanicBundle;
}

export interface KnowledgeJobRole {
  id: string;
  domain: KnowledgeDomain;
  name: string;
  category: KnowledgeJobCategory;
  subCategory: KnowledgeJobSubCategory;
  class: KnowledgeJobClass;
  subClass: string;
  jobType: string;
  subJobType: string;
  commandBand: string;
  summary: string;
  detail: string;
  functions: string[];
  features: string[];
  effects: string[];
  supportedCategories: ResearchTechCategory[];
  supportedSubCategories: ResearchTechSubCategory[];
  preferredUnitIds: string[];
  staffing: {
    minimum: number;
    optimal: number;
    maximum: number;
  };
  bonuses: {
    throughput: number;
    efficiency: number;
    security: number;
    discovery: number;
  };
}

export interface KnowledgeSupportUnit {
  id: string;
  domain: KnowledgeDomain;
  name: string;
  category: KnowledgeUnitCategory;
  class: KnowledgeUnitClass;
  subClass: string;
  unitType: string;
  subUnitType: string;
  tier: number;
  crew: number;
  commandSlots: number;
  assignmentCapacity: number;
  summary: string;
  detail: string;
  functions: string[];
  features: string[];
  effects: string[];
  preferredCategories: ResearchTechCategory[];
  preferredSubCategories: ResearchTechSubCategory[];
  stats: {
    analysis: number;
    engineering: number;
    logistics: number;
    security: number;
    coordination: number;
  };
}

const CATEGORY_LOOKUP = new Map(
  RESEARCH_TECH_CATEGORIES.map((category) => [category.id, category]),
);

const SUBCATEGORY_LOOKUP = new Map(
  RESEARCH_TECH_SUBCATEGORIES.map((subCategory) => [subCategory.id, subCategory]),
);

const RESEARCH_SERIES = [
  "Helix", "Vector", "Axiom", "Nova", "Aegis", "Cipher", "Pulse", "Crown",
  "Vanguard", "Mirage", "Forge", "Catalyst", "Sentinel", "Echo", "Atlas", "Zenith",
  "Monolith", "Quasar", "Horizon", "Nexus", "Obelisk", "Parallax", "Luminary", "Tempest",
] as const;

const RESEARCH_PHASES = [
  "Primer", "Survey", "Expansion", "Calibration", "Refinement",
  "Breakthrough", "Directive", "Ascension", "Concord", "Singularity",
] as const;

const TECHNOLOGY_SERIES = [
  "Array", "Lattice", "Grid", "Matrix", "Engine", "Spindle", "Relay", "Foundry",
  "Bulwark", "Beacon", "Drive", "Anchor", "Vault", "Prism", "Cortex", "Harbor",
  "Citadel", "Crucible", "Circuit", "Manifold", "Pylon", "Bastion", "Vector", "Spire",
] as const;

const TECHNOLOGY_PHASES = [
  "Frame", "Kit", "Suite", "Platform", "Cluster",
  "Assembly", "Network", "Stack", "Shell", "Core",
] as const;

const CLASS_BANDS: ResearchTechClass[] = [
  "Foundational",
  "Novice",
  "Apprentice",
  "Advanced",
  "Expert",
  "Master",
  "Grandmaster",
  "Legendary",
  "Mythic",
  "Transcendent",
] as const;

const SUBCLASS_BANDS: ResearchTechSubClass[] = [
  "theoretical",
  "applied",
  "hybrid",
  "experimental",
  "classified",
  "autonomous",
  "xenological",
] as const;

const JOB_DOMAIN_PREFIX: Record<KnowledgeDomain, string> = {
  research: "Research",
  technology: "Technology",
};

const JOB_FAMILIES = [
  {
    stem: "Systems Analyst",
    category: "analysis" as KnowledgeJobCategory,
    subCategory: "theory-synthesis" as KnowledgeJobSubCategory,
    jobType: "analysis",
    subJobType: "modeling",
    subClass: "predictive-core",
  },
  {
    stem: "Simulation Controller",
    category: "analysis" as KnowledgeJobCategory,
    subCategory: "simulation-control" as KnowledgeJobSubCategory,
    jobType: "analysis",
    subJobType: "simulation",
    subClass: "digital-range",
  },
  {
    stem: "Discovery Auditor",
    category: "security-governance" as KnowledgeJobCategory,
    subCategory: "discovery-audit" as KnowledgeJobSubCategory,
    jobType: "governance",
    subJobType: "audit",
    subClass: "compliance-wing",
  },
  {
    stem: "Specimen Curator",
    category: "field-science" as KnowledgeJobCategory,
    subCategory: "specimen-handling" as KnowledgeJobSubCategory,
    jobType: "field-science",
    subJobType: "curation",
    subClass: "bio-vault",
  },
  {
    stem: "Reactor Tester",
    category: "lab-operations" as KnowledgeJobCategory,
    subCategory: "reactor-testing" as KnowledgeJobSubCategory,
    jobType: "lab-operations",
    subJobType: "stress-test",
    subClass: "containment-line",
  },
  {
    stem: "Fabrication Marshal",
    category: "prototype-fabrication" as KnowledgeJobCategory,
    subCategory: "fabrication-pipeline" as KnowledgeJobSubCategory,
    jobType: "fabrication",
    subJobType: "prototype-line",
    subClass: "foundry-axis",
  },
  {
    stem: "Expedition Coordinator",
    category: "field-science" as KnowledgeJobCategory,
    subCategory: "expedition-support" as KnowledgeJobSubCategory,
    jobType: "field-science",
    subJobType: "survey-ops",
    subClass: "frontier-command",
  },
  {
    stem: "Data Curator",
    category: "lab-operations" as KnowledgeJobCategory,
    subCategory: "data-curation" as KnowledgeJobSubCategory,
    jobType: "information",
    subJobType: "archive-management",
    subClass: "archive-spine",
  },
  {
    stem: "Doctrine Reviewer",
    category: "systems-integration" as KnowledgeJobCategory,
    subCategory: "doctrine-review" as KnowledgeJobSubCategory,
    jobType: "integration",
    subJobType: "standardization",
    subClass: "command-brief",
  },
  {
    stem: "Facility Warden",
    category: "security-governance" as KnowledgeJobCategory,
    subCategory: "facility-security" as KnowledgeJobSubCategory,
    jobType: "security",
    subJobType: "counter-intrusion",
    subClass: "watch-command",
  },
  {
    stem: "Deployment Planner",
    category: "systems-integration" as KnowledgeJobCategory,
    subCategory: "deployment-readiness" as KnowledgeJobSubCategory,
    jobType: "deployment",
    subJobType: "activation-plans",
    subClass: "launch-grid",
  },
  {
    stem: "Compliance Overseer",
    category: "security-governance" as KnowledgeJobCategory,
    subCategory: "compliance-oversight" as KnowledgeJobSubCategory,
    jobType: "governance",
    subJobType: "policy-control",
    subClass: "oversight-desk",
  },
] as const;

const JOB_CLASSES: KnowledgeJobClass[] = [
  "Cadet",
  "Operator",
  "Specialist",
  "Director",
  "Architect",
] as const;

const UNIT_FRAMES = [
  {
    stem: "Archive Drone Wing",
    category: "science" as KnowledgeUnitCategory,
    class: "Support" as KnowledgeUnitClass,
    subClass: "data-familiar",
    unitType: "drone",
    subUnitType: "archive-drone",
  },
  {
    stem: "Field Survey Corps",
    category: "expeditionary" as KnowledgeUnitCategory,
    class: "Expeditionary" as KnowledgeUnitClass,
    subClass: "planetary-survey",
    unitType: "corps",
    subUnitType: "survey-team",
  },
  {
    stem: "Prototype Assembly Cell",
    category: "industrial" as KnowledgeUnitCategory,
    class: "Technical" as KnowledgeUnitClass,
    subClass: "rapid-manufacture",
    unitType: "cell",
    subUnitType: "assembly-team",
  },
  {
    stem: "Containment Guard",
    category: "security" as KnowledgeUnitCategory,
    class: "Strategic" as KnowledgeUnitClass,
    subClass: "high-risk-security",
    unitType: "security-team",
    subUnitType: "containment-detail",
  },
  {
    stem: "Fleet Calibration Crew",
    category: "fleet-support" as KnowledgeUnitCategory,
    class: "Technical" as KnowledgeUnitClass,
    subClass: "starship-support",
    unitType: "crew",
    subUnitType: "calibration-team",
  },
  {
    stem: "Command Liaison Cadre",
    category: "civilian" as KnowledgeUnitCategory,
    class: "Command" as KnowledgeUnitClass,
    subClass: "command-network",
    unitType: "cadre",
    subUnitType: "liaison-unit",
  },
] as const;

function titleize(input: string) {
  return input
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getClassForIndex(index: number): ResearchTechClass {
  return CLASS_BANDS[Math.floor(index / 24) % CLASS_BANDS.length] ?? "Foundational";
}

function getSubClassForIndex(index: number): ResearchTechSubClass {
  return SUBCLASS_BANDS[index % SUBCLASS_BANDS.length] ?? "theoretical";
}

function buildYieldProfile(domain: KnowledgeDomain, tier: number, complexityScore: number): KnowledgeYieldProfile {
  const domainOffset = domain === "research" ? 0 : 4;
  return {
    throughput: 18 + tier + domainOffset,
    discoveryRate: 10 + Math.round(tier * 0.8) + domainOffset,
    deploymentReadiness: 9 + Math.round(tier * 0.9) + domainOffset,
    logisticsLoad: clamp(6 + Math.round(complexityScore / 8), 6, 60),
    securityDemand: clamp(4 + Math.round(tier / 4) + domainOffset, 4, 40),
    upkeep: 90 + tier * 14 + complexityScore * 6,
  };
}

function buildMechanics(
  domain: KnowledgeDomain,
  name: string,
  categoryName: string,
  subCategoryName: string,
): KnowledgeMechanicBundle {
  return {
    primaryLoop:
      domain === "research"
        ? `Assign analysts, run ${subCategoryName.toLowerCase()} studies, then convert discovery output into higher-tier ${categoryName.toLowerCase()} unlocks.`
        : `Route prototypes through ${subCategoryName.toLowerCase()} integration, then deploy validated systems into fleet, colony, and defense production queues.`,
    activeFunction:
      domain === "research"
        ? `${name} can be focused to spike breakthrough odds for one queue at the cost of extra upkeep and risk.`
        : `${name} can be switched into accelerated deployment mode to shorten activation time for adjacent production systems.`,
    passiveFunction:
      domain === "research"
        ? `${name} passively increases library depth, cross-discipline discovery retention, and archive quality.`
        : `${name} passively raises platform stability, support capacity, and operational readiness across linked modules.`,
    triggerCondition:
      domain === "research"
        ? "Triggers when job staffing, lab uptime, and archive integrity all exceed the target threshold."
        : "Triggers when prototype completion, systems security, and deployment capacity align for the selected theater.",
    gameplayEffect:
      domain === "research"
        ? "Improves research velocity, unlock quality, and advanced branch access."
        : "Improves technology rollout speed, ship and building bonuses, and logistics efficiency.",
  };
}

function buildCatalogEntry(domain: KnowledgeDomain, index: number): KnowledgeCatalogEntry {
  const familyIndex = Math.floor(index / 10);
  const phaseIndex = index % 10;
  const subCategory = RESEARCH_TECH_SUBCATEGORIES[familyIndex % RESEARCH_TECH_SUBCATEGORIES.length];
  const category = CATEGORY_LOOKUP.get(subCategory.category) ?? RESEARCH_TECH_CATEGORIES[0];
  const type = RESEARCH_TECH_TYPES[(index + (domain === "technology" ? 2 : 0)) % RESEARCH_TECH_TYPES.length];
  const subType = RESEARCH_TECH_SUBTYPES[(familyIndex + phaseIndex) % RESEARCH_TECH_SUBTYPES.length];
  const tier = 6 + ((familyIndex * 4 + phaseIndex * 3 + (domain === "technology" ? 5 : 0)) % 94);
  const minLevel = 1 + phaseIndex * 4;
  const maxLevel = minLevel + 24 + (familyIndex % 4) * 6;
  const complexityScore = clamp(28 + familyIndex * 2 + phaseIndex * 3 + (domain === "technology" ? 8 : 0), 25, 99);
  const focusScore = clamp(34 + familyIndex * 2 + phaseIndex + (domain === "research" ? 6 : 3), 20, 99);
  const riskScore = clamp(10 + phaseIndex * 4 + (domain === "technology" ? 12 : 6), 8, 96);
  const readinessScore = clamp(24 + familyIndex * 3 + phaseIndex * 2 + (domain === "technology" ? 10 : 0), 18, 99);
  const series = domain === "research" ? RESEARCH_SERIES[familyIndex % RESEARCH_SERIES.length] : TECHNOLOGY_SERIES[familyIndex % TECHNOLOGY_SERIES.length];
  const phase = domain === "research" ? RESEARCH_PHASES[phaseIndex] : TECHNOLOGY_PHASES[phaseIndex];
  const categoryName = category.name;
  const subCategoryName = titleize(subCategory.id);
  const className = getClassForIndex(index);
  const subClass = getSubClassForIndex(index + (domain === "technology" ? 2 : 0));
  const tagStem = domain === "research" ? "research" : "technology";
  const name =
    domain === "research"
      ? `${subCategoryName} ${series} ${phase}`
      : `${subCategoryName} ${series} ${phase} System`;

  const linkedJobIds = Array.from({ length: 3 }, (_, offset) => {
    const family = (familyIndex + offset) % JOB_FAMILIES.length;
    const grade = (phaseIndex + offset) % JOB_CLASSES.length;
    return `${domain}-job-${String(family * JOB_CLASSES.length + grade + 1).padStart(3, "0")}`;
  });

  const linkedUnitIds = Array.from({ length: 2 }, (_, offset) => {
    const frame = (familyIndex + offset) % UNIT_FRAMES.length;
    const tierBand = (phaseIndex + offset) % 4;
    const unitDomainOffset = domain === "research" ? 0 : UNIT_FRAMES.length * 4;
    return `${domain}-unit-${String(unitDomainOffset + frame * 4 + tierBand + 1).padStart(3, "0")}`;
  });

  const summary =
    domain === "research"
      ? `${name} expands ${categoryName.toLowerCase()} doctrine with a ${type.name.toLowerCase()} emphasis and a ${subType.name.toLowerCase()} subtrack.`
      : `${name} operationalizes ${categoryName.toLowerCase()} discoveries into deployable modules with ${subType.name.toLowerCase()} execution paths.`;

  const detail =
    domain === "research"
      ? `This library track organizes ${subCategoryName.toLowerCase()} investigations into repeatable jobs, specialist assignments, and tier-based breakthroughs that strengthen academy, colony, fleet, and government knowledge loops.`
      : `This technology stack converts ${subCategoryName.toLowerCase()} research into fielded equipment, subsystem upgrades, and support network features that improve readiness for colonies, fleets, megastructures, and command operations.`;

  return {
    id: `${domain}-${String(index + 1).padStart(3, "0")}`,
    domain,
    libraryCode: `${tagStem.toUpperCase()}-${String(familyIndex + 1).padStart(2, "0")}-${String(phaseIndex + 1).padStart(2, "0")}`,
    name,
    category: category.id,
    subCategory: subCategory.id,
    type: type.id,
    subType: subType.id,
    class: className,
    subClass,
    tier,
    minLevel,
    maxLevel,
    jobCapacity: 8 + (phaseIndex % 5) * 2 + (domain === "technology" ? 2 : 0),
    unitCapacity: 2 + (familyIndex % 4) + (domain === "technology" ? 1 : 0),
    focusScore,
    complexityScore,
    riskScore,
    readinessScore,
    summary,
    detail,
    functions: [
      domain === "research" ? "Queue discovery cycles" : "Queue deployment cycles",
      domain === "research" ? "Convert breakthroughs into unlock points" : "Convert prototypes into active modules",
      domain === "research" ? "Improve branch depth and archive value" : "Improve system stability and rollout capacity",
    ],
    features: [
      `Category focus: ${categoryName}`,
      `Sub-discipline: ${subCategoryName}`,
      `Tier scaling from level ${minLevel} to ${maxLevel}`,
      domain === "research" ? "Cross-discipline synergy hooks" : "Production and fleet integration hooks",
    ],
    effects: [
      `+${focusScore}% ${domain === "research" ? "knowledge focus" : "deployment focus"}`,
      `+${readinessScore}% readiness potential when fully staffed`,
      `${riskScore}% peak risk profile at overload`,
    ],
    tags: [
      tagStem,
      category.id,
      subCategory.id,
      type.id,
      subType.id,
      className.toLowerCase(),
    ],
    linkedJobIds,
    linkedUnitIds,
    yieldProfile: buildYieldProfile(domain, tier, complexityScore),
    mechanics: buildMechanics(domain, name, categoryName, subCategoryName),
  };
}

function buildJobRole(domain: KnowledgeDomain, index: number): KnowledgeJobRole {
  const family = JOB_FAMILIES[index % JOB_FAMILIES.length];
  const grade = JOB_CLASSES[Math.floor(index / JOB_FAMILIES.length) % JOB_CLASSES.length] ?? "Cadet";
  const supportedSubCategories = Array.from({ length: 3 }, (_, offset) => {
    return RESEARCH_TECH_SUBCATEGORIES[(index + offset * 4) % RESEARCH_TECH_SUBCATEGORIES.length].id;
  });
  const supportedCategories = Array.from(
    new Set(
      supportedSubCategories.map((subCategoryId) => {
        const subCategory = SUBCATEGORY_LOOKUP.get(subCategoryId);
        return subCategory?.category ?? RESEARCH_TECH_CATEGORIES[0].id;
      }),
    ),
  ) as ResearchTechCategory[];

  const preferredUnitIds = Array.from({ length: 2 }, (_, offset) => {
    const frameIndex = (index + offset) % UNIT_FRAMES.length;
    const tierBand = (index + offset) % 4;
    const unitDomainOffset = domain === "research" ? 0 : UNIT_FRAMES.length * 4;
    return `${domain}-unit-${String(unitDomainOffset + frameIndex * 4 + tierBand + 1).padStart(3, "0")}`;
  });

  const classWeight = JOB_CLASSES.indexOf(grade) + 1;
  const fullName = `${JOB_DOMAIN_PREFIX[domain]} ${family.stem} ${grade}`;

  return {
    id: `${domain}-job-${String(index + 1).padStart(3, "0")}`,
    domain,
    name: fullName,
    category: family.category,
    subCategory: family.subCategory,
    class: grade,
    subClass: family.subClass,
    jobType: family.jobType,
    subJobType: family.subJobType,
    commandBand: classWeight >= 4 ? "Senior" : classWeight >= 2 ? "Operational" : "Junior",
    summary:
      domain === "research"
        ? `${fullName} improves discovery control, queue quality, and archive stability for linked knowledge programs.`
        : `${fullName} improves integration speed, deployment readiness, and rollout safety for linked technology systems.`,
    detail: `This role belongs to the ${family.category} discipline and specializes in ${titleize(family.subCategory)} duties. It can be assigned to multiple laboratories or system cells and scales strongly with unit support and facility uptime.`,
    functions: [
      "Fill assignment slots in active knowledge queues",
      "Boost throughput, efficiency, and security metrics",
      "Unlock higher staffing thresholds for advanced entries",
    ],
    features: [
      `Primary discipline: ${titleize(family.category)}`,
      `Sub-discipline: ${titleize(family.subCategory)}`,
      `Command band: ${classWeight >= 4 ? "Senior direction" : "Operational execution"}`,
    ],
    effects: [
      `+${8 + classWeight * 3}% throughput`,
      `+${4 + classWeight * 2}% efficiency`,
      `+${3 + classWeight * 2}% security`,
      `+${5 + classWeight * 3}% discovery or rollout quality`,
    ],
    supportedCategories,
    supportedSubCategories,
    preferredUnitIds,
    staffing: {
      minimum: 2 + classWeight,
      optimal: 5 + classWeight * 2,
      maximum: 9 + classWeight * 3,
    },
    bonuses: {
      throughput: 8 + classWeight * 3,
      efficiency: 5 + classWeight * 2,
      security: 4 + classWeight * 2,
      discovery: 6 + classWeight * 3,
    },
  };
}

function buildSupportUnit(domain: KnowledgeDomain, frameIndex: number, tierBand: number): KnowledgeSupportUnit {
  const frame = UNIT_FRAMES[frameIndex];
  const preferredSubCategories = Array.from({ length: 3 }, (_, offset) => {
    return RESEARCH_TECH_SUBCATEGORIES[(frameIndex * 3 + tierBand + offset) % RESEARCH_TECH_SUBCATEGORIES.length].id;
  });
  const preferredCategories = Array.from(
    new Set(
      preferredSubCategories.map((subCategoryId) => {
        const subCategory = SUBCATEGORY_LOOKUP.get(subCategoryId);
        return subCategory?.category ?? RESEARCH_TECH_CATEGORIES[0].id;
      }),
    ),
  ) as ResearchTechCategory[];

  const tier = tierBand + 1;
  const name = `${JOB_DOMAIN_PREFIX[domain]} ${frame.stem} Mk ${tier}`;

  return {
    id: `${domain}-unit-${String((domain === "research" ? 0 : UNIT_FRAMES.length * 4) + frameIndex * 4 + tierBand + 1).padStart(3, "0")}`,
    domain,
    name,
    category: frame.category,
    class: frame.class,
    subClass: frame.subClass,
    unitType: frame.unitType,
    subUnitType: frame.subUnitType,
    tier,
    crew: 12 + frameIndex * 4 + tierBand * 6,
    commandSlots: 1 + Math.floor((tierBand + frameIndex) / 3),
    assignmentCapacity: 3 + tierBand + (frameIndex % 3),
    summary:
      domain === "research"
        ? `${name} supports data collection, controlled experimentation, and archive-grade field validation.`
        : `${name} supports integration, hardening, and deployment of technology stacks into active production or combat theaters.`,
    detail: `This ${frame.class.toLowerCase()} unit strengthens assignments that match its preferred categories. Higher marks increase staffing headroom, improve safety, and reduce downtime during complex queue execution.`,
    functions: [
      "Provide specialist support slots to jobs",
      "Raise assignment capacity for complex entries",
      "Reduce queue disruption during high-risk operations",
    ],
    features: [
      `Preferred focus bands: ${preferredCategories.map((category) => titleize(category)).slice(0, 2).join(", ")}`,
      `Tier ${tier} scaling for crew, logistics, and coordination`,
      domain === "research" ? "Archive and field validation packages" : "Deployment and integration packages",
    ],
    effects: [
      `+${10 + tier * 4}% analysis support`,
      `+${8 + tier * 4}% engineering support`,
      `+${6 + tier * 3}% logistics support`,
      `+${7 + tier * 3}% security support`,
    ],
    preferredCategories,
    preferredSubCategories,
    stats: {
      analysis: 18 + tier * 7 + frameIndex,
      engineering: 16 + tier * 6 + frameIndex * 2,
      logistics: 14 + tier * 5 + frameIndex,
      security: 12 + tier * 4 + frameIndex * 2,
      coordination: 15 + tier * 5 + frameIndex,
    },
  };
}

export const RESEARCH_PROGRAM_LIBRARY_240: KnowledgeCatalogEntry[] = Array.from(
  { length: 240 },
  (_, index) => buildCatalogEntry("research", index),
);

export const TECHNOLOGY_SYSTEM_LIBRARY_240: KnowledgeCatalogEntry[] = Array.from(
  { length: 240 },
  (_, index) => buildCatalogEntry("technology", index),
);

export const RESEARCH_JOB_SYSTEMS: KnowledgeJobRole[] = Array.from(
  { length: 30 },
  (_, index) => buildJobRole("research", index),
);

export const TECHNOLOGY_JOB_SYSTEMS: KnowledgeJobRole[] = Array.from(
  { length: 30 },
  (_, index) => buildJobRole("technology", index),
);

export const KNOWLEDGE_SUPPORT_UNITS: KnowledgeSupportUnit[] = [
  ...Array.from({ length: UNIT_FRAMES.length * 4 }, (_, index) =>
    buildSupportUnit("research", index % UNIT_FRAMES.length, Math.floor(index / UNIT_FRAMES.length)),
  ),
  ...Array.from({ length: UNIT_FRAMES.length * 4 }, (_, index) =>
    buildSupportUnit("technology", index % UNIT_FRAMES.length, Math.floor(index / UNIT_FRAMES.length)),
  ),
];

export const ALL_KNOWLEDGE_JOBS = [
  ...RESEARCH_JOB_SYSTEMS,
  ...TECHNOLOGY_JOB_SYSTEMS,
];

export const ALL_KNOWLEDGE_LIBRARY_ENTRIES = [
  ...RESEARCH_PROGRAM_LIBRARY_240,
  ...TECHNOLOGY_SYSTEM_LIBRARY_240,
];

export const KNOWLEDGE_OPERATIONS_META = {
  researchPrograms: RESEARCH_PROGRAM_LIBRARY_240.length,
  technologySystems: TECHNOLOGY_SYSTEM_LIBRARY_240.length,
  researchJobs: RESEARCH_JOB_SYSTEMS.length,
  technologyJobs: TECHNOLOGY_JOB_SYSTEMS.length,
  supportUnits: KNOWLEDGE_SUPPORT_UNITS.length,
  totalKnowledgeEntries: ALL_KNOWLEDGE_LIBRARY_ENTRIES.length,
  totalCategories: RESEARCH_TECH_CATEGORIES.length,
  totalSubCategories: RESEARCH_TECH_SUBCATEGORIES.length,
  version: "2.0.0",
} as const;

export function getKnowledgeEntriesByDomain(domain: KnowledgeDomain) {
  return ALL_KNOWLEDGE_LIBRARY_ENTRIES.filter((entry) => entry.domain === domain);
}

export function getKnowledgeEntriesByCategory(category: ResearchTechCategory, domain?: KnowledgeDomain) {
  return ALL_KNOWLEDGE_LIBRARY_ENTRIES.filter(
    (entry) => entry.category === category && (!domain || entry.domain === domain),
  );
}

export function getKnowledgeEntriesBySubCategory(subCategory: ResearchTechSubCategory, domain?: KnowledgeDomain) {
  return ALL_KNOWLEDGE_LIBRARY_ENTRIES.filter(
    (entry) => entry.subCategory === subCategory && (!domain || entry.domain === domain),
  );
}

export function getKnowledgeJobsForEntry(entry: KnowledgeCatalogEntry) {
  const domainJobs = ALL_KNOWLEDGE_JOBS.filter((job) => job.domain === entry.domain);
  return domainJobs.filter(
    (job) =>
      entry.linkedJobIds.includes(job.id) ||
      job.supportedCategories.includes(entry.category) ||
      job.supportedSubCategories.includes(entry.subCategory),
  );
}

export function getKnowledgeUnitsForEntry(entry: KnowledgeCatalogEntry) {
  return KNOWLEDGE_SUPPORT_UNITS.filter(
    (unit) =>
      unit.domain === entry.domain &&
      (entry.linkedUnitIds.includes(unit.id) ||
        unit.preferredCategories.includes(entry.category) ||
        unit.preferredSubCategories.includes(entry.subCategory)),
  );
}

export function getKnowledgeEffectSummary(entry: KnowledgeCatalogEntry) {
  return `${entry.name} delivers ${entry.yieldProfile.throughput} throughput, ${entry.yieldProfile.discoveryRate} discovery quality, and ${entry.yieldProfile.deploymentReadiness} readiness with ${entry.yieldProfile.securityDemand} security demand.`;
}

export function calculateKnowledgeOutput(
  entry: KnowledgeCatalogEntry,
  assignedJobs: number,
  assignedUnits: number,
  facilityLevel: number,
) {
  const staffingRatio = assignedJobs / Math.max(entry.jobCapacity, 1);
  const unitRatio = assignedUnits / Math.max(entry.unitCapacity, 1);
  const facilityRatio = facilityLevel / Math.max(entry.tier / 10, 1);
  const throughputMultiplier = 1 + staffingRatio * 0.55 + unitRatio * 0.25 + facilityRatio * 0.2;
  const riskPressure = clamp(
    entry.riskScore - assignedUnits * 2 - Math.round(facilityLevel * 0.8) + Math.round(assignedJobs * 0.6),
    0,
    100,
  );

  return {
    throughputPerCycle: Math.round(entry.yieldProfile.throughput * throughputMultiplier),
    discoveryPerCycle: Math.round(entry.yieldProfile.discoveryRate * (1 + staffingRatio * 0.45)),
    readinessPerCycle: Math.round(entry.yieldProfile.deploymentReadiness * (1 + unitRatio * 0.4)),
    upkeepPerCycle: Math.round(entry.yieldProfile.upkeep * (1 + staffingRatio * 0.2 + unitRatio * 0.15)),
    riskPressure,
  };
}

export function getJobCoverageForCategory(domain: KnowledgeDomain, category: ResearchTechCategory) {
  return ALL_KNOWLEDGE_JOBS.filter(
    (job) => job.domain === domain && job.supportedCategories.includes(category),
  );
}

export function getUnitCoverageForCategory(domain: KnowledgeDomain, category: ResearchTechCategory) {
  return KNOWLEDGE_SUPPORT_UNITS.filter(
    (unit) => unit.domain === domain && unit.preferredCategories.includes(category),
  );
}

