"use client";

import { useMemo } from "react";

import { LIGHTING } from "@/constants/lighting";
import { useAnimationStore } from "@/stores/animation.store";
import { useSceneStore } from "@/stores/scene.store";

export function Lighting() {
  const introProgress = useAnimationStore(
    (state) => state.introProgress,
  );

  const corruptionLevel = useSceneStore(
    (state) => state.corruptionLevel,
  );

  const ambientIntensity = useMemo(
    () => LIGHTING.ambient.intensity * (0.92 + introProgress * 0.2),
    [introProgress],
  );

  const fillIntensity = useMemo(
    () => LIGHTING.fill.intensity * (1 + corruptionLevel * 0.45),
    [corruptionLevel],
  );

  const ghostIntensity = useMemo(
    () => LIGHTING.ghost.intensity * (1 + corruptionLevel * 1.1),
    [corruptionLevel],
  );

  return (
    <>
      {/* Global ambient */}
      <ambientLight
        color={LIGHTING.ambient.color}
        intensity={ambientIntensity}
      />

      {/* Atmospheric sky fill */}
      <hemisphereLight
        args={[
          "#003344",
          "#000814",
          0.15,
        ]}
      />

      {/* Primary cinematic key */}
      <directionalLight
        color={LIGHTING.key.color}
        intensity={LIGHTING.key.intensity}
        position={LIGHTING.key.position}
        castShadow={LIGHTING.key.castShadow}
      />

      {/* Cyan fill */}
      <pointLight
        color={LIGHTING.fill.color}
        intensity={fillIntensity}
        position={LIGHTING.fill.position}
        distance={20}
        decay={2}
      />

      {/* Blue rim */}
      <pointLight
        color={LIGHTING.rim.color}
        intensity={LIGHTING.rim.intensity}
        position={LIGHTING.rim.position}
        distance={18}
        decay={2}
      />

      {/* Ghost ambient */}
      <pointLight
        color={LIGHTING.ghost.color}
        intensity={ghostIntensity}
        position={LIGHTING.ghost.position}
        distance={LIGHTING.ghost.distance}
        decay={LIGHTING.ghost.decay}
      />

      {/* Global atmospheric fill */}
      <pointLight
        color="#001122"
        intensity={0.1}
        position={[0, 10, 0]}
        distance={50}
      />
    </>
  );
}