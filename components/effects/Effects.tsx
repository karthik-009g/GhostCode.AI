"use client";

import { EffectComposer } from "@react-three/postprocessing";

import { Bloom } from "./Bloom";
import { DepthOfField } from "./DepthOfField";
import { Noise } from "./Noise";
import { Vignette } from "./Vignette";

export function Effects() {
  return (
    <EffectComposer
      multisampling={0}
      enableNormalPass={false}
    >
      <DepthOfField />

      <Bloom />

      <Noise />

      <Vignette />
    </EffectComposer>
  );
}
