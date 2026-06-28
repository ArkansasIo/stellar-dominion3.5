/**
 * Army Building Structures Service
 * Business logic for constructing, upgrading, and managing army building structures.
 * Supports tiers 1-99 and levels 1-999 per the armyBuildingStructuresConfig.
 * @tag #military #army #structures #buildings #service
 */

import {
  ARMY_BUILDING_STRUCTURE_ARCHETYPES,
  ARMY_BUILDING_STRUCTURES_BY_CATEGORY,
  ARMY_BUILDING_STRUCTURES_BY_SUBCATEGORY,
  ARMY_BUILDING_STRUCTURES_META,
  ARMY_STRUCTURE_TIER_CLASSES,
  ARMY_STRUCTURE_LEVEL_CONFIG,
  computeArmyStructureStats,
  computeArmyStructureSubStats,
  getArmyStructureTierClass,
  type ArmyBuildingStructureArchetype,
  type ArmyBuildingStats,
  type ArmyBuildingSubStats,
} from '../../shared/config/armyBuildingStructuresConfig';

// ============================================================================
// DATA TYPES
// ============================================================================

/** A player-owned instance of an army building structure */
export interface PlayerArmyStructure {
  /** Unique instance ID */
  id: string;
  /** Player who owns this structure */
  playerId: string;
  /** References ArmyBuildingStructureArchetype.id */
  archetypeId: string;
  /** Current tier (1-99) */
  tier: number;
  /** Current level (1-999) */
  level: number;
  /** Computed stats at current tier & level */
  stats: ArmyBuildingStats;
  /** Computed sub-stats at current tier & level */
  subStats: ArmyBuildingSubStats;
  /** ISO timestamp when structure was constructed */
  constructedAt: string;
  /** ISO timestamp of last upgrade */
  lastUpgradedAt: string;
  /** Whether structure is currently operational */
  operational: boolean;
}

/** Summary of a player's entire army building infrastructure */
export interface ArmyStructureSummary {
  playerId: string;
  totalStructures: number;
  operationalStructures: number;
  totalDefense: number;
  totalCapacity: number;
  totalMaintenanceCost: number;
  highestTier: number;
  highestLevel: number;
  categoryCounts: Record<string, number>;
}

// ============================================================================
// IN-MEMORY STORAGE
// ============================================================================

/**
 * In-memory storage for player structures.
 * In production, this would be backed by a database.
 */
