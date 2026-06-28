import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Package, Gem, Factory, Zap, Search, Filter, Plus, Minus,
  Recycle, Plane, Tractor, Factory as FactoryIcon, FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import Navigation from "@/components/Navigation";

interface Material {
  id: string;
  name: string;
  type: string;
  volume: number;
  quantity?: number;
  description?: string;
  rarity?: string;
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

export default function Materials() {
  const gameState = useGame();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [rawMaterials, setRawMaterials] = useState<Material[]>([]);
  const [processedMaterials, setProcessedMaterials] = useState<Material[]>([]);
  const [planetaryCommodities, setPlanetaryCommodities] = useState<Material[]>([]);
  const [blueprints, setBlueprints] = useState<BlueprintData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterialsData();
  }, []);

  const loadMaterialsData = async () => {
    try {
      setLoading(true);

      // Load raw materials
      const rawResponse = await fetch('/api/config/materials/raw');
      const rawData = await rawResponse.json();
      setRawMaterials(Object.values(rawData));

      // Load processed materials
      const processedResponse = await fetch('/api/config/materials/processed');
      const processedData = await processedResponse.json();
      setProcessedMaterials(Object.values(processedData));

      // Load planetary commodities
      const planetaryResponse = await fetch('/api/config/materials/planetary');
      const planetaryData = await planetaryResponse.json();
      setPlanetaryCommodities(Object.values(planetaryData));

      // Load blueprints
      const blueprintsResponse = await fetch('/api/materials/blueprints');
      const blueprintsData = await blueprintsResponse.json();
      setBlueprints(blueprintsData.blueprints);

    } catch (error) {
      console.error('Failed to load materials data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity?: string) => {
    const colors = {
      common: "bg-gray-100 text-gray-800",
      uncommon: "bg-green-100 text-green-800",
      rare: "bg-blue-100 text-blue-800",
      exceptional: "bg-purple-100 text-purple-800"
    };
    return colors[rarity as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredMaterials = (materials: Material[]) => {
    return materials.filter(material => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || material.type === filterType;
      return matchesSearch && matchesType;
    });
  };

  const MaterialCard = ({ material }: { material: Material }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{material.name}</CardTitle>
          {material.rarity && (
            <Badge className={getRarityColor(material.rarity)}>
              {material.rarity}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="capitalize">{material.type.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Volume:</span>
            <span>{material.volume} m³</span>
          </div>
          {material.quantity !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{material.quantity.toLocaleString()}</span>
            </div>
          )}
          {material.description && (
            <p className="text-xs text-muted-foreground mt-2">{material.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const BlueprintCard = ({ blueprint }: { blueprint: BlueprintData }) => (
    <Card className="hover:shadow-md transition-shadow">
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
            <span className="text-muted-foreground">Production Time:</span>
            <span>{Math.floor(blueprint.production_time / 3600)}h {Math.floor((blueprint.production_time % 3600) / 60)}m</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Materials:</span>
            <div className="mt-1 space-y-1">
              {Object.entries(blueprint.materials).slice(0, 3).map(([mat, qty]) => (
                <div key={mat} className="flex justify-between text-xs">
                  <span>{mat}:</span>
                  <span>{qty}</span>
                </div>
              ))}
              {Object.keys(blueprint.materials).length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{Object.keys(blueprint.materials).length - 3} more...
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading materials...</p>
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
            <h1 className="text-3xl font-bold">Materials Management</h1>
            <p className="text-muted-foreground">Manage your industrial resources and production</p>
          </div>
          <Navigation />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="raw" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Raw Materials
            </TabsTrigger>
            <TabsTrigger value="processed" className="flex items-center gap-2">
              <Gem className="h-4 w-4" />
              Minerals
            </TabsTrigger>
            <TabsTrigger value="planetary" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Planetary
            </TabsTrigger>
            <TabsTrigger value="blueprints" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blueprints
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ore">Ores</SelectItem>
                <SelectItem value="mineral">Minerals</SelectItem>
                <SelectItem value="planetary_commodity">Commodities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Raw Materials</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rawMaterials.length}</div>
                  <p className="text-xs text-muted-foreground">Available ore types</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processed Minerals</CardTitle>
                  <Gem className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{processedMaterials.length}</div>
                  <p className="text-xs text-muted-foreground">Refined materials</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Planetary Commodities</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{planetaryCommodities.length}</div>
                  <p className="text-xs text-muted-foreground">PI products</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blueprints</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blueprints.length}</div>
                  <p className="text-xs text-muted-foreground">Manufacturing templates</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="raw" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMaterials(rawMaterials).map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="processed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMaterials(processedMaterials).map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="planetary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMaterials(planetaryCommodities).map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blueprints" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {blueprints.map((blueprint) => (
                <BlueprintCard key={blueprint.id} blueprint={blueprint} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}