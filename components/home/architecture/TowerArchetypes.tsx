"use client";

import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  GHOST,
  NEON,
  NEON_SOFT,
  WARM,
  createRng,
  range,
  smoothSegment,
  type HoverState,
  type TowerSpec,
} from "../shared";
import {
  ARCHITECTURE_PROFILES,
  getTowerArchetype,
  type ArchitectureProfile,
} from "./ArchitectureProfiles";
import { BuildingConnections } from "./BuildingConnections";
import { FacadeDetailModules } from "./FacadeModules";
import { RoofAccessories } from "./RoofAccessories";
import { createWindowBands } from "./WindowSystem";

type MechanicalBand = {
  y: number;
  height: number;
  widthScale: number;
  depthScale: number;
};

function pickTint(flavor: TowerSpec["flavor"]) {
  if (flavor === "ghost") return GHOST;
  if (flavor === "residential") return WARM;
  if (flavor === "market") return NEON_SOFT;
  return NEON;
}

function useMechanicalBands(spec: TowerSpec, index: number) {
  return useMemo<MechanicalBand[]>(() => {
    const rng = createRng(index * 577 + Math.floor(spec.depth * 43));
    const count = spec.height > 26 ? 4 : 3;

    return Array.from({ length: count }, (_, band) => ({
      y: -spec.height * 0.28 + (band + 1) * (spec.height / (count + 1)),
      height: range(rng, 0.16, 0.28),
      widthScale: range(rng, 0.82, 1.08),
      depthScale: range(rng, 0.88, 1.12),
    }));
  }, [index, spec.depth, spec.height]);
}

