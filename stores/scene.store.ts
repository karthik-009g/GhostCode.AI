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

  corruptionLevel: number;

  corruptedNodeIds: string[];

  corruptedConnectionIds: string[];
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

function createCorruptionState() {
  return {
    nodes: DEFAULT_NODES,
    connections: DEFAULT_CONNECTIONS,
    corruptionLevel: 0,
    corruptedNodeIds: [] as string[],
    corruptedConnectionIds: [] as string[],
  };
}

function buildConnectionGraph() {
  const adjacent: Record<string, string[]> = {};

  Object.values(DEFAULT_CONNECTIONS).forEach((connection) => {
  const from =
    (adjacent[connection.fromId] ??= []);

  const to =
    (adjacent[connection.toId] ??= []);

  from.push(connection.toId);
  to.push(connection.fromId);
});

  return adjacent;
}

function applyGhostCorruption(
  ghostAttackActive: boolean,
  attackingGhostId: string | null,
) {
  if (!ghostAttackActive || !attackingGhostId) {
    return createCorruptionState();
  }

  const adjacent = buildConnectionGraph();
  const corruptedNodeIds = new Set<string>([
    attackingGhostId,
  ]);
  const corruptedConnectionIds = new Set<string>();

  const firstRing = adjacent[attackingGhostId] ?? [];
  firstRing.forEach((nodeId) => {
    corruptedNodeIds.add(nodeId);
  });

  firstRing.forEach((nodeId) => {
    (adjacent[nodeId] ?? []).forEach((nextNodeId) => {
      if (nextNodeId !== attackingGhostId) {
        corruptedNodeIds.add(nextNodeId);
      }
    });
  });

  Object.values(DEFAULT_CONNECTIONS).forEach((connection) => {
    const touchesGhost =
      connection.fromId === attackingGhostId ||
      connection.toId === attackingGhostId;
    const touchesCorruption =
      corruptedNodeIds.has(connection.fromId) ||
      corruptedNodeIds.has(connection.toId);

    if (touchesGhost) {
      corruptedConnectionIds.add(connection.id);
    } else if (touchesCorruption) {
      corruptedConnectionIds.add(connection.id);
    }
  });

  const nextNodes: Record<string, SceneNode> = {};
  Object.entries(DEFAULT_NODES).forEach(([id, node]) => {
    const isAttacker = id === attackingGhostId;
    const isCorrupted = corruptedNodeIds.has(id);

    nextNodes[id] = {
      ...node,
      status: isAttacker
        ? "ghost"
        : isCorrupted
        ? node.kind === "core"
          ? "broken"
          : "orphaned"
        : node.status,
      visible: true,
      emissiveIntensity: isAttacker
        ? node.emissiveIntensity * 1.6
        : isCorrupted
        ? node.emissiveIntensity * 1.15
        : node.emissiveIntensity,
    };
  });

  const nextConnections: Record<string, SceneConnection> = {};
  Object.entries(DEFAULT_CONNECTIONS).forEach(([id, connection]) => {
    const isCorrupted = corruptedConnectionIds.has(id);

    nextConnections[id] = {
      ...connection,
      status: isCorrupted
        ? connection.status === "ghost"
          ? "ghost"
          : "broken"
        : connection.status,
      visible: true,
      pulseOffset: isCorrupted
        ? connection.pulseOffset + 0.11
        : connection.pulseOffset,
    };
  });

  const corruptionLevel =
    corruptedNodeIds.size /
    Object.keys(DEFAULT_NODES).length;

  return {
    nodes: nextNodes,
    connections: nextConnections,
    corruptionLevel,
    corruptedNodeIds: Array.from(corruptedNodeIds),
    corruptedConnectionIds: Array.from(corruptedConnectionIds),
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
        ...createCorruptionState(),

        hoveredNodeId: null,

        selectedNodeId: null,

        visibleNodeIds: [],

        ghostAttackActive: false,

        attackingGhostId: null,

        sceneReady: false,

        revealProgress: 0,

        corruptionLevel: 0,

        corruptedNodeIds: [],

        corruptedConnectionIds: [],

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
        ) => {
          const corruptionState = applyGhostCorruption(
            ghostAttackActive,
            attackingGhostId,
          );

          set({
            ghostAttackActive,
            attackingGhostId,
            nodes: corruptionState.nodes,
            connections: corruptionState.connections,
            corruptionLevel: corruptionState.corruptionLevel,
            corruptedNodeIds: corruptionState.corruptedNodeIds,
            corruptedConnectionIds: corruptionState.corruptedConnectionIds,
          });
        },

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