import type { QualityTier } from "@/stores/app.store";
import { PERFORMANCE } from "@/constants/performance";

export interface PerformanceSample {
  fps: number;
  frameTime: number;
  timestamp: number;
}

export interface PerformanceReport {
  averageFps: number;
  minFps: number;
  maxFps: number;

  tier: QualityTier;

  isStable: boolean;

  sampleCount: number;

  frameVariance: number;
}

export class PerformanceMonitorService {
  private samples: PerformanceSample[] =
    [];

  private maxSamples: number;

  private lastFrame =
    performance.now();

  private currentTier: QualityTier =
    "high";

  private degradeCounter = 0;

  private recoverCounter = 0;

  constructor(
    maxSamples = 120,
  ) {
    this.maxSamples =
      maxSamples;
  }

  tick(): PerformanceSample {
    const now =
      performance.now();

    const frameTime =
      now -
      this.lastFrame;

    this.lastFrame =
      now;

    const sample = {
      fps:
        frameTime > 0
          ? 1000 /
            frameTime
          : 60,

      frameTime,

      timestamp: now,
    };

    this.samples.push(
      sample,
    );

    if (
      this.samples.length >
      this.maxSamples
    ) {
      this.samples.shift();
    }

    return sample;
  }

  private calculateTier(
    fps: number,
  ): QualityTier {
    if (
      fps >=
      PERFORMANCE.fps
        .target *
        0.9
    ) {
      this.recoverCounter++;
      this.degradeCounter =
        0;

      if (
        this.recoverCounter >
        30
      ) {
        return "high";
      }
    }

    if (
      fps <
      PERFORMANCE.fps.low
    ) {
      this.degradeCounter++;
      this.recoverCounter =
        0;

      if (
        this.degradeCounter >
        15
      ) {
        return "low";
      }
    }

    return "medium";
  }

  getReport(): PerformanceReport {
    if (
      this.samples
        .length === 0
    ) {
      return {
        averageFps: 60,
        minFps: 60,
        maxFps: 60,

        tier:
          this.currentTier,

        isStable: true,

        sampleCount: 0,

        frameVariance: 0,
      };
    }

    const fps =
      this.samples.map(
        (s) => s.fps,
      );

    const avg =
      fps.reduce(
        (a, b) =>
          a + b,
        0,
      ) / fps.length;

    const min =
      Math.min(...fps);

    const max =
      Math.max(...fps);

    const variance =
      max - min;

    this.currentTier =
      this.calculateTier(
        avg,
      );

    return {
      averageFps:
        Math.round(
          avg,
        ),

      minFps:
        Math.round(
          min,
        ),

      maxFps:
        Math.round(
          max,
        ),

      tier:
        this.currentTier,

      isStable:
        variance /
          avg <
        0.2,

      sampleCount:
        this.samples
          .length,

      frameVariance:
        variance,
    };
  }

  get currentFps() {
    const last =
      this.samples.slice(
        -10,
      );

    if (
      last.length === 0
    ) {
      return 60;
    }

    return (
      last.reduce(
        (
          a,
          b,
        ) =>
          a +
          b.fps,
        0,
      ) /
      last.length
    );
  }

  reset(): void {
    this.samples =
      [];

    this.lastFrame =
      performance.now();

    this.degradeCounter = 0;

    this.recoverCounter = 0;
  }
}