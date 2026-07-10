import * as THREE from "three";

export type CameraEasing =
  | "linear"
  | "easeOut"
  | "easeInOut"
  | "ghostEase";

export type CameraMode =
  | "cinematic"
  | "orbit"
  | "flythrough"
  | "locked"
  | "scroll-driven"
  | "ghost";

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

export interface CameraMotionPreset {
  positionDamping: number;
  lookDamping: number;
  fovDamping: number;
  mousePositionX: number;
  mousePositionY: number;
  mouseLookX: number;
  mouseLookY: number;
  eyeLevel: number;
  baseZ: number;
  lookZ: number;
  idleOrbitX: number;
  idleOrbitY: number;
  idleOrbitSpeedX: number;
  idleOrbitSpeedY: number;
  breathAmplitude: number;
  breathSpeed: number;
  roll: number;
  shakeX: number;
  shakeY: number;
}

const CAMERA_MOTION_PRESETS: Record<CameraMode, CameraMotionPreset> = {
  cinematic: {
    positionDamping: 4.8,
    lookDamping: 5.6,
    fovDamping: 2.4,
    mousePositionX: 0.85,
    mousePositionY: 0.14,
    mouseLookX: 1.45,
    mouseLookY: 0.22,
    eyeLevel: 1.72,
    baseZ: 12.5,
    lookZ: -114,
    idleOrbitX: 0.08,
    idleOrbitY: 0.04,
    idleOrbitSpeedX: 0.3,
    idleOrbitSpeedY: 0.42,
    breathAmplitude: 0.04,
    breathSpeed: 0.72,
    roll: 0.012,
    shakeX: 0.007,
    shakeY: 0.005,
  },
  orbit: {
    positionDamping: 5.4,
    lookDamping: 5.9,
    fovDamping: 2.2,
    mousePositionX: 1.08,
    mousePositionY: 0.18,
    mouseLookX: 1.78,
    mouseLookY: 0.28,
    eyeLevel: 1.76,
    baseZ: 13.2,
    lookZ: -108,
    idleOrbitX: 0.15,
    idleOrbitY: 0.08,
    idleOrbitSpeedX: 0.26,
    idleOrbitSpeedY: 0.36,
    breathAmplitude: 0.03,
    breathSpeed: 0.64,
    roll: 0.015,
    shakeX: 0.005,
    shakeY: 0.004,
  },
  flythrough: {
    positionDamping: 4.1,
    lookDamping: 4.9,
    fovDamping: 2.0,
    mousePositionX: 0.68,
    mousePositionY: 0.1,
    mouseLookX: 1.16,
    mouseLookY: 0.18,
    eyeLevel: 1.68,
    baseZ: 11.7,
    lookZ: -122,
    idleOrbitX: 0.04,
    idleOrbitY: 0.02,
    idleOrbitSpeedX: 0.24,
    idleOrbitSpeedY: 0.31,
    breathAmplitude: 0.025,
    breathSpeed: 0.82,
    roll: 0.01,
    shakeX: 0.008,
    shakeY: 0.006,
  },
  locked: {
    positionDamping: 5.8,
    lookDamping: 6.2,
    fovDamping: 2.1,
    mousePositionX: 0.28,
    mousePositionY: 0.06,
    mouseLookX: 0.52,
    mouseLookY: 0.1,
    eyeLevel: 1.7,
    baseZ: 13.4,
    lookZ: -118,
    idleOrbitX: 0.02,
    idleOrbitY: 0.015,
    idleOrbitSpeedX: 0.2,
    idleOrbitSpeedY: 0.28,
    breathAmplitude: 0.02,
    breathSpeed: 0.58,
    roll: 0.006,
    shakeX: 0.003,
    shakeY: 0.003,
  },
  "scroll-driven": {
    positionDamping: 4.5,
    lookDamping: 5.1,
    fovDamping: 2.3,
    mousePositionX: 0.58,
    mousePositionY: 0.09,
    mouseLookX: 1.02,
    mouseLookY: 0.16,
    eyeLevel: 1.71,
    baseZ: 12.9,
    lookZ: -120,
    idleOrbitX: 0.05,
    idleOrbitY: 0.025,
    idleOrbitSpeedX: 0.28,
    idleOrbitSpeedY: 0.36,
    breathAmplitude: 0.03,
    breathSpeed: 0.68,
    roll: 0.009,
    shakeX: 0.005,
    shakeY: 0.004,
  },
  ghost: {
    positionDamping: 4.2,
    lookDamping: 4.8,
    fovDamping: 2.5,
    mousePositionX: 0.62,
    mousePositionY: 0.08,
    mouseLookX: 1.08,
    mouseLookY: 0.14,
    eyeLevel: 1.66,
    baseZ: 12.1,
    lookZ: -110,
    idleOrbitX: 0.03,
    idleOrbitY: 0.015,
    idleOrbitSpeedX: 0.34,
    idleOrbitSpeedY: 0.44,
    breathAmplitude: 0.022,
    breathSpeed: 0.76,
    roll: 0.018,
    shakeX: 0.012,
    shakeY: 0.007,
  },
};

export function getCameraMotionPreset(
  mode: CameraMode,
  activeShot = false,
): CameraMotionPreset {
  const preset = CAMERA_MOTION_PRESETS[mode] ?? CAMERA_MOTION_PRESETS.cinematic;

  if (!activeShot) {
    return preset;
  }

  return {
    ...preset,
    positionDamping: preset.positionDamping + 0.75,
    lookDamping: preset.lookDamping + 0.95,
    fovDamping: preset.fovDamping + 0.45,
    mousePositionX: preset.mousePositionX * 0.5,
    mousePositionY: preset.mousePositionY * 0.5,
    mouseLookX: preset.mouseLookX * 0.42,
    mouseLookY: preset.mouseLookY * 0.42,
    idleOrbitX: preset.idleOrbitX * 0.35,
    idleOrbitY: preset.idleOrbitY * 0.35,
    roll: preset.roll * 0.72,
    shakeX: preset.shakeX * 1.08,
    shakeY: preset.shakeY * 1.08,
  };
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