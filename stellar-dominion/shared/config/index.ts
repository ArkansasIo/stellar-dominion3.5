// Central configuration export point
export { GAME_CONFIG, GOVERNMENT_MULTIPLIERS, RACE_BONUSES } from './gameConfig';
export { SYSTEM_CONFIG, getEnvConfig } from './systemConfig';

// Progression System Exports
export {
  ProgressionSystem,
  SCALING_PROFILES,
  TIER_REWARDS,
  getProgressionMilestone,
  type ProgressionStats,
  type ScalingConfig,
  type ProgressedEntity,
} from './progressionSystem';

// Buildings Progression Exports
export {
  BUILDING_CONFIGS,
  BUILDINGS,
  getBuildingConfig,
  calculateBuildingCost,
  calculateBuildingTime,
  calculateBuildingProduction,
  getBuildingsByTier,
  isBuildingUnlocked,
  type Building,
  type BuildingType,
  type BuildingCategory,
  type BuildingStats,
  type BuildingConfig,
} from './buildingsProgression';

// Units Progression Exports
export {
  UNITS,
  LIGHT_FIGHTER,
  HEAVY_FIGHTER,
  CORVETTE,
  FRIGATE,
  DESTROYER,
  BATTLESHIP,
  CARRIER,
  DREADNOUGHT,
  TITAN,
  ASCENDED_WARSHIP,
  calculateUnitCost,
  calculateUnitBuildTime,
  calculateUnitStats,
  calculateFleetStats,
  getUnitsForTier,
  getUnitsByType,
  getUnitsByRole,
  type UnitType,
  type UnitTier,
  type UnitStats,
  type Unit,
} from './unitsProgression';

// Unit Systems Exports
export {
  UNIT_SYSTEM_TEMPLATES,
  STARSHIP_BLUEPRINTS,
  TRAINING_STATE_MULTIPLIER,
  createDefaultPlayerUnitSystemState,
  getUnitTemplatesByDomain,
  getUnitTemplate,
  getBlueprint,
  queueUnitTraining,
  untrainUnits,
  processTrainingQueue,
  simulateUnitCombat,
  queueStarshipConstruction,
  processConstructionYard,
  type ResourceBundle,
  type UnitDomain,
  type UnitTrainingState,
  type UnitTemplate,
  type UnitPoolEntry,
  type TrainingOrder,
  type CombatSideUnit,
  type CombatSideInput,
  type CombatSimulationResult,
  type StarshipBlueprint,
  type ConstructionOrder,
  type ConstructionYardState,
  type PlayerUnitSystemState,
} from './unitSystemsConfig';

// Government Leader Types Exports
export {
  GOVERNMENT_LEADER_TYPES_23,
  GOVERNMENT_LEADER_TYPE_COUNT,
  getGovernmentLeadersByType,
  getGovernmentLeadersByClass,
  getGovernmentLeaderTypes,
  getGovernmentLeaderClasses,
  type GovernmentLeaderType,
} from './governmentLeadersConfig';

