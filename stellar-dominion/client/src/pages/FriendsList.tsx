import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Heart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FriendsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: () => fetch("/api/friends").then(r => r.json()).catch(() => []),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: () => fetch("/api/friends/requests").then(r => r.json()).catch(() => []),
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/friends/requests/${requestId}/accept`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to accept friend request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      toast({ title: "Request accepted", description: "Friend added successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Accept failed", description: error.message, variant: "destructive" });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/friends/requests/${requestId}/reject`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to reject friend request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      toast({ title: "Request rejected", description: "Friend request declined." });
    },
    onError: (error: Error) => {
      toast({ title: "Reject failed", description: error.message, variant: "destructive" });
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to remove friend");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast({ title: "Friend removed", description: "Friend removed from your list." });
    },
    onError: (error: Error) => {
      toast({ title: "Remove failed", description: error.message, variant: "destructive" });
    },
  });

  const filtered = friends.filter((f: any) =>
    f.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.friendName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const friendsCount = friends.length;
  const selectedFriend = filtered.find((friend: any) => friend.id === selectedFriendId) || null;
  const favoritesCount = friends.filter((friend: any) => friend.isFavorite).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Friends List
        </h1>

        {/* Stats */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Friends Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total Friends</p>
                <p className="text-3xl font-bold text-primary">{friendsCount}/50</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Online Now</p>
                <p className="text-3xl font-bold text-green-500">
                  {friends.filter((f: any) => f.isOnline).length}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-500">{requests.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-slate-400 text-sm">Favorites</p>
                <p className="text-2xl font-bold text-pink-500">{favoritesCount}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Offline</p>
                <p className="text-2xl font-bold text-slate-300">{Math.max(0, friendsCount - friends.filter((f: any) => f.isOnline).length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Friend Requests */}
        {requests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Pending Requests</h2>
            <div className="grid gap-3">
              {requests.map((req: any) => (
                <Card key={req.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{req.senderName}</p>
                      <p className="text-sm text-slate-400">{req.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => acceptRequestMutation.mutate(req.id)} data-testid={`button-accept-request-${req.id}`}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => rejectRequestMutation.mutate(req.id)} data-testid={`button-reject-request-${req.id}`}>
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
            data-testid="input-search-friends"
          />
        </div>

        {/* Friends List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid gap-3">
          {filtered.map((friend: any) => (
            <Card key={friend.id} className={`bg-slate-800 border-slate-700 ${selectedFriendId === friend.id ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">{friend.nickname || friend.friendName}</p>
                      {friend.isOnline && (
                        <Badge className="bg-green-600">Online</Badge>
                      )}
                      {friend.isFavorite && (
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {friend.lastSeen ? `Last seen: ${new Date(friend.lastSeen).toLocaleDateString()}` : "Never"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFriendId(friend.id)}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      data-testid={`button-message-friend-${friend.id}`}
                    >
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFriendMutation.mutate(friend.friendId)}
                      data-testid={`button-remove-friend-${friend.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>

          <Card className="bg-slate-800 border-slate-700 h-fit">
            <CardHeader>
              <CardTitle className="text-white">Friend Intel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!selectedFriend ? (
                <p className="text-slate-400">Select a friend to review profile status and interaction context.</p>
              ) : (
                <>
                  <div className="font-semibold text-white">{selectedFriend.nickname || selectedFriend.friendName}</div>
                  <div className="rounded border border-slate-700 bg-slate-900/50 p-3 text-slate-300">
                    <div>Status: {selectedFriend.isOnline ? 'Online' : 'Offline'}</div>
                    <div>Favorite: {selectedFriend.isFavorite ? 'Yes' : 'No'}</div>
                    <div>Last Seen: {selectedFriend.lastSeen ? new Date(selectedFriend.lastSeen).toLocaleString() : 'Unknown'}</div>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div>Message Priority: {selectedFriend.isFavorite ? 'High' : 'Normal'}</div>
                    <div>Engagement Hint: {selectedFriend.isOnline ? 'Invite to live operation' : 'Queue asynchronous update'}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
