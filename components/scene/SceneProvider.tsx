"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { useSceneStore } from "@/stores/scene.store";

import type {
  SceneContextValue,
  SceneProviderProps,
} from "@/types/scene";

const SceneContext =
  createContext<SceneContextValue | null>(
    null,
  );

export function SceneProvider({
  children,
}: SceneProviderProps) {
  const nodes = useSceneStore(
    (state) => Object.values(state.nodes),
  );

  const connections = useSceneStore(
    (state) => Object.values(state.connections),
  );

  const hoveredNodeId = useSceneStore(
    (state) => state.hoveredNodeId,
  );

  const selectedNodeId = useSceneStore(
    (state) => state.selectedNodeId,
  );

  const introComplete = useSceneStore(
    (state) => state.sceneReady,
  );

  const scrollProgress = useSceneStore(
    (state) => state.revealProgress,
  );

  const corruptionLevel = useSceneStore(
    (state) => state.corruptionLevel,
  );

  const corruptedNodeIds = useSceneStore(
    (state) => state.corruptedNodeIds,
  );

  const corruptedConnectionIds = useSceneStore(
    (state) => state.corruptedConnectionIds,
  );

  const activeSection = 0;

  const setHoveredNode = useSceneStore(
    (state) => state.setHoveredNode,
  );

  const setSelectedNode = useSceneStore(
    (state) => state.setSelectedNode,
  );

  const setIntroComplete = useSceneStore(
    (state) => state.setSceneReady,
  );

  const setScrollProgress = useSceneStore(
    (state) => state.setRevealProgress,
  );

  const setActiveSection = useCallback(() => {}, []);

  const value =
    useMemo(
      () => ({
        nodes,

        connections,

        hoveredNodeId,

        selectedNodeId,

        introComplete,

        scrollProgress,

        activeSection,

        corruptionLevel,

        corruptedNodeIds,

        corruptedConnectionIds,

        setHoveredNode,

        setSelectedNode,

        setIntroComplete,

        setScrollProgress,

        setActiveSection,
      }),
      [
        nodes,
        connections,
        hoveredNodeId,
        selectedNodeId,
        introComplete,
        scrollProgress,
        activeSection,
        corruptionLevel,
        corruptedNodeIds,
        corruptedConnectionIds,
        setHoveredNode,
        setSelectedNode,
        setIntroComplete,
        setScrollProgress,
        setActiveSection,
      ],
    );

  return (
    <SceneContext.Provider
      value={value}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene():
  SceneContextValue {
  const context =
    useContext(
      SceneContext,
    );

  if (!context)
    throw new Error(
      "useScene must be used inside SceneProvider",
    );

  return context;
}