function TowerPodium({
  spec,
  tint,
  profile,
}: {
  spec: TowerSpec;
  tint: string;
  profile: ArchitectureProfile;
}) {
  return (
    <group position={[0, -spec.height * 0.5 + 0.5, 0]}>
      <mesh>
        <boxGeometry
          args={[
            spec.width * profile.podiumScale,
            1,
            spec.depth * (1.12 + (profile.podiumScale - 1) * 0.32),
          ]}
        />
        <meshStandardMaterial
          color="#090d13"
          roughness={0.88}
          metalness={0.12}
        />
      </mesh>
      <mesh position={[0, 0.56, spec.depth * 0.62]}>
        <boxGeometry args={[spec.width * 1.08, 0.08, 0.1]} />
        <meshBasicMaterial
          color={tint}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * spec.width * 0.62, 0.18, 0]}>
          <boxGeometry args={[0.1, 0.72, spec.depth * 1.05]} />
          <meshStandardMaterial
            color="#171c24"
            roughness={0.7}
            metalness={0.34}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.28, spec.depth * 0.61]}>
        <boxGeometry args={[spec.width * 0.34, 0.48, 0.24]} />
        <meshPhysicalMaterial
          color="#152532"
          roughness={0.22}
          metalness={0.18}
          transmission={0.3}
          transparent
          opacity={0.58}
          emissive={tint}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[spec.side * spec.width * 0.38, 0.08, -spec.depth * 0.54]}>
        <boxGeometry args={[spec.width * 0.32, 0.3, 0.1]} />
        <meshStandardMaterial
          color="#1a222c"
          roughness={0.5}
          metalness={0.42}
          emissive={tint}
          emissiveIntensity={0.06}
        />
      </mesh>
      <mesh position={[-spec.side * spec.width * 0.38, 0.16, spec.depth * 0.56]}>
        <boxGeometry args={[spec.width * 0.18, 0.22, 0.16]} />
        <meshBasicMaterial
          color={tint}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function RooftopMachinery({
  spec,
  tint,
  pulseRef,
  profile,
}: {
  spec: TowerSpec;
  tint: string;
  pulseRef: MutableRefObject<THREE.MeshBasicMaterial | null>;
  profile: ArchitectureProfile;
}) {
  const roofY = spec.height * 0.5 + spec.crown + 0.12;

  return (
    <group position={[0, roofY, 0]}>
      {[-0.3, 0, 0.28].map((offset, index) => (
        <mesh key={index} position={[spec.width * offset, 0, 0]}>
          <boxGeometry
            args={[
              spec.width * (index === 1 ? 0.18 : 0.24),
              0.22,
              spec.depth * (index === 1 ? 0.42 : 0.24),
            ]}
          />
          <meshStandardMaterial
            color="#1b222b"
            roughness={0.52}
            metalness={0.48}
          />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * spec.width * 0.34, 0.24, 0]}>
          <cylinderGeometry args={[0.08, 0.08, spec.depth * 0.46, 8]} />
          <meshStandardMaterial
            color="#26313d"
            roughness={0.46}
            metalness={0.62}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 1.2, 8]} />
        <meshStandardMaterial color="#bfefff" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshBasicMaterial
          ref={pulseRef}
          color={tint}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {profile.roof === "cooling" &&
        [-0.26, 0, 0.26].map((offset) => (
          <mesh key={offset} position={[spec.width * offset, 0.28, spec.depth * 0.28]}>
            <cylinderGeometry args={[0.18, 0.22, 0.44, 10]} />
            <meshStandardMaterial color="#34404a" roughness={0.48} metalness={0.52} />
          </mesh>
        ))}
      {profile.roof === "drone-pad" && (
        <>
          <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[spec.width * 0.22, spec.width * 0.26, 24]} />
            <meshBasicMaterial
              color={tint}
              transparent
              opacity={0.36}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[spec.width * 0.28, 0.04, 0.08]} />
            <meshBasicMaterial color={tint} transparent opacity={0.44} />
          </mesh>
        </>
      )}
      {profile.roof === "radome" && (
        <mesh position={[spec.width * 0.24, 0.38, 0]}>
          <sphereGeometry args={[0.28, 12, 10]} />
          <meshStandardMaterial
            color="#b8ced9"
            roughness={0.32}
            metalness={0.58}
            emissive={tint}
            emissiveIntensity={0.08}
          />
        </mesh>
      )}
      {profile.roof === "utility" && (
        <group position={[0, 0.18, -spec.depth * 0.2]}>
          {[-0.22, 0.22].map((offset) => (
            <mesh key={offset} position={[spec.width * offset, 0, 0]}>
              <boxGeometry args={[spec.width * 0.16, 0.46, spec.depth * 0.18]} />
              <meshStandardMaterial color="#29323b" roughness={0.66} metalness={0.44} />
            </mesh>
          ))}
        </group>
      )}
      <RoofAccessories spec={spec} tint={tint} profile={profile} />
    </group>
  );
}

