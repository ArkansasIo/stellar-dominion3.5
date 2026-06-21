import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FRONTIER_EVENT_INTEL } from "@/lib/wormholeStrongholdCatalog";
import { AlertTriangle, CalendarClock, Crown, ShieldAlert, Users, Zap } from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";

type EventRecord = {
  id: string;
  name: string;
  description: string;
  eventClass: "common" | "rare" | "epic" | "legendary" | "mythic";
  eventType?: string;
  difficulty?: number;
  participantLimit?: number;
  duration?: number;
  status?: string;
  rewards?: Record<string, number>;
  recommendedTier?: number;
  recommendedLevel?: number;
  participationMode?: string;
  joined?: boolean;
};

const eventClassBadgeClass: Record<string, string> = {
  common: "bg-slate-100 text-slate-700 border-slate-200",
  rare: "bg-blue-100 text-blue-700 border-blue-200",
  epic: "bg-violet-100 text-violet-700 border-violet-200",
  legendary: "bg-amber-100 text-amber-700 border-amber-200",
  mythic: "bg-rose-100 text-rose-700 border-rose-200",
};

const statusBadgeClass: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  upcoming: "bg-amber-100 text-amber-800 border-amber-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
};

function formatEventType(value?: string) {
  if (!value) return "Strategic";
  return value.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
}

