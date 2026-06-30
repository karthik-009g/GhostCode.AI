export const CAMERA = {
  fov: 45,

  near: 0.1,

  far: 500,

  position: {
    x: -1.2,
    y: 2.4,
    z: 16,
  },

  target: {
    x: 0,
    y: 0,
    z: 0,
  },

  initialRotation: {
    x: -0.08,
    y: 0.05,
    z: 0,
  },

  lerpFactor: 0.05,

  lookAtLerp: 0.03,

  parallaxStrength: 0.25,

  dollyStrength: 0.8,

  scroll: {
    minZ: 8,
    maxZ: 22,

    minY: -2,
    maxY: 4,

    minX: -2,
    maxX: 2,
  },

  orbit: {
    minPolarAngle: Math.PI / 4,

    maxPolarAngle: Math.PI / 1.8,

    minAzimuthAngle: -Math.PI / 6,

    maxAzimuthAngle: Math.PI / 6,
  },

  performance: {
    low: {
      dpr: 1,
    },

    medium: {
      dpr: 1.5,
    },

    high: {
      dpr: 2,
    },
  },
} as const;