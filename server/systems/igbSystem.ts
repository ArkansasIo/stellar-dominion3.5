import { BANK_CONFIG } from "../../Source/Shared/config/xenoberage/bankConfig";
import { db } from "../db";
import { playerStates } from "../../Source/Shared/schema";
import { eq, and } from "drizzle-orm";

export interface IGBAccount {
  userId: string;
  balance: number;
  loan: number;
  lastLoanPayment: Date;
  lastTransfer: Date;
}

/**
 * Process IGB interest on all accounts per tick.
 * interest = balance * interestRate
 */
export function processIGBInterest(
  accounts: IGBAccount[],
  interestRate: number = BANK_CONFIG.interestRate
): IGBAccount[] {
  return accounts.map((account) => ({
    ...account,
    balance: Math.floor(account.balance * interestRate),
  }));
}

/**
 * Calculate loan interest over time.
 * interest = principal * loanInterest * timeInMinutes
 */
export function calculateLoanInterest(
  principal: number,
  loanInterest: number = BANK_CONFIG.loanInterest,
  timeMinutes: number
): number {
  return Math.floor(principal * loanInterest * timeMinutes);
}

/**
 * Process a loan repayment.
 * Deducts amount from balance and reduces loan.
 */
export async function processLoanPayment(
  userId: string,
  amount: number
): Promise<{ success: boolean; remainingLoan: number; message: string }> {
  if (amount <= 0) {
    return { success: false, remainingLoan: 0, message: "Invalid payment amount" };
  }

  const playerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
  });

  if (!playerState) {
    return { success: false, remainingLoan: 0, message: "Player not found" };
  }

  const resources = (playerState.resources as any) || {};
  const credits = resources.credits || 0;

  if (credits < amount) {
    return { success: false, remainingLoan: 0, message: "Insufficient credits" };
  }

  const igbData = (playerState.research as any)?.igbAccount || {};
  const currentLoan = igbData.loan || 0;
  const paymentAmount = Math.min(amount, currentLoan);
  const remainingLoan = currentLoan - paymentAmount;

  const currentResearch = (playerState.research as any) || {};
  await db.update(playerStates).set({
    resources: { ...resources, credits: credits - paymentAmount },
    research: {
      ...currentResearch,
      igbAccount: { ...igbData, loan: remainingLoan },
    },
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, userId));

  return {
    success: true,
    remainingLoan,
    message: `Loan payment of ${paymentAmount} processed`,
  };
}

/**
 * Consolidate player credits into IGB account.
 * Costs turns based on igbTconsolidate config.
 */
export async function consolidateAccount(
  userId: string,
  turnCost: number = BANK_CONFIG.igbTconsolidate
): Promise<{ success: boolean; turnsDeducted: number; message: string }> {
  const playerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
  });

  if (!playerState) {
    return { success: false, turnsDeducted: 0, message: "Player not found" };
  }

  const turnsData = (playerState.turnsData as any) || {};
  const availableTurns = turnsData.availableTurns || playerState.currentTurns || 0;

  if (availableTurns < turnCost) {
    return { success: false, turnsDeducted: 0, message: "Insufficient turns" };
  }

  const resources = (playerState.resources as any) || {};
  const credits = resources.credits || 0;
  const currentResearch = (playerState.research as any) || {};

  await db.update(playerStates).set({
    turnsData: { ...turnsData, availableTurns: availableTurns - turnCost },
    currentTurns: availableTurns - turnCost,
    resources: { ...resources, credits: 0 },
    research: {
      ...currentResearch,
      igbAccount: {
        ...(currentResearch?.igbAccount || {}),
        balance: (currentResearch?.igbAccount?.balance || 0) + credits,
      },
    },
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, userId));

  return {
    success: true,
    turnsDeducted: turnCost,
    message: `Credits consolidated. ${turnCost} turns deducted.`,
  };
}

/**
 * Check if player is within loan limit.
 * maxLoan = networth * loanLimit
 */
export function checkLoanLimit(
  networth: number,
  loanLimit: number = BANK_CONFIG.loanLimit,
  currentLoan: number
): { canBorrow: boolean; maxAdditional: number } {
  const maxLoan = Math.floor(networth * loanLimit);
  const maxAdditional = Math.max(0, maxLoan - currentLoan);
  return {
    canBorrow: maxAdditional > 0,
    maxAdditional,
  };
}

/**
 * Process full IGB tick for all accounts.
 * Applies interest to balances and compounds loan interest.
 */
export async function processIGBTick(
  accounts: IGBAccount[]
): Promise<IGBAccount[]> {
  const updatedAccounts = processIGBInterest(accounts);

  for (const account of updatedAccounts) {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, account.userId),
    });

    if (!playerState) continue;

    const igbData = (playerState.research as any)?.igbAccount || {};
    const currentLoan = igbData.loan || 0;

    let newLoan = currentLoan;
    if (currentLoan > 0) {
      const loanInterest = calculateLoanInterest(currentLoan, BANK_CONFIG.loanInterest, 1);
      newLoan = currentLoan + loanInterest;
    }

    const currentResearch = (playerState.research as any) || {};
    await db.update(playerStates).set({
      research: {
        ...currentResearch,
        igbAccount: {
          ...igbData,
          balance: account.balance,
          loan: newLoan,
        },
      },
      updatedAt: new Date(),
    }).where(eq(playerStates.userId, account.userId));
  }

  return updatedAccounts;
}
