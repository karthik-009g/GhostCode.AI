"use client";

import { useMemo } from "react";
import { Bloom as BloomEffect } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

import { usePerformance } from "@/hooks/usePerformance";
import { useAnimationStore } from "@/stores/animation.store";
import { useSceneStore } from "@/stores/scene.store";

export function Bloom() {
  const {
    runtimeTier,
  } = usePerformance();

  const introProgress = useAnimationStore(
    (state) => state.introProgress,
  );

  const introStage = useAnimationStore(
    (state) => state.introStage,
  );

  const corruptionLevel = useSceneStore(
    (state) => state.corruptionLevel,
  );

  const intensity = useMemo(() => {
    const base =
      runtimeTier === "high" ? 0.92 : 0.6;
    const introBoost =
      0.12 + introProgress * 0.24;
    const corruptionBoost =
      corruptionLevel * 0.36;
    const stageBoost =
      introStage === "ghosts-activate"
        ? 0.18
        : introStage === "connections-grow"
        ? 0.08
        : 0;

    return base + introBoost + corruptionBoost + stageBoost;
  }, [corruptionLevel, introProgress, introStage, runtimeTier]);

  if (
    runtimeTier === "low"
  ) {
    return null;
  }

  return (
    <BloomEffect
      intensity={intensity}
      kernelSize={
        runtimeTier ===
        "high"
          ? KernelSize.LARGE
          : KernelSize.MEDIUM
      }
      luminanceThreshold={
        corruptionLevel > 0.4 ? 0.12 : 0.18
      }
      luminanceSmoothing={
        corruptionLevel > 0.4 ? 0.68 : 0.82
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
