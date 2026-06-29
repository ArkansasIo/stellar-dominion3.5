/**
 * Master CSS Configuration System
 * 
 * Central configuration for all CSS variables, themes, and styling options
 * across the entire game. This system provides:
 *   - Theme variable definitions
 *   - Component-level CSS custom properties
 *   - Animation and transition settings
 *   - Responsive breakpoints
 *   - Accessibility options
 *   - Module-specific configurations
 */

import type { ThemeId, ThemeDefinition } from './themeSystemConfig';

// ============================================================
// CORE CSS VARIABLE INTERFACES
// ============================================================

export interface CSSVariables {
  // Theme surface
  themeSurface: 'light' | 'dark';
  
  // Typography
  fontDisplay: string;
  fontUI: string;
  fontMono: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textHighlight: string;
  textMuted: string;
  textSuccess: string;
  textWarning: string;
  textError: string;
  textInfo: string;
  
  // Button colors
  buttonTop: string;
  buttonBottom: string;
  buttonTopHover: string;
  buttonBottomHover: string;
  buttonTopActive: string;
  buttonBottomActive: string;
  buttonFrame: string;
  buttonFrameActive: string;
  
  // Panel colors
  panelTop: string;
  panelBottom: string;
  panelBorder: string;
  panelGlow: string;
  
  // Background/Scene colors
  starGlow: string;
  orbitLines: string;
  hyperlanes: string;
  nebulaA: string;
  nebulaB: string;
  shellBg: string;
  shellNebulaA: string;
  shellNebulaB: string;
  sceneAccentA: string;
  sceneAccentB: string;
  
  // Sidebar colors
  sidebarTop: string;
  sidebarBottom: string;
  sidebarRadial: string;
  sidebarStatusTop: string;
  sidebarStatusBottom: string;
  
  // Command bar colors
  commandBarTop: string;
  commandBarBottom: string;
  topLinkTop: string;
  topLinkBottom: string;
  realmShellTop: string;
  realmShellBottom: string;
  realmStatusTop: string;
  realmStatusBottom: string;
  
  // Table colors
  tableTop: string;
  tableBottom: string;
  tableHeadTop: string;
  tableHeadBottom: string;
  tableFooterTop: string;
  tableFooterBottom: string;
  
  // Form colors
  inputTop: string;
  inputBottom: string;
  selectContentTop: string;
  selectContentBottom: string;
  tabsTop: string;
  tabsBottom: string;
  badgeTop: string;
  badgeBottom: string;
  
  // Resource colors
  resourceMetal: string;
  resourceEnergy: string;
  resourceCrystal: string;
  resourceScience: string;
  resourceAlloy: string;
  
  // Border radius
  radius: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  
  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowGlow: string;
  
  // Transitions
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  
  // Z-index layers
  zIndexBase: number;
  zIndexDropdown: number;
  zIndexSticky: number;
  zIndexFixed: number;
  zIndexModalBackdrop: number;
  zIndexModal: number;
  zIndexPopover: number;
  zIndexTooltip: number;
}

export interface CSSModuleConfig {
  enabled: boolean;
  variables: Partial<CSSVariables>;
  customStyles?: string;
  overrides?: Record<string, string>;
}

export interface CSSBreakpointConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface CSSAnimationConfig {
  spin: string;
  pulse: string;
  ping: string;
  bounce: string;
  fadeIn: string;
  fadeOut: string;
  slideIn: string;
  slideOut: string;
  scaleIn: string;
  scaleOut: string;
}

export interface CSSAccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  screenReaderOnly: boolean;
  skipLink: boolean;
}

export interface MasterCSSConfig {
  version: string;
  lastUpdated: string;
  
  // Active theme
  activeTheme: ThemeId;
  
  // Global CSS variables
  variables: CSSVariables;
  
  // Module configurations
  modules: {
    buttons: CSSModuleConfig;
    panels: CSSModuleConfig;
    sidebar: CSSModuleConfig;
    background: CSSModuleConfig;
    navigation: CSSModuleConfig;
    forms: CSSModuleConfig;
    dataDisplay: CSSModuleConfig;
    titleScreen: CSSModuleConfig;
    modals: CSSModuleConfig;
    tooltips: CSSModuleConfig;
    tables: CSSModuleConfig;
    cards: CSSModuleConfig;
    lists: CSSModuleConfig;
    badges: CSSModuleConfig;
    progress: CSSModuleConfig;
    charts: CSSModuleConfig;
  };
  
