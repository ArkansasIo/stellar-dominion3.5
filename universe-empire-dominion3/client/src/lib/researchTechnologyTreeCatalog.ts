import type { TechArea } from "@/lib/techData";

export interface ResearchTreeCategoryDefinition {
  id: TechArea;
  label: string;
  summary: string;
  doctrine: string;
}

export interface ResearchTreeNodeRequirements {
  anchorResearchId: string;
  anchorResearchLabel: string;
  anchorLevel: number;
  kardashevLevel: number;
  priorNodeId?: string;
}

export interface ResearchTreeNode {
  id: string;
  category: TechArea;
  branchId: string;
  branchName: string;
  sequence: number;
  title: string;
  phase: string;
  specialty: string;
  description: string;
  effect: string;
  requirements: ResearchTreeNodeRequirements;
}

export interface ResearchTreeUpgradeSnapshot {
  maxLevel: number;
  buildTimeSeconds: number;
  cost: { metal: number; crystal: number; deuterium: number };
  currentBonus: number;
  nextBonus: number;
}

const NODE_PHASES = [
  "Foundation",
  "Calibration",
  "Expansion",
  "Integration",
  "Dominance",
  "Ascension",
  "Synchronization",
  "Breakthrough",
  "Convergence",
  "Apex",
] as const;

const CATEGORY_BRANCHES: Record<
  TechArea,
  Array<{
    id: string;
    name: string;
    specialty: string;
    anchorResearchId: string;
    anchorResearchLabel: string;
  }>
> = {
  physics: [
    { id: "warp-field-lattices", name: "Warp Field Lattices", specialty: "jump field stability", anchorResearchId: "hyperspaceTech", anchorResearchLabel: "Hyperspace Tech" },
    { id: "cloaking-spectrums", name: "Cloaking Spectrums", specialty: "signature suppression", anchorResearchId: "laserTech", anchorResearchLabel: "Laser Tech" },
    { id: "interdiction-resonance", name: "Interdiction Resonance", specialty: "warp denial geometry", anchorResearchId: "gravitonTech", anchorResearchLabel: "Graviton Tech" },
    { id: "fighter-control-theory", name: "Fighter Control Theory", specialty: "carrier strike synchronization", anchorResearchId: "computerTech", anchorResearchLabel: "Computer Tech" },
    { id: "siege-reactor-maps", name: "Siege Reactor Maps", specialty: "dreadnought siege cycling", anchorResearchId: "plasmaTech", anchorResearchLabel: "Plasma Tech" },
    { id: "triage-field-maths", name: "Triage Field Maths", specialty: "capital logistics projection", anchorResearchId: "energyTech", anchorResearchLabel: "Energy Tech" },
    { id: "cyno-harmonics", name: "Cyno Harmonics", specialty: "strategic insertion fidelity", anchorResearchId: "quantumTech", anchorResearchLabel: "Quantum Tech" },
    { id: "subcapital-targeting", name: "Subcapital Targeting", specialty: "frigate and destroyer tracking", anchorResearchId: "ionTech", anchorResearchLabel: "Ion Tech" },
    { id: "supercapital-tensors", name: "Supercapital Tensors", specialty: "supercapital field coherence", anchorResearchId: "gravitonTech", anchorResearchLabel: "Graviton Tech" },
  ],
  society: [
    { id: "naval-officer-corps", name: "Naval Officer Corps", specialty: "fleet command discipline", anchorResearchId: "intergalacticResearchNetwork", anchorResearchLabel: "Research Network" },
    { id: "convoy-governance", name: "Convoy Governance", specialty: "industrial convoy survivability", anchorResearchId: "astrophysics", anchorResearchLabel: "Astrophysics" },
    { id: "black-ops-protocols", name: "Black Ops Protocols", specialty: "covert deployment timing", anchorResearchId: "espionageTech", anchorResearchLabel: "Espionage Tech" },
    { id: "expedition-charters", name: "Expedition Charters", specialty: "exploration fleet endurance", anchorResearchId: "astrophysics", anchorResearchLabel: "Astrophysics" },
    { id: "carrier-wing-culture", name: "Carrier Wing Culture", specialty: "fighter pilot cohesion", anchorResearchId: "intergalacticResearchNetwork", anchorResearchLabel: "Research Network" },
    { id: "capital-damage-control", name: "Capital Damage Control", specialty: "capital crew survivability", anchorResearchId: "astrophysics", anchorResearchLabel: "Astrophysics" },
    { id: "siege-administration", name: "Siege Administration", specialty: "frontline resupply tempo", anchorResearchId: "espionageTech", anchorResearchLabel: "Espionage Tech" },
    { id: "mercantile-command", name: "Mercantile Command", specialty: "trade lane escort efficiency", anchorResearchId: "intergalacticResearchNetwork", anchorResearchLabel: "Research Network" },
    { id: "supercapital-council", name: "Supercapital Council", specialty: "apex fleet authority", anchorResearchId: "intergalacticResearchNetwork", anchorResearchLabel: "Research Network" },
  ],
  engineering: [
    { id: "frigate-doctrine", name: "Frigate Doctrine", specialty: "frigate hull optimization", anchorResearchId: "combustionDrive", anchorResearchLabel: "Combustion Drive" },
    { id: "destroyer-doctrine", name: "Destroyer Doctrine", specialty: "destroyer mount architecture", anchorResearchId: "impulseDrive", anchorResearchLabel: "Impulse Drive" },
    { id: "cruiser-doctrine", name: "Cruiser Doctrine", specialty: "cruiser systems integration", anchorResearchId: "weaponsTech", anchorResearchLabel: "Weapons Tech" },
    { id: "battlecruiser-doctrine", name: "Battlecruiser Doctrine", specialty: "battlecruiser pressure output", anchorResearchId: "armourTech", anchorResearchLabel: "Armour Tech" },
    { id: "battleship-doctrine", name: "Battleship Doctrine", specialty: "battleship broadside stability", anchorResearchId: "shieldingTech", anchorResearchLabel: "Shielding Tech" },
    { id: "industrial-command", name: "Industrial Command", specialty: "industrial hull throughput", anchorResearchId: "aiTech", anchorResearchLabel: "AI Tech" },
    { id: "capital-command", name: "Capital Command", specialty: "capital hull assembly", anchorResearchId: "hyperspaceDrive", anchorResearchLabel: "Hyperspace Drive" },
    { id: "carrier-operations", name: "Carrier Operations", specialty: "carrier launch capacity", anchorResearchId: "ionTech", anchorResearchLabel: "Ion Tech" },
    { id: "titan-architecture", name: "Titan Architecture", specialty: "titan construction integrity", anchorResearchId: "titanConstruction", anchorResearchLabel: "Titan Tech" },
  ],
};

