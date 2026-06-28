import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Users, Swords, Star, Shield, Activity, Plus, Zap, Wand2, Heart, Package } from "lucide-react";
import { generateTroopName, getRandomTitle, MILITARY_RANKS, TROOP_NAMES, WEAPONS, ARMOR, HELMETS, SHIELDS } from "@/lib/militaryData";
import { getTroopStats, getClassBuffs, getTypeBuffs, DEBUFFS, calculateCombatPower } from "@/lib/militaryAttributes";

interface Equipment {
  weapon: { name: string; rarity: string; damage: number; weight: number } | null;
  armor: { name: string; rarity: string; defense: number; weight: number; evade: number } | null;
  helmet: { name: string; rarity: string; defense: number } | null;
  shield: { name: string; rarity: string; defense: number } | null;
}

interface Troop {
  id: string;
  name: string;
  title?: string;
  troopType: "infantry" | "cavalry" | "mage" | "archer" | "support" | "siege";
  troopClass: string;
  rank: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  morale: number;
  status: "active" | "wounded" | "resting" | "dead";
  experience: number;
  equipment: Equipment;
  inventory: { item: string; quantity: number }[];
  attributes?: { strength: number; endurance: number; dexterity: number; intelligence: number; wisdom: number; charisma: number };
  buffs?: string[];
  debuffs?: string[];
  combatPower?: any;
}

const TROOP_TYPES = ["infantry", "cavalry", "mage", "archer", "support", "siege"];
const TROOP_CLASSES = ["warrior", "knight", "berserker", "paladin", "ranger", "scout", "mage", "healer", "engineer"];
const RANKS = MILITARY_RANKS;

const MOCK_TROOPS: Troop[] = [
  {
    id: "1",
    name: "Aldric Blackthorne",
    title: "Blade Master",
    troopType: "infantry",
    troopClass: "warrior",
    rank: "Knight",
    level: 5,
    health: 85,
    maxHealth: 100,
    attack: 18,
    defense: 12,
    speed: 8,
    morale: 95,
    status: "active",
    experience: 2340,
    equipment: {
      weapon: { name: "Legendary Greatsword", rarity: "rare", damage: 25, weight: 12 },
      armor: { name: "Full Plate", rarity: "rare", defense: 24, weight: 22, evade: -1 },
      helmet: { name: "Dragon Scale Helm", rarity: "rare", defense: 6 },
      shield: { name: "Knight's Shield", rarity: "rare", defense: 9 }
    },
    inventory: [
      { item: "Health Potion", quantity: 5 },
      { item: "Mana Potion", quantity: 3 },
      { item: "Iron Ore", quantity: 10 }
    ],
    attributes: getTroopStats("warrior"),
    buffs: ["Battle Cry", "Shield Wall"],
    debuffs: [],
    combatPower: calculateCombatPower("warrior", "infantry", getTroopStats("warrior"), 18, 12, 8, 5, 
      { weapon: { name: "Legendary Greatsword", rarity: "rare", damage: 25, weight: 12 }, armor: { name: "Full Plate", rarity: "rare", defense: 24, weight: 22, evade: -1 }, helmet: { name: "Dragon Scale Helm", rarity: "rare", defense: 6 }, shield: { name: "Knight's Shield", rarity: "rare", defense: 9 } })
  },
  {
    id: "2",
    name: "Seraphina Swiftarrow",
    title: "Sharpshooter",
    troopType: "archer",
    troopClass: "ranger",
    rank: "Sergeant",
    level: 3,
    health: 100,
    maxHealth: 100,
    attack: 22,
    defense: 6,
    speed: 14,
    morale: 85,
    status: "active",
    experience: 1200,
    equipment: {
      weapon: { name: "Elven Longbow", rarity: "rare", damage: 18, weight: 5 },
      armor: { name: "Elven Garb", rarity: "rare", defense: 12, weight: 4, evade: 7 },
      helmet: { name: "Steel Helm", rarity: "uncommon", defense: 4 },
      shield: null
    },
    inventory: [
      { item: "Arrow Bundle", quantity: 50 },
      { item: "Health Potion", quantity: 3 },
      { item: "Lockpick", quantity: 2 }
    ],
    attributes: getTroopStats("ranger"),
    buffs: ["Focus Fire", "Eagle Eye"],
    debuffs: ["Slow"],
    combatPower: calculateCombatPower("ranger", "archer", getTroopStats("ranger"), 22, 6, 14, 3,
      { weapon: { name: "Elven Longbow", rarity: "rare", damage: 18, weight: 5 }, armor: { name: "Elven Garb", rarity: "rare", defense: 12, weight: 4, evade: 7 }, helmet: { name: "Steel Helm", rarity: "uncommon", defense: 4 }, shield: null })
  }
];

