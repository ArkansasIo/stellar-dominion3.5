import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Award, CalendarDays, CheckCircle2, Compass, Crown, Flag, LifeBuoy, Medal, Plus, Rocket, Send, ShieldCheck, Sparkles, Trophy, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface RoadmapData {
  arcs: Array<{ id: string; title: string; subtitle: string; chapters: number; theme: string; status: string; rewardTrack: string[] }>;
  tutorialMissions: Array<{ id: string; order: number; title: string; objective: string; system: string; reward: string }>;
  competitionTypes: Array<{ id: string; name: string; description: string; scoring: string; maxParticipants: number; entryCost: number }>;
  competitions: Array<{ id: string; typeId: string; name: string; description: string; participants: string[]; status: string; endsAt: string }>;
  globalEvents: Array<{ id: string; name: string; description: string; durationHours: number; objective: string; status: string; reward: string }>;
  season: { name: string; xp: number; rewards: Array<{ tier: number; xpRequired: number; freeReward: string; premiumReward: string }>; claimedTiers: number[] };
  achievements: Array<{ id: string; title: string; description: string; category: string; target: number; reward: string; completed: boolean }>;
  releaseGates: Array<{ id: string; label: string; target: string; status: string }>;
  locales: Array<{ code: string; name: string; status: string }>;
  state: { tutorialCompleted: string[]; joinedEvents: string[]; joinedCompetitions: string[]; campaignProgress: Record<string, number> };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(options?.headers || {}) }, ...options });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || body.message || `Request failed (${response.status})`);
  return body as T;
}

