import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Zap,
  Users,
  Shield,
  Building2,
  Orbit,
  Cpu,
  Wheat,
  Droplets,
  TrendingUp,
  Moon,
  Map,
  Layers,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PLANET_ASSETS } from "@shared/config";
import {
  applyManagementProfile,
  COLONIES_PER_PAGE,
  ColonyManagementProfile,
  ColonySystemRecord,
  getEmpireColoniesPage,
  getEmpireOverview,
  getSameSystemKey,
  getSystemOverview,
  TOTAL_COLONY_PAGES,
} from "@/lib/colonySystems";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type PopulationSnapshotResponse = {
  success: boolean;
  snapshot: {
    frameTier: number;
    frame: {
      name: string;
      populationCapacityBonus: number;
      foodEfficiencyBonus: number;
      waterEfficiencyBonus: number;
      stabilityBonus: number;
    };
    population: {
      current: number;
      capacity: number;
      utilization: number;
      happiness: number;
      estimatedGrowthPerHour: number;
      classes: Record<string, number>;
    };
    food: {
      stock: number;
      productionPerHour: number;
      demandPerHour: number;
      netPerHour: number;
      pressure: string;
      hoursToDepletion: number | null;
    };
    water: {
      stock: number;
      productionPerHour: number;
      demandPerHour: number;
      netPerHour: number;
      pressure: string;
      hoursToDepletion: number | null;
    };
  };
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }

  return payload as T;
}

function pressureClasses(pressure: string) {
  switch (pressure) {
    case "surplus":
      return "bg-emerald-100 text-emerald-900";
    case "stable":
      return "bg-blue-100 text-blue-900";
    case "strained":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-red-100 text-red-900";
  }
}

function getPlanetImagePath(planetClass: string) {
  const normalized = planetClass.toUpperCase();
  if (normalized === "M") return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  if (normalized === "D") return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (normalized === "V") return PLANET_ASSETS.TERRESTRIAL.VOLCANIC.path;
  if (normalized === "R") return PLANET_ASSETS.TERRESTRIAL.JUNGLE.path;
  if (normalized === "G") return PLANET_ASSETS.GAS_GIANTS.JUPITER_CLASS.path;
  if (normalized === "I") return PLANET_ASSETS.TERRESTRIAL.ICE.path;
  if (normalized === "A") return PLANET_ASSETS.EXOTIC.RING_WORLD.path;
  if (normalized === "P") return PLANET_ASSETS.EXOTIC.DYSON_SPHERE.path;
  return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
}

function statusBadgeClasses(condition: ColonySystemRecord["planetStatus"]["condition"]) {
  if (condition === "excellent") return "bg-emerald-100 text-emerald-900";
  if (condition === "stable") return "bg-blue-100 text-blue-900";
  if (condition === "strained") return "bg-amber-100 text-amber-900";
  return "bg-red-100 text-red-900";
}

const MANAGEMENT_PROFILES: ColonyManagementProfile[] = ["balanced", "industry", "defense", "science"];

type ManagementScope = "individual" | "system" | "page" | "all";

