type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };
type Option<T> = { readonly some: true; readonly value: T } | { readonly some: false };

function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

function Some<T>(value: T): Option<T> {
  return { some: true, value };
}

function None(): Option<never> {
  return { some: false };
}

function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}

function isSome<T>(option: Option<T>): option is { some: true; value: T } {
  return option.some;
}

function unwrapOr<T>(option: Option<T>, defaultValue: T): T {
  return option.some ? option.value : defaultValue;
}

function mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (result.ok) {
    return Ok(fn(result.value)) as Result<U, E>;
  }
  return result as unknown as Result<U, E>;
}

function flatMapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  if (result.ok) {
    return fn(result.value);
  }
  return result as unknown as Result<U, E>;
}

function combineResults<T, E>(results: readonly Result<T, E>[]): Result<readonly T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (!result.ok) {
      return result as unknown as Result<readonly T[], E>;
    }
    values.push(result.value);
  }
  return Ok(values as readonly T[]);
}

function mapOption<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  if (option.some) {
    return Some(fn(option.value));
  }
  return None();
}

function flatMapOption<T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U> {
  if (option.some) {
    return fn(option.value);
  }
  return None();
}

const GAME_ENGINE_VERSION = 4;

type BuildingType =
  | "metalMine"
  | "crystalMine"
  | "deuteriumSynthesizer"
  | "solarPlant"
  | "fusionReactor"
  | "roboticsFactory"
  | "shipyard"
  | "researchLab"
  | "allianceDepot"
  | "missileSilo"
  | "warpGate"
  | "terraformer"
  | "bioDome"
  | "darkMatterExtractor";

type ShipType =
  | "lightFighter"
  | "heavyFighter"
  | "cruiser"
  | "battleship"
  | "battlecruiser"
  | "destroyer"
  | "bomber"
  | "colonyShip"
  | "transporter"
  | "recycler"
  | "espionageProbe"
  | "satellite";

type ResourceType = "metal" | "crystal" | "deuterium" | "energy" | "credits" | "food" | "water" | "darkMatter";

type GovernmentType = "democracy" | "oligarchy" | "dictatorship" | "theocracy" | "anarchy" | "federation" | "hive";

type RaceType = "human" | "zolran" | "velathi" | "krex" | "netheril" | "synthoid";

type TerrainType = "openSpace" | "asteroidField" | "nebula" | "blackHole" | "wormhole" | "deepSpace" | "planetaryRing";

type PlanetType = "terrestrial" | "gasGiant" | "iceWorld" | "lavaWorld" | "desert" | "ocean" | "toxic" | "barren";

type TreatyType = "nonAggression" | "trade" | "research" | "defense" | "vassal" | "union";

type AchievementCategory = "combat" | "economy" | "research" | "diplomacy" | "exploration" | "colonization";

interface ResourceAmount {
  readonly current: number;
  readonly production: number;
  readonly storage: number;
  readonly maxStorage: number;
}

interface ResourceState {
  readonly metal: ResourceAmount;
  readonly crystal: ResourceAmount;
  readonly deuterium: ResourceAmount;
  readonly energy: ResourceAmount;
  readonly credits: ResourceAmount;
  readonly food: ResourceAmount;
  readonly water: ResourceAmount;
  readonly darkMatter: ResourceAmount;
}

interface BuildingState {
  readonly id: string;
  readonly type: BuildingType;
  readonly level: number;
  readonly maxLevel: number;
  readonly constructing: boolean;
  readonly constructionQueue: readonly string[];
  readonly constructionTimeRemaining: number;
  readonly productionBonus: number;
  readonly efficiency: number;
  readonly energyConsumption: number;
  readonly adjacentBonuses: readonly string[];
  readonly blueprintLevel: number;
}

interface FleetState {
  readonly ships: ReadonlyMap<ShipType, number>;
  readonly inTransit: readonly FleetMission[];
  readonly inCombat: readonly string[];
  readonly stationedAt: ReadonlyMap<string, string>;
  readonly fuel: number;
  readonly maxFuel: number;
  readonly totalCombatPower: number;
  readonly cargoCapacity: number;
  readonly usedCargoCapacity: number;
  readonly supplyUsage: number;
}

interface FleetMission {
  readonly id: string;
  readonly type: "attack" | "transport" | "colonize" | "harvest" | "espionage" | "deploy" | "recall";
  readonly origin: Coordinates;
  readonly destination: Coordinates;
  readonly ships: ReadonlyMap<ShipType, number>;
  readonly cargo: ResourceCargo;
  readonly departureTime: number;
  readonly arrivalTime: number;
  readonly speed: number;
  readonly fuelConsumed: number;
  readonly returnTrip: boolean;
}

interface ResourceCargo {
  readonly metal: number;
  readonly crystal: number;
  readonly deuterium: number;
  readonly food: number;
}

interface ResearchProject {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly level: number;
  readonly maxLevel: number;
  readonly progress: number;
  readonly totalCost: number;
  readonly timeRemaining: number;
  readonly prerequisites: readonly string[];
  readonly effects: readonly ResearchEffect[];
  readonly startedAt: number;
}

interface ResearchEffect {
  readonly type: string;
  readonly value: number;
  readonly perLevel: number;
  readonly target: string;
}

interface ResearchState {
  readonly currentResearch: Option<ResearchProject>;
  readonly completedResearch: ReadonlyMap<string, number>;
  readonly researchQueue: readonly string[];
  readonly researchPoints: number;
  readonly researchPointsPerTick: number;
  readonly bonusMultiplier: number;
  readonly activeBreakthrough: boolean;
  readonly totalResearchSpent: number;
  readonly unlockedProjects: readonly string[];
}

interface ColonyState {
  readonly id: string;
  readonly name: string;
  readonly coordinates: Coordinates;
  readonly planetType: PlanetType;
  readonly population: number;
  readonly maxPopulation: number;
  readonly happiness: number;
  readonly stability: number;
  readonly crime: number;
  readonly pollution: number;
  readonly buildings: readonly BuildingState[];
  readonly defenses: DefenseState;
  readonly fleet: FleetState;
  readonly tradeValue: number;
  readonly housing: number;
  readonly amenities: number;
  readonly foodProduction: number;
  readonly waterProduction: number;
  readonly terraformLevel: number;
  readonly orbitalStations: number;
  readonly moonPresent: boolean;
  readonly moonSize: number;
}

interface DefenseState {
  readonly missileBatteries: number;
  readonly orbitalCannons: number;
  readonly shieldGenerator: number;
  readonly shieldLevel: number;
  readonly maxShieldLevel: number;
  readonly antiAirDefense: number;
  readonly mineField: number;
  readonly decoySatellites: number;
  readonly defenseBonus: number;
}

interface Coordinates {
  readonly galaxy: number;
  readonly system: number;
  readonly position: number;
}

interface DiplomacyState {
  readonly alliances: readonly Alliance[];
  readonly wars: readonly War[];
  readonly treaties: readonly Treaty[];
  readonly tradeAgreements: readonly TradeAgreement[];
  readonly intelligence: IntelligenceState;
  readonly reputation: number;
  readonly diplomaticPoints: number;
  readonly activeEnvoys: number;
  readonly maxEnvoys: number;
}

interface Alliance {
  readonly id: string;
  readonly name: string;
  readonly leaderId: string;
  readonly memberIds: readonly string[];
  readonly createdAt: number;
  readonly sharedResearch: boolean;
  readonly sharedFleet: boolean;
  readonly allianceTax: number;
  readonly rank: number;
}

interface War {
  readonly id: string;
  readonly attackerId: string;
  readonly defenderId: string;
  readonly reason: string;
  readonly declaredAt: number;
  readonly casualties: WarCasualties;
  readonly warScore: number;
  readonly peaceOffer: Option<PeaceOffer>;
  readonly warType: "total" | "limited" | "border" | "trade";
}

interface WarCasualties {
  readonly attackerShipsLost: number;
  readonly defenderShipsLost: number;
  readonly attackerBuildingsLost: number;
  readonly defenderBuildingsLost: number;
  readonly debrisGenerated: number;
  readonly resourcesPlundered: number;
}

interface PeaceOffer {
  readonly fromId: string;
  readonly terms: readonly PeaceTerm[];
  readonly offeredAt: number;
  readonly expiresAt: number;
}

interface PeaceTerm {
  readonly type: "resources" | "systems" | "tribute" | "alliance" | "disband";
  readonly value: number | string;
  readonly target: string;
}

interface Treaty {
  readonly id: string;
  readonly type: TreatyType;
  readonly partyA: string;
  readonly partyB: string;
  readonly signedAt: number;
  readonly expiresAt: Option<number>;
  readonly terms: ReadonlyMap<string, number>;
  readonly active: boolean;
}

interface TradeAgreement {
  readonly id: string;
  readonly fromId: string;
  readonly toId: string;
  readonly resource: ResourceType;
  readonly amountPerTick: number;
  readonly duration: number;
  readonly remainingTicks: number;
  readonly active: boolean;
  readonly pricePerUnit: number;
}

interface IntelligenceState {
  readonly spyNetworkLevel: number;
  readonly activeAgents: number;
  readonly maxAgents: number;
  readonly counterEspionage: number;
  readonly knownEnemyFleetLocations: ReadonlyMap<string, Coordinates>;
  readonly knownEnemyTechLevels: ReadonlyMap<string, ReadonlyMap<string, number>>;
  readonly intelReports: readonly IntelReport[];
  readonly agentSuccessRate: number;
  readonly agentTrainingCost: number;
  readonly discoveredSecrets: readonly string[];
}

interface IntelReport {
  readonly id: string;
  readonly targetId: string;
  readonly type: "fleet" | "economy" | "tech" | "diplomacy" | "colony";
  readonly data: ReadonlyMap<string, number | string>;
  readonly timestamp: number;
  readonly agentLost: boolean;
  readonly counterIntelTriggered: boolean;
}

interface Achievement {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: AchievementCategory;
  readonly progress: number;
  readonly maxProgress: number;
  readonly completed: boolean;
  readonly reward: AchievementReward;
  readonly completedAt: Option<number>;
}

interface AchievementReward {
  readonly type: "resource" | "bonus" | "title" | "skin" | "building";
  readonly value: number | string;
  readonly resource: Option<ResourceType>;
}

