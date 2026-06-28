import { BattleUnit, type BattleUnitConfig } from "./BattleUnit";

export interface FleetUnit {
  config: BattleUnitConfig;
  count: number;
}

export interface AttackerFleetData {
  fleetMissionId: string;
  ownerId: string;
  units: FleetUnit[];
  weaponTech: number;
  shieldTech: number;
  armorTech: number;
}

export interface DefenderFleetData {
  fleetMissionId: string;
  ownerId: string;
  units: FleetUnit[];
  weaponTech: number;
  shieldTech: number;
  armorTech: number;
}

export function applyTechBonus(baseValue: number, techLevel: number, bonusPerLevel: number): number {
  return Math.floor(baseValue * (1 + techLevel * bonusPerLevel));
}

export function unitsToBattleUnits(units: FleetUnit[], fleetMissionId: string, ownerId: string): BattleUnit[] {
  const result: BattleUnit[] = [];
  for (const entry of units) {
    const struct = applyTechBonus(entry.config.structuralIntegrity, entry.config.unitType === "defense" ? 0 : 0, 0);
    const shield = applyTechBonus(entry.config.shieldPoints, 0, 0);
    const attack = applyTechBonus(entry.config.attackPower, 0, 0);
    const template = new BattleUnit(
      entry.config, struct, shield, attack, fleetMissionId, ownerId,
    );
    for (let i = 0; i < entry.count; i++) {
      result.push(template.clone());
    }
  }
  return result;
}

export function fleetUnitsToBattleUnits(
  fleetUnits: FleetUnit[],
  fleetMissionId: string,
  ownerId: string,
  weaponTech: number,
  shieldTech: number,
  armorTech: number,
): BattleUnit[] {
  const result: BattleUnit[] = [];
  for (const entry of fleetUnits) {
    const struct = applyTechBonus(entry.config.structuralIntegrity, armorTech, 0.05);
    const shield = applyTechBonus(entry.config.shieldPoints, shieldTech, 0.05);
    const attack = applyTechBonus(entry.config.attackPower, weaponTech, 0.05);
    const template = new BattleUnit(
      entry.config, struct, shield, attack, fleetMissionId, ownerId,
    );
    for (let i = 0; i < entry.count; i++) {
      result.push(template.clone());
    }
  }
  return result;
}

export function collectUnitsMap(units: BattleUnit[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const u of units) {
    map[u.config.machineName] = (map[u.config.machineName] || 0) + 1;
  }
  return map;
}
