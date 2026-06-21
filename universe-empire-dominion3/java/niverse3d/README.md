# Niverse3D

Desktop-focused LibGDX starter project for a 3D space-universe prototype inside this repo.

## What is included

- A `core` + `lwjgl3` LibGDX layout.
- A live 3D scene rendered with LibGDX primitives.
- Placeholder asset folders for planets, fleets, stations, and FX.
- A local nebula background copied from an existing generated image in this repository.

## Asset policy

This project intentionally does not import proprietary OGame 3D assets. If you own or license `.glb`, `.gltf`, `.obj`, textures, or audio files, place them under:

- `assets/models/planets`
- `assets/models/fleets`
- `assets/models/stations`
- `assets/fx`

Then update the runtime loader to use them.

## Running

From this folder:

```powershell
.\gradlew.bat lwjgl3:run
```
