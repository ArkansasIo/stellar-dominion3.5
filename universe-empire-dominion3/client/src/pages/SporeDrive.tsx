import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Zap, Navigation, Activity, Radio, ArrowRight, X } from "lucide-react";
import { useState } from "react";

type DriveStatusResponse = { id: string; name: string; status: any; state: string; mode: string; isOperational: boolean; health: number; sporeReserves: number; sporeCapacity: number; powerLevel: number; systems: any; alerts: string[] };
type NetworkResponse = { id: string; networkNodes: any[]; totalNodes: number; activeNodes: number; degradedNodes: number; offlineNodes: number };
type JumpsResponse = { id: string; totalJumps: number; recentJumps: any[] };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export default function SporeDrive() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [driveId, setDriveId] = useState("");

  const { data: status } = useQuery<DriveStatusResponse>({
    queryKey: ["spore-drive-status", driveId],
    queryFn: () => fetchJson(`/api/spore-drive/${driveId}/status`),
    enabled: !!driveId,
  });

  const { data: network } = useQuery<NetworkResponse>({
    queryKey: ["spore-drive-network", driveId],
    queryFn: () => fetchJson(`/api/spore-drive/${driveId}/network`),
    enabled: !!driveId,
  });

  const { data: jumps } = useQuery<JumpsResponse>({
    queryKey: ["spore-drive-jumps", driveId],
    queryFn: () => fetchJson(`/api/spore-drive/${driveId}/jumps`),
    enabled: !!driveId,
  });

  const rechargeMutation = useMutation({
    mutationFn: () => fetchJson(`/api/spore-drive/${driveId}/recharge`, { method: "POST" }),
    onSuccess: () => { toast({ title: "Drive recharged" }); queryClient.invalidateQueries({ queryKey: ["spore-drive-status", driveId] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const sporePct = status ? (status.sporeReserves / status.sporeCapacity) * 100 : 0;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-green-400" /> Spore Drive
          </h1>
          <p className="text-slate-400 mt-1">Fungal-powered faster-than-light travel system</p>
        </div>

        {!driveId && (
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-6">
              <p className="text-slate-400 text-sm mb-2">Enter a Spore Drive ID to view its status</p>
              <input className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm" placeholder="drive-xxxxxxxx" value={driveId} onChange={(e) => setDriveId(e.target.value)} />
            </CardContent>
          </Card>
        )}

        {driveId && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Activity className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white capitalize">{status?.state || "Unknown"}</p>
                  <p className="text-xs text-slate-400">Drive State</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{Math.round(sporePct)}%</p>
                  <p className="text-xs text-slate-400">Spore Reserves</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Navigation className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white capitalize">{status?.mode || "Standard"}</p>
                  <p className="text-xs text-slate-400">Drive Mode</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Activity className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{status?.health || 0}%</p>
                  <p className="text-xs text-slate-400">Health</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="systems" className="w-full">
              <TabsList className="bg-slate-900 border border-slate-700">
                <TabsTrigger value="systems">Systems</TabsTrigger>
                <TabsTrigger value="network"><Radio className="w-4 h-4 mr-1" /> Network</TabsTrigger>
                <TabsTrigger value="jumps"><ArrowRight className="w-4 h-4 mr-1" /> Jumps</TabsTrigger>
              </TabsList>

              <TabsContent value="systems" className="mt-4">
                <Card className="bg-slate-900/80 border-slate-700">
                  <CardHeader><CardTitle className="text-white">Drive Systems</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {status?.systems && Object.entries(status.systems).map(([key, val]) => (
                        <div key={key} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                          <div className="text-xs text-slate-400 capitalize">{key}</div>
                          <Badge variant={val ? "default" : "secondary"} className="mt-1">{val ? "Active" : "Offline"}</Badge>
                        </div>
                      ))}
                    </div>
                    {status?.alerts?.length ? (
                      <div className="mt-4 space-y-2">
                        {status.alerts.map((alert: string, i: number) => (
                          <div key={i} className="p-2 bg-red-900/30 border border-red-800 rounded text-sm text-red-300">{alert}</div>
                        ))}
                      </div>
                    ) : null}
                    <Button className="mt-4" variant="outline" onClick={() => rechargeMutation.mutate()} disabled={rechargeMutation.isPending}>
                      <Zap className="w-4 h-4 mr-2" /> Recharge Spores
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="network" className="mt-4">
                <Card className="bg-slate-900/80 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Mycelial Network</CardTitle>
                    <div className="flex gap-3 text-xs">
                      <span className="text-green-400">{network?.activeNodes || 0} active</span>
                      <span className="text-yellow-400">{network?.degradedNodes || 0} degraded</span>
                      <span className="text-red-400">{network?.offlineNodes || 0} offline</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {network?.networkNodes?.slice(0, 12).map((node: any) => (
                        <div key={node.id} className="p-2 bg-slate-800 rounded border border-slate-700 text-xs">
                          <div className="text-white font-bold">{node.name || node.id}</div>
                          <Badge variant={node.status === "active" ? "default" : node.status === "degraded" ? "secondary" : "destructive"} className="mt-1 text-[10px]">{node.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jumps" className="mt-4">
                <Card className="bg-slate-900/80 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Jump History</CardTitle>
                    <p className="text-xs text-slate-400">Total jumps: {jumps?.totalJumps || 0}</p>
                  </CardHeader>
                  <CardContent>
                    {jumps?.recentJumps?.length ? (
                      <div className="space-y-2">
                        {jumps.recentJumps.map((j: any) => (
                          <div key={j.id} className="p-3 bg-slate-800 rounded border border-slate-700">
                            <div className="flex justify-between text-xs">
                              <span className="text-white">{j.origin?.system || "?"} → {j.destination?.system || "?"}</span>
                              <Badge variant={j.status === "completed" ? "default" : "destructive"}>{j.status}</Badge>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">{j.distance?.toFixed(1)} ly · {j.duration?.toFixed(0)}s</div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-slate-500">No jump history</p>}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </GameLayout>
  );
}
