/**
 * NPC AI Engine - Manages AI decision-making for all 35 NPC races
 * Handles fleet management, diplomacy, economy, expansion, and combat
 * @tag #npc #ai #engine #fleets #diplomacy #economy
 */

import { NPC_RACES, type NPCRace } from '../../shared/config/npcRaces';
import {
  RELATIONSHIP_MATRIX,
  ALLIANCE_BLOCS,
  INITIAL_TREATIES,
  type DiplomaticRelation,
  type DiplomaticStatus,
  type TreatyType,
  type Treaty,
  type DiplomaticEvent,
} from '../../shared/config/raceAlliances';
import { PIRATE_FACTIONS, type PirateFaction } from '../../shared/config/pirateFactions';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AIPersonality =
  | 'aggressive'
  | 'defensive'
  | 'expansionist'
  | 'trader'
  | 'isolationist'
  | 'warmonger'
  | 'peaceful'
  | 'logical'
  | 'cunning';

export type AIStrategy =
  | 'rush'
  | 'turtle'
  | 'balanced'
  | 'economic'
  | 'military'
  | 'technological'
  | 'diplomatic';

export interface Coord {
  galaxy: number;
  sector: number;
  system: number;
}

export interface NPCResources {
  credits: number;
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

export interface AIGoal {
  type:
    | 'expand'
    | 'attack'
    | 'defend'
    | 'trade'
    | 'research'
    | 'build'
    | 'diplomacy'
    | 'patrol'
    | 'retreat';
  priority: number;
  targetId?: string;
  targetLocation?: Coord;
  planetId?: string;
  deadline: number;
  progress: number;
}

export interface FleetMission {
  type: 'attack' | 'defend' | 'escort' | 'patrol' | 'explore' | 'raid' | 'retreat';
  targetId?: string;
  destination: Coord;
  eta: number;
}

export interface NPCFleet {
  id: string;
  name: string;
  ships: Array<{ type: string; count: number; level: number }>;
  totalPower: number;
  location: Coord;
  mission: FleetMission | null;
  fuel: number;
  morale: number;
}

export interface NPCStation {
  id: string;
  name: string;
  type: string;
  level: number;
  location: Coord;
  production: Record<string, number>;
}

export interface NPCColony {
  id: string;
  name: string;
  planetId: string;
  population: number;
  happiness: number;
  production: Record<string, number>;
}

export interface AIPersonalityConfig {
  aggression: number;
  caution: number;
  greed: number;
  honor: number;
  cunning: number;
  expansionDrive: number;
  diplomaticWeight: number;
  militaryWeight: number;
  economicWeight: number;
  researchWeight: number;
  expansionWeight: number;
  investment?: number;
}

export interface NPCState {
  id: string;
  raceId: string;
  name: string;

  galaxy: number;
  sector: number;
  system: number;

  resources: NPCResources;

  fleet: NPCFleet[];
  stations: NPCStation[];
  colonies: NPCColony[];

  relations: Record<string, number>;
  treaties: Treaty[];
  wars: string[];

  personality: AIPersonality;
  strategy: AIStrategy;
  currentGoal: AIGoal | null;
  goalQueue: AIGoal[];

  level: number;
  experience: number;
  threat: number;
  influence: number;

