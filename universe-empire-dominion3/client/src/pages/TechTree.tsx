import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Building, Package, Zap, Search, Flame, Shield, Users, Cpu, TrendingUp,
  Coins, Sword, Grid, Ship, Crosshair, Rocket, Anchor, Navigation,
  ShieldPlus, Target, Eye
} from "lucide-react";
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

// Warship Skill Tree System
const WARSHIP_SKILL_TREES = {
  destroyer: {
    name: "Destroyer Class",
    icon: Ship,
    description: "Fast attack ships specializing in hit-and-run tactics",
    color: "text-blue-600",
    skills: [
      { id: "d1", name: "Torpedo Mastery", tier: 1, description: "Increases torpedo damage by 15%", maxLevel: 5, currentLevel: 0, prerequisites: [] },
      { id: "d2", name: "Evasion Protocols", tier: 1, description: "Reduces incoming damage by 10%", maxLevel: 3, currentLevel: 0, prerequisites: [] },
      { id: "d3", name: "Speed Optimization", tier: 2, description: "Increases ship speed by 20%", maxLevel: 3, currentLevel: 0, prerequisites: ["d2"] },
      { id: "d4", name: "Stealth Systems", tier: 3, description: "Reduces detection range by 30%", maxLevel: 2, currentLevel: 0, prerequisites: ["d3"] },
      { id: "d5", name: "Alpha Strike", tier: 4, description: "First attack deals 50% bonus damage", maxLevel: 1, currentLevel: 0, prerequisites: ["d1", "d3"] },
    ]
  },
  cruiser: {
    name: "Cruiser Class",
    icon: Shield,
    description: "Balanced warships with versatile combat capabilities",
    color: "text-green-600",
    skills: [
      { id: "c1", name: "Armor Plating", tier: 1, description: "Increases hull strength by 20%", maxLevel: 5, currentLevel: 0, prerequisites: [] },
      { id: "c2", name: "Weapon Systems", tier: 1, description: "Increases weapon damage by 12%", maxLevel: 5, currentLevel: 0, prerequisites: [] },
      { id: "c3", name: "Shield Generator", tier: 2, description: "Boosts shield capacity by 25%", maxLevel: 3, currentLevel: 0, prerequisites: ["c1"] },
      { id: "c4", name: "Targeting Computer", tier: 2, description: "Increases accuracy by 18%", maxLevel: 3, currentLevel: 0, prerequisites: ["c2"] },
      { id: "c5", name: "Battle Tactics", tier: 3, description: "Reduces ability cooldowns by 15%", maxLevel: 2, currentLevel: 0, prerequisites: ["c3", "c4"] },
      { id: "c6", name: "Command Presence", tier: 4, description: "Fleet-wide bonus to all stats +5%", maxLevel: 1, currentLevel: 0, prerequisites: ["c5"] },
    ]
  },
  battleship: {
    name: "Battleship Class",
    icon: Sword,
    description: "Heavy capital ships with devastating firepower",
    color: "text-red-600",
    skills: [
      { id: "b1", name: "Heavy Weapons", tier: 1, description: "Increases heavy weapon damage by 25%", maxLevel: 5, currentLevel: 0, prerequisites: [] },
      { id: "b2", name: "Reinforced Hull", tier: 1, description: "Reduces all damage by 15%", maxLevel: 3, currentLevel: 0, prerequisites: [] },
      { id: "b3", name: "Siege Mode", tier: 2, description: "Stationary bonus: +40% damage", maxLevel: 2, currentLevel: 0, prerequisites: ["b1"] },
      { id: "b4", name: "Armor Piercing", tier: 3, description: "Ignores 20% of enemy armor", maxLevel: 3, currentLevel: 0, prerequisites: ["b1", "b2"] },
      { id: "b5", name: "Devastating Barrage", tier: 4, description: "Ultimate ability deals 3x damage", maxLevel: 1, currentLevel: 0, prerequisites: ["b3", "b4"] },
    ]
  },
  carrier: {
    name: "Carrier Class",
    icon: Rocket,
    description: "Support vessels deploying squadrons of fighters",
    color: "text-purple-600",
    skills: [
      { id: "ca1", name: "Fleet Training", tier: 1, description: "Fighter squadrons deal +20% damage", maxLevel: 5, currentLevel: 0, prerequisites: [] },
      { id: "ca2", name: "Hangar Bay", tier: 1, description: "Increases fighter capacity by 25%", maxLevel: 3, currentLevel: 0, prerequisites: [] },
      { id: "ca3", name: "Orbital Strike", tier: 2, description: "Launch fighters at +50% range", maxLevel: 2, currentLevel: 0, prerequisites: ["ca1"] },
      { id: "ca4", name: "Repair Drones", tier: 3, description: "Passive regeneration for all ships", maxLevel: 3, currentLevel: 0, prerequisites: ["ca2"] },
      { id: "ca5", name: "Wing Commander", tier: 4, description: "All fighters gain +30% stats", maxLevel: 1, currentLevel: 0, prerequisites: ["ca3", "ca4"] },
    ]
  },
  stealth: {
    name: "Stealth Operations",
    icon: Eye,
    description: "Covert operations and surprise attack tactics",
    color: "text-[var(--sd-text-secondary)]",
    skills: [
      { id: "s1", name: "Cloaking Device", tier: 1, description: "Ships become invisible to enemies", maxLevel: 3, currentLevel: 0, prerequisites: [] },
      { id: "s2", name: "Silent Running", tier: 1, description: "Reduces signature by 40%", maxLevel: 3, currentLevel: 0, prerequisites: [] },
      { id: "s3", name: "Ambush Tactics", tier: 2, description: "First strike deals +75% damage", maxLevel: 2, currentLevel: 0, prerequisites: ["s1"] },
      { id: "s4", name: "Electronic Warfare", tier: 3, description: "Disables enemy systems for 5s", maxLevel: 2, currentLevel: 0, prerequisites: ["s2"] },
      { id: "s5", name: "Phantom Fleet", tier: 4, description: "Create decoy fleet copies", maxLevel: 1, currentLevel: 0, prerequisites: ["s3", "s4"] },
    ]
  }
};

