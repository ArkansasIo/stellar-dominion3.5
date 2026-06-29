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

// Government Progression Tree Exports
export {
  GOVERNMENT_MAX_LEVEL,
  GOVERNMENT_MAX_TIER,
  LEVELS_PER_TIER,
  GOVERNMENT_PROGRESSION_TREE_DEFINITION,
  getGovernmentNodeById,
  getNodesByPillar,
  getNodesByTier,
  getNodesRequiringNode,
  canUnlockNode,
  calculateNodeCost,
  calculateUnlockTime,
  type GovernmentPillar,
  type GovernmentNodeEffect,
  type GovernmentProgressionNode,
  type GovernmentTreeDefinition,
} from './governmentProgressionTreeConfig';

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
  BUILDING_ARCHETYPES,
  BUILDING_ARCHETYPES_90,
  FACTORY_JOB_ARCHETYPES,
  FACTORY_JOB_ARCHETYPES_90,
  BUILDING_ARCHETYPES_GROUPED_BY_CATEGORY,
  BUILDING_ARCHETYPES_GROUPED_BY_SUBCATEGORY,
  FACTORY_JOB_ARCHETYPES_GROUPED_BY_JOB_CATEGORY,
  BUILDING_FACTORY_JOB_META,
  type BuildingArchetype,
  type BuildingArchetypeStats,
  type BuildingArchetypeSubStats,
  type BuildingArchetypeAttributes,
  type BuildingArchetypeSubAttributes,
  type FactoryJobArchetype,
  type FactoryJobArchetypeStats,
  type FactoryJobArchetypeSubStats,
  type FactoryJobArchetypeAttributes,
  type FactoryJobArchetypeSubAttributes,
} from './buildingFactoryJobArchetypesConfig';
export {
  BUILDING_FACTORY_TIER_CATALOG,
  BUILDING_FACTORY_TIER_META,
  getTierDefinition,
  getTiersByClass,
  getTiersBySubClass,
  getTiersByRank,
  getTierClassNames,
  getTierSubClassNames,
  type BuildingFactoryTierDefinition,
  type TierClassName,
  type TierSubClassName,
  type TierTypeName,
  type TierSubTypeName,
  type TierRankName,
  type TierStats,
  type TierSubStats,
  type TierAttributes,
  type TierSubAttributes,
} from './buildingFactoryTierConfig';
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
  MEGASTRUCTURE_TIER_CLASS_TABLE,
  MEGASTRUCTURE_TIER_TITLES,
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
  getMegastructuresBySubCategory,
  getAllMegastructureTypes,
  getAllMegastructureClasses,
  getAllMegastructureSubClasses,
  getAllMegastructureSubCategories,
  getMegastructureCategoryMeta,
  getMegastructureSubCategories,
  getMegastructureTierFromLevel,
  getMegastructureTierClassMeta,
  getMegastructureRank,
  getMegastructureTitle,
  buildDefaultSubjects,
  buildDefaultSubAttributes,
  buildDefaultSubStats,
  calculateMegastructureConstructionCost,
  calculateMegastructureUpgradeCost,
  getMegastructureCatalogByCategory,
  type MegastructureCost,
  type MegastructureTemplate,
  type MegastructureClass,
  type MegastructureSubCategory,
  type MegastructureTierClass,
  type MegastructureTierSubClass,
  type MegastructureRank,
  type MegastructureSubjectDomain,
  type MegastructureSubject,
  type MegastructureSubStats,
  type MegastructureSubAttributes,
  type MegastructureTierClassMeta,
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
  THREE_D_VIEW_ASSETS,
  getAssetById,
  getAssetPlaceholder,
  getAssetsByCategory,
  getAssetPack,
  generatePlaceholderAssetManifest,
} from './gameAssetsConfig';

export {
  OGAMEX_ASSET_CATEGORIES,
  OGAMEX_ASSET_COLLECTIONS,
  OGAMEX_FEATURED_ASSETS,
  getOgamexAssetsByCategory,
  type OgamexAssetCategory,
  type OgamexAssetReference,
} from './ogamexAssetsConfig';

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
export * as OgamexAssetsConfig from './ogamexAssetsConfig';
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
export * as GovernmentProgressionTreeConfig from './governmentProgressionTreeConfig';
export * as StarshipSystemsAndStructuresTaxonomyConfig from './starshipSystemsAndStructuresTaxonomyConfig';
export * as ConstructorYardSystemsConfig from './constructorYardSystemsConfig';

