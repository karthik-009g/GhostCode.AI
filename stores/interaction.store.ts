import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type CursorState =
  | "default"
  | "hover"
  | "grab"
  | "pointer"
  | "crosshair";

export type InteractionMode =
  | "explore"
  | "inspect"
  | "locked";

export type Vec2 = [
  number,
  number,
];

export type Vec3 = [
  number,
  number,
  number,
];

export interface RaycastHit {
  nodeId: string;
  point: Vec3;
  distance: number;
  faceIndex:
    | number
    | null;
}

interface TooltipState {
  visible: boolean;
  nodeId:
    | string
    | null;
  position: Vec2;
}

interface PointerState {
  position: Vec2;
  down: boolean;
  dragging: boolean;
}

interface InteractionState {
  mode: InteractionMode;

  cursorState: CursorState;

  pointer: PointerState;

  raycastHits:
    RaycastHit[];

  hoveredNodeId:
    | string
    | null;

  selectedNodeId:
    | string
    | null;

  focusedNodeId:
    | string
    | null;

  dragThreshold:
    number;

  lastPointerDownTime:
    number;

  doubleClickThreshold:
    number;

  interactionLocked:
    boolean;

  hoverStartTime:
    number;

  tooltip:
    TooltipState;
}

interface InteractionActions {
  setMode(
    mode:
      InteractionMode,
  ): void;

  setCursorState(
    state:
      CursorState,
  ): void;

  setPointer(
    x: number,
    y: number,
  ): void;

  setPointerDown(
    down: boolean,
  ): void;

  setDragging(
    dragging: boolean,
  ): void;

  setRaycastHits(
    hits:
      RaycastHit[],
  ): void;

  setHoveredNode(
    id:
      | string
      | null,
  ): void;

  setSelectedNode(
    id:
      | string
      | null,
  ): void;

  setFocusedNode(
    id:
      | string
      | null,
  ): void;

  setInteractionLocked(
    locked: boolean,
  ): void;

  recordPointerDown():
    void;

  checkDoubleClick():
    boolean;

  showTooltip(
    nodeId: string,
    x: number,
    y: number,
  ): void;

  hideTooltip():
    void;

  reset(): void;
}

const initialState =
  {
    mode:
      "explore",

    cursorState:
      "default",

    pointer: {
      position: [
        0,
        0,
      ],
      down:
        false,
      dragging:
        false,
    },

    raycastHits:
      [],

    hoveredNodeId:
      null,

    selectedNodeId:
      null,

    focusedNodeId:
      null,

    dragThreshold:
      6,

    lastPointerDownTime:
      0,

    doubleClickThreshold:
      300,

    interactionLocked:
      false,

    hoverStartTime:
      0,

    tooltip: {
      visible:
        false,
      nodeId:
        null,
      position:
        [
          0,
          0,
        ],
    },
  } satisfies InteractionState;

export const useInteractionStore =
  create<
    InteractionState &
      InteractionActions
  >()(
    subscribeWithSelector(
      (
        set,
        get,
      ) => ({
        ...initialState,

        setMode:
          (
            mode,
          ) =>
            set({
              mode,
            }),

        setCursorState:
          (
            cursorState,
          ) =>
            set({
              cursorState,
            }),

        setPointer:
          (
            x,
            y,
          ) =>
            set(
              (
                s,
              ) => ({
                pointer:
                  {
                    ...s.pointer,
                    position:
                      [
                        x,
                        y,
                      ],
                  },
              }),
            ),

        setPointerDown:
          (
            down,
          ) =>
            set(
              (
                s,
              ) => ({
                pointer:
                  {
                    ...s.pointer,
                    down,
                  },
              }),
            ),

        setDragging:
          (
            dragging,
          ) =>
            set(
              (
                s,
              ) => ({
                pointer:
                  {
                    ...s.pointer,
                    dragging,
                  },
              }),
            ),

        setRaycastHits:
          (
            raycastHits,
          ) =>
            set({
              raycastHits,
            }),

        setHoveredNode:
          (
            hoveredNodeId,
          ) =>
            set({
              hoveredNodeId,
              cursorState:
                hoveredNodeId
                  ? "pointer"
                  : "default",
              hoverStartTime:
                Date.now(),
            }),

        setSelectedNode:
          (
            selectedNodeId,
          ) =>
            set({
              selectedNodeId,
            }),

        setFocusedNode:
          (
            focusedNodeId,
          ) =>
            set({
              focusedNodeId,
            }),

        setInteractionLocked:
          (
            interactionLocked,
          ) =>
            set({
              interactionLocked,
            }),

        recordPointerDown:
          () =>
            set({
              lastPointerDownTime:
                Date.now(),
            }),

        checkDoubleClick:
          () => {
            const s =
              get();

            return (
              Date.now() -
                s.lastPointerDownTime <
              s.doubleClickThreshold
            );
          },

        showTooltip:
          (
            nodeId,
            x,
            y,
          ) =>
            set({
              tooltip:
                {
                  visible:
                    true,
                  nodeId,
                  position:
                    [
                      x,
                      y,
                    ],
                },
            }),

        hideTooltip:
          () =>
            set(
              (
                s,
              ) => ({
                tooltip:
                  {
                    ...s.tooltip,
                    visible:
                      false,
                    nodeId:
                      null,
                  },
              }),
            ),

        reset:
          () =>
            set(
              initialState,
            ),
      }),
    ),
  );