const WARSHIP_TECH_BRANCHES = {
  weapons: {
    name: "Weapon Systems",
    icon: Crosshair,
    color: "text-red-600",
    technologies: [
      { id: "w1", name: "Laser Arrays", level: 1, description: "Basic laser weapon systems", cost: { metal: 500, crystal: 300, deuterium: 100 }, prerequisites: [] },
      { id: "w2", name: "Plasma Cannons", level: 3, description: "High-damage plasma weaponry", cost: { metal: 2000, crystal: 1500, deuterium: 500 }, prerequisites: ["w1"] },
      { id: "w3", name: "Ion Accelerators", level: 5, description: "Shield-piercing ion weapons", cost: { metal: 8000, crystal: 5000, deuterium: 2000 }, prerequisites: ["w2"] },
      { id: "w4", name: "Particle Beams", level: 7, description: "Long-range precision weapons", cost: { metal: 25000, crystal: 15000, deuterium: 8000 }, prerequisites: ["w3"] },
      { id: "w5", name: "Quantum Torpedoes", level: 10, description: "Devastating explosive warheads", cost: { metal: 100000, crystal: 75000, deuterium: 50000 }, prerequisites: ["w4"] },
    ]
  },
  shields: {
    name: "Shield Technology",
    icon: ShieldPlus,
    color: "text-blue-600",
    technologies: [
      { id: "sh1", name: "Energy Shields", level: 1, description: "Basic deflector shield systems", cost: { metal: 400, crystal: 500, deuterium: 200 }, prerequisites: [] },
      { id: "sh2", name: "Reinforced Plating", level: 3, description: "Enhanced hull armor", cost: { metal: 1500, crystal: 1000, deuterium: 400 }, prerequisites: ["sh1"] },
      { id: "sh3", name: "Regenerative Shields", level: 5, description: "Shields regenerate over time", cost: { metal: 6000, crystal: 4000, deuterium: 1500 }, prerequisites: ["sh2"] },
      { id: "sh4", name: "Deflector Arrays", level: 7, description: "Multi-directional shield coverage", cost: { metal: 20000, crystal: 12000, deuterium: 6000 }, prerequisites: ["sh3"] },
      { id: "sh5", name: "Absorption Matrix", level: 10, description: "Convert damage to energy", cost: { metal: 80000, crystal: 60000, deuterium: 30000 }, prerequisites: ["sh4"] },
    ]
  },
  propulsion: {
    name: "Propulsion Systems",
    icon: Navigation,
    color: "text-cyan-600",
    technologies: [
      { id: "p1", name: "Ion Drives", level: 1, description: "Basic propulsion systems", cost: { metal: 300, crystal: 200, deuterium: 100 }, prerequisites: [] },
      { id: "p2", name: "Warp Drives", level: 3, description: "FTL travel capability", cost: { metal: 3000, crystal: 2000, deuterium: 1000 }, prerequisites: ["p1"] },
      { id: "p3", name: "Hyperdrive", level: 5, description: "Advanced FTL navigation", cost: { metal: 10000, crystal: 7000, deuterium: 3000 }, prerequisites: ["p2"] },
      { id: "p4", name: "Quantum Engines", level: 7, description: "Instantaneous short-range jumps", cost: { metal: 35000, crystal: 20000, deuterium: 10000 }, prerequisites: ["p3"] },
      { id: "p5", name: "Transwarp Drive", level: 10, description: "Unlimited FTL range", cost: { metal: 150000, crystal: 100000, deuterium: 50000 }, prerequisites: ["p4"] },
    ]
  },
  sensors: {
    name: "Sensor Systems",
    icon: Target,
    color: "text-amber-600",
    technologies: [
      { id: "se1", name: "Long-Range Scanners", level: 1, description: "Extended detection range", cost: { metal: 200, crystal: 400, deuterium: 100 }, prerequisites: [] },
      { id: "se2", name: "Stealth Detection", level: 3, description: "Reveal cloaked ships", cost: { metal: 1500, crystal: 2000, deuterium: 500 }, prerequisites: ["se1"] },
      { id: "se3", name: "Targeting Systems", level: 5, description: "Lock-on at +50% range", cost: { metal: 5000, crystal: 6000, deuterium: 2000 }, prerequisites: ["se2"] },
      { id: "se4", name: "Sensor Jamming", level: 7, description: "Disrupt enemy targeting", cost: { metal: 18000, crystal: 15000, deuterium: 8000 }, prerequisites: ["se3"] },
      { id: "se5", name: "Omniscience Array", level: 10, description: "Full map visibility", cost: { metal: 100000, crystal: 80000, deuterium: 40000 }, prerequisites: ["se4"] },
    ]
  }
};

