export const LIGHTING = {
  ambient: {
    color: "#000814",
    intensity: 0.45,
  },

  key: {
    color: "#FFFFFF",
    intensity: 1.6,
    position: [-8, 10, 8] as [number, number, number],
    castShadow: false,
  },

  fill: {
    color: "#00D9FF",
    intensity: 0.75,
    position: [0, 3, 8] as [number, number, number],
  },

  rim: {
    color: "#0050FF",
    intensity: 0.55,
    position: [10, 4, -8] as [number, number, number],
  },

  core: {
    color: "#00FFFF",
    intensity: 1.8,
    position: [0, 2, 2] as [number, number, number],
    distance: 20,
    decay: 2,
  },

  ghost: {
    color: "#FF4D6D",
    intensity: 0.7,
    position: [9, 0, 2] as [number, number, number],
    distance: 16,
    decay: 2,
  },

  atmosphere: {
    intensity: 0.12,
  },
} as const;