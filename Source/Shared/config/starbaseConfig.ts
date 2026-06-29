export type StarbaseType = string;

export const STARBASE_TYPES: Record<string, any> = {};

export const STARBASE_MODULES: Record<string, any> = {};

export function getStarbaseUpgradeCost(type: StarbaseType, level: number): any {
  return {};
}

export function getStarbaseBuildTime(type: StarbaseType, level: number): number {
  return 0;
}

export function calculateStarbaseStats(type: StarbaseType, level: number, modules: string[]): any {
  return {};
}

export function getModulesForStarbase(type: StarbaseType): any[] {
  return [];
}