// Research Progression Exports
export {
  ALL_TECHNOLOGIES,
  ENERGY_TECHNOLOGIES,
  PROPULSION_TECHNOLOGIES,
  WEAPON_TECHNOLOGIES,
  DEFENSE_TECHNOLOGIES,
  COMPUTER_TECHNOLOGIES,
  MEGASTRUCTURE_TECHNOLOGIES,
  QUANTUM_TECHNOLOGIES,
  EXOTIC_TECHNOLOGIES,
  RESEARCH_EXPANSION_TECHNOLOGIES,
  RESEARCH_EXPANSION_CONFIGS,
  RESEARCH_CONFIGS,
  calculateResearchCost,
  calculateResearchTime,
  getResearchByBranch,
  getResearchForTier,
  getPrerequisites,
  isResearchUnlocked,
  getUnlockedByResearch,
  type ResearchBranch,
  type ResearchConfig,
  type Research,
} from './researchProgression';
export {
  ENTITY_ARCHETYPES_90,
  ENTITY_ARCHETYPES_GROUPED,
  ENTITY_ARCHETYPES_BY_CATEGORY,
  ENTITY_ARCHETYPES_META,
  type ArchetypeFamily,
  type EntityArchetype,
} from './entityArchetypesConfig';
export {
  BUILDING_ARCHETYPES_90,
  FACTORY_JOB_ARCHETYPES_90,
  BUILDING_ARCHETYPES_GROUPED_BY_CATEGORY,
  FACTORY_JOB_ARCHETYPES_GROUPED_BY_JOB_CATEGORY,
  BUILDING_FACTORY_JOB_META,
  type BuildingArchetype,
  type FactoryJobArchetype,
} from './buildingFactoryJobArchetypesConfig';
export {
  CIVILIZATION_MILITARY_JOB_ARCHETYPES_90,
  CIVILIZATION_MILITARY_JOB_META,
  getJobArchetypesByDomain,
  getJobArchetypesByClass,
  getJobArchetypeById,
  estimateFoodWaterForJobAssignments,
  estimateProductivityForAssignments,
  type JobDomain,
  type JobRarity,
  type CivilizationMilitaryJobArchetype,
} from './civilizationMilitaryJobConfig';
export {
  FRAME_SYSTEMS,
  POPULATION_SYSTEM,
  FOOD_SYSTEM,
  WATER_SYSTEM,
  computeResourcePressure,
  estimatePopulationGrowth,
  estimateFoodDemand,
  estimateWaterDemand,
  type PopulationClass,
  type ResourcePressureState,
  type FrameSystemTier,
} from './lifeSupportSystemsConfig';
export { 
  PROGRESSION_CONSTANTS,
  ProgressionTables,
  calculateExpForLevel,
  calculateTotalExpForLevel,
  getLevelFromExperience,
  calculateTierForLevel,
  calculateStatValue,
  calculateAllStats,
  createEntityProgression,
  addExperience,
  setLevelAndTier,
  getProgressionSummary,
  getTierName,
  getTierColor,
} from './progressionSystemConfig';
export {
  ENEMY_RACES,
  ENEMY_WORLDS,
  AI_BEHAVIORS,
  EnemyAI,
  getEnemyRace,
  getEnemyWorld,
  getWorldsForRace,
  createAI,
} from './enemyRacesConfig';
export {
  COMMANDER_TALENT_TREE,
  COMMANDER_MAX_LEVEL,
  COMMANDER_MAX_TIER,
  getCommanderTierForLevel,
  getCommanderTitleByTier,
  type CommanderTalentBranch,
  type CommanderTalentNode,
  type CommanderTitleTier,
  type CommanderTalentTreeDefinition,
} from './commanderTalentTreeConfig';
export {
  STOREFRONT_ITEMS,
  SEASON_PASS_CONFIG,
  BATTLE_PASS_CONFIG,
  BATTLE_PASS_MISSIONS,
  STORY_TOTAL_ACTS,
  STORY_CHAPTERS_PER_ACT,
  STORY_MISSIONS_PER_ACT,
  STORY_MAIN_MISSIONS_PER_ACT,
  STORY_SIDE_MISSIONS_PER_ACT,
  STORY_ACTS,
  STORY_MAIN_MISSIONS,
  STORY_MAIN_MISSIONS_50,
  STORY_SIDE_MISSIONS,
  STORY_MISSIONS_ALL,
  getStoreItemsByCategory,
  getStoreFeaturedItems,
  calculateStorePurchaseTotals,
  getSeasonPassTrackReward,
  getSeasonPassTierProgress,
  getBattlePassTrackReward,
  getBattlePassTierProgress,
  type StoreCurrency,
  type StorefrontItem,
  type SeasonPassReward,
  type BattlePassMissionTemplate,
  type BattlePassReward,
  type StoryMissionTemplate,
  type StoryActDefinition,
} from './liveOpsContentConfig';
export {
  MEGASTRUCTURES,
  MEGASTRUCTURE_CATEGORY_METADATA,
  MegastructureProgression,
  createMegastructure,
  upgradeMegastructureLevel,
  upgradeMegastructureTier,
  toggleMegastructure,
  updateMegastructureEfficiency,
  getOffensivePower,
  getDefensivePower,
  getStrategicValue,
  getMegastructuresByType,
  getMegastructuresByClass,
  getMegastructuresBySubClass,
  getAllMegastructureTypes,
  getAllMegastructureClasses,
  getAllMegastructureSubClasses,
  getMegastructureCategoryMeta,
  getMegastructureTierFromLevel,
  calculateMegastructureConstructionCost,
  calculateMegastructureUpgradeCost,
  getMegastructureCatalogByCategory,
  type MegastructureCost,
  type MegastructureTemplate,
} from './megastructuresConfig';
export {
  MAX_TIER,
  MAX_LEVEL,
  ENTITY_LEVEL_MATRIX,
  COMBAT_EFFECT_LIBRARY,
  BATTLE_SYSTEM_PROFILES,
  EVENT_BOSSES,
  NPC_WORLD_TEMPLATES,
  UNIVERSE_EVENT_TEMPLATES,
  getTierForLevel,
  getRankAndTitle,
  buildProgressionSnapshot,
  getProgressionCatalogForTrack,
  getEventSystemSummary,
  type EntityTrack,
  type CombatAlignment,
  type BattleMode,
  type EffectType,
  type CombatAttributes,
  type CombatSubAttributes,
  type CoreCombatStats,
  type CombatEffectTemplate,
  type EntityRankTitle,
  type ProgressionSnapshot,
  type BattleSystemProfile,
  type EventBossTemplate,
  type NpcWorldTemplate,
  type UniverseEventTemplate,
} from './empireCombatUniverseSystemsConfig';

