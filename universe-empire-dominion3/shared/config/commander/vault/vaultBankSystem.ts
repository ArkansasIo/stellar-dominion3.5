/**
 * VAULT & BANK SYSTEM
 * ============================================================================
 * Secure storage for currency, resources, items, and equipment.
 * Features:
 *   - Multi-tab storage (Credits, Resources, Items, Equipment, Special)
 *   - Upgradeable vault capacity
 *   - Interest on stored credits
 *   - Transfer logs and security
 *   - Vault insurance against theft
 *   - Shared storage for alliance members
 */

// ============================================================================
// CURRENCY TYPES
// ============================================================================

export type CurrencyType =
  | 'credits' | 'darkMatter' | 'antimatter' | 'voidShards'
  | 'stellarEssence' | 'cosmicDust' | 'commandTokens' | 'prestigePoints';

export interface CurrencyConfig {
  id: CurrencyType;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxStorage: number;
  stackLimit: number;
  tradeable: boolean;
  droppable: boolean;
}

export const CURRENCIES: CurrencyConfig[] = [
  { id: 'credits', name: 'Credits', description: 'Universal currency for trade.', icon: '💰', color: '#fbbf24', maxStorage: 999999999, stackLimit: 999999999, tradeable: true, droppable: true },
  { id: 'darkMatter', name: 'Dark Matter', description: 'Exotic currency for premium upgrades.', icon: '🌑', color: '#8b5cf6', maxStorage: 999999, stackLimit: 999999, tradeable: false, droppable: false },
  { id: 'antimatter', name: 'Antimatter', description: 'Rare currency for legendary items.', icon: '⚡', color: '#06b6d4', maxStorage: 999999, stackLimit: 999999, tradeable: false, droppable: false },
  { id: 'voidShards', name: 'Void Shards', description: 'Currency from void rifts.', icon: '🌀', color: '#a855f7', maxStorage: 999999, stackLimit: 999999, tradeable: true, droppable: false },
  { id: 'stellarEssence', name: 'Stellar Essence', description: 'Essence from dying stars.', icon: '⭐', color: '#f59e0b', maxStorage: 999999, stackLimit: 999999, tradeable: false, droppable: false },
  { id: 'cosmicDust', name: 'Cosmic Dust', description: 'Fine particles from cosmic events.', icon: '✨', color: '#e2e8f0', maxStorage: 9999999, stackLimit: 9999999, tradeable: true, droppable: true },
  { id: 'commandTokens', name: 'Command Tokens', description: 'Tokens for commander recruitment.', icon: '🎖️', color: '#ef4444', maxStorage: 99999, stackLimit: 99999, tradeable: false, droppable: false },
  { id: 'prestigePoints', name: 'Prestige Points', description: 'Points earned from achievements.', icon: '🏆', color: '#10b981', maxStorage: 99999999, stackLimit: 99999999, tradeable: false, droppable: false },
];

// ============================================================================
// RESOURCE TYPES
// ============================================================================

export type ResourceType =
  | 'metal' | 'crystal' | 'deuterium' | 'plasma' | 'titanium'
  | 'quantumFiber' | 'neutronium' | 'voidCrystal' | 'stellarAlloy' | 'cosmicAlloy';

export interface ResourceConfig {
  id: ResourceType;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxStorage: number;
  stackLimit: number;
  tradeable: boolean;
  baseValue: number;
}

