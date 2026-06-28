export interface BattleUnitConfig {
  unitId: string;
  unitName: string;
  machineName: string;
  structuralIntegrity: number;
  shieldPoints: number;
  attackPower: number;
  cargoCapacity: number;
  unitType: "ship" | "defense";
  rapidfire: Record<string, number>;
}

export class BattleUnit {
  public originalHullPlating: number;
  public currentHullPlating: number;
  public currentShieldPoints: number;
  public originalShieldPoints: number;
  public attackPower: number;
  public structuralIntegrity: number;

  constructor(
    public config: BattleUnitConfig,
    structuralIntegrity: number,
    shieldPoints: number,
    attackPower: number,
    public fleetMissionId: string,
    public ownerId: string,
  ) {
    this.structuralIntegrity = structuralIntegrity;
    this.originalShieldPoints = shieldPoints;
    this.currentShieldPoints = shieldPoints;
    this.attackPower = attackPower;
    this.originalHullPlating = Math.floor(structuralIntegrity / 10);
    this.currentHullPlating = this.originalHullPlating;
  }

  damagedHullExplosion(): boolean {
    const hullPercentage = this.currentHullPlating / this.originalHullPlating;
    if (hullPercentage >= 0.7) return false;
    const explosionChance = (1 - hullPercentage) * 100;
    return Math.random() * 100 < explosionChance;
  }

  didSuccessfulRapidfire(defenderMachineName: string): boolean {
    const rapidfireAmount = this.config.rapidfire[defenderMachineName];
    if (!rapidfireAmount || rapidfireAmount <= 0) return false;
    const chance = 100 - Math.floor((100 / rapidfireAmount) * 100) / 100;
    return Math.random() * 100 < chance;
  }

  clone(): BattleUnit {
    const u = new BattleUnit(
      this.config, this.structuralIntegrity, this.originalShieldPoints,
      this.attackPower, this.fleetMissionId, this.ownerId,
    );
    u.currentHullPlating = this.currentHullPlating;
    u.currentShieldPoints = this.currentShieldPoints;
    return u;
  }
}
