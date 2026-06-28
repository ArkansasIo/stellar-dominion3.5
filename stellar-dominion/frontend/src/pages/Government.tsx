import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Landmark, Scale, Users, Building2, ShieldCheck, FileText, 
  AlertTriangle, TrendingUp, TrendingDown, Gavel, Coins
} from "lucide-react";
import { GOVERNMENTS, POLICIES, GovernmentId } from "@/lib/governmentData";
import { cn } from "@/lib/utils";

export default function Government() {
  const { government, setGovernmentType, togglePolicy, setTaxRate } = useGame();

  if (!government?.stats || !government?.type) {
    return <GameLayout><div className="text-center py-12">Loading government data...</div></GameLayout>;
  }

  const activeGov = GOVERNMENTS[government.type];

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Planetary Government</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Manage policies, taxation, and political stability.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Left: Current Government Stats */}
           <Card className="lg:col-span-2 bg-white border-slate-200">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Landmark className="w-5 h-5 text-primary" /> State Overview
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {/* Ruler & Type */}
                 <div className="bg-slate-50 p-6 rounded border border-slate-200 flex items-center justify-between">
                    <div>
                       <div className="text-sm uppercase font-bold text-muted-foreground mb-1">Current Regime</div>
                       <h3 className="text-2xl font-orbitron text-slate-900">{activeGov.name}</h3>
                       <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-slate-900 text-white">{activeGov.rulerTitle}</Badge>
                          <span className="text-sm text-slate-500">{activeGov.description}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm uppercase font-bold text-muted-foreground mb-1">Tax Rate</div>
                       <div className="text-3xl font-mono font-bold text-primary">{government?.taxRate || 0}%</div>
                    </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div>
                          <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                             <span className="flex items-center gap-2"><Scale className="w-4 h-4 text-blue-500" /> Stability</span>
                             <span>{government?.stats?.stability || 50}%</span>
                          </div>
                          <Progress value={government?.stats?.stability || 50} className="h-2 bg-slate-100" />
                          <p className="text-xs text-slate-500 mt-1">Affects overall resource production.</p>
                       </div>
                       <div>
                          <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                             <span className="flex items-center gap-2"><Users className="w-4 h-4 text-green-500" /> Public Support</span>
                             <span>{government?.stats?.publicSupport || 60}%</span>
                          </div>
                          <Progress value={government?.stats?.publicSupport || 60} className="h-2 bg-slate-100" />
                          <p className="text-xs text-slate-500 mt-1">Prevents riots and rebellions.</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                             <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-orange-500" /> Bureaucracy Efficiency</span>
                             <span>{government?.stats?.efficiency || 70}%</span>
                          </div>
                          <Progress value={government?.stats?.efficiency || 70} className="h-2 bg-slate-100" />
                          <p className="text-xs text-slate-500 mt-1">Impacts construction speed.</p>
                       </div>
                       <div>
                          <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                             <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-red-500" /> Military Readiness</span>
                             <span>{government?.stats?.militaryReadiness || 50}%</span>
                          </div>
                          <Progress value={government?.stats?.militaryReadiness || 50} className="h-2 bg-slate-100" />
                          <p className="text-xs text-slate-500 mt-1">Impacts fleet build speed & effectiveness.</p>
                       </div>
                    </div>
                 </div>
                 
                 <Separator />

                 {/* Tax Slider */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="font-bold text-slate-900 flex items-center gap-2"><Coins className="w-4 h-4" /> Taxation Level</label>
                       <span className="text-sm text-muted-foreground">Higher taxes reduce public support.</span>
                    </div>
                    <Slider 
                       value={[government?.taxRate || 0]} 
                       max={100} 
                       step={1} 
                       onValueChange={(v) => setTaxRate(v[0])}
                       className="w-full"
                    />
                 </div>

              </CardContent>
           </Card>

           {/* Right: Reform Government */}
           <Card className="bg-white border-slate-200">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Gavel className="w-5 h-5 text-slate-600" /> Political Reform
                 </CardTitle>
                 <CardDescription>Changing government type causes temporary instability.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {Object.values(GOVERNMENTS).map(gov => (
                    <div 
                       key={gov.id} 
                       className={cn(
                          "p-3 rounded border cursor-pointer transition-all hover:bg-slate-50",
                          government.type === gov.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200"
                       )}
                       onClick={() => setGovernmentType(gov.id)}
                    >
                       <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-slate-900">{gov.name}</span>
                          {government.type === gov.id && <Badge className="bg-primary h-5 text-[10px]">Active</Badge>}
                       </div>
                       <div className="text-xs text-slate-500 space-y-1">
                          <div className="text-green-600 flex gap-1">
                             <TrendingUp className="w-3 h-3" /> {gov.bonuses[0]}
                          </div>
                          <div className="text-red-500 flex gap-1">
                             <TrendingDown className="w-3 h-3" /> {gov.penalties[0]}
                          </div>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>

        {/* Bottom: Policies */}
        <Card className="bg-white border-slate-200">
           <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                 <FileText className="w-5 h-5 text-purple-600" /> Active Policies
              </CardTitle>
              <CardDescription>Enact social and economic policies to fine-tune your empire.</CardDescription>
           </CardHeader>
           <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {POLICIES.map(policy => {
                    const isActive = government.policies.includes(policy.id);
                    return (
                       <div key={policy.id} className="flex items-start justify-between p-4 rounded border border-slate-200 bg-slate-50">
                          <div className="space-y-1">
                             <div className="font-bold text-sm text-slate-900">{policy.name}</div>
                             <div className="text-xs text-slate-500">{policy.description}</div>
                             <div className="text-xs font-mono text-primary font-bold mt-2">{policy.effectDescription}</div>
                          </div>
                          <Switch 
                             checked={isActive}
                             onCheckedChange={() => togglePolicy(policy.id)}
                          />
                       </div>
                    )
                 })}
              </div>
           </CardContent>
        </Card>

      </div>
    </GameLayout>
  );
}
