import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { SCENE } from "@/constants/scene";

export type NodeType =
  | "module"
  | "core"
  | "ghost";

export type NodeStatus =
  | "healthy"
  | "orphaned"
  | "broken"
  | "ghost";

export type ConnectionStatus =
  | "active"
  | "broken"
  | "ghost"
  | "dormant";

export interface SceneNode {
  id: string;
  label: string;

  type: NodeType;
  status: NodeStatus;

  position: [number, number, number];
  size: [number, number, number];

  emissiveIntensity: number;

  visible: boolean;
}

export interface SceneConnection {
  id: string;

  fromId: string;
  toId: string;

  status: ConnectionStatus;

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

function createNode(
  id: string,
  label: string,
  type: NodeType,
  status: NodeStatus,
  position: [number, number, number],
  size: [number, number, number],
  emissiveIntensity: number,
): SceneNode {
  return {
    id,
    label,
    type,
    status,
    position,
    size,
    emissiveIntensity,
    visible: false,
  };
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
> = {
  core: createNode(
    "core",
    "Core Repository",
    "core",
    "healthy",
    SCENE.nodePositions.core,
    SCENE.nodeSize.core,
    0.8,
  ),

  frontend: createNode(
    "frontend",
    "Frontend",
    "module",
    "healthy",
    SCENE.nodePositions.frontend,
    SCENE.nodeSize.module,
    0.4,
  ),

  apiGateway: createNode(
    "apiGateway",
    "API Gateway",
    "module",
    "healthy",
    SCENE.nodePositions.apiGateway,
    SCENE.nodeSize.module,
    0.4,
  ),

  auth: createNode(
    "auth",
    "Authentication",
    "module",
    "healthy",
    SCENE.nodePositions.auth,
    SCENE.nodeSize.module,
    0.4,
  ),

  analytics: createNode(
    "analytics",
    "Analytics",
    "module",
    "healthy",
    SCENE.nodePositions.analytics,
    SCENE.nodeSize.module,
    0.4,
  ),

  database: createNode(
    "database",
    "Database",
    "module",
    "healthy",
    SCENE.nodePositions.database,
    SCENE.nodeSize.module,
    0.4,
  ),

  cicd: createNode(
    "cicd",
    "CI/CD",
    "module",
    "healthy",
    SCENE.nodePositions.cicd,
    SCENE.nodeSize.module,
    0.4,
  ),

  ghostA: createNode(
    "ghostA",
    "Ghost_A",
    "ghost",
    "ghost",
    SCENE.ghostPositions.ghostA,
    SCENE.nodeSize.ghost,
    1.2,
  ),

  ghostB: createNode(
    "ghostB",
    "Ghost_B",
    "ghost",
    "ghost",
    SCENE.ghostPositions.ghostB,
    SCENE.nodeSize.ghost,
    1.2,
  ),

  ghostC: createNode(
    "ghostC",
    "Ghost_C",
    "ghost",
    "ghost",
    SCENE.ghostPositions.ghostC,
    SCENE.nodeSize.ghost,
    1.2,
  ),
};

export const useSceneStore =
  create<
    SceneState &
      SceneActions
  >()(
    subscribeWithSelector(
      (set) => ({
        nodes: DEFAULT_NODES,

        connections: {},

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