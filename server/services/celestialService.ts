import { db } from "../db";
import { eq, and, sql, desc } from "drizzle-orm";
import { playerStates, scanCooldowns, celestialMarketplace } from "../../shared/schema";

const CELESTIAL_TYPES = {
  planet: {
    types: ["terran", "desert", "gas_giant", "ice", "lava", "ocean", "barren", "forest", "oceanic", "tundra"],
    sizeRange: [50, 250],
    tempRange: [-50, 200],
  },
  moon: {
    types: ["rocky", "icy", "volcanic", "ocean", "barren", "captured", "artificial"],
    sizeRange: [10, 100],
    tempRange: [-100, 100],
  },
};

function generateCelestial(bodyType: "planet" | "moon", coordinates: string) {
  const config = CELESTIAL_TYPES[bodyType];
  const type = config.types[Math.floor(Math.random() * config.types.length)];
  const size = Math.floor(Math.random() * (config.sizeRange[1] - config.sizeRange[0])) + config.sizeRange[0];
  const temperature = Math.floor(Math.random() * (config.tempRange[1] - config.tempRange[0])) + config.tempRange[0];

  return {
    id: crypto.randomUUID().slice(0, 8),
    type,
    size,
    temperature,
    coordinates,
    bodyType,
    atmosphere: bodyType === "planet"
      ? ["breathable", "toxic", "thin", "dense", "none"][Math.floor(Math.random() * 5)]
      : ["none", "trace", "thin"][Math.floor(Math.random() * 3)],
    habitability: Math.random(),
    resources: {
      metal: Math.floor(Math.random() * 8000) + 500,
      crystal: Math.floor(Math.random() * 5000) + 200,
      deuterium: Math.floor(Math.random() * 2000) + 100,
    },
    isColonizable: Math.random() > 0.3,
    isClaimed: false,
    claimedBy: null,
    name: `${bodyType === "planet" ? "P" : "M"}-${coordinates.replace(/:/g, "-")}`,
  };
}

export class CelestialService {
  static async searchCelestial(
    userId: string,
    bodyType: "planet" | "moon",
    coordinates: string,
  ): Promise<{
    success: boolean;
    result?: any;
    onCooldown?: boolean;
    cooldownUntil?: string;
    error?: string;
  }> {
    const now = new Date();

    const existing = await db.select().from(scanCooldowns).where(
      and(
        eq(scanCooldowns.userId, userId),
        eq(scanCooldowns.scanType, `celestial_${bodyType}`),
        eq(scanCooldowns.targetCoordinates, coordinates),
        sql`${scanCooldowns.cooldownUntil} > ${now}`,
      ),
    ).limit(1);

    if (existing.length > 0) {
      return {
        success: false,
        onCooldown: true,
        cooldownUntil: existing[0].cooldownUntil.toISOString(),
        error: `Search for this ${bodyType} is on cooldown. Try again later.`,
      };
    }

    const result = generateCelestial(bodyType, coordinates);

    const cooldownUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.insert(scanCooldowns).values({
      userId,
      scanType: `celestial_${bodyType}`,
      targetId: result.id,
      targetCoordinates: coordinates,
      result,
      cooldownUntil,
      scansRemaining: 0,
      maxScans: 1,
    });

    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
    if (state) {
      const known = (state.knownPlanets as any[]) ?? [];
      known.push(result);
      await db.update(playerStates)
        .set({ knownPlanets: sql`${JSON.stringify(known)}::jsonb` })
        .where(eq(playerStates.userId, userId));
    }

    return { success: true, result };
  }

  static async getDiscovered(userId: string): Promise<any[]> {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
    if (!state) return [];
    return (state.knownPlanets as any[]) ?? [];
  }

  static async claimCelestial(
    userId: string,
    bodyId: string,
    bodyType: "planet" | "moon",
    coordinates: string,
    userName: string,
  ): Promise<{ success: boolean; error?: string }> {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
    if (!state) return { success: false, error: "Player state not found" };

    const known: any[] = (state.knownPlanets as any[]) ?? [];
    const celestial = known.find((c: any) => c.id === bodyId);
    if (!celestial) return { success: false, error: "Celestial body not found. Search for it first." };
    if (celestial.isClaimed) return { success: false, error: "Already claimed by another player" };
    if (!celestial.isColonizable) return { success: false, error: "This celestial body cannot be colonized" };

    const updatedKnown = known.map((c: any) =>
      c.id === bodyId ? { ...c, isClaimed: true, claimedBy: userId, claimedByName: userName } : c,
    );

    await db.update(playerStates)
      .set({ knownPlanets: sql`${JSON.stringify(updatedKnown)}::jsonb` })
      .where(eq(playerStates.userId, userId));

    return { success: true };
  }

