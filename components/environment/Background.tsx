"use client";

import { useEffect, useMemo } from "react";

import { useThree } from "@react-three/fiber";

import * as THREE from "three";

import { COLORS } from "@/constants/colors";

export function Background() {
  const { scene } = useThree();

  const backgroundColor = useMemo(
    () =>
      new THREE.Color(
        COLORS.background,
      ),
    [],
  );

  useEffect(() => {
    scene.background =
      backgroundColor;

    return () => {
      scene.background =
        null;
    };
  }, [
    scene,
    backgroundColor,
  ]);

  return (
    <>
      {/* Phase 3 */}
      {/* Gradient background */}

      {/* Phase 4 */}
      {/* HDR environment */}

      {/* Phase 5 */}
      {/* Volumetric atmosphere */}
    </>
  );
}