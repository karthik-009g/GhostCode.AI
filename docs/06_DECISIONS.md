# Architectural Decisions

## Existing Good Decisions

### Decision
Use a scroll-driven narrative shell with a fixed canvas and moving story sections.

### Reason
This matches GhostCode's cinematic goal better than route-based screens or discrete component demos.

---

### Decision
Keep scene state serializable in stores.

### Reason
This preserves compatibility with debugging, replay, synchronization, and future multiplayer-style orchestration.

---

### Decision
Use a cinematic camera path instead of free-form controls.

### Reason
GhostCode is a directed experience. Future ghost attack and hijack sequences require authored camera control.

---

### Decision
Use shader-based particles rather than purely decorative DOM effects.

### Reason
Particles represent traffic, activity, and atmosphere, not ornament.

## Required Decisions To Preserve Going Forward

### Decision
Never store `THREE.Vector3`, `THREE.Euler`, geometry, or materials in Zustand.

### Reason
These are mutable runtime objects and will break serialization discipline.

---

### Decision
Maintain a single source of truth for architecture graph data.

### Reason
The current duplication across constants, stores, and `GhostWorld` will not survive corruption phases or attack sequencing.

---

### Decision
Move runtime animation ownership into dedicated controllers.

### Reason
The current many-`useFrame` structure is acceptable for a prototype but not for a production cinematic world.

---

### Decision
Treat empty generated files as explicit placeholders or remove them.

### Reason
Ambiguous inactive files reduce maintainability and mislead future implementation passes.

---

### Decision
Separate healthy system visuals from ghost corruption logic.

### Reason
Corruption will eventually need state transitions, timing, recovery, and effect propagation across subsystems.

## Pending Decisions
- Whether to keep `SceneProvider` at all.
- Whether `renderer/Renderer.tsx` remains a supported entry path or is deprecated.
- Whether `components/materials/*` becomes the actual material ownership layer or stays unused.
- Whether the architecture graph should live in `stores/scene.store.ts` or a dedicated graph module consumed by the store.
