import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Hammer, Gem, BookOpen, Wrench } from "lucide-react";

type SmithyStatusResponse = {
  success: boolean;
  level: number;
  experience: number;
  nextLevelExp: number;
  materials: Record<string, number>;
  blueprints: string[];
  craftingQueue: any[];
  totalCrafted: number;
  totalTempered: number;
  totalMasterworked: number;
  totalSalvaged: number;
  smithyStats: any;
};

type MaterialsResponse = { success: boolean; materials: any[] };
type BlueprintsResponse = { success: boolean; blueprints: any[]; learnedCount: number };
type EnchantmentsResponse = { success: boolean; enchantments: any[] };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export default function Smithy() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery<SmithyStatusResponse>({
    queryKey: ["smithy-status"],
    queryFn: () => fetchJson("/api/smithy/status"),
  });

  const { data: materialsData } = useQuery<MaterialsResponse>({
    queryKey: ["smithy-materials"],
    queryFn: () => fetchJson("/api/smithy/materials"),
  });

  const { data: blueprintsData } = useQuery<BlueprintsResponse>({
    queryKey: ["smithy-blueprints"],
    queryFn: () => fetchJson("/api/smithy/blueprints"),
  });

  const { data: enchantmentsData } = useQuery<EnchantmentsResponse>({
    queryKey: ["smithy-enchantments"],
    queryFn: () => fetchJson("/api/smithy/enchantments"),
  });

  const expProgress = status ? Math.min((status.experience / status.nextLevelExp) * 100, 100) : 0;

  if (isLoading) return <GameLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></GameLayout>;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Hammer className="w-8 h-8 text-orange-400" /> Smithy
          </h1>
          <p className="text-slate-400 mt-1">Forge, temper, and enchant equipment</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">Lv. {status?.level || 1}</p>
              <p className="text-xs text-slate-400">Smithy Level</p>
              <Progress value={expProgress} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-white">{status?.totalCrafted || 0}</p>
              <p className="text-xs text-slate-400">Items Crafted</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{status?.totalTempered || 0}</p>
              <p className="text-xs text-slate-400">Items Tempered</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{blueprintsData?.learnedCount || 0}</p>
              <p className="text-xs text-slate-400">Blueprints Learned</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="materials"><Wrench className="w-4 h-4 mr-1" /> Materials</TabsTrigger>
            <TabsTrigger value="blueprints"><BookOpen className="w-4 h-4 mr-1" /> Blueprints</TabsTrigger>
            <TabsTrigger value="enchantments"><Gem className="w-4 h-4 mr-1" /> Enchantments</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader><CardTitle className="text-white">Crafting Materials</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {materialsData?.materials?.map((m: any) => (
                    <div key={m.id} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="text-sm font-bold text-white">{m.name}</div>
                      <div className="text-xs text-slate-400">Owned: {m.owned}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blueprints" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader><CardTitle className="text-white">Crafting Blueprints</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {blueprintsData?.blueprints?.map((bp: any) => (
                    <div key={bp.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-bold">{bp.name || bp.id}</span>
                        <Badge variant={bp.isLearned ? "default" : bp.canLearn ? "secondary" : "outline"}>
                          {bp.isLearned ? "Learned" : bp.canLearn ? "Available" : `Req Lv.${bp.requiredSmithyLevel}`}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{bp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enchantments" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader><CardTitle className="text-white">Enchantments</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {enchantmentsData?.enchantments?.map((e: any) => (
                    <div key={e.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="text-white font-bold">{e.name || e.id}</div>
                      <p className="text-xs text-slate-400">{e.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
