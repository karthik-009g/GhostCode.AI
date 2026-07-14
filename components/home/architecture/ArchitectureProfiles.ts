import type { TowerSpec } from "../shared";

export type ArchitectureArchetype =
  | "corporate-hq"
  | "financial-tower"
  | "residential-block"
  | "research-institute"
  | "industrial-stack"
  | "data-center"
  | "ghost-architecture"
  | "infrastructure-hub";

export type ArchitectureProfile = {
  podiumScale: number;
  lowerScale: number;
  midScale: number;
  crownScale: number;
  facade: "glass-grid" | "panel-stack" | "server-mesh" | "fractured";
  roof: "antenna" | "cooling" | "drone-pad" | "radome" | "utility";
  secondaryShaft: boolean;
  windowDensity: number;
};

export const ARCHITECTURE_PROFILES: Record<
  ArchitectureArchetype,
  ArchitectureProfile
> = {
  "corporate-hq": {
    podiumScale: 1.46,
    lowerScale: 1.06,
    midScale: 0.74,
    crownScale: 0.42,
    facade: "glass-grid",
    roof: "antenna",
    secondaryShaft: true,
    windowDensity: 0.88,
  },
  "financial-tower": {
    podiumScale: 1.36,
    lowerScale: 1.12,
    midScale: 0.7,
    crownScale: 0.34,
    facade: "glass-grid",
    roof: "drone-pad",
    secondaryShaft: false,
    windowDensity: 0.94,
  },
  "residential-block": {
    podiumScale: 1.54,
    lowerScale: 1.16,
    midScale: 0.9,
    crownScale: 0.66,
    facade: "panel-stack",
    roof: "drone-pad",
    secondaryShaft: true,
    windowDensity: 0.62,
  },
  "research-institute": {
    podiumScale: 1.4,
    lowerScale: 1.02,
    midScale: 0.82,
    crownScale: 0.54,
    facade: "glass-grid",
    roof: "radome",
    secondaryShaft: true,
    windowDensity: 0.76,
  },
  "industrial-stack": {
    podiumScale: 1.62,
    lowerScale: 1.2,
    midScale: 0.92,
    crownScale: 0.72,
    facade: "panel-stack",
    roof: "utility",
    secondaryShaft: true,
    windowDensity: 0.38,
  },
  "data-center": {
    podiumScale: 1.5,
    lowerScale: 1.14,
    midScale: 0.8,
    crownScale: 0.48,
    facade: "server-mesh",
    roof: "cooling",
    secondaryShaft: false,
    windowDensity: 0.46,
  },
  "ghost-architecture": {
    podiumScale: 1.2,
    lowerScale: 1.04,
    midScale: 0.72,
    crownScale: 0.38,
    facade: "fractured",
    roof: "radome",
    secondaryShaft: true,
    windowDensity: 0.3,
  },
  "infrastructure-hub": {
    podiumScale: 1.7,
    lowerScale: 1.24,
    midScale: 0.86,
    crownScale: 0.58,
    facade: "server-mesh",
    roof: "utility",
    secondaryShaft: true,
    windowDensity: 0.5,
  },
};

export function getTowerArchetype(
  spec: TowerSpec,
  index: number,
): ArchitectureArchetype {
  if (spec.flavor === "ghost") return "ghost-architecture";

  if (spec.flavor === "residential") {
    return index % 3 === 0 ? "infrastructure-hub" : "residential-block";
  }

  if (spec.flavor === "market") {
    return index % 2 === 0 ? "financial-tower" : "research-institute";
  }

  const coreArchetypes: ArchitectureArchetype[] = [
    "corporate-hq",
    "data-center",
    "industrial-stack",
  ];

  return coreArchetypes[index % coreArchetypes.length]!;
}
