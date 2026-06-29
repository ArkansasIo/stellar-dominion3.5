/**
 * QUICK REFERENCE GUIDE - Technology Tree System
 * Essential functions, types, and usage patterns
 */

// ============================================================================
// IMPORTS
// ============================================================================

import {
  // Core types
  type TechnologyNode,
  type TechBranch,
  type TechClass,
  
  // Base technologies (starting tech samples)
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
  
  // Scaling system
  TECH_PROGRESSION,
  
  // Manager system
  TechTreeManager,
  techTreeManager,
  
  // Utility functions
  getTotalTechnologies,
  getAllTechnologies,
  getTechsByBranch,
  getTechById,
  calculateResearchPath,
  getTreeStats,
  
  // Expanded technologies (2000+)
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
} from './index';

// ============================================================================
// 1. BASIC QUERIES
// ============================================================================

/**
 * Get all technologies in a specific branch
 */
function getArmorTechnologies(): TechnologyNode[] {
  return getTechsByBranch('armor');
}

/**
 * Find a technology by ID
 */
function findTechnology(id: string): TechnologyNode | undefined {
  return getTechById(id);
}

/**
 * Get all technologies in the game
 */
function getAllTechs(): TechnologyNode[] {
  return getAllTechnologies();
}

/**
 * Get total technology count
 */
function getTechCount(): number {
  return getTotalTechnologies();
}

/**
 * Get expanded technology count breakdown
 */
function getExpandedCount() {
  return getExpandedTechCount();
  // Returns: { armor: 600, shields: 250, weapons: 420, ..., total: 2453 }
}

// ============================================================================
// 2. PROGRESSION & SCALING
// ============================================================================

/**
 * Calculate level multiplier
 */
function getLevelBonus(level: number, baseStat: number): number {
  return TECH_PROGRESSION.levelBonus(level, baseStat);
}

/**
 * Calculate tier multiplier
 */
function getTierBonus(tier: number, baseStat: number): number {
  return TECH_PROGRESSION.tierBonus(tier, baseStat);
}

/**
 * Get combined level+tier multiplier
 */
function getCombinedMultiplier(level: number, tier: number): number {
  return TECH_PROGRESSION.combinedMultiplier(level, tier);
}

/**
 * Calculate research cost for a technology
 */
function getResearchCost(
  branchName: string,
  level: number,
  tier: number
): number {
  return TECH_PROGRESSION.researchCostForTech(branchName, level, tier);
}

/**
 * Calculate research time (in turns)
 */
function getResearchTime(level: number, tier: number): number {
  return TECH_PROGRESSION.researchTimeForTech(level, tier);
}

// Example Usage
/*
const tech = getTechById('armor-light-basic-composite-1');
if (tech) {
  const bonus = getLevelBonus(tech.level, 10);
  const cost = getResearchCost('armor', tech.level, tech.tier);
  console.log(`Armor Rating with bonuses: ${bonus}`);
  console.log(`Research cost: ${cost} Science Points`);
}
*/

// ============================================================================
// 3. TECH TREE NAVIGATION
// ============================================================================

/**
 * Get technologies that unlock from a prerequisite
 */
function getUnlockedTechs(prerequisiteId: string): TechnologyNode[] {
  return techTreeManager.getTechThatUnlock(prerequisiteId);
}

/**
 * Get all prerequisites for a technology
 */
function getPrerequisiteTechs(techId: string): TechnologyNode[] {
  return techTreeManager.getPrerequisites(techId);
}

/**
 * Get available upgrades for a technology
 */
function getUpgrates(techId: string): TechnologyNode[] {
  return techTreeManager.getAvailableUpgrades(techId);
}

/**
 * Calculate total research cost including prerequisites
 */
function getTotalResearchCost(techId: string): number {
  return techTreeManager.calculateTotalResearchCost(techId);
}

/**
 * Find optimal research path between two technologies
 */
function findPath(fromId: string, toId: string): TechnologyNode[] {
  return techTreeManager.getResearchPath(fromId, toId);
}

// Example Usage
/*
const path = findPath('armor-light-basic-composite-1', 'armor-military-alloy-1');
console.log(`Research path has ${path.length} steps`);
console.log(`Total cost: ${getTotalResearchCost('armor-military-alloy-1')} SC`);
*/

