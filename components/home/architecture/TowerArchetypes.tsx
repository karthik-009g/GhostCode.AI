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
  type TowerSpec,
} from "../shared";

type TowerArchetype =
  | "stepped-core"
  | "glass-spine"
  | "podium-stack"
  | "breach-tower";

type FacadeRow = {
  y: number;
  width: number;
  opacity: number;
  phase: number;
};

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

function pickArchetype(spec: TowerSpec, index: number): TowerArchetype {
  if (spec.flavor === "ghost") return "breach-tower";
  if (spec.flavor === "residential") return "podium-stack";
  if ((index + spec.side) % 3 === 0) return "glass-spine";
  return "stepped-core";
}

function useFacadeRows(spec: TowerSpec, index: number) {
  return useMemo<FacadeRow[]>(() => {
    const rng = createRng(index * 911 + Math.floor(spec.height * 37));
    const count = Math.max(7, Math.floor(spec.height / 2.4));

    return Array.from({ length: count }, (_, row) => ({
      y: -spec.height * 0.38 + row * (spec.height / count),
      width: spec.width * range(rng, 0.54, 0.86),
      opacity: range(rng, 0.08, 0.3),
      phase: range(rng, 0, Math.PI * 2),
    }));
  }, [index, spec.height, spec.width]);
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
}: {
  spec: TowerSpec;
  tint: string;
}) {
  return (
    <group position={[0, -spec.height * 0.5 + 0.5, 0]}>
      <mesh>
        <boxGeometry args={[spec.width * 1.32, 1, spec.depth * 1.18]} />
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
    </group>
  );
}

function RooftopMachinery({
  spec,
  tint,
  pulseRef,
}: {
  spec: TowerSpec;
  tint: string;
  pulseRef: MutableRefObject<THREE.MeshBasicMaterial | null>;
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
  archetype,
  neonRise,
  ghostRise,
}: {
  spec: TowerSpec;
  tint: string;
  archetype: TowerArchetype;
  neonRise: number;
  ghostRise: number;
}) {
  const columnCount = archetype === "glass-spine" ? 4 : 3;

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
            color="#1d2530"
            roughness={0.48}
            metalness={0.5}
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

function CyberpunkTower({
  spec,
  progress,
  index,
}: {
  spec: TowerSpec;
  progress: number;
  index: number;
}) {
  const archetype = pickArchetype(spec, index);
  const tint = pickTint(spec.flavor);
  const rows = useFacadeRows(spec, index);
  const bands = useMechanicalBands(spec, index);
  const rowMaterials = useRef<THREE.MeshBasicMaterial[]>([]);
  const beaconMaterial = useRef<THREE.MeshBasicMaterial | null>(null);
  const glassMaterial = useRef<THREE.MeshPhysicalMaterial>(null);

  const neonRise = smoothSegment(progress, 0.08, 0.5);
  const ghostRise =
    spec.flavor === "ghost" ? smoothSegment(progress, 0.66, 1) : 0;
  const lowerScale = archetype === "podium-stack" ? 1.08 : 1;
  const midScale =
    archetype === "glass-spine" ? 0.78 : archetype === "breach-tower" ? 0.88 : 0.9;
  const crownScale =
    archetype === "stepped-core" ? 0.54 : archetype === "glass-spine" ? 0.42 : 0.64;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 0.55 + Math.sin(t * 1.6 + index * 0.41) * 0.45;

    if (beaconMaterial.current) {
      beaconMaterial.current.opacity = 0.48 + pulse * 0.42 + ghostRise * 0.1;
    }

    if (glassMaterial.current) {
      glassMaterial.current.emissiveIntensity =
        0.12 + neonRise * 0.2 + ghostRise * 0.38 + pulse * 0.04;
    }

    rowMaterials.current.forEach((material, rowIndex) => {
      const row = rows[rowIndex];
      if (!row) return;

      material.opacity =
        row.opacity +
        neonRise * 0.1 +
        ghostRise * 0.08 +
        Math.sin(t * 0.85 + row.phase) * 0.035;
    });
  });

  return (
    <group
      position={[spec.x, spec.height * 0.5, spec.z]}
      rotation={[0, spec.side * -0.08, 0]}
    >
      <TowerPodium spec={spec} tint={tint} />

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
        archetype={archetype}
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

      {rows.map((row, rowIndex) => (
        <group key={rowIndex}>
          <mesh position={[0, row.y, spec.depth * 0.515]}>
            <boxGeometry args={[row.width, 0.1, 0.08]} />
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
          <mesh position={[0, row.y + 0.26, -spec.depth * 0.515]}>
            <boxGeometry args={[row.width * 0.86, 0.08, 0.08]} />
            <meshBasicMaterial
              color={tint}
              transparent
              opacity={row.opacity * 0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {spec.flavor !== "residential" ? (
        <VerticalBillboard spec={spec} tint={tint} progress={progress} />
      ) : null}

      {spec.bridge ? (
        <ServiceBridge spec={spec} tint={NEON_SOFT} neonRise={neonRise} />
      ) : null}

      <RooftopMachinery spec={spec} tint={tint} pulseRef={beaconMaterial} />
    </group>
  );
}

export function TowerField({ progress }: { progress: number }) {
  const towers = useMemo<TowerSpec[]>(() => {
    const rng = createRng(2026);
    const specs: TowerSpec[] = [];

    for (let row = 0; row < 16; row += 1) {
      const z = -12 - row * 10.5;
      const flavor: TowerSpec["flavor"] =
        row > 11
          ? "ghost"
          : row > 8
            ? "core"
            : row > 4
              ? "market"
              : "residential";

      ([-1, 1] as const).forEach((side, column) => {
        specs.push({
          x: side * range(rng, 10.5, row > 10 ? 18.5 : 15.5) + column * 1.2,
          z,
          width: range(rng, 2.2, 5.2),
          depth: range(rng, 2.2, 5.6),
          height: range(rng, row < 3 ? 18 : 12, row > 8 ? 34 : 28),
          crown: range(rng, 1.4, 4.8),
          side,
          flavor,
          bridge: rng() > 0.72,
        });
      });
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
        />
      ))}
    </group>
  );
}
