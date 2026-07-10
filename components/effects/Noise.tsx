"use client";

import { useMemo } from "react";
import {
  Noise as NoiseEffect,
} from "@react-three/postprocessing";

import {
  BlendFunction,
} from "postprocessing";

import {
  usePerformance,
} from "@/hooks/usePerformance";
import { useAnimationStore } from "@/stores/animation.store";
import { useSceneStore } from "@/stores/scene.store";

export function Noise() {
  const {
    runtimeTier,
  } = usePerformance();

  const introProgress = useAnimationStore(
    (state) => state.introProgress,
  );

  const corruptionLevel = useSceneStore(
    (state) => state.corruptionLevel,
  );

  const opacity = useMemo(() => {
    const base = runtimeTier === "high" ? 0.022 : 0.03;
    const introFactor = 0.012 * introProgress;
    const corruptionFactor = corruptionLevel * 0.03;
    return base + introFactor + corruptionFactor;
  }, [corruptionLevel, introProgress, runtimeTier]);

  if (
    runtimeTier === "low"
  )
    return null;

  return (
    <>
      <NoiseEffect
        premultiply
        opacity={opacity}
        blendFunction={
          BlendFunction.OVERLAY
        }
      />

      {/* Phase 4 */}
      {/* Ghost corruption noise */}
    </>
  );
}