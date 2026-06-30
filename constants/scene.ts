export const SCENE = {
  background: "#05070D",

  fog: {
    color: "#05070D",
    near: 18,
    far: 80,
  },

  nodePositions: {
    frontend: [0, 0.2, -4] as [number, number, number],

    apiGateway: [-4.5, 0, -0.2] as [number, number, number],

    auth: [4.5, 0, -0.2] as [number, number, number],

    analytics: [-4.5, 0, 4] as [number, number, number],

    database: [4.5, 0, 4] as [number, number, number],

    cicd: [0, -0.1, 8] as [number, number, number],

    core: [0, 0.4, 2] as [number, number, number],
  },

  ghostPositions: {
    ghostA: [12, 2.2, -2] as [number, number, number],

    ghostB: [12, 0, 1] as [number, number, number],

    ghostC: [12, -2.2, 4] as [number, number, number],
  },

  nodeSize: {
    module: [1.8, 0.5, 1.2] as [number, number, number],

    core: [2.8, 0.7, 1.8] as [number, number, number],

    ghost: [1.4, 0.4, 1.0] as [number, number, number],
  },

  boundary: {
    width: 16,
    height: 14,
    depth: 0.05,
  },

  particles: {
    count: 900,
    spread: 30,
    size: 0.025,
    speed: 0.1,
  },
} as const;