// Resource Elements Exports
export {
  RESOURCE_ELEMENTS,
  RESOURCE_ELEMENT_ECONOMIES,
  RESOURCE_ELEMENTS_META,
  getElement,
  getElementsByCategory,
  getElementsByRank,
  getElementsForTier,
  calculateElementExtractionRate,
  calculateElementStorageCapacity,
  calculateElementMarketValue,
  calculateElementDecay,
  computeSubStats,
  getResourceElementLevelProfile,
  getTierClass,
  getTierSubClass,
  // Individual element constants
  SOLAR_PLASMA,
  STELLAR_ASH,
  NEBULA_GAS,
  NEBULA_DUST,
  COLD_PLASMA,
  HOT_PLASMA,
  QUANTUM_FIBER,
  SUPERPOSED_CRYSTAL,
  RIFT_SHARD,
  FOLD_ESSENCE,
  TEMPORAL_ECHO,
  TEMPORAL_SHARD,
  PSIONIC_CRYSTAL,
  BIO_RESIN,
  NANO_ALLOY,
  RESONANT_LATTICE,
  GRAVITON_ORE,
  EM_FLUX_COMPOUND,
  // Types
  type ResourceElement,
  type ResourceElementCategory,
  type ResourceElementSubCategory,
  type ResourceElementType,
  type ResourceElementSubType,
  type ResourceElementRank,
  type TierClass,
  type TierSubClass,
  type ResourceElementStats,
  type ResourceElementSubStats,
  type ResourceElementAttributes,
  type ResourceElementSubAttributes,
  type ResourceElementSubject,
  type ResourceElementLevelProfile,
  type ResourceElementEconomy,
} from './resourceElementsConfig';
export * as ResourceElementsConfig from './resourceElementsConfig';
export * as OrbitalStationsConfig from './orbitalStationsConfig';

// Orbital Stations Exports
export {
  ORBITAL_STATION_CATEGORIES,
  ALL_ORBITAL_STATIONS,
  ORBITAL_STATION_STATS,
  COMMAND_CONTROL_STATIONS,
  ENERGY_SYSTEMS_STATIONS,
  DEFENSE_SYSTEMS_STATIONS,
  MANUFACTURING_STATIONS,
  RESEARCH_DEVELOPMENT_STATIONS,
  LOGISTICS_SUPPLY_STATIONS,
  COMMUNICATIONS_STATIONS,
  HABITATION_STATIONS,
  MINING_EXTRACTION_STATIONS,
  TRADE_COMMERCE_STATIONS,
  MILITARY_OPERATIONS_STATIONS,
  SHIPYARD_OPERATIONS_STATIONS,
  INTELLIGENCE_STATIONS,
  DIPLOMACY_STATIONS,
  TERRAFORMING_STATIONS,
  ANOMALY_RESEARCH_STATIONS,
  MEDICAL_STATIONS,
  MEGASTRUCTURE_SUPPORT_STATIONS,
  getTierRank,
  getClassTitle,
  getOrbitalStationsByCategory,
  getOrbitalStationsBySubCategory,
  getOrbitalStationsByClass,
  getOrbitalStationsByType,
  getOrbitalStationsByTierRange,
  getCategoryMeta,
  type OrbitalStation,
  type OrbitalStationStats,
  type OrbitalStationSubStats,
  type OrbitalStationAttributes,
  type OrbitalStationSubAttributes,
  type OrbitalStationSubject,
  type OrbitalCategoryMeta,
  type OrbitalSubCategoryMeta,
  type OrbitalStationClass,
  type OrbitalStationSubClass,
  type OrbitalStationCategory,
  type OrbitalStationSubCategory,
  type OrbitalStationType,
  type OrbitalStationSubType,
  type OrbitalStationRank,
} from './orbitalStationsConfig';

// Starship Systems & Structures Taxonomy Exports (240 entries)
export {
  STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_240,
  STARSHIP_SYSTEMS_AND_STRUCTURES_TAXONOMY_META,
  getTaxonomyEntryById,
  getTaxonomyEntriesByCategory,
  getTaxonomyEntriesByClass,
  getTaxonomyEntriesBySubClass,
  getTaxonomyEntriesByType,
  getTaxonomyEntriesBySubType,
  getTaxonomyEntriesByRarity,
  type TaxonomyRarity,
  type TaxonomyCategory,
  type TaxonomyProfile,
  type StarshipStructureTaxonomyEntry,
} from './starshipSystemsAndStructuresTaxonomyConfig';