  // Breakpoints
  breakpoints: CSSBreakpointConfig;
  
  // Animations
  animations: CSSAnimationConfig;
  
  // Accessibility
  accessibility: CSSAccessibilityConfig;
  
  // Feature flags
  features: {
    enableDarkMode: boolean;
    enableAnimations: boolean;
    enableParticles: boolean;
    enableGlowEffects: boolean;
    enableTransitions: boolean;
    enableCustomScrollbar: boolean;
    enableTouchUI: boolean;
  };
}

// ============================================================
// DEFAULT CSS VARIABLES
// ============================================================

export const DEFAULT_CSS_VARIABLES: CSSVariables = {
  themeSurface: 'dark',
  
  fontDisplay: '"Orbitron", "Rajdhani", sans-serif',
  fontUI: '"Rajdhani", "Exo 2", sans-serif',
  fontMono: '"JetBrains Mono", "Fira Code", monospace',
  
  textPrimary: '#e8f4ff',
  textSecondary: '#9bb6c9',
  textHighlight: '#4fd4ff',
  textMuted: '#5a7a8a',
  textSuccess: '#00e676',
  textWarning: '#ffd740',
  textError: '#ff5252',
  textInfo: '#40c4ff',
  
  buttonTop: '#2f3c4d',
  buttonBottom: '#1c2633',
  buttonTopHover: '#3f5f7a',
  buttonBottomHover: '#20354a',
  buttonTopActive: '#00a8ff',
  buttonBottomActive: '#005a8d',
  buttonFrame: '#4f6b86',
  buttonFrameActive: '#2bd1ff',
  
  panelTop: 'rgba(20, 30, 40, 0.95)',
  panelBottom: 'rgba(10, 15, 20, 0.95)',
  panelBorder: '#3a5168',
  panelGlow: 'rgba(0, 150, 255, 0.15)',
  
  starGlow: '#ffb347',
  orbitLines: '#6ec5ff',
  hyperlanes: '#3bd1ff',
  nebulaA: 'rgba(80, 110, 255, 0.16)',
  nebulaB: 'rgba(168, 78, 255, 0.12)',
  shellBg: '#060c14',
  shellNebulaA: 'rgba(80, 110, 255, 0.16)',
  shellNebulaB: 'rgba(168, 78, 255, 0.12)',
  sceneAccentA: 'rgba(255, 179, 71, 0.08)',
  sceneAccentB: 'rgba(110, 197, 255, 0.08)',
  
  sidebarTop: 'rgba(26, 38, 52, 0.94)',
  sidebarBottom: 'rgba(10, 16, 24, 0.94)',
  sidebarRadial: 'rgba(79, 212, 255, 0.08)',
  sidebarStatusTop: 'rgba(47, 60, 77, 0.92)',
  sidebarStatusBottom: 'rgba(20, 30, 40, 0.92)',
  
  commandBarTop: 'rgba(47, 60, 77, 0.96)',
  commandBarBottom: 'rgba(18, 27, 38, 0.96)',
  topLinkTop: 'rgba(37, 47, 60, 0.72)',
  topLinkBottom: 'rgba(18, 25, 34, 0.72)',
  realmShellTop: 'rgba(47, 60, 77, 0.9)',
  realmShellBottom: 'rgba(18, 27, 38, 0.9)',
  realmStatusTop: 'rgba(0, 168, 255, 0.2)',
  realmStatusBottom: 'rgba(0, 90, 141, 0.3)',
  
  tableTop: 'rgba(18, 28, 38, 0.94)',
  tableBottom: 'rgba(9, 14, 20, 0.94)',
  tableHeadTop: 'rgba(48, 67, 88, 0.84)',
  tableHeadBottom: 'rgba(21, 31, 43, 0.84)',
  tableFooterTop: 'rgba(47, 60, 77, 0.72)',
  tableFooterBottom: 'rgba(18, 27, 38, 0.72)',
  
  inputTop: 'rgba(43, 57, 73, 0.96)',
  inputBottom: 'rgba(18, 26, 35, 0.96)',
  selectContentTop: 'rgba(28, 38, 51, 0.98)',
  selectContentBottom: 'rgba(10, 15, 20, 0.98)',
  tabsTop: 'rgba(33, 45, 60, 0.92)',
  tabsBottom: 'rgba(13, 20, 28, 0.92)',
  badgeTop: 'rgba(47, 60, 77, 0.94)',
  badgeBottom: 'rgba(22, 31, 43, 0.94)',
  
  resourceMetal: '#cfd8dc',
  resourceEnergy: '#ffd54f',
  resourceCrystal: '#ff5252',
  resourceScience: '#64b5f6',
  resourceAlloy: '#81c784',
  
  radius: '0.25rem',
  radiusSm: '0.125rem',
  radiusMd: '0.375rem',
  radiusLg: '0.5rem',
  radiusXl: '0.75rem',
  
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowGlow: '0 0 20px rgba(0, 150, 255, 0.3)',
  
  transitionFast: '150ms ease',
  transitionNormal: '250ms ease',
  transitionSlow: '350ms ease',
  
  zIndexBase: 0,
  zIndexDropdown: 1000,
  zIndexSticky: 1100,
  zIndexFixed: 1200,
  zIndexModalBackdrop: 1300,
  zIndexModal: 1400,
  zIndexPopover: 1500,
  zIndexTooltip: 1600,
};

