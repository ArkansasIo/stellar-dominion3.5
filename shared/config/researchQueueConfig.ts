/**
 * Research Queue & Lab System Configuration
 * Manages research queuing, lab capacity, bonuses, and research progression
 * @tag #research #queue #laboratory #bonuses #progression
 */

import type { TechBranch, TechClass } from "./technologyTreeConfig";

// ============================================================================
// RESEARCH LAB TYPES & INTERFACES
// ============================================================================

export type LabType = "standard" | "advanced" | "elite" | "ancient" | "megastructure";
export type LabSpecialization = TechBranch | "general" | "hybrid";
export type ResearchPriority = "low" | "normal" | "high" | "critical";
export type QueueStatus = "queued" | "researching" | "paused" | "completed" | "failed" | "cancelled";

export interface ResearchLabConfig {
  // Lab Identity
  id: string;
  name: string;
  type: LabType;
  specialization: LabSpecialization;
  level: number;
  tier: number;

  // Capacity & Slots
  maxQueueSlots: number;      // How many techs can be queued
  activeSlots: number;        // Currently active research slots
  parallelResearchSlots: number; // Can research multiple at once

  // Performance Modifiers
  researchSpeedMultiplier: number;     // Speed bonus (0-300%)
  costReductionMultiplier: number;     // Cost reduction (0-100%)
  reliabilityMultiplier: number;       // Success rate (0-100%)
  experimentalTechChance: number;      // Chance to discover new tech

  // Bonuses Applied to This Lab
  branchBonuses: {
    [branch in TechBranch]?: number;   // Branch-specific speed bonus
  };
  classBonuses: {
    [cls in TechClass]?: number;       // Class-specific speed bonus
  };

  // Resource Requirements
  maintenanceCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
  };
  upkeepPerTurn: number;

  // Special Abilities
  canResearchExperimental: boolean;
  canSplitResearch: boolean;           // Can divide research between branches
  canStorageResearch: boolean;         // Queue research for later
  canAccelerateResearch: boolean;      // Speed up with resources

  // Cool-down & Durability
  researchCooldown: number;            // Turns between research completions
  durabilityMax: number;               // Max durability
  durabilityLossPerResearch: number;   // Durability loss per research
  estimatedCooldown: number;           // Est. turns to next research

  description: string;
}

export interface ResearchQueuedItem {
  // Queue Entry
  id: string;
  queuePosition: number;
  enqueuedAt: number;       // Timestamp
  status: QueueStatus;
  priority: ResearchPriority;

  // Tech Reference
  techId: string;
  techName: string;
  techBranch: TechBranch;
  techLevel: number;

  // Progress
  progressPercent: number;  // 0-100
  turnsRemaining: number;
  turnsElapsed: number;
  totalTurnsRequired: number;

  // Cost Tracking
  costBreakdown: {
    scientists: number;
    resources: {
      metal: number;
      crystal: number;
      deuterium: number;
    };
    baseTime: number;
    adjustedTime: number;    // With bonuses/penalties
  };

  // Modifiers Applied
  speedModifier: number;
  costModifier: number;
  bonusesApplied: string[];  // List of active bonuses

  // Completion Data
  completedAt?: number;
  previousResearchId?: string;  // Research that finished before this
}

export interface ResearchBonus {
  id: string;
  name: string;
  description: string;
  type: "permanent" | "temporary" | "stackable";
  duration: number;           // Turns (0 = permanent)
  appliedAt: number;          // Timestamp

  // Bonus Values
  speedBonus: number;         // % modifier
  costBonus: number;          // % reduction
  reliabilityBonus: number;   // % increase
  capacityBonus: number;      // Additional queue slots

  // Conditional
  affectsBranch?: TechBranch;
  affectsClass?: TechClass;
  affectsType?: string;       // "experimental", "ancient", etc.

  // Stack Rules
  maxStacks: number;
  canRefresh: boolean;
  refreshResets: boolean;     // Does refresh reset duration?
}

export interface ResearchModifier {
  id: string;
  name: string;
  source: "government" | "tech" | "building" | "event" | "achievement" | "commander" | "faction";
  modifier: number;           // Multiplier (1.0 = no change, 1.25 = 25% boost)
  priority: number;           // Higher priority applied last
  affectsBranches: TechBranch[]; // Empty = all branches

  active: boolean;
  reason?: string;
}

// ============================================================================
// LAB TIER PROGRESSION
// ============================================================================

