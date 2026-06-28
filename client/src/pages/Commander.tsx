import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS, TECH_BRANCH_ASSETS } from "@shared/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, Sword, Shield, Cpu, Hammer, Anvil, Sparkles, 
  Box, Gem, Database, Flame, Star, Fingerprint, Dna, FlaskConical,
   Trophy, Target, Rocket, Medal, Award, Crown, Zap, Heart, History, Dice6, Stars
} from "lucide-react";
import {
   Item,
   COMMANDER_EQUIPMENT_TEMPLATES,
   COMMANDER_EQUIPMENT_TEMPLATE_COUNT,
   GOVERNMENT_LEADER_TYPES_23,
   GOVERNMENT_LEADER_TYPE_COUNT,
   getGovernmentLeadersByType,
   getGovernmentLeadersByClass,
   getCommanderEquipmentTemplatesByType,
   RACES,
   CLASSES,
   SUBCLASSES,
   RaceId,
   ClassId,
   SubClassId,
   CommanderEquipmentType,
   COMMANDER_EQUIPMENT_SLOT_DEFINITIONS,
} from "@/lib/commanderTypes";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { buildCommanderLoadoutSummary, buildRosterCommanderScores } from "@/lib/commanderSystems";

const TEMP_THEME_IMAGE = "/theme-temp.png";
import {
   COMMANDER_MAX_LEVEL,
   COMMANDER_MAX_TIER,
   type CommanderTalentNode,
} from "@shared/config/commanderTalentTreeConfig";

