export type MaterialState =
  | "idle"
  | "hover"
  | "selected"
  | "active"
  | "corrupted"
  | "ghost-controlled"
  | "recovering";

export type MaterialQuality =
  | "high"
  | "medium"
  | "low";

export interface BaseMaterialConfig {
  // visual
  color: string;
  opacity: number;

  // glow
  emissiveColor: string;
  emissiveIntensity: number;

  // postprocessing
  bloom?: number;

  // runtime
  state?: MaterialState;

  // performance
  quality?: MaterialQuality;

  // interaction
  hovered?: boolean;
  selected?: boolean;

  // animation
  pulse?: number;
  glow?: number;
  flicker?: number;

  // phase 4
  corruption?: number;
  distortion?: number;
  scanlines?: number;
  noise?: number;

  // phase 5
  attackProgress?: number;
  recoveryProgress?: number;
}

export interface GlassMaterialConfig
  extends BaseMaterialConfig {
  transmission: number;
  roughness: number;
  ior: number;
  metalness: number;

  chromaticAberration?: number;
}

export interface CoreMaterialConfig
  extends BaseMaterialConfig {
  transmission: number;
  roughness: number;
  ior: number;
  metalness: number;

  energy?: number;
}

export interface GhostMaterialConfig
  extends BaseMaterialConfig {
  transmission: number;
  roughness: number;

  corruptionSpeed?: number;
  attackStrength?: number;
}

export interface ConnectionMaterialConfig
  extends BaseMaterialConfig {
  linewidth: number;

  pulseSpeed?: number;
  dashSpeed?: number;

  corruptionTravel?: number;
}

export interface BoundaryMaterialConfig
  extends BaseMaterialConfig {
  wireframe: boolean;

  thickness?: number;

  breachProgress?: number;
}