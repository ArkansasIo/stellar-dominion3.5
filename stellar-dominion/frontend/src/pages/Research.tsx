import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, Box, Gem, Database, Zap, Info, FlaskConical, Clock, Atom, Microscope, Cog } from "lucide-react";
import { TECHS, TechItem, TechArea, TechCategory } from "@/lib/techData";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Helper for category colors
const getAreaColor = (area: TechArea) => {
  switch(area) {
    case "physics": return "text-blue-500 border-blue-200 bg-blue-50";
    case "society": return "text-green-500 border-green-200 bg-green-50";
    case "engineering": return "text-orange-500 border-orange-200 bg-orange-50";
    default: return "text-slate-500";
  }
};

const getCategoryIcon = (cat: TechCategory) => {
  // Just a visual indicator text for now
  return cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const ResearchCard = ({ 
  item, 
  level, 
  onUpgrade, 
  resources 
}: { 
  item: TechItem, 
  level: number, 
  onUpgrade: (id: string, name: string, time: number) => void, 
  resources: any 
}) => {
  const Icon = item.icon;
  
  const metalCost = Math.floor(item.baseCost.metal * Math.pow(item.costFactor, level));
  const crystalCost = Math.floor(item.baseCost.crystal * Math.pow(item.costFactor, level));
  const deutCost = Math.floor(item.baseCost.deuterium * Math.pow(item.costFactor, level));
  const energyCost = item.baseCost.energy ? Math.floor(item.baseCost.energy * Math.pow(item.costFactor, level)) : 0;
  const buildTime = (level + 1) * 5000; // Mock time 5s

  const canAfford = 
    resources.metal >= metalCost && 
    resources.crystal >= crystalCost && 
    resources.deuterium >= deutCost &&
    (energyCost === 0 || resources.energy >= energyCost);

  const areaColorClass = getAreaColor(item.area);
  const borderColorClass = item.area === "physics" ? "hover:border-blue-400" : item.area === "society" ? "hover:border-green-400" : "hover:border-orange-400";
  const btnColorClass = item.area === "physics" ? "bg-blue-600 hover:bg-blue-700" : item.area === "society" ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700";

  return (
    <Card className={cn("bg-white border-slate-200 transition-all group overflow-hidden shadow-sm flex flex-col h-full", borderColorClass)}>
       <div className={cn("h-32 relative transition-colors duration-500 border-b border-slate-200", areaColorClass.replace("text", "bg").replace("border", "border-transparent"))}>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Icon className="w-20 h-20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Icon className={cn("w-16 h-16", item.area === "physics" ? "text-blue-700" : item.area === "society" ? "text-green-700" : "text-orange-700")} />
          </div>
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-mono font-bold shadow-sm border border-slate-200">
            Level {level}
          </div>
          <div className="absolute top-2 left-2">
             <Badge variant="outline" className="bg-white/80 backdrop-blur border-slate-300 text-slate-700 text-[10px] uppercase">
                {getCategoryIcon(item.category)}
             </Badge>
          </div>
       </div>
       
       <CardHeader className="pb-2">
         <CardTitle className="text-lg font-orbitron text-slate-900">{item.name}</CardTitle>
       </CardHeader>
       
       <CardContent className="pb-2 flex-1">
         <p className="text-xs text-slate-500 mb-4 italic">"{item.description}"</p>
         
         <div className="space-y-3">
            <div className="space-y-1">
               <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                  <Info className="w-3 h-3" /> Research Effects
               </div>
               {item.effects.map((effect, i) => (
                  <div key={i} className="flex justify-between text-xs border-b border-slate-100 pb-1 last:border-0">
                     <span className="text-slate-700 font-medium">{effect.name}</span>
                     <span className={cn("font-mono font-bold", item.area === "physics" ? "text-blue-600" : item.area === "society" ? "text-green-600" : "text-orange-600")}>
                        {effect.value} {effect.perLevel && <span className="text-slate-400 font-normal">({effect.perLevel})</span>}
                     </span>
                  </div>
               ))}
            </div>

            <Separator className="bg-slate-100" />

            <div className="space-y-1">
               <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Cost</div>
               {metalCost > 0 && (
                 <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600"><Box className="w-3 h-3" /> Metal</span>
                    <span className={resources.metal < metalCost ? "text-red-600 font-bold" : "text-slate-900"}>{metalCost.toLocaleString()}</span>
                 </div>
               )}
               {crystalCost > 0 && (
                 <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-blue-600"><Gem className="w-3 h-3" /> Crystal</span>
                    <span className={resources.crystal < crystalCost ? "text-red-600 font-bold" : "text-slate-900"}>{crystalCost.toLocaleString()}</span>
                 </div>
               )}
               {deutCost > 0 && (
                 <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-green-600"><Database className="w-3 h-3" /> Deuterium</span>
                    <span className={resources.deuterium < deutCost ? "text-red-600 font-bold" : "text-slate-900"}>{deutCost.toLocaleString()}</span>
                 </div>
               )}
               {energyCost > 0 && (
                 <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-yellow-600"><Zap className="w-3 h-3" /> Energy</span>
                    <span className={resources.energy < energyCost ? "text-red-600 font-bold" : "text-slate-900"}>{energyCost.toLocaleString()}</span>
                 </div>
               )}
               <div className="flex items-center justify-between text-xs pt-1">
                   <span className="flex items-center gap-2 text-slate-500"><Clock className="w-3 h-3" /> Duration</span>
                   <span className="text-slate-900 font-mono">{buildTime / 1000}s</span>
               </div>
            </div>
         </div>
       </CardContent>
       
       <CardFooter className="pt-2">
         <Button 
            className={cn("w-full text-white font-orbitron tracking-wider", btnColorClass)}
            disabled={!canAfford}
            onClick={() => {
               if (canAfford) {
                  onUpgrade(item.id, item.name, buildTime);
               }
            }}
         >
           {canAfford ? (
             <>
               <ArrowUpCircle className="w-4 h-4 mr-2" /> {level === 0 ? "RESEARCH" : "IMPROVE"}
             </>
           ) : (
             "INSUFFICIENT"
           )}
         </Button>
       </CardFooter>
    </Card>
  );
};

export default function Research() {
  const { research, resources, updateResearch, queue } = useGame();

  const researchQueue = queue.filter(q => q.type === "research");

  const physicsTech = TECHS.filter(r => r.area === "physics");
  const societyTech = TECHS.filter(r => r.area === "society");
  const engineeringTech = TECHS.filter(r => r.area === "engineering");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Technology Division</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Direct our scientific efforts into Physics, Society, and Engineering.</p>
        </div>

        {/* Research Queue */}
        {researchQueue.length > 0 && (
          <Card className="bg-white border-primary/20 shadow-sm mb-6">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                   <FlaskConical className="w-4 h-4" /> Active Research
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-2">
                   {researchQueue.map((item, i) => {
                      const timeLeft = Math.max(0, Math.floor((item.endTime - Date.now()) / 1000));
                      // Find item to get color
                      const techItem = TECHS.find(t => t.id === item.id);
                      const colorClass = techItem?.area === "physics" ? "text-blue-600" : techItem?.area === "society" ? "text-green-600" : "text-orange-600";
                      
                      return (
                         <div key={i} className="flex items-center gap-4 bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded border border-slate-200">
                               <FlaskConical className={cn("w-4 h-4", colorClass)} />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between text-sm font-medium text-slate-900">
                                  <span>{item.name}</span>
                                  <span className="font-mono text-slate-500">{timeLeft}s</span>
                               </div>
                               <Progress value={Math.max(0, 100 - (timeLeft / 5) * 100)} className="h-1 mt-1" />
                            </div>
                         </div>
                      )
                   })}
                </div>
             </CardContent>
          </Card>
        )}

        <Tabs defaultValue="physics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-14 p-1">
            <TabsTrigger value="physics" className="font-orbitron data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 border border-transparent h-full flex gap-2">
               <Atom className="w-5 h-5" /> Physics
            </TabsTrigger>
            <TabsTrigger value="society" className="font-orbitron data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 border border-transparent h-full flex gap-2">
               <Microscope className="w-5 h-5" /> Society
            </TabsTrigger>
            <TabsTrigger value="engineering" className="font-orbitron data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 border border-transparent h-full flex gap-2">
               <Cog className="w-5 h-5" /> Engineering
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
             <TabsContent value="physics" className="mt-0 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {physicsTech.map(item => (
                    <ResearchCard 
                       key={item.id} 
                       item={item} 
                       level={research[item.id] || 0} 
                       onUpgrade={updateResearch} 
                       resources={resources} 
                    />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="society" className="mt-0 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {societyTech.map(item => (
                    <ResearchCard 
                       key={item.id} 
                       item={item} 
                       level={research[item.id] || 0} 
                       onUpgrade={updateResearch} 
                       resources={resources} 
                    />
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="engineering" className="mt-0 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {engineeringTech.map(item => (
                    <ResearchCard 
                       key={item.id} 
                       item={item} 
                       level={research[item.id] || 0} 
                       onUpgrade={updateResearch} 
                       resources={resources} 
                    />
                 ))}
               </div>
             </TabsContent>
          </div>
        </Tabs>

      </div>
    </GameLayout>
  );
}
