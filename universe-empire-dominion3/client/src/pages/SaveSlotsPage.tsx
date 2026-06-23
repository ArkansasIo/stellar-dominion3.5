import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive, Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MENU_ASSETS } from "@shared/config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const TEMP_THEME_IMAGE = "/theme-temp.png";

interface SaveSlot {
  slot: number;
  name: string;
  exists: boolean;
  lastSaved?: string;
  empireName?: string;
  race?: string;
  level?: number;
}

export default function SaveSlotsPage() {
  const { logout, setOnboardingStep, switchRealm, realmServers, selectedRealmId } = useGame();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isNewGame, setIsNewGame] = useState(false);

  const { data: slotsData, isLoading: slotsLoading } = useQuery<{ slots: SaveSlot[] }>({
    queryKey: ["/api/save-slots"],
    queryFn: async () => {
      const res = await fetch("/api/save-slots", { credentials: "include" });
      if (!res.ok) {
        return {
          slots: Array.from({ length: 5 }, (_, i) => ({
            slot: i + 1,
            name: `Empire Slot ${i + 1}`,
            exists: false,
          })),
        };
      }
      return res.json();
    },
  });

  const loadSlotMutation = useMutation({
    mutationFn: async (slot: number) => {
      const res = await fetch("/api/save-slots/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slot }),
      });
      if (!res.ok) throw new Error("Failed to load save slot");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Save Loaded", description: "Empire data loaded successfully." });
      setOnboardingStep(2);
    },
    onError: (err: any) => {
      toast({ title: "Load Failed", description: err.message, variant: "destructive" });
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (slot: number) => {
      const res = await fetch("/api/save-slots/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slot }),
      });
      if (!res.ok) throw new Error("Failed to delete save slot");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Save Deleted", description: "Empire save slot cleared." });
      queryClient.invalidateQueries({ queryKey: ["/api/save-slots"] });
    },
  });

  const handleContinue = () => {
    if (isNewGame) {
      setOnboardingStep(1);
    } else if (selectedSlot) {
      loadSlotMutation.mutate(selectedSlot);
    }
  };

  const handleBack = () => {
    logout();
  };

  const slots = slotsData?.slots || Array.from({ length: 5 }, (_, i) => ({
    slot: i + 1,
    name: `Empire Slot ${i + 1}`,
    exists: false,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-slate-400 hover:text-white z-20 transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Login
      </Button>

      <div className="text-sm text-slate-500 absolute top-4 right-4 font-mono">
        Step 1 of 2 — Save Data
      </div>

      <Card className="w-full max-w-2xl bg-slate-900/80 border-slate-700 text-white relative z-10 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center pb-2 border-b border-slate-700">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
            <HardDrive className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-orbitron font-bold tracking-wider text-white">EMPIRE VAULT</CardTitle>
          <CardDescription className="text-slate-400 font-rajdhani text-lg font-medium mt-2">
            Load an existing empire or start a new conquest.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Save Slots</h3>
              {slotsLoading && <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />}
            </div>
            <div className="grid gap-3">
              {slots.map((slot) => (
                <div
                  key={slot.slot}
                  className={`rounded-lg border p-4 transition-all cursor-pointer ${
                    selectedSlot === slot.slot && !isNewGame
                      ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                  }`}
                  onClick={() => {
                    if (slot.exists) {
                      setSelectedSlot(slot.slot);
                      setIsNewGame(false);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        slot.exists ? "bg-emerald-500/20" : "bg-slate-700/50"
                      }`}>
                        <Save className={`w-5 h-5 ${slot.exists ? "text-emerald-400" : "text-slate-500"}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">
                          Slot {slot.slot}: {slot.exists ? slot.empireName || slot.name : "Empty"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {slot.exists ? (
                            <>
                              {slot.race && `${slot.race} · `}
                              {slot.level && `Level ${slot.level}`}
                              {slot.lastSaved && ` · Saved ${slot.lastSaved}`}
                            </>
                          ) : (
                            "No save data"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {slot.exists && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-500 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSlotMutation.mutate(slot.slot);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {slot.exists && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-cyan-400 hover:text-cyan-300 ${selectedSlot === slot.slot && !isNewGame ? "bg-cyan-500/20" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSlot(slot.slot);
                            setIsNewGame(false);
                          }}
                        >
                          Load
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <div
              className={`rounded-lg border p-4 transition-all cursor-pointer ${
                isNewGame
                  ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
              }`}
              onClick={() => {
                setIsNewGame(true);
                setSelectedSlot(null);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500/20">
                  <Plus className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">Start New Empire</div>
                  <div className="text-xs text-slate-400">Begin a fresh conquest in a new save slot</div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-orbitron tracking-widest h-14 text-lg shadow-lg transition-all hover:shadow-xl"
            disabled={!selectedSlot && !isNewGame || loadSlotMutation.isPending}
          >
            {loadSlotMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                LOADING...
              </>
            ) : (
              <>
                {isNewGame ? "PROCEED TO REALM SELECT" : "LOAD EMPIRE"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
