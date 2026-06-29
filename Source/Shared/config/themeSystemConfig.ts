/**
 * Theme System Configuration - 9 Visual Themes for Stellar Dominion
 * 
 * Each theme provides a complete visual identity with:
 *   - Background colors/gradients
 *   - UI color palette
 *   - Font styles
 *   - Particle effects
 *   - Ambient lighting
 *   - Music/SFX style guide
 *   - Border and accent styles
 */

export type ThemeId = 
  | 'cosmic_void'
  | 'nebula_dreams'
  | 'solar_flare'
  | 'deep_ocean'
  | 'crystal_aurora'
  | 'shadow_realm'
  | 'emerald_forest'
  | 'crimson_war'
  | 'stellar_gold';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeGradients {
  background: string;
  backgroundAlt: string;
  header: string;
  footer: string;
  card: string;
  button: string;
  buttonHover: string;
  accent: string;
  glow: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  mono: string;
  title: string;
  ui: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeEffects {
  particleColor: string;
  particleCount: number;
  glowColor: string;
  glowIntensity: number;
  shadowColor: string;
  shadowBlur: string;
  ambientLight: string;
  starDensity: 'sparse' | 'normal' | 'dense' | 'very_dense';
  nebulaColor: string;
  nebulaOpacity: number;
}

export interface ThemeComponent {
  name: string;
  description: string;
  category: 'space' | 'fantasy' | 'cyberpunk' | 'natural' | 'elemental';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockRequirement?: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  category: ThemeComponent['category'];
  rarity: ThemeComponent['rarity'];
  unlockRequirement: string;
  version: number;
  
  // Visual identity
  colors: ThemeColors;
  gradients: ThemeGradients;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  
  // Effects
  effects: ThemeEffects;
  
  // UI specific
  borderRadius: string;
  backdropBlur: string;
  transitions: string;
  
  // Background image/style
  backgroundStyle: 'gradient' | 'stars' | 'nebula' | 'grid' | 'hex' | 'particles' | 'vortex' | 'matrix' | 'aurora';
  backgroundAnimation: 'static' | 'slow_drift' | 'pulse' | 'rotate' | 'wave' | 'matrix_rain' | 'particle_flow';
  
  // Music/SFX theme
  musicTheme: string;
  soundscape: string;
  
  // S-rank color overrides (if any)
  sRankColors?: {
    S?: string;
    SS?: string;
    SSS?: string;
  };

  // CSS custom properties mapping
  cssVariables: Record<string, string>;
}

// ============================================================
// THEME 1: Cosmic Void
// ============================================================

const COSMIC_VOID: ThemeDefinition = {
  id: 'cosmic_void',
  name: 'Cosmic Void',
  description: 'The boundless darkness of deep space. Stars twinkle in the infinite void, creating a sense of wonder and exploration.',
  category: 'space',
  rarity: 'common',
  unlockRequirement: 'Default theme - always available',
  version: 1,

  colors: {
    primary: '#6C63FF',
    secondary: '#3A86FF',
    accent: '#00D4FF',
    background: '#0A0A1A',
    backgroundAlt: '#0F0F2A',
    surface: '#1A1A3E',
    surfaceAlt: '#252550',
    text: '#E8E8FF',
    textSecondary: '#A0A0D0',
    textMuted: '#606090',
    border: '#2A2A5E',
    borderLight: '#3A3A7E',
    success: '#00E676',
    warning: '#FFD740',
    error: '#FF5252',
    info: '#40C4FF',
  },

  gradients: {
    background: 'linear-gradient(180deg, #0A0A1A 0%, #0F0F2A 50%, #0A0A1A 100%)',
    backgroundAlt: 'linear-gradient(180deg, #0F0F2A 0%, #1A1A3E 100%)',
    header: 'linear-gradient(90deg, #0A0A1A 0%, #1A1A3E 50%, #0A0A1A 100%)',
    footer: 'linear-gradient(90deg, #0F0F2A 0%, #1A1A3E 50%, #0F0F2A 100%)',
    card: 'linear-gradient(135deg, #1A1A3E 0%, #252550 100%)',
    button: 'linear-gradient(135deg, #6C63FF 0%, #3A86FF 100%)',
    buttonHover: 'linear-gradient(135deg, #7C73FF 0%, #4A96FF 100%)',
    accent: 'linear-gradient(90deg, #6C63FF 0%, #00D4FF 100%)',
    glow: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Orbitron", "Rajdhani", sans-serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Audiowide", "Orbitron", sans-serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#6C63FF',
    particleCount: 100,
    glowColor: '#3A86FF',
    glowIntensity: 0.3,
    shadowColor: 'rgba(108,99,255,0.2)',
    shadowBlur: '20px',
    ambientLight: '#0A0A2A',
    starDensity: 'dense',
    nebulaColor: '#1A1A3E',
    nebulaOpacity: 0.2,
  },

  borderRadius: '8px',
  backdropBlur: '10px',
  transitions: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'stars',
  backgroundAnimation: 'slow_drift',

  musicTheme: 'Ambient Space - Deep atmospheric drones with subtle chimes',
  soundscape: 'Distant stars humming, occasional meteor whoosh',

  cssVariables: {
    '--theme-primary': '#6C63FF',
    '--theme-secondary': '#3A86FF',
    '--theme-accent': '#00D4FF',
    '--theme-bg': '#0A0A1A',
    '--theme-surface': '#1A1A3E',
    '--theme-text': '#E8E8FF',
    '--theme-border': '#2A2A5E',
    '--theme-glow': 'rgba(108,99,255,0.3)',
    '--theme-star-color': '#E8E8FF',
    '--theme-nebula': '#1A1A3E',
  },
};

// ============================================================
// THEME 2: Nebula Dreams
// ============================================================

const NEBULA_DREAMS: ThemeDefinition = {
  id: 'nebula_dreams',
  name: 'Nebula Dreams',
  description: 'Vibrant purple and pink nebula clouds drift across the cosmos. A dreamy, ethereal atmosphere for creative empire building.',
  category: 'space',
  rarity: 'uncommon',
  unlockRequirement: 'Reach level 50 OR complete Act 2 of story mode',
  version: 1,

  colors: {
    primary: '#E040FB',
    secondary: '#7C4DFF',
    accent: '#FF80AB',
    background: '#0D0221',
    backgroundAlt: '#1A0438',
    surface: '#2D0A52',
    surfaceAlt: '#3D1A6E',
    text: '#F3E5FF',
    textSecondary: '#CE93D8',
    textMuted: '#8E24AA',
    border: '#4A148C',
    borderLight: '#6A1B9A',
    success: '#69F0AE',
    warning: '#FFD740',
    error: '#FF1744',
    info: '#40C4FF',
  },

  gradients: {
    background: 'linear-gradient(180deg, #0D0221 0%, #1A0438 50%, #0D0221 100%)',
    backgroundAlt: 'linear-gradient(180deg, #1A0438 0%, #2D0A52 100%)',
    header: 'linear-gradient(90deg, #0D0221 0%, #2D0A52 50%, #0D0221 100%)',
    footer: 'linear-gradient(90deg, #1A0438 0%, #2D0A52 50%, #1A0438 100%)',
    card: 'linear-gradient(135deg, #2D0A52 0%, #3D1A6E 100%)',
    button: 'linear-gradient(135deg, #E040FB 0%, #7C4DFF 100%)',
    buttonHover: 'linear-gradient(135deg, #F050FF 0%, #8C5DFF 100%)',
    accent: 'linear-gradient(90deg, #E040FB 0%, #FF80AB 100%)',
    glow: 'radial-gradient(circle, rgba(224,64,251,0.3) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Audiowide", "Orbitron", sans-serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Audiowide", "Orbitron", sans-serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#E040FB',
    particleCount: 150,
    glowColor: '#7C4DFF',
    glowIntensity: 0.4,
    shadowColor: 'rgba(224,64,251,0.25)',
    shadowBlur: '25px',
    ambientLight: '#1A0438',
    starDensity: 'normal',
    nebulaColor: '#E040FB',
    nebulaOpacity: 0.35,
  },

  borderRadius: '10px',
  backdropBlur: '12px',
  transitions: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'nebula',
  backgroundAnimation: 'pulse',

  musicTheme: 'Ethereal Dreamscape - Soft pads, celestial choirs, gentle arpeggios',
  soundscape: 'Nebula gases hissing, distant whale-like calls, crystal echoes',

  cssVariables: {
    '--theme-primary': '#E040FB',
    '--theme-secondary': '#7C4DFF',
    '--theme-accent': '#FF80AB',
    '--theme-bg': '#0D0221',
    '--theme-surface': '#2D0A52',
    '--theme-text': '#F3E5FF',
    '--theme-border': '#4A148C',
    '--theme-glow': 'rgba(224,64,251,0.3)',
    '--theme-star-color': '#CE93D8',
    '--theme-nebula': '#E040FB',
  },
};

// ============================================================
// THEME 3: Solar Flare
// ============================================================

const SOLAR_FLARE: ThemeDefinition = {
  id: 'solar_flare',
  name: 'Solar Flare',
  description: 'Intense orange and gold solar storms rage across the screen. A high-energy theme for aggressive players.',
  category: 'elemental',
  rarity: 'rare',
  unlockRequirement: 'Win 10 PvP battles OR reach tier 20',
  version: 1,

  colors: {
    primary: '#FF6D00',
    secondary: '#FF9100',
    accent: '#FFD740',
    background: '#1A0500',
    backgroundAlt: '#2A0A00',
    surface: '#3D1500',
    surfaceAlt: '#5A2000',
    text: '#FFF3E0',
    textSecondary: '#FFCC80',
    textMuted: '#BF6E00',
    border: '#7A2E00',
    borderLight: '#9A3E00',
    success: '#76FF03',
    warning: '#FFD740',
    error: '#FF1744',
    info: '#40C4FF',
  },

  gradients: {
    background: 'linear-gradient(180deg, #1A0500 0%, #2A0A00 50%, #1A0500 100%)',
    backgroundAlt: 'linear-gradient(180deg, #2A0A00 0%, #3D1500 100%)',
    header: 'linear-gradient(90deg, #1A0500 0%, #3D1500 50%, #1A0500 100%)',
    footer: 'linear-gradient(90deg, #2A0A00 0%, #3D1500 50%, #2A0A00 100%)',
    card: 'linear-gradient(135deg, #3D1500 0%, #5A2000 100%)',
    button: 'linear-gradient(135deg, #FF6D00 0%, #FF9100 100%)',
    buttonHover: 'linear-gradient(135deg, #FF7D10 0%, #FFA110 100%)',
    accent: 'linear-gradient(90deg, #FF6D00 0%, #FFD740 100%)',
    glow: 'radial-gradient(circle, rgba(255,109,0,0.3) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Orbitron", "Rajdhani", sans-serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Audiowide", "Orbitron", sans-serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#FF6D00',
    particleCount: 200,
    glowColor: '#FF9100',
    glowIntensity: 0.5,
    shadowColor: 'rgba(255,109,0,0.3)',
    shadowBlur: '15px',
    ambientLight: '#2A0A00',
    starDensity: 'sparse',
    nebulaColor: '#FF6D00',
    nebulaOpacity: 0.15,
  },

  borderRadius: '6px',
  backdropBlur: '8px',
  transitions: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'particles',
  backgroundAnimation: 'wave',

  musicTheme: 'Intense Action - Driving percussion, electric guitars, brass stabs',
  soundscape: 'Crackling flames, explosions, metallic clangs',

  cssVariables: {
    '--theme-primary': '#FF6D00',
    '--theme-secondary': '#FF9100',
    '--theme-accent': '#FFD740',
    '--theme-bg': '#1A0500',
    '--theme-surface': '#3D1500',
    '--theme-text': '#FFF3E0',
    '--theme-border': '#7A2E00',
    '--theme-glow': 'rgba(255,109,0,0.3)',
    '--theme-star-color': '#FFCC80',
    '--theme-nebula': '#FF6D00',
  },
};

// ============================================================
// THEME 4: Deep Ocean
// ============================================================

const DEEP_OCEAN: ThemeDefinition = {
  id: 'deep_ocean',
  name: 'Deep Ocean',
  description: 'Descend into the abyssal depths of a water world. Blue-green gradients evoke the mystery of unexplored oceans.',
  category: 'natural',
  rarity: 'uncommon',
  unlockRequirement: 'Colonize 5 water-type planets OR reach level 30',
  version: 1,

  colors: {
    primary: '#00BCD4',
    secondary: '#0097A7',
    accent: '#80DEEA',
    background: '#001418',
    backgroundAlt: '#00222A',
    surface: '#003542',
    surfaceAlt: '#004D5E',
    text: '#E0F7FA',
    textSecondary: '#80DEEA',
    textMuted: '#006064',
    border: '#006978',
    borderLight: '#00838F',
    success: '#00E676',
    warning: '#FFD740',
    error: '#FF5252',
    info: '#40C4FF',
  },

  gradients: {
    background: 'linear-gradient(180deg, #001418 0%, #00222A 50%, #001418 100%)',
    backgroundAlt: 'linear-gradient(180deg, #00222A 0%, #003542 100%)',
    header: 'linear-gradient(90deg, #001418 0%, #003542 50%, #001418 100%)',
    footer: 'linear-gradient(90deg, #00222A 0%, #003542 50%, #00222A 100%)',
    card: 'linear-gradient(135deg, #003542 0%, #004D5E 100%)',
    button: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
    buttonHover: 'linear-gradient(135deg, #26C6DA 0%, #00ACC1 100%)',
    accent: 'linear-gradient(90deg, #00BCD4 0%, #80DEEA 100%)',
    glow: 'radial-gradient(circle, rgba(0,188,212,0.25) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Rajdhani", "Orbitron", sans-serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Audiowide", "Orbitron", sans-serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#00BCD4',
    particleCount: 80,
    glowColor: '#0097A7',
    glowIntensity: 0.35,
    shadowColor: 'rgba(0,188,212,0.2)',
    shadowBlur: '18px',
    ambientLight: '#00222A',
    starDensity: 'sparse',
    nebulaColor: '#00BCD4',
    nebulaOpacity: 0.25,
  },

  borderRadius: '12px',
  backdropBlur: '15px',
  transitions: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'aurora',
  backgroundAnimation: 'slow_drift',

  musicTheme: 'Deep Blue - Ambient underwater tones, whale songs, bubbling water',
  soundscape: 'Water currents, distant sonar pings, bubble streams',

  cssVariables: {
    '--theme-primary': '#00BCD4',
    '--theme-secondary': '#0097A7',
    '--theme-accent': '#80DEEA',
    '--theme-bg': '#001418',
    '--theme-surface': '#003542',
    '--theme-text': '#E0F7FA',
    '--theme-border': '#006978',
    '--theme-glow': 'rgba(0,188,212,0.25)',
    '--theme-star-color': '#80DEEA',
    '--theme-nebula': '#00BCD4',
  },
};

// ============================================================
// THEME 5: Crystal Aurora
// ============================================================

const CRYSTAL_AURORA: ThemeDefinition = {
  id: 'crystal_aurora',
  name: 'Crystal Aurora',
  description: 'Shimmering crystal formations reflect aurora borealis colors across a frozen landscape. Magical and serene.',
  category: 'fantasy',
  rarity: 'rare',
  unlockRequirement: 'Research tier 15 technology OR complete Act 5',
  version: 1,

  colors: {
    primary: '#00E5FF',
    secondary: '#1DE9B6',
    accent: '#B2FF59',
    background: '#0A1A1A',
    backgroundAlt: '#0F2828',
    surface: '#1A3A3A',
    surfaceAlt: '#2A4A4A',
    text: '#E0F7FA',
    textSecondary: '#80CBC4',
    textMuted: '#4DB6AC',
    border: '#2A5A5A',
    borderLight: '#3A7A7A',
    success: '#69F0AE',
    warning: '#FFD740',
    error: '#FF5252',
    info: '#40C4FF',
  },

  gradients: {
    background: 'linear-gradient(180deg, #0A1A1A 0%, #0F2828 50%, #0A1A1A 100%)',
    backgroundAlt: 'linear-gradient(180deg, #0F2828 0%, #1A3A3A 100%)',
    header: 'linear-gradient(90deg, #0A1A1A 0%, #1A3A3A 50%, #0A1A1A 100%)',
    footer: 'linear-gradient(90deg, #0F2828 0%, #1A3A3A 50%, #0F2828 100%)',
    card: 'linear-gradient(135deg, #1A3A3A 0%, #2A4A4A 100%)',
    button: 'linear-gradient(135deg, #00E5FF 0%, #1DE9B6 100%)',
    buttonHover: 'linear-gradient(135deg, #26E5FF 0%, #3DF9C6 100%)',
    accent: 'linear-gradient(90deg, #00E5FF 0%, #B2FF59 100%)',
    glow: 'radial-gradient(circle, rgba(0,229,255,0.3) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Audiowide", "Orbitron", sans-serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Audiowide", "Orbitron", sans-serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#00E5FF',
    particleCount: 120,
    glowColor: '#1DE9B6',
    glowIntensity: 0.45,
    shadowColor: 'rgba(0,229,255,0.25)',
    shadowBlur: '22px',
    ambientLight: '#0F2828',
    starDensity: 'normal',
    nebulaColor: '#00E5FF',
    nebulaOpacity: 0.2,
  },

  borderRadius: '8px',
  backdropBlur: '10px',
  transitions: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'aurora',
  backgroundAnimation: 'wave',

  musicTheme: 'Crystal Soundscape - Glockenspiel, music boxes, shimmering pads',
  soundscape: 'Crystal chiming, ice cracking, aurora hum',

  cssVariables: {
    '--theme-primary': '#00E5FF',
    '--theme-secondary': '#1DE9B6',
    '--theme-accent': '#B2FF59',
    '--theme-bg': '#0A1A1A',
    '--theme-surface': '#1A3A3A',
    '--theme-text': '#E0F7FA',
    '--theme-border': '#2A5A5A',
    '--theme-glow': 'rgba(0,229,255,0.3)',
    '--theme-star-color': '#80CBC4',
    '--theme-nebula': '#00E5FF',
  },
};

// ============================================================
// THEME 6: Shadow Realm
// ============================================================

const SHADOW_REALM: ThemeDefinition = {
  id: 'shadow_realm',
  name: 'Shadow Realm',
  description: 'Dark, mysterious, and foreboding. Purple-black shadows with ghostly green accents create a sinister atmosphere.',
  category: 'fantasy',
  rarity: 'epic',
  unlockRequirement: 'Reach tier 40 OR complete Act 7 of story mode',
  version: 1,

  colors: {
    primary: '#7B1FA2',
    secondary: '#4A148C',
    accent: '#00E676',
    background: '#05000A',
    backgroundAlt: '#0A0018',
    surface: '#150026',
    surfaceAlt: '#20003A',
    text: '#E0D0F0',
    textSecondary: '#9C7CC0',
    textMuted: '#5A3A7A',
    border: '#2A004A',
    borderLight: '#3A006A',
    success: '#00E676',
    warning: '#FFD740',
    error: '#FF1744',
    info: '#7C4DFF',
  },

  gradients: {
    background: 'linear-gradient(180deg, #05000A 0%, #0A0018 50%, #05000A 100%)',
    backgroundAlt: 'linear-gradient(180deg, #0A0018 0%, #150026 100%)',
    header: 'linear-gradient(90deg, #05000A 0%, #150026 50%, #05000A 100%)',
    footer: 'linear-gradient(90deg, #0A0018 0%, #150026 50%, #0A0018 100%)',
    card: 'linear-gradient(135deg, #150026 0%, #20003A 100%)',
    button: 'linear-gradient(135deg, #7B1FA2 0%, #4A148C 100%)',
    buttonHover: 'linear-gradient(135deg, #8B2FB2 0%, #5A249C 100%)',
    accent: 'linear-gradient(90deg, #7B1FA2 0%, #00E676 100%)',
    glow: 'radial-gradient(circle, rgba(123,31,162,0.3) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Orbitron", "Rajdhani", sans-serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Audiowide", "Orbitron", sans-serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#7B1FA2',
    particleCount: 60,
    glowColor: '#00E676',
    glowIntensity: 0.5,
    shadowColor: 'rgba(123,31,162,0.35)',
    shadowBlur: '20px',
    ambientLight: '#0A0018',
    starDensity: 'sparse',
    nebulaColor: '#7B1FA2',
    nebulaOpacity: 0.3,
  },

  borderRadius: '4px',
  backdropBlur: '8px',
  transitions: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'hex',
  backgroundAnimation: 'pulse',

  musicTheme: 'Dark Ominous - Deep bass drones, eerie pads, tension-building strings',
  soundscape: 'Whispers in the void, echoing footsteps, distant screams',

  cssVariables: {
    '--theme-primary': '#7B1FA2',
    '--theme-secondary': '#4A148C',
    '--theme-accent': '#00E676',
    '--theme-bg': '#05000A',
    '--theme-surface': '#150026',
    '--theme-text': '#E0D0F0',
    '--theme-border': '#2A004A',
    '--theme-glow': 'rgba(123,31,162,0.3)',
    '--theme-star-color': '#9C7CC0',
    '--theme-nebula': '#7B1FA2',
  },
};

// ============================================================
// THEME 7: Emerald Forest
// ============================================================

const EMERALD_FOREST: ThemeDefinition = {
  id: 'emerald_forest',
  name: 'Emerald Forest',
  description: 'Lush green forests with golden sunlight filtering through the canopy. A vibrant, living theme for nature-focused empires.',
  category: 'natural',
  rarity: 'uncommon',
  unlockRequirement: 'Colonize 5 forest/terran planets OR reach level 25',
  version: 1,

  colors: {
    primary: '#4CAF50',
    secondary: '#2E7D32',
    accent: '#FFD740',
    background: '#0A1A0A',
    backgroundAlt: '#0F2810',
    surface: '#1A3A1A',
    surfaceAlt: '#2A4A2A',
    text: '#E8F5E9',
    textSecondary: '#A5D6A7',
    textMuted: '#66BB6A',
    border: '#2A5A2A',
    borderLight: '#3A7A3A',
    success: '#69F0AE',
    warning: '#FFD740',
    error: '#FF5252',
    info: '#40C4FF',
  },

  gradients: {
    background: 'linear-gradient(180deg, #0A1A0A 0%, #0F2810 50%, #0A1A0A 100%)',
    backgroundAlt: 'linear-gradient(180deg, #0F2810 0%, #1A3A1A 100%)',
    header: 'linear-gradient(90deg, #0A1A0A 0%, #1A3A1A 50%, #0A1A0A 100%)',
    footer: 'linear-gradient(90deg, #0F2810 0%, #1A3A1A 50%, #0F2810 100%)',
    card: 'linear-gradient(135deg, #1A3A1A 0%, #2A4A2A 100%)',
    button: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    buttonHover: 'linear-gradient(135deg, #5CBF60 0%, #3E8D42 100%)',
    accent: 'linear-gradient(90deg, #4CAF50 0%, #FFD740 100%)',
    glow: 'radial-gradient(circle, rgba(76,175,80,0.25) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Rajdhani", "Orbitron", sans-serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Audiowide", "Orbitron", sans-serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#4CAF50',
    particleCount: 90,
    glowColor: '#FFD740',
    glowIntensity: 0.3,
    shadowColor: 'rgba(76,175,80,0.2)',
    shadowBlur: '16px',
    ambientLight: '#0F2810',
    starDensity: 'sparse',
    nebulaColor: '#4CAF50',
    nebulaOpacity: 0.2,
  },

  borderRadius: '10px',
  backdropBlur: '12px',
  transitions: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'particles',
  backgroundAnimation: 'slow_drift',

  musicTheme: 'Nature Symphony - Forest ambience, birdsong, gentle strings',
  soundscape: 'Leaves rustling, streams flowing, birds calling',

  cssVariables: {
    '--theme-primary': '#4CAF50',
    '--theme-secondary': '#2E7D32',
    '--theme-accent': '#FFD740',
    '--theme-bg': '#0A1A0A',
    '--theme-surface': '#1A3A1A',
    '--theme-text': '#E8F5E9',
    '--theme-border': '#2A5A2A',
    '--theme-glow': 'rgba(76,175,80,0.25)',
    '--theme-star-color': '#A5D6A7',
    '--theme-nebula': '#4CAF50',
  },
};

// ============================================================
// THEME 8: Crimson War
// ============================================================

const CRIMSON_WAR: ThemeDefinition = {
  id: 'crimson_war',
  name: 'Crimson War',
  description: 'Blood red and dark metallic tones evoke the chaos of war. For empires forged in battle and conquest.',
  category: 'cyberpunk',
  rarity: 'epic',
  unlockRequirement: 'Win 50 PvP battles OR reach tier 50',
  version: 1,

  colors: {
    primary: '#D32F2F',
    secondary: '#B71C1C',
    accent: '#FF6F00',
    background: '#1A0000',
    backgroundAlt: '#2A0505',
    surface: '#3D0A0A',
    surfaceAlt: '#5A1515',
    text: '#FFEBEE',
    textSecondary: '#EF9A9A',
    textMuted: '#C62828',
    border: '#7A1A1A',
    borderLight: '#9A2A2A',
    success: '#76FF03',
    warning: '#FFD740',
    error: '#FF1744',
    info: '#FF6F00',
  },

  gradients: {
    background: 'linear-gradient(180deg, #1A0000 0%, #2A0505 50%, #1A0000 100%)',
    backgroundAlt: 'linear-gradient(180deg, #2A0505 0%, #3D0A0A 100%)',
    header: 'linear-gradient(90deg, #1A0000 0%, #3D0A0A 50%, #1A0000 100%)',
    footer: 'linear-gradient(90deg, #2A0505 0%, #3D0A0A 50%, #2A0505 100%)',
    card: 'linear-gradient(135deg, #3D0A0A 0%, #5A1515 100%)',
    button: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
    buttonHover: 'linear-gradient(135deg, #E33F3F 0%, #C72C2C 100%)',
    accent: 'linear-gradient(90deg, #D32F2F 0%, #FF6F00 100%)',
    glow: 'radial-gradient(circle, rgba(211,47,47,0.35) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Orbitron", "Rajdhani", sans-serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Audiowide", "Orbitron", sans-serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#D32F2F',
    particleCount: 180,
    glowColor: '#FF6F00',
    glowIntensity: 0.55,
    shadowColor: 'rgba(211,47,47,0.4)',
    shadowBlur: '12px',
    ambientLight: '#2A0505',
    starDensity: 'sparse',
    nebulaColor: '#D32F2F',
    nebulaOpacity: 0.25,
  },

  borderRadius: '4px',
  backdropBlur: '6px',
  transitions: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'grid',
  backgroundAnimation: 'pulse',

  musicTheme: 'War March - Heavy percussion, distorted guitars, war horns',
  soundscape: 'Clashing metal, explosions, war cries, marching boots',

  cssVariables: {
    '--theme-primary': '#D32F2F',
    '--theme-secondary': '#B71C1C',
    '--theme-accent': '#FF6F00',
    '--theme-bg': '#1A0000',
    '--theme-surface': '#3D0A0A',
    '--theme-text': '#FFEBEE',
    '--theme-border': '#7A1A1A',
    '--theme-glow': 'rgba(211,47,47,0.35)',
    '--theme-star-color': '#EF9A9A',
    '--theme-nebula': '#D32F2F',
  },
};

// ============================================================
// THEME 9: Stellar Gold
// ============================================================

const STELLAR_GOLD: ThemeDefinition = {
  id: 'stellar_gold',
  name: 'Stellar Gold',
  description: 'Opulent gold and royal purple. The ultimate prestige theme for supreme rulers who have achieved SSS-rank transcendence.',
  category: 'space',
  rarity: 'legendary',
  unlockRequirement: 'REACH SSS-RANK ON ANY ENTITY TYPE - Ultimate prestige theme',
  version: 1,

  colors: {
    primary: '#FFD700',
    secondary: '#FFA000',
    accent: '#E040FB',
    background: '#0A0800',
    backgroundAlt: '#151000',
    surface: '#2A2000',
    surfaceAlt: '#3A3000',
    text: '#FFF8E1',
    textSecondary: '#FFD54F',
    textMuted: '#BF8F00',
    border: '#5A4000',
    borderLight: '#7A6000',
    success: '#76FF03',
    warning: '#FFD740',
    error: '#FF5252',
    info: '#E040FB',
  },

  gradients: {
    background: 'linear-gradient(180deg, #0A0800 0%, #151000 50%, #0A0800 100%)',
    backgroundAlt: 'linear-gradient(180deg, #151000 0%, #2A2000 100%)',
    header: 'linear-gradient(90deg, #0A0800 0%, #2A2000 50%, #0A0800 100%)',
    footer: 'linear-gradient(90deg, #151000 0%, #2A2000 50%, #151000 100%)',
    card: 'linear-gradient(135deg, #2A2000 0%, #3A3000 100%)',
    button: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
    buttonHover: 'linear-gradient(135deg, #FFE710 0%, #FFB010 100%)',
    accent: 'linear-gradient(90deg, #FFD700 0%, #E040FB 100%)',
    glow: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
  },

  fonts: {
    heading: '"Playfair Display", "Georgia", serif',
    body: '"Exo 2", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    title: '"Playfair Display", "Georgia", serif',
    ui: '"Rajdhani", "Exo 2", sans-serif',
  },

  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },

  effects: {
    particleColor: '#FFD700',
    particleCount: 250,
    glowColor: '#FFA000',
    glowIntensity: 0.7,
    shadowColor: 'rgba(255,215,0,0.5)',
    shadowBlur: '30px',
    ambientLight: '#151000',
    starDensity: 'very_dense',
    nebulaColor: '#FFD700',
    nebulaOpacity: 0.1,
  },

  borderRadius: '12px',
  backdropBlur: '20px',
  transitions: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'vortex',
  backgroundAnimation: 'rotate',

  musicTheme: 'Triumphant Majesty - Orchestral fanfares, choir, golden harp arpeggios',
  soundscape: 'Triumphant fanfares, shimmering gold, royal announcements',

  // S-rank color overrides for this theme
  sRankColors: {
    S: '#FFD700',
    SS: '#FFA000',
    SSS: '#FF6B6B',
  },

  cssVariables: {
    '--theme-primary': '#FFD700',
    '--theme-secondary': '#FFA000',
    '--theme-accent': '#E040FB',
    '--theme-bg': '#0A0800',
    '--theme-surface': '#2A2000',
    '--theme-text': '#FFF8E1',
    '--theme-border': '#5A4000',
    '--theme-glow': 'rgba(255,215,0,0.4)',
    '--theme-star-color': '#FFD54F',
    '--theme-nebula': '#FFD700',
  },
};

