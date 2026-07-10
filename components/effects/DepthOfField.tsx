"use client";

import { useMemo } from "react";
import { DepthOfField as DOF } from "@react-three/postprocessing";

import { usePerformance } from "@/hooks/usePerformance";
import { useAnimationStore } from "@/stores/animation.store";
import { useCameraStore } from "@/stores/camera.store";

export function DepthOfField() {
  const {
    runtimeTier,
  } = usePerformance();

  const introProgress = useAnimationStore(
    (state) => state.introProgress,
  );

  const cameraMode = useCameraStore(
    (state) => state.mode,
  );

  const focusDistance = useMemo(
    () =>
      cameraMode === "ghost"
        ? 0.014
        : 0.02 + introProgress * 0.004,
    [cameraMode, introProgress],
  );

  const bokehScale = useMemo(
    () => (cameraMode === "ghost" ? 2.2 : 1.8),
    [cameraMode],
  );

  if (
    runtimeTier !==
    "high"
  ) {
    return null;
  }

  return (
    <DOF
      focusDistance={focusDistance}
      focalLength={
        0.08
      }
      bokehScale={bokehScale}
      height={480}
    />
  );
}