export default function Army() {
  const [troops, setTroops] = useState<Troop[]>(MOCK_TROOPS);
  const [selectedSquadFilter, setSelectedSquadFilter] = useState("all");
  const [newTroopName, setNewTroopName] = useState("");

  const getTroopTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      infantry: "🛡️",
      cavalry: "🐴",
      mage: "✨",
      archer: "🏹",
      support: "🏥",
      siege: "🏰",
    };
    return icons[type] || "⚔️";
  };

  const getRankColor = (rank: string) => {
    const colors: { [key: string]: string } = {
      recruit: "bg-slate-200",
      soldier: "bg-blue-200",
      veteran: "bg-purple-200",
      elite: "bg-orange-200",
      commander: "bg-red-200",
      general: "bg-gold-200",
    };
    return colors[rank] || "bg-slate-200";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      wounded: "bg-yellow-100 text-yellow-800",
      resting: "bg-blue-100 text-blue-800",
      dead: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-slate-100";
  };

  const handleRecruit = async () => {
    const troopType = TROOP_TYPES[Math.floor(Math.random() * TROOP_TYPES.length)] as any;
    const troopClass = TROOP_CLASSES[Math.floor(Math.random() * TROOP_CLASSES.length)];
    
    const newTroop: Troop = {
      id: Math.random().toString(),
      name: newTroopName || generateTroopName(),
      title: getRandomTitle(troopType),
      troopType,
      troopClass,
      rank: "Squire",
      level: 1,
      health: 100,
      maxHealth: 100,
      attack: 8,
      defense: 4,
      speed: 6,
      morale: 100,
      status: "active",
      experience: 0,
      equipment: {
        weapon: WEAPONS[troopType as keyof typeof WEAPONS]?.[0] || null,
        armor: ARMOR.light[0] || null,
        helmet: HELMETS[0] || null,
        shield: ["infantry", "cavalry", "support", "siege"].includes(troopType) ? SHIELDS[0] : null
      },
      inventory: [
        { item: "Health Potion", quantity: 2 },
        { item: "Provisions", quantity: 5 }
      ]
    };

    setTroops([...troops, newTroop]);
    setNewTroopName("");
  };

  const totalTroops = troops.length;
  const activeTroops = troops.filter(t => t.status === "active").length;
  const averageMorale = Math.round(troops.reduce((sum, t) => sum + t.morale, 0) / troops.length);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Army Management</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Recruit, manage, and deploy your troops for battle.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-bold">TOTAL TROOPS</p>
                  <p className="text-3xl font-orbitron font-bold text-blue-900">{totalTroops}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-bold">ACTIVE</p>
                  <p className="text-3xl font-orbitron font-bold text-green-900">{activeTroops}</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-bold">AVG MORALE</p>
                  <p className="text-3xl font-orbitron font-bold text-purple-900">{averageMorale}%</p>
                </div>
                <Star className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-bold">POWER LEVEL</p>
                  <p className="text-3xl font-orbitron font-bold text-orange-900">{(totalTroops * 25).toLocaleString()}</p>
                </div>
                <Swords className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recruit Section */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Plus className="w-5 h-5 text-primary" /> Recruit New Troop
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter troop name (e.g., 'Ironforge the Brave')"
                value={newTroopName}
                onChange={(e) => setNewTroopName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRecruit()}
                data-testid="input-troop-name"
              />
              <Button onClick={handleRecruit} className="bg-primary hover:bg-primary/90" data-testid="button-recruit">
                Recruit
              </Button>
            </div>
            <p className="text-xs text-slate-500">Recruitment cost: 100 metal, 50 crystal</p>
          </CardContent>
        </Card>

        {/* Troops List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
            <TabsTrigger value="all">All Troops ({totalTroops})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeTroops})</TabsTrigger>
            <TabsTrigger value="squads">Squads (3)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {troops.map((troop) => (
                <Card key={troop.id} className="bg-white border-slate-200 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Identity */}
                      <div>
                        <div className="flex items-start gap-2">
                          <span className="text-2xl">{getTroopTypeIcon(troop.troopType)}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900">{troop.name}</h3>
                            {troop.title && <p className="text-xs text-primary italic">{troop.title}</p>}
                            <p className="text-xs text-slate-600 capitalize">{troop.troopType} • {troop.troopClass}</p>
                            <div className="flex gap-1 mt-1">
                              <Badge className={`${getRankColor(troop.rank)} text-xs capitalize`}>{troop.rank}</Badge>
                              <Badge className="bg-slate-100 text-xs">Lvl {troop.level}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Health & Status */}
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2">HEALTH</p>
                        <div className="bg-slate-100 rounded h-3 overflow-hidden mb-2">
                          <div 
                            className="bg-green-500 h-full transition-all"
                            style={{ width: `${(troop.health / troop.maxHealth) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600">{troop.health}/{troop.maxHealth} HP</p>
                        <Badge className={getStatusColor(troop.status)}>
                          {troop.status.charAt(0).toUpperCase() + troop.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2">STATS</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">⚔️ Attack:</span>
                            <span className="font-bold text-slate-900">{troop.attack}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">🛡️ Defense:</span>
                            <span className="font-bold text-slate-900">{troop.defense}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">💨 Speed:</span>
                            <span className="font-bold text-slate-900">{troop.speed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">😊 Morale:</span>
                            <span className="font-bold text-slate-900">{troop.morale}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Combat Power */}
                      {troop.combatPower && (
                        <div className="mb-3 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-purple-700">⚔️ COMBAT POWER</p>
                            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold">
                              {troop.combatPower.powerRating}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between bg-white px-2 py-1 rounded">
                              <span className="text-slate-600">Total:</span>
                              <span className="font-bold text-purple-700">{troop.combatPower.totalCombatPower}</span>
                            </div>
                            <div className="flex justify-between bg-white px-2 py-1 rounded">
                              <span className="text-slate-600">Attack:</span>
                              <span className="font-bold text-red-600">{troop.combatPower.attackPower}</span>
                            </div>
                            <div className="flex justify-between bg-white px-2 py-1 rounded">
                              <span className="text-slate-600">Defense:</span>
                              <span className="font-bold text-blue-600">{troop.combatPower.defensePower}</span>
                            </div>
                            <div className="flex justify-between bg-white px-2 py-1 rounded">
                              <span className="text-slate-600">Mobility:</span>
                              <span className="font-bold text-green-600">{troop.combatPower.mobilityPower}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Attributes & Effects */}
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2">ATTRIBUTES</p>
                        <div className="space-y-1 text-xs">
                          {troop.attributes && (
                            <>
                              <div className="flex justify-between text-slate-600">
                                <span>💪 STR:</span>
                                <span className="font-bold">{troop.attributes.strength}</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                <span>🛡️ END:</span>
                                <span className="font-bold">{troop.attributes.endurance}</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                <span>⚡ DEX:</span>
                                <span className="font-bold">{troop.attributes.dexterity}</span>
                              </div>
                            </>
                          )}
                        </div>
                        {(troop.buffs?.length || 0) > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <p className="text-xs font-bold text-green-600 mb-1">✅ BUFFS</p>
                            <div className="flex flex-wrap gap-1">
                              {troop.buffs?.map((buff, i) => (
                                <Badge key={i} className="bg-green-100 text-green-800 text-xs">{buff}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {(troop.debuffs?.length || 0) > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <p className="text-xs font-bold text-red-600 mb-1">⚠️ DEBUFFS</p>
                            <div className="flex flex-wrap gap-1">
                              {troop.debuffs?.map((debuff, i) => (
                                <Badge key={i} className="bg-red-100 text-red-800 text-xs">{debuff}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Inventory */}
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                          <Package className="w-3 h-3" /> INVENTORY
                        </p>
                        <div className="space-y-1 text-xs max-h-20 overflow-y-auto">
                          {troop.inventory.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-slate-600">
                              <span>{item.item}</span>
                              <span className="font-bold">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => alert("Opening equipment for " + troop.name)} data-testid={`button-manage-${troop.id}`}>
                            Equip
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => alert("Deploying " + troop.name)} data-testid={`button-deploy-${troop.id}`}>
                            Deploy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {troops.filter(t => t.status === "active").map((troop) => (
                <Card key={troop.id} className="bg-white border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTroopTypeIcon(troop.troopType)}</span>
                        <div>
                          <h3 className="font-bold text-slate-900">{troop.name}</h3>
                          <p className="text-xs text-slate-600">{troop.troopClass} - Level {troop.level}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => alert("Deploying " + troop.name)} data-testid={`button-deploy-active-${troop.id}`}>Deploy</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="squads" className="space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="w-5 h-5" /> Strike Squadron
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {troops.slice(0, 2).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span>{getTroopTypeIcon(t.troopType)} {t.name}</span>
                      <Badge>Commander</Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" onClick={() => alert("Deploying Strike Squadron!")} data-testid="button-deploy-squad">Deploy Squad</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