// ============================================================
// THEME REGISTRY
// ============================================================

export const THEME_REGISTRY: Record<ThemeId, ThemeDefinition> = {
  cosmic_void: COSMIC_VOID,
  nebula_dreams: NEBULA_DREAMS,
  solar_flare: SOLAR_FLARE,
  deep_ocean: DEEP_OCEAN,
  crystal_aurora: CRYSTAL_AURORA,
  shadow_realm: SHADOW_REALM,
  emerald_forest: EMERALD_FOREST,
  crimson_war: CRIMSON_WAR,
  stellar_gold: STELLAR_GOLD,
};

export const ALL_THEMES: ThemeDefinition[] = Object.values(THEME_REGISTRY);

// ============================================================
// THEME UTILITY FUNCTIONS
// ============================================================

/**
 * Get a theme definition by its ID
 */
export function getThemeById(themeId: ThemeId): ThemeDefinition {
  return THEME_REGISTRY[themeId] || THEME_REGISTRY.cosmic_void;
}

/**
 * Get all themes of a specific category
 */
export function getThemesByCategory(category: ThemeComponent['category']): ThemeDefinition[] {
  return ALL_THEMES.filter(t => t.category === category);
}

/**
 * Get all themes of a specific rarity
 */
export function getThemesByRarity(rarity: ThemeComponent['rarity']): ThemeDefinition[] {
  return ALL_THEMES.filter(t => t.rarity === rarity);
}

