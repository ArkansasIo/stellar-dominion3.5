import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Heart, Trash2, UserPlus, Users } from "lucide-react";

type FriendRecord = {
  id: string;
  friendId: string;
  nickname: string | null;
  friendName: string;
  isOnline: boolean | null;
  lastSeen: string | null;
  isFavorite: boolean | null;
  notes?: string | null;
};

type FriendRequestRecord = {
  id: string;
  senderId: string;
  senderName: string;
  message: string | null;
  createdAt?: string | null;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || "Request failed");
  }

  return payload as T;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString();
}

export default function FriendsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [requestUsername, setRequestUsername] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [nicknameDraft, setNicknameDraft] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: friendsLoading } = useQuery<FriendRecord[]>({
    queryKey: ["friends"],
    queryFn: () => fetchJson<FriendRecord[]>("/api/friends"),
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery<FriendRequestRecord[]>({
    queryKey: ["friend-requests"],
    queryFn: () => fetchJson<FriendRequestRecord[]>("/api/friends/requests"),
  });

  const refreshSocialData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["friends"] }),
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
    ]);
  };

  const acceptRequestMutation = useMutation({
    mutationFn: (requestId: string) =>
      fetchJson(`/api/friends/requests/${requestId}/accept`, { method: "POST" }),
    onSuccess: async () => {
      await refreshSocialData();
      toast({ title: "Request accepted", description: "Friend added successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Accept failed", description: error.message, variant: "destructive" });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: (requestId: string) =>
      fetchJson(`/api/friends/requests/${requestId}/reject`, { method: "POST" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      toast({ title: "Request rejected", description: "Friend request declined." });
    },
    onError: (error: Error) => {
      toast({ title: "Reject failed", description: error.message, variant: "destructive" });
    },
  });

  const sendFriendRequestMutation = useMutation({
    mutationFn: () =>
      fetchJson("/api/friends/requests", {
        method: "POST",
        body: JSON.stringify({
          username: requestUsername.trim(),
          message: requestMessage.trim(),
        }),
      }),
    onSuccess: async () => {
      setRequestUsername("");
      setRequestMessage("");
      await queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      toast({ title: "Request sent", description: "Friend request transmitted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Request failed", description: error.message, variant: "destructive" });
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: (friendId: string) => fetchJson(`/api/friends/${friendId}`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast({ title: "Friend removed", description: "Friend removed from your list." });
    },
    onError: (error: Error) => {
      toast({ title: "Remove failed", description: error.message, variant: "destructive" });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ friendId, isFavorite }: { friendId: string; isFavorite: boolean }) =>
      fetchJson(`/api/friends/${friendId}/favorite`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorite }),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast({ title: "Contact updated", description: "Favorite status changed." });
    },
    onError: (error: Error) => {
      toast({ title: "Favorite update failed", description: error.message, variant: "destructive" });
    },
  });

  const nicknameMutation = useMutation({
    mutationFn: ({ friendId, nickname }: { friendId: string; nickname: string }) =>
      fetchJson(`/api/friends/${friendId}/nickname`, {
        method: "PATCH",
        body: JSON.stringify({ nickname }),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast({ title: "Nickname saved", description: "Contact alias updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Nickname failed", description: error.message, variant: "destructive" });
    },
  });

  const filteredFriends = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return friends;

    return friends.filter((friend) => {
      const nickname = friend.nickname?.toLowerCase() || "";
      const friendName = friend.friendName?.toLowerCase() || "";
      return nickname.includes(term) || friendName.includes(term);
    });
  }, [friends, searchQuery]);

  const selectedFriend =
    filteredFriends.find((friend) => friend.id === selectedFriendId) ?? filteredFriends[0] ?? null;

  useEffect(() => {
    setNicknameDraft(selectedFriend?.nickname || selectedFriend?.friendName || "");
  }, [selectedFriend?.id, selectedFriend?.nickname, selectedFriend?.friendName]);

  const friendsCount = friends.length;
  const onlineCount = friends.filter((friend) => Boolean(friend.isOnline)).length;
  const favoritesCount = friends.filter((friend) => Boolean(friend.isFavorite)).length;
  const offlineCount = Math.max(0, friendsCount - onlineCount);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="friends-page">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 font-orbitron text-3xl font-bold text-slate-900">
              <Users className="h-8 w-8 text-primary" />
              Friends Network
            </h1>
            <p className="mt-1 font-rajdhani text-lg text-muted-foreground">
              Track online allies, clear incoming requests, and keep your social command roster organized.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Roster Capacity</div>
            <div className="mt-1 font-rajdhani text-lg font-semibold uppercase tracking-wider text-slate-900">
              {friendsCount}/50
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Total Friends</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-slate-900">{friendsCount}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-emerald-700">Online Now</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-emerald-900">{onlineCount}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-amber-700">Pending Requests</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-amber-900">{requests.length}</div>
            </CardContent>
          </Card>
          <Card className="border-rose-200 bg-rose-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-rose-700">Favorites</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-rose-900">{favoritesCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-indigo-200 bg-indigo-50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-orbitron text-indigo-900">Diplomatic Contact Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 text-sm text-indigo-900 md:grid-cols-3">
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Prioritize online favorites for live operations and urgent reinforcement requests.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Keep the pending queue clear so alliance invites and social workflows do not stall behind old requests.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Review offline contacts before raid launches to spot commanders who need asynchronous mission updates.
            </div>
          </CardContent>
        </Card>

        {requests.length > 0 && (
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-orbitron text-slate-900">
                <UserPlus className="h-5 w-5 text-amber-600" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{request.senderName}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {request.message || "No message attached to this request."}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-wider text-slate-500">
                      Received {formatDate(request.createdAt)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptRequestMutation.mutate(request.id)}
                      disabled={acceptRequestMutation.isPending}
                      data-testid={`button-accept-request-${request.id}`}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectRequestMutation.mutate(request.id)}
                      disabled={rejectRequestMutation.isPending}
                      data-testid={`button-reject-request-${request.id}`}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr,1fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,320px]">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <Input
                    placeholder="Search friends by nickname or commander name..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="bg-slate-50 border-slate-200"
                    data-testid="input-search-friends"
                  />
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-orbitron text-slate-900">Add Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Commander username"
                    value={requestUsername}
                    onChange={(event) => setRequestUsername(event.target.value)}
                    className="bg-slate-50 border-slate-200"
                    data-testid="input-request-username"
                  />
                  <Input
                    placeholder="Optional note"
                    value={requestMessage}
                    onChange={(event) => setRequestMessage(event.target.value)}
                    className="bg-slate-50 border-slate-200"
                    data-testid="input-request-message"
                  />
                  <Button
                    className="w-full"
                    onClick={() => sendFriendRequestMutation.mutate()}
                    disabled={sendFriendRequestMutation.isPending || !requestUsername.trim()}
                    data-testid="button-send-friend-request"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {sendFriendRequestMutation.isPending ? "Sending..." : "Send Request"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {(friendsLoading || requestsLoading) && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 text-sm text-slate-500">Loading social roster...</CardContent>
              </Card>
            )}

            {!friendsLoading && filteredFriends.length === 0 && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-10 text-center text-slate-500">
                  {friendsCount === 0
                    ? "No friends added yet."
                    : "No friends match your current search."}
                </CardContent>
              </Card>
            )}

            {filteredFriends.map((friend) => {
              const isSelected = selectedFriend?.id === friend.id;

              return (
                <Card
                  key={friend.id}
                  className={`border shadow-sm transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-slate-900">
                            {friend.nickname || friend.friendName}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              friend.isOnline
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {friend.isOnline ? "Online" : "Offline"}
                          </Badge>
                          {friend.isFavorite && (
                            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                          )}
                        </div>
                        <div className="mt-2 text-sm text-slate-600">Commander ID: {friend.friendName}</div>
                        <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                          Last seen {formatDate(friend.lastSeen)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => setSelectedFriendId(friend.id)}
                        >
                          {isSelected ? "Inspecting" : "Details"}
                        </Button>
                        <Button
                          size="sm"
                          variant={friend.isFavorite ? "default" : "outline"}
                          onClick={() =>
                            toggleFavoriteMutation.mutate({
                              friendId: friend.friendId,
                              isFavorite: !Boolean(friend.isFavorite),
                            })
                          }
                          disabled={toggleFavoriteMutation.isPending}
                          data-testid={`button-favorite-friend-${friend.id}`}
                        >
                          <Heart className={`mr-2 h-4 w-4 ${friend.isFavorite ? "fill-current" : ""}`} />
                          {friend.isFavorite ? "Favorite" : "Pin"}
                        </Button>
                        <Link href="/messages?tab=messages&sub=compose">
                          <Button size="sm" variant="outline" data-testid={`button-message-friend-${friend.id}`}>
                            Message
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFriendMutation.mutate(friend.friendId)}
                          disabled={removeFriendMutation.isPending}
                          data-testid={`button-remove-friend-${friend.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="h-fit border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl text-slate-900">Contact Intel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!selectedFriend ? (
                <p className="text-slate-500">
                  Select a friend to review contact status, favorites priority, and communication timing.
                </p>
              ) : (
                <>
                  <div>
                    <div className="font-orbitron text-lg font-bold text-slate-900">
                      {selectedFriend.nickname || selectedFriend.friendName}
                    </div>
                    <div className="mt-1 text-slate-500">{selectedFriend.friendName}</div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Presence</div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>Status: {selectedFriend.isOnline ? "Online" : "Offline"}</div>
                        <div>Favorite: {selectedFriend.isFavorite ? "Yes" : "No"}</div>
                        <div>Last seen: {formatDate(selectedFriend.lastSeen)}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Engagement Hint</div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>
                          Priority: {selectedFriend.isFavorite ? "High-priority ally" : "Standard contact"}
                        </div>
                        <div>
                          Recommended action:{" "}
                          {selectedFriend.isOnline ? "Invite to live operations" : "Send async update"}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Alias Control</div>
                      <div className="mt-3 flex gap-2">
                        <Input
                          value={nicknameDraft}
                          onChange={(event) => setNicknameDraft(event.target.value)}
                          className="bg-white"
                          data-testid="input-friend-nickname"
                        />
                        <Button
                          onClick={() =>
                            nicknameMutation.mutate({
                              friendId: selectedFriend.friendId,
                              nickname: nicknameDraft.trim(),
                            })
                          }
                          disabled={nicknameMutation.isPending || !nicknameDraft.trim()}
                          data-testid="button-save-friend-nickname"
                        >
                          Save
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Roster Context</div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>Offline contacts: {offlineCount}</div>
                        <div>Pending requests: {requests.length}</div>
                        <div>Favorites flagged: {favoritesCount}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
}
