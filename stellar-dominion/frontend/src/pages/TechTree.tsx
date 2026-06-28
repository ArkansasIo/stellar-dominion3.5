import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building, Package, Zap, Search, Flame, Shield, Users, Cpu, TrendingUp, Coins, Sword, Grid } from "lucide-react";
import { useState } from "react";
import { OGAME_BUILDINGS } from "@/lib/ogameBuildings";
import { OGAME_SHIPS } from "@/lib/ogameShips";
import { OGAME_RESEARCH } from "@/lib/ogameResearch";
import { cn } from "@/lib/utils";

// Import facility configs
const TIER_CONFIG = {
  maxTier: 21,
  tiers: [
    { tier: 1, name: "Novice", multiplier: 1.0 },
    { tier: 5, name: "Expert", multiplier: 1.5 },
    { tier: 10, name: "Mythic", multiplier: 2.7 },
    { tier: 15, name: "Divine", multiplier: 5.0 },
    { tier: 21, name: "Absolute", multiplier: 10.0 },
  ]
};

const FACILITY_TYPES = {
  resource: { name: "Resource Production", count: 40, icon: Flame },
  energy: { name: "Energy Production", count: 30, icon: Zap },
  storage: { name: "Storage", count: 15, icon: Package },
  military: { name: "Military", count: 25, icon: Sword },
  research: { name: "Research", count: 20, icon: Cpu },
  civilian: { name: "Civilian", count: 15, icon: Users },
  special: { name: "Special/Orbital", count: 15, icon: Grid },
};

const COMBAT_FORMATIONS = [
  { name: "Balanced", bonus: 1.0, offense: 1.0, defense: 1.0 },
  { name: "Aggressive", bonus: 1.5, offense: 1.4, defense: 0.8 },
  { name: "Defensive", bonus: 0.7, offense: 0.7, defense: 1.5 },
  { name: "Flanking", bonus: 1.8, offense: 1.8, defense: 0.6 },
  { name: "Pincer", bonus: 2.0, offense: 2.0, defense: 0.7 },
  { name: "Circle", bonus: 1.2, offense: 1.0, defense: 1.2 },
  { name: "Wedge", bonus: 1.6, offense: 1.6, defense: 0.9 },
];

const RARITY_COLORS: { [key: string]: string } = {
  common: "bg-slate-100 text-slate-900",
  rare: "bg-blue-100 text-blue-900",
  epic: "bg-purple-100 text-purple-900",
  legendary: "bg-orange-100 text-orange-900",
  mythic: "bg-red-100 text-red-900",
};

const FACILITY_TYPE_COLORS: { [key: string]: string } = {
  resource: "bg-amber-100 text-amber-900",
  energy: "bg-yellow-100 text-yellow-900",
  storage: "bg-slate-100 text-slate-900",
  military: "bg-red-100 text-red-900",
  research: "bg-blue-100 text-blue-900",
  civilian: "bg-green-100 text-green-900",
  special: "bg-purple-100 text-purple-900",
  infrastructure: "bg-cyan-100 text-cyan-900",
  orbital: "bg-indigo-100 text-indigo-900",
};

