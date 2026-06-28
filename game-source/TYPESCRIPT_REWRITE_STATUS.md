# Imported Source TypeScript Rewrite Status

This folder is vendored upstream reference source. It is not the live TypeScript game application.

## Scope Reality

- total files in `ogamex-source`: about `3005`
- PHP files under `ogamex-source/app`: about `288`
- upstream stack: Laravel, PHP, Blade, Composer, plus helper libraries

Rewriting the whole imported source tree into application-ready TypeScript is a platform migration, not a single conversion step.

## Current Rewrite Track

The current project uses a staged migration model:

1. vendored reference stays in `ogamex-source`
2. bulk scaffolds are generated into `generated/ogamex-ts`
3. runtime-safe TypeScript ports are curated in `shared/ogamex`

## Current Curated TypeScript Bridge

The first stable bridge modules live in [shared/ogamex](/d:/New%20folder/StellarDominion-2/shared/ogamex), including:

- universe constants
- enum ports
- coordinate distance logic
- character class service helpers
- shared exports for incremental adoption

## Current Practical Outcome

- imported domain logic can be reused without copying PHP logic ad hoc into the live app
- migration scaffolds exist for deeper batches
- imported assets and reference models can support the current game without pretending the full upstream app is already converted

## Bulk Script

The migration helper script lives at:

- [script/ogamex_mass_rewrite.py](/d:/New%20folder/StellarDominion-2/script/ogamex_mass_rewrite.py)

Example usage:

```bash
python script/ogamex_mass_rewrite.py --write
python script/ogamex_mass_rewrite.py --write --only Enums GameConstants
python script/ogamex_mass_rewrite.py --write --dest generated/ogamex-ts
```

## Recommended Rewrite Order

1. constants, enums, coordinates, and low-risk math
2. shared domain services
3. catalogs for buildings, research, ships, and defenses
4. queues and progression rules
5. fleet mission and combat services
6. player, alliance, and message services
7. UI replacement through the live React app

## Important Rule

Treat this folder as reference material and provenance. Treat `shared/ogamex` as the place where imported logic becomes part of the live game.
