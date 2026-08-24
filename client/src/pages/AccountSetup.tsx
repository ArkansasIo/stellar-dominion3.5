import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Rocket, Users, Landmark, Loader2, ArrowLeft, Globe2, Activity } from "lucide-react";
import { RACES, RaceId } from "@/lib/commanderTypes";
import { GOVERNMENTS, GovernmentId } from "@/lib/governmentData";
import { MENU_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";
const DEFAULT_RACE: RaceId = "terran";
const DEFAULT_GOVERNMENT: GovernmentId = "democracy";

const isRaceId = (value: unknown): value is RaceId =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(RACES, value);

const isGovernmentId = (value: unknown): value is GovernmentId =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(GOVERNMENTS, value);

// Mock: In a real app, this would come from the backend per user/realm
const getEmpireSlotsForRealm = (realmId: string) => {
  // For demo, just return 5 slots with mock data
  return Array.from({ length: 5 }, (_, i) => ({
    slot: i + 1,
    name: `Empire Slot ${i + 1}`,
    exists: false, // Set to true if a save exists for this slot
  }));
};

export default function AccountSetup() {
  const {
    completeSetup,
    isLoading,
    commander,
    government,
    planetName,
    logout,
    realmServers,
    selectedRealmId,
    switchRealm,
  } = useGame();
  const [, setLocation] = useLocation();
  const [selectedRace, setSelectedRace] = useState<RaceId>(DEFAULT_RACE);
  const [selectedGovernment, setSelectedGovernment] = useState<GovernmentId>(DEFAULT_GOVERNMENT);
  const [selectedRealm, setSelectedRealm] = useState("");
  const [empireName, setEmpireName] = useState("Universe Civilization: Empire at War");
  const [homeWorldName, setHomeWorldName] = useState("New Colony");
  const [selectedEmpireSlot, setSelectedEmpireSlot] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const handleBack = () => {
    logout();
  };

  const isDataLoaded = commander && government && commander.race && government.type;

  useEffect(() => {
    if (isDataLoaded && !hasUserInteracted) {
      setSelectedRace(isRaceId(commander.race) ? commander.race : DEFAULT_RACE);
      setSelectedGovernment(isGovernmentId(government.type) ? government.type : DEFAULT_GOVERNMENT);
      setEmpireName(commander.empireName || commander.name || "Universe Civilization: Empire at War");
      setHomeWorldName(planetName || "New Colony");
    }
  }, [commander?.race, commander?.empireName, government?.type, planetName, hasUserInteracted, isDataLoaded]);

  useEffect(() => {
    if (!hasUserInteracted && selectedRealmId) {
      setSelectedRealm(selectedRealmId);
    }
  }, [hasUserInteracted, selectedRealmId]);

  const handleRaceChange = (race: RaceId) => {
    setHasUserInteracted(true);
    setSelectedRace(race);
  };

  const handleGovernmentChange = (gov: GovernmentId) => {
    setHasUserInteracted(true);
    setSelectedGovernment(gov);
  };

  const handleRealmChange = (realmId: string) => {
    setHasUserInteracted(true);
    setSelectedRealm(realmId);
  };

  const handleComplete = async () => {
    if (!commander || !government) {
      setError("Game data is still loading. Please wait.");
      setIsSubmitting(false);
      return;
    }
    if (!selectedEmpireSlot) {
      setError("Please select an empire save slot.");
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
      empireName: empireName.trim().slice(0, 64) || "Universe Civilization: Empire at War",
      empireSlot: selectedEmpireSlot, // Save slot info
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
      if (selectedRealm && selectedRealm !== selectedRealmId) {
        await switchRealm(selectedRealm);
      }

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
  const selectedRealmData = realmServers.find((realm) => realm.id === (selectedRealm || selectedRealmId)) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-blue-200 hover:text-white z-20 transition-colors"
        data-testid="button-back-from-setup"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <Card className="w-full max-w-2xl bg-slate-950/95 border border-blue-400/40 text-blue-50 relative z-10 shadow-[0_0_60px_rgba(37,99,235,0.24)] hover:shadow-[0_0_80px_rgba(59,130,246,0.32)] transition-shadow duration-300">
        <CardHeader className="text-center pb-2 border-b border-blue-800/70">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_28px_rgba(59,130,246,0.5)] overflow-hidden">
            <img
              src={MENU_ASSETS.NAVIGATION.EMPIRE.path}
              alt="empire setup"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = TEMP_THEME_IMAGE;
              }}
            />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-blue-100">EMPIRE SETUP</CardTitle>
          <CardDescription className="text-blue-200 font-rajdhani text-lg font-medium mt-2">
            Choose your realm, race, and government to begin your conquest.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-blue-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-300" />
              Select Empire Save Slot
            </Label>
            <div className="flex gap-2 mb-2">
              {getEmpireSlotsForRealm(selectedRealm).map((slot) => (
                <button
                  key={slot.slot}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${selectedEmpireSlot === slot.slot ? "border-cyan-600 bg-cyan-50 text-cyan-900" : "border-slate-300 bg-white text-slate-700 hover:border-cyan-400"}`}
                  onClick={() => setSelectedEmpireSlot(slot.slot)}
                  type="button"
                >
                  {slot.name}
                  {slot.exists ? " (Used)" : " (Empty)"}
                </button>
              ))}
            </div>
            <Label className="text-sm font-semibold text-blue-100 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-blue-300" />
              Empire Identity
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empire-name" className="text-xs uppercase tracking-wider text-slate-600">Empire Name</Label>
                <input
                  id="empire-name"
                  value={empireName}
                  onChange={(event) => {
                    setHasUserInteracted(true);
                    setEmpireName(event.target.value);
                  }}
                  className="w-full h-12 rounded-md border border-blue-800/80 bg-blue-950/50 px-3 text-blue-50 placeholder:text-blue-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Enter empire name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeworld-name" className="text-xs uppercase tracking-wider text-slate-600">Home World Name</Label>
                <input
                  id="homeworld-name"
                  value={homeWorldName}
                  onChange={(event) => {
                    setHasUserInteracted(true);
                    setHomeWorldName(event.target.value);
                  }}
                  className="w-full h-12 rounded-md border border-blue-800/80 bg-blue-950/50 px-3 text-blue-50 placeholder:text-blue-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Enter home world name"
                />
              </div>
            </div>
            <div className="bg-blue-950/45 border border-blue-800/70 rounded-lg p-3 text-xs text-blue-200">
              Your empire name becomes the banner identity for diplomacy and rankings, while your home world name becomes your starting capital planet.
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-blue-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-300" />
              Select Your Realm
            </Label>
            <Select value={selectedRealm} onValueChange={handleRealmChange}>
              <SelectTrigger className="w-full h-12 bg-blue-950/60 border-blue-700/80 text-blue-50 focus:border-blue-400 focus:ring-blue-500/40" data-testid="select-realm">
                <SelectValue placeholder="Choose a realm" />
              </SelectTrigger>
              <SelectContent>
                {realmServers.map((realm) => (
                  <SelectItem key={realm.id} value={realm.id} data-testid={`option-realm-${realm.id}`}>
                    {realm.name} · {realm.region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-blue-950/45 border border-blue-800/70 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-blue-100 font-semibold">{selectedRealmData?.name || "Awaiting realm sync"}</p>
                  <p className="text-xs text-blue-300">
                    Region {selectedRealmData?.region || "--"} · {selectedRealmData?.universes?.length || 0} linked universes
                  </p>
                </div>
                <div className="rounded-full border border-blue-400/40 bg-blue-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                  {selectedRealmData?.status || "offline"}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded border border-blue-800/70 bg-blue-950/60 p-2">
                  <div className="text-blue-400">Players</div>
                  <div className="font-semibold text-blue-100">{selectedRealmData ? selectedRealmData.playersOnline.toLocaleString() : 0}</div>
                </div>
                <div className="rounded border border-blue-800/70 bg-blue-950/60 p-2">
                  <div className="text-blue-400">Capacity</div>
                  <div className="font-semibold text-blue-100">{selectedRealmData ? selectedRealmData.maxPlayers.toLocaleString() : 0}</div>
                </div>
                <div className="rounded border border-blue-800/70 bg-blue-950/60 p-2">
                  <div className="text-blue-400">Tick</div>
                  <div className="font-semibold text-blue-100">{selectedRealmData?.tickRateMs || 0}ms</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-300">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                Realm choice becomes your active command realm and can be switched later in-game.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-blue-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-300" />
              Select Your Race
            </Label>
            <Select value={selectedRace} onValueChange={handleRaceChange}>
              <SelectTrigger className="w-full h-12 bg-blue-950/60 border-blue-700/80 text-blue-50 focus:border-blue-400 focus:ring-blue-500/40" data-testid="select-race">
                <SelectValue placeholder="Choose a race" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RACES).map((race) => (
                  <SelectItem key={race.id} value={race.id} data-testid={`option-race-${race.id}`}>
                    {race.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRaceData && (
              <div className="bg-blue-950/45 border border-blue-800/70 rounded-lg p-3">
                <p className="text-sm text-blue-200 mb-2">{selectedRaceData.description}</p>
                <div className="space-y-1">
                  {selectedRaceData.bonuses.map((bonus, i) => (
                    <div key={i} className="text-xs text-emerald-700 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      {bonus}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-blue-100 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-300" />
              Select Your Government
            </Label>
            <Select value={selectedGovernment} onValueChange={handleGovernmentChange}>
              <SelectTrigger className="w-full h-12 bg-blue-950/60 border-blue-700/80 text-blue-50 focus:border-blue-400 focus:ring-blue-500/40" data-testid="select-government">
                <SelectValue placeholder="Choose a government" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GOVERNMENTS).map((gov) => (
                  <SelectItem key={gov.id} value={gov.id} data-testid={`option-gov-${gov.id}`}>
                    {gov.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-blue-950/45 border border-blue-800/70 rounded-lg p-3">
              <p className="text-sm text-blue-200 mb-2">{selectedGovernmentData.description}</p>
              <div className="text-xs text-blue-300 mb-2">
                Ruler Title: <span className="text-blue-100 font-semibold">{selectedGovernmentData.rulerTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-emerald-700">Bonuses</div>
                  {selectedGovernmentData.bonuses.map((bonus, i) => (
                    <div key={i} className="text-xs text-emerald-700 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      {bonus}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-red-700">Penalties</div>
                  {selectedGovernmentData.penalties.map((penalty, i) => (
                    <div key={i} className="text-xs text-red-700 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      {penalty}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-blue-800/70 bg-blue-950/45 p-3">
              <p className="text-xs uppercase text-blue-400">Selected Race</p>
              <p className="text-lg font-semibold text-blue-100">{selectedRaceData.name}</p>
              <p className="text-xs text-blue-300 mt-1">Primary Doctrine: {selectedRaceData.bonuses[0]}</p>
            </div>
            <div className="rounded-lg border border-blue-800/70 bg-blue-950/45 p-3">
              <p className="text-xs uppercase text-blue-400">Selected Government</p>
              <p className="text-lg font-semibold text-blue-100">{selectedGovernmentData.name}</p>
              <p className="text-xs text-blue-300 mt-1">Ruler Title: {selectedGovernmentData.rulerTitle}</p>
            </div>
            <div className="rounded-lg border border-blue-800/70 bg-blue-950/45 p-3 md:col-span-2">
              <p className="text-xs uppercase text-blue-400">Selected Realm</p>
              <p className="text-lg font-semibold text-blue-100">{selectedRealmData?.name || "No realm selected"}</p>
              <p className="text-xs text-blue-300 mt-1">
                Command Region: {selectedRealmData?.region || "--"} · Status: {(selectedRealmData?.status || "--").toUpperCase()}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-blue-800/70 bg-blue-950/45 p-3 text-sm text-blue-200">
            <p className="font-semibold text-blue-100 mb-1">Starter Doctrine</p>
            <p>
              Deploy first into <span className="font-semibold text-blue-100">{selectedRealmData?.name || "your command realm"}</span>, launch with balanced economy and defense in the first cycle,
              then pivot into your race-government synergy strengths for faster empire scaling.
            </p>
          </div>

          {error && (
            <div className="bg-red-950/60 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm" data-testid="error-message">
              {error}
            </div>
          )}

          <Button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-orbitron tracking-widest h-14 text-lg shadow-[0_0_28px_rgba(37,99,235,0.35)] transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
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
        </CardContent>
      </Card>
    </div>
  );
}
