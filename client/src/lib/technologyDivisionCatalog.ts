import type { TechArea } from "@/lib/techData";

export interface TechnologyDivisionDefinition {
  id: string;
  name: string;
  summary: string;
  anchorTechId: string;
  anchorTechLabel: string;
  area: TechArea;
  specialty: string;
  icon: string;
  order: number;
}

export interface TechnologyDivisionSystemRequirements {
  anchorResearchLevel: number;
  kardashevLevel: number;
  priorSystems: number;
}

export interface TechnologyDivisionSystem {
  id: string;
  divisionId: string;
  divisionName: string;
  systemIndex: number;
  sequence: number;
  module: string;
  phase: string;
  name: string;
  specialty: string;
  description: string;
  effect: string;
  requirements: TechnologyDivisionSystemRequirements;
}

export interface TechnologyDivisionUpgradeSnapshot {
  maxLevel: number;
  buildTimeSeconds: number;
  cost: { metal: number; crystal: number; deuterium: number };
  currentBonus: number;
  nextBonus: number;
}

const MODULES = [
  "Framework",
  "Array",
  "Matrix",
  "Directive",
  "Engine",
  "Protocol",
  "Foundry",
  "Suite",
  "Lattice",
  "Nexus",
] as const;

const PHASES = [
  "Initiation",
  "Calibration",
  "Synchronization",
  "Expansion",
  "Harmonization",
  "Integration",
  "Acceleration",
  "Ascension",
  "Apex",
] as const;

export const TECHNOLOGY_DIVISIONS: TechnologyDivisionDefinition[] = [
  { id: "energy-systems", name: "Energy Systems", summary: "Grid theory, reactor control, and empire-scale power stability.", anchorTechId: "energyTech", anchorTechLabel: "Energy Tech", area: "physics", specialty: "energy throughput", icon: "zap", order: 1 },
  { id: "laser-doctrine", name: "Laser Doctrine", summary: "Beam weapons, cutting arrays, and coherent-light control.", anchorTechId: "laserTech", anchorTechLabel: "Laser Tech", area: "physics", specialty: "beam precision", icon: "crosshair", order: 2 },
  { id: "ion-dynamics", name: "Ion Dynamics", summary: "Ion transport, charge stability, and plasma-stage ionics.", anchorTechId: "ionTech", anchorTechLabel: "Ion Tech", area: "physics", specialty: "ion stability", icon: "flask", order: 3 },
  { id: "hyperspace-frameworks", name: "Hyperspace Frameworks", summary: "Subspace theory, corridor mapping, and higher-dimensional navigation.", anchorTechId: "hyperspaceTech", anchorTechLabel: "Hyperspace Tech", area: "physics", specialty: "subspace reliability", icon: "layers", order: 4 },
  { id: "plasma-systems", name: "Plasma Systems", summary: "Containment, industrial plasma routing, and military plasma doctrine.", anchorTechId: "plasmaTech", anchorTechLabel: "Plasma Tech", area: "physics", specialty: "plasma output", icon: "flame", order: 5 },
  { id: "combustion-labs", name: "Combustion Labs", summary: "Early propulsion efficiency, fuel burn, and drive-chain testing.", anchorTechId: "combustionDrive", anchorTechLabel: "Combustion Drive", area: "engineering", specialty: "drive efficiency", icon: "rocket", order: 6 },
  { id: "impulse-vector-bureau", name: "Impulse Vector Bureau", summary: "Maneuver planning, thrust vector control, and pursuit doctrine.", anchorTechId: "impulseDrive", anchorTechLabel: "Impulse Drive", area: "engineering", specialty: "maneuver response", icon: "gauge", order: 7 },
  { id: "hyperspace-propulsion", name: "Hyperspace Propulsion", summary: "Advanced FTL transitions and high-order travel safety systems.", anchorTechId: "hyperspaceDrive", anchorTechLabel: "Hyperspace Drive", area: "engineering", specialty: "ftl transit speed", icon: "move-right", order: 8 },
  { id: "espionage-analytics", name: "Espionage Analytics", summary: "Signals analysis, covert interpretation, and intelligence projection.", anchorTechId: "espionageTech", anchorTechLabel: "Espionage Tech", area: "society", specialty: "intelligence resolution", icon: "eye", order: 9 },
  { id: "computer-cognition", name: "Computer Cognition", summary: "Empire computation, tactical processing, and machine coordination.", anchorTechId: "computerTech", anchorTechLabel: "Computer Tech", area: "physics", specialty: "computation speed", icon: "cpu", order: 10 },
  { id: "astrophysics-survey", name: "Astrophysics Survey", summary: "Colonization science, orbital mapping, and stellar interpretation.", anchorTechId: "astrophysics", anchorTechLabel: "Astrophysics", area: "society", specialty: "survey quality", icon: "telescope", order: 11 },
  { id: "research-network-command", name: "Research Network Command", summary: "Cross-colony research synchronization and knowledge routing.", anchorTechId: "intergalacticResearchNetwork", anchorTechLabel: "Research Network", area: "society", specialty: "research coordination", icon: "network", order: 12 },
  { id: "graviton-dynamics", name: "Graviton Dynamics", summary: "Field curvature, mass control, and gravitic experimentation.", anchorTechId: "gravitonTech", anchorTechLabel: "Graviton Tech", area: "physics", specialty: "field control", icon: "orbit", order: 13 },
  { id: "weapons-engineering", name: "Weapons Engineering", summary: "Integrated offensive theory across fleets, platforms, and systems.", anchorTechId: "weaponsTech", anchorTechLabel: "Weapons Tech", area: "engineering", specialty: "weapons output", icon: "swords", order: 14 },
  { id: "shield-harmonization", name: "Shield Harmonization", summary: "Shield phasing, resilience, and projector synchronization.", anchorTechId: "shieldingTech", anchorTechLabel: "Shielding Tech", area: "physics", specialty: "shield strength", icon: "shield", order: 15 },
  { id: "armour-materials", name: "Armour Materials", summary: "Composite plating, adaptive hulls, and survivability engineering.", anchorTechId: "armourTech", anchorTechLabel: "Armour Tech", area: "engineering", specialty: "armor resilience", icon: "box", order: 16 },
  { id: "ai-synthesis", name: "AI Synthesis", summary: "Synthetic command support, predictive models, and automated governance.", anchorTechId: "aiTech", anchorTechLabel: "AI Tech", area: "physics", specialty: "automation depth", icon: "bot", order: 17 },
  { id: "quantum-entanglement", name: "Quantum Entanglement", summary: "Quantum routing, secure information exchange, and entangled systems.", anchorTechId: "quantumTech", anchorTechLabel: "Quantum Tech", area: "physics", specialty: "quantum synchronization", icon: "sparkles", order: 18 },
];

