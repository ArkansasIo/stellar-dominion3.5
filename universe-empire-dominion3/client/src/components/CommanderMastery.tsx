import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sword, Shield, FlaskConical, Crown, Star, Zap, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import {
  COMMANDER_MASTERY_CLASSES,
  MASTERY_TIERS,
  MASTERY_DOMAINS,
  STAT_META,
  type CommanderMasteryClass,
  type MasterySubClass,
  type MasteryAbility,
  type StatKey,
} from "@shared/config/commander/mastery/commanderMasteryConfig";
import { cn } from "@/lib/utils";

interface CommanderMasteryProps {
  commander: any;
  masteryData?: {
    selectedClassId: string | null;
    masteryLevel: number;
    masteryXp: number;
    xpToNext: number;
    selectedSubClassId: string | null;
    unlockedAbilities: string[];
    allocatedSubTypes: string[];
  } | null;
  onSelectClass?: (classId: string) => void;
  onSelectSubClass?: (subClassId: string) => void;
  onAllocateSubType?: (subTypeId: string) => void;
}

function getMasteryTier(level: number) {
  for (let i = MASTERY_TIERS.length - 1; i >= 0; i--) {
    if (level >= MASTERY_TIERS[i].minLevel) return MASTERY_TIERS[i];
  }
  return MASTERY_TIERS[0];
}

function getDomainIcon(domain: string) {
  switch (domain) {
    case "Warfare": return <Sword className="w-4 h-4" />;
    case "Science": return <FlaskConical className="w-4 h-4" />;
    case "Economy": return <Star className="w-4 h-4" />;
    case "Leadership": return <Crown className="w-4 h-4" />;
    default: return <Zap className="w-4 h-4" />;
  }
}

function getDomainColor(domain: string) {
  return MASTERY_DOMAINS[domain as keyof typeof MASTERY_DOMAINS]?.color || "#6b7280";
}

