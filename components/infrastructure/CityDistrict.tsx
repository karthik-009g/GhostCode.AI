"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type DistrictTheme =
  | "core"
  | "financial"
  | "research"
  | "residential"
  | "industrial"
  | "ghost";

export interface CityDistrictProps {
  theme: DistrictTheme;
  origin: [number, number, number];
  seed: number;
  width?: number;
  depth?: number;
}

type Palette = {
  body: string;
  glass: string;
  glow: string;
  trim: string;
  accent: string;
  base: string;
  roof: string;
};

type BuildingSpec = {
  position: [number, number, number];
  size: [number, number, number];
  rotationY: number;
  palette: Palette;
  style: DistrictTheme;
  billboard: boolean;
  antenna: boolean;
  roofBeacon: boolean;
  shellOpacity: number;
  windowDensity: number;
  darkFloorChance: number;
};

type DistrictPreset = {
  buildings: number;
  heightRange: [number, number];
  widthRange: [number, number];
  depthRange: [number, number];
  xSpread: number;
  zSpread: number;
  streetGap: number;
  baseHeight: number;
  shellOpacity: number;
  windowDensity: number;
  darkFloorChance: number;
  billboardChance: number;
  antennaChance: number;
  roofBeaconChance: number;
  bridgeCount: number;
  palette: Palette;
};