/**
 * Check if a theme is unlocked based on player's S-rank tier
 */
export function isThemeUnlockedBySRank(themeId: ThemeId, playerSRankTier: string): boolean {
  const theme = getThemeById(themeId);
  const sRankThemes: Record<string, ThemeId[]> = {
    'none': ['cosmic_void'],
    'S': ['cosmic_void', 'nebula_dreams', 'solar_flare', 'deep_ocean', 'emerald_forest'],
    'SS': ['cosmic_void', 'nebula_dreams', 'solar_flare', 'deep_ocean', 'crystal_aurora', 'shadow_realm', 'emerald_forest', 'crimson_war'],
    'SSS': ALL_THEMES.map(t => t.id),
  };
  return (sRankThemes[playerSRankTier] || ['cosmic_void']).includes(themeId);
}

/**
 * Get the CSS variable map for a theme (for dynamic injection)
 */
export function getThemeCSSVariables(themeId: ThemeId): Record<string, string> {
  return getThemeById(themeId).cssVariables;
}

/**
 * Generate CSS string for a theme
 */
export function generateThemeCSS(themeId: ThemeId): string {
  const theme = getThemeById(themeId);
  const vars = theme.cssVariables;
  const colors = theme.colors;
  let css = `/* ${theme.name} Theme */\n`;
  css += `:root {\n`;
  for (const [key, value] of Object.entries(vars)) {
    css += `  ${key}: ${value};\n`;
  }
  css += `  --theme-border-radius: ${theme.borderRadius};\n`;
  css += `  --theme-backdrop-blur: ${theme.backdropBlur};\n`;
  css += `  --theme-transition: ${theme.transitions};\n`;
  css += `}\n\n`;
  
  css += `.theme-${themeId} {\n`;
  css += `  background: ${theme.gradients.background};\n`;
  css += `  color: ${colors.text};\n`;
  css += `}\n`;
  
  return css;
}

/**
 * Get default theme (always returns Cosmic Void)
 */
export function getDefaultTheme(): ThemeDefinition {
  return THEME_REGISTRY.cosmic_void;
}

export default THEME_REGISTRY;