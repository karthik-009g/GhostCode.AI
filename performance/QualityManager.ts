import type { QualityTier } from "@/stores/app.store";
import { COLORS } from "@/constants/colors";

export type QualityProfile =
  | "cinematic"
  | "high"
  | "medium"
  | "low"
  | "emergency"
  | "ghost";

export interface QualitySettings {
  profile: QualityProfile;

  // renderer
  dprMin: number;
  dprMax: number;
  antialias: boolean;

  // world
  particleCount: number;
  beamSegments: number;
  geometryDetail: "low" | "medium" | "high";

  // lighting
  maxLights: number;
  fogDensity: number;

  // post processing
  postProcessingEnabled: boolean;
  bloomEnabled: boolean;
  bloomIntensity: number;
  bloomColor: string;

  dofEnabled: boolean;
  chromaticEnabled: boolean;
  noiseEnabled: boolean;
  vignetteEnabled: boolean;

  // animation
  animationsEnabled: boolean;
  floatAmplitude: number;
  pulseSpeed: number;

  // ghost systems
  corruptionEnabled: boolean;
  ghostEffectsEnabled: boolean;

  // safety
  emergencyFallback: boolean;
}

const CINEMATIC: QualitySettings = {
  profile: "cinematic",

  dprMin: 1.5,
  dprMax: 2,

  antialias: true,

  particleCount: 1200,
  beamSegments: 96,
  geometryDetail: "high",

  maxLights: 8,
  fogDensity: 1,

  postProcessingEnabled: true,
  bloomEnabled: true,
  bloomIntensity: 1.35,
  bloomColor: COLORS.cyan.bloom,

  dofEnabled: true,
  chromaticEnabled: true,
  noiseEnabled: true,
  vignetteEnabled: true,

  animationsEnabled: true,
  floatAmplitude: 0.12,
  pulseSpeed: 1.4,

  corruptionEnabled: true,
  ghostEffectsEnabled: true,

  emergencyFallback: false,
};

const HIGH: QualitySettings = {
  ...CINEMATIC,

  profile: "high",

  particleCount: 900,
  beamSegments: 64,

  maxLights: 6,

  bloomIntensity: 1.1,

  floatAmplitude: 0.08,
  pulseSpeed: 1.2,
};

const MEDIUM: QualitySettings = {
  ...HIGH,

  profile: "medium",

  dprMax: 1.5,

  particleCount: 500,
  beamSegments: 48,
  geometryDetail: "medium",

  maxLights: 4,

  dofEnabled: false,
  noiseEnabled: false,

  bloomIntensity: 0.7,

  floatAmplitude: 0.05,
  pulseSpeed: 1,
};

const LOW: QualitySettings = {
  ...MEDIUM,

  profile: "low",

  dprMax: 1,

  antialias: false,

  particleCount: 150,
  beamSegments: 24,
  geometryDetail: "low",

  maxLights: 2,

  postProcessingEnabled: false,
  bloomEnabled: false,
  chromaticEnabled: false,
  vignetteEnabled: false,

  fogDensity: 0.5,

  floatAmplitude: 0.03,
  pulseSpeed: 0.8,

  corruptionEnabled: false,
};

const EMERGENCY: QualitySettings = {
  ...LOW,

  profile: "emergency",

  particleCount: 50,
  beamSegments: 12,

  animationsEnabled: false,

  emergencyFallback: true,
};

const GHOST: QualitySettings = {
  ...HIGH,

  profile: "ghost",

  bloomColor: COLORS.ghost.glow,

  bloomIntensity: 1.6,

  chromaticEnabled: true,
  noiseEnabled: true,

  corruptionEnabled: true,
  ghostEffectsEnabled: true,

  pulseSpeed: 2,
};

const QUALITY_TABLE: Record<
  QualityProfile,
  QualitySettings
> = {
  cinematic: CINEMATIC,
  high: HIGH,
  medium: MEDIUM,
  low: LOW,
  emergency: EMERGENCY,
  ghost: GHOST,
};

export function getQualitySettings(
  profile: QualityProfile | QualityTier,
): QualitySettings {
  return QUALITY_TABLE[profile];
}

export function getEmergencySettings(): QualitySettings {
  return EMERGENCY;
}

export function getGhostSettings(): QualitySettings {
  return GHOST;
}

export function interpolateQuality(
  from: QualitySettings,
  to: QualitySettings,
  t: number,
): Partial<QualitySettings> {
  return {
    dprMax:
      from.dprMax +
      (to.dprMax - from.dprMax) * t,

    particleCount: Math.round(
      from.particleCount +
        (to.particleCount -
          from.particleCount) *
          t,
    ),

    beamSegments: Math.round(
      from.beamSegments +
        (to.beamSegments -
          from.beamSegments) *
          t,
    ),

    fogDensity:
      from.fogDensity +
      (to.fogDensity -
        from.fogDensity) *
        t,

    bloomIntensity:
      from.bloomIntensity +
      (to.bloomIntensity -
        from.bloomIntensity) *
        t,

    floatAmplitude:
      from.floatAmplitude +
      (to.floatAmplitude -
        from.floatAmplitude) *
        t,

    pulseSpeed:
      from.pulseSpeed +
      (to.pulseSpeed -
        from.pulseSpeed) *
        t,
  };
}