const RARITY_COLORS: { [key: string]: string } = {
  common: "bg-[var(--sd-panel-bottom)] text-[var(--sd-text-primary)]",
  rare: "bg-blue-100 text-blue-900",
  epic: "bg-purple-100 text-purple-900",
  legendary: "bg-orange-100 text-orange-900",
  mythic: "bg-red-100 text-red-900",
};

const FACILITY_TYPE_COLORS: { [key: string]: string } = {
  resource: "bg-amber-100 text-amber-900",
  energy: "bg-yellow-100 text-yellow-900",
  storage: "bg-[var(--sd-panel-bottom)] text-[var(--sd-text-primary)]",
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
  const [selectedSkillTree, setSelectedSkillTree] = useState<string>("destroyer");
  const [selectedTechBranch, setSelectedTechBranch] = useState<string>("weapons");

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
    armor: "bg-[var(--sd-panel-bottom)] text-[var(--sd-text-primary)]",
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

  const totalEntries = OGAME_BUILDINGS.length + OGAME_SHIPS.length + OGAME_RESEARCH.length;
  const searchHits = activeTab === "buildings"
    ? filterBySearch(OGAME_BUILDINGS).length
    : activeTab === "ships"
    ? filterBySearch(OGAME_SHIPS).length
    : activeTab === "research"
    ? filterBySearch(OGAME_RESEARCH).length
    : totalEntries;

  return (
    <GameLayout title="Technology & Warship Systems" subtitle="Complete tech database with skill trees and progression">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/nebula.png" alt="Tech" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/research/weapons_tech.png" alt="Tech" className="w-20 h-20 rounded-xl object-cover ring-2 ring-blue-400/60 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Technology & Warship Encyclopedia</h2>
              <p className="text-blue-300 font-rajdhani text-lg">Complete tech database with skill trees, weapon systems, and progression tiers.</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[var(--sd-panel-top)] border border-[var(--sd-panel-border)] p-4 rounded-lg shadow-sm">
          <div className="flex gap-2">
            <Search className="w-5 h-5 text-[var(--sd-text-secondary)] self-center" />
            <Input
              type="text"
              placeholder="Search buildings, ships, research, or facilities..."
              className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)] text-[var(--sd-text-primary)] placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-tech-tree"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-[var(--sd-text-secondary)]">Catalog Entries</div>
              <div className="text-2xl font-bold text-[var(--sd-text-primary)]">{totalEntries}</div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-[var(--sd-text-secondary)]">Building Blueprints</div>
              <div className="text-2xl font-bold text-amber-700">{OGAME_BUILDINGS.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-[var(--sd-text-secondary)]">Ship Blueprints</div>
              <div className="text-2xl font-bold text-green-700">{OGAME_SHIPS.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-[var(--sd-text-secondary)]">Search Hits (Active Tab)</div>
              <div className="text-2xl font-bold text-blue-700">{searchHits}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
          <CardHeader>
            <CardTitle className="text-base">Encyclopedia Usage Guide</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-[var(--sd-text-secondary)]">
            <div className="rounded border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">Use tab filters first, then narrow by search term for fast blueprint discovery.</div>
            <div className="rounded border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">Compare resource cost columns to identify cheapest progression branches.</div>
            <div className="rounded border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">Cross-reference facilities and progression tabs before committing upgrade routes.</div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-[var(--sd-panel-top)] border border-[var(--sd-panel-border)] h-14 shadow-sm overflow-x-auto">
            <TabsTrigger value="buildings" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">Buildings</span>
            </TabsTrigger>
            <TabsTrigger value="ships" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Ships</span>
            </TabsTrigger>
            <TabsTrigger value="research" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Research</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Facilities</span>
            </TabsTrigger>
            <TabsTrigger value="progression" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progression</span>
            </TabsTrigger>
            <TabsTrigger value="warship-skills" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Ship className="w-4 h-4" />
              <span className="hidden sm:inline">Warship Skills</span>
            </TabsTrigger>
            <TabsTrigger value="warship-tech" className="font-orbitron text-xs flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Crosshair className="w-4 h-4" />
              <span className="hidden sm:inline">Warship Tech</span>
            </TabsTrigger>
          </TabsList>

          {/* Buildings Tab */}
          <TabsContent value="buildings" className="mt-6">
            <div className="bg-[var(--sd-panel-top)] border border-[var(--sd-panel-border)] rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--sd-panel-bottom)] border-[var(--sd-panel-border)] hover:bg-[var(--sd-panel-bottom)]">
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Name</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Category</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Metal</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Crystal</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Deuterium</TableHead>
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
                        className="border-slate-100 hover:bg-[var(--sd-panel-bottom)] transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(building.id)}
                        data-testid={`building-row-${building.id}`}
                      >
                        <TableCell className="font-semibold text-[var(--sd-text-primary)]">{building.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[building.category] || "bg-[var(--sd-panel-bottom)]"}>
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
            <div className="bg-[var(--sd-panel-top)] border border-[var(--sd-panel-border)] rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--sd-panel-bottom)] border-[var(--sd-panel-border)] hover:bg-[var(--sd-panel-bottom)]">
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Ship Name</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Class</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Metal</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Crystal</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Deuterium</TableHead>
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
                        className="border-slate-100 hover:bg-[var(--sd-panel-bottom)] transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(ship.id)}
                        data-testid={`ship-row-${ship.id}`}
                      >
                        <TableCell className="font-semibold text-[var(--sd-text-primary)]">{ship.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[ship.class] || "bg-[var(--sd-panel-bottom)]"}>
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
            <div className="bg-[var(--sd-panel-top)] border border-[var(--sd-panel-border)] rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--sd-panel-bottom)] border-[var(--sd-panel-border)] hover:bg-[var(--sd-panel-bottom)]">
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Technology</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Field</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Metal</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Crystal</TableHead>
                    <TableHead className="text-[var(--sd-text-secondary)] font-bold">Deuterium</TableHead>
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
                        className="border-slate-100 hover:bg-[var(--sd-panel-bottom)] transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(research.id)}
                        data-testid={`research-row-${research.id}`}
                      >
                        <TableCell className="font-semibold text-[var(--sd-text-primary)]">{research.name}</TableCell>
                        <TableCell>
                          <Badge className={categoryColors[research.field] || "bg-[var(--sd-panel-bottom)]"}>
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
                    <Card key={key} className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)] hover:shadow-lg transition-shadow">
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
                            <span className="text-[var(--sd-text-secondary)]">Rarity Distribution:</span>
                          </div>
                          <div className="flex gap-1">
                            <Badge className="bg-[var(--sd-panel-bottom)] text-[var(--sd-text-primary)] text-xs">Common</Badge>
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
              <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
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
              <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
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
                      <Card key={milestone.level} className="bg-[var(--sd-panel-bottom)] border-slate-100">
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
              <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
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
                        <TableRow className="bg-[var(--sd-panel-bottom)]">
                          <TableHead className="text-[var(--sd-text-secondary)] font-bold">Formation</TableHead>
                          <TableHead className="text-[var(--sd-text-secondary)] font-bold">Flange Bonus</TableHead>
                          <TableHead className="text-[var(--sd-text-secondary)] font-bold">Offense</TableHead>
                          <TableHead className="text-[var(--sd-text-secondary)] font-bold">Defense</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {COMBAT_FORMATIONS.map((formation) => (
                          <TableRow key={formation.name} className="border-slate-100 hover:bg-[var(--sd-panel-bottom)]">
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
              <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
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
                    <Card className="bg-[var(--sd-panel-bottom)] border-slate-100">
                      <CardContent className="pt-4 text-center space-y-2">
                        <p className="text-2xl font-bold text-[var(--sd-text-secondary)]">🪙</p>
                        <p className="font-bold font-rajdhani">Silver</p>
                        <p className="text-xs text-[var(--sd-text-secondary)]">Basic currency for small trades and upgrades</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-100">
                      <CardContent className="pt-4 text-center space-y-2">
                        <p className="text-2xl font-bold text-yellow-700">⭐</p>
                        <p className="font-bold font-rajdhani">Gold</p>
                        <p className="text-xs text-[var(--sd-text-secondary)]">Premium currency for valuable transactions</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-100">
                      <CardContent className="pt-4 text-center space-y-2">
                        <p className="text-2xl font-bold text-purple-700">💎</p>
                        <p className="font-bold font-rajdhani">Platinum</p>
                        <p className="text-xs text-[var(--sd-text-secondary)]">Ultra-rare currency for exclusive items</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Warship Skill Tree Tab */}
          <TabsContent value="warship-skills" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center gap-2 text-2xl">
                    <Ship className="w-6 h-6 text-blue-600" />
                    Warship Skill Tree System
                  </CardTitle>
                  <CardDescription className="text-base">
                    Specialize your fleet with unique skill trees for each warship class. Unlock powerful abilities and combat bonuses.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Skill Tree Selector */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(WARSHIP_SKILL_TREES).map(([key, tree]) => {
                  const Icon = tree.icon;
                  return (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all hover:shadow-lg ${selectedSkillTree === key ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedSkillTree(key)}
                    >
                      <CardContent className="pt-6 text-center space-y-2">
                        <Icon className={`w-8 h-8 mx-auto ${tree.color}`} />
                        <div className="font-bold font-rajdhani">{tree.name}</div>
                        <div className="text-xs text-muted-foreground">{tree.skills.length} Skills</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Selected Skill Tree */}
              {selectedSkillTree && (
                <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const tree = WARSHIP_SKILL_TREES[selectedSkillTree as keyof typeof WARSHIP_SKILL_TREES];
                        const Icon = tree.icon;
                        return <Icon className={`w-6 h-6 ${tree.color}`} />;
                      })()}
                      <div>
                        <CardTitle>{WARSHIP_SKILL_TREES[selectedSkillTree as keyof typeof WARSHIP_SKILL_TREES].name}</CardTitle>
                        <CardDescription>{WARSHIP_SKILL_TREES[selectedSkillTree as keyof typeof WARSHIP_SKILL_TREES].description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {WARSHIP_SKILL_TREES[selectedSkillTree as keyof typeof WARSHIP_SKILL_TREES].skills.map((skill) => (
                        <div key={skill.id} className="bg-[var(--sd-panel-bottom)] rounded-lg p-4 border border-[var(--sd-panel-border)]">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[var(--sd-text-primary)]">{skill.name}</span>
                                <Badge variant="outline" className="text-xs">Tier {skill.tier}</Badge>
                              </div>
                              <p className="text-xs text-[var(--sd-text-secondary)] mt-1">{skill.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-mono font-bold text-primary">Lv. {skill.currentLevel}/{skill.maxLevel}</div>
                            </div>
                          </div>
                          <Progress value={(skill.currentLevel / skill.maxLevel) * 100} className="h-2" />
                          {skill.prerequisites.length > 0 && (
                            <div className="mt-2 text-xs text-[var(--sd-text-secondary)]">
                              Requires: {skill.prerequisites.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Warship Tech Tab */}
          <TabsContent value="warship-tech" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center gap-2 text-2xl">
                    <Crosshair className="w-6 h-6 text-red-600" />
                    Warship Technology Tree
                  </CardTitle>
                  <CardDescription className="text-base">
                    Research and develop advanced warship technologies across four specialized branches.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Tech Branch Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(WARSHIP_TECH_BRANCHES).map(([key, branch]) => {
                  const Icon = branch.icon;
                  return (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all hover:shadow-lg ${selectedTechBranch === key ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedTechBranch(key)}
                    >
                      <CardContent className="pt-6 text-center space-y-2">
                        <Icon className={`w-8 h-8 mx-auto ${branch.color}`} />
                        <div className="font-bold font-rajdhani">{branch.name}</div>
                        <div className="text-xs text-muted-foreground">{branch.technologies.length} Technologies</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Selected Tech Branch */}
              {selectedTechBranch && (
                <Card className="bg-[var(--sd-panel-top)] border-[var(--sd-panel-border)]">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const branch = WARSHIP_TECH_BRANCHES[selectedTechBranch as keyof typeof WARSHIP_TECH_BRANCHES];
                        const Icon = branch.icon;
                        return <Icon className={`w-6 h-6 ${branch.color}`} />;
                      })()}
                      <div>
                        <CardTitle>{WARSHIP_TECH_BRANCHES[selectedTechBranch as keyof typeof WARSHIP_TECH_BRANCHES].name}</CardTitle>
                        <CardDescription>Research technologies to enhance your warship capabilities</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {WARSHIP_TECH_BRANCHES[selectedTechBranch as keyof typeof WARSHIP_TECH_BRANCHES].technologies.map((tech) => (
                        <div key={tech.id} className="bg-[var(--sd-panel-bottom)] rounded-lg p-4 border border-[var(--sd-panel-border)]">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-[var(--sd-text-primary)]">{tech.name}</span>
                                <Badge className="bg-blue-100 text-blue-900">Level {tech.level}</Badge>
                              </div>
                              <p className="text-xs text-[var(--sd-text-secondary)]">{tech.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-3 text-xs">
                              <span className="text-amber-600 font-mono">⚙️ {tech.cost.metal}</span>
                              <span className="text-blue-600 font-mono">💎 {tech.cost.crystal}</span>
                              <span className="text-green-600 font-mono">🧪 {tech.cost.deuterium}</span>
                            </div>
                            {tech.prerequisites.length > 0 && (
                              <div className="text-xs text-[var(--sd-text-secondary)]">
                                Requires: {tech.prerequisites.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}