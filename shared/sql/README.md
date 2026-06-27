# SQL Notes

This folder contains database-oriented notes and SQL support files for the current `Universe Empire Dominions` project.

## Purpose

Use this directory for:

- schema notes
- seed/reference SQL
- migration support material
- database-specific documentation that complements the TypeScript server and Drizzle setup

## Current Reality

The live application data flow is centered around the TypeScript server and storage layer, not raw SQL-only execution.

Primary runtime references:

- [server](/d:/New%20folder/StellarDominion-2/server)
- [shared/schema.ts](/d:/New%20folder/StellarDominion-2/shared/schema.ts)
- [drizzle.config.ts](/d:/New%20folder/StellarDominion-2/drizzle.config.ts)

## Recommended Usage

- keep SQL docs aligned with the live schema and seed strategy
- treat this folder as database support material, not the only source of truth
- update corresponding TypeScript schema/storage docs when SQL notes change