// Interstellar Travel & Navigation Exports
export {
  STARGATES,
  FTL_DRIVES,
  WORMHOLES,
  calculateTravelTime,
  calculateTravelCost,
  calculateDistance,
  buildTravelRoute,
  getStargate,
  getAllStargates,
  getActiveStargates,
  getNearbyWormholes,
  getFTLDrive,
  getFTLDrivesByClass,
  getFTLDrivesByTechLevel,
  type Coordinates,
  type TravelRoute,
  type Stargate,
  type Jumpgate,
  type Wormhole,
  type FTLDrive,
} from './interstellarTravelConfig';

// Navigation & Exploration Exports
export {
  STAR_CLASSES,
  PLANET_CHARACTERISTICS,
  HAZARD_TYPES_DATA,
  SENSOR_ARRAYS,
  calculateNavigationDifficulty,
  calculateExplorationReward,
  getSensorRange,
  canNavigateHazard,
  estimateExplorationTime,
  selectOptimalRoute,
  type CelestialObject,
  type CelestialObjectType,
  type Star,
  type StarClass,
  type Planet,
  type PlanetType,
  type NavigationHazard,
  type HazardType,
  type ExplorationSite,
  type ChartData,
  type SensorArray,
  type NavigationSkill,
  type Navigator,
} from './navigationConfig';

// Planet Types Exports
export {
  PLANET_TYPES,
  ALL_PLANET_TYPES,
  PLANET_STATISTICS,
  getPlanetType,
  getPlanetsByFamily,
  getPlanetsByClass,
  getPlanetsByRarity,
  getHabitablePlanets,
  getResourceRichPlanets,
  calculateColonyCost,
  getPlanetProductionBonus,
  describePlanet,
  type PlanetStats as PlanetTypeStats,
  type PlanetType as ConfigPlanetType,
} from './planetTypesConfig';

// Starfleet Biome Catalog Exports
export {
  STARFLEET_BIOME_CATALOG_90,
  STARFLEET_BIOME_CATALOG_META,
  getBiomeById,
  getBiomesByEnvironment,
  getBiomesByLetter,
  getBiomesByRarity,
  type BiomeEnvironmentType,
  type BiomeRarity,
  type StarfleetBiomeEntry,
} from './starfleetBiomeCatalogConfig';

// Universe Generation & State Exports
export {
  STAR_TYPE_DISTRIBUTION,
  UniverseGenerator,
  createUniverseState,
  getTotalSystems,
  estimateUniverseSize,
  type UniverseConfig,
  type UniverseState,
  type GameEvent,
  type EventEffect,
  type FactionPresence,
  type GenerationSeed,
  type ProcGenerationParams,
  type GeneratedSystem,
} from './universeGenerationConfig';

// Technology Tree Exports
export {
  ARMOR_TECHS,
  SHIELD_TECHS,
  WEAPONS_TECHS,
  PROPULSION_TECHS,
  SENSOR_TECHS,
  POWER_TECHS,
  COMPUTING_TECHS,
  ENGINEERING_TECHS,
  RESOURCES_TECHS,
  MEDICAL_TECHS,
  HYPERSPACE_TECHS,
  TECH_PROGRESSION,
  TechTreeManager,
  techTreeManager,
  getTotalTechnologies,
  getAllTechnologies,
  getTechsByBranch,
  getTechById,
  calculateResearchPath,
  getTreeStats,
  type TechBranch,
  type TechClass,
  type TechType,
  type TechStat,
  type TechStats,
  type TechnologyNode,
} from './technologyTreeConfig';

// Expanded Technology Tree Exports
export {
  EXPANDED_ARMOR_TECHS,
  EXPANDED_SHIELD_TECHS,
  EXPANDED_WEAPON_TECHS,
  EXPANDED_PROPULSION_TECHS,
  EXPANDED_SENSOR_TECHS,
  EXPANDED_POWER_TECHS,
  EXPANDED_COMPUTING_TECHS,
  EXPANDED_ENGINEERING_TECHS,
  EXPANDED_RESOURCE_TECHS,
  EXPANDED_MEDICAL_TECHS,
  EXPANDED_HYPERSPACE_TECHS,
  getAllExpandedTechnologies,
  getExpandedTechCount,
} from './technologyTreeExpandedConfig';

