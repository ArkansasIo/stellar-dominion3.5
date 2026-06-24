import { db } from '../db';
import { sql, eq, and } from 'drizzle-orm';
import { friends, users } from '../../shared/schema';

const MAX_FRIENDS = 50;

export class FriendService {
  static async getFriends(userId: string) {
    const result = await db.execute(sql`
      SELECT 
        f.id,
        f.friend_id,
        f.nickname,
        f.notes,
        f.is_online,
        f.last_seen,
        f.is_favorite,
        f.added_at,
        COALESCE(u.username, 'Commander') AS display_name,
        pp.level,
        pp.fleet_power
      FROM friends f
      LEFT JOIN users u ON u.id = f.friend_id
      LEFT JOIN player_profiles pp ON pp.user_id = f.friend_id
      WHERE f.player_id = ${userId} 
        AND f.friendship_status = 'accepted'
      ORDER BY f.is_favorite DESC, f.last_seen DESC
      LIMIT ${MAX_FRIENDS}
    `);

    return result.rows;
  }

  static async sendFriendRequest(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new Error('Cannot send friend request to yourself');
    }

    const target = await db.execute(sql`
      SELECT id FROM users WHERE id = ${targetId} LIMIT 1
    `);
    if (target.rows.length === 0) {
      throw new Error('User not found');
    }

    const alreadyFriends = await db.execute(sql`
      SELECT id FROM friends 
      WHERE player_id = ${userId} AND friend_id = ${targetId} 
        AND friendship_status = 'accepted'
      LIMIT 1
    `);
    if (alreadyFriends.rows.length > 0) {
      throw new Error('Already friends');
    }

    const existingRequest = await db.execute(sql`
      SELECT id FROM friend_requests 
      WHERE ((sender_id = ${userId} AND receiver_id = ${targetId}) 
        OR (sender_id = ${targetId} AND receiver_id = ${userId}))
        AND status = 'pending'
      LIMIT 1
    `);
    if (existingRequest.rows.length > 0) {
      throw new Error('Friend request already pending');
    }

    const friendCount = await db.execute(sql`
      SELECT COUNT(*) AS cnt FROM friends 
      WHERE player_id = ${userId} AND friendship_status = 'accepted'
    `);
    if (Number((friendCount.rows[0] as any).cnt) >= MAX_FRIENDS) {
      throw new Error('Friend list is full (max 50)');
    }

    const targetCount = await db.execute(sql`
      SELECT COUNT(*) AS cnt FROM friends 
      WHERE player_id = ${targetId} AND friendship_status = 'accepted'
    `);
    if (Number((targetCount.rows[0] as any).cnt) >= MAX_FRIENDS) {
      throw new Error('Target player friend list is full');
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await db.execute(sql`
      INSERT INTO friend_requests (sender_id, receiver_id, status, sent_at, expires_at)
      VALUES (${userId}, ${targetId}, 'pending', NOW(), ${expiresAt})
    `);

    return { success: true };
  }

  static async acceptFriendRequest(userId: string, requestId: string) {
    const request = await db.execute(sql`
      SELECT id, sender_id, receiver_id FROM friend_requests 
      WHERE id = ${requestId} AND receiver_id = ${userId} AND status = 'pending'
      LIMIT 1
    `);
    if (request.rows.length === 0) {
      throw new Error('Friend request not found or already processed');
    }

    const r = request.rows[0] as any;

    await db.execute(sql`
      UPDATE friend_requests SET status = 'accepted', responded_at = NOW()
      WHERE id = ${requestId}
    `);

    const exists = await db.execute(sql`
      SELECT id FROM friends WHERE player_id = ${userId} AND friend_id = ${r.sender_id} LIMIT 1
    `);

    if (exists.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO friends (player_id, friend_id, friendship_status, added_at, accepted_at)
        VALUES (${userId}, ${r.sender_id}, 'accepted', NOW(), NOW())
      `);
    } else {
      await db.execute(sql`
        UPDATE friends SET friendship_status = 'accepted', accepted_at = NOW()
        WHERE player_id = ${userId} AND friend_id = ${r.sender_id}
      `);
    }

    const reverseExists = await db.execute(sql`
      SELECT id FROM friends WHERE player_id = ${r.sender_id} AND friend_id = ${userId} LIMIT 1
    `);

    if (reverseExists.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO friends (player_id, friend_id, friendship_status, added_at, accepted_at)
        VALUES (${r.sender_id}, ${userId}, 'accepted', NOW(), NOW())
      `);
    } else {
      await db.execute(sql`
        UPDATE friends SET friendship_status = 'accepted', accepted_at = NOW()
        WHERE player_id = ${r.sender_id} AND friend_id = ${userId}
      `);
    }

