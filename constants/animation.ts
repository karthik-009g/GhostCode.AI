export type EasingPreset =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "ghostEase"
  | "snap";

export const ANIMATION = {
  float: {
    amplitude: 0.12,
    frequency: 0.45,
    phaseOffset: Math.PI / 3,
  },

  pulse: {
    minIntensity: 0.6,
    maxIntensity: 1.5,
    speed: 1.4,
  },

  connection: {
    pulseSpeed: 1.8,
    dashSpeed: 0.9,
    pulseWidth: 0.35,
    corruptionSpeed: 4,
  },

  ghost: {
    driftAmplitude: 0.3,
    driftFrequency: 0.2,
    pulseFrequency: 1.1,

    attackDuration: 2.5,
    attackCooldown: 5,

    corruptionSpeed: 6,
    corruptionAmplitude: 0.25,

    revealDuration: 1.5,
    vanishDuration: 0.8,
  },

  intro: {
    duration: 2.8,
    stagger: 0.18,
    nodeReveal: 0.6,
    connectionReveal: 0.4,
    ease: "easeOut" as EasingPreset,
  },

  camera: {
    orbitSpeed: 0.0008,

    idleAmplitude: 0.03,
    idleFrequency: 0.3,

    transitionDuration: 2.2,
    flythroughDuration: 4,

    shakeDuration: 0.8,
    shakeFrequency: 25,
    shakeDecay: 2,
  },

  scroll: {
    damping: 0.08,
    parallax: 0.25,
    sectionDuration: 1.5,
    velocitySmoothing: 0.15,
  },

  timing: {
    instant: 0,
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    cinematic: 1.6,
  },

  easing: {
    ghostEase: [0.16, 1, 0.3, 1] as const,
    smooth: [0.4, 0, 0.2, 1] as const,
    snap: [0.175, 0.885, 0.32, 1.275] as const,
  },
} as const;