function MechanicalFloors({
  spec,
  tint,
  bands,
}: {
  spec: TowerSpec;
  tint: string;
  bands: MechanicalBand[];
}) {
  return (
    <>
      {bands.map((band, index) => (
        <group key={index} position={[0, band.y, 0]}>
          <mesh>
            <boxGeometry
              args={[
                spec.width * band.widthScale,
                band.height,
                spec.depth * band.depthScale,
              ]}
            />
            <meshStandardMaterial
              color="#151b23"
              roughness={0.56}
              metalness={0.42}
              emissive={tint}
              emissiveIntensity={0.03}
            />
          </mesh>
          <mesh position={[0, band.height * 0.58, spec.depth * band.depthScale * 0.5]}>
            <boxGeometry args={[spec.width * band.widthScale * 0.82, 0.04, 0.06]} />
            <meshBasicMaterial
              color={tint}
              transparent
              opacity={0.16}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

function FacadeFrames({
  spec,
  tint,
  profile,
  neonRise,
  ghostRise,
  trimMaterials,
}: {
  spec: TowerSpec;
  tint: string;
  profile: ArchitectureProfile;
  neonRise: number;
  ghostRise: number;
  trimMaterials: MutableRefObject<THREE.MeshStandardMaterial[]>;
}) {
  const columnCount = profile.facade === "glass-grid" ? 4 : 3;

  return (
    <>
      {Array.from({ length: columnCount }, (_, index) => {
        const offset = THREE.MathUtils.lerp(
          -0.34,
          0.34,
          index / (columnCount - 1),
        );

        return (
          <mesh
            key={index}
            position={[spec.width * offset, spec.height * 0.03, spec.depth * 0.528]}
          >
            <boxGeometry args={[0.055, spec.height * 0.78, 0.12]} />
            <meshStandardMaterial
              ref={(material) => {
                if (material) trimMaterials.current[index] = material;
              }}
              color="#242d38"
              roughness={0.42}
              metalness={0.58}
              emissive={tint}
              emissiveIntensity={0.04 + neonRise * 0.05 + ghostRise * 0.08}
            />
          </mesh>
        );
      })}

      {[-1, 1].map((side) => (
        <mesh
          key={`side-frame-${side}`}
          position={[side * spec.width * 0.515, spec.height * 0.04, 0]}
        >
          <boxGeometry args={[0.09, spec.height * 0.82, spec.depth * 0.18]} />
          <meshStandardMaterial
            ref={(material) => {
              if (material) trimMaterials.current[columnCount + (side + 1) / 2] = material;
            }}
            color="#1d2530"
            roughness={0.48}
            metalness={0.5}
          />
        </mesh>
      ))}
      {Array.from({ length: 5 }, (_, index) => (
        <mesh
          key={`floor-frame-${index}`}
          position={[
            0,
            -spec.height * 0.28 + index * (spec.height * 0.16),
            spec.depth * 0.532,
          ]}
        >
          <boxGeometry args={[spec.width * 0.9, 0.075, 0.1]} />
          <meshStandardMaterial
            color="#27303a"
            roughness={0.44}
            metalness={0.54}
          />
        </mesh>
      ))}
    </>
  );
}

function ServiceBridge({
  spec,
  tint,
  neonRise,
}: {
  spec: TowerSpec;
  tint: string;
  neonRise: number;
}) {
  return (
    <group position={[spec.side * -1.9, spec.height * 0.14, 0]}>
      <mesh>
        <boxGeometry args={[3.5, 0.18, spec.depth * 0.32]} />
        <meshStandardMaterial
          color="#151b22"
          roughness={0.58}
          metalness={0.38}
        />
      </mesh>
      {[-1, 1].map((rail) => (
        <mesh key={rail} position={[0, 0.18, rail * spec.depth * 0.18]}>
          <boxGeometry args={[3.4, 0.08, 0.04]} />
          <meshBasicMaterial
            color={tint}
            transparent
            opacity={0.14 + neonRise * 0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {[-1.2, 0, 1.2].map((offset) => (
        <mesh key={offset} position={[offset, -0.3, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.72, 6]} />
          <meshStandardMaterial color="#252d36" roughness={0.5} metalness={0.52} />
        </mesh>
      ))}
    </group>
  );
}

function VerticalBillboard({
  spec,
  tint,
  progress,
}: {
  spec: TowerSpec;
  tint: string;
  progress: number;
}) {
  const opacity =
    spec.flavor === "residential"
      ? 0.08
      : 0.16 + smoothSegment(progress, 0.18, 0.68) * 0.22;

  return (
    <group position={[spec.width * 0.56, spec.height * 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[0.1, spec.height * 0.34, spec.depth * 0.52]} />
        <meshBasicMaterial
          color={tint}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.12, spec.height * 0.08, spec.depth * 0.62]} />
        <meshStandardMaterial color="#1b2028" roughness={0.52} metalness={0.42} />
      </mesh>
    </group>
  );
}

function EngineeringDetailKit({
  spec,
  tint,
  profile,
  neonRise,
  ghostRise,
}: {
  spec: TowerSpec;
  tint: string;
  profile: ArchitectureProfile;
  neonRise: number;
  ghostRise: number;
}) {
  const structuralOpacity = 0.2 + neonRise * 0.12 + ghostRise * 0.18;
  const serviceSide = profile.secondaryShaft ? -spec.side : spec.side;

  return (
    <>
      {[-1, 1].map((side) => (
        <group
          key={`brace-${side}`}
          position={[side * spec.width * 0.54, spec.height * 0.03, spec.depth * 0.34]}
          rotation={[0, 0, side * 0.18]}
        >
          {[-0.22, 0.22].map((offset) => (
            <mesh key={offset} position={[0, spec.height * offset, 0]}>
              <boxGeometry args={[0.06, spec.height * 0.34, 0.08]} />
              <meshStandardMaterial
                color="#2c3540"
                roughness={0.46}
                metalness={0.62}
                emissive={tint}
                emissiveIntensity={0.02 + ghostRise * 0.05}
              />
            </mesh>
          ))}
        </group>
      ))}

      <group position={[serviceSide * spec.width * 0.57, spec.height * 0.02, -spec.depth * 0.42]}>
        {[-0.26, 0, 0.26].map((offset, index) => (
          <mesh key={offset} position={[0, spec.height * offset, index * 0.13]}>
            <cylinderGeometry args={[0.045, 0.045, spec.height * 0.42, 8]} />
            <meshStandardMaterial
              color={index === 1 ? "#46515c" : "#29333e"}
              roughness={0.38}
              metalness={0.74}
            />
          </mesh>
        ))}
        {[-0.32, 0.32].map((offset) => (
          <mesh key={`rail-${offset}`} position={[0, spec.height * offset, 0.22]}>
            <boxGeometry args={[0.18, 0.08, spec.depth * 0.34]} />
            <meshBasicMaterial
              color={tint}
              transparent
              opacity={structuralOpacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {[-0.24, 0.04, 0.32].map((level, index) => (
        <group key={`platform-${level}`} position={[0, spec.height * level, spec.depth * 0.58]}>
          <mesh>
            <boxGeometry args={[spec.width * 0.86, 0.08, 0.28]} />
            <meshStandardMaterial
              color="#202832"
              roughness={0.52}
              metalness={0.48}
            />
          </mesh>
          <mesh position={[0, 0.1, 0.18]}>
            <boxGeometry args={[spec.width * 0.72, 0.035, 0.04]} />
            <meshBasicMaterial
              color={index === 1 ? WARM : tint}
              transparent
              opacity={0.16 + neonRise * 0.12}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      <group position={[0, -spec.height * 0.4, -spec.depth * 0.58]}>
        {[-0.28, 0, 0.28].map((offset) => (
          <mesh key={offset} position={[spec.width * offset, 0, 0]}>
            <boxGeometry args={[spec.width * 0.18, 0.5, 0.16]} />
            <meshStandardMaterial
              color="#303a43"
              roughness={0.64}
              metalness={0.38}
              emissive={tint}
              emissiveIntensity={0.03 + neonRise * 0.04}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

function MaintenanceDroneField({
  towers,
  progress,
}: {
  towers: TowerSpec[];
  progress: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const drones = useMemo(
    () =>
      towers
        .filter((_, index) => index % 5 === 0)
        .slice(0, 12)
        .map((tower, index) => ({
          x: tower.x + tower.side * 1.8,
          y: tower.height * 0.72 + (index % 3) * 1.1,
          z: tower.z + (index % 2 ? -1.6 : 1.4),
          phase: index * 0.73,
        })),
    [towers],
  );

  useFrame(({ clock }) => {
    const body = meshRef.current;
    const light = lightRef.current;

    if (!body || !light) return;

    const time = clock.elapsedTime;
    const visibility = smoothSegment(progress, 0.08, 0.82);

    drones.forEach((drone, index) => {
      const orbit = time * 0.18 + drone.phase;
      dummy.position.set(
        drone.x + Math.sin(orbit) * 0.6,
        drone.y + Math.sin(orbit * 1.7) * 0.25,
        drone.z + Math.cos(orbit) * 0.8,
      );
      dummy.rotation.set(0.12, orbit, 0);
      dummy.scale.set(0.34, 0.12, 0.2);
      dummy.updateMatrix();
      body.setMatrixAt(index, dummy.matrix);

      dummy.scale.setScalar(0.12 + visibility * 0.08);
      dummy.position.y += 0.04;
      dummy.updateMatrix();
      light.setMatrixAt(index, dummy.matrix);
    });

    body.instanceMatrix.needsUpdate = true;
    light.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, drones.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2b363f" roughness={0.36} metalness={0.72} />
      </instancedMesh>
      <instancedMesh ref={lightRef} args={[undefined, undefined, drones.length]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={NEON_SOFT} transparent opacity={0.62} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </>
  );
}

function CyberpunkTower({
  spec,
  progress,
  index,
  hoverRef,
}: {
  spec: TowerSpec;
  progress: number;
  index: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const archetype = getTowerArchetype(spec, index);
  const profile = ARCHITECTURE_PROFILES[archetype];
  const tint = pickTint(spec.flavor);
  const rows = useMemo(
    () => createWindowBands(spec, index, profile.windowDensity),
    [index, profile.windowDensity, spec],
  );
  const bands = useMechanicalBands(spec, index);
  const rowMaterials = useRef<THREE.MeshBasicMaterial[]>([]);
  const trimMaterials = useRef<THREE.MeshStandardMaterial[]>([]);
  const beaconMaterial = useRef<THREE.MeshBasicMaterial | null>(null);
  const glassMaterial = useRef<THREE.MeshPhysicalMaterial>(null);
  const localActivation = useRef(0);

  const neonRise = smoothSegment(progress, 0.08, 0.5);
  const ghostRise =
    spec.flavor === "ghost" ? smoothSegment(progress, 0.66, 1) : 0;
  const lowerScale = profile.lowerScale;
  const midScale = profile.midScale;
  const crownScale = profile.crownScale;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 0.55 + Math.sin(t * 1.6 + index * 0.41) * 0.45;
    const hover = hoverRef.current;
    const focusZ = -22 - progress * 128 + hover.y * 10;
    const distance =
      Math.pow(spec.x - hover.x * 13, 2) / 140 +
      Math.pow(spec.z - focusZ, 2) / 330;
    const targetActivation = Math.exp(-distance) * Math.min(1, hover.energy);
    localActivation.current +=
      (targetActivation - localActivation.current) * 0.08;

    if (beaconMaterial.current) {
      beaconMaterial.current.opacity =
        0.34 + pulse * 0.34 + ghostRise * 0.1 + localActivation.current * 0.28;
    }

    if (glassMaterial.current) {
      glassMaterial.current.emissiveIntensity =
        0.12 +
        neonRise * 0.2 +
        ghostRise * 0.38 +
        pulse * 0.04 +
        localActivation.current * 0.28;
    }

    trimMaterials.current.forEach((material) => {
      material.emissiveIntensity =
        0.04 + neonRise * 0.05 + ghostRise * 0.08 + localActivation.current * 0.2;
    });

    rowMaterials.current.forEach((material, rowIndex) => {
      const row = rows[rowIndex];
      if (!row) return;

      material.opacity =
        row.opacity +
        neonRise * 0.1 +
        ghostRise * 0.08 +
        localActivation.current * (rowIndex % 3 === 0 ? 0.38 : 0.16) +
        Math.sin(t * 0.85 + row.phase) * 0.035;
    });
  });

  return (
    <group
      position={[spec.x, spec.height * 0.5, spec.z]}
      rotation={[0, spec.side * -0.08, 0]}
    >
      <TowerPodium spec={spec} tint={tint} profile={profile} />

      <mesh position={[0, -spec.height * 0.12, 0]}>
        <boxGeometry
          args={[spec.width * lowerScale, spec.height * 0.68, spec.depth]}
        />
        <meshStandardMaterial
          color={spec.flavor === "ghost" ? "#170a11" : "#0d1118"}
          roughness={0.74}
          metalness={0.24}
          emissive={tint}
          emissiveIntensity={0.05 + neonRise * 0.08 + ghostRise * 0.14}
        />
      </mesh>

      <mesh position={[0, spec.height * 0.1, 0]}>
        <boxGeometry
          args={[spec.width * midScale, spec.height * 0.58, spec.depth * 0.86]}
        />
        <meshPhysicalMaterial
          ref={glassMaterial}
          color={spec.flavor === "ghost" ? "#26101b" : "#102130"}
          roughness={0.16}
          metalness={0.08}
          transmission={0.56}
          transparent
          opacity={0.56}
          emissive={tint}
          emissiveIntensity={0.12 + neonRise * 0.2 + ghostRise * 0.32}
        />
      </mesh>

      {profile.secondaryShaft && (
        <group
          position={[
            spec.side * spec.width * 0.42,
            spec.height * 0.03,
            -spec.depth * 0.18,
          ]}
        >
          <mesh>
            <boxGeometry
              args={[
                spec.width * 0.3,
                spec.height * 0.62,
                spec.depth * 0.48,
              ]}
            />
            <meshStandardMaterial
              color={profile.facade === "fractured" ? "#250c17" : "#111925"}
              roughness={0.54}
              metalness={0.38}
              emissive={tint}
              emissiveIntensity={0.05 + ghostRise * 0.16}
            />
          </mesh>
          <mesh position={[0, 0, spec.depth * 0.255]}>
            <boxGeometry args={[spec.width * 0.24, spec.height * 0.52, 0.08]} />
            <meshBasicMaterial
              color={tint}
              transparent
              opacity={0.08 + neonRise * 0.14 + ghostRise * 0.12}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      <mesh position={[0, spec.height * 0.33, 0]}>
        <boxGeometry
          args={[spec.width * 0.82, 0.18, spec.depth * 1.08]}
        />
        <meshStandardMaterial
          color="#161d26"
          roughness={0.5}
          metalness={0.44}
          emissive={tint}
          emissiveIntensity={0.05 + neonRise * 0.08}
        />
      </mesh>

      <MechanicalFloors spec={spec} tint={tint} bands={bands} />

      <FacadeFrames
        spec={spec}
        tint={tint}
        profile={profile}
        neonRise={neonRise}
        ghostRise={ghostRise}
        trimMaterials={trimMaterials}
      />

      <FacadeDetailModules spec={spec} tint={tint} profile={profile} />

      <EngineeringDetailKit
        spec={spec}
        tint={tint}
        profile={profile}
        neonRise={neonRise}
        ghostRise={ghostRise}
      />

      <mesh position={[0, spec.height * 0.5 + spec.crown * 0.5, 0]}>
        <boxGeometry
          args={[spec.width * crownScale, spec.crown, spec.depth * crownScale]}
        />
        <meshStandardMaterial
          color="#151922"
          roughness={0.44}
          metalness={0.36}
          emissive={tint}
          emissiveIntensity={0.14 + neonRise * 0.18 + ghostRise * 0.14}
        />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * spec.width * 0.51, spec.height * 0.02, 0]}
        >
          <boxGeometry args={[0.1, spec.height * 0.92, spec.depth * 0.92]} />
          <meshBasicMaterial
            color={tint}
            transparent
            opacity={0.18 + neonRise * 0.16 + ghostRise * 0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh
          key={`fin-${side}`}
          position={[side * spec.width * 0.36, spec.height * 0.06, spec.depth * 0.52]}
        >
          <boxGeometry args={[0.08, spec.height * 0.72, 0.16]} />
          <meshStandardMaterial color="#222a34" roughness={0.48} metalness={0.5} />
        </mesh>
      ))}

      {rows.map((row, rowIndex) => {
        const fracture =
          profile.facade === "fractured"
            ? Math.sin(rowIndex * 2.1 + index) * spec.width * 0.12
            : 0;
        const rowHeight = profile.facade === "server-mesh" ? 0.07 : 0.1;

        return (
        <group key={rowIndex}>
          <mesh position={[fracture, row.y, spec.depth * 0.515]}>
            <boxGeometry args={[row.width, rowHeight, 0.08]} />
            <meshBasicMaterial
              ref={(material) => {
                if (material) rowMaterials.current[rowIndex] = material;
              }}
              color={tint}
              transparent
              opacity={row.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[fracture * 0.65, row.y + 0.26, -spec.depth * 0.515]}>
            <boxGeometry args={[row.width * 0.86, rowHeight * 0.8, 0.08]} />
            <meshBasicMaterial
              color={tint}
              transparent
              opacity={row.opacity * 0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
        );
      })}

      {spec.flavor !== "residential" ? (
        <VerticalBillboard spec={spec} tint={tint} progress={progress} />
      ) : null}

      {spec.bridge ? (
        <ServiceBridge spec={spec} tint={NEON_SOFT} neonRise={neonRise} />
      ) : null}

      <RooftopMachinery
        spec={spec}
        tint={tint}
        pulseRef={beaconMaterial}
        profile={profile}
      />
    </group>
  );
}

export function TowerField({
  progress,
  hoverRef,
}: {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const towers = useMemo<TowerSpec[]>(() => {
    const rng = createRng(2026);
    const specs: TowerSpec[] = [];
    let z = -12;

    for (let row = 0; row < 16; row += 1) {
      z -= range(rng, 8.4, 12.8);
      const sequence = row / 15;
      const commercialRise = Math.min(1, Math.max(0, (sequence - 0.08) / 0.3));
      const coreRise = Math.min(1, Math.max(0, (sequence - 0.34) / 0.34));
      const ghostRise = Math.min(1, Math.max(0, (sequence - 0.64) / 0.3));
      const flavorRoll = rng();
      const flavor: TowerSpec["flavor"] =
        flavorRoll < ghostRise * 0.72
          ? "ghost"
          : flavorRoll < ghostRise * 0.72 + coreRise * 0.58
            ? "core"
            : flavorRoll <
                ghostRise * 0.72 + coreRise * 0.58 + commercialRise * 0.74
              ? "market"
              : "residential";
      const heightLift = coreRise * 13 - ghostRise * 5;

      ([-1, 1] as const).forEach((side, column) => {
        specs.push({
          x:
            side * range(rng, 10.5, row > 10 ? 19 : 15.8) +
            column * range(rng, 0.3, 1.8),
          z,
          width: range(rng, 2.2, 5.2),
          depth: range(rng, 2.2, 5.6),
          height: range(rng, 13 + coreRise * 3, 23 + heightLift),
          crown: range(rng, 1.4, 4.8),
          side,
          flavor,
          bridge: rng() > 0.72,
        });
      });

      if (row % 4 === 1 || row === 11) {
        const side = rng() > 0.5 ? -1 : 1;

        specs.push({
          x: side * range(rng, 7.6, 10.4),
          z: z + range(rng, -2.8, 2.8),
          width: range(rng, 2, 3.6),
          depth: range(rng, 2.4, 4.2),
          height: range(rng, 11 + coreRise * 2, 18 + heightLift * 0.7),
          crown: range(rng, 1.2, 3.6),
          side,
          flavor,
          bridge: rng() > 0.58,
        });
      }
    }

    return specs;
  }, []);

  return (
    <group>
      {towers.map((tower, index) => (
        <CyberpunkTower
          key={index}
          spec={tower}
          progress={progress}
          index={index}
          hoverRef={hoverRef}
        />
      ))}
      <MaintenanceDroneField towers={towers} progress={progress} />
      <BuildingConnections
        towers={towers}
        progress={progress}
        hoverRef={hoverRef}
      />
    </group>
  );
}
