"use client";

import {
  Sparkles,
  Text,
  RoundedBox,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

import { COLORS } from "@/constants/colors";
import { SCENE } from "@/constants/scene";
import { ParticleSystem } from "@/components/particles/ParticleSystem";
import { useSceneStore } from "@/stores/scene.store";

type ArchitectureKind =
  | "core"
  | "module"
  | "ghost";

interface NodeSpec {
  id: string;
  label: string;
  kind: ArchitectureKind;
  position: [number, number, number];
  size: [number, number, number];
  accent: string;
  glow: string;
}

interface ConnectionSpec {
  id: string;
  from: string;
  to: string;
  color: string;
  packetOffset: number;
}

const NODES: NodeSpec[] = [
  {
    id: "core",
    label: "Core Repository",
    kind: "core",
    position:
      SCENE.nodePositions.core,
    size: SCENE.nodeSize.core,
    accent: COLORS.cyan.core,
    glow: COLORS.cyan.bloom,
  },
  {
    id: "frontend",
    label: "Frontend",
    kind: "module",
    position:
      SCENE.nodePositions.frontend,
    size: SCENE.nodeSize.module,
    accent: COLORS.cyan.glow,
    glow: COLORS.cyan.bloom,
  },
  {
    id: "apiGateway",
    label: "API Gateway",
    kind: "module",
    position:
      SCENE.nodePositions.apiGateway,
    size: SCENE.nodeSize.module,
    accent: COLORS.cyan.glow,
    glow: COLORS.cyan.bloom,
  },
  {
    id: "auth",
    label: "Authentication",
    kind: "module",
    position:
      SCENE.nodePositions.auth,
    size: SCENE.nodeSize.module,
    accent: COLORS.cyan.glow,
    glow: COLORS.cyan.bloom,
  },
  {
    id: "analytics",
    label: "Analytics",
    kind: "module",
    position:
      SCENE.nodePositions.analytics,
    size: SCENE.nodeSize.module,
    accent: COLORS.cyan.glow,
    glow: COLORS.cyan.bloom,
  },
  {
    id: "database",
    label: "Database",
    kind: "module",
    position:
      SCENE.nodePositions.database,
    size: SCENE.nodeSize.module,
    accent: COLORS.cyan.glow,
    glow: COLORS.cyan.bloom,
  },
  {
    id: "cicd",
    label: "CI/CD",
    kind: "module",
    position:
      SCENE.nodePositions.cicd,
    size: SCENE.nodeSize.module,
    accent: COLORS.cyan.glow,
    glow: COLORS.cyan.bloom,
  },
  {
    id: "ghostA",
    label: "Ghost_A",
    kind: "ghost",
    position:
      SCENE.ghostPositions.ghostA,
    size: SCENE.nodeSize.ghost,
    accent: COLORS.ghost.core,
    glow: COLORS.ghost.rim,
  },
  {
    id: "ghostB",
    label: "Ghost_B",
    kind: "ghost",
    position:
      SCENE.ghostPositions.ghostB,
    size: SCENE.nodeSize.ghost,
    accent: COLORS.ghost.core,
    glow: COLORS.ghost.rim,
  },
  {
    id: "ghostC",
    label: "Ghost_C",
    kind: "ghost",
    position:
      SCENE.ghostPositions.ghostC,
    size: SCENE.nodeSize.ghost,
    accent: COLORS.ghost.core,
    glow: COLORS.ghost.rim,
  },
];

const CONNECTIONS: ConnectionSpec[] = [
  {
    id: "core-frontend",
    from: "core",
    to: "frontend",
    color: COLORS.cyan.glow,
    packetOffset: 0.02,
  },
  {
    id: "core-gateway",
    from: "core",
    to: "apiGateway",
    color: COLORS.cyan.glow,
    packetOffset: 0.18,
  },
  {
    id: "core-auth",
    from: "core",
    to: "auth",
    color: COLORS.cyan.glow,
    packetOffset: 0.32,
  },
  {
    id: "core-analytics",
    from: "core",
    to: "analytics",
    color: COLORS.cyan.glow,
    packetOffset: 0.46,
  },
  {
    id: "core-database",
    from: "core",
    to: "database",
    color: COLORS.cyan.glow,
    packetOffset: 0.6,
  },
  {
    id: "core-cicd",
    from: "core",
    to: "cicd",
    color: COLORS.cyan.glow,
    packetOffset: 0.74,
  },
  {
    id: "ghostA-auth",
    from: "ghostA",
    to: "auth",
    color: COLORS.ghost.core,
    packetOffset: 0.15,
  },
  {
    id: "ghostB-core",
    from: "ghostB",
    to: "core",
    color: COLORS.ghost.core,
    packetOffset: 0.38,
  },
  {
    id: "ghostC-database",
    from: "ghostC",
    to: "database",
    color: COLORS.ghost.core,
    packetOffset: 0.57,
  },
];

function getReveal(
  scrollProgress: number,
  start: number,
  end: number,
) {
  if (scrollProgress <= start) {
    return 0;
  }

  if (scrollProgress >= end) {
    return 1;
  }

  return (
    (scrollProgress - start) /
    (end - start)
  );
}

function useNodeLookup() {
  return useMemo(
    () =>
      Object.fromEntries(
        NODES.map((node) => [
          node.id,
          node,
        ]),
      ) as Record<string, NodeSpec>,
    [],
  );
}

function getNodeSpec(
  nodeLookup: Record<
    string,
    NodeSpec
  >,
  id: string,
) {
  const node = nodeLookup[id];

  if (!node) {
    throw new Error(
      `Unknown node "${id}"`,
    );
  }

  return node;
}

function ArchitectureNode({
  node,
  scrollProgress,
}: {
  node: NodeSpec;
  scrollProgress: number;
}) {
  const groupRef =
    useRef<THREE.Group>(null);
  const glassRef =
    useRef<THREE.MeshPhysicalMaterial>(
      null,
    );
  const ringRef =
    useRef<THREE.MeshBasicMaterial>(
      null,
    );
  const lightRef =
    useRef<THREE.PointLight>(null);

  const hoveredNodeId =
    useSceneStore(
      (state) =>
        state.hoveredNodeId,
    );
  const selectedNodeId =
    useSceneStore(
      (state) =>
        state.selectedNodeId,
    );
  const setHoveredNode =
    useSceneStore(
      (state) =>
        state.setHoveredNode,
    );
  const setSelectedNode =
    useSceneStore(
      (state) =>
        state.setSelectedNode,
    );

  const isGhost =
    node.kind === "ghost";
  const isCore =
    node.kind === "core";
  const isHovered =
    hoveredNodeId === node.id;
  const isSelected =
    selectedNodeId === node.id;

  const reveal = isGhost
    ? getReveal(
        scrollProgress,
        0.48,
        0.82,
      )
    : getReveal(
        scrollProgress,
        0.06,
        0.42,
      );

  useEffect(() => {
    if (
      typeof document ===
      "undefined"
    ) {
      return;
    }

    document.body.style.cursor =
      isHovered
        ? "pointer"
        : "default";

    return () => {
      document.body.style.cursor =
        "default";
    };
  }, [isHovered]);

  useFrame((state, delta) => {
    if (
      !groupRef.current ||
      !glassRef.current ||
      !ringRef.current ||
      !lightRef.current
    ) {
      return;
    }

    const time =
      state.clock.elapsedTime;
    const pulse =
      0.5 +
      Math.sin(
        time * 1.4 +
          node.position[0],
      ) *
        0.5;

    const hoverBoost = isSelected
      ? 1
      : isHovered
      ? 0.7
      : 0;

    const ghostFlicker = isGhost
      ? 0.7 +
        Math.sin(
          time * 7.5 +
            node.position[1],
        ) *
          0.18
      : 1;

    const baseY =
      node.position[1] +
      Math.sin(
        time * 0.55 +
          node.position[2],
      ) *
        (isGhost
          ? 0.18
          : 0.12);

    groupRef.current.position.y =
      THREE.MathUtils.lerp(
        groupRef.current.position.y,
        baseY,
        1 - Math.exp(-3 * delta),
      );

    groupRef.current.rotation.y +=
      delta *
      (isGhost
        ? 0.18
        : 0.08);

    groupRef.current.scale.setScalar(
      0.7 +
        reveal * 0.3 +
        hoverBoost * 0.08,
    );

    glassRef.current.emissiveIntensity =
      (isCore ? 0.85 : 0.4) *
      reveal *
      ghostFlicker *
      (1 + hoverBoost * 0.9);

    glassRef.current.opacity =
      0.22 +
      reveal * 0.58;

    ringRef.current.opacity =
      0.08 +
      reveal * 0.14 +
      pulse * 0.06 +
      hoverBoost * 0.12;

    lightRef.current.intensity =
      reveal *
      ghostFlicker *
      (isCore ? 3.4 : 1.8) *
      (1 + hoverBoost);
  });

  return (
    <group
      ref={groupRef}
      position={node.position}
      onPointerOver={(
        event,
      ) => {
        event.stopPropagation();
        setHoveredNode(node.id);
      }}
      onPointerOut={() =>
        setHoveredNode(null)
      }
      onClick={(
        event,
      ) => {
        event.stopPropagation();
        setSelectedNode(
          selectedNodeId ===
            node.id
            ? null
            : node.id,
        );
      }}
    >
      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -node.size[1] *
            0.72,
          0,
        ]}
      >
        <ringGeometry
          args={[
            Math.max(
              node.size[0] * 0.68,
              1.1,
            ),
            Math.max(
              node.size[0] * 1.15,
              1.9,
            ),
            64,
          ]}
        />
        <meshBasicMaterial
          ref={ringRef}
          color={node.glow}
          transparent
          depthWrite={false}
        />
      </mesh>

      <RoundedBox
        args={node.size}
        radius={0.18}
        smoothness={6}
      >
        <meshPhysicalMaterial
          ref={glassRef}
          color={
            isGhost
              ? "#1a0911"
              : "#0b1622"
          }
          emissive={node.accent}
          roughness={0.16}
          metalness={0.08}
          transmission={0.96}
          thickness={0.8}
          ior={1.16}
          transparent
          opacity={0.6}
        />
      </RoundedBox>

      <mesh
        position={[
          0,
          0,
          node.size[2] * 0.34,
        ]}
      >
        <planeGeometry
          args={[
            node.size[0] * 0.7,
            node.size[1] * 0.18,
          ]}
        />
        <meshBasicMaterial
          color={node.accent}
          transparent
          opacity={0.85}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color={node.glow}
        distance={
          isCore ? 10 : 7
        }
        decay={2}
      />

      {(isCore || isGhost) && (
        <Sparkles
          count={
            isCore ? 24 : 14
          }
          scale={[
            node.size[0] * 1.6,
            node.size[1] * 2.6,
            node.size[2] * 1.6,
          ]}
          size={
            isCore ? 2.4 : 1.8
          }
          speed={
            isGhost ? 0.8 : 0.35
          }
          opacity={0.6}
          color={node.glow}
        />
      )}

      <Text
        position={[
          0,
          node.size[1] * 0.85,
          0,
        ]}
        fontSize={
          isCore ? 0.28 : 0.19
        }
        color="#dffcff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {node.label}
      </Text>
    </group>
  );
}

