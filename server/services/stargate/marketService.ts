import { eq } from "drizzle-orm";
import { db } from "../../db";
import { playerStates } from "../../../shared/schema";
import { STARGATE_BALANCE_RULES } from "./balanceRules";
import { appendSystemEvent, buildSystemSnapshot, loadSystemContext, saveSystemContext, type MarketOffer } from "./systemStateService";

export type StrategicMarketItem = "untrained" | "attackTroop" | "defenseTroop";
const MARKET_ITEMS: StrategicMarketItem[] = ["untrained", "attackTroop", "defenseTroop"];
const itemKey: Record<StrategicMarketItem, "untrained" | "attackTroops" | "defenseTroops"> = { untrained: "untrained", attackTroop: "attackTroops", defenseTroop: "defenseTroops" };

function marketCost(item: StrategicMarketItem, quantity: number) {
  const base = item === "untrained" ? STARGATE_BALANCE_RULES.market.exchangeRates.untrained : item === "attackTroop" ? 375 : 450;
  return base * quantity;
}

export async function getMarketState(userId: string) {
  const context = await loadSystemContext(userId);
  const allRows = await db.select().from(playerStates);
  const now = Date.now();
  const offers = allRows.flatMap((row) => {
    const government = row.government && typeof row.government === "object" && !Array.isArray(row.government) ? row.government as Record<string, unknown> : {};
    const systems = government.stargateSystems && typeof government.stargateSystems === "object" ? government.stargateSystems as Record<string, unknown> : {};
    const market = systems.market && typeof systems.market === "object" ? systems.market as Record<string, unknown> : {};
    return Array.isArray(market.offers) ? market.offers : [];
  }).filter((offer): offer is MarketOffer => Boolean(offer && typeof offer === "object" && (offer as MarketOffer).expiresAt > now && (offer as MarketOffer).quantity > 0));
  return {
    ...buildSystemSnapshot(context),
    market: { offers, rates: { ...STARGATE_BALANCE_RULES.market.exchangeRates, attackTroop: 375, defenseTroop: 450 }, mercenaryCapacity: Math.floor(context.units.untrained * STARGATE_BALANCE_RULES.market.mercenaryCapacityRatio) },
  };
}

export async function exchangeMarketUnits(userId: string, item: StrategicMarketItem, quantity: number) {
  if (!MARKET_ITEMS.includes(item)) throw new Error("Unsupported market item");
  const amount = Math.max(1, Math.min(10_000, Math.floor(quantity)));
  const context = await loadSystemContext(userId);
  const cost = marketCost(item, amount);
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for this exchange");
  context.resources.naquadah -= cost;
  const key = itemKey[item];
  context.units[key] = (context.units[key] || 0) + amount;
  context.systems = appendSystemEvent(context.systems, "market.exchange", `Exchanged ${cost.toLocaleString()} Naquadah for ${amount.toLocaleString()} ${item}.`, { item, quantity: amount, cost });
  await saveSystemContext(context);
  return getMarketState(userId);
}

export async function createMarketOffer(userId: string, item: StrategicMarketItem, quantity: number, pricePerUnit: number) {
  if (!MARKET_ITEMS.includes(item)) throw new Error("Unsupported market item");
  const amount = Math.max(1, Math.min(10_000, Math.floor(quantity)));
  const price = Math.max(1, Math.min(1_000_000, Math.floor(pricePerUnit)));
  const context = await loadSystemContext(userId);
  const key = itemKey[item];
  if ((context.units[key] || 0) < amount) throw new Error("Insufficient units for this listing");
  context.units[key] -= amount;
  const createdAt = Date.now();
  const offer: MarketOffer = { id: `offer-${createdAt}-${Math.random().toString(36).slice(2, 8)}`, sellerId: userId, item, quantity: amount, pricePerUnit: price, createdAt, expiresAt: createdAt + STARGATE_BALANCE_RULES.market.privateTradeExpiryHours * 60 * 60 * 1000 };
  context.systems.market = { ...context.systems.market, offers: [offer, ...context.systems.market.offers] };
  context.systems = appendSystemEvent(context.systems, "market.listing", `Listed ${amount.toLocaleString()} ${item} at ${price.toLocaleString()} Naquadah each.`, { offerId: offer.id });
  await saveSystemContext(context);
  return getMarketState(userId);
}

