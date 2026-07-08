import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  ARCHITECTURE_GRAPH,
  type ArchitectureConnectionDefinition,
  type ArchitectureNodeDefinition,
} from "@/constants/scene";

export interface SceneNode {
  id: string;
  label: string;

  kind: ArchitectureNodeDefinition["kind"];
  status: ArchitectureNodeDefinition["status"];

  position: [number, number, number];
  size: [number, number, number];

  emissiveIntensity: number;

  visible: boolean;
}

export interface SceneConnection {
  id: string;

  fromId: string;
  toId: string;

  status: ArchitectureConnectionDefinition["status"];

  color: string;

  pulseOffset: number;

  visible: boolean;
}

interface SceneState {
  nodes: Record<string, SceneNode>;

  connections: Record<
    string,
    SceneConnection
  >;

  hoveredNodeId:
    | string
    | null;

  selectedNodeId:
    | string
    | null;

  visibleNodeIds: string[];

  ghostAttackActive: boolean;

  attackingGhostId:
    | string
    | null;

  sceneReady: boolean;

  revealProgress: number;
}

interface SceneActions {
  registerNode(
    node: SceneNode,
  ): void;

  updateNode(
    id: string,
    partial: Partial<SceneNode>,
  ): void;

  registerConnection(
    connection: SceneConnection,
  ): void;

  updateConnection(
    id: string,
    partial: Partial<SceneConnection>,
  ): void;

  setHoveredNode(
    id: string | null,
  ): void;

  setSelectedNode(
    id: string | null,
  ): void;

  setGhostAttack(
    active: boolean,
    ghostId?: string | null,
  ): void;

  setSceneReady(
    ready: boolean,
  ): void;

  setRevealProgress(
    progress: number,
  ): void;

  revealNode(
    id: string,
  ): void;

  hideNode(
    id: string,
  ): void;
}

function getNode(
  nodes: Record<
    string,
    SceneNode
  >,
  id: string,
): SceneNode {
  const node = nodes[id];

  if (!node) {
    throw new Error(
      `Scene node "${id}" not found`,
    );
  }

  return node;
}

function getConnection(
  connections: Record<
    string,
    SceneConnection
  >,
  id: string,
): SceneConnection {
  const connection =
    connections[id];

  if (!connection) {
    throw new Error(
      `Scene connection "${id}" not found`,
    );
  }

  return connection;
}

function mergeNode(
  current: SceneNode,
  partial: Partial<SceneNode>,
): SceneNode {
  return {
    ...current,
    ...partial,
  };
}

function mergeConnection(
  current: SceneConnection,
  partial: Partial<SceneConnection>,
): SceneConnection {
  return {
    ...current,
    ...partial,
  };
}

const DEFAULT_NODES: Record<
  string,
  SceneNode
> = Object.fromEntries(
  ARCHITECTURE_GRAPH.nodes.map((node) => [
    node.id,
    {
      id: node.id,
      label: node.label,
      kind: node.kind,
      status: node.status,
      position: node.position,
      size: node.size,
      emissiveIntensity: node.emissiveIntensity,
      visible: node.visible,
    },
  ]),
) as Record<string, SceneNode>;

const DEFAULT_CONNECTIONS: Record<
  string,
  SceneConnection
> = Object.fromEntries(
  ARCHITECTURE_GRAPH.connections.map(
    (connection) => [
      connection.id,
      {
        id: connection.id,
        fromId: connection.from,
        toId: connection.to,
        status: connection.status,
        color: connection.color,
        pulseOffset: connection.packetOffset,
        visible: connection.visible,
      },
    ],
  ),
) as Record<string, SceneConnection>;

export const useSceneStore =
  create<
    SceneState &
      SceneActions
  >()(
    subscribeWithSelector(
      (set) => ({
        nodes: DEFAULT_NODES,

        connections: DEFAULT_CONNECTIONS,

        hoveredNodeId: null,

        selectedNodeId: null,

        visibleNodeIds: [],

        ghostAttackActive: false,

        attackingGhostId: null,

        sceneReady: false,

        revealProgress: 0,

        registerNode: (
          node,
        ) =>
          set((s) => ({
            nodes: {
              ...s.nodes,
              [node.id]:
                node,
            },
          })),

        updateNode: (
          id,
          partial,
        ) =>
          set((s) => ({
            nodes: {
              ...s.nodes,
              [id]: mergeNode(
                getNode(
                  s.nodes,
                  id,
                ),
                partial,
              ),
            },
          })),

        registerConnection: (
          connection,
        ) =>
          set((s) => ({
            connections: {
              ...s.connections,
              [connection.id]:
                connection,
            },
          })),

        updateConnection: (
          id,
          partial,
        ) =>
          set((s) => ({
            connections: {
              ...s.connections,
              [id]:
                mergeConnection(
                  getConnection(
                    s.connections,
                    id,
                  ),
                  partial,
                ),
            },
          })),

        setHoveredNode:
          (
            hoveredNodeId,
          ) =>
            set({
              hoveredNodeId,
            }),

        setSelectedNode:
          (
            selectedNodeId,
          ) =>
            set({
              selectedNodeId,
            }),

        setGhostAttack: (
          ghostAttackActive,
          attackingGhostId = null,
        ) =>
          set({
            ghostAttackActive,
            attackingGhostId,
          }),

        setSceneReady:
          (
            sceneReady,
          ) =>
            set({
              sceneReady,
            }),

        setRevealProgress:
          (
            revealProgress,
          ) =>
            set({
              revealProgress,
            }),

        revealNode: (
          id,
        ) =>
          set((s) => ({
            visibleNodeIds:
              Array.from(
                new Set([
                  ...s.visibleNodeIds,
                  id,
                ]),
              ),

            nodes: {
              ...s.nodes,
              [id]:
                mergeNode(
                  getNode(
                    s.nodes,
                    id,
                  ),
                  {
                    visible: true,
                  },
                ),
            },
          })),

        hideNode: (
          id,
        ) =>
          set((s) => ({
            visibleNodeIds:
              s.visibleNodeIds.filter(
                (v) =>
                  v !== id,
              ),

            nodes: {
              ...s.nodes,
              [id]:
                mergeNode(
                  getNode(
                    s.nodes,
                    id,
                  ),
                  {
                    visible: false,
                  },
                ),
            },
          })),
      }),
    ),
  );