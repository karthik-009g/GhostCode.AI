import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type AnimationState =
  | "idle"
  | "playing"
  | "paused"
  | "complete";

export type AnimationEasing =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "ghostEase";

export interface AnimationTrack {
  id: string;

  targetId: string;

  property: string;

  from: number;

  to: number;

  duration: number;

  delay: number;

  easing: AnimationEasing;

  loop: boolean;

  state: AnimationState;

  progress: number;

  startTime: number | null;
}

export type IntroStage =
  | "none"
  | "particles"
  | "core-reveal"
  | "modules-assemble"
  | "connections-grow"
  | "ghosts-activate"
  | "complete";

interface AnimationStateStore {
  globalTime: number;

  globalSpeed: number;

  introStage: IntroStage;

  introProgress: number;

  tracks: Record<string, AnimationTrack>;

  animationsEnabled: boolean;

  floatEnabled: boolean;

  pulseEnabled: boolean;

  connectionPulseEnabled: boolean;

  reducedMotion: boolean;

  paused: boolean;
}

interface AnimationActions {
  setGlobalTime(time: number): void;

  setGlobalSpeed(speed: number): void;

  setIntroStage(stage: IntroStage): void;

  setIntroProgress(progress: number): void;

  registerTrack(track: AnimationTrack): void;

  updateTrack(
    id: string,
    partial: Partial<AnimationTrack>,
  ): void;

  removeTrack(id: string): void;

  setTrackState(
    id: string,
    state: AnimationState,
  ): void;

  setAnimationsEnabled(
    enabled: boolean,
  ): void;

  setFloatEnabled(
    enabled: boolean,
  ): void;

  setPulseEnabled(
    enabled: boolean,
  ): void;

  setConnectionPulseEnabled(
    enabled: boolean,
  ): void;

  setReducedMotion(
    reduced: boolean,
  ): void;

  setPaused(
    paused: boolean,
  ): void;

  advanceIntro(): void;
}

const INTRO_STAGE_ORDER: IntroStage[] = [
  "none",
  "particles",
  "core-reveal",
  "modules-assemble",
  "connections-grow",
  "ghosts-activate",
  "complete",
];

export const useAnimationStore =
  create<
    AnimationStateStore &
      AnimationActions
  >()(
    subscribeWithSelector(
      (set) => ({
        globalTime: 0,

        globalSpeed: 1,

        introStage: "none",

        introProgress: 0,

        tracks: {},

        animationsEnabled: true,

        floatEnabled: true,

        pulseEnabled: true,

        connectionPulseEnabled: true,

        reducedMotion: false,

        paused: false,

        setGlobalTime:
          (globalTime) =>
            set({
              globalTime,
            }),

        setGlobalSpeed:
          (globalSpeed) =>
            set({
              globalSpeed,
            }),

        setIntroStage:
          (introStage) =>
            set({
              introStage,
            }),

        setIntroProgress:
          (introProgress) =>
            set({
              introProgress,
            }),

        registerTrack:
          (track) =>
            set((s) => ({
              tracks: {
                ...s.tracks,
                [track.id]:
                  track,
              },
            })),

        updateTrack:
          (
            id,
            partial,
          ) =>
            set((s) => {
              const track =
                s.tracks[id];

              if (!track)
                return s;

              return {
                tracks: {
                  ...s.tracks,
                  [id]: {
                    ...track,
                    ...partial,
                  },
                },
              };
            }),

        removeTrack:
          (id) =>
            set((s) => {
              const next =
                {
                  ...s.tracks,
                };

              delete next[id];

              return {
                tracks:
                  next,
              };
            }),

        setTrackState:
          (
            id,
            state,
          ) =>
            set((s) => {
              const track =
                s.tracks[id];

              if (!track)
                return s;

              return {
                tracks: {
                  ...s.tracks,
                  [id]: {
                    ...track,
                    state,
                  },
                },
              };
            }),

        setAnimationsEnabled:
          (
            animationsEnabled,
          ) =>
            set({
              animationsEnabled,
            }),

        setFloatEnabled:
          (
            floatEnabled,
          ) =>
            set({
              floatEnabled,
            }),

        setPulseEnabled:
          (
            pulseEnabled,
          ) =>
            set({
              pulseEnabled,
            }),

        setConnectionPulseEnabled:
          (
            connectionPulseEnabled,
          ) =>
            set({
              connectionPulseEnabled,
            }),

        setReducedMotion:
          (
            reducedMotion,
          ) =>
            set({
              reducedMotion,
            }),

        setPaused:
          (paused) =>
            set({
              paused,
            }),

        advanceIntro:
          () =>
            set((s) => {
              const idx =
                INTRO_STAGE_ORDER.indexOf(
                  s.introStage,
                );
              const nextStage =
                INTRO_STAGE_ORDER[
                  Math.min(
                    idx + 1,
                    INTRO_STAGE_ORDER.length -
                      1,
                  )
                ] ??
                "complete";

              return {
                introStage:
                  nextStage,
              };
            }),
      }),
    ),
  );
