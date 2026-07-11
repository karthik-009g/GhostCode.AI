import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Vec3 = [number, number, number];

export type CameraMode =
  | "cinematic"
  | "orbit"
  | "flythrough"
  | "locked"
  | "scroll-driven"
  | "ghost";

export type CameraEasing =
  | "linear"
  | "easeInOut"
  | "ghostEase"
  | "easeOut";

export interface CameraKeyframe {
  id: string;
  position: Vec3;
  target: Vec3;
  fov: number;
  duration: number;
  easing: CameraEasing;
  damping?: number;
}

interface CameraEffects {
  ghostHijack: boolean;
  shakeIntensity: number;
  shakeDecay: number;
}

interface CameraState {
  mode: CameraMode;

  position: Vec3;
  target: Vec3;
  fov: number;

  lerpFactor: number;

  enableIdleOrbit: boolean;
  enableMouseParallax: boolean;

  activeShot: CameraKeyframe | null;
  currentShotId: string | null;
  shotQueue: CameraKeyframe[];

  isAnimating: boolean;
  transitionProgress: number;

  cameraLocked: boolean;

  effects: CameraEffects;

  mouse: {
    x: number;
    y: number;
  };
}

interface CameraActions {
  setMode(mode: CameraMode): void;

  setPosition(position: Vec3): void;

  setTarget(target: Vec3): void;

  setFov(fov: number): void;

  setLerpFactor(factor: number): void;

  setEnableIdleOrbit(enabled: boolean): void;

  setEnableMouseParallax(enabled: boolean): void;

  queueShot(shot: CameraKeyframe): void;

  dequeueShot(): CameraKeyframe | null;

  clearShotQueue(): void;

  setActiveShot(
    shot: CameraKeyframe | null,
  ): void;

  setIsAnimating(
    animating: boolean,
  ): void;

  setTransitionProgress(
    progress: number,
  ): void;

  setCameraLocked(
    locked: boolean,
  ): void;

  setGhostHijack(
    enabled: boolean,
  ): void;

  setShake(
    intensity: number,
    decay: number,
  ): void;

  setMousePosition(
    x: number,
    y: number,
  ): void;

  reset(): void;
}

const initialState: CameraState = {
  mode: "cinematic",

  position: [0, 2, 14],

  target: [0, 0, 0],

  fov: 45,

  lerpFactor: 0.05,

  enableIdleOrbit: true,

  enableMouseParallax: true,

  activeShot: null,

  currentShotId: null,

  shotQueue: [],

  isAnimating: false,

  transitionProgress: 0,

  cameraLocked: false,

  effects: {
    ghostHijack: false,
    shakeIntensity: 0,
    shakeDecay: 0,
  },

  mouse: {
    x: 0,
    y: 0,
  },
};

export const useCameraStore =
  create<
    CameraState &
      CameraActions
  >()(
    subscribeWithSelector(
      (set, get) => ({
        ...initialState,

        setMode: (
          mode,
        ) =>
          set({
            mode,
          }),

        setPosition: (
          position,
        ) =>
          set({
            position,
          }),

        setTarget: (
          target,
        ) =>
          set({
            target,
          }),

        setFov: (
          fov,
        ) =>
          set({
            fov,
          }),

        setLerpFactor: (
          lerpFactor,
        ) =>
          set({
            lerpFactor,
          }),

        setEnableIdleOrbit: (
          enableIdleOrbit,
        ) =>
          set({
            enableIdleOrbit,
          }),

        setEnableMouseParallax: (
          enableMouseParallax,
        ) =>
          set({
            enableMouseParallax,
          }),

        queueShot: (
          shot,
        ) =>
          set(
            (s) => ({
              shotQueue: [
                ...s.shotQueue,
                shot,
              ],
            }),
          ),

        dequeueShot: () => {
          const queue =
            get().shotQueue;

          if (
            queue.length === 0
          ) {
            return null;
          }

          const shot =
            queue.at(0);

          if (
            shot ===
            undefined
          ) {
            return null;
          }

          set({
            shotQueue:
              queue.slice(
                1,
              ),
          });

          return shot;
        },

        clearShotQueue:
          () =>
            set({
              shotQueue:
                [],
              activeShot:
                null,
              currentShotId:
                null,
            }),

        setActiveShot: (
          activeShot,
        ) =>
          set({
            activeShot,
            currentShotId:
              activeShot?.id ??
              null,
          }),

        setIsAnimating: (
          isAnimating,
        ) =>
          set({
            isAnimating,
          }),

        setTransitionProgress:
          (
            transitionProgress,
          ) =>
            set({
              transitionProgress,
            }),

        setCameraLocked: (
          cameraLocked,
        ) =>
          set({
            cameraLocked,
          }),

        setGhostHijack: (
          ghostHijack,
        ) =>
          set(
            (s) => ({
              effects: {
                ...s.effects,
                ghostHijack,
              },
            }),
          ),

        setShake: (
          shakeIntensity,
          shakeDecay,
        ) =>
          set(
            (s) => ({
              effects: {
                ...s.effects,
                shakeIntensity,
                shakeDecay,
              },
            }),
          ),

        setMousePosition: (
          x,
          y,
        ) =>
          set({
            mouse: {
              x,
              y,
            },
          }),

        reset: () =>
          set(
            initialState,
          ),
      }),
    ),
  );
