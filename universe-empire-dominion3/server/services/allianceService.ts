import { db } from '../db';
import { sql, and, desc } from 'drizzle-orm';
import { alliances, users } from '../../shared/schema';

const ALLIANCE_MEMBER_LIMIT = 150;

export class AllianceService {
  static async createAlliance(userId: string, name: string, tag: string) {
    const existing = await db.execute(sql`
      SELECT id FROM alliances WHERE name = ${name} OR tag = ${tag} LIMIT 1
    `);
    if (existing.rows.length > 0) {
      throw new Error('Alliance name or tag already exists');
    }

    const membership = await db.execute(sql`
      SELECT id FROM alliance_members WHERE user_id = ${userId} LIMIT 1
    `);
    if (membership.rows.length > 0) {
      throw new Error('You are already in an alliance');
    }

    const profile = await db.execute(sql`
      SELECT COALESCE(username, 'Commander') AS display_name FROM users WHERE id = ${userId} LIMIT 1
    `);
    const displayName = (profile.rows[0] as any)?.display_name ?? 'Commander';

    const result = await db.execute(sql`
      INSERT INTO alliances (name, tag, description) 
      VALUES (${name}, ${tag}, 'Founded by ${displayName}')
      RETURNING id
    `);
    const allianceId = (result.rows[0] as any).id;

    await db.execute(sql`
      INSERT INTO alliance_members (alliance_id, user_id, rank, points)
      VALUES (${allianceId}, ${userId}, 'leader', 0)
    `);

    return { allianceId, name, tag };
  }

  static async joinAlliance(userId: string, allianceId: string) {
    const alliance = await db.execute(sql`
      SELECT id FROM alliances WHERE id = ${allianceId} LIMIT 1
    `);
    if (alliance.rows.length === 0) {
      throw new Error('Alliance not found');
    }

    const existing = await db.execute(sql`
      SELECT id FROM alliance_members WHERE user_id = ${userId} LIMIT 1
    `);
    if (existing.rows.length > 0) {
      throw new Error('You are already in an alliance');
    }

    const memberCount = await db.execute(sql`
      SELECT COUNT(*) AS cnt FROM alliance_members WHERE alliance_id = ${allianceId}
    `);
    if (Number((memberCount.rows[0] as any).cnt) >= ALLIANCE_MEMBER_LIMIT) {
      throw new Error('Alliance is full');
    }

    await db.execute(sql`
      INSERT INTO alliance_members (alliance_id, user_id, rank, points)
      VALUES (${allianceId}, ${userId}, 'member', 0)
    `);

    return { success: true };
  }

  static async leaveAlliance(userId: string) {
    const membership = await db.execute(sql`
      SELECT id, rank FROM alliance_members WHERE user_id = ${userId} LIMIT 1
    `);
    if (membership.rows.length === 0) {
      throw new Error('You are not in an alliance');
    }
    if ((membership.rows[0] as any).rank === 'leader') {
      throw new Error('Leaders cannot leave. Disband or transfer leadership first.');
    }

    await db.execute(sql`DELETE FROM alliance_members WHERE user_id = ${userId}`);
    return { success: true };
  }

  static async disbandAlliance(userId: string) {
    const membership = await db.execute(sql`
      SELECT alliance_id, rank FROM alliance_members WHERE user_id = ${userId} LIMIT 1
    `);
    if (membership.rows.length === 0) {
      throw new Error('You are not in an alliance');
    }
    if ((membership.rows[0] as any).rank !== 'leader') {
      throw new Error('Only the leader can disband the alliance');
    }

    const allianceId = (membership.rows[0] as any).alliance_id;
    await db.execute(sql`DELETE FROM alliance_members WHERE alliance_id = ${allianceId}`);
    await db.execute(sql`DELETE FROM alliances WHERE id = ${allianceId}`);

    return { success: true };
  }

  static async getAllianceMembers(allianceId: string) {
    const result = await db.execute(sql`
      SELECT 
        am.id,
        am.user_id,
        am.rank,
        am.points,
        am.joined_at,
        COALESCE(u.username, 'Commander') AS display_name
      FROM alliance_members am
      LEFT JOIN users u ON u.id = am.user_id
      WHERE am.alliance_id = ${allianceId}
      ORDER BY 
        CASE am.rank 
          WHEN 'leader' THEN 1 
          WHEN 'officer' THEN 2 
          WHEN 'member' THEN 3 
          WHEN 'recruit' THEN 4 
        END ASC,
        am.points DESC
    `);

    return result.rows;
  }

  static async updateMemberRank(allianceId: string, userId: string, newRank: string) {
    const validRanks = ['leader', 'officer', 'member', 'recruit'];
    if (!validRanks.includes(newRank)) {
      throw new Error('Invalid rank');
    }

    const membership = await db.execute(sql`
      SELECT rank FROM alliance_members WHERE user_id = ${userId} AND alliance_id = ${allianceId} LIMIT 1
    `);
    if (membership.rows.length === 0) {
      throw new Error('User not in this alliance');
    }

    await db.execute(sql`
      UPDATE alliance_members 
      SET rank = ${newRank} 
      WHERE user_id = ${userId} AND alliance_id = ${allianceId}
    `);

    return { success: true, rank: newRank };
  }

