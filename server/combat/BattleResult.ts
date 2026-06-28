export interface BattleResultRound {
  roundNumber: number;

  attackerLossesInRound: Record<string, number>;
  defenderLossesInRound: Record<string, number>;
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;

  attackerShips: Record<string, number>;
  defenderShips: Record<string, number>;

  hitsAttacker: number;
  fullStrengthAttacker: number;
  absorbedDamageDefender: number;

  hitsDefender: number;
  fullStrengthDefender: number;
  absorbedDamageAttacker: number;

  attackerLossesPerFleet: Record<string, Record<string, number>>;
  defenderLossesPerFleet: Record<string, Record<string, number>>;
  hitsPerAttackerFleet: Record<string, number>;
  damagePerAttackerFleet: Record<string, number>;
}

export interface AttackerFleetResult {
  fleetMissionId: string;
  ownerId: string;
  unitsStart: Record<string, number>;
  unitsResult: Record<string, number>;
  unitsLost: Record<string, number>;
  resourceLoss: { metal: number; crystal: number; deuterium: number };
  completelyDestroyed: boolean;
}

export interface DefenderFleetResult {
  fleetMissionId: string;
  ownerId: string;
  unitsStart: Record<string, number>;
  unitsResult: Record<string, number>;
  unitsLost: Record<string, number>;
  completelyDestroyed: boolean;
}

export interface BattleResultData {
  winner: "attacker" | "defender" | "draw";

  attackerUnitsStart: Record<string, number>;
  attackerUnitsResult: Record<string, number>;
  attackerUnitsLost: Record<string, number>;
  attackerResourceLoss: { metal: number; crystal: number; deuterium: number };

  defenderUnitsStart: Record<string, number>;
  defenderUnitsResult: Record<string, number>;
  defenderUnitsLost: Record<string, number>;
  defenderResourceLoss: { metal: number; crystal: number; deuterium: number };

  loot: { metal: number; crystal: number; deuterium: number };
  debris: { metal: number; crystal: number; deuterium: number };
  wreckField: { formed: boolean; ships: Array<{ machineName: string; quantity: number }>; totalValue: number };

  moonChance: number;
  moonCreated: boolean;
  moonExisted: boolean;

  repairedDefenses: Record<string, number>;

  attackerWeaponLevel: number;
  attackerShieldLevel: number;
  attackerArmorLevel: number;
  defenderWeaponLevel: number;
  defenderShieldLevel: number;
  defenderArmorLevel: number;

  lootPercentage: number;
  rounds: BattleResultRound[];
  roundCount: number;
  hamillManoeuvreTriggered: boolean;

  attackerFleetResults: AttackerFleetResult[];
  defenderFleetResults: DefenderFleetResult[];
}
