import type { ReactNode } from "react";
import type * as THREE from "three";

export type NodeType =
  | "frontend"
  | "apiGateway"
  | "authentication"
  | "analytics"
  | "database"
  | "cicd"
  | "core"
  | "ghost";

export type NodeStatus =
  | "healthy"
  | "orphaned"
  | "broken"
  | "ghost";

export interface SceneNode {
  id: string;

  label: string;

  type: NodeType;

  status: NodeStatus;

  position: [number, number, number];

  size: [number, number, number];

  hovered?: boolean;

  selected?: boolean;

  opacity?: number;

  pulse?: number;
}

export interface SceneConnection {
  id: string;

  from: string;

  to: string;

  active: boolean;

  broken: boolean;

  glowing?: boolean;

  pulse?: number;

  strength?: number;
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