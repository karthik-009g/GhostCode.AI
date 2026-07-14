import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import type { MutableRefObject, ReactNode } from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { TowerField as ArchitecturalTowerField } from "../architecture/TowerArchetypes";
import { CinematicCamera } from "../camera/CinematicCamera";
import { RepositoryWorld } from "../repository/RepositoryWorld";
import { SkySystem } from "../environment/SkySystem";
import type { CinematicValues } from "../timeline/CinematicTimeline";
import {
  BG,
  GHOST,
  GHOST_SOFT,
  NEON,
  NEON_SOFT,
  WARM,
  createRng,
  type GhostSpec,
  type HoverState,
  range,
  type SignSpec,
  smoothSegment,
} from "../shared";

function StreetAtmosphere({
  progress,
}: {
  progress: number;
}) {
  const cyanRise = smoothSegment(
    progress,
    0,
    0.45,
  );
  const ghostRise = smoothSegment(
    progress,
    0.62,
    1,
  );
  const density =
    0.014 +
    cyanRise * 0.004 +
    ghostRise * 0.007;
  const fogColor = new THREE.Color(BG)
    .lerp(new THREE.Color("#07141a"), cyanRise * 0.28)
    .lerp(new THREE.Color("#130a12"), ghostRise * 0.24);

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fogExp2 attach="fog" args={[fogColor, density]} />
      <ambientLight color="#0c1119" intensity={0.9} />
      <directionalLight
        color={NEON_SOFT}
        intensity={1.1}
        position={[-10, 14, 8]}
      />
      <pointLight
        color={NEON}
        intensity={9 + cyanRise * 8}
        distance={72}
        decay={2}
        position={[0, 7, -36]}
      />
      <pointLight
        color={GHOST}
        intensity={ghostRise * 18}
        distance={90}
        decay={2}
        position={[14, 8, -110]}
      />
      <pointLight
        color={WARM}
        intensity={2.2}
        distance={28}
        decay={2}
        position={[-10, 4, -22]}
      />
    </>
  );
}

