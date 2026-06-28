/**
 * Title Screen Configuration - Front Index / Loading Screen
 * 
 * Defines the visual identity, text content, and behavior
 * of the initial title/loading screen shown on app startup.
 */

export interface TitleScreenConfig {
  // Brand identity
  title: {
    primary: string;
    secondary?: string;
    highlight?: string;
    highlightClass?: string;
  };
  
  // Subtitle / tagline
  tagline: string;
  
  // Version information
  version: {
    display: string;
    buildType: 'alpha' | 'beta' | 'release' | 'preview';
    buildLabel?: string;
  };
  
  // Loading state messages
  loadingMessages: string[];
  loadingCompleteMessage?: string;
  
  // Visual configuration
  visual: {
    backgroundGradient: string;
    particleColor: string;
    particleCount: number;
    glowColor: string;
    glowIntensity: number;
    spinnerColors: {
      border: string;
      borderTransparent: string;
      borderTop: string;
      borderRight: string;
      innerBg: string;
      innerGradientStart: string;
      innerGradientEnd: string;
    };
    iconColor: string;
  };
  
  // Typography
  typography: {
    titleFont: string;
    titleSize: string;
    titleWeight: string;
    titleTracking: string;
    taglineFont: string;
    taglineSize: string;
    taglineTracking: string;
    loadingFont: string;
    loadingSize: string;
    versionFont: string;
    versionSize: string;
  };
  
  // Animation timings (ms)
  animation: {
    minSplashDuration: number;
    spinnerSpeed: number;
    pulseSpeed: number;
    fadeInDuration: number;
  };
  
  // Background style
  backgroundStyle: {
    type: 'gradient' | 'stars' | 'nebula' | 'grid' | 'particles' | 'vortex';
    animation: 'static' | 'slow_drift' | 'pulse' | 'rotate' | 'wave';
    starDensity?: 'sparse' | 'normal' | 'dense' | 'very_dense';
  };
  
  // Audio theme
  audio: {
    musicTheme: string;
    soundscape: string;
  };
  
  // Feature flags
  features: {
    showVersion: boolean;
    showBuildLabel: boolean;
    showParticles: boolean;
    showSpinner: boolean;
    enableSkipOnLoaded: boolean;
  };
}

// ============================================================
// DEFAULT TITLE SCREEN CONFIG
// ============================================================

export const DEFAULT_TITLE_SCREEN_CONFIG: TitleScreenConfig = {
  title: {
    primary: 'Universe',
    secondary: 'Civilizaton',
    highlight: 'Empire-At-War',
    highlightClass: 'bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent',
  },
  
  tagline: 'Connecting to Nexus Command System',
  
  version: {
    display: 'Alpha 1.5.0',
    buildType: 'alpha',
    buildLabel: 'Live Preview Build',
  },
  
  loadingMessages: [
    'Initializing game systems...',
    'Loading stellar cartography...',
    'Calibrating navigation arrays...',
    'Establishing subspace link...',
    'Syncing with central command...',
    'Preparing fleet manifests...',
    'Loading universe data...',
    'Ready.',
  ],
  
  loadingCompleteMessage: 'Welcome, Commander.',
  
  visual: {
    backgroundGradient: 'linear-gradient(to-br, #0f172a, #1e293b, #0f172a)',
    particleColor: '#6C63FF',
    particleCount: 80,
    glowColor: '#3A86FF',
    glowIntensity: 0.3,
    spinnerColors: {
      border: 'border-slate-700',
      borderTransparent: 'border-transparent',
      borderTop: 'border-t-blue-500',
      borderRight: 'border-r-cyan-500',
      innerBg: 'bg-gradient-to-br from-blue-600 to-cyan-600',
      innerGradientStart: '#2563eb',
      innerGradientEnd: '#06b6d4',
    },
    iconColor: 'text-white',
  },
  
  typography: {
    titleFont: '"Orbitron", "Rajdhani", sans-serif',
    titleSize: 'text-4xl',
    titleWeight: 'font-bold',
    titleTracking: 'tracking-widest',
    taglineFont: '"Rajdhani", sans-serif',
    taglineSize: 'text-xs',
    taglineTracking: 'tracking-widest',
    loadingFont: '"Rajdhani", sans-serif',
    loadingSize: 'text-xs',
    versionFont: 'font-mono',
    versionSize: 'text-xs',
  },
  
  animation: {
    minSplashDuration: 350,
    spinnerSpeed: 1,
    pulseSpeed: 2,
    fadeInDuration: 300,
  },
  
  backgroundStyle: {
    type: 'gradient',
    animation: 'static',
    starDensity: 'normal',
  },
  
  audio: {
    musicTheme: 'Ambient Space - Deep atmospheric drones with subtle chimes',
    soundscape: 'Distant stars humming, occasional meteor whoosh',
  },
  
  features: {
    showVersion: true,
    showBuildLabel: true,
    showParticles: true,
    showSpinner: true,
    enableSkipOnLoaded: true,
  },
};