interface EmpireModifiers {
  readonly governmentBonus: number;
  readonly raceBonus: number;
  readonly seasonBonus: number;
  readonly researchBonus: number;
  readonly allianceBonus: number;
  readonly achievementBonus: number;
  readonly commanderBonus: number;
  readonly premiumBonus: number;
  readonly eventBonus: number;
  readonly totalModifier: number;
}

interface GameState {
  readonly userId: string;
  readonly universeId: string;
  readonly username: string;
  readonly tick: number;
  readonly resources: ResourceState;
  readonly buildings: readonly BuildingState[];
  readonly fleet: FleetState;
  readonly research: ResearchState;
  readonly colonies: readonly ColonyState[];
  readonly diplomacy: DiplomacyState;
  readonly achievements: readonly Achievement[];
  readonly lastTick: number;
  readonly createdAt: number;
  readonly government: GovernmentType;
  readonly race: RaceType;
  readonly totalScore: number;
  readonly rank: number;
  readonly kardashevLevel: number;
  readonly empireName: string;
  readonly settings: UserSettings;
}

interface UserSettings {
  readonly language: string;
  readonly timezone: string;
  readonly notificationsEnabled: boolean;
  readonly soundEnabled: boolean;
  readonly autoRetaliate: boolean;
  readonly showAdvancedStats: boolean;
  readonly compactMode: boolean;
  readonly defaultFleetSpeed: number;
  readonly favoriteColonies: readonly string[];
}

interface TickResult {
  readonly resourcesChanged: ResourceDelta;
  readonly buildingsCompleted: readonly BuildingCompletion[];
  readonly researchCompleted: Option<ResearchProject>;
  readonly fleetArrivals: readonly FleetArrival[];
  readonly events: readonly GameEvent[];
  readonly happinessChanges: ReadonlyMap<string, number>;
  readonly populationChanges: ReadonlyMap<string, number>;
  readonly tradeIncome: number;
  readonly taxIncome: number;
  readonly defenseUpdates: ReadonlyMap<string, DefenseUpdate>;
}

interface ResourceDelta {
  readonly metal: number;
  readonly crystal: number;
  readonly deuterium: number;
  readonly energy: number;
  readonly credits: number;
  readonly food: number;
  readonly water: number;
  readonly darkMatter: number;
}

interface BuildingCompletion {
  readonly colonyId: string;
  readonly buildingId: string;
  readonly type: BuildingType;
  readonly newLevel: number;
  readonly completedAt: number;
}

interface FleetArrival {
  readonly missionId: string;
  readonly type: string;
  readonly origin: Coordinates;
  readonly destination: Coordinates;
  readonly outcome: Result<FleetMissionSuccess, FleetError>;
  readonly arrivedAt: number;
  readonly returnDepartureTime: Option<number>;
}

interface FleetMissionSuccess {
  readonly cargoDelivered: ResourceCargo;
  readonly combatResult: Option<CombatRoundResult>;
  readonly colonyEstablished: Option<string>;
  readonly resourcesHarvested: ResourceCargo;
  readonly xpGained: number;
}

interface GameEvent {
  readonly id: string;
  readonly type: "combat" | "economy" | "research" | "diplomacy" | "colony" | "achievement" | "seasonal" | "random";
  readonly severity: "info" | "warning" | "critical" | "success";
  readonly message: string;
  readonly data: ReadonlyMap<string, number | string>;
  readonly timestamp: number;
  readonly acknowledged: boolean;
}

interface DefenseUpdate {
  readonly colonyId: string;
  readonly shieldDamage: number;
  readonly defensesRepaired: number;
  readonly minesDetonated: number;
  readonly decoysTriggered: number;
}

interface ResourceProduction {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  credits: number;
  food: number;
  water: number;
  darkMatter: number;
  energyBalance: number;
  storageOverflowPenalty: number;
}

interface EconomyError {
  readonly code: "INSUFFICIENT_RESOURCES" | "STORAGE_FULL" | "ENERGY_DEFICIT" | "BUILDING_NOT_EXISTS" | "MAX_LEVEL_REACHED" | "CONSTRUCTION_IN_PROGRESS" | "COLONY_NOT_FOUND" | "INVALID_BUILDING_TYPE";
  readonly message: string;
  readonly details: ReadonlyMap<string, number | string>;
}

interface FleetError {
  readonly code: "INSUFFICIENT_SHIPS" | "NO_FLEET" | "INVALID_DESTINATION" | "FUEL_INSUFFICIENT" | "FLEET_IN_COMBAT" | "MISSION_IN_PROGRESS" | "CARGO_FULL" | "DESTINATION_BLOCKED" | "SPEED_INVALID" | "COLONY_SHIP_REQUIRED";
  readonly message: string;
  readonly details: ReadonlyMap<string, number | string>;
}

interface CombatError {
  readonly code: "NO_ATTACKER" | "NO_DEFENDER" | "INVALID_FORMATION" | "BATTLE_IN_PROGRESS" | "INSUFFICIENT_SUPPLY" | "INVALID_TARGET" | "SIEGE_FAILED" | "FLEET_DESTROYED";
  readonly message: string;
  readonly details: ReadonlyMap<string, number | string>;
}

interface ResearchError {
  readonly code: "RESEARCH_IN_PROGRESS" | "PREREQUISITES_NOT_MET" | "MAX_LEVEL_REACHED" | "INSUFFICIENT_POINTS" | "PROJECT_LOCKED" | "UNIVERSAL_RESTRICTION" | "QUEUE_FULL";
  readonly message: string;
  readonly details: ReadonlyMap<string, number | string>;
}

interface ColonyError {
  readonly code: "COLONY_NOT_FOUND" | "POPULATION_OVERFLOW" | "HAPPINESS_CRITICAL" | "STABILITY_LOW" | "NO_HOUSING" | "FOOD_SHORTAGE" | "ENERGY_DEFICIT" | "MAX_COLONIES_REACHED" | "TERRAIN_INCOMPATIBLE";
  readonly message: string;
  readonly details: ReadonlyMap<string, number | string>;
}

interface SerializeError {
  readonly code: "INVALID_STATE" | "VERSION_MISMATCH" | "CORRUPTED_DATA" | "SIZE_EXCEEDED" | "ENCODING_FAILED";
  readonly message: string;
  readonly details: ReadonlyMap<string, number | string>;
}

interface DeserializeError {
  readonly code: "INVALID_JSON" | "MISSING_FIELDS" | "VERSION_MISMATCH" | "MIGRATION_FAILED" | "VALIDATION_FAILED" | "CORRUPTED_DATA";
  readonly message: string;
  readonly details: ReadonlyMap<string, number | string>;
}

interface ValidationError {
  readonly code: "INVALID_TYPE" | "OUT_OF_RANGE" | "MISSING_FIELD" | "INCONSISTENT_DATA" | "INVALID_ENUM" | "NEGATIVE_VALUE" | "ID_COLLISION" | "REFERENTIAL_INTEGRITY";
  readonly message: string;
  readonly field: string;
  readonly expected: string;
  readonly received: string;
}

interface CombatForce {
  readonly id: string;
  readonly ownerId: string;
  readonly ships: ReadonlyMap<ShipType, CombatShipInstance>;
  readonly defensiveStructures: DefenseState;
  readonly formation: FormationType;
  readonly commanderBonus: number;
  readonly techBonus: number;
  readonly supply: number;
  readonly maxSupply: number;
  readonly morale: number;
}

interface CombatShipInstance {
  readonly type: ShipType;
  count: number;
  readonly attack: number;
  readonly defense: number;
  shield: number;
  hull: number;
  readonly maxHull: number;
  readonly maxShield: number;
  readonly speed: number;
  readonly evasion: number;
  readonly criticalChance: number;
  readonly fuelConsumption: number;
  readonly cargo: number;
}

type FormationType = "delta" | "line" | "sphere" | "wedge" | "cross" | "defensive" | "aggressive";

interface CombatRoundResult {
  readonly round: number;
  readonly attackerDamageDealt: number;
  readonly defenderDamageDealt: number;
  readonly attackerCasualties: ReadonlyMap<ShipType, number>;
  readonly defenderCasualties: ReadonlyMap<ShipType, number>;
  readonly attackerShieldDamage: number;
  readonly defenderShieldDamage: number;
  readonly attackerCriticalHits: number;
  readonly defenderCriticalHits: number;
  readonly attackerEvasions: number;
  readonly defenderEvasions: number;
  readonly plunder: ResourceCargo;
  readonly retreatCheck: boolean;
  readonly experienceGained: number;
  readonly combatPowerAttacker: number;
  readonly combatPowerDefender: number;
}

interface CombatOutcome {
  readonly winner: "attacker" | "defender" | "draw";
  readonly totalRounds: number;
  readonly rounds: readonly CombatRoundResult[];
  readonly attackerLosses: ReadonlyMap<ShipType, number>;
  readonly defenderLosses: ReadonlyMap<ShipType, number>;
  readonly debris: ResourceCargo;
  readonly loot: ResourceCargo;
  readonly xpGainedAttacker: number;
  readonly xpGainedDefender: number;
  readonly warScoreChange: number;
  readonly retreatRound: Option<number>;
}

interface ResearchModifiers {
  readonly labLevel: number;
  readonly raceBonus: number;
  readonly governmentBonus: number;
  readonly allianceBonus: number;
  readonly achievementBonus: number;
  readonly commanderBonus: number;
  readonly eventBonus: number;
  readonly premiumBonus: number;
  readonly totalModifier: number;
}

interface ResearchProgress {
  readonly progress: number;
  readonly totalRequired: number;
  readonly percentageComplete: number;
  readonly estimatedTicksRemaining: number;
  readonly breakthroughTriggered: boolean;
  readonly breakthroughBonus: number;
  readonly canComplete: boolean;
  readonly completionTime: number;
}

interface ColonyTickResult {
  readonly populationDelta: number;
  readonly happinessDelta: number;
  readonly stabilityDelta: number;
  readonly crimeDelta: number;
  readonly pollutionDelta: number;
  readonly productionModifier: number;
  readonly defenseModifier: number;
  readonly tradeValueChange: number;
  readonly events: readonly GameEvent[];
  readonly buildingEfficiencyChanges: ReadonlyMap<string, number>;
  readonly housingChange: number;
  readonly amenitiesChange: number;
}

