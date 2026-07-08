"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

const ROAD_START_Z = 24;
const ROAD_END_Z = -760;
const ROAD_LENGTH = ROAD_START_Z - ROAD_END_Z;

const ROAD_WIDTH = 18;
const SIDEWALK_WIDTH = 5.5;
const CURB_HEIGHT = 0.18;

const CYAN = "#00e5ff";
const CYAN_DIM = "#0097a7";
const RED = "#ff1744";
const WARM = "#ffb86c";
const ASPHALT = "#04070b";
const CONCRETE = "#0a0d11";

type RoadTrafficInstance = {
  laneX: number;
  seedZ: number;
  speed: number;
  width: number;
  height: number;
  length: number;
  direction: 1 | -1;
  color: string;
  trailLength: number;
};

type StreetLightInstance = {
  x: number;
  z: number;
  height: number;
  color: string;
};

type RoadDecalInstance = {
  x: number;
  z: number;
  width: number;
  length: number;
  opacity: number;
  color: string;
};

type CrosswalkInstance = {
  x: number;
  z: number;
  width: number;
};

function createRng(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6D2B79F5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function range(rng: () => number, min: number, max: number) {
  return min + (max - min) * rng();
}

function positiveModulo(value: number, modulo: number) {
  return ((value % modulo) + modulo) % modulo;
}

function useRoadLayout() {
  return useMemo(() => {
    const rng = createRng(0x5a17);

    const trafficLanes = [-5.8, -3.0, 3.0, 5.8];
    const traffic: RoadTrafficInstance[] = [];

    for (let i = 0; i < 56; i += 1) {
      const laneIndex = i % trafficLanes.length;
      const laneX = trafficLanes[laneIndex] + range(rng, -0.12, 0.12);
      const direction: 1 | -1 = i % 3 === 0 ? 1 : -1;

      traffic.push({
        laneX,
        seedZ: range(rng, 0, ROAD_LENGTH),
        speed: range(rng, 6, 12),
        width: range(rng, 0.16, 0.28),
        height: range(rng, 0.08, 0.14),
        length: range(rng, 0.85, 1.5),
        direction,
        color: direction > 0 ? CYAN : RED,
        trailLength: range(rng, 1.2, 2.4),
      });
    }

    const streetLights: StreetLightInstance[] = [];
    for (let i = 0; i < 68; i += 1) {
      const z = ROAD_START_Z - i * 11.5 + range(rng, -1.4, 1.4);
      const side = i % 2 === 0 ? -1 : 1;
      streetLights.push({
        x: side * (ROAD_WIDTH * 0.5 + SIDEWALK_WIDTH * 0.55),
        z,
        height: range(rng, 6.2, 7.8),
        color: i % 5 === 0 ? WARM : CYAN_DIM,
      });
    }

    const laneMarkers: RoadDecalInstance[] = [];
    for (let i = 0; i < 92; i += 1) {
      const z = ROAD_START_Z - i * 8.2 + range(rng, -0.8, 0.8);
      laneMarkers.push(
        {
          x: -4.1,
          z,
          width: 0.2,
          length: 1.8,
          opacity: 0.22,
          color: CYAN,
        },
        {
          x: -1.35,
          z,
          width: 0.18,
          length: 1.4,
          opacity: 0.2,
          color: CYAN_DIM,
        },
        {
          x: 1.35,
          z,
          width: 0.18,
          length: 1.4,
          opacity: 0.2,
          color: CYAN_DIM,
        },
        {
          x: 4.1,
          z,
          width: 0.2,
          length: 1.8,
          opacity: 0.22,
          color: CYAN,
        },
      );
    }

    const reflections: RoadDecalInstance[] = [];
    for (let i = 0; i < 44; i += 1) {
      const z = ROAD_START_Z - i * 17.8 + range(rng, -2, 2);
      reflections.push(
        {
          x: -5.7,
          z,
          width: 1.15,
          length: 3.2,
          opacity: 0.08,
          color: CYAN,
        },
        {
          x: 5.7,
          z,
          width: 1.15,
          length: 3.2,
          opacity: 0.06,
          color: RED,
        },
      );
    }

    const crosswalks: CrosswalkInstance[] = [];
    for (let i = 0; i < 8; i += 1) {
      crosswalks.push({
        x: 0,
        z: ROAD_START_Z - 58 - i * 86 + range(rng, -2.5, 2.5),
        width: range(rng, 16.5, 19.5),
      });
    }

    const trafficSignals = crosswalks.map((crosswalk, index) => ({
      z: crosswalk.z,
      side: index % 2 === 0 ? -1 : 1,
      color: index % 3 === 0 ? RED : WARM,
    }));

    const serviceBoxes = Array.from({ length: 36 }, (_, index) => ({
      x: index % 2 === 0 ? -10.1 : 10.1,
      z: ROAD_START_Z - index * 21.5 + range(rng, -2.5, 2.5),
      width: range(rng, 0.28, 0.56),
      height: range(rng, 0.32, 0.68),
      depth: range(rng, 0.28, 0.56),
    }));

    return {
      traffic,
      streetLights,
      laneMarkers,
      reflections,
      crosswalks,
      trafficSignals,
      serviceBoxes,
    };
  }, []);
}

function StaticRoadSurface() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -340]}>
        <planeGeometry args={[ROAD_WIDTH + SIDEWALK_WIDTH * 2.3, 760]} />
        <meshPhysicalMaterial
          color={ASPHALT}
          roughness={0.42}
          metalness={0.06}
          clearcoat={0.55}
          clearcoatRoughness={0.18}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-ROAD_WIDTH * 0.5 - SIDEWALK_WIDTH * 0.5, 0.06, -340]}>
        <planeGeometry args={[SIDEWALK_WIDTH, 760]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.96} metalness={0.02} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROAD_WIDTH * 0.5 + SIDEWALK_WIDTH * 0.5, 0.06, -340]}>
        <planeGeometry args={[SIDEWALK_WIDTH, 760]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.96} metalness={0.02} />
      </mesh>

      <mesh position={[0, CURB_HEIGHT * 0.5, -340]}>
        <boxGeometry args={[ROAD_WIDTH + SIDEWALK_WIDTH * 2.4, CURB_HEIGHT, 760]} />
        <meshStandardMaterial color="#11151a" roughness={0.9} metalness={0.03} />
      </mesh>

      <mesh position={[0, 0.09, -340]}>
        <boxGeometry args={[1.35, 0.055, 760]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.11}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function LaneMarkings({
  markers,
}: {
  markers: RoadDecalInstance[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    markers.forEach((marker, index) => {
      dummy.position.set(marker.x, 0.11, marker.z);
      dummy.scale.set(marker.width, 1, marker.length);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, new THREE.Color(marker.color));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dummy, markers]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, markers.length]}
    >
      <boxGeometry args={[1, 0.012, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.24}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
      />
    </instancedMesh>
  );
}

