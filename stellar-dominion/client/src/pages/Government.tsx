import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/lib/gameContext";
import { GOVERNMENTS, POLICIES, GovernmentId } from "@/lib/governmentData";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Gavel, Landmark, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";

type GovernmentSubMenu = "cabinet" | "field" | "policies";

type Leader = {
   id: string;
   name: string;
   type: string;
   class: string;
   subClass: string;
   subType: string;
   governanceStyle: string;
   bonuses: Record<string, number>;
};

type LeadersResponse = {
   success: boolean;
   leaders: Leader[];
   leaderTypes: string[];
};

type AppointmentsResponse = {
   success: boolean;
   appointments: {
      cabinet: Record<string, string>;
      doctrine: {
         civicFocus: string;
         fieldPosture: string;
         civilMandate: string;
      };
   };
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
   const response = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
   });
   const payload = await response.json().catch(() => null);
   if (!response.ok) throw new Error(payload?.message || payload?.error || "Request failed");
   return payload as T;
}

export default function Government() {
   const { government, setGovernmentType, togglePolicy, setTaxRate } = useGame();
   const { toast } = useToast();
   const queryClient = useQueryClient();
   const [activeSubMenu, setActiveSubMenu] = useState<GovernmentSubMenu>("cabinet");

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") || params.get("sub");
      if (tabParam === "cabinet" || tabParam === "field" || tabParam === "policies") {
         setActiveSubMenu(tabParam);
      }
   }, []);

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("tab", activeSubMenu);
      params.delete("sub");

      const nextUrl = `/government?${params.toString()}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (currentUrl !== nextUrl) {
         window.history.replaceState(null, "", nextUrl);
      }
   }, [activeSubMenu]);

   const leadersQuery = useQuery<LeadersResponse>({
      queryKey: ["government-leaders"],
      queryFn: () => fetchJson<LeadersResponse>("/api/government-leaders"),
   });

   const appointmentsQuery = useQuery<AppointmentsResponse>({
      queryKey: ["government-appointments"],
      queryFn: () => fetchJson<AppointmentsResponse>("/api/government-leaders/appointments/me"),
   });

   const updateAppointmentsMutation = useMutation({
      mutationFn: (payload: AppointmentsResponse["appointments"]) =>
         fetchJson<AppointmentsResponse>("/api/government-leaders/appointments/me", {
            method: "PUT",
            body: JSON.stringify(payload),
         }),
      onSuccess: () => {
         toast({ title: "Government updated", description: "Cabinet and doctrine submenus synchronized." });
         queryClient.invalidateQueries({ queryKey: ["government-appointments"] });
      },
      onError: (error: Error) => {
         toast({ title: "Update failed", description: error.message, variant: "destructive" });
      },
   });

   if (!government?.stats || !government?.type) {
      return <GameLayout><div className="text-center py-12">Loading government data...</div></GameLayout>;
   }

   const activeGov = GOVERNMENTS[government.type];
   const appointments = appointmentsQuery.data?.appointments;
   const leaders = leadersQuery.data?.leaders || [];
   const leaderTypes = leadersQuery.data?.leaderTypes || [];

   return (
      <GameLayout>
         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
               <h2 className="text-3xl font-orbitron font-bold text-slate-900">Planetary Government</h2>
               <p className="text-muted-foreground font-rajdhani text-lg">Manage regime, cabinet, civil doctrine, and field posture through nested sub-menus.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <Card className="lg:col-span-2 bg-white border-slate-200">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-slate-900"><Landmark className="w-5 h-5 text-primary" /> State Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                           <div className="text-3xl font-mono font-bold text-primary">{government.taxRate || 0}%</div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <div className="flex justify-between text-sm font-bold text-slate-700 mb-1"><span>Stability</span><span>{government.stats.stability}%</span></div>
                           <Progress value={government.stats.stability} className="h-2 mb-1" />
                           <p className="text-xs text-slate-500">Civil systems and policy cohesion.</p>
                        </div>
                        <div>
                           <div className="flex justify-between text-sm font-bold text-slate-700 mb-1"><span>Public Support</span><span>{government.stats.publicSupport}%</span></div>
                           <Progress value={government.stats.publicSupport} className="h-2 mb-1" />
                           <p className="text-xs text-slate-500">Field morale and internal order.</p>
                        </div>
                        <div>
                           <div className="flex justify-between text-sm font-bold text-slate-700 mb-1"><span>Efficiency</span><span>{government.stats.efficiency}%</span></div>
                           <Progress value={government.stats.efficiency} className="h-2 mb-1" />
                           <p className="text-xs text-slate-500">Bureaucracy and building execution.</p>
                        </div>
                        <div>
                           <div className="flex justify-between text-sm font-bold text-slate-700 mb-1"><span>Military Readiness</span><span>{government.stats.militaryReadiness}%</span></div>
                           <Progress value={government.stats.militaryReadiness} className="h-2 mb-1" />
                           <p className="text-xs text-slate-500">Field command and reserve posture.</p>
                        </div>
                     </div>

                     <Separator />

                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <label className="font-bold text-slate-900">Taxation Level</label>
                           <span className="text-sm text-muted-foreground">Higher taxes reduce public support.</span>
                        </div>
                        <Slider value={[government.taxRate || 0]} max={100} step={1} onValueChange={(value) => setTaxRate(value[0])} className="w-full" />
                     </div>
                  </CardContent>
               </Card>

               <Card className="bg-white border-slate-200">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-slate-900"><Gavel className="w-5 h-5 text-slate-600" /> Political Reform</CardTitle>
                     <CardDescription>Changing government type causes temporary instability.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {Object.values(GOVERNMENTS).map((gov) => (
                        <div
                           key={gov.id}
                           className={cn(
                              "p-3 rounded border cursor-pointer transition-all hover:bg-slate-50",
                              government.type === gov.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200"
                           )}
                           onClick={() => setGovernmentType(gov.id as GovernmentId)}
                        >
                           <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-sm text-slate-900">{gov.name}</span>
                              {government.type === gov.id && <Badge className="bg-primary h-5 text-[10px]">Active</Badge>}
                           </div>
                           <div className="text-xs text-slate-500">{gov.description}</div>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </div>

            <Tabs value={activeSubMenu} onValueChange={(value) => setActiveSubMenu(value as GovernmentSubMenu)}>
               <TabsList className="grid w-full grid-cols-3 lg:w-[520px]">
                  <TabsTrigger value="cabinet">Cabinet</TabsTrigger>
                  <TabsTrigger value="field">Field Doctrine</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
               </TabsList>

               <TabsContent value="cabinet" className="mt-4">
                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900"><Users className="w-5 h-5" /> Government Sub-Menu</CardTitle>
                        <CardDescription>Assign leaders to strategic cabinet seats across civil, field, and building domains.</CardDescription>
                     </CardHeader>
                     <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {leaderTypes.slice(0, 6).map((leaderType) => {
                           const slotValue = appointments?.cabinet?.[leaderType] || "unassigned";
                           const filtered = leaders.filter((leader) => leader.type === leaderType);
                           return (
                              <div key={leaderType} className="rounded border border-slate-200 p-4 bg-slate-50 space-y-2">
                                 <div className="font-semibold text-slate-900">{leaderType}</div>
                                 <Select
                                    value={slotValue}
                                    onValueChange={(value) =>
                                       updateAppointmentsMutation.mutate({
                                          cabinet: { ...(appointments?.cabinet || {}), [leaderType]: value === "unassigned" ? "" : value },
                                          doctrine: appointments?.doctrine || { civicFocus: "balanced", fieldPosture: "defensive", civilMandate: "growth" },
                                       })
                                    }
                                 >
                                    <SelectTrigger><SelectValue placeholder="Assign leader" /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="unassigned">Unassigned</SelectItem>
                                       {filtered.map((leader) => (
                                          <SelectItem key={leader.id} value={leader.id}>{leader.name}</SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 <div className="text-xs text-slate-500">Seat controls sub-menu bonuses for civil order, field response, and bureaucracy.</div>
                              </div>
                           );
                        })}
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="field" className="mt-4">
                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900"><ShieldCheck className="w-5 h-5" /> Field and Civil Doctrine Sub-Menu</CardTitle>
                     </CardHeader>
                     <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded border border-slate-200 p-4 bg-slate-50 space-y-2">
                           <div className="font-semibold text-slate-900">Civic Focus</div>
                           <Select
                              value={appointments?.doctrine?.civicFocus || "balanced"}
                              onValueChange={(value) => updateAppointmentsMutation.mutate({ cabinet: appointments?.cabinet || {}, doctrine: { ...(appointments?.doctrine || {}), civicFocus: value, fieldPosture: appointments?.doctrine?.fieldPosture || "defensive", civilMandate: appointments?.doctrine?.civilMandate || "growth" } })}
                           >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="balanced">Balanced</SelectItem>
                                 <SelectItem value="expansion">Expansion</SelectItem>
                                 <SelectItem value="research">Research</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="rounded border border-slate-200 p-4 bg-slate-50 space-y-2">
                           <div className="font-semibold text-slate-900">Field Posture</div>
                           <Select
                              value={appointments?.doctrine?.fieldPosture || "defensive"}
                              onValueChange={(value) => updateAppointmentsMutation.mutate({ cabinet: appointments?.cabinet || {}, doctrine: { ...(appointments?.doctrine || {}), civicFocus: appointments?.doctrine?.civicFocus || "balanced", fieldPosture: value, civilMandate: appointments?.doctrine?.civilMandate || "growth" } })}
                           >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="defensive">Defensive</SelectItem>
                                 <SelectItem value="expeditionary">Expeditionary</SelectItem>
                                 <SelectItem value="rapid-response">Rapid Response</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="rounded border border-slate-200 p-4 bg-slate-50 space-y-2">
                           <div className="font-semibold text-slate-900">Civil Mandate</div>
                           <Select
                              value={appointments?.doctrine?.civilMandate || "growth"}
                              onValueChange={(value) => updateAppointmentsMutation.mutate({ cabinet: appointments?.cabinet || {}, doctrine: { ...(appointments?.doctrine || {}), civicFocus: appointments?.doctrine?.civicFocus || "balanced", fieldPosture: appointments?.doctrine?.fieldPosture || "defensive", civilMandate: value } })}
                           >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="growth">Growth</SelectItem>
                                 <SelectItem value="compliance">Compliance</SelectItem>
                                 <SelectItem value="infrastructure">Infrastructure</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="policies" className="mt-4">
                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900"><Building2 className="w-5 h-5" /> Policy Sub-Menu</CardTitle>
                        <CardDescription>Enact social and economic policies to fine-tune your empire.</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {POLICIES.map((policy) => {
                              const isActive = government.policies.includes(policy.id);
                              return (
                                 <div key={policy.id} className="flex items-start justify-between p-4 rounded border border-slate-200 bg-slate-50">
                                    <div className="space-y-1">
                                       <div className="font-bold text-sm text-slate-900">{policy.name}</div>
                                       <div className="text-xs text-slate-500">{policy.description}</div>
                                       <div className="text-xs font-mono text-primary font-bold mt-2">{policy.effectDescription}</div>
                                    </div>
                                    <Switch checked={isActive} onCheckedChange={() => togglePolicy(policy.id)} />
                                 </div>
                              );
                           })}
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>
            </Tabs>
         </div>
      </GameLayout>
   );
}
