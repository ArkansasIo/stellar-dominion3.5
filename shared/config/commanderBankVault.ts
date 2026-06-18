/**
 * COMMANDER BANK & VAULT SYSTEM
 * ============================================================================
 * Centralized storage for resources, equipment, items, and currency.
 * Features shared storage, transfer limits, insurance, and trading.
 *
 * Components:
 *   1. Vault – Secure item storage with capacity limits
 *   2. Bank – Resource storage with interest and lending
 *   3. Item Storage – Equipment and consumable storage
 *   4. Currency Exchange – Convert between currencies
 *   5. Insurance – Protect items from loss
 *   6. Transfer System – Move items between accounts
 *   7. Auction House – Player-to-player trading
 *   8. Storage Upgrades – Expand vault and bank capacity
 */

import type { EquipmentSlot, StatRarity, EquipmentItem } from './equipmentTemperingSystem';
import type { MaterialType } from './smithySystem';

// ============================================================================
// TYPES
// ============================================================================

export type CurrencyType = 'credits' | 'command_seals' | 'prestige_tokens' | 'dark_energy' | 'void_marks';
export type ItemType = 'equipment' | 'material' | 'consumable' | 'blueprint' | 'quest' | 'currency' | 'cosmetic';
export type VaultTab = 'all' | 'equipment' | 'materials' | 'consumables' | 'blueprints' | 'quest_items' | 'cosmetics';

// ============================================================================
// CURRENCIES
// ============================================================================

export interface CurrencyConfig {
  id: CurrencyType;
  name: string;
  description: string;
  icon: string;
  maxStorage: number;
  stackLimit: number;
  source: string;
  exchangeRate: Record<CurrencyType, number>;
}

export const CURRENCIES: CurrencyConfig[] = [
  {
    id: 'credits', name: 'Credits', description: 'Standard galactic currency.', icon: '💰',
    maxStorage: 999999999, stackLimit: 999999999, source: 'Missions, Trading, Mining',
    exchangeRate: { credits: 1, command_seals: 0.01, prestige_tokens: 0.001, dark_energy: 0.0001, void_marks: 0.00001 },
  },
  {
    id: 'command_seals', name: 'Command Seals', description: 'Used for gacha pulls and commander recruitment.', icon: '🎖️',
    maxStorage: 99999, stackLimit: 99999, source: 'Daily Login, Achievements, Events',
    exchangeRate: { credits: 100, command_seals: 1, prestige_tokens: 0.1, dark_energy: 0.01, void_marks: 0.001 },
  },
  {
    id: 'prestige_tokens', name: 'Prestige Tokens', description: 'Earned from high-ranking battle victories.', icon: '🏅',
    maxStorage: 99999, stackLimit: 99999, source: 'Battle Victories, Rankings, Events',
    exchangeRate: { credits: 1000, command_seals: 10, prestige_tokens: 1, dark_energy: 0.1, void_marks: 0.01 },
  },
  {
    id: 'dark_energy', name: 'Dark Energy', description: 'Exotic currency from void rifts.', icon: '🌑',
    maxStorage: 99999, stackLimit: 99999, source: 'Void Rifts, Expeditions, Special Events',
    exchangeRate: { credits: 10000, command_seals: 100, prestige_tokens: 10, dark_energy: 1, void_marks: 0.1 },
  },
  {
    id: 'void_marks', name: 'Void Marks', description: 'Rarest currency from deep void exploration.', icon: '🌀',
    maxStorage: 9999, stackLimit: 9999, source: 'Deep Void Expeditions, Legendary Events',
    exchangeRate: { credits: 100000, command_seals: 1000, prestige_tokens: 100, dark_energy: 10, void_marks: 1 },
  },
];

// ============================================================================
// VAULT ITEMS
// ============================================================================

export interface VaultItem {
  id: string;
  instanceId: string;
  type: ItemType;
  name: string;
  description: string;
  icon: string;
  rarity: StatRarity;
  quantity: number;
  maxStack: number;
  isBound: boolean;
  isInsured: boolean;
  insuranceCost: number;
  acquiredAt: number;
  expiresAt: number | null;
  metadata: Record<string, any>;
}

// ============================================================================
// VAULT STATE
// ============================================================================

export interface VaultState {
  items: VaultItem[];
  maxSlots: number;
  usedSlots: number;
  tabs: VaultTab[];
  lockedSlots: number;
  sortPreference: string;
  filterPreferences: Record<string, any>;
}

export interface BankState {
  currencies: Record<CurrencyType, number>;
  maxStorage: Record<CurrencyType, number>;
  interestRate: number;
  lastInterestTick: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalInterestEarned: number;
  loans: { id: string; amount: number; currency: CurrencyType; interestRate: number; takenAt: number; dueAt: number }[];
  maxLoans: number;
}