// ============================================================================
// 4. TECH TREE ANALYSIS
// ============================================================================

/**
 * Get statistics about the entire tech tree
 */
function getTreeStatistics() {
  return techTreeManager.getTreeStatistics();
  // Returns: {
  //   totalTechs: 2453,
  //   byBranch: { armor: 600, shields: 250, ... },
  //   byClass: { basic: 500, advanced: 400, ... },
  //   averageLevelByBranch: { armor: 8.5, ... }
  // }
}

/**
 * Filter technologies by specific criteria
 */
function filterTechs(criteria: {
  branch?: TechBranch;
  class?: TechClass;
  minLevel?: number;
  maxLevel?: number;
  rarity?: string;
}): TechnologyNode[] {
  return getAllTechnologies().filter(tech => {
    if (criteria.branch && tech.branch !== criteria.branch) return false;
    if (criteria.class && tech.class !== criteria.class) return false;
    if (criteria.minLevel && tech.level < criteria.minLevel) return false;
    if (criteria.maxLevel && tech.level > criteria.maxLevel) return false;
    if (criteria.rarity && tech.rarity !== criteria.rarity) return false;
    return true;
  });
}

/**
 * Get starting technologies (no prerequisites)
 */
function getStarterTechs(): TechnologyNode[] {
  return techTreeManager.getStartingTechs();
}

/**
 * Get technologies by branch and class
 */
function getTechsByBranchAndClass(
  branch: TechBranch,
  techClass: TechClass
): TechnologyNode[] {
  return techTreeManager.getTechByBranchAndClass(branch, techClass);
}

// Example Usage
/*
const stats = getTreeStatistics();
console.log(`Total technologies: ${stats.totalTechs}`);
console.log(`Armor techs: ${stats.byBranch.armor}`);

const epicTechs = filterTechs({ rarity: 'epic' });
console.log(`Epic technologies: ${epicTechs.length}`);

const militaryArmor = getTechsByBranchAndClass('armor', 'military');
console.log(`Military armor options: ${militaryArmor.length}`);
*/

// ============================================================================
// 5. STAT CALCULATIONS
// ============================================================================

/**
 * Calculate all stat bonuses for a technology at specific level/tier
 */
function calculateStatBonuses(
  techId: string,
  level: number,
  tier: number
): { [key: string]: number } {
  return techTreeManager.calculateStatBonus(techId, level, tier);
}

/**
 * Get all raw stats from a technology
 */
function getRawStats(tech: TechnologyNode) {
  return {
    primary: tech.stats.primary,
    secondary: tech.stats.secondary,
    resistances: tech.stats.resistance,
    bonuses: tech.bonuses,
    penalties: tech.penalties,
  };
}

// Example Usage
/*
const tech = getTechById('armor-light-basic-composite-1')!;
const stats = calculateStatBonuses(tech.id, 5, 3);
console.log(`Armor Rating at L5/T3: ${stats['Armor Rating']}`);

const resistance = tech.stats.resistance.kinetic;
console.log(`Kinetic Resistance: ${resistance}`);
*/

// ============================================================================
// 6. RESEARCH PLANNING
// ============================================================================

/**
 * Build a research plan from current tech to target tech
 */
function buildResearchPlan(
  currentTechId: string,
  targetTechId: string
): TechnologyNode[] {
  return findPath(currentTechId, targetTechId);
}

/**
 * Estimate total research time for a technology
 */
function estimateResearchTime(tech: TechnologyNode): number {
  let totalTime = 0;
  const visited = new Set<string>();

  function traverse(techId: string) {
    if (visited.has(techId)) return;
    visited.add(techId);

    const t = getTechById(techId);
    if (t) {
      totalTime += t.researchTime;
      t.prerequisiteTechs.forEach(id => traverse(id));
    }
  }

  traverse(tech.id);
  return totalTime;
}

/**
 * Calculate total resource cost to research a technology
 */
function getTotalResourceCost(techId: string): {
  science: number;
  turns: number;
  industrial: number;
  energy: number;
} {
  let totalScience = 0;
  let totalTurns = 0;
  let totalIndustrial = 0;
  let totalEnergy = 0;

  const visited = new Set<string>();

  function traverse(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const tech = getTechById(id);
    if (tech) {
      totalScience += tech.researchCost;
      totalTurns += tech.researchTime;
      totalIndustrial += tech.industrialCost;
      totalEnergy += tech.energyCost;

      tech.prerequisiteTechs.forEach(prereq => traverse(prereq));
    }
  }

  traverse(techId);

  return { science: totalScience, turns: totalTurns, industrial: totalIndustrial, energy: totalEnergy };
}

