import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Moon, Globe, ArrowUp, Home } from "lucide-react";

type MoonsResponse = { moons: any[]; count: number; planetId: string };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export default function MoonsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: moonsData, isLoading } = useQuery<MoonsResponse>({
    queryKey: ["moons"],
    queryFn: () => fetchJson("/api/moons/planet/default"),
  });

  const colonizeMutation = useMutation({
    mutationFn: (moonId: string) => fetchJson(`/api/moons/${moonId}/colonize`, { method: "POST" }),
    onSuccess: () => { toast({ title: "Moon colonized!" }); queryClient.invalidateQueries({ queryKey: ["moons"] }); },
    onError: (e: Error) => { toast({ title: "Failed", description: e.message, variant: "destructive" }); },
  });

  const upgradeMutation = useMutation({
    mutationFn: (moonId: string) => fetchJson(`/api/moons/${moonId}/upgrade`, { method: "POST" }),
    onSuccess: () => { toast({ title: "Moon upgraded!" }); queryClient.invalidateQueries({ queryKey: ["moons"] }); },
    onError: (e: Error) => { toast({ title: "Failed", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <GameLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></GameLayout>;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Moon className="w-8 h-8 text-blue-400" /> Moons
          </h1>
          <p className="text-slate-400 mt-1">Discover and colonize moons orbiting your planets</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Moon className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{moonsData?.count || 0}</p>
              <p className="text-xs text-slate-400">Discovered Moons</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{moonsData?.moons?.filter((m: any) => m.status?.isColonized).length || 0}</p>
              <p className="text-xs text-slate-400">Colonized</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Home className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{moonsData?.moons?.filter((m: any) => m.base).length || 0}</p>
              <p className="text-xs text-slate-400">Bases Built</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moonsData?.moons?.map((moon: any) => (
            <Card key={moon.id} className="bg-slate-900/80 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">{moon.icon || "🌙"}</span> {moon.name}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Badge variant="outline">Tier {moon.tier}</Badge>
                    <Badge variant="secondary">Lv. {moon.level}</Badge>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{moon.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-slate-800 rounded text-center">
                    <div className="text-slate-400">Metal</div>
                    <div className="text-white font-bold">{moon.resources?.metal?.toLocaleString() || 0}</div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded text-center">
                    <div className="text-slate-400">Crystal</div>
                    <div className="text-white font-bold">{moon.resources?.crystal?.toLocaleString() || 0}</div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded text-center">
                    <div className="text-slate-400">Deuterium</div>
                    <div className="text-white font-bold">{moon.resources?.deuterium?.toLocaleString() || 0}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!moon.details?.currentOwner && (
                    <Button size="sm" variant="outline" className="border-green-600 text-green-400"
                      onClick={() => colonizeMutation.mutate(moon.id)} disabled={colonizeMutation.isPending}>
                      Colonize
                    </Button>
                  )}
                  {moon.details?.currentOwner && !moon.base && (
                    <Button size="sm" variant="outline" className="border-purple-600 text-purple-400" disabled>
                      <Home className="w-3 h-3 mr-1" /> Build Base
                    </Button>
                  )}
                  {moon.details?.currentOwner && (
                    <Button size="sm" variant="outline" className="border-cyan-600 text-cyan-400"
                      onClick={() => upgradeMutation.mutate(moon.id)} disabled={upgradeMutation.isPending}>
                      <ArrowUp className="w-3 h-3 mr-1" /> Upgrade
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}
