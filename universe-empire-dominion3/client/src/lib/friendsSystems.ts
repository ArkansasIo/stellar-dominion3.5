export interface Friend {
  id: string;
  playerId: string;
  friendId: string;
  friendName: string;
  nickname: string | null;
  favorite: boolean;
  status: string;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface FriendshipStatus {
  areFriends: boolean;
  hasPendingRequest: boolean;
  requestDirection: "sent" | "received" | null;
}

export async function fetchFriends(): Promise<Friend[]> {
  const res = await fetch("/api/friends", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load friends");
  const data = await res.json();
  return data.friends || data || [];
}

export async function fetchFriendRequests(): Promise<FriendRequest[]> {
  const res = await fetch("/api/friends/requests", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load friend requests");
  const data = await res.json();
  return data.requests || data || [];
}

export async function sendFriendRequest(userId: string): Promise<FriendRequest> {
  const res = await fetch("/api/friends/requests", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to send friend request");
  const data = await res.json();
  return data.request || data;
}

export async function acceptRequest(requestId: string): Promise<void> {
  const res = await fetch(`/api/friends/requests/${requestId}/accept`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to accept friend request");
}

export async function rejectRequest(requestId: string): Promise<void> {
  const res = await fetch(`/api/friends/requests/${requestId}/reject`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to reject friend request");
}

export async function removeFriend(friendId: string): Promise<void> {
  const res = await fetch(`/api/friends/${friendId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to remove friend");
}

export async function toggleFavorite(friendId: string): Promise<Friend> {
  const res = await fetch(`/api/friends/${friendId}/favorite`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to toggle favorite");
  const data = await res.json();
  return data.friend || data;
}

export async function setNickname(friendId: string, nickname: string): Promise<Friend> {
  const res = await fetch(`/api/friends/${friendId}/nickname`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });
  if (!res.ok) throw new Error("Failed to set nickname");
  const data = await res.json();
  return data.friend || data;
}
