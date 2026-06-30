import * as THREE from "three";

export type CameraEasing =
  | "linear"
  | "easeOut"
  | "easeInOut"
  | "ghostEase";

export interface CameraShot {
  id: string;

  position: [number, number, number];

  target: [number, number, number];

  fov: number;

  duration: number;

  easing: CameraEasing;
}

export interface CameraShake {
  intensity: number;
  frequency: number;
  decay: number;
}

export function interpolateCamera(
  current: THREE.Vector3,
  target: THREE.Vector3,
  delta: number,
  speed = 4,
): void {
  current.lerp(
    target,
    1 - Math.exp(-speed * delta),
  );
}

export function interpolateFov(
  current: number,
  target: number,
  delta: number,
  speed = 4,
): number {
  return THREE.MathUtils.lerp(
    current,
    target,
    1 - Math.exp(-speed * delta),
  );
}

export function applyCameraShake(
  position: THREE.Vector3,
  time: number,
  shake: CameraShake,
): void {
  const strength =
    shake.intensity *
    Math.exp(-shake.decay * time);

  position.x +=
    Math.sin(time * shake.frequency) *
    strength;

  position.y +=
    Math.cos(time * shake.frequency * 1.3) *
    strength;

  position.z +=
    Math.sin(time * shake.frequency * 0.7) *
    strength;
}

export function getCameraEasing(
  t: number,
  easing: CameraEasing,
): number {
  switch (easing) {
    case "easeOut":
      return 1 - Math.pow(1 - t, 3);

    case "easeInOut":
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    case "ghostEase":
      return (
        1 -
        Math.pow(1 - t, 4)
      );

    default:
      return t;
  }
}