export const RESOURCES: ResourceConfig[] = [
  { id: 'metal', name: 'Metal', description: 'Basic structural material.', icon: '🔩', color: '#9ca3af', maxStorage: 999999999, stackLimit: 999999999, tradeable: true, baseValue: 1 },
  { id: 'crystal', name: 'Crystal', description: 'Energy conductor material.', icon: '💎', color: '#3b82f6', maxStorage: 999999999, stackLimit: 999999999, tradeable: true, baseValue: 2 },
  { id: 'deuterium', name: 'Deuterium', description: 'Fuel for warp drives.', icon: '⛽', color: '#10b981', maxStorage: 999999999, stackLimit: 999999999, tradeable: true, baseValue: 3 },
  { id: 'plasma', name: 'Plasma', description: 'Superheated ionized gas.', icon: '🔥', color: '#ef4444', maxStorage: 999999999, stackLimit: 999999999, tradeable: true, baseValue: 5 },
  { id: 'titanium', name: 'Titanium', description: 'Ultra-strong structural metal.', icon: '🛡️', color: '#6b7280', maxStorage: 999999999, stackLimit: 999999999, tradeable: true, baseValue: 10 },
  { id: 'quantumFiber', name: 'Quantum Fiber', description: 'Quantum-enhanced material.', icon: '🧵', color: '#8b5cf6', maxStorage: 999999999, stackLimit: 999999999, tradeable: true, baseValue: 15 },
  { id: 'neutronium', name: 'Neutronium', description: 'Ultra-dense material.', icon: '⚫', color: '#1f2937', maxStorage: 999999999, stackLimit: 999999999, tradeable: true, baseValue: 25 },
  { id: 'voidCrystal', name: 'Void Crystal', description: 'Crystallized void energy.', icon: '🔮', color: '#a855f7', maxStorage: 999999999, stackLimit: 999999999, tradeable: false, baseValue: 50 },
  { id: 'stellarAlloy', name: 'Stellar Alloy', description: 'Alloy forged from stars.', icon: '🌟', color: '#f59e0b', maxStorage: 999999999, stackLimit: 999999999, tradeable: false, baseValue: 75 },
  { id: 'cosmicAlloy', name: 'Cosmic Alloy', description: 'Alloy from cosmic events.', icon: '🌌', color: '#06b6d4', maxStorage: 999999999, stackLimit: 999999999, tradeable: false, baseValue: 100 },
];

// ============================================================================
// VAULT TABS
// ============================================================================

export type VaultTab = 'currency' | 'resources' | 'items' | 'equipment' | 'special' | 'shared';

export interface VaultTabConfig {
  id: VaultTab;
  name: string;
  description: string;
  icon: string;
  color: string;
  baseCapacity: number;
  upgradeCostMultiplier: number;
  maxUpgradeLevel: number;
}

export const VAULT_TABS: VaultTabConfig[] = [
  { id: 'currency', name: 'Currency Vault', description: 'Store credits and premium currencies.', icon: '💰', color: '#fbbf24', baseCapacity: 100, upgradeCostMultiplier: 2.0, maxUpgradeLevel: 50 },
  { id: 'resources', name: 'Resource Warehouse', description: 'Store metals, crystals, and materials.', icon: '📦', color: '#3b82f6', baseCapacity: 200, upgradeCostMultiplier: 1.8, maxUpgradeLevel: 50 },
  { id: 'items', name: 'Item Storage', description: 'Store consumables, blueprints, and components.', icon: '🎒', color: '#22c55e', baseCapacity: 150, upgradeCostMultiplier: 2.2, maxUpgradeLevel: 40 },
  { id: 'equipment', name: 'Equipment Locker', description: 'Store weapons, armor, and modules.', icon: '⚔️', color: '#ef4444', baseCapacity: 100, upgradeCostMultiplier: 2.5, maxUpgradeLevel: 30 },
  { id: 'special', name: 'Special Vault', description: 'Store rare and unique items.', icon: '🔮', color: '#a855f7', baseCapacity: 50, upgradeCostMultiplier: 3.0, maxUpgradeLevel: 20 },
  { id: 'shared', name: 'Alliance Vault', description: 'Shared storage for alliance members.', icon: '🤝', color: '#10b981', baseCapacity: 100, upgradeCostMultiplier: 2.0, maxUpgradeLevel: 30 },
];

// ============================================================================
// VAULT STATE
// ============================================================================

export interface VaultItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  type: string;
  quantity: number;
  maxStack: number;
  isBound: boolean;
  tradeable: boolean;
  obtainedAt: number;
  metadata?: Record<string, any>;
}

export interface VaultTabState {
  level: number;
  capacity: number;
  items: VaultItem[];
  isLocked: boolean;
}

export interface VaultState {
  currency: Record<CurrencyType, number>;
  resources: Record<ResourceType, number>;
  tabs: Record<VaultTab, VaultTabState>;
  totalItemsStored: number;
  lastInterestPayment: number;
  insuranceActive: boolean;
  insuranceExpiry: number;
  sharedAccess: string[];
  transactionLog: VaultTransaction[];
}

export interface VaultTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'trade' | 'interest' | 'theft' | 'insurance';
  amount: number;
  currency?: CurrencyType;
  resource?: ResourceType;
  itemId?: string;
  itemName?: string;
  timestamp: number;
  note: string;
}