  static async takeoverCelestial(
  userId: string,
  userName: string,
    bodyId: string,
    coordinates: string,
  ): Promise<{ success: boolean; error?: string; enemyDefeated?: boolean }> {
    const [attackerState] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
    if (!attackerState) return { success: false, error: "Player state not found" };

    const fleets = (attackerState as any).fleets ?? {};
    const hasShips = Object.values(fleets).some((v: any) => Number(v) > 0);
    if (!hasShips) return { success: false, error: "You need a fleet to launch a takeover" };

    const allPlayers = await db.select().from(playerStates);
    let targetOwner: string | null = null;
    let targetOwnerName = "Unknown";

    for (const p of allPlayers) {
      const known: any[] = (p.knownPlanets as any[]) ?? [];
      const target = known.find((c: any) => c.id === bodyId && c.isClaimed);
      if (target) {
        targetOwner = p.userId;
        targetOwnerName = target.claimedByName ?? "Unknown";
        break;
      }
    }

    if (!targetOwner) return { success: false, error: "No claimed celestial found with that ID" };
    if (targetOwner === userId) return { success: false, error: "You already own this celestial body" };

    const attackPower = Math.random() * 100;
    const defensePower = Math.random() * 80 + 20;
    const enemyDefeated = attackPower > defensePower;

    if (!enemyDefeated) {
      return { success: false, error: "Takeover failed. Your fleet was repelled.", enemyDefeated: false };
    }

    const [defenderState] = await db.select().from(playerStates).where(eq(playerStates.userId, targetOwner)).limit(1);
    if (defenderState) {
      const defKnown: any[] = (defenderState.knownPlanets as any[]) ?? [];
      const updatedDef = defKnown.map((c: any) =>
        c.id === bodyId ? { ...c, isClaimed: false, claimedBy: null, claimedByName: null } : c,
      );
      await db.update(playerStates)
        .set({ knownPlanets: sql`${JSON.stringify(updatedDef)}::jsonb` })
        .where(eq(playerStates.userId, targetOwner));
    }

    const atkKnown: any[] = (attackerState.knownPlanets as any[]) ?? [];
    const targetInAttacker = atkKnown.find((c: any) => c.id === bodyId);
    if (targetInAttacker) {
      const updatedAtk = atkKnown.map((c: any) =>
        c.id === bodyId ? { ...c, isClaimed: true, claimedBy: userId, claimedByName: userName } : c,
      );
      await db.update(playerStates)
        .set({ knownPlanets: sql`${JSON.stringify(updatedAtk)}::jsonb` })
        .where(eq(playerStates.userId, userId));
    }

    return { success: true, enemyDefeated: true };
  }

