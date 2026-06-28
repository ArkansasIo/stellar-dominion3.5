import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Thermometer,
  Wind,
  Skull,
  Zap,
  Magnet,
  Bug,
  Shield,
  Globe,
  Search,
  ChevronDown,
  ChevronUp,
  Activity,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
import type { HazardSeverity } from "@shared/config/hazardSystemConfig";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const SEV_ORDER: HazardSeverity[] = ["none", "low", "moderate", "high", "extreme", "lethal"];

const HAZARD_ICONS: Record<string, typeof AlertTriangle> = {
  radiation: AlertTriangle,
  seismic: Activity,
  storm: Wind,
  toxic: Skull,
  thermal: Thermometer,
  gravity: Zap,
  magnetic: Magnet,
  biological: Bug,
};

function severityColor(sev: HazardSeverity): string {
  switch (sev) {
    case "none": return "bg-slate-100 text-slate-600";
    case "low": return "bg-green-100 text-green-700";
    case "moderate": return "bg-yellow-100 text-yellow-700";
    case "high": return "bg-orange-100 text-orange-700";
    case "extreme": return "bg-red-100 text-red-700";
    case "lethal": return "bg-purple-100 text-purple-800";
  }
}

function severityBadgeColor(sev: HazardSeverity): string {
  switch (sev) {
    case "none": return "bg-slate-500";
    case "low": return "bg-green-500";
    case "moderate": return "bg-yellow-500";
    case "high": return "bg-orange-500";
    case "extreme": return "bg-red-500";
    case "lethal": return "bg-purple-600";
  }
}

type HazardOverviewItem = {
  id: string;
  name: string;
  family: string;
  class: string;
  rarity: string;
  overallSeverity: HazardSeverity;
  overallProductionMalus: number;
  overallGrowthPenalty: number;
  overallHappinessPenalty: number;
  hazardCount: number;
  safeForColonization: boolean;
  topHazards: { type: string; name: string; severity: HazardSeverity }[];
};

type HazardConfigResponse = {
  success: boolean;
  hazardTypes: { id: string; name: string; icon: string; description: string; severityLevels: string[] }[];
};

type HazardOverviewResponse = {
  success: boolean;
  total: number;
  assessments: HazardOverviewItem[];
  bySeverity: Record<string, number>;
  safeCount: number;
  lethalCount: number;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || payload?.error || "Request failed");
  return payload as T;
}

