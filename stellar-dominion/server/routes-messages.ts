import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = String((req.session as any)?.userId || "");
    const limit = Math.min(200, Math.max(1, Number.parseInt(String(req.query.limit || "50"), 10) || 50));
    const messages = await storage.getMessagesByUser(userId, limit);
    res.json(messages);
  } catch (error) {
    console.error("[messages] Failed to fetch messages", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userId = String((req.session as any)?.userId || "");
    const { toUserId, to, subject, body, type } = req.body || {};

    if (!subject || !body) {
      return res.status(400).json({ error: "Subject and body are required" });
    }

    if (!toUserId && !to) {
      return res.status(400).json({ error: "Recipient is required" });
    }

    const sender = await storage.getUser(userId);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const recipient = toUserId
      ? await storage.getUser(String(toUserId))
      : await storage.getUserByUsername(String(to));

    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    if (recipient.id === sender.id) {
      return res.status(400).json({ error: "Cannot send message to yourself" });
    }

    const created = await storage.createMessage({
      fromUserId: sender.id,
      toUserId: recipient.id,
      from: sender.username || sender.firstName || "Commander",
      to: recipient.username || recipient.firstName || "Commander",
      subject: String(subject),
      body: String(body),
      type: String(type || "player"),
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("[messages] Failed to send message", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.patch("/:id/read", isAuthenticated, async (req, res) => {
  try {
    const userId = String((req.session as any)?.userId || "");
    const id = String(req.params.id || "");
    const updated = await storage.markMessageAsReadByUser(userId, id);

    if (!updated) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("[messages] Failed to mark message as read", error);
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = String((req.session as any)?.userId || "");
    const id = String(req.params.id || "");
    const deleted = await storage.deleteMessageByUser(userId, id);

    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("[messages] Failed to delete message", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