function ReflectionBands({
  reflections,
}: {
  reflections: RoadDecalInstance[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    reflections.forEach((band, index) => {
      dummy.position.set(band.x, 0.05, band.z);
      dummy.scale.set(band.width, 1, band.length);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, new THREE.Color(band.color));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dummy, reflections]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, reflections.length]}
    >
      <boxGeometry args={[1, 0.01, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
      />
    </instancedMesh>
  );
}

function StreetLights({
  streetLights,
}: {
  streetLights: StreetLightInstance[];
}) {
  const poleRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const poleMesh = poleRef.current;
    const headMesh = headRef.current;
    if (!poleMesh || !headMesh) return;

    streetLights.forEach((light, index) => {
      dummy.position.set(light.x, light.height * 0.5, light.z);
      dummy.scale.set(0.08, light.height, 0.08);
      dummy.updateMatrix();
      poleMesh.setMatrixAt(index, dummy.matrix);

      dummy.position.set(light.x, light.height + 0.05, light.z);
      dummy.scale.set(0.22, 0.12, 0.22);
      dummy.updateMatrix();
      headMesh.setMatrixAt(index, dummy.matrix);
      headMesh.setColorAt(index, new THREE.Color(light.color));
    });

    poleMesh.instanceMatrix.needsUpdate = true;
    headMesh.instanceMatrix.needsUpdate = true;
    if (headMesh.instanceColor) headMesh.instanceColor.needsUpdate = true;
  }, [dummy, streetLights]);

  return (
    <>
      <instancedMesh
        ref={poleRef}
        args={[undefined, undefined, streetLights.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#14181d" roughness={0.7} metalness={0.55} />
      </instancedMesh>

      <instancedMesh
        ref={headRef}
        args={[undefined, undefined, streetLights.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
        />
      </instancedMesh>
    </>
  );
}

function TrafficSignals({
  signals,
}: {
  signals: { z: number; side: number; color: string }[];
}) {
  return (
    <group>
      {signals.map((signal, index) => (
        <group key={index} position={[signal.side * 11.4, 0, signal.z]}>
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[0.1, 3.2, 0.1]} />
            <meshStandardMaterial color="#161b20" roughness={0.78} metalness={0.32} />
          </mesh>
          <mesh position={[0, 3.35, 0.08]}>
            <boxGeometry args={[0.26, 0.38, 0.22]} />
            <meshBasicMaterial
              color={signal.color}
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 3.05, 0.08]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Crosswalks({
  crosswalks,
}: {
  crosswalks: CrosswalkInstance[];
}) {
  return (
    <group>
      {crosswalks.map((crosswalk, index) => (
        <group key={index} position={[crosswalk.x, 0.07, crosswalk.z]}>
          {Array.from({ length: 9 }).map((_, stripeIndex) => (
            <mesh
              key={stripeIndex}
              position={[(stripeIndex - 4) * 1.75, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[1.0, crosswalk.width]} />
              <meshBasicMaterial
                color="#d9efff"
                transparent
                opacity={0.1}
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

function ServiceBoxes({
  serviceBoxes,
}: {
  serviceBoxes: Array<{
    x: number;
    z: number;
    width: number;
    height: number;
    depth: number;
  }>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    serviceBoxes.forEach((box, index) => {
      dummy.position.set(box.x, box.height * 0.5, box.z);
      dummy.scale.set(box.width, box.height, box.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, serviceBoxes]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, serviceBoxes.length]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#1a2027"
        roughness={0.86}
        metalness={0.12}
      />
    </instancedMesh>
  );
}

function TrafficStream({
  traffic,
}: {
  traffic: RoadTrafficInstance[];
}) {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const bodyMesh = bodyRef.current;
    const trailMesh = trailRef.current;
    if (!bodyMesh || !trailMesh) return;

    const elapsed = clock.elapsedTime;

    traffic.forEach((vehicle, index) => {
      const progress = positiveModulo(
        vehicle.seedZ + elapsed * vehicle.speed * vehicle.direction,
        ROAD_LENGTH,
      );

      const z = ROAD_START_Z - progress;
      const bodyY = 0.34 + Math.sin(elapsed * 2 + index) * 0.012;
      const trailOffset = vehicle.direction > 0 ? 0.85 : -0.85;

      dummy.position.set(vehicle.laneX, bodyY, z);
      dummy.scale.set(vehicle.width, vehicle.height, vehicle.length);
      dummy.rotation.set(0, vehicle.direction > 0 ? 0 : Math.PI, 0);
      dummy.updateMatrix();
      bodyMesh.setMatrixAt(index, dummy.matrix);
      bodyMesh.setColorAt(index, new THREE.Color(vehicle.color));

      dummy.position.set(vehicle.laneX, bodyY - 0.08, z + trailOffset);
      dummy.scale.set(vehicle.width * 0.55, vehicle.height * 0.8, vehicle.trailLength);
      dummy.rotation.set(0, vehicle.direction > 0 ? 0 : Math.PI, 0);
      dummy.updateMatrix();
      trailMesh.setMatrixAt(index, dummy.matrix);
      trailMesh.setColorAt(
        index,
        new THREE.Color(vehicle.direction > 0 ? CYAN : RED),
      );
    });

    bodyMesh.instanceMatrix.needsUpdate = true;
    trailMesh.instanceMatrix.needsUpdate = true;
    if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
    if (trailMesh.instanceColor) trailMesh.instanceColor.needsUpdate = true;
  });

  useEffect(() => {
    const bodyMesh = bodyRef.current;
    const trailMesh = trailRef.current;
    if (!bodyMesh || !trailMesh) return;

    traffic.forEach((vehicle, index) => {
      const progress = positiveModulo(vehicle.seedZ, ROAD_LENGTH);
      const z = ROAD_START_Z - progress;

      dummy.position.set(vehicle.laneX, 0.34, z);
      dummy.scale.set(vehicle.width, vehicle.height, vehicle.length);
      dummy.updateMatrix();
      bodyMesh.setMatrixAt(index, dummy.matrix);
      bodyMesh.setColorAt(index, new THREE.Color(vehicle.color));

      dummy.position.set(vehicle.laneX, 0.26, z + (vehicle.direction > 0 ? 0.85 : -0.85));
      dummy.scale.set(vehicle.width * 0.55, vehicle.height * 0.8, vehicle.trailLength);
      dummy.updateMatrix();
      trailMesh.setMatrixAt(index, dummy.matrix);
      trailMesh.setColorAt(
        index,
        new THREE.Color(vehicle.direction > 0 ? CYAN : RED),
      );
    });

    bodyMesh.instanceMatrix.needsUpdate = true;
    trailMesh.instanceMatrix.needsUpdate = true;
    if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
    if (trailMesh.instanceColor) trailMesh.instanceColor.needsUpdate = true;
  }, [dummy, traffic]);

  return (
    <group>
      <instancedMesh
        ref={bodyRef}
        args={[undefined, undefined, traffic.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
        />
      </instancedMesh>

      <instancedMesh
        ref={trailRef}
        args={[undefined, undefined, traffic.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
        />
      </instancedMesh>
    </group>
  );
}

function RoadIntersections({
  crosswalks,
}: {
  crosswalks: CrosswalkInstance[];
}) {
  return (
    <group>
      {crosswalks.map((crosswalk, index) => (
        <group key={index} position={[0, 0.04, crosswalk.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[ROAD_WIDTH + SIDEWALK_WIDTH * 2.05, 12]} />
            <meshStandardMaterial
              color="#05080c"
              roughness={0.58}
              metalness={0.18}
            />
          </mesh>

          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[ROAD_WIDTH + SIDEWALK_WIDTH * 2.15, 0.02, 0.36]} />
            <meshBasicMaterial
              color={CYAN}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function RoadSystem() {
  const layout = useRoadLayout();

  return (
    <group>
      <StaticRoadSurface />
      <RoadIntersections crosswalks={layout.crosswalks} />
      <Crosswalks crosswalks={layout.crosswalks} />
      <LaneMarkings markers={layout.laneMarkers} />
      <ReflectionBands reflections={layout.reflections} />
      <StreetLights streetLights={layout.streetLights} />
      <TrafficSignals signals={layout.trafficSignals} />
      <ServiceBoxes serviceBoxes={layout.serviceBoxes} />
      <TrafficStream traffic={layout.traffic} />
    </group>
  );
}