export default function UniverseEvents() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: baseEventsRaw = [], isLoading: baseEventsLoading } = useQuery({
    queryKey: ["universe-events"],
    queryFn: async () => {
      const response = await fetch("/api/events", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to load event roster");
      }
      return response.json();
    },
  });

  const { data: systemEventsRaw, isLoading: systemEventsLoading } = useQuery({
    queryKey: ["/api/systems/events"],
    queryFn: async () => {
      const response = await fetch("/api/systems/events", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to load system events");
      }
      return response.json();
    },
    refetchInterval: 60000,
  });

  const baseEvents = Array.isArray(baseEventsRaw)
    ? baseEventsRaw
    : Array.isArray((baseEventsRaw as any)?.events)
      ? (baseEventsRaw as any).events
      : [];

  const systemEvents = ((systemEventsRaw as any)?.universeEvents || []).map((event: any) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    eventClass: event.eventType === "boss" ? "legendary" : event.eventType === "allianceWar" ? "epic" : "rare",
    eventType: event.eventType,
    difficulty: Math.max(1, Math.min(10, Math.round((event.recommendedTier || 1) / 10))),
    participantLimit: event.participationMode === "pvp" ? 2 : 8,
    duration: event.durationMinutes,
    status: "scheduled",
    rewards: event.rewards,
    recommendedTier: event.recommendedTier,
    recommendedLevel: event.recommendedLevel,
    participationMode: event.participationMode,
  }));

  const frontierEvents = FRONTIER_EVENT_INTEL.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    eventClass: event.eventClass,
    eventType: event.eventType,
    difficulty: event.difficulty,
    participantLimit: event.participantLimit,
    duration: event.duration,
    status: event.status,
    rewards: event.rewards,
    recommendedTier: event.recommendedTier,
    recommendedLevel: event.recommendedLevel,
    participationMode: event.participationMode,
  }));

  const events = useMemo<EventRecord[]>(() => [...baseEvents, ...systemEvents, ...frontierEvents], [baseEvents, systemEvents, frontierEvents]);

  const joinEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Failed to join event");
      }

      return payload;
    },
    onSuccess: async (_payload, eventId) => {
      await queryClient.invalidateQueries({ queryKey: ["universe-events"] });
      const joinedEvent = events.find((event) => event.id === eventId);
      toast({
        title: "Event joined",
        description: joinedEvent ? `${joinedEvent.name} has been added to your operations queue.` : "Event participation confirmed.",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Unable to join event", description: error.message, variant: "destructive" });
    },
  });

  const activeEvents = events.filter((event) => event.status === "active").length;
  const scheduledEvents = events.filter((event) => ["upcoming", "scheduled"].includes(String(event.status))).length;
  const legendaryEvents = events.filter((event) => event.eventClass === "legendary" || event.eventClass === "mythic").length;
  const totalParticipants = events.reduce((sum, event) => sum + Number(event.participantLimit || 0), 0);
  const avgDifficulty =
    events.length > 0
      ? (events.reduce((sum, event) => sum + Number(event.difficulty || 0), 0) / events.length).toFixed(1)
      : "0.0";
  const selectedEventData = events.find((event) => event.id === selectedEvent) || null;
  const loading = baseEventsLoading || systemEventsLoading;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="universe-events-page">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 font-orbitron text-3xl font-bold text-slate-900">
              <Zap className="h-8 w-8 text-amber-500" />
              Universe Events
            </h1>
            <p className="mt-1 font-rajdhani text-lg text-muted-foreground">
              Track live anomalies, timed combat windows, and sector-wide bonuses from one command feed.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Command Focus</div>
            <div className="mt-1 font-rajdhani text-lg font-semibold uppercase tracking-wider text-slate-900">
              Sector Alerts
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Total Events</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-slate-900">{events.length}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-emerald-700">Active Now</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-emerald-900">{activeEvents}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-blue-700">Scheduled</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-blue-900">{scheduledEvents}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-amber-700">High Threat</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-amber-900">{legendaryEvents}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-indigo-200 bg-indigo-50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-orbitron text-indigo-900">Event Operations Brief</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 text-sm text-indigo-900 md:grid-cols-4">
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Prioritize active events first, then stage fleets for scheduled windows with strong reward multipliers.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Use difficulty and squad capacity together to decide whether an event is solo-safe or alliance-scale.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Legendary and boss-class events are the best place to concentrate high-tier commanders and escorts.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Wormhole surges and stronghold sieges now feed the same event feed, so frontier warfare shows up with the rest of your command alerts.
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CalendarClock className="h-5 w-5 text-sky-600" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Avg Difficulty</div>
                  <div className="text-xl font-bold text-slate-900">{avgDifficulty}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-cyan-600" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Max Participants</div>
                  <div className="text-xl font-bold text-slate-900">{totalParticipants}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Boss Events</div>
                  <div className="text-xl font-bold text-slate-900">{((systemEventsRaw as any)?.bosses || []).length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-violet-600" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">System Max Tier</div>
                  <div className="text-xl font-bold text-slate-900">{(systemEventsRaw as any)?.summary?.maxTier || 99}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr,1fr]">
          <div className="space-y-4">
            {loading && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 text-sm text-slate-500">Loading event telemetry...</CardContent>
              </Card>
            )}

            {!loading && events.length === 0 && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-10 text-center text-slate-500">
                  No universe events are currently available.
                </CardContent>
              </Card>
            )}

            {events.map((event) => {
              const isSelected = selectedEventData?.id === event.id;
              const eventStatus = String(event.status || "scheduled");
              const eventClass = String(event.eventClass || "common");
              const rewardEntries = Object.entries(event.rewards || {}).filter(([, value]) => Number(value) > 0);

              return (
                <Card
                  key={event.id}
                  className={`border shadow-sm transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
                  }`}
                  onClick={() => setSelectedEvent(event.id)}
                  data-testid={`event-card-${event.id}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <CardTitle className="text-xl font-orbitron text-slate-900">{event.name}</CardTitle>
                        <p className="mt-2 text-sm text-slate-600">{event.description}</p>
                        {event.joined && (
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                            Participation confirmed
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={eventClassBadgeClass[eventClass] || eventClassBadgeClass.common}>
                          {eventClass}
                        </Badge>
                        <Badge variant="outline" className={statusBadgeClass[eventStatus] || statusBadgeClass.scheduled}>
                          {eventStatus}
                        </Badge>
                        <Badge variant="outline">{formatEventType(event.eventType)}</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Difficulty</div>
                        <div className="mt-2 text-xl font-orbitron font-bold text-slate-900">{event.difficulty || 1}/10</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Squad</div>
                        <div className="mt-2 text-xl font-orbitron font-bold text-slate-900">{event.participantLimit || 0}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Duration</div>
                        <div className="mt-2 text-xl font-orbitron font-bold text-slate-900">{event.duration || 0}m</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Reward Nodes</div>
                        <div className="mt-2 text-xl font-orbitron font-bold text-slate-900">{rewardEntries.length}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap gap-2">
                        {rewardEntries.slice(0, 3).map(([reward, amount]) => (
                          <Badge key={reward} variant="outline" className="bg-white">
                            {reward}: {Number(amount).toLocaleString()}
                          </Badge>
                        ))}
                        {rewardEntries.length === 0 && (
                          <span className="text-sm text-slate-500">Reward values unlock once the operation resolves.</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          onClick={(selected) => {
                            selected.stopPropagation();
                            setSelectedEvent(event.id);
                          }}
                          data-testid={`button-view-event-${event.id}`}
                        >
                          {isSelected ? "Inspecting" : "View Details"}
                        </Button>
                        <Button
                          disabled={
                            Boolean(event.joined) ||
                            eventStatus === "completed" ||
                            (joinEventMutation.isPending && joinEventMutation.variables === event.id)
                          }
                          onClick={(selected) => {
                            selected.stopPropagation();
                            joinEventMutation.mutate(event.id);
                          }}
                          data-testid={`button-join-event-${event.id}`}
                        >
                          {event.joined
                            ? "Joined"
                            : joinEventMutation.isPending && joinEventMutation.variables === event.id
                              ? "Joining..."
                              : eventStatus === "completed"
                                ? "Event Closed"
                                : "Join Event"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="h-fit border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron text-slate-900">Event Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!selectedEventData ? (
                <p className="text-slate-500">
                  Select an event to inspect reward expectations, capacity requirements, and engagement guidance.
                </p>
              ) : (
                <>
                  <div>
                    <div className="font-orbitron text-lg font-bold text-slate-900">{selectedEventData.name}</div>
                    <div className="mt-1 text-slate-500">{selectedEventData.description}</div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <AlertTriangle className="h-4 w-4 text-slate-400" />
                      Tactical Summary
                    </div>
                    <div className="mt-3 space-y-2 text-slate-700">
                      <div>Type: {formatEventType(selectedEventData.eventType)}</div>
                      <div>Class: {selectedEventData.eventClass}</div>
                      <div>Status: {selectedEventData.status}</div>
                      <div>Difficulty: {selectedEventData.difficulty || 1}/10</div>
                      <div>Joined: {selectedEventData.joined ? "Yes" : "No"}</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Deployment Guidance</div>
                    <div className="mt-3 space-y-2 text-slate-700">
                      <div>Recommended Power: {(selectedEventData.difficulty || 1) * 120}</div>
                      <div>Squad Capacity: {selectedEventData.participantLimit || 0} commanders</div>
                      <div>Event Window: {selectedEventData.duration || 0} minutes</div>
                      {selectedEventData.recommendedTier && <div>Recommended Tier: T{selectedEventData.recommendedTier}</div>}
                      {selectedEventData.recommendedLevel && <div>Recommended Level: L{selectedEventData.recommendedLevel}</div>}
                      {selectedEventData.participationMode && <div>Mode: {selectedEventData.participationMode}</div>}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Reward Projection</div>
                    <div className="mt-3 space-y-2 text-slate-700">
                      {Object.entries(selectedEventData.rewards || {}).length === 0 ? (
                        <div>No published rewards for this event yet.</div>
                      ) : (
                        Object.entries(selectedEventData.rewards || {}).map(([reward, amount]) => (
                          <div key={reward}>
                            {reward}: {Number(amount).toLocaleString()}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={
                      Boolean(selectedEventData.joined) ||
                      selectedEventData.status === "completed" ||
                      (joinEventMutation.isPending && joinEventMutation.variables === selectedEventData.id)
                    }
                    onClick={() => joinEventMutation.mutate(selectedEventData.id)}
                    data-testid={`button-join-detail-event-${selectedEventData.id}`}
                  >
                    {selectedEventData.joined
                      ? "Already Joined"
                      : joinEventMutation.isPending && joinEventMutation.variables === selectedEventData.id
                        ? "Joining..."
                        : selectedEventData.status === "completed"
                          ? "Event Closed"
                          : "Commit to Event"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
}