  lastActionTurn: number;
  nextActionTurn: number;
}

export interface ThreatAssessment {
  overallThreat: number;
  militaryThreats: Array<{ raceId: string; power: number; distance: number }>;
  pirateThreats: Array<{ factionId: string; power: number; distance: number }>;
  playerThreat: number;
  weakestNeighbor: string | null;
  strongestNeighbor: string | null;
}

export interface DiplomaticAction {
  type: 'propose_treaty' | 'break_treaty' | 'declare_war' | 'make_peace' | 'improve_relations' | 'worsen_relations';
  targetRaceId: string;
  treatyType?: TreatyType;
  reason: string;
}

export interface EconomicAction {
  type: 'trade' | 'embargo' | 'invest' | 'hoard' | 'spend';
  resources: Partial<NPCResources>;
  targetRaceId?: string;
  reason: string;
}

export interface ExpansionOption {
  targetLocation: Coord;
  planetId?: string;
  score: number;
  reason: string;
}

export interface BattleResult {
  attackerWins: boolean;
  attackerLosses: number;
  defenderLosses: number;
  attackerRemainingPower: number;
  defenderRemainingPower: number;
  experienceGained: { attacker: number; defender: number };
  loot: Partial<NPCResources> | null;
}

export interface ResourceAllocation {
  military: number;
  economy: number;
  research: number;
  diplomacy: number;
  expansion: number;
  reserves: number;
}

export interface NPCAction {
  type:
    | 'fleet_move'
    | 'fleet_attack'
    | 'build_station'
    | 'colonize'
    | 'research'
    | 'trade'
    | 'diplomacy'
    | 'recruit'
    | 'upgrade'
    | 'patrol'
    | 'raid'
    | 'fleet_retreat'
    | 'hoard'
    | 'invest'
    | 'no_action';
  fleetId?: string;
  targetId?: string;
  targetRaceId?: string;
  destination?: Coord;
  location?: Coord;
  stationType?: string;
  planetId?: string;
  colonyName?: string;
  techId?: string;
  partnerId?: string;
  resources?: Partial<NPCResources>;
  reason?: string;
  action?: string;
  ships?: Array<{ type: string; count: number }>;
  upgradeType?: string;
  sectorId?: string;
  targetSystem?: Coord;
}

// ============================================================================
// PERSONALITY CONFIGURATIONS
// ============================================================================

const PERSONALITY_WEIGHTS: Record<AIPersonality, AIPersonalityConfig> = {
  aggressive: {
    aggression: 80,
    caution: 20,
    greed: 50,
    honor: 30,
    cunning: 40,
    expansionDrive: 70,
    diplomaticWeight: 15,
    militaryWeight: 75,
    economicWeight: 30,
    researchWeight: 20,
    expansionWeight: 60,
  },
  defensive: {
    aggression: 20,
    caution: 85,
    greed: 30,
    honor: 50,
    cunning: 45,
    expansionDrive: 30,
    diplomaticWeight: 50,
    militaryWeight: 55,
    economicWeight: 45,
    researchWeight: 40,
    expansionWeight: 25,
  },
  expansionist: {
    aggression: 55,
    caution: 35,
    greed: 60,
    honor: 25,
    cunning: 50,
    expansionDrive: 90,
    diplomaticWeight: 25,
    militaryWeight: 50,
    economicWeight: 40,
    researchWeight: 30,
    expansionWeight: 85,
  },
  trader: {
    aggression: 15,
    caution: 60,
    greed: 85,
    honor: 40,
    cunning: 70,
    expansionDrive: 40,
    diplomaticWeight: 70,
    militaryWeight: 20,
    economicWeight: 85,
    researchWeight: 35,
    expansionWeight: 35,
  },
  isolationist: {
    aggression: 25,
    caution: 80,
    greed: 20,
    honor: 60,
    cunning: 55,
    expansionDrive: 15,
    diplomaticWeight: 30,
    militaryWeight: 35,
    economicWeight: 50,
    researchWeight: 65,
    expansionWeight: 10,
  },
  warmonger: {
    aggression: 95,
    caution: 10,
    greed: 40,
    honor: 20,
    cunning: 35,
    expansionDrive: 80,
    diplomaticWeight: 5,
    militaryWeight: 90,
    economicWeight: 15,
    researchWeight: 15,
    expansionWeight: 70,
  },
  peaceful: {
    aggression: 5,
    caution: 90,
    greed: 25,
    honor: 80,
    cunning: 30,
    expansionDrive: 20,
    diplomaticWeight: 90,
    militaryWeight: 10,
    economicWeight: 60,
    researchWeight: 55,
    expansionWeight: 15,
  },
  logical: {
    aggression: 35,
    caution: 70,
    greed: 30,
    honor: 50,
    cunning: 75,
    expansionDrive: 45,
    diplomaticWeight: 40,
    militaryWeight: 40,
    economicWeight: 55,
    researchWeight: 80,
    expansionWeight: 40,
  },
  cunning: {
    aggression: 45,
    caution: 65,
    greed: 60,
    honor: 20,
    cunning: 90,
    expansionDrive: 50,
    diplomaticWeight: 50,
    militaryWeight: 45,
    economicWeight: 55,
    researchWeight: 45,
    expansionWeight: 45,
  },
};

// ============================================================================
// STRATEGY MODIFIERS
// ============================================================================

const STRATEGY_MODIFIERS: Record<AIStrategy, Partial<AIPersonalityConfig>> = {
  rush: { aggression: 20, caution: -15, expansionDrive: 25, militaryWeight: 25 },
  turtle: { caution: 20, aggression: -15, militaryWeight: 15, economicWeight: 10 },
  balanced: {},
  economic: { greed: 20, economicWeight: 25, militaryWeight: -10, researchWeight: -5 },
  military: { aggression: 15, militaryWeight: 25, economicWeight: -10, researchWeight: -10 },
  technological: { researchWeight: 30, economicWeight: 10, militaryWeight: -15 },
  diplomatic: { diplomaticWeight: 30, aggression: -10, militaryWeight: -10 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function distance(a: Coord, b: Coord): number {
  return Math.sqrt(
    (a.galaxy - b.galaxy) ** 2 +
    (a.sector - b.sector) ** 2 +
    (a.system - b.system) ** 2
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function weightedRandom(weights: number[]): number {
  const total = weights.reduce((sum, w) => sum + Math.max(0, w), 0);
  if (total === 0) return 0;
  let roll = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= Math.max(0, weights[i]);
    if (roll <= 0) return i;
  }
  return weights.length - 1;
}

function getRaceById(raceId: string): NPCRace | undefined {
  return NPC_RACES.find((r) => r.id === raceId);
}

function getBlocForRace(raceId: string): string | null {
  for (const bloc of ALLIANCE_BLOCS) {
    if (bloc.memberRaceIds.includes(raceId)) return bloc.id;
  }
  return null;
}

function areInSameBloc(race1: string, race2: string): boolean {
  const bloc1 = getBlocForRace(race1);
  const bloc2 = getBlocForRace(race2);
  return bloc1 !== null && bloc1 === bloc2;
}

function findRelation(race1: string, race2: string): DiplomaticRelation | undefined {
  return RELATIONSHIP_MATRIX.find(
    (r) =>
      (r.race1Id === race1 && r.race2Id === race2) ||
      (r.race1Id === race2 && r.race2Id === race1)
  );
}

function getDiplomaticStatusScore(status: DiplomaticStatus): number {
  const scores: Record<DiplomaticStatus, number> = {
    allied: 100,
    defensive_pact: 75,
    trade_agreement: 50,
    non_aggression: 25,
    neutral: 0,
    unfriendly: -25,
    hostile: -75,
    vassal: 60,
  };
  return scores[status] || 0;
}

function calculateFleetPower(fleet: NPCFleet): number {
  return fleet.totalPower * (fleet.morale / 100) * (fleet.fuel > 20 ? 1 : 0.5);
}

function getPersonalityConfig(personality: AIPersonality, strategy: AIStrategy): AIPersonalityConfig {
  const base = { ...PERSONALITY_WEIGHTS[personality] };
  const stratMod = STRATEGY_MODIFIERS[strategy];

  for (const key of Object.keys(stratMod) as Array<keyof AIPersonalityConfig>) {
    if (base[key] !== undefined) {
      (base[key] as number) = clamp((base[key] as number) + (stratMod[key] as number), 0, 100);
    }
  }

  return base;
}

// ============================================================================
// NPC STATE CREATION
// ============================================================================

export function createNPCState(raceId: string, location: Coord): NPCState {
  const race = getRaceById(raceId);
  if (!race) throw new Error(`Unknown race: ${raceId}`);

  const relations: Record<string, number> = {};
  for (const rel of RELATIONSHIP_MATRIX) {
    if (rel.race1Id === raceId) {
      relations[rel.race2Id] = rel.strength;
    } else if (rel.race2Id === raceId) {
      relations[rel.race1Id] = rel.strength;
    }
  }

  const treaties = INITIAL_TREATIES.filter((t) => t.parties.includes(raceId));

  const baseFleetPower = race.fleetStrength * 10;
  const fleet: NPCFleet[] = [
    {
      id: generateId('fleet'),
      name: `${race.name} Main Fleet`,
      ships: [
        { type: race.preferredUnits[0] || 'Frigate', count: Math.floor(3 + race.fleetStrength / 20), level: 1 },
        { type: race.preferredUnits[1] || 'Cruiser', count: Math.floor(1 + race.fleetStrength / 30), level: 1 },
      ],
      totalPower: baseFleetPower,
      location: { ...location },
      mission: null,
      fuel: 100,
      morale: 80 + race.bonuses.combat / 5,
    },
  ];

  const stations: NPCStation[] = [
    {
      id: generateId('station'),
      name: `${race.homeworld.name} Defense Station`,
      type: 'defense',
      level: 1,
      location: { ...location },
      production: { energy: 10, defense: 5 },
    },
  ];

  const colonies: NPCColony[] = [
    {
      id: generateId('colony'),
      name: race.homeworld.name,
      planetId: `planet-${raceId}-homeworld`,
      population: 5000 + race.fleetStrength * 50,
      happiness: 75 + race.bonuses.economy / 5,
      production: {
        metal: 20 + race.bonuses.economy / 3,
        crystal: 15 + race.bonuses.research / 5,
        deuterium: 10,
        energy: 25 + race.bonuses.economy / 4,
      },
    },
  ];

  return {
    id: generateId('npc'),
    raceId,
    name: race.name,

    galaxy: location.galaxy,
    sector: location.sector,
    system: location.system,

    resources: {
      credits: 1000 + race.bonuses.economy * 50,
      metal: 500 + race.fleetStrength * 5,
      crystal: 300 + race.bonuses.research * 3,
      deuterium: 200 + race.fleetStrength * 2,
      energy: 400 + race.bonuses.economy * 4,
    },

    fleet,
    stations,
    colonies,

    relations,
    treaties,
    wars: [],

    personality: race.personality as AIPersonality,
    strategy: race.preferredStrategy as AIStrategy,
    currentGoal: null,
    goalQueue: [],

    level: 1,
    experience: 0,
    threat: clamp(race.fleetStrength + race.bonuses.combat, 0, 100),
    influence: clamp(
      race.bonuses.diplomacy + race.bonuses.economy / 2,
      0,
      100
    ),

    lastActionTurn: 0,
    nextActionTurn: 1,
  };
}

// ============================================================================
// NPC AI ENGINE CLASS
// ============================================================================

export class NPCAIEngine {
  private npcs: Map<string, NPCState>;
  private turn: number;
  private allNPCs: NPCState[];

  constructor(initialNPCs: NPCState[]) {
    this.npcs = new Map();
    this.turn = 0;
    this.allNPCs = initialNPCs;

    for (const npc of initialNPCs) {
      this.npcs.set(npc.id, npc);
    }
  }

  getNPC(id: string): NPCState | undefined {
    return this.npcs.get(id);
  }

  getAllNPCs(): NPCState[] {
    return Array.from(this.npcs.values());
  }

  addNPC(npc: NPCState): void {
    this.npcs.set(npc.id, npc);
    this.allNPCs.push(npc);
  }

  removeNPC(id: string): void {
    this.npcs.delete(id);
    this.allNPCs = this.allNPCs.filter((n) => n.id !== id);
  }

  // ==========================================================================
  // MAIN GAME LOOP
  // ==========================================================================

  processTurn(): NPCAction[] {
    this.turn++;
    const actions: NPCAction[] = [];

    for (const npc of this.npcs.values()) {
      if (this.turn < npc.nextActionTurn) continue;

      const npcActions = this.processNPC(npc);
      actions.push(...npcActions);

      npc.lastActionTurn = this.turn;
      npc.nextActionTurn = this.turn + 1 + Math.floor(Math.random() * 2);

      this.updateNPCResources(npc);
      this.updateNPCThreat(npc);
    }

    return actions;
  }

  private processNPC(npc: NPCState): NPCAction[] {
    const actions: NPCAction[] = [];
    const config = getPersonalityConfig(npc.personality, npc.strategy);

    if (!npc.currentGoal || npc.currentGoal.progress >= 100) {
      const goals = this.evaluateGoals(npc);
      const prioritized = this.prioritizeGoals(goals, npc.personality);
      npc.goalQueue = prioritized;

      if (npc.goalQueue.length > 0) {
        npc.currentGoal = npc.goalQueue.shift()!;
        npc.currentGoal.progress = 0;
      }
    }

    if (npc.currentGoal) {
      const action = this.executeGoal(npc, npc.currentGoal);
      if (action) {
        actions.push(action);
      }
    }

    for (const fleet of npc.fleet) {
      if (fleet.mission && this.turn >= fleet.mission.eta) {
        const missionAction = this.completeFleetMission(npc, fleet);
        if (missionAction) actions.push(missionAction);
      }
    }

    if (npc.wars.length > 0 && Math.random() < config.aggression / 100) {
      const patrolAction = this.dispatchDefenseFleet(npc);
      if (patrolAction) actions.push(patrolAction);
    }

    return actions;
  }

  // ==========================================================================
  // DECISION MAKING
  // ==========================================================================

  evaluateGoals(npc: NPCState): AIGoal[] {
    const goals: AIGoal[] = [];
    const config = getPersonalityConfig(npc.personality, npc.strategy);

    const threats = this.evaluateMilitaryThreats(npc);
    if (threats.overallThreat > 50) {
      goals.push({
        type: 'defend',
        priority: threats.overallThreat * (config.caution / 100),
        deadline: this.turn + 3,
        progress: 0,
      });
    }

    if (threats.weakestNeighbor && config.aggression > 40) {
      goals.push({
        type: 'attack',
        priority: config.aggression * (1 - threats.overallThreat / 200),
        targetId: threats.weakestNeighbor,
        deadline: this.turn + 5 + Math.floor(Math.random() * 10),
        progress: 0,
      });
    }

    const expansionOptions = this.evaluateExpansionOptions(npc);
    if (expansionOptions.length > 0) {
      const best = expansionOptions.reduce((a, b) => (a.score > b.score ? a : b));
      goals.push({
        type: 'expand',
        priority: config.expansionDrive * (best.score / 100),
        targetLocation: best.targetLocation,
        planetId: best.planetId,
        deadline: this.turn + 8,
        progress: 0,
      });
    }

    const econOptions = this.evaluateEconomicOptions(npc);
    for (const opt of econOptions.slice(0, 2)) {
      goals.push({
        type: 'trade',
        priority: config.greed / 2 + config.economicWeight / 4,
        targetId: opt.targetRaceId,
        deadline: this.turn + 4,
        progress: 0,
      });
    }

    const dipOptions = this.evaluateDiplomaticOptions(npc);
    for (const opt of dipOptions.slice(0, 2)) {
      goals.push({
        type: 'diplomacy',
        priority: config.diplomaticWeight * 0.8,
        targetId: opt.targetRaceId,
        deadline: this.turn + 3,
        progress: 0,
      });
    }

    if (npc.fleet.some((f) => f.fuel < 30 || f.morale < 40)) {
      goals.push({
        type: 'retreat',
        priority: 60,
        deadline: this.turn + 2,
        progress: 0,
      });
    }

    if (npc.fleet.length > 0 && npc.resources.metal > 200 && npc.resources.credits > 500) {
      goals.push({
        type: 'build',
        priority: config.economicWeight / 3,
        deadline: this.turn + 6,
        progress: 0,
      });
    }

    const freeFleets = npc.fleet.filter((f) => !f.mission);
    if (freeFleets.length > 0 && npc.wars.length === 0) {
      goals.push({
        type: 'patrol',
        priority: config.caution / 4,
        deadline: this.turn + 4,
        progress: 0,
      });
    }

    if (npc.resources.crystal > 50 && npc.resources.credits > 200) {
      goals.push({
        type: 'research',
        priority: config.researchWeight / 2,
        deadline: this.turn + 10,
        progress: 0,
      });
    }

    return goals;
  }

  prioritizeGoals(goals: AIGoal[], personality: AIPersonality): AIGoal[] {
    return [...goals].sort((a, b) => {
      const deadlinePenaltyA = Math.max(0, (a.deadline - this.turn) * 0.5);
      const deadlinePenaltyB = Math.max(0, (b.deadline - this.turn) * 0.5);

      const adjustedPriorityA = a.priority - deadlinePenaltyA;
      const adjustedPriorityB = b.priority - deadlinePenaltyB;

      return adjustedPriorityB - adjustedPriorityA;
    });
  }

  executeGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    switch (goal.type) {
      case 'attack':
        return this.executeAttackGoal(npc, goal);
      case 'defend':
        return this.executeDefendGoal(npc, goal);
      case 'expand':
        return this.executeExpandGoal(npc, goal);
      case 'trade':
        return this.executeTradeGoal(npc, goal);
      case 'diplomacy':
        return this.executeDiplomacyGoal(npc, goal);
      case 'build':
        return this.executeBuildGoal(npc, goal);
      case 'patrol':
        return this.executePatrolGoal(npc, goal);
      case 'retreat':
        return this.executeRetreatGoal(npc, goal);
      case 'research':
        return this.executeResearchGoal(npc, goal);
      default:
        return null;
    }
  }

  private executeAttackGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    if (!goal.targetId) return null;

    const targetNPC = this.npcs.get(goal.targetId);
    if (!targetNPC) return null;

    const freeFleets = npc.fleet.filter((f) => !f.mission);
    if (freeFleets.length === 0) return null;

    const bestFleet = freeFleets.reduce((a, b) =>
      calculateFleetPower(a) > calculateFleetPower(b) ? a : b
    );

    const targetPower = targetNPC.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);
    const ourPower = calculateFleetPower(bestFleet);

    if (ourPower < targetPower * 0.7) {
      return null;
    }

    goal.progress = 30;

    return {
      type: 'fleet_attack',
      fleetId: bestFleet.id,
      targetId: goal.targetId,
      destination: { galaxy: targetNPC.galaxy, sector: targetNPC.sector, system: targetNPC.system },
    };
  }

  private executeDefendGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    const threats = this.evaluateMilitaryThreats(npc);
    if (threats.overallThreat < 20) {
      goal.progress = 100;
      return null;
    }

    const freeFleets = npc.fleet.filter((f) => !f.mission);
    if (freeFleets.length === 0) return null;

    const fleet = freeFleets[0];
    const threatsByPower = [...threats.militaryThreats].sort((a, b) => b.power - a.power);

    if (threatsByPower.length > 0) {
      goal.progress = 50;
      return {
        type: 'fleet_move',
        fleetId: fleet.id,
        destination: { galaxy: npc.galaxy, sector: npc.sector, system: npc.system },
      };
    }

    goal.progress = 80;
    return null;
  }

