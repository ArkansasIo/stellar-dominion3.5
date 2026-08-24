import { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AUDIO_ASSETS = {
  ambient: "/assets/audio/stellar-dominion-theme.mp3",
  briefing: "/assets/audio/command-briefing-intro.wav",
  confirm: "/assets/audio/ui-command-confirm.wav",
  alert: "/assets/audio/ui-alert-warning.wav",
  deploy: "/assets/audio/fleet-deploy.wav",
} as const;

type SoundEffect = "confirm" | "alert" | "deploy";

interface CommandAudioDockProps {
  screen: "overview" | "command-center";
}

export default function CommandAudioDock({ screen }: CommandAudioDockProps) {
  const [enabled, setEnabled] = useState(false);
  const [briefingPlaying, setBriefingPlaying] = useState(false);
  const [volume, setVolume] = useState(0.28);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const briefingRef = useRef<HTMLAudioElement | null>(null);
  const effectsRef = useRef<Partial<Record<SoundEffect, HTMLAudioElement>>>({});

  useEffect(() => {
    const ambient = new Audio(AUDIO_ASSETS.ambient);
    ambient.loop = true;
    ambient.preload = "metadata";
    ambientRef.current = ambient;

    const briefing = new Audio(AUDIO_ASSETS.briefing);
    briefing.preload = "metadata";
    const handleBriefingEnded = () => setBriefingPlaying(false);
    briefing.addEventListener("ended", handleBriefingEnded);
    briefingRef.current = briefing;

    (Object.keys({ confirm: true, alert: true, deploy: true }) as SoundEffect[]).forEach((effect) => {
      const audio = new Audio(AUDIO_ASSETS[effect]);
      audio.preload = "metadata";
      effectsRef.current[effect] = audio;
    });

    return () => {
      ambient.pause();
      briefing.pause();
      briefing.removeEventListener("ended", handleBriefingEnded);
      ambientRef.current = null;
      briefingRef.current = null;
      effectsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const ambient = ambientRef.current;
    const briefing = briefingRef.current;
    if (ambient) ambient.volume = volume;
    if (briefing) briefing.volume = Math.min(1, volume + 0.12);
    Object.values(effectsRef.current).forEach((effect) => {
      if (effect) effect.volume = Math.min(1, volume + 0.2);
    });
  }, [volume]);

  useEffect(() => {
    const handleCommandSound = (event: MouseEvent) => {
      if (!enabled) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const sound = target.closest<HTMLElement>("[data-command-sfx]")?.dataset.commandSfx as SoundEffect | undefined;
      if (!sound || !effectsRef.current[sound]) return;
      const effect = effectsRef.current[sound];
      if (!effect) return;
      effect.currentTime = 0;
      effect.play().catch(() => undefined);
    };

    document.addEventListener("click", handleCommandSound);
    return () => document.removeEventListener("click", handleCommandSound);
  }, [enabled]);

  const startAmbient = () => {
    const ambient = ambientRef.current;
    if (!ambient) return;
    ambient.volume = volume;
    ambient.play().catch(() => undefined);
  };

  const toggleAudio = () => {
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    if (nextEnabled) {
      startAmbient();
      return;
    }
    ambientRef.current?.pause();
    briefingRef.current?.pause();
    setBriefingPlaying(false);
  };

  const toggleBriefing = () => {
    if (!enabled) {
      setEnabled(true);
      startAmbient();
    }
    const briefing = briefingRef.current;
    if (!briefing) return;
    if (briefingPlaying) {
      briefing.pause();
      setBriefingPlaying(false);
      return;
    }
    briefing.currentTime = 0;
    briefing.volume = Math.min(1, volume + 0.12);
    briefing.play().then(() => setBriefingPlaying(true)).catch(() => setBriefingPlaying(false));
  };

  return (
    <Card className="mb-6 overflow-hidden border-blue-900/60 bg-gradient-to-r from-slate-950 via-blue-950/90 to-slate-950 text-blue-50 shadow-lg shadow-blue-950/20" data-testid={`command-audio-dock-${screen}`}>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">Command Soundscape</div>
            <div className="mt-1 text-sm font-semibold text-white">{enabled ? "Audio link active" : "Audio link ready"}</div>
            <div className="text-xs text-blue-200/70">Ambient theme, briefing voice, and interaction cues</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={toggleAudio} className={enabled ? "bg-cyan-600 text-white hover:bg-cyan-500" : "border-blue-400/50 bg-blue-950/40 text-blue-100 hover:bg-blue-900/70"} variant={enabled ? "default" : "outline"} data-command-sfx="confirm">
            {enabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
            {enabled ? "Mute audio" : "Enable audio"}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={toggleBriefing} className="border-blue-400/50 bg-blue-950/40 text-blue-100 hover:bg-blue-900/70" data-command-sfx="confirm">
            {briefingPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {briefingPlaying ? "Pause briefing" : "Play briefing"}
          </Button>
          <label className="flex items-center gap-2 rounded-md border border-blue-400/30 bg-blue-950/30 px-2 py-1.5 text-xs text-blue-200" title="Command audio volume">
            <Volume2 className="h-3.5 w-3.5 text-cyan-300" />
            <input aria-label="Command audio volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-20 accent-cyan-400" />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
