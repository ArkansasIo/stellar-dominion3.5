/**
 * Civilization Systems Type Definitions
 * Core interfaces for jobs, subsystems, resources, and military structure
 * @tag #civilization #types #military #jobs #subsystems
 */

// ============================================================================
// JOB & WORKFORCE TYPES
// ============================================================================

export type JobDomain = 'civilization' | 'military';
export type JobRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type JobClass =
  | 'administrative'
  | 'production'
  | 'research'
  | 'military'
  | 'support'
  | 'specialized';

export interface CivilizationJob {
  id: string;
  name: string;
  domain: JobDomain;
  rarity: JobRarity;
  class: JobClass;
  subclass?: string;
  rank?: number;
  tier?: number;
  unlockLevel?: number;

  // Building Requirements
  buildingRequired?: {
    name: string;
    minimumLevel: number;
  };
  buildingBonus?: number;

  // Resource Demands
  resourceDemands: {
    food: number;
    water: number;
    productivity: number;
  };

  // Stats & Bonuses
  statsBonus?: {
    [key: string]: number;
  };

  // Unlocks
  unlocksAt?: {
    techLevel?: number;
    playerLevel?: number;
    buildingLevel?: number;
  };

  // Employment Limits
  maxEmployees?: number;
  unlimitedSlots?: boolean;

  // Description
  description: string;
  flavorText?: string;

  // Faction / Specialty
  factionLocked?: string;
  specialization?: string;
}

export interface WorkforceAssignment {
  id: string;
  playerId: string;
  jobId: string;
  employees: number;
  assignedAt: Date;
  performanceMultiplier: number;
}

export interface WorkforceProjection {
  totalWorkforce: number;
  foodRequired: number;
  waterRequired: number;
  productivityGenerated: number;
  efficiencyRating: number;
}

// ============================================================================
// SYSTEM & SUBSYSTEM TYPES
// ============================================================================

export type SystemType = 'governance' | 'commerce' | 'education' | 'culture';

export interface CivilizationSubsystem {
  id: string;
  name: string;
  systemType: SystemType;
  level: number;
  maxLevel: number;
  efficiency: number;

  // Requirements
  prerequisiteSystems?: string[];
  buildingsRequired?: { [buildingType: string]: number };
  populationRequired?: number;

  // Production
  productionPerTurn?: number;
  costPerTurn?: {
    food?: number;
    water?: number;
    credits?: number;
  };

  // Bonuses
  bonuses?: {
    research?: number;
    production?: number;
    morale?: number;
    culture?: number;
  };

  // Status
  isActive: boolean;
  turnsActive?: number;

  description: string;
}

export interface SubsystemState {
  systemId: string;
  playerId: string;
  level: number;
  efficiency: number;
  productionBuffer: number;
  turnsOperating: number;
  lastUpgradedAt?: Date;
}

// ============================================================================
// ARMY & MILITARY TYPES
// ============================================================================

export type UnitType =
  | 'soldier'
  | 'weapon'
  | 'armor'
  | 'vehicle'
  | 'mech'
  | 'commander';

export type ArmyRole =
  | 'commander'
  | 'captain'
  | 'sergeant'
  | 'specialist'
  | 'operator'
  | 'support';

export interface ArmySubsystem {
  id: string;
  name: string;
  role: ArmyRole;
  type: UnitType;
  tier: number;
  rarity: JobRarity;

  // Combat Stats
  combat: {
    attack: number;
    defense: number;
    health: number;
    speed: number;
    accuracy: number;
    dodge: number;
  };

  // Resource Cost
  cost: {
    credits: number;
    materials?: number;
    time?: number;
  };

  // Capacity
  crew: number;
  minCrewRequired: number;

  // Perks/Abilities
  specialAbilities?: {
    name: string;
    effect: string;
    cooldown?: number;
  }[];

  // Unlocks
  prerequisiteTechs?: string[];
  minimumLevel?: number;

  // Morale & Effectiveness
  moraleMultiplier: number;
  formationBonus?: number;

  description: string;
  flavorText?: string;
}

