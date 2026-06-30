"use client";

import { LIGHTING } from "@/constants/lighting";

export function Lighting() {
  return (
    <>
      {/* Global ambient */}
      <ambientLight
        color={LIGHTING.ambient.color}
        intensity={LIGHTING.ambient.intensity}
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
        intensity={LIGHTING.fill.intensity}
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
        intensity={LIGHTING.ghost.intensity}
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