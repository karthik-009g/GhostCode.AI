"use client";

import { MainCamera } from "./MainCamera";
import { CameraController } from "./CameraController";

import type {
  CameraRigProps,
} from "@/types/camera";

export function CameraRig({
  scrollProgress = 0,
  enableIdleOrbit = true,
}: CameraRigProps) {
  return (
    <>
      {/* Primary cinematic camera */}
      <MainCamera />

      {/* Camera movement */}
      <CameraController
        scrollProgress={
          scrollProgress
        }
        enableIdleOrbit={
          enableIdleOrbit
        }
      />

      {/* Phase 3 */}
      {/* CameraShake */}

      {/* Phase 4 */}
      {/* CameraTransition */}

      {/* Phase 5 */}
      {/* CameraAttack */}
    </>
  );
}