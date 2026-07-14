import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  NEON_SOFT,
  type HoverState,
  type TowerSpec,
} from "../shared";

type Connection = {
  from: TowerSpec;
  to: TowerSpec;
  curve: THREE.CatmullRomCurve3;
  midpoint: THREE.Vector3;
  length: number;
  angle: number;
  isBridge: boolean;
};

export function BuildingConnections({
  towers,
  progress,
  hoverRef,
}: {
  towers: TowerSpec[];
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
}) {
  const connections = useMemo<Connection[]>(() => {
    const sources = towers.filter((tower) => tower.bridge).slice(0, 6);
    const links: Connection[] = [];

    sources.forEach((from, sourceIndex) => {
      const target = towers
        .filter(
          (candidate) =>
            candidate !== from &&
            candidate.side === from.side &&
            Math.abs(candidate.z - from.z) < 30,
        )
        .sort(
          (a, b) =>
            Math.abs(a.z - from.z) - Math.abs(b.z - from.z),
        )[0];

      if (!target) return;

      const fromY = Math.min(from.height * 0.68, 15);
      const toY = Math.min(target.height * 0.68, 15);
      const start = new THREE.Vector3(from.x, fromY, from.z);
      const end = new THREE.Vector3(target.x, toY, target.z);
      const midpoint = start.clone().lerp(end, 0.5);
      const span = start.distanceTo(end);
      const isBridge = sourceIndex % 3 === 0;
      const arch = midpoint.clone();
      arch.y += isBridge ? 0.18 : 1.3;

      links.push({
        from,
        to: target,
        curve: new THREE.CatmullRomCurve3([start, arch, end]),
        midpoint,
        length: span,
        angle: Math.atan2(end.x - start.x, end.z - start.z),
        isBridge,
      });
    });

    return links;
  }, [towers]);
  const materials = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame(() => {
    const hover = hoverRef.current;
    const focusZ = -22 - progress * 128 + hover.y * 10;

    connections.forEach((connection, index) => {
      const material = materials.current[index];

      if (!material) return;

      const distance =
        Math.pow(connection.midpoint.x - hover.x * 13, 2) / 150 +
        Math.pow(connection.midpoint.z - focusZ, 2) / 360;
      material.emissiveIntensity = 0.05 + Math.exp(-distance) * hover.energy * 0.42;
    });
  });

  return (
    <group>
      {connections.map((connection, index) => (
        <group key={`${connection.from.x}-${connection.from.z}-${index}`}>
          <mesh>
            <tubeGeometry args={[connection.curve, 12, 0.045, 6, false]} />
            <meshStandardMaterial
              ref={(material) => {
                if (material) materials.current[index] = material;
              }}
              color="#263640"
              roughness={0.38}
              metalness={0.7}
              emissive={NEON_SOFT}
              emissiveIntensity={0.06}
            />
          </mesh>
          {connection.isBridge && (
            <group
              position={[connection.midpoint.x, connection.midpoint.y - 0.18, connection.midpoint.z]}
              rotation={[0, connection.angle, 0]}
            >
              <mesh>
                <boxGeometry args={[0.9, 0.14, connection.length * 0.58]} />
                <meshStandardMaterial
                  color="#172029"
                  roughness={0.56}
                  metalness={0.44}
                />
              </mesh>
              {[-0.36, 0.36].map((x) => (
                <mesh key={x} position={[x, 0.22, 0]}>
                  <boxGeometry args={[0.04, 0.42, connection.length * 0.56]} />
                  <meshBasicMaterial
                    color={NEON_SOFT}
                    transparent
                    opacity={0.16}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}
    </group>
  );
}