// ============================================================================
// VAULT FUNCTIONS
// ============================================================================

export function createDefaultVaultState(): VaultState {
  const currency: Record<CurrencyType, number> = {} as any;
  for (const c of CURRENCIES) currency[c.id] = 0;

  const resources: Record<ResourceType, number> = {} as any;
  for (const r of RESOURCES) resources[r.id] = 0;

  const tabs: Record<VaultTab, VaultTabState> = {} as any;
  for (const tab of VAULT_TABS) {
    tabs[tab.id] = {
      level: 1,
      capacity: tab.baseCapacity,
      items: [],
      isLocked: false,
    };
  }

  return {
    currency,
    resources,
    tabs,
    totalItemsStored: 0,
    lastInterestPayment: Date.now(),
    insuranceActive: false,
    insuranceExpiry: 0,
    sharedAccess: [],
    transactionLog: [],
  };
}

/** Calculate vault capacity for a tab at given level */
export function getVaultCapacity(tab: VaultTab, level: number): number {
  const config = VAULT_TABS.find(t => t.id === tab);
  if (!config) return 0;
  return Math.floor(config.baseCapacity * Math.pow(1.5, level - 1));
}

/** Calculate upgrade cost for a vault tab */
export function getVaultUpgradeCost(tab: VaultTab, currentLevel: number): { credits: number; darkMatter: number } {
  const config = VAULT_TABS.find(t => t.id === tab);
  if (!config) return { credits: 0, darkMatter: 0 };
  return {
    credits: Math.floor(10000 * Math.pow(config.upgradeCostMultiplier, currentLevel)),
    darkMatter: Math.floor(5 * currentLevel),
  };
}

/** Upgrade vault tab capacity */
export function upgradeVaultTab(state: VaultState, tab: VaultTab): { success: boolean; newState: VaultState; message: string } {
  const config = VAULT_TABS.find(t => t.id === tab);
  const tabState = state.tabs[tab];

  if (!config || !tabState) return { success: false, newState: state, message: 'Invalid vault tab' };
  if (tabState.level >= config.maxUpgradeLevel) return { success: false, newState: state, message: 'Maximum level reached' };

  const cost = getVaultUpgradeCost(tab, tabState.level);
  if (state.currency.credits < cost.credits) return { success: false, newState: state, message: 'Insufficient credits' };
  if (state.currency.darkMatter < cost.darkMatter) return { success: false, newState: state, message: 'Insufficient dark matter' };

  const newState = { ...state, currency: { ...state.currency }, tabs: { ...state.tabs } };
  newState.currency.credits -= cost.credits;
  newState.currency.darkMatter -= cost.darkMatter;

  const newLevel = tabState.level + 1;
  newState.tabs[tab] = {
    ...tabState,
    level: newLevel,
    capacity: getVaultCapacity(tab, newLevel),
  };

  return { success: true, newState, message: `${config.name} upgraded to level ${newLevel}` };
}

/** Deposit currency into vault */
export function depositCurrency(state: VaultState, currency: CurrencyType, amount: number): { success: boolean; newState: VaultState; message: string } {
  const config = CURRENCIES.find(c => c.id === currency);
  if (!config) return { success: false, newState: state, message: 'Invalid currency' };

  const newAmount = state.currency[currency] + amount;
  if (newAmount > config.maxStorage) return { success: false, newState: state, message: 'Vault capacity exceeded' };

  const newState = { ...state, currency: { ...state.currency }, transactionLog: [...state.transactionLog] };
  newState.currency[currency] = newAmount;
  newState.transactionLog.push({
    id: `txn_${Date.now()}`,
    type: 'deposit',
    amount,
    currency,
    timestamp: Date.now(),
    note: `Deposited ${amount} ${config.name}`,
  });

  return { success: true, newState, message: `Deposited ${amount} ${config.name}` };
}

/** Withdraw currency from vault */
export function withdrawCurrency(state: VaultState, currency: CurrencyType, amount: number): { success: boolean; newState: VaultState; message: string } {
  if (state.currency[currency] < amount) return { success: false, newState: state, message: 'Insufficient funds' };

  const config = CURRENCIES.find(c => c.id === currency);
  const newState = { ...state, currency: { ...state.currency }, transactionLog: [...state.transactionLog] };
  newState.currency[currency] -= amount;
  newState.transactionLog.push({
    id: `txn_${Date.now()}`,
    type: 'withdraw',
    amount,
    currency,
    timestamp: Date.now(),
    note: `Withdrew ${amount} ${config?.name || currency}`,
  });

  return { success: true, newState, message: `Withdrew ${amount} ${config?.name || currency}` };
}

