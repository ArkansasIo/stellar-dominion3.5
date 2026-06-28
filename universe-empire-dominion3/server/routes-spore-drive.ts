import type { Express, Request, Response } from "express";
import {
  SPORE_DRIVE_TYPES,
  calculateSporeDriveStats,
  calculateSporeDriveSubStats,
  calculateSporeDriveAttributes,
  generateSporeDriveDetails,
  generateSporeDriveStatus,
  calculateSporeDriveRarity,
  calculateJumpMetrics,
  calculateSporeConsumption,
  generateMycelialNetworkNodes,
  type SporeDrive,
  type SporeDriveMode,
  type SporeDriveState,
} from "../shared/config/sporeDriveSystem";

import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

async function getSporeDrives(userId: string): Promise<SporeDrive[]> {
  const row = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
    columns: { sporeDriveState: true },
  });
  const state = row?.sporeDriveState as any;
  return state?.drives || [];
}

async function setSporeDrives(userId: string, drives: SporeDrive[]) {
  const row = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
    columns: { sporeDriveState: true },
  });
  const existing = (row?.sporeDriveState as any) || { drives: [], networkNodes: [], activeMode: 'standard' };
  existing.drives = drives;
  await db
    .update(playerStates)
    .set({ sporeDriveState: existing as any, updatedAt: new Date() })
    .where(eq(playerStates.userId, userId));
}