export interface ArmyUnit {
  id: string;
  playerId: string;
  subsystemId: string;
  quantity: number;
  health: number;
  morale: number;
  experience: number;
  level: number;
  assignedSquadron?: string;
  location?: {
    galaxy: number;
    system: number;
    planet: number;
  };
}

export interface MilitaryForce {
  playerId: string;
  squadrons: ArmyUnit[];
  totalStrength: number;
  totalMorale: number;
  averageExperience: number;
  commanderBonus: number;
}

// ============================================================================
// CAMPAIGN & DEPLOYMENT TYPES
// ============================================================================

export interface MilitaryCampaign {
  id: string;
  playerId: string;
  name: string;
  type: 'conquest' | 'defense' | 'exploration' | 'raid';
  status: 'planning' | 'active' | 'completed' | 'failed';
  targetGalaxy: number;
  targetSystem: number;
  targetPlanet?: number;
  allocatedForces: string[]; // Unit IDs
  estimatedDuration: number;
  startedAt?: Date;
  completedAt?: Date;
  successRate?: number;
  rewards?: {
    experience?: number;
    morale?: number;
    resources?: { [resource: string]: number };
  };
}

// ============================================================================
// GOVERNMENT & POLICY TYPES
// ============================================================================

export type GovernmentType =
  | 'autocracy'
  | 'democracy'
  | 'oligarchy'
  | 'monarchy'
  | 'meritocracy'
  | 'military_junta';

export interface GovernmentPolicy {
  id: string;
  governmentType: GovernmentType;
  name: string;
  duration: number;
  bonuses?: {
    [key: string]: number;
  };
  restrictions?: {
    [key: string]: string;
  };
  cost?: { [resource: string]: number };
}

// ============================================================================
// COMMERCE & TRADE TYPES
// ============================================================================

export interface CommercialRoute {
  id: string;
  playerId: string;
  sourceGalaxy: number;
  sourceSystem: number;
  destinationGalaxy: number;
  destinationSystem: number;
  cargoType: string;
  profitPerTurn: number;
  riskLevel: number; // 0-100
  isActive: boolean;
  turnsActive: number;
}

// ============================================================================
// CULTURE & MORALE TYPES
// ============================================================================

export interface CultureMetric {
  playerId: string;
  culturePoints: number;
  moraleIndex: number; // 0-100
  popularityRating: number; // 0-100
  unrestLevel: number; // 0-100
  festivals?: {
    name: string;
    bonus: number;
    turnsRemaining: number;
  }[];
}

// ============================================================================
// EDUCATION & RESEARCH BONUSES
// ============================================================================

export interface EducationBonus {
  id: string;
  name: string;
  category: 'science' | 'military' | 'commerce' | 'culture';
  researchSpeedBonus: number;
  costReduction: number;
  duration: number;
}

export interface EducationFacility {
  playerId: string;
  facilityId: string;
  level: number;
  activeResearch?: string[];
  bonusesProvided: EducationBonus[];
  turnsOperating: number;
}

// ============================================================================
// DATABASE PERSISTENCE TYPES
// ============================================================================

export interface CivilizationPlayerState {
  playerId: string;
  governmentType: GovernmentType;
  currentPolicies: string[];
  activeCampaigns: string[];
  subsystemStates: SubsystemState[];
  workforce: WorkforceAssignment[];
  militaryForces: MilitaryForce;
  culture: CultureMetric;
  education: EducationFacility[];
  commercialRoutes: CommercialRoute[];
  lastUpdatedAt: Date;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface AssignmentRequest {
  jobId: string;
  employees: number;
}

export interface SubsystemUpgradeRequest {
  systemId: string;
  targetLevel: number;
}

export interface ArmyDeploymentRequest {
  unitIds: string[];
  targetGalaxy: number;
  targetSystem: number;
  targetPlanet?: number;
  campaignType: 'conquest' | 'defense' | 'exploration' | 'raid';
}

export interface WorkforceResponse {
  success: boolean;
  projection: WorkforceProjection;
  assignments: WorkforceAssignment[];
  timestamp: Date;
}

export interface ArmyResponse {
  success: boolean;
  militaryForce: MilitaryForce;
  units: ArmyUnit[];
  timestamp: Date;
}
