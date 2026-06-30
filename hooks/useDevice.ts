"use client";

import { useEffect, useState } from "react";
import { detectPerformanceTier } from "@/lib/performance";
import type { PerformanceTier } from "@/constants/performance";

export interface DeviceInfo {
  isMobile: boolean;

  isTablet: boolean;

  isDesktop: boolean;

  isTouchDevice: boolean;

  isLandscape: boolean;

  screenWidth: number;

  screenHeight: number;

  dpr: number;

  refreshRate: number;

  performanceTier: PerformanceTier;
}

const MOBILE = 768;
const TABLET = 1024;

export function useDevice(): DeviceInfo {
  const [device, setDevice] =
    useState<DeviceInfo>({
      isMobile: false,

      isTablet: false,

      isDesktop: true,

      isTouchDevice: false,

      isLandscape: true,

      screenWidth: 1440,

      screenHeight: 900,

      dpr: 1,

      refreshRate: 60,

      performanceTier: "medium",
    });

  useEffect(() => {
    function update() {
      const w =
        window.innerWidth;

      const h =
        window.innerHeight;

      const mobile =
        w < MOBILE;

      const tablet =
        w >= MOBILE &&
        w < TABLET;

      setDevice({
        isMobile: mobile,

        isTablet: tablet,

        isDesktop:
          !mobile &&
          !tablet,

        isTouchDevice:
          "ontouchstart" in
            window ||
          navigator.maxTouchPoints >
            0,

        isLandscape:
          w > h,

        screenWidth: w,

        screenHeight: h,

        dpr: Math.min(
          window.devicePixelRatio ??
            1,
          2,
        ),

        refreshRate: 60,

        performanceTier:
          detectPerformanceTier(),
      });
    }

    update();

    window.addEventListener(
      "resize",
      update,
      {
        passive: true,
      },
    );

    return () =>
      window.removeEventListener(
        "resize",
        update,
      );
  }, []);

  return device;
}