// Example Usage
/*
const tech = getTechById('armor-military-alloy-1')!;
const plan = buildResearchPlan('armor-light-basic-composite-1', 'armor-military-alloy-1');
console.log(`Research plan: ${plan.length} technologies`);

const cost = getTotalResourceCost('armor-military-alloy-1');
console.log(`Total SC needed: ${cost.science}`);
console.log(`Total time: ${cost.turns} turns`);
*/

// ============================================================================
// 7. TECH FILTERING & DISCOVERY
// ============================================================================

/**
 * Get all technologies available at a specific player level
 */
function getAvailableTechs(playerLevel: number): TechnologyNode[] {
  return getAllTechnologies().filter(tech => tech.minimumLevel <= playerLevel);
}

/**
 * Get all technologies of a specific rarity
 */
function getTechsByRarity(
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
): TechnologyNode[] {
  return getAllTechnologies().filter(tech => tech.rarity === rarity);
}

/**
 * Get all faction-locked technologies
 */
function getFactionTechs(faction: string): TechnologyNode[] {
  return getAllTechnologies().filter(
    tech => tech.factionLocked && tech.factionLocked === faction
  );
}

/**
 * Search technologies by name
 */
function searchTechs(query: string): TechnologyNode[] {
  return getAllTechnologies().filter(
    tech =>
      tech.name.toLowerCase().includes(query.toLowerCase()) ||
      tech.description.toLowerCase().includes(query.toLowerCase())
  );
}

// Example Usage
/*
const availTechs = getAvailableTechs(10);
console.log(`Technologies available at level 10: ${availTechs.length}`);

const epics = getTechsByRarity('epic');
console.log(`Epic technologies: ${epics.length}`);

const krell = getFactionTechs('Military');
console.log(`Military faction techs: ${krell.length}`);

const shield = searchTechs('shield');
console.log(`Shield-related techs: ${shield.length}`);
*/

// ============================================================================
// 8. INTEGRATION WITH GAME SYSTEMS
// ============================================================================

/**
 * Check if player can research a technology
 */
function canResearch(
  tech: TechnologyNode,
  playerLevel: number,
  playerTechLevel: number,
  hasPrerequisites: boolean
): boolean {
  return (
    playerLevel >= tech.minimumLevel &&
    playerTechLevel >= tech.minimumTechLevel &&
    hasPrerequisites &&
    tech.isResearchable
  );
}

/**
 * Get tech effect (for stats/UI display)
 */
function getTechEffect(tech: TechnologyNode): string {
  const bonuses = Object.entries(tech.bonuses)
    .map(([key, value]) => `${key}: +${value}`)
    .join(', ');

  const penalties =
    tech.penalties ?
      Object.entries(tech.penalties)
        .map(([key, value]) => `${key}: -${value}`)
        .join(', ') :
      '';

  return `${bonuses}${penalties ? `; Penalties: ${penalties}` : ''}`;
}

/**
 * Get tech as JSON for database
 */
function serializeTech(tech: TechnologyNode): string {
  return JSON.stringify(tech, null, 2);
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Basic queries
  getArmorTechnologies,
  findTechnology,
  getAllTechs,
  getTechCount,
  getExpandedCount,

  // Progression & scaling
  getLevelBonus,
  getTierBonus,
  getCombinedMultiplier,
  getResearchCost,
  getResearchTime,

  // Navigation
  getUnlockedTechs,
  getPrerequisiteTechs,
  getUpgrates,
  getTotalResearchCost,
  findPath,

  // Analysis
  getTreeStatistics,
  filterTechs,
  getStarterTechs,
  getTechsByBranchAndClass,

  // Stats
  calculateStatBonuses,
  getRawStats,

  // Planning
  buildResearchPlan,
  estimateResearchTime,
  getTotalResourceCost,

  // Discovery
  getAvailableTechs,
  getTechsByRarity,
  getFactionTechs,
  searchTechs,

  // Integration
  canResearch,
  getTechEffect,
  serializeTech,
};
