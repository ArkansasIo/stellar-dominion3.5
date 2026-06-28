import { db } from "../db";
import { playerStates } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { OGAME_CATALOG_ENTRY_MAP } from "../../shared/config/ogameCatalogConfig";

const OFFICER_IDS = ["commanderOfficer", "admiralOfficer", "engineerOfficer", "geologistOfficer", "technocratOfficer"];

export interface OfficerBonusSet {
  fleetSlotsBonus: number;
  defenseDurabilityBonus: number;
  mineProductionBonus: number;
  researchSpeedBonus: number;
  espionageBonus: number;
  queueSlotsBonus: number;
}

const EMPTY_BONUSES: OfficerBonusSet = {
  fleetSlotsBonus: 0,
  defenseDurabilityBonus: 0,
  mineProductionBonus: 0,
  researchSpeedBonus: 0,
  espionageBonus: 0,
  queueSlotsBonus: 0,
};

export class OfficerService {
  static async getActiveOfficers(userId: string): Promise<Record<string, { activatedAt: number; expiresAt: number }>> {
    const [state] = await db
      .select({ activeOfficers: playerStates.activeOfficers })
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (!state) return {};

    const activeOfficers = (state.activeOfficers as Record<string, any>) || {};
    const now = Date.now();

    for (const [id, data] of Object.entries(activeOfficers)) {
      if (data.expiresAt && data.expiresAt < now) {
        delete activeOfficers[id];
      }
    }

    return activeOfficers as Record<string, { activatedAt: number; expiresAt: number }>;
  }

  static async getBonuses(userId: string): Promise<OfficerBonusSet> {
    const active = await this.getActiveOfficers(userId);
    if (Object.keys(active).length === 0) return { ...EMPTY_BONUSES };

    const bonuses: OfficerBonusSet = { ...EMPTY_BONUSES };

    for (const [id, _data] of Object.entries(active)) {
      const def = OGAME_CATALOG_ENTRY_MAP[id];
      if (!def?.stats) continue;

      const stats = def.stats as Record<string, any>;
      if (stats.fleetSlotsBonus) bonuses.fleetSlotsBonus += Number(stats.fleetSlotsBonus);
      if (stats.defenseDurabilityBonus) bonuses.defenseDurabilityBonus += Number(stats.defenseDurabilityBonus);
      if (stats.mineProductionBonus) bonuses.mineProductionBonus += Number(stats.mineProductionBonus);
      if (stats.researchSpeedBonus) bonuses.researchSpeedBonus += Number(stats.researchSpeedBonus);
      if (stats.espionageBonus) bonuses.espionageBonus += Number(stats.espionageBonus);
      if (stats.queueSlotsBonus) bonuses.queueSlotsBonus += Number(stats.queueSlotsBonus);
    }

    return bonuses;
  }

  static async getOfficerListWithStatus(userId: string) {
    const active = await this.getActiveOfficers(userId);
    const now = Date.now();

    return OFFICER_IDS.map((id) => {
      const def = OGAME_CATALOG_ENTRY_MAP[id];
      const activeData = active[id];
      return {
        id,
        name: def?.name || id,
        description: def?.description || "",
        cost: def?.baseCost || { darkMatter: 500 },
        stats: def?.stats || {},
        active: !!activeData,
        expiresAt: activeData?.expiresAt || null,
        remainingDays: activeData ? Math.max(0, Math.floor((activeData.expiresAt - now) / 86400000)) : 0,
      };
    });
  }
}

export default OfficerService;
