import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Save } from "lucide-react";
import type { AdminControlPlaneState } from "@/lib/adminControlSystems";

type Props = {
  controlPlaneForm: AdminControlPlaneState;
  setControlPlaneForm: React.Dispatch<React.SetStateAction<AdminControlPlaneState>>;
  updateControlPlane: (payload: {
    featureFlags?: Partial<AdminControlPlaneState["featureFlags"]>;
    security?: Partial<AdminControlPlaneState["security"]>;
    broadcast?: Partial<AdminControlPlaneState["broadcast"]>;
    liveOps?: Partial<AdminControlPlaneState["liveOps"]>;
    support?: Partial<AdminControlPlaneState["support"]>;
  }) => void;
  onApplyBroadcast: () => void;
  onDisableBanner: () => void;
  broadcastPending: boolean;
  canUseLiveOps: boolean;
  privilegedSessionFresh: boolean;
  seasonName: string;
  setSeasonName: (v: string) => void;
  seasonActive: boolean;
  setSeasonActive: (v: boolean) => void;
  onSaveSeason: () => void;
};

export function LiveOpsTab({
  controlPlaneForm, setControlPlaneForm, updateControlPlane, onApplyBroadcast, onDisableBanner, broadcastPending,
  canUseLiveOps, privilegedSessionFresh, seasonName, setSeasonName, seasonActive, setSeasonActive, onSaveSeason,
}: Props) {
  const bc = controlPlaneForm.broadcast;
  const lo = controlPlaneForm.liveOps;
  const sec = controlPlaneForm.security;
  const sp = controlPlaneForm.support;

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader><CardTitle className="text-slate-100 text-lg">LiveOps Control</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div>
              <Label className="text-slate-400">Event Preset</Label>
              <Select value={lo.eventPreset} onValueChange={(v) => updateControlPlane({ liveOps: { eventPreset: v as AdminControlPlaneState["liveOps"]["eventPreset"] } })}>
                <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="boosted">Boosted</SelectItem>
                  <SelectItem value="war-economy">War Economy</SelectItem>
                  <SelectItem value="recovery">Recovery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-400">Drop Rate %</Label>
              <Input value={String(lo.dropRateModifier)} onChange={(e) => setControlPlaneForm((p) => ({ ...p, liveOps: { ...p.liveOps, dropRateModifier: Number(e.target.value) || 0 } }))} onBlur={() => updateControlPlane({ liveOps: { dropRateModifier: lo.dropRateModifier } })} className="mt-1 bg-slate-800 border-slate-700 text-slate-200" />
            </div>
            <div>
              <Label className="text-slate-400">Build Rate %</Label>
              <Input value={String(lo.buildRateModifier)} onChange={(e) => setControlPlaneForm((p) => ({ ...p, liveOps: { ...p.liveOps, buildRateModifier: Number(e.target.value) || 0 } }))} onBlur={() => updateControlPlane({ liveOps: { buildRateModifier: lo.buildRateModifier } })} className="mt-1 bg-slate-800 border-slate-700 text-slate-200" />
            </div>
            <div>
              <Label className="text-slate-400">Turn Multiplier %</Label>
              <Input value={String(lo.turnMultiplier)} onChange={(e) => setControlPlaneForm((p) => ({ ...p, liveOps: { ...p.liveOps, turnMultiplier: Number(e.target.value) || 0 } }))} onBlur={() => updateControlPlane({ liveOps: { turnMultiplier: lo.turnMultiplier } })} className="mt-1 bg-slate-800 border-slate-700 text-slate-200" />
            </div>
          </div>
          <div>
            <Label className="text-slate-400">Upkeep Modifier %</Label>
            <Input value={String(lo.upkeepModifier)} onChange={(e) => setControlPlaneForm((p) => ({ ...p, liveOps: { ...p.liveOps, upkeepModifier: Number(e.target.value) || 0 } }))} onBlur={() => updateControlPlane({ liveOps: { upkeepModifier: lo.upkeepModifier } })} className="mt-1 w-48 bg-slate-800 border-slate-700 text-slate-200" />
          </div>
          <Separator className="bg-slate-700/50" />
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Season Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end">
              <div>
                <Label className="text-slate-400">Season Name</Label>
                <Input value={seasonName} onChange={(e) => setSeasonName(e.target.value)} placeholder="Season 1" className="mt-1 bg-slate-800 border-slate-700 text-slate-200" />
              </div>
              <div className="flex items-center gap-2 pb-0.5">
                <Switch checked={seasonActive} onCheckedChange={setSeasonActive} />
                <span className="text-sm text-slate-400">Active</span>
              </div>
              <Button onClick={onSaveSeason} disabled={!canUseLiveOps || !privilegedSessionFresh}>Save Season</Button>
            </div>
          </div>
          <Separator className="bg-slate-700/50" />
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Broadcast Center</h3>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <Label className="text-slate-400">Banner Title</Label>
                <Input value={bc.title} onChange={(e) => setControlPlaneForm((p) => ({ ...p, broadcast: { ...p.broadcast, title: e.target.value } }))} className="mt-1 bg-slate-800 border-slate-700 text-slate-200" />
              </div>
              <div>
                <Label className="text-slate-400">Severity</Label>
                <Select value={bc.severity} onValueChange={(v) => setControlPlaneForm((p) => ({ ...p, broadcast: { ...p.broadcast, severity: v as AdminControlPlaneState["broadcast"]["severity"] } }))}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400">Audience</Label>
                <Select value={bc.audience} onValueChange={(v) => setControlPlaneForm((p) => ({ ...p, broadcast: { ...p.broadcast, audience: v as AdminControlPlaneState["broadcast"]["audience"] } }))}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="admins">Admins</SelectItem>
                    <SelectItem value="active-players">Active Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-slate-400">Banner Body</Label>
              <Textarea value={bc.body} onChange={(e) => setControlPlaneForm((p) => ({ ...p, broadcast: { ...p.broadcast, body: e.target.value } }))} className="mt-1 min-h-24 bg-slate-800 border-slate-700 text-slate-200" />
            </div>
            <div className="mt-3 flex items-center justify-between border border-slate-700/50 rounded-lg p-3 bg-slate-800/30">
              <span className="text-sm text-slate-300">Broadcast Enabled</span>
              <Switch checked={bc.enabled} onCheckedChange={(c) => setControlPlaneForm((p) => ({ ...p, broadcast: { ...p.broadcast, enabled: c } }))} />
            </div>
            <div className="mt-3 flex gap-2">
              <Button onClick={onApplyBroadcast} disabled={broadcastPending} className="bg-emerald-600 hover:bg-emerald-500"><RefreshCw className="w-4 h-4 mr-2" /> Apply Broadcast</Button>
              <Button variant="outline" className="border-slate-700 text-slate-300" onClick={onDisableBanner}>Disable Banner</Button>
            </div>
          </div>
          <Separator className="bg-slate-700/50" />
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Security & Approval</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-slate-400">Threat Level</Label>
                <Select value={sec.threatLevel} onValueChange={(v) => updateControlPlane({ security: { threatLevel: v as AdminControlPlaneState["security"]["threatLevel"] } })}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="guarded">Guarded</SelectItem>
                    <SelectItem value="elevated">Elevated</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400">Approval Mode</Label>
                <Select value={sec.commandApprovalMode} onValueChange={(v) => updateControlPlane({ security: { commandApprovalMode: v as AdminControlPlaneState["security"]["commandApprovalMode"] } })}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="dual">Dual</SelectItem>
                    <SelectItem value="founder">Founder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400">Session Timeout (min)</Label>
                <Input value={String(sec.privilegedSessionTimeoutMinutes)} onChange={(e) => setControlPlaneForm((p) => ({ ...p, security: { ...p.security, privilegedSessionTimeoutMinutes: Number(e.target.value) || 0 } }))} onBlur={() => updateControlPlane({ security: { privilegedSessionTimeoutMinutes: sec.privilegedSessionTimeoutMinutes } })} className="mt-1 bg-slate-800 border-slate-700 text-slate-200" />
              </div>
              <div>
                <Label className="text-slate-400">Audit Retention Days</Label>
                <Input value={String(sec.auditRetentionDays)} onChange={(e) => setControlPlaneForm((p) => ({ ...p, security: { ...p.security, auditRetentionDays: Number(e.target.value) || 0 } }))} onBlur={() => updateControlPlane({ security: { auditRetentionDays: sec.auditRetentionDays } })} className="mt-1 bg-slate-800 border-slate-700 text-slate-200" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {[["adminBroadcastEnabled", "Admin Broadcast"], ["allowMasquerade", "Masquerade"], ["advancedWorldTools", "Advanced World Tools"], ["liveOpsOverridesEnabled", "LiveOps Overrides"], ["incidentLockdownEnabled", "Incident Lockdown"], ["auditStreamVisible", "Audit Stream Visible"]].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between border border-slate-700/50 rounded-lg p-3 bg-slate-800/30">
                  <span className="text-sm text-slate-300">{label}</span>
                  <Switch checked={Boolean(controlPlaneForm.featureFlags[key as keyof AdminControlPlaneState["featureFlags"]])} onCheckedChange={(c) => updateControlPlane({ featureFlags: { [key]: c } as Partial<AdminControlPlaneState["featureFlags"]> })} />
                </div>
              ))}
            </div>
          </div>
          <Separator className="bg-slate-700/50" />
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Support Routing</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-slate-400">Ticket Queue Mode</Label>
                <Select value={sp.ticketQueueMode} onValueChange={(v) => updateControlPlane({ support: { ticketQueueMode: v as AdminControlPlaneState["support"]["ticketQueueMode"] } })}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="triage">Triage</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400">Escalation Policy</Label>
                <Select value={sp.escalationPolicy} onValueChange={(v) => updateControlPlane({ support: { escalationPolicy: v as AdminControlPlaneState["support"]["escalationPolicy"] } })}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="fast-track">Fast Track</SelectItem>
                    <SelectItem value="founder-review">Founder Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400">Player Visibility</Label>
                <Select value={sp.playerVisibility} onValueChange={(v) => updateControlPlane({ support: { playerVisibility: v as AdminControlPlaneState["support"]["playerVisibility"] } })}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
