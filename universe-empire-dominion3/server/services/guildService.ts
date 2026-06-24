import { db } from '../db';
import { sql, and } from 'drizzle-orm';
import { guilds, users } from '../../shared/schema';

export class GuildService {
  static async createGuild(userId: string, name: string) {
    const existing = await db.execute(sql`
      SELECT id FROM guilds WHERE name = ${name} LIMIT 1
    `);
    if (existing.rows.length > 0) {
      throw new Error('Guild name already exists');
    }

    const membership = await db.execute(sql`
      SELECT id FROM guild_members WHERE player_id = ${userId} LIMIT 1
    `);
    if (membership.rows.length > 0) {
      throw new Error('You are already in a guild');
    }

    const result = await db.execute(sql`
      INSERT INTO guilds (name, leader_id, total_members)
      VALUES (${name}, ${userId}, 1)
      RETURNING id
    `);
    const guildId = (result.rows[0] as any).id;

    await db.execute(sql`
      INSERT INTO guild_members (guild_id, player_id, role)
      VALUES (${guildId}, ${userId}, 'leader')
    `);

    return { guildId, name };
  }

  static async joinGuild(userId: string, guildId: string) {
    const guild = await db.execute(sql`
      SELECT id, max_members, total_members, is_recruiting FROM guilds WHERE id = ${guildId} LIMIT 1
    `);
    if (guild.rows.length === 0) {
      throw new Error('Guild not found');
    }

    const g = guild.rows[0] as any;
    if (!g.is_recruiting) {
      throw new Error('Guild is not recruiting');
    }
    if (g.total_members >= g.max_members) {
      throw new Error('Guild is full');
    }

    const existing = await db.execute(sql`
      SELECT id FROM guild_members WHERE player_id = ${userId} LIMIT 1
    `);
    if (existing.rows.length > 0) {
      throw new Error('You are already in a guild');
    }

    await db.execute(sql`
      INSERT INTO guild_members (guild_id, player_id, role)
      VALUES (${guildId}, ${userId}, 'member')
    `);

    await db.execute(sql`
      UPDATE guilds SET total_members = total_members + 1, updated_at = NOW()
      WHERE id = ${guildId}
    `);

    return { success: true };
  }

  static async leaveGuild(userId: string) {
    const membership = await db.execute(sql`
      SELECT id, guild_id, role FROM guild_members WHERE player_id = ${userId} LIMIT 1
    `);
    if (membership.rows.length === 0) {
      throw new Error('You are not in a guild');
    }

    const m = membership.rows[0] as any;
    if (m.role === 'leader') {
      throw new Error('Leaders cannot leave. Transfer leadership first.');
    }

    await db.execute(sql`DELETE FROM guild_members WHERE player_id = ${userId}`);
    await db.execute(sql`
      UPDATE guilds SET total_members = GREATEST(total_members - 1, 1), updated_at = NOW()
      WHERE id = ${m.guild_id}
    `);

    return { success: true };
  }

  static async getGuildMembers(guildId: string) {
    const result = await db.execute(sql`
      SELECT 
        gm.id,
        gm.player_id,
        gm.role,
        gm.joined_at,
        gm.contributed_currency,
        gm.contributed_research,
        COALESCE(u.username, 'Commander') AS display_name
      FROM guild_members gm
      LEFT JOIN users u ON u.id = gm.player_id
      WHERE gm.guild_id = ${guildId}
      ORDER BY 
        CASE gm.role 
          WHEN 'leader' THEN 1 
          WHEN 'officer' THEN 2 
          WHEN 'member' THEN 3 
        END ASC,
        gm.contributed_currency DESC
    `);

    return result.rows;
  }

  static async getGuildChat(guildId: string) {
    const result = await db.execute(sql`
      SELECT 
        gc.id,
        gc.player_id,
        gc.message,
        gc.sent_at,
        COALESCE(u.username, 'Commander') AS display_name
      FROM guild_chat gc
      LEFT JOIN users u ON u.id = gc.player_id
      WHERE gc.guild_id = ${guildId}
      ORDER BY gc.sent_at DESC
      LIMIT 50
    `);

    return result.rows.reverse();
  }

  static async sendGuildMessage(userId: string, guildId: string, message: string) {
    const membership = await db.execute(sql`
      SELECT id FROM guild_members WHERE player_id = ${userId} AND guild_id = ${guildId} LIMIT 1
    `);
    if (membership.rows.length === 0) {
      throw new Error('You are not a member of this guild');
    }

    if (!message || message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }
    if (message.length > 500) {
      throw new Error('Message too long (max 500 characters)');
    }

    await db.execute(sql`
      INSERT INTO guild_chat (guild_id, player_id, message, sent_at)
      VALUES (${guildId}, ${userId}, ${message.trim()}, NOW())
    `);

    return { success: true };
  }

  static async getGuildStats(guildId: string) {
    const guild = await db.execute(sql`
      SELECT * FROM guilds WHERE id = ${guildId} LIMIT 1
    `);
    if (guild.rows.length === 0) {
      throw new Error('Guild not found');
    }

    const g = guild.rows[0] as any;

    const memberStats = await db.execute(sql`
      SELECT 
        COUNT(*) AS member_count,
        COALESCE(SUM(gm.contributed_currency), 0) AS total_currency_contributed,
        COALESCE(SUM(gm.contributed_research), 0) AS total_research_contributed
      FROM guild_members gm
      WHERE gm.guild_id = ${guildId}
    `);

    const powerStats = await db.execute(sql`
      SELECT 
        COALESCE(SUM(
          (ps.resources->>'metal')::int + 
          (ps.resources->>'crystal')::int + 
          (ps.resources->>'deuterium')::int
        ), 0) AS total_resource_power
      FROM guild_members gm
      LEFT JOIN player_states ps ON ps.user_id = gm.player_id
      WHERE gm.guild_id = ${guildId}
    `);

    const chatActivity = await db.execute(sql`
      SELECT COUNT(*) AS message_count
      FROM guild_chat
      WHERE guild_id = ${guildId}
        AND sent_at > NOW() - INTERVAL '7 days'
    `);

    const ms = (memberStats.rows[0] as any);
    const ps = (powerStats.rows[0] as any);
    const ca = (chatActivity.rows[0] as any);

    return {
      guildId,
      name: g.name,
      level: g.level,
      totalMembers: g.total_members,
      maxMembers: g.max_members,
      treasury: g.treasury,
      influence: g.influence,
      isRecruiting: g.is_recruiting,
      totalCurrencyContributed: Number(ms.total_currency_contributed),
      totalResearchContributed: Number(ms.total_research_contributed),
      totalResourcePower: Number(ps.total_resource_power),
      weeklyMessageCount: Number(ca.message_count),
      createdAt: g.created_at,
    };
  }
}

export default GuildService;
