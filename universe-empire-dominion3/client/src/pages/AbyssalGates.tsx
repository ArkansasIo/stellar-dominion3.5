import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, Lock, Sparkles, Skull, Shield } from "lucide-react";
import { useState } from "react";

interface GateTokenData {
  id: string;
  gateTier: number;
  tokensEarned: number;
  tokensSpent: number;
  gatesCompleted: number;
  chestsOpened: number;
  lastGateAt: string | null;
}

interface GateTierConfig {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  tokensPerGate: number;
  maxTokensForChest: number;
  powerRequirement: number;
  gateDifficulty: string;
  rewards: { type: string; amount: number; chance: number }[];
  chestRewards: { type: string; name: string; description: string; rarity: string; amount: number; chance: number }[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-gray-500/20 text-gray-300",
  medium: "bg-blue-500/20 text-blue-300",
  hard: "bg-purple-500/20 text-purple-300",
  extreme: "bg-orange-500/20 text-orange-300",
  nightmare: "bg-red-500/20 text-red-300",
};

const RARITY_COLORS: Record<string, string> = {
  common: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  rare: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  epic: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  legendary: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  mythic: "bg-red-500/20 text-red-300 border-red-500/30",
  abyssal: "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

export default function AbyssalGatesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: gatesData } = useQuery<{ success: boolean; tokens: GateTokenData[] }>({
    queryKey: ["/api/abyssal-gates"],
    queryFn: async () => {
      const res = await fetch("/api/abyssal-gates", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load gates");
      return res.json();
    },
  });

  const { data: configData } = useQuery<{ success: boolean; tiers: GateTierConfig[] }>({
    queryKey: ["/api/abyssal-gates/config"],
    queryFn: async () => {
      const res = await fetch("/api/abyssal-gates/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load config");
      return res.json();
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/abyssal-gates/${tier}/complete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gate failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/abyssal-gates"] });
      toast({ title: "Gate Completed", description: `Earned ${data.tokensEarned} tokens!` });
    },
    onError: (error: Error) => {
      toast({ title: "Gate Failed", description: error.message, variant: "destructive" });
    },
  });

  const chestMutation = useMutation({
    mutationFn: async (tier: number) => {
      const res = await fetch(`/api/abyssal-gates/${tier}/open-chest`, {
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
      queryClient.invalidateQueries({ queryKey: ["/api/abyssal-gates"] });
      toast({ title: "Abyssal Chest Opened", description: `Received ${data.chestRewards?.length || 0} rewards!` });
    },
    onError: (error: Error) => {
      toast({ title: "Chest Failed", description: error.message, variant: "destructive" });
    },
  });

  const tokens = gatesData?.tokens || [];
  const tiers = configData?.tiers || [];

  return (
    <GameLayout title="Abyssal Gates" subtitle="Descend into the abyss for powerful void rewards">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Chest Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier) => {
              const token = tokens.find((t) => t.gateTier === tier.tier);
              const earned = token?.tokensEarned || 0;
              const spent = token?.tokensSpent || 0;
              const available = earned - spent;
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
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={DIFFICULTY_COLORS[tier.gateDifficulty] || ""}>{tier.gateDifficulty}</Badge>
                        <span className="text-xs text-slate-500">{tier.powerRequirement.toLocaleString()} power</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Tokens Available</span>
                      <span className="text-white font-mono">{available.toLocaleString()} / {tier.maxTokensForChest.toLocaleString()}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{token?.gatesCompleted || 0} gates completed</span>
                      <span>{token?.chestsOpened || 0} chests opened</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => completeMutation.mutate(tier.tier)}
                        disabled={completeMutation.isPending}
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        {completeMutation.isPending ? "Entering..." : "Enter Gate"}
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

        <TabsContent value="rewards" className="space-y-6">
          {tiers.map((tier) => (
            <Card key={tier.tier}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${tier.color}`}>
                  {tier.icon} {tier.name} — Abyssal Chest Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tier.chestRewards.map((reward, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="text-2xl">
                        {reward.type === "item" ? "🎁" : reward.type === "tokens" ? "🪙" : reward.type === "resources" ? "📦" : reward.type === "abyssal_key" ? "🗝️" : reward.type === "void_fragment" ? "🔮" : "📋"}
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
