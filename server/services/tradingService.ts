import { db } from '../db';
import { sql, and } from 'drizzle-orm';
import { users } from '../../Source/Shared/schema';

export class TradingService {
  static async createTradeOrder(userId: string, type: string, resource: string, amount: number, pricePerUnit: number) {
    if (type !== 'buy' && type !== 'sell') {
      throw new Error('Order type must be "buy" or "sell"');
    }

    const validResources = ['metal', 'crystal', 'deuterium'];
    if (!validResources.includes(resource)) {
      throw new Error('Invalid resource');
    }
    if (amount <= 0 || pricePerUnit <= 0) {
      throw new Error('Amount and price must be positive');
    }

    if (type === 'sell') {
      const state = await db.execute(sql`
        SELECT resources FROM player_states WHERE user_id = ${userId} LIMIT 1
      `);
      if (state.rows.length === 0) {
        throw new Error('Player state not found');
      }
      const resources = (state.rows[0] as any).resources as any;
      if ((resources[resource] ?? 0) < amount) {
        throw new Error(`Insufficient ${resource}`);
      }
    }

    const result = await db.execute(sql`
      INSERT INTO market_orders (user_id, type, resource, amount, price_per_unit, status, created_at)
      VALUES (${userId}, ${type}, ${resource}, ${amount}, ${pricePerUnit}, 'active', NOW())
      RETURNING id
    `);

    return { orderId: (result.rows[0] as any).id };
  }

  static async cancelOrder(userId: string, orderId: string) {
    const order = await db.execute(sql`
      SELECT id, user_id, status FROM market_orders WHERE id = ${orderId} LIMIT 1
    `);
    if (order.rows.length === 0) {
      throw new Error('Order not found');
    }
    if ((order.rows[0] as any).user_id !== userId) {
      throw new Error('Not your order');
    }
    if ((order.rows[0] as any).status !== 'active') {
      throw new Error('Order is not active');
    }

    await db.execute(sql`
      UPDATE market_orders SET status = 'cancelled' WHERE id = ${orderId}
    `);

    return { success: true };
  }

