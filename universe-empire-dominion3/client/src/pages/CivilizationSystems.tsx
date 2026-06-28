import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BriefcaseBusiness, Shield, Wheat, Droplets, Users, Zap, Lock, Star,
  Plus, Minus, TrendingUp, Search, Filter, BarChart3, PieChart, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type JobDomain = "civilization" | "military";
type JobRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface CivilizationJob {
  id: string;
  name: string;
  description: string;
  domain: JobDomain;
  class: string;
  subClass?: string;
  jobType?: string;
  subType?: string;
  unitType?: string;
  rank: number;
  tier: number;
  rarity: JobRarity;
  baseProductivity: number;
  foodDemandPerHour: number;
  waterDemandPerHour: number;
  unlockLevel: number;
  buildingRequirement?: { name: string; level: number };
}

interface JobsCatalogResponse {
  success: boolean;
  total: number;
  items: CivilizationJob[];
}

interface JobsMetaResponse {
  success: boolean;
  meta: {
    total: number;
    domains: { civilization: number; military: number };
    classes: string[];
    subClasses: string[];
  };
}

interface JobsProjectionResponse {
  success: boolean;
  projection: {
    workforce: number;
    projectedProductivity: number;
    foodDemandPerHour: number;
    waterDemandPerHour: number;
  };
}

const RARITY_STYLES: Record<JobRarity, { color: string; bg: string; border: string; glow: string; icon: string }> = {
  common: { color: "text-slate-400", bg: "bg-slate-800", border: "border-slate-700", glow: "", icon: "⚪" },
  uncommon: { color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-700/50", glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]", icon: "🟢" },
  rare: { color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-700/50", glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]", icon: "🔵" },
  epic: { color: "text-violet-400", bg: "bg-violet-900/20", border: "border-violet-700/50", glow: "shadow-[0_0_15px_rgba(139,92,246,0.15)]", icon: "🟣" },
  legendary: { color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-700/50", glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]", icon: "⭐" },
};

const DOMAIN_STYLES: Record<JobDomain, { icon: React.ReactNode; color: string; gradient: string }> = {
  civilization: { icon: <BriefcaseBusiness className="w-4 h-4" />, color: "text-emerald-400", gradient: "from-emerald-500 to-teal-600" },
  military: { icon: <Shield className="w-4 h-4" />, color: "text-red-400", gradient: "from-red-500 to-orange-600" },
};

