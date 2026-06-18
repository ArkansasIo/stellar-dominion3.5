/**
 * Research Lab Management Page
 * Comprehensive interface for managing research, labs, queues, and bonuses
 * @component
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Zap,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  Clock,
  Layers,
  FlaskConical,
} from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface ResearchItem {
  id: string;
  techId: string;
  techName: string;
  techBranch: string;
  progressPercent: number;
  turnsRemaining: number;
  priority: string;
  status: string;
}

export default function ResearchLabPage() {
  const queryClient = useQueryClient();
  const [selectedTech, setSelectedTech] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("normal");

  const { data: labData, isLoading: labLoading } = useQuery({
    queryKey: ["activeLab"],
    queryFn: async () => {
      const res = await fetch("/api/research/labs/active");
      return res.json();
    }
  });

  const { data: queueData, isLoading: queueLoading } = useQuery({
    queryKey: ["researchQueue"],
    queryFn: async () => {
      const res = await fetch("/api/research/queue");
      return res.json();
    }
  });

  const { data: bonusesData } = useQuery({
    queryKey: ["activeBonuses"],
    queryFn: async () => {
      const res = await fetch("/api/research/bonuses/active");
      return res.json();
    }
  });

  const { data: multiplierData } = useQuery({
    queryKey: ["speedMultiplier"],
    queryFn: async () => {
      const res = await fetch("/api/research/speed-multiplier");
      return res.json();
    }
  });

  const { data: diagnosticsData } = useQuery({
    queryKey: ["labDiagnostics"],
    queryFn: async () => {
      const res = await fetch("/api/research/diagnostics");
      return res.json();
    }
  });

  const addToQueueMutation = useMutation({
    mutationFn: async (data: { techId: string; priority: string }) => {
      const res = await fetch("/api/research/queue/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchQueue"] });
      queryClient.invalidateQueries({ queryKey: ["labDiagnostics"] });
      setSelectedTech("");
    },
  });

  const removeFromQueueMutation = useMutation({
    mutationFn: async (queueItemId: string) => {
      const res = await fetch("/api/research/queue/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueItemId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchQueue"] });
    },
  });

  const accelerateMutation = useMutation({
    mutationFn: async (data: { queueItemId: string; speedupPercent: number }) => {
      const res = await fetch("/api/research/accelerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchQueue"] });
    },
  });

  if (labLoading || queueLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⚙️</div>
            <p className="text-muted-foreground font-rajdhani">Loading research labs...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  const activeResearch = queueData?.queue?.[0];
  const allBonuses = bonusesData?.bonuses || [];
  const queue = queueData?.queue || [];

  const priorityVariant = (p: string): "destructive" | "default" | "secondary" | "outline" => {
    if (p === "critical") return "destructive";
    if (p === "high") return "default";
    if (p === "normal") return "secondary";
    return "outline";
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Page Header */}
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-8 h-8 text-blue-600" />
            Research Lab Administration
          </h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            {labData?.lab?.name
              ? `${labData.lab.name} · Type: ${labData.lab.type}`
              : "Manage your research queue, bonuses, and lab performance."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Research</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 truncate">
                {activeResearch?.techName || "None"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {activeResearch?.progressPercent || 0}% complete
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Queue Length</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{queue.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.max(0, queue.length - 1)} waiting
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Speed Multiplier</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {multiplierData?.multiplier ?? "1.0"}x
              </p>
              <p className="text-sm text-muted-foreground mt-1">{allBonuses.length} bonus(es) active</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lab Durability</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {diagnosticsData?.diagnostics?.labDurability ?? 100}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Research Progress */}
        {activeResearch && (
          <Card className="bg-white border-primary/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Clock className="w-4 h-4" /> Current Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{activeResearch.techName}</span>
                <Badge variant="secondary">{activeResearch.turnsRemaining} turns remaining</Badge>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{activeResearch.progressPercent}%</span>
                </div>
                <Progress value={activeResearch.progressPercent} className="h-2" />
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-widest">Accelerate Research</p>
                <div className="flex gap-2 flex-wrap">
                  {[25, 50, 75, 100].map((percent) => (
                    <Button
                      key={percent}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        accelerateMutation.mutate({
                          queueItemId: activeResearch.id,
                          speedupPercent: percent,
                        })
                      }
                      disabled={accelerateMutation.isPending}
                    >
                      +{percent}%
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue New Research */}
          <Card className="bg-white border-slate-200 shadow-sm lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Plus className="w-4 h-4" /> Queue Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Technology ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. armor_tech_1"
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <Button
                className="w-full font-orbitron tracking-wider"
                onClick={() =>
                  addToQueueMutation.mutate({ techId: selectedTech, priority: selectedPriority })
                }
                disabled={addToQueueMutation.isPending || !selectedTech}
              >
                {addToQueueMutation.isPending ? "Adding..." : "Add to Queue"}
              </Button>
            </CardContent>
          </Card>

          {/* Research Queue */}
          <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Layers className="w-4 h-4" /> Research Queue ({queue.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queue.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-rajdhani">Queue is empty. Add research to get started!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {queue.map((item: ResearchItem, idx: number) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        idx === 0
                          ? "bg-blue-50 border-blue-200"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900 truncate">
                              {idx + 1}. {item.techName}
                            </span>
                            <Badge variant={priorityVariant(item.priority)} className="shrink-0 text-[10px]">
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.techBranch}</p>
                          {idx === 0 && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>{item.progressPercent}%</span>
                                <span>{item.turnsRemaining} turns</span>
                              </div>
                              <Progress value={item.progressPercent} className="h-1.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {idx > 0 && (
                            <>
                              <Button size="icon" variant="ghost" className="h-7 w-7">
                                <ChevronUp className="w-3 h-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7">
                                <ChevronDown className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromQueueMutation.mutate(item.id)}
                            disabled={removeFromQueueMutation.isPending}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Bonuses */}
        {allBonuses.length > 0 && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" /> Active Bonuses ({allBonuses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allBonuses.map((bonus: any) => (
                  <div key={bonus.id} className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="font-semibold text-slate-900 text-sm">{bonus.name}</div>
                    <p className="text-xs text-muted-foreground mt-1">{bonus.description}</p>
                    {bonus.speedBonus && (
                      <Badge variant="secondary" className="mt-2 text-[10px]">
                        +{(bonus.speedBonus * 100).toFixed(0)}% speed
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}

