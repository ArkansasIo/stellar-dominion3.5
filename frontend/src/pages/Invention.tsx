import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lightbulb, Clock, Package, AlertTriangle, CheckCircle, Play,
  Pause, Square, Settings, Plus, Minus, Zap, Cog, Target,
  TrendingUp, TrendingDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import Navigation from "@/components/Navigation";

interface InventionJob {
  id: string;
  blueprintId: string;
  datacores: Record<string, number>;
  decryptors: Record<string, number>;
  startTime: number;
  endTime: number;
  successChance: number;
  result?: {
    success: boolean;
    t1BlueprintId?: string;
    t2BlueprintId?: string;
  };
  status?: string;
}

interface InventionData {
  id: string;
  name: string;
  category: string;
  baseSuccessChance: number;
  requiredDatacores: Record<string, number>;
  decryptorEffects: Record<string, any>;
  invention_time: number;
}

interface DecryptorData {
  id: string;
  name: string;
  chanceBonus: number;
  timeBonus: number;
  materialBonus: number;
  rarity: string;
}

export default function Invention() {
  const gameState = useGame();
  const [activeTab, setActiveTab] = useState("jobs");
  const [inventionJobs, setInventionJobs] = useState<InventionJob[]>([]);
  const [inventions, setInventions] = useState<InventionData[]>([]);
  const [decryptors, setDecryptors] = useState<DecryptorData[]>([]);
  const [selectedInvention, setSelectedInvention] = useState<InventionData | null>(null);
  const [selectedDecryptor, setSelectedDecryptor] = useState<DecryptorData | null>(null);
  const [runs, setRuns] = useState(1);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadJobs, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load inventions
      const inventionsResponse = await fetch('/api/invention/inventions');
      const inventionsData = await inventionsResponse.json();
      setInventions(inventionsData.inventions);

      // Load decryptors
      const decryptorsResponse = await fetch('/api/invention/decryptors');
      const decryptorsData = await decryptorsResponse.json();
      setDecryptors(decryptorsData.decryptors);

      await loadJobs();
    } catch (error) {
      console.error('Failed to load invention data:', error);
      setError('Failed to load invention data');
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/invention/jobs');
      const data = await response.json();
      setInventionJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const calculateSuccessChance = (invention: InventionData, decryptor: DecryptorData | null) => {
    let chance = invention.baseSuccessChance;
    if (decryptor) {
      chance += decryptor.chanceBonus;
    }
    // Apply skills and other modifiers
    chance = Math.min(chance, 1.0); // Cap at 100%
    return chance;
  };

  const startInvention = async () => {
    if (!selectedInvention) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/invention/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventionId: selectedInvention.id,
          decryptorId: selectedDecryptor?.id,
          runs: runs
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const result = await response.json();
      setShowStartDialog(false);
      setSelectedInvention(null);
      setSelectedDecryptor(null);
      setRuns(1);
      await loadJobs();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const completeJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/invention/complete/${jobId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      await loadJobs();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const calculateProgress = (job: InventionJob) => {
    const now = Date.now() / 1000;
    const total = job.endTime - job.startTime;
    const elapsed = now - job.startTime;
    return Math.min((elapsed / total) * 100, 100);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const JobCard = ({ job }: { job: InventionJob }) => {
    const progress = calculateProgress(job);
    const isComplete = progress >= 100;
    const invention = inventions.find(inv => inv.id === job.blueprintId);

    return (
      <Card className={`transition-all ${isComplete ? 'border-green-500 bg-green-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {invention?.name || job.blueprintId}
            </CardTitle>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {isComplete ? "Complete" : "Researching"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Success Chance:</span>
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {(job.successChance * 100).toFixed(1)}%
              </span>
            </div>

            {!isComplete && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress:</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  {formatTime(job.endTime - Date.now() / 1000)} remaining
                </div>
              </div>
            )}

            <div className="text-sm">
              <span className="text-muted-foreground">Datacores Used:</span>
              <div className="mt-1 space-y-1">
                {Object.entries(job.datacores).map(([core, qty]) => (
                  <div key={core} className="flex justify-between text-xs">
                    <span>{core}:</span>
                    <span>{qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {job.decryptors && Object.keys(job.decryptors).length > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">Decryptors Used:</span>
                <div className="mt-1 space-y-1">
                  {Object.entries(job.decryptors).map(([decryptor, qty]) => (
                    <div key={decryptor} className="flex justify-between text-xs">
                      <span>{decryptor}:</span>
                      <span>{qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isComplete && job.result && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {job.result.success ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Success!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">Failed</span>
                    </>
                  )}
                </div>
                {job.result.success && (
                  <div className="text-xs text-muted-foreground">
                    {job.result.t2BlueprintId ? 'T2 Blueprint created' : 'T1 Blueprint created'}
                  </div>
                )}
              </div>
            )}

            {isComplete && (
              <Button
                onClick={() => completeJob(job.id)}
                className="w-full"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Collect Result
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const InventionCard = ({ invention }: { invention: InventionData }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            setSelectedInvention(invention);
            setShowStartDialog(true);
          }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{invention.name}</CardTitle>
        <Badge variant="outline">{invention.category}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Success:</span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {(invention.baseSuccessChance * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time:</span>
            <span>{Math.floor(invention.invention_time / 3600)}h {Math.floor((invention.invention_time % 3600) / 60)}m</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Required Datacores:</span>
            <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
              {Object.entries(invention.requiredDatacores).map(([core, qty]) => (
                <div key={core} className="flex justify-between text-xs">
                  <span>{core}:</span>
                  <span>{qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DecryptorCard = ({ decryptor }: { decryptor: DecryptorData }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{decryptor.name}</CardTitle>
        <Badge variant={decryptor.rarity === 'rare' ? "default" : "outline"}>
          {decryptor.rarity}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Chance Bonus:</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +{(decryptor.chanceBonus * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time Bonus:</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-600" />
              {decryptor.timeBonus > 0 ? '+' : ''}{(decryptor.timeBonus * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Material Bonus:</span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3 text-purple-600" />
              {decryptor.materialBonus > 0 ? '+' : ''}{(decryptor.materialBonus * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !inventions.length) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading invention data...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invention</h1>
            <p className="text-muted-foreground">Research new technologies and create T2 blueprints</p>
          </div>
          <Navigation />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Active Jobs ({inventionJobs.length})
            </TabsTrigger>
            <TabsTrigger value="inventions" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Inventions
            </TabsTrigger>
            <TabsTrigger value="decryptors" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Decryptors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {inventionJobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Jobs</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start invention jobs to research new technologies and create T2 blueprints.
                  </p>
                  <Button onClick={() => setActiveTab("inventions")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Invention
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventionJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {inventions.map((invention) => (
                <InventionCard key={invention.id} invention={invention} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="decryptors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {decryptors.map((decryptor) => (
                <DecryptorCard key={decryptor.id} decryptor={decryptor} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Start Invention Dialog */}
        <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Start Invention</DialogTitle>
              <DialogDescription>
                Configure invention job for {selectedInvention?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedInvention && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Runs</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRuns(Math.max(1, runs - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={runs}
                        onChange={(e) => setRuns(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRuns(runs + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Research Time</label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {formatTime(selectedInvention.invention_time * runs)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Decryptor (Optional)</label>
                  <Select
                    value={selectedDecryptor?.id || ""}
                    onValueChange={(value) => {
                      const decryptor = decryptors.find(d => d.id === value);
                      setSelectedDecryptor(decryptor || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select decryptor (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Decryptor</SelectItem>
                      {decryptors.map((decryptor) => (
                        <SelectItem key={decryptor.id} value={decryptor.id}>
                          {decryptor.name} (+{(decryptor.chanceBonus * 100).toFixed(1)}% chance)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Success Chance</label>
                    <div className="mt-1 text-lg font-semibold">
                      {(calculateSuccessChance(selectedInvention, selectedDecryptor) * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Estimated Cost</label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {Object.values(selectedInvention.requiredDatacores).reduce((sum, qty) => sum + qty, 0) * runs} datacores
                      {selectedDecryptor && ` + 1 ${selectedDecryptor.name}`}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Required Datacores</label>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {Object.entries(selectedInvention.requiredDatacores).map(([core, baseQty]) => {
                      const totalQty = baseQty * runs;
                      return (
                        <div key={core} className="flex justify-between text-sm">
                          <span>{core}:</span>
                          <span>{totalQty}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedDecryptor && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Decryptor Effects:</div>
                    <div className="space-y-1 text-xs">
                      <div>Chance: +{(selectedDecryptor.chanceBonus * 100).toFixed(1)}%</div>
                      <div>Time: {(selectedDecryptor.timeBonus * 100).toFixed(1)}%</div>
                      <div>Materials: {(selectedDecryptor.materialBonus * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowStartDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={startInvention}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Research
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}