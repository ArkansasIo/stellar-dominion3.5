interface GameLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 32, text: "text-xl", sub: "text-[8px]" },
  md: { icon: 48, text: "text-2xl", sub: "text-[9px]" },
  lg: { icon: 64, text: "text-3xl", sub: "text-[10px]" },
  xl: { icon: 80, text: "text-4xl", sub: "text-xs" },
};

export default function GameLogo({ size = "lg", animated = true, showText = true, className = "" }: GameLogoProps) {
  const s = SIZE_MAP[size];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Logo Mark */}
      <div className="relative" style={{ width: s.icon * 2.2, height: s.icon * 2.2 }}>
        {/* Outer ring */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={animated ? { animation: "spin 12s linear infinite" } : {}}
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="none" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray="8 4" opacity="0.6" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" opacity="0.3" />
          {/* Orbit dots */}
          <circle cx="100" cy="10" r="3" fill="#3b82f6" opacity="0.8" />
          <circle cx="190" cy="100" r="2.5" fill="#06b6d4" opacity="0.7" />
          <circle cx="10" cy="100" r="2" fill="#8b5cf6" opacity="0.6" />
        </svg>

        {/* Inner glow */}
        <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-purple-500/20 blur-xl" />

        {/* Core icon */}
        <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/30 flex items-center justify-center shadow-2xl shadow-blue-500/20">
          <svg viewBox="0 0 100 100" className="w-[55%] h-[55%]">
            <defs>
              <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {/* Ship body */}
            <path d="M50 15 L65 45 L60 45 L62 75 L50 70 L38 75 L40 45 L35 45 Z" fill="url(#coreGrad)" opacity="0.9" />
            {/* Wings */}
            <path d="M35 45 L15 55 L20 50 L38 48 Z" fill="url(#wingGrad)" opacity="0.7" />
            <path d="M65 45 L85 55 L80 50 L62 48 Z" fill="url(#wingGrad)" opacity="0.7" />
            {/* Engine glow */}
            <ellipse cx="50" cy="78" rx="6" ry="3" fill="#06b6d4" opacity="0.6">
              {animated && <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />}
            </ellipse>
            <ellipse cx="50" cy="80" rx="4" ry="2" fill="#3b82f6" opacity="0.4">
              {animated && <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.2s" repeatCount="indefinite" />}
            </ellipse>
            {/* Cockpit */}
            <ellipse cx="50" cy="30" rx="4" ry="6" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="0.8" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="text-center">
          <h1 className={`font-orbitron ${s.text} font-black tracking-[0.2em] leading-none`}>
            <span className="text-white">STELLAR</span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent ml-3">DOMINION</span>
          </h1>
          <p className={`font-rajdhani ${s.sub} text-slate-400 tracking-[0.35em] uppercase mt-1.5`}>
            4X Space Strategy Command
          </p>
        </div>
      )}
    </div>
  );
}
