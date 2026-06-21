import { Link } from "wouter";
import { Activity, AlertTriangle, BookOpen, Heart, Shield, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { HabitatConditionProfile } from "@/lib/environmentSystems";

interface HabitatSystemsPanelProps {
  profile: HabitatConditionProfile;
  title?: string;
  description?: string;
  compact?: boolean;
  showEvents?: boolean;
  showStory?: boolean;
  storyHref?: string;
  managementHref?: string;
  className?: string;
}

function severityBadgeClass(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
    case "major":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "moderate":
    case "minor":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
}

export default function HabitatSystemsPanel({
  profile,
  title,
  description,
  compact = false,
  showEvents = true,
  showStory = true,
  storyHref = "/story-mode",
  managementHref,
  className,
}: HabitatSystemsPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border-slate-200 bg-white">
        <CardHeader className={compact ? "pb-3" : undefined}>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Activity className="h-5 w-5 text-emerald-600" />
            {title || `${profile.habitatLabel} Environment and Disease Systems`}
          </CardTitle>
          <CardDescription>
            {description || `${profile.environmentClass} profile with health, event, disease, and recovery mechanics tied into active game systems.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Health Rating</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-emerald-700">{profile.healthRating}</div>
              <Progress value={profile.healthRating} className="mt-2 h-2" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Risk Rating</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-amber-700">{profile.riskRating}</div>
              <Progress value={profile.riskRating} className="mt-2 h-2" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Active Disease</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{profile.disease.name}</div>
              <Badge variant="outline" className={cn("mt-2", severityBadgeClass(profile.disease.severity))}>
                {profile.disease.severity}
              </Badge>
            </div>
          </div>

          <div className={cn("grid gap-4", compact ? "lg:grid-cols-2" : "xl:grid-cols-2")}>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-900">Primary Stats</div>
              <div className="space-y-3">
                {profile.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{stat.label}</span>
                      <span className="font-semibold text-slate-900">{stat.value}/{stat.max}</span>
                    </div>
                    <Progress value={(stat.value / stat.max) * 100} className="mt-1 h-2" />
                    {!compact && <div className="mt-1 text-[11px] leading-5 text-slate-500">{stat.helper}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-900">Sub Stats and Treatment Pressure</div>
              <div className="space-y-3">
                {profile.subStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{stat.label}</span>
                      <span className="font-semibold text-slate-900">{stat.value}/{stat.max}</span>
                    </div>
                    <Progress value={(stat.value / stat.max) * 100} className="mt-1 h-2" />
                    {!compact && <div className="mt-1 text-[11px] leading-5 text-slate-500">{stat.helper}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <Shield className="h-4 w-4" /> Buffs
              </div>
              <div className="space-y-2">
                {profile.buffs.map((buff) => (
                  <div key={buff.name} className="rounded-lg border border-emerald-200 bg-white px-3 py-2">
                    <div className="text-sm font-semibold text-emerald-900">{buff.name}</div>
                    <div className="text-xs text-slate-700">{buff.effect}</div>
                    {!compact && <div className="text-[11px] text-slate-500">{buff.source}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-900">
                <AlertTriangle className="h-4 w-4" /> Debuffs
              </div>
              <div className="space-y-2">
                {profile.debuffs.map((debuff) => (
                  <div key={debuff.name} className="rounded-lg border border-red-200 bg-white px-3 py-2">
                    <div className="text-sm font-semibold text-red-900">{debuff.name}</div>
                    <div className="text-xs text-slate-700">{debuff.effect}</div>
                    {!compact && <div className="text-[11px] text-slate-500">{debuff.source}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Heart className="h-4 w-4 text-pink-600" /> Healing and Repair Paths
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {profile.recoveryMethods.map((method) => (
                <div key={method.name} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-sm font-semibold text-slate-900">{method.name}</div>
                  <Badge variant="outline" className="mt-2 capitalize">{method.type}</Badge>
                  <div className="mt-2 text-xs text-slate-700">{method.effect}</div>
                  {!compact && <div className="mt-1 text-[11px] text-slate-500">{method.requirement}</div>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {showEvents && (
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Wrench className="h-5 w-5 text-amber-600" />
              Habitat Events and Emergency Response
            </CardTitle>
            <CardDescription>Live event systems affecting growth, logistics, integrity, and story pacing.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 xl:grid-cols-2">
            {profile.events.map((event) => (
              <div key={event.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">{event.name}</div>
                  <Badge variant="outline" className={severityBadgeClass(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-slate-700">{event.description}</div>
                <div className="mt-2 text-xs text-slate-500">Impact: {event.gameplayImpact}</div>
                <div className="mt-1 text-xs text-slate-500">Response: {event.response}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showStory && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-950">
              <BookOpen className="h-5 w-5 text-indigo-700" />
              Story Integration
            </CardTitle>
            <CardDescription className="text-indigo-900/80">
              Environmental and disease systems now feed directly into campaign pacing and local mission stakes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm font-semibold text-indigo-950">{profile.storyTieIn.title}</div>
            <div className="text-sm text-indigo-950/85">{profile.storyTieIn.summary}</div>
            <div className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700">
              Directive: {profile.storyTieIn.missionDirective}
            </div>
            <div className="text-xs text-slate-600">Stakes: {profile.storyTieIn.stakes}</div>
            <div className="flex flex-wrap gap-2">
              <Link href={storyHref}>
                <Button size="sm">Open Story Mode</Button>
              </Link>
              {managementHref && (
                <Link href={managementHref}>
                  <Button size="sm" variant="outline">Open Management</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
