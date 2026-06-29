import { db } from '../db';
import { eq, sql } from 'drizzle-orm';
import { systemSettings, playerStates, missions } from '../../Source/Shared/schema';

export const EXP_NOTHING = 0;
export const EXP_ALIENS = 1;
export const EXP_PIRATES = 2;
export const EXP_DARK_MATTER = 3;
export const EXP_BLACK_HOLE = 4;
export const EXP_DELAY = 5;
export const EXP_ACCEL = 6;
export const EXP_RESOURCES = 7;
export const EXP_FLEET = 8;
export const EXP_TRADER = 9;

export interface ExpeditionSettings {
  chanceSuccess: number;
  depletedMin: number;
  depletedMed: number;
  depletedMax: number;
  chanceDepletedMin: number;
  chanceDepletedMed: number;
  chanceDepletedMax: number;
  chanceAlien: number;
  chancePirates: number;
  chanceDm: number;
  chanceLost: number;
  chanceDelay: number;
  chanceAccel: number;
  chanceRes: number;
  chanceFleet: number;
  dmFactor: number;
  scoreCap1: number;
  scoreCap2: number;
  scoreCap3: number;
  scoreCap4: number;
  scoreCap5: number;
  scoreCap6: number;
  scoreCap7: number;
  scoreCap8: number;
  limitCap1: number;
  limitCap2: number;
  limitCap3: number;
  limitCap4: number;
  limitCap5: number;
  limitCap6: number;
  limitCap7: number;
  limitCap8: number;
  limitMax: number;
}

export interface ExpeditionFleet {
  [gid: number]: number;
  metal?: number;
  crystal?: number;
  deuterium?: number;
  ownerId: string;
  fleetId: number;
  deployTime: number;
  flightTime: number;
}

const DEFAULT_SETTINGS: ExpeditionSettings = {
  chanceSuccess: 50,
  depletedMin: 3000,
  depletedMed: 18000,
  depletedMax: 66000,
  chanceDepletedMin: 2000,
  chanceDepletedMed: 10000,
  chanceDepletedMax: 40000,
  chanceAlien: 1100,
  chancePirates: 2200,
  chanceDm: 700,
  chanceLost: 800,
  chanceDelay: 2000,
  chanceAccel: 300,
  chanceRes: 5500,
  chanceFleet: 3500,
  dmFactor: 100,
  scoreCap1: 10000,
  scoreCap2: 100000,
  scoreCap3: 1000000,
  scoreCap4: 5000000,
  scoreCap5: 25000000,
  scoreCap6: 50000000,
  scoreCap7: 75000000,
  scoreCap8: 100000000,
  limitCap1: 40000,
  limitCap2: 500000,
  limitCap3: 1200000,
  limitCap4: 1800000,
  limitCap5: 2400000,
  limitCap6: 3000000,
  limitCap7: 3600000,
  limitCap8: 4200000,
  limitMax: 5000000,
};

export class ExpeditionOGameService {
  static async getExpeditionsCount(playerId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(missions)
      .where(
        sql`${missions.userId} = ${playerId} AND ${missions.type} = 'expedition' AND ${missions.status} = 'outbound'`
      );
    return Number(result[0]?.count || 0);
  }

