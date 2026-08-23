# Release Identity — Alpha 1.5.1

## Canonical release record

| Field | Value |
|---|---|
| Product | Universe Civilization: Empire at War |
| Release label | Alpha 1.5.1 |
| Build number | 2026082301 |
| Build ID | NEXUS-ALPHA-20260823.01 |
| Channel | Production |
| Release status | Current |
| Build timestamp | 2026-08-23T19:36:00-04:00 |
| Developer | Stephen |
| Developer ID | ARKANSASIO-DEV-001 |
| Publisher | ArkansasIo |
| Publisher ID | ARKANSASIO-PUBLISHER-001 |
| Realm | Nexus Alpha |

## Implementation

`shared/config/buildConfig.ts` is the authoritative release record. The package manifest and lockfile use semantic version `1.5.1`; the shared server, title-screen, and seeded system settings use display label `Alpha 1.5.1`. The game shell, loading display, player login, and footer consume the same canonical values.

The deployed footer now presents Version, Build No., Build ID, Dev ID, Channel, Patch, Status, and Built time alongside the developer and publisher. It was visually verified on the live Stargate Command page after the production build; all eight status modules remain legible in the Industrial Blue footer.