export interface InsurancePolicy {
  id: string;
  itemInstanceId: string;
  premium: number;
  currency: CurrencyType;
  coverageAmount: number;
  purchasedAt: number;
  expiresAt: number;
  isActive: boolean;
}

export interface TransferRecord {
  id: string;
  fromUserId: string;
  toUserId: string;
  items: { instanceId: string; quantity: number }[];
  currencies: { type: CurrencyType; amount: number }[];
  timestamp: number;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  fee: number;
}

export interface AuctionListing {
  id: string;
  sellerId: string;
  item: VaultItem;
  startingPrice: number;
  currentBid: number;
  buyoutPrice: number;
  currency: CurrencyType;
  bidHistory: { bidderId: string; amount: number; timestamp: number }[];
  listedAt: number;
  expiresAt: number;
  status: 'active' | 'sold' | 'expired' | 'cancelled';
}

export interface CommanderBankVaultState {
  vault: VaultState;
  bank: BankState;
  insurancePolicies: InsurancePolicy[];
  transferHistory: TransferRecord[];
  auctionListings: AuctionListing[];
  storageUpgrades: {
    vaultSlots: number;
    bankCapacity: number;
    insuranceSlots: number;
    transferSlots: number;
  };
  stats: {
    totalItemsStored: number;
    totalValueStored: number;
    totalTransfers: number;
    totalAuctions: number;
    totalInsuranceClaims: number;
  };
}

// ============================================================================
// DEFAULT STATE
// ============================================================================

export function getDefaultBankVaultState(): CommanderBankVaultState {
  const currencies: Record<CurrencyType, number> = { credits: 0, command_seals: 0, prestige_tokens: 0, dark_energy: 0, void_marks: 0 };
  const maxStorage: Record<CurrencyType, number> = { credits: 1000000, command_seals: 1000, prestige_tokens: 100, dark_energy: 50, void_marks: 10 };
  return {
    vault: { items: [], maxSlots: 50, usedSlots: 0, tabs: ['all', 'equipment', 'materials', 'consumables', 'blueprints', 'quest_items', 'cosmetics'], lockedSlots: 0, sortPreference: 'rarity', filterPreferences: {} },
    bank: { currencies, maxStorage, interestRate: 0.01, lastInterestTick: Date.now(), totalDeposited: 0, totalWithdrawn: 0, totalInterestEarned: 0, loans: [], maxLoans: 3 },
    insurancePolicies: [],
    transferHistory: [],
    auctionListings: [],
    storageUpgrades: { vaultSlots: 0, bankCapacity: 0, insuranceSlots: 0, transferSlots: 0 },
    stats: { totalItemsStored: 0, totalValueStored: 0, totalTransfers: 0, totalAuctions: 0, totalInsuranceClaims: 0 },
  };
}

// ============================================================================
// GAME LOGIC
// ============================================================================

/**
 * Calculate vault capacity after upgrades.
 */
export function calculateVaultCapacity(upgradeLevel: number): number {
  return 50 + upgradeLevel * 10;
}

/**
 * Calculate bank storage capacity after upgrades.
 */
export function calculateBankCapacity(currency: CurrencyType, upgradeLevel: number): number {
  const base: Record<CurrencyType, number> = { credits: 1000000, command_seals: 1000, prestige_tokens: 100, dark_energy: 50, void_marks: 10 };
  return Math.floor(base[currency] * Math.pow(1.5, upgradeLevel));
}

/**
 * Calculate insurance premium for an item.
 */
export function calculateInsurancePremium(item: VaultItem, currency: CurrencyType): number {
  const rarityMultiplier: Record<StatRarity, number> = { common: 1, uncommon: 2, rare: 4, epic: 8, legendary: 16, mythic: 32 };
  const baseValue = (item.metadata as any)?.value || 100;
  return Math.floor(baseValue * rarityMultiplier[item.rarity] * 0.1);
}

/**
 * Calculate transfer fee.
 */
export function calculateTransferFee(items: VaultItem[], currencies: { type: CurrencyType; amount: number }[]): number {
  let totalValue = 0;
  for (const item of items) {
    totalValue += (item.metadata as any)?.value || 100;
  }
  for (const cur of currencies) {
    totalValue += cur.amount * 0.01;
  }
  return Math.floor(totalValue * 0.05); // 5% fee
}

/**
 * Process bank interest.
 */
