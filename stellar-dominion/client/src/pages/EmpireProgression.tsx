import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { KARDASHEV_SCALE, KardashevLevel, KardashevTier, calculateProgressToNext } from "@/lib/kardashevScale";
import { useGame } from "@/lib/gameContext";
import { Crown, Zap, Factory, FlaskConical, Rocket, Shield, Globe, Ship, Building, BookOpen, Lock, Unlock, TrendingUp, Star } from "lucide-react";

const tierColors: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-700" },
  2: { bg: "bg-slate-100", border: "border-slate-400", text: "text-slate-800" },
  3: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" },
  4: { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-800" },
  5: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700" },
  6: { bg: "bg-green-100", border: "border-green-400", text: "text-green-800" },
  7: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" },
  8: { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-800" },
  9: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700" },
  10: { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-800" },
  11: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700" },
  12: { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-800" },
  13: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700" },
  14: { bg: "bg-red-100", border: "border-red-400", text: "text-red-800" },
  15: { bg: "bg-pink-50", border: "border-pink-300", text: "text-pink-700" },
  16: { bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-800" },
  17: { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700" },
  18: { bg: "bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100", border: "border-amber-500", text: "text-amber-900" }
};

function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}

function KardashevCard({ tier, currentLevel, resources }: { tier: KardashevTier; currentLevel: number; resources: { metal: number; crystal: number; deuterium: number } }) {
  const isUnlocked = currentLevel >= tier.level;
  const isCurrent = currentLevel === tier.level;
  const isNext = currentLevel + 1 === tier.level;
  const colors = tierColors[tier.level] || tierColors[1];
  
  const progress = isNext ? calculateProgressToNext(currentLevel as KardashevLevel, resources.metal, resources.crystal, resources.deuterium) : 0;
  
  return (
    <Card className={`border-2 transition-all ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''} ${isUnlocked ? colors.border : 'border-slate-200 opacity-60'} ${colors.bg}`} data-testid={`card-kardashev-${tier.level}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <Unlock className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-slate-400" />
            )}
            <Badge className={`${colors.text} ${colors.bg} border ${colors.border}`}>
              Level {tier.level}
            </Badge>
          </div>
          {isCurrent && <Badge className="bg-primary text-white">Current</Badge>}
          {isNext && <Badge className="bg-blue-500 text-white">Next</Badge>}
        </div>
        <CardTitle className={`text-lg ${colors.text}`}>{tier.name}</CardTitle>
        <p className="text-xs text-slate-600">{tier.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isNext && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progress to Next Level</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {tier.level > 1 && (
          <div className="p-2 bg-white/50 rounded border border-slate-200">
            <p className="text-xs font-bold text-slate-600 mb-1">REQUIREMENTS</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Metal:</span>
                <span className="font-mono ml-1">{formatLargeNumber(tier.requirementsMetal)}</span>
              </div>
              <div>
                <span className="text-blue-500">Crystal:</span>
                <span className="font-mono ml-1">{formatLargeNumber(tier.requirementsCrystal)}</span>
              </div>
              <div>
                <span className="text-green-500">Deuterium:</span>
                <span className="font-mono ml-1">{formatLargeNumber(tier.requirementsDeuterium)}</span>
              </div>
            </div>
            <div className="mt-1 text-xs">
              <span className="text-purple-500">Research Points:</span>
              <span className="font-mono ml-1">{formatLargeNumber(tier.requiredResearchPoints)}</span>
            </div>
          </div>
        )}
        
        <div className="p-2 bg-green-50/80 rounded border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> BONUSES
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <Factory className="w-3 h-3 text-slate-600" />
              <span>Production: +{tier.bonuses.resourceProduction}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-600" />
              <span>Energy: +{tier.bonuses.energyProduction}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Building className="w-3 h-3 text-blue-600" />
              <span>Build: +{tier.bonuses.buildSpeed}%</span>
            </div>
            <div className="flex items-center gap-1">
              <FlaskConical className="w-3 h-3 text-purple-600" />
              <span>Research: +{tier.bonuses.researchSpeed}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Rocket className="w-3 h-3 text-red-600" />
              <span>Fleet: +{tier.bonuses.fleetPower}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-600" />
              <span>Defense: +{tier.bonuses.defensePower}%</span>
            </div>
          </div>
        </div>

        <div className="p-2 bg-blue-50/80 rounded border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-1">LIMITS</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <span>🌍 Max Planets: {tier.bonuses.maxPlanets.toLocaleString()}</span>
            <span>🚀 Max Fleets: {tier.bonuses.maxFleets.toLocaleString()}</span>
            <span>🏗️ Max Buildings: {tier.bonuses.maxBuildings.toLocaleString()}</span>
            <span>🔬 Max Research: {tier.bonuses.maxResearch.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-2 bg-purple-50/80 rounded border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">EFFECTS</p>
          <div className="flex flex-wrap gap-1">
            {tier.effects.map((effect, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-white">
                {effect}
              </Badge>
            ))}
          </div>
        </div>

        {tier.unlocks.length > 0 && (
          <div className="p-2 bg-amber-50/80 rounded border border-amber-200">
            <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" /> UNLOCKS
            </p>
            <div className="flex flex-wrap gap-1">
              {tier.unlocks.map((unlock, idx) => (
                <Badge key={idx} className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                  {unlock}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function EmpireProgression() {
  const { resources } = useGame();
  const currentLevel = 1; // This would come from player state
  const kardashevTiers = Object.values(KARDASHEV_SCALE);
  const nextTier = KARDASHEV_SCALE[(Math.min(18, currentLevel + 1) as KardashevLevel)];
  const totalResources = (resources.metal || 0) + (resources.crystal || 0) + (resources.deuterium || 0);
  const readiness = nextTier
    ? Math.min(
        100,
        Math.round(
          ((resources.metal / Math.max(1, nextTier.requirementsMetal)) +
            (resources.crystal / Math.max(1, nextTier.requirementsCrystal)) +
            (resources.deuterium / Math.max(1, nextTier.requirementsDeuterium))) *
            (100 / 3)
        )
      )
    : 100;
  
  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3" data-testid="text-kardashev-title">
            <Crown className="w-10 h-10 text-amber-500" />
            Kardashev Scale
          </h1>
          <p className="text-slate-600 mt-2">Empire progression from planetary settler to supreme omnipotent</p>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-purple-100 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Current Level</p>
                <h2 className="text-3xl font-bold text-primary">{KARDASHEV_SCALE[currentLevel as KardashevLevel].name}</h2>
                <p className="text-slate-600">{KARDASHEV_SCALE[currentLevel as KardashevLevel].description}</p>
              </div>
              <div className="text-right">
                <Badge className="text-2xl px-4 py-2 bg-primary text-white">
                  Level {currentLevel}
                </Badge>
                <p className="text-xs text-slate-500 mt-2">
                  {18 - currentLevel} levels remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total Strategic Resources</p>
              <p className="text-2xl font-bold text-slate-900">{formatLargeNumber(totalResources)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">Next Tier Readiness</p>
              <p className="text-2xl font-bold text-blue-700">{readiness}%</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">Next Milestone</p>
              <p className="text-2xl font-bold text-amber-700">{nextTier?.name || 'Completed'}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kardashevTiers.map(tier => (
            <KardashevCard 
              key={tier.level} 
              tier={tier} 
              currentLevel={currentLevel}
              resources={resources}
            />
          ))}
        </div>

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle>About the Kardashev Scale</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <p>
              The Kardashev Scale is a method of measuring a civilization's level of technological advancement 
              based on the amount of energy it can harness and utilize.
            </p>
            <p>
              <strong>Levels 1-3:</strong> Planetary to System control - mastering your local environment.
            </p>
            <p>
              <strong>Levels 4-7:</strong> Sector to Galactic control - expanding influence across star systems.
            </p>
            <p>
              <strong>Levels 8-12:</strong> Multi-Galactic to Cosmic - controlling multiple galaxies and universal forces.
            </p>
            <p>
              <strong>Levels 13-18:</strong> Transcendence - becoming a god-like entity with control over reality itself.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Progression Milestone Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Early Expansion (1-4)</div>
              <div>Focus mining infrastructure, core research, and defensive baseline.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Regional Power (5-8)</div>
              <div>Scale fleets, optimize production chains, and secure strategic sectors.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Galactic Hegemony (9-13)</div>
              <div>Project force, dominate diplomacy, and establish technology supremacy.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Transcendent Endgame (14-18)</div>
              <div>Convert macro power into universal control and ultimate empire legacy.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