// ============================================================
// DEFAULT MODULE CONFIGS
// ============================================================

export const DEFAULT_BUTTON_CONFIG: CSSModuleConfig = {
  enabled: true,
  variables: {
    buttonTop: 'var(--sd-button-top)',
    buttonBottom: 'var(--sd-button-bottom)',
    buttonFrame: 'var(--sd-button-frame)',
  },
  customStyles: `
    .sci-fi-button {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      border-radius: var(--radius);
      clip-path: polygon(
        6px 0, calc(100% - 6px) 0, 100% 6px,
        100% calc(100% - 6px), calc(100% - 6px) 100%,
        6px 100%, 0 calc(100% - 6px), 0 6px
      );
      font-family: var(--sd-font-display);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: all var(--transition-normal);
    }
    
    .sci-fi-button::before {
      content: "";
      position: absolute;
      inset: 1px;
      z-index: -1;
      clip-path: inherit;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.15), transparent 45%);
      opacity: 0.85;
    }
    
    .sci-fi-button:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-glow);
    }
  `,
};

export const DEFAULT_PANEL_CONFIG: CSSModuleConfig = {
  enabled: true,
  variables: {
    panelTop: 'var(--sd-panel-top)',
    panelBottom: 'var(--sd-panel-bottom)',
    panelBorder: 'var(--sd-panel-border)',
    panelGlow: 'var(--sd-panel-glow)',
  },
  customStyles: `
    .glass-panel {
      background: linear-gradient(180deg, var(--sd-panel-top), var(--sd-panel-bottom));
      border: 1px solid var(--sd-panel-border);
      border-radius: var(--radius);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .glass-panel:hover {
      box-shadow: 0 4px 30px var(--sd-panel-glow);
    }
  `,
};

export const DEFAULT_SIDEBAR_CONFIG: CSSModuleConfig = {
  enabled: true,
  variables: {
    sidebarTop: 'var(--sd-sidebar-top)',
    sidebarBottom: 'var(--sd-sidebar-bottom)',
    sidebarRadial: 'var(--sd-sidebar-radial)',
  },
  customStyles: `
    .sidebar {
      background: linear-gradient(180deg, var(--sd-sidebar-top), var(--sd-sidebar-bottom));
      border-right: 1px solid var(--sd-panel-border);
    }
    
    .sidebar::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at top right, var(--sd-sidebar-radial), transparent 70%);
      pointer-events: none;
    }
  `,
};

export const DEFAULT_BACKGROUND_CONFIG: CSSModuleConfig = {
  enabled: true,
  variables: {
    shellBg: 'var(--sd-shell-bg)',
    nebulaA: 'var(--sd-nebula-a)',
    nebulaB: 'var(--sd-nebula-b)',
    starGlow: 'var(--sd-star-glow)',
  },
  customStyles: `
    .game-background {
      background: var(--sd-shell-bg);
      position: relative;
      overflow: hidden;
    }
    
    .game-background::before {
      content: "";
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse at 20% 30%, var(--sd-nebula-a), transparent 50%),
        radial-gradient(ellipse at 80% 70%, var(--sd-nebula-b), transparent 50%);
      animation: nebulaDrift 60s ease-in-out infinite alternate;
    }
    
    @keyframes nebulaDrift {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-5%, 5%) scale(1.1); }
    }
  `,
};

