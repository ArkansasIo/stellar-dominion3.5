/**
 * Bank/Vault System Service
 * Deposits, withdrawals, interest, insurance, vault upgrades, and item vault
 */

import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";
import {
  bankAccounts,
  bankTransactions,
  playerCurrency,
  currencyTransactions,
  playerStates,
} from "../../shared/schema";

const BANK_LEVELS: Record<number, {
  maxDeposit: number;
  maxWithdrawal: number;
  interestRate: number;
  upgradeCost: number;
}> = {
  1: { maxDeposit: 1000000, maxWithdrawal: 500000, interestRate: 0.05, upgradeCost: 0 },
  2: { maxDeposit: 5000000, maxWithdrawal: 2000000, interestRate: 0.075, upgradeCost: 50000 },
  3: { maxDeposit: 20000000, maxWithdrawal: 10000000, interestRate: 0.1, upgradeCost: 200000 },
  4: { maxDeposit: 100000000, maxWithdrawal: 50000000, interestRate: 0.125, upgradeCost: 1000000 },
  5: { maxDeposit: 500000000, maxWithdrawal: 250000000, interestRate: 0.15, upgradeCost: 5000000 },
};

const INSURANCE_CONFIG = {
  costGold: 100000,
  costPlatinum: 500,
  protectionPercent: 0.5,
  durationDays: 30,
};

function calculateInterest(bankLevel: number, balance: number): number {
  const config = BANK_LEVELS[bankLevel] || BANK_LEVELS[1];
  return Math.floor(balance * config.interestRate / 365);
}

function getBankLevel(account: any): number {
  const balance = account.accountBalance || 0;
  if (balance >= 500000000) return 5;
  if (balance >= 100000000) return 4;
  if (balance >= 20000000) return 3;
  if (balance >= 5000000) return 2;
  return 1;
}

export class BankService {
  static async getBankAccount(userId: string) {
    let [account] = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    if (!account) {
      [account] = await db.insert(bankAccounts).values({
        userId,
        accountType: "standard",
        accountBalance: 0,
        interestRate: BANK_LEVELS[1].interestRate,
        maxWithdrawal: BANK_LEVELS[1].maxWithdrawal,
        maxDeposit: BANK_LEVELS[1].maxDeposit,
      }).returning();
    }
    return account;
  }

