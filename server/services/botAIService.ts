/**
 * Visual Block-based Bot AI System
 * Bot strategies are defined as JSON graphs with connected blocks (Start, End, Label, Branch, Cond, Action)
 * Inspired by OGame block-based bot system
 * @tag #bot #ai #automation #strategy
 */

import { db } from '../db';
import { sql, eq, and } from 'drizzle-orm';
import { playerStates, queueItems, users } from '../../shared/schema';

export type BotBlockCategory = 'Start' | 'End' | 'Label' | 'Branch' | 'Cond' | 'Action';

export interface BotBlock {
  key: number;
  category: BotBlockCategory;
  text: string;
  color?: string;
}

export interface BotLink {
  from: number;
  to: number;
  fromPort?: string;
  text?: string;
}

export interface BotStrategy {
  id: string;
  name: string;
  ownerId: string;
  source: string;
  nodeDataArray: BotBlock[];
  linkDataArray: BotLink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BotContext {
  playerId: string;
  resources: { metal: number; crystal: number; deuterium: number };
  buildings: Record<string, number>;
  research: Record<string, number>;
  fleet: Record<string, number>;
  defense: Record<string, number>;
  getVar: (key: string, defaultValue?: string) => Promise<string | null>;
  setVar: (key: string, value: string) => Promise<void>;
  [key: string]: any;
}

interface BotConfigRow {
  player_id: string;
  strategy_id: string | null;
  current_block_id: number | null;
  is_running: boolean;
  next_run_at: Date | null;
  updated_at: Date;
}

export class BotAIService {
  private static instance: BotAIService;
  private initialized = false;
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): BotAIService {
    if (!BotAIService.instance) {
      BotAIService.instance = new BotAIService();
    }
    return BotAIService.instance;
  }

