import { db } from '../db';
import { sql } from 'drizzle-orm';

type ChatChannel = 'global' | 'alliance' | 'guild' | 'private' | 'system' | 'trade';

interface ChatMessage {
  id?: string;
  channel: ChatChannel;
  channelId?: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt?: string;
}

export class ChatService {
  static async sendMessage(msg: ChatMessage) {
    const result = await db.execute(sql`
      INSERT INTO chat_messages (channel, channel_id, sender_id, sender_name, message)
      VALUES (${msg.channel}, ${msg.channelId || null}, ${msg.senderId}, ${msg.senderName}, ${msg.message})
      RETURNING id, created_at
    `);
    return result.rows[0];
  }

  static async getMessages(channel: ChatChannel, channelId?: string, limit = 50, before?: string) {
    let query;
    if (before) {
      query = sql`
        SELECT * FROM chat_messages 
        WHERE channel = ${channel} 
        ${channelId ? sql`AND channel_id = ${channelId}` : sql``}
        AND created_at < ${before}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
    } else {
      query = sql`
        SELECT * FROM chat_messages 
        WHERE channel = ${channel} 
        ${channelId ? sql`AND channel_id = ${channelId}` : sql``}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
    }
    const result = await db.execute(query);
    return result.rows.reverse();
  }

  static async getRecentGlobalMessages(limit = 30) {
    return this.getMessages('global', undefined, limit);
  }

  static async getAllianceMessages(allianceId: string, limit = 50) {
    return this.getMessages('alliance', allianceId, limit);
  }

  static async getPrivateMessages(userId1: string, userId2: string, limit = 50) {
    const channelId = [userId1, userId2].sort().join(':');
    return this.getMessages('private', channelId, limit);
  }

  static async deleteMessage(messageId: string) {
    await db.execute(sql`
      DELETE FROM chat_messages WHERE id = ${messageId}
    `);
  }

  static async getOnlineUsers(channel: ChatChannel, channelId?: string) {
    const result = await db.execute(sql`
      SELECT DISTINCT sender_id, sender_name FROM chat_messages
      WHERE channel = ${channel}
      ${channelId ? sql`AND channel_id = ${channelId}` : sql``}
      AND created_at > NOW() - INTERVAL '5 minutes'
      ORDER BY sender_name
    `);
    return result.rows;
  }

  static async sendSystemAnnouncement(message: string, channel: ChatChannel = 'global', channelId?: string) {
    await this.sendMessage({
      channel,
      channelId,
      senderId: 'system',
      senderName: 'System',
      message,
    });
  }
}
