import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BriefcaseBusiness, Shield, Wheat, Droplets, Users, Zap, Lock, Star, Plus, Minus } from "lucide-react";
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

const rarityConfig: Record<JobRarity, { color: string; bg: string; border: string; icon: string }> = {
  common: { color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-300", icon: "⚪" },
  uncommon: { color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-300", icon: "🟢" },
  rare: { color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-300", icon: "🔵" },
  epic: { color: "text-violet-700", bg: "bg-violet-100", border: "border-violet-300", icon: "🟣" },
  legendary: { color: "text-amber-800", bg: "bg-amber-100", border: "border-amber-300", icon: "⭐" },
};

const domainIcons: Record<JobDomain, React.ReactElement> = {
  civilization: <BriefcaseBusiness className="w-4 h-4" />,
  military: <Shield className="w-4 h-4" />,
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
    setAssignAmount(prev => ({
      ...prev,
      [jobId]: Math.max(1, (prev[jobId] || 1) + delta)
    }));
  };

  const filteredItems = useMemo(() => {
    const source = catalog?.items || [];
    return source
      .filter((entry) => (domain === "all" ? true : entry.domain === domain))
      .filter((entry) => (selectedClass === "all" ? true : entry.class === selectedClass))
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
          <Card className="bg-rose-50 border-rose-200">
            <CardContent className="p-4 text-rose-700 text-sm">
              Some civilization data failed to load. Please refresh the page.
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-blue-600 font-semibold">Total Roles</p>
                  <p className="text-2xl font-orbitron text-blue-900">{meta?.meta.total || 0}</p>
                </div>
                <Users className="w-6 h-6 text-blue-600 opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-emerald-600 font-semibold">Civilization</p>
                  <p className="text-2xl font-orbitron text-emerald-900">{meta?.meta.domains.civilization || 0}</p>
                </div>
                <BriefcaseBusiness className="w-6 h-6 text-emerald-600 opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-red-600 font-semibold">Military</p>
                  <p className="text-2xl font-orbitron text-red-900">{meta?.meta.domains.military || 0}</p>
                </div>
                <Shield className="w-6 h-6 text-red-600 opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-violet-600 font-semibold">Classes</p>
                  <p className="text-2xl font-orbitron text-violet-900">{meta?.meta.classes?.length || 0}</p>
                </div>
                <Star className="w-6 h-6 text-violet-600 opacity-40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workforce Projection */}
        <Card className="bg-white border-slate-200 shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-orbitron font-semibold text-slate-900">Workforce Projection</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
                <p className="text-xs uppercase text-slate-500 font-semibold">Active Workforce</p>
                <p className="text-3xl font-orbitron text-slate-900 mt-1">
                  {projection?.projection.workforce?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-4">
                <p className="text-xs uppercase text-indigo-600 font-semibold">Productivity</p>
                <p className="text-3xl font-orbitron text-indigo-900 mt-1">
                  {projection?.projection.projectedProductivity?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4">
                <div className="flex items-center gap-1">
                  <Wheat className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs uppercase text-emerald-600 font-semibold">Food/HR</p>
                </div>
                <p className="text-3xl font-orbitron text-emerald-900 mt-1">
                  {projection?.projection.foodDemandPerHour?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-cyan-50 border border-cyan-300 rounded-lg p-4">
                <div className="flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  <p className="text-xs uppercase text-cyan-600 font-semibold">Water/HR</p>
                </div>
                <p className="text-3xl font-orbitron text-cyan-900 mt-1">
                  {projection?.projection.waterDemandPerHour?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters & Search */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Tabs value={domain} onValueChange={(v) => setDomain(v as "all" | JobDomain)} className="flex-1">
              <TabsList className="bg-white border border-slate-200 w-full">
                <TabsTrigger value="all" className="flex-1">All Roles</TabsTrigger>
                <TabsTrigger value="civilization" className="flex-1">Civilization</TabsTrigger>
                <TabsTrigger value="military" className="flex-1">Military</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {(meta?.meta.classes || []).filter(Boolean).map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role name, type, or description..."
            className="bg-white border-slate-200"
          />
        </div>

        {/* Job Catalog Grid */}
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-slate-500">Loading roles...</div>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-8 text-center">
              <p className="text-slate-600">No roles found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((job) => {
              const rarity = rarityConfig[job.rarity];
              return (
                <Card
                  key={job.id}
                  className={cn(
                    "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all group overflow-hidden flex flex-col",
                  )}
                >
                  {/* Header Section with gradient */}
                  <div
                    className={cn(
                      "h-20 bg-gradient-to-br from-slate-50 to-slate-100 relative border-b border-slate-200",
                      job.rarity === "epic" && "from-violet-50 to-violet-100 border-violet-200",
                      job.rarity === "legendary" && "from-amber-50 to-amber-100 border-amber-200",
                    )}
                  >
                    {/* Domain Icon */}
                    <div className="absolute top-2 left-2 p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-600">{domainIcons[job.domain]}</div>
                    </div>

                    {/* Rarity Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase font-semibold",
                          rarity.bg,
                          rarity.border,
                          rarity.color,
                        )}
                      >
                        {rarity.icon} {job.rarity}
                      </Badge>
                    </div>

                    {/* Building Requirement */}
                    {job.buildingRequirement && (
                      <div className="absolute bottom-2 left-2">
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-600 border-slate-300 text-[9px] flex items-center gap-1"
                        >
                          <Lock className="w-2 h-2" /> {job.buildingRequirement.name} Lvl {job.buildingRequirement.level}
                        </Badge>
                      </div>
                    )}

                    {/* Tier */}
                    {job.tier > 1 && (
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300 text-[9px]">
                          Tier {job.tier}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 flex-1 space-y-3">
                    <div>
                      <h4 className="font-orbitron font-semibold text-slate-900 text-sm">{job.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{job.description}</p>
                    </div>

                    {/* Class/SubClass */}
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Class:</span>
                        <span className="font-medium text-slate-700">{job.class}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Role:</span>
                        <span className="font-medium text-slate-700">{job.jobType || "General"}</span>
                      </div>
                    </div>

                    {/* Rank, Tier, Level */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Rank</p>
                        <p className="font-orbitron text-lg text-slate-900">{job.rank}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Tier</p>
                        <p className="font-orbitron text-lg text-slate-900">{job.tier}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Unlock</p>
                        <p className="font-orbitron text-lg text-slate-900">L{job.unlockLevel}</p>
                      </div>
                    </div>

                    {/* Demands & Productivity */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-emerald-50 border border-emerald-300 rounded p-2 text-center">
                        <p className="text-[9px] text-emerald-600 uppercase font-semibold">Food</p>
                        <p className="font-orbitron text-base text-emerald-900">{job.foodDemandPerHour}/h</p>
                      </div>
                      <div className="bg-cyan-50 border border-cyan-300 rounded p-2 text-center">
                        <p className="text-[9px] text-cyan-600 uppercase font-semibold">Water</p>
                        <p className="font-orbitron text-base text-cyan-900">{job.waterDemandPerHour}/h</p>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-300 rounded p-2 text-center">
                        <p className="text-[9px] text-indigo-600 uppercase font-semibold">Prod</p>
                        <p className="font-orbitron text-base text-indigo-900">{job.baseProductivity}</p>
                      </div>
                    </div>
                  </CardContent>

                  {/* Button */}
                  <div className="border-t border-slate-200 p-3 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8"
                        onClick={() => handleAmountChange(job.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-mono font-bold w-8 text-center">{assignAmount[job.id] || 1}</span>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8"
                        onClick={() => handleAmountChange(job.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="w-full text-xs font-orbitron"
                      onClick={() => assignWorkerMutation.mutate({ jobId: job.id, employees: assignAmount[job.id] || 1 })}
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
