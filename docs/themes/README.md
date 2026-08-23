# Theme System — Universe Civilization: Empire at War

**Source:** `shared/config/themeSystemConfig.ts`

The Theme System gives every empire a complete visual identity. Each theme
packs a full palette, gradients, fonts, spacing, particle/glow effects,
background style & animation, an audio guide (music + SFX), S-rank color
overrides, and ready-to-inject CSS custom properties.

---

## How a Theme Flows Through the Game

```
themeSystemConfig.ts (THEME_REGISTRY)
   ├── titleScreenConfig.getTitleScreenConfigForTheme(themeId)
   │        → title/loading screen colors, spinner, background, audio
   ├── cssConfig.getCSSConfigForTheme(themeId)
   │        → master CSS config + active theme id
   ├── generateThemeCSS(themeId)
   │        → ":root { --theme-* }" + ".theme-<id>" style block
   ├── getThemeCSSVariables(themeId)
   │        → raw CSS variable map for dynamic injection
   └── isThemeUnlockedBySRank(themeId, sRank)
            → unlock gating by entity S / SS / SSS rank
```

Each theme is a `ThemeDefinition` object registered under a unique `ThemeId`
string in `THEME_REGISTRY`. Consumers look themes up by id through the helper
functions, so adding a theme is a purely additive, registration-only change.

---

## Theme Definition Interface

| Field | Type | Purpose |
|-------|------|---------|
| `id` | `ThemeId` | Unique string id (snake_case) |
| `name` | `string` | Display name |
| `description` | `string` | Flavor text shown in theme pickers |
| `category` | `'space' \| 'fantasy' \| 'cyberpunk' \| 'natural' \| 'elemental'` | Content grouping |
| `rarity` | `'common' \| 'uncommon' \| 'rare' \| 'epic' \| 'legendary'` | Unlock gating tier |
| `unlockRequirement` | `string` | Human-readable unlock condition |
| `version` | `number` | Theme schema version |
| `colors` | `ThemeColors` | 16-color UI palette |
| `gradients` | `ThemeGradients` | 9 CSS gradients |
| `fonts` | `ThemeFonts` | 5 font stacks |
| `spacing` | `ThemeSpacing` | 6 spacing tokens |
| `effects` | `ThemeEffects` | Particles, glow, star density, nebula |
| `borderRadius` / `backdropBlur` / `transitions` | `string` | UI shape tokens |
| `backgroundStyle` | 9 options | `gradient`/`stars`/`nebula`/`grid`/`hex`/`particles`/`vortex`/`matrix`/`aurora` |
| `backgroundAnimation` | 7 options | `static`/`slow_drift`/`pulse`/`rotate`/`wave`/`matrix_rain`/`particle_flow` |
| `musicTheme` / `soundscape` | `string` | Audio style guide |
| `sRankColors` | optional | S / SS / SSS accent overrides |
| `cssVariables` | `Record<string,string>` | `--theme-*` CSS custom properties |

---

## Theme Registry (10 Themes)

| # | id | Name | Category | Rarity | Unlock Requirement |
|---|----|------|----------|--------|--------------------|
| 1 | `cosmic_void` | Cosmic Void | space | common | Default — always available |
| 2 | `nebula_dreams` | Nebula Dreams | space | uncommon | Level 50 OR Act 2 |
| 3 | `solar_flare` | Solar Flare | elemental | rare | Win 10 PvP OR tier 20 |
| 4 | `deep_ocean` | Deep Ocean | natural | uncommon | Colonize 5 water planets OR level 30 |
| 5 | `crystal_aurora` | Crystal Aurora | fantasy | rare | Research tier 15 OR Act 5 |
| 6 | `shadow_realm` | Shadow Realm | fantasy | epic | Tier 40 OR Act 7 |
| 7 | `emerald_forest` | Emerald Forest | natural | uncommon | Colonize 5 forest planets OR level 25 |
| 8 | `crimson_war` | Crimson War | cyberpunk | epic | Win 50 PvP OR tier 50 |
| 9 | `stellar_gold` | Stellar Gold | space | legendary | SSS-rank on any entity type |
| 10 | `quantum_singularity` | Quantum Singularity | cyberpunk | legendary | SS-rank on any entity type OR tier 60 |

> New themes added after v1 should be defined in their own source file under
> `shared/config/themes/` and registered in `themeSystemConfig.ts`. See
> [Adding a New Theme](#adding-a-new-theme).

---

## Utility Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `getThemeById` | `(themeId: ThemeId) => ThemeDefinition` | Lookup (falls back to `cosmic_void`) |
| `getThemesByCategory` | `(category) => ThemeDefinition[]` | Filter by category |
| `getThemesByRarity` | `(rarity) => ThemeDefinition[]` | Filter by rarity |
| `isThemeUnlockedBySRank` | `(themeId, sRankTier) => boolean` | S-rank unlock gate |
| `getThemeCSSVariables` | `(themeId) => Record<string,string>` | Raw CSS vars |
| `generateThemeCSS` | `(themeId) => string` | Generated CSS block |
| `getDefaultTheme` | `() => ThemeDefinition` | Always `cosmic_void` |

---

## Adding a New Theme

1. Create `shared/config/themes/<name>Theme.ts` exporting a `ThemeDefinition`
   (see `quantumSingularityTheme.ts` as the reference template).
2. Add the new id to the `ThemeId` union in `themeSystemConfig.ts`.
3. Import the definition and add it to `THEME_REGISTRY`.
4. Add the id to the `isThemeUnlockedBySRank` map for the appropriate rank tier.
5. If the primary color is a new hex, extend `mapColorToBorderClass` in
   `titleScreenConfig.ts` so the title-screen spinner renders correctly.
6. Document the theme under `docs/themes/` and link it from this index.

---

## Related Files

- `shared/config/themeSystemConfig.ts` — theme types, registry, utilities
- `shared/config/themes/quantumSingularityTheme.ts` — Quantum Singularity theme
- `shared/config/titleScreenConfig.ts` — title screen + per-theme overrides
- `shared/config/cssConfig.ts` — master CSS config keyed by `ThemeId`
- `docs/themes/QUANTUM_SINGULARITY_THEME.md` — Quantum Singularity spec