export function registerSporeDriveRoutes(app: Express) {
  // Get all spore drives for a ship
  app.get("/api/spore-drive/ship/:shipId", async (req: Request, res: Response) => {
    try {
      const shipId = req.params.shipId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drives = allDrives.filter(d => d.shipId === shipId);
      
      res.json({
        drives,
        count: drives.length,
        shipId,
      });
    } catch (error) {
      console.error("Error fetching spore drives:", error);
      res.status(500).json({ error: "Failed to fetch spore drives" });
    }
  });

  // Get specific spore drive details
  app.get("/api/spore-drive/:driveId", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      res.json(drive);
    } catch (error) {
      console.error("Error fetching spore drive:", error);
      res.status(500).json({ error: "Failed to fetch spore drive data" });
    }
  });

  // Get spore drive comprehensive stats
  app.get("/api/spore-drive/:driveId/stats", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      res.json({
        id: drive.id,
        name: drive.name,
        tier: drive.tier,
        level: drive.level,
        class: drive.class,
        rarity: drive.rarity,
        stats: drive.stats,
        subStats: drive.subStats,
        attributes: drive.attributes,
      });
    } catch (error) {
      console.error("Error fetching spore drive stats:", error);
      res.status(500).json({ error: "Failed to fetch spore drive stats" });
    }
  });

  // Get spore drive status
  app.get("/api/spore-drive/:driveId/status", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      res.json({
        id: drive.id,
        name: drive.name,
        status: drive.status,
        state: drive.status.state,
        mode: drive.status.mode,
        isOperational: drive.status.isOperational,
        isEngaged: drive.status.isEngaged,
        health: drive.status.health,
        coreTemperature: drive.status.coreTemperature,
        radiationLevel: drive.status.radiationLevel,
        contaminationLevel: drive.status.contaminationLevel,
        sporeReserves: drive.status.sporeReserves,
        sporeCapacity: drive.status.sporeCapacity,
        powerLevel: drive.status.powerLevel,
        systems: drive.status.systems,
        alerts: drive.status.alerts,
        currentJump: drive.status.currentJump,
      });
    } catch (error) {
      console.error("Error fetching spore drive status:", error);
      res.status(500).json({ error: "Failed to fetch spore drive status" });
    }
  });

  // Get spore drive details and history
  app.get("/api/spore-drive/:driveId/details", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      res.json({
        id: drive.id,
        name: drive.name,
        details: drive.details,
        totalJumps: drive.details.totalJumps,
        totalDistanceTraveled: drive.details.totalDistanceTraveled,
        successfulJumps: drive.details.successfulJumps,
        failedJumps: drive.details.failedJumps,
        averageJumpTime: drive.details.averageJumpTime,
        longestJump: drive.details.longestJump,
        mostDistantDestination: drive.details.mostDistantDestination,
        incidents: drive.details.incidents,
        upgradesInstalled: drive.details.upgradesInstalled,
        upgradeLevel: drive.details.upgradeLevel,
        trainedCrew: drive.details.trainedCrew,
        chiefEngineer: drive.details.chiefEngineer,
        navigationSpecialist: drive.details.navigationSpecialist,
      });
    } catch (error) {
      console.error("Error fetching spore drive details:", error);
      res.status(500).json({ error: "Failed to fetch spore drive details" });
    }
  });

  // Get mycelial network nodes
  app.get("/api/spore-drive/:driveId/network", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      res.json({
        id: drive.id,
        name: drive.name,
        networkNodes: drive.networkNodes,
        totalNodes: drive.networkNodes.length,
        activeNodes: drive.networkNodes.filter(n => n.status === 'active').length,
        degradedNodes: drive.networkNodes.filter(n => n.status === 'degraded').length,
        offlineNodes: drive.networkNodes.filter(n => n.status === 'offline').length,
      });
    } catch (error) {
      console.error("Error fetching mycelial network:", error);
      res.status(500).json({ error: "Failed to fetch mycelial network" });
    }
  });

  // Get jump history
  app.get("/api/spore-drive/:driveId/jumps", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      res.json({
        id: drive.id,
        name: drive.name,
        totalJumps: drive.totalJumps,
        jumpHistory: drive.jumpHistory,
        recentJumps: drive.jumpHistory.slice(-10), // Last 10 jumps
        successfulJumps: drive.jumpHistory.filter(j => j.status === 'completed').length,
        failedJumps: drive.jumpHistory.filter(j => j.status === 'failed').length,
      });
    } catch (error) {
      console.error("Error fetching jump history:", error);
      res.status(500).json({ error: "Failed to fetch jump history" });
    }
  });

  // Initiate spore drive jump
  app.post("/api/spore-drive/:driveId/jump", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const { destination, destinationType, coordinates } = req.body;

      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);
      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      // Check if drive is ready
      if (drive.status.state !== 'ready' && drive.status.state !== 'standby') {
        return res.status(400).json({ 
          error: "Spore drive is not ready for jump",
          currentState: drive.status.state 
        });
      }

      // Check if on cooldown
      if (drive.status.currentCooldown > 0) {
        return res.status(400).json({ 
          error: "Spore drive is on cooldown",
          cooldownRemaining: drive.status.currentCooldown 
        });
      }

      // Check spore reserves
      if (drive.status.sporeReserves < 10) {
        return res.status(400).json({ 
          error: "Insufficient spore reserves",
          currentReserves: drive.status.sporeReserves,
          required: 10 
        });
      }

      // Calculate jump metrics
      const origin = { x: 0, y: 0, z: 0 }; // Would be actual ship coordinates
      const dest = { 
        x: coordinates?.x || Math.random() * 100, 
        y: coordinates?.y || Math.random() * 100, 
        z: coordinates?.z || Math.random() * 100 
      };
      
      const jumpMetrics = calculateJumpMetrics(origin, dest, drive.stats, drive.subStats);
      const sporeCost = calculateSporeConsumption(
        jumpMetrics.distance,
        drive.stats,
        drive.subStats,
        drive.attributes
      );

      // Check if enough spores
      if (drive.status.sporeReserves < sporeCost) {
        return res.status(400).json({ 
          error: "Insufficient spores for this jump",
          required: sporeCost,
          available: drive.status.sporeReserves 
        });
      }

      // Create jump record
      const jumpId = `jump-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const jump = {
        id: jumpId,
        shipId: drive.shipId,
        jumpNumber: drive.totalJumps + 1,
        origin: {
          coordinates: drive.status.currentJump.origin || "0:0:0",
          system: "Current System",
          planet: null,
        },
        destination: {
          coordinates: `${dest.x}:${dest.y}:${dest.z}`,
          system: destination || "Unknown System",
          planet: null,
          type: destinationType as any,
        },
        initiatedAt: Date.now(),
        completedAt: null,
        duration: jumpMetrics.duration,
        cooldownEnd: Date.now() + drive.stats.jumpCooldown * 1000,
        distance: jumpMetrics.distance,
        accuracy: jumpMetrics.accuracy,
        efficiency: drive.stats.efficiency,
        status: 'in-progress' as const,
        failureReason: null,
        crewEffects: [],
        shipEffects: [],
        sporesUsed: sporeCost,
        energyUsed: drive.attributes.energyPerJump,
      };

      // Update drive status
      drive.status.state = 'engaged';
      drive.status.isEngaged = true;
      drive.status.currentJump = {
        active: true,
        origin: jump.origin.coordinates,
        destination: jump.destination.coordinates,
        progress: 0,
        estimatedArrival: Date.now() + jumpMetrics.duration * 1000,
      };
      drive.status.sporeReserves -= sporeCost;
      drive.totalJumps += 1;
      drive.jumpHistory.push(jump);
      drive.lastUsed = Date.now();

      // Simulate jump completion after duration
      setTimeout(() => {
        drive.status.state = 'cooldown';
        drive.status.isEngaged = false;
        drive.status.currentJump = {
          active: false,
          origin: null,
          destination: null,
          progress: 100,
          estimatedArrival: null,
        };
        drive.status.currentCooldown = drive.stats.jumpCooldown;
        
        (jump as any).status = 'completed';
        (jump as any).completedAt = Date.now();
        
        drive.details.totalJumps += 1;
        drive.details.totalDistanceTraveled += jumpMetrics.distance;
        drive.details.successfulJumps += 1;
      }, jumpMetrics.duration * 100);

      res.json({
        message: "Spore drive jump initiated",
        jump,
        drive: {
          id: drive.id,
          name: drive.name,
          state: drive.status.state,
          sporeReserves: drive.status.sporeReserves,
          cooldown: drive.stats.jumpCooldown,
        },
      });
    } catch (error) {
      console.error("Error initiating jump:", error);
      res.status(500).json({ error: "Failed to initiate jump" });
    }
  });

  // Abort current jump
  app.post("/api/spore-drive/:driveId/abort-jump", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      if (!drive.status.isEngaged || !drive.status.currentJump.active) {
        return res.status(400).json({ error: "No active jump to abort" });
      }

      // Abort jump
      const activeJump = drive.jumpHistory.find(j => j.status === 'in-progress');
      if (activeJump) {
        activeJump.status = 'aborted';
        activeJump.failureReason = 'Jump aborted by crew';
      }

      drive.status.state = 'standby';
      drive.status.isEngaged = false;
      drive.status.currentJump = {
        active: false,
        origin: null,
        destination: null,
        progress: 0,
        estimatedArrival: null,
      };
      drive.status.currentCooldown = drive.stats.jumpCooldown * 2; // Double cooldown for abort

      res.json({
        message: "Jump aborted successfully",
        drive: {
          id: drive.id,
          name: drive.name,
          state: drive.status.state,
          cooldown: drive.status.currentCooldown,
        },
      });
    } catch (error) {
      console.error("Error aborting jump:", error);
      res.status(500).json({ error: "Failed to abort jump" });
    }
  });

  // Change drive mode
  app.post("/api/spore-drive/:driveId/set-mode", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const { mode } = req.body;

      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);
      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      const validModes: SporeDriveMode[] = ['standard', 'precision', 'long-range', 'stealth', 'emergency', 'experimental'];
      if (!validModes.includes(mode)) {
        return res.status(400).json({ error: "Invalid drive mode" });
      }

      // Can't change mode while engaged
      if (drive.status.isEngaged) {
        return res.status(400).json({ error: "Cannot change mode while drive is engaged" });
      }

      drive.status.mode = mode;

      // Apply mode modifiers
      switch (mode) {
        case 'precision':
          drive.status.systems.navigation = true;
          break;
        case 'long-range':
          drive.status.systems.network = true;
          break;
        case 'stealth':
          drive.status.systems.containment = true;
          break;
        case 'emergency':
          drive.status.systems.safety = true;
          break;
        case 'experimental':
          drive.status.systems.core = true;
          break;
      }

      res.json({
        message: `Drive mode set to ${mode}`,
        drive: {
          id: drive.id,
          name: drive.name,
          mode: drive.status.mode,
          systems: drive.status.systems,
        },
      });
    } catch (error) {
      console.error("Error setting drive mode:", error);
      res.status(500).json({ error: "Failed to set drive mode" });
    }
  });

  // Upgrade spore drive
  app.post("/api/spore-drive/:driveId/upgrade", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      const userId = req.session?.userId || "";
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Can't upgrade while engaged
      if (drive.status.isEngaged) {
        return res.status(400).json({ error: "Cannot upgrade drive while engaged" });
      }

      const upgradeCost = calculateSporeDriveUpgradeCost(drive.tier, drive.level);

      // In a real implementation, check player resources here
      // For now, just upgrade
      drive.level += 1;
      drive.details.upgradeLevel = drive.level;

      // Recalculate stats
      const typeConfig = SPORE_DRIVE_TYPES[drive.class];
      drive.stats = calculateSporeDriveStats(typeConfig.baseSubStats as any, drive.tier, drive.level);
      drive.subStats = calculateSporeDriveSubStats(typeConfig.baseSubStats, drive.tier, drive.level);
      drive.attributes = calculateSporeDriveAttributes(typeConfig.baseAttributes, drive.tier, drive.level);
      drive.details = generateSporeDriveDetails(drive.name, drive.tier, drive.level);
      drive.status = generateSporeDriveStatus(drive.tier, drive.level);
      drive.networkNodes = generateMycelialNetworkNodes(drive.tier, drive.level);

      res.json({
        message: `Spore drive upgraded to level ${drive.level}`,
        drive,
        cost: upgradeCost,
      });
    } catch (error) {
      console.error("Error upgrading spore drive:", error);
      res.status(500).json({ error: "Failed to upgrade spore drive" });
    }
  });

  // Generate new spore drive (admin/testing)
  app.post("/api/spore-drive/generate", async (req: Request, res: Response) => {
    try {
      const { shipId, shipName, type, tier, level } = req.body;

      const driveId = `drive-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const driveType = type || 'standard';
      const typeConfig = SPORE_DRIVE_TYPES[driveType];
      
      if (!typeConfig) {
        return res.status(400).json({ error: "Invalid spore drive type" });
      }

      const drive: SporeDrive = {
        id: driveId,
        name: `${typeConfig.name} ${driveId.slice(-6).toUpperCase()}`,
        shipId: shipId || "SHIP-001",
        shipName: shipName || "Unknown Ship",
        tier: tier || 1,
        level: level || 1,
        class: driveType as SporeDrive['class'],
        rarity: calculateSporeDriveRarity(driveType, tier || 1, typeConfig.specialProperties),
        stats: calculateSporeDriveStats(typeConfig.baseSubStats as any, tier || 1, level || 1),
        subStats: calculateSporeDriveSubStats(typeConfig.baseSubStats, tier || 1, level || 1),
        attributes: calculateSporeDriveAttributes(typeConfig.baseAttributes, tier || 1, level || 1),
        details: generateSporeDriveDetails(`${typeConfig.name} ${driveId.slice(-6).toUpperCase()}`, tier || 1, level || 1),
        status: generateSporeDriveStatus(tier || 1, level || 1),
        jumpHistory: [],
        totalJumps: 0,
        sporeReserves: {
          'standard-strain': 100,
          'enhanced-strain': 150,
          'experimental-strain': 200,
        },
        sporeCapacity: {
          'standard-strain': 200,
          'enhanced-strain': 300,
          'experimental-strain': 400,
        },
        networkNodes: generateMycelialNetworkNodes(tier || 1, level || 1),
        icon: '🌀',
        color: typeConfig.color,
        description: typeConfig.description,
        lore: typeConfig.lore,
        isActive: true,
        installedAt: Date.now(),
        lastUsed: null,
      };

      const existingDrives = await getSporeDrives(req.session?.userId || "");
      existingDrives.push(drive);
      await setSporeDrives(req.session?.userId || "", existingDrives);

      res.json({
        message: "Spore drive generated successfully",
        drive,
      });
    } catch (error) {
      console.error("Error generating spore drive:", error);
      res.status(500).json({ error: "Failed to generate spore drive" });
    }
  });

  // Recharge spore drive
  app.post("/api/spore-drive/:driveId/recharge", async (req: Request, res: Response) => {
    try {
      const driveId = req.params.driveId;
      const allDrives = await getSporeDrives(req.session?.userId || "");
      const drive = allDrives.find(d => d.id === driveId);

      if (!drive) {
        return res.status(404).json({ error: "Spore drive not found" });
      }

      // Can't recharge while engaged
      if (drive.status.isEngaged) {
        return res.status(400).json({ error: "Cannot recharge drive while engaged" });
      }

      // Calculate recharge amount
      const rechargeAmount = Math.floor(drive.stats.chargeRate * 10); // 10 minutes of charging
      const newReserves = Math.min(drive.status.sporeCapacity, drive.status.sporeReserves + rechargeAmount);

      drive.status.sporeReserves = newReserves;
      drive.status.state = newReserves >= drive.stats.maxCharge ? 'ready' : 'charging';

      res.json({
        message: "Spore drive recharged",
        drive: {
          id: drive.id,
          name: drive.name,
          state: drive.status.state,
          sporeReserves: drive.status.sporeReserves,
          sporeCapacity: drive.status.sporeCapacity,
          rechargeAmount,
        },
      });
    } catch (error) {
      console.error("Error recharging spore drive:", error);
      res.status(500).json({ error: "Failed to recharge spore drive" });
    }
  });
}

/**
 * Calculate spore drive upgrade cost
 */
function calculateSporeDriveUpgradeCost(tier: number, currentLevel: number): { metal: number; crystal: number; deuterium: number } {
  const baseCost = 10000;
  const multiplier = Math.pow(1.6, currentLevel);
  const tierMultiplier = 1 + (tier - 1) * 0.3;

  return {
    metal: Math.floor(baseCost * multiplier * tierMultiplier),
    crystal: Math.floor(baseCost * 0.8 * multiplier * tierMultiplier),
    deuterium: Math.floor(baseCost * 0.5 * multiplier * tierMultiplier),
  };
}