"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

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
  const [
    hoveredNodeId,
    setHoveredNodeId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    selectedNodeId,
    setSelectedNodeId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    introComplete,
    setIntroComplete,
  ] = useState(false);

  const [
    scrollProgress,
    setScrollProgress,
  ] = useState(0);

  const [
    activeSection,
    setActiveSection,
  ] = useState(0);

  const setHoveredNode =
    useCallback(
      (
        id: string | null,
      ) =>
        setHoveredNodeId(
          id,
        ),
      [],
    );

  const setSelectedNode =
    useCallback(
      (
        id: string | null,
      ) =>
        setSelectedNodeId(
          id,
        ),
      [],
    );

  const value =
    useMemo(
      () => ({
        nodes: [],

        connections: [],

        hoveredNodeId,

        selectedNodeId,

        introComplete,

        scrollProgress,

        activeSection,

        setHoveredNode,

        setSelectedNode,

        setIntroComplete,

        setScrollProgress,

        setActiveSection,
      }),
      [
        hoveredNodeId,
        selectedNodeId,
        introComplete,
        scrollProgress,
        activeSection,
        setHoveredNode,
        setSelectedNode,
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