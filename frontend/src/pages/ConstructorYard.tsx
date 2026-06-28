import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import {
  Hammer,
  Rocket,
  Crown,
  Shield,
  Flame,
  ArrowUpCircle,
  Zap,
  AlertTriangle,
  FlaskConical,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";

type YardDomain = "mothership" | "starship";

interface YardEntry {
  id: string;
  domain: YardDomain;
  name: string;
  class: string;
  subClass: string;
  type: string;
  subType: string;
  tier: number;
  rarity: number;
  requiredLevel: number;
  rankTitle: string;
  description: string;
  subDescription: string;
  stats: Record<string, number>;
  subStats: Record<string, number>;
  effects: Array<{ id: string; name: string; value: number; unit: string; description: string }>;
  buffs: Array<{ id: string; name: string; value: number; durationSec: number; description: string }>;
  debuffs: Array<{ id: string; name: string; value: number; durationSec: number; description: string }>;
}

interface YardStatus {
  state: {
    levels: Record<string, number>;
    upgrades: Array<{
      id: string;
      entryId: string;
      domain: YardDomain;
      fromLevel: number;
      toLevel: number;
      startedAt: number;
      endsAt: number;
      status: "running" | "completed";
    }>;
  };
  activeUpgrades: any[];
  completedUpgrades: any[];
  effectSummary: {
    totalHull: number;
    totalShields: number;
    totalFirepower: number;
    totalCargo: number;
  };
}

interface UpgradePreview {
  success: boolean;
  cost?: { metal: number; crystal: number; deuterium: number };
  timeSec?: number;
  currentLevel?: number;
  targetLevel?: number;
  currentStats?: Record<string, number>;
  targetStats?: Record<string, number>;
  currentSubStats?: Record<string, number>;
  targetSubStats?: Record<string, number>;
  message?: string;
}

const rarityBadgeClass = (rarity: number) => {
  if (rarity >= 9) return "bg-yellow-500 text-black";
  if (rarity >= 7) return "bg-purple-600 text-white";
  if (rarity >= 5) return "bg-blue-600 text-white";
  if (rarity >= 3) return "bg-green-600 text-white";
  return "bg-slate-500 text-white";
};

export default function ConstructorYard() {
  const [domain, setDomain] = useState<YardDomain>("mothership");
  const [entries, setEntries] = useState<YardEntry[]>([]);
  const [status, setStatus] = useState<YardStatus | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string>("");
  const [targetLevel, setTargetLevel] = useState<number>(2);
  const [preview, setPreview] = useState<UpgradePreview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedEntryId) || entries[0],
    [entries, selectedEntryId],
  );

  const currentLevel = selectedEntry ? status?.state.levels[selectedEntry.id] || 1 : 1;

  useEffect(() => {
    void loadAll();
    const timer = setInterval(() => {
      void loadStatus();
    }, 5000);
    return () => clearInterval(timer);
  }, [domain]);

  async function loadCatalog() {
    const res = await fetch(`/api/constructor-yard/catalog?domain=${domain}`, { credentials: "include" });
    const data = await res.json();
    if (data?.success) {
      setEntries(data.entries || []);
      if (!selectedEntryId && data.entries?.length) {
        setSelectedEntryId(data.entries[0].id);
      }
    }
  }

  async function loadStatus() {
    const res = await fetch(`/api/constructor-yard/status/me`, { credentials: "include" });
    const data = await res.json();
    if (data?.success) {
      setStatus(data.status);
    }
  }

  async function loadAll() {
    setLoading(true);
    try {
      await Promise.all([loadCatalog(), loadStatus()]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePreview() {
    if (!selectedEntry) return;

    const res = await fetch(`/api/constructor-yard/upgrade/preview`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId: selectedEntry.id, targetLevel }),
    });

    const data = await res.json();
    setPreview(data);
  }

  async function handleStartUpgrade() {
    if (!selectedEntry) return;
    const res = await fetch(`/api/constructor-yard/upgrade/start`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId: selectedEntry.id, targetLevel }),
    });
    const data = await res.json();
    if (data?.success) {
      await loadStatus();
    } else {
      setPreview({ success: false, message: data?.message || "Failed to start upgrade" });
    }
  }

  async function handleCompleteUpgrade() {
    if (!selectedEntry) return;
    const res = await fetch(`/api/constructor-yard/upgrade/complete`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId: selectedEntry.id }),
    });
    const data = await res.json();
    if (data?.success) {
      await loadStatus();
      await handlePreview();
    } else {
      setPreview({ success: false, message: data?.message || "Upgrade not ready" });
    }
  }

  const activeDomainUpgrades = (status?.activeUpgrades || []).filter((u) => u.domain === domain);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Constructor Yard Systems</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Mothership Constructor Yard + Starship Shipyard with rarity 1-9, levels 1-999, and tiers 1-99.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-blue-700">Total Hull</div>
              <div className="text-2xl font-orbitron text-blue-900">{status?.effectSummary.totalHull?.toLocaleString() || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-cyan-700">Total Shields</div>
              <div className="text-2xl font-orbitron text-cyan-900">{status?.effectSummary.totalShields?.toLocaleString() || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-red-700">Total Firepower</div>
              <div className="text-2xl font-orbitron text-red-900">{status?.effectSummary.totalFirepower?.toLocaleString() || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-amber-700">Active Upgrades</div>
              <div className="text-2xl font-orbitron text-amber-900">{activeDomainUpgrades.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={domain} onValueChange={(value) => setDomain(value as YardDomain)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mothership" className="flex items-center gap-2"><Crown className="w-4 h-4" /> Mothership Constructor Yard</TabsTrigger>
            <TabsTrigger value="starship" className="flex items-center gap-2"><Rocket className="w-4 h-4" /> Starship Shipyard</TabsTrigger>
          </TabsList>

          <TabsContent value={domain} className="space-y-4 mt-4">
            <Tabs defaultValue="catalog" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="catalog">Catalog</TabsTrigger>
                <TabsTrigger value="upgrades">Upgrade System</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="logic">Game Logic</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="catalog" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Hammer className="w-5 h-5" /> {domain === "mothership" ? "Mothership" : "Starship"} Catalog</CardTitle>
                    <CardDescription>Select a tier entry to inspect classes, sub-classes, types, and sub-types.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="py-8 text-center text-muted-foreground">Loading yard catalog...</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {entries.map((entry) => {
                          const level = status?.state.levels[entry.id] || 1;
                          const active = selectedEntry?.id === entry.id;
                          return (
                            <Card
                              key={entry.id}
                              className={cn("cursor-pointer transition border", active ? "border-primary ring-1 ring-primary" : "border-slate-200 hover:border-primary/40")}
                              onClick={() => {
                                setSelectedEntryId(entry.id);
                                setTargetLevel(level + 1);
                                setPreview(null);
                              }}
                            >
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="font-bold text-sm text-slate-900">{entry.name}</div>
                                  <Badge className={rarityBadgeClass(entry.rarity)}>R{entry.rarity}</Badge>
                                </div>
                                <div className="text-xs text-slate-500">Tier {entry.tier} • Level {level}/999</div>
                                <div className="text-xs text-slate-600">{entry.class} / {entry.subClass}</div>
                                <div className="text-xs text-slate-600">{entry.type} / {entry.subType}</div>
                                <div className="text-[11px] text-muted-foreground">{entry.rankTitle}</div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upgrades" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ArrowUpCircle className="w-5 h-5 text-green-600" /> Upgrade Systems</CardTitle>
                    <CardDescription>Upgrade selected yard entry with level, tier, rarity progression and stat scaling.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!selectedEntry ? (
                      <div className="py-8 text-center text-muted-foreground">Select an entry from Catalog first.</div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Card className="border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase">Current Level</div><div className="text-2xl font-orbitron">{currentLevel}</div></CardContent></Card>
                          <Card className="border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase">Tier</div><div className="text-2xl font-orbitron">{selectedEntry.tier}</div></CardContent></Card>
                          <Card className="border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase">Rarity</div><div className="text-2xl font-orbitron">{selectedEntry.rarity}</div></CardContent></Card>
                        </div>

                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <label className="text-sm font-semibold">Target Level</label>
                            <Input
                              type="number"
                              min={currentLevel + 1}
                              max={999}
                              value={targetLevel}
                              onChange={(e) => setTargetLevel(Math.max(currentLevel + 1, Math.min(999, Number(e.target.value || currentLevel + 1))))}
                            />
                          </div>
                          <Button onClick={handlePreview} variant="outline">Preview</Button>
                          <Button onClick={handleStartUpgrade}>Start Upgrade</Button>
                          <Button onClick={handleCompleteUpgrade} variant="secondary">Complete Ready</Button>
                        </div>

                        {preview && (
                          <Card className={cn("border", preview.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                            <CardContent className="p-4 space-y-2">
                              {!preview.success ? (
                                <div className="flex items-center gap-2 text-red-700"><AlertTriangle className="w-4 h-4" /> {preview.message}</div>
                              ) : (
                                <>
                                  <div className="font-semibold text-green-800">Upgrade Preview: Lv {preview.currentLevel} → Lv {preview.targetLevel}</div>
                                  <div className="text-sm">Cost: {preview.cost?.metal?.toLocaleString()} Metal • {preview.cost?.crystal?.toLocaleString()} Crystal • {preview.cost?.deuterium?.toLocaleString()} Deuterium</div>
                                  <div className="text-sm">Time: {preview.timeSec}s</div>
                                  <Separator />
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                    {Object.entries(preview.currentStats || {}).map(([key, value]) => (
                                      <div key={key} className="bg-white border rounded p-2">
                                        <div className="uppercase text-muted-foreground">{key}</div>
                                        <div className="font-mono">{value} → {(preview.targetStats as any)?.[key]}</div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {activeDomainUpgrades.length > 0 && (
                          <Card className="border-blue-200 bg-blue-50">
                            <CardHeader className="pb-2"><CardTitle className="text-sm">Running Upgrades</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                              {activeDomainUpgrades.map((upgrade) => {
                                const msLeft = Math.max(0, upgrade.endsAt - Date.now());
                                const secLeft = Math.ceil(msLeft / 1000);
                                const totalMs = Math.max(1, upgrade.endsAt - upgrade.startedAt);
                                const progress = Math.min(100, Math.max(0, ((Date.now() - upgrade.startedAt) / totalMs) * 100));

                                return (
                                  <div key={upgrade.id} className="bg-white border rounded p-3">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>{upgrade.entryId}</span>
                                      <span className="font-mono">{secLeft}s</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                  </div>
                                );
                              })}
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="effects" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-600" /> Buffs, Debuffs, and Effects</CardTitle>
                    <CardDescription>Per-entry combat and utility modifiers for selected yard platform.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!selectedEntry ? (
                      <div className="py-8 text-center text-muted-foreground">Select an entry from Catalog first.</div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="border-slate-200">
                            <CardHeader className="pb-2"><CardTitle className="text-base">Effects</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                              {selectedEntry.effects.map((effect) => (
                                <div key={effect.id} className="border rounded bg-slate-50 p-2 text-xs">
                                  <div className="font-semibold">{effect.name}</div>
                                  <div>{effect.value}{effect.unit}</div>
                                  <div className="text-muted-foreground">{effect.description}</div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                          <Card className="border-green-200">
                            <CardHeader className="pb-2"><CardTitle className="text-base text-green-700">Buffs</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                              {selectedEntry.buffs.map((buff) => (
                                <div key={buff.id} className="border rounded bg-green-50 p-2 text-xs">
                                  <div className="font-semibold">{buff.name}</div>
                                  <div>+{buff.value}% • {buff.durationSec}s</div>
                                  <div className="text-muted-foreground">{buff.description}</div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                          <Card className="border-red-200">
                            <CardHeader className="pb-2"><CardTitle className="text-base text-red-700">Debuffs</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                              {selectedEntry.debuffs.map((debuff) => (
                                <div key={debuff.id} className="border rounded bg-red-50 p-2 text-xs">
                                  <div className="font-semibold">{debuff.name}</div>
                                  <div>-{debuff.value}% • {debuff.durationSec}s</div>
                                  <div className="text-muted-foreground">{debuff.description}</div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logic" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-indigo-600" /> Game Logic & Functions</CardTitle>
                    <CardDescription>Systems implemented: scaling, progression, queues, and upgrade lifecycle.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded bg-slate-50 text-sm">
                      <div className="font-semibold mb-1">Progression Ranges</div>
                      <ul className="text-xs space-y-1 text-slate-600">
                        <li>Rarity range: 1-9</li>
                        <li>Tier range: 1-99</li>
                        <li>Level range: 1-999</li>
                        <li>Domains: Mothership + Starship</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded bg-slate-50 text-sm">
                      <div className="font-semibold mb-1">Upgrade Mechanics</div>
                      <ul className="text-xs space-y-1 text-slate-600">
                        <li>Preview cost/time before start</li>
                        <li>Queue-based start/complete lifecycle</li>
                        <li>Server-side level state per user</li>
                        <li>Auto-complete check on status refresh</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded bg-slate-50 text-sm">
                      <div className="font-semibold mb-1">Stats & Sub-Stats</div>
                      <ul className="text-xs space-y-1 text-slate-600">
                        <li>Primary stats: hull, shields, firepower, speed, accuracy, cargo</li>
                        <li>Sub-stats: crit, evasion, resistance, regen, fuel efficiency, command sync</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded bg-slate-50 text-sm">
                      <div className="font-semibold mb-1">Applied Systems</div>
                      <ul className="text-xs space-y-1 text-slate-600">
                        <li>Effects, buffs, debuffs per entry</li>
                        <li>Scaling formulas by level and tier</li>
                        <li>Persistent player state in storage settings</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Gauge className="w-5 h-5 text-slate-700" /> Details & Sub Pages</CardTitle>
                    <CardDescription>Detailed breakdown of selected yard entry, including stats and sub-stats.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!selectedEntry ? (
                      <div className="py-8 text-center text-muted-foreground">Select an entry from Catalog first.</div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-slate-200">
                            <CardHeader className="pb-2"><CardTitle className="text-base">Identity</CardTitle></CardHeader>
                            <CardContent className="space-y-1 text-sm">
                              <div><span className="font-semibold">Name:</span> {selectedEntry.name}</div>
                              <div><span className="font-semibold">Rank:</span> {selectedEntry.rankTitle}</div>
                              <div><span className="font-semibold">Class:</span> {selectedEntry.class} / {selectedEntry.subClass}</div>
                              <div><span className="font-semibold">Type:</span> {selectedEntry.type} / {selectedEntry.subType}</div>
                              <div><span className="font-semibold">Tier:</span> {selectedEntry.tier}</div>
                              <div><span className="font-semibold">Required Level:</span> {selectedEntry.requiredLevel}</div>
                            </CardContent>
                          </Card>

                          <Card className="border-slate-200">
                            <CardHeader className="pb-2"><CardTitle className="text-base">Descriptions</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm text-slate-700">
                              <p>{selectedEntry.description}</p>
                              <p className="text-muted-foreground">{selectedEntry.subDescription}</p>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-slate-200">
                            <CardHeader className="pb-2"><CardTitle className="text-base">Stats</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(selectedEntry.stats).map(([key, value]) => (
                                <div key={key} className="bg-slate-50 border rounded p-2 flex justify-between">
                                  <span className="uppercase text-slate-500">{key}</span>
                                  <span className="font-mono font-semibold">{value.toLocaleString()}</span>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                          <Card className="border-slate-200">
                            <CardHeader className="pb-2"><CardTitle className="text-base">Sub Stats</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(selectedEntry.subStats).map(([key, value]) => (
                                <div key={key} className="bg-slate-50 border rounded p-2 flex justify-between">
                                  <span className="uppercase text-slate-500">{key}</span>
                                  <span className="font-mono font-semibold">{value}</span>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