export function processBankInterest(state: CommanderBankVaultState): CommanderBankVaultState {
  const now = Date.now();
  const timePassed = (now - state.bank.lastInterestTick) / (1000 * 60 * 60); // hours
  if (timePassed < 1) return state;
  const newState = { ...state, bank: { ...state.bank } };
  let totalInterest = 0;
  for (const cur of CURRENCIES) {
    const balance = newState.bank.currencies[cur.id];
    const interest = Math.floor(balance * newState.bank.interestRate * timePassed);
    if (interest > 0) {
      newState.bank.currencies[cur.id] = Math.min(
        newState.bank.maxStorage[cur.id],
        balance + interest
      );
      totalInterest += interest;
    }
  }
  newState.bank.lastInterestTick = now;
  newState.bank.totalInterestEarned += totalInterest;
  return newState;
}

/**
 * Process loan interest and check for defaults.
 */
export function processLoans(state: CommanderBankVaultState): CommanderBankVaultState {
  const now = Date.now();
  const newState = { ...state, bank: { ...state.bank, loans: [...state.bank.loans] } };
  const activeLoans = newState.bank.loans.filter(l => l.dueAt > now);
  const defaultedLoans = newState.bank.loans.filter(l => l.dueAt <= now);
  // Apply interest to active loans
  for (let i = 0; i < newState.bank.loans.length; i++) {
    const loan = newState.bank.loans[i];
    if (loan.dueAt > now) {
      const timePassed = (now - loan.takenAt) / (1000 * 60 * 60 * 24); // days
      const interest = Math.floor(loan.amount * loan.interestRate * timePassed);
      newState.bank.loans[i] = { ...loan, amount: loan.amount + interest };
    }
  }
  // Remove defaulted loans (penalty: lose 10% of max currency)
  for (const defaulted of defaultedLoans) {
    const penalty = Math.floor(newState.bank.maxStorage[defaulted.currency] * 0.1);
    newState.bank.currencies[defaulted.currency] = Math.max(0, newState.bank.currencies[defaulted.currency] - penalty);
  }
  newState.bank.loans = activeLoans;
  return newState;
}

/**
 * Add item to vault.
 */
export function addToVault(state: CommanderBankVaultState, item: VaultItem): { success: boolean; state: CommanderBankVaultState; message: string } {
  if (state.vault.usedSlots >= state.vault.maxSlots) {
    return { success: false, state, message: 'Vault is full' };
  }
  // Check for stackable item
  const existing = state.vault.items.find(i => i.id === item.id && i.quantity < i.maxStack && !i.isBound);
  if (existing) {
    const canAdd = existing.maxStack - existing.quantity;
    const toAdd = Math.min(item.quantity, canAdd);
    const newItems = state.vault.items.map(i =>
      i.instanceId === existing.instanceId ? { ...i, quantity: i.quantity + toAdd } : i
    );
    const remaining = item.quantity - toAdd;
    if (remaining > 0) {
      newItems.push({ ...item, quantity: remaining });
      return { success: true, state: { ...state, vault: { ...state.vault, items: newItems, usedSlots: state.vault.usedSlots + 1 } }, message: `Added ${toAdd} to stack, ${remaining} remaining` };
    }
    return { success: true, state: { ...state, vault: { ...state.vault, items: newItems } }, message: `Added ${toAdd} to existing stack` };
  }
  return { success: true, state: { ...state, vault: { ...state.vault, items: [...state.vault.items, item], usedSlots: state.vault.usedSlots + 1 } }, message: 'Item added to vault' };
}

/**
 * Remove item from vault.
 */
export function removeFromVault(state: CommanderBankVaultState, instanceId: string, quantity: number): { success: boolean; state: CommanderBankVaultState; message: string } {
  const item = state.vault.items.find(i => i.instanceId === instanceId);
  if (!item) return { success: false, state, message: 'Item not found' };
  if (item.quantity < quantity) return { success: false, state, message: 'Insufficient quantity' };
  if (item.isBound) return { success: false, state, message: 'Item is bound and cannot be removed' };
  const newQuantity = item.quantity - quantity;
  if (newQuantity <= 0) {
    const newItems = state.vault.items.filter(i => i.instanceId !== instanceId);
    return { success: true, state: { ...state, vault: { ...state.vault, items: newItems, usedSlots: state.vault.usedSlots - 1 } }, message: 'Item removed' };
  }
  const newItems = state.vault.items.map(i => i.instanceId === instanceId ? { ...i, quantity: newQuantity } : i);
  return { success: true, state: { ...state, vault: { ...state.vault, items: newItems } }, message: `Removed ${quantity}` };
}

/**
 * Deposit currency to bank.
 */
export function depositCurrency(state: CommanderBankVaultState, currency: CurrencyType, amount: number): { success: boolean; state: CommanderBankVaultState; message: string } {
  const available = state.bank.maxStorage[currency] - state.bank.currencies[currency];
  const toDeposit = Math.min(amount, available);
  if (toDeposit <= 0) return { success: false, state, message: 'Bank storage full' };
  const newState = { ...state, bank: { ...state.bank, currencies: { ...state.bank.currencies, [currency]: state.bank.currencies[currency] + toDeposit }, totalDeposited: state.bank.totalDeposited + toDeposit } };
  return { success: true, state: newState, message: `Deposited ${toDeposit} ${currency}` };
}