function StreetBase({
  progress,
}: {
  progress: number;
}) {
  const railGlow =
    0.16 +
    smoothSegment(progress, 0.12, 0.62) * 0.12;
  const wetness = smoothSegment(progress, 0.2, 0.8);
  const serviceZones = [
    { z: 30, length: 17, side: -1 },
    { z: 18, length: 12, side: 1 },
    { z: 1, length: 20, side: 1 },
    { z: -16, length: 15, side: -1 },
    { z: -36, length: 22, side: -1 },
    { z: -57, length: 13, side: 1 },
    { z: -78, length: 18, side: -1 },
    { z: -101, length: 24, side: 1 },
  ];
  const intersections = [-5, -43, -86] as const;

  return (
    <group position={[0, -0.05, -52]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 190]} />
        <meshPhysicalMaterial
          color="#03070a"
          roughness={0.24 - wetness * 0.08}
          metalness={0.18}
          clearcoat={0.95}
          clearcoatRoughness={0.1}
        />
      </mesh>

      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.4, 190]} />
        <meshStandardMaterial
          color="#05080b"
          roughness={0.42}
          metalness={0.22}
        />
      </mesh>

      <mesh
        position={[-13.5, 0.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[7, 190]} />
        <meshStandardMaterial
          color="#10141b"
          roughness={0.92}
          metalness={0.04}
        />
      </mesh>

      <mesh
        position={[13.5, 0.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[7, 190]} />
        <meshStandardMaterial
          color="#10141b"
          roughness={0.92}
          metalness={0.04}
        />
      </mesh>

      {serviceZones.map((zone, index) => (
        <group key={index} position={[zone.side * 8.2, 0, zone.z]}>
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.25, zone.length]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? "#10161d" : "#0b1016"}
              roughness={0.76}
              metalness={0.12}
            />
          </mesh>
          <mesh position={[-zone.side * 1.45, 0.15, 0]}>
            <boxGeometry args={[0.18, 0.22, zone.length]} />
            <meshStandardMaterial
              color="#27303a"
              roughness={0.68}
              metalness={0.2}
            />
          </mesh>
          <mesh position={[zone.side * 1.45, 0.1, 0]}>
            <boxGeometry args={[0.1, 0.12, zone.length * 0.92]} />
            <meshBasicMaterial
              color={zone.side < 0 ? NEON_SOFT : WARM}
              transparent
              opacity={0.12 + railGlow * 0.16}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {intersections.map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[31, 4.8]} />
            <meshStandardMaterial
              color="#11161c"
              roughness={0.7}
              metalness={0.14}
            />
          </mesh>
          {[-10.5, -7.8, 7.8, 10.5].map((x) => (
            <mesh
              key={x}
              position={[x, 0.07, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.72, 3.5]} />
              <meshBasicMaterial
                color="#d9e7ee"
                transparent
                opacity={0.12}
                depthWrite={false}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[2.1, 0.22, 3.8]} />
            <meshStandardMaterial
              color="#303840"
              roughness={0.78}
              metalness={0.08}
            />
          </mesh>
        </group>
      ))}

      {[-5.15, 5.15].map((x) => (
        <mesh key={x} position={[x, 0.16, 0]}>
          <boxGeometry args={[0.24, 0.22, 188]} />
          <meshStandardMaterial
            color="#28313a"
            roughness={0.72}
            metalness={0.18}
          />
        </mesh>
      ))}

      {Array.from({ length: 19 }).map((_, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const z = 35 - index * 9.4 - (index % 3) * 1.3;
        const x = side * (11.4 + (index % 4) * 0.68);

        return (
          <group key={index} position={[x, 0, z]}>
            <mesh position={[0, 0.42, 0]}>
              <boxGeometry args={[0.62, 0.84, 0.48]} />
              <meshStandardMaterial
                color={index % 5 === 0 ? "#27323a" : "#171e25"}
                roughness={0.62}
                metalness={0.42}
              />
            </mesh>
            <mesh position={[-side * 0.52, 0.48, 0.38]}>
              <boxGeometry args={[0.12, 0.26, 0.06]} />
              <meshBasicMaterial
                color={side < 0 ? NEON : WARM}
                transparent
                opacity={0.38}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh
              position={[-side * 0.72, 0.025, index % 2 === 0 ? 0.7 : -0.7]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.72, 0.34]} />
              <meshStandardMaterial
                color="#313b44"
                roughness={0.7}
                metalness={0.28}
              />
            </mesh>
            {index % 4 === 1 && (
              <mesh position={[side * 0.78, 0.28, -0.5]}>
                <boxGeometry args={[1.15, 0.56, 0.74]} />
                <meshStandardMaterial
                  color="#252f37"
                  roughness={0.86}
                  metalness={0.08}
                />
              </mesh>
            )}
            {index % 2 === 0 && (
              <mesh position={[side * 0.72, 0.36, 0.62]}>
                <cylinderGeometry args={[0.09, 0.12, 0.72, 8]} />
                <meshStandardMaterial
                  color="#424b53"
                  roughness={0.46}
                  metalness={0.56}
                />
              </mesh>
            )}
            {index % 3 === 0 && (
              <>
                <mesh position={[side * 0.72, 1.9, 0]}>
                  <cylinderGeometry args={[0.07, 0.1, 3, 8]} />
                  <meshStandardMaterial
                    color="#202832"
                    roughness={0.5}
                    metalness={0.62}
                  />
                </mesh>
                <mesh position={[side * 0.72, 3.35, 0]}>
                  <boxGeometry args={[0.6, 0.16, 0.38]} />
                  <meshBasicMaterial
                    color={side < 0 ? NEON_SOFT : WARM}
                    transparent
                    opacity={0.28}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              </>
            )}
          </group>
        );
      })}

      {[-5.2, 5.2].map((x) => (
        <mesh
          key={x}
          position={[x, 0.04, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.26, 190]} />
          <meshBasicMaterial
            color={NEON}
            transparent
            opacity={railGlow}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {[-11.1, 11.1].map((x) => (
        <mesh
          key={x}
          position={[x, 0.11, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.16, 188]} />
          <meshStandardMaterial
            color="#161e25"
            roughness={0.82}
            metalness={0.18}
          />
        </mesh>
      ))}

      {[-1.6, 1.6].map((x) => (
        <mesh
          key={x}
          position={[x, 0.03, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.12, 190]} />
          <meshBasicMaterial
            color="#95fdff"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {Array.from({ length: 24 }).map((_, index) => {
        const z = 38 - index * 8.2;
        const side = index % 2 === 0 ? -1 : 1;

        return (
          <group key={index} position={[0, 0, z]}>
            <mesh
              position={[side * 7.2, 0.11, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[1.8, 0.08]} />
              <meshBasicMaterial
                color={side < 0 ? NEON_SOFT : WARM}
                transparent
                opacity={0.07 + railGlow * 0.28}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[side * 8.7, 0.22, 0]}>
              <boxGeometry args={[0.16, 0.24, 2.8]} />
              <meshStandardMaterial
                color="#111820"
                roughness={0.62}
                metalness={0.36}
              />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: 7 }).map((_, index) => {
        const z = 18 - index * 28;

        return (
          <group key={index} position={[0, 0, z]}>
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.02, 0]}
            >
              <planeGeometry args={[34, 11]} />
              <meshStandardMaterial
                color="#080c11"
                roughness={0.56}
                metalness={0.14}
              />
            </mesh>

            {Array.from({ length: 8 }).map(
              (__, stripeIndex) => (
                <mesh
                  key={stripeIndex}
                  position={[
                    -12 + stripeIndex * 3.4,
                    0.04,
                    0,
                  ]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[1.1, 7]} />
                  <meshBasicMaterial
                    color="#edf7ff"
                    transparent
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              ),
            )}
          </group>
        );
      })}
    </group>
  );
}

function RoadEvolution({
  progress,
}: {
  progress: number;
}) {
  const serviceRise = smoothSegment(progress, 0.24, 0.66);
  const dataRise = smoothSegment(progress, 0.48, 0.86);
  const vaultRise = smoothSegment(progress, 0.76, 1);

  return (
    <group position={[0, 0.05, -52]}>
      {[-3.45, 3.45].map((x) => (
        <mesh key={x} position={[x, 0, -42]}>
          <boxGeometry args={[0.28, 0.06, 104]} />
          <meshBasicMaterial
            color={x < 0 ? NEON_SOFT : WARM}
            transparent
            opacity={0.03 + serviceRise * 0.2 + dataRise * 0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {[-82, -118, -154].map((z, index) => (
        <group key={z} position={[0, 0, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8.8, 12]} />
            <meshPhysicalMaterial
              color="#08141a"
              roughness={0.18}
              metalness={0.34}
              transmission={0.22}
              transparent
              opacity={dataRise * 0.34}
              emissive={index === 2 ? GHOST : NEON}
              emissiveIntensity={0.03 + dataRise * 0.06}
            />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[8.5, 0.05, 0.12]} />
            <meshBasicMaterial
              color={index === 2 ? GHOST_SOFT : NEON_SOFT}
              transparent
              opacity={0.08 + vaultRise * 0.24}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function JourneyLandmarks({
  progress,
}: {
  progress: number;
}) {
  const commercialRise = smoothSegment(progress, 0.12, 0.42);
  const coreRise = smoothSegment(progress, 0.34, 0.7);
  const vaultRise = smoothSegment(progress, 0.72, 1);

  return (
    <group>
      <group position={[11.5, 5.2, -60]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.2, 40]} />
          <meshBasicMaterial
            color={NEON_SOFT}
            transparent
            opacity={commercialRise * 0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.08, 0.18, 6.8, 10]} />
          <meshStandardMaterial
            color="#18303a"
            roughness={0.34}
            metalness={0.62}
            emissive={NEON}
            emissiveIntensity={commercialRise * 0.12}
          />
        </mesh>
      </group>

      <group position={[-14, 10, -112]}>
        <mesh>
          <boxGeometry args={[0.7, 20, 0.7]} />
          <meshStandardMaterial
            color="#1b2630"
            roughness={0.38}
            metalness={0.68}
            emissive={NEON_SOFT}
            emissiveIntensity={coreRise * 0.1}
          />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.62, 3.2, 0]}>
            <boxGeometry args={[0.06, 12, 0.06]} />
            <meshBasicMaterial
              color={NEON_SOFT}
              transparent
              opacity={coreRise * 0.24}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <group position={[3.8, 7, -178]}>
        <mesh>
          <boxGeometry args={[4.4, 14, 1.8]} />
          <meshStandardMaterial
            color="#0b1219"
            roughness={0.26}
            metalness={0.58}
            emissive={GHOST_SOFT}
            emissiveIntensity={vaultRise * 0.08}
          />
        </mesh>
        <mesh position={[0, 0, 0.94]}>
          <boxGeometry args={[2.8, 10.6, 0.06]} />
          <meshBasicMaterial
            color={GHOST_SOFT}
            transparent
            opacity={vaultRise * 0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function HoverWakeField({
  progress,
  hoverRef,
}: {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const scannerRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const hover = hoverRef.current;
    const x = hover.x * 12;
    const z = -28 - progress * 112 + hover.y * 14;
    const energy = THREE.MathUtils.clamp(hover.energy, 0, 1.6);

    if (ringRef.current) {
      ringRef.current.position.x +=
        (x - ringRef.current.position.x) *
        (1 - Math.exp(-8 * delta));
      ringRef.current.position.z +=
        (z - ringRef.current.position.z) *
        (1 - Math.exp(-8 * delta));
      ringRef.current.scale.setScalar(1.4 + energy * 1.2);
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity =
        0.08 + energy * 0.28 + Math.sin(clock.elapsedTime * 4) * 0.025;
      material.color.set(progress > 0.72 ? GHOST : NEON);
    }

    if (scannerRef.current) {
      scannerRef.current.position.x = x;
      scannerRef.current.position.z = z - 1.2;
      scannerRef.current.rotation.z = clock.elapsedTime * 0.7;
      const material = scannerRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.04 + energy * 0.18;
      material.color.set(progress > 0.72 ? GHOST_SOFT : NEON_SOFT);
    }

    if (lightRef.current) {
      lightRef.current.position.set(x, 1.2, z);
      lightRef.current.intensity = 1.5 + energy * 7;
      lightRef.current.color.set(progress > 0.72 ? GHOST : NEON);
    }
  });

  return (
    <group>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.9, 64]} />
        <meshBasicMaterial
          color={NEON}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={scannerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.38, 72]} />
        <meshBasicMaterial
          color={NEON_SOFT}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        color={NEON}
        intensity={2}
        distance={18}
        decay={2}
      />
    </group>
  );
}

function RoadResponse({
  progress,
  hoverRef,
}: {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const materials = useRef<THREE.MeshBasicMaterial[]>([]);
  const segments = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        x: [-3.8, -1.6, 1.6, 3.8][index % 4] ?? 0,
        z: -20 - index * 7.6,
        phase: index * 0.7,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const hover = hoverRef.current;
    const focusZ = -26 - progress * 92 + hover.y * 8;

    segments.forEach((segment, index) => {
      const material = materials.current[index];

      if (!material) return;

      const distance =
        Math.pow(segment.x - hover.x * 8.8, 2) / 26 +
        Math.pow(segment.z - focusZ, 2) / 180;
      const activation = Math.exp(-distance) * hover.energy;
      material.opacity =
        0.035 +
        activation * 0.68 +
        Math.sin(clock.elapsedTime * 4.2 - segment.phase) * activation * 0.12;
    });
  });

  return (
    <group>
      {segments.map((segment, index) => (
        <mesh
          key={index}
          position={[segment.x, 0.075, segment.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.1, 4.6]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) materials.current[index] = material;
            }}
            color={index % 5 === 0 ? WARM : NEON_SOFT}
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function WorldRig({
  progress,
  hoverRef,
  children,
}: {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
  children: ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const hover = hoverRef.current;
    const desiredX = progress * 1.6 + hover.x * 0.65;
    const desiredY = Math.sin(state.clock.elapsedTime * 0.16) * 0.16;
    const desiredZ = -progress * 14;
    const desiredRotY = hover.x * -0.05 + progress * 0.08;
    const desiredRotZ = hover.x * -0.015;

    group.position.x +=
      (desiredX - group.position.x) *
      (1 - Math.exp(-2.1 * delta));
    group.position.y +=
      (desiredY - group.position.y) *
      (1 - Math.exp(-2.4 * delta));
    group.position.z +=
      (desiredZ - group.position.z) *
      (1 - Math.exp(-1.8 * delta));
    group.rotation.y +=
      (desiredRotY - group.rotation.y) *
      (1 - Math.exp(-2 * delta));
    group.rotation.z +=
      (desiredRotZ - group.rotation.z) *
      (1 - Math.exp(-2.4 * delta));
  });

  return <group ref={groupRef}>{children}</group>;
}

function ForegroundArchitecture({
  progress,
}: {
  progress: number;
}) {
  const rise = smoothSegment(progress, 0.08, 0.52);
  const ghostRise = smoothSegment(progress, 0.7, 1);

  return (
    <group>
      {[
        { x: -14.8, z: -14, width: 6.2, height: 20, depth: 8.4 },
        { x: 14.2, z: -18, width: 5.4, height: 18, depth: 8.8 },
        { x: -16.6, z: 6, width: 4.2, height: 16, depth: 7.2 },
        { x: 16.8, z: 2, width: 4.4, height: 17, depth: 7.6 },
      ].map((block, index) => (
        <group
          key={index}
          position={[block.x, block.height * 0.5, block.z]}
        >
          <mesh>
            <boxGeometry
              args={[block.width, block.height, block.depth]}
            />
            <meshStandardMaterial
              color="#11151d"
              roughness={0.88}
              metalness={0.12}
            />
          </mesh>
          <mesh position={[0, -block.height * 0.42, 0]}>
            <boxGeometry
              args={[
                block.width * 1.16,
                block.height * 0.12,
                block.depth * 1.12,
              ]}
            />
            <meshStandardMaterial
              color="#090d13"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, block.height * 0.18, 0]}>
            <boxGeometry
              args={[
                block.width * 0.76,
                block.height * 0.48,
                block.depth * 0.82,
              ]}
            />
            <meshPhysicalMaterial
              color={index > 1 ? "#13202b" : "#101c28"}
              roughness={0.2}
              metalness={0.08}
              transmission={0.42}
              transparent
              opacity={0.38}
              emissive={index % 2 === 0 ? NEON : WARM}
              emissiveIntensity={0.08 + rise * 0.14}
            />
          </mesh>
          <mesh
            position={[
              0,
              block.height * 0.14,
              block.depth * 0.51,
            ]}
          >
            <boxGeometry
              args={[
                block.width * 0.72,
                block.height * 0.24,
                0.14,
              ]}
            />
            <meshBasicMaterial
              color={index % 2 === 0 ? NEON : WARM}
              transparent
              opacity={0.16 + rise * 0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {Array.from({ length: Math.max(4, Math.floor(block.height / 3)) }).map(
            (_, rowIndex) => {
              const rowCount = Math.max(4, Math.floor(block.height / 3));
              const y =
                -block.height * 0.3 +
                rowIndex * (block.height * 0.54 / rowCount);

              return (
                <mesh
                  key={rowIndex}
                  position={[0, y, block.depth * 0.515]}
                >
                  <boxGeometry
                    args={[
                      block.width * (rowIndex % 2 === 0 ? 0.74 : 0.58),
                      0.08,
                      0.1,
                    ]}
                  />
                  <meshBasicMaterial
                    color={index % 2 === 0 ? NEON : WARM}
                    transparent
                    opacity={0.08 + rise * 0.18}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              );
            },
          )}
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * block.width * 0.48, 0, block.depth * 0.48]}
            >
              <boxGeometry args={[0.1, block.height * 0.86, 0.14]} />
              <meshStandardMaterial
                color="#202833"
                roughness={0.48}
                metalness={0.48}
              />
            </mesh>
          ))}
          <mesh position={[0, block.height * 0.34, 0]}>
            <boxGeometry
              args={[block.width * 1.12, 0.2, 2.4]}
            />
            <meshStandardMaterial
              color="#171c25"
              roughness={0.58}
              metalness={0.22}
              emissive={index % 2 === 0 ? NEON : WARM}
              emissiveIntensity={0.06 + rise * 0.08}
            />
          </mesh>
          <group position={[0, block.height * 0.52, 0]}>
            <mesh>
              <boxGeometry args={[block.width * 0.46, 0.36, block.depth * 0.42]} />
              <meshStandardMaterial
                color="#171e27"
                roughness={0.46}
                metalness={0.42}
              />
            </mesh>
            <mesh position={[block.width * 0.18, 0.36, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.9, 8]} />
              <meshStandardMaterial
                color="#b8eef7"
                roughness={0.32}
                metalness={0.86}
              />
            </mesh>
          </group>
        </group>
      ))}

      <group position={[0, 6.2, -34]}>
        <mesh>
          <boxGeometry args={[31, 0.52, 2.2]} />
          <meshStandardMaterial
            color="#141920"
            roughness={0.64}
            metalness={0.24}
          />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[30.2, 0.28, 1.7]} />
          <meshStandardMaterial
            color="#0b1016"
            roughness={0.54}
            metalness={0.42}
          />
        </mesh>
        {[-13.2, 13.2].map((x) => (
          <group key={x} position={[x, -3.25, 0]}>
            <mesh>
              <boxGeometry args={[0.72, 6.5, 0.9]} />
              <meshStandardMaterial
                color="#202933"
                roughness={0.7}
                metalness={0.25}
              />
            </mesh>
            <mesh position={[0, -2.9, 0]}>
              <boxGeometry args={[1.7, 0.42, 1.8]} />
              <meshStandardMaterial
                color="#171e27"
                roughness={0.82}
                metalness={0.1}
              />
            </mesh>
          </group>
        ))}
        {[-11, -5.5, 0, 5.5, 11].map((x) => (
          <mesh key={x} position={[x, -0.78, 0]}>
            <boxGeometry args={[0.22, 0.5, 2.8]} />
            <meshStandardMaterial
              color="#27313a"
              roughness={0.54}
              metalness={0.48}
            />
          </mesh>
        ))}
        {[-0.92, 0.92].map((z) => (
          <mesh key={z} position={[0, 0.48, z]}>
            <boxGeometry args={[31.2, 0.18, 0.12]} />
            <meshStandardMaterial
              color="#25303a"
              roughness={0.46}
              metalness={0.58}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.22, 0.98]}>
          <boxGeometry args={[29.8, 0.05, 0.08]} />
          <meshBasicMaterial
            color={ghostRise > 0.24 ? GHOST : NEON}
            transparent
            opacity={0.16 + rise * 0.14 + ghostRise * 0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function DataTraffic({
  progress,
}: {
  progress: number;
}) {
  const specs = useMemo(() => {
    const rng = createRng(42);
    const trafficLanes = [-5.8, -2.8, 2.8, 5.8] as const;

    return Array.from(
      { length: 42 },
      (_, index) => ({
        lane:
          (trafficLanes[index % trafficLanes.length] ?? 0) +
          range(rng, -0.18, 0.18),
        zOffset: range(rng, 0, 190),
        speed: range(rng, 7, 13),
        length: range(rng, 0.9, 1.8),
        width: range(rng, 0.14, 0.26),
        direction: index % 3 === 0 ? 1 : -1,
        color:
          index % 3 === 0
            ? NEON
            : index % 5 === 0
              ? WARM
              : GHOST,
      }),
    );
  }, []);

  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(
    () => new THREE.Object3D(),
    [],
  );

  useFrame(({ clock }) => {
    const bodyMesh = bodyRef.current;
    const trailMesh = trailRef.current;

    if (!bodyMesh || !trailMesh) {
      return;
    }

    const intensity =
      0.4 +
      smoothSegment(progress, 0.06, 0.44) * 0.6;
    const ghostRise = smoothSegment(
      progress,
      0.68,
      1,
    );
    const elapsed = clock.elapsedTime;

    specs.forEach((spec, index) => {
      const path =
        (spec.zOffset +
          elapsed *
            spec.speed *
            spec.direction +
          190 * 8) %
        190;
      const z = 18 - path;
      const y =
        0.36 +
        Math.sin(elapsed * 2.2 + index) * 0.025;

      dummy.position.set(spec.lane, y, z - 52);
      dummy.rotation.set(
        0,
        spec.direction > 0 ? 0 : Math.PI,
        0,
      );
      dummy.scale.set(
        spec.width,
        0.08,
        spec.length,
      );
      dummy.updateMatrix();
      bodyMesh.setMatrixAt(index, dummy.matrix);
      bodyMesh.setColorAt(
        index,
        new THREE.Color(spec.color),
      );

      dummy.position.set(
        spec.lane,
        y - 0.05,
        z -
          52 +
          (spec.direction > 0 ? -0.9 : 0.9),
      );
      dummy.scale.set(
        spec.width * 0.58,
        0.05,
        spec.length * 1.8,
      );
      dummy.updateMatrix();
      trailMesh.setMatrixAt(index, dummy.matrix);

      const trailColor = new THREE.Color(
        spec.color,
      ).lerp(
        new THREE.Color(GHOST),
        ghostRise * 0.45,
      );
      trailMesh.setColorAt(index, trailColor);
    });

    bodyMesh.instanceMatrix.needsUpdate = true;
    trailMesh.instanceMatrix.needsUpdate = true;

    if (bodyMesh.instanceColor) {
      bodyMesh.instanceColor.needsUpdate = true;
    }

    if (trailMesh.instanceColor) {
      trailMesh.instanceColor.needsUpdate = true;
    }

    const bodyMaterial =
      bodyMesh.material as THREE.MeshBasicMaterial;
    const trailMaterial =
      trailMesh.material as THREE.MeshBasicMaterial;

    bodyMaterial.opacity =
      0.34 + intensity * 0.56;
    trailMaterial.opacity =
      0.18 +
      intensity * 0.28 +
      ghostRise * 0.1;
  });

  return (
    <>
      <instancedMesh
        ref={bodyRef}
        args={[undefined, undefined, specs.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
        />
      </instancedMesh>

      <instancedMesh
        ref={trailRef}
        args={[undefined, undefined, specs.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
        />
      </instancedMesh>
    </>
  );
}

function AerialDataRibbons({
  progress,
}: {
  progress: number;
}) {
  const ribbons = useMemo(() => {
    const rng = createRng(128);

    return Array.from({ length: 18 }, (_, index) => ({
      x: range(rng, -18, 18),
      y: range(rng, 5.5, 13.5),
      z: range(rng, -158, -18),
      width: range(rng, 0.035, 0.08),
      length: range(rng, 8, 24),
      speed: range(rng, 4, 10),
      color: index % 5 === 0 ? GHOST : index % 3 === 0 ? WARM : NEON,
      phase: range(rng, 0, Math.PI * 2),
    }));
  }, []);

  const refs = useRef<THREE.Mesh[]>([]);
  const visible = smoothSegment(progress, 0.16, 0.68);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, index) => {
      const ribbon = ribbons[index];

      if (!mesh || !ribbon) {
        return;
      }

      const travel =
        ((clock.elapsedTime * ribbon.speed + ribbon.phase * 8) % 160) - 80;
      mesh.position.z = ribbon.z + travel;
      mesh.position.y =
        ribbon.y + Math.sin(clock.elapsedTime * 0.8 + ribbon.phase) * 0.28;
      mesh.rotation.y = Math.sin(clock.elapsedTime * 0.25 + index) * 0.16;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity =
        visible * (0.14 + Math.sin(clock.elapsedTime * 2 + index) * 0.04);
    });
  });

  return (
    <group visible={visible > 0.01}>
      {ribbons.map((ribbon, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            if (mesh) {
              refs.current[index] = mesh;
            }
          }}
          position={[ribbon.x, ribbon.y, ribbon.z]}
          rotation={[0, index % 2 === 0 ? 0.2 : -0.2, 0]}
        >
          <boxGeometry args={[ribbon.width, 0.04, ribbon.length]} />
          <meshBasicMaterial
            color={ribbon.color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function PremiumDepthPlanes({
  progress,
}: {
  progress: number;
}) {
  const rise = smoothSegment(progress, 0.04, 0.42);

  return (
    <group>
      {Array.from({ length: 7 }).map((_, index) => {
        const z = -42 - index * 23;
        const y = 2.4 + index * 0.75;
        const side = index % 2 === 0 ? -1 : 1;

        return (
          <mesh
            key={index}
            position={[side * (11 + index * 0.9), y, z]}
            rotation={[0, side * 0.45, 0]}
          >
            <planeGeometry args={[4.8 + index * 0.7, 1.4]} />
            <meshBasicMaterial
              color={index > 4 ? GHOST_SOFT : NEON_SOFT}
              transparent
              opacity={rise * (0.035 + index * 0.006)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function ReactiveSigns({
  progress,
  hoverRef,
}: {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const signs = useMemo<SignSpec[]>(() => {
    const rng = createRng(77);

    return Array.from(
      { length: 18 },
      (_, index) => ({
        x:
          index % 2 === 0
            ? -8.6 - range(rng, 0, 5)
            : 8.6 + range(rng, 0, 5),
        y: range(rng, 2.8, 7.2),
        z: -10 - index * 6.8,
        width: range(rng, 1.8, 3.6),
        height: range(rng, 0.55, 1.4),
        color:
          index % 4 === 0
            ? GHOST
            : index % 3 === 0
              ? WARM
              : NEON,
        tilt:
          (index % 2 === 0 ? 1 : -1) *
          range(rng, 0.04, 0.14),
      }),
    );
  }, []);

  const materialRefs = useRef<THREE.MeshBasicMaterial[]>(
    [],
  );
  const hologramRefs = useRef<THREE.MeshBasicMaterial[]>(
    [],
  );

  useFrame(({ clock }) => {
    const hover = hoverRef.current;
    const hoverX = hover.x * 14;
    const hoverZ = -26 - progress * 92 + hover.y * 10;
    const base =
      0.18 +
      smoothSegment(progress, 0.08, 0.42) * 0.22;
    const ghostRise = smoothSegment(
      progress,
      0.72,
      1,
    );

    signs.forEach((sign, index) => {
      const material = materialRefs.current[index];
      const hologram = hologramRefs.current[index];

      if (!material || !hologram) {
        return;
      }

      const dx = sign.x - hoverX;
      const dz = sign.z - hoverZ;
      const influence = Math.exp(
        -(dx * dx) / 44 - (dz * dz) / 220,
      );
      const pulse =
        0.5 +
        Math.sin(clock.elapsedTime * 2.4 + index) *
          0.5;

      material.opacity =
        base +
        pulse * 0.1 +
        influence * (0.8 + hover.energy * 0.4) +
        ghostRise * 0.08;
      hologram.opacity =
        0.03 +
        influence * (0.38 + hover.energy * 0.18) +
        pulse * 0.06;
    });
  });

  return (
    <group>
      {signs.map((sign, index) => (
        <group
          key={index}
          position={[sign.x, sign.y, sign.z]}
          rotation={[0, sign.tilt, 0]}
        >
          <mesh>
            <boxGeometry args={[sign.width, sign.height, 0.12]} />
            <meshBasicMaterial
              color={sign.color}
              transparent
              opacity={0.32}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              ref={(material) => {
                if (material) {
                  materialRefs.current[index] = material;
                }
              }}
            />
          </mesh>
          <mesh
            position={[0, sign.height * 0.85, 0.2]}
          >
            <planeGeometry
              args={[sign.width * 0.8, sign.height * 0.8]}
            />
            <meshBasicMaterial
              color={sign.color}
              transparent
              opacity={0.06}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              ref={(material) => {
                if (material) {
                  hologramRefs.current[index] = material;
                }
              }}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ElevatedTransit({
  progress,
}: {
  progress: number;
}) {
  const rise = smoothSegment(progress, 0.32, 0.68);
  const routes = [
    { x: -11.2, y: 6.2, z: -36, length: 38, color: NEON },
    { x: 10.8, y: 5.4, z: -68, length: 30, color: WARM },
    { x: -13.4, y: 7.6, z: -98, length: 42, color: NEON_SOFT },
    { x: 12.6, y: 8.5, z: -130, length: 34, color: GHOST_SOFT },
  ];

  return (
    <group position={[0, (1 - rise) * 2.4, 0]} visible={rise > 0.01}>
      {routes.map((route, index) => (
        <group key={index} position={[route.x, route.y, route.z]}>
          <mesh>
            <boxGeometry args={[5.4, 0.52, route.length]} />
            <meshStandardMaterial
              color="#11161d"
              roughness={0.64}
              metalness={0.42}
            />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <boxGeometry args={[4.8, 0.32, route.length - 0.8]} />
            <meshStandardMaterial
              color="#090e14"
              roughness={0.56}
              metalness={0.48}
            />
          </mesh>
          {[-2.25, 2.25].map((x) => (
            <mesh key={x} position={[x, 0.42, 0]}>
              <boxGeometry args={[0.16, 0.48, route.length]} />
              <meshStandardMaterial
                color="#28333d"
                roughness={0.46}
                metalness={0.66}
              />
            </mesh>
          ))}
          {[-1.65, 1.65].map((x) => (
            <mesh key={x} position={[x, 0.34, 0]}>
              <boxGeometry args={[0.08, 0.1, route.length - 0.8]} />
              <meshBasicMaterial
                color={route.color}
                transparent
                opacity={0.18 + rise * 0.2}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
          {[-0.34, 0.34].map((offset) => (
            <group key={offset} position={[0, -route.y * 0.5, route.length * offset]}>
              <mesh>
                <boxGeometry args={[0.62, route.y, 0.9]} />
                <meshStandardMaterial
                  color="#222b35"
                  roughness={0.72}
                  metalness={0.26}
                />
              </mesh>
              <mesh position={[0, -route.y * 0.48, 0]}>
                <boxGeometry args={[1.9, 0.38, 2.1]} />
                <meshStandardMaterial
                  color="#161e27"
                  roughness={0.8}
                  metalness={0.14}
                />
              </mesh>
            </group>
          ))}
          {[-0.24, 0.24].map((offset) => (
            <mesh
              key={offset}
              position={[0, -0.72, route.length * offset]}
              rotation={[0, 0, offset < 0 ? -0.34 : 0.34]}
            >
              <boxGeometry args={[5.9, 0.16, 0.16]} />
              <meshStandardMaterial
                color="#25303a"
                roughness={0.48}
                metalness={0.54}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.14, -route.length * 0.5 + 0.3]}>
            <boxGeometry args={[4.9, 0.05, 0.1]} />
            <meshBasicMaterial
              color={route.color}
              transparent
              opacity={0.24 + rise * 0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function KernelLightShafts({
  progress,
}: {
  progress: number;
}) {
  const rise = smoothSegment(progress, 0.72, 0.96);
  const refs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      mesh.rotation.y =
        Math.sin(clock.elapsedTime * 0.12 + index) * 0.08;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity =
        rise *
        (0.035 + Math.sin(clock.elapsedTime * 0.5 + index) * 0.012);
    });
  });

  return (
    <group visible={rise > 0.01}>
      {Array.from({ length: 9 }).map((_, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const z = -92 - index * 18;
        const x = side * (12 + (index % 3) * 3.5);

        return (
          <mesh
            key={index}
            ref={(mesh) => {
              if (mesh) {
                refs.current[index] = mesh;
              }
            }}
            position={[x, 9 + index * 0.7, z]}
            rotation={[0, side * 0.22, Math.PI / 18]}
          >
            <planeGeometry args={[1.2, 38]} />
            <meshBasicMaterial
              color={index > 5 ? GHOST_SOFT : NEON_SOFT}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function KernelHorizon({
  progress,
}: {
  progress: number;
}) {
  const rise = smoothSegment(progress, 0.84, 1);
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    ringRefs.current.forEach((ring, index) => {
      if (!ring) {
        return;
      }

      ring.rotation.z =
        clock.elapsedTime * (index % 2 === 0 ? 0.04 : -0.028);
      ring.rotation.y =
        Math.sin(clock.elapsedTime * 0.16 + index) * 0.05;
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = rise * (0.08 + index * 0.025);
    });
  });

  return (
    <group visible={rise > 0.01} position={[0, 8.5, -224]}>
      <mesh position={[0, 0, -22]}>
        <boxGeometry args={[112, 34, 2]} />
        <meshBasicMaterial
          color="#05131c"
          transparent
          opacity={0.18 * rise}
          depthWrite={false}
        />
      </mesh>

      {[5.5, 8.5, 12.5].map((radius, index) => (
        <mesh
          key={radius}
          ref={(mesh) => {
            if (mesh) {
              ringRefs.current[index] = mesh;
            }
          }}
          rotation={[Math.PI / 2.25, 0, 0]}
        >
          <ringGeometry args={[radius, radius + 0.08, 96]} />
          <meshBasicMaterial
            color={index === 2 ? GHOST_SOFT : NEON_SOFT}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <group key={side} position={[side * 10.5, -3.8, 4]}>
          <mesh>
            <boxGeometry args={[2.2, 18, 2.8]} />
            <meshStandardMaterial
              color="#0a1118"
              roughness={0.5}
              metalness={0.36}
              emissive={side < 0 ? NEON : GHOST}
              emissiveIntensity={0.12 * rise}
            />
          </mesh>
          <mesh position={[0, 0, 1.45]}>
            <boxGeometry args={[1.4, 14, 0.08]} />
            <meshBasicMaterial
              color={side < 0 ? NEON : GHOST}
              transparent
              opacity={0.16 * rise}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      <pointLight
        color={NEON_SOFT}
        intensity={8 * rise}
        distance={80}
        decay={2}
        position={[0, 0, 8]}
      />
      <pointLight
        color={GHOST_SOFT}
        intensity={5 * rise}
        distance={70}
        decay={2}
        position={[9, -2, -8]}
      />
    </group>
  );
}

function HoverPulse({
  progress,
  hoverRef,
}: {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const beam = beamRef.current;
    const ring = ringRef.current;
    const light = lightRef.current;

    if (!group || !beam || !ring || !light) {
      return;
    }

    const hover = hoverRef.current;
    const streetZ = -26 - progress * 78 + hover.y * 8;
    const streetX = hover.x * 11;
    const pulse =
      0.5 + Math.sin(clock.elapsedTime * 2.1) * 0.5;
    const ghostRise = smoothSegment(progress, 0.72, 1);

    group.position.x +=
      (streetX - group.position.x) *
      (1 - Math.exp(-6 * delta));
    group.position.z +=
      (streetZ - group.position.z) *
      (1 - Math.exp(-5 * delta));
    group.position.y = 0.02;

    const beamMaterial = beam.material as THREE.MeshBasicMaterial;
    const ringMaterial = ring.material as THREE.MeshBasicMaterial;
    const pulseOpacity =
      0.08 + hover.energy * 0.26 + pulse * 0.06;

    beamMaterial.opacity =
      pulseOpacity + ghostRise * 0.06;
    ringMaterial.opacity =
      0.14 + hover.energy * 0.32 + pulse * 0.1;
    beam.scale.y = 0.82 + hover.energy * 0.6;
    ring.scale.setScalar(
      1.1 + hover.energy * 0.75 + pulse * 0.1,
    );
    light.intensity = 2.2 + hover.energy * 9 + ghostRise * 4;
    light.color.set(ghostRise > 0.24 ? GHOST : NEON);
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={beamRef}
        position={[0, 2.1, 0]}
      >
        <cylinderGeometry
          args={[0.26, 0.82, 4.8, 12, 1, true]}
        />
        <meshBasicMaterial
          color={NEON}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.7, 1.65, 40]} />
        <meshBasicMaterial
          color={NEON}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        color={NEON}
        distance={14}
        intensity={2}
        decay={2}
        position={[0, 1.8, 0]}
      />
    </group>
  );
}

function HologramFields({
  progress,
  hoverRef,
}: {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const refs = useRef<THREE.Group[]>([]);
  const baseRise = smoothSegment(progress, 0.1, 0.56);

  useFrame(({ clock }) => {
    const hover = hoverRef.current;

    refs.current.forEach((group, index) => {
      if (!group) {
        return;
      }

      const hoverZ = -26 - progress * 92 + hover.y * 10;
      const hoverInfluence = Math.exp(
        -Math.pow(group.position.x - hover.x * 11, 2) / 18 -
          Math.pow(group.position.z - hoverZ, 2) / 240,
      );

      group.position.y =
        2.2 +
        Math.sin(clock.elapsedTime * 1.5 + index) *
          0.18 +
        hoverInfluence * 0.28;
      group.rotation.y =
        Math.sin(clock.elapsedTime * 0.3 + index) *
        0.24;
      group.scale.setScalar(
        0.92 +
          baseRise * 0.3 +
          hoverInfluence * 0.22,
      );
    });
  });

  return (
    <group>
      {([
        [-7.8, -24],
        [8.4, -48],
        [-9.2, -74],
        [8.8, -104],
      ] satisfies Array<[number, number]>).map(([x, z], index) => (
        <group
          key={index}
          position={[x, 2.2, z]}
          ref={(group) => {
            if (group) {
              refs.current[index] = group;
            }
          }}
        >
          <mesh>
            <cylinderGeometry
              args={[0.3, 0.52, 2.2, 6, 1, true]}
            />
            <meshBasicMaterial
              color={
                index % 2 === 0
                  ? NEON_SOFT
                  : GHOST_SOFT
              }
              transparent
              opacity={0.16 + baseRise * 0.12}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.1, 0]}
          >
            <ringGeometry args={[0.5, 1.3, 32]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? NEON : GHOST}
              transparent
              opacity={0.14}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {[-0.64, 0, 0.64].map((y) => (
            <mesh
              key={y}
              position={[0, y, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.18, 0.52, 24]} />
              <meshBasicMaterial
                color={index % 2 === 0 ? NEON_SOFT : GHOST_SOFT}
                transparent
                opacity={0.1 + baseRise * 0.08}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function GhostCorruption({
  progress,
  hoverRef,
}: {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const rise = smoothSegment(progress, 0.72, 1);
  const ghosts = useMemo<GhostSpec[]>(
    () => [
      {
        x: 10.5,
        y: 3.8,
        z: -95,
        size: 0.8,
        phase: 0.4,
      },
      {
        x: 13.4,
        y: 5.1,
        z: -108,
        size: 1.2,
        phase: 1.1,
      },
      {
        x: 15.1,
        y: 2.8,
        z: -118,
        size: 0.74,
        phase: 2.2,
      },
      {
        x: 11.6,
        y: 6.2,
        z: -130,
        size: 1.5,
        phase: 2.9,
      },
    ],
    [],
  );

  const refs = useRef<THREE.Group[]>([]);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const hover = hoverRef.current;
    const beamMaterial =
      beamRef.current
        ?.material as THREE.MeshBasicMaterial | undefined;

    if (beamMaterial) {
      beamMaterial.opacity =
        rise *
        (0.04 +
          Math.sin(clock.elapsedTime * 3.4) * 0.02 +
          hover.energy * 0.05);
    }

    refs.current.forEach((group, index) => {
      if (!group) {
        return;
      }

      const ghost = ghosts[index];

      if (!ghost) {
        return;
      }

      const hoverZ = -26 - progress * 122 + hover.y * 10;
      const hoverPull = Math.exp(
        -Math.pow(group.position.x - hover.x * 13, 2) / 20 -
          Math.pow(group.position.z - hoverZ, 2) / 260,
      );

      group.position.y =
        ghost.y +
        Math.sin(clock.elapsedTime * 0.9 + ghost.phase) *
          (0.4 + hoverPull * 0.28);
      group.rotation.y = clock.elapsedTime * 0.26 + ghost.phase;
      group.scale.setScalar(
        0.86 +
          rise * 0.46 +
          hoverPull * 0.22,
      );
    });
  });

  return (
    <group visible={rise > 0.01}>
      <mesh
        ref={beamRef}
        position={[12.5, 6, -114]}
        rotation={[0, 0, Math.PI / 14]}
      >
        <cylinderGeometry args={[0.12, 1.1, 18, 12]} />
        <meshBasicMaterial
          color={GHOST}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {ghosts.map((ghost, index) => (
        <group
          key={index}
          position={[ghost.x, ghost.y, ghost.z]}
          ref={(group) => {
            if (group) {
              refs.current[index] = group;
            }
          }}
        >
          <mesh>
            <octahedronGeometry args={[ghost.size, 0]} />
            <meshStandardMaterial
              color="#220811"
              emissive={GHOST}
              emissiveIntensity={1.6 + rise * 1.8}
              roughness={0.12}
              metalness={0.68}
              transparent
              opacity={0.88}
            />
          </mesh>
          <mesh>
            <octahedronGeometry
              args={[ghost.size * 1.75, 0]}
            />
            <meshBasicMaterial
              color={GHOST}
              transparent
              opacity={0.08 + rise * 0.08}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              wireframe
            />
          </mesh>
          <pointLight
            color={GHOST}
            intensity={2.2 + rise * 4.8}
            distance={10}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}

function AtmosphereParticles({
  progress,
}: {
  progress: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 900;

  const { positions, scales } = useMemo(() => {
    const rng = createRng(9);
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      pos[index * 3] = range(rng, -26, 26);
      pos[index * 3 + 1] = range(rng, 0.2, 16);
      pos[index * 3 + 2] = range(rng, -150, 14);
      scale[index] = range(rng, 0.4, 1.8);
    }

    return { positions: pos, scales: scale };
  }, []);

  useFrame(({ clock }) => {
    const material =
      pointsRef.current
        ?.material as THREE.ShaderMaterial | undefined;

    if (!material) {
      return;
    }

    const timeUniform = material.uniforms.uTime;
    const ghostMixUniform = material.uniforms.uGhostMix;

    if (!timeUniform || !ghostMixUniform) {
      return;
    }

    timeUniform.value = clock.elapsedTime;
    ghostMixUniform.value = smoothSegment(
      progress,
      0.68,
      1,
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={{
          uTime: { value: 0 },
          uGhostMix: { value: 0 },
          uNeon: { value: new THREE.Color(NEON) },
          uGhost: { value: new THREE.Color(GHOST) },
        }}
        vertexShader={`
          uniform float uTime;
          attribute float aScale;
          varying float vAlpha;
          varying float vGhostMix;
          uniform float uGhostMix;

          void main() {
            vec3 pos = position;
            pos.y += sin(uTime * 0.22 + position.x * 0.15) * 0.35;
            pos.x += cos(uTime * 0.18 + position.z * 0.04) * 0.18;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = aScale * 26.0 / -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
            vAlpha = 0.18 + 0.24 * sin(uTime * 0.45 + position.y);
            vGhostMix = uGhostMix;
          }
        `}
        fragmentShader={`
          uniform vec3 uNeon;
          uniform vec3 uGhost;
          varying float vAlpha;
          varying float vGhostMix;

          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
            vec3 color = mix(uNeon, uGhost, vGhostMix);
            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function DistantMegacity({
  progress,
}: {
  progress: number;
}) {
  const rise = smoothSegment(progress, 0.18, 0.86);
  const ghostRise = smoothSegment(progress, 0.72, 1);
  const layers = useMemo(() => {
    const rng = createRng(303);

    return Array.from(
      { length: 150 },
      (_, index) => ({
        x: range(rng, -90, 90),
        z: -80 - range(rng, 0, 120),
        width: range(
          rng,
          2,
          index % 7 === 0 ? 9 : 5.6,
        ),
        height: range(
          rng,
          16,
          index % 8 === 0 ? 80 : 48,
        ),
        opacity: range(rng, 0.06, 0.22),
      }),
    );
  }, []);

  return (
    <group position={[0, 0, -10]}>
      {layers.map((layer, index) => (
        <mesh
          key={index}
          position={[layer.x, layer.height * 0.5, layer.z]}
        >
          <boxGeometry
            args={[
              layer.width,
              layer.height,
              layer.width * 0.88,
            ]}
          />
          <meshBasicMaterial
            color={
              index % 9 === 0 ? "#0a1622" : "#091018"
            }
            transparent
            opacity={
              layer.opacity +
              rise * 0.06 +
              ghostRise * 0.04
            }
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh position={[0, 44, -178]}>
        <boxGeometry args={[98, 88, 18]} />
        <meshBasicMaterial
          color="#05070c"
          transparent
          opacity={0.18 + rise * 0.08}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[-62, 31, -154]}>
        <boxGeometry args={[44, 62, 12]} />
        <meshBasicMaterial
          color="#07111a"
          transparent
          opacity={0.12 + rise * 0.06 + ghostRise * 0.04}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

type WorldSceneProps = {
  progress: number;
  timeline: MutableRefObject<CinematicValues>;
};

export function WorldScene({
  progress,
  timeline,
}: WorldSceneProps) {
  const hoverRef = useRef<HoverState>({
    x: 0,
    y: 0,
    energy: 0,
  });

  return (
    <>
      <CinematicCamera progress={progress} hoverRef={hoverRef} />
      <StreetAtmosphere progress={progress} />
      <WorldRig progress={progress} hoverRef={hoverRef}>
        <StreetBase progress={progress} />
        <RoadEvolution progress={progress} />
        <HoverWakeField progress={progress} hoverRef={hoverRef} />
        <RoadResponse progress={progress} hoverRef={hoverRef} />
        <ForegroundArchitecture progress={progress} />
        <PremiumDepthPlanes progress={progress} />
        <JourneyLandmarks progress={progress} />
        <DistantMegacity progress={progress} />
        <ArchitecturalTowerField progress={progress} hoverRef={hoverRef} />
        <ElevatedTransit progress={progress} />
        <KernelLightShafts progress={progress} />
        <KernelHorizon progress={progress} />
        <RepositoryWorld progress={progress} />
        <SkySystem progress={progress} timeline={timeline} />
        <ReactiveSigns progress={progress} hoverRef={hoverRef} />
        <HologramFields progress={progress} hoverRef={hoverRef} />
        <HoverPulse progress={progress} hoverRef={hoverRef} />
        <AerialDataRibbons progress={progress} />
        <DataTraffic progress={progress} />
        <GhostCorruption progress={progress} hoverRef={hoverRef} />
        <AtmosphereParticles progress={progress} />
      </WorldRig>
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.08}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.62}
          mipmapBlur
        />
        <Noise opacity={0.014} />
        <Vignette
          eskil={false}
          offset={0.16}
          darkness={0.82}
        />
      </EffectComposer>
    </>
  );
}
