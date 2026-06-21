/**
 * HIGH COMMAND ROUTES
 * ============================================================================
 * Endpoints for the High Command system:
 *   GET  /api/high-command/status          – Full high command status
 *   GET  /api/high-command/ranks           – All command ranks
 *   GET  /api/high-command/officer-slots   – All officer slot configs
 *   GET  /api/high-command/strategic-orders – All strategic order configs
 *   GET  /api/high-command/leader-synergies – All leader synergy configs
 *   POST /api/high-command/assign-officer  – Assign commander to officer slot
 *   POST /api/high-command/remove-officer  – Remove commander from officer slot
 *   POST /api/high-command/issue-order     – Issue a strategic order
 *   POST /api/high-command/cancel-order    – Cancel an active order
 *   POST /api/high-command/join-war-council – Join war council
 *   POST /api/high-command/leave-war-council – Leave war council
 *   GET  /api/high-command/bonuses         – Calculate total command bonuses
 *   POST /api/high-command/prestige        – Award prestige
 *   POST /api/high-command/rank-up         – Attempt rank up
 */

import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import {
  COMMAND_RANKS,
  OFFICER_SLOTS,
  STRATEGIC_ORDERS,
  LEADER_SYNERGIES,
  getDefaultHighCommandState,
  calculateCommandRank,
  getRankConfig,
  calculateTotalCommandBonuses,
  canAssignToSlot,
  processStrategicOrder,
  processOrderTick,
  detectSynergies,
  calculateWarCouncilBonus,
  calculatePrestigeGain,
} from "@shared/config/highCommandSystem";
import type {
  CommandRank,
  OfficerSlot,
  StrategicOrderType,
  HighCommandState,
} from "@shared/config/highCommandSystem";

// ─── helpers ─────────────────────────────────────────────────────────────────

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!getUserId(req)) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

function getHighCommandState(playerState: any): HighCommandState {
  if (playerState?.highCommandState) return playerState.highCommandState;
  return getDefaultHighCommandState();
}

// ─── routes ─────────────────────────────────────────────────────────────────