  // Marketplace
  static async listCelestial(
    sellerId: string,
    bodyType: "planet" | "moon",
    bodyId: string,
    coordinates: string,
    price: number,
    currency: string,
  ): Promise<{ success: boolean; error?: string }> {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, sellerId)).limit(1);
    if (!state) return { success: false, error: "Player state not found" };

    const known: any[] = (state.knownPlanets as any[]) ?? [];
    const celestial = known.find((c: any) => c.id === bodyId);
    if (!celestial) return { success: false, error: "Celestial body not found" };

    if (price <= 0) return { success: false, error: "Price must be positive" };

    await db.insert(celestialMarketplace).values({
      sellerId,
      bodyType,
      bodyId,
      bodyName: celestial.name ?? `${bodyType} ${bodyId}`,
      coordinates,
      price,
      currency,
      status: "listed",
    });

    return { success: true };
  }

  static async getMarketListings(filters?: {
    bodyType?: string;
    sellerId?: string;
  }): Promise<any[]> {
    const conditions = [eq(celestialMarketplace.status, "listed")];
    if (filters?.bodyType) conditions.push(eq(celestialMarketplace.bodyType, filters.bodyType));
    if (filters?.sellerId) conditions.push(eq(celestialMarketplace.sellerId, filters.sellerId));

    return await db.select().from(celestialMarketplace)
      .where(and(...conditions))
      .orderBy(desc(celestialMarketplace.listedAt));
  }

  static async buyCelestial(
    buyerId: string,
    buyerName: string,
    listingId: string,
  ): Promise<{ success: boolean; error?: string }> {
    const [listing] = await db.select().from(celestialMarketplace)
      .where(and(eq(celestialMarketplace.id, listingId), eq(celestialMarketplace.status, "listed")))
      .limit(1);

    if (!listing) return { success: false, error: "Listing not found or already sold" };
    if (listing.sellerId === buyerId) return { success: false, error: "Cannot buy your own listing" };

    const [buyerState] = await db.select().from(playerStates).where(eq(playerStates.userId, buyerId)).limit(1);
    if (!buyerState) return { success: false, error: "Buyer state not found" };

    const buyerResources = (buyerState.resources as any) ?? {};
    const cost = listing.price;
    const currency = listing.currency;

    if (currency === "credits" && (buyerResources.credits ?? 0) < cost) {
      return { success: false, error: "Insufficient credits" };
    }
    const resourceKey = currency as string;
    if (currency !== "credits" && (buyerResources[resourceKey] ?? 0) < cost) {
      return { success: false, error: `Insufficient ${currency}` };
    }

    const newBuyerResources = {
      ...buyerResources,
      [resourceKey]: Math.max(0, (buyerResources[resourceKey] ?? 0) - cost),
    };

    const [sellerState] = await db.select().from(playerStates).where(eq(playerStates.userId, listing.sellerId)).limit(1);
    if (sellerState) {
      const sellerResources = (sellerState.resources as any) ?? {};
      await db.update(playerStates)
        .set({
          resources: sql`jsonb_set(COALESCE(resources, '{}'::jsonb), '{}', ${JSON.stringify({
            ...sellerResources,
            [resourceKey]: (sellerResources[resourceKey] ?? 0) + cost,
          })}::jsonb)`,
        })
        .where(eq(playerStates.userId, listing.sellerId));
    }

    await db.update(playerStates)
      .set({
        resources: sql`jsonb_set(COALESCE(resources, '{}'::jsonb), '{}', ${JSON.stringify(newBuyerResources)}::jsonb)`,
      })
      .where(eq(playerStates.userId, buyerId));

    const buyerKnown: any[] = (buyerState.knownPlanets as any[]) ?? [];
    const existing = buyerKnown.find((c: any) => c.id === listing.bodyId);
    if (!existing) {
      buyerKnown.push({
        id: listing.bodyId,
        name: listing.bodyName,
        coordinates: listing.coordinates,
        bodyType: listing.bodyType,
        isClaimed: true,
        claimedBy: buyerId,
        claimedByName: buyerName,
        type: listing.bodyType === "planet" ? "terran" : "rocky",
        size: 100,
        temperature: 20,
      });
    } else {
      const idx = buyerKnown.findIndex((c: any) => c.id === listing.bodyId);
      buyerKnown[idx] = { ...buyerKnown[idx], isClaimed: true, claimedBy: buyerId, claimedByName: buyerName };
    }

    await db.update(playerStates)
      .set({ knownPlanets: sql`${JSON.stringify(buyerKnown)}::jsonb` })
      .where(eq(playerStates.userId, buyerId));

    if (sellerState) {
      const sellerKnown: any[] = (sellerState.knownPlanets as any[]) ?? [];
      const updatedSellerKnown = sellerKnown.map((c: any) =>
        c.id === listing.bodyId ? { ...c, isClaimed: false, claimedBy: null, claimedByName: null } : c,
      );
      await db.update(playerStates)
        .set({ knownPlanets: sql`${JSON.stringify(updatedSellerKnown)}::jsonb` })
        .where(eq(playerStates.userId, listing.sellerId));
    }

    await db.update(celestialMarketplace)
      .set({ status: "sold", buyerId, soldAt: new Date() })
      .where(eq(celestialMarketplace.id, listingId));

    return { success: true };
  }

  static async cancelListing(userId: string, listingId: string): Promise<{ success: boolean; error?: string }> {
    const [listing] = await db.select().from(celestialMarketplace)
      .where(and(eq(celestialMarketplace.id, listingId), eq(celestialMarketplace.sellerId, userId)))
      .limit(1);

    if (!listing) return { success: false, error: "Listing not found" };
    if (listing.status !== "listed") return { success: false, error: "Listing is no longer active" };

    await db.update(celestialMarketplace)
      .set({ status: "cancelled" })
      .where(eq(celestialMarketplace.id, listingId));

    return { success: true };
  }

  static async getSearchCooldowns(userId: string): Promise<any[]> {
    const now = new Date();
    const cooldowns = await db.select().from(scanCooldowns).where(
      and(
        eq(scanCooldowns.userId, userId),
        sql`${scanCooldowns.scanType} LIKE 'celestial_%'`,
      ),
    ).orderBy(desc(scanCooldowns.createdAt));

    return cooldowns.map(c => ({
      scanType: c.scanType,
      targetCoordinates: c.targetCoordinates,
      cooldownUntil: c.cooldownUntil,
      isActive: c.cooldownUntil > now,
    }));
  }
}