export const DEFAULT_NAVIGATION_CONFIG: CSSModuleConfig = {
  enabled: true,
  variables: {
    commandBarTop: 'var(--sd-command-bar-top)',
    commandBarBottom: 'var(--sd-command-bar-bottom)',
  },
  customStyles: `
    .nav-bar {
      background: linear-gradient(180deg, var(--sd-command-bar-top), var(--sd-command-bar-bottom));
      border-bottom: 1px solid var(--sd-panel-border);
      backdrop-filter: blur(10px);
    }
    
    .nav-link {
      color: var(--sd-text-secondary);
      transition: all var(--transition-fast);
    }
    
    .nav-link:hover {
      color: var(--sd-text-highlight);
      text-shadow: 0 0 10px var(--sd-text-highlight);
    }
  `,
};

export const DEFAULT_FORM_CONFIG: CSSModuleConfig = {
  enabled: true,
  variables: {
    inputTop: 'var(--sd-input-top)',
    inputBottom: 'var(--sd-input-bottom)',
  },
  customStyles: `
    .form-input {
      background: linear-gradient(180deg, var(--sd-input-top), var(--sd-input-bottom));
      border: 1px solid var(--sd-panel-border);
      border-radius: var(--radius);
      color: var(--sd-text-primary);
      transition: all var(--transition-fast);
    }
    
    .form-input:focus {
      outline: none;
      border-color: var(--sd-text-highlight);
      box-shadow: 0 0 0 2px rgba(79, 212, 255, 0.2);
    }
  `,
};

export const DEFAULT_DATA_DISPLAY_CONFIG: CSSModuleConfig = {
  enabled: true,
  variables: {
    tableTop: 'var(--sd-table-top)',
    tableBottom: 'var(--sd-table-bottom)',
    tableHeadTop: 'var(--sd-table-head-top)',
  },
  customStyles: `
    .data-table {
      background: linear-gradient(180deg, var(--sd-table-top), var(--sd-table-bottom));
      border: 1px solid var(--sd-panel-border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    
    .data-table thead {
      background: linear-gradient(180deg, var(--sd-table-head-top), var(--sd-table-head-bottom));
    }
    
    .data-table tbody tr:hover {
      background: rgba(79, 212, 255, 0.05);
    }
  `,
};