/** Deposit resource into vault */
export function depositResource(state: VaultState, resource: ResourceType, amount: number): { success: boolean; newState: VaultState; message: string } {
  const config = RESOURCES.find(r => r.id === resource);
  if (!config) return { success: false, newState: state, message: 'Invalid resource' };

  const tabState = state.tabs.resources;
  const currentTotal = tabState.items.reduce((sum, item) => sum + item.quantity, 0);
  if (currentTotal + amount > tabState.capacity) return { success: false, newState: state, message: 'Resource warehouse full' };

  const newState = { ...state, resources: { ...state.resources }, tabs: { ...state.tabs }, transactionLog: [...state.transactionLog] };
  newState.resources[resource] += amount;
  newState.transactionLog.push({
    id: `txn_${Date.now()}`,
    type: 'deposit',
    amount,
    resource,
    timestamp: Date.now(),
    note: `Deposited ${amount} ${config.name}`,
  });

  return { success: true, newState, message: `Deposited ${amount} ${config.name}` };
}

/** Withdraw resource from vault */
export function withdrawResource(state: VaultState, resource: ResourceType, amount: number): { success: boolean; newState: VaultState; message: string } {
  if (state.resources[resource] < amount) return { success: false, newState: state, message: 'Insufficient resources' };

  const config = RESOURCES.find(r => r.id === resource);
  const newState = { ...state, resources: { ...state.resources }, transactionLog: [...state.transactionLog] };
  newState.resources[resource] -= amount;
  newState.transactionLog.push({
    id: `txn_${Date.now()}`,
    type: 'withdraw',
    amount,
    resource,
    timestamp: Date.now(),
    note: `Withdrew ${amount} ${config?.name || resource}`,
  });

  return { success: true, newState, message: `Withdrew ${amount} ${config?.name || resource}` };
}

/** Add item to vault */
export function addItemToVault(state: VaultState, tab: VaultTab, item: VaultItem): { success: boolean; newState: VaultState; message: string } {
  const tabState = state.tabs[tab];
  if (!tabState) return { success: false, newState: state, message: 'Invalid vault tab' };
  if (tabState.items.length >= tabState.capacity) return { success: false, newState: state, message: 'Vault tab full' };

  const existingItem = tabState.items.find(i => i.id === item.id && i.quantity < item.maxStack);
  const newState = { ...state, tabs: { ...state.tabs }, transactionLog: [...state.transactionLog] };

  if (existingItem) {
    const addAmount = Math.min(item.quantity, item.maxStack - existingItem.quantity);
    newState.tabs[tab] = {
      ...tabState,
      items: tabState.items.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + addAmount } : i
      ),
    };
  } else {
    newState.tabs[tab] = {
      ...tabState,
      items: [...tabState.items, item],
    };
  }

  newState.totalItemsStored += item.quantity;
  newState.transactionLog.push({
    id: `txn_${Date.now()}`,
    type: 'deposit',
    amount: item.quantity,
    itemId: item.id,
    itemName: item.name,
    timestamp: Date.now(),
    note: `Stored ${item.quantity}x ${item.name}`,
  });

  return { success: true, newState, message: `Stored ${item.quantity}x ${item.name}` };
}

/** Remove item from vault */
export function removeItemFromVault(state: VaultState, tab: VaultTab, itemId: string, quantity: number): { success: boolean; newState: VaultState; message: string } {
  const tabState = state.tabs[tab];
  if (!tabState) return { success: false, newState: state, message: 'Invalid vault tab' };

  const item = tabState.items.find(i => i.id === itemId);
  if (!item) return { success: false, newState: state, message: 'Item not found' };
  if (item.quantity < quantity) return { success: false, newState: state, message: 'Insufficient quantity' };

  const newState = { ...state, tabs: { ...state.tabs }, transactionLog: [...state.transactionLog] };

  if (item.quantity === quantity) {
    newState.tabs[tab] = {
      ...tabState,
      items: tabState.items.filter(i => i.id !== itemId),
    };
  } else {
    newState.tabs[tab] = {
      ...tabState,
      items: tabState.items.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
      ),
    };
  }

  newState.totalItemsStored -= quantity;
  newState.transactionLog.push({
    id: `txn_${Date.now()}`,
    type: 'withdraw',
    amount: quantity,
    itemId: item.id,
    itemName: item.name,
    timestamp: Date.now(),
    note: `Withdrew ${quantity}x ${item.name}`,
  });

  return { success: true, newState, message: `Withdrew ${quantity}x ${item.name}` };
}

