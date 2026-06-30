import * as THREE from "three";

export type InteractionEventType =
  | "hover-enter"
  | "hover-leave"
  | "hover-change"
  | "select"
  | "deselect"
  | "double-click"
  | "scroll"
  | "camera"
  | "lock"
  | "unlock";

export interface BaseInteractionEvent {
  type: InteractionEventType;
  timestamp: number;
}

export interface HoverEvent
  extends BaseInteractionEvent {
  type:
    | "hover-enter"
    | "hover-leave"
    | "hover-change";

  nodeId: string | null;

  point?: THREE.Vector3;

  distance?: number;
}

export interface SelectionEvent
  extends BaseInteractionEvent {
  type:
    | "select"
    | "deselect"
    | "double-click";

  nodeId: string | null;

  point?: THREE.Vector3;
}

export interface ScrollEvent
  extends BaseInteractionEvent {
  type: "scroll";

  progress: number;

  velocity: number;

  direction:
    | "up"
    | "down"
    | "idle";
}

export interface CameraEvent
  extends BaseInteractionEvent {
  type: "camera";

  position: [
    number,
    number,
    number,
  ];

  target: [
    number,
    number,
    number,
  ];
}

export interface LockEvent
  extends BaseInteractionEvent {
  type:
    | "lock"
    | "unlock";

  reason: string;
}

export type InteractionEvent =
  | HoverEvent
  | SelectionEvent
  | ScrollEvent
  | CameraEvent
  | LockEvent;