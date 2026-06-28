# PR Title

UI: Replace placeholder badges with configured game assets (PNG pass)

# PR Description

## Summary

This PR completes the UI image pass by replacing circular Lucide placeholder badges with configured shared asset images across core gameplay, support pages, and auth/legal hero sections.

## What Changed

- Replaced summary/hero circular icon placeholders with shared assets (`MENU_ASSETS`, `SHIP_ASSETS`, `PLANET_ASSETS`, `TECH_BRANCH_ASSETS`)
- Added image fallback behavior to `/theme-temp.png` where asset load failures could occur
- Preserved existing layout/behavior while standardizing visual style
- Fixed regressions introduced during the pass:
  - JSX nesting issue in `Market.tsx`
  - Missing import in `EmpirePlanetViewer.tsx`

## Notable Updated Areas

- Core gameplay pages: Overview, EmpireView, EmpirePlanetViewer, Research, Fleet, Facilities, Stations, Resources, Market, Artifacts, Alliance, Combat, Commander, UniverseGenerator
- Supporting pages: Settings, Auth, AccountSetup, Privacy, Terms

## Validation

- TypeScript build check passes: `npm run check` (`tsc` clean)
- Workspace diagnostics are clean for touched files
- Branch is pushed and synced to remote

## Reviewer Notes

- LF→CRLF warnings may appear on Windows due to local line-ending normalization; these are non-blocking and do not affect runtime behavior
- Full change log available in `docs/PNG_PASS_CHANGELOG.md`

---

## Key Source Files

| File | Purpose |
|------|---------|
| `docs/PNG_PASS_CHANGELOG.md` | Detailed change log |
| `client/src/pages/*.tsx` | Updated page components |