  static async fillOrder(userId: string, orderId: string, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const order = await db.execute(sql`
      SELECT * FROM market_orders WHERE id = ${orderId} AND status = 'active' LIMIT 1
    `);
    if (order.rows.length === 0) {
      throw new Error('Order not found or not active');
    }

    const o = order.rows[0] as any;
    if (o.user_id === userId) {
      throw new Error('Cannot fill your own order');
    }

    const fillQuantity = Math.min(quantity, o.amount);
    const totalCost = Math.round(fillQuantity * o.price_per_unit);

    if (o.type === 'sell') {
      const buyerState = await db.execute(sql`
        SELECT resources FROM player_states WHERE user_id = ${userId} LIMIT 1
      `);
      if (buyerState.rows.length === 0) {
        throw new Error('Buyer state not found');
      }
      const buyerResources = (buyerState.rows[0] as any).resources as any;
      if ((buyerResources[o.resource] ?? 0) < fillQuantity) {
        throw new Error(`Insufficient ${o.resource}`);
      }

      await db.execute(sql`
        UPDATE player_states 
        SET resources = jsonb_set(
          resources, 
          ${'{'}${o.resource}${'}'}, 
          ((resources->>${o.resource})::int - ${fillQuantity})::text::jsonb
        )
        WHERE user_id = ${userId}
      `);

      await db.execute(sql`
        UPDATE player_states 
        SET resources = jsonb_set(
          resources,
          ${'{'}${o.resource}${'}'},
          ((resources->>${o.resource})::int + ${fillQuantity})::text::jsonb
        )
        WHERE user_id = ${o.user_id}
      `);
    } else {
      const sellerState = await db.execute(sql`
        SELECT resources FROM player_states WHERE user_id = ${o.user_id} LIMIT 1
      `);
      if (sellerState.rows.length === 0) {
        throw new Error('Seller state not found');
      }
      const sellerResources = (sellerState.rows[0] as any).resources as any;
      if ((sellerResources[o.resource] ?? 0) < fillQuantity) {
        throw new Error('Seller has insufficient resources');
      }

      await db.execute(sql`
        UPDATE player_states 
        SET resources = jsonb_set(
          resources,
          ${'{'}${o.resource}${'}'},
          ((resources->>${o.resource})::int - ${fillQuantity})::text::jsonb
        )
        WHERE user_id = ${o.user_id}
      `);

      await db.execute(sql`
        UPDATE player_states 
        SET resources = jsonb_set(
          resources,
          ${'{'}${o.resource}${'}'},
          ((resources->>${o.resource})::int + ${fillQuantity})::text::jsonb
        )
        WHERE user_id = ${userId}
      `);
    }

    const remainingAmount = o.amount - fillQuantity;
    if (remainingAmount <= 0) {
      await db.execute(sql`
        UPDATE market_orders SET status = 'completed', amount = 0, completed_at = NOW() WHERE id = ${orderId}
      `);
    } else {
      await db.execute(sql`
        UPDATE market_orders SET amount = ${remainingAmount} WHERE id = ${orderId}
      `);
    }

    const buyerProfile = await db.execute(sql`
      SELECT COALESCE(username, 'Commander') AS name FROM users WHERE id = ${userId} LIMIT 1
    `);
    const sellerProfile = await db.execute(sql`
      SELECT COALESCE(username, 'Commander') AS name FROM users WHERE id = ${o.user_id} LIMIT 1
    `);

    await db.execute(sql`
      INSERT INTO trade_history (trade_offer_id, sender_id, sender_name, receiver_id, receiver_name, sender_gave, receiver_gave, result, completed_at)
      VALUES (${orderId}, ${o.user_id}, ${(sellerProfile.rows[0] as any).name}, ${userId}, ${(buyerProfile.rows[0] as any).name}, 
        ${JSON.stringify({ [o.resource]: fillQuantity })}::jsonb, 
        ${JSON.stringify({ credits: totalCost })}::jsonb, 
        'completed', NOW())
    `);

    return { filled: fillQuantity, totalCost, remaining: remainingAmount };
  }

  static async getMarketOrders(resource: string, type?: string) {
    let query;
    if (type) {
      query = sql`
        SELECT 
          mo.id,
          mo.user_id,
          mo.type,
          mo.resource,
          mo.amount,
          mo.price_per_unit,
          mo.created_at,
          COALESCE(u.username, 'Commander') AS seller_name
        FROM market_orders mo
        LEFT JOIN users u ON u.id = mo.user_id
        WHERE mo.resource = ${resource} AND mo.type = ${type} AND mo.status = 'active'
        ORDER BY mo.price_per_unit ${type === 'sell' ? sql`ASC` : sql`DESC`}
      `;
    } else {
      query = sql`
        SELECT 
          mo.id,
          mo.user_id,
          mo.type,
          mo.resource,
          mo.amount,
          mo.price_per_unit,
          mo.created_at,
          COALESCE(u.username, 'Commander') AS seller_name
        FROM market_orders mo
        LEFT JOIN users u ON u.id = mo.user_id
        WHERE mo.resource = ${resource} AND mo.status = 'active'
        ORDER BY mo.type, mo.price_per_unit ASC
      `;
    }

    const result = await db.execute(query);
    return result.rows;
  }

