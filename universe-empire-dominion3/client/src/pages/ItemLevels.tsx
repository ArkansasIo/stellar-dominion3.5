import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, Star, Package, Sparkles } from "lucide-react";
import { useState } from "react";

interface ItemLevelData {
  id: string;
  itemId: string;
  itemName: string;
  itemType: string;
  itemClass: string;
  baseRank: number;
  currentLevel: number;
  currentExperience: number;
  experienceToNext: number;
  upgradeCount: number;
  lastUpgradeAt: string | null;
  upgradeHistory: { timestamp: string; fromLevel: number; toLevel: number; success: boolean }[];
}

interface ItemTierConfig {
  level: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  statMultiplier: number;
  successRate: number;
  failurePenalty: string;
}

const TIER_COLORS: Record<string, string> = {
  Common: "text-gray-400",
  Uncommon: "text-green-400",
  Refined: "text-blue-400",
  Superior: "text-purple-400",
  Exceptional: "text-yellow-400",
  Masterwork: "text-orange-400",
  Legendary: "text-red-400",
  Mythic: "text-yellow-500",
  Transcendent: "text-cyan-400",
  Eternal: "text-pink-500",
};

function getTierForLevel(level: number, tiers: ItemTierConfig[]): ItemTierConfig | undefined {
  return [...tiers].reverse().find((t) => level >= t.level);
}

export default function ItemLevelsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("items");

  const { data: itemsData, isLoading } = useQuery<{ success: boolean; items: ItemLevelData[] }>({
    queryKey: ["/api/item-levels"],
    queryFn: async () => {
      const res = await fetch("/api/item-levels", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load items");
      return res.json();
    },
  });

  const { data: configData } = useQuery<{ success: boolean; tiers: ItemTierConfig[] }>({
    queryKey: ["/api/item-levels/config"],
    queryFn: async () => {
      const res = await fetch("/api/item-levels/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load config");
      return res.json();
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/item-levels/${itemId}/upgrade`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upgrade failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/item-levels"] });
      const result = data.upgradeResult;
      if (result?.success) {
        toast({ title: "Upgrade Success!", description: `Item upgraded to level ${result.newLevel}` });
      } else {
        toast({ title: "Upgrade Failed", description: `Item remains at level ${result?.newLevel || "?"}`, variant: "destructive" });
      }
    },
    onError: (error: Error) => {
      toast({ title: "Upgrade Error", description: error.message, variant: "destructive" });
    },
  });

  const items = itemsData?.items || [];
  const tiers = configData?.tiers || [];

  return (
    <GameLayout title="Item Levels" subtitle="Upgrade and enhance your equipment">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="items">My Items</TabsTrigger>
          <TabsTrigger value="tiers">Tier Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          {isLoading ? (
            <div className="text-center text-slate-400 py-12">Loading items...</div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No items registered for leveling yet.</p>
                <p className="text-slate-500 text-sm mt-1">Register items through the API to start upgrading them.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => {
                const tier = getTierForLevel(item.currentLevel, tiers);
                const expProgress = item.experienceToNext > 0 ? (item.currentExperience / item.experienceToNext) * 100 : 0;
                const successRate = tier ? Math.round(tier.successRate * 100) : 100;

                return (
                  <Card key={item.id} className="relative overflow-hidden">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">{item.itemName}</h3>
                          <p className="text-xs text-slate-400 capitalize">{item.itemType} · {item.itemClass}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold font-orbitron ${tier?.color || "text-gray-400"}`}>
                            Lv.{item.currentLevel}
                          </div>
                          {tier && (
                            <Badge className={`text-xs ${tier.color}`}>{tier.name}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Experience</span>
                          <span className="text-slate-300">{item.currentExperience} / {item.experienceToNext}</span>
                        </div>
                        <Progress value={expProgress} className="h-1.5" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Upgrade success: {successRate}%</span>
                        <span>{item.upgradeCount} upgrades</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => upgradeMutation.mutate(item.itemId)}
                          disabled={upgradeMutation.isPending}
                        >
                          <ArrowUp className="w-4 h-4 mr-1" />
                          {upgradeMutation.isPending ? "Upgrading..." : "Upgrade"}
                        </Button>
                      </div>

                      {item.upgradeHistory && item.upgradeHistory.length > 0 && (
                        <div className="border-t border-slate-700/50 pt-3">
                          <p className="text-xs text-slate-500 mb-2">Recent upgrades</p>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {item.upgradeHistory.slice(-5).reverse().map((h, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className={h.success ? "text-green-400" : "text-red-400"}>
                                  {h.success ? "✓" : "✗"}
                                </span>
                                <span className="text-slate-400">Lv.{h.fromLevel} → Lv.{h.toLevel}</span>
                                <span className="text-slate-600 ml-auto">{new Date(h.timestamp).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tiers" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <Card key={tier.level}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-lg ${tier.color}`}>
                    <span className="text-2xl">{tier.icon}</span>
                    {tier.name}
                  </CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Required Level</span>
                    <span className="text-white">{tier.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Stat Multiplier</span>
                    <span className="text-white">×{tier.statMultiplier}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-white">{Math.round(tier.successRate * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Failure Penalty</span>
                    <Badge variant={tier.failurePenalty === "destroy" ? "destructive" : tier.failurePenalty === "downgrade" ? "secondary" : "outline"}>
                      {tier.failurePenalty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </GameLayout>
  );
}
