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
  Factory, Clock, Package, AlertTriangle, CheckCircle, Play,
  Pause, Square, Settings, Plus, Minus, Zap, Cog
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import Navigation from "@/components/Navigation";

interface ManufacturingJob {
  blueprintId: string;
  quantity: number;
  startTime: number;
  endTime: number;
  materialsUsed: Record<string, number>;
  product: string;
  facilityId: string;
  status?: string;
}

interface BlueprintData {
  id: string;
  name: string;
  type: string;
  category: string;
  materials: Record<string, number>;
  production_time: number;
  product: string;
}

export default function Manufacturing() {
  const gameState = useGame();
  const [activeTab, setActiveTab] = useState("jobs");
  const [manufacturingJobs, setManufacturingJobs] = useState<ManufacturingJob[]>([]);
  const [blueprints, setBlueprints] = useState<BlueprintData[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintData | null>(null);
  const [quantity, setQuantity] = useState(1);
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

      // Load blueprints
      const blueprintsResponse = await fetch('/api/materials/blueprints');
      const blueprintsData = await blueprintsResponse.json();
      setBlueprints(blueprintsData.blueprints);

      // Load facilities
      const facilitiesResponse = await fetch('/api/materials/facilities');
      const facilitiesData = await facilitiesResponse.json();
      setFacilities(facilitiesData.facilities);

      await loadJobs();
    } catch (error) {
      console.error('Failed to load manufacturing data:', error);
      setError('Failed to load manufacturing data');
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/manufacturing/jobs');
      const data = await response.json();
      setManufacturingJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const startManufacturing = async () => {
    if (!selectedBlueprint) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/manufacturing/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprintId: selectedBlueprint.id,
          quantity: quantity
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const result = await response.json();
      setShowStartDialog(false);
      setSelectedBlueprint(null);
      setQuantity(1);
      await loadJobs();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const completeJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/manufacturing/complete/${jobId}`, {
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

  const calculateProgress = (job: ManufacturingJob) => {
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

  const JobCard = ({ job }: { job: ManufacturingJob }) => {
    const progress = calculateProgress(job);
    const isComplete = progress >= 100;
    const blueprint = blueprints.find(bp => bp.id === job.blueprintId);

    return (
      <Card className={`transition-all ${isComplete ? 'border-green-500 bg-green-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {blueprint?.name || job.product}
            </CardTitle>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {isComplete ? "Complete" : "In Progress"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span>{job.quantity}</span>
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
              <span className="text-muted-foreground">Materials Used:</span>
              <div className="mt-1 space-y-1">
                {Object.entries(job.materialsUsed).map(([mat, qty]) => (
                  <div key={mat} className="flex justify-between text-xs">
                    <span>{mat}:</span>
                    <span>{qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {isComplete && (
              <Button
                onClick={() => completeJob(job.startTime.toString())}
                className="w-full"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Collect Products
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const BlueprintCard = ({ blueprint }: { blueprint: BlueprintData }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            setSelectedBlueprint(blueprint);
            setShowStartDialog(true);
          }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{blueprint.name}</CardTitle>
        <Badge variant="outline">{blueprint.category}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="capitalize">{blueprint.type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time:</span>
            <span>{Math.floor(blueprint.production_time / 3600)}h {Math.floor((blueprint.production_time % 3600) / 60)}m</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Materials:</span>
            <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
              {Object.entries(blueprint.materials).map(([mat, qty]) => (
                <div key={mat} className="flex justify-between text-xs">
                  <span>{mat}:</span>
                  <span>{qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !blueprints.length) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading manufacturing data...</p>
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
            <h1 className="text-3xl font-bold">Manufacturing</h1>
            <p className="text-muted-foreground">Manage your production facilities and jobs</p>
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
              <Factory className="h-4 w-4" />
              Active Jobs ({manufacturingJobs.length})
            </TabsTrigger>
            <TabsTrigger value="blueprints" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Blueprints
            </TabsTrigger>
            <TabsTrigger value="facilities" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Facilities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {manufacturingJobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Factory className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Jobs</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start manufacturing items using blueprints in your facilities.
                  </p>
                  <Button onClick={() => setActiveTab("blueprints")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Manufacturing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {manufacturingJobs.map((job, index) => (
                  <JobCard key={`${job.startTime}-${index}`} job={job} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blueprints" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {blueprints.map((blueprint) => (
                <BlueprintCard key={blueprint.id} blueprint={blueprint} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <Card key={facility.id}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">{facility.name}</CardTitle>
                    <Badge variant="outline">{facility.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="capitalize">{facility.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span>{facility.capacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time Efficiency:</span>
                        <span>{facility.time_efficiency_bonus * 100}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Material Efficiency:</span>
                        <span>{facility.material_efficiency_bonus * 100}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Start Manufacturing Dialog */}
        <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Manufacturing</DialogTitle>
              <DialogDescription>
                Configure manufacturing job for {selectedBlueprint?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedBlueprint && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Production Time</label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {formatTime(selectedBlueprint.production_time * quantity)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Required Materials</label>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {Object.entries(selectedBlueprint.materials).map(([mat, baseQty]) => {
                      const totalQty = baseQty * quantity;
                      return (
                        <div key={mat} className="flex justify-between text-sm">
                          <span>{mat}:</span>
                          <span>{totalQty.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowStartDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={startManufacturing}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Job
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