import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe2, ArrowRight, ArrowLeft, Check, Server, Users } from "lucide-react";

const NINE_REALMS = [
  { id: "realm-01", name: "Asgard Prime", rank: "Sovereign Tier I", universe: "Nexus Crown", detail: "Capital command realm anchoring diplomacy, governance, and apex fleet command.", population: "14.2M", server: "nexus-alpha", color: "from-yellow-500 to-amber-600", icon: "👑" },
  { id: "realm-02", name: "Midgard Frontier", rank: "Dominion Tier II", universe: "Nexus Crown", detail: "Balanced realm focused on colonization, growth, and trade.", population: "11.8M", server: "nexus-alpha", color: "from-green-500 to-emerald-600", icon: "🌍" },
  { id: "realm-03", name: "Alfheim Radiant", rank: "Ascendant Tier III", universe: "Aurora Reach", detail: "High-research realm for breakthroughs and science bonuses.", population: "9.4M", server: "cygnus-eu", color: "from-blue-500 to-cyan-600", icon: "🔬" },
  { id: "realm-04", name: "Jotunheim Bastion", rank: "Warfront Tier IV", universe: "Aurora Reach", detail: "Heavy-industry realm for defense grids and assault fleets.", population: "8.9M", server: "cygnus-eu", color: "from-red-500 to-orange-600", icon: "⚔️" },
  { id: "realm-05", name: "Vanaheim Bloom", rank: "Prosperity Tier V", universe: "Verdant Expanse", detail: "Economic powerhouse with premium resources and trade.", population: "10.6M", server: "orion-apac", color: "from-emerald-500 to-teal-600", icon: "💰" },
  { id: "realm-06", name: "Svartalf Forge", rank: "Industrial Tier VI", universe: "Verdant Expanse", detail: "Blueprint and shipyard realm for elite hull output.", population: "7.7M", server: "orion-apac", color: "from-slate-400 to-zinc-600", icon: "🔨" },
  { id: "realm-07", name: "Muspel Pyre", rank: "Strike Tier VII", universe: "Crimson Verge", detail: "Aggressive combat realm for raids and warfare.", population: "6.3M", server: "nexus-alpha", color: "from-orange-500 to-red-600", icon: "🔥" },
  { id: "realm-08", name: "Niflheim Veil", rank: "Shadow Tier VIII", universe: "Crimson Verge", detail: "Espionage and stealth-operations realm.", population: "5.8M", server: "cygnus-eu", color: "from-purple-500 to-indigo-600", icon: "🌑" },
  { id: "realm-09", name: "Hel Nexus", rank: "Endgame Tier IX", universe: "Oblivion Gate", detail: "Late-cycle realm for veterans and ascension loops.", population: "4.9M", server: "orion-apac", color: "from-rose-500 to-pink-600", icon: "💀" },
] as const;

export default function RealmPickerPage() {
  const { setOnboardingStep, realmServers, selectedRealmId, switchRealm } = useGame();
  const [selectedRealm, setSelectedRealm] = useState(selectedRealmId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getServerLabel = (server: string) => {
    switch (server) {
      case "nexus-alpha": return "Nexus Alpha (US)";
      case "cygnus-eu": return "Cygnus (EU)";
      case "orion-apac": return "Orion (APAC)";
      default: return server;
    }
  };

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
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="flex items-center justify-between px-6 py-4 z-20 relative">
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white transition-colors"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Login
        </Button>
        <div className="text-sm text-slate-500 font-mono">
          Step 1 of 3 — Select Realm
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 z-10 relative">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-lg overflow-hidden">
              <Globe2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-orbitron font-bold tracking-wider text-white">
              SELECT YOUR REALM
            </h1>
            <p className="text-lg text-slate-400 font-rajdhani font-medium max-w-xl mx-auto">
              Choose the command realm for your empire. Each realm is a unique game world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NINE_REALMS.map((realm) => {
              const isSelected = selectedRealm === realm.id;
              return (
                <button
                  key={realm.id}
                  onClick={() => setSelectedRealm(realm.id)}
                  className={cn(
                    "relative text-left rounded-xl border transition-all duration-200 overflow-hidden group",
                    isSelected
                      ? "border-cyan-500/60 bg-slate-900/90 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                      : "border-slate-700/50 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800/60"
                  )}
                >
                  <div className={cn("h-1.5 w-full bg-gradient-to-r", realm.color)} />
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{realm.icon}</span>
                          <h3 className="text-lg font-bold text-white font-orbitron tracking-wide">
                            {realm.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400">{realm.rank}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                        {realm.universe}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <Users className="w-3 h-3" />
                      {realm.population}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {realm.detail}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider">
                      <Server className="w-3 h-3" />
                      {getServerLabel(realm.server)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center space-y-4">
            <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <Server className="w-3.5 h-3.5" />
              3 servers worldwide: Nexus Alpha (US), Cygnus (EU), Orion (APAC)
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
              Total: 79.6M citizens across 9 realms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
