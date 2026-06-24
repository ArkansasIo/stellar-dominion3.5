import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  HardDrive, Plus, Trash2, ArrowRight, ArrowLeft, Crown, Shield, Rocket,
  Save, Clock, Star, Globe, Users, Loader2, Swords, Layers,
} from "lucide-react";

interface SaveSlot {
  slot: number;
  name: string;
  exists: boolean;
  lastSaved?: string;
  empireName?: string;
  race?: string;
  level?: number;
  government?: string;
  systems?: number;
  fleetPower?: number;
  playstyle?: string;
}

interface EmpireTemplate {
  id: string;
  name: string;
  species: string;
  government: string;
  playstyle: string;
  description: string;
  icon: string;
  color: string;
  badgeColor: string;
}

const EMPIRE_TEMPLATES = [
  { id: "human", name: "Human Democracy", species: "Human", government: "Democracy", playstyle: "Balanced", description: "A versatile civilization excelling in diplomacy and trade.", icon: "🌍", color: "from-blue-500 to-cyan-500", badgeColor: "bg-blue-500/20 text-blue-300" },
  { id: "klingon", name: "Klingon Empire", species: "Klingon", government: "Empire", playstyle: "Aggressive", description: "A warrior culture that seeks glory through conquest.", icon: "⚔️", color: "from-red-500 to-orange-500", badgeColor: "bg-red-500/20 text-red-300" },
  { id: "vulcan", name: "Vulcan Science", species: "Vulcan", government: "Science Council", playstyle: "Research", description: "Logic-driven society prioritizing technological advancement.", icon: "🔬", color: "from-purple-500 to-violet-500", badgeColor: "bg-purple-500/20 text-purple-300" },
  { id: "borg", name: "Borg Collective", species: "Borg", government: "Hive Mind", playstyle: "Assimilation", description: "A collective consciousness that absorbs other species.", icon: "⬡", color: "from-emerald-500 to-green-500", badgeColor: "bg-emerald-500/20 text-emerald-300" },
  { id: "ferengi", name: "Ferengi Commerce", species: "Ferengi", government: "Trade Federation", playstyle: "Trade", description: "Profit-driven civilization mastering interstellar commerce.", icon: "💰", color: "from-amber-500 to-yellow-500", badgeColor: "bg-amber-500/20 text-amber-300" },
];

const SPECIES_ICONS: Record<string, string> = { Human: "🌍", Klingon: "⚔️", Vulcan: "🔬", Borg: "⬡", Ferengi: "💰" };
const GOV_ICONS: Record<string, string> = { Democracy: "🏛️", Empire: "👑", "Science Council": "🧪", "Hive Mind": "🕸️", "Trade Federation": "📊" };

