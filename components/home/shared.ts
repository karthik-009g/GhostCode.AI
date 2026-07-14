import * as THREE from "three";

export const BG = "#05070b";
export const PANEL = "rgba(8, 10, 16, 0.3)";
export const PANEL_BORDER = "rgba(255, 255, 255, 0.08)";
export const WHITE = "#f6f7fb";
export const NEON = "#23f0ff";
export const NEON_SOFT = "#81f7ff";
export const GHOST = "#ff426d";
export const GHOST_SOFT = "#ff94ab";
export const WARM = "#ffbf7a";

export const DISTRICTS = [
  { label: "Arrival Street", at: 0.03 },
  { label: "Neon Corridor", at: 0.1 },
  { label: "Data Arteries", at: 0.18 },
  { label: "Core District", at: 0.26 },
  { label: "Deep Infrastructure", at: 0.34 },
  { label: "Ghost Breach", at: 0.42 },
  { label: "Memory Vault", at: 0.48 },
  { label: "Horizon Kernel", at: 0.54 },
  { label: "Repository Index", at: 0.61 },
  { label: "Dependency Graph", at: 0.68 },
  { label: "Service Network", at: 0.74 },
  { label: "Execution Layer", at: 0.8 },
  { label: "Repository Intelligence", at: 0.85 },
  { label: "Ghost Repository", at: 0.89 },
  { label: "Dead Code Archive", at: 0.92 },
  { label: "AI Analysis Core", at: 0.945 },
  { label: "Recovery Engine", at: 0.965 },
  { label: "Future Architecture", at: 0.982 },
  { label: "System Horizon", at: 0.998 },
] as const;

export type CameraKey = {
  at: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  bank: number;
};

export const CAMERA_KEYS: readonly CameraKey[] = [
  {
    at: 0,
    position: new THREE.Vector3(5.8, 28, 44),
    target: new THREE.Vector3(-2.4, 4.5, -70),
    fov: 46,
    bank: -0.025,
  },
  {
    at: 0.045,
    position: new THREE.Vector3(3.8, 19.5, 33),
    target: new THREE.Vector3(-1.2, 4.1, -54),
    fov: 44,
    bank: -0.012,
  },
  {
    at: 0.09,
    position: new THREE.Vector3(-1.4, 5.2, 22),
    target: new THREE.Vector3(-0.8, 2.7, -39),
    fov: 42,
    bank: 0.006,
  },
  {
    at: 0.15,
    position: new THREE.Vector3(-3.6, 3.35, 7),
    target: new THREE.Vector3(-0.5, 4.15, -61),
    fov: 36,
    bank: 0.016,
  },
  {
    at: 0.22,
    position: new THREE.Vector3(4.8, 6.7, -10),
    target: new THREE.Vector3(0.1, 4.8, -92),
    fov: 39,
    bank: -0.018,
  },
  {
    at: 0.29,
    position: new THREE.Vector3(-7.4, 9.8, -26),
    target: new THREE.Vector3(-0.8, 8, -122),
    fov: 34,
    bank: 0.024,
  },
  {
    at: 0.36,
    position: new THREE.Vector3(2.4, 3.4, -46),
    target: new THREE.Vector3(1.2, 3.75, -154),
    fov: 32,
    bank: -0.014,
  },
  {
    at: 0.42,
    position: new THREE.Vector3(-5.2, 6.2, -62),
    target: new THREE.Vector3(2.2, 8, -183),
    fov: 38,
    bank: 0.032,
  },
  {
    at: 0.48,
    position: new THREE.Vector3(0.8, 8, -75),
    target: new THREE.Vector3(0, 7.1, -211),
    fov: 34,
    bank: -0.008,
  },
  {
    at: 0.54,
    position: new THREE.Vector3(-1, 12, -90),
    target: new THREE.Vector3(0, 15, -250),
    fov: 44,
    bank: 0,
  },
  {
    at: 0.61,
    position: new THREE.Vector3(1.5, 11, -128),
    target: new THREE.Vector3(0, 6, -285),
    fov: 42,
    bank: -0.012,
  },
  {
    at: 0.68,
    position: new THREE.Vector3(-5, 8, -180),
    target: new THREE.Vector3(-2, 6, -350),
    fov: 35,
    bank: 0.018,
  },
  {
    at: 0.74,
    position: new THREE.Vector3(4, 9, -238),
    target: new THREE.Vector3(0, 5, -425),
    fov: 38,
    bank: -0.02,
  },
  {
    at: 0.8,
    position: new THREE.Vector3(-3, 6, -296),
    target: new THREE.Vector3(0, 5, -500),
    fov: 34,
    bank: 0.014,
  },
  {
    at: 0.85,
    position: new THREE.Vector3(2, 7, -340),
    target: new THREE.Vector3(0, 5, -550),
    fov: 36,
    bank: -0.01,
  },
  {
    at: 0.89,
    position: new THREE.Vector3(7, 7, -348),
    target: new THREE.Vector3(7, 5, -570),
    fov: 36,
    bank: -0.028,
  },
  {
    at: 0.92,
    position: new THREE.Vector3(-4, 7, -395),
    target: new THREE.Vector3(0, 6, -630),
    fov: 38,
    bank: 0.02,
  },
  {
    at: 0.945,
    position: new THREE.Vector3(0, 11, -450),
    target: new THREE.Vector3(0, 10, -690),
    fov: 34,
    bank: -0.01,
  },
  {
    at: 0.965,
    position: new THREE.Vector3(-2, 10, -500),
    target: new THREE.Vector3(0, 8, -755),
    fov: 38,
    bank: 0.01,
  },
  {
    at: 0.982,
    position: new THREE.Vector3(3, 12, -560),
    target: new THREE.Vector3(0, 10, -820),
    fov: 40,
    bank: -0.012,
  },
  {
    at: 1,
    position: new THREE.Vector3(0, 15, -640),
    target: new THREE.Vector3(0, 14, -900),
    fov: 44,
    bank: 0,
  },
];

