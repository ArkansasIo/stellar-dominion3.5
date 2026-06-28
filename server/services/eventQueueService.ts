import { db, pool } from '../db';
import { sql, eq, and, lte, asc, desc, gt, lt, not } from 'drizzle-orm';
import { pgTable, varchar, integer, boolean, bigint, index } from 'drizzle-orm/pg-core';

export enum QueueEventType {
  BUILD = 'BUILD',
  DEMOLISH = 'DEMOLISH',
  RESEARCH = 'RESEARCH',
  SHIPYARD = 'SHIPYARD',
  FLEET = 'FLEET',
  UNLOAD_ALL = 'UNLOAD_ALL',
  CLEAN_DEBRIS = 'CLEAN_DEBRIS',
  CLEAN_PLANETS = 'CLEAN_PLANETS',
  CLEAN_PLAYERS = 'CLEAN_PLAYERS',
  UPDATE_STATS = 'UPDATE_STATS',
  RECALC_POINTS = 'RECALC_POINTS',
  RECALC_ALLY_POINTS = 'RECALC_ALLY_POINTS',
  ALLOW_NAME = 'ALLOW_NAME',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  UNBAN = 'UNBAN',
  ALLOW_ATTACKS = 'ALLOW_ATTACKS',
  DEBUG = 'DEBUG',
  AI = 'AI',
  COUPON = 'COUPON',
}

export const QUEUE_BATCH = 16;

export interface QueueItem {
  id: string;
  ownerId: string;
  type: QueueEventType;
  subId: string;
  objId: string;
  level: number;
  start: number;
  end: number;
  priority: number;
  freeze: boolean;
  frozenAt: number;
}

export const eventQueueTable = pgTable('event_queue_items', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar('owner_id').notNull(),
  type: varchar('type').notNull(),
  subId: varchar('sub_id').notNull(),
  objId: varchar('obj_id').notNull(),
  level: integer('level').notNull().default(0),
  start: bigint('start', { mode: 'number' }).notNull(),
  end: bigint('end', { mode: 'number' }).notNull(),
  priority: integer('priority').notNull().default(0),
  freeze: boolean('freeze').notNull().default(false),
  frozenAt: bigint('frozen_at', { mode: 'number' }).default(0),
}, (table) => [
  index('evq_end_priority_idx').on(table.end, table.priority),
  index('evq_owner_idx').on(table.ownerId),
  index('evq_type_idx').on(table.type),
]);

export type EventQueueInsert = typeof eventQueueTable.$inferInsert;
export type EventQueueSelect = typeof eventQueueTable.$inferSelect;

type EventHandler = (item: QueueItem) => Promise<void>;

export class EventQueueService {
  private static instance: EventQueueService;
  private processing: boolean = false;
  private handlers = new Map<QueueEventType, EventHandler>();
  private universeFrozen: boolean = false;

  private constructor() {}

  static getInstance(): EventQueueService {
    if (!EventQueueService.instance) {
      EventQueueService.instance = new EventQueueService();
    }
    return EventQueueService.instance;
  }

