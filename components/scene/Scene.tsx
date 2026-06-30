"use client";

import {
  useState,
  Suspense,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";

import {
  SceneProvider,
} from "./SceneProvider";

import {
  CAMERA,
} from "@/constants/camera";

import {
  COLORS,
} from "@/constants/colors";

import {
  PERFORMANCE,
} from "@/constants/performance";

interface SceneProps {
  children: ReactNode;
}

export function Scene({
  children,
}: SceneProps) {
  const [dpr, setDpr] =
    useState<
      [number, number]
    >([
      PERFORMANCE.dpr.min,
      PERFORMANCE.dpr.max,
    ]);

  return (
    <SceneProvider>
      <div
        className="fixed inset-0"
        style={{
          background:
            COLORS.background,
        }}
      >
        <Canvas
          dpr={dpr}
          frameloop="always"
          shadows={
            PERFORMANCE
              .shadows
              .enabled
          }
          flat={false}
          linear={false}
          camera={{
            fov:
              CAMERA.fov,

            near:
              CAMERA.near,

            far:
              CAMERA.far,

            position: [
              CAMERA
                .position
                .x,
              CAMERA
                .position
                .y,
              CAMERA
                .position
                .z,
            ],
          }}
          gl={{
            antialias:
              true,

            alpha:
              false,

            stencil:
              false,

            depth:
              true,

            powerPreference:
              "high-performance",

            preserveDrawingBuffer:
              false,
          }}
        >
          <PerformanceMonitor
            onIncline={() =>
              setDpr([
                1,
                PERFORMANCE
                  .dpr
                  .max,
              ])
            }
            onDecline={() =>
              setDpr([
                PERFORMANCE
                  .dpr
                  .min,
                1,
              ])
            }
          />

          <AdaptiveDpr
            pixelated
          />

          <AdaptiveEvents />

          <Suspense
            fallback={
              null
            }
          >
            {children}
          </Suspense>
        </Canvas>
      </div>
    </SceneProvider>
  );
}