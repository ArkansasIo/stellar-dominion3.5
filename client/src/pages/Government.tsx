import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GOVERNMENTS, POLICIES, type GovernmentId } from "@/lib/governmentData";
import { useGame } from "@/lib/gameContext";
import {
  calculateGovernmentPressure,
  DEFAULT_GOVERNMENT_SYSTEMS_STATE,
  getGovernmentRegimeProfile,
  getGovernmentSystemsForGovernment,
  getMechanicsForSystem,
  GOVERNMENT_MENU_TREE,
  GOVERNMENT_SYSTEM_DIRECTIVE_OPTIONS,
  type GovernmentSystemsState,
} from "@/lib/governmentSystems";
import { cn } from "@/lib/utils";
import type { GovBuildingCategory, GovBuildingSubCategory } from "@shared/config/governmentBuildingStructuresConfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Cpu, Gavel, Landmark, Network, ScrollText, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";

type GovernmentSubMenu = "cabinet" | "field" | "systems" | "structures" | "policies" | "tree";
type Leader = { id: string; name: string; type: string; class: string; subClass: string; subType: string; governanceStyle: string; bonuses: Record<string, number> };
type LeadersResponse = { success: boolean; leaders: Leader[]; leaderTypes: string[]; leaderClasses: string[] };
type AppointmentsResponse = { success: boolean; appointments: { cabinet: Record<string, string>; doctrine: { civicFocus: string; fieldPosture: string; civilMandate: string } } };
type GovernmentSystemsResponse = { success: boolean; systems: GovernmentSystemsState };
type GovernmentProgressionStatusResponse = { success: boolean; status: { level: number; tier: number; xp: number; xpToNext: number; unlockedNodes: string[]; nodeRanks: Record<string, number>; pillarPoints: Record<string, number> } };
type GovernmentTreeResponse = { success: boolean; tree: { maxLevel: number; maxTier: number; nodes: Array<{ id: string; name: string; description: string; pillar: "stability" | "law" | "economic"; tier: number; requiredLevel: number; maxRank: number; costResources: { metal: number; crystal: number; deuterium: number }; effects?: Record<string, number> }> } };
type AvailableNodesResponse = { success: boolean; availableNodes: Array<{ id: string; name: string; description: string; pillar: "stability" | "law" | "economic"; tier: number; maxRank: number; effects?: Record<string, number> }>; count: number };
type GovernmentBuildingsResponse = { success: boolean; totalCategories: number; totalSubCategories: number; categories: GovBuildingCategory[]; classes: string[]; types: string[] };
type GovernmentBuildingSubCategoriesResponse = { success: boolean; total: number; subCategories: GovBuildingSubCategory[] };
type GovernmentBuildingStatsResponse = { success: boolean; subCategoryId: string; level: number; tier: number; tierLabel: string; levelLabel: string; rank: { rankTier: number; name: string; title: string; description: string; requiredLevel: number }; computedStats: Array<{ id: string; name: string; description: string; value: number; subStats: Array<{ id: string; name: string; description: string; value: number }> }> };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || payload?.error || "Request failed");
  return payload as T;
}

const titleCase = (value: string) => value.split(/[-_\s]+/).filter(Boolean).map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(" ");
const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const getCounts = (values: string[]) => values.reduce<Record<string, number>>((acc, value) => ({ ...acc, [value]: (acc[value] || 0) + 1 }), {});
const getNodeEffects = (effects?: Record<string, number>) => Object.entries(effects || {}).filter(([, value]) => value !== 0).slice(0, 4).map(([key, value]) => `${titleCase(key)} ${value > 0 && value < 1 ? `+${Math.round(value * 100)}%` : value > 1 && value < 2 ? `+${Math.round((value - 1) * 100)}%` : value}`);