  static async loadExpeditionSettings(): Promise<ExpeditionSettings> {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'expedition_settings'));
    if (setting?.value) {
      return { ...DEFAULT_SETTINGS, ...(setting.value as Partial<ExpeditionSettings>) };
    }
    return { ...DEFAULT_SETTINGS };
  }

  static async saveExpeditionSettings(settings: ExpeditionSettings): Promise<void> {
    await db
      .insert(systemSettings)
      .values({
        key: 'expedition_settings',
        value: settings as unknown as Record<string, unknown>,
        category: 'gameplay',
        description: 'OGame Expedition System Settings',
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: settings as unknown as Record<string, unknown>,
          category: 'gameplay',
          description: 'OGame Expedition System Settings',
        },
      });
  }

  static expPoints(fleet: ExpeditionFleet): number {
    const shipCosts: Record<number, { metal: number; crystal: number }> = {
      202: { metal: 2000, crystal: 2000 },
      203: { metal: 6000, crystal: 6000 },
      204: { metal: 3000, crystal: 1000 },
      205: { metal: 6000, crystal: 4000 },
      206: { metal: 20000, crystal: 7000 },
      207: { metal: 45000, crystal: 15000 },
      208: { metal: 30000, crystal: 40000 },
      209: { metal: 50000, crystal: 50000 },
      210: { metal: 60000, crystal: 50000 },
      211: { metal: 2000000, crystal: 2000000 },
      212: { metal: 10000, crystal: 2000 },
      213: { metal: 30000, crystal: 12000 },
      214: { metal: 10000, crystal: 6000 },
      215: { metal: 20000, crystal: 12000 },
      216: { metal: 12000, crystal: 4000 },
      217: { metal: 4000, crystal: 8000 },
      219: { metal: 8000, crystal: 16000 },
    };

    let total = 0;
    for (const gidStr of Object.keys(fleet)) {
      const gid = parseInt(gidStr);
      if (isNaN(gid) || gid < 200) continue;
      const count = fleet[gid] || 0;
      const cost = shipCosts[gid];
      if (cost) {
        total += (cost.metal + cost.crystal) * count;
      }
    }
    return Math.floor(total / 1000);
  }

  static expUpperLimit(settings: ExpeditionSettings): number {
    const rank1Score = 0;
    const cappedScore = rank1Score;

    if (cappedScore < settings.scoreCap1) return settings.limitCap1;
    if (cappedScore < settings.scoreCap2) return settings.limitCap2;
    if (cappedScore < settings.scoreCap3) return settings.limitCap3;
    if (cappedScore < settings.scoreCap4) return settings.limitCap4;
    if (cappedScore < settings.scoreCap5) return settings.limitCap5;
    if (cappedScore < settings.scoreCap6) return settings.limitCap6;
    if (cappedScore < settings.scoreCap7) return settings.limitCap7;
    if (cappedScore < settings.scoreCap8) return settings.limitCap8;
    return settings.limitMax;
  }

  static expedition(expCount: number, settings: ExpeditionSettings, holdTime: number): number {
    const rollChance = Math.random() * 65535;
    let limit = 0;

    if (expCount > 0) {
      limit = Math.floor(holdTime / 3600);
      if (limit < 1) limit = 1;
    } else {
      limit = 0;
    }

    if (limit < settings.depletedMin) {
      if (rollChance <= settings.chanceAlien) return EXP_ALIENS;
      if (rollChance <= settings.chanceAlien + settings.chancePirates) return EXP_PIRATES;
      if (rollChance <= settings.chanceAlien + settings.chancePirates + settings.chanceDm) return EXP_DARK_MATTER;
      if (rollChance <= settings.chanceAlien + settings.chancePirates + settings.chanceDm + settings.chanceLost) return EXP_BLACK_HOLE;
      if (rollChance <= settings.chanceAlien + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay) return EXP_DELAY;
      if (rollChance <= settings.chanceAlien + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel) return EXP_ACCEL;
      if (rollChance <= settings.chanceAlien + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel + settings.chanceRes) return EXP_RESOURCES;
      if (rollChance <= settings.chanceAlien + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel + settings.chanceRes + settings.chanceFleet) return EXP_FLEET;
      return EXP_NOTHING;
    }

    if (limit < settings.depletedMed) {
      if (rollChance <= settings.chanceDepletedMin) return EXP_ALIENS;
      if (rollChance <= settings.chanceDepletedMin + settings.chancePirates) return EXP_PIRATES;
      if (rollChance <= settings.chanceDepletedMin + settings.chancePirates + settings.chanceDm) return EXP_DARK_MATTER;
      if (rollChance <= settings.chanceDepletedMin + settings.chancePirates + settings.chanceDm + settings.chanceLost) return EXP_BLACK_HOLE;
      if (rollChance <= settings.chanceDepletedMin + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay) return EXP_DELAY;
      if (rollChance <= settings.chanceDepletedMin + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel) return EXP_ACCEL;
      if (rollChance <= settings.chanceDepletedMin + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel + settings.chanceRes) return EXP_RESOURCES;
      if (rollChance <= settings.chanceDepletedMin + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel + settings.chanceRes + settings.chanceFleet) return EXP_FLEET;
      return EXP_NOTHING;
    }

    if (limit < settings.depletedMax) {
      if (rollChance <= settings.chanceDepletedMed) return EXP_ALIENS;
      if (rollChance <= settings.chanceDepletedMed + settings.chancePirates) return EXP_PIRATES;
      if (rollChance <= settings.chanceDepletedMed + settings.chancePirates + settings.chanceDm) return EXP_DARK_MATTER;
      if (rollChance <= settings.chanceDepletedMed + settings.chancePirates + settings.chanceDm + settings.chanceLost) return EXP_BLACK_HOLE;
      if (rollChance <= settings.chanceDepletedMed + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay) return EXP_DELAY;
      if (rollChance <= settings.chanceDepletedMed + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel) return EXP_ACCEL;
      if (rollChance <= settings.chanceDepletedMed + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel + settings.chanceRes) return EXP_RESOURCES;
      if (rollChance <= settings.chanceDepletedMed + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel + settings.chanceRes + settings.chanceFleet) return EXP_FLEET;
      return EXP_NOTHING;
    }

    if (rollChance <= settings.chanceDepletedMax) return EXP_ALIENS;
    if (rollChance <= settings.chanceDepletedMax + settings.chancePirates) return EXP_PIRATES;
    if (rollChance <= settings.chanceDepletedMax + settings.chancePirates + settings.chanceDm) return EXP_DARK_MATTER;
    if (rollChance <= settings.chanceDepletedMax + settings.chancePirates + settings.chanceDm + settings.chanceLost) return EXP_BLACK_HOLE;
    if (rollChance <= settings.chanceDepletedMax + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay) return EXP_DELAY;
    if (rollChance <= settings.chanceDepletedMax + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel) return EXP_ACCEL;
    if (rollChance <= settings.chanceDepletedMax + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel + settings.chanceRes) return EXP_RESOURCES;
    if (rollChance <= settings.chanceDepletedMax + settings.chancePirates + settings.chanceDm + settings.chanceLost + settings.chanceDelay + settings.chanceAccel + settings.chanceRes + settings.chanceFleet) return EXP_FLEET;
    return EXP_NOTHING;
  }

  static async nothingHappens(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any): Promise<void> {
    const flavorTexts = [
      'Nothing happened during the expedition.',
      'Your fleet found only empty space.',
      'The expedition returned with no findings.',
      'No signs of activity were detected.',
      'The sector was completely empty.',
    ];
    const text = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
    fleet.flightTime = fleet.deployTime;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async battleAliens(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any): Promise<void> {
    const roll = Math.random() * 100;
    let strength: 'weak' | 'medium' | 'strong';
    if (roll < 90) strength = 'weak';
    else if (roll < 99) strength = 'medium';
    else strength = 'strong';

    await this.expeditionBattle(queue, fleetObj, fleet, 'alien', strength, origin, target);
  }

  static async battlePirates(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any): Promise<void> {
    const roll = Math.random() * 100;
    let strength: 'weak' | 'medium' | 'strong';
    if (roll < 90) strength = 'weak';
    else if (roll < 99) strength = 'medium';
    else strength = 'strong';

    await this.expeditionBattle(queue, fleetObj, fleet, 'pirate', strength, origin, target);
  }

  static async darkMatterFound(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any, settings: ExpeditionSettings): Promise<void> {
    const strengthRoll = Math.random() * 100;
    let dmAmount: number;
    if (strengthRoll < 60) {
      dmAmount = 100 + Math.floor(Math.random() * 101);
    } else if (strengthRoll < 90) {
      dmAmount = 201 + Math.floor(Math.random() * 300);
    } else {
      dmAmount = 501 + Math.floor(Math.random() * 1576);
    }
    dmAmount = Math.floor(dmAmount * (settings.dmFactor / 100));

    let playerResources = origin?.resources || {};
    playerResources.darkMatter = (playerResources.darkMatter || 0) + dmAmount;

    await db.update(playerStates)
      .set({ resources: playerResources })
      .where(eq(playerStates.id, origin?.id));

    const text = `Dark matter found! +${dmAmount} dark matter credited to your account.`;
    fleet.flightTime = fleet.deployTime;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async lostFleet(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any): Promise<void> {
    const text = 'Your fleet was lost in a black hole! All ships destroyed.';
    fleet.flightTime = fleet.deployTime;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async delayFleet(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any): Promise<void> {
    const delayFactors = [2, 3, 5];
    const delayWeights = [89, 10, 1];
    const totalWeight = delayWeights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    let selectedFactor = 2;
    for (let i = 0; i < delayFactors.length; i++) {
      roll -= delayWeights[i];
      if (roll <= 0) {
        selectedFactor = delayFactors[i];
        break;
      }
    }
    fleet.flightTime = fleet.deployTime * selectedFactor;
    const text = `Fleet return delayed by ${selectedFactor}x! New arrival time: ${Math.floor(fleet.flightTime / 60)}m.`;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async accelFleet(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any): Promise<void> {
    const accelFactors = [2, 3, 5];
    const accelWeights = [89, 10, 1];
    const totalWeight = accelWeights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    let selectedFactor = 2;
    for (let i = 0; i < accelFactors.length; i++) {
      roll -= accelWeights[i];
      if (roll <= 0) {
        selectedFactor = accelFactors[i];
        break;
      }
    }
    fleet.flightTime = Math.ceil(fleet.deployTime / selectedFactor);
    const text = `Fleet return accelerated by ${selectedFactor}x! New arrival time: ${Math.floor(fleet.flightTime / 60)}m.`;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async resourcesFound(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any, settings: ExpeditionSettings): Promise<void> {
    const points = this.expPoints(fleet);
    const upperLimit = this.expUpperLimit(settings);
    const roll = Math.random();
    const amount = Math.min(Math.floor(roll * points * 100), upperLimit);

    const resourceType = Math.floor(Math.random() * 3);
    let resourceKey: string;
    let resourceAmount: number;
    switch (resourceType) {
      case 0:
        resourceKey = 'metal';
        resourceAmount = amount;
        break;
      case 1:
        resourceKey = 'crystal';
        resourceAmount = Math.floor(amount * (2 / 3));
        break;
      default:
        resourceKey = 'deuterium';
        resourceAmount = Math.floor(amount * (1 / 3));
        break;
    }

    let playerResources = origin?.resources || {};
    playerResources[resourceKey] = (playerResources[resourceKey] || 0) + resourceAmount;

    await db.update(playerStates)
      .set({ resources: playerResources })
      .where(eq(playerStates.id, origin?.id));

    const text = `Resources found! +${resourceAmount} ${resourceKey} added to your storage.`;
    fleet.flightTime = fleet.deployTime;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async fleetFound(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any, settings: ExpeditionSettings): Promise<void> {
    const points = this.expPoints(fleet);
    const upperLimit = this.expUpperLimit(settings);
    const roll = Math.random();
    const structurePoints = Math.min(Math.floor(roll * points * 100), upperLimit);

    const shipTypes: Record<number, { minGid: number; maxGid: number; label: string }> = {
      1: { minGid: 210, maxGid: 210, label: 'espionage_probe' },
      2: { minGid: 202, maxGid: 203, label: 'cargo_probe' },
      3: { minGid: 204, maxGid: 206, label: 'fighter_cruiser' },
      4: { minGid: 207, maxGid: 209, label: 'battleship_destroyer' },
    };

    let fleetLevel = 0;
    for (const gidStr of Object.keys(fleet)) {
      const gid = parseInt(gidStr);
      if (isNaN(gid) || gid < 200) continue;
      const count = fleet[gid] || 0;
      if (count <= 0) continue;
      if (gid === 210) fleetLevel = Math.max(fleetLevel, 1);
      else if (gid === 202 || gid === 203) fleetLevel = Math.max(fleetLevel, 2);
      else if (gid >= 204 && gid <= 206) fleetLevel = Math.max(fleetLevel, 3);
      else if (gid >= 207) fleetLevel = Math.max(fleetLevel, 4);
    }
    if (fleetLevel === 0) fleetLevel = 1;

    const eligibleShipGids: number[] = [];
    for (let level = 1; level <= Math.min(fleetLevel + 1, 4); level++) {
      const shipTypesForLevel = Object.entries(shipTypes)
        .filter(([lvl]) => parseInt(lvl) <= level)
        .map(([, info]) => info);
      for (const info of shipTypesForLevel) {
        for (let gid = info.minGid; gid <= info.maxGid; gid++) {
          if (!eligibleShipGids.includes(gid)) eligibleShipGids.push(gid);
        }
      }
    }

    const shipCosts: Record<number, { metal: number; crystal: number }> = {
      202: { metal: 2000, crystal: 2000 },
      203: { metal: 6000, crystal: 6000 },
      204: { metal: 3000, crystal: 1000 },
      205: { metal: 6000, crystal: 4000 },
      206: { metal: 20000, crystal: 7000 },
      207: { metal: 45000, crystal: 15000 },
      208: { metal: 30000, crystal: 40000 },
      209: { metal: 50000, crystal: 50000 },
      210: { metal: 2000000, crystal: 2000000 },
    };

    const shipLabels: Record<number, string> = {
      202: 'Small Cargo',
      203: 'Large Cargo',
      204: 'Light Fighter',
      205: 'Heavy Fighter',
      206: 'Cruiser',
      207: 'Battleship',
      208: 'Battlecruiser',
      209: 'Destroyer',
      210: 'Deathstar',
    };

    const numShipTypes = Math.min(1 + Math.floor(Math.random() * 3), eligibleShipGids.length);
    const shuffled = [...eligibleShipGids].sort(() => Math.random() - 0.5);
    const selectedGids = shuffled.slice(0, numShipTypes);

    let remainingSP = structurePoints;
    const foundShips: Record<number, number> = {};
    for (let i = 0; i < selectedGids.length; i++) {
      const gid = selectedGids[i];
      const cost = shipCosts[gid];
      if (!cost) continue;
      const shipCost = cost.metal + cost.crystal;
      let allocatedSP: number;
      if (i < selectedGids.length - 1) {
        allocatedSP = Math.floor(remainingSP * (0.25 + Math.random() * 0.75));
      } else {
        allocatedSP = remainingSP;
      }
      const count = Math.floor(allocatedSP / shipCost);
      if (count > 0) {
        foundShips[gid] = count;
      }
      remainingSP -= allocatedSP;
      if (remainingSP < 0) remainingSP = 0;
    }

    if (Object.keys(foundShips).length === 0 && structurePoints > 0) {
      const cheapest = selectedGids.length > 0 ? selectedGids[0] : 202;
      const cost = shipCosts[cheapest];
      if (cost && structurePoints >= (cost.metal + cost.crystal)) {
        foundShips[cheapest] = 1;
      }
    }

    let playerUnits = origin?.units || {};
    const foundList: string[] = [];
    for (const [gidStr, count] of Object.entries(foundShips)) {
      const gid = parseInt(gidStr);
      playerUnits[gidStr] = (playerUnits[gidStr] || 0) + count;
      foundList.push(`${count}x ${shipLabels[gid] || 'Ship'}`);
    }

    await db.update(playerStates)
      .set({ units: playerUnits })
      .where(eq(playerStates.id, origin?.id));

    const text = `Fleet found! Discovered ${foundList.join(', ')}.`;
    fleet.flightTime = fleet.deployTime;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async traderFound(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any): Promise<void> {
    const rates = [
      { give: 'metal', get: 'crystal', rate: 2 + Math.floor(Math.random() * 2) },
      { give: 'metal', get: 'deuterium', rate: 3 + Math.floor(Math.random() * 2) },
      { give: 'crystal', get: 'metal', rate: 1 + Math.floor(Math.random() * 1) },
      { give: 'crystal', get: 'deuterium', rate: 2 + Math.floor(Math.random() * 1) },
      { give: 'deuterium', get: 'metal', rate: 1 + Math.floor(Math.random() * 1) },
      { give: 'deuterium', get: 'crystal', rate: 1 + Math.floor(Math.random() * 1) },
    ];
    const selectedRate = rates[Math.floor(Math.random() * rates.length)];

    const text = `Trader found! Offer: ${selectedRate.rate} ${selectedRate.give} -> 1 ${selectedRate.get}.`;
    fleet.flightTime = fleet.deployTime;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async expeditionBattle(queue: any, fleetObj: any, fleet: ExpeditionFleet, npcType: string, strength: string, origin: any, target: any): Promise<void> {
    let text: string;
    if (npcType === 'alien') {
      text = `Battle with ${strength} alien fleet!`;
    } else {
      text = `Battle with ${strength} pirate fleet!`;
    }
    fleet.flightTime = fleet.deployTime;
    await this.sendFleetBack(queue, fleetObj, fleet, origin, target, text);
  }

  static async expeditionHold(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any): Promise<void> {
    const expCount = await this.getExpeditionsCount(fleet.ownerId);
    const settings = await this.loadExpeditionSettings();
    const holdTime = fleet.deployTime || 3600;

    const outcome = this.expedition(expCount, settings, holdTime);

    switch (outcome) {
      case EXP_NOTHING:
        await this.nothingHappens(queue, fleetObj, fleet, origin, target);
        break;
      case EXP_ALIENS:
        await this.battleAliens(queue, fleetObj, fleet, origin, target);
        break;
      case EXP_PIRATES:
        await this.battlePirates(queue, fleetObj, fleet, origin, target);
        break;
      case EXP_DARK_MATTER:
        await this.darkMatterFound(queue, fleetObj, fleet, origin, target, settings);
        break;
      case EXP_BLACK_HOLE:
        await this.lostFleet(queue, fleetObj, fleet, origin, target);
        break;
      case EXP_DELAY:
        await this.delayFleet(queue, fleetObj, fleet, origin, target);
        break;
      case EXP_ACCEL:
        await this.accelFleet(queue, fleetObj, fleet, origin, target);
        break;
      case EXP_RESOURCES:
        await this.resourcesFound(queue, fleetObj, fleet, origin, target, settings);
        break;
      case EXP_FLEET:
        await this.fleetFound(queue, fleetObj, fleet, origin, target, settings);
        break;
      case EXP_TRADER:
        await this.traderFound(queue, fleetObj, fleet, origin, target);
        break;
      default:
        await this.nothingHappens(queue, fleetObj, fleet, origin, target);
        break;
    }
  }

  private static async sendFleetBack(queue: any, fleetObj: any, fleet: ExpeditionFleet, origin: any, target: any, text: string): Promise<void> {
    if (fleetObj) {
      fleetObj.returnMessage = text;
    }
  }
}

export default ExpeditionOGameService;
