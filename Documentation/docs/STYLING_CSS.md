# Styling & CSS Structure

## Technology Stack
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library (Radix UI primitives)
- **Framer Motion** - Animations
- **Lucide React** - Icon library

## CSS Files
```
client/src/
├── index.css                  # Global styles, Tailwind imports, custom properties
├── lib/
│   └── utils.ts               # cn() helper (clsx + tailwind-merge)
└── components/ui/             # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── tabs.tsx
    ├── progress.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── scroll-area.tsx
    ├── dialog.tsx
    ├── sheet.tsx
    ├── toast.tsx
    ├── tooltip.tsx
    └── ... (30+ components)
```

## Theme System (`shared/config/cssConfig.ts`)
- `DEFAULT_MASTER_CSS_CONFIG` - Master theme definition
- `DEFAULT_CSS_VARIABLES` - CSS custom properties
- `DEFAULT_BUTTON_CONFIG` - Button styling
- `DEFAULT_PANEL_CONFIG` - Panel styling
- `DEFAULT_SIDEBAR_CONFIG` - Sidebar styling
- `DEFAULT_BACKGROUND_CONFIG` - Background themes
- `DEFAULT_NAVIGATION_CONFIG` - Nav styling
- `DEFAULT_FORM_CONFIG` - Form elements
- `DEFAULT_DATA_DISPLAY_CONFIG` - Tables/lists
- Theme presets: `black-style`, `og-white`, `imperial-gold`

## Key CSS Classes
- `font-orbitron` - Headings and titles
- `font-rajdhani` - Body text and labels
- `font-mono` - Code/data display
- `text-primary` - Primary accent color
- `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950` - Main background
- `sd-sidebar-item` - Sidebar navigation items
- `sd-sidebar-section` - Sidebar section groups
