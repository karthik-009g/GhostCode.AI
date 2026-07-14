"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  GHOST_SOFT,
  NEON,
  NEON_SOFT,
  createRng,
  range,
  smoothSegment,
} from "../shared";

export function DigitalSky({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const relaysRef = useRef<THREE.Group>(null);
  const streamsRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.InstancedMesh>(null);
  const satelliteDummy = useMemo(() => new THREE.Object3D(), []);
  const stars = useMemo(() => {
    const rng = createRng(808);
    const positions = new Float32Array(540 * 3);
    const phases = new Float32Array(540);

    for (let index = 0; index < 540; index += 1) {
      positions[index * 3] = range(rng, -90, 90);
      positions[index * 3 + 1] = range(rng, 12, 58);
      positions[index * 3 + 2] = range(rng, -960, 34);
      phases[index] = range(rng, 0, Math.PI * 2);
    }

    return { positions, phases };
  }, []);
  const streamSpecs = useMemo(() => {
    const rng = createRng(211);

    return Array.from({ length: 10 }, (_, index) => ({
      x: range(rng, -44, 44),
      y: range(rng, 16, 38),
      z: range(rng, -680, -40),
      length: range(rng, 20, 58),
      phase: range(rng, 0, Math.PI * 2),
      ghost: index % 5 === 0,
    }));
  }, []);
  const skyStructures = useMemo(() => {
    const rng = createRng(932);
    const cloudPositions = new Float32Array(72 * 3);
    const constellationPositions = new Float32Array(48 * 3);

    for (let index = 0; index < 72; index += 1) {
      cloudPositions[index * 3] = range(rng, -95, 95);
      cloudPositions[index * 3 + 1] = range(rng, 22, 74);
      cloudPositions[index * 3 + 2] = range(rng, -940, 20);
    }

    for (let index = 0; index < 24; index += 1) {
      const x = range(rng, -70, 70);
      const y = range(rng, 18, 52);
      const z = range(rng, -900, -80);
      constellationPositions[index * 6] = x;
      constellationPositions[index * 6 + 1] = y;
      constellationPositions[index * 6 + 2] = z;
      constellationPositions[index * 6 + 3] = x + range(rng, -8, 8);
      constellationPositions[index * 6 + 4] = y + range(rng, -4, 6);
      constellationPositions[index * 6 + 5] = z + range(rng, -14, 14);
    }

    return { cloudPositions, constellationPositions };
  }, []);

  useFrame(({ clock }) => {
    const material = pointsRef.current?.material as THREE.ShaderMaterial | undefined;

    if (material) {
      const timeUniform = material.uniforms.uTime;
      const progressUniform = material.uniforms.uProgress;

      if (timeUniform && progressUniform) {
        timeUniform.value = clock.elapsedTime;
        progressUniform.value = progress;
      }
    }

    if (relaysRef.current) {
      relaysRef.current.rotation.y = clock.elapsedTime * 0.018;
    }

    if (streamsRef.current) {
      streamsRef.current.position.x = Math.sin(clock.elapsedTime * 0.07) * 3.5;
    }

    const satellites = satelliteRef.current;
    if (satellites) {
      for (let index = 0; index < 12; index += 1) {
        const orbit = clock.elapsedTime * (0.035 + (index % 3) * 0.006) + index * 0.74;
        satelliteDummy.position.set(
          Math.cos(orbit) * (34 + (index % 4) * 8),
          30 + Math.sin(orbit * 1.7) * 8 + (index % 3) * 5,
          -210 - index * 57,
        );
        satelliteDummy.rotation.set(orbit * 0.2, orbit, 0.3);
        satelliteDummy.scale.setScalar(0.28 + (index % 2) * 0.08);
        satelliteDummy.updateMatrix();
        satellites.setMatrixAt(index, satelliteDummy.matrix);
      }
      satellites.instanceMatrix.needsUpdate = true;
    }
  });

  const skyRise = smoothSegment(progress, 0.08, 0.48);
  const repositoryRise = smoothSegment(progress, 0.64, 1);

  return (
    <group visible={skyRise > 0.01}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[stars.phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={{
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uCyan: { value: new THREE.Color(NEON_SOFT) },
            uGhost: { value: new THREE.Color(GHOST_SOFT) },
          }}
          vertexShader={`
            uniform float uTime;
            uniform float uProgress;
            attribute float aPhase;
            varying float vPulse;
            varying float vGhost;
            void main() {
              vec3 pos = position;
              pos.x += sin(uTime * 0.06 + aPhase) * 1.2;
              pos.y += sin(uTime * 0.1 + aPhase * 1.7) * 0.4;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = (1.4 + sin(uTime * 0.8 + aPhase) * 0.7) * 28.0 / -mvPosition.z;
              gl_Position = projectionMatrix * mvPosition;
              vPulse = 0.32 + 0.38 * sin(uTime * 0.7 + aPhase);
              vGhost = smoothstep(0.68, 1.0, uProgress);
            }
          `}
          fragmentShader={`
            uniform vec3 uCyan;
            uniform vec3 uGhost;
            varying float vPulse;
            varying float vGhost;
            void main() {
              float d = distance(gl_PointCoord, vec2(0.5));
              if (d > 0.5) discard;
              float alpha = smoothstep(0.5, 0.0, d) * (0.28 + vPulse * 0.24);
              gl_FragColor = vec4(mix(uCyan, uGhost, vGhost), alpha);
            }
          `}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={streamsRef} visible={repositoryRise > 0.02}>
        {streamSpecs.map((stream, index) => (
          <mesh
            key={index}
            position={[stream.x, stream.y, stream.z]}
            rotation={[0, index % 2 === 0 ? 0.18 : -0.18, 0]}
          >
            <boxGeometry args={[0.06, 0.04, stream.length]} />
            <meshBasicMaterial
              color={stream.ghost ? GHOST_SOFT : NEON_SOFT}
              transparent
              opacity={repositoryRise * 0.14}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <group ref={relaysRef} visible={repositoryRise > 0.1}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 34, 26, -520]}>
            <mesh>
              <sphereGeometry args={[0.7, 10, 10]} />
              <meshStandardMaterial
                color="#172936"
                roughness={0.36}
                metalness={0.76}
                emissive={NEON_SOFT}
                emissiveIntensity={0.12}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 1.25, 24]} />
              <meshBasicMaterial
                color={NEON_SOFT}
                transparent
                opacity={0.18}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      <points visible={repositoryRise > 0.02}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[skyStructures.cloudPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#5ee9f3"
          size={8}
          sizeAttenuation
          transparent
          opacity={0.025 + repositoryRise * 0.045}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments visible={repositoryRise > 0.05}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[skyStructures.constellationPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={NEON_SOFT} transparent opacity={repositoryRise * 0.12} />
      </lineSegments>

      <instancedMesh ref={satelliteRef} args={[undefined, undefined, 12]} visible={repositoryRise > 0.08}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={NEON_SOFT} transparent opacity={0.62} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>

      {[-1, 1].map((side) => (
        <group key={side} visible={repositoryRise > 0.18} position={[side * 55, 44, -640]} rotation={[0.2, side * 0.3, 0]}>
          <mesh>
            <boxGeometry args={[16, 3.4, 5]} />
            <meshStandardMaterial color="#0c2029" roughness={0.34} metalness={0.78} emissive={NEON} emissiveIntensity={0.06 + repositoryRise * 0.08} />
          </mesh>
          <mesh position={[0, -2.4, 0]}>
            <boxGeometry args={[30, 0.06, 0.06]} />
            <meshBasicMaterial color={NEON_SOFT} transparent opacity={repositoryRise * 0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