/**
 * Withdraw currency from bank.
 */
export function withdrawCurrency(state: CommanderBankVaultState, currency: CurrencyType, amount: number): { success: boolean; state: CommanderBankVaultState; message: string } {
  if (state.bank.currencies[currency] < amount) return { success: false, state, message: 'Insufficient funds' };
  const newState = { ...state, bank: { ...state.bank, currencies: { ...state.bank.currencies, [currency]: state.bank.currencies[currency] - amount }, totalWithdrawn: state.bank.totalWithdrawn + amount } };
  return { success: true, state: newState, message: `Withdrew ${amount} ${currency}` };
}

/**
 * Exchange currency.
 */
export function exchangeCurrency(state: CommanderBankVaultState, from: CurrencyType, to: CurrencyType, amount: number): { success: boolean; state: CommanderBankVaultState; message: string } {
  const fromConfig = CURRENCIES.find(c => c.id === from);
  if (!fromConfig) return { success: false, state, message: 'Invalid source currency' };
  if (state.bank.currencies[from] < amount) return { success: false, state, message: 'Insufficient funds' };
  const received = Math.floor(amount * fromConfig.exchangeRate[to]);
  if (received <= 0) return { success: false, state, message: 'Exchange rate too low' };
  const newState = { ...state, bank: { ...state.bank, currencies: { ...state.bank.currencies, [from]: state.bank.currencies[from] - amount, [to]: Math.min(state.bank.maxStorage[to], state.bank.currencies[to] + received) } } };
  return { success: true, state: newState, message: `Exchanged ${amount} ${from} for ${received} ${to}` };
}

/**
 * Purchase insurance for an item.
 */
export function purchaseInsurance(state: CommanderBankVaultState, item: VaultItem, currency: CurrencyType): { success: boolean; state: CommanderBankVaultState; message: string } {
  const premium = calculateInsurancePremium(item, currency);
  if (state.bank.currencies[currency] < premium) return { success: false, state, message: 'Insufficient funds' };
  const policy: InsurancePolicy = {
    id: `ins-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    itemInstanceId: item.instanceId,
    premium,
    currency,
    coverageAmount: premium * 10,
    purchasedAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    isActive: true,
  };
  const newState = { ...state, bank: { ...state.bank, currencies: { ...state.bank.currencies, [currency]: state.bank.currencies[currency] - premium } }, insurancePolicies: [...state.insurancePolicies, policy] };
  return { success: true, state: newState, message: `Insurance purchased for ${premium} ${currency}` };
}

/**
 * Upgrade vault capacity.
 */
export function upgradeVault(state: CommanderBankVaultState): { success: boolean; state: CommanderBankVaultState; message: string } {
  const currentLevel = state.storageUpgrades.vaultSlots;
  const cost = Math.floor(5000 * Math.pow(2, currentLevel));
  if (state.bank.currencies.credits < cost) return { success: false, state, message: `Insufficient credits (need ${cost})` };
  const newLevel = currentLevel + 1;
  const newCapacity = calculateVaultCapacity(newLevel);
  const newState = {
    ...state,
    bank: { ...state.bank, currencies: { ...state.bank.currencies, credits: state.bank.currencies.credits - cost } },
    storageUpgrades: { ...state.storageUpgrades, vaultSlots: newLevel },
    vault: { ...state.vault, maxSlots: newCapacity },
  };
  return { success: true, state: newState, message: `Vault upgraded to ${newCapacity} slots` };
}

/**
 * Get vault items filtered by tab.
 */
export function getVaultItemsByTab(state: CommanderBankVaultState, tab: VaultTab): VaultItem[] {
  if (tab === 'all') return state.vault.items;
  const typeMap: Record<string, ItemType> = {
    equipment: 'equipment', materials: 'material', consumables: 'consumable',
    blueprints: 'blueprint', quest_items: 'quest', cosmetics: 'cosmetic',
  };
  const targetType = typeMap[tab];
  return state.vault.items.filter(i => i.type === targetType);
}

/**
 * Calculate total vault value.
 */
export function calculateTotalVaultValue(state: CommanderBankVaultState): number {
  let total = 0;
  for (const item of state.vault.items) {
    total += ((item.metadata as any)?.value || 100) * item.quantity;
  }
  for (const cur of CURRENCIES) {
    total += state.bank.currencies[cur.id] * cur.exchangeRate.credits;
  }
  return total;
}