/** Calculate interest on stored credits */
export function calculateInterest(state: VaultState): number {
  const credits = state.currency.credits;
  const interestRate = 0.01;
  const hoursSinceLastPayment = (Date.now() - state.lastInterestPayment) / (1000 * 60 * 60);
  return Math.floor(credits * interestRate * Math.min(hoursSinceLastPayment / 24, 1));
}

/** Apply interest payment */
export function applyInterest(state: VaultState): { success: boolean; newState: VaultState; message: string } {
  const interest = calculateInterest(state);
  if (interest <= 0) return { success: false, newState: state, message: 'No interest to collect' };

  const newState = { ...state, currency: { ...state.currency }, transactionLog: [...state.transactionLog] };
  newState.currency.credits += interest;
  newState.lastInterestPayment = Date.now();
  newState.transactionLog.push({
    id: `txn_${Date.now()}`,
    type: 'interest',
    amount: interest,
    currency: 'credits',
    timestamp: Date.now(),
    note: `Interest payment: +${interest} credits`,
  });

  return { success: true, newState, message: `Collected ${interest} credits interest` };
}

/** Activate vault insurance */
export function activateInsurance(state: VaultState, durationDays: number): { success: boolean; newState: VaultState; message: string } {
  const cost = durationDays * 1000;
  if (state.currency.credits < cost) return { success: false, newState: state, message: 'Insufficient credits' };

  const newState = { ...state, currency: { ...state.currency } };
  newState.currency.credits -= cost;
  newState.insuranceActive = true;
  newState.insuranceExpiry = Date.now() + durationDays * 24 * 60 * 60 * 1000;

  return { success: true, newState, message: `Insurance activated for ${durationDays} days` };
}

/** Get vault statistics */
export function getVaultStats(state: VaultState): {
  totalCredits: number;
  totalResources: number;
  totalItems: number;
  totalValue: number;
  tabsUsed: number;
  tabsTotal: number;
} {
  let totalCredits = 0;
  for (const c of CURRENCIES) totalCredits += state.currency[c.id];

  let totalResources = 0;
  for (const r of RESOURCES) totalResources += state.resources[r.id];

  let totalItems = 0;
  let totalValue = 0;
  let tabsUsed = 0;

  for (const tab of VAULT_TABS) {
    const tabState = state.tabs[tab.id];
    if (tabState.items.length > 0) tabsUsed++;
    totalItems += tabState.items.length;
    for (const item of tabState.items) totalValue += item.quantity;
  }

  return {
    totalCredits,
    totalResources,
    totalItems,
    totalValue,
    tabsUsed,
    tabsTotal: VAULT_TABS.length,
  };
}

/** Get full vault summary for display */
export function getVaultSummary(state: VaultState): {
  currency: { name: string; amount: string; icon: string; color: string }[];
  resources: { name: string; amount: string; icon: string; color: string }[];
  tabs: { name: string; used: number; capacity: number; level: number; icon: string; color: string }[];
  stats: ReturnType<typeof getVaultStats>;
} {
  const currency = CURRENCIES.map(c => ({
    name: c.name,
    amount: state.currency[c.id].toLocaleString(),
    icon: c.icon,
    color: c.color,
  }));

  const resources = RESOURCES.map(r => ({
    name: r.name,
    amount: state.resources[r.id].toLocaleString(),
    icon: r.icon,
    color: r.color,
  }));

  const tabs = VAULT_TABS.map(t => {
    const tabState = state.tabs[t.id];
    return {
      name: t.name,
      used: tabState.items.length,
      capacity: tabState.capacity,
      level: tabState.level,
      icon: t.icon,
      color: t.color,
    };
  });

  return { currency, resources, tabs, stats: getVaultStats(state) };
}
