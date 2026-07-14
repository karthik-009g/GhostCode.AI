"use client";

import { useFrame } from "@react-three/fiber";
import { animate } from "animejs";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

import { GHOST_SOFT, NEON_SOFT, createRng, range } from "../shared";
import type { CinematicValues } from "../timeline/CinematicTimeline";

type SkySystemProps = {
  progress: number;
  timeline: MutableRefObject<CinematicValues>;
};

type AnimeSkyValues = {
  fogMotion: number;
  starPulse: number;
  lightning: number;
  beamReach: number;
  auroraSpread: number;
};

function useAnimeSkyDirector(progress: number) {
  const values = useRef<AnimeSkyValues>({
    fogMotion: 0.16,
    starPulse: 0.2,
    lightning: 0,
    beamReach: 0.12,
    auroraSpread: 0.08,
  });
  const phase = Math.min(6, Math.floor(progress * 7));

  useEffect(() => {
    const targets: AnimeSkyValues[] = [
      { fogMotion: 0.12, starPulse: 0.18, lightning: 0, beamReach: 0.08, auroraSpread: 0.04 },
      { fogMotion: 0.22, starPulse: 0.24, lightning: 0.04, beamReach: 0.18, auroraSpread: 0.1 },
      { fogMotion: 0.32, starPulse: 0.32, lightning: 0.1, beamReach: 0.32, auroraSpread: 0.18 },
      { fogMotion: 0.42, starPulse: 0.38, lightning: 0.16, beamReach: 0.54, auroraSpread: 0.36 },
      { fogMotion: 0.5, starPulse: 0.28, lightning: 0.34, beamReach: 0.46, auroraSpread: 0.22 },
      { fogMotion: 0.34, starPulse: 0.52, lightning: 0.08, beamReach: 0.74, auroraSpread: 0.64 },
      { fogMotion: 0.18, starPulse: 0.42, lightning: 0.02, beamReach: 0.9, auroraSpread: 0.76 },
    ];
    const animation = animate(values.current, {
      ...targets[phase]!,
      duration: 1200,
      ease: "out(3)",
    });

    return () => {
      animation.cancel();
    };
  }, [phase]);

  return values;
}

function buildSkyPoints(seed: number, count: number, yRange: readonly [number, number], zRange: readonly [number, number]) {
  const rng = createRng(seed);
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = range(rng, -115, 115);
    positions[index * 3 + 1] = range(rng, yRange[0], yRange[1]);
    positions[index * 3 + 2] = range(rng, zRange[0], zRange[1]);
    phases[index] = range(rng, 0, Math.PI * 2);
  }
  return { positions, phases };
}

function VolumetricClouds({
  timeline,
  sky,
}: Pick<SkySystemProps, "timeline"> & {
  sky: MutableRefObject<AnimeSkyValues>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const clouds = useMemo(() => buildSkyPoints(138, 260, [22, 78], [-940, 30]), []);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime!.value = clock.elapsedTime;
    material.uniforms.uDensity!.value = timeline.current.cloudDensity;
    material.uniforms.uTint!.value = timeline.current.atmosphereMix;
    material.uniforms.uMotion!.value = sky.current.fogMotion;
  });

  return <points>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[clouds.positions, 3]} />
      <bufferAttribute attach="attributes-aPhase" args={[clouds.phases, 1]} />
    </bufferGeometry>
    <shaderMaterial
      ref={materialRef}
      uniforms={{ uTime: { value: 0 }, uDensity: { value: 0.2 }, uTint: { value: 0 }, uMotion: { value: 0.16 } }}
      vertexShader={`
        uniform float uTime;
        uniform float uMotion;
        attribute float aPhase;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.x += sin(uTime * (0.018 + uMotion * 0.04) + aPhase) * 6.0;
          pos.y += cos(uTime * (0.014 + uMotion * 0.03) + aPhase * 1.7) * 1.8;
          vec4 view = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (26.0 + sin(aPhase + uTime * 0.06) * 8.0) * 22.0 / -view.z;
          gl_Position = projectionMatrix * view;
          vAlpha = 0.18 + 0.18 * sin(aPhase + uTime * 0.04);
        }
      `}
      fragmentShader={`
        uniform float uDensity;
        uniform float uTint;
        varying float vAlpha;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float alpha = smoothstep(0.5, 0.08, d) * vAlpha * uDensity * 0.22;
          vec3 color = mix(vec3(0.05, 0.22, 0.27), vec3(0.23, 0.07, 0.16), uTint);
          gl_FragColor = vec4(color, alpha);
        }
      `}
      transparent depthWrite={false} blending={THREE.AdditiveBlending}
    />
  </points>;
}

