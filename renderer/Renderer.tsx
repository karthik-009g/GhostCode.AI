"use client";

import {
  Canvas,
} from "@react-three/fiber";

import {
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";

import {
  useState,
  useCallback,
  type ReactNode,
} from "react";

import {
  CAMERA,
} from "@/constants/camera";

import {
  COLORS,
} from "@/constants/colors";

import {
  PERFORMANCE,
} from "@/constants/performance";

import {
  useAppStore,
} from "@/stores/app.store";

interface RendererProps {
  children: ReactNode;
}

export function Renderer({
  children,
}: RendererProps) {
  const setQualityTier =
    useAppStore(
      (s) =>
        s.setQualityTier,
    );

  const [dpr, setDpr] =
    useState<
      [number, number]
    >([
      PERFORMANCE.dpr.min,
      PERFORMANCE.dpr.max,
    ]);

  const handleIncline =
    useCallback(() => {
      setDpr([
        1,
        PERFORMANCE.dpr.max,
      ]);

      setQualityTier(
        "high",
      );
    }, [
      setQualityTier,
    ]);

  const handleDecline =
    useCallback(() => {
      setDpr([
        PERFORMANCE.dpr.min,
        1,
      ]);

      setQualityTier(
        "low",
      );
    }, [
      setQualityTier,
    ]);

  const eventProps =
    typeof document !==
    "undefined"
      ? {
          eventSource:
            document.documentElement,
          eventPrefix:
            "client" as const,
        }
      : {};

  return (
    <div
      className="
        fixed
        inset-0
        h-screen
        w-screen
      "
      style={{
        background:
          COLORS.background,
      }}
    >
      <Canvas
        dpr={dpr}
        frameloop="always"
        shadows={false}
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
              .position.x,
            CAMERA
              .position.y,
            CAMERA
              .position.z,
          ],
        }}
        gl={{
          antialias:
            true,
          alpha: false,
          stencil:
            false,
          depth: true,
          powerPreference:
            "high-performance",
          logarithmicDepthBuffer:
            false,
        }}
        {...eventProps}
      >
        <PerformanceMonitor
          flipflops={3}
          threshold={
            0.9
          }
          onIncline={
            handleIncline
          }
          onDecline={
            handleDecline
          }
        />

        <AdaptiveDpr
          pixelated
        />

        <AdaptiveEvents />

        {children}
      </Canvas>
    </div>
  );
}