// Constructor Yard Systems Exports
export {
  MOTHERSHIP_CONSTRUCTOR_YARD_99,
  STARSHIP_SHIPYARD_99,
  CONSTRUCTOR_YARD_CATALOG,
  CONSTRUCTOR_YARD_META,
  getYardEntriesByDomain,
  getYardEntryById,
  getYardEntriesByRarity,
  getYardEntriesByTierRange,
  calculateYardUpgradeCost,
  calculateYardUpgradeTimeSec,
  calculateYardScaledStats,
  calculateYardScaledSubStats,
  type YardDomain,
  type YardStats,
  type YardSubStats,
  type YardEffect,
  type YardBuff,
  type YardDebuff,
  type YardEntry,
} from './constructorYardSystemsConfig';

// Staryard System Exports
export {
  STARYARD_CATEGORIES,
  STARYARD_SUB_CATEGORIES,
  STARYARD_TIER_CATALOG,
  STARYARD_META,
  getStaryardTierEntry,
  getStaryardTiersByCategory,
  getStaryardTiersBySubCategory,
  getStaryardTiersByClass,
  getStaryardCategoryById,
  getStaryardSubCategoryById,
  type StaryardStats,
  type StaryardSubStats,
  type StaryardAttributes,
  type StaryardSubAttributes,
  type StaryardSubject,
  type StaryardTierEntry,
  type StaryardCategory,
  type StaryardSubCategory,
} from './staryardConfig';
export * as StaryardConfig from './staryardConfig';
export * as BuildingFactoryJobArchetypesConfig from './buildingFactoryJobArchetypesConfig';
export * as BuildingFactoryTierConfig from './buildingFactoryTierConfig';
export {
  RESEARCH_TECH_CATEGORIES,
  RESEARCH_TECH_SUBCATEGORIES,
  RESEARCH_TECH_TYPES,
  RESEARCH_TECH_SUBTYPES,
  RESEARCH_TECH_TIERS,
  RESEARCH_TECH_LEVELS,
  RESEARCH_TECH_LIBRARY,
  RESEARCH_TECH_META,
  getResearchTechByCategory,
  getResearchTechBySubCategory,
  getResearchTechByTierRange,
  getResearchTechById,
  getResearchTechByClass,
  getResearchTechByType,
  getResearchTechBySubType,
  getResearchTechTier,
  getResearchTechLevel,
  type ResearchTechCategory,
  type ResearchTechSubCategory,
  type ResearchTechType,
  type ResearchTechSubType,
  type ResearchTechClass,
  type ResearchTechSubClass,
  type ResearchTechTier,
  type ResearchTechLevel,
  type ResearchTechRecord,
} from './researchTechnologyLibraryConfig';
export * as ResearchTechnologyLibraryConfig from './researchTechnologyLibraryConfig';
export {
  RESEARCH_PROGRAM_LIBRARY_240,
  TECHNOLOGY_SYSTEM_LIBRARY_240,
  RESEARCH_JOB_SYSTEMS,
  TECHNOLOGY_JOB_SYSTEMS,
  KNOWLEDGE_SUPPORT_UNITS,
  ALL_KNOWLEDGE_JOBS,
  ALL_KNOWLEDGE_LIBRARY_ENTRIES,
  KNOWLEDGE_OPERATIONS_META,
  getKnowledgeEntriesByDomain,
  getKnowledgeEntriesByCategory,
  getKnowledgeEntriesBySubCategory,
  getKnowledgeJobsForEntry,
  getKnowledgeUnitsForEntry,
  getKnowledgeEffectSummary,
  calculateKnowledgeOutput,
  getJobCoverageForCategory,
  getUnitCoverageForCategory,
  type KnowledgeDomain,
  type KnowledgeJobCategory,
  type KnowledgeJobSubCategory,
  type KnowledgeJobClass,
  type KnowledgeUnitCategory,
  type KnowledgeUnitClass,
  type KnowledgeYieldProfile,
  type KnowledgeMechanicBundle,
  type KnowledgeCatalogEntry,
  type KnowledgeJobRole,
  type KnowledgeSupportUnit,
} from './researchTechnologyOperationsConfig';
export * as ResearchTechnologyOperationsConfig from './researchTechnologyOperationsConfig';
export {
  CIVILIAN_STRUCTURES,
  CIVILIAN_STRUCTURES_META,
  CIVILIAN_TIER_CONFIG,
  CIVILIAN_LEVEL_CONFIG,
  CIVILIAN_RANKS,
  CIVILIAN_SUBCLASS_RANKS,
  getCivilianStructuresByCategory,
  getCivilianStructuresBySubCategory,
  getCivilianStructuresByClass,
  getCivilianStructuresByTierRange,
  getCivilianStructureById,
  type CivilianStructure,
  type CivilianCategory,
  type CivilianSubCategory,
  type CivilianType,
  type CivilianSubType,
  type CivilianClass,
  type CivilianSubClass,
  type CivilianStructureStats,
  type CivilianStructureSubStats,
  type CivilianStructureAttributes,
  type CivilianStructureSubAttributes,
  type CivilianStructureSubjectDetails,
} from './civilianStructuresConfig';
export * as CivilianStructuresConfig from './civilianStructuresConfig';

