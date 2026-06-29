// Power Level System
// Calculates and tracks player power levels for raids and content gating

export interface PowerLevelConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseValue: number;
  multiplier: number;
  maxLevel: number;
}

export interface PlayerPowerLevel {
  totalPower: number;
  raidPower: number;
  combatPower: number;
  empirePower: number;
  itemPower: number;
  breakdown: PowerBreakdown;
}

export interface PowerBreakdown {
  commander: number;
  fleet: number;
  research: number;
  buildings: number;
  empireAttributes: number;
  items: number;
  raidCareer: number;
}

// Power sources and their contribution weights
export const POWER_SOURCES: PowerLevelConfig[] = [
  { id: "commander", name: "Commander", description: "Commander level and stats", icon: "👤", baseValue: 100, multiplier: 1.5, maxLevel: 100 },
  { id: "fleet", name: "Fleet", description: "Ship count and quality", icon: "🚀", baseValue: 50, multiplier: 1.2, maxLevel: 1000 },
  { id: "research", name: "Research", description: "Technology levels", icon: "🔬", baseValue: 30, multiplier: 1.3, maxLevel: 200 },
  { id: "buildings", name: "Buildings", description: "Building levels", icon: "🏗️", baseValue: 20, multiplier: 1.1, maxLevel: 500 },
  { id: "empire", name: "Empire", description: "Empire attribute levels", icon: "👑", baseValue: 80, multiplier: 1.4, maxLevel: 100 },
  { id: "items", name: "Items", description: "Equipment and items", icon: "⚔️", baseValue: 40, multiplier: 1.25, maxLevel: 300 },
  { id: "raid", name: "Raid", description: "Raid career progression", icon: "🎯", baseValue: 60, multiplier: 1.35, maxLevel: 100 },
];

// Calculate power from commander stats
export function calculateCommanderPower(commander: any): number {
  if (!commander) return 0;
  const stats = commander.stats || {};
  const skills = commander.skills || {};
  
  return Math.floor(
    (stats.level || 1) * 120 +
    (stats.attack || 0) * 3 +
    (stats.defense || 0) * 2.5 +
    (stats.leadership || 0) * 4 +
    (skills.warfare || 0) * 80 +
    (skills.logistics || 0) * 50 +
    (skills.engineering || 0) * 40
  );
}

// Calculate power from fleet
export function calculateFleetPower(ships: any[]): number {
  if (!ships || ships.length === 0) return 0;
  
  return ships.reduce((total, ship) => {
    const tierMultiplier = (ship.tier || 1) * 1.5;
    const count = ship.count || 1;
    return total + Math.floor(count * tierMultiplier * 50);
  }, 0);
}

// Calculate power from research
export function calculateResearchPower(research: Record<string, number>): number {
  if (!research) return 0;
  
  return Object.values(research).reduce((total, level) => {
    return total + (level as number) * 30;
  }, 0);
}

// Calculate power from buildings
export function calculateBuildingPower(buildings: Record<string, number>): number {
  if (!buildings) return 0;
  
  return Object.values(buildings).reduce((total, level) => {
    return total + (level as number) * 15;
  }, 0);
}

// Calculate power from empire attributes
export function calculateEmpirePower(empireProfile: any): number {
  if (!empireProfile) return 0;
  
  const attributes = ["military", "economy", "research", "industry", "diplomacy", "espionage", "exploration", "governance", "innovation"];
  return attributes.reduce((total, attr) => {
    return total + (empireProfile[attr] || 1) * 50;
  }, 0);
}

// Calculate power from items/equipment
export function calculateItemPower(items: any[]): number {
  if (!items || items.length === 0) return 0;
  
  const rarityMultiplier: Record<string, number> = {
    common: 1,
    rare: 2,
    epic: 4,
    legendary: 8,
    mythic: 16,
  };
  
  return items.reduce((total, item) => {
    const multiplier = rarityMultiplier[item.class || "common"] || 1;
    const rank = item.rank || 1;
    return total + Math.floor(rank * multiplier * 10);
  }, 0);
}

// Calculate power from raid career
export function calculateRaidCareerPower(raidCareer: any): number {
  if (!raidCareer) return 0;
  
  return Math.floor(
    (raidCareer.level || 1) * 80 +
    (raidCareer.rating || 1000) * 0.3 +
    (raidCareer.victories || 0) * 5 +
    (raidCareer.bossKills || 0) * 100
  );
}

// Calculate total player power
export function calculateTotalPower(playerData: {
  commander?: any;
  ships?: any[];
  research?: Record<string, number> | any;
  buildings?: Record<string, number> | any;
  empireProfile?: any;
  items?: any[];
  raidCareer?: any;
}): PlayerPowerLevel {
  const commander = calculateCommanderPower(playerData.commander);
  const fleet = calculateFleetPower(playerData.ships || []);
  const research = calculateResearchPower(playerData.research || {});
  const buildings = calculateBuildingPower(playerData.buildings || {});
  const empire = calculateEmpirePower(playerData.empireProfile);
  const items = calculateItemPower(playerData.items || []);
  const raid = calculateRaidCareerPower(playerData.raidCareer);
  
  const totalPower = commander + fleet + research + buildings + empire + items + raid;
  const raidPower = Math.floor(totalPower * 0.7 + commander * 0.3);
  const combatPower = Math.floor(totalPower * 0.6 + fleet * 0.4);
  
  return {
    totalPower,
    raidPower,
    combatPower,
    empirePower: empire,
    itemPower: items,
    breakdown: {
      commander,
      fleet,
      research,
      buildings,
      empireAttributes: empire,
      items,
      raidCareer: raid,
    },
  };
}

// Get power tier name
export function getPowerTierName(power: number): string {
  if (power >= 100000) return "Legendary";
  if (power >= 50000) return "Epic";
  if (power >= 20000) return "Rare";
  if (power >= 10000) return "Uncommon";
  if (power >= 5000) return "Common";
  return "Novice";
}

// Get power tier color
export function getPowerTierColor(power: number): string {
  if (power >= 100000) return "text-yellow-500";
  if (power >= 50000) return "text-purple-500";
  if (power >= 20000) return "text-blue-500";
  if (power >= 10000) return "text-green-500";
  if (power >= 5000) return "text-gray-400";
  return "text-gray-600";
}
