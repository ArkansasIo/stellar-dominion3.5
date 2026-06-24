import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Swords, Lock, Trophy, Sparkles, ChevronRight, Star, Package } from "lucide-react";
import { useState } from "react";

interface ContractData {
  id: string;
  contractTier: number;
  tokensEarned: number;
  tokensSpent: number;
  raidsCompleted: number;
  chestsOpened: number;
  lastRaidAt: string | null;
}

interface ContractTierConfig {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  tokensPerRaid: number;
  maxTokensForChest: number;
  raidPowerRequirement: number;
  rewards: { type: string; amount: number; chance: number }[];
  chestRewards: { type: string; name: string; description: string; rarity: string; amount: number; chance: number }[];
}

const RARITY_COLORS: Record<string, string> = {
  common: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  rare: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  epic: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  legendary: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  mythic: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function DimensionalContractsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: contractsData, isLoading } = useQuery<{ success: boolean; contracts: ContractData[] }>({
    queryKey: ["/api/dimensional-contracts"],
    queryFn: async () => {
      const res = await fetch("/api/dimensional-contracts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load contracts");
      return res.json();
    },
  });

  const { data: configData } = useQuery<{ success: boolean; tiers: ContractTierConfig[] }>({
    queryKey: ["/api/dimensional-contracts/config"],
    queryFn: async () => {
      const res = await fetch("/api/dimensional-contracts/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load config");
      return res.json();
    },
  });

  const raidMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/dimensional-contracts/${tier}/complete-raid`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Raid failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dimensional-contracts"] });
      toast({ title: "Raid Complete", description: `Earned ${data.tokensEarned} tokens!` });
    },
    onError: (error: Error) => {
      toast({ title: "Raid Failed", description: error.message, variant: "destructive" });
    },
  });

  const chestMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/dimensional-contracts/${tier}/open-chest`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to open chest");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dimensional-contracts"] });
      toast({ title: "Chest Opened", description: `Received ${data.chestRewards?.length || 0} rewards!` });
    },
    onError: (error: Error) => {
      toast({ title: "Chest Failed", description: error.message, variant: "destructive" });
    },
  });

  const contracts = contractsData?.contracts || [];
  const tiers = configData?.tiers || [];

  return (
    <GameLayout title="Dimensional Contracts" subtitle="Complete raids and earn tokens for powerful rewards">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="raids">Raids</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier) => {
              const contract = contracts.find((c) => c.contractTier === tier.tier);
              const tokens = contract?.tokensEarned || 0;
              const tokensSpent = contract?.tokensSpent || 0;
              const available = tokens - tokensSpent;
              const progress = Math.min(100, (available / tier.maxTokensForChest) * 100);
              const canOpen = available >= tier.maxTokensForChest;

              return (
                <Card key={tier.tier} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{tier.icon}</span>
                        <div>
                          <CardTitle className={`text-lg ${tier.color}`}>{tier.name}</CardTitle>
                          <CardDescription>{tier.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">Tier {tier.tier}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Tokens Available</span>
                      <span className="text-white font-mono">{available.toLocaleString()} / {tier.maxTokensForChest.toLocaleString()}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{contract?.raidsCompleted || 0} raids completed</span>
                      <span>{contract?.chestsOpened || 0} chests opened</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => raidMutation.mutate(tier.tier)}
                        disabled={raidMutation.isPending}
                      >
                        <Swords className="w-4 h-4 mr-1" />
                        {raidMutation.isPending ? "Raiding..." : "Complete Raid"}
                      </Button>
                      <Button
                        size="sm"
                        variant={canOpen ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => chestMutation.mutate(tier.tier)}
                        disabled={!canOpen || chestMutation.isPending}
                      >
                        {canOpen ? <Sparkles className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
                        {canOpen ? "Open Chest" : "Locked"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="raids" className="space-y-6">
          {tiers.map((tier) => (
            <Card key={tier.tier}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${tier.color}`}>
                  {tier.icon} {tier.name} — Raid Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tier.rewards.map((reward, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="text-2xl">
                        {reward.type === "credits" ? "💰" : reward.type === "metal" ? "⛏️" : reward.type === "crystal" ? "💎" : reward.type === "deuterium" ? "🧪" : reward.type === "experience" ? "⭐" : "📦"}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white capitalize">{reward.type}</div>
                        <div className="text-xs text-slate-400">{reward.amount.toLocaleString()} × {Math.round(reward.chance * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          {tiers.map((tier) => (
            <Card key={tier.tier}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${tier.color}`}>
                  {tier.icon} {tier.name} — Chest Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tier.chestRewards.map((reward, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="text-2xl">
                        {reward.type === "item" ? "🎁" : reward.type === "tokens" ? "🪙" : reward.type === "resources" ? "📦" : "📋"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium">{reward.name}</span>
                          <Badge className={`text-xs ${RARITY_COLORS[reward.rarity] || ""}`}>{reward.rarity}</Badge>
                        </div>
                        <div className="text-xs text-slate-400">{reward.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">×{reward.amount.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">{Math.round(reward.chance * 100)}% chance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </GameLayout>
  );
}
