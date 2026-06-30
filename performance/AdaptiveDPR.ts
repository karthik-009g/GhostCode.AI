import { getQualitySettings } from "./QualityManager";
import type { QualityProfile } from "./QualityManager";
import type { QualityTier } from "@/stores/app.store";

export interface DPRRange {
  min: number;
  max: number;
}

export interface DPRControllerState {
  current: number;
  target: number;
  range: DPRRange;
}

export function getDPRRange(
  profile: QualityProfile | QualityTier,
): DPRRange {
  const quality = getQualitySettings(profile);

  return {
    min: quality.dprMin,
    max: quality.dprMax,
  };
}

export function getDPRTuple(
  profile: QualityProfile | QualityTier,
): [number, number] {
  const { min, max } =
    getDPRRange(profile);

  return [min, max];
}

export function clampDPR(
  dpr: number,
  profile: QualityProfile | QualityTier,
): number {
  const range =
    getDPRRange(profile);

  return Math.min(
    range.max,
    Math.max(range.min, dpr),
  );
}

export function getRecommendedDPR(
  profile: QualityProfile | QualityTier,
): number {
  if (typeof window === "undefined") {
    return 1;
  }

  return clampDPR(
    window.devicePixelRatio ?? 1,
    profile,
  );
}

export class AdaptiveDPRController {
  private current: number;
  private target: number;

  constructor(
    initial = 1,
  ) {
    this.current = initial;
    this.target = initial;
  }

  setTarget(
    dpr: number,
    profile: QualityProfile | QualityTier,
  ): void {
    this.target =
      clampDPR(
        dpr,
        profile,
      );
  }

  update(
    delta: number,
  ): number {
    this.current +=
      (this.target -
        this.current) *
      Math.min(
        delta * 4,
        1,
      );

    return this.current;
  }

  get value(): number {
    return this.current;
  }

  reset(
    value = 1,
  ): void {
    this.current = value;
    this.target = value;
  }
}