function ConnectionBeam({
  connection,
  nodeLookup,
  scrollProgress,
}: {
  connection: ConnectionSpec;
  nodeLookup: Record<
    string,
    NodeSpec
  >;
  scrollProgress: number;
}) {
  const packetRef =
    useRef<THREE.Mesh>(null);
  const beamMaterialRef =
    useRef<THREE.MeshBasicMaterial>(
      null,
    );
  const glowMaterialRef =
    useRef<THREE.MeshBasicMaterial>(
      null,
    );
  const point =
    useMemo(
      () => new THREE.Vector3(),
      [],
    );

  const curve =
    useMemo(() => {
      const start =
        getNodeSpec(
          nodeLookup,
          connection.from,
        ).position;
      const end =
        getNodeSpec(
          nodeLookup,
          connection.to,
        ).position;

      const startVector =
        new THREE.Vector3(
          start[0],
          start[1],
          start[2],
        );
      const endVector =
        new THREE.Vector3(
          end[0],
          end[1],
          end[2],
        );
      const midVector =
        startVector
          .clone()
          .lerp(endVector, 0.5)
          .add(
            new THREE.Vector3(
              0,
              0.9,
              0,
            ),
          );

      return new THREE.CatmullRomCurve3(
        [
          startVector,
          midVector,
          endVector,
        ],
      );
    }, [
      connection.from,
      connection.to,
      nodeLookup,
    ]);

  const beamGeometry =
    useMemo(
      () =>
        new THREE.TubeGeometry(
          curve,
          48,
          0.03,
          10,
          false,
        ),
      [curve],
    );

  const glowGeometry =
    useMemo(
      () =>
        new THREE.TubeGeometry(
          curve,
          48,
          0.07,
          10,
          false,
        ),
      [curve],
    );

  const reveal =
    connection.color ===
    COLORS.ghost.core
      ? getReveal(
          scrollProgress,
          0.52,
          0.86,
        )
      : getReveal(
          scrollProgress,
          0.12,
          0.5,
        );

  useFrame((state) => {
    const t =
      (state.clock.elapsedTime *
        0.18 +
        connection.packetOffset) %
      1;

    curve.getPointAt(t, point);

    if (packetRef.current) {
      packetRef.current.position.copy(
        point,
      );
    }

    if (beamMaterialRef.current) {
      beamMaterialRef.current.opacity =
        0.2 + reveal * 0.6;
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity =
        0.06 + reveal * 0.16;
    }
  });

  return (
    <group>
      <mesh geometry={glowGeometry}>
        <meshBasicMaterial
          ref={glowMaterialRef}
          color={connection.color}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={beamGeometry}>
        <meshBasicMaterial
          ref={beamMaterialRef}
          color={connection.color}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh ref={packetRef}>
        <sphereGeometry
          args={[0.09, 16, 16]}
        />
        <meshBasicMaterial
          color={connection.color}
        />
      </mesh>
    </group>
  );
}