  async ensureTable(): Promise<void> {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_queue_items (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        sub_id VARCHAR NOT NULL,
        obj_id VARCHAR NOT NULL,
        level INTEGER NOT NULL DEFAULT 0,
        start BIGINT NOT NULL,
        end BIGINT NOT NULL,
        priority INTEGER NOT NULL DEFAULT 0,
        freeze BOOLEAN NOT NULL DEFAULT false,
        frozen_at BIGINT DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS evq_end_priority_idx ON event_queue_items (end ASC, priority DESC);
      CREATE INDEX IF NOT EXISTS evq_owner_idx ON event_queue_items (owner_id);
      CREATE INDEX IF NOT EXISTS evq_type_idx ON event_queue_items (type);
    `);
  }

  setUniverseFrozen(frozen: boolean): void {
    this.universeFrozen = frozen;
  }

  isUniverseFrozen(): boolean {
    return this.universeFrozen;
  }

  async add(
    ownerId: string,
    type: QueueEventType,
    subId: string,
    objId: string,
    level: number,
    start: number,
    duration: number,
    priority: number = 0,
  ): Promise<string> {
    const end = start + duration;
    const [row] = await db
      .insert(eventQueueTable)
      .values({
        ownerId,
        type,
        subId,
        objId,
        level,
        start,
        end,
        priority,
      } as EventQueueInsert)
      .returning({ id: eventQueueTable.id });

    if (!row) throw new Error('Failed to create queue item');
    return row.id;
  }

  async load(taskId: string): Promise<QueueItem | null> {
    const [row] = await db
      .select()
      .from(eventQueueTable)
      .where(eq(eventQueueTable.id, taskId))
      .limit(1);

    if (!row) return null;
    return this.mapRow(row);
  }

  async remove(taskId: string): Promise<void> {
    await db
      .delete(eventQueueTable)
      .where(eq(eventQueueTable.id, taskId));
  }

  async prolong(taskId: string, seconds: number): Promise<void> {
    const ms = seconds * 1000;
    await db
      .update(eventQueueTable)
      .set({
        end: sql`${eventQueueTable.end} + ${ms}`,
      })
      .where(eq(eventQueueTable.id, taskId));
  }

  async update(until?: number): Promise<number> {
    if (this.processing || this.universeFrozen) return 0;
    this.processing = true;

    try {
      const now = until ?? Date.now();
      let processed = 0;

      const due = await db
        .select()
        .from(eventQueueTable)
        .where(
          and(
            lte(eventQueueTable.end, now),
            not(eq(eventQueueTable.freeze, true)),
          ),
        )
        .orderBy(asc(eventQueueTable.end), desc(eventQueueTable.priority))
        .limit(QUEUE_BATCH);

      for (const row of due) {
        const item = this.mapRow(row);
        const handler = this.handlers.get(item.type);
        if (handler) {
          try {
            await handler(item);
          } catch (err) {
            console.error(`[EventQueue] Handler error for ${item.type} (${item.id}):`, err);
          }
        }
        await this.remove(item.id);
        processed++;
      }

      return processed;
    } finally {
      this.processing = false;
    }
  }

  async flushPlanet(planetId: string): Promise<void> {
    await db
      .delete(eventQueueTable)
      .where(
        and(
          eq(eventQueueTable.ownerId, planetId),
          sql`${eventQueueTable.type} IN (${QueueEventType.BUILD}, ${QueueEventType.DEMOLISH}, ${QueueEventType.RESEARCH}, ${QueueEventType.SHIPYARD})`,
        ),
      );
  }

  async freeze(taskId: string, shouldFreeze: boolean, when?: number): Promise<void> {
    const now = when ?? Date.now();

    if (shouldFreeze) {
      await pool.query(
        'UPDATE event_queue_items SET freeze = true, frozen_at = $1 WHERE id = $2',
        [now, taskId],
      );
    } else {
      const { rows } = await pool.query(
        'SELECT frozen_at FROM event_queue_items WHERE id = $1',
        [taskId],
      );
      if (rows.length === 0) return;

      const frozenDuration = now - (rows[0].frozen_at ?? now);
      await pool.query(
        'UPDATE event_queue_items SET freeze = false, frozen_at = 0, end = end + $1 WHERE id = $2',
        [frozenDuration, taskId],
      );
    }
  }

  registerHandler(type: QueueEventType, handler: EventHandler): void {
    this.handlers.set(type, handler);
  }

  registerDefaultHandlers(): void {
    this.registerHandler(QueueEventType.BUILD, async (item) => {
      console.log(`[EventQueue] BUILD owner=${item.ownerId} subId=${item.subId} objId=${item.objId} level=${item.level}`);
    });

    this.registerHandler(QueueEventType.DEMOLISH, async (item) => {
      console.log(`[EventQueue] DEMOLISH owner=${item.ownerId} subId=${item.subId} objId=${item.objId} level=${item.level}`);
    });

    this.registerHandler(QueueEventType.RESEARCH, async (item) => {
      console.log(`[EventQueue] RESEARCH owner=${item.ownerId} subId=${item.subId} objId=${item.objId} level=${item.level}`);
    });

    this.registerHandler(QueueEventType.SHIPYARD, async (item) => {
      console.log(`[EventQueue] SHIPYARD owner=${item.ownerId} subId=${item.subId} objId=${item.objId} level=${item.level}`);
    });

    this.registerHandler(QueueEventType.FLEET, async (item) => {
      console.log(`[EventQueue] FLEET owner=${item.ownerId} subId=${item.subId} objId=${item.objId}`);
    });

    this.registerHandler(QueueEventType.UNLOAD_ALL, async (item) => {
      console.log(`[EventQueue] UNLOAD_ALL owner=${item.ownerId}`);
    });

    this.registerHandler(QueueEventType.CLEAN_DEBRIS, async () => {
      console.log('[EventQueue] CLEAN_DEBRIS');
    });

    this.registerHandler(QueueEventType.CLEAN_PLANETS, async () => {
      console.log('[EventQueue] CLEAN_PLANETS');
    });

    this.registerHandler(QueueEventType.CLEAN_PLAYERS, async () => {
      console.log('[EventQueue] CLEAN_PLAYERS');
    });

    this.registerHandler(QueueEventType.UPDATE_STATS, async () => {
      console.log('[EventQueue] UPDATE_STATS');
    });

    this.registerHandler(QueueEventType.RECALC_POINTS, async (item) => {
      console.log(`[EventQueue] RECALC_POINTS owner=${item.ownerId}`);
    });

    this.registerHandler(QueueEventType.RECALC_ALLY_POINTS, async () => {
      console.log('[EventQueue] RECALC_ALLY_POINTS');
    });

    this.registerHandler(QueueEventType.ALLOW_NAME, async (item) => {
      console.log(`[EventQueue] ALLOW_NAME owner=${item.ownerId}`);
    });

    this.registerHandler(QueueEventType.CHANGE_EMAIL, async (item) => {
      console.log(`[EventQueue] CHANGE_EMAIL owner=${item.ownerId}`);
    });

    this.registerHandler(QueueEventType.UNBAN, async (item) => {
      console.log(`[EventQueue] UNBAN owner=${item.ownerId}`);
    });

    this.registerHandler(QueueEventType.ALLOW_ATTACKS, async (item) => {
      console.log(`[EventQueue] ALLOW_ATTACKS owner=${item.ownerId}`);
    });

    this.registerHandler(QueueEventType.DEBUG, async (item) => {
      console.log(`[EventQueue] DEBUG owner=${item.ownerId} subId=${item.subId}`);
    });

    this.registerHandler(QueueEventType.AI, async (item) => {
      console.log(`[EventQueue] AI owner=${item.ownerId}`);
    });

    this.registerHandler(QueueEventType.COUPON, async (item) => {
      console.log(`[EventQueue] COUPON owner=${item.ownerId}`);
    });
  }

  async scheduleRecalcPoints(playerId: string): Promise<void> {
    await this.add(playerId, QueueEventType.RECALC_POINTS, '', playerId, 0, Date.now(), 0, 100);
  }

  async scheduleUpdateStats(now?: number): Promise<void> {
    await this.add('', QueueEventType.UPDATE_STATS, '', '', 0, now ?? Date.now(), 0, 90);
  }

  async scheduleRelogin(): Promise<void> {
    await this.add('', QueueEventType.DEBUG, 'relogin', '', 0, Date.now(), 0, 50);
  }

  async scheduleCleanDebris(): Promise<void> {
    await this.add('', QueueEventType.CLEAN_DEBRIS, '', '', 0, Date.now(), 3600000, 10);
  }

  async scheduleCleanPlanets(): Promise<void> {
    await this.add('', QueueEventType.CLEAN_PLANETS, '', '', 0, Date.now(), 3600000, 10);
  }

  async scheduleCleanPlayers(): Promise<void> {
    await this.add('', QueueEventType.CLEAN_PLAYERS, '', '', 0, Date.now(), 3600000, 10);
  }

  private mapRow(row: EventQueueSelect): QueueItem {
    return {
      id: row.id,
      ownerId: row.ownerId,
      type: row.type as QueueEventType,
      subId: row.subId,
      objId: row.objId,
      level: row.level,
      start: row.start,
      end: row.end,
      priority: row.priority,
      freeze: row.freeze,
      frozenAt: row.frozenAt ?? 0,
    };
  }
}

export const eventQueue = EventQueueService.getInstance();
