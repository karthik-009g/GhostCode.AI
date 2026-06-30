import type {
  PerformanceTier,
} from "@/constants/performance";

export function detectPerformanceTier():
  PerformanceTier {
  if (
    typeof window ===
    "undefined"
  )
    return "medium";

  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent,
    );

  const hardware =
    navigator.hardwareConcurrency ??
    4;

  const memory = (
    navigator as Navigator & {
      deviceMemory?: number;
    }
  ).deviceMemory ?? 4;

  if (
    isMobile ||
    hardware <= 2 ||
    memory <= 2
  )
    return "low";

  if (
    hardware <= 4 ||
    memory <= 4
  )
    return "medium";

  return "high";
}

export class FPSTracker {
  private samples: number[] =
    [];

  private lastTime =
    performance.now();

  private readonly maxSamples: number;

  constructor(
    maxSamples = 60,
  ) {
    this.maxSamples =
      maxSamples;
  }

  tick(): void {
    const now =
      performance.now();

    const delta =
      now - this.lastTime;

    this.lastTime = now;

    if (delta <= 0) return;

    this.samples.push(
      1000 / delta,
    );

    if (
      this.samples.length >
      this.maxSamples
    ) {
      this.samples.shift();
    }
  }

  get fps(): number {
    if (
      this.samples.length ===
      0
    )
      return 60;

    return (
      this.samples.reduce(
        (a, b) => a + b,
        0,
      ) /
      this.samples.length
    );
  }

  get tier():
    | "high"
    | "medium"
    | "low" {
    const fps =
      this.fps;

    if (fps >= 50)
      return "high";

    if (fps >= 30)
      return "medium";

    return "low";
  }

  get trend():
    | "improving"
    | "stable"
    | "degrading" {
    if (
      this.samples.length <
      10
    )
      return "stable";

    const half =
      Math.floor(
        this.samples.length /
          2,
      );

    const first =
      this.samples
        .slice(0, half)
        .reduce(
          (a, b) => a + b,
          0,
        ) / half;

    const second =
      this.samples
        .slice(half)
        .reduce(
          (a, b) => a + b,
          0,
        ) /
      (this.samples.length -
        half);

    if (
      second >
      first + 5
    )
      return "improving";

    if (
      second <
      first - 5
    )
      return "degrading";

    return "stable";
  }
}