function AtmosphereShell({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const shellRef =
    useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!shellRef.current) {
      return;
    }

    const time =
      state.clock.elapsedTime;

    shellRef.current.rotation.y +=
      delta * 0.025;

    shellRef.current.position.y =
      Math.sin(time * 0.18) *
      0.16;

    shellRef.current.scale.setScalar(
      1 +
        Math.sin(
          scrollProgress *
            Math.PI,
        ) *
          0.025,
    );
  });

  return (
    <group ref={shellRef}>
      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -2.2,
          2,
        ]}
      >
        <ringGeometry
          args={[7.5, 9.8, 96]}
        />
        <meshBasicMaterial
          color={COLORS.cyan.dim}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -2.18,
          2,
        ]}
      >
        <ringGeometry
          args={[10.2, 12.8, 96]}
        />
        <meshBasicMaterial
          color={COLORS.ghost.ambient}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function GhostWorld({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const rootRef =
    useRef<THREE.Group>(null);
  const nodeLookup =
    useNodeLookup();
  const setSceneReady =
    useSceneStore(
      (state) =>
        state.setSceneReady,
    );
  const setRevealProgress =
    useSceneStore(
      (state) =>
        state.setRevealProgress,
    );

  useEffect(() => {
    setSceneReady(true);

    return () =>
      setSceneReady(false);
  }, [setSceneReady]);

  useEffect(() => {
    setRevealProgress(
      scrollProgress,
    );
  }, [
    scrollProgress,
    setRevealProgress,
  ]);

  useFrame((state, delta) => {
    if (!rootRef.current) {
      return;
    }

    const time =
      state.clock.elapsedTime;
    const driftX =
      Math.sin(time * 0.18) *
      0.4;
    const driftY =
      Math.cos(time * 0.12) *
      0.22;

    rootRef.current.position.x =
      THREE.MathUtils.lerp(
        rootRef.current.position.x,
        driftX,
        1 - Math.exp(-2.2 * delta),
      );
    rootRef.current.position.y =
      THREE.MathUtils.lerp(
        rootRef.current.position.y,
        driftY,
        1 - Math.exp(-2.2 * delta),
      );
    rootRef.current.rotation.y =
      THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        -0.12 +
          scrollProgress * 0.24,
        1 - Math.exp(-2.6 * delta),
      );
    rootRef.current.rotation.x =
      THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        0.04 -
          scrollProgress * 0.08,
        1 - Math.exp(-2.6 * delta),
      );
  });

  return (
    <group ref={rootRef}>
      <AtmosphereShell
        scrollProgress={
          scrollProgress
        }
      />

      {CONNECTIONS.map(
        (connection) => (
          <ConnectionBeam
            key={connection.id}
            connection={connection}
            nodeLookup={nodeLookup}
            scrollProgress={
              scrollProgress
            }
          />
        ),
      )}

      {NODES.map((node) => (
        <ArchitectureNode
          key={node.id}
          node={node}
          scrollProgress={
            scrollProgress
          }
        />
      ))}

      <ParticleSystem />

      <Sparkles
        count={90}
        scale={[28, 14, 28]}
        size={2.2}
        speed={0.24}
        color={COLORS.cyan.glow}
        opacity={0.18}
      />
    </group>
  );
}
