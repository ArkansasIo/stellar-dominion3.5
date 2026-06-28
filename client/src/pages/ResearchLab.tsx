/**
 * Research Lab Management Page
 * Comprehensive interface for managing research, labs, queues, and bonuses
 * @component
 */

import React, { useEffect, useMemo, useState } from "react";
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
  Users,
  Building2,
} from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { unitData } from "@/lib/unitData";
import {
  UnitPersonnelDomain,
  cloneDomainPersonnelProfile,
  editDomainPersonnelProfile,
  generateDomainUnitInstance,
  getDomainForUnitClass,
} from "@/lib/unitPersonnelGenClone";
import { buildResearchLabAdministrationState } from "@/lib/researchLabAdministration";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

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
  const [personnelDomain, setPersonnelDomain] = useState<UnitPersonnelDomain>("military");
  const [personnelUnitId, setPersonnelUnitId] = useState<string>("");
  const [generationCount, setGenerationCount] = useState<number>(12);
  const [editLevelDelta, setEditLevelDelta] = useState<number>(1);
  const [editMoraleDelta, setEditMoraleDelta] = useState<number>(6);

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

  const reorderQueueMutation = useMutation({
    mutationFn: async (data: { queueItemId: string; newPosition: number }) => {
      const res = await fetch("/api/research/queue/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchQueue"] });
      queryClient.invalidateQueries({ queryKey: ["labDiagnostics"] });
    },
  });

  const activeResearch = queueData?.queue?.[0];
  const allBonuses = bonusesData?.bonuses || [];
  const queue = queueData?.queue || [];

  const domainUnits = useMemo(
    () => unitData.filter((unit) => getDomainForUnitClass(unit.class) === personnelDomain),
    [personnelDomain],
  );

  useEffect(() => {
    if (!domainUnits.some((unit) => unit.id === personnelUnitId)) {
      setPersonnelUnitId(domainUnits[0]?.id || "");
    }
  }, [domainUnits, personnelUnitId]);

  const adminState = useMemo(() => {
    return buildResearchLabAdministrationState({
      labLevel: Number(labData?.lab?.level ?? 1),
      queueLength: queue.length,
      speedMultiplier: Number(multiplierData?.multiplier ?? 1),
      durabilityPercent: Number(diagnosticsData?.diagnostics?.labDurability ?? 100),
      activeBonusCount: allBonuses.length,
    });
  }, [allBonuses.length, diagnosticsData?.diagnostics?.labDurability, labData?.lab?.level, multiplierData?.multiplier, queue.length]);

  const personnelProgram = useMemo(() => {
    if (!personnelUnitId) return null;

    const generated = generateDomainUnitInstance(personnelUnitId, Math.max(1, generationCount), {
      domain: personnelDomain,
      reserveRatio: 0.25,
      tags: ["research-lab", "generated"],
    });

    const edited = generated.activePersonnel.slice(0, 6).map((profile) =>
      editDomainPersonnelProfile(profile, {
        progressDelta: {
          level: editLevelDelta,
          morale: editMoraleDelta,
        },
        tags: [...profile.tags, "edited"],
      }),
    );

    const cloned = edited.map((profile, index) =>
      cloneDomainPersonnelProfile(profile, {
        id: `${profile.id}_clone_${index}`,
        displayName: `${profile.displayName} Clone`,
        tags: [...profile.tags, "clone"],
      }),
    );

    const averageReadiness = (profiles: typeof edited) => {
      if (!profiles.length) return 0;
      return Math.round(
        profiles.reduce((sum, profile) => sum + profile.progress.combatReadiness, 0) / profiles.length,
      );
    };

    return {
      generated,
      edited,
      cloned,
      generatedReadiness: averageReadiness(generated.activePersonnel),
      editedReadiness: averageReadiness(edited),
      clonedReadiness: averageReadiness(cloned),
    };
  }, [editLevelDelta, editMoraleDelta, generationCount, personnelDomain, personnelUnitId]);

  const priorityVariant = (p: string): "destructive" | "default" | "secondary" | "outline" => {
    if (p === "critical") return "destructive";
    if (p === "high") return "default";
    if (p === "normal") return "secondary";
    return "outline";
  };

  if (labLoading || queueLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-muted-foreground font-rajdhani">Loading research labs...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Page Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.RESEARCH_LAB.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Research Lab Administration</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              {labData?.lab?.name ? `${labData.lab.name} — Type: ${labData.lab.type}` : "Manage your research queue, bonuses, and lab performance."}
            </p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Research Lab", image: MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path }, { label: "Research Nav", image: MENU_ASSETS.NAVIGATION.RESEARCH.path }, { label: "Featured Research", image: OGAMEX_FEATURED_ASSETS.RESEARCH.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Active Research" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
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
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Queue Length" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
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
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Speed Multiplier" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
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
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Lab Durability" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Administration Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-muted-foreground uppercase">Throughput</div>
                  <div className="text-xl font-bold text-slate-900">{adminState.score.throughput}%</div>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-muted-foreground uppercase">Stability</div>
                  <div className="text-xl font-bold text-slate-900">{adminState.score.stability}%</div>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-muted-foreground uppercase">Efficiency</div>
                  <div className="text-xl font-bold text-slate-900">{adminState.score.efficiency}%</div>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-muted-foreground uppercase">Governance</div>
                  <div className="text-xl font-bold text-slate-900">{adminState.score.governance}%</div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Total Administration Readiness</span>
                  <span>{adminState.score.total}%</span>
                </div>
                <Progress value={adminState.score.total} className="h-2" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(adminState.domainCapacity) as Array<[UnitPersonnelDomain, number]>).map(([domain, capacity]) => (
                  <div key={domain} className="rounded border border-blue-200 bg-blue-50 p-2 text-xs">
                    <div className="font-semibold text-blue-900 capitalize">{domain}</div>
                    <div className="text-blue-700">Capacity {capacity}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {adminState.recommendations.map((recommendation, index) => (
                  <p key={index} className="text-xs text-slate-600">- {recommendation}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" /> Unit Clone / Gen Editing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Domain</label>
                  <select
                    value={personnelDomain}
                    onChange={(event) => setPersonnelDomain(event.target.value as UnitPersonnelDomain)}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="military">Military</option>
                    <option value="government">Government</option>
                    <option value="civilian">Civilian</option>
                    <option value="scientific">Scientific</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Unit</label>
                  <select
                    value={personnelUnitId}
                    onChange={(event) => setPersonnelUnitId(event.target.value)}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {domainUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Generate Count</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={generationCount}
                    onChange={(event) => setGenerationCount(Math.max(1, Math.min(500, Number(event.target.value) || 1)))}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Edit Level Delta</label>
                  <input
                    type="number"
                    min={-5}
                    max={25}
                    value={editLevelDelta}
                    onChange={(event) => setEditLevelDelta(Math.max(-5, Math.min(25, Number(event.target.value) || 0)))}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Edit Morale Delta</label>
                  <input
                    type="number"
                    min={-40}
                    max={40}
                    value={editMoraleDelta}
                    onChange={(event) => setEditMoraleDelta(Math.max(-40, Math.min(40, Number(event.target.value) || 0)))}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {personnelProgram ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="rounded border border-slate-200 bg-slate-50 p-2">
                      <div className="text-muted-foreground">Generated</div>
                      <div className="font-semibold text-slate-900">{personnelProgram.generated.quantity} total</div>
                      <div className="text-muted-foreground">Readiness {personnelProgram.generatedReadiness}%</div>
                    </div>
                    <div className="rounded border border-amber-200 bg-amber-50 p-2">
                      <div className="text-amber-700">Edited</div>
                      <div className="font-semibold text-amber-900">{personnelProgram.edited.length} sample</div>
                      <div className="text-amber-700">Readiness {personnelProgram.editedReadiness}%</div>
                    </div>
                    <div className="rounded border border-green-200 bg-green-50 p-2">
                      <div className="text-green-700">Cloned</div>
                      <div className="font-semibold text-green-900">{personnelProgram.cloned.length} generated</div>
                      <div className="text-green-700">Readiness {personnelProgram.clonedReadiness}%</div>
                    </div>
                  </div>

                  <div className="rounded border border-slate-200 bg-slate-50 p-2 text-xs space-y-1">
                    <div className="font-semibold text-slate-800">Sample Edited Profiles</div>
                    {personnelProgram.edited.slice(0, 3).map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between gap-2">
                        <span className="text-slate-700 truncate">{profile.displayName} - {profile.grade}</span>
                        <span className="text-slate-500">L{profile.progress.level} / Morale {profile.progress.morale}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No unit templates available for this domain.</div>
              )}
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
                  addToQueueMutation.mutate({ techId: selectedTech.trim(), priority: selectedPriority })
                }
                disabled={addToQueueMutation.isPending || !selectedTech.trim()}
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
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() =>
                                  reorderQueueMutation.mutate({
                                    queueItemId: item.id,
                                    newPosition: idx - 1,
                                  })
                                }
                                disabled={reorderQueueMutation.isPending}
                              >
                                <ChevronUp className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() =>
                                  reorderQueueMutation.mutate({
                                    queueItemId: item.id,
                                    newPosition: idx + 1,
                                  })
                                }
                                disabled={reorderQueueMutation.isPending || idx >= queue.length - 1}
                              >
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

