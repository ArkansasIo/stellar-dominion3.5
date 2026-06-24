import { db } from "../db";
import { gateTokens, gateTokenHistory, playerCurrency } from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import { 
  TokenType, 
  getTokenConfig, 
  isValidTokenType,
  tokenAcquisitionRules 
} from "../../shared/config/gateTokensConfig";

export class GateTokensService {
  /**
   * Get current token balance for a player
   */
  async getTokenBalance(userId: string, tokenType: TokenType): Promise<number> {
    const result = await db
      .select()
      .from(gateTokens)
      .where(and(
        eq(gateTokens.userId, userId),
        eq(gateTokens.tokenType, tokenType)
      ))
      .limit(1);

    return result.length > 0 ? result[0].quantity : 0;
  }

  /**
   * Get all token balances for a player
   */
  async getAllTokenBalances(userId: string): Promise<Record<TokenType, number>> {
    const results = await db
      .select()
      .from(gateTokens)
      .where(eq(gateTokens.userId, userId));

    return {
      anomaly: results.find(r => r.tokenType === 'anomaly')?.quantity ?? 0,
      raid: results.find(r => r.tokenType === 'raid')?.quantity ?? 0,
      exploration: results.find(r => r.tokenType === 'exploration')?.quantity ?? 0,
    };
  }

  /**
   * Consume a token when entering anomaly/raid/exploration
   */
  async consumeToken(
    userId: string,
    tokenType: TokenType,
    source: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    if (!isValidTokenType(tokenType)) {
      return { success: false, error: 'Invalid token type' };
    }

    const balance = await this.getTokenBalance(userId, tokenType);
    if (balance < 1) {
      return { success: false, error: 'Insufficient tokens' };
    }

    // Update token balance
    const existing = await db
      .select()
      .from(gateTokens)
      .where(and(
        eq(gateTokens.userId, userId),
        eq(gateTokens.tokenType, tokenType)
      ))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(gateTokens)
        .set({ quantity: balance - 1, lastUpdated: new Date() })
        .where(and(
          eq(gateTokens.userId, userId),
          eq(gateTokens.tokenType, tokenType)
        ));
    }

    // Log the consumption
    await db.insert(gateTokenHistory).values({
      userId,
      tokenType,
      action: 'consumed',
      quantity: 1,
      source,
      metadata,
    });

    return { success: true };
  }

  /**
   * Add tokens to a player's inventory (from rewards, purchases, etc.)
   */
  async addTokens(
    userId: string,
    tokenType: TokenType,
    quantity: number,
    action: 'earned' | 'purchased',
    source: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    if (!isValidTokenType(tokenType)) {
      return { success: false, error: 'Invalid token type' };
    }

    if (quantity <= 0) {
      return { success: false, error: 'Quantity must be positive' };
    }

    const config = getTokenConfig(tokenType);
    const currentBalance = await this.getTokenBalance(userId, tokenType);
    const newBalance = currentBalance + quantity;

    if (newBalance > config.maxInventory) {
      return { 
        success: false, 
        error: `Token limit exceeded. Max: ${config.maxInventory}` 
      };
    }

    // Update or insert token balance
    const existing = await db
      .select()
      .from(gateTokens)
      .where(and(
        eq(gateTokens.userId, userId),
        eq(gateTokens.tokenType, tokenType)
      ))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(gateTokens)
        .set({ quantity: newBalance, lastUpdated: new Date() })
        .where(and(
          eq(gateTokens.userId, userId),
          eq(gateTokens.tokenType, tokenType)
        ));
    } else {
      await db.insert(gateTokens).values({
        userId,
        tokenType,
        quantity: newBalance,
      });
    }

    // Log the addition
    await db.insert(gateTokenHistory).values({
      userId,
      tokenType,
      action,
      quantity,
      source,
      metadata,
    });

    return { success: true, newBalance };
  }

  /**
   * Purchase tokens with credits
   */
  async purchaseTokens(
    userId: string,
    tokenType: TokenType,
    quantity: number
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    if (!isValidTokenType(tokenType)) {
      return { success: false, error: 'Invalid token type' };
    }

    const config = getTokenConfig(tokenType);
    const totalCost = config.purchasePrice.credits * quantity;

    // Check player currency balance
    const currencyResult = await db
      .select()
      .from(playerCurrency)
      .where(eq(playerCurrency.userId, userId))
      .limit(1);

    const currentCredits = currencyResult.length > 0 ? (currencyResult[0] as any).silver : 0;
    if (currentCredits < totalCost) {
      return { success: false, error: 'Insufficient credits' };
    }

    // Deduct credits
    if (currencyResult.length > 0) {
      await db
        .update(playerCurrency)
        .set({ silver: currentCredits - totalCost } as any)
        .where(eq(playerCurrency.userId, userId));
    }

    // Add tokens
    return this.addTokens(
      userId,
      tokenType,
      quantity,
      'purchased',
      'store',
      { costPerToken: (config.purchasePrice as any).credits, totalCost }
    );
  }

  /**
   * Award tokens from content completion (with chance-based system)
   */
  async awardTokensFromCompletion(
    userId: string,
    contentType: 'anomaly' | 'raid' | 'exploration',
    metadata?: Record<string, any>
  ): Promise<{ awarded: boolean; tokenType?: TokenType; quantity?: number }> {
    const rules = {
      anomaly: tokenAcquisitionRules.anomalyCompletion,
      raid: tokenAcquisitionRules.raidVictory,
      exploration: tokenAcquisitionRules.explorationCompletion,
    };

    const rule = rules[contentType];
    const shouldAward = Math.random() < rule.rewardChance;

    if (shouldAward) {
      await this.addTokens(
        userId,
        rule.tokenType,
        rule.quantity,
        'earned',
        `${contentType}_completion`,
        metadata
      );
      return { awarded: true, tokenType: rule.tokenType, quantity: rule.quantity };
    }

    return { awarded: false };
  }

  /**
   * Get token history for a player
   */
  async getTokenHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    return db
      .select()
      .from(gateTokenHistory)
      .where(eq(gateTokenHistory.userId, userId))
      .orderBy((table) => table.createdAt)
      .limit(limit)
      .offset(offset);
  }

  /**
   * Initialize default tokens for new player
   */
  async initializePlayerTokens(userId: string): Promise<void> {
    const tokenTypes: TokenType[] = ['anomaly', 'raid', 'exploration'];
    
    for (const type of tokenTypes) {
      const existing = await db
        .select()
        .from(gateTokens)
        .where(and(
          eq(gateTokens.userId, userId),
          eq(gateTokens.tokenType, type)
        ))
        .limit(1);

      if (existing.length === 0) {
        // Initialize with base tokens
        const config = getTokenConfig(type);
        await db.insert(gateTokens).values({
          userId,
          tokenType: type,
          quantity: config.dailyRewardAllocation.base * 3, // Give 3 days worth as starter
        });
      }
    }
  }
}

export const gateTokensService = new GateTokensService();