export default function Government() {
  const { government, setGovernmentType, togglePolicy, setTaxRate } = useGame();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSubMenu, setActiveSubMenu] = useState<GovernmentSubMenu>("cabinet");
  const [selectedStructureClass, setSelectedStructureClass] = useState("all");
  const [selectedStructureType, setSelectedStructureType] = useState("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedStructureId, setSelectedStructureId] = useState("");
  const [previewTier, setPreviewTier] = useState(12);
  const [previewLevel, setPreviewLevel] = useState(120);

  useEffect(() => {
    const syncFromUrl = () => {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (tab === "cabinet" || tab === "field" || tab === "systems" || tab === "structures" || tab === "policies" || tab === "tree") setActiveSubMenu(tab);
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeSubMenu);
    window.history.replaceState(null, "", `/government?${params.toString()}`);
  }, [activeSubMenu]);

  const leadersQuery = useQuery<LeadersResponse>({ queryKey: ["government-leaders"], queryFn: () => fetchJson("/api/government-leaders") });
  const appointmentsQuery = useQuery<AppointmentsResponse>({ queryKey: ["government-appointments"], queryFn: () => fetchJson("/api/government-leaders/appointments/me") });
  const systemsQuery = useQuery<GovernmentSystemsResponse>({ queryKey: ["government-systems-state"], queryFn: () => fetchJson("/api/government-leaders/systems/me") });
  const progressionStatusQuery = useQuery<GovernmentProgressionStatusResponse>({ queryKey: ["government-progression-status"], queryFn: () => fetchJson("/api/government-progression/status") });
  const progressionTreeQuery = useQuery<GovernmentTreeResponse>({ queryKey: ["government-progression-tree"], queryFn: () => fetchJson("/api/government-progression/tree") });
  const availableNodesQuery = useQuery<AvailableNodesResponse>({ queryKey: ["government-progression-available"], queryFn: () => fetchJson("/api/government-progression/available-nodes") });
  const governmentBuildingsQuery = useQuery<GovernmentBuildingsResponse>({ queryKey: ["government-buildings"], queryFn: () => fetchJson("/api/government-buildings") });
  const governmentBuildingSubCategoriesQuery = useQuery<GovernmentBuildingSubCategoriesResponse>({ queryKey: ["government-building-subcategories"], queryFn: () => fetchJson("/api/government-buildings/sub-categories") });
  const buildingStatsQuery = useQuery<GovernmentBuildingStatsResponse>({ queryKey: ["government-building-stats", selectedStructureId, previewLevel, previewTier], queryFn: () => fetchJson(`/api/government-buildings/stats/${selectedStructureId}?level=${previewLevel}&tier=${previewTier}`), enabled: Boolean(selectedStructureId) });

  const unlockNodeMutation = useMutation({
    mutationFn: (nodeId: string) => fetchJson("/api/government-progression/unlock", { method: "POST", body: JSON.stringify({ nodeId }) }),
    onSuccess: () => {
      toast({ title: "Node unlocked", description: "Government tree progress advanced." });
      queryClient.invalidateQueries({ queryKey: ["government-progression-status"] });
      queryClient.invalidateQueries({ queryKey: ["government-progression-available"] });
    },
    onError: (error: Error) => toast({ title: "Unlock failed", description: error.message, variant: "destructive" }),
  });

  const updateAppointmentsMutation = useMutation({
    mutationFn: (payload: AppointmentsResponse["appointments"]) => fetchJson("/api/government-leaders/appointments/me", { method: "PUT", body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["government-appointments"] }),
    onError: (error: Error) => toast({ title: "Update failed", description: error.message, variant: "destructive" }),
  });

  const updateSystemsMutation = useMutation({
    mutationFn: (payload: GovernmentSystemsState) => fetchJson("/api/government-leaders/systems/me", { method: "PUT", body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["government-systems-state"] }),
    onError: (error: Error) => toast({ title: "Systems update failed", description: error.message, variant: "destructive" }),
  });

  if (!government?.stats || !government?.type) return <GameLayout><div className="py-12 text-center">Loading government data...</div></GameLayout>;

  const activeGov = GOVERNMENTS[government.type];
  const regimeProfile = getGovernmentRegimeProfile(government.type);
  const systemsState = systemsQuery.data?.systems || DEFAULT_GOVERNMENT_SYSTEMS_STATE;
  const pressure = calculateGovernmentPressure(government.type, government.taxRate || 0, government.policies, systemsState);
  const menuMeta = GOVERNMENT_MENU_TREE.find((menu) => menu.id === activeSubMenu) || GOVERNMENT_MENU_TREE[0];
  const leaders = leadersQuery.data?.leaders || [];
  const leaderTypes = leadersQuery.data?.leaderTypes || [];
  const appointments = appointmentsQuery.data?.appointments;
  const categories = governmentBuildingsQuery.data?.categories || [];
  const subCategories = governmentBuildingSubCategoriesQuery.data?.subCategories || [];
  const visibleCategories = categories.filter((category) => (selectedStructureClass === "all" || category.class === selectedStructureClass) && (selectedStructureType === "all" || category.type === selectedStructureType));
  const visibleSubCategories = subCategories.filter((subCategory) => (selectedStructureClass === "all" || subCategory.class === selectedStructureClass) && (selectedStructureType === "all" || subCategory.type === selectedStructureType) && (!selectedCategoryId || subCategory.categoryId === selectedCategoryId));
  const activeStructure = visibleSubCategories.find((subCategory) => subCategory.id === selectedStructureId) || visibleSubCategories[0];
  const appointedCount = Object.values(appointments?.cabinet || {}).filter(Boolean).length;
  const leaderClassCounts = getCounts(leaders.map((leader) => leader.class));
  const leaderSubClassCounts = getCounts(leaders.map((leader) => leader.subClass));
  const governmentSystems = getGovernmentSystemsForGovernment(government.type);
  const updateSystems = (payload: { directives?: Partial<GovernmentSystemsState["directives"]>; allocations?: Partial<GovernmentSystemsState["allocations"]> }) =>
    updateSystemsMutation.mutate({
      directives: { ...systemsState.directives, ...(payload.directives || {}) },
      allocations: { ...systemsState.allocations, ...(payload.allocations || {}) },
    });

  useEffect(() => {
    if (visibleCategories.length && !visibleCategories.some((category) => category.id === selectedCategoryId)) setSelectedCategoryId(visibleCategories[0].id);
  }, [selectedCategoryId, visibleCategories]);

  useEffect(() => {
    if (visibleSubCategories.length && !visibleSubCategories.some((subCategory) => subCategory.id === selectedStructureId)) setSelectedStructureId(visibleSubCategories[0].id);
  }, [selectedStructureId, visibleSubCategories]);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/planet_surface.png" alt="Government" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/buildings/command_center.png" alt="Government" className="w-20 h-20 rounded-xl object-cover ring-2 ring-slate-300/50 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Planetary Government</h2>
              <p className="text-slate-300 font-rajdhani text-lg">Government systems, reform mechanics, cabinet management, and policy doctrine.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <Card className="xl:col-span-2 bg-white border-slate-200"><CardHeader><CardTitle className="flex items-center gap-2 text-slate-900"><Landmark className="w-5 h-5 text-primary" />State Overview</CardTitle></CardHeader><CardContent className="space-y-4"><div className="rounded border border-slate-200 bg-slate-50 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Active Regime</div><h3 className="text-2xl font-orbitron text-slate-900">{activeGov.name}</h3><div className="mt-2 flex flex-wrap gap-2"><Badge className="bg-slate-900 text-white">{activeGov.rulerTitle}</Badge><Badge variant="outline">{activeGov.family}</Badge><Badge variant="outline">{activeGov.controlModel}</Badge></div><p className="mt-2 text-sm text-slate-600">{activeGov.description}</p></div><div className="text-right"><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Tax Rate</div><div className="text-3xl font-mono font-bold text-primary">{government.taxRate || 0}%</div></div></div></div><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[{ label: "Stability", value: government.stats.stability }, { label: "Support", value: government.stats.publicSupport }, { label: "Efficiency", value: government.stats.efficiency }, { label: "Readiness", value: government.stats.militaryReadiness }].map((metric) => <div key={metric.label} className="rounded border border-slate-200 bg-slate-50 p-3"><div className="mb-1 flex justify-between text-sm font-semibold text-slate-700"><span>{metric.label}</span><span>{metric.value}%</span></div><Progress value={metric.value} className="h-2" /></div>)}</div><div><div className="mb-2 flex justify-between text-sm font-semibold text-slate-900"><span>Taxation Level</span><span className="text-xs uppercase tracking-[0.18em] text-slate-500">Pressure driver</span></div><Slider value={[government.taxRate || 0]} max={100} step={1} onValueChange={(value) => setTaxRate(value[0])} /></div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardHeader><CardTitle className="flex items-center gap-2 text-slate-900"><ScrollText className="w-5 h-5 text-slate-600" />Regime Detail</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-700"><div><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Doctrine</div><div className="mt-1 font-semibold text-slate-900">{activeGov.doctrine}</div></div><div><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Succession</div><div className="mt-1">{activeGov.successionModel}</div></div><div><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Power Base</div><div className="mt-1">{activeGov.powerBase}</div></div><div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">{regimeProfile.flavor}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardHeader><CardTitle className="flex items-center gap-2 text-slate-900"><Network className="w-5 h-5 text-slate-600" />Current Submenu</CardTitle><CardDescription>{menuMeta.description}</CardDescription></CardHeader><CardContent className="space-y-3"><div className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Open Page</div><div className="mt-1 font-orbitron text-lg text-slate-900">{menuMeta.pageTitle}</div></div><div className="flex flex-wrap gap-2">{menuMeta.subPages.map((subPage) => <Badge key={subPage} variant="secondary">{subPage}</Badge>)}</div></CardContent></Card>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">{[{ label: "Legitimacy", value: pressure.legitimacy }, { label: "Control", value: pressure.control }, { label: "Growth", value: pressure.growth }, { label: "Innovation", value: pressure.innovation }, { label: "Bureaucracy", value: pressure.bureaucracy }].map((metric) => <Card key={metric.label} className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">{metric.label}</div><div className="mt-2 text-2xl font-orbitron text-slate-900">{clampPercent(metric.value)}%</div><Progress value={clampPercent(metric.value)} className="mt-2 h-2" /></CardContent></Card>)}</div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"><Card className="lg:col-span-2 bg-white border-slate-200"><CardHeader><CardTitle className="flex items-center gap-2 text-slate-900"><ShieldCheck className="w-5 h-5 text-primary" />Reform Mechanics</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2"><div className="rounded border border-slate-200 bg-slate-50 p-4"><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Bonuses</div><div className="space-y-2">{activeGov.bonuses.map((bonus) => <div key={bonus} className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">+ {bonus}</div>)}</div></div><div className="rounded border border-slate-200 bg-slate-50 p-4"><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Penalties</div><div className="space-y-2">{activeGov.penalties.map((penalty) => <div key={penalty} className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">- {penalty}</div>)}</div></div></CardContent></Card><Card className="bg-white border-slate-200"><CardHeader><CardTitle className="flex items-center gap-2 text-slate-900"><Gavel className="w-5 h-5 text-slate-600" />Political Reform</CardTitle></CardHeader><CardContent className="space-y-3">{Object.values(GOVERNMENTS).map((gov) => <div key={gov.id} className={cn("rounded border p-3 cursor-pointer transition-all hover:bg-slate-50", government.type === gov.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200")} onClick={() => setGovernmentType(gov.id as GovernmentId)}><div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-900">{gov.name}</span>{government.type === gov.id ? <Badge className="bg-primary text-[10px]">Active</Badge> : null}</div><div className="text-xs text-slate-500">{gov.family} · {gov.controlModel}</div></div>)}</CardContent></Card></div>
        <Tabs value={activeSubMenu} onValueChange={(value) => setActiveSubMenu(value as GovernmentSubMenu)}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <TabsTrigger value="cabinet">Cabinet</TabsTrigger><TabsTrigger value="field">Doctrine</TabsTrigger><TabsTrigger value="systems">Systems</TabsTrigger><TabsTrigger value="structures">Structures</TabsTrigger><TabsTrigger value="policies">Policies</TabsTrigger><TabsTrigger value="tree">Gov Tree</TabsTrigger>
          </TabsList>
          <TabsContent value="cabinet" className="mt-4">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><Users className="w-5 h-5" />Government Cabinet Seats</CardTitle>
                  <CardDescription>Assign leaders by type while keeping class and sub class coverage balanced.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[{ label: "Leader Types", value: leaderTypes.length }, { label: "Leader Classes", value: Object.keys(leaderClassCounts).length }, { label: "Sub Classes", value: Object.keys(leaderSubClassCounts).length }, { label: "Appointed", value: appointedCount }].map((metric) => <div key={metric.label} className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">{metric.label}</div><div className="mt-2 text-2xl font-orbitron text-slate-900">{metric.value}</div></div>)}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {leaderTypes.map((leaderType) => {
                      const slotValue = appointments?.cabinet?.[leaderType] || "unassigned";
                      const pool = leaders.filter((leader) => leader.type === leaderType);
                      return (
                        <div key={leaderType} className="rounded border border-slate-200 bg-slate-50 p-4 space-y-3">
                          <div>
                            <div className="font-semibold text-slate-900">{leaderType}</div>
                            <div className="text-xs text-slate-500">{pool.length} candidates</div>
                          </div>
                          <Select value={slotValue} onValueChange={(value) => updateAppointmentsMutation.mutate({ cabinet: { ...(appointments?.cabinet || {}), [leaderType]: value === "unassigned" ? "" : value }, doctrine: appointments?.doctrine || { civicFocus: "balanced", fieldPosture: "defensive", civilMandate: "growth" } })}>
                            <SelectTrigger><SelectValue placeholder="Assign leader" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {pool.map((leader) => <SelectItem key={leader.id} value={leader.id}>{leader.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">{[...new Set(pool.map((leader) => leader.class))].slice(0, 3).map((leaderClass) => <Badge key={leaderClass} variant="outline">{leaderClass}</Badge>)}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><ScrollText className="w-5 h-5 text-slate-600" />Leader Taxonomy</CardTitle>
                  <CardDescription>Live breakdown of classes, sub classes, and sub types.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Top Classes</div><div className="space-y-2">{Object.entries(leaderClassCounts).slice(0, 8).map(([name, count]) => <div key={name} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><span>{name}</span><Badge variant="outline">{count}</Badge></div>)}</div></div>
                  <Separator />
                  <div><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Top Sub Classes</div><div className="space-y-2">{Object.entries(leaderSubClassCounts).slice(0, 8).map(([name, count]) => <div key={name} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><span>{name}</span><Badge variant="outline">{count}</Badge></div>)}</div></div>
                  <Separator />
                  <div><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Sub Types</div><div className="flex flex-wrap gap-2">{Object.entries(getCounts(leaders.map((leader) => leader.subType))).slice(0, 10).map(([name, count]) => <Badge key={name} variant="secondary">{name} · {count}</Badge>)}</div></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="field" className="mt-4">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><ShieldCheck className="w-5 h-5" />Doctrine and Civil Mandates</CardTitle>
                  <CardDescription>These settings control civic focus, field posture, and civil mandate behavior.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded border border-slate-200 bg-slate-50 p-4 space-y-2"><div className="font-semibold text-slate-900">Civic Focus</div><Select value={appointments?.doctrine?.civicFocus || "balanced"} onValueChange={(value) => updateAppointmentsMutation.mutate({ cabinet: appointments?.cabinet || {}, doctrine: { ...(appointments?.doctrine || {}), civicFocus: value, fieldPosture: appointments?.doctrine?.fieldPosture || "defensive", civilMandate: appointments?.doctrine?.civilMandate || "growth" } })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="balanced">Balanced</SelectItem><SelectItem value="expansion">Expansion</SelectItem><SelectItem value="research">Research</SelectItem></SelectContent></Select></div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-4 space-y-2"><div className="font-semibold text-slate-900">Field Posture</div><Select value={appointments?.doctrine?.fieldPosture || "defensive"} onValueChange={(value) => updateAppointmentsMutation.mutate({ cabinet: appointments?.cabinet || {}, doctrine: { ...(appointments?.doctrine || {}), civicFocus: appointments?.doctrine?.civicFocus || "balanced", fieldPosture: value, civilMandate: appointments?.doctrine?.civilMandate || "growth" } })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="defensive">Defensive</SelectItem><SelectItem value="expeditionary">Expeditionary</SelectItem><SelectItem value="rapid-response">Rapid Response</SelectItem></SelectContent></Select></div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-4 space-y-2"><div className="font-semibold text-slate-900">Civil Mandate</div><Select value={appointments?.doctrine?.civilMandate || "growth"} onValueChange={(value) => updateAppointmentsMutation.mutate({ cabinet: appointments?.cabinet || {}, doctrine: { ...(appointments?.doctrine || {}), civicFocus: appointments?.doctrine?.civicFocus || "balanced", fieldPosture: appointments?.doctrine?.fieldPosture || "defensive", civilMandate: value } })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="growth">Growth</SelectItem><SelectItem value="compliance">Compliance</SelectItem><SelectItem value="infrastructure">Infrastructure</SelectItem></SelectContent></Select></div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><Landmark className="w-5 h-5 text-slate-600" />Doctrine Snapshot</CardTitle>
                  <CardDescription>Regime identity translated into current field behavior.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-700">
                  <div className="rounded border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Doctrine Title</div><div className="mt-1 font-semibold text-slate-900">{regimeProfile.doctrineTitle}</div></div>
                  <div className="grid grid-cols-2 gap-3">{[{ label: "Support", value: regimeProfile.pressureProfile.support }, { label: "Control", value: regimeProfile.pressureProfile.control }, { label: "Commerce", value: regimeProfile.pressureProfile.commerce }, { label: "Research", value: regimeProfile.pressureProfile.research }].map((entry) => <div key={entry.label} className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">{entry.label}</div><div className="mt-2 text-xl font-orbitron text-slate-900">{entry.value}%</div></div>)}</div>
                  <div className="rounded border border-indigo-200 bg-indigo-50 p-4 text-indigo-900">{regimeProfile.flavor}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="systems" className="mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1.45fr]">
                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900"><Cpu className="w-5 h-5 text-primary" />Directive Controls</CardTitle>
                    <CardDescription>Persistent government systems state for directives and budget allocations.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {([["executiveStyle", "Executive Style"], ["legislativeAgenda", "Legislative Agenda"], ["judicialDoctrine", "Judicial Doctrine"], ["securityPosture", "Security Posture"], ["economicModel", "Economic Model"], ["scienceMandate", "Science Mandate"]] as const).map(([key, label]) => <div key={key} className="rounded border border-slate-200 bg-slate-50 p-3 space-y-2"><div className="font-semibold text-slate-900">{label}</div><Select value={systemsState.directives[key]} onValueChange={(value) => updateSystems({ directives: { [key]: value } as Partial<GovernmentSystemsState["directives"]> })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{GOVERNMENT_SYSTEM_DIRECTIVE_OPTIONS[key].map((option) => <SelectItem key={option} value={option}>{titleCase(option)}</SelectItem>)}</SelectContent></Select></div>)}
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900"><Building2 className="w-5 h-5 text-slate-600" />Budget Allocation Mechanics</CardTitle>
                    <CardDescription>Budgets alter legitimacy, growth, innovation, control, and bureaucracy.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {([["civilBudget", "Civil Budget"], ["defenseBudget", "Defense Budget"], ["tradeBudget", "Trade Budget"], ["researchBudget", "Research Budget"], ["oversightBudget", "Oversight Budget"]] as const).map(([key, label]) => <div key={key} className="rounded border border-slate-200 bg-slate-50 p-4"><div className="mb-2 flex items-center justify-between gap-3"><div className="font-semibold text-slate-900">{label}</div><div className="font-mono text-lg font-bold text-primary">{systemsState.allocations[key]}%</div></div><Slider value={[systemsState.allocations[key]]} max={100} step={1} onValueCommit={(value) => updateSystems({ allocations: { [key]: clampPercent(value[0]) } as Partial<GovernmentSystemsState["allocations"]> })} /></div>)}
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><Network className="w-5 h-5 text-slate-600" />Government Menu Map</CardTitle>
                  <CardDescription>Main menus, sub menus, pages, and sub pages exposed in this hub.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {GOVERNMENT_MENU_TREE.map((menu) => <div key={menu.id} className={cn("rounded border p-4", menu.id === activeSubMenu ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50")}><div className="mb-2 flex items-center justify-between gap-2"><div className="font-semibold text-slate-900">{menu.pageTitle}</div><Badge variant="outline">{menu.label}</Badge></div><div className="text-sm text-slate-600">{menu.description}</div><div className="mt-3 flex flex-wrap gap-2">{menu.subPages.map((subPage) => <Badge key={subPage} variant="secondary">{subPage}</Badge>)}</div></div>)}
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {governmentSystems.map((system) => <Card key={system.id} className={cn("bg-white border-slate-200", activeGov.preferredSystems.includes(system.id) && "ring-1 ring-primary")}><CardHeader><CardTitle className="flex items-center justify-between gap-3 text-slate-900"><span>{system.name}</span>{activeGov.preferredSystems.includes(system.id) ? <Badge className="bg-primary">Priority</Badge> : <Badge variant="outline">Support</Badge>}</CardTitle><CardDescription>{system.summary}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{system.pageLabel} · {system.governanceAxis}</div><div className="space-y-3">{system.subsystems.map((subsystem) => <div key={subsystem.id} className="rounded border border-slate-200 bg-slate-50 p-4"><div className="font-semibold text-slate-900">{subsystem.name}</div><div className="text-xs text-slate-500">{subsystem.className} · {subsystem.subClassName} · {subsystem.typeName} · {subsystem.subTypeName}</div><div className="mt-2 text-sm text-slate-600">{subsystem.summary}</div><div className="mt-3 flex flex-wrap gap-2">{subsystem.responsibilities.map((responsibility) => <Badge key={responsibility} variant="outline">{responsibility}</Badge>)}</div></div>)}</div><Separator /><div className="space-y-2">{getMechanicsForSystem(system).map((mechanic) => <div key={mechanic.id} className="rounded border border-slate-200 bg-white p-3"><div className="font-semibold text-slate-900">{mechanic.name}</div><div className="mt-1 text-sm text-slate-600">{mechanic.effect}</div><div className="mt-1 text-xs text-slate-500">Impact: {mechanic.playerImpact}</div><div className="mt-1 text-xs text-rose-600">Risk: {mechanic.risk}</div></div>)}</div></CardContent></Card>)}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="structures" className="mt-4">
            <div className="space-y-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><Building2 className="w-5 h-5 text-primary" />Government Structures Browser</CardTitle>
                  <CardDescription>Browse classes, sub classes, types, sub types, levels, tiers, and scaled mechanics.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <div className="space-y-2"><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Class Filter</div><Select value={selectedStructureClass} onValueChange={setSelectedStructureClass}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Classes</SelectItem>{(governmentBuildingsQuery.data?.classes || []).map((value) => <SelectItem key={value} value={value}>{titleCase(value)}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Type Filter</div><Select value={selectedStructureType} onValueChange={setSelectedStructureType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{(governmentBuildingsQuery.data?.types || []).map((value) => <SelectItem key={value} value={value}>{titleCase(value)}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Preview Level</div><Slider value={[previewLevel]} min={1} max={999} step={1} onValueChange={(value) => setPreviewLevel(value[0])} /><div className="font-mono text-sm text-slate-600">{previewLevel}</div></div>
                  <div className="space-y-2"><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Preview Tier</div><Slider value={[previewTier]} min={1} max={99} step={1} onValueChange={(value) => setPreviewTier(value[0])} /><div className="font-mono text-sm text-slate-600">{previewTier}</div></div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.45fr]">
                <Card className="bg-white border-slate-200">
                  <CardHeader><CardTitle className="text-slate-900">Categories and Sub Categories</CardTitle><CardDescription>{governmentBuildingsQuery.data?.totalCategories || 0} categories · {governmentBuildingsQuery.data?.totalSubCategories || 0} sub categories</CardDescription></CardHeader>
                  <CardContent className="space-y-4">
                    <div><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Categories</div><ScrollArea className="h-[220px] pr-3"><div className="space-y-2">{visibleCategories.map((category) => <button key={category.id} className={cn("w-full rounded border px-3 py-3 text-left transition-all", selectedCategoryId === category.id ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-white")} onClick={() => setSelectedCategoryId(category.id)}><div className="font-semibold text-slate-900">{category.name}</div><div className="text-xs text-slate-500">{category.class} · {category.subClass} · {category.type}</div></button>)}</div></ScrollArea></div>
                    <Separator />
                    <div><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Sub Categories</div><ScrollArea className="h-[320px] pr-3"><div className="space-y-2">{visibleSubCategories.map((subCategory) => <button key={subCategory.id} className={cn("w-full rounded border px-3 py-3 text-left transition-all", selectedStructureId === subCategory.id ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-white")} onClick={() => setSelectedStructureId(subCategory.id)}><div className="font-semibold text-slate-900">{subCategory.name}</div><div className="text-xs text-slate-500">{subCategory.class} · {subCategory.subClass} · {subCategory.type} · {subCategory.subType}</div></button>)}</div></ScrollArea></div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                  <CardHeader><CardTitle className="text-slate-900">{activeStructure?.name || "Select a structure"}</CardTitle><CardDescription>{activeStructure?.categoryId || "No structure selected"}</CardDescription></CardHeader>
                  <CardContent className="space-y-5">{activeStructure ? <><div className="flex flex-wrap gap-2"><Badge variant="outline">{titleCase(activeStructure.class)}</Badge><Badge variant="outline">{titleCase(activeStructure.subClass)}</Badge><Badge variant="outline">{titleCase(activeStructure.type)}</Badge><Badge variant="outline">{titleCase(activeStructure.subType)}</Badge><Badge variant="secondary">Tier {previewTier}</Badge><Badge variant="secondary">Level {previewLevel}</Badge></div><div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{activeStructure.description}</div><div className="grid grid-cols-1 gap-4 lg:grid-cols-2"><div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2"><div><span className="font-semibold text-slate-900">Overview:</span> {activeStructure.details.overview}</div><div><span className="font-semibold text-slate-900">History:</span> {activeStructure.details.history}</div><div><span className="font-semibold text-slate-900">Function:</span> {activeStructure.details.functionality}</div><div><span className="font-semibold text-slate-900">Requirements:</span> {activeStructure.details.requirements}</div></div><div className="rounded border border-slate-200 bg-slate-50 p-4"><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Sub Descriptions</div><div className="space-y-2 text-sm text-slate-700">{activeStructure.details.subDescriptions.map((detail) => <div key={detail.id}><span className="font-semibold text-slate-900">{detail.title}:</span> {detail.text}</div>)}</div></div></div><div className="grid grid-cols-1 gap-4 lg:grid-cols-2"><div className="rounded border border-slate-200 bg-white p-4"><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Scaled Stats</div><div className="space-y-3">{(buildingStatsQuery.data?.computedStats || []).map((stat) => <div key={stat.id} className="rounded border border-slate-200 bg-slate-50 p-3"><div className="flex items-center justify-between gap-2"><div className="font-semibold text-slate-900">{stat.name}</div><div className="font-mono text-primary">{Math.round(stat.value * 100) / 100}</div></div><div className="mt-1 text-xs text-slate-500">{stat.description}</div><div className="mt-2 space-y-1">{stat.subStats.slice(0, 3).map((subStat) => <div key={subStat.id} className="flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1 text-xs"><span>{subStat.name}</span><span className="font-mono">{Math.round(subStat.value * 100) / 100}</span></div>)}</div></div>)}</div></div><div className="space-y-4"><div className="rounded border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Rank Window</div><div className="mt-1 font-semibold text-slate-900">{buildingStatsQuery.data?.rank?.title || "..."}</div><div className="text-sm text-slate-600">{buildingStatsQuery.data?.levelLabel || "Level"} · {buildingStatsQuery.data?.tierLabel || "Tier"}</div></div><div className="rounded border border-slate-200 bg-slate-50 p-4"><div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Attributes</div><div className="space-y-2 text-sm text-slate-700">{activeStructure.attributes.slice(0, 4).map((attribute) => <div key={attribute.id} className="rounded border border-slate-200 bg-white p-3"><div className="font-semibold text-slate-900">{attribute.name}</div><div className="text-xs text-slate-500">{attribute.description}</div></div>)}</div></div></div></div></> : <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">No government structures matched the current filters.</div>}</CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="policies" className="mt-4">
            <div className="space-y-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><ScrollText className="w-5 h-5 text-primary" />Policy Mechanics Board</CardTitle>
                  <CardDescription>Policy categories include subsystem mapping, upkeep, and risk.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {[{ label: "Active Policies", value: government.policies.length, suffix: "" }, { label: "Security Pressure", value: clampPercent(pressure.control), suffix: "%" }, { label: "Civil Legitimacy", value: clampPercent(pressure.legitimacy), suffix: "%" }, { label: "Bureaucracy", value: clampPercent(pressure.bureaucracy), suffix: "%" }].map((metric) => <div key={metric.label} className="rounded border border-slate-200 bg-slate-50 p-4"><div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">{metric.label}</div><div className="mt-2 text-2xl font-orbitron text-slate-900">{metric.value}{metric.suffix}</div></div>)}
                </CardContent>
              </Card>
              {(["security", "economic", "civil", "labor"] as const).map((category) => {
                const categoryPolicies = POLICIES.filter((policy) => policy.category === category);
                return (
                  <Card key={category} className="bg-white border-slate-200">
                    <CardHeader><CardTitle className="text-slate-900">{titleCase(category)} Policies</CardTitle><CardDescription>{categoryPolicies.length} policy definitions in this category.</CardDescription></CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {categoryPolicies.map((policy) => {
                        const isActive = government.policies.includes(policy.id);
                        return (
                          <div key={policy.id} className="rounded border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start justify-between gap-3"><div><div className="font-semibold text-slate-900">{policy.name}</div><div className="text-xs text-slate-500">{policy.subsystem}</div></div><Switch checked={isActive} onCheckedChange={() => togglePolicy(policy.id)} /></div>
                            <div className="mt-3 text-sm text-slate-600">{policy.description}</div>
                            <div className="mt-3 rounded border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary">{policy.effectDescription}</div>
                            <div className="mt-3 space-y-2 text-xs text-slate-500"><div><span className="font-semibold text-slate-700">Upkeep:</span> {policy.upkeep}</div><div><span className="font-semibold text-slate-700">Risk:</span> {policy.risk}</div></div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="tree" className="mt-4">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.6fr]">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><Landmark className="w-5 h-5 text-primary" />Government Tree Status</CardTitle>
                  <CardDescription>Track level, tier, pillar points, and available unlocks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">{[{ label: "Level", value: progressionStatusQuery.data?.status.level || 0 }, { label: "Tier", value: progressionStatusQuery.data?.status.tier || 0 }].map((metric) => <div key={metric.label} className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">{metric.label}</div><div className="text-2xl font-orbitron text-slate-900">{metric.value}</div></div>)}</div>
                  <div><div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-700"><span>Government XP</span><span>{progressionStatusQuery.data?.status.xp || 0} / {progressionStatusQuery.data?.status.xpToNext || 0}</span></div><Progress value={progressionStatusQuery.data?.status.xpToNext ? (progressionStatusQuery.data.status.xp / progressionStatusQuery.data.status.xpToNext) * 100 : 0} className="h-2" /></div>
                  <div className="space-y-2">{[{ label: "Stability", value: progressionStatusQuery.data?.status.pillarPoints?.stability || 0 }, { label: "Law", value: progressionStatusQuery.data?.status.pillarPoints?.law || 0 }, { label: "Economic", value: progressionStatusQuery.data?.status.pillarPoints?.economic || 0 }].map((entry) => <div key={entry.label} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm">{entry.label}: <span className="font-semibold">{entry.value}</span></div>)}</div>
                  <div className="rounded border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">Unlocked Nodes: <span className="font-semibold">{progressionStatusQuery.data?.status.unlockedNodes?.length || 0}</span> / {(progressionTreeQuery.data?.tree.nodes || []).length}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900"><Building2 className="w-5 h-5 text-slate-600" />Government Progression Nodes</CardTitle>
                  <CardDescription>Unlock detailed stability, law, and economic doctrine mechanics.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div><div className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Available Nodes</div><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{(availableNodesQuery.data?.availableNodes || []).map((node) => <div key={node.id} className="rounded border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-2"><div><div className="font-semibold text-slate-900">{node.name}</div><div className="text-xs uppercase tracking-[0.18em] text-slate-500">{node.pillar} · Tier {node.tier}</div></div><Badge variant="outline">Rank {node.maxRank}</Badge></div><div className="mt-2 text-sm text-slate-600">{node.description}</div><div className="mt-3 flex flex-wrap gap-2">{getNodeEffects(node.effects).map((line) => <Badge key={line} variant="secondary">{line}</Badge>)}</div><Button className="mt-4" size="sm" onClick={() => unlockNodeMutation.mutate(node.id)} disabled={unlockNodeMutation.isPending}>Unlock Node</Button></div>)}</div></div>
                  <Separator />
                  <div><div className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Tree Nodes</div><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{(progressionTreeQuery.data?.tree.nodes || []).map((node) => { const isUnlocked = Boolean(progressionStatusQuery.data?.status.unlockedNodes?.includes(node.id)); return <div key={node.id} className={cn("space-y-3 rounded border p-4", isUnlocked ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white")}><div className="flex items-center justify-between gap-2"><div className="font-semibold text-slate-900">{node.name}</div><Badge variant="outline">{node.pillar}</Badge></div><div className="text-xs text-slate-500">Tier {node.tier} · Requires Level {node.requiredLevel} · Max Rank {node.maxRank}</div><div className="text-sm text-slate-600">{node.description}</div><div className="flex flex-wrap gap-2">{getNodeEffects(node.effects).map((line) => <Badge key={line} variant="secondary">{line}</Badge>)}</div><div className="text-xs text-slate-500">Cost: {node.costResources.metal} metal · {node.costResources.crystal} crystal · {node.costResources.deuterium} deuterium</div><div className="text-xs font-semibold text-slate-700">{isUnlocked ? "Unlocked" : "Locked"}</div></div>; })}</div></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
