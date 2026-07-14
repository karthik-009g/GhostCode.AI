"use client";

import { useMemo } from "react";

type SkylineLayer = {
  z: number;
  count: number;
  opacity: number;
  color: string;
  heightRange: [number, number];
  widthRange: [number, number];
  xRange: [number, number];
};

function createRng(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function range(rng: () => number, min: number, max: number) {
  return min + (max - min) * rng();
}

function SkylineLayerMesh({
  layer,
  seed,
}: {
  layer: SkylineLayer;
  seed: number;
}) {
  const entries = useMemo(() => {
    const rng = createRng(seed);
    return Array.from({ length: layer.count }, () => ({
      x: range(rng, layer.xRange[0], layer.xRange[1]),
      height: range(rng, layer.heightRange[0], layer.heightRange[1]),
      width: range(rng, layer.widthRange[0], layer.widthRange[1]),
    }));
  }, [layer, seed]);

  return (
    <group position={[0, 0, layer.z]}>
      {entries.map((entry, index) => (
        <mesh
          key={index}
          position={[entry.x, entry.height * 0.5, 0]}
        >
          <boxGeometry args={[entry.width, entry.height, entry.width * 0.84]} />
          <meshBasicMaterial
            color={layer.color}
            transparent
            opacity={layer.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Skyline() {
  const layers: SkylineLayer[] = [
    {
      z: -120,
      count: 24,
      opacity: 0.45,
      color: "#081017",
      heightRange: [10, 44],
      widthRange: [1.1, 4.6],
      xRange: [-78, 78],
    },
    {
      z: -220,
      count: 30,
      opacity: 0.32,
      color: "#060c12",
      heightRange: [14, 70],
      widthRange: [1.2, 6.5],
      xRange: [-96, 96],
    },
    {
      z: -360,
      count: 34,
      opacity: 0.2,
      color: "#04090d",
      heightRange: [18, 92],
      widthRange: [1.6, 7.8],
      xRange: [-120, 120],
    },
    {
      z: -560,
      count: 42,
      opacity: 0.12,
      color: "#05070b",
      heightRange: [16, 120],
      widthRange: [1.8, 10.2],
      xRange: [-150, 150],
    },
  ];

  return (
    <group>
      {layers.map((layer, index) => (
        <SkylineLayerMesh
          key={index}
          layer={layer}
          seed={91 + index * 17}
        />
      ))}

      <mesh position={[0, 42, -220]}>
        <boxGeometry args={[64, 84, 10]} />
        <meshBasicMaterial
          color="#04070b"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[-62, 26, -340]}>
        <boxGeometry args={[32, 52, 8]} />
        <meshBasicMaterial
          color="#04070b"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[58, 34, -420]}>
        <boxGeometry args={[36, 68, 8]} />
        <meshBasicMaterial
          color="#04070b"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 18, -640]}>
        <planeGeometry args={[320, 160]} />
        <meshBasicMaterial
          color="#020408"
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
