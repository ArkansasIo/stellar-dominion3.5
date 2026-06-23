import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe2, ArrowRight, ArrowLeft, Loader2, Activity, Server } from "lucide-react";

export default function RealmPickerPage() {
  const { setOnboardingStep, realmServers, selectedRealmId, switchRealm } = useGame();
  const [selectedRealm, setSelectedRealm] = useState(selectedRealmId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRealmData = realmServers.find((r) => r.id === selectedRealm) || null;

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
      setOnboardingStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to select realm.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setOnboardingStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
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

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-slate-400 hover:text-white z-20 transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <div className="text-sm text-slate-500 absolute top-4 right-4 font-mono">
        Step 2 of 2 — Realm Selection
      </div>

      <Card className="w-full max-w-2xl bg-slate-900/80 border-slate-700 text-white relative z-10 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center pb-2 border-b border-slate-700">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
            <Globe2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-white">SELECT REALM</CardTitle>
          <CardDescription className="text-slate-400 font-rajdhani text-lg font-medium mt-2">
            Choose the command realm for your empire.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-400" />
              Available Realms
            </label>
            <Select value={selectedRealm} onValueChange={setSelectedRealm}>
              <SelectTrigger className="w-full h-12 bg-slate-800 border-slate-600 text-white focus:border-cyan-500" data-testid="select-realm">
                <SelectValue placeholder="Choose a realm" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {realmServers.map((realm) => (
                  <SelectItem key={realm.id} value={realm.id} data-testid={`option-realm-${realm.id}`}>
                    {realm.name} · {realm.region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRealmData && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{selectedRealmData.name}</p>
                  <p className="text-sm text-slate-400">
                    Region {selectedRealmData.region} · {selectedRealmData.universes?.length || 0} linked universes
                  </p>
                </div>
                <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {selectedRealmData.status || "offline"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded border border-slate-600 bg-slate-900/50 p-3">
                  <div className="text-xs text-slate-500">Players</div>
                  <div className="text-lg font-semibold text-white">{selectedRealmData.playersOnline.toLocaleString()}</div>
                </div>
                <div className="rounded border border-slate-600 bg-slate-900/50 p-3">
                  <div className="text-xs text-slate-500">Capacity</div>
                  <div className="text-lg font-semibold text-white">{selectedRealmData.maxPlayers.toLocaleString()}</div>
                </div>
                <div className="rounded border border-slate-600 bg-slate-900/50 p-3">
                  <div className="text-xs text-slate-500">Tick Rate</div>
                  <div className="text-lg font-semibold text-white">{selectedRealmData.tickRateMs}ms</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Activity className="w-4 h-4 text-slate-500" />
                Realm choice becomes your active command realm and can be switched later in-game.
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-orbitron tracking-widest h-14 text-lg shadow-lg transition-all hover:shadow-xl"
            disabled={!selectedRealm || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                INITIALIZING...
              </>
            ) : (
              <>
                LAUNCH EMPIRE
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