function HighCloudLayer({
  timeline,
  sky,
}: Pick<SkySystemProps, "timeline"> & {
  sky: MutableRefObject<AnimeSkyValues>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const clouds = useMemo(() => buildSkyPoints(404, 150, [58, 105], [-1030, -120]), []);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime!.value = clock.elapsedTime;
    material.uniforms.uDensity!.value = timeline.current.cloudDensity;
    material.uniforms.uLightning!.value = sky.current.lightning;
  });

  return <points>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[clouds.positions, 3]} />
      <bufferAttribute attach="attributes-aPhase" args={[clouds.phases, 1]} />
    </bufferGeometry>
    <shaderMaterial
      ref={materialRef}
      uniforms={{ uTime: { value: 0 }, uDensity: { value: 0.2 }, uLightning: { value: 0 } }}
      vertexShader={`
        uniform float uTime;
        attribute float aPhase;
        varying float vAlpha;
        varying float vFlash;
        void main() {
          vec3 pos = position;
          pos.x += sin(uTime * 0.012 + aPhase) * 10.0;
          vec4 view = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (42.0 + sin(aPhase) * 18.0) * 20.0 / -view.z;
          gl_Position = projectionMatrix * view;
          vAlpha = 0.1 + 0.16 * sin(aPhase + uTime * 0.02);
          vFlash = step(0.985, sin(uTime * 0.8 + aPhase * 4.0) * 0.5 + 0.5);
        }
      `}
      fragmentShader={`
        uniform float uDensity;
        uniform float uLightning;
        varying float vAlpha;
        varying float vFlash;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float alpha = smoothstep(0.5, 0.04, d) * vAlpha * uDensity * 0.18;
          vec3 color = mix(vec3(0.05, 0.1, 0.13), vec3(0.5, 0.85, 1.0), vFlash * uLightning);
          gl_FragColor = vec4(color, alpha + vFlash * uLightning * 0.08);
        }
      `}
      transparent depthWrite={false} blending={THREE.AdditiveBlending}
    />
  </points>;
}

function DigitalAurora({
  timeline,
  sky,
}: Pick<SkySystemProps, "timeline"> & {
  sky: MutableRefObject<AnimeSkyValues>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime!.value = clock.elapsedTime;
    material.uniforms.uIntensity!.value = timeline.current.auroraIntensity;
    material.uniforms.uSpread!.value = sky.current.auroraSpread;
  });
  return <mesh position={[0, 40, -570]} rotation={[0.08, 0, 0]}>
    <planeGeometry args={[180, 44, 32, 8]} />
    <shaderMaterial
      ref={materialRef}
      uniforms={{ uTime: { value: 0 }, uIntensity: { value: 0 }, uSpread: { value: 0.08 } }}
      vertexShader={`
        uniform float uTime;
        uniform float uSpread;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.y += sin(pos.x * 0.08 + uTime * 0.08) * (2.0 + uSpread * 4.0) + sin(pos.x * 0.025 - uTime * 0.05) * 4.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `}
      fragmentShader={`
        uniform float uTime;
        uniform float uIntensity;
        varying vec2 vUv;
        void main() {
          float wave = sin(vUv.x * 16.0 + uTime * 0.12) * 0.5 + 0.5;
          float edge = smoothstep(0.02, 0.48, vUv.y) * (1.0 - smoothstep(0.48, 0.98, vUv.y));
          vec3 color = mix(vec3(0.08, 0.95, 0.92), vec3(0.98, 0.23, 0.5), wave * 0.34);
          gl_FragColor = vec4(color, edge * uIntensity * 0.12);
        }
      `}
      transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide}
    />
  </mesh>;
}

