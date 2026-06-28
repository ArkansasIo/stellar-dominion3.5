import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Target, Gem, TreePine, Zap, Lock, CheckCircle2, Plus, Minus, Sparkles,
} from "lucide-react";
import {
  SKILL_GEMS,
  SUPPORT_GEMS,
  SKILL_TREES,
  type SkillGem,
  type SupportGem,
  type SkillTree,
  type SkillTreeNode,
  type SkillBookState,
  createDefaultSkillBookState,
} from "@shared/config/commander/skills/commanderSkillTreeSystem";
import { cn } from "@/lib/utils";

interface CommanderSkillsProps {
  commander: any;
  skillBookState?: SkillBookState | null;
  onAllocateNode?: (nodeId: string, treeId: string) => void;
  onEquipGem?: (gemId: string, slot: number) => void;
}

function getGemColorClasses(color: string) {
  switch (color) {
    case "red": return "bg-red-100 border-red-300 text-red-700";
    case "blue": return "bg-blue-100 border-blue-300 text-blue-700";
    case "green": return "bg-green-100 border-green-300 text-green-700";
    case "white": return "bg-slate-100 border-slate-300 text-slate-700";
    case "prismatic": return "bg-gradient-to-r from-red-100 via-blue-100 to-green-100 border-purple-300 text-purple-700";
    default: return "bg-slate-100 border-slate-300 text-slate-700";
  }
}

function GemCard({ gem, equipped, onEquip }: { gem: SkillGem; equipped?: boolean; onEquip?: () => void }) {
  return (
    <div className={cn(
      "p-3 rounded border transition-all",
      equipped ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300" : "bg-white border-slate-200 hover:border-blue-300"
    )}>
      <div className="flex items-start gap-2">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg border shrink-0", getGemColorClasses(gem.color))}>
          {gem.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-slate-900">{gem.name}</span>
            <Badge variant="outline" className="text-[9px] px-1 py-0">Lv.{gem.level}</Badge>
            {equipped && <Badge className="text-[9px] px-1 py-0 bg-amber-100 text-amber-700 ml-auto">Equipped</Badge>}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">{gem.description}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {gem.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-[8px] px-1 py-0">{tag}</Badge>
            ))}
          </div>
          {gem.damage && (
            <div className="text-[10px] text-red-600 mt-1">
              DMG: {gem.damage.base} {gem.damage.type} · {gem.damage.projectiles} proj · AoE {gem.damage.aoe}
            </div>
          )}
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
            <span>Mana: {gem.manaCost}</span>
            <span>CD: {gem.cooldown}s</span>
            <span>Slots: {gem.supportSlots}</span>
          </div>
        </div>
        {onEquip && !equipped && (
          <Button size="sm" variant="outline" className="h-7 text-[10px] shrink-0" onClick={onEquip}>
            Equip
          </Button>
        )}
      </div>
    </div>
  );
}

function SupportGemCard({ gem }: { gem: SupportGem }) {
  return (
    <div className="p-2 rounded border border-slate-200 bg-white">
      <div className="flex items-center gap-2">
        <div className={cn("w-7 h-7 rounded flex items-center justify-center text-sm border shrink-0", getGemColorClasses(gem.color))}>
          {gem.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[10px] text-slate-900">{gem.name}</div>
          <div className="text-[9px] text-slate-500 truncate">{gem.description}</div>
        </div>
        <Badge variant="outline" className="text-[8px] px-1 py-0">Lv.{gem.level}</Badge>
      </div>
    </div>
  );
}

function SkillTreeNodeComponent({
  node,
  allocated,
  canAllocate,
  onAllocate,
}: {
  node: SkillTreeNode;
  allocated: boolean;
  canAllocate: boolean;
  onAllocate?: () => void;
}) {
  const typeStyles: Record<string, string> = {
    normal: "w-10 h-10 rounded-full",
    notable: "w-12 h-12 rounded-lg",
    keystone: "w-14 h-14 rounded-xl",
    ascendancy: "w-12 h-12 rounded-lg border-dashed",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 cursor-pointer transition-all",
        canAllocate && !allocated && "hover:scale-110"
      )}
      onClick={canAllocate && !allocated ? onAllocate : undefined}
    >
      <div
        className={cn(
          typeStyles[node.type] || typeStyles.normal,
          "flex items-center justify-center text-lg border-2 transition-all",
          allocated
            ? "bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-400 shadow-md"
            : canAllocate
              ? "bg-white border-blue-300 hover:border-blue-500 hover:shadow"
              : "bg-slate-50 border-slate-200 opacity-50"
        )}
        style={allocated ? { borderColor: node.color } : {}}
      >
        {allocated ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : node.icon}
      </div>
      <div className="text-center">
        <div className={cn(
          "text-[9px] font-bold leading-tight max-w-[64px]",
          allocated ? "text-emerald-700" : "text-slate-600"
        )}>
          {node.name}
        </div>
        <div className="text-[8px] text-slate-400">{node.description}</div>
      </div>
    </div>
  );
}

