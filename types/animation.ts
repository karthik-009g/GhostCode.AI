export interface FloatConfig {
  amplitude: number;

  frequency: number;

  phase: number;

  axis:
    | "x"
    | "y"
    | "z"
    | "xyz";
}

export interface PulseConfig {
  minIntensity: number;

  maxIntensity: number;

  speed: number;
}

export interface GhostAnimationConfig {
  driftAmplitude: number;

  driftFrequency: number;

  pulseFrequency: number;

  attackDuration: number;
}

export interface ScrollAnimationConfig {
  inputRange: [number, number];

  outputRange: [number, number];

  clamp?: boolean;
}

export interface IntroSequenceItem {
  nodeId: string;

  delay: number;

  duration: number;
}

export interface CameraAnimationConfig {
  duration: number;

  damping: number;

  easing: string;
}

export interface TimelineKeyframe {
  time: number;

  value: number;
}

export type EasingFunction =
  (t: number) => number;