export function registerHighCommandRoutes(app: Express) {
  // ─── High Command Status ──────────────────────────────────────────────────
  app.get("/api/high-command/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const hcState = getHighCommandState(playerState);
      const rankConfig = getRankConfig(hcState.rank);
      const bonuses = calculateTotalCommandBonuses(hcState);
      const warCouncilBonus = calculateWarCouncilBonus(hcState.warCouncil);

      res.json({
        success: true,
        state: hcState,
        rankConfig,
        bonuses,
        warCouncilBonus,
        officerSlots: OFFICER_SLOTS,
        activeOrders: hcState.activeOrders,
        unlockedSynergies: hcState.unlockedSynergies.map((id) => {
          const synergy = LEADER_SYNERGIES.find((s) => s.id === id);
          return synergy ? { id: synergy.id, name: synergy.name, icon: synergy.icon, description: synergy.description } : null;
        }).filter(Boolean),
      });
    } catch (error: any) {
      console.error("[high-command/status]", error);
      res.status(500).json({ message: "Failed to load high command status" });
    }
  });

  // ─── Command Ranks ────────────────────────────────────────────────────────
  app.get("/api/high-command/ranks", isAuthenticated, async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        ranks: COMMAND_RANKS,
      });
    } catch (error: any) {
      console.error("[high-command/ranks]", error);
      res.status(500).json({ message: "Failed to load command ranks" });
    }
  });

  // ─── Officer Slots ────────────────────────────────────────────────────────
  app.get("/api/high-command/officer-slots", isAuthenticated, async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        slots: OFFICER_SLOTS,
      });
    } catch (error: any) {
      console.error("[high-command/officer-slots]", error);
      res.status(500).json({ message: "Failed to load officer slots" });
    }
  });

  // ─── Strategic Orders ─────────────────────────────────────────────────────
  app.get("/api/high-command/strategic-orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        orders: STRATEGIC_ORDERS,
      });
    } catch (error: any) {
      console.error("[high-command/strategic-orders]", error);
      res.status(500).json({ message: "Failed to load strategic orders" });
    }
  });

  // ─── Leader Synergies ─────────────────────────────────────────────────────
  app.get("/api/high-command/leader-synergies", isAuthenticated, async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        synergies: LEADER_SYNERGIES,
      });
    } catch (error: any) {
      console.error("[high-command/leader-synergies]", error);
      res.status(500).json({ message: "Failed to load leader synergies" });
    }
  });

  // ─── Assign Officer ───────────────────────────────────────────────────────
  app.post("/api/high-command/assign-officer", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const { slot, commanderInstanceId } = req.body as { slot: OfficerSlot; commanderInstanceId: string };
      if (!slot || !commanderInstanceId) {
        return res.status(400).json({ message: "Missing slot or commanderInstanceId" });
      }

      const hcState = getHighCommandState(playerState);
      const slotConfig = OFFICER_SLOTS.find((s) => s.slot === slot);
      if (!slotConfig) return res.status(400).json({ message: "Invalid officer slot" });

      // Check if slot is unlocked
      const slotIndex = OFFICER_SLOTS.findIndex((s) => s.slot === slot);
      if (slotIndex >= hcState.officerAssignments.length) {
        return res.status(400).json({ message: "Officer slot not yet unlocked" });
      }

      // Check if commander is in inventory
      const inventory = Array.isArray((playerState as any).commanderInventory) ? (playerState as any).commanderInventory : [];
      const commander = inventory.find((c: any) => c.instanceId === commanderInstanceId);
      if (!commander) return res.status(400).json({ message: "Commander not found in inventory" });

      // Check if commander is already assigned to another slot
      const alreadyAssigned = hcState.officerAssignments.find(
        (a) => a.commanderInstanceId === commanderInstanceId
      );
      if (alreadyAssigned) {
        return res.status(400).json({ message: "Commander already assigned to slot: " + alreadyAssigned.slot });
      }

      // Update assignment
      const newAssignments = hcState.officerAssignments.map((a) => {
        if (a.slot === slot) {
          return {
            ...a,
            commanderInstanceId,
            assignedAt: Date.now(),
            synergyId: null,
          };
        }
        return a;
      });

      const newState = { ...hcState, officerAssignments: newAssignments };

      // Detect synergies
      const leaderArchetypes: Record<OfficerSlot, any> = {} as any;
      const commanderClasses: Record<OfficerSlot, string | null> = {} as any;
      for (const a of newAssignments) {
        leaderArchetypes[a.slot] = null; // Will be populated from government leaders
        commanderClasses[a.slot] = commander.class || commander.type || null;
      }
      const detectedSynergies = detectSynergies(newState, leaderArchetypes, commanderClasses);
      newState.unlockedSynergies = detectedSynergies;

      await storage.updatePlayerState(userId, { highCommandState: newState } as any);

      res.json({
        success: true,
        message: `Commander assigned to ${slotConfig.name}`,
        state: newState,
      });
    } catch (error: any) {
      console.error("[high-command/assign-officer]", error);
      res.status(500).json({ message: error?.message || "Failed to assign officer" });
    }
  });

  // ─── Remove Officer ───────────────────────────────────────────────────────
  app.post("/api/high-command/remove-officer", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const { slot } = req.body as { slot: OfficerSlot };
      if (!slot) return res.status(400).json({ message: "Missing slot" });

      const hcState = getHighCommandState(playerState);
      const newAssignments = hcState.officerAssignments.map((a) => {
        if (a.slot === slot) {
          return { ...a, commanderInstanceId: null, assignedAt: null, synergyId: null };
        }
        return a;
      });

      const newState = { ...hcState, officerAssignments: newAssignments };
      await storage.updatePlayerState(userId, { highCommandState: newState } as any);

      res.json({
        success: true,
        message: `Commander removed from ${slot}`,
        state: newState,
      });
    } catch (error: any) {
      console.error("[high-command/remove-officer]", error);
      res.status(500).json({ message: error?.message || "Failed to remove officer" });
    }
  });

  // ─── Issue Strategic Order ────────────────────────────────────────────────
  app.post("/api/high-command/issue-order", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const { orderType } = req.body as { orderType: StrategicOrderType };
      if (!orderType) return res.status(400).json({ message: "Missing orderType" });

      const hcState = getHighCommandState(playerState);
      const result = processStrategicOrder(hcState, orderType);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      await storage.updatePlayerState(userId, { highCommandState: result.newState } as any);

      res.json({
        success: true,
        message: `Strategic order issued: ${orderType}`,
        state: result.newState,
      });
    } catch (error: any) {
      console.error("[high-command/issue-order]", error);
      res.status(500).json({ message: error?.message || "Failed to issue order" });
    }
  });

  // ─── Cancel Order ─────────────────────────────────────────────────────────
  app.post("/api/high-command/cancel-order", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const { orderType } = req.body as { orderType: StrategicOrderType };
      if (!orderType) return res.status(400).json({ message: "Missing orderType" });

      const hcState = getHighCommandState(playerState);
      const orderIndex = hcState.activeOrders.findIndex((o) => o.type === orderType);
      if (orderIndex === -1) {
        return res.status(400).json({ message: "Order not active" });
      }

      const newOrders = [...hcState.activeOrders];
      newOrders.splice(orderIndex, 1);
      const newState = { ...hcState, activeOrders: newOrders };

      await storage.updatePlayerState(userId, { highCommandState: newState } as any);

      res.json({
        success: true,
        message: `Order cancelled: ${orderType}`,
        state: newState,
      });
    } catch (error: any) {
      console.error("[high-command/cancel-order]", error);
      res.status(500).json({ message: error?.message || "Failed to cancel order" });
    }
  });

  // ─── Join War Council ─────────────────────────────────────────────────────
  app.post("/api/high-command/join-war-council", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const { commanderInstanceId, role } = req.body as { commanderInstanceId: string; role: string };
      if (!commanderInstanceId) return res.status(400).json({ message: "Missing commanderInstanceId" });

      const hcState = getHighCommandState(playerState);

      // Check rank requirement (commodore or higher)
      const rankIndex = COMMAND_RANKS.findIndex((r) => r.rank === hcState.rank);
      const commodoreIndex = COMMAND_RANKS.findIndex((r) => r.rank === "commodore");
      if (rankIndex < commodoreIndex) {
        return res.status(400).json({ message: "Requires Commodore rank or higher" });
      }

      // Check if already in council
      if (hcState.warCouncil.find((m) => m.commanderInstanceId === commanderInstanceId)) {
        return res.status(400).json({ message: "Commander already in war council" });
      }

      // Check max council size (10)
      if (hcState.warCouncil.length >= 10) {
        return res.status(400).json({ message: "War council is full (max 10 members)" });
      }

      const newMember = {
        commanderInstanceId,
        role: role || "member",
        joinedAt: Date.now(),
        contributionBonus: 10 + Math.floor(Math.random() * 20),
      };

      const newState = {
        ...hcState,
        warCouncil: [...hcState.warCouncil, newMember],
      };

      await storage.updatePlayerState(userId, { highCommandState: newState } as any);

      res.json({
        success: true,
        message: "Commander joined war council",
        state: newState,
      });
    } catch (error: any) {
      console.error("[high-command/join-war-council]", error);
      res.status(500).json({ message: error?.message || "Failed to join war council" });
    }
  });

  // ─── Leave War Council ────────────────────────────────────────────────────
  app.post("/api/high-command/leave-war-council", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const { commanderInstanceId } = req.body as { commanderInstanceId: string };
      if (!commanderInstanceId) return res.status(400).json({ message: "Missing commanderInstanceId" });

      const hcState = getHighCommandState(playerState);
      const newState = {
        ...hcState,
        warCouncil: hcState.warCouncil.filter((m) => m.commanderInstanceId !== commanderInstanceId),
      };

      await storage.updatePlayerState(userId, { highCommandState: newState } as any);

      res.json({
        success: true,
        message: "Commander left war council",
        state: newState,
      });
    } catch (error: any) {
      console.error("[high-command/leave-war-council]", error);
      res.status(500).json({ message: error?.message || "Failed to leave war council" });
    }
  });

  // ─── Calculate Bonuses ────────────────────────────────────────────────────
  app.get("/api/high-command/bonuses", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const hcState = getHighCommandState(playerState);
      const bonuses = calculateTotalCommandBonuses(hcState);
      const warCouncilBonus = calculateWarCouncilBonus(hcState.warCouncil);

      res.json({
        success: true,
        bonuses,
        warCouncilBonus,
        rank: hcState.rank,
        prestige: hcState.prestige,
      });
    } catch (error: any) {
      console.error("[high-command/bonuses]", error);
      res.status(500).json({ message: "Failed to calculate bonuses" });
    }
  });

  // ─── Award Prestige ───────────────────────────────────────────────────────
  app.post("/api/high-command/prestige", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const { amount, reason } = req.body as { amount: number; reason?: string };
      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ message: "Invalid prestige amount" });
      }

      const hcState = getHighCommandState(playerState);
      const newState = {
        ...hcState,
        prestige: hcState.prestige + amount,
        experience: hcState.experience + Math.floor(amount * 0.5),
      };

      // Check for rank up
      const newRank = calculateCommandRank(newState.experience, newState.prestige);
      if (newRank !== hcState.rank) {
        newState.rank = newRank;
        newState.rankUpHistory = [...hcState.rankUpHistory, { rank: newRank, timestamp: Date.now() }];
        // Unlock more officer slots
        const rankConfig = getRankConfig(newRank);
        if (rankConfig) {
          const currentSlots = newState.officerAssignments.length;
          const neededSlots = rankConfig.officerSlotsUnlocked;
          if (neededSlots > currentSlots) {
            const newSlots = OFFICER_SLOTS.slice(currentSlots, neededSlots).map((s) => ({
              slot: s.slot,
              commanderInstanceId: null,
              assignedAt: null,
              synergyId: null,
            }));
            newState.officerAssignments = [...newState.officerAssignments, ...newSlots];
          }
        }
      }

      await storage.updatePlayerState(userId, { highCommandState: newState } as any);

      res.json({
        success: true,
        message: `Awarded ${amount} prestige${reason ? ` for ${reason}` : ""}`,
        state: newState,
        rankChanged: newRank !== hcState.rank,
        newRank,
      });
    } catch (error: any) {
      console.error("[high-command/prestige]", error);
      res.status(500).json({ message: error?.message || "Failed to award prestige" });
    }
  });

  // ─── Rank Up ──────────────────────────────────────────────────────────────
  app.post("/api/high-command/rank-up", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const hcState = getHighCommandState(playerState);
      const newRank = calculateCommandRank(hcState.experience, hcState.prestige);

      if (newRank === hcState.rank) {
        return res.status(400).json({ message: "No rank up available" });
      }

      const newState = {
        ...hcState,
        rank: newRank,
        rankUpHistory: [...hcState.rankUpHistory, { rank: newRank, timestamp: Date.now() }],
      };

      // Unlock more officer slots
      const rankConfig = getRankConfig(newRank);
      if (rankConfig) {
        const currentSlots = newState.officerAssignments.length;
        const neededSlots = rankConfig.officerSlotsUnlocked;
        if (neededSlots > currentSlots) {
          const newSlots = OFFICER_SLOTS.slice(currentSlots, neededSlots).map((s) => ({
            slot: s.slot,
            commanderInstanceId: null,
            assignedAt: null,
            synergyId: null,
          }));
          newState.officerAssignments = [...newState.officerAssignments, ...newSlots];
        }
      }

      await storage.updatePlayerState(userId, { highCommandState: newState } as any);

      res.json({
        success: true,
        message: `Rank up to ${newRank}!`,
        state: newState,
        rankConfig: getRankConfig(newRank),
      });
    } catch (error: any) {
      console.error("[high-command/rank-up]", error);
      res.status(500).json({ message: error?.message || "Failed to rank up" });
    }
  });
}