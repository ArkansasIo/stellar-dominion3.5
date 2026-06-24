import express from 'express';
import { isAuthenticated } from './basicAuth';
import { storage } from './storage';
import { db } from './db';
import { playerStates, moons } from '../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

const SCAN_CONFIG = {
  galaxy_scan: { cooldownHours: 24, maxScans: 1, baseCost: 100, label: "Galaxy Scan" },
  planet_search: { cooldownHours: 24, maxScans: 3, baseCost: 50, label: "Planet Search" },
  moon_search: { cooldownHours: 24, maxScans: 3, baseCost: 50, label: "Moon Search" },
  deep_probe: { cooldownHours: 48, maxScans: 1, baseCost: 200, label: "Deep Probe" },
  resource_scan: { cooldownHours: 12, maxScans: 5, baseCost: 25, label: "Resource Scan" },
};

function generateScanResult(scanType: string, targetCoordinates?: string) {
  const result: any = {
    scanId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    scanType,
    targetCoordinates,
  };

  switch (scanType) {
    case "galaxy_scan": {
      const planetCount = Math.floor(Math.random() * 8) + 2;
      const moonCount = Math.floor(Math.random() * 4);
      result.planetsDetected = planetCount;
      result.moonsDetected = moonCount;
      result.anomalies = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0;
      result.resourceRichSystems = Math.floor(Math.random() * 3);
      result.habitablePlanets = Math.floor(Math.random() * Math.min(planetCount, 3));
      break;
    }
    case "planet_search": {
      const planetTypes = ["terran", "desert", "gas_giant", "ice", "lava", "ocean", "barren", "forest"];
      const foundPlanets = [];
      const count = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < count; i++) {
        foundPlanets.push({
          id: crypto.randomUUID().slice(0, 8),
          type: planetTypes[Math.floor(Math.random() * planetTypes.length)],
          size: Math.floor(Math.random() * 200) + 50,
          temperature: Math.floor(Math.random() * 200) - 50,
          atmosphere: ["breathable", "toxic", "thin", "dense", "none"][Math.floor(Math.random() * 5)],
          resources: {
            metal: Math.floor(Math.random() * 5000),
            crystal: Math.floor(Math.random() * 3000),
            deuterium: Math.floor(Math.random() * 1000),
          },
         殖民able: Math.random() > 0.4,
        });
      }
      result.planets = foundPlanets;
      result.searchRadius = `${Math.floor(Math.random() * 50) + 10} AU`;
      break;
    }
    case "moon_search": {
      const foundMoons = [];
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        foundMoons.push({
          id: crypto.randomUUID().slice(0, 8),
          size: Math.floor(Math.random() * 100) + 10,
          type: ["rocky", "icy", "volcanic", "ocean", "barren"][Math.floor(Math.random() * 5)],
          atmosphere: ["none", "trace", "thin"][Math.floor(Math.random() * 3)],
          resources: {
            metal: Math.floor(Math.random() * 2000),
            crystal: Math.floor(Math.random() * 1000),
          },
         殖民able: Math.random() > 0.6,
        });
      }
      result.moons = foundMoons;
      break;
    }
    case "deep_probe": {
      result.composition = {
        metal: Math.floor(Math.random() * 10000),
        crystal: Math.floor(Math.random() * 5000),
        deuterium: Math.floor(Math.random() * 2000),
        rareMinerals: Math.floor(Math.random() * 500),
        artifacts: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
      };
      result.habitationChance = `${(Math.random() * 30).toFixed(1)}%`;
      result.threatLevel = ["low", "moderate", "high", "extreme"][Math.floor(Math.random() * 4)];
      break;
    }
    case "resource_scan": {
      result.deposits = {
        metal: { estimated: Math.floor(Math.random() * 50000), confidence: `${Math.floor(Math.random() * 40) + 30}%` },
        crystal: { estimated: Math.floor(Math.random() * 25000), confidence: `${Math.floor(Math.random() * 40) + 30}%` },
        deuterium: { estimated: Math.floor(Math.random() * 10000), confidence: `${Math.floor(Math.random() * 40) + 30}%` },
      };
      result.specialDeposits = Math.random() > 0.7 ? [`${["Titanium", "Adamantium", "Trinium", "Quantium"][Math.floor(Math.random() * 4)]} Vein`] : [];
      break;
    }
  }

  return result;
}

router.get('/api/universe/scan/config', (_req, res) => {
  res.json({ success: true, scanTypes: SCAN_CONFIG });
});

router.get('/api/universe/scan/status', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cooldowns = await storage.getScanCooldowns(userId);
    const now = new Date();
    const statuses = Object.entries(SCAN_CONFIG).map(([type, config]) => {
      const active = cooldowns.find(c => c.scanType === type && new Date(c.cooldownUntil) > now);
      return {
        scanType: type,
        label: config.label,
        maxScans: config.maxScans,
        scansRemaining: active ? active.scansRemaining : config.maxScans,
        cooldownUntil: active?.cooldownUntil || null,
        onCooldown: !!active && new Date(active.cooldownUntil) > now,
        baseCost: config.baseCost,
      };
    });

    res.json({ success: true, scans: statuses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get scan status' });
  }
});

router.post('/api/universe/scan/execute', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { scanType, targetCoordinates } = req.body;
    if (!scanType) {
      return res.status(400).json({ error: 'scanType required' });
    }

    const config = (SCAN_CONFIG as any)[scanType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid scan type' });
    }

    const activeCooldown = await storage.getActiveScanCooldown(userId, scanType);
    if (activeCooldown && activeCooldown.scansRemaining <= 0) {
      return res.status(429).json({
        error: 'Scan on cooldown',
        cooldownUntil: activeCooldown.cooldownUntil,
      });
    }

    const result = generateScanResult(scanType, targetCoordinates);

    const cooldownUntil = new Date(Date.now() + config.cooldownHours * 60 * 60 * 1000);
    const remaining = (activeCooldown?.scansRemaining || config.maxScans) - 1;

    if (activeCooldown) {
      await storage.createScanCooldown({
        userId,
        scanType,
        targetId: targetCoordinates || null,
        targetCoordinates: targetCoordinates || null,
        result,
        cooldownUntil,
        scansRemaining: Math.max(0, remaining),
        maxScans: config.maxScans,
      });
    } else {
      await storage.createScanCooldown({
        userId,
        scanType,
        targetId: targetCoordinates || null,
        targetCoordinates: targetCoordinates || null,
        result,
        cooldownUntil,
        scansRemaining: Math.max(0, remaining),
        maxScans: config.maxScans,
      });
    }

    res.json({
      success: true,
      result,
      scansRemaining: Math.max(0, remaining),
      cooldownUntil,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute scan' });
  }
});

router.get('/api/universe/scan/history', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const scanType = req.query.scanType as string | undefined;
    const cooldowns = await storage.getScanCooldowns(userId, scanType);
    res.json({ success: true, history: cooldowns });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get scan history' });
  }
});

export default router;
