import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const friends = await storage.getPlayerFriends(userId);

    res.json(
      await Promise.all(
        friends.map(async (friend) => {
          const user = await storage.getUser(friend.friendId);
          return {
            ...friend,
            friendName: user?.username || friend.nickname || friend.friendId,
          };
        })
      )
    );
  } catch (error) {
    console.error("[friends] Failed to fetch friends", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});

router.get("/requests", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const requests = await storage.getPlayerFriendRequests(userId);

    res.json(
      await Promise.all(
        requests.map(async (request) => {
          const sender = await storage.getUser(request.senderId);
          return {
            ...request,
            senderName: sender?.username || request.senderId,
          };
        })
      )
    );
  } catch (error) {
    console.error("[friends] Failed to fetch friend requests", error);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
});

router.post("/requests", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const targetUsername = String(req.body?.username || "").trim();
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : undefined;

    if (!targetUsername) {
      return res.status(400).json({ error: "Username is required" });
    }

    const targetUser = await storage.getUserByUsername(targetUsername);
    if (!targetUser?.id) {
      return res.status(404).json({ error: "Commander not found" });
    }

    if (targetUser.id === userId) {
      return res.status(400).json({ error: "You cannot send a friend request to yourself" });
    }

    const currentFriends = await storage.getPlayerFriends(userId);
    if (currentFriends.some((friend) => friend.friendId === targetUser.id)) {
      return res.status(409).json({ error: "Commander is already on your friends list" });
    }

    const targetIncomingRequests = await storage.getPlayerFriendRequests(targetUser.id);
    if (targetIncomingRequests.some((request) => request.senderId === userId)) {
      return res.status(409).json({ error: "Friend request already pending" });
    }

    const currentIncomingRequests = await storage.getPlayerFriendRequests(userId);
    if (currentIncomingRequests.some((request) => request.senderId === targetUser.id)) {
      return res.status(409).json({ error: "This commander has already sent you a friend request" });
    }

    const created = await storage.addFriend(userId, targetUser.id, message);
    res.status(201).json({
      success: true,
      data: created,
      receiverName: targetUser.username || targetUser.id,
    });
  } catch (error) {
    console.error("[friends] Failed to create friend request", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create friend request" });
  }
});

router.post("/requests/:requestId/accept", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const requestId = String(req.params.requestId);

    const requests = await storage.getPlayerFriendRequests(userId);
    const belongsToUser = requests.some((request) => request.id === requestId);
    if (!belongsToUser) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    const accepted = await storage.acceptFriendRequest(requestId);
    res.json({ success: true, data: accepted });
  } catch (error) {
    console.error("[friends] Failed to accept friend request", error);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
});

router.post("/requests/:requestId/reject", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const requestId = String(req.params.requestId);

    const requests = await storage.getPlayerFriendRequests(userId);
    const belongsToUser = requests.some((request) => request.id === requestId);
    if (!belongsToUser) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    const rejected = await storage.rejectFriendRequest(requestId);
    res.json({ success: true, data: rejected });
  } catch (error) {
    console.error("[friends] Failed to reject friend request", error);
    res.status(500).json({ error: "Failed to reject friend request" });
  }
});

router.delete("/:friendId", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const friendId = String(req.params.friendId);

    await storage.removeFriend(userId, friendId);
    res.json({ success: true });
  } catch (error) {
    console.error("[friends] Failed to remove friend", error);
    res.status(500).json({ error: "Failed to remove friend" });
  }
});

router.patch("/:friendId/favorite", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const friendId = String(req.params.friendId);
    const isFavorite = Boolean(req.body?.isFavorite);

    const updated = await storage.setFavorite(userId, friendId, isFavorite);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("[friends] Failed to update favorite status", error);
    res.status(500).json({ error: "Failed to update favorite status" });
  }
});

router.patch("/:friendId/nickname", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const friendId = String(req.params.friendId);
    const nickname = String(req.body?.nickname || "").trim();

    if (!nickname) {
      return res.status(400).json({ error: "Nickname is required" });
    }

    const updated = await storage.updateFriendNickname(userId, friendId, nickname);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("[friends] Failed to update nickname", error);
    res.status(500).json({ error: "Failed to update nickname" });
  }
});

export default router;
