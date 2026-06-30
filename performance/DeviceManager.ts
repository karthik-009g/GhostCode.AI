import type { QualityTier } from "@/stores/app.store";

export interface DeviceCapabilities {
  tier: QualityTier;

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  isTouchDevice: boolean;

  dpr: number;

  hardwareConcurrency: number;

  deviceMemoryGb: number;

  maxTextureSize: number;

  screenWidth: number;
  screenHeight: number;

  prefersReducedMotion: boolean;

  supportsWebGL2: boolean;

  gpuScore: number;

  performanceScore: number;
}

function getWebGLCapabilities() {
  try {
    const canvas =
      document.createElement(
        "canvas",
      );

    const gl =
      canvas.getContext(
        "webgl2",
      );

    if (!gl) {
      return {
        supported: false,
        texture: 2048,
      };
    }

    const texture =
      gl.getParameter(
        gl.MAX_TEXTURE_SIZE,
      ) as number;

    return {
      supported: true,
      texture,
    };
  } catch {
    return {
      supported: false,
      texture: 2048,
    };
  }
}

function computePerformanceScore(
  cores: number,
  memory: number,
  texture: number,
): number {
  return (
    cores * 0.4 +
    memory * 0.4 +
    texture / 4096
  );
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      tier: "high",

      isMobile: false,
      isTablet: false,
      isDesktop: true,

      isTouchDevice: false,

      dpr: 1,

      hardwareConcurrency: 8,

      deviceMemoryGb: 8,

      maxTextureSize: 4096,

      screenWidth: 1920,
      screenHeight: 1080,

      prefersReducedMotion:
        false,

      supportsWebGL2: true,

      gpuScore: 8,

      performanceScore:
        8,
    };
  }

  const ua =
    navigator.userAgent;

  const isMobile =
    /Android|iPhone|iPod/i.test(
      ua,
    );

  const isTablet =
    /iPad|Android(?!.*Mobile)/i.test(
      ua,
    );

  const caps =
    getWebGLCapabilities();

  const cores =
    navigator.hardwareConcurrency ??
    4;

  const memory =
    (
      navigator as Navigator & {
        deviceMemory?: number;
      }
    ).deviceMemory ?? 4;

  const score =
    computePerformanceScore(
      cores,
      memory,
      caps.texture,
    );

  let tier: QualityTier =
    "high";

  if (
    score < 5 ||
    !caps.supported
  ) {
    tier = "low";
  } else if (
    score < 8
  ) {
    tier =
      "medium";
  }

  return {
    tier,

    isMobile,
    isTablet,

    isDesktop:
      !isMobile &&
      !isTablet,

    isTouchDevice:
      navigator.maxTouchPoints >
      0,

    dpr: Math.min(
      window.devicePixelRatio ??
        1,
      2,
    ),

    hardwareConcurrency:
      cores,

    deviceMemoryGb:
      memory,

    maxTextureSize:
      caps.texture,

    screenWidth:
      window.innerWidth,

    screenHeight:
      window.innerHeight,

    prefersReducedMotion:
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches,

    supportsWebGL2:
      caps.supported,

    gpuScore:
      caps.texture /
      2048,

    performanceScore:
      score,
  };
}

let cache:
  | DeviceCapabilities
  | null = null;

export function getDeviceCapabilities() {
  if (!cache) {
    cache =
      detectDeviceCapabilities();
  }

  return cache;
}

export function invalidateDeviceCache() {
  cache = null;
}