export type HoverState = {
  x: number;
  y: number;
  energy: number;
};

export type TowerSpec = {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  crown: number;
  side: -1 | 1;
  flavor: "core" | "market" | "residential" | "ghost";
  bridge: boolean;
};

export type SignSpec = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  color: string;
  tilt: number;
};

export type GhostSpec = {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
};

export function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

export function mapRange(value: number, start: number, end: number) {
  return clamp01((value - start) / (end - start));
}

export function smoothSegment(
  value: number,
  start: number,
  end: number,
) {
  return THREE.MathUtils.smoothstep(value, start, end);
}

export function sampleCameraTrack(progress: number) {
  const first = CAMERA_KEYS[0]!;
  const last = CAMERA_KEYS[CAMERA_KEYS.length - 1]!;

  if (progress <= first.at) {
    return {
      position: first.position.clone(),
      target: first.target.clone(),
      fov: first.fov,
      bank: first.bank,
    };
  }

  for (let index = 0; index < CAMERA_KEYS.length - 1; index += 1) {
    const current = CAMERA_KEYS[index];
    const next = CAMERA_KEYS[index + 1];

    if (!current || !next) {
      continue;
    }

    if (progress <= next.at) {
      const local = mapRange(progress, current.at, next.at);
      const eased = local * local * local * (local * (local * 6 - 15) + 10);

      return {
        position: current.position.clone().lerp(next.position, eased),
        target: current.target.clone().lerp(next.target, eased),
        fov: THREE.MathUtils.lerp(current.fov, next.fov, eased),
        bank: THREE.MathUtils.lerp(current.bank, next.bank, eased),
      };
    }
  }

  return {
    position: last.position.clone(),
    target: last.target.clone(),
    fov: last.fov,
    bank: last.bank,
  };
}

export function createRng(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function range(
  rng: () => number,
  min: number,
  max: number,
) {
  return min + (max - min) * rng();
}