// Framing Building Structures Exports
export {
  FRAMING_CONSTANTS,
  FRAMING_TIER_RANKS,
  FRAMING_SUBJECTS,
  FRAMING_STRUCTURES,
  FRAMING_CATEGORY_METADATA,
  FRAMING_CATALOG_STATS,
  getFramingTierRank,
  calculateFramingStructureScaledValues,
  getFramingStructuresByCategory,
  getFramingStructuresBySubCategory,
  getFramingStructuresByClass,
  getFramingStructuresForTier,
  getFramingStructureById,
  isFramingStructureUnlocked,
  getFramingCategoriesOrdered,
  getFramingSubject,
  getFramingStructureSubjects,
  type FramingCategory,
  type FramingSubCategory,
  type FramingClass,
  type FramingSubClass,
  type FramingType,
  type FramingSubType,
  type TierRank,
  type FramingStats,
  type FramingSubStats,
  type FramingAttributes,
  type FramingSubAttributes,
  type FramingSubjectDetail,
  type FramingSubject,
  type FramingStructureStats,
  type FramingStructureAttributes,
  type FramingStructureDescriptions,
  type FramingStructureUnlockRequirements,
  type FramingStructure,
  type FramingCategoryMeta,
} from './framingBuildingStructuresConfig';
export * as FramingBuildingStructuresConfig from './framingBuildingStructuresConfig';

// Ship Classification System Exports
export * as ShipClassificationSystem from './shipClassificationSystem';

// Classic Game Configuration (ported from Xenobe Rage / Blacknova Traders)
export {
  CLASSIC_GAME_CONFIG,
  SCHEDULER_CONFIG,
  UNIVERSE_CONFIG,
  GAME_IDENTITY,
  RESOURCE_ECONOMY,
  COMBAT_CONFIG as CLASSIC_COMBAT_CONFIG,
  NEWBIE_CONFIG,
  TURN_CONFIG,
  DEVICE_PRICES,
  DEVICE_LIMITS,
  PRODUCTION_RATES,
  COLONIZATION_CONFIG,
  BASE_COSTS,
  UPGRADE_SYSTEM,
  BANK_CONFIG,
  BOUNTY_CONFIG,
  FEDERATION_CONFIG,
  SCANNER_CONFIG,
  DEGRADATION_CONFIG,
  XENBE_CONFIG,
  TRADING_CONFIG,
  FACILITY_CONFIG,
  SERVER_CONFIG as CLASSIC_SERVER_CONFIG,
  type ClassicGameConfig,
} from './classicGameConfig';

// UniEngine Extended Ships Exports
export {
  UNIVERSE_EXTENDED_SHIPS,
  UNIVERSE_EXTENDED_SHIP_MAP,
} from './universeExtendedShips';

// UniEngine Extended Defense Exports
export {
  UNIVERSE_EXTENDED_DEFENSES,
  UNIVERSE_EXTENDED_DEFENSE_MAP,
} from './universeExtendedDefense';

