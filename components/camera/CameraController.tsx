"use client";

import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

import { dampVector3 } from "@/lib/lerp";
import { CAMERA } from "@/constants/camera";
import { getCameraMotionPreset } from "@/components/animations/CameraAnimation";
import { useAnimationStore } from "@/stores/animation.store";
import { useCameraStore } from "@/stores/camera.store";

interface CameraControllerProps {
  scrollProgress: number;
  enableIdleOrbit: boolean;
}

export function CameraController({
  scrollProgress,
  enableIdleOrbit,
}: CameraControllerProps) {
  const { camera } =
    useThree();

  const activeShot = useCameraStore(
    (state) => state.activeShot,
  );

  const cameraMode = useCameraStore(
    (state) => state.mode,
  );

  const cameraLocked = useCameraStore(
    (state) => state.cameraLocked,
  );

  const enableMouseParallax = useCameraStore(
    (state) => state.enableMouseParallax,
  );

  const effects = useCameraStore(
    (state) => state.effects,
  );

  const introProgress = useAnimationStore(
    (state) => state.introProgress,
  );

  const globalTime = useAnimationStore(
    (state) => state.globalTime,
  );

  const targetPos =
    useRef(
      new THREE.Vector3(
        CAMERA.position.x,
        CAMERA.position.y,
        CAMERA.position.z,
      ),
    );

  const targetLook =
    useRef(
      new THREE.Vector3(
        CAMERA.target.x,
        CAMERA.target.y,
        CAMERA.target.z,
      ),
    );

  const currentLook =
    useRef(
      new THREE.Vector3(
        CAMERA.target.x,
        CAMERA.target.y,
        CAMERA.target.z,
      ),
    );
  const currentFov =
    useRef<number>(
      CAMERA.fov,
    );
  const tempVector =
    useRef(new THREE.Vector3());

  const shakeVector =
    useRef(new THREE.Vector3());

  useFrame(
    (state, delta) => {
      const t = state.clock.elapsedTime;
      const motion = getCameraMotionPreset(
        cameraMode,
        Boolean(activeShot),
      );
      const mouseX =
        enableMouseParallax
          ? state.pointer.x
          : 0;
      const mouseY =
        enableMouseParallax
          ? state.pointer.y
          : 0;

      const breathing =
        Math.sin(globalTime * motion.breathSpeed) * motion.breathAmplitude;
      const scrollOffset = THREE.MathUtils.clamp(
        scrollProgress,
        0,
        1,
      );

      if (activeShot) {
        targetPos.current.set(
          activeShot.position[0],
          activeShot.position[1],
          activeShot.position[2],
        );

        targetLook.current.set(
          activeShot.target[0],
          activeShot.target[1],
          activeShot.target[2],
        );

        tempVector.current.set(
          mouseX * motion.mousePositionX * 0.32,
          mouseY * motion.mousePositionY * 0.32,
          0,
        );

        targetPos.current.add(tempVector.current);
        targetLook.current.add(
          tempVector.current.multiplyScalar(motion.mouseLookX * 0.22),
        );
      } else {
        const eyeLevel =
          cameraLocked ? motion.eyeLevel - 0.04 : motion.eyeLevel;

        const baseZ = THREE.MathUtils.lerp(
          motion.baseZ + 2.4,
          motion.baseZ,
          THREE.MathUtils.clamp(introProgress, 0, 1),
        ) - scrollOffset * 0.65;

        targetPos.current.set(
          mouseX * motion.mousePositionX,
          eyeLevel + mouseY * motion.mousePositionY + breathing,
          baseZ + Math.abs(mouseX) * 0.35,
        );

        targetLook.current.set(
          mouseX * motion.mouseLookX,
          eyeLevel - 0.08 + mouseY * motion.mouseLookY,
          motion.lookZ - scrollOffset * 46,
        );

        if (enableIdleOrbit) {
          targetPos.current.x +=
            Math.sin(t * motion.idleOrbitSpeedX) * motion.idleOrbitX;
          targetPos.current.y +=
            Math.cos(t * motion.idleOrbitSpeedY) * motion.idleOrbitY;
        }
      }

      if (effects.ghostHijack) {
        targetPos.current.y +=
          Math.sin(t * 3.1) * motion.shakeY;
        targetLook.current.y +=
          Math.cos(t * 3.1) * motion.shakeY * 4;
      }

      dampVector3(
        camera.position,
        targetPos.current,
        activeShot?.damping ?? motion.positionDamping,
        delta,
      );

      dampVector3(
        currentLook.current,
        targetLook.current,
        activeShot?.damping ?? motion.lookDamping,
        delta,
      );

      shakeVector.current.set(
        0,
        0,
        0,
      );

      if (effects.ghostHijack) {
        shakeVector.current.x =
          Math.sin(t * 4.8) * motion.shakeX;
        shakeVector.current.y =
          Math.cos(t * 3.1) * motion.shakeY;
      }

      camera.rotation.z =
        mouseX * -motion.roll +
        Math.sin(t * 0.2) * 0.0025 +
        (effects.ghostHijack ? 0.02 : 0) +
        shakeVector.current.x;

      currentFov.current =
        THREE.MathUtils.lerp(
          currentFov.current,
          activeShot?.fov ??
            THREE.MathUtils.lerp(
              44,
              48,
              THREE.MathUtils.clamp(introProgress, 0, 1),
            ),
            1 - Math.exp(-motion.fovDamping * delta),
        );

      if (
        "fov" in camera
      ) {
        camera.fov =
          currentFov.current;
        camera.updateProjectionMatrix();
      }

      camera.lookAt(
        currentLook.current,
      );
    },
  );

  return null;
}
