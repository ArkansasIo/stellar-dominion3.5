import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Rocket, Users, Landmark, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { RACES, RaceId, CLASSES } from "@/lib/commanderTypes";
import { GOVERNMENTS, GovernmentId } from "@/lib/governmentData";
import { MENU_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

export default function AccountSetup() {
  const { completeSetup, isLoading, commander, government, logout } = useGame();
  const [, setLocation] = useLocation();
  const [selectedRace, setSelectedRace] = useState<RaceId>("terran");
  const [selectedGovernment, setSelectedGovernment] = useState<GovernmentId>("democracy");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const handleBack = () => {
    logout();
  };

  const isDataLoaded = commander && government && commander.race && government.type;

  useEffect(() => {
    if (isDataLoaded && !hasUserInteracted) {
      setSelectedRace(commander.race);
      setSelectedGovernment(government.type);
    }
  }, [commander?.race, government?.type, hasUserInteracted, isDataLoaded]);

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
    
    const updatedCommander = {
      ...commander,
      race: selectedRace
    };
    
    const govBase = GOVERNMENTS[selectedGovernment].baseStats;
    
    const updatedGovernment = {
      ...government,
      type: selectedGovernment,
      stats: {
        stability: govBase.stability,
        publicSupport: 50,
        efficiency: govBase.efficiency,
        militaryReadiness: govBase.military,
        corruption: 10
      }
    };
    
    try {
      await completeSetup(updatedCommander, updatedGovernment);
      setLocation("/");
    } catch (err) {
      setError("Failed to save your selections. Please try again.");
      setIsSubmitting(false);
    }
  };

  const selectedRaceData = RACES[selectedRace];
  const selectedGovernmentData = GOVERNMENTS[selectedGovernment];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-slate-700 hover:text-slate-900 z-20 transition-colors"
        data-testid="button-back-from-setup"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      
      <Card className="w-full max-w-lg bg-white border border-slate-300 text-slate-900 relative z-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center pb-2 border-b border-slate-300">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
            <img
              src={MENU_ASSETS.NAVIGATION.EMPIRE.path}
              alt="empire setup"
              className="w-10 h-10 object-contain"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
            />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-slate-900">EMPIRE SETUP</CardTitle>
          <CardDescription className="text-slate-700 font-rajdhani text-lg font-medium mt-2">✨ Choose your race and government to begin your conquest</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Race Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" />
              Select Your Race
            </Label>
            <Select value={selectedRace} onValueChange={handleRaceChange}>
              <SelectTrigger className="w-full h-12 bg-white border-slate-300 text-slate-900 focus:border-slate-600 focus:ring-slate-600" data-testid="select-race">
                <SelectValue placeholder="Choose a race" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RACES).map(race => (
                  <SelectItem key={race.id} value={race.id} data-testid={`option-race-${race.id}`}>
                    {race.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Race Details */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-3">
              <p className="text-sm text-slate-700 mb-2">{RACES[selectedRace].description}</p>
              <div className="space-y-1">
                {RACES[selectedRace].bonuses.map((bonus, i) => (
                  <div key={i} className="text-xs text-emerald-700 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    {bonus}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Government Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-slate-700" />
              Select Your Government
            </Label>
            <Select value={selectedGovernment} onValueChange={handleGovernmentChange}>
              <SelectTrigger className="w-full h-12 bg-white border-slate-300 text-slate-900 focus:border-slate-600 focus:ring-slate-600" data-testid="select-government">
                <SelectValue placeholder="Choose a government" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GOVERNMENTS).map(gov => (
                  <SelectItem key={gov.id} value={gov.id} data-testid={`option-gov-${gov.id}`}>
                    {gov.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Government Details */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-3">
              <p className="text-sm text-slate-700 mb-2">{GOVERNMENTS[selectedGovernment].description}</p>
              <div className="text-xs text-slate-600 mb-2">Ruler Title: <span className="text-slate-800 font-semibold">{GOVERNMENTS[selectedGovernment].rulerTitle}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-emerald-700">✓ Bonuses</div>
                  {GOVERNMENTS[selectedGovernment].bonuses.map((bonus, i) => (
                    <div key={i} className="text-xs text-emerald-700 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      {bonus}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-red-700">✗ Penalties</div>
                  {GOVERNMENTS[selectedGovernment].penalties.map((penalty, i) => (
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
            <div className="rounded-lg border border-slate-300 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Selected Race</p>
              <p className="text-lg font-semibold text-slate-900">{selectedRaceData.name}</p>
              <p className="text-xs text-slate-600 mt-1">Primary Doctrine: {selectedRaceData.bonuses[0]}</p>
            </div>
            <div className="rounded-lg border border-slate-300 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Selected Government</p>
              <p className="text-lg font-semibold text-slate-900">{selectedGovernmentData.name}</p>
              <p className="text-xs text-slate-600 mt-1">Ruler Title: {selectedGovernmentData.rulerTitle}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900 mb-1">Starter Doctrine</p>
            <p>Launch with balanced economy and defense in the first cycle, then pivot into your race-government synergy strengths for faster empire scaling.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm" data-testid="error-message">
              {error}
            </div>
          )}

          <Button 
            onClick={handleComplete} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-widest h-14 text-lg shadow-lg transition-all hover:shadow-xl"
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
