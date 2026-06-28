import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Save, Wand2, Users, RefreshCw, AlertTriangle } from "lucide-react";
import type { AdminAuditResponse, AdminOperationsResponse, DeveloperShortcutsResponse, RulesContent } from "./types";

type Props = {
  auditData: AdminAuditResponse | undefined;
  operationsData: AdminOperationsResponse | undefined;
  devData: DeveloperShortcutsResponse | undefined;
  canViewAudit: boolean;
  canUseMasquerade: boolean;
  canUseWorldTools: boolean;
  canUseLiveOps: boolean;
  privilegedSessionFresh: boolean;
  onImpersonate: (identifier: string) => void;
  onStopImpersonation: () => void;
  onShortcut: (url: string, payload?: Record<string, unknown>) => void;
  rulesForm: RulesContent;
  setRulesForm: React.Dispatch<React.SetStateAction<RulesContent>>;
  onSaveRules: () => void;
  rulesPending: boolean;
  statusData?: { data: { healthCheck: { checks: Record<string, { status: string; message?: string }> } } };
};

export function AuditTab({
  auditData, operationsData, devData, canViewAudit, canUseMasquerade, canUseWorldTools, canUseLiveOps, privilegedSessionFresh,
  onImpersonate, onStopImpersonation, onShortcut, rulesForm, setRulesForm, onSaveRules, rulesPending, statusData,
}: Props) {
  const [auditFilterUser, setAuditFilterUser] = useState("");
  const [auditFilterAction, setAuditFilterAction] = useState("all");
  const [targetId, setTargetId] = useState("");
  const [resourceForm, setResourceForm] = useState({ metal: "0", crystal: "0", deuterium: "0", energy: "0", credits: "0", food: "0", water: "0", darkMatter: "0" });
  const [buildingKey, setBuildingKey] = useState("metalMine");
  const [buildingLevel, setBuildingLevel] = useState("30");
  const [researchKey, setResearchKey] = useState("energyTech");
  const [researchLevel, setResearchLevel] = useState("10");
  const [unitId, setUnitId] = useState("lightFighter");
  const [unitAmount, setUnitAmount] = useState("100");
  const [worldType, setWorldType] = useState<"planet" | "moon" | "debris">("planet");
  const [worldCoords, setWorldCoords] = useState("1:1:1");
  const [worldName, setWorldName] = useState("Admin Created World Object");

  const logs = (auditData?.logs || []).filter((l) => {
    const matchUser = !auditFilterUser || l.actorId.includes(auditFilterUser) || (l.targetUserId || "").includes(auditFilterUser);
    const matchAction = auditFilterAction === "all" || l.action === auditFilterAction;
    return matchUser && matchAction;
  });

  const exportCsv = () => {
    const header = "timestamp,actor,action,target,details";
    const rows = logs.map((l) => `${new Date(l.timestamp).toISOString()},${l.actorId},${l.action},${l.targetUserId || ""},${l.details || ""}`);
    const blob = new Blob([`${header}\n${rows.join("\n")}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4">
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardHeader><CardTitle className="text-slate-100 text-lg">Action Log</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input value={auditFilterUser} onChange={(e) => setAuditFilterUser(e.target.value)} placeholder="Filter by user..." className="pl-9 bg-slate-800 border-slate-700 text-slate-200" />
              </div>
              <Select value={auditFilterAction} onValueChange={setAuditFilterAction}>
                <SelectTrigger className="w-[160px] bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="ban">Ban</SelectItem>
                  <SelectItem value="unban">Unban</SelectItem>
                  <SelectItem value="mute">Mute</SelectItem>
                  <SelectItem value="impersonate">Impersonate</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                  <SelectItem value="broadcast">Broadcast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {canViewAudit ? (
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-800/50 hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Time</TableHead>
                      <TableHead className="text-slate-400">Action</TableHead>
                      <TableHead className="text-slate-400">Target</TableHead>
                      <TableHead className="text-slate-400">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700/50 hover:bg-slate-800/30">
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-slate-200">{log.action}</TableCell>
                        <TableCell className="text-xs text-slate-500">{log.targetUserId || "-"}</TableCell>
                        <TableCell className="text-sm text-slate-400 max-w-[200px] truncate">{log.details || "-"}</TableCell>
                      </TableRow>
                    ))}
                    {logs.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-8">No audit logs found</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="rounded-lg border border-amber-800 bg-amber-950/50 px-3 py-2 text-sm text-amber-300">Audit visibility is disabled by the current control-plane posture for this session.</div>
            )}
            <Button variant="outline" className="border-slate-700 text-slate-300" onClick={exportCsv}><Download className="w-4 h-4 mr-2" /> Export Audit Log</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader><CardTitle className="text-slate-100 text-lg">Operation Queue</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {(operationsData?.operations || []).map((op) => (
                    <div key={op.id} className="border border-slate-700/50 rounded-lg p-3 bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200">{op.type}</span>
                        <Badge variant="outline" className={`${op.status === "completed" ? "border-green-700 text-green-400" : op.status === "pending" ? "border-amber-700 text-amber-400" : "border-slate-600 text-slate-400"}`}>{op.status}</Badge>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{new Date(op.requestedAt).toLocaleString()} · {op.requestedBy}</div>
                      {op.notes && <div className="text-sm text-slate-400 mt-1">{op.notes}</div>}
                    </div>
                  ))}
                  {(operationsData?.operations || []).length === 0 && <div className="text-slate-500 text-sm">No operations</div>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader><CardTitle className="text-slate-100 text-lg">System Health</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(statusData?.data.healthCheck.checks || {}).map(([key, check]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${check.status === "ok" ? "bg-green-500" : check.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
                  <div className="flex-1">
                    <div className="text-sm text-slate-300 capitalize">{key}</div>
                    <div className="text-xs text-slate-500">{check.message || "No issues"}</div>
                  </div>
                  <Badge variant="outline" className={`${check.status === "ok" ? "border-green-700 text-green-400" : check.status === "warning" ? "border-amber-700 text-amber-400" : "border-red-700 text-red-400"}`}>{check.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader><CardTitle className="text-slate-100 text-lg">Developer Shortcuts</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-400">Target Player</Label>
                <Input value={targetId} onChange={(e) => setTargetId(e.target.value)} placeholder="username, email, or user id" className="mt-1 bg-slate-800 border-slate-700 text-slate-200" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => onImpersonate(targetId)} disabled={!targetId || !canUseMasquerade || !privilegedSessionFresh}>
                  <Users className="w-3.5 h-3.5 mr-1" /> Impersonate
                </Button>
                <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={onStopImpersonation}>Restore</Button>
                {(devData?.presets || []).map((preset) => (
                  <Button key={preset.id} size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => onShortcut("/api/admin/developer-shortcuts/apply-preset", { identifier: targetId, preset: preset.id })} disabled={!targetId || !canUseWorldTools || !privilegedSessionFresh}>
                    <Wand2 className="w-3.5 h-3.5 mr-1" /> {preset.label}
                  </Button>
                ))}
              </div>
              <Separator className="bg-slate-700/50" />
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(resourceForm).map(([key, value]) => (
                  <div key={key}>
                    <Label className="text-xs text-slate-500">{key}</Label>
                    <Input value={value} onChange={(e) => setResourceForm((p) => ({ ...p, [key]: e.target.value }))} className="mt-0.5 bg-slate-800 border-slate-700 text-slate-200" />
                  </div>
                ))}
              </div>
              <Button size="sm" onClick={() => onShortcut("/api/admin/developer-shortcuts/grant-resources", { identifier: targetId, resources: resourceForm })} disabled={!targetId || !canUseWorldTools || !privilegedSessionFresh} className="bg-purple-600 hover:bg-purple-500">Grant Resources</Button>
              <Separator className="bg-slate-700/50" />
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
                  <div><Label className="text-xs text-slate-500">Building</Label><Input value={buildingKey} onChange={(e) => setBuildingKey(e.target.value)} list="building-catalog" className="mt-0.5 bg-slate-800 border-slate-700 text-slate-200" /></div>
                  <div><Label className="text-xs text-slate-500">Level</Label><Input value={buildingLevel} onChange={(e) => setBuildingLevel(e.target.value)} className="mt-0.5 w-20 bg-slate-800 border-slate-700 text-slate-200" /></div>
                  <Button size="sm" onClick={() => onShortcut("/api/admin/developer-shortcuts/set-building-level", { identifier: targetId, buildingKey, level: buildingLevel })} disabled={!targetId || !canUseWorldTools || !privilegedSessionFresh}>Set</Button>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
                  <div><Label className="text-xs text-slate-500">Research</Label><Input value={researchKey} onChange={(e) => setResearchKey(e.target.value)} list="research-catalog" className="mt-0.5 bg-slate-800 border-slate-700 text-slate-200" /></div>
                  <div><Label className="text-xs text-slate-500">Level</Label><Input value={researchLevel} onChange={(e) => setResearchLevel(e.target.value)} className="mt-0.5 w-20 bg-slate-800 border-slate-700 text-slate-200" /></div>
                  <Button size="sm" onClick={() => onShortcut("/api/admin/developer-shortcuts/set-research-level", { identifier: targetId, researchKey, level: researchLevel })} disabled={!targetId || !canUseWorldTools || !privilegedSessionFresh}>Set</Button>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
                  <div><Label className="text-xs text-slate-500">Unit</Label><Input value={unitId} onChange={(e) => setUnitId(e.target.value)} list="unit-catalog" className="mt-0.5 bg-slate-800 border-slate-700 text-slate-200" /></div>
                  <div><Label className="text-xs text-slate-500">Amount</Label><Input value={unitAmount} onChange={(e) => setUnitAmount(e.target.value)} className="mt-0.5 w-20 bg-slate-800 border-slate-700 text-slate-200" /></div>
                  <Button size="sm" onClick={() => onShortcut("/api/admin/developer-shortcuts/add-unit", { identifier: targetId, unitId, amount: unitAmount })} disabled={!targetId || !canUseWorldTools || !privilegedSessionFresh}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["resources", "units", "buildings", "research"].map((scope) => (
                    <Button key={scope} size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => onShortcut("/api/admin/developer-shortcuts/reset-player", { identifier: targetId, scope })} disabled={!targetId || !canUseWorldTools || !privilegedSessionFresh}>Reset {scope}</Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <div><Label className="text-xs text-slate-500">World Type</Label><Input value={worldType} onChange={(e) => setWorldType(e.target.value as "planet" | "moon" | "debris")} className="mt-0.5 bg-slate-800 border-slate-700 text-slate-200" /></div>
                  <div><Label className="text-xs text-slate-500">Coordinates</Label><Input value={worldCoords} onChange={(e) => setWorldCoords(e.target.value)} className="mt-0.5 bg-slate-800 border-slate-700 text-slate-200" /></div>
                  <div><Label className="text-xs text-slate-500">Name</Label><Input value={worldName} onChange={(e) => setWorldName(e.target.value)} className="mt-0.5 bg-slate-800 border-slate-700 text-slate-200" /></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onShortcut("/api/admin/developer-shortcuts/world-object", { action: "create", type: worldType, coordinates: worldCoords, name: worldName })} disabled={!canUseWorldTools || !privilegedSessionFresh}>Create Object</Button>
                  <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => onShortcut("/api/admin/developer-shortcuts/world-object", { action: "delete", type: worldType, coordinates: worldCoords, name: worldName })} disabled={!canUseWorldTools || !privilegedSessionFresh}>Delete Object</Button>
                </div>
              </div>
              <datalist id="building-catalog">{(devData?.buildingCatalog || []).map((e) => <option key={e} value={e} />)}</datalist>
              <datalist id="research-catalog">{(devData?.researchCatalog || []).map((e) => <option key={e} value={e} />)}</datalist>
              <datalist id="unit-catalog">{(devData?.unitCatalog || []).map((e) => <option key={e} value={e} />)}</datalist>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader><CardTitle className="text-slate-100 text-lg">Rules & Legal Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[["rulesContent", "Rules"], ["legalContent", "Legal"], ["privacyPolicyContent", "Privacy Policy"], ["termsContent", "Terms & Conditions"], ["contactContent", "Contact"]].map(([key, label]) => (
            <div key={key}>
              <Label className="text-slate-400">{label}</Label>
              <Textarea value={rulesForm[key as keyof RulesContent]} onChange={(e) => setRulesForm((p) => ({ ...p, [key]: e.target.value }))} className="mt-1 min-h-24 bg-slate-800 border-slate-700 text-slate-200" />
            </div>
          ))}
          <Button onClick={onSaveRules} disabled={rulesPending} className="bg-emerald-600 hover:bg-emerald-500"><Save className="w-4 h-4 mr-2" /> Save Content</Button>
        </CardContent>
      </Card>
    </div>
  );
}