function OrbitalTraffic({ timeline }: Pick<SkySystemProps, "timeline">) {
  const satelliteRef = useRef<THREE.InstancedMesh>(null);
  const aircraftRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const rate = timeline.current.satelliteRate;
    const satellites = satelliteRef.current;
    const aircraft = aircraftRef.current;
    if (satellites) {
      for (let index = 0; index < 14; index += 1) {
        const orbit = time * (0.02 + (index % 3) * 0.004) * (0.5 + rate) + index * 0.68;
        dummy.position.set(Math.cos(orbit) * (38 + (index % 4) * 9), 31 + Math.sin(orbit * 1.4) * 8 + (index % 3) * 6, -175 - index * 54);
        dummy.rotation.set(orbit * 0.2, orbit, 0.2);
        dummy.scale.setScalar(0.22 + (index % 2) * 0.08);
        dummy.updateMatrix();
        satellites.setMatrixAt(index, dummy.matrix);
      }
      satellites.instanceMatrix.needsUpdate = true;
    }
    if (aircraft) {
      for (let index = 0; index < 18; index += 1) {
        const travel = ((time * (0.012 + (index % 4) * 0.003) + index * 0.14) % 1) - 0.5;
        dummy.position.set(-78 + travel * 156, 18 + (index % 5) * 3.8, -90 - index * 42);
        dummy.rotation.set(0, Math.PI / 2, 0);
        dummy.scale.set(0.34, 0.12, 0.8);
        dummy.updateMatrix();
        aircraft.setMatrixAt(index, dummy.matrix);
      }
      aircraft.instanceMatrix.needsUpdate = true;
    }
  });

  return <>
    <instancedMesh ref={satelliteRef} args={[undefined, undefined, 14]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={NEON_SOFT} transparent opacity={0.64} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
    <instancedMesh ref={aircraftRef} args={[undefined, undefined, 18]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#b3fbff" transparent opacity={0.36} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  </>;
}

function DistantCity() {
  const cityRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const buildings = useMemo(() => {
    const rng = createRng(722);
    return Array.from({ length: 100 }, () => ({ x: range(rng, -110, 110), z: range(rng, -970, -120), height: range(rng, 12, 74), width: range(rng, 2, 7) }));
  }, []);

  useLayoutEffect(() => {
    const city = cityRef.current;
    if (!city) return;
    buildings.forEach((building, index) => {
      dummy.position.set(building.x, building.height * 0.5, building.z);
      dummy.scale.set(building.width, building.height, building.width * 0.8);
      dummy.updateMatrix();
      city.setMatrixAt(index, dummy.matrix);
    });
    city.instanceMatrix.needsUpdate = true;
  }, [buildings, dummy]);

  return <instancedMesh ref={cityRef} args={[undefined, undefined, buildings.length]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="#07131c" transparent opacity={0.32} depthWrite={false} />
  </instancedMesh>;
}

function NetworkArchitecture({
  timeline,
  sky,
}: Pick<SkySystemProps, "timeline"> & {
  sky: MutableRefObject<AnimeSkyValues>;
}) {
  const beamMaterials = useRef<THREE.MeshBasicMaterial[]>([]);
  useFrame(({ clock }) => {
    const pulse = timeline.current.beamPulse;
    beamMaterials.current.forEach((material, index) => {
      material.opacity = 0.035 + pulse * sky.current.beamReach * (0.08 + Math.sin(clock.elapsedTime * 0.22 + index) * 0.025);
    });
  });
  return <>
    {Array.from({ length: 8 }, (_, index) => <mesh key={index} position={[-62 + index * 17, 30 + (index % 3) * 8, -330 - index * 72]} rotation={[0.08, 0, 0]}>
      <boxGeometry args={[0.06, 0.06, 120]} />
      <meshBasicMaterial ref={(material) => { if (material) beamMaterials.current[index] = material; }} color={index % 3 === 0 ? GHOST_SOFT : NEON_SOFT} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>)}
    <group position={[0, 30, -560]} rotation={[Math.PI / 2, 0, 0]}>
      {[-54, -36, -18, 0, 18, 36, 54].map((offset) => <mesh key={offset} position={[offset, 0, 0]}><boxGeometry args={[0.06, 0.06, 118]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>)}
      {[-42, -21, 0, 21, 42].map((offset) => <mesh key={offset} position={[0, offset, 0]}><boxGeometry args={[118, 0.06, 0.06]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>)}
    </group>
  </>;
}

function FloatingMegastructures({ progress }: Pick<SkySystemProps, "progress">) {
  const rise = THREE.MathUtils.smoothstep(progress, 0.28, 0.92);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const structures = useMemo<ReadonlyArray<readonly [number, number, number, number]>>(
    () => [
      [-46, 44, -430, 13],
      [58, 52, -640, 18],
      [0, 58, -820, 24],
    ],
    [],
  );

  useFrame(({ clock }) => {
    ringRefs.current.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.z = clock.elapsedTime * (index % 2 === 0 ? 0.018 : -0.014);
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = rise * (0.08 + index * 0.025);
    });
  });

  return <group visible={rise > 0.01}>
    {structures.map(([x, y, z, radius], index) => (
      <group key={index} position={[x, y, z]} rotation={[0.4, index * 0.5, 0.18]}>
        <mesh
          ref={(mesh) => {
            if (mesh) ringRefs.current[index] = mesh;
          }}
          rotation={[Math.PI / 2.2, 0, 0]}
        >
          <ringGeometry args={[radius, radius + 0.14, 128]} />
          <meshBasicMaterial color={index === 1 ? GHOST_SOFT : NEON_SOFT} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <boxGeometry args={[radius * 1.25, 0.22, radius * 0.18]} />
          <meshStandardMaterial color="#17232d" roughness={0.34} metalness={0.68} emissive={NEON_SOFT} emissiveIntensity={rise * 0.06} />
        </mesh>
      </group>
    ))}
  </group>;
}

function AtmosphericHaze({ timeline }: Pick<SkySystemProps, "timeline">) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime!.value = clock.elapsedTime;
    material.uniforms.uMix!.value = timeline.current.atmosphereMix;
  });

  return <mesh position={[0, 28, -520]} rotation={[0, 0, 0]}>
    <planeGeometry args={[260, 115, 12, 6]} />
    <shaderMaterial
      ref={materialRef}
      uniforms={{ uTime: { value: 0 }, uMix: { value: 0 } }}
      vertexShader={`
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.y += sin(pos.x * 0.025 + uTime * 0.03) * 2.6;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `}
      fragmentShader={`
        uniform float uMix;
        varying vec2 vUv;
        void main() {
          float vertical = smoothstep(0.02, 0.55, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
          float center = 1.0 - abs(vUv.x - 0.5) * 1.5;
          vec3 color = mix(vec3(0.03, 0.22, 0.27), vec3(0.22, 0.04, 0.11), uMix);
          gl_FragColor = vec4(color, vertical * center * 0.1);
        }
      `}
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      side={THREE.DoubleSide}
    />
  </mesh>;
}

