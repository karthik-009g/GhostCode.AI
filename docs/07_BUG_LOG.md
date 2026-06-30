# Bug Log

## High Severity

| File | Issue | Severity | Future Fix |
| --- | --- | --- | --- |
| `components/scene/GhostWorld.tsx` | God component owns topology, animation, interaction, reveal timing, atmosphere, and packet logic. | High | Split into graph, connection, ghost, atmosphere, and animation systems. |
| `components/scene/SceneProvider.tsx` | Duplicates scene state with a parallel context model. | High | Remove or repurpose after consolidating scene ownership. |
| `stores/scene.store.ts` + `constants/scene.ts` + `components/scene/GhostWorld.tsx` | Topology is duplicated in three places. | High | Create one authoritative architecture graph source. |
| `components/scene/GhostWorld.tsx` | Multiple nested `useFrame` loops will scale poorly with more nodes and effects. | High | Move animation ownership to `WorldAnimationController`. |
| `components/scene/GhostWorld.tsx` | `TubeGeometry` per connection is expensive and not yet corruption-ready. | High | Introduce pooled/shared beam ownership or instanced/shader-based beam system. |
| `engine/*` | Empty engine files imply systems that do not exist. | High | Implement or archive/remove. |
| `interaction/*` | Empty interaction manager files while interaction logic lives inline. | High | Consolidate into real interaction ownership or remove placeholders. |
| `world/*` | Empty world files duplicate active scene responsibility. | High | Implement or deprecate. |

## Medium Severity

| File | Issue | Severity | Future Fix |
| --- | --- | --- | --- |
| `components/camera/CameraController.tsx` | Camera store is not the runtime owner, limiting future hijack and replay orchestration. | Medium | Route camera behavior through a controller/state-machine layer. |
| `stores/camera.store.ts` | Strong future model exists but is mostly disconnected from live camera behavior. | Medium | Integrate or simplify. |
| `stores/interaction.store.ts` | Store exists but active runtime mostly bypasses it. | Medium | Decide whether interaction should be store-driven or component-local. |
| `components/particles/ParticleSystem.tsx` | Only ambient particle role exists. | Medium | Separate ambient, packet, corruption, and event particles. |
| `components/effects/*` | Effects exist but are static and not corruption-aware. | Medium | Introduce phase/corruption-driven effect orchestration. |
| `components/environment/Background.tsx` | Background is flat and not yet aligned to premium target. | Medium | Replace with richer atmospheric treatment. |
| `app/page.tsx` | Narrative content is hardcoded and not linked to a sequencer/state model. | Medium | Move section metadata into structured scene/story config. |

## Low Severity

| File | Issue | Severity | Future Fix |
| --- | --- | --- | --- |
| `app/globals.css` | Typography stack is generic relative to final art direction. | Low | Upgrade type direction once visual reference is inspected. |
| `components/scene/Scene.tsx` | Renderer concerns overlap with `renderer/Renderer.tsx`. | Low | Consolidate entry ownership. |
| `components/materials/GlassMaterial.ts` | Existing material abstraction is not yet used by active world nodes. | Low | Either integrate or archive. |

## Blocked Items

| Item | Block |
| --- | --- |
| Reference video breakdown | Direct local video inspection unavailable in this session. |
| Visual parity scoring | Cannot be finalized until the reference video is inspected frame by frame. |
