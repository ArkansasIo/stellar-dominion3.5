/**
 * Quantum Singularity Theme - Universe Civilization: Empire at War
 *
 * Theme #10 in the Theme System (see themeSystemConfig.ts).
 *
 * Visual identity:
 *   - A collapsing quantum accretion vortex of cyan, violet, and magenta energy
 *   - Near-black indigo space pierced by dense streams of quantum particles
 *   - Rotating vortex background animation mirrors an event horizon
 *
 * Category:   cyberpunk
 * Rarity:     legendary
 * Unlock:     Reach SS-rank on any entity type OR reach empire tier 60
 *
 * This file holds the single theme definition. It is registered inside
 * THEME_REGISTRY in shared/config/themeSystemConfig.ts and then flows through
 * the whole game automatically:
 *   - titleScreenConfig.getTitleScreenConfigForTheme()
 *   - cssConfig.getCSSConfigForTheme()
 *   - generateThemeCSS() / getThemeCSSVariables()
 */

import type { ThemeDefinition } from '../themeSystemConfig';

export const QUANTUM_SINGULARITY_THEME: ThemeDefinition = {
  id: 'quantum_singularity',
  name: 'Quantum Singularity',
  description:
    'A collapsing accretion vortex of raw quantum energy. Electric cyan and violet waveforms ripple across the event horizon, rewarding those who master the fundamental laws of the universe.',
  category: 'cyberpunk',
  rarity: 'legendary',
  unlockRequirement: 'Reach SS-rank on any entity type OR reach empire tier 60',
  version: 1,

  colors: {
    primary: '#00E0FF',
    secondary: '#7A3CFF',
    accent: '#FF3DFF',
    background: '#030012',
    backgroundAlt: '#0A0026',
    surface: '#14003A',
    surfaceAlt: '#1E005A',
    text: '#E8F6FF',
    textSecondary: '#8FA8FF',
    textMuted: '#4A3A8A',
    border: '#2A0A5A',
    borderLight: '#3A1A7A',
    success: '#00FF9D',
    warning: '#FFD740',
    error: '#FF3D6E',
    info: '#00E0FF',
  },

  gradients: {
    background: 'linear-gradient(180deg, #030012 0%, #0A0026 50%, #030012 100%)',
    backgroundAlt: 'linear-gradient(180deg, #0A0026 0%, #14003A 100%)',
    header: 'linear-gradient(90deg, #030012 0%, #14003A 50%, #030012 100%)',
    footer: 'linear-gradient(90deg, #0A0026 0%, #14003A 50%, #0A0026 100%)',
    card: 'linear-gradient(135deg, #14003A 0%, #1E005A 100%)',
    button: 'linear-gradient(135deg, #00E0FF 0%, #7A3CFF 100%)',
    buttonHover: 'linear-gradient(135deg, #2AE6FF 0%, #8A4CFF 100%)',
    accent: 'linear-gradient(90deg, #00E0FF 0%, #FF3DFF 100%)',
    glow: 'radial-gradient(circle, rgba(0,224,255,0.35) 0%, transparent 70%)',
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
    particleColor: '#00E0FF',
    particleCount: 220,
    glowColor: '#7A3CFF',
    glowIntensity: 0.6,
    shadowColor: 'rgba(0,224,255,0.35)',
    shadowBlur: '24px',
    ambientLight: '#0A0026',
    starDensity: 'very_dense',
    nebulaColor: '#7A3CFF',
    nebulaOpacity: 0.3,
  },

  borderRadius: '6px',
  backdropBlur: '10px',
  transitions: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  backgroundStyle: 'vortex',
  backgroundAnimation: 'rotate',

  musicTheme: 'Quantum Drift - Glitchy synthwave pads, digital arpeggios, deep sub-bass pulses',
  soundscape: 'Data streams flowing, singularity hum, occasional digital chimes',

  sRankColors: {
    S: '#00E0FF',
    SS: '#9D4DFF',
    SSS: '#FF3DFF',
  },

  cssVariables: {
    '--theme-primary': '#00E0FF',
    '--theme-secondary': '#7A3CFF',
    '--theme-accent': '#FF3DFF',
    '--theme-bg': '#030012',
    '--theme-surface': '#14003A',
    '--theme-text': '#E8F6FF',
    '--theme-border': '#2A0A5A',
    '--theme-glow': 'rgba(0,224,255,0.35)',
    '--theme-star-color': '#8FA8FF',
    '--theme-nebula': '#7A3CFF',
  },
};
