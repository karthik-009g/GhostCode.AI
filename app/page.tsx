"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { RoadSystem as InfrastructureRoadSystem } from "@/components/infrastructure/RoadSystem";
import { dampVector3 } from "@/lib/lerp";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const CYAN = "#00e5ff";
const CYAN_DIM = "#0097a7";
const RED = "#ff1744";
const RED_DIM = "#b71c1c";
const BG = "#020408";

// ─── BUILDING ────────────────────────────────────────────────────────────────

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  emissive: string;
  emissiveIntensity: number;
  windowColor?: string;
  phase?: number;
}

function Building({
  position,
  size,
  color,
  emissive,
  emissiveIntensity,
  phase = 0,
}: BuildingProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(
    () => new THREE.BoxGeometry(...size),
    [size]
  );

  const edgeGeometry = useMemo(
    () => new THREE.EdgesGeometry(geometry),
    [geometry]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    const pulse =
      emissiveIntensity *
      (0.7 + Math.sin(t * 0.7 + phase) * 0.3);

    if (coreRef.current) {
      const mat =
        coreRef.current.material as THREE.MeshStandardMaterial;

      mat.emissiveIntensity = pulse;
    }

    if (shellRef.current) {
      const mat =
        shellRef.current.material as THREE.MeshBasicMaterial;

      mat.opacity =
        0.04 +
        Math.sin(t * 0.4 + phase) * 0.02;
    }

    if (edgeRef.current) {
      const mat =
        edgeRef.current.material as THREE.LineBasicMaterial;

      mat.opacity =
        0.25 +
        Math.sin(t * 0.8 + phase) * 0.15;
    }
  });

  return (
    <group position={position}>

      {/* CORE BUILDING */}
      <mesh
        ref={coreRef}
        geometry={geometry}
        castShadow
      >
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.95}
          metalness={0.02}
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* HOLOGRAPHIC OUTER SHELL */}
      <mesh
        ref={shellRef}
        geometry={geometry}
        scale={[1.02, 1.01, 1.02]}
      >
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* EDGE GLOW */}
      <lineSegments
        ref={edgeRef}
        geometry={edgeGeometry}
      >
        <lineBasicMaterial
          color={emissive}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* TOP BEACON */}
      <mesh
        position={[0, size[1] / 2 + 0.2, 0]}
      >
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* BUILDING LIGHT */}
      <pointLight
        color={emissive}
        intensity={0.4}
        distance={size[1] * 0.8}
        decay={2}
        position={[0, size[1] / 2, 0]}
      />

    </group>
  );
}

// ─── WINDOW GRID ─────────────────────────────────────────────────────────────

