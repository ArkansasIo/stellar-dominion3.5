/**
 * Currency System Service
 * Silver/Gold/Platinum management, transactions, exchange, and transfers
 */

import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";
import { playerCurrency, currencyTransactions } from "../../Source/Shared/schema";
import { CURRENCY_CONFIG } from "../../Source/Shared/config/currencyConfig";

type CurrencyType = "silver" | "gold" | "platinum";

const CURRENCY_LIMITS = CURRENCY_CONFIG.limits;
const EXCHANGE_RATES = CURRENCY_CONFIG.conversionRates;

function getLimitForType(type: CurrencyType): number {
  switch (type) {
    case "silver": return CURRENCY_LIMITS.maxSilverPerPlayer;
    case "gold": return CURRENCY_LIMITS.maxGoldPerPlayer;
    case "platinum": return CURRENCY_LIMITS.maxPlatinumPerPlayer;
    default: return 0;
  }
}

function getBalanceField(type: CurrencyType): string {
  return type;
}

function getEarnedField(type: CurrencyType): string {
  return `${type}Earned`;
}

function getSpentField(type: CurrencyType): string {
  return `${type}Spent`;
}

function validateCurrencyTransaction(userId: string, amount: number, type: CurrencyType) {
  if (amount <= 0) throw new Error("Amount must be positive");
  if (!["silver", "gold", "platinum"].includes(type)) throw new Error("Invalid currency type");
  if (amount > CURRENCY_LIMITS.transactionLimit && type === "gold") {
    throw new Error(`Transaction exceeds limit of ${CURRENCY_LIMITS.transactionLimit} gold`);
  }
  return true;
}

export class CurrencyService {
  static async getCurrencyBalance(userId: string) {
    const [balance] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, userId));
    if (!balance) {
      const [newBalance] = await db.insert(playerCurrency).values({ userId }).returning();
      return newBalance;
    }
    return balance;
  }

  static async addCurrency(userId: string, amount: number, currencyType: CurrencyType, reason: string = "quest_reward") {
    if (amount <= 0) throw new Error("Amount must be positive");
    validateCurrencyTransaction(userId, amount, currencyType);

    let [balance] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, userId));
    if (!balance) {
      [balance] = await db.insert(playerCurrency).values({ userId }).returning();
    }

    const field = getBalanceField(currencyType);
    const earnedField = getEarnedField(currencyType);
    const currentBalance = (balance as any)[field] as number;
    const limit = getLimitForType(currencyType);
    const newBalance = Math.min(limit, currentBalance + amount);

    await db.update(playerCurrency).set({
      [field]: newBalance,
      [earnedField]: ((balance as any)[earnedField] as number) + amount,
    }).where(eq(playerCurrency.userId, userId));

    await db.insert(currencyTransactions).values({
      userId,
      currencyType,
      amount,
      reason,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
    });

    return { [currencyType]: newBalance };
  }

  static async deductCurrency(userId: string, amount: number, currencyType: CurrencyType, reason: string = "purchase") {
    if (amount <= 0) throw new Error("Amount must be positive");
    validateCurrencyTransaction(userId, amount, currencyType);

    const [balance] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, userId));
    if (!balance) throw new Error("Currency account not found");

    const field = getBalanceField(currencyType);
    const spentField = getSpentField(currencyType);
    const currentBalance = (balance as any)[field] as number;

    if (currentBalance < amount) {
      throw new Error(`Insufficient ${currencyType}: have ${currentBalance}, need ${amount}`);
    }

    const newBalance = currentBalance - amount;

    await db.update(playerCurrency).set({
      [field]: newBalance,
      [spentField]: ((balance as any)[spentField] as number) + amount,
    }).where(eq(playerCurrency.userId, userId));

    await db.insert(currencyTransactions).values({
      userId,
      currencyType,
      amount: -amount,
      reason,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
    });

    return { [currencyType]: newBalance };
  }

  static async transferCurrency(userId: string, targetId: string, amount: number, currencyType: CurrencyType) {
    if (userId === targetId) throw new Error("Cannot transfer to yourself");
    if (amount <= 0) throw new Error("Amount must be positive");

    const fee = Math.ceil(amount * CURRENCY_CONFIG.currencyUses.transactions.transactionFee);
    const totalCost = amount + fee;

    const [senderBalance] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, userId));
    if (!senderBalance) throw new Error("Sender account not found");

    const senderField = getBalanceField(currencyType);
    const senderCurrent = (senderBalance as any)[senderField] as number;
    if (senderCurrent < totalCost) {
      throw new Error(`Insufficient ${currencyType} (including ${fee} fee): have ${senderCurrent}, need ${totalCost}`);
    }

    let [targetBalance] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, targetId));
    if (!targetBalance) {
      [targetBalance] = await db.insert(playerCurrency).values({ userId: targetId }).returning();
    }

    const targetField = getBalanceField(currencyType);
    const targetCurrent = (targetBalance as any)[targetField] as number;
    const targetLimit = getLimitForType(currencyType);
    const targetNew = Math.min(targetLimit, targetCurrent + amount);

    const senderNew = senderCurrent - totalCost;

    await db.update(playerCurrency).set({
      [senderField]: senderNew,
      [`${currencyType}Spent`]: ((senderBalance as any)[`${currencyType}Spent`] as number) + totalCost,
    }).where(eq(playerCurrency.userId, userId));

    await db.update(playerCurrency).set({
      [targetField]: targetNew,
      [`${currencyType}Earned`]: ((targetBalance as any)[`${currencyType}Earned`] as number) + amount,
    }).where(eq(playerCurrency.userId, targetId));

    await db.insert(currencyTransactions).values({
      userId,
      currencyType,
      amount: -totalCost,
      reason: `transfer_to_${targetId}`,
      relatedId: targetId,
      balanceBefore: senderCurrent,
      balanceAfter: senderNew,
    });

    await db.insert(currencyTransactions).values({
      userId: targetId,
      currencyType,
      amount,
      reason: `transfer_from_${userId}`,
      relatedId: userId,
      balanceBefore: targetCurrent,
      balanceAfter: targetNew,
    });

    return { transferred: amount, fee, senderNewBalance: senderNew, targetNewBalance: targetNew };
  }

  static async getCurrencyTransactions(userId: string, limit: number = 50) {
    const transactions = await db.select().from(currencyTransactions)
      .where(eq(currencyTransactions.userId, userId))
      .orderBy(desc(currencyTransactions.createdAt))
      .limit(limit);
    return transactions;
  }

  static calculateCurrencyExchange(fromType: CurrencyType, toType: CurrencyType, amount: number) {
    const rates: Record<string, number> = {
      silverToGold: EXCHANGE_RATES.silverToGold,
      platinumToGold: EXCHANGE_RATES.platinumToGold,
    };

    let goldEquivalent: number;
    switch (fromType) {
      case "gold": goldEquivalent = amount; break;
      case "silver": goldEquivalent = amount / rates.silverToGold; break;
      case "platinum": goldEquivalent = amount * rates.platinumToGold; break;
      default: throw new Error("Invalid source currency");
    }

    let result: number;
    switch (toType) {
      case "gold": result = goldEquivalent; break;
      case "silver": result = goldEquivalent * rates.silverToGold; break;
      case "platinum": result = goldEquivalent / rates.platinumToGold; break;
      default: throw new Error("Invalid target currency");
    }

    return { from: fromType, to: toType, amount, result: Math.floor(result) };
  }

  static validateCurrencyTransaction = validateCurrencyTransaction;
  static CURRENCY_LIMITS = CURRENCY_LIMITS;
}

export default CurrencyService;
