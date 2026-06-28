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
  Globe, Factory, Clock, Package, AlertTriangle, CheckCircle, Play,
  Pause, Square, Settings, Plus, Minus, Zap, Cog, MapPin,
  Droplets, Leaf, Mountain, Wind
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import Navigation from "@/components/Navigation";

interface PlanetaryColony {
  id: string;
  planetId: string;
  planetName: string;
  planetType: string;
  colonyLevel: number;
  extractors: PlanetaryExtractor[];
  factories: PlanetaryFactory[];
  storage: Record<string, number>;
}

interface PlanetaryExtractor {
  id: string;
  resourceType: string;
  outputRate: number;
  cycleTime: number;
  lastCycle: number;
  status: string;
}

interface PlanetaryFactory {
  id: string;
  productType: string;
  inputResources: Record<string, number>;
  outputRate: number;
  cycleTime: number;
  lastCycle: number;
  status: string;
}

interface PlanetData {
  id: string;
  name: string;
  type: string;
  resources: Record<string, number>;
  colonyCost: number;
}

export default function PlanetaryIndustry() {
  const gameState = useGame();
  const [activeTab, setActiveTab] = useState("colonies");
  const [colonies, setColonies] = useState<PlanetaryColony[]>([]);
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [showColonyDialog, setShowColonyDialog] = useState(false);
  const [showExtractorDialog, setShowExtractorDialog] = useState(false);
  const [showFactoryDialog, setShowFactoryDialog] = useState(false);
  const [selectedColony, setSelectedColony] = useState<PlanetaryColony | null>(null);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadColonies, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load planets
      const planetsResponse = await fetch('/api/planetary/planets');
      const planetsData = await planetsResponse.json();
      setPlanets(planetsData.planets);

      await loadColonies();
    } catch (error) {
      console.error('Failed to load planetary data:', error);
      setError('Failed to load planetary data');
    } finally {
      setLoading(false);
    }
  };

  const loadColonies = async () => {
    try {
      const response = await fetch('/api/planetary/colonies');
      const data = await response.json();
      setColonies(data.colonies || []);
    } catch (error) {
      console.error('Failed to load colonies:', error);
    }
  };

  const establishColony = async () => {
    if (!selectedPlanet) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/planetary/establish-colony', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planetId: selectedPlanet.id
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const result = await response.json();
      setShowColonyDialog(false);
      setSelectedPlanet(null);
      await loadColonies();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const installExtractor = async () => {
    if (!selectedColony || !selectedResource) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/planetary/install-extractor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colonyId: selectedColony.id,
          resourceType: selectedResource
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const result = await response.json();
      setShowExtractorDialog(false);
      setSelectedColony(null);
      setSelectedResource("");
      await loadColonies();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const installFactory = async () => {
    if (!selectedColony || !selectedProduct) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/planetary/install-factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colonyId: selectedColony.id,
          productType: selectedProduct
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const result = await response.json();
      setShowFactoryDialog(false);
      setSelectedColony(null);
      setSelectedProduct("");
      await loadColonies();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const collectResources = async (colonyId: string) => {
    try {
      const response = await fetch(`/api/planetary/collect/${colonyId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      await loadColonies();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'biomass': return <Leaf className="h-4 w-4" />;
      case 'minerals': return <Mountain className="h-4 w-4" />;
      case 'energy': return <Zap className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const ColonyCard = ({ colony }: { colony: PlanetaryColony }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{colony.planetName}</CardTitle>
          <Badge variant="outline">{colony.planetType}</Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Level {colony.colonyLevel} Colony
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Extractors:</span>
              <span>{colony.extractors.length}</span>
            </div>
            <div className="space-y-1">
              {colony.extractors.slice(0, 3).map((extractor) => (
                <div key={extractor.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {getResourceIcon(extractor.resourceType)}
                    <span>{extractor.resourceType}</span>
                  </div>
                  <span>{extractor.outputRate}/cycle</span>
                </div>
              ))}
              {colony.extractors.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{colony.extractors.length - 3} more...
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Factories:</span>
              <span>{colony.factories.length}</span>
            </div>
            <div className="space-y-1">
              {colony.factories.slice(0, 3).map((factory) => (
                <div key={factory.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Factory className="h-3 w-3" />
                    <span>{factory.productType}</span>
                  </div>
                  <span>{factory.outputRate}/cycle</span>
                </div>
              ))}
              {colony.factories.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{colony.factories.length - 3} more...
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Storage:</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => collectResources(colony.id)}
              >
                Collect
              </Button>
            </div>
            <div className="space-y-1 max-h-16 overflow-y-auto">
              {Object.entries(colony.storage).map(([resource, qty]) => (
                <div key={resource} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {getResourceIcon(resource)}
                    <span>{resource}:</span>
                  </div>
                  <span>{qty.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedColony(colony);
                setShowExtractorDialog(true);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Extractor
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedColony(colony);
                setShowFactoryDialog(true);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Factory
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PlanetCard = ({ planet }: { planet: PlanetData }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            setSelectedPlanet(planet);
            setShowColonyDialog(true);
          }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{planet.name}</CardTitle>
        <Badge variant="outline">{planet.type}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Colony Cost:</span>
            <span>{planet.colonyCost.toLocaleString()} ISK</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Resources:</span>
            <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
              {Object.entries(planet.resources).map(([resource, qty]) => (
                <div key={resource} className="flex justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {getResourceIcon(resource)}
                    <span>{resource}:</span>
                  </div>
                  <span>{qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !planets.length) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading planetary data...</p>
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
            <h1 className="text-3xl font-bold">Planetary Industry</h1>
            <p className="text-muted-foreground">Manage planetary colonies and resource extraction</p>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="colonies" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Colonies ({colonies.length})
            </TabsTrigger>
            <TabsTrigger value="planets" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Available Planets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colonies" className="space-y-4">
            {colonies.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Colonies</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Establish your first planetary colony to begin resource extraction.
                  </p>
                  <Button onClick={() => setActiveTab("planets")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Establish Colony
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colonies.map((colony) => (
                  <ColonyCard key={colony.id} colony={colony} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="planets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {planets.map((planet) => (
                <PlanetCard key={planet.id} planet={planet} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Establish Colony Dialog */}
        <Dialog open={showColonyDialog} onOpenChange={setShowColonyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Establish Colony</DialogTitle>
              <DialogDescription>
                Establish a planetary colony on {selectedPlanet?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedPlanet && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Planet Type</label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {selectedPlanet.type}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Colony Cost</label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {selectedPlanet.colonyCost.toLocaleString()} ISK
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Available Resources</label>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {Object.entries(selectedPlanet.resources).map(([resource, qty]) => (
                      <div key={resource} className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {getResourceIcon(resource)}
                          <span>{resource}:</span>
                        </div>
                        <span>{qty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowColonyDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={establishColony}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-2" />
                        Establish Colony
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Install Extractor Dialog */}
        <Dialog open={showExtractorDialog} onOpenChange={setShowExtractorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Install Extractor</DialogTitle>
              <DialogDescription>
                Install a resource extractor on {selectedColony?.planetName}
              </DialogDescription>
            </DialogHeader>

            {selectedColony && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Resource Type</label>
                  <Select value={selectedResource} onValueChange={setSelectedResource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource to extract" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(selectedColony.planetType === 'terrestrial' ?
                        { water: 1, biomass: 1, minerals: 1 } :
                        { energy: 1, minerals: 1 }
                      ).map((resource) => (
                        <SelectItem key={resource} value={resource}>
                          <div className="flex items-center gap-2">
                            {getResourceIcon(resource)}
                            <span className="capitalize">{resource}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowExtractorDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={installExtractor}
                    disabled={loading || !selectedResource}
                    className="flex-1"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Install Extractor
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Install Factory Dialog */}
        <Dialog open={showFactoryDialog} onOpenChange={setShowFactoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Install Factory</DialogTitle>
              <DialogDescription>
                Install a planetary factory on {selectedColony?.planetName}
              </DialogDescription>
            </DialogHeader>

            {selectedColony && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Type</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product to manufacture" />
                    </SelectTrigger>
                    <SelectContent>
                      {['consumer_goods', 'industrial_goods', 'medical_supplies', 'processed_materials'].map((product) => (
                        <SelectItem key={product} value={product}>
                          <div className="flex items-center gap-2">
                            <Factory className="h-4 w-4" />
                            <span className="capitalize">{product.replace('_', ' ')}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowFactoryDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={installFactory}
                    disabled={loading || !selectedProduct}
                    className="flex-1"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Install Factory
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