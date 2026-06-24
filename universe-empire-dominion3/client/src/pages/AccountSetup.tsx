import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Rocket,
  Users,
  Landmark,
  Globe,
  Star,
  Check,
  ChevronRight,
  ChevronLeft,
  Shield,
  Crown,
  Palette,
  Loader2,
} from "lucide-react";
import { RACES, RaceId } from "@/lib/commanderTypes";
import { GOVERNMENTS, GovernmentId } from "@/lib/governmentData";
import { cn } from "@/lib/utils";

const DEFAULT_RACE: RaceId = "terran";
const DEFAULT_GOVERNMENT: GovernmentId = "democracy";

const isRaceId = (value: unknown): value is RaceId =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(RACES, value);

const isGovernmentId = (value: unknown): value is GovernmentId =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(GOVERNMENTS, value);

const BANNERS = ["🛡️", "⚔️", "🌟", "🔱", "👑", "🏛️", "⚡", "🌌", "🚀", "💎"];

const COLORS = [
  { id: "cyan", value: "#06b6d4", label: "Cyan" },
  { id: "emerald", value: "#10b981", label: "Emerald" },
  { id: "purple", value: "#8b5cf6", label: "Purple" },
  { id: "amber", value: "#f59e0b", label: "Amber" },
  { id: "red", value: "#ef4444", label: "Red" },
  { id: "blue", value: "#3b82f6", label: "Blue" },
  { id: "pink", value: "#ec4899", label: "Pink" },
  { id: "teal", value: "#14b8a6", label: "Teal" },
];

const ORIGINS = [
  { id: "lost_colony", name: "Lost Colony", icon: "🛰️", description: "A remnant of a once-great empire, scattered across the stars. Your people carry the knowledge of a forgotten age.", bonus: "+20% Science, +15% Habitable Worlds" },
  { id: "mechanist", name: "Mechanist", icon: "🤖", description: "Early integration of robotic labor gave your civilization a head start in automation and industry.", bonus: "+25% Robot Build Speed, +10% Mineral" },
  { id: "prosperous_unification", name: "Prosperous Unification", icon: "🏛️", description: "A period of unprecedented peace and cooperation has left your world united and thriving.", bonus: "+15% All Resources, +10 Stability" },
  { id: "galactic_doorstep", name: "Galactic Doorstep", icon: "🌀", description: "Your homeworld sits near a dormant gateway—a relic of an ancient interstellar network.", bonus: "+20% Explore Speed, Gateway Access" },
  { id: "tree_of_life", name: "Tree of Life", icon: "🌿", description: "Your world is blessed with a symbiotic biosphere that enhances all organic growth.", bonus: "+25% Food, +15% Pop Growth" },
  { id: "post_apocalyptic", name: "Post-Apocalyptic", icon: "☢️", description: "Your species survived a devastating cataclysm. You are hardened, resilient, and resourceful.", bonus: "+20% Habitability, +10% Army Strength" },
  { id: "void_dwellers", name: "Void Dwellers", icon: "🛸", description: "Born in the void between worlds, your people thrive in space habitats and orbital stations.", bonus: "+20% Habitat Output, +15% Starbase" },
  { id: "syncretic_evolution", name: "Syncretic Evolution", icon: "👥", description: "Two species evolved side by side, forming a unique symbiotic civilization.", bonus: "+10% Pop Diversity, +5% All Production" },
];

const STEP_NAMES = ["Name", "Species", "Government", "Origin", "Review"];
const STEP_ICONS = [Rocket, Users, Landmark, Globe, Star];

interface OriginData {
  id: string;
  name: string;
  icon: string;
  description: string;
  bonus: string;
}