interface FleetMovement {
  readonly missionId: string;
  readonly travelTime: number;
  readonly arrivalTime: number;
  readonly fuelRequired: number;
  readonly fuelSufficient: boolean;
  readonly distance: number;
  readonly speed: number;
  readonly route: readonly Coordinates[];
  readonly arrivalX: number;
  readonly arrivalY: number;
  readonly arrivalZ: number;
}

interface FleetComposition {
  readonly ships: ReadonlyMap<ShipType, number>;
  readonly cargoCapacity: number;
  readonly fuelCapacity: number;
  readonly totalMass: number;
  readonly averageSpeed: number;
  readonly slowestShipSpeed: number;
}

const BASE_PRODUCTION = new Map<BuildingType, Map<ResourceType, number>>([
  ["metalMine", new Map<ResourceType, number>([["metal", 30], ["energy", -5]])],
  ["crystalMine", new Map<ResourceType, number>([["crystal", 20], ["energy", -8]])],
  ["deuteriumSynthesizer", new Map<ResourceType, number>([["deuterium", 10], ["energy", -12]])],
  ["solarPlant", new Map<ResourceType, number>([["energy", 50]])],
  ["fusionReactor", new Map<ResourceType, number>([["energy", 120], ["deuterium", -2]])],
  ["roboticsFactory", new Map<ResourceType, number>([["credits", 15]])],
  ["shipyard", new Map<ResourceType, number>([["credits", 20]])],
  ["researchLab", new Map<ResourceType, number>([["credits", 10]])],
  ["allianceDepot", new Map<ResourceType, number>([["credits", 25]])],
  ["missileSilo", new Map<ResourceType, number>([["credits", 5]])],
  ["warpGate", new Map<ResourceType, number>([["energy", -30]])],
  ["terraformer", new Map<ResourceType, number>([["food", 8], ["water", 8]])],
  ["bioDome", new Map<ResourceType, number>([["food", 25], ["water", 10]])],
  ["darkMatterExtractor", new Map<ResourceType, number>([["darkMatter", 3]])],
]) as ReadonlyMap<BuildingType, ReadonlyMap<ResourceType, number>>;

const BUILDING_SYNERGIES = new Map<BuildingType, Map<BuildingType, number>>([
  ["metalMine", new Map<BuildingType, number>([["fusionReactor", 0.15], ["roboticsFactory", 0.1]])],
  ["crystalMine", new Map<BuildingType, number>([["solarPlant", 0.12], ["researchLab", 0.08]])],
  ["deuteriumSynthesizer", new Map<BuildingType, number>([["fusionReactor", 0.2], ["bioDome", 0.05]])],
  ["solarPlant", new Map<BuildingType, number>([["metalMine", 0.05], ["crystalMine", 0.05]])],
  ["fusionReactor", new Map<BuildingType, number>([["deuteriumSynthesizer", 0.15], ["warpGate", 0.1]])],
  ["roboticsFactory", new Map<BuildingType, number>([["shipyard", 0.2], ["metalMine", 0.1]])],
  ["shipyard", new Map<BuildingType, number>([["roboticsFactory", 0.15], ["missileSilo", 0.1]])],
  ["researchLab", new Map<BuildingType, number>([["crystalMine", 0.1], ["darkMatterExtractor", 0.08]])],
  ["bioDome", new Map<BuildingType, number>([["terraformer", 0.2], ["deuteriumSynthesizer", 0.05]])],
  ["terraformer", new Map<BuildingType, number>([["bioDome", 0.15], ["metalMine", 0.05]])],
  ["darkMatterExtractor", new Map<BuildingType, number>([["fusionReactor", 0.1], ["warpGate", 0.12]])],
  ["warpGate", new Map<BuildingType, number>([["darkMatterExtractor", 0.1], ["fusionReactor", 0.08]])],
  ["missileSilo", new Map<BuildingType, number>([["shipyard", 0.1]])],
  ["allianceDepot", new Map<BuildingType, number>([])],
]) as ReadonlyMap<BuildingType, ReadonlyMap<BuildingType, number>>;

const SHIP_STATS = new Map<ShipType, Map<string, number>>([
  ["lightFighter", new Map<string, number>([["attack", 50], ["defense", 10], ["shield", 0], ["hull", 100], ["speed", 80], ["cargo", 50], ["fuel", 10], ["cost_metal", 3000], ["cost_crystal", 1000], ["cost_deuterium", 400]])],
  ["heavyFighter", new Map<string, number>([["attack", 150], ["defense", 40], ["shield", 50], ["hull", 300], ["speed", 50], ["cargo", 100], ["fuel", 25], ["cost_metal", 6000], ["cost_crystal", 4000], ["cost_deuterium", 1000]])],
  ["cruiser", new Map<string, number>([["attack", 400], ["defense", 100], ["shield", 200], ["hull", 800], ["speed", 30], ["cargo", 400], ["fuel", 50], ["cost_metal", 20000], ["cost_crystal", 7000], ["cost_deuterium", 2000]])],
  ["battleship", new Map<string, number>([["attack", 1000], ["defense", 300], ["shield", 500], ["hull", 2000], ["speed", 15], ["cargo", 1500], ["fuel", 100], ["cost_metal", 45000], ["cost_crystal", 15000], ["cost_deuterium", 4000]])],
  ["battlecruiser", new Map<string, number>([["attack", 700], ["defense", 200], ["shield", 350], ["hull", 1200], ["speed", 22], ["cargo", 800], ["fuel", 70], ["cost_metal", 30000], ["cost_crystal", 12000], ["cost_deuterium", 3000]])],
  ["destroyer", new Map<string, number>([["attack", 250], ["defense", 80], ["shield", 100], ["hull", 500], ["speed", 60], ["cargo", 200], ["fuel", 30], ["cost_metal", 12000], ["cost_crystal", 5000], ["cost_deuterium", 1500]])],
  ["bomber", new Map<string, number>([["attack", 600], ["defense", 50], ["shield", 100], ["hull", 400], ["speed", 40], ["cargo", 300], ["fuel", 60], ["cost_metal", 18000], ["cost_crystal", 8000], ["cost_deuterium", 2500]])],
  ["colonyShip", new Map<string, number>([["attack", 0], ["defense", 10], ["shield", 0], ["hull", 200], ["speed", 10], ["cargo", 5000], ["fuel", 200], ["cost_metal", 10000], ["cost_crystal", 20000], ["cost_deuterium", 1000]])],
  ["transporter", new Map<string, number>([["attack", 0], ["defense", 5], ["shield", 0], ["hull", 150], ["speed", 20], ["cargo", 10000], ["fuel", 80], ["cost_metal", 2000], ["cost_crystal", 2000], ["cost_deuterium", 500]])],
  ["recycler", new Map<string, number>([["attack", 0], ["defense", 5], ["shield", 0], ["hull", 100], ["speed", 15], ["cargo", 20000], ["fuel", 100], ["cost_metal", 4000], ["cost_crystal", 4000], ["cost_deuterium", 1000]])],
  ["espionageProbe", new Map<string, number>([["attack", 0], ["defense", 0], ["shield", 0], ["hull", 50], ["speed", 200], ["cargo", 0], ["fuel", 1], ["cost_metal", 100], ["cost_crystal", 2000], ["cost_deuterium", 0]])],
  ["satellite", new Map<string, number>([["attack", 0], ["defense", 0], ["shield", 0], ["hull", 50], ["speed", 0], ["cargo", 0], ["fuel", 0], ["cost_metal", 500], ["cost_crystal", 500], ["cost_deuterium", 0]])],
]) as ReadonlyMap<ShipType, ReadonlyMap<string, number>>;

const GOVERNMENT_MODIFIERS = new Map<GovernmentType, Map<string, number>>([
  ["democracy", new Map<string, number>([["production", 1.1], ["research", 1.05], ["happiness", 1.15], ["military", 0.9], ["trade", 1.1]])],
  ["oligarchy", new Map<string, number>([["production", 1.05], ["research", 1.1], ["happiness", 0.9], ["military", 1.05], ["trade", 1.15]])],
  ["dictatorship", new Map<string, number>([["production", 1.15], ["research", 0.9], ["happiness", 0.8], ["military", 1.2], ["trade", 0.85]])],
  ["theocracy", new Map<string, number>([["production", 0.95], ["research", 1.2], ["happiness", 1.05], ["military", 0.95], ["trade", 0.9]])],
  ["anarchy", new Map<string, number>([["production", 0.7], ["research", 0.7], ["happiness", 0.6], ["military", 0.8], ["trade", 0.7]])],
  ["federation", new Map<string, number>([["production", 1.05], ["research", 1.1], ["happiness", 1.1], ["military", 1.0], ["trade", 1.2]])],
  ["hive", new Map<string, number>([["production", 1.25], ["research", 0.85], ["happiness", 0.7], ["military", 1.3], ["trade", 0.6]])],
]) as ReadonlyMap<GovernmentType, ReadonlyMap<string, number>>;

const RACE_MODIFIERS = new Map<RaceType, Map<string, number>>([
  ["human", new Map<string, number>([["production", 1.0], ["research", 1.1], ["happiness", 1.05], ["military", 1.0], ["trade", 1.1]])],
  ["zolran", new Map<string, number>([["production", 1.15], ["research", 0.9], ["happiness", 0.95], ["military", 1.1], ["trade", 1.0]])],
  ["velathi", new Map<string, number>([["production", 0.9], ["research", 1.25], ["happiness", 1.1], ["military", 0.85], ["trade", 1.05]])],
  ["krex", new Map<string, number>([["production", 1.0], ["research", 0.85], ["happiness", 0.9], ["military", 1.3], ["trade", 0.8]])],
  ["netheril", new Map<string, number>([["production", 1.05], ["research", 1.15], ["happiness", 1.0], ["military", 0.95], ["trade", 1.15]])],
  ["synthoid", new Map<string, number>([["production", 1.2], ["research", 1.0], ["happiness", 0.85], ["military", 1.05], ["trade", 0.9]])],
]) as ReadonlyMap<RaceType, ReadonlyMap<string, number>>;