function statusClass(status: string): string {
  if (status === "active" || status === "complete") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export default function RoadmapHub() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [competitionName, setCompetitionName] = useState("");
  const [competitionType, setCompetitionType] = useState("fleet-trials");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const load = async () => {
    try { setData(await request<RoadmapData>("/api/roadmap/overview")); setError(null); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to load roadmap hub"); }
  };
  useEffect(() => { void load(); }, []);

  const tutorialProgress = useMemo(() => data ? Math.round((data.state.tutorialCompleted.length / data.tutorialMissions.length) * 100) : 0, [data]);
  const seasonProgress = data ? Math.min(100, Math.round((data.season.xp / 30_000) * 100)) : 0;

  const mutate = async (key: string, url: string, options: RequestInit = {}) => {
    setBusy(key); setError(null);
    try { await request(url, options); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Action failed"); }
    finally { setBusy(null); }
  };

  const createCompetition = async () => {
    await mutate("create-competition", "/api/roadmap/competitions", { method: "POST", body: JSON.stringify({ name: competitionName, typeId: competitionType }) });
    setCompetitionName("");
  };

  const submitTicket = async () => {
    await mutate("support-ticket", "/api/roadmap/support/tickets", { method: "POST", body: JSON.stringify({ subject: ticketSubject, message: ticketMessage, category: "gameplay" }) });
    setTicketSubject(""); setTicketMessage("");
  };

  if (!data && !error) return <div className="p-8 text-slate-500">Loading live-operations systems…</div>;
  if (!data) return <div className="p-8"><Card><CardContent className="p-6 text-red-600">{error}</CardContent></Card></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <section className="rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2"><Badge className="border-blue-300/30 bg-blue-400/20 text-blue-100"><Rocket className="mr-1 h-3 w-3" /> v1.0 release candidate</Badge><Badge className="border-emerald-300/30 bg-emerald-400/20 text-emerald-100">Live operations online</Badge></div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Roadmap Command Hub</h1>
              <p className="mt-3 max-w-3xl text-blue-100">Missions, campaigns, player competitions, seasons, achievements, onboarding, support, and launch readiness in one command surface.</p>
            </div>
            <Link href="/diagnostics"><Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20"><ShieldCheck className="mr-2 h-4 w-4" /> System diagnostics</Button></Link>
          </div>
          {error && <div className="mt-5 rounded-lg border border-red-300/30 bg-red-400/20 p-3 text-sm text-red-100" role="alert">{error}</div>}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{ label: "Tutorial progress", value: `${data.state.tutorialCompleted.length}/${data.tutorialMissions.length}`, icon: Compass, progress: tutorialProgress }, { label: "Season XP", value: data.season.xp.toLocaleString(), icon: Crown, progress: seasonProgress }, { label: "Active events", value: data.globalEvents.filter((event) => event.status === "active").length, icon: CalendarDays }, { label: "Achievement milestones", value: `${data.achievements.filter((achievement) => achievement.completed).length}/${data.achievements.length}`, icon: Award }].map((item) => <Card key={item.label}><CardContent className="p-5"><div className="flex items-center justify-between"><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</div><item.icon className="h-5 w-5 text-blue-600" /></div><div className="mt-2 text-2xl font-bold">{item.value}</div>{item.progress !== undefined && <Progress value={item.progress} className="mt-3 h-2" />}</CardContent></Card>)}
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-indigo-600" /> Narrative campaigns</CardTitle></CardHeader><CardContent className="space-y-3">{data.arcs.map((arc) => { const progress = data.state.campaignProgress[arc.id] || 0; return <div key={arc.id} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{arc.title}</div><div className="text-sm text-slate-500">{arc.subtitle}</div></div><Badge className={statusClass(arc.status)}>{arc.status}</Badge></div><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{arc.theme} · {arc.chapters} chapters</span><span>Chapter {progress}/{arc.chapters}</span></div><Progress value={(progress / arc.chapters) * 100} className="mt-2 h-2" /><div className="mt-3 flex flex-wrap gap-1">{arc.rewardTrack.map((reward) => <Badge key={reward} variant="outline" className="text-xs">{reward}</Badge>)}</div></div>; })}</CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Compass className="h-5 w-5 text-blue-600" /> Tutorial missions</CardTitle></CardHeader><CardContent className="space-y-3">{data.tutorialMissions.map((mission) => { const complete = data.state.tutorialCompleted.includes(mission.id); return <div key={mission.id} className="flex items-center gap-3 rounded-xl border p-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${complete ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}>{complete ? <CheckCircle2 className="h-5 w-5" /> : mission.order}</div><div className="min-w-0 flex-1"><div className="font-semibold">{mission.title}</div><div className="text-xs text-slate-500">{mission.objective} · {mission.reward}</div></div>{!complete && <Button size="sm" disabled={busy === mission.id} onClick={() => mutate(mission.id, `/api/roadmap/tutorial/${mission.id}/complete`, { method: "POST" })}>Complete</Button>}</div>; })}</CardContent></Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-600" /> Player competitions</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><Input placeholder="Competition name" value={competitionName} onChange={(event) => setCompetitionName(event.target.value)} aria-label="Competition name" /><select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={competitionType} onChange={(event) => setCompetitionType(event.target.value)} aria-label="Competition type">{data.competitionTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select><Button disabled={busy === "create-competition" || competitionName.trim().length < 3} onClick={createCompetition}><Plus className="mr-1 h-4 w-4" /> Create</Button></div>{data.competitions.length === 0 && <p className="text-sm text-slate-500">No player competitions are open yet. Create the first tournament.</p>}{data.competitions.map((competition) => <div key={competition.id} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{competition.name}</div><div className="text-sm text-slate-500">{competition.description}</div></div><Badge variant="outline"><Users className="mr-1 h-3 w-3" />{competition.participants.length}</Badge></div><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>Ends {new Date(competition.endsAt).toLocaleDateString()}</span>{data.state.joinedCompetitions.includes(competition.id) ? <Badge className="bg-emerald-100 text-emerald-700">Joined</Badge> : <Button size="sm" onClick={() => mutate(competition.id, `/api/roadmap/competitions/${competition.id}/join`, { method: "POST" })}>Join tournament</Button>}</div></div>)}</CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-purple-600" /> Global events</CardTitle></CardHeader><CardContent className="space-y-3">{data.globalEvents.map((event) => { const joined = data.state.joinedEvents.includes(event.id); return <div key={event.id} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{event.name}</div><div className="text-sm text-slate-500">{event.description}</div></div><Badge className={statusClass(event.status)}>{event.status}</Badge></div><div className="mt-3 text-xs text-slate-500">{event.objective} · {event.durationHours}h · Reward: {event.reward}</div><Button className="mt-3" size="sm" variant={joined ? "outline" : "default"} disabled={joined || event.status === "planned"} onClick={() => mutate(event.id, `/api/roadmap/events/${event.id}/join`, { method: "POST" })}>{joined ? "Participation registered" : event.status === "active" ? "Join global event" : "Coming soon"}</Button></div>; })}</CardContent></Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Medal className="h-5 w-5 text-amber-600" /> Season 1: Frontier Awakening</CardTitle></CardHeader><CardContent><div className="mb-4 flex items-center justify-between text-sm"><span>{data.season.xp.toLocaleString()} / 30,000 XP</span><Badge variant="outline">{data.season.claimedTiers.length} rewards claimed</Badge></div><Progress value={seasonProgress} className="mb-4 h-3" /><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{data.season.rewards.slice(0, 6).map((reward) => <div key={reward.tier} className="rounded-lg border p-3"><div className="flex justify-between text-xs font-semibold"><span>Tier {reward.tier}</span><span>{reward.xpRequired.toLocaleString()} XP</span></div><div className="mt-2 text-xs text-slate-500">Free: {reward.freeReward}</div><div className="mt-1 text-xs text-indigo-600">Premium: {reward.premiumReward}</div></div>)}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-emerald-600" /> Achievement milestones</CardTitle></CardHeader><CardContent className="space-y-2">{data.achievements.map((achievement) => <div key={achievement.id} className="flex items-center gap-3 rounded-lg border p-3"><div className={achievement.completed ? "text-emerald-600" : "text-slate-400"}>{achievement.completed ? <CheckCircle2 className="h-5 w-5" /> : <Flag className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><div className="text-sm font-semibold">{achievement.title}</div><div className="text-xs text-slate-500">{achievement.description}</div></div><Badge variant="outline" className="text-[10px]">{achievement.target}</Badge></div>)}</CardContent></Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><LifeBuoy className="h-5 w-5 text-blue-600" /> Player support</CardTitle></CardHeader><CardContent className="space-y-3"><Input placeholder="Subject" value={ticketSubject} onChange={(event) => setTicketSubject(event.target.value)} aria-label="Support subject" /><Textarea placeholder="Describe the issue (at least 10 characters)" value={ticketMessage} onChange={(event) => setTicketMessage(event.target.value)} aria-label="Support message" /><Button className="w-full" disabled={busy === "support-ticket" || ticketSubject.trim().length < 3 || ticketMessage.trim().length < 10} onClick={submitTicket}><Send className="mr-2 h-4 w-4" /> Open support ticket</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-indigo-600" /> Launch gates</CardTitle></CardHeader><CardContent className="space-y-2">{data.releaseGates.map((gate) => <div key={gate.id} className="rounded-lg border p-3"><div className="flex items-center justify-between text-sm font-semibold"><span>{gate.label}</span><Badge className={statusClass(gate.status)}>{gate.status}</Badge></div><div className="mt-1 text-xs text-slate-500">Target: {gate.target}</div></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-pink-600" /> Localization</CardTitle></CardHeader><CardContent className="space-y-2">{data.locales.map((locale) => <div key={locale.code} className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm font-medium">{locale.name} <span className="text-xs text-slate-400">({locale.code})</span></span><Badge className={statusClass(locale.status)}>{locale.status}</Badge></div>)}</CardContent></Card>
        </div>
      </div>
    </div>
  );
}