export default function Colonies() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedColonyId, setSelectedColonyId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [activeProfile, setActiveProfile] = useState<ColonyManagementProfile>("balanced");
  const [managementScope, setManagementScope] = useState<ManagementScope>("individual");
  const [profileOverrides, setProfileOverrides] = useState<Record<string, ColonyManagementProfile>>({});
  const [globalProfile, setGlobalProfile] = useState<ColonyManagementProfile | null>(null);

  const populationSnapshotQuery = useQuery<PopulationSnapshotResponse>({
    queryKey: ["population-snapshot"],
    queryFn: () => fetchJson<PopulationSnapshotResponse>("/api/population/snapshot"),
    refetchInterval: 30000,
  });

  const colonizeMutation = useMutation({
    mutationFn: async (slot: ColonySystemRecord) => {
      const response = await fetch("/api/game/send-fleet", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: slot.coordinates,
          missionType: "colonize",
          ships: {
            colonyShip: 1,
            lightFighter: 3,
            largeCargo: 1,
          },
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Failed to queue colonization mission");
      }

      return payload;
    },
    onSuccess: (result, slot) => {
      toast({
        title: "Colonization mission queued",
        description: result?.message || `Fleet launched for ${slot.name} (${slot.coordinates}).`,
      });
      setLocation(`/fleet?tab=active&mission=colonize&targetType=planet`);
    },
    onError: (error: Error) => {
      toast({ title: "Colonization failed", description: error.message, variant: "destructive" });
    },
  });

  const pageData = useMemo(() => getEmpireColoniesPage(currentPage, COLONIES_PER_PAGE), [currentPage]);

  const effectivePageItems = useMemo(() => {
    return pageData.items.map((item) => {
      const profile = profileOverrides[item.id] || globalProfile || "balanced";
      return applyManagementProfile(item, profile);
    });
  }, [globalProfile, pageData.items, profileOverrides]);

  useEffect(() => {
    if (!selectedColonyId || !effectivePageItems.some((item) => item.id === selectedColonyId)) {
      setSelectedColonyId(effectivePageItems[0]?.id || "");
    }
  }, [effectivePageItems, selectedColonyId]);

  const selectedColony = effectivePageItems.find((item) => item.id === selectedColonyId) || null;
  const ownedColonies = effectivePageItems.filter((item) => item.owner);
  const emptySlots = effectivePageItems.filter((item) => !item.owner);
  const totalPopulationOnPage = effectivePageItems.reduce((acc, item) => acc + item.population, 0);
  const totalDefensesOnPage = effectivePageItems.reduce((acc, item) => acc + item.defenses, 0);
  const empireOverview = useMemo(() => getEmpireOverview(), []);
  const snapshot = populationSnapshotQuery.data?.snapshot;
  const systemBodies = selectedColony ? getSystemOverview(selectedColony) : [];
  const moonBodies = systemBodies.filter((body) => body.type === "moon");

  const classColors: { [key: string]: string } = {
    M: "bg-blue-100 text-blue-900",
    D: "bg-red-100 text-red-900",
    V: "bg-yellow-100 text-yellow-900",
    R: "bg-gray-100 text-gray-900",
    G: "bg-green-100 text-green-900",
    I: "bg-cyan-100 text-cyan-900",
    A: "bg-amber-100 text-amber-900",
    P: "bg-purple-100 text-purple-900",
  };

  const applyManagement = () => {
    if (managementScope === "individual") {
      if (!selectedColony) {
        toast({ title: "No colony selected", description: "Select a colony first.", variant: "destructive" });
        return;
      }
      setProfileOverrides((current) => ({ ...current, [selectedColony.id]: activeProfile }));
      toast({ title: "Management updated", description: `${selectedColony.name} set to ${activeProfile} profile.` });
      return;
    }

    if (managementScope === "system") {
      if (!selectedColony) {
        toast({ title: "No colony selected", description: "Select a colony first.", variant: "destructive" });
        return;
      }

      const selectedSystemKey = getSameSystemKey(selectedColony);
      const updates: Record<string, ColonyManagementProfile> = {};
      for (const item of effectivePageItems) {
        if (getSameSystemKey(item) === selectedSystemKey) {
          updates[item.id] = activeProfile;
        }
      }

      setProfileOverrides((current) => ({ ...current, ...updates }));
      toast({ title: "System management updated", description: `Applied ${activeProfile} profile to all colonies in this system on current page.` });
      return;
    }

    if (managementScope === "page") {
      const updates: Record<string, ColonyManagementProfile> = {};
      for (const item of effectivePageItems) {
        updates[item.id] = activeProfile;
      }
      setProfileOverrides((current) => ({ ...current, ...updates }));
      toast({ title: "Page management updated", description: `Applied ${activeProfile} profile to colonies ${pageData.startIndex + 1}-${pageData.endIndex + 1}.` });
      return;
    }

    setGlobalProfile(activeProfile);
    setProfileOverrides({});
    toast({ title: "Empire management updated", description: `Applied ${activeProfile} profile to all ${empireOverview.totalColonies.toLocaleString()} colony records.` });
  };

  const goToPage = (target: number) => {
    const bounded = Math.max(1, Math.min(TOTAL_COLONY_PAGES, target));
    setCurrentPage(bounded);
    setPageInput(String(bounded));
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 140 }}>
          <img src="/assets/planets/terra.png" alt="Colony" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/65 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/planets/terra.png" alt="Terra Planet" className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-400/50 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Planetary Empire Command</h2>
              <p className="text-blue-300 font-rajdhani text-lg">Planet and moon management with sub-stats, solar system overview, and unified control.</p>
              <p className="text-xs text-slate-400 mt-1">{COLONIES_PER_PAGE} per page • {empireOverview.totalColonies.toLocaleString()} total colonies/moons</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-xs uppercase text-slate-600 font-bold">Owned Colonies</span>
              </div>
              <div className="text-2xl font-orbitron font-bold">{empireOverview.ownedColonies.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Current page: {ownedColonies.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-5 h-5 text-indigo-600" />
                <span className="text-xs uppercase text-slate-600 font-bold">Moon Bodies</span>
              </div>
              <div className="text-2xl font-orbitron font-bold">{empireOverview.totalMoonBodies.toLocaleString()}</div>
              <div className="text-xs text-slate-500">In empire records</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-xs uppercase text-slate-600 font-bold">Population (Page)</span>
              </div>
              <div className="text-2xl font-orbitron font-bold">{(totalPopulationOnPage / 1_000_000).toFixed(1)}M</div>
              <div className="text-xs text-slate-500">{totalPopulationOnPage.toLocaleString()} residents</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="text-xs uppercase text-slate-600 font-bold">Defense (Page)</span>
              </div>
              <div className="text-2xl font-orbitron font-bold">{totalDefensesOnPage.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Same systems, individual, or bulk control</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
              <Settings2 className="w-5 h-5 text-blue-600" /> Colony Management Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <div className="text-xs text-slate-500 uppercase mb-1">Scope</div>
              <select
                value={managementScope}
                onChange={(event) => setManagementScope(event.target.value as ManagementScope)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
              >
                <option value="individual">Individual colony</option>
                <option value="system">Same system (current page)</option>
                <option value="page">All colonies on page</option>
                <option value="all">All colonies in empire</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase mb-1">Profile</div>
              <select
                value={activeProfile}
                onChange={(event) => setActiveProfile(event.target.value as ColonyManagementProfile)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
              >
                {MANAGEMENT_PROFILES.map((profile) => (
                  <option value={profile} key={profile}>
                    {profile[0].toUpperCase() + profile.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase mb-1">Selected</div>
              <div className="border border-slate-200 rounded px-3 py-2 text-sm bg-slate-50 truncate">
                {selectedColony?.name || "No colony selected"}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase mb-1">Global Profile</div>
              <div className="border border-slate-200 rounded px-3 py-2 text-sm bg-slate-50">
                {globalProfile ? globalProfile : "Not set"}
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={applyManagement} data-testid="button-apply-colony-management">
                Apply Management
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="text-sm text-slate-600">
                Showing colonies <span className="font-bold text-slate-900">{pageData.startIndex + 1}</span>-<span className="font-bold text-slate-900">{pageData.endIndex + 1}</span> of <span className="font-bold text-slate-900">{pageData.totalItems.toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={currentPage === 1}>First</Button>
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <div className="text-xs text-slate-500 px-2">Page {currentPage.toLocaleString()} / {TOTAL_COLONY_PAGES.toLocaleString()}</div>
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= TOTAL_COLONY_PAGES}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => goToPage(TOTAL_COLONY_PAGES)} disabled={currentPage >= TOTAL_COLONY_PAGES}>Last</Button>
                <input
                  value={pageInput}
                  onChange={(event) => setPageInput(event.target.value.replace(/[^0-9]/g, ""))}
                  className="w-24 border border-slate-200 rounded px-2 py-1 text-sm"
                  placeholder="Page"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(Number.parseInt(pageInput || "1", 10))}
                >
                  Go
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-16">
            <TabsTrigger value="owned" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Globe className="w-4 h-4" /> Managed Colonies ({ownedColonies.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Orbit className="w-4 h-4" /> Available Slots ({emptySlots.length})
            </TabsTrigger>
            <TabsTrigger value="overview" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Building2 className="w-4 h-4" /> Planet/Moon Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedColonies.map((colony) => (
                <Card
                  key={colony.id}
                  className={cn("cursor-pointer border-slate-200 transition-all", selectedColonyId === colony.id ? "border-primary shadow-lg" : "hover:shadow-md")}
                  onClick={() => setSelectedColonyId(colony.id)}
                  data-testid={`colony-card-${colony.id}`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPlanetImagePath(colony.class)}
                          alt={colony.name}
                          className="w-12 h-12 rounded object-cover border border-slate-200 bg-slate-100"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = TEMP_THEME_IMAGE;
                          }}
                        />
                        <div>
                          <div className="font-orbitron font-bold text-slate-900">{colony.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{colony.coordinates}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={classColors[colony.class] || "bg-slate-100 text-slate-900"}>{colony.class}</Badge>
                        <Badge className={statusBadgeClasses(colony.planetStatus.condition)}>{colony.planetStatus.condition}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-bold capitalize">{colony.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">System:</span>
                        <span className="font-bold">{colony.solarOverview.galaxy}:{colony.solarOverview.sector}:{colony.solarOverview.system}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Population:</span>
                        <span className="font-bold">{Math.round(colony.population / 1000)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Moon Count:</span>
                        <span className="font-bold">{colony.moonCount}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-2 border-t border-slate-200">
                      <div><span className="text-amber-600 font-bold">{colony.subStats.miningRate}</span><div>Mining</div></div>
                      <div><span className="text-blue-600 font-bold">{colony.subStats.researchOutput}</span><div>Research</div></div>
                      <div><span className="text-green-600 font-bold">{colony.subStats.tradeIndex}</span><div>Trade</div></div>
                    </div>

                    <Link href={`/planet/${colony.id}`}>
                      <Button size="sm" className="w-full" variant="outline" data-testid={`btn-manage-${colony.id}`}>
                        Manage Colony
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emptySlots.map((slot) => (
                <Card key={slot.id} className="border-slate-200 bg-slate-50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPlanetImagePath(slot.class)}
                          alt={slot.name}
                          className="w-12 h-12 rounded object-cover border border-slate-200 bg-slate-100"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = TEMP_THEME_IMAGE;
                          }}
                        />
                        <div>
                          <div className="font-orbitron font-bold text-slate-700">{slot.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{slot.coordinates}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className={classColors[slot.class] || "bg-slate-100 text-slate-900"}>{slot.class}</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">System:</span>
                        <span className="font-bold">{slot.systemName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-bold capitalize">{slot.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge variant="outline" className="text-slate-600">{slot.status}</Badge>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedColonyId(slot.id);
                        colonizeMutation.mutate(slot);
                      }}
                      disabled={colonizeMutation.isPending}
                      data-testid={`btn-colonize-${slot.id}`}
                    >
                      {colonizeMutation.isPending && colonizeMutation.variables?.id === slot.id ? "Queuing..." : "Colonize"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            {selectedColony ? (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={getPlanetImagePath(selectedColony.class)}
                        alt={selectedColony.name}
                        className="w-8 h-8 rounded object-cover border border-slate-200 bg-slate-100"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = TEMP_THEME_IMAGE;
                        }}
                      />
                      <span>{selectedColony.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={classColors[selectedColony.class] || "bg-slate-100 text-slate-900"}>{selectedColony.class}</Badge>
                      <Badge className={statusBadgeClasses(selectedColony.planetStatus.condition)}>{selectedColony.planetStatus.condition}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold mb-2 text-slate-700">Planet Status</div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between"><span className="text-slate-600">Stability</span><span className="font-bold">{selectedColony.planetStatus.stability}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Security</span><span className="font-bold">{selectedColony.planetStatus.security}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Logistics</span><span className="font-bold">{selectedColony.planetStatus.logistics}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Infrastructure</span><span className="font-bold">{selectedColony.planetStatus.infrastructure}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Energy Grid</span><span className="font-bold">{selectedColony.planetStatus.energyGrid}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Morale</span><span className="font-bold">{selectedColony.planetStatus.morale}%</span></div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline">Threat: {selectedColony.planetStatus.threatLevel}</Badge>
                          <Badge variant="outline">Type: {selectedColony.type}</Badge>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold mb-3 text-slate-700">Sub Stats and Information</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Mining</span><span className="font-bold">{selectedColony.subStats.miningRate}</span></div>
                          <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Research</span><span className="font-bold">{selectedColony.subStats.researchOutput}</span></div>
                          <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Shipyard</span><span className="font-bold">{selectedColony.subStats.shipyardEfficiency}%</span></div>
                          <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Food</span><span className="font-bold">{selectedColony.subStats.foodOutput}</span></div>
                          <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Water</span><span className="font-bold">{selectedColony.subStats.waterOutput}</span></div>
                          <div className="bg-white rounded border border-slate-200 px-2 py-1 flex justify-between"><span>Automation</span><span className="font-bold">{selectedColony.subStats.droneAutomation}%</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold mb-2 text-slate-700">Moon & Sol System Overview</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-slate-600">System</span><span className="font-bold">{selectedColony.solarOverview.galaxy}:{selectedColony.solarOverview.sector}:{selectedColony.solarOverview.system}</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Orbit</span><span className="font-bold">{selectedColony.solarOverview.orbit}</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Star Class</span><span className="font-bold">{selectedColony.solarOverview.starClass}</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Known Moons</span><span className="font-bold">{selectedColony.moonCount}</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Moon Bodies In Overview</span><span className="font-bold">{moonBodies.length}</span></div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="text-sm font-bold mb-3 text-slate-700">System Bodies (Orbits + Moons)</div>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {systemBodies.map((body) => (
                            <div key={`${body.coordinates}-${body.type}`} className="bg-white border border-slate-200 rounded p-2 text-xs flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {body.type === "moon" ? <Moon className="w-3 h-3 text-indigo-600" /> : <Orbit className="w-3 h-3 text-blue-600" />}
                                <span className="font-semibold">{body.name}</span>
                                <span className="text-slate-500">Orbit {body.orbit}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px]">{body.status}</Badge>
                                <span className="font-mono text-slate-500">{body.coordinates}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    <div className="bg-slate-950 text-white p-4 rounded border border-slate-800">
                      <div className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-[0.2em]">
                        <Cpu className="w-4 h-4" /> Frame System
                      </div>
                      <div className="mt-3 text-2xl font-orbitron font-bold">T{snapshot?.frameTier ?? "-"}</div>
                      <div className="text-sm text-slate-300">{snapshot?.frame.name ?? "Awaiting sync"}</div>
                      <div className="mt-3 text-xs text-slate-400">
                        Stability +{snapshot ? Math.round(snapshot.frame.stabilityBonus * 100) : 0}%
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                        <Users className="w-4 h-4 text-blue-600" /> Population Snapshot
                      </div>
                      <div className="mt-3 text-2xl font-orbitron font-bold text-slate-900">
                        {snapshot?.population.current?.toLocaleString() ?? "-"}
                      </div>
                      <div className="text-sm text-slate-500">Capacity {snapshot?.population.capacity?.toLocaleString() ?? "-"}</div>
                      <Progress value={(snapshot?.population.utilization ?? 0) * 100} className="mt-3 h-2" />
                      <div className="mt-2 text-xs text-slate-500">
                        Happiness {snapshot ? Math.round(snapshot.population.happiness * 100) : 0}%
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                        <Wheat className="w-4 h-4 text-amber-600" /> Food System
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-2xl font-orbitron font-bold text-slate-900">{snapshot?.food.stock?.toLocaleString() ?? "-"}</div>
                        <Badge className={pressureClasses(snapshot?.food.pressure ?? "critical")}>{snapshot?.food.pressure ?? "offline"}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {snapshot ? `${snapshot.food.productionPerHour.toFixed(1)}/h produced • ${snapshot.food.demandPerHour.toFixed(1)}/h consumed` : "Awaiting food telemetry"}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-800">Net {snapshot ? snapshot.food.netPerHour.toFixed(1) : "-"}/h</div>
                    </div>

                    <div className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                        <Droplets className="w-4 h-4 text-cyan-600" /> Water System
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-2xl font-orbitron font-bold text-slate-900">{snapshot?.water.stock?.toLocaleString() ?? "-"}</div>
                        <Badge className={pressureClasses(snapshot?.water.pressure ?? "critical")}>{snapshot?.water.pressure ?? "offline"}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {snapshot ? `${snapshot.water.productionPerHour.toFixed(1)}/h produced • ${snapshot.water.demandPerHour.toFixed(1)}/h consumed` : "Awaiting water telemetry"}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-800">Net {snapshot ? snapshot.water.netPerHour.toFixed(1) : "-"}/h</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <TrendingUp className="w-4 h-4 text-emerald-600" /> Growth and Sustainability
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs text-slate-500 uppercase">Growth/hr</div>
                          <div className="font-bold text-slate-900">{snapshot?.population.estimatedGrowthPerHour?.toLocaleString() ?? "-"}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs text-slate-500 uppercase">Food Depletion</div>
                          <div className="font-bold text-slate-900">{snapshot?.food.hoursToDepletion ?? "Safe"}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs text-slate-500 uppercase">Water Depletion</div>
                          <div className="font-bold text-slate-900">{snapshot?.water.hoursToDepletion ?? "Safe"}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs text-slate-500 uppercase">Frame Bonus</div>
                          <div className="font-bold text-slate-900">+{snapshot ? Math.round(snapshot.frame.populationCapacityBonus * 100) : 0}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Map className="w-4 h-4 text-blue-600" /> Colonies System Control Summary
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs uppercase text-slate-500">Current Page</div>
                          <div className="font-bold text-slate-900">{currentPage.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs uppercase text-slate-500">Records/Page</div>
                          <div className="font-bold text-slate-900">{COLONIES_PER_PAGE}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs uppercase text-slate-500">Total Pages</div>
                          <div className="font-bold text-slate-900">{TOTAL_COLONY_PAGES.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs uppercase text-slate-500">System Scope</div>
                          <div className="font-bold text-slate-900 capitalize">{managementScope}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs uppercase text-slate-500">Active Profile</div>
                          <div className="font-bold text-slate-900 capitalize">{activeProfile}</div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-3">
                          <div className="text-xs uppercase text-slate-500">Profile Overrides</div>
                          <div className="font-bold text-slate-900">{Object.keys(profileOverrides).length.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border-slate-200">
                <CardContent className="p-8 text-center text-slate-600">Select a colony to view detailed information.</CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
