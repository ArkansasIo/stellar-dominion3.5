import express from 'express';
import { isAuthenticated } from './basicAuth';
import { storage } from './storage';

const router = express.Router();

router.get('/api/planet-vault/items', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const planetId = req.query.planetId as string | undefined;
    const vaultType = req.query.vaultType as string | undefined;
    const items = await storage.getPlanetVaultItems(userId, planetId, vaultType);

    const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const byType = items.reduce((acc: Record<string, number>, item) => {
      acc[item.itemType] = (acc[item.itemType] || 0) + (item.quantity || 0);
      return acc;
    }, {});

    res.json({ success: true, items, total, byType });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get vault items' });
  }
});

router.post('/api/planet-vault/deposit', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { planetId, vaultType, itemType, itemName, quantity, rarity, metadata } = req.body;

    if (!itemType || !itemName) {
      return res.status(400).json({ error: 'itemType and itemName required' });
    }

    const existing = (await storage.getPlanetVaultItems(userId, planetId, vaultType))
      .find(i => i.itemType === itemType && i.itemName === itemName);

    if (existing) {
      const updated = await storage.updatePlanetVaultItemQuantity(
        existing.id,
        existing.quantity + (quantity || 1)
      );
      return res.json({ success: true, item: updated });
    }

    const item = await storage.addPlanetVaultItem({
      userId,
      planetId: planetId || null,
      vaultType: vaultType || "resource",
      itemType,
      itemName,
      quantity: quantity || 1,
      rarity: rarity || "common",
      metadata: metadata || {},
    });

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deposit item' });
  }
});

router.post('/api/planet-vault/withdraw', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { itemId, quantity } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: 'itemId required' });
    }

    const items = await storage.getPlanetVaultItems(userId);
    const item = items.find(i => i.id === itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const withdrawQty = quantity || item.quantity;
    if (withdrawQty > item.quantity) {
      return res.status(400).json({ error: 'Insufficient quantity' });
    }

    if (withdrawQty >= item.quantity) {
      await storage.removePlanetVaultItem(itemId);
    } else {
      await storage.updatePlanetVaultItemQuantity(itemId, item.quantity - withdrawQty);
    }

    res.json({ success: true, withdrawn: { ...item, quantity: withdrawQty } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to withdraw item' });
  }
});

router.get('/api/planet-vault/stats', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const items = await storage.getPlanetVaultItems(userId);
    const vaultStats = {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, i) => sum + (i.quantity || 0), 0),
      byRarity: items.reduce((acc: Record<string, number>, i) => {
        acc[i.rarity || "common"] = (acc[i.rarity || "common"] || 0) + (i.quantity || 0);
        return acc;
      }, {}),
      byType: items.reduce((acc: Record<string, number>, i) => {
        acc[i.vaultType || "resource"] = (acc[i.vaultType || "resource"] || 0) + 1;
        return acc;
      }, {}),
      uniqueItems: new Set(items.map(i => `${i.itemType}:${i.itemName}`)).size,
    };

    res.json({ success: true, stats: vaultStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get vault stats' });
  }
});

export default router;
