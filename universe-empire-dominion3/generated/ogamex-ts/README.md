# Generated Imported-Source TypeScript Output

This folder contains bulk-generated TypeScript output created from the vendored upstream reference source by:

- [script/ogamex_mass_rewrite.py](/d:/New%20folder/StellarDominion-2/script/ogamex_mass_rewrite.py)

## What This Folder Is For

- migration scaffolding
- symbol inventory
- dependency tracing
- rewrite batch tracking

## What This Folder Is Not

- not the primary live game runtime
- not fully hand-reviewed
- not a one-to-one claim that the imported source is production-ready TypeScript

## Current Migration Pattern

Use these files to discover structure and accelerate manual ports, then move runtime-safe logic into:

- [shared/ogamex](/d:/New%20folder/StellarDominion-2/shared/ogamex)

## Contents

- generated enum and constant ports where safe
- scaffold classes/interfaces for complex source files
- manifest files for batch tracking
- rewrite reports for migration coverage

## Working Rule

If both a generated scaffold and a curated handwritten module exist, prefer the handwritten module for actual application behavior.
