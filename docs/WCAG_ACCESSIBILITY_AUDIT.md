# WCAG Accessibility and Contrast Audit

## Scope

The review covers the 111 client page components, 77 reusable client components, 8 shared style files, the eight compact Stargate hubs, and every application dialog implementation. Automated checks use the rendered client with axe-core WCAG 2.0/2.1 A and AA rules, supplemented by source inspection and visual verification.

## Baseline rendered result

The initial rendered Market audit identified two actionable global defects.

| Rule | Severity | Finding | Scope |
|---|---:|---|---|
| `button-name` | Critical | Nine icon-only controls did not expose a discernible accessible name. | Shared game sidebar and mobile controls. |
| `meta-viewport` | Critical | The document prevented browser scaling. | Global `client/index.html`. |
| `color-contrast` | Needs manual verification | 150 nodes were flagged as indeterminate because the active palette uses translucent and image-backed surfaces. | Requires token analysis and visual review of hub/page backgrounds. |

The audit also recorded an incomplete ARIA-value check that will be validated against the rendered controls during the expanded review.

## Shared remediation applied

The client viewport no longer disables browser zoom. Sidebar disclosure controls now have programmatic names, expanded state, and controlled-region references. The active-realm selector and the Market auction filters now have explicit accessible names. A global focus-visible indicator, reduced-motion override, and forced-colors focus fallback were added to the shared theme.

## Baseline revalidation

After remediation, the rendered Market page returned **zero axe WCAG A/AA violations**. The closed `Create Auction` trigger remains an axe *incomplete* ARIA-control reference only because the portal target does not exist until the dialog opens; the same trigger was previously verified with its open dialog. Color-contrast checks remain marked incomplete by axe for transparent and image-backed game surfaces, and are covered by the deterministic Industrial Blue token analysis.

## Audit coverage

The static review scanned **283 client files**: 272 TypeScript/TSX source files and 11 CSS files. This covers the full `client/src` page, component, context, hook, utility, and shared-style folders. The rendered review exercised the authenticated Market and Strategic Command surfaces before and after remediation, alongside prior visual checks of all eight compact Stargate hubs and the Patch Notes and Create Auction modal overlays.

| Area | Method | Result |
|---|---|---|
| Full client source tree | Deterministic static scan | 283 files scanned; 16 click-handler candidates recorded for review. |
| Industrial Blue token pairs | Deterministic luminance calculation | 12 of 12 specified opaque foreground/background pairs pass their applicable AA threshold. |
| Market page | Rendered axe WCAG 2.0/2.1 A and AA run | Zero violations after remediation. |
| Strategic Command hub | Rendered axe WCAG 2.0/2.1 A and AA run | Zero violations after remediation. |
| Shared dialogs | Source inspection and previous visual checks | Radix Dialog supplies modal semantics, focus management, and a keyboard-close control; Industrial Blue dialog styles retain contrast. |
| Focus and motion | Shared CSS source inspection | Global 3px focus-visible ring, reduced-motion rule, and forced-colors fallback added. |

## WCAG interpretation

The audit evaluates normal-size text against the WCAG AA **4.5:1** minimum and essential non-text/focus indicators against the **3:1** threshold. The project also restores user zoom, which supports the resize-text requirement, and provides a visible keyboard focus indication. [1] [2] [3]

> The assessment is an engineering audit, not a legal certification. Color checks for translucent, image-backed, or dynamically composited surfaces require visual review because automated scanners cannot determine the final painted background reliably.

## Industrial Blue contrast results

| Token use | Contrast ratio | Minimum | Status |
|---|---:|---:|---|
| Primary text on deep panel | 15.59:1 | 4.5:1 | Pass |
| Secondary text on deep panel | 11.99:1 | 4.5:1 | Pass |
| Muted status text on deep panel | 9.76:1 | 4.5:1 | Pass |
| Bright cyan interface text on deep panel | 10.15:1 | 4.5:1 | Pass |
| Signal cyan on deep panel | 11.56:1 | 4.5:1 | Pass |
| Teal feature accent on deep panel | 9.19:1 | 4.5:1 | Pass |
| Indigo logic accent on deep panel | 6.75:1 | 4.5:1 | Pass |
| Navigation primary / secondary text | 16.65:1 / 13.19:1 | 4.5:1 | Pass |
| Focus ring on command surface | 13.27:1 | 3:1 | Pass |
| White text on cyan action button | 4.67:1 | 4.5:1 | Pass |
| Primary text on hover background | 6.09:1 | 4.5:1 | Pass |

The calculation output is retained in `docs/WCAG_INDUSTRIAL_BLUE_CONTRAST.json`.

## Accessibility fixes delivered

The following global and page-level improvements were applied without changing game logic or server-authoritative workflows.

| Finding | Resolution |
|---|---|
| Browser zoom was disabled | Removed `maximum-scale=1` from the viewport meta tag. |
| Sidebar expand/collapse buttons had no programmatic names | Added dynamic `aria-label`, `aria-expanded`, and `aria-controls` attributes. |
| Active realm, auction filter, and sort comboboxes were unnamed | Added explicit accessible labels. |
| Command progress bars were unnamed | Added labels for attack-turn and vault-capacity utilization. |
| DefCon selector and raid-turn input were unnamed | Added descriptive accessible labels. |
| Hazard disclosure required pointer interaction | Added button role, keyboard activation, label, and expanded state. |
| Focus treatment was inconsistent | Added a shared high-contrast `:focus-visible` ring for controls, forms, tabs, and links. |
| Motion could not be suppressed centrally | Added a `prefers-reduced-motion` rule across shared client styles. |
| High-contrast system mode lacked a dedicated focus fallback | Added a forced-colors focus outline. |

## Remaining review candidates

The static scanner retains 16 **review candidates**, rather than confirmed violations. Most are event-propagation wrappers or page-specific interactions. These files should receive a dedicated interaction test whenever they are materially redesigned: `BattleLogs.tsx`, `DatabaseAdmin.tsx`, `DimensionalHub.tsx`, `FittingEnhanced.tsx`, `Government.tsx`, `Hazards.tsx`, `Market.tsx`, `Messages.tsx`, `ServerConsole.tsx`, `Skills.tsx`, `UniverseGenerator.tsx`, `GameLayout.tsx`, and `input-group.tsx`. The verified Hazard disclosure was remediated in this pass. The full machine-readable candidate list remains in `docs/WCAG_SOURCE_AUDIT.json`.

## Verification results

`npm run check` passed after all audit fixes. The post-remediation axe runs on the Market page and Strategic Command hub each returned **zero WCAG A/AA violations**. Axe reported color-contrast tests as indeterminate on some themed elements because their final background is transparent, gradient-based, or image-backed; the Industrial Blue token ratios above and the previous visual hub/modal review resolve the palette-level question, while future page-specific visual changes should be rechecked.

## References

[1]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum "W3C: Understanding Success Criterion 1.4.3, Contrast (Minimum)"
[2]: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html "W3C: Understanding Success Criterion 1.4.11, Non-text Contrast"
[3]: https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html "W3C: Understanding Success Criterion 1.4.4, Resize Text"
[4]: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html "W3C: Understanding Success Criterion 2.4.13, Focus Appearance"
