import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { TreePine, Shield, Scale, Coins, Unlock, ChevronRight, RefreshCw } from "lucide-react";

type TreeResponse = { success: boolean; tree: any };
type StatusResponse = { success: boolean; status: any };
type PillarsResponse = { success: boolean; pillars: any };
type AvailableNodesResponse = { success: boolean; availableNodes: any[]; count: number };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

const pillarIcons: Record<string, any> = { stability: Shield, law: Scale, economic: Coins };
const pillarColors: Record<string, string> = { stability: "text-blue-400", law: "text-purple-400", economic: "text-amber-400" };

export default function GovernmentProgressionPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: treeData, isLoading } = useQuery<TreeResponse>({
    queryKey: ["gov-prog-tree"],
    queryFn: () => fetchJson("/api/government-progression/tree"),
  });

  const { data: statusData } = useQuery<StatusResponse>({
    queryKey: ["gov-prog-status"],
    queryFn: () => fetchJson("/api/government-progression/status"),
  });

  const { data: pillarsData } = useQuery<PillarsResponse>({
    queryKey: ["gov-prog-pillars"],
    queryFn: () => fetchJson("/api/government-progression/pillars"),
  });

  const { data: availableData } = useQuery<AvailableNodesResponse>({
    queryKey: ["gov-prog-available"],
    queryFn: () => fetchJson("/api/government-progression/available-nodes"),
  });

  const unlockMutation = useMutation({
    mutationFn: (nodeId: string) => fetchJson("/api/government-progression/unlock", { method: "POST", body: JSON.stringify({ nodeId }) }),
    onSuccess: () => { toast({ title: "Node unlocked!" }); queryClient.invalidateQueries({ queryKey: ["gov-prog-status" as any, "gov-prog-available" as any] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const rankUpMutation = useMutation({
    mutationFn: (nodeId: string) => fetchJson("/api/government-progression/rankup", { method: "POST", body: JSON.stringify({ nodeId }) }),
    onSuccess: () => { toast({ title: "Node ranked up!" }); queryClient.invalidateQueries({ queryKey: ["gov-prog-status" as any] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const resetMutation = useMutation({
    mutationFn: () => fetchJson("/api/government-progression/reset", { method: "POST" }),
    onSuccess: () => { toast({ title: "Progression reset" }); queryClient.invalidateQueries({ queryKey: ["gov-prog-status" as any, "gov-prog-pillars" as any] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <GameLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></GameLayout>;

  const st = statusData?.status;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TreePine className="w-8 h-8 text-emerald-400" /> Government Progression
          </h1>
          <p className="text-slate-400 mt-1">Unlock governance nodes and build your political tree</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <TreePine className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{st?.level || 1}</p>
              <p className="text-xs text-slate-400">Government Level</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Coins className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{st?.xp || 0}</p>
              <p className="text-xs text-slate-400">XP</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Unlock className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{st?.unlockedNodes?.length || 0}</p>
              <p className="text-xs text-slate-400">Nodes Unlocked</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <ChevronRight className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{availableData?.count || 0}</p>
              <p className="text-xs text-slate-400">Available</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pillars" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="pillars">Pillars</TabsTrigger>
            <TabsTrigger value="available">Available Nodes</TabsTrigger>
            <TabsTrigger value="tree">Full Tree</TabsTrigger>
          </TabsList>

          <TabsContent value="pillars" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pillarsData?.pillars && Object.entries(pillarsData.pillars).map(([key, data]: [string, any]) => {
                const Icon = pillarIcons[key] || TreePine;
                const color = pillarColors[key] || "text-slate-400";
                return (
                  <Card key={key} className="bg-slate-900/80 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${color}`} /> <span className="capitalize">{key}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Level</span>
                          <span className="text-white font-bold">{data.level || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Nodes</span>
                          <span className="text-white">{data.nodesUnlocked || 0}/{data.totalNodes || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">XP</span>
                          <span className="text-amber-400">{data.xp || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="available" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableData?.availableNodes?.length ? availableData.availableNodes.map((node: any) => (
                <Card key={node.id} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-bold">{node.name || node.id}</span>
                      <Badge variant="outline" className="capitalize">{node.pillar}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{node.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-cyan-600 text-cyan-400"
                        onClick={() => unlockMutation.mutate(node.id)} disabled={unlockMutation.isPending}>
                        <Unlock className="w-3 h-3 mr-1" /> Unlock
                      </Button>
                      <Button size="sm" variant="ghost"
                        onClick={() => rankUpMutation.mutate(node.id)} disabled={rankUpMutation.isPending}>
                        Rank Up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : <p className="text-slate-500 col-span-2">No available nodes</p>}
            </div>
          </TabsContent>

          <TabsContent value="tree" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Progression Tree</span>
                  <Button size="sm" variant="destructive" onClick={() => resetMutation.mutate()} disabled={resetMutation.isPending}>
                    <RefreshCw className="w-3 h-3 mr-1" /> Reset
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {treeData?.tree?.pillars && Object.entries(treeData.tree.pillars).map(([key, pillar]: [string, any]) => (
                  <div key={key} className="mb-6">
                    <h3 className="text-white font-bold mb-2 capitalize flex items-center gap-2">
                      {(() => { const I = pillarIcons[key] || TreePine; return <I className={`w-4 h-4 ${pillarColors[key]}`} />; })()}
                      {key}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ml-6">
                      {pillar.nodes?.map((node: any) => {
                        const isUnlocked = st?.unlockedNodes?.includes(node.id);
                        return (
                          <div key={node.id} className={`p-2 rounded border text-xs ${isUnlocked ? "bg-emerald-900/30 border-emerald-700" : "bg-slate-800 border-slate-700"}`}>
                            <div className="text-white font-bold">{node.name || node.id}</div>
                            <div className="text-slate-400">Max Rank: {node.maxRank}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
