/**
 * AIC (Artificial Intelligence Command) Plan System
 * Strategic plans and operations formulated by the AIC
 * @tag #aic #plan #strategy #operation
 */

import type { UniverseAuthorityTier } from './universeAuthorityConfig';
import type { AICReportCategory } from './aicReportConfig';

// ============================================================================
// TYPES
// ============================================================================

export type AICPlanCategory =
  | 'offensive'
  | 'defensive'
  | 'expansion'
  | 'economic'
  | 'research'
  | 'diplomatic'
  | 'covert'
  | 'contingency';

export type AICPlanPhase =
  | 'conception'
  | 'planning'
  | 'preparation'
  | 'execution'
  | 'monitoring'
  | 'review'
  | 'completed'
  | 'aborted';

export type AICPlanPriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'critical'
  | 'paramount';

export type AICPlanOutcome =
  | 'pending'
  | 'success'
  | 'partial_success'
  | 'failure'
  | 'mixed'
  | 'inconclusive';

// ============================================================================
// INTERFACES
// ============================================================================

export interface AICPlanPhaseConfig {
  phase: AICPlanPhase;
  name: string;
  description: string;
  order: number;
  canProgress: boolean;
  canAbort: boolean;
  estimatedDurationRatio: number; // percentage of total plan time
  resourceCostMultiplier: number;
}

export interface AICPlanObjective {
  id: string;
  description: string;
  type: AICReportCategory;
  targetValue: number;
  currentValue: number;
  weight: number; // importance to plan completion
  completed: boolean;
}

export interface AICPlanResourceAllocation {
  credits: number;
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  fleetPower: number;
  influence: number;
  estimatedDuration: number; // minutes
}

export interface AICPlanRiskAssessment {
  overallRisk: number; // 0-1
  militaryRisk: number;
  economicRisk: number;
  diplomaticRisk: number;
  detectionRisk: number;
  failureImpact: string;
  mitigationStrategies: readonly string[];
}

export interface AICPlanStep {
  id: string;
  order: number;
  description: string;
  phase: AICPlanPhase;
  durationMinutes: number;
  requiredResources: Partial<AICPlanResourceAllocation>;
  dependencies: readonly string[]; // step ids
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
}

export interface AICPlan {
  id: string;
  name: string;
  category: AICPlanCategory;
  priority: AICPlanPriority;
  phase: AICPlanPhase;
  objectives: readonly AICPlanObjective[];
  steps: readonly AICPlanStep[];
  resourceAllocation: AICPlanResourceAllocation;
  riskAssessment: AICPlanRiskAssessment;
  requiredAuthorityTier: UniverseAuthorityTier;
  prerequisites: readonly string[];
  outcome: AICPlanOutcome;
  createdTimestamp: number;
  startedTimestamp?: number;
  completedTimestamp?: number;
  progress: number; // 0-100
  generatedFromReport?: string; // report id that triggered this plan
  tags: readonly string[];
}

// ============================================================================
// PLAN CATEGORY CONFIGURATION
// ============================================================================

export interface AICPlanCategoryConfig {
  category: AICPlanCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  baseDurationMinutes: number;
  maxConcurrentPlans: number;
  defaultPriority: AICPlanPriority;
  requiredAuthorityTier: UniverseAuthorityTier;
}

