import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type AppPhase =
  | "loading"
  | "intro"
  | "idle"
  | "exploring"
  | "ghost-attack"
  | "transitioning";

export type QualityTier =
  | "high"
  | "medium"
  | "low";

interface AppState {
  phase: AppPhase;

  qualityTier: QualityTier;

  isLoaded: boolean;

  isFirstVisit: boolean;

  introComplete: boolean;

  debugMode: boolean;

  scrollProgress: number;

  scrollVelocity: number;

  scrollDirection:
    | "up"
    | "down"
    | "idle";

  fps: number;

  frameCount: number;

  corruptionLevel: number;
}

interface AppActions {
  setPhase: (
    phase: AppPhase,
  ) => void;

  setQualityTier: (
    tier: QualityTier,
  ) => void;

  setLoaded: (
    loaded: boolean,
  ) => void;

  setIntroComplete: (
    complete: boolean,
  ) => void;

  setDebugMode: (
    debug: boolean,
  ) => void;

  setCorruptionLevel: (
    value: number,
  ) => void;

  setScrollProgress: (
    progress: number,
    velocity: number,
    direction:
      | "up"
      | "down"
      | "idle",
  ) => void;

  setFps: (
    fps: number,
  ) => void;

  incrementFrame: () => void;

  reset: () => void;
}

const initialState: AppState = {
  phase: "loading",

  qualityTier: "high",

  isLoaded: false,

  isFirstVisit: true,

  introComplete: false,

  debugMode: false,

  scrollProgress: 0,

  scrollVelocity: 0,

  scrollDirection: "idle",

  fps: 60,

  frameCount: 0,

  corruptionLevel: 0,
};

export const useAppStore =
  create<
    AppState &
      AppActions
  >()(
    subscribeWithSelector(
      (set) => ({
        ...initialState,

        setPhase: (
          phase,
        ) =>
          set({
            phase,
          }),

        setQualityTier:
          (
            qualityTier,
          ) =>
            set({
              qualityTier,
            }),

        setLoaded: (
          isLoaded,
        ) =>
          set(
            (s) => ({
              isLoaded,
              phase:
                isLoaded &&
                s.phase ===
                  "loading"
                  ? "intro"
                  : s.phase,
            }),
          ),

        setIntroComplete:
          (
            introComplete,
          ) =>
            set({
              introComplete,
              phase:
                introComplete
                  ? "idle"
                  : "intro",
            }),

        setDebugMode:
          (
            debugMode,
          ) =>
            set({
              debugMode,
            }),

        setCorruptionLevel:
          (
            corruptionLevel,
          ) =>
            set({
              corruptionLevel,
            }),

        setScrollProgress:
          (
            scrollProgress,
            scrollVelocity,
            scrollDirection,
          ) =>
            set({
              scrollProgress,
              scrollVelocity,
              scrollDirection,
            }),

        setFps: (
          fps,
        ) =>
          set({
            fps,
          }),

        incrementFrame:
          () =>
            set(
              (s) => ({
                frameCount:
                  s.frameCount +
                  1,
              }),
            ),

        reset: () =>
          set(
            initialState,
          ),
      }),
    ),
  );