export const RESEARCH_TREE_CATEGORIES: ResearchTreeCategoryDefinition[] = [
  { id: "physics", label: "Physics", summary: "Energy, field theory, and reality-scale computation.", doctrine: "Physics should feel like empire-scale systems engineering, not isolated lab work." },
  { id: "society", label: "Society", summary: "Governance, expansion doctrine, intelligence, and population cohesion.", doctrine: "Society research turns sprawling territory into an organized strategic state." },
  { id: "engineering", label: "Engineering", summary: "Industrial implementation, drives, hulls, and applied weapons systems.", doctrine: "Engineering converts theory into infrastructure, fleets, and conquest-ready output." },
];

export const RESEARCH_TREE_NODES: ResearchTreeNode[] = (Object.entries(CATEGORY_BRANCHES) as Array<[TechArea, typeof CATEGORY_BRANCHES[TechArea]]>).flatMap(
  ([category, branches]) =>
    branches.flatMap((branch) =>
      NODE_PHASES.map((phase, phaseIndex) => {
        const sequence = phaseIndex + 1;
        const priorNodeId = sequence > 1 ? `${category}-${branch.id}-${String(sequence - 1).padStart(2, "0")}` : undefined;
        const anchorLevel = Math.min(6, 1 + Math.floor(phaseIndex / 2));
        const kardashevLevel = Math.min(6, 1 + Math.floor(phaseIndex / 2));
        const baseBonus = 3 + (sequence % 4);

        return {
          id: `${category}-${branch.id}-${String(sequence).padStart(2, "0")}`,
          category,
          branchId: branch.id,
          branchName: branch.name,
          sequence,
          title: `${branch.name} ${phase}`,
          phase,
          specialty: branch.specialty,
          description: `${branch.name} enters its ${phase.toLowerCase()} phase, expanding ${branch.specialty} from laboratory control into empire-wide doctrine.`,
          effect: `+${baseBonus + phaseIndex}% ${branch.specialty}`,
          requirements: {
            anchorResearchId: branch.anchorResearchId,
            anchorResearchLabel: branch.anchorResearchLabel,
            anchorLevel,
            kardashevLevel,
            priorNodeId,
          },
        };
      }),
    ),
);

export const RESEARCH_TREE_COUNTS = {
  categories: RESEARCH_TREE_CATEGORIES.length,
  nodesPerCategory: 90,
  totalNodes: RESEARCH_TREE_NODES.length,
};

export function getResearchTreeNodesByCategory(category: TechArea): ResearchTreeNode[] {
  return RESEARCH_TREE_NODES.filter((node) => node.category === category);
}

export function getResearchTreeBranchesByCategory(category: TechArea): Array<{ id: string; name: string }> {
  const seen = new Map<string, string>();
  for (const node of RESEARCH_TREE_NODES) {
    if (node.category !== category || seen.has(node.branchId)) continue;
    seen.set(node.branchId, node.branchName);
  }
  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
}

export function getResearchTreeUpgradeSnapshot(node: ResearchTreeNode, level: number): ResearchTreeUpgradeSnapshot {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  const categoryWeight = node.category === "physics" ? 1.16 : node.category === "society" ? 1.08 : 1.12;
  const sequenceWeight = 1 + node.sequence * 0.18;
  const baseBonus = 3 + (node.sequence % 4);

  return {
    maxLevel: 6,
    buildTimeSeconds: Math.floor((34 + node.sequence * 4) * (1 + safeLevel * 0.16)),
    cost: {
      metal: Math.floor(140 * categoryWeight * sequenceWeight * Math.pow(1.36, safeLevel)),
      crystal: Math.floor(120 * categoryWeight * sequenceWeight * Math.pow(1.34, safeLevel)),
      deuterium: Math.floor(90 * categoryWeight * sequenceWeight * Math.pow(1.3, safeLevel)),
    },
    currentBonus: baseBonus * safeLevel,
    nextBonus: baseBonus * (safeLevel + 1),
  };
}