const playerStructures = new Map<string, PlayerArmyStructure[]>();

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class ArmyBuildingStructuresService {
  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------

  /** Clamp a tier value to the valid range [1, 99] */
  private static clampTier(tier: number): number {
    return Math.max(1, Math.min(99, Math.floor(tier)));
  }

  /** Clamp a level value to the valid range [1, 999] */
  private static clampLevel(level: number): number {
    return Math.max(1, Math.min(999, Math.floor(level)));
  }

  /** Get or initialize the structure list for a player */
  private static getPlayerStructureList(playerId: string): PlayerArmyStructure[] {
    if (!playerStructures.has(playerId)) {
      playerStructures.set(playerId, []);
    }
    return playerStructures.get(playerId)!;
  }

  // --------------------------------------------------------------------------
  // CATALOG QUERIES
  // --------------------------------------------------------------------------

  /**
   * Get all army building structure archetypes from the config catalog.
   */
  static getAllArchetypes(): ArmyBuildingStructureArchetype[] {
    return ARMY_BUILDING_STRUCTURE_ARCHETYPES;
  }

  /**
   * Get a single archetype by its ID.
   */
  static getArchetypeById(archetypeId: string): ArmyBuildingStructureArchetype | undefined {
    return ARMY_BUILDING_STRUCTURE_ARCHETYPES.find((a) => a.id === archetypeId);
  }

  /**
   * Get all archetypes whose unlockLevel is ≤ the given player level.
   */
  static getAvailableArchetypes(
    playerLevel: number,
  ): ArmyBuildingStructureArchetype[] {
    const clamped = Math.max(1, Math.min(999, playerLevel));
    return ARMY_BUILDING_STRUCTURE_ARCHETYPES.filter(
      (a) => a.attributes.unlockLevel <= clamped,
    );
  }

  /**
   * Get archetypes grouped by category.
   */
  static getArchetypesByCategory(): Record<string, ArmyBuildingStructureArchetype[]> {
    return ARMY_BUILDING_STRUCTURES_BY_CATEGORY;
  }

  /**
   * Get archetypes grouped by subcategory.
   */
  static getArchetypesBySubCategory(): Record<string, ArmyBuildingStructureArchetype[]> {
    return ARMY_BUILDING_STRUCTURES_BY_SUBCATEGORY;
  }

  /**
   * Get the full metadata summary for the catalog.
   */
  static getMeta() {
    return ARMY_BUILDING_STRUCTURES_META;
  }

  /**
   * Get the tier class system definition.
   */
  static getTierClasses() {
    return ARMY_STRUCTURE_TIER_CLASSES;
  }

  /**
   * Compute stats & sub-stats for a given archetype at specific tier and level.
   * Useful for previewing upgrade costs before committing.
   */
  static previewStats(
    archetypeId: string,
    tier: number,
    level: number,
  ): {
    success: boolean;
    message: string;
    archetypeId?: string;
    tier?: number;
    level?: number;
    tierClass?: ReturnType<typeof getArmyStructureTierClass>;
    stats?: ArmyBuildingStats;
    subStats?: ArmyBuildingSubStats;
  } {
    const archetype = this.getArchetypeById(archetypeId);
    if (!archetype) {
      return { success: false, message: `Archetype '${archetypeId}' not found` };
    }

    const clampedTier = this.clampTier(tier);
    const clampedLevel = this.clampLevel(level);

    return {
      success: true,
      message: 'Stats preview computed',
      archetypeId,
      tier: clampedTier,
      level: clampedLevel,
      tierClass: getArmyStructureTierClass(clampedTier),
      stats: computeArmyStructureStats(clampedTier, clampedLevel),
      subStats: computeArmyStructureSubStats(clampedTier, clampedLevel),
    };
  }

  // --------------------------------------------------------------------------
  // PLAYER STRUCTURE MANAGEMENT
  // --------------------------------------------------------------------------

  /**
   * Construct a new army building structure for a player.
   *
   * @param playerId   - Player ID
   * @param archetypeId - Archetype to build from the catalog
   * @param tier       - Starting tier (default 1, clamped to 1-99)
   * @param level      - Starting level (default 1, clamped to 1-999)
   */
  static constructStructure(
    playerId: string,
    archetypeId: string,
    tier = 1,
    level = 1,
  ): {
    success: boolean;
    message: string;
    structure?: PlayerArmyStructure;
  } {
    const archetype = this.getArchetypeById(archetypeId);
    if (!archetype) {
      return { success: false, message: `Archetype '${archetypeId}' not found` };
    }

    const clampedTier = this.clampTier(tier);
    const clampedLevel = this.clampLevel(level);

    const now = new Date().toISOString();
    const structure: PlayerArmyStructure = {
      id: `${playerId}-${archetypeId}-${Date.now()}`,
      playerId,
      archetypeId,
      tier: clampedTier,
      level: clampedLevel,
      stats: computeArmyStructureStats(clampedTier, clampedLevel),
      subStats: computeArmyStructureSubStats(clampedTier, clampedLevel),
      constructedAt: now,
      lastUpgradedAt: now,
      operational: true,
    };

    const list = this.getPlayerStructureList(playerId);
    list.push(structure);

    return {
      success: true,
      message: `${archetype.name} constructed at tier ${clampedTier}, level ${clampedLevel}`,
      structure,
    };
  }

  /**
   * Upgrade a structure's level.
   *
   * @param playerId    - Player ID
   * @param structureId - Instance ID of the structure to upgrade
   * @param targetLevel - Desired new level (1-999)
   */
  static upgradeStructureLevel(
    playerId: string,
    structureId: string,
    targetLevel: number,
  ): {
    success: boolean;
    message: string;
    structure?: PlayerArmyStructure;
  } {
    const list = this.getPlayerStructureList(playerId);
    const structure = list.find((s) => s.id === structureId);

    if (!structure) {
      return { success: false, message: `Structure '${structureId}' not found` };
    }

    const newLevel = this.clampLevel(targetLevel);

    if (newLevel <= structure.level) {
      return {
        success: false,
        message: `Target level ${newLevel} must be greater than current level ${structure.level}`,
      };
    }

    structure.level = newLevel;
    structure.stats = computeArmyStructureStats(structure.tier, newLevel);
    structure.subStats = computeArmyStructureSubStats(structure.tier, newLevel);
    structure.lastUpgradedAt = new Date().toISOString();

    return {
      success: true,
      message: `Structure upgraded to level ${newLevel}`,
      structure,
    };
  }

  /**
   * Upgrade a structure's tier.
   *
   * @param playerId    - Player ID
   * @param structureId - Instance ID of the structure to upgrade
   * @param targetTier  - Desired new tier (1-99)
   */
  static upgradeStructureTier(
    playerId: string,
    structureId: string,
    targetTier: number,
  ): {
    success: boolean;
    message: string;
    structure?: PlayerArmyStructure;
    tierClass?: ReturnType<typeof getArmyStructureTierClass>;
  } {
    const list = this.getPlayerStructureList(playerId);
    const structure = list.find((s) => s.id === structureId);

    if (!structure) {
      return { success: false, message: `Structure '${structureId}' not found` };
    }

    const newTier = this.clampTier(targetTier);

    if (newTier <= structure.tier) {
      return {
        success: false,
        message: `Target tier ${newTier} must be greater than current tier ${structure.tier}`,
      };
    }

    structure.tier = newTier;
    structure.stats = computeArmyStructureStats(newTier, structure.level);
    structure.subStats = computeArmyStructureSubStats(newTier, structure.level);
    structure.lastUpgradedAt = new Date().toISOString();

    return {
      success: true,
      message: `Structure tier upgraded to ${newTier}`,
      structure,
      tierClass: getArmyStructureTierClass(newTier),
    };
  }

  /**
   * Toggle the operational status of a structure (e.g. offline for repair).
   */
  static setOperational(
    playerId: string,
    structureId: string,
    operational: boolean,
  ): {
    success: boolean;
    message: string;
    structure?: PlayerArmyStructure;
  } {
    const list = this.getPlayerStructureList(playerId);
    const structure = list.find((s) => s.id === structureId);

    if (!structure) {
      return { success: false, message: `Structure '${structureId}' not found` };
    }

    structure.operational = operational;

    return {
      success: true,
      message: `Structure set to ${operational ? 'operational' : 'offline'}`,
      structure,
    };
  }

  /**
   * Demolish (remove) a structure.
   */
  static demolishStructure(
    playerId: string,
    structureId: string,
  ): {
    success: boolean;
    message: string;
  } {
    const list = this.getPlayerStructureList(playerId);
    const index = list.findIndex((s) => s.id === structureId);

    if (index === -1) {
      return { success: false, message: `Structure '${structureId}' not found` };
    }

    list.splice(index, 1);

    return { success: true, message: `Structure '${structureId}' demolished` };
  }

  // --------------------------------------------------------------------------
  // QUERIES ON PLAYER STRUCTURES
  // --------------------------------------------------------------------------

  /**
   * Get all structures owned by a player.
   */
  static getPlayerStructures(playerId: string): PlayerArmyStructure[] {
    return this.getPlayerStructureList(playerId);
  }

  /**
   * Get a single player structure by instance ID.
   */
  static getPlayerStructureById(
    playerId: string,
    structureId: string,
  ): PlayerArmyStructure | undefined {
    return this.getPlayerStructureList(playerId).find((s) => s.id === structureId);
  }

  /**
   * Get a player's structures filtered by category.
   */
  static getPlayerStructuresByCategory(
    playerId: string,
    category: string,
  ): PlayerArmyStructure[] {
    const list = this.getPlayerStructureList(playerId);
    return list.filter((s) => {
      const archetype = this.getArchetypeById(s.archetypeId);
      return archetype?.category === category;
    });
  }

  /**
   * Get a player's structures filtered by subcategory.
   */
  static getPlayerStructuresBySubCategory(
    playerId: string,
    subCategory: string,
  ): PlayerArmyStructure[] {
    const list = this.getPlayerStructureList(playerId);
    return list.filter((s) => {
      const archetype = this.getArchetypeById(s.archetypeId);
      return archetype?.subCategory === subCategory;
    });
  }

  /**
   * Compute a summary of all army structures for a player.
   */
  static getStructureSummary(playerId: string): ArmyStructureSummary {
    const list = this.getPlayerStructureList(playerId);

    const summary: ArmyStructureSummary = {
      playerId,
      totalStructures: list.length,
      operationalStructures: 0,
      totalDefense: 0,
      totalCapacity: 0,
      totalMaintenanceCost: 0,
      highestTier: 0,
      highestLevel: 0,
      categoryCounts: {},
    };

    for (const structure of list) {
      if (structure.operational) {
        summary.operationalStructures += 1;
        summary.totalDefense += structure.stats.defense;
        summary.totalCapacity += structure.stats.capacity;
      }
      summary.totalMaintenanceCost += structure.stats.maintenanceCost;
      if (structure.tier > summary.highestTier) summary.highestTier = structure.tier;
      if (structure.level > summary.highestLevel) summary.highestLevel = structure.level;

      const archetype = this.getArchetypeById(structure.archetypeId);
      if (archetype) {
        summary.categoryCounts[archetype.category] =
          (summary.categoryCounts[archetype.category] ?? 0) + 1;
      }
    }

    return summary;
  }

  // --------------------------------------------------------------------------
  // LEVEL SYSTEM HELPERS
  // --------------------------------------------------------------------------

  /**
   * Return level progression configuration (min/max levels, scale factors).
   */
  static getLevelConfig() {
    return ARMY_STRUCTURE_LEVEL_CONFIG;
  }
}

export default ArmyBuildingStructuresService;
