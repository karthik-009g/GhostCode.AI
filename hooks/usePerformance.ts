"use client";

import { useEffect, useRef, useState } from "react";

import {
  detectPerformanceTier,
  FPSTracker,
} from "@/lib/performance";

import type {
  PerformanceTier,
} from "@/constants/performance";

export interface PerformanceState {
  deviceTier: PerformanceTier;
  runtimeTier: PerformanceTier;
  fps: number;
  trend: "improving" | "stable" | "degrading";
  isLowEnd: boolean;
}

export function usePerformance(
  sampleMs = 3000,
): PerformanceState {
  const deviceTierRef =
    useRef<PerformanceTier>(
      detectPerformanceTier(),
    );

  const tracker =
    useRef(
      new FPSTracker(90),
    );

  const raf =
    useRef<number>();

  const lastSample =
    useRef(0);

  const mounted =
    useRef(true);

  const [state, setState] =
    useState<PerformanceState>({
      deviceTier:
        deviceTierRef.current,

      runtimeTier:
        deviceTierRef.current,

      fps: 60,

      trend: "stable",

      isLowEnd:
        deviceTierRef.current ===
        "low",
    });

  useEffect(() => {
    mounted.current = true;

    function loop() {
      tracker.current.tick();

      const now =
        performance.now();

      if (
        now -
          lastSample.current >=
        sampleMs
      ) {
        lastSample.current =
          now;

        const fps =
          Math.round(
            tracker.current.fps,
          );

        const runtimeTier =
          tracker.current.tier;

        const next: PerformanceState =
          {
            deviceTier:
              deviceTierRef.current,

            runtimeTier,

            fps,

            trend:
              tracker.current
                .trend,

            isLowEnd:
              deviceTierRef.current ===
                "low" ||
              runtimeTier ===
                "low",
          };

        if (mounted.current) {
          setState(
            (prev) => {
              if (
                prev.fps ===
                  next.fps &&
                prev.runtimeTier ===
                  next.runtimeTier &&
                prev.trend ===
                  next.trend
              ) {
                return prev;
              }

              return next;
            },
          );
        }
      }

      raf.current =
        requestAnimationFrame(
          loop,
        );
    }

    raf.current =
      requestAnimationFrame(
        loop,
      );

    return () => {
      mounted.current =
        false;

      if (
        raf.current !==
        undefined
      ) {
        cancelAnimationFrame(
          raf.current,
        );
      }
    };
  }, [sampleMs]);

  return state;
}