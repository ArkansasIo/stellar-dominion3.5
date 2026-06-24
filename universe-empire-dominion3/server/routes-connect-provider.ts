import express from 'express';
import { isAuthenticated } from './basicAuth';
import { storage } from './storage';
import { nanoid } from 'nanoid';

const router = express.Router();

const PROVIDER_TYPES = [
  { id: "wallet", label: "Crypto Wallet", icon: "💳", color: "#6366f1", description: "Connect your Web3 wallet for blockchain transactions" },
  { id: "metamask", label: "MetaMask", icon: "🦊", color: "#f59e0b", description: "Browser-based Ethereum wallet integration" },
  { id: "discord", label: "Discord", icon: "💬", color: "#5865f2", description: "Link your Discord account for community features" },
  { id: "twitter", label: "Twitter / X", icon: "🐦", color: "#1da1f2", description: "Connect Twitter for social features and sharing" },
  { id: "api_key", label: "API Key", icon: "🔑", color: "#10b981", description: "Generate API keys for external tool access" },
  { id: "steam", label: "Steam", icon: "🎮", color: "#171a21", description: "Link your Steam account" },
  { id: "web3", label: "Web3 Identity", icon: "🌐", color: "#8b5cf6", description: "Decentralized identity and SSO" },
];

router.get('/api/connect/providers', (_req, res) => {
  res.json({ success: true, providers: PROVIDER_TYPES });
});

router.get('/api/connect/connections', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const connections = await storage.getProviderConnections(userId);
    res.json({ success: true, connections });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get connections' });
  }
});

router.post('/api/connect/connections', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { provider, label, metadata } = req.body;
    if (!provider || !label) {
      return res.status(400).json({ error: 'provider and label required' });
    }

    const providerDef = PROVIDER_TYPES.find(p => p.id === provider);
    if (!providerDef) {
      return res.status(400).json({ error: 'Invalid provider type' });
    }

    const connection = await storage.createProviderConnection({
      userId,
      provider,
      label,
      status: "active",
      accessToken: nanoid(32),
      metadata: metadata || {},
    });

    res.json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

router.patch('/api/connect/connections/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { label, status, metadata } = req.body;

    const updates: any = {};
    if (label !== undefined) updates.label = label;
    if (status !== undefined) updates.status = status;
    if (metadata !== undefined) updates.metadata = metadata;

    const connection = await storage.updateProviderConnection(id, updates);
    res.json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update connection' });
  }
});

router.delete('/api/connect/connections/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteProviderConnection(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete connection' });
  }
});

router.post('/api/connect/connections/:id/reconnect', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await storage.updateProviderConnection(id, {
      accessToken: nanoid(32),
      lastUsedAt: new Date(),
      status: "active",
    });
    res.json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reconnect' });
  }
});

export default router;
