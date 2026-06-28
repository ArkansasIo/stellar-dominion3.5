import { db } from '../db';
import { sql } from 'drizzle-orm';

type NotificationType = 'battle' | 'espionage' | 'trade' | 'diplomacy' | 'alliance' | 'system' | 'research' | 'construction' | 'fleet';

interface Notification {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read?: boolean;
  createdAt?: string;
}

export class NotificationService {
  static async send(notification: Notification) {
    const result = await db.execute(sql`
      INSERT INTO notifications (user_id, type, title, message, data)
      VALUES (${notification.userId}, ${notification.type}, ${notification.title}, ${notification.message}, ${JSON.stringify(notification.data || {})}::jsonb)
      RETURNING id, created_at
    `);
    return result.rows[0];
  }

  static async sendToMany(userIds: string[], notification: Omit<Notification, 'userId'>) {
    for (const userId of userIds) {
      await this.send({ ...notification, userId });
    }
  }

  static async sendToAlliance(allianceId: string, notification: Omit<Notification, 'userId'>) {
    const members = await db.execute(sql`
      SELECT user_id FROM alliance_members WHERE alliance_id = ${allianceId}
    `);
    const userIds = members.rows.map((r: any) => r.user_id);
    await this.sendToMany(userIds, notification);
  }

  static async getNotifications(userId: string, limit = 50, offset = 0) {
    const result = await db.execute(sql`
      SELECT * FROM notifications WHERE user_id = ${userId}
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
    `);
    return result.rows;
  }

  static async getUnreadCount(userId: string) {
    const result = await db.execute(sql`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ${userId} AND read = false
    `);
    return parseInt((result.rows[0] as any)?.count || '0');
  }

  static async markAsRead(notificationId: string, userId: string) {
    await db.execute(sql`
      UPDATE notifications SET read = true WHERE id = ${notificationId} AND user_id = ${userId}
    `);
  }

  static async markAllAsRead(userId: string) {
    await db.execute(sql`
      UPDATE notifications SET read = true WHERE user_id = ${userId}
    `);
  }

  static async deleteOldNotifications(daysOld = 30) {
    await db.execute(sql`
      DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '${daysOld} days'
    `);
  }

  static async sendBattleReport(userId: string, reportId: string, won: boolean) {
    await this.send({
      userId,
      type: 'battle',
      title: won ? 'Victory' : 'Defeat',
      message: won ? 'Your fleet emerged victorious in battle' : 'Your fleet was defeated in battle',
      data: { reportId, won },
    });
  }

  static async sendEspionageReport(userId: string, targetName: string, success: boolean) {
    await this.send({
      userId,
      type: 'espionage',
      title: success ? 'Espionage Success' : 'Espionage Failed',
      message: success ? `Espionage mission against ${targetName} completed successfully` : `Espionage mission against ${targetName} was detected`,
    });
  }

  static async sendDiplomaticMessage(userId: string, fromEmpire: string, action: string) {
    await this.send({
      userId,
      type: 'diplomacy',
      title: 'Diplomatic Message',
      message: `${fromEmpire} has ${action} with your empire`,
      data: { fromEmpire, action },
    });
  }

  static async sendSystemNotification(userId: string, title: string, message: string) {
    await this.send({
      userId,
      type: 'system',
      title,
      message,
    });
  }
}
