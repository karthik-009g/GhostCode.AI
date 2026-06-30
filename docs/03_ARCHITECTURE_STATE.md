# Architecture State

Repository scan basis:
- Fresh filesystem scan of `app/`, `components/`, `constants/`, `hooks/`, `lib/`, `types/`, `stores/`, `renderer/`, `engine/`, `interaction/`, `performance/`, `world/`, `public/`, `shaders/`, and `styles/`
- Root config scan of `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, and `next-env.d.ts`
- Validation date: 2026-06-27

## Subsystem Audit

### RENDERER SYSTEM

Status:
partial

Completion:
70%

Architecture:
5/10

Performance:
7/10

Maintainability:
4/10

Compatible with:
Phase 2
Phase 3

Known problems:
- Active renderer path lives in `components/scene/Scene.tsx`
- Parallel renderer path exists in `renderer/Renderer.tsx`
- `renderer/PostProcessing.tsx` and `renderer/PerformanceMonitor.tsx` are empty
- Renderer ownership is therefore split, even though only one branch is active

Required refactors:
- Choose one renderer entry path
- Archive or implement the duplicate renderer branch
- Move renderer-specific concerns out of scene context ownership

### CAMERA SYSTEM

Status:
partial

Completion:
78%

Architecture:
6/10

Performance:
8/10

Maintainability:
6/10

Compatible with:
Phase 2
Phase 3
Partial Phase 4

Known problems:
- `components/camera/CameraController.tsx` is the real runtime owner
- `stores/camera.store.ts` models a more advanced camera state machine but is not wired into runtime behavior
- `types/camera.ts` uses `THREE.Vector3` and `THREE.Euler`, which conflicts with the repo's stated serializable-state discipline
- Camera shake, transitions, hijack, and attack modes are still placeholders

Required refactors:
- Make one camera controller/state machine authoritative
- Remove type/store drift
- Add future hijack/attack orchestration through a central owner, not inline growth

### SCENE SYSTEM

Status:
partial

Completion:
62%

Architecture:
4/10

Performance:
6/10

Maintainability:
3/10

Compatible with:
Phase 2
Partial Phase 3

Known problems:
- `components/scene/GhostWorld.tsx` is the active world owner
- `components/scene/SceneProvider.tsx` holds a second scene model via React context
- `stores/scene.store.ts` holds a third scene/state model
- `constants/scene.ts` holds a fourth topology/config layer

Required refactors:
- Collapse to one authoritative scene graph/state model
- Remove or repurpose `SceneProvider`
- Split `GhostWorld` into subsystems instead of continuing to grow it

### ARCHITECTURE GRAPH SYSTEM

Status:
partial

Completion:
55%

Architecture:
4/10

Performance:
7/10

Maintainability:
3/10

Compatible with:
Phase 2
Partial Phase 3

Known problems:
- Topology exists in `constants/scene.ts`
- Similar node definitions exist in `stores/scene.store.ts`
- Runtime node arrays also exist inside `components/scene/GhostWorld.tsx`
- Graph statuses are too coarse for future corruption and recovery

Required refactors:
- Define one graph source of truth
- Add richer node and connection state models
- Keep graph data serializable and phase-aware

### INTERACTION SYSTEM

Status:
partial

Completion:
40%

Architecture:
4/10

Performance:
7/10

Maintainability:
4/10

Compatible with:
Phase 2
Partial Phase 3

Known problems:
- Hover and selection work inside `GhostWorld`
- `stores/interaction.store.ts` exists but is not the live owner for current interactions
- `interaction/*.ts` files are all empty
- Cursor state is still partly handled through DOM side effects in node components

Required refactors:
- Decide whether interaction is component-local or store-driven
- Remove placeholder managers or implement them
- Centralize pointer/raycast/selection ownership

### ANIMATION SYSTEM

Status:
partial

Completion:
38%

Architecture:
3/10

Performance:
5/10

Maintainability:
3/10

Compatible with:
Phase 2
Partial Phase 3

Known problems:
- Six active `useFrame` loops exist today
- Animation lives across `CameraController`, `ParticleField`, `GhostWorld`, `ArchitectureNode`, `ConnectionBeam`, and `AtmosphereShell`
- `stores/animation.store.ts` models timelines and intro stages but is not runtime animation ownership
- `components/animations/*.ts` files are empty

Required refactors:
- Introduce a central `WorldAnimationController`
- Reduce per-object frame ownership
- Align store, types, and runtime animation responsibilities

### EFFECTS SYSTEM

Status:
partial

Completion:
58%

Architecture:
6/10

Performance:
7/10

Maintainability:
6/10

Compatible with:
Phase 2
Phase 3
Partial Phase 4

Known problems:
- Bloom, DOF, noise, and vignette are active
- They are performance-tier aware, but not ghost/corruption aware
- No selective bloom, glitch, distortion, or corruption pass exists

Required refactors:
- Add state-driven effect orchestration
- Connect effects to corruption and camera states
- Consolidate with renderer ownership once renderer path is unified

### PARTICLE SYSTEM

Status:
partial

Completion:
60%

Architecture:
6/10

Performance:
6/10

Maintainability:
5/10

Compatible with:
Phase 2
Phase 3
Partial Phase 4

Known problems:
- Ambient particle field is implemented and shader-based
- Packet particles are embedded in connection rendering, not in a dedicated particle ownership system
- Corruption particles and reactive event particles are missing

Required refactors:
- Separate atmosphere, packet, corruption, and event particle roles
- Reduce duplicated shader ownership between `ParticleField.tsx` and `ParticleMaterial.tsx`

### GHOST SYSTEM

Status:
missing

Completion:
18%

Architecture:
2/10

Performance:
7/10

Maintainability:
2/10

Compatible with:
Early Phase 3 only

Known problems:
- Ghosts currently exist mostly as red nodes and red beams
- No real ghost manager exists
- No infection manager exists
- No corruption lifecycle exists
- No attack orchestration exists
- Several ghost-related names exist in stores and constants, but that is not a usable architecture

Required refactors:
- Add a real ghost/corruption state model
- Separate presentation from ghost logic
- Connect ghost state to camera, materials, effects, and graph status

### ENVIRONMENT SYSTEM

Status:
partial

Completion:
56%

Architecture:
6/10

Performance:
8/10

Maintainability:
6/10

Compatible with:
Phase 2
Phase 3

Known problems:
- Background, fog, and lighting work
- Background remains flat
- Volumetric atmosphere is not implemented
- Placeholder comments indicate future phases but no system owns them yet

Required refactors:
- Upgrade atmosphere ownership
- Replace placeholder growth with a dedicated environment subsystem

### STORE LAYER

Status:
partial

Completion:
64%

Architecture:
5/10

Performance:
8/10

Maintainability:
5/10

Compatible with:
Phase 2
Partial Phase 3
Partial Phase 4

Known problems:
- App, scene, camera, interaction, and animation stores all exist
- Runtime ownership is inconsistent across them
- Some stores are forward-looking and useful
- Some are bypassed by inline component logic

Required refactors:
- Align runtime ownership with store design
- Remove duplicate scene ownership
- Remove non-serializable type drift from shared models

## Active Runtime Path
- `app/page.tsx`
- `components/scene/Scene.tsx`
- `components/scene/Experience.tsx`
- `components/scene/GhostWorld.tsx`
- `components/camera/*`
- `components/environment/*`
- `components/effects/*`
- `components/particles/*`

## Empty / Placeholder Areas
- `components/animations/*`
- `components/materials/BoundaryMaterial.ts`
- `components/materials/ConnectionMaterial.ts`
- `components/materials/CoreMaterial.ts`
- `components/materials/GhostMaterial.ts`
- `engine/*`
- `interaction/*`
- `performance/*`
- `renderer/PostProcessing.tsx`
- `renderer/PerformanceMonitor.tsx`
- `world/*`
- Empty directories: `components/architecture/`, `components/ui/`, `public/`, `shaders/`, `styles/`

## Validation Of Previous Findings

### 1. GhostWorld is a God component
TRUE

Explanation:
`components/scene/GhostWorld.tsx` owns topology data, node rendering, connection rendering, packet animation, atmosphere motion, scene lifecycle updates, hover/selection coupling, and reveal behavior.

Current severity:
critical

### 2. Scene ownership is duplicated: SCENE -> scene.store -> GhostWorld local arrays
TRUE

Explanation:
This duplication still exists, and the current scan found a fourth layer in `components/scene/SceneProvider.tsx`.

Current severity:
critical

### 3. Too many useFrame loops exist
TRUE

Explanation:
There are six active `useFrame` loops today. That is not catastrophic yet, but it proves animation ownership is already fragmented before larger content exists.

Current severity:
high

### 4. Animation ownership is fragmented
TRUE

Explanation:
Animation is split across scene leaf components and the camera controller, while the animation store and animation component directory are not the real owners.

Current severity:
high

### 5. Ghost corruption architecture is missing
TRUE

Explanation:
The codebase contains ghost naming and styling but no actual staged corruption lifecycle, infection manager, or attack controller.

Current severity:
critical

### 6. Connection rendering does not scale
TRUE

Explanation:
Connections currently allocate `TubeGeometry` per beam inside `GhostWorld` and animate packets inline. That will become expensive as beam count and corruption variants increase.

Current severity:
high

### 7. Phase 4 and Phase 5 are currently blocked
TRUE

Explanation:
The current architecture can support visual experimentation, but it cannot scale into corruption-aware effects, replay-safe orchestration, or attack-state sequencing without structural refactor first.

Current severity:
critical
