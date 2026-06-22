import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Swords, Users, Rocket, Shield, Zap } from "lucide-react";

type UnitStateResponse = {
  success: boolean;
  state: any;
  meta: any;
  summaries: Record<string, any[]>;
};
type TemplatesResponse = { success: boolean; total: number; templates: any[] };
type BlueprintsResponse = { success: boolean; total: number; blueprints: any[] };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export default function UnitSystemsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stateData, isLoading } = useQuery<UnitStateResponse>({
    queryKey: ["us-state"],
    queryFn: () => fetchJson("/api/unit-systems/state"),
  });

  const { data: templates } = useQuery<TemplatesResponse>({
    queryKey: ["us-templates"],
    queryFn: () => fetchJson("/api/unit-systems/templates"),
  });

  const { data: blueprints } = useQuery<BlueprintsResponse>({
    queryKey: ["us-blueprints"],
    queryFn: () => fetchJson("/api/unit-systems/blueprints"),
  });

  const processTrainingMutation = useMutation({
    mutationFn: () => fetchJson("/api/unit-systems/training/process", { method: "POST" }),
    onSuccess: () => { toast({ title: "Training processed" }); queryClient.invalidateQueries({ queryKey: ["us-state"] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const domainIcons: Record<string, any> = { troop: Swords, civilian: Users, government: Shield, military: Rocket };

  if (isLoading) return <GameLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></GameLayout>;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Swords className="w-8 h-8 text-red-400" /> Unit Systems
          </h1>
          <p className="text-slate-400 mt-1">Train units, manage your military forces, and simulate combat</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stateData?.summaries || {}).map(([domain, units]) => {
            const Icon = domainIcons[domain] || Swords;
            const total = (units as any[]).reduce((sum: number, u: any) => sum + (u.total || 0), 0);
            return (
              <Card key={domain} className="bg-slate-900/80 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Icon className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{total}</p>
                  <p className="text-xs text-slate-400 capitalize">{domain} Units</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => processTrainingMutation.mutate()} disabled={processTrainingMutation.isPending}>
            <Zap className="w-4 h-4 mr-2" /> Process Training
          </Button>
        </div>

        <Tabs defaultValue="troop" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            {["troop", "civilian", "government", "military"].map(d => (
              <TabsTrigger key={d} value={d} className="capitalize">{d}</TabsTrigger>
            ))}
          </TabsList>

          {["troop", "civilian", "government", "military"].map(domain => (
            <TabsContent key={domain} value={domain} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stateData?.summaries?.[domain]?.map((u: any) => (
                  <Card key={u.template?.id || Math.random()} className="bg-slate-900/80 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-sm">{u.template?.name || u.template?.id}</span>
                        <Badge variant="outline" className="text-[10px]">T{u.template?.tier || "?"}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[10px]">
                        <div className="p-1 bg-slate-800 rounded text-center">
                          <div className="text-slate-400">Untrained</div>
                          <div className="text-white font-bold">{u.pool?.untrained || 0}</div>
                        </div>
                        <div className="p-1 bg-slate-800 rounded text-center">
                          <div className="text-slate-400">Trained</div>
                          <div className="text-cyan-400 font-bold">{u.pool?.trained || 0}</div>
                        </div>
                        <div className="p-1 bg-slate-800 rounded text-center">
                          <div className="text-slate-400">Elite</div>
                          <div className="text-amber-400 font-bold">{u.pool?.elite || 0}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Tabs defaultValue="unit-templates" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="unit-templates">Templates ({templates?.total || 0})</TabsTrigger>
            <TabsTrigger value="starship-bps">Starship Blueprints ({blueprints?.total || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="unit-templates" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates?.templates?.slice(0, 20).map((t: any) => (
                <div key={t.id} className="p-3 bg-slate-900/80 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-bold">{t.name || t.id}</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-[10px] capitalize">{t.domain}</Badge>
                      <Badge variant="secondary" className="text-[10px]">T{t.tier || 1}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="starship-bps" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {blueprints?.blueprints?.map((bp: any) => (
                <div key={bp.id} className="p-3 bg-slate-900/80 rounded-lg border border-slate-700">
                  <div className="text-white text-sm font-bold">{bp.name || bp.id}</div>
                  <p className="text-xs text-slate-400">{bp.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
