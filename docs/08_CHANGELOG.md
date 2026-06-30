# Changelog

## v0.1

### Added
- Initial Next.js, React Three Fiber, and Zustand scaffold.
- Core constants, stores, hooks, and folder structure.
- Baseline environment, camera, and effect components.

### Removed
- None.

### Refactored
- None.

### Fixed
- None recorded.

## v0.2

### Added
- Scroll-driven product shell in `app/page.tsx`.
- Active 3D world composition through `components/scene/Experience.tsx`.
- Interactive architecture visualization in `components/scene/GhostWorld.tsx`.
- Cinematic camera path through `components/camera/MainCamera.tsx` and `components/camera/CameraController.tsx`.
- Working postprocessing baseline in `components/effects/*`.
- Runtime type-check validation for the active path.

### Removed
- No files removed yet.

### Refactored
- Camera default ownership corrected.
- Active render path connected from page -> scene -> experience -> world.

### Fixed
- Strict TypeScript issues blocking `npm run type-check`.
- Renderer event prop strictness issue.
- Animation store intro-stage strictness issue.

## v0.3

### Added
- Permanent project memory in `docs/`.
- Architecture audit and file registry.

### Removed
- None.

### Refactored
- Documentation now distinguishes active files from placeholders and deprecated branches.

### Fixed
- Project memory gap: current architecture and audit state are now documented.