export default function SaveSlotsPage() {
  const { logout, setOnboardingStep, switchRealm } = useGame();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isNewGame, setIsNewGame] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { data: slotsData, isLoading: slotsLoading } = useQuery<{ slots: SaveSlot[] }>({
    queryKey: ["/api/save-slots"],
    queryFn: async () => {
      const res = await fetch("/api/save-slots", { credentials: "include" });
      if (!res.ok) {
        return {
          slots: Array.from({ length: 5 }, (_, i) => ({
            slot: i + 1,
            name: `Empire Slot ${i + 1}`,
            exists: false,
          })),
        };
      }
      return res.json();
    },
  });

  const loadSlotMutation = useMutation({
    mutationFn: async (slot: number) => {
      const res = await fetch("/api/save-slots/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slot }),
      });
      if (!res.ok) throw new Error("Failed to load save slot");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Save Loaded", description: "Empire data loaded successfully." });
      setOnboardingStep(3);
    },
    onError: (err: any) => {
      toast({ title: "Load Failed", description: err.message, variant: "destructive" });
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (slot: number) => {
      const res = await fetch("/api/save-slots/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slot }),
      });
      if (!res.ok) throw new Error("Failed to delete save slot");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Save Deleted", description: "Empire save slot cleared." });
      queryClient.invalidateQueries({ queryKey: ["/api/save-slots"] });
    },
  });

  const handleContinue = () => {
    if (isNewGame) {
      setOnboardingStep(0);
    } else if (selectedSlot) {
      loadSlotMutation.mutate(selectedSlot);
    }
  };

  const handleBack = () => {
    logout();
  };

  const handleTemplateSelect = (template: EmpireTemplate) => {
    setSelectedTemplate(template.id);
    setIsNewGame(true);
    setSelectedSlot(null);
  };

  const handleNewGameClick = () => {
    setIsNewGame(true);
    setSelectedSlot(null);
    setSelectedTemplate(null);
  };

  const slots: SaveSlot[] = slotsData?.slots || Array.from({ length: 5 }, (_, i) => ({
    slot: i + 1, name: `Empire Slot ${i + 1}`, exists: false,
  }));
  const activeEmpire = slots.find((s) => s.exists);
  const totalPlayTime = slots.reduce((acc, s) => acc + (s.level || 0) * 12, 0);
  const totalEmpires = slots.filter((s) => s.exists).length;
  const highestLevel = Math.max(...slots.map((s) => s.level || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
        <Button variant="ghost" className="text-slate-400 hover:text-white transition-colors" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Season Select
        </Button>
        <div className="text-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold tracking-widest text-white">EMPIRE VAULT</h1>
              <p className="text-slate-400 font-rajdhani text-sm">Your empire awaits, Commander</p>
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono">Step 3 of 3 — Empire Selection</div>
      </header>

      <main className="flex-1 relative z-10 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-orbitron font-semibold text-white tracking-wider">ACTIVE EMPIRE</h2>
            </div>
            {activeEmpire ? (
              <Card className="bg-slate-900/80 border-emerald-500/30 border shadow-lg shadow-emerald-500/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className={cn("w-20 h-20 rounded-xl flex items-center justify-center text-4xl bg-gradient-to-br", "from-emerald-500/20 to-teal-500/20 border border-emerald-500/30")}>
                      {SPECIES_ICONS[activeEmpire.race || "Human"] || "🌍"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-orbitron font-bold text-white">{activeEmpire.empireName || activeEmpire.name}</h3>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Active</Badge>
                      </div>
                      <p className="text-slate-400 text-sm mb-3">
                        {activeEmpire.race || "Unknown"} · {activeEmpire.government || "Republic"} · Level {activeEmpire.level || 1}
                      </p>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <Globe className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                          <div className="text-white font-semibold text-sm">{activeEmpire.systems || 12}</div>
                          <div className="text-slate-500 text-xs">Systems</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <Swords className="w-4 h-4 text-red-400 mx-auto mb-1" />
                          <div className="text-white font-semibold text-sm">{activeEmpire.fleetPower || 4500}</div>
                          <div className="text-slate-500 text-xs">Fleet Power</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                          <div className="text-white font-semibold text-sm">{(activeEmpire.level || 1) * 2.4}B</div>
                          <div className="text-slate-500 text-xs">Population</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                          <div className="text-white font-semibold text-sm">{(activeEmpire.level || 1) * 12}h</div>
                          <div className="text-slate-500 text-xs">Play Time</div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-slate-500">Last login: {activeEmpire.lastSaved || "Recently"}</div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-orbitron tracking-wider px-6 h-12 shadow-lg"
                      onClick={() => {
                        setSelectedSlot(activeEmpire.slot);
                        setIsNewGame(false);
                      }}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Continue Playing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/60 border-slate-700/50 border-dashed">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                    <Globe className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-orbitron text-slate-400 mb-2">No Active Empire</h3>
                  <p className="text-slate-500 text-sm mb-4">Start a new empire to begin your conquest</p>
                  <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10" onClick={handleNewGameClick}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start New
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          <Separator className="bg-slate-700/50" />

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-orbitron font-semibold text-white tracking-wider">SAVE SLOTS</h2>
              </div>
              {slotsLoading && <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {slots.map((slot) => (
                <Card
                  key={slot.slot}
                  className={cn(
                    "bg-slate-900/80 border transition-all cursor-pointer",
                    selectedSlot === slot.slot && !isNewGame
                      ? "border-cyan-500/60 shadow-lg shadow-cyan-500/10 bg-cyan-500/5"
                      : slot.exists
                        ? "border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60"
                        : "border-slate-700/30 border-dashed hover:border-slate-600/50",
                  )}
                  onClick={() => {
                    if (slot.exists) {
                      setSelectedSlot(slot.slot);
                      setIsNewGame(false);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", slot.exists ? "bg-cyan-500/20" : "bg-slate-700/30")}>
                          <Save className={cn("w-4 h-4", slot.exists ? "text-cyan-400" : "text-slate-600")} />
                        </div>
                        <div className="text-xs text-slate-500 font-mono">SLOT {slot.slot}</div>
                      </div>
                      {slot.exists && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost" size="sm" className="h-7 px-2 text-slate-500 hover:text-red-400"
                            onClick={(e) => { e.stopPropagation(); deleteSlotMutation.mutate(slot.slot); }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {slot.exists ? (
                      <>
                        <h4 className="font-semibold text-white text-sm mb-1 truncate">{slot.empireName || slot.name}</h4>
                        <div className="flex items-center gap-1 mb-2">
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                            {SPECIES_ICONS[slot.race || ""] || "👤"} {slot.race || "Unknown"}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                            {GOV_ICONS[slot.government || ""] || "🏛️"} {slot.government || "Republic"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center mb-2">
                          <div className="p-1.5 rounded bg-slate-800/60">
                            <div className="text-white text-xs font-semibold">{slot.systems || 0}</div>
                            <div className="text-slate-500 text-[10px]">Systems</div>
                          </div>
                          <div className="p-1.5 rounded bg-slate-800/60">
                            <div className="text-white text-xs font-semibold">{slot.fleetPower || 0}</div>
                            <div className="text-slate-500 text-[10px]">Fleet</div>
                          </div>
                          <div className="p-1.5 rounded bg-slate-800/60">
                            <div className="text-white text-xs font-semibold">Lv.{slot.level || 1}</div>
                            <div className="text-slate-500 text-[10px]">Level</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Saved {slot.lastSaved || "Unknown"}
                        </div>
                        <Button
                          className={cn(
                            "w-full mt-3 h-8 text-xs font-orbitron tracking-wider",
                            selectedSlot === slot.slot
                              ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSlot(slot.slot);
                            setIsNewGame(false);
                          }}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          {selectedSlot === slot.slot ? "Selected" : "Load"}
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <div className="w-10 h-10 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-700/30">
                          <Plus className="w-5 h-5 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-xs mb-2">Empty Slot</p>
                        <Button
                          variant="outline" size="sm"
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-[10px]"
                          onClick={(e) => { e.stopPropagation(); handleNewGameClick(); }}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Create New Empire
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="bg-slate-700/50" />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-orbitron font-semibold text-white tracking-wider">EMPIRE TEMPLATES</h2>
              <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 ml-2">Quick Start</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {EMPIRE_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "bg-slate-900/80 border transition-all cursor-pointer group",
                    selectedTemplate === template.id
                      ? "border-cyan-500/60 shadow-lg shadow-cyan-500/10 bg-cyan-500/5"
                      : "border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60",
                  )}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 bg-gradient-to-br text-2xl border border-slate-700/30", template.color)}>
                      {template.icon}
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">{template.name}</h4>
                    <p className="text-slate-500 text-[10px] mb-2 line-clamp-2">{template.description}</p>
                    <Badge className={cn("text-[9px] border-0", template.badgeColor)}>{template.playstyle}</Badge>
                    <div className="mt-2 text-[10px] text-slate-500">
                      {template.species} · {template.government}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <aside className="w-72 border-l border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-4 hidden lg:flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-orbitron font-semibold text-white tracking-wider">VAULT STATISTICS</h3>
          </div>

          <div className="space-y-3 mb-6">
            {[
              { label: "Total Play Time", value: `${totalPlayTime}h`, pct: Math.min(totalPlayTime / 500, 100), icon: Clock, iconColor: "text-amber-400", barColor: "[&>div]:bg-amber-500" },
              { label: "Empires Created", value: `${totalEmpires} / 5`, pct: (totalEmpires / 5) * 100, icon: Star, iconColor: "text-cyan-400", barColor: "[&>div]:bg-cyan-500" },
              { label: "Achievements", value: `${Math.min(totalEmpires * 3, 15)} / 50`, pct: Math.min((totalEmpires * 3 / 50) * 100, 100), icon: Crown, iconColor: "text-emerald-400", barColor: "[&>div]:bg-emerald-500" },
              { label: "Highest Level", value: `Lv. ${highestLevel}`, pct: Math.min((highestLevel / 50) * 100, 100), icon: Rocket, iconColor: "text-purple-400", barColor: "[&>div]:bg-purple-500" },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={cn("w-3 h-3", stat.iconColor)} />
                </div>
                <div className="text-white font-semibold">{stat.value}</div>
                <Progress value={stat.pct} className={cn("h-1 mt-2 bg-slate-700/50", stat.barColor)} />
              </div>
            ))}
          </div>

          <Separator className="bg-slate-700/50 mb-4" />

          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3 h-3 text-slate-500" />
            <h4 className="text-[10px] font-orbitron text-slate-500 uppercase tracking-wider">Recent Activity</h4>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {[
                { action: "Empire created", detail: "New game started", time: "Just now", icon: "🌟" },
                { action: "Save loaded", detail: "Slot 3 restored", time: "2h ago", icon: "📂" },
                { action: "System conquered", detail: "Kepler-186f", time: "3h ago", icon: "⚔️" },
                { action: "Research completed", detail: "Warp Drive Mk.II", time: "5h ago", icon: "🔬" },
                { action: "Diplomacy updated", detail: "Alliance formed", time: "1d ago", icon: "🤝" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                  <span className="text-sm mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium truncate">{item.action}</div>
                    <div className="text-[10px] text-slate-500 truncate">{item.detail}</div>
                  </div>
                  <span className="text-[9px] text-slate-600 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>
      </main>

      <footer className="relative z-20 border-t border-slate-700/50 bg-slate-900/60 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-xs text-slate-500 font-mono">
            {isNewGame ? "Template: " + (EMPIRE_TEMPLATES.find((t) => t.id === selectedTemplate)?.name || "Custom") : selectedSlot ? `Slot ${selectedSlot} selected` : "No selection"}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 font-orbitron tracking-wider"
              disabled={!selectedSlot && !isNewGame}
              onClick={handleContinue}
            >
              <Save className="w-4 h-4 mr-2" />
              LOAD EMPIRE
            </Button>
            <Button
              className={cn(
                "font-orbitron tracking-wider px-6 shadow-lg transition-all",
                isNewGame || selectedSlot
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white hover:shadow-xl"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed",
              )}
              disabled={!selectedSlot && !isNewGame || loadSlotMutation.isPending}
              onClick={handleContinue}
            >
              {loadSlotMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  LOADING...
                </>
              ) : (
                <>
                  {isNewGame ? "PROCEED TO REALM SELECT" : "LOAD EMPIRE"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