export default function CommanderSkills({
  commander,
  skillBookState,
  onAllocateNode,
  onEquipGem,
}: CommanderSkillsProps) {
  const [activeTab, setActiveTab] = useState("gems");
  const [selectedTreeId, setSelectedTreeId] = useState<string>("tree_warrior");

  const state = skillBookState || createDefaultSkillBookState();
  const selectedTree = SKILL_TREES.find(t => t.id === selectedTreeId) || SKILL_TREES[0];

  const commanderLevel = commander?.stats?.level || 1;
  const availablePoints = state.skillPoints;

  return (
    <div className="space-y-4">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Target className="w-5 h-5 text-green-600" /> Commander Skill System
          </CardTitle>
          <CardDescription>
            Equip active skill gems with support modifiers, and allocate passive skill tree points for deep build customization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase">Skill Points</div>
              <div className="text-2xl font-orbitron font-bold text-green-600">{availablePoints}</div>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase">Gems Owned</div>
              <div className="text-2xl font-orbitron font-bold text-blue-600">{state.gems.length || SKILL_GEMS.length}</div>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase">Tree Nodes</div>
              <div className="text-2xl font-orbitron font-bold text-purple-600">{state.totalAllocated}</div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-100 h-10">
              <TabsTrigger value="gems" className="text-xs gap-1"><Gem className="w-3 h-3" /> Skill Gems</TabsTrigger>
              <TabsTrigger value="supports" className="text-xs gap-1"><Sparkles className="w-3 h-3" /> Support Gems</TabsTrigger>
              <TabsTrigger value="tree" className="text-xs gap-1"><TreePine className="w-3 h-3" /> Skill Tree</TabsTrigger>
              <TabsTrigger value="loadout" className="text-xs gap-1"><Zap className="w-3 h-3" /> Loadout</TabsTrigger>
            </TabsList>

            <TabsContent value="gems" className="mt-4">
              <div className="flex gap-2 mb-3 flex-wrap">
                {["warrior", "mage", "ranger", "rogue", "engineer", "paladin"].map(cls => (
                  <Badge key={cls} variant="outline" className="capitalize cursor-pointer hover:bg-slate-100">{cls}</Badge>
                ))}
              </div>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-4">
                  {SKILL_GEMS.map(gem => (
                    <GemCard
                      key={gem.id}
                      gem={gem}
                      equipped={gem.equipped}
                      onEquip={() => onEquipGem?.(gem.id, 0)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="supports" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-4">
                  {SUPPORT_GEMS.map(gem => (
                    <SupportGemCard key={gem.id} gem={gem} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tree" className="mt-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                {SKILL_TREES.map(tree => (
                  <Button
                    key={tree.id}
                    size="sm"
                    variant={selectedTreeId === tree.id ? "default" : "outline"}
                    onClick={() => setSelectedTreeId(tree.id)}
                    className="gap-1.5"
                    style={selectedTreeId === tree.id ? { backgroundColor: tree.color } : {}}
                  >
                    {tree.icon} {tree.name}
                  </Button>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{selectedTree.name}</div>
                    <div className="text-xs text-slate-500">{selectedTree.description}</div>
                  </div>
                  <Badge variant="outline">{selectedTree.allocatedPoints}/{selectedTree.maxPoints} points</Badge>
                </div>

                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-8 items-end min-w-max">
                    {selectedTree.nodes.map(node => (
                      <SkillTreeNodeComponent
                        key={node.id}
                        node={node}
                        allocated={node.allocated}
                        canAllocate={availablePoints >= node.cost}
                        onAllocate={() => onAllocateNode?.(node.id, selectedTree.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300" /> Normal
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300" /> Notable
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-lg bg-red-100 border border-red-400" /> Keystone
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300 border-dashed" /> Ascendancy
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="loadout" className="mt-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                  <div className="font-bold text-sm text-slate-900 mb-3">Active Skill Slots</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {state.loadouts[0]?.slots.map(slot => (
                      <div key={slot.id} className="p-3 rounded border border-dashed border-slate-300 bg-slate-50">
                        <div className="text-[10px] text-slate-400 uppercase mb-1">{slot.name}</div>
                        {slot.activeGem ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{slot.activeGem.icon}</span>
                            <div>
                              <div className="font-bold text-xs">{slot.activeGem.name}</div>
                              <div className="text-[9px] text-slate-500">Lv.{slot.activeGem.level}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">Empty — equip a skill gem</div>
                        )}
                        {slot.supportGems.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {slot.supportGems.map((sg, i) => (
                              <div key={i} className={cn("w-5 h-5 rounded flex items-center justify-center text-[8px] border", getGemColorClasses(sg.color))}>
                                {sg.icon}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
