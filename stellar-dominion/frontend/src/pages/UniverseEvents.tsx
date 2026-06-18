import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Users } from "lucide-react";

const eventClassColors: Record<string, string> = {
  common: "bg-slate-600",
  rare: "bg-blue-600",
  epic: "bg-purple-600",
  legendary: "bg-yellow-600",
  mythic: "bg-red-600",
};

export default function UniverseEvents() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: events = [] } = useQuery({
    queryKey: ["universe-events"],
    queryFn: () => fetch("/api/events").then(r => r.json()).catch(() => []),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Zap className="w-8 h-8 text-yellow-500" />
          Universe Events
        </h1>

        <div className="grid gap-4">
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
      </div>
    </div>
  );
}
