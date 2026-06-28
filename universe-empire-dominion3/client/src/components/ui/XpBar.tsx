import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatXp, type XpSource, getSourceColor, getSourceIcon } from "@shared/config/xpConfig";

interface XpBarProps {
  currentXp: number;
  maxXp: number;
  level?: number;
  levelLabel?: string;
  source?: XpSource;
  label?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  showNumbers?: boolean;
  showLevel?: boolean;
  showPercent?: boolean;
  animated?: boolean;
  glow?: boolean;
  className?: string;
  barClassName?: string;
}

const sizeClasses: Record<string, { bar: string; text: string; badge: string }> = {
  xs: { bar: "h-1", text: "text-[10px]", badge: "px-1 py-0 text-[9px]" },
  sm: { bar: "h-1.5", text: "text-xs", badge: "px-1.5 py-0.5 text-[10px]" },
  md: { bar: "h-2", text: "text-xs", badge: "px-2 py-0.5 text-xs" },
  lg: { bar: "h-3", text: "text-sm", badge: "px-2 py-1 text-xs" },
  xl: { bar: "h-4", text: "text-sm", badge: "px-3 py-1 text-sm" },
};

export function XpBar({
  currentXp,
  maxXp,
  level,
  levelLabel,
  source,
  label,
  size = "md",
  showLabel = true,
  showNumbers = true,
  showLevel = false,
  showPercent = false,
  animated = true,
  glow = false,
  className,
  barClassName,
}: XpBarProps) {
  const percent = useMemo(() => Math.min(100, Math.max(0, (currentXp / Math.max(1, maxXp)) * 100)), [currentXp, maxXp]);
  const sourceColor = source ? getSourceColor(source) : undefined;
  const sourceIcon = source ? getSourceIcon(source) : undefined;
  const sizing = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || showLevel || showNumbers) && (
        <div className={cn("flex items-center justify-between mb-1", sizing.text)}>
          <div className="flex items-center gap-1.5 min-w-0">
            {sourceIcon && <span className="text-xs">{sourceIcon}</span>}
            {showLevel && level !== undefined && (
              <span className="font-orbitron font-bold text-slate-900">Lvl {level}</span>
            )}
            {levelLabel && <span className="text-slate-500 truncate">{levelLabel}</span>}
            {label && <span className="text-slate-500 truncate">{label}</span>}
          </div>
          {showNumbers && (
            <span className="font-mono text-slate-600 shrink-0">
              {formatXp(currentXp)} / {formatXp(maxXp)}
            </span>
          )}
          {showPercent && (
            <span className="font-mono text-slate-500 shrink-0 ml-2">{percent.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full",
          sizing.bar,
          glow && "shadow-lg",
          source ? `bg-opacity-20` : "bg-slate-200"
        )}
        style={source ? { backgroundColor: `${sourceColor}20` } : undefined}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            animated && "duration-700 ease-out",
            barClassName
          )}
          style={{
            width: `${percent}%`,
            backgroundColor: sourceColor || undefined,
            boxShadow: glow && sourceColor ? `0 0 12px ${sourceColor}60` : undefined,
          }}
        />
      </div>
    </div>
  );
}

interface PlayerLevelBarProps {
  currentXp: number;
  maxXp: number;
  level: number;
  name?: string;
  title?: string;
  color?: string;
  glowColor?: string;
  badge?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlayerLevelBar({
  currentXp,
  maxXp,
  level,
  name,
  title,
  color = "#6366f1",
  glowColor = "#818cf8",
  badge,
  size = "md",
  className,
}: PlayerLevelBarProps) {
  const percent = useMemo(() => Math.min(100, Math.max(0, (currentXp / Math.max(1, maxXp)) * 100)), [currentXp, maxXp]);
  const sizing = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("flex items-center gap-2 mb-1.5", sizing.text)}>
        {badge && <span className="text-sm">{badge}</span>}
        <span className="font-orbitron font-bold" style={{ color }}>Lvl {level}</span>
        {name && <span className="font-semibold text-slate-800">{name}</span>}
        {title && <span className="text-slate-500">— {title}</span>}
        <span className="ml-auto font-mono text-slate-600">{formatXp(currentXp)} / {formatXp(maxXp)}</span>
      </div>
      <div
        className={cn("relative w-full overflow-hidden rounded-full", sizing.bar)}
        style={{ backgroundColor: `${color}20` }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${color}, ${glowColor})`,
            boxShadow: `0 0 8px ${glowColor}40`,
          }}
        />
      </div>
    </div>
  );
}

interface MultiSourceXpBarProps {
  sources: Array<{ source: XpSource; currentXp: number; maxXp: number; label?: string }>;
  totalCurrentXp: number;
  totalMaxXp: number;
  level: number;
  className?: string;
}

export function MultiSourceXpBar({ sources, totalCurrentXp, totalMaxXp, level, className }: MultiSourceXpBarProps) {
  const totalPercent = Math.min(100, Math.max(0, (totalCurrentXp / Math.max(1, totalMaxXp)) * 100));

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-orbitron font-bold text-slate-900">Lvl {level}</span>
        <span className="font-mono text-slate-600">{formatXp(totalCurrentXp)} / {formatXp(totalMaxXp)}</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200">
        {sources.map((s) => {
          const segmentWidth = (s.currentXp / Math.max(1, totalMaxXp)) * 100;
          return (
            <div
              key={s.source}
              className="absolute top-0 h-full transition-all duration-700 ease-out"
              style={{
                left: `${sources.slice(0, sources.indexOf(s)).reduce((acc, prev) => acc + (prev.currentXp / Math.max(1, totalMaxXp)) * 100, 0)}%`,
                width: `${segmentWidth}%`,
                backgroundColor: getSourceColor(s.source),
              }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((s) => (
          <div key={s.source} className="flex items-center gap-1 text-[10px] text-slate-500">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getSourceColor(s.source) }} />
            <span>{getSourceIcon(s.source)} {s.label || s.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