export const LAB_TIERS: { [key in LabType]: ResearchLabConfig[] } = {
  standard: [
    {
      id: "lab-standard-1",
      name: "Basic Research Lab",
      type: "standard",
      specialization: "general",
      level: 1,
      tier: 1,
      maxQueueSlots: 1,
      activeSlots: 1,
      parallelResearchSlots: 1,
      researchSpeedMultiplier: 1.0,
      costReductionMultiplier: 1.0,
      reliabilityMultiplier: 0.9,
      experimentalTechChance: 0,
      branchBonuses: {},
      classBonuses: {},
      maintenanceCost: { metal: 10, crystal: 5, deuterium: 0, energy: 50 },
      upkeepPerTurn: 2,
      canResearchExperimental: false,
      canSplitResearch: false,
      canStorageResearch: false,
      canAccelerateResearch: false,
      durabilityMax: 100,
      durabilityLossPerResearch: 1,
      estimatedCooldown: 0,
      researchCooldown: 0,
      description: "Entry-level research facility. Conducts basic science research."
    },
    {
      id: "lab-standard-2",
      name: "Advanced Research Lab",
      type: "standard",
      specialization: "general",
      level: 2,
      tier: 2,
      maxQueueSlots: 2,
      activeSlots: 2,
      parallelResearchSlots: 1,
      researchSpeedMultiplier: 1.2,
      costReductionMultiplier: 0.95,
      reliabilityMultiplier: 0.95,
      experimentalTechChance: 5,
      branchBonuses: {},
      classBonuses: {},
      maintenanceCost: { metal: 20, crystal: 10, deuterium: 5, energy: 100 },
      upkeepPerTurn: 5,
      canResearchExperimental: true,
      canSplitResearch: false,
      canStorageResearch: true,
      canAccelerateResearch: false,
      durabilityMax: 150,
      durabilityLossPerResearch: 1,
      estimatedCooldown: 0,
      researchCooldown: 0,
      description: "Improved research facility with better techniques and equipment."
    },
  ],

  advanced: [
    {
      id: "lab-advanced-1",
      name: "Specialized Research Lab",
      type: "advanced",
      specialization: "computing",
      level: 3,
      tier: 3,
      maxQueueSlots: 3,
      activeSlots: 2,
      parallelResearchSlots: 2,
      researchSpeedMultiplier: 1.5,
      costReductionMultiplier: 0.85,
      reliabilityMultiplier: 0.98,
      experimentalTechChance: 15,
      branchBonuses: { computing: 1.3 },
      classBonuses: { advanced: 1.2 },
      maintenanceCost: { metal: 50, crystal: 30, deuterium: 20, energy: 200 },
      upkeepPerTurn: 10,
      canResearchExperimental: true,
      canSplitResearch: true,
      canStorageResearch: true,
      canAccelerateResearch: true,
      durabilityMax: 200,
      durabilityLossPerResearch: 0.8,
      estimatedCooldown: 2,
      researchCooldown: 2,
      description: "Specialized facility focused on computing and information technologies."
    },
  ],

  elite: [
    {
      id: "lab-elite-1",
      name: "Elite Research Institute",
      type: "elite",
      specialization: "hybrid",
      level: 5,
      tier: 5,
      maxQueueSlots: 5,
      activeSlots: 3,
      parallelResearchSlots: 3,
      researchSpeedMultiplier: 2.0,
      costReductionMultiplier: 0.7,
      reliabilityMultiplier: 1.0,
      experimentalTechChance: 30,
      branchBonuses: {
        armor: 1.2,
        shields: 1.2,
        weapons: 1.2,
        propulsion: 1.2,
      },
      classBonuses: {
        experimental: 1.3,
        military: 1.2,
      },
      maintenanceCost: { metal: 200, crystal: 150, deuterium: 100, energy: 500 },
      upkeepPerTurn: 25,
      canResearchExperimental: true,
      canSplitResearch: true,
      canStorageResearch: true,
      canAccelerateResearch: true,
      durabilityMax: 300,
      durabilityLossPerResearch: 0.5,
      estimatedCooldown: 0,
      researchCooldown: 1,
      description: "Cutting-edge research institute with advanced equipment and scientists."
    },
  ],

  ancient: [
    {
      id: "lab-ancient-1",
      name: "Ancient Research Archive",
      type: "ancient",
      specialization: "hyperspace",
      level: 8,
      tier: 8,
      maxQueueSlots: 10,
      activeSlots: 5,
      parallelResearchSlots: 5,
      researchSpeedMultiplier: 3.0,
      costReductionMultiplier: 0.5,
      reliabilityMultiplier: 1.05,
      experimentalTechChance: 50,
      branchBonuses: {
        hyperspace: 2.0,
        computing: 1.5,
        power: 1.4,
      },
      classBonuses: {
        ancient: 2.0,
        experimental: 1.5,
        exotic: 1.4,
      },
      maintenanceCost: { metal: 500, crystal: 500, deuterium: 500, energy: 1000 },
      upkeepPerTurn: 50,
      canResearchExperimental: true,
      canSplitResearch: true,
      canStorageResearch: true,
      canAccelerateResearch: true,
      durabilityMax: 500,
      durabilityLossPerResearch: 0.3,
      estimatedCooldown: 0,
      researchCooldown: 0,
      description: "Recovered ancient technology hub with pre-spacefaring knowledge preserved."
    },
  ],

  megastructure: [
    {
      id: "lab-megastructure-1",
      name: "Dyson Research Sphere",
      type: "megastructure",
      specialization: "general",
      level: 12,
      tier: 10,
      maxQueueSlots: 20,
      activeSlots: 10,
      parallelResearchSlots: 10,
      researchSpeedMultiplier: 5.0,
      costReductionMultiplier: 0.3,
      reliabilityMultiplier: 1.1,
      experimentalTechChance: 75,
      branchBonuses: {
        power: 2.0,
        hyperspace: 2.0,
        engineering: 1.8,
        computing: 1.8,
      },
      classBonuses: {
        ancient: 2.5,
        experimental: 2.0,
        exotic: 1.9,
      },
      maintenanceCost: { metal: 10000, crystal: 10000, deuterium: 10000, energy: 50000 },
      upkeepPerTurn: 500,
      canResearchExperimental: true,
      canSplitResearch: true,
      canStorageResearch: true,
      canAccelerateResearch: true,
      durabilityMax: 1000,
      durabilityLossPerResearch: 0.1,
      estimatedCooldown: 0,
      researchCooldown: 0,
      description: "Dyson sphere research station. Harnesses star power for unlimited research potential."
    },
  ],
};

