import { GameEvent } from "./gameContext";

export type GovernmentId = "democracy" | "monarchy" | "technocracy" | "junta" | "corporate" | "theocracy" | "anarchy" | "oligarchy" | "federation" | "dictatorship";

export interface GovernmentPolicy {
  id: string;
  name: string;
  description: string;
  effectDescription: string;
  isActive: boolean;
}

export interface GovernmentType {
  id: GovernmentId;
  name: string;
  description: string;
  rulerTitle: string; // e.g., President, King, CEO
  bonuses: string[];
  penalties: string[];
  baseStats: {
    stability: number;
    efficiency: number;
    military: number;
  };
}

export interface GovernmentState {
  type: GovernmentId;
  policies: string[]; // IDs of active policies
  stats: {
    stability: number;       // 0-100: Affects all production
    publicSupport: number;   // 0-100: Affects stability drift
    efficiency: number;      // 0-100: Affects build speed
    militaryReadiness: number; // 0-100: Affects ship build speed/combat
    corruption: number;      // 0-100: Reduces resource income
  };
  taxRate: number; // 0-100%
}

export const GOVERNMENTS: Record<GovernmentId, GovernmentType> = {
  democracy: {
    id: "democracy",
    name: "Federal Democracy",
    description: "A representative government where power is derived from the consent of the governed.",
    rulerTitle: "President",
    bonuses: ["+10% Public Support", "+10% Research Speed (Free Thought)"],
    penalties: ["-10% Decision Speed (Bureaucracy)", "-5% Stability (Political Dissent)"],
    baseStats: { stability: 60, efficiency: 50, military: 40 }
  },
  monarchy: {
    id: "monarchy",
    name: "Imperial Monarchy",
    description: "Absolute power vested in a hereditary sovereign.",
    rulerTitle: "Emperor/Empress",
    bonuses: ["+20% Stability (Tradition)", "+10% Fleet Capacity"],
    penalties: ["-10% Research Speed", "High Corruption Risk"],
    baseStats: { stability: 80, efficiency: 60, military: 60 }
  },
  technocracy: {
    id: "technocracy",
    name: "Science Directorate",
    description: "Rule by experts, scientists, and engineers.",
    rulerTitle: "Director General",
    bonuses: ["+25% Research Speed", "+15% Robot Build Speed"],
    penalties: ["-20% Public Support", "Expensive Maintenance"],
    baseStats: { stability: 50, efficiency: 90, military: 30 }
  },
  junta: {
    id: "junta",
    name: "Military Junta",
    description: "A committee of military leaders controls the state.",
    rulerTitle: "High Marshall",
    bonuses: ["+20% Ship Build Speed", "+10% Weapon Damage"],
    penalties: ["-30% Resource Production (War Economy)", "Low Civil Liberties"],
    baseStats: { stability: 40, efficiency: 70, military: 100 }
  },
  corporate: {
    id: "corporate",
    name: "Mega-Corporation",
    description: "The state is run as a business with shareholders.",
    rulerTitle: "CEO",
    bonuses: ["+30% Resource Production", "+20% Trade Revenue"],
    penalties: ["-10% Military Morale", "High Corruption"],
    baseStats: { stability: 50, efficiency: 80, military: 20 }
  },
  theocracy: {
    id: "theocracy",
    name: "Holy Synod",
    description: "Religious leaders guide the spiritual and political life.",
    rulerTitle: "High Priest/Priestess",
    bonuses: ["+20% Stability (Faith)", "+10% Defense Strength (Fanaticism)"],
    penalties: ["-30% Research Speed", "Xenophobic Relations"],
    baseStats: { stability: 90, efficiency: 40, military: 50 }
  },
  anarchy: {
    id: "anarchy",
    name: "Anarchist Collective",
    description: "No formal government. Cells operate independently with shared values.",
    rulerTitle: "Chief Coordinator",
    bonuses: ["+40% Individual Initiative", "+20% Rebellion Efficiency"],
    penalties: ["-50% Coordination Penalty", "-30% Stability"],
    baseStats: { stability: 20, efficiency: 40, military: 30 }
  },
  oligarchy: {
    id: "oligarchy",
    name: "Oligarchic Council",
    description: "Power held by a small group of wealthy families or entities.",
    rulerTitle: "Council Head",
    bonuses: ["+15% Economic Growth", "+10% Fleet Favors"],
    penalties: ["-15% Public Happiness", "-10% Research"],
    baseStats: { stability: 65, efficiency: 60, military: 55 }
  },
  federation: {
    id: "federation",
    name: "Interstellar Federation",
    description: "Loose alliance of independent systems maintaining autonomy.",
    rulerTitle: "Federal President",
    bonuses: ["+20% Alliance Bonuses", "+15% Trade Network"],
    penalties: ["-10% Central Authority", "-5% Decision Speed"],
    baseStats: { stability: 70, efficiency: 55, military: 65 }
  },
  dictatorship: {
    id: "dictatorship",
    name: "Authoritarian Dictatorship",
    description: "Single leader with absolute power and no checks on authority.",
    rulerTitle: "Dictator",
    bonuses: ["+30% Decision Speed", "+25% Military Loyalty"],
    penalties: ["-40% Public Support", "-20% Scientific Innovation"],
    baseStats: { stability: 40, efficiency: 75, military: 90 }
  }
};

export const POLICIES: GovernmentPolicy[] = [
  { id: "martial_law", name: "Martial Law", description: "Strict military control.", effectDescription: "+20 Military, -30 Support", isActive: false },
  { id: "free_trade", name: "Free Trade Agreements", description: "Open borders for commerce.", effectDescription: "+10 Efficiency, -5 Stability", isActive: false },
  { id: "propaganda", name: "State Propaganda", description: "Control the narrative.", effectDescription: "+15 Support, -10 Efficiency", isActive: false },
  { id: "austerity", name: "Austerity Measures", description: "Cut government spending.", effectDescription: "+20 Efficiency, -20 Support", isActive: false },
  { id: "forced_labor", name: "Mandatory Labor", description: "Citizens must work.", effectDescription: "+20 Production, -50 Support", isActive: false },
  { id: "universal_care", name: "Universal Healthcare", description: "State funded health.", effectDescription: "+20 Support, -10 Efficiency", isActive: false },
];
