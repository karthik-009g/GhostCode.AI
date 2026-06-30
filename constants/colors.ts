export const COLORS = {
  background: "#05070D",

  cyan: {
    core: "#00FFFF",

    glow: "#00D9FF",

    bloom: "#3FE8FF",

    ambient: "#0B6B82",

    dim: "#004D5C",

    faint: "#001E26",
  },

  ghost: {
    core: "#FF4D6D",

    glow: "#FF1744",

    ambient: "#7A001B",

    fog: "#2A0009",

    rim: "#FF8095",
  },

  glass: {
    surface: "rgba(13,42,69,0.55)",

    border: "rgba(0,217,255,0.18)",

    highlight: "rgba(255,255,255,0.12)",

    shadow: "rgba(0,0,0,0.35)",
  },

  node: {
    surface: "#0D1F2D",

    border: "#1A3A4A",

    glow: "#003344",
  },

  lights: {
    key: "#FFFFFF",

    fill: "#00D9FF",

    rim: "#0050FF",

    ghost: "#FF4D6D",

    ambient: "#000814",
  },

  fog: {
    near: "#05070D",

    far: "#05070D",
  },
} as const;

export type ColorKey = keyof typeof COLORS;