export const AIC_PLAN_CATEGORIES: readonly AICPlanCategoryConfig[] = [
  {
    category: 'offensive',
    name: 'Offensive Operation',
    description: 'Military campaigns and strikes against enemy targets',
    icon: '⚔️',
    color: '#dc2626',
    baseDurationMinutes: 180,
    maxConcurrentPlans: 3,
    defaultPriority: 'high',
    requiredAuthorityTier: 2,
  },
  {
    category: 'defensive',
    name: 'Defensive Strategy',
    description: 'Protection of territory, assets, and borders',
    icon: '🛡️',
    color: '#2563eb',
    baseDurationMinutes: 120,
    maxConcurrentPlans: 5,
    defaultPriority: 'normal',
    requiredAuthorityTier: 1,
  },
  {
    category: 'expansion',
    name: 'Expansion Initiative',
    description: 'Colonization, territorial growth, and influence spread',
    icon: '🚀',
    color: '#f59e0b',
    baseDurationMinutes: 240,
    maxConcurrentPlans: 2,
    defaultPriority: 'normal',
    requiredAuthorityTier: 1,
  },
  {
    category: 'economic',
    name: 'Economic Development',
    description: 'Resource optimization, trade expansion, and wealth generation',
    icon: '💰',
    color: '#22c55e',
    baseDurationMinutes: 180,
    maxConcurrentPlans: 4,
    defaultPriority: 'normal',
    requiredAuthorityTier: 1,
  },
  {
    category: 'research',
    name: 'Research Program',
    description: 'Technology development, discovery initiatives, and scientific breakthroughs',
    icon: '🔬',
    color: '#06b6d4',
    baseDurationMinutes: 360,
    maxConcurrentPlans: 2,
    defaultPriority: 'normal',
    requiredAuthorityTier: 1,
  },
  {
    category: 'diplomatic',
    name: 'Diplomatic Mission',
    description: 'Alliance building, treaty negotiation, and diplomatic engagement',
    icon: '🤝',
    color: '#3b82f6',
    baseDurationMinutes: 120,
    maxConcurrentPlans: 3,
    defaultPriority: 'low',
    requiredAuthorityTier: 2,
  },
  {
    category: 'covert',
    name: 'Covert Operation',
    description: 'Espionage, sabotage, infiltration, and clandestine activities',
    icon: '🎭',
    color: '#7c3aed',
    baseDurationMinutes: 240,
    maxConcurrentPlans: 2,
    defaultPriority: 'high',
    requiredAuthorityTier: 3,
  },
  {
    category: 'contingency',
    name: 'Contingency Protocol',
    description: 'Emergency response, disaster recovery, and crisis management',
    icon: '⚠️',
    color: '#ef4444',
    baseDurationMinutes: 60,
    maxConcurrentPlans: 1,
    defaultPriority: 'critical',
    requiredAuthorityTier: 1,
  },
];

// ============================================================================
// PLAN PHASE CONFIGURATION
// ============================================================================

export const AIC_PLAN_PHASES: readonly AICPlanPhaseConfig[] = [
  {
    phase: 'conception',
    name: 'Conception',
    description: 'Initial idea generation and feasibility assessment',
    order: 0,
    canProgress: true,
    canAbort: true,
    estimatedDurationRatio: 0.05,
    resourceCostMultiplier: 0.0,
  },
  {
    phase: 'planning',
    name: 'Planning',
    description: 'Detailed strategy formulation and resource calculation',
    order: 1,
    canProgress: true,
    canAbort: true,
    estimatedDurationRatio: 0.15,
    resourceCostMultiplier: 0.1,
  },
  {
    phase: 'preparation',
    name: 'Preparation',
    description: 'Resource gathering, asset positioning, and readiness checks',
    order: 2,
    canProgress: true,
    canAbort: true,
    estimatedDurationRatio: 0.25,
    resourceCostMultiplier: 0.3,
  },
  {
    phase: 'execution',
    name: 'Execution',
    description: 'Active implementation of the plan objectives',
    order: 3,
    canProgress: true,
    canAbort: false,
    estimatedDurationRatio: 0.35,
    resourceCostMultiplier: 0.4,
  },
  {
    phase: 'monitoring',
    name: 'Monitoring',
    description: 'Ongoing observation and adjustment during execution',
    order: 4,
    canProgress: true,
    canAbort: false,
    estimatedDurationRatio: 0.1,
    resourceCostMultiplier: 0.15,
  },
  {
    phase: 'review',
    name: 'Review',
    description: 'Post-execution analysis and outcome assessment',
    order: 5,
    canProgress: true,
    canAbort: false,
    estimatedDurationRatio: 0.1,
    resourceCostMultiplier: 0.05,
  },
  {
    phase: 'completed',
    name: 'Completed',
    description: 'Plan successfully finished',
    order: 6,
    canProgress: false,
    canAbort: false,
    estimatedDurationRatio: 0.0,
    resourceCostMultiplier: 0.0,
  },
  {
    phase: 'aborted',
    name: 'Aborted',
    description: 'Plan terminated before completion',
    order: 7,
    canProgress: false,
    canAbort: false,
    estimatedDurationRatio: 0.0,
    resourceCostMultiplier: 0.0,
  },
];

