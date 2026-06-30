"use client";

import { Background } from "./Background";
import { Lighting } from "./Lighting";
import { Fog } from "./Fog";

export function Environment() {
  return (
    <>
      {/* World background */}
      <Background />

      {/* Cinematic lighting */}
      <Lighting />

      {/* Atmospheric depth */}
      <Fog />

      {/* Phase 3 */}
      {/* Atmosphere */}

      {/* Phase 3 */}
      {/* Environment particles */}

      {/* Phase 4 */}
      {/* Volumetric effects */}
    </>
  );
}