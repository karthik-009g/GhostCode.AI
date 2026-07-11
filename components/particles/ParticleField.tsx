"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { SCENE } from "@/constants/scene";
import { COLORS } from "@/constants/colors";
import { useAnimationStore } from "@/stores/animation.store";
import { useSceneStore } from "@/stores/scene.store";

interface ParticleFieldProps {
  density?: number;
}

export function ParticleField({
  density = 1,
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);

  const introProgress = useAnimationStore(
    (state) => state.introProgress,
  );

  const corruptionLevel = useSceneStore(
    (state) => state.corruptionLevel,
  );

  const ghostHijack = useSceneStore(
    (state) => state.ghostAttackActive,
  );

  const cyanColor = useMemo(
    () => new THREE.Color(COLORS.cyan.core),
    [],
  );

  const redColor = useMemo(
    () => new THREE.Color(COLORS.ghost.core),
    [],
  );

  const {
    positions,
    phases,
    uniforms,
  } = useMemo(() => {
    const count = Math.floor(
      SCENE.particles.count * density,
    );

    const spread =
      SCENE.particles.spread;

    const positions =
      new Float32Array(
        count * 3,
      );

    const phases =
      new Float32Array(count);

    for (
      let i = 0;
      i < count;
      i++
    ) {
      positions[i * 3] =
        (Math.random() - 0.5) *
        spread;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) *
        spread *
        0.6;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) *
        spread;

      phases[i] =
        Math.random() *
        Math.PI *
        2;
    }

    return {
      positions,
      phases,
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor: {
          value:
            new THREE.Color(
              COLORS.cyan.core,
            ),
        },
        uSize: {
          value:
            SCENE
              .particles.size *
            300,
        },
        uOpacity: {
          value: 0.5,
        },
      },
    };
  }, [density]);

  useFrame(({ clock }) => {
    if (!meshRef.current)
      return;

    const material =
      meshRef.current
        .material as THREE.ShaderMaterial;

    if (material.uniforms?.uColor) {
      const intensity =
        THREE.MathUtils.clamp(
          corruptionLevel * 0.8 + introProgress * 0.25,
          0,
          1,
        );

      material.uniforms.uColor.value
        .copy(cyanColor)
        .lerp(
          redColor,
          ghostHijack ? intensity : intensity * 0.55,
        );
    }

    if (material.uniforms?.uOpacity) {
      material.uniforms.uOpacity.value =
        0.42 +
        corruptionLevel * 0.22 +
        (ghostHijack ? 0.12 : 0) +
        introProgress * 0.08;
    }

    if (
      material.uniforms?.uTime
    ) {
      material.uniforms.uTime.value =
        clock.elapsedTime;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            positions,
            3,
          ]}
        />

        <bufferAttribute
          attach="attributes-aPhase"
          args={[
            phases,
            1,
          ]}
        />
      </bufferGeometry>

      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
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
              vec4(pos, 1.0);

            gl_PointSize =
              uSize /
              -mvPosition.z;

            gl_Position =
              projectionMatrix *
              mvPosition;

            vOpacity =
              0.2 +
              0.3 *
              sin(
                uTime * 0.6 +
                aPhase
              );
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;

          varying float vOpacity;

          void main() {
            float dist =
              distance(
                gl_PointCoord,
                vec2(0.5)
              );

            if (dist > 0.5)
              discard;

            float alpha =
              smoothstep(
                0.5,
                0.05,
                dist
              )
              * vOpacity
              * uOpacity;

            gl_FragColor =
              vec4(
                uColor,
                alpha
              );
          }
        `}
        transparent
        depthWrite={false}
        blending={
          THREE.AdditiveBlending
        }
      />
    </points>
  );
}
