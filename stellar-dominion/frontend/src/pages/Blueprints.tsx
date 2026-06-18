import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BookOpen, Zap, Cog, Copy, AlertCircle, Star } from "lucide-react";
import { useState } from "react";
import { BASE_BLUEPRINTS, Blueprint, calculateManufacturingCost, calculateManufacturingTime, calculateSuccessRate, createBlueprintCopy, rarityColors } from "@/lib/blueprintSystem";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";

export default function Blueprints() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>(BASE_BLUEPRINTS);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copyRuns, setCopyRuns] = useState("10");
  const [copyQuality, setCopyQuality] = useState("85");
  const [manufacturingQty, setManufacturingQty] = useState("1");

  const originals = blueprints.filter(bp => bp.isOriginal);
  const copies = blueprints.filter(bp => bp.isCopy && bp.remainingRuns > 0);
  const usedUp = blueprints.filter(bp => bp.isCopy && bp.remainingRuns === 0);

  const handleCreateCopy = () => {
    if (!selectedBlueprint) return;
    
    const newCopy = createBlueprintCopy(
      selectedBlueprint,
      parseInt(copyRuns),
      parseInt(copyQuality)
    );
    
    setBlueprints([...blueprints, newCopy]);
    setShowCopyDialog(false);
    setCopyRuns("10");
    setCopyQuality("85");
  };

  const rarityBadgeStyle = (bp: Blueprint) => {
    const rarityMap: {[key: string]: string} = {
      common: "bg-slate-100 text-slate-900 border-slate-300",
      uncommon: "bg-green-100 text-green-900 border-green-300",
      rare: "bg-blue-100 text-blue-900 border-blue-300",
      epic: "bg-purple-100 text-purple-900 border-purple-300",
      legendary: "bg-yellow-100 text-yellow-900 border-yellow-300",
      exotic: "bg-pink-100 text-pink-900 border-pink-300",
    };
    return rarityMap[bp.rarity] || rarityMap.common;
  };

  const renderBlueprint = (bp: Blueprint) => {
    const matCost = calculateManufacturingCost(bp, 1);
    const time = calculateManufacturingTime(bp, 1);
    const successRate = calculateSuccessRate(bp);

    return (
      <Card
        key={bp.id}
        className={cn(
          "cursor-pointer border-2 transition-all overflow-hidden",
          selectedBlueprint?.id === bp.id ? "border-primary shadow-lg" : "border-slate-200 hover:shadow-md"
        )}
        onClick={() => setSelectedBlueprint(bp)}
        data-testid={`blueprint-card-${bp.id}`}
        style={selectedBlueprint?.id === bp.id ? { borderColor: bp.color } : {}}
      >
        <div style={{ backgroundColor: bp.color, opacity: 0.1 }} className="h-1"></div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="font-orbitron font-bold text-slate-900 text-lg">{bp.displayName}</div>
              <div className="text-xs text-slate-600 font-rajdhani">{bp.description}</div>
            </div>
            <div className="flex flex-col gap-1">
              <Badge className={cn("capitalize font-bold", rarityBadgeStyle(bp))} data-testid={`rarity-${bp.id}`}>
                {bp.rarity}
              </Badge>
              <Badge variant="outline" className="font-bold" data-testid={`rank-${bp.id}`}>
                Rank {bp.rank}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2 rounded">
            <div>
              <span className="text-slate-600 block">Level</span>
              <span className="font-bold text-lg">{bp.level}</span>
            </div>
            <div>
              <span className="text-slate-600 block">Type</span>
              <span className="font-bold capitalize">{bp.type}</span>
            </div>
            <div>
              <span className="text-slate-600 block">Success</span>
              <span className="font-bold text-green-600">{successRate.toFixed(0)}%</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded text-xs space-y-1 border-l-2" style={{ borderColor: bp.color }}>
            <div className="font-bold text-slate-900">Materials Required:</div>
            {matCost.map((m, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-slate-600">{m.itemName}</span>
                <span className="font-mono font-bold">{m.quantity.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <span className="text-slate-600">Time</span>
              <div className="font-bold">{Math.ceil(time / 60)}m</div>
            </div>
            {bp.isCopy && (
              <div className="bg-purple-50 p-2 rounded">
                <span className="text-slate-600">Runs</span>
                <div className="font-bold">{bp.remainingRuns}/{bp.maxRuns}</div>
              </div>
            )}
            {bp.isOriginal && (
              <div className="bg-yellow-50 p-2 rounded">
                <span className="text-slate-600">Quality</span>
                <div className="font-bold text-yellow-700">100%</div>
              </div>
            )}
          </div>

          {bp.isCopy && (
            <Progress value={(bp.remainingRuns / bp.maxRuns) * 100} className="h-2" />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Blueprint Manufacturing</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">EVE Online-style blueprint system with rarity tiers, quality levels, and manufacturing mechanics.</p>
        </div>

        {selectedBlueprint && (
          <Card className="border-2 overflow-hidden" style={{ borderColor: selectedBlueprint.color }}>
            <div style={{ backgroundColor: selectedBlueprint.color, opacity: 0.15 }} className="h-2"></div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Blueprint Info */}
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase text-slate-600 font-bold mb-1">Selected Blueprint</div>
                    <div className="font-orbitron font-bold text-2xl" style={{ color: selectedBlueprint.color }}>{selectedBlueprint.displayName}</div>
                    <div className="text-sm text-slate-600 mt-2">{selectedBlueprint.name}</div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded text-sm">
                    <div className="font-bold text-slate-900 mb-2">Details:</div>
                    <p className="text-slate-700 leading-relaxed">{selectedBlueprint.detailedDescription}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white border border-slate-200 p-2 rounded">
                      <div className="text-slate-600">Rarity</div>
                      <div className="font-bold capitalize">{selectedBlueprint.rarity}</div>
                    </div>
                    <div className="bg-white border border-slate-200 p-2 rounded">
                      <div className="text-slate-600">Rank</div>
                      <div className="font-bold">{selectedBlueprint.rank}</div>
                    </div>
                    <div className="bg-white border border-slate-200 p-2 rounded">
                      <div className="text-slate-600">Level</div>
                      <div className="font-bold">{selectedBlueprint.level}</div>
                    </div>
                    <div className="bg-white border border-slate-200 p-2 rounded">
                      <div className="text-slate-600">Type</div>
                      <div className="font-bold capitalize">{selectedBlueprint.type}</div>
                    </div>
                  </div>
                </div>

                {/* Center: Manufacturing Stats */}
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase text-slate-600 font-bold mb-2">Manufacturing Stats</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Success Rate:</span>
                        <span className="font-bold text-lg text-green-600">{calculateSuccessRate(selectedBlueprint).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Time (1x):</span>
                        <span className="font-bold">{Math.ceil(calculateManufacturingTime(selectedBlueprint, 1) / 60)}m</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Material Efficiency:</span>
                        <span className="font-bold text-amber-600">{selectedBlueprint.materialEfficiency}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <div className="font-bold text-blue-900 mb-2 text-xs">Material Cost (x1):</div>
                    <div className="space-y-1 text-xs">
                      {calculateManufacturingCost(selectedBlueprint, 1).map((m, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{m.itemName}:</span>
                          <span className="font-mono font-bold">{m.quantity.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedBlueprint.isCopy && (
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="font-bold text-purple-900 mb-2 text-xs">Copy Information:</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Remaining Runs:</span>
                          <span className="font-bold">{selectedBlueprint.remainingRuns}/{selectedBlueprint.maxRuns}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality:</span>
                          <span className="font-bold text-purple-600">{selectedBlueprint.quality}%</span>
                        </div>
                        <Progress value={(selectedBlueprint.remainingRuns / selectedBlueprint.maxRuns) * 100} className="h-1 mt-2" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Manufacturing Control */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase text-slate-600 font-bold block mb-2">Quantity to Produce</label>
                    <Input
                      type="number"
                      min="1"
                      max="1000"
                      value={manufacturingQty}
                      onChange={(e) => setManufacturingQty(e.target.value)}
                      className="font-bold text-lg"
                      data-testid="input-mfg-qty"
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 p-3 rounded text-xs space-y-2">
                    <div className="font-bold text-green-900">Production Preview (x{manufacturingQty}):</div>
                    {calculateManufacturingCost(selectedBlueprint, parseInt(manufacturingQty) || 1).map((m, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{m.itemName}:</span>
                        <span className="font-mono font-bold">{m.quantity.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-green-200 mt-2 flex justify-between font-bold">
                      <span>Time:</span>
                      <span>{Math.ceil(calculateManufacturingTime(selectedBlueprint, parseInt(manufacturingQty) || 1) / 60)}m</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700" 
                      data-testid="btn-manufacture"
                    >
                      <Zap className="w-4 h-4 mr-2" /> Manufacture Now
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowCopyDialog(true)}
                      data-testid="btn-make-copy"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Create Copy
                    </Button>
                  </div>

                  {selectedBlueprint.isOriginal && (
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs text-yellow-900 flex gap-2">
                      <Star className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Original blueprints have unlimited runs and 100% quality.</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="originals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-16">
            <TabsTrigger value="originals" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <BookOpen className="w-4 h-4" /> Originals ({originals.length})
            </TabsTrigger>
            <TabsTrigger value="copies" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Copy className="w-4 h-4" /> Copies ({copies.length})
            </TabsTrigger>
            <TabsTrigger value="usedUp" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <AlertCircle className="w-4 h-4" /> Used Up ({usedUp.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="originals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {originals.map(bp => renderBlueprint(bp))}
            </div>
          </TabsContent>

          <TabsContent value="copies" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {copies.length > 0 ? (
                copies.map(bp => renderBlueprint(bp))
              ) : (
                <Card className="bg-slate-50">
                  <CardContent className="p-8 text-center text-slate-600">
                    No blueprint copies. Create one from an original blueprint.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="usedUp" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usedUp.length > 0 ? (
                usedUp.map(bp => renderBlueprint(bp))
              ) : (
                <Card className="bg-slate-50">
                  <CardContent className="p-8 text-center text-slate-600">
                    No used-up blueprints yet.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Copy Dialog */}
        <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
          <DialogContent data-testid="dialog-blueprint-copy">
            <DialogHeader>
              <DialogTitle>Create Blueprint Copy</DialogTitle>
              <DialogDescription>
                Create a limited-run copy of {selectedBlueprint?.displayName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-1 block">Number of Runs</label>
                <Input
                  type="number"
                  min="1"
                  max="300"
                  value={copyRuns}
                  onChange={(e) => setCopyRuns(e.target.value)}
                  data-testid="input-copy-runs"
                />
                <p className="text-xs text-slate-600 mt-1">How many times can this copy be manufactured</p>
              </div>

              <div>
                <label className="text-sm font-bold mb-1 block">Quality %</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={copyQuality}
                  onChange={(e) => setCopyQuality(e.target.value)}
                  data-testid="input-copy-quality"
                />
                <p className="text-xs text-slate-600 mt-1">Higher quality = better success rate (affects material cost)</p>
              </div>

              <div className="bg-slate-100 p-3 rounded text-sm space-y-2">
                <div className="font-bold mb-2">Copy Effect:</div>
                <ul className="text-xs space-y-1 text-slate-700">
                  <li>• Limited to {copyRuns} manufacturing runs</li>
                  <li>• Success rate scaled by quality factor</li>
                  <li>• Rarity may downgrade if quality &lt; 90%</li>
                  <li>• Material costs vary with quality</li>
                </ul>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCopyDialog(false)} data-testid="btn-cancel-copy">
                  Cancel
                </Button>
                <Button onClick={handleCreateCopy} className="bg-blue-600 hover:bg-blue-700" data-testid="btn-confirm-copy">
                  Create Copy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}