// Custom Technology Tree Exports
export {
  CUSTOM_TECHS,
  EXPERIMENTAL_TECHS,
  FACTION_TECHS,
  ANCIENT_TECHS,
  EVENT_TECHS,
  getCustomTechsByClass,
  getCustomTechsByRarity,
  getAvailableCustomTechs,
  getFactionTechs,
  getExperimentalTechs,
  getActiveEventTechs,
  calculateCustomTechResearchCost,
} from './technologyTreeCustomConfig';

// Civilization Subsystems Exports
export {
  GOVERNANCE_SUBSYSTEMS,
  COMMERCE_SUBSYSTEMS,
  EDUCATION_SUBSYSTEMS,
  CULTURE_SUBSYSTEMS,
  getAllSubsystems,
  getSubsystemsByType,
  getSubsystemById,
  getAvailableSubsystems,
  calculateSubsystemBonuses,
  getPrerequisiteChain,
  calculateUpgradeCost,
  getSubsystemEfficiency,
  type CivilizationSubsystem,
} from './civilizationSubsystemsConfig';

// Army Subsystems Exports
export {
  GROUND_FORCES,
  ARMOR_VEHICLES,
  MECH_UNITS,
  SUPPORT_UNITS,
  AIR_UNITS,
  getAllArmySubsystems,
  getArmySubsystemsByType,
  getArmySubsystemsByRole,
  getArmySubsystemById,
  getAvailableArmyUnits,
  calculateSquadCombatPower,
  calculateFormationBonus,
  calculateTotalCrewRequired,
  calculateTotalCost,
  type ArmySubsystem,
} from './armySubsystemsConfig';

// Game Assets System Exports
export {
  ASSET_SIZES,
  MENU_ASSETS,
  PLANET_ASSETS,
  SHIP_ASSETS,
  TECH_BRANCH_ASSETS,
  BACKGROUND_ASSETS,
  getAssetById,
  getAssetPlaceholder,
  getAssetsByCategory,
  getAssetPack,
  generatePlaceholderAssetManifest,
} from './gameAssetsConfig';

// OGame Catalog Exports
export {
  OGAME_CATALOG_CATEGORIES,
  OGAME_CATALOG_ENTRIES,
  OGAME_CATALOG_ENTRY_MAP,
  type OgameCatalogEntryType,
  type OgameCatalogCost,
  type OgameCatalogCategoryDefinition,
  type OgameCatalogEntryDefinition,
} from './ogameCatalogConfig';

// Research Queue & Lab System Exports
export {
  LAB_TIERS,
  RESEARCH_BONUSES,
  RESEARCH_PENALTIES,
  RESEARCH_ACCELERATION,
  RESEARCH_FAILURE,
  RESEARCH_QUEUE_RULES,
  GOVERNMENT_RESEARCH_BONUSES,
  DISCOVERY_BONUSES,
  type LabType,
  type LabSpecialization,
  type ResearchPriority,
  type QueueStatus,
  type ResearchLabConfig,
  type ResearchQueuedItem,
  type ResearchBonus,
  type ResearchModifier,
} from './researchQueueConfig';

// Re-export for convenience
export * as GameConfig from './gameConfig';
export * as SystemConfig from './systemConfig';
export * as EntityArchetypesConfig from './entityArchetypesConfig';
export * as ProgressionSystemConfig from './progressionSystemConfig';
export * as EnemyRacesConfig from './enemyRacesConfig';
export * as MegastructuresConfig from './megastructuresConfig';
export * as InterstellarTravelConfig from './interstellarTravelConfig';
export * as NavigationConfig from './navigationConfig';
export * as PlanetTypesConfig from './planetTypesConfig';
export * as StarfleetBiomeCatalogConfig from './starfleetBiomeCatalogConfig';
export * as UniverseGenerationConfig from './universeGenerationConfig';
export * as TechnologyTreeConfig from './technologyTreeConfig';
export * as TechnologyTreeExpandedConfig from './technologyTreeExpandedConfig';
export * as TechnologyTreeCustomConfig from './technologyTreeCustomConfig';
export * as GameAssetsConfig from './gameAssetsConfig';
export * as ResearchQueueConfig from './researchQueueConfig';
export * as TurnSystemConfig from './turnSystemConfig';
export * as ResearchXPConfig from './researchXPConfig';
export * as MultiplayerBonusesConfig from './multiplayerBonusesConfig';
export * as CustomLabConfig from './customLabConfig';
export * as AchievementSystemConfig from './achievementSystemConfig';
export * as EntitiesExpansionConfig from './entitiesExpansionConfig';
export * as AutoBuyResourcesConfig from './autoBuyResourcesConfig';
export * as ResearchTradingConfig from './researchTradingConfig';
export * as UnitSystemsConfig from './unitSystemsConfig';
export * as GovernmentLeadersConfig from './governmentLeadersConfig';