const TERRAIN_MODIFIERS = new Map<TerrainType, Map<string, number>>([
  ["openSpace", new Map<string, number>([["evasion", 0.0], ["attack", 1.0], ["defense", 1.0], ["speed", 1.0]])],
  ["asteroidField", new Map<string, number>([["evasion", 0.15], ["attack", 0.9], ["defense", 1.1], ["speed", 0.85]])],
  ["nebula", new Map<string, number>([["evasion", 0.25], ["attack", 0.8], ["defense", 0.9], ["speed", 0.7]])],
  ["blackHole", new Map<string, number>([["evasion", 0.05], ["attack", 0.6], ["defense", 0.5], ["speed", 0.4]])],
  ["wormhole", new Map<string, number>([["evasion", 0.0], ["attack", 1.0], ["defense", 1.0], ["speed", 1.5]])],
  ["deepSpace", new Map<string, number>([["evasion", 0.0], ["attack", 1.0], ["defense", 1.0], ["speed", 0.95]])],
  ["planetaryRing", new Map<string, number>([["evasion", 0.1], ["attack", 0.95], ["defense", 1.05], ["speed", 0.9]])],
]) as ReadonlyMap<TerrainType, ReadonlyMap<string, number>>;

const FORMATION_MODIFIERS = new Map<FormationType, Map<string, number>>([
  ["delta", new Map<string, number>([["attack", 1.1], ["defense", 0.95], ["evasion", 1.05], ["morale", 1.0]])],
  ["line", new Map<string, number>([["attack", 1.0], ["defense", 1.05], ["evasion", 0.95], ["morale", 1.0]])],
  ["sphere", new Map<string, number>([["attack", 0.9], ["defense", 1.2], ["evasion", 1.1], ["morale", 0.95]])],
  ["wedge", new Map<string, number>([["attack", 1.2], ["defense", 0.85], ["evasion", 1.1], ["morale", 1.05]])],
  ["cross", new Map<string, number>([["attack", 1.05], ["defense", 1.0], ["evasion", 1.0], ["morale", 1.05]])],
  ["defensive", new Map<string, number>([["attack", 0.85], ["defense", 1.3], ["evasion", 0.9], ["morale", 1.1]])],
  ["aggressive", new Map<string, number>([["attack", 1.3], ["defense", 0.75], ["evasion", 1.15], ["morale", 0.9]])],
]) as ReadonlyMap<FormationType, ReadonlyMap<string, number>>;

const COST_SCALING_BASE = 1.3;
const TIME_SCALING_BASE = 1.5;
const SHIELD_ABSORPTION_RATE = 0.7;
const SHIELD_REGEN_RATE = 0.1;
const CRITICAL_HIT_BASE = 0.05;
const EVASION_BASE = 0.05;
const EVASION_CAP = 0.95;
const RETREAT_THRESHOLD = 0.5;
const STORAGE_OVERFLOW_THRESHOLD = 0.8;
const STORAGE_PRODUCTION_PENALTY = 0.5;
const INFLATION_BASE = 1.0;
const INFLATION_GROWTH_RATE = 0.0001;
const MAX_COMBAT_ROUNDS = 20;
const FUEL_EFFICIENCY_BASE = 1.0;
const HYPERLANE_BONUS = 0.8;
const POPULATION_GROWTH_BASE = 0.02;
const HAPPINESS_GROWTH_THRESHOLD = 70;
const HAPPINESS_DECAY_THRESHOLD = 30;
const CRIME_PENALTY_THRESHOLD = 40;
const POLLUTION_PENALTY_THRESHOLD = 50;
const TRIGGER_VALUE = 100;

function calculateBaseProduction(
  building: BuildingState,
  level: number
): number {
  const baseOutput = BASE_PRODUCTION.get(building.type);
  if (!baseOutput) return 0;
  const total = Array.from(baseOutput.values()).reduce((sum, val) => sum + val, 0);
  return total * Math.pow(1.12, level - 1);
}

function calculateSynergyBonus(
  building: BuildingState,
  allBuildings: readonly BuildingState[]
): number {
  const synergies = BUILDING_SYNERGIES.get(building.type);
  if (!synergies) return 0;
  let bonus = 0;
  for (const [synergyType, bonusValue] of Array.from(synergies.entries())) {
    const adjacentCount = allBuildings.filter(b => b.type === synergyType).length;
    bonus += bonusValue * adjacentCount;
  }
  return Math.min(bonus, 0.5);
}

function calculateEnergyBalance(
  buildings: readonly BuildingState[],
  modifiers: EmpireModifiers
): Result<number, EconomyError> {
  let totalEnergy = 0;
  for (const building of buildings) {
    const production = BASE_PRODUCTION.get(building.type);
    if (production) {
      const energyValue = production.get("energy") ?? 0;
      const levelMultiplier = Math.pow(1.12, building.level - 1);
      totalEnergy += energyValue * levelMultiplier * building.efficiency;
    }
  }
  const adjustedEnergy = totalEnergy * modifiers.totalModifier;
  return Ok(adjustedEnergy);
}

function calculateStorageOverflowPenalty(
  current: number,
  maxStorage: number
): number {
  const ratio = current / maxStorage;
  if (ratio < STORAGE_OVERFLOW_THRESHOLD) return 1.0;
  const overflow = (ratio - STORAGE_OVERFLOW_THRESHOLD) / (1 - STORAGE_OVERFLOW_THRESHOLD);
  return 1.0 - (overflow * STORAGE_PRODUCTION_PENALTY);
}