const ItemCard = ({ item, onEquip, onTemper }: { item: Item, onEquip?: (item: Item) => void, onTemper?: (id: string) => void }) => (
   <div className={cn(
      "bg-white border p-3 rounded flex flex-col gap-2 relative group transition-all hover:shadow-md",
      item.rarity === "legendary" ? "border-yellow-400 bg-yellow-50/30" :
      item.rarity === "epic" ? "border-purple-400 bg-purple-50/30" :
      item.rarity === "rare" ? "border-blue-400 bg-blue-50/30" :
      "border-slate-200"
   )} data-testid={`card-item-${item.id}`}>
      <div className="flex items-start justify-between">
         <div className="flex items-center gap-2">
            <div className={cn(
               "w-10 h-10 rounded flex items-center justify-center border",
               item.rarity === "legendary" ? "bg-yellow-100 border-yellow-400 text-yellow-600" :
               item.rarity === "epic" ? "bg-purple-100 border-purple-400 text-purple-600" :
               item.rarity === "rare" ? "bg-blue-100 border-blue-400 text-blue-600" :
               "bg-slate-100 border-slate-300 text-slate-500"
            )}>
               {item.type === "weapon" && <Sword className="w-6 h-6" />}
               {item.type === "armor" && <Shield className="w-6 h-6" />}
               {item.type === "module" && <Cpu className="w-6 h-6" />}
               {item.type === "blueprint" && <Hammer className="w-6 h-6" />}
               {item.type === "material" && <Box className="w-6 h-6" />}
            </div>
            <div>
               <div className="font-bold text-sm text-slate-900 flex items-center gap-1">
                  {item.name}
                  {item.tempering ? <span className="text-red-500">+{item.tempering}</span> : null}
               </div>
               <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{item.rarity} {item.type}</div>
               {(item.itemClass || item.itemSubClass || item.itemSubType) && (
                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">
                     {item.itemClass || "Unknown"} - {item.itemSubClass || "Unknown"} - {item.itemSubType || "Unknown"}
                  </div>
               )}
            </div>
         </div>
         {item.masterwork && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
      </div>
      
      <p className="text-xs text-slate-600 italic">{item.description}</p>
      
      {item.stats && (
         <div className="grid grid-cols-2 gap-1 mt-1">
            {Object.entries(item.stats).map(([key, val]) => (
               <div key={key} className="text-xs bg-slate-50 px-1 rounded text-slate-700 capitalize flex justify-between">
                  <span>{key}:</span>
                  <span className="font-mono font-bold">+{val}</span>
               </div>
            ))}
         </div>
      )}

      <div className="flex gap-1 mt-auto pt-2">
         {onEquip && (item.type === "weapon" || item.type === "armor" || item.type === "module") && (
            <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={() => onEquip(item)} data-testid={`button-equip-${item.id}`}>Equip</Button>
         )}
         {onTemper && (item.type === "weapon" || item.type === "armor" || item.type === "module") && (
            <Button size="sm" variant="secondary" className="w-full h-7 text-xs" onClick={() => onTemper(item.id)} data-testid={`button-temper-${item.id}`}>Temper</Button>
         )}
      </div>
   </div>
);

const achievements = [
  { id: "first_blood", name: "First Blood", desc: "Win your first battle", icon: Sword, unlocked: true, date: "2024-01-15" },
  { id: "fleet_commander", name: "Fleet Commander", desc: "Build 100 ships", icon: Rocket, unlocked: true, date: "2024-01-20" },
  { id: "researcher", name: "Mad Scientist", desc: "Complete 10 research projects", icon: FlaskConical, unlocked: true, date: "2024-02-01" },
  { id: "defender", name: "Iron Wall", desc: "Successfully defend 5 attacks", icon: Shield, unlocked: false },
  { id: "conqueror", name: "Galactic Conqueror", desc: "Conquer 10 planets", icon: Crown, unlocked: false },
  { id: "trader", name: "Trade Baron", desc: "Complete 50 market transactions", icon: Gem, unlocked: false },
  { id: "alliance_hero", name: "Alliance Hero", desc: "Contribute 1M points to alliance", icon: Medal, unlocked: false },
  { id: "titan_slayer", name: "Titan Slayer", desc: "Destroy an enemy Titan", icon: Target, unlocked: false }
];

const skillDefinitions = [
   { id: "combat_training", stat: "warfare" as const, name: "Combat Training", maxLevel: 10, desc: "+5% attack per level" },
   { id: "resource_management", stat: "logistics" as const, name: "Resource Management", maxLevel: 10, desc: "+2% production per level" },
   { id: "research_genius", stat: "science" as const, name: "Research Genius", maxLevel: 10, desc: "-3% research time per level" },
   { id: "construction_expert", stat: "engineering" as const, name: "Construction Expert", maxLevel: 10, desc: "-3% build time per level" },
];

interface CommanderTalentTreeResponse {
   tree: {
      nodes: CommanderTalentNode[];
   };
   progression: {
      level: number;
      tier: number;
      title: {
         title: string;
         badge: string;
      };
      unlockedNodes: Record<string, number>;
      spentPoints: number;
      totalPoints: number;
      availablePoints: number;
   };
}

interface CommanderCatalogResponse {
   commanders: Array<{ id: string; name: string; rarity: string; type: string; class: string; subType: string }>;
   count: number;
   stats: {
      totalCommanders: number;
      rarities: Record<string, number>;
   };
}

interface CommanderGachaStatusResponse {
   currency: number;
   costPerPull: number;
   canAffordPull: boolean;
   totalPoolCount: number;
   inventoryCount: number;
   pity: {
      pullsSinceEpic: number;
      softPity: number;
      hardPity: number;
      epicPity: number;
      isSoftPity: boolean;
      isHardPity: boolean;
   };
   rates: Record<string, number>;
}

interface CommanderGachaPullResponse {
   success: boolean;
   commander: {
      instanceId: string;
      id: string;
      name: string;
      rarity: string;
      type: string;
      class: string;
      subType: string;
   };
   currency: number;
   pity: {
      pulls: number;
      softPity: number;
      hardPity: number;
      isSoftPity: boolean;
      isHardPity: boolean;
   };
}

interface GovernmentLeaderApiResponse {
   success: boolean;
   leaders: Array<{
      id: string;
      name: string;
      type: string;
      class: string;
      subClass: string;
      subType: string;
      governanceStyle: string;
      bonuses: Record<string, number>;
   }>;
}

interface GovernmentAppointmentsApiResponse {
   success: boolean;
   appointments: {
      cabinet: Record<string, string>;
      doctrine: {
         civicFocus: string;
         fieldPosture: string;
         civilMandate: string;
      };
   };
}

interface CommanderProfilePayload {
   callsign: string;
   fleetTitle: string;
   bio: string;
   doctrineNotes: string;
   race?: RaceId;
   classId?: ClassId;
   subClassId?: SubClassId | null;
   updatedAt?: number;
}

interface CommanderProfileApiResponse {
   success: boolean;
   profile: CommanderProfilePayload;
}

type RaidRole = "tank" | "dps" | "healer" | "support";
interface CommanderRaidProfileResponse {
   career: {
      level: number;
      experience: number;
      experienceToNextLevel: number;
      rating: number;
      rank: string;
      specialization: RaidRole;
      participations: number;
      victories: number;
      bossKills: number;
      totalDamage: number;
      unitsLost: number;
      unitsSaved: number;
      commendations: number;
      streak: number;
      bestStreak: number;
      unlockedPerks: string[];
   };
   rolePower: Record<RaidRole, number>;
   recommendedRole: RaidRole;
   winRate: number;
   casualtyEfficiency: number;
}

export default function Commander() {
   const { toast } = useToast();
   const {
      commander,
      empireName,
      planetName,
      equipItem,
      unequipItem,
      craftItem,
      temperItem,
      setCommanderName,
      setEmpireName,
      setHomeWorldName,
      setCommanderIdentity,
      upgradeCommanderSkill,
   } = useGame();
   const [selectedRace, setSelectedRace] = useState<RaceId>(commander?.race || "terran");
   const [selectedClass, setSelectedClass] = useState<ClassId>(commander?.class || "admiral");
  const [selectedSubClass, setSelectedSubClass] = useState<SubClassId | "none">(commander?.subClass || "none");
   const [selectedEquipmentType, setSelectedEquipmentType] = useState<CommanderEquipmentType>("weapon");
   const [selectedLeaderType, setSelectedLeaderType] = useState<string>("all");
   const [selectedLeaderClass, setSelectedLeaderClass] = useState<string>("all");
   const [selectedTalentTier, setSelectedTalentTier] = useState<number>(1);
   const [commanderNameDraft, setCommanderNameDraft] = useState<string>(commander?.name || "Commander");
   const [empireNameDraft, setEmpireNameDraft] = useState<string>(commander?.empireName || "Stellar Dominion");
   const [homeWorldNameDraft, setHomeWorldNameDraft] = useState<string>(planetName || "New Colony");
   const [profileDraft, setProfileDraft] = useState<CommanderProfilePayload>({
      callsign: "",
      fleetTitle: "",
      bio: "",
      doctrineNotes: "",
   });

   useEffect(() => {
      setCommanderNameDraft(commander?.name || "Commander");
   }, [commander?.name]);

   useEffect(() => {
      setEmpireNameDraft(commander?.empireName || "Stellar Dominion");
   }, [commander?.empireName]);

   useEffect(() => {
      setHomeWorldNameDraft(planetName || "New Colony");
   }, [planetName]);

   useEffect(() => {
      if (!commander) return;
      setSelectedRace(commander.race || "terran");
      setSelectedClass(commander.class || "admiral");
      setSelectedSubClass(commander.subClass || "none");
   }, [commander?.race, commander?.class, commander?.subClass]);

   const leaderTypes = Array.from(new Set(GOVERNMENT_LEADER_TYPES_23.map(leader => leader.type)));
   const leaderClasses = Array.from(new Set(GOVERNMENT_LEADER_TYPES_23.map(leader => leader.class)));
   const leadersByType = selectedLeaderType === "all" ? GOVERNMENT_LEADER_TYPES_23 : getGovernmentLeadersByType(selectedLeaderType);
   const filteredGovernmentLeaders = selectedLeaderClass === "all" ? leadersByType : leadersByType.filter(leader => getGovernmentLeadersByClass(selectedLeaderClass).some(match => match.id === leader.id));
   const raceData = RACES[selectedRace] || RACES.terran;
   const classData = CLASSES[selectedClass] || CLASSES.admiral;
   const subClassData = selectedSubClass !== "none" ? SUBCLASSES[selectedSubClass as SubClassId] : null;

  if (!commander?.stats || !commander?.equipment || !commander?.inventory) {
    return <GameLayout><div className="text-center py-12">Loading commander data...</div></GameLayout>;
  }

   const { data: talentTreeData, isLoading: talentTreeLoading } = useQuery<CommanderTalentTreeResponse>({
      queryKey: ["/api/commander/talent/tree"],
      queryFn: async () => {
         const res = await fetch("/api/commander/talent/tree", { credentials: "include" });
         if (!res.ok) throw new Error("Failed to load commander talent tree");
         return res.json();
      },
   });

   const { data: commanderCatalogData } = useQuery<CommanderCatalogResponse>({
      queryKey: ["/api/commanders"],
      queryFn: async () => {
         const res = await fetch("/api/commanders", { credentials: "include" });
         if (!res.ok) throw new Error("Failed to load commander catalog");
         return res.json();
      },
   });

   const { data: gachaStatusData, isLoading: gachaStatusLoading } = useQuery<CommanderGachaStatusResponse>({
      queryKey: ["/api/commanders/gacha/status"],
      queryFn: async () => {
         const res = await fetch("/api/commanders/gacha/status", { credentials: "include" });
         if (!res.ok) throw new Error("Failed to load gacha status");
         return res.json();
      },
   });

   const { data: gachaInventoryData } = useQuery<{ commanders: Array<{ instanceId: string; name: string; rarity: string; type: string }>; count: number }>({
      queryKey: ["/api/commanders/inventory"],
      queryFn: async () => {
         const res = await fetch("/api/commanders/inventory", { credentials: "include" });
         if (!res.ok) throw new Error("Failed to load commander inventory");
         return res.json();
      },
   });

   const { data: governmentLeadersData } = useQuery<GovernmentLeaderApiResponse>({
      queryKey: ["/api/government-leaders"],
      queryFn: async () => {
         const res = await fetch("/api/government-leaders", { credentials: "include" });
         if (!res.ok) throw new Error("Failed to load government leaders");
         return res.json();
      },
   });

   const { data: governmentAppointmentsData } = useQuery<GovernmentAppointmentsApiResponse>({
      queryKey: ["/api/government-leaders/appointments/me"],
      queryFn: async () => {
         const res = await fetch("/api/government-leaders/appointments/me", { credentials: "include" });
         if (!res.ok) throw new Error("Failed to load government appointments");
         return res.json();
      },
   });

   const { data: commanderProfileData } = useQuery<CommanderProfileApiResponse>({
      queryKey: ["/api/commanders/profile/me"],
      queryFn: async () => {
         const res = await fetch("/api/commanders/profile/me", { credentials: "include" });
         if (!res.ok) throw new Error("Failed to load commander profile");
         return res.json();
      },
   });
   const { data: raidProfileData } = useQuery<CommanderRaidProfileResponse>({
      queryKey: ["raid-commander-profile"],
      queryFn: async () => {
         const response = await fetch("/api/raids/commander-profile", { credentials: "include" });
         if (!response.ok) throw new Error("Failed to load raid commander profile");
         return response.json();
      },
   });
   const raidSpecializationMutation = useMutation({
      mutationFn: async (specialization: RaidRole) => {
         const response = await fetch("/api/raids/commander-profile/specialization", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ specialization }),
         });
         const payload = await response.json().catch(() => ({}));
         if (!response.ok) throw new Error(payload.error || "Failed to update raid specialization");
         return payload as CommanderRaidProfileResponse;
      },
      onSuccess: (data) => {
         queryClient.setQueryData(["raid-commander-profile"], data);
         toast({ title: "Raid specialization updated", description: `${data.career.specialization} doctrine is now active.` });
      },
      onError: (error: Error) => toast({ title: "Specialization failed", description: error.message, variant: "destructive" }),
   });

   const gachaPullMutation = useMutation({
      mutationFn: async () => {
         const res = await apiRequest("POST", "/api/commanders/gacha/pull", {});
         return res.json() as Promise<CommanderGachaPullResponse>;
      },
      onSuccess: (payload) => {
         queryClient.invalidateQueries({ queryKey: ["/api/commanders/gacha/status"] });
         queryClient.invalidateQueries({ queryKey: ["/api/commanders/inventory"] });
         toast({
            title: "Commander Recruited",
            description: `${payload.commander.name} (${payload.commander.rarity.toUpperCase()}) joined your roster.`,
         });
      },
      onError: (error: any) => {
         toast({ title: "Gacha pull failed", description: error?.message || "Unknown error", variant: "destructive" });
      },
   });

   const unlockTalentMutation = useMutation({
      mutationFn: async (nodeId: string) => {
         const res = await apiRequest("POST", "/api/commander/talent/unlock", { nodeId });
         return res.json();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["/api/commander/talent/tree"] });
         toast({ title: "Talent unlocked", description: "Commander talent point spent successfully." });
      },
      onError: (error: any) => {
         toast({ title: "Unable to unlock talent", description: error?.message || "Unknown error", variant: "destructive" });
      },
   });

   const saveCommanderProfileMutation = useMutation({
      mutationFn: async (payload: CommanderProfilePayload) => {
         const res = await apiRequest("PUT", "/api/commanders/profile/me", payload);
         return res.json() as Promise<CommanderProfileApiResponse>;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["/api/commanders/profile/me"] });
         toast({ title: "Commander dossier saved", description: "Profile metadata persisted successfully." });
      },
      onError: (error: any) => {
         toast({ title: "Unable to save profile", description: error?.message || "Unknown error", variant: "destructive" });
      },
   });

   const saveCommanderIdentityMutation = useMutation({
      mutationFn: async (payload: { race: RaceId; classId: ClassId; subClassId: SubClassId | null }) => {
         const res = await apiRequest("PUT", "/api/commanders/profile/me", payload);
         return res.json() as Promise<CommanderProfileApiResponse>;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["/api/commanders/profile/me"] });
         toast({ title: "Identity saved", description: "Commander class system is now synchronized." });
      },
      onError: (error: any) => {
         toast({ title: "Unable to save identity", description: error?.message || "Unknown error", variant: "destructive" });
      },
   });

   useEffect(() => {
      if (!commanderProfileData?.profile) return;
      setProfileDraft({
         callsign: commanderProfileData.profile.callsign || "",
         fleetTitle: commanderProfileData.profile.fleetTitle || "",
         bio: commanderProfileData.profile.bio || "",
         doctrineNotes: commanderProfileData.profile.doctrineNotes || "",
      });

      const profileRace = commanderProfileData.profile.race;
      const profileClass = commanderProfileData.profile.classId;
      const profileSubClass = commanderProfileData.profile.subClassId;

      if (
         profileRace &&
         profileClass &&
         profileRace in RACES &&
         profileClass in CLASSES
      ) {
         const resolvedSubClass = profileSubClass && profileSubClass in SUBCLASSES ? profileSubClass : null;
         setSelectedRace(profileRace as RaceId);
         setSelectedClass(profileClass as ClassId);
         setSelectedSubClass(resolvedSubClass ?? "none");
         setCommanderIdentity(profileRace as RaceId, profileClass as ClassId, resolvedSubClass as SubClassId | null);
      }
   }, [commanderProfileData?.profile]);

   const talentNodesByBranch = (talentTreeData?.tree?.nodes || []).reduce<Record<string, CommanderTalentNode[]>>((acc, node) => {
      if (!acc[node.branch]) {
         acc[node.branch] = [];
      }
      acc[node.branch].push(node);
      return acc;
   }, {});

   const skills = skillDefinitions.map((skill) => ({
      ...skill,
      currentLevel: commander?.stats?.[skill.stat] || 1,
   }));
   const allocatedSkillPoints = Math.max(0, (commander?.stats?.warfare || 1) - 1)
      + Math.max(0, (commander?.stats?.logistics || 1) - 1)
      + Math.max(0, (commander?.stats?.science || 1) - 1)
      + Math.max(0, (commander?.stats?.engineering || 1) - 1);
   const totalSkillPoints = Math.max(0, ((commander?.stats?.level || 1) - 1) * 2);
   const availableSkillPoints = Math.max(0, totalSkillPoints - allocatedSkillPoints);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
   const eveSkillQueue = [
      "Command Core Calibration",
      "Fleet Logistics Matrix",
      "Adaptive Warfare Protocol",
      "Strategic Doctrine Synthesis",
   ];

   const loadoutSummary = useMemo(() => buildCommanderLoadoutSummary(commander), [commander]);
   const rosterScores = useMemo(
      () => buildRosterCommanderScores(gachaInventoryData?.commanders || []),
      [gachaInventoryData?.commanders],
   );

   const activeGovernmentLeaders = useMemo(() => {
      const leaders = governmentLeadersData?.leaders || [];
      const cabinet = governmentAppointmentsData?.appointments?.cabinet || {};
      const ids = Object.values(cabinet).filter(Boolean);
      return leaders.filter((leader) => ids.includes(leader.id));
   }, [governmentAppointmentsData?.appointments?.cabinet, governmentLeadersData?.leaders]);

   const governmentTieInBonuses = useMemo(() => {
      return activeGovernmentLeaders.reduce(
         (accumulator, leader) => {
            accumulator.stability += Number(leader.bonuses?.stability || 0);
            accumulator.economy += Number(leader.bonuses?.economy || 0);
            accumulator.military += Number(leader.bonuses?.military || 0);
            accumulator.research += Number(leader.bonuses?.research || 0);
            accumulator.diplomacy += Number(leader.bonuses?.diplomacy || 0);
            return accumulator;
         },
         { stability: 0, economy: 0, military: 0, research: 0, diplomacy: 0 },
      );
   }, [activeGovernmentLeaders]);

   const commandDetailSummary = useMemo(() => {
      const commandIndex = Math.round((loadoutSummary.attributes.combat + loadoutSummary.attributes.strategy + governmentTieInBonuses.military * 4) / 3);
      const governanceIndex = Math.round((loadoutSummary.attributes.governance + governmentTieInBonuses.stability * 6 + governmentTieInBonuses.diplomacy * 4) / 3);
      const researchIndex = Math.round((loadoutSummary.attributes.innovation + loadoutSummary.subStats.researchCadence + governmentTieInBonuses.research * 5) / 2);
      const logisticsIndex = Math.round((loadoutSummary.attributes.logistics + loadoutSummary.subStats.sustainment + governmentTieInBonuses.economy * 5) / 2);

      return {
         commandIndex,
         governanceIndex,
         researchIndex,
         logisticsIndex,
      };
   }, [governmentTieInBonuses, loadoutSummary.attributes, loadoutSummary.subStats]);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.STAR_FIELD.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">High Command</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Manage your commander's profile, equipment, leader tie-ins, and advanced command systems.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Carrier", image: SHIP_ASSETS.SPECIAL.CARRIER.path }, { label: "Research Lab", image: MENU_ASSETS.BUILDINGS.RESEARCH_LAB.path }, { label: "Featured", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="card-stats-level">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.COMPUTING.path} alt="level" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Commander Level</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">{commander?.stats?.level || 1}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200" data-testid="card-stats-xp">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.POWER.path} alt="xp" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-yellow-600 uppercase">Experience</div>
                  <div className="text-xl font-orbitron font-bold text-yellow-900">{commander?.stats?.xp || 0}/1000</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-skills">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.ENGINEERING.path} alt="skills" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                           <div className="text-xs text-green-600 uppercase">Available Skill Points</div>
                           <div className="text-xl font-orbitron font-bold text-green-900">{availableSkillPoints}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200" data-testid="card-stats-achievements">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.SENSORS.path} alt="achievements" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-orange-600 uppercase">Achievements</div>
                  <div className="text-xl font-orbitron font-bold text-orange-900">{unlockedAchievements}/{achievements.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
            <TabsTrigger value="profile" className="font-orbitron" data-testid="tab-profile"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
            <TabsTrigger value="loadout" className="font-orbitron" data-testid="tab-loadout"><Shield className="w-4 h-4 mr-2" /> Loadout</TabsTrigger>
            <TabsTrigger value="skills" className="font-orbitron" data-testid="tab-skills"><Target className="w-4 h-4 mr-2" /> Skills</TabsTrigger>
            <TabsTrigger value="raids" className="font-orbitron" data-testid="tab-raids"><Flame className="w-4 h-4 mr-2" /> Raids</TabsTrigger>
                  <TabsTrigger value="talentTree" className="font-orbitron" data-testid="tab-talent-tree"><History className="w-4 h-4 mr-2" /> Talent Tree</TabsTrigger>
            <TabsTrigger value="gacha" className="font-orbitron" data-testid="tab-gacha"><Dice6 className="w-4 h-4 mr-2" /> Gacha</TabsTrigger>
            <TabsTrigger value="achievements" className="font-orbitron" data-testid="tab-achievements"><Trophy className="w-4 h-4 mr-2" /> Achievements</TabsTrigger>
            <TabsTrigger value="identity" className="font-orbitron" data-testid="tab-identity"><Dna className="w-4 h-4 mr-2" /> Identity</TabsTrigger>
            <TabsTrigger value="leaders" className="font-orbitron" data-testid="tab-leaders"><Crown className="w-4 h-4 mr-2" /> Gov Leaders</TabsTrigger>
            <TabsTrigger value="inventory" className="font-orbitron" data-testid="tab-inventory"><Box className="w-4 h-4 mr-2" /> Inventory</TabsTrigger>
            <TabsTrigger value="smithy" className="font-orbitron" data-testid="tab-smithy"><Anvil className="w-4 h-4 mr-2" /> Smithy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-slate-200">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Fingerprint className="w-5 h-5 text-primary" /> Commander Stats</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="text-center">
                         <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-2 overflow-hidden relative">
                            <User className="w-12 h-12 text-slate-400" />
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] uppercase py-0.5">
                               {RACES[commander?.race || "terran"]?.name || "Unknown"}
                            </div>
                         </div>
                         <h3 className="text-xl font-orbitron text-slate-900">{commander.name || "Commander"}</h3>
                         <div className="mt-3 flex gap-2">
                            <Input
                               value={commanderNameDraft}
                               onChange={(event) => setCommanderNameDraft(event.target.value)}
                               placeholder="Commander name"
                               maxLength={48}
                               className="h-9 w-full"
                            />
                            <Button
                               size="sm"
                               variant="outline"
                               onClick={() => {
                                  setCommanderName(commanderNameDraft);
                                  toast({ title: "Commander updated", description: "Commander profile name synchronized." });
                               }}
                            >
                               Rename
                            </Button>
                         </div>
                         <div className="mt-3 grid grid-cols-1 gap-2">
                            <div className="flex gap-2">
                              <Input
                                value={empireNameDraft}
                                onChange={(event) => setEmpireNameDraft(event.target.value)}
                                placeholder="Empire name"
                                maxLength={64}
                                className="h-9 w-full"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEmpireName(empireNameDraft);
                                  toast({ title: "Empire updated", description: "Imperial banner name synchronized." });
                                }}
                              >
                                Save Empire
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={homeWorldNameDraft}
                                onChange={(event) => setHomeWorldNameDraft(event.target.value)}
                                placeholder="Home world name"
                                maxLength={64}
                                className="h-9 w-full"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setHomeWorldName(homeWorldNameDraft);
                                  toast({ title: "Home world updated", description: "Capital world registry synchronized." });
                                }}
                              >
                                Save World
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                                Empire: <span className="font-semibold text-slate-900">{empireName || "Stellar Dominion"}</span>
                              </div>
                              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                                Home World: <span className="font-semibold text-slate-900">{planetName || "New Colony"}</span>
                              </div>
                            </div>
                         </div>
                         <div className="flex justify-center gap-2 mt-1">
                            <Badge variant="outline" className="border-primary text-primary">{CLASSES[commander?.class || "admiral"]?.name || "Unknown"}</Badge>
                            {commander?.subClass && <Badge variant="secondary">{SUBCLASSES[commander?.subClass]?.name || "Unknown"}</Badge>}
                         </div>
                         <div className="mt-4 px-4">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                               <span>XP Progress</span>
                               <span>{commander?.stats?.xp || 0} / 1000</span>
                            </div>
                            <Progress value={(((commander?.stats?.xp || 0) / 1000) * 100)} className="h-2" />
                         </div>
                      </div>

                      <Separator />

                      <div className="bg-indigo-50 p-3 rounded border border-indigo-200 text-xs space-y-2">
                         <div className="font-bold text-indigo-900 uppercase">Government Leader Tie-In</div>
                         <div className="grid grid-cols-2 gap-2">
                            <div>Active Seats: <span className="font-semibold">{activeGovernmentLeaders.length}</span></div>
                            <div>Doctrine: <span className="font-semibold">{governmentAppointmentsData?.appointments?.doctrine?.civicFocus || "balanced"}</span></div>
                            <div>Stability Bonus: <span className="font-semibold">+{governmentTieInBonuses.stability}</span></div>
                            <div>Military Bonus: <span className="font-semibold">+{governmentTieInBonuses.military}</span></div>
                            <div>Research Bonus: <span className="font-semibold">+{governmentTieInBonuses.research}</span></div>
                            <div>Diplomacy Bonus: <span className="font-semibold">+{governmentTieInBonuses.diplomacy}</span></div>
                         </div>
                         <div className="text-indigo-700">Government leadership appointments are now linked directly to commander command analytics.</div>
                      </div>

                      <div className="bg-sky-50 p-3 rounded border border-sky-200 text-xs space-y-2">
                         <div className="font-bold text-sky-900 uppercase">Commander Dossier Metadata</div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                               value={profileDraft.callsign}
                               onChange={(event) => setProfileDraft((previous) => ({ ...previous, callsign: event.target.value }))}
                               placeholder="Callsign"
                               maxLength={48}
                               className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                            />
                            <input
                               value={profileDraft.fleetTitle}
                               onChange={(event) => setProfileDraft((previous) => ({ ...previous, fleetTitle: event.target.value }))}
                               placeholder="Fleet title"
                               maxLength={72}
                               className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                            />
                         </div>
                         <textarea
                            value={profileDraft.bio}
                            onChange={(event) => setProfileDraft((previous) => ({ ...previous, bio: event.target.value }))}
                            placeholder="Commander bio"
                            maxLength={600}
                            rows={3}
                            className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                         />
                         <textarea
                            value={profileDraft.doctrineNotes}
                            onChange={(event) => setProfileDraft((previous) => ({ ...previous, doctrineNotes: event.target.value }))}
                            placeholder="Doctrine notes"
                            maxLength={600}
                            rows={3}
                            className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                         />
                         <Button
                            size="sm"
                            variant="outline"
                            disabled={saveCommanderProfileMutation.isPending}
                            onClick={() => saveCommanderProfileMutation.mutate(profileDraft)}
                         >
                            {saveCommanderProfileMutation.isPending ? "Saving..." : "Save Dossier Metadata"}
                         </Button>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Sword className="w-4 h-4 text-red-500" /> Warfare</span>
                            <span className="font-mono text-lg text-slate-900">{commander?.stats?.warfare || 1}</span>
                         </div>
                         <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Box className="w-4 h-4 text-yellow-500" /> Logistics</span>
                            <span className="font-mono text-lg text-slate-900">{commander?.stats?.logistics || 1}</span>
                         </div>
                         <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-blue-500" /> Science</span>
                            <span className="font-mono text-lg text-slate-900">{commander?.stats?.science || 1}</span>
                         </div>
                         <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Hammer className="w-4 h-4 text-slate-500" /> Engineering</span>
                            <span className="font-mono text-lg text-slate-900">{commander?.stats?.engineering || 1}</span>
                         </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs space-y-2">
                         <div className="font-bold text-slate-900 uppercase">Active Bonuses</div>
                         {RACES[commander?.race || "human"]?.bonuses?.map((b, i) => <div key={`r-${i}`} className="text-slate-600 flex items-center gap-1"><div className="w-1 h-1 bg-primary rounded-full" /> {b}</div>)}
                         {CLASSES[commander?.class || "warrior"]?.bonuses?.map((b, i) => <div key={`c-${i}`} className="text-slate-600 flex items-center gap-1"><div className="w-1 h-1 bg-blue-500 rounded-full" /> {b}</div>)}
                         {commander?.subClass && SUBCLASSES[commander?.subClass]?.bonuses?.map((b, i) => <div key={`sc-${i}`} className="text-slate-600 flex items-center gap-1"><div className="w-1 h-1 bg-purple-500 rounded-full" /> {b}</div>)}
                      </div>
                   </CardContent>
                </Card>

                <div className="col-span-2 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.map((slot) => {
                        const item = commander?.equipment?.[slot.id];
                        const SlotIcon = slot.type === "weapon" ? Sword : slot.type === "armor" ? Shield : Cpu;
                        return (
                          <Card key={slot.id} className={cn("border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all", item ? "bg-white border-solid border-slate-200" : "bg-slate-50 border-slate-300")}>
                            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">{slot.shortLabel}</span>
                            <span className="text-xs uppercase font-bold text-slate-500 mb-2 text-center">{slot.label}</span>
                            {item ? (
                              <div className="w-full">
                                <ItemCard item={item} />
                                <Button variant="ghost" size="sm" className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => unequipItem(slot.id)} data-testid={`button-unequip-${slot.id}`}>Unequip</Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-center">
                                <SlotIcon className="w-10 h-10 text-slate-300" />
                                <p className="text-[11px] text-slate-500">{slot.description}</p>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                   </div>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="loadout" className="mt-6">
             <div className="space-y-6">
                <Card className="bg-white border-slate-200" data-testid="card-loadout-system">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Shield className="w-5 h-5 text-indigo-600" /> Commander Equipment & Inventory Slots</CardTitle>
                      <CardDescription>Full loadout matrix with slot states, inventory pools, and tactical readiness outputs.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                         {COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.map((slot) => (
                           <div key={slot.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                             <div className="text-xs uppercase text-slate-500">{slot.label}</div>
                             <div className="font-semibold text-slate-900 mt-1">{loadoutSummary.slots[slot.id]?.name || "Unassigned"}</div>
                           </div>
                         ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                         <div className="rounded border border-slate-200 bg-white p-3"><div className="text-xs text-slate-500 uppercase">Weapons</div><div className="text-xl font-bold text-slate-900">{loadoutSummary.inventoryByType.weapon}</div></div>
                         <div className="rounded border border-slate-200 bg-white p-3"><div className="text-xs text-slate-500 uppercase">Armor</div><div className="text-xl font-bold text-slate-900">{loadoutSummary.inventoryByType.armor}</div></div>
                         <div className="rounded border border-slate-200 bg-white p-3"><div className="text-xs text-slate-500 uppercase">Modules</div><div className="text-xl font-bold text-slate-900">{loadoutSummary.inventoryByType.module}</div></div>
                         <div className="rounded border border-slate-200 bg-white p-3"><div className="text-xs text-slate-500 uppercase">Blueprints</div><div className="text-xl font-bold text-slate-900">{loadoutSummary.inventoryByType.blueprint}</div></div>
                         <div className="rounded border border-slate-200 bg-white p-3"><div className="text-xs text-slate-500 uppercase">Materials</div><div className="text-xl font-bold text-slate-900">{loadoutSummary.inventoryByType.material}</div></div>
                      </div>
                      <div className="rounded border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
                        Active Loadout Slots: <span className="font-semibold">{loadoutSummary.subAttributes.activeSlots}</span> / {COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.length}
                      </div>
                   </CardContent>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                   <Card className="bg-white border-slate-200">
                      <CardHeader>
                         <CardTitle className="text-slate-900 text-base">Core Stats & Sub Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                         <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="rounded border border-slate-200 bg-slate-50 p-2">Warfare: <span className="font-semibold">{loadoutSummary.coreStats.warfare}</span></div>
                            <div className="rounded border border-slate-200 bg-slate-50 p-2">Logistics: <span className="font-semibold">{loadoutSummary.coreStats.logistics}</span></div>
                            <div className="rounded border border-slate-200 bg-slate-50 p-2">Science: <span className="font-semibold">{loadoutSummary.coreStats.science}</span></div>
                            <div className="rounded border border-slate-200 bg-slate-50 p-2">Engineering: <span className="font-semibold">{loadoutSummary.coreStats.engineering}</span></div>
                         </div>
                         <Separator />
                         <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(loadoutSummary.subStats).map(([key, value]) => (
                               <div key={key} className="rounded border border-slate-200 px-2 py-1 bg-white flex justify-between">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                  <span className="font-semibold">{value}</span>
                               </div>
                            ))}
                         </div>
                      </CardContent>
                   </Card>

                   <Card className="bg-white border-slate-200">
                      <CardHeader>
                         <CardTitle className="text-slate-900 text-base">Attributes & Sub Attributes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                         <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(loadoutSummary.attributes).map(([key, value]) => (
                               <div key={key} className="rounded border border-indigo-200 bg-indigo-50 px-2 py-1 flex justify-between">
                                  <span className="capitalize">{key}</span>
                                  <span className="font-semibold text-indigo-900">{value}</span>
                               </div>
                            ))}
                         </div>
                         <Separator />
                         <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(loadoutSummary.subAttributes).map(([key, value]) => (
                               <div key={key} className="rounded border border-slate-200 px-2 py-1 bg-white flex justify-between">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                  <span className="font-semibold">{value}</span>
                               </div>
                            ))}
                         </div>
                      </CardContent>
                   </Card>
                </div>

                <Card className="bg-white border-slate-200">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Crown className="w-5 h-5 text-amber-600" /> Other Commanders Operations Matrix</CardTitle>
                      <CardDescription>Assign recruited commanders to Fleet, Research, Governance, and Industry operational lanes.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs">
                         <div className="rounded border border-slate-200 bg-slate-50 p-2">Command Index: <span className="font-semibold">{commandDetailSummary.commandIndex}</span></div>
                         <div className="rounded border border-slate-200 bg-slate-50 p-2">Governance Index: <span className="font-semibold">{commandDetailSummary.governanceIndex}</span></div>
                         <div className="rounded border border-slate-200 bg-slate-50 p-2">Research Index: <span className="font-semibold">{commandDetailSummary.researchIndex}</span></div>
                         <div className="rounded border border-slate-200 bg-slate-50 p-2">Logistics Index: <span className="font-semibold">{commandDetailSummary.logisticsIndex}</span></div>
                      </div>
                      {rosterScores.length === 0 ? (
                         <div className="text-sm text-slate-500">No recruited commanders yet. Use the Gacha tab to build your roster.</div>
                      ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                            {rosterScores.slice(0, 12).map((entry) => (
                               <div key={entry.instanceId} className="rounded border border-slate-200 bg-slate-50 p-3">
                                  <div className="flex items-center justify-between">
                                     <div className="font-semibold text-slate-900 text-sm truncate">{entry.name}</div>
                                     <Badge variant="outline" className="text-[10px] uppercase">{entry.rarity}</Badge>
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1">Role: {entry.role} - Type: {entry.type}</div>
                                  <div className="grid grid-cols-3 gap-1 mt-2 text-[11px]">
                                        <div className="rounded bg-white border border-slate-200 px-2 py-1">Cmd {entry.commandScore + governmentTieInBonuses.military}</div>
                                        <div className="rounded bg-white border border-slate-200 px-2 py-1">Sup {entry.supportScore + governmentTieInBonuses.economy}</div>
                                        <div className="rounded bg-amber-50 border border-amber-200 px-2 py-1">Syn {entry.synergy + governmentTieInBonuses.diplomacy + governmentTieInBonuses.stability}</div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}
                   </CardContent>
                </Card>

                   <Card className="bg-white border-slate-200">
                      <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-slate-900"><Award className="w-5 h-5 text-sky-600" /> Commander Detail Dossier</CardTitle>
                         <CardDescription>Expanded detailed view of command structure, operational profile, and strategic posture.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                         <div className="rounded border border-slate-200 bg-slate-50 p-3">
                            <div className="font-semibold text-slate-900 mb-1">Profile</div>
                            <div>Name: {commander.name}</div>
                            <div>Callsign: {commanderProfileData?.profile?.callsign || "N/A"}</div>
                            <div>Fleet Title: {commanderProfileData?.profile?.fleetTitle || "N/A"}</div>
                            <div>Race: {RACES[commander.race]?.name}</div>
                            <div>Class: {CLASSES[commander.class]?.name}</div>
                            <div>Sub-Class: {commander.subClass ? SUBCLASSES[commander.subClass]?.name : "None"}</div>
                         </div>
                         <div className="rounded border border-slate-200 bg-slate-50 p-3">
                            <div className="font-semibold text-slate-900 mb-1">Loadout</div>
                            <div>Primary Weapon: {loadoutSummary.slots.primaryWeapon?.name || "None"}</div>
                            <div>Armor Core: {loadoutSummary.slots.armorCore?.name || "None"}</div>
                            <div>Command Module: {loadoutSummary.slots.commandModule?.name || "None"}</div>
                            <div>Active Slots: {loadoutSummary.subAttributes.activeSlots} / {COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.length}</div>
                            <div>Equipment Score: {loadoutSummary.subAttributes.equipmentScore}</div>
                         </div>
                         <div className="rounded border border-slate-200 bg-slate-50 p-3">
                            <div className="font-semibold text-slate-900 mb-1">Operational</div>
                            <div>Command Power: {loadoutSummary.subStats.commandPower}</div>
                            <div>Tactical Agility: {loadoutSummary.subStats.tacticalAgility}</div>
                            <div>Sustainment: {loadoutSummary.subStats.sustainment}</div>
                            <div>Research Cadence: {loadoutSummary.subStats.researchCadence}</div>
                         </div>
                         <div className="rounded border border-slate-200 bg-slate-50 p-3">
                            <div className="font-semibold text-slate-900 mb-1">Government Tie-In</div>
                            <div>Appointed Leaders: {activeGovernmentLeaders.length}</div>
                            <div>Stability: +{governmentTieInBonuses.stability}</div>
                            <div>Economy: +{governmentTieInBonuses.economy}</div>
                            <div>Research: +{governmentTieInBonuses.research}</div>
                         </div>
                         <div className="rounded border border-slate-200 bg-slate-50 p-3 md:col-span-2">
                            <div className="font-semibold text-slate-900 mb-1">Doctrine Notes</div>
                            <div className="text-slate-700 whitespace-pre-wrap">{commanderProfileData?.profile?.doctrineNotes || "No doctrine notes saved yet."}</div>
                            <div className="mt-2 text-slate-700 whitespace-pre-wrap">{commanderProfileData?.profile?.bio || "No commander bio saved yet."}</div>
                         </div>
                      </CardContent>
                   </Card>
             </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
             <Card className="bg-white border-slate-200" data-testid="card-skills">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Target className="w-5 h-5 text-green-600" /> Commander Skills
                   </CardTitle>
                   <CardDescription>Spend skill points to improve your commander's abilities. Gain skill points by leveling up.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map(skill => (
                         <div key={skill.id} className="bg-slate-50 p-4 rounded border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                               <div>
                                  <div className="font-bold text-slate-900">{skill.name}</div>
                                  <div className="text-xs text-muted-foreground">{skill.desc}</div>
                               </div>
                               <Badge variant="outline" className="font-mono">{skill.currentLevel}/{skill.maxLevel}</Badge>
                            </div>
                            <Progress value={(skill.currentLevel / skill.maxLevel) * 100} className="h-2 mb-2" />
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             className="w-full"
                                             disabled={skill.currentLevel >= skill.maxLevel || availableSkillPoints <= 0}
                                             onClick={() => {
                                                if (upgradeCommanderSkill(skill.stat)) {
                                                   toast({ title: "Skill upgraded", description: `${skill.name} is now level ${skill.currentLevel + 1}.` });
                                                }
                                             }}
                                          >
                               Upgrade (1 SP)
                            </Button>
                         </div>
                      ))}
                   </div>
                   
                   <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center justify-between">
                         <div>
                            <div className="font-bold text-green-900">Available Skill Points</div>
                            <div className="text-sm text-green-700">Earned from commander levels</div>
                         </div>
                         <div className="text-3xl font-mono font-bold text-green-600">{availableSkillPoints}</div>
                      </div>
                   </div>

                   <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded space-y-3">
                      <div className="flex items-center gap-2 font-bold text-indigo-900">
                         <Stars className="w-4 h-4" /> EVE-Style Skill Queue Planner
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                         {eveSkillQueue.map((step, index) => (
                            <div key={step} className="bg-white border border-indigo-100 rounded px-3 py-2 flex items-center justify-between">
                               <span>{index + 1}. {step}</span>
                               <Badge variant="outline">Queued</Badge>
                            </div>
                         ))}
                      </div>
                      <p className="text-xs text-indigo-700">Train core queue first, then unlock branch-specific nodes in Talent Tree for Admiral / Industrialist / Scientist doctrine paths.</p>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="raids" className="mt-6">
             <div className="space-y-5">
                <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-cyan-950"><Flame className="h-5 w-5" /> Commander Raid Career</CardTitle>
                      <CardDescription>Raid Operations, Raid Finder, and boss assaults all advance this persistent command profile.</CardDescription>
                   </CardHeader>
                   <CardContent className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                      <div><div className="text-xs uppercase text-cyan-700">Rank</div><div className="font-orbitron font-bold">{raidProfileData?.career.rank || "Cadet Raider"}</div></div>
                      <div><div className="text-xs uppercase text-cyan-700">Raid Level</div><div className="font-orbitron font-bold">{raidProfileData?.career.level || 1}</div></div>
                      <div><div className="text-xs uppercase text-cyan-700">Rating</div><div className="font-orbitron font-bold">{raidProfileData?.career.rating || 1000}</div></div>
                      <div><div className="text-xs uppercase text-cyan-700">Win Rate</div><div className="font-orbitron font-bold">{raidProfileData?.winRate || 0}%</div></div>
                      <div><div className="text-xs uppercase text-cyan-700">Boss Kills</div><div className="font-orbitron font-bold">{raidProfileData?.career.bossKills || 0}</div></div>
                      <div><div className="text-xs uppercase text-cyan-700">Commendations</div><div className="font-orbitron font-bold">{raidProfileData?.career.commendations || 0}</div></div>
                   </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-2">
                   <Card className="border-slate-200 bg-white">
                      <CardHeader><CardTitle>Raid Specialization</CardTitle><CardDescription>Matching your operation role grants a 16% raid-power bonus and stronger role rewards.</CardDescription></CardHeader>
                      <CardContent className="grid grid-cols-2 gap-3">
                         {(["tank", "dps", "healer", "support"] as RaidRole[]).map((role) => (
                            <Button
                               key={role}
                               variant={raidProfileData?.career.specialization === role ? "default" : "outline"}
                               className="h-auto flex-col py-3 capitalize"
                               disabled={raidSpecializationMutation.isPending}
                               onClick={() => raidSpecializationMutation.mutate(role)}
                            >
                               <span>{role}</span>
                               <span className="text-xs opacity-75">{(raidProfileData?.rolePower[role] || 0).toLocaleString()} power</span>
                            </Button>
                         ))}
                      </CardContent>
                   </Card>
                   <Card className="border-slate-200 bg-white">
                      <CardHeader><CardTitle>Combat Record</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-2 gap-3 text-sm">
                         <div className="rounded border bg-slate-50 p-3">Participations<br /><b>{raidProfileData?.career.participations || 0}</b></div>
                         <div className="rounded border bg-slate-50 p-3">Victories<br /><b>{raidProfileData?.career.victories || 0}</b></div>
                         <div className="rounded border bg-slate-50 p-3">Damage dealt<br /><b>{(raidProfileData?.career.totalDamage || 0).toLocaleString()}</b></div>
                         <div className="rounded border bg-slate-50 p-3">Units saved<br /><b>{(raidProfileData?.career.unitsSaved || 0).toLocaleString()}</b></div>
                         <div className="rounded border bg-slate-50 p-3">Current streak<br /><b>{raidProfileData?.career.streak || 0}</b></div>
                         <div className="rounded border bg-slate-50 p-3">Best streak<br /><b>{raidProfileData?.career.bestStreak || 0}</b></div>
                      </CardContent>
                   </Card>
                </div>

                <Card className="border-slate-200 bg-white">
                   <CardHeader><CardTitle>Unlocked Raid Perks</CardTitle><CardDescription>New perks unlock every eight raid-career levels in your active specialization.</CardDescription></CardHeader>
                   <CardContent className="flex flex-wrap gap-2">
                      {(raidProfileData?.career.unlockedPerks || []).length
                         ? raidProfileData?.career.unlockedPerks.map((perk) => <Badge key={perk} className="bg-indigo-100 text-indigo-800">{perk}</Badge>)
                         : <span className="text-sm text-slate-500">Reach raid-career level 8 to unlock the first specialization perk.</span>}
                   </CardContent>
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="talentTree" className="mt-6">
             <Card className="bg-white border-slate-200" data-testid="card-talent-tree">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-slate-900">
                      <History className="w-5 h-5 text-indigo-600" /> Commander Talent Tree
                   </CardTitle>
                   <CardDescription>Progression supports level 1-{COMMANDER_MAX_LEVEL} and tier 1-{COMMANDER_MAX_TIER}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {talentTreeLoading ? (
                      <div className="text-sm text-slate-500">Loading talent tree...</div>
                   ) : (
                      <>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-slate-50 border border-slate-200 rounded p-3">
                               <div className="text-xs uppercase text-slate-500">Level</div>
                               <div className="text-2xl font-orbitron text-slate-900">{talentTreeData?.progression.level || 1}</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded p-3">
                               <div className="text-xs uppercase text-slate-500">Tier</div>
                               <div className="text-2xl font-orbitron text-slate-900">{talentTreeData?.progression.tier || 1}</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded p-3">
                               <div className="text-xs uppercase text-slate-500">Title</div>
                               <div className="text-base font-semibold text-slate-900">
                                  {talentTreeData?.progression.title?.badge || "Active"} {talentTreeData?.progression.title?.title || "Cadet"}
                               </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                               <div className="text-xs uppercase text-green-600">Talent Points</div>
                               <div className="text-2xl font-orbitron text-green-900">{talentTreeData?.progression.availablePoints || 0}</div>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-200 rounded p-3 bg-white">
                               <div>
                                  <div className="text-xs uppercase text-slate-500">Viewing Tier</div>
                                  <div className="text-lg font-orbitron text-slate-900">{selectedTalentTier} / {COMMANDER_MAX_TIER}</div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Button
                                     size="sm"
                                     variant="outline"
                                     onClick={() => setSelectedTalentTier((current) => Math.max(1, current - 1))}
                                     disabled={selectedTalentTier <= 1}
                                  >
                                     Prev
                                  </Button>
                                  <Select
                                     value={String(selectedTalentTier)}
                                     onValueChange={(value) => setSelectedTalentTier(Number(value))}
                                  >
                                     <SelectTrigger className="w-40">
                                        <SelectValue />
                                     </SelectTrigger>
                                     <SelectContent>
                                        {Array.from({ length: COMMANDER_MAX_TIER }, (_, index) => index + 1).map((tierValue) => (
                                           <SelectItem key={`talent-tier-${tierValue}`} value={String(tierValue)}>
                                              Tier {tierValue}
                                           </SelectItem>
                                        ))}
                                     </SelectContent>
                                  </Select>
                                  <Button
                                     size="sm"
                                     variant="outline"
                                     onClick={() => setSelectedTalentTier((current) => Math.min(COMMANDER_MAX_TIER, current + 1))}
                                     disabled={selectedTalentTier >= COMMANDER_MAX_TIER}
                                  >
                                     Next
                                  </Button>
                               </div>
                            </div>

                            {Object.entries(talentNodesByBranch).map(([branch, nodes]) => (
                               <div key={branch} className="border border-slate-200 rounded p-4 bg-slate-50/40">
                                  <div className="font-bold text-slate-900 capitalize mb-3">{branch}</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                     {nodes
                                     .filter((node) => node.tier === selectedTalentTier)
                                     .map((node) => {
                                        const currentRank = talentTreeData?.progression.unlockedNodes?.[node.id] || 0;
                                        const unlocked = currentRank > 0;
                                        const maxed = currentRank >= node.maxRank;
                                        const hasLevel = (talentTreeData?.progression.level || 1) >= node.requiredLevel;
                                        const prereqsMet = node.prerequisiteNodeIds.every((prereq) => (talentTreeData?.progression.unlockedNodes?.[prereq] || 0) > 0);
                                        const canUnlock = !maxed && hasLevel && prereqsMet && (talentTreeData?.progression.availablePoints || 0) > 0;

                                        return (
                                           <Card key={node.id} className={cn("border", unlocked ? "border-indigo-300 bg-indigo-50/40" : "border-slate-200 bg-white")}>
                                              <CardContent className="p-3 space-y-2">
                                                 <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                       <div className="text-sm font-semibold text-slate-900">{node.name}</div>
                                                       <div className="text-xs text-slate-500">Tier {node.tier} - Req Lv {node.requiredLevel}</div>
                                                    </div>
                                                    <Badge variant="outline">{currentRank}/{node.maxRank}</Badge>
                                                 </div>
                                                 <div className="text-xs text-slate-600">{node.description}</div>
                                                 <Button
                                                    size="sm"
                                                    className="w-full"
                                                    disabled={!canUnlock || unlockTalentMutation.isPending}
                                                    onClick={() => unlockTalentMutation.mutate(node.id)}
                                                 >
                                                    {maxed ? "Max Rank" : canUnlock ? "Unlock Rank" : "Locked"}
                                                 </Button>
                                              </CardContent>
                                           </Card>
                                        );
                                     })}
                                  </div>
                               </div>
                            ))}
                         </div>
                      </>
                   )}
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="gacha" className="mt-6">
             <Card className="bg-white border-slate-200" data-testid="card-gacha-system">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Dice6 className="w-5 h-5 text-fuchsia-600" /> Commander Gacha Command Nexus
                   </CardTitle>
                   <CardDescription>Recruit from a 74-commander pool with rarity rates and pity protection.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="bg-slate-50 border border-slate-200 rounded p-3">
                         <div className="text-xs uppercase text-slate-500">Total Pool</div>
                         <div className="text-2xl font-orbitron text-slate-900">{commanderCatalogData?.count || gachaStatusData?.totalPoolCount || 0}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-3">
                         <div className="text-xs uppercase text-slate-500">Gacha Currency</div>
                         <div className="text-2xl font-orbitron text-slate-900">{gachaStatusData?.currency || 0}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-3">
                         <div className="text-xs uppercase text-slate-500">Pity Progress</div>
                         <div className="text-2xl font-orbitron text-slate-900">{gachaStatusData?.pity?.pullsSinceEpic || 0}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-3">
                         <div className="text-xs uppercase text-slate-500">Roster Size</div>
                         <div className="text-2xl font-orbitron text-slate-900">{gachaInventoryData?.count || 0}</div>
                      </div>
                   </div>

                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-fuchsia-50 border border-fuchsia-200 rounded p-4">
                      <div>
                         <div className="font-bold text-fuchsia-900">Warp Recruitment Pull</div>
                         <div className="text-xs text-fuchsia-700">Cost: {gachaStatusData?.costPerPull || 10} currency - Soft pity {gachaStatusData?.pity?.softPity || 75} - Hard pity {gachaStatusData?.pity?.hardPity || 90}</div>
                      </div>
                      <Button
                         onClick={() => gachaPullMutation.mutate()}
                         disabled={gachaPullMutation.isPending || !gachaStatusData?.canAffordPull || gachaStatusLoading}
                         data-testid="button-gacha-pull"
                      >
                         {gachaPullMutation.isPending ? "Pulling..." : "Execute 1 Pull"}
                      </Button>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="border border-slate-200 rounded p-3 bg-slate-50">
                         <div className="font-semibold text-slate-900 mb-2">Current Drop Rates</div>
                         <div className="space-y-1 text-sm">
                            {Object.entries(gachaStatusData?.rates || {}).map(([rarity, value]) => (
                               <div key={rarity} className="flex justify-between border-b border-slate-100 pb-1">
                                  <span className="capitalize">{rarity}</span>
                                  <span className="font-mono">{(value * 100).toFixed(2)}%</span>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="border border-slate-200 rounded p-3 bg-slate-50">
                         <div className="font-semibold text-slate-900 mb-2">Recent Recruits</div>
                         <div className="space-y-1 max-h-40 overflow-y-auto text-sm">
                            {(gachaInventoryData?.commanders || []).slice(-8).reverse().map((commanderItem) => (
                               <div key={commanderItem.instanceId} className="flex items-center justify-between border-b border-slate-100 pb-1">
                                  <span className="truncate">{commanderItem.name}</span>
                                  <Badge variant="outline" className="text-[10px] uppercase">{commanderItem.rarity}</Badge>
                               </div>
                            ))}
                            {(!gachaInventoryData?.commanders || gachaInventoryData.commanders.length === 0) && (
                               <div className="text-slate-500">No commanders recruited yet.</div>
                            )}
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
             <Card className="bg-white border-slate-200" data-testid="card-achievements">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Trophy className="w-5 h-5 text-orange-600" /> Achievements
                   </CardTitle>
                   <CardDescription>Complete challenges to earn rewards and bragging rights.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {achievements.map(ach => (
                         <div key={ach.id} className={cn("p-4 rounded border text-center transition-all", ach.unlocked ? "bg-orange-50 border-orange-200" : "bg-slate-50 border-slate-200 opacity-50")}>
                            <div className={cn("w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2", ach.unlocked ? "bg-orange-100 text-orange-600" : "bg-slate-200 text-slate-400")}>
                               <ach.icon className="w-6 h-6" />
                            </div>
                            <div className={cn("font-bold text-sm", ach.unlocked ? "text-orange-900" : "text-slate-500")}>{ach.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{ach.desc}</div>
                            {ach.unlocked && ach.date && (
                               <Badge variant="outline" className="mt-2 text-[10px]">Unlocked {ach.date}</Badge>
                            )}
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="identity" className="mt-6">
             <Card className="bg-white border-slate-200">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-slate-900"><Dna className="w-5 h-5 text-primary" /> Genetic & Professional Sequencing</CardTitle>
                   <CardDescription>Modify your commander's biological origin and specialization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-900">Origin Species</label>
                         <Select value={selectedRace} onValueChange={(v: RaceId) => setSelectedRace(v)}>
                            <SelectTrigger>
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                               {Object.values(RACES).map(r => (
                                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                         <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                            <p className="mb-2">{raceData.description}</p>
                            <div className="space-y-1">
                               {raceData.bonuses.map((b, i) => (
                                  <Badge key={i} variant="outline" className="bg-white">{b}</Badge>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-900">Career Path</label>
                         <Select value={selectedClass} onValueChange={(v: ClassId) => {
                            setSelectedClass(v);
                            setSelectedSubClass("none");
                         }}>
                            <SelectTrigger>
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                               {Object.values(CLASSES).map(c => (
                                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                         <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                            <p className="mb-2">{classData.description}</p>
                            <div className="space-y-1">
                               {classData.bonuses.map((b, i) => (
                                  <Badge key={i} variant="outline" className="bg-white">{b}</Badge>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-900">Specialization</label>
                         <Select 
                           value={selectedSubClass} 
                           onValueChange={(v: SubClassId | "none") => setSelectedSubClass(v)}
                         >
                            <SelectTrigger>
                               <SelectValue placeholder="Requires Level 10" />
                            </SelectTrigger>
                            <SelectContent>
                               <SelectItem value="none">-- None --</SelectItem>
                               {classData.subClasses.map(scId => (
                                  <SelectItem key={scId} value={scId}>{SUBCLASSES[scId].name}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                         {selectedSubClass !== "none" && subClassData ? (
                            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                               <p className="mb-2">{subClassData.description}</p>
                               <div className="space-y-1">
                                  {subClassData.bonuses.map((b, i) => (
                                     <Badge key={i} variant="outline" className="bg-white border-purple-200 text-purple-700">{b}</Badge>
                                  ))}
                               </div>
                            </div>
                         ) : (
                            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-400 italic text-center">
                               Select a specialization to see details.
                            </div>
                         )}
                      </div>
                   </div>

                   <div className="flex justify-end">
                      <Button
                        size="lg"
                        onClick={() => {
                           const nextSubClass = selectedSubClass === "none" ? null : selectedSubClass;
                           setCommanderIdentity(selectedRace, selectedClass, nextSubClass);
                           saveCommanderIdentityMutation.mutate({
                              race: selectedRace,
                              classId: selectedClass,
                              subClassId: nextSubClass,
                           });
                        }}
                        disabled={saveCommanderIdentityMutation.isPending}
                        data-testid="button-confirm-identity"
                      >
                         Confirm Identity Sequence
                      </Button>
                   </div>

                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="leaders" className="mt-6">
             <Card className="bg-white border-slate-200">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-slate-900"><Crown className="w-5 h-5 text-amber-600" /> Government Leaders ({GOVERNMENT_LEADER_TYPE_COUNT})</CardTitle>
                   <CardDescription>Browse leader types by type, class, subclass, and subtype.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Select value={selectedLeaderType} onValueChange={setSelectedLeaderType}>
                         <SelectTrigger>
                            <SelectValue placeholder="Filter by type" />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {leaderTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                         </SelectContent>
                      </Select>

                      <Select value={selectedLeaderClass} onValueChange={setSelectedLeaderClass}>
                         <SelectTrigger>
                            <SelectValue placeholder="Filter by class" />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {leaderClasses.map(leaderClass => (
                              <SelectItem key={leaderClass} value={leaderClass}>{leaderClass}</SelectItem>
                            ))}
                         </SelectContent>
                      </Select>
                   </div>

                   <ScrollArea className="h-[500px] pr-2">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredGovernmentLeaders.map(leader => (
                          <Card key={leader.id} className="border border-slate-200">
                            <CardContent className="p-4 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-bold text-slate-900">{leader.name}</div>
                                  <div className="text-xs text-slate-500 uppercase tracking-wide">{leader.type}</div>
                                </div>
                                <Badge variant="secondary">{leader.subType}</Badge>
                              </div>
                              <div className="text-xs text-slate-600">Class: {leader.class}</div>
                              <div className="text-xs text-slate-600">SubClass: {leader.subClass}</div>
                              <div className="text-xs text-slate-600">Style: {leader.governanceStyle}</div>
                              <div className="grid grid-cols-2 gap-1 pt-1 text-[11px]">
                                {Object.entries(leader.bonuses).map(([key, value]) => (
                                  <div key={`${leader.id}-${key}`} className="bg-slate-50 border border-slate-100 rounded px-2 py-1 flex justify-between">
                                    <span className="capitalize">{key}</span>
                                    <span className="font-semibold">+{value}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                     </div>
                   </ScrollArea>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
             <Card className="bg-white border-slate-200 min-h-[400px]">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Box className="w-5 h-5 text-slate-600" /> Inventory
                   </CardTitle>
                   <CardDescription>Manage your items and equipment. Capacity: {commander?.inventory?.length || 0}/20</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {(commander?.inventory || []).map((item, i) => (
                         <ItemCard key={i} item={item} onEquip={equipItem} onTemper={temperItem} />
                      ))}
                      {Array.from({ length: Math.max(0, 20 - (commander?.inventory?.length || 0)) }).map((_, i) => (
                         <div key={`empty-${i}`} className="aspect-square bg-slate-50 border border-slate-100 rounded flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="smithy" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-slate-200">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Hammer className="w-5 h-5 text-primary" /> Equipment Foundry ({COMMANDER_EQUIPMENT_TEMPLATE_COUNT} Types)</CardTitle>
                      <CardDescription>Craft commander weapons, armor, and modules with class, subclass, and subtype variants.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex gap-2 mb-2">
                         <Button variant={selectedEquipmentType === "weapon" ? "default" : "outline"} size="sm" onClick={() => setSelectedEquipmentType("weapon")}>Weapons</Button>
                         <Button variant={selectedEquipmentType === "armor" ? "default" : "outline"} size="sm" onClick={() => setSelectedEquipmentType("armor")}>Armor</Button>
                         <Button variant={selectedEquipmentType === "module" ? "default" : "outline"} size="sm" onClick={() => setSelectedEquipmentType("module")}>Items / Modules</Button>
                      </div>
                      <ScrollArea className="h-[460px] pr-2">
                      {getCommanderEquipmentTemplatesByType(selectedEquipmentType).map(template => (
                         <div key={template.id} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200 mb-3">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-500">
                                  <Hammer className="w-5 h-5" />
                               </div>
                               <div>
                                  <div className="font-bold text-sm text-slate-900">{template.name}</div>
                                  <div className="text-xs text-slate-500">{template.itemClass} / {template.itemSubClass} / {template.itemSubType}</div>
                                  <div className="text-xs text-slate-500">Lvl {template.level} - {template.rarity} - {template.type}</div>
                                  <div className="text-xs text-slate-500">Requires: {template.craftingCost.metal} Metal, {template.craftingCost.crystal} Crystal, {template.craftingCost.deuterium} Deuterium</div>
                               </div>
                            </div>
                            <Button size="sm" onClick={() => {
                               const item: Item = {
                                  id: `${template.id}_${Date.now()}`,
                                  name: template.name,
                                  description: template.description,
                                  type: template.type,
                                  rarity: template.rarity,
                                  level: template.level,
                                  itemClass: template.itemClass,
                                  itemSubClass: template.itemSubClass,
                                  itemSubType: template.itemSubType,
                                  stats: template.stats
                               };
                               craftItem(item, template.craftingCost);
                            }} data-testid={`button-craft-${template.id}`}>Craft</Button>
                         </div>
                      ))}
                      </ScrollArea>
                   </CardContent>
                </Card>
                
                <Card className="bg-white border-slate-200">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Flame className="w-5 h-5 text-orange-500" /> Tempering Station</CardTitle>
                      <CardDescription>Enhance your equipment's power through tempering.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="text-center py-8 text-slate-500">
                         <Anvil className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                         <p>Select an item from your inventory or equipment slots to temper it.</p>
                         <p className="text-xs mt-2">Tempering costs Metal and has a chance to fail.</p>
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