  private async ensureTables(): Promise<void> {
    if (this.initialized) return;

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bot_strategies (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar NOT NULL,
        owner_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        source text NOT NULL DEFAULT '{}',
        node_data_array jsonb NOT NULL DEFAULT '[]'::jsonb,
        link_data_array jsonb NOT NULL DEFAULT '[]'::jsonb,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bot_variables (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        key varchar NOT NULL,
        value text NOT NULL DEFAULT '',
        updated_at timestamp NOT NULL DEFAULT now(),
        UNIQUE(owner_id, key)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bot_config (
        player_id varchar PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        strategy_id varchar REFERENCES bot_strategies(id) ON DELETE SET NULL,
        current_block_id integer,
        is_running boolean NOT NULL DEFAULT false,
        next_run_at timestamp,
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bot_queue (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        strategy_id varchar NOT NULL REFERENCES bot_strategies(id) ON DELETE CASCADE,
        block_id integer NOT NULL,
        execute_at timestamp NOT NULL,
        status varchar NOT NULL DEFAULT 'pending',
        created_at timestamp NOT NULL DEFAULT now()
      )
    `);

    this.initialized = true;
  }

  // ==================== STRATEGY CRUD ====================

  async createStrategy(name: string, source: string, ownerId: string): Promise<BotStrategy> {
    await this.ensureTables();

    const parsed = JSON.parse(source);
    const nodeDataArray = parsed.nodeDataArray || [];
    const linkDataArray = parsed.linkDataArray || [];

    const result = await db.execute(sql`
      INSERT INTO bot_strategies (name, owner_id, source, node_data_array, link_data_array)
      VALUES (${name}, ${ownerId}, ${source}, ${JSON.stringify(nodeDataArray)}::jsonb, ${JSON.stringify(linkDataArray)}::jsonb)
      RETURNING id, name, owner_id, source, node_data_array, link_data_array, created_at, updated_at
    `);

    const row = result.rows[0] as any;
    return {
      id: row.id,
      name: row.name,
      ownerId: row.owner_id,
      source: row.source,
      nodeDataArray: row.node_data_array,
      linkDataArray: row.link_data_array,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async getStrategy(id: string): Promise<BotStrategy | null> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT id, name, owner_id, source, node_data_array, link_data_array, created_at, updated_at
      FROM bot_strategies WHERE id = ${id}
    `);

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as any;
    return {
      id: row.id,
      name: row.name,
      ownerId: row.owner_id,
      source: row.source,
      nodeDataArray: row.node_data_array,
      linkDataArray: row.link_data_array,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async getStrategiesByOwner(ownerId: string): Promise<BotStrategy[]> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT id, name, owner_id, source, node_data_array, link_data_array, created_at, updated_at
      FROM bot_strategies WHERE owner_id = ${ownerId}
      ORDER BY created_at DESC
    `);

    return (result.rows as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      ownerId: row.owner_id,
      source: row.source,
      nodeDataArray: row.node_data_array,
      linkDataArray: row.link_data_array,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async updateStrategy(id: string, source: string): Promise<void> {
    await this.ensureTables();

    const parsed = JSON.parse(source);
    const nodeDataArray = parsed.nodeDataArray || [];
    const linkDataArray = parsed.linkDataArray || [];

    await db.execute(sql`
      UPDATE bot_strategies
      SET source = ${source},
          node_data_array = ${JSON.stringify(nodeDataArray)}::jsonb,
          link_data_array = ${JSON.stringify(linkDataArray)}::jsonb,
          updated_at = now()
      WHERE id = ${id}
    `);
  }

  async deleteStrategy(id: string): Promise<void> {
    await this.ensureTables();
    await db.execute(sql`DELETE FROM bot_strategies WHERE id = ${id}`);
  }

  // ==================== BOT CONFIG ====================

  async assignStrategy(playerId: string, strategyId: string): Promise<void> {
    await this.ensureTables();

    await db.execute(sql`
      INSERT INTO bot_config (player_id, strategy_id, updated_at)
      VALUES (${playerId}, ${strategyId}, now())
      ON CONFLICT (player_id) DO UPDATE SET
        strategy_id = EXCLUDED.strategy_id,
        updated_at = now()
    `);
  }

  // ==================== BOT LIFECYCLE ====================

  async addBot(name: string): Promise<boolean> {
    await this.ensureTables();
    return true;
  }

  async startBot(playerId: string): Promise<void> {
    await this.ensureTables();

    const config = await this.getBotConfig(playerId);
    if (!config || !config.strategy_id) {
      throw new Error('No strategy assigned to this player. Call assignStrategy first.');
    }

    const strategy = await this.getStrategy(config.strategy_id);
    if (!strategy) {
      throw new Error('Assigned strategy not found');
    }

    const startBlock = strategy.nodeDataArray.find(b => b.category === 'Start');
    if (!startBlock) {
      throw new Error('Strategy has no Start block');
    }

    await db.execute(sql`
      INSERT INTO bot_config (player_id, strategy_id, current_block_id, is_running, updated_at)
      VALUES (${playerId}, ${config.strategy_id}, ${startBlock.key}, true, now())
      ON CONFLICT (player_id) DO UPDATE SET
        strategy_id = EXCLUDED.strategy_id,
        current_block_id = ${startBlock.key},
        is_running = true,
        updated_at = now()
    `);

    await this.executeBlock(strategy, startBlock.key);
  }

  async stopBot(playerId: string): Promise<void> {
    await this.ensureTables();

    const timer = this.activeTimers.get(playerId);
    if (timer) {
      clearTimeout(timer);
      this.activeTimers.delete(playerId);
    }

    await db.execute(sql`
      UPDATE bot_config
      SET is_running = false, next_run_at = NULL, updated_at = now()
      WHERE player_id = ${playerId}
    `);
  }

  async isBot(playerId: string): Promise<boolean> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT is_running FROM bot_config WHERE player_id = ${playerId}
    `);

    return result.rows.length > 0 && !!(result.rows[0] as any).is_running;
  }

  // ==================== STRATEGY EXECUTION ====================

  async executeBlock(strategy: BotStrategy, blockId: number): Promise<void> {
    const block = strategy.nodeDataArray.find(b => b.key === blockId);
    if (!block) return;

    switch (block.category) {
      case 'Start': {
        const nextLink = strategy.linkDataArray.find(l => l.from === blockId);
        if (nextLink) {
          await this.executeBlock(strategy, nextLink.to);
        }
        break;
      }

      case 'End': {
        const nextLink = strategy.linkDataArray.find(l => l.from === blockId);
        if (nextLink) {
          await this.executeBlock(strategy, nextLink.to);
        } else {
          await this.stopBot(strategy.ownerId);
        }
        break;
      }

      case 'Label': {
        const nextLink = strategy.linkDataArray.find(l => l.from === blockId);
        if (nextLink) {
          await this.executeBlock(strategy, nextLink.to);
        }
        break;
      }

      case 'Branch': {
        const labelBlock = strategy.nodeDataArray.find(
          b => b.category === 'Label' && b.text === block.text
        );
        if (labelBlock) {
          await this.executeBlock(strategy, labelBlock.key);
        } else {
          const nextLink = strategy.linkDataArray.find(l => l.from === blockId);
          if (nextLink) {
            await this.executeBlock(strategy, nextLink.to);
          }
        }
        break;
      }

      case 'Cond': {
        const context = await this.buildContext(strategy.ownerId);
        const result = this.evaluateCondition(block.text, context);

        const yesLink = strategy.linkDataArray.find(
          l => l.from === blockId && l.text?.toLowerCase() === 'yes'
        );
        const noLink = strategy.linkDataArray.find(
          l => l.from === blockId && l.text?.toLowerCase() === 'no'
        );
        const percentLinks = strategy.linkDataArray.filter(
          l => l.from === blockId && l.text && l.text.endsWith('%')
        );

        let taken = false;

        if (result && yesLink) {
          await this.executeBlock(strategy, yesLink.to);
          taken = true;
        } else if (!result && noLink) {
          await this.executeBlock(strategy, noLink.to);
          taken = true;
        } else if (percentLinks.length > 0) {
          const roll = Math.random() * 100;
          let cumulative = 0;
          for (const link of percentLinks) {
            const pct = parseInt(link.text!, 10);
            cumulative += pct;
            if (roll < cumulative) {
              await this.executeBlock(strategy, link.to);
              taken = true;
              break;
            }
          }
          if (!taken) {
            const fallback = strategy.linkDataArray.find(
              l => l.from === blockId && !l.text
            );
            if (fallback) {
              await this.executeBlock(strategy, fallback.to);
              taken = true;
            }
          }
        }

        if (!taken) {
          const nextLink = strategy.linkDataArray.find(l => l.from === blockId);
          if (nextLink) {
            await this.executeBlock(strategy, nextLink.to);
          }
        }
        break;
      }

      case 'Action': {
        const context = await this.buildContext(strategy.ownerId);
        const sleepSeconds = await this.executeAction(block.text, context);

        await db.execute(sql`
          UPDATE bot_config
          SET current_block_id = ${blockId}, updated_at = now()
          WHERE player_id = ${strategy.ownerId}
        `);

        const nextLink = strategy.linkDataArray.find(l => l.from === blockId);

        if (sleepSeconds > 0 && nextLink) {
          await this.scheduleNext(strategy.ownerId, strategy.id, nextLink.to, sleepSeconds);
        } else if (nextLink) {
          await this.executeBlock(strategy, nextLink.to);
        } else {
          await this.scheduleNext(strategy.ownerId, strategy.id, blockId, 5);
        }
        break;
      }
    }
  }

  // ==================== CONDITION EVALUATION ====================

  evaluateCondition(condition: string, context: BotContext): boolean {
    try {
      const fn = new Function('context', `return Boolean(${condition})`);
      return fn(context);
    } catch {
      return false;
    }
  }

  // ==================== ACTION EXECUTION ====================

  async executeAction(action: string, context: BotContext): Promise<number> {
    try {
      const fn = new Function('context', `
        return (async () => {
          ${action}
        })();
      `);
      const result = await fn(context);
      return typeof result === 'number' && isFinite(result) ? Math.max(0, result) : 0;
    } catch {
      return 0;
    }
  }

  // ==================== QUEUE EVENT HANDLER ====================

  async onQueueEnd(taskId: string, strategy: BotStrategy, blockId: number, playerId: string): Promise<void> {
    const config = await this.getBotConfig(playerId);
    if (!config || !config.is_running) return;

    const nextLink = strategy.linkDataArray.find(l => l.from === blockId);
    if (nextLink) {
      await this.executeBlock(strategy, nextLink.to);
    }
  }

  // ==================== VARIABLE MANAGEMENT ====================

  async getVar(ownerId: string, key: string, defaultValue?: string): Promise<string | null> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT value FROM bot_variables WHERE owner_id = ${ownerId} AND key = ${key}
    `);

    if (result.rows.length === 0) {
      return defaultValue ?? null;
    }

    return (result.rows[0] as any).value;
  }

  async setVar(ownerId: string, key: string, value: string): Promise<void> {
    await this.ensureTables();

    await db.execute(sql`
      INSERT INTO bot_variables (owner_id, key, value)
      VALUES (${ownerId}, ${key}, ${value})
      ON CONFLICT (owner_id, key) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = now()
    `);
  }

  // ==================== SCHEDULING ====================

  async scheduleNext(playerId: string, strategyId: string, blockId: number, delay: number): Promise<void> {
    await this.ensureTables();

    const executeAt = new Date(Date.now() + delay * 1000);

    await db.execute(sql`
      UPDATE bot_config
      SET next_run_at = ${executeAt}, current_block_id = ${blockId}, updated_at = now()
      WHERE player_id = ${playerId}
    `);

    await db.execute(sql`
      INSERT INTO bot_queue (player_id, strategy_id, block_id, execute_at, status)
      VALUES (${playerId}, ${strategyId}, ${blockId}, ${executeAt}, 'pending')
    `);

    const existing = this.activeTimers.get(playerId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      this.processScheduledExecution(playerId).catch(() => {});
    }, delay * 1000);

    this.activeTimers.set(playerId, timer);
  }

  private async processScheduledExecution(playerId: string): Promise<void> {
    this.activeTimers.delete(playerId);

    const config = await this.getBotConfig(playerId);
    if (!config || !config.is_running || !config.strategy_id) return;

    const strategy = await this.getStrategy(config.strategy_id);
    if (!strategy) return;

    if (config.current_block_id !== null) {
      await this.executeBlock(strategy, config.current_block_id);
    }
  }

  // ==================== RESUME ALL BOTS ====================

  async resumeAllBots(): Promise<void> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT player_id, strategy_id, current_block_id, next_run_at
      FROM bot_config
      WHERE is_running = true AND strategy_id IS NOT NULL
    `);

    const now = Date.now();

    for (const row of result.rows as any[]) {
      if (!row.strategy_id || row.current_block_id === null) continue;

      const strategy = await this.getStrategy(row.strategy_id);
      if (!strategy) continue;

      if (row.next_run_at) {
        const delay = Math.max(0, new Date(row.next_run_at).getTime() - now);
        await this.scheduleNext(row.player_id, row.strategy_id, row.current_block_id, delay / 1000);
      } else {
        await this.executeBlock(strategy, row.current_block_id);
      }
    }
  }

  // ==================== HELPER METHODS ====================

  private async buildContext(playerId: string): Promise<BotContext> {
    const result = await db.execute(sql`
      SELECT resources, buildings, research, units FROM player_states WHERE id = ${playerId}
    `);

    const row = (result.rows[0] || {}) as any;
    const resources: any = row.resources || {};
    const buildings: any = row.buildings || {};
    const research: any = row.research || {};
    const units: any = row.units || {};

    return {
      playerId,
      resources: {
        metal: Number(resources.metal) || 0,
        crystal: Number(resources.crystal) || 0,
        deuterium: Number(resources.deuterium) || 0,
      },
      buildings,
      research,
      fleet: units.fleet || {},
      defense: units.defense || {},
      getVar: (key: string, defaultValue?: string) => this.getVar(playerId, key, defaultValue),
      setVar: (key: string, value: string) => this.setVar(playerId, key, value),
    };
  }

  private async getBotConfig(playerId: string): Promise<BotConfigRow | null> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT * FROM bot_config WHERE player_id = ${playerId}
    `);

    if (result.rows.length === 0) return null;

    return (result.rows[0] as any) as BotConfigRow;
  }
}

export const botAIService = BotAIService.getInstance();
