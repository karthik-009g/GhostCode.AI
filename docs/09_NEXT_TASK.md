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
- Added a corruption propagation model for ghost attacks and connection cascades.
- Wired intro sequencing and ghost-hijack orchestration through the cinematic director.
- Made bloom, noise, vignette, DOF, particles, lighting, and fog respond to intro and corruption state.
- Built the modular megacity composition with district wrappers, skyline layering, bridges, and street-level camera framing.
- Replaced the page's inline city helpers with composition-only scene assembly.
- Upgraded road, traffic, signage, and rooftop details into dedicated modular subsystems.

## Next Task
- Optional visual polish pass only.

## Future Task
- Add deeper postprocessing passes such as chromatic aberration and selective distortion if performance allows.
- Extend camera state machine with explicit attack, transition, and emergency modes.

## Blocked Task
- Direct frame-level analysis of the reference video.

## Recommended Order
1. Optional postprocessing refinements if budget allows.
2. Camera state machine expansion for attack and transition modes.
