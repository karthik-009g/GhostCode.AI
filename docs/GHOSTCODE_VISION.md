# GhostCode Vision

## Core Identity

GhostCode is not a portfolio website, landing page, or isolated Three.js demo.

GhostCode is a living software city where the visitor walks through software architecture instead of browsing a conventional page.

Every visual object should map back to a software-system idea:

- towers as product and platform structures
- roads and traffic as requests, data flow, and synchronization
- districts as different layers of the stack
- corruption as system failure, breach, or hostile takeover

The city itself is the interface, and the architecture itself tells the story.

## Design Philosophy

The missing constraint in the previous implementation direction was not features, but feeling.

The target experience should feel like:

- Apple-level polish and restraint
- Igloo-style spatial storytelling
- Linear-style editorial clarity
- Cyberpunk 2077-scale urban atmosphere
- Ghost in the Shell-style technological unease

The goal is a cohesive, directed software metropolis, not a collection of extra meshes.

## Current Entry Point

The homepage currently resolves through:

`app/page.tsx`

to

`components/home/CyberpunkStreetPage.tsx`

That file currently acts as the main scene owner and remains the most important refactor boundary.

## Experience Pillars

### Camera

Camera motion should feel directed, not exploratory.

- never free-fly
- never orbit casually
- use authored framing and reveal-based composition
- favor subtle lateral shifts, micro height changes, and look-target drift
- make the user feel like a dolly moving through a real city

### Scroll

Scroll should move the user through architecture, not through a webpage.

Target district progression:

1. Arrival
2. Neon Corridor
3. Data Arteries
4. Core District
5. Ghost Breach

Each stage should transform the world continuously with no cuts or hard scene swaps.

### Hover

Hover should be local, not global.

Only nearby systems should wake up:

- signage
- window trims
- billboards
- packet flow
- street lights
- bridge lighting

The rest of the city should continue its autonomous life.

### UI

The city is the hero.

UI should remain editorial and minimal:

- logo
- manifesto
- section indicator
- lightweight guidance

Avoid dashboard-style overlays or developer HUD aesthetics.

## World-Building Targets

### Buildings

The current weakest area is procedural building language that reads as stacked boxes.

Target towers should be assembled from modular architecture rather than single primitives:

- foundation
- podium
- mechanical core
- primary and inset shafts
- facade framing
- window modules
- balconies
- mechanical floors
- HVAC and rooftop machinery
- signage and billboards
- service bridges
- antennas and beacons

Each building should have a unique silhouette while still sharing district DNA.

Suggested archetypes:

- corporate tower
- financial tower
- residential stack
- research campus
- industrial facility
- ghost tower

### Infrastructure

Infrastructure must feel engineered, not decorative.

Focus areas:

- elevated highways with supports and undersides
- maintenance walkways and ladders
- pipes, conduits, guard rails, joints, and service lighting
- believable sidewalks, barriers, road seams, drainage, and utility covers

Roads should evolve into information highways where flow represents API calls, packets, requests, responses, streaming, sync, and corruption.

### Atmosphere

The current atmosphere is only a foundation.

Needed additions:

- stronger density layering
- volumetric feeling
- light shafts
- city glow
- distant skyline haze
- drifting mist and particles

### Ghost District

The breach sequence should escalate visually through:

- corruption pulses
- broken holograms
- unstable lighting
- red interference
- flickering windows
- distorted geometry
- ghost particles

## Refactor Direction

The monolithic home page should continue moving toward a scene-graph-oriented structure:

```text
components/home/
  CyberpunkStreetPage.tsx
  camera/
    CameraRig.tsx
    ScrollRig.tsx
    CameraStates.ts
  world/
    WorldScene.tsx
    WorldRig.tsx
    WorldState.ts
  architecture/
    TowerArchetypes.tsx
    TowerFactory.ts
    TowerField.tsx
    BuildingModules.tsx
    Bridges.tsx
    Roads.tsx
    Sidewalks.tsx
  infrastructure/
    DataTraffic.tsx
    HoverPulse.tsx
    ReactiveSigns.tsx
    Holograms.tsx
    Transit.tsx
    Utilities.tsx
  atmosphere/
    Atmosphere.tsx
    Fog.tsx
    Particles.tsx
    Skyline.tsx
    Lighting.tsx
  corruption/
    GhostZone.tsx
    Corruption.tsx
    Glitches.tsx
  ui/
    Overlay.tsx
    Manifesto.tsx
    Indicators.tsx
    Navigation.tsx
```

The main constraint is behavioral preservation during refactor: modularize without regressing the current scroll, pointer, and hover experience.

## Engineering Constraints

- maintain 60 FPS on typical laptop-class hardware
- use `InstancedMesh` for repeated geometry where it matters
- reuse geometry and materials aggressively
- add LOD for distant skyline and tower systems
- avoid allocations inside `useFrame`
- keep procedural generation deterministic with seeds
- preserve existing interaction behavior while improving fidelity

## Success Criteria

The implementation is moving in the right direction when:

- the first impression is "living city," not "Three.js scene"
- each district has a distinct architectural identity
- buildings read as designed structures instead of boxes
- roads, bridges, and utilities feel engineered
- scroll feels like a continuous journey into software infrastructure
- hover responses stay local and contextual
- UI recedes while the world communicates product identity
- the codebase becomes easier to scale for future districts and interactions