export default function AccountSetup() {
  const {
    completeSetup,
    isLoading,
    commander,
    government,
    planetName,
    setOnboardingStep,
  } = useGame();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState(1);
  const [selectedRace, setSelectedRace] = useState<RaceId>(DEFAULT_RACE);
  const [selectedGovernment, setSelectedGovernment] = useState<GovernmentId>(DEFAULT_GOVERNMENT);
  const [empireName, setEmpireName] = useState("Stellar Dominion");
  const [homeWorldName, setHomeWorldName] = useState("New Colony");
  const [selectedBanner, setSelectedBanner] = useState("🛡️");
  const [selectedColor, setSelectedColor] = useState("cyan");
  const [description, setDescription] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState<OriginData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const handleBack = () => {
    setOnboardingStep(1);
  };

  const isDataLoaded = commander && government && commander.race && government.type;

  useEffect(() => {
    if (isDataLoaded && !hasUserInteracted) {
      setSelectedRace(isRaceId(commander.race) ? commander.race : DEFAULT_RACE);
      setSelectedGovernment(isGovernmentId(government.type) ? government.type : DEFAULT_GOVERNMENT);
      setEmpireName(commander.empireName || commander.name || "Stellar Dominion");
      setHomeWorldName(planetName || "New Colony");
    }
  }, [commander?.race, commander?.empireName, government?.type, planetName, hasUserInteracted, isDataLoaded]);

  const handleComplete = async () => {
    if (!commander || !government) {
      setError("Game data is still loading. Please wait.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const safeRace = isRaceId(selectedRace) ? selectedRace : DEFAULT_RACE;
    const safeGovernment = isGovernmentId(selectedGovernment) ? selectedGovernment : DEFAULT_GOVERNMENT;

    const updatedCommander = {
      ...commander,
      race: safeRace,
      empireName: empireName.trim().slice(0, 64) || "Stellar Dominion",
      empireSlot: 1,
    };

    const govBase = GOVERNMENTS[safeGovernment].baseStats;

    const updatedGovernment = {
      ...government,
      type: safeGovernment,
      stats: {
        stability: govBase.stability,
        publicSupport: 50,
        efficiency: govBase.efficiency,
        militaryReadiness: govBase.military,
        corruption: 10,
      },
    };

    try {
      await completeSetup(updatedCommander, updatedGovernment, {
        homeWorldName: homeWorldName.trim().slice(0, 64) || "New Colony",
      });
      setLocation("/");
    } catch {
      setError("Failed to save your selections. Please try again.");
      setIsSubmitting(false);
    }
  };

  const selectedRaceData = RACES[selectedRace] ?? RACES[DEFAULT_RACE];
  const selectedGovernmentData = GOVERNMENTS[selectedGovernment] ?? GOVERNMENTS[DEFAULT_GOVERNMENT];

  const colorValue = COLORS.find((c) => c.id === selectedColor)?.value ?? "#06b6d4";

  const advanceStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none" style={{ background: `${colorValue}08` }} />

      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
        <Button variant="ghost" className="text-slate-400 hover:text-white transition-colors" onClick={step === 1 ? handleBack : prevStep}>
          {step === 1 ? <ChevronLeft className="w-5 h-5 mr-1" /> : <ChevronLeft className="w-5 h-5 mr-1" />}
          {step === 1 ? "Back" : "Previous"}
        </Button>
        <div className="text-sm text-slate-500 font-mono">
          Step {step} of 5 — {STEP_NAMES[step - 1]}
        </div>
        <div className="w-[100px]" />
      </div>

      <div className="relative z-10 flex justify-center py-6 px-4">
        <div className="flex items-center gap-0">
          {STEP_NAMES.map((name, i) => {
            const num = i + 1;
            const Icon = STEP_ICONS[i];
            const isActive = num === step;
            const isDone = num < step;
            return (
              <div key={name} className="flex items-center">
                {i > 0 && (
                  <div className={cn("w-8 h-0.5 mx-1", isDone ? "bg-emerald-500" : "bg-slate-700")} />
                )}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                      isDone && "bg-emerald-600 border-emerald-500 text-white",
                      isActive && "border-white text-white shadow-lg scale-110",
                      !isActive && !isDone && "border-slate-600 text-slate-500 bg-slate-800/50"
                    )}
                    style={isActive ? { borderColor: colorValue, boxShadow: `0 0 20px ${colorValue}40` } : undefined}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={cn("text-xs font-medium", isActive ? "text-white" : "text-slate-500")}>{name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4 flex justify-center">
        <Card className="w-full max-w-4xl bg-slate-900/80 border-slate-700 text-white relative shadow-2xl backdrop-blur-sm flex flex-col max-h-[calc(100vh-220px)]">
          <ScrollArea className="flex-1">
            <CardContent className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-orbitron font-bold tracking-wider text-white">EMPIRE IDENTITY</h2>
                    <p className="text-slate-400 mt-1">Define the core identity of your interstellar empire</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-slate-400" />
                      Empire Name
                    </Label>
                    <Input
                      value={empireName}
                      onChange={(e) => { setHasUserInteracted(true); setEmpireName(e.target.value); }}
                      className="h-12 text-lg bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                      placeholder="Enter your empire name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      Home World Name
                    </Label>
                    <Input
                      value={homeWorldName}
                      onChange={(e) => { setHasUserInteracted(true); setHomeWorldName(e.target.value); }}
                      className="h-12 text-lg bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                      placeholder="Enter your homeworld name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      Empire Banner
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {BANNERS.map((b) => (
                        <button
                          key={b}
                          onClick={() => { setHasUserInteracted(true); setSelectedBanner(b); }}
                          className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 transition-all",
                            selectedBanner === b
                              ? "border-white bg-slate-700 shadow-lg scale-110"
                              : "border-slate-600 bg-slate-800/50 hover:border-slate-400"
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-slate-400" />
                      Color Scheme
                    </Label>
                    <div className="flex gap-2">
                      {COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => { setHasUserInteracted(true); setSelectedColor(c.id); }}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all",
                            selectedColor === c.id ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                          )}
                          style={{ background: c.value }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-300">Empire Description (Optional)</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => { setHasUserInteracted(true); setDescription(e.target.value); }}
                      className="bg-slate-800 border-slate-600 text-white focus:border-cyan-500 min-h-[80px]"
                      placeholder="A brief description of your empire's philosophy..."
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-orbitron font-bold tracking-wider text-white">SPECIES SELECTION</h2>
                    <p className="text-slate-400 mt-1">Choose the foundational species of your empire</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(RACES).map((race) => {
                      const isSelected = selectedRace === race.id;
                      return (
                        <button
                          key={race.id}
                          onClick={() => { setHasUserInteracted(true); setSelectedRace(race.id); }}
                          className={cn(
                            "text-left rounded-xl p-4 border-2 transition-all duration-200",
                            isSelected
                              ? "border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                              : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
                              {race.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white">{race.name}</h3>
                                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                              </div>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{race.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {race.bonuses.map((bonus, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-700/50">
                                    {bonus}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedRaceData && (
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                      <h3 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {selectedRaceData.name} — Details
                      </h3>
                      <p className="text-sm text-slate-300 mb-3">{selectedRaceData.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-emerald-400 mb-1">Racial Bonuses:</p>
                        {selectedRaceData.bonuses.map((bonus, i) => (
                          <div key={i} className="text-xs text-emerald-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                            {bonus}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-slate-400 border-t border-slate-700 pt-3">
                        <span className="font-semibold text-slate-300">Playstyle:</span>{" "}
                        {selectedRace === "terran" && "Balanced — strong economy and steady expansion."}
                        {selectedRace === "aquarian" && "Economic — focus on deuterium and biological research."}
                        {selectedRace === "mechborn" && "Industrial — rapid construction and infrastructure."}
                        {selectedRace === "lithoid" && "Defensive — heavy armor and mineral extraction."}
                        {selectedRace === "zypherian" && "Military — fleet coordination and collective research."}
                        {selectedRace === "vortexborn" && "Exploration — exotic research and warp speed."}
                        {selectedRace === "silicate" && "Economic — crystal production and energy efficiency."}
                        {selectedRace === "ethereal" && "Scientific — spiritual and quantum research."}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-orbitron font-bold tracking-wider text-white">GOVERNMENT SELECTION</h2>
                    <p className="text-slate-400 mt-1">Select how your empire will be governed</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(GOVERNMENTS).map((gov) => {
                      const isSelected = selectedGovernment === gov.id;
                      return (
                        <button
                          key={gov.id}
                          onClick={() => { setHasUserInteracted(true); setSelectedGovernment(gov.id); }}
                          className={cn(
                            "text-left rounded-xl p-4 border-2 transition-all duration-200",
                            isSelected
                              ? "border-purple-400 bg-purple-950/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                              : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shrink-0">
                              <Crown className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white">{gov.name}</h3>
                                {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                              </div>
                              <p className="text-[11px] text-purple-300 font-medium">Ruler: {gov.rulerTitle}</p>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{gov.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {gov.bonuses.slice(0, 2).map((b, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-700/50">
                                    {b}
                                  </span>
                                ))}
                                {gov.penalties.slice(0, 1).map((p, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-900/50 text-red-400 border border-red-700/50">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedGovernmentData && (
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                      <h3 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                        <Landmark className="w-4 h-4" />
                        {selectedGovernmentData.name} — Details
                      </h3>
                      <p className="text-sm text-slate-300 mb-1">{selectedGovernmentData.description}</p>
                      <p className="text-xs text-purple-300 mb-3">
                        <span className="font-semibold">Ruler Title:</span> {selectedGovernmentData.rulerTitle} &middot;{" "}
                        <span className="font-semibold">Family:</span> {selectedGovernmentData.family}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-emerald-400 mb-1">Bonuses</p>
                          {selectedGovernmentData.bonuses.map((b, i) => (
                            <div key={i} className="text-xs text-emerald-300 flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                              {b}
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">Penalties</p>
                          {selectedGovernmentData.penalties.map((p, i) => (
                            <div key={i} className="text-xs text-red-300 flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-xs font-semibold text-slate-300 mb-1">Edicts Available:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedGovernmentData.preferredSystems.map((sys, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 border border-slate-600">
                              {sys}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-orbitron font-bold tracking-wider text-white">ORIGIN SELECTION</h2>
                    <p className="text-slate-400 mt-1">Choose the origin story of your civilization</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ORIGINS.map((origin) => {
                      const isSelected = selectedOrigin?.id === origin.id;
                      return (
                        <button
                          key={origin.id}
                          onClick={() => { setHasUserInteracted(true); setSelectedOrigin(origin); }}
                          className={cn(
                            "text-left rounded-xl p-4 border-2 transition-all duration-200",
                            isSelected
                              ? "border-amber-400 bg-amber-950/30 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                              : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-3xl shrink-0">{origin.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white">{origin.name}</h3>
                                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                              </div>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{origin.description}</p>
                              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-400 border border-amber-700/50">
                                {origin.bonus}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedOrigin && (
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                      <h3 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        {selectedOrigin.name} — Starting Conditions
                      </h3>
                      <p className="text-sm text-slate-300 mb-3">{selectedOrigin.description}</p>
                      <div className="bg-amber-950/20 border border-amber-800/30 rounded-lg p-3">
                        <p className="text-xs font-semibold text-amber-400 mb-1">Starting Bonus:</p>
                        <p className="text-sm text-amber-200">{selectedOrigin.bonus}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-orbitron font-bold tracking-wider text-white">REVIEW & CONFIRM</h2>
                    <p className="text-slate-400 mt-1">Review your empire configuration before launch</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReviewCard
                      title="Empire Identity"
                      icon={<Rocket className="w-4 h-4" />}
                      color="text-cyan-400"
                      borderColor="border-cyan-800/50"
                      onEdit={() => setStep(1)}
                    >
                      <p className="text-white font-semibold text-lg">{selectedBanner} {empireName}</p>
                      <p className="text-xs text-slate-400 mt-1">Homeworld: {homeWorldName}</p>
                      <p className="text-xs text-slate-400">Theme: {COLORS.find((c) => c.id === selectedColor)?.label}</p>
                    </ReviewCard>

                    <ReviewCard
                      title="Species"
                      icon={<Users className="w-4 h-4" />}
                      color="text-cyan-400"
                      borderColor="border-cyan-800/50"
                      onEdit={() => setStep(2)}
                    >
                      <p className="text-white font-semibold">{selectedRaceData.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedRaceData.bonuses.map((b, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400">{b}</span>
                        ))}
                      </div>
                    </ReviewCard>

                    <ReviewCard
                      title="Government"
                      icon={<Landmark className="w-4 h-4" />}
                      color="text-purple-400"
                      borderColor="border-purple-800/50"
                      onEdit={() => setStep(3)}
                    >
                      <p className="text-white font-semibold">{selectedGovernmentData.name}</p>
                      <p className="text-xs text-purple-300">Ruler: {selectedGovernmentData.rulerTitle}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedGovernmentData.bonuses.slice(0, 2).map((b, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400">{b}</span>
                        ))}
                      </div>
                    </ReviewCard>

                    <ReviewCard
                      title="Origin"
                      icon={<Globe className="w-4 h-4" />}
                      color="text-amber-400"
                      borderColor="border-amber-800/50"
                      onEdit={() => setStep(4)}
                    >
                      <p className="text-white font-semibold">{selectedOrigin ? `${selectedOrigin.icon} ${selectedOrigin.name}` : "Not Selected"}</p>
                      {selectedOrigin && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-900/50 text-amber-400">{selectedOrigin.bonus}</span>
                      )}
                    </ReviewCard>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-emerald-400" />
                      Combined Empire Stats
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <StatBlock label="Race Bonus" value={selectedRaceData.bonuses[0]} color="text-cyan-400" />
                      <StatBlock label="Gov Bonus" value={selectedGovernmentData.bonuses[0]} color="text-purple-400" />
                      <StatBlock label="Origin Bonus" value={selectedOrigin?.bonus?.split(",")[0] || "None"} color="text-amber-400" />
                      <StatBlock label="Stability" value={`${selectedGovernmentData.baseStats.stability}`} color="text-emerald-400" />
                      <StatBlock label="Efficiency" value={`${selectedGovernmentData.baseStats.efficiency}`} color="text-blue-400" />
                      <StatBlock label="Military" value={`${selectedGovernmentData.baseStats.military}`} color="text-red-400" />
                      <StatBlock label="Homeworld" value={homeWorldName} color="text-slate-300" />
                      <StatBlock label="Empire" value={empireName} color="text-white" />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm" data-testid="error-message">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </ScrollArea>

          <div className="border-t border-slate-700 p-4 flex justify-end">
            {step < 5 ? (
              <Button
                onClick={advanceStep}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron tracking-widest h-12 px-8 shadow-lg transition-all hover:shadow-xl"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-orbitron tracking-widest h-14 text-lg shadow-lg transition-all hover:shadow-xl px-12"
                disabled={isLoading || isSubmitting}
                data-testid="button-begin-conquest"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    INITIALIZING EMPIRE...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    BEGIN CONQUEST
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ReviewCard({
  title,
  icon,
  color,
  borderColor,
  children,
  onEdit,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className={cn("rounded-xl border bg-slate-800/60 p-4", borderColor)}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={cn("text-xs font-semibold flex items-center gap-1.5", color)}>
          {icon}
          {title}
        </h4>
        <button onClick={onEdit} className="text-xs text-slate-500 hover:text-white transition-colors underline">
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function StatBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
      <p className="text-[10px] uppercase text-slate-500 font-medium">{label}</p>
      <p className={cn("text-sm font-semibold mt-0.5", color)}>{value}</p>
    </div>
  );
}
