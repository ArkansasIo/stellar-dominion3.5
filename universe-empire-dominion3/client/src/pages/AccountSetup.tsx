import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Rocket, Users, Landmark, Loader2, ArrowLeft } from "lucide-react";
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

export default function AccountSetup() {
  const {
    completeSetup,
    isLoading,
    commander,
    government,
    planetName,
    logout,
    setOnboardingStep,
  } = useGame();
  const [, setLocation] = useLocation();
  const [selectedRace, setSelectedRace] = useState<RaceId>(DEFAULT_RACE);
  const [selectedGovernment, setSelectedGovernment] = useState<GovernmentId>(DEFAULT_GOVERNMENT);
  const [empireName, setEmpireName] = useState("Stellar Dominion");
  const [homeWorldName, setHomeWorldName] = useState("New Colony");
  const [selectedEmpireSlot, setSelectedEmpireSlot] = useState<number | null>(null);
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

  const handleRaceChange = (race: RaceId) => {
    setHasUserInteracted(true);
    setSelectedRace(race);
  };

  const handleGovernmentChange = (gov: GovernmentId) => {
    setHasUserInteracted(true);
    setSelectedGovernment(gov);
  };

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
      empireSlot: selectedEmpireSlot || 1,
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

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-slate-400 hover:text-white z-20 transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <div className="text-sm text-slate-500 absolute top-4 right-4 font-mono">
        Final Step — Empire Identity
      </div>

      <Card className="w-full max-w-2xl bg-slate-900/80 border-slate-700 text-white relative z-10 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center pb-2 border-b border-slate-700">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
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
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-white">EMPIRE IDENTITY</CardTitle>
          <CardDescription className="text-slate-400 font-rajdhani text-lg font-medium mt-2">
            Choose your race, government, and empire name.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-slate-400" />
              Empire Identity
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empire-name" className="text-xs uppercase tracking-wider text-slate-500">Empire Name</Label>
                <input
                  id="empire-name"
                  value={empireName}
                  onChange={(event) => {
                    setHasUserInteracted(true);
                    setEmpireName(event.target.value);
                  }}
                  className="w-full h-12 rounded-md border border-slate-600 bg-slate-800 px-3 text-white focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="Enter empire name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeworld-name" className="text-xs uppercase tracking-wider text-slate-500">Home World Name</Label>
                <input
                  id="homeworld-name"
                  value={homeWorldName}
                  onChange={(event) => {
                    setHasUserInteracted(true);
                    setHomeWorldName(event.target.value);
                  }}
                  className="w-full h-12 rounded-md border border-slate-600 bg-slate-800 px-3 text-white focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="Enter home world name"
                />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-400">
              Your empire name becomes the banner identity for diplomacy and rankings, while your home world name becomes your starting capital planet.
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              Select Your Race
            </Label>
            <Select value={selectedRace} onValueChange={handleRaceChange}>
              <SelectTrigger className="w-full h-12 bg-slate-800 border-slate-600 text-white focus:border-cyan-500" data-testid="select-race">
                <SelectValue placeholder="Choose a race" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Object.values(RACES).map((race) => (
                  <SelectItem key={race.id} value={race.id} data-testid={`option-race-${race.id}`}>
                    {race.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRaceData && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <p className="text-sm text-slate-300 mb-2">{selectedRaceData.description}</p>
                <div className="space-y-1">
                  {selectedRaceData.bonuses.map((bonus, i) => (
                    <div key={i} className="text-xs text-emerald-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {bonus}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-slate-400" />
              Select Your Government
            </Label>
            <Select value={selectedGovernment} onValueChange={handleGovernmentChange}>
              <SelectTrigger className="w-full h-12 bg-slate-800 border-slate-600 text-white focus:border-cyan-500" data-testid="select-government">
                <SelectValue placeholder="Choose a government" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Object.values(GOVERNMENTS).map((gov) => (
                  <SelectItem key={gov.id} value={gov.id} data-testid={`option-gov-${gov.id}`}>
                    {gov.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <p className="text-sm text-slate-300 mb-2">{selectedGovernmentData.description}</p>
              <div className="text-xs text-slate-400 mb-2">
                Ruler Title: <span className="text-white font-semibold">{selectedGovernmentData.rulerTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-emerald-400">Bonuses</div>
                  {selectedGovernmentData.bonuses.map((bonus, i) => (
                    <div key={i} className="text-xs text-emerald-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {bonus}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-red-400">Penalties</div>
                  {selectedGovernmentData.penalties.map((penalty, i) => (
                    <div key={i} className="text-xs text-red-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {penalty}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
              <p className="text-xs uppercase text-slate-500">Selected Race</p>
              <p className="text-lg font-semibold text-white">{selectedRaceData.name}</p>
              <p className="text-xs text-slate-400 mt-1">Primary Doctrine: {selectedRaceData.bonuses[0]}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
              <p className="text-xs uppercase text-slate-500">Selected Government</p>
              <p className="text-lg font-semibold text-white">{selectedGovernmentData.name}</p>
              <p className="text-xs text-slate-400 mt-1">Ruler Title: {selectedGovernmentData.rulerTitle}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-400">
            <p className="font-semibold text-white mb-1">Starter Doctrine</p>
            <p>
              Deploy with balanced economy and defense in the first cycle,
              then pivot into your race-government synergy strengths for faster empire scaling.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm" data-testid="error-message">
              {error}
            </div>
          )}

          <Button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-orbitron tracking-widest h-14 text-lg shadow-lg transition-all hover:shadow-xl"
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
