/**
 * Multiplayer Research Bonuses Service
 * Persistent alliance and cooperative bonus implementation.
 */

import { db } from "../db";
import { sql } from "drizzle-orm";

export class MultiplayerBonusesService {
  private static tablesReady = false;

  private static async ensureTables() {
    if (this.tablesReady) return;

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_alliances (
        id varchar PRIMARY KEY,
        name varchar NOT NULL,
        faction varchar NOT NULL,
        leader_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at timestamp NOT NULL DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_alliance_members (
        alliance_id varchar NOT NULL REFERENCES research_alliances(id) ON DELETE CASCADE,
        user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role varchar NOT NULL DEFAULT 'member',
        joined_at timestamp NOT NULL DEFAULT now(),
        PRIMARY KEY (alliance_id, user_id)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_alliance_pools (
        alliance_id varchar PRIMARY KEY REFERENCES research_alliances(id) ON DELETE CASCADE,
        metals bigint NOT NULL DEFAULT 0,
        credits bigint NOT NULL DEFAULT 0,
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `);

    this.tablesReady = true;
  }

  private static async getPlayerAllianceRow(userId: string) {
    await this.ensureTables();

    const rows = await db.execute(sql`
      SELECT ra.*, ram.role
      FROM research_alliance_members ram
      JOIN research_alliances ra ON ra.id = ram.alliance_id
      WHERE ram.user_id = ${userId}
      LIMIT 1
    `);

    return rows.rows[0] as any;
  }

  static async createAlliance(leaderId: string, name: string, faction: string) {
    await this.ensureTables();

    const existingAlliance = await this.getPlayerAllianceRow(leaderId);
    if (existingAlliance) {
      throw new Error("Player already belongs to an alliance");
    }

    const id = `alliance_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    await db.execute(sql`
      INSERT INTO research_alliances (id, name, faction, leader_id)
      VALUES (${id}, ${name}, ${faction}, ${leaderId})
    `);

    await db.execute(sql`
      INSERT INTO research_alliance_members (alliance_id, user_id, role)
      VALUES (${id}, ${leaderId}, 'leader')
    `);

    await db.execute(sql`
      INSERT INTO research_alliance_pools (alliance_id, metals, credits)
      VALUES (${id}, 0, 0)
      ON CONFLICT (alliance_id) DO NOTHING
    `);

    return { id, name, leader: leaderId, faction, members: [{ userId: leaderId, role: "leader" }] };
  }

  static async joinAlliance(userId: string, allianceId: string) {
    await this.ensureTables();

    const existingAlliance = await this.getPlayerAllianceRow(userId);
    if (existingAlliance) {
      throw new Error("Player already belongs to an alliance");
    }

    const allianceRows = await db.execute(sql`
      SELECT id FROM research_alliances WHERE id = ${allianceId} LIMIT 1
    `);

    if (!allianceRows.rows.length) {
      throw new Error("Alliance not found");
    }

    await db.execute(sql`
      INSERT INTO research_alliance_members (alliance_id, user_id, role)
      VALUES (${allianceId}, ${userId}, 'member')
      ON CONFLICT (alliance_id, user_id) DO NOTHING
    `);

    await db.execute(sql`
      INSERT INTO research_alliance_pools (alliance_id, metals, credits)
      VALUES (${allianceId}, 0, 0)
      ON CONFLICT (alliance_id) DO NOTHING
    `);

    return true;
  }

  static async getPlayerAllianceBonuses(userId: string) {
    await this.ensureTables();

    const alliance = await this.getPlayerAllianceRow(userId);
    if (!alliance) {
      return {
        hasAlliance: false,
        bonuses: { researchSpeed: 1.0, discoveryChance: 0, xpMultiplier: 1.0, costReduction: 0 },
      };
    }

    const membersCountRows = await db.execute(sql`
      SELECT COUNT(*)::int AS member_count
      FROM research_alliance_members
      WHERE alliance_id = ${alliance.id}
    `);
    const memberCount = Number(membersCountRows.rows[0]?.member_count ?? 1);

    const poolRows = await db.execute(sql`
      SELECT metals, credits
      FROM research_alliance_pools
      WHERE alliance_id = ${alliance.id}
      LIMIT 1
    `);

    const metals = Number(poolRows.rows[0]?.metals ?? 0);
    const credits = Number(poolRows.rows[0]?.credits ?? 0);

    const researchSpeed = 1 + Math.min(0.35, (memberCount - 1) * 0.03) + (metals >= 100000 ? 0.05 : 0);
    const discoveryChance = Math.min(0.4, memberCount * 0.02 + (credits >= 100000 ? 0.05 : 0));
    const xpMultiplier = 1 + Math.min(0.25, (memberCount - 1) * 0.02);
    const costReduction = Math.min(0.25, (metals + credits) / 5000000);

    return {
      hasAlliance: true,
      allianceId: alliance.id,
      allianceName: alliance.name,
      faction: alliance.faction,
      bonuses: {
        researchSpeed,
        discoveryChance,
        xpMultiplier,
        costReduction,
      },
    };
  }

  static calculateCoopResearchBonus(participantCount: number) {
    const safeCount = Math.max(1, participantCount);
    return {
      speedMultiplier: 1 + Math.min(0.5, (safeCount - 1) * 0.08),
      sharedXpPercent: Math.min(0.7, 0.3 + (safeCount - 1) * 0.05),
    };
  }

  static async getAllianceMemberBonuses(allianceId: string) {
    await this.ensureTables();

    const members = await db.execute(sql`
      SELECT
        ram.user_id,
        ram.role,
        COALESCE(u.username, ram.user_id) AS username
      FROM research_alliance_members ram
      LEFT JOIN users u ON u.id = ram.user_id
      WHERE ram.alliance_id = ${allianceId}
      ORDER BY ram.joined_at ASC
    `);

    const coop = this.calculateCoopResearchBonus(members.rows.length);

    return {
      allianceId,
      members: members.rows.map((row: any) => ({
        userId: String(row.user_id),
        username: String(row.username),
        role: String(row.role),
        bonuses: {
          researchSpeed: coop.speedMultiplier,
          sharedXpPercent: coop.sharedXpPercent,
        },
      })),
      bonuses: {
        speedMultiplier: coop.speedMultiplier,
        sharedXpPercent: coop.sharedXpPercent,
      },
    };
  }

  static async contributeToPool(
    userId: string,
    allianceId: string,
    metals: number,
    credits: number
  ) {
    await this.ensureTables();

    const membership = await db.execute(sql`
      SELECT 1 FROM research_alliance_members
      WHERE alliance_id = ${allianceId} AND user_id = ${userId}
      LIMIT 1
    `);

    if (!membership.rows.length) {
      throw new Error("Player is not a member of this alliance");
    }

    await db.execute(sql`
      INSERT INTO research_alliance_pools (alliance_id, metals, credits)
      VALUES (${allianceId}, ${Math.max(0, Number(metals))}, ${Math.max(0, Number(credits))})
      ON CONFLICT (alliance_id)
      DO UPDATE SET
        metals = research_alliance_pools.metals + ${Math.max(0, Number(metals))},
        credits = research_alliance_pools.credits + ${Math.max(0, Number(credits))},
        updated_at = now()
    `);

    return true;
  }

  static async withdrawFromPool(
    userId: string,
    allianceId: string,
    metals: number,
    credits: number
  ) {
    await this.ensureTables();

    const membershipRows = await db.execute(sql`
      SELECT role FROM research_alliance_members
      WHERE alliance_id = ${allianceId} AND user_id = ${userId}
      LIMIT 1
    `);

    if (!membershipRows.rows.length) {
      throw new Error("Player is not a member of this alliance");
    }

    const role = String(membershipRows.rows[0].role);
    if (role !== "leader") {
      throw new Error("Only alliance leader can withdraw resources");
    }

    const poolRows = await db.execute(sql`
      SELECT metals, credits FROM research_alliance_pools WHERE alliance_id = ${allianceId} LIMIT 1
    `);

    const currentMetals = Number(poolRows.rows[0]?.metals ?? 0);
    const currentCredits = Number(poolRows.rows[0]?.credits ?? 0);

    const safeMetals = Math.max(0, Number(metals));
    const safeCredits = Math.max(0, Number(credits));

    if (currentMetals < safeMetals || currentCredits < safeCredits) {
      throw new Error("Insufficient alliance pool balance");
    }

    await db.execute(sql`
      UPDATE research_alliance_pools
      SET metals = metals - ${safeMetals},
          credits = credits - ${safeCredits},
          updated_at = now()
      WHERE alliance_id = ${allianceId}
    `);

    return true;
  }

  static async getAllianceLeaderboard(limit: number = 50) {
    await this.ensureTables();

    const rows = await db.execute(sql`
      SELECT
        ra.id,
        ra.name,
        ra.faction,
        ra.leader_id,
        COALESCE(u.username, ra.leader_id) AS leader_name,
        COALESCE(rp.metals, 0) AS metals,
        COALESCE(rp.credits, 0) AS credits,
        COALESCE(member_counts.member_count, 0) AS member_count
      FROM research_alliances ra
      LEFT JOIN users u ON u.id = ra.leader_id
      LEFT JOIN research_alliance_pools rp ON rp.alliance_id = ra.id
      LEFT JOIN (
        SELECT alliance_id, COUNT(*)::int AS member_count
        FROM research_alliance_members
        GROUP BY alliance_id
      ) member_counts ON member_counts.alliance_id = ra.id
      ORDER BY (COALESCE(rp.metals, 0) + COALESCE(rp.credits, 0) + COALESCE(member_counts.member_count, 0) * 1000) DESC
      LIMIT ${Math.max(1, Math.min(200, limit))}
    `);

    return rows.rows.map((row: any, index: number) => ({
      rank: index + 1,
      allianceId: String(row.id),
      name: String(row.name),
      faction: String(row.faction),
      leaderId: String(row.leader_id),
      leaderName: String(row.leader_name),
      members: Number(row.member_count ?? 0),
      pool: {
        metals: Number(row.metals ?? 0),
        credits: Number(row.credits ?? 0),
      },
      score: Number(row.metals ?? 0) + Number(row.credits ?? 0) + Number(row.member_count ?? 0) * 1000,
    }));
  }

  static async syncAllianceBonusesToResearch(userId: string) {
    await this.ensureTables();

    const bonusData = await this.getPlayerAllianceBonuses(userId);
    if (!bonusData.hasAlliance) {
      return { synced: false, reason: "No alliance" };
    }

    try {
      await db.execute(sql`
        UPDATE player_states
        SET research_modifiers = jsonb_set(
          COALESCE(research_modifiers, '{}'::jsonb),
          '{alliance}',
          ${bonusData.bonuses}::jsonb,
          true
        ),
        updated_at = now()
        WHERE user_id = ${userId}
      `);

      return { synced: true, bonuses: bonusData.bonuses };
    } catch {
      return { synced: true, bonuses: bonusData.bonuses };
    }
  }
}
