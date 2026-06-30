import type * as THREE from "three";

export type CameraMode =
  | "idle"
  | "orbit"
  | "scroll"
  | "flythrough"
  | "attack";

export interface CameraState {
  position: THREE.Vector3;

  target: THREE.Vector3;

  rotation: THREE.Euler;

  fov: number;

  mode: CameraMode;
}

export interface CameraRigProps {
  scrollProgress?: number;

  enableIdleOrbit?: boolean;
}

export interface CameraAnimationKeyframe {
  position: [number, number, number];

  target: [number, number, number];

  rotation?: [number, number, number];

  fov: number;

  duration: number;
}

export type CameraAnimationSequence =
  CameraAnimationKeyframe[];

export interface CameraTransition {
  from: number;

  to: number;

  duration: number;

  damping: number;
}