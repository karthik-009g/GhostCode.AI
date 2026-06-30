# File Registry

Status key:
- ✅ validated: active and structurally credible
- 🟨 generated: present but partial, placeholder, or not yet fully integrated
- ❌ deprecated: duplicate, empty legacy branch, or misleading inactive path

## Root

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `package.json` | ✅ | 8/10 | Reasonable dependency and script baseline. |
| `package-lock.json` | ✅ | 7/10 | Standard lockfile. |
| `tsconfig.json` | ✅ | 8/10 | Strict mode intent is correct. |
| `next.config.js` | 🟨 | 6/10 | Not audited deeply in this pass. |
| `postcss.config.js` | ✅ | 7/10 | Standard. |
| `tailwind.config.ts` | ✅ | 7/10 | Acceptable baseline. |
| `next-env.d.ts` | ✅ | 7/10 | Standard. |

## app

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `app/layout.tsx` | ✅ | 8/10 | Clean minimal shell. |
| `app/page.tsx` | ✅ | 8/10 | Strong product shell and scroll narrative; content is still hardcoded. |
| `app/globals.css` | ✅ | 7/10 | Good baseline styling; typography choice is generic for final target. |

## components/animations

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `components/animations/CameraAnimation.ts` | ❌ | 0/10 | Empty file. |
| `components/animations/FloatAnimation.ts` | ❌ | 0/10 | Empty file. |
| `components/animations/PulseAnimation.ts` | ❌ | 0/10 | Empty file. |
| `components/animations/ScrollAnimation.ts` | ❌ | 0/10 | Empty file. |

## components/camera

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `components/camera/MainCamera.tsx` | ✅ | 7/10 | Corrects default camera ownership; still simple. |
| `components/camera/CameraRig.tsx` | 🟨 | 6/10 | Useful shell, but future hooks are still placeholders. |
| `components/camera/CameraController.tsx` | ✅ | 7/10 | Good cinematic direction; not yet driven by store state machine. |

## components/effects

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `components/effects/Effects.tsx` | ✅ | 7/10 | Reasonable composition shell. |
| `components/effects/Bloom.tsx` | ✅ | 7/10 | Works and respects performance tiering. |
| `components/effects/DepthOfField.tsx` | 🟨 | 6/10 | Minimal implementation; not focus-aware. |
| `components/effects/Noise.tsx` | 🟨 | 6/10 | Fine baseline, not corruption-aware. |
| `components/effects/Vignette.tsx` | 🟨 | 6/10 | Static implementation only. |

## components/environment

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `components/environment/Environment.tsx` | 🟨 | 6/10 | Active shell, but still phase-comment heavy. |
| `components/environment/Background.tsx` | 🟨 | 6/10 | Functional but very basic. |
| `components/environment/Fog.tsx` | 🟨 | 6/10 | Minimal environment support. |
| `components/environment/Lighting.tsx` | ✅ | 7/10 | Good baseline composition. |

## components/materials

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `components/materials/GlassMaterial.ts` | 🟨 | 5/10 | Exists, but active world currently bypasses it. |
| `components/materials/BoundaryMaterial.ts` | ❌ | 0/10 | Empty file. |
| `components/materials/ConnectionMaterial.ts` | ❌ | 0/10 | Empty file. |
| `components/materials/CoreMaterial.ts` | ❌ | 0/10 | Empty file. |
| `components/materials/GhostMaterial.ts` | ❌ | 0/10 | Empty file. |

## components/particles

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `components/particles/ParticleField.tsx` | ✅ | 7/10 | Useful shader-based ambient particles. |
| `components/particles/ParticleMaterial.tsx` | 🟨 | 6/10 | Good asset, but not clearly integrated into active path. |
| `components/particles/ParticleSystem.tsx` | 🟨 | 6/10 | Works, but limited role ownership. |

## components/scene

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `components/scene/Scene.tsx` | ✅ | 7/10 | Active renderer entry, but duplicates renderer concerns elsewhere. |
| `components/scene/SceneLoader.tsx` | ✅ | 7/10 | Good loading shell. |
| `components/scene/Experience.tsx` | ✅ | 7/10 | Clear composition entry. |
| `components/scene/SceneProvider.tsx` | ❌ | 2/10 | Duplicates scene state with a parallel context path. |
| `components/scene/GhostWorld.tsx` | 🟨 | 5/10 | Strong visuals, weak architecture; god component risk. |