  static async getDiplomacyRelations(allianceId: string) {
    const result = await db.execute(sql`
      SELECT 
        ad.*,
        a.name AS target_alliance_name,
        a.tag AS target_alliance_tag
      FROM alliance_diplomacy ad
      JOIN alliances a ON a.id = ad.target_alliance_id
      WHERE ad.alliance_id = ${allianceId}
      ORDER BY ad.updated_at DESC
    `);

    return result.rows;
  }

  static async updateDiplomacy(allianceId: string, targetAllianceId: string, relation: string) {
    const validRelations = ['friendly', 'neutral', 'hostile', 'war'];
    if (!validRelations.includes(relation)) {
      throw new Error('Invalid relation type');
    }
    if (allianceId === targetAllianceId) {
      throw new Error('Cannot set diplomacy with yourself');
    }

    await db.execute(sql`
      INSERT INTO alliance_diplomacy (alliance_id, target_alliance_id, relation, updated_at)
      VALUES (${allianceId}, ${targetAllianceId}, ${relation}, NOW())
      ON CONFLICT (alliance_id, target_alliance_id) 
      DO UPDATE SET relation = ${relation}, updated_at = NOW()
    `);

    return { success: true, relation };
  }

  static async declareWar(allianceId: string, targetAllianceId: string) {
    if (allianceId === targetAllianceId) {
      throw new Error('Cannot declare war on yourself');
    }

    const target = await db.execute(sql`
      SELECT id FROM alliances WHERE id = ${targetAllianceId} LIMIT 1
    `);
    if (target.rows.length === 0) {
      throw new Error('Target alliance not found');
    }

    await db.execute(sql`
      INSERT INTO alliance_wars (alliance_id, target_alliance_id, declared_at, status)
      VALUES (${allianceId}, ${targetAllianceId}, NOW(), 'active')
      ON CONFLICT DO NOTHING
    `);

    await this.updateDiplomacy(allianceId, targetAllianceId, 'war');
    await this.updateDiplomacy(targetAllianceId, allianceId, 'war');

    return { success: true };
  }

  static async getWarList(allianceId: string) {
    const result = await db.execute(sql`
      SELECT 
        aw.*,
        a.name AS target_alliance_name,
        a.tag AS target_alliance_tag
      FROM alliance_wars aw
      JOIN alliances a ON a.id = aw.target_alliance_id
      WHERE (aw.alliance_id = ${allianceId} OR aw.target_alliance_id = ${allianceId})
        AND aw.status = 'active'
      ORDER BY aw.declared_at DESC
    `);

    return result.rows;
  }

  static async calculateAllianceBonuses(allianceId: string) {
    const members = await db.execute(sql`
      SELECT am.user_id, am.rank, ps.resources, ps.research, ps.buildings, ps.units
      FROM alliance_members am
      LEFT JOIN player_states ps ON ps.user_id = am.user_id
      WHERE am.alliance_id = ${allianceId}
    `);

    const memberCount = members.rows.length;
    if (memberCount === 0) {
      return { resourceBonus: 0, combatBonus: 0, researchBonus: 0, memberCount: 0 };
    }

    let totalPower = 0;
    let totalResearch = 0;

    for (const member of members.rows) {
      const resources = (member as any).resources as any;
      const units = (member as any).units as any;
      const research = (member as any).research as any;

      if (resources) {
        totalPower += (resources.metal ?? 0) + (resources.crystal ?? 0) + (resources.deuterium ?? 0);
      }
      if (units && typeof units === 'object') {
        for (const val of Object.values(units)) {
          totalPower += (val as number) * 10;
        }
      }
      if (research && typeof research === 'object') {
        for (const val of Object.values(research)) {
          totalResearch += val as number;
        }
      }
    }

    const resourceBonus = Math.floor(memberCount * 2.5);
    const combatBonus = Math.floor(memberCount * 1.5);
    const researchBonus = Math.floor(totalResearch * 0.05);

    return {
      resourceBonus,
      combatBonus,
      researchBonus,
      memberCount,
      totalPower,
      totalResearch,
    };
  }

  static async getCooperativeResearch(allianceId: string) {
    const result = await db.execute(sql`
      SELECT 
        acr.*,
        u.username AS researcher_name
      FROM alliance_cooperative_research acr
      LEFT JOIN users u ON u.id = acr.user_id
      WHERE acr.alliance_id = ${allianceId}
      ORDER BY acr.joined_at ASC
    `);

    return result.rows;
  }

  static async joinResearchProject(allianceId: string, userId: string, projectId: string) {
    const membership = await db.execute(sql`
      SELECT id FROM alliance_members WHERE user_id = ${userId} AND alliance_id = ${allianceId} LIMIT 1
    `);
    if (membership.rows.length === 0) {
      throw new Error('You are not a member of this alliance');
    }

    const existing = await db.execute(sql`
      SELECT id FROM alliance_cooperative_research 
      WHERE alliance_id = ${allianceId} AND user_id = ${userId} AND project_id = ${projectId}
      LIMIT 1
    `);
    if (existing.rows.length > 0) {
      throw new Error('Already participating in this project');
    }

    await db.execute(sql`
      INSERT INTO alliance_cooperative_research (alliance_id, user_id, project_id, joined_at)
      VALUES (${allianceId}, ${userId}, ${projectId}, NOW())
    `);

    return { success: true };
  }
}

export default AllianceService;