// ============================================================================
// RESEARCH BONUSES (Predefined)
// ============================================================================

export const RESEARCH_BONUSES: ResearchBonus[] = [
  {
    id: "bonus-commander-insight",
    name: "Commander's Insight",
    description: "Commander applies scientific knowledge to research",
    type: "permanent",
    duration: 0,
    appliedAt: 0,
    speedBonus: 0.25,  // 25% faster
    costBonus: 0.1,    // 10% cheaper
    reliabilityBonus: 0.05,
    capacityBonus: 0,
    maxStacks: 1,
    canRefresh: false,
    refreshResets: false,
  },
  {
    id: "bonus-tech-breakthrough",
    name: "Technological Breakthrough",
    description: "Sudden leap in understanding",
    type: "temporary",
    duration: 10,  // 10 turns
    appliedAt: 0,
    speedBonus: 1.0,   // 100% faster
    costBonus: 0.5,    // 50% cheaper
    reliabilityBonus: 0.15,
    capacityBonus: 2,  // 2 extra slots
    maxStacks: 3,
    canRefresh: true,
    refreshResets: true,
  },
  {
    id: "bonus-lab-upgrade",
    name: "Lab Upgrade Complete",
    description: "New equipment installed",
    type: "permanent",
    duration: 0,
    appliedAt: 0,
    speedBonus: 0.15,
    costBonus: 0.2,
    reliabilityBonus: 0.1,
    capacityBonus: 1,
    affectsBranch: "computing",
    maxStacks: 10,
    canRefresh: false,
    refreshResets: false,
  },
  {
    id: "bonus-knowledge-accumulation",
    name: "Knowledge Accumulation",
    description: "Previous research accelerates new research",
    type: "stackable",
    duration: 0,
    appliedAt: 0,
    speedBonus: 0.05,
    costBonus: 0.02,
    reliabilityBonus: 0.02,
    capacityBonus: 0,
    maxStacks: 10,
    canRefresh: true,
    refreshResets: false,
  },
];

// ============================================================================
// RESEARCH PENALTIES (Risk/Failure States)
// ============================================================================

export const RESEARCH_PENALTIES = {
  LAB_OVERWORK: {
    id: "penalty-lab-overwork",
    name: "Lab Overwork",
    description: "Too many simultaneous research projects",
    speedMalus: 0.5,  // -50% speed
    reliabilityMalus: 0.3,  // -30% reliability
    costIncrease: 1.5,  // +50% cost
  },

  EQUIPMENT_FAILURE: {
    id: "penalty-equipment-failure",
    name: "Equipment Failure",
    description: "Lab equipment needs repair",
    speedMalus: 0.8,
    reliabilityMalus: 0.5,
    costIncrease: 0,
    requiredRepair: true,
  },

  SCIENTIST_EXHAUSTION: {
    id: "penalty-scientist-exhaustion",
    name: "Scientist Exhaustion",
    description: "Research team needs rest",
    speedMalus: 0.6,
    reliabilityMalus: 0.4,
    costIncrease: 0,
    requiredRest: true,
  },

  INCOMPATIBLE_RESEARCH: {
    id: "penalty-incompatible",
    name: "Incompatible Research",
    description: "This tech conflicts with active research",
    speedMalus: 0,
    reliabilityMalus: 1.0,  // 100% failure rate
    costIncrease: 0,
    blockQueueing: true,
  },
};