function calculateDistance(
  origin: Coordinates,
  destination: Coordinates
): number {
  const dx = origin.galaxy - destination.galaxy;
  const dy = origin.system - destination.system;
  const dz = origin.position - destination.position;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateFuelConsumption(
  distance: number,
  fleet: FleetComposition,
  speedModifier: number
): number {
  const baseFuel = distance * fleet.totalMass * 0.001;
  const speedFuel = baseFuel * Math.pow(speedModifier, 1.5);
  return Math.ceil(speedFuel * FUEL_EFFICIENCY_BASE);
}

function calculateFleetSpeed(ships: ReadonlyMap<ShipType, number>): Result<number, FleetError> {
  let slowestSpeed = Infinity;
  let hasShips = false;
  for (const [shipType, count] of Array.from(ships.entries())) {
    if (count <= 0) continue;
    hasShips = true;
    const stats = SHIP_STATS.get(shipType);
    if (!stats) continue;
    const speed = stats.get("speed") ?? 0;
    if (speed < slowestSpeed) {
      slowestSpeed = speed;
    }
  }
  if (!hasShips) {
    return Err({
      code: "NO_FLEET",
      message: "No ships in fleet composition",
      details: new Map(),
    });
  }
  return Ok(slowestSpeed);
}

function selectTarget(
  attacker: CombatForce,
  defender: CombatForce
): Result<ShipType, CombatError> {
  const defenderShips = Array.from(defender.ships.entries()).filter(([, instance]) => instance.count > 0);
  if (defenderShips.length === 0) {
    return Err({
      code: "NO_DEFENDER",
      message: "No valid targets in defending force",
      details: new Map(),
    });
  }
  const weightedTargets: Array<{ type: ShipType; weight: number }> = [];
  for (const [shipType, instance] of defenderShips) {
    const threatWeight = instance.attack * instance.count * 0.4;
    const sizeWeight = instance.hull * instance.count * 0.3;
    const valueWeight = (instance.shield + instance.defense) * instance.count * 0.3;
    weightedTargets.push({ type: shipType, weight: threatWeight + sizeWeight + valueWeight });
  }
  const totalWeight = weightedTargets.reduce((sum, t) => sum + t.weight, 0);
  if (totalWeight <= 0) {
    return Err({
      code: "INVALID_TARGET",
      message: "Cannot calculate target weights",
      details: new Map(),
    });
  }
  let random = Math.random() * totalWeight;
  for (const target of weightedTargets) {
    random -= target.weight;
    if (random <= 0) {
      return Ok(target.type);
    }
  }
  return Ok(weightedTargets[weightedTargets.length - 1].type);
}

function calculateAttackRoll(
  attacker: CombatShipInstance,
  terrainMod: number,
  formationMod: number,
  round: number
): number {
  const baseAttack = attacker.attack;
  const roundPenalty = round > 5 ? 1 - ((round - 5) * 0.03) : 1;
  const variance = 1 + (Math.random() * 0.3 - 0.15);
  return baseAttack * terrainMod * formationMod * roundPenalty * variance;
}

function calculateDefense(
  defender: CombatShipInstance,
  terrainMod: number,
  formationMod: number
): number {
  const baseDefense = defender.defense;
  return baseDefense * terrainMod * formationMod;
}

function applyShieldAbsorption(
  damage: number,
  currentShield: number
): { readonly remainingDamage: number; readonly shieldDamage: number; readonly newShield: number } {
  const shieldAbsorbable = currentShield * SHIELD_ABSORPTION_RATE;
  if (damage <= shieldAbsorbable) {
    return {
      remainingDamage: 0,
      shieldDamage: damage / SHIELD_ABSORPTION_RATE,
      newShield: currentShield - (damage / SHIELD_ABSORPTION_RATE),
    };
  }
  const shieldDamage = currentShield;
  const remainingDamage = damage - shieldAbsorbable;
  return {
    remainingDamage,
    shieldDamage,
    newShield: 0,
  };
}

function checkEvasion(
  attackerSpeed: number,
  defenderSpeed: number,
  terrainMod: number
): boolean {
  const evasionChance = EVASION_BASE + ((defenderSpeed - attackerSpeed) * 0.001) + (terrainMod * 0.1);
  const clampedEvasion = Math.max(EVASION_BASE, Math.min(EVASION_CAP, evasionChance));
  return Math.random() < clampedEvasion;
}

function checkCriticalHit(
  baseChance: number,
  techBonus: number
): boolean {
  const totalChance = Math.min(baseChance + techBonus, 0.3);
  return Math.random() < totalChance;
}

function calculateCasualties(
  units: ReadonlyMap<ShipType, number>,
  damageReceived: ReadonlyMap<ShipType, number>
): ReadonlyMap<ShipType, number> {
  const casualties = new Map<ShipType, number>();
  for (const [shipType, count] of Array.from(units.entries())) {
    const damage = damageReceived.get(shipType) ?? 0;
    const stats = SHIP_STATS.get(shipType);
    if (!stats) continue;
    const hullPerShip = stats.get("hull") ?? 1;
    const killed = Math.min(count, Math.ceil(damage / hullPerShip));
    casualties.set(shipType, killed);
  }
  return casualties;
}

function calculateShieldRegeneration(
  currentShield: number,
  maxShield: number
): number {
  const regenAmount = maxShield * SHIELD_REGEN_RATE;
  return Math.min(currentShield + regenAmount, maxShield);
}

function checkRetreatCondition(
  combatPower: number,
  maxCombatPower: number
): boolean {
  return combatPower / maxCombatPower < RETREAT_THRESHOLD;
}

function calculateExperience(
  rounds: number,
  damageDealt: number,
  casualtiesInflicted: number,
  winner: boolean
): number {
  const baseXP = rounds * 10;
  const damageXP = damageDealt * 0.01;
  const casualtyXP = casualtiesInflicted * 50;
  const winnerBonus = winner ? 2 : 1;
  return Math.floor((baseXP + damageXP + casualtyXP) * winnerBonus);
}

function calculatePlunder(
  defenderColony: ColonyState,
  attackerFleet: FleetComposition
): ResourceCargo {
  const maxPlunderRatio = 0.1;
  const cargoCapacity = attackerFleet.cargoCapacity;
  let metalPlunder = Math.floor(defenderColony.buildings.reduce((sum, b) => {
    const metalProd = BASE_PRODUCTION.get(b.type)?.get("metal") ?? 0;
    return sum + metalProd * b.level;
  }, 0) * maxPlunderRatio);
  let crystalPlunder = Math.floor(defenderColony.buildings.reduce((sum, b) => {
    const crystalProd = BASE_PRODUCTION.get(b.type)?.get("crystal") ?? 0;
    return sum + crystalProd * b.level;
  }, 0) * maxPlunderRatio);
  let deuteriumPlunder = Math.floor(defenderColony.buildings.reduce((sum, b) => {
    const deuteriumProd = BASE_PRODUCTION.get(b.type)?.get("deuterium") ?? 0;
    return sum + deuteriumProd * b.level;
  }, 0) * maxPlunderRatio);
  const totalPlunder = metalPlunder + crystalPlunder + deuteriumPlunder;
  if (totalPlunder > cargoCapacity) {
    const ratio = cargoCapacity / totalPlunder;
    metalPlunder = Math.floor(metalPlunder * ratio);
    crystalPlunder = Math.floor(crystalPlunder * ratio);
    deuteriumPlunder = Math.floor(deuteriumPlunder * ratio);
  }
  return { metal: metalPlunder, crystal: crystalPlunder, deuterium: deuteriumPlunder, food: 0 };
}

function calculateResearchCost(
  baseCost: number,
  level: number
): number {
  return Math.floor(baseCost * Math.pow(COST_SCALING_BASE, level));
}

function calculateResearchTime(
  baseTime: number,
  level: number
): number {
  return Math.floor(baseTime * Math.pow(TIME_SCALING_BASE, level));
}

function checkPrerequisites(
  completedResearch: ReadonlyMap<string, number>,
  prerequisites: readonly { readonly techId: string; readonly level: number }[]
): boolean {
  for (const prereq of prerequisites) {
    const completedLevel = completedResearch.get(prereq.techId) ?? 0;
    if (completedLevel < prereq.level) {
      return false;
    }
  }
  return true;
}

function calculateBreakthroughChance(
  researchPoints: number,
  totalCost: number,
  modifiers: ResearchModifiers
): number {
  const progressRatio = researchPoints / totalCost;
  const baseChance = 0.02;
  const progressBonus = progressRatio * 0.05;
  const modifierBonus = (modifiers.totalModifier - 1) * 0.02;
  return Math.min(baseChance + progressBonus + modifierBonus, 0.15);
}

function calculatePopulationGrowth(
  colony: ColonyState,
  happiness: number,
  foodAvailable: number
): number {
  const baseGrowth = colony.population * POPULATION_GROWTH_BASE;
  const happinessModifier = happiness >= HAPPINESS_GROWTH_THRESHOLD ? 1.2 : happiness <= HAPPINESS_DECAY_THRESHOLD ? 0.6 : 1.0;
  const foodModifier = foodAvailable > 0 ? Math.min(foodAvailable / colony.population, 1.5) : 0.5;
  const housingModifier = colony.housing > 0 ? Math.min(colony.housing / colony.population, 1.0) : 0.3;
  return Math.floor(baseGrowth * happinessModifier * foodModifier * housingModifier);
}

function calculateHappiness(
  colony: ColonyState,
  amenities: number,
  crime: number,
  stability: number
): number {
  const baseHappiness = 50;
  const amenityBonus = Math.min(amenities * 2, 30);
  const crimePenalty = crime > CRIME_PENALTY_THRESHOLD ? (crime - CRIME_PENALTY_THRESHOLD) * 0.5 : 0;
  const stabilityBonus = stability * 0.2;
  return Math.max(0, Math.min(100, baseHappiness + amenityBonus - crimePenalty + stabilityBonus));
}

function calculateBuildingEfficiency(
  building: BuildingState,
  population: number,
  energy: number
): number {
  const populationFactor = Math.min(population / TRIGGER_VALUE, 1.0);
  const energyFactor = energy > 0 ? 1.0 : 0.5;
  const levelFactor = building.level / building.maxLevel;
  return populationFactor * energyFactor * (0.5 + levelFactor * 0.5);
}

function calculateDefenseStrength(
  colony: ColonyState
): number {
  const baseDefense = colony.defenses.missileBatteries * 100 + colony.defenses.orbitalCannons * 250;
  const shieldBonus = colony.defenses.shieldLevel * 500;
  const mineFieldBonus = colony.defenses.mineField * 75;
  const antiAirBonus = colony.defenses.antiAirDefense * 150;
  const buildingBonus = colony.buildings
    .filter(b => b.type === "missileSilo")
    .reduce((sum, b) => sum + b.level * 100, 0);
  const defenseBonus = colony.defenses.defenseBonus;
  return Math.floor((baseDefense + shieldBonus + mineFieldBonus + antiAirBonus + buildingBonus) * (1 + defenseBonus));
}

function calculateTradeValue(colony: ColonyState): number {
  const populationTrade = colony.population * 0.01;
  const happinessTrade = colony.happiness * 0.1;
  const buildingTrade = colony.buildings.reduce((sum, b) => sum + b.level * 0.5, 0);
  const tradeBuildingBonus = colony.buildings
    .filter(b => b.type === "allianceDepot")
    .reduce((sum, b) => sum + b.level * 2, 0);
  return Math.floor(populationTrade + happinessTrade + buildingTrade + tradeBuildingBonus);
}

function calculateInflation(serverTotalProduction: number, baseInflation: number): number {
  const inflationFactor = 1 + (serverTotalProduction * INFLATION_GROWTH_RATE);
  return baseInflation * inflationFactor;
}

function serializeGameState(state: GameState): Result<string, SerializeError> {
  try {
    const serializable = {
      version: GAME_ENGINE_VERSION,
      userId: state.userId,
      universeId: state.universeId,
      username: state.username,
      tick: state.tick,
      resources: state.resources,
      buildings: state.buildings,
      fleet: {
        ships: Array.from(state.fleet.ships.entries()),
        inTransit: state.fleet.inTransit,
        inCombat: state.fleet.inCombat,
        stationedAt: Array.from(state.fleet.stationedAt.entries()),
        fuel: state.fleet.fuel,
        maxFuel: state.fleet.maxFuel,
        totalCombatPower: state.fleet.totalCombatPower,
        cargoCapacity: state.fleet.cargoCapacity,
        usedCargoCapacity: state.fleet.usedCargoCapacity,
        supplyUsage: state.fleet.supplyUsage,
      },
      research: {
        currentResearch: state.research.currentResearch,
        completedResearch: Array.from(state.research.completedResearch.entries()),
        researchQueue: state.research.researchQueue,
        researchPoints: state.research.researchPoints,
        researchPointsPerTick: state.research.researchPointsPerTick,
        bonusMultiplier: state.research.bonusMultiplier,
        activeBreakthrough: state.research.activeBreakthrough,
        totalResearchSpent: state.research.totalResearchSpent,
        unlockedProjects: state.research.unlockedProjects,
      },
      colonies: state.colonies,
      diplomacy: state.diplomacy,
      achievements: state.achievements,
      lastTick: state.lastTick,
      createdAt: state.createdAt,
      government: state.government,
      race: state.race,
      totalScore: state.totalScore,
      rank: state.rank,
      kardashevLevel: state.kardashevLevel,
      empireName: state.empireName,
      settings: state.settings,
      serializedAt: Date.now(),
    };
    const json = JSON.stringify(serializable);
    if (json.length > 10 * 1024 * 1024) {
      return Err({
        code: "SIZE_EXCEEDED",
        message: `Serialized state exceeds 10MB limit: ${json.length} bytes`,
        details: new Map([["size", json.length]]),
      });
    }
    return Ok(json);
  } catch (e) {
    return Err({
      code: "ENCODING_FAILED",
      message: `Failed to serialize game state: ${String(e)}`,
      details: new Map(),
    });
  }
}

function deserializeGameState(data: string): Result<GameState, DeserializeError> {
  try {
    const parsed = JSON.parse(data) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return Err({
        code: "INVALID_JSON",
        message: "Data is not a valid JSON object",
        details: new Map(),
      });
    }
    const version = (parsed as { version?: number }).version;
    if (typeof version !== "number") {
      return Err({
        code: "MISSING_FIELDS",
        message: "Missing or invalid version field",
        details: new Map([["field", "version"]]),
      });
    }
    if (version !== GAME_ENGINE_VERSION) {
      const migrated = migrateVersion(parsed, version);
      if (!isOk(migrated)) {
        return Err({
          code: "MIGRATION_FAILED",
          message: `Failed to migrate from version ${version} to ${GAME_ENGINE_VERSION}`,
          details: new Map([["fromVersion", version], ["toVersion", GAME_ENGINE_VERSION]]),
        });
      }
    }
    const requiredFields = ["userId", "universeId", "tick", "resources", "fleet", "research", "colonies", "diplomacy"];
    for (const field of requiredFields) {
      if (!(field in parsed)) {
        return Err({
          code: "MISSING_FIELDS",
          message: `Missing required field: ${field}`,
          details: new Map([["field", field]]),
        });
      }
    }
    const state = parsed as unknown as GameState;
    const validation = validateGameState(state);
    if (!isOk(validation)) {
      const err = (validation as { ok: false; error: ValidationError }).error;
      return Err({
        code: "VALIDATION_FAILED",
        message: `Validation failed: ${err.message}`,
        details: new Map([["field", err.field]]),
      });
    }
    return Ok(validation.value);
  } catch (e) {
    return Err({
      code: "INVALID_JSON",
      message: `Failed to parse JSON: ${String(e)}`,
      details: new Map(),
    });
  }
}