// UniEngine Extended Tasks Exports
export {
  UNIVERSE_EXTENDED_TASKS,
  UNIVERSE_EXTENDED_TASK_IDS,
  UNIVERSE_EXTENDED_TASK_COUNT,
  type UniEngineTaskJob,
  type UniEngineTaskReward,
  type UniEngineTaskDefinition,
  type UniEngineTaskCategory,
} from './universeExtendedTasks';

// Title Screen Configuration
export {
  DEFAULT_TITLE_SCREEN_CONFIG,
  getTitleScreenConfigForTheme,
  getLoadingMessage,
  getTitleScreenThemeConfig,
  type TitleScreenConfig,
  type TitleScreenThemeOverrides,
} from './titleScreenConfig';

// Master CSS Configuration
export {
  DEFAULT_MASTER_CSS_CONFIG,
  DEFAULT_CSS_VARIABLES,
  DEFAULT_BUTTON_CONFIG,
  DEFAULT_PANEL_CONFIG,
  DEFAULT_SIDEBAR_CONFIG,
  DEFAULT_BACKGROUND_CONFIG,
  DEFAULT_NAVIGATION_CONFIG,
  DEFAULT_FORM_CONFIG,
  DEFAULT_DATA_DISPLAY_CONFIG,
  DEFAULT_TITLE_SCREEN_CSS_CONFIG,
  DEFAULT_BREAKPOINTS,
  DEFAULT_ANIMATIONS,
  DEFAULT_ACCESSIBILITY,
  DEFAULT_FEATURES,
  getCSSConfigForTheme,
  generateCSSVariables,
  getCSSVariable,
  isModuleEnabled,
  getModuleConfig,
  type MasterCSSConfig,
  type CSSVariables,
  type CSSModuleConfig,
  type CSSBreakpointConfig,
  type CSSAnimationConfig,
  type CSSAccessibilityConfig,
} from './cssConfig';

// Alliance System Config Exports
export {
  ALLIANCE_SYSTEM_CONFIG,
  type AllianceRank,
  type AllianceFeature,
  type AllianceMissionTemplate,
  type AllianceWarConfig,
  type AllianceTaxConfig,
  type AllianceTerritoryConfig,
  type AllianceEventConfig,
} from './allianceSystemConfig';

// Missions Config Exports
export {
  MISSION_TYPES,
  MISSION_DIFFICULTIES,
  getMissionReward,
  getMissionsByCategory,
  getMissionById,
  type MissionType,
  type MissionDifficulty,
  type MissionCategory,
  type MissionDefinition,
  type MissionDifficultyConfig,
} from './missionsConfig';

// Planet Defenses Config Exports
export {
  PLANET_DEFENSES,
  getDefenseById,
  getDefensesByCategory,
  getDefensesByTier,
  getTotalDefensePower,
  type DefenseCategory,
  type DefenseSystem,
} from './planetDefensesConfig';

// Progression Ranks Config Exports
export {
  PROGRESSION_RANKS,
  getRankTitle,
  getNextRankTitle,
  calculateRankProgress,
  type RankCategory,
  type RankDefinition,
} from './progressionRanksConfig';

// Empire Stats Config Exports
export {
  DEFAULT_EMPIRE_COMBAT_STATS,
  DEFAULT_FLEET_FIREPOWER,
  DEFAULT_FLEET_ACCURACY,
  DEFAULT_CRITICAL_STRIKE,
  DEFAULT_FLEET_DEFENSE,
  DEFAULT_EVASION,
  DEFAULT_FLEET_COMBAT,
  DEFAULT_COMMANDER_STATS,
  DEFAULT_EMPIRE_RESOURCES,
  DEFAULT_FLEET_MOBILITY,
  DEFAULT_EMPIRE_ATTRIBUTES,
  DEFAULT_TECHNOLOGY,
  DEFAULT_RESISTANCE,
  DEFAULT_ELECTRONIC_WARFARE,
  DEFAULT_PVP_STATS,
  DEFAULT_PVE_STATS,
  DEFAULT_TACTICAL_COMBAT,
  DEFAULT_EMPIRE_BONUSES,
  STAT_CATEGORY_LABELS,
  STAT_DISPLAY_NAMES,
  STAT_FORMAT,
  formatStatValue,
  calculateEffectiveDamage,
  calculateAccuracy,
  calculateEvasionChance,
  calculateCriticalChance,
  calculateShieldAbsorption,
  calculateHullDamageReduction,
  calculateEWARResistance,
  calculateEWARSuccessChance,
  calculateDamageResistance,
  calculateWarpSpeed,
  calculatePopulationGrowth,
  calculateEnergyRegen,
  calculateInfrastructureOutput,
  EmpireStatId,
  type EmpireStatCategory,
  type WeaponDamageType,
  type BattleRole,
  type FleetFirepower,
  type FleetAccuracy,
  type CriticalStrikeSystems,
  type FleetDefense,
  type EvasionSystems,
  type FleetCombatStats,
  type CommanderStatistics,
  type EmpireResources,
  type FleetMobility,
  type EmpireAttributes,
  type TechnologyStats,
  type ResistanceSystems,
  type ElectronicWarfareStats,
  type FleetDisruptionChance,
  type PvPWarfareStats,
  type PvEStats,
  type TacticalCombatStats,
  type EmpireBonuses,
  type EmpireCombatStats,
} from './empireStatsConfig';