  private executeExpandGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    if (!goal.targetLocation) return null;

    if (npc.resources.credits < 500 || npc.resources.metal < 200) {
      goal.progress = 10;
      return null;
    }

    goal.progress = 60;

    return {
      type: 'colonize',
      planetId: goal.planetId || `planet-new-${npc.id}-${this.turn}`,
      colonyName: `${npc.name} Colony ${this.turn}`,
    };
  }

  private executeTradeGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    if (!goal.targetId) return null;

    const relation = npc.relations[goal.targetId] || 0;
    if (relation < -30) {
      goal.progress = 100;
      return null;
    }

    const totalResources = npc.resources.metal + npc.resources.crystal + npc.resources.deuterium;
    const tradeAmount = Math.floor(totalResources * 0.1);

    if (tradeAmount < 10) {
      goal.progress = 100;
      return null;
    }

    goal.progress = 70;

    return {
      type: 'trade',
      partnerId: goal.targetId,
      resources: {
        metal: Math.floor(tradeAmount * 0.4),
        crystal: Math.floor(tradeAmount * 0.3),
        deuterium: Math.floor(tradeAmount * 0.3),
      },
    };
  }

  private executeDiplomacyGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    if (!goal.targetId) return null;

    const dipActions = this.evaluateDiplomaticOptions(npc);
    const relevant = dipActions.find((d) => d.targetRaceId === goal.targetId);

    if (!relevant) {
      goal.progress = 100;
      return null;
    }

    goal.progress = 60;

    return {
      type: 'diplomacy',
      targetRaceId: goal.targetId,
      action: relevant.type,
    };
  }

  private executeBuildGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    const allocation = this.allocateResources(npc, goal);
    const buildBudget = npc.resources.credits * (allocation.military / 100);

    if (buildBudget < 300) {
      goal.progress = 100;
      return null;
    }

    const stationTypes = ['defense', 'mining', 'research', 'shipyard'];
    const config = getPersonalityConfig(npc.personality, npc.strategy);
    const weights = stationTypes.map((_, i) => {
      switch (i) {
        case 0: return config.caution;
        case 1: return config.greed;
        case 2: return config.researchWeight || 30;
        case 3: return config.militaryWeight;
        default: return 50;
      }
    });

    const stationType = stationTypes[weightedRandom(weights)];

    goal.progress = 50;

    return {
      type: 'build_station',
      location: { galaxy: npc.galaxy, sector: npc.sector, system: npc.system },
      stationType,
    };
  }

  private executePatrolGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    const freeFleets = npc.fleet.filter((f) => !f.mission);
    if (freeFleets.length === 0) {
      goal.progress = 100;
      return null;
    }

    const fleet = freeFleets[0];

    const patrolDest: Coord = {
      galaxy: npc.galaxy,
      sector: npc.sector + Math.floor(Math.random() * 3) - 1,
      system: npc.system + Math.floor(Math.random() * 5) - 2,
    };

    goal.progress = 40;

    return {
      type: 'fleet_move',
      fleetId: fleet.id,
      destination: patrolDest,
    };
  }

  private executeRetreatGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    const lowFleet = npc.fleet.find((f) => f.fuel < 30 || f.morale < 40);
    if (!lowFleet) {
      goal.progress = 100;
      return null;
    }

    goal.progress = 60;

    return {
      type: 'fleet_retreat',
      fleetId: lowFleet.id,
      destination: { galaxy: npc.galaxy, sector: npc.sector, system: npc.system },
    };
  }

  private executeResearchGoal(npc: NPCState, goal: AIGoal): NPCAction | null {
    const race = getRaceById(npc.raceId);
    if (!race) return null;

    if (npc.resources.crystal < 50 || npc.resources.credits < 200) {
      goal.progress = 100;
      return null;
    }

    const techs = race.preferredTech;
    const tech = techs[Math.floor(Math.random() * techs.length)];

    goal.progress = 40;

    return {
      type: 'research',
      techId: `tech-${tech.toLowerCase().replace(/\s+/g, '-')}-${npc.level}`,
    };
  }

  private completeFleetMission(npc: NPCState, fleet: NPCFleet): NPCAction | null {
    if (!fleet.mission) return null;

    const mission = fleet.mission;

    fleet.location = { ...mission.destination };
    fleet.mission = null;
    fleet.fuel = Math.max(0, fleet.fuel - 20);

    if (mission.type === 'attack' && mission.targetId) {
      const targetNPC = this.npcs.get(mission.targetId);
      if (targetNPC) {
        const result = this.resolveNPCBattle(npc, targetNPC, fleet);
        this.applyBattleResult(npc, targetNPC, result, fleet);
      }
    }

    if (mission.type === 'patrol') {
      npc.influence = clamp(npc.influence + 2, 0, 100);
    }

    if (mission.type === 'explore') {
      npc.experience += 10;
    }

    return null;
  }

  private dispatchDefenseFleet(npc: NPCState): NPCAction | null {
    const threats = this.evaluateMilitaryThreats(npc);
    if (threats.overallThreat < 30) return null;

    const freeFleets = npc.fleet.filter((f) => !f.mission);
    if (freeFleets.length === 0) return null;

    const fleet = freeFleets[0];
    const nearestThreat = threats.militaryThreats.sort((a, b) => a.distance - b.distance)[0];

    if (!nearestThreat) return null;

    const targetNPC = this.npcs.get(nearestThreat.raceId);
    if (!targetNPC) return null;

    return {
      type: 'fleet_move',
      fleetId: fleet.id,
      destination: { galaxy: targetNPC.galaxy, sector: targetNPC.sector, system: targetNPC.system },
    };
  }

  // ==========================================================================
  // MILITARY
  // ==========================================================================

  evaluateMilitaryThreats(npc: NPCState): ThreatAssessment {
    const militaryThreats: Array<{ raceId: string; power: number; distance: number }> = [];
    const pirateThreats: Array<{ factionId: string; power: number; distance: number }> = [];
    let playerThreat = 0;

    const npcCoord: Coord = { galaxy: npc.galaxy, sector: npc.sector, system: npc.system };

    for (const other of this.allNPCs) {
      if (other.id === npc.id) continue;
      if (npc.wars.includes(other.raceId)) {
        const otherPower = other.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);
        const dist = distance(npcCoord, { galaxy: other.galaxy, sector: other.sector, system: other.system });
        militaryThreats.push({ raceId: other.raceId, power: otherPower, distance: dist });
      } else {
        const rel = npc.relations[other.raceId] || 0;
        if (rel < -40) {
          const otherPower = other.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);
          const dist = distance(npcCoord, { galaxy: other.galaxy, sector: other.sector, system: other.system });
          if (otherPower > npc.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0) * 0.5) {
            militaryThreats.push({ raceId: other.raceId, power: otherPower, distance: dist });
          }
        }
      }
    }

    for (const pirate of PIRATE_FACTIONS) {
      const piratePower =
        pirate.fleetComposition.scouts * 50 +
        pirate.fleetComposition.raiders * 150 +
        pirate.fleetComposition.carriers * 400 +
        pirate.fleetComposition.capitals * 800;
      pirateThreats.push({ factionId: pirate.id, power: piratePower, distance: pirate.raidRange });
    }

    const totalThreatPower =
      militaryThreats.reduce((sum, t) => sum + t.power, 0) +
      pirateThreats.reduce((sum, t) => sum + t.power * 0.3, 0) +
      playerThreat;

    const ourPower = npc.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);
    const overallThreat = clamp((totalThreatPower / Math.max(ourPower, 1)) * 50, 0, 100);

    const weakest = militaryThreats.length > 0
      ? militaryThreats.reduce((a, b) => (a.power < b.power ? a : b))
      : null;
    const strongest = militaryThreats.length > 0
      ? militaryThreats.reduce((a, b) => (a.power > b.power ? a : b))
      : null;

    return {
      overallThreat,
      militaryThreats,
      pirateThreats,
      playerThreat,
      weakestNeighbor: weakest?.raceId || null,
      strongestNeighbor: strongest?.raceId || null,
    };
  }

  decideFleetMovement(npc: NPCState, fleet: NPCFleet): FleetMission | null {
    if (fleet.mission) return fleet.mission;

    const threats = this.evaluateMilitaryThreats(npc);
    const config = getPersonalityConfig(npc.personality, npc.strategy);

    if (threats.overallThreat > 60 && fleet.totalPower > 100) {
      const nearestThreat = threats.militaryThreats.sort((a, b) => a.distance - b.distance)[0];
      if (nearestThreat) {
        const targetNPC = this.npcs.get(nearestThreat.raceId);
        if (targetNPC) {
          const ourPower = calculateFleetPower(fleet);
          if (ourPower > nearestThreat.power * 0.8) {
            return {
              type: 'attack',
              targetId: nearestThreat.raceId,
              destination: { galaxy: targetNPC.galaxy, sector: targetNPC.sector, system: targetNPC.system },
              eta: Math.ceil(distance({ galaxy: npc.galaxy, sector: npc.sector, system: npc.system }, { galaxy: targetNPC.galaxy, sector: targetNPC.sector, system: targetNPC.system })),
            };
          }
          return {
            type: 'defend',
            destination: { galaxy: npc.galaxy, sector: npc.sector, system: npc.system },
            eta: 1,
          };
        }
      }
    }

    if (config.aggression > 60 && Math.random() < config.aggression / 200) {
      const potentialTargets = this.allNPCs.filter(
        (other) =>
          other.id !== npc.id &&
          !npc.wars.includes(other.raceId) &&
          (npc.relations[other.raceId] || 0) < -20
      );

      if (potentialTargets.length > 0) {
        const target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
        return {
          type: 'raid',
          targetId: target.id,
          destination: { galaxy: target.galaxy, sector: target.sector, system: target.system },
          eta: Math.ceil(distance({ galaxy: npc.galaxy, sector: npc.sector, system: npc.system }, { galaxy: target.galaxy, sector: target.sector, system: target.system })),
        };
      }
    }

    if (config.expansionDrive > 50) {
      const expansion = this.decideColonizationTarget(npc);
      if (expansion) {
        return {
          type: 'explore',
          destination: expansion.targetLocation,
          eta: Math.ceil(distance({ galaxy: npc.galaxy, sector: npc.sector, system: npc.system }, expansion.targetLocation)),
        };
      }
    }

    return {
      type: 'patrol',
      destination: {
        galaxy: npc.galaxy,
        sector: npc.sector + Math.floor(Math.random() * 4) - 2,
        system: npc.system + Math.floor(Math.random() * 6) - 3,
      },
      eta: Math.ceil(Math.random() * 3) + 1,
    };
  }

  calculateBattleOdds(attacker: NPCFleet, defender: NPCFleet): BattleResult {
    const attackerPower = calculateFleetPower(attacker);
    const defenderPower = calculateFleetPower(defender);

    const ratio = attackerPower / Math.max(defenderPower, 1);
    const luckFactor = 0.8 + Math.random() * 0.4;
    const adjustedRatio = ratio * luckFactor;

    const attackerWins = adjustedRatio > 1;

    const baseDamage = Math.min(0.4, Math.abs(adjustedRatio - 1) * 0.2);
    const attackerLosses = attackerWins
      ? Math.floor(attackerPower * (0.05 + Math.random() * baseDamage))
      : Math.floor(attackerPower * (0.2 + Math.random() * 0.3));
    const defenderLosses = attackerWins
      ? Math.floor(defenderPower * (0.2 + Math.random() * 0.3))
      : Math.floor(defenderPower * (0.05 + Math.random() * baseDamage));

    const attackerExpGain = attackerWins ? 50 + Math.floor(Math.random() * 30) : 10 + Math.floor(Math.random() * 15);
    const defenderExpGain = attackerWins ? 10 + Math.floor(Math.random() * 15) : 50 + Math.floor(Math.random() * 30);

    let loot: Partial<NPCResources> | null = null;
    if (attackerWins) {
      loot = {
        credits: Math.floor(200 + Math.random() * 500),
        metal: Math.floor(50 + Math.random() * 150),
        crystal: Math.floor(30 + Math.random() * 100),
      };
    }

    return {
      attackerWins,
      attackerLosses,
      defenderLosses,
      attackerRemainingPower: Math.max(0, attackerPower - attackerLosses),
      defenderRemainingPower: Math.max(0, defenderPower - defenderLosses),
      experienceGained: { attacker: attackerExpGain, defender: defenderExpGain },
      loot,
    };
  }

  resolveNPCBattle(
    npc1: NPCState,
    npc2: NPCState,
    attackingFleet: NPCFleet
  ): BattleResult {
    const defendingFleet =
      npc2.fleet.find((f) => !f.mission) ||
      npc2.fleet[0];

    if (!defendingFleet) {
      return {
        attackerWins: true,
        attackerLosses: 0,
        defenderLosses: 0,
        attackerRemainingPower: calculateFleetPower(attackingFleet),
        defenderRemainingPower: 0,
        experienceGained: { attacker: 25, defender: 0 },
        loot: {
          credits: Math.floor(500 + Math.random() * 1000),
          metal: Math.floor(100 + Math.random() * 300),
          crystal: Math.floor(50 + Math.random() * 200),
        },
      };
    }

    return this.calculateBattleOdds(attackingFleet, defendingFleet);
  }

  private applyBattleResult(
    winner: NPCState,
    loser: NPCState,
    result: BattleResult,
    attackingFleet: NPCFleet
  ): void {
    winner.experience += result.experienceGained.attacker;
    loser.experience += result.experienceGained.defender;

    if (result.attackerWins) {
      const attackerFleetIdx = winner.fleet.indexOf(attackingFleet);
      if (attackerFleetIdx >= 0) {
        winner.fleet[attackerFleetIdx] = {
          ...attackingFleet,
          totalPower: result.attackerRemainingPower,
          morale: clamp(attackingFleet.morale + 10, 0, 100),
        };
      }

      const loserFleet = loser.fleet.find((f) => !f.mission);
      if (loserFleet) {
        loserFleet.totalPower = result.defenderRemainingPower;
        loserFleet.morale = clamp(loserFleet.morale - 20, 0, 100);
      }

      if (result.loot) {
        winner.resources.credits += result.loot.credits || 0;
        winner.resources.metal += result.loot.metal || 0;
        winner.resources.crystal += result.loot.crystal || 0;
      }

      winner.relations[loser.raceId] = (winner.relations[loser.raceId] || 0) - 15;
      loser.relations[winner.raceId] = (loser.relations[winner.raceId] || 0) - 25;

      winner.threat = clamp(winner.threat + 5, 0, 100);
      loser.threat = clamp(loser.threat - 10, 0, 100);
    } else {
      const attackerFleetIdx = winner.fleet.indexOf(attackingFleet);
      if (attackerFleetIdx >= 0) {
        winner.fleet[attackerFleetIdx] = {
          ...attackingFleet,
          totalPower: result.attackerRemainingPower,
          morale: clamp(attackingFleet.morale - 15, 0, 100),
        };
      }

      winner.relations[loser.raceId] = (winner.relations[loser.raceId] || 0) - 5;
      loser.relations[winner.raceId] = (loser.relations[winner.raceId] || 0) + 10;

      winner.threat = clamp(winner.threat - 5, 0, 100);
      loser.threat = clamp(loser.threat + 3, 0, 100);
    }
  }

  // ==========================================================================
  // DIPLOMACY
  // ==========================================================================

  evaluateDiplomaticOptions(npc: NPCState): DiplomaticAction[] {
    const actions: DiplomaticAction[] = [];
    const config = getPersonalityConfig(npc.personality, npc.strategy);

    for (const other of this.allNPCs) {
      if (other.id === npc.id) continue;
      if (npc.wars.includes(other.raceId)) {
        if (config.caution > 50 && npc.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0) < other.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0) * 0.5) {
          actions.push({
            type: 'make_peace',
            targetRaceId: other.raceId,
            reason: 'Outmatched militarily, seeking ceasefire',
          });
        }
        continue;
      }

      const currentRelation = npc.relations[other.raceId] || 0;
      const race = getRaceById(npc.raceId);
      const otherRace = getRaceById(other.raceId);

      if (currentRelation > 60 && config.diplomaticWeight > 30) {
        const hasTradeTreaty = npc.treaties.some(
          (t) => t.type === 'trade' && t.parties.includes(other.raceId)
        );
        if (!hasTradeTreaty) {
          actions.push({
            type: 'propose_treaty',
            targetRaceId: other.raceId,
            treatyType: 'trade',
            reason: 'Strong relations warrant trade agreement',
          });
        }
      }

      if (currentRelation > 40 && config.diplomaticWeight > 50) {
        const hasDefTreaty = npc.treaties.some(
          (t) => t.type === 'defense' && t.parties.includes(other.raceId)
        );
        if (!hasDefTreaty) {
          actions.push({
            type: 'propose_treaty',
            targetRaceId: other.raceId,
            treatyType: 'defense',
            reason: 'Mutual defense against common threats',
          });
        }
      }

      if (currentRelation < -50 && config.aggression > 60) {
        const areAllies = areInSameBloc(npc.raceId, other.raceId);
        if (!areAllies) {
          const ourPower = npc.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);
          const theirPower = other.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);
          if (ourPower > theirPower * 1.2) {
            actions.push({
              type: 'declare_war',
              targetRaceId: other.raceId,
              reason: 'Relations critically low, military advantage',
            });
          }
        }
      }

      if (currentRelation < -20 && currentRelation > -50 && config.diplomaticWeight > 40) {
        actions.push({
          type: 'improve_relations',
          targetRaceId: other.raceId,
          reason: 'Attempting to prevent hostilities',
        });
      }

      if (currentRelation > 20 && currentRelation < 50 && config.cunning > 60) {
        if (areInSameBloc(npc.raceId, other.raceId)) {
          actions.push({
            type: 'improve_relations',
            targetRaceId: other.raceId,
            reason: 'Strengthening alliance bonds',
          });
        }
      }
    }

    return actions.sort((a, b) => {
      const priorityOrder: Record<string, number> = {
        declare_war: 4,
        make_peace: 3,
        propose_treaty: 2,
        improve_relations: 1,
        worsen_relations: 0,
        break_treaty: 5,
      };
      return (priorityOrder[b.type] || 0) - (priorityOrder[a.type] || 0);
    });
  }

  processDiplomaticEvent(event: DiplomaticEvent): void {
    const npc1 = this.npcs.get(event.race1Id);
    const npc2 = this.npcs.get(event.race2Id);

    const relationChange = this.getEventRelationChange(event.type);

    if (npc1) {
      npc1.relations[event.race2Id] = clamp(
        (npc1.relations[event.race2Id] || 0) + relationChange,
        -100,
        100
      );
    }
    if (npc2) {
      npc2.relations[event.race1Id] = clamp(
        (npc2.relations[event.race1Id] || 0) + relationChange,
        -100,
        100
      );
    }

    if (event.type === 'war_declared') {
      if (npc1 && !npc1.wars.includes(event.race2Id)) npc1.wars.push(event.race2Id);
      if (npc2 && !npc2.wars.includes(event.race1Id)) npc2.wars.push(event.race1Id);
    }

    if (event.type === 'peace_signed') {
      if (npc1) npc1.wars = npc1.wars.filter((w) => w !== event.race2Id);
      if (npc2) npc2.wars = npc2.wars.filter((w) => w !== event.race1Id);
    }

    if (event.type === 'treaty_signed' && event.details) {
      const treatyType = event.details.split('_')[0] as TreatyType;
      const newTreaty: Treaty = {
        id: generateId('treaty'),
        type: treatyType,
        parties: [event.race1Id, event.race2Id],
        duration: -1,
        benefits: { economy: 5 },
        turnSigned: event.turn,
      };
      if (npc1) npc1.treaties.push(newTreaty);
      if (npc2) npc2.treaties.push(newTreaty);
    }
  }

  private getEventRelationChange(eventType: string): number {
    const changes: Record<string, number> = {
      treaty_signed: 15,
      treaty_broken: -30,
      war_declared: -40,
      peace_signed: 20,
      border_incident: -10,
      trade_deal: 8,
      alliance_formed: 25,
      alliance_dissolved: -20,
      vassalage_established: -5,
      vassalage_released: 5,
    };
    return changes[eventType] || 0;
  }

  // ==========================================================================
  // ECONOMY
  // ==========================================================================

  evaluateEconomicOptions(npc: NPCState): EconomicAction[] {
    const actions: EconomicAction[] = [];
    const config = getPersonalityConfig(npc.personality, npc.strategy);

    for (const other of this.allNPCs) {
      if (other.id === npc.id) continue;

      const relation = npc.relations[other.raceId] || 0;
      if (relation > 30 && config.greed > 30) {
        const totalOur = npc.resources.metal + npc.resources.crystal + npc.resources.deuterium;
        const totalTheirs = other.resources.metal + other.resources.crystal + other.resources.deuterium;

        if (totalOur > totalTheirs * 1.3 && config.greed > 60) {
          actions.push({
            type: 'trade',
            resources: {
              metal: Math.floor(totalOur * 0.05),
              crystal: Math.floor(totalOur * 0.03),
            },
            targetRaceId: other.raceId,
            reason: 'Surplus resources, profitable trade opportunity',
          });
        } else if (totalOur < totalTheirs * 0.7) {
          actions.push({
            type: 'trade',
            resources: {
              credits: Math.floor(npc.resources.credits * 0.05),
            },
            targetRaceId: other.raceId,
            reason: 'Need resources, offering credits',
          });
        }
      }

      if (relation < -40 && config.aggression > 50) {
        actions.push({
          type: 'embargo',
          resources: {},
          targetRaceId: other.raceId,
          reason: 'Hostile relations, cutting trade',
        });
      }
    }

    const totalResources = npc.resources.metal + npc.resources.crystal + npc.resources.deuterium;
    if (totalResources < 500 && config.greed > 40) {
      actions.push({
        type: 'hoard',
        resources: { credits: Math.floor(npc.resources.credits * 0.2) },
        reason: 'Low resources, conserving stockpile',
      });
    }

    if (npc.resources.credits > 2000 && config.investment !== undefined) {
      actions.push({
        type: 'invest',
        resources: {
          credits: Math.floor(npc.resources.credits * 0.1),
        },
        reason: 'Excess credits, investing in production',
      });
    }

    return actions.slice(0, 5);
  }

  allocateResources(npc: NPCState, goal: AIGoal): ResourceAllocation {
    const config = getPersonalityConfig(npc.personality, npc.strategy);

    let military = config.militaryWeight;
    let economy = config.economicWeight;
    let research = config.researchWeight;
    let diplomacy = config.diplomaticWeight;
    let expansion = config.expansionWeight;

    switch (goal.type) {
      case 'attack':
        military += 30;
        economy -= 10;
        break;
      case 'defend':
        military += 25;
        economy -= 5;
        break;
      case 'expand':
        expansion += 30;
        economy -= 10;
        break;
      case 'trade':
        economy += 30;
        military -= 10;
        break;
      case 'research':
        research += 30;
        military -= 5;
        break;
      case 'diplomacy':
        diplomacy += 30;
        military -= 5;
        break;
      case 'build':
        economy += 20;
        military += 10;
        break;
      default:
        break;
    }

    const total = military + economy + research + diplomacy + expansion;
    const reserves = 10;

    return {
      military: clamp((military / total) * (100 - reserves), 0, 100),
      economy: clamp((economy / total) * (100 - reserves), 0, 100),
      research: clamp((research / total) * (100 - reserves), 0, 100),
      diplomacy: clamp((diplomacy / total) * (100 - reserves), 0, 100),
      expansion: clamp((expansion / total) * (100 - reserves), 0, 100),
      reserves,
    };
  }

  // ==========================================================================
  // EXPANSION
  // ==========================================================================

  evaluateExpansionOptions(npc: NPCState): ExpansionOption[] {
    const options: ExpansionOption[] = [];
    const config = getPersonalityConfig(npc.personality, npc.strategy);

    if (config.expansionDrive < 20) return options;

    const npcCoord: Coord = { galaxy: npc.galaxy, sector: npc.sector, system: npc.system };

    for (const other of this.allNPCs) {
      if (other.id === npc.id) continue;

      const otherCoord: Coord = { galaxy: other.galaxy, sector: other.sector, system: other.system };
      const dist = distance(npcCoord, otherCoord);

      if (dist > 15) continue;

      const relation = npc.relations[other.raceId] || 0;
      const theirPower = other.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);
      const ourPower = npc.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);

      let score = 50;

      if (relation < -30 && ourPower > theirPower * 0.8) {
        score += 20;
      } else if (relation < -50) {
        score += 30;
      } else if (relation > 30) {
        score -= 20;
      }

      score -= dist * 2;

      if (other.colonies.length < 2) {
        score += 10;
      }

      const expansionPoint: Coord = {
        galaxy: other.galaxy,
        sector: other.sector + Math.floor(Math.random() * 3) - 1,
        system: other.system + Math.floor(Math.random() * 3) - 1,
      };

      options.push({
        targetLocation: expansionPoint,
        planetId: `planet-expansion-${npc.id}-${this.turn}`,
        score: clamp(score, 0, 100),
        reason:
          relation < -20
            ? 'Hostile neighbor, claiming border territory'
            : 'Strategic expansion near neutral territory',
      });
    }

    const emptySectors: Coord[] = [];
    for (let s = Math.max(0, npc.sector - 5); s <= npc.sector + 5; s++) {
      const hasNPC = this.allNPCs.some(
        (n) => n.id !== npc.id && n.sector === s && Math.abs(n.system - npc.system) < 3
      );
      if (!hasNPC) {
        emptySectors.push({
          galaxy: npc.galaxy,
          sector: s,
          system: npc.system + Math.floor(Math.random() * 5) - 2,
        });
      }
    }

    for (const empty of emptySectors.slice(0, 3)) {
      const dist = distance(npcCoord, empty);
      options.push({
        targetLocation: empty,
        planetId: `planet-frontier-${npc.id}-${this.turn}-${empty.sector}`,
        score: clamp(40 - dist * 3 + config.expansionDrive / 2, 0, 100),
        reason: 'Unclaimed territory, frontier expansion',
      });
    }

    return options.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  decideColonizationTarget(npc: NPCState): ExpansionOption | null {
    const options = this.evaluateExpansionOptions(npc);
    if (options.length === 0) return null;

    const config = getPersonalityConfig(npc.personality, npc.strategy);
    const weights = options.map((o) => o.score * (config.expansionDrive / 100));
    const idx = weightedRandom(weights);

    return options[idx] || null;
  }

  // ==========================================================================
  // RESOURCE UPDATES
  // ==========================================================================

  private updateNPCResources(npc: NPCState): void {
    for (const colony of npc.colonies) {
      npc.resources.metal += colony.production.metal || 0;
      npc.resources.crystal += colony.production.crystal || 0;
      npc.resources.deuterium += colony.production.deuterium || 0;
      npc.resources.energy += colony.production.energy || 0;
    }

    for (const station of npc.stations) {
      for (const [resource, amount] of Object.entries(station.production)) {
        if (resource in npc.resources) {
          (npc.resources as any)[resource] += amount;
        }
      }
    }

    const race = getRaceById(npc.raceId);
    const config = getPersonalityConfig(npc.personality, npc.strategy);
    const allocation = npc.currentGoal
      ? this.allocateResources(npc, npc.currentGoal)
      : { military: 30, economy: 30, research: 20, diplomacy: 10, expansion: 10, reserves: 0 };

    const militaryCost = npc.fleet.reduce(
      (sum, f) => sum + f.totalPower * 0.01 * (allocation.military / 100),
      0
    );
    const stationCost = npc.stations.reduce(
      (sum, s) => sum + s.level * 5 * (allocation.economy / 100),
      0
    );

    npc.resources.credits = Math.max(0, npc.resources.credits - militaryCost - stationCost);
    npc.resources.metal = Math.max(0, npc.resources.metal - npc.stations.length * 2);
    npc.resources.crystal = Math.max(0, npc.resources.crystal - npc.stations.length);
    npc.resources.deuterium = Math.max(
      0,
      npc.resources.deuterium - npc.fleet.reduce((sum, f) => sum + f.totalPower * 0.005, 0)
    );
    npc.resources.energy = Math.max(0, npc.resources.energy - npc.colonies.length * 5);

    for (const fleet of npc.fleet) {
      fleet.fuel = clamp(fleet.fuel + (npc.resources.energy > 50 ? 5 : -2), 0, 100);
      fleet.morale = clamp(
        fleet.morale + (npc.resources.credits > 200 ? 2 : -3),
        0,
        100
      );
    }
  }

  private updateNPCThreat(npc: NPCState): void {
    const totalFleetPower = npc.fleet.reduce((sum, f) => sum + calculateFleetPower(f), 0);
    const threatFromPower = clamp(totalFleetPower / 50, 0, 60);

    const warCount = npc.wars.length;
    const threatFromWars = warCount * 10;

    const config = getPersonalityConfig(npc.personality, npc.strategy);
    const threatFromAggression = config.aggression * 0.3;

    npc.threat = clamp(threatFromPower + threatFromWars + threatFromAggression, 0, 100);

    const diplomacyScore = npc.treaties.length * 5 + config.diplomaticWeight * 0.2;
    npc.influence = clamp(
      diplomacyScore + npc.colonies.length * 3 + npc.level * 2,
      0,
      100
    );
  }

  // ==========================================================================
  // PUBLIC HELPERS
  // ==========================================================================

  getNPCActions(npc: NPCState, turn: number): NPCAction[] {
    this.turn = turn;
    const actions: NPCAction[] = [];

    const goals = this.evaluateGoals(npc);
    const prioritized = this.prioritizeGoals(goals, npc.personality);

    for (const goal of prioritized.slice(0, 3)) {
      const action = this.executeGoal(npc, goal);
      if (action) actions.push(action);
    }

    for (const fleet of npc.fleet) {
      if (!fleet.mission) {
        const mission = this.decideFleetMovement(npc, fleet);
        if (mission) {
          fleet.mission = mission;
          actions.push({
            type: 'fleet_move',
            fleetId: fleet.id,
            destination: mission.destination,
          });
        }
      }
    }

    return actions;
  }
}