  static async getTradeHistory(userId: string, page: number = 1, limit: number = 50) {
    const offset = (Math.max(1, page) - 1) * limit;

    const result = await db.execute(sql`
      SELECT * FROM trade_history
      WHERE sender_id = ${userId} OR receiver_id = ${userId}
      ORDER BY completed_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    return result.rows;
  }

  static async calculateExchangeRate(resource: string) {
    const sellOrders = await db.execute(sql`
      SELECT AVG(price_per_unit) AS avg_price, SUM(amount) AS total_amount
      FROM market_orders
      WHERE resource = ${resource} AND type = 'sell' AND status = 'active'
    `);

    const buyOrders = await db.execute(sql`
      SELECT AVG(price_per_unit) AS avg_price, SUM(amount) AS total_amount
      FROM market_orders
      WHERE resource = ${resource} AND type = 'buy' AND status = 'active'
    `);

    const sell = sellOrders.rows[0] as any;
    const buy = buyOrders.rows[0] as any;

    const sellAvg = Number(sell.avg_price ?? 0);
    const buyAvg = Number(buy.avg_price ?? 0);
    const sellVolume = Number(sell.total_amount ?? 0);
    const buyVolume = Number(buy.total_amount ?? 0);

    let rate: number;
    if (sellAvg > 0 && buyAvg > 0) {
      rate = (sellAvg + buyAvg) / 2;
    } else if (sellAvg > 0) {
      rate = sellAvg;
    } else if (buyAvg > 0) {
      rate = buyAvg;
    } else {
      const defaults: Record<string, number> = { metal: 1, crystal: 2, deuterium: 5 };
      rate = defaults[resource] ?? 1;
    }

    return {
      resource,
      exchangeRate: Math.round(rate * 100) / 100,
      sellAverage: Math.round(sellAvg * 100) / 100,
      buyAverage: Math.round(buyAvg * 100) / 100,
      sellVolume,
      buyVolume,
    };
  }

  static async quickExchange(userId: string, fromResource: string, toResource: string, amount: number) {
    const validResources = ['metal', 'crystal', 'deuterium'];
    if (!validResources.includes(fromResource) || !validResources.includes(toResource)) {
      throw new Error('Invalid resource');
    }
    if (fromResource === toResource) {
      throw new Error('Cannot exchange same resource');
    }
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const state = await db.execute(sql`
      SELECT resources FROM player_states WHERE user_id = ${userId} LIMIT 1
    `);
    if (state.rows.length === 0) {
      throw new Error('Player state not found');
    }
    const resources = (state.rows[0] as any).resources as any;
    if ((resources[fromResource] ?? 0) < amount) {
      throw new Error(`Insufficient ${fromResource}`);
    }

    const fromRate = await this.calculateExchangeRate(fromResource);
    const toRate = await this.calculateExchangeRate(toResource);

    const fromValue = amount * fromRate.exchangeRate;
    const afterTax = Math.floor(fromValue * 0.95);
    const received = Math.max(1, Math.round(afterTax / toRate.exchangeRate));

    await db.execute(sql`
      UPDATE player_states 
      SET resources = jsonb_set(
        jsonb_set(
          resources,
          ${'{'}${fromResource}${'}'},
          ((resources->>${fromResource})::int - ${amount})::text::jsonb
        ),
        ${'{'}${toResource}${'}'},
        ((resources->>${toResource})::int + ${received})::text::jsonb
      )
      WHERE user_id = ${userId}
    `);

    return { fromResource, toResource, spent: amount, received, tax: 0.05 };
  }

  static async createAuction(
    userId: string,
    itemType: string,
    itemId: string,
    startingPrice: number,
    buyoutPrice: number | null,
    duration: number
  ) {
    if (startingPrice <= 0) {
      throw new Error('Starting price must be positive');
    }
    if (buyoutPrice !== null && buyoutPrice < startingPrice) {
      throw new Error('Buyout price must be >= starting price');
    }
    if (duration < 1 || duration > 168) {
      throw new Error('Duration must be 1-168 hours');
    }

    const profile = await db.execute(sql`
      SELECT COALESCE(username, 'Commander') AS display_name FROM users WHERE id = ${userId} LIMIT 1
    `);
    const sellerName = (profile.rows[0] as any)?.display_name ?? 'Commander';

    const expiresAt = new Date(Date.now() + duration * 60 * 60 * 1000).toISOString();

    const result = await db.execute(sql`
      INSERT INTO auction_listings (
        seller_id, seller_name, item_type, item_id, item_name,
        starting_price, buyout_price, bid_increment, quantity,
        duration, expires_at, status, created_at
      )
      VALUES (
        ${userId}, ${sellerName}, ${itemType}, ${itemId}, ${itemType},
        ${startingPrice}, ${buyoutPrice ?? 0}, ${Math.max(1, Math.floor(startingPrice * 0.05))}, 1,
        ${duration}, ${expiresAt}, 'active', NOW()
      )
      RETURNING id
    `);

    return { auctionId: (result.rows[0] as any).id };
  }

  static async placeBid(userId: string, auctionId: string, bidAmount: number) {
    if (bidAmount <= 0) {
      throw new Error('Bid amount must be positive');
    }

    const auction = await db.execute(sql`
      SELECT * FROM auction_listings WHERE id = ${auctionId} AND status = 'active' LIMIT 1
    `);
    if (auction.rows.length === 0) {
      throw new Error('Auction not found or not active');
    }

    const a = auction.rows[0] as any;
    if (a.seller_id === userId) {
      throw new Error('Cannot bid on your own auction');
    }

    const currentHighest = Number(a.current_bid ?? 0);
    const minBid = currentHighest > 0 ? currentHighest + Number(a.bid_increment) : Number(a.starting_price);

    if (bidAmount < minBid) {
      throw new Error(`Bid must be at least ${minBid}`);
    }

    const state = await db.execute(sql`
      SELECT resources FROM player_states WHERE user_id = ${userId} LIMIT 1
    `);
    if (state.rows.length === 0) {
      throw new Error('Player state not found');
    }
    const resources = (state.rows[0] as any).resources as any;
    if ((resources.metal ?? 0) < bidAmount) {
      throw new Error('Insufficient metal for bid');
    }

    await db.execute(sql`
      UPDATE player_states 
      SET resources = jsonb_set(
        resources,
        '{metal}',
        ((resources->>'metal')::int - ${bidAmount})::text::jsonb
      )
      WHERE user_id = ${userId}
    `);

    if (currentHighest > 0 && a.current_bidder_id) {
      await db.execute(sql`
        UPDATE player_states 
        SET resources = jsonb_set(
          resources,
          '{metal}',
          ((resources->>'metal')::int + ${currentHighest})::text::jsonb
        )
        WHERE user_id = ${a.current_bidder_id}
      `);
    }

    const bidderProfile = await db.execute(sql`
      SELECT COALESCE(username, 'Commander') AS display_name FROM users WHERE id = ${userId} LIMIT 1
    `);
    const bidderName = (bidderProfile.rows[0] as any)?.display_name ?? 'Commander';

    await db.execute(sql`
      INSERT INTO auction_bids (auction_id, bidder_id, bidder_name, bid_amount, created_at)
      VALUES (${auctionId}, ${userId}, ${bidderName}, ${bidAmount}, NOW())
    `);

    await db.execute(sql`
      UPDATE auction_listings 
      SET current_bid = ${bidAmount}, current_bidder_id = ${userId}, 
          current_bidder_name = ${bidderName}, bid_count = bid_count + 1
      WHERE id = ${auctionId}
    `);

    return { success: true, bidAmount };
  }

  static async getAuctions(filter?: { status?: string; itemType?: string; sellerId?: string }) {
    const conditions: any[] = [sql`1=1`];

    if (filter?.status) {
      conditions.push(sql`al.status = ${filter.status}`);
    }
    if (filter?.itemType) {
      conditions.push(sql`al.item_type = ${filter.itemType}`);
    }
    if (filter?.sellerId) {
      conditions.push(sql`al.seller_id = ${filter.sellerId}`);
    }

    const result = await db.execute(sql`
      SELECT 
        al.*,
        COALESCE(u.username, 'Commander') AS seller_name
      FROM auction_listings al
      LEFT JOIN users u ON u.id = al.seller_id
      WHERE ${sql.join(conditions, sql` AND `)}
      ORDER BY al.expires_at ASC
      LIMIT 100
    `);

    return result.rows;
  }
}

export default TradingService;