function migrateVersion(
  data: Record<string, unknown>,
  fromVersion: number
): Result<Record<string, unknown>, string> {
  let current = { ...data };
  if (fromVersion < 2) {
    current.settings = current.settings ?? {
      language: "en",
      timezone: "UTC",
      notificationsEnabled: true,
      soundEnabled: true,
      autoRetaliate: false,
      showAdvancedStats: false,
      compactMode: false,
      defaultFleetSpeed: 1.0,
      favoriteColonies: [],
    };
  }
  if (fromVersion < 3) {
    current.kardashevLevel = current.kardashevLevel ?? 1;
    current.empireName = current.empireName ?? "Unknown Empire";
  }
  if (fromVersion < 4) {
    current.rank = current.rank ?? 0;
    current.totalScore = current.totalScore ?? 0;
  }
  current.version = GAME_ENGINE_VERSION;
  return Ok(current);
}

function validateGameState(state: unknown): Result<GameState, ValidationError> {
  if (!state || typeof state !== "object") {
    return Err({
      code: "INVALID_TYPE",
      message: "State must be an object",
      field: "root",
      expected: "object",
      received: typeof state,
    });
  }
  const obj = state as Record<string, unknown>;
  if (typeof obj.userId !== "string") {
    return Err({
      code: "INVALID_TYPE",
      message: "userId must be a string",
      field: "userId",
      expected: "string",
      received: typeof obj.userId,
    });
  }
  if (typeof obj.universeId !== "string") {
    return Err({
      code: "INVALID_TYPE",
      message: "universeId must be a string",
      field: "universeId",
      expected: "string",
      received: typeof obj.universeId,
    });
  }
  if (typeof obj.tick !== "number" || obj.tick < 0) {
    return Err({
      code: "OUT_OF_RANGE",
      message: "tick must be a non-negative number",
      field: "tick",
      expected: "non-negative number",
      received: String(obj.tick),
    });
  }
  if (!obj.resources || typeof obj.resources !== "object") {
    return Err({
      code: "MISSING_FIELD",
      message: "resources is required",
      field: "resources",
      expected: "ResourceState",
      received: String(obj.resources),
    });
  }
  const resourceValidation = validateResourceState(obj.resources);
  if (!isOk(resourceValidation)) {
    return resourceValidation as Result<GameState, ValidationError>;
  }
  if (!Array.isArray(obj.buildings)) {
    return Err({
      code: "INVALID_TYPE",
      message: "buildings must be an array",
      field: "buildings",
      expected: "BuildingState[]",
      received: typeof obj.buildings,
    });
  }
  if (!obj.fleet || typeof obj.fleet !== "object") {
    return Err({
      code: "MISSING_FIELD",
      message: "fleet is required",
      field: "fleet",
      expected: "FleetState",
      received: String(obj.fleet),
    });
  }
  const fleetValidation = validateFleetState(obj.fleet);
  if (!isOk(fleetValidation)) {
    return fleetValidation as Result<GameState, ValidationError>;
  }
  if (!obj.research || typeof obj.research !== "object") {
    return Err({
      code: "MISSING_FIELD",
      message: "research is required",
      field: "research",
      expected: "ResearchState",
      received: String(obj.research),
    });
  }
  if (!Array.isArray(obj.colonies)) {
    return Err({
      code: "INVALID_TYPE",
      message: "colonies must be an array",
      field: "colonies",
      expected: "ColonyState[]",
      received: typeof obj.colonies,
    });
  }
  if (!obj.diplomacy || typeof obj.diplomacy !== "object") {
    return Err({
      code: "MISSING_FIELD",
      message: "diplomacy is required",
      field: "diplomacy",
      expected: "DiplomacyState",
      received: String(obj.diplomacy),
    });
  }
  if (!Array.isArray(obj.achievements)) {
    return Err({
      code: "INVALID_TYPE",
      message: "achievements must be an array",
      field: "achievements",
      expected: "Achievement[]",
      received: typeof obj.achievements,
    });
  }
  if (typeof obj.lastTick !== "number") {
    return Err({
      code: "INVALID_TYPE",
      message: "lastTick must be a number",
      field: "lastTick",
      expected: "number",
      received: typeof obj.lastTick,
    });
  }
  return Ok(state as GameState);
}

function validateResourceState(resources: unknown): Result<ResourceState, ValidationError> {
  if (!resources || typeof resources !== "object") {
    return Err({
      code: "INVALID_TYPE",
      message: "resources must be an object",
      field: "resources",
      expected: "ResourceState",
      received: typeof resources,
    });
  }
  const obj = resources as Record<string, unknown>;
  const resourceTypes: readonly ResourceType[] = ["metal", "crystal", "deuterium", "energy", "credits", "food", "water", "darkMatter"];
  for (const resourceType of resourceTypes) {
    const resource = obj[resourceType] as Record<string, unknown> | undefined;
    if (!resource || typeof resource !== "object") {
      return Err({
        code: "MISSING_FIELD",
        message: `Missing resource: ${resourceType}`,
        field: `resources.${resourceType}`,
        expected: "ResourceAmount",
        received: String(resource),
      });
    }
    if (typeof resource.current !== "number" || resource.current < 0) {
      return Err({
        code: "OUT_OF_RANGE",
        message: `${resourceType}.current must be non-negative`,
        field: `resources.${resourceType}.current`,
        expected: "non-negative number",
        received: String(resource.current),
      });
    }
    if (typeof resource.production !== "number") {
      return Err({
        code: "INVALID_TYPE",
        message: `${resourceType}.production must be a number`,
        field: `resources.${resourceType}.production`,
        expected: "number",
        received: typeof resource.production,
      });
    }
    if (typeof resource.storage !== "number" || resource.storage < 0) {
      return Err({
        code: "OUT_OF_RANGE",
        message: `${resourceType}.storage must be non-negative`,
        field: `resources.${resourceType}.storage`,
        expected: "non-negative number",
        received: String(resource.storage),
      });
    }
    if (typeof resource.maxStorage !== "number" || resource.maxStorage <= 0) {
      return Err({
        code: "OUT_OF_RANGE",
        message: `${resourceType}.maxStorage must be positive`,
        field: `resources.${resourceType}.maxStorage`,
        expected: "positive number",
        received: String(resource.maxStorage),
      });
    }
    if (resource.current > resource.maxStorage) {
      return Err({
        code: "INCONSISTENT_DATA",
        message: `${resourceType}.current exceeds maxStorage`,
        field: `resources.${resourceType}`,
        expected: "current <= maxStorage",
        received: `current=${resource.current}, maxStorage=${resource.maxStorage}`,
      });
    }
  }
  return Ok(resources as ResourceState);
}

function validateFleetState(fleet: unknown): Result<FleetState, ValidationError> {
  if (!fleet || typeof fleet !== "object") {
    return Err({
      code: "INVALID_TYPE",
      message: "fleet must be an object",
      field: "fleet",
      expected: "FleetState",
      received: typeof fleet,
    });
  }
  const obj = fleet as Record<string, unknown>;
  if (!(obj.ships instanceof Map) && !(typeof obj.ships === "object" && obj.ships !== null)) {
    return Err({
      code: "INVALID_TYPE",
      message: "fleet.ships must be a Map or object",
      field: "fleet.ships",
      expected: "Map<ShipType, number>",
      received: typeof obj.ships,
    });
  }
  if (typeof obj.fuel !== "number" || obj.fuel < 0) {
    return Err({
      code: "OUT_OF_RANGE",
      message: "fleet.fuel must be non-negative",
      field: "fleet.fuel",
      expected: "non-negative number",
      received: String(obj.fuel),
    });
  }
  if (typeof obj.maxFuel !== "number" || obj.maxFuel <= 0) {
    return Err({
      code: "OUT_OF_RANGE",
      message: "fleet.maxFuel must be positive",
      field: "fleet.maxFuel",
      expected: "positive number",
      received: String(obj.maxFuel),
    });
  }
  if (obj.fuel > obj.maxFuel) {
    return Err({
      code: "INCONSISTENT_DATA",
      message: "fleet.fuel exceeds maxFuel",
      field: "fleet",
      expected: "fuel <= maxFuel",
      received: `fuel=${obj.fuel}, maxFuel=${obj.maxFuel}`,
    });
  }
  if (!Array.isArray(obj.inTransit)) {
    return Err({
      code: "INVALID_TYPE",
      message: "fleet.inTransit must be an array",
      field: "fleet.inTransit",
      expected: "FleetMission[]",
      received: typeof obj.inTransit,
    });
  }
  if (!Array.isArray(obj.inCombat)) {
    return Err({
      code: "INVALID_TYPE",
      message: "fleet.inCombat must be an array",
      field: "fleet.inCombat",
      expected: "string[]",
      received: typeof obj.inCombat,
    });
  }
  return Ok(fleet as FleetState);
}

