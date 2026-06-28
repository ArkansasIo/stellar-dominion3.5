import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const friends = await storage.getPlayerFriends(userId);

    res.json(
      friends.map((friend) => ({
        ...friend,
        friendName: friend.nickname || friend.friendId,
      }))
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
      requests.map((request) => ({
        ...request,
        senderName: request.senderId,
      }))
    );
  } catch (error) {
    console.error("[friends] Failed to fetch friend requests", error);
    res.status(500).json({ error: "Failed to fetch friend requests" });
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

export default router;
