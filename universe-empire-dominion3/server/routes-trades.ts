import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

const router = Router();

function getUserId(req: any): string {
  return req.session?.userId || "";
}

router.get("/api/trades/incoming", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const incoming = await storage.getIncomingTradeOffers(userId);
    res.json(incoming);
  } catch (error) {
    console.error("Failed to load incoming trades:", error);
    res.status(500).json({ message: "Failed to load incoming trades" });
  }
});

router.get("/api/trades/outgoing", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const outgoing = await storage.getOutgoingTradeOffers(userId);
    res.json(outgoing);
  } catch (error) {
    console.error("Failed to load outgoing trades:", error);
    res.status(500).json({ message: "Failed to load outgoing trades" });
  }
});

router.get("/api/trades/history", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const history = await storage.getTradeHistory(userId);
    res.json(history);
  } catch (error) {
    console.error("Failed to load trade history:", error);
    res.status(500).json({ message: "Failed to load trade history" });
  }
});

router.post("/api/trades", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const receiverName = String(req.body?.receiverName || "").trim();
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    const offerMetal = Math.max(0, Number(req.body?.offerMetal || 0));
    const offerCrystal = Math.max(0, Number(req.body?.offerCrystal || 0));
    const offerDeuterium = Math.max(0, Number(req.body?.offerDeuterium || 0));

    const requestMetal = Math.max(0, Number(req.body?.requestMetal || 0));
    const requestCrystal = Math.max(0, Number(req.body?.requestCrystal || 0));
    const requestDeuterium = Math.max(0, Number(req.body?.requestDeuterium || 0));

    if (!receiverName) {
      return res.status(400).json({ message: "Recipient username is required" });
    }

    if (
      offerMetal + offerCrystal + offerDeuterium <= 0 &&
      requestMetal + requestCrystal + requestDeuterium <= 0
    ) {
      return res.status(400).json({ message: "Trade must include offered or requested resources" });
    }

    const sender = await storage.getUser(userId);
    const receiver = await storage.getUserByUsername(receiverName);

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    if (!receiver) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (receiver.id === sender.id) {
      return res.status(400).json({ message: "Cannot create a trade with yourself" });
    }

    const trade = await storage.createTradeOffer({
      senderId: sender.id,
      senderName: sender.username || "Commander",
      receiverId: receiver.id,
      receiverName: receiver.username || receiverName,
      offerMetal,
      offerCrystal,
      offerDeuterium,
      offerItems: [],
      requestMetal,
      requestCrystal,
      requestDeuterium,
      requestItems: [],
      message,
      expiresAt: null,
      counterOfferId: null,
      originalOfferId: null,
    });

    try {
      await storage.createMessage({
        to: receiver.id,
        from: sender.username || "Commander",
        subject: "New Trade Offer Received",
        body: `You have received a new trade offer from ${sender.username || "Commander"}.\n\n${sender.username || "Commander"} offers:\n${offerMetal > 0 ? `  ${offerMetal.toLocaleString()} Metal\n` : ""}${offerCrystal > 0 ? `  ${offerCrystal.toLocaleString()} Crystal\n` : ""}${offerDeuterium > 0 ? `  ${offerDeuterium.toLocaleString()} Deuterium\n` : ""}\n${sender.username || "Commander"} requests:\n${requestMetal > 0 ? `  ${requestMetal.toLocaleString()} Metal\n` : ""}${requestCrystal > 0 ? `  ${requestCrystal.toLocaleString()} Crystal\n` : ""}${requestDeuterium > 0 ? `  ${requestDeuterium.toLocaleString()} Deuterium\n` : ""}${message ? `\nMessage: ${message}` : ""}`,
        type: "player",
        read: false,
      } as any);
    } catch (notifyError) {
      console.error("Failed to send trade notification:", notifyError);
    }

    res.status(201).json(trade);
  } catch (error) {
    console.error("Failed to create trade offer:", error);
    res.status(500).json({ message: "Failed to create trade offer" });
  }
});

router.post("/api/trades/:tradeId/accept", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await storage.acceptTradeOffer(req.params.tradeId, userId);
    if (!result.success) {
      return res.status(400).json({ message: result.error || "Failed to accept trade" });
    }

    try {
      const trade = result.trade;
      const playerState = await storage.getPlayerState(userId);
      const playerName = (playerState as any)?.empireName || "Commander";
      if (trade?.senderId) {
        await storage.createMessage({
          to: trade.senderId,
          from: "Trade System",
          subject: `Trade Accepted by ${playerName}`,
          body: `Your trade offer has been accepted by ${playerName}. Resources have been exchanged successfully.\n\nOffer: ${trade.offerMetal || 0} Metal, ${trade.offerCrystal || 0} Crystal, ${trade.offerDeuterium || 0} Deuterium\nRequest: ${trade.requestMetal || 0} Metal, ${trade.requestCrystal || 0} Crystal, ${trade.requestDeuterium || 0} Deuterium`,
          type: "player",
          read: false,
        } as any);
      }
    } catch (notifyError) {
      console.error("Failed to send trade notification:", notifyError);
    }

    res.json({ success: true, trade: result.trade });
  } catch (error) {
    console.error("Failed to accept trade:", error);
    res.status(500).json({ message: "Failed to accept trade" });
  }
});

router.post("/api/trades/:tradeId/decline", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await storage.declineTradeOffer(req.params.tradeId, userId);
    if (!result.success) {
      return res.status(400).json({ message: result.error || "Failed to decline trade" });
    }

    try {
      const playerState = await storage.getPlayerState(userId);
      const playerName = (playerState as any)?.empireName || "Commander";
      const trade = await storage.getTradeOfferById(req.params.tradeId);
      if (trade) {
        await storage.createMessage({
          to: trade.senderId,
          from: "Trade System",
          subject: `Trade Declined by ${playerName}`,
          body: `Your trade offer has been declined by ${playerName}. You may send a new offer or negotiate different terms.\n\nYour offer: ${trade.offerMetal || 0} Metal, ${trade.offerCrystal || 0} Crystal, ${trade.offerDeuterium || 0} Deuterium`,
          type: "player",
          read: false,
        } as any);
      }
    } catch (notifyError) {
      console.error("Failed to send trade notification:", notifyError);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to decline trade:", error);
    res.status(500).json({ message: "Failed to decline trade" });
  }
});

router.post("/api/trades/:tradeId/cancel", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await storage.cancelTradeOffer(req.params.tradeId, userId);
    if (!result.success) {
      return res.status(400).json({ message: result.error || "Failed to cancel trade" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to cancel trade:", error);
    res.status(500).json({ message: "Failed to cancel trade" });
  }
});

export default router;
