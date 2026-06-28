import { db } from '../db';
import { sql } from 'drizzle-orm';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
type LogCategory = 'auth' | 'economy' | 'combat' | 'research' | 'admin' | 'system' | 'trade' | 'alliance' | 'espionage' | 'fleet';

interface LogEntry {
  level: LogLevel;
  category: LogCategory;
  userId?: string;
  action: string;
  details?: Record<string, any>;
  ip?: string;
}

export class LoggingService {
  private static logToConsole(entry: LogEntry) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.category}]`;
    const message = `${prefix} ${entry.action}${entry.userId ? ` (user: ${entry.userId})` : ''}`;
    switch (entry.level) {
      case 'error':
      case 'critical':
        console.error(message, entry.details || '');
        break;
      case 'warn':
        console.warn(message, entry.details || '');
        break;
      default:
        console.log(message, entry.details || '');
    }
  }

  static async log(entry: LogEntry) {
    this.logToConsole(entry);
    try {
      await db.execute(sql`
        INSERT INTO game_logs (level, category, user_id, action, details, ip_address)
        VALUES (
          ${entry.level},
          ${entry.category},
          ${entry.userId || null},
          ${entry.action},
          ${JSON.stringify(entry.details || {})}::jsonb,
          ${entry.ip || null}
        )
      `);
    } catch (err) {
      console.error('Failed to write log to database:', err);
    }
  }

  static async info(category: LogCategory, action: string, details?: Record<string, any>, userId?: string) {
    await this.log({ level: 'info', category, action, details, userId });
  }

  static async warn(category: LogCategory, action: string, details?: Record<string, any>, userId?: string) {
    await this.log({ level: 'warn', category, action, details, userId });
  }

  static async error(category: LogCategory, action: string, details?: Record<string, any>, userId?: string) {
    await this.log({ level: 'error', category, action, details, userId });
  }

  static async critical(category: LogCategory, action: string, details?: Record<string, any>, userId?: string) {
    await this.log({ level: 'critical', category, action, details, userId });
  }

  static async debug(category: LogCategory, action: string, details?: Record<string, any>, userId?: string) {
    if (process.env.NODE_ENV !== 'production') {
      await this.log({ level: 'debug', category, action, details, userId });
    }
  }

  static async getLogs(options: {
    level?: LogLevel;
    category?: LogCategory;
    userId?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (options.level) {
      conditions.push(`level = $${paramIndex++}`);
      params.push(options.level);
    }
    if (options.category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(options.category);
    }
    if (options.userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(options.userId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = options.limit || 100;
    const offset = options.offset || 0;

    const result = await db.execute(sql`
      SELECT * FROM game_logs ${sql.raw(whereClause)}
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
    `);
    return result.rows;
  }

  static async getRecentErrors(limit = 20) {
    return this.getLogs({ level: 'error', limit });
  }

  static async getUserActivity(userId: string, limit = 50) {
    return this.getLogs({ userId, limit });
  }

  static async cleanupOldLogs(daysOld = 90) {
    await db.execute(sql`
      DELETE FROM game_logs WHERE created_at < NOW() - INTERVAL '${daysOld} days'
    `);
  }

  static async getLogCountByLevel() {
    const result = await db.execute(sql`
      SELECT level, COUNT(*) as count FROM game_logs GROUP BY level ORDER BY level
    `);
    return result.rows;
  }

  static async getLogCountByCategory() {
    const result = await db.execute(sql`
      SELECT category, COUNT(*) as count FROM game_logs GROUP BY category ORDER BY category
    `);
    return result.rows;
  }
}
