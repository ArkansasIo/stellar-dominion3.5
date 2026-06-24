import { db } from '../db';
import { sql, and } from 'drizzle-orm';
import { users } from '../../shared/schema';

export type ForumCategory = 'general' | 'strategy' | 'bugs' | 'suggestions' | 'off-topic';

export class ForumService {
  static async getThreads(category?: ForumCategory, page: number = 1, limit: number = 20) {
    const offset = (Math.max(1, page) - 1) * limit;
    const effectiveLimit = Math.min(Math.max(1, limit), 100);

    let query;
    if (category) {
      query = sql`
        SELECT 
          ft.id,
          ft.user_id,
          ft.title,
          ft.body,
          ft.category,
          ft.is_locked,
          ft.is_pinned,
          ft.reply_count,
          ft.last_reply_at,
          ft.created_at,
          COALESCE(u.username, 'Commander') AS author_name
        FROM forum_threads ft
        LEFT JOIN users u ON u.id = ft.user_id
        WHERE ft.category = ${category}
        ORDER BY ft.is_pinned DESC, ft.last_reply_at DESC NULLS LAST, ft.created_at DESC
        LIMIT ${effectiveLimit} OFFSET ${offset}
      `;
    } else {
      query = sql`
        SELECT 
          ft.id,
          ft.user_id,
          ft.title,
          ft.body,
          ft.category,
          ft.is_locked,
          ft.is_pinned,
          ft.reply_count,
          ft.last_reply_at,
          ft.created_at,
          COALESCE(u.username, 'Commander') AS author_name
        FROM forum_threads ft
        LEFT JOIN users u ON u.id = ft.user_id
        ORDER BY ft.is_pinned DESC, ft.last_reply_at DESC NULLS LAST, ft.created_at DESC
        LIMIT ${effectiveLimit} OFFSET ${offset}
      `;
    }

    const result = await db.execute(query);

    let countQuery;
    if (category) {
      countQuery = sql`SELECT COUNT(*) AS total FROM forum_threads WHERE category = ${category}`;
    } else {
      countQuery = sql`SELECT COUNT(*) AS total FROM forum_threads`;
    }
    const countResult = await db.execute(countQuery);
    const total = Number((countResult.rows[0] as any).total);

    return {
      threads: result.rows,
      pagination: {
        page,
        limit: effectiveLimit,
        total,
        totalPages: Math.ceil(total / effectiveLimit),
      },
    };
  }

  static async getThread(threadId: string) {
    const threadResult = await db.execute(sql`
      SELECT 
        ft.*,
        COALESCE(u.username, 'Commander') AS author_name
      FROM forum_threads ft
      LEFT JOIN users u ON u.id = ft.user_id
      WHERE ft.id = ${threadId}
      LIMIT 1
    `);

    if (threadResult.rows.length === 0) {
      throw new Error('Thread not found');
    }

    const repliesResult = await db.execute(sql`
      SELECT 
        fr.id,
        fr.user_id,
        fr.body,
        fr.created_at,
        COALESCE(u.username, 'Commander') AS author_name
      FROM forum_replies fr
      LEFT JOIN users u ON u.id = fr.user_id
      WHERE fr.thread_id = ${threadId}
      ORDER BY fr.created_at ASC
    `);

    return {
      thread: threadResult.rows[0],
      replies: repliesResult.rows,
    };
  }

  static async createThread(userId: string, title: string, body: string, category: ForumCategory) {
    const validCategories: ForumCategory[] = ['general', 'strategy', 'bugs', 'suggestions', 'off-topic'];
    if (!validCategories.includes(category)) {
      throw new Error('Invalid category');
    }

    if (!title || title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    if (title.length > 200) {
      throw new Error('Title too long (max 200 characters)');
    }
    if (!body || body.trim().length === 0) {
      throw new Error('Body cannot be empty');
    }

    const result = await db.execute(sql`
      INSERT INTO forum_threads (user_id, title, body, category, is_locked, is_pinned, reply_count, created_at)
      VALUES (${userId}, ${title.trim()}, ${body.trim()}, ${category}, false, false, 0, NOW())
      RETURNING id
    `);

    return { threadId: (result.rows[0] as any).id };
  }

  static async replyToThread(userId: string, threadId: string, body: string) {
    const thread = await db.execute(sql`
      SELECT id, is_locked FROM forum_threads WHERE id = ${threadId} LIMIT 1
    `);
    if (thread.rows.length === 0) {
      throw new Error('Thread not found');
    }
    if ((thread.rows[0] as any).is_locked) {
      throw new Error('Thread is locked');
    }

    if (!body || body.trim().length === 0) {
      throw new Error('Reply body cannot be empty');
    }

    await db.execute(sql`
      INSERT INTO forum_replies (thread_id, user_id, body, created_at)
      VALUES (${threadId}, ${userId}, ${body.trim()}, NOW())
    `);

    await db.execute(sql`
      UPDATE forum_threads 
      SET reply_count = reply_count + 1, last_reply_at = NOW()
      WHERE id = ${threadId}
    `);

    return { success: true };
  }

  static async lockThread(threadId: string) {
    const result = await db.execute(sql`
      UPDATE forum_threads SET is_locked = true WHERE id = ${threadId} RETURNING id
    `);
    if (result.rows.length === 0) {
      throw new Error('Thread not found');
    }

    return { success: true };
  }

  static async pinThread(threadId: string) {
    const result = await db.execute(sql`
      UPDATE forum_threads SET is_pinned = true WHERE id = ${threadId} RETURNING id
    `);
    if (result.rows.length === 0) {
      throw new Error('Thread not found');
    }

    return { success: true };
  }
}

export default ForumService;
