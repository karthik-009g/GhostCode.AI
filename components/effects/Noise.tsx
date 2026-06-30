"use client";

import {
  Noise as NoiseEffect,
} from "@react-three/postprocessing";

import {
  BlendFunction,
} from "postprocessing";

import {
  usePerformance,
} from "@/hooks/usePerformance";

export function Noise() {
  const {
    runtimeTier,
  } = usePerformance();

  if (
    runtimeTier === "low"
  )
    return null;

  return (
    <>
      <NoiseEffect
        premultiply
        opacity={0.025}
        blendFunction={
          BlendFunction.OVERLAY
        }
      />

      {/* Phase 4 */}
      {/* Ghost corruption noise */}
    </>
  );
}