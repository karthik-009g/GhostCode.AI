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
import {
  ARCHITECTURE_GRAPH,
  SCENE,
} from "@/constants/scene";
import { ParticleSystem } from "@/components/particles/ParticleSystem";
import { useAnimationStore } from "@/stores/animation.store";
import { useSceneStore } from "@/stores/scene.store";
import { WorldAnimationController } from "./WorldAnimationController";

type ArchitectureKind =
  | "core"
  | "module"
  | "ghost";

interface NodeSpec {
  id: string;
  label: string;
  kind: ArchitectureKind;
  status: "healthy" | "orphaned" | "broken" | "ghost";
  position: [number, number, number];
  size: [number, number, number];
  accent: string;
  glow: string;
}

interface ConnectionSpec {
  id: string;
  from: string;
  to: string;
  status: "active" | "broken" | "ghost" | "dormant";
  color: string;
  packetOffset: number;
}

const NODES: NodeSpec[] = ARCHITECTURE_GRAPH.nodes.map(
  (node) => ({
    id: node.id,
    label: node.label,
    kind: node.kind,
    status: node.status,
    position: node.position,
    size: node.size,
    accent: node.accent,
    glow: node.glow,
  }),
);

const CONNECTIONS: ConnectionSpec[] =
  ARCHITECTURE_GRAPH.connections.map(
    (connection) => ({
      id: connection.id,
      from: connection.from,
      to: connection.to,
      status: connection.status,
      color: connection.color,
      packetOffset: connection.packetOffset,
    }),
  );

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
  const globalTime = useAnimationStore(
    (state) => state.globalTime,
  );

  const hoveredNodeId =
    useSceneStore(
      (state) =>
        state.hoveredNodeId,
    );
  const corruptionLevel = useSceneStore(
    (state) => state.corruptionLevel,
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
    node.kind === "ghost" || node.status === "ghost";
  const isCore =
    node.kind === "core";
  const isBroken = node.status === "broken";
  const isOrphaned = node.status === "orphaned";
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

  const pulse =
    0.5 +
    Math.sin(
      globalTime * 1.4 +
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
        globalTime * 7.5 +
          node.position[1],
      ) *
        0.18
    : 1;

  const baseY =
    node.position[1] +
    Math.sin(
      globalTime * 0.55 +
        node.position[2],
    ) *
      (isGhost ? 0.18 : 0.12);

  const rotationY =
    globalTime *
      (isGhost ? 0.18 : 0.08) +
    node.position[0] * 0.02;

  const scale =
    0.7 + reveal * 0.3 + hoverBoost * 0.08;

  const emissiveIntensity =
    (isCore ? 0.85 : 0.4) *
    reveal *
    ghostFlicker *
    (1 + hoverBoost * 0.9);

  const statusBoost = isBroken
    ? 0.65
    : isOrphaned
    ? 0.3
    : isGhost
    ? 1.1
    : 0;

  const nodeColor = isBroken
    ? COLORS.ghost.core
    : isOrphaned
    ? COLORS.cyan.dim
    : node.accent;

  const ringOpacity =
    0.08 +
    reveal * 0.14 +
    pulse * 0.06 +
    hoverBoost * 0.12 +
    statusBoost * 0.08;

  const lightIntensity =
    reveal *
    ghostFlicker *
    (isCore ? 3.4 : 1.8) *
    (1 + hoverBoost) *
    (1 + statusBoost * 0.42);

  return (
    <group
      position={[
        node.position[0],
        baseY,
        node.position[2],
      ]}
      rotation={[0, rotationY, 0]}
      scale={scale}
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
          color={nodeColor}
          transparent
          opacity={ringOpacity}
          depthWrite={false}
        />
      </mesh>

      <RoundedBox
        args={node.size}
        radius={0.18}
        smoothness={6}
      >
        <meshPhysicalMaterial
          color={
            isBroken
              ? "#2d0d15"
              : isGhost
              ? "#1a0911"
              : "#0b1622"
          }
          emissive={nodeColor}
          roughness={0.16}
          metalness={0.08}
          transmission={0.96}
          thickness={0.8}
          ior={1.16}
          transparent
          opacity={0.6}
          emissiveIntensity={emissiveIntensity}
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
          color={nodeColor}
          transparent
          opacity={0.85 + corruptionLevel * 0.08}
        />
      </mesh>

      <pointLight
        color={nodeColor}
        distance={
          isCore ? 10 : 7
        }
        decay={2}
        intensity={lightIntensity}
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
  const globalTime = useAnimationStore(
    (state) => state.globalTime,
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
    connection.status === "ghost"
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

  const isCorrupted =
    connection.status !== "active";
  const beamColor =
    connection.status === "ghost"
      ? COLORS.ghost.core
      : connection.status === "broken"
      ? COLORS.ghost.rim
      : connection.color;

  const beamOpacity =
    0.18 + reveal * 0.5 + corruptionLevel * 0.18;

  const packetT =
    (globalTime * 0.18 +
      connection.packetOffset) %
    1;

  curve.getPointAt(packetT, point);

  const glowOpacity =
    0.06 + reveal * 0.16 + (isCorrupted ? 0.06 : 0);

  return (
    <group>
      <mesh geometry={glowGeometry}>
        <meshBasicMaterial
          color={beamColor}
          transparent
          opacity={glowOpacity}
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={beamGeometry}>
        <meshBasicMaterial
          color={beamColor}
          transparent
          opacity={beamOpacity}
          depthWrite={false}
        />
      </mesh>

      <mesh position={point}>
        <sphereGeometry
          args={[0.09, 16, 16]}
        />
        <meshBasicMaterial color={beamColor} />
      </mesh>
    </group>
  );
}

function AtmosphereShell({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const globalTime = useAnimationStore(
    (state) => state.globalTime,
  );

  const shellScale =
    1 +
    Math.sin(scrollProgress * Math.PI) *
      0.025;

  return (
    <group
      position={[
        0,
        Math.sin(globalTime * 0.18) *
          0.16,
        0,
      ]}
      rotation={[0, globalTime * 0.025, 0]}
      scale={shellScale}
    >
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
  const nodeLookup =
    useNodeLookup();
  const globalTime = useAnimationStore(
    (state) => state.globalTime,
  );
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

  const rootPosition: [number, number, number] = [
    Math.sin(globalTime * 0.18) * 0.4,
    Math.cos(globalTime * 0.12) * 0.22,
    0,
  ];

  const rootRotation: [number, number, number] = [
    0.04 - scrollProgress * 0.08,
    -0.12 + scrollProgress * 0.24,
    0,
  ];

  return (
    <group position={rootPosition} rotation={rootRotation}>
      <WorldAnimationController
        scrollProgress={scrollProgress}
      />

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
