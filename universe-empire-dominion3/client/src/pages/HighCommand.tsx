import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Shield, Star, Users, Zap, Target, Crown, ChevronRight } from "lucide-react";
import { useState } from "react";

type HighCommandStatusResponse = {
  success: boolean;
  state: any;
  rankConfig: any;
  bonuses: any;
  warCouncilBonus: any;
  officerSlots: any[];
  activeOrders: any[];
  unlockedSynergies: any[];
};

type RanksResponse = { success: boolean; ranks: any[] };
type OrdersResponse = { success: boolean; orders: any[] };
type SynergiesResponse = { success: boolean; synergies: any[] };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export default function HighCommand() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState("");

  const { data: status, isLoading } = useQuery<HighCommandStatusResponse>({
    queryKey: ["high-command-status"],
    queryFn: () => fetchJson("/api/high-command/status"),
  });

  const { data: ranksData } = useQuery<RanksResponse>({
    queryKey: ["high-command-ranks"],
    queryFn: () => fetchJson("/api/high-command/ranks"),
  });

  const { data: ordersData } = useQuery<OrdersResponse>({
    queryKey: ["high-command-orders"],
    queryFn: () => fetchJson("/api/high-command/strategic-orders"),
  });

  const { data: synergiesData } = useQuery<SynergiesResponse>({
    queryKey: ["high-command-synergies"],
    queryFn: () => fetchJson("/api/high-command/leader-synergies"),
  });

  const issueOrderMutation = useMutation({
    mutationFn: (orderType: string) => fetchJson("/api/high-command/issue-order", { method: "POST", body: JSON.stringify({ orderType }) }),
    onSuccess: () => { toast({ title: "Order issued" }); queryClient.invalidateQueries({ queryKey: ["high-command-status"] }); },
    onError: (e: Error) => { toast({ title: "Failed", description: e.message, variant: "destructive" }); },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderType: string) => fetchJson("/api/high-command/cancel-order", { method: "POST", body: JSON.stringify({ orderType }) }),
    onSuccess: () => { toast({ title: "Order cancelled" }); queryClient.invalidateQueries({ queryKey: ["high-command-status"] }); },
    onError: (e: Error) => { toast({ title: "Failed", description: e.message, variant: "destructive" }); },
  });

  const rankUpMutation = useMutation({
    mutationFn: () => fetchJson("/api/high-command/rank-up", { method: "POST" }),
    onSuccess: () => { toast({ title: "Rank up!" }); queryClient.invalidateQueries({ queryKey: ["high-command-status"] }); },
    onError: (e: Error) => { toast({ title: "Failed", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <GameLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></GameLayout>;

  const st = status?.state;
  const rankConfig = status?.rankConfig;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" /> High Command
          </h1>
          <p className="text-slate-400 mt-1">Manage your military hierarchy and strategic operations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Crown className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{st?.rank || "Ensign"}</p>
              <p className="text-xs text-slate-400">Rank</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{st?.prestige || 0}</p>
              <p className="text-xs text-slate-400">Prestige</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{st?.experience || 0}</p>
              <p className="text-xs text-slate-400">Experience</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{st?.activeOrders?.length || 0}</p>
              <p className="text-xs text-slate-400">Active Orders</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="officers">Officers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="synergies">Synergies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader><CardTitle className="text-white">Command Bonuses</CardTitle></CardHeader>
              <CardContent>
                {status?.bonuses ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(status.bonuses).map(([key, val]) => (
                      <div key={key} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                        <div className="text-lg font-bold text-white">{typeof val === "number" ? `${(val * 100).toFixed(0)}%` : String(val)}</div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500">No bonuses yet</p>}
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader><CardTitle className="text-white">War Council</CardTitle></CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Council bonus: {status?.warCouncilBonus ? `${status.warCouncilBonus}%` : "None"}</p>
                <p className="text-slate-500 text-xs mt-1">Requires Commodore rank or higher</p>
              </CardContent>
            </Card>
            <Button onClick={() => rankUpMutation.mutate()} disabled={rankUpMutation.isPending} variant="outline" className="border-cyan-600 text-cyan-400">
              <ChevronRight className="w-4 h-4 mr-2" /> Attempt Rank Up
            </Button>
          </TabsContent>

          <TabsContent value="officers" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {st?.officerAssignments?.map((a: any) => (
                <Card key={a.slot} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold capitalize">{a.slot?.replace(/-/g, " ")}</div>
                        <div className="text-xs text-slate-400">{a.commanderInstanceId ? "Assigned" : "Empty"}</div>
                      </div>
                      <Badge variant={a.commanderInstanceId ? "default" : "secondary"}>{a.commanderInstanceId ? "Active" : "Vacant"}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ordersData?.orders?.map((order: any) => {
                const isActive = st?.activeOrders?.some((o: any) => o.type === order.id);
                return (
                  <Card key={order.id} className="bg-slate-900/80 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-bold">{order.name || order.id}</div>
                        <Badge variant={isActive ? "destructive" : "secondary"}>{isActive ? "Active" : "Available"}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{order.description}</p>
                      <Button size="sm" variant={isActive ? "destructive" : "outline"}
                        onClick={() => isActive ? cancelOrderMutation.mutate(order.id) : issueOrderMutation.mutate(order.id)}
                        disabled={issueOrderMutation.isPending || cancelOrderMutation.isPending}>
                        {isActive ? "Cancel" : "Issue Order"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="synergies" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {synergiesData?.synergies?.map((s: any) => {
                const unlocked = st?.unlockedSynergies?.includes(s.id);
                return (
                  <Card key={s.id} className={`bg-slate-900/80 ${unlocked ? "border-amber-500" : "border-slate-700"}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{s.icon || "⚡"}</span>
                        <span className="text-white font-bold">{s.name}</span>
                      </div>
                      <p className="text-xs text-slate-400">{s.description}</p>
                      <Badge variant={unlocked ? "default" : "secondary"} className="mt-2">{unlocked ? "Unlocked" : "Locked"}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
