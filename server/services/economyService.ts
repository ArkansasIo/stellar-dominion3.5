import { db } from '../db';
import { sql } from 'drizzle-orm';
import { playerStates } from '../../shared/schema';

export class EconomyService {
  static async getResources(playerId: string) {
    const result = await db.execute(sql`
      SELECT resources FROM player_states WHERE user_id = ${playerId} LIMIT 1
    `);
    return (result.rows[0] as any)?.resources || null;
  }

  static async updateResources(playerId: string, resources: Record<string, number>) {
    const current = await this.getResources(playerId);
    const updated = { ...current, ...resources };
    await db.execute(sql`
      UPDATE player_states SET resources = ${JSON.stringify(updated)}::jsonb WHERE user_id = ${playerId}
    `);
    return updated;
  }

  static async deductResources(playerId: string, costs: Record<string, number>) {
    const current = await this.getResources(playerId);
    if (!current) throw new Error('Player state not found');
    for (const [key, amount] of Object.entries(costs)) {
      if ((current[key] || 0) < amount) throw new Error(`Insufficient ${key}`);
    }
    const updated: Record<string, number> = { ...current };
    for (const [key, amount] of Object.entries(costs)) {
      updated[key] = (updated[key] || 0) - amount;
    }
    await db.execute(sql`
      UPDATE player_states SET resources = ${JSON.stringify(updated)}::jsonb WHERE user_id = ${playerId}
    `);
    return updated;
  }

  static async getProductionRates(playerId: string) {
    const result = await db.execute(sql`
      SELECT resource_production FROM player_states WHERE user_id = ${playerId} LIMIT 1
    `);
    const production = (result.rows[0] as any)?.resource_production;
    return production || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
  }

  static async getMarketPrices() {
    const result = await db.execute(sql`
      SELECT price_data FROM system_settings WHERE key = 'market_prices' LIMIT 1
    `);
    return (result.rows[0] as any)?.price_data || {
      metal: 1, crystal: 2, deuterium: 4, antimatter: 50, quantumCrystals: 100
    };
  }

  static async calculateEmpireValue(playerId: string) {
    const result = await db.execute(sql`
      SELECT resources, buildings, units FROM player_states WHERE user_id = ${playerId} LIMIT 1
    `);
    const state = result.rows[0] as any;
    if (!state) return 0;

    const resources = state.resources || {};
    const resourceValue = (resources.metal || 0) + (resources.crystal || 0) * 2 + (resources.deuterium || 0) * 4;

    const empireResult = await db.execute(sql`
      SELECT total_value FROM empire_values WHERE player_id = ${playerId} LIMIT 1
    `);
    return (empireResult.rows[0] as any)?.total_value || resourceValue;
  }

  static async processResourceTick(playerId: string) {
    const production = await this.getProductionRates(playerId);
    const resources = await this.getResources(playerId);
    if (!resources) return;

    const updated: Record<string, number> = { ...resources };
    for (const [key, rate] of Object.entries(production)) {
      updated[key] = (updated[key] || 0) + (rate as number);
    }
    await db.execute(sql`
      UPDATE player_states SET resources = ${JSON.stringify(updated)}::jsonb WHERE user_id = ${playerId}
    `);
    return updated;
  }
}