function AbilityCard({ ability, unlocked }: { ability: MasteryAbility; unlocked: boolean }) {
  return (
    <div className={cn(
      "p-3 rounded border transition-all",
      unlocked
        ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
        : "bg-slate-50 border-slate-200 opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0",
          unlocked ? "bg-emerald-100" : "bg-slate-100"
        )}>
          {unlocked ? ability.icon : <Lock className="w-4 h-4 text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">{ability.name}</span>
            <Badge variant={ability.type === "active" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
              {ability.type}
            </Badge>
            {!unlocked && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Lv.{ability.unlockLevel}</Badge>}
          </div>
          <p className="text-xs text-slate-600 mt-1">{ability.description}</p>
          {ability.cooldown && <p className="text-[10px] text-slate-400 mt-1">Cooldown: {ability.cooldown}s</p>}
          {unlocked && <p className="text-[10px] italic text-emerald-600 mt-1">{ability.flavorText}</p>}
        </div>
      </div>
    </div>
  );
}

function SubTypeCard({
  subType,
  allocated,
  onAllocate,
}: {
  subType: { id: string; name: string; description: string; bonusStat: StatKey; bonusValue: number; icon: string };
  allocated: boolean;
  onAllocate?: () => void;
}) {
  const meta = STAT_META[subType.bonusStat];
  return (
    <div className={cn(
      "p-3 rounded border transition-all cursor-pointer hover:shadow-sm",
      allocated
        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        : "bg-white border-slate-200 hover:border-blue-300"
    )} onClick={onAllocate}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{subType.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-xs text-slate-900">{subType.name}</div>
          <div className="text-[10px] text-slate-500 truncate">{subType.description}</div>
        </div>
        <div className="text-right shrink-0">
          <div className={cn("text-xs font-bold", meta?.color || "text-slate-700")}>
            +{subType.bonusValue} {meta?.label || subType.bonusStat}
          </div>
          {allocated && <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto" />}
        </div>
      </div>
    </div>
  );
}

export default function CommanderMastery({
  commander,
  masteryData,
  onSelectClass,
  onSelectSubClass,
  onAllocateSubType,
}: CommanderMasteryProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("Warfare");
  const [selectedMasteryClass, setSelectedMasteryClass] = useState<CommanderMasteryClass | null>(null);
  const [selectedSubClass, setSelectedSubClassState] = useState<MasterySubClass | null>(null);

  const currentLevel = masteryData?.masteryLevel || 1;
  const currentTier = getMasteryTier(currentLevel);
  const xpPercent = masteryData ? (masteryData.masteryXp / masteryData.xpToNext) * 100 : 0;
  const selectedClassId = masteryData?.selectedClassId || null;

  const domainClasses = COMMANDER_MASTERY_CLASSES.filter(c => c.domain === selectedDomain);

  const handleSelectClass = (cls: CommanderMasteryClass) => {
    setSelectedMasteryClass(cls);
    setSelectedSubClassState(null);
    onSelectClass?.(cls.id);
  };

  const handleSelectSubClass = (sc: MasterySubClass) => {
    setSelectedSubClassState(sc);
    onSelectSubClass?.(sc.id);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Star className="w-5 h-5 text-amber-500" /> Commander Mastery
          </CardTitle>
          <CardDescription>
            Specialize your commander across 18 mastery classes in 4 domains. Each class offers unique abilities, sub-classes, and deep progression.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 uppercase">Mastery Level</div>
              <div className="text-2xl font-orbitron font-bold text-slate-900">{currentLevel}</div>
              <Progress value={xpPercent} className="h-1.5 mt-1" />
              <div className="text-[10px] text-slate-400 mt-1">{masteryData?.masteryXp || 0} / {masteryData?.xpToNext || 1000} XP</div>
            </div>
            <div className="p-3 rounded border border-slate-200" style={{ borderColor: currentTier.color + "40", backgroundColor: currentTier.color + "10" }}>
              <div className="text-xs uppercase" style={{ color: currentTier.color }}>Current Tier</div>
              <div className="text-lg font-orbitron font-bold" style={{ color: currentTier.color }}>{currentTier.name}</div>
              <div className="text-[10px] text-slate-400">Lv.{currentTier.minLevel}-{currentTier.maxLevel}</div>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 uppercase">Active Class</div>
              <div className="text-sm font-bold text-slate-900">
                {selectedClassId ? COMMANDER_MASTERY_CLASSES.find(c => c.id === selectedClassId)?.name || "Unknown" : "None Selected"}
              </div>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 uppercase">Unlocked Abilities</div>
              <div className="text-2xl font-orbitron font-bold text-slate-900">{masteryData?.unlockedAbilities?.length || 0}</div>
            </div>
          </div>

          <Separator className="my-4" />

          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="bg-slate-100 h-10">
              <TabsTrigger value="browse" className="text-xs">Browse Classes</TabsTrigger>
              <TabsTrigger value="current" className="text-xs">Current Progress</TabsTrigger>
              <TabsTrigger value="abilities" className="text-xs">Abilities</TabsTrigger>
              <TabsTrigger value="milestones" className="text-xs">Milestones</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="mt-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                {Object.entries(MASTERY_DOMAINS).map(([domain, meta]) => (
                  <Button
                    key={domain}
                    size="sm"
                    variant={selectedDomain === domain ? "default" : "outline"}
                    onClick={() => { setSelectedDomain(domain); setSelectedMasteryClass(null); setSelectedSubClassState(null); }}
                    className="gap-1.5"
                    style={selectedDomain === domain ? { backgroundColor: meta.color, borderColor: meta.color } : {}}
                  >
                    {getDomainIcon(domain)} {domain}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {domainClasses.map(cls => (
                  <div
                    key={cls.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                      selectedMasteryClass?.id === cls.id
                        ? "border-blue-400 bg-blue-50"
                        : selectedClassId === cls.id
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                    onClick={() => handleSelectClass(cls)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{cls.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{cls.name}</div>
                        <div className="text-[10px] text-slate-500">{cls.domain}</div>
                      </div>
                      {selectedClassId === cls.id && <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-[10px]">Active</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 italic mb-2">{cls.tagline}</p>
                    <div className="flex flex-wrap gap-1">
                      {cls.primaryStats.slice(0, 3).map(stat => (
                        <Badge key={stat} variant="outline" className="text-[9px] px-1 py-0">
                          {STAT_META[stat]?.icon} {STAT_META[stat]?.label}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">
                      {cls.subClasses.length} sub-classes · {cls.abilities.length} abilities · {cls.maxMasteryLevel} max level
                    </div>
                  </div>
                ))}
              </div>

              {selectedMasteryClass && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  <div className="p-4 rounded-lg border-2" style={{ borderColor: selectedMasteryClass.color + "40", backgroundColor: selectedMasteryClass.color + "08" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{selectedMasteryClass.icon}</span>
                      <div>
                        <h3 className="text-lg font-orbitron font-bold text-slate-900">{selectedMasteryClass.name}</h3>
                        <p className="text-sm text-slate-600">{selectedMasteryClass.description}</p>
                      </div>
                    </div>
                    <p className="text-xs italic text-slate-500 mb-3">"{selectedMasteryClass.lore}"</p>

                    <div className="text-sm font-bold text-slate-700 mb-2">Sub-Classes</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {selectedMasteryClass.subClasses.map(sc => (
                        <div
                          key={sc.id}
                          className={cn(
                            "p-3 rounded border cursor-pointer transition-all",
                            selectedSubClass?.id === sc.id
                              ? "border-blue-400 bg-blue-50"
                              : "border-slate-200 hover:border-blue-300 bg-white"
                          )}
                          onClick={() => handleSelectSubClass(sc)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{sc.icon}</span>
                            <span className="font-bold text-xs text-slate-900">{sc.name}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mb-1">{sc.description}</p>
                          <div className="text-[10px] text-blue-600">+{sc.statBonus} {STAT_META[sc.primaryStat]?.label}</div>
                        </div>
                      ))}
                    </div>

                    {selectedSubClass && (
                      <div className="mt-4">
                        <div className="text-sm font-bold text-slate-700 mb-2">Specialization Types — {selectedSubClass.name}</div>
                        <div className="space-y-2">
                          {selectedSubClass.types.map(type => (
                            <div key={type.id} className="p-3 rounded border border-slate-200 bg-white">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{type.icon}</span>
                                <div>
                                  <div className="font-bold text-xs text-slate-900">{type.name}</div>
                                  <div className="text-[10px] text-slate-500">{type.description}</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-1.5">
                                {type.subTypes.map(st => (
                                  <SubTypeCard
                                    key={st.id}
                                    subType={st}
                                    allocated={masteryData?.allocatedSubTypes?.includes(st.id) || false}
                                    onAllocate={() => onAllocateSubType?.(st.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="current" className="mt-4">
              {selectedClassId ? (
                <div className="space-y-4">
                  {(() => {
                    const cls = COMMANDER_MASTERY_CLASSES.find(c => c.id === selectedClassId);
                    if (!cls) return <div className="text-sm text-slate-500">No mastery class selected.</div>;
                    return (
                      <>
                        <div className="p-4 rounded-lg border-2" style={{ borderColor: cls.color + "40", backgroundColor: cls.color + "08" }}>
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{cls.icon}</span>
                            <div>
                              <h3 className="text-lg font-orbitron font-bold">{cls.name}</h3>
                              <div className="text-xs text-slate-500">{cls.domain} · Level {currentLevel}/{cls.maxMasteryLevel}</div>
                            </div>
                          </div>
                          <Progress value={(currentLevel / cls.maxMasteryLevel) * 100} className="h-2 mt-3" />
                        </div>

                        {cls.abilities.length > 0 && (
                          <div>
                            <div className="text-sm font-bold text-slate-700 mb-2">Abilities</div>
                            <div className="space-y-2">
                              {cls.abilities.map(ab => (
                                <AbilityCard
                                  key={ab.id}
                                  ability={ab}
                                  unlocked={currentLevel >= ab.unlockLevel}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {cls.masteryMilestones.length > 0 && (
                          <div>
                            <div className="text-sm font-bold text-slate-700 mb-2">Milestones</div>
                            <div className="space-y-1.5">
                              {cls.masteryMilestones.map(m => {
                                const reached = currentLevel >= m.level;
                                return (
                                  <div key={m.level} className={cn(
                                    "flex items-center gap-3 p-2 rounded text-xs",
                                    reached ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-200 opacity-60"
                                  )}>
                                    <Badge variant={reached ? "default" : "outline"} className="w-12 justify-center text-[10px]">
                                      Lv.{m.level}
                                    </Badge>
                                    <span className={reached ? "text-emerald-700" : "text-slate-500"}>{m.reward}</span>
                                    <Badge variant="secondary" className="ml-auto text-[9px]">{m.type}</Badge>
                                    {reached && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">
                  Select a mastery class from the Browse tab to see your progress.
                </div>
              )}
            </TabsContent>

            <TabsContent value="abilities" className="mt-4">
              {selectedClassId ? (
                <div className="space-y-2">
                  {(() => {
                    const cls = COMMANDER_MASTERY_CLASSES.find(c => c.id === selectedClassId);
                    if (!cls) return null;
                    return cls.abilities.map(ab => (
                      <AbilityCard key={ab.id} ability={ab} unlocked={currentLevel >= ab.unlockLevel} />
                    ));
                  })()}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">
                  Select a mastery class to view available abilities.
                </div>
              )}
            </TabsContent>

            <TabsContent value="milestones" className="mt-4">
              {selectedClassId ? (
                <div className="space-y-1.5">
                  {(() => {
                    const cls = COMMANDER_MASTERY_CLASSES.find(c => c.id === selectedClassId);
                    if (!cls) return null;
                    return cls.masteryMilestones.map(m => {
                      const reached = currentLevel >= m.level;
                      return (
                        <div key={m.level} className={cn(
                          "flex items-center gap-3 p-3 rounded border",
                          reached ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200 opacity-60"
                        )}>
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold",
                            reached ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                          )}>
                            {m.level}
                          </div>
                          <div className="flex-1">
                            <div className={cn("font-bold text-sm", reached ? "text-emerald-900" : "text-slate-500")}>{m.reward}</div>
                            <div className="text-[10px] text-slate-400">Mastery Level {m.level}</div>
                          </div>
                          <Badge variant={reached ? "default" : "outline"} className="text-[10px]">{m.type}</Badge>
                          {reached && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">
                  Select a mastery class to view milestones.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
