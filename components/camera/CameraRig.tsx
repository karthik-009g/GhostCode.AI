"use client";

import { Director } from "@/components/cinematic/Director";
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
      <Director
        scrollProgress={
          scrollProgress
        }
      />

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