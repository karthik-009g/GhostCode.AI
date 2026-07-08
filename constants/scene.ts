export const SCENE = {
  background: "#05070D",

  fog: {
    color: "#05070D",
    near: 18,
    far: 80,
  },

  nodePositions: {
    frontend: [0, 0.2, -4] as [number, number, number],

    apiGateway: [-4.5, 0, -0.2] as [number, number, number],

    auth: [4.5, 0, -0.2] as [number, number, number],

    analytics: [-4.5, 0, 4] as [number, number, number],

    database: [4.5, 0, 4] as [number, number, number],

    cicd: [0, -0.1, 8] as [number, number, number],

    core: [0, 0.4, 2] as [number, number, number],
  },

  ghostPositions: {
    ghostA: [12, 2.2, -2] as [number, number, number],

    ghostB: [12, 0, 1] as [number, number, number],

    ghostC: [12, -2.2, 4] as [number, number, number],
  },

  nodeSize: {
    module: [1.8, 0.5, 1.2] as [number, number, number],

    core: [2.8, 0.7, 1.8] as [number, number, number],

    ghost: [1.4, 0.4, 1.0] as [number, number, number],
  },

  boundary: {
    width: 16,
    height: 14,
    depth: 0.05,
  },

  particles: {
    count: 900,
    spread: 30,
    size: 0.025,
    speed: 0.1,
  },
} as const;

export type ArchitectureNodeKind =
  | "core"
  | "module"
  | "ghost";

export type ArchitectureNodeStatus =
  | "healthy"
  | "orphaned"
  | "broken"
  | "ghost";

export type ArchitectureConnectionStatus =
  | "active"
  | "broken"
  | "ghost"
  | "dormant";

export interface ArchitectureNodeDefinition {
  id: string;
  label: string;
  kind: ArchitectureNodeKind;
  status: ArchitectureNodeStatus;
  position: [number, number, number];
  size: [number, number, number];
  accent: string;
  glow: string;
  emissiveIntensity: number;
  visible: boolean;
}

export interface ArchitectureConnectionDefinition {
  id: string;
  from: string;
  to: string;
  status: ArchitectureConnectionStatus;
  color: string;
  packetOffset: number;
  visible: boolean;
}

export const ARCHITECTURE_GRAPH = {
  nodes: [
    {
      id: "core",
      label: "Core Repository",
      kind: "core",
      status: "healthy",
      position: SCENE.nodePositions.core,
      size: SCENE.nodeSize.core,
      accent: "#00e5ff",
      glow: "#7ff8ff",
      emissiveIntensity: 0.8,
      visible: false,
    },
    {
      id: "frontend",
      label: "Frontend",
      kind: "module",
      status: "healthy",
      position: SCENE.nodePositions.frontend,
      size: SCENE.nodeSize.module,
      accent: "#00e5ff",
      glow: "#7ff8ff",
      emissiveIntensity: 0.4,
      visible: false,
    },
    {
      id: "apiGateway",
      label: "API Gateway",
      kind: "module",
      status: "healthy",
      position: SCENE.nodePositions.apiGateway,
      size: SCENE.nodeSize.module,
      accent: "#00e5ff",
      glow: "#7ff8ff",
      emissiveIntensity: 0.4,
      visible: false,
    },
    {
      id: "auth",
      label: "Authentication",
      kind: "module",
      status: "healthy",
      position: SCENE.nodePositions.auth,
      size: SCENE.nodeSize.module,
      accent: "#00e5ff",
      glow: "#7ff8ff",
      emissiveIntensity: 0.4,
      visible: false,
    },
    {
      id: "analytics",
      label: "Analytics",
      kind: "module",
      status: "healthy",
      position: SCENE.nodePositions.analytics,
      size: SCENE.nodeSize.module,
      accent: "#00e5ff",
      glow: "#7ff8ff",
      emissiveIntensity: 0.4,
      visible: false,
    },
    {
      id: "database",
      label: "Database",
      kind: "module",
      status: "healthy",
      position: SCENE.nodePositions.database,
      size: SCENE.nodeSize.module,
      accent: "#00e5ff",
      glow: "#7ff8ff",
      emissiveIntensity: 0.4,
      visible: false,
    },
    {
      id: "cicd",
      label: "CI/CD",
      kind: "module",
      status: "healthy",
      position: SCENE.nodePositions.cicd,
      size: SCENE.nodeSize.module,
      accent: "#00e5ff",
      glow: "#7ff8ff",
      emissiveIntensity: 0.4,
      visible: false,
    },
    {
      id: "ghostA",
      label: "Ghost_A",
      kind: "ghost",
      status: "ghost",
      position: SCENE.ghostPositions.ghostA,
      size: SCENE.nodeSize.ghost,
      accent: "#ff1744",
      glow: "#ff8fa3",
      emissiveIntensity: 1.2,
      visible: false,
    },
    {
      id: "ghostB",
      label: "Ghost_B",
      kind: "ghost",
      status: "ghost",
      position: SCENE.ghostPositions.ghostB,
      size: SCENE.nodeSize.ghost,
      accent: "#ff1744",
      glow: "#ff8fa3",
      emissiveIntensity: 1.2,
      visible: false,
    },
    {
      id: "ghostC",
      label: "Ghost_C",
      kind: "ghost",
      status: "ghost",
      position: SCENE.ghostPositions.ghostC,
      size: SCENE.nodeSize.ghost,
      accent: "#ff1744",
      glow: "#ff8fa3",
      emissiveIntensity: 1.2,
      visible: false,
    },
  ] as ArchitectureNodeDefinition[],
  connections: [
    {
      id: "core-frontend",
      from: "core",
      to: "frontend",
      status: "active",
      color: "#00e5ff",
      packetOffset: 0.02,
      visible: false,
    },
    {
      id: "core-gateway",
      from: "core",
      to: "apiGateway",
      status: "active",
      color: "#00e5ff",
      packetOffset: 0.18,
      visible: false,
    },
    {
      id: "core-auth",
      from: "core",
      to: "auth",
      status: "active",
      color: "#00e5ff",
      packetOffset: 0.32,
      visible: false,
    },
    {
      id: "core-analytics",
      from: "core",
      to: "analytics",
      status: "active",
      color: "#00e5ff",
      packetOffset: 0.46,
      visible: false,
    },
    {
      id: "core-database",
      from: "core",
      to: "database",
      status: "active",
      color: "#00e5ff",
      packetOffset: 0.6,
      visible: false,
    },
    {
      id: "core-cicd",
      from: "core",
      to: "cicd",
      status: "active",
      color: "#00e5ff",
      packetOffset: 0.74,
      visible: false,
    },
    {
      id: "ghostA-auth",
      from: "ghostA",
      to: "auth",
      status: "ghost",
      color: "#ff1744",
      packetOffset: 0.15,
      visible: false,
    },
    {
      id: "ghostB-core",
      from: "ghostB",
      to: "core",
      status: "ghost",
      color: "#ff1744",
      packetOffset: 0.38,
      visible: false,
    },
    {
      id: "ghostC-database",
      from: "ghostC",
      to: "database",
      status: "ghost",
      color: "#ff1744",
      packetOffset: 0.57,
      visible: false,
    },
  ] as ArchitectureConnectionDefinition[],
} as const;