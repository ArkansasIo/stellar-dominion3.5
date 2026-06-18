/**
 * Research Trading Service
 * Persistent implementation backed by PostgreSQL tables.
 */

import { db } from "../db";
import { sql } from "drizzle-orm";
import {
  ResearchTrade,
  TradeOffer,
  TradeRating,
  TradeStatistics,
  generateTradeId,
  validateTradeRequest,
  calculateFairnessScore,
  isPlayerEligibleForTrading,
} from "../../shared/config/researchTradingConfig";

const TRADE_EXPIRATION_HOURS = 48;

function toTradeOffer(value: unknown): TradeOffer {
  if (!value || typeof value !== "object") {
    return { researchIds: [], xpAmount: 0, credits: 0 };
  }
  const candidate = value as Record<string, unknown>;
  return {
    researchIds: Array.isArray(candidate.researchIds) ? (candidate.researchIds as string[]) : [],
    xpAmount: Number(candidate.xpAmount ?? 0),
    credits: Number(candidate.credits ?? 0),
    tech: Array.isArray(candidate.tech) ? (candidate.tech as string[]) : undefined,
    resources: candidate.resources as TradeOffer["resources"],
  };
}

function mapTradeRow(row: any): ResearchTrade {
  return {
    id: String(row.id),
    initiatorId: String(row.initiator_id),
    recipientId: String(row.recipient_id),
    status: String(row.status) as ResearchTrade["status"],
    initiatorOffer: toTradeOffer(row.initiator_offer),
    recipientOffer: toTradeOffer(row.recipient_offer),
    createdAt: new Date(row.created_at),
    expiresAt: new Date(row.expires_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
  };
}

export class ResearchTradingService {
  private static tablesReady = false;

  private static async ensureTables(): Promise<void> {
    if (this.tablesReady) return;

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_trades (
        id varchar PRIMARY KEY,
        initiator_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipient_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status varchar NOT NULL DEFAULT 'pending',
        initiator_offer jsonb NOT NULL DEFAULT '{}'::jsonb,
        recipient_offer jsonb NOT NULL DEFAULT '{}'::jsonb,
        rejection_reason text,
        created_at timestamp NOT NULL DEFAULT now(),
        expires_at timestamp NOT NULL,
        completed_at timestamp,
        dispute_id varchar,
        dispute_status varchar
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_trade_ratings (
        id varchar PRIMARY KEY,
        rater_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        trade_id varchar,
        rating integer NOT NULL,
        review text,
        created_at timestamp NOT NULL DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_trade_blocks (
        player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at timestamp NOT NULL DEFAULT now(),
        PRIMARY KEY (player_id, blocked_player_id)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_trade_disputes (
        id varchar PRIMARY KEY,
        trade_id varchar NOT NULL,
        opened_by varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reason text NOT NULL,
        status varchar NOT NULL DEFAULT 'pending',
        resolution text,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `);

    this.tablesReady = true;
  }

  static async createTradeRequest(
    initiatorId: string,
    recipientId: string,
    initiatorOffer: TradeOffer,
    recipientOffer: TradeOffer
  ): Promise<ResearchTrade> {
    await this.ensureTables();

    const trade: ResearchTrade = {
      id: generateTradeId(),
      initiatorId,
      recipientId,
      status: "pending",
      initiatorOffer,
      recipientOffer,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + TRADE_EXPIRATION_HOURS * 60 * 60 * 1000),
    };

    const validation = validateTradeRequest(trade);
    if (!validation.isValid) {
      throw new Error(`Trade validation failed: ${validation.errors.join(", ")}`);
    }

    const blocked = await db.execute(sql`
      SELECT 1
      FROM research_trade_blocks
      WHERE (player_id = ${initiatorId} AND blocked_player_id = ${recipientId})
         OR (player_id = ${recipientId} AND blocked_player_id = ${initiatorId})
      LIMIT 1
    `);
    if (blocked.rows.length > 0) {
      throw new Error("Trade blocked between these players");
    }

    await db.execute(sql`
      INSERT INTO research_trades (
        id, initiator_id, recipient_id, status, initiator_offer, recipient_offer, created_at, expires_at
      ) VALUES (
        ${trade.id}, ${initiatorId}, ${recipientId}, 'pending', ${initiatorOffer}, ${recipientOffer}, ${trade.createdAt}, ${trade.expiresAt}
      )
    `);

    return trade;
  }

  static async getActiveTrades(playerId: string): Promise<ResearchTrade[]> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT *
      FROM research_trades
      WHERE (initiator_id = ${playerId} OR recipient_id = ${playerId})
        AND status IN ('pending', 'accepted')
        AND expires_at > now()
      ORDER BY created_at DESC
    `);

    return result.rows.map(mapTradeRow);
  }

  static async getTrade(tradeId: string): Promise<ResearchTrade | null> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT * FROM research_trades WHERE id = ${tradeId} LIMIT 1
    `);

    if (!result.rows.length) return null;
    return mapTradeRow(result.rows[0]);
  }

  static async acceptTrade(tradeId: string, playerId: string): Promise<ResearchTrade> {
    await this.ensureTables();

    const trade = await this.getTrade(tradeId);
    if (!trade) throw new Error("Trade not found");
    if (trade.recipientId !== playerId) throw new Error("Only recipient can accept trade");
    if (trade.status !== "pending") throw new Error("Trade is not pending");
    if (trade.expiresAt.getTime() <= Date.now()) throw new Error("Trade has expired");

    await db.execute(sql`
      UPDATE research_trades SET status = 'accepted' WHERE id = ${tradeId}
    `);

    const accepted = await this.getTrade(tradeId);
    if (!accepted) throw new Error("Trade not found after acceptance");
    return accepted;
  }

  static async rejectTrade(tradeId: string, playerId: string, reason?: string): Promise<ResearchTrade> {
    await this.ensureTables();

    const trade = await this.getTrade(tradeId);
    if (!trade) throw new Error("Trade not found");
    if (trade.recipientId !== playerId) throw new Error("Only recipient can reject trade");
    if (trade.status !== "pending") throw new Error("Trade is not pending");

    await db.execute(sql`
      UPDATE research_trades
      SET status = 'rejected', rejection_reason = ${reason ?? null}
      WHERE id = ${tradeId}
    `);

    const rejected = await this.getTrade(tradeId);
    if (!rejected) throw new Error("Trade not found after rejection");
    return rejected;
  }

  static async cancelTrade(tradeId: string, playerId: string): Promise<boolean> {
    await this.ensureTables();

    const trade = await this.getTrade(tradeId);
    if (!trade) return false;
    if (trade.initiatorId !== playerId) throw new Error("Only initiator can cancel trade");
    if (!["pending", "accepted"].includes(trade.status)) return false;

    await db.execute(sql`
      UPDATE research_trades SET status = 'cancelled' WHERE id = ${tradeId}
    `);

    return true;
  }

  static async settleTrade(tradeId: string): Promise<ResearchTrade> {
    await this.ensureTables();

    const trade = await this.getTrade(tradeId);
    if (!trade) throw new Error("Trade not found");
    if (!["accepted", "pending"].includes(trade.status)) {
      throw new Error("Trade cannot be settled in current state");
    }

    const completedAt = new Date();
    await db.execute(sql`
      UPDATE research_trades
      SET status = 'completed', completed_at = ${completedAt}
      WHERE id = ${tradeId}
    `);

    const settled = await this.getTrade(tradeId);
    if (!settled) throw new Error("Trade not found after settlement");
    return settled;
  }

  static async getTradeHistory(playerId: string, limit: number = 50): Promise<ResearchTrade[]> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT *
      FROM research_trades
      WHERE (initiator_id = ${playerId} OR recipient_id = ${playerId})
        AND status IN ('completed', 'cancelled', 'rejected')
      ORDER BY COALESCE(completed_at, created_at) DESC
      LIMIT ${Math.max(1, Math.min(200, limit))}
    `);

    return result.rows.map(mapTradeRow);
  }

  static async getTradeRating(playerId: string): Promise<TradeRating> {
    await this.ensureTables();

    const ratings = await db.execute(sql`
      SELECT
        COUNT(*)::int AS review_count,
        COALESCE(AVG(rating), 0)::float AS avg_rating
      FROM research_trade_ratings
      WHERE target_id = ${playerId}
    `);

    const completedTrades = await db.execute(sql`
      SELECT COUNT(*)::int AS completed_count
      FROM research_trades
      WHERE (initiator_id = ${playerId} OR recipient_id = ${playerId})
        AND status = 'completed'
    `);

    const reviewCount = Number(ratings.rows[0]?.review_count ?? 0);
    const rating = Number(ratings.rows[0]?.avg_rating ?? 0);
    const completed = Number(completedTrades.rows[0]?.completed_count ?? 0);

    const fairnessRows = await this.getTradeHistory(playerId, 200);
    const fairnessScore = fairnessRows.length
      ? Math.round(
          fairnessRows.reduce((acc, trade) => acc + calculateFairnessScore(trade.initiatorOffer, trade.recipientOffer), 0) /
            fairnessRows.length
        )
      : 50;

    return {
      traderId: playerId,
      rating,
      reviewCount,
      completedTrades: completed,
      fairnessScore,
      trustScore: Math.max(0, Math.min(100, Math.round(fairnessScore * 0.7 + rating * 6))),
    };
  }

  static async getTradeStatistics(playerId: string): Promise<TradeStatistics> {
    await this.ensureTables();

    const allTradesResult = await db.execute(sql`
      SELECT *
      FROM research_trades
      WHERE initiator_id = ${playerId} OR recipient_id = ${playerId}
    `);

    const allTrades = allTradesResult.rows.map(mapTradeRow);
    const totalTrades = allTrades.length;
    const completed = allTrades.filter((trade) => trade.status === "completed");

    const totalXpTraded = completed.reduce(
      (sum, trade) => sum + Number(trade.initiatorOffer.xpAmount || 0) + Number(trade.recipientOffer.xpAmount || 0),
      0
    );
    const totalCreditsTraded = completed.reduce(
      (sum, trade) => sum + Number(trade.initiatorOffer.credits || 0) + Number(trade.recipientOffer.credits || 0),
      0
    );
    const totalValue = totalXpTraded + totalCreditsTraded;

    return {
      totalTrades,
      completedTrades: completed.length,
      totalXpTraded,
      totalCreditsTraded,
      averageTradeValue: completed.length ? Math.round(totalValue / completed.length) : 0,
      successRate: totalTrades ? completed.length / totalTrades : 0,
      lastTradeDate: completed.length
        ? completed.sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))[0].completedAt || new Date()
        : new Date(0),
    };
  }

  static async updateTradeOffer(tradeId: string, playerId: string, newOffer: TradeOffer): Promise<ResearchTrade> {
    await this.ensureTables();

    const trade = await this.getTrade(tradeId);
    if (!trade) throw new Error("Trade not found");
    if (trade.status !== "pending") throw new Error("Only pending trades can be modified");

    if (trade.initiatorId === playerId) {
      await db.execute(sql`
        UPDATE research_trades SET initiator_offer = ${newOffer} WHERE id = ${tradeId}
      `);
    } else if (trade.recipientId === playerId) {
      await db.execute(sql`
        UPDATE research_trades SET recipient_offer = ${newOffer} WHERE id = ${tradeId}
      `);
    } else {
      throw new Error("Only trade participants can modify offers");
    }

    const updated = await this.getTrade(tradeId);
    if (!updated) throw new Error("Trade not found after update");
    return updated;
  }

  static async getMarketplaceTrades(filters?: {
    minValue?: number;
    maxValue?: number;
    minRating?: number;
    researchType?: string;
  }): Promise<ResearchTrade[]> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT *
      FROM research_trades
      WHERE status = 'pending'
        AND expires_at > now()
      ORDER BY created_at DESC
      LIMIT 200
    `);

    let trades = result.rows.map(mapTradeRow);

    if (filters?.researchType) {
      trades = trades.filter((trade) =>
        [...trade.initiatorOffer.researchIds, ...trade.recipientOffer.researchIds]
          .join(" ")
          .toLowerCase()
          .includes(filters.researchType!.toLowerCase())
      );
    }

    if (filters?.minValue !== undefined || filters?.maxValue !== undefined) {
      trades = trades.filter((trade) => {
        const value =
          Number(trade.initiatorOffer.xpAmount || 0) +
          Number(trade.initiatorOffer.credits || 0) +
          Number(trade.recipientOffer.xpAmount || 0) +
          Number(trade.recipientOffer.credits || 0);
        if (filters.minValue !== undefined && value < filters.minValue) return false;
        if (filters.maxValue !== undefined && value > filters.maxValue) return false;
        return true;
      });
    }

    if (filters?.minRating !== undefined) {
      const ratings = await Promise.all(
        trades.map(async (trade) => ({
          trade,
          rating: await this.getTradeRating(trade.initiatorId),
        }))
      );
      trades = ratings.filter((entry) => entry.rating.rating >= filters.minRating!).map((entry) => entry.trade);
    }

    return trades;
  }

  static async searchTrades(query: string, type: "player" | "research"): Promise<ResearchTrade[]> {
    const needle = query.toLowerCase();
    const marketplace = await this.getMarketplaceTrades();

    if (type === "research") {
      return marketplace.filter((trade) =>
        [...trade.initiatorOffer.researchIds, ...trade.recipientOffer.researchIds]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      );
    }

    return marketplace.filter(
      (trade) => trade.initiatorId.toLowerCase().includes(needle) || trade.recipientId.toLowerCase().includes(needle)
    );
  }

  static async startDispute(tradeId: string, playerId: string, reason: string): Promise<{ disputeId: string }> {
    await this.ensureTables();

    const trade = await this.getTrade(tradeId);
    if (!trade) throw new Error("Trade not found");
    if (![trade.initiatorId, trade.recipientId].includes(playerId)) {
      throw new Error("Only trade participants can open disputes");
    }

    const disputeId = `DISP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    await db.execute(sql`
      INSERT INTO research_trade_disputes (id, trade_id, opened_by, reason, status)
      VALUES (${disputeId}, ${tradeId}, ${playerId}, ${reason}, 'pending')
    `);

    await db.execute(sql`
      UPDATE research_trades SET dispute_id = ${disputeId}, dispute_status = 'pending' WHERE id = ${tradeId}
    `);

    return { disputeId };
  }

  static async getDisputeStatus(disputeId: string): Promise<{
    status: "pending" | "reviewing" | "resolved" | "closed";
    resolution?: string;
  }> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT status, resolution FROM research_trade_disputes WHERE id = ${disputeId} LIMIT 1
    `);

    if (!result.rows.length) {
      return { status: "closed", resolution: "Dispute not found" };
    }

    return {
      status: String(result.rows[0].status) as "pending" | "reviewing" | "resolved" | "closed",
      resolution: result.rows[0].resolution ? String(result.rows[0].resolution) : undefined,
    };
  }

  static async ratePlayer(playerId: string, targetPlayerId: string, rating: number, review?: string): Promise<boolean> {
    await this.ensureTables();

    const boundedRating = Math.max(1, Math.min(5, Math.round(rating)));
    const id = `RTR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    await db.execute(sql`
      INSERT INTO research_trade_ratings (id, rater_id, target_id, rating, review)
      VALUES (${id}, ${playerId}, ${targetPlayerId}, ${boundedRating}, ${review ?? null})
    `);

    return true;
  }

  static async blockPlayer(playerId: string, targetPlayerId: string): Promise<boolean> {
    await this.ensureTables();

    await db.execute(sql`
      INSERT INTO research_trade_blocks (player_id, blocked_player_id)
      VALUES (${playerId}, ${targetPlayerId})
      ON CONFLICT (player_id, blocked_player_id) DO NOTHING
    `);

    return true;
  }

  static async getBlockedPlayers(playerId: string): Promise<string[]> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT blocked_player_id FROM research_trade_blocks WHERE player_id = ${playerId}
    `);

    return result.rows.map((row: any) => String(row.blocked_player_id));
  }

  static async validateTradeValue(initiatorOffer: TradeOffer, recipientOffer: TradeOffer): Promise<{
    isValid: boolean;
    fairnessScore: number;
    recommendation: string;
  }> {
    const fairnessScore = calculateFairnessScore(initiatorOffer, recipientOffer);

    return {
      isValid: fairnessScore >= 50,
      fairnessScore,
      recommendation:
        fairnessScore >= 80
          ? "This is a fair trade"
          : fairnessScore >= 60
            ? "Trade is acceptable but slightly imbalanced"
            : "Trade appears heavily imbalanced",
    };
  }

  static async getTradeRecommendations(playerId: string): Promise<ResearchTrade[]> {
    const marketplace = await this.getMarketplaceTrades();
    return marketplace.filter((trade) => trade.initiatorId !== playerId && trade.recipientId !== playerId).slice(0, 20);
  }

  static async simulateTradeOutcome(
    playerId: string,
    initiatorOffer: TradeOffer,
    recipientOffer: TradeOffer
  ): Promise<{
    yourResult: any;
    partnerResult: any;
    fairnessScore: number;
  }> {
    const fairnessScore = calculateFairnessScore(initiatorOffer, recipientOffer);

    const yourResult = {
      playerId,
      gains: recipientOffer,
      losses: initiatorOffer,
      netXp: Number(recipientOffer.xpAmount || 0) - Number(initiatorOffer.xpAmount || 0),
      netCredits: Number(recipientOffer.credits || 0) - Number(initiatorOffer.credits || 0),
    };

    const partnerResult = {
      gains: initiatorOffer,
      losses: recipientOffer,
      netXp: Number(initiatorOffer.xpAmount || 0) - Number(recipientOffer.xpAmount || 0),
      netCredits: Number(initiatorOffer.credits || 0) - Number(recipientOffer.credits || 0),
    };

    return { yourResult, partnerResult, fairnessScore };
  }

  static async getPendingTradesRequiringAction(playerId: string): Promise<ResearchTrade[]> {
    await this.ensureTables();

    const result = await db.execute(sql`
      SELECT *
      FROM research_trades
      WHERE recipient_id = ${playerId}
        AND status = 'pending'
        AND expires_at > now()
      ORDER BY created_at DESC
    `);

    return result.rows.map(mapTradeRow);
  }

  static async acceptBulkTrades(playerId: string, tradeIds: string[]): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    for (const tradeId of tradeIds) {
      try {
        await this.acceptTrade(tradeId, playerId);
        successful += 1;
      } catch {
        failed += 1;
      }
    }

    return { successful, failed };
  }

  static async validatePlayerEligibility(playerId: string): Promise<{ eligible: boolean; reason?: string }> {
    await this.ensureTables();

    const userRows = await db.execute(sql`
      SELECT created_at FROM users WHERE id = ${playerId} LIMIT 1
    `);

    if (!userRows.rows.length) {
      return { eligible: false, reason: "Player not found" };
    }

    const createdAtRaw = userRows.rows[0].created_at as string | number | Date;
    const createdAt = new Date(createdAtRaw);
    const accountAgeDays = Math.floor((Date.now() - createdAt.getTime()) / (24 * 60 * 60 * 1000));

    const stateRows = await db.execute(sql`
      SELECT commander FROM player_states WHERE user_id = ${playerId} LIMIT 1
    `);

    const commanderLevel = Number((stateRows.rows[0]?.commander as any)?.stats?.level ?? 1);

    const blockedRows = await db.execute(sql`
      SELECT 1 FROM research_trade_blocks WHERE player_id = ${playerId} LIMIT 1
    `);

    return isPlayerEligibleForTrading(commanderLevel, accountAgeDays, 50, blockedRows.rows.length >= 10);
  }

  static async getAvailableResearch(playerId: string): Promise<
    Array<{
      id: string;
      name: string;
      level: number;
      value: number;
    }>
  > {
    await this.ensureTables();

    const rows = await db.execute(sql`
      SELECT research FROM player_states WHERE user_id = ${playerId} LIMIT 1
    `);

    if (!rows.rows.length) return [];

    const research = ((rows.rows[0].research || {}) as Record<string, number>) ?? {};

    return Object.entries(research)
      .filter(([, level]) => Number(level) > 0)
      .map(([id, level]) => ({
        id,
        name: id,
        level: Number(level),
        value: Number(level) * 1000,
      }))
      .sort((a, b) => b.value - a.value);
  }
}

export default ResearchTradingService;
