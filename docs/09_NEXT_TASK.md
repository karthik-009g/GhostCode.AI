# Next Task

## Current Task
- Create permanent project memory in `docs/`.
- Audit the current GhostCode architecture without adding new runtime features.
- Identify scalability, maintainability, and phase-4/phase-5 risks.

## Next Task
- Refactor `components/scene/GhostWorld.tsx` into production-scale subsystems.
- Establish one source of truth for architecture graph data and statuses.
- Remove `SceneProvider` duplication or redefine its purpose.
- Replace many local `useFrame` owners with a centralized world animation controller.

## Future Task
- Implement real ghost corruption states and propagation rules.
- Add corruption-aware connection and particle systems.
- Introduce cinematic intro sequencing and camera hijack orchestration.
- Upgrade materials and postprocessing to match the reference more closely.

## Blocked Task
- Direct frame-level analysis of the reference video.

## Recommended Order
1. Architecture graph consolidation.
2. `GhostWorld` subsystem extraction.
3. World animation controller.
4. Ghost system state model.
5. Corruption-aware materials, beams, particles, and effects.
