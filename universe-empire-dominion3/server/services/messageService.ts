import { db } from '../db';
import { sql } from 'drizzle-orm';
import { messages } from '../../shared/schema';

export type MessageType = 'standard' | 'trade_offer' | 'battle_report' | 'espionage_report' | 'system';
type MessageFolder = 'inbox' | 'sent' | 'archived';

const ensureArchiveColumn = async () => {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;
    EXCEPTION WHEN duplicate_column THEN null;
    END $$;
  `);
};

export class MessageService {
  static async sendMessage(
    fromUserId: string,
    toUserId: string,
    subject: string,
    body: string,
    type: MessageType = 'standard'
  ) {
    if (fromUserId === toUserId) {
      throw new Error('Cannot send messages to yourself');
    }

    const recipient = await db.execute(sql`
      SELECT id FROM users WHERE id = ${toUserId} LIMIT 1
    `);
    if (recipient.rows.length === 0) {
      throw new Error('Recipient not found');
    }

    if (!subject || subject.trim().length === 0) {
      throw new Error('Subject cannot be empty');
    }
    if (!body || body.trim().length === 0) {
      throw new Error('Message body cannot be empty');
    }

    const senderProfile = await db.execute(sql`
      SELECT COALESCE(username, 'Commander') AS display_name FROM users WHERE id = ${fromUserId} LIMIT 1
    `);
    const senderName = (senderProfile.rows[0] as any)?.display_name ?? 'Commander';

    const recipientProfile = await db.execute(sql`
      SELECT COALESCE(username, 'Commander') AS display_name FROM users WHERE id = ${toUserId} LIMIT 1
    `);
    const recipientName = (recipientProfile.rows[0] as any)?.display_name ?? 'Commander';

    const result = await db.execute(sql`
      INSERT INTO messages (from_user_id, to_user_id, "from", "to", subject, body, type, "read", timestamp)
      VALUES (${fromUserId}, ${toUserId}, ${senderName}, ${recipientName}, ${subject.trim()}, ${body.trim()}, ${type}, false, NOW())
      RETURNING id
    `);

    return { messageId: (result.rows[0] as any).id };
  }

  static async getMessages(userId: string, folder: MessageFolder = 'inbox', page: number = 1, limit: number = 50) {
    await ensureArchiveColumn();
    const offset = (Math.max(1, page) - 1) * limit;

    let query;
    if (folder === 'inbox') {
      query = sql`
        SELECT * FROM messages
        WHERE to_user_id = ${userId}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (folder === 'sent') {
      query = sql`
        SELECT * FROM messages
        WHERE from_user_id = ${userId}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      query = sql`
        SELECT * FROM messages
        WHERE (to_user_id = ${userId} OR from_user_id = ${userId})
          AND "archived" = true
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const result = await db.execute(query);
    return result.rows;
  }

  static async getMessage(userId: string, messageId: string) {
    const result = await db.execute(sql`
      SELECT * FROM messages
      WHERE id = ${messageId}
        AND (to_user_id = ${userId} OR from_user_id = ${userId})
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      throw new Error('Message not found');
    }

    return result.rows[0];
  }

  static async markAsRead(userId: string, messageId: string) {
    const result = await db.execute(sql`
      UPDATE messages 
      SET "read" = true 
      WHERE id = ${messageId} AND to_user_id = ${userId}
      RETURNING id
    `);

    if (result.rows.length === 0) {
      throw new Error('Message not found');
    }

    return { success: true };
  }

  static async deleteMessage(userId: string, messageId: string) {
    await ensureArchiveColumn();
    const message = await db.execute(sql`
      SELECT id, from_user_id, to_user_id FROM messages 
      WHERE id = ${messageId}
        AND (to_user_id = ${userId} OR from_user_id = ${userId})
      LIMIT 1
    `);

    if (message.rows.length === 0) {
      throw new Error('Message not found');
    }

    const msg = message.rows[0] as any;
    if (msg.to_user_id === userId && msg.from_user_id === userId) {
      await db.execute(sql`DELETE FROM messages WHERE id = ${messageId}`);
    } else if (msg.to_user_id === userId) {
      await db.execute(sql`UPDATE messages SET archived = true WHERE id = ${messageId}`);
    } else {
      await db.execute(sql`DELETE FROM messages WHERE id = ${messageId} AND from_user_id = ${userId}`);
    }

    return { success: true };
  }

  static async getUnreadCount(userId: string) {
    const result = await db.execute(sql`
      SELECT COUNT(*) AS count FROM messages
      WHERE to_user_id = ${userId} AND "read" = false
    `);

    return Number((result.rows[0] as any).count);
  }
}

export default MessageService;