// Commander Stats Integration Exports
export {
  defaultCommanderBuffProfile,
  commanderStatsToModifier,
  applyCommanderBuffs,
  buildCommanderBuffProfile,
  calculateEmpireStatsWithCommander,
  type CommanderStatModifier,
  type CommanderBuffProfile,
} from './commanderStatsIntegration';

// Stat Metadata Exports
export {
  STAT_METADATA,
  getStatsByCategory,
  getStatsBySubCategory,
  getStatsByTag,
  getMetadata,
  type StatSource,
  type StatMetadata,
} from './statMetadata';

// Stat Progression Table Exports
export {
  TIER_EXAMPLES,
  getTierExample,
  getClosestTierExample,
  type TierExample,
} from './statProgressionTable';

// Combat Formula Engine Exports
export {
  computeFinalDamage,
  computeEWAR,
  computeTotalEffectiveHP,
  simulateCombatRound,
  simulateFullCombat,
  getFleetAccuracy,
  getFleetEvasion,
  getCriticalChance,
  getHeavyStrikeChance,
  getHeavyStrikeEvasion,
  getPositionMultiplier,
  EWAR_BASE_DURATIONS,
  EWAR_RESISTANCE_MAP,
  EWAR_CHANCE_MAP,
  type DamageOutput,
  type AttackContext,
  type CombatRoundResult,
  type CombatResult,
  type EWAResult,
  type EWARType,
  type BattleMode as CombatBattleMode,
  type WeaponCategory,
  type AttackPosition,
} from './combatFormulaEngine';

// OGame Progression Config Exports
export {
  OGame_BUILDING_FORMULAS,
  OGame_PRODUCTION_FORMULAS,
  calculateBuildingCost as calculateOGameBuildingCost,
  calculateBuildingProduction as calculateOGameBuildingProduction,
  calculateBuildingCumulativeCost as calculateOGameBuildingCumulativeCost,
  calculateBuildingTime as calculateOGameBuildingTime,
  calculateResearchTime as calculateOGameResearchTime,
  calculateFleetScore,
  calculateDefenseScore,
  calculateResearchScore,
  calculateTotalEmpireScore,
  calculateEnergyConsumption,
  calculateAvailableEnergy,
  calculateCargoCapacity,
  calculateFleetSpeed,
  calculatePlanetFields,
  type BuildingCostFormula,
  type ProductionFormula,
} from './ogameProgressionConfig';

// Civilization Tier Config Exports
export {
  CIVILIZATION_TIERS,
  getCivilizationTier,
  getNextCivilizationTier,
  getTierProgress,
  type CivilizationTier,
} from './civilizationTierConfig';

// Technology Age Config Exports
export {
  TECHNOLOGY_AGES,
  getTechnologyAge,
  getNextTechnologyAge,
  type TechnologyAge,
} from './technologyAgeConfig';

// Empire Score Rank Config Exports
export {
  EMPIRE_SCORE_RANKS,
  getEmpireScoreRank,
  getNextEmpireScoreRank,
  getScoreToNextRank,
  type EmpireScoreRank,
} from './empireScoreRankConfig';

// Commander Level Config Exports
export {
  COMMANDER_LEVEL_UNLOCKS,
  getCommanderLevelUnlocks,
  getCommanderLevelBonus,
  getNextCommanderLevelUnlock,
  type CommanderLevelUnlock,
} from './commanderLevelConfig';