  static async depositToBank(userId: string, amount: number, currencyType: string = "gold") {
    if (amount <= 0) throw new Error("Deposit amount must be positive");

    const [currency] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, userId));
    if (!currency) throw new Error("Currency account not found");

    const field = currencyType as "gold" | "silver" | "platinum";
    const currentBalance = (currency as any)[field] as number;
    if (currentBalance < amount) {
      throw new Error(`Insufficient ${currencyType}: have ${currentBalance}, need ${amount}`);
    }

    const [account] = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    if (!account) throw new Error("Bank account not found");

    if (account.accountBalance + amount > account.maxDeposit) {
      throw new Error(`Deposit exceeds maximum of ${account.maxDeposit}`);
    }

    const newCurrencyBalance = currentBalance - amount;
    const newBankBalance = account.accountBalance + amount;

    await db.update(playerCurrency).set({
      [field]: newCurrencyBalance,
    }).where(eq(playerCurrency.userId, userId));

    await db.update(bankAccounts).set({
      accountBalance: newBankBalance,
    }).where(eq(bankAccounts.userId, userId));

    await db.insert(bankTransactions).values({
      userId,
      accountId: account.id,
      transactionType: "deposit",
      amount,
      description: `${amount} ${currencyType} deposited`,
      balanceBefore: account.accountBalance,
      balanceAfter: newBankBalance,
    });

    await db.insert(currencyTransactions).values({
      userId,
      currencyType,
      amount: -amount,
      reason: `bank_deposit`,
      relatedId: account.id,
      balanceBefore: currentBalance,
      balanceAfter: newCurrencyBalance,
    });

    return { bankBalance: newBankBalance, currencyBalance: newCurrencyBalance };
  }

  static async withdrawFromBank(userId: string, amount: number, currencyType: string = "gold") {
    if (amount <= 0) throw new Error("Withdrawal amount must be positive");

    const [account] = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    if (!account) throw new Error("Bank account not found");

    if (account.accountBalance < amount) {
      throw new Error(`Insufficient bank balance: have ${account.accountBalance}, need ${amount}`);
    }

    if (amount > account.maxWithdrawal) {
      throw new Error(`Withdrawal exceeds maximum of ${account.maxWithdrawal}`);
    }

    let [currency] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, userId));
    if (!currency) {
      [currency] = await db.insert(playerCurrency).values({ userId }).returning();
    }

    const field = currencyType as "gold" | "silver" | "platinum";
    const currentCurrencyBalance = (currency as any)[field] as number;
    const limit = field === "gold" ? 9999999 : field === "silver" ? 99999999 : 999999;
    const newCurrencyBalance = Math.min(limit, currentCurrencyBalance + amount);
    const newBankBalance = account.accountBalance - amount;

    await db.update(bankAccounts).set({
      accountBalance: newBankBalance,
    }).where(eq(bankAccounts.userId, userId));

    await db.update(playerCurrency).set({
      [field]: newCurrencyBalance,
    }).where(eq(playerCurrency.userId, userId));

    await db.insert(bankTransactions).values({
      userId,
      accountId: account.id,
      transactionType: "withdrawal",
      amount,
      description: `${amount} ${currencyType} withdrawn`,
      balanceBefore: account.accountBalance,
      balanceAfter: newBankBalance,
    });

    await db.insert(currencyTransactions).values({
      userId,
      currencyType,
      amount,
      reason: `bank_withdrawal`,
      relatedId: account.id,
      balanceBefore: currentCurrencyBalance,
      balanceAfter: newCurrencyBalance,
    });

    return { bankBalance: newBankBalance, currencyBalance: newCurrencyBalance };
  }

  static calculateInterest = calculateInterest;

  static async processInterest(userId: string) {
    const [account] = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    if (!account || account.accountBalance <= 0) return null;

    const bankLevel = getBankLevel(account);
    const interest = calculateInterest(bankLevel, account.accountBalance);

    if (interest <= 0) return null;

    const newBalance = account.accountBalance + interest;

    await db.update(bankAccounts).set({
      accountBalance: newBalance,
      totalInterestEarned: (account.totalInterestEarned || 0) + interest,
      lastInterestPayment: new Date(),
    }).where(eq(bankAccounts.userId, userId));

    await db.insert(bankTransactions).values({
      userId,
      accountId: account.id,
      transactionType: "interest",
      amount: interest,
      description: `Interest payment (${(BANK_LEVELS[bankLevel].interestRate * 100).toFixed(1)}% daily)`,
      balanceBefore: account.accountBalance,
      balanceAfter: newBalance,
    });

    return { interest, newBalance, rate: BANK_LEVELS[bankLevel].interestRate };
  }

  static async purchaseInsurance(userId: string) {
    const [account] = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    if (!account) throw new Error("Bank account not found");

    if (account.accountBalance < INSURANCE_CONFIG.costGold) {
      throw new Error(`Insufficient bank balance for insurance: need ${INSURANCE_CONFIG.costGold}`);
    }

    const newBalance = account.accountBalance - INSURANCE_CONFIG.costGold;

    await db.update(bankAccounts).set({
      accountBalance: newBalance,
      accountType: "vault",
    }).where(eq(bankAccounts.userId, userId));

    await db.insert(bankTransactions).values({
      userId,
      accountId: account.id,
      transactionType: "fee",
      amount: INSURANCE_CONFIG.costGold,
      description: "Bank insurance purchased (50% loss protection)",
      balanceBefore: account.accountBalance,
      balanceAfter: newBalance,
    });

    return {
      insuranceActive: true,
      protectionPercent: INSURANCE_CONFIG.protectionPercent,
      durationDays: INSURANCE_CONFIG.durationDays,
      newBalance,
    };
  }

  static async upgradeVault(userId: string) {
    const [account] = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    if (!account) throw new Error("Bank account not found");

    const currentLevel = getBankLevel(account);
    const nextLevel = currentLevel + 1;

    if (!BANK_LEVELS[nextLevel]) {
      throw new Error("Vault already at maximum level");
    }

    const upgradeCost = BANK_LEVELS[nextLevel].upgradeCost;
    if (account.accountBalance < upgradeCost) {
      throw new Error(`Insufficient balance: need ${upgradeCost}, have ${account.accountBalance}`);
    }

    const newBalance = account.accountBalance - upgradeCost;
    const nextConfig = BANK_LEVELS[nextLevel];

    await db.update(bankAccounts).set({
      accountBalance: newBalance,
      interestRate: nextConfig.interestRate,
      maxWithdrawal: nextConfig.maxWithdrawal,
      maxDeposit: nextConfig.maxDeposit,
    }).where(eq(bankAccounts.userId, userId));

    await db.insert(bankTransactions).values({
      userId,
      accountId: account.id,
      transactionType: "fee",
      amount: upgradeCost,
      description: `Vault upgraded to level ${nextLevel}`,
      balanceBefore: account.accountBalance,
      balanceAfter: newBalance,
    });

    return {
      previousLevel: currentLevel,
      newLevel: nextLevel,
      upgradeCost,
      newBalance,
      newInterestRate: nextConfig.interestRate,
      newMaxDeposit: nextConfig.maxDeposit,
      newMaxWithdrawal: nextConfig.maxWithdrawal,
    };
  }

  static async getVaultItems(userId: string, tab: string = "all") {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const artifacts = (state.artifacts || []) as any[];
    const items = tab === "all" ? artifacts : artifacts.filter((a: any) => a.type === tab);
    return { items, totalItems: items.length, tab };
  }

  static async getTransactionHistory(userId: string) {
    const transactions = await db.select().from(bankTransactions)
      .where(eq(bankTransactions.userId, userId))
      .orderBy(desc(bankTransactions.createdAt))
      .limit(100);
    return transactions;
  }
}

export default BankService;