function ShootingStars({
  sky,
}: {
  sky: MutableRefObject<AnimeSkyValues>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meteors = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        x: -90 + index * 30,
        y: 78 - (index % 3) * 9,
        z: -180 - index * 105,
        phase: index * 0.17,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    meteors.forEach((meteor, index) => {
      const travel = (meteor.phase + clock.elapsedTime * (0.022 + sky.current.starPulse * 0.018)) % 1;
      dummy.position.set(meteor.x + travel * 60, meteor.y - travel * 18, meteor.z - travel * 28);
      dummy.rotation.set(0, 0, -0.32);
      dummy.scale.set(0.12, 0.04, 5.8);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[undefined, undefined, meteors.length]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="#e8fdff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
  </instancedMesh>;
}

function ConstellationNetwork({
  sky,
}: {
  sky: MutableRefObject<AnimeSkyValues>;
}) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const points = useMemo(() => {
    const vertices: number[] = [];
    for (let index = 0; index < 9; index += 1) {
      const x = -68 + index * 17;
      const y = 64 + Math.sin(index) * 9;
      const z = -260 - index * 68;
      vertices.push(x, y, z, x + 14, y + Math.cos(index) * 6, z - 52);
    }
    return new Float32Array(vertices);
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.opacity =
      0.04 + sky.current.beamReach * 0.12 + Math.sin(clock.elapsedTime * 0.18) * 0.015;
  });

  return <lineSegments>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry>
    <lineBasicMaterial ref={materialRef} color={NEON_SOFT} transparent opacity={0.08} />
  </lineSegments>;
}

function StarField({
  sky,
}: {
  sky: MutableRefObject<AnimeSkyValues>;
}) {
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const stars = useMemo(() => buildSkyPoints(901, 780, [18, 92], [-990, 40]), []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.opacity =
      0.36 + sky.current.starPulse * 0.28 + Math.sin(clock.elapsedTime * 0.16) * 0.06;
  });

  return <points>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[stars.positions, 3]} /></bufferGeometry>
    <pointsMaterial ref={materialRef} color="#c8fbff" size={0.46} sizeAttenuation transparent opacity={0.56} depthWrite={false} blending={THREE.AdditiveBlending} />
  </points>;
}

export function SkySystem({ progress, timeline }: SkySystemProps) {
  const sky = useAnimeSkyDirector(progress);

  return <group visible={progress > 0.04}>
    <DistantCity />
    <AtmosphericHaze timeline={timeline} />
    <VolumetricClouds timeline={timeline} sky={sky} />
    <HighCloudLayer timeline={timeline} sky={sky} />
    <DigitalAurora timeline={timeline} sky={sky} />
    <OrbitalTraffic timeline={timeline} />
    <NetworkArchitecture timeline={timeline} sky={sky} />
    <FloatingMegastructures progress={progress} />
    <ConstellationNetwork sky={sky} />
    <ShootingStars sky={sky} />
    <StarField sky={sky} />
    {[-1, 1].map((side) => <group key={side} position={[side * 48, 25, -540]}>
      <mesh><sphereGeometry args={[1.1, 12, 12]} /><meshStandardMaterial color="#122a34" roughness={0.28} metalness={0.82} emissive={NEON_SOFT} emissiveIntensity={0.18} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[2.3, 2.38, 32]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
    </group>)}
  </group>;
}