export default function TechTree() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("buildings");

  const categoryColors: { [key: string]: string } = {
    resource: "bg-amber-100 text-amber-900",
    production: "bg-orange-100 text-orange-900",
    defense: "bg-red-100 text-red-900",
    utility: "bg-blue-100 text-blue-900",
    fighter: "bg-green-100 text-green-900",
    cargo: "bg-sky-100 text-sky-900",
    support: "bg-purple-100 text-purple-900",
    probe: "bg-pink-100 text-pink-900",
    capital: "bg-red-100 text-red-900",
    special: "bg-violet-100 text-violet-900",
    drive: "bg-cyan-100 text-cyan-900",
    weapon: "bg-rose-100 text-rose-900",
    shield: "bg-indigo-100 text-indigo-900",
    armor: "bg-slate-100 text-slate-900",
    energy: "bg-yellow-100 text-yellow-900",
    computer: "bg-blue-100 text-blue-900",
    esp: "bg-purple-100 text-purple-900",
    upgrade: "bg-lime-100 text-lime-900",
  };

  const filterBySearch = (items: any[]) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Technology & Blueprint Encyclopedia</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Complete tech database with 120+ facilities, combat systems, and progression tiers</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-slate-400 self-center" />
            <Input
              type="text"
              placeholder="Search buildings, ships, research, or facilities..."
              className="bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-tech-tree"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 h-14 shadow-sm overflow-x-auto">
            <TabsTrigger value="buildings" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">Buildings</span>
              <span className="sm:hidden text-xs">({OGAME_BUILDINGS.length})</span>
            </TabsTrigger>
            <TabsTrigger value="ships" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Ships</span>
              <span className="sm:hidden text-xs">({OGAME_SHIPS.length})</span>
            </TabsTrigger>
            <TabsTrigger value="research" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Research</span>
              <span className="sm:hidden text-xs">({OGAME_RESEARCH.length})</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Facilities</span>
              <span className="sm:hidden text-xs">(120+)</span>
            </TabsTrigger>
            <TabsTrigger value="progression" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progression</span>
            </TabsTrigger>
          </TabsList>

          {/* Buildings Tab */}
          <TabsContent value="buildings" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-slate-700 font-bold">Name</TableHead>
                    <TableHead className="text-slate-700 font-bold">Category</TableHead>
                    <TableHead className="text-slate-700 font-bold">Metal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Crystal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Deuterium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterBySearch(OGAME_BUILDINGS).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No buildings found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterBySearch(OGAME_BUILDINGS).map(building => (
                      <TableRow
                        key={building.id}
                        className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(building.id)}
                        data-testid={`building-row-${building.id}`}
                      >
                        <TableCell className="font-semibold text-slate-900">{building.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[building.category] || "bg-slate-100"}>
                            {building.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-amber-600 font-bold">{building.cost.metal}</TableCell>
                        <TableCell className="font-mono text-blue-600 font-bold">{building.cost.crystal}</TableCell>
                        <TableCell className="font-mono text-green-600 font-bold">{building.cost.deuterium}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Ships Tab */}
          <TabsContent value="ships" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-slate-700 font-bold">Ship Name</TableHead>
                    <TableHead className="text-slate-700 font-bold">Class</TableHead>
                    <TableHead className="text-slate-700 font-bold">Metal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Crystal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Deuterium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterBySearch(OGAME_SHIPS).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No ships found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterBySearch(OGAME_SHIPS).map(ship => (
                      <TableRow
                        key={ship.id}
                        className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(ship.id)}
                        data-testid={`ship-row-${ship.id}`}
                      >
                        <TableCell className="font-semibold text-slate-900">{ship.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[ship.class] || "bg-slate-100"}>
                            {ship.class}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-amber-600 font-bold">{ship.cost.metal}</TableCell>
                        <TableCell className="font-mono text-blue-600 font-bold">{ship.cost.crystal}</TableCell>
                        <TableCell className="font-mono text-green-600 font-bold">{ship.cost.deuterium}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-slate-700 font-bold">Technology</TableHead>
                    <TableHead className="text-slate-700 font-bold">Field</TableHead>
                    <TableHead className="text-slate-700 font-bold">Metal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Crystal</TableHead>
                    <TableHead className="text-slate-700 font-bold">Deuterium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterBySearch(OGAME_RESEARCH).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No research found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterBySearch(OGAME_RESEARCH).map(research => (
                      <TableRow
                        key={research.id}
                        className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(research.id)}
                        data-testid={`research-row-${research.id}`}
                      >
                        <TableCell className="font-semibold text-slate-900">{research.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[research.field] || "bg-slate-100"}>
                            {research.field}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-amber-600 font-bold">{research.cost.metal}</TableCell>
                        <TableCell className="font-mono text-blue-600 font-bold">{research.cost.crystal}</TableCell>
                        <TableCell className="font-mono text-green-600 font-bold">{research.cost.deuterium}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(FACILITY_TYPES).map(([key, type]) => {
                  const Icon = type.icon;
                  return (
                    <Card key={key} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-orbitron text-lg flex items-center gap-2">
                            <Icon className="w-5 h-5" />
                            {type.name}
                          </CardTitle>
                          <Badge className="bg-primary/10 text-primary font-bold">{type.count}</Badge>
                        </div>
                        <CardDescription className="text-xs">
                          5 rarity classes × 8+ variants
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Rarity Distribution:</span>
                          </div>
                          <div className="flex gap-1">
                            <Badge className="bg-slate-100 text-slate-900 text-xs">Common</Badge>
                            <Badge className="bg-blue-100 text-blue-900 text-xs">Rare</Badge>
                            <Badge className="bg-purple-100 text-purple-900 text-xs">Epic</Badge>
                            <Badge className="bg-orange-100 text-orange-900 text-xs">Legendary</Badge>
                            <Badge className="bg-red-100 text-red-900 text-xs">Mythic</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Progression Tab */}
          <TabsContent value="progression" className="mt-6">
            <div className="space-y-6">
              {/* Tier System */}
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tier Progression System (1-21)
                  </CardTitle>
                  <CardDescription>
                    Advance through 21 tiers to unlock powerful bonuses and multipliers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {TIER_CONFIG.tiers.map((tier) => (
                      <div key={tier.tier} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold font-rajdhani">
                            Tier {tier.tier}: {tier.name}
                          </span>
                          <Badge className="bg-primary/10 text-primary">
                            {(tier.multiplier * 100).toFixed(0)}% Boost
                          </Badge>
                        </div>
                        <Progress value={(tier.tier / 21) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Empire Leveling */}
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    Empire Leveling (1-999)
                  </CardTitle>
                  <CardDescription>
                    Build your empire through experience and unlock milestone bonuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { level: 10, name: "Rising Power", bonus: "1.1x" },
                      { level: 25, name: "Growing Influence", bonus: "1.25x" },
                      { level: 50, name: "Established Empire", bonus: "1.5x" },
                      { level: 100, name: "Galactic Force", bonus: "2x" },
                      { level: 250, name: "Legendary Empire", bonus: "3x" },
                      { level: 999, name: "Infinite Dominion", bonus: "10x" },
                    ].map((milestone) => (
                      <Card key={milestone.level} className="bg-slate-50 border-slate-100">
                        <CardContent className="pt-4">
                          <div className="text-center space-y-2">
                            <p className="font-bold text-primary text-lg">Level {milestone.level}</p>
                            <p className="text-sm font-rajdhani">{milestone.name}</p>
                            <Badge className="bg-amber-100 text-amber-900">{milestone.bonus}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Combat Formations */}
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center gap-2">
                    <Sword className="w-5 h-5" />
                    Combat Formations & Flange System
                  </CardTitle>
                  <CardDescription>
                    Choose formations for tactical advantages in battle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="text-slate-700 font-bold">Formation</TableHead>
                          <TableHead className="text-slate-700 font-bold">Flange Bonus</TableHead>
                          <TableHead className="text-slate-700 font-bold">Offense</TableHead>
                          <TableHead className="text-slate-700 font-bold">Defense</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {COMBAT_FORMATIONS.map((formation) => (
                          <TableRow key={formation.name} className="border-slate-100 hover:bg-slate-50">
                            <TableCell className="font-semibold">{formation.name}</TableCell>
                            <TableCell>
                              <Badge className="bg-orange-100 text-orange-900 font-bold">
                                {(formation.bonus * 100).toFixed(0)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-red-100 text-red-900">
                                {(formation.offense * 100).toFixed(0)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-900">
                                {(formation.defense * 100).toFixed(0)}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Currency System */}
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    3-Tier Currency Economy
                  </CardTitle>
                  <CardDescription>
                    Trade and manage three tiers of currency across your empire
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-slate-50 border-slate-100">
                      <CardContent className="pt-4 text-center space-y-2">
                        <p className="text-2xl font-bold text-slate-700">🪙</p>
                        <p className="font-bold font-rajdhani">Silver</p>
                        <p className="text-xs text-slate-600">Basic currency for small trades and upgrades</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-100">
                      <CardContent className="pt-4 text-center space-y-2">
                        <p className="text-2xl font-bold text-yellow-700">⭐</p>
                        <p className="font-bold font-rajdhani">Gold</p>
                        <p className="text-xs text-slate-600">Premium currency for valuable transactions</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-100">
                      <CardContent className="pt-4 text-center space-y-2">
                        <p className="text-2xl font-bold text-purple-700">💎</p>
                        <p className="font-bold font-rajdhani">Platinum</p>
                        <p className="text-xs text-slate-600">Ultra-rare currency for exclusive items</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