function WindowGrid({
  position,
  width,
  height,
  color,
  density = 0.6,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  color: string;
  density?: number;
}) {
  const cols = Math.floor(width * 3);
  const rows = Math.floor(height * 2);

  const windows = useMemo(() => {
    const arr: { x: number; y: number; on: boolean; phase: number }[] = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (Math.random() < density) {
          arr.push({
            x: (c / cols - 0.5) * width * 0.88,
            y: (r / rows - 0.5) * height * 0.88,
            on: Math.random() > 0.15,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }
    return arr;
  }, [cols, rows, width, height, density]);

  const windowRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    windowRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const w = windows[i];
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = w.on
        ? 0.6 + 0.4 * Math.sin(t * 0.3 + w.phase)
        : 0.0;
    });
  });

  return (
    <group position={position}>
      {windows.map((w, i) => (
        <mesh
          key={i}
          position={[w.x, w.y, 0.01]}
          ref={(el) => {
            if (el) windowRefs.current[i] = el;
          }}
        >
          <planeGeometry args={[0.08, 0.12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={w.on ? 0.8 : 0}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── DISTRICT LABEL ──────────────────────────────────────────────────────────

// ─── CITY ────────────────────────────────────────────────────────────────────

interface DistrictBuilding {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  emissive: string;
  intensity: number;
  phase: number;
  windowColor: string;
}

function useCity(): DistrictBuilding[] {
  return useMemo(() => {
    const buildings: DistrictBuilding[] = [];
    const rng = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // CORE TOWER DISTRICT — center, tallest cyan towers
    const corePositions: [number, number][] = [
      [0, -10], [-4, -8], [4, -8], [-2, -14], [2, -14],
      [0, -18], [-6, -12], [6, -12],
    ];
    corePositions.forEach(([x, z]) => {
      const h = rng(8, 22);
      buildings.push({
        pos: [x + rng(-0.5, 0.5), h / 2, z + rng(-0.5, 0.5)],
        size: [rng(1.2, 2.5), h, rng(1.2, 2.5)],
        color: "#041418",
        emissive: CYAN,
        intensity: rng(0.3, 0.8),
        phase: rng(0, Math.PI * 2),
        windowColor: CYAN,
      });
    });

    // GHOST DISTRICT — right side, red corrupted towers
    const ghostPositions: [number, number][] = [
      [14, -8], [18, -10], [16, -14], [20, -6],
      [22, -12], [14, -16], [19, -18],
    ];
    ghostPositions.forEach(([x, z]) => {
      const h = rng(4, 16);
      buildings.push({
        pos: [x + rng(-0.5, 0.5), h / 2, z + rng(-0.5, 0.5)],
        size: [rng(1.0, 2.2), h, rng(1.0, 2.2)],
        color: "#140404",
        emissive: RED,
        intensity: rng(0.5, 1.2),
        phase: rng(0, Math.PI * 2),
        windowColor: RED,
      });
    });

    // MIDGROUND — dim background city mass
    for (let i = 0; i < 350; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;

const streetWidth = 18;

const x =
  side *
  (streetWidth +
    rng(0, 30));

const z =
  -i * 4 -
  rng(0, 3);

const h =
  rng(8, 35);
      const isGhost = x > 8;
      buildings.push({
        pos: [x, h / 2, z],
        size: [rng(0.8, 2.0), h, rng(0.8, 2.0)],
        color: isGhost ? "#120204" : "#050607",
        emissive: isGhost ? RED_DIM : CYAN_DIM,
        intensity: rng(0.02, 0.08),
        phase: rng(0, Math.PI * 2),
        windowColor: isGhost ? RED_DIM : CYAN_DIM,
      });
    }

    // FOREGROUND sides
    for (let i = 0; i < 16; i++) {
      const side = i < 8 ? -1 : 1;
      const x = side * rng(10, 18);
      const z = rng(-4, -20);
      const h = rng(3, 10);
      buildings.push({
        pos: [x, h / 2, z],
        size: [rng(1.0, 2.5), h, rng(1.0, 2.5)],
        color: "#030810",
        emissive: CYAN_DIM,
        intensity: rng(0.15, 0.4),
        phase: rng(0, Math.PI * 2),
        windowColor: CYAN_DIM,
      });
    }

    return buildings;
  }, []);
}

function City() {
  const buildings = useCity();

  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i}>
          <Building
            position={b.pos}
            size={b.size}
            color={b.color}
            emissive={b.emissive}
            emissiveIntensity={b.intensity}
            phase={b.phase}
          />
          <WindowGrid
            position={[b.pos[0], b.pos[1], b.pos[2] + b.size[2] / 2 + 0.01]}
            width={b.size[0]}
            height={b.size[1]}
            color={b.windowColor}
            density={0.5}
          />
        </group>
      ))}
    </group>
  );
}


// ─── Road System ─────────────────────────────────────────────────────────────

function RoadSystem() {
  return (
    <group>
      {/* Main boulevard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -180]}>
        <planeGeometry args={[18, 600]} />
        <meshStandardMaterial
          color="#020305"
          roughness={0.95}
          metalness={0.15}
        />
      </mesh>

      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0, -180]}>
        <planeGeometry args={[6, 600]} />
        <meshStandardMaterial color="#07090b" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0, -180]}>
        <planeGeometry args={[6, 600]} />
        <meshStandardMaterial color="#07090b" />
      </mesh>

      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -180]}>
        <planeGeometry args={[0.25, 600]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Lane markers */}
      {Array.from({ length: 80 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, -i * 8]}
        >
          <planeGeometry args={[0.4, 2]} />
          <meshBasicMaterial
            color={CYAN}
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}
// Horizon City 
// ─── HORIZON CITY ──────────────────────────────────────────────────────────

function HorizonCity() {
  const towers = useMemo(
    () =>
      Array.from({ length: 400 }, () => ({
        x: (Math.random() - 0.5) * 400,
        z: -150 - Math.random() * 300,
        h: 10 + Math.random() * 120,
        w: 1 + Math.random() * 10,
        ghost: Math.random() > 0.8,
      })),
    []
  );

  return (
    <group>
      {towers.map((t, i) => (
        <mesh
          key={i}
          position={[t.x, t.h / 2, t.z]}
        >
          <boxGeometry args={[t.w, t.h, t.w]} />

          <meshBasicMaterial
            color={t.ghost ? "#140204" : "#05080c"}
            transparent
            opacity={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── MEGASTRUCTURES ────────────────────────────────────────────────────────

function Megastructures() {
  return (
    <>
      <mesh position={[0, 80, -450]}>
        <boxGeometry args={[220, 180, 20]} />
        <meshBasicMaterial
          color="#030507"
          transparent
          opacity={0.35}
        />
      </mesh>

      <mesh position={[-140, 50, -400]}>
        <boxGeometry args={[80, 120, 10]} />
        <meshBasicMaterial
          color="#030507"
          transparent
          opacity={0.3}
        />
      </mesh>

      <mesh position={[140, 60, -500]}>
        <boxGeometry args={[100, 150, 15]} />
        <meshBasicMaterial
          color="#030507"
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
}
// ─── DATA HIGHWAY ─────────────────────────────────────────────────────────────

function DataHighway() {
  const count = 30;
  const packetRefs = useRef<THREE.Mesh[]>([]);

  const packets = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        lane: (Math.floor(i / 10) - 1) * 1.5,
        z: -Math.random() * 40,
        speed: 0.08 + Math.random() * 0.15,
        color: i > 20 ? RED : CYAN,
        size: 0.04 + Math.random() * 0.06,
      })),
    [],
  );

  useFrame((_, delta) => {
    packetRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.position.z += packets[i].speed * delta * 60;
      if (mesh.position.z > 8) {
        mesh.position.z = -40;
      }
    });
  });

  return (
    <group position={[0, 0.05, 0]}>
      {packets.map((p, i) => (
        <mesh
          key={i}
          position={[p.lane, 0, p.z]}
          ref={(el) => {
            if (el) packetRefs.current[i] = el;
          }}
        >
          <boxGeometry args={[p.size, p.size, p.size * 6]} />
          <meshBasicMaterial
            color={p.color}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── PARTICLES ────────────────────────────────────────────────────────────────

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 800;

  const { positions, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const pha = new Float32Array(count);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = -Math.random() * 50;
      pha[i] = Math.random() * Math.PI * 2;
      spd[i] = 0.3 + Math.random() * 0.7;
    }
    return { positions: pos, phases: pha, speeds: spd };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    if (mat.uniforms?.uTime) mat.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(CYAN) } }}
        vertexShader={`
          uniform float uTime;
          attribute float aPhase;
          attribute float aSpeed;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            pos.y += sin(uTime * aSpeed * 0.4 + aPhase) * 0.3;
            pos.x += cos(uTime * aSpeed * 0.3 + aPhase) * 0.15;
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 120.0 / -mv.z;
            gl_Position = projectionMatrix * mv;
            vAlpha = 0.15 + 0.25 * sin(uTime * aSpeed * 0.6 + aPhase);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d) * vAlpha;
            gl_FragColor = vec4(uColor, a);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── GHOST ENTITIES ──────────────────────────────────────────────────────────

function GhostEntity({ position, phase }: { position: [number, number, number]; phase: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + phase) * 0.4;
      groupRef.current.rotation.y = t * 0.3 + phase;
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + 0.8 * Math.sin(t * 2 + phase);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#1a0000"
          emissive={RED}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Outer shell */}
      <mesh>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial
          color={RED}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          wireframe
        />
      </mesh>
      {/* Point light */}
      <pointLight color={RED} intensity={2} distance={6} decay={2} />
    </group>
  );
}

function GhostEntities() {
  const ghosts = useMemo(
    () => [
      { position: [12, 4, -6] as [number, number, number], phase: 0 },
      { position: [16, 2, -11] as [number, number, number], phase: 1.5 },
      { position: [14, 6, -16] as [number, number, number], phase: 3.0 },
      { position: [20, 3, -8] as [number, number, number], phase: 2.2 },
    ],
    [],
  );

  return (
    <>
      {ghosts.map((g, i) => (
        <GhostEntity key={i} position={g.position} phase={g.phase} />
      ))}
    </>
  );
}

// ─── CORRUPTION BEAM ─────────────────────────────────────────────────────────

function CorruptionBeam() {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!beamRef.current) return;
    const mat = beamRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.05 + 0.04 * Math.sin(clock.elapsedTime * 3);
  });

  return (
    <mesh
      ref={beamRef}
      position={[14, 8, -12]}
      rotation={[0, 0, Math.PI / 12]}
    >
      <cylinderGeometry args={[0.05, 0.8, 18, 8]} />
      <meshBasicMaterial
        color={RED}
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── ATMOSPHERE HAZE ─────────────────────────────────────────────────────────

function AtmosphereHaze() {
  const hazeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!hazeRef.current) return;
    const mat = hazeRef.current.material as THREE.ShaderMaterial;
    if (mat.uniforms?.uTime) mat.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh ref={hazeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, -20]}>
      <planeGeometry args={[120, 80, 1, 1]} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0 },
          uCyan: { value: new THREE.Color(CYAN) },
          uRed: { value: new THREE.Color(RED) },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uCyan;
          uniform vec3 uRed;
          varying vec2 vUv;
          void main() {
            vec2 c = vUv - vec2(0.5);
            float radial = 1.0 - smoothstep(0.0, 0.5, length(c));
            float split = smoothstep(0.4, 0.7, vUv.x);
            vec3 color = mix(uCyan, uRed, split);
            float pulse = 0.5 + 0.5 * sin(uTime * 0.25);
            float alpha = radial * 0.055 * (0.7 + 0.3 * pulse);
            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── CINEMATIC CAMERA ────────────────────────────────────────────────────────

function CinematicCamera() {
  const { camera } = useThree();

  const smoothedPointer = useRef(
    new THREE.Vector2(),
  );

  const desiredPosition = useRef(
    new THREE.Vector3(0, 2.35, 15),
  );

  const desiredTarget = useRef(
    new THREE.Vector3(0, 1.9, -72),
  );

  const currentTarget = useRef(
    new THREE.Vector3(0, 1.9, -72),
  );

  const currentPosition = useRef(
    new THREE.Vector3(0, 2.35, 15),
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    smoothedPointer.current.x +=
      (pointerX - smoothedPointer.current.x) *
      (1 - Math.exp(-5 * delta));

    smoothedPointer.current.y +=
      (pointerY - smoothedPointer.current.y) *
      (1 - Math.exp(-5 * delta));

    const breath =
      Math.sin(t * 0.7) * 0.045;

    desiredPosition.current.set(
      smoothedPointer.current.x * 1.35,
      2.35 + smoothedPointer.current.y * 0.28 + breath,
      15 + Math.abs(smoothedPointer.current.x) * 0.55,
    );

    desiredTarget.current.set(
      smoothedPointer.current.x * 2.25,
      1.9 + smoothedPointer.current.y * 0.42 + breath * 0.5,
      -72,
    );

    dampVector3(
      currentPosition.current,
      desiredPosition.current,
      4.5,
      delta,
    );

    dampVector3(
      currentTarget.current,
      desiredTarget.current,
      5.5,
      delta,
    );

    camera.position.copy(
      currentPosition.current,
    );

    camera.lookAt(
      currentTarget.current,
    );

    camera.rotation.z =
      smoothedPointer.current.x * -0.01 +
      Math.sin(t * 0.35) * 0.0025;
  });

  return null;
}

// ─── LIGHTING ────────────────────────────────────────────────────────────────

function Lighting() {
  return (
    <>
      <ambientLight color="#000a12" intensity={0.4} />
      {/* Key — soft cyan top */}
      <directionalLight
        color={CYAN}
        intensity={0.5}
        position={[-8, 14, 4]}
      />
      {/* Ghost side — red */}
      <pointLight color={RED} intensity={3} distance={30} decay={2} position={[16, 8, -10]} />
      {/* Core glow */}
      <pointLight color={CYAN} intensity={2} distance={25} decay={2} position={[0, 6, -12]} />
      {/* Fill */}
      <pointLight color="#003344" intensity={1.5} distance={40} decay={2} position={[-10, 4, -15]} />
    </>
  );
}

// ─── FOG ─────────────────────────────────────────────────────────────────────

function SceneFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(BG, 0.018);
    scene.background = new THREE.Color(BG);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return null;
}

// ─── HUD OVERLAY ─────────────────────────────────────────────────────────────

function HUDOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-8 py-5">
        <div>
          <div
            style={{ color: CYAN, fontFamily: "monospace", fontSize: 11, letterSpacing: "0.3em", opacity: 0.6 }}
          >
            GHOST_CODE
          </div>
          <div
            style={{ color: "white", fontFamily: "monospace", fontSize: 22, fontWeight: 700, letterSpacing: "0.08em", marginTop: 2 }}
          >
            DIGITAL CITY
          </div>
        </div>
        <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: 10, color: CYAN, opacity: 0.45, letterSpacing: "0.2em" }}>
          <div>SYS.STATUS: ACTIVE</div>
          <div style={{ marginTop: 4, color: "#ff1744" }}>GHOST INTRUSION: DETECTED</div>
        </div>
      </div>

      {/* Bottom left coords */}
      <div
        style={{
          position: "absolute", bottom: 28, left: 32,
          fontFamily: "monospace", fontSize: 9,
          color: CYAN, opacity: 0.35, letterSpacing: "0.18em",
          lineHeight: 1.8,
        }}
      >
        <div>CORE DISTRICT ████████░░ 82%</div>
        <div style={{ color: RED }}>GHOST SECTOR ██████████ BREACH</div>
        <div>DATA FLOW ████████████ NOMINAL</div>
      </div>

      {/* Corner brackets */}
      {[
        { top: 16, left: 16 },
        { top: 16, right: 16 },
        { bottom: 16, left: 16 },
        { bottom: 16, right: 16 },
      ].map((style, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...style,
            width: 20,
            height: 20,
            borderColor: CYAN,
            borderStyle: "solid",
            borderWidth: 0,
            borderTopWidth: i < 2 ? 1 : 0,
            borderBottomWidth: i >= 2 ? 1 : 0,
            borderLeftWidth: i % 2 === 0 ? 1 : 0,
            borderRightWidth: i % 2 === 1 ? 1 : 0,
            opacity: 0.3,
          }}
        />
      ))}

      {/* Scanline overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.012) 2px, rgba(0,229,255,0.012) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function GhostCityPage() {
  return (
    <div
  style={{
    width: "100vw",
    height: "500vh",
    background: BG,
    position: "relative",
  }}
>
      <HUDOverlay />
      <Canvas
        camera={{
  fov: 52,
  near: 0.1,
  far: 1000,
  position: [0, 2.35, 15],
}}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
       style={{
  position: "fixed",
  inset: 0,
}}
      >
        <SceneFog />
<Lighting />
<CinematicCamera />

<InfrastructureRoadSystem />
<City />
<HorizonCity />
<Megastructures />

<DataHighway />
        <GhostEntities />
        <CorruptionBeam />
        <AtmosphereHaze />
        <Particles />
      </Canvas>
    </div>
  );
}