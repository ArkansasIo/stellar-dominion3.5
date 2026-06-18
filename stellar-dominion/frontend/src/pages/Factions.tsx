import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FACTIONS, Faction, FactionId } from "@/lib/factionData";
import { Users, Target, Shield, Swords, Star, Globe, TrendingUp, TrendingDown, Handshake } from "lucide-react";

const alignmentColors: Record<string, string> = {
  lawful: "bg-blue-100 text-blue-700 border-blue-300",
  neutral: "bg-slate-100 text-slate-700 border-slate-300",
  chaotic: "bg-purple-100 text-purple-700 border-purple-300"
};

const moraleColors: Record<string, string> = {
  good: "bg-green-100 text-green-700 border-green-300",
  neutral: "bg-slate-100 text-slate-700 border-slate-300",
  evil: "bg-red-100 text-red-700 border-red-300"
};

const stanceColors: Record<string, string> = {
  allied: "text-green-600",
  neutral: "text-slate-500",
  hostile: "text-red-600"
};

const stanceIcons: Record<string, string> = {
  allied: "🤝",
  neutral: "😐",
  hostile: "⚔️"
};

function FactionCard({ faction }: { faction: Faction }) {
  return (
    <Card className="border-2 hover:border-primary/50 transition-colors" data-testid={`card-faction-${faction.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {faction.name}
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">{faction.ideology}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={alignmentColors[faction.alignment]}>
              {faction.alignment}
            </Badge>
            <Badge className={moraleColors[faction.morale]}>
              {faction.morale}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700">{faction.description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> HOMEWORLD
            </p>
            <p className="text-sm font-medium text-slate-900">{faction.homeworld}</p>
            <p className="text-xs text-slate-500">{faction.population} citizens</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Star className="w-3 h-3" /> STAR TYPE
            </p>
            <p className="text-sm font-medium text-slate-900">{faction.primaryStarType}</p>
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> BONUSES
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {faction.bonuses.resourceProduction && (
              <span>🔩 Production: +{Math.round((faction.bonuses.resourceProduction - 1) * 100)}%</span>
            )}
            {faction.bonuses.combatPower && (
              <span>⚔️ Combat: +{Math.round((faction.bonuses.combatPower - 1) * 100)}%</span>
            )}
            {faction.bonuses.researchSpeed && (
              <span>🔬 Research: +{Math.round((faction.bonuses.researchSpeed - 1) * 100)}%</span>
            )}
            {faction.bonuses.diplomacy && (
              <span>🤝 Diplomacy: +{Math.round((faction.bonuses.diplomacy - 1) * 100)}%</span>
            )}
            {faction.bonuses.espionage && (
              <span>🕵️ Espionage: +{Math.round((faction.bonuses.espionage - 1) * 100)}%</span>
            )}
            {faction.bonuses.fleetSpeed && (
              <span>🚀 Fleet Speed: +{Math.round((faction.bonuses.fleetSpeed - 1) * 100)}%</span>
            )}
            {faction.bonuses.diplomacyBonus && (
              <span>🏛️ Diplomacy: +{Math.round((faction.bonuses.diplomacyBonus - 1) * 100)}%</span>
            )}
          </div>
        </div>

        {faction.penalties && Object.keys(faction.penalties).length > 0 && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> PENALTIES
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-red-700">
              {faction.penalties.resourceProduction && (
                <span>🔩 Production: {Math.round((faction.penalties.resourceProduction - 1) * 100)}%</span>
              )}
              {faction.penalties.combatPower && (
                <span>⚔️ Combat: {Math.round((faction.penalties.combatPower - 1) * 100)}%</span>
              )}
              {faction.penalties.researchSpeed && (
                <span>🔬 Research: {Math.round((faction.penalties.researchSpeed - 1) * 100)}%</span>
              )}
            </div>
          </div>
        )}

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1">
            <Target className="w-3 h-3" /> GOALS
          </p>
          <ul className="text-xs text-blue-800 space-y-1">
            {faction.goals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                {goal}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1">
            <Star className="w-3 h-3" /> SPECIAL ABILITIES
          </p>
          <ul className="text-xs text-purple-800 space-y-1">
            {faction.specialAbilities.map((ability, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-400">✦</span>
                {ability}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
            <Handshake className="w-3 h-3" /> DIPLOMATIC RELATIONS
          </p>
          <div className="flex flex-wrap gap-2">
            {faction.diplomaticStances.map(stance => (
              <Badge key={stance.factionId} className={`text-xs ${stance.stance === 'allied' ? 'bg-green-100 border-green-300' : stance.stance === 'hostile' ? 'bg-red-100 border-red-300' : 'bg-slate-100 border-slate-300'}`}>
                {stanceIcons[stance.stance]} {FACTIONS[stance.factionId]?.name || stance.factionId}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-100 rounded-lg">
          <p className="text-xs font-bold text-slate-600 mb-2">CULTURE</p>
          <p className="text-xs text-slate-700">{faction.culture}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <p className="text-xs font-bold text-slate-500 w-full">TRADE GOODS:</p>
          {faction.tradingResources.map((resource, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {resource}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Factions() {
  const factionList = Object.values(FACTIONS);
  const alignments = ["all", "lawful", "neutral", "chaotic"];
  
  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3" data-testid="text-factions-title">
            <Users className="w-10 h-10 text-primary" />
            Galactic Factions
          </h1>
          <p className="text-slate-600 mt-2">12 unique civilizations competing for galactic dominance</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{factionList.filter(f => f.alignment === 'lawful').length}</p>
              <p className="text-xs text-blue-700">Lawful Factions</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{factionList.filter(f => f.alignment === 'neutral').length}</p>
              <p className="text-xs text-slate-700">Neutral Factions</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <Swords className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">{factionList.filter(f => f.alignment === 'chaotic').length}</p>
              <p className="text-xs text-purple-700">Chaotic Factions</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-900">{factionList.length}</p>
              <p className="text-xs text-amber-700">Total Factions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            {alignments.map(alignment => (
              <TabsTrigger key={alignment} value={alignment} className="capitalize" data-testid={`tab-faction-${alignment}`}>
                {alignment === "all" ? "All Factions" : alignment}
              </TabsTrigger>
            ))}
          </TabsList>

          {alignments.map(alignment => (
            <TabsContent key={alignment} value={alignment} className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {factionList
                  .filter(f => alignment === "all" || f.alignment === alignment)
                  .map(faction => (
                    <FactionCard key={faction.id} faction={faction} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </GameLayout>
  );
}