function HazardRow({ item }: { item: HazardOverviewItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={cn("border transition-all", item.safeForColonization ? "border-slate-200" : "border-red-200 bg-red-50/30")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("w-3 h-3 rounded-full shrink-0", severityBadgeColor(item.overallSeverity))} />
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 truncate">{item.name}</div>
              <div className="text-xs text-slate-500">{item.family} &middot; {item.class}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Badge className={severityColor(item.overallSeverity)} variant="outline">
              {item.overallSeverity}
            </Badge>
            <Badge variant={item.safeForColonization ? "secondary" : "destructive"}>
              {item.safeForColonization ? "Colonizable" : "Unsafe"}
            </Badge>
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
            <div className="flex flex-wrap gap-2">
              {item.topHazards.map((h) => {
                const Icon = HAZARD_ICONS[h.type] || AlertTriangle;
                return (
                  <Badge key={h.type} className={severityColor(h.severity)} variant="outline">
                    <Icon className="w-3 h-3 mr-1" /> {h.name}: {h.severity}
                  </Badge>
                );
              })}
              {item.hazardCount > 3 && (
                <Badge variant="outline" className="text-slate-500">
                  +{item.hazardCount - 3} more
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-white rounded border border-slate-200 p-3">
                <div className="text-xs text-slate-500 uppercase">Production Malus</div>
                <div className={cn("font-bold text-lg", item.overallProductionMalus > 0.2 ? "text-red-600" : item.overallProductionMalus > 0.05 ? "text-amber-600" : "text-green-600")}>
                  -{Math.round(item.overallProductionMalus * 100)}%
                </div>
              </div>
              <div className="bg-white rounded border border-slate-200 p-3">
                <div className="text-xs text-slate-500 uppercase">Growth Penalty</div>
                <div className={cn("font-bold text-lg", item.overallGrowthPenalty > 0.15 ? "text-red-600" : item.overallGrowthPenalty > 0.05 ? "text-amber-600" : "text-green-600")}>
                  -{Math.round(item.overallGrowthPenalty * 100)}%
                </div>
              </div>
              <div className="bg-white rounded border border-slate-200 p-3">
                <div className="text-xs text-slate-500 uppercase">Happiness Penalty</div>
                <div className={cn("font-bold text-lg", item.overallHappinessPenalty > 0.15 ? "text-red-600" : item.overallHappinessPenalty > 0.05 ? "text-amber-600" : "text-green-600")}>
                  -{Math.round(item.overallHappinessPenalty * 100)}%
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Globe className="w-3 h-3" /> {item.rarity} &middot; {item.family} world &middot; Class {item.class}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Hazards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<HazardSeverity | "all">("all");

  const configQuery = useQuery<HazardConfigResponse>({
    queryKey: ["hazards-config"],
    queryFn: () => fetchJson<HazardConfigResponse>("/api/hazards/config"),
  });

  const overviewQuery = useQuery<HazardOverviewResponse>({
    queryKey: ["hazards-overview"],
    queryFn: () => fetchJson<HazardOverviewResponse>("/api/hazards/planet-types"),
  });

  const filtered = (overviewQuery.data?.assessments ?? []).filter((item) => {
    if (severityFilter !== "all" && item.overallSeverity !== severityFilter) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.family.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const bySeverity = overviewQuery.data?.bySeverity ?? {};

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <h1 className="text-2xl font-bold">Planetary Hazard Assessment</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Comprehensive environmental hazard analysis for all known planet types. Assess risks, plan mitigations, and ensure safe colonization.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Survey", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }, { label: "Analysis", image: MENU_ASSETS.RESOURCES.SCIENCE.path }, { label: "Protection", image: SHIP_ASSETS.SPECIAL.COLONIZER.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="text-xs text-slate-500 uppercase">Total Types</div>
                  <div className="text-xl font-orbitron font-bold text-slate-900">{overviewQuery.data?.total ?? "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-xs text-green-600 uppercase">Safe</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">{overviewQuery.data?.safeCount ?? "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Ban className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-xs text-purple-600 uppercase">Lethal</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">{overviewQuery.data?.lethalCount ?? "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-xs text-amber-600 uppercase">Hazardous</div>
                  <div className="text-xl font-orbitron font-bold text-amber-900">{overviewQuery.data ? overviewQuery.data.total - overviewQuery.data.safeCount - overviewQuery.data.lethalCount : "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600 uppercase">Mitigations</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{configQuery.data?.hazardTypes.length ?? "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="hazard-types" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 h-14">
            <TabsTrigger value="hazard-types" className="font-orbitron">Hazard Types</TabsTrigger>
            <TabsTrigger value="planet-hazards" className="font-orbitron">Planet Hazard Map</TabsTrigger>
          </TabsList>

          <TabsContent value="hazard-types" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(configQuery.data?.hazardTypes ?? []).map((h) => {
                const Icon = HAZARD_ICONS[h.id] || AlertTriangle;
                return (
                  <Card key={h.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Icon className="w-5 h-5 text-amber-600" />
                        {h.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600">{h.description}</p>
                      <div>
                        <div className="text-xs text-slate-500 uppercase mb-1">Severity Levels</div>
                        <div className="flex flex-wrap gap-1">
                          {h.severityLevels.map((s) => (
                            <Badge key={s} className={severityColor(s as HazardSeverity)} variant="outline">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="planet-hazards" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search planet types..."
                      className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm"
                    />
                  </div>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value as HazardSeverity | "all")}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All Severities</option>
                    {SEV_ORDER.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} ({bySeverity[s] ?? 0})</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {filtered.length === 0 ? (
                <Card className="bg-white border-slate-200">
                  <CardContent className="p-8 text-center text-slate-500">
                    No planet types match the current filters.
                  </CardContent>
                </Card>
              ) : (
                filtered.map((item) => <HazardRow key={item.id} item={item} />)
              )}
            </div>

            <div className="text-xs text-slate-500 text-center">
              Showing {filtered.length} of {overviewQuery.data?.assessments.length ?? 0} planet types
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
