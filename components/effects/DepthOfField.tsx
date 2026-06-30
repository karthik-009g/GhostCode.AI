"use client";

import { DepthOfField as DOF } from "@react-three/postprocessing";

import { usePerformance } from "@/hooks/usePerformance";

export function DepthOfField() {
  const {
    runtimeTier,
  } = usePerformance();

  if (
    runtimeTier !==
    "high"
  ) {
    return null;
  }

  return (
    <DOF
      focusDistance={
        0.02
      }
      focalLength={
        0.08
      }
      bokehScale={1.8}
      height={480}
    />
  );
}