// ============================================================================
// PLAN TEMPLATES
// ============================================================================

export interface AICPlanTemplate {
  id: string;
  name: string;
  category: AICPlanCategory;
  description: string;
  defaultPriority: AICPlanPriority;
  requiredAuthorityTier: UniverseAuthorityTier;
  estimatedDurationMinutes: number;
  objectives: readonly Omit<AICPlanObjective, 'id' | 'currentValue' | 'completed'>[];
  suggestedSteps: readonly Omit<AICPlanStep, 'id' | 'status'>[];
  baseResourceCost: Partial<AICPlanResourceAllocation>;
  baseRisk: number; // 0-1
  prerequisites: readonly string[];
  generatedFromCategory?: AICReportCategory;
  tags: readonly string[];
}

export const AIC_PLAN_TEMPLATES: readonly AICPlanTemplate[] = [
  {
    id: 'offensive-strike-force',
    name: 'Strike Force Deployment',
    category: 'offensive',
    description: 'Deploy a strike force to engage and neutralize an enemy fleet or installation',
    defaultPriority: 'high',
    requiredAuthorityTier: 2,
    estimatedDurationMinutes: 180,
    objectives: [
      { description: 'Neutralize enemy fleet presence in target sector', type: 'military', targetValue: 100, weight: 50 },
      { description: 'Minimize own fleet losses', type: 'military', targetValue: 80, weight: 30 },
      { description: 'Establish area denial capability', type: 'strategic', targetValue: 1, weight: 20 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Identify and prioritize targets', phase: 'planning', durationMinutes: 15, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Assemble strike fleet at forward base', phase: 'preparation', durationMinutes: 45, requiredResources: { metal: 50000, crystal: 30000, deuterium: 20000 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Launch strike operation', phase: 'execution', durationMinutes: 60, requiredResources: { deuterium: 15000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Assess battle damage and withdraw', phase: 'monitoring', durationMinutes: 30, requiredResources: {}, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Compile engagement report', phase: 'review', durationMinutes: 30, requiredResources: {}, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 100000, metal: 50000, crystal: 30000, deuterium: 35000, energy: 5000, fleetPower: 5000, influence: 20 },
    baseRisk: 0.6,
    prerequisites: [],
    generatedFromCategory: 'threat',
    tags: ['offensive', 'military', 'fleets'],
  },
  {
    id: 'defensive-fortification',
    name: 'Fortification Protocol',
    category: 'defensive',
    description: 'Strengthen defensive installations and fleet positioning in key sectors',
    defaultPriority: 'normal',
    requiredAuthorityTier: 1,
    estimatedDurationMinutes: 120,
    objectives: [
      { description: 'Upgrade defensive structures in target sector', type: 'military', targetValue: 100, weight: 40 },
      { description: 'Position defensive fleet assets', type: 'military', targetValue: 1, weight: 30 },
      { description: 'Achieve target defense rating', type: 'strategic', targetValue: 85, weight: 30 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Assess current defensive capabilities', phase: 'planning', durationMinutes: 15, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Allocate resources for fortification', phase: 'preparation', durationMinutes: 30, requiredResources: { metal: 30000, crystal: 15000 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Construct and upgrade defenses', phase: 'execution', durationMinutes: 45, requiredResources: { metal: 30000, crystal: 15000, energy: 2000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Deploy defensive fleet patrols', phase: 'execution', durationMinutes: 15, requiredResources: { deuterium: 5000 }, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Verify defensive readiness', phase: 'review', durationMinutes: 15, requiredResources: {}, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 50000, metal: 30000, crystal: 15000, deuterium: 5000, energy: 2000, fleetPower: 2000, influence: 10 },
    baseRisk: 0.2,
    prerequisites: [],
    generatedFromCategory: 'threat',
    tags: ['defensive', 'fortification', 'military'],
  },
  {
    id: 'expansion-colony-establishment',
    name: 'Colony Establishment',
    category: 'expansion',
    description: 'Establish a new colony on a suitable world to expand territorial control',
    defaultPriority: 'normal',
    requiredAuthorityTier: 1,
    estimatedDurationMinutes: 240,
    objectives: [
      { description: 'Establish colony on target world', type: 'expansion', targetValue: 1, weight: 50 },
      { description: 'Secure colony defenses', type: 'military', targetValue: 50, weight: 20 },
      { description: 'Achieve resource self-sufficiency', type: 'economic', targetValue: 75, weight: 30 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Scout and survey target world', phase: 'planning', durationMinutes: 30, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Prepare colonization fleet', phase: 'preparation', durationMinutes: 60, requiredResources: { credits: 20000, metal: 10000, deuterium: 5000 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Deploy colony ship and establish settlement', phase: 'execution', durationMinutes: 90, requiredResources: { credits: 30000, metal: 15000, crystal: 5000, deuterium: 10000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Construct initial defensive fortifications', phase: 'execution', durationMinutes: 30, requiredResources: { metal: 5000, crystal: 3000 }, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Assess colony viability and report', phase: 'review', durationMinutes: 30, requiredResources: {}, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 50000, metal: 15000, crystal: 5000, deuterium: 15000, energy: 1000, fleetPower: 1000, influence: 15 },
    baseRisk: 0.3,
    prerequisites: ['basic_colonization'],
    generatedFromCategory: 'expansion',
    tags: ['expansion', 'colony', 'territory'],
  },
  {
    id: 'economic-trade-expansion',
    name: 'Trade Network Expansion',
    category: 'economic',
    description: 'Establish and optimize trade routes for maximum economic output',
    defaultPriority: 'normal',
    requiredAuthorityTier: 1,
    estimatedDurationMinutes: 180,
    objectives: [
      { description: 'Establish new trade routes', type: 'economic', targetValue: 5, weight: 40 },
      { description: 'Increase trade income', type: 'economic', targetValue: 100, weight: 40 },
      { description: 'Secure trade route safety', type: 'military', targetValue: 80, weight: 20 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Analyze market opportunities', phase: 'planning', durationMinutes: 20, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Negotiate trade agreements', phase: 'preparation', durationMinutes: 40, requiredResources: { influence: 10 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Deploy trade fleet assets', phase: 'execution', durationMinutes: 60, requiredResources: { credits: 20000, metal: 5000, deuterium: 8000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Establish convoy protection', phase: 'execution', durationMinutes: 30, requiredResources: { fleetPower: 500 }, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Optimize routes and report', phase: 'review', durationMinutes: 30, requiredResources: {}, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 30000, metal: 5000, crystal: 3000, deuterium: 8000, fleetPower: 500, influence: 10 },
    baseRisk: 0.15,
    prerequisites: ['basic_trade'],
    generatedFromCategory: 'economic',
    tags: ['economic', 'trade', 'commerce'],
  },
  {
    id: 'research-accelerated-program',
    name: 'Accelerated Research Program',
    category: 'research',
    description: 'Focus research efforts on a specific technology branch for rapid advancement',
    defaultPriority: 'normal',
    requiredAuthorityTier: 1,
    estimatedDurationMinutes: 360,
    objectives: [
      { description: 'Complete technology research milestone', type: 'research', targetValue: 1, weight: 60 },
      { description: 'Achieve tech tree advancement', type: 'research', targetValue: 3, weight: 25 },
      { description: 'Maintain research efficiency', type: 'economic', targetValue: 90, weight: 15 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Select research focus and allocate labs', phase: 'planning', durationMinutes: 30, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Reallocate resources and scientists', phase: 'preparation', durationMinutes: 60, requiredResources: { credits: 20000, influence: 5 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Conduct focused research', phase: 'execution', durationMinutes: 180, requiredResources: { credits: 50000, crystal: 10000, energy: 3000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Analyze research data and iterate', phase: 'monitoring', durationMinutes: 60, requiredResources: {}, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Document findings and apply discoveries', phase: 'review', durationMinutes: 30, requiredResources: {}, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 70000, crystal: 10000, energy: 3000, influence: 5 },
    baseRisk: 0.1,
    prerequisites: ['research_network'],
    generatedFromCategory: 'research',
    tags: ['research', 'technology', 'science'],
  },
  {
    id: 'diplomatic-alliance-formation',
    name: 'Alliance Formation',
    category: 'diplomatic',
    description: 'Engage foreign powers to form alliances, pacts, and cooperative agreements',
    defaultPriority: 'low',
    requiredAuthorityTier: 2,
    estimatedDurationMinutes: 120,
    objectives: [
      { description: 'Improve relations with target faction', type: 'diplomatic', targetValue: 50, weight: 40 },
      { description: 'Secure diplomatic agreement', type: 'diplomatic', targetValue: 1, weight: 40 },
      { description: 'Establish communication channels', type: 'diplomatic', targetValue: 1, weight: 20 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Analyze target diplomatic stance', phase: 'planning', durationMinutes: 15, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Prepare diplomatic envoy', phase: 'preparation', durationMinutes: 30, requiredResources: { credits: 10000, influence: 15 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Dispatch diplomatic mission', phase: 'execution', durationMinutes: 45, requiredResources: { credits: 15000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Negotiate terms and finalize', phase: 'execution', durationMinutes: 15, requiredResources: { influence: 5 }, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Report diplomatic outcome', phase: 'review', durationMinutes: 15, requiredResources: {}, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 25000, influence: 20 },
    baseRisk: 0.25,
    prerequisites: ['diplomatic_corps'],
    generatedFromCategory: 'diplomatic',
    tags: ['diplomatic', 'alliance', 'relations'],
  },
  {
    id: 'covert-infiltration',
    name: 'Covert Infiltration',
    category: 'covert',
    description: 'Infiltrate enemy infrastructure to gather intelligence or prepare sabotage',
    defaultPriority: 'high',
    requiredAuthorityTier: 3,
    estimatedDurationMinutes: 240,
    objectives: [
      { description: 'Establish spy network in target territory', type: 'intel', targetValue: 1, weight: 30 },
      { description: 'Gather intelligence on enemy capabilities', type: 'intel', targetValue: 75, weight: 40 },
      { description: 'Avoid detection', type: 'intel', targetValue: 90, weight: 30 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Identify infiltration targets and methods', phase: 'planning', durationMinutes: 30, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Prepare covert assets and cover identities', phase: 'preparation', durationMinutes: 60, requiredResources: { credits: 25000, influence: 20 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Deploy infiltration team', phase: 'execution', durationMinutes: 90, requiredResources: { credits: 30000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Gather intelligence and report', phase: 'monitoring', durationMinutes: 30, requiredResources: {}, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Extract assets and assess intelligence value', phase: 'review', durationMinutes: 30, requiredResources: { credits: 10000 }, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 65000, influence: 20, fleetPower: 200 },
    baseRisk: 0.7,
    prerequisites: ['spy_network'],
    generatedFromCategory: 'intel',
    tags: ['covert', 'espionage', 'infiltration', 'intelligence'],
  },
  {
    id: 'contingency-crisis-response',
    name: 'Crisis Response Protocol',
    category: 'contingency',
    description: 'Emergency plan to respond to unexpected threats or disasters affecting the empire',
    defaultPriority: 'critical',
    requiredAuthorityTier: 1,
    estimatedDurationMinutes: 60,
    objectives: [
      { description: 'Contain immediate threat', type: 'threat', targetValue: 100, weight: 50 },
      { description: 'Protect critical infrastructure', type: 'strategic', targetValue: 90, weight: 30 },
      { description: 'Restore normal operations', type: 'strategic', targetValue: 80, weight: 20 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Assess crisis scope and impact', phase: 'conception', durationMinutes: 5, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Mobilize emergency response assets', phase: 'preparation', durationMinutes: 10, requiredResources: { credits: 10000, deuterium: 5000, fleetPower: 1000 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Execute crisis containment', phase: 'execution', durationMinutes: 25, requiredResources: { credits: 20000, fleetPower: 2000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Monitor and adjust response', phase: 'monitoring', durationMinutes: 10, requiredResources: {}, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Assess damage and plan recovery', phase: 'review', durationMinutes: 10, requiredResources: {}, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 30000, deuterium: 5000, fleetPower: 1000 },
    baseRisk: 0.5,
    prerequisites: [],
    generatedFromCategory: 'threat',
    tags: ['contingency', 'crisis', 'emergency', 'response'],
  },
  {
    id: 'offensive-campaign',
    name: 'Full-Scale Campaign',
    category: 'offensive',
    description: 'A coordinated multi-front campaign to cripple a rival empire\'s war capability',
    defaultPriority: 'critical',
    requiredAuthorityTier: 5,
    estimatedDurationMinutes: 480,
    objectives: [
      { description: 'Destroy enemy fleet assets', type: 'military', targetValue: 200, weight: 40 },
      { description: 'Capture strategic systems', type: 'strategic', targetValue: 5, weight: 30 },
      { description: 'Disable enemy production capability', type: 'economic', targetValue: 75, weight: 20 },
      { description: 'Minimize collateral empire strain', type: 'internal', targetValue: 60, weight: 10 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Full theater intelligence assessment', phase: 'planning', durationMinutes: 60, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Mass fleet mobilization and staging', phase: 'preparation', durationMinutes: 120, requiredResources: { credits: 200000, metal: 100000, crystal: 50000, deuterium: 80000, fleetPower: 20000, influence: 50 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Primary offensive phase', phase: 'execution', durationMinutes: 120, requiredResources: { deuterium: 50000, fleetPower: 20000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Secondary exploitation phase', phase: 'execution', durationMinutes: 90, requiredResources: { deuterium: 30000, fleetPower: 10000 }, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Secure captured territory', phase: 'execution', durationMinutes: 60, requiredResources: { metal: 50000, fleetPower: 5000 }, dependencies: ['step-4'], status: 'pending' },
      { order: 6, description: 'Campaign assessment and demobilization', phase: 'review', durationMinutes: 30, requiredResources: {}, dependencies: ['step-5'], status: 'pending' },
    ],
    baseResourceCost: { credits: 300000, metal: 100000, crystal: 50000, deuterium: 130000, energy: 20000, fleetPower: 20000, influence: 50 },
    baseRisk: 0.8,
    prerequisites: ['dreadnought_fleet', 'starbase_network'],
    generatedFromCategory: 'strategic',
    tags: ['offensive', 'campaign', 'military', 'war'],
  },
  {
    id: 'expansion-territorial-claim',
    name: 'Territorial Claim Campaign',
    category: 'expansion',
    description: 'Systematic expansion into unclaimed or contested space to secure resources and strategic positions',
    defaultPriority: 'high',
    requiredAuthorityTier: 3,
    estimatedDurationMinutes: 360,
    objectives: [
      { description: 'Claim target systems', type: 'expansion', targetValue: 10, weight: 40 },
      { description: 'Secure resource-rich areas', type: 'economic', targetValue: 80, weight: 30 },
      { description: 'Establish border defenses', type: 'military', targetValue: 70, weight: 20 },
      { description: 'Minimize diplomatic fallout', type: 'diplomatic', targetValue: 50, weight: 10 },
    ],
    suggestedSteps: [
      { order: 1, description: 'Survey expansion targets and assess claims', phase: 'planning', durationMinutes: 45, requiredResources: {}, dependencies: [], status: 'pending' },
      { order: 2, description: 'Prepare colonization waves and escort fleets', phase: 'preparation', durationMinutes: 90, requiredResources: { credits: 75000, metal: 30000, crystal: 15000, deuterium: 20000, fleetPower: 5000, influence: 15 }, dependencies: [], status: 'pending' },
      { order: 3, description: 'Deploy colonization fleets to target systems', phase: 'execution', durationMinutes: 120, requiredResources: { deuterium: 25000, fleetPower: 5000 }, dependencies: ['step-2'], status: 'pending' },
      { order: 4, description: 'Establish infrastructure and defenses', phase: 'execution', durationMinutes: 60, requiredResources: { metal: 30000, crystal: 15000, energy: 3000 }, dependencies: ['step-3'], status: 'pending' },
      { order: 5, description: 'Territorial consolidation report', phase: 'review', durationMinutes: 45, requiredResources: {}, dependencies: ['step-4'], status: 'pending' },
    ],
    baseResourceCost: { credits: 100000, metal: 30000, crystal: 15000, deuterium: 45000, energy: 3000, fleetPower: 5000, influence: 15 },
    baseRisk: 0.45,
    prerequisites: ['cruiser_fleet', 'basic_trade'],
    generatedFromCategory: 'expansion',
    tags: ['expansion', 'territory', 'colonization', 'claims'],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPlanCategoryConfig(category: AICPlanCategory): AICPlanCategoryConfig | undefined {
  return AIC_PLAN_CATEGORIES.find(c => c.category === category);
}

export function getPlanPhaseConfig(phase: AICPlanPhase): AICPlanPhaseConfig | undefined {
  return AIC_PLAN_PHASES.find(p => p.phase === phase);
}

export function getPlanTemplate(templateId: string): AICPlanTemplate | undefined {
  return AIC_PLAN_TEMPLATES.find(t => t.id === templateId);
}

export function getPlanTemplatesByCategory(category: AICPlanCategory): readonly AICPlanTemplate[] {
  return AIC_PLAN_TEMPLATES.filter(t => t.category === category);
}

export function getPlanTemplatesByAuthorityTier(tier: UniverseAuthorityTier): readonly AICPlanTemplate[] {
  return AIC_PLAN_TEMPLATES.filter(t => t.requiredAuthorityTier <= tier);
}

export function getPlanTemplatesByReportCategory(category: AICReportCategory): readonly AICPlanTemplate[] {
  return AIC_PLAN_TEMPLATES.filter(t => t.generatedFromCategory === category);
}

export function calculatePlanProgress(objectives: readonly AICPlanObjective[], steps: readonly AICPlanStep[]): number {
  let objectiveProgress = 0;
  let stepProgress = 0;

  if (objectives.length > 0) {
    const totalWeight = objectives.reduce((sum, o) => sum + o.weight, 0);
    objectiveProgress = objectives.reduce((sum, o) => {
      const goalRatio = o.targetValue > 0 ? Math.min(o.currentValue / o.targetValue, 1) : 0;
      return sum + (goalRatio * o.weight / totalWeight);
    }, 0) * 50; // 50% weight for objectives
  }

  if (steps.length > 0) {
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    stepProgress = (completedSteps / steps.length) * 50; // 50% weight for steps
  }

  return Math.round(objectiveProgress + stepProgress);
}

export function canExecutePlan(
  plan: AICPlan,
  currentAuthorityTier: UniverseAuthorityTier,
  availableResources: AICPlanResourceAllocation,
): { canExecute: boolean; reason?: string } {
  if (plan.requiredAuthorityTier > currentAuthorityTier) {
    return { canExecute: false, reason: `Requires authority tier ${plan.requiredAuthorityTier} or higher` };
  }

  const required = plan.resourceAllocation;
  if (availableResources.credits < required.credits) {
    return { canExecute: false, reason: `Insufficient credits: need ${required.credits}, have ${availableResources.credits}` };
  }
  if (availableResources.metal < required.metal) {
    return { canExecute: false, reason: `Insufficient metal: need ${required.metal}, have ${availableResources.metal}` };
  }
  if (availableResources.crystal < required.crystal) {
    return { canExecute: false, reason: `Insufficient crystal: need ${required.crystal}, have ${availableResources.crystal}` };
  }
  if (availableResources.deuterium < required.deuterium) {
    return { canExecute: false, reason: `Insufficient deuterium: need ${required.deuterium}, have ${availableResources.deuterium}` };
  }
  if (availableResources.fleetPower < required.fleetPower) {
    return { canExecute: false, reason: `Insufficient fleet power: need ${required.fleetPower}, have ${availableResources.fleetPower}` };
  }

  return { canExecute: true };
}

export function generatePlanId(): string {
  return `aic-plan-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function generateObjectiveId(): string {
  return `obj-${Math.random().toString(36).substring(2, 8)}`;
}

export function generateStepId(planId: string, index: number): string {
  return `${planId}-step-${index}`;
}

export function createPlanFromTemplate(
  templateId: string,
  customName?: string,
  overrideResources?: Partial<AICPlanResourceAllocation>,
): AICPlan | undefined {
  const template = getPlanTemplate(templateId);
  if (!template) return undefined;

  const planId = generatePlanId();
  const now = Date.now();

  const objectives: AICPlanObjective[] = template.objectives.map((o, i) => ({
    id: generateObjectiveId(),
    description: o.description,
    type: o.type,
    targetValue: o.targetValue,
    currentValue: 0,
    weight: o.weight,
    completed: false,
  }));

  const steps: AICPlanStep[] = template.suggestedSteps.map((s, i) => ({
    id: generateStepId(planId, i),
    order: s.order,
    description: s.description,
    phase: s.phase,
    durationMinutes: s.durationMinutes,
    requiredResources: s.requiredResources,
    dependencies: s.dependencies.map((_, j) => generateStepId(planId, j)),
    status: 'pending',
  }));

  const baseResources: AICPlanResourceAllocation = {
    credits: template.baseResourceCost.credits ?? 0,
    metal: template.baseResourceCost.metal ?? 0,
    crystal: template.baseResourceCost.crystal ?? 0,
    deuterium: template.baseResourceCost.deuterium ?? 0,
    energy: template.baseResourceCost.energy ?? 0,
    fleetPower: template.baseResourceCost.fleetPower ?? 0,
    influence: template.baseResourceCost.influence ?? 0,
    estimatedDuration: template.estimatedDurationMinutes,
  };

  const mergedResources: AICPlanResourceAllocation = overrideResources
    ? { ...baseResources, ...overrideResources }
    : baseResources;

  return {
    id: planId,
    name: customName ?? template.name,
    category: template.category,
    priority: template.defaultPriority,
    phase: 'conception',
    objectives,
    steps,
    resourceAllocation: mergedResources,
    riskAssessment: {
      overallRisk: template.baseRisk,
      militaryRisk: Math.min(template.baseRisk + 0.1, 1),
      economicRisk: Math.min(template.baseRisk + 0.05, 1),
      diplomaticRisk: Math.max(template.baseRisk - 0.1, 0),
      detectionRisk: Math.min(template.baseRisk + 0.15, 1),
      failureImpact: `Failure will result in loss of allocated resources and potential strategic setback`,
      mitigationStrategies: [
        'Maintain reserve forces for unexpected developments',
        'Establish fallback positions',
        'Keep alternative communication channels open',
      ],
    },
    requiredAuthorityTier: template.requiredAuthorityTier,
    prerequisites: template.prerequisites,
    outcome: 'pending',
    createdTimestamp: now,
    progress: 0,
    tags: [...template.tags],
  };
}

export function getCategoryForAuthorityTier(tier: UniverseAuthorityTier): AICPlanCategory[] {
  return AIC_PLAN_CATEGORIES
    .filter(c => c.requiredAuthorityTier <= tier)
    .map(c => c.category)
    .sort((a, b) => {
      const aCfg = getPlanCategoryConfig(a);
      const bCfg = getPlanCategoryConfig(b);
      return (bCfg?.maxConcurrentPlans ?? 0) - (aCfg?.maxConcurrentPlans ?? 0);
    });
}
