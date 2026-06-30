export type PerformanceTier =
  | "high"
  | "medium"
  | "low";

export const PERFORMANCE = {
  dpr: {
    min: 1,
    max: 2,
  },

  fps: {
    target: 60,
    warning: 45,
    low: 30,
    critical: 20,
  },

  particles: {
    high: 900,
    medium: 500,
    low: 150,
  },

  beams: {
    high: 128,
    medium: 64,
    low: 24,
  },

  atmosphere: {
    high: true,
    medium: true,
    low: false,
  },

  ghostEffects: {
    high: true,
    medium: true,
    low: false,
  },

  postprocessing: {
    high: {
      bloom: true,
      dof: true,
      noise: true,
      vignette: true,
    },

    medium: {
      bloom: true,
      dof: false,
      noise: false,
      vignette: true,
    },

    low: {
      bloom: false,
      dof: false,
      noise: false,
      vignette: false,
    },
  },

  bloom: {
    high: 1.2,
    medium: 0.7,
    low: 0,
  },

  shadows: {
    enabled: false,
    mapSize: 512,
  },

  fog: {
    high: true,
    medium: true,
    low: false,
  },

  animation: {
    high: 1,
    medium: 0.7,
    low: 0.4,
  },

  adaptiveQuality: {
    enabled: true,

    downgradeFrames: 30,
    recoveryFrames: 120,

    cooldownFrames: 300,
  },

  frustumMargin: 1.2,

  sampleWindow: 1000,
} as const;