// ============================================================================
// RESEARCH ACCELERATION SYSTEM
// ============================================================================

export const RESEARCH_ACCELERATION = {
  // Cost multipliers for speeding up research
  SPEEDUP_MULTIPLIERS: {
    "25_percent": { costMultiplier: 1.5, speedup: 0.25 },     // 25% faster = 1.5x cost
    "50_percent": { costMultiplier: 3.0, speedup: 0.50 },     // 50% faster = 3x cost
    "75_percent": { costMultiplier: 6.0, speedup: 0.75 },     // 75% faster = 6x cost
    "instant": { costMultiplier: 10.0, speedup: 1.0 },        // Instant = 10x cost
  },

  // Resource costs per turn of speedup
  RESOURCE_COSTS_PER_SPEEDUP: {
    deuterium: 100,
    energy: 500,
    credits: 1000,
  },

  // Can only speedup near completion
  MINIMUM_TIME_REMAINING: 2,  // Turns
  
  // Max speedup attempts per tech
  MAX_SPEEDUPS_PER_TECH: 5,
};

// ============================================================================
// RESEARCH FAILURE & RETRY MECHANICS
// ============================================================================

export const RESEARCH_FAILURE = {
  // Base failure rates by class
  BASE_FAILURE_RATES: {
    basic: 0.02,        // 2%
    standard: 0.05,     // 5%
    advanced: 0.10,     // 10%
    military: 0.15,     // 15%
    experimental: 0.30, // 30%
    ancient: 0.20,      // 20%
    exotic: 0.40,       // 40%
  },

  // Penalties for failed research
  FAILURE_PENALTIES: {
    resourceLoss: 0.5,        // Lose 50% of resources spent
    timeWaste: 0.75,          // Wasted 75% of time
    reliabilityDrop: 0.05,    // Lab reliability drops 5%
  },

  // Retry bonuses (each retry increases success chance)
  RETRY_BONUS: 0.1,  // +10% success per retry
  MAX_RETRIES: 3,

  // Can repeat failed research
  ALLOW_RETRY: true,
};

// ============================================================================
// RESEARCH STORAGE & QUEUING
// ============================================================================

export const RESEARCH_QUEUE_RULES = {
  // Can research be put in queue without completion
  ALLOW_QUEUE_STORAGE: true,
  
  // Storage cost per queued item per turn
  STORAGE_COST_MULTIPLIER: 0.1,
  
  // Max items in queue at once
  MAX_QUEUE_ITEMS: 20,
  
  // Costs are locked when queued
  LOCK_COSTS_ON_QUEUE: true,
  
  // Re-ordering rules
  ALLOW_QUEUE_REORDER: true,
  REORDER_COST: 0.05,  // 5% of research cost
  
  // Queue priorities
  PRIORITY_MULTIPLIERS: {
    low: 0.8,      // Slower
    normal: 1.0,   // Normal speed
    high: 1.5,     // 50% faster
    critical: 2.5, // 150% faster but higher cost
  },
};

// ============================================================================
// GOVERNMENT & FACTION RESEARCH BONUSES
// ============================================================================

export const GOVERNMENT_RESEARCH_BONUSES = {
  DEMOCRACY: {
    speedBonus: 0.1,
    costReduction: 0.05,
    experimentalChance: 0.05,
    description: "Public funding of research"
  },

  AUTOCRACY: {
    speedBonus: 0.2,
    costReduction: 0,
    experimentalChance: 0.1,
    description: "Dictated research priorities"
  },

  THEOCRACY: {
    speedBonus: 0.05,
    costReduction: 0.15,
    experimentalChance: 0,
    description: "Traditional knowledge"
  },

  CORPORATE: {
    speedBonus: 0,
    costReduction: 0.25,
    experimentalChance: 0.15,
    description: "Efficient industrial research"
  },

  REBELLION: {
    speedBonus: 0.15,
    costReduction: 0.1,
    experimentalChance: 0.2,
    description: "Untested revolutionary methods"
  },
};

// ============================================================================
// RESEARCH DISCOVERY & ACHIEVEMENT BONUSES
// ============================================================================

export const DISCOVERY_BONUSES = {
  FIRST_DISCOVERY: {
    speedBonus: 0,
    costReduction: 0,
    discoveryBonusPercent: 0.25,  // 25% experience bonus
    uniqueRewardChance: 0.1,       // 10% chance for unique reward
  },

  SPEEDRUNNER: {
    description: "Complete research faster than average",
    speedBonus: 0.15,
    costReduction: 0.1,
  },

  OVERACHIEVER: {
    description: "Complete 10 research in a row on priority",
    speedBonus: 0.25,
    capacityBonus: 2,
  },

  RESEARCHER: {
    description: "Complete 50 total research projects",
    speedBonus: 0.1,
    costReduction: 0.1,
  },
};
