"use client";

import { Bloom as BloomEffect } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

import { usePerformance } from "@/hooks/usePerformance";

export function Bloom() {
  const {
    runtimeTier,
  } = usePerformance();

  if (
    runtimeTier === "low"
  ) {
    return null;
  }

  return (
    <BloomEffect
      intensity={
        runtimeTier ===
        "high"
          ? 0.95
          : 0.62
      }
      kernelSize={
        runtimeTier ===
        "high"
          ? KernelSize.LARGE
          : KernelSize.MEDIUM
      }
      luminanceThreshold={
        0.18
      }
      luminanceSmoothing={
        0.82
      }
      resolutionScale={
        runtimeTier ===
        "high"
          ? 0.6
          : 0.4
      }
      mipmapBlur
    />
  );
}
