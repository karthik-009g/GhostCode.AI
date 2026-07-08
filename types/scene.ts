import type { ReactNode } from "react";
import type * as THREE from "three";

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

  kind: NodeType;

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

  color: string;

  pulseOffset: number;

  visible: boolean;
}

export interface SceneState {
  nodes: SceneNode[];

  connections: SceneConnection[];

  hoveredNodeId: string | null;

  selectedNodeId: string | null;

  introComplete: boolean;

  scrollProgress: number;

  activeSection: number;
}

export interface SceneContextValue extends SceneState {
  setHoveredNode: (
    id: string | null
  ) => void;

  setSelectedNode: (
    id: string | null
  ) => void;

  setIntroComplete: (
    v: boolean
  ) => void;

  setScrollProgress: (
    v: number
  ) => void;

  setActiveSection: (
    v: number
  ) => void;
}

export interface SceneProviderProps {
  children: ReactNode;
}

export interface ExperienceProps {
  scrollProgress?: number;
}

export interface BoundingBox {
  min: THREE.Vector3;

  max: THREE.Vector3;

  center: THREE.Vector3;
}