"use client";

import { SCENE } from "@/constants/scene";

export function Fog() {
  return (
    <>
      <fog
        attach="fog"
        args={[
          SCENE.fog.color,
          SCENE.fog.near,
          SCENE.fog.far,
        ]}
      />

      {/* Phase 4 */}
      {/* Volumetric fog */}

      {/* Phase 5 */}
      {/* Atmospheric scattering */}
    </>
  );
}