export async function cancelMarketOffer(userId: string, offerId: string) {
  const context = await loadSystemContext(userId);
  const offer = context.systems.market.offers.find((entry) => entry.id === offerId);
  if (!offer) throw new Error("Market offer not found or not owned by this realm");
  const key = itemKey[offer.item];
  context.units[key] = (context.units[key] || 0) + offer.quantity;
  context.systems.market = { ...context.systems.market, offers: context.systems.market.offers.filter((entry) => entry.id !== offerId) };
  context.systems = appendSystemEvent(context.systems, "market.cancel", `Cancelled market offer for ${offer.quantity.toLocaleString()} ${offer.item}.`, { offerId });
  await saveSystemContext(context);
  return getMarketState(userId);
}

export async function purchaseMarketOffer(userId: string, offerId: string, quantity: number) {
  const buyer = await loadSystemContext(userId);
  const amount = Math.max(1, Math.floor(quantity));
  const sellerRow = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).then(() => null);
  void sellerRow;
  const allRows = await db.select().from(playerStates);
  const sellerRecord = allRows.find((row) => {
    const government = row.government && typeof row.government === "object" && !Array.isArray(row.government) ? row.government as Record<string, unknown> : {};
    const systems = government.stargateSystems && typeof government.stargateSystems === "object" ? government.stargateSystems as Record<string, unknown> : {};
    const market = systems.market && typeof systems.market === "object" ? systems.market as Record<string, unknown> : {};
    return Array.isArray(market.offers) && market.offers.some((entry) => entry && typeof entry === "object" && (entry as MarketOffer).id === offerId);
  });
  if (!sellerRecord) throw new Error("Market offer has expired or is unavailable");
  if (sellerRecord.userId === userId) throw new Error("You cannot purchase your own market listing");
  const seller = await loadSystemContext(sellerRecord.userId);
  const offer = seller.systems.market.offers.find((entry) => entry.id === offerId);
  if (!offer || offer.expiresAt <= Date.now()) throw new Error("Market offer has expired");
  if (offer.quantity < amount) throw new Error("Requested quantity exceeds the available listing");
  const total = offer.pricePerUnit * amount;
  if (buyer.resources.naquadah < total) throw new Error("Insufficient Naquadah for this purchase");
  buyer.resources.naquadah -= total;
  buyer.units[itemKey[offer.item]] = (buyer.units[itemKey[offer.item]] || 0) + amount;
  seller.resources.naquadah += total;
  seller.systems.market = { ...seller.systems.market, completedTrades: seller.systems.market.completedTrades + 1, offers: seller.systems.market.offers.map((entry) => entry.id === offerId ? { ...entry, quantity: entry.quantity - amount } : entry).filter((entry) => entry.quantity > 0) };
  buyer.systems = appendSystemEvent(buyer.systems, "market.purchase", `Purchased ${amount.toLocaleString()} ${offer.item} for ${total.toLocaleString()} Naquadah.`, { offerId, sellerId: seller.userId });
  seller.systems = appendSystemEvent(seller.systems, "market.sale", `Sold ${amount.toLocaleString()} ${offer.item} for ${total.toLocaleString()} Naquadah.`, { offerId, buyerId: userId });
  await Promise.all([saveSystemContext(buyer), saveSystemContext(seller)]);
  return getMarketState(userId);
}

export async function recruitMercenaries(userId: string, type: "attackTroop" | "defenseTroop", quantity: number) {
  const amount = Math.max(1, Math.min(5_000, Math.floor(quantity)));
  const context = await loadSystemContext(userId);
  const cap = Math.floor(context.units.untrained * STARGATE_BALANCE_RULES.market.mercenaryCapacityRatio);
  const currentMercenaries = context.units.attackTroops + context.units.defenseTroops;
  if (currentMercenaries + amount > cap + 100) throw new Error("Mercenary capacity is currently exhausted");
  const cost = (type === "attackTroop" ? 650 : 700) * amount;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah for mercenary recruitment");
  context.resources.naquadah -= cost;
  context.units[type === "attackTroop" ? "attackTroops" : "defenseTroops"] += amount;
  context.systems = appendSystemEvent(context.systems, "market.mercenary", `Recruited ${amount.toLocaleString()} ${type} mercenaries.`, { type, quantity: amount, cost });
  await saveSystemContext(context);
  return getMarketState(userId);
}
