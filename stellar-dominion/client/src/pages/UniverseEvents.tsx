import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Users } from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";

const eventClassColors: Record<string, string> = {
  common: "bg-slate-600",
  rare: "bg-blue-600",
  epic: "bg-purple-600",
  legendary: "bg-yellow-600",
  mythic: "bg-red-600",
};

export default function UniverseEvents() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: baseEventsRaw = [] } = useQuery({
    queryKey: ["universe-events"],
    queryFn: () => fetch("/api/events").then(r => r.json()).catch(() => []),
  });

  const { data: systemEventsRaw } = useQuery({
    queryKey: ["/api/systems/events"],
    queryFn: () => fetch("/api/systems/events").then((r) => r.json()),
    refetchInterval: 60000,
  });

  const baseEvents = Array.isArray(baseEventsRaw)
    ? baseEventsRaw
    : Array.isArray((baseEventsRaw as any)?.events)
      ? (baseEventsRaw as any).events
      : [];

  const systemEvents = (systemEventsRaw?.universeEvents || []).map((event: any) => ({
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

  const events = [...baseEvents, ...systemEvents];

  const activeEvents = events.filter((event: any) => event.status === "active").length;
  const totalParticipants = events.reduce((sum: number, event: any) => sum + Number(event.participantLimit || 0), 0);
  const avgDifficulty =
    events.length > 0
      ? (events.reduce((sum: number, event: any) => sum + Number(event.difficulty || 0), 0) / events.length).toFixed(1)
      : "0.0";
  const selectedEventData = events.find((event: any) => event.id === selectedEvent) || null;

  return (
    <GameLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Zap className="w-8 h-8 text-yellow-500" />
          Universe Events
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Total Events</div>
              <div className="text-2xl font-bold text-white">{events.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Active Now</div>
              <div className="text-2xl font-bold text-emerald-400">{activeEvents}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Avg Difficulty</div>
              <div className="text-2xl font-bold text-amber-400">{avgDifficulty}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Max Participants</div>
              <div className="text-2xl font-bold text-blue-400">{totalParticipants}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Boss Events</div>
              <div className="text-2xl font-bold text-amber-300">{(systemEventsRaw?.bosses || []).length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">NPC Worlds</div>
              <div className="text-2xl font-bold text-emerald-300">{(systemEventsRaw?.npcWorlds || []).length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">System Max Tier</div>
              <div className="text-2xl font-bold text-purple-300">{systemEventsRaw?.summary?.maxTier || 99}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid gap-4">
            {events.map((event: any) => (
              <Card
                key={event.id}
                className={`bg-slate-800 border-slate-700 cursor-pointer transition-all ${
                  selectedEvent === event.id ? "ring-2 ring-primary" : "hover:border-primary"
                }`}
                onClick={() => setSelectedEvent(event.id)}
                data-testid={`event-card-${event.id}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{event.name}</CardTitle>
                      <p className="text-sm text-slate-400">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={eventClassColors[event.eventClass]}>
                        {event.eventClass}
                      </Badge>
                      <Badge variant="outline">{event.eventType}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Difficulty</p>
                      <p className="text-lg font-bold text-primary">{event.difficulty}/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Participants</p>
                      <p className="text-lg font-bold text-primary flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.participantLimit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Duration</p>
                      <p className="text-lg font-bold text-primary">{event.duration}m</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Status</p>
                      <Badge className={event.status === "active" ? "bg-green-600" : "bg-slate-600"}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedEvent === event.id && (
                    <Button className="w-full" data-testid={`button-join-event-${event.id}`}>
                      Join Event
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Event Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!selectedEventData ? (
                <p className="text-slate-400">Select an event to inspect rewards and tactical details.</p>
              ) : (
                <>
                  <div className="text-white font-semibold">{selectedEventData.name}</div>
                  <p className="text-slate-400">{selectedEventData.description}</p>
                  <div className="rounded border border-slate-700 bg-slate-900/50 p-3 text-slate-300">
                    <div>Type: {selectedEventData.eventType}</div>
                    <div>Class: {selectedEventData.eventClass}</div>
                    <div>Status: {selectedEventData.status}</div>
                    <div>Difficulty: {selectedEventData.difficulty}/10</div>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div>Recommended Power: {(selectedEventData.difficulty || 1) * 120}</div>
                    <div>Estimated Reward Tier: {selectedEventData.eventClass}</div>
                    <div>Squad Capacity: {selectedEventData.participantLimit} commanders</div>
                    {selectedEventData.recommendedTier && <div>Recommended Tier: T{selectedEventData.recommendedTier}</div>}
                    {selectedEventData.recommendedLevel && <div>Recommended Level: L{selectedEventData.recommendedLevel}</div>}
                    {selectedEventData.participationMode && <div>Mode: {selectedEventData.participationMode}</div>}
                    {selectedEventData.rewards?.credits && (
                      <div>Credits Reward: {Number(selectedEventData.rewards.credits).toLocaleString()}</div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
}
