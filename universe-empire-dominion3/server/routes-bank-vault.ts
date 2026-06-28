/**
 * COMMANDER BANK & VAULT SERVER ROUTES
 * ============================================================================
 */
import { type Express } from "express";
import {
  CURRENCIES, getDefaultBankVaultState,
  calculateVaultCapacity, calculateBankCapacity, calculateInsurancePremium,
  calculateTransferFee, processBankInterest, processLoans,
  addToVault, removeFromVault, depositCurrency, withdrawCurrency,
  exchangeCurrency, purchaseInsurance, upgradeVault,
  getVaultItemsByTab, calculateTotalVaultValue,
} from "../shared/config/commander/vault/commanderBankVault";

import type { CommanderBankVaultState, CurrencyType, VaultTab, VaultItem } from "../shared/config/commander/vault/commanderBankVault";

import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

async function getState(userId: string): Promise<CommanderBankVaultState> {
  const row = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
    columns: { bankVaultState: true },
  });
  let state = row?.bankVaultState as CommanderBankVaultState | null;
  if (!state) {
    state = getDefaultBankVaultState();
    await setState(userId, state);
  }
  return state;
}

async function setState(userId: string, state: CommanderBankVaultState) {
  await db
    .update(playerStates)
    .set({ bankVaultState: state as any, updatedAt: new Date() })
    .where(eq(playerStates.userId, userId));
}

export function registerBankVaultRoutes(app: Express) {
  // Get full bank/vault state
  app.get("/api/bank-vault/status", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    let state = await getState(userId);
    state = processBankInterest(state);
    state = processLoans(state);
    await setState(userId, state);
    const totalValue = calculateTotalVaultValue(state);
    res.json({
      success: true,
      vault: { ...state.vault, items: state.vault.items.slice(0, 100) },
      bank: state.bank,
      insurancePolicies: state.insurancePolicies,
      storageUpgrades: state.storageUpgrades,
      totalValue,
      stats: state.stats,
    });
  });

  // Get currencies
  app.get("/api/bank-vault/currencies", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getState(userId);
    const currencies = CURRENCIES.map(c => ({
      ...c,
      balance: state.bank.currencies[c.id],
      maxStorage: state.bank.maxStorage[c.id],
    }));
    res.json({ success: true, currencies });
  });

  // Get vault items by tab
  app.get("/api/bank-vault/vault", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const tab = (req.query.tab as VaultTab) || "all";
    const state = await getState(userId);
    const items = getVaultItemsByTab(state, tab);
    res.json({ success: true, items, usedSlots: state.vault.usedSlots, maxSlots: state.vault.maxSlots });
  });

  // Add item to vault
  app.post("/api/bank-vault/vault/add", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { item } = req.body;
    if (!item) return res.status(400).json({ message: "Missing item" });
    const state = await getState(userId);
    const result = addToVault(state, item as VaultItem);
    if (result.success) await setState(userId, result.state);
    res.json({ success: result.success, message: result.message });
  });

  // Remove item from vault
  app.post("/api/bank-vault/vault/remove", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { instanceId, quantity } = req.body;
    if (!instanceId) return res.status(400).json({ message: "Missing instanceId" });
    const state = await getState(userId);
    const result = removeFromVault(state, instanceId, quantity || 1);
    if (result.success) await setState(userId, result.state);
    res.json({ success: result.success, message: result.message });
  });

  // Deposit currency
  app.post("/api/bank-vault/deposit", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { currency, amount } = req.body;
    if (!currency || !amount) return res.status(400).json({ message: "Missing currency or amount" });
    const state = await getState(userId);
    const result = depositCurrency(state, currency as CurrencyType, amount);
    if (result.success) await setState(userId, result.state);
    res.json({ success: result.success, message: result.message });
  });

  // Withdraw currency
  app.post("/api/bank-vault/withdraw", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { currency, amount } = req.body;
    if (!currency || !amount) return res.status(400).json({ message: "Missing currency or amount" });
    const state = await getState(userId);
    const result = withdrawCurrency(state, currency as CurrencyType, amount);
    if (result.success) await setState(userId, result.state);
    res.json({ success: result.success, message: result.message });
  });

  // Exchange currency
  app.post("/api/bank-vault/exchange", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { from, to, amount } = req.body;
    if (!from || !to || !amount) return res.status(400).json({ message: "Missing from, to, or amount" });
    const state = await getState(userId);
    const result = exchangeCurrency(state, from as CurrencyType, to as CurrencyType, amount);
    if (result.success) await setState(userId, result.state);
    res.json({ success: result.success, message: result.message });
  });

  // Purchase insurance
  app.post("/api/bank-vault/insurance", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const { item, currency } = req.body;
    if (!item || !currency) return res.status(400).json({ message: "Missing item or currency" });
    const state = await getState(userId);
    const result = purchaseInsurance(state, item as VaultItem, currency as CurrencyType);
    if (result.success) await setState(userId, result.state);
    res.json({ success: result.success, message: result.message });
  });

  // Upgrade vault
  app.post("/api/bank-vault/upgrade-vault", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getState(userId);
    const result = upgradeVault(state);
    if (result.success) await setState(userId, result.state);
    res.json({ success: result.success, message: result.message });
  });

  // Get bank stats
  app.get("/api/bank-vault/stats", async (req: any, res) => {
    const userId = req.user?.id || "dev-user";
    const state = await getState(userId);
    res.json({
      success: true,
      stats: state.stats,
      totalDeposited: state.bank.totalDeposited,
      totalWithdrawn: state.bank.totalWithdrawn,
      totalInterestEarned: state.bank.totalInterestEarned,
      loans: state.bank.loans,
      insurancePolicies: state.insurancePolicies,
    });
  });
}