function calculateResourceProduction(
  buildings: readonly BuildingState[],
  modifiers: EmpireModifiers,
  tick: number
): Result<ResourceProduction, EconomyError> {
  const energyResult = calculateEnergyBalance(buildings, modifiers);
  if (!energyResult.ok) {
    const err = (energyResult as { ok: false; error: EconomyError }).error;
    return Err({
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }
  const energyBalance = energyResult.value;
  if (energyBalance < 0) {
    return Err({
      code: "ENERGY_DEFICIT",
      message: "Energy balance is negative",
      details: new Map<string, number | string>([["energyBalance", energyBalance]]),
    });
  }
  const production: ResourceProduction = {
    metal: 0,
    crystal: 0,
    deuterium: 0,
    energy: energyBalance,
    credits: 0,
    food: 0,
    water: 0,
    darkMatter: 0,
    energyBalance,
    storageOverflowPenalty: 1.0,
  };
  for (const building of buildings) {
    const baseProd = BASE_PRODUCTION.get(building.type);
    if (!baseProd) continue;
    const synergyBonus = calculateSynergyBonus(building, buildings);
    const efficiency = building.efficiency;
    const levelMultiplier = Math.pow(1.12, building.level - 1);
    for (const [resource, baseAmount] of Array.from(baseProd.entries())) {
      if (resource === "energy") continue;
      const amount = baseAmount * levelMultiplier * efficiency * (1 + synergyBonus) * modifiers.totalModifier;
      switch (resource) {
        case "metal":
          production.metal += amount;
          break;
        case "crystal":
          production.crystal += amount;
          break;
        case "deuterium":
          production.deuterium += amount;
          break;
        case "credits":
          production.credits += amount;
          break;
        case "food":
          production.food += amount;
          break;
        case "water":
          production.water += amount;
          break;
        case "darkMatter":
          production.darkMatter += amount;
          break;
      }
    }
  }
  const overflowPenalty = Math.min(
    calculateStorageOverflowPenalty(production.metal, 10000),
    calculateStorageOverflowPenalty(production.crystal, 10000),
    calculateStorageOverflowPenalty(production.deuterium, 5000)
  );
  production.storageOverflowPenalty = overflowPenalty;
  production.metal *= overflowPenalty;
  production.crystal *= overflowPenalty;
  production.deuterium *= overflowPenalty;
  production.food *= overflowPenalty;
  production.darkMatter *= overflowPenalty;
  production.credits *= overflowPenalty;
  const inflation = calculateInflation(production.metal + production.crystal + production.deuterium, INFLATION_BASE);
  production.credits /= inflation;
  return Ok(production);
}

function calculateFleetTravel(
  origin: ColonyState,
  destination: Coordinates,
  fleet: FleetComposition,
  speed: number
): Result<FleetMovement, FleetError> {
  if (speed <= 0 || speed > 10) {
    return Err({
      code: "SPEED_INVALID",
      message: "Speed must be between 0 and 10",
      details: new Map([["speed", speed]]),
    });
  }
  if (fleet.ships.size === 0) {
    return Err({
      code: "NO_FLEET",
      message: "No ships in fleet",
      details: new Map(),
    });
  }
  const slowestSpeedResult = calculateFleetSpeed(fleet.ships);
  if (!slowestSpeedResult.ok) {
    const err = (slowestSpeedResult as { ok: false; error: FleetError }).error;
    return Err({
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }
  const slowestSpeed = slowestSpeedResult.value;
  const effectiveSpeed = slowestSpeed * speed;
  const distance = calculateDistance(origin.coordinates, destination);
  if (distance <= 0) {
    return Err({
      code: "INVALID_DESTINATION",
      message: "Distance to destination is zero or negative",
      details: new Map([["distance", distance]]),
    });
  }
  const fuelRequired = calculateFuelConsumption(distance, fleet, speed);
  const fuelSufficient = fleet.fuelCapacity >= fuelRequired;
  if (!fuelSufficient) {
    return Err({
      code: "FUEL_INSUFFICIENT",
      message: "Not enough fuel for this journey",
      details: new Map([
        ["required", fuelRequired],
        ["available", fleet.fuelCapacity],
      ]),
    });
  }
  const travelTime = Math.ceil(distance / effectiveSpeed) * TRIGGER_VALUE;
  const arrivalTime = Date.now() + travelTime;
  const arrivalX = destination.galaxy;
  const arrivalY = destination.system;
  const arrivalZ = destination.position;
  const route: Coordinates[] = [origin.coordinates, destination];
  return Ok({
    missionId: `mission_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    travelTime,
    arrivalTime,
    fuelRequired,
    fuelSufficient,
    distance,
    speed: effectiveSpeed,
    route,
    arrivalX,
    arrivalY,
    arrivalZ,
  });
}

function resolveCombatRound(
  attacker: CombatForce,
  defender: CombatForce,
  terrain: TerrainType,
  round: number
): Result<CombatRoundResult, CombatError> {
  if (round > MAX_COMBAT_ROUNDS) {
    return Err({
      code: "BATTLE_IN_PROGRESS",
      message: "Maximum combat rounds exceeded",
      details: new Map([["maxRounds", MAX_COMBAT_ROUNDS]]),
    });
  }
  if (round < 1) {
    return Err({
      code: "INVALID_FORMATION",
      message: "Round must be at least 1",
      details: new Map([["round", round]]),
    });
  }
  const attackerShips = Array.from(attacker.ships.entries()).filter(([, instance]) => instance.count > 0);
  const defenderShips = Array.from(defender.ships.entries()).filter(([, instance]) => instance.count > 0);
  if (attackerShips.length === 0) {
    return Err({
      code: "NO_ATTACKER",
      message: "Attacker has no ships",
      details: new Map(),
    });
  }
  if (defenderShips.length === 0) {
    return Err({
      code: "NO_DEFENDER",
      message: "Defender has no ships",
      details: new Map(),
    });
  }
  const terrainMods = TERRAIN_MODIFIERS.get(terrain) ?? new Map([["evasion", 0], ["attack", 1], ["defense", 1], ["speed", 1]]);
  const attackerFormationMods = FORMATION_MODIFIERS.get(attacker.formation) ?? new Map([["attack", 1], ["defense", 1], ["evasion", 1], ["morale", 1]]);
  const defenderFormationMods = FORMATION_MODIFIERS.get(defender.formation) ?? new Map([["attack", 1], ["defense", 1], ["evasion", 1], ["morale", 1]]);
  let attackerDamageDealt = 0;
  let defenderDamageDealt = 0;
  const attackerCasualties = new Map<ShipType, number>();
  const defenderCasualties = new Map<ShipType, number>();
  let attackerShieldDamage = 0;
  let defenderShieldDamage = 0;
  let attackerCriticalHits = 0;
  let defenderCriticalHits = 0;
  let attackerEvasions = 0;
  let defenderEvasions = 0;
  for (const [attackerType, attackerInstance] of attackerShips) {
    const targetResult = selectTarget(attacker, defender);
    if (!targetResult.ok) continue;
    const targetType = targetResult.value;
    const defenderInstance = defender.ships.get(targetType);
    if (!defenderInstance || defenderInstance.count <= 0) continue;
    for (let i = 0; i < attackerInstance.count; i++) {
      if (defenderInstance.count <= 0) break;
      const terrainMod = terrainMods.get("attack") ?? 1;
      const formationMod = attackerFormationMods.get("attack") ?? 1;
      const attackRoll = calculateAttackRoll(attackerInstance, terrainMod, formationMod, round);
      const defenderTerrainMod = terrainMods.get("defense") ?? 1;
      const defenderFormationMod = defenderFormationMods.get("defense") ?? 1;
      const defenseRoll = calculateDefense(defenderInstance, defenderTerrainMod, defenderFormationMod);
      const rawDamage = Math.max(0, attackRoll - defenseRoll);
      const shieldResult = applyShieldAbsorption(rawDamage, defenderInstance.shield);
      defenderShieldDamage += shieldResult.shieldDamage;
      const hullDamage = shieldResult.remainingDamage;
      const isCritical = checkCriticalHit(attackerInstance.criticalChance * CRITICAL_HIT_BASE, attacker.techBonus);
      const finalHullDamage = isCritical ? hullDamage * 2 : hullDamage;
      if (isCritical) attackerCriticalHits++;
      defenderInstance.hull -= finalHullDamage;
      attackerDamageDealt += finalHullDamage;
      if (defenderInstance.hull <= 0) {
        defenderCasualties.set(targetType, (defenderCasualties.get(targetType) ?? 0) + 1);
        defenderInstance.count--;
      }
    }
  }
  for (const [defenderType, defenderInstance] of defenderShips) {
    const targetResult = selectTarget(defender, attacker);
    if (!targetResult.ok) continue;
    const targetType = targetResult.value;
    const attackerInstance = attacker.ships.get(targetType);
    if (!attackerInstance || attackerInstance.count <= 0) continue;
    for (let i = 0; i < defenderInstance.count; i++) {
      if (attackerInstance.count <= 0) break;
      const terrainMod = terrainMods.get("attack") ?? 1;
      const formationMod = defenderFormationMods.get("attack") ?? 1;
      const attackRoll = calculateAttackRoll(defenderInstance, terrainMod, formationMod, round);
      const attackerTerrainMod = terrainMods.get("defense") ?? 1;
      const attackerFormationMod = attackerFormationMods.get("defense") ?? 1;
      const defenseRoll = calculateDefense(attackerInstance, attackerTerrainMod, attackerFormationMod);
      const rawDamage = Math.max(0, attackRoll - defenseRoll);
      const shieldResult = applyShieldAbsorption(rawDamage, attackerInstance.shield);
      attackerShieldDamage += shieldResult.shieldDamage;
      const hullDamage = shieldResult.remainingDamage;
      const isCritical = checkCriticalHit(defenderInstance.criticalChance * CRITICAL_HIT_BASE, defender.techBonus);
      const finalHullDamage = isCritical ? hullDamage * 2 : hullDamage;
      if (isCritical) defenderCriticalHits++;
      attackerInstance.hull -= finalHullDamage;
      defenderDamageDealt += finalHullDamage;
      if (attackerInstance.hull <= 0) {
        attackerCasualties.set(targetType, (attackerCasualties.get(targetType) ?? 0) + 1);
        attackerInstance.count--;
      }
    }
  }
  for (const [, instance] of attackerShips) {
    if (instance.count > 0) {
      instance.shield = calculateShieldRegeneration(instance.shield, instance.maxShield);
    }
  }
  for (const [, instance] of defenderShips) {
    if (instance.count > 0) {
      instance.shield = calculateShieldRegeneration(instance.shield, instance.maxShield);
    }
  }
  let attackerPower = 0;
  for (const [, instance] of Array.from(attacker.ships.entries())) {
    attackerPower += (instance.attack + instance.defense + instance.shield + instance.hull) * instance.count;
  }
  let defenderPower = 0;
  for (const [, instance] of Array.from(defender.ships.entries())) {
    defenderPower += (instance.attack + instance.defense + instance.shield + instance.hull) * instance.count;
  }
  const retreatCheck = checkRetreatCondition(attackerPower + defenderPower, attackerPower + defenderPower + 1);
  const totalCasualties = Array.from(attackerCasualties.values()).reduce((a, b) => a + b, 0) +
    Array.from(defenderCasualties.values()).reduce((a, b) => a + b, 0);
  const experienceGained = calculateExperience(round, attackerDamageDealt + defenderDamageDealt, totalCasualties, attackerPower > defenderPower);
  return Ok({
    round,
    attackerDamageDealt,
    defenderDamageDealt,
    attackerCasualties,
    defenderCasualties,
    attackerShieldDamage,
    defenderShieldDamage,
    attackerCriticalHits,
    defenderCriticalHits,
    attackerEvasions,
    defenderEvasions,
    plunder: { metal: 0, crystal: 0, deuterium: 0, food: 0 },
    retreatCheck,
    experienceGained,
    combatPowerAttacker: attackerPower,
    combatPowerDefender: defenderPower,
  });
}

function calculateResearchProgress(
  currentResearch: ResearchProject,
  researchPoints: number,
  modifiers: ResearchModifiers
): Result<ResearchProgress, ResearchError> {
  if (currentResearch.progress >= currentResearch.totalCost) {
    return Err({
      code: "MAX_LEVEL_REACHED",
      message: "Research already complete",
      details: new Map(),
    });
  }
  const effectivePoints = researchPoints * modifiers.totalModifier;
  const newProgress = currentResearch.progress + effectivePoints;
  const totalRequired = calculateResearchCost(currentResearch.totalCost, currentResearch.level);
  const percentageComplete = Math.min((newProgress / totalRequired) * 100, 100);
  const breakthroughChance = calculateBreakthroughChance(newProgress, totalRequired, modifiers);
  const breakthroughTriggered = Math.random() < breakthroughChance;
  const breakthroughBonus = breakthroughTriggered ? totalRequired * 0.1 : 0;
  const adjustedProgress = newProgress + breakthroughBonus;
  const canComplete = adjustedProgress >= totalRequired;
  const remainingPoints = Math.max(0, totalRequired - adjustedProgress);
  const ticksRemaining = effectivePoints > 0 ? Math.ceil(remainingPoints / effectivePoints) : Infinity;
  const completionTime = canComplete ? 0 : ticksRemaining * TRIGGER_VALUE;
  return Ok({
    progress: adjustedProgress,
    totalRequired,
    percentageComplete: Math.min(((adjustedProgress / totalRequired) * 100), 100),
    estimatedTicksRemaining: ticksRemaining,
    breakthroughTriggered,
    breakthroughBonus,
    canComplete,
    completionTime,
  });
}

function processColonyTick(
  colony: ColonyState,
  gameState: GameState
): Result<ColonyTickResult, ColonyError> {
  if (colony.population < 0) {
    return Err({
      code: "POPULATION_OVERFLOW",
      message: "Colony has negative population",
      details: new Map([["population", colony.population]]),
    });
  }
  if (colony.happiness < 10) {
    return Err({
      code: "HAPPINESS_CRITICAL",
      message: "Colony happiness is critically low",
      details: new Map([["happiness", colony.happiness]]),
    });
  }
  if (colony.stability < 20) {
    return Err({
      code: "STABILITY_LOW",
      message: "Colony stability is dangerously low",
      details: new Map([["stability", colony.stability]]),
    });
  }
  const foodAvailable = gameState.resources.food.current;
  if (foodAvailable <= 0 && colony.population > 100) {
    return Err({
      code: "FOOD_SHORTAGE",
      message: "Insufficient food for population",
      details: new Map([["food", foodAvailable], ["population", colony.population]]),
    });
  }
  const energyAvailable = gameState.resources.energy.current;
  if (energyAvailable <= 0) {
    return Err({
      code: "ENERGY_DEFICIT",
      message: "No energy available for colony operations",
      details: new Map([["energy", energyAvailable]]),
    });
  }
  const populationDelta = calculatePopulationGrowth(colony, colony.happiness, foodAvailable);
  const newHappiness = calculateHappiness(colony, colony.amenities, colony.crime, colony.stability);
  const happinessDelta = newHappiness - colony.happiness;
  const crimeDelta = colony.happiness < HAPPINESS_DECAY_THRESHOLD ? 2 : colony.happiness > HAPPINESS_GROWTH_THRESHOLD ? -1 : 0;
  const pollutionDelta = colony.population > colony.housing * 2 ? 3 : colony.population < colony.housing * 0.5 ? -2 : 0;
  const stabilityDelta = colony.crime > CRIME_PENALTY_THRESHOLD ? -2 : colony.happiness > 70 ? 1 : 0;
  let productionModifier = 1.0;
  for (const building of colony.buildings) {
    const efficiency = calculateBuildingEfficiency(building, colony.population, energyAvailable);
    productionModifier *= (0.5 + efficiency * 0.5);
  }
  productionModifier = Math.max(0.1, Math.min(1.5, productionModifier));
  const defenseModifier = colony.defenses.defenseBonus;
  const tradeValueChange = calculateTradeValue(colony);
  const events: GameEvent[] = [];
  if (colony.happiness < 20) {
    events.push({
      id: `event_${Date.now()}_unrest`,
      type: "colony",
      severity: "critical",
      message: `Colony ${colony.name} is experiencing severe unrest`,
      data: new Map<string, number | string>([["colonyId", colony.id], ["happiness", colony.happiness]]),
      timestamp: Date.now(),
      acknowledged: false,
    });
  }
  if (colony.crime > 60) {
    events.push({
      id: `event_${Date.now()}_crime`,
      type: "colony",
      severity: "warning",
      message: `Crime rate is high in ${colony.name}`,
      data: new Map<string, number | string>([["colonyId", colony.id], ["crime", colony.crime]]),
      timestamp: Date.now(),
      acknowledged: false,
    });
  }
  if (colony.population >= colony.maxPopulation * 0.95) {
    events.push({
      id: `event_${Date.now()}_overcrowding`,
      type: "colony",
      severity: "warning",
      message: `${colony.name} is nearing maximum capacity`,
      data: new Map<string, number | string>([["colonyId", colony.id], ["population", colony.population], ["maxPopulation", colony.maxPopulation]]),
      timestamp: Date.now(),
      acknowledged: false,
    });
  }
  const buildingEfficiencyChanges = new Map<string, number>();
  for (const building of colony.buildings) {
    const oldEfficiency = building.efficiency;
    const newEfficiency = calculateBuildingEfficiency(building, colony.population, energyAvailable);
    if (Math.abs(newEfficiency - oldEfficiency) > 0.01) {
      buildingEfficiencyChanges.set(building.id, newEfficiency);
    }
  }
  const housingChange = colony.population > colony.housing * 1.5 ? -1 : colony.population < colony.housing * 0.8 ? 1 : 0;
  const amenitiesChange = colony.amenities > colony.population * 0.3 ? -1 : colony.amenities < colony.population * 0.1 ? 1 : 0;
  return Ok({
    populationDelta,
    happinessDelta,
    stabilityDelta,
    crimeDelta,
    pollutionDelta,
    productionModifier,
    defenseModifier,
    tradeValueChange,
    events,
    buildingEfficiencyChanges,
    housingChange,
    amenitiesChange,
  });
}

export {
  Result,
  Option,
  Ok,
  Err,
  Some,
  None,
  isOk,
  isSome,
  unwrapOr,
  mapResult,
  flatMapResult,
  combineResults,
  mapOption,
  flatMapOption,
  BuildingType,
  ShipType,
  ResourceType,
  GovernmentType,
  RaceType,
  TerrainType,
  PlanetType,
  TreatyType,
  AchievementCategory,
  ResourceAmount,
  ResourceState,
  BuildingState,
  FleetState,
  FleetMission,
  ResourceCargo,
  ResearchProject,
  ResearchEffect,
  ResearchState,
  ColonyState,
  DefenseState,
  Coordinates,
  DiplomacyState,
  Alliance,
  War,
  WarCasualties,
  PeaceOffer,
  PeaceTerm,
  Treaty,
  TradeAgreement,
  IntelligenceState,
  IntelReport,
  Achievement,
  AchievementReward,
  EmpireModifiers,
  GameState,
  UserSettings,
  TickResult,
  ResourceDelta,
  BuildingCompletion,
  FleetArrival,
  FleetMissionSuccess,
  GameEvent,
  DefenseUpdate,
  ResourceProduction,
  EconomyError,
  FleetError,
  CombatError,
  ResearchError,
  ColonyError,
  SerializeError,
  DeserializeError,
  ValidationError,
  CombatForce,
  CombatShipInstance,
  FormationType,
  CombatRoundResult,
  CombatOutcome,
  ResearchModifiers,
  ResearchProgress,
  ColonyTickResult,
  FleetMovement,
  FleetComposition,
  BASE_PRODUCTION,
  BUILDING_SYNERGIES,
  SHIP_STATS,
  GOVERNMENT_MODIFIERS,
  RACE_MODIFIERS,
  TERRAIN_MODIFIERS,
  FORMATION_MODIFIERS,
  COST_SCALING_BASE,
  TIME_SCALING_BASE,
  SHIELD_ABSORPTION_RATE,
  SHIELD_REGEN_RATE,
  CRITICAL_HIT_BASE,
  EVASION_BASE,
  EVASION_CAP,
  RETREAT_THRESHOLD,
  STORAGE_OVERFLOW_THRESHOLD,
  STORAGE_PRODUCTION_PENALTY,
  INFLATION_BASE,
  INFLATION_GROWTH_RATE,
  MAX_COMBAT_ROUNDS,
  TRIGGER_VALUE,
  calculateBaseProduction,
  calculateSynergyBonus,
  calculateEnergyBalance,
  calculateStorageOverflowPenalty,
  calculateDistance,
  calculateFuelConsumption,
  calculateFleetSpeed,
  selectTarget,
  calculateAttackRoll,
  calculateDefense,
  applyShieldAbsorption,
  checkEvasion,
  checkCriticalHit,
  calculateCasualties,
  calculateShieldRegeneration,
  checkRetreatCondition,
  calculateExperience,
  calculatePlunder,
  calculateResearchCost,
  calculateResearchTime,
  checkPrerequisites,
  calculateBreakthroughChance,
  calculatePopulationGrowth,
  calculateHappiness,
  calculateBuildingEfficiency,
  calculateDefenseStrength,
  calculateTradeValue,
  calculateInflation,
  serializeGameState,
  deserializeGameState,
  migrateVersion,
  validateGameState,
  validateResourceState,
  validateFleetState,
  calculateResourceProduction,
  calculateFleetTravel,
  resolveCombatRound,
  calculateResearchProgress,
  processColonyTick,
};
