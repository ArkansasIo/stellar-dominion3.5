import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    const notes = await storage.getNotes(userId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    const note = await storage.getNoteById(req.params.id);
    if (!note || note.userId !== userId) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    const { title, content, category, tags, isPinned, color } = req.body;
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }
    const note = await storage.createNote(userId, {
      title: title.trim(),
      content: content || "",
      category: category || "general",
      tags: tags || [],
      isPinned: isPinned || false,
      color: color || null,
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    const existing = await storage.getNoteById(req.params.id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Note not found" });
    }
    const { title, content, category, tags, isPinned, color } = req.body;
    const updates: Record<string, any> = {};
    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (isPinned !== undefined) updates.isPinned = isPinned;
    if (color !== undefined) updates.color = color || null;
    const updated = await storage.updateNote(req.params.id, userId, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    const existing = await storage.getNoteById(req.params.id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Note not found" });
    }
    await storage.deleteNote(req.params.id, userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