// ============================================================================
// MODULE-LEVEL EXPORTS
// ============================================================================

export function getActionsForAllNPCs(engine: NPCAIEngine, turn: number): NPCAction[] {
  const allActions: NPCAction[] = [];

  for (const npc of engine.getAllNPCs()) {
    const actions = engine.getNPCActions(npc, turn);
    allActions.push(...actions);
  }

  return allActions;
}

export function updateNPCRelations(npc1: NPCState, npc2: NPCState, event: DiplomaticEvent): void {
  const change = getEventRelationDelta(event.type);

  npc1.relations[npc2.raceId] = clamp((npc1.relations[npc2.raceId] || 0) + change, -100, 100);
  npc2.relations[npc1.raceId] = clamp((npc2.relations[npc1.raceId] || 0) + change, -100, 100);

  if (event.type === 'war_declared') {
    if (!npc1.wars.includes(npc2.raceId)) npc1.wars.push(npc2.raceId);
    if (!npc2.wars.includes(npc1.raceId)) npc2.wars.push(npc1.raceId);
  }

  if (event.type === 'peace_signed') {
    npc1.wars = npc1.wars.filter((w) => w !== npc2.raceId);
    npc2.wars = npc2.wars.filter((w) => w !== npc1.raceId);
  }
}

function getEventRelationDelta(eventType: string): number {
  const deltas: Record<string, number> = {
    treaty_signed: 15,
    treaty_broken: -30,
    war_declared: -40,
    peace_signed: 20,
    border_incident: -10,
    trade_deal: 8,
    alliance_formed: 25,
    alliance_dissolved: -20,
    vassalage_established: -5,
    vassalage_released: 5,
  };
  return deltas[eventType] || 0;
}

export function createInitialNPCStates(): NPCState[] {
  const npcs: NPCState[] = [];

  const spawnLocations: Array<{ raceId: string; location: Coord }> = NPC_RACES.map((race, i) => ({
    raceId: race.id,
    location: {
      galaxy: Math.floor(i / 12),
      sector: i % 12,
      system: Math.floor(Math.random() * 8),
    },
  }));

  for (const spawn of spawnLocations) {
    npcs.push(createNPCState(spawn.raceId, spawn.location));
  }

  return npcs;
}