const DISTRICT_PRESETS: Record<DistrictTheme, DistrictPreset> = {
  core: {
    buildings: 18,
    heightRange: [16, 46],
    widthRange: [1.6, 4.0],
    depthRange: [1.5, 4.2],
    xSpread: 14,
    zSpread: 54,
    streetGap: 3.3,
    baseHeight: 0.9,
    shellOpacity: 0.1,
    windowDensity: 0.95,
    darkFloorChance: 0.08,
    billboardChance: 0.28,
    antennaChance: 0.9,
    roofBeaconChance: 0.95,
    bridgeCount: 2,
    palette: {
      body: "#06131b",
      glass: "#0d2030",
      glow: "#00e5ff",
      trim: "#6ff9ff",
      accent: "#c9ffff",
      base: "#090d12",
      roof: "#101922",
    },
  },
  financial: {
    buildings: 16,
    heightRange: [14, 40],
    widthRange: [1.5, 3.8],
    depthRange: [1.5, 3.8],
    xSpread: 15,
    zSpread: 48,
    streetGap: 3.0,
    baseHeight: 0.8,
    shellOpacity: 0.08,
    windowDensity: 0.9,
    darkFloorChance: 0.1,
    billboardChance: 0.35,
    antennaChance: 0.72,
    roofBeaconChance: 0.82,
    bridgeCount: 3,
    palette: {
      body: "#08111a",
      glass: "#112235",
      glow: "#7ff8ff",
      trim: "#d8ffff",
      accent: "#ffffff",
      base: "#090b10",
      roof: "#1a2028",
    },
  },
  research: {
    buildings: 14,
    heightRange: [10, 30],
    widthRange: [1.2, 3.2],
    depthRange: [1.2, 3.4],
    xSpread: 13,
    zSpread: 44,
    streetGap: 3.5,
    baseHeight: 0.7,
    shellOpacity: 0.09,
    windowDensity: 0.78,
    darkFloorChance: 0.14,
    billboardChance: 0.52,
    antennaChance: 0.95,
    roofBeaconChance: 0.85,
    bridgeCount: 2,
    palette: {
      body: "#08141a",
      glass: "#0d1f24",
      glow: "#74e5ff",
      trim: "#b1f4ff",
      accent: "#d6ffff",
      base: "#090d12",
      roof: "#13212a",
    },
  },
  residential: {
    buildings: 20,
    heightRange: [8, 20],
    widthRange: [1.4, 3.2],
    depthRange: [1.4, 3.2],
    xSpread: 16,
    zSpread: 48,
    streetGap: 3.2,
    baseHeight: 0.65,
    shellOpacity: 0.06,
    windowDensity: 0.72,
    darkFloorChance: 0.08,
    billboardChance: 0.14,
    antennaChance: 0.45,
    roofBeaconChance: 0.55,
    bridgeCount: 1,
    palette: {
      body: "#11131a",
      glass: "#1e2430",
      glow: "#ffc88f",
      trim: "#ffd8ad",
      accent: "#fff0d8",
      base: "#111419",
      roof: "#20242e",
    },
  },
  industrial: {
    buildings: 17,
    heightRange: [9, 26],
    widthRange: [1.8, 4.4],
    depthRange: [1.8, 5.2],
    xSpread: 18,
    zSpread: 56,
    streetGap: 4,
    baseHeight: 1,
    shellOpacity: 0.05,
    windowDensity: 0.48,
    darkFloorChance: 0.28,
    billboardChance: 0.1,
    antennaChance: 0.4,
    roofBeaconChance: 0.55,
    bridgeCount: 2,
    palette: {
      body: "#091012",
      glass: "#162126",
      glow: "#ffb86c",
      trim: "#ffd5a1",
      accent: "#ffe6bf",
      base: "#07090b",
      roof: "#1c2024",
    },
  },
  ghost: {
    buildings: 15,
    heightRange: [12, 34],
    widthRange: [1.4, 4.0],
    depthRange: [1.4, 4.0],
    xSpread: 15,
    zSpread: 54,
    streetGap: 3.1,
    baseHeight: 0.85,
    shellOpacity: 0.08,
    windowDensity: 0.66,
    darkFloorChance: 0.18,
    billboardChance: 0.3,
    antennaChance: 0.6,
    roofBeaconChance: 0.72,
    bridgeCount: 2,
    palette: {
      body: "#170609",
      glass: "#29121a",
      glow: "#ff1744",
      trim: "#ff9dac",
      accent: "#ffe4ea",
      base: "#0d0809",
      roof: "#230c10",
    },
  },
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

function pickThemePalette(theme: DistrictTheme): Palette {
  return DISTRICT_PRESETS[theme].palette;
}

function generateBuildings(
  theme: DistrictTheme,
  origin: [number, number, number],
  seed: number,
  width: number,
  depth: number,
): BuildingSpec[] {
  const preset = DISTRICT_PRESETS[theme];
  const rng = createRng(seed);
  const buildings: BuildingSpec[] = [];

  const halfWidth = width * 0.5;
  const halfDepth = depth * 0.5;
  const streetGap = preset.streetGap;
  const rowCount = Math.max(2, Math.round(Math.sqrt(preset.buildings)));
  const columnCount = Math.max(2, Math.ceil(preset.buildings / rowCount));
  const columnStep = width / columnCount;
  const rowStep = depth / rowCount;

  for (let row = 0; row < rowCount; row += 1) {
    for (let column = 0; column < columnCount; column += 1) {
      if (buildings.length >= preset.buildings) break;

      const skipChance =
        theme === "residential"
          ? 0.08
          : theme === "industrial"
          ? 0.14
          : theme === "ghost"
          ? 0.1
          : 0.04;

      if (rng() < skipChance) continue;

      const side = column % 2 === 0 ? -1 : 1;
      const sideMin = side < 0 ? -halfWidth : streetGap * 0.55;
      const sideMax = side < 0 ? -streetGap * 0.55 : halfWidth;
      const sideWidth = Math.max(0.8, sideMax - sideMin);

      const sideSlot = columnCount > 1
        ? column / (columnCount - 1)
        : 0.5;
      const baseX =
        origin[0] +
        THREE.MathUtils.lerp(
          sideMin,
          sideMax,
          sideSlot,
        );
      const baseZ =
        origin[2] - halfDepth + rowStep * (row + 0.5);

      const cellJitterX = range(rng, -sideWidth * 0.18, sideWidth * 0.18);
      const cellJitterZ = range(rng, -rowStep * 0.22, rowStep * 0.22);

      const height = range(rng, preset.heightRange[0], preset.heightRange[1]);
      const towerWidth = range(rng, preset.widthRange[0], preset.widthRange[1]);
      const towerDepth = range(rng, preset.depthRange[0], preset.depthRange[1]);

      buildings.push({
        position: [
          baseX + cellJitterX,
          origin[1] + height * 0.5,
          baseZ + cellJitterZ,
        ],
        size: [towerWidth, height, towerDepth],
        rotationY: range(rng, -0.15, 0.15),
        palette: pickThemePalette(theme),
        style: theme,
        billboard: rng() < preset.billboardChance,
        antenna: rng() < preset.antennaChance,
        roofBeacon: rng() < preset.roofBeaconChance,
        shellOpacity: preset.shellOpacity,
        windowDensity: preset.windowDensity,
        darkFloorChance: preset.darkFloorChance,
      });
    }
  }

  return buildings;
}

function useBuildingRows(
  height: number,
  density: number,
  darkFloorChance: number,
  seed: number,
) {
  return useMemo(() => {
    const rng = createRng(seed);
    const rowCount = Math.max(5, Math.floor(height / 1.15));

    return Array.from({ length: rowCount }, (_, index) => {
      const dark = rng() < darkFloorChance;
      return {
        y: -height * 0.5 + (index + 0.5) * (height / rowCount),
        active: !dark,
        brightness: dark ? 0.06 : 0.42 + rng() * 0.48,
        seedPhase: rng() * Math.PI * 2,
        widthInset: 0.07 + rng() * 0.12,
        density,
      };
    });
  }, [height, density, darkFloorChance, seed]);
}

function BuildingTower({
  spec,
  index,
}: {
  spec: BuildingSpec;
  index: number;
}) {
  const [width, height, depth] = spec.size;
  const rows = useBuildingRows(
    height,
    spec.windowDensity,
    spec.darkFloorChance,
    index * 73 + Math.round(height * 10),
  );

  const shellMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const roofMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const beaconMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const rowMaterialsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  const bodyTint =
    spec.style === "residential"
      ? "#151a22"
      : spec.style === "industrial"
      ? "#0d1114"
      : spec.palette.body;

  const roofGlow =
    spec.style === "ghost"
      ? spec.palette.glow
      : spec.palette.trim;

  const bodyTint =
    spec.style === "residential"
      ? "#151a22"
      : spec.style === "industrial"
      ? "#0d1114"
      : spec.palette.body;

  const shellColor =
    spec.style === "ghost"
      ? "#3a101b"
      : spec.palette.glass;

  const floorWidth = width * 0.92;
  const floorDepth = depth * 0.07;
  const facadeDepth = depth * 0.06;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 0.6 + Math.sin(t * 0.95 + index * 0.37) * 0.2;

    if (shellMaterialRef.current) {
      shellMaterialRef.current.emissiveIntensity = 0.16 + pulse * 0.12;
      shellMaterialRef.current.opacity = spec.shellOpacity;
    }

    if (roofMaterialRef.current) {
      roofMaterialRef.current.emissiveIntensity = spec.roofBeacon ? 1.6 + pulse * 0.7 : 0.35;
    }

    if (beaconMaterialRef.current) {
      beaconMaterialRef.current.opacity = spec.roofBeacon ? 0.92 : 0.28;
    }

    if (lightRef.current) {
      lightRef.current.intensity = spec.roofBeacon ? 1.7 + pulse * 0.7 : 0.5;
    }

    rowMaterialsRef.current.forEach((material, rowIndex) => {
      const row = rows[rowIndex];
      if (!row) return;
      const rowPulse =
        row.active &&
        (0.55 + Math.sin(t * 0.8 + row.seedPhase) * 0.45);
      material.opacity = row.active
        ? (row.brightness * rowPulse) * (rowIndex % 2 === 0 ? 0.85 : 0.75)
        : 0.03;
    });
  });

  return (
    <group position={spec.position} rotation={[0, spec.rotationY, 0]}>
      <mesh position={[0, -height * 0.5 - spec.baseHeight * 0.5, 0]}>
        <boxGeometry args={[width * 1.08, spec.baseHeight, depth * 1.08]} />
        <meshStandardMaterial
          color={spec.palette.base}
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, -height * 0.05, 0]}>
        <boxGeometry args={[width, height * 0.75, depth]} />
        <meshStandardMaterial
          color={bodyTint}
          roughness={0.78}
          metalness={0.26}
        />
      </mesh>

      <mesh position={[0, height * 0.15, 0]}>
        <boxGeometry args={[width * 0.92, height * 0.52, depth * 0.92]} />
        <meshPhysicalMaterial
          ref={shellMaterialRef}
          color={shellColor}
          roughness={0.22}
          metalness={0.08}
          transmission={spec.style === "residential" ? 0.38 : 0.72}
          thickness={0.65}
          transparent
          opacity={spec.shellOpacity}
          emissive={spec.palette.glow}
        />
      </mesh>

      <mesh position={[0, height * 0.31, 0]}>
        <boxGeometry args={[width * 0.84, height * 0.3, depth * 0.84]} />
        <meshStandardMaterial
          ref={roofMaterialRef}
          color={spec.palette.roof}
          roughness={0.62}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, height * 0.5 + 0.16, 0]}>
        <boxGeometry args={[width * 0.54, 0.32, depth * 0.54]} />
        <meshStandardMaterial
          color={spec.palette.roof}
          roughness={0.42}
          metalness={0.36}
        />
      </mesh>

      <mesh position={[0, height * 0.5 + 0.46, 0]}>
        <boxGeometry args={[width * 0.16, 0.9, depth * 0.16]} />
        <meshStandardMaterial
          color={spec.palette.trim}
          emissive={spec.palette.glow}
          emissiveIntensity={spec.roofBeacon ? 1.6 : 0.35}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {spec.antenna && (
        <mesh position={[0, height * 0.5 + 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 1.1, 8]} />
          <meshStandardMaterial
            color={spec.palette.trim}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      )}

      {spec.billboard && (
        <mesh position={[width * 0.55, height * 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.12, height * 0.38, depth * 0.8]} />
          <meshBasicMaterial
            color={spec.palette.glow}
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh position={[0, height * 0.46, depth * 0.47]}>
        <boxGeometry args={[width * 0.88, 0.08, floorDepth]} />
        <meshBasicMaterial
          color={spec.palette.accent}
          transparent
          opacity={0.26}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          ref={(material) => {
            if (material) rowMaterialsRef.current[0] = material;
          }}
        />
      </mesh>

      <mesh position={[0, height * 0.2, -depth * 0.47]}>
        <boxGeometry args={[width * 0.8, 0.06, floorDepth]} />
        <meshBasicMaterial
          color={spec.palette.trim}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          ref={(material) => {
            if (material) rowMaterialsRef.current[1] = material;
          }}
        />
      </mesh>

      {[
        [-width * 0.47, 0],
        [width * 0.47, 0],
      ].map(([x, z], edgeIndex) => (
        <mesh key={edgeIndex} position={[x, 0, z]}>
          <boxGeometry args={[0.08, height, depth * 0.94]} />
          <meshBasicMaterial
            color={spec.palette.glow}
            transparent
            opacity={0.2 + pulse * 0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {rows.map((row, rowIndex) => {
        const rowPulse =
          row.active &&
          (0.55 + Math.sin(time * 0.8 + row.seedPhase) * 0.45);
        const opacity = row.active
          ? row.brightness * rowPulse
          : 0.03;

        return (
          <group key={rowIndex}>
            <mesh position={[0, row.y, depth * 0.505]}>
              <boxGeometry
                args={[
                  floorWidth - row.widthInset * width,
                  0.13,
                  facadeDepth,
                ]}
              />
              <meshBasicMaterial
                color={spec.palette.glow}
                transparent
                opacity={opacity * 0.85}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                ref={(material) => {
                  if (material) rowMaterialsRef.current[rowIndex * 2] = material;
                }}
              />
            </mesh>

            <mesh position={[0, row.y, -depth * 0.505]} rotation={[0, Math.PI, 0]}>
              <boxGeometry
                args={[
                  floorWidth - row.widthInset * width,
                  0.13,
                  facadeDepth,
                ]}
              />
              <meshBasicMaterial
                color={spec.palette.glow}
                transparent
                opacity={opacity * 0.75}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                ref={(material) => {
                  if (material) rowMaterialsRef.current[rowIndex * 2 + 1] = material;
                }}
              />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0, -height * 0.52, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[width * 0.28, 0.18, depth * 0.25]} />
        <meshStandardMaterial
          color={spec.palette.roof}
          roughness={0.56}
          metalness={0.18}
        />
      </mesh>

      <mesh position={[0, height * 0.5 + 0.95, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial
          ref={beaconMaterialRef}
          color={roofGlow}
          transparent
          opacity={spec.roofBeacon ? 0.92 : 0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color={roofGlow}
        intensity={spec.roofBeacon ? 1.7 + pulse * 0.7 : 0.5}
        distance={height * 1.2}
        decay={2}
        position={[0, height * 0.43, 0]}
      />
    </group>
  );
}

function DistrictBridge({
  width,
  z,
  glow,
}: {
  width: number;
  z: number;
  glow: string;
}) {
  return (
    <group position={[0, 5.5, z]}>
      <mesh>
        <boxGeometry args={[width, 0.35, 2.2]} />
        <meshStandardMaterial
          color="#11161c"
          roughness={0.7}
          metalness={0.32}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[width * 0.94, 0.05, 0.22]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function CityDistrict({
  theme,
  origin,
  seed,
  width = 26,
  depth = 54,
}: CityDistrictProps) {
  const preset = DISTRICT_PRESETS[theme];

  const buildings = useMemo(
    () => generateBuildings(theme, origin, seed, width, depth),
    [theme, origin, seed, width, depth],
  );

  const groundColor =
    theme === "industrial"
      ? "#07090b"
      : theme === "ghost"
      ? "#09050a"
      : "#080c10";

  const plazaColor =
    theme === "residential"
      ? "#10151a"
      : theme === "research"
      ? "#0a1116"
      : "#0d1116";

  return (
    <group position={origin}>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 8, depth + 8]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.98}
          metalness={0.04}
        />
      </mesh>

      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.82, depth * 0.82]} />
        <meshStandardMaterial
          color={plazaColor}
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[width * 0.24, 0.08, depth * 0.24]} />
        <meshBasicMaterial
          color={preset.palette.glow}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {buildings.map((building, index) => (
        <BuildingTower
          key={`${theme}-${index}`}
          spec={building}
          index={index}
        />
      ))}

      {Array.from({ length: preset.bridgeCount }).map((_, index) => {
        const bridgeZ =
          -depth * 0.3 + index * (depth / Math.max(1, preset.bridgeCount - 1));
        return (
          <DistrictBridge
            key={index}
            width={width * 1.18}
            z={bridgeZ}
            glow={preset.palette.glow}
          />
        );
      })}

      {theme === "industrial" && (
        <group position={[0, 1.1, depth * 0.18]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.16, 0.22, width * 1.1, 10]} />
            <meshStandardMaterial
              color="#21262b"
              roughness={0.7}
              metalness={0.54}
            />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[width * 0.8, 0.18, 0.22]} />
            <meshBasicMaterial
              color={preset.palette.glow}
              transparent
              opacity={0.24}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {theme === "ghost" && (
        <mesh position={[0, 8, 0]}>
          <ringGeometry args={[4, 6.2, 64]} />
          <meshBasicMaterial
            color={preset.palette.glow}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
