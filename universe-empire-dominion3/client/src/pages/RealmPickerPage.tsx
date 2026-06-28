import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Globe2, ArrowRight, ArrowLeft, Check, Server, Users, Shield,
  Swords, Brain, Coins, FlaskConical, Eye, Rocket, Star, Info,
  Zap, Crown, Skull, ChevronDown, ChevronUp, Activity, Clock,
  Wrench,
} from "lucide-react";
import {
  REALMS, SERVER_INFO, getRealmById, getTotalPopulation,
  getTotalOnlinePlayers, getTotalEmpires, type RealmDef, type RealmBonusType,
} from "@shared/config/realmConfig";

export default function RealmPickerPage() {
  const { setOnboardingStep, realmServers, selectedRealmId, switchRealm } = useGame();
  const [selectedRealm, setSelectedRealm] = useState(selectedRealmId || "");
  const [expandedRealm, setExpandedRealm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterServer, setFilterServer] = useState<string>("all");

  const filteredRealms = filterServer === "all"
    ? REALMS
    : REALMS.filter((r) => r.server === filterServer);

  const selected = getRealmById(selectedRealm);

  const handleContinue = async () => {
    if (!selectedRealm) {
      setError("Please select a realm.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      if (selectedRealm !== selectedRealmId) {
        await switchRealm(selectedRealm);
      }
      setOnboardingStep(1);
    } catch (err: any) {
      setError(err.message || "Failed to select realm.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setOnboardingStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="flex items-center justify-between px-6 py-4 z-20 relative">
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white transition-colors"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Login
        </Button>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 font-mono">
            Step 1 of 4 — Select Realm
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Activity className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400">{getTotalOnlinePlayers().toLocaleString()} online</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{getTotalEmpires().toLocaleString()} empires</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center p-4 pt-2 z-10 relative overflow-y-auto">
        <div className="w-full max-w-7xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-lg overflow-hidden">
              <Globe2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-orbitron font-bold tracking-wider text-white">
              SELECT YOUR REALM
            </h1>
            <p className="text-lg text-slate-400 font-rajdhani font-medium max-w-2xl mx-auto">
              Choose the command realm for your empire. Each realm is a unique game world with its own rules, bonuses, and community.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={filterServer === "all" ? "default" : "ghost"}
              className={cn(
                "text-xs font-mono h-7",
                filterServer === "all"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              )}
              onClick={() => setFilterServer("all")}
            >
              All Realms
            </Button>
            {Object.keys(SERVER_INFO).map((key) => {
              const info = SERVER_INFO[key as keyof typeof SERVER_INFO];
              return (
              <Button
                key={key}
                size="sm"
                variant={filterServer === key ? "default" : "ghost"}
                className={cn(
                  "text-xs font-mono h-7",
                  filterServer === key
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-white"
                )}
                onClick={() => setFilterServer(key)}
              >
                <Server className="w-3 h-3 mr-1.5" />
                {info.name}
                <span className={cn(
                  "ml-1.5 w-1.5 h-1.5 rounded-full",
                  info.status === "healthy" ? "bg-green-400" : info.status === "degraded" ? "bg-amber-400" : "bg-red-400"
                )} />
              </Button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRealms.map((realm) => {
              const isSelected = selectedRealm === realm.id;
              const isExpanded = expandedRealm === realm.id;
              return (
                <div key={realm.id} className="relative">
                  <button
                    onClick={() => setSelectedRealm(realm.id)}
                    className={cn(
                      "relative text-left rounded-xl border transition-all duration-200 overflow-hidden group w-full",
                      isSelected
                        ? cn("bg-slate-900/95", realm.borderColor, realm.glowColor)
                        : "border-slate-700/50 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800/60"
                    )}
                  >
                    <div className={cn("h-1.5 w-full bg-gradient-to-r", realm.bannerGradient)} />
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{realm.icon}</span>
                            <div>
                              <h3 className="text-lg font-bold text-white font-orbitron tracking-wide">
                                {realm.name}
                              </h3>
                              <p className={cn("text-xs font-semibold", realm.textColor)}>
                                {realm.tier} Tier {realm.tierNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1", `bg-gradient-to-br ${realm.bannerGradient}`)}>
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={cn("text-[10px] border-current/30 bg-current/5", realm.textColor)}>
                          {realm.universe}
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          realm.difficulty === "Beginner" && "border-green-500/30 text-green-400 bg-green-500/5",
                          realm.difficulty === "Intermediate" && "border-blue-500/30 text-blue-400 bg-blue-500/5",
                          realm.difficulty === "Advanced" && "border-orange-500/30 text-orange-400 bg-orange-500/5",
                          realm.difficulty === "Veteran" && "border-red-500/30 text-red-400 bg-red-500/5",
                        )}>
                          {realm.difficulty}
                        </Badge>
                        {realm.speedMultiplier !== 1.0 && (
                          <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400 bg-cyan-500/5">
                            <Zap className="w-2.5 h-2.5 mr-0.5" />
                            {realm.speedMultiplier}x Speed
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-slate-800/60 p-2">
                          <div className="text-[10px] text-slate-500 uppercase">Pop</div>
                          <div className="text-xs font-bold text-white">{realm.population}</div>
                        </div>
                        <div className="rounded-lg bg-slate-800/60 p-2">
                          <div className="text-[10px] text-slate-500 uppercase">Empires</div>
                          <div className="text-xs font-bold text-white">{(realm.totalEmpires / 1000).toFixed(1)}K</div>
                        </div>
                        <div className="rounded-lg bg-slate-800/60 p-2">
                          <div className="text-[10px] text-slate-500 uppercase">Online</div>
                          <div className="text-xs font-bold text-green-400">{(realm.onlinePlayers / 1000).toFixed(0)}K</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {realm.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {realm.bonuses.map((bonus, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={cn("text-[10px] border-current/20 bg-current/5", realm.textColor)}
                          >
                            {bonus.label}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider">
                          <Server className="w-3 h-3" />
                          {realm.serverLabel}
                          <span className="text-slate-600">•</span>
                          <span>{realm.galaxySize}</span>
                        </div>
                        <div
                          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRealm(isExpanded ? null : realm.id);
                          }}
                        >
                          <Info className="w-3 h-3" />
                          Details
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className={cn(
                      "mt-1 rounded-xl border p-4 space-y-3 bg-slate-900/95",
                      realm.borderColor
                    )}>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Lore</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{realm.lore}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Special Mechanic</h4>
                        <p className={cn("text-xs leading-relaxed", realm.textColor)}>{realm.specialMechanic}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {realm.features.map((f, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-slate-600 text-slate-300">
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Start Resources</h4>
                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div className="text-slate-400"><Coins className="w-3 h-3 inline mr-1" />{realm.startResources.credits.toLocaleString()} CR</div>
                          <div className="text-slate-400"><Wrench className="w-3 h-3 inline mr-1" />{realm.startResources.minerals.toLocaleString()} MN</div>
                          <div className="text-slate-400"><Zap className="w-3 h-3 inline mr-1" />{realm.startResources.energy.toLocaleString()} EN</div>
                          <div className="text-slate-400"><Swords className="w-3 h-3 inline mr-1" />{realm.startResources.alloys.toLocaleString()} AL</div>
                          <div className="text-slate-400"><FlaskConical className="w-3 h-3 inline mr-1" />{realm.startResources.research.toLocaleString()} RS</div>
                          <div className="text-slate-400"><Star className="w-3 h-3 inline mr-1" />{realm.startResources.influence.toLocaleString()} IN</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Recommended For</h4>
                        <div className="flex flex-wrap gap-1">
                          {realm.recommendedFor.map((r, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {realm.restrictions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Restrictions</h4>
                          <div className="flex flex-wrap gap-1">
                            {realm.restrictions.map((r, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] border-red-500/30 text-red-400 bg-red-500/5">
                                {r}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Seasonal Event</h4>
                        <p className="text-xs text-amber-400">{realm.seasonalEvent}</p>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span>Alliance: {realm.maxAllianceSize} max</span>
                        <span>•</span>
                        <span>Galaxy: {realm.galaxySize}</span>
                        <span>•</span>
                        <span>Avg Power: {realm.avgPower.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selected && (
            <Card className={cn("border bg-slate-900/95", selected.borderColor, selected.glowColor)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selected.icon}</span>
                    <div>
                      <div className="font-orbitron font-bold text-white">{selected.name}</div>
                      <div className={cn("text-xs", selected.textColor)}>
                        {selected.tier} Tier {selected.tierNumber} • {selected.universe} • {selected.serverLabel}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selected.status === "live" ? "Live Now" : selected.status}</span>
                    <span className="text-slate-600">•</span>
                    <span>{selected.onlinePlayers.toLocaleString()} online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center space-y-4 pb-8">
            <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <Server className="w-3.5 h-3.5" />
              {Object.values(SERVER_INFO).map((s, i, arr) => (
                <span key={i}>
                  {s.name} ({s.region.split("(")[1]?.replace(")", "") || s.region})
                  {i < arr.length - 1 && <span className="mx-1.5">•</span>}
                </span>
              ))}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm max-w-md mx-auto">
                {error}
              </div>
            )}

            <Button
              onClick={handleContinue}
              className={cn(
                "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-orbitron tracking-widest h-14 px-12 text-lg shadow-lg transition-all hover:shadow-xl",
                (!selectedRealm || isSubmitting) && "opacity-50 cursor-not-allowed"
              )}
              disabled={!selectedRealm || isSubmitting}
            >
              PROCEED TO SEASON SELECT
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Total: {getTotalPopulation()} citizens across {REALMS.length} realms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