    return { success: true };
  }

  static async rejectFriendRequest(userId: string, requestId: string) {
    const request = await db.execute(sql`
      SELECT id FROM friend_requests 
      WHERE id = ${requestId} AND receiver_id = ${userId} AND status = 'pending'
      LIMIT 1
    `);
    if (request.rows.length === 0) {
      throw new Error('Friend request not found or already processed');
    }

    await db.execute(sql`
      UPDATE friend_requests SET status = 'rejected', responded_at = NOW()
      WHERE id = ${requestId}
    `);

    return { success: true };
  }

  static async removeFriend(userId: string, friendId: string) {
    const friendship = await db.execute(sql`
      SELECT id FROM friends 
      WHERE player_id = ${userId} AND friend_id = ${friendId} AND friendship_status = 'accepted'
      LIMIT 1
    `);
    if (friendship.rows.length === 0) {
      throw new Error('Friend not found');
    }

    await db.execute(sql`
      DELETE FROM friends 
      WHERE (player_id = ${userId} AND friend_id = ${friendId})
         OR (player_id = ${friendId} AND friend_id = ${userId})
    `);

    return { success: true };
  }

  static async getOnlineFriends(userId: string) {
    const result = await db.execute(sql`
      SELECT 
        f.friend_id,
        f.is_online,
        f.last_seen,
        COALESCE(u.username, 'Commander') AS display_name,
        pp.level,
        pp.is_online AS profile_online
      FROM friends f
      LEFT JOIN users u ON u.id = f.friend_id
      LEFT JOIN player_profiles pp ON pp.user_id = f.friend_id
      WHERE f.player_id = ${userId} 
        AND f.friendship_status = 'accepted'
        AND (f.is_online = true OR pp.is_online = true)
      ORDER BY f.last_seen DESC
    `);

    return result.rows;
  }

  static async blockUser(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new Error('Cannot block yourself');
    }

    await db.execute(sql`
      DELETE FROM friends 
      WHERE (player_id = ${userId} AND friend_id = ${targetId})
         OR (player_id = ${targetId} AND friend_id = ${userId})
    `);

    await db.execute(sql`
      DELETE FROM friend_requests 
      WHERE (sender_id = ${userId} AND receiver_id = ${targetId})
         OR (sender_id = ${targetId} AND receiver_id = ${userId})
    `);

    const exists = await db.execute(sql`
      SELECT id FROM friends WHERE player_id = ${userId} AND friend_id = ${targetId} LIMIT 1
    `);

    if (exists.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO friends (player_id, friend_id, friendship_status)
        VALUES (${userId}, ${targetId}, 'blocked')
      `);
    } else {
      await db.execute(sql`
        UPDATE friends SET friendship_status = 'blocked'
        WHERE player_id = ${userId} AND friend_id = ${targetId}
      `);
    }

    return { success: true };
  }

  static async getFriendRequests(userId: string) {
    const result = await db.execute(sql`
      SELECT 
        fr.id,
        fr.sender_id,
        fr.message,
        fr.status,
        fr.sent_at,
        COALESCE(u.username, 'Commander') AS sender_name,
        pp.level AS sender_level
      FROM friend_requests fr
      LEFT JOIN users u ON u.id = fr.sender_id
      LEFT JOIN player_profiles pp ON pp.user_id = fr.sender_id
      WHERE fr.receiver_id = ${userId} AND fr.status = 'pending'
      ORDER BY fr.sent_at DESC
    `);

    return result.rows;
  }
}

export default FriendService;
