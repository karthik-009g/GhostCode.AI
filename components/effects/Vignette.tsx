"use client";

import {
  Vignette as VignetteEffect,
} from "@react-three/postprocessing";

import {
  BlendFunction,
} from "postprocessing";

export function Vignette() {
  return (
    <>
      <VignetteEffect
        offset={0.18}
        darkness={0.42}
        blendFunction={
          BlendFunction.NORMAL
        }
      />

      {/* Phase 4 */}
      {/* Dynamic cinematic vignette */}
    </>
  );
}