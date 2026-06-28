import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { XpBar, PlayerLevelBar } from "@/components/ui/XpBar";
import { formatXp, getSourceColor, getSourceIcon, type XpSource } from "@shared/config/xpConfig";

interface XpNotification {
  id: string;
  amount: number;
  source: XpSource;
  timestamp: number;
}

let xpListeners: Array<(notif: XpNotification) => void> = [];

export function emitXpGain(amount: number, source: XpSource) {
  const notif: XpNotification = { id: `xp-${Date.now()}-${Math.random()}`, amount, source, timestamp: Date.now() };
  xpListeners.forEach((l) => l(notif));
}

export function onXpGain(callback: (notif: XpNotification) => void) {
  xpListeners.push(callback);
  return () => { xpListeners = xpListeners.filter((l) => l !== callback); };
}

interface XpNotificationsProps {
  maxVisible?: number;
}

export function XpNotifications({ maxVisible = 5 }: XpNotificationsProps) {
  const [notifications, setNotifications] = useState<XpNotification[]>([]);

  useEffect(() => {
    const unsub = onXpGain((notif) => {
      setNotifications((prev) => [notif, ...prev].slice(0, maxVisible));
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      }, 3000);
    });
    return unsub;
  }, [maxVisible]);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="animate-in slide-in-from-right-full fade-in duration-300"
          style={{ animationFillMode: "forwards" }}
        >
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm bg-white/95"
            style={{ borderColor: `${getSourceColor(notif.source)}40` }}
          >
            <span className="text-lg">{getSourceIcon(notif.source)}</span>
            <div>
              <div className="text-xs font-semibold" style={{ color: getSourceColor(notif.source) }}>
                +{formatXp(notif.amount)} XP
              </div>
              <div className="text-[10px] text-slate-500 capitalize">{notif.source}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface SidebarXpWidgetProps {
  level: number;
  currentXp: number;
  maxXp: number;
  name?: string;
  title?: string;
  color?: string;
  glowColor?: string;
  badge?: string;
  recentSources?: Array<{ source: XpSource; amount: number }>;
  className?: string;
}

export function SidebarXpWidget({
  level,
  currentXp,
  maxXp,
  name,
  title,
  color,
  glowColor,
  badge,
  recentSources = [],
  className,
}: SidebarXpWidgetProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-3 space-y-3", className)}>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Player Level</div>
      <PlayerLevelBar
        level={level}
        currentXp={currentXp}
        maxXp={maxXp}
        name={name}
        title={title}
        color={color}
        glowColor={glowColor}
        badge={badge}
        size="sm"
      />
      {recentSources.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Recent XP</div>
          {recentSources.slice(0, 4).map((s, i) => (
            <div key={`${s.source}-${i}`} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getSourceColor(s.source) }} />
                <span className="text-slate-600 capitalize">{s.source}</span>
              </div>
              <span className="font-mono font-semibold" style={{ color: getSourceColor(s.source) }}>+{formatXp(s.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface HeaderXpWidgetProps {
  level: number;
  currentXp: number;
  maxXp: number;
  color?: string;
  glowColor?: string;
  badge?: string;
  className?: string;
}

export function HeaderXpWidget({ level, currentXp, maxXp, color, glowColor, badge, className }: HeaderXpWidgetProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {badge && <span className="text-sm">{badge}</span>}
      <div className="min-w-0 flex-1">
        <XpBar
          currentXp={currentXp}
          maxXp={maxXp}
          level={level}
          size="xs"
          showLabel={false}
          showNumbers={false}
          animated
          barClassName="bg-gradient-to-r"
        />
      </div>
      <span className="font-orbitron text-xs font-bold text-slate-700 shrink-0">Lvl {level}</span>
    </div>
  );
}

interface XpBreakdownCardProps {
  sources: Array<{ source: XpSource; amount: number; percentage: number }>;
  totalXp: number;
  className?: string;
}

export function XpBreakdownCard({ sources, totalXp, className }: XpBreakdownCardProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4 space-y-3", className)}>
      <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">XP Sources</div>
      <div className="space-y-2">
        {sources.map((s) => (
          <div key={s.source} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span>{getSourceIcon(s.source)}</span>
                <span className="text-slate-700 capitalize">{s.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-600">{formatXp(s.amount)}</span>
                <span className="text-slate-400">{s.percentage.toFixed(0)}%</span>
              </div>
            </div>
            <div className="h-1 w-full rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${s.percentage}%`, backgroundColor: getSourceColor(s.source) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
