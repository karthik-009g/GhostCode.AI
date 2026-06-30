"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

import { COLORS } from "@/constants/colors";

const ParticleMaterialImpl = shaderMaterial(
  {
    uTime: 0,

    uColor: new THREE.Color(
      COLORS.cyan.core,
    ),

    uSize: 0.03,

    uOpacity: 0.6,

    // future systems
    uCorruption: 0,
    uInteraction: 0,
  },

  `
    uniform float uTime;
    uniform float uSize;

    attribute float aPhase;

    varying float vOpacity;

    void main() {
      vec3 pos = position;

      pos.y +=
        sin(
          uTime * 0.4 +
          aPhase
        ) * 0.08;

      pos.x +=
        cos(
          uTime * 0.3 +
          aPhase * 1.3
        ) * 0.04;

      vec4 mvPosition =
        modelViewMatrix *
        vec4(pos,1.0);

      gl_PointSize =
        uSize *
        (
          300.0 /
          -mvPosition.z
        );

      gl_Position =
        projectionMatrix *
        mvPosition;

      vOpacity =
        0.3 +
        0.4 *
        sin(
          uTime * 0.6 +
          aPhase
        );
    }
  `,

  `
    uniform vec3 uColor;
    uniform float uOpacity;

    varying float vOpacity;

    void main() {

      float dist =
        distance(
          gl_PointCoord,
          vec2(0.5)
        );

      if(dist > 0.5)
        discard;

      float alpha =
        smoothstep(
          0.5,
          0.1,
          dist
        )
        *
        vOpacity
        *
        uOpacity;

      gl_FragColor =
        vec4(
          uColor,
          alpha
        );
    }
  `,
);

extend({
  ParticleMaterialImpl,
});

export {
  ParticleMaterialImpl,
};