export const DEFAULT_TITLE_SCREEN_CSS_CONFIG: CSSModuleConfig = {
  enabled: true,
  variables: {
    shellBg: '#0a0a1a',
    nebulaA: 'rgba(108, 99, 255, 0.2)',
    nebulaB: 'rgba(58, 134, 255, 0.15)',
    textPrimary: '#e8e8ff',
    textSecondary: '#a0a0d0',
    textHighlight: '#00d4ff',
  },
  customStyles: `
    .title-screen {
      background: linear-gradient(to-br, #0f172a, #1e293b, #0f172a);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    
    .title-screen::before {
      content: "";
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse at 30% 20%, rgba(108, 99, 255, 0.15), transparent 50%),
        radial-gradient(ellipse at 70% 80%, rgba(58, 134, 255, 0.1), transparent 50%);
      animation: titlePulse 8s ease-in-out infinite;
    }
    
    @keyframes titlePulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    
    .title-spinner {
      width: 6rem;
      height: 6rem;
      border-radius: 50%;
      position: relative;
    }
    
    .title-spinner::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid transparent;
      border-top-color: #3b82f6;
      border-right-color: #06b6d4;
      animation: spin 1s linear infinite;
    }
    
    .title-spinner-inner {
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
};

// ============================================================
// BREAKPOINTS
// ============================================================

export const DEFAULT_BREAKPOINTS: CSSBreakpointConfig = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
};

// ============================================================
// ANIMATIONS
// ============================================================

export const DEFAULT_ANIMATIONS: CSSAnimationConfig = {
  spin: '1s linear infinite',
  pulse: '2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  ping: '1s cubic-bezier(0, 0, 0.2, 1) infinite',
  bounce: '1s infinite',
  fadeIn: 'fadeIn 300ms ease-in-out',
  fadeOut: 'fadeOut 300ms ease-in-out',
  slideIn: 'slideIn 300ms ease-out',
  slideOut: 'slideOut 300ms ease-in',
  scaleIn: 'scaleIn 200ms ease-out',
  scaleOut: 'scaleOut 200ms ease-in',
};

// ============================================================
// ACCESSIBILITY
// ============================================================

export const DEFAULT_ACCESSIBILITY: CSSAccessibilityConfig = {
  reducedMotion: false,
  highContrast: false,
  focusVisible: true,
  screenReaderOnly: true,
  skipLink: true,
};

// ============================================================
// FEATURE FLAGS
// ============================================================

export const DEFAULT_FEATURES = {
  enableDarkMode: true,
  enableAnimations: true,
  enableParticles: true,
  enableGlowEffects: true,
  enableTransitions: true,
  enableCustomScrollbar: true,
  enableTouchUI: false,
};

// ============================================================
// MASTER CONFIG
// ============================================================

export const DEFAULT_MASTER_CSS_CONFIG: MasterCSSConfig = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  
  activeTheme: 'cosmic_void',
  
  variables: DEFAULT_CSS_VARIABLES,
  
  modules: {
    buttons: DEFAULT_BUTTON_CONFIG,
    panels: DEFAULT_PANEL_CONFIG,
    sidebar: DEFAULT_SIDEBAR_CONFIG,
    background: DEFAULT_BACKGROUND_CONFIG,
    navigation: DEFAULT_NAVIGATION_CONFIG,
    forms: DEFAULT_FORM_CONFIG,
    dataDisplay: DEFAULT_DATA_DISPLAY_CONFIG,
    titleScreen: DEFAULT_TITLE_SCREEN_CSS_CONFIG,
    modals: { enabled: true, variables: {} },
    tooltips: { enabled: true, variables: {} },
    tables: { enabled: true, variables: {} },
    cards: { enabled: true, variables: {} },
    lists: { enabled: true, variables: {} },
    badges: { enabled: true, variables: {} },
    progress: { enabled: true, variables: {} },
    charts: { enabled: true, variables: {} },
  },
  
  breakpoints: DEFAULT_BREAKPOINTS,
  animations: DEFAULT_ANIMATIONS,
  accessibility: DEFAULT_ACCESSIBILITY,
  features: DEFAULT_FEATURES,
};

// ============================================================
// THEME-SPECIFIC CSS CONFIGS
// ============================================================

export function getCSSConfigForTheme(themeId: ThemeId): MasterCSSConfig {
  const base = DEFAULT_MASTER_CSS_CONFIG;
  
  // Theme-specific overrides would go here
  // For now, return the base config with the theme ID updated
  return {
    ...base,
    activeTheme: themeId,
  };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function generateCSSVariables(config: MasterCSSConfig): string {
  const vars: string[] = [];
  
  const flattenVariables = (prefix: string, obj: Record<string, unknown>, result: string[] = []) => {
    for (const [key, value] of Object.entries(obj)) {
      const cssKey = `--${prefix}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenVariables(`${prefix}-${key}`, value as Record<string, unknown>, result);
      } else {
        result.push(`${cssKey}: ${value};`);
      }
    }
    return result;
  };
  
  return vars.join('\n  ');
}

export function getCSSVariable(name: string, config: MasterCSSConfig = DEFAULT_MASTER_CSS_CONFIG): string | undefined {
  const keys = name.split('.');
  let value: unknown = config.variables;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return typeof value === 'string' ? value : undefined;
}

export function isModuleEnabled(moduleName: keyof MasterCSSConfig['modules'], config: MasterCSSConfig = DEFAULT_MASTER_CSS_CONFIG): boolean {
  return config.modules[moduleName]?.enabled ?? false;
}

export function getModuleConfig(moduleName: keyof MasterCSSConfig['modules'], config: MasterCSSConfig = DEFAULT_MASTER_CSS_CONFIG): CSSModuleConfig | undefined {
  return config.modules[moduleName];
}