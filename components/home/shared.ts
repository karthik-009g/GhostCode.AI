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
  { label: "Arrival Street", at: 0.08 },
  { label: "Neon Corridor", at: 0.3 },
  { label: "Data Arteries", at: 0.52 },
  { label: "Core District", at: 0.72 },
  { label: "Ghost Breach", at: 0.92 },
] as const;

export const CAMERA_KEYS = [
  {
    at: 0,
    position: new THREE.Vector3(0, 3.1, 26),
    target: new THREE.Vector3(0, 2.2, -30),
  },
  {
    at: 0.24,
    position: new THREE.Vector3(1.4, 3.8, 15),
    target: new THREE.Vector3(0.6, 2.8, -58),
  },
  {
    at: 0.5,
    position: new THREE.Vector3(-1.6, 6.1, 0),
    target: new THREE.Vector3(0, 4.6, -88),
  },
  {
    at: 0.76,
    position: new THREE.Vector3(4.6, 5, -20),
    target: new THREE.Vector3(6.4, 4.6, -118),
  },
  {
    at: 1,
    position: new THREE.Vector3(8.8, 3.8, -42),
    target: new THREE.Vector3(11.6, 3.6, -140),
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

export function sampleTrack(
  track: typeof CAMERA_KEYS,
  progress: number,
  key: "position" | "target",
) {
  const first = track[0]!;
  const last = track[track.length - 1]!;

  if (progress <= first.at) {
    return first[key].clone();
  }

  for (let index = 0; index < track.length - 1; index += 1) {
    const current = track[index];
    const next = track[index + 1];

    if (!current || !next) {
      continue;
    }

    if (progress <= next.at) {
      const local = mapRange(progress, current.at, next.at);
      return current[key].clone().lerp(next[key], local);
    }
  }

  return last[key].clone();
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