## constants

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `constants/animation.ts` | ✅ | 7/10 | Useful baseline values. |
| `constants/camera.ts` | ✅ | 7/10 | Good defaults; runtime ownership is still split. |
| `constants/colors.ts` | ✅ | 8/10 | Strong palette language. |
| `constants/lighting.ts` | ✅ | 7/10 | Good baseline values. |
| `constants/performance.ts` | ✅ | 7/10 | Good target framing. |
| `constants/scene.ts` | 🟨 | 6/10 | Useful coordinates, but not sole source of truth. |

## engine

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `engine/AnimationManager.ts` | ❌ | 0/10 | Empty file. |
| `engine/EffectManager.ts` | ❌ | 0/10 | Empty file. |
| `engine/GhostEngine.ts` | ❌ | 0/10 | Empty file. |
| `engine/MaterialManager.ts` | ❌ | 0/10 | Empty file. |
| `engine/PerformanceManager.ts` | ❌ | 0/10 | Empty file. |
| `engine/SceneGraph.ts` | ❌ | 0/10 | Empty file. |
| `engine/WorldManager.ts` | ❌ | 0/10 | Empty file. |

## hooks

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `hooks/useDevice.ts` | ✅ | 7/10 | Useful utility hook. |
| `hooks/usePerformance.ts` | ✅ | 7/10 | Useful runtime performance monitor. |
| `hooks/useReducedMotion.ts` | ✅ | 7/10 | Acceptable accessibility utility. |
| `hooks/useScrollProgress.ts` | ✅ | 8/10 | Important active hook for narrative flow. |

## interaction

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `interaction/HoverManager.ts` | ❌ | 0/10 | Empty file. |
| `interaction/InteractionManager.ts` | ❌ | 0/10 | Empty file. |
| `interaction/ScrollManager.ts` | ❌ | 0/10 | Empty file. |
| `interaction/SelectionManager.ts` | ❌ | 0/10 | Empty file. |

## lib

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `lib/cn.ts` | ✅ | 7/10 | Standard helper. |
| `lib/easing.ts` | ✅ | 7/10 | Useful utility set. |
| `lib/lerp.ts` | ✅ | 8/10 | Important motion utility. |
| `lib/math.ts` | ✅ | 8/10 | Useful general math helpers. |
| `lib/performance.ts` | ✅ | 7/10 | Good lightweight performance utilities. |

## performance

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `performance/AdaptiveDPR.ts` | ❌ | 0/10 | Empty file. |
| `performance/DeviceManager.ts` | ❌ | 0/10 | Empty file. |
| `performance/PerformanceMonitor.ts` | ❌ | 0/10 | Empty file. |
| `performance/QualityManager.ts` | ❌ | 0/10 | Empty file. |

## renderer

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `renderer/Renderer.tsx` | 🟨 | 5/10 | Valid file, but duplicate renderer path versus `components/scene/Scene.tsx`. |
| `renderer/PostProcessing.tsx` | ❌ | 0/10 | Empty file. |
| `renderer/PerformanceMonitor.tsx` | ❌ | 0/10 | Empty file. |

## stores

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `stores/app.store.ts` | 🟨 | 6/10 | Store is structured, but not central to active runtime path. |
| `stores/animation.store.ts` | 🟨 | 6/10 | Good intent, limited active ownership. |
| `stores/camera.store.ts` | 🟨 | 6/10 | Strong future model, weak runtime integration today. |
| `stores/interaction.store.ts` | 🟨 | 6/10 | Structured, but active interaction mostly bypasses it. |
| `stores/scene.store.ts` | 🟨 | 6/10 | Useful serializable scene state, but currently duplicated by local arrays and context. |

## types

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `types/animation.ts` | ✅ | 7/10 | Useful type baseline. |
| `types/camera.ts` | 🟨 | 6/10 | Drift exists versus actual store/runtime model. |
| `types/environment.ts` | ✅ | 7/10 | Acceptable support types. |
| `types/material.ts` | ✅ | 7/10 | Acceptable support types. |
| `types/scene.ts` | 🟨 | 5/10 | Still reflects context-based scene model that is not the right long-term owner. |

## world

| File | Status | Score | Notes |
| --- | --- | ---: | --- |
| `world/Atmosphere.tsx` | ❌ | 0/10 | Empty file. |
| `world/Background.tsx` | ❌ | 0/10 | Empty file. |
| `world/Fog.tsx` | ❌ | 0/10 | Empty file. |
| `world/Lighting.tsx` | ❌ | 0/10 | Empty file. |
| `world/Particles.tsx` | ❌ | 0/10 | Empty file. |
| `world/World.tsx` | ❌ | 0/10 | Empty file. |
