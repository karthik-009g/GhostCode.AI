"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  GHOST,
  GHOST_SOFT,
  NEON,
  NEON_SOFT,
  WARM,
  createRng,
  range,
  smoothSegment,
} from "../shared";
import type { RepositorySnapshot } from "./types";

type SoftwareDistrictsProps = {
  progress: number;
  snapshot: RepositorySnapshot;
};

type DistrictProps = SoftwareDistrictsProps & {
  start: number;
  end: number;
  z: number;
};

function SoftwareCorridor({ progress }: { progress: number }) {
  const pulse = smoothSegment(progress, 0.56, 0.98);

  return (
    <group position={[0, 0.08, -582]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 640]} />
        <meshStandardMaterial color="#060d13" roughness={0.32} metalness={0.38} />
      </mesh>
      {[-5.1, -2.4, 2.4, 5.1].map((x, index) => (
        <mesh key={x} position={[x, 0.04, 0]}>
          <boxGeometry args={[index % 3 === 0 ? 0.12 : 0.06, 0.04, 634]} />
          <meshBasicMaterial
            color={index % 3 === 0 ? WARM : NEON_SOFT}
            transparent
            opacity={0.05 + pulse * 0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {Array.from({ length: 22 }, (_, index) => (
        <mesh key={index} position={[0, 0.05, 298 - index * 28]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14.6, 0.07]} />
          <meshBasicMaterial
            color={index % 4 === 0 ? WARM : NEON_SOFT}
            transparent
            opacity={0.04 + pulse * 0.11}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function DataPackets({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const specs = useMemo(() => {
    const rng = createRng(426);
    return Array.from({ length: 46 }, (_, index) => ({
      lane: [-5.1, -2.4, 2.4, 5.1][index % 4]!,
      phase: range(rng, 0, 1),
      speed: range(rng, 0.045, 0.11),
      lift: range(rng, 0.18, 1.2),
    }));
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh || progress < 0.56) return;

    const time = clock.elapsedTime;
    specs.forEach((spec, index) => {
      const travel = (spec.phase + time * spec.speed) % 1;
      dummy.position.set(spec.lane, spec.lift + Math.sin(time * 1.7 + index) * 0.08, -260 - travel * 640);
      dummy.scale.set(0.12, 0.12, 0.46 + (index % 3) * 0.1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, specs.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={NEON_SOFT} transparent opacity={0.78} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

function RepositoryGateway({ progress }: { progress: number }) {
  const rise = smoothSegment(progress, 0.56, 0.64);
  const cubeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!cubeRef.current) return;
    cubeRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.16;
    cubeRef.current.position.y = 14 + Math.sin(clock.elapsedTime * 0.42) * 0.32;
  });

  return (
    <group visible={progress > 0.53 && progress < 0.69} position={[0, 0, -278]}>
      <group ref={cubeRef}>
        <mesh>
          <boxGeometry args={[9.5, 9.5, 9.5]} />
          <meshPhysicalMaterial
            color="#102936"
            roughness={0.08}
            metalness={0.22}
            transmission={0.48}
            transparent
            opacity={0.62}
            emissive={NEON_SOFT}
            emissiveIntensity={rise * 0.16}
          />
        </mesh>
        {[-1, 1].map((axis) => (
          <mesh key={axis} position={[0, axis * 5.1, 0]}>
            <boxGeometry args={[12.5, 0.08, 12.5]} />
            <meshBasicMaterial
              color={axis < 0 ? WARM : NEON_SOFT}
              transparent
              opacity={rise * 0.24}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
        {[0, Math.PI / 2].map((rotation) => (
          <mesh key={rotation} rotation={[0, rotation, 0]}>
            <boxGeometry args={[0.08, 12.2, 12.2]} />
            <meshBasicMaterial
              color={NEON_SOFT}
              transparent
              opacity={rise * 0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 4.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13, 13.18, 96]} />
        <meshBasicMaterial
          color={NEON_SOFT}
          transparent
          opacity={rise * 0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FolderDistrict({ progress, snapshot, start, end, z }: DistrictProps) {
  const rise = smoothSegment(progress, start - 0.02, end);

  return (
    <group visible={progress > start - 0.08 && progress < end + 0.14}>
      {snapshot.nodes.map((node, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const floors = 5 + Math.round(node.weight * 7);
        const height = floors * 1.15;
        const x = side * (8.5 + (index % 3) * 3.2);
        const nodeZ = z - Math.floor(index / 2) * 12;
        const color = node.kind === "service" ? WARM : NEON;
        const rooms = Math.max(3, Math.round(node.weight * 8));

        return (
          <group key={node.id} position={[x, height * 0.5, nodeZ]}>
            <mesh>
              <boxGeometry args={[3.2, height, 3.5]} />
              <meshStandardMaterial color="#111e28" roughness={0.34} metalness={0.66} emissive={color} emissiveIntensity={rise * 0.08} />
            </mesh>
            <mesh position={[0, 0, 1.78]}>
              <boxGeometry args={[2.56, height * 0.82, 0.06]} />
              <meshBasicMaterial color={color} transparent opacity={rise * 0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            {Array.from({ length: floors }, (_, floor) => (
              <mesh key={floor} position={[0, -height * 0.42 + floor * 1.15, 1.84]}>
                <boxGeometry args={[2.72, 0.07, 0.04]} />
                <meshBasicMaterial color={floor % 3 === 0 ? WARM : NEON_SOFT} transparent opacity={rise * 0.34} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
            ))}
            {Array.from({ length: rooms }, (_, room) => (
              <mesh
                key={`room-${room}`}
                position={[
                  -0.92 + (room % 3) * 0.92,
                  -height * 0.32 + Math.floor(room / 3) * 1.28,
                  1.91,
                ]}
              >
                <boxGeometry args={[0.44, 0.34, 0.05]} />
                <meshBasicMaterial
                  color={room % 4 === 0 ? WARM : NEON_SOFT}
                  transparent
                  opacity={rise * (0.28 + node.weight * 0.24)}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            ))}
            <mesh position={[0, height * 0.5 + 0.48, 0]}>
              <boxGeometry args={[3.8, 0.38, 4.1]} />
              <meshStandardMaterial color="#222a32" roughness={0.4} metalness={0.54} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 11, z - 8]} rotation={[0, 0, 0]}>
        <boxGeometry args={[18, 0.1, 0.1]} />
        <meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.34} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function DependencyCathedral({ progress, snapshot, start, end, z }: DistrictProps) {
  const rise = smoothSegment(progress, start - 0.03, end);
  const graph = useMemo(() => {
    const nodes = snapshot.nodes.map((node, index) => ({
      id: node.id,
      x: (index - (snapshot.nodes.length - 1) * 0.5) * 6.1,
      y: 15 + (index % 3) * 4.2,
      z: z - (index % 2) * 7,
    }));
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const vertices: number[] = [];
    snapshot.dependencies.forEach((dependency) => {
      const from = byId.get(dependency.from);
      const to = byId.get(dependency.to);
      if (from && to) vertices.push(from.x, from.y, from.z, to.x, to.y, to.z);
    });
    return { nodes, vertices: new Float32Array(vertices) };
  }, [snapshot, z]);

  return (
    <group visible={progress > start - 0.08 && progress < end + 0.1}>
      <group position={[0, 19, z - 3]}>
        {[11, 15, 19].map((radius, index) => (
          <mesh key={radius} rotation={[Math.PI / 2.25, 0, index * 0.18]}>
            <ringGeometry args={[radius, radius + 0.12, 96]} />
            <meshBasicMaterial
              color={index === 1 ? WARM : NEON_SOFT}
              transparent
              opacity={rise * (0.18 + index * 0.05)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        <mesh>
          <icosahedronGeometry args={[3.8, 1]} />
          <meshPhysicalMaterial
            color="#0d2630"
            roughness={0.12}
            metalness={0.42}
            transmission={0.28}
            transparent
            opacity={0.72}
            emissive={NEON}
            emissiveIntensity={rise * 0.16}
          />
        </mesh>
      </group>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[graph.vertices, 3]} /></bufferGeometry>
        <lineBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.55} />
      </lineSegments>
      {graph.nodes.map((node, index) => (
        <group key={node.id} position={[node.x, node.y, node.z]}>
          <mesh><octahedronGeometry args={[0.76 + (index % 2) * 0.18, 1]} /><meshBasicMaterial color={index % 3 === 0 ? WARM : NEON_SOFT} transparent opacity={rise * 0.9} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
          <mesh position={[0, -node.y * 0.5, 0]}><cylinderGeometry args={[0.04, 0.04, node.y, 6]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.18} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
        </group>
      ))}
      <mesh position={[0, 26, z - 4]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[9, 9.12, 64]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.36} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
    </group>
  );
}

function ServiceMetropolis({ progress, snapshot, start, end, z }: DistrictProps) {
  const rise = smoothSegment(progress, start - 0.02, end);
  const bridges = snapshot.services.slice(0, -1);

  return (
    <group visible={progress > start - 0.08 && progress < end + 0.11}>
      {snapshot.services.map((service, index) => {
        const x = (index - (snapshot.services.length - 1) * 0.5) * 7;
        const height = 16 + (index % 3) * 5;
        return <group key={service} position={[x, height * 0.5, z - (index % 2) * 7]}>
          <mesh><cylinderGeometry args={[1.7, 2.2, height, 10]} /><meshStandardMaterial color="#102632" roughness={0.26} metalness={0.76} emissive={index % 2 ? WARM : NEON} emissiveIntensity={rise * 0.12} /></mesh>
          {[0.2, 0.45, 0.7].map((level) => <mesh key={level} position={[0, -height * 0.5 + height * level, 0]}><torusGeometry args={[2.3, 0.05, 6, 32]} /><meshBasicMaterial color={index % 2 ? WARM : NEON_SOFT} transparent opacity={rise * 0.52} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>)}
          <mesh position={[0, height * 0.5 + 2.5, 0]}>
            <cylinderGeometry args={[0.12, 0.3, 5, 8]} />
            <meshBasicMaterial color={index % 2 ? WARM : NEON_SOFT} transparent opacity={rise * 0.58} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>;
      })}
      {bridges.map((service, index) => <mesh key={service} position={[-7 + index * 7, 13, z - 3.5]} rotation={[0, 0, 0]}><boxGeometry args={[5.3, 0.12, 0.16]} /><meshBasicMaterial color={WARM} transparent opacity={rise * 0.4} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>)}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 9.8, 7.5, z - 3]} rotation={[0, 0, side * 0.08]}>
          <boxGeometry args={[0.16, 0.16, 38]} />
          <meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.24} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function ExecutionLayer({ progress, start, end, z }: Omit<DistrictProps, "snapshot">) {
  const rotorRef = useRef<THREE.Group>(null);
  const rise = smoothSegment(progress, start - 0.02, end);
  useFrame((state) => {
    if (rotorRef.current) rotorRef.current.rotation.z = state.clock.elapsedTime * 0.34;
  });

  return <group visible={progress > start - 0.07 && progress < end + 0.12} position={[0, 10, z]}>
    <group ref={rotorRef}>{[5, 8, 11].map((radius, index) => <mesh key={radius} rotation={[0.35 + index * 0.26, 0, index * 0.6]}><torusGeometry args={[radius, 0.16, 8, 48]} /><meshBasicMaterial color={index === 1 ? WARM : NEON_SOFT} transparent opacity={rise * 0.44} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>)}</group>
    <mesh><cylinderGeometry args={[3.2, 4.2, 18, 12]} /><meshStandardMaterial color="#132936" roughness={0.25} metalness={0.8} emissive={NEON} emissiveIntensity={rise * 0.14} /></mesh>
    {[-1, 1].map((side) => <mesh key={side} position={[side * 11, 1, 0]} rotation={[0, 0, side * 0.2]}><boxGeometry args={[1.3, 14, 2.2]} /><meshStandardMaterial color="#17212a" roughness={0.42} metalness={0.62} emissive={WARM} emissiveIntensity={rise * 0.08} /></mesh>)}
    <mesh position={[0, -8.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[6.4, 13.4, 10]} />
      <meshStandardMaterial color="#18242d" roughness={0.5} metalness={0.62} emissive={NEON} emissiveIntensity={rise * 0.08} />
    </mesh>
    {Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * Math.PI * 2;
      return (
        <mesh key={index} position={[Math.cos(angle) * 7.7, -1.6, Math.sin(angle) * 7.7]}>
          <boxGeometry args={[0.46, 13.2, 0.46]} />
          <meshStandardMaterial color="#22303a" roughness={0.46} metalness={0.56} emissive={NEON_SOFT} emissiveIntensity={rise * 0.05} />
        </mesh>
      );
    })}
  </group>;
}

function IntelligenceArray({ progress, start, end, z }: Omit<DistrictProps, "snapshot">) {
  const rise = smoothSegment(progress, start - 0.02, end);
  return <group visible={progress > start - 0.07 && progress < end + 0.12} position={[0, 12, z]}>
    {Array.from({ length: 7 }, (_, index) => <group key={index} position={[(index - 3) * 4.6, Math.abs(index - 3) * 0.7, -Math.abs(index - 3) * 1.2]} rotation={[0, index * 0.12, 0]}>
      <mesh><boxGeometry args={[3.2, 14 - Math.abs(index - 3) * 1.2, 0.24]} /><meshBasicMaterial color={index === 3 ? NEON_SOFT : "#3c6068"} transparent opacity={rise * (index === 3 ? 0.54 : 0.26)} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <mesh position={[0, 0, 0.22]}><boxGeometry args={[2.3, 0.05, 0.03]} /><meshBasicMaterial color={WARM} transparent opacity={rise * 0.65} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
    </group>)}
    <mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[15, 15.1, 80]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.3} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
  </group>;
}

function GhostRepositoryDistrict({ progress, snapshot, start, end, z }: DistrictProps) {
  const rise = smoothSegment(progress, start - 0.02, end);
  const abandoned = snapshot.issues.slice(0, 4);
  const ghostRef = useRef<THREE.Group[]>([]);

  useFrame(({ clock }) => {
    ghostRef.current.forEach((ghost, index) => {
      if (!ghost) return;
      ghost.position.y = Math.sin(clock.elapsedTime * 0.72 + index) * 0.38;
      ghost.rotation.y = Math.sin(clock.elapsedTime * 0.5 + index) * 0.5;
    });
  });

  return <group visible={progress > start - 0.07 && progress < end + 0.13}>
    {abandoned.map((issue, index) => {
      const x = index % 2 === 0 ? -9 : 9;
      const towerZ = z - Math.floor(index / 2) * 16;
      const floors = 4 + Math.round(issue.severity * 4);
      return <group key={issue.id} position={[x, 8, towerZ]} rotation={[0, index * 0.14, index % 2 ? -0.08 : 0.08]}>
        <mesh><boxGeometry args={[5.2, 17, 4]} /><meshStandardMaterial color="#190d16" roughness={0.5} metalness={0.48} emissive={GHOST} emissiveIntensity={rise * 0.11} /></mesh>
        {Array.from({ length: floors }, (_, floor) => <group key={floor} position={[0, -6.6 + floor * 2.15, 2.08]}>
          <mesh><boxGeometry args={[4.5, 0.12, 0.08]} /><meshBasicMaterial color={floor % 2 ? GHOST_SOFT : "#5f3948"} transparent opacity={rise * 0.46} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
          <mesh position={[(floor % 2 ? -1 : 1) * 1.25, 0.5, 0]}><octahedronGeometry args={[0.26, 0]} /><meshBasicMaterial color={GHOST_SOFT} transparent opacity={rise * 0.78} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
          <mesh position={[0, 0.85, 0]}><boxGeometry args={[2.6, 0.04, 0.03]} /><meshBasicMaterial color={GHOST} transparent opacity={rise * 0.54} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
        </group>)}
        <mesh position={[0, 4.4, 2.15]} rotation={[0.18, 0, 0]}><planeGeometry args={[3.8, 2.6]} /><meshBasicMaterial color="#30131e" transparent opacity={rise * 0.3} side={THREE.DoubleSide} /></mesh>
        <group
          position={[index % 2 ? -1.4 : 1.4, 2.8, 2.45]}
          ref={(group) => {
            if (group) ghostRef.current[index] = group;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.42, 14, 10]} />
            <meshBasicMaterial color={GHOST_SOFT} transparent opacity={rise * 0.58} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <coneGeometry args={[0.48, 1.25, 10, 1, true]} />
            <meshBasicMaterial color={GHOST} transparent opacity={rise * 0.28} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.48, 0.12, 0]}>
            <boxGeometry args={[0.9, 0.05, 0.04]} />
            <meshBasicMaterial color={GHOST_SOFT} transparent opacity={rise * 0.44} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
        <mesh position={[0.6, -3.2, 2.28]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.12, 7.2, 0.08]} />
          <meshBasicMaterial color={GHOST} transparent opacity={rise * 0.32} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>;
    })}
  </group>;
}

function ArchiveAndRecovery({ progress, start, end, z }: Omit<DistrictProps, "snapshot">) {
  const rise = smoothSegment(progress, start - 0.02, end);
  return <group visible={progress > start - 0.06 && progress < end + 0.13} position={[0, 8, z]}>
    {Array.from({ length: 9 }, (_, index) => <group key={index} position={[(index - 4) * 3.7, (index % 2) * 2.3, -(index % 3) * 2.1]} rotation={[0, index * 0.1, 0]}>
      <mesh><boxGeometry args={[2.5, 10 + (index % 3) * 3, 2.4]} /><meshStandardMaterial color={index < 5 ? "#17161d" : "#10242a"} roughness={0.5} metalness={0.54} emissive={index < 5 ? GHOST : NEON} emissiveIntensity={rise * 0.08} /></mesh>
      <mesh position={[0, 0, 1.24]}><boxGeometry args={[1.92, 5.4, 0.05]} /><meshBasicMaterial color={index < 5 ? GHOST_SOFT : NEON_SOFT} transparent opacity={rise * 0.25} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      {index > 3 ? (
        <mesh position={[0, 7.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.55, 1.64, 36]} />
          <meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ) : null}
    </group>)}
    <mesh position={[0, 13, 0]}><boxGeometry args={[30, 0.14, 0.14]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.42} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
    <mesh position={[0, 15.5, -1.4]} rotation={[0, 0, 0]}>
      <boxGeometry args={[36, 0.08, 0.08]} />
      <meshBasicMaterial color={WARM} transparent opacity={rise * 0.24} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  </group>;
}

function AnalysisCore({ progress, start, end, z }: Omit<DistrictProps, "snapshot">) {
  const groupRef = useRef<THREE.Group>(null);
  const rise = smoothSegment(progress, start - 0.02, end);
  useFrame((state) => { if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.12; });
  return <group visible={progress > start - 0.06 && progress < end + 0.12} position={[0, 16, z]}>
    <group ref={groupRef}><mesh><icosahedronGeometry args={[6.4, 2]} /><meshStandardMaterial color="#0d2a33" roughness={0.18} metalness={0.76} emissive={NEON} emissiveIntensity={rise * 0.18} /></mesh>{[9, 13, 17].map((radius, index) => <mesh key={radius} rotation={[index * 0.64, 0.3, index * 0.4]}><torusGeometry args={[radius, 0.09, 8, 64]} /><meshBasicMaterial color={index === 1 ? WARM : NEON_SOFT} transparent opacity={rise * 0.34} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>)}</group>
  </group>;
}

function FutureHorizon({ progress, start, end, z }: Omit<DistrictProps, "snapshot">) {
  const rise = smoothSegment(progress, start - 0.02, end);
  return <group visible={progress > start - 0.06} position={[0, 17, z]}>
    {[-1, 1].map((side) => <group key={side} position={[side * 15, 0, 0]} rotation={[0, side * 0.22, 0]}><mesh><boxGeometry args={[7, 28, 5]} /><meshPhysicalMaterial color="#10313a" roughness={0.12} metalness={0.5} transmission={0.25} transparent opacity={0.68} emissive={NEON_SOFT} emissiveIntensity={rise * 0.1} /></mesh><mesh position={[0, 0, 2.55]}><boxGeometry args={[5.2, 21, 0.06]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.2} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh></group>)}
    {[12, 20, 29, 39].map((radius, index) => <mesh key={radius} rotation={[Math.PI / 2.3, 0, index * 0.18]}><ringGeometry args={[radius, radius + 0.13, 96]} /><meshBasicMaterial color={index === 3 ? GHOST_SOFT : NEON_SOFT} transparent opacity={rise * (0.15 + index * 0.04)} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>)}
    <mesh position={[0, 18, -10]}><cylinderGeometry args={[0.18, 0.5, 52, 12]} /><meshBasicMaterial color={NEON_SOFT} transparent opacity={rise * 0.42} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
  </group>;
}

export function SoftwareDistricts({ progress, snapshot }: SoftwareDistrictsProps) {
  return <>
    <SoftwareCorridor progress={progress} />
    <DataPackets progress={progress} />
    <RepositoryGateway progress={progress} />
    <FolderDistrict progress={progress} snapshot={snapshot} start={0.57} end={0.65} z={-278} />
    <DependencyCathedral progress={progress} snapshot={snapshot} start={0.64} end={0.71} z={-354} />
    <ServiceMetropolis progress={progress} snapshot={snapshot} start={0.7} end={0.77} z={-432} />
    <ExecutionLayer progress={progress} start={0.76} end={0.82} z={-500} />
    <IntelligenceArray progress={progress} start={0.81} end={0.87} z={-550} />
    <GhostRepositoryDistrict progress={progress} snapshot={snapshot} start={0.86} end={0.915} z={-592} />
    <ArchiveAndRecovery progress={progress} start={0.905} end={0.94} z={-642} />
    <AnalysisCore progress={progress} start={0.93} end={0.965} z={-695} />
    <ArchiveAndRecovery progress={progress} start={0.955} end={0.982} z={-760} />
    <FutureHorizon progress={progress} start={0.975} end={1} z={-842} />
  </>;
}
