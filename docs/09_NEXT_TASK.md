# Next Task

## Current Task
- Create permanent project memory in `docs/`.
- Audit the current GhostCode architecture without adding new runtime features.
- Identify scalability, maintainability, and phase-4/phase-5 risks.

## Completed
- Consolidated the architecture graph into `constants/scene.ts`.
- Rewired `stores/scene.store.ts` to consume the canonical graph data.
- Replaced `SceneProvider` local state with a store-backed bridge.
- Removed GhostWorld's duplicate graph tables in favor of the canonical source.
- Added a centralized `WorldAnimationController` for scene time ownership.
- Removed the GhostWorld root, connection, and atmosphere frame loops.

## Next Task
- Implement the ghost corruption state model and propagation rules.
- Add corruption-aware particles, materials, and connection behavior.
- Introduce cinematic intro sequencing and camera hijack orchestration.
- Upgrade postprocessing and selective bloom to match the reference more closely.

## Future Task
- Expand district-specific megacity generation and horizon layering.
- Add traffic, signage, and rooftop detail subsystems.

## Blocked Task
- Direct frame-level analysis of the reference video.

## Recommended Order
1. Ghost system state model.
2. Corruption-aware materials, beams, particles, and effects.
3. Cinematic intro sequencing and camera hijack orchestration.
4. Megacity district and skyline expansion.