export const TECHNOLOGY_DIVISION_SYSTEMS: TechnologyDivisionSystem[] = TECHNOLOGY_DIVISIONS.flatMap((division) =>
  PHASES.flatMap((phase, phaseIndex) =>
    MODULES.map((module, moduleIndex) => {
      const sequence = phaseIndex * MODULES.length + moduleIndex + 1;
      const priorSystems = Math.max(0, sequence - 1);
      const anchorResearchLevel = Math.min(5, 1 + Math.floor((sequence - 1) / 18));
      const kardashevLevel = Math.min(6, 1 + Math.floor((sequence - 1) / 30));

      return {
        id: `${division.id}-${sequence.toString().padStart(2, "0")}`,
        divisionId: division.id,
        divisionName: division.name,
        systemIndex: sequence - 1,
        sequence,
        module,
        phase,
        name: `${division.name} ${module} ${phase}`,
        specialty: division.specialty,
        description: `${division.name} develops ${module.toLowerCase()} doctrine during the ${phase.toLowerCase()} stage to sharpen ${division.specialty}.`,
        effect: `+${2 + (division.order % 4) + phaseIndex}% ${division.specialty}`,
        requirements: {
          anchorResearchLevel,
          kardashevLevel,
          priorSystems,
        },
      };
    }),
  ),
);

export const TECHNOLOGY_DIVISION_COUNTS = {
  divisions: TECHNOLOGY_DIVISIONS.length,
  systemsPerDivision: MODULES.length * PHASES.length,
  totalSystems: TECHNOLOGY_DIVISION_SYSTEMS.length,
};

export function getTechnologyDivisionSystemsByDivision(divisionId: string): TechnologyDivisionSystem[] {
  return TECHNOLOGY_DIVISION_SYSTEMS.filter((system) => system.divisionId === divisionId);
}

export function getTechnologyDivisionUpgradeSnapshot(
  system: TechnologyDivisionSystem,
  divisionOrder: number,
  level: number,
): TechnologyDivisionUpgradeSnapshot {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  const sequenceWeight = system.sequence;
  const baseBonus = 2 + (divisionOrder % 4) + Math.floor(sequenceWeight / 18);

  return {
    maxLevel: 6,
    buildTimeSeconds: Math.floor((32 + divisionOrder * 3 + Math.ceil(sequenceWeight / 9)) * (1 + safeLevel * 0.14)),
    cost: {
      metal: Math.floor((110 + divisionOrder * 16 + sequenceWeight * 3) * Math.pow(1.34, safeLevel)),
      crystal: Math.floor((90 + divisionOrder * 14 + sequenceWeight * 2.4) * Math.pow(1.32, safeLevel)),
      deuterium: Math.floor((60 + divisionOrder * 10 + sequenceWeight * 1.8) * Math.pow(1.28, safeLevel)),
    },
    currentBonus: baseBonus * safeLevel,
    nextBonus: baseBonus * (safeLevel + 1),
  };
}
