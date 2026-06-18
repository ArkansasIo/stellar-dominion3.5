# Merge Checklist

## Pre-Merge

- [x] Branch synced to `origin/copilot/add-empire-view-system`
- [x] TypeScript validation passes (`npm run check`)
- [x] PNG pass changelog added (`docs/PNG_PASS_CHANGELOG.md`)
- [x] PR-ready title/body added (`docs/PR_READY_DESCRIPTION.md`)

## PR Setup

- [ ] Open PR from `copilot/add-empire-view-system` to target base branch
- [ ] Use title/description from `docs/PR_READY_DESCRIPTION.md`
- [ ] Attach verification note: `npm run check` clean
- [ ] Request review from relevant frontend/gameplay owners

## Post-Review

- [ ] Resolve reviewer comments
- [ ] Re-run `npm run check`
- [ ] Confirm no new `git status` changes before merge

## Optional Smoke Checks

- [ ] Load core pages: Overview, EmpireView, Fleet, Research, Facilities, Stations, Market
- [ ] Confirm asset images render and fallback to `/theme-temp.png` if unavailable
- [ ] Confirm no console errors during page navigation