// ============================================================
// THEME-SPECIFIC TITLE SCREEN CONFIGS
// ============================================================

import { ThemeId, getThemeById, type ThemeDefinition } from './themeSystemConfig';

export interface TitleScreenThemeOverrides {
  backgroundGradient?: string;
  particleColor?: string;
  particleCount?: number;
  glowColor?: string;
  glowIntensity?: number;
  spinnerColors?: Partial<typeof DEFAULT_TITLE_SCREEN_CONFIG.visual.spinnerColors>;
  iconColor?: string;
  titleHighlightClass?: string;
}

export function getTitleScreenConfigForTheme(themeId: ThemeId): TitleScreenConfig {
  const theme = getThemeById(themeId);
  const base = DEFAULT_TITLE_SCREEN_CONFIG;
  
  const overrides: TitleScreenThemeOverrides = {
    backgroundGradient: theme.gradients.background,
    particleColor: theme.effects.particleColor,
    particleCount: theme.effects.particleCount,
    glowColor: theme.effects.glowColor,
    glowIntensity: theme.effects.glowIntensity,
    spinnerColors: {
      borderTop: mapColorToBorderClass(theme.colors.primary),
      borderRight: mapColorToBorderClass(theme.colors.accent),
      innerGradientStart: theme.colors.primary,
      innerGradientEnd: theme.colors.secondary,
    },
    iconColor: 'text-white',
    titleHighlightClass: `bg-gradient-to-r bg-clip-text text-transparent`,
  };
  
  return {
    ...base,
    visual: {
      ...base.visual,
      ...overrides,
      spinnerColors: {
        ...base.visual.spinnerColors,
        ...overrides.spinnerColors,
      },
    },
    title: {
      ...base.title,
      highlightClass: overrides.titleHighlightClass,
    },
    backgroundStyle: {
      type: mapBackgroundStyle(theme.backgroundStyle),
      animation: mapAnimation(theme.backgroundAnimation),
      starDensity: theme.effects.starDensity,
    },
    audio: {
      musicTheme: theme.musicTheme,
      soundscape: theme.soundscape,
    },
  };
}

function mapColorToBorderClass(color: string): string {
  // Map hex colors to approximate Tailwind border classes
  const colorMap: Record<string, string> = {
    '#6C63FF': 'border-t-blue-500',
    '#E040FB': 'border-t-purple-500',
    '#FF6D00': 'border-t-orange-500',
    '#00BCD4': 'border-t-cyan-500',
    '#00E5FF': 'border-t-cyan-400',
    '#7B1FA2': 'border-t-purple-700',
    '#4CAF50': 'border-t-green-500',
    '#D32F2F': 'border-t-red-600',
    '#FFD700': 'border-t-yellow-500',
  };
  return colorMap[color] || 'border-t-blue-500';
}

function mapBackgroundStyle(style: ThemeDefinition['backgroundStyle']): TitleScreenConfig['backgroundStyle']['type'] {
  const map: Record<string, TitleScreenConfig['backgroundStyle']['type']> = {
    'gradient': 'gradient',
    'stars': 'stars',
    'nebula': 'nebula',
    'grid': 'grid',
    'hex': 'particles',
    'particles': 'particles',
    'vortex': 'vortex',
    'matrix': 'grid',
    'aurora': 'nebula',
  };
  return map[style] || 'gradient';
}

function mapAnimation(animation: ThemeDefinition['backgroundAnimation']): TitleScreenConfig['backgroundStyle']['animation'] {
  const map: Record<string, TitleScreenConfig['backgroundStyle']['animation']> = {
    'static': 'static',
    'slow_drift': 'slow_drift',
    'pulse': 'pulse',
    'rotate': 'rotate',
    'wave': 'wave',
    'matrix_rain': 'wave',
    'particle_flow': 'slow_drift',
  };
  return map[animation] || 'static';
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getLoadingMessage(progress: number, config: TitleScreenConfig = DEFAULT_TITLE_SCREEN_CONFIG): string {
  const messages = config.loadingMessages;
  const index = Math.min(Math.floor(progress * messages.length), messages.length - 1);
  return messages[index];
}

export function getTitleScreenThemeConfig(themeId?: ThemeId): TitleScreenConfig {
  if (!themeId) {
    return DEFAULT_TITLE_SCREEN_CONFIG;
  }
  return getTitleScreenConfigForTheme(themeId);
}

// Re-export theme types for convenience
export type { ThemeId } from './themeSystemConfig';