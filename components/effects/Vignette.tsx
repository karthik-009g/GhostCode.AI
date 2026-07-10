"use client";

import { useMemo } from "react";
import {
  Vignette as VignetteEffect,
} from "@react-three/postprocessing";

import {
  BlendFunction,
} from "postprocessing";

import { useAnimationStore } from "@/stores/animation.store";
import { useSceneStore } from "@/stores/scene.store";

export function Vignette() {
  const introProgress = useAnimationStore(
    (state) => state.introProgress,
  );

  const corruptionLevel = useSceneStore(
    (state) => state.corruptionLevel,
  );

  const offset = useMemo(
    () => 0.16 + introProgress * 0.04,
    [introProgress],
  );

  const darkness = useMemo(
    () => 0.38 + corruptionLevel * 0.14,
    [corruptionLevel],
  );

  return (
    <>
      <VignetteEffect
        offset={offset}
        darkness={darkness}
        blendFunction={
          BlendFunction.NORMAL
        }
      />

      {/* Phase 4 */}
      {/* Dynamic cinematic vignette */}
    </>
  );
}