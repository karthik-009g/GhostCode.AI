# GhostCode Project Context

## Vision
GhostCode is a cinematic, interactive, story-driven software architecture visualization experience. It is not a portfolio site, a dashboard, or a standard Three.js demo. The product goal is an award-grade WebGL experience where software infrastructure behaves like a living world under attack.

## Final User Feeling
"I am flying through a living software architecture inside a futuristic operating system while rogue software entities slowly corrupt it."

## Visual Style
- Dark, premium, cinematic, minimal.
- Glass structures with emissive cyan and blue lighting.
- Ghost systems expressed with unstable red light, distortion, and threat-oriented motion.
- Atmosphere should feel closer to Unreal cinematics and Apple reveal pacing than to a developer tool UI.

## Interaction Philosophy
- Scroll is the main narrative transport, not a passive page mechanic.
- Hover and selection should shift emphasis without breaking cinematic control.
- The user should feel guided through a sequence, not dropped into a sandbox.
- UI overlays should support the world, not compete with it.

## Camera Philosophy
- Camera behavior should feel like a drone or sequencer camera.
- Scroll maps to dolly, framing, reveal timing, and tension.
- Idle motion should preserve life in the world when the user is not interacting.
- Future architecture must support camera hijack, inspect focus, ghost attack shake, and recovery transitions.

## Ghost Corruption Philosophy
- Ghost entities are not just red nodes.
- Corruption is a staged system with escalating states, visual consequences, and narrative timing.
- Future corruption states should include: `healthy`, `warning`, `infected`, `corrupting`, `corrupted`, `destroyed`, `recovering`.
- Ghost attacks must affect camera, materials, connection behavior, particles, and postprocessing.

## Architecture Philosophy
- One source of truth for topology, status, reveal ownership, and corruption state.
- Scene systems should be decomposed into graph, connection, ghost, particle, atmosphere, and animation controllers.
- No god components.
- No duplicate state layers for the same domain.

## Performance Philosophy
- Desktop target: 60 FPS.
- Laptop target: 45 FPS+.
- Mobile target: 30 FPS+.
- Prefer batched ownership and centralized animation control over many per-object `useFrame` loops.
- Geometry, shader, and postprocessing choices must remain phase-4 and phase-5 compatible.

## Engineering Standards
- Production-grade only.
- Strict TypeScript only.
- Serializable Zustand state only.
- No mutable Three.js objects in stores.
- Architecture must remain compatible with future shader systems, ghost corruption systems, replay, and cinematic sequencing.

## Coding Standards
- Prefer single ownership for runtime systems.
- Treat placeholders and legacy branches explicitly; do not leave them ambiguous.
- Avoid parallel implementations of the same responsibility.
- Keep scene orchestration separate from visual leaf components.

## Current Product Direction
The current strongest direction is:

`app/page.tsx`
-> fixed canvas
-> story sections
-> scroll-driven world reveal
-> interactive architecture world

This direction should be preserved while the internal architecture is refactored for scale.
