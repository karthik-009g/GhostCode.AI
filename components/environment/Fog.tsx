"use client";

import { useMemo } from "react";

import { SCENE } from "@/constants/scene";
import { useAnimationStore } from "@/stores/animation.store";
import { useSceneStore } from "@/stores/scene.store";

export function Fog() {
  const introProgress = useAnimationStore(
    (state) => state.introProgress,
  );

  const corruptionLevel = useSceneStore(
    (state) => state.corruptionLevel,
  );

  const near = useMemo(
    () => SCENE.fog.near * (0.92 - introProgress * 0.08),
    [introProgress],
  );

  const far = useMemo(
    () => SCENE.fog.far + corruptionLevel * 42,
    [corruptionLevel],
  );

  return (
    <>
      <fog
        attach="fog"
        args={[
          SCENE.fog.color,
          near,
          far,
        ]}
      />

      {/* Phase 4 */}
      {/* Volumetric fog */}

      {/* Phase 5 */}
      {/* Atmospheric scattering */}
    </>
  );
}