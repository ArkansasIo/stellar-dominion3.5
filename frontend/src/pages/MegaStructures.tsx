import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MEGA_STRUCTURE_CATEGORIES,
  calculateConstructionCost,
  getMegaStructuresByCategory,
} from "@/lib/megaStructures";
import { useGame } from "@/lib/gameContext";
import { Zap, Users, Building2, TrendingUp } from "lucide-react";

export default function MegaStructures() {
  const { constructMegastructure } = useGame();

  const getCategoryColor = (category: string) => {
    const colors = {
      infrastructure: "bg-blue-50 border-blue-200",
      production: "bg-orange-50 border-orange-200",
      research: "bg-purple-50 border-purple-200",
      defense: "bg-red-50 border-red-200",
      mobility: "bg-cyan-50 border-cyan-200",
      exotic: "bg-pink-50 border-pink-200",
      superweapon: "bg-amber-50 border-amber-200",
    };
    return colors[category as keyof typeof colors] || "bg-slate-50 border-slate-200";
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      infrastructure: "bg-blue-100 text-blue-800",
      production: "bg-orange-100 text-orange-800",
      research: "bg-purple-100 text-purple-800",
      defense: "bg-red-100 text-red-800",
      mobility: "bg-cyan-100 text-cyan-800",
      exotic: "bg-pink-100 text-pink-800",
      superweapon: "bg-amber-100 text-amber-800",
    };
    return colors[category as keyof typeof colors] || "bg-slate-100 text-slate-800";
  };

  const handleConstruct = (structure: any) => {
    constructMegastructure(structure.templateId, structure.name, structure.stats.constructionTime);
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Megastructures</h1>
          <p className="text-slate-600 mt-2">Cosmic engineering marvels that reshape civilization itself</p>
        </div>

        {/* Tabs for different categories */}
        <Tabs defaultValue={MEGA_STRUCTURE_CATEGORIES[0]?.id || "infrastructure"} className="w-full">
          <TabsList className="bg-white border border-slate-200 h-auto flex-wrap w-full justify-start gap-2 p-2">
            {MEGA_STRUCTURE_CATEGORIES.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="capitalize">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {MEGA_STRUCTURE_CATEGORIES.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <p className="text-sm text-slate-600">{category.description}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {getMegaStructuresByCategory(category.id)
                  .map(structure => {
                    const cost = calculateConstructionCost(structure);
                    return (
                      <Card key={structure.id} className={`border-2 ${getCategoryColor(category.id)}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-5xl">{structure.icon}</span>
                              <div>
                                <CardTitle className="text-slate-900">{structure.name}</CardTitle>
                                <p className="text-xs text-slate-600 mt-1">{structure.type.replace(/_/g, " ").toUpperCase()}</p>
                              </div>
                            </div>
                            <Badge className={getCategoryBadgeColor(category.id)}>
                              Tier {structure.tier}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Description */}
                          <p className="text-sm text-slate-700">{structure.description}</p>

                          {/* Special Ability */}
                          <div className="p-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded">
                            <p className="text-xs font-bold text-amber-900 mb-1">⭐ SPECIAL ABILITY</p>
                            <p className="text-xs text-amber-800">{structure.specialAbility}</p>
                          </div>

                          {/* Main Stats */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <Zap className="w-4 h-4 text-yellow-600" />
                              <div>
                                <p className="text-xs text-slate-600">Energy Output</p>
                                <p className="font-bold text-slate-900">{structure.stats.energyOutput.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-slate-600">Production</p>
                                <p className="font-bold text-slate-900">+{structure.stats.productionBonus}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs text-slate-600">Research</p>
                                <p className="font-bold text-slate-900">+{structure.stats.researchBonus}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <Users className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="text-xs text-slate-600">Population</p>
                                <p className="font-bold text-slate-900">{(structure.stats.populationCapacity / 1000000).toFixed(1)}M</p>
                              </div>
                            </div>
                          </div>

                          {/* Sub Stats */}
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-600">ATTRIBUTE BREAKDOWN</p>
                            <div className="grid grid-cols-2 gap-2">
                              {structure.subStats.map((stat: any, idx: number) => (
                                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-900">{stat.icon} {stat.name}</span>
                                    <span className="text-xs font-bold text-primary">{stat.value}</span>
                                  </div>
                                  <div className="bg-white rounded h-2 overflow-hidden">
                                    <div 
                                      className="bg-gradient-to-r from-primary to-purple-500 h-full"
                                      style={{ width: `${stat.value}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1">{stat.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Maintenance Cost */}
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs font-bold text-red-900 mb-2">⚙️ MAINTENANCE COST (per cycle)</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><span className="text-red-700">Metal:</span> <span className="font-bold text-red-900">{structure.stats.maintenanceCost.metal}</span></div>
                              <div><span className="text-red-700">Crystal:</span> <span className="font-bold text-red-900">{structure.stats.maintenanceCost.crystal}</span></div>
                              <div><span className="text-red-700">Deuterium:</span> <span className="font-bold text-red-900">{structure.stats.maintenanceCost.deuterium}</span></div>
                              <div><span className="text-red-700">Energy:</span> <span className="font-bold text-red-900">{structure.stats.maintenanceCost.energy}</span></div>
                            </div>
                          </div>

                          {/* Construction Cost */}
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-xs font-bold text-green-900 mb-2">📦 CONSTRUCTION COST</p>
                            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                              <div><span className="text-green-700">Metal:</span> <span className="font-bold text-green-900">{cost.metal}</span></div>
                              <div><span className="text-green-700">Crystal:</span> <span className="font-bold text-green-900">{cost.crystal}</span></div>
                              <div><span className="text-green-700">Deuterium:</span> <span className="font-bold text-green-900">{cost.deuterium}</span></div>
                            </div>
                            <p className="text-xs text-green-700">⏱️ Construction Time: {structure.stats.constructionTime.toLocaleString()} turns</p>
                          </div>

                          {/* Requirements */}
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
                            <div>
                              <p className="text-xs font-bold text-blue-900 mb-1">📚 RESEARCH REQUIRED</p>
                              <div className="flex flex-wrap gap-1">
                                {structure.researchRequired.map((tech: any, idx: number) => (
                                  <Badge key={idx} className="bg-blue-200 text-blue-800 text-xs">{tech}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-blue-900 mb-1">🏗️ BUILDING REQUIREMENTS</p>
                              {structure.buildingRequirements.map((req: any, idx: number) => (
                                <div key={idx} className="text-xs text-blue-800">
                                  {req.name} Level {req.level}+
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleConstruct(structure)} data-testid={`button-construct-${structure.id}`}>
                            Begin Construction
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Megastructure Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>Levels 1-999:</strong> Every megastructure scales continuously with level-based progression.
            </p>
            <p>
              <strong>Tiers 1-99:</strong> Tier upgrades unlock large multiplier jumps and strategic breakpoints.
            </p>
            <p>
              <strong>Category Systems:</strong> Infrastructure, production, research, defense, mobility, exotic, and superweapon paths.
            </p>
            <p>
              <strong>Unified Scaling:</strong> Construction and upgrade costs now follow shared progression formulas for all categories.
            </p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