export default function CivilizationSystems() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [domain, setDomain] = useState<"all" | JobDomain>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignAmount, setAssignAmount] = useState<Record<string, number>>({});

  const { data: catalog, isLoading, isError: catalogError } = useQuery<JobsCatalogResponse>({
    queryKey: ["/api/config/civilization-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/config/civilization-jobs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load civilization jobs catalog");
      return res.json();
    },
  });

  const { data: meta, isError: metaError } = useQuery<JobsMetaResponse>({
    queryKey: ["/api/config/civilization-jobs/meta"],
    queryFn: async () => {
      const res = await fetch("/api/config/civilization-jobs/meta", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load civilization jobs meta");
      return res.json();
    },
  });

  const previewAssignments = useMemo(() => {
    const items = catalog?.items || [];
    return items.slice(0, 4).map((item, index) => ({
      jobId: item.id,
      count: index === 0 ? 5 : index === 1 ? 15 : index === 2 ? 30 : 1,
    }));
  }, [catalog?.items]);

  const { data: projection, isError: projectionError } = useQuery<JobsProjectionResponse>({
    queryKey: ["/api/config/civilization-jobs/projection", previewAssignments],
    enabled: previewAssignments.length > 0,
    queryFn: async () => {
      const res = await fetch("/api/config/civilization-jobs/projection", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignments: previewAssignments }),
      });
      if (!res.ok) throw new Error("Failed to load jobs projection");
      return res.json();
    },
  });

  const assignWorkerMutation = useMutation({
    mutationFn: async ({ jobId, employees }: { jobId: string; employees: number }) => {
      const res = await fetch("/api/civilization/workforce/assign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, employees }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Assignment failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/config/civilization-jobs/projection"] });
      toast({ title: "Workers Assigned", description: data.message });
    },
    onError: (error: Error) => {
      toast({ title: "Assignment failed", description: error.message, variant: "destructive" });
    },
  });

  const handleAmountChange = (jobId: string, delta: number) => {
    setAssignAmount((prev) => ({
      ...prev,
      [jobId]: Math.max(1, (prev[jobId] || 1) + delta),
    }));
  };

  const filteredItems = useMemo(() => {
    const source = catalog?.items || [];
    return source
      .filter((entry) => domain === "all" || entry.domain === domain)
      .filter((entry) => selectedClass === "all" || entry.class === selectedClass)
      .filter((entry) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.trim().toLowerCase();
        return (
          entry.name.toLowerCase().includes(term) ||
          entry.class.toLowerCase().includes(term) ||
          (entry.subClass || "").toLowerCase().includes(term) ||
          (entry.jobType || "").toLowerCase().includes(term)
        );
      });
  }, [catalog?.items, domain, selectedClass, searchTerm]);

  const domainCounts = useMemo(() => {
    const items = catalog?.items || [];
    return {
      all: items.length,
      civilization: items.filter((j) => j.domain === "civilization").length,
      military: items.filter((j) => j.domain === "military").length,
    };
  }, [catalog?.items]);

  const classCounts = useMemo(() => {
    const items = filteredItems;
    const counts: Record<string, number> = {};
    items.forEach((j) => {
      counts[j.class] = (counts[j.class] || 0) + 1;
    });
    return counts;
  }, [filteredItems]);

  const rarityBreakdown = useMemo(() => {
    const items = filteredItems;
    const counts: Record<JobRarity, number> = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
    items.forEach((j) => { counts[j.rarity]++; });
    return counts;
  }, [filteredItems]);

  const hasError = catalogError || metaError || projectionError;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-orbitron font-bold text-slate-900">Civilization Workforce</h1>
          <p className="text-slate-600 font-rajdhani text-sm">
            Manage 90+ specialized roles across civilization and military domains with dynamic resource demands
          </p>
        </div>

        {hasError && (
          <Card className="bg-red-950/50 border-red-700/50">
            <CardContent className="p-4 text-red-400 text-sm">
              Some civilization data failed to load. Please refresh the page.
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold">Total Roles</p>
                  <p className="text-2xl font-orbitron text-white">{meta?.meta.total || 0}</p>
                </div>
                <Users className="w-6 h-6 text-slate-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-950/50 to-emerald-900/30 border-emerald-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-emerald-400 font-semibold">Civilization</p>
                  <p className="text-2xl font-orbitron text-emerald-300">{meta?.meta.domains.civilization || 0}</p>
                </div>
                <BriefcaseBusiness className="w-6 h-6 text-emerald-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-950/50 to-red-900/30 border-red-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-red-400 font-semibold">Military</p>
                  <p className="text-2xl font-orbitron text-red-300">{meta?.meta.domains.military || 0}</p>
                </div>
                <Shield className="w-6 h-6 text-red-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-950/50 to-violet-900/30 border-violet-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-violet-400 font-semibold">Classes</p>
                  <p className="text-2xl font-orbitron text-violet-300">{meta?.meta.classes?.length || 0}</p>
                </div>
                <Star className="w-6 h-6 text-violet-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-700/50">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-orbitron font-semibold text-white">Workforce Projection</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Active Workforce</p>
                </div>
                <p className="text-2xl font-orbitron text-white">
                  {projection?.projection.workforce?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <p className="text-[10px] uppercase text-indigo-400 font-semibold">Productivity</p>
                </div>
                <p className="text-2xl font-orbitron text-indigo-300">
                  {projection?.projection.projectedProductivity?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Wheat className="w-3.5 h-3.5 text-emerald-400" />
                  <p className="text-[10px] uppercase text-emerald-400 font-semibold">Food / HR</p>
                </div>
                <p className="text-2xl font-orbitron text-emerald-300">
                  {projection?.projection.foodDemandPerHour?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <p className="text-[10px] uppercase text-cyan-400 font-semibold">Water / HR</p>
                </div>
                <p className="text-2xl font-orbitron text-cyan-300">
                  {projection?.projection.waterDemandPerHour?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rarity Distribution</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {(Object.entries(rarityBreakdown) as [JobRarity, number][]).map(([rarity, count]) => {
              const style = RARITY_STYLES[rarity];
              return (
                <div key={rarity} className="flex items-center gap-1.5">
                  <span className="text-xs">{style.icon}</span>
                  <span className={cn("text-xs font-semibold capitalize", style.color)}>{rarity}</span>
                  <span className="text-xs text-slate-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Tabs value={domain} onValueChange={(v) => setDomain(v as "all" | JobDomain)} className="flex-1">
              <TabsList className="bg-slate-900 border border-slate-700/50 w-full">
                <TabsTrigger value="all" className="flex-1 text-slate-400 data-[state=active]:text-white">
                  All ({domainCounts.all})
                </TabsTrigger>
                <TabsTrigger value="civilization" className="flex-1 text-slate-400 data-[state=active]:text-emerald-400">
                  <BriefcaseBusiness className="w-3.5 h-3.5 mr-1.5" />
                  Civilization ({domainCounts.civilization})
                </TabsTrigger>
                <TabsTrigger value="military" className="flex-1 text-slate-400 data-[state=active]:text-red-400">
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  Military ({domainCounts.military})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-900 border-slate-700/50 text-slate-300">
                <Filter className="w-3.5 h-3.5 mr-2" />
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Classes</SelectItem>
                {Object.entries(classCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cls, count]) => (
                    <SelectItem key={cls} value={cls}>
                      {cls} ({count})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role name, type, or description..."
              className="bg-slate-900 border-slate-700/50 text-white pl-10 placeholder:text-slate-500"
            />
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Showing {filteredItems.length} of {catalog?.items?.length || 0} roles
          </div>
        </div>

        {isLoading ? (
          <div className="col-span-full text-center py-16 text-slate-500">
            <div className="animate-pulse text-lg">Loading roles...</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-slate-900 border-slate-700/50">
            <CardContent className="p-12 text-center">
              <Search className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">No roles found matching your filters.</p>
              <Button
                variant="ghost"
                className="mt-3 text-slate-400 hover:text-white"
                onClick={() => { setSearchTerm(""); setSelectedClass("all"); setDomain("all"); }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((job) => {
              const rarity = RARITY_STYLES[job.rarity];
              const domainStyle = DOMAIN_STYLES[job.domain];
              return (
                <Card
                  key={job.id}
                  className={cn(
                    "bg-slate-900 border-slate-700/50 hover:border-slate-600 hover:shadow-lg transition-all group overflow-hidden flex flex-col",
                    rarity.glow,
                  )}
                >
                  <div className={cn("h-20 bg-gradient-to-br relative border-b border-slate-700/50", domainStyle.gradient)}>
                    <div className="absolute top-2 left-2 p-2 bg-slate-900/80 rounded border border-slate-700 backdrop-blur-sm">
                      <div className={domainStyle.color}>{domainStyle.icon}</div>
                    </div>

                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className={cn("text-[10px] uppercase font-semibold border-current/30 bg-slate-900/80 backdrop-blur-sm", rarity.color)}>
                        {rarity.icon} {job.rarity}
                      </Badge>
                    </div>

                    {job.buildingRequirement && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline" className="bg-slate-900/80 text-slate-400 border-slate-700 text-[9px] flex items-center gap-1 backdrop-blur-sm">
                          <Lock className="w-2 h-2" /> {job.buildingRequirement.name} Lvl {job.buildingRequirement.level}
                        </Badge>
                      </div>
                    )}

                    {job.tier > 1 && (
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="outline" className="bg-indigo-900/60 text-indigo-300 border-indigo-700/50 text-[9px] backdrop-blur-sm">
                          Tier {job.tier}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 flex-1 space-y-3">
                    <div>
                      <h4 className="font-orbitron font-semibold text-white text-sm">{job.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{job.description}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                        {job.class}
                      </Badge>
                      {job.jobType && (
                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">
                          {job.jobType}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-800 border border-slate-700 rounded p-2 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Rank</p>
                        <p className="font-orbitron text-lg text-white">{job.rank}</p>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded p-2 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Tier</p>
                        <p className="font-orbitron text-lg text-white">{job.tier}</p>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded p-2 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Unlock</p>
                        <p className="font-orbitron text-lg text-white">L{job.unlockLevel}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-emerald-950/30 border border-emerald-800/50 rounded p-2 text-center">
                        <p className="text-[9px] text-emerald-400 uppercase font-semibold">Food</p>
                        <p className="font-orbitron text-base text-emerald-300">{job.foodDemandPerHour}/h</p>
                      </div>
                      <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-2 text-center">
                        <p className="text-[9px] text-cyan-400 uppercase font-semibold">Water</p>
                        <p className="font-orbitron text-base text-cyan-300">{job.waterDemandPerHour}/h</p>
                      </div>
                      <div className="bg-indigo-950/30 border border-indigo-800/50 rounded p-2 text-center">
                        <p className="text-[9px] text-indigo-400 uppercase font-semibold">Prod</p>
                        <p className="font-orbitron text-base text-indigo-300">{job.baseProductivity}</p>
                      </div>
                    </div>
                  </CardContent>

                  <div className="border-t border-slate-700/50 p-3 bg-slate-800/50 space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
                        onClick={() => handleAmountChange(job.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-mono font-bold w-8 text-center text-white">{assignAmount[job.id] || 1}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
                        onClick={() => handleAmountChange(job.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className={cn(
                        "w-full text-xs font-orbitron tracking-wider",
                        job.domain === "civilization"
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-red-600 hover:bg-red-500 text-white"
                      )}
                      onClick={() =>
                        assignWorkerMutation.mutate({ jobId: job.id, employees: assignAmount[job.id] || 1 })
                      }
                      disabled={assignWorkerMutation.isPending}
                    >
                      {assignWorkerMutation.isPending ? "ASSIGNING..." : "ASSIGN WORKERS"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </GameLayout>
  );
}
