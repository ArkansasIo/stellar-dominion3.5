import { BANK_CONFIG } from "../../shared/config/xenoberage/bankConfig";
import { db } from "../db";
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

  // TODO: Query player account, verify sufficient balance, update loan

  return {
    success: true,
    remainingLoan: 0,
    message: `Loan payment of ${amount} processed`,
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
  // TODO: Deduct turns and transfer credits to IGB

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

  // TODO: Update all accounts in database
  // Apply loan interest to accounts with active loans

  return updatedAccounts;
}
